import React,{useEffect,useRef,useState} from 'react';
import {getDocument,GlobalWorkerOptions} from 'pdfjs-dist';
import workerURL from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
GlobalWorkerOptions.workerSrc=workerURL;

export default function PdfViewer({url,label,zoom,rotation}){
 const host=useRef(null),canvas=useRef(null),[doc,setDoc]=useState(null),[pageNumber,setPageNumber]=useState(1),[width,setWidth]=useState(700),[error,setError]=useState(''),[rendered,setRendered]=useState(false);
 useEffect(()=>{
  const parent=host.current.parentElement;
  const observer=new ResizeObserver(()=>setWidth(Math.max(200,parent.clientWidth-48)));observer.observe(parent);
  return()=>observer.disconnect();
 },[]);
 useEffect(()=>{
  let stopped=false,task;const abort=new AbortController();setDoc(null);setError('');setPageNumber(1);
  (async()=>{
   try{
    const r=await fetch(url,{signal:abort.signal});if(!r.ok)throw new Error('PDF file could not be opened.');
    task=getDocument({data:new Uint8Array(await r.arrayBuffer()),cMapUrl:'/pdf/cmaps/',cMapPacked:true,standardFontDataUrl:'/pdf/standard_fonts/',wasmUrl:'/pdf/wasm/',isEvalSupported:false});
    const next=await task.promise;if(!stopped)setDoc(next);
   }catch(e){if(!stopped)setError(e.message);}
  })();
  return()=>{stopped=true;abort.abort();task?.destroy();};
 },[url]);
 useEffect(()=>{
  if(!doc)return;let stopped=false,renderTask;setRendered(false);
  (async()=>{try{
   const page=await doc.getPage(pageNumber);if(stopped)return;
   const viewport=page.getViewport({scale:1,rotation}),ratio=Math.min(window.devicePixelRatio||1,2);
   const scaled=page.getViewport({scale:width*zoom/viewport.width*ratio,rotation});
   const node=canvas.current;node.width=Math.ceil(scaled.width);node.height=Math.ceil(scaled.height);node.style.width=`${scaled.width/ratio}px`;node.style.height=`${scaled.height/ratio}px`;
   renderTask=page.render({canvasContext:node.getContext('2d'),viewport:scaled});await renderTask.promise;if(!stopped)setRendered(true);
  }catch(e){if(!stopped&&e.name!=='RenderingCancelledException')setError(e.message);}})();
  return()=>{stopped=true;renderTask?.cancel();};
 },[doc,pageNumber,width,zoom,rotation]);
 return <div ref={host} className="pdf-viewer" onPointerDown={e=>e.stopPropagation()}>
  <div className="pdf-page-controls"><button className="secondary-button" disabled={!doc||pageNumber<=1} onClick={()=>setPageNumber(n=>n-1)}>Previous page</button><span role="status">{doc?`Page ${pageNumber} of ${doc.numPages}`:'Opening document…'}</span><button className="secondary-button" disabled={!doc||pageNumber>=doc.numPages} onClick={()=>setPageNumber(n=>n+1)}>Next page</button></div>
  {error?<p role="alert">The PDF preview could not load: {error} Use Save original to open the document separately.</p>:<><canvas ref={canvas} role="img" aria-label={`${label}, page ${pageNumber}`} data-rendered={rendered?'true':'false'}/>{!rendered&&<p className="pdf-loading">Rendering reference page…</p>}</>}
 </div>;
}
