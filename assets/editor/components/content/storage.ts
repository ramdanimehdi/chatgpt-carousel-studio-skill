import type { Project,Asset } from './types';
const DB='cfs-content-studio';
const tables=['projects','assets','meta'];
export async function database():Promise<IDBDatabase>{
 return new Promise((resolve,reject)=>{
  if(typeof indexedDB==='undefined'){reject(new Error('Local storage is unavailable'));return}
  let settled=false;
  const fail=(error:unknown)=>{if(!settled){settled=true;reject(error)}};
  const open=(version?:number)=>{
   // Open the existing version rather than forcing version 1. Never reset data.
   const r=version===undefined?indexedDB.open(DB):indexedDB.open(DB,version);
   r.onupgradeneeded=()=>{for(const table of tables)if(!r.result.objectStoreNames.contains(table))r.result.createObjectStore(table,{keyPath:'id'})};
   r.onerror=()=>fail(r.error);
   r.onblocked=()=>fail(new Error('Local storage upgrade is blocked by another open tab'));
   r.onsuccess=()=>{
    const db=r.result;
    if(settled){db.close();return}
    db.onversionchange=()=>db.close();
    if(tables.some(table=>!db.objectStoreNames.contains(table))){const next=db.version+1;db.close();try{open(next)}catch(error){fail(error)}return}
    settled=true;resolve(db);
   };
  };
  try{open()}catch(error){fail(error)}
 });
}
export async function all<T>(table:string):Promise<T[]>{
 const db=await database();
 return new Promise((resolve,reject)=>{
  try{
   const tx=db.transaction(table),r=tx.objectStore(table).getAll();
   tx.oncomplete=()=>{db.close();resolve(r.result)};
   tx.onabort=tx.onerror=()=>{db.close();reject(tx.error||r.error||new Error('Local read failed'))};
  }catch(error){db.close();reject(error)}
 });
}
export async function put(table:string,value:Project|Asset|Record<string,unknown>){
 const db=await database();
 return new Promise<void>((resolve,reject)=>{
  try{
   const tx=db.transaction(table,'readwrite');tx.objectStore(table).put(value);
   tx.oncomplete=()=>{db.close();resolve()};
   tx.onabort=tx.onerror=()=>{db.close();reject(tx.error||new Error('Local save failed'))};
  }catch(error){db.close();reject(error)}
 });
}
export function download(data:Blob,name:string){const url=URL.createObjectURL(data);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000)}
export function exportProject(p:Project){download(new Blob([JSON.stringify({schema:'cfs-project-v1',project:p},null,2)],{type:'application/json'}),`${p.name}.json`)}
export async function fileData(file:File):Promise<string>{if(!['image/png','image/jpeg','image/webp'].includes(file.type))throw Error('اختر صورة PNG أو JPG أو WebP');if(file.size>12*1024*1024)throw Error('حجم الصورة الأقصى 12 MB');return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=()=>reject(Error('تعذر قراءة الصورة'));r.readAsDataURL(file)})}
