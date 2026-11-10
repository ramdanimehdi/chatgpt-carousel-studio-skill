export function newId(){return Array.from(crypto.getRandomValues(new Uint8Array(16)),v=>v.toString(16).padStart(2,'0')).join('')}

export type Kind='carousel'|'single'|'story'|'reel';
export type Stage='idea'|'approved'|'writing'|'review'|'text-approved'|'designing'|'design-review'|'changes'|'ready'|'draft'|'scheduled'|'published'|'later'|'rejected';
export type SlideRole='cover'|'content'|'reference'|'diagnosis'|'cta'|'signature';
export type VisualMode='none'|'mehdi-photo'|'diagram'|'generated';
export type ImageGenerator='higgsfield'|'gpt-image';
export type PublishMeta={publishedAt?:string;scheduledAt?:string;platforms?:string[];country?:string;fingerprint?:string;postIds?:string[];accountIds?:string[];submittedAt?:string;attemptState?:'idle'|'submitting'|'unknown'|'accepted';deliveryStatus?:string;dateSource?:'ghl'|'manual';};

export const kinds:Record<Kind,string>={carousel:'كاروسيل',single:'صورة واحدة',story:'ستوري',reel:'ريلز'};
export const stages:Record<Stage,string>={idea:'فكرة مقترحة',approved:'فكرة معتمدة',writing:'النص قيد الإعداد',review:'النص ينتظر الموافقة','text-approved':'النص معتمد',designing:'التصميم قيد الإنشاء','design-review':'التصميم للمراجعة',changes:'يحتاج تعديل',ready:'جاهز للنشر',draft:'مسودة GHL',scheduled:'مجدول عبر GHL',published:'منشور',later:'لوقت لاحق',rejected:'مرفوض'};
export const offers=['التدريب المجاني','المعسكر المكثف','دورة 30 يوم','الخدمة التنفيذية','التفاعل'];
export const ctas:Record<string,string>={'التدريب المجاني':'ادخل إلى البايو وسجّل في التدريب المجاني: خريطة الفانل الكاملة لبيع الدورات والخدمات الاستشارية أونلاين.','المعسكر المكثف':'اكتشف المعسكر التدريبي المكثف على https://example.com.','دورة 30 يوم':'من البايو، اكتشف دورة بناء وبيع دورتك بالذكاء الاصطناعي خلال 30 يوم.','الخدمة التنفيذية':'راسلني لمعرفة كيف أساعدك في تنفيذ نظام بيع مشروعك التدريبي.','التفاعل':'احفظ المنشور وشارك معي الخطوة التي ستطبّقها.'};
export const keywordOffers={رحلة:'مجتمع رحلة الخبير المجاني',نظام:'دورة بناء وبيع دورتك — 75$',معسكر:'المعسكر المكثف — 6 أسابيع',تنفيذ:'الخدمة التنفيذية — 15 يوم'} as const;

export type ElementStyle={x:number;y:number;size:number;weight:number;color:string;align:'right'|'center'|'left';lineHeight:number;hidden:boolean;font:string};
export type Slide={id:number;kicker:string;title:string;body:string;background:string;accent:string;textColor:string;titleSize:number;bodySize:number;image:string|null;imageX:number;imageY:number;imageScale:number;imageOpacity:number;layout:'plain'|'photo'|'cta';role?:SlideRole;visualMode?:VisualMode;imageGenerator?:ImageGenerator;designKey?:'daily-editorial'|'training-cover'|'challenge-overview'|'launch-outcome'|'challenge-list'|'final-question'|'training-cta';elements?:Partial<Record<'kicker'|'title'|'body',ElementStyle>>;focusX?:number;focusY?:number;imageFit?:'cover'|'contain';imageHidden?:boolean;visualPrompt?:string;finalImage?:string;useFinalImage?:boolean};
export type Idea={title:string;hook:string;angle:string;audience:string;temperature:string;goal:string;phase:string;reason:string;saveScore:number;shareScore:number;category:string;source?:string;sourceDate?:string};
export type EducationMeta={theme:'edu';referenceId:string;book:string;author:string;framework:string;frameworkSummary:string;trainerField:string;numericExample:string;sourceLabel:string};
export type ResearchSignal={platform:string;title:string;url:string;publishedAt?:string;signal:string};
export type CarouselMethod={template:'Comic / Meme'|'Cinematic Poster'|'Clean Authority'|'Diagram / System Map'|'Handwriting Casual Notes'|'News Card';coverFormula:string;keyword:keyof typeof keywordOffers;visualMode:VisualMode;diagramDirection:'rtl';usesMehdiPhoto:boolean};
export type Project={id:string;name:string;kind:Kind;stage:Stage;createdAt:string;updatedAt:string;day:string;idea:Idea;offer:string;cta:string;caption:string;altText?:string;slides:Slide[];script:string;hookB:string;shooting:string;screenText:string;notes:string;archived:boolean;demo?:boolean;model?:string;approvedText?:string;education?:EducationMeta;carouselMethod?:CarouselMethod;dailyPackId?:string;research?:ResearchSignal[];versions:{at:string;label:string;slides:Slide[];script:string}[];scheduleDate?:string;publishMeta?:PublishMeta;ghlResult?:unknown};
export type Asset={id:string;name:string;src:string;category:string;official?:boolean;focusX:number;focusY:number};

