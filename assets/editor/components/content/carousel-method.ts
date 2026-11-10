import { baseSlide, keywordOffers, type Project, type Slide } from './types';

export const SIGNATURE_TITLE='خدماتي';
export const SIGNATURE_BODY='أضف خدماتك وروابطها من إعدادات الهوية';
export function signatureSlide(id=999):Slide{let brand={name:'اسمك',services:SIGNATURE_BODY};try{brand={...brand,...JSON.parse(localStorage.getItem('carousel-brand')||'{}')}}catch{}return {...baseSlide(id,SIGNATURE_TITLE,brand.services,'signature'),kicker:brand.name,visualMode:'none'};}

const words=(s:string)=>s.trim().split(/\s+/).filter(Boolean).length;
const hasOneKashidaWord=(s:string)=>s.split(/\s+/).filter(token=>token.includes('ـ')).length===1;

export function validateCarouselMethod(p:Project):string[]{
 if(p.kind!=='carousel')return[];
 if(!p.carouselMethod)return[];
 const errors:string[]=[];
 const roles=p.slides.map(s=>s.role||'content');
 const keyword=p.carouselMethod?.keyword;
 if(p.slides.length<7||p.slides.length>10)errors.push('المنهجية تحتاج من 7 إلى 10 شرائح.');
 if(roles[0]!=='cover')errors.push('الشريحة الأولى يجب أن تكون غلافًا.');
 if(!hasOneKashidaWord(p.slides[0]?.title||''))errors.push('استخدم الكشيدة في كلمة واحدة فقط على الغلاف.');
 if(!roles.includes('reference')||!p.slides.some(s=>s.role==='reference'&&/\d/.test(`${s.title} ${s.body}`)))errors.push('أضف شريحة رقم مرجعي يقيس القارئ نفسه عليه.');
 if(!roles.includes('diagnosis'))errors.push('أضف شريحة التشخيص: جاهز / يحتاج تحسين / يبدأ من الصفر.');
 const cta=p.slides.find(s=>s.role==='cta');
 if(!cta)errors.push('أضف شريحة الدعوة قبل الشريحة الثابتة.');
 if(keyword&&cta&&!`${cta.title} ${cta.body}`.includes(keyword))errors.push(`اكتب الكلمة المفتاحية «${keyword}» على شريحة الدعوة.`);
 const last=p.slides.at(-1);
 if(last?.role!=='signature'||last.title!==SIGNATURE_TITLE||last.body!==SIGNATURE_BODY)errors.push('اختم بالشريحة الثابتة المعتمدة دون تغيير.');
 for(const [i,s] of p.slides.entries())if(i>0&&s.role!=='signature'&&words(`${s.title} ${s.body}`)>50)errors.push(`الشريحة ${i+1} تتجاوز 50 كلمة.`);
 if(keyword&&!p.caption.split('\n')[0]?.includes(keyword))errors.push(`ابدأ الكابشن بـ CTA يحتوي كلمة «${keyword}».`);
 if(!p.altText?.trim())errors.push('أضف Alt text غنيًا بالكلمة المفتاحية.');
 if(p.slides.some(s=>Object.values(s.elements||{}).some(e=>e?.font&&e.font!=='Cairo')))errors.push('استخدم خط Cairo فقط داخل الكاروسيل.');
 return errors;
}

export function visualRequest(slide:Slide,project:Project){
 const generator=slide.imageGenerator==='gpt-image'?'GPT Image':'Higgsfield';
 const person=slide.visualMode==='mehdi-photo'?'استخدم صورتك المرجعية فقط. رجل واحد فقط، لباس محتشم كامل، بلا شورت، ولا تظهر أي امرأة. حافظ على ملامحه الحقيقية وهوية البراند.':'إذا لم تكن صورتك مطلوبة، لا تضف أشخاصًا.';
 const diagram=slide.visualMode==='diagram'?'الرسوم والأسهم عربية RTL، ومسارها من اليمين إلى اليسار. لا تضع نصًا عربيًا مولدًا داخل الصورة؛ اترك مساحات للنص داخل الاستوديو.':'';
 return `المولد: ${generator}\nالمقاس: 1080×1350 عمودي\nالقالب: ${project.carouselMethod?.template||'Clean Authority'}\nالفكرة: ${slide.visualPrompt||slide.title}\n${person}\n${diagram}\nلوحة الألوان: #E07A2E #1B5E5C #D4A574 #14213D #0D1B2A #F8F7F4. لا شعار، لا كتابة خلف الوجه، وتباين واضح.`;
}

export const keywordDescription=(keyword:keyof typeof keywordOffers)=>`${keyword} ← ${keywordOffers[keyword]}`;
