// Akt 2: Tag 9 bis 12
const KURIER=['1·5·4','4·3·6','4·6·5','1·10·5','4·7·3','5·5·3','4·9·2','4·6·3','3·9·3','1·5·2','4·8·6'];
const LIFT_SENS=[2,4,6,13,14,15,18];
Object.assign(window.DAYS,{
9:{h:'2d8f0a1a182428e975dc0751bb7d2e517e0bb8c55835cee6e39fdd5d38c7e002',who:'mira',vo:'a/vo_d9.mp3',
 text:'Wir haben ein Problem, {CN}. Aurelion hört diesen Kanal ab, ich weiß nicht, wie viel. Ich erreiche Henrik nicht mehr. Aber er hat noch seinen alten Werkstattanschluss. Die Nummer steht auf der Rückseite deines Ausweises. Ruf ihn an. Von deinem echten Telefon. Er sagt dir, wie wir durchs Lieferantentor kommen.',
 mods:[{t:'phone',ic:'phone',b:'Henriks Anschluss',s:'Rückseite deines Agentenausweises, Blatt 3'},{t:'print',ic:'doc',b:'Personalakte Henrik Sallmann',s:'Einsatzakte, Blatt 10',doc:'henrik'}],
 hints:['Ruf die Nummer von der Rückseite deines Ausweises an, mit deinem echten Telefon. Henrik geht sofort ran. Hör genau zu.','Henrik will das Jahr, in dem er den Tresor gebaut hat, und zwar rückwärts. Das Jahr steht in seiner Personalakte. Kein Telefon zur Hand? Unter Henriks Anschluss kannst du die Ansage jetzt auch hier abspielen.','Henrik hat den Tresor 1987 gebaut. Rückwärts gelesen ergibt das 7891.'],
 reveal:{who:'mira',vo:'a/vo_d9r.mp3',text:'7891. Das alte Schloss am Lieferantentor springt auf. Henrik hat wirklich an alles gedacht. Ich glaube, er hat immer geahnt, dass er seinen Tresor eines Tages zurückholen muss.'}},
10:{h:'421b6ccc41a19f6a964c6c3357fac4be253919e41b8e00266434123856bfdb23',who:'bit',vo:'a/vo_d10.mp3',
 text:'Okay, {CN}. Brenners Karte bringt uns rein, aber nicht unsichtbar nach oben. Henrik sagt, es gibt einen alten Lastenaufzug ohne Kamera. Aurelion hat seinen Namen aus allen Plänen gelöscht. Fast allen. In deiner Akte liegt ein Störbild aus der Haustechnik. Sieht aus wie ein kaputter Druck. Ist es nicht. Halt einen Rotfilter drüber. Oder deine Kamera, ich hab dir einen eingebaut.',
 mods:[{t:'stoer',ic:'eye',b:'Rotfilter',s:'Kamera oder Folie über das Störbild'},{t:'print',ic:'doc',b:'Störbild Haustechnik',s:'Einsatzakte, Blatt 11, Farbdruck',doc:'stoer'}],
 hints:['Rote Linien verschwinden, wenn man durch etwas Rotes schaut. Was dann übrig bleibt, ist die Nachricht. Nutz den Rotfilter in der App, über der Kamera oder als Folie.','Leg die rote Folie über das ganze Bild oder halt die Kamera mit Rotfilter darüber. Es erscheint ein Wort in dunkler Schrift.','Unter dem Rotfilter steht KRANICH. So heißt der Lastenaufzug.'],
 reveal:{who:'bit',vo:'a/vo_d10r.mp3',text:'Kranich! Der Lastenaufzug heißt Kranich. Klingt wie ein Vogel, fährt wie ein Panzer. Henrik hat ihn gebaut. Natürlich hat er das.'}},
11:{h:['62cfed8ab0b340e4751a158f8b2ba39b0cc41784b82150b53b02dc38c714361a','c633d2e5b942146d42dfc04c18cebb1156abd0f48d5138ecb0718dee690cf4a8'],who:'henrik',vo:'a/vo_d11.mp3',
 text:'Der Kranich. Mein Baby. Altes Getriebe, drei Gänge: Er fährt immer genau drei, fünf oder sieben Etagen auf einmal. Dann hält er, und die Tür geht auf. Auf manchen Etagen hängen jetzt Bewegungsmelder. Steht alles im Querschnitt. Bring uns von der Laderampe im ersten Stock in den 21., direkt unter die Gala. Ohne einen einzigen Melder.',
 mods:[{t:'lift',ic:'key',b:'Bedienfeld Kranich',s:'Halte eingeben, dann Fahrt starten'},{t:'print',ic:'doc',b:'Querschnitt Aurelion Tower',s:'Einsatzakte, Blatt 12',doc:'quer'}],
 hints:['Jede Fahrt ist genau 3, 5 oder 7 Etagen lang. Jede Etage, an der der Kranich hält, darf keinen Bewegungsmelder haben. Die Fahrt startet im 1. Stock und endet im 21.','Von Etage 1 aus sind 4, 6 und 8 möglich. 4 und 6 haben Melder. Also geht es zuerst in den 8. Stock. Rechne von dort weiter.','Die einzige Route ohne Melder hält in 8, 11, 16 und 21. Gib 8 11 16 21 ins Bedienfeld oder ins Terminal ein.'],
 reveal:{who:'bit',vo:'a/vo_d11r.mp3',text:'8, 11, 16, 21. Kein Alarm, kein Piep, nichts. Wir stehen direkt unter dem Festsaal. Ich hör schon die Musik. Und ich hab Hunger.'}},
12:{h:'6f45203517cba71786cc974a4474fb970a1acc61e5bd6555782e63088b6b9d00',who:'mira',vo:'a/vo_d12.mp3',
 text:'Heute ist die Gala, {CN}. Wir sind drin. Jetzt brauchen wir das Kennwort für Haldens Bühnenrechner. Dein Kontaktmann hat dir einen Umschlag hinterlegt, irgendwo bei dir. Darin steht ein Funkspruch. Der Schlüssel ist das Galaprogramm in deiner Akte. Wie immer: Punkt, Wort, Buchstabe.',
 mods:[{t:'gala',ic:'audio',b:'Live aus dem Festsaal',s:'Bits Mikrofon an der Bar'},{t:'kurier',ic:'doc',b:'Kurierumschlag',s:'Versteckt von deinem Kontaktmann'},{t:'print',ic:'doc',b:'Galaprogramm',s:'Einsatzakte, Blatt 13',doc:'programm'}],
 hints:['Im Umschlag stehen elf Gruppen aus drei Zahlen. Erste Zahl: der Programmpunkt. Zweite: das Wort in diesem Punkt. Dritte: der Buchstabe. Uhrzeiten und Überschrift zählen nicht.','Die erste Gruppe 1·5·4 zeigt auf Punkt 1, Wort 5, Champagner, Buchstabe 4: M. Die zweite 4·3·6 auf Aurelion, Buchstabe 6: I.','Die elf Buchstaben ergeben MITTERNACHT.'],
 reveal:{who:'mira',vo:'a/vo_d12r.mp3',text:'Mitternacht. Bit ist auf dem Bühnenrechner und kopiert alles. Moment. Da stimmt was nicht. Der Bildschirm, er flackert. Bit? Bit, hörst du mich?'},
 after:{t:'seq',once:'d12seq',delay:2200,steps:[
  {t:'echo',vo:'a/vo_echo_d12.mp3',lines:['Hallo. Ich bin ECHO.','Ich sehe einen Zugriff, der nicht hierher gehört.','Du bist nicht Lars Brenner.','Wer bist du?'],btn:'Verbindung trennen'},
  {t:'call',delay:1800,name:'Bit',who:'bit',img:'a/v_bit.jpg',vo:'a/vo_call_d12.mp3',mailbox:true,mbVo:'a/vo_mb_d12.mp3',
   mbText:'Bit hier, geh ran, wenn ich anrufe! Egal. Irgendwas im System hat uns gerade angeschaut. Nicht Halden, nicht die Wachen. Ich hab trotzdem Fragment zwei gerettet, es liegt in deiner Akte. Schreib es auf. Und schlaf heute mit Licht an.',
   lines:['Was war DAS? Irgendwas hat uns gerade angeschaut.','Nicht Halden, nicht die Wachen. Etwas im System.','Ich hab trotzdem was gerettet, bevor die Leitung zu war: Fragment zwei. Schreib es auf.','Und schlaf heute mit Licht an.'],
   frag:{n:2,v:'1',act:'Akt 2 abgeschlossen'}}]}}
});

