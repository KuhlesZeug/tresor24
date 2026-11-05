// Inhalte. Codes nur als Hash. Stand: Prototyp mit Tag 1 bis 3
window.CREW={
 mira:{n:'Mira „Kompass“ Okafor',r:'Einsatzleitung NORDLICHT',img:'a/p_mira.jpg'},
 bit:{n:'Jonte „Bit“ Varga',r:'Technik und Hacking',img:'a/p_bit.jpg'},
 henrik:{n:'Henrik Sallmann',r:'Der Schlosser',img:'a/p_henrik.jpg'},
 echo:{n:'ECHO',r:'Tresorsystem Aurelion',img:'a/p_echo.jpg'}
};
window.CODENAMES=['FALKE','NOVA','PHANTOM','KOMET','WOLF','FUCHS','ORKAN','RABE','LUCHS','ADLER','VIPER','TITAN','BLITZ','SCHATTEN','JAGUAR','ZERO','KOBRA','NEBEL','POLARIS','FROST'];
window.FLOORS=['Rekrutierung','Zielperson','Funkspruch','Der Weg','Der Schlosser','Kontaktmann','Die Einladung','Zugangskarte','Henriks Anschluss','Störbild','Lastenaufzug','Die Gala','Laserflur','Schallsensoren','Ausweichkanal','Serverraum','Abgehört','ECHO','Leuchtturm','Absturz','Übergabe','Das Schloss','Countdown','Der Tresor'];
window.ACTS=[{f:1,t:'Akt 1 · Rekrutierung',m:'a/mus_akt1.mp3'},{f:7,t:'Akt 2 · Die Gala',m:'a/mus_akt2.mp3'},{f:13,t:'Akt 3 · Im Tower',m:'a/mus_akt3.mp3'},{f:19,t:'Akt 4 · Der Tresor',m:'a/mus_akt4.mp3'}];

window.INTRO={vo:'a/vo_intro.mp3',music:'a/mus_intro.mp3',slides:[
 {t:0,img:'a/f_city.jpg',card:'Lumenstadt'},
 {t:8.8,img:'a/f_haldenwin.jpg'},
 {t:12.8,img:'a/f_tower.jpg'},
 {t:20.7,img:'a/f_eye.jpg'},
 {t:24.7,img:'a/f_crew.jpg'},
 {t:27.2,img:'a/f_crew.jpg',card:'Tresor 24'}
],subs:[
 {t:0.2,x:'Lumenstadt. Die klügste Stadt Europas.'},
 {t:4.0,x:'Jede Laterne zählt deine Schritte. Jede Ampel kennt dein Gesicht.'},
 {t:8.8,x:'Und alles gehört einem Mann: Viktor Halden.'},
 {t:12.8,x:'An Heiligabend um Mitternacht startet sein Projekt Stille Nacht.'},
 {t:16.7,x:'Dann hört jedes Gerät der Stadt mit. Jedes.'},
 {t:20.7,x:'Den Schlüssel dazu bewacht ein Tresor im 24. Stock.'},
 {t:24.7,x:'Wir holen ihn uns.'},
 {t:26.2,x:'Und wir brauchen dich, {CN}.'}
],len:31};

