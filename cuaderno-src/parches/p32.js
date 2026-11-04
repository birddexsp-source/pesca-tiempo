/* ===== p32: equipo usado en la salida, estadísticas, exportar, por comprar ===== */
(function(){var s=document.createElement('style');s.textContent=
'.usedbox{margin:0 0 10px}.usedbox>.invl{display:block;margin:2px 0 6px}.ugrid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-height:320px;overflow-y:auto;padding:2px}'+
'.utile{position:relative;display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 4px;border-radius:12px;border:1.5px solid var(--line);background:var(--surface);color:inherit;min-width:0}'+
'.utile .ivph{width:52px;height:52px}.utile span:last-child{font-size:11px;line-height:1.2;text-align:center;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;word-break:break-word}'+
'.utile.on{border-color:var(--accent,#3ad0c8);background:rgba(58,208,200,.14)}.utile.on::after{content:"✓";position:absolute;top:3px;right:6px;font-weight:700;color:var(--accent,#3ad0c8)}'+
'.ubob{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:0 0 8px}.ubob small{color:var(--muted);flex-basis:100%}'+
'.stbar{height:6px;border-radius:3px;background:rgba(255,255,255,.08);margin-top:5px;overflow:hidden}.stbar i{display:block;height:100%;background:var(--accent,#3ad0c8)}'+
'.stf{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 10px}.stf select{width:100%;min-width:0}.stk{display:flex;gap:6px;overflow-x:auto;margin:0 0 10px;padding-bottom:2px}.stk .chip{flex:none}'+
'.stn{display:flex;gap:6px;flex-wrap:wrap;margin:5px 0 0}.stn em{font-style:normal;font-size:12px;padding:2px 8px;border-radius:10px;background:rgba(255,255,255,.07);color:var(--muted)}'+
'.cbuy{margin-left:auto;flex:none;font:700 11px var(--display);padding:3px 8px;border-radius:10px;background:rgba(255,190,60,.18);color:#ffbe3c}'+
'.eqx2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:0 0 12px}.eqx2 .eqcat small{color:var(--muted)}'+
'.sbk{margin:0 0 12px}.sbk .btn{width:100%;margin:0 0 8px}';
document.head.appendChild(s)})();

