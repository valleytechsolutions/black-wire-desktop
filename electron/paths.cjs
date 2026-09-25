const path=require('node:path');
function contained(root,relative){
 if(typeof relative!=='string'||relative.includes('\0')||relative.includes('\\'))return null;
 const file=path.resolve(root,relative);const rel=path.relative(root,file);
 return rel.startsWith('..')||path.isAbsolute(rel)?null:file;
}
function externalURL(value){try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)&&!u.username&&!u.password?u.href:null;}catch{return null;}}
module.exports={contained,externalURL};
