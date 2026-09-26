import React, {useState, useEffect} from 'react';
import {Sun, Moon} from 'lucide-react';
import {appAsset} from './runtime.mjs';

export function BrandMark({alt = 'Black Wire logo', ...props}) {
  return <picture className="brand-mark" {...props}>
    <img className="brand-dark" src={appAsset('brand/black-wire-red.png')} alt={alt}/>
    <img className="brand-light" src={appAsset('brand/black-wire.png')} alt={alt}/>
  </picture>;
}

export function ThemeSwitch() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  const [temporary, setTemporary] = useState(false);
  useEffect(() => {
    const sync = e => { if (e.key === 'blackwire-theme') apply(e.newValue === 'light' ? 'light' : 'dark', false); };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  function apply(value, persist = true) {
    setTheme(value);
    document.documentElement.dataset.theme = value;
    document.documentElement.style.colorScheme = value;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', value === 'dark' ? '#151514' : '#f7f5f0');
    if (persist) {
      try { localStorage.setItem('blackwire-theme', value); setTemporary(false); }
      catch { setTemporary(true); }
    }
  }
  return <div className="theme-control">
    <div className="theme-switch" role="group" aria-label="Color theme">
      <button type="button" aria-label="Dark mode" aria-pressed={theme === 'dark'} onClick={() => apply('dark')} title="Dark mode"><Moon size={15}/><span>Dark</span></button>
      <button type="button" aria-label="Light mode" aria-pressed={theme === 'light'} onClick={() => apply('light')} title="Light mode"><Sun size={15}/><span>Light</span></button>
    </div>
    {temporary && <span className="theme-storage-note" role="status">Theme applies to this visit; browser storage is unavailable.</span>}
  </div>;
}

export function HeroArtwork() {
  return <div className="hero-artwork" aria-hidden="true">
    <div className="hero-art-label">THE BLACK WIRE WORKBENCH</div>
    <svg className="hero-circuit" viewBox="0 0 420 300" fill="none">
      <g stroke="currentColor" strokeWidth="1.2">
        <path d="M0 60h80l55 55h28M0 130h95l24 24h44M0 240h76l55-55h32M420 55h-75l-58 60h-28M420 135h-90l-22 20h-49M420 240h-83l-52-55h-26M195 0v80M226 0v80M195 220v80M226 220v80"/>
        <rect x="148" y="81" width="124" height="139" rx="18"/>
        <rect x="139" y="72" width="142" height="157" rx="23" opacity=".35"/>
        {[60,130,240].map((y,i)=><circle key={y} cx={i===1?24:50} cy={y} r="4"/>)}
        <circle cx="367" cy="55" r="4"/><circle cx="388" cy="135" r="4"/><circle cx="370" cy="240" r="4"/>
      </g>
    </svg>
    <div className="hero-emblem"><BrandMark alt=""/></div>
    <span className="circuit-label circuit-left">REFERENCE</span>
    <span className="circuit-label circuit-right">CONNECT</span>
    <div className="hero-art-bottom"><span/>FROM PIN TO POSSIBILITY</div>
  </div>;
}
