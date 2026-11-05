// Ablauf
$('#btn-back').innerHTML=IC.back;$('#btn-akte-back').innerHTML=IC.back;$('#v-close').innerHTML=IC.close;
['#btn-akte','#btn-akte2'].forEach(s=>$(s).innerHTML=IC.akte);
$('#btn-sound').classList.add('btn-snd');$('#btn-sound').innerHTML=st.sound?IC.sound:IC.mute;
$('#btn-sound').onclick=()=>setSound(!st.sound);
$('#v-close').onclick=closeViewer;$('#viewer').onclick=e=>{if(e.target.id==='viewer')closeViewer()};

// Klangbett der Verbindung: Brummen, Datenzirpen, Rauschen
function bootBed(){const c=ac(),out=c.createGain();out.gain.value=0;out.connect(master||c.destination);const t=c.currentTime;out.gain.linearRampToValueAtTime(.5,t+1.2);
 const o=c.createOscillator(),o2=c.createOscillator(),f=c.createBiquadFilter(),lfo=c.createOscillator(),lg=c.createGain();
 o.type='sawtooth';o.frequency.value=55;o2.type='sine';o2.frequency.value=110.6;f.type='lowpass';f.frequency.value=260;f.Q.value=6;lfo.frequency.value=.35;lg.gain.value=160;lfo.connect(lg);lg.connect(f.frequency);
 const dg=c.createGain();dg.gain.value=.22;o.connect(f);o2.connect(f);f.connect(dg);dg.connect(out);o.start();o2.start();lfo.start();
 const nb=c.createBuffer(1,c.sampleRate*2,c.sampleRate),d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
 const ns=c.createBufferSource();ns.buffer=nb;ns.loop=true;const nf=c.createBiquadFilter();nf.type='bandpass';nf.frequency.value=2400;nf.Q.value=.8;const ng=c.createGain();ng.gain.value=.025;ns.connect(nf);nf.connect(ng);ng.connect(out);ns.start();
 const iv=setInterval(()=>{if(Math.random()<.75){const fr=900+Math.random()*2600;const os=c.createOscillator(),g=c.createGain();os.type=Math.random()<.5?'square':'sine';os.frequency.value=fr;const n=c.currentTime;g.gain.setValueAtTime(.035,n);g.gain.exponentialRampToValueAtTime(.0005,n+.05);os.connect(g);g.connect(out);os.start(n);os.stop(n+.06)}
  if(Math.random()<.06){ng.gain.setTargetAtTime(.12,c.currentTime,.01);ng.gain.setTargetAtTime(.025,c.currentTime+.12,.05)}},65);
 return{stop(){clearInterval(iv);const n=c.currentTime;out.gain.cancelScheduledValues(n);out.gain.setValueAtTime(out.gain.value,n);out.gain.linearRampToValueAtTime(0,n+.6);setTimeout(()=>{[o,o2,lfo,ns].forEach(x=>{try{x.stop()}catch(e){}});out.disconnect()},800)}}}

// 0 Verbindung
const BOOT=[['> NORDLICHT secure relay v4.2',''],['> Suche Knoten in Lumenstadt ……… gefunden',''],['> Aurelion Scanner umgehen ……… ok',''],['> Verschlüsselung AES 256 ……… aktiv',''],['! ECHO Aktivität erkannt, Kanal gewechselt','w'],['> Eingehende Verbindung für dich','']];
$('#boot-log').innerHTML='<span>> NORDLICHT relay wartet auf Agent</span><span class="cur">_</span>';$('#btn-boot').textContent='Kanal öffnen';$('#btn-boot').classList.remove('hide');
let booting=false;
$('#btn-boot').onclick=async()=>{if(booting)return;booting=true;ac();const bt=$('#btn-boot');bt.classList.add('hide');const bed=bootBed();
 const lg=$('#boot-log');lg.innerHTML='';$('.boot-logo').classList.add('fast');
 for(const [l,c] of BOOT){const s=el('span',c);lg.appendChild(s);
  if(c==='w'){sfx('glitch',.45);document.body.classList.add('shake-screen');setTimeout(()=>document.body.classList.remove('shake-screen'),600);tone(220,.18,'sawtooth',.06);tone(196,.22,'sawtooth',.06,.2)}
  await typeOut(s,l+'\n',13,true);
  if(/gefunden|ok|aktiv/.test(l)){tone(1320,.07,'sine',.12);tone(1760,.1,'sine',.1,.08)}else if(c!=='w')tone(880,.05,'square',.04);
  await sleep(c==='w'?700:240)}
 bed.stop();tone(988,.12,'triangle',.16);tone(1319,.3,'triangle',.16,.12);await sleep(900);
 await timeReady;await loadGift();goStart()};

