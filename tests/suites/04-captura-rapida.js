/* Captura rápida ⚡ sin salida en curso. */
module.exports = {
  name: 'Captura rápida (⚡)',
  async run(t) {
    await t.seed();
    await t.case('abrir, elegir especie y guardar', async () => {
      await t.tap('[data-a="quick-cap"]', 600);
      t.ok('hoja de captura', await t.has('[data-a="qc-sp"]'));
      t.ok('sin «¿De quién?» porque no hay salida en curso', !(await t.T('#sheetbody')).includes('DE QUIÉN') && !(await t.T('#sheetbody')).toUpperCase().includes('¿DE QUIÉN'));
      await t.tap('[data-a="qc-sp"]', 200); await t.tap('[data-a="qc-size"]', 200);
      await t.tap('#qc-ok', 800);
      const c = await t.docs('catches'); t.eq('1 captura guardada', c.length, 1);
      t.ok('marcada como rápida', c[0] && c[0].quick === true);
      t.ok('con especie', c[0] && c[0].items && c[0].items[0] && !!c[0].items[0].species);
      t.ok('sin dueño ni sesión', c[0] && !c[0].items[0].who && !c[0].sess);
    });
    await t.case('guardar y otra deja la hoja abierta', async () => {
      await t.tap('[data-a="quick-cap"]', 600); await t.tap('[data-a="qc-sp"]:nth-of-type(2)', 200);
      await t.tap('[data-a="qc-save-more"]', 700);
      t.eq('2 capturas', (await t.docs('catches')).length, 2);
      t.ok('la hoja sigue abierta', await t.has('[data-a="qc-sp"]'));
      await t.tap('[data-a="close-sheet"]', 400);
    });
    await t.case('cantidad: sumar y restar', async () => {
      await t.tap('[data-a="quick-cap"]', 600);
      await t.page.evaluate(() => { document.querySelector('[data-a="qc-qty"][data-d="1"],[data-a="qc-qty"]:last-of-type').click(); });
      await t.tap('[data-a="qc-sp"]', 150); await t.tap('#qc-ok', 700);
      const c = await t.docs('catches'); t.ok('alguna captura con cantidad ≥2', c.some(x => (x.items || []).some(i => i.n >= 2)));
    });
    await t.case('las capturas rápidas aparecen y se pueden ordenar en una salida', async () => {
      await t.goTab('capturas'); await t.wait(400);
      t.ok('hay botón para ordenar en la pestaña Capturas', await t.has('[data-a="qc-order"]'));
      await t.tap('[data-a="qc-order"]', 900);
      t.ok('se abre el editor de salida', await t.has('[data-a="next-step"], #stpf'));
      await t.tap('[data-a="close-sheet"]', 300);
    });
  }
};
