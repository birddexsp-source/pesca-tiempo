/* ===== p39: añadir a mano al registro de una salida (cambio de spot de alguien, notas) al completarla en casa ===== */
var RX=null; // formulario abierto: {who,spotId,why,time,type}
var _evRow39=lvEvRow;
lvEvRow=function(e){
  if(e&&e.type==='note'&&!e.audio){
    return '<div class="qcrow"><time>'+(e.noTime?'·':esc(lvHM(e.t)))+'</time><span class="evi">📝</span><div class="qcm"><b>Nota</b>'+(e.why?'<small>'+esc(e.why)+'</small>':'')+'</div></div>';
  }
  return _evRow39(e);
};
function rxForm(d){
  var L=(d.companions||[]),sp=spots.filter(function(s){return !d.siteId||s.siteId===d.siteId}).sort(function(a,b){return String(a.name).localeCompare(String(b.name),'es',{numeric:true})});
  var who='<div class="whorow"><small>¿Quién?</small><button type="button" class="chip'+(RX.who===''?' on':'')+'" data-a="rx-who" data-id="" aria-pressed="'+(RX.who==='')+'">Yo</button>'+
    L.map(function(c){return '<button type="button" class="chip'+(RX.who===c.id?' on':'')+'" data-a="rx-who" data-id="'+esc(c.id)+'" aria-pressed="'+(RX.who===c.id)+'">'+esc(c.name)+'</button>'}).join('')+
    (L.length?'<button type="button" class="chip'+(RX.who==='all'?' on':'')+'" data-a="rx-who" data-id="all" aria-pressed="'+(RX.who==='all')+'">Todos</button>':'')+'</div>';
  var typ='<div class="whorow"><small>Qué</small><button type="button" class="chip'+(RX.type==='spot'?' on':'')+'" data-a="rx-type" data-v="spot">Cambio de spot</button><button type="button" class="chip'+(RX.type==='note'?' on':'')+'" data-a="rx-type" data-v="note">Nota</button></div>';
  var spot=RX.type==='spot'?'<div class="field"><label for="rx-spot">¿A qué spot?</label><select id="rx-spot"><option value="">— otro / no sé —</option>'+sp.map(function(s){return '<option value="'+esc(s.id)+'"'+(RX.spotId===s.id?' selected':'')+'>'+esc(s.name)+'</option>'}).join('')+'</select></div>':'';
  return '<div class="rxform">'+typ+(RX.type==='spot'?who:'')+spot+
    '<div class="field"><label for="rx-why">'+(RX.type==='spot'?'Detalle (dónde, por qué…)':'Nota')+'</label><input id="rx-why" maxlength="160" autocomplete="off" placeholder="'+(RX.type==='spot'?'Ej. a la derecha, en el charco':'Lo que quieras recordar')+'" value="'+esc(RX.why||'')+'"></div>'+
    '<div class="field"><label for="rx-time">Hora (si la sabes)</label><input id="rx-time" type="time" value="'+esc(RX.time||'')+'"></div>'+
    '<div class="row" style="display:flex;gap:8px"><button type="button" class="btn" data-a="rx-cancel">Cancelar</button><button type="button" class="btn primary" data-a="rx-save">Añadir</button></div></div>';
}
function rxBlock(d,hasEvents){
  var btn=RX?rxForm(d):'<button type="button" class="btn small" data-a="rx-open">+ Añadir cambio o nota al registro</button>';
  if(hasEvents)return '<div class="rxwrap" style="margin:-4px 0 12px">'+btn+'</div>';
  return '<div class="block lvtl"><h3>Registro de la salida</h3><p class="hint">Cambios de spot, de equipo y notas de esta salida.</p>'+btn+'</div>';
}
var _stepSummary39=stepSummary;
stepSummary=function(){
  var h=_stepSummary39(),d=tripDraft;if(!d)return h;
  var has=(d.eventos||[]).some(function(e){return e&&e.type!=='fin'});
  if(has){var i=h.indexOf('<div class="block"><h3>Cuéntalo</h3>');var blk=rxBlock(d,true);return i<0?h+blk:h.slice(0,i)+blk+h.slice(i)}
  var k='<div class="block"><h3>Cuéntalo</h3>',j=h.indexOf(k),b2=rxBlock(d,false);return j<0?h+b2:h.slice(0,j)+b2+h.slice(j);
};
function rxRead(){var w=$('#rx-why'),t=$('#rx-time'),s=$('#rx-spot');if(RX){if(w)RX.why=w.value;if(t)RX.time=t.value;if(s)RX.spotId=s.value}}
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a^="rx-"]'):null;if(!b||!tripDraft)return;
  var a=b.getAttribute('data-a'),d=tripDraft;ev.stopPropagation();
  if(a==='rx-open'){RX={type:'spot',who:'',spotId:'',why:'',time:''};renderStep();return}
  if(a==='rx-cancel'){RX=null;renderStep();return}
  rxRead();
  if(a==='rx-who'){RX.who=b.getAttribute('data-id')||'';renderStep()}
  else if(a==='rx-type'){RX.type=b.getAttribute('data-v');renderStep()}
  else if(a==='rx-save'){
    var sp=RX.spotId?spots.filter(function(s){return s.id===RX.spotId})[0]:null,why=String(RX.why||'').trim();
    if(RX.type==='spot'&&!sp&&!why){toast('Elige el spot o cuéntame dónde');return}
    if(RX.type==='note'&&!why){toast('Escribe la nota');return}
    var ev2=(d.eventos||[]).slice(),last=ev2.reduce(function(m,e){return e&&e.t>m?e.t:m},0),t;
    var noTime=!RX.time;
    if(RX.time){var dt=new Date(d.date+'T'+RX.time+':00');t=isNaN(dt)?(last||Date.now())+1000:dt.getTime()}else t=(last||Date.now())+1000;
    var o={t:t,type:RX.type};if(noTime)o.noTime=true;
    if(RX.type==='spot'){o.who=RX.who||'';if(sp){o.name=sp.name;if(sp.siteId)o.siteId=sp.siteId}else if(why)o.name=why;if(why&&sp)o.why=why}
    else o.why=why;
    ev2.push(o);ev2.sort(function(x,y){return (x.noTime?1:0)-(y.noTime?1:0)||x.t-y.t});
    d.eventos=ev2;RX=null;renderStep();toast('Añadido al registro');
  }
},true);
var _ote39=openTripEditor;
openTripEditor=function(id){RX=null;return _ote39.apply(this,arguments)};
