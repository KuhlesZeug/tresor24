// Schauplatzbild über jeder Etage (gemalte Aufnahmen, keine Rätseldaten)
(function(){const SZ={"1": "Der Tisch am Glashafen", "3": "Bits Funkecke", "4": "Schnellbahn, Innenstadt", "5": "Kaiserbrücke 7", "7": "Festsaal, Etage 22", "8": "Lesegerät im Tower", "9": "Henriks Werkstatt", "11": "Der Kranich", "13": "Flur 13", "14": "Flur 14, Nachtschicht", "16": "Rechenzentrum", "17": "Aurelion Tower", "18": "Projekt Leuchtturm", "22": "Etage 24, Archiv", "23": "Unter der Altstadt"};
const _open=openDay;openDay=function(d){const r=_open.apply(this,arguments);try{const host=document.querySelector('#s-day .day-in');const old=host.querySelector('.szene');if(old)old.remove();
 if(SZ[d]){const f=document.createElement('figure');f.className='szene';f.innerHTML='<img src="a/sz_'+String(d).padStart(2,'0')+'.jpg" alt="" loading="lazy"><figcaption>'+SZ[d]+'</figcaption>';host.insertBefore(f,host.firstChild)}}catch(e){}return r};
})();
// Stempel in den Testansichten tragen dieselbe Nummer wie das gedruckte Blatt
(function(){try{const no={};Object.values(DAYS).forEach(D=>(D&&D.mods||[]).forEach(m=>{const x=/Blatt (\d+)/.exec(m.s||'');if(m.doc&&x)no[m.doc]=x[1]}));
 Object.keys(DOCS).forEach(k=>{if(no[k]&&typeof DOCS[k]==='string')DOCS[k]=DOCS[k].replace(/(<span class="stamp">)AKTE \d+(<\/span>)/,'$1BLATT '+String(no[k]).padStart(2,'0')+'$2')})}catch(e){}})();
