// Sprachausgabe: startet zuverlässig automatisch (auch auf dem iPhone) und macht nach Unterbrechungen an derselben Stelle weiter
(function(){
const V=new Audio();V.preload='auto';V.setAttribute('playsinline','');V.setAttribute('webkit-playsinline','');
const SIL='data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=';
let unlocked=false,retry=null,hidPaused=false;
const parked={};// Kontext -> {src,t,ui,auto,at,end}
const ctxNow=()=>{const v=document.querySelector('#viewer');return v&&v.classList.contains('on')?'viewer':(typeof curScreen!=='undefined'&&curScreen||'')};
const isFilm=src=>{try{if(window.INTRO&&INTRO.vo===src)return true;if(window.FILMS)return Object.values(FILMS).some(f=>f.vo===src)}catch(e){}return false};
function gesture(){
 try{if(AC&&AC.state!=='running')AC.resume()}catch(e){}
 if(retry){const r=retry;retry=null;r();return}
 if(!unlocked&&!curVo){unlocked=true;try{V.src=SIL;const p=V.play();p&&p.then(()=>{if(!curVo)V.pause()}).catch(()=>{unlocked=false})}catch(e){unlocked=false}}
}
['touchend','pointerup','click','keydown'].forEach(e=>document.addEventListener(e,gesture,{capture:true,passive:true}));
function userStop(){const e=window.event;return !!(e&&/click|pointer|touch/.test(e.type)&&e.target&&e.target.closest&&e.target.closest('.play,.prep-play.on'))}
function park(auto){if(!curVo||!V._src)return;if(!isFilm(V._src)&&V.currentTime>0.3&&!V.ended)parked[V._ctx]={src:V._src,t:V.currentTime,ui:V._ui,auto:auto,at:Date.now(),end:V._end}}
function release(){try{V.pause()}catch(e){}const u=V._ui;curVo=null;u&&u(false);duck(false)}
stopVo=function(){if(!curVo)return;park(!userStop());release()};
playVo=function(src,ui){
 if(curVo)stopVo();
 if(!src||!st.sound)return null;ac();
 const ctx=ctxNow();let t=0;const p=parked[ctx];
 if(p&&p.src===src&&Date.now()-p.at<20*60e3&&!isFilm(src))t=Math.max(0,p.t-1);
 delete parked[ctx];
 retry=null;V.onended=null;V.onerror=null;
 if(V._src!==src||V.src.indexOf(src)<0){V.src=src}
 V._src=src;V._ui=ui;V._ctx=ctx;curVo=V;curVo._ui=ui;
 const end=()=>{if(curVo===V){const u=V._ui;curVo=null;u&&u(false);duck(false)}};V._end=end;
 V.onended=end;V.onerror=end;
 duck(true);ui&&ui(true);
 const go=()=>{try{if(t>0){try{V.currentTime=t}catch(e){}}const pr=V.play();pr&&pr.catch(()=>{if(curVo===V)retry=()=>{if(curVo===V)V.play().catch(()=>{})}})}catch(e){}};
 if(t>0&&V.readyState<1){V.addEventListener('loadedmetadata',()=>{if(curVo===V)go()},{once:true});try{V.load()}catch(e){};const pr=V.play();pr&&pr.catch(()=>{if(curVo===V)retry=go})}else{try{V.currentTime=t}catch(e){}go()}
 return V};
// Zurück auf einen Bildschirm oder aus einem Fenster: unterbrochenen Ton dort fortsetzen
function resumeHere(){const ctx=ctxNow(),p=parked[ctx];if(!p||curVo||!p.auto||!st.sound)return;if(Date.now()-p.at>20*60e3){delete parked[ctx];return}playVo(p.src,p.ui)}
document.addEventListener('screen',()=>setTimeout(resumeHere,650));
// Fenster schließen: Ton aus dem Fenster beenden, Ton des Bildschirms fortsetzen
const _cv=closeViewer;closeViewer=function(){const keep=(curVo===V&&V._ctx!=='viewer')?V:null;if(keep)curVo=null;let r;try{r=_cv.apply(this,arguments)}finally{if(keep&&!curVo)curVo=keep}if(!keep)setTimeout(resumeHere,300);return r};
// Fenster öffnen hält den Bildschirmton nicht an (man kann weiter zuhören und lesen)
// App im Hintergrund: Ton anhalten und danach exakt weiter
document.addEventListener('visibilitychange',()=>{
 if(document.hidden){if(curVo&&!V.paused){hidPaused=true;try{V.pause()}catch(e){}}}
 else{try{if(AC&&AC.state!=='running')AC.resume()}catch(e){}
  if(hidPaused&&curVo===V){hidPaused=false;const pr=V.play();pr&&pr.catch(()=>{retry=()=>{if(curVo===V)V.play().catch(()=>{})}})}hidPaused=false}});
window.addEventListener('pageshow',()=>{try{if(AC&&AC.state!=='running')AC.resume()}catch(e){}});
window.__vo={parked,V};
})();
