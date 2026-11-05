/* ===== p37: el registro de la salida (con audios y descargas) también se ve en «Ver detalle» de una salida guardada ===== */
var _tripCard37=tripCard;
tripCard=function(t,idx){
  var h=_tripCard37(t,idx);
  if(!t||!(t.eventos||[]).length||h.indexOf('aria-expanded="true"')<0)return h;
  var r='';try{r=lvRegHTML({eventos:t.eventos,date:t.date,companions:t.companions||[]})}catch(e){}
  if(!r)return h;
  var i=h.lastIndexOf('<div class="tfoot">');return i<0?h:h.slice(0,i)+r+h.slice(i);
};
