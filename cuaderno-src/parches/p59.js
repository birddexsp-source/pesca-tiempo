/* ===== p59: Preguntas rápidas — durante la salida y después; respuesta de un toque, nota de voz o dictado; todo queda guardado en «respuestas» ===== */
var RS={},QR={on:false,key:null,mr:null},QSK='cuaderno-qr-skip';
var QB=[
  {id:'ritmo',when:'live',txt:'¿Cómo va la pesca?',o:[['bien','Bien'],['poco','Poco'],['nada','Nada'],['bogas','Solo bogas']],ok:function(c){return c.min>=20}},
  {id:'cebo',when:'live',txt:'¿Cómo te vuelve el cebo?',o:[['intacto','Intacto'],['chupado','Chupado'],['comido','Comido'],['perdido','Lo pierdo']],ok:function(c){return c.min>=30&&c.mine<=1}},
  {id:'picadas',when:'live',txt:'¿Notas picadas que no clavas?',o:[['si','Sí, tirones'],['no','Nada de nada'],['pelado','Anzuelo pelado']],ok:function(c){return c.min>=40&&c.mine===0}},
  {id:'equipo',when:'live',txt:'¿Falla algo del equipo?',o:[['nada','Nada'],['enganches','Enganches'],['rotura','Roturas'],['plomos','Pierdo plomos'],['otra','Otra (voz)']],ok:function(c){return c.min>=30}},
  {id:'fin',when:'post',txt:'¿Por qué terminaste?',o:[['hora','Hora'],['mar','Mar'],['viento','Viento'],['nopicaba','No picaba'],['cansancio','Cansancio'],['otra','Otra']]},
  {id:'mejor',when:'post',txt:'¿Cuándo picó mejor?',o:[['alba','Alba'],['manana','Mañana'],['mediodia','Mediodía'],['tarde','Tarde'],['atardecer','Atardecer'],['nopico','No picó']]},
  {id:'volver',when:'post',txt:'¿Volverías con condiciones parecidas?',o:[['si','Sí'],['quiza','Quizá'],['no','No']]},
  {id:'cambiar',when:'post',txt:'¿Qué cambiarías la próxima vez?',o:[],open:true}
];
function qrQ(id){return QB.filter(function(q){return q.id===id})[0]}
(function(){var tm=setInterval(function(){
  if(typeof db==='undefined'||!db)return;clearInterval(tm);
  db.collection('respuestas').onSnapshot(function(s){RS={};s.docs.forEach(function(d){var o=JSON.parse(JSON.stringify(d.data()||{}));RS[d.id]=o});try{qrRepaint()}catch(e){}},function(){});
},300)})();
function qrId(ref,q){return ref+'_'+q}
function qrSkips(){try{return JSON.parse(localStorage.getItem(QSK)||'{}')||{}}catch(e){return {}}}
function qrSkip(k){var s=qrSkips();s[k]=1;try{localStorage.setItem(QSK,JSON.stringify(s))}catch(e){}}
function qrSave(ref,q,patch,ctx){
  if(!db)return;var id=qrId(ref,q),cur=Object.assign({ref:ref,q:q},RS[id]||{},ctx||{},patch);
  Object.keys(cur).forEach(function(k){if(cur[k]===null||cur[k]===''||cur[k]===undefined)delete cur[k]});
  cur.t=cur.t||Date.now();cur.u=Date.now();RS[id]=cur;
  return db.doc('respuestas/'+id).set(cur).catch(function(){toast('No se pudo guardar la respuesta')});
}
function qrCtxLive(){var cs=sessCounts();return {min:Math.round((Date.now()-(SESS.startedAt||Date.now()))/60000),mine:cs.m}}
function qrRefLive(){return 'S'+(SESS&&SESS.startedAt)}
function qrMeta(){
  if(SESS){var p=(SESS.where||{})[''];return {date:SESS.date,spot:(p&&p.name)||SESS.siteName||null,live:true}}
  return {};
}
function qrDictOK(){return !!(window.SpeechRecognition||window.webkitSpeechRecognition)}
/* una pregunta */
function qrUnit(q,ref,kind){
  var a=RS[qrId(ref,q.id)]||{},k=esc(ref),i=esc(q.id),rec=QR.on&&QR.key===ref+'|'+q.id;
  var h='<div class="qrq'+(a.a||a.txt||a.audio?' done':'')+'" data-q="'+i+'" data-ref="'+k+'"><b>'+esc(q.txt)+'</b>';
  if(q.o.length)h+='<div class="qrc">'+q.o.map(function(o){return '<button type="button" class="cmb'+(a.a===o[0]?' on':'')+'" data-a="qr-a" data-ref="'+k+'" data-q="'+i+'" data-v="'+esc(o[0])+'" aria-pressed="'+(a.a===o[0])+'">'+esc(o[1])+'</button>'}).join('')+'</div>';
  h+='<div class="qrv">';
  if(rec)h+='<button type="button" class="btn small primary" data-a="qr-rec" data-ref="'+k+'" data-q="'+i+'"><span class="rdot"></span> Parar</button>';
  else h+='<button type="button" class="btn small" data-a="qr-rec" data-ref="'+k+'" data-q="'+i+'">🎙 '+(a.audio?'Grabar otra':'Voz')+'</button>'+(qrDictOK()?'<button type="button" class="btn small" data-a="qr-dict" data-ref="'+k+'" data-q="'+i+'">🗣 Dictar</button>':'');
  if(a.audio){var u=audSrc(a.audio);h+=u?'<audio controls preload="none" src="'+u+'"></audio>':'<small class="hint">🎙 audio guardado</small>'}
  h+='</div>';
  if(q.open||a.txt)h+='<textarea class="qrt" data-qrt="'+i+'" data-ref="'+k+'" placeholder="O escríbelo aquí…" rows="2">'+esc(a.txt||'')+'</textarea>';
  if(kind==='live'&&!a.a&&!a.txt&&!a.audio)h+='<button type="button" class="btn small ghost" data-a="qr-skip" data-ref="'+k+'" data-q="'+i+'">Ahora no</button>';
  return h+'</div>';
}
/* en la salida en directo: una pregunta cada vez, cuando toca */
function qrLiveNext(){
  if(!SESS)return null;var c=qrCtxLive(),ref=qrRefLive(),sk=qrSkips(),L=[];
  QB.forEach(function(q){if(q.when==='live'&&q.ok(c)&&!RS[qrId(ref,q.id)]&&!sk[ref+'|'+q.id])L.push(q)});
  return L.length?{q:L[0],more:L.length-1}:null;
}
function qrLiveHTML(){
  var n=qrLiveNext();if(!n)return '<div class="qrcard" data-kind="live" hidden></div>';
  return '<div class="block qrcard" data-kind="live"><h3>❓ Pregunta rápida'+(n.more?' <small>· +'+n.more+'</small>':'')+'</h3>'+qrUnit(n.q,qrRefLive(),'live')+'</div>';
}
var _lc59=lvConsoleHTML;
lvConsoleHTML=function(){
  var h=_lc59();
  return h.replace(/(<div class="lvgrid">)/,qrLiveHTML()+'$1');
};
/* después de la salida: tarjeta arriba de Salidas con las preguntas pendientes de la última */
function qrPostPending(){
  var lim=agAdd(todayISO(),-4),sk=qrSkips(),T=trips.filter(function(t){return t.date&&t.date>=lim&&t.date<=todayISO()}).sort(function(a,b){return String(b.date).localeCompare(String(a.date))||(b.createdAt||0)-(a.createdAt||0)});
  for(var i=0;i<T.length;i++){
    var t=T[i];if(sk['T'+t.id])continue;
    var pend=QB.filter(function(q){return q.when==='post'&&!RS[qrId(t.id,q.id)]});
    if(pend.length)return {t:t,pend:pend};
  }
  return null;
}
function qrPostHTML(){
  if(SESS)return '<div class="qrcard" data-kind="post" hidden></div>';
  var P=qrPostPending();if(!P)return '<div class="qrcard" data-kind="post" hidden></div>';
  var t=P.t,all=QB.filter(function(q){return q.when==='post'});
  return '<div class="block qrcard" data-kind="post"><h3>❓ Cuéntame de tu salida</h3><p class="hint">'+esc(cmDate(t.date))+' · '+esc(t.siteName||'Salida')+'. Un toque, o una nota de voz. Lo que no sepas, déjalo.</p>'+
    all.map(function(q){return qrUnit(q,t.id,'post')}).join('')+'<button type="button" class="btn small ghost" data-a="qr-skipall" data-ref="'+esc(t.id)+'">Ahora no</button></div>';
}
var _rs59=renderSalidas;
renderSalidas=function(){return qrPostHTML()+_rs59()};
/* repintar solo las tarjetas, sin tocar nada más */
function qrRepaint(){
  [].forEach.call(document.querySelectorAll('.qrcard'),function(el){
    var h=el.getAttribute('data-kind')==='live'?qrLiveHTML():qrPostHTML(),t=document.createElement('div');t.innerHTML=h;
    var n=t.firstChild;if(n)el.replaceWith(n);
  });
}
/* grabar y dictar */
function qrUpload(bl,type){
  try{return window.claude.use('assets').then(function(a){return a.upload(bl,{type:type})}).then(function(r){return r&&r.id||null}).catch(function(){return null})}catch(e){return Promise.resolve(null)}
}
function qrRec(ref,q){
  if(QR.on){try{QR.mr.stop()}catch(e){}return}
  if(!navigator.mediaDevices||!window.MediaRecorder){toast('Este navegador no puede grabar audio');return}
  navigator.mediaDevices.getUserMedia({audio:true}).then(function(st){
    var mr=new MediaRecorder(st),ch=[];QR={on:true,key:ref+'|'+q,mr:mr};
    mr.ondataavailable=function(e){if(e.data&&e.data.size)ch.push(e.data)};
    mr.onstop=function(){
      try{st.getTracks().forEach(function(t){t.stop()})}catch(e){}
      var type=mr.mimeType||'audio/webm',bl=new Blob(ch,{type:type});QR={on:false,key:null,mr:null};qrRepaint();
      if(!bl.size)return;
      qrUpload(bl,type).then(function(id){
        if(!id){toast('No se pudo guardar el audio');return}
        qrSave(ref,q,{audio:id},qrMeta());toast('Nota guardada');qrRepaint();
      });
    };
    mr.start();qrRepaint();
  }).catch(function(){toast('Sin permiso de micrófono')});
}
function qrDict(ref,q){
  var SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return;
  var r=new SR();r.lang='es-ES';r.interimResults=false;r.maxAlternatives=1;
  r.onresult=function(e){var s=e.results[0]&&e.results[0][0]&&e.results[0][0].transcript;if(!s)return;var cur=(RS[qrId(ref,q)]||{}).txt;qrSave(ref,q,{txt:(cur?cur+' ':'')+s},qrMeta());qrRepaint()};
  r.onerror=function(){toast('No se pudo dictar')};
  try{r.start();toast('Habla ahora…')}catch(e){}
}
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a^="qr-"]'):null;if(!b)return;
  var a=b.getAttribute('data-a'),ref=b.getAttribute('data-ref'),q=b.getAttribute('data-q');
  ev.stopPropagation();
  if(a==='qr-a'){var cur=(RS[qrId(ref,q)]||{}).a,v=b.getAttribute('data-v');qrSave(ref,q,{a:cur===v?null:v},qrMeta());qrRepaint();return}
  if(a==='qr-rec'){qrRec(ref,q);return}
  if(a==='qr-dict'){qrDict(ref,q);return}
  if(a==='qr-skip'){qrSkip(ref+'|'+q);qrRepaint();return}
  if(a==='qr-skipall'){qrSkip('T'+ref);qrRepaint();return}
},true);
document.addEventListener('change',function(ev){
  var t=ev.target;if(!t||!t.getAttribute)return;
  var q=t.getAttribute('data-qrt'),ref=t.getAttribute('data-ref');
  if(q&&ref){qrSave(ref,q,{txt:t.value.trim()},qrMeta());return}
  var e=t.getAttribute('data-qre');if(e){var d=RS[e];if(d)qrSave(d.ref,d.q,{txt:t.value.trim()})}
});
/* Ajustes: lo que has contestado, con sitio para el texto de las notas de voz */
function qrLabel(d){
  var q=qrQ(d.q);if(!q)return {q:d.q,a:d.a||''};
  var o=(q.o||[]).filter(function(x){return x[0]===d.a})[0];
  return {q:q.txt,a:o?o[1]:(d.a||'')};
}
var _os59=openSettings;
openSettings=function(){
  _os59.apply(this,arguments);
  var b=document.getElementById('sheetbody');if(!b||b.querySelector('#qrblk'))return;
  var L=Object.keys(RS).map(function(k){return RS[k]}).sort(function(a,b){return (b.t||0)-(a.t||0)}),au=L.filter(function(d){return d.audio}),pend=au.filter(function(d){return !d.txt}).length;
  var d=document.createElement('details');d.id='qrblk';d.className='block';
  d.innerHTML='<summary><h3 style="display:inline">Mis respuestas rápidas</h3> <small class="hint">'+L.length+' guardadas'+(pend?' · '+pend+(pend===1?' nota de voz sin texto':' notas de voz sin texto'):'')+'</small></summary>'+
    (L.length?L.slice(0,40).map(function(x){var l=qrLabel(x),u=x.audio?audSrc(x.audio):'';
      return '<div class="qre"><b>'+esc(l.q)+'</b><span>'+esc(l.a||'')+'</span><small class="hint">'+esc(x.date||'')+(x.spot?' · '+esc(x.spot):'')+'</small>'+(u?'<audio controls preload="none" src="'+u+'"></audio>':'')+
        (x.audio||x.txt?'<textarea class="qrt" rows="2" data-qre="'+esc(qrId(x.ref,x.q))+'" placeholder="Texto de la nota (pégalo aquí cuando lo tengas)">'+esc(x.txt||'')+'</textarea>':'')+'</div>'}).join(''):'<p class="hint">Aún no has contestado ninguna. Saldrán durante la salida y al terminar.</p>');
  var cm=b.querySelector('#cmblk');if(cm&&cm.nextSibling)b.insertBefore(d,cm.nextSibling);else b.insertBefore(d,b.firstChild);
};
(function(){var s=document.createElement('style');s.textContent=
'.qrcard h3 small{color:var(--muted);font-weight:500}.qrq{padding:10px 0;border-top:1px solid var(--line)}.qrcard>.hint+.qrq,.qrcard>h3+.qrq{border-top:0}.qrq>b{display:block;margin-bottom:7px;font-size:15px}'+
'.qrq.done>b:before{content:"✓ ";color:var(--ok)}.qrc{display:flex;flex-wrap:wrap;gap:6px}.qrv{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:8px}.qrv audio{width:100%;height:36px}'+
'.qrv .rdot{display:inline-block;width:10px;height:10px;border-radius:50%;background:#ff5c5c;margin-right:4px;animation:sdot 1.2s infinite}'+
'.qrt{width:100%;margin-top:8px;border-radius:10px;border:1px solid var(--line);background:var(--surface2);color:var(--ink);font:inherit;padding:8px 10px;resize:vertical}'+
'#qrblk>summary{cursor:pointer;list-style:none;display:flex;flex-direction:column;gap:2px}#qrblk>summary::-webkit-details-marker{display:none}.qre{padding:10px 0;border-top:1px solid var(--line);display:flex;flex-direction:column;gap:3px}.qre span{color:var(--accent);font-size:13.5px}.qre audio{width:100%;height:36px}';
document.head.appendChild(s)})();
