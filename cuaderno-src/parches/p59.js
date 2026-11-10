/* ===== p59: Preguntas rápidas — durante la salida y después; respuesta de un toque, nota de voz o dictado; todo queda guardado en «respuestas» ===== */
var RS={},QR={on:false,key:null,mr:null},QSK='cuaderno-qr-skip';
var QB=[
  {id:'ritmo',when:'live',txt:'¿Cómo va la pesca?',o:[['bien','Bien','😄'],['poco','Poco','😐'],['nada','Nada','😕'],['bogas','Solo bogas','🐟']],ok:function(c){return c.min>=20}},
  {id:'cebo',when:'live',txt:'¿Cómo te vuelve el cebo?',o:[['intacto','Intacto','✅'],['chupado','Chupado','👄'],['comido','Comido','🍽️'],['perdido','Lo pierdo','💨']],ok:function(c){return c.min>=30&&c.mine<=1}},
  {id:'picadas',when:'live',txt:'¿Notas picadas que no clavas?',o:[['si','Sí, tirones','⚡'],['no','Nada de nada','😶'],['pelado','Anzuelo pelado','🪝']],ok:function(c){return c.min>=40&&c.mine===0}},
  {id:'equipo',when:'live',txt:'¿Falla algo del equipo?',o:[['nada','Nada','👌'],['enganches','Enganches','🪨'],['rotura','Roturas','✂️'],['plomos','Pierdo plomos','⚓'],['otra','Otra (voz)','💬']],ok:function(c){return c.min>=30}},
  {id:'fin',when:'post',txt:'¿Por qué terminaste?',o:[['hora','Hora','⏰'],['mar','Mar','🌊'],['viento','Viento','💨'],['nopicaba','No picaba','🚫'],['cansancio','Cansancio','😮‍💨'],['otra','Otra','💬']]},
  {id:'mejor',when:'post',txt:'¿Cuándo picó mejor?',o:[['alba','Alba','🌅'],['manana','Mañana','☀️'],['mediodia','Mediodía','🌞'],['tarde','Tarde','🌤️'],['atardecer','Atardecer','🌇'],['nopico','No picó','🚫']]},
  {id:'volver',when:'post',txt:'¿Volverías con condiciones parecidas?',o:[['si','Sí','👍'],['quiza','Quizá','🤔'],['no','No','👎']]},
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
function qrUnit(q,ref,kind,step){
  var a=RS[qrId(ref,q.id)]||{},k=esc(ref),i=esc(q.id),rec=QR.on&&QR.key===ref+'|'+q.id;
  var h='<div class="qrq'+(a.a||a.txt||a.audio?' done':'')+'" data-q="'+i+'" data-ref="'+k+'"><div class="qrt1">'+esc(q.txt)+'</div>';
  if(q.o.length)h+='<div class="qrc n'+(q.o.length%3===0||q.o.length>4?3:2)+'">'+q.o.map(function(o){return '<button type="button" class="qro'+(a.a===o[0]?' on':'')+'" data-a="qr-a" data-ref="'+k+'" data-q="'+i+'" data-v="'+esc(o[0])+'" aria-pressed="'+(a.a===o[0])+'"><span class="qe">'+(o[2]||'')+'</span><span>'+esc(o[1])+'</span></button>'}).join('')+'</div>';
  h+='<div class="qrv">';
  if(rec)h+='<button type="button" class="qrm rec" data-a="qr-rec" data-ref="'+k+'" data-q="'+i+'"><span class="rdot"></span> Grabando · toca para parar</button>';
  else h+='<button type="button" class="qrm" data-a="qr-rec" data-ref="'+k+'" data-q="'+i+'">🎙 '+(a.audio?'Otra vez':'Voz')+'</button>'+(qrDictOK()?'<button type="button" class="qrm" data-a="qr-dict" data-ref="'+k+'" data-q="'+i+'">🗣 Dictar</button>':'');
  h+='</div>';
  if(a.audio){var u=audSrc(a.audio);h+=u?'<audio controls preload="none" src="'+u+'"></audio>':'<small class="hint">🎙 audio guardado</small>'}
  if(q.open||a.txt)h+='<textarea class="qrt" data-qrt="'+i+'" data-ref="'+k+'" placeholder="O escríbelo aquí…" rows="2">'+esc(a.txt||'')+'</textarea>';
  if(!a.a&&!a.txt&&!a.audio)h+='<button type="button" class="qrpass" data-a="'+(kind==='live'?'qr-skip':'qr-pass')+'" data-ref="'+k+'" data-q="'+i+'">'+(kind==='live'?'Ahora no':'Pasar')+'</button>';
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
  return '<div class="block qrcard" data-kind="live"><div class="qrh"><span class="qri">?</span><b>Pregunta rápida</b>'+(n.more?'<small>+'+n.more+' más</small>':'')+'</div>'+qrUnit(n.q,qrRefLive(),'live')+'</div>';
}
var _lc59=lvConsoleHTML;
lvConsoleHTML=function(){
  var h=_lc59(),i=h.indexOf('data-a="lv-eq"'),j=i>-1?h.indexOf('</div>',i):-1;
  return j>-1?h.slice(0,j+6)+qrLiveHTML()+h.slice(j+6):h+qrLiveHTML();
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
function qrLeft(ref){var sk=qrSkips();return QB.filter(function(q){return q.when==='post'&&!RS[qrId(ref,q.id)]&&!sk[ref+'|'+q.id]}).length>0}
function qrPostHTML(){
  var hid='<div class="qrcard" data-kind="post" hidden></div>';
  if(SESS)return hid;
  if(QR.thanks&&Date.now()<QR.thanksUntil)return '<div class="block qrcard thanks" data-kind="post"><div class="qrbig">✓</div><b>¡Anotado!</b><small class="hint">Esto alimenta al maestro. Gracias.</small></div>';
  var P=qrPostPending();if(!P)return hid;
  var t=P.t,all=QB.filter(function(q){return q.when==='post'}),sk=qrSkips(),cur=P.pend.filter(function(q){return !sk[t.id+'|'+q.id]})[0];
  if(!cur)return hid;
  var dots=all.map(function(q){var d=RS[qrId(t.id,q.id)];return '<i class="'+(d?'on':q.id===cur.id?'cur':'')+'"></i>'}).join('');
  return '<div class="block qrcard" data-kind="post"><div class="qrh"><span class="qri">?</span><b>Cuéntame de tu salida</b><small>'+esc(cmDate(t.date))+' · '+esc(t.siteName||'Salida')+'</small></div><div class="qrdots">'+dots+'</div>'+qrUnit(cur,t.id,'post')+
    '<button type="button" class="qrpass end" data-a="qr-skipall" data-ref="'+esc(t.id)+'">Ahora no, gracias</button></div>';
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
  if(a==='qr-a'){var cur=(RS[qrId(ref,q)]||{}).a,v=b.getAttribute('data-v');qrSave(ref,q,{a:cur===v?null:v},qrMeta());
    var qq=qrQ(q);if(qq&&qq.when==='post'&&!qrLeft(ref)){QR.thanks=true;QR.thanksUntil=Date.now()+2600;setTimeout(qrRepaint,2700)}
    qrRepaint();return}
  if(a==='qr-pass'){qrSkip(ref+'|'+q);qrRepaint();return}
  if(a==='qr-rec'){qrRec(ref,q);return}
  if(a==='qr-dict'){qrDict(ref,q);return}
  if(a==='qr-skip'){qrSkip(ref+'|'+q);qrRepaint();return}
  if(a==='qr-skipall'){qrSkip('T'+ref);qrRepaint();return}
},true);
document.addEventListener('change',function(ev){
  var t=ev.target;if(!t||!t.getAttribute)return;
  var q=t.getAttribute('data-qrt'),ref=t.getAttribute('data-ref');
  if(q&&ref){qrSave(ref,q,{txt:t.value.trim()},qrMeta());var qq=qrQ(q);if(qq&&qq.when==='post'&&!qrLeft(ref)){QR.thanks=true;QR.thanksUntil=Date.now()+2600;setTimeout(qrRepaint,2700)}qrRepaint();return}
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
'.qrcard{position:relative;overflow:hidden;border-radius:20px;background:linear-gradient(160deg,rgba(58,208,200,.14),var(--surface) 55%);border:1px solid rgba(58,208,200,.38);box-shadow:0 8px 26px rgba(0,0,0,.28)}'+
'.qrcard:before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--accent)}'+
'.qrh{display:flex;align-items:center;gap:10px;margin-bottom:4px}.qrh b{font:700 16px var(--display)}.qrh small{margin-left:auto;color:var(--muted);font-size:12px;text-align:right}'+
'.qrcard[data-kind="post"] .qrh{flex-wrap:wrap;row-gap:2px}.qrcard[data-kind="post"] .qrh small{flex-basis:100%;margin:0 0 0 38px;text-align:left}'+
'.qri{width:28px;height:28px;border-radius:50%;background:var(--accent);color:#06201f;display:grid;place-items:center;font:800 15px var(--display);flex:none}'+
'.qrdots{display:flex;gap:6px;margin:8px 0 2px}.qrdots i{flex:1;height:4px;border-radius:99px;background:var(--line)}.qrdots i.on{background:var(--accent)}.qrdots i.cur{background:rgba(58,208,200,.45)}'+
'.qrq{padding:8px 0 2px}.qrt1{font:700 19px/1.25 var(--display);margin:6px 0 12px}'+
'.qrc{display:grid;gap:8px}.qrc.n2{grid-template-columns:1fr 1fr}.qrc.n3{grid-template-columns:repeat(3,1fr)}'+
'.qro{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:68px;padding:8px 4px;border-radius:14px;border:1.5px solid var(--line);background:var(--surface2);color:var(--ink);font:600 13.5px/1.15 var(--display);text-align:center;transition:transform .12s,background .12s}'+
'.qro .qe{font-size:24px;line-height:1}.qro:active{transform:scale(.96)}.qro.on{background:var(--accent-soft);border-color:var(--accent);color:var(--accent);box-shadow:0 0 0 3px rgba(58,208,200,.15)}'+
'.qrv{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.qrm{flex:1;min-height:44px;padding:8px 12px;border-radius:99px;border:1.5px dashed var(--line);background:transparent;color:var(--muted);font:600 13.5px var(--display);white-space:nowrap}'+
'.qrm.rec{border-style:solid;border-color:#ff5c5c;background:rgba(255,92,92,.1);color:#ff8c8c}.qrm .rdot,.qrm.rec .rdot{display:inline-block;width:10px;height:10px;border-radius:50%;background:#ff5c5c;margin-right:6px;animation:sdot 1.2s infinite}'+
'.qrq audio{width:100%;height:36px;margin-top:8px}.qrpass{display:block;margin:10px auto 0;background:none;border:0;color:var(--dim);font:600 13px var(--display);padding:8px 14px}.qrpass.end{margin-top:6px}'+
'.qrt{width:100%;margin-top:8px;border-radius:12px;border:1px solid var(--line);background:var(--surface2);color:var(--ink);font:inherit;padding:10px 12px;resize:vertical}'+
'.qrq.done .qrt1:before{content:"✓ ";color:var(--ok)}'+
'.qrcard.thanks{text-align:center;padding:22px 16px}.qrbig{width:52px;height:52px;margin:0 auto 8px;border-radius:50%;background:var(--accent);color:#06201f;display:grid;place-items:center;font:800 26px var(--display)}.qrcard.thanks b{display:block;font:700 18px var(--display)}'+
'#qrblk>summary{cursor:pointer;list-style:none;display:flex;flex-direction:column;gap:2px}#qrblk>summary::-webkit-details-marker{display:none}.qre{padding:10px 0;border-top:1px solid var(--line);display:flex;flex-direction:column;gap:3px}.qre span{color:var(--accent);font-size:13.5px}.qre audio{width:100%;height:36px}';
document.head.appendChild(s)})();
