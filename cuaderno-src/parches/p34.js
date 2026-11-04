/* ===== p34: salida en vivo (cambio de spot, de equipo, cronómetro por persona, notas de voz) ===== */
var LV=null,LS=null,LE=null,LNOTE=null,LA=null,LVV='',LVOPEN={},LVBACK=false,LVCONF=false,REC=null,AUM={};
(function(){var s=document.createElement('style');s.textContent=
'.lvgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:0 0 12px}'+
'.lvb{display:flex;flex-direction:column;align-items:flex-start;gap:4px;padding:14px;border-radius:16px;border:1.5px solid var(--line);background:var(--surface);color:inherit;text-align:left;min-height:84px}'+
'.lvb .ic{font-size:24px;line-height:1}.lvb b{font:700 15px var(--display)}.lvb small{color:var(--muted);font-size:12px}'+
'.lvb.main{grid-column:1/3;flex-direction:row;align-items:center;gap:14px;min-height:0;padding:16px;background:linear-gradient(180deg,rgba(58,208,200,.18),rgba(58,208,200,.06));border-color:rgba(58,208,200,.6)}.lvb.main .ic{font-size:30px}.lvb.main b{font-size:18px}'+
'.lvp{display:flex;align-items:center;gap:10px;padding:9px 0;border-top:1px solid var(--line)}.lvp:first-of-type{border-top:0}.lvp .pn{flex:1;min-width:0}.lvp .pn b{display:block}.lvp .pn small{color:var(--muted);font-size:12px}.lvp small.on{color:#7ee787}.lvp small.off{color:#ffbe3c}'+
'.lvtl .qcrow{align-items:flex-start}.lvtl .evi{flex:none;width:26px;text-align:center;font-size:16px}.lvtl audio,.recbox audio{width:100%;height:36px;margin-top:6px}'+
'.recbox{display:flex;flex-wrap:wrap;align-items:center;gap:10px;padding:10px;border:1.5px dashed var(--line);border-radius:14px;margin-top:8px}.recbox.on{border-color:#ff5c5c;border-style:solid;background:rgba(255,92,92,.08)}.recbox .rdot{width:12px;height:12px;border-radius:50%;background:#ff5c5c;animation:sdot 1.2s infinite}.recbox b{font:700 18px var(--display);flex:1}.recbox .hint{flex-basis:100%;margin:0}'+
'.lvwho .chip{padding:6px 12px}.lvsel{width:100%}.dlbtn{display:inline-block;margin-top:6px}'
;document.head.appendChild(s)})();

function lvHM(ts){return new Date(ts).toTimeString().slice(0,5)}
function lvDur(a,b){var mi=Math.max(0,Math.round((b-a)/60000));return mi<60?mi+' min':Math.floor(mi/60)+' h '+('0'+(mi%60)).slice(-2)}
function lvSave(o){if(db)db.doc('sesiones/activa').update(o).catch(function(){toast('No se pudo guardar el cambio')})}
function lvEv(e){e.t=e.t||Date.now();SESS.events=(SESS.events||[]).concat([e]);lvSave({events:SESS.events})}
function lvPeople(){return [{id:'',name:'Tú'}].concat((SESS&&SESS.companions)||[])}
function lvPName(id){if(!id)return 'Tú';if(id==='all')return 'Todos';return compName(id)||'Compañero'}
function lvCurRig(){if(!SESS||!SESS.curEq)return null;return (SESS.equipos||[]).filter(function(e){return e.id===SESS.curEq})[0]||null}
function lvRigTxt(r){if(!r)return '';var n=(r.used||[]).map(function(u){return u.name+(u.bob?' ('+u.bob+')':'')});if(n.length)return n.join(' · ');try{return eqPillsArr(r).join(' · ')}catch(e){return ''}}
function audSrc(id){if(!id)return '';if(AUM[id])return AUM[id];var r=window.__CQ&&window.__CQ.B.get(id);if(!r||!r.blob)return '';return AUM[id]=URL.createObjectURL(r.blob)}
function audExt(id){var r=window.__CQ&&window.__CQ.B.get(id),t=(r&&(r.type||(r.blob&&r.blob.type)))||'';return t.indexOf('mp4')>-1?'m4a':t.indexOf('ogg')>-1?'ogg':'webm'}
function audHTML(id){var u=audSrc(id);return u?'<audio controls preload="none" src="'+u+'"></audio>':'<small class="hint">Audio guardado; se oirá cuando termine de sincronizar.</small>'}

/* ---------- grabadora ---------- */
function recHTML(){
  if(REC&&REC.on)return '<div class="recbox on"><span class="rdot"></span><b id="rectime">0:00</b><button type="button" class="btn primary" data-a="lv-rec">Parar</button></div>';
  if(LA&&LA.url)return '<div class="recbox"><audio controls src="'+LA.url+'"></audio><button type="button" class="btn small" data-a="lv-rec-del">Quitar</button></div>';
  return '<div class="recbox"><button type="button" class="btn" data-a="lv-rec">🎙 Grabar nota de voz</button><small class="hint">En vez de escribir. Luego en casa la pasamos a texto.</small></div>';
}
function recToggle(){
  if(REC&&REC.on){try{REC.mr.stop()}catch(e){}return}
  if(!navigator.mediaDevices||!window.MediaRecorder){toast('Este navegador no puede grabar audio');return}
  navigator.mediaDevices.getUserMedia({audio:true}).then(function(st){
    var mr=new MediaRecorder(st),ch=[];REC={mr:mr,on:true,t0:Date.now()};
    mr.ondataavailable=function(e){if(e.data&&e.data.size)ch.push(e.data)};
    mr.onstop=function(){
      try{st.getTracks().forEach(function(t){t.stop()})}catch(e){}
      var type=mr.mimeType||'audio/webm',bl=new Blob(ch,{type:type});
      clearInterval(REC.iv);REC.on=false;
      LA=bl.size?{blob:bl,url:URL.createObjectURL(bl),type:type}:null;lvPaint();
    };
    mr.start();
    REC.iv=setInterval(function(){var el=document.getElementById('rectime');if(el){var s=Math.round((Date.now()-REC.t0)/1000);el.textContent=Math.floor(s/60)+':'+('0'+s%60).slice(-2)}},400);
    lvPaint();
  }).catch(function(){toast('Sin permiso de micrófono')});
}
function recStopHard(){if(REC&&REC.on){try{REC.mr.onstop=null;REC.mr.stop()}catch(e){}clearInterval(REC.iv);REC.on=false}LA=null}
function lvUpAudio(){
  if(!LA||!LA.blob)return Promise.resolve(null);
  return window.claude.use('assets').then(function(a){return a.upload(LA.blob,{type:LA.type})}).then(function(r){return r&&r.id||null}).catch(function(){return null});
}

