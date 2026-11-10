"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import {
  AlertCircle,
  BriefcaseBusiness,
  Camera,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  ImageIcon,
  LoaderCircle,
  Palette,
  RefreshCw,
  Save,
  Send,
  Settings2,
  Sparkles,
  Type,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type PublishStatus = "draft" | "scheduled" | "published";
type SupportedPlatform = "instagram" | "facebook" | "linkedin";

type SocialAccount = {
  id: string;
  name: string;
  platform: string;
  avatar: string | null;
};

type ModelContextLike = {
  registerTool: (
    tool: {
      name: string;
      title: string;
      description: string;
      inputSchema: Record<string, unknown>;
      annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean };
      execute: (input: unknown) => unknown | Promise<unknown>;
    },
    options?: { signal?: AbortSignal },
  ) => void | Promise<void>;
};

type Slide = {
  id: number;
  kicker: string;
  title: string;
  body: string;
  background: string;
  accent: string;
  textColor: string;
  titleSize: number;
  bodySize: number;
  image: string | null;
  imageX: number;
  imageY: number;
  imageScale: number;
  imageOpacity: number;
  layout: "plain" | "photo" | "cta";
};

const brand = {
  navy: "#10213F",
  orange: "#E8610A",
  teal: "#0E8F86",
  cream: "#F7F4EE",
  white: "#FFFFFF",
};

const photoLibrary = [
  { src: "/photos/mehdi-office.png", label: "المكتب" },
  { src: "/photos/mehdi-orange.png", label: "الخلفية البرتقالية" },
  { src: "/photos/mehdi-seated-casual.png", label: "جلسة كاجوال" },
  { src: "/photos/mehdi-seated-suit.png", label: "جلسة رسمية" },
];

const platformOptions: Array<{
  id: SupportedPlatform;
  label: string;
  Icon: typeof Camera;
}> = [
  { id: "instagram", label: "Instagram", Icon: Camera },
  { id: "facebook", label: "Facebook", Icon: Users },
  { id: "linkedin", label: "LinkedIn", Icon: BriefcaseBusiness },
];

const supportedPlatforms = new Set<SupportedPlatform>(platformOptions.map((platform) => platform.id));

