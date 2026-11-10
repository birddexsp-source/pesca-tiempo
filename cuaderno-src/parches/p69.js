/* ===== p69: Capturas con lo justo a la vista ===== */
var _rc69=renderCapturas;
renderCapturas=function(){
  var h=_rc69(),D;
  try{
    D=uiDom(h);
    [].forEach.call(D.querySelectorAll(':scope > .cpanel'),function(p,i){
      var t=((p.querySelector('.hd b')||{}).textContent||'').trim();if(!t)return;
      var icon=/Tallas/.test(t)?'📏':/Spots/.test(t)?'📍':'📊',sub=/Tallas/.test(t)?(p.querySelector('.hd span,.hd small')||{}).textContent||'':[].slice.call(p.querySelectorAll('.bars > *')).slice(0,2).map(function(x){return [].map.call(x.children,function(c){return c.textContent.trim()}).filter(Boolean).join(' ')}).join(' · ');
      if(/Ranking/.test(t))return;
      var hd=p.querySelector('.hd');if(hd)hd.remove();p.classList.add('flat');p.classList.remove('card');
      var a=uiDom(uiAccHTML('cap'+i,icon,esc(t),esc(uiFirst(sub,50)),p.outerHTML));p.replaceWith(a.firstChild);
    });
    var bc=D.querySelector(':scope > .baitcard');
    if(bc){var rows=[].slice.call(bc.querySelectorAll('.brow')),sub=rows.slice(0,2).map(function(r){return r.querySelector('b').textContent+' '+r.querySelector('.bn').textContent}).join(' · ');
      var blk=bc.querySelector('.block');if(blk){blk.classList.add('flat');var a2=uiDom(uiAccHTML('capbait','🪱','Tus cebos',esc(uiFirst(sub,50)),blk.outerHTML));bc.replaceWith(a2.firstChild)}}
    h=D.innerHTML;
  }catch(e){return h}
  return h;
};
(function(){var s=document.createElement('style');s.textContent=
'.ccard .cptap{display:none}.ccard .ft{display:flex;gap:6px;justify-content:flex-end;margin-top:8px}.ccard .ft .btn{min-height:30px;padding:4px 12px;font-size:12px}.uiacc .brow{padding:8px 0;border-top:1px solid var(--line)}.uiacc .brow:first-child{border-top:0}';
document.head.appendChild(s)})();
