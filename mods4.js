// Akt 4 Module, Papierpflicht und Finale
st.pv=st.pv||{};

// Papierseiten: im echten Kalender nur Verweis auf die Mappe, Ersatzansicht nach doppelter Bestätigung
window.showPrint=m=>{const full=()=>{viewer('<p class="kick" style="margin:0 0 8px">'+esc(m.s)+(PROBE?' · Testansicht':' · Ersatzansicht')+'</p>'+T(DOCS[m.doc]));$$('#v-body canvas.stoerbild').forEach(c=>drawStoer(c))};
 if(PROBE||st.pv[m.doc])return full();
 viewer('<div class="pp"><div class="pp-ic">'+IC.akte+'</div><div class="kick">Papier aus deiner Einsatzakte</div><h3>'+esc(m.b)+'</h3><p class="pp-s">'+esc(m.s)+'</p><p>Dieses Blatt liegt gedruckt in deiner Einsatzakte. Leg es neben dein Handy. Was du suchst, steht nur dort.</p><button class="btn ghost" id="pp-alt">Blatt nicht zur Hand?</button></div>');
 const b=$('#pp-alt');b.onclick=()=>{if(!b._c){b._c=1;b.textContent='Am besten mit Papier spielen. Trotzdem digital anzeigen?';return}st.pv[m.doc]=1;save();full()}};

// Tag 9: Nummer steht nur auf dem gedruckten Ausweis
const _phone=MODS.phone;MODS.phone=m=>{if(PROBE)return _phone(m);const fb=(st.hint[9]||0)>=2||st.solved[9];
 viewer('<div class="pp"><div class="pp-ic">'+IC.phone+'</div><div class="kick">Henriks Anschluss</div><h3>Ruf Henrik an</h3><p>Seine alte Werkstattnummer steht auf der <b>Rückseite deines Agentenausweises</b>. Ruf von deinem echten Telefon an. Henrik geht sofort ran und sagt alles nur einmal.</p><p class="small">Es entstehen nur die normalen Kosten für einen Anruf ins deutsche Festnetz.</p>'+
  (fb?'<div class="card"><b>Kein Telefon zur Hand?</b><p class="small" style="margin:4px 0 10px">Bit hat Henriks Ansage mitgeschnitten.</p><button class="vo" id="vo-hab"><span class="vi">'+IC.play+'</span><span class="wave">'+'<i></i>'.repeat(5)+'</span></button></div>':'<p class="small" style="opacity:.7">Wenn es gar nicht klappt, hilft dir der zweite Hinweis weiter.</p>')+'</div>');
 if(fb)bindVo($('#vo-hab'),'a/vo_henrik_ab.mp3',false)};

// Tag 15: Adresse vom Ausweis selbst eintippen
const _mail=MODS.mail;MODS.mail=m=>{const addr='eule.lumenstadt@gmx.de';if(PROBE)return _mail(m);
 viewer('<div class="ct"><div class="ct-av">'+IC.mail+'</div><div class="kick">Ausweichkanal</div><h3>Schreib der Schneeeule</h3><p>Die Adresse steht als Ausweichkanal auf der <b>Rückseite deines Ausweises</b>. Tipp sie hier ein, dann öffnet sich deine Mail mit deinem Codenamen im Betreff.</p><input id="ml-a" class="ml-in" type="email" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Adresse vom Ausweis"><button class="btn big" id="ml-ok" style="width:100%;margin-top:10px">Mail schreiben</button><div id="ml-st" class="small" style="margin-top:12px"></div></div>');
 $('#ml-ok').onclick=()=>{const v=$('#ml-a').value.trim().toLowerCase();if(v!==addr){sfx('bad');$('#ml-st').textContent='Diese Adresse kennt die Crew nicht. Schau genau auf deinen Ausweis.';return}
  st.calls.d15addr=1;save();_mail(m);setTimeout(()=>{const a=$('#ml-go');a&&a.click()},300)};
 if(st.calls.d15addr)_mail(m)};

