import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const mime={'.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.gif':'image/gif','.pdf':'application/pdf','.json':'application/json'};
export default defineConfig({
  base:'./',
  plugins:[{name:'offline-library',configureServer(server){server.middlewares.use('/library',(req,res,next)=>{
    let requestPath;try{requestPath=decodeURIComponent((req.url||'').split('?')[0]);}catch{res.statusCode=400;return res.end();}
    const file=path.resolve(root,'library','.'+requestPath);const rel=path.relative(path.join(root,'library'),file);
    if(rel.startsWith('..')||path.isAbsolute(rel)){res.statusCode=403;return res.end();}
    if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;return res.end();}
    res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.setHeader('X-Content-Type-Options','nosniff');fs.createReadStream(file).pipe(res);
  });}}],
  build:{target:'es2022',chunkSizeWarningLimit:1000},
  server:{host:'127.0.0.1',port:5186,strictPort:true,watch:{ignored:['**/library/**','**/release/**','**/data/qa/**','**/test-results/**']}}
});
