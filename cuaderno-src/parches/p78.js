/* ===== p78: reglas fuertes por spot que Jon dice en los audios — «solo en esa marea», «solo con mareas vivas», «la ola no importa» ===== */
/* Campos del spot: faseSolo (bool: fuera de su ventana de marea casi no vale), vivaMin (m de recorrido de marea del día; mareas vivas ≈ 3 m o más), olaDaIgual (bool). */
var _cf79=condsFor;
condsFor=function(iso,fc){
  var C=_cf79.apply(this,arguments);
  try{var r=dayRange(tideEvents(forecast),iso);C.rng=r;C.forEach(function(c){c.rng=r})}catch(e){}
  return C;
};
var _es79=effSpot;
effSpot=function(s){
  var e=_es79.apply(this,arguments);
  if(s&&s.olaDaIgual&&s.minWave==null&&s.maxWave==null){delete e.minWave;delete e.maxWave}
  return e;
};
var _sm79=spotModel;
spotModel=function(s){
  var M=_sm79.apply(this,arguments);
  if(s&&s.olaDaIgual&&s.minWave==null&&s.maxWave==null&&M&&M.e){delete M.e.minWave;delete M.e.maxWave;M.K.wave=false;M.any=M.K.wind||M.K.tide||M.K.phase}
  return M;
};
var _ss79=slotScore;
slotScore=function(M,c){
  var s=M&&M.s;if(!s||!c)return _ss79.apply(this,arguments);
  var ig=s.olaDaIgual&&!M.K.wave,r=_ss79(M,ig?Object.assign({},c,{wave:1}):c),f=1;
  if(ig&&r.w>0){f*=1/r.w;r.w=1}
  if(s.faseSolo&&M.K.phase&&c.ph!=null&&!inWin(c.ph,PH[M.e.from].t,PH[M.e.to].t)){f*=0.1;r.t=Math.min(r.t,0.05)}
  if(s.vivaMin&&c.rng!=null&&c.rng<s.vivaMin){f*=0.1;r.viva=false}
  if(s.aguaMin&&AGS[s.aguaMin]!=null){var pa=hrAgua(s,c);if(pa!=null&&pa<AGS[s.aguaMin]){f*=0.45;r.agua=false}}
  r.v=Math.min(1,r.v*f);
  return r;
};
/* agua probable ese día en el spot (según tus visitas); null si no hay base */
var HRAG={};
function hrAguaIso(s,iso){
  var k=s.id+'|'+iso+'|'+legs.length+'|'+Object.keys(AG).length;if(HRAG[k]!==undefined)return HRAG[k];
  if(Object.keys(HRAG).length>200)HRAG={};
  var v=null;try{var r=agPredict(s,iso);if(r&&r.agua)v=AGS[r.agua]}catch(e){}
  if(v!=null)HRAG[k]=v;
  return v;
}
function hrAgua(s,c){var d=new Date(c.ms);return hrAguaIso(s,d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'))}
function hrPhTxt(s){var a=PH[s.from],b=PH[s.to];if(!a||!b)return '';return a.k===b.k?a.n.toLowerCase():a.n.toLowerCase()+' → '+b.n.toLowerCase()}
var _sr79=siteRecipe;
siteRecipe=function(G){
  var h=_sr79.apply(this,arguments),ch=[];
  var S=G.spots.filter(function(E){return !E.pending}).map(function(E){return E.s});
  var fs=S.filter(function(s){return s.faseSolo&&PH[s.from]&&PH[s.to]}),vv=S.filter(function(s){return s.vivaMin}),oi=S.length&&S.every(function(s){return s.olaDaIgual});
  if(fs.length){var pf=fs.length<S.length&&S.length>1;var sn={};fs.forEach(function(x){var t=hrPhTxt(x),c=t&&'<span class="hrc">🌑 '+(pf?esc(x.name)+': ':'')+'solo '+esc(t)+'</span>';if(c&&!sn[c]){sn[c]=1;ch.push(c)}})}
  if(vv.length)ch.push('<span class="hrc">🌕 mareas vivas (≥ '+num(Math.min.apply(null,vv.map(function(s){return s.vivaMin})),1)+' m)</span>');
  var am=S.filter(function(s){return s.aguaMin})[0];if(am)ch.push('<span class="hrc">💧 agua algo '+(am.aguaMin==='tomadilla'?'tomada':esc(am.aguaMin))+' o tras temporal</span>');
  if(oi)ch.push('<span class="hrc z">🌊 la ola importa poco</span>');
  if(!ch.length)return h;
  if(!h)return '<div class="recipe"><span class="eyebrow">Su receta</span><span class="conds">'+ch.join('')+'</span></div>';
  return h.replace('<span class="conds">','<span class="conds">'+ch.join(''));
};
/* el motivo en «Tus reglas para este día» y en la ficha: que se vea por qué un día no vale */
function hrDayNote(G,P){
  var S=G.spots.filter(function(E){return !E.pending}).map(function(E){return E.s}),rng=P&&P.C&&P.C.rng,out=[];
  var vv=S.filter(function(s){return s.vivaMin})[0];
  var am=S.filter(function(s){return s.aguaMin&&AGS[s.aguaMin]!=null})[0];
  if(am){var pa=hrAguaIso(am,P.iso);if(pa!=null&&pa<AGS[am.aguaMin])out.push('Agua probable '+AGL[pa][1].toLowerCase()+': aquí rinde con el agua algo más tomada o tras un temporal.')}
  if(vv&&rng!=null&&rng<vv.vivaMin)out.push('Mareas '+(rng<3.1?'muertas':'medias')+' ('+num(rng,1)+' m de recorrido): este sitio pide mareas vivas.');
  return out;
}
var _sc79=siteCard;
siteCard=function(G,P){
  var h=_sc79.apply(this,arguments);
  try{var n=hrDayNote(G,P);if(n.length)h=h.replace('<div class="recipe">','<p class="hrwarn">⚠️ '+esc(n.join(' '))+'</p><div class="recipe">')}catch(e){}
  return h;
};
/* editor del spot: tres casillas en «Fijar a mano» */
var _ose79=openSpotEditor;
openSpotEditor=function(id,draft){
  _ose79.apply(this,arguments);
  var s=id?spots.find(function(x){return x.id===id}):null,d=draft||{};
  var v=function(k){return d[k]!==undefined?d[k]:s?s[k]:null};
  var to=document.getElementById('sp-to');if(!to)return;
  var row=to.closest('.row');if(!row||document.getElementById('sp-fsolo'))return;
  row.insertAdjacentHTML('afterend','<div class="hrbox"><label class="hrck"><input type="checkbox" id="sp-fsolo"'+(v('faseSolo')?' checked':'')+'> <span><b>Solo en esa marea</b><small>Fuera de «Marea desde–hasta» el Plan lo da por malo.</small></span></label>'+
    '<label class="hrck"><input type="checkbox" id="sp-viva"'+(v('vivaMin')?' checked':'')+'> <span><b>Solo con mareas vivas</b><small>Días con 3 m o más de recorrido de marea.</small></span></label>'+
    '<label class="hrck"><input type="checkbox" id="sp-aguam"'+(v('aguaMin')?' checked':'')+'> <span><b>Pide agua algo tomada</b><small>Si el agua probable es cristal, el Plan lo da por peor.</small></span></label>'+
    '<label class="hrck"><input type="checkbox" id="sp-olaig"'+(v('olaDaIgual')?' checked':'')+'> <span><b>La ola importa poco</b><small>No se aprende ni se exige un oleaje.</small></span></label></div>');
};
var _rsf79=readSpotForm;
readSpotForm=function(){
  var d=_rsf79.apply(this,arguments),a=document.getElementById('sp-fsolo'),b=document.getElementById('sp-viva'),c=document.getElementById('sp-olaig');
  if(a)d.faseSolo=!!a.checked;
  if(b){var s=spotDraft&&spotDraft.id?spots.find(function(x){return x.id===spotDraft.id}):null;d.vivaMin=b.checked?((s&&s.vivaMin)||3):null}
  if(c)d.olaDaIgual=!!c.checked;
  var am=document.getElementById('sp-aguam');if(am)d.aguaMin=am.checked?'tomadilla':null;
  return d;
};
(function(){var s=document.createElement('style');s.textContent=
'.recipe .hrc{display:inline-flex;align-items:center;gap:5px;padding:6px 11px;border-radius:99px;background:rgba(63,208,201,.12);border:1px solid rgba(63,208,201,.35);color:var(--text);font:600 13px var(--body)}.recipe .hrc.z{background:transparent;border-style:dashed;color:var(--muted)}'+
'.hrwarn{margin:6px 0 8px;padding:9px 12px;border-radius:12px;background:rgba(255,122,107,.1);border:1px solid rgba(255,122,107,.35);font:500 13px/1.4 var(--body);color:var(--text)}'+
'.hrbox{display:flex;flex-direction:column;gap:10px}.hrck{display:flex;gap:10px;align-items:flex-start}.hrck input{width:20px;height:20px;margin-top:2px;flex:none}.hrck span{display:flex;flex-direction:column}.hrck small{color:var(--muted);font-size:12px}';
document.head.appendChild(s)})();
