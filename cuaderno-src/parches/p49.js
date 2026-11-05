/* ===== p49: pintar con el dedo/ratón la zona donde lanzas (área por spot); al tocar un spot se ve su zona ===== */
var RTSEL=null,RTSTRIP=false,RTVIEW=null;
var _rtNodes49=rtNodes;
rtNodes=function(t){
  var N=_rtNodes49(t),ru=t.ruta||{};
  N.forEach(function(n){n.areas=((ru[n.key]||{}).areas||[]).filter(function(a){return a&&a.length>=3})});
  return N;
};
async function rtSetAreas(tid,key,areas){
  var t=trips.filter(function(x){return x.id===tid})[0];if(!t)return;
  var ruta=Object.assign({},t.ruta||{}),o=Object.assign({},ruta[key]||{});
  if(areas.length)o.areas=areas;else delete o.areas;
  if(Object.keys(o).length)ruta[key]=o;else delete ruta[key];
  try{await db.doc('trips/'+tid).update({ruta:ruta,editedAt:Date.now()})}catch(e){toast('No se pudo guardar')}
}
var _rtSave49=rtSave;
rtSave=async function(){
  var E=RTE,ar=null;
  if(E){var t=trips.filter(function(x){return x.id===E.tid})[0];ar=t&&t.ruta&&t.ruta[E.key]&&t.ruta[E.key].areas}
  await _rtSave49();
  if(E&&ar&&ar.length)await rtSetAreas(E.tid,E.key,ar);
};
/* tocar el pin en el mapa = ver su zona; tocar la tira = editar la parada */
var _rtOpen49=rtOpen;
rtOpen=function(k){
  var ev=window.event,tg=ev&&ev.target&&ev.target.closest?ev.target.closest('[data-a="rt-edit"]'):null;
  if(tg||RTSTRIP||!RTM||!RTG||!document.getElementById('rtmap')){RTSTRIP=false;return _rtOpen49(k)}
  RTSEL=RTSEL===k?null:k;
  var t=TD&&trips.filter(function(x){return x.id===TD.id})[0];
  if(RTM&&RTG&&t){rtDraw(RTM,RTG,rtNodes(t));rtBarSync()}
};
document.addEventListener('click',function(ev){var b=ev.target.closest?ev.target.closest('[data-a="rt-edit"]'):null;if(b){RTSTRIP=true;setTimeout(function(){RTSTRIP=false},0)}},true);
/* tarjeta */
function rtBarHTML(N){
  var P=N.filter(function(n){return n.sp});if(!P.length)return '';
  if(!RTED)return '<div class="rtbar"><button type="button" class="btn small" data-a="rt-castmode">🖌️ Pintar dónde lanzo</button><small>Toca un spot del mapa para ver su zona.</small></div>';
  var sel=P.filter(function(n){return n.key===RTSEL})[0]||P[0];RTSEL=sel.key;
  return '<div class="rtbar paint"><div class="rtpt"><b>1.</b> Elige el spot · <b>2.</b> Dibuja con el dedo (o el ratón) la zona donde lanzas. Al soltar se guarda.</div>'+
    '<div class="rtsel">'+P.map(function(n){return '<button type="button" class="rtn'+(n.key===RTSEL?' on':'')+'" data-a="rt-sel" data-k="'+esc(n.key)+'"><span class="rtb">'+(n.i+1)+'</span><b>'+esc(n.name)+'</b></button>'}).join('')+'</div>'+
    '<div class="rtact">'+(sel.areas.length?'<button type="button" class="btn small ghost" data-a="rt-undo">↶ Quitar última zona</button><button type="button" class="btn small ghost" data-a="rt-clear">Borrar zonas</button>':'')+'<button type="button" class="btn small primary" data-a="rt-castmode">✓ Listo</button></div></div>';
}
function rtBarSync(){
  var t=TD&&trips.filter(function(x){return x.id===TD.id})[0],b=document.querySelector('.rtbar');if(!t||!b)return;
  var tmp=document.createElement('div');tmp.innerHTML=rtBarHTML(rtNodes(t));if(tmp.firstChild)b.parentNode.replaceChild(tmp.firstChild,b);
}
rtCard=function(t){
  var N=rtNodes(t);if(!N.length)return '';
  var located=N.filter(function(n){return n.sp}).length,miss=N.length-located;
  var strip=N.map(function(n,i){
    var bits=[];
    if(n.areas.length)bits.push('🖌️ zona');
    if(n.casts.length)bits.push('🎣 '+(n.casts.length>1?'×'+n.casts.length:'lance'));
    if(n.dir)bits.push(rtArrow(n.dir,13)+n.dir);
    if(n.sides.length)bits.push(esc(n.sides.join(' → ')));
    var cast=bits.length?'<span class="rtc">'+bits.join(' · ')+'</span>':'<span class="rtc add">'+(n.sp?'+ dónde lanzas':'+ ubicar')+'</span>';
    return (i?'<i class="rtsep" aria-hidden="true">→</i>':'')+'<button type="button" class="rtn'+(n.sp?'':' nl')+'" data-a="rt-edit" data-k="'+esc(n.key)+'"><span class="rtb">'+(i+1)+'</span><b>'+esc(n.name)+'</b>'+(n.t?'<small>'+esc(lvHM(n.t))+'</small>':'')+cast+'</button>';
  }).join('');
  return '<div class="block rtcard"><h3>Mi recorrido</h3>'+rtBarHTML(N)+(located?'<div id="rtmap" class="rtmap'+(RTED?' edit':'')+'" data-trip="'+esc(t.id)+'"></div>':'<p class="hint">Toca una parada y enlázala con un spot para verla en el mapa.</p>')+
    (miss?'<p class="hint rtmiss">'+miss+(miss===1?' parada sin ubicar':' paradas sin ubicar')+' · toca una (línea discontinua) para marcarla en el mapa y ponerle nombre.</p>':'')+
    '<div class="rtstrip">'+strip+'</div></div>';
};
/* dibujo: zonas pintadas (la del spot elegido resalta; sin elegir, todas suaves) */
var _rtDraw49=rtDraw;
rtDraw=function(M,G,N){
  var s=RTED;RTED=false;try{_rtDraw49(M,G,N)}finally{RTED=s}
  N.forEach(function(n){
    if(!n.areas||!n.areas.length)return;
    var on=n.key===RTSEL;if(RTSEL&&!on)return;
    n.areas.forEach(function(a){
      L.polygon(a.map(function(p){return [p.lat,p.lon]}),{color:on?'#ffd166':'#5eead4',weight:on?2.5:1.5,fillColor:on?'#ffd166':'#5eead4',fillOpacity:on?.38:.18,interactive:false,className:'rtarea'}).addTo(G);
    });
  });
};
/* pintar */
function rtPoly(pts,M){
  var P=pts.map(function(p){return M.latLngToLayerPoint(p)}),T=[],last=null;
  P.forEach(function(p){if(!last||last.distanceTo(p)>=9){T.push(p);last=p}});
  var span=0;T.forEach(function(a){T.forEach(function(b){span=Math.max(span,a.distanceTo(b))})});
  if(T.length<3||span<24){ /* un toque o un trazo mínimo: círculo de ~7 m */
    var c=pts[Math.floor(pts.length/2)],dLat=7/111320,dLon=7/(111320*Math.cos(c.lat*Math.PI/180)),out=[];
    for(var i=0;i<16;i++){var a=i/16*2*Math.PI;out.push({lat:c.lat+Math.sin(a)*dLat,lon:c.lng+Math.cos(a)*dLon})}
    return out;
  }
  var S=T; /* suavizado (Chaikin) para que no quede dentado */
  for(var r=0;r<2;r++){var n=[];for(var j=0;j<S.length;j++){var a=S[j],b=S[(j+1)%S.length];n.push(L.point(a.x*.75+b.x*.25,a.y*.75+b.y*.25),L.point(a.x*.25+b.x*.75,a.y*.25+b.y*.75))}S=n}
  return S.map(function(p){var ll=M.layerPointToLatLng(p);return {lat:+ll.lat.toFixed(7),lon:+ll.lng.toFixed(7)}});
}
function rtPaintBind(el){
  if(!RTM||el._pb)return;el._pb=1;
  var pts=null,live=null;
  var add=function(e){pts.push(RTM.mouseEventToLatLng(e));live.setLatLngs(pts)};
  el.addEventListener('pointerdown',function(e){
    if(!RTED||!RTSEL||(e.button&&e.button!==0))return;
    pts=[];live=L.polyline([],{color:'#ffd166',weight:4,opacity:.95,interactive:false}).addTo(RTM);
    try{el.setPointerCapture(e.pointerId)}catch(_){}
    add(e);e.preventDefault();e.stopPropagation();
  },true);
  el.addEventListener('pointermove',function(e){if(pts){add(e);e.preventDefault()}},true);
  var end=function(e){
    if(!pts)return;var P=pts;pts=null;RTM.removeLayer(live);live=null;
    if(!P.length)return;
    var t=TD&&trips.filter(function(x){return x.id===TD.id})[0];if(!t)return;
    var poly=rtPoly(P,RTM),n=rtNodes(t).filter(function(x){return x.key===RTSEL})[0];if(!n)return;
    var v=RTM.getCenter();RTVIEW={tid:t.id,c:[v.lat,v.lng],z:RTM.getZoom()};
    rtSetAreas(t.id,n.key,n.areas.concat([poly]));toast('Zona guardada');
  };
  el.addEventListener('pointerup',end,true);el.addEventListener('pointercancel',end,true);
}
var _rtInit49=rtInit;
rtInit=function(){
  _rtInit49();
  var el=document.getElementById('rtmap');if(!el||!RTM||!TD)return;
  if(RTVIEW&&RTVIEW.tid===TD.id&&RTED)RTM.setView(RTVIEW.c,RTVIEW.z,{animate:false});
  if(RTED){RTM.dragging.disable();el.style.touchAction='none'}
  rtPaintBind(el);
};
/* botones */
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a="rt-sel"],[data-a="rt-undo"],[data-a="rt-clear"]'):null;if(!b)return;
  ev.stopPropagation();var a=b.getAttribute('data-a'),t=TD&&trips.filter(function(x){return x.id===TD.id})[0];if(!t)return;
  if(a==='rt-sel'){RTSEL=b.getAttribute('data-k');rtDraw(RTM,RTG,rtNodes(t));rtBarSync();return}
  var n=rtNodes(t).filter(function(x){return x.key===RTSEL})[0];if(!n)return;
  rtSetAreas(t.id,n.key,a==='rt-undo'?n.areas.slice(0,-1):[]);
},true);
document.addEventListener('click',function(ev){var b=ev.target.closest?ev.target.closest('[data-a="rt-castmode"]'):null;if(b&&RTED===false)RTVIEW=null},true);
document.addEventListener('click',function(ev){var b=ev.target.closest?ev.target.closest('[data-a="trip-back"],[data-a="trip-open"]'):null;if(b){RTSEL=null;RTVIEW=null}},true);
(function(){var s=document.createElement('style');s.textContent=
'.rtbar.paint{flex-direction:column;align-items:stretch;gap:8px}.rtpt{font-size:.85rem;line-height:1.35;color:var(--muted)}.rtpt b{color:var(--tide)}'+
'.rtsel{display:flex;gap:8px;overflow-x:auto;padding-bottom:2px}.rtsel .rtn{flex:0 0 auto;flex-direction:row;display:flex;align-items:center;gap:6px;padding:6px 10px;min-width:0}.rtsel .rtn.on{border-color:var(--tide);box-shadow:0 0 0 2px var(--tide-soft)}'+
'.rtact{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.rtmap.edit{cursor:crosshair}';
document.head.appendChild(s)})();
