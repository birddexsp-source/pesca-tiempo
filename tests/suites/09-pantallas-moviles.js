/* Sin desbordes ni errores en pantalla pequeña (360×640) recorriendo todo. */
module.exports = {
  name: 'Pantalla pequeña (360×640): sin desbordes',
  launch: { viewport: { width: 360, height: 640 } },
  async run(t) {
    await t.seed();
    await t.case('pestañas principales', async () => {
      for (const id of ['hoy', 'mapa', 'salidas', 'equipo', 'capturas']) { await t.goTab(id); await t.wait(300); const o = await t.overflow(); t.ok('sin desbordes en ' + id, o.length === 0, o.join(', ')); }
    });
    await t.case('hojas de salida en vivo', async () => {
      await t.goTab('salidas'); await t.tap('[data-a="new-trip"]', 400); let o = await t.overflow(); t.ok('elección', o.length === 0, o.join(', '));
      await t.tap('[data-a="lv-live"]', 500); o = await t.overflow(); t.ok('montar', o.length === 0, o.join(', '));
      await t.tap('[data-a="lv-map"]', 900); o = await t.overflow(); t.ok('mapa', o.length === 0, o.join(', ')); await t.tap('[data-a="lm-new"]', 300); o = await t.overflow(); t.ok('mapa nuevo', o.length === 0, o.join(', ')); await t.tap('[data-a="mp-cancel"]', 300);
      await t.tap('[data-a="lv-start"]', 700); o = await t.overflow(); t.ok('consola', o.length === 0, o.join(', '));
      await t.tap('[data-a="lv-cap"]', 600); o = await t.overflow(); t.ok('captura', o.length === 0, o.join(', ')); await t.tap('[data-a="close-sheet"]', 400);
      await t.tap('[data-a="lv-spot"]', 400); o = await t.overflow(); t.ok('cambio de spot', o.length === 0, o.join(', ')); await t.tap('[data-a="lv-back"]', 300);
      await t.tap('[data-a="lv-eq"]', 400); o = await t.overflow(); t.ok('cambio de equipo', o.length === 0, o.join(', ')); await t.tap('[data-a="lv-back"]', 300);
      await t.tap('[data-a="close-sheet"]', 300); o = await t.overflow(); t.ok('inicio con barra de salida', o.length === 0, o.join(', '));
    });
    await t.case('botones principales siempre alcanzables (footer visible)', async () => {
      await t.tap('#sessbar .sbt', 400);
      const r = await t.page.evaluate(() => { const f = document.querySelector('#sheet .foot'); if (!f) return null; const b = f.getBoundingClientRect(); return { bottom: b.bottom, h: innerHeight }; });
      t.ok('pie de la hoja dentro de la pantalla', r && r.bottom <= r.h + 1, JSON.stringify(r));
    });
  }
};
