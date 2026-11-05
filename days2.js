// Akt 1 Ende und Akt 2 Anfang: Tag 4 bis 8
Object.assign(window.DAYS,{
4:{h:'4c2135331ac5dbed21c928866655ce537a23b261c78e5b2abad9f9dc49ee8386',who:'mira',vo:'a/vo_d4.mp3',
 text:'Gute Arbeit gestern, {CN}. Heute planen wir den Weg zum Tower. Unser Versteck liegt am Nordbahnhof, und Lumenstadt hat an jeder Station Kameras. Bit hat dir das Kameranetz live auf den Bildschirm gelegt, die Namen der Stationen stehen auf deinem Stadtplan. Finde die Strecke zum Turmplatz, auf der uns die wenigsten Kameras sehen. Eine Station vor dem Turmplatz steigen wir aus. Dort treffen wir uns.',
 mods:[{t:'net',ic:'map',b:'Kameranetz live',s:'Aurelion Überwachung, angezapft von Bit'},{t:'print',ic:'doc',b:'Stadtplan Lumenstadt',s:'Einsatzakte, Blatt 5',doc:'plan'}],
 hints:['Jede Station, durch die ihr fahrt, zählt mit all ihren Kameras. Der Nordbahnhof und der Turmplatz zählen nicht mit. Rechne für jede Strecke zusammen.','Drei Strecken kommen mit wenig Kameras aus: über Sternwarte und Neue Mitte, über Sternwarte, Lichtwerk und Uferpark, und über Altstadt, Kaiserbrücke und Glashafen. Zähl genau.','Altstadt 4, Kaiserbrücke 2 und Glashafen 1 ergeben 7 Kameras. Die beiden anderen Strecken haben je 8. Die letzte Station vor dem Turmplatz ist der GLASHAFEN.'],
 reveal:{who:'mira',vo:'a/vo_d4r.mp3',text:'Glashafen. Der alte Hafen, kaum Kameras, viel Nebel. Perfekt. Dort wartet morgen jemand auf dich, den ich seit Jahren nicht gesehen habe. Er mag keine Handys. Sei also nett zu ihm.'}},
5:{h:'70b48e0ceb2aec308c49db0ff66ce8efd468a313f26f51d960316cfc0c2ac93f',who:'henrik',vo:'a/vo_d5.mp3',
 text:'Du bist also der Neue. Henrik. Mira sagt, man kann dir trauen. Ich trau keinem Gerät, also schreib ich nichts im Klartext. Meine Notiz liegt bei dir. Nimm die Scheibe. Verschieb um so viele Buchstaben, wie du Etagen unter dir hast. Dann reden wir weiter.',
 mods:[{t:'print',ic:'doc',b:'Henriks Notiz',s:'Einsatzakte, Blatt 6',doc:'notiz'},{t:'wheel',ic:'key',b:'Decoderscheibe',s:'Zum Drehen. Zum Ausschneiden: Einsatzakte, Blatt 23'}],
 hints:['Du stehst auf Etage 5. Unter dir liegen vier Etagen. Die Verschiebung ist also 4.','Stell die Scheibe auf 4: Außen steht der Klartext, innen der Geheimtext. Unter dem äußeren A steht dann innen das E. Such jeden Buchstaben der Notiz innen und lies außen ab. Aus Q wird M.','Die Notiz heißt: MEIN TRESOR HAT EINE SCHWACHSTELLE. MEHR SAGE ICH NUR PERSOENLICH. KENNWORT: SCHNEE. Die Lösung ist SCHNEE.'],
 reveal:{who:'henrik',vo:'a/vo_d5r.mp3',text:'Schnee. Gut. Du kannst zählen. Den Tresor im vierundzwanzigsten Stock hab ich gebaut, 1987, für eine Bank, die es nicht mehr gibt. Halden hat ihn gekauft und seine Elektronik drumherum gebaut. Aber das Herz ist noch meins. Und jedes Herz hat eine Schwachstelle.'}},
6:{h:'c6f5ce6a691ef68686f20ab7f7e92188b2d25ea59e228a1c0e3984dcc101c61e',who:'mira',vo:'a/vo_d6.mp3',egg:'boot',
 text:'Heute ist Nikolaus, {CN}, und heute kommt der Kontakt nicht über diesen Kanal. Jemand, den du kennst, arbeitet für uns. Heute Abend um sechs meldet er sich bei dir, auf deinem echten Handy. Lies genau, was er schreibt. Das Wort, das er meint, öffnet diese Etage.',
 mods:[{t:'contact',ic:'phone',b:'Kontaktmann',s:'Meldet sich heute ab 18 Uhr'},{t:'sky',ic:'eye',b:'Himmel über Lumenstadt',s:'Sternkarte, Dezember, 22 Uhr'}],
 hints:['Der Kontaktmann schreibt dir heute ab 18 Uhr auf dein echtes Handy. Kam nichts? Ab 18:20 Uhr findest du seine Nachricht auch unter Kontaktmann.','Die Nachricht lautet: Der Jäger steht am Winterhimmel. Drei Sterne bilden seinen Gürtel. Such auf der Sternkarte das Sternbild mit dem Gürtel.','Gemeint ist das Sternbild ORION, der Jäger mit den drei Gürtelsternen.'],
 reveal:{who:'mira',vo:'a/vo_d6r.mp3',text:'Orion. Der Jäger. Unser Kontaktmann hat Geschmack. Bleib in der Nähe, {CN}. Ich ruf dich gleich an, und diesmal mit Bild.'},
 after:{t:'call',video:true,delay:3500,once:'d6call',name:'Mira',who:'mira',img:'a/v_mira.jpg',vo:'a/vo_call_d6.mp3',mailbox:true,mbVo:'a/vo_mb_d6.mp3',
  mbText:'Mira hier. Du gehst nicht ran, auch gut. Sechs Etagen in sechs Tagen, das war der erste Akt. Ab morgen gehen wir auf die Gala. Das erste Fragment des Tresorcodes liegt jetzt in deiner Einsatzakte. Schreib es dir auf. Zeig es niemandem.',
  lines:['Da bist du ja. Sechs Etagen in sechs Tagen.','Henrik ist an Bord, wir kennen den Weg, und wir kennen Haldens Plan.','Das war der erste Akt. Ab morgen wird es ernst: Wir gehen auf die Gala.','Und weil du so gut warst, bekommst du jetzt das erste Fragment des Tresorcodes. Schreib es dir auf. Zeig es niemandem.'],
  frag:{n:1,v:'5',act:'Akt 1 abgeschlossen'}}},
7:{h:['a8057e288159b9550e2543a5c368571ed30902fe707ccd841d72837bb97f67d5','f93e5dc185f991a85da855782f1d3bf37d8e8d068f7eeb8b7bdce2d90321980c'],who:'mira',vo:'a/vo_d7.mp3',
 text:'Akt zwei, {CN}. Die Gala. Wir kommen nur mit der Zugangskarte von Lars Brenner rein, Haldens Sicherheitschef. Dafür muss Bit nah an ihn ran, und dafür müssen wir wissen, wo er sitzt. Auf dem Sitzplan in deiner Akte ist sein Platz geschwärzt. Aber Bit hat ein Telefonat von Haldens Assistentin abgefangen. Tisch und Platz, zwei Ziffern.',
 mods:[{t:'chat',ic:'audio',b:'Abgefangenes Telefonat',s:'Haldens Assistentin und die Eventplanerin'},{t:'print',ic:'doc',b:'Sitzplan Weihnachtsgala',s:'Einsatzakte, Blatt 8',doc:'sitz'}],
 hints:['Platz 1 liegt an jedem Tisch zur Bühne hin. Wer dort sitzt, hat die Bühne im Rücken. Mit Blick zur Bühne sitzt man nur auf Platz 3.','Streich nacheinander: alle Plätze außer Platz 3, die erste Reihe, die Tische direkt am Notausgang, Haldens Tisch und den Tisch seiner Schwester Clara. Übrig bleibt genau ein geschwärzter Platz.','Brenner sitzt an Tisch 7 auf Platz 3. Der Code ist 73.'],
 reveal:{who:'bit',vo:'a/vo_d7r.mp3',text:'Tisch sieben, Platz drei! Zweite Reihe, Blick auf die Bühne, Blick auf alles. Und zwei Meter daneben steht der Kellner, der ich sein werde. Fliege steht mir übrigens hervorragend.'}},
8:{h:'a3f54fac4efbb58afb840c91f5f3926aa28e11b6b7746bebb6327d80a4a7c663',who:'bit',vo:'a/vo_d8.mp3',
 text:'Okay, {CN}, ich brauch dich. Ich hatte Brenners Zugangskarte beim Probelauf drei Sekunden in der Hand. Mein Lesegerät hat sie angefunkt, aber das Signal wackelt. Halt dein Handy ganz ruhig, dann liest es die Karte aus. Was rauskommt, ist Hex. Die Tabelle dazu liegt in deiner Akte.',
 mods:[{t:'clone',ic:'key',b:'Karte auslesen',s:'Lesegerät Bit, Version 0.9'},{t:'print',ic:'doc',b:'Hextabelle',s:'Einsatzakte, Blatt 9',doc:'hex'}],
 hints:['Leg das Handy flach auf den Tisch oder halt es mit beiden Händen ganz ruhig, bis der Balken voll ist. Am Rechner hältst du den Knopf gedrückt, ohne die Maus zu bewegen.','Du bekommst vier Hexwerte. Such jeden in der Hextabelle deiner Akte und schreib den Buchstaben dazu.','48 ist H, 41 ist A, 4C ist L, 4F ist O. Das Wort ist HALO.'],
 reveal:{who:'bit',vo:'a/vo_d8r.mp3',text:'HALO! Das ist Brenners Sicherheitsstufe. Damit kommen wir auf jede Etage bis 23. Nur die 24 nicht. Die gehört Halden allein. Und genau da wollen wir hin.'}}
});

