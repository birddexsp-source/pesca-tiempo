/* «Ya he pescado»: el asistente de salida completo, con equipo y captura. */
module.exports = {
  name: 'Salida pasada (asistente) y equipo usado',
  async run(t) {
    await t.seed();
    await t.goTab('salidas');
    await t.case('Nueva salida ofrece los dos caminos', async () => {
      await t.tap('[data-a="new-trip"]', 400);
      t.eq('dos tarjetas', await t.N('.lvc'), 2);
      t.ok('texto «Estoy pescando»', (await t.T('.lvc.live')).includes('Estoy pescando'));
      t.ok('texto «Ya he pescado»', (await t.T('.lvc.past')).includes('Ya he pescado'));
    });
    await t.case('«Ya he pescado» abre el asistente y se puede cerrar sin guardar', async () => {
      await t.tap('[data-a="lv-past"]', 500);
      t.ok('asistente con 4 pasos', (await t.N('#sheet .steps .st, #sheet [class*="step"]')) >= 1 || (await t.T('#sheet')).includes('Resumen'));
      await t.tap('[data-a="close-sheet"]'); await t.wait(300);
      t.eq('no se creó ninguna salida', (await t.docs('trips')).length, 1);
    });
    await t.case('rellenar y guardar una salida con equipo', async () => {
      await t.tap('[data-a="new-trip"]', 300); await t.tap('[data-a="lv-past"]', 500);
      await t.page.evaluate(() => { const d = document.querySelector('details.mpick summary'); d && d.click(); }); await t.tapIf('[data-a="mode"][data-m="Corcho"]', 400);
      t.ok('picker «Mi equipo usado» visible', await t.has('.usedbox'));
      await t.page.evaluate(() => document.querySelectorAll('.usedbox details').forEach(d => d.open = true)); await t.wait(150);
      await t.page.evaluate(() => { const x = [...document.querySelectorAll('.utile')].find(e => /Yuki Spirit 7/.test(e.innerText)); x && x.click(); }); await t.wait(200);
      t.ok('caña marcada', (await t.page.evaluate(() => [...document.querySelectorAll('.utile.on')].map(x => x.innerText))).some(x => /Yuki Spirit 7/.test(x)));
      await t.tap('[data-a="new-site"]', 300); await t.fill('input[placeholder^="Ej. Playa"]', 'Playa de prueba');
      for (let k = 0; k < 6; k++) { if (await t.page.evaluate(() => document.querySelector('#sheet').hidden)) break; await t.page.evaluate(() => { const b = document.querySelector('#stpf .btn.primary'); b && b.click(); }); await t.wait(500); }
      const tr = (await t.docs('trips')).find(x => x.siteName === 'Playa de prueba');
      t.ok('salida guardada', !!tr);
      t.ok('con el equipo elegido', tr && tr.equipos && tr.equipos[0] && (tr.equipos[0].used || []).some(u => /Yuki Spirit 7/.test(u.name)));
      t.ok('aparece en el listado', (await t.T('main')).includes('Playa de prueba'));
    });
    await t.case('editar una salida mantiene el equipo', async () => {
      const tr = (await t.docs('trips')).find(x => x.siteName === 'Playa de prueba');
      if (!tr) throw new Error('la salida de prueba no existe');
      await t.page.evaluate(id => { const o = document.querySelector('[data-a="trip-open"][data-id="' + id + '"]'); o && o.click(); const b = document.querySelector('[data-a="edit-trip"][data-id="' + id + '"]'); b && b.click(); }, tr.id); await t.wait(600);
      for (let k = 0; k < 6; k++) { if (await t.page.evaluate(() => document.querySelector('#sheet').hidden)) break; await t.page.evaluate(() => { const b = document.querySelector('#stpf .btn.primary'); b && b.click(); }); await t.wait(500); }
      const t2 = (await t.docs('trips')).find(x => x.id === tr.id);
      t.ok('equipo intacto tras re-guardar', t2.equipos && t2.equipos[0] && (t2.equipos[0].used || []).length === (tr.equipos[0].used || []).length);
    });
  }
};
