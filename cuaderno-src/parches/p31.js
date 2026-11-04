/* ===== p31: señuelos en dos grupos con iconos, corchos/boyas, migración de orden ===== */
var SENICON={'Crankbait':'crank','Cucharilla':'spoon','Jig metálico':'jig','Minnow':'minnow','Paseante':'stick','Popper':'popper','Vibración':'vib','Ajing':'sworm','Anguila':'slug','Camarón':'sshrimp','Cangrejo':'scrab','Cola en T':'swim','Grub':'grub','Gusano':'sworm','Pulpo':'squid2','Swimbait':'swim','Cabeza plomada':'shad','Shad':'shad'};
function senLbl(e){return String(e||'Otros').split(' (')[0]}
function senIc(lbl){var k=SENICON[lbl]||'jig';return '<img class="bi stile-i" alt="" src="img/bait/'+k+'.webp">'}
function senGroup(tipo){return eqpList('senuelo').filter(function(x){return (x.tipo||'Rígido')===tipo})}
function eqSenRows(l){return l.slice().sort(ORD23.senuelo).map(eqRow).join('')}
function eqSenBody(){
  var v=EQV,q=norm(v.q||'');
  if(q){var l=eqpList('senuelo').filter(function(it){return norm(invName(it)+' '+(it.estilo||'')+' '+ivEsp(it).join(' ')).indexOf(q)>-1});return l.length?eqSenRows(l):'<p class="hint">Nada con ese nombre.</p>'}
  if(!v.grp){
    return '<div class="sgrp">'+['Rígido','Vinilo'].map(function(t){var n=senGroup(t).length,ics=t==='Rígido'?['crank','minnow','jig']:['swim','grub','slug'];
      return '<button type="button" class="sgbig" data-a="eqp-grp" data-g="'+t+'"><span class="sgi">'+ics.map(function(k){return '<img class="bi" alt="" src="img/bait/'+k+'.webp">'}).join('')+'</span><b>'+t+'</b><small>'+n+(n===1?' señuelo':' señuelos')+'</small></button>'}).join('')+'</div>';
  }
  if(!v.sub){
    var g=senGroup(v.grp),m={},ord=[];g.forEach(function(it){var k=senLbl(it.estilo);if(!m[k]){m[k]=0;ord.push(k)}m[k]++});
    ord.sort(function(a,b){if(a==='Cabeza plomada')return -1;if(b==='Cabeza plomada')return 1;return a.localeCompare(b,'es')});
    return '<div class="stiles">'+ord.map(function(k){return '<button type="button" class="stile" data-a="eqp-sub" data-s="'+esc(k)+'">'+senIc(k)+'<b>'+esc(k)+'</b><small>'+m[k]+'</small></button>'}).join('')+'</div>'+(ord.length?'':'<p class="hint">Aún no tienes ninguno.</p>');
  }
  return eqSenRows(senGroup(v.grp).filter(function(it){return senLbl(it.estilo)===v.sub}));
}
var _eqPane31=eqPaneHTML;
eqPaneHTML=function(){
  var v=EQV;
  if(!(v.view==='list'&&v.kind==='senuelo'))return _eqPane31();
  var K=EQKINDS.senuelo;
  var back=v.sub?'<button type="button" class="eqback" data-a="eqp-sub" data-s="">‹ '+esc(v.grp)+'</button>':v.grp?'<button type="button" class="eqback" data-a="eqp-grp" data-g="">‹ Señuelos</button>':'<button type="button" class="eqback" data-a="eqp-home">‹ Equipo</button>';
  var title=v.sub||v.grp||'Señuelos';
  return '<div class="eqtop">'+back+'<h2>'+esc(title)+'</h2><button type="button" class="btn small primary" data-a="eqp-new" data-k="senuelo">+ Añadir</button></div>'+
    '<input type="search" id="eqq" placeholder="Buscar señuelo…" value="'+esc(v.q)+'" style="margin-bottom:10px"><div id="eqlist">'+eqSenBody()+'</div>';
};
var _eqLB31=eqListBody;
eqListBody=function(l){return EQV.kind==='senuelo'?eqSenBody():_eqLB31(l)};
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a="eqp-grp"],[data-a="eqp-sub"],[data-a="eqp-home"],[data-a="eqp-new"]'):null;if(!b)return;
  var a=b.getAttribute('data-a'),v=EQV;
  if(a==='eqp-grp'){v.grp=b.getAttribute('data-g')||null;v.sub=null;v.q='';eqRender()}
  else if(a==='eqp-sub'){v.sub=b.getAttribute('data-s')||null;v.q='';eqRender()}
  else if(a==='eqp-home'){v.grp=null;v.sub=null}
  else if(a==='eqp-new'&&v.view==='list'&&v.kind==='senuelo'){var g=v.grp,s=v.sub;setTimeout(function(){if(EQV.view==='form'&&EQV.draft&&!EQV.id){if(g)EQV.draft.tipo=g;if(s)EQV.draft.estilo=s;eqRender()}},0)}
},true);
(function(){var s=document.createElement('style');s.textContent='.sgrp{display:grid;grid-template-columns:1fr 1fr;gap:12px}.sgbig{display:flex;flex-direction:column;align-items:center;gap:8px;padding:18px 10px;border-radius:18px;border:1.5px solid var(--line);background:var(--surface);color:inherit}.sgbig .sgi{display:flex;flex-direction:column;gap:2px;align-items:center}.sgbig .sgi img{width:96px;height:34px;object-fit:contain}.sgbig b{font:700 18px var(--display)}.sgbig small{color:var(--muted)}.stiles{display:grid;grid-template-columns:1fr 1fr;gap:10px}.stile{display:flex;flex-direction:column;align-items:center;gap:4px;padding:12px 8px;border-radius:16px;border:1.5px solid var(--line);background:var(--surface);color:inherit}.stile img{width:100%;height:52px;object-fit:contain}.stile b{font:700 14px var(--display);text-align:center}.stile small{color:var(--muted);font-size:12px}';document.head.appendChild(s)})();
/* corchos: boyas de surfcasting aparte */
var _eqGroup31=eqGroup;
eqGroup=function(it){if(it.kind==='corcho')return it.tipo==='Boya de surfcasting'||it.forma==='Bola'?'Boyas de surfcasting (levantan la carnada)':'Corchos';return _eqGroup31(it)};
var _eqLB31b=eqListBody;
eqListBody=function(l){
  if(EQV.kind!=='corcho')return _eqLB31b(l);
  var q=norm(EQV.q||'');if(q)l=l.filter(function(it){return norm(invName(it)+' '+ivEsp(it).join(' ')).indexOf(q)>-1});
  if(!l.length)return '<p class="hint">Aún no tienes ninguno. Toca + Añadir.</p>';
  var g={},ord=[];l.forEach(function(it){var k=eqGroup(it);if(!g[k]){g[k]=[];ord.push(k)}g[k].push(it)});
  ord.sort(function(a,b){return a==='Corchos'?-1:b==='Corchos'?1:0});
  return ord.map(function(k){return '<details class="eqg" open><summary><span>'+esc(k)+'</span><span>'+g[k].length+'</span></summary>'+g[k].map(eqRow).join('')+'</details>'}).join('');
};
var _ivEsp31=ivEsp;
ivEsp=function(it){var p=_ivEsp31(it);if(it.kind==='corcho'&&(it.tipo==='Boya de surfcasting'||it.forma==='Bola')){p=p.map(function(x){return x==='sin gramaje'?'Boya de surfcasting':x})}return p};
/* migración de orden (una vez por dispositivo) */
(function(){
  var PATCH={"ali-32": {"estilo": "Jig metálico", "foto": "img/gear/ali-32.v3.webp", "notas": ["Micro jig de 1,5 g con anzuelo triple", "Para ajing/rockfishing ligero"]}, "ali-86": {"foto": "img/gear/ali-86.v3.webp"}, "ali-99": {"foto": "img/gear/ali-99.v3.webp", "estilo": "Cabeza plomada"}, "ali-115": {"estilo": "Cabeza plomada"}, "ali1b-8": {"foto": "img/gear/ali1b-8.v3.webp"}, "ali-71": {"estilo": "Swimbait"}, "ali-87": {"estilo": "Swimbait"}, "ali-12": {"foto": "img/gear/ali-12.v3.webp"}, "ali-79": {"foto": "img/gear/ali-79.v3.webp"}, "ali-88": {"foto": "img/gear/ali-88.v3.webp"}, "ali-94": {"foto": "img/gear/ali-94.v3.webp"}, "ali-26": {"mods": ["Surfcasting"], "tipo": "Boya de surfcasting"}, "ali-28": {"mods": ["Surfcasting"], "tipo": "Boya de surfcasting"}};
  var t=setInterval(function(){if(typeof db==='undefined'||!db)return;clearInterval(t);
    db.doc('gearMeta/migOrd1').get().then(function(m){if(m&&m.exists)return;
      return Promise.all(Object.keys(PATCH).map(function(id){var ref=db.doc('gearInv/'+id);return ref.get().then(function(d){if(!(d&&d.exists))return;return ref.set(Object.assign({},d.data(),PATCH[id]))})})).then(function(){return db.doc('gearInv/ali-113').delete().catch(function(){})}).then(function(){return db.doc('gearMeta/migOrd1').set({at:Date.now()})});
    }).catch(function(){});
  },5600)})();
/* foto oficial de la Yuki Spirit */
(function(){var t=setInterval(function(){if(typeof db==='undefined'||!db)return;clearInterval(t);
  db.doc('gearMeta/seedYukiFoto2').get().then(function(m){if(m&&m.exists)return;
    return Promise.all(['own-yuki-6','own-yuki-7'].map(function(id){var ref=db.doc('gearInv/'+id);return ref.get().then(function(d){if(!(d&&d.exists))return;var o=d.data();o.foto='img/gear/own-yuki2.webp';return ref.set(o)})})).then(function(){return db.doc('gearMeta/seedYukiFoto2').set({at:Date.now()})});
  }).catch(function(){})},6200)})();