/* ---------- elegir cómo empezar ---------- */
function lvChooser(){
  openSheet('Nueva salida','<div class="lvch"><button type="button" class="lvc live" data-a="lv-live"><span class="big">🎣</span><span class="tt"><b>Estoy pescando</b><small>Lo montas en 20 segundos y marcas capturas, cambios y notas de voz sobre la marcha.</small></span><span class="cta">Empezar ahora</span></button>'+
    '<button type="button" class="lvc past" data-a="lv-past"><span class="big">📝</span><span class="tt"><b>Ya he pescado</b><small>Rellénala con calma: ayer, esta mañana, desde casa…</small></span><span class="cta">Rellenar salida</span></button></div>','','lvchoose');
}
window.addEventListener('click',function(ev){
  var xb=ev.target.closest?ev.target.closest('[data-a="close-sheet"]'):null;
  if(xb&&SESS&&(LVV==='spot'||LVV==='eq'||LVV==='note')){ev.stopPropagation();ev.preventDefault();recStopHard();LS=LE=LNOTE=null;sessOpen();return}
  var b=ev.target.closest?ev.target.closest('[data-a="new-trip"],[data-a="sess-finish"]'):null;if(!b)return;
  var a=b.getAttribute('data-a');
  if(a==='new-trip'){ev.stopPropagation();ev.preventDefault();if(SESS)sessOpen();else lvChooser();return}
  if(a==='sess-finish'&&!LVCONF){
    ev.stopPropagation();ev.preventDefault();LVCONF=true;b.textContent='¿Seguro? Toca otra vez para terminar';
    setTimeout(function(){LVCONF=false;if(b.isConnected)b.textContent='Terminar salida'},4000);return;
  }
  if(a==='sess-finish')LVCONF=false;
},true);

