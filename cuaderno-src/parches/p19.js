/* ===== Fichas de pesca por especie (Cantábrico / Bizkaia) ===== */
var FI={};
/* mo: 12 dígitos ene→dic (0 flojo · 1 bien · 2 mejor) · ho: alba, día, ocaso, noche · mar: calma, media, movida
   ti: sub|baj|ple|baj2|rep|cor|ind · v: [desde,hasta] 0 superficie → 1 fondo · st: ro es ar al pu ri ca cu ab fa
   ps: pg (pegado) ce (cerca) ab (abierto) · b/l: [icono, nombre, 1-3 favorita] · at: [tipo, texto] */
FI.lubina={mo:'000111112222',ho:'2122',mar:'012',ti:'cor',v:[0,.55],dp:'0–5 m',st:['ro','es','ri','pu'],ps:'ce',
 b:[['sardine','Sardina (viva o tira)',3],['crab','Cangrejo (muda)',3],['shrimp','Gamba / camarón',2],['worm','Gusano de mar',2],['eel','Anguila',1]],
 l:[['slug','Slug / anguila',3],['minnow','Minnow',3],['shad','Shad',2],['popper','Popper',2],['stick','Paseante',2]],
 at:['explosivo','Ataque seco y violento, a menudo en superficie. Desconfiada: acércate con sigilo y lanza preciso.'],
 te:['sp','co','su','ro'],tip:'Busca espuma, desembocaduras y agua que arrastra comida; amanecer, ocaso y noche con algo de mar.'};
FI.dorada={mo:'000111222210',ho:'2122',mar:'210',ti:'sub',v:[.7,1],dp:'2–12 m',st:['ar','ri','pu','ro'],ps:'ab',
 b:[['mussel','Mejillón',3],['clam','Almeja / berberecho',3],['crab','Cangrejo',2],['worm','Lombriz',2],['cuttle','Jibia / calamar',1]],l:[],
 at:['tiron','Golpes secos y rápidos; arrancadas fuertes al sentirse clavada.'],te:['su','fo'],
 tip:'Fondos de arena y mixtos, rías y puertos; mejor con agua que se mueve.'};
FI.sargo={mo:'001122222210',ho:'2221',mar:'012',ti:'sub',v:[.5,1],dp:'1–6 m',st:['ro','es','al'],ps:'pg',
 b:[['shrimp','Gamba',3],['worm2','Gusana',3],['mussel','Mejillón',2],['crab','Cangrejo',2],['limpet','Lapa',1]],l:[],
 at:['tiron','Pica desconfiado con tirones secos y se mete a la piedra: clava rápido y frena.'],te:['co','fo','ro'],
 tip:'Pegado a la piedra y a la espuma, más a fondo que la oblada. Cebo a 1–5 m del fondo; engoda al borde de la espuma.'};
FI.oblada={mo:'000112222210',ho:'2211',mar:'120',ti:'ind',v:[0,.5],dp:'Superficie–media agua',st:['ro','pu','es'],ps:'ce',
 b:[['bread','Pan / engodo',3],['mussel','Mejillón',2],['shrimp','Gamba pequeña',2],['sardine','Sardina troceada',1]],l:[['minnow','Minijig / minnow',1]],
 at:['banco','Pica rápido y en banco, en media agua; con engodo se concentra y se pasa de cebo en cebo.'],te:['co','sp'],
 tip:'Corcho a media agua con engodo de pan y sardina; más arriba que el sargo.'};
FI.chopa={mo:'000122222100',ho:'2221',mar:'120',ti:'ind',v:[.4,1],dp:'2–15 m',st:['ro','al','pu'],ps:'ce',
 b:[['shrimp','Gamba',3],['worm2','Gusana',2],['mussel','Mejillón',2],['bread','Pan',1]],l:[],
 at:['tiron','Tirón rápido y seco; va en grupo y vuelve tras el engodo.'],te:['co','fo'],tip:'Praderas de algas y roca con algas; verano.'};
FI.mojarra={mo:'111122222211',ho:'2221',mar:'012',ti:'ind',v:[.6,1],dp:'2–10 m',st:['ro','es','ar'],ps:'ce',
 b:[['anchovy','Bocarte salado',3],['shrimp','Gamba',2],['worm2','Gusana',2],['mussel','Mejillón',2]],l:[],
 at:['picoteo','Pica fino y a ráfagas cerca del fondo.'],te:['fo','co'],tip:'Vive en la rompiente. En invierno, el bocarte salado es lo más recomendado (Gobierno Vasco).'};
FI.raspallon={mo:'001122222210',ho:'2221',mar:'210',ti:'ind',v:[.6,1],dp:'2–15 m',st:['ar','al','pu'],ps:'ce',
 b:[['worm2','Gusana',3],['shrimp','Gamba',2],['mussel','Mejillón',2]],l:[],at:['picoteo','Picadas finas; pieza pequeña.'],te:['fo','co'],
 tip:'Arena con praderas y puertos.'};
FI.salema={mo:'000122222100',ho:'2220',mar:'210',ti:'ind',v:[0,.6],dp:'0–6 m',st:['al','pu','ro'],ps:'ce',
 b:[['bread','Pan / masa',3],['weed','Alga fresca',2],['worm2','Gusana',1]],l:[],at:['banco','Banco que se acerca al engodo; picadas suaves.'],te:['co'],
 tip:'Come algas: pan y masa con engodo, cerca de algas y puertos.'};
FI.boga={mo:'000122222110',ho:'2210',mar:'210',ti:'ind',v:[.1,.7],dp:'Media agua',st:['pu','ro','ab'],ps:'ab',
 b:[['bread','Pan',3],['sardine','Sardina troceada',2],['shrimp','Gamba',1]],l:[['grub','Plumas / sabiki',2]],
 at:['banco','Banco muy numeroso: pican varias a la vez.'],te:['co','fo'],tip:'Pan o plumas en media agua; ideal para cebo vivo o carnada.'};
FI.corvina={mo:'000001222100',ho:'1022',mar:'210',ti:'cor',v:[.4,1],dp:'Boca de ría, 2–10 m',st:['ri','ar','pu'],ps:'ab',
 b:[['sardine','Sardina entera / viva',3],['squid','Calamar',2],['crab','Cangrejo',1]],l:[['shad','Shad grande',1]],
 at:['engulle','Embestida fuerte y carreras; traga el cebo con ganas.'],te:['su','co'],tip:'Rara en Bizkaia; más habitual en el sur. Noche y bocas de ría.'};
FI.breca={mo:'000011222100',ho:'2211',mar:'210',ti:'ind',v:[.8,1],dp:'15–60 m',st:['ar','fa'],ps:'ab',bo:1,
 b:[['sardine','Sardina / caballa en trozo',2],['shrimp','Gamba',2],['worm','Lombriz',2],['crab','Cangrejo',1]],l:[],
 at:['picoteo','Picadas decididas pero cortas.'],te:['fo','ma'],tip:'Fondos de arena y fango; casi siempre desde barco.'};
