/* ===== p64: receta del spot, plan concreto de la próxima salida y pistas descubiertas ===== */
var ENDIMR=['agua','franja','cebo','mar','ola','viento','marea'];
/* receta: lo mejor y lo peor por dimensión; dentro del spot si hay ≥2 y ≥2, si no global (marcado) */
function enRecipe(spotId){
  var V=enV(),S=V.filter(function(v){return v.l.spotId===spotId}),R={n:S.length,all:V.length,rows:[]};
  if(!S.length)return R;
  ENDIMR.forEach(function(d){
    var loc=enGroups(S,d).filter(function(g){return g.p.n>=2&&g.p.h>0&&g.p.rate!=null}).sort(function(a,b){return b.p.rate-a.p.rate}),scope='spot',gs=loc;
    if(gs.length<2){gs=enGroups(V,d).filter(function(g){return g.p.n>=2&&g.p.h>0&&g.p.rate!=null}).sort(function(a,b){return b.p.rate-a.p.rate});scope='global'}
    if(gs.length<2)return;
    var best=gs[0],worst=gs[gs.length-1];
    if(!(best.p.rate>worst.p.rate*EN.ratio))return;
    R.rows.push({d:d,scope:scope,best:best,worst:worst,conf:Math.min(enConf(best.p.n,worst.p.n),3)});
  });
  var b=R.rows.filter(function(r){return r.d==='agua'||r.d==='franja'||r.d==='cebo'});R.key=b;
  return R;
}
function enRecipeHTML(spotId){
  var R=enRecipe(spotId),nm=(spots.filter(function(x){return x.id===spotId})[0]||{}).name||'este spot';
  var h='<section class="card enrec"><div class="hd"><b>🧪 Receta de '+esc(nm)+'</b><span class="hint">'+R.n+(R.n===1?' salida con horas aquí':' salidas con horas aquí')+'</span></div>';
  if(!R.rows.length){
    return h+'<p class="hint">'+(R.n<2?'Aún no hay base: haz al menos 2 salidas con horas aquí y se dibuja la receta.':'Todavía no hay una diferencia clara entre condiciones. Con más salidas aparecerá.')+'</p></section>';
  }
  var sum=R.rows.filter(function(r){return r.d==='agua'||r.d==='franja'||r.d==='cebo'}).map(function(r){return r.best.t.toLowerCase()}).join(' · ');
  if(sum)h+='<p class="ensum">Mejor: <b>'+esc(sum)+'</b></p>';
  h+=R.rows.map(function(r){
    return '<div class="enrr"><span class="enrd">'+esc(ENDN[r.d])+'</span><div><b>'+esc(r.best.t)+'</b> <em class="enrt">'+enR(r.best.p.rate)+'/h</em><small>('+r.best.p.n+' salidas)</small><div class="enw">Peor: '+esc(r.worst.t.toLowerCase())+' · '+enR(r.worst.p.rate)+'/h ('+r.worst.p.n+')</div>'+(r.scope==='global'?'<i class="spt pe">Con todas tus salidas, no solo aquí</i>':'')+'<i class="spt of">Fiabilidad '+ENCF[r.conf]+'</i></div></div>';
  }).join('');
  return h+'<p class="hint">Peces por hora de tus salidas. Pocas salidas = pista, no certeza.</p></section>';
}
var _oss64=openSpotSheet;
openSpotSheet=function(id){
  _oss64(id);
  var body=document.getElementById('sheetbody');if(!body||body.querySelector('.enrec'))return;
  try{var html=enRecipeHTML(id),host=body.querySelector('.agwrap');
    if(host)host.insertAdjacentHTML('afterend',html);else body.insertAdjacentHTML('beforeend',html)}catch(e){}
};
/* plan concreto */
var ENMONT=null;
function enPlan(){
  var A;try{A=mdAdvice()}catch(e){return null}
  var c=A&&A.top&&A.top[0];if(!c)return null;
  var s=c.E.s,R=enRecipe(s.id),P={c:c,s:s,R:R,cebo:null,franja:null,tips:[]};
  var cb=R.rows.filter(function(r){return r.d==='cebo'})[0],fr=R.rows.filter(function(r){return r.d==='franja'})[0];
  if(cb)P.cebo=cb;if(fr)P.franja=fr;
  try{P.mont=SPI.sargo.montaje.filter(function(x){return /^(Anzuelo|Hilo)$/.test(x[0])}).slice(0,2)}catch(e){}
  var tried={};enV().filter(function(v){return v.l.spotId===s.id}).forEach(function(v){enFeat(v).forEach(function(f){if(f.d==='cebo')tried[f.k]=1})});
  var ex=enGroups(enV(),'cebo').filter(function(g){return !tried[g.k]&&g.p.n>=2&&g.p.rate>0}).sort(function(a,b){return b.p.rate-a.p.rate})[0];
  if(ex)P.exp='Prueba '+ex.t.toLowerCase()+' en '+s.name+' (fuera te da '+enR(ex.p.rate)+' peces/h)';
  P.hyp=Object.keys(HYP).filter(function(k){return HYP[k]&&HYP[k].probar&&/^d_/.test(k)}).map(function(k){return enHypTxt(k)}).filter(Boolean);
  return P;
}
function enPlanHTML(){
  var P;try{P=enPlan()}catch(e){return ''}
  if(!P)return '';
  var c=P.c,b=c.best,h='<section class="card enpl"><div class="hd"><b>🎯 Plan para la próxima</b><span class="hint">con tu previsión y tus salidas</span></div>';
  h+='<div class="enpr"><span>Dónde y cuándo</span><b>'+esc(mdDayShort(c.iso))+' · '+esc(c.name)+'</b><small>'+mm(b.from)+' – '+mm(b.to)+'</small></div>';
  if(c.route&&c.route.length>1)h+='<div class="enpr"><span>Recorrido</span>'+c.route.map(function(x,i){return '<b>'+(i+1)+'. '+esc(x.E.s.name)+'</b><small>'+mm(x.from)+'–'+mm(Math.min(x.to,1440))+'</small>'}).join('')+'</div>';
  if(P.franja)h+='<div class="enpr"><span>Franja</span><b>'+esc(P.franja.best.t.charAt(0).toUpperCase()+P.franja.best.t.slice(1))+'</b><small>'+enR(P.franja.best.p.rate)+'/h · '+P.franja.best.p.n+' salidas</small></div>';
  if(P.cebo)h+='<div class="enpr"><span>Cebo</span><b>'+esc(P.cebo.best.t)+'</b><small>'+enR(P.cebo.best.p.rate)+'/h · '+P.cebo.best.p.n+' salidas</small></div>';
  if(P.mont&&P.mont.length)h+='<div class="enpr"><span>Montaje</span>'+P.mont.map(function(x){return '<b>'+esc(x[0])+'</b><small>'+esc(x[1])+'</small>'}).join('')+'<i class="spt pe">Guía de pescadores</i></div>';
  if(!P.franja&&!P.cebo)h+='<p class="hint">Aún no hay datos para recomendar franja ni cebo en este spot.</p>';
  if(P.exp||P.hyp.length)h+='<h4 class="eyebrow">Para aprender</h4>'+(P.exp?'<div class="enpx">🧪 '+esc(P.exp)+'</div>':'')+P.hyp.map(function(t){return '<div class="enpx">🧪 '+esc(t)+'</div>'}).join('');
  return h+'</section>';
}
/* descubiertas */
function enDisc(){
  var E=enEffects(enV()).filter(function(e){return e.conf>=1&&e.d!=='spot'});
  return E.slice(0,6);
}
function enHypId(e){return 'd_'+e.d+'_'+e.k}
function enHypTxt(id){var m=/^d_([a-z]+)_(.+)$/.exec(id);if(!m)return '';var e=enDisc().filter(function(x){return x.d===m[1]&&x.k===m[2]})[0];return e?(e.dir==='+'?'Repite ':'Evita ')+e.t.toLowerCase():''}
function enDiscHTML(){
  var E=enDisc(),h='<details class="card mdbook endisc"><summary><span class="mdbh"><b>🔎 Pistas descubiertas</b><small>'+(E.length?E.length+' patrones en tus salidas':'aún sin patrones')+'</small></span></summary><div class="enbb">';
  if(!E.length)return h+'<p class="hint">Hacen falta al menos 2 salidas con horas de cada lado para detectar algo. Completa las horas en Ajustes.</p></div></details>';
  h+=E.map(function(e){var id=enHypId(e),on=HYP[id]&&HYP[id].probar;
    return '<div class="enr '+(e.dir==='+'?'up':'dn')+'"><i>'+(e.dir==='+'?'▲':'▼')+'</i><div><b>'+esc(e.t.charAt(0).toUpperCase()+e.t.slice(1))+' <em class="mdc '+(e.conf>=3?'ok':e.conf===2?'am':'nd')+'">'+(e.conf>=3?'Consistente':e.conf===2?'Prometedora':'Muy poca base')+'</em></b><span>'+esc(enEffTxt(e))+'</span><button type="button" class="btn small'+(on?' primary':'')+'" data-a="md-probar" data-id="'+esc(id)+'" aria-pressed="'+(on?'true':'false')+'">'+(on?'🧪 Lo probaré en la próxima salida ✓':'🧪 Probar en la próxima salida')+'</button></div></div>'}).join('');
  return h+'<p class="hint">Cada pista sale de comparar tus salidas con y sin esa condición. Son hipótesis: la próxima salida las confirma o las desmiente.</p></div></details>';
}
var _rh64=renderHoy;
renderHoy=function(){
  var h=_rh64();
  try{
    var pl=enPlanHTML();
    if(pl){var k='<section class="card mdadv">',i=h.indexOf(k);
      if(i>-1){var j=h.indexOf('</section>',i)+10;h=h.slice(0,j)+pl+h.slice(j)}}
    h+=enDiscHTML();
  }catch(e){}
  return h;
};
(function(){var s=document.createElement('style');s.textContent=
'.enrec,.enpl{border:1px solid rgba(58,208,200,.3)}.enrec .hd,.enpl .hd{display:flex;flex-direction:column;gap:2px;margin-bottom:8px}.enrec .hd b,.enpl .hd b{font:700 16px var(--display)}.ensum{margin:0 0 8px;font-size:14px}'+
'.enrr{display:grid;grid-template-columns:64px 1fr;gap:10px;padding:9px 0;border-top:1px solid var(--line);font-size:13.5px}.enrd{font:700 10.5px var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--tide);padding-top:3px}.enrt{font:700 12px var(--mono);font-style:normal;color:var(--ok)}.enrr small{color:var(--dim);margin-left:4px}.enw{color:var(--muted);font-size:12.5px}'+
'.enpr{display:grid;gap:1px;padding:9px 0;border-top:1px solid var(--line)}.enpr span{font:700 10.5px var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--tide)}.enpr b{font:600 15px/1.3 var(--display)}.enpr small{color:var(--dim)}.enpx{padding:7px 10px;margin-top:6px;border-radius:12px;background:var(--surface2);border:1px solid var(--line);font-size:13.5px}'+
'.enbb{padding:0 16px 16px}.endisc .enr{border-top:1px solid var(--line)}.endisc .enr .btn{margin-top:8px}';
document.head.appendChild(s)})();
