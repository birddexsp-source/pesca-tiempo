/* ===== p53: Capturas — resumen visual por spot (lámina + cantidad), spot real de cada pez; detalle al tocar ===== */
itemSpotName=function(c,i){
  var sp=i.spotId&&spots.filter(function(x){return x.id===i.spotId})[0];if(sp)return sp.name;
  var tr=c.tripId&&trips.filter(function(t){return t.id===c.tripId})[0],st=tr&&(tr.stops||[]).filter(function(s){return String(s.id)===String(i.stopId)})[0];
  if(st&&st.spotName)return st.spotName;
  return c.spotName||'';
};
capCard=function(c){
  var p=dparts(c.date),tr=c.tripId&&trips.filter(function(t){return t.id===c.tripId})[0],title=c.siteName||(tr&&tr.siteName)||c.spotName||'Captura suelta';
  var G={},order=[],mine=(c.items||[]).filter(function(i){return !i.who&&i.species}),oth={};
  mine.forEach(function(i){var n=itemSpotName(c,i)||'Sin spot';if(!G[n]){G[n]={};order.push(n)}G[n][i.species]=(G[n][i.species]||0)+(i.n||1)});
  (c.items||[]).forEach(function(i){if(i.who)oth[i.who]=(oth[i.who]||0)+(i.n||1)});
  var fish=mine.reduce(function(a,i){return a+(i.n||1)},0),photo=c.photos&&c.photos[0];
  var rows=order.map(function(n){
    var ks=Object.keys(G[n]).sort(function(a,b){return G[n][b]-G[n][a]});
    return '<div class="cgrp">'+(order.length>1||n!=='Sin spot'?'<span class="spn">'+esc(n)+'</span>':'')+'<div class="cpchips">'+ks.map(function(k){
      return '<button type="button" class="cpchip" data-a="cap-sp" data-cid="'+esc(c.id)+'" data-name="'+esc(k)+'"><span class="cpa">'+cpPlate(k)+'</span><b>'+esc(k)+'</b><strong>×'+G[n][k]+'</strong></button>'}).join('')+'</div></div>'}).join('');
  var ot=Object.keys(oth).map(function(w){return esc(lvPName(w))+' '+oth[w]}).join(' · ');
  return '<article class="ccard">'+(photo?'<div class="cph"><img loading="lazy" alt="Foto de la pesca" data-blob="'+esc(photo)+'" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">'+(c.photos.length>1?'<span>+'+(c.photos.length-1)+'</span>':'')+'</div>':'')+
    '<div class="cbd"><div class="chd"><div class="dchip sm"><b>'+p.d+'</b><span>'+esc(p.m)+'</span></div><div class="ctt"><h3>'+esc(title)+'</h3><p>'+esc(longDate(c.date))+(tr&&tr.mode?' · '+esc(tr.mode):'')+'</p></div><div class="cfish"><b>'+fish+'</b><small>'+(fish===1?'pez':'peces')+'</small></div></div>'+
    rows+(ot?'<p class="cpoth">Compañeros: '+ot+'</p>':'')+(c.notes?'<p class="note">'+esc(c.notes)+'</p>':'')+
    '<p class="hint cptap">Toca una especie para ver tallas y detalle.</p>'+
    '<div class="ft"><button class="btn small" data-a="edit-cap" data-id="'+esc(c.id)+'">Editar</button><button class="btn small danger" data-a="del-cap" data-id="'+esc(c.id)+'">Borrar</button></div></div></article>';
};
(function(){var s=document.createElement('style');s.textContent=
'.cpchips{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0 10px}.cpchip{display:flex;align-items:center;gap:6px;border:1px solid var(--line,#ffffff1f);background:var(--card,#ffffff08);color:inherit;font:inherit;border-radius:12px;padding:4px 10px 4px 4px;cursor:pointer}'+
'.cpchip .cpa{width:44px;height:32px;border-radius:8px;flex:none}.cpchip strong{color:var(--accent,#f2b84b)}.cpoth{margin:6px 0;color:var(--muted);font-size:.85rem}.cptap{margin:4px 0 8px;font-size:.75rem}';
document.head.appendChild(s)})();
