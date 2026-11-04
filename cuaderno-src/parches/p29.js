/* ===== p29: sección Equipo — categorías, fichas, alta/edición ===== */
var EQV={view:'home',kind:null,id:null,draft:null,q:'',del:null};
var EQKINDS={
  cana:{t:'Cañas',one:'caña',f:[['name','Nombre *'],['largo','Largo (ej. 6 m)'],['tipo','Tipo (Spinning, Telescópica…)'],['lanza','Acción (g) (ej. 50–100)'],['accion','Dureza (ej. HH, ultraligera)'],['tramos','Tramos'],['transporte','Largo plegada'],['peso','Peso'],['kg','Potencia máx. (kg)'],['anillas','Anillas'],['portacarretes','Portacarretes'],['material','Material']],ic:'<path d="M4 20L20 4"/><path d="M8 16l2 2M12 12l2 2M16 8l2 2"/>'},
  carrete:{t:'Carretes',one:'carrete',f:[['name','Nombre *'],['talla','Talla (ej. 4000)'],['relacion','Relación (ej. 5.2)'],['rodamientos','Rodamientos'],['peso','Peso']],ic:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 4v2M20 12h-2"/>'},
  corcho:{t:'Corchos',one:'corcho',f:[['fab','Marca'],['gr','Gramos'],['tam','Tamaño']],shape:true},
  anzuelo:{t:'Anzuelos',one:'anzuelo',f:[['modelo','Marca y modelo'],['num','Número'],['tipo','Tipo'],['gr','Gramos'],['pack','Pack (uds.)']]},
  senuelo:{t:'Señuelos',one:'señuelo',f:[['marca','Marca'],['estilo','Estilo (Crankbait, Jig…)'],['gr','Gramos'],['mm','Longitud (mm)'],['flota','Flotabilidad']],tipo:['Rígido','Vinilo']},
  linea:{t:'Sedales y fluoros',one:'línea',f:[['marca','Marca'],['diam','Diámetro (mm)'],['lb','Libras'],['m','Metros'],['color','Color']],uso:['Bajo','Carrete'],ic:'<circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4v16"/>'}
};
var EQCOM=[['tienda','Dónde lo compré'],['fecha','Fecha','date'],['precio','Precio (€)']];
var EQLBL={ref:'Referencia',tramos:'Tramos',transporte:'Largo plegada',anillas:'Anillas',portacarretes:'Portacarretes',material:'Material',name:'Nombre',marca:'Marca',largo:'Largo',tipo:'Tipo',accion:'Dureza',lanza:'Acción (g)',talla:'Talla',relacion:'Relación',rodamientos:'Rodamientos',peso:'Peso',forma:'Forma',fab:'Marca',gr:'Gramos',tam:'Tamaño',modelo:'Modelo',num:'Número',grosor:'Grosor',estilo:'Estilo',mm:'Longitud (mm)',flota:'Flotabilidad',diam:'Diámetro (mm)',lb:'Libras',kg:'Potencia máx. (kg)',m:'Metros',hebras:'Hebras',color:'Color',uso:'Uso',tienda:'Tienda',fecha:'Fecha',precio:'Precio',cant:'Cantidad',pack:'Pack',origen:'Origen',variante:'Variante',lanza:'Acción (g)'};
var EQORD=['name','marca','modelo','ref','fab','estilo','tipo','uso','forma','largo','lanza','accion','tramos','transporte','anillas','portacarretes','material','talla','relacion','rodamientos','peso','num','gr','mm','flota','diam','lb','kg','m','hebras','color','tam','grosor','pack','variante','origen','tienda','fecha','precio','cant'];
(function(){var s=document.createElement('style');s.textContent=
'.eqgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0}.eqcat{display:flex;flex-direction:column;gap:6px;align-items:flex-start;text-align:left;padding:14px;border-radius:16px;border:1.5px solid var(--line);background:var(--surface);color:var(--text,inherit)}.eqcat .eci{width:34px;height:34px;color:var(--accent)}.eqcat .eci svg{width:34px;height:34px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.eqcat b{font:700 15px var(--display)}.eqcat small{color:var(--muted);font-size:12.5px}'+
'.eqtop{display:flex;align-items:center;gap:8px;margin:0 0 8px}.eqtop h2{flex:1;margin:0;font:700 20px var(--display)}.eqback{padding:8px 12px;border-radius:12px;border:1.5px solid var(--line);background:var(--surface);color:var(--muted);font:600 13px var(--display)}'+
'.eqrow{display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:7px 8px;margin:0 0 7px;border-radius:12px;border:1.5px solid var(--line);background:var(--surface);color:inherit}.eqrow .ivph{flex:none}.eqrow .ivt{flex:1;min-width:0}.eqrow .ivt b{text-transform:none;letter-spacing:0;font:700 14px var(--display)}.eqrow .ivph svg{width:30px;height:30px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;color:var(--accent)}.eqrow .ivt b,.eqrow .ivt small{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.eqrow .ivt small{color:var(--muted);font-size:12.5px;margin-top:3px}'+
'.eqg{margin:6px 0}.eqg>summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;padding:10px 4px;font:700 12px var(--display);letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}.eqg>summary::-webkit-details-marker{display:none}'+
'.eqdet .big{width:100%;max-height:260px;object-fit:contain;border-radius:16px;background:var(--surface);padding:10px;margin:4px 0 12px}.eqdet dl{display:grid;grid-template-columns:auto 1fr;gap:8px 14px;margin:0 0 12px}.eqdet dt{color:var(--muted);font-size:13px}.eqdet dd{margin:0;font-weight:600}.eqdet ul{margin:0 0 12px;padding-left:18px}'+
'.eqf{display:flex;flex-direction:column;gap:10px}.eqf label{font:600 11px var(--mono);text-transform:uppercase;letter-spacing:.09em;color:var(--muted)}.eqf .fl{display:flex;flex-direction:column;gap:6px}.eqbtns{display:flex;gap:8px;margin-top:6px}.eqbtns .btn{flex:1}.eqph{max-height:110px;border-radius:12px;align-self:flex-start}';
document.head.appendChild(s)})();
function eqpKindIc(k){
  var d=EQKINDS[k];
  if(k==='corcho')return shIcon('Pera');
  if(k==='anzuelo')return hookIc('Anilla');
  if(k==='senuelo')return '<svg viewBox="0 0 24 24"><path d="M3 12c4-6 11-7 15-3l3-3v12l-3-3c-4 4-11 3-15-3z"/><circle cx="15" cy="11" r=".8"/></svg>';
  return '<svg viewBox="0 0 24 24">'+d.ic+'</svg>';
}
function eqpList(k){return INV.filter(function(x){return x.kind===k})}
function eqGroup(it){
  if(it.kind==='senuelo')return (it.tipo||'')+(it.estilo?' · '+it.estilo:'');
  if(it.kind==='anzuelo')return it.tipo||'';
  if(it.kind==='linea')return it.uso==='Bajo'?'Fluorocarbono para bajos':'Sedal para carrete';
  return '';
}
function eqRow(it){
  var th=(!it.foto&&(it.kind==='cana'||it.kind==='carrete'||it.kind==='linea'))?'<span class="ivph ivic">'+eqpKindIc(it.kind)+'</span>':ivThumb(it);
  return '<button type="button" class="eqrow" data-a="eqp-open" data-id="'+esc(it.id)+'">'+th+'<span class="ivt"><b>'+esc(invName(it)||'Sin nombre')+'</b><small>'+esc(ivEsp(it).join(' · '))+'</small></span></button>';
}
function eqPaneHTML(){
  var v=EQV, h='';
  if(v.view==='home'){
    h='<div class="eqtop"><h2>Mi equipo</h2><button type="button" class="btn small primary" data-a="eqp-new">+ Añadir</button></div><p class="hint" style="margin:0 0 4px">'+INV.length+' cosas guardadas. Toca una categoría.</p><div class="eqgrid">'+
      Object.keys(EQKINDS).map(function(k){var n=eqpList(k).length;return '<button type="button" class="eqcat" data-a="eqp-cat" data-k="'+k+'"><span class="eci">'+eqpKindIc(k)+'</span><b>'+EQKINDS[k].t+'</b><small>'+(n?n+(n===1?' guardado':' guardados'):'Vacío')+'</small></button>'}).join('')+'</div>';
  }else if(v.view==='list'){
    var K=EQKINDS[v.kind], lst=eqpList(v.kind).sort(ORD23[v.kind]||function(){return 0});
    h='<div class="eqtop"><button type="button" class="eqback" data-a="eqp-home">‹ Equipo</button><h2>'+K.t+'</h2><button type="button" class="btn small primary" data-a="eqp-new" data-k="'+v.kind+'">+ Añadir</button></div>'+
      (lst.length>8?'<input type="search" id="eqq" placeholder="Buscar en '+K.t.toLowerCase()+'…" value="'+esc(v.q)+'" style="margin-bottom:10px">':'')+'<div id="eqlist">'+eqListBody(lst)+'</div>';
  }else if(v.view==='detail'){
    var it=INV.filter(function(x){return x.id===v.id})[0];
    if(!it){v.view='home';return eqPaneHTML()}
    var rows=EQORD.filter(function(f){return f!=='name'&&it[f]!=null&&it[f]!==''}).map(function(f){return '<dt>'+EQLBL[f]+'</dt><dd>'+esc(f==='precio'?it[f]+' €':it[f])+'</dd>'}).join('');
    var notas=it.notas||[];
    h='<div class="eqdet"><div class="eqtop"><button type="button" class="eqback" data-a="eqp-cat" data-k="'+it.kind+'">‹ '+EQKINDS[it.kind].t+'</button><h2></h2></div>'+
      (it.foto?'<img class="big" alt="" src="'+esc(it.foto)+'">':(it.kind==='corcho'||it.kind==='anzuelo'?'<div style="text-align:center;margin:8px 0">'+ivThumb(it)+'</div>':''))+
      '<h2 style="margin:0 0 10px;font:700 20px var(--display)">'+esc(invName(it))+'</h2>'+
      (rows?'<dl>'+rows+'</dl>':'<p class="hint">Aún sin detalles. Toca Editar para completarlo.</p>')+
      eqBobDetail(it)+(it.mods&&it.mods.length?'<p class="hint" style="margin:0 0 12px">Se usa en: '+esc(it.mods.join(', '))+'</p>':'')+
      (notas.length?'<ul>'+notas.map(function(n){return '<li>'+esc(n)+'</li>'}).join('')+'</ul>':'')+
      '<div class="eqbtns"><button type="button" class="btn" data-a="eqp-edit" data-id="'+esc(it.id)+'">Editar</button><button type="button" class="btn danger" data-a="eqp-del" data-id="'+esc(it.id)+'">'+(v.del===it.id?'¿Seguro? Toca otra vez':'Quitar')+'</button></div></div>';
  }else if(v.view==='kind'){
    h='<div class="eqtop"><button type="button" class="eqback" data-a="eqp-home">‹ Equipo</button><h2>¿Qué añades?</h2></div><div class="eqgrid">'+Object.keys(EQKINDS).map(function(k){return '<button type="button" class="eqcat" data-a="eqp-new" data-k="'+k+'"><span class="eci">'+eqpKindIc(k)+'</span><b>'+EQKINDS[k].one.charAt(0).toUpperCase()+EQKINDS[k].one.slice(1)+'</b></button>'}).join('')+'</div>';
  }else if(v.view==='form'){
    h=eqFormHTML();
  }
  return h;
}
function eqListBody(lst){
  var q=norm(EQV.q||''); if(q)lst=lst.filter(function(it){return norm(invName(it)+' '+ivEsp(it).join(' ')).indexOf(q)>-1});
  if(!lst.length)return '<p class="hint">'+(q?'Nada con ese nombre.':'Aún no tienes ninguno. Toca + Añadir.')+'</p>';
  var K=EQKINDS[EQV.kind];
  if(EQV.kind!=='senuelo'&&EQV.kind!=='anzuelo'&&EQV.kind!=='linea')return lst.map(eqRow).join('');
  var groups=[],m={};
  lst.forEach(function(it){var g=eqGroup(it)||'Otros';if(!m[g]){m[g]=[];groups.push(g)}m[g].push(it)});
  return groups.map(function(g,i){return '<details class="eqg"'+(q||groups.length<=2?' open':'')+'><summary><span>'+esc(g)+'</span><span>'+m[g].length+'</span></summary>'+m[g].map(eqRow).join('')+'</details>'}).join('');
}
function eqFormHTML(){
  var v=EQV,K=EQKINDS[v.kind],d=v.draft||{};
  var fld=function(f,type){return '<div class="fl"><label for="eqf-'+f[0]+'">'+f[1]+'</label><input id="eqf-'+f[0]+'" data-f="'+f[0]+'" type="'+(type||'text')+'" autocomplete="off" value="'+esc(d[f[0]]==null?'':d[f[0]])+'"></div>'};
  var chips=function(key,opts,label){return '<div class="fl"><label>'+label+'</label><div class="chips">'+opts.map(function(o){var on=d[key]===o;return '<button type="button" class="chip'+(on?' on':'')+'" data-a="eqp-chip" data-f="'+key+'" data-v="'+esc(o)+'" aria-pressed="'+on+'">'+esc(o)+'</button>'}).join('')+'</div></div>'};
  var h='<div class="eqtop"><button type="button" class="eqback" data-a="eqp-cancel">‹ Cancelar</button><h2>'+(v.id?'Editar ':'Nuevo ')+K.one+'</h2></div><div class="eqf">';
  if(K.uso)h+=chips('uso',K.uso,'Uso');
  if(K.tipo)h+=chips('tipo',K.tipo,'Tipo');
  if(K.shape)h+='<div class="fl"><label>Forma</label><div class="bgrid shgrid">'+SHAPES.map(function(n){var on=d.forma===n;return '<button type="button" class="btile'+(on?' on':'')+'" data-a="eqp-chip" data-f="forma" data-v="'+n+'" aria-pressed="'+on+'">'+shIcon(n)+'<span>'+n+'</span></button>'}).join('')+'</div></div>';
  K.f.forEach(function(f){h+=fld(f)});
  if(v.kind==='carrete')h+=eqBobForm(d);
  h+='<div class="fl"><label>Se usa en (opcional)</label><div class="chips">'+MODOS.filter(function(m){return m.n!=='Solo mirar el mar'}).map(function(m){var on=(d.mods||[]).indexOf(m.n)>-1;return '<button type="button" class="chip'+(on?' on':'')+'" data-a="eqp-mod" data-v="'+esc(m.n)+'" aria-pressed="'+on+'">'+esc(m.n)+'</button>'}).join('')+'</div></div>';
  EQCOM.forEach(function(f){h+=fld(f,f[2])});
  h+='<div class="fl"><label for="eqf-notas">Notas (una por línea)</label><textarea id="eqf-notas" data-f="notas" rows="3">'+esc((d.notas||[]).join('\n'))+'</textarea></div>';
  h+='<div class="fl"><label>Foto (opcional)</label>'+(d.foto?'<img class="eqph" alt="" src="'+esc(d.foto)+'">':'')+'<input type="file" id="eqf-foto" accept="image/*"></div>';
  h+='<div class="eqbtns"><button type="button" class="btn primary" data-a="eqp-save">Guardar</button></div></div>';
  return h;
}
function eqRead(){
  var d=EQV.draft||(EQV.draft={});
  var bs=[];document.querySelectorAll('#eqpane [data-b]').forEach(function(el){var i=+el.dataset.b;bs[i]=bs[i]||{};bs[i][el.dataset.bf]=el.value.trim()});if(bs.length){var old=d.bobinas||[];d.bobinas=bs.filter(Boolean).map(function(x,i){x.tipo=(old[i]&&old[i].tipo)||'';return x})}
  document.querySelectorAll('#eqpane [data-f]').forEach(function(el){
    if(el.tagName==='INPUT'||el.tagName==='TEXTAREA'){
      if(el.dataset.f==='notas')d.notas=el.value.split('\n').map(function(s){return s.trim()}).filter(Boolean);
      else d[el.dataset.f]=el.value.trim();
    }
  });
}
function eqRender(){var p=document.getElementById('eqpane');if(p){p.innerHTML=eqPaneHTML();var m=document.getElementById('main');if(m)m.scrollTop=0}else if(typeof tab!=='undefined'&&tab==='equipo')renderMain()}
function eqRefreshOnly(){var p=document.getElementById('eqpane');if(p)p.innerHTML=eqPaneHTML()}
invRepaint=function(){
  if(typeof tab!=='undefined'&&tab==='equipo'){
    var a=document.activeElement;if(EQV.view==='form'||(a&&(a.tagName==='INPUT'||a.tagName==='TEXTAREA')))return;
    eqRefreshOnly();return;
  }
  var b=$('#invbody'); if(b){b.innerHTML=invManagerHTML();return}
  if(tripDraft&&typeof gearRepaint==='function')gearRepaint();
};
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a^="eqp-"]'):null;if(!b)return;
  var a=b.getAttribute('data-a'),v=EQV,id=b.getAttribute('data-id'),k=b.getAttribute('data-k');
  if(a==='eqp-home'){v.view='home';v.q='';eqRender()}
  else if(a==='eqp-cat'){v.view='list';v.kind=k;v.q='';v.del=null;eqRender()}
  else if(a==='eqp-open'){v.view='detail';v.id=id;v.del=null;eqRender()}
  else if(a==='eqp-new'){
    if(!k){if(v.view==='list'){k=v.kind}else{v.view='kind';eqRender();return}}
    v.view='form';v.kind=k;v.id=null;v.draft={};if(k==='senuelo')v.draft.tipo='Rígido';if(k==='linea')v.draft.uso='Bajo';eqRender();
  }
  else if(a==='eqp-edit'){var it=INV.filter(function(x){return x.id===id})[0];if(!it)return;v.view='form';v.kind=it.kind;v.id=id;v.draft=JSON.parse(JSON.stringify(it));eqRender()}
  else if(a==='eqp-cancel'){v.view=v.id?'detail':(v.kind?'list':'home');eqRender()}
  else if(a==='eqp-chip'){eqRead();var f=b.getAttribute('data-f'),val=b.getAttribute('data-v');v.draft[f]=v.draft[f]===val?'':val;eqRender()}
  else if(a==='eqp-mod'){eqRead();var ms=v.draft.mods||(v.draft.mods=[]),val2=b.getAttribute('data-v'),ix=ms.indexOf(val2);if(ix<0)ms.push(val2);else ms.splice(ix,1);eqRender()}
  else if(a==='eqp-bob-add'){eqRead();(v.draft.bobinas=v.draft.bobinas||[]).push({nom:'',base:'',linea:'',tipo:'Trenzado'});eqRender()}
  else if(a==='eqp-bob-del'){eqRead();v.draft.bobinas.splice(+b.getAttribute('data-i'),1);eqRender()}
  else if(a==='eqp-del'){
    if(v.del!==id){v.del=id;eqRender();return}
    INV=INV.filter(function(x){return x.id!==id});v.del=null;v.view='list';eqRender();
    db.doc('gearInv/'+id).delete().then(function(){toast('Quitado')},function(){toast('No se pudo borrar')});
  }
  else if(a==='eqp-save'){
    eqRead();var d=v.draft,K=EQKINDS[v.kind];
    var main=K.f.map(function(x){return x[0]}).concat(['forma']).some(function(f){return d[f]});
    if((v.kind==='cana'||v.kind==='carrete')&&!d.name){toast('Escribe el nombre');return}
    if(!main){toast('Rellena al menos un dato');return}
    if(d.bobinas)d.bobinas=d.bobinas.map(function(x){return {nom:x.nom||'',base:eqNum(x.base),linea:eqNum(x.linea),tipo:x.tipo||''}}).filter(function(x){return x.nom||x.base||x.linea});
    d.kind=v.kind;if(d.precio!==''&&d.precio!=null){var n=parseFloat(String(d.precio).replace(',','.'));d.precio=isNaN(n)?d.precio:n}
    var o={};Object.keys(d).forEach(function(f){if(f==='id')return;var x=d[f];if(x===''||x==null||(Array.isArray(x)&&!x.length))return;o[f]=x});
    var ref=v.id?db.doc('gearInv/'+v.id):db.collection('gearInv').doc();
    if(!v.id)o.createdAt=Date.now();
    var full=Object.assign({},v.id?(INV.filter(function(x){return x.id===v.id})[0]||{}):{},o);
    ['precio','notas','mods','foto','tienda','fecha'].forEach(function(f){if(v.id&&!(f in o))delete full[f]});
    full.id=ref.id;
    var i=INV.findIndex(function(x){return x.id===full.id});if(i<0)INV.push(full);else INV[i]=full;
    var w=Object.assign({},full);delete w.id;
    ref.set(w).then(function(){toast('Guardado')},function(){toast('No se pudo guardar')});
    v.view='detail';v.id=full.id;v.draft=null;eqRender();
  }
},true);
document.addEventListener('input',function(ev){
  if(ev.target.id==='eqq'){EQV.q=ev.target.value;var l=document.getElementById('eqlist');if(l)l.innerHTML=eqListBody(eqpList(EQV.kind).sort(ORD23[EQV.kind]||function(){return 0}))}
});
document.addEventListener('change',function(ev){
  if(ev.target.id!=='eqf-foto'||!ev.target.files[0])return;
  var f=ev.target.files[0],r=new FileReader();
  r.onload=function(){var im=new Image();im.onload=function(){
    var s=Math.min(1,520/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);
    c.getContext('2d').drawImage(im,0,0,c.width,c.height);eqRead();EQV.draft.foto=c.toDataURL('image/jpeg',.8);eqRender();
  };im.src=r.result};r.readAsDataURL(f);
});
(function(){var t=document.getElementById('t-equipo');if(t)t.addEventListener('click',function(){if(tab==='equipo'&&EQV.view!=='home'){EQV.view='home';EQV.q='';eqRender()}})})();
/* foto de las Yuki Spirit (una vez) */
(function(){var t=setInterval(function(){if(typeof db==='undefined'||!db)return;clearInterval(t);
  db.doc('gearMeta/seedYukiFoto').get().then(function(m){if(m&&m.exists)return;
    return Promise.all(['own-yuki-6','own-yuki-7'].map(function(id){var ref=db.doc('gearInv/'+id);return ref.get().then(function(d){if(!(d&&d.exists))return;var o=d.data();if(o.foto)return;o.foto='img/gear/own-yuki.webp';return ref.set(o)})})).then(function(){return db.doc('gearMeta/seedYukiFoto').set({at:Date.now()})});
  }).catch(function(){});
},2500)})();

