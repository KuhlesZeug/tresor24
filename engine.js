// Grundfunktionen: Zustand, Zeit, Ton, Bildschirme
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e};
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const params=new URLSearchParams(location.search);
const KEY='tz_tresor24_v1';

let st={ok:0,cn:'',sel:'',intro:0,solved:{},hint:{},seen:{},sound:true,frag:{},items:{},glitch:{},calls:{},start:0};
try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s)st=Object.assign(st,s)}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}};
let GIFT=null; // {an,von,cn,msg,ort,mode}

// Text mit Platzhaltern
const T=t=>String(t||'').replace(/\{CN\}/g,esc(st.cn||'Agent')).replace(/\{AN\}/g,esc(GIFT&&GIFT.an||'')).replace(/\{VON\}/g,esc(GIFT&&GIFT.von||'jemand, der dich gut kennt'));

// Zeit: deutsche Zeit, Serverzeit wenn möglich
let PROBE=false,skew=0;
const timeReady=(async()=>{
 const q=params.get('probe');if(q&&await TZ.sha(q)===TZ.PROBE)PROBE=true;
 try{const r=await fetch(location.href.split('#')[0],{method:'HEAD',cache:'no-store'});const d=r.headers.get('date');if(d)skew=new Date(d).getTime()-Date.now()}catch(e){}
})();
function now(){return new Date(Date.now()+skew)}
function berlin(){const p=new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',hourCycle:'h23'}).formatToParts(now());const o={};p.forEach(x=>o[x.type]=+x.value);return o}
function unlocked(d){if(PROBE)return true;const b=berlin();if(b.month===12)return b.day>=d;if(b.month===1||b.month===2)return true;return false}
function maxDay(){let m=0;for(let d=1;d<=24;d++)if(unlocked(d))m=d;return m}
function isNight(){const h=berlin().hour;return h>=22||h<5}

// Ton
let AC=null,master=null,musBus=null,sfxBus=null,voBus=null;
const BUF={};
function ac(){if(!AC){AC=new (window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=st.sound?1:0;master.connect(AC.destination);musBus=AC.createGain();musBus.gain.value=.5;musBus.connect(master);sfxBus=AC.createGain();sfxBus.gain.value=.9;sfxBus.connect(master);voBus=AC.createGain();voBus.gain.value=1;voBus.connect(master)}if(AC.state==='suspended')AC.resume();return AC}
async function loadBuf(src){if(BUF[src])return BUF[src];const p=fetch(src).then(r=>{if(!r.ok)throw 0;return r.arrayBuffer()}).then(a=>new Promise((ok,no)=>ac().decodeAudioData(a,ok,no))).catch(()=>null);BUF[src]=p;return p}
let mus=null;
async function music(src,vol){ac();if(mus&&mus.src===src){mus.g.gain.setTargetAtTime(vol??.5,AC.currentTime,.6);return}
 const old=mus;if(old){old.g.gain.setTargetAtTime(0,AC.currentTime,.8);setTimeout(()=>{try{old.s.stop()}catch(e){}},3000)}
 mus=null;if(!src)return;const b=await loadBuf(src);if(!b)return;const s=AC.createBufferSource();s.buffer=b;s.loop=true;const g=AC.createGain();g.gain.value=0;s.connect(g);g.connect(musBus);s.start();g.gain.setTargetAtTime(vol??.5,AC.currentTime,1.2);mus={src,s,g}}
function duck(on){if(!musBus)return;musBus.gain.setTargetAtTime(on?.16:.5,AC.currentTime,.25)}
async function sfx(name,vol){if(!st.sound)return;ac();const src='a/sfx_'+name+'.mp3';const b=await loadBuf(src);if(b){const s=AC.createBufferSource();s.buffer=b;const g=AC.createGain();g.gain.value=vol??1;s.connect(g);g.connect(sfxBus);s.start();return}SYN[name]&&SYN[name]()}
// Ersatzklänge, falls eine Datei fehlt
function tone(f,d,type,v,t0){const c=ac(),o=c.createOscillator(),g=c.createGain();o.type=type||'sine';o.frequency.value=f;const t=c.currentTime+(t0||0);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v||.15,t+.01);g.gain.exponentialRampToValueAtTime(.0005,t+d);o.connect(g);g.connect(sfxBus);o.start(t);o.stop(t+d+.05)}
const SYN={
 ok(){tone(660,.12,'triangle',.18);tone(990,.25,'triangle',.18,.1)},
 bad(){tone(180,.25,'square',.08);tone(140,.3,'square',.08,.12)},
 tap(){tone(1200,.04,'sine',.08)},
 type(){tone(1800+Math.random()*400,.015,'square',.03)},
 open(){tone(440,.1,'sine',.1);tone(880,.18,'sine',.1,.08)},
 glitch(){for(let i=0;i<10;i++)tone(80+Math.random()*1800,.04,'sawtooth',.05,i*.03)},
 ring(){for(let i=0;i<2;i++){tone(1040,.4,'sine',.12,i*.5);tone(1300,.4,'sine',.08,i*.5)}}
};

// Stimmen
let curVo=null;
function stopVo(){if(curVo){try{curVo.pause()}catch(e){}curVo._ui&&curVo._ui(false);curVo=null;duck(false)}}
function playVo(src,ui){stopVo();if(!src||!st.sound)return null;ac();const a=new Audio(src);a.preload='auto';a._ui=ui;curVo=a;duck(true);ui&&ui(true);a.onended=()=>{ui&&ui(false);if(curVo===a){curVo=null;duck(false)}};a.onerror=()=>{ui&&ui(false);if(curVo===a){curVo=null;duck(false)}};a.play().catch(()=>{ui&&ui(false);duck(false)});return a}

function setSound(on){st.sound=on;save();if(master)master.gain.value=on?1:0;if(!on)stopVo();$$('.btn-snd').forEach(b=>b.innerHTML=on?IC.sound:IC.mute)}

// Bildschirme
let curScreen='#s-boot';
function show(id){$$('.screen').forEach(s=>s.classList.remove('on'));const s=$(id);s.classList.add('on');window.scrollTo(0,0);curScreen=id;document.dispatchEvent(new CustomEvent('screen',{detail:id}))}
function toast(t,ms){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),ms||2800)}
function viewer(h,wide){$('#v-body').innerHTML=h;const v=$('#viewer');v.classList.add('on');v.setAttribute('aria-hidden','false');sfx('paper',.6)}
function closeViewer(){$('#viewer').classList.remove('on');$('#viewer').setAttribute('aria-hidden','true');stopVo()}