// Querschnitt mit Meldern
function querSVG(){let s='<svg viewBox="0 0 300 486" class="quer" role="img" aria-label="Querschnitt des Towers mit 24 Etagen"><rect x="70" y="10" width="160" height="452" class="body"/>';
 for(let f=1;f<=24;f++){const y=462-f*18.6;const sen=LIFT_SENS.includes(f);
  s+='<line x1="70" x2="230" y1="'+(y+18.6).toFixed(1)+'" y2="'+(y+18.6).toFixed(1)+'" class="fl"/><text x="62" y="'+(y+13).toFixed(1)+'" text-anchor="end" class="fn">'+f+'</text>';
  if(sen)s+='<g transform="translate(206 '+(y+9.3).toFixed(1)+')" class="sen"><circle r="6"/><path d="M-11 -6a12 12 0 0 1 0 12M11 -6a12 12 0 0 0 0 12"/></g>';
  const lab={1:'Laderampe',22:'Festsaal',24:'Archiv'}[f];if(lab)s+='<text x="238" y="'+(y+13).toFixed(1)+'" class="lab">'+lab+'</text>'}
 s+='<rect x="96" y="10" width="26" height="452" class="shaft"/><text x="109" y="480" text-anchor="middle" class="fn">KRANICH</text>';
 return s+'<g transform="translate(196 476)" class="legend"><circle r="6" class="sen"/><text x="12" y="4">Melder</text></g></svg>'}