/* bobinas de carrete: base gruesa de relleno + línea fina encima */
function eqNum(x){return String(x==null?'':x).trim().replace(',','.')}
function eqMm(x){return String(x).replace('.',',')}
function bobTxt(b){return (b.nom||'Bobina')+': '+(b.base?eqMm(b.base)+' mm de relleno + ':'')+(b.linea?eqMm(b.linea)+' mm':'')+(b.tipo?' · '+b.tipo.toLowerCase():'')}
function eqBobForm(d){
  var l=d.bobinas||[];
  return '<div class="fl"><label>Bobinas (relleno + línea fina)</label>'+(l.length?'':'<p class="hint" style="margin:0">Cada bobina lleva primero un hilo grueso de relleno y encima el fino con el que pescas.</p>')+
    l.map(function(b,i){return '<div class="eqbob"><input data-b="'+i+'" data-bf="nom" placeholder="Nombre (ej. Roja)" value="'+esc(b.nom||'')+'"><input data-b="'+i+'" data-bf="base" inputmode="decimal" placeholder="Relleno mm" value="'+esc(b.base?eqMm(b.base):'')+'"><input data-b="'+i+'" data-bf="linea" inputmode="decimal" placeholder="Línea mm" value="'+esc(b.linea?eqMm(b.linea):'')+'"><button type="button" class="x" data-a="eqp-bob-del" data-i="'+i+'" aria-label="Quitar bobina">×</button></div>'}).join('')+
    '<button type="button" class="btn small" data-a="eqp-bob-add">+ Añadir bobina</button></div>';
}
function eqBobDetail(it){
  if(!it.bobinas||!it.bobinas.length)return '';
  return '<h3 style="margin:0 0 6px;font:700 14px var(--display)">Bobinas</h3><ul>'+it.bobinas.map(function(b){return '<li>'+esc(bobTxt(b))+'</li>'}).join('')+'</ul>';
}
(function(){var s=document.createElement('style');s.textContent='.eqbob{display:grid;grid-template-columns:1.2fr 1fr 1fr auto;gap:6px;margin-bottom:6px}.eqbob input{min-width:0}';document.head.appendChild(s)})();
var _ivEsp29=ivEsp;
ivEsp=function(it){var p=_ivEsp29(it);if(it.kind==='carrete'&&it.bobinas&&it.bobinas.length)p.push(it.bobinas.length+(it.bobinas.length===1?' bobina':' bobinas'));return p};
/* en la salida: elegir bobina del carrete elegido */
if(typeof EQKEYS!=='undefined'&&EQKEYS.indexOf('bobina')<0)EQKEYS.push('bobina');
var _lineaRow29=lineaRow;
lineaRow=function(e,i,uso){
  var h=_lineaRow29(e,i,uso);
  if(uso!=='Carrete')return h;
  var c=INV.filter(function(x){return x.kind==='carrete'&&x.name===e.carrete&&x.bobinas&&x.bobinas.length})[0];
  if(!c)return h;
  return '<div class="invrow"><span class="invl">Bobina del carrete</span><div class="chips invchips">'+c.bobinas.map(function(b,k){var on=e.bobina===(b.nom||'Bobina '+(k+1));return '<button type="button" class="chip'+(on?' on':'')+'" data-a="bob-use" data-i="'+i+'" data-k="'+k+'" data-id="'+esc(c.id)+'" aria-pressed="'+on+'">'+esc((b.nom||'Bobina '+(k+1))+(b.linea?' · '+eqMm(b.linea)+' mm':''))+'</button>'}).join('')+'</div></div>'+h;
};
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a="bob-use"]'):null;if(!b)return;
  var i=+b.getAttribute('data-i'),e=tripDraft&&tripDraft.equipos&&tripDraft.equipos[i];if(!e)return;
  var c=INV.filter(function(x){return x.id===b.getAttribute('data-id')})[0],bb=c&&c.bobinas[+b.getAttribute('data-k')];if(!bb)return;
  var nom=bb.nom||'Bobina '+(+b.getAttribute('data-k')+1);
  if(e.bobina===nom){e.bobina='';e.sedal=''}else{e.bobina=nom;e.sedal=nom+(bb.linea?' · '+eqMm(bb.linea)+' mm':'')+(bb.base?' (sobre '+eqMm(bb.base)+' mm)':'')}
  GOPEN.top=true;GOPEN['e'+i+'cana']=true;gearRepaint();
},true);
/* bobinas del Sougayilang SA4000 (una vez) */
(function(){var t=setInterval(function(){if(typeof db==='undefined'||!db)return;clearInterval(t);
  db.doc('gearMeta/seedBobSA4000').get().then(function(m){if(m&&m.exists)return;
    var ref=db.doc('gearInv/temu-reel-4000');
    return ref.get().then(function(d){if(!(d&&d.exists))return;var o=d.data();if(!o.bobinas){o.bobinas=[{nom:'Negra',base:'0.28',linea:'0.165'},{nom:'Roja',base:'0.28',linea:'0.10'}];o.name='Sougayilang SA4000'}return ref.set(o)}).then(function(){return db.doc('gearMeta/seedBobSA4000').set({at:Date.now()})});
  }).catch(function(){});
},3200)})();

