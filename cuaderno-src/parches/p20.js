/* ===== Aparejo: posición del plomo con dibujo, anzuelo con enganche y grosor ===== */
['plomoPos','anzForma','anzGrosor'].forEach(function(k){if(EQKEYS.indexOf(k)<0)EQKEYS.push(k)});
var _eqList20=eqList;
eqList=function(t){var l=_eqList20(t);l.forEach(function(e){if(e&&e.aparejo==='Corrida')e.aparejo='Corrediza'});return l};
var PLPOS=[['madre','Plomo en la madre','Antes del quitavueltas'],['bajo','Plomo en el bajo','Después del quitavueltas']];
function rigSVG(mode,rig,pos){
  var Y=54,s='<svg class="rgs" viewBox="0 0 320 120" role="img" aria-label="Esquema del montaje" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
  var A='var(--accent)',M='var(--muted)';
  s+='<path d="M8 '+Y+'H306" stroke="'+M+'" stroke-width="1.6"/>';
  s+='<text x="8" y="'+(Y-9)+'" font-size="10" fill="'+M+'" stroke="none">caña</text>';
  var lead=function(x,on){return '<path d="M'+x+' '+(Y+2)+'v4" stroke="'+(on?A:M)+'"/><path d="M'+(x-8)+' '+(Y+22)+'a8 12 0 1 1 16 0a8 12 0 1 1-16 0z" fill="'+(on?A:'none')+'" fill-opacity="'+(on?.35:0)+'" stroke="'+(on?A:M)+'" '+(on?'':'stroke-dasharray="3 3" ')+'transform="translate(0,-3)"/>'};
  var floatX=96;
  if(mode==='Corcho'){
    var fija=rig==='Fija';
    if(!fija&&rig!=='Libre (a la deriva)')s+='<circle cx="52" cy="'+Y+'" r="3.4" fill="'+A+'" stroke="none"/><text x="52" y="'+(Y-12)+'" font-size="10" text-anchor="middle" fill="'+A+'" stroke="none">tope</text><path d="M60 '+(Y-3)+'h18m-4-3l4 3-4 3" stroke="'+A+'" stroke-width="1.6"/>';
    s+='<path d="M'+floatX+' '+(Y-22)+'c9 0 12 9 12 20 0 9-4 14-12 14s-12-5-12-14c0-11 3-20 12-20z" fill="var(--accent-soft)" stroke="'+A+'"/><path d="M'+floatX+' '+(Y-30)+'v8" stroke="'+A+'"/>';
    if(fija)s+='<circle cx="'+(floatX-14)+'" cy="'+Y+'" r="2.4" fill="'+A+'" stroke="none"/><circle cx="'+(floatX+14)+'" cy="'+Y+'" r="2.4" fill="'+A+'" stroke="none"/>';
    s+='<text x="'+floatX+'" y="'+(Y+34)+'" font-size="10" text-anchor="middle" fill="'+M+'" stroke="none">corcho</text>';
  }
  if(mode==='Corcho'||mode==='Plomín'){
    var sx=190;
    s+=lead(150,pos==='madre')+lead(236,pos==='bajo');
    s+='<circle cx="'+sx+'" cy="'+Y+'" r="5" fill="var(--bg)" stroke="'+A+'"/><path d="M'+sx+' '+(Y-5)+'v-3M'+sx+' '+(Y+5)+'v3" stroke="'+A+'"/>';
    s+='<text x="'+sx+'" y="'+(Y-14)+'" font-size="10" text-anchor="middle" fill="'+A+'" stroke="none">quitavueltas</text>';
    s+='<text x="268" y="'+(Y-8)+'" font-size="10" text-anchor="middle" fill="'+M+'" stroke="none">bajo</text>';
    s+='<text x="150" y="'+(Y+44)+'" font-size="10" text-anchor="middle" fill="'+(pos==='madre'?A:M)+'" stroke="none">plomo</text>';
    if(pos==='bajo')s+='<text x="236" y="'+(Y+44)+'" font-size="10" text-anchor="middle" fill="'+A+'" stroke="none">plomo</text>';
    s+='<g transform="translate(298,'+Y+')" stroke="'+A+'"><path d="M0 0v22a7 7 0 0 1-14 0v-3"/><path d="M-14 19l-3-4"/></g>';
    s+='<text x="298" y="'+(Y+44)+'" font-size="10" text-anchor="end" fill="'+M+'" stroke="none">anzuelo</text>';
  }
  return s+'</svg>';
}
function plomoUI(e,i,mode){
  if(mode!=='Corcho'&&mode!=='Plomín')return '';
  return '<div class="invrow"><span class="invl">Dónde va el plomo</span><div class="plpos">'+PLPOS.map(function(p){var on=e.plomoPos===p[0];return '<button type="button" class="chip'+(on?' on':'')+'" data-a="eq-s20" data-i="'+i+'" data-f="plomoPos" data-v="'+p[0]+'" data-g="apar" aria-pressed="'+on+'"><b>'+p[1]+'</b><small>'+p[2]+'</small></button>'}).join('')+'</div></div>'+rigSVG(mode,e.aparejo||'',e.plomoPos||'');
}
var _eqCard20=eqCard;
eqCard=function(e,i,n){
  var h=_eqCard20(e,i,n),mode=tripDraft&&tripDraft.mode;
  var pu=plomoUI(e,i,mode);
  if(pu){
    var rx=new RegExp('<div class="field"><label for="ef-'+i+'plomo">[\\s\\S]*?</div>');
    if(rx.test(h))h=h.replace(rx,function(m){return pu+m});
  }
  var W={Fino:1.4,Medio:2.8,Grueso:4.6};
  var ex='<div class="invrow"><button type="button" class="chip" data-a="eq-s20" data-i="'+i+'" data-f="anzuelo" data-v="Decathlon Caperlan" data-g="anz">Decathlon Caperlan</button></div>'+hookFG(e.anzForma,e.anzGrosor,'eq-hf','eq-hg').replace(/data-a="eq-hf"/g,'data-a="eq-s20" data-i="'+i+'" data-f="anzForma" data-g="anz"').replace(/data-a="eq-hg"/g,'data-a="eq-s20" data-i="'+i+'" data-f="anzGrosor" data-g="anz"');
  h=h.replace(new RegExp('(data-gk="e'+i+'anz"[\\s\\S]*?)</div></details>'),function(m,a){return a+ex+'</div></details>'});
  return h;
};
document.addEventListener('click',function(ev){
  var b=ev.target.closest?ev.target.closest('[data-a="eq-s20"]'):null;if(!b||!tripDraft)return;
  ev.stopPropagation();
  var e=tripDraft.equipos[+b.getAttribute('data-i')];if(!e)return;
  var f=b.getAttribute('data-f'),v=b.getAttribute('data-v');
  e[f]=(f==='anzuelo')?v:(e[f]===v?'':v);
  GOPEN.top=true;GOPEN['e'+b.getAttribute('data-i')+b.getAttribute('data-g')]=true;gearRepaint();
},true);
var _sum20=eqSecSum;
eqSecSum=function(e,s){
  var r=_sum20(e,s);
  if(s.k==='apar'&&e.plomoPos&&e.plomo)r=r.replace('plomo '+e.plomo+' g','plomo '+e.plomo+' g en '+(e.plomoPos==='madre'?'la madre':'el bajo'));
  else if(s.k==='apar'&&e.plomoPos&&!e.plomo)r=[r,'plomo en '+(e.plomoPos==='madre'?'la madre':'el bajo')].filter(Boolean).join(' · ');
  if(s.k==='anz'){var x=[e.anzForma?(e.anzForma==='Anilla'?'anilla':'paleta'):'',e.anzGrosor?e.anzGrosor.toLowerCase():''].filter(Boolean).join(', ');if(x)r=[r,x].filter(Boolean).join(' · ')}
  return r;
};
var _pill20=eqPillsArr;
eqPillsArr=function(e){
  var p=_pill20(e);
  p=p.map(function(x){return (e.plomoPos&&x.indexOf('Plomo ')===0)?x+' · '+(e.plomoPos==='madre'?'en la madre':'en el bajo'):x});
  if(e.plomoPos&&!e.plomo)p.push('Plomo en '+(e.plomoPos==='madre'?'la madre':'el bajo'));
  p=p.map(function(x){return (x.indexOf('Anzuelo ')===0)?x+[e.anzForma?' · '+(e.anzForma==='Anilla'?'anilla':'paleta'):'',e.anzGrosor?' · '+e.anzGrosor.toLowerCase():''].join(''):x});
  if(!e.anzuelo&&!e.anzueloNum&&(e.anzForma||e.anzGrosor))p.push('Anzuelo '+[e.anzForma==='Anilla'?'anilla':e.anzForma==='Paleta'?'paleta':'',(e.anzGrosor||'').toLowerCase()].filter(Boolean).join(', '));
  return p;
};
var _st20=document.createElement('style');_st20.textContent='.gear>.rgs,.gear>.invrow{grid-column:1/-1}.rgs{display:block;width:100%!important;max-width:none!important;height:auto!important;margin:6px 0 8px;background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:6px 4px;color:var(--ink)}.plpos{display:grid;grid-template-columns:1fr 1fr;gap:8px}.plpos .chip{display:flex;flex-direction:column;align-items:flex-start;gap:2px;text-align:left;height:auto;padding:10px 12px;border-radius:14px}.plpos .chip small{font-size:11px;opacity:.75;font-weight:500}';
document.head.appendChild(_st20);
