import {configured,authorized,sameOrigin,respond} from '../lib/server.js';
export default function handler(req,res){
 if(req.method!=='POST'){res.setHeader('Allow','POST');return respond(res,405,{error:'Method not allowed.'})}
 if(!sameOrigin(req))return respond(res,403,{error:'Origin rejected.'});
 if(!configured())return respond(res,503,{error:'Editor is not configured. Add GITHUB_TOKEN, GITHUB_REPO and a random ADMIN_PASSWORD (at least 24 characters) in Vercel, then redeploy.'});
 if(!authorized(req))return respond(res,401,{error:'Incorrect admin password.'});
 return respond(res,200,{ok:true});
}
