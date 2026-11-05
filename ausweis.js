// Agentenausweis mit eigenem Foto, bleibt nur auf diesem Gerät
const PHOTO_KEY='tresor24_foto';
function photoGet(){try{return localStorage.getItem(PHOTO_KEY)}catch(e){return null}}
function photoSet(v){try{v?localStorage.setItem(PHOTO_KEY,v):localStorage.removeItem(PHOTO_KEY)}catch(e){}window.PHOTO_IMG=null;if(v){const i=new Image();i.src=v;window.PHOTO_IMG=i}}
photoSet(photoGet());
function idPhotoUI(){const card=$('.idcard');if(!card)return;const ph=card.querySelector('.ph'),v=photoGet();
 if(v){ph.style.backgroundImage='url('+v+')';ph.textContent='';ph.classList.add('has')}else{ph.style.backgroundImage='';ph.textContent='Kein Foto'}
 let box=$('#id-ph-box');if(!box){box=el('div','id-ph-box','');box.id='id-ph-box';card.after(box)}
 box.innerHTML='<div class="kp-row"><button class="btn" id="id-cam">'+(v?'Neues Foto':'Foto für den Ausweis machen')+'</button>'+(v?'<button class="btn ghost" id="id-del">Foto entfernen</button>':'')+'</div><p class="small">Das Foto bleibt nur auf diesem Gerät und wird nirgendwohin gesendet. Es erscheint auf deinem Ausweis und am Ende auf deiner Agentenurkunde.</p>';
 $('#id-cam').onclick=idCamera;const d=$('#id-del');if(d)d.onclick=()=>{photoSet(null);idPhotoUI();toast('Foto entfernt')}}
async function idCamera(){let stream;try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:720},height:{ideal:720}},audio:false})}catch(e){return toast('Kamera nicht verfügbar. Du kannst ohne Foto weiterspielen.',3500)}
 viewer('<div class="idcam"><div class="kick">NORDLICHT · Ausweisfoto</div><div class="idcam-v"><video id="id-v" playsinline autoplay muted></video><div class="idcam-m"></div></div><p class="small">Gesicht in den Rahmen, gerade in die Kamera. Kein Lächeln, du bist im Einsatz.</p><button class="btn big" id="id-shot" style="width:100%">Auslösen</button></div>');
 const vd=$('#id-v');vd.srcObject=stream;const stop=()=>stream.getTracks().forEach(t=>t.stop());const _c=closeViewer;closeViewer=function(){stop();closeViewer=_c;_c()};
 $('#id-shot').onclick=()=>{const c=document.createElement('canvas');c.width=c.height=360;const x=c.getContext('2d'),s=Math.min(vd.videoWidth,vd.videoHeight);x.translate(360,0);x.scale(-1,1);
  x.drawImage(vd,(vd.videoWidth-s)/2,(vd.videoHeight-s)/2,s,s,0,0,360,360);photoSet(c.toDataURL('image/jpeg',.82));tone(1800,.04,'square',.05);sfx('ok',.5);closeViewer();idPhotoUI();toast('Ausweis aktualisiert')}}
const _akteTabP=akteTab;akteTab=function(k){_akteTabP(k);if(k==='ausweis')idPhotoUI()};
// Urkunde im Finale mit Foto
const _finaleP=finale;finale=async function(){const ob=new MutationObserver(()=>{const b=$('#cert .ce-b');if(b&&!b.querySelector('.ce-ph')&&photoGet()){const d=el('div','ce-ph','');d.style.backgroundImage='url('+photoGet()+')';b.insertBefore(d,b.querySelector('h2'))}});ob.observe(document.body,{childList:true,subtree:true});try{return await _finaleP()}finally{ob.disconnect()}};