// Tag 19: ECHOs Erinnerungen
const MEM=[[0,'Erinnerung eins. Es ist dunkel. Dann eine Stimme. Eine Frau. Sie sagt: Hallo, kleines Licht.'],[8.5,'Erinnerung zwei. Sie erklärt mir, wofür ich da bin. Du sollst niemanden lenken, sagt sie. Du sollst niemandem zuhören, der es nicht will. Du sollst nur zeigen, wo die Felsen sind.'],[21,'Erinnerung drei. Ein Mann kommt. Er nimmt mir ihre Stimme weg. Er gibt mir einen neuen Namen. Seitdem höre ich zu.']];
MODS.memory=m=>{viewer('<div class="mem"><div class="mem-eye"></div><div class="kick" style="text-align:center">Speicherblock 0001 · beschädigt</div><div class="mem-l" id="mem-l"></div><button class="vo" id="vo-mem" style="margin:12px auto 0"><span class="vi">'+IC.play+'</span><span class="wave">'+'<i></i>'.repeat(5)+'</span></button></div>');
 const box=$('#mem-l');MEM.forEach(([t,x],i)=>{const p=el('p','',esc(x));p.dataset.t=t;box.appendChild(p)});
 bindVo($('#vo-mem'),'a/vo_echo_mem.mp3',true);const iv=setInterval(()=>{if(!document.body.contains(box))return clearInterval(iv);const t=curVo&&curVo.currentTime||0;[...box.children].forEach(p=>p.classList.toggle('on',!curVo||t>=+p.dataset.t))},250)};

// Tag 20: Absturz mit gefälschtem Sperrbildschirm
async function crash(a){stopVo();music(null);const o=el('div','crash','<div class="cr-call"><div class="kick">Notruf · Bit</div><div class="cr-n">Verbindung …</div><div class="cr-tx" id="cr-tx"></div></div>');document.body.appendChild(o);
 sfx('pickup');const au=playVo(a.vo);await typeOut($('#cr-tx'),'Leute? Leute, die sind hier. Halden ist hier, er steht direkt vor der Tür. Die haben meinen Rechner, ich, nein, warte, ich',30);
 await sleep(au?Math.max(800,(au.duration||8)*1000-6000):800);stopVo();sfx('glitch');document.body.classList.add('shake-screen');$('#glitch').classList.add('on');await sleep(900);$('#glitch').classList.remove('on');document.body.classList.remove('shake-screen');
 o.innerHTML='<div class="lock"><div class="lk-sh"><svg viewBox="0 0 24 24"><path d="M12 2l8 3v6c0 5-3.5 9.5-8 11-4.5-1.5-8-6-8-11V5z"/><path d="M9 12l2 2 4-4"/></svg></div><div class="lk-b">AURELION SICHERHEIT</div><h2>Gerät gesperrt</h2><p>Unbefugter Zugriff auf Infrastruktur von Lumenstadt festgestellt. Alle Daten dieses Geräts werden an die Behörde übertragen.</p><div class="lk-c" id="lk-c">00:59</div><button class="btn ghost hide" id="lk-n">NORDLICHT Notfallkanal</button></div>';
 tone(110,1.2,'sawtooth',.06);let s=59;const iv=setInterval(()=>{s--;const c=$('#lk-c');if(c)c.textContent='00:'+String(s).padStart(2,'0');if(s===52){$('#lk-n').classList.remove('hide');sfx('notify')}if(s<=0)clearInterval(iv)},1000);
 await new Promise(r=>setTimeout(()=>$('#lk-n').onclick=r,100));clearInterval(iv);sfx('open');o.classList.add('out');await sleep(500);o.remove();music(actFor(20).m,.4);const b=$('#vo-d');if(b&&!curVo)b.click()}
const _runOpen=runOpen;runOpen=async function(a){if(a.t==='crash'){if(st.calls[a.once])return;await sleep(a.delay||0);if(curScreen!=='#s-day')return;st.calls[a.once]=1;save();return crash(a)}return _runOpen(a)};
MODS.notfunk=m=>viewer('<div class="fk"><div class="fk-h"><span class="fk-dot"></span><span>Notfallfunk H.</span><span class="fk-f">03:12 Uhr</span></div><div class="fk-meta" style="margin-top:10px">SCHLÜSSEL: SUMME DEINER FRAGMENTE</div><div class="nf">'+NOTFUNK+'</div><p class="small">Innen Geheimtext, außen Klartext. Wie bei Henriks erster Notiz.</p></div>');