FI.besugo={mo:'221000000122',ho:'2211',mar:'210',ti:'ind',v:[.85,1],dp:'40–200 m',st:['ca','ro'],ps:'ce',bo:1,
 b:[['anchovy','Anchoa',3],['worm','Lombriz',2],['sardine','Sardina',2],['squid','Calamar',2]],l:[],
 at:['suave','Picadas finas y repetidas; a veces solo notas más peso.'],te:['fo','ma'],tip:'Desde barco en cantiles y fondos duros. Ver talla y cupo en su ficha legal.'};
FI.maragota={mo:'001222222100',ho:'2211',mar:'120',ti:'ind',v:[.5,1],dp:'2–15 m',st:['ro','al','cu'],ps:'pg',
 b:[['shrimp','Camarón / gamba',3],['crab','Cangrejo',3],['worm2','Gusana',2],['limpet','Lapa',1]],l:[['sworm','Gusano vinilo',2],['scrab','Cangrejo vinilo',2],['grub','Grub',2]],
 at:['tiron','Picada firme: coge el cebo y se enroca en las algas; frena pronto.'],te:['ro','fo'],tip:'Roca con algas y grietas; pésquela pegada al fondo.'};
FI.gallano={mo:'001222222100',ho:'2211',mar:'120',ti:'ind',v:[.6,1],dp:'2–12 m',st:['ro','al'],ps:'pg',
 b:[['worm2','Gusana',3],['shrimp','Gamba',2],['crab','Cangrejo',2]],l:[],at:['picoteo','Picadas rápidas; pieza pequeña.'],te:['ro','fo'],tip:'Pariente pequeño de la maragota.'};
FI.lisa={mo:'001122222210',ho:'2210',mar:'210',ti:'ind',v:[0,.5],dp:'Superficie–media agua',st:['pu','ri','es'],ps:'ce',
 b:[['bread','Pan / masa',3],['worm2','Gusana',2]],l:[],at:['suave','Muy desconfiada: picada suave; hay que clavar fino y con línea delgada.'],te:['co','fo'],
 tip:'Puertos, rías y bocas de río; engoda con pan.'};
['capiton','galua','galupe','morragute'].forEach(function(k){FI[k]=JSON.parse(JSON.stringify(FI.lisa))});
FI.capiton.tip='Lisa grande de rías y estuarios; mismas artes que la lisa.';FI.galua.tip='Lisa de puertos y rías; muy parecida a la lisa común.';FI.galupe.tip='Lisa de estuarios y bocas de río.';FI.morragute.tip='Lisa pequeña; muy ligada a puertos y rías.';
FI.pejerrey={mo:'111122222211',ho:'2210',mar:'210',ti:'ind',v:[0,.3],dp:'Superficie',st:['pu','ri'],ps:'ce',
 b:[['bread','Pan',3],['worm2','Gusana trozo',1]],l:[['grub','Plumas / sabiki',3]],at:['banco','Banco de pececillos en superficie.'],te:['co'],tip:'Puertos; sirve de cebo.'};
FI.aguja={mo:'001222100000',ho:'2210',mar:'210',ti:'ind',v:[0,.2],dp:'Superficie',st:['ab','ro'],ps:'ab',
 b:[['sardine','Tira de sardina',2]],l:[['spoon','Cucharilla pequeña',3],['minnow','Minnow fino',2]],
 at:['explosivo','Persigue en superficie, salta y se agita.'],te:['sp','co'],tip:'Primavera, cuando entra a la costa.'};
FI.espeton={mo:'000001222100',ho:'2121',mar:'210',ti:'ind',v:[0,.4],dp:'Superficie–media agua',st:['ab','pu','ro'],ps:'ab',
 b:[['sardine','Pececillo vivo',3]],l:[['minnow','Minnow',3],['stick','Paseante',2]],at:['explosivo','Ataque veloz, dientes afilados: usa bajo de línea resistente.'],te:['sp'],tip:'Verano y principios de otoño.'};
FI.jurel={mo:'001122222110',ho:'2211',mar:'210',ti:'ind',v:[.2,.7],dp:'Media agua',st:['ab','pu','ro'],ps:'ab',
 b:[['sardine','Sardina troceada',3],['squid','Calamar',1],['shrimp','Gamba',1]],l:[['grub','Plumas / sabiki',3],['jig','Jig',2],['minnow','Minnow',1]],
 at:['banco','Banco que pica a la vez; en cuanto lo localizas, pican de seguido.'],te:['sp','co','ma'],tip:'Verano y otoño; muy numeroso en puertos y entradas.'};
FI.caballa={mo:'001222101210',ho:'2211',mar:'210',ti:'ind',v:[.1,.7],dp:'Media agua',st:['ab','pu'],ps:'ab',
 b:[['sardine','Sardina / tira',2],['squid','Calamar',1]],l:[['grub','Plumas / sabiki',3],['jig','Jig metálico',3],['spoon','Cucharilla',2]],
 at:['banco','Tirones múltiples; pican en cuanto el banco pasa.'],te:['sp','ma'],tip:'Primavera (abril–mayo) y otoño. Al bajar el jig, más abajo si no pican.'};
FI.estornino={mo:'000011222100',ho:'2211',mar:'210',ti:'ind',v:[.1,.7],dp:'Media agua',st:['ab','pu'],ps:'ab',
 b:[['sardine','Sardina troceada',2]],l:[['grub','Plumas / sabiki',3],['jig','Jig',2]],at:['banco','Pica como la caballa, en banco.'],te:['sp','ma'],tip:'Más estival que la caballa.'};
FI.bonito={mo:'000000222100',ho:'2211',mar:'210',ti:'ind',v:[0,.4],dp:'Mar abierto',st:['ab'],ps:'ab',bo:1,
 b:[['anchovy','Anchoa viva',3],['sardine','Sardina',3]],l:[['grub','Vinilo / plumas curricán',3],['minnow','Minnow curricán',2],['jig','Jig',2]],
 at:['explosivo','Carreras largas a gran velocidad.'],te:['cu','sp'],tip:'Desde barco, julio–octubre. Ver cupo y declaración en su ficha legal.'};
FI.bacoreta={mo:'000001222100',ho:'2211',mar:'210',ti:'ind',v:[0,.4],dp:'Superficie',st:['ab','ro'],ps:'ab',
 b:[['sardine','Sardina viva',2]],l:[['jig','Jig metálico',3],['minnow','Minnow',2]],at:['explosivo','Ataque violento y carreras.'],te:['sp','cu'],tip:'Rara en Bizkaia; llega en verano cálido.'};
