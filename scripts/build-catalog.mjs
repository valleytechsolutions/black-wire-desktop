import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import {fileURLToPath} from 'node:url';
const appRoot=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const workspace=process.env.BLACKWIRE_SOURCE_ROOT||path.dirname(appRoot);
const curatedRoot=path.join(workspace,'Pinouts and Reference Sheets');
const output=path.join(appRoot,'library');
for(const d of ['media','thumbs','display','power'])await fs.mkdir(path.join(output,d),{recursive:true});
const readJSON=async p=>JSON.parse(await fs.readFile(p,'utf8'));
const assets=await readJSON(path.join(curatedRoot,'_Catalog','ASSETS.json'));
const boardRows=await readJSON(path.join(curatedRoot,'_Catalog','BOARDS.json'));
const boards=new Map(boardRows.map(b=>[b.board_id,{id:b.board_id,name:b.board,brand:b.brand,family:b.family,processor:b.esp_variant&&b.esp_variant!=='Variant unconfirmed'?b.esp_variant:b.processor_family||(['RP2040','RP2350','ESP32','Teensy'].includes(b.family)?b.family:''),aliases:b.aliases||[],revision:b.revision,coverage:b.status,partial:!!b.coverage_partial,sources:b.source_pages||[],assets:[],scope:'curated'}]));
const digest=data=>crypto.createHash('sha256').update(data).digest('hex');
const normalize=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
const fileManifest=new Set();const originals=new Map();const byHash=new Map();let copiedBytes=0;
const sourceCoverage=[];const errors=[];const usedIds=new Set();
async function storeFile(file,hash){
 const ext=path.extname(file).toLowerCase();const rel=`media/${hash}${ext}`;
 if(!originals.has(rel)){
   const out=path.join(output,rel);const st=await fs.stat(file);
   try{const dst=await fs.stat(out);if(dst.size!==st.size)await fs.copyFile(file,out);}catch{await fs.copyFile(file,out);}
   originals.set(rel,st.size);copiedBytes+=st.size;
 }
 fileManifest.add(rel);return rel;
}
async function addFile(board,meta,file){
 const data=await fs.readFile(file),hash=digest(data);
 if(meta.hash&&meta.hash!==hash)throw new Error('Source hash mismatch: '+file);
 const rel=await storeFile(file,hash);
 let id=meta.id||'source-'+digest(board.id+rel).slice(0,18);if(usedIds.has(id))id+='-'+digest(board.id+rel).slice(0,7);usedIds.add(id);
 const a={...meta,id,hash,file:rel,extension:path.extname(file).slice(1).toLowerCase(),bytes:data.length,originals:[path.relative(workspace,file).replaceAll('\\','/')],sources:meta.sources||[],url:meta.url||'',rights:meta.rights||'Source rights not yet established'};
 board.assets.push(a);byHash.set(hash,[...(byHash.get(hash)||[]),{board,asset:a}]);return a;
}
for(const a of assets){
 const board=boards.get(a.board_id);
 const record=await addFile(board,{id:a.id,label:a.label,type:a.asset_type,hash:a.sha256,width:a.width,height:a.height,partial:!!a.coverage_partial,notes:a.note||'',revision:a.revision,review:'Reviewed source',sources:a.source_pages,url:a.url,rights:a.rights_status||a.license,collected:a.collected_on},path.join(curatedRoot,a.file));
 if(a.companion_vector){const vf=path.join(curatedRoot,a.companion_vector);const data=await fs.readFile(vf);record.vector=await storeFile(vf,digest(data));}
}
function parseCSV(text){
 const rows=[];let row=[],cell='',quoted=false;
 for(let i=0;i<text.length;i++){
  const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}
  else if(c===','&&!quoted){row.push(cell);cell='';}else if(c==='\n'&&!quoted){row.push(cell.replace(/\r$/,''));rows.push(row);row=[];cell='';}else cell+=c;
 }
 if(cell||row.length){row.push(cell.replace(/\r$/,''));rows.push(row);}const keys=(rows.shift()||[]).map(k=>k.replace(/^\uFEFF/,''));return rows.map(row=>Object.fromEntries(keys.map((k,i)=>[k,row[i]||''])));
}
async function walk(dir){const out=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){if(e.name.toLowerCase()==='_research'||e.name.startsWith('.'))continue;const p=path.join(dir,e.name);if(e.isDirectory())out.push(...await walk(p));else out.push(p);}return out;}
const sourceDefs=[['M5Stack Board Reference','M5Stack'],['Seeed Studio Board Reference','Seeed Studio'],['Waveshare Board Reference','Waveshare'],['XIAO Pinouts','Seeed Studio'],['Supplemental Chip References','Unattributed chip reference']];
const allowed=new Set(['.png','.jpg','.jpeg','.webp','.gif','.svg','.pdf','.xlsx','.docx']);
for(const [folder,brand] of sourceDefs){
 const root=path.join(workspace,folder);const index=new Map();
 for(const filename of ['_Index.csv','SOURCE_INDEX.csv'])try{for(const r of parseCSV(await fs.readFile(path.join(root,filename),'utf8')))index.set((r.Path||r.file||'').replaceAll('\\','/').toLowerCase(),r);}catch(e){if(e.code!=='ENOENT')throw e;}
 for(const file of await walk(root)){
  if(!allowed.has(path.extname(file).toLowerCase()))continue;
  const rel=path.relative(root,file).replaceAll('\\','/');const r=index.get(rel.toLowerCase())||{};
  const sourcePath=path.relative(workspace,file).replaceAll('\\','/');const data=await fs.readFile(file);const hash=digest(data);
  const name=r.Product||r.Board||r.board||(folder==='XIAO Pinouts'?path.basename(file).replace(/\.[^.]+$/,''):path.basename(path.dirname(file)));
  const originalType=r.Type||r.role||'Unreviewed reference';
  const matches=byHash.get(hash)||[];
  const exact=matches.filter(x=>normalize(x.board.name)===normalize(name)&&normalize(x.board.brand)===normalize(brand));
  if(exact.length||matches.length){
    for(const {asset,board} of exact.length?exact:matches){if(!asset.originals.includes(sourcePath))asset.originals.push(sourcePath);asset.aliases=[...new Set([...(asset.aliases||[]),name,path.basename(file),originalType])];board.aliases=[...new Set([...board.aliases,name])];}
    sourceCoverage.push({file:sourcePath,sha256:hash,status:'Indexed as a source alias of existing identical media',assetIds:(exact.length?exact:matches).map(x=>x.asset.id)});continue;
  }
  let board=[...boards.values()].find(b=>normalize(b.brand)===normalize(brand)&&normalize(b.name.replace(/^Arduino /,''))===normalize(name.replace(/^Arduino /,'')));
  if(!board){const id='source-board-'+digest(folder+'|'+name).slice(0,18);board=boards.get(id)||{id,name,brand,family:folder==='Supplemental Chip References'?'Chip reference':'Source collection',processor:inferProcessor(name+' '+(r.Family||'')),revision:'Unverified source identity',coverage:'Source collection; review pending',aliases:[],sources:[],assets:[],scope:'source'};boards.set(id,board);}
  const a=await addFile(board,{label:originalType,type:folder==='Supplemental Chip References'?'chip-package reference':'source reference',notes:'Original source index: '+originalType+'. This file is searchable but has not been promoted to a reviewed physical board pinout.',review:'Unreviewed source',sources:(r['Source Page']||r.source_pages||'').split(' | ').filter(s=>/^https?:/.test(s)),url:r['Source URL']||r.url||'',aliases:[name,path.basename(file),r.Family||r.family||'']},file);
  sourceCoverage.push({file:sourcePath,sha256:hash,status:'Indexed reference file',assetIds:[a.id]});
 }
}
function inferProcessor(name){const n=name.toUpperCase();for(const f of ['RP2350','RP2040','ESP32-S31','ESP32-S3','ESP32-S2','ESP32-C61','ESP32-C6','ESP32-C5','ESP32-C3','ESP32-C2','ESP32-H2','ESP32-P4','ESP8266','ESP8285','ESP32'])if(n.includes(f))return f;return '';}
let rendered=0,thumbnailFailures=[];
const thumbnailTargets=[...originals.keys()].filter(p=>/\.(png|jpg|jpeg|webp|gif|svg)$/i.test(p));
let cursor=0;
async function thumbWorker(){while(cursor<thumbnailTargets.length){const rel=thumbnailTargets[cursor++];const name=path.basename(rel,path.extname(rel));const out=`thumbs/${name}.webp`;
 try{if((await fs.stat(path.join(output,out))).size===0)throw new Error('Empty thumbnail');}catch{try{await sharp(path.join(output,rel),{limitInputPixels:500000000}).resize(600,430,{fit:'inside',withoutEnlargement:true}).flatten({background:'#ffffff'}).webp({quality:80}).toFile(path.join(output,out));rendered++;}catch(e){thumbnailFailures.push({file:rel,error:e.message});continue;}}
 fileManifest.add(out);
 try{const meta=await sharp(path.join(output,rel),{limitInputPixels:500000000}).metadata();if(meta.width*meta.height>20000000){const display=`display/${name}.webp`;try{await fs.access(path.join(output,display));}catch{await sharp(path.join(output,rel),{limitInputPixels:500000000}).resize(4096,4096,{fit:'inside'}).flatten({background:'#ffffff'}).webp({quality:94}).toFile(path.join(output,display));}fileManifest.add(display);}}catch(e){thumbnailFailures.push({file:rel,error:'Display preview: '+e.message});}
}}
await thumbWorker();
for(const board of boards.values()){
 for(const a of board.assets){const stem=path.basename(a.file,path.extname(a.file));const t=`thumbs/${stem}.webp`;if(fileManifest.has(t))a.thumb=t;const display=`display/${stem}.webp`;if(fileManifest.has(display))a.display=display;const failure=thumbnailFailures.find(f=>f.file===a.file);if(failure)a.previewError=failure.error;}
 board.assets.sort((a,b)=>rankType(a.type)-rankType(b.type));board.preview=board.assets.find(a=>a.thumb)?.thumb||'';
 board.processor=board.processor||inferProcessor(board.name);
 board.pinouts=board.assets.filter(a=>a.type==='pinout image').length;
 board.searchText=[board.name,board.brand,board.family,board.processor,...board.aliases,...board.assets.flatMap(a=>[a.label,a.type,...(a.aliases||[]),...a.originals])].join(' ');
}
function rankType(t){return {'pinout image':0,'GPIO reference image':1,'board labeling image':2,'original reference PDF':3,'source reference':4,'chip-package reference':5}[t]??6;}
let power=[];try{power=await readJSON(path.join(appRoot,'data','power-profiles.json'));}catch(e){if(e.code!=='ENOENT')throw e;}
for(const b of boards.values())b.powerIds=power.filter(p=>p.boardIds.includes(b.id)).map(p=>p.id);
const powerDir=path.join(appRoot,'data','power-sources');
for(const file of await fs.readdir(powerDir)){if(!file.endsWith('.pdf'))continue;const st=await fs.stat(path.join(powerDir,file));if(st.size===0)continue;await fs.copyFile(path.join(powerDir,file),path.join(output,'power',file));fileManifest.add('power/'+file);}
const allBoards=[...boards.values()];const allAssets=allBoards.flatMap(b=>b.assets);
const catalog={version:1,edition:'September 2026 · Workshop preview',generatedAt:new Date().toISOString(),boards:allBoards,power,stats:{boardsWithFiles:allBoards.filter(b=>b.assets.length).length,trackedBoards:allBoards.length,referenceEntries:allAssets.length,physicalPinouts:allAssets.filter(a=>a.type==='pinout image').length,brands:new Set(allBoards.filter(b=>b.assets.length).map(b=>b.brand)).size,uniqueMedia:originals.size,sourceFilesIndexed:sourceCoverage.length,libraryBytes:copiedBytes,powerProfiles:power.length}};
await fs.writeFile(path.join(appRoot,'public','catalog.json'),JSON.stringify(catalog));
await fs.writeFile(path.join(output,'catalog.json'),JSON.stringify(catalog));fileManifest.add('catalog.json');
await fs.writeFile(path.join(output,'manifest.json'),JSON.stringify([...fileManifest]));
await fs.writeFile(path.join(appRoot,'data','catalog-build-report.json'),JSON.stringify({stats:catalog.stats,thumbnailFailures,sourceCoverage,errors},null,2));
console.log(JSON.stringify({stats:catalog.stats,thumbnailsRendered:rendered,thumbnailFailures,errors},null,2));