async function loadGift(){const g=params.get('g')||(location.hash.startsWith('#g=')?location.hash.slice(3):null);if(g){GIFT=await TZ.unpack(g);if(GIFT){st.ok=1;if(GIFT.cn&&!st.cn)st.cn=GIFT.cn;save()}}}

// 1 Start
function goStart(){
 if(st.ok&&st.cn&&st.intro)return goTower();
 const cs=$('#cn');cs.innerHTML=CODENAMES.map(c=>'<option'+(c===st.cn?' selected':'')+'>'+c+'</option>').join('');
 $('#codebox').style.display=st.ok?'none':'block';
 $('#cnbox').style.display=(GIFT&&GIFT.cn)?'none':'block';
 $('#giftline').innerHTML=GIFT?('Für <b>'+esc(GIFT.an)+'</b>. Ein Auftrag von '+esc(GIFT.von)+'.'+(GIFT.cn?'<br>Dein Codename: <b>'+esc(GIFT.cn)+'</b>':'')):'';
 show('#s-start');music('a/mus_menu.mp3',.4);
}
$('#btn-start').onclick=async()=>{
 if(!st.ok){const h=await TZ.hash($('#code').value);if(h!==TZ.ACCESS){sfx('bad');$('#code').animate([{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'none'}],{duration:300});return toast('Dieser Zugangscode stimmt nicht.')}st.ok=1}
 if(!(GIFT&&GIFT.cn))st.cn=$('#cn').value;st.start=st.start||Date.now();save();sfx('ok');
 st.intro?goTower():goFilm();
};

// 2 Film
let filmRun=0;
async function goFilm(){show('#s-film');const run=++filmRun;const I=INTRO,f=$('#film');f.innerHTML='';
 I.slides.forEach(s=>{const d=el('div','fs','<div class="bg" style="background-image:url('+s.img+')"></div><div class="shade"></div>'+(s.card?'<div class="fcard">'+esc(s.card)+'</div>':''));f.appendChild(d)});
 music(I.music,.55);const au=playVo(I.vo);const t0=performance.now();const sl=[...f.children];let cs=-1,sub=-1;
 (function tick(){if(run!==filmRun)return;const t=au&&!au.paused&&au.currentTime?au.currentTime:(performance.now()-t0)/1000;
  let i=0;I.slides.forEach((s,k)=>{if(t>=s.t)i=k});if(i!==cs){sl.forEach((e,k)=>e.classList.toggle('on',k===i));cs=i}
  let j=-1;I.subs.forEach((s,k)=>{if(t>=s.t)j=k});if(j!==sub){sub=j;const e=$('#film-sub');e.classList.remove('on');setTimeout(()=>{e.textContent=j>=0?T(I.subs[j].x):'';e.classList.add('on')},200)}
  $('#film-prog').style.width=Math.min(100,t/I.len*100)+'%';
  if(t>=I.len)return filmDone();requestAnimationFrame(tick)})();
}
function filmDone(){filmRun++;stopVo();st.intro=1;save();goTower()}
$('#btn-skip').onclick=filmDone;

