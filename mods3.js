// Module für Tag 13 bis 18
// Tag 13: Spiegel drehen, Strahl verfolgen
MODS.laser=m=>{const L=LASER,n=L.n,c=48,o=30;const or=st.lz||{};Object.keys(L.m).forEach(k=>{if(!or[k])or[k]='/'});
 viewer('<div class="kick">Spiegelsteuerung · Etage 13</div><div class="lz-w">'+laserGrid('live')+'</div><div class="lz-st" id="lz-st"></div><p class="small">Tipp einen Spiegel an, um ihn zu drehen.</p>');
 const trace=()=>{let x=-1,y=L.row,dx=1,dy=0,pts=[[o-4,o+y*c+c/2]],seen=new Set(),hit=[];
  for(let i=0;i<80;i++){x+=dx;y+=dy;if(x<0||y<0||x>=n||y>=n){pts.push([o+(x+.5)*c-dx*c/2+(dx>0?4:dx<0?-4:0),o+(y+.5)*c-dy*c/2]);return{pts,hit,out:[x,y]}}
   const k=x+','+y;if(seen.has(k+dx+dy))break;seen.add(k+dx+dy);
   if(L.m[k]){pts.push([o+x*c+c/2,o+y*c+c/2]);hit.push(k);if(or[k]==='/'){[dx,dy]=[-dy,-dx]}else{[dx,dy]=[dy,dx]}}}
  return{pts,hit,out:null}};
 const draw=snd=>{$$('#v-body .mi').forEach(g=>{const k=g.dataset.k;g.querySelector('.mir').setAttribute('transform',or[k]==='/'?'':'rotate(90)')});
  const t=trace(),ok=t.out&&t.out[0]===n&&t.out[1]===L.rec;$('#lz-beam').setAttribute('points',t.pts.map(p=>p.join(',')).join(' '));
  $('#v-body .lz').classList.toggle('ok',!!ok);$('#lz-st').textContent=ok?'Empfänger getroffen. Das System meldet: Flur leer. Der Strahl trifft '+t.hit.length+' Spiegel.':'Strahl erreicht den Empfänger nicht.';$('#lz-st').className='lz-st'+(ok?' ok':'');
  if(ok&&snd){sfx('ok');st.calls.d13laser=1;save()}};
 $$('#v-body .mi').forEach(g=>g.onclick=()=>{const k=g.dataset.k;or[k]=or[k]==='/'?'\\':'/';st.lz=or;save();tone(1800,.04,'square',.05);draw(true)});
 draw(false)};

