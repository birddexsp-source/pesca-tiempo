/* Fiabilidad del spot (sin capturas la nota va rebajada) y salidas en las que pesca otra persona. */
const SHP = process.env.SHP || '';
const iso = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const txt = (t, sel) => t.page.evaluate((s) => { const e = document.querySelector(s); return e ? e.innerText.replace(/\s+/g, ' ') : ''; }, sel);
const card = (t) => t.page.evaluate(() => { const a = [].find.call(document.querySelectorAll('article.psite'), (x) => /Portoko/.test(x.textContent)); return a ? a.innerText.replace(/\s+/g, ' ') : ''; });
module.exports = {
  name: 'Fiabilidad del spot y salidas de otra persona',
  async run(t) {
    await t.seed(); await t.goTab('salidas');
    await t.page.evaluate(async () => { const db = await window.claude.use('db'); for (const c of ['trips', 'catches']) { const s = await db.collection(c).get(); for (const d of s.docs) await db.collection(c).doc(d.id).delete(); } });
    for (const s of await t.docs('spots')) await t.put('spots', s.id, Object.assign({}, s, { status: 'descartado' }));
    for (let i = -8; i <= 3; i++) await t.put('forecast', iso(i), { date: iso(i), point: 'test', src: 'test', samples: [1, 4, 7, 10, 13, 16, 19, 22].map((h) => ({ h, wave: 2.8, period: 10, wind: 10, gust: 14 })), tides: [{ t: iso(i) + 'T04:30', k: 'low', h: 1.0 }, { t: iso(i) + 'T10:50', k: 'high', h: 3.9 }, { t: iso(i) + 'T17:00', k: 'low', h: 1.0 }, { t: iso(i) + 'T23:20', k: 'high', h: 3.8 }] });
    await t.put('sites', 'pk', { name: 'Portoko blokiek', lat: 43.42, lon: -2.71, desc: '', createdAt: 3, status: 'activo' });
    const base = { siteId: 'pk', lat: 43.42, lon: -2.71, createdAt: 4, status: 'activo', minWave: 2, maxWave: 3.5 };
    await t.put('spots', 'sA', Object.assign({ name: 'Atxeta-punte' }, base));
    await t.put('spots', 'sB', Object.assign({ name: 'Pozo' }, base));
    await t.put('trips', 'ta1', { date: iso(-3), siteId: 'pk', siteName: 'Portoko blokiek', mode: 'Corcho', companions: [], eventos: [], createdAt: 1, stops: [{ id: 'sta1', spotId: 'sA', spotName: 'Atxeta-punte', tFrom: '10:00', tTo: '12:00', wave: 2.8, baits: [] }] });
    await t.put('catches', 'ca1', { tripId: 'ta1', date: iso(-3), items: [{ species: 'Sargo', key: 'sargo', n: 3, size: 'M', st: 'casa', stopId: 'sta1', spotId: 'sA' }] });
    await t.put('trips', 'tj1', { date: iso(-1), siteId: 'pk', siteName: 'Portoko blokiek', mode: 'Corcho', ajena: 'Ane', companions: [{ id: 'aj-ane', name: 'Ane' }], eventos: [], createdAt: 2, stops: [{ id: 'stj1', spotId: 'sB', spotName: 'Pozo', tFrom: '09:00', tTo: '11:00', wave: 2.5, baits: [] }] });
    await t.put('catches', 'cj1', { tripId: 'tj1', date: iso(-1), items: [{ species: 'Sargo', key: 'sargo', n: 2, size: 'M', st: 'casa', who: 'aj-ane', stopId: 'stj1', spotId: 'sB' }] });
    await t.wait(900); await t.reload(); await t.wait(2000);
    let pct0 = 0;
    const pctOf = () => t.page.evaluate(() => { const a = [].find.call(document.querySelectorAll('article.psite'), (x) => /Portoko/.test(x.textContent)); const b = a && a.querySelector('.badge'); return b ? parseInt(b.textContent, 10) : -1; });
    const day1 = async () => { await t.goTab('hoy'); await t.wait(1200); await t.page.evaluate((d) => { const b = document.querySelector('[data-a="day"][data-d="' + d + '"]'); b && b.click(); }, iso(1)); await t.wait(1200); };
    await t.case('Un spot sin capturas tuyas no se recomienda: sin ventana; el que sí tiene, sí', async () => {
      await day1(); const x = await card(t); pct0 = await pctOf();
      t.ok('Atxeta-punte tiene ventana', /Atxeta-punte \d\d:\d\d–\d\d:\d\d/.test(x), x.slice(0, 400));
      t.ok('el Pozo, sin capturas (solo las de Ane, que pesan la mitad), queda «sin ventana»', /Pozo sin ventana/.test(x), x.slice(0, 400));
      t.ok('la nota del sitio sale de Atxeta-punte', pct0 > 40 && pct0 < 100, String(pct0));
      await t.shot(SHP + 'fiabilidad-plan');
    });
    await t.case('Marcas un spot como «a veces» desde su editor y el Plan lo rebaja y lo dice', async () => {
      await t.page.evaluate(() => { const b = document.createElement('button'); b.setAttribute('data-a', 'edit-spot'); b.setAttribute('data-id', 'sA'); document.body.appendChild(b); b.click(); b.remove(); }); await t.wait(700);
      t.ok('el selector «Fiabilidad según tú» está y empieza en automática', await t.page.evaluate(() => { const e = document.getElementById('sp-fiab'); return !!e && e.value === ''; }));
      await t.page.evaluate(() => { const e = document.getElementById('sp-fiab'); e.value = 'media'; e.dispatchEvent(new Event('change', { bubbles: true })); }); await t.tap('#sp-save', 900);
      const s = (await t.docs('spots')).find((x) => x.id === 'sA');
      t.ok('se guarda fiab = media y lo demás no cambia', s.fiab === 'media' && s.minWave === 2 && s.maxWave === 3.5, JSON.stringify(s));
      await t.wait(900); await day1(); const x = await card(t), p1 = await pctOf();
      t.ok('baja la nota (' + pct0 + ' → ' + p1 + ')', p1 < pct0, x.slice(0, 300));
      t.ok('lo explica: «lo tienes marcado como «a veces»»', /lo tienes marcado como «a veces»/.test(x), x.slice(0, 500));
    });
    await t.case('Una salida en la que pesca otra persona no cuenta como tuya', async () => {
      await t.goTab('salidas'); await t.wait(900);
      const s = await txt(t, '.sxs');
      t.ok('«Tu temporada»: 1 salida y 3 tus peces (sin los 2 de Ane)', /1 salida\b/.test(s) && /3 tus peces/.test(s), s);
      const rows = await t.page.evaluate(() => [].map.call(document.querySelectorAll('article.trow'), (a) => a.innerText.replace(/\s+/g, ' ')));
      const r = rows.find((x) => /Ane/.test(x)) || '';
      t.ok('la fila dice «Salida de Ane · tú no pescaste · referencia»', /Salida de Ane · tú no pescaste · referencia/.test(r), r);
      t.ok('y enseña los 2 peces que sacó ella', /2\s*PECES/i.test(r), r);
      await t.page.evaluate(() => { const o = document.querySelector('[data-a="trip-open"][data-id="tj1"]'); o && o.click(); }); await t.wait(900);
      t.ok('el detalle avisa de que es de otra persona', /Salida de Ane: tú no pescaste/.test(await txt(t, 'main')));
      await t.shot(SHP + 'salida-ajena');
    });
    await t.case('El editor de la salida deja marcar quién pescó', async () => {
      await t.page.evaluate(() => { const b = document.createElement('button'); b.setAttribute('data-a', 'edit-trip'); b.setAttribute('data-id', 'tj1'); document.body.appendChild(b); b.click(); b.remove(); }); await t.wait(900);
      t.ok('el campo trae «Ane»', await t.page.evaluate(() => { const e = document.getElementById('tr-aj'); return !!e && e.value === 'Ane'; }));
    });
    await t.case('Al guardar una salida marcada como de otra persona, sus capturas quedan a su nombre', async () => {
      await t.page.evaluate(() => { const b = document.createElement('button'); b.setAttribute('data-a', 'edit-trip'); b.setAttribute('data-id', 'ta1'); document.body.appendChild(b); b.click(); b.remove(); }); await t.wait(900);
      await t.page.evaluate(() => { const e = document.getElementById('tr-aj'); e.value = 'Nerea'; e.dispatchEvent(new Event('input', { bubbles: true })); });
      for (let i = 0; i < 3; i++) { await t.tap('[data-a="next-step"]', 500); }
      await t.tap('#tr-save', 1500);
      const tr = (await t.docs('trips')).find((x) => x.id === 'ta1'), ca = (await t.docs('catches')).find((x) => x.id === 'ca1');
      t.ok('la salida guarda ajena = Nerea y la tiene entre sus compañeros', tr && tr.ajena === 'Nerea' && (tr.companions || []).some((c) => c.id === 'aj-nerea'), JSON.stringify(tr && [tr.ajena, tr.companions]));
      t.ok('sus 3 sargos pasan a ser de Nerea (no tuyos)', ca && ca.items.every((i) => i.who === 'aj-nerea'), JSON.stringify(ca && ca.items));
    });
  }
};