/* ---------- montar la salida (pantalla de inicio) ---------- */
function lvLastTrip(){return trips.slice().sort(function(a,b){return String(b.date).localeCompare(String(a.date))})[0]||null}
function lvSites(){
  var seen={},order=[];trips.slice().sort(function(a,b){return String(b.date).localeCompare(String(a.date))}).forEach(function(t){if(t.siteId&&!seen[t.siteId]){seen[t.siteId]=1;order.push(t.siteId)}});
  return sites.slice().sort(function(a,b){var x=order.indexOf(a.id),y=order.indexOf(b.id);if(x<0)x=999;if(y<0)y=999;return x-y||String(a.name).localeCompare(String(b.name),'es')});
}
function lvOpenSetup(){
  recStopHard();COMPT='live';COMPUI=false;LVV='setup';
  var lt=lvLastTrip(),rig={used:[]};
  if(lt){var le=eqList(lt),e=le[le.length-1];if(e){rig=JSON.parse(JSON.stringify(e));delete rig.id;delete rig.why;delete rig.nota;if(!Array.isArray(rig.used))rig.used=[]}}
  LV={siteId:lt&&lt.siteId||'',spotId:'',mode:lt&&lt.mode||'',companions:[],rig:rig,hadPrev:!!(lt&&!eqEmpty(rig))};
  openSheet('Empezar a pescar','<div id="lvbody">'+lvSetupBody()+'</div>','<button class="btn" data-a="close-sheet">Cancelar</button><button class="btn primary" data-a="lv-start">Empezar</button>','sess');
}
function lvSpotChips(siteId,cur,act,extra){
  var L=spots.filter(function(s){return s.siteId===siteId}).sort(function(a,b){return String(a.name).localeCompare(String(b.name),'es')});
  return L.map(function(s){return '<button type="button" class="chip'+(cur===s.id?' on':'')+'" data-a="'+act+'" data-id="'+esc(s.id)+'" aria-pressed="'+(cur===s.id)+'">'+esc(s.name)+'</button>'}).join('')+extra;
}
function lvUseBlock(rig,mode){
  var h='';INVMODE=mode||null;
  try{USEK.forEach(function(k){
    var lst=invOf(k[0]).slice().sort(ORD23[k[0]]||function(){return 0});if(!lst.length)return;
    var sel=useList(rig).filter(function(u){return u.kind===k[0]}),key='lv'+k[0],bob='';
    if(k[0]==='carrete')sel.forEach(function(u){
      var c=INV.filter(function(x){return x.id===u.id})[0];if(!c||!c.bobinas||!c.bobinas.length)return;
      bob+='<div class="ubob"><small>Bobina de '+esc(c.name||'carrete')+'</small>'+c.bobinas.map(function(b,q){var on=u.bob===(b.nom||'Bobina '+(q+1));return '<button type="button" class="chip'+(on?' on':'')+'" data-a="lv-bob" data-id="'+esc(c.id)+'" data-k="'+q+'" aria-pressed="'+on+'">'+esc(useBobTxt(c,b,q))+'</button>'}).join('')+'</div>';
    });
    h+='<details class="gdet gsec" data-lk="'+key+'"'+(LVOPEN[key]?' open':'')+'><summary><span>'+k[1]+'</span><small>'+esc(sel.map(function(u){return (u.name||'')+(u.bob?' ('+u.bob+')':'')}).join(', ')||'Toca para elegir')+'</small></summary><div class="gbody">'+bob+'<div class="ugrid">'+lst.map(function(it){
      var on=useList(rig).some(function(u){return u.id===it.id});
      return '<button type="button" class="utile'+(on?' on':'')+'" data-a="lv-use" data-id="'+esc(it.id)+'" aria-pressed="'+on+'">'+ivThumb(it)+'<span>'+esc(invShort(it)||'Sin nombre')+'</span></button>'}).join('')+'</div></div></details>';
  })}finally{INVMODE=null}
  return h||'<p class="hint">Aún no tienes equipo en la pestaña Equipo.</p>';
}
function lvUseToggle(rig,a,b){
  var it=INV.filter(function(x){return x.id===b.getAttribute('data-id')})[0];if(!it)return;
  var L=useList(rig);
  if(a==='lv-use'){
    var ix=L.findIndex(function(u){return u.id===it.id});
    if(ix>-1)L.splice(ix,1);else L.push({id:it.id,kind:it.kind,name:invShort(it)});
    if(USELEG[it.kind])useSync(rig,it.kind);LVOPEN['lv'+it.kind]=true;
  }else{
    var u=L.filter(function(x){return x.id===it.id})[0];if(!u)return;
    var q=+b.getAttribute('data-k'),bb=it.bobinas[q];if(!bb)return;var nom=bb.nom||'Bobina '+(q+1);
    u.bob=u.bob===nom?'':nom;if(!u.bob)delete u.bob;useSync(rig,'carrete');LVOPEN.lvcarrete=true;
  }
}
function lvSiteBlock(){
  var st=LV.siteId?siteOf(LV.siteId):null,rec=lvSites().slice(0,4);
  return '<div class="block"><h3>¿Dónde estás?</h3><button type="button" class="lvsite" data-a="lv-map"><span class="pin">📍</span><span class="tx"><b>'+(st?esc(st.name):'Elegir en el mapa')+'</b><small>'+(st?'Toca para cambiarlo en el mapa':'Toca el mapa o crea un sitio nuevo con +')+'</small></span><span class="go">🗺</span></button>'+
    (rec.length?'<div class="chips lvrec">'+rec.map(function(s){return '<button type="button" class="chip'+(LV.siteId===s.id?' on':'')+'" data-a="lv-site" data-id="'+esc(s.id)+'" aria-pressed="'+(LV.siteId===s.id)+'">'+esc(s.name)+'</button>'}).join('')+'</div>':'')+
    (LV.siteId&&spots.some(function(s){return s.siteId===LV.siteId})?'<span class="invl" style="margin-top:12px;display:block">Spot (opcional)</span><div class="chips">'+lvSpotChips(LV.siteId,LV.spotId,'lv-spot-pick','')+'</div>':'')+'</div>';
}
function lvSetupBody(){
  var modes=modeNames();
  return lvSiteBlock()+
    '<div class="block"><h3>Modalidad</h3><div class="chips">'+modes.map(function(m){return '<button type="button" class="chip'+(LV.mode===m?' on':'')+'" data-a="lv-mode" data-v="'+esc(m)+'" aria-pressed="'+(LV.mode===m)+'">'+esc(m)+'</button>'}).join('')+'</div></div>'+
    compBlock()+
    '<div class="block"><h3>Mi equipo</h3>'+(LV.hadPrev?'<p class="hint">Es el de tu última salida. Cámbialo si hoy llevas otro.</p>':'')+lvUseBlock(LV.rig,LV.mode)+'</div>';
}
/* mapa para elegir o crear el sitio */
var LM=null;
function lvMapOpen(){
  if(!window.L){toast('El mapa no está disponible ahora');return}
  var el=$('#pick');el.hidden=false;el.className='sheet picker pk';
  el.innerHTML='<div class="sh"><h2>¿Dónde pescas?</h2><button class="x" data-a="mp-cancel" aria-label="Cerrar">'+ICO.x+'</button></div>'+
    '<div id="pkwrap"><div id="pkmap"></div><div class="mlayers"><button data-a="mp-layer" data-l="sat" aria-pressed="true">Satélite</button><button data-a="mp-layer" data-l="base" aria-pressed="false">Mapa</button></div>'+
    '<div class="mctl"><button data-a="mp-in" aria-label="Acercar">'+ICO.plus+'</button><button data-a="mp-out" aria-label="Alejar"><svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg></button></div>'+
    '<button type="button" class="lmplus" data-a="lm-new"><span>+</span> Sitio nuevo</button></div><div class="pkbar" id="pkbar"></div>';
  LM={sel:LV&&LV.siteId||'',mode:'pick',mk:{},nm:null};
  PK=null;
  PKM=L.map('pkmap',{minZoom:9,maxZoom:20,zoomSnap:0.5,zoomControl:false,attributionControl:false,maxBounds:[[42.6,-4.2],[43.8,-1.8]],maxBoundsViscosity:0.6});
  PKLAYS={sat:makePack({st:'sat',maxZoom:20}),base:makePack({st:'base',maxZoom:17})};PKLAYS.sat.addTo(PKM);
  var pts=[];
  sites.forEach(function(s){var p=sitePos(s);if(!p)return;pts.push([p.la,p.lo]);
    LM.mk[s.id]=L.marker([p.la,p.lo],{icon:pinIcon(s,'ok',s.id===LM.sel),zIndexOffset:s.id===LM.sel?500:0}).addTo(PKM).on('click',function(){if(LM.mode!=='pick')return;lvMapSel(s.id)});
  });
  var cur=LM.sel&&siteOf(LM.sel)?sitePos(siteOf(LM.sel)):null;
  if(cur)PKM.setView([cur.la,cur.lo],15,{animate:false});else if(pts.length>1)PKM.fitBounds(pts,{padding:[40,40],maxZoom:14,animate:false});else PKM.setView(pts[0]||[43.4219,-2.7225],14,{animate:false});
  PKM.on('click',function(e){if(LM&&LM.mode==='new'&&LM.nm){LM.nm.setLatLng(e.latlng);lvMapBar()}});
  lvMapBar();setTimeout(function(){PKM.invalidateSize()},60);
}
function lvMapSel(id){
  var old=LM.sel;LM.sel=id;
  [old,id].forEach(function(k){var s=k&&siteOf(k),m=k&&LM.mk[k];if(s&&m){m.setIcon(pinIcon(s,'ok',k===id));m.setZIndexOffset(k===id?500:0)}});
  lvMapBar();
}
function lvMapBar(){
  var el=$('#pkbar');if(!el||!LM)return;
  if(LM.mode==='new'){
    var p=LM.nm.getLatLng();
    el.innerHTML='<div class="hint">Toca el mapa o arrastra el pin hasta el sitio. <span class="mono">'+p.lat.toFixed(5)+', '+p.lng.toFixed(5)+'</span></div><input id="lm-name" maxlength="40" autocomplete="off" placeholder="Nombre del sitio nuevo" aria-label="Nombre del sitio" value="'+esc(LM.name||'')+'"><div class="actions"><button type="button" class="btn" data-a="lm-back">Atrás</button><button type="button" class="btn primary" style="flex:1" data-a="lm-create">Crear y elegir</button></div>';
    return;
  }
  var s=LM.sel?siteOf(LM.sel):null;
  el.innerHTML=s?'<div class="lmsel"><b>'+esc(s.name)+'</b><small>Sitio elegido</small></div><button type="button" class="btn primary" data-a="lm-ok">Elegir este sitio</button>':'<div class="hint">Toca un sitio del mapa, o crea uno nuevo con «+ Sitio nuevo».</div>';
}
function lvMapNew(){
  LM.mode='new';var c=PKM.getCenter();
  LM.nm=L.marker(c,{draggable:true,icon:pinIcon({id:'x',name:'Nuevo sitio'},'new',true),zIndexOffset:900}).addTo(PKM).on('dragend',lvMapBar);
  var b=document.querySelector('.lmplus');if(b)b.hidden=true;lvMapBar();
}
function lvMapBack(){if(LM.nm){PKM.removeLayer(LM.nm);LM.nm=null}LM.mode='pick';var b=document.querySelector('.lmplus');if(b)b.hidden=false;lvMapBar()}
function lvMapCreate(){
  var n=$('#lm-name'),nm=n&&n.value.trim();if(!nm){toast('Ponle nombre al sitio');return}
  var p=LM.nm.getLatLng(),ref=db.collection('sites').doc();
  ref.set({name:nm,lat:p.lat,lon:p.lng,desc:'',createdAt:Date.now(),status:'activo'}).catch(function(){toast('No se pudo crear el sitio')});
  LV.siteId=ref.id;LV.spotId='';LM=null;closePick();setTimeout(lvPaint,150);toast('Sitio «'+nm+'» creado');
}
function lvMapOk(){if(!LM||!LM.sel)return;LV.siteId=LM.sel;LV.spotId='';LM=null;closePick();lvPaint()}
function lvStart(){
  if(!LV||!db)return;
  if(!LV.mode){toast('Elige la modalidad');return}
  var st=LV.siteId?siteOf(LV.siteId):null,sp=LV.spotId?spots.filter(function(s){return s.id===LV.spotId})[0]:null;
  var rig=JSON.parse(JSON.stringify(LV.rig));var eqs=[];if(!eqEmpty(rig)){rig.id=eqId();eqs.push(rig)}
  var now=Date.now(),place=sp?{id:sp.id,name:sp.name,siteId:LV.siteId}:st?{name:st.name,siteId:st.id}:null;
  var s={startedAt:now,date:todayISO(),mode:LV.mode,siteId:LV.siteId||null,siteName:st?st.name:'',companions:LV.companions.map(function(c){var o={id:c.id,name:c.name};if(c.mode)o.mode=c.mode;return o}),
    equipos:eqs,curEq:eqs[0]?eqs[0].id:null,ends:{},where:place?{'':place}:{},events:[{t:now,type:'start',name:st?st.name:''}]};
  s=JSON.parse(JSON.stringify(s));
  db.doc('sesiones/activa').set(s).catch(function(){toast('No se pudo empezar')});
  SESS=Object.assign({id:'activa'},s);LV=null;COMPT='sess';COMPUI=false;
  sessPaint();sessOpen();toast('Salida en marcha. Cierra esto y pesca; toca la barra de arriba cuando quieras.');
}