/* ---------- A. equipo usado en la salida ---------- */
var USEK=[['cana','Cañas'],['carrete','Carretes y bobinas'],['corcho','Corchos'],['senuelo','Señuelos'],['anzuelo','Anzuelos']];
var USEP={cana:'Caña',carrete:'Carrete',corcho:'Corcho',senuelo:'Señuelo',anzuelo:'Anzuelo'};
function useList(e){if(!Array.isArray(e.used))e.used=[];return e.used}
function useBobTxt(c,b,k){return (b.nom||'Bobina '+(k+1))+(b.linea?' · '+eqMm(b.linea)+' mm':'')}
function useTile(it,e,i){
  var on=useList(e).some(function(u){return u.id===it.id});
  return '<button type="button" class="utile'+(on?' on':'')+'" data-a="use-tog" data-i="'+i+'" data-id="'+esc(it.id)+'" aria-pressed="'+on+'">'+ivThumb(it)+'<span>'+esc(invName(it)||'Sin nombre')+'</span></button>';
}
function useBlock(e,i){
  var h='';
  USEK.forEach(function(k){
    var lst=invOf(k[0]).slice().sort(ORD23[k[0]]||function(){return 0});
    if(!lst.length)return;
    var sel=useList(e).filter(function(u){return u.kind===k[0]});
    var key='e'+i+'u'+k[0], bob='';
    if(k[0]==='carrete')sel.forEach(function(u){
      var c=INV.filter(function(x){return x.id===u.id})[0];if(!c||!c.bobinas||!c.bobinas.length)return;
      bob+='<div class="ubob"><small>Bobina de '+esc(c.name||'carrete')+'</small>'+c.bobinas.map(function(b,q){var on=u.bob===(b.nom||'Bobina '+(q+1));return '<button type="button" class="chip'+(on?' on':'')+'" data-a="use-bob" data-i="'+i+'" data-id="'+esc(c.id)+'" data-k="'+q+'" aria-pressed="'+on+'">'+esc(useBobTxt(c,b,q))+'</button>'}).join('')+'</div>';
    });
    h+='<details class="gdet gsec" data-gk="'+key+'"'+(GOPEN[key]?' open':'')+'><summary><span>'+k[1]+'</span><small>'+esc(sel.map(function(u){return (u.name||'')+(u.bob?' ('+u.bob+')':'')}).join(', ')||'Toca para elegir')+'</small></summary><div class="gbody">'+bob+'<div class="ugrid">'+lst.map(function(it){return useTile(it,e,i)}).join('')+'</div></div></details>';
  });
  return h?'<div class="usedbox"><span class="invl">Mi equipo usado (puedes marcar varios)</span>'+h+'</div>':'';
}
var _eqCard32=eqCard;
eqCard=function(e,i,n){
  var h=_eqCard32(e,i,n);
  if(e.kind||h.indexOf('eqx')>-1)return h;
  var u='';INVMODE=e.mode||(tripDraft&&tripDraft.mode)||null;try{u=useBlock(e,i)}finally{INVMODE=null}
  if(!u)return h;
  var j=h.indexOf('</div>');return j<0?h+u:h.slice(0,j+6)+u+h.slice(j+6);
};
function useSync(e,kind){
  var u=useList(e).filter(function(x){return x.kind===kind})[0],it=u&&INV.filter(function(x){return x.id===u.id})[0];
  if(kind==='cana')e.cana=it?it.name:'';
  else if(kind==='carrete'){e.carrete=it?it.name:'';if(u&&u.bob){useBobApply(e,it,u.bob)}else{if(e.bobina)e.sedal='';e.bobina=''}}
  else if(kind==='corcho'){if(it)invApply(it,e);else{e.corchoForma='';e.corchoFab='';e.corchoGr=''}}
  else if(kind==='anzuelo'){if(it)invApply(it,e);else{e.anzuelo='';e.anzueloNum='';e.anzForma='';e.anzGrosor=''}}
}
function useBobApply(e,c,nom){
  var bb=(c&&c.bobinas||[]).filter(function(b,q){return (b.nom||'Bobina '+(q+1))===nom})[0];if(!bb){return}
  e.bobina=nom;e.sedal=nom+(bb.linea?' · '+eqMm(bb.linea)+' mm':'')+(bb.base?' (sobre '+eqMm(bb.base)+' mm)':'');
}
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a="use-tog"],[data-a="use-bob"]'):null;if(!b)return;
  var a=b.getAttribute('data-a'),i=+b.getAttribute('data-i'),e=tripDraft&&tripDraft.equipos&&tripDraft.equipos[i];if(!e)return;
  var it=INV.filter(function(x){return x.id===b.getAttribute('data-id')})[0];if(!it)return;
  var L=useList(e);
  if(a==='use-tog'){
    var ix=L.findIndex(function(u){return u.id===it.id});
    if(ix>-1)L.splice(ix,1);else L.push({id:it.id,kind:it.kind,name:invName(it)});
    if(USELEG[it.kind])useSync(e,it.kind);
    GOPEN.top=true;GOPEN['e'+i+'u'+it.kind]=true;
  }else{
    var u=L.filter(function(x){return x.id===it.id})[0];if(!u)return;
    var bb=it.bobinas[+b.getAttribute('data-k')];if(!bb)return;var nom=bb.nom||'Bobina '+(+b.getAttribute('data-k')+1);
    u.bob=u.bob===nom?'':nom;if(!u.bob)delete u.bob;
    useSync(e,'carrete');GOPEN.top=true;GOPEN['e'+i+'ucarrete']=true;
  }
  gearRepaint();
},true);
var USELEG={cana:1,carrete:1,corcho:1,anzuelo:1};
var _eqEmpty32=eqEmpty;
eqEmpty=function(e){return _eqEmpty32(e)&&!(e.used&&e.used.length)};
var _eqClean32=eqClean;
eqClean=function(list){
  var out=_eqClean32(list);
  var rec=function(o){var src=(list||[]).filter(function(e){return e.id===o.id})[0];if(src&&src.used&&src.used.length)o.used=src.used.map(function(u){var r={id:u.id,kind:u.kind,name:u.name};if(u.bob)r.bob=u.bob;return r})};
  out.forEach(rec);
  return out;
};
var _equiposInit32=equiposInit;
equiposInit=function(t){var r=_equiposInit32(t);if(!t)GOPEN.top=true;return r};
var _eqPillsArr32=eqPillsArr;
eqPillsArr=function(e){
  var p=_eqPillsArr32(e),seen={};
  (e.used||[]).forEach(function(u){
    var first=USELEG[u.kind]&&!seen[u.kind];seen[u.kind]=true;
    if(first&&u.kind!=='carrete')return;
    if(u.kind==='carrete'){if(!first)p.push('Carrete '+u.name+(u.bob?' · '+u.bob:''));else if(u.bob&&!p.some(function(x){return x.indexOf(u.bob)>-1}))p.push('Bobina '+u.bob);return}
    p.push((USEP[u.kind]||'')+' '+u.name);
  });
  return p;
};

