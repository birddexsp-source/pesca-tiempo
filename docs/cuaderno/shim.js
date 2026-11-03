/* Cuaderno de pesca · almacén local (IndexedDB) + sincronización con GitHub. Sustituye a window.claude del visor. */
(function(){
'use strict';
var CFGK='cq.cfg', DBN='cuaderno-pesca', M=new Map(), B=new Map(), L={}, idb=null, ready=null, SEEDV='cq.seedv';
var STATIC={}; // id -> ruta de imagen incluida en la página
var SYNCING=false, LAST=null;
function now(){return Date.now()}
function rid(){var a=new Uint8Array(16);crypto.getRandomValues(a);return Array.prototype.map.call(a,function(x){return ('0'+x.toString(16)).slice(-2)}).join('')}
function cfg(){try{return JSON.parse(localStorage.getItem(CFGK)||'{}')}catch(e){return {}}}
function setCfg(o){try{localStorage.setItem(CFGK,JSON.stringify(o))}catch(e){}}
function meta(k,v){try{if(v===undefined)return JSON.parse(localStorage.getItem('cq.m.'+k)||'null');localStorage.setItem('cq.m.'+k,JSON.stringify(v))}catch(e){return null}}
function clone(x){return x==null?x:JSON.parse(JSON.stringify(x))}
/* ---------- IndexedDB ---------- */
function open(){return new Promise(function(res,rej){
  var r=indexedDB.open(DBN,1);
  r.onupgradeneeded=function(){var d=r.result;d.createObjectStore('docs',{keyPath:'p'});d.createObjectStore('blobs',{keyPath:'id'})};
  r.onsuccess=function(){res(r.result)};r.onerror=function(){rej(r.error)};
})}
function all(store){return new Promise(function(res,rej){var q=idb.transaction(store).objectStore(store).getAll();q.onsuccess=function(){res(q.result)};q.onerror=function(){rej(q.error)}})}
function put(store,v){try{idb.transaction(store,'readwrite').objectStore(store).put(v)}catch(e){}}
function init(){
  if(ready)return ready;
  ready=open().then(function(d){idb=d;return Promise.all([all('docs'),all('blobs')])}).then(function(r){
    r[0].forEach(function(x){M.set(x.p,x)});r[1].forEach(function(x){B.set(x.id,x)});
    return seed();
  }).then(function(){badge()});
  return ready;
}
function seed(){
  return fetch('seed-species.json',{cache:'no-cache'}).then(function(r){return r.ok?r.json():null}).catch(function(){return null}).then(function(s){
    if(!s)return;
    (s.files||[]).forEach(function(f){STATIC[f.replace(/\.webp$/,'')]='img/'+f});
    if((meta('seedv')||0)<s.v){
      Object.keys(s.speciesPhotos).forEach(function(k){var p='speciesPhotos/'+k,ex=M.get(p);if(ex&&ex.dirty)return;var rec={p:p,c:'speciesPhotos',i:k,d:{photo:s.speciesPhotos[k]},u:0,del:false,dirty:false};M.set(p,rec);put('docs',rec)});
      meta('seedv',s.v);
    }
  });
}
/* ---------- API tipo db ---------- */
function notify(c){(L[c]||[]).forEach(function(f){try{f()}catch(e){console.error(e)}});badge();if(dirtyCount()>0)autoSoon(25000)}
function snap(c){var docs=[];M.forEach(function(r){if(r.c===c&&!r.del&&r.d)docs.push({id:r.i,data:function(){return r.d}})});return {docs:docs}}
function writeDoc(c,i,fn){var p=c+'/'+i,ex=M.get(p),cur=ex&&!ex.del?clone(ex.d):null;var nd=fn(cur);var rec={p:p,c:c,i:i,d:nd,u:Math.max(now(),(ex?ex.u:0)+1),del:nd==null,dirty:true};M.set(p,rec);put('docs',rec);notify(c);return Promise.resolve()}
function mergeInto(o,data){Object.keys(data).forEach(function(k){var v=data[k];
  if(v&&typeof v==='object'&&v.__delete__){delete o[k];return}
  if(k.indexOf('.')>0){var parts=k.split('.'),t=o;for(var j=0;j<parts.length-1;j++){if(typeof t[parts[j]]!=='object'||t[parts[j]]===null)t[parts[j]]={};t=t[parts[j]]}t[parts[parts.length-1]]=clone(v)}
  else o[k]=clone(v)})}
function docRef(c,i){return {
  id:i,
  get:function(){var r=M.get(c+'/'+i);var ex=!!(r&&!r.del&&r.d);return Promise.resolve({exists:ex,id:i,data:function(){return ex?r.d:undefined}})},
  set:function(d){return writeDoc(c,i,function(){return clone(d)})},
  update:function(d){return writeDoc(c,i,function(cur){var o=cur||{};mergeInto(o,d);return o})},
  delete:function(){return writeDoc(c,i,function(){return null})}
}}
var DB={
  collection:function(c){return {
    doc:function(i){return docRef(c,i||rid().slice(0,20))},
    add:function(d){var i=rid().slice(0,20);return docRef(c,i).set(d).then(function(){return {id:i}})},
    get:function(){return Promise.resolve(snap(c))},
    onSnapshot:function(cb){(L[c]=L[c]||[]).push(function(){cb(snap(c))});setTimeout(function(){cb(snap(c))},0);return function(){}}
  }},
  doc:function(p){var a=p.split('/');return docRef(a[0],a.slice(1).join('/'))}
};
var ASSETS={upload:function(blob,o){var id=rid();var rec={id:id,blob:blob,type:(o&&o.type)||blob.type||'image/jpeg',dirty:true};B.set(id,rec);put('blobs',rec);badge();return Promise.resolve({id:id})}};
window.claude={use:function(n){return init().then(function(){return n==='db'?DB:n==='assets'?ASSETS:null})}};
window.__CQ={M:M,B:B,init:init};
/* ---------- fotos ---------- */
var URLS={};
function blobUrl(id){
  if(STATIC[id])return Promise.resolve(STATIC[id]);
  if(URLS[id])return Promise.resolve(URLS[id]);
  var r=B.get(id);if(!r||!r.blob)return Promise.resolve(null);
  return Promise.resolve(URLS[id]=URL.createObjectURL(r.blob));
}
function fixImgs(root){
  var l=(root.querySelectorAll?root:document).querySelectorAll('img[data-blob]');
  l.forEach(function(im){var id=im.getAttribute('data-blob');if(im.__bid===id)return;im.__bid=id;
    init().then(function(){return blobUrl(id)}).then(function(u){if(u&&im.__bid===id)im.src=u})});
}
new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1){if(n.matches&&n.matches('img[data-blob]'))fixImgs({querySelectorAll:function(){return [n]}});else fixImgs(n)}});if(m.type==='attributes')fixImgs(m.target.parentNode||document)})})
  .observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['data-blob']});