/* ---------- consola de la salida en curso ---------- */
function lvEvRow(e){
  var ic='•',t='',sub='';
  if(e.type==='start'){ic='🟢';t='Empiezas a pescar';sub=e.name||''}
  else if(e.type==='spot'){ic='📍';t='Cambio de spot'+(e.who&&e.who!=='all'?' · '+lvPName(e.who):e.who==='all'&&((SESS&&SESS.companions)||(tripDraft&&tripDraft.companions)||[]).length?' · todos':'');sub=[e.name,e.why].filter(Boolean).join(' · ')}
  else if(e.type==='eq'){ic='🎣';t='Cambio de equipo'+(e.mode?' · '+e.mode:'');sub=[e.names,e.why].filter(Boolean).join(' · ')}
  else if(e.type==='note'){ic='🎙';t='Nota de voz'}
  else if(e.type==='end'){ic='🏁';t=lvPName(e.who)+(e.who?' termina':' terminas')}
  else if(e.type==='resume'){ic='▶';t=lvPName(e.who)+(e.who?' sigue':' sigues')}
  return '<div class="qcrow"><time>'+esc(lvHM(e.t))+'</time><span class="evi">'+ic+'</span><div class="qcm"><b>'+esc(t)+'</b>'+(sub?'<small>'+esc(sub)+'</small>':'')+(e.audio?audHTML(e.audio):'')+'</div></div>';
}
function lvConsoleHTML(){
  var s=SESS,L=s.companions||[],pl=(s.where||{})[''],rig=lvCurRig(),now=Date.now(),cs=sessCounts();
  var ri=(s.equipos||[]).indexOf(rig);
  var head='<div class="block lvhead"><small class="hint">'+esc(s.mode||'Salida')+' · desde las '+esc(lvHM(s.startedAt))+'</small><div class="tm">'+esc(lvDur(s.startedAt,now))+'</div>'+
    '<p class="hint">📍 '+esc((pl&&pl.name)||s.siteName||'Sin ubicación fija')+'</p>'+(rig?'<p class="hint">🎣 '+((s.equipos||[]).length>1?'Equipo '+esc(eqLetter(ri))+' · ':'')+esc(lvRigTxt(rig)||'equipo sin detallar')+'</p>':'')+
    '<p class="hint">'+cs.m+(cs.m===1?' tuya':' tuyas')+(L.length?' · '+cs.o+(cs.o===1?' de un compañero':' de compañeros'):'')+'</p></div>';
  var grid='<div class="lvgrid"><button type="button" class="lvb main" data-a="lv-cap"><span class="ic">⚡</span><span><b>Captura</b><br><small>Especie, talla y cebo en 3 toques</small></span></button>'+
    '<button type="button" class="lvb" data-a="lv-spot"><span class="ic">📍</span><b>Cambio de spot</b><small>Con motivo o nota de voz</small></button>'+
    '<button type="button" class="lvb" data-a="lv-eq"><span class="ic">🎣</span><b>Cambio de equipo</b><small>Con motivo o nota de voz</small></button>'+
    '</div>';
  var pp=lvPeople().map(function(p){
    var end=(s.ends||{})[p.id||'me'],w=(s.where||{})[p.id],mode=p.id?(p.mode||''):(s.mode||'');
    return '<div class="lvp"><span class="cav">'+esc(p.id?compInit(p):'T')+'</span><div class="pn"><b>'+esc(p.name)+'</b><small>'+esc([mode,w&&w.name&&p.id?'📍 '+w.name:''].filter(Boolean).join(' · '))+'</small><small class="'+(end?'off':'on')+'">'+(end?'terminó '+esc(lvHM(end))+' · '+esc(lvDur(s.startedAt,end)):'pescando · '+esc(lvDur(s.startedAt,now)))+'</small></div>'+
      '<button type="button" class="btn small'+(end?'':' primary')+'" data-a="lv-end" data-id="'+esc(p.id)+'">'+(end?'Sigue':'Terminó')+'</button></div>';
  }).join('');
  var tl=(s.events||[]).map(function(e){return {t:e.t,h:lvEvRow(e)}}).concat(sessMine().map(function(c){return {t:c.ts||0,h:qcRow(c).replace(/<button type="button" class="btn small" data-a="qc-spot-make"[\s\S]*?<\/button>/,'')}})).sort(function(a,b){return b.t-a.t});
  return head+grid+'<div class="block"><h3>Cronómetro</h3>'+pp+'</div>'+
    '<div class="block lvtl"><h3>Registro</h3>'+(tl.length?tl.map(function(x){return x.h}).join(''):'<p class="hint">Aún nada.</p>')+'</div>'+
    '<details class="gdet gsec"><summary><span>Compañeros</span><small>'+(L.length?L.map(function(c){return esc(c.name)}).join(', '):'añadir o quitar')+'</small></summary><div class="gbody">'+compBlock()+'</div></details>';
}
sessSheetBody=function(){COMPT='sess';return lvConsoleHTML()};
sessOpen=function(){
  if(!SESS)return;COMPUI=false;COMPT='sess';LVV='console';
  openSheet('Salida en curso','<div id="sessbody">'+lvConsoleHTML()+'</div>','<button class="btn" data-a="close-sheet">Seguir pescando</button><button class="btn primary" data-a="sess-finish">Terminar salida</button>','sess');
};