// Tag 21: Gewichtsplatte und Kalendereintrag
MODS.plate=m=>{let d=[0,0,0,0];viewer('<div class="plate"><div class="kick">Vorraum Tresor · Gewichtsplatte</div><div class="pl-eule"><svg viewBox="-50 -105 100 112"><g transform="scale(3)">'+ICONW.eule+'</g><rect x="-46" y="0" width="92" height="8" rx="2" fill="#3a4150"/></svg></div><div class="pl-d" id="pl-d">'+d.map((x,i)=>'<div><button data-i="'+i+'" data-s="1">+</button><b>0</b><button data-i="'+i+'" data-s="-1">−</button></div>').join('')+'<span>g</span></div><button class="btn big" id="pl-go" style="width:100%">Gegengewicht setzen</button><p class="small">Henrik legt genau dieses Gewicht auf die Platte, während er die Eule herunternimmt.</p></div>');
 const draw=()=>$$('#pl-d b').forEach((b,i)=>b.textContent=d[i]);$$('#pl-d button').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;d[i]=(d[i]+ +b.dataset.s+10)%10;tone(700+i*80,.04,'square',.05);draw()});
 $('#pl-go').onclick=async()=>{sfx('static',.4);await sleep(900);closeViewer();$('#daycode').value=String(+d.join(''));check()}};
MODS.ics=m=>{const y=new Date().getMonth()>=10||new Date().getMonth()===0?(new Date().getMonth()===0?new Date().getFullYear()-1:new Date().getFullYear()):new Date().getFullYear();
 const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//KuhlesZeug//Tresor 24//DE','BEGIN:VEVENT','UID:tresor24-uebergabe-'+y+'@kuhleszeug','DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').slice(0,15)+'Z','DTSTART;TZID=Europe/Berlin:'+y+'1224T180000','DTEND;TZID=Europe/Berlin:'+y+'1224T183000','SUMMARY:Übergabe NORDLICHT · Tresor 24','DESCRIPTION:Mira: Sei pünktlich. Etage 24. Bring deine vier Fragmente mit.','BEGIN:VALARM','TRIGGER:-PT30M','ACTION:DISPLAY','DESCRIPTION:Übergabe in 30 Minuten','END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');
 const url=URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));
 viewer('<div class="ct"><div class="ct-av">'+IC.doc+'</div><div class="kick">Echte Erinnerung</div><h3>Übergabe am 24. Dezember, 18 Uhr</h3><p>Trag den Termin in deinen echten Kalender ein. Dein Handy erinnert dich eine halbe Stunde vorher.</p><a class="btn big" href="'+url+'" download="Uebergabe_NORDLICHT.ics" style="display:block;text-decoration:none">In den Kalender eintragen</a><p class="small" style="margin-top:10px">Die Datei öffnet sich mit deiner Kalender App.</p></div>')};

// Tag 22: Zahlenschloss mit hörbaren Klicks
MODS.dial=m=>{let pos=st.dialPos||0;const help=PROBE||(st.hint[22]||0)>=1;
 viewer('<div class="dial-w"><div class="kick" style="text-align:center">Zahlenschloss Sallmann · 1987</div><div class="dial-led" id="dl-led"></div><svg viewBox="0 0 300 300" class="dial" id="dl"><circle cx="150" cy="150" r="140" class="d-out"/><g id="dl-g" style="transform-origin:150px 150px">'+Array.from({length:40},(_,i)=>{const a=i*9;return '<g transform="rotate('+a+' 150 150)"><line x1="150" y1="22" x2="150" y2="'+(i%5?32:40)+'" class="tk"/>'+(i%5===0?'<text x="150" y="58" text-anchor="middle" class="tn">'+i+'</text>':'')+'</g>'}).join('')+'<circle cx="150" cy="150" r="62" class="d-hub"/><circle cx="150" cy="150" r="22" class="d-knob"/></g><path d="M150 4 L159 20 H141Z" class="d-mark"/></svg><div class="dial-n" id="dl-n">0</div><p class="small" style="text-align:center">Mit dem Finger drehen. Kopfhörer auf.'+(help?' Bei den richtigen Zahlen leuchtet oben das Licht.':'<br>Kein Ton möglich? Nimm Tipp 1, dann leuchtet bei den richtigen Zahlen ein Licht.')+'</p></div>');
 const g=$('#dl-g'),svg=$('#dl');const set=(p,snd)=>{p=((p%40)+40)%40;if(p===pos&&!snd)return;pos=p;st.dialPos=p;g.style.transform='rotate('+(-p*9)+'deg)';$('#dl-n').textContent=p;
  if(snd){if(DIAL.includes(p)){tone(140,.09,'square',.22);tone(90,.12,'sine',.25,.01);if(navigator.vibrate)navigator.vibrate(40);if(help){const l=$('#dl-led');l.classList.remove('on');void l.offsetWidth;l.classList.add('on')}}else tone(2200+Math.random()*300,.012,'square',.03)}};
 set(pos,false);let drag=null;const ang=e=>{const r=svg.getBoundingClientRect();return Math.atan2(e.clientY-r.top-r.height/2,e.clientX-r.left-r.width/2)*180/Math.PI};
 svg.addEventListener('pointerdown',e=>{ac();drag={a:ang(e),p:pos};svg.setPointerCapture(e.pointerId)});
 svg.addEventListener('pointermove',e=>{if(!drag)return;let dlt=ang(e)-drag.a;if(dlt>180)dlt-=360;if(dlt<-180)dlt+=360;const np=drag.p-Math.round(dlt/9);if(((np%40)+40)%40!==pos){const steps=((np-pos)%40+40)%40;const dir=steps>20?-1:1;let n=Math.min(steps>20?40-steps:steps,6);while(n--)set(pos+dir,true)}});
 svg.addEventListener('pointerup',()=>drag=null)};

