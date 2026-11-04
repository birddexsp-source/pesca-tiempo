/* ===== p33: compañeros y salida en curso ===== */
var COMPS=[],SESS=null,COMPUI=false,COMPT='draft',CV={view:'list',id:null};
function sessCur(){return SESS}
function compInit(c){return (c&&c.name||'?').trim().charAt(0).toUpperCase()||'?'}
function compName(id){
  var c=COMPS.filter(function(x){return x.id===id})[0];if(c)return c.name;
  var all=[].concat(SESS&&SESS.companions||[],tripDraft&&tripDraft.companions||[]);trips.forEach(function(t){all=all.concat(t.companions||[])});
  c=all.filter(function(x){return x.id===id})[0];return c?c.name:'';
}
(function(){var s=document.createElement('style');s.textContent=
'.comphead{display:flex;align-items:center;gap:8px}.comphead h3{flex:1;margin:0}'+
'.comprow{display:flex;align-items:center;gap:10px;padding:8px 0;border-top:1px solid var(--line)}.comprow:first-of-type{border-top:0}.comprow b{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'+
'.comprow select{max-width:130px;min-width:0}.comprow .x{flex:none}'+
'.cav{flex:none;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;font:700 15px var(--display);background:rgba(58,208,200,.18);color:var(--accent,#3ad0c8)}'+
'.cpanel{margin-top:10px;padding-top:10px;border-top:1px dashed var(--line)}.cpanel .row{display:flex;gap:8px;margin-top:8px}.cpanel .row input{flex:1;min-width:0}'+
'.startblk{border-color:rgba(58,208,200,.45)!important;background:linear-gradient(180deg,rgba(58,208,200,.10),transparent)}.startblk .btn{width:100%;margin-top:6px;font-size:16px;padding:14px}'+
'#sessbar{display:flex;align-items:center;gap:10px;margin:0 12px 8px;padding:9px 10px 9px 12px;border-radius:14px;border:1.5px solid rgba(58,208,200,.55);background:rgba(10,40,44,.92);backdrop-filter:blur(6px);position:relative;z-index:5}'+
'#sessbar .dot{flex:none;width:10px;height:10px;border-radius:50%;background:#ff5c5c;box-shadow:0 0 0 0 rgba(255,92,92,.7);animation:sdot 1.6s infinite}@keyframes sdot{70%{box-shadow:0 0 0 9px rgba(255,92,92,0)}100%{box-shadow:0 0 0 0 rgba(255,92,92,0)}}'+
'#sessbar .sbt{flex:1;min-width:0;text-align:left;background:none;border:0;color:inherit;padding:0}#sessbar .sbt b{display:block;font:700 14px var(--display)}#sessbar .sbt small{display:block;color:var(--muted);font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#sessbar .btn{flex:none}'+
'.whorow{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:0 0 8px}.whorow small{color:var(--muted);margin-right:2px}.whorow .chip{padding:5px 11px;font-size:13px}'+
'.centry{display:flex;align-items:center;gap:10px;width:100%;text-align:left;margin:0 0 10px;padding:11px 12px;border-radius:14px;border:1.5px solid var(--line);background:var(--surface);color:inherit}.centry b{flex:1}.centry small{color:var(--muted)}'+
'.cvs{margin:8px 0 12px}.cvs .cvbars{display:flex;width:100%;height:12px;border-radius:6px;overflow:hidden;background:rgba(255,255,255,.07)}.cvs .cvbars i{display:block;height:100%}.cvs .cvbars i.me{background:var(--accent,#3ad0c8)}.cvs .cvbars i.he{background:#ffbe3c}'+
'.cvs .nums{display:flex;justify-content:space-between;margin-top:6px;font-size:13px}.cvs .nums b{font:700 22px var(--display);display:block}.cvs .nums .me{color:var(--accent,#3ad0c8)}.cvs .nums .he{color:#ffbe3c;text-align:right}.cvs .nums .tt{text-align:center}'+
'.ctab{width:100%;border-collapse:collapse;font-size:14px}.ctab td,.ctab th{padding:6px 4px;border-top:1px solid var(--line);text-align:right}.ctab th{font-weight:600;color:var(--muted);font-size:12px}.ctab td:first-child,.ctab th:first-child{text-align:left}';
document.head.appendChild(s)})();

