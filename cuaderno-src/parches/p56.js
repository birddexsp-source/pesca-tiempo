/* ===== p56: El maestro — libro de hipótesis contrastadas con tus datos, consejo del Plan, avisos en directo ===== */
var HYP={}; /* hipotesis/<id> = {id,probar:true} */
(function(){var tm=setInterval(function(){
  if(typeof db==='undefined'||!db)return;clearInterval(tm);
  db.collection('hipotesis').onSnapshot(function(s){HYP={};s.docs.forEach(function(d){var o=JSON.parse(JSON.stringify(d.data()||{}));HYP[o.id||d.id]=o});try{if(tab==='hoy'&&!tripDraft)refresh()}catch(e){}},function(){});
},300)})();

/* visitas con horas o con agua apuntada: la base de toda comparación (se calcula una vez por cambio de datos) */
var MDC={k:'',v:null};
function mdKey(){var u=0;Object.keys(AG).forEach(function(k){u+=AG[k].u||0});return [legs.length,catches.length,trips.length,Object.keys(AG).length,u,(typeof MAR!=='undefined'&&MAR.at)||0].join('|')}
function mdVisits(){
  var k=mdKey();if(MDC.k===k&&MDC.v)return MDC.v;
  MDC={k:k,v:legs.filter(function(l){return agHours(l)!=null||l.agua}).map(function(l){return {l:l,I:agInfer(l),c:agCtx(l)}})};
  return MDC.v;
}
function mdSun(l){
  try{var d=dateOf(l.date),r=sunUT(d,true),s=sunUT(d,false),a=isoMs(l.date+'T'+l.tFrom),b=isoMs(l.date+'T'+l.tTo);if(b<a)b+=86400000;if(r==null||s==null||isNaN(a))return null;
    var H=3600000,ov=function(x,y){return a<y&&b>x};return ov(r-H,r+1.5*H)||ov(s-1.5*H,s+H)}catch(e){return null}
}
function mdSargoH(v){return v.I.sargo}
function mdHours(v){return v.I.h}
var MDCAT=[['agua','Agua, mar y viento'],['hora','Hora, marea y luna'],['cebo','Cebo y bogas']];
var MDH=[
 {id:'barro',cat:'agua',txt:'Con agua chocolate (barro total) se pesca mal.',src:'Foro de pesca (varios pescadores coinciden)',unit:'sargos/h',better:'higher',
  la:'Tomadilla o tomada',lb:'Chocolate',side:function(v){var a=v.l.agua;return !a?null:a==='chocolate'?'B':(a==='tomadilla'||a==='tomada')?'A':null},num:mdSargoH,den:mdHours},
 {id:'tomadilla',cat:'agua',txt:'El agua tomadilla rinde más que el agua cristal.',src:'Tu experiencia (Jon)',unit:'sargos/h',better:'higher',
  la:'Tomadilla',lb:'Cristal',side:function(v){var a=v.l.agua;return a==='tomadilla'?'A':a==='cristal'?'B':null},num:mdSargoH,den:mdHours},
 {id:'temporal',cat:'agua',txt:'Rinde más 1–3 días después de un temporal que sin mar fuerte.',src:'Tu experiencia + blogs de pesca',unit:'sargos/h',better:'higher',
  la:'1–3 días tras mar fuerte',lb:'Sin temporal',side:function(v){var c=v.c;if(!c.known||c.pk==null)return null;return c.pk>=AGST&&c.ago>=1&&c.ago<=3?'A':c.pk<AGST?'B':null},num:mdSargoH,den:mdHours},
 {id:'viento',cat:'agua',txt:'Con poco viento (menos de 12 kph) se pesca mejor.',src:'Sentido común de pescador (a comprobar)',unit:'sargos/h',better:'higher',
  la:'Menos de 12 kph',lb:'12 kph o más',side:function(v){var w=v.l.wind;if(w==null||w==='')return null;return +w<12?'A':'B'},num:mdSargoH,den:mdHours},
 {id:'sube',cat:'hora',txt:'El sargo está más activo con la marea subiendo.',src:'Blog Asturpeskin',unit:'sargos/h',better:'higher',
  la:'Marea subiendo',lb:'Marea bajando',side:function(v){var a=v.l.hA,b=v.l.hB;if(a==null||b==null)return null;return b>a+0.2?'A':b<a-0.2?'B':null},num:mdSargoH,den:mdHours},
 {id:'alba',cat:'hora',txt:'Amanecer y ocaso son las horas buenas.',src:'Blog Asturpeskin',unit:'sargos/h',better:'higher',
  la:'Cerca del alba u ocaso',lb:'A otras horas',side:function(v){var r=mdSun(v.l);return r==null?null:r?'A':'B'},num:mdSargoH,den:mdHours},
 {id:'luna',cat:'hora',txt:'Con luna llena y mar en calma el sargo come poco.',src:'Blog Asturpeskin',unit:'sargos/h',better:'lower',
  la:'Luna llena + calma',lb:'Otras lunas + calma',side:function(v){var w=v.l.wave;if(w==null||w===''||+w>=1.2||!v.l.date)return null;try{return moon(dateOf(v.l.date)).ill>=90?'A':'B'}catch(e){return null}},num:mdSargoH,den:mdHours},
 {id:'invierno',cat:'hora',txt:'En invierno el sargo baja a aguas más hondas y rinde menos desde roca.',src:'Il Giornale dei Marinai (hábitos del sargo)',unit:'sargos/h',better:'lower',
  la:'Dic–feb',lb:'Resto del año',side:function(v){var m=v.l.date?+v.l.date.slice(5,7):0;return !m?null:(m===12||m<=2)?'A':'B'},num:mdSargoH,den:mdHours},
 {id:'bogas',cat:'cebo',txt:'Cuando entran bogas, la pesca de sargo se hunde.',src:'Vídeo que viste (sin verificar)',unit:'sargos/h',better:'higher',
  la:'Sin bogas',lb:'Con bogas',side:function(v){return v.I.any?(v.I.bogas?'B':'A'):null},num:mdSargoH,den:mdHours},
 {id:'cangrejo',cat:'cebo',txt:'El cangrejo como cebo aleja a las bogas.',src:'Lo has oído (sin verificar)',unit:'de bogas',better:'lower',pct:true,
  la:'Con cangrejo',lb:'Con otro cebo',side:function(v){if(!v.I.any)return null;var b=(v.l.baits||[]).join(' ');return !b?null:/cangrejo/i.test(b)?'A':'B'},num:function(v){return v.I.boga},den:function(v){return v.I.n}},
 {id:'duro',cat:'cebo',txt:'Los cebos duros (mejillón, cangrejo) rinden más que la gamba.',src:'Il Giornale dei Marinai (el adulto come bivalvos y crustáceos)',unit:'sargos/h',better:'higher',
  la:'Mejillón o cangrejo',lb:'Gamba o langostino',side:function(v){var b=(v.l.baits||[]).join(' ');if(!b)return null;return /mejill|cangrej|erizo|lapa|navaja/i.test(b)?'A':/gamba|langostin/i.test(b)?'B':null},num:mdSargoH,den:mdHours}
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
var MDORD={ok:0,bad:1,eq:2,nd:3};
var MDCHIP={ok:['Lo confirman tus datos','ok'],bad:['Lo contradicen tus datos','bad'],eq:['Sin diferencia clara','am'],nd:['Faltan datos','nd']};
function mdBar(H,label,r,n,best,mx){
  return '<div class="mdb'+(best?' best':'')+'"><span class="mdbl">'+esc(label)+'</span><span class="mdbt2"><u style="width:'+(r!=null&&mx>0?Math.max(5,Math.round(r/mx*100)):0)+'%"></u></span><b>'+mdFmt(H,r)+'</b><small>'+n+(n===1?' salida':' salidas')+'</small></div>';
}
function mdRow(H,E){
  E=E||mdEval(H);
  var on=!!(HYP[H.id]&&HYP[H.id].probar),ch=MDCHIP[E.st],mx=Math.max(E.ra||0,E.rb||0);
  var good=H.pct?'lower':(H.id==='lluvia'?null:'higher'),hl=good&&E.ra!=null&&E.rb!=null&&E.ra!==E.rb,bestA=hl&&((E.ra>E.rb)===(good==='higher'));
  var cmp='<div class="mdcmp">'+mdBar(H,H.la,E.ra,E.A.v,hl&&bestA,mx)+mdBar(H,H.lb,E.rb,E.B.v,hl&&!bestA,mx)+'</div><p class="mdun">'+esc(H.unit)+'</p>';
  var need=E.st==='nd'?'<p class="hint mdneed">Hacen falta al menos 2 salidas de cada tipo '+(H.hours===false?'con el agua apuntada':'con horas apuntadas')+'. Hay '+E.A.v+' y '+E.B.v+'.</p>':'';
  return '<details class="mdh '+E.st+'"><summary><i class="mdd"></i><span class="mdq">'+esc(H.txt)+'</span><em class="mdc '+ch[1]+'">'+ch[0]+'</em></summary><div class="mdbody"><p class="mds">Fuente: '+esc(H.src)+'</p>'+cmp+need+
    '<button type="button" class="btn small'+(on?' primary':'')+'" data-a="md-probar" data-id="'+H.id+'" aria-pressed="'+on+'">'+(on?'🧪 Lo probaré en la próxima salida ✓':'🧪 Probar en la próxima salida')+'</button></div></details>';
}
function mdBook(){
  var ev=MDH.map(function(H){return {H:H,E:mdEval(H)}}),c={ok:0,bad:0};ev.forEach(function(x){if(c[x.E.st]!=null)c[x.E.st]++});
  var sub=MDH.length+' hipótesis'+(c.ok?' · '+c.ok+(c.ok===1?' confirmada':' confirmadas'):'')+(c.bad?' · '+c.bad+(c.bad===1?' contradicha':' contradichas'):'');
  var body=MDCAT.map(function(cat){
    var xs=ev.filter(function(x){return x.H.cat===cat[0]}).sort(function(a,b){return MDORD[a.E.st]-MDORD[b.E.st]});
    return xs.length?'<h4 class="eyebrow">'+cat[1]+'</h4>'+xs.map(function(x){return mdRow(x.H,x.E)}).join(''):'';
  }).join('');
  return '<details class="card mdbook"><summary><span class="mdbh"><b>🎓 Libro del maestro</b><small>'+sub+'</small></span></summary><p class="hint">Lo que cuentan pescadores y vídeos entra aquí como hipótesis. Solo cuenta como cierto cuando tus propias salidas lo confirman.</p>'+body+'</details>';
}
/* ----- consejo del Plan ----- */
function mdDayShort(iso){var p=dparts(iso);return dayLabel(iso).slice(0,3)+' '+p.d}
function mdUnits(P){
  /* un «sitio» = su grupo de spots; los spots sin sitio van cada uno por su cuenta */
  var out=[];
  P.G.forEach(function(G){
    if(G.onlyPending)return;
    if(G.site)out.push({name:G.name,site:G.site,spots:G.spots});
    else G.spots.forEach(function(E){if(!E.pending)out.push({name:E.s.name,site:null,spots:[E]})});
  });
  return out;
}
function mdSite(P,U){
  /* puntúa el sitio entero: en cada hora cuenta el mejor de sus spots aptos; ordena los spots por hora */
  var ok=[],rj=[],i;
  U.spots.forEach(function(E){
    if(E.pending)return;
    var sm=smEval(E.s,P);
    if(sm.st==='rj'){rj.push({E:E,txt:sm.txt});return}
    var k=sm.st==='am'?0.85:sm.st==='nd'?0.8:1;
    ok.push(Object.assign({},E,{v:E.v.map(function(x){return x==null?null:x*k}),orig:E,sm:sm}));
  });
  if(!ok.length)return {rj:rj,none:true};
  var v=P.C.map(function(c,j){var mx=null;ok.forEach(function(E){if(E.v[j]!=null&&(mx==null||E.v[j]>mx))mx=E.v[j]});return mx});
  var best=bestOf(winsOf(v,0.55,3));
  if(!best)return {rj:rj,ok:ok,none:true};
  var route=routeOf(ok,best).map(function(r){return {E:r.E.orig,sm:r.E.sm,from:r.from,to:r.to,avg:r.avg,sum:r.avg*(r.to-r.from)}});
  var lead=route.slice().sort(function(a,b){return b.sum-a.sum})[0];
  var open=ok.filter(function(E){var m=0;for(var j=best.a;j<best.b;j++)if(E.v[j]!=null&&E.v[j]>m)m=E.v[j];return m>=0.5}).map(function(E){return E.orig});
  return {rj:rj,ok:ok,best:best,route:route,lead:lead.E,sm:lead.sm,n:ok.length,open:open,total:ok.length+rj.length};
}
/* experiencia del sitio: hasta dónde has pescado (ola y viento) y hasta dónde no */
function mdMin(a,b){return a==null?b:b==null?a:Math.min(a,b)}
function mdMax(a,b){return a==null?b:b==null?a:Math.max(a,b)}
function mdSiteLearn(U){
  var X={okLo:null,okHi:null,tooHigh:null,windOk:null,windTooMuch:null,last:null};
  U.spots.forEach(function(E){
    var L=spotLearn(E.s);
    X.okLo=mdMin(X.okLo,L.okLo);X.okHi=mdMax(X.okHi,L.okHi);X.tooHigh=mdMin(X.tooHigh,L.tooHigh);
    X.windOk=mdMax(X.windOk,L.windOk);X.windTooMuch=mdMin(X.windTooMuch,L.windTooMuch);
    legsOfSpot(E.s.id).forEach(function(l){if(l.wave!=null&&l.wave!==''&&!isNaN(+l.wave)&&(!X.last||String(l.date)>String(X.last.date)))X.last=l});
  });
  return X;
}
function mdHyp(U,S,P){
  /* previsión de la jornada frente a lo que ya has probado en este sitio */
  var X=mdSiteLearn(U),b=S.best,out=[],W=P.C.slice(b.a,b.b),wv=[],dv=[];
  W.forEach(function(c){if(c.wave!=null)wv.push(c.wave);if(c.wind!=null)dv.push(c.wind)});
  if(!wv.length&&!dv.length)return out;
  var wlo=Math.min.apply(null,wv),whi=Math.max.apply(null,wv),dhi=Math.max.apply(null,dv),wr=Math.abs(whi-wlo)<0.1?num(whi):num(wlo)+'–'+num(whi);
  if(wv.length){
    if(X.okHi==null)out.push({st:'x',k:'ola',txt:'Aún no has valorado la ola en este sitio',act:'Apunta si había poca, perfecta o demasiada'});
    else if(X.tooHigh!=null&&whi>=X.tooHigh-0.05)out.push({st:'x',k:'ola',txt:'Ola de hasta '+num(whi)+' m: ya fue demasiado con '+num(X.tooHigh)+' m',act:'Entra solo en los tramos de menos mar'});
    else if(whi>X.okHi+0.15)out.push({st:'x',k:'ola',txt:'Ola de hasta '+num(whi)+' m: más de lo máximo que has pescado aquí ('+num(X.okHi)+' m)'+(X.tooHigh!=null?', y menos de '+num(X.tooHigh)+' m, donde ya fue demasiado':'; aún no sabes dónde está el límite'),act:'Ve a comprobar hasta dónde se puede y apunta cómo estaba el mar'});
    else if(X.okLo!=null&&whi<X.okLo-0.15)out.push({st:'x',k:'ola',txt:'Ola de solo '+num(whi)+' m: menos de lo que has pescado aquí (desde '+num(X.okLo)+' m)',act:'Comprueba si con tan poco mar merece la pena'});
    else out.push({st:'ok',k:'ola',txt:'Ola '+wr+' m: dentro de lo que ya has pescado aquí'});
  }
  if(dv.length){
    if(X.windTooMuch!=null&&dhi>=X.windTooMuch-1)out.push({st:'x',k:'viento',txt:'Viento de hasta '+num(dhi,0)+' kph: ya fue demasiado con '+num(X.windTooMuch,0),act:'Mejor las horas de menos viento'});
    else if(X.windOk==null)out.push({st:'x',k:'viento',txt:'Aún no has valorado el viento en este sitio',act:'Apunta si había poco, perfecto o demasiado'});
    else if(dhi>X.windOk+2)out.push({st:'x',k:'viento',txt:'Viento de hasta '+num(dhi,0)+' kph: más de lo que has aguantado aquí ('+num(X.windOk,0)+' kph)'+(X.windTooMuch!=null?', y menos de '+num(X.windTooMuch,0)+', donde ya fue demasiado':''),act:'Comprueba hasta cuánto viento se puede pescar'});
    else out.push({st:'ok',k:'viento',txt:'Viento de hasta '+num(dhi,0)+' kph: dentro de lo que ya has pescado aquí'});
  }
  if(X.last&&wv.length){
    var lw=+X.last.wave,mid=(wlo+whi)/2;
    if(Math.abs(mid-lw)>=0.3)out.push({st:'x',k:'mar',txt:(mid>lw?'Más':'Menos')+' mar que la última vez ('+num(lw)+' → '+num(mid)+' m)',act:'Compara cómo pica con cada mar'});
  }
  return out;
}
function mdAdvice(){
  var fut=fcFuture().slice(0,9),C=[],avoid=[],R=agByLevel(legs),tot={s:0,h:0};
  Object.keys(R).forEach(function(k){tot.s+=R[k].s;tot.h+=R[k].h});var mean=tot.h>0?tot.s/tot.h:null;
  fut.forEach(function(f){
    var P=planFor(f.date);if(!P||P.none||!P.C)return;
    mdUnits(P).forEach(function(U){
      var S=mdSite(P,U);
      if((S.none||S.best.avg<0.5)&&S.rj.length)avoid.push({iso:f.date,name:U.name,site:U.site,E:S.rj[0].E,txt:(U.spots.length>1?S.rj[0].E.s.name+': ':'')+S.rj[0].txt,n:S.rj.length});
      if(S.none)return;
      var sc=S.best.avg,why=[],pr=agPredict(S.lead.s,f.date),bonus=0;
      if(pr.agua&&mean){var r=R[pr.agua],rt=r&&r.h>0?r.s/r.h:null;if(rt!=null){if(rt>=mean*1.2){bonus=0.08;why.push('con ese tipo de agua es cuando más pescas')}else if(rt<=mean*0.6){bonus=-0.08;why.push('con ese tipo de agua sueles pescar menos')}}}
      var hy=mdHyp(U,S,P),hrs=(S.best.to-S.best.from)/60,op=S.open.length;
      var rk=(sc+bonus)*(0.7+0.3*Math.min(1,op/3))*(0.8+0.2*Math.min(1,hrs/6));
      C.push({iso:f.date,name:U.name,site:U.site,E:S.lead,best:S.best,route:S.route,rj:S.rj,n:S.n,open:S.open,total:S.total,hrs:hrs,hyp:hy,rk:rk,sc:sc+bonus,sm:S.sm,pr:pr,why:why});
    });
  });
  var best={};C.filter(function(c){return c.sc>=0.5}).sort(function(a,b){return b.rk-a.rk}).forEach(function(c){if(!best[c.iso])best[c.iso]=c});
  var top=Object.keys(best).map(function(k){return best[k]}).sort(function(a,b){return b.rk-a.rk}).slice(0,3);
  var exp=C.filter(function(c){return c.sm.st==='ok'&&c.pr&&c.pr.none&&c.pr.ctx&&c.pr.ctx.pk>=AGST}).sort(function(a,b){return b.sc-a.sc})[0];
  return {top:top,avoid:avoid,exp:exp};
}
function mdSpotsTxt(c){return c.open.length+' de '+c.total+(c.total===1?' spot':' spots')}
function mdHypItems(c){return (c.hyp||[]).map(function(h){return h.st==='ok'?['ok',h.txt]:['warn','🧪 '+h.txt+'. '+h.act]})}
/* recorrido del sitio: «Empieza en A → luego B» (cada tramo con su hora) */
function mdRouteTxt(c){
  var r=c.route||[];if(!r.length)return '';
  if(r.length===1)return 'Quédate en '+r[0].E.s.name+' toda la sesión';
  return r.map(function(x,i){return (i?'luego ':'empieza en ')+x.E.s.name+' '+mm(x.from)+'–'+mm(Math.min(x.to,1440))}).join(' → ');
}
function mdWhyList(items){return items.length?'<ul class="mdwhy">'+items.map(function(x){return '<li class="'+x[0]+'">'+esc(x[1])+'</li>'}).join('')+'</ul>':''}
function mdAdviceHTML(){
  var A;try{A=mdAdvice()}catch(e){return ''}
  if(!A.top.length&&!A.avoid.length&&!A.exp)return '';
  var rows=A.top.map(function(c,i){
    var b=c.best,w=mdHypItems(c);
    if(c.sm.st==='ok'||c.sm.st==='am')w.push([c.sm.st==='ok'?'ok':'warn',c.sm.txt]);
    if(c.pr&&c.pr.agua)w.push(['ok','Agua probable '+agName(c.pr.agua).toLowerCase()+' ('+(c.pr.ctx.pk>=AGST?(c.pr.ctx.ago===0?'temporal hoy':c.pr.ctx.ago+(c.pr.ctx.ago===1?' día':' días')+' tras '+num(c.pr.ctx.pk)+' m'):'sin temporal reciente')+')']);
    c.why.forEach(function(x){w.push([/genérica/.test(x)?'warn':'ok',x.charAt(0).toUpperCase()+x.slice(1)])});
    (c.route||[]).filter(function(x,j,a){return x.sm.st==='nd'&&a.indexOf(x)===j}).forEach(function(x){w.push(['warn',x.E.s.name+': aún sin visitas valoradas, puntuación genérica'])});
    (c.rj||[]).forEach(function(x){w.push(['no','No cuentes con '+x.E.s.name+': '+x.txt])});
    return '<button type="button" class="mdr" data-a="day" data-d="'+c.iso+'"><span class="mdn1">'+(i+1)+'</span><span class="mdr2"><span class="mdr1"><b>'+esc(mdDayShort(c.iso))+' · '+esc(c.name)+'</b><em>'+esc(mdSpotsTxt(c))+'</em></span><small>'+mm(b.from)+'–'+mm(Math.min(b.to,1440))+' · '+num(c.hrs,0)+' h de jornada</small>'+(c.route&&c.route.length?'<span class="mdrt">📍 '+esc(mdRouteTxt(c).charAt(0).toUpperCase()+mdRouteTxt(c).slice(1))+'</span>':'')+mdWhyList(w)+'</span></button>';
  }).join('');
  var av=A.avoid.sort(function(a,b){return a.iso<b.iso?-1:1}).slice(0,3).map(function(c){
    return '<button type="button" class="mdr bad" data-a="day" data-d="'+c.iso+'"><span class="mdn1">✕</span><span class="mdr2"><span class="mdr1"><b>'+esc(c.name)+' · '+esc(mdDayShort(c.iso))+'</b></span>'+mdWhyList([['no',c.txt]])+'</span></button>';
  }).join('');
  var ex='';
  if(A.exp){var c=A.exp,cx=c.pr.ctx;ex='<button type="button" class="mdr exp" data-a="day" data-d="'+c.iso+'"><span class="mdn1">🧪</span><span class="mdr2"><span class="mdr1"><b>'+esc(c.name)+' · '+esc(mdDayShort(c.iso))+'</b></span>'+mdWhyList([['ok','Nunca has ido ahí '+(cx.ago===0?'el día del temporal':cx.ago+(cx.ago===1?' día':' días')+' tras '+num(cx.pk)+' m')],['ok','Si vas, apunta el color del agua: así el maestro aprende']])+'</span></button>'}
  return '<section class="card mdadv"><div class="hd"><b>🎓 El maestro dice</b><span class="hint">con tu previsión y tus salidas</span></div>'+
    (rows?'<h4 class="eyebrow">Mejores opciones</h4>'+rows:'<p class="hint">Ningún día de la previsión llega a un buen plan con tu receta.</p>')+(av?'<h4 class="eyebrow">Mejor no ir</h4>'+av:'')+(ex?'<h4 class="eyebrow">Para probar</h4>'+ex:'')+
    '<p class="hint mdfoot">Orienta, no decide. Cada motivo sale de tus visitas o de la previsión.</p></section>';
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
'.mdrt{display:block;margin:4px 0 2px;font:600 12.5px var(--body);color:var(--tide)}'+
'.mdadv .hd,.agday .hd{display:flex;flex-direction:column;gap:2px;margin-bottom:6px}.mdadv .hd b,.agday .hd b,.mdbh b{font:700 16px/1.2 var(--display)}'+
'.mdadv h4.eyebrow,.mdbook h4.eyebrow{margin:14px 0 6px}.mdfoot{margin:10px 0 0}'+
'.mdr{display:flex;gap:10px;align-items:flex-start;text-align:left;width:100%;border:1px solid var(--line);background:var(--surface2);color:var(--ink);border-radius:14px;padding:10px 12px;margin:6px 0;font:inherit}'+
'.mdr2{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1}.mdr1{display:flex;justify-content:space-between;gap:8px;align-items:baseline}.mdr1 b{font:600 15px/1.25 var(--body)}.mdr1 em{font:700 13px var(--mono);font-style:normal;color:var(--ok)}.mdr small{color:var(--muted);font:600 12px var(--mono)}'+
'.mdn1{flex:none;width:24px;height:24px;border-radius:50%;background:var(--accent-soft);color:var(--accent);display:inline-flex;align-items:center;justify-content:center;font:700 12px var(--mono)}'+
'.mdwhy{list-style:none;margin:2px 0 0;padding:0;display:flex;flex-direction:column;gap:3px}.mdwhy li{position:relative;padding-left:16px;font-size:12.5px;line-height:1.35;color:var(--muted)}.mdwhy li:before{content:"✓";position:absolute;left:0;color:var(--ok);font-weight:700}.mdwhy li.warn:before{content:"!";color:var(--near)}.mdwhy li.no:before{content:"✕";color:var(--no)}.mdwhy li.no{color:var(--ink)}'+
'.mdr.bad{border-color:rgba(255,122,107,.4);background:rgba(255,122,107,.07)}.mdr.bad .mdn1{background:rgba(255,122,107,.18);color:var(--no)}.mdr.exp{border-color:rgba(88,168,255,.4);background:var(--wave-soft)}.mdr.exp .mdn1{background:none;font-size:16px}'+
'.mdbook{padding:0;margin:14px 0}.mdbook>summary{list-style:none;cursor:pointer;padding:14px 16px;display:flex;align-items:center;justify-content:space-between}.mdbook>summary::-webkit-details-marker{display:none}.mdbook>summary:after{content:"›";font-size:22px;color:var(--muted);transform:rotate(90deg);transition:transform .2s}.mdbook[open]>summary:after{transform:rotate(-90deg)}'+
'.mdbh{display:flex;flex-direction:column;gap:3px}.mdbh small{color:var(--muted);font-size:12.5px}.mdbook>.hint,.mdbook>.eyebrow,.mdbook>.mdh{margin-left:16px;margin-right:16px}.mdbook>.hint{margin-top:0}.mdbook>:last-child{margin-bottom:16px}'+
'.mdh{border-top:1px solid var(--line)}.mdh>summary{list-style:none;cursor:pointer;display:grid;grid-template-columns:10px 1fr;gap:4px 10px;align-items:start;padding:11px 0}.mdh>summary::-webkit-details-marker{display:none}'+
'.mdd{width:9px;height:9px;border-radius:50%;margin-top:6px;background:var(--none)}.mdh.ok .mdd{background:var(--ok)}.mdh.bad .mdd{background:var(--no)}.mdh.eq .mdd{background:var(--near)}'+
'.mdq{font:600 14px/1.35 var(--body)}.mdc{grid-column:2;justify-self:start;font:700 11px var(--mono);font-style:normal;padding:3px 9px;border-radius:99px;letter-spacing:.02em}.mdc.ok{background:rgba(61,220,151,.16);color:var(--ok)}.mdc.bad{background:rgba(255,122,107,.16);color:var(--no)}.mdc.am{background:rgba(242,184,75,.16);color:var(--near)}.mdc.nd{background:var(--surface2);color:var(--muted)}'+
'.mdbody{padding:0 0 14px 20px;display:flex;flex-direction:column;gap:8px}.mds{margin:0;color:var(--muted);font-size:12px}.mdun{margin:0;color:var(--dim);font:600 11px var(--mono)}.mdneed{margin:0}.mdbody .btn{align-self:flex-start}'+
'.mdcmp{display:flex;flex-direction:column;gap:7px}.mdb{display:grid;grid-template-columns:104px 1fr 52px;grid-template-areas:"l t v" "l t n";gap:0 8px;align-items:center}.mdbl{grid-area:l;font-size:12.5px;line-height:1.25}.mdbt2{grid-area:t;height:8px;background:var(--surface2);border-radius:6px;overflow:hidden}.mdbt2 u{display:block;height:100%;background:var(--none);border-radius:6px}.mdb.best .mdbt2 u{background:var(--ok)}.mdb b{grid-area:v;text-align:right;font:700 13px var(--mono)}.mdb small{grid-area:n;text-align:right;color:var(--dim);font-size:11px}'+
'.mdalert{border-color:rgba(242,184,75,.4);background:rgba(242,184,75,.08)}.mdbt{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.mdp{margin:4px 0}';
document.head.appendChild(s)})();