FI.melva={mo:'000001222100',ho:'2211',mar:'210',ti:'ind',v:[0,.4],dp:'Superficie',st:['ab'],ps:'ab',
 b:[['sardine','Sardina troceada',2]],l:[['jig','Jig pequeño',3],['grub','Plumas',2]],at:['banco','Bancos veloces en superficie.'],te:['sp'],tip:'Rara en Bizkaia; algunos veranos.'};
FI.atun={mo:'000000111100',ho:'1111',mar:'210',ti:'ind',v:[0,.5],dp:'Mar abierto',st:['ab'],ps:'ab',bo:1,b:[],l:[],
 at:['explosivo','Especie de máxima protección.'],te:[],tip:'Atún rojo: pesca recreativa prohibida. Si se engancha, hay que soltarlo con cuidado.',ban:1};
FI.sardina={mo:'001122222211',ho:'2211',mar:'210',ti:'ind',v:[0,.4],dp:'Superficie–media agua',st:['ab','pu'],ps:'ab',
 b:[['bread','Pan / engodo',2]],l:[['grub','Sabiki / plumas',3]],at:['banco','Bancos densos en superficie.'],te:['ma','co'],tip:'Sirve de cebo (viva o troceada).'};
FI.anchoa={mo:'000222111000',ho:'2210',mar:'210',ti:'ind',v:[0,.4],dp:'Superficie–media agua',st:['ab','pu'],ps:'ab',
 b:[['bread','Pan',1]],l:[['grub','Sabiki pequeño',3]],at:['banco','Bancos en primavera; pican varias a la vez.'],te:['ma'],tip:'Primavera (abril–junio). Muy buena como cebo.'};
FI.espadin={mo:'222000000122',ho:'2210',mar:'210',ti:'ind',v:[0,.4],dp:'Media agua',st:['ab','pu'],ps:'ab',
 b:[],l:[['grub','Sabiki pequeño',3]],at:['banco','Bancos pequeños en invierno.'],te:['ma'],tip:'Pequeño, de banco invernal.'};
FI.lecha={mo:'000001222100',ho:'2121',mar:'210',ti:'ind',v:[0,.3],dp:'Superficie',st:['ro','pu','ab'],ps:'ce',
 b:[['sardine','Caballa / jurel vivo',3]],l:[['stick','Paseante grande',3],['popper','Popper grande',3],['minnow','Minnow grande',2]],
 at:['explosivo','Ataque explosivo en superficie.'],te:['sp'],tip:'Verano; a veces escasa. Pesca de superficie con cebo vivo o señuelo grande.'};
FI.palometa={mo:'000001222100',ho:'2211',mar:'012',ti:'ind',v:[.2,.8],dp:'Rompiente y playas',st:['es','ar','ro'],ps:'ce',
 b:[['shrimp','Gamba',3],['worm2','Gusana',2],['razor','Navaja',2]],l:[['jig','Jig',2],['minnow','Minnow',2]],
 at:['explosivo','Ataque rápido y fuerte en la rompiente.'],te:['su','sp'],tip:'Verano–otoño, en la espuma de playas y rocas bajas.'};
FI.faneca={mo:'222000000122',ho:'1122',mar:'210',ti:'ind',v:[.7,1],dp:'3–20 m',st:['ar','fa','pu','ri'],ps:'ab',
 b:[['worm','Lombriz / gusano',3],['crab','Cangrejo (ermitaño)',2],['shrimp','Gamba',2],['mussel','Mejillón',2],['anchovy','Anchoa fresca',2]],l:[],
 at:['picoteo','Picadas finas en grupo; cazan en banco.'],te:['su','fo'],tip:'Invierno en puertos, rías y fondos blandos (Gobierno Vasco).'};
FI.capellan={mo:'222000000122',ho:'1122',mar:'210',ti:'ind',v:[.7,1],dp:'10–40 m',st:['ar','fa'],ps:'ab',
 b:[['worm','Lombriz',3],['shrimp','Gamba',2]],l:[],at:['picoteo','Picadas pequeñas.'],te:['fo'],tip:'Pariente pequeño de la faneca.'};
FI.abadejo={mo:'000012222211',ho:'2122',mar:'012',ti:'cor',v:[.2,.9],dp:'3–30 m',st:['ca','ro','al'],ps:'ce',
 b:[['sardine','Pececillo / sardina',2],['worm2','Gusana / lombriz',2],['crab','Cangrejo',1]],l:[['shad','Shad',3],['jig','Jig',3],['slug','Slug',2],['minnow','Minnow',2]],
 at:['explosivo','Ataque fuerte y arranque hacia el fondo.'],te:['sp','ro'],tip:'Cantiles y roca profunda con algo de mar (Gobierno Vasco: peces pequeños, gusanos, señuelos).'};
FI.carbonero={mo:'000011222221',ho:'2122',mar:'012',ti:'cor',v:[.2,.9],dp:'5–40 m',st:['ca','ro'],ps:'ce',
 b:[['sardine','Pececillo',2]],l:[['shad','Shad',3],['jig','Jig',3]],at:['explosivo','Ataque violento, tira hacia el fondo.'],te:['sp'],tip:'Parecido al abadejo; más profundo.'};
FI.merlan={mo:'222100000122',ho:'1122',mar:'210',ti:'ind',v:[.6,1],dp:'20–80 m',st:['ar','fa'],ps:'ab',bo:1,
 b:[['worm','Lombriz',2],['anchovy','Anchoa',2]],l:[],at:['picoteo','Picadas rápidas.'],te:['fo'],tip:'Invierno en fondos blandos.'};
FI.barbada={mo:'111111111111',ho:'0012',mar:'120',ti:'ind',v:[.9,1],dp:'2–30 m',st:['ro','cu'],ps:'pg',
 b:[['shrimp','Gamba',3],['worm2','Gusana',2],['mussel','Mejillón',2]],l:[],at:['picoteo','Picadas suaves de noche.'],te:['fo'],tip:'Roca y grietas, de noche.'};
FI.brotola={mo:'000122222100',ho:'1022',mar:'120',ti:'ind',v:[.9,1],dp:'10–60 m',st:['ro','cu'],ps:'pg',
 b:[['sardine','Sardina',3],['squid','Calamar',2],['crab','Cangrejo',2]],l:[],at:['engulle','Traga el cebo y se encierra.'],te:['fo','ro'],tip:'Roca y grietas, de noche.'};
FI.congrio={mo:'000012222210',ho:'1022',mar:'120',ti:'rep',v:[.85,1],dp:'5–30 m',st:['cu','ro','ca'],ps:'pg',
 b:[['mackerel','Caballa (trozo)',3],['sardine','Sardina entera',3],['squid','Calamar / chipirón',3],['octopus','Pulpo',2],['cuttle','Jibia',2],['crab','Cangrejo',2]],l:[],
 at:['engulle','Se traga el cebo entero y tira a su cueva: deja que se confíe, clava firme y sácalo antes de que se enroque.'],te:['fo','su'],
 tip:'Cebo grande y fresco, sedal fuerte y guantes. Mejor de noche y al repuntar la marea.'};
