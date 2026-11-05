/* ===== p40: lo que pescan los compañeros NO cuenta como captura mía (mis especies, estadísticas, contadores) ===== */
var CATALL=null;
function mineCatches(all){
  var out=[];
  all.forEach(function(c){
    var its=c.items||[],mine=its.filter(function(i){return !i.who});
    if(mine.length===its.length){out.push(c);return}
    if(!mine.length&&!(c.photos&&c.photos.length))return;
    out.push(Object.assign({},c,{items:mine}));
  });
  return out;
}
function mineOnly(fn){
  return function(){
    var all=catches,prev=CATALL;CATALL=all;catches=mineCatches(all);
    try{return fn.apply(this,arguments)}finally{catches=all;CATALL=prev}
  };
}
function mineCount(list){var n=0,sp={};list.forEach(function(c){(c.items||[]).forEach(function(i){n+=i.n||0;if(i.species)sp[norm(i.species)]=1})});return {n:n,sp:Object.keys(sp).length}}
speciesStats=mineOnly(speciesStats);
stData=mineOnly(stData);
baitStats=mineOnly(baitStats);
renderCapturas=mineOnly(renderCapturas);
/* la lista «Por ordenar» sí necesita ver las capturas de todos */
var _qs40=quickSection;
quickSection=function(){var cur=catches;if(CATALL)catches=CATALL;try{return _qs40()}finally{catches=cur}};
/* contadores de Salidas (cabecera y cada salida) */
var _rs40=renderSalidas;
renderSalidas=function(){
  var h=_rs40(),m=mineCount(mineCatches(catches.filter(function(c){return c.tripId})));
  return h.replace(/<b>[^<]*<\/b>(<small>Peces<\/small>)/,'<b>'+m.n+'</b>$1').replace(/<b>[^<]*<\/b>(<small>Especies<\/small>)/,'<b>'+m.sp+'</b>$1');
};
var _tc40=tripCard;
tripCard=function(t,idx){
  var h=_tc40(t,idx),m=mineCount(mineCatches(catches.filter(function(c){return c.tripId===t.id}))).n;
  return h.replace(/<div class="fbadge">[\s\S]*?<\/div>/,m?'<div class="fbadge"><b>'+m+'</b><span>'+(m===1?'pez':'peces')+'</span></div>':'');
};
