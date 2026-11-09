/* ===== p52: Memoria del spot — cada visita con sus condiciones, qué pasó y qué cambiarías ===== */
function mvVisits(s){
  var out=[],seen={};
  legsOfSpot(s.id).forEach(function(l){seen[l.tripId]=1;out.push({date:l.date,tripId:l.tripId,l:l,own:true})});
  trips.forEach(function(t){
    if(seen[t.id])return;
    var hit=false;try{hit=rtNodes(t).some(function(n){return n.linked===s.id||(n.sp&&n.sp.id===s.id)})}catch(e){}
    if(!hit)return;
    out.push({date:t.date,tripId:t.id,l:(t.stops&&t.stops[0])?Object.assign({},t,t.stops[0]):t,own:false});
  });
  return out.sort(function(a,b){return String(b.date).localeCompare(String(a.date))});
}
function mvFish(s,v){
  var n=0,sp={},any=false;
  catchesOfTrip(v.tripId).forEach(function(c){(c.items||[]).forEach(function(i){
    if(i.who||!i.species)return;
    var here=i.spotId?i.spotId===s.id:v.own;
    if(!here)return;any=true;n+=i.n||1;sp[i.species]=(sp[i.species]||0)+(i.n||1);
  })});
  return {n:n,sp:sp};
}
function mvIssues(l){
  var o=[];
  if(l.waveV==='mucho')o.push('demasiada ola');if(l.waveV==='poco')o.push('poca ola');
  if(l.windV==='mucho')o.push('demasiado viento');
  if(l.tideV==='mucho')o.push('marea demasiado alta');if(l.tideV==='poco')o.push('marea muy baja');
  return o;
}
function mvCard(s,v){
  var l=v.l,iss=mvIssues(l),rated=l.waveV||l.windV||l.tideV,F=mvFish(s,v),dp=dparts(l.date||v.date);
  var verdict=!rated?'<span class="mvv n">Sin valorar</span>':iss.length?'<span class="mvv bad">⚠ '+esc(iss.join(' · '))+'</span>':'<span class="mvv ok">✓ Condiciones buenas</span>';
  var pills='';
  if(l.wave!=null)pills+='<span class="pill '+(l.waveV||'')+'">Ola '+num(l.wave)+' m'+(l.period?' · '+num(l.period,0)+' s':'')+(l.waveV?' · '+VL[l.waveV]:'')+'</span>';
  if(l.wind!=null)pills+='<span class="pill '+(l.windV||'')+'">Viento '+num(l.wind,0)+' kph'+(l.gust?' (rachas '+num(l.gust,0)+')':'')+(l.windV?' · '+VL[l.windV]:'')+'</span>';
  if(l.hA!=null)pills+='<span class="pill '+(l.tideV||'')+'">Agua '+num(l.hA)+(l.hB!=null?'→'+num(l.hB):'')+' m'+(l.tideV?' · '+esc(TL[l.tideV]):'')+'</span>';
  if(l.tpFrom&&PH[l.tpFrom])pills+='<span class="pill">'+esc(PH[l.tpFrom].n)+(l.tpTo&&PH[l.tpTo]?' → '+esc(PH[l.tpTo].n):'')+'</span>';
  var res=F.n?'🐟 <b>'+F.n+'</b> '+Object.keys(F.sp).map(function(k){return esc(k)+' ×'+F.sp[k]}).join(' · '):'Sin capturas tuyas aquí';
  var why=leftArr(l.leftWhy).length?'<p class="mvn"><b>Por qué te fuiste:</b> '+esc(leftArr(l.leftWhy).map(function(k){return LEFTW[k]||k}).join(', '))+'</p>':'';
  return '<article class="mvc"><header><b>'+dp.d+' '+esc(dp.m)+'</b><span>'+esc([l.tFrom?l.tFrom+(l.tTo?'–'+l.tTo:''):'',l.mode||'',(l.baits||[]).join(', ')].filter(Boolean).join(' · '))+'</span>'+verdict+'</header>'+
    (pills?'<div class="mvp">'+pills+'</div>':'')+'<div class="mvr">'+res+'</div>'+
    (l.imp?'<p class="mvn"><b>Qué cambiarías:</b> '+esc(l.imp)+'</p>':'')+why+
    (v.own?'':'<p class="mvs">Parada compartida con otro spot: condiciones de toda la salida.</p>')+'</article>';
}
function mvRules(s,V){
  var L=spotLearn(s),r=[],n=V.filter(function(v){return v.own}).length;
  if(L.windTooMuch!=null)r.push('Viento de <b>'+num(L.windTooMuch,0)+' kph</b> o más: te sobró');
  if(L.tooHigh!=null)r.push('Ola de <b>'+num(L.tooHigh)+' m</b> o más: demasiada');
  if(L.tooLow!=null)r.push('Ola de <b>'+num(L.tooLow)+' m</b> o menos: poca');
  var hi=[],lo=[];legsOfSpot(s.id).forEach(function(l){if(l.hA==null)return;if(l.tideV==='mucho')hi.push(Math.min(l.hA,l.hB!=null?l.hB:l.hA));if(l.tideV==='poco')lo.push(Math.max(l.hA,l.hB!=null?l.hB:l.hA))});
  if(hi.length)r.push('Agua de <b>'+num(Math.min.apply(null,hi))+' m</b> o más: demasiado alta');
  if(lo.length)r.push('Agua de <b>'+num(Math.max.apply(null,lo))+' m</b> o menos: muy baja');
  return r.length?'<div class="mvno"><h4>No ir si…</h4><ul>'+r.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul><small>Según '+n+(n===1?' salida':' salidas')+' valoradas.</small></div>':'';
}
function mvHTML(s){
  var V=mvVisits(s);
  var last=V.filter(function(v){return v.l.imp})[0];
  var h='<div class="sect"><h2>Memoria del spot</h2><span>'+V.length+(V.length===1?' visita':' visitas')+'</span></div>';
  if(!V.length)return h+'<p class="hint">Aún no has estado aquí. Cuando lo hagas, verás cada visita con sus condiciones y qué cambiarías.</p>';
  if(last)h+='<div class="mvnext"><em>Para la próxima vez</em><p>'+esc(last.l.imp)+'</p></div>';
  return h+mvRules(s,V)+'<div class="mvl">'+V.map(function(v){return mvCard(s,v)}).join('')+'</div>';
}
var _oss52=openSpotSheet;
openSpotSheet=function(id){
  _oss52(id);
  var s=spots.filter(function(x){return x.id===id})[0],body=document.getElementById('sheetbody');if(!s||!body||body.querySelector('.mvl,.mvnext'))return;
  var rules=body.querySelector('.rules'),html=mvHTML(s);
  if(rules)rules.insertAdjacentHTML('afterend',html);else body.insertAdjacentHTML('beforeend',html);
};
(function(){var s=document.createElement('style');s.textContent=
'.mvl{display:flex;flex-direction:column;gap:10px;margin:8px 0 16px}.mvc{border:1px solid var(--line,#ffffff1f);border-radius:14px;padding:12px;background:var(--card,#ffffff08)}'+
'.mvc header{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;margin-bottom:8px}.mvc header span:not(.mvv){color:var(--muted);font-size:.8rem}.mvv{margin-left:auto;font-size:.78rem;font-weight:700;padding:3px 10px;border-radius:99px}'+
'.mvv.ok{background:#1f6f4a55;color:#7ee2a8}.mvv.bad{background:#7a2f2f55;color:#ff9f9f}.mvv.n{background:#ffffff14;color:var(--muted)}'+
'.mvp{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}.mvr{font-size:.9rem;margin-bottom:6px}.mvn{margin:6px 0 0;line-height:1.4;font-size:.88rem}.mvs{margin:6px 0 0;color:var(--muted);font-size:.75rem}'+
'.mvnext{border-left:3px solid var(--accent,#f2b84b);background:var(--card,#ffffff08);border-radius:10px;padding:10px 12px;margin:8px 0}.mvnext em{display:block;font-style:normal;font-size:.68rem;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}.mvnext p{margin:4px 0 0}'+
'.mvno{border:1px solid #7a2f2f88;border-radius:12px;padding:10px 12px;margin:8px 0;background:#7a2f2f22}.mvno h4{margin:0 0 4px;color:#ff9f9f}.mvno ul{margin:0;padding-left:18px}.mvno small{color:var(--muted)}';
document.head.appendChild(s)})();
