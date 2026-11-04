/* ===== p28: Mi equipo como pestaña propia ===== */
(function(){
  var st=document.createElement('style');
  st.textContent='.tabbar nav{grid-template-columns:repeat(5,1fr)!important;gap:2px!important}.tabbar a{font-size:10.5px!important}.eqpane h2{margin:2px 0 4px;font:700 20px/1.2 var(--display)}.eqpane .hint{margin:0 0 12px}';
  document.head.appendChild(st);
  var nav=document.querySelector('.tabbar nav');
  if(nav&&!document.getElementById('t-equipo')){
    var a=document.createElement('a');a.href='#equipo';a.id='t-equipo';
    a.innerHTML='<svg viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18M11 13v2h2v-2"/></svg>Equipo';
    nav.insertBefore(a,document.getElementById('t-capturas'));
  }
  var _renderMain=renderMain;
  renderMain=function(){
    var q=document.getElementById('t-equipo');
    if(tab!=='equipo'){if(q)q.setAttribute('aria-current','false');return _renderMain()}
    ['hoy','mapa','salidas','capturas','equipo'].forEach(function(t){var e=document.getElementById('t-'+t);if(e)e.setAttribute('aria-current',t===tab?'page':'false')});
    var main=$('#main');main.classList.remove('fill');$('#fabslot').innerHTML='';
    if(!db||!(loaded.spots&&loaded.trips&&loaded.catches)){return _renderMain()}
    main.innerHTML='<div class="eqpane" id="eqpane">'+eqPaneHTML()+'</div>';
    main.scrollTop=0;
  };
  var _route=route;
  route=function(){
    var r=(location.hash||'').replace('#','');
    if(r==='equipo'){if(tab!=='equipo'){tab='equipo';placing=null}renderMain();return}
    return _route();
  };
  window.removeEventListener('hashchange',_route);window.addEventListener('hashchange',route);
  var _refresh=refresh;
  refresh=function(){
    if(tab==='equipo'){
      if(sheetOpen)return;var a=document.activeElement;if(a&&(a.tagName==='INPUT'||a.tagName==='TEXTAREA'))return;
      eqRender();return;
    }
    return _refresh();
  };
  /* Salidas: sin botón de equipo */
  var _rs=renderSalidas;
  renderSalidas=function(){return _rs().replace(/<button type="button" class="invbtn"[\s\S]*?<\/button>/,'')};
  invOpen=function(){location.hash='#equipo'};
  if(location.hash==='#equipo')route();
})();