export const initialSlides: Slide[] = [
  {
    id: 1,
    kicker: "تحويل الخبرة إلى مشروع",
    title: "عندك خبرة…\nلكن هل عندك مشروع؟",
    body: "الفرق ليس في عدد سنوات خبرتك، بل في وجود نظام يحوّل ما تعرفه إلى نتيجة يشتريها الناس.",
    background: brand.navy,
    accent: brand.orange,
    textColor: brand.white,
    titleSize: 92,
    bodySize: 38,
    image: "/photos/mehdi-office.png",
    imageX: -90,
    imageY: 0,
    imageScale: 1.08,
    imageOpacity: 0.72,
    layout: "photo",
  },
  {
    id: 2,
    kicker: "الحقيقة الأولى",
    title: "الخبرة وحدها\nلا تُباع",
    body: "الناس لا تدفع مقابل المعلومات الموجودة في رأسك.\nهي تدفع مقابل نتيجة واضحة تساعدها على الوصول إليها.",
    background: "#F7F4EE",
    accent: brand.orange,
    textColor: brand.navy,
    titleSize: 92,
    bodySize: 44,
    image: null,
    imageX: 0,
    imageY: 0,
    imageScale: 1,
    imageOpacity: 1,
    layout: "plain",
  },
  {
    id: 3,
    kicker: "بيع الوقت ليس مشروعًا",
    title: "إذا توقفتَ…\nيتوقف الدخل",
    body: "عندما تبدأ كل عميل من الصفر، وتشرح كل شيء يدويًا، وتتابع عبر رسائل مبعثرة… فأنت تبيع وقتك فقط.",
    background: "#0D2A48",
    accent: "#35B7A9",
    textColor: brand.white,
    titleSize: 88,
    bodySize: 42,
    image: null,
    imageX: 0,
    imageY: 0,
    imageScale: 1,
    imageOpacity: 1,
    layout: "plain",
  },
  {
    id: 4,
    kicker: "نقطة البداية",
    title: "المشروع يبدأ\nبـ 4 قرارات",
    body: "01 شخص محدد\n02 مشكلة واضحة\n03 نتيجة مطلوبة\n04 طريقة توصله إليها",
    background: "#F7F4EE",
    accent: brand.teal,
    textColor: brand.navy,
    titleSize: 82,
    bodySize: 45,
    image: null,
    imageX: 0,
    imageY: 0,
    imageScale: 1,
    imageOpacity: 1,
    layout: "plain",
  },
  {
    id: 5,
    kicker: "بعد تحديد الفكرة",
    title: "حوّل خبرتك\nإلى عرض واضح",
    body: "وعد مفهوم + خطوات محددة + دعم مناسب + سعر يعكس قيمة النتيجة.\nهنا يتوقف العميل عن مقارنة عدد الساعات ويبدأ في رؤية التحوّل.",
    background: brand.orange,
    accent: "#FFD29A",
    textColor: brand.white,
    titleSize: 86,
    bodySize: 40,
    image: null,
    imageX: 0,
    imageY: 0,
    imageScale: 1,
    imageOpacity: 1,
    layout: "plain",
  },
  {
    id: 6,
    kicker: "العرض وحده لا يكفي",
    title: "ثم تبني\nنظام البيع",
    body: "محتوى يجذب ← صفحة تسجّل ← متابعة تبني الثقة ← دفع ← تسليم منظم",
    background: brand.navy,
    accent: brand.orange,
    textColor: brand.white,
    titleSize: 90,
    bodySize: 44,
    image: null,
    imageX: 0,
    imageY: 0,
    imageScale: 1,
    imageOpacity: 1,
    layout: "plain",
  },
  {
    id: 7,
    kicker: "بدون نظام",
    title: "كل يوم تبدأ\nمن جديد",
    body: "تنشر لتبحث عن عميل.\nتشرح العرض من البداية.\nتلاحق الردود يدويًا.\nثم تتساءل: لماذا لا يستقر الدخل؟",
    background: "#F7F4EE",
    accent: brand.orange,
    textColor: brand.navy,
    titleSize: 84,
    bodySize: 42,
    image: null,
    imageX: 0,
    imageY: 0,
    imageScale: 1,
    imageOpacity: 1,
    layout: "plain",
  },
  {
    id: 8,
    kicker: "مع النظام",
    title: "كل خطوة تقود\nإلى التالية",
    body: "المهتم يعرف أين يذهب.\nالمتابعة تحدث في وقتها.\nالدفع والتسليم منظمان.\nوأنت تعرف أين تحتاج أن تحسّن.",
    background: "#0E8F86",
    accent: "#F8C26A",
    textColor: brand.white,
    titleSize: 84,
    bodySize: 42,
    image: null,
    imageX: 0,
    imageY: 0,
    imageScale: 1,
    imageOpacity: 1,
    layout: "plain",
  },
  {
    id: 9,
    kicker: "شخّص مرحلتك",
    title: "أين أنت الآن؟",
    body: "01 عندي خبرة فقط\n02 عندي فكرة\n03 عندي عرض\n04 عندي نظام بيع",
    background: "#F7F4EE",
    accent: brand.orange,
    textColor: brand.navy,
    titleSize: 90,
    bodySize: 46,
    image: null,
    imageX: 0,
    imageY: 0,
    imageScale: 1,
    imageOpacity: 1,
    layout: "plain",
  },
  {
    id: 10,
    kicker: "تدريب مجاني",
    title: "حوّل خبرتك\nإلى مشروع حقيقي",
    body: "ادخل إلى الرابط في البايو وسجّل مجانًا في «مخطط بيع الخبرة أون لاين».",
    background: brand.navy,
    accent: brand.orange,
    textColor: brand.white,
    titleSize: 82,
    bodySize: 42,
    image: "/photos/mehdi-orange.png",
    imageX: -110,
    imageY: 100,
    imageScale: 0.95,
    imageOpacity: 0.68,
    layout: "cta",
  },
];

