// Effekte: Regen, Schreibmaschine, Anruf, ECHO, Banner
(function(){const c=$('#fx-rain'),x=c.getContext('2d');let W,H,dr=[];
 function rs(){const d=Math.min(devicePixelRatio,2);W=c.width=innerWidth*d;H=c.height=innerHeight*d;dr=Array.from({length:Math.min(110,Math.floor(innerWidth/5))},()=>({x:Math.random()*W,y:Math.random()*H,l:(8+Math.random()*18)*d,s:(6+Math.random()*9)*d,a:.08+Math.random()*.22}))}
 rs();addEventListener('resize',rs);
 (function f(){x.clearRect(0,0,W,H);dr.forEach(p=>{x.strokeStyle='rgba(127,231,255,'+p.a+')';x.lineWidth=1;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(p.x-p.l*.18,p.y+p.l);x.stroke();p.y+=p.s;p.x-=p.s*.18;if(p.y>H){p.y=-20;p.x=Math.random()*W*1.2}});requestAnimationFrame(f)})()})();

async function typeOut(node,text,speed,sound){node.textContent='';for(const ch of text){node.textContent+=ch;if(sound&&ch.trim()&&Math.random()<.5)SYN.type();await sleep(ch==='\n'?220:(ch==='.'?120:speed||22))}}

// Banner wie eine Systemmeldung
function banner(title,text,ms,onTap){const b=$('#banner');b.onclick=onTap?()=>{b.classList.remove('on');onTap()}:null;b.style.cursor=onTap?'pointer':'';b.innerHTML='<div class="bi">'+IC.radio.replace('<svg','<svg style="width:22px;height:22px;stroke:#3cf2b5;fill:none;stroke-width:1.6"')+'</div><div><b>'+esc(title)+'</b><span>'+esc(text)+'</span></div>';b.classList.add('on');sfx('notify',.7);clearTimeout(b._t);b._t=setTimeout(()=>b.classList.remove('on'),ms||5200);if(navigator.vibrate)navigator.vibrate([60,40,60])}

// Eingehender Anruf im Vollbild
function incomingCall(o){return new Promise(res=>{
 const c=$('#call');stopVo();duck(true);
 c.innerHTML='<div><div class="c-k">'+esc(o.via||'NORDLICHT · verschlüsselt')+'</div><div class="c-n">'+esc(o.name)+'</div><div class="c-s" id="c-s">ruft an …</div><div class="c-av" style="background-image:url('+(o.img||'')+')"></div></div><div class="c-tx" id="c-tx"></div><div class="c-btns" id="c-btns"><button class="c-b no" id="c-no"><i>'+IC.decline+'</i>Ablehnen</button><button class="c-b yes" id="c-yes"><i>'+IC.accept+'</i>Annehmen</button></div>';
 c.style.backgroundImage=o.img?'linear-gradient(180deg,rgba(5,8,15,.55),rgba(5,8,15,.92) 70%),url('+o.img+')':'';c.classList.add('on');c.setAttribute('aria-hidden','false');
 let ringing=true;const ring=()=>{if(!ringing)return;sfx('ringtone',.9);if(navigator.vibrate)navigator.vibrate([400,200,400]);setTimeout(ring,3200)};ring();
 const end=(r)=>{ringing=false;stopVo();c.classList.remove('on','c-live','c-vid');c.setAttribute('aria-hidden','true');duck(false);res(r)};
 $('#c-no').onclick=()=>{ringing=false;sfx('hangup');c.classList.remove('on');setTimeout(()=>{if(o.mailbox){o.onMailbox&&o.onMailbox()}end('declined')},400)};
 $('#c-yes').onclick=async()=>{ringing=false;sfx('pickup');c.classList.add('c-live');if(o.video){c.classList.add('c-vid');c.style.backgroundImage='linear-gradient(180deg,rgba(5,8,15,.35),rgba(5,8,15,0) 30%,rgba(5,8,15,.15) 55%,rgba(5,8,15,.92) 82%),url('+o.img+')';c.insertAdjacentHTML('beforeend','<div class="c-rec"><i></i>VIDEO · verschlüsselt</div><div class="c-self"><span>Deine Kamera ist aus</span></div>')}$('#c-s').innerHTML='<span class="c-tm" id="c-tm">00:00</span>';$('#c-btns').innerHTML='<button class="c-b no" id="c-end"><i>'+IC.decline+'</i>Auflegen</button>';
  const t0=Date.now();const iv=setInterval(()=>{const s=Math.floor((Date.now()-t0)/1000);const e=$('#c-tm');if(e)e.textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')},500);
  let done=false;const fin=()=>{if(done)return;done=true;clearInterval(iv);sfx('hangup');setTimeout(()=>end('answered'),500)};
  $('#c-end').onclick=fin;
  const a=playVo(o.vo);if(a){a.onended=()=>setTimeout(fin,900)}
  for(const line of (o.lines||[])){if(done)break;await typeOut($('#c-tx'),line,28);await sleep(900)}
  if(!a)setTimeout(fin,1500)};
})}

// ECHO übernimmt den Bildschirm
async function echoTakeover(lines,opt){opt=opt||{};stopVo();music(null);
 const g=$('#glitch');g.innerHTML='<div class="bars"></div>';g.classList.add('on');document.body.classList.add('shake-screen');sfx('glitch');if(navigator.vibrate)navigator.vibrate([30,20,30,20,80]);
 const old=document.title;document.title='ECHO';await sleep(900);document.body.classList.remove('shake-screen');
 const f=el('div','echo-full','<div class="echo-eye img" style="background-image:url(a/p_echo.jpg),radial-gradient(circle,#ff3d5a 0 20%,#2a0509 60%,#000)"></div><div class="echo-tx" id="echo-tx"></div>');document.body.appendChild(f);g.classList.remove('on');
 if(opt.vo)playVo(opt.vo);if(opt.hum)music('a/mus_echo.mp3',.35);
 for(const l of lines){await typeOut($('#echo-tx'),T(l),opt.speed||34,true);await sleep(opt.pause||1500)}
 const b=el('button','btn red',opt.btn||'Verbindung trennen');b.style.marginTop='28px';f.appendChild(b);
 await new Promise(r=>b.onclick=r);
 g.classList.add('on');sfx('glitch');await sleep(500);g.classList.remove('on');f.remove();document.title=old;stopVo();
}

// Tab Titel, wenn man weggeht
let tabT='Tresor 24 · Operation Stille Nacht';
document.addEventListener('visibilitychange',()=>{if(!st.ok)return;if(document.hidden){if(st.solved[12])document.title='Wir sehen dich, '+(st.cn||'Agent')+'.';else document.title='NORDLICHT · Verbindung gehalten'}else{document.title=tabT}});
