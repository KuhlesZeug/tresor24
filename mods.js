// Interaktive Module für Tag 4 bis 8, Fragmente, Videoanruf, Easter Egg
window.MODS={};

// Tag 4: Live Karte der Kameras
MODS.net=m=>{viewer('<div class="live"><div class="live-h"><span class="fk-dot"></span><b>LIVE</b><span>Aurelion Kameranetz · Schnellbahn Innenstadt</span></div>'+netSVG('live')+'<div class="live-scan"></div></div><p class="small">Jedes Symbol ist eine aktive Kamera an dieser Station. Die Stationsnamen hat Bit nicht mitbekommen. Die stehen auf deinem Stadtplan.</p>');sfx('static',.35)};

// Tag 5: Decoderscheibe
MODS.wheel=m=>{const A='ABCDEFGHIJKLMNOPQRSTUVWXYZ',st5=360/26;let k=st.wheel||0;
 const ring=(r,cls)=>A.split('').map((c,i)=>{const a=(i*st5-90)*Math.PI/180;return '<text x="'+(150+r*Math.cos(a)).toFixed(1)+'" y="'+(150+r*Math.sin(a)+5).toFixed(1)+'" text-anchor="middle" class="'+cls+'" transform="rotate('+(i*st5).toFixed(2)+' '+(150+r*Math.cos(a)).toFixed(1)+' '+(150+r*Math.sin(a)).toFixed(1)+')">'+c+'</text>'}).join('');
 const ticks=A.split('').map((c,i)=>'<line x1="150" y1="22" x2="150" y2="30" transform="rotate('+((i+.5)*st5).toFixed(2)+' 150 150)"/>').join('');
 viewer('<div class="wheel-w"><div class="kick" style="text-align:center">Decoderscheibe H. S.</div><svg viewBox="0 0 300 300" class="wheel" id="wh"><circle cx="150" cy="150" r="146" class="w-out"/><g class="w-tk">'+ticks+'</g>'+ring(128,'w-a')+'<g id="wh-in" style="transform-origin:150px 150px"><circle cx="150" cy="150" r="112" class="w-in"/>'+ring(96,'w-b')+'<circle cx="150" cy="150" r="70" class="w-hub"/><path d="M150 84 L156 98 L144 98Z" class="w-arrow"/></g><text x="150" y="146" text-anchor="middle" class="w-k" id="wh-k"></text><text x="150" y="166" text-anchor="middle" class="w-kl">Verschiebung</text><path d="M150 4 L158 18 L142 18Z" class="w-mark"/></svg>'+
  '<div class="wheel-c"><button class="icon" id="wh-m" aria-label="Zurückdrehen">'+IC.back+'</button><span id="wh-t"></span><button class="icon" id="wh-p" aria-label="Weiterdrehen" style="transform:scaleX(-1)">'+IC.back+'</button></div><p class="small" style="text-align:center">Außen Klartext, innen Geheimtext. Ziehen oder Pfeile nutzen.</p></div>');
 const inn=$('#wh-in'),set=(v,snd)=>{k=((v%26)+26)%26;st.wheel=k;save();inn.style.transform='rotate('+(-k*st5)+'deg)';$('#wh-k').textContent=k;$('#wh-t').textContent='A über '+A[k];if(snd)tone(1500+k*20,.03,'square',.05)};
 set(k);$('#wh-m').onclick=()=>set(k-1,1);$('#wh-p').onclick=()=>set(k+1,1);
 const svg=$('#wh');let drag=null;const ang=e=>{const r=svg.getBoundingClientRect();return Math.atan2(e.clientY-r.top-r.height/2,e.clientX-r.left-r.width/2)*180/Math.PI};
 svg.addEventListener('pointerdown',e=>{drag={a:ang(e),k};svg.setPointerCapture(e.pointerId)});
 svg.addEventListener('pointermove',e=>{if(!drag)return;let d=ang(e)-drag.a;const nk=drag.k-Math.round(d/st5);if(((nk%26)+26)%26!==k)set(nk,1)});
 svg.addEventListener('pointerup',()=>drag=null)};

