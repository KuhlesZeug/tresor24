// Vorbereitung der Einsatzakte nach dem Intro, einmalig vor dem Tower
(function(){
const ITEMS=[
 ['druck','Einsatzakte ausdrucken','Alle Blätter aus dem PDF, am besten in Farbe. Blatt 11 funktioniert nur farbig. Leg sie in eine Mappe.'],
 ['ausweis','Agentenausweis bauen','Blatt 03 ausschneiden, in der Mitte falten und Rücken an Rücken kleben. Codename eintragen.'],
 ['decoder','Decoderscheibe bauen','Blatt 23: beide Scheiben ausschneiden und mit einer Musterklammer in der Mitte verbinden.'],
 ['stift','Stift und Schere bereitlegen','Du darfst auf die Blätter schreiben, falten und abstreichen. Sie gehören dir.']];
const sec=document.createElement('section');sec.id='s-prep';sec.className='screen';
sec.innerHTML='<div class="city"></div><div class="prep"><div class="prep-head"><img src="a/p_mira.jpg" alt=""><div><div class="kick">Nachricht von Mira</div><div class="prep-who">Einsatzleitung NORDLICHT</div></div><button class="prep-play" id="prep-play" type="button" aria-label="Nachricht anhören"><i></i><span>Anhören</span></button></div>'+
 '<h2 class="prep-t">Bereite deine Einsatzakte vor</h2>'+
 '<p class="prep-p">Bevor du den Tower betrittst, brauchst du deine Akte in der Hand. ECHO kann kein Papier lesen, darum liegt alles Wichtige bei dir auf dem Tisch. Ich sage dir jeden Tag, welches Blatt du brauchst. Lies nicht vor.</p>'+
 '<ul class="prep-list"></ul><button class="btn big" id="btn-prep">Meine Akte liegt bereit</button>'+
 '<p class="small prep-sm">Kein Drucker zur Hand? Du kannst trotzdem schon starten. Spätestens zur ersten Etage solltest du die Akte aber vor dir haben.</p></div>';
const anchor=document.querySelector('#s-tower');anchor.parentNode.insertBefore(sec,anchor);
const ul=sec.querySelector('.prep-list');
function draw(){st.prepChk=st.prepChk||{};ul.innerHTML=ITEMS.map(([k,t,i])=>'<li><button class="prep-chk'+(st.prepChk[k]?' on':'')+'" data-k="'+k+'" aria-label="erledigt"></button><span><b>'+t+'</b><i>'+i+'</i></span></li>').join('');
 ul.querySelectorAll('li').forEach(li=>li.onclick=()=>{const b=li.querySelector('.prep-chk'),k=b.dataset.k;st.prepChk[k]=!st.prepChk[k];save();b.classList.toggle('on',!!st.prepChk[k]);try{sfx('ok')}catch(e){}})}
let go=null;
const pb=sec.querySelector('#prep-play');const ui=on=>{pb.classList.toggle('on',!!on);pb.querySelector('span').textContent=on?'Stopp':'Anhören'};
const say=()=>{try{playVo('a/vo_prep_mira.mp3',ui)}catch(e){}};
pb.onclick=()=>{if(pb.classList.contains('on')){try{stopVo()}catch(e){}ui(false)}else{const was=st.sound;st.sound=true;say();st.sound=was}};
sec.querySelector('#btn-prep').onclick=()=>{try{stopVo()}catch(e){}ui(false);st.prep=1;save();try{sfx('ok')}catch(e){}if(go)go()};
const solvedAny=()=>{try{return Object.keys(st.solved||{}).length>0}catch(e){return false}};
const _gt=goTower;
goTower=function(){if(st.intro&&!st.prep&&!solvedAny()){go=()=>{go=null;_gt.apply(this,arguments)};draw();show('#s-prep');try{music('a/mus_menu.mp3',.35)}catch(e){}setTimeout(say,700);return}return _gt.apply(this,arguments)};
window.showPrep=()=>{go=()=>{go=null;_gt()};draw();show('#s-prep');setTimeout(say,700)};
})();
