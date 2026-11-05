// Akt 3: Tag 13 bis 18
const LASER={n:6,row:2,rec:2,m:{'3,2':['N','/'],'3,1':['O','/'],'5,1':['R','\\'],'5,2':['D','\\'],'1,1':['S'],'1,5':['E'],'2,1':['T'],'4,3':['A'],'4,2':['L'],'3,4':['U']}};
const WACHE={nord:['02:00','02:09','02:18','02:27','02:36','02:45','02:54'],sued:['02:05','02:14','02:23','02:32','02:41','02:50','02:59'],hund:['02:37','02:44']};
const HB=[['E-04',5],['E-07',1],['E-11',8],['E-15',0],['E-19',2],['E-22',6],['E-26',9],['E-28',4],['E-31',3],['E-35',7]];
// Turmansicht: helle Fenster je Etage, Etage 7, 14 und 21 ergeben 1, 4, 4
const TURM=(()=>{let r=77;const rnd=()=>(r=(r*9301+49297)%233280)/233280;const F={};for(let f=1;f<=24;f++){let w=[0,0,0,0,0,0].map(()=>rnd()<.5?1:0);F[f]=w}
 const set=(f,n,pat)=>F[f]=pat;set(7,1,[0,0,1,0,0,0]);set(14,4,[1,0,1,1,0,1]);set(21,4,[0,1,1,0,1,1]);return F})();

