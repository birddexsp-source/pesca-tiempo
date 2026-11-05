/* ===== p41: registro de la salida del 5-nov-2026 (Piedra 1 → 2 → 3) a partir de los audios de Jon ===== */
/* Los audios se reconocen por su contenido (SHA-256), así que da igual el nombre o el id que tengan en el móvil. */
var RGH={"d4a564a2485261e4d8753bea4e93b340e461021e9fd7feeae0e37286ff0b57c7":"doslados","021944b5a5d2b99b805c3f22a3bc412287dd9d551fdcb275a55c2c93cec480ac":"p2cierra","6db6cdcafd63c424520729ac33900d50da92151907150ef7264a0f735dd3de5e":"roto2","e7d32534e2b5a1dccf19c897b925a9281ca7947c77e51d95b6b56e9e2ab6c016":"tragado","7fff766449298cf7859446460c9d7d270b60131d51138f62cb3c54b0e46780a4":"n4","dcff19b6b9721f174677a4fd1f8fe4a5b5d46e2ae35c8f6d6cd1915330f43eba":"nositio","718f1348e01006eda6d0d4d6f66dc1bec10f08b748d19a324a04027e545a7e91":"stopper","d19194b739b00e6805a6f7babdc63d7425eae39199fd08ea7cef71c3e11afb1d":"eq1","4286aa4dae368771177941cc53f799cfdcf4a9756ff5f51a0583b6c09bbeb9a2":"entradita","9e50a650f3b73146604fcd517dfac184338b0312117b693a852f1aa0f7f1e8fd":"cambio23","ec63d333390bb78a66acbb994f465fb0e482515f06d6542bd8e17525f760a6f9":"azul2","3dcc55a3b952e0e3c0a2d90364b890a1d0cd57aa1e1c902f5422f734fd1e2679":"llegada3"};
var RGFLAG='regDia20261105',RGDATE='2026-11-05';