/* ---------- datos ---------- */
(function(){var t=setInterval(function(){if(typeof db==='undefined'||!db)return;clearInterval(t);
  db.collection('companeros').onSnapshot(function(s){COMPS=s.docs.map(function(d){var o=JSON.parse(JSON.stringify(d.data()||{}));o.id=d.id;return o}).filter(function(x){return x.name});if(CV.open)compRepaint()},function(){});
  db.collection('sesiones').onSnapshot(function(s){var a=s.docs.filter(function(d){return d.id==='activa'})[0];SESS=a?Object.assign({id:'activa'},JSON.parse(JSON.stringify(a.data()||{}))):null;sessPaint()},function(){});
  setInterval(sessPaint,30000);
},500)})();
function compGet(name){
  name=String(name||'').trim();if(!name)return null;
  var c=COMPS.filter(function(x){return norm(x.name)===norm(name)})[0];if(c)return c;
  var ref=db.collection('companeros').doc();c={id:ref.id,name:name};COMPS.push(c);
  ref.set({name:name,createdAt:Date.now()}).catch(function(){toast('No se pudo guardar el compañero')});return c;
}
function modeNames(){return (typeof MODOS!=='undefined'?MODOS.map(function(m){return m.n}):MODES).filter(function(n){return n!=='Solo mirar el mar'})}