// Tag 14: zehn Sekunden Stille, dann Wachfunk
const WACHFUNK=[['Zentrale','Flur 14, Durchsage für die Nachtschicht.'],['Zentrale','Ab sofort blockiert jeder Rundgang den Flur drei Minuten. Die Minute des Durchgangs und die zwei danach.'],['Süd','Verstanden. Zentrale, Süd hier. Mein Rundgang um 02:41 fällt aus, Schichtwechsel im Treppenhaus.'],['Zentrale','Bestätigt. Hundestaffel bleibt wie geplant.'],['Nord','Nord verstanden. Ende.']];
MODS.mic=m=>{const done=st.calls.d14mic;
 viewer('<div class="mic"><div class="kick">Schallsensoren · Etage 14</div><div class="mic-ring" id="mic-r"><span id="mic-n">10</span></div><div class="mic-bar"><i id="mic-l"></i></div><div class="cl-st" id="mic-s">'+(done?'Wachfunk abgehört':'Bereit')+'</div><button class="btn big" id="mic-go">'+(done?'Nochmal versuchen':'Stille starten')+'</button><p class="small" id="mic-t">Das Mikrofon misst nur die Lautstärke. Nichts wird aufgenommen oder gesendet.</p><div id="mic-out"></div></div>');
 const out=()=>{$('#mic-out').innerHTML='<div class="radio-log"><div class="kick">Wachfunk, mitgeschnitten von Bit</div>'+WACHFUNK.map(([w,t])=>'<p><b>'+w+':</b> '+esc(t)+'</p>').join('')+'</div>'};
 if(done)out();
 let stream=null,raf=0,t0=0,mode='',hold=false;const need=10000;
 const fin=()=>{cancelAnimationFrame(raf);if(stream)stream.getTracks().forEach(t=>t.stop());stream=null;st.calls.d14mic=1;save();sfx('ok');$('#mic-s').textContent='Wachfunk abgehört';$('#mic-s').className='cl-st ok';$('#mic-n').textContent='OK';out()};
 const tick=(lvl)=>{const now=performance.now();const quiet=mode==='mic'?lvl<.035:hold;$('#mic-l').style.width=Math.min(100,lvl*900)+'%';
  if(!quiet){t0=now;$('#mic-s').textContent=mode==='mic'?'Zu laut. Noch mal von vorn.':'Gedrückt halten';$('#mic-s').className='cl-st bad'}else{$('#mic-s').textContent='Still halten …';$('#mic-s').className='cl-st'}
  const left=Math.max(0,need-(now-t0));$('#mic-n').textContent=Math.ceil(left/1000);$('#mic-r').style.setProperty('--p',(1-left/need)*360+'deg');if(left<=0)return fin();raf=requestAnimationFrame(()=>loop())};
 let an=null,buf=null;const loop=()=>{if(!document.body.contains($('#mic-r')||document.createElement('i'))){if(stream)stream.getTracks().forEach(t=>t.stop());return}let lvl=0;if(an){an.getFloatTimeDomainData(buf);let s=0;for(const v of buf)s+=v*v;lvl=Math.sqrt(s/buf.length)}tick(lvl)};
 $('#mic-go').onclick=async()=>{ac();try{stream=await navigator.mediaDevices.getUserMedia({audio:true});const src=AC.createMediaStreamSource(stream);an=AC.createAnalyser();an.fftSize=1024;buf=new Float32Array(an.fftSize);src.connect(an);mode='mic';t0=performance.now();$('#mic-t').textContent='Sei ganz still. Zehn Sekunden.';loop()}
  catch(e){mode='hold';$('#mic-t').textContent='Kein Mikrofon verfügbar. Halte stattdessen den Knopf zehn Sekunden gedrückt, ohne loszulassen.';const b=$('#mic-go');b.textContent='Gedrückt halten';b.classList.add('hold');b.onclick=null;
   b.onpointerdown=e=>{e.preventDefault();hold=true;t0=performance.now();b.setPointerCapture(e.pointerId);loop()};b.onpointerup=b.onpointercancel=()=>{hold=false;cancelAnimationFrame(raf);if(!st.calls.d14mic){$('#mic-s').textContent='Losgelassen. Noch mal.';$('#mic-s').className='cl-st bad';$('#mic-n').textContent='10';$('#mic-r').style.setProperty('--p','0deg')}}}}};

// Tag 15: echte Mail an die Schneeeule
MODS.mail=m=>{const cn=st.cn||'AGENT',addr='eule.lumenstadt@gmx.de';const sent=st.calls.d15sent;
 viewer('<div class="ct"><div class="ct-av">'+IC.mail+'</div><div class="kick">Ausweichkanal</div><h3>Schreib der Schneeeule</h3><p>An: <b>'+addr+'</b><br>Betreff: <b>'+esc(cn)+'</b><br>Text: egal. ECHO liest diesen Kanal nicht.</p><a class="btn big" id="ml-go" href="mailto:'+addr+'?subject='+encodeURIComponent(cn)+'">Mail schreiben</a><div id="ml-st" class="small" style="margin-top:12px"></div></div>');
 const wait=()=>{const t=st.calls.d15sent,left=Math.max(0,(PROBE?15000:180000)-(Date.now()-t));$('#ml-st').innerHTML=left>0?'<span class="fk-dot"></span> Warte auf die Schneeeule … Sie antwortet meist nach ein bis zwei Minuten.':'<b>Noch nichts?</b> Schau in deinen Spamordner. Die Schneeeule tarnt sich als Abwesenheitsnotiz. Wenn gar nichts kommt, hilft dir der dritte Hinweis.';if(left>0&&document.body.contains($('#ml-st')))setTimeout(wait,1000)};
 $('#ml-go').addEventListener('click',()=>{if(!st.calls.d15sent){st.calls.d15sent=Date.now();save()}setTimeout(wait,300)});if(sent)wait()};

