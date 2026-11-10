/* ===== p63: Motor de patrones + informe «Qué aprendimos» tras cada salida =====
   Parte de tus visitas con horas (peces/h), las describe (agua, mar previo, ola, viento, franja, marea, luna, lluvia, cebo, spot)
   y compara cada categoría con el resto. Honesto: dice cuántas salidas hay detrás y no concluye con menos de 2 de cada lado. */
var EN={ratio:1.4,skip:'cuaderno-en-skip'};
var ENDN={agua:'Agua',mar:'Mar previo',ola:'Ola',viento:'Viento',franja:'Franja',marea:'Marea',luna:'Luna',lluvia:'Lluvia',cebo:'Cebo',spot:'Spot'};
var ENDNL=['agua','mar','ola','viento','franja','marea','luna','lluvia','cebo','spot'];
var ENC={k:'',v:null};
function enSkips(){try{return JSON.parse(localStorage.getItem(EN.skip)||'{}')||{}}catch(e){return {}}}
function enSkip(k){var s=enSkips();s[k]=1;try{localStorage.setItem(EN.skip,JSON.stringify(s))}catch(e){}}
/* visitas con horas: la base del motor. Sin capturas anotadas cuenta como 0 peces. */
function enV(){
  var k=mdKey()+'|'+todayISO();if(ENC.k===k&&ENC.v)return ENC.v;
  var V=legs.filter(function(l){var h=agHours(l);return h!=null&&l.mode!=='Solo mirar el mar'&&l.date&&l.date<=todayISO()}).map(function(l){
    var I=agInfer(l),h=agHours(l),n=I.any?I.n:0;return {l:l,c:agCtx(l),h:h,n:n,rate:n/h,I:I};
  });
  ENC={k:k,v:V};return V;
}
function enFeat(v){
  var l=v.l,c=v.c,F=[],w,m,hr,a,b;
  if(l.agua)F.push({d:'agua',k:l.agua,t:agName(l.agua)});
  if(c&&c.known&&c.pk!=null){
    if(c.pk<AGST)F.push({d:'mar',k:'calma',t:'sin temporal reciente'});
    else if(c.ago===0)F.push({d:'mar',k:'hoy',t:'temporal ese día'});
    else if(c.ago<=3)F.push({d:'mar',k:'tras',t:'1–3 días tras temporal'});
    else F.push({d:'mar',k:'viejo',t:'temporal hace más de 3 días'});
  }
  w=l.wave;if(w!=null&&w!==''&&!isNaN(+w))F.push(+w<1?{d:'ola',k:'baja',t:'ola de menos de 1 m'}:+w<=1.8?{d:'ola',k:'media',t:'ola de 1 a 1,8 m'}:{d:'ola',k:'alta',t:'ola de más de 1,8 m'});
  w=l.wind;if(w!=null&&w!==''&&!isNaN(+w))F.push(+w<12?{d:'viento',k:'flojo',t:'viento de menos de 12 kph'}:+w<=25?{d:'viento',k:'medio',t:'viento de 12 a 25 kph'}:{d:'viento',k:'fuerte',t:'viento de más de 25 kph'});
  if(l.tFrom){hr=+l.tFrom.split(':')[0];F.push(hr<9?{d:'franja',k:'alba',t:'primera hora (antes de las 9)'}:hr<13?{d:'franja',k:'man',t:'mañana (9–13 h)'}:hr<17?{d:'franja',k:'tar',t:'tarde (13–17 h)'}:{d:'franja',k:'ocaso',t:'última hora (desde las 17)'})}
  a=l.hA;b=l.hB;if(a!=null&&b!=null)F.push(b>a+0.2?{d:'marea',k:'sube',t:'marea subiendo'}:b<a-0.2?{d:'marea',k:'baja',t:'marea bajando'}:{d:'marea',k:'para',t:'marea parada'});
  try{m=moon(dateOf(l.date)).ill;if(m>=90)F.push({d:'luna',k:'llena',t:'luna llena'});else if(m<=10)F.push({d:'luna',k:'nueva',t:'luna nueva'})}catch(e){}
  try{var r=agRain(l.date);if(r!=null)F.push(r>=10?{d:'lluvia',k:'si',t:'lluvia de 10 mm o más en 48 h'}:{d:'lluvia',k:'no',t:'sin lluvia fuerte'})}catch(e){}
  (l.baits||[]).forEach(function(x){var n=norm(x);if(n)F.push({d:'cebo',k:n,t:x.charAt(0).toUpperCase()+x.slice(1)})});
  if(l.spotId)F.push({d:'spot',k:l.spotId,t:l.spotName||'Spot'});
  return F;
}
function enPool(vs){var f=0,h=0;vs.forEach(function(v){f+=v.n;h+=v.h});return {n:vs.length,fish:f,h:h,rate:h>0?f/h:null}}
/* grupos de una dimensión */
function enGroups(V,d){
  var G={};
  V.forEach(function(v){enFeat(v).forEach(function(f){if(f.d!==d)return;(G[f.k]=G[f.k]||{k:f.k,t:f.t,V:[]}).V.push(v)})});
  return Object.keys(G).map(function(k){var g=G[k];g.p=enPool(g.V);g.rest=enPool(V.filter(function(v){return g.V.indexOf(v)<0}));return g});
}
function enConf(a,b){var m=Math.min(a,b);return m<2?0:m===2?1:m<5?2:3}
var ENCF=['sin datos','muy poca','media','buena'];
function enEffects(V,dims){
  var out=[];
  (dims||ENDNL).forEach(function(d){
    enGroups(V,d).forEach(function(g){
      var A=g.p,B=g.rest;if(A.n<2||B.n<2||!(A.h>0)||!(B.h>0))return;
      var ratio=B.rate>0?A.rate/B.rate:(A.rate>0?9:1),cf=enConf(A.n,B.n);
      if(ratio>=EN.ratio||ratio<=1/EN.ratio)out.push({d:d,k:g.k,t:g.t,A:A,B:B,ratio:ratio,conf:cf,dir:ratio>1?'+':'-',s:Math.abs(Math.log(ratio))*Math.sqrt(Math.min(A.n,B.n))});
    });
  });
  return out.sort(function(a,b){return b.conf-a.conf||b.s-a.s});
}
function enR(x){return x==null?'–':num(x,1)}
function enEffTxt(e){return 'Con '+e.t.toLowerCase()+' pescas '+enR(e.A.rate)+' peces/h; sin ello, '+enR(e.B.rate)+' ('+e.A.n+' y '+e.B.n+' salidas)'}
function enTier(t,n){return t==='tu'?'<i class="spt of">📒 Tus datos'+(n?' · '+n+' salidas':'')+'</i>':'<i class="spt pe">🎣 Idea de pescadores</i>'}
function enAns(l){
  var out=[];Object.keys(RS||{}).forEach(function(k){var d=RS[k];if(d&&(d.ref===l.tripId||(d.date===l.date&&/^S/.test(d.ref)))&&(d.a||d.txt||d.audio))out.push(d)});
  return out;
}
/* el informe de una visita */
function enReport(tripId){
  var Ls=legs.filter(function(l){return l.tripId===tripId&&l.mode!=='Solo mirar el mar'});if(!Ls.length)return null;
  var V=enV(),vs=V.filter(function(v){return v.l.tripId===tripId}).sort(function(a,b){return b.h-a.h}),v=vs[0];
  var l=v?v.l:Ls[0],R={l:l,v:v,more:Math.max(0,Ls.length-1),ans:enAns(l),nV:V.length,tips:[],inf:[]};
  if(!v){R.noh=true;return R}
  var Vx=V.filter(function(x){return x!==v});
  var here=Vx.filter(function(x){return l.spotId&&x.l.spotId===l.spotId}),base=enPool(here.length?here:Vx);
  R.base={p:base,spot:!!here.length,n:base.n};
  if(base.n&&base.rate>0){var d=v.rate/base.rate-1;R.delta=d;R.verdict=d>=0.25?'up':d<=-0.25?'down':'eq'}else R.verdict=base.n?'eq':'none';
  var E=enEffects(Vx),F=enFeat(v);
  F.forEach(function(f){var e=E.filter(function(x){return x.d===f.d&&x.k===f.k})[0];if(e)R.inf.push(e)});
  R.inf.sort(function(a,b){return b.conf-a.conf||b.s-a.s});
  /* consejos */
  var bad=R.verdict==='down',good=R.verdict==='up';
  if(bad)R.inf.filter(function(e){return e.dir==='-'}).slice(0,1).forEach(function(e){
    var alt=enGroups(Vx,e.d).filter(function(g){return g.k!==e.k&&g.p.n>=2&&g.p.rate>=Math.max(0.01,e.A.rate*1.3)}).sort(function(a,b){return b.p.rate-a.p.rate})[0];
    R.tips.push({k:'tu',n:e.A.n+e.B.n,x:alt?'Cambia '+(ENDN[e.d]||'').toLowerCase()+': con '+alt.t.toLowerCase()+' sacas '+enR(alt.p.rate)+'/h, con '+e.t.toLowerCase()+' '+enR(e.A.rate)+'/h.':'Con '+e.t.toLowerCase()+' rindes menos ('+enR(e.A.rate)+' frente a '+enR(e.B.rate)+' peces/h): mejor otro día.'});
  });
  if(good||R.verdict==='eq'){var pos=R.inf.filter(function(e){return e.dir==='+'}).slice(0,2);if(pos.length)R.tips.push({k:'tu',n:pos[0].A.n+pos[0].B.n,x:'Repite: '+pos.map(function(e){return e.t.toLowerCase()}).join(' + ')+'. Es lo que mejor te ha funcionado.'})}
  /* experimento: cebo/franja con buen resultado fuera de este spot y nunca probado aquí */
  var sv=Vx.filter(function(x){return l.spotId&&x.l.spotId===l.spotId});
  if(l.spotId)['cebo','franja'].forEach(function(d){
    if(R.tips.length>=3)return;
    var tried={};sv.concat([v]).forEach(function(x){enFeat(x).forEach(function(f){if(f.d===d)tried[f.k]=1})});
    var g=enGroups(Vx,d).filter(function(g){return !tried[g.k]&&g.p.n>=2&&g.p.rate>(base.rate||0)*1.2}).sort(function(a,b){return b.p.rate-a.p.rate})[0];
    if(g)R.tips.push({k:'tu',n:g.p.n,x:'En '+(l.spotName||'este spot')+' aún no has probado '+g.t.toLowerCase()+' ('+(d==='cebo'?'cebo':'franja')+'): fuera te da '+enR(g.p.rate)+' peces/h.'});
  });
  /* ideas según tus respuestas rápidas (guías de pescadores, no datos) */
  R.ans.forEach(function(a){
    if(R.tips.length>=3)return;
    if(a.q==='cebo'&&(a.a==='chupado'||a.a==='comido')&&v.n<=2)R.tips.push({k:'pe',x:'Te dejan el cebo pelado sin clavarse: prueba un anzuelo algo menor o un cebo más duro, o cambia de zona.'});
    else if(a.q==='equipo'&&a.a==='rotura')R.tips.push({k:'pe',x:'Roturas de hilo: revisa el bajo tras cada roce con la roca y sube un poco el grosor donde haya piedra.'});
    else if(a.q==='ritmo'&&a.a==='bogas'&&v.I.bogas)R.tips.push({k:'pe',x:'Entraron bogas: cuando pase otra vez, prueba cebo duro o cambia de puesto; mira esa hipótesis en el Libro del maestro.'});
  });
  if(!R.tips.length){
    R.tips.push({k:'none',x:V.length<4?'Aún hay pocas salidas con horas ('+V.length+'): con más, aquí saldrán consejos propios. Completa las horas de las anteriores en Ajustes.':'Esta vez no hay nada que destaque sobre lo habitual.'});
  }
  return R;
}
function enVerdChip(R){
  var m={up:['Mejor de lo habitual','ok'],down:['Peor de lo habitual','bad'],eq:['Como siempre','am'],none:['Primera referencia','nd']};
  var x=m[R.verdict]||m.none;return '<em class="mdc '+x[1]+'">'+x[0]+'</em>';
}
function enTiles(R){
  var v=R.v,base=R.base,dl=R.delta;
  return '<div class="spx-tiles"><div><b>'+v.n+'</b><small>'+(v.n===1?'pez':'peces')+'</small></div><div><b>'+num(v.h,1)+'</b><small>horas</small></div><div><b>'+num(v.rate,1)+'</b><small>por hora</small></div><div><b>'+(base&&base.p.n&&dl!=null?(dl>=0?'+':'')+Math.round(dl*100)+'%':'–')+'</b><small>'+(base&&base.p.n?(base.spot?'frente a tu media aquí':'frente a tu media'):'sin referencia')+'</small></div></div>';
}
function enBody(R,full){
  if(!R)return '';
  var l=R.l,h='';
  if(R.noh)return '<p class="hint">Faltan las horas de esta salida. Ponlas en Ajustes → Completar salidas anteriores para poder compararla.</p>';
  h+=enTiles(R);
  if(R.inf.length){
    h+='<div class="eni"><span class="eyebrow">Qué influyó</span>'+R.inf.slice(0,full?6:2).map(function(e){
      return '<div class="enr '+(e.dir==='+'?'up':'dn')+'"><i>'+(e.dir==='+'?'▲':'▼')+'</i><div><b>'+esc(e.t.charAt(0).toUpperCase()+e.t.slice(1))+'</b><span>'+esc(enEffTxt(e))+'</span><small>Fiabilidad '+ENCF[e.conf]+'</small></div></div>'}).join('')+'</div>';
  }
  h+='<div class="eni"><span class="eyebrow">Para la próxima</span>'+R.tips.slice(0,full?4:2).map(function(t){
    return '<div class="entip"><i>💡</i><div><b>'+esc(t.x)+'</b>'+(t.k==='none'?'':enTier(t.k,t.n))+'</div></div>'}).join('')+'</div>';
  if(full&&R.ans.length){
    h+='<div class="eni"><span class="eyebrow">Lo que me contaste</span><div class="enans">'+R.ans.map(function(a){var q=qrLabel(a);return '<span class="spchip">'+esc(q.q)+' '+(q.a?'<b>'+esc(q.a)+'</b>':'')+(a.audio?' 🎙':'')+'</span>'+(a.txt?'<p class="hint">«'+esc(a.txt)+'»</p>':'')}).join('')+'</div></div>'}
  if(full)h+='<p class="hint">Basado en '+R.nV+' salidas con horas ('+(R.base.spot?'comparada con las de este spot':'comparada con todas')+'). Una salida sin capturas anotadas cuenta como 0 peces. Con pocas salidas son pistas, no certezas.'+(R.more?' Esta salida tuvo '+(R.more+1)+' paradas; el informe es de la más larga.':'')+'</p>';
  return h;
}
/* tarjeta en Salidas */
function enCardHTML(){
  if(SESS)return '';
  var lim=agAdd(todayISO(),-4),sk=enSkips(),T=trips.filter(function(t){return t.date&&t.date>=lim&&t.date<=todayISO()&&!sk['T'+t.id]}).sort(function(a,b){return String(b.date).localeCompare(String(a.date))||(b.createdAt||0)-(a.createdAt||0)});
  for(var i=0;i<T.length;i++){
    var R=enReport(T[i].id);if(!R)continue;
    var h='<section class="card enc" data-t="'+esc(T[i].id)+'"><div class="enh"><b>📋 Qué aprendimos</b>'+(R.noh?'':enVerdChip(R))+'</div><p class="ens">'+esc(mdDayShort(R.l.date))+' · '+esc(R.l.spotName||T[i].siteName||'Salida')+(R.l.mode?' · '+esc(R.l.mode):'')+'</p>'+enBody(R,false)+
      '<div class="enact"><button type="button" class="btn small primary" data-a="en-open" data-t="'+esc(T[i].id)+'">Informe completo</button><button type="button" class="btn small ghost" data-a="en-skip" data-t="'+esc(T[i].id)+'">Ocultar</button></div></section>';
    return h;
  }
  return '';
}
var _qp63=qrPostHTML;
qrPostHTML=function(){var h=_qp63(),c='';try{c=enCardHTML()}catch(e){}return h+c};
function enOpen(id){
  var R=enReport(id);if(!R)return;
  openSheet('Qué aprendimos',(R.noh?'':'<div class="enh2"><b>'+esc(mdDayShort(R.l.date))+' · '+esc(R.l.spotName||'Salida')+'</b>'+enVerdChip(R)+'</div>')+enBody(R,true),'<button class="btn primary" data-a="close-sheet">Cerrar</button>');
}
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a^="en-"]'):null;if(!b)return;
  var a=b.getAttribute('data-a'),id=b.getAttribute('data-t');ev.stopPropagation();
  if(a==='en-open'){enOpen(id);return}
  if(a==='en-skip'){enSkip('T'+id);var c=b.closest('.enc');if(c)c.remove();return}
},true);
(function(){var s=document.createElement('style');s.textContent=
'.enc{border:1px solid rgba(58,208,200,.35);background:linear-gradient(160deg,rgba(58,208,200,.1),var(--surface) 60%)}.enh,.enh2{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px}.enh b,.enh2 b{font:700 16px var(--display)}.ens{margin:0 0 10px;color:var(--muted);font-size:13px}'+
'.eni{margin-top:12px}.eni .eyebrow{display:block;margin-bottom:6px}.enr,.entip{display:grid;grid-template-columns:24px 1fr;gap:8px;padding:8px 0;border-top:1px solid var(--line);font-size:13.5px}.enr:first-of-type,.entip:first-of-type{border-top:0}'+
'.enr>i{font-style:normal;font-size:14px;line-height:1.6}.enr.up>i{color:var(--ok)}.enr.dn>i{color:var(--no)}.enr b,.entip b{display:block;font:600 14px/1.3 var(--display)}.enr span{display:block;color:var(--muted)}.enr small{color:var(--dim);font-size:11.5px}.entip>i{font-style:normal;font-size:18px}'+
'.enact{display:flex;gap:8px;margin-top:12px}.enact .btn{flex:1}.enans{display:flex;flex-wrap:wrap;gap:6px}.enans p{flex-basis:100%;margin:0}';
document.head.appendChild(s)})();