/* ---------- compañeros en Nueva salida ---------- */
function compList(){return COMPT==='sess'?(SESS&&SESS.companions||[]):(tripDraft&&tripDraft.companions||[])}
function compRows(L){
  return L.map(function(c,i){
    return '<div class="comprow"><span class="cav">'+esc(compInit(c))+'</span><b>'+esc(c.name)+'</b><select data-a="comp-mode" data-i="'+i+'" aria-label="Modalidad de '+esc(c.name)+'"><option value="">¿Modalidad?</option>'+modeNames().map(function(m){return '<option'+(c.mode===m?' selected':'')+'>'+esc(m)+'</option>'}).join('')+'</select><button type="button" class="x" data-a="comp-rm" data-i="'+i+'" aria-label="Quitar a '+esc(c.name)+'">×</button></div>';
  }).join('');
}
function compPanel(L){
  if(!COMPUI)return '';
  var free=COMPS.filter(function(c){return !L.some(function(x){return x.id===c.id})}).sort(function(a,b){return a.name.localeCompare(b.name,'es')});
  return '<div class="cpanel">'+(free.length?'<span class="invl">Tus compañeros</span><div class="chips">'+free.map(function(c){return '<button type="button" class="chip" data-a="comp-pick" data-id="'+esc(c.id)+'">'+esc(c.name)+'</button>'}).join('')+'</div>':'')+
    '<span class="invl" style="margin-top:8px;display:block">Nuevo compañero</span><div class="row"><input id="comp-new" maxlength="40" autocomplete="off" placeholder="Nombre" aria-label="Nombre del compañero"><button type="button" class="btn primary" data-a="comp-new">Añadir</button></div></div>';
}
function compBlock(){
  var L=compList();
  return '<div class="block" id="compblk"><div class="comphead"><h3>Compañeros</h3><button type="button" class="btn small'+(COMPUI?'':' primary')+'" data-a="comp-add">'+(COMPUI?'Cerrar':'+ Añadir')+'</button></div>'+
    (L.length?compRows(L):'<p class="hint">¿Has salido con alguien? Añádelo para comparar capturas.</p>')+compPanel(L)+'</div>';
}
function compRepaint(){
  var el=document.getElementById('compblk');if(el)el.outerHTML=compBlock();
  if(document.getElementById('sessbody'))sessSheetPaint();
  if(CV.open&&document.getElementById('compbody'))compViewPaint();
}
var _stepSite33=stepSite;
stepSite=function(){
  var h=_stepSite33(),d=tripDraft;if(!d)return h;if(!d.companions)d.companions=[];COMPT='draft';
  var add=compBlock();
  if(!d.id&&!d.fromQuick&&!d.fromSweep&&!d.fromSess&&!SESS)add+='<div class="block startblk"><h3>¿Ya estás pescando?</h3><p class="hint">Elige modalidad y compañeros y empieza. Con ⚡ y el barrido marcas capturas y spots (tuyas o de tus compañeros). Al terminar, lo ordenas en casa.</p><button type="button" class="btn primary" data-a="sess-start">Empezar salida ahora</button></div>';
  var i=h.indexOf('<div id="gearblk">');return i<0?h+add:h.slice(0,i)+add+h.slice(i);
};
function compAdd(c,mode){
  var L=compList();if(L.some(function(x){return x.id===c.id}))return;
  var m=mode||(COMPT==='sess'?(SESS&&SESS.mode):(tripDraft&&tripDraft.mode))||'';
  L.push({id:c.id,name:c.name,mode:m});
  if(COMPT==='sess'&&SESS)db.doc('sesiones/activa').update({companions:SESS.companions}).catch(function(){});
}
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a^="comp-"],[data-a^="sess-"],[data-a="qc-who"],[data-a="item-who"],[data-a="cv-open"],[data-a="cv-back"],[data-a="cv-new"],[data-a="open-comps"]'):null;if(!b)return;
  var a=b.getAttribute('data-a');
  if(a==='comp-add'){COMPUI=!COMPUI;compRepaint();if(COMPUI){var i=document.getElementById('comp-new');if(i)i.focus()}}
  else if(a==='comp-pick'){var c=COMPS.filter(function(x){return x.id===b.getAttribute('data-id')})[0];if(c)compAdd(c);compRepaint()}
  else if(a==='comp-new'){var inp=document.getElementById('comp-new'),nm=inp&&inp.value.trim();if(!nm){toast('Escribe el nombre');return}compAdd(compGet(nm));COMPUI=true;compRepaint();var i2=document.getElementById('comp-new');if(i2)i2.focus()}
  else if(a==='comp-rm'){compList().splice(+b.getAttribute('data-i'),1);if(COMPT==='sess'&&SESS)db.doc('sesiones/activa').update({companions:SESS.companions}).catch(function(){});compRepaint()}
  else if(a==='sess-start')sessStart();
  else if(a==='sess-open')sessOpen();
  else if(a==='sess-end')sessEnd();
  else if(a==='sess-finish')sessFinish();
  else if(a==='qc-who'){if(QC){QC.who=b.getAttribute('data-id')||'';if(SESS)SESS.lastWho=QC.who;qcPaint()}}
  else if(a==='item-who'){var d=tripDraft,ix=+b.getAttribute('data-i'),it=d&&d.items[ix];if(it){var w=b.getAttribute('data-w')||'';if(w)it.who=w;else delete it.who;var row=b.parentNode;row.querySelectorAll('.chip').forEach(function(x){var on=(x.getAttribute('data-w')||'')===w;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)})}}
  else if(a==='open-comps')compOpen();
  else if(a==='cv-open'){CV.view='detail';CV.id=b.getAttribute('data-id');compViewPaint()}
  else if(a==='cv-back'){CV.view='list';CV.id=null;compViewPaint()}
  else if(a==='cv-new'){var n=document.getElementById('cv-name'),v=n&&n.value.trim();if(!v){toast('Escribe el nombre');return}compGet(v);n.value='';compViewPaint()}
},true);
document.addEventListener('change',function(ev){
  var s=ev.target;if(!s||!s.getAttribute||s.getAttribute('data-a')!=='comp-mode')return;
  var L=compList(),c=L[+s.getAttribute('data-i')];if(!c)return;c.mode=s.value;
  if(COMPT==='sess'&&SESS)setTimeout(function(){db.doc('sesiones/activa').update({companions:SESS.companions}).catch(function(){})},0);
},true);
document.addEventListener('keydown',function(ev){if(ev.key==='Enter'&&ev.target&&ev.target.id==='comp-new'){ev.preventDefault();var b=document.querySelector('[data-a="comp-new"]');if(b)b.click()}},true);