/* ---------- B. estadísticas por equipo ---------- */
var STF={mode:'',month:'',species:'',waveV:'',windV:'',tideV:''};
var STK='cana';
var STKINDS=[['cana','Cañas'],['carrete','Carretes'],['corcho','Corchos'],['senuelo','Señuelos'],['anzuelo','Anzuelos']];
var STMES=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
function stData(f){
  var R={},nTrips=0;
  trips.forEach(function(t){
    if(f.mode&&t.mode!==f.mode)return;
    if(f.month!==''&&String((t.date||'').slice(5,7))!==('0'+(+f.month+1)).slice(-2))return;
    var eqs=eqList(t);if(!eqs.length)return;
    var cs=catches.filter(function(c){return c.tripId===t.id});
    var items=[];cs.forEach(function(c){(c.items||[]).forEach(function(i){items.push(i)})});
    var stops=t.stops||[];
    var stopOk=function(s){return !(f.waveV&&(!s||s.waveV!==f.waveV))&&!(f.windV&&(!s||s.windV!==f.windV))&&!(f.tideV&&(!s||s.tideV!==f.tideV))};
    var anyStopF=f.waveV||f.windV||f.tideV;
    if(anyStopF&&!stops.some(stopOk))return;
    nTrips++;
    var sel=items.filter(function(i){if(anyStopF){var s=stops.filter(function(x){return x.id===i.stopId})[0];if(!stopOk(s))return false}return !f.species||i.species===f.species});
    eqs.forEach(function(e,q){
      var mine=sel.filter(function(i){return eqs.length>1?(i.eq?i.eq===e.id:q===0):true});
      (e.used||[]).forEach(function(u){
        var r=R[u.id]||(R[u.id]={id:u.id,kind:u.kind,name:u.name,trips:{},fish:0,lib:0,esc:0,sp:{}});
        r.trips[t.id]=1;
        mine.forEach(function(i){var n=+i.n||0;if(i.st==='esc')r.esc+=n;else{r.fish+=n;if(i.st==='lib')r.lib+=n;r.sp[i.species]=(r.sp[i.species]||0)+n}});
      });
    });
  });
  return {R:R,n:nTrips};
}
function stRow(r){
  var it=INV.filter(function(x){return x.id===r.id})[0],nt=Object.keys(r.trips).length;
  var top=Object.keys(r.sp).sort(function(a,b){return r.sp[b]-r.sp[a]}).slice(0,3).map(function(s){return s+' '+r.sp[s]});
  return {it:it,r:r,nt:nt,rate:nt?r.fish/nt:0,top:top};
}
function stFmt(x){return (Math.round(x*10)/10).toString().replace('.',',')}
function stSumHTML(r,max){
  var nt=Object.keys(r.trips).length;
  return '<div class="stn"><em>'+nt+(nt===1?' salida':' salidas')+'</em><em>'+r.fish+' capturas</em>'+(nt?'<em>'+stFmt(r.fish/nt)+' por salida</em>':'')+(r.esc?'<em>'+r.esc+' escapadas</em>':'')+'</div>';
}
function stHTML(){
  var D=stData(STF),H=[];
  var modes=[],specs={};trips.forEach(function(t){if(t.mode&&modes.indexOf(t.mode)<0)modes.push(t.mode)});
  catches.forEach(function(c){(c.items||[]).forEach(function(i){if(i.species)specs[i.species]=1})});
  var sel=function(f,lab,opts){return '<select data-a="st-sel" data-f="'+f+'" aria-label="'+lab+'"><option value="">'+lab+': todas</option>'+opts.map(function(o){return '<option value="'+esc(o[0])+'"'+(String(STF[f])===String(o[0])?' selected':'')+'>'+esc(o[1])+'</option>'}).join('')+'</select>'};
  var rows=Object.keys(D.R).map(function(k){return stRow(D.R[k])}).filter(function(x){return x.r.kind===STK&&x.it}).sort(function(a,b){return b.rate-a.rate||b.r.fish-a.r.fish});
  var mx=rows.reduce(function(m,x){return Math.max(m,x.rate)},0)||1;
  var h='<div class="eqtop"><button type="button" class="eqback" data-a="eqp-home">‹ Equipo</button><h2>Rendimiento</h2></div>'+
    '<p class="hint" style="margin:0 0 8px">Capturas por salida con cada equipo. Filtra por condiciones para ver qué funciona mejor en cada situación.</p>'+
    '<div class="stk">'+STKINDS.map(function(k){return '<button type="button" class="chip'+(STK===k[0]?' on':'')+'" data-a="st-kind" data-k="'+k[0]+'">'+k[1]+'</button>'}).join('')+'</div>'+
    '<div class="stf">'+sel('mode','Modalidad',modes.map(function(m){return [m,m]}))+sel('month','Mes',STMES.map(function(m,q){return [q,m]}))+sel('species','Especie',Object.keys(specs).sort().map(function(s){return [s,s]}))+sel('waveV','Oleaje',[['poco','Poco'],['ok','Perfecto'],['mucho','Demasiado']])+sel('windV','Viento',[['poco','Poco'],['ok','Perfecto'],['mucho','Demasiado']])+sel('tideV','Marea',[['poco','Muy baja'],['ok','Perfecta'],['mucho','Demasiado alta']])+'</div>'+
    '<p class="hint" style="margin:0 0 8px">'+D.n+(D.n===1?' salida cumple':' salidas cumplen')+' los filtros.'+(Object.keys(STF).some(function(k){return STF[k]!==''})?' <button type="button" class="chip" data-a="st-reset">Quitar filtros</button>':'')+'</p>';
  if(!rows.length)return h+'<p class="hint">Aún no hay salidas con este tipo de equipo marcado. Al crear o editar una salida, marca el equipo en «Mi equipo usado».</p>';
  return h+rows.map(function(x){
    return '<button type="button" class="eqrow" data-a="eqp-open" data-id="'+esc(x.it.id)+'">'+ivThumb(x.it)+'<span class="ivt"><b>'+esc(invName(x.it))+'</b><small>'+x.r.fish+' capturas · '+x.nt+(x.nt===1?' salida':' salidas')+' · '+stFmt(x.rate)+' por salida'+(x.nt<3?' (pocos datos)':'')+'</small>'+(x.top.length?'<small>'+esc(x.top.join(' · '))+'</small>':'')+'<span class="stbar"><i style="width:'+Math.round(x.rate/mx*100)+'%"></i></span></span></button>';
  }).join('');
}
var _eqPane32=eqPaneHTML;
eqPaneHTML=function(){
  var v=EQV;
  if(v.view==='stats')return stHTML();
  if(v.view==='buy')return buyHTML();
  var h=_eqPane32();
  if(v.view==='home'){
    var nb=INV.filter(function(x){return x.comprar}).length;
    h+='<div class="eqx2"><button type="button" class="eqcat" data-a="eqp-stats"><span class="eci"><svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/></svg></span><b>Rendimiento</b><small>Qué equipo captura más</small></button><button type="button" class="eqcat" data-a="eqp-buy"><span class="eci"><svg viewBox="0 0 24 24"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M3 4h2l2.5 11h11L21 7H6"/></svg></span><b>Por comprar</b><small>'+(nb?nb+(nb===1?' pendiente':' pendientes'):'Nada pendiente')+'</small></button></div>';
  }
  if(v.view==='detail'){
    var it=INV.filter(function(x){return x.id===v.id})[0];
    if(it){
      var st=stData({mode:'',month:'',species:'',waveV:'',windV:'',tideV:''}).R[it.id];
      var sb=st?'<div class="sbk"><span class="invl">Con este equipo</span>'+stSumHTML(st)+(Object.keys(st.sp).length?'<div class="stn">'+Object.keys(st.sp).sort(function(a,b){return st.sp[b]-st.sp[a]}).slice(0,5).map(function(s){return '<em>'+esc(s)+' '+st.sp[s]+'</em>'}).join('')+'</div>':'')+'</div>':'<p class="hint">Aún no lo has marcado en ninguna salida.</p>';
      var buy='<div class="sbk"><button type="button" class="btn'+(it.comprar?' primary':'')+'" data-a="eqp-buytog" data-id="'+esc(it.id)+'">'+(it.comprar?'En la lista de compras · quitar':'Marcar por comprar')+'</button>'+(it.comprar?'<input id="buynote" maxlength="80" placeholder="Nota (cuántos, qué medida…)" value="'+esc(it.comprarNota||'')+'" data-id="'+esc(it.id)+'">':'')+'</div>';
      var k=h.indexOf('<div class="eqbtns">');
      h=k<0?h+sb+buy:h.slice(0,k)+sb+buy+h.slice(k);
    }
  }
  return h;
};
var _eqRow32=eqRow;
eqRow=function(it){var h=_eqRow32(it);return it.comprar?h.replace(/<\/button>$/,'<span class="cbuy">Por comprar</span></button>'):h};
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a="eqp-stats"],[data-a="st-kind"],[data-a="st-reset"],[data-a="eqp-buy"],[data-a="eqp-buytog"],[data-a="buy-done"],[data-a="buy-copy"]'):null;if(!b)return;
  var a=b.getAttribute('data-a'),v=EQV;
  if(a==='eqp-stats'){v.view='stats';eqRender()}
  else if(a==='st-kind'){STK=b.getAttribute('data-k');eqRefreshOnly()}
  else if(a==='st-reset'){STF={mode:'',month:'',species:'',waveV:'',windV:'',tideV:''};eqRefreshOnly()}
  else if(a==='eqp-buy'){v.view='buy';eqRender()}
  else if(a==='eqp-buytog'||a==='buy-done'){buyToggle(b.getAttribute('data-id'));}
  else if(a==='buy-copy'){buyCopy()}
},true);
document.addEventListener('change',function(ev){
  var s=ev.target;
  if(s&&s.getAttribute&&s.getAttribute('data-a')==='st-sel'){STF[s.getAttribute('data-f')]=s.value;setTimeout(eqRefreshOnly,0)}
  if(s&&s.id==='buynote'){var id=s.getAttribute('data-id'),it=INV.filter(function(x){return x.id===id})[0];if(it){var nv=s.value.trim();it.comprarNota=nv;setTimeout(function(){db.doc('gearInv/'+id).update({comprarNota:nv||{__delete__:true}}).catch(function(){})},0)}}
},true);

