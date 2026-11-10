import { NextRequest, NextResponse } from "next/server";

const GHL_ORIGIN = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";

type JsonRecord = Record<string, unknown>;

type NormalizedAccount = {
  id: string;
  name: string;
  platform: string;
  avatar: string | null;
};

function getToken(request: NextRequest) {
  return request.headers.get("x-ghl-token")?.trim() || "";
}

function validLocationId(value: string) {
  return /^[A-Za-z0-9_-]{5,80}$/.test(value);
}

function validUserId(value: string) {
  return /^[A-Za-z0-9]{20,24}$/.test(value);
}

function firstString(...values: unknown[]) {
  return values.find((value): value is string => typeof value === "string" && value.trim().length > 0)?.trim() || "";
}

function platformFrom(value: string, id: string) {
  const source = `${value} ${id}`.toLowerCase();
  if (source.includes("instagram")) return "instagram";
  if (source.includes("facebook") || /(^|[_-])fb([_-]|$)/.test(source)) return "facebook";
  if (source.includes("linkedin")) return "linkedin";
  if (source.includes("tiktok")) return "tiktok";
  if (source.includes("pinterest")) return "pinterest";
  if (source.includes("youtube")) return "youtube";
  if (source.includes("google")) return "google";
  if (source.includes("twitter") || source === "x") return "x";
  return value.toLowerCase().replace(/\s+/g, "-") || "unknown";
}

function normalizeAccounts(payload: unknown) {
  const candidates: JsonRecord[] = [];
  const seenObjects = new WeakSet<object>();

  const visit = (value: unknown, depth: number) => {
    if (depth > 6 || value === null || typeof value !== "object") return;
    if (seenObjects.has(value)) return;
    seenObjects.add(value);

    if (Array.isArray(value)) {
      value.forEach((item) => visit(item, depth + 1));
      return;
    }

    const record = value as JsonRecord;
    const id = firstString(record._id, record.id, record.accountId, record.socialAccountId);
    const platformValue = firstString(record.platform, record.provider, record.channel, record.accountType, record.type);
    if (id && platformValue) candidates.push(record);
    Object.values(record).forEach((item) => visit(item, depth + 1));
  };

  const root = payload && typeof payload === "object" ? payload as JsonRecord : {};
  const results = root.results && typeof root.results === "object" ? root.results as JsonRecord : {};
  if (Array.isArray(results.accounts)) visit(results.accounts, 0);
  else visit(payload, 0);

  const accounts = candidates.map<NormalizedAccount>((record) => {
    const id = firstString(record._id, record.id, record.accountId, record.socialAccountId);
    const platformValue = firstString(record.platform, record.provider, record.channel, record.accountType, record.type);
    return {
      id,
      platform: platformFrom(platformValue, id),
      name: firstString(
        record.name,
        record.accountName,
        record.pageName,
        record.username,
        record.displayName,
        `${platformFrom(platformValue, id)} · ${id.slice(-6)}`,
      ),
      avatar: firstString(record.avatar, record.avatarUrl, record.profilePicture, record.picture, record.imageUrl) || null,
    };
  });

  return Array.from(new Map(accounts.map((account) => [account.id, account])).values());
}

async function parseResponse(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { message: text.slice(0, 1200) };
  }
}