export function baseSlide(id:number,title='',body='',role:SlideRole='content'):Slide{
 const cover=role==='cover';
 return{id,kicker:'اسم المستخدم',title,body,background:'#F8F7F4',accent:'#E07A2E',textColor:'#14213D',titleSize:cover?82:48,bodySize:32,image:null,imageX:0,imageY:0,imageScale:1,imageOpacity:1,layout:role==='cta'?'cta':'plain',role,visualMode:'none',imageGenerator:'gpt-image',visualPrompt:'',elements:{kicker:{x:80,y:150,size:24,weight:700,color:'#E07A2E',align:'right',lineHeight:1.35,hidden:false,font:'Cairo'},title:{x:80,y:cover?235:255,size:cover?82:48,weight:cover?900:800,color:'#14213D',align:'right',lineHeight:cover?1.22:1.35,hidden:false,font:'Cairo'},body:{x:80,y:cover?520:500,size:32,weight:500,color:'#1A1A1A',align:'right',lineHeight:1.45,hidden:false,font:'Cairo'}}}
}

export function createProject(kind:Kind,title='فكرة جديدة',extra:Partial<Idea>={}):Project{
 const now=new Date().toISOString();
 return{id:newId(),name:title,kind,stage:'idea',createdAt:now,updatedAt:now,day:new Date().toLocaleDateString('en-CA'),idea:{title,hook:title,angle:'',audience:'المدربون والخبراء والمستشارون',temperature:'بارد',goal:'حفظ',phase:'بناء الثقة',reason:'',saveScore:0,shareScore:0,category:'تعليمي',...extra},offer:offers[0],cta:ctas[offers[0]],caption:'',altText:'',slides:[],script:'',hookB:'',shooting:'',screenText:'',notes:'',archived:false,versions:[]}
}

// Older saved projects (including reels) may omit fields introduced later.
// Fill defaults in memory without discarding the original record or metadata.
export function hydrateProject(value: unknown): Project | null {
 if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
 const raw = value as Record<string, unknown>;
 if (typeof raw.id !== 'string' || !raw.id) return null;
 const kind = Object.hasOwn(kinds, String(raw.kind)) ? raw.kind as Kind : 'carousel';
 const name = typeof raw.name === 'string' ? raw.name : typeof raw.title === 'string' ? raw.title : 'مشروع محفوظ';
 const base = createProject(kind, name);
 const project = { ...base, ...raw, id: raw.id, name, kind } as Project;
 for (const key of ['createdAt','updatedAt','day','offer','cta','caption','script','hookB','shooting','screenText','notes'] as const) {
  if (typeof project[key] !== 'string') project[key] = base[key];
 }
 project.stage = Object.hasOwn(stages, String(raw.stage)) ? raw.stage as Stage : base.stage;
 const idea = raw.idea && typeof raw.idea === 'object' && !Array.isArray(raw.idea) ? raw.idea : {};
 project.idea = { ...base.idea, ...idea };
 for (const key of ['title','hook','angle','audience','temperature','goal','phase','reason','category'] as const) {
  if (typeof project.idea[key] !== 'string') project.idea[key] = base.idea[key];
 }
 project.slides = (Array.isArray(raw.slides) ? raw.slides : []).map((value, index) => {
  const slide = value && typeof value === 'object' ? value as Partial<Slide> : {};
  const title = typeof slide.title === 'string' ? slide.title : '';
  const body = typeof slide.body === 'string' ? slide.body : '';
  const id = typeof slide.id === 'number' ? slide.id : index + 1;
  return { ...baseSlide(id, title, body, slide.role || (index === 0 ? 'cover' : 'content')), ...slide, id, title, body, kicker: typeof slide.kicker === 'string' ? slide.kicker : '' };
 });
 project.versions = Array.isArray(raw.versions) ? raw.versions : [];
 project.research = Array.isArray(raw.research) ? raw.research.filter(item => item && typeof item === 'object' && typeof item.url === 'string') : undefined;
 project.archived = raw.archived === true;
 return project;
}
