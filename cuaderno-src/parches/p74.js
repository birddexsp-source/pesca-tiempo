/* ===== p74: Instalar la app en el móvil (Ajustes) y actualizarse sola cuando publico cambios ===== */
var PW={dp:null,had:!!(navigator.serviceWorker&&navigator.serviceWorker.controller),rl:false,ver:'',st:''};
window.__pw=PW;
function pwStandalone(){try{return (window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true}catch(e){return false}}
function pwIOS(){return /iphone|ipad|ipod/i.test(navigator.userAgent||'')}
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();PW.dp=e;pwPaint()});
window.addEventListener('appinstalled',function(){PW.dp=null;toast('App instalada ✓');pwPaint()});
function pwVersion(){
  if(!window.caches)return Promise.resolve('');
  return caches.keys().then(function(k){var v=k.filter(function(x){return /^cuaderno-v/.test(x)}).sort().pop();return v?v.replace('cuaderno-',''):''}).catch(function(){return ''});
}
function pwBodyHTML(){
  var h='',v=PW.ver?'Versión '+esc(PW.ver):'';
  if(pwStandalone()){
    h+='<p class="pwok">✓ Estás usando la app instalada.</p>';
  }else if(PW.dp){
    h+='<p class="hint">Se instala como una app más, con su icono, a pantalla completa y funcionando sin cobertura.</p><button type="button" class="btn primary pwbtn" data-a="pw-install">📲 Instalar en este móvil</button>';
  }else if(pwIOS()){
    h+='<p class="hint">En iPhone/iPad: toca <b>Compartir</b> (cuadrado con flecha) y luego <b>«Añadir a pantalla de inicio»</b>. Ojo: la app de iPhone guarda sus datos aparte del navegador, así que tendrás que poner el token de sincronización otra vez dentro de la app.</p>';
  }else{
    h+='<p class="hint">En Chrome: menú <b>⋮</b> → <b>«Instalar aplicación»</b> (o «Añadir a la pantalla de inicio»). Si no aparece, abre esta página directamente en Chrome (no dentro de otra app) y recárgala.</p>';
  }
  h+='<p class="hint pwup">La app se actualiza sola: al abrirla comprueba si hay cambios y, si los hay, se recarga con la versión nueva. '+(v?v+'. ':'')+esc(PW.st||'')+'</p>';
  h+='<button type="button" class="btn pwbtn" data-a="pw-check">🔄 Buscar actualización ahora</button>';
  return h;
}
function pwSub(){return pwStandalone()?'Ya instalada · se actualiza sola':PW.dp?'Disponible · un toque':'Cómo instalarla y actualizaciones'}
function pwPaint(){
  var d=document.querySelector('#sheetbody .pwacc');if(!d)return;
  var b=d.querySelector('.uib'),s=d.querySelector('summary small');
  if(b)b.innerHTML=pwBodyHTML();if(s)s.textContent=pwSub();
}
var _os74=openSettings;
openSettings=function(){
  _os74.apply(this,arguments);
  var b=document.getElementById('sheetbody');if(!b||b.querySelector('.pwacc'))return;
  try{
    var a=uiDom(uiAccHTML('set-pw','📲','Instalar la app',pwSub(),pwBodyHTML()));var det=a.firstChild;det.classList.add('pwacc');
    b.appendChild(det);
    if(!PW.ver)pwVersion().then(function(v){PW.ver=v;pwPaint()});
  }catch(e){}
};
function pwInstall(){
  var e=PW.dp;if(!e)return;
  try{e.prompt();Promise.resolve(e.userChoice).then(function(c){PW.dp=null;if(c&&c.outcome==='accepted')toast('Instalando…');pwPaint()})}catch(x){}
}
function pwCheck(manual){
  if(!navigator.serviceWorker)return;
  if(manual){PW.st='Buscando…';pwPaint()}
  navigator.serviceWorker.getRegistration().then(function(r){
    if(!r){if(manual){PW.st='Sin service worker (abre la app por https).';pwPaint()}return}
    return r.update().then(function(){
      if(manual){PW.st=(r.installing||r.waiting)?'Hay una versión nueva: instalándose…':'Ya tienes la última versión.';pwVersion().then(function(v){PW.ver=v;pwPaint()});pwPaint()}
    });
  }).catch(function(){if(manual){PW.st='No se pudo comprobar (¿sin conexión?).';pwPaint()}});
}
function pwBusy(){
  var el=document.activeElement,tag=el&&el.tagName;
  if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT')return true;
  if(typeof VQ!=='undefined'&&VQ.on)return true;
  return false;
}
function pwReload(){
  if(window.__pwNoReload){window.__pwReloaded=(window.__pwReloaded||0)+1;return}
  location.reload();
}
function pwNewVersion(){
  if(!PW.had||PW.rl)return;
  if(pwBusy()){
    var t=document.getElementById('toast');
    if(t){t.innerHTML='<span>Hay una versión nueva</span> <button type="button" class="btn pwupd" data-a="pw-reload">Actualizar</button>'}
    return;
  }
  PW.rl=true;toast('Versión nueva: actualizando…');setTimeout(pwReload,900);
}
if(navigator.serviceWorker){
  navigator.serviceWorker.addEventListener('controllerchange',pwNewVersion);
  setTimeout(function(){pwCheck(false)},3000);
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')pwCheck(false)});
  setInterval(function(){if(document.visibilityState==='visible')pwCheck(false)},15*60*1000);
}
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a="pw-install"],[data-a="pw-check"],[data-a="pw-reload"]'):null;if(!b)return;
  ev.preventDefault();ev.stopPropagation();
  var a=b.getAttribute('data-a');
  if(a==='pw-install')pwInstall();else if(a==='pw-check')pwCheck(true);else{PW.rl=true;pwReload()}
},true);
(function(){var s=document.createElement('style');s.textContent='.pwbtn{width:100%;margin-top:6px}.pwok{margin:0 0 6px;font:600 14px var(--body);color:var(--ok,#4fd18b)}.pwup{margin:8px 0 0}.pwupd{margin-left:8px;padding:6px 12px}';document.head.appendChild(s)})();
