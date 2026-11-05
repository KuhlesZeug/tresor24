// Minispiel Tag 23: Die Lume umleiten. Graben, Wasser lenken, Schieberwerk öffnen
(function(){
const W=60,H=90,TARGET=120;
const KAST=[{x:50,y:13,c:'D6'},{x:8,y:35,c:'B3'},{x:40,y:59,c:'G2'}]; // je 3 x 3 Zellen
const SCHIEBER=[7,2,5];
const BASIN={x0:21,x1:49,y0:74,y1:85};
const DRAIN={x0:2,x1:6,y0:86,y1:89};
// Lösungsweg für "Henrik hilft"
const PATH=[[5,6,9,17],[5,16,59,17],[52,16,58,39],[2,38,58,39],[2,38,8,63],[2,62,46,63],[46,62,49,73]];
const lumeDone=()=>PROBE||!!st.calls.lume;
window.lumeDone=lumeDone;

function level(){const T=new Uint8Array(W*H).fill(1);const set=(x0,y0,x1,y1,v)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(x>=0&&y>=0&&x<W&&y<H)T[y*W+x]=v};
 set(0,0,14,5,0);                       // Kammer am Rohr
 set(0,18,44,19,2);                     // Felsbank A
 set(0,40,14,41,1);set(15,40,59,41,2);  // Felsbank B, links offen
 set(0,64,44,65,2);                     // Felsbank C, rechts offen
 set(25,27,35,33,2);set(38,50,44,54,2);set(10,78,16,84,2);set(53,46,57,52,2); // Findlinge
 set(30,6,30,13,3);                     // Kabel 1 hängt von oben
 set(22,36,34,36,3);                    // Kabel 2 quer
 set(20,52,20,60,3);                    // Kabel 3
 set(20,74,20,89,2);set(50,74,50,89,2);set(20,86,50,89,2); // Becken Schieberwerk
 set(BASIN.x0,BASIN.y0,BASIN.x1,BASIN.y1,0);
 set(DRAIN.x0,DRAIN.y0,DRAIN.x1,DRAIN.y1,5); // Abfluss Aurelion
 KAST.forEach(k=>set(k.x,k.y,k.x+2,k.y+2,4));
 return T}

MODS.lume=m=>{st.calls=st.calls||{};
 if(st.calls.lumeWater&&!st.calls.lume)return schieber(m);
 viewer('<div class="gm lume"><div class="gm-h"><span class="fk-dot"></span><b>KANAL DER LUME</b><span id="lu-c"></span></div>'+
  '<div class="gm-stage"><canvas id="lu-cv"></canvas><div class="gm-ov" id="lu-ov"></div></div>'+
  '<div class="lu-k" id="lu-k"></div><div class="lu-row"><button class="btn ghost" id="lu-re">Neu anfangen</button><button class="btn ghost hide" id="lu-help">Henrik hilft</button></div>'+
  '<div class="gm-foot">Mit dem Finger durch die Erde graben. Fels hält, Kabel lassen das Wasser verdampfen.</div></div>');
 const cv=$('#lu-cv'),cs=Math.max(4,Math.min(window.innerWidth-48,400)/W),dpr=Math.min(2,window.devicePixelRatio||1);
 cv.width=W*cs*dpr;cv.height=H*cs*dpr;cv.style.width=W*cs+'px';cv.style.height=H*cs+'px';const x=cv.getContext('2d');x.scale(dpr,dpr);
 const off=document.createElement('canvas');off.width=W;off.height=H;const ox=off.getContext('2d'),img=ox.createImageData(W,H);
 const wo=document.createElement('canvas');wo.width=W;wo.height=H;const wx=wo.getContext('2d'),wimg=wx.createImageData(W,H);
 let r=13;const rnd=()=>(r=(r*9301+49297)%233280)/233280;const tex=new Float32Array(W*H).map(()=>rnd());
 let started=false,T,Wt,moved,lit,steam=[],raf,alive=true,frame=0,lastDig=0,cableHits=0,inBasin=0,t0=performance.now(),resets=0,stage1=false;
 const idx=(x,y)=>y*W+x,solid=v=>v===1||v===2||v===3||v===4;
 function reset(){T=level();Wt=new Uint8Array(W*H);moved=new Uint8Array(W*H);lit=[false,false,false];steam=[];inBasin=0;hud()}
 function hud(){$('#lu-c').textContent='KÄSTEN '+lit.filter(Boolean).length+'/3';
  $('#lu-k').innerHTML=KAST.map((k,i)=>'<span class="'+(lit[i]?'on':'')+'">Kasten '+(i+1)+' <b>'+(lit[i]?k.c:'··')+'</b></span>').join('')+'<span class="lu-f">Schieberwerk <b>'+Math.min(100,Math.round(inBasin/TARGET*100))+' %</b></span>'}
 function dig(px,py){const cx=px/cs,cy=py/cs,R=2.6;let n=0;for(let y=Math.floor(cy-R);y<=cy+R;y++)for(let xx=Math.floor(cx-R);xx<=cx+R;xx++){if(xx<0||y<0||xx>=W||y>=H)continue;if((xx+.5-cx)**2+(y+.5-cy)**2>R*R)continue;const i=idx(xx,y);if(T[i]===1){T[i]=0;n++}}
  if(n&&performance.now()-lastDig>70){lastDig=performance.now();tone(70+Math.random()*50,.06,'sawtooth',.025)}}
 function step(){moved.fill(0);const dirL=frame&1;
  for(let y=H-2;y>=0;y--){for(let k=0;k<W;k++){const xx=dirL?k:W-1-k,i=idx(xx,y);if(!Wt[i]||moved[i])continue;
   const can=(a,b)=>a>=0&&a<W&&b<H&&!solid(T[idx(a,b)])&&!Wt[idx(a,b)];
   const mv=(a,b)=>{const j=idx(a,b);Wt[i]=0;Wt[j]=1;moved[j]=1};
   if(can(xx,y+1)){mv(xx,y+1);continue}
   const s=Math.random()<.5?1:-1;
   if(can(xx+s,y+1)){mv(xx+s,y+1);continue}if(can(xx-s,y+1)){mv(xx-s,y+1);continue}
   if(can(xx+s,y)){mv(xx+s,y);continue}if(can(xx-s,y)){mv(xx-s,y)}}}
  // Kontakte: Kabel, Kästen, Abfluss
  inBasin=0;let hiss=false;
  for(let y=0;y<H;y++)for(let xx=0;xx<W;xx++){const i=idx(xx,y);if(!Wt[i])continue;
   if(T[i]===5){Wt[i]=0;continue}
   for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const a=xx+dx,b=y+dy;if(a<0||b<0||a>=W||b>=H)continue;const v=T[idx(a,b)];
    if(v===3){Wt[i]=0;hiss=true;if(steam.length<60)steam.push({x:(xx+.5)*cs,y:(y+.5)*cs,t:performance.now()});break}
    if(v===4){KAST.forEach((k,n)=>{if(!lit[n]&&a>=k.x&&a<=k.x+2&&b>=k.y&&b<=k.y+2){lit[n]=true;[660,880,1320].forEach((f,q)=>tone(f,.1,'triangle',.06,q*.07));hud();if(lit.every(Boolean))toast('Alle drei Kästen leuchten. Jetzt ins Schieberwerk.')}})}}
   if(Wt[i]&&xx>=BASIN.x0&&xx<=BASIN.x1&&y>=BASIN.y0&&y<=BASIN.y1)inBasin++}
  if(hiss){cableHits++;if(cableHits%6===1)tone(2400+Math.random()*800,.05,'square',.025);if(cableHits===1&&!st.calls.echoLume){st.calls.echoLume=1;save();playVo('a/vo_echo_lume.mp3')}}
  // Quelle
  let tot=0;for(let i=0;i<W*H;i++)tot+=Wt[i];if(started&&tot<1500)for(let k=0;k<3;k++){const xx=5+Math.floor(Math.random()*4);if(!Wt[idx(xx,1)])Wt[idx(xx,1)]=1}
  frame++}
 function render(t){const d=img.data,wd=wimg.data;wd.fill(0);
  for(let y=0;y<H;y++)for(let xx=0;xx<W;xx++){const i=idx(xx,y),o=i*4,v=T[i],n=tex[i];let c;
   if(Wt[i]){const top=y>0&&!Wt[idx(xx,y-1)];const wc=top?[170,225,255]:[40+n*20,135+n*30,235+n*20];wd[o]=wc[0];wd[o+1]=wc[1];wd[o+2]=wc[2];wd[o+3]=255;c=[16,12,10]}
   else if(v===1)c=[92+n*28,62+n*20,38+n*14];
   else if(v===2)c=[86+n*30,92+n*30,102+n*30];
   else if(v===3)c=((xx+y)%4<2)?[240,190,40]:[25,25,25];
   else if(v===4)c=[40,52,70];
   else if(v===5)c=[60,10,16];
   else c=[16+n*6,12+n*5,10+n*4];
   d[o]=c[0];d[o+1]=c[1];d[o+2]=c[2];d[o+3]=255}
  ox.putImageData(img,0,0);x.imageSmoothingEnabled=false;x.drawImage(off,0,0,W*cs,H*cs);
  wx.putImageData(wimg,0,0);x.save();x.imageSmoothingEnabled=true;x.filter='blur('+(cs*.5).toFixed(1)+'px)';x.drawImage(wo,0,0,W*cs,H*cs);x.drawImage(wo,0,0,W*cs,H*cs);x.filter='none';x.globalAlpha=.55;x.drawImage(wo,0,0,W*cs,H*cs);x.restore();
  // Rohr oben
  x.fillStyle='#6f7783';x.fillRect(4*cs,0,6*cs,1.2*cs);x.fillStyle='#9aa3af';x.fillRect(3.5*cs,1.1*cs,7*cs,.6*cs);
  // Kästen
  KAST.forEach((k,i)=>{const px=k.x*cs,py=k.y*cs,s=3*cs;x.fillStyle='#1b2533';x.fillRect(px,py,s,s);x.strokeStyle=lit[i]?'#3cf2b5':'#ff3d5a';x.lineWidth=1.5;x.strokeRect(px+.5,py+.5,s-1,s-1);
   x.fillStyle=lit[i]?'#3cf2b5':'rgba(255,61,90,'+(.5+.5*Math.sin(t/300+i))+')';x.beginPath();x.arc(px+s/2,py+s/2,cs*.55,0,7);x.fill();
   x.font='700 '+Math.round(cs*2)+'px "Chakra Petch",sans-serif';x.textAlign='center';x.fillStyle=lit[i]?'#3cf2b5':'rgba(232,241,255,.7)';x.fillText(lit[i]?k.c:'K'+(i+1),px+s/2,py-cs*.6)});
  // Becken, Abfluss
  x.strokeStyle='rgba(217,180,106,.8)';x.setLineDash([4,4]);x.strokeRect(BASIN.x0*cs,BASIN.y0*cs,(BASIN.x1-BASIN.x0+1)*cs,(BASIN.y1-BASIN.y0+1)*cs);x.setLineDash([]);
  x.font='700 '+Math.round(cs*1.8)+'px "Chakra Petch",sans-serif';x.textAlign='center';x.fillStyle='#d9b46a';x.fillText('SCHIEBERWERK',(BASIN.x0+BASIN.x1+1)/2*cs,(BASIN.y1-1)*cs);
  x.fillStyle='#ff5a6e';x.font='700 '+Math.round(cs*1.3)+'px "Chakra Petch",sans-serif';x.fillText('AURELION',(DRAIN.x0+DRAIN.x1+1)/2*cs,(DRAIN.y0-1.2)*cs);
  // Funken an Kabeln
  if(Math.random()<.4){const cells=[[30,6+Math.floor(Math.random()*8)],[22+Math.floor(Math.random()*13),36],[20,52+Math.floor(Math.random()*9)]][Math.floor(Math.random()*3)];x.fillStyle='rgba(255,240,180,.9)';x.fillRect((cells[0]+Math.random())*cs,(cells[1]+Math.random())*cs,1.6,1.6)}
  // Dampf
  steam=steam.filter(s=>t-s.t<900);steam.forEach(s=>{const a=(t-s.t)/900;x.fillStyle='rgba(220,230,240,'+(.5*(1-a))+')';x.beginPath();x.arc(s.x+Math.sin(s.t)*3,s.y-a*14,cs*(.8+a*1.4),0,7);x.fill()})}
 function loop(t){if(!alive)return;for(let k=0;k<3;k++)step();render(t);if(frame%12===0)hud();
  if(!stage1&&lit.every(Boolean)&&inBasin>=TARGET){stage1=true;st.calls.lumeWater=1;save();sfx('ok',.7);setTimeout(()=>{alive=false;schieber(m)},900);return}
  if(!$('#lu-help').classList.contains('show')&&(performance.now()-t0>150000||resets>=3)){const b=$('#lu-help');b.classList.remove('hide');b.classList.add('show')}
  raf=requestAnimationFrame(loop)}
 let down=false;const pos=e=>{const b=cv.getBoundingClientRect();return [e.clientX-b.left,e.clientY-b.top]};
 cv.addEventListener('pointerdown',e=>{e.preventDefault();down=true;cv.setPointerCapture(e.pointerId);dig(...pos(e))});
 cv.addEventListener('pointermove',e=>{if(down)dig(...pos(e))});['pointerup','pointercancel'].forEach(ev=>cv.addEventListener(ev,()=>down=false));
 cv.style.touchAction='none';
 $('#lu-re').onclick=()=>{resets++;reset()};
 $('#lu-help').onclick=async()=>{const b=$('#lu-help');b.disabled=true;for(const [x0,y0,x1,y1] of PATH){for(let y=y0;y<=y1;y++){for(let xx=x0;xx<=x1;xx++){const i=idx(xx,y);if(T[i]===1)T[i]=0}if((y-y0)%3===0)await sleep(16)}}};
 gameStop=()=>{alive=false;cancelAnimationFrame(raf);backMusic()};
 reset();raf=requestAnimationFrame(loop);
 window.__lu={solve:()=>{for(const [x0,y0,x1,y1] of PATH)for(let y=y0;y<=y1;y++)for(let xx=x0;xx<=x1;xx++){const i=idx(xx,y);if(T[i]===1)T[i]=0}},get lit(){return lit},get basin(){return inBasin},get T(){return T}};
 const o=$('#lu-ov');o.innerHTML='<b>Die Lume umleiten</b><p>Grab dem Wasser einen Weg durch alle drei Schaltkästen bis ins Schieberwerk unten. Fels hält, an Kabeln verdampft das Wasser, der rote Abfluss gehört Aurelion.</p><button class="btn" id="lu-go">Rohr öffnen</button>';o.classList.add('on');
 $('#lu-go').onclick=()=>{o.classList.remove('on');started=true;gameMusic('a/mus_lume.mp3');if(!st.calls.lumeIntro){st.calls.lumeIntro=1;save();playVo('a/vo_henrik_lume.mp3')}t0=performance.now()};
 alive=true;};

