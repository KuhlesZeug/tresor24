// Minispiele: Datenwurm (Tag 16) und Speicher defragmentieren (Tag 20)
IC.game='<svg viewBox="0 0 24 24"><path d="M6 8h12a4 4 0 014 4v2a3 3 0 01-5.4 1.8L15 14H9l-1.6 1.8A3 3 0 012 14v-2a4 4 0 014-4z"/><path d="M7 11v3M5.5 12.5h3M16 11.5h.01M18 13.5h.01"/></svg>';
st.games=st.games||{};
// Ton freischalten: Browser erlauben Audio erst nach einer Berührung
['pointerdown','touchend','keydown'].forEach(ev=>document.addEventListener(ev,()=>{try{ac();if(AC.state==='suspended')AC.resume()}catch(e){}},true));
const gameMusic=src=>{try{ac();if(AC.state==='suspended')AC.resume()}catch(e){}music(src,.55)};
const backMusic=()=>{try{music(actFor(Math.max(1,typeof maxDay==='function'?maxDay():1)).m,.4)}catch(e){music(null)}};
const ERRS=LOG.filter(l=>l[1]!=='INFO');
const wormDone=()=>PROBE||(st.games.worm||[]).length>=4;
const DEFRAG_N=8,NF_WORDS=NOTFUNK.split(' ');
const defragDone=()=>PROBE||(st.games.defrag||0)>=DEFRAG_N;

// Gemeinsame Teile
function swipe(elm,cb){let x0,y0,t0;elm.addEventListener('touchstart',e=>{const t=e.touches[0];x0=t.clientX;y0=t.clientY;t0=Date.now()},{passive:true});
 elm.addEventListener('touchend',e=>{if(x0==null)return;const t=e.changedTouches[0],dx=t.clientX-x0,dy=t.clientY-y0,ad=Math.max(Math.abs(dx),Math.abs(dy));x0=null;
  if(ad<18)return cb('tap');if(Math.abs(dx)>Math.abs(dy))cb(dx>0?'right':'left',ad,Date.now()-t0);else cb(dy>0?'down':'up',ad,Date.now()-t0)},{passive:true})}