// Netz von Lumenstadt: gleiche Lage auf Plan und Live Karte
window.NET={
 st:{NORD:[50,40,'Nordbahnhof',0],STERN:[200,40,'Sternwarte',2],ALT:[50,140,'Altstadt',4],MARKT:[170,135,'Marktplatz',4],LICHT:[300,110,'Lichtwerk',3],KAISER:[70,240,'Kaiserbrücke',2],MITTE:[250,210,'Neue Mitte',6],GLAS:[150,300,'Glashafen',1],UFER:[320,230,'Uferpark',3],TURM:[260,310,'Turmplatz',0]},
 lines:[['#7fe7ff','U1',['NORD','ALT','KAISER','GLAS','TURM']],['#d9b46a','U2',['NORD','STERN','MITTE','TURM']],['#8b7bff','U3',['STERN','LICHT','UFER','TURM']],['#3cf2b5','U4',['ALT','MARKT','MITTE']],['#ff7aa8','U5',['KAISER','MARKT']]]
};
const NLAB={NORD:[-14,4,'end'],STERN:[0,-15,'middle'],ALT:[-14,4,'end'],MARKT:[0,-15,'middle'],LICHT:[-12,20,'end'],KAISER:[-14,4,'end'],MITTE:[-14,4,'end'],GLAS:[0,24,'middle'],UFER:[14,4,'start'],TURM:[14,5,'start']};
function netSVG(mode){const S=NET.st;let s='<svg viewBox="-50 0 450 350" class="net '+mode+'" role="img" aria-label="'+(mode==='plan'?'Stadtplan mit Linien und Stationen':'Live Karte der Kameras')+'">';
 s+='<path d="M-50 262 C40 250 110 335 200 335 S 330 292 400 300 L400 350 L-50 350Z" class="river"/>';
 if(mode==='plan')s+='<text x="20" y="338" class="rv">Lume</text>';
 NET.lines.forEach(([c,n,ids])=>{s+='<polyline points="'+ids.map(i=>S[i][0]+','+S[i][1]).join(' ')+'" stroke="'+c+'" class="ln"/>'});
 Object.entries(S).forEach(([k,[x,y,n,cam]])=>{
  const sp=k==='NORD'?' home':k==='TURM'?' tower':'';
  s+='<g class="stn'+sp+'"><circle cx="'+x+'" cy="'+y+'" r="9"/>';
  if(mode==='plan'){const [dx,dy,an]=NLAB[k];s+='<text x="'+(x+dx)+'" y="'+(y+dy)+'" text-anchor="'+an+'">'+n+'</text>'}
  else{if(k==='NORD')s+='<text x="'+(x-14)+'" y="'+(y+4)+'" text-anchor="end" class="tag">VERSTECK</text>';else if(k==='TURM')s+='<text x="'+(x+14)+'" y="'+(y+5)+'" class="tag">ZIEL</text>';
   for(let i=0;i<cam;i++){const row=Math.floor(i/3),col=i%3,nn=Math.min(3,cam-row*3),cx=x-((nn-1)*12)+col*24,cy=y-25-row*19;s+='<g class="cam" style="animation-delay:'+(i*.37+x/97).toFixed(2)+'s" transform="translate('+cx+' '+cy+') scale(1.85)"><rect x="-5" y="-3.5" width="8" height="7" rx="1.5"/><path d="M3 -2 L6.5 -4 L6.5 4 L3 2Z"/><circle cx="-1" cy="0" r="1.4" class="lens"/></g>'}}
  s+='</g>'});
 if(mode==='plan')s+='<g class="legend" transform="translate(345 262)">'+NET.lines.map(([c,n],i)=>'<g transform="translate(0 '+i*14+')"><line x1="0" y1="0" x2="18" y2="0" stroke="'+c+'"/><text x="24" y="4">'+n+'</text></g>').join('')+'</g>';
 return s+'</svg>'}

