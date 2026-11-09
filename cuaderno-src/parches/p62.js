/* ===== p62: ficha de especie completa — pestañas Resumen · Pescar · Mitos · Legal · Ficha, con tus números y las fuentes ===== */
var SPT='res';
var SPTIER={of:['🏛','Oficial'],ci:['🔬','Ciencia'],pe:['🎣','Pescadores']};
var SPMES=['E','F','M','A','M','J','J','A','S','O','N','D'];
function spiKey(name){return SPK[norm(name)]||null}
function spiTier(t){var x=SPTIER[t];return x?'<i class="spt '+t+'" title="'+esc(x[1])+'">'+x[0]+' '+x[1]+'</i>':''}
/* lo que has pescado de esta especie */
function spiMine(name){
  var k=norm(name),o={n:0,trips:{},spots:{},months:[0,0,0,0,0,0,0,0,0,0,0,0],hrs:[],sizes:{},baits:{},aguas:{},last:null,first:null,fish:[]};
  legs.forEach(function(l){
    catchesOfLeg(l).forEach(function(c){(c.items||[]).forEach(function(i){
      if(norm(i.species)!==k||!(i.n>0)||i.who)return;
      o.n+=i.n;o.trips[l.tripId]=1;
      if(l.spotId)o.spots[l.spotId]=(o.spots[l.spotId]||0)+i.n;
      if(l.date){var m=+l.date.slice(5,7)-1;o.months[m]+=i.n;if(!o.last||l.date>o.last)o.last=l.date;if(!o.first||l.date<o.first)o.first=l.date}
      var hr=legHour(l);if(hr!=null)o.hrs.push(hr);
      if(i.size)o.sizes[i.size]=(o.sizes[i.size]||0)+i.n;
      var b=i.bait||(l.baits&&l.baits.length===1?l.baits[0]:null);if(b)o.baits[b]=(o.baits[b]||0)+i.n;
      if(l.agua)o.aguas[l.agua]=(o.aguas[l.agua]||0)+i.n;
    })});
  });
  return o;
}
function spiTop(m,max){return Object.keys(m).map(function(k){return [k,m[k]]}).sort(function(a,b){return b[1]-a[1]}).slice(0,max||4)}
function spiBars(rows,col){
  var mx=Math.max.apply(null,rows.map(function(r){return r[1]}).concat([1]));
  return '<div class="spb">'+rows.map(function(r){return '<div class="spbr"><span>'+esc(r[0])+'</span><u><i style="width:'+Math.max(6,Math.round(r[1]/mx*100))+'%'+(col?';background:'+col:'')+'"></i></u><b>'+r[1]+'</b></div>'}).join('')+'</div>';
}
function spiMonthStrip(S,mine){
  var now=new Date().getMonth()+1,M=S.meses,mx=Math.max.apply(null,mine.months.concat([1]));
  return '<div class="spm">'+SPMES.map(function(l,i){
    var m=i+1,ok=M&&M.ok.indexOf(m)>-1,pk=M&&M.pk&&M.pk.indexOf(m)>-1,c=mine.months[i];
    return '<div class="spmc'+(ok?' ok':'')+(pk?' pk':'')+(m===now?' now':'')+'"><b>'+(c?c:'')+'</b><span class="spmb"><i style="height:'+(c?Math.max(14,Math.round(c/mx*100)):0)+'%"></i></span><em>'+l+'</em></div>';
  }).join('')+'</div>';
}
function spiSeasonBadge(S){
  var M=S&&S.meses;if(!M)return '';var now=new Date().getMonth()+1;
  if(M.pk&&M.pk.indexOf(now)>-1)return '<span class="spchip hot">🔥 Mejor época ahora</span>';
  if(M.ok.indexOf(now)>-1)return '<span class="spchip ok">✓ En temporada</span>';
  return M.t==='of'?'<span class="spchip off">Fuera de temporada oficial</span>':'<span class="spchip">Fuera de su mejor época</span>';
}
function spiHyp(id){
  var H=(typeof MDH!=='undefined')?MDH.filter(function(x){return x.id===id})[0]:null;if(!H||typeof mdEval!=='function')return '';
  var E=mdEval(H),ch=MDCHIP[E.st];
  var tx=E.st==='nd'?'Faltan datos ('+E.A.v+' y '+E.B.v+' salidas; hacen falta 2 de cada tipo)':esc(H.la)+' '+mdFmt(H,E.ra)+' · '+esc(H.lb)+' '+mdFmt(H,E.rb)+' '+esc(H.unit);
  return '<p class="spmy"><b>📒 Tus datos</b> <em class="mdc '+ch[1]+'">'+ch[0]+'</em><small>'+tx+'</small></p>';
}
/* --- pestañas --- */
function spiTabRes(name,S,L,mine,old){
  var h='';
  if(mine.n){
    var spn=spiTop(mine.spots,1)[0],sp=spn&&spots.filter(function(z){return z.id===spn[0]})[0];
    var days=mine.last?Math.max(0,Math.round((Date.now()-new Date(mine.last+'T12:00:00').getTime())/86400000)):null;
    var tr=Object.keys(mine.trips).length;
    h+='<div class="spx-tiles"><div><b>'+mine.n+'</b><small>capturas</small></div><div><b>'+tr+'</b><small>'+(tr===1?'salida':'salidas')+'</small></div><div><b>'+Object.keys(mine.spots).length+'</b><small>'+(Object.keys(mine.spots).length===1?'spot':'spots')+'</small></div><div><b>'+(days===0?'hoy':days)+'</b><small>'+(days===0?'última':'días desde la última')+'</small></div></div>';
    var cards='';
    if(sp)cards+='<div class="spx-k"><span>📍 Tu mejor sitio</span><b>'+esc(sp.name)+'</b><small>'+spn[1]+(spn[1]===1?' captura':' capturas')+'</small></div>';
    var bt=spiTop(mine.baits,1)[0];if(bt)cards+='<div class="spx-k"><span>🪱 Tu mejor cebo</span><b>'+esc(bt[0])+'</b><small>'+bt[1]+(bt[1]===1?' captura':' capturas')+'</small></div>';
    if(mine.hrs.length){var bins={};mine.hrs.forEach(function(x){var a=Math.floor(x/3)*3;bins[a]=(bins[a]||0)+1});var bb=spiTop(bins,1)[0],a0=+bb[0];cards+='<div class="spx-k"><span>🕒 Tu mejor franja</span><b>'+String(a0).padStart(2,'0')+':00–'+String((a0+3)%24).padStart(2,'0')+':00</b><small>'+bb[1]+(bb[1]===1?' captura':' capturas')+'</small></div>'}
    var ag=spiTop(mine.aguas,1)[0];if(ag)cards+='<div class="spx-k"><span>💧 Tu mejor agua</span><b>'+esc(agName(ag[0]))+'</b><small>'+ag[1]+(ag[1]===1?' captura':' capturas')+'</small></div>';
    if(cards)h+='<div class="spx-ks">'+cards+'</div>';
    h+='<div class="block"><span class="eyebrow">Tus capturas por mes</span>'+spiMonthStrip(S,mine)+(S.meses?'<p class="spleg"><i class="ok"></i> temporada <i class="pk"></i> mejor época · '+spiTier(S.meses.t)+'</p><p class="hint">'+esc(S.meses.n)+'</p>':'')+'</div>';
    var sz=['XS','S','M','L','XL'].filter(function(z){return mine.sizes[z]}).map(function(z){return [z,mine.sizes[z]]});
    if(sz.length)h+='<div class="block"><span class="eyebrow">Tallas que has sacado</span>'+spiBars(sz)+'</div>';
    var bs=spiTop(mine.baits,5);if(bs.length>1||(bs.length&&!bt))h+='<div class="block"><span class="eyebrow">Con qué cebo</span>'+spiBars(bs,'var(--accent)')+'</div>';
    var ags=spiTop(mine.aguas,4).map(function(r){return [agName(r[0]),r[1]]});if(ags.length>1)h+='<div class="block"><span class="eyebrow">Con qué agua</span>'+spiBars(ags,'#d9c46a')+'</div>';
    if(old.cond)h+=old.cond;
  }else{
    h+='<div class="block spx-first"><span class="eyebrow">Aún sin capturas</span><p>Todavía no has sacado ninguna. '+(S.plan?'Este es el plan para la primera:':'Todavía no tengo datos verificados de esta especie; se irán ampliando.')+'</p></div>';
    if(S.meses)h+='<div class="block"><span class="eyebrow">Cuándo</span>'+spiMonthStrip(S,mine)+'<p class="spleg"><i class="ok"></i> temporada <i class="pk"></i> mejor época · '+spiTier(S.meses.t)+'</p><p class="hint">'+esc(S.meses.n)+'</p></div>';
  }
  if(S.plan)h+='<div class="block"><span class="eyebrow">'+(mine.n?'Para otra como esta':'Tu primera captura')+'</span><div class="spx-plan">'+S.plan.map(function(p){return '<div><i>'+p[0]+'</i><b>'+esc(p[1])+'</b><span>'+esc(p[2])+'</span></div>'}).join('')+'</div><p class="hint">Es lo que cuentan guías y pescadores; tus salidas dirán qué te funciona a ti. '+spiTier('pe')+'</p></div>';
  return h;
}
function spiTabPescar(name,S,mine){
  var h='';
  if(S.hora&&S.hora.length)h+='<div class="block"><span class="eyebrow">Hora</span>'+S.hora.map(function(x){return '<div class="spx-row"><i>'+x[0]+'</i><div><b>'+esc(x[1])+'</b>'+(x[2]?'<span>'+esc(x[2])+'</span>':'')+spiTier(x[3])+'</div></div>'}).join('')+'</div>';
  if(S.cond&&S.cond.length)h+='<div class="block"><span class="eyebrow">Mar y agua</span>'+S.cond.map(function(x){return '<div class="spx-row"><i>'+x[0]+'</i><div><span class="tx">'+esc(x[1])+'</span>'+spiTier(x[2])+'</div></div>'}).join('')+'</div>';
  if(S.cebos&&S.cebos.length)h+='<div class="block"><span class="eyebrow">Cebos que se recomiendan</span>'+S.cebos.map(function(x){
    var used=0;Object.keys(mine.baits).forEach(function(b){if(norm(b).indexOf(x[3])>-1)used+=mine.baits[b]});
    return '<div class="spx-row"><i>🪱</i><div><b>'+esc(x[0])+'</b>'+(x[1]?'<span>'+esc(x[1])+'</span>':'')+'<em class="spuse'+(used?' on':'')+'">'+(used?'📒 Con él: '+used+(used===1?' captura':' capturas'):'Aún sin probar')+'</em></div></div>'}).join('')+'<p class="hint">Recomendaciones de guías '+spiTier('pe')+'. «Aún sin probar» = no lo tienes anotado en una captura.</p></div>';
  if(S.montaje&&S.montaje.length)h+='<div class="block"><span class="eyebrow">Montaje</span>'+S.montaje.map(function(x){return '<div class="spx-row"><i>🎣</i><div><b>'+esc(x[0])+'</b><span>'+esc(x[1])+'</span></div></div>'}).join('')+'</div>';
  if(S.err&&S.err.length)h+='<div class="block"><span class="eyebrow">Errores típicos</span><ul class="sperr">'+S.err.map(function(e){return '<li>'+esc(e)+'</li>'}).join('')+'</ul></div>';
  return h;
}
function spiTabMitos(S){
  var V={falso:['Falso','bad'],cierto:['Cierto','ok'],depende:['Depende','am'],'sin verificar':['Sin verificar','nd']};
  return '<div class="block"><span class="eyebrow">Lo que se dice</span><p class="hint">Lo que cuentan guías y pescadores. Si se puede comprobar con tus salidas, lo ves debajo.</p>'+S.mitos.map(function(x){var v=V[x.v]||V['sin verificar'];
    return '<details class="spmit"><summary><span class="spq">'+esc(x.m)+'</span><em class="mdc '+v[1]+'">'+v[0]+'</em></summary><div class="spmb2"><p>'+esc(x.n)+'</p>'+(x.hyp?spiHyp(x.hyp):'')+'</div></details>'}).join('')+'</div>';
}
function spiTabLegal(name,key){
  var L=key&&SPL[key],h='';
  if(L){
    h+='<div class="spx-legal"><div><small>Talla mínima</small><b>'+esc(L.t)+'</b></div>'+(L.c?'<div><small>Cupo</small><b>'+esc(L.c)+'</b></div>':'')+(L.v?'<div><small>Temporada</small><b>'+esc(L.v)+'</b></div>':'')+'</div>';
    if(L.n)h+='<div class="spx-warn">'+esc(L.n)+'</div>';
  }else h+='<div class="block"><p class="hint">No tengo una talla ni un cupo propios para esta especie en las fuentes oficiales que he revisado. Se aplican las reglas generales de abajo.</p></div>';
  h+='<div class="block"><span class="eyebrow">Reglas generales · pesca de recreo</span>'+SPG.map(function(g){return '<div class="spx-row"><i>'+g[0]+'</i><div><b>'+esc(g[1])+'</b><span>'+esc(g[2])+'</span></div></div>'}).join('')+'</div>';
  var srcs=(L&&L.s||[]).concat(['folleto','ev']).filter(function(x,i,a){return a.indexOf(x)===i&&SPS[x]});
  h+='<div class="block"><span class="eyebrow">Fuentes</span>'+srcs.map(function(x){return '<a class="spsrc" target="_blank" rel="noopener noreferrer" href="'+esc(SPS[x][1])+'">'+esc(SPS[x][0])+'</a>'}).join('')+'<p class="hint">Revisado el 9 de noviembre de 2026. Es orientativo: las normas cambian (sobre todo la lubina) y manda lo que diga la autoridad pesquera. Si dudas, devuélvela.</p></div>';
  return h;
}
function spiTabFicha(S,old){
  var h=old.tip||'';
  if(S.hab)h+='<div class="block"><span class="eyebrow">Dónde vive</span><p>'+esc(S.hab)+'</p></div>';
  if(S.facts&&S.facts.length)h+='<div class="block"><span class="eyebrow">En cifras</span><div class="spx-facts">'+S.facts.map(function(f){return '<div><small>'+esc(f[0])+'</small><b>'+esc(f[1])+'</b>'+spiTier(f[2])+'</div>'}).join('')+'</div></div>';
  var srcs=(S.src||[]).filter(function(x){return SPS[x]});
  if(srcs.length)h+='<div class="block"><span class="eyebrow">De dónde sale</span>'+srcs.map(function(x){return '<a class="spsrc" target="_blank" rel="noopener noreferrer" href="'+esc(SPS[x][1])+'">'+esc(SPS[x][0])+'</a>'}).join('')+'<p class="hint">'+spiTier('of')+' '+spiTier('ci')+' '+spiTier('pe')+' Lo de pescadores son opiniones, no datos: se tratan como hipótesis.</p></div>';
  return h;
}
function spiPanel(id,html){return '<section class="spp" data-p="'+id+'"'+(SPT===id?'':' hidden')+'>'+html+'</section>'}
var _osd62=openSpeciesDetail;
openSpeciesDetail=function(k){
  _osd62(k);
  var body=document.getElementById('sheetbody');if(!body||body.querySelector('.spx'))return;
  var sp=SPB[k],name=sp?sp.n:((allSpecies().filter(function(x){return x.k===k})[0]||{}).n);if(!name)return;
  var key=spiKey(name),S=(key&&SPI[key])||{},L=key&&SPL[key],mine=spiMine(name);
  /* lo que ya había: lo reordeno en vez de duplicarlo */
  var old={},blocks=[].slice.call(body.querySelectorAll('.block'));
  blocks.forEach(function(b){
    var e=b.querySelector('.eyebrow'),t=e?e.textContent:'';
    if(t==='Tus capturas')b.remove();
    else if(t==='Cuándo la pillas'){old.cond=b.outerHTML;b.remove()}
    else if(t==='Cómo reconocerla'){old.tip=b.outerHTML;b.remove()}
    else if(t==='Ficha de pesca'){old.fi=b.outerHTML;b.remove()}
  });
  var tabs=[['res','Resumen'],['pes','Pescar',!!(S.cebos||S.hora||S.cond||S.montaje||old.fi)],['mit','Mitos',!!(S.mitos&&S.mitos.length)],['leg','Legal'],['fic','Ficha']].filter(function(t){return t[2]===undefined||t[2]});
  if(tabs.map(function(t){return t[0]}).indexOf(SPT)<0)SPT='res';
  var chips='<div class="spchips">'+(S.tag?'<span class="spchip">'+esc(S.tag)+'</span>':'')+(L?'<span class="spchip lg">📏 '+esc(L.t)+'</span>':'')+spiSeasonBadge(S)+'</div>';
  var nav='<div class="spx-nav" role="tablist">'+tabs.map(function(t){return '<button type="button" role="tab" class="'+(SPT===t[0]?'on':'')+'" data-a="spx-tab" data-v="'+t[0]+'" aria-selected="'+(SPT===t[0])+'">'+t[1]+'</button>'}).join('')+'</div>';
  var panels=spiPanel('res',spiTabRes(name,S,L,mine,old))+(tabs.some(function(t){return t[0]==='pes'})?spiPanel('pes',(old.fi||'')+spiTabPescar(name,S,mine)):'')+(tabs.some(function(t){return t[0]==='mit'})?spiPanel('mit',spiTabMitos(S)):'')+spiPanel('leg',spiTabLegal(name,key))+spiPanel('fic',spiTabFicha(S,old));
  var wrap='<div class="spx">'+chips+nav+panels+'</div>';
  var sci=body.querySelector('.sci');
  if(sci)sci.insertAdjacentHTML('afterend',wrap);else body.insertAdjacentHTML('afterbegin',wrap);
};
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a="spx-tab"]'):null;if(!b)return;
  ev.stopPropagation();SPT=b.getAttribute('data-v');
  [].forEach.call(document.querySelectorAll('.spx-nav button'),function(x){var on=x===b;x.classList.toggle('on',on);x.setAttribute('aria-selected',on)});
  [].forEach.call(document.querySelectorAll('.spx .spp'),function(p){p.hidden=p.getAttribute('data-p')!==SPT});
  var n=document.querySelector('.spx-nav');if(n&&n.scrollIntoView)n.scrollIntoView({block:'nearest'});
},true);
(function(){var s=document.createElement('style');s.textContent=
'.detail-art{padding:10px!important}.detail-art svg{width:auto!important;max-width:78%;max-height:128px}.detail-art img{width:auto!important;max-width:100%;max-height:150px;object-fit:contain}.spx{margin-top:12px}.spchips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}'+
'.spchip{display:inline-flex;align-items:center;padding:5px 10px;border-radius:99px;font:600 12px var(--display);background:var(--surface2);border:1px solid var(--line);color:var(--muted)}.spchip.lg{color:var(--accent);border-color:rgba(58,208,200,.4);background:var(--accent-soft)}.spchip.hot{color:#ffb454;border-color:rgba(255,180,84,.45);background:rgba(255,180,84,.1)}.spchip.ok{color:var(--ok);border-color:rgba(61,220,151,.4);background:rgba(61,220,151,.08)}.spchip.off{color:var(--no);border-color:rgba(255,92,92,.35)}'+
'.spx-nav{display:flex;gap:4px;padding:4px;border-radius:16px;background:var(--surface2);border:1px solid var(--line);position:sticky;top:0;z-index:3;margin-bottom:12px;overflow-x:auto}'+
'.spx-nav button{flex:1;min-height:38px;padding:6px 10px;border-radius:12px;border:0;background:transparent;color:var(--muted);font:600 13px var(--display);white-space:nowrap}.spx-nav button.on{background:var(--accent);color:#06201f}'+
'.spp[hidden]{display:none}.spp .block{margin-top:12px}.spp .block:first-child{margin-top:0}'+
'.spx-tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.spx-tiles>div{border-radius:16px;background:linear-gradient(180deg,var(--surface2),var(--surface));border:1px solid var(--line);padding:12px 4px;text-align:center}.spx-tiles b{display:block;font:800 24px var(--display)}.spx-tiles small{color:var(--muted);font-size:11px;line-height:1.2;display:block}'+
'.spx-ks{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.spx-k{border-radius:16px;border:1px solid var(--line);background:var(--surface);padding:11px 12px;display:flex;flex-direction:column;gap:2px}.spx-k span{color:var(--muted);font-size:12px}.spx-k b{font:700 15px var(--display)}.spx-k small{color:var(--dim);font-size:11.5px}'+
'.spm{display:grid;grid-template-columns:repeat(12,1fr);gap:4px;align-items:end;margin-top:8px}.spmc{display:flex;flex-direction:column;align-items:center;gap:3px;border-radius:8px;padding:2px 0}.spmc b{font:600 10px var(--mono);color:var(--accent);min-height:12px}.spmb{display:flex;align-items:flex-end;width:100%;height:54px;border-radius:6px;background:var(--surface2)}.spmb i{display:block;width:100%;border-radius:6px;background:var(--accent)}.spmc em{font:600 10px var(--mono);color:var(--dim);font-style:normal}'+
'.spmc.ok .spmb{background:rgba(61,220,151,.14)}.spmc.pk .spmb{background:rgba(255,180,84,.22)}.spmc.now em{color:var(--ink);text-decoration:underline}'+
'.spleg{font-size:12px;color:var(--muted);margin:8px 0 2px}.spleg i{display:inline-block;width:10px;height:10px;border-radius:3px;margin:0 3px 0 6px;vertical-align:-1px}.spleg i.ok{background:rgba(61,220,151,.4)}.spleg i.pk{background:rgba(255,180,84,.55)}'+
'.spb{display:flex;flex-direction:column;gap:7px;margin-top:8px}.spbr{display:grid;grid-template-columns:96px 1fr 24px;gap:8px;align-items:center;font-size:13px}.spbr u{height:8px;border-radius:99px;background:var(--surface2);overflow:hidden;text-decoration:none}.spbr u i{display:block;height:100%;border-radius:99px;background:var(--wave)}.spbr b{font:600 12px var(--mono);color:var(--muted);text-align:right}'+
'.spx-plan{display:flex;flex-direction:column;gap:8px;margin-top:8px}.spx-plan>div{display:grid;grid-template-columns:34px 76px 1fr;gap:8px;align-items:start;font-size:13.5px}.spx-plan i{font-style:normal;font-size:20px;line-height:1.2}.spx-plan b{font:700 13px var(--display)}.spx-plan span{color:var(--muted)}'+
'.spx-row{display:grid;grid-template-columns:30px 1fr;gap:8px;padding:8px 0;border-top:1px solid var(--line);font-size:13.5px}.spx-row:first-of-type{border-top:0}.spx-row>i{font-style:normal;font-size:19px}.spx-row b{display:block;font:700 14px var(--display)}.spx-row span{display:block;color:var(--muted)}.spx-row span.tx{color:var(--ink)}'+
'.spt{display:inline-block;font:600 10.5px var(--mono);font-style:normal;padding:2px 7px;border-radius:99px;margin:4px 6px 0 0;background:var(--surface2);border:1px solid var(--line);color:var(--muted)}.spt.of{color:#58a8ff;border-color:rgba(88,168,255,.4)}.spt.ci{color:var(--ok);border-color:rgba(61,220,151,.4)}.spt.pe{color:#ffb454;border-color:rgba(255,180,84,.4)}'+
'.spuse{display:inline-block;margin-top:4px;font:600 11px var(--mono);font-style:normal;color:var(--dim)}.spuse.on{color:var(--ok)}'+
'.sperr{margin:8px 0 0;padding-left:18px;color:var(--muted);font-size:13.5px}.sperr li{margin:3px 0}'+
'.spmit{border-top:1px solid var(--line)}.spmit>summary{list-style:none;cursor:pointer;display:flex;gap:10px;align-items:flex-start;justify-content:space-between;padding:11px 0}.spmit>summary::-webkit-details-marker{display:none}.spq{font:600 14px/1.3 var(--display)}.spmb2{padding:0 0 12px;font-size:13.5px;color:var(--muted)}.spmb2 p{margin:0 0 8px}'+
'.spmy{display:flex;flex-direction:column;gap:3px;padding:10px 12px;border-radius:12px;background:var(--surface2);border:1px solid var(--line);margin:0}.spmy small{color:var(--muted)}'+
'.spx-legal{display:grid;grid-template-columns:1fr;gap:8px}.spx-legal>div{border-radius:16px;border:1px solid rgba(58,208,200,.35);background:linear-gradient(135deg,rgba(58,208,200,.12),var(--surface));padding:12px 14px}.spx-legal small{color:var(--muted);font-size:12px}.spx-legal b{display:block;font:700 16px/1.25 var(--display);margin-top:2px}'+
'.spx-warn{margin-top:10px;padding:12px 14px;border-radius:14px;border:1px solid rgba(255,180,84,.45);background:rgba(255,180,84,.08);font-size:13.5px;color:var(--ink)}'+
'.spsrc{display:block;padding:9px 0;border-top:1px solid var(--line);font-size:13.5px;color:var(--accent);text-decoration:none}.spsrc:first-of-type{border-top:0}'+
'.spx-facts{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}.spx-facts>div{border-radius:14px;background:var(--surface2);border:1px solid var(--line);padding:10px 12px}.spx-facts small{color:var(--muted);font-size:11.5px;display:block}.spx-facts b{font:700 14px/1.25 var(--display)}';
document.head.appendChild(s)})();