// Sofortige Wischerkennung schon während der Bewegung
function swipeLive(elm,o){let x0=null,y0,sx,sy,t0,moved=false;
 elm.addEventListener('touchstart',e=>{if(e.target.closest('button'))return;const t=e.touches[0];x0=sx=t.clientX;y0=sy=t.clientY;t0=performance.now();moved=false},{passive:true});
 elm.addEventListener('touchmove',e=>{if(x0==null)return;e.preventDefault();const t=e.touches[0];if(o.move){moved=o.move(t.clientX-x0,t.clientY-y0,(dx,dy)=>{x0+=dx;y0+=dy})||moved;return}
  const dx=t.clientX-x0,dy=t.clientY-y0,th=o.th||22;if(Math.max(Math.abs(dx),Math.abs(dy))<th)return;moved=true;o.dir(Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'));x0=t.clientX;y0=t.clientY},{passive:false});
 elm.addEventListener('touchend',e=>{if(x0==null)return;const t=e.changedTouches[0],dt=performance.now()-t0;if(!moved&&o.tap)o.tap();if(o.end)o.end(t.clientX-sx,t.clientY-sy,dt);x0=null},{passive:true})}
// Knöpfe reagieren beim Drücken, mit Wiederholung beim Halten
function pressBtn(b,fn,rep){let iv,to;const stop=()=>{clearTimeout(to);clearInterval(iv)};
 b.addEventListener('pointerdown',e=>{e.preventDefault();fn();if(rep){to=setTimeout(()=>iv=setInterval(fn,rep),170)}});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,stop));b.onclick=null}
function keyHandler(map){const h=e=>{if(!$('#viewer').classList.contains('on'))return;const k=map[e.key];if(k){e.preventDefault();k()}};document.addEventListener('keydown',h);return()=>document.removeEventListener('keydown',h)}
let gameStop=null;const _closeViewerG=closeViewer;closeViewer=function(){if(gameStop){gameStop();gameStop=null}_closeViewerG()};

/* ---------------- Datenwurm ---------------- */
MODS.worm=m=>{const COLS=14,ROWS=18;st.games.worm=st.games.worm||[];st.games.wormFails=st.games.wormFails||0;
 viewer('<div class="gm worm"><div class="gm-h"><span class="fk-dot"></span><b>DATENWURM v0.3</b><span id="wm-c"></span></div>'+
  '<div class="gm-stage"><canvas id="wm-cv"></canvas><div class="gm-ov" id="wm-ov"></div></div>'+
  '<div class="gm-pad"><button data-d="up" aria-label="Hoch">▲</button><button data-d="left" aria-label="Links">◀</button><button data-d="down" aria-label="Runter">▼</button><button data-d="right" aria-label="Rechts">▶</button></div>'+
  '<div class="gm-log" id="wm-log"></div><div class="gm-foot" id="wm-foot"></div></div>');
 const cv=$('#wm-cv'),W=Math.min(window.innerWidth-56,400),cs=Math.floor(W/COLS),dpr=Math.min(2,window.devicePixelRatio||1);
 cv.width=cs*COLS*dpr;cv.height=cs*ROWS*dpr;cv.style.width=cs*COLS+'px';cv.style.height=cs*ROWS+'px';const x=cv.getContext('2d');x.scale(dpr,dpr);
 // Hintergrund mit Leiterbahnen, einmal gezeichnet
 const bg=document.createElement('canvas');bg.width=cv.width;bg.height=cv.height;const b=bg.getContext('2d');b.scale(dpr,dpr);b.fillStyle='#040a12';b.fillRect(0,0,cs*COLS,cs*ROWS);
 let r=7;const rnd=()=>(r=(r*9301+49297)%233280)/233280;b.strokeStyle='rgba(60,242,181,.07)';b.lineWidth=1.2;
 for(let i=0;i<26;i++){let px=Math.floor(rnd()*COLS)*cs+cs/2,py=Math.floor(rnd()*ROWS)*cs+cs/2;b.beginPath();b.moveTo(px,py);for(let k=0;k<4;k++){if(rnd()<.5)px+=(rnd()<.5?-1:1)*cs*(1+Math.floor(rnd()*4));else py+=(rnd()<.5?-1:1)*cs*(1+Math.floor(rnd()*4));b.lineTo(px,py)}b.stroke();b.fillStyle='rgba(60,242,181,.12)';b.beginPath();b.arc(px,py,2.2,0,7);b.fill()}
 b.fillStyle='rgba(127,231,255,.07)';for(let i=0;i<COLS;i++)for(let j=0;j<ROWS;j++)b.fillRect(i*cs+cs/2-.5,j*cs+cs/2-.5,1,1);
 b.font='700 9px "Chakra Petch",sans-serif';b.fillStyle='rgba(143,163,194,.25)';b.fillText('RACK 3 · SPEICHERBANK B',6,cs*ROWS-6);
 // Firewalls
 const WALLS=[];const wl=(x0,y0,dx,dy,n)=>{for(let i=0;i<n;i++)WALLS.push([x0+dx*i,y0+dy*i])};
 wl(3,4,1,0,4);wl(8,4,1,0,3);wl(10,8,0,1,4);wl(3,9,0,1,3);wl(1,13,1,0,4);wl(11,14,0,1,2);
 const isWall=(c,rw)=>WALLS.some(w=>w[0]===c&&w[1]===rw);
 let snake,dir,q=[],lastStep=0,food,hunter,tick,alive=false,timer=null,step=0,raf;
 const easy=()=>st.games.wormFails>=3&&st.games.wormEasy;
 const hud=()=>{$('#wm-c').textContent='BLÖCKE '+st.games.worm.length+'/4'+(easy()?' · LEICHT':'');
  $('#wm-log').innerHTML='<div class="gl-h">Fehlerprotokoll · wiederhergestellt</div>'+ERRS.map((e,i)=>st.games.worm.includes(i)?'<div class="ok"><span>'+e[0]+'</span><b>'+e[1]+'</b>'+esc(e[2])+'</div>':'<div class="no">▒▒:▒▒:▒▒ ▒▒▒▒ verschlüsselt</div>').join('')};
 const free=()=>{for(let t=0;t<200;t++){const c=Math.floor(Math.random()*COLS),rw=Math.floor(Math.random()*ROWS);if(isWall(c,rw)||snake.some(s=>s[0]===c&&s[1]===rw))continue;if(Math.abs(c-snake[0][0])+Math.abs(rw-snake[0][1])<5)continue;if(hunter&&hunter[0]===c&&hunter[1]===rw)continue;return[c,rw]}return[0,0]};
 const nextFood=()=>{const left=ERRS.map((e,i)=>i).filter(i=>!st.games.worm.includes(i));if(!left.length){food=null;return}food={p:free(),i:left[0]}};
 function reset(){snake=[[7,15],[7,16],[7,17]];dir=[0,-1];q=[];hunter=easy()?null:[1,1];step=0;nextFood();hud()}
 function overlay(h,btn,fn){const o=$('#wm-ov');o.innerHTML=h+(btn?'<button class="btn" id="wm-b">'+btn+'</button>':'');o.classList.add('on');const bb=$('#wm-b');if(bb)bb.onclick=fn}
 function start(){$('#wm-ov').classList.remove('on');gameMusic('a/mus_worm.mp3');if(!st.calls.wormIntro){st.calls.wormIntro=1;save();playVo('a/vo_bit_worm.mp3')}sfx('open',.5);alive=true;clearInterval(timer);timer=setInterval(update,easy()?210:150)}
 function turn(d){const D={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[d];if(!D)return;if(!alive){if(!wormDone()&&!$('#wm-b'))start();else return}const last=q.length?q[q.length-1]:dir;if((D[0]===last[0]&&D[1]===last[1])||(D[0]===-last[0]&&D[1]===-last[1]))return;if(q.length>=3)return;q.push(D);
  if(q.length===1){const w=Math.max(0,45-(performance.now()-lastStep));clearInterval(timer);clearTimeout(kick);kick=setTimeout(()=>{if(!alive)return;update();if(alive){clearInterval(timer);timer=setInterval(update,curSpeed())}},w)}}
 let kick;
 const curSpeed=()=>(easy()?210:150)-st.games.worm.length*12;
 function crash(why){alive=false;clearInterval(timer);st.games.wormFails++;save();sfx('bad',.6);sfx('glitch',.4);tone(90,.35,'sawtooth',.08);cv.classList.add('hit');setTimeout(()=>cv.classList.remove('hit'),400);
  if(why==='echo'&&!st.calls.echoWorm){st.calls.echoWorm=1;save();playVo('a/vo_echo_worm.mp3')}
  let h='<b>Verbindung getrennt</b><p>'+(why==='echo'?'ECHO hat den Wurm erwischt.':why==='self'?'Der Wurm hat sich selbst gebissen.':'Der Wurm ist gegen eine Firewall gekracht.')+' Deine Blöcke bleiben gespeichert.</p>';
  overlay(h,'Neuer Versuch',()=>{reset();start()});
  const o=$('#wm-ov');if(st.games.wormFails>=3&&!st.games.wormEasy){const e=el('button','btn ghost','Leichter Modus: langsamer, ohne ECHO');e.onclick=()=>{st.games.wormEasy=1;save();reset();start()};o.appendChild(e)}
  if(st.games.wormFails>=6){const e=el('button','btn ghost','Bit übernimmt den Wurm');e.onclick=()=>{st.games.worm=[0,1,2,3];save();finish()};o.appendChild(e)}}
 function finish(){alive=false;clearInterval(timer);hud();sfx('ok',.7);overlay('<b>Protokoll wiederhergestellt</b><p>Alle vier Blöcke sind gesichert. Jetzt das Patchfeld.</p>','Zum Patchfeld',()=>{closeViewer();MODS.server(m)})}
 function update(){if(q.length)dir=q.shift();lastStep=performance.now();step++;tone(step%2?880:660,.015,'square',.012);if(hunter&&step%2===0){const dd=Math.abs(hunter[0]-snake[0][0])+Math.abs(hunter[1]-snake[0][1]);if(dd<=3)tone(140+dd*30,.09,'sawtooth',.05)}const h=[snake[0][0]+dir[0],snake[0][1]+dir[1]];
  if(h[0]<0||h[1]<0||h[0]>=COLS||h[1]>=ROWS||isWall(h[0],h[1]))return crash('wall');if(snake.slice(0,-1).some(s=>s[0]===h[0]&&s[1]===h[1]))return crash('self');
  snake.unshift(h);
  if(food&&h[0]===food.p[0]&&h[1]===food.p[1]){st.games.worm.push(food.i);save();[523,659,784].forEach((f,k)=>tone(f,.08,'square',.05,k*.06));snake.push(...Array(2).fill(snake[snake.length-1]));
   clearInterval(timer);if(st.games.worm.length>=4){hud();return finish()}timer=setInterval(update,curSpeed());nextFood();hud()}else snake.pop();
  if(hunter&&step%3===0){const opts=[[1,0],[-1,0],[0,1],[0,-1]].map(d=>[hunter[0]+d[0],hunter[1]+d[1]]).filter(p=>p[0]>=0&&p[1]>=0&&p[0]<COLS&&p[1]<ROWS&&!isWall(p[0],p[1])&&!(food&&p[0]===food.p[0]&&p[1]===food.p[1]));
   opts.sort((a,c)=>(Math.abs(a[0]-h[0])+Math.abs(a[1]-h[1]))-(Math.abs(c[0]-h[0])+Math.abs(c[1]-h[1])));if(opts.length)hunter=Math.random()<.75?opts[0]:opts[Math.floor(Math.random()*opts.length)]}
  if(hunter&&snake.some(s=>s[0]===hunter[0]&&s[1]===hunter[1]))return crash('echo')}
 function draw(t){x.drawImage(bg,0,0,cs*COLS,cs*ROWS);const fl=.75+.25*Math.sin(t/120);
  WALLS.forEach(([c,rw])=>{const px=c*cs,py=rw*cs;x.fillStyle='rgba(255,61,90,'+(.18*fl)+')';x.fillRect(px,py,cs,cs);x.strokeStyle='rgba(255,61,90,'+(.75*fl)+')';x.lineWidth=1;x.strokeRect(px+1.5,py+1.5,cs-3,cs-3);
   x.save();x.beginPath();x.rect(px+2,py+2,cs-4,cs-4);x.clip();x.strokeStyle='rgba(255,61,90,.35)';for(let k=-cs;k<cs;k+=5){x.beginPath();x.moveTo(px+k,py+cs);x.lineTo(px+k+cs,py);x.stroke()}x.restore()});
  if(food){const px=food.p[0]*cs+cs/2,py=food.p[1]*cs+cs/2,pl=1+.12*Math.sin(t/180);x.strokeStyle='rgba(217,180,106,.5)';x.beginPath();x.arc(px,py,cs*.62*pl,0,7);x.stroke();
   x.shadowColor='#d9b46a';x.shadowBlur=12;x.fillStyle='#d9b46a';x.fillRect(px-cs*.32,py-cs*.32,cs*.64,cs*.64);x.shadowBlur=0;x.fillStyle='#1a1206';x.font='700 '+Math.round(cs*.3)+'px "JetBrains Mono",monospace';x.textAlign='center';x.textBaseline='middle';x.fillText('LOG',px,py+1)}
  snake.forEach((s,i)=>{const px=s[0]*cs,py=s[1]*cs,a=1-i/(snake.length+4);x.shadowColor='#3cf2b5';x.shadowBlur=i?4:14;x.fillStyle=i?'rgba(60,242,181,'+(.35+.55*a)+')':'#7fffd8';
   x.beginPath();x.roundRect(px+2,py+2,cs-4,cs-4,i?4:6);x.fill();x.shadowBlur=0});
  if(snake){const [hx,hy]=snake[0];x.fillStyle='#04201a';const ex=dir[0]*cs*.15,ey=dir[1]*cs*.15,ox=dir[1]?cs*.18:0,oy=dir[0]?cs*.18:0;[[1],[-1]].forEach(([sg])=>{x.beginPath();x.arc(hx*cs+cs/2+ex+ox*sg,hy*cs+cs/2+ey+oy*sg,cs*.09,0,7);x.fill()})}
  if(hunter){const px=hunter[0]*cs+cs/2,py=hunter[1]*cs+cs/2,h=snake[0],ang=Math.atan2(h[1]-hunter[1],h[0]-hunter[0]);x.shadowColor='#ff3d5a';x.shadowBlur=16;x.strokeStyle='#ff3d5a';x.lineWidth=2.4;x.beginPath();x.arc(px,py,cs*.38,0,7);x.stroke();x.shadowBlur=0;
   x.fillStyle='#ff3d5a';x.beginPath();x.arc(px+Math.cos(ang)*cs*.13,py+Math.sin(ang)*cs*.13,cs*.13,0,7);x.fill();x.lineWidth=1}
  x.fillStyle='rgba(0,0,0,.12)';for(let y=0;y<cs*ROWS;y+=3)x.fillRect(0,y,cs*COLS,1);
  raf=requestAnimationFrame(draw)}
 swipeLive($('.gm.worm'),{dir:turn,th:20});$$('.worm .gm-pad button').forEach(bt=>pressBtn(bt,()=>turn(bt.dataset.d)));
 const unk=keyHandler({ArrowUp:()=>turn('up'),ArrowDown:()=>turn('down'),ArrowLeft:()=>turn('left'),ArrowRight:()=>turn('right'),w:()=>turn('up'),s:()=>turn('down'),a:()=>turn('left'),d:()=>turn('right')});
 gameStop=()=>{clearInterval(timer);clearTimeout(kick);cancelAnimationFrame(raf);unk();backMusic()};
 reset();raf=requestAnimationFrame(draw);window.__wm={get s(){return snake},set s(v){snake=v},get f(){return food},set d(v){dir=v;q=[]},update:()=>update(),get alive(){return alive}};
 $('#wm-foot').textContent='Wischen, Pfeiltasten oder die Knöpfe. Firewalls und ECHOs Auge meiden.';
 if(wormDone()&&!PROBE)return finish();
 overlay('<b>Bits Datenwurm</b><p>Sammle die vier goldenen Protokollblöcke. Rote Firewalls, die Wand und dein eigener Schwanz beenden die Verbindung. Das rote Auge ist ECHO.</p>','Wurm starten',()=>start())};

// Patchfeld zeigt nur gesicherte Protokollzeilen
const _server=MODS.server;MODS.server=m=>{_server(m);if(wormDone())return;const lg=$('.srv .log');if(!lg)return;
 lg.innerHTML=LOG.map(([t,c,xx])=>{const i=ERRS.findIndex(e=>e[1]===c);const ok=c==='INFO'||(st.games.worm||[]).includes(i);return ok?'<div class="'+(c==='INFO'?'inf':'err')+'"><span>'+t+'</span><b>'+c+'</b>'+esc(xx)+'</div>':'<div class="err" style="opacity:.45"><span>▒▒:▒▒:▒▒</span><b>▒▒▒▒</b>verschlüsselt von ECHO</div>'}).join('')+
  '<button class="btn" id="sv-worm" style="margin-top:8px;width:100%">Datenwurm starten</button>';$('#sv-worm').onclick=()=>{closeViewer();MODS.worm(m)}};

/* ---------------- Speicher defragmentieren ---------------- */
const PCS={I:[[0,1],[1,1],[2,1],[3,1]],O:[[1,0],[2,0],[1,1],[2,1]],T:[[1,0],[0,1],[1,1],[2,1]],S:[[1,0],[2,0],[0,1],[1,1]],Z:[[0,0],[1,0],[1,1],[2,1]],J:[[0,0],[0,1],[1,1],[2,1]],L:[[2,0],[0,1],[1,1],[2,1]]};
const PCOL={I:'#7fe7ff',O:'#d9b46a',T:'#8b7bff',S:'#3cf2b5',Z:'#ff5a6e',J:'#7fb2ff',L:'#ffb36b'};
MODS.defrag=m=>{const C=10,R=16;st.games.defrag=st.games.defrag||0;st.games.defragFails=st.games.defragFails||0;
 viewer('<div class="gm defrag"><div class="gm-h"><span class="fk-dot"></span><b>SPEICHER DEFRAGMENTIEREN</b><span id="df-c"></span></div>'+
  '<div class="df-msg" id="df-msg"></div><div class="df-wrap"><div class="gm-stage"><canvas id="df-cv"></canvas><div class="gm-ov" id="df-ov"></div></div><div class="df-side"><div class="df-k">NÄCHSTER</div><canvas id="df-nx"></canvas><div class="df-k">REIHEN</div><div class="df-n" id="df-n"></div></div></div>'+
  '<div class="gm-pad df"><button data-a="left" aria-label="Links">◀</button><button data-a="rot" aria-label="Drehen">⟳</button><button data-a="right" aria-label="Rechts">▶</button><button data-a="down" aria-label="Schneller">▼</button><button data-a="drop" aria-label="Fallen lassen">⤓</button></div><div class="gm-foot">Tippen dreht, Wischen schiebt, nach unten wischen lässt fallen. Tastatur: Pfeile und Leertaste.</div></div>');
 const cv=$('#df-cv'),avail=Math.min(window.innerWidth-130,300),cs=Math.floor(Math.min(avail/C,(window.innerHeight*.5)/R)),dpr=Math.min(2,window.devicePixelRatio||1);
 cv.width=cs*C*dpr;cv.height=cs*R*dpr;cv.style.width=cs*C+'px';cv.style.height=cs*R+'px';const x=cv.getContext('2d');x.scale(dpr,dpr);
 const nx=$('#df-nx'),nc=Math.round(cs*.8);nx.width=nc*4*dpr;nx.height=nc*2*dpr;nx.style.width=nc*4+'px';nx.style.height=nc*2+'px';const nxx=nx.getContext('2d');nxx.scale(dpr,dpr);
 let grid,cur,next,timer,alive=false,raf,bag=[],flash=[];
 const easy=()=>st.games.defragFails>=2;
 const draw1=(g,px,py,s,col,glyph)=>{g.fillStyle=col;g.globalAlpha=.9;g.beginPath();g.roundRect(px+1,py+1,s-2,s-2,3);g.fill();g.globalAlpha=1;g.fillStyle='rgba(255,255,255,.28)';g.fillRect(px+2,py+2,s-4,2);
  g.fillStyle='rgba(4,10,18,.55)';g.font='700 '+Math.round(s*.34)+'px "JetBrains Mono",monospace';g.textAlign='center';g.textBaseline='middle';g.fillText(glyph,px+s/2,py+s/2+1)};
 const glyph=(c,rw)=>((c*7+rw*13)%16).toString(16).toUpperCase()+((c*3+rw*5)%16).toString(16).toUpperCase();
 const pick=()=>{if(!bag.length)bag=Object.keys(PCS).sort(()=>Math.random()-.5);return bag.pop()};
 const mk=k=>({k,c:PCS[k].map(p=>[...p]),x:3,y:0});
 const cells=p=>p.c.map(([a,b])=>[a+p.x,b+p.y]);
 const fits=p=>cells(p).every(([a,b])=>a>=0&&a<C&&b<R&&(b<0||!grid[b][a]));
 const rot=p=>{if(p.k==='O')return p;const n={...p,c:p.c.map(([a,b])=>[2-b,a])};if(p.k==='I')n.c=p.c.map(([a,b])=>[3-b,a]);for(const dx of [0,-1,1,-2,2]){const t={...n,x:p.x+dx};if(fits(t))return t}return p};
 const words=()=>{const n=Math.min(NF_WORDS.length,Math.floor(Math.min(st.games.defrag,DEFRAG_N)/(DEFRAG_N/NF_WORDS.length)));
  $('#df-msg').innerHTML='<div class="df-k">NOTFALLFUNK H. · 03:12 UHR</div><div class="df-w">'+NF_WORDS.map((w,i)=>i<n?'<span class="ok">'+w+'</span>':'<span>'+'█'.repeat(w.length)+'</span>').join(' ')+'</div>';
  $('#df-n').textContent=Math.min(st.games.defrag,DEFRAG_N)+'/'+DEFRAG_N;$('#df-c').textContent=easy()?'LEICHT':''};
 function overlay(h,btn,fn){const o=$('#df-ov');o.innerHTML=h+(btn?'<button class="btn" id="df-b">'+btn+'</button>':'');o.classList.add('on');const bb=$('#df-b');if(bb)bb.onclick=fn}
 function reset(){grid=Array.from({length:R},()=>Array(C).fill(null));next=mk(pick());spawn()}
 function spawn(){cur=next;cur.x=3;cur.y=0;next=mk(pick());drawNext();if(!fits(cur))over()}
 function drawNext(){nxx.clearRect(0,0,nc*4,nc*2);next.c.forEach(([a,b])=>draw1(nxx,a*nc,b*nc,nc,PCOL[next.k],''))}
 const speed=()=>(easy()?1000:Math.max(320,720-st.games.defrag*45));
 function start(){$('#df-ov').classList.remove('on');gameMusic('a/mus_defrag.mp3');if(!st.calls.defragIntro){st.calls.defragIntro=1;save();playVo('a/vo_henrik_defrag.mp3')}sfx('open',.5);alive=true;clearInterval(timer);timer=setInterval(fall,speed())}
 function lock(){cells(cur).forEach(([a,b])=>{if(b>=0)grid[b][a]={col:PCOL[cur.k],g:glyph(a,b)}});tone(180,.05,'square',.04);
  const full=[];grid.forEach((row,i)=>{if(row.every(Boolean))full.push(i)});
  if(full.length){flash=full.map(i=>({i,t:performance.now()}));full.forEach(i=>{grid.splice(i,1);grid.unshift(Array(C).fill(null))});
   const before=st.games.defrag;st.games.defrag+=full.length;save();[440,554,659,880].slice(0,full.length+1).forEach((f,k)=>tone(f,.09,'triangle',.06,k*.07));
   if(before<4&&st.games.defrag>=4&&!st.calls.echoDefrag){st.calls.echoDefrag=1;save();playVo('a/vo_echo_defrag.mp3')}
   words();clearInterval(timer);if(st.games.defrag>=DEFRAG_N)return finish();timer=setInterval(fall,speed())}
  spawn()}
 function fall(){if(!alive)return;const t={...cur,y:cur.y+1};if(fits(t))cur=t;else lock()}
 function act(a){if(!alive){if(!$('#df-b'))start();return}let t;
  if(a==='left')t={...cur,x:cur.x-1};if(a==='right')t={...cur,x:cur.x+1};if(a==='down')t={...cur,y:cur.y+1};if(a==='rot'){cur=rot(cur);tone(660,.03,'sine',.04);return}
  if(a==='drop'){while(fits({...cur,y:cur.y+1}))cur={...cur,y:cur.y+1};tone(120,.08,'triangle',.07);return lock()}
  if(t&&fits(t)){cur=t;tone(a==='down'?300:520,.02,'square',.03)}else if(t)tone(110,.04,'square',.03)}
 function over(){alive=false;clearInterval(timer);st.games.defragFails++;save();sfx('bad',.6);sfx('glitch',.4);
  overlay('<b>Speicher voll</b><p>Die wiederhergestellten Reihen bleiben erhalten. Neuer Versuch mit leerem Speicher.</p>'+(easy()?'<p class="small">Leichter Modus ist an: Die Teile fallen langsamer.</p>':''),'Neu starten',()=>{reset();start()});
  if(st.games.defragFails>=4){const e=el('button','btn ghost','Henrik setzt den Rest von Hand');e.onclick=()=>{st.games.defrag=DEFRAG_N;save();words();finish()};$('#df-ov').appendChild(e)}}
 function finish(){alive=false;clearInterval(timer);words();sfx('ok',.7);overlay('<b>Funk vollständig</b><p>Henriks Notfallfunk ist wiederhergestellt. Jetzt die Decoderscheibe.</p>','Funk öffnen',()=>{closeViewer();MODS.notfunk({})})}
 function draw(t){x.fillStyle='#050b14';x.fillRect(0,0,cs*C,cs*R);x.strokeStyle='rgba(127,231,255,.06)';for(let i=1;i<C;i++){x.beginPath();x.moveTo(i*cs,0);x.lineTo(i*cs,cs*R);x.stroke()}for(let j=1;j<R;j++){x.beginPath();x.moveTo(0,j*cs);x.lineTo(cs*C,j*cs);x.stroke()}
  grid.forEach((row,j)=>row.forEach((v,i)=>{if(v)draw1(x,i*cs,j*cs,cs,v.col,v.g)}));
  if(alive&&cur){let g={...cur};while(fits({...g,y:g.y+1}))g={...g,y:g.y+1};x.strokeStyle='rgba(255,255,255,.25)';cells(g).forEach(([a,b])=>{if(b>=0)x.strokeRect(a*cs+2,b*cs+2,cs-4,cs-4)});
   cells(cur).forEach(([a,b])=>{if(b>=0){x.shadowColor=PCOL[cur.k];x.shadowBlur=10;draw1(x,a*cs,b*cs,cs,PCOL[cur.k],glyph(a,b));x.shadowBlur=0}})}
  flash=flash.filter(f=>t-f.t<350);flash.forEach(f=>{x.fillStyle='rgba(127,231,255,'+(1-(t-f.t)/350)*.7+')';x.fillRect(0,f.i*cs,cs*C,cs)});
  x.fillStyle='rgba(0,0,0,.12)';for(let y=0;y<cs*R;y+=3)x.fillRect(0,y,cs*C,1);raf=requestAnimationFrame(draw)}
 let soft=0;swipeLive($('.gm.defrag'),{move:(dx,dy,shift)=>{const st2=cs*.8;let m=false;while(dx>=st2){act('right');dx-=st2;shift(st2,0);m=true}while(dx<=-st2){act('left');dx+=st2;shift(-st2,0);m=true}if(dy>=cs){act('down');shift(0,cs);soft++;m=true}return m},tap:()=>act('rot'),end:(dx,dy,dt)=>{if(dy>70&&dt<260&&Math.abs(dy)>Math.abs(dx)*1.5)act('drop');else if(dy<-50&&dt<300)act('rot');soft=0}});
 $$('.gm-pad.df button').forEach(bt=>{const a=bt.dataset.a;pressBtn(bt,()=>act(a),(a==='left'||a==='right'||a==='down')?55:0)});
 const unk=keyHandler({ArrowLeft:()=>act('left'),ArrowRight:()=>act('right'),ArrowDown:()=>act('down'),ArrowUp:()=>act('rot'),' ':()=>act('drop')});
 gameStop=()=>{clearInterval(timer);cancelAnimationFrame(raf);unk();backMusic()};
 reset();words();raf=requestAnimationFrame(draw);window.__df={get g(){return grid},get cur(){return cur},set cur(v){cur=v},mk,act,start};
 if(defragDone()&&!PROBE)return finish();
 overlay('<b>Speicher zerschossen</b><p>Henriks Funk liegt in Trümmern. Setz die Speicherblöcke lückenlos. Je zwei volle Reihen holen ein Wort zurück. Deine Reihen bleiben gespeichert, auch wenn der Speicher vollläuft.</p>','Aufräumen',()=>start())};

// Notfallfunk erst lesbar, wenn der Speicher aufgeräumt ist
const _notfunk=MODS.notfunk;MODS.notfunk=m=>{if(defragDone())return _notfunk(m);
 viewer('<div class="fk"><div class="fk-h"><span class="fk-dot"></span><span>Notfallfunk H.</span><span class="fk-f">beschädigt</span></div><p style="margin:14px 0">Der Funk ist beim Absturz im zerschossenen Speicher gelandet. Erst aufräumen, dann lesen.</p><button class="btn big" id="nf-df" style="width:100%">Speicher defragmentieren</button></div>');
 $('#nf-df').onclick=()=>{closeViewer();MODS.defrag(m)}};

// Einbau in die Tage
DAYS[16].mods.unshift({t:'worm',ic:'game',b:'Datenwurm',s:'ECHO hat das Protokoll zerhackt. Bits Wurm holt es zurück'});
DAYS[16].hints[0]='Starte zuerst den Datenwurm und sammle alle vier goldenen Protokollblöcke ein. Danach siehst du das ganze Protokoll. Das Neueste steht oben: Dreh die Reihenfolge um, der älteste Fehler kommt an Kabel 1.';
DAYS[20].mods.unshift({t:'defrag',ic:'game',b:'Speicher defragmentieren',s:'Der Absturz hat den Funk zerlegt. Räum auf'});
DAYS[20].hints[0]='Räum zuerst den Speicher auf, bis alle vier Wörter des Notfallfunks zu sehen sind. Dann zähl deine Fragmente in der Einsatzakte zusammen: Das ist die Verschiebung.';
// Direktaufruf zum Ausprobieren: #wurm oder #speicher
if(/^#(wurm|speicher)$/.test(location.hash))setTimeout(()=>{const k=location.hash.slice(1);if(k==='wurm'){st.games.worm=[];st.games.wormFails=0;st.games.wormEasy=0;st.calls.wormIntro=0;st.calls.echoWorm=0;MODS.worm({})}else{st.games.defrag=0;st.games.defragFails=0;st.calls.defragIntro=0;st.calls.echoDefrag=0;MODS.defrag({})}},700);