// Stufe 2: Schieberwerk mit neun Schiebern
function schieber(m){let seq=[];gameMusic('a/mus_lume.mp3');
 viewer('<div class="gm sb"><div class="gm-h"><span class="fk-dot"></span><b>SCHIEBERWERK 1931</b><span>Tiefbauamt Lumenstadt</span></div>'+
  '<div class="sb-k">'+KAST.map((k,i)=>'<span>Kasten '+(i+1)+' <b>'+k.c+'</b></span>').join('')+'</div>'+
  '<p class="small">Die Kästen zeigen Planquadrate. Welcher Schieber dort sitzt, steht auf dem Kanalplan, Blatt 24. Öffne die drei in der Reihenfolge der Kästen.</p>'+
  '<div class="sb-g">'+[1,2,3,4,5,6,7,8,9].map(n=>'<button class="sb-v" data-n="'+n+'"><svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="25" fill="none" stroke="currentColor" stroke-width="4"/><path d="M30 5V55M5 30H55M12 12L48 48M48 12L12 48" stroke="currentColor" stroke-width="3"/><circle cx="30" cy="30" r="7" fill="currentColor"/></svg><i>'+n+'</i></button>').join('')+'</div>'+
  '<div class="sb-seq" id="sb-seq"></div><div class="gm-foot">Falsche Reihenfolge? Dann landet das Wasser bei Aurelion und du fängst die Reihe neu an.</div></div>');
 if(!st.calls.lumeSb){st.calls.lumeSb=1;save();setTimeout(()=>playVo('a/vo_henrik_schieber.mp3'),400)}
 const show=()=>$('#sb-seq').innerHTML=[0,1,2].map(i=>'<span class="'+(seq[i]?'on':'')+'">'+(seq[i]||'·')+'</span>').join('');show();
 $$('.sb-v').forEach(b=>b.onclick=async()=>{const n=+b.dataset.n;b.classList.add('turn');setTimeout(()=>b.classList.remove('turn'),600);tone(90,.25,'sawtooth',.05);tone(140,.2,'triangle',.04,.1);
  seq.push(n);show();if(seq.length<3)return;
  if(seq.join()===SCHIEBER.join()){st.calls.lume=1;save();await sleep(500);powerOff(m)}else{sfx('bad',.6);await sleep(250);toast('Das Wasser rauscht in den Abfluss von Aurelion. Noch mal.',3500);seq=[];show()}})}
