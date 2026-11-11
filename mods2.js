// Module für Tag 9 bis 12
const HENRIK_TEL='0611 16885461';

// Tag 9: Henriks Werkstattanschluss
MODS.phone=m=>{const fb=PROBE||(st.hint[9]||0)>=2||st.solved[9];
 viewer('<div class="idback"><div class="kick">Agentenausweis · Rückseite</div><div class="ib-row"><span>Notfall</span><b>Henriks Werkstatt</b><em>Festnetz, kein Handy</em></div><div class="ib-tel">'+HENRIK_TEL+'</div><a class="btn big" href="tel:'+HENRIK_TEL.replace(/\s/g,'')+'">Mit deinem Telefon anrufen</a><div class="ib-row"><span>Ausweichkanal</span><b>eule.lumenstadt@gmx.de</b><em>Nur wenn ECHO die Leitung hat</em></div></div>'+
  '<p class="small">Henrik geht sofort ran. Hör genau zu, er sagt alles nur einmal. Es entstehen nur die normalen Kosten für einen Anruf ins deutsche Festnetz.</p>'+
  (fb?'<div class="card"><b>Kein Telefon zur Hand?</b><p class="small" style="margin:4px 0 10px">Bit hat Henriks Ansage mitgeschnitten.</p><button class="vo" id="vo-hab"><span class="vi">'+IC.play+'</span><span class="wave">'+'<i></i>'.repeat(5)+'</span></button></div>':'<p class="small" style="opacity:.7">Wenn es gar nicht klappt, hilft dir der zweite Hinweis weiter.</p>'));
 if(fb)bindVo($('#vo-hab'),'a/vo_henrik_ab.mp3',false)};

// Tag 10: Störbild mit verstecktem Wort
function drawStoer(c){const x=c.getContext('2d'),W=c.width,H=c.height;let r=24;const rnd=()=>(r=(r*9301+49297)%233280)/233280;
 const m=document.createElement('canvas');m.width=W;m.height=H;const mx=m.getContext('2d');mx.fillStyle='#000';mx.font='900 132px "Chakra Petch",Arial,sans-serif';mx.textAlign='center';mx.textBaseline='middle';mx.fillText('KRANICH',W/2,H/2+6);
 const md=mx.getImageData(0,0,W,H).data,inM=(px,py)=>{px=px|0;py=py|0;if(px<0||py<0||px>=W||py>=H)return false;return md[(py*W+px)*4+3]>128};
 x.fillStyle='#f3efe6';x.fillRect(0,0,W,H);x.lineCap='round';
 for(let i=0;i<9000;i++){const px=rnd()*W,py=rnd()*H,inside=inM(px,py),cy=rnd()<(inside?.86:.18);
  x.strokeStyle=cy?'rgb('+(55+rnd()*20|0)+','+(135+rnd()*20|0)+','+(195+rnd()*20|0)+')':'rgb('+(220+rnd()*25|0)+','+(65+rnd()*20|0)+','+(65+rnd()*20|0)+')';
  x.lineWidth=2+rnd()*2.5;const a=rnd()*Math.PI*2,l=4+rnd()*9;x.beginPath();x.moveTo(px,py);x.quadraticCurveTo(px+Math.cos(a+1)*l*.6,py+Math.sin(a+1)*l*.6,px+Math.cos(a)*l,py+Math.sin(a)*l);x.stroke()}
 for(let i=0;i<10;i++){x.fillStyle='rgba(225,70,70,'+(.25+rnd()*.3)+')';x.fillRect(0,rnd()*H,W,2+rnd()*6)}}
