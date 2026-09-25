import {useState} from 'react';
import {appAsset} from './runtime.mjs';

const documents=[
 ['MIT.txt','Original application code — MIT'],
 ['CC-BY-4.0.txt','Original guide material — CC BY 4.0'],
 ['NOTICE.md','Creator attribution and reuse'],
 ['LICENSING.md','License scope and third-party artwork'],
 ['THIRD_PARTY_NOTICES.txt','Bundled interface software credits'],
];

export default function LicenseNotices(){
 const [texts,setTexts]=useState({});
 async function load(name){
  if(texts[name])return;
  try{
   const response=await fetch(appAsset('licenses/'+name));
   if(!response.ok)throw new Error('Unavailable');
   const value=await response.text();
   setTexts(current=>({...current,[name]:value}));
  }catch{setTexts(current=>({...current,[name]:'This notice could not be loaded. Please reopen the guide and try again.'}));}
 }
 return <section className="license-notices"><h2>Made to be shared. Keep the credit.</h2><p>Copyright 2026 Kal (Your Pal Kal) / Valleytech Solutions. Original app code is MIT licensed. Original guide material is CC BY 4.0: give credit, link the license and note changes. Manufacturer diagrams keep their own credits and terms.</p>{documents.map(([name,label])=><details key={name} onToggle={event=>{if(event.currentTarget.open)load(name);}}><summary>{label}</summary><pre>{texts[name]||'Loading notice…'}</pre></details>)}</section>;
}
