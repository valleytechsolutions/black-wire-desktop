import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const pdfRoot=path.dirname(require.resolve('pdfjs-dist/package.json'));
for(const name of ['cmaps','standard_fonts','wasm'])await fs.cp(path.join(pdfRoot,name),path.join('public','pdf',name),{recursive:true});
await fs.copyFile(path.join(pdfRoot,'LICENSE'),path.join('public','pdf','LICENSE'));
console.log('Local PDF rendering resources ready.');

let notices='Black Wire Technical Reference Guide — bundled interface libraries\n\n';
for(const name of ['react','react-dom','lucide-react','pdfjs-dist']){
 const dir=path.dirname(require.resolve(name+'/package.json'));
 const meta=JSON.parse(await fs.readFile(path.join(dir,'package.json'),'utf8'));
 let license;for(const file of ['LICENSE','LICENSE.txt','LICENSE.md']){try{license=await fs.readFile(path.join(dir,file),'utf8');break;}catch{}}
 if(!license)throw new Error('Missing license: '+name);
 notices+=`${name} ${meta.version}\n${'='.repeat(50)}\n${license}\n\n`;
}
await fs.writeFile('public/THIRD_PARTY_NOTICES.txt',notices);
