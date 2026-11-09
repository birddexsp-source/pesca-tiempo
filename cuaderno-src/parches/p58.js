/* ===== p58: Ajustes → «Completar salidas anteriores»: qué datos nuevos faltan en tus salidas y rellenarlos ahí mismo ===== */
var CMF=[
  ['h','Horas','para calcular sargos por hora'],
  ['agua','Agua','para aprender cómo rinde cada color de agua'],
  ['cebo','Cebo','para las hipótesis de cebo y bogas'],
  ['ola','Ola','para que cada spot aprenda su rango de ola'],
  ['viento','Viento','para que cada spot aprenda su rango de viento']
];
var CM={ed:{},rows:{},f:'todo',skipKey:'cuaderno-cm-skip'};
function cmSkips(){try{return JSON.parse(localStorage.getItem(CM.skipKey)||'{}')||{}}catch(e){return {}}}
function cmSkipSave(o){try{localStorage.setItem(CM.skipKey,JSON.stringify(o))}catch(e){}}
function cmKey(l){return l.tripId+'|'+l.stopId}
function cmVal(l,f){var e=CM.ed[cmKey(l)];return e&&f in e?e[f]:(f==='agua'?l.agua:l[f])}
/* qué aplica y qué falta en una visita (según lo ya guardado, sin contar lo apuntado en esta sesión) */
function cmApplies(l,f){
  if(!l.date||l.date>todayISO())return false;
  var look=l.mode==='Solo mirar el mar';
  if(f==='h'||f==='cebo')return !look;
  if(f==='agua')return String(l.stopId)!=='0';
  if(f==='ola')return l.wave!=null&&l.wave!=='';
  if(f==='viento')return l.wind!=null&&l.wind!=='';
  return false;
}
function cmHas(l,f){
  if(f==='h')return !!(l.tFrom&&l.tTo);
  if(f==='agua')return !!l.agua;
  if(f==='cebo')return !!(l.baits&&l.baits.length);
  if(f==='ola')return !!l.waveV;
  if(f==='viento')return !!l.windV;
  return true;
}
function cmStats(){
  var sk=cmSkips(),S={},k;CMF.forEach(function(c){S[c[0]]={n:0,ok:0,miss:[]}});
  legs.forEach(function(l){CMF.forEach(function(c){var f=c[0];if(!cmApplies(l,f)||sk[cmKey(l)])return;S[f].n++;if(cmHas(l,f))S[f].ok++;else S[f].miss.push(l)})});
  return S;
}
function cmDate(iso){try{return new Date(iso+'T12:00:00').toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'numeric'})}catch(e){return iso}}
/* guardar en la salida: en la parada, o en la propia salida si es antigua y no tiene paradas */
function cmSave(l,patch){
  var key=cmKey(l);CM.ed[key]=Object.assign(CM.ed[key]||{},patch);
  if(patch.agua!==undefined)return agWrite(l.stopId,{agua:patch.agua||null});
  var t=trips.find(function(x){return x.id===l.tripId});if(!t||!db)return;
  var up={editedAt:Date.now()};
  if(t.stops&&t.stops.length){
    var st=JSON.parse(JSON.stringify(t.stops));
    st.forEach(function(s){if(String(s.id)===String(l.stopId))Object.assign(s,patch)});
    up.stops=st;
  }else Object.assign(up,patch);
  return db.doc('trips/'+t.id).update(up).catch(function(){toast('No se pudo guardar')});
}
function cmChoice(f,v,l,opts){
  return '<div class="cmch">'+opts.map(function(o){return '<button type="button" class="cmb'+(v===o[0]?' on':'')+'" data-a="cm-set" data-f="'+f+'" data-k="'+esc(cmKey(l))+'" data-v="'+esc(o[0])+'" aria-pressed="'+(v===o[0])+'">'+esc(o[1])+'</button>'}).join('')+'</div>';
}
function cmRow(l,f){
  var c=CMF.filter(function(x){return x[0]===f})[0],k=esc(cmKey(l)),h='';
  if(f==='h'){
    h='<div class="cmt"><label>Desde<input type="time" data-cmt="tFrom" data-k="'+k+'" value="'+esc(cmVal(l,'tFrom')||'')+'"></label><label>Hasta<input type="time" data-cmt="tTo" data-k="'+k+'" value="'+esc(cmVal(l,'tTo')||'')+'"></label></div>';
  }else if(f==='agua'){
    h='<div class="agc sm">'+AGL.map(function(q){return '<button type="button" class="ag '+q[0]+(cmVal(l,'agua')===q[0]?' on':'')+'" data-a="cm-set" data-f="agua" data-k="'+k+'" data-v="'+q[0]+'" aria-pressed="'+(cmVal(l,'agua')===q[0])+'"><i></i>'+q[1]+'</button>'}).join('')+'</div>';
  }else if(f==='cebo'){
    var cur=cmVal(l,'baits')||[],names=recentBaits(10);cur.forEach(function(n){if(names.map(norm).indexOf(norm(n))<0)names.push(n)});
    h='<div class="cmch wrap">'+names.map(function(n){var on=cur.map(norm).indexOf(norm(n))>-1;return '<button type="button" class="cmb'+(on?' on':'')+'" data-a="cm-bait" data-k="'+k+'" data-v="'+esc(n)+'" aria-pressed="'+on+'">'+esc(n)+'</button>'}).join('')+'</div>';
  }else if(f==='ola'){
    h=cmChoice('waveV',cmVal(l,'waveV'),l,[['poco','Poco'],['ok','Perfecto'],['mucho','Demasiado']]);
  }else if(f==='viento'){
    h=cmChoice('windV',cmVal(l,'windV'),l,[['poco','Poco'],['ok','Perfecto'],['mucho','Demasiado']]);
  }
  var lab=f==='ola'?'¿Cómo estaba la ola de '+num(l.wave)+' m?':f==='viento'?'¿Cómo estaba el viento de '+num(l.wind,0)+' kph?':f==='h'?'Horas pescando':f==='agua'?'Color del agua':'Cebo usado';
  return '<div class="cmr" data-f="'+f+'"><span class="eyebrow">'+lab+'</span>'+h+'</div>';
}
function cmCard(l){
  var k=cmKey(l),rows=CM.rows[k]||[],I=agInfer(l);
  return '<article class="cmc" data-k="'+esc(k)+'"><header><b>'+esc(l.spotName||'Sin spot')+'</b><span>'+esc(cmDate(l.date))+(l.mode?' · '+esc(l.mode):'')+(I.any?' · '+I.n+(I.n===1?' pez':' peces'):'')+'</span></header>'+
    rows.filter(function(f){return CM.f==='todo'||CM.f===f}).map(function(f){return cmRow(l,f)}).join('')+
    '<button type="button" class="btn small ghost cmskip" data-a="cm-skip" data-k="'+esc(k)+'">No lo sé</button></article>';
}
function cmList(){
  var sk=cmSkips(),out=[];
  legs.slice().sort(function(a,b){return String(b.date).localeCompare(String(a.date))}).forEach(function(l){
    if(sk[cmKey(l)])return;
    var k=cmKey(l);
    if(!(k in CM.rows)){CM.rows[k]=CMF.map(function(c){return c[0]}).filter(function(f){return cmApplies(l,f)&&!cmHas(l,f)})}
    if(CM.rows[k].length&&(CM.f==='todo'||CM.rows[k].indexOf(CM.f)>-1))out.push(l);
  });
  return out;
}
function cmBody(){
  var S=cmStats(),h='<div class="cmf" role="tablist">'+[['todo','Todo']].concat(CMF.map(function(c){return [c[0],c[1]]})).map(function(c){
    return '<button type="button" class="cmb'+(CM.f===c[0]?' on':'')+'" data-a="cm-f" data-v="'+c[0]+'">'+c[1]+(c[0]!=='todo'?' <i>'+S[c[0]].miss.length+'</i>':'')+'</button>'}).join('')+'</div>';
  var f=CMF.filter(function(c){return c[0]===CM.f})[0];
  h+='<p class="hint">'+(f?'Sirve '+f[2]+'. ':'')+'Rellena solo lo que recuerdes; lo que no sepas, déjalo (o «No lo sé»). Nada se inventa.</p>';
  var L=cmList();
  h+=L.length?'<div class="cmlist">'+L.map(cmCard).join('')+'</div>':'<div class="notice">Todo al día'+(f?' en «'+f[1]+'»':'')+'. 🎣</div>';
  return h;
}
function cmRender(){var b=document.getElementById('sheetbody');if(b)b.innerHTML=cmBody()}
function cmOpen(){
  CM.ed={};CM.rows={};CM.f='todo';
  openSheet('Completar salidas',cmBody(),'<button class="btn" data-a="cm-back">‹ Ajustes</button><button class="btn primary" data-a="close-sheet">Hecho</button>');
}
/* bloque en Ajustes */
var _os58=openSettings;
openSettings=function(){
  _os58.apply(this,arguments);
  var b=document.getElementById('sheetbody');if(!b||b.querySelector('#cmblk'))return;
  var S=cmStats(),tot=0,miss=0,rows='';
  var vis={};CMF.forEach(function(c){S[c[0]].miss.forEach(function(l){vis[cmKey(l)]=1});tot+=S[c[0]].n;miss+=S[c[0]].miss.length;
    var p=S[c[0]].n?Math.round(100*S[c[0]].ok/S[c[0]].n):100;
    rows+='<div class="cmp"><span>'+c[1]+'</span><div class="cmbar"><i style="width:'+p+'%"></i></div><b>'+S[c[0]].ok+'/'+S[c[0]].n+'</b></div>'});
  var nv=Object.keys(vis).length,d=document.createElement('div');d.id='cmblk';d.className='block';
  d.innerHTML='<h3>Completar salidas anteriores</h3><p class="hint">'+(nv?nv+(nv===1?' salida tiene':' salidas tienen')+' datos sin marcar. Cuantos más pongas, mejor aprende el maestro y cada spot.':'Todas tus salidas tienen los datos al día.')+'</p>'+rows+
    '<button type="button" class="btn'+(nv?' primary':'')+'" data-a="cm-open" style="width:100%;margin-top:10px">'+(nv?'Revisar y completar':'Ver salidas')+'</button>';
  b.insertBefore(d,b.firstChild);
};
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a^="cm-"]'):null;if(!b)return;
  var a=b.getAttribute('data-a'),k=b.getAttribute('data-k'),l=k?legs.find(function(x){return cmKey(x)===k}):null;
  if(a==='cm-open'){cmOpen();return}
  if(a==='cm-back'){openSettings();return}
  if(a==='cm-f'){CM.f=b.getAttribute('data-v');cmRender();return}
  if(!l)return;
  var card=function(){var el=document.querySelector('.cmc[data-k="'+k.replace(/"/g,'\\"')+'"]');if(el){var t=document.createElement('div');t.innerHTML=cmCard(l);el.replaceWith(t.firstChild)}};
  if(a==='cm-set'){
    var f=b.getAttribute('data-f'),v=b.getAttribute('data-v'),cur=cmVal(l,f),nv=cur===v?null:v;
    var p={};p[f]=nv;cmSave(l,p);card();return;
  }
  if(a==='cm-bait'){
    var n=b.getAttribute('data-v'),cur=(cmVal(l,'baits')||[]).slice(),i=cur.map(norm).indexOf(norm(n));
    if(i>-1)cur.splice(i,1);else cur.push(n);
    cmSave(l,{baits:cur});card();return;
  }
  if(a==='cm-skip'){var s=cmSkips();s[k]=1;cmSkipSave(s);delete CM.rows[k];var el=b.closest('.cmc');if(el)el.remove();if(!document.querySelector('.cmc'))cmRender();return}
});
document.addEventListener('change',function(ev){
  var i=ev.target&&ev.target.getAttribute&&ev.target.getAttribute('data-cmt');if(!i)return;
  var k=ev.target.getAttribute('data-k'),l=legs.find(function(x){return cmKey(x)===k});if(!l)return;
  var p={};p[i]=ev.target.value||'';cmSave(l,p);
});
/* la caché del maestro debe enterarse de que cambió una salida */
var _mk58=mdKey;
mdKey=function(){return _mk58()+'|'+trips.reduce(function(s,t){return s+(t.editedAt||0)},0)};
(function(){var s=document.createElement('style');s.textContent=
'#cmblk .cmp{display:grid;grid-template-columns:64px 1fr 42px;gap:10px;align-items:center;margin:6px 0;font-size:13.5px}#cmblk .cmp b{font-family:var(--mono);font-size:12px;color:var(--muted);text-align:right;font-weight:500}'+
'.cmbar{height:6px;border-radius:99px;background:var(--surface2);overflow:hidden}.cmbar i{display:block;height:100%;background:var(--accent);border-radius:99px}'+
'.cmf{display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;margin-bottom:6px}.cmf .cmb i{font-style:normal;font-family:var(--mono);font-size:11px;opacity:.7;margin-left:3px}'+
'.cmb{min-height:38px;padding:7px 12px;border-radius:99px;border:1px solid var(--line);background:var(--surface2);color:var(--ink);font:inherit;font-size:13.5px;white-space:nowrap}.cmb.on{background:var(--accent-soft);border-color:var(--accent);color:var(--accent)}'+
'.cmlist{display:flex;flex-direction:column;gap:12px}.cmc{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:12px 14px}'+
'.cmc header{display:flex;flex-direction:column;gap:2px;margin-bottom:6px}.cmc header span{color:var(--muted);font-size:12.5px}'+
'.cmr{margin:10px 0}.cmr .eyebrow{display:block;margin-bottom:5px}.cmch{display:flex;gap:6px}.cmch.wrap{flex-wrap:wrap}.cmch:not(.wrap) .cmb{flex:1}'+
'.cmt{display:grid;grid-template-columns:1fr 1fr;gap:8px}.cmt label{display:flex;flex-direction:column;gap:3px;font-size:12px;color:var(--muted)}.cmt input{min-height:42px;border-radius:10px;border:1px solid var(--line);background:var(--surface2);color:var(--ink);font:inherit;padding:6px 10px}'+
'.cmskip{margin-top:4px}';
document.head.appendChild(s)})();
