/* ===== p46: editar salida — Equipo sin repeticiones (línea de mi lista + longitud) y ubicar paradas en el mapa ===== */
EQK.bajo[0]='Cambio de bajo';

/* ---------- A. Equipo: una sola vez cada cosa ---------- */
var EQLEG=['corchoForma','corchoFab','corchoGr','anzuelo','anzueloNum','cana','carrete'];
function eqTidy(e,i,h){
  var box=document.createElement('div');box.innerHTML=h;
  var q=function(k){return box.querySelector('details[data-gk="e'+i+k+'"]')};
  var rowOf=function(txt){return [].slice.call(box.querySelectorAll('.invrow')).filter(function(r){var l=r.querySelector('.invl');return l&&l.textContent.trim()===txt})[0]};
  /* Línea: mi lista en tiles + longitud */
  var ln=q('linea');
  if(ln){
    var mine=rowOf('Mis fluorocarbonos'),gen=rowOf('Fluorocarbono'),len=rowOf('Bajo (distancia)');
    if(mine){
      var chips=[].slice.call(mine.querySelectorAll('[data-a="ln-use"]'));
      var tiles=chips.map(function(b){
        var it=INV.filter(function(x){return x.id===b.getAttribute('data-id')})[0],on=b.getAttribute('aria-pressed')==='true';
        return '<button type="button" class="utile'+(on?' on':'')+'" data-a="ln-use" data-i="'+i+'" data-id="'+esc(b.getAttribute('data-id'))+'" aria-pressed="'+on+'">'+(it?ivThumb(it):'')+'<span>'+esc(it?invName(it):b.textContent)+'</span></button>'}).join('');
      mine.innerHTML='<span class="invl">Mi línea del bajo</span><div class="ugrid">'+tiles+'</div>';
      var anyOn=chips.some(function(b){return b.getAttribute('aria-pressed')==='true'});
      if(gen&&(anyOn||!e.fluoro))gen.remove();      /* los mm sueltos solo si no coinciden con ninguna de mi lista */
      else if(gen){var l=gen.querySelector('.invl');if(l)l.textContent='Grosor (mm) — no está en mi lista'}
      if(mine&&gen&&gen.parentNode&&mine.parentNode)mine.parentNode.insertBefore(mine,gen);
    }
    if(len){var l2=len.querySelector('.invl');if(l2)l2.textContent='Longitud del bajo'}
    var sp=ln.querySelector('summary span');if(sp)sp.textContent='Línea y bajo';
  }
  if(!e.kind){
    var legacy=!(e.used&&e.used.length)&&EQLEG.some(function(k){return e[k]});
    if(!legacy){
      ['anz','cana'].forEach(function(k){var d=q(k);if(d)d.remove()});
      var ap=q('apar');
      if(ap){
        ['Forma del corcho','Mis corchos'].forEach(function(t){var r=rowOf(t);if(r)r.remove()});
        ['corchoFab','corchoGr'].forEach(function(f){var inp=ap.querySelector('[data-ef="'+f+'"]');var fl=inp&&inp.closest('.field');if(fl)fl.remove()});
        var s2=ap.querySelector('summary span');if(s2)s2.textContent='Aparejo y plomo';
      }
    }
  }
  return box.innerHTML;
}
var _eqCard46=eqCard;
eqCard=function(e,i,n){return eqTidy(e,i,_eqCard46(e,i,n))};
var _gb46=gearBlock;
gearBlock=function(d){
  return _gb46(d).replace('Rellénalo con lo que sepas, el resto queda en blanco. Con un solo equipo no hace falta nada más.','Es el equipo con el que empiezas a pescar. Si cambias algo durante la salida, añádelo abajo con «+ Cambio de bajo» (o aparejo, o modalidad).');
};

