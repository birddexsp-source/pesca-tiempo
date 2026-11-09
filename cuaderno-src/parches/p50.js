/* ===== p50: Capturas de la salida — láminas por especie, resumen por persona y detalle al tocar ===== */
function cpPlate(name){var k=keyOfName(name)||norm(name),ph=spPhotos[k];return ph?'<img loading="lazy" alt="" class="cpl" data-blob="'+esc(ph)+'" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">':'<span class="cpl cpn">'+esc(name.slice(0,1))+'</span>'}
function cpData(t,cl){
  var P={},S={};
  (cl||catchesOfTrip(t.id)).forEach(function(c){(c.items||[]).forEach(function(i,ix){
    if(!i.species)return;var w=i.who||'',n=i.n||1;
    var p=P[w]=P[w]||{id:w,name:lvPName(w),n:0,sp:{}};p.n+=n;p.sp[i.species]=(p.sp[i.species]||0)+n;
    var s=S[norm(i.species)]=S[norm(i.species)]||{name:i.species,tot:0,w:{}};
    s.tot+=n;var o=s.w[w]=s.w[w]||{n:0,sz:{},st:{},bait:{},spot:{},list:[]};o.n+=n;o.list.push({cid:c.id,ix:ix,size:i.size,st:i.st,bait:i.bait,n:n,sp:i.spotId||'',site:c.siteId||''});
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
  return people+grid;
}
function cpBars(o,k,lab){
  var ks=Object.keys(o);if(!ks.length)return '';var mx=Math.max.apply(null,ks.map(function(x){return o[x]}));
  return '<div class="cpb"><em>'+lab+'</em>'+ks.map(function(x){return '<div class="cpr"><span>'+esc((k&&k[x])||x)+'</span><i style="width:'+Math.round(o[x]/mx*100)+'%"></i><b>'+o[x]+'</b></div>'}).join('')+'</div>';
}
function cpSpotOpts(site,cur){
  var L=spots.filter(function(x){return !site||x.siteId===site}).sort(function(a,b){return String(a.name).localeCompare(String(b.name))});
  return '<option value="">Sin spot</option>'+L.map(function(x){return '<option value="'+esc(x.id)+'"'+(x.id===cur?' selected':'')+'>'+esc(x.name)+'</option>'}).join('');
}
function cpFish(o,si,spName,who){
  var ST={casa:'a casa',lib:'liberado',esc:'escapado'},site=(o.list[0]||{}).site||'';
  var bulk=spots.length?'<label class="cpmv">Mover las '+o.n+' a: <select data-a="cap-mv" data-who="'+esc(who)+'" data-sp="'+esc(spName)+'" data-si="'+si+'">'+cpSpotOpts(site,'')+'</select></label>':'';
  return bulk+'<details class="cpb cpone"><summary>Uno a uno ('+o.list.length+')</summary>'+o.list.map(function(f){
    var sp=spots.filter(function(x){return x.id===f.sp})[0];
    return '<div class="cpf"><span>'+(f.n>1?f.n+' × ':'')+(f.size?esc(f.size)+' · ':'')+esc(ST[f.st]||'a casa')+(f.bait?' · '+esc(f.bait):'')+'</span>'+
      '<select class="cpsel" data-a="cap-mvf" data-cid="'+esc(f.cid)+'" data-ix="'+f.ix+'" aria-label="Spot de este pez">'+cpSpotOpts(f.site,f.sp)+'</select>'+
      '<button type="button" class="cpx" aria-label="Quitar este pez" data-a="cap-del" data-cid="'+esc(f.cid)+'" data-ix="'+f.ix+'" data-si="'+si+'">✕</button></div>'}).join('')+'</details>';
}
function cpDetail(i,cl){
  window.__cpcl=cl||null;var t=cpTrip();if(!t&&!cl)return;var D=cpData(t,cl),s=D.S[i];if(!s)return;
  var h='<div class="cphead"><span class="cpa big">'+cpPlate(s.name)+'</span><div><strong>'+s.tot+'</strong> '+(s.tot===1?'pez':'peces')+' en la salida</div></div>';
  Object.keys(s.w).sort(function(a,b){return (a?1:0)-(b?1:0)}).forEach(function(w){
    var o=s.w[w];
    h+='<div class="cpwho"><h4>'+esc(lvPName(w))+' <span>'+o.n+'</span></h4>'+cpBars(o.sz,{S:'S · pequeño',M:'M · mediano',L:'L · grande'},'Tallas')+cpBars(o.st,STATUS,'Destino')+cpBars(o.bait,null,'Carnada')+cpBars(o.spot,null,'Spot')+cpFish(o,i,s.name,w)+'</div>';
  });
  openSheet(esc(s.name),h);
}
async function cpDel(cid,ix,si){
  var c=catches.filter(function(x){return x.id===cid})[0];if(!c||!c.items||!c.items[ix])return;
  var it=c.items[ix];
  if(!confirm('¿Quitar '+(it.n>1?it.n+' ':'este ')+it.species+(it.size?' '+it.size:'')+'? Solo se borra este pez.'))return;
  var items=c.items.filter(function(_,k){return k!==ix});
  try{
    if(items.length)await db.doc('catches/'+cid).update({items:items,editedAt:Date.now()});
    else await db.doc('catches/'+cid).delete();
    toast('Pez quitado');closeSheet();
  }catch(e){toast('No se pudo quitar')}
}
var _tdBody50=tdBody;
tdBody=function(t){return TD&&TD.tab==='cap'?cpHTML(t):_tdBody50(t)};
document.addEventListener('click',function(ev){var d=ev.target.closest?ev.target.closest('[data-a="cap-del"]'):null;if(d){ev.stopPropagation();cpDel(d.getAttribute('data-cid'),+d.getAttribute('data-ix'));return}var b=ev.target.closest?ev.target.closest('[data-a="cap-sp"]'):null;if(!b)return;ev.stopPropagation();
  var cid=b.getAttribute('data-cid');
  if(cid){var c=catches.filter(function(x){return x.id===cid})[0];if(!c)return;var cl=c.tripId?catchesOfTrip(c.tripId):[c],S=cpData(null,cl).S,nm=norm(b.getAttribute('data-name')),ix=-1;S.forEach(function(x,k){if(norm(x.name)===nm)ix=k});if(ix>-1)cpDetail(ix,cl);return}
  cpDetail(+b.getAttribute('data-i'))},true);
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
'.cpb{margin:8px 0}.cpb em{display:block;font-style:normal;font-size:.68rem;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:4px}.cpr{position:relative;display:flex;align-items:center;justify-content:space-between;padding:5px 8px;margin:3px 0;border-radius:8px;overflow:hidden;font-size:.85rem}.cpr i{position:absolute;left:0;top:0;bottom:0;background:var(--tide-soft,#3dd6c433);z-index:0}.cpf{display:flex;justify-content:space-between;align-items:center;padding:4px 8px;margin:3px 0;border-radius:8px;background:var(--card,#ffffff08);font-size:.85rem}.cpx{border:0;background:none;color:var(--muted);font-size:1.1rem;padding:6px 10px;cursor:pointer}.cpr span,.cpr b{position:relative;z-index:1}';
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

/* mover peces de spot (todos los de una especie/persona, o uno solo) */
async function cpSetSpot(items){
  var by={};items.forEach(function(x){(by[x.cid]=by[x.cid]||[]).push(x)});
  try{
    for(var cid in by){
      var c=catches.filter(function(k){return k.id===cid})[0];if(!c)continue;
      var its=c.items.map(function(i){return Object.assign({},i)});
      by[cid].forEach(function(x){if(its[x.ix]){if(x.sp)its[x.ix].spotId=x.sp;else delete its[x.ix].spotId}});
      await db.doc('catches/'+cid).update({items:its,editedAt:Date.now()});
    }
    toast('Spot actualizado');closeSheet();
  }catch(e){toast('No se pudo guardar')}
}
document.addEventListener('change',function(ev){
  var el=ev.target;if(!el||!el.getAttribute)return;var a=el.getAttribute('data-a');
  if(a==='cap-mvf'){ev.stopPropagation();cpSetSpot([{cid:el.getAttribute('data-cid'),ix:+el.getAttribute('data-ix'),sp:el.value}]);return}
  if(a==='cap-mv'&&el.value!==''){
    ev.stopPropagation();var t=cpTrip(),cl=window.__cpcl||null,D=(t||cl)?cpData(t,cl):null;if(!D)return;var S=D.S[+el.getAttribute('data-si')];if(!S)return;var o=S.w[el.getAttribute('data-who')];if(!o)return;
    cpSetSpot(o.list.map(function(f){return {cid:f.cid,ix:f.ix,sp:el.value}}));
  }
},true);
