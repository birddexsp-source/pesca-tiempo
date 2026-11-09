/* ===== p55: Agua y mar de fondo — color del agua por visita, días desde el temporal, cómo se comporta cada spot ===== */
var AGST=2.5; /* «mar fuerte»: pico de ola (m) a partir del cual se cuenta como temporal */
var AGL=[['cristal','Cristal'],['tomadilla','Tomadilla'],['tomada','Tomada'],['chocolate','Chocolate']];
var AGS={cristal:0,tomadilla:1,tomada:2,chocolate:3};
var AG={}; /* aguas/<stopId> = {stopId,agua,pk,ago,u} */
(function(){var tm=setInterval(function(){
  if(typeof db==='undefined'||!db)return;clearInterval(tm);
  db.collection('aguas').onSnapshot(function(s){AG={};s.docs.forEach(function(d){var o=JSON.parse(JSON.stringify(d.data()||{}));AG[o.stopId||d.id]=o});try{rebuildLegs()}catch(e){}try{refresh()}catch(e){}},function(){});
},300)})();

function agAdd(iso,n){var d=new Date(iso+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)}
/* de cada visita: lo que apuntó a mano, o el aviso de agua dado durante la salida en directo */
function agOf(l,tripId){
  var key=l&&(l.stopId!=null?l.stopId:l.id),m=key!=null&&key!=='0'?AG[key]:null,o={agua:m&&m.agua||null,pk:m&&m.pk!=null?m.pk:null,ago:m&&m.ago!=null?m.ago:null};
  if(!o.agua){
    var t=trips.find(function(x){return x.id===(tripId||l.tripId)});
    var ev=((t&&t.eventos)||[]).filter(function(e){return e&&e.type==='agua'&&e.v});
    if(ev.length)o.agua=ev[ev.length-1].v;
  }
  return o;
}
var _rl55=rebuildLegs;
rebuildLegs=function(){_rl55();legs.forEach(function(l){var o=agOf(l);l.agua=o.agua;l.pkM=o.pk;l.agoM=o.ago})};
/* mar de los días previos a una fecha: sale de las previsiones guardadas (Windy) o de lo que apuntes a mano */
function agCtx(l){
  if(l.pkM!=null||l.agoM!=null){var p=l.pkM!=null?+l.pkM:null;return {pk:p,ago:l.agoM!=null?+l.agoM:0,known:p!=null,src:'manual'}}
  return agStorm(l.date,l.wave);
}
function agColor(a){return {cristal:'#7fd6ff',tomadilla:'#d9c46a',tomada:'#b98a4a',chocolate:'#7a4a28'}[a]||'#8a93a3'}
function agName(a){var x=AGL.filter(function(q){return q[0]===a})[0];return x?x[1]:''}
function agWrite(sid,patch){
  if(!db||!sid)return;var cur=Object.assign({},AG[sid]||{stopId:sid},patch);
  Object.keys(cur).forEach(function(k){if(cur[k]===null||cur[k]===''||(typeof cur[k]==='number'&&isNaN(cur[k])))delete cur[k]});
  cur.stopId=sid;
  var empty=!cur.agua&&cur.pk==null&&cur.ago==null;
  if(empty){delete AG[sid];return db.doc('aguas/'+sid).delete().catch(function(){})}
  cur.u=Date.now();AG[sid]=cur;return db.doc('aguas/'+sid).set(cur).catch(function(){toast('No se pudo guardar el agua')});
}
function agChips(sid,cur,cls){
  return '<div class="agc'+(cls?' '+cls:'')+'" role="group" aria-label="Color del agua">'+AGL.map(function(q){return '<button type="button" class="ag '+q[0]+(cur===q[0]?' on':'')+'" data-a="ag-set" data-sid="'+esc(sid)+'" data-v="'+q[0]+'" aria-pressed="'+(cur===q[0])+'"><i></i>'+q[1]+'</button>'}).join('')+'</div>';
}
function agFields(sid,o,l){
  var ctx=l?agCtx(Object.assign({},l,{pkM:o.pk,agoM:o.ago})):null,auto=ctx&&ctx.src==='windy'&&ctx.known?'Con tus previsiones guardadas: pico de '+num(ctx.pk)+' m hace '+ctx.ago+(ctx.ago===1?' día':' días')+'.':'Sin previsión guardada de los días previos: apúntalo si lo recuerdas.';
  return '<details class="agd"><summary>Mar de los días anteriores</summary><p class="hint">'+esc(auto)+'</p><div class="row"><div class="field"><label>Ola máx. (m)</label><input inputmode="decimal" data-agf="pk" data-sid="'+esc(sid)+'" placeholder="auto" value="'+(o.pk!=null?esc(o.pk):'')+'"></div><div class="field"><label>Hace (días)</label><input inputmode="numeric" data-agf="ago" data-sid="'+esc(sid)+'" placeholder="auto" value="'+(o.ago!=null?esc(o.ago):'')+'"></div></div></details>';
}
function agBlock(sid,l,title){
  var o=agOf(l||{stopId:sid});
  return '<div class="field agblk"><label>'+(title||'Cómo estaba el agua')+'</label>'+agChips(sid,o.agua)+agFields(sid,o,l)+'</div>';
}
/* ----- lo que se deduce solo de las capturas ----- */
function agHours(l){
  if(!l.tFrom||!l.tTo)return null;var a=l.tFrom.split(':'),b=l.tTo.split(':'),m=(+b[0]*60+ +b[1])-(+a[0]*60+ +a[1]);if(m<0)m+=1440;return m>=15?m/60:null;
}
function agInfer(l,tripId){
  var h=agHours(l),n=0,sargo=0,boga=0,any=false;
  var cs=catches.filter(function(c){return c.tripId===(tripId||l.tripId)});
  var one=trips.find(function(t){return t.id===(tripId||l.tripId)});var nst=one&&one.stops?one.stops.length:1;
  cs.forEach(function(c){(c.items||[]).forEach(function(i){
    if(i.who||!i.species||i.st==='esc')return;
    var here=i.stopId!=null?String(i.stopId)===String(l.stopId!=null?l.stopId:l.id):(i.spotId?i.spotId===l.spotId:nst<2);
    if(!here)return;any=true;var q=i.n||1;n+=q;if(/sargo/i.test(i.species))sargo+=q;if(/boga/i.test(i.species))boga+=q;
  })});
  return {h:h,n:n,sargo:sargo,boga:boga,any:any,rate:h&&any?n/h:null,sRate:h&&any?sargo/h:null,bogas:boga>=3&&n&&boga/n>=0.4};
}
function agInferHTML(l,tripId){
  var I=agInfer(l,tripId),p=[];
  if(I.any&&I.h)p.push('<span class="pill">🐟 '+num(I.rate,1)+' por hora</span>');
  if(I.bogas)p.push('<span class="pill mucho">Entraron bogas · '+I.boga+' de '+I.n+'</span>');
  return p.length?'<div class="mvp">'+p.join('')+'<small class="hint">deducido de tus capturas</small></div>':'';
}
/* ----- Memoria del spot: chips en cada visita ----- */
var _mvCard55=mvCard;
mvCard=function(s,v){
  var h=_mvCard55(s,v),l=v.l,sid=l.stopId!=null?l.stopId:l.id;
  if(sid==null||sid==='0')return h;
  var o=agOf(l,v.tripId),ctx=agCtx(Object.assign({},l,{pkM:o.pk,agoM:o.ago}));
  var st=ctx.known?'<p class="mvs">Mar previo: pico de '+num(ctx.pk)+' m '+(ctx.ago===0?'ese mismo día':'hace '+ctx.ago+(ctx.ago===1?' día':' días'))+(ctx.src==='manual'?' (apuntado)':'')+'.</p>':'';
  var add='<div class="mva"><span class="eyebrow">Agua</span>'+agChips(sid,o.agua,'sm')+agFields(sid,o,Object.assign({},l,{date:l.date||v.date}))+st+agInferHTML(l,v.tripId)+'</div>';
  return h.replace(/<\/article>$/,add+'</article>');
};
/* ----- ficha del spot: cómo se comporta el agua ----- */
function agPoints(s){
  return legsOfSpot(s.id).filter(function(l){return l.agua}).map(function(l){return {l:l,c:agCtx(l),I:agInfer(l)}});
}
function agStrip(P){
  var S=P.filter(function(p){return p.c.known&&p.c.pk>=AGST});if(!S.length)return '';
  var cols=[0,1,2,3,4].map(function(d){
    var xs=S.filter(function(p){return d===4?p.c.ago>=4:p.c.ago===d});
    return '<div class="agcol"><div class="agdots">'+xs.map(function(p){return '<span class="agdot" style="background:'+agColor(p.l.agua)+'" title="'+esc(agName(p.l.agua)+' · '+num(p.c.pk)+' m')+'"><b>'+num(p.c.pk)+'</b></span>'}).join('')+'</div><small>'+(d===4?'4+':d)+'</small></div>';
  }).join('');
  return '<div class="agstrip"><small class="hint">Días desde el pico de mar (punto = color del agua, número = ola máx.)</small><div class="agcols">'+cols+'</div></div>';
}
function agSpeed(P){
  var S=P.filter(function(p){return p.c.known&&p.c.pk>=AGST&&p.c.ago<=3});if(!S.length)return '';
  var avg=S.reduce(function(a,p){return a+AGS[p.l.agua]},0)/S.length,n=S.length;
  var t=avg<=0.6?['Aclara rápido','ok','el agua ya estaba limpia 1–3 días tras mar fuerte']:avg<=1.5?['Se aclara a medias','mid','tomadilla 1–3 días tras mar fuerte']:['Aguanta turbia','bad','sigue tomada 1–3 días tras mar fuerte'];
  return '<p class="agsp"><span class="mvv '+(t[1]==='ok'?'ok':t[1]==='bad'?'bad':'n')+'">'+t[0]+'</span> '+t[2]+' · '+n+(n===1?' visita':' visitas')+'</p>';
}
function agByLevel(legsArr){
  var R={};
  legsArr.forEach(function(l){if(!l.agua)return;var I=agInfer(l),r=R[l.agua]||(R[l.agua]={v:0,h:0,s:0,n:0,withH:0});r.v++;if(I.h&&I.any){r.h+=I.h;r.s+=I.sargo;r.n+=I.n;r.withH++}});
  return R;
}
function agLevelBars(R,unit){
  var mx=0;AGL.forEach(function(q){var r=R[q[0]];if(r&&r.h>0)mx=Math.max(mx,r.s/r.h)});
  return AGL.filter(function(q){return R[q[0]]}).map(function(q){
    var r=R[q[0]],rt=r.h>0?r.s/r.h:null;
    return '<div class="agbar"><span class="agn"><i style="background:'+agColor(q[0])+'"></i>'+q[1]+'</span><span class="agtr"><u style="width:'+(rt!=null&&mx>0?Math.max(6,Math.round(rt/mx*100)):0)+'%;background:'+agColor(q[0])+'"></u></span><span class="agv">'+(rt!=null?num(rt,1)+' sargos/h':'sin horas')+' · '+r.v+(r.v===1?' visita':' visitas')+'</span></div>';
  }).join('');
}
function agCard(s){
  var P=agPoints(s),h='<div class="sect"><h2>Agua y mar de fondo</h2><span>'+P.length+(P.length===1?' visita':' visitas')+' con agua apuntada</span></div>';
  if(!P.length)return h+'<p class="hint">Aún no has apuntado el color del agua en este spot. Apúntalo en cada visita (1 toque) y aquí verás en cuántos días se aclara después de un temporal y con qué agua pescas más.</p>';
  var strip=agStrip(P),sp=agSpeed(P),calm=P.filter(function(p){return !(p.c.known&&p.c.pk>=AGST)});
  var lv=agLevelBars(agByLevel(P.map(function(p){return p.l})));
  var calmTxt=calm.length?'<p class="hint">Sin temporal reciente (o sin dato del mar): '+calm.map(function(p){var d=dparts(p.l.date);return d.d+' '+esc(d.m)+' → '+esc(agName(p.l.agua))}).join(' · ')+'</p>':'';
  return h+'<div class="agcard">'+sp+strip+calmTxt+(lv?'<h4>Con qué agua pescas más aquí</h4>'+lv:'')+'</div>';
}
var _oss55=openSpotSheet;
openSpotSheet=function(id){
  _oss55(id);
  var s=spots.filter(function(x){return x.id===id})[0],body=document.getElementById('sheetbody');if(!s||!body||body.querySelector('.agcard,.agwrap'))return;
  var html='<div class="agwrap">'+agCard(s)+'</div>',m=body.querySelector('.mvl,.mvnext');
  var host=body.querySelector('.mvl');
  if(host)host.insertAdjacentHTML('beforebegin',html);else body.insertAdjacentHTML('beforeend',html);
};
/* ----- Plan: agua probable por spot y mar de fondo del día ----- */
function agPredict(s,iso){
  var ctx=agStorm(iso,null);if(!ctx.known)return {none:'sin historial del mar de los días previos'};
  var P=agPoints(s).filter(function(p){return p.c.known});
  var near=P.filter(function(p){
    if(ctx.pk<AGST)return p.c.pk<AGST;
    return p.c.pk>=AGST&&Math.abs(p.c.pk-ctx.pk)<=1.2&&Math.abs(p.c.ago-ctx.ago)<=1;
  });
  if(!near.length)return {none:'sin visitas tuyas con un mar parecido',ctx:ctx};
  var avg=near.reduce(function(a,p){return a+AGS[p.l.agua]},0)/near.length,lvl=AGL[Math.max(0,Math.min(3,Math.round(avg)))][0];
  return {agua:lvl,n:near.length,ctx:ctx,ex:near[0]};
}
function agLine(s,P){
  var r=agPredict(s,P.iso);
  if(r.none)return '<small class="agl">💧 Agua: '+esc(r.none)+'</small>';
  var c=r.ctx,why=c.pk>=AGST?(c.ago===0?'temporal hoy':c.ago+(c.ago===1?' día':' días')+' tras '+num(c.pk)+' m'):'sin temporal reciente';
  return '<small class="agl"><i class="agdot s" style="background:'+agColor(r.agua)+'"></i>Agua probable: <b>'+esc(agName(r.agua))+'</b> · '+esc(why)+' · según '+r.n+(r.n===1?' visita parecida':' visitas parecidas')+'</small>';
}
function agDayCard(iso){
  var c=agStorm(iso,null);
  if(!c.known)return '<div class="agday"><b>💧 Mar de fondo</b><span class="hint">Sin previsión guardada de los 3 días previos: no puedo decir cuánto hace del último temporal.</span></div>';
  var t=c.pk>=AGST?'Pico de <b>'+num(c.pk)+' m</b> '+(c.ago===0?'hoy':'hace <b>'+c.ago+(c.ago===1?' día':' días')+'</b>')+(c.ago>=2?' · el agua suele estar aclarando':c.ago===1?' · agua probablemente aún tomada':' · agua revuelta'):'Sin mar fuerte en los últimos 3 días (máx. '+num(c.pk)+' m)';
  return '<div class="agday"><b>💧 Mar de fondo</b><span>'+t+'</span></div>';
}
function agIdeal(){
  var R=agByLevel(legs),keys=Object.keys(R);if(!keys.length)return '';
  var bars=agLevelBars(R);
  return '<section class="card agideal"><div class="hd"><b>Tu agua según tus salidas</b><span class="hint">todas tus visitas con el agua apuntada</span></div>'+bars+'</section>';
}
var _rh55=renderHoy;
renderHoy=function(){
  var h=_rh55();
  try{
    var fut=fcFuture();if(!fut.length)return h;
    var iso=(day&&fut.some(function(f){return f.date===day}))?day:fut[0].date,add=agDayCard(iso)+agIdeal(),k='<div class="sect"><h2>Sitios</h2>',i=h.indexOf(k);
    if(i>-1)h=h.slice(0,i)+add+h.slice(i);
  }catch(e){}
  return h;
};
/* ----- editor de la salida: chips en cada spot ----- */
var _sh55=stopHTML;
stopHTML=function(s,i){
  var h=_sh55(s,i),k='<label>Cómo estaba la marea</label>',a=h.indexOf(k);
  if(a<0||!s.id)return h;
  var e=h.indexOf('</div></div>',a);if(e<0)return h;e+=12;
  var l=Object.assign({},s,{date:tripDraft&&tripDraft.date,stopId:s.id});
  return h.slice(0,e)+agBlock(s.id,l)+h.slice(e);
};
/* ----- salida en curso: agua ahora (1 toque) ----- */
var _lch55=lvConsoleHTML;
lvConsoleHTML=function(){
  var h=_lch55(),ev=((SESS&&SESS.events)||[]).filter(function(e){return e&&e.type==='agua'}),cur=ev.length?ev[ev.length-1].v:null;
  var blk='<div class="block"><h3>💧 Agua ahora</h3>'+'<div class="agc" role="group" aria-label="Color del agua">'+AGL.map(function(q){return '<button type="button" class="ag '+q[0]+(cur===q[0]?' on':'')+'" data-a="lv-agua" data-v="'+q[0]+'" aria-pressed="'+(cur===q[0])+'"><i></i>'+q[1]+'</button>'}).join('')+'</div><p class="hint">Tómalo con la mirada al llegar; si cambia, vuelve a tocar.</p></div>';
  var k='<div class="block"><h3>Cronómetro',i=h.indexOf(k);
  return i<0?h+blk:h.slice(0,i)+blk+h.slice(i);
};
var _ler55=lvEvRow;
lvEvRow=function(e){
  if(e&&e.type==='agua'){return '<div class="qcrow"><time>'+(e.noTime?'·':esc(lvHM(e.t)))+'</time><span class="evi">💧</span><div class="qcm"><b>Agua '+esc(agName(e.v).toLowerCase())+'</b></div></div>'}
  return _ler55(e);
};
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a="ag-set"],[data-a="lv-agua"]'):null;if(!b)return;
  ev.stopPropagation();ev.preventDefault();
  var a=b.getAttribute('data-a'),v=b.getAttribute('data-v');
  if(a==='lv-agua'){
    if(!SESS)return;lvEv({type:'agua',v:v});
    var host=document.getElementById('sessbody');if(host)host.innerHTML=lvConsoleHTML();return;
  }
  var sid=b.getAttribute('data-sid'),cur=(AG[sid]||{}).agua||(agOf({stopId:sid}).agua),nv=cur===v?null:v;
  /* si el agua venía del directo, un toque a mano manda sobre ella */
  agWrite(sid,{agua:nv});
  var row=b.parentNode;[].forEach.call(row.querySelectorAll('.ag'),function(x){var on=x===b&&nv===v;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)});
  if(nv===null&&AG[sid]===undefined){/* sin dato propio: nada más que hacer */}
},true);
document.addEventListener('change',function(ev){
  var t=ev.target;if(!t||!t.getAttribute||!t.getAttribute('data-agf'))return;
  var k=t.getAttribute('data-agf'),sid=t.getAttribute('data-sid'),raw=String(t.value).replace(',','.').trim(),n=raw===''?null:parseFloat(raw),p={};
  p[k]=n==null||isNaN(n)?null:n;agWrite(sid,p);
},true);
(function(){var s=document.createElement('style');s.textContent=
'.agc{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:6px 0}.agc.sm{margin:4px 0}'+
'.ag{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 2px;border-radius:12px;border:1px solid var(--line,#ffffff1f);background:var(--surface2,#ffffff0d);color:inherit;font:600 12px/1.1 var(--sans,inherit);min-height:52px}'+
'.ag i{width:22px;height:22px;border-radius:50%;display:block;border:2px solid #ffffff44}.ag.cristal i{background:#7fd6ff}.ag.tomadilla i{background:#d9c46a}.ag.tomada i{background:#b98a4a}.ag.chocolate i{background:#7a4a28}'+
'.ag.on{border-color:#fff;background:#ffffff1f;box-shadow:0 0 0 2px #ffffff55 inset}.ag.on i{border-color:#fff}'+
'.agd{margin:4px 0 0}.agd summary{font-size:.78rem;color:var(--muted);cursor:pointer}.mva{margin-top:10px;border-top:1px dashed var(--line,#ffffff22);padding-top:8px}'+
'.agcard{border:1px solid var(--line,#ffffff1f);border-radius:14px;padding:12px;background:var(--card,#ffffff08);margin:8px 0 16px}.agcard h4{margin:12px 0 6px;font-size:.85rem}'+
'.agsp{margin:0 0 8px;font-size:.9rem}.agstrip{margin:6px 0}.agcols{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-top:6px}.agcol{display:flex;flex-direction:column;align-items:center;border-left:1px solid #ffffff14;min-height:48px}.agcol:first-child{border-left:0}'+
'.agdots{display:flex;flex-wrap:wrap;justify-content:center;gap:4px;min-height:30px;padding:2px}.agdot{width:28px;height:28px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:#111;font-size:.68rem;border:2px solid #ffffff55}.agdot.s{width:10px;height:10px;display:inline-block;margin-right:6px;vertical-align:middle}'+
'.agcol small{font-size:.72rem;color:var(--muted)}.agbar{display:grid;grid-template-columns:96px 1fr;grid-template-areas:"n t" "v v";gap:2px 8px;align-items:center;margin:6px 0}.agn{grid-area:n;display:flex;align-items:center;gap:6px;font-size:.82rem;font-weight:600}.agn i{width:12px;height:12px;border-radius:50%;display:inline-block}'+
'.agtr{grid-area:t;height:10px;background:#ffffff12;border-radius:6px;overflow:hidden}.agtr u{display:block;height:100%;border-radius:6px;text-decoration:none}.agv{grid-area:v;font-size:.76rem;color:var(--muted)}'+
'.agday{display:flex;flex-direction:column;gap:2px;border-radius:14px;padding:10px 12px;margin:10px 0;background:#3fd0c914;border:1px solid #3fd0c944;font-size:.9rem}.agideal{margin:10px 0}.agideal .hd{display:flex;flex-direction:column;gap:2px;margin-bottom:8px}.agl{color:var(--muted);font-size:.8rem;line-height:1.35}';
document.head.appendChild(s)})();
