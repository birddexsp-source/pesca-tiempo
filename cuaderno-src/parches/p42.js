/* ===== p42: Cambio de bajo, «¿qué cambias?», Bajos montados en Mi equipo y transcripciones visibles ===== */

/* ---------- Bajos montados (categoría de Mi equipo) ---------- */
EQKINDS.bajo={t:'Bajos montados',one:'bajo',f:[['name','Nombre (ej. Bajo 0,20 con anzuelo 4)'],['fluoro','Fluoro (mm)'],['anzuelo','Anzuelo (ej. nº 4 azul)'],['largo','Largo (cm)']],
  ic:'<path d="M3 11h10"/><circle cx="16.500" cy="11" r="3"/><path d="M19.500 11v5a3 3 0 0 1-6 0"/>'};
EQLBL.fluoro='Fluoro (mm)';EQLBL.anzuelo='Anzuelo';EQLBL.largo='Largo (cm)';
['fluoro','anzuelo','largo'].forEach(function(f){if(EQORD.indexOf(f)<0)EQORD.splice(EQORD.indexOf('tipo')+1,0,f)});
USEK.splice(2,0,['bajo','Bajos montados']);USEP.bajo='Bajo';STKINDS.splice(2,0,['bajo','Bajos']);
var _invName42=invName;
invName=function(it){if(it&&it.kind==='bajo')return it.name||['Bajo',it.fluoro?it.fluoro+' mm':'',it.anzuelo].filter(Boolean).join(' ');return _invName42(it)};
var _ivEsp42=ivEsp;
ivEsp=function(it){if(it&&it.kind==='bajo')return [it.fluoro?it.fluoro+' mm':'',it.anzuelo,it.largo?it.largo+' cm':''].filter(Boolean);return _ivEsp42(it)};
var _ivThumb42=ivThumb;
ivThumb=function(it){
  if(it&&it.kind==='bajo'&&!it.foto)return '<span class="ivph ivic"><svg class="bi" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22h22"/><circle cx="33" cy="22" r="5"/><path d="M38 22v10a7 7 0 0 1-14 0"/></svg></span>';
  return _ivThumb42(it);
};
var _eqPills42=eqPillsArr;
eqPillsArr=function(e){var p=_eqPills42(e);if(e.bajoTxt)p.push('Bajo: '+e.bajoTxt);return p};