// 3 Tower
function actFor(d){let a=ACTS[0];ACTS.forEach(x=>{if(d>=x.f)a=x});return a}
function goTower(){stopVo();renderTower();show('#s-tower');const m=maxDay();music(actFor(Math.max(1,m)).m,.4)}
function renderTower(){$('#tw-kick').textContent='Agent '+(st.cn||'');
 const solved=Object.keys(st.solved).length,m=maxDay(),fr=Object.keys(st.frag).length;
 $('#tw-status').innerHTML='<div><b>'+solved+'/24</b><span>Etagen</span></div><div><b>'+fr+'/4</b><span>Fragmente</span></div><div><b>'+countdown()+'</b><span>bis Stille Nacht</span></div>';
 const t=$('#tower');t.innerHTML='';
 for(let d=1;d<=24;d++){const open=unlocked(d),done=!!st.solved[d];
  const b=el('button','fl'+(d===24?' vault':'')+(done?' done':open?' open':' lock'));
  b.innerHTML='<span class="n">'+String(d).padStart(2,'0')+'</span><span class="l"><b>'+(open||done?esc(FLOORS[d-1]):'Gesperrt')+'</b><i>'+(done?'gesichert':open?(DAYS[d]?'bereit':'in Arbeit'):lockText(d))+'</i></span><span class="w"><span></span><span></span><span></span></span>';
  b.onclick=()=>{if(!open)return toast(lockText(d)),sfx('bad');if(!DAYS[d])return toast('Diese Etage ist im Prototyp noch nicht gebaut.');sfx('tap');openDay(d)};
  t.appendChild(b)}
 let target=1;for(let d=1;d<=24;d++)if(unlocked(d)&&!st.solved[d]){target=d;break}
 const tb=t.children[target-1];if(tb){tb.classList.add('cur');setTimeout(()=>tb.scrollIntoView({block:'center',behavior:'smooth'}),400)}
 $('#tw-foot').textContent=PROBE?'Testmodus: alle Etagen offen':'Jeden Tag ab 0 Uhr öffnet sich eine neue Etage. Verpasste Etagen kannst du jederzeit nachholen.';
}
function lockText(d){const b=berlin();if(b.month===12)return 'öffnet am '+d+'. Dezember';return 'ab 1. Dezember'}
function countdown(){const n=now(),y=n.getFullYear();const target=new Date(Date.UTC(y,11,23,23,0,0));let ms=target-n;if(ms<0)return 'vorbei';const d=Math.floor(ms/864e5);if(d>=1)return d+' Tage';const h=Math.floor(ms/36e5);return h+' Std'}

// 4 Tag
let curDay=0;
function openDay(d){curDay=d;const D=DAYS[d];stopVo();show('#s-day');st.seen[d]=1;save();
 $('#day-kick').textContent='Etage '+String(d).padStart(2,'0');$('#day-title').textContent=FLOORS[d-1];
 const C=CREW[D.who];const r=$('#radio');
 r.innerHTML='<div class="rd-h"><div class="rd-p" style="background-image:url('+C.img+')"></div><div><div class="rd-n">'+esc(C.n)+'</div><div class="rd-r">'+esc(C.r)+'</div></div><button class="vo" id="vo-d"><span class="vi">'+IC.play+'</span><span class="wave">'+'<i></i>'.repeat(5)+'</span></button></div><p>'+T(D.text)+'</p>';
 bindVo($('#vo-d'),D.vo,!!(st.tour&&st.tour.day));
 if(D.egg==='boot'){const b=el('button','egg-boot',BOOT_SVG);b.title='Ein Stiefel?';b.setAttribute('aria-label','Stiefel');b.onclick=()=>{b.classList.add('hop');playVo('a/vo_egg_boot.mp3');toast('Bit hat dir einen Stiefel hingestellt.');if(!st.calls.egg6){st.calls.egg6=1;save()}};r.appendChild(b)}
 const ms=$('#mods');ms.innerHTML='';
 D.mods.forEach((m,i)=>{const b=el('button','mod','<span class="mi">'+(IC[m.ic]||IC.doc)+'</span><span><b>'+esc(m.b)+'</b><span>'+esc(m.s)+'</span></span>');b.onclick=()=>openMod(m);ms.appendChild(b)});
 $('#daycode').value='';const tm=$('#term');tm.classList.remove('ok','bad');$('#term-st').textContent=st.solved[d]?'gelöst':'wartet auf Eingabe';
 renderHints();$('#reveal').classList.remove('on');if(st.solved[d])showReveal(false);
}
function bindVo(btn,src,auto){if(!btn)return;const ui=on=>{btn.classList.toggle('play',on);btn.querySelector('.vi').innerHTML=on?IC.pause:IC.play;animWave(btn,on)};
 btn.onclick=()=>{if(curVo&&curVo._ui===ui){stopVo();return}playVo(src,ui)};if(auto&&st.sound)setTimeout(()=>playVo(src,ui),500)}