async function powerOff(m){const v=$('#viewer .v-box');sfx('static',.5);tone(60,1.2,'sawtooth',.08);
 const o=el('div','lu-off','<div><b>STROM AUS</b><span>Notstromverteiler Keller · überflutet</span></div>');document.body.appendChild(o);await sleep(1600);o.remove();
 playVo('a/vo_bit_lume.mp3');
 viewer('<div class="gm"><div class="gm-ov on" style="position:relative;min-height:260px;border-radius:12px"><b>Die Zellentür ist stromlos</b><p>Bit hört dich. Er klopft dir jetzt etwas durchs Rohr. Hör genau hin.</p><button class="btn" id="lu-kn">Zum Klopfen aus Zelle 3</button></div></div>');
 $('#lu-kn').onclick=()=>{closeViewer();if(window.__luDemo)return toast('Im Kalender geht es hier mit Bits Klopfcode weiter.',4000);openMod(DAYS[23].mods.find(x=>x.t==='knock'))}}

// Einbau in Tag 23
DAYS[23].mods.unshift({t:'lume',ic:'game',b:'Die Lume umleiten',s:'Kanal unter dem Keller, Henrik hat das Rohr geöffnet'},{t:'print',ic:'doc',b:'Kanalplan Lumenstadt 1931',s:'Einsatzakte, Blatt 24',doc:'kanal'});
DAYS[23].gate=()=>lumeDone();DAYS[23].gateMsg='Die Zellentür hängt noch am Notstrom. Leite zuerst die Lume ins Schieberwerk.';
DAYS[23].hints=['Erst die Lume: Grab dem Wasser einen Weg durch alle drei Schaltkästen bis ins Schieberwerk. Lass unter den Kabeln eine Reihe Erde stehen. Jeder Kasten zeigt ein Planquadrat.',
 'Auf dem Kanalplan, Blatt 24, sitzt in D6 Schieber 7, in B3 Schieber 2 und in G2 Schieber 5. Öffne 7, 2, 5. Danach klopft Bit: erst die Zeile der Tafel, dann die Spalte. Die ersten Klopfer sind 3 und 1, das ist L.',
 'Schieber 7, 2 und 5 öffnen. Bit klopft 3·1, 2·4, 1·3, 2·3, 4·4. Das ergibt LICHT.'];
