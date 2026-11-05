/* ===== p47: marcar en el propio mapa dónde lanzas (arrastrar el 🎣 desde el spot) ===== */
var RTED=false,RTG=null;
var _rtNodes47=rtNodes;
rtNodes=function(t){
  var N=_rtNodes47(t),ru=t.ruta||{};
  N.forEach(function(n){var o=ru[n.key]||{};n.casts=(o.casts||[]).filter(function(c){return c&&c.lat!=null&&c.lon!=null})});
  return N;
};
async function rtSetCasts(key,casts){
  var t=TD&&trips.filter(function(x){return x.id===TD.id})[0];if(!t)return;
  var ruta=Object.assign({},t.ruta||{}),o=Object.assign({},ruta[key]||{});
  if(casts.length)o.casts=casts;else delete o.casts;
  if(Object.keys(o).length)ruta[key]=o;else delete ruta[key];
  try{await db.doc('trips/'+t.id).update({ruta:ruta,editedAt:Date.now()})}catch(e){toast('No se pudo guardar')}
}
/* guardar la parada desde la hoja no borra los lanzamientos del mapa */
rtSave=async function(){
  var E=RTE;if(!E)return;
  var sel=document.getElementById('rt-spot');if(sel&&!E.fresh)E.spotId=sel.value;
  var t=trips.filter(function(x){return x.id===E.tid})[0];if(!t)return;
  var ruta=Object.assign({},t.ruta||{}),prev=ruta[E.key]||{},o={};
  if(E.spotId)o.spotId=E.spotId;if(E.dir)o.dir=E.dir;if(E.sides.length)o.sides=E.sides;
  if(prev.casts&&prev.casts.length)o.casts=prev.casts;
  if(Object.keys(o).length)ruta[E.key]=o;else delete ruta[E.key];
  try{await db.doc('trips/'+E.tid).update({ruta:ruta,editedAt:Date.now()});toast('Parada guardada');RTE=null;closeSheet()}
  catch(e){toast('No se pudo guardar')}
};
/* tarjeta: botón para marcar lanzamientos + tira con nº de lances */
rtCard=function(t){
  var N=rtNodes(t);if(!N.length)return '';
  var located=N.filter(function(n){return n.sp}).length,miss=N.length-located;
  var strip=N.map(function(n,i){
    var bits=[];
    if(n.casts.length)bits.push('🎣 '+(n.casts.length>1?'×'+n.casts.length:'lance'));
    if(n.dir)bits.push(rtArrow(n.dir,13)+n.dir);
    if(n.sides.length)bits.push(esc(n.sides.join(' → ')));
    var cast=bits.length?'<span class="rtc">'+bits.join(' · ')+'</span>':'<span class="rtc add">'+(n.sp?'+ dónde lanzas':'+ ubicar')+'</span>';
    return (i?'<i class="rtsep" aria-hidden="true">→</i>':'')+'<button type="button" class="rtn'+(n.sp?'':' nl')+'" data-a="rt-edit" data-k="'+esc(n.key)+'"><span class="rtb">'+(i+1)+'</span><b>'+esc(n.name)+'</b>'+(n.t?'<small>'+esc(lvHM(n.t))+'</small>':'')+cast+'</button>';
  }).join('');
  var bar=located?'<div class="rtbar"><button type="button" class="btn small'+(RTED?' primary':'')+'" data-a="rt-castmode">'+(RTED?'✓ Listo':'🎣 Marcar dónde lanzo')+'</button>'+(RTED?'<small>Arrastra el 🎣 hasta donde lanzas. Toca «+» para otro lance. Toca un 🎣 para quitarlo.</small>':'')+'</div>':'';
  return '<div class="block rtcard"><h3>Mi recorrido</h3>'+bar+(located?'<div id="rtmap" class="rtmap'+(RTED?' edit':'')+'" data-trip="'+esc(t.id)+'"></div>':'<p class="hint">Toca una parada y enlázala con un spot para verla en el mapa.</p>')+
    (miss?'<p class="hint rtmiss">'+miss+(miss===1?' parada sin ubicar':' paradas sin ubicar')+' · toca una (línea discontinua) para marcarla en el mapa y ponerle nombre.</p>':'')+
    '<div class="rtstrip">'+strip+'</div></div>';
};
/* dibujo */
function rtGhost(M,n,k){
  var p=M.latLngToLayerPoint([n.sp.lat,n.sp.lon]),a=(k*2.1+0.4),r=50;
  return M.layerPointToLatLng(L.point(p.x+Math.cos(a)*r,p.y+Math.sin(a)*r));
}
rtDraw=function(M,G,N){
  G.clearLayers();
  var P=N.filter(function(n){return n.sp});
  for(var i=0;i<P.length-1;i++){
    var a=P[i].sp,b=P[i+1].sp,ll=[[a.lat,a.lon],[b.lat,b.lon]];
    L.polyline(ll,{color:'#000',weight:7,opacity:.35,interactive:false}).addTo(G);
    L.polyline(ll,{color:'#ffd166',weight:3.5,opacity:1,interactive:false}).addTo(G);
    var mid=[(a.lat+b.lat)/2,(a.lon+b.lon)/2],br=rtBearing(a,b);
    L.marker(mid,{interactive:false,keyboard:false,icon:L.divIcon({className:'',iconSize:[26,26],iconAnchor:[13,13],html:'<svg width="26" height="26" viewBox="0 0 24 24" style="transform:rotate('+br+'deg);filter:drop-shadow(0 1px 2px #000a)"><path d="M12 2l8 16-8-4-8 4z" fill="#ffd166" stroke="#1b1300" stroke-width="1.4" stroke-linejoin="round"/></svg>'})}).addTo(G);
  }
  P.forEach(function(n){
    var sll=[n.sp.lat,n.sp.lon];
    if(n.casts.length){
      n.casts.forEach(function(c,ci){
        var ln=L.polyline([sll,[c.lat,c.lon]],{color:'#fff',weight:2.5,dashArray:'2 6',lineCap:'round',interactive:false}).addTo(G);
        var mk=L.marker([c.lat,c.lon],{draggable:RTED,keyboard:false,zIndexOffset:300,icon:L.divIcon({className:'',iconSize:[30,30],iconAnchor:[15,15],html:'<span class="rtcast'+(RTED?' ed':'')+'">🎣</span>'})}).addTo(G);
        if(RTED){
          mk.on('drag',function(){ln.setLatLngs([sll,mk.getLatLng()])});
          mk.on('dragend',function(){var p=mk.getLatLng(),arr=n.casts.map(function(x){return {lat:x.lat,lon:x.lon}});arr[ci]={lat:p.lat,lon:p.lng};rtSetCasts(n.key,arr)});
          mk.on('click',function(){var arr=n.casts.map(function(x){return {lat:x.lat,lon:x.lon}});arr.splice(ci,1);rtSetCasts(n.key,arr);toast('Lance quitado')});
        }
      });
    }else if(n.dir){
      var p0=M.latLngToLayerPoint(sll),v=RTD[n.dir],e=M.layerPointToLatLng(L.point(p0.x+v[0]*46,p0.y+v[1]*46));
      L.polyline([sll,e],{color:'#fff',weight:2.5,dashArray:'2 6',lineCap:'round',interactive:false}).addTo(G);
      L.marker(e,{interactive:false,keyboard:false,icon:L.divIcon({className:'',iconSize:[22,22],iconAnchor:[11,11],html:'<span class="rtcast" title="Lanzas hacia '+n.dir+'">🎣</span>'})}).addTo(G);
    }
    if(RTED){
      var g=rtGhost(M,n,n.casts.length);
      L.marker(g,{keyboard:false,zIndexOffset:200,icon:L.divIcon({className:'',iconSize:[30,30],iconAnchor:[15,15],html:'<span class="rtghost">+</span>'})}).on('click',function(){
        var arr=n.casts.map(function(x){return {lat:x.lat,lon:x.lon}});arr.push({lat:g.lat,lon:g.lng});rtSetCasts(n.key,arr)}).addTo(G);
    }
    L.marker(sll,{keyboard:false,zIndexOffset:500,icon:L.divIcon({className:'',iconSize:[34,34],iconAnchor:[17,17],html:'<span class="rtpin">'+(n.i+1)+'</span>'})}).on('click',function(){rtOpen(n.key)}).addTo(G);
  });
};
rtInit=function(){
  var el=document.getElementById('rtmap');if(!el||el._leaflet_id||!window.L||!TD)return;
  var t=trips.filter(function(x){return x.id===TD.id})[0];if(!t)return;
  var N=rtNodes(t),P=N.filter(function(n){return n.sp});if(!P.length)return;
  try{
    var M=L.map(el,{minZoom:9,maxZoom:20,zoomSnap:.5,zoomControl:false,attributionControl:false,scrollWheelZoom:false,maxBounds:[[42.6,-4.2],[43.8,-1.8]],maxBoundsViscosity:.6});
    makePack({st:'sat',maxZoom:20}).addTo(M);
    var G=L.layerGroup().addTo(M),pts=[];
    P.forEach(function(n){pts.push([n.sp.lat,n.sp.lon]);n.casts.forEach(function(c){pts.push([c.lat,c.lon])})});
    if(pts.length===1)M.setView(pts[0],18,{animate:false});
    else M.fitBounds(L.latLngBounds(pts),{padding:[50,50],maxZoom:19,animate:false});
    rtDraw(M,G,N);M.on('zoomend',function(){rtDraw(M,G,N)});RTM=M;RTG=G;
  }catch(e){el.outerHTML='<p class="hint">No se pudo cargar el mapa.</p>'}
};
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a="rt-castmode"]'):null;if(!b)return;
  ev.stopPropagation();RTED=!RTED;renderMain();
},true);
/* al salir de la salida se apaga el modo */
document.addEventListener('click',function(ev){var b=ev.target.closest?ev.target.closest('[data-a="trip-back"],[data-a="trip-open"],[data-a="trip-tab"]'):null;if(b)RTED=false},true);
(function(){var s=document.createElement('style');s.textContent=
'.rtbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:2px 0 4px}.rtbar small{color:var(--muted);flex:1;min-width:180px;line-height:1.3}'+
'.rtmap.edit{border-color:var(--tide);box-shadow:0 0 0 2px var(--tide-soft)}'+
'.rtcast.ed{width:30px;height:30px;font-size:15px;border:2px solid var(--tide);box-shadow:0 0 0 4px rgba(255,209,102,.28),0 2px 8px #000a;cursor:grab}'+
'.rtghost{display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:50%;border:2px dashed #fff;color:#fff;background:#0007;font:700 20px/1 var(--display)}';
document.head.appendChild(s)})();
window.__RTG=function(){return RTG};
