import fs from 'node:fs/promises';
import path from 'node:path';
import {build} from 'vite';
import {fileURLToPath} from 'node:url';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
process.chdir(root);
await import('./prepare-assets.mjs');
const base=process.env.BLACKWIRE_BASE_PATH||'/';
if(!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(base))throw new Error('BLACKWIRE_BASE_PATH must be / or a slash-terminated path such as /bwm-guide/.');
const out=path.join(root,'web-release');
await build({root,mode:'web',base,build:{outDir:out,emptyOutDir:true}});
const manifest=JSON.parse(await fs.readFile(path.join(root,'library/manifest.json'),'utf8'));
for(const rel of [...new Set([...manifest,'manifest.json'])]){
 if(typeof rel!=='string'||rel.includes('\\')||rel.includes(':')||rel.split('/').some(p=>!p||p==='..'||p==='.')||path.isAbsolute(rel))throw new Error('Unsafe library path');
 const destination=path.join(out,'library',rel);await fs.mkdir(path.dirname(destination),{recursive:true});
 await fs.copyFile(path.join(root,'library',rel),destination);
}
await fs.copyFile(path.join(root,'library/catalog.json'),path.join(out,'catalog.json'));
const headers=`/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'self' https://valleytechsolutions.tech https://www.valleytechsolutions.tech
${base}catalog.json
  Cache-Control: public, max-age=0, must-revalidate
${base}library/media/*
  Cache-Control: public, max-age=31536000, immutable
${base}assets/*
  Cache-Control: public, max-age=31536000, immutable
`;
await fs.writeFile(path.join(out,'_headers'),headers);
// Explicit 404 prevents static hosts returning HTML for a missing JSON or image.
await fs.writeFile(path.join(out,'404.html'),'<h1>Reference not found</h1><p>Return to the guide and try another reference.</p>');
const files=[];async function scan(dir){for(const e of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())await scan(p);else files.push({path:path.relative(out,p).replaceAll('\\','/'),bytes:(await fs.stat(p)).size});}}await scan(out);
const report={mode:'browser',base,files:files.length,bytes:files.reduce((n,f)=>n+f.bytes,0),largest:files.sort((a,b)=>b.bytes-a.bytes)[0],cloudflarePagesLimitCheck:{within20000Files:files.length<=20000,within25MiBPerFile:files.every(f=>f.bytes<=25*1024*1024)},published:false};
await fs.mkdir(path.join(root,'data/qa'),{recursive:true});await fs.writeFile(path.join(root,'data/qa/web-build.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