/* ---------- sub-hojas: spot, equipo, voz ---------- */
function lvSub(title,key,body,foot){LVV=key;recStopHard();openSheet(title,'<div id="lvbody">'+body+'</div>',foot,'sess')}
function lvWhoChips(cur){
  var L=SESS.companions||[];if(!L.length)return '';
  var opts=[['all','Todos'],['','Yo']].concat(L.map(function(c){return [c.id,c.name]}));
  return '<div class="field lvwho"><label>¿Quién?</label><div class="chips">'+opts.map(function(o){return '<button type="button" class="chip'+(cur===o[0]?' on':'')+'" data-a="lv-who" data-id="'+esc(o[0])+'" aria-pressed="'+(cur===o[0])+'">'+esc(o[1])+'</button>'}).join('')+'</div></div>';
}
var WHYS_SPOT=['Mucha ola','Sin picadas','Mucha gente','Viento','Marea'],WHYS_EQ=['No picaban','Probar otro cebo','Rotura','Cambio de modalidad'];
function lvWhy(list,cur){return '<div class="field"><label>Motivo (opcional)</label><div class="chips">'+list.map(function(w){return '<button type="button" class="chip'+(cur===w?' on':'')+'" data-a="lv-why" data-v="'+esc(w)+'" aria-pressed="'+(cur===w)+'">'+esc(w)+'</button>'}).join('')+'</div></div>'}
function lvSpotOpen(){
  var pl=(SESS.where||{})[''];
  LS={who:(SESS.companions||[]).length?'all':'',siteId:SESS.siteId||'',spotId:'',why:''};
  lvSub('Cambio de spot','spot',lvSpotBody(),'<button class="btn" data-a="lv-back">Atrás</button><button class="btn primary" data-a="lv-sp-save">Cambiar de spot</button>');
}
function lvSpotBody(){
  var opts='<option value="">(otro sitio)</option>'+lvSites().map(function(s){return '<option value="'+esc(s.id)+'"'+(LS.siteId===s.id?' selected':'')+'>'+esc(s.name)+'</option>'}).join('');
  return lvWhoChips(LS.who)+'<div class="field"><label>Sitio</label><select class="lvsel" data-a="lv-sp-site">'+opts+'</select></div>'+
    '<div class="field"><label>¿A dónde?</label><div class="chips">'+lvSpotChips(LS.siteId,LS.spotId,'lv-sp-sp','')+'<button type="button" class="chip'+(LS.spotId==='gps'?' on':'')+'" data-a="lv-sp-sp" data-id="gps" aria-pressed="'+(LS.spotId==='gps')+'">📍 Aquí (punto nuevo)</button></div></div>'+lvWhy(WHYS_SPOT,LS.why)+recHTML();
}
function lvGeo(){return new Promise(function(res){try{navigator.geolocation.getCurrentPosition(function(p){res({lat:p.coords.latitude,lon:p.coords.longitude})},function(){res(null)},{enableHighAccuracy:true,timeout:6000,maximumAge:20000})}catch(e){res(null)}})}
async function lvSpotSave(){
  var L=LS;if(!L)return;
  if(!L.siteId&&!L.spotId){toast('Elige a dónde vas');return}
  if(!L.spotId&&L.siteId===(SESS.siteId||'')){toast('Elige el spot al que te mueves, o cambia de sitio');return}
  var sp=L.spotId&&L.spotId!=='gps'?spots.filter(function(s){return s.id===L.spotId})[0]:null,st=L.siteId?siteOf(L.siteId):null,place={};
  if(sp)place={id:sp.id,name:sp.name};else if(L.spotId==='gps'){place={name:(st?st.name+' · ':'')+'punto nuevo'};var g=await lvGeo();if(g){place.lat=g.lat;place.lon=g.lon}}else if(st)place={name:st.name};
  if(st)place.siteId=st.id;
  var tg=L.who==='all'?lvPeople().map(function(p){return p.id}):[L.who],w=SESS.where||{};
  tg.forEach(function(k){w[k]=place});SESS.where=w;
  if(tg.indexOf('')>-1&&st){SESS.siteId=st.id;SESS.siteName=st.name}
  var aud=await lvUpAudio();if(LA&&!aud){toast('No se pudo guardar el audio. Inténtalo otra vez.');return}
  var ev={t:Date.now(),type:'spot',who:L.who,name:place.name||''};if(L.why)ev.why=L.why;if(aud)ev.audio=aud;if(place.lat!=null){ev.lat=place.lat;ev.lon=place.lon}if(sp)ev.spotId=sp.id;
  SESS.events=(SESS.events||[]).concat([ev]);
  lvSave({where:SESS.where,siteId:SESS.siteId||null,siteName:SESS.siteName||'',events:SESS.events});
  LS=null;LA=null;toast('Spot cambiado: '+(place.name||''));sessOpen();
}
function lvEqOpen(){
  var cur=lvCurRig(),rig=cur?JSON.parse(JSON.stringify(cur)):{used:[]};delete rig.id;delete rig.why;delete rig.nota;if(!Array.isArray(rig.used))rig.used=[];
  LE={rig:rig,mode:SESS.mode||'',mode0:SESS.mode||'',key0:JSON.stringify((cur&&cur.used||[]).map(function(u){return u.id+(u.bob||'')}).sort()),why:''};
  lvSub('Cambio de equipo','eq',lvEqBody(),'<button class="btn" data-a="lv-back">Atrás</button><button class="btn primary" data-a="lv-eq-save">Guardar cambio</button>');
}
function lvEqBody(){
  return '<div class="field"><label>Modalidad</label><div class="chips">'+modeNames().map(function(m){return '<button type="button" class="chip'+(LE.mode===m?' on':'')+'" data-a="lv-eq-mode" data-v="'+esc(m)+'" aria-pressed="'+(LE.mode===m)+'">'+esc(m)+'</button>'}).join('')+'</div></div>'+
    '<div class="block"><h3>Equipo ahora</h3>'+lvUseBlock(LE.rig,LE.mode)+'</div>'+lvWhy(WHYS_EQ,LE.why)+recHTML();
}
async function lvEqSave(){
  var L=LE;if(!L)return;
  var key=JSON.stringify(useList(L.rig).map(function(u){return u.id+(u.bob||'')}).sort()),chg=key!==L.key0,mchg=L.mode!==L.mode0;
  if(!chg&&!mchg&&!L.why&&!LA){toast('No has cambiado nada');return}
  var aud=await lvUpAudio();if(LA&&!aud){toast('No se pudo guardar el audio. Inténtalo otra vez.');return}
  var ev={t:Date.now(),type:'eq'};
  if(chg||(!lvCurRig()&&!eqEmpty(L.rig))){var rig=JSON.parse(JSON.stringify(L.rig));rig.id=eqId();if(L.why&&(SESS.equipos||[]).length)rig.why=L.why;SESS.equipos=(SESS.equipos||[]).concat([rig]);SESS.curEq=rig.id;ev.eq=rig.id;ev.names=lvRigTxt(rig)}
  if(mchg){SESS.mode=L.mode;ev.mode=L.mode}
  if(L.why)ev.why=L.why;if(aud)ev.audio=aud;
  SESS.events=(SESS.events||[]).concat([ev]);
  lvSave({equipos:SESS.equipos||[],curEq:SESS.curEq||null,mode:SESS.mode||null,events:SESS.events});
  LE=null;LA=null;toast('Cambio de equipo anotado');sessOpen();
}
function lvVoiceOpen(){LNOTE={};lvSub('Nota de voz','note','<p class="hint">Graba lo que quieras contar: queda con la hora en el registro de la salida.</p>'+recHTML(),'<button class="btn" data-a="lv-back">Atrás</button><button class="btn primary" data-a="lv-note-save">Guardar nota</button>')}
async function lvNoteSave(){
  if(REC&&REC.on){toast('Para la grabación primero');return}
  if(!LA){toast('Graba algo primero');return}
  var aud=await lvUpAudio();if(!aud){toast('No se pudo guardar el audio');return}
  lvEv({type:'note',audio:aud});LA=null;LNOTE=null;toast('Nota guardada');sessOpen();
}
function lvPaint(){
  var el=document.getElementById('lvbody');if(!el)return;
  el.innerHTML=LVV==='setup'?lvSetupBody():LVV==='spot'?lvSpotBody():LVV==='eq'?lvEqBody():recHTML();
  if(LVV==='note')el.innerHTML='<p class="hint">Graba lo que quieras contar: queda con la hora en el registro de la salida.</p>'+recHTML();
}

