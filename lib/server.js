import {createHash,timingSafeEqual} from 'node:crypto';
export function configured(){return Boolean(process.env.GITHUB_TOKEN&&/^[\w.-]+\/[\w.-]+$/.test(process.env.GITHUB_REPO||'')&&(process.env.ADMIN_PASSWORD||'').length>=24)}
export function authorized(req){
 const secret=process.env.ADMIN_PASSWORD||'';
 if(secret.length<24)return false;
 const h=req.headers.authorization||'';if(!h.startsWith('Bearer ')||h.length>500)return false;
 const hash=s=>createHash('sha256').update(s).digest();
 return timingSafeEqual(hash(h.slice(7)),hash(secret));
}
export function sameOrigin(req){
 const origin=req.headers.origin;if(!origin)return true;
 try{return new URL(origin).host===req.headers.host}catch{return false}
}
export function respond(res,status,data){res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json; charset=utf-8');res.statusCode=status;res.end(JSON.stringify(data))}
export async function github(method='GET',body){
 const repo=process.env.GITHUB_REPO;const branch=process.env.GITHUB_BRANCH||'main';
 if(!/^[\w.-]+\/[\w.-]+$/.test(repo||''))throw new Error('Repository not configured.');
 const url=`https://api.github.com/repos/${repo}/contents/content/portfolio.json`+(method==='GET'?`?ref=${encodeURIComponent(branch)}`:'');
 const r=await fetch(url,{method,headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${process.env.GITHUB_TOKEN}`,'X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json','User-Agent':'Ankit-Portfolio-Editor'},body:body?JSON.stringify({...body,branch}):undefined,signal:AbortSignal.timeout(15000)});
 if(!r.ok){const error=new Error(r.status===409||r.status===422?'Content changed elsewhere. Reload before saving again.':'GitHub request failed. Check repository, token permissions, and branch protection.');error.status=r.status===409||r.status===422?409:502;throw error}
 return r.json();
}
export async function readContent(){const file=await github();return {data:JSON.parse(Buffer.from(file.content,'base64').toString('utf8')),sha:file.sha}}
