/* ===== p75: Hipótesis de Jon para mucha mar a corcho (plomo, masilla, bola de verdel, boya tensa) — en la Libretilla ===== */
/* Son ideas de Jon (vídeos de pesca que está viendo, nov. 2026), sin fuente contrastada todavía: se marcan «por probar» y se contrastan con sus salidas. */
LB.push(
 {id:'h1',tp:'h',tit:'Con mucha mar, menos plomo (o plomar «pasivo») para que el corcho no se hunda',src:['jn'],hip:true,
  txt:'Con mucha mar el plomo ajustado al corcho hace que, cuando llega la ola, el corcho no flote lo bastante, se tape o se hunda, y no se ve la picada.\nIdea: poner menos plomo (si el corcho aguanta 10 g, montar 5 g) para que flote más y se vea mejor la picada; o plomar de forma más pasiva, como hace la bola. Con 1,5–2,5 m de mar (sobre 2 m) la gente pesca más cerca de la rompiente, y para eso conviene un montaje así.'},
 {id:'h2',tp:'h',tit:'Masilla o cebo pesado, sin plomo',src:['jn'],hip:true,
  txt:'Usar masilla (o un cebo que pese bastante) y no poner plomo: la masilla ya pesa lo suficiente para hundirse, el corcho queda mucho más a flote y las picadas se notan más porque se ve hundirse el corcho.\nEs un cebo nuevo que Jon tiene que perfeccionar y ver cómo funciona; se usa con anzuelos triples (otro tipo de anzuelo).'},
 {id:'h3',tp:'h',tit:'Bola con engodo de verdel en vez de sardina',src:['jn'],hip:true,
  txt:'Hacer la bola con el engodo de verdel de casa: coger un poco de engodo (o sacar la carne) y mezclarlo con harina, sémola, arena… Es lo más cercano a la bola sin gastar mucho. Si se quiere gastar más, se puede hacer con sardinas.\nCebo a probar; mejor probarlo primero con mucha mar, que es cuando tiene sentido plomar poco.'},
 {id:'h4',tp:'h',tit:'Con mucha mar, boya tensa o al plomín: el sargo pica más seguro',src:['jn'],hip:true,
  txt:'Con mucha mar el sargo tiende a picar más seguro: la mar ya mueve mucho el cebo y no nota tu tensión, pero tú no sabes si el movimiento lo hace la ola o el pez. Por eso es más fácil pescar al plomín, o a boya con la boya bastante tensa: si la boya se hunde, hay pez.\nCon poca mar es más difícil engañarlo: a la mínima tensión desconfía, sobre todo al plomín o con la boya tensa.\nOtra idea: corcho más grande o muchísimo menos plomo; aunque la boya se mueva más, se puede sujetar con la caña en un sitio más estable.'}
);
LBA.push(
 {id:'a10',ic:'🌊',tit:'Mucha mar a corcho (≈1,5–2,5 m): que el plomo no ahogue el corcho',src:['jn'],hyp:true,
  hacer:['El corcho plomado justo se tapa o se hunde con la ola y no ves la picada','Prueba menos plomo (si el corcho aguanta 10 g, monta 5 g) para que flote más','O un corcho más grande, o muchísimo menos plomo','Pesca más cerca de la rompiente (con sobre 2 m de mar es lo que ves hacer a otros)','Sujeta la boya con la caña en un sitio estable, algo tensa, o pesca al plomín: si la boya se hunde, hay pez','Hipótesis tuya: pruébala y compárala con tus salidas']}
);
/* una fuente «jn» no es un enlace: se dice de dónde sale */
var _lsrc75=lbSrcHTML;
lbSrcHTML=function(ids){
  if(ids&&ids.length===1&&ids[0]==='jn')return '<p class="lbsrc">Idea tuya, de vídeos de pesca que estás viendo. Sin fuente contrastada todavía.</p>';
  return _lsrc75(ids);
};
var _lnv75=lbNivel;
lbNivel=function(e){if(e&&e.tp==='h')return {c:'lo',t:'Hipótesis tuya · por probar'};return _lnv75(e)};
var _lih75=lbItemHTML;
lbItemHTML=function(a){
  var h=_lih75.apply(this,arguments);
  if(a&&a.hyp)h=h.replace(/<span class="lbp [a-z]+">\d+ fuentes?<\/span>/,'<span class="lbp lo">Hipótesis tuya · por probar</span>');
  return h;
};
/* sección propia en la Libretilla */
function hySecHTML(){
  var L=LB.filter(function(x){return x.tp==='h'});
  return '<h4 class="eyebrow">Hipótesis tuyas · '+L.length+'</h4><p class="lbhint">Ideas que has visto o se te han ocurrido para mucha mar. Aún no están contrastadas: elígelas y las comparamos con tus salidas.</p>'+L.map(function(e){
    var on=HYP['l_'+e.id]&&HYP['l_'+e.id].probar,nv=lbNivel(e);
    var btn='<button type="button" class="btn small'+(on?' primary':'')+'" data-a="md-probar" data-id="l_'+e.id+'" aria-pressed="'+!!on+'">'+(on?'🧪 Lo probaré en la próxima salida ✓':'🧪 Probar en la próxima salida')+'</button>';
    return '<details class="lbit"><summary><span class="lbic">🧪</span><span class="lbt"><b>'+esc(e.tit)+'</b><small>'+nv.t+'</small></span><i class="uic" aria-hidden="true"></i></summary><div class="lbb">'+e.txt.split('\n').map(function(p){return '<p>'+esc(p)+'</p>'}).join('')+lbSrcHTML(e.src)+btn+'</div></details>';
  }).join('');
}
var _lbh75=lbHTML;
lbHTML=function(){
  var h=_lbh75(),k='<h4 class="eyebrow">Para contrastar con tus salidas',i=h.indexOf(k);
  var nIdeas=LB.filter(function(x){return x.tp!=='h'}).length,nH=LB.length-nIdeas;
  h=h.replace(/\d+ ideas con fuentes/,nIdeas+' ideas con fuentes · '+nH+' hipótesis tuyas');
  i=h.indexOf(k);
  return i<0?h:h.slice(0,i)+hySecHTML()+h.slice(i);
};
/* en directo: con mucha mar y a corcho, sugiere la a10 justo después de «mar movida» */
var _lsg75=lbSuggest;
lbSuggest=function(c){
  var out=_lsg75(c);
  try{
    var r=null;try{r=lvCurRig()}catch(e){}
    var mode=(r&&r.mode)||(typeof SESS!=='undefined'&&SESS&&SESS.mode)||'';
    if(c.wave!=null&&c.wave>=1.5&&(!mode||mode==='Corcho')&&!out.some(function(x){return x.a.id==='a10'})){
      var k=-1;out.forEach(function(x,j){if(x.a.id==='a2')k=j});
      var it={a:lbA('a10'),why:num(c.wave)+' m de ola a corcho',pers:[]};
      if(k<0)out.unshift(it);else out.splice(k+1,0,it);
    }
  }catch(e){}
  return out;
};
/* en el Plan: si la jornada prevista trae ≥1,5 m, avisa de la a10 */
var _lnx75=lbNext;
lbNext=function(){
  var n=_lnx75();
  try{
    if(n&&n.whi>=1.5&&!n.list.some(function(x){return x[0]==='a10'})){
      var k=-1;n.list.forEach(function(x,j){if(x[0]==='a2')k=j});
      var it=['a10','Mar de hasta '+num(n.whi)+' m: si vas a corcho, piensa el plomo'];
      if(k<0)n.list.unshift(it);else n.list.splice(k+1,0,it);
    }
  }catch(e){}
  return n;
};
