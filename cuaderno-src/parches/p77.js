/* ===== p77: Salidas, Compañeros y hoja de especie más útiles (menos relleno, más datos para aprender) ===== */
function sxAll(){return (typeof CATALL!=='undefined'&&CATALL)||catches}
function sxMineItems(tripId){
  var out=[];sxAll().forEach(function(c){if(tripId!=null?c.tripId!==tripId:!c.tripId)return;(c.items||[]).forEach(function(i){if(!i.who&&i.n>0)out.push(i)})});return out;
}
function sxTripLegs(id){return legs.filter(function(l){return l.tripId===id&&l.mode!=='Solo mirar el mar'})}
function sxMins(ls){return ls.reduce(function(a,l){var h=agHours(l);return h!=null?a+Math.round(h*60):a},0)}
function sxHM(m){return m<60?m+' min':Math.floor(m/60)+' h'+(m%60?' '+String(m%60).padStart(2,'0'):'')}
function sxRate(n,m){return m>=15?num(n/(m/60),1):null}
/* ---------- A. cabecera de Salidas: tu temporada ---------- */
function sxSeason(){
  var T=trips.filter(function(t){return t.date&&t.date<=todayISO()}),mins=0,fish=0,st={casa:0,lib:0,esc:0},fh=0,site={};
  T.forEach(function(t){
    var ls=sxTripLegs(t.id),m=sxMins(ls),its=sxMineItems(t.id),n=0;
    its.forEach(function(i){n+=i.n;st[i.st==='lib'?'lib':i.st==='esc'?'esc':'casa']+=i.n});
    fish+=n;mins+=m;if(m)fh+=n;
    var k=t.siteName||'';if(k){site[k]=site[k]||{n:0,m:0};site[k].n+=n;site[k].m+=m}
  });
  var best=Object.keys(site).sort(function(a,b){return site[b].n-site[a].n})[0];
  var rate=sxRate(fh,mins);
  var sub=[st.casa?st.casa+' a casa':'',st.lib?st.lib+' liberados':'',st.esc?st.esc+(st.esc===1?' escapado':' escapados'):''].filter(Boolean).join(' · ');
  var tiles=[[T.length,T.length===1?'salida':'salidas',mins?sxHM(mins)+' pescando':''],[fish,'tus peces',sub],[rate||'–','peces/hora',rate?'en '+sxHM(mins):'faltan horas'],[best&&site[best].n?esc(best):'–','mejor sitio',best&&site[best].n?site[best].n+(site[best].n===1?' pez':' peces'):'']];
  return '<section class="sxs"><span class="eyebrow">Tu temporada</span><div class="sxt">'+tiles.map(function(x,i){return '<div class="'+(i===3?'w':'')+'"><b>'+x[0]+'</b><span>'+x[1]+'</span>'+(x[2]?'<small>'+x[2]+'</small>':'')+'</div>'}).join('')+'</div></section>';
}
/* ---------- B. cada salida: cuándo, con qué mar y qué rindió ---------- */
function sxCond(t){
  var ls=sxTripLegs(t.id);if(!ls.length)return '';
  var w=ls.filter(function(l){return l.tFrom}).map(function(l){return l.tFrom+(l.tTo?'–'+l.tTo:'')});
  var wv=ls.map(function(l){return l.wave}).filter(function(x){return x!=null});
  var l0=ls[0],ph=l0.tpFrom&&PH[l0.tpFrom]?PH[l0.tpFrom].n.toLowerCase()+(l0.tpTo&&PH[l0.tpTo]&&l0.tpTo!==l0.tpFrom?' → '+PH[l0.tpTo].n.toLowerCase():''):'';
  var m=sxMins(ls),n=sxMineItems(t.id).reduce(function(a,i){return a+i.n},0),r=sxRate(n,m);
  var p=[];
  if(w.length)p.push('🕒 '+(w.length>2?w[0]+' … '+w[w.length-1]:w.join(', ')));
  if(wv.length)p.push('🌊 '+num(Math.max.apply(null,wv))+' m');
  if(ph)p.push(ph);
  if(r&&n>0)p.push('<b>'+r+'/h</b>');
  return p.length?'<div class="sxc">'+p.join(' · ')+'</div>':'';
}
var _rs78=renderSalidas;
renderSalidas=function(){
  var h=_rs78();
  if(typeof TD!=='undefined'&&TD)return h;
  try{
    var D=uiDom(h),s4=D.querySelector('.sum4'),lg=D.querySelector('.legend');
    if(s4){s4.insertAdjacentHTML('beforebegin',sxSeason());s4.remove()}
    if(lg)lg.remove();
    [].forEach.call(D.querySelectorAll('article.trow'),function(a){
      var op=a.querySelector('.tcopen'),id=op&&op.getAttribute('data-id'),t=id&&trips.filter(function(x){return x.id===id})[0];if(!t)return;
      var trm=a.querySelector('.trm');if(trm&&!trm.querySelector('.sxc')){var c=sxCond(t);if(c)trm.insertAdjacentHTML('beforeend',c)}
      var g=a.querySelector('.tcg');
      if(g&&!a.querySelector('.fbadge')&&sxTripLegs(t.id).length){g.insertAdjacentHTML('beforebegin','<div class="fbadge sx0"><b>0</b><span>peces</span></div>');g.remove()}
    });
    return D.innerHTML;
  }catch(e){return h}
};
/* ---------- C. «Qué aprendimos»: compara solo con salidas de la misma modalidad ---------- */
var ENMODE=null;
var _env78=enV;
enV=function(){var V=_env78();return ENMODE?V.filter(function(v){return (v.l.mode||'')===ENMODE}):V};
var _enr78=enReport;
enReport=function(tripId){
  var t=trips.filter(function(x){return x.id===tripId})[0],ls=sxTripLegs(tripId);
  ENMODE=(ls[0]&&ls[0].mode)||(t&&t.mode)||null;
  try{var R=_enr78.apply(this,arguments);if(R)R.mode=ENMODE;return R}finally{ENMODE=null}
};
var _enb78=enBody;
enBody=function(R,full){
  var h=_enb78.apply(this,arguments);
  if(R&&!R.noh&&R.verdict==='none'&&R.mode)h=h.replace('<div class="spx-tiles">','<p class="enfirst">Primera salida de '+esc(R.mode)+' con horas: todavía no hay otra igual con la que compararla. Las de corcho no cuentan para esta.</p><div class="spx-tiles">');
  return h;
};
/* ---------- D. hoja de una especie en la salida: pieza a pieza, con su peso ---------- */
var _cpd78=cpData;
cpData=function(t,cl){
  var D=_cpd78.apply(this,arguments),all=sxAll();
  D.S.forEach(function(s){Object.keys(s.w).forEach(function(w){s.w[w].list.forEach(function(f){
    var c=all.filter(function(x){return x.id===f.cid})[0],i=c&&c.items&&c.items[f.ix];if(i&&i.g)f.g=i.g;
  })})});
  return D;
};
function sxKg(g){return g>=1000?num(g/1000,2)+' kg':g+' g'}
cpDetail=function(i,cl){
  window.__cpcl=cl||null;var t=cpTrip();if(!t&&!cl)return;var D=cpData(t,cl),s=D.S[i];if(!s)return;
  var ST={casa:'A casa',lib:'Liberado',esc:'Escapado'},SZ={XS:'muy pequeño',S:'pequeño',M:'mediano',L:'grande',XL:'muy grande'};
  var whoKeys=Object.keys(s.w).sort(function(a,b){return (a?1:0)-(b?1:0)});
  var me=s.w['']||{n:0,st:{},list:[]},gT=0,gN=0;me.list.forEach(function(f){if(f.g){gT+=f.g;gN++}});
  var line=[(me.st.casa?me.st.casa+' a casa':''),(me.st.lib?me.st.lib+(me.st.lib===1?' liberado':' liberados'):''),(me.st.esc?me.st.esc+(me.st.esc===1?' escapado':' escapados'):''),(gN?sxKg(gT)+' pesados':'')].filter(Boolean).join(' · ');
  var h='<div class="cphead sxh"><span class="cpa big">'+cpPlate(s.name)+'</span><div><strong>'+me.n+'</strong> <span>'+(me.n===1?'picada tuya':'picadas tuyas')+'</span>'+(line?'<small>'+esc(line)+'</small>':'')+(s.tot>me.n?'<small>+'+(s.tot-me.n)+' de compañeros (no cuentan como tuyas)</small>':'')+'</div></div>';
  whoKeys.forEach(function(w){
    var o=s.w[w],site=(o.list[0]||{}).site||'';
    var sz=['XS','S','M','L','XL'].filter(function(z){return o.sz[z]}).map(function(z){return o.sz[z]+' '+z}).join(' · ');
    var sp=Object.keys(o.spot),bt=Object.keys(o.bait);
    var facts=[sz?['📏',sz]:null,sp.length?['📍',sp.join(', ')]:null,bt.length?['🪱',bt.join(', ')]:null].filter(Boolean);
    h+='<div class="cpwho sxw"><h4>'+esc(lvPName(w))+' <span>'+o.n+'</span></h4>'+(facts.length?'<div class="sxf">'+facts.map(function(f){return '<span>'+f[0]+' '+esc(f[1])+'</span>'}).join('')+'</div>':'');
    h+='<div class="sxp">'+o.list.map(function(f){
      var st=f.st==='lib'?'lib':f.st==='esc'?'esc':'casa';
      return '<div class="sxr '+st+'"><b class="sxz">'+esc(f.size||'?')+'</b><div class="sxi"><span>'+(f.n>1?f.n+' × ':'')+(f.size&&SZ[f.size]?SZ[f.size]:'Sin talla')+'</span><small><i></i>'+ST[st]+(f.bait?' · '+esc(f.bait):'')+'</small></div><em class="sxg'+(f.g?'':' z')+'">'+(f.g?sxKg(f.g):st==='esc'?'—':'sin peso')+'</em>'+
        '<select class="cpsel" data-a="cap-mvf" data-cid="'+esc(f.cid)+'" data-ix="'+f.ix+'" aria-label="Spot de este pez">'+cpSpotOpts(f.site,f.sp)+'</select>'+
        '<button type="button" class="cpx" aria-label="Quitar este pez" data-a="cap-del" data-cid="'+esc(f.cid)+'" data-ix="'+f.ix+'" data-si="'+i+'">✕</button></div>';
    }).join('')+'</div>';
    if(spots.length&&o.list.length>1){
      var L=spots.filter(function(x){return !site||x.siteId===site}).sort(function(a,b){return String(a.name).localeCompare(String(b.name))});
      h+='<label class="cpmv sxmv">Mover todas a otro spot <select data-a="cap-mv" data-who="'+esc(w)+'" data-sp="'+esc(s.name)+'" data-si="'+i+'"><option value="">Elegir spot…</option>'+L.map(function(x){return '<option value="'+esc(x.id)+'">'+esc(x.name)+'</option>'}).join('')+'</select></label>';
    }
    h+='<p class="hint sxhint">Para poner o cambiar el peso: Capturas → editar la captura.</p></div>';
  });
  openSheet(esc(s.name),h);
};
/* ---------- E. Compañeros: lo que de verdad compara ---------- */
cvBar=function(me,he,nme,nhe){
  var tt=me+he,pm=tt?Math.round(me/tt*100):50;
  return '<div class="cvs"><div class="cvbars"><i class="me" style="width:'+pm+'%"></i><i class="he" style="width:'+(tt?100-pm:50)+'%"></i></div><div class="nums"><span class="me"><b>'+me+'</b>'+esc(nme)+'</span><span class="tt"><b>'+tt+'</b>en total</span><span class="he"><b>'+he+'</b>'+esc(nhe)+'</span></div></div>';
};
var _cvb78=compViewBody;
compViewBody=function(){
  if(CV.view==='detail')return _cvb78();
  var R=compStats(),ids=Object.keys(R);
  if(!ids.length)return _cvb78();
  ids.sort(function(a,b){var x=R[a].trips.length,y=R[b].trips.length;if(!x!==!y)return x?-1:1;var la=R[a].trips.map(function(q){return q.t.date}).sort().pop()||'',lb=R[b].trips.map(function(q){return q.t.date}).sort().pop()||'';return lb.localeCompare(la)||R[a].name.localeCompare(R[b].name,'es')});
  var me=0,he=0,nt={};ids.forEach(function(i){me+=R[i].me;he+=R[i].he;R[i].trips.forEach(function(q){nt[q.t.id]=1})});
  var n=Object.keys(nt).length;
  var h=(me+he?'<div class="block"><h3>Cuando pescas acompañado</h3><p class="hint" style="margin:-4px 0 10px">'+n+(n===1?' salida':' salidas')+' con alguien · sin contar escapados</p>'+cvBar(me,he,'Tú','Ellos')+'</div>':'');
  h+='<div class="block"><h3>Compañeros</h3>'+ids.map(function(i){
    var r=R[i],tr=r.trips.slice().sort(function(a,b){return String(b.t.date).localeCompare(String(a.t.date))}),last=tr[0];
    var sub=last?'Última: '+shortD(last.t.date)+(last.t.siteName?' · '+last.t.siteName:'')+(tr.length>1?' · '+tr.length+' salidas':''):'Aún sin salidas juntos';
    var sc=tr.length?'<span class="sxsc"><b>'+r.me+'</b><i>–</i><b>'+r.he+'</b><small>tú · '+esc(r.name)+'</small></span>':'';
    return '<button type="button" class="centry sxce'+(tr.length?'':' z')+'" data-a="cv-open" data-id="'+esc(r.id)+'"><span class="cav">'+esc(compInit(r))+'</span><span class="sxcn"><b>'+esc(r.name)+'</b><small>'+esc(sub)+'</small></span>'+sc+'</button>';
  }).join('')+'</div>';
  h+='<div class="block"><h3>Nuevo compañero</h3><div class="cpanel" style="border:0;margin:0;padding:0"><div class="row"><input id="cv-name" maxlength="40" autocomplete="off" placeholder="Nombre"><button type="button" class="btn primary" data-a="cv-new">Añadir</button></div></div></div>';
  return h;
};
(function(){var s=document.createElement('style');s.textContent=
'.sxs{margin:4px 0 14px}.sxs .eyebrow{display:block;margin:0 2px 8px}.sxt{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.sxt>div{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:12px 14px;display:flex;flex-direction:column;gap:1px;min-width:0}'+
'.sxt b{font:800 24px/1.1 var(--display);color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sxt .w b{font-size:18px;line-height:1.35}.sxt span{font:600 12.5px var(--body);color:var(--muted)}.sxt small{font:500 11.5px var(--body);color:var(--dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
'.sxc{margin-top:4px;font:500 12px/1.4 var(--body);color:var(--muted)}.sxc b{color:var(--text);font-weight:700}.fbadge.sx0{background:var(--surface2)!important;color:var(--dim)!important;box-shadow:none!important}.fbadge.sx0 b,.fbadge.sx0 span{color:var(--dim)!important}'+
'.enfirst{margin:4px 0 10px;font:500 13px/1.45 var(--body);color:var(--muted)}'+
'.sxh{align-items:center}.sxh strong{font:800 34px/1 var(--display)}.sxh span{font:600 15px var(--body)}.sxh small{display:block;margin-top:4px;font:500 13px var(--body);color:var(--muted)}'+
'.sxw h4{margin:16px 0 8px}.sxf{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 10px}.sxf span{background:var(--surface2);border:1px solid var(--line);border-radius:99px;padding:5px 10px;font:600 12.5px var(--body)}'+
'.sxp{display:flex;flex-direction:column;gap:6px}.sxr{display:grid;grid-template-columns:36px 1fr auto;grid-template-rows:auto auto;align-items:center;gap:4px 10px;background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:10px 12px}'+
'.sxz{grid-row:1/3;width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:var(--surface2);font:800 14px var(--display)}.sxi{min-width:0}.sxi span{font:600 14px var(--body)}.sxi small{display:flex;align-items:center;gap:5px;font:500 12px var(--body);color:var(--muted)}.sxi small i{width:7px;height:7px;border-radius:50%;background:#3fd0c9}'+
'.sxr.lib .sxi small i{background:#58a8ff}.sxr.esc .sxi small i{background:#ff7a6b}.sxr.esc{opacity:.8}.sxg{font:700 15px var(--mono);font-style:normal;color:var(--text);text-align:right}.sxg.z{font:500 12px var(--body);color:var(--dim)}'+
'.sxr .cpsel{grid-column:2/3;font-size:12.5px;padding:4px 8px;min-height:30px;max-width:100%}.sxr .cpx{grid-column:3;justify-self:end}.sxmv{display:flex;flex-direction:column;gap:6px;margin-top:12px;font:600 13px var(--body);color:var(--muted)}.sxhint{margin:10px 0 0}'+
'.sxce{display:flex;align-items:center;gap:12px}.sxcn{flex:1;min-width:0;display:flex;flex-direction:column;text-align:left}.sxcn small{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sxsc{flex:none;display:flex;align-items:baseline;gap:4px;flex-wrap:wrap;justify-content:flex-end;max-width:96px;text-align:right}.sxsc b{font:800 18px var(--display)}.sxsc b:first-child{color:var(--accent)}.sxsc b:last-of-type{color:#f2b84b}.sxsc i{color:var(--dim);font-style:normal}.sxsc small{flex-basis:100%;font:500 10.5px var(--body);color:var(--dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sxce.z{opacity:.7}';
document.head.appendChild(s)})();
