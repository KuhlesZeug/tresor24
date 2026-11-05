// Komplizenseite für den Schenkenden: Geschenklink, Nachricht im Tresor, drei Aufträge
(function(){
const sec=el('section','screen','');sec.id='s-komp';document.body.insertBefore(sec,$('#viewer'));
const xmasYear=()=>{const d=new Date();return d.getMonth()===0?d.getFullYear()-1:d.getFullYear()};
const KMSG='Mira lässt ausrichten: Der Jäger steht am Winterhimmel. Drei Sterne bilden seinen Gürtel. Sein Name öffnet Etage 6.';

window.openKomplize=function(){music(null);
 sec.innerHTML='<header class="top"><div><div class="kick">Nur für dich, nicht für den Beschenkten</div><div class="title">Komplizenseite</div></div><div class="topbtns"></div></header><div class="kp">'+
 '<div class="kp-hero"><div class="kp-k">TRESOR 24</div><h2>Du bist der Kontaktmann</h2><p>Du verschenkst eine Mission. Hier richtest du sie ein: Wer sie bekommt, welcher Codename, deine Nachricht im Tresor und wo das echte Geschenk versteckt ist. Danach bekommst du deinen Geschenklink und drei kleine Aufträge.</p><p class="kp-warn">Zeig diese Seite niemandem. Sie verrät ein paar Überraschungen.</p></div>'+
 '<div class="kp-card"><h3>1 · Die Mission einrichten</h3>'+
  '<label>Zugangscode aus deiner Bestellung</label><input id="kp-code" autocapitalize="characters" autocomplete="off" placeholder="Zugangscode">'+
  '<label>Für wen ist die Mission?</label><input id="kp-an" maxlength="40" placeholder="Vorname, zum Beispiel Jonas">'+
  '<label>Von wem? So nennt dich ECHO an Tag 18</label><input id="kp-von" maxlength="40" placeholder="Dein Vorname oder Spitzname">'+
  '<label>Codename</label><select id="kp-cn"><option value="">Selbst wählen lassen</option>'+CODENAMES.map(c=>'<option>'+c+'</option>').join('')+'</select>'+
  '<label>Deine Nachricht im Tresor <span id="kp-mc">0/600</span></label><textarea id="kp-msg" maxlength="600" rows="6" placeholder="Was der Agent liest, wenn sich am 24. der Tresor öffnet."></textarea>'+
  '<label>Wo liegt das echte Geschenk?</label><input id="kp-ort" maxlength="160" placeholder="Zum Beispiel: Schau hinter die Bücher im Wohnzimmerregal.">'+
  '<label>Wo bist du im Dezember?</label><div class="kp-seg"><button data-v="0" class="on">In der Nähe</button><button data-v="1">Weit weg</button></div>'+
  '<button class="btn big" id="kp-go" style="width:100%;margin-top:14px">Geschenklink erstellen</button><p class="small" id="kp-err"></p></div>'+
 '<div id="kp-out"></div></div>';
 show('#s-komp');let fern=0;
 $$('.kp-seg button').forEach(b=>b.onclick=()=>{$$('.kp-seg button').forEach(x=>x.classList.toggle('on',x===b));fern=+b.dataset.v});
 $('#kp-msg').oninput=()=>$('#kp-mc').textContent=$('#kp-msg').value.length+'/600';
 $('#kp-go').onclick=async()=>{const err=$('#kp-err');err.textContent='';
  if(await TZ.hash($('#kp-code').value)!==TZ.ACCESS){sfx('bad');return err.textContent='Dieser Zugangscode stimmt nicht. Er steht in deiner Bestellung.'}
  const an=$('#kp-an').value.trim(),von=$('#kp-von').value.trim();if(!an||!von)return err.textContent='Bitte beide Namen eintragen.';
  const o={an,von,cn:$('#kp-cn').value||'',msg:$('#kp-msg').value.trim(),ort:$('#kp-ort').value.trim(),fern};
  const base=location.href.split('#')[0].split('?')[0];const g=await TZ.pack(o);const link=base+'#g='+g;
  sfx('ok');renderOut(o,link,g)}};

function renderOut(o,link,g){const y=xmasYear();
 const out=$('#kp-out');out.innerHTML='<div class="kp-card ok"><h3>2 · Dein Geschenklink</h3><p>Diesen Link bekommt '+esc(o.an)+'. Am besten zusammen mit der gedruckten Einsatzakte, zum Beispiel in einem Umschlag am 30. November.</p><div class="kp-link" id="kp-l">'+esc(link)+'</div><div class="kp-row"><button class="btn" id="kp-cp">Link kopieren</button>'+(navigator.share?'<button class="btn ghost" id="kp-sh">Teilen</button>':'')+'</div><p class="small">Mit dem Link startet die App ohne Zugangscode, mit dem Namen '+esc(o.an)+(o.cn?' und dem Codenamen '+esc(o.cn):'')+'. Deine Nachricht bleibt bis zum 24. verschlossen.</p></div>'+
 '<div class="kp-card"><h3>3 · Deine drei Aufträge</h3>'+
  '<div class="kp-job"><b>6. Dezember, 18 Uhr</b><p>Schick '+esc(o.an)+' diese Nachricht per WhatsApp oder SMS. Kein Kommentar, kein Smiley. Du bist der Kontaktmann.</p><div class="kp-q" id="kp-m6">'+esc(KMSG)+'</div><button class="btn ghost" id="kp-c6">Text kopieren</button></div>'+
  '<div class="kp-job"><b>Bis 12. Dezember, morgens</b><p>'+(o.fern?'Du bist weit weg, deshalb kommt der Kurierumschlag digital. Du musst nichts tun.':'Druck den Kurierumschlag aus, falte ihn und versteck ihn dort, wo '+esc(o.an)+' am 12. sicher vorbeikommt. Zum Beispiel in der Jackentasche, im Schuh oder unter der Kaffeetasse.')+'</p>'+(o.fern?'':'<button class="btn ghost" id="kp-pr">Kurierumschlag drucken</button>')+'</div>'+
  '<div class="kp-job"><b>24. Dezember, vor 18 Uhr</b><p>Versteck das echte Geschenk dort, wo du es angegeben hast:</p><div class="kp-q">'+esc(o.ort||'Noch kein Versteck angegeben')+'</div><p>Am Abend öffnet '+esc(o.an)+' den Tresor und liest deine Nachricht.</p></div>'+
  '<a class="btn big" id="kp-ics" style="display:block;text-decoration:none;text-align:center;margin-top:8px">Alle drei Aufträge in meinen Kalender</a></div>'+
 '<div class="kp-card"><h3>Für den Notfall</h3><p>Hängt '+esc(o.an)+' fest? Jede Etage hat drei Hinweise, der letzte verrät die Lösung. Du musst nichts verraten.</p><details><summary>Lösungen aller 24 Tage anzeigen</summary><ol class="kp-sol">'+['AURORA','KAISER2009','GALA','GLASHAFEN','SCHNEE','ORION','73','HALO','7891','KRANICH','8 11 16 21','MITTERNACHT','NORD','0240','SCHNEEEULE','0613','144','HANDTUCH','LEUCHTTURM','NEUSTART','3750','12 36 7','LICHT','5183'].map(x=>'<li>'+x+'</li>').join('')+'</ol></details></div>';
 $('#kp-cp').onclick=()=>copy(link,'Link kopiert');const sh=$('#kp-sh');if(sh)sh.onclick=()=>navigator.share({title:'Tresor 24',text:'Agent '+o.an+', deine Mission wartet.',url:link}).catch(()=>{});
 $('#kp-c6').onclick=()=>copy(KMSG,'Text kopiert');const pr=$('#kp-pr');if(pr)pr.onclick=()=>printEnvelope(o);
 const ev=(d,h,m,t,desc)=>['BEGIN:VEVENT','UID:tresor24-'+d+'-'+Math.random().toString(36).slice(2)+'@kuhleszeug','DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').slice(0,15)+'Z','DTSTART;TZID=Europe/Berlin:'+y+'12'+d+'T'+h+m+'00','DTEND;TZID=Europe/Berlin:'+y+'12'+d+'T'+h+String(+m+15).padStart(2,'0')+'00','SUMMARY:'+t,'DESCRIPTION:'+desc.replace(/\n/g,'\\n').replace(/,/g,'\\,'),'BEGIN:VALARM','TRIGGER:-PT15M','ACTION:DISPLAY','DESCRIPTION:'+t,'END:VALARM','END:VEVENT'];
 const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//KuhlesZeug//Tresor 24 Komplize//DE',...ev('06','18','00','Tresor 24: Nachricht an '+o.an,'Schick jetzt diese Nachricht: '+KMSG),...ev('11','20','00','Tresor 24: Kurierumschlag verstecken',o.fern?'Du bist weit weg, nichts zu tun.':'Umschlag dort verstecken, wo '+o.an+' am 12. vorbeikommt.'),...ev('24','16','00','Tresor 24: Geschenk verstecken','Versteck: '+(o.ort||'')),'END:VCALENDAR'].join('\r\n');
 const a=$('#kp-ics');a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));a.download='Tresor24_Auftraege.ics';
 out.scrollIntoView({behavior:'smooth'})}
