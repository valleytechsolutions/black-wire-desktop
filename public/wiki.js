(() => {
 const button=document.querySelector('.wiki-theme');
 const refresh=()=>{button.textContent=document.documentElement.dataset.theme==='dark'?'Light mode':'Dark mode';};
 if(button){button.hidden=false;refresh();button.addEventListener('click',()=>{const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;try{localStorage.setItem('blackwire-theme',theme);}catch{}refresh();});}
 const input=document.querySelector('.directory-search input');
 if(input){input.parentElement.hidden=false;const rows=[...document.querySelectorAll('tbody tr')],count=document.querySelector('.directory-count');const filter=()=>{const words=input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);for(const r of rows)r.hidden=!words.every(w=>r.textContent.toLowerCase().includes(w));count.textContent=`${rows.filter(r=>!r.hidden).length} of ${rows.length} listings`;};input.addEventListener('input',filter);filter();}
})();
