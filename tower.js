// Der Aurelion Tower: echtes Gebäude aus Krone, Fassade und Sockel, 24 Etagen, gläserner Panoramafahrstuhl
function curFloor(){let cur=1;for(let d=1;d<=24;d++){if(st.solved[d]){cur=Math.min(24,d+1);continue}if(unlocked(d)){cur=d;break}}return cur}
function renderTower(){$('#tw-kick').textContent='Agent '+(st.cn||'');
 const solved=Object.keys(st.solved).length,fr=Object.keys(st.frag).length;
 $('#tw-status').innerHTML='<div><b>'+solved+'/24</b><span>Etagen</span></div><div><b>'+fr+'/4</b><span>Fragmente</span></div><div><b>'+countdown()+'</b><span>bis Stille Nacht</span></div>';
 const cur=curFloor();const t=$('#tower');t.className='tower stage';
 let fl='',lb='';
 for(let d=24;d>=1;d--){const open=unlocked(d),done=!!st.solved[d];const cls=(done?'done':open?'open':'lock')+(d===cur&&!done?' cur':'');
  const top='calc(var(--fh)*'+(24-d)+')';
  fl+='<button class="tf3 '+cls+'" data-d="'+d+'" style="top:'+top+'" aria-label="Etage '+d+(open||done?' '+esc(FLOORS[d-1]):' gesperrt')+'"></button>';
  lb+='<div class="tl3 '+cls+'" style="top:calc(var(--fh)*'+(24-d)+' + var(--fh)/2)"><b>'+String(d).padStart(2,'0')+'</b><span>'+(open||done?esc(FLOORS[d-1]):'Gesperrt')+'</span>'+(done?'<em>gesichert</em>':(!open?'<em>ab '+d+'. Dez</em>':''))+'</div>'}
 t.innerHTML='<div class="tw3" id="tw3">'+
   '<div style="position:relative"><div class="crownglow"></div><img class="tw-crown" src="a/tw_crown.png" alt="Krone des Aurelion Tower mit der Tresortür"><button class="crownbtn" id="crownbtn" aria-label="Tresor"></button><div class="drone" style="top:30%;left:45%"></div><div class="drone b" style="top:55%;left:50%"></div></div>'+
   '<div class="tw-fac" id="tw-fac">'+fl+'<div class="lift"><div class="car" id="tw-car"><i></i></div></div>'+lb+'</div>'+
   '<img class="tw-base" src="a/tw_base.png" alt="">'+
  '</div>';
 t.querySelectorAll('.tf3').forEach(b=>b.onclick=()=>{const d=+b.dataset.d;if(!unlocked(d)){sfx('bad');return toast(lockText(d))}if(!DAYS[d])return toast('Diese Etage wird gerade gebaut.');moveCar(d,()=>openDay(d))});
 $('#crownbtn').onclick=()=>{sfx('static',.5);toast(st.solved[24]?'Der Tresor ist offen.':'Der Tresor. Er öffnet sich an Heiligabend.')};
 // Fahrstuhl startet unten und fährt zur aktuellen Etage
 const car=$('#tw-car');const fh=()=>$('#tw-fac').offsetHeight/24;
 car.style.transition='none';car.style.top=(23*fh()+4)+'px';car.dataset.d=1;
 requestAnimationFrame(()=>requestAnimationFrame(()=>{const ms=Math.min(3200,700+(cur-1)*110);car.style.transition='top '+ms+'ms cubic-bezier(.45,.05,.2,1)';car.style.top=((24-cur)*fh()+4)+'px';car.dataset.d=cur;if(cur>1){sfx('lift',.45);setTimeout(()=>sfx('ding',.5),ms)}}));
 setTimeout(()=>{const f=t.querySelector('.tf3[data-d="'+cur+'"]');f&&f.scrollIntoView({block:'center',behavior:'smooth'})},350);
 $('#tw-foot').textContent=PROBE?'Testmodus: alle Etagen offen':'Jeden Tag ab 0 Uhr öffnet sich eine neue Etage. Verpasste Etagen kannst du jederzeit nachholen.';
}
function moveCar(d,cb){const car=$('#tw-car'),fac=$('#tw-fac');if(!car||!fac)return cb();
 const fh=fac.offsetHeight/24,from=+(car.dataset.d||1),dist=Math.abs(from-d);
 const fl=fac.querySelector('.tf3[data-d="'+d+'"]');
 if(!dist){sfx('ding',.6);fl&&fl.classList.add('arrive');return setTimeout(cb,300)}
 const ms=Math.min(2200,450+dist*120);car.style.transition='top '+ms+'ms cubic-bezier(.45,.05,.2,1)';car.style.top=((24-d)*fh+4)+'px';car.dataset.d=d;sfx('lift',.5);
 setTimeout(()=>{sfx('ding',.6);fl&&fl.classList.add('arrive');setTimeout(cb,380)},ms)}
