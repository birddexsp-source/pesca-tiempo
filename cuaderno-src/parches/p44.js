/* ===== p44: notas de voz más limpias — sin «Descargar audio» (los audios ya viven en la app y se sincronizan) ===== */
var _lvReg44=lvRegHTML;
lvRegHTML=function(d){
  var h=_lvReg44(d);if(!h)return h;
  return h.replace(/<p class="hint" style="margin-top:8px">Para pasar un audio a texto[\s\S]*<\/div>$/,'</div>');
};
var _ovCard44=ovCard;
ovCard=function(){
  var h=_ovCard44();if(!h)return h;
  return h.replace(/<a class="btn small dlbtn"[\s\S]*?<\/a>/g,'')
    .replace('Son de una salida que se cerró sin guardar su registro. Escúchalos, descárgalos o añádelos a una salida.','Notas de voz que no están en ninguna salida. Elige a cuál pertenecen.');
};
/* la transcripción pasa a un desplegable discreto bajo el audio */
var _evRow44=lvEvRow;
lvEvRow=function(e){
  var h=_evRow44(e);
  return h.replace(/<small class="trx">«([\s\S]*?)»<\/small>/,'<details class="trxd"><summary>Ver texto</summary><p>$1</p></details>');
};
(function(){var s=document.createElement('style');s.textContent=
'.lvtl{position:relative}.lvtl .qcrow{gap:12px;padding:11px 0}.lvtl .qcrow time{width:42px;padding-top:4px}'+
'.lvtl .evi{width:30px;height:30px;line-height:30px;border-radius:50%;background:var(--accent-soft);font-size:14px;padding:0}'+
'.lvtl .qcm{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1}.lvtl .qcm b{font:700 15px var(--display)}.lvtl .qcm small{color:var(--muted);font-size:13px;line-height:1.35}'+
'.lvtl audio,.ovblk audio{width:100%;height:38px;margin-top:6px;color-scheme:dark;border-radius:999px}'+
'.trxd{margin-top:4px}.trxd summary{cursor:pointer;color:var(--accent);font:600 12.5px var(--display);list-style:none;padding:4px 0}.trxd summary::-webkit-details-marker{display:none}'+
'.trxd summary::after{content:" ▾"}.trxd[open] summary::after{content:" ▴"}'+
'.trxd p{margin:4px 0 0;padding:8px 12px;border-left:3px solid var(--accent);background:var(--accent-soft);border-radius:0 10px 10px 0;font-style:italic;color:var(--muted);line-height:1.4;font-size:13.5px}';
document.head.appendChild(s)})();
