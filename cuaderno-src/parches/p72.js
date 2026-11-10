/* ===== p72: Libretilla del maestro — qué probar según la situación, verdades, mitos y hipótesis contrastadas con fuentes ===== */
/* Fuentes leídas y contrastadas (nov. 2026). Cada entrada dice cuáles la respaldan; si discrepan, se marca «discutido». */
var LBSRC={
  ai:{t:'AIPeces · Pesca del sargo desde costa',u:'https://www.aipeces.com/blog/pesca-del-sargo-desde-costa'},
  hp:{t:'HayPesca · Pesca del sargo en España',u:'https://www.haypesca.es/pesca-sargo-espana/'},
  mp:{t:'Mundo Pesquero · Sargo',u:'https://mundopesquero.com/especies/esparidos/sargo/'},
  pc:{t:'PescaCosmar · La pesca del sargo',u:'https://www.pescacosmar.com/blog/la-pesca-del-sargo/'},
  p3:{t:'Pesca Deportiva 360 · Sargo',u:'https://pescadeportiva360.com/especies/sargo/'},
  tc:{t:'Todas Cosas Pesca · Aparejos para sargo',u:'https://todascosaspesca.com/los-mejores-aparejos-para-sargo/'},
  pn:{t:'PescaPlus · Sargo en Noja (Cantabria)',u:'https://pescaplus.es/pesca/sargo/noja'},
  gi:{t:'Giacalone et al. 2022 · Ecología del movimiento del sargo (Env. Biol. Fishes)',u:'https://link.springer.com/article/10.1007/s10641-022-01258-0'}
};
/* tipo: v verdad · m mito · d discutido (las fuentes se contradicen: lo decides tú con tus salidas). chk: dimensión del motor para mirar tus datos */
var LB=[
 {id:'v1',tp:'v',tit:'Mar algo movida y agua revuelta activan al sargo',txt:'Espuma pegada a la piedra y agua oxigenada. Siempre «sin pasarse»: en temporales fuertes los adultos dejan las zonas someras expuestas y se van a más fondo (estudio).',src:['ai','mp','pc','p3','pn','gi'],chk:{d:'ola',k:'baja',claim:'-',w:'Mar de menos de 1 m'}},
 {id:'v2',tp:'v',tit:'Con mar plato y agua clara se vuelve desconfiado',txt:'Es lo que más repiten: los grandes se vuelven muy difíciles. Con luna llena y mar calmado, aún más.',src:['ai','mp','pc','hp'],chk:{d:'agua',k:'cristal',claim:'-',w:'Agua cristal'}},
 {id:'v3',tp:'v',tit:'Bajo de fluorocarbono fino, no de nylon',txt:'Rango que citan: 0,20–0,25 (AIPeces), 0,22–0,28 (HayPesca; 0,20–0,22 con agua clara y sargos grandes), 0,20–0,28 a corcho y hasta 0,35 en fondo (Todas Cosas), 0,23–0,30 a boya (PescaCosmar).',src:['ai','hp','tc','pc']},
 {id:'v4',tp:'v',tit:'Bajo largo para que el cebo se mueva natural',txt:'Entre 50 cm y 1,5 m en fondo (más largo con agua clara); a corcho, de 1 a 2 m o más (algo más si el mar está muy revuelto). Con mucha corriente o fondo abrupto, más corto.',src:['tc','mp','pc','hp']},
 {id:'v5',tp:'v',tit:'Anzuelo pequeño-medio y muy afilado',txt:'Del nº 6 al 1/0 según cebo y montaje; el 4–6 es donde más guías coinciden. Uno demasiado grande lo rechaza; uno demasiado pequeño clava mal.',src:['ai','hp','tc','pc']},
 {id:'v6',tp:'v',tit:'Cebo fresco y natural de esa zona',txt:'Mejillón fresco rinde mucho más que congelado. Si el cebo no existe de forma natural en esa costa, el sargo grande suele ignorarlo. Los cebos muy llamativos le dan desconfianza. Cangrejo blando (en muda) es de los más citados.',src:['hp','mp','pc','ai']},
 {id:'v7',tp:'v',tit:'Otoño: la mejor época para los grandes',txt:'Más mar y agua tomada. En Cantabria la temporada se da de octubre a marzo. En primavera cuesta más (desove).',src:['pc','p3','ai','pn','hp']},
 {id:'v8',tp:'v',tit:'Pesca cerca de la rompiente, no lejos',txt:'Entre 1 y 10 m de profundidad, en la espuma. «Lanzar más lejos» no da más sargos.',src:['ai','pn','mp']},
 {id:'v9',tp:'v',tit:'Un solo anzuelo para los grandes',txt:'Los sargos grandes son solitarios y rehúyen los dobletes.',src:['pc','mp']},
 {id:'v10',tp:'v',tit:'Es muy fiel a su zona',txt:'Estudios con telemetría: residencia media del 75 % y 17 de 20 peces volvieron al sitio de captura 3 días después de soltarlos a 350 m. Si un spot da sargo, es probable que siga dándolo.',src:['gi']},
 {id:'v11',tp:'v',tit:'Si no pica, cambia de sitio; no insistas en el mismo',txt:'Tras sacar la primera pieza ceba donde la encontraste; si no hay suerte, prueba otra zona en lugar de gastar más cebo.',src:['mp','pc']},
 {id:'m1',tp:'m',tit:'«Al sargo le gusta el agua tranquila»',txt:'Falso: el grande está en la espuma.',src:['ai','mp','pc','pn'],chk:{d:'agua',k:'cristal',claim:'-',w:'Agua cristal'}},
 {id:'m2',tp:'m',tit:'«Cuanto más lejos lance, más sargos»',txt:'Falso: premia al que se mete cerca de la rompiente.',src:['ai']},
 {id:'m3',tp:'m',tit:'«Todas las picadas valen»',txt:'Falso: el pequeño toquetea; el grande suele entrar con intención.',src:['mp']},
 {id:'m4',tp:'m',tit:'«El cebo que funciona en otra escollera sirve aquí»',txt:'Falso: responde a lo que come en ese tramo de costa.',src:['mp']},
 {id:'m5',tp:'m',tit:'«El mejillón congelado vale igual»',txt:'Falso: rinde mucho peor que fresco.',src:['hp']},
 {id:'m6',tp:'m',tit:'«El hilo grueso siempre es más seguro»',txt:'Depende: en agua clara y para los grandes, el grueso se nota y no pican. Pero si partes por roce, el hilo es demasiado fino para esa piedra.',src:['ai','hp','mp','tc']},
 {id:'m7',tp:'m',tit:'«Los grandes se mueven como los pequeños»',txt:'Falso: son territoriales y solitarios.',src:['mp','pc']},
 {id:'d1',tp:'d',tit:'¿Marea subiendo o bajando?',txt:'Una guía recomienda empezar con la marea subiendo (más cómodo en acantilado), otra dice que se activa en la bajada, otra habla de las 2 h alrededor del cambio, y en una reserva portuguesa se alimentaban en subida y pleamar. Nadie lo demuestra: tus salidas lo dirán.',src:['pc','pn','ai','gi'],chk:{d:'marea',k:'sube',claim:'+',w:'Marea subiendo'},hip:true},
 {id:'d2',tp:'d',tit:'¿Amanecer, mediodía o tarde?',txt:'AIPeces: amanecer y atardecer. PescaCosmar: tarde (a boya). Telemetría: pico entre mediodía y primera tarde. Mundo Pesquero: los grandes, con menos luz.',src:['ai','pc','gi','mp'],chk:{d:'franja',k:'alba',claim:'+',w:'Primera hora'},hip:true},
 {id:'d3',tp:'d',tit:'¿Pica de noche?',txt:'Unas guías dicen que es muy diurno; otras, que la noche es muy buena en verano-otoño y para los grandes en sitios muy pescados. En roca batida de noche no lo pruebes: la seguridad manda.',src:['ai','gi','p3','mp'],hip:false},
 {id:'d4',tp:'d',tit:'¿Clavar al primer toque o esperar?',txt:'AIPeces: clavar al primer mordisco es error (prueba y escupe). Mundo Pesquero: retrasar la clavada es error. Idea para probar: distingue el toque; toquecitos = pez pequeño, espera; toque con intención = clava.',src:['ai','mp'],hip:true},
 {id:'d5',tp:'d',tit:'¿Cebar con masilla?',txt:'PescaCosmar la usa (pan duro + sardina), pero solo con corriente a tu favor y sin gastar más si no hay picadas; AIPeces dice que en roca batida el engodo rinde menos.',src:['pc','ai'],hip:true},
 {id:'d6',tp:'d',tit:'¿Y con agua fría?',txt:'El rango óptimo que citan es 15–24 °C (óptimo 19), pero en Cantabria la temporada de pesca es con agua de 12–19 °C. Apunta la temperatura del agua cuando la sepas.',src:['ai','pn'],hip:true}
];
/* ajustes por situación: qué cambiar cuando algo no va */
var LBA=[
 {id:'a1',ic:'🪞',tit:'Mar plato y agua clara: no pican',src:['ai','hp','tc','pc','mp'],chk:{d:'agua',k:'cristal',claim:'-',w:'Agua cristal'},
  hacer:['Afina el bajo: fluorocarbono de 0,20–0,22 mm','Alárgalo: 1,5–2 m a corcho','Anzuelo más pequeño (nº 4–6), muy afilado','Cebo fresco, fino y natural; nada llamativo','Busca un tramo con algo de espuma o espera a que entre más mar']},
 {id:'a2',ic:'🌊',tit:'Mar movida o agua tomada',src:['pc','tc','ai','mp'],chk:{d:'ola',k:'alta',claim:'+',w:'Mar de más de 1,8 m'},
  hacer:['Sube el bajo a 0,25–0,30 mm','Anzuelo del 2 al 1/0 con cebo bien atado (hilo elástico)','Boya y plomo más pesados si hay viento','Lances cortos, cerca de la rompiente','Seguridad primero: si dudas, no bajes a la roca']},
 {id:'a3',ic:'⏱',tit:'Sin picadas tras 30–40 minutos',src:['mp','pc','hp'],
  hacer:['Cambia de spot dentro del sitio','Revisa el bajo y el cebo (¿sigue entero y fresco?)','Prueba otro cebo natural de la zona','Sube o baja el corcho: cebo a 30–60 cm del fondo']},
 {id:'a4',ic:'👄',tit:'Te chupan el cebo o pican y no clavas',src:['tc','mp','ai','hp'],
  hacer:['Anzuelo más pequeño (nº 6–4) y recién afilado','Cebo fino y ajustado, con el anzuelo al borde','Distingue el toque: toquecitos, espera; con intención, clava','Bajo más largo y más fino']},
 {id:'a5',ic:'🐟',tit:'Se te come el cebo rápido: bogas y morralla',src:['mp','ai'],
  hacer:['Cebo duro: cangrejo, mejillón atado o lapa (selecciona talla)','Para el engodo un rato','Cambia de spot','Ojo: «si hay bogas el sargo desaparece» no está verificado; tus salidas lo dicen']},
 {id:'a6',ic:'✂️',tit:'Roturas y enganches',src:['mp','tc','ai'],
  hacer:['Si partes por roce, el hilo es demasiado fino para esa piedra: sube un escalón (dentro de 0,20–0,35)','Bajo más corto, pegado a la estructura','Al clavar, «cabeza arriba» los primeros segundos para que no llegue a la roca','Revisa el bajo tras cada roce']},
 {id:'a7',ic:'💨',tit:'Viento fuerte',src:['pc','tc','pn'],
  hacer:['Boya más pesada cuanto más viento, ajustada al plomo','El sargo responde mejor con viento flojo-moderado (8–22 kph en Noja)']},
 {id:'a8',ic:'🪱',tit:'Solo salen sargos pequeños',src:['mp','ai'],
  hacer:['Cebo y anzuelo más grandes','Cangrejo, lapa o mejillón para seleccionar talla','Un solo anzuelo, sin dobletes']},
 {id:'a9',ic:'🌀',tit:'Mucha corriente o fondo abrupto',src:['tc','ai','hp'],
  hacer:['Bajo más corto para no enredar','En surfcasting, plomos de agarre; a boya, fondo ligero si el corcho no se mantiene estable']}
];
function lbA(id){return LBA.filter(function(x){return x.id===id})[0]}
function lbNum(s){var n=parseFloat(String(s==null?'':s).replace(',','.'));return isNaN(n)?null:n}
/* tus datos: ¿confirman o contradicen la idea? */
function lbMine(chk){
  if(!chk)return null;
  var V;try{V=enV()}catch(e){return null}
  var g=enGroups(V,chk.d).filter(function(x){return x.k===chk.k})[0];
  if(!g||g.p.n<1)return {st:'nd',txt:'Aún sin datos: no tienes salidas con «'+chk.w.toLowerCase()+'»'};
  var ef=enEffects(V,[chk.d]).filter(function(e){return e.k===chk.k})[0];
  if(!ef)return {st:'nd',txt:'Aún sin diferencia clara ('+g.p.n+(g.p.n===1?' salida':' salidas')+' con «'+chk.w.toLowerCase()+'»)'};
  var ok=ef.dir===chk.claim;
  return {st:ok?'ok':'no',txt:(ok?'Tus datos lo confirman: ':'Tus datos lo contradicen: ')+enEffTxt(ef)+(ef.conf<2?' · pocas salidas':'')};
}
function lbNivel(e){
  var n=e.src.length;
  if(e.tp==='d')return {c:'dis',t:'Fuentes discrepan'};
  return n>=4?{c:'hi',t:n+' fuentes coinciden'}:n>=2?{c:'mid',t:n+' fuentes coinciden'}:{c:'lo',t:'Una sola fuente'};
}
function lbSrcHTML(ids){
  return '<p class="lbsrc">'+ids.map(function(k){var s=LBSRC[k];return s?'<a href="'+s.u+'" target="_blank" rel="noopener">'+esc(s.t)+'</a>':''}).join(' · ')+'</p>';
}
function lbMineHTML(chk){var m=lbMine(chk);return m?'<p class="lbmine '+m.st+'">📒 '+esc(m.txt)+'</p>':''}
/* equipo montado ahora */
function lbRig(){
  var o={fluoro:null,largo:null,anzuelo:''},r=null;
  try{r=lvCurRig()}catch(e){}
  if(!r)return o;
  o.fluoro=lbNum(r.fluoro);
  (r.used||[]).forEach(function(u){
    var it=(INV||[]).filter(function(x){return x.id===u.id})[0]||u;
    if(it.kind==='bajo'){if(o.fluoro==null)o.fluoro=lbNum(it.fluoro);o.largo=lbNum(it.largo);if(it.anzuelo)o.anzuelo=it.anzuelo}
    else if(it.kind==='linea'&&it.uso==='Bajo'&&o.fluoro==null)o.fluoro=lbNum(it.diam);
    else if(it.kind==='anzuelo'&&!o.anzuelo)o.anzuelo=it.num||'';
  });
  return o;
}
/* contexto de ahora mismo en la salida en directo */
function lbCtx(){
  var c={wave:null,wind:null,agua:null,min:0,fish:0,rit:null,cebo:null,pic:null,eq:null,boga:false,rig:lbRig()};
  if(typeof SESS==='undefined'||!SESS)return c;
  try{var P=planFor(todayISO()),cd=P&&!P.none?condAt(P,nowMin(todayISO())):null;if(cd){c.wave=cd.wave;c.wind=cd.wind}}catch(e){}
  var ev=(SESS.events||[]).filter(function(e){return e&&e.type==='agua'&&e.v});if(ev.length)c.agua=ev[ev.length-1].v;
  c.min=Math.max(0,Math.round((Date.now()-(SESS.startedAt||Date.now()))/60000));
  try{c.fish=sessCounts().m}catch(e){}
  try{var ref=qrRefLive(),g=function(q){var a=RS[qrId(ref,q)];return a&&a.a||null};c.rit=g('ritmo');c.cebo=g('cebo');c.pic=g('picadas');c.eq=g('equipo')}catch(e){}
  try{c.boga=mdLiveBogas().on}catch(e){}
  return c;
}
var LBCALMA=0.6,LBMOVIDA=1.2,LBSIN=30;
/* qué toca probar ahora: lista de {a,why,pers} por prioridad */
function lbSuggest(c){
  var out=[],f=c.rig.fluoro,L=c.rig.largo,ws=c.wave!=null?num(c.wave)+' m de ola':'';
  function lbAdd(id,why,pers){out.push({a:lbA(id),why:why,pers:pers||[]})}
  if(c.eq==='rotura'||c.eq==='enganches'||c.eq==='plomos')lbAdd('a6','Has dicho que tienes '+(c.eq==='rotura'?'roturas':c.eq==='enganches'?'enganches':'pérdidas de plomos'),f!=null&&c.eq==='rotura'?['Ahora llevas '+num(f,2)+' mm'+(f<0.25?': prueba un escalón más grueso':'')]:[]);
  if(c.cebo==='chupado'||c.cebo==='perdido'||c.pic==='si'||c.pic==='pelado')lbAdd('a4','Dices que '+(c.cebo==='chupado'?'te chupan el cebo':c.cebo==='perdido'?'pierdes el cebo':'notas picadas que no clavas'),c.rig.anzuelo?['Ahora llevas anzuelo '+c.rig.anzuelo]:[]);
  if(c.cebo==='comido'||c.rit==='bogas'||c.boga)lbAdd('a5',c.boga?'Están entrando bogas':'Dices que se come el cebo o que solo hay bogas',[]);
  var calma=(c.wave!=null&&c.wave<=LBCALMA)||c.agua==='cristal',movida=(c.wave!=null&&c.wave>=LBMOVIDA)||c.agua==='tomada'||c.agua==='chocolate';
  var mal=c.fish===0&&c.min>=20||c.rit==='nada'||c.rit==='poco';
  if(calma&&mal){
    var p=[];if(f!=null)p.push(f>0.22?'Llevas '+num(f,2)+' mm: baja a 0,20–0,22':'Llevas '+num(f,2)+' mm: ya es fino, juega con el largo');
    if(L!=null)p.push(L<120?'Tu bajo mide '+num(L,0)+' cm: prueba 150 cm o más':'Tu bajo ya mide '+num(L,0)+' cm');
    lbAdd('a1',[ws,c.agua==='cristal'?'agua cristal':'',c.min>=20?c.min+' min'+(c.fish===0?' sin picadas':''):''].filter(Boolean).join(' · ')||'Mar tranquila',p);
  }
  if(c.fish===0&&c.min>=LBSIN)lbAdd('a3','Llevas '+c.min+' min sin una captura',[]);
  if(movida){
    var p2=[];if(f!=null)p2.push(f<0.25?'Llevas '+num(f,2)+' mm: sube a 0,25–0,30':'Llevas '+num(f,2)+' mm, bien para mar movida');
    lbAdd('a2',[ws,c.agua==='tomada'||c.agua==='chocolate'?'agua '+agName(c.agua).toLowerCase():''].filter(Boolean).join(' · ')||'Mar movida',p2);
  }
  if(c.wind!=null&&c.wind>=20)lbAdd('a7','Viento de '+num(c.wind,0)+' kph',[]);
  var seen={};return out.filter(function(x){if(seen[x.a.id])return false;seen[x.a.id]=1;return true});
}
function lbProbadas(){var o={};((typeof SESS!=='undefined'&&SESS&&SESS.events)||[]).forEach(function(e){if(e&&e.type==='prueba')o[e.v]=1});return o}
function lbItemHTML(a,why,pers,open,probar,did){
  var h='<details class="lbit"'+(open?' open':'')+'><summary><span class="lbic">'+a.ic+'</span><span class="lbt"><b>'+esc(a.tit)+'</b>'+(why?'<small>'+esc(why)+'</small>':'')+'</span><i class="uic" aria-hidden="true"></i></summary><div class="lbb">';
  if(pers&&pers.length)h+='<p class="lbpers">'+pers.map(function(x){return '🎣 '+esc(x)}).join('<br>')+'</p>';
  h+='<ul class="lbul">'+a.hacer.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul>';
  if(a.chk)h+=lbMineHTML(a.chk);
  h+='<p class="lbniv"><span class="lbp '+lbNivel({src:a.src,tp:'v'}).c+'">'+a.src.length+' fuentes</span></p>'+lbSrcHTML(a.src);
  if(probar)h+='<button type="button" class="btn small'+(did?' primary':'')+'" data-a="lb-probar" data-id="'+a.id+'" aria-pressed="'+!!did+'">'+(did?'✓ Lo estoy probando':'🧪 Lo pruebo ahora')+'</button>';
  return h+'</div></details>';
}
/* en la salida en directo: qué probar ahora */
var _lch72=lvConsoleHTML;
lvConsoleHTML=function(){
  var h=_lch72(),S;
  try{
    var c=lbCtx();S=lbSuggest(c).slice(0,2);
    var hy=Object.keys(HYP||{}).filter(function(k){return /^l_/.test(k)&&HYP[k]&&HYP[k].probar}).map(function(k){return LB.filter(function(x){return 'l_'+x.id===k})[0]}).filter(Boolean);
    if(!S.length&&!hy.length)return h;
    var did=lbProbadas(),b='<div class="block lbn"><h3>📒 Libretilla · qué probar ahora</h3>';
    if(hy.length)b+=hy.map(function(x){return '<p class="lbhy">🧪 <b>Hoy contrastas:</b> '+esc(x.tit.replace(/^¿|\?$/g,''))+'</p>'}).join('');
    b+=S.map(function(s,i){return lbItemHTML(s.a,s.why,s.pers,i===0,true,did[s.a.id])}).join('');
    b+='</div>';
    var k='<div class="block"><h3>Cronómetro',i=h.indexOf(k);
    return i<0?h+b:h.slice(0,i)+b+h.slice(i);
  }catch(e){return h}
};
var _ler72=lvEvRow;
lvEvRow=function(e){
  if(e&&e.type==='prueba'){var a=lbA(e.v);return '<div class="qcrow"><time>'+(e.noTime?'·':esc(lvHM(e.t)))+'</time><span class="evi">🧪</span><div class="qcm"><b>Prueba: '+esc(a?a.tit:'ajuste')+'</b></div></div>'}
  return _ler72(e);
};
/* la libretilla en el Plan */
function lbNext(){
  var A;try{A=mdAdvice()}catch(e){return null}
  var c=A&&A.top&&A.top[0];if(!c)return null;
  var P=planFor(c.iso);if(!P||P.none)return null;
  var W=P.C.slice(c.best.a,c.best.b),w=W.map(function(x){return x.wave}).filter(function(x){return x!=null}),d=W.map(function(x){return x.wind}).filter(function(x){return x!=null});
  if(!w.length)return null;
  var whi=Math.max.apply(null,w),wlo=Math.min.apply(null,w),ag=c.pr&&c.pr.agua,ctx={wave:whi,wind:d.length?Math.max.apply(null,d):null,agua:ag||null,min:0,fish:0,rit:null,cebo:null,pic:null,eq:null,boga:false,rig:{fluoro:null,largo:null,anzuelo:''}};
  var calma=wlo<=LBCALMA||ag==='cristal',mov=whi>=LBMOVIDA||ag==='tomada'||ag==='chocolate',L=[];
  if(calma)L.push(['a1','Parte de la jornada con mar de '+num(wlo)+' m'+(ag==='cristal'?' y agua cristal':'')]);
  if(mov)L.push(['a2','Mar de hasta '+num(whi)+' m'+(ag==='tomada'||ag==='chocolate'?' y agua '+agName(ag).toLowerCase():'')]);
  if(ctx.wind!=null&&ctx.wind>=20)L.push(['a7','Viento de hasta '+num(ctx.wind,0)+' kph']);
  return {c:c,list:L,whi:whi,wlo:wlo};
}
function lbHTML(){
  var n=lbNext(),h='';
  if(n&&n.list.length){
    h+='<h4 class="eyebrow">Para tu próxima salida</h4><p class="lbhint">'+esc(mdDayShort(n.c.iso))+' · '+esc(n.c.name)+': lleva preparado el bajo para estas situaciones.</p>'+n.list.map(function(x,i){return lbItemHTML(lbA(x[0]),x[1],null,false,false,false)}).join('');
  }
  h+='<h4 class="eyebrow">Qué cambiar según la situación</h4>'+LBA.map(function(a){return lbItemHTML(a,'',null,false,false,false)}).join('');
  function sec(tp,title){
    var L=LB.filter(function(x){return x.tp===tp});
    return '<h4 class="eyebrow">'+title+' · '+L.length+'</h4>'+L.map(function(e){
      var nv=lbNivel(e),btn='';
      if(e.hip){var on=HYP['l_'+e.id]&&HYP['l_'+e.id].probar;btn='<button type="button" class="btn small'+(on?' primary':'')+'" data-a="md-probar" data-id="l_'+e.id+'" aria-pressed="'+!!on+'">'+(on?'🧪 Lo probaré en la próxima salida ✓':'🧪 Probar en la próxima salida')+'</button>'}
      return '<details class="lbit"><summary><span class="lbic">'+(tp==='v'?'✅':tp==='m'?'❌':'⚖️')+'</span><span class="lbt"><b>'+esc(e.tit)+'</b><small>'+nv.t+'</small></span><i class="uic" aria-hidden="true"></i></summary><div class="lbb"><p>'+esc(e.txt)+'</p>'+lbMineHTML(e.chk)+lbSrcHTML(e.src)+btn+'</div></details>';
    }).join('');
  }
  h+=sec('d','Para contrastar con tus salidas')+sec('v','Lo que casi todos dicen')+sec('m','Mitos');
  h+='<p class="lbfoot">Resumen de '+Object.keys(LBSRC).length+' fuentes: 7 guías de pesca y una revisión científica. No son los datos de millones de pescadores (no tengo acceso a eso): son lo que publican esas guías, contrastado. Cuando se contradicen, lo marco y decides tú con tus salidas. Los umbrales de «poca mar» (≤ '+num(LBCALMA)+' m) y «mucha mar» (≥ '+num(LBMOVIDA)+' m) son orientativos míos.</p>';
  return uiAccHTML('lib','📒','Libretilla del maestro',LBA.length+' ajustes · '+LB.length+' ideas con fuentes',h);
}
var _rh72=renderHoy;
renderHoy=function(){
  var h=_rh72();
  try{return h+lbHTML()}catch(e){return h}
};
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a="lb-probar"]'):null;if(!b)return;
  ev.stopPropagation();ev.preventDefault();
  if(typeof SESS==='undefined'||!SESS)return;
  var id=b.getAttribute('data-id');
  if(lbProbadas()[id])return;
  lvEv({type:'prueba',v:id});
  var host=document.getElementById('sessbody');if(host)host.innerHTML=lvConsoleHTML();
},true);
(function(){var s=document.createElement('style');s.textContent=
'.lbit{border:1px solid var(--line);border-radius:14px;margin:8px 0;background:var(--surface)}.lbit>summary{list-style:none;display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer}.lbit>summary::-webkit-details-marker{display:none}'+
'.lbic{flex:none;width:30px;height:30px;border-radius:10px;background:var(--surface2,rgba(255,255,255,.05));display:grid;place-items:center;font-size:16px}.lbt{flex:1;min-width:0;display:grid;gap:1px}.lbt b{font:700 14px/1.25 var(--display)}.lbt small{font:500 12px var(--body);color:var(--dim)}'+
'.lbit .uic{flex:none}.lbit[open]>summary .uic{transform:rotate(-135deg);margin-bottom:-3px}.lbb{padding:0 12px 12px;display:grid;gap:8px}.lbb p{font:500 13.5px/1.4 var(--body);margin:0}.lbul{margin:0;padding-left:18px;display:grid;gap:4px;font:500 13.5px/1.35 var(--body)}'+
'.lbsrc{font:500 11.5px/1.5 var(--body)!important;color:var(--dim)}.lbsrc a{color:var(--tide);text-decoration:none;border-bottom:1px dotted var(--tide)}.lbmine{padding:7px 10px;border-radius:10px;background:var(--surface2,rgba(255,255,255,.05))}.lbmine.ok{color:var(--ok)}.lbmine.no{color:#ff8f6b}.lbmine.nd{color:var(--dim)}'+
'.lbpers{padding:8px 10px;border-radius:10px;background:rgba(58,208,200,.1);border:1px solid rgba(58,208,200,.3)}.lbp{font:700 10.5px var(--mono);letter-spacing:.04em;text-transform:uppercase;padding:3px 8px;border-radius:999px;background:var(--surface2,rgba(255,255,255,.06))}.lbp.hi{color:var(--ok)}.lbp.mid{color:#f2b84b}.lbp.lo{color:#ff8f6b}'+
'.lbn .lbit{background:var(--bg,transparent)}.lbhy{font:500 13.5px var(--body);margin:0 0 6px}.lbhint,.lbfoot{font:500 12.5px/1.4 var(--body);color:var(--dim);margin:4px 0 8px}';
document.head.appendChild(s)})();
