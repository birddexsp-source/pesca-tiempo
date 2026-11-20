/* ===== p79: la nota de un spot cuenta lo que has sacado ahí (o cómo lo valoras tú) + salidas en las que pesca otra persona ===== */
/* Spot: campo fiab = 'alta' | 'media' | 'baja' (tu valoración). Sin marcar, la fiabilidad sale de tus capturas ahí; sin datos la nota va rebajada.
   Salida: campo ajena = «Nombre». No cuenta en tus horas, tu ritmo ni tu aprendizaje; sus capturas son de referencia (pesan la mitad). */
function ajName(t){return t&&t.ajena?String(t.ajena).trim():''}
var _lo80=legsOfSpot;
legsOfSpot=function(id){return _lo80.apply(this,arguments).filter(function(l){return !l.ajena})};
var _stl80=sxTripLegs;
sxTripLegs=function(id){var t=trips.filter(function(x){return x.id===id})[0];return ajName(t)?[]:_stl80.apply(this,arguments)};
var _env80=enV;
enV=function(){return _env80.apply(this,arguments).filter(function(v){return !(v.l&&v.l.ajena)})};
var _sxs80=sxSeason;
sxSeason=function(){var all=trips;trips=all.filter(function(t){return !ajName(t)});try{return _sxs80.apply(this,arguments)}finally{trips=all}};
/* ---------- fiabilidad del spot ---------- */
function rlFish(id){var n=0;sxAll().forEach(function(c){(c.items||[]).forEach(function(i){if(i.spotId===id&&i.n>0)n+=i.who?0.5*i.n:i.n})});return n}
function rlOf(s){
  var f=s&&s.fiab;
  if(f==='alta')return {v:1,why:''};
  if(f==='media')return {v:0.82,why:'lo tienes marcado como «a veces»'};
  if(f==='baja')return {v:0.62,why:'lo tienes marcado como poco fiable'};
  var fish=rlFish(s.id),vis={};legsOfSpot(s.id).forEach(function(l){vis[l.tripId]=1});
  if(fish>=1){var x=Math.min(1,0.78+0.044*Math.min(fish,5));return {v:x,why:x<0.95?'pocas capturas tuyas aquí (≈'+Math.round(fish)+')':''}}
  return Object.keys(vis).length?{v:0.68,why:'sin capturas tuyas aquí todavía'}:{v:0.6,why:'sin capturas tuyas aquí todavía'};
}
var _sm80=spotModel;
spotModel=function(s){var M=_sm80.apply(this,arguments);try{if(M&&s)M.rel=rlOf(s)}catch(e){}return M};
var _ss80=slotScore;
slotScore=function(M,c){var r=_ss80.apply(this,arguments),q=M&&M.rel;if(q&&q.v<1&&r&&r.v!=null){r.v=r.v*q.v;r.rel=q.v}return r};
var _ps80=planSig;
planSig=function(){var n=0;try{sxAll().forEach(function(c){(c.items||[]).forEach(function(i){n+=i.n||0})})}catch(e){}return _ps80.apply(this,arguments)+'|c'+n};
var _hdn80=hrDayNote;
hrDayNote=function(G,P){
  var out=_hdn80.apply(this,arguments);
  try{var E=G.route&&G.route.length?G.route[0].E:G.spots.filter(function(e){return !e.pending&&e.best})[0],q=E&&E.M&&E.M.rel;
    if(q&&q.v<0.85&&q.why)out.push('En '+E.s.name+': '+q.why+'; su nota va rebajada.')}catch(e){}
  return out;
};
/* editor del spot: tu valoración */
var _ose80=openSpotEditor;
openSpotEditor=function(id,draft){
  _ose80.apply(this,arguments);
  var s=id?spots.find(function(x){return x.id===id}):null,d=draft||{},v=d.fiab!==undefined?d.fiab:s?s.fiab:null;
  var box=document.querySelector('.hrbox');if(!box||document.getElementById('sp-fiab'))return;
  box.insertAdjacentHTML('afterend','<div class="field"><label for="sp-fiab">Fiabilidad según tú</label><select id="sp-fiab">'+
    [['','Automática (según tus capturas ahí)'],['alta','Fiable'],['media','A veces'],['baja','Poco fiable']].map(function(o){return '<option value="'+o[0]+'"'+((v||'')===o[0]?' selected':'')+'>'+o[1]+'</option>'}).join('')+'</select></div>');
};
var _rsf80=readSpotForm;
readSpotForm=function(){var d=_rsf80.apply(this,arguments),e=document.getElementById('sp-fiab');if(e)d.fiab=e.value||null;return d};
/* ---------- salidas en las que pesca otra persona ---------- */
var _sst80=stepSite;
stepSite=function(){
  var h=_sst80.apply(this,arguments),d=tripDraft;
  var f='<div class="field"><label for="tr-aj">¿Ha pescado otra persona y tú no?</label><input id="tr-aj" data-bind="ajena" maxlength="40" placeholder="Su nombre; vacío si pescaste tú" value="'+esc(d.ajena||'')+'"><p class="hint">Se guarda como referencia: no cuenta en tus horas ni en tu aprendizaje.</p></div>';
  return h.replace('<div class="field"><label>Modalidad</label>',f+'<div class="field"><label>Modalidad</label>');
};
function ajId(n){return 'aj-'+String(n).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
document.addEventListener('input',function(ev){
  var t=ev.target;if(!t||t.id!=='tr-aj'||!tripDraft)return;
  var n=t.value.trim();tripDraft.companions=(tripDraft.companions||[]).filter(function(c){return String(c.id).indexOf('aj-')!==0});
  if(n)tripDraft.companions.push({id:ajId(n),name:n});
});
var _gif80=gearItemFix;
gearItemFix=function(o,d){var r=_gif80.apply(this,arguments),n=d&&d.ajena?String(d.ajena).trim():'';if(n&&r&&!r.who)r.who=ajId(n);return r};
var _sxc80=sxCond;
sxCond=function(t){
  if(!ajName(t))return _sxc80.apply(this,arguments);
  var keep=sxTripLegs;sxTripLegs=_stl80;try{return _sxc80.apply(this,arguments)}finally{sxTripLegs=keep}
};
var _rs80=renderSalidas;
renderSalidas=function(){
  var h=_rs80.apply(this,arguments);
  if(typeof TD!=='undefined'&&TD)return h;
  try{
    var D=uiDom(h);
    [].forEach.call(D.querySelectorAll('article.trow'),function(a){
      var op=a.querySelector('.tcopen'),id=op&&op.getAttribute('data-id'),t=id&&trips.filter(function(x){return x.id===id})[0],n=ajName(t);if(!n)return;
      var txt='Salida de <b>'+esc(n)+'</b> · tú no pescaste · referencia',w=a.querySelector('.sxw2'),trm=a.querySelector('.trm');
      if(w)w.innerHTML=txt;else if(trm)trm.insertAdjacentHTML('beforeend','<div class="sxw2">'+txt+'</div>');
    });
    return D.innerHTML;
  }catch(e){return h}
};
var _tdv80=tdView;
tdView=function(t){
  var h=_tdv80.apply(this,arguments),n=ajName(t);
  if(!n)return h;
  return h.replace('<div class="tdtabs"','<div class="block ajblk"><p class="hint">👤 <b>Salida de '+esc(n)+'</b>: tú no pescaste. No cuenta en tus horas, tu ritmo ni en lo que aprende el Plan de tus spots; sus capturas valen la mitad como referencia.</p></div><div class="tdtabs"');
};
(function(){var s=document.createElement('style');s.textContent='.ajblk{border-color:rgba(242,184,75,.45)!important}';document.head.appendChild(s)})();
