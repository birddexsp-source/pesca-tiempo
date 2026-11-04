/* ===== p23: Mi equipo con fotos (AliExpress), señuelos, orden y descripción ===== */
INVK.splice(0,INVK.length,{k:'senuelo',t:'Señuelos',one:'señuelo'},{k:'cana',t:'Cañas',one:'caña'},{k:'carrete',t:'Carretes',one:'carrete'},{k:'corcho',t:'Corchos',one:'corcho'},{k:'anzuelo',t:'Anzuelos',one:'anzuelo'},{k:'linea',t:'Sedales y fluoros',one:'línea'});
var _invName23=invName;
invName=function(it){
  if(it.kind==='linea')return [it.marca,it.diam?dmm(it.diam)+' mm':''].filter(Boolean).join(' · ');
  if(it.kind==='senuelo')return [it.marca,it.estilo].filter(Boolean).join(' · ');
  var s=_invName23(it);
  if(it.kind==='anzuelo'&&it.gr&&s.indexOf(' g')<0)s+=' · '+it.gr+' g';
  return s;
};
function dmm(d){return d?Number(d).toFixed(Math.max(2,(String(d).split('.')[1]||'').length)).replace('.',','):''}
function ivNum(x){var n=parseFloat(String(x==null?'':x).replace(',','.'));return isNaN(n)?1e9:n}
var ORD23={
  senuelo:function(a,b){var t=(a.tipo==='Rígido'?0:1)-(b.tipo==='Rígido'?0:1);if(t)return t;var e=(a.estilo||'').localeCompare(b.estilo||'','es');if(e)return e;return ivNum(a.gr)-ivNum(b.gr)||ivNum(a.mm)-ivNum(b.mm)},
  corcho:function(a,b){return ivNum(a.gr)-ivNum(b.gr)||(a.forma||'').localeCompare(b.forma||'','es')},
  anzuelo:function(a,b){var t=(a.tipo||'').localeCompare(b.tipo||'','es');if(t)return t;return ivNum(a.num)-ivNum(b.num)||ivNum(a.gr)-ivNum(b.gr)},
  linea:function(a,b){return (a.uso||'').localeCompare(b.uso||'','es')||ivNum(a.diam)-ivNum(b.diam)},
  cana:function(a,b){return (a.name||'').localeCompare(b.name||'','es')},
  carrete:function(a,b){return (a.name||'').localeCompare(b.name||'','es')}
};
var _invOf23=invOf;
invOf=function(k){var l=INV.filter(function(x){return x.kind===k});return ORD23[k]?l.sort(ORD23[k]):_invOf23(k)};
function ivEsp(it){
  var p=[];
  if(it.kind==='linea'){p=[it.uso==='Bajo'?'Bajos':'Carrete',it.tipo,it.lb?it.lb+' lb':'',it.m?it.m+' m':'']}
  else if(it.kind==='senuelo'){p=[it.tipo,it.gr?it.gr+' g':'',it.mm?it.mm+' mm':'',it.flota]}
  else if(it.kind==='corcho'){p=[it.gr?it.gr+' g':'sin gramaje',it.tam,it.origen]}
  else if(it.kind==='anzuelo'){p=[it.tipo,it.num?'nº '+it.num:'',it.gr?it.gr+' g':'',it.pack]}
  else if(it.kind==='cana'){p=[it.largo,it.tipo,it.accion,it.lanza]}
  else if(it.kind==='carrete'){p=[it.talla,it.peso,it.relacion?it.relacion+':1':'',it.rodamientos?it.rodamientos+' rod.':'']}
  return p.filter(Boolean);
}
function ivThumb(it){
  if(it.foto)return '<img class="ivph" decoding="async" alt="" src="'+esc(it.foto)+'">';
  var ic=it.kind==='corcho'?shIcon(it.forma||'Pera'):it.kind==='anzuelo'?hookIc(it.forma||'Anilla'):it.kind==='senuelo'&&typeof baitIcon==='function'?'':'';
  if(!ic)ic='<svg class="bi" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 24c6-10 20-12 30-2l6-6v16l-6-6C26 36 12 34 6 24z" fill="currentColor" fill-opacity=".16"/><circle cx="32" cy="22" r="1.6" fill="currentColor"/></svg>';
  return '<span class="ivph ivic">'+ic+'</span>';
}
function ivRow(it){
  var esp=ivEsp(it), notas=(it.notas||[]), meta=[it.origen,it.tienda,it.fecha,it.precio!=null?(it.precio+' €'+(it.cant>1?' ×'+it.cant:'')):''].filter(Boolean);
  var det=(it.mods&&it.mods.length?'<div class="ivm" style="margin-bottom:4px">Se usa en: '+esc(it.mods.join(', '))+'</div>':'')+(notas.length?'<ul class="ivn">'+notas.map(function(n){return '<li>'+esc(n)+'</li>'}).join('')+'</ul>':'')+(meta.length?'<div class="ivm">'+esc(meta.join(' · '))+(it.variante?'<br>Variante: '+esc(it.variante):'')+'</div>':'');
  return '<details class="ivit"><summary>'+ivThumb(it)+'<span class="ivt"><b>'+esc(invName(it))+'</b><small>'+esc(esp.join(' · '))+'</small></span><button type="button" class="x" data-a="inv-del" data-id="'+esc(it.id)+'" aria-label="Quitar">×</button></summary>'+(det?'<div class="ivd">'+det+'</div>':'')+'</details>';
}
invManagerHTML=function(){
  return INVK.map(function(x){
    var lst=invOf(x.k), gk='btinv'+x.k, last='';
    var rows=lst.map(function(it){
      var g=x.k==='senuelo'?(it.tipo+' · '+(it.estilo||'')):x.k==='anzuelo'?(it.tipo||''):x.k==='linea'?(it.uso==='Bajo'?'Fluorocarbono para bajos':'Sedal para carrete'):'';
      var h=(g&&g!==last&&x.k!=='senuelo'?'<div class="ivg">'+esc(g)+'</div>':'');if(g&&x.k!=='senuelo')last=g;
      if(x.k==='senuelo'){var gg=it.tipo||'';if(gg!==last){h='<div class="ivg">'+esc(gg)+'</div>';last=gg}}else last=g;
      return h+ivRow(it);
    }).join('');
    return '<details class="gdet bpick" data-gk="'+gk+'"'+(GOPEN[gk]?' open':'')+'><summary><span class="mt"><b>'+x.t+'</b><small>'+(lst.length?lst.length+' guardados · toca para ver':'Aún no tienes ninguno')+'</small></span>'+(lst.length?'<span class="bcount">'+lst.length+'</span>':'')+'</summary><div class="invbody">'+rows+(x.k==='senuelo'||x.k==='linea'?'':invForm(x.k))+'</div></details>';
  }).join('');
};
(function(){var s=document.createElement('style');s.textContent='.ivg{font:700 11px var(--display);letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin:8px 2px 0}.ivit{border:1.5px solid var(--line);border-radius:12px;background:var(--surface)}.ivit>summary{list-style:none;display:flex;align-items:center;gap:10px;padding:7px 8px;cursor:pointer}.ivit>summary::-webkit-details-marker{display:none}.ivph{width:52px;height:52px;flex:none;border-radius:10px;object-fit:contain;background:var(--surface2);padding:3px;box-sizing:border-box}.ivic{display:flex;align-items:center;justify-content:center;color:var(--accent)}.ivic svg{width:30px;height:30px}.ivt{flex:1;min-width:0;display:flex;flex-direction:column}.ivt b{font:700 13.5px var(--display);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ivt small{color:var(--muted);font:500 11.5px var(--display);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ivit .x{background:none;border:0;color:var(--muted);font-size:20px;padding:0 6px}.ivd{padding:2px 12px 10px 70px;font:500 12.5px var(--display)}.ivn{margin:0 0 6px;padding-left:16px}.ivn li{margin:2px 0}.ivm{color:var(--muted);font-size:11.5px}';document.head.appendChild(s)})();
/* filtro por modalidad: solo equipo de la modalidad elegida */
var INVMODE=null;
var _invOf23b=invOf;
invOf=function(k){var l=_invOf23b(k);var m=INVMODE;return m?l.filter(function(x){return !x.mods||!x.mods.length||x.mods.indexOf(m)>-1}):l};
var _eqCard23=eqCard;
eqCard=function(e,i,n){INVMODE=e.mode||(tripDraft&&tripDraft.mode)||null;try{return _eqCard23(e,i,n)}finally{INVMODE=null}};
var _ivEsp23=ivEsp;
ivEsp=function(it){var p=_ivEsp23(it);if(it.kind==='anzuelo'&&it.uso)p.unshift(it.uso);return p};
(function(){var _m=invManagerHTML;invManagerHTML=function(){INVMODE=null;return _m()}})();
/* siembra AliExpress cuenta 1 */
(function(){
  function put(j,onlyExisting){
    return Promise.all(j.items.map(function(it){var o=Object.assign({},it),id=o.id;delete o.id;var ref=db.collection('gearInv').doc(id);
      return ref.get().then(function(d){if(onlyExisting&&!(d&&d.exists))return;if(!onlyExisting||!d.exists){}var base=d&&d.exists?d.data():{createdAt:Date.now()};return ref.set(Object.assign({},base,o))})}));
  }
  var t=setInterval(function(){
    if(typeof db==='undefined'||!db)return;clearInterval(t);
    db.doc('gearMeta/seedAli1').get().then(function(m){
      return fetch('gear-seed.json').then(function(r){return r.json()}).then(function(j){
        if(!(m&&m.exists))return put(j,false).then(function(){return db.doc('gearMeta/seedAli1').set({at:Date.now(),n:j.items.length})}).then(function(){return db.doc('gearMeta/seedAli1c').set({at:Date.now()})}).then(function(){toast(j.items.length+' artículos de AliExpress añadidos')});
        return db.doc('gearMeta/seedAli1c').get().then(function(m2){if(m2&&m2.exists)return;return put(j,true).then(function(){return db.doc('gearMeta/seedAli1c').set({at:Date.now()})}).then(function(){toast('Mi equipo actualizado (fotos y modalidades)')})});
      });
    }).catch(function(){});
  },700)})();
