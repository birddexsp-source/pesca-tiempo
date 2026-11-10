/* ===== p66: ficha del spot en pestañas (Resumen · Rinde · Visitas) ===== */
var STT='res';
var _oss66=openSpotSheet;
openSpotSheet=function(id){
  _oss66(id);
  var body=document.getElementById('sheetbody');if(!body||body.querySelector('.stx'))return;
  try{
    var kids=[].slice.call(body.children),P={res:[],rin:[],vis:[],his:[]},cur='res',keep=[],act=null;
    kids.forEach(function(c){
      if(c.matches('.shero,.stseg,.sci,.stx'))return;
      if(c.matches('.actions')){act=c;return}
      if(c.matches('.sect')){var t=c.textContent;cur=/Planificador/.test(t)?'res':/funciona/.test(t)?'rin':/Memoria/.test(t)?'vis':/Historial/.test(t)?'his':cur;if(/Planificador/.test(t))P[cur].push(c);else c.remove();return}
      if(c.matches('.agwrap,.enrec,.rules'))P.rin.push(c);
      else if(c.matches('.mvl'))P.vis.push(c);
      else P[cur].push(c);
    });
    /* cada visita: lo importante a la vista, el agua al tocar */
    P.vis.forEach(function(l){[].forEach.call(l.querySelectorAll('.mvc'),function(a,i){
      var res=a.querySelector('.mvr'),rest=[],n=res;if(!res)return;while(n&&n.nextElementSibling){n=n.nextElementSibling;rest.push(n)}
      if(!rest.length)return;
      var sel=a.querySelector('.mva [aria-pressed="true"],.mva .on,.mva .sel'),txt=sel?sel.textContent.replace(/\s+/g,' ').trim():'Sin apuntar',d=document.createElement('details');d.className='mvdet';d.setAttribute('data-uk','mvd'+id+i);if(UIO['mvd'+id+i])d.open=true;
      d.innerHTML='<summary>💧 Agua: '+esc(txt)+'</summary>';rest.forEach(function(r){d.appendChild(r)});a.appendChild(d)})});
    var rl=P.rin.filter(function(e){return e.matches('.rules')}),rest=P.rin.filter(function(e){return !e.matches('.rules')}).sort(function(a,b){return (a.matches('.enrec')?0:1)-(b.matches('.enrec')?0:1)});
    var nrl=rl[0]?rl[0].children.length:0,rlh='';
    if(rl[0]){var nd=[].filter.call(rl[0].children,function(x){return /Aún sin datos/.test(x.textContent)}).length;rlh=uiAccHTML('strl'+id,'🧠','Lo que te funciona',nd===nrl?'Aún sin datos · se afina con cada salida':(nrl-nd)+' de '+nrl+' con datos',rl[0].outerHTML);rl[0].remove()}
    P.rin=rest;
    var his=P.his.map(function(e){return e.outerHTML}).join(''),hn=(body.querySelectorAll('.tli').length);
    P.his.forEach(function(e){e.remove()});
    var ru=P.rin.length&&!P.rin.some(function(e){return e.matches('.rules')})?'':'';
    var tabs=[['res','Resumen'],['rin','Cómo rinde'],['vis','Visitas'+(P.vis.length&&body.querySelectorAll('.mvc').length?' · '+body.querySelectorAll('.mvc').length:'')]];
    if(!/^(res|rin|vis)$/.test(STT))STT='res';
    var nav='<div class="spx-nav stx" role="tablist">'+tabs.map(function(t){return '<button type="button" role="tab" class="'+(STT===t[0]?'on':'')+'" data-a="st-tab" data-v="'+t[0]+'" aria-selected="'+(STT===t[0])+'">'+t[1]+'</button>'}).join('')+'</div>';
    var wrap=document.createElement('div');wrap.className='stp';
    wrap.innerHTML=nav;
    var mk=function(k,els,extra){var s=document.createElement('section');s.className='stpn';s.setAttribute('data-p',k);s.hidden=STT!==k;els.forEach(function(e){s.appendChild(e)});if(extra)s.insertAdjacentHTML('beforeend',extra);wrap.appendChild(s)};
    mk('res',P.res);mk('rin',P.rin,rlh);
    mk('vis',P.vis,his?uiAccHTML('sthis','📜','Historial',hn+(hn===1?' salida':' salidas'),his):'');
    var anchor=body.querySelector('.stseg')||body.querySelector('.shero');
    if(anchor)anchor.insertAdjacentElement('afterend',wrap);else body.prepend(wrap);
    /* si no hay nada en una pestaña, la quito */
    [].forEach.call(wrap.querySelectorAll('.stpn'),function(s){if(!s.children.length){var b=wrap.querySelector('[data-v="'+s.getAttribute('data-p')+'"]');if(b)b.remove();s.remove()}});
    if(!wrap.querySelector('.stpn[data-p="'+STT+'"]')){var f=wrap.querySelector('.stpn');if(f){f.hidden=false;STT=f.getAttribute('data-p');var fb=wrap.querySelector('[data-v="'+STT+'"]');if(fb)fb.classList.add('on')}}
  }catch(e){}
};
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a="st-tab"]'):null;if(!b)return;
  ev.stopPropagation();STT=b.getAttribute('data-v');
  [].forEach.call(document.querySelectorAll('.stx button'),function(x){var on=x===b;x.classList.toggle('on',on);x.setAttribute('aria-selected',on)});
  [].forEach.call(document.querySelectorAll('.stp .stpn'),function(p){p.hidden=p.getAttribute('data-p')!==STT});
},true);
(function(){var s=document.createElement('style');s.textContent=
'.stx{top:-1px;display:flex;width:100%;box-sizing:border-box}.stpn{display:flex;flex-direction:column;gap:12px}.stpn[hidden]{display:none}.stpn>.block,.stpn>.card{margin:0}.mvdet{margin-top:8px;border-top:1px solid var(--line);padding-top:6px}.mvdet>summary{list-style:none;cursor:pointer;font:600 12.5px var(--display);color:var(--muted);padding:4px 0}.mvdet>summary::-webkit-details-marker{display:none}.mvdet>summary::after{content:" ▾"}.mvdet[open]>summary::after{content:" ▴"}';
document.head.appendChild(s)})();