// Klopfen erst nach Stromausfall
const _knock=MODS.knock;MODS.knock=m=>{if(!lumeDone())return toast('In der Zelle ist es still. Erst muss der Strom weg, leite die Lume um.',3500);_knock(m)};

// Kanalplan als Druckblatt
const KPL={A7:1,B3:2,F5:3,C1:4,G2:5,H8:6,D6:7,E3:8,C6:9};
function kanalSVG(){let s='<svg viewBox="0 0 360 380" class="kanal" role="img" aria-label="Kanalplan mit Schiebern"><rect x="30" y="20" width="320" height="320" class="kp-bg"/>';
 'ABCDEFGH'.split('').forEach((c,i)=>{s+='<text x="'+(50+i*40)+'" y="14" class="kp-l">'+c+'</text><line x1="'+(30+i*40)+'" y1="20" x2="'+(30+i*40)+'" y2="340" class="kp-g"/>'});
 for(let i=1;i<=8;i++)s+='<text x="16" y="'+(46+(i-1)*40)+'" class="kp-l">'+i+'</text><line x1="30" y1="'+(20+(i-1)*40)+'" x2="350" y2="'+(20+(i-1)*40)+'" class="kp-g"/>';
 s+='<path d="M30 300 C90 280 140 330 200 310 S300 290 350 305 L350 340 L30 340Z" class="kp-river"/><text x="250" y="330" class="kp-rv">LUME</text>';
 s+='<path d="M70 40 V140 H190 V260 H330 M150 60 H290 V180 M110 140 V300 M230 260 V320" class="kp-c"/>';
 Object.entries(KPL).forEach(([k,n])=>{const cx=30+('ABCDEFGH'.indexOf(k[0]))*40+20,cy=20+(+k[1]-1)*40+20;s+='<g class="kp-s"><circle cx="'+cx+'" cy="'+cy+'" r="12"/><text x="'+cx+'" y="'+(cy+4.5)+'">'+n+'</text></g>'});
 return s+'<text x="190" y="372" class="kp-f">Schieber nummeriert. Planquadrat: Spalte, dann Zeile.</text></svg>'}
DOCS.kanal='<div class="doc"><span class="stamp">TIEFBAUAMT</span><h3>Kanalplan Lumenstadt 1931</h3><p>Kanalnetz unter der Altstadt, Blatt 7. Jeder Kreis ist ein Schieber mit seiner Nummer.</p>'+kanalSVG()+'</div>';

// Direktaufruf zum Ausprobieren
if(location.hash==='#lume')setTimeout(()=>{window.__luDemo=1;['lume','lumeWater','lumeIntro','lumeSb','echoLume'].forEach(k=>st.calls[k]=0);MODS.lume({})},700);
})();
