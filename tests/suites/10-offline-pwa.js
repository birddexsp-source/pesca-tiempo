/* Service worker: precarga de fotos y funcionamiento sin conexión. */
module.exports = {
  name: 'Sin conexión (PWA) y precarga de fotos',
  async run(t) {
    await t.case('el service worker se activa y precarga las fotos del equipo', async () => {
      let n = 0, ctl = false;
      for (let i = 0; i < 40; i++) {
        const r = await t.page.evaluate(async () => { const reg = await navigator.serviceWorker.getRegistration(); const ks = await caches.keys(); let c = 0; for (const k of ks) { if (!k.startsWith('cuaderno-')) continue; const ca = await caches.open(k); c += (await ca.keys()).filter(q => /img\/gear\//.test(q.url)).length; } return { ctl: !!(reg && reg.active), c }; });
        n = r.c; ctl = r.ctl; if (n >= 100) break; await t.wait(500);
      }
      t.ok('service worker activo', ctl); t.ok('fotos de equipo en caché (≥100)', n >= 100, n + '');
    });
    await t.case('la app arranca sin red y las fotos salen', async () => {
      await t.page.reload(); await t.wait(1500);
      await t.ctx.setOffline(true);
      await t.page.reload(); await t.wait(2500);
      t.ok('carga sin red', await t.has('.tabbar'));
      await t.goTab('equipo'); await t.tap('[data-a="eqp-cat"][data-k="cana"],[data-a="eqp-cat"]', 600); await t.wait(1000);
      const r = await t.page.evaluate(() => { const im = [...document.querySelectorAll('img.ivph')]; return { n: im.length, ok: im.filter(i => i.complete && i.naturalWidth > 0).length }; });
      t.ok('fotos visibles sin red', r.n > 0 && r.ok === r.n, JSON.stringify(r));
      await t.ctx.setOffline(false);
    });
    await t.case('datos creados sin red se conservan', async () => {
      await t.ctx.setOffline(true);
      await t.put('sites', 'off1', { name: 'Offline', lat: 43.4, lon: -2.7, desc: '', createdAt: 1, status: 'activo' });
      await t.page.reload(); await t.wait(2000);
      t.ok('sigue tras recargar sin red', (await t.docs('sites')).some(s => s.id === 'off1'));
      await t.ctx.setOffline(false);
    });
  }
};