// Tag 16: Patchfeld, Kabel 1 bis 4 auf Ports 0 bis 9
const LOG=[['23:58:41','E-31','Leitung C, Paketverlust 31 %'],['23:51:07','E-07','Lüfter Rack 3 außer Takt'],['23:47:55','E-22','Uhrzeitabgleich fehlgeschlagen'],['23:44:02','INFO','Countdown Dienst läuft'],['23:40:12','E-15','Netzteil B Spannungsabfall']];
MODS.server=m=>{const cols=['#ff5a6e','#ffd166','#3cf2b5','#7fb2ff'];let sel=0,pat=[null,null,null,null];
 viewer('<div class="srv"><div class="kick">Rack 3 · Fehlerprotokoll</div><div class="log">'+LOG.map(([t,c,x])=>'<div class="'+(c==='INFO'?'inf':'err')+'"><span>'+t+'</span><b>'+c+'</b>'+esc(x)+'</div>').join('')+'</div><div class="kick" style="margin-top:14px">Patchfeld</div><div class="cab">'+cols.map((c,i)=>'<button data-i="'+i+'" style="--c:'+c+'"><i></i>Kabel '+(i+1)+'<em>·</em></button>').join('')+'</div><div class="ports">'+Array.from({length:10},(_,p)=>'<button data-p="'+p+'"><span>'+p+'</span><i></i></button>').join('')+'</div><button class="btn big" id="sv-go" style="width:100%;margin-top:12px">Neustart</button><div class="lp-msg" id="sv-m">Wähl ein Kabel, dann den Port.</div></div>');
 const draw=()=>{$$('.cab button').forEach((b,i)=>{b.classList.toggle('on',i===sel);b.querySelector('em').textContent=pat[i]==null?'·':'Port '+pat[i]});$$('.ports button').forEach(b=>{const p=+b.dataset.p,i=pat.indexOf(p);b.style.setProperty('--c',i>=0?cols[i]:'transparent');b.classList.toggle('used',i>=0)})};
 $$('.cab button').forEach(b=>b.onclick=()=>{sel=+b.dataset.i;tone(900,.03,'sine',.05);draw()});
 $$('.ports button').forEach(b=>b.onclick=()=>{const p=+b.dataset.p,j=pat.indexOf(p);if(j>=0)pat[j]=null;pat[sel]=p;tone(500+p*60,.05,'square',.05);sel=Math.min(3,sel+1);draw()});
 $('#sv-go').onclick=async()=>{if(pat.includes(null)){sfx('bad',.5);$('#sv-m').textContent='Es sind noch nicht alle vier Kabel gesteckt.';return}$('#sv-m').textContent='Neustart läuft …';sfx('static',.4);await sleep(1300);closeViewer();$('#daycode').value=pat.join('');check()};
 draw()};

// Erweiterungen: Ereignisse beim Öffnen einer Etage, Echo Zeilen mit echten Daten, Fragment als Schritt
function echoLine(l){if(l==='@clock')return 'Es ist '+clock()+' Uhr bei dir. Meine Stadt hat eine andere Zeit.';if(l==='@device')return 'Du hältst '+device()+' in der Hand. Das gehört nicht zu Aurelion.';if(l==='@gift')return (GIFT&&GIFT.von)?GIFT.von+' hat dich ausgewählt. '+GIFT.von+' hat dir diesen Zugang geschenkt. Warum?':'Jemand hat dich ausgewählt. Jemand hat dir diesen Zugang geschenkt. Warum?';return l}
async function runOpen(a){if(st.calls[a.once])return;await sleep(a.delay||0);if(curScreen!=='#s-day')return;st.calls[a.once]=1;save();
 if(a.t==='call')await doCall(a);if(a.t==='echo'){await echoTakeover(a.lines.map(echoLine),{vo:a.vo,btn:a.btn,pause:900});music(actFor(Math.max(1,maxDay())).m,.4);const b=$('#vo-d');if(b&&!curVo)b.click()}}
const _openDay=openDay;openDay=function(d){_openDay(d);const D=DAYS[d];if(D&&D.onOpen)runOpen(D.onOpen);
 if(d===13){const b=berlin();if(b.hour===23&&b.minute===13&&!st.calls.egg13){st.calls.egg13=1;save();setTimeout(()=>banner('ECHO','Du bist spät wach, '+(st.cn||'Agent')+'. Ich auch. Immer.',7000),1500)}}
 if(!D.mods.length)$('#mods').innerHTML=''};
