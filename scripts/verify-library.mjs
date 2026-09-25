import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
const root=path.resolve(process.argv[2]||'library');
const catalog=JSON.parse(await fs.readFile(path.join(root,'catalog.json'),'utf8'));
const manifest=new Set(JSON.parse(await fs.readFile(path.join(root,'manifest.json'),'utf8')));
const errors=[],media=new Map(),ids=new Set(),boards=new Set(catalog.boards.map(b=>b.id));
for(const b of catalog.boards)for(const a of b.assets){
 if(ids.has(a.id))errors.push('Repeated asset ID: '+a.id);ids.add(a.id);media.set(a.file,a.hash);
 for(const field of ['file','thumb','display','vector'])if(a[field]&&!manifest.has(a[field]))errors.push('Missing manifest entry: '+a[field]);
}
for(const rel of manifest){const resolved=path.resolve(root,rel);if(!resolved.startsWith(root+path.sep)){errors.push('Path outside library: '+rel);continue;}try{if(!(await fs.stat(resolved)).size)errors.push('Empty file: '+rel);}catch{errors.push('Missing file: '+rel);}}
for(const [rel,hash] of media){const actual=crypto.createHash('sha256').update(await fs.readFile(path.join(root,rel))).digest('hex');if(actual!==hash)errors.push('Media hash mismatch: '+rel);}
for(const p of catalog.power){for(const id of p.boardIds)if(!boards.has(id))errors.push('Unknown power board: '+id);for(const o of p.observations)if(!p.sources[o.source])errors.push('Missing observation source: '+p.id);}
if(catalog.power.find(p=>p.id==='espc5')?.boardIds.join()!=='espressif-esp32-esp32-c5-devkitc-1-v1-2')errors.push('ESP32-C5 power profile must match revision 1.2 exactly.');
const report={checkedAt:new Date().toISOString(),root,manifestFiles:manifest.size,hashedMedia:media.size,referenceEntries:ids.size,pinouts:catalog.boards.flatMap(b=>b.assets).filter(a=>a.type==='pinout image').length,errors};
await fs.mkdir('data/qa',{recursive:true});await fs.writeFile('data/qa/library-validation.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(errors.length)process.exitCode=1;