function animWave(btn,on){const w=[...btn.querySelectorAll('.wave i')];clearInterval(btn._w);if(!on){w.forEach(i=>i.style.height='20%');return}btn._w=setInterval(()=>w.forEach(i=>i.style.height=(20+Math.random()*80)+'%'),110)}
$('#btn-back').onclick=()=>{stopVo();goTower()};
function renderHints(){const D=DAYS[curDay],n=st.hint[curDay]||0,h=$('#hints');h.innerHTML='';
 const lab=['Hinweis','Starker Hinweis','Lösung mit Erklärung'];
 D.hints.forEach((x,i)=>{const open=i<n;const b=el('button','hint'+(open?' open':'')+(i===2?' sol':''),'<span class="hk">'+lab[i]+'</span>'+(open?T(x):(i===n?'Antippen zum Aufdecken':'Erst den vorherigen Hinweis öffnen')));
  b.onclick=()=>{if(open||i!==n)return;if(i===2&&!confirmSol(b))return;st.hint[curDay]=n+1;save();sfx('tap');renderHints()};h.appendChild(b)})}
function confirmSol(b){if(b._c)return true;b._c=1;b.innerHTML='<span class="hk">Lösung mit Erklärung</span>Wirklich? Noch einmal antippen, dann zeige ich die Lösung.';return false}
$('#btn-check').onclick=check;$('#daycode').addEventListener('keydown',e=>{if(e.key==='Enter')check()});
async function check(){const v=$('#daycode').value;if(!TZ.norm(v))return;const D=DAYS[curDay],tm=$('#term');tm.classList.remove('bad','ok');void tm.offsetWidth;
 if(D.gate&&!D.gate()){sfx('bad');toast(D.gateMsg||'Noch nicht.');return}if([].concat(D.h).includes(await TZ.hash(v))){tm.classList.add('ok');$('#term-st').textContent='Zugang gewährt';sfx('ok');const first=!st.solved[curDay];st.solved[curDay]=Date.now();save();showReveal(true);if(first&&D.after)runAfter(D.after)}
 else{tm.classList.add('bad');$('#term-st').textContent='Zugriff verweigert';sfx('bad')}}
function showReveal(play){const D=DAYS[curDay],R=D.reveal,C=CREW[R.who],rv=$('#reveal');
 rv.innerHTML='<div class="rk">Etage '+curDay+' gesichert</div><div class="rd-h" style="margin-top:10px"><div class="rd-p" style="background-image:url('+C.img+')"></div><div><div class="rd-n">'+esc(C.n)+'</div><div class="rd-r">'+esc(C.r)+'</div></div>'+(R.vo?'<button class="vo" id="vo-r"><span class="vi">'+IC.play+'</span><span class="wave">'+'<i></i>'.repeat(5)+'</span></button>':'')+'</div><p>'+T(R.text)+'</p>';
 rv.classList.add('on');bindVo($('#vo-r'),R.vo,play);if(play)setTimeout(()=>rv.scrollIntoView({behavior:'smooth',block:'start'}),300)}
