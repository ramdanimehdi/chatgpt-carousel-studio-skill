'use client';
import {useMemo,useState} from 'react';
import {BookOpen,Check,ChevronLeft,LibraryBig,Search} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from '@/components/ui/select';
import {createEducationalProject,referenceFrameworks,sourceLabel,trainerFields,type ReferenceFramework} from './library';
import type{Project}from './types';

export default function LibraryFactory({onCreate}:{onCreate:(p:Project)=>void}){
 const[group,setGroup]=useState('الكل'),[query,setQuery]=useState(''),[field,setField]=useState(trainerFields[0]),[selected,setSelected]=useState<ReferenceFramework>(referenceFrameworks[0]);
 const shown=useMemo(()=>referenceFrameworks.filter(x=>(group==='الكل'||x.group===group)&&(`${x.title} ${x.book} ${x.author} ${x.summary}`).includes(query)),[group,query]);
 const source=sourceLabel(selected);
 return <div className="library-factory"><section className="library-hero"><div><span className="eyebrow">الخط التعليمي · THE LIBRARY</span><h2>حوّل مرجعًا واحدًا إلى كاروسيل قابل للحفظ</h2><p>اختر إطارًا واحدًا، ثم طبّقه على مدرب عربي. سيُضاف المصدر تلقائيًا إلى الغلاف والكابشن، ويُستخدم الثيم التعليمي.</p></div><LibraryBig size={54}/></section>
 <div className="library-controls"><div className="search-field"><Search size={17}/><Input value={query} onChange={e=>setQuery(e.target.value)} placeholder="ابحث في الكتب والأطر…"/></div><Select value={group} onValueChange={setGroup}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{['الكل','اسم المستخدم','راسل برونسون','أليكس هرموزي','مراجع أخرى'].map(x=><SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></div>
 <div className="library-layout"><div className="reference-grid">{shown.map(item=><button key={item.id} className={`reference-card ${selected.id===item.id?'selected':''}`} onClick={()=>setSelected(item)}><div><span>{item.group}</span>{item.priority&&<b>أولوية</b>}</div><h3>{item.title}</h3><p>{item.summary}</p><small>{sourceLabel(item)}</small></button>)}</div>
 <aside className="library-builder panel"><span className="edu-chip"><BookOpen size={15}/> theme: edu</span><h3>{selected.title}</h3><p className="source-line">{source}</p><label>مثال المدرب<Select value={field} onValueChange={setField}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{trainerFields.map(x=><SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></label><div className="library-example"><b>المثال الرقمي</b><p>{selected.application}</p></div><div className="quality-check"><b>فحص قبل الإنشاء</b>{['مرجع واحد فقط','المصدر على الغلاف','المصدر داخل الكابشن','مثال مدرب بأرقام'].map(x=><span key={x}><Check size={15}/>{x}</span>)}</div><Button onClick={()=>onCreate(createEducationalProject(selected,field))}>إنشاء مشروع تعليمي <ChevronLeft size={17}/></Button><small>يبدأ المشروع في مرحلة كتابة النص، ويبقى اعتمادك مطلوبًا قبل التصميم.</small></aside></div></div>
}
