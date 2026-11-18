/* Salidas, Compañeros y hoja de especie: información útil para aprender y revisar salidas pasadas. */
const SHP = process.env.SHP || '';
const iso = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const txt = (t, sel) => t.page.evaluate((s) => { const e = document.querySelector(s); return e ? e.innerText.replace(/\s+/g, ' ') : ''; }, sel);
module.exports = {
  name: 'Salidas útiles (temporada, filas, especie, compañeros)',
  async run(t) {
    await t.seed(); await t.goTab('salidas');
    await t.page.evaluate(async () => { const db = await window.claude.use('db'); for (const c of ['trips', 'catches']) { const s = await db.collection(c).get(); for (const d of s.docs) await db.collection(c).doc(d.id).delete(); } });
    await t.put('sites', 'sP', { name: 'Portoko blokiek', lat: 43.42, lon: -2.71, desc: '', createdAt: 3, status: 'activo' }); await t.put('sites', 'sR', { name: 'Rampa', lat: 43.42, lon: -2.716, desc: '', createdAt: 4, status: 'activo' });
    await t.put('companeros', 'kA', { name: 'Aita', createdAt: 1 }); await t.put('companeros', 'kN', { name: 'Nekatxu', createdAt: 2 });
    await t.put('trips', 'u1', { date: iso(-8), siteId: 's1', siteName: 'Matxitxako', mode: 'Corcho', companions: [{ id: 'kA', name: 'Aita', mode: 'Corcho' }], eventos: [], createdAt: 1, stops: [{ id: 'su1', spotId: '', spotName: 'Piedra C', tFrom: '08:00', tTo: '10:00', wave: 1.2, tpFrom: 'baja', tpTo: 'media-sube', baits: [] }] });
    await t.put('catches', 'k1', { tripId: 'u1', date: iso(-8), items: [{ species: 'Sargo', key: 'sargo', n: 3, size: 'M', st: 'casa', stopId: 'su1' }, { species: 'Sargo', key: 'sargo', n: 2, size: 'S', st: 'casa', who: 'kA', stopId: 'su1' }] });
    await t.put('trips', 'u2', { date: iso(-3), siteId: 'sP', siteName: 'Portoko blokiek', mode: 'Corcho', companions: [], eventos: [], createdAt: 2, stops: [{ id: 'su2', spotId: '', spotName: 'Atxeta-punte', tFrom: '10:18', tTo: '10:52', wave: 3, tpFrom: 'plea', tpTo: 'plea', baits: [] }] });
    await t.put('catches', 'k2', { tripId: 'u2', date: iso(-3), items: [{ species: 'Sargo', key: 'sargo', n: 1, size: 'M', st: 'casa', stopId: 'su2', g: 430 }, { species: 'Sargo', key: 'sargo', n: 1, size: 'L', st: 'casa', stopId: 'su2', g: 850 }, { species: 'Sargo', key: 'sargo', n: 1, size: 'M', st: 'esc', stopId: 'su2' }] });
    await t.put('trips', 'u3', { date: iso(-1), siteId: 'sR', siteName: 'Rampa', mode: 'Rockfishing', companions: [], eventos: [], createdAt: 3, stops: [{ id: 'su3', spotId: '', spotName: 'Rampa 1', tFrom: '17:10', tTo: '17:51', wave: 1.4, mode: 'Rockfishing', baits: [] }] });
    await t.wait(900); await t.reload(); await t.wait(1800); await t.goTab('salidas'); await t.wait(900);
    await t.case('Arriba, «Tu temporada» con datos tuyos en vez de 4 contadores y una leyenda', async () => {
      const x = await txt(t, '.sxs');
      t.ok('salidas, horas pescando, tus peces, peces/hora y mejor sitio', /3 salidas/.test(x) && /pescando/.test(x) && /6 tus peces/.test(x) && /peces\/hora/.test(x) && /mejor sitio/.test(x), x);
      t.ok('tus peces no cuentan los de Aita (6 = 3 + 3, uno escapado)', /6 tus peces/.test(x) && /5 a casa · 1 escapado/.test(x), x);
      t.ok('ni contadores viejos ni leyenda de colores', (await t.N('.sum4')) === 0 && (await t.N('.legend')) === 0);
    });
    await t.case('Cada salida dice cuándo pescaste, con qué mar y cuánto rindió', async () => {
      const rows = await t.page.evaluate(() => [].map.call(document.querySelectorAll('article.trow'), (a) => a.innerText.replace(/\s+/g, ' ')));
      const p = rows.find((r) => /Portoko/.test(r)) || '', r3 = rows.find((r) => /Rampa/.test(r)) || '';
      t.ok('Portoko: 10:18–10:52 · 3 m · pleamar · 5,3/h', /10:18–10:52/.test(p) && /3 m/.test(p) && /pleamar/.test(p) && /5,3\/h/.test(p), p);
      t.ok('Rampa sin peces enseña «0 peces» en vez de una flecha', /0 peces/i.test(r3) && (await t.N('.fbadge.sx0')) === 1, r3);
      await t.page.evaluate(() => { const e = document.querySelector('.sxs'); e && e.scrollIntoView({ block: 'start' }); }); await t.wait(300); await t.shot(SHP + 'salidas-lista');
    });
    await t.case('«Qué aprendimos» no compara un rockfishing con salidas a corcho', async () => {
      const x = await txt(t, '.enc');
      t.ok('dice que es la primera de Rockfishing y no da «-100 %»', /Primera salida de Rockfishing/.test(x) && !/-100/.test(x), x.slice(0, 300));
    });
    await t.case('Hoja de la especie: pieza a pieza, con su peso', async () => {
      await t.page.evaluate(() => { const o = document.querySelector('[data-a="trip-open"][data-id="u2"]'); o && o.click(); }); await t.wait(900);
      await t.page.evaluate(() => { const b = document.querySelector('[data-a="trip-tab"][data-v="cap"]'); b && b.click(); }); await t.wait(700);
      await t.page.evaluate(() => { const b = document.querySelector('[data-a="cap-sp"]'); b && b.click(); }); await t.wait(800);
      const x = await txt(t, '#sheetbody');
      t.ok('cabecera: 3 picadas tuyas · 2 a casa · 1 escapado · 1,28 kg pesados', /3 picadas tuyas/.test(x) && /2 a casa · 1 escapado · 1,28 kg pesados/.test(x), x.slice(0, 200));
      t.eq('una fila por pieza', await t.N('#sheetbody .sxr'), 3);
      t.ok('cada pieza con su peso (850 g, 430 g) y la escapada sin él', /850 g/.test(x) && /430 g/.test(x) && (await t.N('#sheetbody .sxr.esc')) === 1, x);
      t.ok('mover todas: arranca en «Elegir spot…», no en «Sin spot»', await t.page.evaluate(() => { const s = document.querySelector('#sheetbody select[data-a="cap-mv"]'); return !s || s.options[s.selectedIndex].text === 'Elegir spot…'; }));
      await t.shot(SHP + 'especie-salida');
      await t.tap('[data-a="close-sheet"]', 300);
      await t.page.evaluate(() => { const b = document.querySelector('[data-a="trip-back"]'); b && b.click(); }); await t.wait(600);
    });
    await t.case('Compañeros: cuándo pescasteis juntos y el marcador; sin «entre los dos»', async () => {
      await t.page.evaluate(() => { const b = document.querySelector('[data-a="open-comps"]'); b && b.click(); }); await t.wait(800);
      const x = await txt(t, '#compbody');
      t.ok('«en total» y no «entre los dos»', /en total/.test(x) && !/entre los dos/.test(x), x.slice(0, 300));
      t.ok('Aita: «Última:» con fecha y sitio, marcador 3–2', /Aita Última: .*Matxitxako/.test(x) && /3 – 2|3–2/.test(x.replace(/\s/g, '').replace('3–2', '3–2')), x);
      t.ok('Nekatxu: «Aún sin salidas juntos»', /Nekatxu Aún sin salidas juntos/.test(x), x);
      t.ok('sin NaN ni undefined', !/NaN|undefined|\[object/.test(x));
      await t.shot(SHP + 'companeros');
    });
  }
};