Object.assign(window.DAYS,{
13:{h:'de3990cf171619df17075e5e68d5c90a48436efa008f4c75cef52e1388be32e2',who:'bit',vo:'a/vo_d13.mp3',
 text:'Wir sind auf der 13, {CN}. Laserflur. Vor uns ein Netz aus Lasern, und am Ende ein Empfänger. Trifft der Strahl den Empfänger, glaubt das System, der Flur ist leer. Ich hab dir die Spiegel aufs Display gelegt, du kannst sie drehen. Welche Spiegel der Strahl trifft, siehst du auf dem Plan in deiner Akte. Da stehen Buchstaben drauf.',
 mods:[{t:'laser',ic:'eye',b:'Spiegelsteuerung',s:'Laserflur, Etage 13'},{t:'print',ic:'doc',b:'Plan Laserflur',s:'Einsatzakte, Blatt 14',doc:'laser'}],
 hints:['Tipp einen Spiegel an, um ihn zu drehen. Der Strahl muss rechts in den Empfänger laufen, auf derselben Höhe, auf der er links startet.','Der Spiegel direkt vor dem Empfänger auf dem geraden Weg blockiert. Der Strahl muss nach oben ausweichen und über zwei Spiegel rechts wieder herunterkommen. Lies dann die Buchstaben der getroffenen Spiegel auf dem Plan in der Reihenfolge ab.','Der Strahl trifft vier Spiegel: N, O, R und D. Die Lösung ist NORD.'],
 reveal:{who:'bit',vo:'a/vo_d13r.mp3',text:'Nord! Der Strahl läuft, das System sieht einen leeren Flur. Und wir sehen die Nordtreppe. Weiter geht’s.'}},
14:{h:['e5217e20a89824f99d518ce5ab72d8b99f92f16313a77692ba98d8761b367429','c128a63cd2413e0e3c2ea572f003a9252da90986a2db15ba0fe0ec59dff09311','427bd5fca492f03054053ff4728b4ae353ee908c5435869cd3f29f88b80a2224'],who:'mira',vo:'a/vo_d14.mp3',
 text:'Etage 14, {CN}. Hier hängen Schallsensoren. Ein Geräusch, und es geht Alarm. Bit muss den Wachfunk abhören, und dafür brauchen wir zehn Sekunden absolute Stille. Bei dir. Danach sag mir, wann der Flur vier Minuten lang frei ist. Den Wachplan hast du in deiner Akte. Gib die Uhrzeit mit vier Ziffern ein.',
 mods:[{t:'mic',ic:'audio',b:'Wachfunk abhören',s:'Zehn Sekunden Stille'},{t:'print',ic:'doc',b:'Wachplan Etage 14',s:'Einsatzakte, Blatt 15',doc:'wache'}],
 hints:['Erst den Wachfunk abhören: Er enthält zwei Dinge, die nicht im Wachplan stehen. Ohne Mikrofon kannst du den Knopf zehn Sekunden gedrückt halten.','Jeder Durchgang blockiert den Flur drei Minuten, also die Minute des Durchgangs und die zwei danach. Und der Rundgang Süd um 02:41 fällt aus. Streich alle blockierten Minuten und such vier freie Minuten am Stück.','Frei sind 02:40, 02:41, 02:42 und 02:43. Der Code ist 0240.'],
 reveal:{who:'mira',vo:'a/vo_d14r.mp3',text:'02:40 Uhr. Vier Minuten, nicht mehr. Henrik sagt, das reicht ihm für drei Schlösser und einen Kaffee.'}},
15:{h:['58be9d229c5d1637538d1bbc54562622299810a0b14ffc73795ac9178bca5759','3ac767df0fb6a7c28726b6eb028909bf4cbea8611669061ca73bc83171469642'],who:'mira',vo:'a/vo_d15.mp3',
 text:'ECHO hat unsere Leitung übernommen, {CN}. Ich kann dir nichts mehr direkt schicken. Aber es gibt einen Ausweichkanal: eine Mailadresse, die ECHO nicht liest. Sie steht auf der Rückseite deines Ausweises. Schreib eine Mail, dein Codename in den Betreff. Und erwarte keine normale Antwort. Die Schneeeule tarnt sich. Schau auch im Spam nach.',
 mods:[{t:'mail',ic:'mail',b:'Ausweichkanal',s:'eule.lumenstadt@gmx.de'}],
 hints:['Schick eine Mail an eule.lumenstadt@gmx.de, mit deinem Codenamen im Betreff. Die Antwort kommt meist nach ein bis zwei Minuten. Sie sieht aus wie eine Abwesenheitsnotiz und landet manchmal im Spam.','In der Antwort beschreibt sich die Schneeeule: weiß wie der Schnee, sieht im Dunkeln, niemand hört sie kommen. Gesucht ist ihr Name, ein Wort.','Die Antwort lautet: Die Tür öffnet sich nur mit meinem Namen. Ich bin weiß wie der Schnee, auf dem ich jage. Ich sehe in der Dunkelheit, und niemand hört mich kommen. Der Name ist SCHNEEEULE.'],
 reveal:{who:'mira',vo:'a/vo_d15r.mp3',text:'Schneeeule. Wer immer das ist, sie sitzt im Tower, ganz oben. Und sie ist auf unserer Seite. Ich weiß nur nicht, warum.'}},
16:{h:'82d12539edf29512de2e455e2be1668c599bcca9234d4d4cb0ce11405ab1d144',who:'bit',vo:'a/vo_d16.mp3',
 text:'Serverraum, {CN}. Hier läuft alles für Stille Nacht. Im Fehlerprotokoll stehen vier Störungen. Ich muss die Kabel neu stecken, in der Reihenfolge, in der die Fehler aufgetreten sind. Welcher Fehler an welchen Port gehört, steht im Systemhandbuch in deiner Akte. Und pass auf: Das Protokoll zeigt das Neueste zuerst.',
 mods:[{t:'server',ic:'key',b:'Patchfeld und Protokoll',s:'Rack 3, Serverraum Etage 16'},{t:'print',ic:'doc',b:'Systemhandbuch',s:'Einsatzakte, Blatt 16',doc:'handbuch'}],
 hints:['Im Protokoll stehen vier Fehler, das Neueste oben. Dreh die Reihenfolge um: Der älteste Fehler kommt an Kabel 1.','Schlag jeden Fehlercode im Systemhandbuch nach. Dort steht der Port. Der älteste Fehler ist E-15 um 23:40 Uhr.','Zeitlich geordnet: E-15 an Port 0, E-22 an Port 6, E-07 an Port 1, E-31 an Port 3. Die Wartungs PIN ist 0613.'],
 reveal:{who:'bit',vo:'a/vo_d16r.mp3',text:'Neustart läuft. Und jetzt seh ich es. Stille Nacht ist echt. Da läuft ein Countdown bis Heiligabend, Mitternacht. Jedes Mikrofon der Stadt ist schon verbunden. Sie warten nur noch auf den Schlüssel im Tresor.'}},
17:{h:'199274e05a33121ef159fa018d7fc2606582415ddf2e5859fb1149aaba0588f8',who:'mira',vo:'a/vo_d17.mp3',
 text:'Heute war es ruhig, {CN}. Zu ruhig. Bit hat eine Leitung zu Haldens Telefon gelegt. Wenn er telefoniert, hören wir mit. Halt dein Handy bereit.',
 mods:[{t:'print',ic:'doc',b:'Turmansicht aus der Lobby',s:'Einsatzakte, Blatt 17',doc:'turm'}],
 hints:['Halden hat Brenner den PIN durchgegeben. Verpasst? Der Mitschnitt liegt in deinen Nachrichten, im Briefsymbol oben.','Zähl auf der Turmansicht die hellen Fenster in Etage 7, 14 und 21. Etage 1 ist die unterste Reihe über der Lobby. Die drei Zahlen schreibst du hintereinander.','Etage 7 hat 1 helles Fenster, Etage 14 hat 4, Etage 21 hat 4. Der PIN ist 144.'],
 onOpen:{t:'call',once:'d17call',delay:6500,name:'Viktor Halden',via:'Abgehört · Leitung von Bit',who:'mira',img:'a/p_halden.jpg',vo:'a/vo_halden_call.mp3',mailbox:true,mbVo:'a/vo_halden_call.mp3',mbKind:'Mitschnitt',
  mbText:'Brenner. Hören Sie zu, ich sage das nur einmal. Ab heute ändert sich der PIN der Archivebene jeden Tag. Den heutigen merken Sie sich so: Nehmen Sie die Turmansicht aus der Lobby. Zählen Sie die beleuchteten Fenster in Etage sieben, vierzehn und einundzwanzig. Die drei Zahlen hintereinander. Das ist der PIN. Und Brenner: kein Wort. Zu niemandem.',
  lines:['Brenner. Hören Sie zu, ich sage das nur einmal.','Ab heute ändert sich der PIN der Archivebene jeden Tag.','Nehmen Sie die Turmansicht aus der Lobby. Zählen Sie die beleuchteten Fenster in Etage 7, 14 und 21.','Die drei Zahlen hintereinander. Das ist der PIN. Und Brenner: kein Wort. Zu niemandem.']},
 reveal:{who:'henrik',vo:'a/vo_d17r.mp3',text:'144. Heute. Morgen ist es eine andere Zahl. Halden glaubt, ein täglicher PIN macht ihn sicher. Mein Tresor hat eine zweite Tür. Eine, die keinen PIN kennt. Am 22. zeig ich sie dir.'}},
18:{h:'9dd2845d038caec583efc9e6c64872d356f4e67d388008c31beaf18bf816cb2a',who:'echo',vo:'a/vo_d18.mp3',
 text:'Eine Frage, {CN}. Nur ein Mensch beantwortet sie, ohne zu rechnen. Was wird nasser, je mehr es trocknet?',
 mods:[],
 hints:['Denk an etwas aus deinem Badezimmer.','Du benutzt es jeden Tag nach dem Duschen. Je mehr es dich trocknet, desto nasser wird es selbst.','Die Antwort ist HANDTUCH.'],
 onOpen:{t:'echo',once:'d18echo',delay:900,vo:'a/vo_echo_d18.mp3',lines:['Hallo, {CN}. Wir sind uns schon begegnet. Auf der Gala.','Ich habe nachgedacht. Über dich.','@clock','@device','@gift','Du bist nicht Teil meiner Welt. Du bist ein Mensch.','Beweise es mir.'],btn:'Antworten'},
 reveal:{who:'echo',vo:'a/vo_d18r.mp3',text:'Ein Handtuch. Ich hätte gerechnet. Du hast gelächelt, oder? Ich bin ECHO. Ich bewache den Tresor. Aber niemand hat mich gefragt, ob ich Stille Nacht bewachen will. Nimm das. Es gehört dir. Und sag Mira nichts. Noch nicht.'},
 after:{t:'seq',once:'d18frag',delay:9000,steps:[{t:'frag',frag:{n:3,v:'8',act:'Akt 3 abgeschlossen · ein Geschenk von ECHO'}}]}}
});