function SlideCanvas({
  slide,
  canvasRef,
  scale,
  editable,
  onTextChange,
  onImageDrag,
}: {
  slide: Slide;
  canvasRef?: (node: HTMLDivElement | null) => void;
  scale: number;
  editable?: boolean;
  onTextChange?: (field: "kicker" | "title" | "body", value: string) => void;
  onImageDrag?: (x: number, y: number) => void;
}) {
  const dragStart = useRef<{ x: number; y: number; imageX: number; imageY: number } | null>(null);

  const startDrag = (event: React.PointerEvent) => {
    if (!editable || !slide.image || !onImageDrag) return;
    event.preventDefault();
    dragStart.current = { x: event.clientX, y: event.clientY, imageX: slide.imageX, imageY: slide.imageY };
    const move = (moveEvent: PointerEvent) => {
      if (!dragStart.current) return;
      onImageDrag(
        dragStart.current.imageX + (moveEvent.clientX - dragStart.current.x) / scale,
        dragStart.current.imageY + (moveEvent.clientY - dragStart.current.y) / scale,
      );
    };
    const end = () => {
      dragStart.current = null;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
  };

  return (
    <div className="slide-stage" style={{ width: 1080 * scale, height: 1350 * scale }}>
      <div
        ref={canvasRef}
        data-slide-export="true"
        className="slide-canvas"
        dir="rtl"
        style={{
          width: 1080,
          height: 1350,
          background: slide.background,
          color: slide.textColor,
          transform: `scale(${scale})`,
        }}
      >
        {slide.image && (
          <img
            src={slide.image}
            alt="صورة اسم المستخدم"
            draggable={false}
            onPointerDown={startDrag}
            className={editable ? "slide-photo cursor-grab active:cursor-grabbing" : "slide-photo"}
            style={{
              transform: `translate(${slide.imageX}px, ${slide.imageY}px) scale(${slide.imageScale})`,
              opacity: slide.imageOpacity,
            }}
          />
        )}
        {slide.image && <div className="slide-photo-overlay" />}
        <div className="slide-grid-mark slide-grid-mark-one" />
        <div className="slide-grid-mark slide-grid-mark-two" />

        <div className="slide-topline">
          <span className="slide-series">CASH FROM SKILL</span>
          <span className="slide-count">{String(slide.id).padStart(2, "0")} / 10</span>
        </div>

        <div className={`slide-copy slide-copy-${slide.layout}`}>
          <div
            contentEditable={editable}
            suppressContentEditableWarning
            onBlur={(e) => onTextChange?.("kicker", e.currentTarget.innerText)}
            className="slide-kicker"
            style={{ color: slide.accent }}
          >
            {slide.kicker}
          </div>
          <div
            contentEditable={editable}
            suppressContentEditableWarning
            onBlur={(e) => onTextChange?.("title", e.currentTarget.innerText)}
            className="slide-title"
            style={{ fontSize: slide.titleSize }}
          >
            {slide.title}
          </div>
          <div className="slide-rule" style={{ background: slide.accent }} />
          <div
            contentEditable={editable}
            suppressContentEditableWarning
            onBlur={(e) => onTextChange?.("body", e.currentTarget.innerText)}
            className="slide-body"
            style={{ fontSize: slide.bodySize }}
          >
            {slide.body}
          </div>
          {slide.layout === "cta" && (
            <div className="slide-cta" style={{ background: slide.accent }}>
              الرابط في البايو ←
            </div>
          )}
        </div>

        <div className="slide-footer">
          <span>اسم المستخدم</span>
          <span className="slide-dot" style={{ background: slide.accent }} />
          <span>حوّل خبرتك إلى نظام يبيع</span>
        </div>
      </div>
    </div>
  );
}

function dataURLtoBlob(dataUrl: string) {
  const bytes = atob(dataUrl.split(",")[1]);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i += 1) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: "image/png" });
}