async function runAfter(a){if(a.once&&st.calls[a.once])return;await sleep(a.delay||0);if(curScreen!=='#s-day'&&curScreen!=='#s-tower')return;
 st.calls[a.once]=1;save();if(a.t==='call')await doCall(a);if(a.t==='seq')for(const x of a.steps){await sleep(x.delay||0);if(x.t==='echo')await echoTakeover(x.lines,{vo:x.vo,btn:x.btn});if(x.t==='call')await doCall(x);if(x.t==='frag')await showFragment(x.frag)}music(actFor(Math.max(1,maxDay())).m,.4)}
async function doCall(a){const r=await incomingCall({name:a.name,img:a.img,vo:a.vo,lines:a.lines.map(T),mailbox:a.mailbox,video:a.video,via:a.via});callLog(a,r);if(a.frag){await sleep(r==='declined'?2600:600);await showFragment(a.frag)}}
function callLog(a,r){if(r==='declined'&&a.mbVo){addMsg({who:a.who||'mira',name:a.name,kind:a.mbKind||'Sprachnachricht',vo:a.mbVo,text:a.mbText});setTimeout(()=>mailboxNotice(a.name,a.mbKind),700)}else addMsg({who:a.who||'mira',name:a.name,kind:r==='answered'?'Anruf, angenommen':'Anruf, verpasst',vo:a.vo,text:a.lines.join(' '),read:r==='answered'?1:0})}

// Module
function openMod(m){sfx('open',.6);if(window.MODS&&MODS[m.t])return MODS[m.t](m);
 if(m.t==='print'&&window.showPrint)return showPrint(m);if(m.t==='print'){viewer('<p class="kick" style="margin:0 0 8px">'+esc(m.s)+'</p>'+T(DOCS[m.doc])+'<p class="small">Im fertigen Kalender liegt dieses Blatt gedruckt in deiner Einsatzakte.</p>');$$('#v-body canvas.stoerbild').forEach(c=>drawStoer(c));return}
 if(m.t==='pulse')return openPulse();
 if(m.t==='morse')return openMorse(m);
 if(m.t==='funk')return openFunk(m);
}
function openPulse(){viewer('<div class="phone"><div class="ph-top"><span class="pl">pulse</span><span style="margin-left:auto;font-size:.8rem;color:#8fa3c2">@vhalden</span></div>'+
 '<div class="pu-prof"><div class="pu-av" style="background-image:url(a/p_halden.jpg)"></div><div><b>Viktor Halden</b><div style="font-size:.85rem;color:#9aa8c0">CEO Aurelion. Ich baue die Stadt, in der du lebst.</div><div style="font-size:.75rem;color:#6b7a96;margin-top:4px">1,2 Mio. Follower</div></div></div>'+
 post('vor 2 Std','Noch 22 Tage. Lumenstadt wird so still sein wie nie. Freut euch.','')+
 post('vor 3 Tagen','Bruno ist heute drei geworden. Bester Bürohund im ganzen Tower.','a/pu_bruno.jpg','Bruno im Büro')+
 post('8. Mai 2016','Eröffnung Aurelion Tower. 24 Etagen. Was für ein Tag.','a/pu_tower.jpg','Tower Eröffnung')+
 post('Zurückgeblickt','Zurück in die Garage, in der alles anfing. Mein erster Hund Kaiser hat damals auf jede Platine aufgepasst.','a/pu_kaiser.jpg','Hund in einer Garage')+
 '<div class="lockbox"><b>Halden Cloud</b><div style="font-size:.85rem;color:#9aa8c0;margin-top:4px">Gesperrt. Sicherheitsfrage: Mein erster Hund und das Jahr, in dem alles anfing.</div><div style="font-size:.78rem;color:#6b7a96;margin-top:8px">Gib die Antwort unten im Terminal ein.</div></div></div>')}
