import {baseSlide,createProject,type EducationMeta,type Project} from './types';
import {signatureSlide} from './carousel-method';

export type ReferenceFramework={id:string;group:'اسم المستخدم'|'راسل برونسون'|'أليكس هرموزي'|'مراجع أخرى';book:string;author:string;title:string;summary:string;application:string;priority?:boolean};

export const trainerFields=['مدرب أعمال','مدرب لياقة','مدرب تغذية','مدرب لغات','مدرب تربية'];

export const referenceFrameworks:ReferenceFramework[]=[
 {id:'mahdi-golden-offer',group:'اسم المستخدم',book:'انطلاقتك الرقمية كخبير',author:'اسم المستخدم',title:'الصيغة الذهبية لجملة العرض',summary:'أساعد (الفئة) على التغلب على (الألم) من خلال (الحل) لتحقيق (الرغبة).',application:'مثال مسموح من المرجع: في 90 دقيقة تصمم أول عرض.',priority:true},
 {id:'mahdi-two-questions',group:'اسم المستخدم',book:'انطلاقتك الرقمية كخبير',author:'اسم المستخدم',title:'سؤالان لفهم الجمهور',summary:'اسأل: ما أكثر شيء يعطلك حاليًا؟ ولو كان عندك حل سحري، في ماذا تحب أن يساعدك؟',application:'مثال تطبيقي افتراضي: اسأل 5 عملاء سابقين، ثم اجمع الكلمات المتكررة في وعد واحد.',priority:true},
 {id:'mahdi-three-offers',group:'اسم المستخدم',book:'انطلاقتك الرقمية كخبير',author:'اسم المستخدم',title:'3 صيغ للعرض الواحد',summary:'اختبر عرض النتيجة السريعة، أو الباقة، أو التدرج من منتج دخول إلى البرنامج الكامل.',application:'أمثلة المرجع: 90 دقيقة لأول عرض، أو 3 ملفات + تسجيل + قالب بـ29$، أو دورة مصغرة 9$ ثم برنامج 49$.',priority:true},
 {id:'mahdi-five-mistakes',group:'اسم المستخدم',book:'انطلاقتك الرقمية كخبير',author:'اسم المستخدم',title:'5 أخطاء تؤخر المشروع الرقمي',summary:'بناء دورة بلا اختبار، بيع مباشر بلا طريق، انتظار الكمال، متابعة يدوية، وخلط المتابعين بالعملاء.',application:'مثال افتراضي: اختبر وعدًا واحدًا مع 5 أشخاص قبل تسجيل الدرس الأول.',priority:true},
 {id:'mahdi-conversion-map',group:'اسم المستخدم',book:'خريطة نسب التحويل',author:'اسم المستخدم',title:'الهدية المجانية قبل البيع',summary:'استخدم هدية ضيقة لجمع التسجيلات ثم قدّم عرضًا مناسبًا بدل إرسال الزائر البارد مباشرة إلى الشراء.',application:'مثال المرجع: نقرة 0.60$ وتسجيل 30% تعني نحو 2$ للمسجل، وشراء 5% يعني نحو 40$ للعميل.',priority:true},
 {id:'mahdi-webinar-beliefs',group:'اسم المستخدم',book:'دليل الويبينار المثالي',author:'اسم المستخدم',title:'خريطة المعتقدات الثلاثة',summary:'عالج اعتقاد الجمهور عن الوسيلة، وعن قدرته على التطبيق، وعن الظروف الخارجية.',application:'مثال افتراضي: خصص 3 قصص قصيرة، قصة واحدة لكل اعتقاد، ثم انتقل إلى العرض.',priority:true},
 {id:'mahdi-value-ladder',group:'اسم المستخدم',book:'رحلة الخبير',author:'اسم المستخدم',title:'سلم القيمة',summary:'ابدأ بدرجة دخول بسيطة، ثم اجعل كل درجة تعطي قيمة أكبر وتقود طبيعيًا إلى التالية.',application:'سلم مهدي الحالي: تحدي 9$، إضافات 4$ و7$، ترقيات 35$ و45$، ثم المعسكر والخدمة التنفيذية.',priority:true},
 {id:'russell-hook-story-offer',group:'راسل برونسون',book:'أسرار الخبراء',author:'راسل برونسون',title:'الخطاف ثم القصة ثم العرض',summary:'الخطاف يوقف التمرير، والقصة تبني القيمة والثقة، والعرض يطلب القرار.',application:'مثال افتراضي لريل 30 ثانية: 3 ثوانٍ للخطاف، 20 ثانية للقصة، و7 ثوانٍ للعرض.'},
 {id:'russell-epiphany',group:'راسل برونسون',book:'أسرار الخبراء',author:'راسل برونسون',title:'جسر الإلهام',summary:'احك أين كنت، والجدار الذي اصطدمت به، واللحظة التي فهمت فيها، وما تغيّر بعدها.',application:'مثال افتراضي: قصة من 4 محطات، وكل محطة في شريحة مستقلة.'},
 {id:'russell-new-opportunity',group:'راسل برونسون',book:'أسرار الخبراء',author:'راسل برونسون',title:'الفرصة الجديدة',summary:'قدّم طريقة جديدة مختلفة عن الحل الذي جرّبه العميل وفشل معه.',application:'مثال افتراضي: قارن بين خطة قديمة من 10 خطوات وطريق جديد من 3 خطوات.'},
 {id:'russell-dream100',group:'راسل برونسون',book:'أسرار الترافيك',author:'راسل برونسون',title:'قائمة المئة',summary:'حدد 100 حساب أو مكان يجتمع فيه جمهورك، واعمل باستمرار على الظهور أمامهم.',application:'مثال تطبيقي: ابدأ بـ20 حسابًا، ثم أضف 20 حسابًا كل أسبوع حتى تصل إلى 100.'},
 {id:'hormozi-value-equation',group:'أليكس هرموزي',book:'عروض بمئة مليون',author:'أليكس هرموزي',title:'معادلة القيمة',summary:'ارفع النتيجة الحلم واليقين، وقلّل الوقت والجهد المطلوبين قبل التفكير في خفض السعر.',application:'مثال افتراضي: خفّض زمن الوصول من 30 يومًا إلى 7 أيام بقالب وجلسة تطبيق.'},
 {id:'hormozi-grand-slam',group:'أليكس هرموزي',book:'عروض بمئة مليون',author:'أليكس هرموزي',title:'العرض الذي لا يُرفض',summary:'اكتب العقبات، وحوّل كل عقبة إلى حل، واجمع الحلول مع ضمان وندرة وإلحاح حقيقيين.',application:'مثال افتراضي: حوّل 4 عقبات إلى 4 مكونات واضحة داخل عرض واحد.'},
 {id:'hormozi-four-leads',group:'أليكس هرموزي',book:'عملاء محتملون بمئة مليون',author:'أليكس هرموزي',title:'الطرق الأربع لجلب العملاء المحتملين',summary:'تواصل مع من تعرفهم، وانشر المحتوى، وتواصل مع من لا يعرفونك، واستخدم الإعلانات المدفوعة.',application:'مثال افتراضي: اختر قناة واحدة لمدة 30 يومًا وحدد نشاطًا يوميًا قابلًا للقياس.'},
 {id:'hormozi-lead-magnet',group:'أليكس هرموزي',book:'عملاء محتملون بمئة مليون',author:'أليكس هرموزي',title:'الهدية المجانية',summary:'حل كامل لمشكلة ضيقة: تقييم يكشف مشكلة، أو عينة من الخدمة، أو خطوة من عملية طويلة.',application:'مثال افتراضي: اختبار من 7 أسئلة ينتهي بتشخيص واحد وخطوة تالية.'},
 {id:'hormozi-rule100',group:'أليكس هرموزي',book:'عملاء محتملون بمئة مليون',author:'أليكس هرموزي',title:'قاعدة المئة',summary:'نفّذ حجمًا ثابتًا من التواصل أو المحتوى أو الإعلان لمدة كافية قبل الحكم.',application:'المرجع: 100 تواصل يوميًا، أو 100 دقيقة محتوى، أو 100$ إعلان يوميًا لمدة 100 يوم.'},
 {id:'walker-launch',group:'مراجع أخرى',book:'صيغة إطلاق المنتج',author:'جيف ووكر',title:'3 محتويات قبل فتح البيع',summary:'قدّم محتوى عن الفرصة، ثم التحول، ثم طريق التطبيق، وبعدها افتح البيع لفترة محددة.',application:'مثال افتراضي: 3 فيديوهات مجانية خلال 6 أيام، ثم فتح التسجيل في اليوم 7.'},
 {id:'miller-guide',group:'مراجع أخرى',book:'قصة العلامة',author:'دونالد ميلر',title:'العميل بطل والمدرب مرشد',summary:'اجعل العميل بطل القصة، وقدّم المدرب كمرشد يعطيه خطة واضحة.',application:'مثال افتراضي: 3 خطوات يطبّقها العميل، مع دور واضح للمدرب في كل خطوة.'}
];