FI.lenguado={mo:'011222211100',ho:'0012',mar:'210',ti:'ind',v:[1,1],dp:'2–15 m',st:['ar','fa','ri'],ps:'ab',
 b:[['worm','Lombriz / gusano',3],['razor','Navaja',2],['shrimp','Gamba',2]],l:[],
 at:['suave','Picada tímida: arrastra el cebo; espera antes de clavar.'],te:['su','fo'],tip:'Arena y fango de rías; de noche (Gobierno Vasco: gusanos).'};
FI.rodaballo={mo:'001122222100',ho:'2122',mar:'210',ti:'cor',v:[1,1],dp:'5–30 m',st:['ar','ri'],ps:'ab',
 b:[['mackerel','Tira de caballa',3],['worm','Lombriz',2],['anchovy','Anchoa',2],['sardine','Sardina',2]],l:[['shad','Vinilo pesado',2]],
 at:['engulle','Traga el cebo y arrastra.'],te:['su','fo','sp'],tip:'Arena y grava, en ríos y entradas; noche.'};
FI.remol={mo:'001122222100',ho:'2122',mar:'210',ti:'cor',v:[1,1],dp:'5–30 m',st:['ar','ri'],ps:'ab',
 b:[['mackerel','Tira de caballa',3],['worm','Lombriz',2],['sardine','Sardina',2]],l:[['shad','Vinilo pesado',2]],
 at:['engulle','Traga el cebo y arrastra.'],te:['su','fo','sp'],tip:'Arena y grava; parecido al rodaballo.'};
FI.platija={mo:'221100000122',ho:'1122',mar:'210',ti:'ind',v:[1,1],dp:'1–10 m',st:['ri','ar','fa'],ps:'ab',
 b:[['worm','Lombriz / gusano',3],['shrimp','Gamba',2],['mussel','Mejillón',2]],l:[],
 at:['suave','Picada suave; arrastra el cebo.'],te:['su','fo'],tip:'Estuarios y desembocaduras en invierno–primavera.'};
FI.solla={mo:'221100000012',ho:'1122',mar:'210',ti:'ind',v:[1,1],dp:'20–50 m',st:['ar'],ps:'ab',bo:1,
 b:[['worm','Lombriz',3],['mussel','Mejillón',2]],l:[],at:['suave','Picadas suaves.'],te:['fo'],tip:'Arena; casi siempre desde barco.'};
FI.acedia={mo:'001122222100',ho:'1122',mar:'210',ti:'ind',v:[1,1],dp:'5–30 m',st:['ar'],ps:'ab',
 b:[['worm','Lombriz',3]],l:[],at:['picoteo','Picadas finas; pez pequeño.'],te:['fo','su'],tip:'Arena; pequeña y sabrosa.'};
FI['gallo-norte']={mo:'000122222100',ho:'1122',mar:'210',ti:'ind',v:[.9,1],dp:'50–200 m',st:['ar','fa'],ps:'ab',bo:1,
 b:[['sardine','Pececillo',2],['squid','Calamar',2],['worm','Lombriz',2]],l:[],at:['picoteo','Picadas finas.'],te:['fo','ma'],tip:'Desde barco; fondos blandos.'};
FI.gallo={mo:'000122222100',ho:'1122',mar:'210',ti:'ind',v:[.6,1],dp:'20–100 m',st:['ro','ar'],ps:'ce',bo:1,
 b:[['sardine','Pececillo vivo',3]],l:[],at:['engulle','Traga el cebo vivo.'],te:['fo','ma'],tip:'Desde barco. San Pedro.'};
FI.salmonete={mo:'000111222110',ho:'2210',mar:'210',ti:'ind',v:[.8,1],dp:'3–20 m',st:['ar','ro','al'],ps:'ce',
 b:[['shrimp','Gamba',3],['worm','Lombriz',3],['worm2','Gusana',2]],l:[],at:['picoteo','Picadas finas a ras de fondo.'],te:['fo','su'],tip:'Arena con algo de piedra; cebos pequeños (Gobierno Vasco).'};
FI.rubio={mo:'000122222100',ho:'2211',mar:'210',ti:'ind',v:[.8,1],dp:'20–100 m',st:['ar','fa'],ps:'ab',bo:1,
 b:[['sardine','Pececillo',2],['worm','Lombriz',2],['shrimp','Gamba',2]],l:[],at:['picoteo','Picadas pequeñas.'],te:['fo','ma'],tip:'Desde barco; fondos de arena.'};
FI.garneo={mo:'000122222100',ho:'2211',mar:'210',ti:'ind',v:[.8,1],dp:'20–100 m',st:['ar','fa'],ps:'ab',bo:1,
 b:[['sardine','Pececillo',2],['worm','Lombriz',2]],l:[],at:['picoteo','Picadas pequeñas.'],te:['fo','ma'],tip:'Desde barco; fondos de arena.'};
FI.cabracho={mo:'000122222100',ho:'1022',mar:'120',ti:'ind',v:[.9,1],dp:'20–100 m',st:['ro','cu','ca'],ps:'pg',bo:1,
 b:[['anchovy','Anchoa',3],['sardine','Sardina',3],['shrimp','Quisquilla',2]],l:[],
 at:['engulle','Traga cebo y se clava en el fondo. Cuidado con las espinas.'],te:['fo','ma'],tip:'Roca y cuevas. Espinas venenosas.'};
FI.rascacio={mo:'000122222100',ho:'1022',mar:'120',ti:'ind',v:[.9,1],dp:'2–30 m',st:['ro','cu'],ps:'pg',
 b:[['shrimp','Gamba',3],['crab','Cangrejo',2],['worm2','Gusana',2]],l:[['sworm','Gusano vinilo',1]],
 at:['engulle','Traga el cebo y se queda pegado a la roca. Cuidado con las espinas.'],te:['ro','fo'],tip:'Roca de costa y grietas. Espinas venenosas.'};
FI.arana={mo:'000122222100',ho:'1122',mar:'210',ti:'ind',v:[1,1],dp:'1–20 m',st:['ar'],ps:'ab',
 b:[['worm','Lombriz',3],['shrimp','Gamba',2]],l:[],at:['picoteo','Picadas pequeñas.'],te:['su','fo'],tip:'⚠ Espinas venenosas: manéjala con cuidado.',min:1};
FI.aranita={mo:'000122222100',ho:'1122',mar:'210',ti:'ind',v:[1,1],dp:'0–10 m',st:['ar'],ps:'ab',
 b:[['worm','Lombriz',3]],l:[],at:['picoteo','Picadas pequeñas.'],te:['su'],tip:'⚠ Espinas venenosas en la playa.',min:1};