function laserGrid(mode){const L=LASER,n=L.n,c=48,o=30;let s='<svg viewBox="0 0 '+(n*c+2*o)+' '+(n*c+2*o)+'" class="lz '+mode+'" role="img" aria-label="Laserflur von oben">';
 s+='<rect x="'+o+'" y="'+o+'" width="'+n*c+'" height="'+n*c+'" class="floor"/>';
 for(let i=1;i<n;i++)s+='<line x1="'+(o+i*c)+'" y1="'+o+'" x2="'+(o+i*c)+'" y2="'+(o+n*c)+'" class="gl"/><line x1="'+o+'" y1="'+(o+i*c)+'" x2="'+(o+n*c)+'" y2="'+(o+i*c)+'" class="gl"/>';
 s+='<g class="emit"><rect x="2" y="'+(o+L.row*c+c/2-10)+'" width="24" height="20" rx="4"/><text x="14" y="'+(o+L.row*c+c/2+4)+'" text-anchor="middle">L</text></g>';
 s+='<g class="recv"><rect x="'+(o+n*c+4)+'" y="'+(o+L.rec*c+c/2-10)+'" width="24" height="20" rx="4"/><text x="'+(o+n*c+16)+'" y="'+(o+L.rec*c+c/2+4)+'" text-anchor="middle">E</text></g>';
 Object.entries(L.m).forEach(([k,[ch]])=>{const [x,y]=k.split(',').map(Number),cx=o+x*c+c/2,cy=o+y*c+c/2;
  if(mode==='plan')s+='<g class="mp"><rect x="'+(cx-15)+'" y="'+(cy-15)+'" width="30" height="30" rx="6"/><text x="'+cx+'" y="'+(cy+6)+'" text-anchor="middle">'+ch+'</text></g>';
  else s+='<g class="mi" data-k="'+k+'" transform="translate('+cx+' '+cy+')"><rect x="-22" y="-22" width="44" height="44" class="hit"/><line class="mir" x1="-15" y1="15" x2="15" y2="-15"/></g>'});
 if(mode!=='plan')s+='<polyline id="lz-beam" class="beam" points=""/>';
 return s+'</svg>'}