function errorMessage(status: number, payload: unknown) {
  const record = payload && typeof payload === "object" ? payload as JsonRecord : {};
  const details = firstString(record.message, record.error, record.msg);
  const messages: string[] = [];
  const seen = new WeakSet<object>();
  const visit = (value: unknown, depth: number, relevant: boolean) => {
    if (depth > 6 || value === null || value === undefined) return;
    if (typeof value === "string") {
      const message = value.trim();
      if (relevant && message && !messages.includes(message)) messages.push(message);
      return;
    }
    if (typeof value !== "object" || seen.has(value)) return;
    seen.add(value);
    if (Array.isArray(value)) {
      value.forEach((item) => visit(item, depth + 1, relevant));
      return;
    }
    Object.entries(value as JsonRecord).forEach(([key, item]) => {
      const isErrorField = /^(message|error|errors|msg|reason|detail|details|issues)$/i.test(key);
      visit(item, depth + 1, relevant || isErrorField);
    });
  };
  visit(payload, 0, false);
  const specific = messages.find((message) => !/^unprocessable[ _-]?entity$/i.test(message));
  if (status === 401) return "التوكن غير صالح أو لا يخص هذا الـ Location.";
  if (status === 403) return "التوكن لا يملك الصلاحيات المطلوبة للنشر أو قراءة الحسابات.";
  if (status === 404) return "لم يعثر GHL على الـ Location أو المورد المطلوب.";
  if (status === 422) return specific || "رفض GHL بيانات المنشور. تأكد من User ID والحسابات المختارة ثم أعد المحاولة.";
  if (status === 429) return "تم تجاوز حد الطلبات في GHL. انتظر قليلًا ثم أعد المحاولة.";
  return specific || details || `تعذر تنفيذ الطلب في GHL (${status}).`;
}

function ghlHeaders(token: string, json = false) {
  return {
    Authorization: `Bearer ${token}`,
    Version: GHL_VERSION,
    ...(json ? { "Content-Type": "application/json" } : {}),
  };
}

async function getHandler(request: NextRequest) {
  const resource = request.nextUrl.searchParams.get("resource");
  const locationId = request.nextUrl.searchParams.get("locationId")?.trim() || "";
  const token = getToken(request);

  if (resource !== "accounts" && resource !== "post") return NextResponse.json({ error: "مورد غير مدعوم." }, { status: 404 });
  if (!token) return NextResponse.json({ error: "أدخل Private Integration Token." }, { status: 400 });
  if (!validLocationId(locationId)) return NextResponse.json({ error: "Location ID غير صالح." }, { status: 400 });

  if(resource === 'post') {
    const postId=request.nextUrl.searchParams.get('postId')||'';
    if(!/^[A-Za-z0-9_-]{5,120}$/.test(postId))return NextResponse.json({error:'معرف المنشور غير صالح.'},{status:400});
    const response=await fetch(`${GHL_ORIGIN}/social-media-posting/${locationId}/posts/${encodeURIComponent(postId)}`,{headers:{...ghlHeaders(token),Version:'v3'},cache:'no-store'});
    const payload=await parseResponse(response);
    if(!response.ok)return NextResponse.json({error:errorMessage(response.status,payload)},{status:response.status});
    return NextResponse.json({result:payload});
  }
  const response = await fetch(`${GHL_ORIGIN}/social-media-posting/${locationId}/accounts`, {
    headers: ghlHeaders(token),
    cache: "no-store",
  });
  const payload = await parseResponse(response);
  if (!response.ok) {
    return NextResponse.json({ error: errorMessage(response.status, payload), status: response.status }, { status: response.status });
  }

  return NextResponse.json({ accounts: normalizeAccounts(payload) });
}