// Sitzplan Gala: Tische 1 bis 4 vorn, 5 bis 8 hinten. Platz 1 oben zur Bühne, 2 rechts, 3 unten, 4 links
window.SEATS={
 1:['Dr. Ines Lind','Paul Okoro','Mara Feld','Jan Vogt'],2:['Elke Brandt','Tom Reuter',null,'Lea Sommer'],3:['Kurt Hahn',null,'Nina Paulsen','Ole Kramer'],4:['Ruth Adler','Ben Yilmaz','Sara Kühn','Erik Moll'],
 5:['Viktor Halden','Fiona Halden',null,'Dr. Max Engel'],6:['Clara Brenner','Udo Lange',null,'Hanna Roth'],7:[null,'Iris Bauer',null,'Felix Ott'],8:['Gerd Wolf','Pia Scholz',null,'Lukas Pohl']};
function seatSVG(){let s='<svg viewBox="0 0 380 330" class="seat" role="img" aria-label="Sitzplan des Festsaals"><rect x="90" y="8" width="200" height="26" rx="4" class="stage"/><text x="190" y="26" text-anchor="middle" class="lb">BÜHNE</text>';
 s+='<rect x="4" y="120" width="18" height="120" rx="3" class="bar"/><text x="13" y="182" transform="rotate(-90 13 182)" text-anchor="middle" class="lb sm">BAR</text>';
 s+='<rect x="358" y="225" width="18" height="70" rx="3" class="exit"/><text x="367" y="260" transform="rotate(90 367 260)" text-anchor="middle" class="lb sm ex">NOTAUSGANG</text>';
 const pos=t=>[80+((t-1)%4)*74,(t<=4?105:235)];
 for(let t=1;t<=8;t++){const [x,y]=pos(t);s+='<circle cx="'+x+'" cy="'+y+'" r="20" class="tb"/><text x="'+x+'" y="'+(y+5)+'" text-anchor="middle" class="tn">'+t+'</text>';
  const off=[[0,-34],[36,0],[0,34],[-36,0]];
  SEATS[t].forEach((n,i)=>{const [dx,dy]=off[i],sx=x+dx,sy=y+dy;
   s+='<g class="st'+(n?'':' res')+'"><rect x="'+(sx-15)+'" y="'+(sy-10)+'" width="30" height="20" rx="4"/><text x="'+sx+'" y="'+(sy-1)+'" text-anchor="middle" class="pn">'+(i+1)+'</text>'+(n?'<text x="'+sx+'" y="'+(sy+7)+'" text-anchor="middle" class="nm">'+n.split(' ').slice(-1)[0]+'</text>':'<rect x="'+(sx-11)+'" y="'+(sy+2)+'" width="22" height="5" class="blk"/>')+'</g>'})}
 return s+'</svg>'}