/* ---------- D. por comprar ---------- */
function buyToggle(id){
  var it=INV.filter(function(x){return x.id===id})[0];if(!it)return;
  var on=!it.comprar;
  if(on){it.comprar=true;db.doc('gearInv/'+id).update({comprar:true}).catch(function(){toast('No se pudo guardar')})}
  else{delete it.comprar;delete it.comprarNota;db.doc('gearInv/'+id).update({comprar:{__delete__:true},comprarNota:{__delete__:true}}).catch(function(){toast('No se pudo guardar')})}
  toast(on?'Añadido a por comprar':'Quitado de por comprar');
  eqRefreshOnly();
}
function buyList(){return INV.filter(function(x){return x.comprar}).sort(function(a,b){return (a.kind||'').localeCompare(b.kind||'')||invName(a).localeCompare(invName(b),'es')})}
function buyHTML(){
  var l=buyList();
  var h='<div class="eqtop"><button type="button" class="eqback" data-a="eqp-home">‹ Equipo</button><h2>Por comprar</h2></div>';
  if(!l.length)return h+'<p class="hint">Nada pendiente. Entra en la ficha de cualquier cosa de tu equipo y toca «Marcar por comprar» cuando te quede poco.</p>';
  h+='<button type="button" class="btn" data-a="buy-copy" style="width:100%;margin:0 0 10px">Copiar la lista</button>';
  return h+l.map(function(it){
    return '<div class="eqrow" style="cursor:default">'+ivThumb(it)+'<button type="button" class="ivt" data-a="eqp-open" data-id="'+esc(it.id)+'" style="text-align:left;background:none;border:0;color:inherit;padding:0"><b>'+esc(invName(it))+'</b><small>'+esc(((EQKINDS[it.kind]||{}).one||'')+(it.comprarNota?' · '+it.comprarNota:''))+'</small></button><button type="button" class="btn small" data-a="buy-done" data-id="'+esc(it.id)+'">Comprado</button></div>';
  }).join('');
}
function buyCopy(){
  var t='POR COMPRAR\n'+buyList().map(function(it){return '- '+invName(it)+' ('+((EQKINDS[it.kind]||{}).one||it.kind)+')'+(it.comprarNota?': '+it.comprarNota:'')}).join('\n');
  var ok=function(){toast('Lista copiada')};
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(ok,function(){buyCopyOld(t,ok)})}else buyCopyOld(t,ok);
}
function buyCopyOld(t,ok){var x=document.createElement('textarea');x.value=t;x.style.cssText='position:fixed;opacity:0';document.body.appendChild(x);x.select();try{document.execCommand('copy');ok()}catch(e){toast('No se pudo copiar')}x.remove()}