// Symbole als feine Linien
const IC={
 sound:'<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 010 6M18.5 6.5a7.5 7.5 0 010 11"/></svg>',
 mute:'<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l5 5M22 9l-5 5"/></svg>',
 back:'<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
 close:'<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
 akte:'<svg viewBox="0 0 24 24"><path d="M4 6h6l2 2h8v11H4z"/><path d="M4 10h16"/></svg>',
 doc:'<svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 12h7M9 16h7"/></svg>',
 audio:'<svg viewBox="0 0 24 24"><path d="M3 12h2M7 8v8M11 5v14M15 9v6M19 7v10M21 12h0"/></svg>',
 phone:'<svg viewBox="0 0 24 24"><rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/></svg>',
 map:'<svg viewBox="0 0 24 24"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/></svg>',
 lock:'<svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/></svg>',
 key:'<svg viewBox="0 0 24 24"><circle cx="8" cy="12" r="4"/><path d="M12 12h9M18 12v3M21 12v2"/></svg>',
 radio:'<svg viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M7 8l9-5"/><circle cx="15" cy="14" r="3"/><path d="M6 12h3M6 15h3"/></svg>',
 mail:'<svg viewBox="0 0 24 24"><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/></svg>',
 help:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 114.2 1.9c-.9.7-1.8 1.2-1.8 2.7"/><path d="M12 17.2v.1"/></svg>',
 play:'<svg viewBox="0 0 24 24"><path d="M7 5l12 7-12 7z"/></svg>',
 pause:'<svg viewBox="0 0 24 24"><path d="M7 5h3v14H7zM14 5h3v14h-3z"/></svg>',
 eye:'<svg viewBox="0 0 24 24"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
 accept:'<svg viewBox="0 0 24 24"><path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.6 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.6 3.6a1 1 0 01-.25 1z"/></svg>',
 decline:'<svg viewBox="0 0 24 24" style="transform:rotate(135deg)"><path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.6 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.6 3.6a1 1 0 01-.25 1z"/></svg>'
};

// Gerät, nur lokal ausgelesen
function device(){const u=navigator.userAgent;let d='einem Handy';if(/iPhone/.test(u))d='einem iPhone';else if(/iPad/.test(u))d='einem iPad';else if(/Android/.test(u))d='einem Android Handy';else if(/Mac/.test(u))d='einem Mac';else if(/Windows/.test(u))d='einem Windows Rechner';return d}
function clock(){const b=berlin();return String(b.hour).padStart(2,'0')+':'+String(b.minute).padStart(2,'0')}