function seatList(){return '<div class="seatlist">'+Object.entries(SEATS).map(([t,a])=>'<div><b>Tisch '+t+'</b>'+a.map((n,i)=>'<span>'+(i+1)+': '+(n?esc(n):'<i class="blk2">geschwärzt</i>')+'</span>').join('')+'</div>').join('')+'</div>'}

Object.assign(window.DOCS,{
 plan:'<div class="doc"><span class="stamp">AKTE 5</span><h3>Stadtplan Lumenstadt</h3><p>Schnellbahnnetz der Innenstadt. Die Crew startet am Nordbahnhof. Bit kontrolliert die Kameras am Turmplatz.</p>'+netSVG('plan')+'</div>',
 notiz:'<div class="doc note"><h3>Notiz H. S.</h3><p class="cipher">QIMR XVIWSV LEX IMRI WGLAEGLWXIPPI.<br>QILV WEKI MGL RYV TIVWSIRPMGL.<br>OIRRASVX: WGLRII</p><p class="hand">Innen Geheimtext, außen Klartext.<br>Kein Gerät, kein Klartext. H.</p></div>',
 sitz:'<div class="doc"><span class="stamp">VERTRAULICH</span><h3>Weihnachtsgala Aurelion Tower</h3><p>12. Dezember, Festsaal Etage 22. Sitzplan für 32 Gäste. An jedem Tisch liegt Platz 1 zur Bühne hin, dann im Uhrzeigersinn 2, 3 und 4. Geschwärzte Plätze sind auf Wunsch der Gäste vertraulich.</p>'+seatSVG()+seatList()+'</div>',
 hex:'<div class="doc"><span class="stamp">AKTE 8</span><h3>Hextabelle</h3><p>Lesegeräte geben Text als Hexwerte aus. Jeder Wert steht für einen Buchstaben.</p><div class="hexgrid">'+Array.from({length:26},(_,i)=>'<span><b>'+(65+i).toString(16).toUpperCase()+'</b>'+String.fromCharCode(65+i)+'</span>').join('')+'</div></div>'
});