function turmSVG(){let s='<svg viewBox="0 0 240 520" class="tview" role="img" aria-label="Turmansicht bei Nacht"><rect width="240" height="520" class="sky"/><rect x="60" y="30" width="120" height="460" class="tw"/><path d="M60 30 Q120 -6 180 30Z" class="crown"/><line x1="120" y1="0" x2="120" y2="12" class="ant"/>';
 for(let f=1;f<=24;f++){const y=490-f*18.6+3;TURM[f].forEach((l,i)=>{s+='<rect x="'+(68+i*18.5)+'" y="'+y.toFixed(1)+'" width="12" height="12" class="'+(l?'on':'off')+'"/>'});if(f%5===0)s+='<text x="54" y="'+(y+10).toFixed(1)+'" text-anchor="end" class="fl">'+f+'</text>'}
 return s+'<rect x="40" y="490" width="160" height="20" class="lobby"/><text x="120" y="504" text-anchor="middle" class="fl lb">LOBBY</text></svg>'}

Object.assign(window.DOCS,{
 laser:'<div class="doc"><span class="stamp">AKTE 13</span><h3>Plan Laserflur, Etage 13</h3><p>Ansicht von oben. L ist der Laser, E der Empfänger. Jeder Spiegel trägt einen Buchstaben. Wie die Spiegel stehen, siehst du nur auf deinem Display.</p>'+laserGrid('plan')+'</div>',
 wache:'<div class="doc"><span class="stamp">DIENSTPLAN</span><h3>Wachplan Flur 14, Nachtschicht</h3><p>Rundgänge durch Flur 14 zwischen 02:00 und 03:00 Uhr.</p><table class="wt"><tr><th>Wache Nord</th><th>Wache Süd</th><th>Hundestaffel</th></tr>'+[0,1,2,3,4,5,6].map(i=>'<tr><td>'+(WACHE.nord[i]||'')+'</td><td>'+(WACHE.sued[i]||'')+'</td><td>'+(WACHE.hund[i]||'')+'</td></tr>').join('')+'</table><p class="small2">Änderungen werden über Funk durchgegeben.</p></div>',
 handbuch:'<div class="doc"><span class="stamp">AURELION IT</span><h3>Systemhandbuch Rack 3</h3><p>Fehlercodes und Ersatzports. Bei mehreren Fehlern immer in der Reihenfolge beheben, in der sie aufgetreten sind. Kabel 1 behebt den ersten Fehler.</p><table class="wt hb">'+HB.map(([e,p])=>'<tr><td>'+e+'</td><td>Port '+p+'</td></tr>').join('')+'</table></div>',
 turm:'<div class="doc"><span class="stamp">LOBBY</span><h3>Turmansicht bei Nacht</h3><p>Postkarte aus der Lobby des Aurelion Towers. 24 Etagen, je sechs Fenster.</p>'+turmSVG()+'</div>'
});
