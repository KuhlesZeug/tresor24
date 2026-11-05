// Zugang, Geschenklinks und Codeprüfung. Lösungen stehen nur als Hash im Code.
window.TZ={
 SALT:'de824e197addb7fa7c0aa0e1b2015ceb',
 ACCESS:'9a22d85e2cd2089e12e31d38f4ac0704e537ba79d57384f38ac2a7dd1e335941',
 PROBE:'e2a7108956095ae3080ae2052b7579c949b2483c60c8d3e885d8f1507c275174'
};
TZ.sha=async s=>{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')};
TZ.norm=s=>(s||'').toUpperCase().replace(/Ä/g,'AE').replace(/Ö/g,'OE').replace(/Ü/g,'UE').replace(/ß/g,'SS').replace(/[^A-Z0-9]/g,'');
TZ.hash=s=>TZ.sha(TZ.SALT+'|'+TZ.norm(s));
// Geschenklink: Daten im Link, leicht verschleiert und signiert
TZ.key=()=>{const h=TZ.SALT+TZ.ACCESS;const k=[];for(let i=0;i<h.length;i+=2)k.push(parseInt(h.substr(i,2),16)||7);return k};
TZ.hide=s=>{const b=new TextEncoder().encode(s),k=TZ.key();let r='';b.forEach((x,i)=>r+=String.fromCharCode(x^k[i%k.length]^(i*13&255)));return btoa(r).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')};
TZ.show=s=>{try{const r=atob(s.replace(/-/g,'+').replace(/_/g,'/')),k=TZ.key(),b=new Uint8Array(r.length);for(let i=0;i<r.length;i++)b[i]=r.charCodeAt(i)^k[i%k.length]^(i*13&255);return new TextDecoder().decode(b)}catch(e){return ''}};
TZ.sig=async o=>(await TZ.sha(TZ.ACCESS+'|'+JSON.stringify(o))).slice(0,10);
TZ.pack=async o=>{const s=await TZ.sig(o);return TZ.hide(JSON.stringify({o,s}))};
TZ.unpack=async g=>{try{const j=JSON.parse(TZ.show(g));if(!j||!j.o)return null;if(await TZ.sig(j.o)!==j.s)return null;return j.o}catch(e){return null}};