async function postHandler(request: NextRequest) {
  const resource = request.nextUrl.searchParams.get("resource");
  const token = getToken(request);
  if (!token) return NextResponse.json({ error: "أدخل Private Integration Token." }, { status: 400 });

  if (resource === "media") {
    const incoming = await request.formData();
    const file = incoming.get("file");
    const name = firstString(incoming.get("name"));
    if (!(file instanceof File)) return NextResponse.json({ error: "ملف الصورة غير موجود." }, { status: 400 });
    if (file.type !== "image/png") return NextResponse.json({ error: "صيغة الصورة يجب أن تكون PNG." }, { status: 400 });

    const form = new FormData();
    form.append("file", file, name || file.name || "carousel.png");
    form.append("name", name || file.name || "carousel.png");
    const response = await fetch(`${GHL_ORIGIN}/medias/upload-file`, {
      method: "POST",
      headers: ghlHeaders(token),
      body: form,
    });
    const payload = await parseResponse(response);
    if (!response.ok) {
      return NextResponse.json({ error: errorMessage(response.status, payload), status: response.status }, { status: response.status });
    }

    const record = payload && typeof payload === "object" ? payload as JsonRecord : {};
    const data = record.data && typeof record.data === "object" ? record.data as JsonRecord : {};
    const url = firstString(record.url, record.fileUrl, data.url, data.fileUrl);
    if (!url) return NextResponse.json({ error: "رفع GHL الصورة لكنه لم يُرجع رابطًا صالحًا." }, { status: 502 });
    return NextResponse.json({ url });
  }

  if (resource === "post") {
    const body = await request.json() as JsonRecord;
    const locationId = firstString(body.locationId);
    const accountIds = Array.isArray(body.accountIds) ? body.accountIds.filter((item): item is string => typeof item === "string" && item.length > 0) : [];
    const rawMedia = Array.isArray(body.media) ? body.media : [];
    const media = rawMedia.flatMap((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return [];
      const url = firstString((item as JsonRecord).url);
      return url ? [{ url, type: "image/png" }] : [];
    });
    const status = firstString(body.status) || "draft";
    if (!validLocationId(locationId)) return NextResponse.json({ error: "Location ID غير صالح." }, { status: 400 });
    if (!accountIds.length) return NextResponse.json({ error: "اختر حسابًا واحدًا على الأقل." }, { status: 400 });
    if (!media.length) return NextResponse.json({ error: "لا توجد صور لإرسالها." }, { status: 400 });
    if (!["draft", "scheduled", "published"].includes(status)) return NextResponse.json({ error: "حالة المنشور غير صالحة." }, { status: 400 });

    const userId = firstString(body.userId);
    if (!validUserId(userId)) return NextResponse.json({ error: "تعذر تحديد مستخدم GHL المخصص للنشر." }, { status: 500 });
    if (status === "scheduled" && (typeof body.scheduleDate !== "string" || !Number.isFinite(Date.parse(body.scheduleDate)) || Date.parse(body.scheduleDate) <= Date.now())) return NextResponse.json({error:"اختر موعدًا مستقبليًا صالحًا."},{status:400});
    const postBody: JsonRecord = {
      accountIds,
      type: body.type === "story" ? "story" : "post",
      userId,
      createdBy: userId,
      status,
      summary: firstString(body.summary),
      media,
    };
    if (status === "scheduled" && typeof body.scheduleDate === "string") postBody.scheduleDate = body.scheduleDate;

    const response = await fetch(`${GHL_ORIGIN}/social-media-posting/${locationId}/posts`, {
      method: "POST",
      headers: ghlHeaders(token, true),
      body: JSON.stringify(postBody),
    });
    const payload = await parseResponse(response);
    if (!response.ok) {
      return NextResponse.json({ error: errorMessage(response.status, payload), status: response.status }, { status: response.status });
    }
    if(payload && typeof payload==='object' && (payload as JsonRecord).success===false)return NextResponse.json({error:errorMessage(422,payload)},{status:422});
    return NextResponse.json({ ok: true, result: payload });
  }

  return NextResponse.json({ error: "مورد غير مدعوم." }, { status: 404 });
}

export async function GET(request: NextRequest){try{return await getHandler(request)}catch{return NextResponse.json({error:"تعذر وصول الخادم إلى GHL. أعد المحاولة؛ الاتصال يمر عبر الخادم لتفادي CORS."},{status:502})}}
export async function POST(request: NextRequest){const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return NextResponse.json({error:'طلب غير مصرح'},{status:403});try{return await postHandler(request)}catch{return NextResponse.json({error:"تعذر الاتصال بـ GHL أو قراءة البيانات. أعد المحاولة."},{status:502})}}
