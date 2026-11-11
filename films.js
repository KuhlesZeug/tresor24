// Zwischensequenzen zu Beginn von Akt 2, 3 und 4
window.FILMS={
 7:{title:'Akt 2 · Die Gala',vo:'a/vo_film2.mp3',music:'a/mus_akt2.mp3',len:23,
  slides:[{t:0,img:'a/fg1.jpg',card:'Akt 2 · Die Gala'},{t:5.2,img:'a/fg2.jpg'},{t:9.2,img:'a/fg3.jpg'},{t:17.2,img:'a/fg4.jpg'}],
  subs:[{t:0,x:'12. Dezember. Der Aurelion Tower leuchtet wie ein Weihnachtsbaum.'},{t:5.2,x:'500 Gäste. Champagner. Ein Streichquartett.'},{t:9.2,x:'Und mittendrin ein Mann, der die ganze Stadt zum Schweigen bringen will.'},{t:13.3,x:'Unser Plan: Rein wie Gäste. Raus wie Geister.'},{t:17.2,x:'Dafür brauchen wir eine Karte. Und einen Platz am richtigen Tisch.'}]},
 13:{title:'Akt 3 · Im Tower',vo:'a/vo_film3.mp3',music:'a/mus_akt3.mp3',len:22,
  slides:[{t:0,img:'a/ft1.jpg',card:'Akt 3 · Im Tower'},{t:4.2,img:'a/ft2.jpg'},{t:8.9,img:'a/ft3.jpg'},{t:12.9,img:'a/f_eye.jpg'}],
  subs:[{t:0,x:'Etage 13. Ab hier gibt es keine Gäste mehr.'},{t:4.2,x:'Nur Laser. Sensoren. Und Wachen, die nie müde werden.'},{t:8.9,x:'Und irgendwo in den Leitungen etwas, das uns beobachtet.'},{t:12.9,x:'ECHO. Die Tresor KI. Sie hat uns auf der Gala gesehen.'},{t:17.4,x:'Jetzt müssen wir leiser sein als je zuvor.'}]},
 19:{title:'Akt 4 · Der Tresor',vo:'a/vo_film4.mp3',music:'a/mus_akt4.mp3',len:23,
  slides:[{t:0,img:'a/fv4.jpg',card:'Akt 4 · Der Tresor'},{t:2.8,img:'a/fv1.jpg'},{t:10.5,img:'a/fv2.jpg'},{t:16.1,img:'a/fv3.jpg'}],
  subs:[{t:0,x:'Fünf Tage bis Heiligabend.'},{t:2.8,x:'Oben im 24. Stock wartet Henriks Tresor.'},{t:6.7,x:'Aber je näher wir kommen, desto lauter wird eine Frage.'},{t:10.5,x:'Wer ist die Schneeeule?'},{t:12.4,x:'Und warum hilft uns die Maschine, die uns jagen sollte?'},{t:16.1,x:'Manche Geheimnisse liegen nicht im Tresor. Sondern in uns.'}]}
};
st.films=st.films||{};
let filmRun2=0;
function playFilm(F,done){stopVo();show('#s-film');const run=++filmRun2,f=$('#film');f.innerHTML='';
 F.slides.forEach(s=>f.appendChild(el('div','fs','<div class="bg" style="background-image:url('+s.img+')"></div><div class="shade"></div>'+(s.card?'<div class="fcard">'+esc(s.card)+'</div>':''))));
 music(F.music,.6);const au=playVo(F.vo);const t0=performance.now(),sl=[...f.children];let cs=-1,sub=-1;
 const fin=()=>{if(run!==filmRun2)return;filmRun2++;stopVo();$('#btn-skip').onclick=filmDone;done&&done()};
 $('#btn-skip').onclick=fin;
 (function tick(){if(run!==filmRun2)return;const t=au&&!au.paused&&au.currentTime?au.currentTime:(performance.now()-t0)/1000;
  let i=0;F.slides.forEach((s,k)=>{if(t>=s.t)i=k});if(i!==cs){sl.forEach((e,k)=>e.classList.toggle('on',k===i));cs=i}
  let j=-1;F.subs.forEach((s,k)=>{if(t>=s.t)j=k});if(j!==sub){sub=j;const e=$('#film-sub');e.classList.remove('on');setTimeout(()=>{e.textContent=j>=0?T(F.subs[j].x):'';e.classList.add('on')},200)}
  $('#film-prog').style.width=Math.min(100,t/F.len*100)+'%';if(t>=F.len)return fin();requestAnimationFrame(tick)})()}
// Beim ersten Öffnen von Etage 7, 13 und 19 läuft zuerst der Film
const _odF=openDay;openDay=function(d){if(FILMS[d]&&!st.films[d]){st.films[d]=1;save();return playFilm(FILMS[d],()=>{music(actFor(d).m,.4);_odF(d)})}_odF(d)};
// In der Einsatzakte: alle Filme noch einmal ansehen
const _akteTab=akteTab;akteTab=function(k){if(k!=='film')return _akteTab(k);const p=$('#akte-page');
 const list=[['intro','Intro · Operation Stille Nacht',true]].concat(Object.entries(FILMS).map(([d,F])=>[d,F.title,!!st.films[d]]));
 p.innerHTML='<div class="card">Alle Zwischensequenzen, die du schon gesehen hast.</div>'+list.map(([k,t,ok])=>'<button class="mod film-it'+(ok?'':' lock')+'" data-k="'+k+'"><span class="mi">'+(ok?IC.play:IC.lock)+'</span><span><b>'+esc(t)+'</b><span>'+(ok?'Abspielen':'Noch nicht freigeschaltet')+'</span></span></button>').join('');
 $$('.film-it').forEach(b=>b.onclick=()=>{const k=b.dataset.k;if(b.classList.contains('lock'))return toast('Diesen Film siehst du, sobald du die Etage erreichst.');
  if(k==='intro')return playFilm({...INTRO,len:INTRO.len},()=>openAkte());playFilm(FILMS[k],()=>openAkte())})};
const _openAkte=openAkte;openAkte=function(){_openAkte();const t=$('#akte-tabs');if(!t.querySelector('[data-k=film]')){const b=el('button','','Filme');b.dataset.k='film';b.onclick=()=>{$$('#akte-tabs button').forEach(x=>x.classList.remove('on'));b.classList.add('on');akteTab('film')};t.appendChild(b)}};
['#btn-akte','#btn-akte2'].forEach(s=>$(s).onclick=openAkte);
