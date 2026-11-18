/* Peso de cada captura en gramos: se puede poner al editarla, se guarda como número y se ve. */
const SHP = process.env.SHP || '';
module.exports = {
  name: 'Peso de la captura (g)',
  async run(t) {
    await t.seed(); await t.goTab('salidas');
    await t.put('trips', 'tw1', { date: '2026-11-18', siteId: 's1', siteName: 'Portoko', mode: 'Corcho', companions: [], eventos: [], createdAt: 1, stops: [{ id: 'sw1', spotId: '', spotName: 'Roca', tFrom: '08:00', tTo: '10:00', baits: [] }] });
    await t.put('catches', 'cw2', { tripId: 'tw1', date: '2026-11-18', siteName: 'Portoko', photos: [], notes: '', createdAt: 2, items: [{ species: 'Sargo', key: 'sargo', n: 1, size: 'M', st: 'casa', stopId: 'sw1', g: 430 }, { species: 'Sargo', key: 'sargo', n: 1, size: 'L', st: 'casa', stopId: 'sw1', g: 850 }] });
    await t.put('catches', 'cw1', { date: '2026-11-18', siteName: 'Portoko', photos: [], notes: '', createdAt: 1, items: [{ species: 'Sargo', key: 'sargo', n: 1, size: 'M', st: 'casa' }, { species: 'Sargo', key: 'sargo', n: 1, size: 'L', st: 'casa' }, { species: 'Sargo', key: 'sargo', n: 1, size: 'M', st: 'esc' }] });
    await t.wait(800); await t.reload(); await t.wait(1500);
    await t.case('Al editar la captura hay un campo «Peso (g)» por cada pieza', async () => {
      await t.goTab('capturas'); await t.wait(600);
      await t.page.evaluate(() => { const b = document.querySelector('[data-a="edit-cap"][data-id="cw1"]'); b && b.click(); }); await t.wait(900);
      t.eq('3 campos de peso', await t.N('#cap-items .gwf input[data-gw]'), 3);
      t.ok('vacíos y con la etiqueta «Peso (g)»', await t.page.evaluate(() => Array.from(document.querySelectorAll('#cap-items .gwf')).every(f => /Peso \(g\)/.test(f.textContent) && f.querySelector('input').value === '')));
    });
    await t.case('Se escribe en gramos, solo dígitos, y se guarda como número', async () => {
      await t.page.evaluate(() => {
        const set = (i, v) => { const el = document.querySelectorAll('#cap-items input[data-gw]')[i]; el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); };
        set(0, '430'); set(1, '8a5 0g');
      }); await t.wait(300);
      t.eq('quita lo que no son dígitos', await t.page.evaluate(() => document.querySelectorAll('#cap-items input[data-gw]')[1].value), '850');
      await t.page.evaluate(() => { const s = document.querySelector('#cap-items select[data-a="size"],#cap-items .sizes button[data-a="size"]'); s && s.click(); }); await t.wait(300);
      t.eq('al cambiar algo de la pieza no se pierde el peso', await t.page.evaluate(() => document.querySelectorAll('#cap-items input[data-gw]')[0].value), '430');
      await t.shot(SHP + 'peso-editor');
      await t.tap('#cap-save', 1200);
      const c = (await t.docs('catches')).find(x => x.id === 'cw1');
      t.eq('M casa = 430 g (número)', c.items[0].g, 430);
      t.eq('L casa = 850 g (número)', c.items[1].g, 850);
      t.ok('la pieza escapada queda sin peso', c.items[2].g === undefined);
    });
    await t.case('Se ve en la ficha de la especie y al reabrir', async () => {
      await t.wait(600);
      await t.page.evaluate(() => { const b = document.createElement('button'); b.setAttribute('data-a', 'sp-open'); b.setAttribute('data-k', 'sargo'); document.body.appendChild(b); b.click(); b.remove(); }); await t.wait(1200);
      const x = await t.page.evaluate(() => { const g = document.querySelector('.gwblk'); return g ? g.innerText.replace(/\s+/g, ' ') : ''; });
      t.ok('bloque «Peso de tus piezas» con 850 g y 430 g', /peso de tus piezas/i.test(x) && /850 g/.test(x) && /430 g/.test(x), x);
      t.ok('2 piezas pesadas (las de la salida)', /2 piezas pesadas/.test(x), x);
      t.ok('mayor 850 g y media 640 g', /mayor 850 g/.test(x) && /media 640 g/.test(x), x);
      t.ok('sin NaN ni undefined', !/NaN|undefined|\[object/.test(x));
      await t.page.evaluate(() => { const g = document.querySelector('.gwblk'); g && g.scrollIntoView({ block: 'center' }); }); await t.wait(300); await t.shot(SHP + 'peso-ficha');
      await t.tap('[data-a="close-sheet"]', 300);
      await t.goTab('capturas'); await t.wait(500);
      await t.page.evaluate(() => { const b = document.querySelector('[data-a="edit-cap"][data-id="cw1"]'); b && b.click(); }); await t.wait(900);
      t.eq('el editor recuerda 430', await t.page.evaluate(() => document.querySelectorAll('#cap-items input[data-gw]')[0].value), '430');
    });
  }
};
