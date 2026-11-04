/* ===== Talla mínima legal en Bizkaia (revisado 04-11-2026) ===== */
var LEGAL_REV='4 nov 2026';
var LEGAL_FONTS='GV = Gobierno Vasco, tabla «Caladero Cantábrico-Noroeste» (euskadi.eus, web modificada 06/2024) · RD = Real Decreto 560/1995 (consolidado 01/11/2025) · UE = Reglamento (UE) 2019/1241, anexo VII · Folleto = folleto de pesca recreativa del Gobierno Vasco (nov 2020).';
var LEGAL={
  abadejo:{m:'30 cm',s:'GV 30 · UE 30 · RD 30'},
  acedia:{m:'15 cm',s:'GV 15 · RD 15'},
  aguja:{m:'25 cm',s:'GV 25 · RD 25'},
  anchoa:{m:'12 cm',s:'GV 12 · UE 12 · RD 12'},
  besugo:{m:'40 cm',s:'GV 40 · UE 33 · RD 25',w:'Las normas no coinciden. El Gobierno Vasco publica 40 cm para Euskadi; ante la duda, 40 cm.'},
  boga:{m:'11 cm',s:'GV 11 · RD 11'},
  caballa:{m:'20 cm',s:'GV 20 · UE 20 · RD 20'},
  estornino:{m:'20 cm',s:'GV 20 · RD 20 (caballa y estornino, Scomber spp.)'},
  carbonero:{m:'35 cm',s:'GV 35 · RD 35'},
  chopa:{m:'23 cm',s:'GV 23 · RD 23'},
  congrio:{m:'58 cm',s:'GV 58 · RD 58 · Folleto 58'},
  dorada:{m:'19 cm',s:'GV 19 · RD 19 · Folleto 19'},
  jurel:{m:'15 cm',s:'GV 15 · UE 15 · RD 15 · Folleto 15'},
  lenguado:{m:'24 cm',s:'GV 24 · UE 24 · RD 24 · Folleto 24'},
  lisa:{m:'20 cm',s:'GV 20 · RD 20 («lisas o mubles»)'},
  capiton:{m:'20 cm',s:'GV 20 · RD 20 («lisas o mubles»)',w:'Se aplica el grupo «lisas o mubles»; la tabla no distingue especies.'},
  galua:{m:'20 cm',s:'GV 20 · RD 20 («lisas o mubles»)',w:'Se aplica el grupo «lisas o mubles»; la tabla no distingue especies.'},
  galupe:{m:'20 cm',s:'GV 20 · RD 20 («lisas o mubles»)',w:'Se aplica el grupo «lisas o mubles»; la tabla no distingue especies.'},
  morragute:{m:'20 cm',s:'GV 20 · RD 20 («lisas o mubles»)',w:'Se aplica el grupo «lisas o mubles»; la tabla no distingue especies.'},
  lubina:{m:'42 cm',s:'GV 42 (oeste de Donostia) / 44 (este) · RD 36, y 44 en CIEM 8a-8b · UE 36',w:'Bizkaia está al oeste de Donostia: 42 cm según el Gobierno Vasco. El Estado fija 44 cm en las divisiones CIEM 8a y 8b; si una pieza va justa, 44 cm es lo seguro. Cupo según el Gobierno Vasco: 5 kg por licencia y día al oeste de Donostia. Temporada indicada por el Gobierno Vasco: abril a diciembre.'},
  merlan:{m:'27 cm',s:'GV 27 · UE 27 · RD 23',w:'El RD trae 23 cm (valor antiguo); valen 27 cm.'},
  merluza:{m:'27 cm',s:'GV 27 · UE 27 · RD 27 · Folleto 27',x:'Cupo: 5 piezas por licencia y día (máx. 20 por barco con 4 o más licencias). Requiere declaración de desembarque.'},
  platija:{m:'25 cm',s:'GV 25 · RD 25 · Folleto 25'},
  remol:{m:'30 cm',s:'GV 30 · RD 30'},
  rodaballo:{m:'30 cm',s:'GV 30 · RD 30'},
  salema:{m:'15 cm',s:'GV 15 · RD 15'},
  salmonete:{m:'15 cm',s:'GV 15 · RD 15 · Folleto 15'},
  sardina:{m:'11 cm',s:'GV 11 · UE 11 · RD 11'},
  solla:{m:'27 cm',s:'GV 27 · UE 27 · RD 25',w:'El RD trae 25 cm (valor antiguo); valen 27 cm.'},
  'gallo-norte':{m:'20 cm',s:'GV 20 · UE 20 · RD 20 («gallos», Lepidorhombus spp.)'},
  reo:{m:'25 cm',s:'GV 25 · RD 25'},
  salmon:{m:'50 cm',s:'GV 50 · RD 50'},
  pulpo:{m:'1 kg',s:'RD 1 kg · Folleto 750 g (máx. 1 ejemplar)',w:'El Folleto del Gobierno Vasco dice 750 g y un solo ejemplar; el RD estatal dice 1 kg. Se muestra el más exigente.'},
  'pulpo-blanco':{m:'750 g',s:'Folleto 750 g (máx. 1 ejemplar)'},
  calamar:{m:'6 cm',s:'Folleto 60 mm · RD «por determinar»',x:'Cefalópodos (calamar, sepia, sepieta): máx. 5 kg en total.'},
  chipiron:{m:'6 cm',s:'Folleto 60 mm · RD «por determinar»',x:'Cefalópodos (calamar, sepia, sepieta): máx. 5 kg en total.'},
  sepia:{m:'8 cm',s:'Folleto 80 mm · RD «por determinar»',x:'Cefalópodos (calamar, sepia, sepieta): máx. 5 kg en total.'},
  camaron:{m:'3 cm',s:'Folleto 30 mm, máx. 200 g',w:'El Gobierno Vasco indica que en aguas exteriores los crustáceos están prohibidos para la pesca recreativa. Confírmalo antes de llevártelo.'},
  atun:{ban:'Prohibido pescarlo',s:'GV: atún rojo y pez espada, pesca prohibida'},
  bonito:{none:1,s:'GV (atún blanco)',x:'Sin talla mínima en la tabla. Cupo: 5 piezas por licencia y día (máx. 20 por barco con 4 o más licencias). Requiere autorización y declaración de desembarque.'},
  centolla:{ban:'Veda total',s:'Folleto 2020: veda total · GV: crustáceos prohibidos en aguas exteriores'},
  buey:{ban:'Veda total',s:'Folleto 2020: veda total · GV: crustáceos prohibidos en aguas exteriores'},
  necora:{ban:'Veda total',s:'Folleto 2020: veda total · GV: crustáceos prohibidos en aguas exteriores'},
  bogavante:{ban:'Veda total',s:'Folleto 2020: veda total · GV: crustáceos prohibidos en aguas exteriores'},
  langosta:{ban:'Veda total',s:'Folleto 2020: veda total · GV: crustáceos prohibidos en aguas exteriores'},
  rape:{pend:1,s:'RD 560/1995: talla por determinar'},
  'rape-negro':{pend:1,s:'RD 560/1995: talla por determinar'},
  faneca:{pend:1,s:'RD 560/1995: talla por determinar'},
  anguila:{pend:1,s:'RD 560/1995: talla por determinar'}
};
function legalHTML(k){
  var d=LEGAL[k],h='<div class="block szb"><span class="eyebrow">Talla mínima en Bizkaia</span>';
  if(!d){
    h+='<p class="szn">Sin talla mínima oficial publicada para el Cantábrico.</p><p class="szs">No figura en la tabla del Gobierno Vasco ni en el RD 560/1995. Si tienes dudas con una pieza, devuélvela.</p>';
  }else if(d.ban){
    h+='<p class="szm ban">'+d.ban+'</p><p class="szs">'+d.s+'</p>';
  }else if(d.pend){
    h+='<p class="szn">Talla por determinar.</p><p class="szs">'+d.s+'</p>';
  }else if(d.none){
    h+='<p class="szn">Sin talla mínima en la tabla.</p>'+(d.x?'<p class="szx">'+d.x+'</p>':'')+'<p class="szs">'+d.s+'</p>';
  }else{
    h+='<p class="szm">'+d.m+'</p>'+(d.w?'<p class="szw">'+d.w+'</p>':'')+(d.x?'<p class="szx">'+d.x+'</p>':'')+'<p class="szs">'+d.s+'</p>';
  }
  h+='<details class="szd"><summary>Fuentes y cómo medir</summary><p>'+LEGAL_FONTS+'</p><p>Las piezas por debajo de la talla se devuelven al mar. Se mide la longitud total, de la punta del hocico al final de la cola. Cupo general: 5 kg por licencia y día (o una pieza si la supera). Revisado el '+LEGAL_REV+'. Es una guía: la norma oficial manda.</p></details></div>';
  return h;
}
var _osd18=openSpeciesDetail;
openSpeciesDetail=function(k){
  _osd18(k);
  try{
    if(!SPB[k])return;
    var bl=[].slice.call(document.querySelectorAll('#sheet .block')).filter(function(b){var e=b.querySelector('.eyebrow');return e&&/Tus capturas/.test(e.textContent)})[0];
    if(bl)bl.insertAdjacentHTML('beforebegin',legalHTML(k));
  }catch(e){console.warn('legal',e)}
};
var _st18=document.createElement('style');_st18.textContent='.szb .szm{font:700 34px/1.1 var(--display,inherit);color:var(--accent);margin:2px 0 6px}.szb .szm.ban{font-size:22px;color:#ff8a80}.szb .szn{font:600 15px/1.35 var(--body,inherit);margin:4px 0}.szb .szw{background:rgba(245,176,65,.12);border:1px solid rgba(245,176,65,.4);border-radius:10px;padding:8px 10px;font-size:13px;line-height:1.4;margin:6px 0}.szb .szx{font-size:13px;line-height:1.4;margin:6px 0}.szb .szs{color:var(--muted);font:500 11px/1.4 var(--mono,monospace);margin:6px 0 0}.szb .szd{margin-top:8px;font-size:12px;color:var(--muted)}.szb .szd summary{cursor:pointer;font-weight:600}.szb .szd p{margin:6px 0 0;line-height:1.4}';
document.head.appendChild(_st18);
