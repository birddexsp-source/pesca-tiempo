/* ===== p70: ficha de especie — Resumen corto, detalle en filas que se abren ===== */
var _osd70=openSpeciesDetail;
openSpeciesDetail=function(k){
  _osd70(k);
  var body=document.getElementById('sheetbody');if(!body)return;
  try{
    var pn=body.querySelector('.spp[data-p="res"]');if(!pn||pn.querySelector('.uiacc'))return;
    [].forEach.call(body.querySelectorAll(':scope > .block'),function(b){var e=b.querySelector('.eyebrow');if(e&&/Talla mínima en|Cebo que funciona/i.test(e.textContent))b.remove()});
    var by=function(re){return [].slice.call(pn.querySelectorAll('.block,.card,section')).filter(function(b){if(b.closest('.uiacc')&&b.parentNode!==pn)return false;var e=b.querySelector('.eyebrow');return e&&re.test(e.textContent)})};
    var mk=function(key,icon,title,sub,els){
      if(!els.length)return;var a=uiDom(uiAccHTML('sp'+key+k,icon,title,sub,'')),box=a.firstChild.querySelector('.uib');
      els[0].insertAdjacentElement('beforebegin',a.firstChild);var d=pn.querySelector('[data-uk="sp'+key+k+'"] .uib');
      els.forEach(function(e){e.classList.add('flat');d.appendChild(e)});
    };
    var num=by(/Tallas que has|Con qué cebo|Con qué agua|Cebo que funciona/i);
    var nums=num.filter(function(b){return !/Cebo que funciona/i.test(b.querySelector('.eyebrow').textContent)});
    var dup=num.filter(function(b){return /Cebo que funciona/i.test(b.querySelector('.eyebrow').textContent)});
    dup.forEach(function(b){b.remove()});
    mk('num','📊','Tus números en detalle','Tallas · cebo · agua',nums);
    var cu=by(/Cuándo la pillas/i);mk('cu','🕐','Cuándo la pillas',cu[0]?uiFirst((cu[0].textContent.match(/(Fiable|Orientativo|Poca base|Sin datos)[^.]*/i)||[''])[0],50):'',cu);
    var po=by(/Para otra como esta/i);mk('po','💡','Para otra como esta','Dónde, cuándo, cebo, montaje',po);
    
  }catch(e){}
};
(function(){var s=document.createElement('style');s.textContent='.spp .uiacc{margin-bottom:10px}.spp .uib>.block{margin:0;padding:0;border:0;background:none}.spp .uib>.block+.block{margin-top:14px;padding-top:12px;border-top:1px solid var(--line)}';document.head.appendChild(s)})();