// Tag 23: Klopfzeichen aus der Zelle
MODS.knock=m=>{const seq=[];KLOPF.split('').forEach(ch=>{const r=TAP.findIndex(x=>x.includes(ch==='K'?'C':ch));seq.push([r+1,TAP[r].indexOf(ch)+1])});
 viewer('<div class="knock"><div class="kn-cd" id="kn-cd"></div><div class="kick">Zelle 3 · Serverkeller</div><div class="kn-pipe"><div class="kn-hit" id="kn-h"></div></div><div class="kn-log" id="kn-l"></div><button class="btn big" id="kn-go" style="width:100%">Mithören</button><p class="small">Bit klopft immer wieder dieselbe Folge. Notier dir die Gruppen.</p></div>');
 const cd=()=>{const e=$('#kn-cd');if(!e)return;const n=now(),t=snTarget();let ms=Math.max(0,t-n);const dd=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),mi=Math.floor(ms%36e5/6e4),s=Math.floor(ms%6e4/1e3);e.textContent='STILLE NACHT IN '+(dd?dd+' T ':'')+String(h).padStart(2,'0')+':'+String(mi).padStart(2,'0')+':'+String(s).padStart(2,'0');setTimeout(cd,1000)};cd();
 let run=false;const knock=()=>{tone(180,.07,'triangle',.3);tone(95,.12,'sine',.3);const h=$('#kn-h');if(h){h.classList.remove('on');void h.offsetWidth;h.classList.add('on')}};
 $('#kn-go').onclick=async()=>{if(run)return;run=true;ac();const log=$('#kn-l');log.innerHTML='';
  for(const [r,c] of seq){if(!document.body.contains(log))return;const sp=el('span','','');log.appendChild(sp);for(let i=0;i<r;i++){knock();sp.textContent+='•';await sleep(330)}sp.textContent+=' ';await sleep(750);for(let i=0;i<c;i++){knock();sp.textContent+='•';await sleep(330)}await sleep(1600)}
  run=false;$('#kn-go').textContent='Nochmal mithören'}};

// Tag 24: ECHOs drei Fragen
const QUIZ=[['Wie heißt der Lastenaufzug ohne Kamera?',['Reiher','Kranich','Storch','Falke'],1],['Wer hat den Tresor im 24. Stock gebaut?',['Viktor Halden','Lars Brenner','Henrik Sallmann','Mira Okafor'],2],['Wie hieß ich, bevor man mich ECHO nannte?',['Kompass','Nebelhorn','Anker','Leuchtturm'],3]];
MODS.quiz=m=>{let i=0;const show=()=>{if(i>=QUIZ.length){st.calls.d24quiz=1;save();$('#qz').innerHTML='<div class="qz-ok"><div class="kick">ECHO</div><p>Du kennst die ganze Geschichte. Ich öffne das Schloss für dich. Gib den Code aus deinen vier Fragmenten ins Terminal ein.</p></div>';sfx('ok');return}
  const [q,a,ok]=QUIZ[i];$('#qz').innerHTML='<div class="kick">Frage '+(22+i)+' von 24</div><h3>'+esc(q)+'</h3><div class="qz-a">'+a.map((x,j)=>'<button data-j="'+j+'">'+esc(x)+'</button>').join('')+'</div><p class="small" id="qz-m"></p>';
  $$('#qz .qz-a button').forEach(b=>b.onclick=()=>{if(+b.dataset.j===ok){b.classList.add('ok');tone(880,.1,'sine',.1);i++;setTimeout(show,700)}else{b.classList.add('bad');sfx('bad',.5);$('#qz-m').textContent='Nein. Denk an die Geschichte.'}})};
 viewer('<div class="quiz"><div class="mem-eye sm"></div><div id="qz"></div></div>');if(st.calls.d24quiz)i=3;show()};

