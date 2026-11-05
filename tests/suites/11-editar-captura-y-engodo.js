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
  }
};
