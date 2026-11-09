/* ===== p60: pantalla «Salida en curso» más visual: cabecera en directo con cifras, capturar bien grande, tarjetas con más carácter ===== */
var _lc60=lvConsoleHTML;
lvConsoleHTML=function(){
  var h=_lc60(),i=h.indexOf('<div class="block lvhead">'),j=h.indexOf('<div class="lvgrid">');
  if(i<0||j<i||!SESS)return h;
  var s=SESS,cs=sessCounts(),L=s.companions||[],pl=(s.where||{})[''],rig=lvCurRig(),ri=(s.equipos||[]).indexOf(rig);
  var rg=rig?'<div class="lvh-rig">🎣 '+((s.equipos||[]).length>1?'Equipo '+esc(eqLetter(ri))+' · ':'')+esc(lvRigTxt(rig)||'equipo sin detallar')+'</div>':'';
  var head='<div class="lvh"><div class="lvh-top"><span class="lvlive"><i></i>EN DIRECTO</span><span class="lvh-mode">'+esc(s.mode||'Salida')+'</span></div>'+
    '<div class="lvh-tm" data-t0="'+(s.startedAt||0)+'">'+esc(lvDur(s.startedAt,Date.now()))+'</div>'+
    '<div class="lvh-loc">📍 '+esc((pl&&pl.name)||s.siteName||'Sin ubicación fija')+'</div>'+
    '<div class="lvh-st"><div><b>'+cs.m+'</b><small>'+(cs.m===1?'pez tuyo':'peces tuyos')+'</small></div>'+(L.length?'<div><b>'+cs.o+'</b><small>de compañeros</small></div>':'')+'<div><b>'+esc(lvHM(s.startedAt))+'</b><small>desde</small></div></div>'+rg+'</div>';
  return h.slice(0,i)+head+h.slice(j);
};
setInterval(function(){var e=document.querySelector('.lvh-tm');if(e&&SESS)e.textContent=lvDur(SESS.startedAt,Date.now())},20000);
(function(){var s=document.createElement('style');s.textContent=
'.lvh{position:relative;overflow:hidden;border-radius:22px;padding:16px 18px 16px;margin:0 0 12px;background:radial-gradient(120% 90% at 100% 0%,rgba(58,208,200,.28),transparent 60%),linear-gradient(180deg,var(--surface2),var(--surface));border:1px solid rgba(58,208,200,.35);box-shadow:0 10px 30px rgba(0,0,0,.3)}'+
'.lvh-top{display:flex;align-items:center;justify-content:space-between}.lvlive{display:inline-flex;align-items:center;gap:7px;font:700 11.5px var(--mono);letter-spacing:.08em;color:#ff8c8c}.lvlive i{width:9px;height:9px;border-radius:50%;background:#ff5c5c;box-shadow:0 0 0 0 rgba(255,92,92,.6);animation:lvpulse 1.6s infinite}'+
'@keyframes lvpulse{70%{box-shadow:0 0 0 9px rgba(255,92,92,0)}100%{box-shadow:0 0 0 0 rgba(255,92,92,0)}}'+
'.lvh-mode{font:600 12px var(--display);padding:4px 10px;border-radius:99px;background:var(--accent-soft);color:var(--accent)}'+
'.lvh-tm{font:800 46px/1.05 var(--display);letter-spacing:-.02em;margin:8px 0 2px}.lvh-loc{color:var(--muted);font-size:14px}'+
'.lvh-st{display:flex;gap:8px;margin-top:14px}.lvh-st>div{flex:1;border-radius:14px;background:rgba(255,255,255,.04);border:1px solid var(--line);padding:9px 6px;text-align:center}.lvh-st b{display:block;font:800 21px var(--display)}.lvh-st small{color:var(--muted);font-size:11.5px}'+
'.lvh-rig{margin-top:10px;font-size:12.5px;color:var(--muted);padding:7px 10px;border-radius:10px;background:rgba(255,255,255,.03)}'+
'.sheet.sess .lvgrid{gap:10px}.sheet.sess .lvb{border-radius:18px;background:linear-gradient(180deg,var(--surface2),var(--surface));min-height:96px;box-shadow:0 4px 14px rgba(0,0,0,.2)}.sheet.sess .lvb .ic{width:42px;height:42px;border-radius:13px;background:var(--accent-soft);display:grid;place-items:center;font-size:22px}'+
'.sheet.sess .lvb.main{min-height:92px;border-radius:20px;background:linear-gradient(135deg,rgba(58,208,200,.42),rgba(58,208,200,.12));border-color:var(--accent);box-shadow:0 8px 26px rgba(58,208,200,.22)}.sheet.sess .lvb.main .ic{width:52px;height:52px;border-radius:16px;background:var(--accent);color:#06201f;font-size:28px}.sheet.sess .lvb.main b{font-size:20px}'+
'.sheet.sess .block{border-radius:18px}.sheet.sess .block>h3{font:700 15px var(--display)}'+
'.sheet.sess .lvp .cav{box-shadow:0 0 0 2px var(--accent-soft)}';
document.head.appendChild(s)})();