FI.pintarroja={mo:'111111111111',ho:'1022',mar:'120',ti:'ind',v:[1,1],dp:'3–40 m',st:['ar','ro','fa'],ps:'ab',
 b:[['sardine','Sardina / caballa',3],['squid','Calamar',2],['crab','Cangrejo (ermitaño)',2]],l:[],
 at:['suave','Picada lenta y pesada; recoge sin dejar de tirar.'],te:['su','fo'],tip:'Piel áspera: manejar con guantes. Muy común de noche.'};
FI.alitan={mo:'111111111111',ho:'1022',mar:'120',ti:'ind',v:[1,1],dp:'3–40 m',st:['ro','ar'],ps:'ce',
 b:[['sardine','Sardina / caballa',3],['squid','Calamar',2]],l:[],at:['suave','Picada lenta y pesada.'],te:['su','fo'],tip:'Pariente grande de la pintarroja.'};
FI.cazon={mo:'000122222100',ho:'1122',mar:'210',ti:'ind',v:[.7,1],dp:'5–40 m',st:['ar','ab'],ps:'ab',
 b:[['sardine','Sardina',3],['mackerel','Caballa',3],['squid','Calamar',2],['crab','Cangrejo',1]],l:[],
 at:['engulle','Carreras fuertes tras engullir.'],te:['su','fo'],tip:'Tiburón pequeño; cebo de pescado azul. Alambre o bajo fuerte.'};
FI.musola={mo:'000122222100',ho:'1122',mar:'210',ti:'ind',v:[1,1],dp:'5–40 m',st:['ar'],ps:'ab',
 b:[['crab','Cangrejo',3],['shrimp','Gamba',2],['worm','Lombriz',2]],l:[],at:['suave','Picada lenta.'],te:['su','fo'],tip:'Come crustáceos; cebo de cangrejo.'};
FI.raya={mo:'001222222100',ho:'1122',mar:'210',ti:'ind',v:[1,1],dp:'10–60 m',st:['ar','fa'],ps:'ab',
 b:[['sardine','Sardina',3],['mackerel','Caballa',3],['squid','Calamar',2]],l:[],at:['suave','Picada lenta y pesada; recoge sin dejar de tirar.'],te:['su','fo'],tip:'Arena y fango; de noche. Ver si se puede retener.'};
['raya-clavos','raya-mosaico','raya-pintada'].forEach(function(k){FI[k]=JSON.parse(JSON.stringify(FI.raya))});
FI['raya-mosaico'].tip='Especie vulnerable: comprueba si se puede retener antes de llevártela.';
FI.pastinaca={mo:'001222222100',ho:'1022',mar:'210',ti:'ind',v:[1,1],dp:'2–30 m',st:['ar','ri'],ps:'ab',
 b:[['sardine','Sardina',3],['worm','Lombriz',2],['crab','Cangrejo',2]],l:[],at:['suave','Picada lenta y pesada.'],te:['su'],tip:'⚠ Aguijón venenoso en la cola.'};
FI['aguila-marina']={mo:'000122222100',ho:'1022',mar:'210',ti:'ind',v:[.5,1],dp:'5–30 m',st:['ar','ab'],ps:'ab',
 b:[['crab','Cangrejo',3],['squid','Calamar',2]],l:[],at:['engulle','Embiste y tira con fuerza.'],te:['su'],tip:'⚠ Aguijón venenoso: no manejar sin cuidado.'};
FI.pulpo={mo:'001122222210',ho:'1022',mar:'120',ti:'ind',v:[1,1],dp:'1–15 m',st:['ro','cu'],ps:'pg',
 b:[['crab','Cangrejo',3]],l:[['scrab','Cangrejo vinilo',3]],at:['suave','Notas peso: se agarra al cebo; tira con firmeza sin brusquedad.'],te:['ro','ma'],tip:'Grietas y roca; verano–otoño. Máximo un ejemplar (folleto GV).'};
FI['pulpo-blanco']={mo:'111111111111',ho:'1022',mar:'210',ti:'ind',v:[1,1],dp:'15–100 m',st:['ar','fa'],ps:'ab',bo:1,b:[['crab','Cangrejo',3]],l:[],at:['suave','Se agarra al cebo.'],te:['fo'],tip:'Fondos de arena y fango.'};
FI.calamar={mo:'000111111222',ho:'1022',mar:'210',ti:'ind',v:[.2,.8],dp:'Media agua',st:['pu','ab'],ps:'ce',
 b:[],l:[['jig','Potera / jibionera',3]],at:['suave','Sientes un peso leve al recoger; dale unos tirones.'],te:['sp'],tip:'Puertos y espigones; ocaso y noche en otoño–invierno.'};
FI.chipiron=JSON.parse(JSON.stringify(FI.calamar));
FI.sepia={mo:'001222110000',ho:'1122',mar:'210',ti:'ind',v:[.7,1],dp:'1–20 m',st:['al','ar','pu'],ps:'ab',
 b:[],l:[['jig','Potera / jibionera',3],['scrab','Cangrejo vinilo',1]],at:['suave','Se engancha al señuelo; recoge sin brusquedad.'],te:['sp'],tip:'Primavera, en rías y puertos con algas.'};
FI.pota={mo:'000000011110',ho:'1022',mar:'210',ti:'ind',v:[.3,.9],dp:'20–100 m',st:['ab'],ps:'ab',bo:1,b:[],l:[['jig','Potera',3]],at:['suave','Peso leve.'],te:['ma'],tip:'Desde barco; otoño.'};
['centolla','buey','necora','bogavante','langosta'].forEach(function(k){FI[k]={mo:'000000000000',ho:'0000',mar:'000',ti:'ind',v:[1,1],dp:'',st:['ro'],ps:'pg',b:[],l:[],at:['suave',''],te:[],tip:'Pesca recreativa prohibida (veda total); si cae, soltarla viva.',ban:1}});
FI['cangrejo-verde']={mo:'111111111111',ho:'1111',mar:'210',ti:'ind',v:[1,1],dp:'0–5 m',st:['pu','ri'],ps:'ce',b:[['mussel','Mejillón',2]],l:[],at:['suave','Se agarra al cebo.'],te:['fo'],tip:'Puertos y rías; sirve de cebo.',min:1};
FI.camaron={mo:'111111111111',ho:'1122',mar:'210',ti:'ind',v:[.7,1],dp:'0–5 m',st:['pu','ri','al'],ps:'ce',b:[['bread','Pan / pescado',2]],l:[],at:['suave','Entra en la nasa o el retel.'],te:[],tip:'Puertos y algas; sirve de cebo vivo. Ver si se permite capturarlo.',min:1};
FI.anguila={mo:'000112222100',ho:'0012',mar:'210',ti:'ind',v:[1,1],dp:'Río y estuario',st:['ri','fa'],ps:'ab',
 b:[['worm','Lombriz',3],['crab','Cangrejo',2],['mussel','Mejillón',1]],l:[],at:['engulle','Traga el cebo y se enrosca.'],te:['fo'],tip:'Pesca de noche en río y estuario; especie vulnerable: ver normas.'};
