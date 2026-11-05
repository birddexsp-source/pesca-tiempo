/* ===== p50: Capturas de la salida — láminas por especie, resumen por persona y detalle al tocar ===== */
function cpPlate(name){var k=keyOfName(name)||norm(name),ph=spPhotos[k];return ph?'<img loading="lazy" alt="" class="cpl" src="/_blob/'+esc(ph)+'">':'<span class="cpl cpn">'+esc(name.slice(0,1))+'</span>'}
function cpData(t){
  var P={},S={};
  catchesOfTrip(t.id).forEach(function(c){(c.items||[]).forEach(function(i){
    if(!i.species)return;var w=i.who||'',n=i.n||1;
    var p=P[w]=P[w]||{id:w,name:lvPName(w),n:0,sp:{}};p.n+=n;p.sp[i.species]=(p.sp[i.species]||0)+n;
    var s=S[norm(i.species)]=S[norm(i.species)]||{name:i.species,tot:0,w:{}};
    s.tot+=n;var o=s.w[w]=s.w[w]||{n:0,sz:{},st:{},bait:{},spot:{}};o.n+=n;
    if(i.size)o.sz[i.size]=(o.sz[i.size]||0)+n;
    var st=i.st==='lib'?'lib':i.st==='esc'?'esc':'casa';o.st[st]=(o.st[st]||0)+n;
    if(i.bait)o.bait[i.bait]=(o.bait[i.bait]||0)+n;
    var sp=i.spotId?spots.filter(function(x){return x.id===i.spotId})[0]:null;if(sp)o.spot[sp.name]=(o.spot[sp.name]||0)+n;
  })});
  var pl=Object.keys(P).map(function(k){return P[k]}).sort(function(a,b){return (a.id?1:0)-(b.id?1:0)||b.n-a.n});
  var sl=Object.keys(S).map(function(k){return S[k]}).sort(function(a,b){return ((b.w['']||{}).n||0)-((a.w['']||{}).n||0)||b.tot-a.tot});
  return {P:pl,S:sl};
}
function cpTrip(){return TD&&trips.filter(function(x){return x.id===TD.id})[0]}
function cpHTML(t){
  var D=cpData(t);if(!D.S.length)return '<p class="hint">Sin capturas anotadas.</p>';
  var people=D.P.length>1||(D.P[0]&&D.P[0].id)?'<div class="cpppl">'+D.P.map(function(p){
    return '<div class="cpp'+(p.id?'':' me')+'"><b>'+esc(p.name)+'</b><strong>'+p.n+'</strong><small>'+(p.n===1?'pez':'peces')+'</small><div class="cpm">'+Object.keys(p.sp).map(function(n){return '<span title="'+esc(n)+'">'+cpPlate(n)+'<em>×'+p.sp[n]+'</em></span>'}).join('')+'</div></div>'}).join('')+'</div>':'';
  var grid='<div class="tdsp">'+D.S.map(function(s,i){
    var me=(s.w['']||{}).n||0,oth=s.tot-me,othTxt=Object.keys(s.w).filter(function(w){return w}).map(function(w){return lvPName(w)+' '+s.w[w].n}).join(' · ');
    return '<button type="button" class="tds cps" data-a="cap-sp" data-i="'+i+'"><span class="cpa">'+cpPlate(s.name)+'</span><b>'+esc(s.name)+'</b><strong'+(me?'':' class="z"')+'>'+me+'</strong><small>'+(othTxt?esc(othTxt):(me?'tuyas':''))+'</small></button>'}).join('')+'</div>';
  var all=catchesOfTrip(t.id);
  return people+grid+'<details class="block tdall" data-lk="tdall"><summary><h3 style="display:inline">Editar o borrar capturas</h3></summary><p class="hint">Cada anotación agrupa varios peces de la salida ('+all.length+').</p>'+all.slice().sort(function(a,b){return (a.ts||0)-(b.ts||0)}).map(qcRow).join('')+'</details>';
}
function cpBars(o,k,lab){
  var ks=Object.keys(o);if(!ks.length)return '';var mx=Math.max.apply(null,ks.map(function(x){return o[x]}));
  return '<div class="cpb"><em>'+lab+'</em>'+ks.map(function(x){return '<div class="cpr"><span>'+esc((k&&k[x])||x)+'</span><i style="width:'+Math.round(o[x]/mx*100)+'%"></i><b>'+o[x]+'</b></div>'}).join('')+'</div>';
}
function cpDetail(i){
  var t=cpTrip();if(!t)return;var D=cpData(t),s=D.S[i];if(!s)return;
  var h='<div class="cphead"><span class="cpa big">'+cpPlate(s.name)+'</span><div><strong>'+s.tot+'</strong> '+(s.tot===1?'pez':'peces')+' en la salida</div></div>';
  Object.keys(s.w).sort(function(a,b){return (a?1:0)-(b?1:0)}).forEach(function(w){
    var o=s.w[w];
    h+='<div class="cpwho"><h4>'+esc(lvPName(w))+' <span>'+o.n+'</span></h4>'+cpBars(o.sz,{S:'S · pequeño',M:'M · mediano',L:'L · grande'},'Tallas')+cpBars(o.st,STATUS,'Destino')+cpBars(o.bait,null,'Carnada')+cpBars(o.spot,null,'Spot')+'</div>';
  });
  openSheet(esc(s.name),h);
}
var _tdBody50=tdBody;
tdBody=function(t){return TD&&TD.tab==='cap'?cpHTML(t):_tdBody50(t)};
document.addEventListener('click',function(ev){var b=ev.target.closest?ev.target.closest('[data-a="cap-sp"]'):null;if(!b)return;ev.stopPropagation();cpDetail(+b.getAttribute('data-i'))},true);
/* la pestaña cuenta peces, no anotaciones */
var _tdView50=tdView;
tdView=function(t){
  var h=_tdView50(t),n=cpData(t).S.reduce(function(a,s){return a+s.tot},0);
  return h.replace(/(data-v="cap"[^>]*>Capturas <small>)\d+/,'$1'+n);
};
(function(){var s=document.createElement('style');s.textContent=
'.cps{cursor:pointer;text-align:left;color:inherit;font:inherit;padding:0;position:relative}.cpa{display:block;width:100%;height:96px;background:var(--accent-soft);overflow:hidden}.cpa .cpl{width:100%;height:100%;object-fit:contain;display:block}.cpa.big{width:120px;height:90px;border-radius:14px;flex:none}'+
'.cpl.cpn{display:flex;align-items:center;justify-content:center;font:700 34px var(--display);color:var(--accent)}.cps .z{opacity:.4}.cps small{display:block;padding:0 12px 10px;color:var(--muted)}'+
'.cpppl{display:flex;gap:10px;overflow-x:auto;margin:0 0 12px;padding-bottom:2px}.cpp{flex:0 0 auto;min-width:150px;border:1px solid var(--line,#ffffff1f);border-radius:14px;padding:10px 12px;background:var(--card,#ffffff08)}.cpp.me{border-color:var(--tide)}.cpp b{display:block}.cpp strong{font-size:1.6rem;margin-right:4px}.cpp small{color:var(--muted)}'+
'.cpm{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.cpm span{display:flex;align-items:center;gap:2px;font-size:.75rem}.cpm .cpl{width:34px;height:24px;object-fit:contain;border-radius:6px;background:var(--accent-soft)}.cpm .cpn{font-size:14px}'+
'.cphead{display:flex;align-items:center;gap:14px;margin-bottom:12px}.cphead strong{font-size:2rem}.cpwho{border-top:1px solid var(--line,#ffffff1f);padding:12px 0}.cpwho h4{margin:0 0 8px;display:flex;justify-content:space-between}.cpwho h4 span{color:var(--tide)}'+
'.cpb{margin:8px 0}.cpb em{display:block;font-style:normal;font-size:.68rem;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:4px}.cpr{position:relative;display:flex;align-items:center;justify-content:space-between;padding:5px 8px;margin:3px 0;border-radius:8px;overflow:hidden;font-size:.85rem}.cpr i{position:absolute;left:0;top:0;bottom:0;background:var(--tide-soft,#3dd6c433);z-index:0}.cpr span,.cpr b{position:relative;z-index:1}';
document.head.appendChild(s)})();
/* si la salida abierta desaparece un instante (datos que se están cargando), no se vuelve a la lista de golpe */
var _rs50=renderSalidas;
renderSalidas=function(){
  if(TD){
    if(!trips.some(function(x){return x.id===TD.id})){
      if(!TD.miss)TD.miss=Date.now();
      if(Date.now()-TD.miss<5000){setTimeout(function(){if(TD&&TD.miss&&!trips.some(function(x){return x.id===TD.id}))renderMain()},1200);return '<p class="hint">Cargando salida…</p>'}
    }else TD.miss=0;
  }
  return _rs50();
};
