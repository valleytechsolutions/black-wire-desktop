import React,{useState} from 'react';
import {Plus,Minus,Maximize2,Download,Image as ImageIcon} from 'lucide-react';
import {libraryURL} from './runtime.mjs';
const PdfViewer=React.lazy(()=>import('./PdfViewer.jsx'));

export default function MakerGallery({part,assets,SourceLink}){
 const [index,setIndex]=useState(0),[zoom,setZoom]=useState(1),[error,setError]=useState('');
 const a=assets[index];
 async function save(){try{if(window.blackwire)await window.blackwire.saveAsset(a.file,part.name+' - '+a.label);else{const link=document.createElement('a');link.href=libraryURL(a.file);link.download=part.name+' - '+a.label+'.'+a.extension;link.click();}}catch(e){setError(e.message);}}
 if(!a)return <section className="maker-missing"><ImageIcon size={24}/><h3>Image still needed</h3><p>No matching physical reference image has been collected for this record. Its source and revision remain in the coverage queue.</p></section>;
 const raster=['jpg','jpeg','png','webp','gif','svg'].includes(a.extension);
 return <section className="maker-gallery" aria-label="Module reference images"><div className="maker-gallery-heading"><h3>Visual references <span>{assets.length}</span></h3><span>{a.type}{a.partial?' · partial':''}</span></div>
  <div className="maker-image-tools"><button className="icon-button" aria-label="Zoom reference out" disabled={zoom<=1} onClick={()=>setZoom(v=>Math.max(1,v-.5))}><Minus size={18}/></button><span>{Math.round(zoom*100)}%</span><button className="icon-button" aria-label="Zoom reference in" disabled={zoom>=4} onClick={()=>setZoom(v=>Math.min(4,v+.5))}><Plus size={18}/></button><button className="icon-button" aria-label="Fit reference" onClick={()=>setZoom(1)}><Maximize2 size={18}/></button><button className="secondary-button" onClick={save}><Download size={16}/>Save original</button></div>
  <div className="maker-image-stage" tabIndex={0} aria-label="Reference image; scroll to pan when zoomed">{raster&&!error?<img style={{width:`${zoom*100}%`}} src={libraryURL(a.display||a.file)} alt={part.name+' — '+a.label} onError={()=>setError('The image could not be decoded. Save the original or consult its source.')}/>:a.extension==='pdf'?<React.Suspense fallback={<p>Opening PDF…</p>}><PdfViewer url={libraryURL(a.file)} label={a.label} zoom={zoom} rotation={0}/></React.Suspense>:<p>{error||'Save this original to open it with a compatible viewer.'}</p>}</div>
  <div className="maker-image-caption"><b>{a.label}</b><span>{a.review} · {a.width&&a.height?`${a.width} × ${a.height} · `:''}{a.extension.toUpperCase()}</span><p>{a.notes}</p><details><summary>Credit, source & rights</summary><p>{a.rights}</p>{[...new Set([...(a.sources||[]),a.url].filter(Boolean))].map((url,i)=><SourceLink key={url} url={url}>Source {i+1}</SourceLink>)}<code>SHA-256 {a.hash}</code></details></div>
  {assets.length>1&&<div className="maker-image-strip" aria-label="Choose reference">{assets.map((asset,i)=><button key={asset.file} aria-pressed={index===i} aria-label={'Show reference '+(i+1)+': '+asset.label} onClick={()=>{setIndex(i);setZoom(1);setError('');}}>{asset.thumb?<img loading="lazy" src={libraryURL(asset.thumb)} alt=""/>:<ImageIcon size={24}/>}<span>{asset.label}</span><small>{asset.type}</small></button>)}</div>}
 </section>;
}