/* bobinas SA4000: es trenzado (una vez) */
(function(){var t=setInterval(function(){if(typeof db==='undefined'||!db)return;clearInterval(t);
  db.doc('gearMeta/seedBobTrenz').get().then(function(m){if(m&&m.exists)return;
    var ref=db.doc('gearInv/temu-reel-4000');
    return ref.get().then(function(d){if(!(d&&d.exists))return;var o=d.data();if(o.bobinas)o.bobinas=o.bobinas.map(function(b){b.tipo=b.tipo||'Trenzado';return b});o.notas=(o.notas||[]).concat(['Las bobinas llevan trenzado, probablemente JOF o MANSTER W8 (por confirmar)']);return ref.set(o)}).then(function(){return db.doc('gearMeta/seedBobTrenz').set({at:Date.now()})});
  }).catch(function(){});
},4200)})();

/* Yuki Spirit: ficha oficial (una vez) */
(function(){var t=setInterval(function(){if(typeof db==='undefined'||!db)return;clearInterval(t);
  db.doc('gearMeta/seedYukiInfo').get().then(function(m){if(m&&m.exists)return;
    var base={marca:'Yuki',tipo:'Telescópica (boloñesa)',accion:'HH',lanza:'50–100 g',tramos:'7',transporte:'1,60 m',kg:6,anillas:'Fuji KW',portacarretes:'Fuji Plate',material:'Carbono de alto módulo',mods:['Corcho'],
      notas:['Caña telescópica para pesca a la boloñesa desde costa (boya/corcho)','Punta híbrida corta, acción dura (HH)','Aguanta capturas de hasta 6 kg de potencia','Ficha: yukicompetition.com']};
    var D={'own-yuki-6':{ref:'CASP60A',peso:'490 g'},'own-yuki-7':{ref:'CASP70A',peso:'600 g'}};
    return Promise.all(Object.keys(D).map(function(id){var ref=db.doc('gearInv/'+id);return ref.get().then(function(d){if(!(d&&d.exists))return;var o=d.data();Object.keys(base).forEach(function(k){if(o[k]==null||o[k]==='')o[k]=base[k]});Object.keys(D[id]).forEach(function(k){if(o[k]==null||o[k]==='')o[k]=D[id][k]});return ref.set(o)})})).then(function(){return db.doc('gearMeta/seedYukiInfo').set({at:Date.now()})});
  }).catch(function(){});
},4800)})();