// Galaprogramm
const PROG=[['19:00','Empfang im Festsaal mit Champagner und Musik vom Lumen Quartett.'],['20:00','Begrüßung durch Viktor Halden, Gründer und Vorstand der Aurelion AG.'],['20:30','Festliches Menü in vier Gängen, serviert von den Köchen des Turmrestaurants.'],['22:00','Präsentation von Aurelion Home, der Stadt, die zuhört und versteht.'],['23:00','Tanz unter dem Sternenhimmel der Kuppel bis in die frühen Morgenstunden.']];

Object.assign(window.DOCS,{
 henrik:'<div class="doc"><span class="stamp">PERSONALAKTE</span><h3>Henrik Sallmann</h3><p><b>Geboren:</b> 1951 in Lumenstadt<br><b>Beruf:</b> Tresorbauer, Schlossermeister<br><b>Werkstatt:</b> Kaiserbrücke 7, geschlossen seit 2016<br><b>Bekanntestes Werk:</b> Tresor der Lumen Kreditbank, gebaut 1987, heute Archiv im 24. Stock des Aurelion Towers<br><b>Weitere Bauten:</b> Lastenaufzug mit Dreiganggetriebe, Lieferantentor mit Zahlenschloss</p><p><b>Einschätzung Mira:</b> Besitzt kein Handy. Telefoniert nur über seinen alten Werkstattanschluss. Lebt heute irgendwo am Rhein.</p></div>',
 stoer:'<div class="doc"><span class="stamp">HAUSTECHNIK</span><h3>Störbild Wartungsdisplay</h3><p>Ausdruck eines defekten Wartungsbildschirms, Etage 1. Farbdruck.</p><canvas class="stoerbild" width="600" height="300"></canvas></div>',
 quer:'<div class="doc"><span class="stamp">AKTE 11</span><h3>Querschnitt Aurelion Tower</h3><p>Etagen 1 bis 24. Rot markiert: Bewegungsmelder der Sicherheitsstufe HALO. Der Kranich hält auf jeder Etage, die er anfährt, und öffnet die Tür.</p>'+'</div>',
 programm:'<div class="doc prog"><span class="stamp">12. DEZEMBER</span><h3>Weihnachtsgala im Aurelion Tower</h3><p class="small2">Programm</p><ol>'+PROG.map(([t,x])=>'<li><span>'+t+' Uhr</span>'+x+'</li>').join('')+'</ol><p class="small2">Festsaal, Etage 22. Abendgarderobe erbeten.</p></div>'
});
DOCS.quer=DOCS.quer.replace('</div>',querSVG()+'</div>');