/* ---------- salida en curso ---------- */
function sessMine(){return catches.filter(function(c){return SESS&&c.sess===SESS.id&&c.quick})}
function sessCounts(){
  var m=0,o=0;sessMine().forEach(function(c){(c.items||[]).forEach(function(i){if(i.st==='esc')return;if(i.who)o+=i.n||1;else m+=i.n||1})});return {m:m,o:o};
}
function sessElapsed(){var mi=Math.max(0,Math.round((Date.now()-(SESS.startedAt||Date.now()))/60000));return mi<60?mi+' min':Math.floor(mi/60)+' h '+('0'+(mi%60)).slice(-2)}
function sessPaint(){
  var old=document.getElementById('sessbar');
  if(!SESS){if(old)old.remove();return}
  var cs=sessCounts(),who=['Tú'].concat((SESS.companions||[]).map(function(c){return c.name})).join(' + ');
  var h='<span class="dot"></span><button type="button" class="sbt" data-a="sess-open"><b>Salida en curso · '+esc(sessElapsed())+'</b><small>'+esc(who)+' · '+cs.m+(cs.o?' tuyas · '+cs.o+' de ellos':(cs.m===1?' captura':' capturas'))+'</small></button><button type="button" class="btn small primary" data-a="sess-end">Terminar</button>';
  if(old){old.innerHTML=h;return}
  var tb=document.querySelector('.topbar');if(!tb)return;
  var el=document.createElement('div');el.id='sessbar';el.innerHTML=h;tb.insertAdjacentElement('afterend',el);
}
var _renderMain33=renderMain;
renderMain=function(){_renderMain33.apply(this,arguments);sessPaint()};
function sessStart(){
  var d=tripDraft;if(!d||!db)return;
  var s={startedAt:Date.now(),date:todayISO(),mode:d.mode||null,siteId:d.siteId||null,siteName:d.siteName||'',companions:(d.companions||[]).map(function(c){var o={id:c.id,name:c.name};if(c.mode)o.mode=c.mode;return o})};
  db.doc('sesiones/activa').set(s).catch(function(){toast('No se pudo empezar')});
  SESS=Object.assign({id:'activa'},s);
  tripDraft=null;COMPUI=false;closeSheet();sessPaint();
  toast('Salida en curso: usa ⚡ para capturas y el barrido para spots');
}
function sessSheetBody(){
  var L=SESS.companions||[],cs=sessCounts(),Q=sessMine().sort(function(a,b){return (b.ts||0)-(a.ts||0)});
  COMPT='sess';
  return '<div class="block"><div class="comphead"><h3>'+esc(SESS.mode||'Salida')+'</h3><small class="hint">desde las '+esc(new Date(SESS.startedAt).toTimeString().slice(0,5))+' · '+esc(sessElapsed())+'</small></div>'+(SESS.siteName?'<p class="hint">'+esc(SESS.siteName)+'</p>':'')+'<p class="hint">'+cs.m+' tuyas'+(L.length?' · '+cs.o+' de compañeros':'')+'</p></div>'+
    compBlock()+
    '<div class="block"><h3>Capturas de hoy</h3>'+(Q.length?Q.map(function(c){return qcRow(c).replace(/<button type="button" class="btn small" data-a="qc-spot-make"[\s\S]*?<\/button>/,'')}).join(''):'<p class="hint">Aún nada. Usa ⚡ en la cabecera para anotar cada captura.</p>')+'</div>';
}
function sessSheetPaint(){var el=document.getElementById('sessbody');if(el&&SESS)el.innerHTML=sessSheetBody()}
function sessOpen(){
  if(!SESS)return;COMPUI=false;COMPT='sess';
  openSheet('Salida en curso','<div id="sessbody">'+sessSheetBody()+'</div>','<button class="btn" data-a="close-sheet">Seguir pescando</button><button class="btn primary" data-a="sess-finish">Terminar salida</button>','sess');
}
function sessEnd(){sessOpen()}
function sessFinish(){
  var s=SESS;if(!s)return;
  var q=quickList().filter(function(c){return c.date===s.date&&c.sess===s.id});
  db.doc('sesiones/activa').delete().catch(function(){});
  SESS=null;COMPUI=false;COMPT='draft';closeSheet();sessPaint();
  if(q.length)qcOrder(s.date);else openTripEditor(null);
  var d=tripDraft;if(!d)return;
  d.date=s.date;if(s.mode)d.mode=s.mode;d.companions=(s.companions||[]).map(function(c){return {id:c.id,name:c.name,mode:c.mode||''}});
  if(s.siteId){var st=siteOf(s.siteId);if(st){d.siteId=st.id;d.siteName=st.name;d.siteLat=st.lat;d.siteLon=st.lon;d.siteDesc=st.desc||'';d.siteDescOrig=st.desc||''}}
  d.fromSess=true;renderStep();
  toast('Salida terminada. Completa lo que falte (ahora o en casa) y guarda.');
}

