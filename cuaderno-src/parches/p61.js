/* ===== p61: datos de la ficha de especie — cada dato con su fuente y su nivel de fiabilidad =====
   of = oficial (BOE, Gobierno Vasco) · ci = ciencia (FishBase) · pe = pescadores (guías, blogs: hipótesis a comprobar con tus salidas)
   Revisado el 9-nov-2026. Lo que no tiene fuente, no está. */
var SPS={
  ev:['Gobierno Vasco · Tallas y cupos (act. 3-6-2024)','https://www.euskadi.eus/web01-a2arraku/es/contenidos/informacion/especies_tallas_cupos/es_def/index.shtml'],
  tabla:['Gobierno Vasco · Tallas mínimas Cantábrico-Noroeste','https://www.euskadi.eus/contenidos/informacion/especies_tallas_cupos/es_def/adjuntos/tablapesca.pdf'],
  folleto:['Gobierno Vasco · Guía de pesca recreativa (2.ª ed., nov 2020)','https://www.euskadi.eus/contenidos/autorizacion/licencias_pescamaritima_superf/es_def/adjuntos/Folleto_pesca_recreativa.pdf'],
  rd560:['BOE · Real Decreto 560/1995 (tallas mínimas)','https://www.boe.es/eli/es/rd/1995/04/07/560/con/20251101'],
  rd347:['BOE · Real Decreto 347/2011 (pesca de recreo en aguas exteriores)','https://www.boe.es/eli/es/rd/2011/03/11/347/con/20260319'],
  fbSargo:['FishBase · Diplodus sargus','https://fishbase.se/summary/Diplodus-sargus.html'],
  fbBoga:['FishBase · Boops boops','https://fishbase.se/summary/Boops-boops.html'],
  fbOblada:['FishBase · Oblada melanurus','https://fishbase.se/summary/Oblada-melanurus.html'],
  fbMojarra:['FishBase · Diplodus vulgaris','https://fishbase.se/summary/Diplodus-vulgaris.html'],
  mpSargo:['Mundo Pesquero · sargo (guía, opinión)','https://mundopesquero.com/especies/esparidos/sargo/'],
  mpBoga:['Mundo Pesquero · boga (guía, opinión)','https://mundopesquero.com/especies/esparidos/boga/'],
  mpOblada:['Mundo Pesquero · oblada (guía, opinión)','https://mundopesquero.com/especies/esparidos/oblada/'],
  mpMojarra:['Mundo Pesquero · mojarra (guía, opinión)','https://mundopesquero.com/especies/esparidos/mojarra/'],
  mpDorada:['Mundo Pesquero · dorada (guía, opinión)','https://mundopesquero.com/especies/esparidos/dorada/'],
  mpChopa:['Mundo Pesquero · chopa (guía, opinión)','https://mundopesquero.com/especies/esparidos/chopa/'],
  mpSalema:['Mundo Pesquero · salema (guía, opinión)','https://mundopesquero.com/especies/esparidos/salema/'],
  mpLubina:['Mundo Pesquero · lubina (guía sectorial)','https://mundopesquero.com/normativa-pesca-recreativa/especies-con-proteccion-diferenciada/lubina/'],
  aipSargo:['AiPeces · pesca del sargo desde costa (guía, opinión)','https://www.aipeces.com/blog/pesca-del-sargo-desde-costa'],
  aipPV:['AiPeces · pesca en el País Vasco (guía, opinión)','https://www.aipeces.com/blog/guia-de-pesca-en-el-pais-vasco'],
  hpBermeo:['Hay Pesca · pesca en Bermeo (guía local, opinión)','https://www.haypesca.es/pesca-en-el-puerto-de-bermeo/'],
  cebos:['Gobierno Vasco · Cebos (qué cebo para qué pez)','https://www.euskadi.eus/web01-a2arraku/es/contenidos/informacion/lic_recreo_cebos/es_11051/index.shtml']
};
/* reglas que valen para todas las especies */
var SPG=[
  ['🪪','Licencia','Hace falta licencia de pesca marítima de recreo. Desde los 16 años; los menores pueden pescar acompañados de un adulto con licencia.','folleto'],
  ['⚖️','Cupo general','5 kg por licencia y día, o una sola pieza si ella sola pasa de 5 kg.','ev'],
  ['🪝','Aparejos','Solo anzuelo (caña o línea de mano). Máximo 6 anzuelos o 2 poteras por licencia.','folleto'],
  ['📏','Bajo talla','Todo lo que no llegue a la talla mínima se devuelve al mar.','ev'],
  ['💶','Venta','Está prohibido vender o ceder las capturas de pesca recreativa.','rd347'],
  ['🚢','Distancias','A 100 m de artes profesionales y a 500 m de barcos profesionales. No se pesca en puertos durante la entrada o salida de barcos, ni en zonas de baño o reservas.','folleto'],
  ['🦀','Cebos vivos','En aguas exteriores no se pueden capturar crustáceos ni moluscos bivalvos. Cangrejo verde: 40 mm mínimo, 500 g máximo y cierre desde el 1 de mayo (consulta hasta cuándo).','folleto']
];
/* normativa por especie: t = talla mínima, c = cupo propio, v = temporada/veda, n = aviso, s = fuentes */
var SPL={
  lubina:{t:'42 cm al oeste de Donostia (44 cm al este)',c:'Oeste de Donostia: 5 kg por licencia y día. Este: 1 ejemplar por licencia y día.',v:'Temporada abril–diciembre',s:['ev','rd560','rd347','mpLubina'],
    n:'⚠️ Las fuentes no coinciden: el BOE (RD 560/1995) da 44 cm en las divisiones CIEM 8a y 8b, y una guía de 2026 habla de un máximo de 2 por pescador y día (sin confirmar). Además, el RD 347/2011 la trata como especie de protección diferenciada: en aguas exteriores pide autorización específica y declarar la captura en 24 h por la app del Ministerio. Confírmalo con el Gobierno Vasco antes de quedarte una.'},
  dorada:{t:'19 cm',s:['tabla','rd560']},
  chopa:{t:'23 cm',s:['tabla','rd560']},
  salema:{t:'15 cm',s:['tabla','rd560']},
  boga:{t:'11 cm',s:['tabla']},
  sargo:{t:'Sin talla mínima en el Cantábrico',n:'No figura en la tabla del Gobierno Vasco ni en el anexo del Cantábrico del RD 560/1995 (ahí solo aparece para el Mediterráneo y Canarias). Aun así cuenta para el cupo de 5 kg y conviene devolver los muy pequeños.',s:['tabla','rd560']},
  mojarra:{t:'Sin talla mínima en el Cantábrico',n:'No figura en la tabla del Gobierno Vasco ni en el anexo del Cantábrico del RD 560/1995.',s:['tabla','rd560']},
  oblada:{t:'Sin talla mínima en el Cantábrico',n:'No figura en la tabla del Gobierno Vasco ni en el RD 560/1995.',s:['tabla','rd560']},
  raspallon:{t:'Sin talla mínima en el Cantábrico',n:'No figura en la tabla del Gobierno Vasco ni en el RD 560/1995.',s:['tabla','rd560']},
  maragota:{t:'Sin talla mínima en el Cantábrico',n:'No figura en la tabla del Gobierno Vasco ni en el RD 560/1995.',s:['tabla','rd560']},
  besugo:{t:'25 o 40 cm según la fuente',n:'El RD 560/1995 dice 25 cm y la tabla del Gobierno Vasco 40 cm. Confírmalo antes de quedártelo. Cambia con la zona y la temporada.',s:['tabla','rd560']},
  pargo:{t:'15 cm',s:['tabla','rd560']},
  congrio:{t:'58 cm',s:['tabla','rd560']},
  jurel:{t:'15 cm',s:['tabla']},
  caballa:{t:'20 cm',v:'Pesca sobre todo abril–mayo; algún ejemplar suelto todo el año',s:['tabla','ev']},
  estornino:{t:'20 cm',s:['tabla']},
  lisa:{t:'20 cm',s:['tabla']},
  merluza:{t:'27 cm',n:'Especie de protección diferenciada: declaración de capturas.',s:['tabla','rd347']},
  lenguado:{t:'24 cm',s:['tabla']},
  platija:{t:'25 cm',s:['tabla']},
  rodaballo:{t:'30 cm',s:['tabla']},
  remol:{t:'30 cm',s:['tabla']},
  abadejo:{t:'30 cm',s:['tabla']},
  carbonero:{t:'35 cm',s:['tabla']},
  merlan:{t:'27 cm',s:['tabla']},
  salmonete:{t:'15 cm',s:['tabla']},
  acedia:{t:'15 cm',s:['tabla']},
  aguja:{t:'25 cm',s:['tabla']},
  sardina:{t:'11 cm',s:['tabla']},
  anchoa:{t:'12 cm',s:['tabla']},
  reo:{t:'25 cm',s:['tabla']},
  salmon:{t:'Pesca no permitida en Euskadi en 2026',s:['aipPV']},
  pulpo:{t:'750 g (guía 2020) o 1 kg (RD 560/1995)',c:'1 pulpo por día (guía 2020)',n:'Las dos fuentes difieren; la guía del Gobierno Vasco es la más restrictiva en cupo.',s:['folleto','rd560']},
  'atun-rojo':{t:'Pesca prohibida',s:['ev']}
};
/* conocimiento por especie. t = fiabilidad: of / ci / pe */
var SPI={
 sargo:{
  tag:'Espárido de roca · rompiente',
  facts:[['Tamaño máx.','45 cm · 1,9 kg','ci'],['Talla común','22 cm','ci'],['Vive hasta','10 años','ci'],['Profundidad','0–50 m','ci'],['Madura a','~2 años (17 cm)','ci'],['Desova','enero–marzo (dato general de la especie)','ci']],
  hab:'Roca y escollera cerca de la orilla; entra a la rompiente, sobre todo al amanecer (FishBase). Come invertebrados del fondo y marisco.',
  meses:{ok:[1,2,3,4,5,6,7,8,9,10,11,12],pk:[10,11,12,1,2,3],t:'pe',n:'Todo el año en roca; las guías vascas lo dan mejor con frío (otoño-invierno).'},
  hora:[['🌅','Amanecer','Su mejor momento en la rompiente; luego atardecer y los cambios de marea.','pe'],['☀️','De día','Es muy diurno; de noche casi no hay picada.','pe']],
  cond:[['🌊','Mar rizado o algo tomado lo activa; con calma y agua clara se vuelve desconfiado.','pe'],['🫧','Espuma pegada a la piedra y corriente que levanta el fondo, buena señal.','pe'],['🌡️','Agua cómoda entre 15 y 24 °C; óptimo ≈19 °C.','pe'],['📏','Zona productiva: 1–10 m de profundidad.','pe']],
  cebos:[['Cangrejo','Mejor blando o en muda; el más citado para grandes.','pe','cangrejo'],['Gusana / gusano de mar','Surfcasting y fondo ligero.','pe','gusan'],['Mejillón','Atado con hilo elástico; para seleccionar tamaño.','pe','mejill'],['Lapa','Para seleccionar ejemplares grandes.','pe','lapa'],['Quisquilla','En puertos y zonas de marea.','pe','quisq'],['Gamba','Sobre todo en puerto; atrae morralla.','pe','gamba'],['Erizo (carne)','Donde hay erizo; delicada de encarnar.','pe','erizo'],['Sardina fresca / masilla','Atrae mucha morralla.','pe','sardina']],
  montaje:[['Corcheo','Flotador discreto, bajo largo y cebo muy natural; rompiente y puertos.'],['Fondo ligero desde roca','Plomo justo, bajo largo, pegado a la estructura.'],['Anzuelo','Nº 6 al nº 1, acero fuerte y muy afilado; según el cebo.'],['Hilo','Bajo de fluorocarbono 0,20–0,25; línea 0,22–0,25. Sube el grosor si hay roca cerca.'],['Caña','3–3,9 m ligera para boya o fondo ligero.']],
  mitos:[
   {m:'«Al sargo le gusta el agua tranquila»',v:'falso',n:'Las guías dicen lo contrario: prefiere la espuma y el agua revuelta de la rompiente. Con calma y agua clara se vuelve muy desconfiado.',hyp:'tomadilla'},
   {m:'«Pica mejor tras un temporal, cuando baja el mar pero el agua sigue turbia»',v:'sin verificar',n:'Es tu hipótesis y la de varios foros. Aquí se comprueba con tus salidas.',hyp:'temporal'},
   {m:'«Si hay bogas, el sargo desaparece»',v:'sin verificar',n:'Lo cuentan pescadores. La boga forma bancos y se queda con el cebo.',hyp:'bogas'},
   {m:'«Pica de noche»',v:'falso',n:'Según las guías es un pez muy diurno; de noche rinden más lubina y congrio.'},
   {m:'«Hay que clavar al primer toque»',v:'falso',n:'Suele dar toques cortos antes de comer de verdad: espera a que el corcho o la puntera se hundan.'},
   {m:'«Si sabe a barro o es duro, es por mala frescura»',v:'sin verificar',n:'Una guía lo atribuye a ejemplares de zonas contaminadas (p. ej. pinturas antifouling). Sin dato sólido.'},
   {m:'«Hay que comprar material caro»',v:'depende',n:'Opinión de las guías: con una caña modesta cae si aciertas con zona, mar y cebo; mejor gastar en anzuelos, fluorocarbono y cebo fresco.'}
  ],
  plan:[['📍','Dónde','Roca o escollera con rompiente y fondo de 1–10 m, con piedra y claros de arena cerca.'],['🕒','Cuándo','Amanecer o cambio de marea; mar rizado o agua algo tomada.'],['🪱','Cebo','Cangrejo blando o mejillón; si no, gusana.'],['🎣','Montaje','Fondo ligero pegado a la piedra o corcheo con bajo largo.'],['👀','Señal','Toques cortos primero: espera la picada franca antes de clavar.']],
  err:['Pescar en agua tranquila en vez de en la rompiente','Cebo blando que se deshace en el lance','Clavar al primer mordisco','Hilo o anzuelo gruesos para un pez desconfiado','No revisar el bajo tras cada roce'],
  src:['fbSargo','mpSargo','aipSargo','aipPV','hpBermeo']
 },
 boga:{
  tag:'Pez de banco · puertos y escolleras',
  facts:[['Tamaño máx.','40 cm','ci'],['Talla común','20 cm','ci'],['Peso máx. publicado','455 g','ci'],['Vive hasta','11 años','ci'],['Madura a','13,6 cm','ci'],['Profundidad','0–350 m (normal 0–100)','ci']],
  hab:'Forma bancos sobre arena, fango, roca y algas; sube a la superficie sobre todo de noche. Omnívora: crustáceos y plancton (FishBase).',
  hora:[['🌅','Primeras y últimas luces','Es cuando más se acerca a puertos y espigones.','pe']],
  cond:[['🌊','Aguas claras o ligeramente tomadas, mar tendida y corriente suave.','pe'],['💨','Con mar fuerte «el banco se abre» y deja de picar.','pe']],
  cebos:[['Gusana','Fina, en anzuelo pequeño.','pe','gusan'],['Miga de pan trabajada','Cebo clásico de banco.','pe','pan'],['Masilla','Blanda y pequeña.','pe','masilla']],
  montaje:[['Pulso / corcheo','Cebos pequeños y bajos largos y finos.'],['Anzuelo','Pequeño, fino y resistente, con la punta revisada.']],
  mitos:[
   {m:'«La boga solo molesta»',v:'depende',n:'Para las guías también informa: si el banco está, el puesto tiene pez, y deja de picar cuando nota algo raro en el montaje o en ti.'},
   {m:'«Si entran bogas, el sargo se hunde»',v:'sin verificar',n:'Hipótesis de pescadores. Compárala con tus salidas.',hyp:'bogas'},
   {m:'«El cangrejo como cebo aleja a las bogas»',v:'sin verificar',n:'Se oye mucho; tus datos son los que dicen si es verdad.',hyp:'cangrejo'},
   {m:'«Los cebos duros (mejillón, cangrejo) las evitan»',v:'sin verificar',n:'Idea que circula entre pescadores, sin estudio detrás. Compárala con tus salidas.',hyp:'duro'}
  ],
  plan:[['📍','Dónde','Puertos, espigones y escolleras con fondo mixto, en poca agua.'],['🕒','Cuándo','Primeras y últimas horas de luz, con mar tendida.'],['🪱','Cebo','Gusana fina o miga de pan.'],['🎣','Montaje','Pulso o corcheo con bajo largo y fino; anzuelo pequeño.']],
  err:['Cebos voluminosos','Anzuelo visible','Golpear el agua sobre el banco','Insistir cuando el banco se ha abierto'],
  src:['fbBoga','mpBoga']
 },
 oblada:{
  tag:'Espárido de banco · desconfiado',
  facts:[['Tamaño máx.','36,6 cm','ci'],['Talla común','20 cm','ci'],['Peso máx. publicado','525 g','ci'],['Madura a','18,8 cm','ci'],['Profundidad','hasta 30 m','ci'],['Zona','del golfo de Bizkaia al Mediterráneo','ci']],
  hab:'Gregaria: forma grupos sobre fondos rocosos y praderas. Come sobre todo invertebrados pequeños (FishBase).',
  hora:[['☀️','De día, con buena luz','Es una especie de luz.','pe']],
  cond:[['🌊','Aguas claras o ligeramente tomadas, mar tranquila o poco movida y corriente suave.','pe'],['🫧','Con agua muy tomada o ruido en el puesto, el banco deja de comer.','pe']],
  cebos:[['Gusana fina','Anzuelo pequeño.','pe','gusan'],['Miga de pan trabajada','Con presentación natural.','pe','pan'],['Masilla blanda','Pequeña.','pe','masilla']],
  montaje:[['Pulso o caña ligera','Puertos y escolleras, lances cortos y bajos largos.'],['Anzuelo','Pequeño, punta muy afilada y alambre fino pero fiable; nudos pequeños.']],
  mitos:[{m:'«Es fácil en sitios poco pescados»',v:'depende',n:'La guía lo matiza: en puestos tocados se vuelve muy desconfiada.'}],
  plan:[['📍','Dónde','Escolleras, puertos y roca somera, de la superficie a ~10 m.'],['🕒','Cuándo','De día, con mar tranquila y agua clara o algo tomada.'],['🪱','Cebo','Gusana fina o pan trabajado, en pequeño.'],['👀','Señal','Si se asusta, para un rato: insistir tras espantar al banco no sirve.']],
  err:['Montajes bastos','Cebos grandes o mal equilibrados','Acercarte al agua y proyectar sombra','Insistir tras espantar al banco'],
  src:['fbOblada','mpOblada']
 },
 mojarra:{
  tag:'Espárido de fondos mixtos',
  facts:[['Tamaño máx.','45 cm · 1,3 kg','ci'],['Talla común','22 cm','ci'],['Madura a','16,6 cm','ci'],['Profundidad','0–160 m (normal 0–30)','ci'],['Vive hasta','~6 años','ci']],
  hab:'Fondos rocosos y a veces arena; los jóvenes, en praderas. Come crustáceos, gusanos y moluscos (FishBase).',
  hora:[],
  cond:[['🌊','Entra con mar calmada o rizada; con mar muy movida o agua muy turbia baja la actividad.','pe']],
  cebos:[['Gusana fina','Y gusano americano pequeño o coreano.','pe','gusan'],['Trozos de molusco','Frescos y bien presentados.','pe','mejill'],['Pequeños crustáceos','Parte de su dieta.','pe','quisq']],
  montaje:[['Surfcasting','Plomos de 100–130 g, bajos de dos anzuelos y lances medios.'],['Anzuelo','Del 6 al 8, alambre medio y punta muy afilada.'],['Bajo','Fluorocarbono o monofilamento fino de 20–35 cm; un hilo grueso o visible reduce las picadas.']],
  mitos:[{m:'«Es lo mismo que el sargo»',v:'falso',n:'Es otra especie (Diplodus vulgaris): dos bandas negras, una tras la cabeza y otra en el pedúnculo.'}],
  plan:[['📍','Dónde','Fondos mixtos: arena con piedra, conchas o algo de pradera, cerca de la orilla.'],['🪱','Cebo','Gusana fina o trozo de molusco fresco.'],['🎣','Montaje','Anzuelo pequeño (6–8) y bajo fino.']],
  err:['Anzuelos demasiado grandes','Bajos gruesos o vistosos','Cebos grandes','No leer las manchas de piedra o concha'],
  src:['fbMojarra','mpMojarra']
 },
 dorada:{
  tag:'Espárido de arena y canal',
  facts:[['Talla media (guía)','30–40 cm','pe'],['Buen ejemplar','45–50 cm','pe'],['Peso habitual','1–3 kg','pe']],
  hab:'Arena viva, fondos mixtos y canaletas, con algas o pradera cerca (guía de Mundo Pesquero).',
  hora:[['🌙','De noche en playas muy pescadas','Reduce su desconfianza.','pe']],
  cond:[['🌊','Cambios de marea, mar calmado o ligeramente rizado y agua clara o algo turbia.','pe'],['🌡️','Las subidas de temperatura ayudan.','pe']],
  cebos:[['Bivalvos (navaja)','Prefiere lo que reconoce como alimento habitual.','pe','navaja'],['Cangrejo','','pe','cangrejo'],['Erizo','','pe','erizo'],['Gusanas','','pe','gusan']],
  montaje:[['Anzuelo','Uno solo, acero resistente y punta afilada.'],['Bajo','Largo (más de 2 m), fluorocarbono de 0,12 a 0,16 para comederos lejanos.']],
  mitos:[{m:'«Las grandes comen siempre lejos»',v:'falso',n:'La guía dice que suelen entrar cerca, en las canaletas.'}],
  plan:[['📍','Dónde','Playas con canales o roca con arena; lee dónde se forman los comederos.'],['🪱','Cebo','Navaja, cangrejo o erizo, bien presentado.'],['🎣','Montaje','Un anzuelo y bajo largo y fino.']],
  err:['Impaciencia y cambiar de montaje sin motivo','No leer la playa','Cebos mal presentados'],
  src:['mpDorada']
 },
 chopa:{
  tag:'Espárido de roca batida',
  facts:[['Talla media (guía)','25–35 cm','pe'],['Buen ejemplar','~40 cm','pe'],['Peso habitual','600 g–2 kg','pe']],
  hab:'Roca batida, escolleras y espigones con fondo, roqueos y estructuras; de poca agua hasta unos 20 m (guía).',
  hora:[],
  cond:[['🌊','Mar movida sin exceso, corriente cerca del fondo y agua algo tomada.','pe']],
  cebos:[['Mejillón','','pe','mejill'],['Cangrejo','','pe','cangrejo'],['Lapa','','pe','lapa'],['Navaja','','pe','navaja'],['Erizo','','pe','erizo']],
  montaje:[['Fondo','Bajos cortos con margen de roce; sin ir demasiado fino en roca.'],['Clavada','No dudes: castiga cualquier duda.']],
  mitos:[{m:'«Es como el sargo»',v:'depende',n:'La guía la considera menos permisiva con los errores y poco de carreras largas.'}],
  plan:[['📍','Dónde','Roca batida o escollera con fondo, pegado a la estructura.'],['🪱','Cebo','Mejillón o cangrejo, bien sujeto al anzuelo.'],['🎣','Montaje','Fondo con bajo corto y hilo con margen.']],
  err:['Dudar en la clavada','Pescar lejos de la estructura','Ir demasiado fino en roca','Dejarle ganar fondo los primeros segundos'],
  src:['mpChopa']
 },
 salema:{
  tag:'Espárido casi vegetariano',
  facts:[['Talla media (guía)','20–30 cm','pe'],['Buen ejemplar','30–35 cm','pe'],['Peso habitual','200–700 g','pe'],['Profundidad','superficie a ~12 m','pe']],
  hab:'Roca con algas, espigones, escolleras y praderas (guía).',
  hora:[['☀️','De día, con buena luz','','pe']],
  cond:[['🌊','Aguas claras o ligeramente tomadas y mar tranquilo; evita el mar muy roto.','pe']],
  cebos:[['Pan trabajado','','pe','pan'],['Masilla blanda','','pe','masilla'],['Algas','Come vegetal.','pe','alga'],['Camarón o gamba pequeña','','pe','gamba']],
  montaje:[['Pulso','Caña ligera en espigones y puertos, lances cortos y suaves.'],['Anzuelo','Pequeño y fino, con bajos largos.']],
  mitos:[{m:'«Parece un pez fácil»',v:'falso',n:'En zonas presionadas es muy desconfiada: hace falta silencio, sombra baja y montaje fino.'}],
  plan:[['📍','Dónde','Espigones y roca con algas, en poca agua.'],['🪱','Cebo','Pan trabajado o alga.'],['👀','Señal','Si se asusta, para: insistir no sirve.']],
  err:['Hacer ruido o proyectar sombra','Montajes bastos','Cebos grandes'],
  src:['mpSalema']
 },
 lubina:{
  tag:'Depredador de espigón y bocana · protección diferenciada',
  facts:[['Estuarios','Mundaka (bocana, en cambios de marea)','pe'],['Espigones','Bermeo, de noche','pe']],
  hab:'Espigones, bocanas de ría y roca con corriente. En Urdaibai, la bocana de Mundaka.',
  meses:{ok:[4,5,6,7,8,9,10,11,12],pk:[9,10,11],t:'of',n:'Temporada abril–diciembre según el Gobierno Vasco. Las guías locales dan septiembre–noviembre como lo más productivo.'},
  hora:[['🌙','De noche en espigones','Amanecer y luz baja también.','pe'],['🔄','Cambios de marea','En la bocana de Mundaka.','pe']],
  cond:[['🍂','En otoño la bajada de temperatura del agua la activaría (opinión de una guía local).','pe']],
  cebos:[['Vinilos','','pe','vinilo'],['Minnows','','pe','minnow'],['Topwater','','pe','popper']],
  montaje:[['Spinning','Señuelos de 10–18 g, recogida lenta por rompientes y zonas de corriente.']],
  mitos:[{m:'«Los espigones de Bermeo al amanecer en octubre son lo mejor»',v:'sin verificar',n:'Opinión de una guía local; sin datos de capturas.'}],
  plan:[['📍','Dónde','Espigón de Bermeo o bocana de Mundaka.'],['🕒','Cuándo','Septiembre–noviembre, a luz baja y con cambio de marea.'],['🎣','Montaje','Spinning con vinilo o minnow de 10–18 g.'],['⚖️','Ojo','Mira primero la normativa: talla, cupo y declaración.']],
  err:[],
  src:['hpBermeo','aipPV','mpLubina']
 }
};
/* aliases de nombres de especie → clave de las tablas */
var SPK={'sargo':'sargo','sargo comun':'sargo','boga':'boga','oblada':'oblada','mojarra':'mojarra','dorada':'dorada','chopa':'chopa','salema':'salema','lubina':'lubina','raspallon':'raspallon','maragota':'maragota','besugo':'besugo','pargo':'pargo','congrio':'congrio','jurel':'jurel','chicharro':'jurel','caballa':'caballa','estornino':'estornino','lisa':'lisa','merluza':'merluza','lenguado':'lenguado','platija':'platija','rodaballo':'rodaballo','remol':'remol','abadejo':'abadejo','carbonero':'carbonero','merlan':'merlan','salmonete':'salmonete','acedia':'acedia','aguja':'aguja','sardina':'sardina','anchoa':'anchoa','reo':'reo','salmon':'salmon','pulpo':'pulpo','atun rojo':'atun-rojo'};
