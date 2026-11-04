/* ===== p26: elegir señuelos concretos (con foto) en spinning, rockfishing y jigging ===== */
['lureIds','lureNames'].forEach(function(k){if(EQKEYS.indexOf(k)<0)EQKEYS.push(k)});
function lureShort(it){return [it.marca,it.estilo,it.gr?it.gr+' g':''].filter(Boolean).join(' · ')}
function lureRow(e,i){
  var mode=e.mode||(tripDraft&&tripDraft.mode),m=modoOf(mode);
  if(!m||!m.lure)return '';
  var lst;INVMODE=mode;try{lst=invOf('senuelo')}finally{INVMODE=null}
  if(!lst.length)return '';
  var sel=String(e.lureIds||'').split(',').filter(Boolean);
  var gk='e'+i+'lures',names=String(e.lureNames||'').split(' | ').filter(Boolean);
  return '<details class="gdet gsec lurerow" data-gk="'+gk+'"'+(GOPEN[gk]?' open':'')+'><summary><span>Señuelos</span><small>'+(names.length?names.length+' elegidos':lst.length+' guardados · toca para elegir')+'</small></summary><div class="gbody"><div class="lgrid">'+
    lst.map(function(it){var on=sel.indexOf(it.id)>-1;
      return '<button type="button" class="lchip'+(on?' on':'')+'" data-a="lure-use" data-i="'+i+'" data-id="'+esc(it.id)+'" aria-pressed="'+on+'">'+(it.foto?'<img src="'+esc(it.foto)+'" alt="">':'<span class="lnoimg"></span>')+'<span class="lt"><b>'+esc(it.marca||it.estilo||'Señuelo')+'</b><small>'+esc([it.estilo,it.gr?it.gr+' g':'',it.mm?it.mm+' mm':''].filter(Boolean).join(' · '))+'</small></span></button>'}).join('')+'</div></div></details>';
}
var _eqCard26=eqCard;
eqCard=function(e,i,n){
  var h=_eqCard26(e,i,n),row=lureRow(e,i);
  if(!row)return h;
  var rx=new RegExp('<details class="gdet gsec" data-gk="e'+i+'apar"');
  if(rx.test(h))return h.replace(rx,function(m){return row+m});
  return h.replace('</div></details>',function(m){return m+row});
};
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a="lure-use"]'):null;if(!b||!tripDraft)return;
  ev.preventDefault();ev.stopPropagation();
  var e=tripDraft.equipos[+b.getAttribute('data-i')];if(!e)return;
  var id=b.getAttribute('data-id'),ids=String(e.lureIds||'').split(',').filter(Boolean),k=ids.indexOf(id);
  if(k>-1)ids.splice(k,1);else ids.push(id);
  var byId={};INV.forEach(function(x){byId[x.id]=x});
  e.lureIds=ids.join(',');e.lureNames=ids.map(function(x){return byId[x]?lureShort(byId[x]):''}).filter(Boolean).join(' | ');
  GOPEN.top=true;gearRepaint();
},true);
var _pill26=eqPillsArr;
eqPillsArr=function(e){var p=_pill26(e);if(e.lureNames){var n=String(e.lureNames).split(' | ');p.push('Señuelos: '+(n.length>2?n.slice(0,2).join(', ')+' +'+(n.length-2):n.join(', ')))}return p};
var _st26=document.createElement('style');_st26.textContent='.lchip{min-width:0;overflow:hidden}.lgrid{display:grid;grid-template-columns:minmax(0,1fr);gap:6px}.lchip{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:12px;border:1.5px solid var(--line);background:var(--surface);color:var(--text);text-align:left;min-height:56px;position:relative}.lchip img,.lchip .lnoimg{width:52px;height:40px;object-fit:contain;flex:none}.lchip .lt{display:flex;flex-direction:column;gap:1px;min-width:0}.lchip b{font:600 12px/1.2 var(--display);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.lchip small{font-size:10.5px;opacity:.7;line-height:1.2}.lchip.on{border-color:var(--accent);background:var(--accent-soft)}.lchip.on::after{content:"";position:absolute;top:6px;right:6px;width:8px;height:8px;border-radius:50%;background:var(--accent)}';document.head.appendChild(_st26);