function post(dt,tx,img,alt){return '<div class="pu-post"><div class="dt">'+dt+'</div><p>'+tx+'</p>'+(img?'<div class="im" style="background-image:url('+img+')" role="img" aria-label="'+esc(alt||'')+'"></div>':'')+'</div>'}
function openMorse(m){viewer('<div class="card" style="text-align:center"><div class="kick">Kanal 7 · Aurelion Sicherheit</div><div style="font-family:var(--mono);font-size:.85rem;color:var(--mute);margin:10px 0">Aufnahme von 21:47 Uhr</div><button class="btn big" id="mo-play">Funk abspielen</button><div id="mo-vis" style="height:46px;display:flex;gap:6px;justify-content:center;align-items:center;margin-top:16px"></div></div>');
 $('#mo-play').onclick=()=>playMorse(m.seq)}
async function playMorse(seq){ac();sfx('static',.5);await sleep(900);const vis=$('#mo-vis');vis.innerHTML='';const u=.13;
 for(const ch of seq){if(!$('#viewer').classList.contains('on'))return;if(ch===' '){await sleep(u*3000);continue}const len=ch==='-'?3*u:u;tone(720,len,'sine',.22);const s=el('span');s.style.cssText='display:block;height:6px;border-radius:3px;background:var(--nl);box-shadow:var(--glow);width:'+(ch==='-'?30:10)+'px';vis.appendChild(s);await sleep((len+u)*1000)}}

// Funkspruch als Zahlengruppen, Buchchiffre auf den Einsatzbefehl
function openFunk(m){viewer('<div class="fk"><div class="fk-h"><span class="fk-dot"></span><span>'+esc(m.b)+'</span><span class="fk-f">147,24 MHz</span></div><canvas id="fk-cv" height="70"></canvas><div class="fk-meta">QUELLE NORDLICHT · SCHLÜSSEL: EINSATZBEFEHL · '+m.groups.length+' GRUPPEN</div><div class="fk-g" id="fk-g"></div><button class="btn" id="fk-play">Erneut empfangen</button></div>');
 const cv=$('#fk-cv');cv.width=cv.offsetWidth*2;let on=true,amp=.15;const x=cv.getContext('2d');
 (function f(){if(!$('#viewer').classList.contains('on')||!document.body.contains(cv)){on=false;return}const W=cv.width,H=cv.height;x.clearRect(0,0,W,H);x.strokeStyle='#3cf2b5';x.lineWidth=2;x.shadowColor='#3cf2b5';x.shadowBlur=8;x.beginPath();for(let i=0;i<W;i+=4){const y=H/2+Math.sin(i*.05+performance.now()*.01)*H*.18*amp+(Math.random()-.5)*H*amp*.9;i?x.lineTo(i,y):x.moveTo(i,y)}x.stroke();amp+=(.15-amp)*.08;requestAnimationFrame(f)})();
 const run=async()=>{ac();const g=$('#fk-g');g.innerHTML='';sfx('static',.45);await sleep(800);
  for(const grp of m.groups){if(!document.body.contains(g))return;const b=el('div','fk-n','');g.appendChild(b);
   for(const ch of grp){b.textContent+=ch;amp=1;if(ch!=='·')tone(980+(+ch)*40,.06,'square',.06);await sleep(ch==='·'?120:180)}
   b.classList.add('in');await sleep(380)}
  tone(1400,.12,'sine',.12);await sleep(160);tone(1400,.12,'sine',.12)};
 $('#fk-play').onclick=run;run()}

// 5 Akte
['#btn-akte','#btn-akte2'].forEach(s=>$(s).onclick=openAkte);
let akteFrom='#s-tower';
function openAkte(){akteFrom=curScreen==='#s-day'?'#s-day':'#s-tower';stopVo();show('#s-akte');const tabs=[['ausweis','Ausweis'],['crew','Crew'],['frag','Fragmente']];
 $('#akte-tabs').innerHTML='';tabs.forEach(([k,n],i)=>{const b=el('button',i?'':'on',n);b.onclick=()=>{$$('#akte-tabs button').forEach(x=>x.classList.remove('on'));b.classList.add('on');akteTab(k)};$('#akte-tabs').appendChild(b)});akteTab('ausweis')}
