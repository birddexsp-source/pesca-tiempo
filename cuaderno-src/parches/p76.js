/* ===== p76: peso de cada captura, en gramos (opcional) ===== */

function gwInject(){
  var el=document.getElementById('cap-items');if(!el)return;
  var d=curDraft();if(!d||!d.items)return;
  var rows=el.querySelectorAll('.irow');
  for(var ix=0;ix<rows.length;ix++){
    var it=d.items[ix],r=rows[ix];if(!it||r.querySelector('.gwf'))continue;
    var f=document.createElement('div');f.className='field gwf';
    f.innerHTML='<label>Peso (g)</label><input type="text" inputmode="numeric" maxlength="5" autocomplete="off" placeholder="Opcional, en gramos" data-gw="'+ix+'" value="'+(it.g!=null?esc(String(it.g)):'')+'">';
    r.appendChild(f);
  }
}
var _ri76=renderItems;
renderItems=function(){_ri76.apply(this,arguments);gwInject()};
var _rci76=renderCapItems;
renderCapItems=function(){_rci76.apply(this,arguments);gwInject()};
document.addEventListener('input',function(ev){
  var t=ev.target;if(!t||!t.getAttribute||t.getAttribute('data-gw')==null)return;
  ev.stopPropagation();
  var d=curDraft(),it=d&&d.items&&d.items[+t.getAttribute('data-gw')];if(!it)return;
  var v=String(t.value).replace(/[^0-9]/g,'');if(v!==t.value)t.value=v;
  if(v)it.g=parseInt(v,10);else delete it.g;
},true);
var _it76=itemTxt;
itemTxt=function(i){var h=_it76(i);return i&&i.g?h+' · '+i.g+' g':h};
var _ic76=itemChip;
itemChip=function(i){var h=_ic76(i);return i&&i.g?h.replace(/<\/span>$/,'<small>'+i.g+' g</small></span>'):h};
/* ficha de la especie: pesos que has anotado (solo piezas tuyas con peso) */
function gwPesos(name){
  var k=norm(name),out=[];
  legs.forEach(function(l){
    catchesOfLeg(l).forEach(function(c){(c.items||[]).forEach(function(i){
      if(norm(i.species)!==k||!(i.n>0)||i.who||!(i.g>0))return;
      out.push({g:i.g,size:i.size||'',date:l.date||''});
    })});
  });
  return out.sort(function(a,b){return b.g-a.g});
}
function gwFmt(g){return String(g).replace(/\B(?=(\d{3})+(?!\d))/g,'.')+' g'}
function gwFecha(d){if(!d)return '';var m=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];return +d.slice(8,10)+' '+m[+d.slice(5,7)-1]}
var _str76=spiTabRes;
spiTabRes=function(name,S,L,mine,old){
  var h=_str76.apply(this,arguments);
  try{
    var P=gwPesos(name);if(!P.length)return h;
    var sum=0;P.forEach(function(p){sum+=p.g});
    var b='<div class="block gwblk"><span class="eyebrow">Peso de tus piezas</span><p class="gwsum"><b>'+P.length+'</b> '+(P.length===1?'pieza pesada':'piezas pesadas')+' · media <b>'+gwFmt(Math.round(sum/P.length))+'</b> · mayor <b>'+gwFmt(P[0].g)+'</b></p><div class="spb">'+P.slice(0,6).map(function(p){
      return '<div class="spbr gwr"><span>'+esc((p.size?p.size+' · ':'')+gwFecha(p.date))+'</span><u><i style="width:'+Math.max(6,Math.round(p.g/P[0].g*100))+'%"></i></u><b>'+gwFmt(p.g)+'</b></div>';
    }).join('')+'</div></div>';
    var k2=h.indexOf('<div class="block"><span class="eyebrow">Tallas que has sacado'),at=h.length;
    if(k2>=0){var nx=h.indexOf('<div class="block"',k2+10);if(nx>=0)at=nx}
    return h.slice(0,at)+b+h.slice(at);
  }catch(e){return h}
};
(function(){var s=document.createElement('style');s.textContent='.gwsum{margin:0 0 8px;font:500 13px var(--body);color:var(--muted,#9aa)}.gwsum b{color:var(--text,#eee)}.spbr.gwr{grid-template-columns:96px 1fr 58px}.gwr b{text-align:right;white-space:nowrap}';document.head.appendChild(s)})();
