/* ===== p57: Datos externos del mar — Open-Meteo (oleaje diario y lluvia) para rellenar el historial y detectar lluvia previa ===== */
var MAR={at:0,tried:0,ok:null,wave:{},per:{},rain:{}};
var MARLAT=43.52,MARLON=-2.76,MARKEY='cuaderno-mar-v1';
try{var _mj=JSON.parse(localStorage.getItem(MARKEY)||'null');if(_mj&&_mj.wave){MAR.at=_mj.at||0;MAR.wave=_mj.wave||{};MAR.per=_mj.per||{};MAR.rain=_mj.rain||{}}}catch(e){}
function marSave(){try{localStorage.setItem(MARKEY,JSON.stringify({at:MAR.at,wave:MAR.wave,per:MAR.per,rain:MAR.rain}))}catch(e){}}
function marGet(u){return fetch(u).then(function(r){if(!r.ok)throw new Error(r.status);return r.json()}).catch(function(){return null})}
function marMerge(j,pairs){
  var n=0;if(!j||!j.daily||!j.daily.time)return 0;
  j.daily.time.forEach(function(d,i){pairs.forEach(function(p){var a=j.daily[p[0]],v=a?a[i]:null;if(v!=null&&!isNaN(+v)){MAR[p[1]][d]=+v;n++}})});
  return n;
}
function marRefresh(force){
  if(typeof fetch!=='function')return;
  var now=Date.now();
  if(!force&&(now-MAR.at<3*3600e3||now-MAR.tried<10*60e3))return;
  MAR.tried=now;
  var tz='&timezone=Europe%2FMadrid',ll='latitude='+MARLAT+'&longitude='+MARLON,w='latitude=43.45&longitude=-2.75';
  var jobs=[
    marGet('https://marine-api.open-meteo.com/v1/marine?'+ll+'&daily=wave_height_max,wave_period_max&past_days=92&forecast_days=8'+tz).then(function(j){return marMerge(j,[['wave_height_max','wave'],['wave_period_max','per']])}),
    marGet('https://api.open-meteo.com/v1/forecast?'+w+'&daily=precipitation_sum&past_days=92&forecast_days=8'+tz).then(function(j){return marMerge(j,[['precipitation_sum','rain']])})
  ];
  /* visitas más antiguas que 92 días: se piden por rango */
  var old=legs.map(function(l){return l.date}).filter(function(d){return d&&d<agAdd(todayISO(),-90)}).sort()[0];
  if(old){
    var a=agAdd(old,-4),b=agAdd(todayISO(),-91);
    jobs.push(marGet('https://marine-api.open-meteo.com/v1/marine?'+ll+'&daily=wave_height_max,wave_period_max&start_date='+a+'&end_date='+b+tz).then(function(j){return marMerge(j,[['wave_height_max','wave'],['wave_period_max','per']])}));
    jobs.push(marGet('https://archive-api.open-meteo.com/v1/archive?'+w+'&daily=precipitation_sum&start_date='+a+'&end_date='+b+tz).then(function(j){return marMerge(j,[['precipitation_sum','rain']])}));
  }
  Promise.all(jobs).then(function(r){
    var n=r.reduce(function(s,x){return s+x},0);MAR.ok=n>0;
    if(n>0){MAR.at=Date.now();marSave();try{PC={}}catch(e){}try{rebuildLegs()}catch(e){}try{refresh()}catch(e){}}
    else{try{refresh()}catch(e){}}
  });
}
setTimeout(function(){marRefresh()},2500);
window.addEventListener('online',function(){marRefresh(true)});