/* ---------- ¿de quién? en captura rápida y en las capturas ---------- */
function whoChips(cur,act,extra){
  var L=SESS?SESS.companions||[]:(tripDraft&&tripDraft.companions||[]);
  return '<button type="button" class="chip'+(!cur?' on':'')+'" data-a="'+act+'" data-w="" data-id=""'+extra+' aria-pressed="'+(!cur)+'">Yo</button>'+L.map(function(c){var on=cur===c.id;return '<button type="button" class="chip'+(on?' on':'')+'" data-a="'+act+'" data-w="'+esc(c.id)+'" data-id="'+esc(c.id)+'"'+extra+' aria-pressed="'+on+'">'+esc(c.name)+'</button>'}).join('');
}
var _quickBody33=quickBody;
quickBody=function(){
  var h=_quickBody33();
  if(!SESS||!(SESS.companions||[]).length||!QC)return h;
  if(QC.who===undefined)QC.who=SESS.lastWho||'';
  return '<div class="field"><label>¿De quién es?</label><div class="chips">'+whoChips(QC.who,'qc-who','')+'</div></div>'+h;
};
var _qcRow33=qcRow;
qcRow=function(c){var h=_qcRow33(c),w=(c.items||[])[0]&&c.items[0].who;if(!c.sess)return h;var nm=w?(compName(w)||'compañero'):'Tú';return h.replace('<small class="','<span class="qd">'+esc(nm)+'</span><small class="')};
var _renderItems33=renderItems;
renderItems=function(){
  _renderItems33();
  var el=$('#cap-items'),d=tripDraft;if(!el||!d||!(d.companions||[]).length)return;
  el.querySelectorAll('.irow').forEach(function(r,ix){
    var it=d.items[ix];if(!it||r.querySelector('.whorow'))return;
    r.insertAdjacentHTML('afterbegin','<div class="whorow"><small>¿De quién?</small>'+whoChips(it.who||'','item-who',' data-i="'+ix+'"')+'</div>');
  });
};
var _itemChip33=itemChip;
itemChip=function(i){var h=_itemChip33(i);var w=i&&i.who&&compName(i.who);return w?h.replace(/<\/span>$/,'<small class="gx">'+esc(w)+'</small></span>'):h};

