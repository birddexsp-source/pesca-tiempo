/* ===== p45: «Mi recorrido» — mapa con flechas entre spots y hacia dónde lanzas (editable) ===== */
var RTD={N:[0,-1,0],NE:[.707,-.707,45],E:[1,0,90],SE:[.707,.707,135],S:[0,1,180],SO:[-.707,.707,225],O:[-1,0,270],NO:[-.707,-.707,315]};
var RTSIDES=['Izquierda','Centro','Derecha'];
var RTE=null,RTM=null;
function rtSpot(id){return id?spots.filter(function(s){return s.id===id})[0]||null:null}
function rtNodes(t){
  var ruta=t.ruta||{},nodes=[];
  function add(key,name,spotId,tt){
    var last=nodes[nodes.length-1];
    if(last&&norm(last.name)===norm(name)){last.keys.push(key);return}
    nodes.push({key:key,keys:[key],name:name,spotId:spotId||null,t:tt});
  }
  (t.eventos||[]).forEach(function(e){
    if(!e||(e.type!=='start'&&e.type!=='spot')||!e.name)return;
    if(e.who&&e.who!=='all')return;              /* lo que hacen los compañeros no es tu recorrido */
    add('e:'+e.t,e.name,e.spotId,e.t);
  });
  if(!nodes.length)(t.stops||[]).forEach(function(s){var sp=rtSpot(s.spotId);var nm=s.spotName||(sp&&sp.name);if(nm)add('s:'+s.id,nm,s.spotId,null)});
  nodes.forEach(function(n,i){
    var o=ruta[n.key]||{},sp=rtSpot(o.spotId)||rtSpot(n.spotId)||spots.filter(function(s){return norm(s.name)===norm(n.name)})[0]||null;
    n.i=i;n.sp=sp&&sp.lat!=null?sp:null;n.linked=o.spotId||'';n.dir=RTD[o.dir]?o.dir:null;n.sides=o.sides||[];
  });
  return nodes;
}
function rtArrow(dir,sz){return '<svg class="rtar" width="'+(sz||14)+'" height="'+(sz||14)+'" viewBox="0 0 24 24" style="transform:rotate('+RTD[dir][2]+'deg)"><path d="M12 3l6 9h-4v9h-4v-9H6z" fill="currentColor"/></svg>'}
function rtCard(t){
  var N=rtNodes(t);if(!N.length)return '';
  var located=N.filter(function(n){return n.sp}).length;
  var strip=N.map(function(n,i){
    var cast=n.dir||n.sides.length?'<span class="rtc">'+(n.dir?rtArrow(n.dir,13)+n.dir:'')+(n.sides.length?(n.dir?' · ':'')+esc(n.sides.join(' → ')):'')+'</span>':'<span class="rtc add">+ ¿hacia dónde lanzas?</span>';
    return (i?'<i class="rtsep" aria-hidden="true">→</i>':'')+'<button type="button" class="rtn'+(n.sp?'':' nl')+'" data-a="rt-edit" data-k="'+esc(n.key)+'"><span class="rtb">'+(i+1)+'</span><b>'+esc(n.name)+'</b>'+(n.t?'<small>'+esc(lvHM(n.t))+'</small>':'')+cast+'</button>';
  }).join('');
  return '<div class="block rtcard"><h3>Mi recorrido</h3>'+(located?'<div id="rtmap" class="rtmap" data-trip="'+esc(t.id)+'"></div>':'<p class="hint">Toca una parada y enlázala con un spot para verla en el mapa.</p>')+
    '<div class="rtstrip">'+strip+'</div></div>';
}
var _tdBody45=tdBody;
tdBody=function(t){
  var h=_tdBody45(t);
  if(TD&&['cap','reg','eq','fot'].indexOf(TD.tab)>-1)return h;
  return h.replace('<ol class="tl3">',rtCard(t)+'<ol class="tl3">');
};
/* ---------- mapa ---------- */
function rtBearing(a,b){var dy=b.lat-a.lat,dx=(b.lon-a.lon)*Math.cos(a.lat*Math.PI/180);return Math.atan2(dx,dy)*180/Math.PI}
function rtDraw(M,G,N){
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
    var p=M.latLngToLayerPoint([n.sp.lat,n.sp.lon]);
    if(n.dir){
      var v=RTD[n.dir],e=M.layerPointToLatLng(L.point(p.x+v[0]*46,p.y+v[1]*46));
      L.polyline([[n.sp.lat,n.sp.lon],e],{color:'#fff',weight:2.5,dashArray:'2 6',lineCap:'round',interactive:false}).addTo(G);
      L.marker(e,{interactive:false,keyboard:false,icon:L.divIcon({className:'',iconSize:[22,22],iconAnchor:[11,11],html:'<span class="rtcast" title="Lanzas hacia '+n.dir+'">🎣</span>'})}).addTo(G);
    }
    L.marker([n.sp.lat,n.sp.lon],{keyboard:false,zIndexOffset:500,icon:L.divIcon({className:'',iconSize:[34,34],iconAnchor:[17,17],html:'<span class="rtpin">'+(n.i+1)+'</span>'})}).on('click',function(){rtOpen(n.key)}).addTo(G);
  });
}
function rtInit(){
  var el=document.getElementById('rtmap');if(!el||el._leaflet_id||!window.L||!TD)return;
  var t=trips.filter(function(x){return x.id===TD.id})[0];if(!t)return;
  var N=rtNodes(t),P=N.filter(function(n){return n.sp});if(!P.length)return;
  try{
    var M=L.map(el,{minZoom:9,maxZoom:20,zoomSnap:.5,zoomControl:false,attributionControl:false,scrollWheelZoom:false,maxBounds:[[42.6,-4.2],[43.8,-1.8]],maxBoundsViscosity:.6});
    makePack({st:'sat',maxZoom:20}).addTo(M);
    var G=L.layerGroup().addTo(M);
    if(P.length===1)M.setView([P[0].sp.lat,P[0].sp.lon],17,{animate:false});
    else M.fitBounds(L.latLngBounds(P.map(function(n){return [n.sp.lat,n.sp.lon]})),{padding:[46,46],maxZoom:18,animate:false});
    rtDraw(M,G,N);M.on('zoomend',function(){rtDraw(M,G,N)});RTM=M;
  }catch(e){el.outerHTML='<p class="hint">No se pudo cargar el mapa.</p>'}
}
new MutationObserver(function(){if(document.getElementById('rtmap')&&!document.getElementById('rtmap')._leaflet_id)requestAnimationFrame(rtInit)}).observe(document.body,{childList:true,subtree:true});
/* ---------- editar una parada ---------- */
function rtOpen(key){
  var t=TD&&trips.filter(function(x){return x.id===TD.id})[0];if(!t)return;
  var n=rtNodes(t).filter(function(x){return x.key===key||x.keys.indexOf(key)>-1})[0];if(!n)return;
  RTE={tid:t.id,key:n.key,dir:n.dir,sides:n.sides.slice(),spotId:n.linked||(n.sp&&n.sp.id)||''};
  openSheet('Parada '+(n.i+1)+' · '+esc(n.name),rtBody(),'<button class="btn primary" data-a="rt-save" style="width:100%">Guardar</button>','rt');
}
function rtBody(){
  var E=RTE;if(!E)return '';
  var opts='<option value="">Sin enlazar</option>'+spots.slice().sort(function(a,b){return String(a.name).localeCompare(String(b.name))}).map(function(s){return '<option value="'+esc(s.id)+'"'+(s.id===E.spotId?' selected':'')+'>'+esc(s.name)+'</option>'}).join('');
  var rows=[['NO','N','NE'],['O','','E'],['SO','S','SE']];
  var comp='<div class="rtcomp" role="group" aria-label="Hacia dónde lanzas">'+rows.map(function(r){return r.map(function(d){
    if(!d)return '<button type="button" class="rtd mid'+(!E.dir?' on':'')+'" data-a="rt-dir" data-v="" aria-label="Sin dato">'+(E.dir?'✕':'🎣')+'</button>';
    return '<button type="button" class="rtd'+(E.dir===d?' on':'')+'" data-a="rt-dir" data-v="'+d+'" aria-pressed="'+(E.dir===d)+'">'+rtArrow(d,16)+'<small>'+d+'</small></button>'}).join('')}).join('')+'</div>';
  var sd='<div class="chips">'+RTSIDES.map(function(s){var on=E.sides.indexOf(s)>-1;return '<button type="button" class="chip'+(on?' on':'')+'" data-a="rt-side" data-v="'+s+'" aria-pressed="'+on+'">'+s+'</button>'}).join('')+'</div>';
  return '<div class="field"><label for="rt-spot">Dónde estás (spot)</label><select id="rt-spot" class="lvsel">'+opts+'</select></div>'+
    '<div class="field"><label>Hacia dónde lanzas</label>'+comp+'<p class="hint" style="text-align:center;margin:4px 0 0">Norte arriba del mapa. Toca el centro para borrarlo.</p></div>'+
    '<div class="field"><label>Lado (puedes marcar varios, en orden)</label>'+sd+'</div>';
}
function rtRepaint(){var b=document.getElementById('sheetbody');if(b)b.innerHTML=rtBody()}
async function rtSave(){
  var E=RTE;if(!E)return;
  var sel=document.getElementById('rt-spot');if(sel)E.spotId=sel.value;
  var t=trips.filter(function(x){return x.id===E.tid})[0];if(!t)return;
  var ruta=Object.assign({},t.ruta||{}),o={};
  if(E.spotId)o.spotId=E.spotId;if(E.dir)o.dir=E.dir;if(E.sides.length)o.sides=E.sides;
  if(Object.keys(o).length)ruta[E.key]=o;else delete ruta[E.key];
  try{await db.doc('trips/'+E.tid).update({ruta:ruta,editedAt:Date.now()});toast('Parada guardada');RTE=null;closeSheet()}
  catch(e){toast('No se pudo guardar')}
}
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a="rt-edit"],[data-a="rt-dir"],[data-a="rt-side"],[data-a="rt-save"]'):null;if(!b)return;
  var a=b.getAttribute('data-a'),v=b.getAttribute('data-v');
  if(a==='rt-edit'){ev.stopPropagation();rtOpen(b.getAttribute('data-k'));return}
  if(!RTE)return;
  if(a==='rt-save'){rtSave();return}
  var sel=document.getElementById('rt-spot');if(sel)RTE.spotId=sel.value;
  if(a==='rt-dir')RTE.dir=v&&RTE.dir!==v?v:null;
  else{var i=RTE.sides.indexOf(v);if(i>-1)RTE.sides.splice(i,1);else RTE.sides.push(v)}
  rtRepaint();
},true);
(function(){var s=document.createElement('style');s.textContent=
'.rtcard{padding-bottom:12px}.rtmap{height:250px;border-radius:16px;overflow:hidden;border:1px solid var(--line);margin:8px 0 12px;background:#0b1a1f}'+
'.rtpin{display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:50%;background:var(--tide);color:#2b1c00;border:2.5px solid #fff;font:800 14px var(--display);box-shadow:0 2px 8px #0008}'+
'.rtcast{display:flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:#fff;font-size:12px;box-shadow:0 1px 5px #0009}'+
'.rtstrip{display:flex;align-items:stretch;gap:6px;overflow-x:auto;scrollbar-width:none;padding:2px 2px 4px}.rtstrip::-webkit-scrollbar{display:none}'+
'.rtsep{flex:none;align-self:center;color:var(--tide);font-style:normal;font-size:20px}'+
'.rtn{flex:none;display:flex;flex-direction:column;align-items:flex-start;gap:2px;min-width:128px;max-width:190px;text-align:left;padding:10px 12px;border-radius:14px;border:1.5px solid var(--line);background:var(--surface);color:var(--text,#fff)}'+
'.rtn.nl{border-style:dashed}.rtn b{font:700 14.5px var(--display)}.rtn small{color:var(--muted);font-size:12px}'+
'.rtb{width:22px;height:22px;border-radius:50%;background:var(--tide);color:#2b1c00;display:inline-flex;align-items:center;justify-content:center;font:800 12px var(--display);margin-bottom:2px}'+
'.rtc{display:inline-flex;align-items:center;gap:4px;margin-top:4px;color:var(--accent);font:600 12px var(--display)}.rtc.add{color:var(--muted);font-weight:500}.rtar{display:inline-block}'+
'.rtcomp{display:grid;grid-template-columns:repeat(3,64px);gap:8px;justify-content:center;margin:6px 0}'+
'.rtd{height:64px;border-radius:16px;border:1.5px solid var(--line);background:var(--surface);color:var(--muted);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:18px}.rtd small{font:700 11px var(--display)}'+
'.rtd.on{border-color:var(--tide);background:var(--tide-soft);color:var(--tide)}.rtd.mid{border-radius:50%}';
document.head.appendChild(s)})();
