import {pinPriority} from './pin-coverage.mjs';
export function makerAssets(part,catalog){
 const seen=new Set();
 const assets=[...(part.assets||[]),...catalog.boards.filter(b=>part.boardIds.includes(b.id)).flatMap(b=>b.assets)];
 return assets.filter(a=>{if(seen.has(a.file))return false;seen.add(a.file);return true;})
  .sort((a,b)=>pinPriority(a)-pinPriority(b));
}
export const hasVisual=a=>!!a.thumb||['jpg','jpeg','png','webp','gif','svg'].includes(a.extension);