window.DAYS={
1:{h:'3b5226c8a18141dea62f53d5829877a06f5c2b26a9bea1cde80b40b80d0019fe',who:'mira',vo:'a/vo_d1.mp3',
 text:'Willkommen bei NORDLICHT, {CN}. Ich bin Mira, ich leite diesen Einsatz. Ab jetzt gilt: Wir reden nur über diesen Kanal, und alles Wichtige liegt auf Papier. Papier kann ECHO nicht lesen. Wir haben dir einen Funkspruch geschickt, nur Zahlen. Den Schlüssel dazu hältst du schon in der Hand: deinen Einsatzbefehl. Finde das Wort und melde dich damit an.',
 mods:[{t:'funk',ic:'radio',b:'Funkspruch 01',s:'NORDLICHT · verschlüsselt',groups:['3·22·1','2·17·1','3·18·3','3·10·1','5·4·3','1·9·1']},{t:'print',ic:'doc',b:'Einsatzbefehl',s:'Einsatzakte, Blatt 1',doc:'befehl'}],
 hints:['Jede Gruppe hat drei Zahlen, und der Befehl hat fünf Absätze. Was könnte die erste Zahl zählen?','Erste Zahl: der Absatz. Zweite Zahl: das Wort in diesem Absatz. Dritte Zahl: der Buchstabe in diesem Wort. Überschrift und Unterschrift zählen nicht mit.','3·22·1 ist das 22. Wort im dritten Absatz, „an“, erster Buchstabe A. Insgesamt ergibt sich AURORA.'],
 reveal:{who:'mira',vo:'a/vo_d1r.mp3',text:'Angemeldet. Aurora, das Nordlicht. Unser Name. Willkommen in der Crew, {CN}. Ab jetzt läuft jeder Funkspruch so, also heb den Befehl gut auf. Morgen schauen wir uns den Mann an, dem diese Stadt gehört.'}},
2:{h:'ad048e5da45c8f651704251cf83afd3b6f0ca7816131f8281bcd813fcd5af79a',who:'mira',vo:'a/vo_d2.mp3',
 text:'Das ist Viktor Halden. Chef von Aurelion und Besitzer des Towers. Er postet alles, was er tut, auf Pulse. Bit hat seinen Zugang gefunden, aber die Cloud dahinter ist mit einer Sicherheitsfrage gesperrt. Halden ist eitel. Die Antwort steht irgendwo zwischen seinen Posts und deinem Zielprofil.',
 mods:[{t:'pulse',ic:'phone',b:'Pulse · @vhalden',s:'Haldens Profil durchsuchen'},{t:'print',ic:'doc',b:'Zielprofil Viktor Halden',s:'Einsatzakte, Blatt 2',doc:'ziel'}],
 hints:['Die Sicherheitsfrage will zwei Dinge: einen Namen und eine Jahreszahl. Scroll bei Pulse ganz nach unten.','Bruno ist Haldens jetziger Hund, nicht sein erster. Und 2016 ist das Jahr des Towers, nicht das Jahr, in dem alles anfing. Schau ins Zielprofil.','Sein erster Hund hieß Kaiser, Aurelion wurde 2009 gegründet. Das Passwort ist KAISER2009.'],
 reveal:{who:'mira',vo:'a/vo_d2r.mp3',text:'Wir sind drin. In Haldens Kalender steht nur ein einziger Termin im Dezember: 24.12., 0:00 Uhr, STILLE NACHT. Dreiundzwanzig Tage. Bit sucht nach mehr. Und {CN}: Halte heute Abend dein Handy in der Nähe.'},
 after:{t:'call',delay:2500,once:'d2call',name:'Mira',img:'a/v_mira.jpg',vo:'a/vo_call_d2.mp3',who:'mira',mailbox:true,mbVo:'a/vo_mb_d2.mp3',mbText:'Hier ist Mira. Du gehst nicht ran, okay. Hör zu: Halden hat seine Sicherheitsleute angewiesen, alle Server zu prüfen. Er ahnt etwas. Ab jetzt rufe ich nur noch an, wenn es wirklich wichtig ist. Wenn dein Handy das nächste Mal klingelt, geh bitte ran.',lines:['{CN}? Gut, dass du rangehst.','Halden hat gerade seine Sicherheitsleute angewiesen, alle Server zu prüfen. Er ahnt etwas.','Ab jetzt rufe ich nur noch an, wenn es wirklich wichtig ist. Wenn dein Handy klingelt: geh ran.']}},
3:{h:'1d58ccbb46463ae4c8c9b39b06590a72c51a673ee89a721cd9f60860b149ac3e',who:'bit',vo:'a/vo_d3.mp3',
 text:'Yo, {CN}, hier ist Bit. Ich hab den Sicherheitsfunk von Aurelion angezapft. Zwischen den Durchsagen piept es, immer wieder dasselbe Muster. Ich kann kein Morse, ich bin neunzehn. Du schon, oder? In deiner Akte liegt eine Morsetabelle.',
 mods:[{t:'morse',ic:'audio',b:'Abgefangener Funk',s:'Aurelion Sicherheitsfunk, Kanal 7',seq:'--. .- .-.. .-'},{t:'print',ic:'doc',b:'Morsetabelle',s:'Einsatzakte, Blatt 4',doc:'morse'}],
 hints:['Kurze Töne sind Punkte, lange Töne sind Striche. Zwischen den Buchstaben ist eine kleine Pause.','Es sind vier Buchstaben. Der erste ist lang, lang, kurz.','Lang lang kurz ist G, kurz lang ist A, kurz lang kurz kurz ist L, dann wieder A. Das Wort ist GALA.'],
 reveal:{who:'bit',vo:'a/vo_d3r.mp3',text:'GALA! Halden schmeißt am 12. Dezember eine Weihnachtsgala im Tower. Fünfhundert Gäste, Musik, Champagner. Und überall Leute, die nicht auffallen. Mira grinst gerade. Das heißt nichts Gutes für Halden.'}}
};