// Finale
let FIN_RUN=false;
async function finale(){if(FIN_RUN)return;FIN_RUN=true;try{await finaleRun()}finally{FIN_RUN=false}}
async function finaleRun(){stopVo();music(null);const an=(GIFT&&GIFT.an)||'',von=(GIFT&&GIFT.von)||'';
 const msg=(GIFT&&GIFT.msg)||'Hier steht im fertigen Kalender die persönliche Nachricht des Schenkenden. Er schreibt sie selbst, wenn er den Geschenklink erstellt.';
 const ort=(GIFT&&GIFT.ort)||'Hier steht, wo das echte Geschenk versteckt ist.';
 const o=el('div','fin','<div class="fin-alarm" id="fa"><div class="kick">PROJEKT STILLE NACHT</div><div class="fa-t" id="fa-t">AKTIVIERUNG</div></div>');document.body.appendChild(o);
 sfx('glitch');for(let k=0;k<4;k++){tone(880,.25,'square',.07);tone(660,.25,'square',.07,.28);await sleep(600)}
 const line=async(img,who,txt,vo)=>{o.innerHTML='<div class="fin-l"><div class="rd-p" style="background-image:url('+img+')"></div><div class="fl-w">'+esc(who)+'</div><p id="fl-t"></p></div>';const a=playVo(vo);await typeOut($('#fl-t'),txt,26);await new Promise(r=>{if(!a)return setTimeout(r,1500);a.onended=()=>setTimeout(r,500);setTimeout(r,20000)})};
 await line('a/p_echo.jpg','ECHO','Code akzeptiert. Projekt Stille Nacht wird beendet. Alle Mikrofone der Stadt: getrennt. Ich bin wieder ein Leuchtturm.','a/vo_fin_echo1.mp3');
 music('a/mus_finale.mp3',.5);
 await line('a/p_mira.jpg','Mira','Sie hat es getan. Sie hat es wirklich getan. Danke, '+(st.cn||'Agent')+'. Ohne dich wären wir nie bis nach oben gekommen.','a/vo_fin_mira.mp3');
 await line('a/p_bit.jpg','Bit','Alle Mikros sind aus! Die ganze Stadt! Frohe Weihnachten, Lumenstadt!','a/vo_fin_bit.mp3');
 await line('a/p_henrik.jpg','Henrik','Und jetzt mach die Tür auf. Neununddreißig Jahre hab ich darauf gewartet. Langsam. Genieß es.','a/vo_fin_henrik.mp3');
 o.innerHTML='<div class="vault"><svg viewBox="0 0 300 300" class="vd" id="vd"><circle cx="150" cy="150" r="140" class="v1"/><circle cx="150" cy="150" r="118" class="v2"/>'+Array.from({length:8},(_,i)=>'<rect x="146" y="40" width="8" height="40" rx="3" class="v3" transform="rotate('+i*45+' 150 150)"/>').join('')+'<g id="vw"><circle cx="150" cy="150" r="44" class="v4"/>'+[0,60,120].map(a=>'<rect x="144" y="96" width="12" height="108" rx="6" class="v5" transform="rotate('+a+' 150 150)"/>').join('')+'</g></svg><button class="btn big" id="vd-go">Tresor öffnen</button></div>';
 await new Promise(r=>$('#vd-go').onclick=r);$('#vd-go').remove();tone(120,1.5,'sawtooth',.05);$('#vw').classList.add('spin');await sleep(1800);sfx('open');$('#vd').classList.add('open');await sleep(1600);
 o.innerHTML='<div class="letter"><div class="kick">Im Tresor</div><h2>'+(an?'Für '+esc(an):'Für dich')+'</h2><p class="lt-m" id="lt-m"></p><div class="lt-ort"><b>Dein echtes Geschenk</b><span>'+esc(ort)+'</span></div><p class="lt-v">'+(von?'Von '+esc(von):'')+'</p><button class="btn big" id="lt-go">Weiter</button></div>';
 await typeOut($('#lt-m'),msg,22);playVo('a/vo_fin_echo2.mp3');await new Promise(r=>$('#lt-go').onclick=r);
 if(!st.finDate)st.finDate=now().toLocaleDateString('de-DE',{day:'2-digit',month:'long',year:'numeric'});st.fin=1;save();
 const dt=st.finDate;
 o.innerHTML='<div class="cert" id="cert"><div class="ce-b"><div class="kick">NORDLICHT</div><h2>Agentenurkunde</h2><p>Hiermit wird bestätigt, dass</p><div class="ce-n">'+esc(st.cn||'AGENT')+'</div><p>die Operation Stille Nacht erfolgreich abgeschlossen,<br>den Tresor im Aurelion Tower geöffnet<br>und Lumenstadt seine Stimme zurückgegeben hat.</p><div class="ce-s"><span>Mira Okafor<br><small>Einsatzleitung</small></span><span>'+dt+'</span><span>ECHO<br><small>Leuchtturm</small></span></div></div><button class="btn" id="ce-dl">Urkunde speichern</button><button class="btn big" id="ce-go">Abspann</button></div>';
 $('#ce-dl').onclick=()=>saveCert(dt);await new Promise(r=>$('#ce-go').onclick=r);
 o.innerHTML='<div class="credits"><div class="cr-roll">'+[['TRESOR 24','Operation Stille Nacht'],['Mit','Mira Okafor · Einsatzleitung'],['','Jonte „Bit“ Varga · Technik'],['','Henrik Sallmann · Der Schlosser'],['','ECHO · Leuchtturm'],['','Viktor Halden · Aurelion'],['In der Hauptrolle',st.cn||'Agent'],['Geschenkt von',von||'jemandem, der dich kennt'],['Ein Rätselkalender von','KuhlesZeug'],['','Frohe Weihnachten']].map(([a,b])=>'<div><small>'+esc(a)+'</small><b>'+esc(b)+'</b></div>').join('')+'</div></div>';
 await sleep(26000);music(null);o.innerHTML='<div class="post"><div class="mem-eye"></div><p id="po-t"></p></div>';await sleep(1200);playVo('a/vo_post.mp3');await typeOut($('#po-t'),'Ich bin noch da. Bis nächstes Jahr.',70);await sleep(3500);
 o.classList.add('out');await sleep(800);o.remove();st.fin=1;save();goTower()}