// Tag 6: Kontaktmann, Ersatznachricht ab 18:20 Uhr
const KONTAKT='Mira lässt ausrichten: Der Jäger steht am Winterhimmel. Drei Sterne bilden seinen Gürtel. Sein Name öffnet Etage 6.';
function contactOpen(){if(PROBE)return true;const b=berlin();if(b.month===12)return b.day>6||(b.day===6&&(b.hour>18||(b.hour===18&&b.minute>=20)));return b.month<3}
MODS.contact=m=>{const ok=contactOpen()||(st.hint[6]||0)>=1;
 viewer('<div class="ct"><div class="ct-av">'+IC.phone+'</div><div class="kick">Kontaktmann</div><h3>'+(ok?'Nachricht abgefangen':'Wartet auf Kontakt')+'</h3>'+
  '<p>Dein Kontaktmann schreibt dir heute ab 18 Uhr auf dein echtes Handy. Er ist jemand, den du kennst. Lies genau, was er schreibt.</p>'+
  (ok?'<p class="small">Keine Nachricht bekommen? Bit hat sie mitgeschnitten:</p><div class="bubble"><span>Unbekannt · 18:00</span>'+esc(KONTAKT)+'</div>':'<div class="ct-wait"><span class="fk-dot"></span>Ersatzweg öffnet heute um 18:20 Uhr</div>')+'</div>');
 if(ok&&!st.calls.d6msg){st.calls.d6msg=1;save();addMsg({who:'mira',name:'Kontaktmann',kind:'Nachricht',text:KONTAKT,read:1})}};