MODS.stoer=m=>{viewer('<div class="kick">Rotfilter</div><div class="rf-tabs"><button class="on" data-m="f">Folie</button><button data-m="c">Kamera</button></div><div id="rf-body"></div>');
 const body=$('#rf-body');let stream=null;
 const folie=()=>{body.innerHTML='<p class="small">Zieh die rote Folie über das Störbild oder leg sie ganz auf.</p><div class="rf-wrap"><canvas class="stoerbild" width="600" height="300"></canvas><div class="rf-foil" id="rf-foil"></div></div><button class="btn" id="rf-all" style="margin-top:10px;width:100%">Folie ganz auflegen</button>';drawStoer($('#rf-body canvas'));$('#rf-all').onclick=()=>{const f=$('#rf-foil');f.style.transition='left .5s';f.style.width='112%';f.style.left='-6%';setTimeout(()=>f.style.transition='',600)};
  const f=$('#rf-foil'),wrap=$('.rf-wrap');let d=null;f.style.left='-60%';
  f.addEventListener('pointerdown',e=>{d={x:e.clientX,l:f.offsetLeft};f.setPointerCapture(e.pointerId)});
  f.addEventListener('pointermove',e=>{if(!d)return;const w=wrap.offsetWidth;let l=d.l+e.clientX-d.x;l=Math.max(-f.offsetWidth+30,Math.min(w-30,l));f.style.left=l+'px'});
  f.addEventListener('pointerup',()=>d=null)};
 const cam=async()=>{body.innerHTML='<p class="small">Halte die Kamera über das gedruckte Störbild aus deiner Akte.</p><div class="rf-cam"><video playsinline muted autoplay></video><div class="rf-red"></div></div><p class="small" id="rf-err"></p>';
  try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'},audio:false});const v=$('#rf-body video');v.srcObject=stream}catch(e){$('#rf-err').textContent='Die Kamera ist nicht verfügbar oder wurde nicht erlaubt. Nutze die Folie.'}};
 const stopCam=()=>{if(stream){stream.getTracks().forEach(t=>t.stop());stream=null}};
 $$('.rf-tabs button').forEach(b=>b.onclick=()=>{$$('.rf-tabs button').forEach(x=>x.classList.toggle('on',x===b));stopCam();b.dataset.m==='c'?cam():folie()});
 const obs=new MutationObserver(()=>{if(!$('#viewer').classList.contains('on')){stopCam();obs.disconnect()}});obs.observe($('#viewer'),{attributes:true});
 folie()};

// Tag 11: Bedienfeld des Lastenaufzugs
MODS.lift=m=>{let stops=[];
 viewer('<div class="lp"><div class="lp-h"><b>KRANICH</b><span>Lastenaufzug · Getriebe 3 / 5 / 7</span></div><div class="lp-disp"><span>Start 1</span><span id="lp-s"></span></div><div class="lp-grid">'+Array.from({length:23},(_,i)=>'<button data-f="'+(i+2)+'">'+(i+2)+'</button>').join('')+'</div><div class="lp-ctl"><button class="btn ghost" id="lp-x">Löschen</button><button class="btn" id="lp-go">Fahrt starten</button></div><div class="lp-msg" id="lp-m">Tippe die Halte der Reihe nach an.</div></div>');
 const draw=()=>{$('#lp-s').innerHTML=stops.map(f=>'<i>'+f+'</i>').join('');$$('.lp-grid button').forEach(b=>b.classList.toggle('on',stops.includes(+b.dataset.f)))};
 $$('.lp-grid button').forEach(b=>b.onclick=()=>{const f=+b.dataset.f;if(stops.length>=8)return;if(stops.length&&f<=stops[stops.length-1]){sfx('bad',.5);$('#lp-m').textContent='Der Kranich fährt nur nach oben.';return}stops.push(f);tone(600+f*30,.06,'square',.05);draw()});
 $('#lp-x').onclick=()=>{stops=[];draw();$('#lp-m').textContent='Tippe die Halte der Reihe nach an.'};
 $('#lp-go').onclick=async()=>{if(!stops.length)return;let prev=1;for(const f of stops){const d=f-prev;if(![3,5,7].includes(d)){sfx('bad');$('#lp-m').textContent='Getriebe blockiert: Von '+prev+' nach '+f+' sind es '+d+' Etagen. Erlaubt sind 3, 5 oder 7.';return}prev=f}
  if(prev!==21){sfx('bad');$('#lp-m').textContent='Die Fahrt endet in Etage '+prev+'. Ziel ist der 21. Stock.';return}
  const al=stops.find(f=>[2,4,6,13,14,15,18].includes(f));if(al){sfx('bad');tone(1400,.15,'square',.08);tone(1400,.15,'square',.08,.25);$('#lp-m').textContent='Alarm! In Etage '+al+' hängt ein Bewegungsmelder. Der Kranich bricht die Fahrt ab. Schau in den Querschnitt.';return}
  $('#lp-m').textContent='Fahrt läuft …';sfx('lift',.5);await sleep(1400);closeViewer();$('#daycode').value=stops.join(' ');check()}};

// Tag 12: Kurierumschlag
MODS.kurier=m=>{const show=()=>{$('#ku-b').innerHTML='<div class="env"><div class="env-k">KURIER · PERSÖNLICH</div><div class="env-to">An Agent '+esc(st.cn||'')+'</div><div class="env-g">'+KURIER.map(g=>'<span>'+g+'</span>').join('')+'</div><div class="env-f">Schlüssel: Galaprogramm. Punkt · Wort · Buchstabe. Uhrzeiten zählen nicht.</div></div>';st.calls.d12env=1;save()};
 viewer('<div class="kick">Kurierumschlag</div><h3 style="font-family:var(--hud);margin:4px 0 8px">Irgendwo bei dir liegt ein Umschlag</h3><p>Dein Kontaktmann hat ihn heute für dich versteckt. Schau dich um: dort, wo du jeden Tag vorbeikommst.</p><div id="ku-b"><button class="btn ghost" id="ku-c">Ich finde keinen Umschlag</button></div>');
 if(st.calls.d12env)return show();$('#ku-c').onclick=()=>{const b=$('#ku-c');if(!b._c){b._c=1;b.textContent='Wirklich? Dann zeigt Bit dir seine Kopie.';return}show()}};

// Tag 12: Live aus dem Festsaal
MODS.gala=m=>{viewer('<div class="gala"><div class="live-h"><span class="fk-dot"></span><b>LIVE</b><span>Festsaal, Etage 22 · Mikrofon an der Bar</span></div><div class="gala-st"><div class="gala-p" style="background-image:url(a/p_halden.jpg)"></div><div><b>Viktor Halden</b><span>Begrüßung, 20:00 Uhr</span></div><button class="vo" id="vo-g"><span class="vi">'+IC.play+'</span><span class="wave">'+'<i></i>'.repeat(5)+'</span></button></div><div class="gala-eq">'+'<i></i>'.repeat(24)+'</div><details><summary>Abschrift</summary><p>Meine Damen und Herren, willkommen im Aurelion Tower. Vor zehn Jahren haben wir dieser Stadt Licht gegeben. Heute geben wir ihr etwas noch Wertvolleres: Ruhe. An Heiligabend schalten wir ein System ein, das zuhört. Das versteht. Das schützt. Sie werden nie wieder etwas sagen, das Sie bereuen. Frohe Weihnachten. Und genießen Sie den Champagner.</p></details></div>');
 bindVo($('#vo-g'),'a/vo_halden_gala.mp3',true);const eq=[...$$('.gala-eq i')];const iv=setInterval(()=>{if(!document.body.contains(eq[0]))return clearInterval(iv);eq.forEach(i=>i.style.height=(10+Math.random()*(curVo?90:25))+'%');if(Math.random()<.08)tone(2600+Math.random()*900,.12,'sine',.03)},120)};
