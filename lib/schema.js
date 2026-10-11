export const MAX_BYTES = 750000;
const text=(v,max=10000)=>typeof v==='string'&&v.length<=max;
const list=(v,max=100)=>Array.isArray(v)&&v.length<=max;
export function safeURL(v,{email=false,image=false}={}){
 if(v==='')return true;
 if(!text(v,image?450000:2000))return false;
 if(image&&/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(v))return true;
 if(email)return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
 try{const u=new URL(v);return u.protocol==='https:'&&!u.username&&!u.password}catch{return false}
}
export function validate(data){
 if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('Invalid portfolio data.');
 if(Buffer.byteLength(JSON.stringify(data))>MAX_BYTES)throw new Error('Portfolio exceeds 750 KB. Use a smaller photo or fewer entries.');
 const p=data.profile;
 if(!p||!text(p.name,100)||!p.name.trim()||!text(p.role,240)||!text(p.institution,240)||!text(p.headline,240)||!text(p.bio,2000)||!list(p.interests,12)||!p.interests.every(x=>text(x,80)))throw new Error('Invalid profile fields.');
 for(const k of ['github','linkedin','resume'])if(!safeURL(p[k]))throw new Error(k+' must be an HTTPS URL or blank.');
 if(!safeURL(p.email,{email:true})||!safeURL(p.photo,{image:true}))throw new Error('Invalid email or profile photo.');
 if(!text(data.about,20000))throw new Error('About text is too long.');
 const shapes={publications:{title:300,authors:1000,venue:300,year:20,summary:3000},articles:{title:300,date:30,summary:1000,body:60000},projects:{title:300,category:100,summary:2000,body:20000}};
 for(const [kind,fields]of Object.entries(shapes)){
  if(!list(data[kind],100))throw new Error('Invalid '+kind+' list.');
  const ids=new Set();
  for(const item of data[kind]){
   if(!item||!text(item.id,100)||!item.id||ids.has(item.id))throw new Error('Invalid or duplicate entry ID.');ids.add(item.id);
   for(const [key,max]of Object.entries(fields))if(!text(item[key],max))throw new Error('Invalid '+kind+' '+key+'.');
   if(!item.title.trim())throw new Error('Each entry needs a title.');
   for(const key of kind==='publications'?['paper','code']:kind==='projects'?['code','demo']:[])if(!safeURL(item[key]))throw new Error('Links must use HTTPS.');
   if(kind==='projects'&&(!list(item.tags,15)||!item.tags.every(x=>text(x,80))))throw new Error('Invalid project tags.');
  }
 }
 return data;
}
