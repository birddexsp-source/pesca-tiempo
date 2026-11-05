/* ===== p48: Equipo de la salida (inicial + cambios con antes→después), hora y lugar en cada evento, láminas de especie ===== */
/* --- hora y lugar automáticos en cada evento nuevo --- */
var PENDC=null;
function evGps(e){
  if(!e||e.gps!==undefined||e.lat!=null)return false;
  if(userPos){e.gps={lat:userPos.lat,lon:userPos.lon,acc:Math.round(userPos.acc||0)};var n=nearestSpot(userPos.lat,userPos.lon,150);if(n&&n.s)e.near=n.s.name;return true}
  e.gps=null;return true;
}
var _lvSave48=lvSave;
lvSave=function(o){
  if(o&&o.events&&o.events.length){
    var now=Date.now(),late=[];
    o.events.forEach(function(e){
      if(e&&e.type==='eq'&&PENDC&&!e.cambios&&e.t>now-60000){e.cambios=PENDC;PENDC=null}
      if(e&&e.t>now-60000&&!e.noTime&&evGps(e)&&e.gps===null)late.push(e);
    });
    if(late.length&&navigator.geolocation)navigator.geolocation.getCurrentPosition(function(p){
      late.forEach(function(e){e.gps={lat:p.coords.latitude,lon:p.coords.longitude,acc:Math.round(p.coords.accuracy||0)};var n=nearestSpot(e.gps.lat,e.gps.lon,150);if(n&&n.s)e.near=n.s.name});
      _lvSave48({events:SESS.events});
    },function(){},{enableHighAccuracy:true,timeout:8000,maximumAge:60000});
  }
  return _lvSave48(o);
};
/* --- cambios estructurados (de → a) al guardar un cambio de equipo --- */
function cambiosCalc(L){
  var out=[],o={},n={};
  (L.used0||[]).forEach(function(u){(o[u.kind]=o[u.kind]||[]).push(u)});
  useList(L.rig).forEach(function(u){(n[u.kind]=n[u.kind]||[]).push(u)});
  Object.keys(Object.assign({},o,n)).forEach(function(k){
    var ids=function(a){return (a||[]).map(function(u){return u.id+(u.bob||'')}).sort().join()};
    if(ids(o[k])===ids(n[k]))return;
    var A=(o[k]||[]).filter(function(u){return !(n[k]||[]).some(function(v){return v.id===u.id})}),B=(n[k]||[]).filter(function(u){return !(o[k]||[]).some(function(v){return v.id===u.id})});
    var m=Math.max(A.length,B.length,1);
    for(var i=0;i<m;i++)out.push({k:k,de:A[i]?{id:A[i].id,name:A[i].name}:null,a:B[i]?{id:B[i].id,name:B[i].name}:null});
  });
  var bj=L.bajo||{};
  if((L.what||[]).indexOf('bajo')>-1&&(bj.fluoro||bj.anzuelo))out.push({k:'bajo',de:null,a:{name:[bj.fluoro?bj.fluoro+' mm':'',bj.anzuelo].filter(Boolean).join(' · ')}});
  if(L.mode!==L.mode0)out.push({k:'modo',de:L.mode0?{name:L.mode0}:null,a:L.mode?{name:L.mode}:null});
  return out;
}
var _lvEqSave48=lvEqSave;
lvEqSave=function(){var c=LE?cambiosCalc(LE):[];PENDC=c.length?c:null;var r=_lvEqSave48();return r&&r.then?r.then(function(x){PENDC=null;return x}):r};
/* --- pestaña Equipo --- */
var CBK={cana:['🎣','Caña'],carrete:['⚙️','Carrete'],corcho:['🔴','Corcho'],anzuelo:['🪝','Anzuelo'],bajo:['🧵','Bajo'],engodo:['🥣','Engodo'],modo:['🔁','Modalidad'],linea:['🧵','Línea']};
function cbThumb(x,k){
  if(!x)return '<div class="cbt cbn"><span class="ivph ivic">—</span><small>nada</small></div>';
  var it=x.id?INV.filter(function(i){return i.id===x.id})[0]:null;
  var th=it?ivThumb(it):'<span class="ivph ivic cbe">'+(CBK[k]?CBK[k][0]:'•')+'</span>';
  return '<div class="cbt">'+th+'<small>'+esc(it?invName(it):x.name||'')+'</small></div>';
}
function eqModo0(t){
  var ev=(t.eventos||[]).filter(function(e){return e.type==='eq'&&(e.cambios||[]).some(function(c){return c.k==='modo'})})[0];
  if(ev){var c=ev.cambios.filter(function(c){return c.k==='modo'})[0];if(c.de)return c.de.name}
  var s=(t.eventos||[]).filter(function(e){return e.mode})[0];return s?s.mode:(t.mode||'');
}
function eqIniHTML(t){
  var r=eqList(t)[0];if(!r)return '';
  var modo=eqModo0(t),plom=norm(modo)==='plomin',tiles=[],seen={};
  (r.used||[]).forEach(function(u){if(!CBK[u.kind]||u.kind==='engodo'||seen[u.kind])return;if(plom&&u.kind==='corcho')return;seen[u.kind]=1;tiles.push([u.kind,u])});
  if(!seen.corcho&&!plom&&(r.corchoFab||r.corchoForma||r.corchoGr))tiles.push(['corcho',{name:[r.corchoForma,r.corchoFab,r.corchoGr?r.corchoGr+' g':''].filter(Boolean).join(' · ')}]);
  if(!seen.anzuelo&&(r.anzuelo||r.anzueloNum))tiles.push(['anzuelo',{name:[r.anzuelo,r.anzueloNum?'nº '+r.anzueloNum:''].filter(Boolean).join(' ')}]);
  var ord=['cana','carrete','corcho','anzuelo','bajo'];tiles.sort(function(a,b){return ord.indexOf(a[0])-ord.indexOf(b[0])});
  return '<div class="block eqini"><h3>Equipo inicial</h3>'+(modo?'<div class="eqmodo">'+esc(modo)+'</div>':'')+
    '<div class="eqtiles">'+tiles.map(function(x){return '<div class="eqtl"><em>'+CBK[x[0]][1]+'</em>'+cbThumb(x[1],x[0])+'</div>'}).join('')+'</div></div>';
}
function eqPlaceOf(t,e){
  if(e.near)return e.near;
  var best=null;(t.eventos||[]).forEach(function(x){if((x.type==='start'||x.type==='spot')&&x.name&&!x.who&&x.t<=e.t&&(!best||x.t>=best.t))best=x});
  return best?best.name:'';
}
function eqChgHTML(t,e,i){
  var pl=eqPlaceOf(t,e),hr=e.noTime?'hora sin anotar':lvHM(e.t);
  var cs=(e.cambios||[]).map(function(c){return '<div class="cbr"><em>'+(CBK[c.k]?CBK[c.k][1]:c.k)+'</em><div class="cbp">'+cbThumb(c.de,c.k)+'<i class="cba">→</i>'+cbThumb(c.a,c.k)+'</div></div>'}).join('');
  if(!cs)cs='<p class="cbtx">'+esc(e.names||'Cambio de equipo')+'</p>';
  return '<article class="cbc"><header><b>'+(i+1)+'</b><span>'+esc(hr)+'</span>'+(pl?'<span>📍 '+esc(pl)+'</span>':'')+'</header>'+cs+
    (e.why?'<p class="cbw">'+esc(e.why)+'</p>':'')+(e.text?'<details class="trxd"><summary>Ver texto</summary><p>«'+esc(e.text)+'»</p></details>':'')+'</article>';
}
function eqTabHTML(t){
  var evs=(t.eventos||[]).filter(function(e){return e.type==='eq'}).sort(function(a,b){return a.t-b.t});
  var h=eqIniHTML(t);
  if(evs.length)h+='<div class="block"><h3>Cambios ('+evs.length+')</h3>'+evs.map(function(e,i){return eqChgHTML(t,e,i)}).join('')+'</div>';
  h+=typeof baitMixView==='function'?baitMixView(t):'';
  return h||'<p class="hint">Sin equipo anotado.</p>';
}
/* --- láminas de especie y foto de portada --- */
var _tdBody48=tdBody;
tdBody=function(t){
  if(TD&&TD.tab==='eq')return eqTabHTML(t);
  var h=_tdBody48(t);
  if(TD&&TD.tab==='cap')tdSpecies(tdMine(t)).forEach(function(s){
    if(s.photo)return;var k=keyOfName(s.name)||norm(s.name),ph=spPhotos[k];if(!ph)return;
    h=h.replace('<span class="tdp">'+esc(s.name.slice(0,1))+'</span><b>'+esc(s.name)+'</b>','<img loading="lazy" alt="" class="tdpl" src="/_blob/'+esc(ph)+'"><b>'+esc(s.name)+'</b>');
  });
  return h;
};
var _tcF48=_tcFull43;
_tcFull43=function(t,i){
  var f=_tcF48(t,i),own=null;
  tdMine(t).forEach(function(c){if(!own&&c.photos&&c.photos[0])own=c.photos[0]});
  if(own)f=f.replace(/(<img loading="lazy" alt="Foto de la pesca" src=")[^"]*(")/,'$1/_blob/'+esc(own)+'$2');
  return f;
};
(function(){var s=document.createElement('style');s.textContent=
'.eqmodo{display:inline-block;margin:2px 0 10px;padding:4px 12px;border-radius:99px;background:var(--accent,#2a7fff);color:#fff;font-weight:700;font-size:.85rem}'+
'.eqtiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}.eqtl em,.cbr em{display:block;font-style:normal;font-size:.68rem;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:4px}'+
'.cbt{display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center;min-width:0}.cbt .ivph{width:64px;height:64px;border-radius:12px;object-fit:cover;display:flex;align-items:center;justify-content:center;font-size:1.6rem}.cbt small{font-size:.72rem;line-height:1.2;color:var(--muted);word-break:break-word}'+
'.cbc{border:1px solid var(--line,#ffffff1f);border-radius:14px;padding:12px;margin:10px 0;background:var(--card,#ffffff08)}.cbc header{display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-size:.8rem;color:var(--muted);margin-bottom:8px}.cbc header b{background:var(--accent,#2a7fff);color:#fff;border-radius:50%;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center}'+
'.cbp{display:flex;align-items:center;justify-content:center;gap:12px}.cba{font-size:1.6rem;color:var(--accent,#2a7fff);font-style:normal}.cbr{margin-bottom:8px}.cbw{margin:8px 0 0;line-height:1.4}.cbtx{margin:0;font-weight:600}';
document.head.appendChild(s)})();