/* ---------- eventos ---------- */
document.addEventListener('toggle',function(ev){var d=ev.target;if(d&&d.getAttribute&&d.getAttribute('data-lk'))LVOPEN[d.getAttribute('data-lk')]=d.open},true);
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a^="lv-"],[data-a^="lm-"]'):null;if(!b)return;
  var a=b.getAttribute('data-a'),id=b.getAttribute('data-id'),v=b.getAttribute('data-v');
  if(a==='lv-live')lvOpenSetup();
  else if(a==='lv-past'){closeSheet();openTripEditor(null)}
  else if(a==='lv-site'){LV.siteId=id||'';LV.spotId='';lvPaint()}
  else if(a==='lv-spot-pick'){LV.spotId=LV.spotId===id?'':id;lvPaint()}
  else if(a==='lv-mode'){LV.mode=v;LV.companions.forEach(function(c){if(!c.mode)c.mode=v});lvPaint()}
  else if(a==='lv-use'||a==='lv-bob'){var r=LVV==='eq'?LE.rig:LV.rig;lvUseToggle(r,a,b);lvPaint()}
  else if(a==='lv-start')lvStart();
  else if(a==='lv-map')lvMapOpen();
  else if(a==='lm-new')lvMapNew();
  else if(a==='lm-back')lvMapBack();
  else if(a==='lm-create')lvMapCreate();
  else if(a==='lm-ok')lvMapOk();
  else if(a==='lv-cap'){LVBACK=true;openQuick();lvQcDefault()}
  else if(a==='lv-spot')lvSpotOpen();
  else if(a==='lv-eq')lvEqOpen();
  else if(a==='lv-voice')lvVoiceOpen();
  else if(a==='lv-back'){recStopHard();LS=LE=LNOTE=null;sessOpen()}
  else if(a==='lv-who'){LS.who=id;lvPaint()}
  else if(a==='lv-sp-sp'){LS.spotId=LS.spotId===id?'':id;lvPaint()}
  else if(a==='lv-why'){var o=LVV==='spot'?LS:LE;o.why=o.why===v?'':v;lvPaint()}
  else if(a==='lv-eq-mode'){LE.mode=v;lvPaint()}
  else if(a==='lv-sp-save')lvSpotSave();
  else if(a==='lv-eq-save')lvEqSave();
  else if(a==='lv-note-save')lvNoteSave();
  else if(a==='lv-rec')recToggle();
  else if(a==='lv-rec-del'){LA=null;lvPaint()}
  else if(a==='lv-end'){
    var k=id||'me',ends=SESS.ends||{},now=Date.now();
    if(ends[k]){delete ends[k];SESS.events=(SESS.events||[]).concat([{t:now,type:'resume',who:id}])}else{ends[k]=now;SESS.events=(SESS.events||[]).concat([{t:now,type:'end',who:id}])}
    SESS.ends=ends;lvSave({ends:ends,events:SESS.events});sessSheetPaint();
  }
},true);
document.addEventListener('change',function(ev){var s=ev.target;if(s&&s.getAttribute&&s.getAttribute('data-a')==='lv-sp-site'){LS.siteId=s.value;LS.spotId='';setTimeout(lvPaint,0)}},true);

