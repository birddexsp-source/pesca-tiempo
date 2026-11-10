/* ===== p67: Ajustes como filas con icono que se despliegan ===== */
var _os67=openSettings;
openSettings=function(){
  _os67.apply(this,arguments);
  var b=document.getElementById('sheetbody');if(!b||b.querySelector('.uiacc'))return;
  try{
    var cm=b.querySelector('#cmblk'),qr=b.querySelector('#qrblk'),ex=b.querySelector('#expblk'),out=[],used=[];
    var wrapEl=function(k,icon,title,sub,el){var a=document.createElement('div');a.innerHTML=uiAccHTML(k,icon,title,sub,'');var det=a.firstChild;det.querySelector('.uib').appendChild(el);el.classList.add('flat');var h=el.querySelector(':scope > h3');if(h)h.remove();return det};
    if(cm){
      var S=cmStats(),n=0,ok=0;CMF.forEach(function(c){n+=S[c[0]].n;ok+=S[c[0]].ok});var p=n?Math.round(100*ok/n):100;
      var nv=0,vis={};CMF.forEach(function(c){S[c[0]].miss.forEach(function(l){vis[cmKey(l)]=1})});nv=Object.keys(vis).length;
      var d=wrapEl('set-cm','🧩','Completar salidas anteriores',nv?nv+(nv===1?' salida con datos sin marcar · ':' salidas con datos sin marcar · ')+p+' %':'Todo al día · '+p+' %',cm);
      if(nv&&!UIO['set-cm']&&UIO['set-cm']===undefined)d.open=true;out.push(d);
    }
    if(qr){qr.classList.add('uiacc');var sm=qr.querySelector(':scope > summary'),t=sm?sm.textContent.replace(/\s+/g,' ').trim():'';var sm0=sm.querySelector('small'),n2=(t.match(/\d+/)||[0])[0],subq=sm0?sm0.textContent.trim():n2+(+n2===1?' guardada':' guardadas');
      sm.innerHTML='<span class="uii">🎙</span><span class="uit"><b>Mis respuestas rápidas</b><small>'+esc(subq)+'</small></span><i class="uic"></i>';
      qr.setAttribute('data-uk','set-qr');if(UIO['set-qr'])qr.open=true;
      var inner=document.createElement('div');inner.className='uib';while(sm.nextSibling)inner.appendChild(sm.nextSibling);qr.appendChild(inner);out.push(qr)}
    if(ex){out.push(wrapEl('set-ex','💾','Copia de seguridad','Descargar tus datos en .json o .csv',ex))}
    /* lo que queda: texto de sitios y spots */
    var rest=[].slice.call(b.children).filter(function(c){return c!==cm&&c!==qr&&c!==ex&&!c.classList.contains('uiacc')});
    if(rest.length){var box=document.createElement('div');rest.forEach(function(r){box.appendChild(r)});
      var ns=sites.length,np=spots.length,w=document.createElement('div');w.className='flat';w.appendChild(box);
      var det=wrapEl('set-tx','📝','Descripciones de sitios y spots',ns+(ns===1?' sitio':' sitios')+' · '+np+(np===1?' spot':' spots')+' · para pegar en el chat',w);out.push(det)}
    out.forEach(function(e){b.appendChild(e)});
  }catch(e){}
};
(function(){var s=document.createElement('style');s.textContent='#qrblk.uiacc>summary{flex-direction:row!important;align-items:center!important;gap:12px!important}#sheetbody>.uiacc{margin-bottom:10px}#sheetbody .uib .block{margin:0;padding:0;border:0;background:none}';document.head.appendChild(s)})();