/* ---------- pantalla Compañeros ---------- */
function compStats(){
  var R={};
  COMPS.forEach(function(c){R[c.id]={id:c.id,name:c.name,trips:[],me:0,he:0,sp:{},meSp:{},heSp:{}}});
  trips.forEach(function(t){
    (t.companions||[]).forEach(function(c){
      var r=R[c.id]||(R[c.id]={id:c.id,name:c.name,trips:[],me:0,he:0,sp:{},meSp:{},heSp:{}});
      var m=0,h=0;
      catches.filter(function(x){return x.tripId===t.id}).forEach(function(x){(x.items||[]).forEach(function(i){
        if(i.st==='esc')return;var n=+i.n||0;
        if(i.who===c.id){h+=n;r.heSp[i.species]=(r.heSp[i.species]||0)+n}
        else if(!i.who){m+=n;r.meSp[i.species]=(r.meSp[i.species]||0)+n}
      })});
      r.me+=m;r.he+=h;r.trips.push({t:t,me:m,he:h,mode:c.mode||''});
    });
  });
  return R;
}
function cvBar(me,he,nme,nhe){
  var tt=me+he,pm=tt?Math.round(me/tt*100):50;
  return '<div class="cvs"><div class="cvbars"><i class="me" style="width:'+pm+'%"></i><i class="he" style="width:'+(tt?100-pm:50)+'%"></i></div><div class="nums"><span class="me"><b>'+me+'</b>'+esc(nme)+'</span><span class="tt"><b>'+tt+'</b>entre los dos</span><span class="he"><b>'+he+'</b>'+esc(nhe)+'</span></div></div>';
}
function compViewBody(){
  var R=compStats();
  if(CV.view==='detail'&&R[CV.id]){
    var r=R[CV.id],sp=Object.keys(Object.assign({},r.meSp,r.heSp));
    sp.sort(function(a,b){return ((r.meSp[b]||0)+(r.heSp[b]||0))-((r.meSp[a]||0)+(r.heSp[a]||0))});
    var h='<div class="eqtop"><button type="button" class="eqback" data-a="cv-back">‹ Compañeros</button></div><div class="comphead" style="margin:0 0 6px"><span class="cav">'+esc(compInit(r))+'</span><h3 style="font-size:20px">'+esc(r.name)+'</h3></div><p class="hint">'+r.trips.length+(r.trips.length===1?' salida juntos':' salidas juntos')+'</p>'+cvBar(r.me,r.he,'Tú',r.name);
    if(sp.length)h+='<div class="block"><h3>Por especie</h3><table class="ctab"><tr><th>Especie</th><th>Tú</th><th>'+esc(r.name)+'</th><th>Total</th></tr>'+sp.map(function(s){var a=r.meSp[s]||0,b=r.heSp[s]||0;return '<tr><td>'+esc(s)+'</td><td>'+a+'</td><td>'+b+'</td><td><b>'+(a+b)+'</b></td></tr>'}).join('')+'</table></div>';
    h+='<div class="block"><h3>Salidas juntos</h3><table class="ctab"><tr><th>Día</th><th>Tú</th><th>'+esc(r.name)+'</th></tr>'+r.trips.sort(function(a,b){return String(b.t.date).localeCompare(String(a.t.date))}).map(function(x){return '<tr><td>'+esc(shortD(x.t.date))+' · '+esc(x.t.siteName||'')+'<br><small class="hint">tú '+esc(x.t.mode||'—')+' · él '+esc(x.mode||'—')+'</small></td><td>'+x.me+'</td><td>'+x.he+'</td></tr>'}).join('')+'</table></div>';
    return h;
  }
  var ids=Object.keys(R).sort(function(a,b){return R[b].trips.length-R[a].trips.length||R[a].name.localeCompare(R[b].name,'es')});
  var me=0,he=0;ids.forEach(function(i){me+=R[i].me;he+=R[i].he});
  var h2='<div class="block"><h3>Nuevo compañero</h3><div class="cpanel" style="border:0;margin:0;padding:0"><div class="row"><input id="cv-name" maxlength="40" autocomplete="off" placeholder="Nombre"><button type="button" class="btn primary" data-a="cv-new">Añadir</button></div></div></div>';
  if(!ids.length)return h2+'<p class="hint">Aquí aparecerán las personas con las que pesques y cuánto capturáis cada uno. Se añaden al crear una salida («+ Añadir» en Compañeros).</p>';
  return h2+(me+he?'<div class="block"><h3>Contigo y ellos</h3>'+cvBar(me,he,'Tú','Compañeros')+'</div>':'')+
    '<div class="block"><h3>Compañeros</h3>'+ids.map(function(i){var r=R[i];return '<button type="button" class="centry" data-a="cv-open" data-id="'+esc(r.id)+'"><span class="cav">'+esc(compInit(r))+'</span><b>'+esc(r.name)+'</b><small>'+r.trips.length+(r.trips.length===1?' salida':' salidas')+' · tú '+r.me+' – '+r.he+'</small></button>'}).join('')+'</div>';
}
function compViewPaint(){var el=document.getElementById('compbody');if(el)el.innerHTML=compViewBody()}
function compOpen(){CV={view:'list',id:null,open:true};openSheet('Compañeros','<div id="compbody">'+compViewBody()+'</div>','<button class="btn" data-a="close-sheet">Cerrar</button>','comp')}
var _closeSheet33=closeSheet;
closeSheet=function(){CV.open=false;COMPUI=false;COMPT='draft';_closeSheet33()};
var _renderSalidas33=renderSalidas;
renderSalidas=function(){
  var n=COMPS.length;
  return '<button type="button" class="centry" data-a="open-comps"><span class="cav"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.4"/><path d="M17 14c2.6 0 4.5 2 4.5 5"/></svg></span><b>Compañeros</b><small>'+(n?n+(n===1?' persona':' personas'):'Compara tus capturas')+'</small></button>'+_renderSalidas33();
};
