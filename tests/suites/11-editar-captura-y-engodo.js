/* Editar capturas desde el registro de la salida y categoría Engodo. */
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
      await t.page.evaluate(() => { const b = document.querySelector('[data-a="edit-trip"][data-id="roto"]'); b && b.click(); }); await t.wait(700);
      for (let i = 0; i < 3; i++) await t.tapIf('[data-a="next-step"]', 500);
      t.ok('llega a «Guardar salida»', await t.has('[data-a="save-trip"]'));
      await t.tap('[data-a="save-trip"]', 1500); t.ok('se guarda', !(await t.has('#sheet [data-a="save-trip"]')));
    });
    await t.case('el registro (con audios) se ve en «Ver detalle» de una salida guardada', async () => {
      await t.put('trips', 'conreg', { date: '2026-11-02', mode: 'Spinning', siteId: 's1', siteName: 'Matxitxako', stops: [], equipos: [], eventos: [{ t: 1762070000000, type: 'start' }, { t: 1762071000000, type: 'spot', name: 'Cala de abajo', why: 'Mucha ola' }] });
      await t.reload(); await t.goTab('salidas');
      await t.page.evaluate(() => { const b = document.querySelector('[data-a="toggle-trip"][data-id="conreg"]'); b && b.click(); }); await t.wait(500);
      t.ok('aparece el registro', await t.has('.lvtl'));
      t.ok('con el cambio de spot y su motivo', (await t.T('.lvtl')).includes('Mucha ola'));
    });
    await t.case('audios sueltos (de una salida que no guardó su registro) se pueden recuperar', async () => {
      await t.page.evaluate(async () => { const a = await window.claude.use('assets'); const wav = new Uint8Array([0x1A, 0x45, 0xDF, 0xA3, 1, 2, 3, 4, 5, 6, 7, 8]); for (let i = 0; i < 2; i++) await a.upload(new Blob([wav], { type: 'audio/webm' }), { type: 'audio/webm' }); });
      await t.wait(800); await t.reload(); await t.goTab('salidas');
      t.ok('aparece el aviso de audios sin asignar', (await t.T('.ovblk')).includes('2'));
      await t.page.evaluate(() => { document.querySelector('#ov-trip').value = 'conreg'; });
      await t.tap('[data-a="ov-assign"]', 900);
      const tr = (await t.docs('trips')).find(x => x.id === 'conreg');
      t.eq('2 notas nuevas en el registro', tr.eventos.filter(e => e.audio).length, 2);
      t.ok('el aviso desaparece', !(await t.has('.ovblk')));
    });
    await t.case('añadir a mano al registro: «Mikel se movió a Cala de abajo, en el charco»', async () => {
      await t.put('trips', 'casa1', { date: '2026-11-03', mode: 'Corcho', siteId: 's1', siteName: 'Matxitxako', stops: [], equipos: [], companions: [{ id: 'k1', name: 'Mikel' }] });
      await t.reload(); await t.goTab('salidas');
      await t.page.evaluate(() => { const b = document.querySelector('[data-a="edit-trip"][data-id="casa1"]'); b && b.click(); }); await t.wait(700);
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
  }
};
