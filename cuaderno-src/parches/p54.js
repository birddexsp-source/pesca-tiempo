/* ===== p54: Semáforo por spot y día — tus «No ir si…» cruzados con la previsión ===== */
function smRules(s){
  var L=spotLearn(s),R={wind:null,waveHi:null,waveLo:null,tideHi:null,tideLo:null,src:{}},ls=legsOfSpot(s.id);
  function leg(f){return ls.filter(f).sort(function(a,b){return String(a.date).localeCompare(String(b.date))})[0]||null}
  if(L.windTooMuch!=null){R.wind=L.windTooMuch;R.src.wind=leg(function(l){return l.windV==='mucho'&&l.wind===L.windTooMuch})}
  if(L.tooHigh!=null){R.waveHi=L.tooHigh;R.src.waveHi=leg(function(l){return l.waveV==='mucho'&&l.wave===L.tooHigh})}
  if(L.tooLow!=null){R.waveLo=L.tooLow;R.src.waveLo=leg(function(l){return l.waveV==='poco'&&l.wave===L.tooLow})}
  var hi=[],lo=[];
  ls.forEach(function(l){if(l.hA==null)return;var b=l.hB!=null?l.hB:l.hA;if(l.tideV==='mucho')hi.push({v:Math.min(l.hA,b),l:l});if(l.tideV==='poco')lo.push({v:Math.max(l.hA,b),l:l})});
  if(hi.length){hi.sort(function(a,b){return a.v-b.v});R.tideHi=hi[0].v;R.src.tideHi=hi[0].l}
  if(lo.length){lo.sort(function(a,b){return b.v-a.v});R.tideLo=lo[0].v;R.src.tideLo=lo[0].l}
  R.any=R.wind!=null||R.waveHi!=null||R.waveLo!=null||R.tideHi!=null||R.tideLo!=null;
  return R;
}
function smSlot(R,c){
  var br=[],near=false;
  function chk(k,v,lim,up,mg){
    if(v==null||lim==null)return;
    if(up?v>=lim:v<=lim)br.push(k);else if(up?v>=lim-mg:v<=lim+mg)near=true;
  }
  chk('wind',c.wind,R.wind,true,3);chk('waveHi',c.wave,R.waveHi,true,0.15);chk('waveLo',c.wave,R.waveLo,false,0.15);
  chk('tideHi',c.h,R.tideHi,true,0.1);chk('tideLo',c.h,R.tideLo,false,0.1);
  return {br:br,near:near};
}
function smVisit(l){if(!l||!l.date)return '';var p=dparts(l.date);return 'en la visita del '+p.d+' '+p.m}
function smEval(s,P){
  var R=smRules(s);
  if(!R.any)return {st:'nd',txt:'Sin datos: aún no has valorado ninguna visita aquí.'};
  var cs=P.C.filter(function(c){return c.light===1}),g=[],cnt={},amb=0,run=null,best=null;
  cs.forEach(function(c){
    var r=smSlot(R,c);
    if(r.br.length){r.br.forEach(function(k){cnt[k]=(cnt[k]||0)+1});if(run){if(!best||run[1]-run[0]>best[1]-best[0])best=run;run=null}}
    else{if(r.near)amb++;g.push(c);if(!run)run=[c.m,c.m+10];else run[1]=c.m+10}
  });
  if(run&&(!best||run[1]-run[0]>best[1]-best[0]))best=run;
  var ok=g.length;
  var top=Object.keys(cnt).sort(function(a,b){return cnt[b]-cnt[a]})[0];
  function why(){
    if(!top)return '';
    var vals=cs.map(function(c){return top.indexOf('wind')===0?c.wind:top.indexOf('wave')===0?c.wave:c.h}).filter(function(v){return v!=null});
    var lo=Math.min.apply(null,vals),hi=Math.max.apply(null,vals),src=R.src[top],u=top.indexOf('wind')===0?'kph':'m',d=top==='wind'?0:top.indexOf('tide')===0?2:1;
    var rng=Math.abs(hi-lo)<0.05?num(hi,d):num(lo,d)+'–'+num(hi,d);
    var lim={wind:R.wind,waveHi:R.waveHi,waveLo:R.waveLo,tideHi:R.tideHi,tideLo:R.tideLo}[top];
    var nm={wind:'viento',waveHi:'ola',waveLo:'ola',tideHi:'agua',tideLo:'agua'}[top];
    var sv=src?' '+smVisit(src)+' con '+num(lim,d)+' '+u+(top==='wind'?' no se podía lanzar':top==='waveHi'?' había demasiada':top==='waveLo'?' había poca':top==='tideHi'?' el agua estaba demasiado alta':' el agua estaba muy baja'):'';
    return nm+' '+rng+' '+u+(sv?'; '+sv:'');
  }
  var w=best&&best[1]-best[0]>=30?mm(best[0])+'–'+mm(best[1]):'';
  if(ok>=6&&!top)return {st:amb>ok*0.5?'am':'ok',txt:(amb>ok*0.5?'Al límite de tu receta':'Encaja con tu receta')+(w?' · '+w:'')};
  if(ok>=6)return {st:'am',txt:'Solo parte del día encaja'+(w?' ('+w+')':'')+' · '+why()};
  if(ok>=3)return {st:'am',txt:'Al límite'+(w?' ('+w+')':'')+' · '+why()};
  return {st:'rj',txt:why()||'Fuera de tu receta'};
}
function smLastImp(s){
  var l=legsOfSpot(s.id).filter(function(x){return x.imp}).sort(function(a,b){return String(b.date).localeCompare(String(a.date))})[0];
  return l?l.imp:'';
}
function smBlock(G,P){
  if(!P||!P.C)return '';
  var rows=G.spots.filter(function(E){return !E.pending}).map(function(E){
    var r=smEval(E.s,P),imp=smLastImp(E.s),ic={ok:'●',am:'●',rj:'●',nd:'○'}[r.st],lb={ok:'Verde',am:'Ámbar',rj:'Rojo',nd:'Sin datos'}[r.st];
    return '<button type="button" class="smr '+r.st+'" data-a="open-spot" data-id="'+esc(E.s.id)+'"><i>'+ic+'</i><span><b>'+esc(E.s.name)+'</b> <em>'+lb+'</em><small>'+(r.st==='rj'||r.st==='am'?'⚠ ':'')+esc(r.txt)+'</small>'+(imp?'<small class="smi">💡 Qué cambiarías: '+esc(imp)+'</small>':'')+(typeof agLine==='function'?agLine(E.s,P):'')+'</span></button>';
  }).join('');
  if(!rows)return '';
  return '<div class="smb"><span class="eyebrow">Tus reglas para este día</span>'+rows+'</div>';
}
var _sc54=siteCard;
siteCard=function(G,P){
  var h=_sc54(G,P),b='';
  try{b=smBlock(G,P)}catch(e){}
  return b?h.replace('<div class="gantt">',b+'<div class="gantt">'):h;
};
(function(){var s=document.createElement('style');s.textContent=
'.smb{margin:10px 0 6px;display:flex;flex-direction:column;gap:6px}.smr{display:flex;gap:10px;align-items:flex-start;text-align:left;width:100%;border:1px solid var(--line);background:var(--surface);color:inherit;border-radius:12px;padding:8px 10px;font:inherit}'+
'.smr i{font-style:normal;font-size:1.2rem;line-height:1.2}.smr.ok i{color:#3ddc97}.smr.am i{color:#f2b84b}.smr.rj i{color:#ff6b6b}.smr.nd i{color:#8a93a3}'+
'.smr span{display:flex;flex-direction:column;gap:2px;min-width:0}.smr em{font-style:normal;font-size:.72rem;font-weight:700;margin-left:6px;opacity:.85}.smr.rj{border-color:rgba(255,122,107,.4);background:rgba(255,122,107,.08)}.smr.ok{border-color:rgba(61,220,151,.4)}'+
'.smr small{color:var(--muted);font-size:.8rem;line-height:1.35}.smr small.smi{color:var(--tide)}';
document.head.appendChild(s)})();
