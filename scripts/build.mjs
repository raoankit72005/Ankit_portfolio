import {cp,mkdir,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});await cp('public','dist',{recursive:true});await cp('content/portfolio.json','dist/portfolio.json');console.log('Built portfolio in dist/. Vercel handles api/ functions separately.');