/* ---------- «Cambio de equipo»: ¿qué cambias? + Cambio de bajo ---------- */
var WHATK=[['bajo','Bajo'],['anzuelo','Anzuelo'],['corcho','Corcho'],['cana','Caña / carrete'],['modo','Modalidad'],['otro','Otro']];
var FLUS=['0,16','0,18','0,20','0,23','0,26','0,30'];
var _lvEqOpen42=lvEqOpen;
lvEqOpen=function(){
  var cur=lvCurRig();
  _lvEqOpen42();
  if(LE){LE.what=[];LE.bajo={fluoro:'',anzuelo:''};LE.used0=((cur&&cur.used)||[]).map(function(u){return {id:u.id,kind:u.kind}});lvPaint()}
};
var _lvEqBody42=lvEqBody;
lvEqBody=function(){
  var h=_lvEqBody42(),W=(LE&&LE.what)||[],B=(LE&&LE.bajo)||{fluoro:'',anzuelo:''};
  var chips='<div class="field"><label>¿Qué cambias? (opcional)</label><div class="chips">'+WHATK.map(function(k){var on=W.indexOf(k[0])>-1;return '<button type="button" class="chip'+(on?' on':'')+'" data-a="lv-what" data-v="'+k[0]+'" aria-pressed="'+on+'">'+k[1]+'</button>'}).join('')+'</div></div>';
  var bj='';
  if(W.indexOf('bajo')>-1){
    bj='<div class="block lvbajo"><h3>🔗 Cambio de bajo</h3><p class="hint">Cambias el bajo entero. Si ya lo tienes montado, elígelo abajo en «Bajos montados». Si no, pon el fluoro y el anzuelo y lo completas en casa.</p>'+
      '<div class="field"><label>Fluoro (mm)</label><div class="chips">'+FLUS.map(function(f){return '<button type="button" class="chip'+(B.fluoro===f?' on':'')+'" data-a="lv-bj-f" data-v="'+f+'" aria-pressed="'+(B.fluoro===f)+'">'+f+'</button>'}).join('')+'</div>'+
      '<input id="lv-bj-fl" inputmode="decimal" maxlength="6" placeholder="Otro (mm)" value="'+(FLUS.indexOf(B.fluoro)>-1?'':esc(B.fluoro||''))+'" aria-label="Fluoro en mm"></div>'+
      '<div class="field"><label for="lv-bj-a">Anzuelo del bajo (opcional)</label><input id="lv-bj-a" maxlength="60" autocomplete="off" placeholder="Ej. nº 4 azul" value="'+esc(B.anzuelo||'')+'"></div></div>';
  }
  return chips+bj+h;
};
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a="lv-what"],[data-a="lv-bj-f"]'):null;if(!b||!LE)return;
  var a=b.getAttribute('data-a'),v=b.getAttribute('data-v');
  if(a==='lv-what'){var i=LE.what.indexOf(v);if(i>-1)LE.what.splice(i,1);else LE.what.push(v)}
  else{LE.bajo.fluoro=LE.bajo.fluoro===v?'':v}
  lvPaint();
});
document.addEventListener('input',function(ev){
  var t=ev.target;if(!t||!LE||!LE.bajo)return;
  if(t.id==='lv-bj-fl'){LE.bajo.fluoro=t.value.trim()}
  else if(t.id==='lv-bj-a'){LE.bajo.anzuelo=t.value}
},true);
function lvEqKinds(oldU,newU){
  var o={},n={},out=[];
  (oldU||[]).forEach(function(u){(o[u.kind]=o[u.kind]||{})[u.id]=1});(newU||[]).forEach(function(u){(n[u.kind]=n[u.kind]||{})[u.id]=1});
  Object.keys(Object.assign({},o,n)).forEach(function(k){if(JSON.stringify(Object.keys(o[k]||{}).sort())!==JSON.stringify(Object.keys(n[k]||{}).sort()))out.push(k)});
  return out;
}
lvEqSave=async function(){
  var L=LE;if(!L)return;
  var key=JSON.stringify(useList(L.rig).map(function(u){return u.id+(u.bob||'')}).sort()),chg=key!==L.key0,mchg=L.mode!==L.mode0;
  var bj=L.bajo||{},bF=String(bj.fluoro||'').trim(),bA=String(bj.anzuelo||'').trim(),bchg=(L.what||[]).indexOf('bajo')>-1&&!!(bF||bA);
  var tags=(L.what||[]).slice();
  if(!chg&&!mchg&&!bchg&&!L.why&&!LA&&!tags.length){toast('No has cambiado nada');return}
  var aud=await lvUpAudio();if(LA&&!aud){toast('No se pudo guardar el audio. Inténtalo otra vez.');return}
  var ev={t:Date.now(),type:'eq'},nuevo=chg||bchg||(!lvCurRig()&&!eqEmpty(L.rig));
  if(nuevo){
    var rig=JSON.parse(JSON.stringify(L.rig));rig.id=eqId();
    if(bchg){if(bF)rig.fluoro=bF;if(bA)rig.bajoTxt=bA;if(!(rig.used||[]).some(function(u){return u.kind==='bajo'}))rig.used=(rig.used||[]).slice()}
    if(L.why&&(SESS.equipos||[]).length)rig.why=L.why;
    SESS.equipos=(SESS.equipos||[]).concat([rig]);SESS.curEq=rig.id;ev.eq=rig.id;
    var usedTxt=(rig.used||[]).map(function(u){return u.name+(u.bob?' ('+u.bob+')':'')}).join(' · '),bTxt=bchg?'Bajo: '+[bF?bF+' mm':'',bA].filter(Boolean).join(' · '):'';
    ev.names=[bTxt,chg||!bchg?(usedTxt||lvRigTxt(rig)):''].filter(Boolean).join(' · ');
  }
  if(mchg){SESS.mode=L.mode;ev.mode=L.mode;if(tags.indexOf('modo')<0)tags.push('modo')}
  if(bchg&&tags.indexOf('bajo')<0)tags.push('bajo');
  lvEqKinds(L.used0,useList(L.rig)).forEach(function(k){var t=k==='carrete'||k==='cana'?'cana':k==='anzuelo'?'anzuelo':k==='corcho'?'corcho':k==='bajo'?'bajo':'otro';if(tags.indexOf(t)<0)tags.push(t)});
  if(tags.length)ev.what=tags;
  if(bchg)ev.bajo={fluoro:bF,anzuelo:bA};
  if(L.why)ev.why=L.why;if(aud)ev.audio=aud;
  SESS.events=(SESS.events||[]).concat([ev]);
  lvSave({equipos:SESS.equipos||[],curEq:SESS.curEq||null,mode:SESS.mode||null,events:SESS.events});
  LE=null;LA=null;toast(bchg?'Cambio de bajo anotado':'Cambio de equipo anotado');sessOpen();
};

/* ---------- registro: título según lo que cambias y transcripción del audio ---------- */
var _evRow42=lvEvRow;
lvEvRow=function(e){
  var h=_evRow42(e);if(!e)return h;
  if(e.type==='eq'&&e.what&&e.what.length){
    var L={bajo:'bajo',anzuelo:'anzuelo',corcho:'corcho',cana:'caña/carrete',modo:'modalidad',otro:'equipo'},ls=e.what.map(function(k){return L[k]||k}).filter(function(x,i,a){return a.indexOf(x)===i});
    var lab=ls.length>1?ls.slice(0,-1).join(', ')+' y '+ls[ls.length-1]:ls[0];
    h=h.replace('Cambio de equipo','Cambio de '+lab);
  }
  if(e.text){var i=h.lastIndexOf('</div></div>');if(i>-1)h=h.slice(0,i)+'<small class="trx">«'+esc(e.text)+'»</small>'+h.slice(i)}
  return h;
};
(function(){var s=document.createElement('style');s.textContent='.trx{display:block;margin-top:6px;font-style:italic;color:var(--muted);line-height:1.35}.lvbajo input{width:100%;margin-top:6px}';document.head.appendChild(s)})();