/* ---------- C. exportar copia de seguridad ---------- */
function expStamp(){var d=new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
function expSave(name,mime,data){
  var blob=data instanceof Blob?data:new Blob([data],{type:mime});
  var u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();
  setTimeout(function(){a.remove();URL.revokeObjectURL(u)},4000);
}
function expDocs(){var o=[];window.__CQ.M.forEach(function(r){if(r&&!r.del&&r.d&&r.c!=='speciesPhotos')o.push({c:r.c,i:r.i,u:r.u,d:r.d})});return o}
function expBlob2b64(b){return new Promise(function(res){var f=new FileReader();f.onload=function(){res(String(f.result))};f.onerror=function(){res(null)};f.readAsDataURL(b)})}
async function expJSON(withPhotos){
  var out={app:'cuaderno-pesca',version:1,exportedAt:new Date().toISOString(),docs:expDocs()};
  if(withPhotos){
    out.fotos=[];var ps=[];window.__CQ.B.forEach(function(r){if(r&&r.blob)ps.push(r)});
    for(var i=0;i<ps.length;i++){var d=await expBlob2b64(ps[i].blob);if(d)out.fotos.push({id:ps[i].id,type:ps[i].type,data:d})}
  }
  expSave('cuaderno-pesca-'+expStamp()+(withPhotos?'-con-fotos':'')+'.json','application/json',JSON.stringify(out));
  toast('Copia descargada ('+out.docs.length+' registros'+(withPhotos?', '+out.fotos.length+' fotos':'')+')');
}
function csvCell(x){x=x==null?'':String(x);return /[";\n]/.test(x)?'"'+x.replace(/"/g,'""')+'"':x}
function expCSV(){
  var rows=[['Fecha','Sitio','Modalidad','Spot','Especie','Cantidad','Estado','Talla','Cebos','Cañas','Carretes','Corchos','Señuelos','Anzuelos','Oleaje','Viento','Marea']];
  var VLx={poco:'Poco',ok:'Perfecto',mucho:'Demasiado'},TLx={poco:'Muy baja',ok:'Perfecta',mucho:'Demasiado alta'};
  catches.forEach(function(c){
    var t=trips.filter(function(x){return x.id===c.tripId})[0]||{},eqs=t.id?eqList(t):[];
    (c.items||[]).forEach(function(i){
      var q=0;if(eqs.length>1&&i.eq){var z=eqs.findIndex(function(e){return e.id===i.eq});if(z>-1)q=z}
      var e=eqs[q]||{},us=function(k){return (e.used||[]).filter(function(u){return u.kind===k}).map(function(u){return u.name+(u.bob?' ('+u.bob+')':'')}).join(' + ')};
      var s=(t.stops||[]).filter(function(x){return x.id===i.stopId})[0]||{};
      rows.push([c.date,c.siteName||t.siteName||'',t.mode||'',s.spotName||'',i.species,i.n,i.st==='lib'?'liberada':i.st==='esc'?'escapada':i.st==='extra'?'extra':'casa',i.size||'',(t.cebos||[]).map(function(x){return x.n}).join(' + '),us('cana')||e.cana||'',us('carrete')||e.carrete||'',us('corcho')||[e.corchoForma,e.corchoFab,e.corchoGr?e.corchoGr+' g':''].filter(Boolean).join(' '),us('senuelo'),us('anzuelo')||[e.anzuelo,e.anzueloNum].filter(Boolean).join(' '),VLx[s.waveV]||'',VLx[s.windV]||'',TLx[s.tideV]||'']);
    });
  });
  expSave('capturas-'+expStamp()+'.csv','text/csv;charset=utf-8','﻿'+rows.map(function(r){return r.map(csvCell).join(';')}).join('\r\n'));
  toast('Capturas exportadas ('+(rows.length-1)+')');
}
var _openSettings32=openSettings;
openSettings=function(){
  _openSettings32.apply(this,arguments);
  var b=document.getElementById('sheetbody');if(!b||b.querySelector('#expblk'))return;
  var d=document.createElement('div');d.id='expblk';d.className='block';
  d.innerHTML='<h3>Copia de seguridad</h3><p class="hint">Descarga tus datos en el móvil o el ordenador. La copia con fotos pesa más.</p>'+
    '<button type="button" class="btn" data-a="exp-json" style="width:100%;margin:0 0 8px">Descargar copia (.json)</button>'+
    '<button type="button" class="btn" data-a="exp-json-ph" style="width:100%;margin:0 0 8px">Descargar copia con fotos (.json)</button>'+
    '<button type="button" class="btn" data-a="exp-csv" style="width:100%">Capturas para Excel (.csv)</button>';
  b.insertBefore(d,b.firstChild);
};
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a="exp-json"],[data-a="exp-json-ph"],[data-a="exp-csv"]'):null;if(!b)return;
  var a=b.getAttribute('data-a');
  try{if(a==='exp-csv')expCSV();else expJSON(a==='exp-json-ph')}catch(e){toast('No se pudo exportar')}
},true);