/* el historial del mar: previsiones guardadas (Windy) y, si no hay, Open-Meteo */
function agDayMax(iso){
  var f=fcOf(iso),m=null;
  if(f&&f.samples&&f.samples.length)f.samples.forEach(function(x){if(x.wave!=null&&(m==null||x.wave>m))m=x.wave});
  if(m!=null)return m;
  return MAR.wave[iso]!=null?MAR.wave[iso]:null;
}
function agDayFromWindy(iso){var f=fcOf(iso);return !!(f&&f.samples&&f.samples.length)}
function agStorm(iso,ownWave){
  var vals=[],viaMar=0;
  for(var k=-3;k<=0;k++){
    var d=agAdd(iso,k),m=agDayMax(d);
    if(m!=null&&!agDayFromWindy(d))viaMar++;
    if(m==null&&k===0&&ownWave!=null&&ownWave!==''&&!isNaN(+ownWave))m=+ownWave;
    if(m!=null)vals.push({d:d,m:m,k:k});
  }
  if(vals.length<3)return {pk:null,ago:null,known:false,src:null,n:vals.length};
  var pk=Math.max.apply(null,vals.map(function(x){return x.m})),last=vals.filter(function(x){return x.m>=pk*0.9}).pop();
  return {pk:pk,ago:-last.k,known:true,src:viaMar?(viaMar===vals.length?'openmeteo':'mixto'):'windy',n:vals.length};
}
function agRain(iso){
  var a=MAR.rain[iso],b=MAR.rain[agAdd(iso,-1)];
  if(a==null&&b==null)return null;
  return (a||0)+(b||0);
}
function marSrcLine(){
  var used=MAR.at?'Mar de los días sin previsión tuya y lluvia: Open-Meteo (modelo global, orientativo) · actualizado '+new Date(MAR.at).toTimeString().slice(0,5):'';
  if(MAR.ok===false&&!MAR.at)return '<small class="hint">Sin conexión con Open-Meteo: solo cuento con tus previsiones guardadas.</small>';
  return used?'<small class="hint">'+used+(MAR.ok===false?' (sin conexión ahora, uso lo guardado)':'')+'</small>':'';
}
/* tarjeta del día: lluvia previa y de dónde salen los datos */
var _adc57=agDayCard;
agDayCard=function(iso){
  var h=_adc57(iso),r=agRain(iso),ex='';
  if(r!=null)ex+='<div class="agr"><span class="agi">🌧</span><span>Lluvia en las últimas 48 h: <b>'+num(r,0)+' mm</b>'+(r>=10?' · puede enturbiar el agua cerca de desembocaduras':'')+'</span></div>';
  return h.replace('<!--ag-extra-->',ex).replace('<!--ag-src-->',marSrcLine());
};
var _agl57=agLine;
agLine=function(s,P){
  var h=_agl57(s,P),r=agRain(P.iso);
  return r!=null&&r>=10?h.replace(/<\/small>$/,' · ojo: lluvia reciente ('+num(r,0)+' mm)</small>'):h;
};
var _mvc57=mvCard;
mvCard=function(s,v){
  var h=_mvc57(s,v),d=(v.l&&v.l.date)||v.date,r=d?agRain(d):null;
  return r!=null?h.replace(/<\/article>$/,'<p class="mvs mvrain">🌧 Lluvia en las 48 h previas: '+num(r,0)+' mm.</p></article>'):h;
};
/* hipótesis nueva: la lluvia enturbia aunque el mar esté en calma */
MDH.push({id:'lluvia',cat:'agua',txt:'La lluvia reciente enturbia el agua aunque el mar esté en calma.',src:'Lógica de escorrentía de ríos (no es de pesca; a comprobar)',unit:'(0 cristal · 3 chocolate)',better:'higher',
  hours:false,la:'Con ≥10 mm en 48 h',lb:'Sin lluvia fuerte',
  side:function(v){if(!v.l.agua||!v.c.known||v.c.pk>=AGST)return null;var r=agRain(v.l.date);return r==null?null:r>=10?'A':'B'},
  num:function(v){return AGS[v.l.agua]},den:function(){return 1}});
(function(){var s=document.createElement('style');s.textContent='.mvrain{color:var(--wave)}';document.head.appendChild(s)})();
var _rh57=renderHoy;
renderHoy=function(){marRefresh();return _rh57()};