// Tag 6: Sternkarte
MODS.sky=m=>{let r=11;const rnd=()=>(r=(r*9301+49297)%233280)/233280;let s='<svg viewBox="0 0 360 300" class="sky" role="img" aria-label="Sternkarte">';
 for(let i=0;i<140;i++)s+='<circle cx="'+(rnd()*360).toFixed(1)+'" cy="'+(rnd()*300).toFixed(1)+'" r="'+(rnd()*.9+.3).toFixed(2)+'" class="bg" style="animation-delay:'+(rnd()*4).toFixed(2)+'s"/>';
 const C=[['ORION',[[236,124],[212,150],[264,146],[228,196],[240,199],[252,202],[214,250],[266,246]],[[0,1],[0,2],[1,3],[2,5],[3,4],[4,5],[3,6],[5,7]],[240,276]],
  ['STIER',[[110,120],[130,140],[146,150],[132,160],[100,160],[80,100]],[[0,1],[1,2],[2,3],[3,4],[0,5]],[110,186]],
  ['ZWILLINGE',[[300,40],[318,46],[290,90],[312,96],[284,130],[306,136]],[[0,2],[2,4],[1,3],[3,5]],[300,26]],
  ['KASSIOPEIA',[[30,40],[52,60],[74,46],[96,66],[120,50]],[[0,1],[1,2],[2,3],[3,4]],[75,28]],
  ['GROSSER WAGEN',[[20,226],[44,232],[66,244],[90,250],[98,276],[62,280]],[[0,1],[1,2],[2,3],[3,4],[4,5],[5,2]],[60,212]]];
 C.forEach(([n,P,E,L])=>{E.forEach(([a,b])=>s+='<line x1="'+P[a][0]+'" y1="'+P[a][1]+'" x2="'+P[b][0]+'" y2="'+P[b][1]+'" class="cl"/>');P.forEach(p=>s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="2.6" class="st"/>');s+='<text x="'+L[0]+'" y="'+L[1]+'" text-anchor="middle" class="cn">'+n+'</text>'});
 viewer('<div class="kick">Himmel über Lumenstadt</div><h3 style="margin:4px 0 10px;font-family:var(--hud)">Sternkarte Dezember, 22 Uhr</h3>'+s+'</svg><p class="small">Fünf Sternbilder, die man im Dezember über der Stadt sieht.</p>')};

// Tag 7: abgefangenes Telefonat
const CHAT=[['a','Frau Kranz, noch etwas wegen Herrn Brenner, unserem Sicherheitschef. Er ist da sehr eigen.'],['k','Kein Problem. Was wünscht er sich?'],['a','Er sitzt immer mit Blick zur Bühne. Er will Herrn Halden die ganze Zeit sehen können.'],['k','Dann vielleicht erste Reihe? Da sieht man am besten.'],['a','Bloß nicht. Vorne stehen die Fotografen, und er hasst Kameras.'],['k','Und hinten rechts, direkt am Notausgang?'],['a','Auch nicht. An den Tischen direkt am Notausgang zieht es, sagt er.'],['k','Dann setze ich ihn zu Herrn Halden an den Tisch?'],['a','Nein. Die beiden streiten seit dem Sommer. Nicht an einen Tisch.'],['k','Gibt es sonst noch jemanden, den er meiden will?'],['a','Seine Schwester Clara. Die steht schon auf Ihrem Plan. Mit der redet er seit Jahren nicht. Nicht an ihren Tisch.'],['k','Gut. Dann habe ich genau einen passenden Platz für ihn.'],['a','Perfekt. Und schwärzen Sie seinen Namen auf dem Plan. Niemand soll wissen, wo er sitzt.']];
MODS.chat=async m=>{viewer('<div class="chat"><div class="chat-h"><span class="fk-dot"></span><div><b>Mitschnitt 09.12., 14:12 Uhr</b><span>S. Mertens, Assistenz Halden · M. Kranz, Eventplanung</span></div></div><div id="chat-b"></div></div>');
 const box=$('#chat-b'),fast=st.calls.d7chat;for(const [w,t] of CHAT){if(!document.body.contains(box))return;
  const ty=el('div','msg '+w+' typing','<i></i><i></i><i></i>');box.appendChild(ty);if(!fast){await sleep(500+t.length*12)}ty.className='msg '+w;ty.innerHTML='<span>'+(w==='a'?'Mertens':'Kranz')+'</span>'+esc(t);if(!fast)tone(w==='a'?880:660,.04,'sine',.05);ty.scrollIntoView({block:'nearest'});if(!fast)await sleep(250)}
 st.calls.d7chat=1;save()};

// Tag 8: Karte auslesen, Handy ruhig halten
MODS.clone=m=>{const HEX=['48','41','4C','4F'];let p=0,run=false,last=null,still=0,mode='',raf=0,iv=0;
 viewer('<div class="cl-w"><svg viewBox="0 0 300 180" class="kcard"><defs><linearGradient id="kc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1b2338"/><stop offset="1" stop-color="#0b0f1a"/></linearGradient></defs><rect x="6" y="6" width="288" height="168" rx="14" fill="url(#kc)" stroke="#d9b46a" stroke-opacity=".6"/><rect x="26" y="52" width="44" height="34" rx="6" fill="#d9b46a" opacity=".85"/><path d="M26 69h44M48 52v34" stroke="#0b0f1a" stroke-width="1.5"/><text x="26" y="36" class="kc-t">AURELION</text><text x="26" y="120" class="kc-n">L. BRENNER</text><text x="26" y="140" class="kc-s">SICHERHEIT · STUFE ████</text><g class="kc-w" transform="translate(236 64)"><path d="M0 0a18 18 0 0 1 0 36"/><path d="M10 -8a30 30 0 0 1 0 52"/><path d="M20 -16a42 42 0 0 1 0 68"/></g></svg>'+
  '<div class="cl-bar"><i id="cl-p"></i></div><div class="cl-st" id="cl-st">Bereit</div><div class="cl-hex" id="cl-hex">'+HEX.map(()=>'<span>··</span>').join('')+'</div><button class="btn big" id="cl-go">Auslesen starten</button><p class="small" id="cl-tip">Handy flach hinlegen oder mit beiden Händen ruhig halten.</p></div>');
 const bar=$('#cl-p'),stt=$('#cl-st'),hx=[...$$('#cl-hex span')];
 const show=()=>{bar.style.width=p+'%';const n=Math.floor(p/25);hx.forEach((s,i)=>{s.textContent=i<n?HEX[i]:(i===n&&p<100?Math.random().toString(16).slice(2,4).toUpperCase():'··');s.classList.toggle('ok',i<n)})};
 const onMot=e=>{const a=e.accelerationIncludingGravity||e.acceleration;if(!a||a.x==null)return;mode='motion';if(last){const d=Math.abs(a.x-last.x)+Math.abs(a.y-last.y)+Math.abs(a.z-last.z);still=d<.35?1:-1}last={x:a.x,y:a.y,z:a.z}};
 const stop=()=>{run=false;cancelAnimationFrame(raf);clearInterval(iv);removeEventListener('devicemotion',onMot)};
 const loop=()=>{if(!document.body.contains(bar))return stop();if(!run)return;
  if(still>0){p=Math.min(100,p+.42);stt.textContent='Signal stabil';stt.className='cl-st ok'}else if(still<0){p=Math.max(0,p-.8);stt.textContent='Zu viel Bewegung, ruhig halten';stt.className='cl-st bad'}
  show();if(p>=100){stop();stt.textContent='Karte ausgelesen';stt.className='cl-st ok';sfx('ok');$('#cl-go').textContent='Nochmal auslesen';$('#cl-go').classList.remove('hold');st.calls.d8read=1;save();return}raf=requestAnimationFrame(loop)};
 if(st.calls.d8read){p=100;show();stt.textContent='Karte ausgelesen';stt.className='cl-st ok';$('#cl-go').textContent='Nochmal auslesen'}
 const go=$('#cl-go');
 go.onclick=async()=>{if(run)return;if(mode==='hold')return;p=0;still=0;last=null;mode='';ac();
  try{if(typeof DeviceMotionEvent!=='undefined'&&DeviceMotionEvent.requestPermission)await DeviceMotionEvent.requestPermission()}catch(e){}
  addEventListener('devicemotion',onMot);run=true;stt.textContent='Suche Signal …';iv=setInterval(()=>{if(run)tone(1200+p*8,.03,'sine',.03)},420);loop();
  setTimeout(()=>{if(mode!=='motion'&&run){stop();mode='hold';go.textContent='Gedrückt halten';go.classList.add('hold');$('#cl-tip').textContent='Kein Bewegungssensor gefunden. Halte den Knopf gedrückt und bewege dabei die Maus oder den Finger nicht.';stt.textContent='Bereit'}},1200)};
 let hp=null;
 go.addEventListener('pointerdown',e=>{if(mode!=='hold')return;e.preventDefault();hp={x:e.clientX,y:e.clientY};if(p>=100)p=0;run=true;still=1;go.setPointerCapture(e.pointerId);iv=setInterval(()=>{if(run)tone(1200+p*8,.03,'sine',.03)},420);loop()});
 go.addEventListener('pointermove',e=>{if(mode!=='hold'||!hp)return;still=(Math.abs(e.clientX-hp.x)+Math.abs(e.clientY-hp.y))>6?-1:1;if(still<0)hp={x:e.clientX,y:e.clientY}});
 const up=()=>{if(mode!=='hold'||!hp)return;hp=null;run=false;clearInterval(iv);if(p<100){stt.textContent='Losgelassen. Nochmal gedrückt halten.';stt.className='cl-st bad'}};
 go.addEventListener('pointerup',up);go.addEventListener('pointercancel',up)};

// Fragment eines Aktes
function showFragment(f){if(!f)return;st.frag[f.n]=f.v;save();const o=el('div','frag-o','<div class="fo-in"><div class="kick">'+esc(f.act||'')+'</div><div class="fo-l">Fragment '+f.n+' von 4</div><div class="fo-d">'+esc(f.v)+'</div><p>In deiner Einsatzakte gespeichert. Am 24. brauchst du alle vier.</p><button class="btn big" id="fo-ok">Verstanden</button></div>');
 document.body.appendChild(o);music(null);sfx('open',.8);tone(392,.6,'triangle',.12);tone(523,.6,'triangle',.12,.25);tone(784,1.2,'triangle',.14,.5);requestAnimationFrame(()=>o.classList.add('on'));
 return new Promise(r=>$('#fo-ok').onclick=()=>{o.classList.remove('on');setTimeout(()=>o.remove(),400);if(curScreen==='#s-tower'||curScreen==='#s-day')music(actFor(Math.max(1,maxDay())).m,.4);r()})}

// Easter Egg Tag 6: Bits Stiefel
const BOOT_SVG='<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M13 5h11v16c0 2 1 3 3 4l5 2c3 1 4 3 4 6v2H8V29c0-2 1-3 2-4l3-3z" fill="#b8323f" stroke="#ffd7d7" stroke-width="1.2"/><path d="M12 5h13v5H12z" fill="#fff"/><path d="M8 33h28v3H8z" fill="#2a1416"/></svg>';
