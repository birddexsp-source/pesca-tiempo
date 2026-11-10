/* ===== p65: interfaz visual — resumen primero, detalle al tocar =====
   Componentes: acordeón con icono (uiAcc) que recuerda si lo abriste, y el Plan reordenado. */
var UIO={};
function uiOpen(k){return !!UIO[k]}
document.addEventListener('toggle',function(ev){var d=ev.target;if(d&&d.getAttribute&&d.getAttribute('data-uk'))UIO[d.getAttribute('data-uk')]=d.open},true);
function uiAccHTML(k,icon,title,sub,inner,cls){
  return '<details class="uiacc '+(cls||'card')+'" data-uk="'+esc(k)+'"'+(UIO[k]?' open':'')+'><summary><span class="uii">'+icon+'</span><span class="uit"><b>'+title+'</b>'+(sub?'<small>'+sub+'</small>':'')+'</span><i class="uic" aria-hidden="true"></i></summary><div class="uib">'+inner+'</div></details>';
}
function uiDom(h){var d=document.createElement('div');d.innerHTML=h;return d}
function uiFirst(t,n){t=String(t||'').replace(/\s+/g,' ').trim();return t.length>n?t.slice(0,n-1)+'…':t}
function uiShort(t){return String(t||'').split(' (')[0]}
/* Plan */
function uiPlanTop(){
  var P=null,A=null;try{P=enPlan()}catch(e){}
  if(!P){try{A=mdAdvice()}catch(e){}if(!A||!A.top||!A.top.length)return null;var c=A.top[0];P={c:c,s:c.E.s}}
  var c=P.c,b=c.E.best,tiles=[['🕖','Ventana',mm(b.from)+'–'+mm(b.to)]];
  if(P.franja)tiles.push(['🌅','Franja',uiShort(P.franja.best.t)]);
  if(P.cebo)tiles.push(['🪱','Cebo',P.cebo.best.t]);
  if(tiles.length<3&&P.mont&&P.mont[0])tiles.push(['🪝','Anzuelo',uiFirst(P.mont[0][1].split(';')[0],22)]);
  var h='<section class="card pnext"><button type="button" class="pnh" data-a="day" data-d="'+c.iso+'"><span class="pni">🎯</span><span class="pnx"><small>Tu próxima salida</small><b>'+esc(mdDayShort(c.iso))+' · '+esc(P.s.name)+'</b></span><em class="pnsc">'+pct(c.sc)+'<u>%</u></em></button>'+
    '<div class="pnt">'+tiles.map(function(x){return '<div><i>'+x[0]+'</i><small>'+x[1]+'</small><b>'+esc(x[2])+'</b></div>'}).join('')+'</div>';
  return h;
}
var _rh65=renderHoy;
renderHoy=function(){
  var h=_rh65(),D;
  try{
    D=uiDom(h);var q=function(s){return D.querySelector(':scope > '+s)};
    var days=q('.pdays'),ver=q('.pverdict'),adv=q('.mdadv'),pl=q('.enpl'),met=q('.pmeteo'),ag=q('.agday');
    if(!ver)return h;
    var top=uiPlanTop(),topEl=null;
    if(top){
      var more='';if(adv){adv.classList.add('flat');more+=adv.outerHTML;adv.remove()}
      if(pl){pl.classList.add('flat');more+=pl.outerHTML;pl.remove()}
      var T=uiDom(top+(more?'<details class="pmore" data-uk="pmore"'+(UIO.pmore?' open':'')+'><summary>Por qué y otras opciones</summary>'+more+'</details>':'')+'</section>');topEl=T.firstChild;
    }
    var anchor=days||D.firstChild;
    if(ver.parentNode===D&&anchor)anchor.insertAdjacentElement('afterend',ver);
    if(topEl)ver.insertAdjacentElement('afterend',topEl);
    if(met){var mt=(met.textContent.match(/Condiciones del día\s*(.*?)(?:Marea|$)/)||[])[1]||'';var a=uiDom(uiAccHTML('pmet','🌤','Condiciones del día',esc(uiFirst(mt,48)),met.outerHTML.replace('class="card pmeteo','class="flat pmeteo')));met.replaceWith(a.firstChild)}
    if(ag){var gt=ag.querySelector('.agr');var a2=uiDom(uiAccHTML('pagua','💧','Agua y mar',esc(uiFirst(gt?gt.textContent:'',52)),ag.outerHTML.replace('class="card agday','class="flat agday')));ag.replaceWith(a2.firstChild)}
    [].forEach.call(D.querySelectorAll(':scope > .psite'),function(art,i){
      var smb=art.querySelector('.smb');if(!smb)return;
      var n=smb.querySelectorAll('.smr').length,nd=smb.querySelectorAll('.smr.nd').length,k='psm'+i+uiFirst((art.querySelector('h3')||{}).textContent,20);
      var d=document.createElement('details');d.className='psmd';d.setAttribute('data-uk',k);if(UIO[k])d.open=true;
      d.innerHTML='<summary>Tus reglas para este día'+(nd===n?' · sin datos aún':'')+'</summary>';smb.classList.remove('smb');d.appendChild(smb.cloneNode(true));smb.replaceWith(d);
    });
    h=D.innerHTML;
  }catch(e){return h}
  return h;
};
(function(){var s=document.createElement('style');s.textContent=
'.uiacc{padding:0!important;overflow:hidden}.uiacc>summary{list-style:none;display:flex;align-items:center;gap:12px;padding:13px 14px;cursor:pointer;-webkit-tap-highlight-color:transparent}.uiacc>summary::-webkit-details-marker{display:none}'+
'.uii{flex:none;width:38px;height:38px;border-radius:12px;display:grid;place-items:center;font-size:19px;background:var(--accent-soft,rgba(58,208,200,.12));border:1px solid var(--line)}.uit{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px}.uit b{font:700 15px/1.25 var(--display)}.uit small{color:var(--muted);font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
'.uic{flex:none;width:9px;height:9px;border-right:2px solid var(--muted);border-bottom:2px solid var(--muted);transform:rotate(45deg);margin:0 4px 3px 0;transition:transform .2s}.uiacc[open]>summary .uic{transform:rotate(-135deg);margin-bottom:-3px}.uiacc[open]>summary{border-bottom:1px solid var(--line)}.uib{padding:12px 14px 14px}.uib>.flat{margin:0!important;padding:0!important;border:0!important;background:none!important;box-shadow:none!important}'+
'.pnext{display:block!important;border:1px solid rgba(58,208,200,.35);background:linear-gradient(155deg,rgba(58,208,200,.12),var(--surface) 65%);padding:0!important;overflow:hidden}.pnh{all:unset;box-sizing:border-box;display:flex;align-items:center;gap:12px;width:100%;padding:14px 14px 10px;cursor:pointer}.pni{flex:none;width:42px;height:42px;border-radius:14px;display:grid;place-items:center;font-size:21px;background:rgba(58,208,200,.16)}.pnx{flex:1;min-width:0;display:flex;flex-direction:column}.pnx small{font:700 10.5px var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--tide)}.pnx b{font:700 17px/1.25 var(--display)}'+
'.pnsc{font:800 22px var(--display);font-style:normal;color:var(--accent)}.pnsc u{font-size:12px;text-decoration:none;opacity:.7}.pnt{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:0 14px 14px}.pnt>div{display:flex;flex-direction:column;gap:2px;padding:10px;border-radius:14px;background:var(--surface2);border:1px solid var(--line);min-width:0}.pnt i{font-style:normal;font-size:18px}.pnt small{font:700 9.5px var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--dim)}.pnt b{font:600 13px/1.25 var(--display);overflow-wrap:anywhere}'+
'.pmore{border-top:1px solid var(--line)}.pmore>summary{list-style:none;padding:12px 14px;font:600 13px var(--display);color:var(--muted);cursor:pointer;display:flex;justify-content:space-between}.pmore>summary::-webkit-details-marker{display:none}.pmore>summary::after{content:"▾";transition:transform .2s}.pmore[open]>summary::after{transform:rotate(180deg)}.pmore>.flat{margin:0 14px 14px!important;padding:12px!important;border:1px solid var(--line)!important;border-radius:16px;background:var(--surface2)!important}'+
'.psmd{margin:10px 0}.psmd>summary{list-style:none;cursor:pointer;font:600 12.5px var(--display);color:var(--muted);padding:6px 0}.psmd>summary::-webkit-details-marker{display:none}.psmd>summary::before{content:"▸ "}.psmd[open]>summary::before{content:"▾ "}';
document.head.appendChild(s)})();