export default function Home() {
  const [slides, setSlides] = useState(initialSlides);
  const [activeIndex, setActiveIndex] = useState(0);
  const [busy, setBusy] = useState<"zip" | "accounts" | "ghl" | null>(null);
  const [progress, setProgress] = useState("جاهز للتحرير");
  const [locationId, setLocationId] = useState("");
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [accountsLoaded, setAccountsLoaded] = useState(false);
  const [token, setToken] = useState("");
  const [userId,setUserId]=useState("");
  const [caption, setCaption] = useState("عندك خبرة… لكن هل عندك مشروع؟\n\nاكتشف النظام الكامل لتحويل خبرتك إلى مشروع تدريبي أونلاين.\n\nسجّل مجانًا من الرابط في البايو.");
  const [publishStatus, setPublishStatus] = useState<PublishStatus>("draft");
  const [scheduleDate, setScheduleDate] = useState("");
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const uploadedMediaCache = useRef<{ signature: string; urls: string[] } | null>(null);
  const activeSlide = slides[activeIndex];
  const stageScale = 0.39;

  useEffect(() => {
    try {
      const savedContent = JSON.parse(localStorage.getItem("cfs_carousel_content") || "null") as
        | Array<Pick<Slide, "id" | "kicker" | "title" | "body">>
        | null;
      if (savedContent) {
        setSlides((current) =>
          current.map((slide) => ({ ...slide, ...(savedContent.find((item) => item.id === slide.id) || {}) })),
        );
      }
      setLocationId(localStorage.getItem("cfs_ghl_location") || "");
      const savedAccounts = localStorage.getItem("cfs_ghl_selected_accounts") || localStorage.getItem("cfs_ghl_accounts") || "";
      setSelectedAccountIds(savedAccounts.split(/[\n,]/).map((value) => value.trim()).filter(Boolean));
    } catch {
      setProgress("بدأنا بنسخة جديدة");
    }
  }, []);

  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContextLike }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = (tool: Parameters<ModelContextLike["registerTool"]>[0]) => {
      void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => undefined);
    };

    register({
      name: "open_carousel_slide",
      title: "فتح شريحة",
      description: "يفتح شريحة محددة في محرر الكاروسيل باستخدام رقم من 1 إلى 10.",
      inputSchema: {
        type: "object",
        properties: { slideNumber: { type: "integer", minimum: 1, maximum: 10 } },
        required: ["slideNumber"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        const slideNumber = Number((input as { slideNumber?: number }).slideNumber);
        if (!Number.isInteger(slideNumber) || slideNumber < 1 || slideNumber > slides.length) {
          throw new Error("slideNumber must be between 1 and 10");
        }
        setActiveIndex(slideNumber - 1);
        return { activeSlide: slideNumber };
      },
    });

    register({
      name: "update_active_slide_content",
      title: "تعديل محتوى الشريحة",
      description: "يحدّث العبارة التمهيدية أو العنوان أو النص في الشريحة المفتوحة.",
      inputSchema: {
        type: "object",
        properties: {
          kicker: { type: "string" },
          title: { type: "string" },
          body: { type: "string" },
        },
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        const values = input as { kicker?: string; title?: string; body?: string };
        const patch: Partial<Slide> = {};
        if (typeof values.kicker === "string") patch.kicker = values.kicker;
        if (typeof values.title === "string") patch.title = values.title;
        if (typeof values.body === "string") patch.body = values.body;
        if (Object.keys(patch).length === 0) throw new Error("Provide at least one content field");
        setSlides((current) => current.map((slide, index) => (index === activeIndex ? { ...slide, ...patch } : slide)));
        return { updatedSlide: activeIndex + 1, fields: Object.keys(patch) };
      },
    });

    register({
      name: "set_active_slide_colors",
      title: "تعديل ألوان الشريحة",
      description: "يغيّر لون الخلفية ولون التمييز للشريحة المفتوحة بقيم HEX.",
      inputSchema: {
        type: "object",
        properties: {
          background: { type: "string", pattern: "^#[0-9A-Fa-f]{6}$" },
          accent: { type: "string", pattern: "^#[0-9A-Fa-f]{6}$" },
        },
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        const values = input as { background?: string; accent?: string };
        const hex = /^#[0-9A-Fa-f]{6}$/;
        if (values.background && !hex.test(values.background)) throw new Error("Invalid background HEX color");
        if (values.accent && !hex.test(values.accent)) throw new Error("Invalid accent HEX color");
        if (!values.background && !values.accent) throw new Error("Provide a background or accent color");
        setSlides((current) => current.map((slide, index) => (
          index === activeIndex ? { ...slide, ...values } : slide
        )));
        return { updatedSlide: activeIndex + 1, colors: values };
      },
    });

    return () => lifecycle.abort();
  }, [activeIndex, slides.length]);

  const updateSlide = (patch: Partial<Slide>) => {
    setSlides((current) => current.map((slide, index) => (index === activeIndex ? { ...slide, ...patch } : slide)));
  };

  const saveContent = () => {
    localStorage.setItem(
      "cfs_carousel_content",
      JSON.stringify(slides.map(({ id, kicker, title, body }) => ({ id, kicker, title, body }))),
    );
    setProgress("تم حفظ تعديلات المحتوى على هذا الجهاز");
  };

  const saveGhlSettings = () => {
    localStorage.setItem("cfs_ghl_location", locationId.trim());
    localStorage.setItem("cfs_ghl_selected_accounts", selectedAccountIds.join("\n"));
    setProgress("تم حفظ Location ID والحسابات المختارة — التوكن لم يُحفظ");
  };

  const apiError = async (response: Response) => {
    const data = await response.json().catch(() => null) as { error?: string } | null;
    return data?.error || `تعذر إكمال الطلب (${response.status})`;
  };

  const loadAccounts = async () => {
    if (!token.trim() || !locationId.trim()) {
      setProgress("أدخل التوكن وLocation ID ثم اضغط جلب الحسابات");
      return;
    }
    setBusy("accounts");
    setProgress("جاري التحقق من الاتصال وجلب حسابات Social Planner…");
    try {
      const response = await fetch(`/api/ghl?resource=accounts&locationId=${encodeURIComponent(locationId.trim())}`, {
        headers: { "x-ghl-token": token.trim() },
        cache: "no-store",
      });
      if (!response.ok) throw new Error(await apiError(response));
      const data = await response.json() as { accounts?: SocialAccount[] };
      const fetched = Array.isArray(data.accounts) ? data.accounts : [];
      setAccounts(fetched);
      setAccountsLoaded(true);
      const availableIds = new Set(fetched.map((account) => account.id));
      setSelectedAccountIds((current) => current.filter((id) => availableIds.has(id)));
      const compatibleCount = fetched.filter((account) => supportedPlatforms.has(account.platform as SupportedPlatform)).length;
      setProgress(
        compatibleCount
          ? `تم الاتصال بـ GHL — عثرنا على ${compatibleCount} حساب صالح للكاروسيل`
          : "تم الاتصال، لكن لم نجد حسابات Facebook أو Instagram أو LinkedIn متصلة",
      );
    } catch (error) {
      setAccounts([]);
      setAccountsLoaded(false);
      setProgress(error instanceof Error ? error.message : "تعذر جلب حسابات GHL");
    } finally {
      setBusy(null);
    }
  };

  const toggleAccount = (id: string) => {
    setSelectedAccountIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const togglePlatform = (platform: SupportedPlatform) => {
    const ids = accounts.filter((account) => account.platform === platform).map((account) => account.id);
    setSelectedAccountIds((current) => {
      const allSelected = ids.length > 0 && ids.every((id) => current.includes(id));
      return allSelected
        ? current.filter((id) => !ids.includes(id))
        : Array.from(new Set([...current, ...ids]));
    });
  };

  const exportSlide = async (index: number) => {
    await document.fonts.ready;
    const element = slideRefs.current[index];
    if (!element) throw new Error("تعذر العثور على الشريحة");
    return toPng(element, {
      width: 1080,
      height: 1350,
      pixelRatio: 1,
      cacheBust: true,
      style: { transform: "none", transformOrigin: "top right" },
    });
  };

  const downloadZip = async () => {
    setBusy("zip");
    setProgress("جاري تصدير الشرائح…");
    try {
      const zip = new JSZip();
      for (let index = 0; index < slides.length; index += 1) {
        setProgress(`تصدير الشريحة ${index + 1} من ${slides.length}`);
        zip.file(`carousel-${String(index + 1).padStart(2, "0")}.png`, dataURLtoBlob(await exportSlide(index)));
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "cfs-carousel-expertise-to-project.zip";
      anchor.click();
      URL.revokeObjectURL(url);
      setProgress("تم تنزيل 10 شرائح PNG داخل ملف ZIP");
    } catch (error) {
      setProgress(error instanceof Error ? error.message : "تعذر التصدير");
    } finally {
      setBusy(null);
    }
  };

  const uploadToGHLMedia = async (blob: Blob, filename: string) => {
    const form = new FormData();
    form.append("file", new File([blob], filename, { type: "image/png" }));
    form.append("name", filename);
    const response = await fetch("/api/ghl?resource=media", {
      method: "POST",
      headers: { "x-ghl-token": token.trim() },
      body: form,
    });
    if (!response.ok) throw new Error(await apiError(response));
    const data = await response.json() as { url?: string };
    if (!data.url) throw new Error("اكتمل الرفع دون رابط صالح للصورة");
    return data.url;
  };

  const publishToGHL = async () => {
    if (!token.trim() || !locationId.trim()) {
      setProgress("أدخل التوكن وLocation ID");
      return;
    }
    if (!accountsLoaded) {
      setProgress("اضغط «جلب الحسابات» أولًا للتحقق من الاتصال");
      return;
    }
    if (selectedAccountIds.length === 0) {
      setProgress("اختر منصة أو حسابًا واحدًا على الأقل");
      return;
    }
    if (publishStatus === "scheduled" && !scheduleDate) {
      setProgress("حدّد تاريخ الجدولة قبل الإرسال");
      return;
    }
    if (!userId.trim()) {setProgress("أدخل User ID الخاص بمستخدم GHL");return;}
    if(publishStatus === "published" && !window.confirm("تأكيد النشر الفوري إلى الحسابات المختارة؟")) return;
    setBusy("ghl");
    try {
      const signature = JSON.stringify(slides);
      let mediaUrls = uploadedMediaCache.current?.signature === signature
        ? uploadedMediaCache.current.urls
        : [];
      if (mediaUrls.length !== slides.length) {
        mediaUrls = [];
        const uploadBatch = Date.now();
        for (let index = 0; index < slides.length; index += 1) {
          setProgress(`رفع الشريحة ${index + 1} من ${slides.length} إلى GHL`);
          const blob = dataURLtoBlob(await exportSlide(index));
          mediaUrls.push(await uploadToGHLMedia(blob, `cfs-${uploadBatch}-${String(index + 1).padStart(2, "0")}.png`));
        }
        uploadedMediaCache.current = { signature, urls: mediaUrls };
      } else {
        setProgress("استخدام الصور المرفوعة سابقًا وإنشاء المنشور…");
      }
      const response = await fetch("/api/ghl?resource=post", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-ghl-token": token.trim() },
        body: JSON.stringify({
          locationId: locationId.trim(),
          userId,
          accountIds: selectedAccountIds,
          status: publishStatus,
          summary: caption,
          media: mediaUrls.map((url) => ({ url, type: "image" })),
          ...(publishStatus === "scheduled" ? { scheduleDate: new Date(scheduleDate).toISOString() } : {}),
        }),
      });
      if (!response.ok) throw new Error(await apiError(response));
      const selectedPlatforms = platformOptions
        .filter((platform) => accounts.some((account) => account.platform === platform.id && selectedAccountIds.includes(account.id)))
        .map((platform) => platform.label)
        .join("، ");
      const statusLabel = publishStatus === "draft" ? "مسودة" : publishStatus === "scheduled" ? "مجدول" : "منشور";
      setProgress(`تم إنشاء ${statusLabel} في GHL على ${selectedPlatforms}`);
    } catch (error) {
      setProgress(error instanceof Error ? error.message : "تعذر الاتصال بـ GHL");
    } finally {
      setBusy(null);
    }
  };

  const paletteOptions = useMemo(
    () => [brand.navy, brand.orange, brand.teal, brand.cream, "#111827", "#FFFFFF"],
    [],
  );

  return (
    <main className="app-shell" dir="rtl">
      <header className="app-header">
        <div className="brand-lockup">
          <div className="brand-mark">CFS</div>
          <div>
            <h1>محرر كاروسيل Carousel Studio</h1>
            <p>المحتوى أولًا، ثم التصميم والتصدير والنشر</p>
          </div>
        </div>
        <div className="header-actions">
          <span className="status-chip"><Sparkles size={15} /> المرحلة 2: التصميم</span>
          <Button variant="outline" onClick={saveContent}><Save size={16} /> حفظ المحتوى</Button>
          <Button onClick={downloadZip} disabled={busy !== null} className="brand-button">
            {busy === "zip" ? <LoaderCircle className="animate-spin" size={17} /> : <Download size={17} />}
            تنزيل ZIP
          </Button>
        </div>
      </header>

      <section className="workspace">
        <aside className="slides-panel">
          <div className="panel-heading">
            <div>
              <strong>الشرائح</strong>
              <span>10 شرائح · 1080×1350</span>
            </div>
            <Check size={18} />
          </div>
          <div className="slides-list">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setActiveIndex(index)}
                className={`thumb-card ${index === activeIndex ? "is-active" : ""}`}
              >
                <span className="thumb-number">{String(slide.id).padStart(2, "0")}</span>
                <span className="thumb-mini" style={{ background: slide.background, color: slide.textColor }}>
                  {slide.image && <img src={slide.image} alt="" />}
                  <span style={{ color: slide.accent }}>{slide.kicker}</span>
                  <strong>{slide.title.split("\n")[0]}</strong>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section className="canvas-panel">
          <div className="canvas-toolbar">
            <span>الشريحة {activeSlide.id} من {slides.length}</span>
            <div className="canvas-nav">
              <Button variant="outline" size="icon" onClick={() => setActiveIndex(Math.min(slides.length - 1, activeIndex + 1))} aria-label="الشريحة التالية"><ChevronRight size={18} /></Button>
              <Button variant="outline" size="icon" onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))} aria-label="الشريحة السابقة"><ChevronLeft size={18} /></Button>
            </div>
          </div>
          <div className="canvas-viewport">
            <SlideCanvas
              slide={activeSlide}
              canvasRef={(node) => { slideRefs.current[activeIndex] = node; }}
              scale={stageScale}
              editable
              onTextChange={(field, value) => updateSlide({ [field]: value })}
              onImageDrag={(imageX, imageY) => updateSlide({ imageX, imageY })}
            />
          </div>
          <div className="canvas-tip">انقر داخل النص لتعديله مباشرة، واسحب الصورة لتغيير مكانها.</div>
          <div className="hidden-export-slides" aria-hidden="true">
            {slides.map((slide, index) => (
              index === activeIndex ? null : (
                <SlideCanvas key={slide.id} slide={slide} scale={1} canvasRef={(node) => { slideRefs.current[index] = node; }} />
              )
            ))}
          </div>
        </section>

        <aside className="inspector-panel">
          <Tabs defaultValue="content" className="h-full">
            <TabsList className="inspector-tabs">
              <TabsTrigger value="content"><Type size={16} /> المحتوى</TabsTrigger>
              <TabsTrigger value="design"><Palette size={16} /> التصميم</TabsTrigger>
              <TabsTrigger value="publish"><Send size={16} /> النشر</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="inspector-content">
              <label>العبارة التمهيدية<Input value={activeSlide.kicker} onChange={(e) => updateSlide({ kicker: e.target.value })} /></label>
              <label>العنوان<Textarea rows={3} value={activeSlide.title} onChange={(e) => updateSlide({ title: e.target.value })} /></label>
              <label>النص<Textarea rows={6} value={activeSlide.body} onChange={(e) => updateSlide({ body: e.target.value })} /></label>
              <div className="control-block">
                <div className="control-label"><span>حجم العنوان</span><b>{activeSlide.titleSize}px</b></div>
                <Slider min={54} max={120} step={2} value={[activeSlide.titleSize]} onValueChange={([value]) => updateSlide({ titleSize: value })} />
              </div>
              <div className="control-block">
                <div className="control-label"><span>حجم النص</span><b>{activeSlide.bodySize}px</b></div>
                <Slider min={28} max={58} step={2} value={[activeSlide.bodySize]} onValueChange={([value]) => updateSlide({ bodySize: value })} />
              </div>
              <Button className="w-full" onClick={saveContent}><Save size={16} /> حفظ تعديلات الكتابة</Button>
            </TabsContent>

            <TabsContent value="design" className="inspector-content">
              <div className="control-block">
                <span className="section-label">لون الخلفية</span>
                <div className="color-row">
                  {paletteOptions.map((color) => <button key={color} aria-label={`اختيار اللون ${color}`} onClick={() => updateSlide({ background: color })} style={{ background: color }} className={activeSlide.background === color ? "selected-color" : ""} />)}
                  <input type="color" value={activeSlide.background} onChange={(e) => updateSlide({ background: e.target.value })} aria-label="لون خلفية مخصص" />
                </div>
              </div>
              <div className="control-block">
                <span className="section-label">لون التمييز</span>
                <div className="color-row">
                  {paletteOptions.map((color) => <button key={color} aria-label={`اختيار لون التمييز ${color}`} onClick={() => updateSlide({ accent: color })} style={{ background: color }} className={activeSlide.accent === color ? "selected-color" : ""} />)}
                  <input type="color" value={activeSlide.accent} onChange={(e) => updateSlide({ accent: e.target.value })} aria-label="لون تمييز مخصص" />
                </div>
              </div>
              <div className="control-block">
                <span className="section-label"><ImageIcon size={15} /> صورك</span>
                <div className="photo-library">
                  {photoLibrary.map((photo) => (
                    <button key={photo.src} onClick={() => updateSlide({ image: photo.src, layout: activeSlide.layout === "plain" ? "photo" : activeSlide.layout })} className={activeSlide.image === photo.src ? "selected-photo" : ""} title={photo.label}>
                      <img src={photo.src} alt={photo.label} />
                    </button>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-2" onClick={() => updateSlide({ image: null, layout: "plain" })}>إزالة الصورة</Button>
              </div>
              {activeSlide.image && (
                <>
                  <div className="control-block"><div className="control-label"><span>حجم الصورة</span><b>{Math.round(activeSlide.imageScale * 100)}%</b></div><Slider min={60} max={180} value={[activeSlide.imageScale * 100]} onValueChange={([value]) => updateSlide({ imageScale: value / 100 })} /></div>
                  <div className="control-block"><div className="control-label"><span>شفافية الصورة</span><b>{Math.round(activeSlide.imageOpacity * 100)}%</b></div><Slider min={20} max={100} value={[activeSlide.imageOpacity * 100]} onValueChange={([value]) => updateSlide({ imageOpacity: value / 100 })} /></div>
                  <div className="control-block"><div className="control-label"><span>الموضع الأفقي</span><b>{Math.round(activeSlide.imageX)}</b></div><Slider min={-500} max={500} value={[activeSlide.imageX]} onValueChange={([value]) => updateSlide({ imageX: value })} /></div>
                  <div className="control-block"><div className="control-label"><span>الموضع العمودي</span><b>{Math.round(activeSlide.imageY)}</b></div><Slider min={-500} max={500} value={[activeSlide.imageY]} onValueChange={([value]) => updateSlide({ imageY: value })} /></div>
                </>
              )}
            </TabsContent>

            <TabsContent value="publish" className="inspector-content">
              <div className="publish-note"><Settings2 size={18} /><div><b>اتصال آمن بـ GHL</b><span>التوكن يُستخدم أثناء الجلسة فقط ولا يتم حفظه.</span></div></div>
              <label>Location ID<Input value={locationId} onChange={(e) => setLocationId(e.target.value)} dir="ltr" /></label>
              <label>User ID<Input value={userId} onChange={e=>setUserId(e.target.value)} dir="ltr" /></label>
              <label>Private Integration Token<Input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="لن يتم حفظه" dir="ltr" autoComplete="off" /></label>
              <Button variant="outline" className="w-full" onClick={loadAccounts} disabled={busy !== null}>
                {busy === "accounts" ? <LoaderCircle className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                جلب الحسابات واختبار الاتصال
              </Button>

              <div className="platform-picker">
                <div className="section-label"><Send size={15} /> اختر منصات النشر</div>
                <div className="platform-options">
                  {platformOptions.map(({ id, label, Icon }) => {
                    const platformAccounts = accounts.filter((account) => account.platform === id);
                    const isSelected = platformAccounts.length > 0 && platformAccounts.every((account) => selectedAccountIds.includes(account.id));
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => togglePlatform(id)}
                        disabled={platformAccounts.length === 0}
                        className={`platform-option ${isSelected ? "is-selected" : ""}`}
                      >
                        <Icon size={17} />
                        <span>{label}</span>
                        <small>{platformAccounts.length || "—"}</small>
                      </button>
                    );
                  })}
                </div>

                {accountsLoaded && accounts.filter((account) => supportedPlatforms.has(account.platform as SupportedPlatform)).length === 0 && (
                  <div className="connection-message warning"><AlertCircle size={16} /> لا توجد حسابات متوافقة. اربط Instagram أو Facebook أو LinkedIn داخل Social Planner ثم أعد الجلب.</div>
                )}

                {accounts.filter((account) => supportedPlatforms.has(account.platform as SupportedPlatform)).length > 0 && (
                  <div className="accounts-list">
                    {accounts
                      .filter((account) => supportedPlatforms.has(account.platform as SupportedPlatform))
                      .map((account) => {
                        const selected = selectedAccountIds.includes(account.id);
                        const platform = platformOptions.find((item) => item.id === account.platform);
                        const PlatformIcon = platform?.Icon || Send;
                        return (
                          <button
                            type="button"
                            key={account.id}
                            className={`account-option ${selected ? "is-selected" : ""}`}
                            onClick={() => toggleAccount(account.id)}
                          >
                            <span className="account-avatar">
                              {account.avatar ? <img src={account.avatar} alt="" /> : <PlatformIcon size={18} />}
                            </span>
                            <span className="account-copy"><b>{account.name}</b><small>{platform?.label}</small></span>
                            {selected ? <CheckCircle2 size={19} /> : <span className="empty-check" />}
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>

              <Button variant="outline" className="w-full" onClick={saveGhlSettings} disabled={!accountsLoaded}><Save size={16} /> حفظ Location والحسابات المختارة</Button>
              <label>الكابشن<Textarea rows={6} value={caption} onChange={(e) => setCaption(e.target.value)} /></label>
              <label>حالة المنشور
                <select className="select-control" value={publishStatus} onChange={(e) => setPublishStatus(e.target.value as PublishStatus)}>
                  <option value="draft">مسودة — الموصى بها</option>
                  <option value="scheduled">مجدول</option>
                  <option value="published">نشر فوري</option>
                </select>
              </label>
              {publishStatus === "scheduled" && <label>موعد النشر<Input type="datetime-local" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} /></label>}
              <Button className="brand-button w-full" onClick={publishToGHL} disabled={busy !== null}>
                {busy === "ghl" ? <LoaderCircle className="animate-spin" size={17} /> : <Send size={17} />}
                {publishStatus === "draft" ? "إنشاء مسودة في GHL" : publishStatus === "scheduled" ? "جدولة عبر GHL" : "النشر الآن عبر GHL"}
              </Button>
              <p className="permissions-note">الصلاحيات المطلوبة: Medias — Write، Social Planner — Account Read Only، وSocial Planner — Post Write.</p>
            </TabsContent>
          </Tabs>
        </aside>
      </section>

      <footer className="app-footer">
        <span className={busy ? "pulse-dot" : "ready-dot"} />
        <span>{progress}</span>
        <Dialog>
          <DialogTrigger asChild><button className="footer-help">كيف يعمل النشر؟</button></DialogTrigger>
          <DialogContent dir="rtl">
            <DialogHeader><DialogTitle>النشر إلى GHL</DialogTitle><DialogDescription>أدخل Location ID والتوكن، ثم اجلب الحسابات واختر Instagram أو Facebook أو LinkedIn. يصدّر المحرر الشرائح ويرفعها بالترتيب إلى Media Storage، ثم ينشئ منشورًا واحدًا داخل Social Planner. ابدأ بالمسودة وراجعها قبل النشر.</DialogDescription></DialogHeader>
          </DialogContent>
        </Dialog>
      </footer>
    </main>
  );
}