/* siembras adicionales */
(function(){var L=[['gear-seed3.json','seedLin2'],['gear-seed4.json','seedAli1d'],['gear-seed5.json','seedYuki'],['gear-seed6.json','seedTemu1'],['gear-seed7.json','seedLures2'],['gear-seed8.json','seedOwn1']];var t=setInterval(function(){if(typeof db==='undefined'||!db)return;clearInterval(t);L.forEach(function(f){db.doc('gearMeta/'+f[1]).get().then(function(m){if(m&&m.exists)return;return fetch(f[0]).then(function(r){return r.json()}).then(function(j){return Promise.all(j.items.map(function(it){var o=Object.assign({},it),id=o.id;delete o.id;o.createdAt=Date.now();return db.collection('gearInv').doc(id).set(o)})).then(function(){return db.doc('gearMeta/'+f[1]).set({at:Date.now(),n:j.items.length})}).then(function(){toast(j.items.length+' artículos nuevos añadidos')})})}).catch(function(){})})},1500)})();
/* siembra AliExpress cuenta 2 (una vez) */
(function(){var t=setInterval(function(){
  if(typeof db==='undefined'||!db)return;clearInterval(t);
  db.doc('gearMeta/seedAli2').get().then(function(m){if(m&&m.exists)return;
    return fetch('gear-seed2.json').then(function(r){return r.json()}).then(function(j){
      return Promise.all(j.items.map(function(it){var o=Object.assign({},it),id=o.id;delete o.id;o.createdAt=Date.now();return db.collection('gearInv').doc(id).set(o)})).then(function(){return db.doc('gearMeta/seedAli2').set({at:Date.now(),n:j.items.length})}).then(function(){toast(j.items.length+' artículos de la cuenta 2 añadidos')})});
  }).catch(function(){});
},1200)})();
/* sedales y fluoros elegibles en el equipo */
if(typeof EQKEYS!=='undefined'&&EQKEYS.indexOf('sedal')<0)EQKEYS.push('sedal');
function lineaRow(e,i,uso){
  var l=INV.filter(function(x){return x.kind==='linea'&&x.uso===uso}).sort(ORD23.linea);
  if(!l.length)return '';
  var cur=uso==='Bajo'?String(e.fluoro||''):String(e.sedal||'');
  return '<div class="invrow"><span class="invl">'+(uso==='Bajo'?'Mis fluorocarbonos':'Mi sedal del carrete')+'</span><div class="chips invchips">'+l.map(function(it){
    var on=uso==='Bajo'?(it.diam&&dmm(it.diam)===cur||cur===it.marca):cur===invName(it);
    return '<button type="button" class="chip'+(on?' on':'')+'" data-a="ln-use" data-i="'+i+'" data-id="'+esc(it.id)+'" aria-pressed="'+on+'">'+esc(invName(it))+'</button>'}).join('')+'</div></div>';
}
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a="ln-use"]'):null;if(!b)return;
  var i=+b.getAttribute('data-i'),e=tripDraft&&tripDraft.equipos&&tripDraft.equipos[i];if(!e)return;
  var it=INV.filter(function(x){return x.id===b.getAttribute('data-id')})[0];if(!it)return;
  if(it.uso==='Bajo'){var v=it.diam?dmm(it.diam):'';e.fluoro=e.fluoro===v?'':v;e.fluoroMarca=e.fluoro?it.marca:'';GOPEN['e'+i+'linea']=true}
  else{var n=invName(it);e.sedal=e.sedal===n?'':n;GOPEN['e'+i+'cana']=true}
  GOPEN.top=true;gearRepaint();
},true);
