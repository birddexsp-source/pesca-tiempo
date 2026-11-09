/* ===== p51: si en la salida te mueves por varios spots pero solo hay una parada, el resumen lo dice ===== */
var _tdBody51=tdBody;
tdBody=function(t){
  var h=_tdBody51(t);
  if(TD&&TD.tab&&TD.tab!=='res')return h;
  try{
    var names=[];rtNodes(t).forEach(function(n){if(names.indexOf(n.name)<0)names.push(n.name)});
    var a=h.indexOf('<ol class="tl3">');if(a<0||names.length<2)return h;
    var b=h.indexOf('</ol>',a);if((h.slice(a,b).match(/<li /g)||[]).length!==1)return h;
    var m=/<div class="lh2"><b>[^<]*<\/b>/.exec(h.slice(a,b));if(!m)return h;
    var nw='<div class="lh2"><b>'+names.map(esc).join(' → ')+'</b>';
    var seg=h.slice(a,b).replace(m[0],nw),k=seg.lastIndexOf('</div></li>');
    seg=seg.slice(0,k)+'<p class="hint" style="margin:4px 0 0">Una sola parada: las condiciones y la nota son de toda la salida, en la que pasaste por '+names.length+' spots.</p>'+seg.slice(k);
    h=h.slice(0,a)+seg+h.slice(b);
  }catch(e){}
  return h;
};