/* ---------- captura: spot de cada persona por defecto y vuelta a la consola ---------- */
function lvQcDefault(){
  if(!QC||!SESS)return;var wh=SESS.where||{},w=wh[QC.who||'']||wh[''];
  QC.sel=w&&w.id?w.id:'';qcPaint();
}
var _oq34=openQuick;
openQuick=function(){_oq34();if(SESS){LVBACK=true;lvQcDefault()}};
document.addEventListener('click',function(ev){var b=ev.target.closest?ev.target.closest('[data-a="qc-who"]'):null;if(b&&SESS)lvQcDefault()},true);
var _cs34=closeSheet;
closeSheet=function(){var back=LVBACK&&SESS;LVBACK=false;recStopHard();if(!SESS||LVV==='setup')LVV='';_cs34();if(back)setTimeout(sessOpen,60)};

/* ---------- al terminar: equipos, registro y notas de voz pasan a la salida ---------- */
var _sf34=sessFinish;
sessFinish=function(){
  var s=SESS;if(!s)return;
  var eqs=JSON.parse(JSON.stringify(s.equipos||[])),ev=JSON.parse(JSON.stringify(s.events||[])),ends=s.ends||{};
  ev.push({t:Date.now(),type:'fin'});
  LVV='';_sf34();
  var d=tripDraft;if(!d)return;
  if(eqs.length)d.equipos=eqs;
  d.eventos=ev;renderStep();
};
function lvRegHTML(d){
  var E=(d.eventos||[]).filter(function(e){return e.type!=='fin'});if(!E.length)return '';
  var A=E.filter(function(e){return e.audio});
  return '<div class="block lvtl"><h3>Registro de la salida</h3>'+E.map(lvEvRow).join('')+(A.length?'<p class="hint" style="margin-top:8px">Para pasar un audio a texto, descárgalo y mándamelo por el chat:</p>'+A.map(function(e){return audSrc(e.audio)?'<a class="btn small dlbtn" href="'+audSrc(e.audio)+'" download="nota-'+esc(d.date||'')+'-'+esc(lvHM(e.t).replace(':',''))+'.'+audExt(e.audio)+'">Descargar audio · '+(e.type==='spot'?'spot':e.type==='eq'?'equipo':'nota')+' '+esc(lvHM(e.t))+'</a> ':''}).join(''):'')+'</div>';
}
var _stepSummary34=stepSummary;
stepSummary=function(){
  var h=_stepSummary34(),d=tripDraft,r=d?lvRegHTML(d):'';if(!r)return h;
  var k='<div class="block"><h3>Cuéntalo</h3>',i=h.indexOf(k);return i<0?h+r:h.slice(0,i)+r+h.slice(i);
};

/* ---------- ajustes sobre p33 ---------- */
var _compList34=compList;
compList=function(){return COMPT==='live'&&LV?LV.companions:_compList34()};
var _compAdd34=compAdd;
compAdd=function(c,m){_compAdd34(c,m||(COMPT==='live'&&LV?LV.mode:undefined))};
var _stepSite34=stepSite;
stepSite=function(){return _stepSite34().replace(/<div class="block startblk">[\s\S]*?<\/div>/,'')};