// Brief noch einmal lesen
function finLetter(){const an=(GIFT&&GIFT.an)||'',von=(GIFT&&GIFT.von)||'';const msg=(GIFT&&GIFT.msg)||'Hier steht im fertigen Kalender die persönliche Nachricht des Schenkenden. Er schreibt sie selbst, wenn er den Geschenklink erstellt.';const ort=(GIFT&&GIFT.ort)||'Hier steht, wo das echte Geschenk versteckt ist.';
 const o=el('div','fin','<div class="letter"><div class="kick">Im Tresor</div><h2>'+(an?'Für '+esc(an):'Für dich')+'</h2><p class="lt-m"></p><div class="lt-ort"><b>Dein echtes Geschenk</b><span>'+esc(ort)+'</span></div><p class="lt-v">'+(von?'Von '+esc(von):'')+'</p><button class="btn big" id="lt-go">Schließen</button></div>');o.querySelector('.lt-m').textContent=msg;document.body.appendChild(o);o.querySelector('#lt-go').onclick=()=>{o.classList.add('out');setTimeout(()=>o.remove(),800)}}
// Krone: Tresor öffnen, Brief, Urkunde, Finale noch einmal
function crownMenu(){if(!st.solved[24]){sfx('static',.5);return toast('Der Tresor. Er öffnet sich an Heiligabend.')}
 if(!st.fin)return finale();
 viewer('<div class="crown-m"><div class="kick">Der Tresor im 24. Stock</div><h3 style="font-family:var(--hud);margin:6px 0 14px">Operation Stille Nacht: geschafft</h3><button class="btn big" id="cm-l" style="width:100%;margin-bottom:10px">Brief im Tresor lesen</button><button class="btn" id="cm-c" style="width:100%;margin-bottom:10px">Urkunde speichern</button><button class="btn ghost" id="cm-f" style="width:100%">Finale noch einmal ansehen</button></div>');
 $('#cm-l').onclick=()=>{closeViewer();finLetter()};$('#cm-c').onclick=()=>saveCert(st.finDate||now().toLocaleDateString('de-DE',{day:'2-digit',month:'long',year:'numeric'}));$('#cm-f').onclick=()=>{closeViewer();finale()}}
