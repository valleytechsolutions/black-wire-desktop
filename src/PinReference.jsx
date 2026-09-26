import React,{useState} from 'react';
import {CircuitBoard,Search} from 'lucide-react';
import {pinCoverage,coverageLabels} from './pin-coverage.mjs';
export function CoverageBadge({record}){const c=pinCoverage(record);return <span className={'coverage-badge '+c.status}><CircuitBoard size={13}/>{coverageLabels[c.status]}</span>;}
export function CoverageSummary({record}){const c=pinCoverage(record);return <div className={'coverage-summary '+c.status}><CoverageBadge record={record}/><p>{c.scope}</p></div>;}
export default function PinReference({record,SourceLink}){
 const [filter,setFilter]=useState('');const refs=record.pinReferences||[];
 if(!refs.length)return null;
 const q=filter.trim().toLowerCase();
 return <section className="pin-reference"><div className="pin-reference-heading"><div><span className="eyebrow">CONNECTION REFERENCE</span><h3>Pin names & purpose</h3></div><label className="pin-find"><Search size={16}/><input aria-label="Find a pin or function" placeholder="Find SDA, reset, ground…" value={filter} onChange={e=>setFilter(e.target.value)}/></label></div>{refs.map((r,i)=>{const pins=r.pins.filter(p=>!q||[p.label,p.position,p.purpose,p.notes].join(' ').toLowerCase().includes(q));return <div className="pin-connector" key={i}><h4>{r.connector}</h4><p>{r.scope}</p>{r.orientation&&<p><b>Orientation:</b> {r.orientation}</p>}<div className="pin-table-scroll"><table><thead><tr><th>Board label / position</th><th>Purpose</th><th>Connection notes</th></tr></thead><tbody>{pins.map((p,n)=><tr key={n}><td><code>{p.label}</code>{p.position&&<small>{p.position}</small>}</td><td>{p.purpose}</td><td>{p.notes||'See exact source and revision.'}</td></tr>)}</tbody></table>{!pins.length&&<p>No pins match this filter in this connector.</p>}</div><div className="pin-evidence"><SourceLink url={r.source.url}>Manufacturer evidence</SourceLink><span>{r.source.locator} · {r.review}</span></div></div>;})}</section>;
}