/* ---------- sincronización GitHub ---------- */
function b64enc(s){var u=new TextEncoder().encode(s),r='';for(var i=0;i<u.length;i+=0x8000)r+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(r)}
function b64dec(b){var s=atob(b.replace(/\n/g,'')),u=new Uint8Array(s.length);for(var i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u}
function blobToB64(bl){return new Promise(function(res,rej){var r=new FileReader();r.onload=function(){res(String(r.result).split(',')[1])};r.onerror=rej;r.readAsDataURL(bl)})}
function GH(c){
  var base='https://api.github.com/repos/'+c.repo;
  function call(path,o){o=o||{};return fetch(base+path,{method:o.method||'GET',headers:{'Authorization':'Bearer '+c.token,'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'},body:o.body?JSON.stringify(o.body):undefined,cache:'no-store'}).then(function(r){
    if(r.ok)return r.status===204?null:r.json();
    return r.text().then(function(t){var e=new Error('GitHub '+r.status+': '+(t||'').slice(0,160));e.status=r.status;throw e})})}
  return call;
}
function pool(items,n,fn){var i=0,out=[];return new Promise(function(res,rej){if(!items.length)return res(out);var run=0,fail=false;
  function next(){if(fail)return;if(i>=items.length){if(run===0)res(out);return}var k=i++;run++;fn(items[k],k).then(function(v){out[k]=v;run--;next()},function(e){fail=true;rej(e)})}
  for(var j=0;j<Math.min(n,items.length);j++)next()})}
function dirtyCount(){var n=0;M.forEach(function(r){if(r.dirty&&r.c!=='speciesPhotos')n++});B.forEach(function(r){if(r.dirty)n++});return n}
function sync(onProgress){
  if(SYNCING)return Promise.reject(new Error('Ya está sincronizando'));
  var c=cfg();if(!c.repo||!c.token)return Promise.reject(new Error('Falta configurar el repositorio y el token (⚙ Ajustes)'));
  if(!navigator.onLine)return Promise.reject(new Error('Sin conexión'));
  SYNCING=true;badge();var br=c.branch||'main',call=GH(c),prog=onProgress||function(){};
  var rs=meta('rs')||{},report={down:0,up:0};
  function attempt(n){
    prog('Conectando…');
    return call('/git/ref/heads/'+br).then(function(ref){var head=ref.object.sha;
      return call('/git/commits/'+head).then(function(cm){return call('/git/trees/'+cm.tree.sha+'?recursive=1').then(function(tr){
        if(tr.truncated)throw new Error('El repositorio de datos es demasiado grande para sincronizar');
        var remote={};tr.tree.forEach(function(t){if(t.type==='blob')remote[t.path]=t.sha});
        /* bajar */
        var dl=[];Object.keys(remote).forEach(function(p){
          if(p.indexOf('data/')===0&&p.slice(-5)==='.json'&&rs[p]!==remote[p])dl.push(p);
          else if(p.indexOf('blobs/')===0){var id=p.slice(6);if(!B.has(id))dl.push(p)}});
        var k=0;prog('Descargando…');
        return pool(dl,6,function(p){return call('/git/blobs/'+remote[p]).then(function(b){
          k++;prog('Descargando '+k+'/'+dl.length);
          if(p.indexOf('blobs/')===0){
            var id=p.slice(6),bytes=b64dec(b.content);var rec={id:id,blob:new Blob([bytes],{type:guessType(bytes)}),type:guessType(bytes),dirty:false};B.set(id,rec);put('blobs',rec);rs[p]=remote[p];report.down++;return}
          var j=JSON.parse(new TextDecoder().decode(b64dec(b.content)));var parts=p.slice(5,-5).split('/'),col=parts[0],id=parts.slice(1).join('/');
          var loc=M.get(col+'/'+id);rs[p]=remote[p];
          if(loc&&loc.dirty&&loc.u>j.u)return; /* gana lo local, se subirá */
          var rec={p:col+'/'+id,c:col,i:id,d:j.del?null:j.d,u:j.u,del:!!j.del,dirty:false};M.set(rec.p,rec);put('docs',rec);report.down++})})
        .then(function(){
          /* subir */
          var ups=[];M.forEach(function(r){if(r.dirty&&r.c!=='speciesPhotos')ups.push({kind:'doc',r:r,u:r.u})});
          B.forEach(function(r){if(r.dirty)ups.push({kind:'blob',r:r})});
          if(!ups.length){meta('rs',rs);return {head:head,pushed:false}}
          var done=0;prog('Subiendo 0/'+ups.length);
          var entries=[];
          return pool(ups,5,function(x){
            var pr=x.kind==='doc'?Promise.resolve(b64enc(JSON.stringify({u:x.r.u,del:!!x.r.del,d:x.r.d}))):blobToB64(x.r.blob);
            return pr.then(function(content){return call('/git/blobs',{method:'POST',body:{content:content,encoding:'base64'}})}).then(function(b){
              var path=x.kind==='doc'?'data/'+x.r.p+'.json':'blobs/'+x.r.id;entries.push({path:path,mode:'100644',type:'blob',sha:b.sha});x.sha=b.sha;x.path=path;done++;prog('Subiendo '+done+'/'+ups.length)})})
          .then(function(){return call('/git/trees',{method:'POST',body:{base_tree:cm.tree.sha,tree:entries}})})
          .then(function(t){return call('/git/commits',{method:'POST',body:{message:'Sync cuaderno '+new Date().toISOString().slice(0,16).replace('T',' ')+' ('+ups.length+')',tree:t.sha,parents:[head]}})})
          .then(function(nc){return call('/git/refs/heads/'+br,{method:'PATCH',body:{sha:nc.sha}})})
          .then(function(){ups.forEach(function(x){rs[x.path]=x.sha;if(x.kind==='doc'){var cur=M.get(x.r.p);if(cur&&cur.u===x.u){cur.dirty=false;put('docs',cur)}}else{x.r.dirty=false;put('blobs',x.r)}});report.up=ups.length;meta('rs',rs);return {head:head,pushed:true}})
        })})})
    }).catch(function(e){if(n<1&&(e.status===422||e.status===409)&&!/empty/i.test(e.message)){return attempt(n+1)}throw e});
  }
  return attempt(0).then(function(){LAST=now();meta('last',LAST);SYNCING=false;['sites','spots','trips','catches','forecast','speciesPhotos','barridos','gearInv'].forEach(notify);Object.keys(L).forEach(function(k){notify(k)});badge();return report},function(e){SYNCING=false;badge();throw e});
}
function guessType(u){if(u[0]===0xFF&&u[1]===0xD8)return 'image/jpeg';if(u[0]===0x89&&u[1]===0x50)return 'image/png';if(u[0]===0x52&&u[1]===0x49)return 'image/webp';return 'application/octet-stream'}
window.__CQ.sync=sync;window.__CQ.dirty=dirtyCount;
/* ---------- exportar / importar ---------- */
function exportAll(){
  var docs=[];M.forEach(function(r){if(r.c!=='speciesPhotos')docs.push({c:r.c,i:r.i,d:r.d,u:r.u,del:r.del})});
  var bl=[];B.forEach(function(r){bl.push(r)});
  return Promise.all(bl.map(function(r){return blobToB64(r.blob).then(function(b){return {id:r.id,type:r.type,b:b}})})).then(function(bs){return new Blob([JSON.stringify({v:1,docs:docs,blobs:bs})],{type:'application/json'})});
}
function importAll(text){
  var j=JSON.parse(text),n=0;
  (j.docs||[]).forEach(function(x){var p=x.c+'/'+x.i,ex=M.get(p);if(ex&&ex.u>=x.u&&!ex.del)return;var rec={p:p,c:x.c,i:x.i,d:x.d,u:Math.max(x.u||0,1),del:!!x.del,dirty:true};M.set(p,rec);put('docs',rec);n++});
  (j.blobs||[]).forEach(function(x){if(B.has(x.id))return;var u=b64dec(x.b);var rec={id:x.id,blob:new Blob([u],{type:x.type}),type:x.type,dirty:true};B.set(x.id,rec);put('blobs',rec)});
  Object.keys(L).forEach(notify);return n;
}
/* ---------- UI ---------- */
var CSS='.syncbtn{position:relative;width:40px;height:40px;border-radius:50%;border:1px solid var(--line2,#2a3a44);background:var(--surface,#10202a);color:var(--ink,#e8f1f5);display:grid;place-items:center;flex:none;margin-left:auto;cursor:pointer}'+
'.syncbtn svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}'+
'.syncbtn .nb{position:absolute;top:-4px;right:-4px;min-width:18px;height:18px;padding:0 4px;border-radius:9px;background:var(--accent,#3bc3d4);color:#04141a;font:700 11px/18px var(--mono,monospace);text-align:center}'+
'@media(max-width:480px){.topbar .when{display:none}}.syncbtn.err{border-color:#e5645a}.syncbtn.off{opacity:.6}.syncbtn.run svg{animation:cqspin 1s linear infinite}@keyframes cqspin{to{transform:rotate(360deg)}}'+
'.cqov{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.6);display:flex;align-items:flex-end;justify-content:center}'+
'.cqsh{width:100%;max-width:520px;max-height:92vh;overflow:auto;background:var(--surface,#10202a);color:var(--ink,#e8f1f5);border-radius:18px 18px 0 0;padding:18px 18px calc(20px + env(safe-area-inset-bottom,0px));font:500 14px/1.45 var(--body,system-ui,sans-serif)}'+
'.cqsh h2{font:700 18px/1.2 var(--display,inherit);margin:0 0 4px}.cqsh p.s{color:var(--muted,#8aa0ab);margin:0 0 14px;font-size:13px}'+
'.cqsh label{display:block;font:600 12px/1 var(--mono,monospace);text-transform:uppercase;letter-spacing:.06em;color:var(--muted,#8aa0ab);margin:12px 0 6px}'+
'.cqsh input[type=text],.cqsh input[type=password]{width:100%;box-sizing:border-box;padding:12px;border-radius:10px;border:1px solid var(--line2,#2a3a44);background:var(--bg,#071218);color:inherit;font:inherit}'+
'.cqsh .row{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.cqsh button{flex:1 1 auto;padding:12px 14px;border-radius:10px;border:1px solid var(--line2,#2a3a44);background:var(--surface2,#16303d);color:inherit;font:600 14px var(--body,inherit);cursor:pointer}'+
'.cqsh button.p{background:var(--accent,#3bc3d4);color:#04141a;border-color:transparent}.cqsh .st{margin-top:12px;padding:10px 12px;border-radius:10px;background:var(--bg,#071218);font-size:13px;white-space:pre-wrap}.cqsh .bad{color:#ff8a80}.cqsh .ok{color:#7ddc9a}';
var ST=document.createElement('style');ST.textContent=CSS;document.head.appendChild(ST);
var ICON='<svg viewBox="0 0 24 24"><path d="M7 18a4 4 0 0 1-.6-7.96A5.5 5.5 0 0 1 17 9.5a4.2 4.2 0 0 1 .5 8.5"/><path d="M12 12v8m0-8l-3 3m3-3l3 3" /></svg>';
var BTN=null;
function badge(){
  if(!BTN){var tb=document.querySelector('.topbar');if(!tb)return;BTN=document.createElement('button');BTN.className='syncbtn';BTN.type='button';BTN.setAttribute('aria-label','Sincronizar');
    var w=tb.querySelector('.when');tb.insertBefore(BTN,w);var lp=null,lpd=false;
    BTN.addEventListener('pointerdown',function(){lpd=false;lp=setTimeout(function(){lpd=true;settings()},600)});
    ['pointerup','pointerleave','pointercancel'].forEach(function(ev){BTN.addEventListener(ev,function(){clearTimeout(lp)})});
    BTN.addEventListener('click',function(){if(lpd){lpd=false;return}onBtn()});
    BTN.addEventListener('contextmenu',function(e){e.preventDefault()})}
  var n=dirtyCount();BTN.innerHTML=ICON+(n?'<span class="nb">'+n+'</span>':'');
  BTN.className='syncbtn'+(SYNCING?' run':'')+(navigator.onLine?'':' off');
}
function toastMsg(t){try{var el=document.getElementById('toast');if(el){el.textContent=t;el.classList.add('show');setTimeout(function(){el.classList.remove('show')},3200)}}catch(e){}}
function onBtn(){var c=cfg();if(!c.repo||!c.token||BTN.classList.contains('err')){settings();return}
  runSync();}
function runSync(setStat){
  BTN&&BTN.classList.remove('err');
  return sync(function(t){if(setStat)setStat(t,'')}).then(function(r){
    var m=(r.up||r.down)?('Sincronizado · subido '+r.up+' · bajado '+r.down):'Todo al día';toastMsg(m);if(setStat)setStat(m,'ok');return r
  },function(e){BTN&&BTN.classList.add('err');var m=e.message||String(e);if(e.status===401)m='El token no vale o ha caducado. Genera otro en GitHub.';if(e.status===404)m='No encuentro el repositorio (o el token no tiene acceso a él). Revisa el nombre.';if(e.status===409)m='El repositorio está vacío: créalo con la opción "Add a README file".';toastMsg(setStat?'Error al sincronizar':m.slice(0,70));if(setStat)setStat(m,'bad')})
}
function settings(){
  var c=cfg();var ov=document.createElement('div');ov.className='cqov';
  ov.innerHTML='<div class="cqsh"><h2>Sincronización</h2><p class="s">Los datos viven en tu móvil/PC y se suben a tu repositorio privado de GitHub cuando tú pulses sincronizar.</p>'+
  '<label>Repositorio de datos</label><input type="text" id="cq-repo" placeholder="usuario/nombre-del-repo" autocapitalize="off" autocomplete="off" value="'+(c.repo||'')+'">'+
  '<label>Token de GitHub</label><input type="password" id="cq-tok" placeholder="github_pat_…" autocomplete="off" value="'+(c.token||'')+'">'+
  '<div class="row"><button class="p" id="cq-go">Guardar y sincronizar</button></div>'+
  '<div class="row"><button id="cq-exp">Exportar copia</button><button id="cq-imp">Importar copia</button><button id="cq-x">Cerrar</button></div>'+
  '<input type="file" id="cq-file" accept="application/json,.json" hidden>'+
  '<div class="st" id="cq-st">'+(meta('last')?'Última sincronización: '+new Date(meta('last')).toLocaleString('es-ES'):'Aún no has sincronizado.')+(dirtyCount()?'\nPendiente de subir: '+dirtyCount():'')+'</div></div>';
  document.body.appendChild(ov);
  var $=function(s){return ov.querySelector(s)},st=function(t,k){var e=$('#cq-st');e.textContent=t;e.className='st '+(k||'')};
  ov.addEventListener('click',function(e){if(e.target===ov)ov.remove()});
  $('#cq-x').onclick=function(){ov.remove()};
  $('#cq-go').onclick=function(){var repo=$('#cq-repo').value.trim().replace(/^https?:\/\/github\.com\//,'').replace(/\.git$/,''),tok=$('#cq-tok').value.trim();if(!/^[\w.-]+\/[\w.-]+$/.test(repo)||!tok){st('Pon el repositorio como usuario/nombre y pega el token.','bad');return}setCfg({repo:repo,token:tok,branch:'main'});st('Sincronizando…');runSync(st)};
  $('#cq-exp').onclick=function(){exportAll().then(function(bl){var a=document.createElement('a');a.href=URL.createObjectURL(bl);a.download='cuaderno-copia-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();a.remove()})};
  $('#cq-imp').onclick=function(){$('#cq-file').click()};
  $('#cq-file').onchange=function(){var f=this.files[0];if(!f)return;f.text().then(function(t){var n=importAll(t);st('Importados '+n+' registros. Pulsa "Guardar y sincronizar" para subirlos.','ok')}).catch(function(){st('Ese archivo no es una copia válida.','bad')})};
}

/* ---------- sincronización automática ---------- */
var AT=null,ABACK=0;
function busyUI(){return !!document.querySelector('#sheet:not([hidden]),#picker:not([hidden]),#pick:not([hidden]),.cqov')}
function autoSoon(ms){clearTimeout(AT);AT=setTimeout(function(){autoSync()},ms)}
function autoSync(){
  var c=cfg();if(!c.repo||!c.token||!navigator.onLine||SYNCING)return;
  if(now()<ABACK)return autoSoon(ABACK-now()+500);
  if(busyUI())return autoSoon(8000);
  sync().then(function(r){if(r.up||r.down)toastMsg('Sincronizado · ↑'+r.up+' ↓'+r.down)},function(e){ABACK=now()+120000;BTN&&BTN.classList.add('err');console.warn('auto-sync',e.message)});
}
window.addEventListener('online',function(){autoSoon(1500)});
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'){if(now()-(meta('last')||0)>120000||dirtyCount())autoSoon(1000)}});
document.addEventListener('DOMContentLoaded',function(){init().then(function(){autoSoon(2000)})});
window.__CQ.settings=settings;
window.addEventListener('online',badge);window.addEventListener('offline',badge);
document.addEventListener('DOMContentLoaded',function(){badge();fixImgs(document)});
if('serviceWorker' in navigator&&location.protocol==='https:'||location.hostname==='localhost')navigator.serviceWorker.register('sw.js').catch(function(){});
})();
