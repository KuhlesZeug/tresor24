// Nachrichten (Mailbox, Anrufe) und die vertonte Führung durch das Interface
st.inbox=st.inbox||[];st.tour=st.tour||{};

function addMsg(m){st.inbox.unshift(Object.assign({ts:Date.now(),read:0},m));save();msgBadge()}
function msgBadge(){const n=st.inbox.filter(x=>!x.read).length;$$('.btn-msg').forEach(b=>{b.dataset.n=n?String(n):'';b.classList.toggle('has',n>0)})}
function fmtTs(ts){const d=new Date(ts);return d.toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit',timeZone:'Europe/Berlin'})+', '+d.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Berlin'})+' Uhr'}
function openInbox(){stopVo();const L=st.inbox;
 let h='<div class="ib-h"><div class="kick">NORDLICHT · verschlüsselt</div><h3>Nachrichten</h3><p class="small">Sprachnachrichten, Anrufe und Meldungen der Crew. Alles kannst du hier jederzeit noch einmal anhören.</p></div>';
 if(!L.length)h+='<div class="ib-empty">Noch keine Nachrichten. Wenn die Crew dich erreichen will, landet es hier.</div>';
 L.forEach((m,i)=>{const C=CREW[m.who]||{};h+='<div class="ib-it'+(m.read?'':' new')+'"><div class="ib-top"><div class="rd-p" style="background-image:url('+(C.img||'')+')"></div><div class="ib-meta"><b>'+esc(m.name||C.n||'')+'</b><span>'+esc(m.kind)+' · '+fmtTs(m.ts)+'</span></div>'+(m.vo?'<button class="vo" data-i="'+i+'"><span class="vi">'+IC.play+'</span><span class="wave">'+'<i></i>'.repeat(5)+'</span></button>':'')+'</div>'+(m.text?'<details><summary>Abschrift</summary><p>'+esc(T(m.text))+'</p></details>':'')+'</div>'});
 viewer(h);$$('#v-body .vo').forEach(b=>bindVo(b,L[+b.dataset.i].vo,false));
 L.forEach(m=>m.read=1);save();msgBadge()}

// Banner, das zum Postfach führt
function mailboxNotice(name,kind){const mit=kind==='Mitschnitt';banner(mit?'Mitschnitt':'Mailbox',mit?'Bit hat das Gespräch von '+name+' aufgezeichnet. Tippe hier oder auf das Briefsymbol oben.':'Neue Sprachnachricht von '+name+'. Tippe hier oder auf das Briefsymbol oben.',8000,openInbox);
 $$('.btn-msg').forEach(b=>{b.classList.remove('ping');void b.offsetWidth;b.classList.add('ping')})}