/* ---------- fotos del equipo: reintenta si la red las pierde ---------- */
window.addEventListener('error',function(ev){var im=ev.target;if(!im||im.tagName!=='IMG'||!/img\/gear\//.test(im.src||'')||im.__rt>=3)return;im.__rt=(im.__rt||0)+1;var s=im.getAttribute('src').split('?')[0];setTimeout(function(){im.src=s+'?r='+im.__rt},2500*im.__rt)},true);

document.addEventListener('input',function(ev){if(ev.target&&ev.target.id==='lm-name'&&LM)LM.name=ev.target.value},true);
function invShort(it){
  if(!it)return '';var k=it.kind;
  if(k==='anzuelo'){var w=String(it.modelo||it.name||'').replace(/\(.*?\)/g,'').trim().split(/\s+/),b=w[0]||'';if(/^[A-Z]{2,}$/.test(b)&&/^[A-Z]{2,}$/.test(w[1]||''))b+=' '+w[1];return (b+(it.num?' nº '+it.num:'')).trim()||invName(it)}
  if(k==='corcho'){var f=String(it.fab||'').replace(/\(.*?\)/g,'').trim();return ((f||it.forma||'Corcho')+(it.gr?' '+it.gr+' g':'')).trim()}
  if(k==='cana'||k==='carrete'){var n=String(it.name||'');return n.length>30?n.slice(0,29)+'…':n}
  return invName(it);
}
useTile=function(it,e,i){
  var on=useList(e).some(function(u){return u.id===it.id});
  return '<button type="button" class="utile'+(on?' on':'')+'" data-a="use-tog" data-i="'+i+'" data-id="'+esc(it.id)+'" aria-pressed="'+on+'">'+ivThumb(it)+'<span>'+esc(invShort(it)||'Sin nombre')+'</span></button>';
};

(function(){var s=document.createElement('style');s.textContent=".lvch{display:flex;flex-direction:column;gap:14px;min-height:calc(100dvh - 130px);padding:4px 0 8px}\n.lvc{flex:1;display:flex;flex-direction:column;justify-content:flex-end;gap:10px;padding:22px;border-radius:24px;border:1.5px solid var(--line);color:inherit;text-align:left;position:relative;overflow:hidden;background:var(--surface)}\n.lvc .big{font-size:54px;line-height:1;position:absolute;top:20px;left:22px}\n.lvc .tt b{display:block;font:700 26px/1.1 var(--display);margin-bottom:6px}.lvc .tt small{display:block;color:var(--muted);font-size:14px;line-height:1.35}\n.lvc .cta{align-self:flex-start;padding:11px 18px;border-radius:999px;font:700 15px var(--display);background:rgba(255,255,255,.08);border:1px solid var(--line2)}\n.lvc.live{background:radial-gradient(120% 90% at 20% 0%,rgba(58,208,200,.35),rgba(58,208,200,.06) 60%),var(--surface);border-color:rgba(58,208,200,.7)}\n.lvc.live .cta{background:var(--accent,#3ad0c8);color:var(--accent-ink,#06201f);border:0}\n.lvc.past{background:radial-gradient(120% 90% at 20% 0%,rgba(255,190,60,.16),transparent 60%),var(--surface)}\n.lvsite{display:flex;align-items:center;gap:12px;width:100%;padding:14px;border-radius:16px;border:1.5px solid rgba(58,208,200,.55);background:linear-gradient(135deg,rgba(58,208,200,.16),rgba(58,208,200,.04));color:inherit;text-align:left}\n.lvsite .pin{font-size:26px}.lvsite .tx{flex:1;min-width:0}.lvsite b{display:block;font:700 18px var(--display)}.lvsite small{color:var(--muted);font-size:12.5px}.lvsite .go{font-size:22px;opacity:.85}\n.lvrec{margin-top:10px}\n.lmplus{position:absolute;left:12px;bottom:14px;z-index:800;display:flex;align-items:center;gap:8px;padding:12px 18px;border-radius:999px;border:0;background:var(--accent,#3ad0c8);color:var(--accent-ink,#06201f);font:700 15px var(--display);box-shadow:0 6px 18px rgba(0,0,0,.4)}.lmplus span{font-size:22px;line-height:1}\n.lmsel b{display:block;font:700 18px var(--display)}.lmsel small{color:var(--muted)}.pkbar input{width:100%}\n.lvhead .tm{font:800 36px/1.1 var(--display);letter-spacing:-.5px;margin-top:2px}\n.lvb .ic{display:grid;place-items:center;width:42px;height:42px;border-radius:13px;background:rgba(58,208,200,.14);font-size:22px}.lvb.main .ic{width:52px;height:52px;font-size:28px;background:rgba(58,208,200,.28)}\n.utile span:last-child{-webkit-line-clamp:2!important;font-weight:600}.lvp .pn small{display:block}\n";document.head.appendChild(s)})();

/* ---------- cronómetro vivo y botón atrás del móvil ---------- */
setInterval(function(){
  if(!SESS||LVV!=='console')return;var tm=document.querySelector('#sessbody .tm');if(!tm)return;
  var now=Date.now();tm.textContent=lvDur(SESS.startedAt,now);
  var rows=document.querySelectorAll('#sessbody .lvp');lvPeople().forEach(function(p,i){var r=rows[i];if(!r)return;if(!(SESS.ends||{})[p.id||'me']){var sm=r.querySelector('small.on');if(sm)sm.textContent='pescando · '+lvDur(SESS.startedAt,now)}});
},20000);
try{history.pushState({cq:1},'')}catch(e){}
window.addEventListener('popstate',function(){
  var pk=$('#pick'),sh=$('#sheet'),done=false;
  if(pk&&!pk.hidden){var c=pk.querySelector('[data-a="mp-cancel"]');if(c)c.click();else closePick();done=true}
  else if(sh&&!sh.hidden){var x=sh.querySelector('[data-a="close-sheet"]');if(x)x.click();else closeSheet();done=true}
  if(done){try{history.pushState({cq:1},'')}catch(e){}}
});
