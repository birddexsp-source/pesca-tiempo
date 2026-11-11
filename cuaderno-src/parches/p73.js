/* ===== p73: nota de voz en cualquier momento de la salida (un toque para grabar, otro para guardar) ===== */
var VQ={on:false,mr:null,t0:0,iv:null};
function vqBtnHTML(big){
  var on=VQ.on,s=on?Math.round((Date.now()-VQ.t0)/1000):0,tm=Math.floor(s/60)+':'+('0'+s%60).slice(-2);
  if(big)return '<button type="button" class="vqbig'+(on?' on':'')+'" data-a="vq-rec" aria-pressed="'+on+'"><span class="vqi">'+(on?'■':'🎙')+'</span><span><b>'+(on?'Grabando · <u class="vqt">'+tm+'</u>':'Nota de voz')+'</b><small>'+(on?'Toca para guardarla con la hora':'Toca, cuéntame lo que ves y toca otra vez')+'</small></span></button>';
  return '<button type="button" class="vqb'+(on?' on':'')+'" data-a="vq-rec" aria-label="'+(on?'Guardar nota de voz':'Grabar nota de voz')+'" aria-pressed="'+on+'">'+(on?'<span class="vqt">'+tm+'</span>■':'🎙')+'</button>';
}
var _sp73=sessPaint;
sessPaint=function(){
  _sp73();
  var bar=document.getElementById('sessbar');if(!bar||!SESS)return;
  var old=bar.querySelector('.vqb');if(old)old.remove();
  var end=bar.querySelector('[data-a="sess-end"]');
  if(end)end.insertAdjacentHTML('beforebegin',vqBtnHTML(false));
};
var _lc73=lvConsoleHTML;
lvConsoleHTML=function(){
  var h=_lc73(),k='<div class="lvgrid">',i=h.indexOf(k);
  return i<0?vqBtnHTML(true)+h:h.slice(0,i)+vqBtnHTML(true)+h.slice(i);
};
function vqRepaint(){
  sessPaint();
  var el=document.getElementById('sessbody');
  if(el&&!LS&&!LE&&!LNOTE)try{el.innerHTML=lvConsoleHTML()}catch(e){}
}
function vqToggle(){
  if(!SESS)return;
  if(VQ.on){try{VQ.mr.stop()}catch(e){}return}
  if(REC&&REC.on){toast('Para primero la otra grabación');return}
  if(!navigator.mediaDevices||!window.MediaRecorder){toast('Este navegador no puede grabar audio');return}
  navigator.mediaDevices.getUserMedia({audio:true}).then(function(st){
    var mr=new MediaRecorder(st),ch=[],ses=SESS;
    VQ={on:true,mr:mr,t0:Date.now(),iv:null};
    mr.ondataavailable=function(e){if(e.data&&e.data.size)ch.push(e.data)};
    mr.onstop=function(){
      try{st.getTracks().forEach(function(t){t.stop()})}catch(e){}
      clearInterval(VQ.iv);var t0=VQ.t0;VQ={on:false,mr:null,t0:0,iv:null};vqRepaint();
      var type=mr.mimeType||'audio/webm',bl=new Blob(ch,{type:type});
      if(!bl.size||!SESS||SESS!==ses)return;
      var prev=LA;LA={blob:bl,url:'',type:type};
      lvUpAudio().then(function(aud){
        LA=prev;
        if(!aud){toast('No se pudo guardar el audio. Inténtalo otra vez.');return}
        lvEv({type:'note',audio:aud,t:t0});toast('Nota guardada · '+lvHM(t0));vqRepaint();
      });
    };
    mr.start();
    VQ.iv=setInterval(function(){var s=Math.round((Date.now()-VQ.t0)/1000),x=Math.floor(s/60)+':'+('0'+s%60).slice(-2);[].forEach.call(document.querySelectorAll('.vqt'),function(e){e.textContent=x})},400);
    vqRepaint();
  }).catch(function(){toast('Sin permiso de micrófono')});
}
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a="vq-rec"]'):null;if(!b)return;
  ev.stopPropagation();ev.preventDefault();vqToggle();
},true);
(function(){var s=document.createElement('style');s.textContent=
'#sessbar .vqb{flex:none;min-width:38px;height:34px;padding:0 10px;border-radius:999px;border:1.5px solid rgba(58,208,200,.6);background:rgba(58,208,200,.14);color:#fff;font:700 13px var(--mono);display:inline-flex;align-items:center;gap:6px}#sessbar .vqb.on,.vqbig.on{background:#d9473f;border-color:#ff8f86;animation:vqp 1.4s infinite}'+
'.vqbig{display:flex;align-items:center;gap:12px;width:100%;margin:0 0 10px;padding:14px;border-radius:16px;border:1.5px solid rgba(58,208,200,.55);background:linear-gradient(135deg,rgba(58,208,200,.22),rgba(58,208,200,.08));color:var(--text);text-align:left}.vqbig .vqi{flex:none;width:44px;height:44px;border-radius:50%;background:rgba(58,208,200,.25);display:grid;place-items:center;font-size:22px}.vqbig b{display:block;font:700 16px var(--display)}.vqbig small{display:block;font:500 12.5px var(--body);color:var(--dim);margin-top:2px}.vqbig.on small{color:#fff}.vqbig u{text-decoration:none}'+
'@keyframes vqp{50%{box-shadow:0 0 0 7px rgba(217,71,63,.0);opacity:.85}0%{box-shadow:0 0 0 0 rgba(217,71,63,.6)}}';
document.head.appendChild(s)})();