// Führung
const TOURS={
 tower:[
  {sel:'#tw3 .tf3.cur|#tw3 .tf3[data-d="1"]',vo:'a/vo_tour_t1.mp3',t:'Hey, ich bin Bit. Ich hab dir dieses Interface gebaut, also kriegst du von mir die kurze Führung. Das hier ist der Aurelion Tower. Jede Etage ist ein Tag im Dezember. Die leuchtende Etage ist heute dran. Tipp drauf, und der Fahrstuhl bringt dich hoch.'},
  {sel:'#tw-status',vo:'a/vo_tour_t2.mp3',t:'Oben siehst du deinen Fortschritt. Gesicherte Etagen, gefundene Fragmente, und wie lange es noch bis Heiligabend dauert. Die vier Fragmente brauchst du ganz oben, für den Tresor. Also: sammeln.'},
  {sel:'#s-tower .btn-msg',vo:'a/vo_tour_t3.mp3',t:'Das Briefsymbol sind deine Nachrichten. Wenn du einen Anruf verpasst, landet die Sprachnachricht hier. Ein grüner Punkt heißt: Da wartet was auf dich.'},
  {sel:'#btn-akte',vo:'a/vo_tour_t4.mp3',t:'Die Mappe ist deine Einsatzakte. Dein Agentenausweis, die Crew, deine Fragmente. Und denk dran: Die Blätter zum Rätseln liegen ausgedruckt in deiner echten Mappe. Papier kann ECHO nicht lesen.'},
  {sel:'#btn-sound',vo:'a/vo_tour_t5.mp3',t:'Mit dem Lautsprecher schaltest du den Ton an oder aus. Mein Tipp: Kopfhörer auf. Dann wird es richtig gut.'},
  {sel:'#s-tower .btn-help',vo:'a/vo_tour_t6.mp3',t:'Und wenn du was vergisst: Das Fragezeichen spielt diese Führung jederzeit nochmal ab. So. Genug geredet. Ab in den Fahrstuhl.'}],
 day:[
  {sel:'#radio',vo:'a/vo_tour_u1.mp3',t:'Jede Etage beginnt mit einer Nachricht aus der Crew. Mit dem Knopf rechts hörst du sie dir nochmal an.'},
  {sel:'#mods',vo:'a/vo_tour_u2.mp3',t:'Darunter liegt dein Material für heute. Funksprüche, Profile, Aufnahmen, Dokumente. Tipp einfach drauf, dann öffnet es sich.'},
  {sel:'#term .term-row',vo:'a/vo_tour_u3.mp3',t:'Hast du die Lösung, tippst du sie hier ins Terminal und drückst auf Senden. Groß oder klein ist egal, Leerzeichen auch.'},
  {sel:'#hints',vo:'a/vo_tour_u4.mp3',t:'Hängst du fest? Kein Stress. Die Hinweise helfen dir in drei Stufen. Die letzte verrät dir die Lösung, mit Erklärung. Aber versuch es erst mal selbst.'},
  {sel:'#btn-back',vo:'a/vo_tour_u5.mp3',t:'Mit dem Pfeil oben links geht es zurück in den Tower. So, ich bin raus. Viel Glück, Agent.'}]
};
let tourOn=false;
async function runTour(key,force){if(tourOn)return;if(!force&&st.tour[key])return;const S=TOURS[key];if(!S)return;tourOn=true;stopVo();
 const o=el('div','tour','<div class="tr-spot" id="tr-spot"></div><div class="tr-tip" id="tr-tip"><div class="tr-who"><div class="rd-p" style="background-image:url('+CREW.bit.img+')"></div><div><b>'+esc(CREW.bit.n)+'</b><span>erklärt dir das Interface</span></div><button class="vo" id="tr-vo"><span class="vi">'+IC.pause+'</span><span class="wave">'+'<i></i>'.repeat(5)+'</span></button></div><p id="tr-tx"></p><div class="tr-ft"><span class="tr-dots" id="tr-dots"></span><button class="btn ghost sm" id="tr-skip">Überspringen</button><button class="btn sm" id="tr-next">Weiter</button></div></div>');
 document.body.appendChild(o);document.body.classList.add('touring');requestAnimationFrame(()=>o.classList.add('on'));
 let i=0,tgt=null;
 const place=()=>{if(!tgt)return;const r=tgt.getBoundingClientRect(),p=8,sp=$('#tr-spot'),tp=$('#tr-tip');
  const x=Math.max(4,r.left-p),y=Math.max(4,r.top-p),w=Math.min(innerWidth-8,r.width+2*p),hh=Math.min(innerHeight-8,r.height+2*p);
  Object.assign(sp.style,{left:x+'px',top:y+'px',width:w+'px',height:hh+'px'});
  const th=tp.offsetHeight,below=y+hh+12+th<innerHeight-8;tp.style.top=(below?y+hh+12:Math.max(8,y-12-th))+'px'};
 const go=async()=>{const s=S[i];tgt=null;for(const q of s.sel.split('|')){tgt=document.querySelector(q);if(tgt)break}
  $('#tr-dots').innerHTML=S.map((_,k)=>'<i class="'+(k===i?'on':'')+'"></i>').join('');
  $('#tr-next').textContent=i===S.length-1?'Los geht’s':'Weiter';$('#tr-tx').textContent=s.t;
  if(tgt){const r=tgt.getBoundingClientRect();if(r.top<70||r.bottom>innerHeight-20)tgt.scrollIntoView({block:r.height>innerHeight*.6?'start':'center',behavior:'smooth'});await sleep(380)}
  place();sfx('tap',.5);
  const ui=on=>{const b=$('#tr-vo');if(!b)return;b.classList.toggle('play',on);b.querySelector('.vi').innerHTML=on?IC.pause:IC.play;animWave(b,on)};
  playVo(s.vo,ui);$('#tr-vo').onclick=()=>{if(curVo&&curVo._ui===ui)stopVo();else playVo(s.vo,ui)}};
 const end=()=>{stopVo();st.tour[key]=1;save();o.classList.remove('on');document.body.classList.remove('touring');removeEventListener('resize',place);removeEventListener('scroll',place,true);setTimeout(()=>o.remove(),350);tourOn=false;if(key==='day'&&!force)setTimeout(()=>{const b=$('#vo-d');if(b&&!curVo)b.click()},400)};
 addEventListener('resize',place);addEventListener('scroll',place,true);
 $('#tr-next').onclick=()=>{if(++i>=S.length)return end();go()};$('#tr-skip').onclick=end;
 go()}

// Knöpfe in den Kopfzeilen
(function(){
 const add=(sel,cls,ic,title,fn)=>{const box=$(sel);if(!box)return;const b=el('button','icon '+cls,ic);b.title=title;b.setAttribute('aria-label',title);b.onclick=fn;box.insertBefore(b,box.firstChild)};
 add('#s-tower .topbtns','btn-help',IC.help,'Erklärung',()=>runTour('tower',true));
 add('#s-tower .topbtns','btn-msg',IC.mail,'Nachrichten',openInbox);
 add('#s-day .topbtns','btn-help',IC.help,'Erklärung',()=>runTour('day',true));
 add('#s-day .topbtns','btn-msg',IC.mail,'Nachrichten',openInbox);
 msgBadge();
 document.addEventListener('screen',e=>{if(e.detail==='#s-tower')setTimeout(()=>{if(curScreen==='#s-tower'&&!$('#viewer').classList.contains('on')&&!$('#call').classList.contains('on'))runTour('tower')},3400);
  if(e.detail==='#s-day')setTimeout(()=>{if(curScreen==='#s-day'&&!$('#viewer').classList.contains('on'))runTour('day')},900)});
})();
