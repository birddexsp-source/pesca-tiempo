/* ===== p35: editar capturas del registro + Engodo como categoría de equipo ===== */

/* ---------- A. Editar una captura (tocar la fila en el registro / Por ordenar) ---------- */
(function(){var s=document.createElement('style');s.textContent=
'.qcrow .qcm[data-a="qc-edit"]{cursor:pointer;flex:1;min-width:0}.qce{flex:none;width:34px;height:34px;border-radius:10px;border:1.5px solid var(--line);background:var(--surface);color:var(--muted);font-size:15px;line-height:1}'+
'.foot .btn.danger{flex:none}';
document.head.appendChild(s)})();

var QEDEL=false;
var _qcRow35=qcRow;
qcRow=function(c){
  var h=_qcRow35(c),id=esc(c.id);
  h=h.replace('<div class="qcm">','<div class="qcm" data-a="qc-edit" data-id="'+id+'" role="button" tabindex="0" aria-label="Editar captura">');
  return h.replace('<button type="button" class="qcx"','<button type="button" class="qce" data-a="qc-edit" data-id="'+id+'" aria-label="Editar captura">✎</button><button type="button" class="qcx"');
};
function qeFoot(){return '<button class="btn danger" data-a="qe-del" id="qe-del">Borrar</button><button class="btn primary" data-a="qe-save" id="qe-ok">Guardar cambios</button>'}
function qeOpen(id,fromSheet){
  var c=catches.filter(function(x){return x.id===id})[0];if(!c)return;
  var i=(c.items||[])[0]||{};QEDEL=false;
  QC={lat:c.lat==null?null:c.lat,lon:c.lon==null?null:c.lon,acc:c.acc==null?null:c.acc,gps:'ok',manual:c.locSrc==='manual',
    sel:c.spotId||(c.lat==null?'none':''),species:i.species||'',key:i.key||null,n:i.n||1,size:i.size||'M',st:i.st||'casa',
    ts:c.ts,date:c.date,time:c.time,bait:i.bait||'',hook:i.hook||'',who:i.who||'',editId:id,fromLast:null};
  LVBACK=!!(fromSheet&&SESS);
  openSheet('Editar captura','<div id="qc-body">'+quickBody()+'</div>',qeFoot(),'quick');
  qcStat();
}
async function qeSave(){
  var q=QC;if(!q||!q.editId)return;
  if(!q.species){toast('Elige la especie');return}
  var c=catches.filter(function(x){return x.id===q.editId})[0];if(!c){toast('Esa captura ya no existe');closeSheet();return}
  var b=$('#qe-ok');if(b)b.disabled=true;
  var items=(c.items||[]).slice(),it=Object.assign({},items[0]||{},{species:q.species,key:q.key||keyOfName(q.species),n:q.n,size:q.size,st:q.st});
  if(q.bait)it.bait=q.bait;else delete it.bait;
  if(q.hook&&String(q.hook).trim())it.hook=String(q.hook).trim();else delete it.hook;
  if(q.who)it.who=q.who;else delete it.who;
  items[0]=it;
  var lat=q.lat,lon=q.lon,acc=q.acc,spotId=null;
  if(q.sel==='none'){lat=null;lon=null;acc=null}
  else if(q.sel){spotId=q.sel;var sp=spots.filter(function(s){return s.id===q.sel})[0];if(sp&&lat==null){lat=sp.lat;lon=sp.lon}}
  else if(lat!=null){var nr=nearestSpot(lat,lon,qcRadius());spotId=nr?nr.s.id:null}
  var upd={items:items,lat:lat,lon:lon,acc:acc,spotId:spotId,time:q.time,date:q.date,ts:q.ts,editedAt:Date.now()};
  try{await db.doc('catches/'+q.editId).update(upd);toast('Captura actualizada');closeSheet()}
  catch(e){if(b)b.disabled=false;toast('No se pudo guardar')}
}
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a="qc-edit"],[data-a="qe-save"],[data-a="qe-del"]'):null;if(!b)return;
  var a=b.getAttribute('data-a');
  if(a==='qc-edit'){ev.stopPropagation();qeOpen(b.getAttribute('data-id'),!!b.closest('#sheet'))}
  else if(a==='qe-save'){qeSave()}
  else if(a==='qe-del'){
    if(!QC||!QC.editId)return;
    if(!QEDEL){QEDEL=true;b.textContent='¿Seguro? Toca otra vez';setTimeout(function(){QEDEL=false;var x=$('#qe-del');if(x)x.textContent='Borrar'},4000);return}
    var id=QC.editId;db.doc('catches/'+id).delete().then(function(){toast('Captura borrada');closeSheet()},function(){toast('No se pudo borrar')});
  }
},true);
document.addEventListener('keydown',function(ev){
  if(ev.key!=='Enter'&&ev.key!==' ')return;var t=ev.target;
  if(t&&t.getAttribute&&t.getAttribute('data-a')==='qc-edit'&&t.tagName==='DIV'){ev.preventDefault();qeOpen(t.getAttribute('data-id'),!!t.closest('#sheet'))}
});