function copy(t,msg){(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast(msg)).catch(()=>{const ta=el('textarea','',t);document.body.appendChild(ta);ta.select();try{document.execCommand('copy');toast(msg)}catch(e){}ta.remove()})}
function printEnvelope(o){let p=$('#print-area');if(!p){p=el('div','','');p.id='print-area';document.body.appendChild(p)}
 p.innerHTML='<div class="pe"><div class="pe-k">KURIER · PERSÖNLICH</div><div class="pe-to">An Agent '+esc(o.cn||o.an)+'</div><div class="pe-g">'+KURIER.map(x=>'<span>'+x+'</span>').join('')+'</div><div class="pe-f">Schlüssel: Galaprogramm. Punkt · Wort · Buchstabe. Uhrzeiten zählen nicht.</div><div class="pe-s">Erst am 12. Dezember öffnen.</div></div><p class="pe-h">Entlang der Linie ausschneiden, zweimal falten. Versiegeln mit einem Aufkleber oder etwas Kerzenwachs.</p>';
 window.print()}

// Aufruf über #komplize, im Testmenü als Eintrag
if(location.hash.startsWith('#komplize'))setTimeout(()=>openKomplize(),300);
document.addEventListener('screen',e=>{const pan=$('#dm-pan');if(pan&&!$('#dm-komp')){const b=el('button','demo-it','<b>Komplizenseite</b><span>So richtet der Schenkende die Mission ein und bekommt den Geschenklink.</span>');b.id='dm-komp';b.onclick=()=>{pan.classList.remove('on');openKomplize()};pan.appendChild(b)}});
})();