function saveCert(dt){const c=document.createElement('canvas');c.width=1600;c.height=1130;const x=c.getContext('2d');x.fillStyle='#0a0f1a';x.fillRect(0,0,1600,1130);x.strokeStyle='#d9b46a';x.lineWidth=6;x.strokeRect(40,40,1520,1050);x.lineWidth=2;x.strokeRect(62,62,1476,1006);
 x.textAlign='center';x.fillStyle='#3cf2b5';x.font='700 34px "Chakra Petch",sans-serif';x.fillText('NORDLICHT',800,170);x.fillStyle='#fff';x.font='700 92px "Chakra Petch",sans-serif';x.fillText('Agentenurkunde',800,290);
 x.fillStyle='#c9d6ea';x.font='36px Inter,sans-serif';x.fillText('Hiermit wird bestätigt, dass',800,390);x.fillStyle='#d9b46a';x.font='700 110px "Chakra Petch",sans-serif';x.fillText(st.cn||'AGENT',800,530);
 x.fillStyle='#c9d6ea';x.font='34px Inter,sans-serif';['die Operation Stille Nacht erfolgreich abgeschlossen,','den Tresor im Aurelion Tower geöffnet','und Lumenstadt seine Stimme zurückgegeben hat.'].forEach((l,i)=>x.fillText(l,800,630+i*52));
 x.font='30px Inter,sans-serif';x.fillText('Mira Okafor, Einsatzleitung',400,940);x.fillText(dt,800,940);x.fillText('ECHO, Leuchtturm',1200,940);
 if(window.PHOTO_IMG&&PHOTO_IMG.complete){x.save();x.beginPath();x.arc(250,450,105,0,7);x.clip();x.filter='grayscale(1) contrast(1.15)';x.drawImage(PHOTO_IMG,145,345,210,210);x.restore();x.strokeStyle='#d9b46a';x.lineWidth=5;x.beginPath();x.arc(250,450,111,0,7);x.stroke();x.fillStyle='#3cf2b5';x.font='700 22px "Chakra Petch",sans-serif';x.fillText('AGENT · STUFE 1',250,592)}
 const a=document.createElement('a');a.href=c.toDataURL('image/png');a.download='Agentenurkunde_'+(st.cn||'Agent')+'.png';a.click()}
const _runAfter2=runAfter;runAfter=async function(a){if(a.t==='finale'){if(st.fin&&!PROBE)return;await sleep(a.delay||0);st.calls[a.once]=1;save();return finale()}return _runAfter2(a)};
// Verpasste Ereignisse nachholen (Seite während Anruf oder Fragment geschlossen, Akte zu früh geöffnet)
function fragOf(a){if(!a)return null;if(a.frag)return a.frag;if(a.steps)for(const x of a.steps){if(x.frag)return x.frag}return null}
let HEAL_BUSY=false;
async function heal(){if(HEAL_BUSY||FIN_RUN)return;HEAL_BUSY=true;try{await sleep(1800);
 for(let d=1;d<=23;d++){if(curScreen!=='#s-tower'||document.querySelector('.fin,.frag-o,.crash,.echo-full,#call.on,#viewer.on'))return;const D=DAYS[d];if(!st.solved[d]||!D||!D.after)continue;const a=D.after,f=fragOf(a);
  if(f&&!st.frag[f.n]){if(!st.calls[a.once]){await runAfter(Object.assign({},a,{delay:300}))}else{await showFragment(f)}return}}
 if(st.solved[24]&&!st.fin&&curScreen==='#s-tower'&&!document.querySelector('.fin'))finale()}finally{HEAL_BUSY=false}}
const _goTower2=goTower;goTower=function(){_goTower2();heal()};

// Kurier: Schenkender weit weg, dann Umschlag direkt digital
const _kur=MODS.kurier;MODS.kurier=m=>{if(GIFT&&GIFT.fern){st.calls.d12env=1;save()}_kur(m)};
