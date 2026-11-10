/* ===== p71: formulario de salida — lo esencial a la vista, lo opcional en filas ===== */
var _mb71=mixBlock;
mixBlock=function(d){
  var h=_mb71(d);if(!h)return h;
  var sel=(d.cebos||[]).map(function(c){return c.n}).join(', ');
  return uiAccHTML('fm-cebo','🪱','Cebos de la salida',esc(sel||'Toca para elegir (opcional)'),h.replace('<h3>Cebos de la salida</h3>','').replace('<div class="block mixb">','<div class="mixb">'));
};
var _ss71=stepSite;
stepSite=function(){
  var h=_ss71();
  try{
    var D=uiDom(h);
    [].forEach.call(D.querySelectorAll(':scope > .block'),function(b){
      var t=((b.querySelector('h3')||{}).textContent||'').trim();
      if(/Windy y mareas/.test(t)){var h3=b.querySelector('h3');h3.remove();b.classList.add('flat');var a=uiDom(uiAccHTML('fm-windy','🌊','Windy y mareas','Opcional · altura del agua, ola y viento',b.outerHTML));b.replaceWith(a.firstChild)}
      else if(/A dónde has ido/.test(t)){
        var f=b.querySelector(':scope > .field');
        if(f&&f.querySelector('textarea')&&!f.querySelector('input')){var ta=f.querySelector('textarea'),v=ta?ta.value||ta.textContent:'';var a2=uiDom(uiAccHTML('fm-desc','📝','Descripción del sitio',esc(uiFirst(v,44)||'Cómo es, cómo se llega…'),''));var box=a2.firstChild.querySelector('.uib');f.replaceWith(a2.firstChild);a2.firstChild;var det=D.querySelector('[data-uk="fm-desc"] .uib');if(det)det.appendChild(f)}
      }
    });
    return D.innerHTML;
  }catch(e){return h}
};
(function(){var s=document.createElement('style');s.textContent='#stp .gtop>summary{display:grid!important;grid-template-columns:38px 1fr auto;align-items:center;gap:0 12px}#stp .gtop>summary::before{content:"🎣";grid-row:1/3;width:38px;height:38px;border-radius:12px;display:grid;place-items:center;font-size:19px;background:var(--accent-soft,rgba(58,208,200,.12));border:1px solid var(--line)}#stp .gtop>summary>span{font:700 15px var(--display)}#stp .gtop>summary>small{grid-column:2;text-align:left}#stp .uiacc{margin-bottom:12px}#stp .uib>.flat{margin:0!important}#stp .uib>.mixb h3{display:none}#stp .uib>.mixb{margin:0}#stp .uiacc .field{margin:0}';document.head.appendChild(s)})();