// Papierseiten aus der Einsatzakte, hier als Ansicht für den Test
window.DOCS={
 befehl:'<div class="doc"><span class="stamp">STRENG GEHEIM</span><h3>Einsatzbefehl NORDLICHT</h3><p>Lumenstadt schläft nie. Ihre Laternen zählen Schritte, ihre Ampeln merken sich Gesichter, und jeder Lautsprecher an jeder Ecke gehört Aurelion.</p><p>Unsere Crew heißt NORDLICHT. Wir sind wenige, wir sind leise, und ab heute gehörst du zu uns. Deinen Codenamen findest du unten auf diesem Befehl.</p><p>Morgen beginnt die Vorbereitung. Vierundzwanzig Tage, vierundzwanzig Etagen. Ganz oben im Aurelion Tower liegt ein Tresor, und darin liegt etwas, das an Heiligabend um Mitternacht die ganze Stadt zum Schweigen bringen soll.</p><p>Sag niemandem etwas davon. Aurelion hört mit, wo es kann. Was wir dir schicken, liest du allein.</p><p>Öffne die erste Tür und melde dich mit dem Wort an, das unser Funkspruch aus diesem Befehl zieht.</p><p style="margin-top:1.4em">Mira<br><small>Einsatzleitung NORDLICHT</small></p><p style="margin-top:1em;font-family:var(--mono);letter-spacing:.08em">Codename: {CN}</p></div>',
 ziel:'<div class="doc"><span class="stamp">ZIELPERSON</span><h3>Viktor Halden</h3><p><b>Geboren:</b> 1978 in Lumenstadt<br><b>Firma:</b> Aurelion, gegründet 2009 in einer Garage in der Altstadt<br><b>Aurelion Tower:</b> eröffnet 2016, 24 Etagen<br><b>Gewohnheiten:</b> postet täglich auf Pulse, liebt Hunde, hasst Papier</p><p><b>Einschätzung Mira:</b> Eitel. Benutzt Passwörter, die er für clever hält.</p></div>',
 morse:'<div class="doc"><h3>Morsetabelle</h3><p style="font-family:var(--mono);columns:2;line-height:1.9">A .-<br>B -...<br>C -.-.<br>D -..<br>E .<br>F ..-.<br>G --.<br>H ....<br>I ..<br>J .---<br>K -.-<br>L .-..<br>M --<br>N -.<br>O ---<br>P .--.<br>Q --.-<br>R .-.<br>S ...<br>T -<br>U ..-<br>V ...-<br>W .--<br>X -..-<br>Y -.--<br>Z --..</p></div>'
};
