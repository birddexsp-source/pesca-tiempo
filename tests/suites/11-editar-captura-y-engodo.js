/* Editar capturas desde el registro de la salida y categoría Engodo. */
/* abre una salida con reintentos (la lista puede recargarse justo después de un reload) */
async function abrirSalida(t, id) {
  for (let k = 0; k < 8; k++) {
    if (await t.has('.tdv')) return;
    if (await t.has('[data-a="trip-open"][data-id="' + id + '"]')) await t.page.evaluate((i) => { const o = document.querySelector('[data-a="trip-open"][data-id="' + i + '"]'); o && o.click(); }, id);
    await t.wait(1000);
  }
}
module.exports = {
  name: 'Editar capturas y Engodo',
  async run(t) {
    await t.seed(); await t.goTab('salidas');
    const sesion = async () => (await t.docs('sesiones'))[0];
    const cap = async () => (await t.docs('catches'))[0];
    await t.case('Engodo existe en Mi equipo con «Verdel (casero)»', async () => {
      let v = null; for (let i = 0; i < 20 && !v; i++) { v = (await t.docs('gearInv')).find(x => x.kind === 'engodo'); if (!v) await t.wait(500); }
      t.ok('Verdel (casero) creado', !!v && v.name === 'Verdel (casero)');
      await t.goTab('equipo'); t.ok('categoría Engodo en la rejilla', (await t.T('.eqgrid')).includes('Engodo'));
      await t.tap('[data-a="eqp-cat"][data-k="engodo"]', 400); t.ok('lista con Verdel', (await t.T('#eqlist')).includes('Verdel (casero)'));
    });
    await t.case('añadir otro engodo', async () => {
      await t.tap('[data-a="eqp-new"]', 400); await t.fill('#eqf-name', 'Pasta de sardina'); await t.fill('#eqf-base', 'Sardina, pan, anís');
      await t.tap('[data-a="eqp-save"]', 800);
      t.ok('guardado', (await t.docs('gearInv')).some(x => x.kind === 'engodo' && x.name === 'Pasta de sardina'));
    });
    await t.case('montar salida: Engodo se puede marcar', async () => {
      await t.goTab('salidas'); await t.tap('[data-a="new-trip"]'); await t.tap('[data-a="lv-live"]', 500);
      await t.page.evaluate(() => { const d = document.querySelector('details[data-lk="lvengodo"]'); if (d) d.open = true; });
      t.ok('sección Engodo', await t.has('details[data-lk="lvengodo"]'));
      await t.tap('details[data-lk="lvengodo"] .utile', 300);
      t.ok('un engodo marcado', (await t.N('details[data-lk="lvengodo"] .utile.on')) === 1);
      await t.tap('[data-a="lv-start"]', 800);
      const rig = ((await sesion()).equipos || [])[0] || {};
      t.ok('engodo en el equipo de la salida', (rig.used || []).some(u => u.kind === 'engodo'));
    });
    await t.case('capturar y editar desde el registro', async () => {
      await t.tap('[data-a="lv-cap"]', 600); await t.tap('[data-a="qc-sp"]', 150); await t.tap('#qc-ok', 900);
      t.ok('captura en el registro', await t.has('#sessbody .qcm[data-a="qc-edit"]'));
      t.eq('empieza «a casa»', (await cap()).items[0].st, 'casa');
      await t.tap('#sessbody .qcm[data-a="qc-edit"]', 600);
      t.ok('hoja «Editar captura»', (await t.T('.sh h2')) === 'Editar captura' && await t.has('#qe-ok'));
      await t.tap('[data-a="qc-st"][data-v="lib"]', 150); await t.tap('[data-a="qc-size"][data-v="L"]', 150); await t.tap('[data-a="qc-qty"][data-d="1"]', 150);
      await t.tap('#qe-ok', 900);
      const i = (await cap()).items[0];
      t.eq('ahora liberada', i.st, 'lib'); t.eq('talla L', i.size, 'L'); t.eq('2 ejemplares', i.n, 2);
      t.ok('vuelve a la consola', await t.has('#sessbody'));
      t.ok('el registro lo refleja', (await t.T('#sessbody')).includes('liberada'));
    });
    await t.case('el lápiz también abre la edición y cancelar no cambia nada', async () => {
      await t.tap('#sessbody .qce', 600); t.ok('abre edición', await t.has('#qe-ok'));
      await t.tap('[data-a="qc-st"][data-v="esc"]', 150); await t.tap('[data-a="close-sheet"]', 500);
      t.eq('sin cambios al cancelar', (await cap()).items[0].st, 'lib'); t.ok('consola', await t.has('#sessbody'));
    });
    await t.case('borrar pide confirmación', async () => {
      await t.tap('#sessbody .qcm[data-a="qc-edit"]', 600);
      await t.tap('#qe-del', 300); t.eq('aún existe tras el primer toque', (await t.docs('catches')).length, 1);
      await t.tap('#qe-del', 900); t.eq('borrada', (await t.docs('catches')).length, 0);
    });
    await t.case('también se edita desde «Por ordenar» (sin salida en curso)', async () => {
      await t.put('catches', 'q1', { quick: true, date: '2026-11-05', time: '10:00', ts: Date.now() - 3600e3, lat: null, lon: null, spotId: null, photos: [], items: [{ species: 'Lubina', key: 'lubina', n: 1, size: 'M', st: 'casa' }] });
      await t.page.evaluate(async () => { const db = await window.claude.use('db'); const s = await db.collection('sesiones').doc('activa').get(); if (s.exists) await db.collection('sesiones').doc('activa').delete(); });
      await t.reload(); await t.goTab('capturas');
      await t.tap('.qcday .qcm[data-a="qc-edit"]', 600); t.ok('hoja de edición', await t.has('#qe-ok'));
      await t.tap('[data-a="qc-st"][data-v="esc"]', 150); await t.tap('#qe-ok', 900);
      t.eq('escapada', (await t.docs('catches')).find(c => c.id === 'q1').items[0].st, 'esc');
      t.ok('hoja cerrada', !(await t.has('#qe-ok')));
    });
    await t.case('con una salida en curso, Verdel nuevo queda activo (alta única)', async () => {
      await t.page.evaluate(async () => { const db = await window.claude.use('db'); await db.collection('gearInv').doc('engodo-verdel').delete(); await db.collection('gearMeta').doc('seedEngodo1').delete(); });
      await t.goTab('salidas'); await t.tap('[data-a="new-trip"]'); await t.tap('[data-a="lv-live"]', 500); await t.tap('[data-a="lv-start"]', 900);
      await t.reload(); await t.wait(3500);
      const rig = ((await sesion()).equipos || [])[0] || {};
      t.ok('Verdel activo en el equipo de la salida', (rig.used || []).some(u => u.kind === 'engodo' && u.name === 'Verdel (casero)'));
    });
    await t.case('terminar sin ninguna captura también deja la salida guardada', async () => {
      const antes = (await t.docs('trips')).length;
      await t.page.evaluate(async () => { const db = await window.claude.use('db'); const s = await db.collection('sesiones').doc('activa').get(); if (s.exists) await db.collection('sesiones').doc('activa').delete(); });
      await t.reload(); await t.goTab('salidas'); await t.tap('[data-a="new-trip"]'); await t.tap('[data-a="lv-live"]', 500); await t.tap('[data-a="lv-start"]', 900);
      await t.tap('[data-a="sess-finish"]', 200); await t.tap('[data-a="sess-finish"]', 2500);
      t.eq('una salida más', (await t.docs('trips')).length, antes + 1); t.eq('sesión cerrada', (await t.docs('sesiones')).length, 0);
    });
    await t.case('«Siguiente» no se queda mudo aunque un dato venga roto', async () => {
      await t.put('trips', 'roto', { date: '2026-11-01', mode: 'Spinning', siteId: 's1', siteName: 'Matxitxako', stops: [], equipos: [], eventos: [null, { t: 1, type: 'spot', name: 'X' }] });
      await t.reload(); await t.goTab('salidas');
      await abrirSalida(t, 'roto'); await t.page.evaluate(() => { const b = document.querySelector('[data-a="edit-trip"][data-id="roto"]'); b && b.click(); }); await t.wait(700);
      for (let i = 0; i < 3; i++) await t.tapIf('[data-a="next-step"]', 500);
      t.ok('llega a «Guardar salida»', await t.has('[data-a="save-trip"]'));
      await t.tap('[data-a="save-trip"]', 1500); t.ok('se guarda', !(await t.has('#sheet [data-a="save-trip"]')));
    });
    await t.case('el registro (con audios) se ve en «Ver detalle» de una salida guardada', async () => {
      await t.put('trips', 'conreg', { date: '2026-11-02', mode: 'Spinning', siteId: 's1', siteName: 'Matxitxako', stops: [], equipos: [], eventos: [{ t: 1762070000000, type: 'start' }, { t: 1762071000000, type: 'spot', name: 'Cala de abajo', why: 'Mucha ola' }] });
      await t.reload(); await t.goTab('salidas');
      await t.page.evaluate(() => { const b = document.querySelector('[data-a=\"trip-open\"][data-id=\"conreg\"]'); b && b.click(); }); await t.wait(300); await t.tap('[data-a=\"trip-tab\"][data-v=\"reg\"]', 400);
      t.ok('aparece el registro', await t.has('.lvtl'));
      t.ok('con el cambio de spot y su motivo', (await t.T('.lvtl')).includes('Mucha ola'));
    });
    await t.case('audios sueltos (de una salida que no guardó su registro) se pueden recuperar', async () => {
      await t.page.evaluate(async () => { const a = await window.claude.use('assets'); const wav = new Uint8Array([0x1A, 0x45, 0xDF, 0xA3, 1, 2, 3, 4, 5, 6, 7, 8]); for (let i = 0; i < 2; i++) await a.upload(new Blob([wav], { type: 'audio/webm' }), { type: 'audio/webm' }); });
      await t.wait(800); await t.reload(); await t.goTab('salidas');
      t.ok('aparece el aviso de audios sin asignar', (await t.T('.ovblk')).includes('2'));
      t.ok('sin botón de descargar en los audios sueltos', !(await t.has('.ovblk .dlbtn')) && !/descárgalos/.test(await t.T('.ovblk')));
      await t.page.evaluate(() => { document.querySelector('#ov-trip').value = 'conreg'; });
      await t.tap('[data-a="ov-assign"]', 900);
      const tr = (await t.docs('trips')).find(x => x.id === 'conreg');
      t.eq('2 notas nuevas en el registro', tr.eventos.filter(e => e.audio).length, 2);
      t.ok('el aviso desaparece', !(await t.has('.ovblk')));
    });
    await t.case('añadir a mano al registro: «Mikel se movió a Cala de abajo, en el charco»', async () => {
      await t.put('trips', 'casa1', { date: '2026-11-03', mode: 'Corcho', siteId: 's1', siteName: 'Matxitxako', stops: [], equipos: [], companions: [{ id: 'k1', name: 'Mikel' }] });
      await t.reload(); await t.goTab('salidas');
      await abrirSalida(t, 'casa1'); await t.page.evaluate(() => { const b = document.querySelector('[data-a="edit-trip"][data-id="casa1"]'); b && b.click(); }); await t.wait(700);
      for (let i = 0; i < 3; i++) await t.tapIf('[data-a="next-step"]', 450);
      t.ok('botón para añadir al registro', await t.has('[data-a="rx-open"]'));
      await t.tap('[data-a="rx-open"]', 300); await t.tap('[data-a="rx-who"][data-id="k1"]', 300);
      await t.tap('[data-a="rx-save"]', 300); t.ok('pide spot o detalle', /Elige el spot/.test(await t.toast() || ''));
      await t.page.selectOption('#rx-spot', 'sp2'); await t.fill('#rx-why', 'a la derecha, en el charco'); await t.tap('[data-a="rx-save"]', 500);
      const reg = await t.T('.lvtl'); t.ok('aparece en el registro con quién y dónde', reg.includes('Mikel') && reg.includes('Cala de abajo') && reg.includes('charco'), reg);
      await t.tap('[data-a="rx-open"]', 300); await t.tap('[data-a="rx-type"][data-v="note"]', 300); await t.fill('#rx-why', 'El Charro: pez de colores tipo durdo'); await t.tap('[data-a="rx-save"]', 500);
      t.ok('nota añadida', (await t.T('.lvtl')).includes('Charro'));
      await t.tap('[data-a="save-trip"]', 1500);
      const ev = (await t.docs('trips')).find(x => x.id === 'casa1').eventos || [];
      t.ok('guardado en la salida', ev.length === 2 && ev.some(e => e.type === 'spot' && e.who === 'k1' && e.name === 'Cala de abajo') && ev.some(e => e.type === 'note'));
    });
    await t.case('lo que pescan los compañeros no cuenta como mío', async () => {
      await t.put('trips', 'comp1', { date: '2026-11-04', mode: 'Corcho', siteId: 's1', siteName: 'Matxitxako', stops: [{ id: 'st1', spotId: 'sp1', spotName: 'Punta del faro' }], equipos: [], companions: [{ id: 'k1', name: 'Mikel' }] });
      await t.put('catches', 'cc1', { tripId: 'comp1', date: '2026-11-04', siteId: 's1', photos: [], notes: '', items: [
        { species: 'Boga', key: 'boga', n: 2, size: 'M', st: 'casa', stopId: 'st1' },
        { species: 'Charro', key: null, n: 1, size: 'M', st: 'lib', stopId: 'st1', who: 'k1' }] });
      await t.reload(); await t.goTab('salidas');
      const cuenta = await t.page.evaluate(() => { const c = document.querySelector('.trip[data-id], .trip'); return [...document.querySelectorAll('.fbadge b')].map(x => x.textContent); });
      t.ok('el contador de peces de la salida solo cuenta los míos', cuenta.includes('2') && !cuenta.includes('3'), cuenta.join(','));
      await t.goTab('capturas'); await t.tap('[data-a="capview"][data-v="especies"]', 500);
      await t.page.evaluate(() => { document.querySelector('#sp-q').value = 'charro'; document.querySelector('#sp-q').dispatchEvent(new Event('input', { bubbles: true })); }); await t.wait(400);
      t.ok('«Charro» (de un compañero) no sale entre mis especies capturadas', !(await t.has('#sp-grid .cromo.got')), await t.T('#sp-grid'));
      await t.page.evaluate(() => { document.querySelector('#sp-q').value = 'boga'; document.querySelector('#sp-q').dispatchEvent(new Event('input', { bubbles: true })); }); await t.wait(400);
      t.ok('mi Boga sí cuenta', await t.has('#sp-grid .cromo.got'));
    });
    await t.case('registro del 5-nov: reconoce audios por contenido, los ordena y no duplica', async () => {
      await t.put('trips', 'dia5', { date: '2026-11-05', mode: 'Corcho', siteId: 's1', siteName: 'Matxitxako', stops: [], equipos: [], companions: [{ id: 'k1', name: 'Maik' }], eventos: [{ t: 5, type: 'note', audio: 'x-viejo-dup', noTime: true }] });
      const hs = await t.page.evaluate(async () => {
        const a = await window.claude.use('assets'), mk = async (bytes) => { const bl = new Blob([new Uint8Array(bytes)], { type: 'audio/webm' }); const { id } = await a.upload(bl, { type: 'audio/webm' }); const d = await crypto.subtle.digest('SHA-256', await bl.arrayBuffer()); return Array.from(new Uint8Array(d)).map(x => ('0' + x.toString(16)).slice(-2)).join(''); };
        const h1 = await mk([0x1A, 0x45, 0xDF, 0xA3, 9, 9, 9]), h2 = await mk([0x1A, 0x45, 0xDF, 0xA3, 8, 8, 8]), h3 = await mk([0x1A, 0x45, 0xDF, 0xA3, 9, 9, 9]);   // h3 = copia de h1
        window.__RGTEST = { [h1]: 'eq1', [h2]: 'tragado' }; return [h1, h2, h3];
      });
      await t.wait(800);
      const r = await t.page.evaluate(() => window.__rgRun(true, 'dia5'));
      t.ok('aplicado a la salida del día', r && r.trip === 'dia5' && r.audios === 2, JSON.stringify(r));
      const ev = (await t.docs('trips')).find(x => x.id === 'dia5').eventos;
      t.ok('16 hechos del día + el evento ajeno', ev.length === 17 && ev.some(e => e.audio === 'x-viejo-dup'), String(ev.length));
      t.eq('empieza en la Piedra 1', ev[0].name, 'Piedra 1');
      t.ok('orden: cambio de equipo antes del cambio a Piedra 2', ev.findIndex(e => e.type === 'eq') < ev.findIndex(e => e.name === 'Piedra 2'));
      t.ok('Maik llega a la Piedra 3 con su id', ev.some(e => e.type === 'spot' && e.who === 'k1' && e.name === 'Piedra 3'));
      t.eq('un solo evento con el audio duplicado', ev.filter(e => e.audio && e.type === 'eq' && e.names === 'Plomín → corcho').length, 1);
      t.eq('los demás no llevan audio inventado', ev.filter(e => e.audio && e.audio !== 'x-viejo-dup').length, 2);
      await t.page.evaluate(() => { delete window.__RGTEST; });
      await t.reload(); await t.goTab('salidas');
      await t.page.evaluate(() => { const b = document.querySelector('[data-a=\"trip-open\"][data-id=\"dia5\"]'); b && b.click(); }); await t.wait(300); await t.tap('[data-a=\"trip-tab\"][data-v=\"reg\"]', 400);
      const reg = await t.T('.lvtl'); t.ok('se ve en Ver detalle con título y detalle', reg.includes('Piedra 1') && reg.includes('dos lados de lanzado') && reg.includes('Plomín'), reg.slice(0, 120));
      let g = (await t.docs('gearInv')).find(x => x.id === 'anz-peq-plateado'); for (let i = 0; i < 12 && !g; i++) { await t.wait(500); g = (await t.docs('gearInv')).find(x => x.id === 'anz-peq-plateado'); }
      t.ok('anzuelo pequeño plateado en Mi equipo', !!g);
    });
    await t.case('transcripción visible en el registro y «Cambio de bajo» con etiqueta', async () => {
      await t.put('trips', 'bj1', { date: '2026-10-01', mode: 'Corcho', siteId: 's1', siteName: 'Matxitxako', stops: [], equipos: [{ id: 'e1', used: [] }], companions: [], eventos: [
        { t: 1000, type: 'eq', eq: 'e1', names: 'Bajo: 0,20 mm · nº 4', what: ['bajo'], bajo: { fluoro: '0,20', anzuelo: 'nº 4' }, text: 'cambio el bajo al veinte' },
        { t: 2000, type: 'eq', eq: 'e1', names: 'Corcho', what: ['anzuelo', 'corcho'] }] });
      await t.reload(); await t.goTab('salidas');
      await t.page.evaluate(() => { const b = document.querySelector('[data-a=\"trip-open\"][data-id=\"bj1\"]'); b && b.click(); }); await t.wait(300); await t.tap('[data-a=\"trip-tab\"][data-v=\"reg\"]', 400);
      const reg = await t.T('.lvtl');
      await t.page.evaluate(() => { const d = document.querySelector('.trxd'); d && (d.open = true); const l = document.querySelector('.lvtl'); l && l.scrollIntoView(); }); await t.wait(300); await t.shot('registro-notas');
      t.ok('título «Cambio de bajo»', reg.includes('Cambio de bajo'), reg.slice(0, 200));
      t.ok('título «Cambio de anzuelo y corcho»', reg.includes('Cambio de anzuelo y corcho'), reg.slice(0, 300));
      t.ok('transcripción bajo el hecho', (await t.page.evaluate(() => (document.querySelector('.trxd p') || {}).textContent || '')).includes('cambio el bajo al veinte'));
      t.ok('la transcripción va en un desplegable «Ver texto»', (await t.N('.trxd summary')) === 1 && /Ver texto/.test(reg));
    });
    await t.case('Bajos montados en Mi equipo', async () => {
      await t.put('gearInv', 'bajo-020', { kind: 'bajo', name: 'Bajo 0,20 anzuelo 4', fluoro: '0,20', anzuelo: 'nº 4 azul', largo: '120', createdAt: 1 });
      await t.reload(); await t.goTab('equipo');
      await t.wait(500);
      t.ok('categoría «Bajos montados»', /Bajos montados/.test(await t.T('main')));
      await t.tap('[data-a="eqp-cat"][data-k="bajo"]', 500);
      t.ok('el bajo aparece con su nombre', (await t.T('#eqpane')).includes('Bajo 0,20 anzuelo 4'), (await t.T('#eqpane')).slice(0, 200));
    });
    await t.case('Salidas: tarjeta compacta; al tocar se abre el detalle con pestañas horizontales', async () => {
      await t.put('trips', 'vis1', { date: '2026-09-20', mode: 'Corcho', siteId: 's1', siteName: 'Bakio', stops: [], equipos: [], companions: [], eventos: [{ t: 1, type: 'note', title: 'Hola', noTime: true }] });
      for (let k = 0; k < 6; k++) await t.put('catches', 'vc' + k, { date: '2026-09-20', time: '10:0' + k, ts: 100 + k, tripId: 'vis1', items: [{ species: k < 4 ? 'Oblada' : 'Sargo', key: null, n: 2, size: 'M', st: 'lib' }] });
      await t.reload(); await t.goTab('salidas');
      t.ok('la tarjeta no lista cada captura', !(await t.has('.tcc .fcs, .tcc .qcrow')));
      t.ok('contador de peces en la tarjeta', (await t.page.evaluate(() => [...document.querySelectorAll('.fbadge b')].map(x => x.textContent))).includes('12'));
      await t.page.evaluate(() => { const b = [...document.querySelectorAll('[data-a="trip-open"]')].find(x => x.getAttribute('data-id') === 'vis1'); b && b.click(); }); await t.wait(400);
      t.ok('barra de pestañas', await t.has('.tdtabs'));
      const tabs = await t.T('.tdtabs'); t.ok('pestañas Resumen/Capturas/Registro', /Resumen/.test(tabs) && /Capturas/.test(tabs) && /Registro/.test(tabs), tabs);
      t.ok('no desborda en horizontal', (await t.overflow()).length === 0);
      await t.tap('[data-a="trip-tab"][data-v="cap"]', 400);
      t.eq('tarjetas por especie', await t.page.evaluate(() => document.querySelectorAll('.tds').length), 2);
      t.ok('ya no hay botón de borrar el registro entero', !(await t.has('.tdbody .qcrow')));
      await t.shot('salida-capturas');
      await t.tap('[data-a="trip-tab"][data-v="reg"]', 400); t.ok('registro', await t.has('.lvtl'));
      await t.tap('[data-a="trip-back"]', 400); t.ok('volver a la lista', (await t.has('.tcc')) && !(await t.has('.tdtabs')));
      await t.page.evaluate(() => { const c = document.querySelector('.tcc'); c && c.scrollIntoView(); }); await t.wait(300); await t.shot('salidas-lista');
    });
    await t.case('Mi recorrido: mapa con flechas entre spots, hacia dónde lanzas y es editable', async () => {
      await t.put('trips', 'rt1', { date: '2026-09-21', mode: 'Corcho', siteId: 's1', siteName: 'Matxitxako', stops: [], equipos: [], companions: [{ id: 'k1', name: 'Mikel' }], eventos: [
        { t: 1000, type: 'start', name: 'Punta del faro' }, { t: 2000, type: 'spot', name: 'Cala de abajo' },
        { t: 3000, type: 'spot', name: 'Cala de abajo' }, { t: 4000, type: 'spot', name: 'Piedra 9' }, { t: 5000, type: 'spot', name: 'Cala bonita', who: 'k1' }] });
      await t.reload(); await t.goTab('salidas');
      await t.page.evaluate(() => { const b = document.querySelector('[data-a="trip-open"][data-id="rt1"]'); b && b.click(); }); await t.wait(900);
      t.ok('hay mapa del recorrido', await t.has('#rtmap'));
      t.eq('3 paradas (la repetida se une y lo de Mikel no cuenta)', await t.N('.rtn'), 3);
      await t.wait(600);
      t.eq('2 puntos en el mapa (la 3ª no tiene spot)', await t.N('.rtpin'), 2);
      t.ok('flecha entre A y B', (await t.page.evaluate(() => document.querySelectorAll('#rtmap svg path').length)) >= 2);
      await t.shot('mi-recorrido');
      await t.tap('[data-a="rt-edit"][data-k="e:4000"]', 500);
      await t.page.evaluate(() => { const s = document.querySelector('#rt-spot'); s.value = 'sp3'; });
      await t.tap('[data-a="rt-dir"][data-v="NE"]', 200); await t.tap('[data-a="rt-side"][data-v="Izquierda"]', 150); await t.tap('[data-a="rt-side"][data-v="Derecha"]', 150);
      await t.tap('[data-a="rt-save"]', 900);
      const r = ((await t.docs('trips')).find(x => x.id === 'rt1') || {}).ruta || {};
      t.ok('se guarda el spot, la dirección y los lados', r['e:4000'] && r['e:4000'].spotId === 'sp3' && r['e:4000'].dir === 'NE' && r['e:4000'].sides.join() === 'Izquierda,Derecha', JSON.stringify(r));
      await t.wait(700);
      t.eq('ahora 3 puntos en el mapa', await t.N('.rtpin'), 3);
      t.ok('la parada muestra NE y los lados', /NE/.test(await t.T('.rtstrip')) && /Izquierda → Derecha/.test(await t.T('.rtstrip')));
      t.ok('no desborda en horizontal', (await t.overflow()).length === 0);
      await t.shot('mi-recorrido-editado');
    });
    await t.case('Equipo del editor sin repeticiones: línea de mi lista + longitud; ruta no se pierde al guardar', async () => {
      await t.put('trips', 'ed1', { date: '2026-09-22', mode: 'Corcho', siteId: 's1', siteName: 'Matxitxako', stops: [{ id: 'a', spotId: 'sp1', spotName: 'Punta del faro', tFrom: '08:00', tTo: '12:00' }], equipos: [{ id: 'e1' }], companions: [],
        ruta: { 'e:1000': { dir: 'NE', sides: ['Izquierda'] } },
        eventos: [{ t: 1000, type: 'start', name: 'Punta del faro' }, { t: 2000, type: 'spot', name: 'Piedra A' }, { t: 3000, type: 'spot', name: 'Piedra B' }] });
      await t.wait(900); await t.reload(); await t.goTab('salidas');
      await abrirSalida(t, 'ed1'); await t.page.evaluate(() => { const b = document.querySelector('[data-a="edit-trip"][data-id="ed1"]'); b && b.click(); }); await t.wait(900);
      await t.page.evaluate(() => { const g = document.querySelector('.gtop > summary'); g && g.click(); document.querySelectorAll('#gearblk details').forEach(d => d.open = true); }); await t.wait(400);
      const gk = await t.page.evaluate(() => [...document.querySelectorAll('#gearblk details[data-gk^="e0"]')].map(d => d.dataset.gk));
      t.ok('quedan Línea y Aparejo; ya no hay Anzuelo ni Caña y carrete sueltos', gk.includes('e0linea') && gk.includes('e0apar') && !gk.includes('e0anz') && !gk.includes('e0cana'), gk.join());
      t.ok('sin «Mis corchos» repetido', !/Mis corchos/.test(await t.T('details[data-gk="e0apar"]')));
      t.ok('la línea se elige de mi lista con tiles', (await t.N('details[data-gk="e0linea"] .utile')) > 0);
      t.ok('longitud del bajo', /longitud del bajo/i.test(await t.T('details[data-gk="e0linea"]')));
      await t.tap('details[data-gk="e0linea"] .utile', 300); await t.tap('details[data-gk="e0linea"] [data-f="bajo"][data-v="1,5 m"]', 300);
      await t.tap('[data-a="next-step"]', 500);
      t.ok('aviso en el paso Spots: el registro tiene 3 paradas', /3 paradas/.test(await t.T('.rtedhint')));
      for (let i = 0; i < 2; i++) await t.tapIf('[data-a="next-step"]', 450);
      await t.tapIf('#sheet .btn.primary', 1200); await t.wait(1000);
      const tr = (await t.docs('trips')).find(x => x.id === 'ed1');
      t.ok('se guarda la longitud del bajo', tr && tr.equipos && tr.equipos[0] && tr.equipos[0].bajo === '1,5 m', JSON.stringify(tr && tr.equipos));
      t.ok('la ruta (hacia dónde lanzo) sigue ahí', tr && tr.ruta && tr.ruta['e:1000'] && tr.ruta['e:1000'].dir === 'NE', JSON.stringify(tr && tr.ruta));
    });
    await t.case('Mi recorrido: marcar en el mapa una parada sin ubicar y ponerle nombre crea el spot', async () => {
      await t.page.evaluate(() => { const d = document.querySelector('[data-a="trip-back"]'); d && d.click(); }); await t.wait(300);
      await abrirSalida(t, 'ed1'); await t.wait(500);
      t.ok('avisa de paradas sin ubicar', /sin ubicar/.test(await t.T('.rtcard')));
      await t.tap('[data-a="rt-edit"][data-k="e:2000"]', 500);
      await t.fill('#rt-name', 'Piedra 2'); await t.tap('[data-a="rt-mark"]', 1200);
      t.ok('se abre el selector de punto en el mapa', await t.has('#pkmap'));
      await t.tap('[data-a="mp-ok"]', 1200);
      const sp = (await t.docs('spots')).find(x => x.name === 'Piedra 2');
      t.ok('spot «Piedra 2» creado con coordenadas', !!sp && sp.lat != null && sp.siteId === 's1', JSON.stringify(sp));
      const tr = (await t.docs('trips')).find(x => x.id === 'ed1');
      t.ok('la parada queda enlazada al nuevo spot', tr.ruta['e:2000'] && tr.ruta['e:2000'].spotId === (sp && sp.id), JSON.stringify(tr.ruta));
      await t.wait(600); t.ok('el mapa ya tiene el punto nuevo', (await t.N('.rtpin')) >= 2);
    });
    await t.case('Mapa: pintar con el dedo/ratón la zona donde lanzas; al tocar un spot se ve su zona', async () => {
      await t.put('trips', 'cs1', { date: '2026-09-23', mode: 'Corcho', siteId: 's1', siteName: 'Matxitxako', stops: [], equipos: [], companions: [], eventos: [{ t: 1000, type: 'start', name: 'Punta del faro' }, { t: 2000, type: 'spot', name: 'Cala de abajo' }] });
      await t.wait(900); await t.reload(); await t.wait(1500); await t.goTab('salidas');
      await abrirSalida(t, 'cs1');
      for (let k = 0; k < 20 && !(await t.has('[data-a="rt-castmode"]')); k++) await t.wait(500);
      t.ok('botón «Pintar dónde lanzo»', /Pintar dónde lanzo/.test(await t.T('.rtbar')));
      await t.tap('[data-a="rt-castmode"]', 900);
      t.ok('explica los pasos', /Dibuja con el dedo/.test(await t.T('.rtbar')));
      const bx = await t.page.evaluate(() => { const r = document.getElementById('rtmap').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
      await t.page.evaluate(() => document.getElementById('rtmap').scrollIntoView({ block: 'center' })); await t.wait(300);
      const bb = await t.page.evaluate(() => { const r = document.getElementById('rtmap').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
      const cx = bb.x + bb.w * .5, cy = bb.y + bb.h * .5;
      await t.page.mouse.move(cx - 60, cy - 40); await t.page.mouse.down();
      for (let k = 0; k <= 24; k++) { const a = k / 24 * 2 * Math.PI; await t.page.mouse.move(cx + Math.cos(a) * 60, cy + Math.sin(a) * 40); }
      await t.page.mouse.up(); await t.wait(1500);
      let r = ((await t.docs('trips')).find(x => x.id === 'cs1') || {}).ruta || {};
      const key = Object.keys(r).find(k => r[k].areas);
      t.ok('se guarda una zona con varios puntos', key && r[key].areas.length === 1 && r[key].areas[0].length >= 8, JSON.stringify(r).slice(0, 200));
      t.ok('la zona pintada se ve en el mapa', (await t.N('path.rtarea')) >= 1);
      await t.shot('zona-pintada');
      await t.tap('[data-a="rt-castmode"]', 900);
      t.ok('la tira marca «zona»', /zona/.test(await t.T('.rtstrip')));
      await t.page.evaluate(() => { document.querySelector('.rtpin').click(); }); await t.wait(500);
      t.ok('al tocar el spot aparece su zona', (await t.N('path.rtarea')) >= 1);
      await t.tap('[data-a="rt-castmode"]', 900);
      await t.tap('[data-a="rt-clear"]', 1200);
      r = ((await t.docs('trips')).find(x => x.id === 'cs1') || {}).ruta || {};
      t.ok('«Borrar zonas» la quita', !Object.keys(r).some(k => r[k].areas), JSON.stringify(r).slice(0, 200));
    });
    await t.case('Resumen: una sola parada con varios spots lo dice y muestra A → B', async () => {
      await t.put('trips', 'mv1', { date: '2026-09-25', siteId: 's1', siteName: 'Matxitxako', companions: [],
        stops: [{ id: 'st1', spotName: 'Punta del faro', tFrom: '08:25', tTo: '12:28', photos: [], need: [], tags: [], baits: [] }],
        eventos: [{ t: 1000, type: 'start', name: 'Punta del faro', noTime: true }, { t: 2000, type: 'spot', name: 'Cala de abajo', noTime: true }] });
      await t.wait(900); await t.reload(); await t.wait(1500); await t.goTab('salidas');
      await abrirSalida(t, 'mv1'); await t.wait(600);
      const x = await t.page.evaluate(() => (document.querySelector('.tl3') || {}).textContent || '');
      t.ok('la parada muestra el recorrido A → B', /Punta del faro → Cala de abajo/.test(x), x.slice(0, 160));
      t.ok('aclara que es una sola parada', /Una sola parada/.test(x));
    });
    await t.case('Memoria del spot: visitas con condiciones, veredicto, qué cambiarías y «No ir si…»', async () => {
      await t.put('spots', 'mem1', { name: 'Roca memoria', siteId: 's1', lat: 43.45, lon: -2.75, createdAt: 1 });
      await t.put('trips', 'mt1', { date: '2026-10-20', siteId: 's1', siteName: 'Matxitxako', mode: 'Corcho', companions: [], stops: [{ id: 'a1', spotId: 'mem1', spotName: 'Roca memoria', tFrom: '08:00', tTo: '11:00', wave: 1.8, period: 9, wind: 25, gust: 40, waveV: 'mucho', windV: 'mucho', tideV: 'ok', hA: 1.2, hB: 3.1, photos: [], need: [], tags: [], baits: ['Gamba'], imp: 'Con tanto viento no se puede lanzar: volver con menos de 12 kph.', leftWhy: ['viento'] }], eventos: [] });
      await t.put('trips', 'mt2', { date: '2026-11-02', siteId: 's1', siteName: 'Matxitxako', mode: 'Corcho', companions: [], stops: [{ id: 'b1', spotId: 'mem1', spotName: 'Roca memoria', tFrom: '09:00', tTo: '12:00', wave: 0.8, period: 8, wind: 6, gust: 12, waveV: 'ok', windV: 'ok', tideV: 'ok', hA: 1.3, hB: 3.0, photos: [], need: [], tags: [], baits: [] }], eventos: [] });
      await t.put('catches', 'memc1', { tripId: 'mt2', date: '2026-11-02', ts: 7000, items: [{ species: 'Sargo', n: 2, st: 'casa', stopId: 'b1', spotId: 'mem1' }] });
      await t.wait(900); await t.reload(); await t.wait(1500); await t.goTab('salidas');
      await t.page.evaluate(() => { const b = document.createElement('button'); b.setAttribute('data-a', 'open-spot'); b.setAttribute('data-id', 'mem1'); b.id = 'tmpopen'; document.body.appendChild(b); b.click(); });
      await t.wait(1200);
      const x = await t.page.evaluate(() => (document.getElementById('sheetbody') || {}).textContent || '');
      t.ok('pestaña Visitas con 2 visitas', /Visitas · 2/.test(x), x.slice(0, 120));
      t.eq('una tarjeta por visita', await t.N('.mvc'), 2);
      t.ok('veredicto malo con el motivo', /demasiado viento/.test(x) && /demasiada ola/.test(x));
      t.ok('veredicto bueno', /Condiciones buenas/.test(x));
      t.ok('muestra qué cambiarías y «para la próxima vez»', /volver con menos de 12 kph/.test(x) && /Para la próxima vez/.test(x));
      t.ok('«No ir si…» con el viento aprendido', /No ir si/.test(x) && /25 kph/.test(x));
      t.ok('capturas de esa visita', /Sargo ×2/.test(x));
      await t.shot('memoria-spot');
    });
    await t.case('Capturas: tarjeta resumida por spot con láminas; el spot real de cada pez; detalle y mover de spot', async () => {
      await t.put('spots', 'cm1', { name: 'Roca uno', siteId: 's1', lat: 43.45, lon: -2.75, createdAt: 1 });
      await t.put('spots', 'cm2', { name: 'Roca dos', siteId: 's1', lat: 43.451, lon: -2.751, createdAt: 2 });
      await t.put('speciesPhotos', 'boga', { photo: 'plate-boga' });
      await t.put('trips', 'cmt', { date: '2026-12-30', siteId: 's1', siteName: 'Matxitxako', mode: 'Corcho', companions: [], stops: [{ id: 'x1', spotId: 'cm1', spotName: 'Roca uno', photos: [], need: [], tags: [], baits: [] }], eventos: [] });
      await t.put('catches', 'cmc', { tripId: 'cmt', date: '2026-12-30', siteId: 's1', ts: 9000, photos: [], items: [
        { species: 'Boga', n: 3, st: 'casa', stopId: 'x1', spotId: 'cm1' }, { species: 'Boga', n: 2, st: 'casa', stopId: 'x1', spotId: 'cm2' }, { species: 'Sargo', n: 1, st: 'lib', stopId: 'x1', spotId: 'cm2' }] });
      await t.wait(900); await t.reload(); await t.wait(1500); await t.goTab('capturas');
      for (let k = 0; k < 15 && !(await t.has('.ccard')); k++) await t.wait(500);
      const c = await t.page.evaluate(() => [...document.querySelectorAll('.ccard')].find(x => /Roca dos/.test(x.textContent)) ? [...document.querySelectorAll('.ccard')].find(x => /Roca dos/.test(x.textContent)).textContent : '');
      t.ok('cada pez va a su spot (Roca uno y Roca dos), no todos al de la parada', /Roca uno/.test(c) && /Roca dos/.test(c), c.slice(0, 200));
      t.ok('chips de especie con cantidad', /Boga\s*×3/.test(c) && /Boga\s*×2/.test(c));
      t.ok('sin lista eterna: no hay etiquetas de talla por pez', !(await t.has('.ccard .fcs')));
      await t.page.evaluate(() => { const b = [...document.querySelectorAll('.cpchip')].find(x => /Boga/.test(x.textContent)); b && b.click(); });
      await t.wait(900);
      const d = await t.page.evaluate(() => (document.getElementById('sheetbody') || {}).textContent || '');
      t.ok('al tocar la especie se ve el detalle', /Uno a uno/.test(d) && /Mover las 5/.test(d), d.slice(0, 120));
      await t.page.evaluate(() => { const s = document.querySelector('select[data-a="cap-mv"]'); s.value = 'cm1'; s.dispatchEvent(new Event('change', { bubbles: true })); });
      await t.wait(1200);
      const items = ((await t.docs('catches')).find(x => x.id === 'cmc') || {}).items || [];
      t.ok('mover todas las bogas a otro spot', items.filter(i => i.species === 'Boga').every(i => i.spotId === 'cm1') && items.find(i => i.species === 'Sargo').spotId === 'cm2', JSON.stringify(items));
      await t.shot('capturas-resumen');
    });
    await t.case('Equipo de la salida: inicial visual + cada cambio con antes → después, hora y lugar; láminas de especie', async () => {
      await t.put('speciesPhotos', 'boga', { photo: 'plate-boga' });
      await t.put('gearInv', 'dec-h3', { kind: 'anzuelo', modelo: 'Caperlan azul', num: '2', createdAt: 1 });
      await t.put('gearInv', 'dec-h2', { kind: 'anzuelo', modelo: 'Caperlan', num: '4', createdAt: 2 });
      await t.put('trips', 'eqv1', { date: '2026-09-24', siteId: 's1', siteName: 'Matxitxako', stops: [], companions: [], equipos: [{ id: 'r1', used: [{ id: 'own-yuki-7', kind: 'cana', name: 'Yuki 7 m' }] , corchoFab: 'Casero', anzuelo: 'Caperlan' }],
        eventos: [{ t: 1000, type: 'start', name: 'Punta del faro', noTime: true },
          { t: 2000, type: 'eq', noTime: true, names: 'x', why: 'Se movió la gente', cambios: [{ k: 'modo', de: { name: 'Plomín' }, a: { name: 'Corcho' } }] },
          { t: 3000, type: 'eq', noTime: true, names: 'y', why: 'Roto por una boga', cambios: [{ k: 'anzuelo', de: { id: 'dec-h3', name: 'azul' }, a: { id: 'dec-h2', name: 'nº4' } }] }] });
      await t.put('catches', 'eqc1', { tripId: 'eqv1', date: '2026-09-24', ts: 5000, items: [{ species: 'Boga', n: 1, st: 'casa', size: 'M' }, { species: 'Boga', n: 1, st: 'lib' }] });
      await t.wait(900); await t.reload(); await t.wait(1500); await t.goTab('salidas');
      await abrirSalida(t, 'eqv1');
      for (let k = 0; k < 15 && !(await t.has('[data-a="trip-tab"][data-v="cap"]')); k++) await t.wait(500);
      await t.tap('[data-a="trip-tab"][data-v="cap"]', 500);
      t.ok('la ficha de la especie usa la lámina', await t.page.evaluate(() => !!document.querySelector('.tds img[data-blob="plate-boga"]')));
      t.ok('la pestaña cuenta peces (2), no anotaciones', /Capturas\s*2/.test(await t.T('.tdtabs')));
      await t.tap('[data-a="cap-sp"]', 700);
      const dt = await t.page.evaluate(() => document.getElementById('sheetbody').textContent);
      t.ok('al tocar la especie: total y destino', /2/.test(dt) && /Destino/i.test(dt), dt);
      t.ok('detalle uno a uno con ✕ por pez', (await t.N('.cpx')) >= 1);
      await t.page.evaluate(() => { window.confirm = () => true; });
      await t.tap('.cpx', 1200);
      const left = ((await t.docs('catches')).find(x => x.id === 'eqc1') || {});
      t.ok('quitar un pez borra solo ese pez, no el registro entero', left.items && left.items.length === 1, JSON.stringify(left).slice(0, 120));
      await t.shot('detalle-especie');
      await t.tap('[data-a="trip-tab"][data-v="eq"]', 600);
      const x = await t.page.evaluate(() => document.querySelector('.tdbody').textContent);
      t.ok('equipo inicial con la modalidad Plomín', /Equipo inicial/.test(x) && /Plomín/.test(x));
      t.eq('un cartel por cada cambio', await t.N('.cbc'), 2);
      t.eq('antes → después en el cambio de anzuelo', await t.N('.cbc .cba'), 2);
      t.ok('muestra lugar y motivo', /Punta del faro/.test(x) && /Roto por una boga/.test(x));
      t.ok('sin hora real dice «hora sin anotar»', /hora sin anotar/.test(x));
      await t.shot('equipo-cambios');
    });
    await t.case('Plan: semáforo por spot y día con tus reglas, motivo de la visita y «qué cambiarías»', async () => {
      const mk = (date, wind) => ({ date, point: 'test', src: 'test', samples: [1, 4, 7, 10, 13, 16, 19, 22].map(h => ({ h, wave: 1.0, period: 8, wind, gust: wind + 5 })), tides: [] });
      await t.put('forecast', '2026-12-21', mk('2026-12-21', 30));
      await t.put('forecast', '2026-12-22', mk('2026-12-22', 8));
      await t.wait(900); await t.reload(); await t.wait(1500); await t.goTab('hoy'); await t.wait(1200);
      const day = async d => { await t.page.evaluate(d => { const b = document.querySelector('.pday[data-d="' + d + '"],[data-d="' + d + '"]'); b && b.click(); }, d); await t.wait(900); };
      await day('2026-12-21');
      let x = await t.page.evaluate(() => [...document.querySelectorAll('.smr')].map(e => e.className + '|' + e.textContent).join('\n'));
      t.ok('rojo con viento y la visita que lo justifica', /smr rj/.test(x) && /Roca memoria/.test(x) && /viento 30 kph/.test(x) && /20 oct/.test(x), x.slice(0, 300));
      t.ok('aviso «qué cambiarías»', /Qué cambiarías: Con tanto viento/.test(x));
      await t.shot('plan-semaforo-rojo');
      await day('2026-12-22');
      x = await t.page.evaluate(() => [...document.querySelectorAll('.smr')].map(e => e.className + '|' + e.textContent).join('\n'));
      t.ok('verde con viento flojo', /smr ok/.test(x), x.slice(0, 300));
    });
    await t.case('Agua y mar de fondo: chips, bogas deducidas, ficha del spot y Plan con agua probable', async () => {
      const mk = (date, wave) => ({ date, point: 'test', src: 'test', samples: [1, 4, 7, 10, 13, 16, 19, 22].map(h => ({ h, wave, period: 9, wind: 8, gust: 12 })), tides: [] });
      [['2026-12-07', 1.5], ['2026-12-08', 2.0], ['2026-12-09', 3.4], ['2026-12-10', 2.6], ['2026-12-11', 1.8]].forEach(([d, w]) => t.put('forecast', d, mk(d, w)));
      await t.put('spots', 'agA', { name: 'Roca turbia', siteId: 's1', lat: 43.45, lon: -2.75, createdAt: 1 });
      await t.put('spots', 'agB', { name: 'Roca limpia', siteId: 's1', lat: 43.455, lon: -2.76, createdAt: 2 });
      await t.put('trips', 'agt1', { date: '2026-12-10', siteId: 's1', siteName: 'Matxitxako', mode: 'Corcho', companions: [], stops: [{ id: 'ag-a1', spotId: 'agA', spotName: 'Roca turbia', tFrom: '07:00', tTo: '10:00', wave: 2.6, wind: 8, waveV: 'ok', windV: 'ok', photos: [], need: [], tags: [], baits: [] }], eventos: [] });
      await t.put('trips', 'agt2', { date: '2026-12-11', siteId: 's1', siteName: 'Matxitxako', mode: 'Corcho', companions: [], stops: [{ id: 'ag-b1', spotId: 'agB', spotName: 'Roca limpia', tFrom: '08:00', tTo: '10:00', wave: 1.8, wind: 8, waveV: 'ok', windV: 'ok', photos: [], need: [], tags: [], baits: [] }], eventos: [] });
      await t.put('catches', 'agc1', { tripId: 'agt1', date: '2026-12-10', ts: 8000, items: [{ species: 'Sargo', n: 4, st: 'casa', stopId: 'ag-a1', spotId: 'agA' }, { species: 'Boga', n: 1, st: 'lib', stopId: 'ag-a1', spotId: 'agA' }] });
      await t.put('catches', 'agc2', { tripId: 'agt2', date: '2026-12-11', ts: 8100, items: [{ species: 'Boga', n: 6, st: 'casa', stopId: 'ag-b1', spotId: 'agB' }, { species: 'Sargo', n: 1, st: 'casa', stopId: 'ag-b1', spotId: 'agB' }, { species: 'Boga', n: 2, st: 'casa', who: 'k1', stopId: 'ag-b1' }] });
      await t.put('aguas', 'ag-a1', { stopId: 'ag-a1', agua: 'tomadilla', u: 1 });
      await t.put('aguas', 'ag-b1', { stopId: 'ag-b1', agua: 'cristal', u: 1 });
      await t.wait(900); await t.reload(); await t.wait(1800); await t.goTab('hoy'); await t.wait(1200);
      await t.page.evaluate(() => { const b = document.querySelector('[data-d="2026-12-11"]'); b && b.click(); }); await t.wait(1000);
      const plan = await t.page.evaluate(() => (document.querySelector('.agday') || {}).textContent || '');
      t.ok('Plan: mar de fondo del día (pico y días)', /Agua y mar/.test(plan) && /3,4 m/.test(plan) && /2 días/.test(plan), plan);
      const smr = await t.page.evaluate(() => [...document.querySelectorAll('.smr')].map(e => e.textContent).join('\n'));
      t.ok('Plan: agua probable en Roca turbia por su visita parecida', /Roca turbia[\s\S]*Agua probable: Tomadilla[\s\S]*1 visita parecida/.test(smr), smr);
      t.ok('Plan: tu agua según tus salidas (dentro de «Agua y mar»)', await t.has('.agday .agmore .agbar'));
      await t.page.evaluate(() => document.querySelector('.agday').scrollIntoView({ block: 'start' })); await t.wait(300); await t.shot('plan-agua');
      await t.page.evaluate(() => { const b = document.createElement('button'); b.setAttribute('data-a', 'open-spot'); b.setAttribute('data-id', 'agA'); document.body.appendChild(b); b.click(); });
      await t.wait(1200);
      let x = await t.page.evaluate(() => (document.getElementById('sheetbody') || {}).textContent || '');
      t.ok('ficha del spot: Agua y mar de fondo con su visita', /Agua y mar de fondo/.test(x) && /1 visita con agua apuntada/.test(x), x.slice(0, 200));
      t.eq('un punto de color en la línea de días', await t.N('#sheetbody .agdot'), 1);
      t.ok('ficha: sargos por hora con esa agua', /Tomadilla/.test(x) && /1,3 sargos\/h/.test(x), x);
      t.ok('la visita muestra el mar previo', /pico de 3,4 m hace 1 día/.test(x));
      await t.page.evaluate(() => document.querySelector('.agwrap').scrollIntoView({ block: 'start' })); await t.wait(300); await t.shot('ficha-agua');
      await t.page.evaluate(() => document.querySelector('.mva .ag.tomada').click()); await t.wait(900);
      t.eq('un toque cambia el agua de la visita', ((await t.docs('aguas')).find(a => a.stopId === 'ag-a1') || {}).agua, 'tomada');
      await t.page.evaluate(() => document.querySelector('.mva .ag.tomada').click()); await t.wait(900);
      t.ok('otro toque sobre el mismo la quita', !((await t.docs('aguas')).find(a => a.stopId === 'ag-a1') || {}).agua);
      await t.page.evaluate(() => { const i = document.querySelector('.mva [data-agf="pk"]'); i.value = '3,8'; i.dispatchEvent(new Event('change', { bubbles: true })); });
      await t.wait(900);
      t.eq('el mar previo apuntado a mano se guarda', ((await t.docs('aguas')).find(a => a.stopId === 'ag-a1') || {}).pk, 3.8);
      await t.page.evaluate(() => { const b = document.querySelector('#sheet [data-a="close-sheet"]'); b && b.click(); });
      await t.wait(400);
      await t.page.evaluate(() => { const b = document.createElement('button'); b.setAttribute('data-a', 'open-spot'); b.setAttribute('data-id', 'agB'); document.body.appendChild(b); b.click(); });
      await t.wait(1200);
      x = await t.page.evaluate(() => (document.getElementById('sheetbody') || {}).textContent || '');
      t.ok('bogas deducidas de las capturas (no de las del compañero)', /Entraron bogas · 6 de 7/.test(x), x);
      t.ok('ritmo por hora deducido', /3,5 por hora/.test(x));
      t.ok('Roca limpia: cristal 2 días tras 3,4 m → «Aclara rápido» (1 visita)', /Aclara rápido/.test(x) && /1 visita/.test(x), x.slice(0, 200));
      t.ok('y su línea de días lo muestra', (await t.N('#sheetbody .agdot')) === 1);
      await t.page.evaluate(() => document.querySelector('.agwrap').scrollIntoView({ block: 'start' })); await t.wait(300); await t.shot('ficha-agua-limpia');
      await t.page.evaluate(() => document.querySelector('.mva').scrollIntoView({ block: 'center' })); await t.wait(300); await t.shot('visita-agua-bogas');
    });
  }
};