function akteTab(k){const p=$('#akte-page');
 if(k==='ausweis')p.innerHTML='<div class="idcard"><div class="kick">NORDLICHT · Agentenausweis</div><div class="row" style="margin-top:12px"><div class="ph">Foto im fertigen Kalender per Kamera</div><div><div style="font-size:.7rem;color:var(--mute)">CODENAME</div><div class="cn">'+esc(st.cn)+'</div><div style="font-size:.7rem;color:var(--mute);margin-top:8px">FREIGABE</div><div>Stufe 1</div></div></div><div class="mz">P&lt;NL&lt;'+esc(st.cn)+'&lt;&lt;LUMENSTADT&lt;&lt;&lt;2412&lt;&lt;&lt;</div></div>';
 if(k==='crew')p.innerHTML=Object.values(CREW).filter(c=>c.n!=='ECHO').map(c=>'<div class="card"><h4>'+esc(c.n)+'</h4><div style="color:var(--mute);font-size:.85rem">'+esc(c.r)+'</div></div>').join('');
 if(k==='frag')p.innerHTML='<div class="card">Vier Fragmente ergeben am Ende den Tresorcode. Du bekommst eines am Ende jedes Aktes.</div>'+[1,2,3,4].map(i=>'<div class="frag"><b>'+(st.frag[i]||'?')+'</b><span>Fragment '+i+'</span></div>').join('')}
$('#btn-akte-back').onclick=()=>{akteFrom==='#s-day'?openDay(curDay):goTower()};

// Test: Effekte direkt ausprobieren
if(params.get('demo')){const d=el('div','demo','<button class="demo-btn" id="dm-open">Testmenü</button><div class="demo-pan" id="dm-pan"><div class="demo-h"><b>Testmenü</b><span>Nur in deinem Testlink. Käufer sehen das nie. Damit löst du Ereignisse aus, die im echten Kalender erst an bestimmten Tagen passieren.</span></div>'+
 '<button class="demo-it" id="dm-call"><b>Anruf von Mira</b><span>Kommt im echten Spiel nach Tag 2. Nimm an oder lehne ab: Abgelehnt landet er als Sprachnachricht im Briefsymbol.</span></button>'+
 '<button class="demo-it" id="dm-echo"><b>ECHO übernimmt</b><span>Die KI hackt sich in deinen Bildschirm. Im Spiel ab der Wende in der Mitte des Dezembers.</span></button>'+
 '<button class="demo-it" id="dm-ban"><b>Kurze Meldung</b><span>Eine Pushnachricht der Crew, wie sie an einzelnen Tagen auftaucht.</span></button>'+
 '<button class="demo-it" id="dm-tour"><b>Führung neu starten</b><span>Bit erklärt das Interface noch einmal von vorn.</span></button></div>');document.body.appendChild(d);
 const pan=$('#dm-pan');$('#dm-open').onclick=()=>pan.classList.toggle('on');const shut=()=>pan.classList.remove('on');
 $('#dm-call').onclick=async()=>{shut();const a=DAYS[2].after;const r=await incomingCall({name:a.name,img:a.img,vo:a.vo,lines:a.lines.map(T),mailbox:true});callLog(a,r)};
 $('#dm-echo').onclick=()=>{shut();echoTakeover(['Hallo, {CN}.','Es ist '+clock()+' bei dir. Du hältst '+device()+' in der Hand.','Du bist nicht Teil meiner Stadt. Wer bist du?'],{btn:'Verbindung trennen',vo:'a/vo_echo_demo.mp3'})};
 $('#dm-ban').onclick=()=>{shut();banner('Kontaktmann','Neue Nachricht: Das Wort heute ist …')};
 $('#dm-tour').onclick=()=>{shut();runTour(curScreen==='#s-day'?'day':'tower',true)};
 document.addEventListener('screen',e=>d.classList.toggle('on',e.detail==='#s-tower'||e.detail==='#s-day'))}