/* ---------- B. Ubicar las paradas del registro en el mapa y ponerles nombre ---------- */
var _rtBody46=rtBody;
rtBody=function(){
  var h=_rtBody46(),E=RTE;if(!E)return h;
  var t=trips.filter(function(x){return x.id===E.tid})[0],n=t&&rtNodes(t).filter(function(x){return x.key===E.key})[0];
  var located=!!(n&&n.sp);
  var blk='<div class="field"><label for="rt-name">'+(located?'Nombre de la parada':'Esta parada no está en el mapa')+'</label>'+
    '<input id="rt-name" maxlength="60" autocomplete="off" value="'+esc(E.name!=null?E.name:(n?n.name:''))+'" placeholder="Nombre del spot">'+
    '<button type="button" class="btn" data-a="rt-mark" style="width:100%;margin-top:8px">📍 '+(located?'Crear otro spot en otro punto':'Marcar en el mapa y crear el spot')+'</button></div>';
  return blk+h;
};
async function rtMark(){
  var E=RTE;if(!E)return;
  var t=trips.filter(function(x){return x.id===E.tid})[0];if(!t)return;
  var nameEl=document.getElementById('rt-name'),nm=(nameEl&&nameEl.value||'').trim();
  if(!nm){toast('Ponle un nombre al spot');return}
  var N=rtNodes(t),marks=N.filter(function(x){return x.sp}).map(function(x){return {lat:x.sp.lat,lon:x.sp.lon,name:x.name}});
  var site=sites.filter(function(s){return s.id===t.siteId})[0];
  if(!marks.length&&site&&site.lat!=null)marks.push({lat:site.lat,lon:site.lon,name:site.name});
  var sel=document.getElementById('rt-spot');if(sel)E.spotId=sel.value;
  pickPoint({title:'¿Dónde está «'+nm+'»?',label:nm,marks:marks,hint:'Arrastra el pin o toca el mapa.',onDone:async function(la,lo){
    try{
      var ref=db.collection('spots').doc();
      await ref.set({name:nm,siteId:t.siteId||null,lat:la,lon:lo,notes:'',createdAt:Date.now(),status:'activo'});
      E.spotId=ref.id;E.name=nm;E.fresh=true;RTE=E;
      await rtSave();
      toast('Spot «'+nm+'» creado y enlazado');
    }catch(err){toast('No se pudo crear el spot')}
  }});
}
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a="rt-mark"]'):null;if(!b)return;
  ev.stopPropagation();rtMark();
},true);
/* mantener el nombre escrito al repintar la hoja de la parada */
document.addEventListener('input',function(ev){if(RTE&&ev.target&&ev.target.id==='rt-name')RTE.name=ev.target.value},true);
/* aviso en «Mi recorrido» cuando hay paradas sin ubicar */
var _rtCard46=rtCard;
rtCard=function(t){
  var h=_rtCard46(t);if(!h)return h;
  var miss=rtNodes(t).filter(function(n){return !n.sp}).length;
  if(!miss)return h;
  return h.replace('<div class="rtstrip">','<p class="hint rtmiss">'+miss+(miss===1?' parada sin ubicar':' paradas sin ubicar')+' · toca una (línea discontinua) para marcarla en el mapa y ponerle nombre.</p><div class="rtstrip">');
};
/* en el editor, paso «Spots»: avisar de que el registro tiene más paradas */
var _stepSpots46=stepSpots;
stepSpots=function(){
  var h=_stepSpots46(),d=tripDraft,ev=(d&&d.eventos)||[];
  var names=[];ev.forEach(function(e){if(e&&(e.type==='start'||e.type==='spot')&&e.name&&!(e.who&&e.who!=='all')&&names.map(norm).indexOf(norm(e.name))<0)names.push(e.name)});
  if(names.length<2||names.length<=(d.stops||[]).length)return h;
  return '<div class="block rtedhint"><b>Tu registro tiene '+names.length+' paradas</b><p class="hint" style="margin:4px 0 0">'+esc(names.join(' → '))+'. Para ubicar cada una en el mapa y ponerle nombre, guarda y abre la salida: <b>Resumen → Mi recorrido</b>.</p></div>'+h;
};
(function(){var s=document.createElement('style');s.textContent='.rtmiss{margin:0 0 8px}.rtedhint{border-color:var(--tide)!important}.gsec .ugrid{max-height:none}';document.head.appendChild(s)})();

/* ---------- C. «Mi recorrido» (campo ruta) sobrevive a editar y guardar la salida ---------- */
var _ote46=openTripEditor;
openTripEditor=function(id,spotId){
  var r=_ote46.apply(this,arguments);
  var t=id&&trips.filter(function(x){return x.id===id})[0];
  if(tripDraft&&t&&t.ruta)tripDraft.ruta=t.ruta;
  return r;
};
var _saveTrip46=saveTrip;
saveTrip=async function(){
  var d=tripDraft,id=d&&d.id,ru=d&&d.ruta;
  var r=await _saveTrip46.apply(this,arguments);
  if(id&&ru&&Object.keys(ru).length){try{await db.doc('trips/'+id).update({ruta:ru})}catch(e){}}
  return r;
};
