/* ===== Cebos de la salida (con porcentaje); por captura solo si hay 2 o más ===== */
var MIXCOL=['#3fd0c9','#f2b84b','#ff8a80','#9d8cff','#7bd88f','#5aa9ff'];
function mixLure(mode){var m=mode&&modoOf(mode);return !!(m&&m.lure)}
function mixSplit(n){var b=Math.floor(100/n),r=[];for(var i=0;i<n;i++)r.push(b);r[0]+=100-b*n;return r}
function mixNorm(list){
  if(!list.length)return list;
  var s=list.reduce(function(a,c){return a+c.p},0);
  if(s===100)return list;
  var sp=mixSplit(list.length);list.forEach(function(c,i){c.p=sp[i]});return list;
}
function mixDerive(tid,stops,items){
  var t=tid&&trips.filter(function(x){return x.id===tid})[0];
  if(t&&t.cebos&&t.cebos.length)return t.cebos.map(function(c){return {n:c.n,p:c.p}});
  var seen={},names=[];
  var add=function(n){if(!n||isArtBait(n))return;var k=norm(n);if(!seen[k]){seen[k]=1;names.push(n)}};
  (stops||[]).forEach(function(s){(s.baits||[]).forEach(add)});
  (items||[]).forEach(function(i){add(i.bait)});
  var sp=mixSplit(names.length||1);
  return names.map(function(n,i){return {n:n,p:sp[i]}});
}
var _ote21=openTripEditor;
openTripEditor=function(id,spotId){
  _ote21(id,spotId);
  if(tripDraft&&!tripDraft.cebos){tripDraft.cebos=mixDerive(id,tripDraft.stops,tripDraft.items);gearRepaint()}
};
function mixOf(draft){
  if(draft===tripDraft)return (draft.cebos||[]);
  var tid=($('#cap-trip')||{}).value||(draft&&draft.tripId),tr=tid&&trips.filter(function(t){return t.id===tid})[0];
  return tr?mixDerive(tr.id,legs.filter(function(l){return l.tripId===tr.id}),catches.filter(function(c){return c.tripId===tr.id}).reduce(function(a,c){return a.concat(c.items||[])},[])):[];
}
function modeOfDraft(draft){
  if(draft===tripDraft)return draft.mode;
  var tid=($('#cap-trip')||{}).value||(draft&&draft.tripId),tr=tid&&trips.filter(function(t){return t.id===tid})[0];return tr?tr.mode:null;
}
function mixBlock(d){
  if(mixLure(d.mode)||d.mode==='Solo mirar el mar')return '';
  var mix=d.cebos||[],sel=mix.map(function(c){return norm(c.n)});
  var rec=recentBaits(8).filter(function(n){return !isArtBait(n)}),all=allBaits().nat;
  mix.forEach(function(c){if(all.map(norm).indexOf(norm(c.n))<0)all.push(c.n)});
  var chip=function(n){var on=sel.indexOf(norm(n))>-1;return '<button type="button" class="bchip'+(on?' on':'')+'" data-a="cm-tog" data-n="'+esc(n)+'" aria-pressed="'+on+'">'+esc(n)+'</button>'};
  var recK=rec.map(norm),rest=all.filter(function(n){return recK.indexOf(norm(n))<0});
  var h='<div class="block mixb"><h3>Cebos de la salida</h3><p class="hint">Marca con qué cebos sales, hayan picado o no.'+(mix.length>1?' Reparte el porcentaje aproximado de cada uno.':' Con uno solo, todas las capturas cuentan con él.')+'</p>'+
    '<div class="bchips">'+rec.concat(mix.map(function(c){return c.n}).filter(function(n){return recK.indexOf(norm(n))<0})).map(chip).join('')+'</div>'+
    (rest.filter(function(n){return sel.indexOf(norm(n))<0}).length?'<details class="szd"><summary>Más cebos</summary><div class="bchips" style="margin-top:6px">'+rest.filter(function(n){return sel.indexOf(norm(n))<0}).map(chip).join('')+'</div></details>':'')+
    '<div class="baddrow"><input id="cm-new" maxlength="40" placeholder="Otro cebo…" aria-label="Otro cebo"><button type="button" class="btn small" data-a="cm-add">Añadir</button></div>';
  if(mix.length>1){
    h+='<div class="mixbar">'+mix.map(function(c,i){return '<i style="width:'+c.p+'%;background:'+MIXCOL[i%6]+'"></i>'}).join('')+'</div><div class="mixrows">'+
      mix.map(function(c,i){return '<div class="mixr"><span class="mixd" style="background:'+MIXCOL[i%6]+'"></span><b>'+esc(c.n)+'</b><div class="mixs"><button type="button" class="btn small" data-a="cm-adj" data-i="'+i+'" data-d="-10" aria-label="Menos '+esc(c.n)+'">−</button><span>'+c.p+'%</span><button type="button" class="btn small" data-a="cm-adj" data-i="'+i+'" data-d="10" aria-label="Más '+esc(c.n)+'">+</button></div></div>'}).join('')+'</div>';
  }
  return h+'</div>';
}
var _gb21=gearBlock;
gearBlock=function(d){var h=_gb21(d);return h.replace('<div id="gearblk">','<div id="gearblk">'+mixBlock(d))};
/* con un cebo los stops y capturas se rellenan solos al guardar */
function baitMixSync(d){
  if(mixLure(d.mode)||d.mode==='Solo mirar el mar')return;
  var mix=mixNorm(d.cebos||[]);d.cebos=mix;
  var names=mix.map(function(c){return c.n});
  d.stops.forEach(function(s){s.baits=names.slice()});
  if(names.length===1)(d.items||[]).forEach(function(i){if(!i.bait)i.bait=names[0]});
  if(names.length>1)(d.items||[]).forEach(function(i){if(i.bait&&names.map(norm).indexOf(norm(i.bait))<0)delete i.bait});
}
function mixAdjust(mix,i,dl){
  var n=mix.length,lo=10,hi=100-10*(n-1),np=Math.max(lo,Math.min(hi,mix[i].p+dl)),diff=np-mix[i].p;if(!diff)return;
  mix[i].p=np;
  var others=mix.map(function(c,k){return k}).filter(function(k){return k!==i});
  while(diff!==0){
    var k=others.filter(function(k){return diff>0?mix[k].p>lo:mix[k].p<100}).sort(function(a,b){return diff>0?mix[b].p-mix[a].p:mix[a].p-mix[b].p})[0];
    if(k==null)break;var st=Math.min(Math.abs(diff),10);mix[k].p+=diff>0?-st:st;diff+=diff>0?-st:st;
  }
}
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a^="cm-"]'):null;if(!b||!tripDraft)return;
  var a=b.getAttribute('data-a'),mix=tripDraft.cebos=tripDraft.cebos||[];
  if(a==='cm-tog'){var n=b.getAttribute('data-n'),ix=mix.map(function(c){return norm(c.n)}).indexOf(norm(n));if(ix>-1)mix.splice(ix,1);else mix.push({n:n,p:0});var sp=mixSplit(mix.length||1);mix.forEach(function(c,k){c.p=sp[k]})}
  else if(a==='cm-add'){var v=(($('#cm-new')||{}).value||'').trim();if(!v)return;if(mix.map(function(c){return norm(c.n)}).indexOf(norm(v))<0)mix.push({n:v,p:0});var sp2=mixSplit(mix.length);mix.forEach(function(c,k){c.p=sp2[k]})}
  else if(a==='cm-adj')mixAdjust(mix,+b.getAttribute('data-i'),+b.getAttribute('data-d'));
  else return;
  gearRepaint();
});
/* por captura: solo si hay 2 o más cebos */
var _bi21=baitInject;
baitInject=function(sel,draft,stopsOf){
  if(!draft)return;
  var mode=modeOfDraft(draft);
  if(mixLure(mode))return _bi21(sel,draft,stopsOf);
  var el=$(sel),mix=mixOf(draft);if(!el||mix.length<2)return;
  Array.prototype.forEach.call(el.querySelectorAll('.irow'),function(r,ix){
    var it=draft.items[ix];if(!it||r.querySelector('.baitsel'))return;
    var opt=function(c){return '<option value="'+esc(c.n)+'"'+(norm(it.bait||'')===norm(c.n)?' selected':'')+'>'+esc(c.n)+'</option>'};
    r.insertAdjacentHTML('beforeend','<div class="field baitsel" style="margin:8px 0 0"><label>¿Con cuál picó?</label><select data-a="ibait" data-i="'+ix+'" aria-label="Cebo de esta captura"><option value="">(sin apuntar)</option>'+mix.map(opt).join('')+'</select></div>');
  });
};
function baitMixView(t){
  var m=t&&t.cebos;if(!m||!m.length)return '';
  return '<div class="eqv"><div class="eqrow"><b>Cebos</b>'+(m.length>1?'<div class="mixbar">'+m.map(function(c,i){return '<i style="width:'+c.p+'%;background:'+MIXCOL[i%6]+'"></i>'}).join('')+'</div>':'')+'<div class="gearv">'+m.map(function(c){return '<span>'+esc(c.n)+(m.length>1?' '+c.p+'%':'')+'</span>'}).join('')+'</div></div></div>';
}
var _st21=document.createElement('style');_st21.textContent='.mixbar{display:flex;height:10px;border-radius:99px;overflow:hidden;margin:10px 0 8px;background:var(--surface2)}.mixbar i{display:block;height:100%}.mixr{display:flex;align-items:center;gap:8px;padding:6px 0}.mixr b{flex:1;font-weight:600;font-size:14px}.mixd{width:10px;height:10px;border-radius:99px;flex:none}.mixs{display:flex;align-items:center;gap:6px}.mixs span{min-width:44px;text-align:center;font:700 14px var(--mono,monospace)}';
document.head.appendChild(_st21);
