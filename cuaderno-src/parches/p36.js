/* ===== p36: terminar la salida = guardada al instante + "Siguiente" a prueba de fallos ===== */

/* Al terminar, la salida se guarda sola con todo lo que hay (capturas, equipos, registro, compañeros).
   Así no se pierde nada aunque recargues, y lo que falte se completa en casa con «Editar». */
var _sf36=sessFinish;
sessFinish=function(){
  _sf36();
  var d=tripDraft;if(!d||!d.fromSess)return;
  if(!d.siteId&&!(d.siteName||'').trim()){toast('Salida terminada. Elige el sitio y guarda.');return}
  setTimeout(lvAutoSave,60);
};
async function lvAutoSave(){
  var d=tripDraft;if(!d||!d.fromSess)return;
  var n=d.items.reduce(function(a,i){return a+(i.n||0)},0);
  await saveTrip();
  if(tripDraft){return}          // no se pudo guardar: se queda el editor abierto para guardar a mano
  toast('Salida guardada ✓ ('+n+(n===1?' captura':' capturas')+'). Complétala en casa: Salidas → Editar.');
}

/* «Siguiente» nunca se queda mudo: si un paso falla, pasa a un resumen simple con «Guardar salida» */
window.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a="next-step"]'):null;if(!b||!tripDraft)return;
  ev.stopImmediatePropagation();ev.preventDefault();
  try{if(stepValid()){tripDraft.step++;renderStep()}}
  catch(e){
    try{console.warn('next-step',e)}catch(_){}
    var d=tripDraft,el=$('#stp'),f=$('#stpf');if(!d||!el||!f)return;
    d.step=3;var tot=(d.items||[]).reduce(function(a,i){return a+(i.n||0)},0);
    el.innerHTML=stepper()+'<div class="block"><h3>'+esc(d.siteName||'Salida')+'</h3><p class="hint">'+tot+' captura'+(tot===1?'':'s')+'. Completa lo que quieras en casa.</p><div class="field"><label for="tr-notes">Notas</label><textarea id="tr-notes" data-bind="notes">'+esc(d.notes||'')+'</textarea></div></div>';
    f.innerHTML='<button class="btn" data-a="prev-step">Atrás</button><button class="btn primary" data-a="save-trip" id="tr-save">Guardar salida</button>';
    toast('Te dejo guardar la salida igualmente');
  }
},true);
