import {configured,authorized,sameOrigin,respond,readContent,github} from '../lib/server.js';
import {validate,MAX_BYTES} from '../lib/schema.js';
export default async function handler(req,res){
 try{
  if(req.method==='GET'){
   if(!process.env.GITHUB_TOKEN||!process.env.GITHUB_REPO)return respond(res,503,{error:'Live content not configured; use the built-in portfolio.'});
   return respond(res,200,await readContent());
  }
  if(req.method!=='PUT'){res.setHeader('Allow','GET, PUT');return respond(res,405,{error:'Method not allowed.'})}
  if(!sameOrigin(req))return respond(res,403,{error:'Origin rejected.'});
  if(!configured())return respond(res,503,{error:'Editor not configured.'});
  if(!authorized(req))return respond(res,401,{error:'Please sign in again.'});
  let body=req.body;
  if(typeof body==='string'){if(Buffer.byteLength(body)>MAX_BYTES+1000)return respond(res,413,{error:'Content too large.'});try{body=JSON.parse(body)}catch{return respond(res,400,{error:'Invalid JSON.'})}}
  if(!body||typeof body.sha!=='string'||!/^[a-f0-9]{40}$/.test(body.sha))return respond(res,400,{error:'Missing content revision. Reload the editor.'});
  try{validate(body.data)}catch(e){return respond(res,400,{error:e.message})}
  const current=await readContent();if(current.sha!==body.sha)return respond(res,409,{error:'Content changed elsewhere. Reload the editor before saving. Your draft has not been overwritten.'});
  const result=await github('PUT',{message:'Update portfolio content from admin editor',sha:body.sha,content:Buffer.from(JSON.stringify(body.data,null,2)+'\n').toString('base64')});
  return respond(res,200,{ok:true,sha:result.content.sha,commit:result.commit.sha});
 }catch(e){return respond(res,e.status||502,{error:e.status?e.message:'Unable to load or save content. Check your GitHub configuration and try again.'})}
}