/* notas con título y detalle visibles en el registro */
var _evRow41=lvEvRow;
lvEvRow=function(e){
  var h=_evRow41(e);if(!e)return h;
  if(e.title)h=h.replace(/<b>Nota de voz<\/b>|<b>Nota<\/b>/,'<b>'+esc(e.title)+'</b>');
  if(e.why&&e.type!=='spot'&&e.type!=='eq'&&h.indexOf(esc(e.why))<0)h=h.replace('</b>','</b><small>'+esc(e.why)+'</small>');
  return h;
};
function rgSha(blob){return blob.arrayBuffer().then(function(b){return crypto.subtle.digest('SHA-256',b)}).then(function(d){return Array.prototype.map.call(new Uint8Array(d),function(x){return ('0'+x.toString(16)).slice(-2)}).join('')})}
function rgEvents(A,mk){
  var m=mk||'';
  return [
    {type:'start',name:'Piedra 1',why:'Empezáis los dos aquí. Maik a la derecha (la zona buena); tú a la izquierda: sin agua, mucha piedra y muy poca espuma, impracticable. No había sitio para dos.'},
    {type:'eq',names:'Plomín → corcho',why:'Maik a la derecha; tú a la izquierda, sin fondo: con plomín había que lanzar muy lejos. Pasas a corcho para andar más ancho.',audio:A.eq1},
    {type:'eq',names:'Bajo con anzuelo nº 2 azul',why:'Pruebas por si no pican por el anzuelo. Sabes que las bogas lo romperán: «hacer de experimentador». (Habla de un 0,20; sin confirmar qué es.)',audio:A.azul2},
    {type:'spot',who:'',name:'Piedra 2',why:'No había sitio para dos en la Piedra 1. Maik sacó allí los 3 sargos (a la derecha); tú, casi sin capturas.',audio:A.nositio},
    {type:'eq',names:'Anzuelo nº 4',why:'Te rompe el anzuelo que llevabas (entiendes que el azul) y pones el nº 4. Fue en la Piedra 2. Picadas con el nº 4: sin confirmar.',audio:A.n4},
    {type:'spot',who:'',name:'Piedra 3',why:'Sin espuma y un solo sitio algo lejos en la Piedra 2. La 3 es un spot nuevo: más espuma y oleaje (no tiene la isla delante); a investigar y marcar spots.',audio:A.cambio23},
    {type:'note',title:'Llegada a la Piedra 3',why:'Varios spots posibles y más espuma. El sol da de cara y tu sombra se ve en el agua.',audio:A.llegada3},
    {type:'note',title:'Piedra 2: se cierra con esta marea',why:'Desde la Piedra 3, mirando atrás: con esta altura de marea y oleaje la Piedra 2 queda impracticable (sube mucho la ola y te mojas los pies). Solo funciona en bajamar, hasta cierta altura.',audio:A.p2cierra},
    {type:'eq',names:'Corcho con el stopper subido (a lo plomín)',why:'En la izquierda de la Piedra 3: peces pequeños y un sargo S.',audio:A.stopper},
    {type:'note',title:'Piedra 3: izquierda → derecha → izquierda',why:'Empiezas por la izquierda, luego a la derecha (la lasca): alguna boga. Poco fondo y más gente; vuelves a la izquierda.'},
    {type:'spot',who:m,name:'Piedra 3',why:(m?'':'Maik: ')+'Llega desde la Piedra 1 sin carnada (allí se podía pescar un poco más). Él a la derecha (el charco), tú a la izquierda. Unos 30 min antes de terminar.'},
    {type:'note',title:'Piedra 3: dos lados de lanzado',why:'Desde la Piedra 3 se puede lanzar a la izquierda y a la derecha. Idea: marcar el spot y hacia dónde lanzas (flechas).',audio:A.doslados},
    {type:'note',title:'La entradita (piedra sin confirmar)',why:'Misma piedra, pero pescas hacia dentro, en la entrada entre esa piedra y la siguiente, no a lo ancho. No recuerdas en qué piedra fue.',audio:A.entradita},
    {type:'eq',names:'Anzuelo pequeño plateado (de lubina) + carnada muy pequeña',why:'No entran sargos ni pez grande y no quieres gastar carnada. Con carnada y anzuelo grandes no pillabas boga. Corcho con el stopper subido, a lo plomín. Muchas bogas (y quizá una oblada): para entretenerte.'},
    {type:'eq',names:'Anzuelo pequeño (cambio)',why:'Una boga se lo tragó y hubo que romperlo. Te pasó varias veces.',audio:A.tragado},
    {type:'eq',names:'Anzuelo pequeño (cambio)',why:'Otro anzuelo roto por una boga; ya cambiado.',audio:A.roto2}
  ];
}
async function rgRun(force,tripId){
  if(!db||!window.__CQ)return false;
  var fl=await db.doc('gearMeta/'+RGFLAG).get();if(fl&&fl.exists&&!force)return false;
  var cand=trips.filter(function(t){return tripId?t.id===tripId:t.date===RGDATE});if(!cand.length)return false;
  var n=function(t){return catches.filter(function(c){return c.tripId===t.id}).reduce(function(a,c){return a+(c.items||[]).length},0)};
  cand.sort(function(a,b){return n(b)-n(a)});var t=cand[0];
  var tbl=window.__RGTEST||RGH,A={},matched={},ids=[];
  window.__CQ.B.forEach(function(r,id){var ty=String((r&&(r.type||(r.blob&&r.blob.type)))||'');if(r&&r.blob&&/^audio\//.test(ty))ids.push(id)});
  for(var i=0;i<ids.length;i++){var h=await rgSha(window.__CQ.B.get(ids[i]).blob),k=tbl[h];if(k){matched[ids[i]]=1;if(!A[k])A[k]=ids[i]}}
  if(!force&&Object.keys(A).length<3)return false;   // solo si de verdad están sus audios en este móvil
  var C=t.companions||[],mk=(C.filter(function(c){return /^(mai?k|mike|miquel|mikel)/i.test(c.name||'')})[0]||(C.length===1?C[0]:null)||{}).id||'';
  var base=Date.parse(RGDATE+'T08:00:00'),ev=rgEvents(A,mk).map(function(e,i){e.t=base+i*60000;e.noTime=true;e.rg=1;if(!e.audio)delete e.audio;if(e.type!=='spot')delete e.who;return e});
  var keep=(t.eventos||[]).filter(function(e){return e&&!e.rg&&!(e.audio&&matched[e.audio])});
  await db.doc('trips/'+t.id).update({eventos:ev.concat(keep)});
  await db.doc('gearMeta/'+RGFLAG).set({at:Date.now(),audios:Object.keys(A).length,trip:t.id});
  toast('Registro del 5 de noviembre ordenado ('+Object.keys(A).length+' de 12 audios colocados)');
  return {audios:Object.keys(A).length,trip:t.id};
}
window.__rgRun=rgRun;
/* se aplica una sola vez, cuando la salida del día ya está en el móvil */
(function(){var tries=0,w=setInterval(function(){tries++;if(tries>40){clearInterval(w);return}
  if(typeof db==='undefined'||!db||!trips||!trips.length||window.__RGTEST)return;
  if(!trips.some(function(t){return t.date===RGDATE}))return;
  clearInterval(w);setTimeout(function(){rgRun().catch(function(){})},2500);
},1500)})();

/* ---------- Anzuelo pequeño plateado (de lubina), alta única en Mi equipo ---------- */
(function(){var t=setInterval(function(){
  if(typeof db==='undefined'||!db)return;clearInterval(t);
  db.doc('gearMeta/seedAnzPeq1').get().then(function(m){
    if(m&&m.exists)return;
    return db.collection('gearInv').doc('anz-peq-plateado').set({kind:'anzuelo',modelo:'Anzuelo pequeño plateado (de lubina)',tipo:'Anzuelo simple',uso:'Carnada muy pequeña (bogas)',notas:['Muy pequeño y plateado, de lubina. Nº entre 8 y 10 (por confirmar).','Lo usas con carnadas muy pequeñas, con el corcho y el stopper subido (a lo plomín), cuando no entra pez grande y quieres divertirte con bogas.'],createdAt:Date.now()})
      .then(function(){return db.doc('gearMeta/seedAnzPeq1').set({at:Date.now()})}).then(function(){toast('Anzuelo pequeño plateado añadido a Mi equipo')});
  }).catch(function(){});
},2200)})();
