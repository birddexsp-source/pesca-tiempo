/* ===== Equipo: uno por defecto; cambios con «+» (bajo/anzuelo, aparejo, modalidad) ===== */
['kind','mode','senuelo'].forEach(function(k){if(EQKEYS.indexOf(k)<0)EQKEYS.push(k)});
var EQK={bajo:['Bajo / anzuelo',['linea','anz'],'anz'],aparejo:['Aparejo',['apar'],'apar'],modo:['Modalidad',['apar','anz'],'apar']};
var EQWHY={bajo:['No picaban','Piezas pequeñas','Más mar','Se enredaba','Probar'],aparejo:['Más mar','Más viento','Menos mar','Corriente','Probar'],modo:['Poco oleaje','Mucho oleaje','No picaban','Cambio de spot','Probar']};
var EQMODES=['Corcho','Plomín','Spinning','Rockfishing','Jigging','Surfcasting','A mano'];
function eqKindIc(k){return k==='bajo'?hookIc('Anilla'):k==='aparejo'?ic11('float'):ic11('lure')}
var _eqCard22=eqCard;
eqCard=function(e,i,n){
  var saved=tripDraft.mode,h;
  if(e.mode)tripDraft.mode=e.mode;
  try{h=_eqCard22(e,i,n)}finally{tripDraft.mode=saved}
  if(i===0||!e.kind)return h;
  var K=EQK[e.kind]||EQK.bajo,keep=K[1],secs=[];
  h.replace(/<details class="gdet gsec" data-gk="e\d+(\w+)"[\s\S]*?<\/details>/g,function(m,k){if(keep.indexOf(k)>-1){secs.push(m.replace('data-gk="e'+i+k+'"','data-gk="e'+i+k+'"'+((K[2]===k||GOPEN['e'+i+k])?' open':'')))}return m});
  var modePick='';
  if(e.kind==='modo'){
    modePick='<div class="invrow"><span class="invl">Pasé a</span><div class="chips invchips">'+EQMODES.map(function(m){return '<button type="button" class="chip'+(e.mode===m?' on':'')+'" data-a="eq-xm" data-i="'+i+'" data-v="'+m+'" aria-pressed="'+(e.mode===m)+'">'+m+'</button>'}).join('')+'</div></div>';
    if(modoOf(e.mode)&&modoOf(e.mode).lure){
      var all=(LURES['Rígido']||[]).concat(LURES['Vinilo']||[]);
      modePick+='<div class="invrow"><span class="invl">Señuelo</span><div class="chips invchips">'+all.map(function(m){return '<button type="button" class="chip'+(e.senuelo===m?' on':'')+'" data-a="eq-xs" data-i="'+i+'" data-v="'+esc(m)+'" aria-pressed="'+(e.senuelo===m)+'">'+esc(m)+'</button>'}).join('')+'</div></div>';
    }
  }
  var why='<div class="invrow"><span class="invl">¿Por qué?</span><div class="chips invchips">'+(EQWHY[e.kind]||[]).map(function(w){return '<button type="button" class="chip'+(e.why===w?' on':'')+'" data-a="eq-xw" data-i="'+i+'" data-v="'+w+'" aria-pressed="'+(e.why===w)+'">'+w+'</button>'}).join('')+'</div><div class="field"><input id="ew-'+i+'" data-eq="'+i+'" data-ef="why" maxlength="120" autocomplete="off" placeholder="Cuéntalo con tus palabras (opcional)" value="'+esc(e.why||'')+'"></div></div>';
  return '<div class="eqc eqx"><div class="eqh"><span class="eql">'+eqLetter(i)+'</span><span class="eqk">'+eqKindIc(e.kind)+'<b>'+K[0]+'</b></span><button type="button" class="x" data-a="eq-rm" data-i="'+i+'" aria-label="Quitar este cambio">×</button></div>'+modePick+secs.join('')+why+'</div>';
};
var _gb22=gearBlock;
gearBlock=function(d){
  var h=_gb22(d);
  var bar='<div class="eqadd"><small>¿Has cambiado algo durante la salida?</small><div class="eqab">'+
    ['bajo','aparejo','modo'].map(function(k){return '<button type="button" class="eqa" data-a="eq-new" data-k="'+k+'">'+eqKindIc(k)+'<span>+ '+EQK[k][0]+'</span></button>'}).join('')+'</div></div>';
  return h.replace('Si cambias algo durante la salida, añade un cambio de equipo.','Con un solo equipo no hace falta nada más.').replace(/<button type="button" class="btn small" data-a="eq-add">[^<]*<\/button>/,bar);
};
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a="eq-new"],[data-a="eq-xm"],[data-a="eq-xs"],[data-a="eq-xw"],[data-a="ieq-c"]'):null;if(!b)return;
  var a=b.getAttribute('data-a');
  if(a==='ieq-c'){
    var dr=sheetDraftFor(b),it=dr&&dr.items[+b.getAttribute('data-i')];if(!it)return;
    var eqs=dr===tripDraft?tripDraft.equipos:eqList(trips.filter(function(x){return x.id===(($('#cap-trip')||{}).value||capDraft.tripId)})[0]);
    it.eq=b.getAttribute('data-id');eqs.forEach(function(e,k){if(e.id===it.eq)it.eqL=eqLetter(k)});
    b.parentNode.querySelectorAll('.eqpc').forEach(function(x){var on=x===b;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)});return;
  }
  if(!tripDraft)return;
  var L=tripDraft.equipos;
  if(a==='eq-new'){
    var k=b.getAttribute('data-k'),base=JSON.parse(JSON.stringify(L[L.length-1]));
    delete base.nota;delete base.why;delete base._custom;
    base.id=eqId();base.kind=k;
    if(k==='modo'){var cur=L[L.length-1].mode||tripDraft.mode;base.mode=cur==='Spinning'?'Rockfishing':'Spinning';base.aparejo='';base.plomo=''}
    L.push(base);GOPEN.top=true;gearRepaint();return;
  }
  var e=L[+b.getAttribute('data-i')];if(!e)return;
  var v=b.getAttribute('data-v');
  if(a==='eq-xm'){e.mode=v;e.aparejo='';e.senuelo='';e.plomoPos=''}
  else if(a==='eq-xs')e.senuelo=e.senuelo===v?'':v;
  else if(a==='eq-xw')e.why=e.why===v?'':v;
  GOPEN.top=true;gearRepaint();
},true);
/* al cambiar la modalidad de la salida, las modalidades extra conservan lo suyo */
var _pm22=paintModes;
paintModes=function(){
  var d=tripDraft;if(!d)return;
  var keep=(d.equipos||[]).map(function(e){return e.mode?{a:e.aparejo,p:e.plomo}:null});
  _pm22();
  (d.equipos||[]).forEach(function(e,k){if(keep[k]){e.aparejo=keep[k].a;e.plomo=keep[k].p}});
  gearRepaint();
};
/* resúmenes */
var _pill22=eqPillsArr;
eqPillsArr=function(e){var p=_pill22(e);if(e.mode)p.unshift(e.mode);if(e.senuelo)p.splice(1,0,'Señuelo '+e.senuelo);return p};
eqBlockHTML=function(list){
  list=(list||[]).filter(function(e,i){return i>0||!eqEmpty(e)});if(!list.length)return '';
  return '<div class="eqv">'+list.map(function(e,i){
    var p=eqPillsArr(e),K=EQK[e.kind];
    return '<div class="eqrow"><b>'+(list.length>1?'Equipo '+eqLetter(i):'Equipo')+(K?' · '+K[0]:'')+'</b>'+(e.why?'<em>Cambio: '+esc(e.why)+'</em>':'')+(p.length?'<div class="gearv">'+p.map(function(v){return '<span>'+esc(v)+'</span>'}).join('')+'</div>':'')+(e.nota?'<p class="eqnote">'+esc(e.nota)+'</p>':'')+'</div>';
  }).join('')+'</div>';
};
/* por captura: «Con: A B C» visible solo si hay más de un equipo */
gearInject=function(sel,draft,eqsOf){
  var el=$(sel);if(!el||!draft)return;
  Array.prototype.forEach.call(el.querySelectorAll('.irow'),function(r,ix){
    var it=draft.items[ix];if(!it||r.querySelector('.eqpick'))return;
    var eqs=eqsOf(it)||[];if(eqs.length<2)return;
    if(!it.eq)it.eq=eqs[eqs.length-1].id;
    var cur=-1;eqs.forEach(function(e,k){if(e.id===it.eq)cur=k});if(cur<0){cur=0;it.eq=eqs[0].id}
    it.eqL=eqLetter(cur);
    r.insertAdjacentHTML('beforeend','<div class="eqpick"><span>Con</span>'+eqs.map(function(e,k){var K=EQK[e.kind];return '<button type="button" class="eqpc'+(k===cur?' on':'')+'" data-a="ieq-c" data-i="'+ix+'" data-id="'+esc(e.id)+'" aria-pressed="'+(k===cur)+'"><b>'+eqLetter(k)+'</b><small>'+(K?(e.kind==='modo'&&e.mode?esc(e.mode):K[0].split(' ')[0]):'base')+'</small></button>'}).join('')+'</div>');
  });
};
var _st22=document.createElement('style');_st22.textContent='.eqadd{margin-top:12px}.eqadd small{display:block;color:var(--muted);font-size:12px;margin-bottom:6px}.eqab{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.eqa{display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 4px;border-radius:14px;border:1px dashed var(--line2);background:var(--surface);color:var(--ink);font:600 12px/1.2 var(--body,inherit);text-align:center}.eqa svg{width:24px;height:24px;color:var(--accent)}.eqx{border-color:rgba(63,208,201,.35)}.eqk{display:flex;align-items:center;gap:6px;flex:1}.eqk svg{width:20px;height:20px;color:var(--accent)}.eqpick{display:flex;align-items:center;gap:6px;margin-top:8px}.eqpick>span{font:700 11px var(--mono,monospace);text-transform:uppercase;color:var(--muted)}.eqpc{display:flex;align-items:center;gap:5px;padding:6px 10px;border-radius:999px;border:1px solid var(--line2);background:var(--surface);color:var(--ink)}.eqpc b{font-size:13px}.eqpc small{font-size:11px;color:var(--muted)}.eqpc.on{border-color:var(--accent);background:var(--accent-soft)}.eqpc.on small{color:var(--accent)}';
document.head.appendChild(_st22);
var _ts22=eqTopSum;eqTopSum=function(l){return _ts22(l).replace(/ · $/,'').replace(/^(\d+ equipos)$/,function(m){return m+' · '+l.slice(1).map(function(e){return (EQK[e.kind]||[''])[0]}).join(', ')})};
