/* ===== p27: en los desplegables de equipo, primero lo que más usas ===== */
var USORT=false,UMAP={};
function usageMap(){
  var m={};
  (trips||[]).forEach(function(t){
    var d=t.date||'';
    eqList(t).forEach(function(e){
      INV.forEach(function(it){
        var hit=false;
        try{
          if(it.kind==='senuelo')hit=String(e.lureIds||'').split(',').indexOf(it.id)>-1;
          else if(it.kind==='linea')hit=it.uso==='Bajo'?!!(e.fluoro&&((it.diam&&dmm(it.diam)===String(e.fluoro))||String(e.fluoro)===it.marca)):!!(e.sedal&&String(e.sedal)===invName(it));
          else hit=!!invSel(it,e);
        }catch(_){}
        if(hit){var r=m[it.id]||(m[it.id]={n:0,last:''});r.n++;if(d>r.last)r.last=d}
      });
    });
  });
  return m;
}
function usedCmp(a,b){
  var x=UMAP[a.id]||{n:0,last:''},y=UMAP[b.id]||{n:0,last:''};
  if(x.n!==y.n)return y.n-x.n;
  return x.last<y.last?1:x.last>y.last?-1:0;
}
Object.keys(ORD23).forEach(function(k){
  var o=ORD23[k];
  ORD23[k]=function(a,b){if(USORT){var d=usedCmp(a,b);if(d)return d}return o(a,b)};
});
var _eqCard27=eqCard;
eqCard=function(e,i,n){
  USORT=true;try{UMAP=usageMap()}catch(_){UMAP={}}
  try{return _eqCard27(e,i,n)}finally{USORT=false}
};
