/* ===== p38: recuperar audios sueltos (grabados en una salida que se cerró sin guardar su registro) ===== */
function ovOrphans(){
  var used={},o=[];
  try{
    trips.forEach(function(t){(t.eventos||[]).forEach(function(e){if(e&&e.audio)used[e.audio]=1})});
    if(SESS)(SESS.events||[]).forEach(function(e){if(e&&e.audio)used[e.audio]=1});
    if(LA&&LA.id)used[LA.id]=1;
    window.__CQ.B.forEach(function(r,id){var ty=String((r&&(r.type||(r.blob&&r.blob.type)))||'');if(r&&r.blob&&/^audio\//.test(ty)&&!used[id])o.push(id)});
  }catch(e){}
  return o;
}
function ovCard(){
  if(SESS)return '';
  var o=ovOrphans();if(!o.length)return '';
  var ts=trips.slice().sort(function(a,b){return String(b.date).localeCompare(String(a.date))||(b.createdAt||0)-(a.createdAt||0)}).slice(0,6);
  if(!ts.length)return '';
  return '<div class="block ovblk"><h3>🎙 Audios sin asignar ('+o.length+')</h3><p class="hint">Son de una salida que se cerró sin guardar su registro. Escúchalos, descárgalos o añádelos a una salida.</p>'+
    o.map(function(id,k){var u=audSrc(id);return '<div class="qcrow"><span class="evi">'+(k+1)+'</span><div class="qcm">'+(u?'<audio controls preload="none" src="'+u+'"></audio><a class="btn small dlbtn" href="'+u+'" download="audio-suelto-'+(k+1)+'.'+audExt(id)+'">Descargar</a>':'<small class="hint">Cargando…</small>')+'</div></div>'}).join('')+
    '<div class="field" style="margin-top:8px"><label for="ov-trip">Añadir al registro de</label><select id="ov-trip">'+ts.map(function(t){return '<option value="'+esc(t.id)+'">'+esc((t.date||'')+' · '+(t.siteName||'Salida'))+'</option>'}).join('')+'</select></div>'+
    '<button type="button" class="btn small primary" data-a="ov-assign">Añadir '+(o.length===1?'el audio':'los '+o.length+' audios')+' a esa salida</button></div>';
}
var _rs38=renderSalidas;
renderSalidas=function(){return ovCard()+_rs38()};
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a="ov-assign"]'):null;if(!b)return;
  var sel=$('#ov-trip'),id=sel&&sel.value,t=trips.filter(function(x){return x.id===id})[0];if(!t)return;
  var o=ovOrphans(),base=t.createdAt||Date.now();
  var ev2=(t.eventos||[]).concat(o.map(function(a,k){return {t:base+(k+1)*60000,type:'note',audio:a,why:'Audio recuperado (hora desconocida)',noTime:true}}));
  b.disabled=true;
  db.doc('trips/'+id).update({eventos:ev2}).then(function(){toast(o.length+(o.length===1?' audio añadido':' audios añadidos')+' a la salida');renderMain()},function(){b.disabled=false;toast('No se pudo añadir')});
},true);
var _evRow38=lvEvRow;
lvEvRow=function(e){var h=_evRow38(e);return e&&e.noTime?h.replace(/<time>[^<]*<\/time>/,'<time>·</time>'):h};
