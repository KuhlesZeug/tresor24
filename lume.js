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
const LIMG={};['dirt','tunnel','rock'].forEach(n=>{const i=new Image();i.src='a/lume_'+n+'.jpg';LIMG[n]=i});
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
 function reset(){dirty=true;T=level();Wt=new Uint8Array(W*H);moved=new Uint8Array(W*H);lit=[false,false,false];steam=[];inBasin=0;hud()}
 function hud(){$('#lu-c').textContent='KÄSTEN '+lit.filter(Boolean).length+'/3';
  $('#lu-k').innerHTML=KAST.map((k,i)=>'<span class="'+(lit[i]?'on':'')+'">Kasten '+(i+1)+' <b>'+(lit[i]?k.c:'··')+'</b></span>').join('')+'<span class="lu-f">Schieberwerk <b>'+Math.min(100,Math.round(inBasin/TARGET*100))+' %</b></span>'}
 function dig(px,py){const cx=px/cs,cy=py/cs,R=2.6;let n=0;for(let y=Math.floor(cy-R);y<=cy+R;y++)for(let xx=Math.floor(cx-R);xx<=cx+R;xx++){if(xx<0||y<0||xx>=W||y>=H)continue;if((xx+.5-cx)**2+(y+.5-cy)**2>R*R)continue;const i=idx(xx,y);if(T[i]===1){T[i]=0;n++}}if(n)dirty=true;
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
 const CW=W*cs,CH=H*cs,mcv=document.createElement('canvas');mcv.width=W;mcv.height=H;const mctx=mcv.getContext('2d');
 const layer=()=>{const L=document.createElement('canvas');L.width=Math.round(CW*dpr);L.height=Math.round(CH*dpr);return L};
 const cover=(g,im,w,h)=>{const r=Math.max(w/im.naturalWidth,h/im.naturalHeight),iw=im.naturalWidth*r,ih=im.naturalHeight*r;g.drawImage(im,(w-iw)/2,(h-ih)/2,iw,ih)};
 const ready=()=>['dirt','tunnel','rock'].every(n=>LIMG[n].complete&&LIMG[n].naturalWidth);
 let dirtL=null,rockL=null,bgL=null,dirty=true;
 function masked(im,cond,L,flt){L=L||layer();const g=L.getContext('2d');g.globalCompositeOperation='source-over';g.clearRect(0,0,L.width,L.height);g.filter=flt||'none';cover(g,im,L.width,L.height);g.filter='none';
  const md=mctx.createImageData(W,H);for(let k=0;k<W*H;k++)md.data[k*4+3]=cond(T[k])?255:0;mctx.putImageData(md,0,0);
  g.globalCompositeOperation='destination-in';g.imageSmoothingEnabled=true;g.drawImage(mcv,0,0,L.width,L.height);g.drawImage(mcv,0,0,L.width,L.height);g.globalCompositeOperation='source-over';return L}
 function build(){bgL=layer();const g=bgL.getContext('2d');cover(g,LIMG.tunnel,bgL.width,bgL.height);g.fillStyle='rgba(6,10,16,.45)';g.fillRect(0,0,bgL.width,bgL.height);
  const vg=g.createRadialGradient(bgL.width/2,bgL.height/2,bgL.width*.2,bgL.width/2,bgL.height/2,bgL.width*.9);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.6)');g.fillStyle=vg;g.fillRect(0,0,bgL.width,bgL.height);
  rockL=masked(LIMG.rock,v=>v===2,null,'brightness(1.35) contrast(1.2) saturate(.6)')}
 const CABLES=[[30,6,30,13],[22,36,34,36],[20,52,20,60]];
 function drawCable(c,t){const [x0,y0,x1,y1]=c,ax=(x0+.5)*cs,ay=(y0+.5)*cs,bx=(x1+.5)*cs,by=(y1+.5)*cs;x.save();x.lineCap='round';
  x.strokeStyle='rgba(255,190,40,'+(.22+.12*Math.sin(t/180))+')';x.lineWidth=cs*4.2;x.shadowColor='rgba(255,170,0,.9)';x.shadowBlur=cs*3;x.beginPath();x.moveTo(ax,ay);x.lineTo(bx,by);x.stroke();x.shadowBlur=0;
  x.strokeStyle='#0c0c0e';x.lineWidth=cs*1.7;x.shadowColor='rgba(0,0,0,.8)';x.shadowBlur=cs;x.beginPath();x.moveTo(ax,ay);x.lineTo(bx,by);x.stroke();x.shadowBlur=0;
  const n=Math.max(1,Math.round(Math.hypot(bx-ax,by-ay)/(cs*1.6)));for(let k=0;k<n;k+=2){const a=k/n,b=(k+1)/n;x.strokeStyle='#ffc61a';x.lineWidth=cs*1.45;x.lineCap='butt';x.beginPath();x.moveTo(ax+(bx-ax)*a,ay+(by-ay)*a);x.lineTo(ax+(bx-ax)*b,ay+(by-ay)*b);x.stroke()}
  x.strokeStyle='rgba(255,255,255,.18)';x.lineWidth=cs*.25;x.beginPath();x.moveTo(ax-cs*.2,ay-cs*.2);x.lineTo(bx-cs*.2,by-cs*.2);x.stroke();
  [[ax,ay],[bx,by]].forEach(([px,py])=>{x.fillStyle='#5a5f68';x.beginPath();x.arc(px,py,cs*.8,0,7);x.fill();x.fillStyle='#9aa1ab';x.beginPath();x.arc(px-cs*.2,py-cs*.2,cs*.3,0,7);x.fill()});
  if(Math.random()<.25){const a=Math.random(),px=ax+(bx-ax)*a,py=ay+(by-ay)*a;x.shadowColor='#fff3b0';x.shadowBlur=cs*2;x.fillStyle='#fffbe0';x.beginPath();x.arc(px+(Math.random()-.5)*cs,py+(Math.random()-.5)*cs,cs*.25,0,7);x.fill();x.shadowBlur=0}
  x.restore()}
 function plate(txt,cx,cy,col,bg){x.save();x.font='700 '+Math.round(cs*1.55)+'px "Chakra Petch",sans-serif';const w=x.measureText(txt).width+cs*1.6,h=cs*2.3;
  const gr=x.createLinearGradient(0,cy-h/2,0,cy+h/2);gr.addColorStop(0,bg[0]);gr.addColorStop(1,bg[1]);x.fillStyle=gr;x.shadowColor='rgba(0,0,0,.7)';x.shadowBlur=cs;x.beginPath();x.roundRect(cx-w/2,cy-h/2,w,h,cs*.4);x.fill();x.shadowBlur=0;
  x.fillStyle='rgba(0,0,0,.35)';[[cx-w/2+cs*.5,cy],[cx+w/2-cs*.5,cy]].forEach(([a,b])=>{x.beginPath();x.arc(a,b,cs*.18,0,7);x.fill()});
  x.fillStyle=col;x.textAlign='center';x.textBaseline='middle';x.fillText(txt,cx,cy+cs*.1);x.restore()}
 function render(t){if(!ready())return renderFlat(t);if(!bgL)build();if(dirty){dirtL=masked(LIMG.dirt,v=>v===1,dirtL,'brightness(.62) saturate(.75) contrast(.95)');dirty=false}
  x.drawImage(bgL,0,0,CW,CH);
  // Schieberwerk Becken: Eisenrahmen
  x.save();x.fillStyle='rgba(20,26,34,.55)';x.fillRect(BASIN.x0*cs,BASIN.y0*cs,(BASIN.x1-BASIN.x0+1)*cs,(BASIN.y1-BASIN.y0+1)*cs);x.restore();
  x.save();x.shadowColor='rgba(0,0,0,.85)';x.shadowBlur=cs*1.6;x.drawImage(dirtL,0,0,CW,CH);x.restore();
  x.save();x.shadowColor='rgba(0,0,0,.95)';x.shadowBlur=cs*2.2;x.shadowOffsetY=cs*.5;x.drawImage(rockL,0,0,CW,CH);x.restore();
  x.save();x.shadowColor='rgba(200,220,255,.9)';x.shadowBlur=cs*.9;x.globalCompositeOperation='source-over';x.globalAlpha=.9;x.drawImage(rockL,0,0,CW,CH);x.restore();
  // Wasser
  const wd=wimg.data;wd.fill(0);for(let y=0;y<H;y++)for(let xx=0;xx<W;xx++){const i=idx(xx,y);if(!Wt[i])continue;const o=i*4,top=y>0&&!Wt[idx(xx,y-1)],n=tex[i];
   if(top){wd[o]=185;wd[o+1]=235;wd[o+2]=255}else{wd[o]=30+n*25;wd[o+1]=120+n*35;wd[o+2]=205+n*30}wd[o+3]=top?255:225}
  wx.putImageData(wimg,0,0);x.save();x.imageSmoothingEnabled=true;x.filter='blur('+(cs*dpr*.6).toFixed(1)+'px)';x.globalAlpha=.95;x.drawImage(wo,0,0,CW,CH);x.drawImage(wo,0,0,CW,CH);x.filter='none';x.globalAlpha=.5;x.drawImage(wo,0,0,CW,CH);
  x.globalCompositeOperation='lighter';x.globalAlpha=.08+.04*Math.sin(t/400);x.filter='blur('+(cs*dpr*1.5).toFixed(1)+'px)';x.drawImage(wo,0,0,CW,CH);x.restore();
  // Kabel
  CABLES.forEach(c=>drawCable(c,t));
  // Rohr der Lume oben
  x.save();const pg=x.createLinearGradient(3.5*cs,0,10.5*cs,0);pg.addColorStop(0,'#5a4422');pg.addColorStop(.35,'#e3c27a');pg.addColorStop(.6,'#b48a3e');pg.addColorStop(1,'#4a3618');
  x.fillStyle=pg;x.shadowColor='rgba(0,0,0,.8)';x.shadowBlur=cs;x.fillRect(4.2*cs,0,5.6*cs,1.6*cs);x.fillRect(3.4*cs,1.4*cs,7.2*cs,.9*cs);x.shadowBlur=0;
  x.fillStyle='#2a1d0c';for(let k=0;k<4;k++){x.beginPath();x.arc((4+k*2)*cs,1.85*cs,cs*.18,0,7);x.fill()}x.restore();
  // Abfluss Aurelion
  x.save();x.shadowColor='rgba(255,40,70,.9)';x.shadowBlur=cs*2.5;x.fillStyle='#2a0a10';x.fillRect(DRAIN.x0*cs,DRAIN.y0*cs,(DRAIN.x1-DRAIN.x0+1)*cs,(DRAIN.y1-DRAIN.y0+1)*cs);x.strokeStyle='#4a4f58';x.lineWidth=cs*.35;
  for(let k=DRAIN.x0;k<=DRAIN.x1+1;k++){x.beginPath();x.moveTo(k*cs,DRAIN.y0*cs);x.lineTo(k*cs,(DRAIN.y1+1)*cs);x.stroke()}x.restore();
  plate('AURELION',(DRAIN.x0+DRAIN.x1+1)/2*cs,(DRAIN.y0-1.6)*cs,'#fff',['#c2243a','#7a0f1e']);
  x.save();x.strokeStyle='rgba(240,212,138,'+(.7+.3*Math.sin(t/350))+')';x.lineWidth=cs*.45;x.shadowColor='#f0d48a';x.shadowBlur=cs*2.5;x.setLineDash([cs*1.5,cs]);x.lineDashOffset=-t/60;x.strokeRect(BASIN.x0*cs+cs*.3,BASIN.y0*cs,(BASIN.x1-BASIN.x0+1)*cs-cs*.6,(BASIN.y1-BASIN.y0+1)*cs-cs*.3);x.restore();
  plate('SCHIEBERWERK',(BASIN.x0+BASIN.x1+1)/2*cs,(BASIN.y0+2)*cs,'#2a1d0c',['#f0d48a','#a8823c']);
  // Schaltkästen
  KAST.forEach((k,i)=>{const cx=(k.x+1.5)*cs,cy=(k.y+1.5)*cs,on=lit[i];x.save();
   // Leuchtfeld und Peilringe, damit die Kästen sofort ins Auge fallen
   const rg=x.createRadialGradient(cx,cy,cs,cx,cy,cs*6);rg.addColorStop(0,on?'rgba(60,242,181,.55)':'rgba(255,61,90,.5)');rg.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=rg;x.beginPath();x.arc(cx,cy,cs*6,0,7);x.fill();
   if(!on)for(let q=0;q<2;q++){const ph=((t/1400)+q*.5)%1;x.strokeStyle='rgba(255,90,110,'+(.9*(1-ph))+')';x.lineWidth=cs*.35;x.beginPath();x.arc(cx,cy,cs*(2.4+ph*5),0,7);x.stroke()}
   x.restore();
   const px=k.x*cs-cs*.9,py=k.y*cs-cs*.9,s=4.8*cs;x.save();const g=x.createLinearGradient(px,py,px+s,py+s);g.addColorStop(0,'#59616e');g.addColorStop(1,'#1c222c');x.fillStyle=g;x.shadowColor='rgba(0,0,0,.8)';x.shadowBlur=cs*1.2;x.beginPath();x.roundRect(px,py,s,s,cs*.5);x.fill();x.shadowBlur=0;
   x.fillStyle='rgba(255,255,255,.35)';[[.5,.5],[s-.5*cs,.5*cs],[.5*cs,s-.5*cs],[s-.5*cs,s-.5*cs]].forEach(([a,b],q)=>{const aa=q===0?px+cs*.5:px+a,bb=q===0?py+cs*.5:py+b;x.beginPath();x.arc(aa,bb,cs*.16,0,7);x.fill()});
   const pulse=.6+.4*Math.sin(t/260+i);x.shadowColor=on?'#3cf2b5':'#ff3d5a';x.shadowBlur=cs*(on?3:2*pulse);x.fillStyle=on?'#8dffd9':'rgba(255,80,100,'+pulse+')';x.beginPath();x.arc(px+s/2,py+s/2,cs*.75,0,7);x.fill();x.restore();
   x.save();x.strokeStyle=on?'#3cf2b5':'#ff5a6e';x.lineWidth=cs*.4;x.shadowColor=x.strokeStyle;x.shadowBlur=cs*1.5;x.beginPath();x.roundRect(px,py,s,s,cs*.5);x.stroke();x.restore();
   plate(on?k.c:'KASTEN '+(i+1),px+s/2,py-cs*1.7,on?'#04221a':'#fff',on?['#8dffd9','#3cc79a']:['#e2475f','#8c1a2c'])});
  // Dampf
  steam=steam.filter(s=>t-s.t<900);steam.forEach(s=>{const a=(t-s.t)/900;x.fillStyle='rgba(225,232,240,'+(.55*(1-a))+')';x.beginPath();x.arc(s.x+Math.sin(s.t)*3,s.y-a*16,cs*(.9+a*1.6),0,7);x.fill()})}
 function renderFlat(t){const d=img.data,wd=wimg.data;wd.fill(0);
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
 $('#lu-help').onclick=async()=>{const b=$('#lu-help');b.disabled=true;for(const [x0,y0,x1,y1] of PATH){for(let y=y0;y<=y1;y++){for(let xx=x0;xx<=x1;xx++){const i=idx(xx,y);if(T[i]===1)T[i]=0}dirty=true;if((y-y0)%3===0)await sleep(16)}}};
 gameStop=()=>{alive=false;cancelAnimationFrame(raf);backMusic()};
 reset();raf=requestAnimationFrame(loop);
 window.__lu={solve:()=>{for(const [x0,y0,x1,y1] of PATH)for(let y=y0;y<=y1;y++)for(let xx=x0;xx<=x1;xx++){const i=idx(xx,y);if(T[i]===1)T[i]=0}dirty=true},get lit(){return lit},get basin(){return inBasin},get T(){return T}};
 const o=$('#lu-ov');o.innerHTML='<b>Die Lume umleiten</b><p>Grab dem Wasser einen Weg durch alle drei Schaltkästen bis ins Schieberwerk unten. Fels hält, an Kabeln verdampft das Wasser, der rote Abfluss gehört Aurelion.</p><button class="btn" id="lu-go">Rohr öffnen</button>';o.classList.add('on');
 $('#lu-go').onclick=()=>{o.classList.remove('on');started=true;gameMusic('a/mus_lume.mp3');if(!st.calls.lumeIntro){st.calls.lumeIntro=1;save();playVo('a/vo_henrik_lume.mp3')}t0=performance.now()};
 alive=true;};

// Stufe 2: Schieberwerk mit neun Schiebern
function schieber(m){let seq=[];gameMusic('a/mus_lume.mp3');
 viewer('<div class="gm sb"><div class="gm-h"><span class="fk-dot"></span><b>SCHIEBERWERK 1931</b><span>Tiefbauamt Lumenstadt</span></div>'+
  '<div class="sb-k">'+KAST.map((k,i)=>'<span>Kasten '+(i+1)+' <b>'+k.c+'</b></span>').join('')+'</div>'+
  '<p class="small">Die Kästen zeigen Planquadrate. Welcher Schieber dort sitzt, steht auf dem Kanalplan, Blatt 24. Öffne die drei in der Reihenfolge der Kästen.</p>'+
  '<div class="sb-wall"><div class="sb-g">'+[1,2,3,4,5,6,7,8,9].map(n=>'<button class="sb-v" data-n="'+n+'" aria-label="Schieber '+n+'"><span class="sb-w"><img src="a/lume_wheel.png" alt=""></span><span class="sb-n">'+n+'</span></button>').join('')+'</div></div>'+
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
