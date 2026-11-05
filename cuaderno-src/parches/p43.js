/* ===== p43: Salidas más visual — tarjeta compacta y detalle con pestañas horizontales ===== */
var TD=null;   /* {id,tab} salida abierta */
var TDTABS=[['res','Resumen'],['cap','Capturas'],['reg','Registro'],['eq','Equipo'],['fot','Fotos']];
function tdMine(t){return mineCatches(catches.filter(function(c){return c.tripId===t.id}))}
function tdSpecies(list){
  var sp={};
  list.forEach(function(c){(c.items||[]).forEach(function(i){if(!i.species||i.who)return;var k=norm(i.species),o=sp[k]=sp[k]||{name:i.species,n:0,casa:0,lib:0,esc:0,photo:null};var n=i.n||1;o.n+=n;o[i.st==='lib'?'lib':i.st==='esc'?'esc':'casa']+=n;if(!o.photo&&c.photos&&c.photos[0])o.photo=c.photos[0]})});
  return Object.keys(sp).map(function(k){return sp[k]}).sort(function(a,b){return b.n-a.n});
}
function tdPhotos(t){
  var out=[];catchesOfTrip(t.id).forEach(function(c){(c.photos||[]).forEach(function(p){out.push(p)})});
  legs.filter(function(l){return l.tripId===t.id}).forEach(function(l){(l.photos||[]).forEach(function(p){if(out.indexOf(p)<0)out.push(p)})});
  return out;
}
var _tcFull43=tripCard;
function tdHero(t){
  var f=_tcFull43(t,0),a=f.indexOf('<div class="hero'),b=f.indexOf('<div class="tb">');
  return a<0||b<0?'':f.slice(a,b);
}
/* tarjeta compacta de la lista */
tripCard=function(t,idx){
  var f=_tcFull43(t,idx),a=f.indexOf('<div class="hero'),b=f.indexOf('<div class="tb">');
  var hero=a<0||b<0?'':f.slice(a,b);
  var cs=tdMine(t),sp=tdSpecies(cs),ls=legs.filter(function(l){return l.tripId===t.id});
  var mins=ls.reduce(function(s,l){var x=hm(l.tFrom),y=hm(l.tTo);return x!=null&&y!=null&&y>x?s+y-x:s},0);
  var spn=ls.map(function(l){return l.spotId||l.spotName}).filter(function(v,k,r){return v&&r.indexOf(v)===k}).length;
  var chips=[];
  if(sp.length)chips.push('<span><b>'+sp.length+'</b> '+(sp.length===1?'especie':'especies')+'</span>');
  if(spn)chips.push('<span><b>'+spn+'</b> '+(spn===1?'spot':'spots')+'</span>');
  if(mins)chips.push('<span><b>'+(mins<60?mins+' min':Math.floor(mins/60)+' h'+(mins%60?' '+mins%60:''))+'</b></span>');
  var top=sp.slice(0,3).map(function(s){return '<em>'+esc(s.name)+(s.n>1?' ×'+s.n:'')+'</em>'}).join('')+(sp.length>3?'<em class="mas">+'+(sp.length-3)+'</em>':'');
  var fresh=!seenTrips[t.id];seenTrips[t.id]=1;
  return '<article class="trip tcc'+(fresh?' rise':'')+'" style="animation-delay:'+Math.min(idx,6)*60+'ms"><div role="button" tabindex="0" class="tcopen" data-a="trip-open" data-id="'+esc(t.id)+'" aria-label="Abrir salida">'+hero+'</div>'+
    '<div class="tcb" data-a="trip-open" data-id="'+esc(t.id)+'">'+(chips.length?'<div class="tcs">'+chips.join('')+'</div>':'')+(top?'<div class="tct">'+top+'</div>':'')+'<i class="tcg" aria-hidden="true">›</i></div></article>';
};
/* detalle con pestañas */
function tdBody(t){
  var tab=TD.tab;
  if(tab==='cap'){
    var cs=tdMine(t),sp=tdSpecies(cs),all=catchesOfTrip(t.id),others=all.filter(function(c){return (c.items||[]).some(function(i){return i.who})});
    var h=sp.length?'<div class="tdsp">'+sp.map(function(s){return '<div class="tds">'+(s.photo?'<img loading="lazy" alt="" data-blob="'+esc(s.photo)+'" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">':'<span class="tdp">'+esc(s.name.slice(0,1))+'</span>')+'<b>'+esc(s.name)+'</b><strong>'+s.n+'</strong><small>'+(s.casa?s.casa+' casa ':'')+(s.lib?s.lib+' lib. ':'')+(s.esc?s.esc+' esc.':'')+'</small></div>'}).join('')+'</div>':'<p class="hint">Sin capturas tuyas en esta salida.</p>';
    h+='<details class="block tdall" data-lk="tdall"><summary><h3 style="display:inline">Ver una a una ('+all.length+')</h3></summary>'+all.slice().sort(function(a,b){return (a.ts||0)-(b.ts||0)}).map(qcRow).join('')+'</details>';
    return h;
  }
  if(tab==='reg'){var r='';try{r=lvRegHTML({eventos:t.eventos||[],date:t.date,companions:t.companions||[]})}catch(e){}return r||'<p class="hint">Esta salida no tiene registro.</p>'}
  if(tab==='eq'){var e=(typeof baitMixView==='function'?baitMixView(t):'')+eqBlockHTML(eqList(t));return e||'<p class="hint">Sin equipo anotado.</p>'}
  if(tab==='fot'){var ph=tdPhotos(t);return ph.length?'<div class="gal">'+ph.map(function(p){return '<span class="gi"><img loading="lazy" alt="" data-blob="'+esc(p)+'" src="data:image/gif;base64,R0lGODlhAQABAAAAACw="></span>'}).join('')+'</div>':'<p class="hint">Sin fotos.</p>'}
  /* resumen: tarjetas del tiempo + gráfica + tramos (sin la lista larga de peces) */
  var f=_tcFull43(t,0),a=f.indexOf('<div class="kp">'),r0=f.indexOf('<ol class="tl3">'),r1=f.indexOf('</ol>',r0)+5;
  var note=(t.summary||t.notes)?'<blockquote class="quote">'+esc(t.summary||t.notes)+'</blockquote>':'';
  return '<div class="tdres">'+(a>-1&&r1>4?f.slice(a,r1):'')+note+'</div>';
}
function tdView(t){
  var has={res:1,cap:catchesOfTrip(t.id).length,reg:(t.eventos||[]).length,eq:1,fot:tdPhotos(t).length};
  var tabs=TDTABS.filter(function(x){return has[x[0]]});
  if(!has[TD.tab])TD.tab='res';
  var f=_tcFull43(t,0),a=f.indexOf('<div class="hero'),b=f.indexOf('<div class="tb">'),hero=a<0||b<0?'':f.slice(a,b);
  return '<div class="tdv"><div class="tdbar"><button class="btn small ghost" data-a="trip-back">‹ Salidas</button><button class="btn small" data-a="edit-trip" data-id="'+esc(t.id)+'">Editar</button></div>'+
    '<article class="trip">'+hero+'</article>'+
    '<div class="tdtabs" role="tablist">'+tabs.map(function(x){return '<button role="tab" data-a="trip-tab" data-v="'+x[0]+'" aria-pressed="'+(TD.tab===x[0])+'">'+x[1]+(x[0]==='cap'?' <small>'+has.cap+'</small>':'')+'</button>'}).join('')+'</div>'+
    '<div class="tdbody">'+tdBody(t)+'</div></div>';
}
var _rs43=renderSalidas;
renderSalidas=function(){
  if(TD){var t=trips.filter(function(x){return x.id===TD.id})[0];if(t)return tdView(t);TD=null}
  return _rs43();
};
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a="trip-open"],[data-a="trip-back"],[data-a="trip-tab"]'):null;if(!b)return;
  var a=b.getAttribute('data-a');ev.stopPropagation();
  if(a==='trip-open')TD={id:b.getAttribute('data-id'),tab:'res'};
  else if(a==='trip-back')TD=null;
  else if(TD)TD.tab=b.getAttribute('data-v');
  renderMain();var m=$('main');if(m)m.scrollTop=0;
},true);
document.addEventListener('keydown',function(ev){
  if(ev.key!=='Enter'&&ev.key!==' ')return;var t=ev.target;
  if(t&&t.getAttribute&&t.getAttribute('data-a')==='trip-open'&&t.tagName==='DIV'){ev.preventDefault();t.click()}
});
/* el botón atrás del móvil vuelve a la lista (no sale de la app) */
window.addEventListener('popstate',function(){if(TD&&!($('#sheet')&&!$('#sheet').hidden)){TD=null;renderMain();try{history.pushState({cq:1},'')}catch(e){}}});
(function(){var s=document.createElement('style');s.textContent=
'.tcc{cursor:pointer}.tcopen{display:block}.tcc .hero{height:170px}'+
'.tcb{position:relative;padding:12px 40px 14px 14px;display:flex;flex-direction:column;gap:9px}'+
'.tcs{display:flex;gap:8px;flex-wrap:wrap}.tcs span{background:var(--surface-2,rgba(255,255,255,.06));border:1px solid var(--line);border-radius:999px;padding:5px 11px;font:600 12.5px var(--display);color:var(--muted)}.tcs b{color:var(--text,#fff)}'+
'.tct{display:flex;gap:6px;flex-wrap:wrap}.tct em{font-style:normal;font:600 12.5px var(--display);color:var(--accent);background:var(--accent-soft);border-radius:8px;padding:3px 9px}.tct em.mas{color:var(--muted);background:none}'+
'.tcg{position:absolute;right:14px;top:50%;transform:translateY(-50%);font:300 28px/1 var(--display);color:var(--muted);font-style:normal}'+
'.tdv{display:flex;flex-direction:column;gap:12px}.tdbar{display:flex;justify-content:space-between;gap:8px}'+
'.tdtabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;margin:0 -2px;padding:2px;position:sticky;top:0;z-index:5;background:var(--bg)}.tdtabs::-webkit-scrollbar{display:none}'+
'.tdtabs button{flex:none;padding:10px 16px;border-radius:999px;border:1px solid var(--line);background:var(--surface);color:var(--muted);font:600 14px var(--display);white-space:nowrap}.tdtabs button small{opacity:.7;margin-left:3px}'+
'.tdtabs button[aria-pressed="true"]{border-color:var(--tide);color:var(--tide);background:var(--tide-soft)}'+
'.tdbody{display:flex;flex-direction:column;gap:14px}.tdres{display:flex;flex-direction:column;gap:14px}.tdres .fcs,.tdres .nofish,.tdres .det{display:none}'+
'.tdsp{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.tds{position:relative;display:flex;flex-direction:column;gap:2px;background:var(--surface);border:1px solid var(--line);border-radius:16px;overflow:hidden;padding:0 0 10px}'+
'.tds img,.tds .tdp{width:100%;height:96px;object-fit:cover;background:var(--accent-soft);display:flex;align-items:center;justify-content:center;font:700 34px var(--display);color:var(--accent)}'+
'.tds b{padding:8px 12px 0;font:700 14px var(--display)}.tds strong{position:absolute;top:8px;right:8px;background:var(--tide);color:#2b1c00;border-radius:12px;padding:2px 9px;font:700 15px var(--display)}.tds small{padding:0 12px;color:var(--muted);font-size:12px}'+
'.tdbody .gal{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.tdbody .gal .gi{aspect-ratio:1;border-radius:12px;overflow:hidden;display:block}.tdbody .gal img{width:100%;height:100%;object-fit:cover}';
document.head.appendChild(s)})();