FI.rape={mo:'111111111111',ho:'1122',mar:'210',ti:'ind',v:[1,1],dp:'50–200 m',st:['ar','fa'],ps:'ab',bo:1,b:[['sardine','Pescado entero',3]],l:[],at:['suave','Se queda quieto y se traga el cebo.'],te:['fo','ma'],tip:'Desde barco.'};
FI['rape-negro']=JSON.parse(JSON.stringify(FI.rape));
FI.bacaladilla={mo:'111111111111',ho:'1122',mar:'210',ti:'ind',v:[.6,1],dp:'100–300 m',st:['ab'],ps:'ab',bo:1,b:[['anchovy','Anchoa',1]],l:[],at:['picoteo','Picadas finas.'],te:['ma'],tip:'Aguas profundas; no se pesca desde costa.',min:1};
FI.merluza={mo:'111111111111',ho:'1122',mar:'210',ti:'ind',v:[.8,1],dp:'100–300 m',st:['ab'],ps:'ab',bo:1,b:[['sardine','Pececillo',3],['squid','Calamar',2]],l:[],at:['engulle','Traga el cebo entero.'],te:['fo','ma'],tip:'Desde barco en aguas profundas. Cupo y declaración (ver ficha legal).'};
FI.baboso={mo:'111111111111',ho:'2210',mar:'210',ti:'ind',v:[.9,1],dp:'0–5 m',st:['ro','pu'],ps:'pg',b:[['worm2','Gusana',2]],l:[],at:['picoteo','Picadas rápidas.'],te:['fo'],tip:'Roca de puertos; pieza muy pequeña.',min:1};
FI.gobio={mo:'111111111111',ho:'2210',mar:'210',ti:'ind',v:[1,1],dp:'0–5 m',st:['pu','ri'],ps:'ab',b:[['worm2','Gusana',2]],l:[],at:['picoteo','Picadas rápidas.'],te:['fo'],tip:'Puertos y rías; pieza muy pequeña.',min:1};
FI.mielga={mo:'222100000122',ho:'1122',mar:'210',ti:'ind',v:[.7,1],dp:'20–200 m',st:['ab'],ps:'ab',bo:1,b:[['sardine','Sardina',3]],l:[],at:['engulle','Traga el cebo.'],te:['fo'],tip:'Espina en el dorso: cuidado al manipular.',min:1};
FI.reo={mo:'001222222100',ho:'2122',mar:'210',ti:'ind',v:[.2,.8],dp:'Río',st:['ri'],ps:'ce',b:[['worm','Lombriz',2]],l:[['spoon','Cucharilla',3]],at:['explosivo','Embestida.'],te:['sp'],tip:'Pesca fluvial: otras reglas y licencia.',min:1};
FI.salmon={mo:'000000111100',ho:'2122',mar:'210',ti:'ind',v:[.2,.8],dp:'Río',st:['ri'],ps:'ce',b:[],l:[['spoon','Cucharilla',3]],at:['explosivo','Embestida.'],te:['sp'],tip:'Pesca fluvial: otras reglas, cupo y licencia.',min:1};
FI.lamprea={mo:'001222000000',ho:'0012',mar:'210',ti:'ind',v:[1,1],dp:'Río',st:['ri'],ps:'ab',b:[],l:[],at:['suave','—'],te:[],tip:'Pesca fluvial regulada.',min:1};
/* ===== Ficha de pesca: render ===== */
var FI_MON=['E','F','M','A','M','J','J','A','S','O','N','D'];
var FI_MONN=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
var FI_ST={ro:['Roca','M2 18l5-8 4 4 5-9 6 13z'],es:['Espuma','M2 15c3-4 5-4 8 0s5 4 8 0 5-4 8 0M2 21c3-4 5-4 8 0s5 4 8 0 5-4 8 0'],ar:['Arena','M2 19c5-6 9-6 12 0s6 0 10-3M5 22h14'],al:['Algas','M6 22c-3-5 3-8 0-12M12 22c-3-5 3-8 0-14M18 22c-3-5 3-8 0-12'],pu:['Puerto','M3 20h18M7 20V9h10v11M10 9V5h4v4'],ri:['Ría / desembocadura','M3 6c5 3 5 6 9 8s6 3 9 6M3 12c3 2 4 4 7 6'],ca:['Cantil','M4 4v16h16M4 14l6-2 4 5 6-1'],cu:['Grietas / cuevas','M3 21c0-9 4-15 9-15s9 6 9 15zM9 21c0-4 1.5-6 3-6s3 2 3 6'],ab:['Mar abierto','M2 10c3-3 5-3 8 0s5 3 8 0 4-3 6 0M2 17c3-3 5-3 8 0s5 3 8 0 4-3 6 0'],fa:['Fango','M3 18c4-3 6 2 10-1s5-1 8-2M3 22h18']};
var FI_MOD={sp:['Spinning','M3 20L21 5M14 5l7 0 0 7'],co:['Corcho','M12 4v6M8 10h8l-1 8H9zM12 18v3'],su:['Surfcasting','M3 21L19 4M19 4v7M10 14c4 2 8 6 11 7'],ro:['Roca / fondo','M2 18l5-8 4 4 5-9 6 13z'],fo:['Fondo','M3 19h18M6 19v-5M12 19v-9M18 19v-6'],ma:['Barco','M3 14h18l-3 6H6zM12 14V4l6 8'],cu:['Curricán','M3 8c6 0 6 8 12 8l6-2M18 14l3 0']};
var FI_AT={explosivo:['Explosivo','Ataque violento, en superficie o a media agua'],tiron:['Tirón seco','Golpes rápidos y se mete a la piedra'],banco:['En banco','Varias a la vez, pican seguidas'],picoteo:['Picoteo','Picadas finas: hay que estar atento'],engulle:['Engulle','Se traga el cebo entero y tira'],suave:['Suave','Notas peso o arrastre: clava con calma']};
var FI_TI={sub:'Marea subiendo',baj:'Marea bajando',ple:'Pleamar',baj2:'Bajamar',rep:'Repunte de marea',cor:'Con corriente',ind:'Cualquier marea'};
var FI_X={bread:'<path d="M8 26c0-8 6-12 16-12s16 4 16 12v8H8z" fill="currentColor" fill-opacity=".2"/><path d="M16 22v4m8-6v5m8-4v4"/>',weed:'<path d="M12 40c-6-8 6-12 0-22M24 40c-6-8 6-12 0-26M36 40c-6-8 6-12 0-22" />',eel:'<path d="M4 30c8-12 16 10 24-2s10-8 14-12" stroke-width="5" stroke-opacity=".25"/><path d="M4 30c8-12 16 10 24-2s10-8 14-12"/><circle cx="43" cy="14" r="2"/>',octopus:'<path d="M12 24a12 12 0 0 1 24 0c0 4-2 6-4 8M14 32c-4 4-2 8-6 8M20 34c-2 4 0 8-3 9M28 34c2 4 0 8 3 9M34 32c4 4 2 8 6 8" /><circle cx="19" cy="22" r="2"/><circle cx="29" cy="22" r="2"/>',clam:'<path d="M6 28a18 16 0 0 1 36 0z" fill="currentColor" fill-opacity=".2"/><path d="M6 28h36l-4 8H10zM14 28l5-13m5 13V13m5 15l-3-13"/>'};
function fiIc(n){var d=BIC[n]||FI_X[n]||BIC.hookg;return '<svg class="bi" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>'}
function fiSv(p){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+p+'"/></svg>'}
function fiEsc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function fiMonths(f){
  var m=new Date().getMonth(),h='<div class="fim">';
  for(var i=0;i<12;i++){var v=+f.mo[i];h+='<div class="fic l'+v+(i===m?' now':'')+'" title="'+FI_MONN[i]+'"><i></i><b>'+FI_MON[i]+'</b></div>'}
  var best=[];for(i=0;i<12;i++)if(f.mo[i]==='2')best.push(FI_MONN[i]);
  return h+'</div>'+(best.length?'<p class="fis">Mejor: '+best[0]+(best.length>1?' – '+best[best.length-1]:'')+'</p>':'')
}
function fiHours(f){
  var N=['Alba','Día','Ocaso','Noche'],I=['M3 18h18M7 18a5 5 0 0 1 10 0M12 6v3M5 10l2 2M19 10l-2 2','M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4','M3 18h18M7 18a5 5 0 0 1 10 0M12 9v-3M5 13l2 1M19 13l-2 1','M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10z'];
  return '<div class="fih">'+N.map(function(n,i){return '<div class="fic l'+f.ho[i]+'">'+fiSv(I[i])+'<b>'+n+'</b></div>'}).join('')+'</div>'
}
function fiSea(f){
  var N=['Calma','Mar normal','Marejada'];
  return '<div class="fih">'+N.map(function(n,i){var w=i+1,p='';for(var j=0;j<w;j++)p+='M2 '+(8+j*5)+'c3-3 5-3 8 0s5 3 8 0 4-3 4-1';return '<div class="fic l'+f.mar[i]+'">'+fiSv(p)+'<b>'+n+'</b></div>'}).join('')+'</div>'
}
function fiFishSVG(x,y,c){return '<g transform="translate('+x+','+y+')" fill="'+c+'" fill-opacity=".95" stroke="none"><path d="M-14 0c4-6 12-7 20-2l5 2-5 2c-8 5-16 4-20-2zM11 0l7-6v12z"/><circle cx="-8" cy="-1" r="1.4" fill="#04222a"/></g>'}
function fiColumn(f){
  var W=320,H=150,px={pg:70,ce:140,ab:240}[f.ps]||150;
  var top=26+f.v[0]*100,bot=26+f.v[1]*100;if(bot-top<18){top=Math.max(22,bot-18)}
  var ymid=Math.min(120,(top+bot)/2);
  var s='<svg class="fiw" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Dónde está en el agua">';
  s+='<defs><linearGradient id="fiwg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c6f86"/><stop offset="1" stop-color="#0a2530"/></linearGradient></defs>';
  s+='<rect width="'+W+'" height="'+H+'" rx="14" fill="url(#fiwg)"/>';
  s+='<rect x="0" y="20" width="'+W+'" height="2" fill="#bfeaf0" opacity=".5"/>';
  s+='<path d="M0 20c10-5 20-5 30 0s20 5 30 0 20-5 30 0 20 5 30 0 20-5 30 0 20 5 30 0 20-5 30 0 20 5 30 0 20-5 30 0" fill="none" stroke="#bfeaf0" stroke-width="1.6" opacity=".7"/>';
  /* fondo y roca */
  s+='<path d="M0 60 L48 60 L62 100 L90 118 L170 132 L'+W+' 138 V'+H+' H0z" fill="#07161c"/>';
  s+='<path d="M0 60l12-6 14 4 10-8 12 6 14 10 8 18 10 28-16 14H0z" fill="#26434f"/>';
  if(f.st.indexOf('es')>-1||f.st.indexOf('ro')>-1)s+='<path d="M36 56c4-6 8-6 12 0s8 6 12 0" fill="none" stroke="#fff" stroke-width="2" opacity=".8"/><circle cx="44" cy="52" r="2" fill="#fff" opacity=".7"/><circle cx="58" cy="53" r="1.6" fill="#fff" opacity=".6"/>';
  if(f.st.indexOf('al')>-1)s+='<path d="M72 112c-6-10 5-14 0-26M82 118c-6-10 5-14 0-24" stroke="#4fb86a" stroke-width="3" fill="none" stroke-linecap="round"/>';
  if(f.st.indexOf('ar')>-1||f.st.indexOf('fa')>-1)s+='<path d="M120 134c20 3 60 4 100 3" stroke="#d7c08a" stroke-width="3" fill="none" opacity=".6"/>';
  /* zona */
  var x0=Math.max(10,px-52),x1=Math.min(W-10,px+52);
  s+='<rect x="'+x0+'" y="'+top+'" width="'+(x1-x0)+'" height="'+(bot-top)+'" rx="12" fill="#3fd0c9" fill-opacity=".18" stroke="#3fd0c9" stroke-dasharray="4 3" stroke-width="1.4"/>';
  s+=fiFishSVG(px,ymid,'#3fd0c9')+fiFishSVG(px-26,ymid+(bot-top>40?8:3),'#3fd0c9').replace('.95','.5');
  s+='<text x="'+(W-10)+'" y="16" text-anchor="end" font-size="11" fill="#eaf4f6" opacity=".85">'+fiEsc(f.dp)+'</text>';
  var L={pg:'Pegado a la piedra',ce:'A pocos metros',ab:'Más a fuera'}[f.ps];
  s+='<text x="10" y="'+(H-6)+'" font-size="10.5" fill="#eaf4f6" opacity=".85">'+L+'</text>';
  return s+'</svg>'
}
function fiItems(arr){
  if(!arr.length)return '<p class="fis">—</p>';
  return '<div class="fig">'+arr.map(function(a){return '<div class="fit'+(a[2]>=3?' fav':'')+'">'+fiIc(a[0])+'<span>'+fiEsc(a[1])+'</span>'+(a[2]>=3?'<em>Favorito</em>':'')+'</div>'}).join('')+'</div>'
}
function fiHTML(k){
  var f=FI[k];if(!f)return '';
  var sp=SPB[k],h='<div class="block fi"><span class="eyebrow">Ficha de pesca</span>';
  if(f.ban){return h+'<p class="fitip">'+fiEsc(f.tip)+'</p></div>'}
  var at=FI_AT[f.at[0]]||FI_AT.suave;
  h+='<div class="fiat"><div class="fiatb">'+fiSv('M13 2L4 14h7l-1 8 9-12h-7z')+'<b>'+at[0]+'</b></div><p>'+fiEsc(f.at[1]||at[1])+'</p></div>';
  h+='<div class="fih2"><span>Dónde está</span></div>'+fiColumn(f);
  h+='<div class="fich">'+f.st.map(function(c){var s=FI_ST[c];return s?'<span class="fich1">'+fiSv(s[1])+s[0]+'</span>':''}).join('')+'</div>';
  h+='<div class="fih2"><span>Cuándo</span></div>'+fiMonths(f)+fiHours(f);
  h+='<div class="fih2"><span>Con qué mar y marea</span></div>'+fiSea(f)+'<p class="fis">'+(FI_TI[f.ti]||'')+'</p>';
  if(f.b.length){h+='<div class="fih2"><span>Cebos</span></div>'+fiItems(f.b)}
  if(f.l.length){h+='<div class="fih2"><span>Señuelos</span></div>'+fiItems(f.l)}
  if(f.te&&f.te.length)h+='<div class="fih2"><span>Modalidades</span></div><div class="fich">'+f.te.map(function(c){var s=FI_MOD[c];return s?'<span class="fich1">'+fiSv(s[1])+s[0]+'</span>':''}).join('')+'</div>';
  if(f.bo)h+='<p class="fis">Se pesca sobre todo desde barco.</p>';
  h+='<p class="fitip">'+fiSv('M12 2a7 7 0 0 0-4 12.7V18h8v-3.3A7 7 0 0 0 12 2zM9 21h6')+'<span>'+fiEsc(f.tip)+'</span></p>';
  h+='<div class="fih2"><span>Mis notas</span></div><textarea class="finote" id="fi-note" rows="3" placeholder="Lo que has aprendido de esta especie: spot, cebo, hora…"></textarea>';
  h+='<details class="szd"><summary>De dónde sale esto</summary><p>Guía orientativa de pesca recreativa en el Cantábrico, con apoyo en la guía de cebos del Gobierno Vasco y de pescadores. No es normativa oficial. Si tu experiencia dice otra cosa, apúntala en «Mis notas».</p></details>';
  return h+'</div>'
}
var _osd19=openSpeciesDetail;
openSpeciesDetail=function(k){
  _osd19(k);
  try{
    if(!SPB[k]||!FI[k])return;
    var sh=document.querySelector('#sheet');
    var bl=[].slice.call(sh.querySelectorAll('.block')).filter(function(b){var e=b.querySelector('.eyebrow');return e&&/Talla m|Tus capturas/.test(e.textContent)})[0];
    var first=sh.querySelector('.block');
    (first?first:bl).insertAdjacentHTML('afterend',fiHTML(k));
    var ta=sh.querySelector('#fi-note');if(!ta)return;
    var ref=db.collection('speciesNotes').doc(k);
    ref.get().then(function(d){var v=d&&d.exists!==false&&(d.data?d.data():d);if(v&&v.text&&!ta.value)ta.value=v.text}).catch(function(){});
    var T=null;ta.addEventListener('input',function(){clearTimeout(T);T=setTimeout(function(){ref.set({text:ta.value,updatedAt:Date.now()})},700)});
    ta.addEventListener('blur',function(){clearTimeout(T);ref.set({text:ta.value,updatedAt:Date.now()})});
  }catch(e){console.warn('ficha',e)}
};
var _st19=document.createElement('style');_st19.textContent='.fi{display:block}.fi .bi{width:30px;height:30px;flex:none}.fi svg{display:block}.fiat{display:flex;gap:10px;align-items:center;background:var(--accent-soft);border:1px solid rgba(63,208,201,.45);border-radius:14px;padding:10px 12px;margin:6px 0 4px}.fiatb{display:flex;flex-direction:column;align-items:center;gap:2px;color:var(--accent);min-width:64px}.fiatb svg{width:26px;height:26px}.fiatb b{font:700 13px var(--display,inherit)}.fiat p{margin:0;font-size:13.5px;line-height:1.35}.fih2{margin:14px 0 6px;font:700 11px var(--mono,monospace);letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}.fiw{width:100%;height:auto;border-radius:14px}.fich{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 0}.fich1{display:inline-flex;gap:6px;align-items:center;padding:6px 10px;border-radius:999px;border:1px solid var(--line2);background:var(--surface);font-size:12.5px}.fich1 svg{width:16px;height:16px;color:var(--accent)}.fim,.fih{display:grid;gap:4px;margin-top:2px}.fim{grid-template-columns:repeat(12,1fr)}.fih{grid-template-columns:repeat(4,1fr);margin-top:8px}.fih:has(.fic:nth-child(3):last-child){grid-template-columns:repeat(3,1fr)}.fic{position:relative;border-radius:8px;background:var(--surface);border:1px solid var(--line);padding:6px 2px 4px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:3px;color:var(--dim)}.fic b{font:600 10.5px var(--body,inherit)}.fic svg{width:20px;height:20px}.fic i{display:block;width:100%;height:26px;border-radius:5px;background:var(--surface2)}.fic.l1{background:rgba(63,208,201,.14);border-color:rgba(63,208,201,.4);color:var(--ink)}.fic.l2{background:rgba(63,208,201,.38);border-color:var(--accent);color:var(--ink)}.fic.l1 i{background:rgba(63,208,201,.4)}.fic.l2 i{background:var(--accent)}.fic.l0 i{opacity:.4}.fic.now{box-shadow:0 0 0 2px var(--ink)}.fis{margin:6px 0 0;font-size:12.5px;color:var(--muted)}.fig{display:grid;grid-template-columns:repeat(auto-fill,minmax(98px,1fr));gap:8px}.fit{position:relative;display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 6px 8px;text-align:center;border-radius:14px;background:var(--surface);border:1px solid var(--line);font-size:12px;line-height:1.2}.fit.fav{border-color:var(--accent);background:var(--accent-soft)}.fit .bi{width:34px;height:34px;color:var(--accent)}.fit em{font:700 9.5px var(--mono,monospace);letter-spacing:.06em;text-transform:uppercase;color:var(--accent);font-style:normal}.fitip{display:flex;gap:10px;align-items:flex-start;margin:14px 0 0;padding:10px 12px;border-radius:12px;background:var(--surface);border:1px solid var(--line);font-size:13.5px;line-height:1.4}.fitip svg{width:20px;height:20px;color:#f5b041;flex:none;margin-top:1px}.finote{width:100%;box-sizing:border-box;background:var(--surface);color:var(--ink);border:1px solid var(--line2);border-radius:12px;padding:10px 12px;font:14px/1.4 var(--body,inherit);resize:vertical}';
document.head.appendChild(_st19);