export function sourceLabel(item:ReferenceFramework){return `من كتاب «${item.book}» لـ${item.author}`}

export function createEducationalProject(item:ReferenceFramework,trainerField:string):Project{
 const source=sourceLabel(item);
 const p=createProject('carousel',item.title,{hook:item.title,angle:`شرح ${item.title} وتطبيقه على ${trainerField}`,audience:`${trainerField}ون ومدربون وخبراء`,temperature:'متفاعل',goal:'حفظ',phase:'بناء الثقة',reason:'إطار عملي واحد من مرجع معروف، مع مثال تطبيقي قابل للحفظ.',saveScore:9,shareScore:7,category:'من المكتبة',source});
 const meta:EducationMeta={theme:'edu',referenceId:item.id,book:item.book,author:item.author,framework:item.title,frameworkSummary:item.summary,trainerField,numericExample:item.application,sourceLabel:source};
 p.education=meta;p.stage='approved';p.notes=`خط «من المكتبة». إطار واحد فقط: ${item.title}. المصدر على الغلاف والكابشن، رقم مرجعي، تشخيص، CTA بكلمة «رحلة»، ثم الشريحة الثابتة.`;
 p.carouselMethod={template:'Clean Authority',coverFormula:'وعد محدد + فجوة معرفية',keyword:'رحلة',visualMode:'none',diagramDirection:'rtl',usesMehdiPhoto:false};
 p.slides=[
  {...baseSlide(1,`${item.title.slice(0,Math.max(1,item.title.length-1))}ـ${item.title.slice(-1)}`,'إطار واحد تطبّقه اليوم على مشروعك التدريبي.','cover'),kicker:source},
  {...baseSlide(2,'الفكرة في جملة واحدة',item.summary,'content'),kicker:item.title},
  {...baseSlide(3,`طبّقها كـ${trainerField}`,`ابدأ بموقف واحد حقيقي، ثم استخدم الإطار وحده دون خلطه بإطار آخر.`,'content'),kicker:'تطبيق المدرب'},
  {...baseSlide(4,'رقم واحد تقيس به التطبيق',item.application,'reference'),kicker:'مرجع عملي',background:'#F8F7F4'},
  {...baseSlide(5,'نفّذها اليوم',`اكتب خطوة واحدة، وحدد رقمًا أو مدة تراجع بها التنفيذ نهاية اليوم.`,'content'),kicker:'خطوة عملية'},
  {...baseSlide(6,'شخّص وضعك الآن','جاهز: لديك تطبيق ورقم.\nيحتاج تحسين: لديك التطبيق بلا قياس.\nيبدأ من الصفر: ما زلت تجمع أكثر من إطار.','diagnosis'),kicker:'احفظ هذه الشريحة'},
  {...baseSlide(7,'اكتب «رحلة» في التعليقات','وسأرسل لك طريق البدء داخل مجتمع «رحلة الخبير» المجاني.','cta'),kicker:'الخطوة التالية',background:'#0D1B2A',textColor:'#FFFFFF',accent:'#D4A574'},
  signatureSlide(8)
 ];
 p.caption=`اكتب «رحلة» في التعليقات للانضمام إلى مجتمع رحلة الخبير المجاني.\n\n${source}\n\n${item.title}: ${item.summary}\n\nتطبيق ${trainerField}: ${item.application}\n\nاحفظ المنشور وطبّق خطوة واحدة اليوم.`;
 p.altText=`كاروسيل تعليمي عربي يشرح ${item.title} من ${source}، مع مثال رقمي وتشخيص عملي، وينتهي بدعوة كلمة رحلة.`;
 p.cta='اكتب «رحلة» في التعليقات للانضمام إلى المجتمع المجاني.';
 return p;
}