/* ---------- B. Engodo en Mi equipo ---------- */
EQKINDS.engodo={t:'Engodo',one:'engodo',f:[['name','Nombre *'],['tipo','Tipo (casero, comercial…)'],['base','Ingredientes / base'],['marca','Marca']],
  ic:'<path d="M5 9h14l-1.6 11H6.600z"/><path d="M5 9a7 3 0 0 1 14 0"/><path d="M9 14h6"/>'};
EQLBL.base='Ingredientes';if(EQORD.indexOf('base')<0)EQORD.splice(EQORD.indexOf('tipo')+1,0,'base');
USEK.push(['engodo','Engodo']);USEP.engodo='Engodo';STKINDS.push(['engodo','Engodo']);
var _ivThumb35=ivThumb;
ivThumb=function(it){
  if(it&&it.kind==='engodo'&&!it.foto)return '<span class="ivph ivic"><svg class="bi" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h30l-3.200 22H12.200z" fill="currentColor" fill-opacity=".16"/><path d="M9 18a15 6 0 0 1 30 0"/><path d="M18 29h12"/></svg></span>';
  return _ivThumb35(it);
};
var _ivEsp35=ivEsp;
ivEsp=function(it){if(it&&it.kind==='engodo')return [it.tipo,it.base,it.marca].filter(Boolean);return _ivEsp35(it)};
/* en las pastillas del resumen de la salida */
var _eqPills35=eqPillsArr;
eqPillsArr=function(e){var p=_eqPills35(e);(e.used||[]).forEach(function(u){if(u.kind==='engodo')p.push('Engodo '+u.name)});return p};

/* Alta única de «Verdel (casero)» y, si hay salida en curso, queda activo en el equipo actual */
(function(){
  var t=setInterval(function(){
    if(typeof db==='undefined'||!db)return;clearInterval(t);
    db.doc('gearMeta/seedEngodo1').get().then(function(m){
      if(m&&m.exists)return;
      var id='engodo-verdel',nm='Verdel (casero)';
      return db.collection('gearInv').doc(id).set({kind:'engodo',name:nm,tipo:'Casero',base:'Verdel',createdAt:Date.now()})
        .then(function(){return db.doc('gearMeta/seedEngodo1').set({at:Date.now()})})
        .then(function(){
          toast('Engodo «'+nm+'» añadido a Mi equipo');
          var tries=0,w=setInterval(function(){
            tries++;
            if(SESS){clearInterval(w);lvEngoActivar(id,nm)}
            else if(tries>12)clearInterval(w);
          },500);
        });
    }).catch(function(){});
  },1800);
})();
function lvEngoActivar(id,nm){
  if(!SESS)return;
  var rig=lvCurRig(),u={id:id,kind:'engodo',name:nm};
  if(rig){
    if(useList(rig).some(function(x){return x.kind==='engodo'}))return;
    useList(rig).push(u);
  }else{
    rig={id:eqId(),used:[u]};SESS.equipos=(SESS.equipos||[]).concat([rig]);SESS.curEq=rig.id;
  }
  lvSave({equipos:SESS.equipos||[],curEq:SESS.curEq||null});
  toast('Engodo activo en tu salida: '+nm);
}
