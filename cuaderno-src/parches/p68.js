/* ===== p68: Salidas en filas compactas, últimas primero ===== */
var TRN=6;
function trShort(d){return String(d||'').slice(0,3)}
var _rs68=renderSalidas;
renderSalidas=function(){
  var h=_rs68(),D;
  try{
    D=uiDom(h);var arts=[].slice.call(D.querySelectorAll('article.trip.tcc'));if(!arts.length)return h;
    arts.forEach(function(a,i){
      var op=a.querySelector('.tcopen'),id=op?op.getAttribute('data-id'):'',dc=a.querySelector('.dchip'),nm=a.querySelector('h3'),sub=a.querySelector('.htx p'),fb=a.querySelector('.fbadge'),tcs=a.querySelector('.tcs'),tct=a.querySelector('.tct');
      if(!op||!dc||!nm)return;
      var meta=(sub?sub.textContent.replace(/^[a-záéíóú]+ · /i,function(m){return m}):'');
      var chips=tcs?[].map.call(tcs.querySelectorAll('span'),function(x){return x.textContent.replace(/\s+/g,' ').trim()}).filter(function(x){return /h$|spot/.test(x)}).join(' · '):'';
      var fish=tct?[].map.call(tct.querySelectorAll('em'),function(x){return x.textContent.replace(/\s+/g,' ').trim()}).join(', '):'';
      var r=document.createElement('article');r.className='trip tcc trow';r.style.animationDelay='0ms';
      r.innerHTML='<div role="button" tabindex="0" class="tcopen" data-a="trip-open" data-id="'+esc(id)+'" aria-label="Abrir salida"><div class="dchip"><b>'+dc.querySelector('b').textContent+'</b><span>'+dc.querySelector('span').textContent+'</span></div><div class="trm"><h3>'+nm.innerHTML+'</h3><p>'+esc(meta)+(chips?' · '+esc(chips):'')+'</p>'+(fish?'<div class="trf">🐟 '+esc(fish)+'</div>':'')+'</div>'+(fb?'<div class="fbadge"><b>'+fb.querySelector('b').textContent+'</b><span>'+fb.querySelector('span').textContent+'</span></div>':'<i class="tcg" aria-hidden="true">›</i>')+'</div>';
      a.replaceWith(r);
    });
    var rows=[].slice.call(D.querySelectorAll('article.trow')),hid=0;
    if(rows.length>TRN){rows.slice(TRN).forEach(function(r){if(!UIO.trall){r.hidden=true;hid++}});
      if(!UIO.trall){[].forEach.call(D.querySelectorAll('.mhead'),function(m){var n=m.nextElementSibling;if(n&&n.hidden)m.hidden=true});
        rows[TRN-1].insertAdjacentHTML('afterend','<button type="button" class="trmore" data-a="ui-trall">Ver las '+hid+' salidas anteriores</button>')}}
    h=D.innerHTML;
  }catch(e){return h}
  return h;
};
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a="ui-trall"]'):null;if(!b)return;
  ev.stopPropagation();UIO.trall=true;try{refresh()}catch(e){}
},true);
(function(){var s=document.createElement('style');s.textContent=
'.trow{padding:0!important;overflow:hidden}.trow .tcopen{display:flex;align-items:center;gap:12px;padding:12px 14px;cursor:pointer}.trow .dchip{flex:none;width:46px;height:50px;border-radius:14px;background:var(--surface2);border:1px solid var(--line);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;position:static}.trow .dchip b{font:800 18px/1 var(--display)}.trow .dchip span{font:700 9.5px var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}'+
'.trm{flex:1;min-width:0}.trm h3{margin:0;font:700 15.5px/1.25 var(--display);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.trm p{margin:1px 0 0;color:var(--muted);font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.trf{margin-top:5px;font:600 12.5px var(--display);color:var(--accent);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
'.trow .fbadge{flex:none;position:static;min-width:46px}.trow .tcg{flex:none;color:var(--dim);font-style:normal;font-size:20px}.trow[hidden],.mhead[hidden]{display:none!important}.trmore{display:block;width:100%;margin:10px 0 4px;padding:13px;border-radius:16px;border:1px dashed var(--line);background:transparent;color:var(--muted);font:600 13.5px var(--display)}'+
'.lvch{min-height:0!important;gap:12px!important}.lvc{flex:none!important;display:grid!important;grid-template-columns:60px 1fr;align-items:center;gap:4px 14px!important;padding:18px!important;border-radius:22px!important}.lvc .big{position:static!important;font-size:40px!important;grid-row:1/3;text-align:center}.lvc .tt{display:flex;flex-direction:column;gap:3px}.lvc .tt b{font:700 18px var(--display)}.lvc .tt small{font-size:12.5px;line-height:1.35}.lvc .cta{grid-column:2;justify-self:start;margin-top:4px;padding:8px 16px!important;font-size:13px!important}'+
'.entip.one{margin-top:10px;border-top:1px solid var(--line);padding-top:10px}.enc .enact{margin-top:10px}'+
/* preguntas: opciones en una fila de chips, acciones pequeñas */
'.qrc,.qrc.n2,.qrc.n3{display:flex!important;flex-wrap:wrap;gap:8px!important}.qro{flex-direction:row!important;min-height:44px!important;padding:8px 14px!important;border-radius:99px!important;gap:7px!important}.qro .qe{font-size:18px!important}'+
'.qrv{display:flex;gap:8px}.qrm{flex:1;min-height:40px!important;padding:6px 10px!important;font-size:13px!important}.qrcard .qrpass{display:inline-block!important;width:auto!important;margin:2px 14px 0 0!important}.qrpass{padding:4px!important;font-size:12.5px!important;min-height:0!important}';
document.head.appendChild(s)})();
