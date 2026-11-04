/* ===== p30: Barrido en la cabecera, junto al rayo ===== */
(function(){
  var q=document.querySelector('.qcbtn');
  if(q&&!document.querySelector('.swbtn'))q.insertAdjacentHTML('afterend','<button class="cfgbtn qcbtn swbtn" data-a="sw-new" aria-label="Barrido"><svg viewBox="0 0 24 24"><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h5a3 3 0 0 0 0-6h-2a3 3 0 0 1 0-6h5"/></svg></button>');
  var st=document.createElement('style');st.textContent='.swbtn{background:var(--surface)!important;color:var(--accent)!important}.topbar h1{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:15px!important;letter-spacing:-.01em}.topbar .when{display:none}.topbar .cfgbtn,.topbar .syncbtn{flex:none;width:36px;height:36px;min-width:0}.topbar .cfgbtn svg,.topbar .syncbtn svg{width:19px;height:19px}.topbar{gap:4px!important}';document.head.appendChild(st);
  var _sw=swSection;
  swSection=function(){return _sw().replace(/<button type="button" class="qcbig swbig"[\s\S]*?<\/button>/,'')};
})();
