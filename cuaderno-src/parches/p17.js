/* ===== versión web: GPS disponible (HTTPS) ===== */
var _qcStat17=qcStat;
qcStat=function(){
  _qcStat17();
  var b=document.querySelector('#qc-stat .qlb');
  if(b&&!b.querySelector('[data-a="qc-gps"]'))b.insertAdjacentHTML('afterbegin','<button type="button" class="btn small" data-a="qc-gps">Usar mi ubicación</button> ');
};
var _qcErr17=qcErr;
qcErr=function(){
  if(QC&&QC.useGps&&QC.gps!=='ok'&&QC.prevLast){
    QC.fromLast=QC.prevLast;QC.lat=QC.prevLast.lat;QC.lon=QC.prevLast.lon;QC.useGps=false;QC.gps='fail';
    toast('No he podido leer el GPS. Revisa el permiso de ubicación del navegador o marca el punto en el mapa.');qcPaint();return;
  }
  _qcErr17();
};
