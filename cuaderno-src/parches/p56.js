/* ===== p56: El maestro — libro de hipótesis contrastadas con tus datos, consejo del Plan, avisos en directo ===== */
var HYP={}; /* hipotesis/<id> = {id,probar:true} */
(function(){var tm=setInterval(function(){
  if(typeof db==='undefined'||!db)return;clearInterval(tm);
  db.collection('hipotesis').onSnapshot(function(s){HYP={};s.docs.forEach(function(d){var o=JSON.parse(JSON.stringify(d.data()||{}));HYP[o.id||d.id]=o});try{if(tab==='hoy'&&!tripDraft)refresh()}catch(e){}},function(){});
},300)})();

/* visitas con horas: la base de toda comparación */
function mdVisits(){
  return legs.filter(function(l){return agHours(l)!=null}).map(function(l){return {l:l,I:agInfer(l),c:agCtx(l)}});
}
function mdSun(l){
  try{var d=dateOf(l.date),r=sunUT(d,true),s=sunUT(d,false),a=isoMs(l.date+'T'+l.tFrom),b=isoMs(l.date+'T'+l.tTo);if(b<a)b+=86400000;if(r==null||s==null||isNaN(a))return null;
    var H=3600000,ov=function(x,y){return a<y&&b>x};return ov(r-H,r+1.5*H)||ov(s-1.5*H,s+H)}catch(e){return null}
}
var MDH=[
 {id:'barro',txt:'Con agua chocolate (barro total) se pesca mal.',src:'Foro de pesca (varios pescadores coinciden)',unit:'sargos/h',better:'higher',
  la:'Tomadilla o tomada',lb:'Chocolate',side:function(v){var a=v.l.agua;return !a?null:a==='chocolate'?'B':(a==='tomadilla'||a==='tomada')?'A':null},num:function(v){return v.I.sargo},den:function(v){return v.I.h}},
 {id:'tomadilla',txt:'El agua tomadilla rinde más que el agua cristal.',src:'Tu experiencia (Jon)',unit:'sargos/h',better:'higher',
  la:'Tomadilla',lb:'Cristal',side:function(v){var a=v.l.agua;return a==='tomadilla'?'A':a==='cristal'?'B':null},num:function(v){return v.I.sargo},den:function(v){return v.I.h}},
 {id:'temporal',txt:'Rinde más 1–3 días después de un temporal que sin mar fuerte.',src:'Tu experiencia + blogs de pesca',unit:'sargos/h',better:'higher',
  la:'1–3 días tras ≥'+AGST+' m',lb:'Sin temporal',side:function(v){var c=v.c;if(!c.known||c.pk==null)return null;return c.pk>=AGST&&c.ago>=1&&c.ago<=3?'A':c.pk<AGST?'B':null},num:function(v){return v.I.sargo},den:function(v){return v.I.h}},
 {id:'sube',txt:'El sargo está más activo con la marea subiendo.',src:'Blog Asturpeskin',unit:'sargos/h',better:'higher',
  la:'Marea subiendo',lb:'Marea bajando',side:function(v){var a=v.l.hA,b=v.l.hB;if(a==null||b==null)return null;return b>a+0.2?'A':b<a-0.2?'B':null},num:function(v){return v.I.sargo},den:function(v){return v.I.h}},
 {id:'alba',txt:'Amanecer y ocaso son las horas buenas.',src:'Blog Asturpeskin',unit:'sargos/h',better:'higher',
  la:'Cerca del alba u ocaso',lb:'A otras horas',side:function(v){var r=mdSun(v.l);return r==null?null:r?'A':'B'},num:function(v){return v.I.sargo},den:function(v){return v.I.h}},
 {id:'bogas',txt:'Cuando entran bogas, la pesca de sargo se hunde.',src:'Vídeo que viste (sin verificar)',unit:'sargos/h',better:'higher',
  la:'Sin bogas',lb:'Con bogas',side:function(v){return v.I.any?(v.I.bogas?'B':'A'):null},num:function(v){return v.I.sargo},den:function(v){return v.I.h}},
 {id:'cangrejo',txt:'El cangrejo como cebo aleja a las bogas.',src:'Lo has oído (sin verificar)',unit:'de bogas',better:'lower',pct:true,
  la:'Con cangrejo',lb:'Con otro cebo',side:function(v){if(!v.I.any)return null;var b=(v.l.baits||[]).join(' ');return !b?null:/cangrejo/i.test(b)?'A':'B'},num:function(v){return v.I.boga},den:function(v){return v.I.n}}
];
function mdEval(H){
  var S={A:{v:0,n:0,d:0},B:{v:0,n:0,d:0}};
  mdVisits().forEach(function(v){var k=H.side(v);if(!k)return;var d=H.den(v);if(!(d>0))return;S[k].v++;S[k].n+=H.num(v);S[k].d+=d});
  var ra=S.A.d>0?S.A.n/S.A.d:null,rb=S.B.d>0?S.B.n/S.B.d:null;
  var o={A:S.A,B:S.B,ra:ra,rb:rb,st:'nd'};
  if(S.A.v<2||S.B.v<2||ra==null||rb==null)return o;
  var m=(ra+rb)/2,d=m>0?(ra-rb)/m:0;
  if(Math.abs(d)<0.3){o.st='eq';return o}
  o.st=((d>0)===(H.better==='higher'))?'ok':'bad';
  return o;
}
function mdFmt(H,r){return r==null?'—':H.pct?Math.round(r*100)+' %':num(r,1)}
function mdRow(H){
  var E=mdEval(H),on=!!(HYP[H.id]&&HYP[H.id].probar);
  var chip={ok:['Tus datos lo confirman','ok'],bad:['Tus datos lo contradicen','bad'],eq:['Sin diferencia clara','am'],nd:['Faltan datos','nd']}[E.st];
  var nums=H.la+': <b>'+mdFmt(H,E.ra)+'</b> '+(E.ra!=null?H.unit:'')+' <small>('+E.A.v+(E.A.v===1?' salida':' salidas')+')</small> · '+H.lb+': <b>'+mdFmt(H,E.rb)+'</b> '+(E.rb!=null?H.unit:'')+' <small>('+E.B.v+(E.B.v===1?' salida':' salidas')+')</small>';
  var need=E.st==='nd'?'<small class="hint">Hacen falta al menos 2 salidas de cada tipo con horas apuntadas.</small>':'';
  return '<div class="mdh '+E.st+'"><div class="mdt"><b>'+esc(H.txt)+'</b><span class="mdc '+chip[1]+'">'+chip[0]+'</span></div><small class="mds">Fuente: '+esc(H.src)+'</small><p class="mdn">'+nums+'</p>'+need+
    '<button type="button" class="btn small'+(on?' primary':'')+'" data-a="md-probar" data-id="'+H.id+'" aria-pressed="'+on+'">'+(on?'🧪 Lo probaré en la próxima salida ✓':'🧪 Probar en la próxima salida')+'</button></div>';
}
function mdBook(){
  return '<div class="sect"><h2>🎓 El libro del maestro</h2><span>hipótesis, no verdades</span></div>'+
    '<p class="hint">Lo que cuentan pescadores y vídeos entra aquí como hipótesis. Solo cuenta como cierto cuando tus propias salidas lo confirman.</p>'+MDH.map(mdRow).join('');
}
/* ----- consejo del Plan ----- */
function mdDayShort(iso){var p=dparts(iso);return dayLabel(iso).slice(0,3)+' '+p.d}
function mdAdvice(){
  var fut=fcFuture().slice(0,9),C=[],avoid=[],R=agByLevel(legs),tot={s:0,h:0};
  Object.keys(R).forEach(function(k){tot.s+=R[k].s;tot.h+=R[k].h});var mean=tot.h>0?tot.s/tot.h:null;
  fut.forEach(function(f){
    var P=planFor(f.date);if(!P||P.none||!P.C)return;
    P.S.forEach(function(E){
      if(E.pending)return;
      var sm=smEval(E.s,P),sc=E.best?E.best.avg:0,why=[],pr=agPredict(E.s,f.date),bonus=0;
      if(sm.st==='rj'){if(E.M&&E.M.any||sm.txt)avoid.push({iso:f.date,E:E,txt:sm.txt});return}
      if(sm.st==='am')sc*=0.85;
      if(sm.st==='nd'){sc*=0.8;why.push('aún sin visitas valoradas aquí: puntuación genérica')}
      if(pr.agua&&mean){var r=R[pr.agua],rt=r&&r.h>0?r.s/r.h:null;if(rt!=null){if(rt>=mean*1.2){bonus=0.08;why.push('con ese tipo de agua es cuando más pescas')}else if(rt<=mean*0.6){bonus=-0.08;why.push('con ese tipo de agua sueles pescar poco')}}}
      C.push({iso:f.date,E:E,sc:sc+bonus,sm:sm,pr:pr,why:why});
    });
  });
  var best={};C.filter(function(c){return c.sc>=0.5&&c.E.best}).sort(function(a,b){return b.sc-a.sc}).forEach(function(c){if(!best[c.iso])best[c.iso]=c});
  var top=Object.keys(best).map(function(k){return best[k]}).sort(function(a,b){return b.sc-a.sc}).slice(0,3);
  var exp=C.filter(function(c){return c.sm.st==='ok'&&c.pr&&c.pr.none&&c.pr.ctx&&c.pr.ctx.pk>=AGST&&c.E.best}).sort(function(a,b){return b.sc-a.sc})[0];
  return {top:top,avoid:avoid,exp:exp};
}
function mdAdviceHTML(){
  var A;try{A=mdAdvice()}catch(e){return ''}
  if(!A.top.length&&!A.avoid.length&&!A.exp)return '';
  var rows=A.top.map(function(c,i){
    var b=c.E.best,parts=[mm(b.from)+'–'+mm(Math.min(b.to,1440)),pct(c.sc)+' %'];
    var l2=[];if(c.sm.st!=='nd')l2.push(c.sm.txt);
    var ag=c.pr&&c.pr.agua?'agua probable '+agName(c.pr.agua).toLowerCase()+' ('+(c.pr.ctx.pk>=AGST?(c.pr.ctx.ago===0?'temporal hoy':c.pr.ctx.ago+(c.pr.ctx.ago===1?' día':' días')+' tras '+num(c.pr.ctx.pk)+' m'):'sin temporal reciente')+')':'';
    if(ag)l2.push(ag);c.why.forEach(function(w){l2.push(w)});
    return '<button type="button" class="mdr" data-a="day" data-d="'+c.iso+'"><span class="mdn1">'+(i+1)+'</span><span><b>'+esc(mdDayShort(c.iso))+' · '+esc(c.E.s.name)+'</b><small>'+esc(parts.join(' · '))+'</small>'+(l2.length?'<small class="mdw">¿Por qué? '+esc(l2.join(' · '))+'</small>':'')+'</span></button>';
  }).join('');
  var av=A.avoid.sort(function(a,b){return a.iso<b.iso?-1:1}).slice(0,3).map(function(c){
    return '<button type="button" class="mdr bad" data-a="day" data-d="'+c.iso+'"><span class="mdn1">✕</span><span><b>No vayas a '+esc(c.E.s.name)+' · '+esc(mdDayShort(c.iso))+'</b><small class="mdw">⚠ '+esc(c.txt)+'</small></span></button>';
  }).join('');
  var ex='';
  if(A.exp){var c=A.exp,cx=c.pr.ctx;ex='<button type="button" class="mdr exp" data-a="day" data-d="'+c.iso+'"><span class="mdn1">🧪</span><span><b>Para que el maestro aprenda: '+esc(c.E.s.name)+' · '+esc(mdDayShort(c.iso))+'</b><small class="mdw">Nunca has ido ahí '+(cx.ago===0?'el día del temporal':cx.ago+(cx.ago===1?' día':' días')+' tras '+num(cx.pk)+' m')+'. Si vas, apunta el color del agua.</small></span></button>'}
  return '<section class="card mdadv"><div class="hd"><b>🎓 El maestro dice</b><span class="hint">con la previsión cargada y tus salidas</span></div>'+
    (rows?'<h4>Mejores opciones</h4>'+rows:'<p class="hint">Ningún día de la previsión llega a un buen plan con tu receta.</p>')+(av?'<h4>Mejor no ir</h4>'+av:'')+(ex?'<h4>Para probar</h4>'+ex:'')+
    '<small class="hint">Orienta, no decide. Cada «por qué» sale de tus visitas o de la previsión.</small></section>';
}
var _rh56=renderHoy;
renderHoy=function(){
  var h=_rh56();
  try{
    var fut=fcFuture();if(!fut.length||!spots.length)return h;
    var k='<div class="pdays">',i=h.indexOf(k);
    if(i>-1){var j=i+k.length,dep=1,re=/<div\b|<\/div>/g,m;re.lastIndex=j;while((m=re.exec(h))){if(m[0]==='</div>'){dep--;if(!dep){j=m.index+6;break}}else dep++}
      h=h.slice(0,j)+mdAdviceHTML()+h.slice(j)}
    h+=mdBook();
  }catch(e){}
  return h;
};
/* ----- en directo: hoy pruebas + aviso de bogas ----- */
function mdLiveBogas(){
  var b=0,n=0;sessMine().forEach(function(c){(c.items||[]).forEach(function(i){if(i.who||i.st==='esc')return;var q=i.n||1;n+=q;if(/boga/i.test(i.species))b+=q})});
  return {b:b,n:n,on:b>=3&&n&&b/n>=0.4};
}
var _lch56=lvConsoleHTML;
lvConsoleHTML=function(){
  var h=_lch56(),add='',act=MDH.filter(function(x){return HYP[x.id]&&HYP[x.id].probar});
  var B=mdLiveBogas();
  if(B.on){
    var did=((SESS&&SESS.events)||[]).filter(function(e){return e&&e.type==='boga'}).map(function(e){return e.v});
    add+='<div class="block mdalert"><h3>🐟 Están entrando bogas</h3><p class="hint">'+B.b+' de tus '+B.n+' peces. Lo que cuentan pescadores (sin verificar): cebo más duro como cangrejo, parar el engodo un rato o cambiar de spot. Toca lo que pruebes y luego verás si funcionó.</p><div class="mdbt">'+
      [['duro','Cebo duro / cangrejo'],['engodo','Paré el engodo'],['spot','Cambié de spot']].map(function(q){var on=did.indexOf(q[0])>-1;return '<button type="button" class="btn small'+(on?' primary':'')+'" data-a="lv-boga" data-v="'+q[0]+'" aria-pressed="'+on+'">'+(on?'✓ ':'')+q[1]+'</button>'}).join('')+'</div></div>';
  }
  if(act.length)add+='<div class="block"><h3>🧪 Hoy pruebas</h3>'+act.map(function(x){return '<p class="mdp"><b>'+esc(x.txt)+'</b><small class="hint"> Fíjate y apunta qué sientes.</small></p>'}).join('')+'</div>';
  if(!add)return h;
  var k='<div class="block"><h3>Cronómetro',i=h.indexOf(k);
  return i<0?h+add:h.slice(0,i)+add+h.slice(i);
};
var _ler56=lvEvRow;
lvEvRow=function(e){
  if(e&&e.type==='boga'){var t={duro:'Prueba cebo duro / cangrejo por las bogas',engodo:'Para el engodo por las bogas',spot:'Cambia de spot por las bogas'}[e.v]||'Bogas';return '<div class="qcrow"><time>'+(e.noTime?'·':esc(lvHM(e.t)))+'</time><span class="evi">🐟</span><div class="qcm"><b>'+esc(t)+'</b></div></div>'}
  return _ler56(e);
};
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a="lv-boga"],[data-a="md-probar"]'):null;if(!b)return;
  ev.stopPropagation();ev.preventDefault();
  var a=b.getAttribute('data-a'),v=b.getAttribute('data-v');
  if(a==='lv-boga'){
    if(!SESS)return;lvEv({type:'boga',v:v});var host=document.getElementById('sessbody');if(host)host.innerHTML=lvConsoleHTML();return;
  }
  var id=b.getAttribute('data-id'),on=!(HYP[id]&&HYP[id].probar);
  if(on){HYP[id]={id:id,probar:true,u:Date.now()};db.doc('hipotesis/'+id).set(HYP[id]).catch(function(){})}else{delete HYP[id];db.doc('hipotesis/'+id).delete().catch(function(){})}
  b.classList.toggle('primary',on);b.setAttribute('aria-pressed',on);b.textContent=on?'🧪 Lo probaré en la próxima salida ✓':'🧪 Probar en la próxima salida';
},true);
(function(){var s=document.createElement('style');s.textContent=
'.mdh{border:1px solid var(--line,#ffffff1f);border-radius:14px;padding:12px;background:var(--card,#ffffff08);margin:8px 0;display:flex;flex-direction:column;gap:6px}.mdh.ok{border-color:#1f6f4a99}.mdh.bad{border-color:#7a2f2f99}'+
'.mdt{display:flex;flex-direction:column;gap:6px}.mdt b{line-height:1.3}.mdc{align-self:flex-start;font-size:.74rem;font-weight:700;padding:3px 10px;border-radius:99px}.mdc.ok{background:#1f6f4a55;color:#7ee2a8}.mdc.bad{background:#7a2f2f55;color:#ff9f9f}.mdc.am{background:#f2b84b33;color:#f2b84b}.mdc.nd{background:#ffffff14;color:var(--muted)}'+
'.mds{color:var(--muted);font-size:.74rem}.mdn{margin:0;font-size:.85rem;line-height:1.45}.mdh .btn{align-self:flex-start;margin-top:2px}'+
'.mdadv h4{margin:12px 0 6px;font-size:.78rem;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}.mdadv .hd{display:flex;flex-direction:column;gap:2px;margin-bottom:4px}'+
'.mdr{display:flex;gap:10px;align-items:flex-start;text-align:left;width:100%;border:1px solid var(--line,#ffffff1f);background:var(--surface2,#ffffff0a);color:inherit;border-radius:12px;padding:9px 10px;margin:6px 0;font:inherit}'+
'.mdr span:last-child{display:flex;flex-direction:column;gap:2px;min-width:0}.mdr small{color:var(--muted);font-size:.8rem;line-height:1.35}.mdr .mdw{color:var(--text,#dfe7ee)}.mdn1{min-width:24px;height:24px;border-radius:50%;background:#3ddc9733;color:#3ddc97;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:.8rem}'+
'.mdr.bad{border-color:#7a2f2f88;background:#7a2f2f1c}.mdr.bad .mdn1{background:#7a2f2f66;color:#ff9f9f}.mdr.exp{border-color:#58a8ff66;background:#58a8ff14}.mdr.exp .mdn1{background:none}'+
'.mdalert{border:1px solid #f2b84b66;background:#f2b84b12}.mdbt{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.mdp{margin:4px 0}';
document.head.appendChild(s)})();
