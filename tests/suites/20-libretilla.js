/* Libretilla del maestro: ajustes por situación, verdades, mitos e hipótesis con fuentes; sugerencias en directo. */
const SHP = process.env.SHP || '';
const iso = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
async function sembrar(t) {
  for (let i = 0; i <= 7; i++) await t.put('forecast', iso(i), { date: iso(i), point: 'test', src: 'test', samples: [1, 4, 7, 10, 13, 16, 19, 22].map(h => ({ h, wave: 0.4, period: 9, wind: 8, gust: 12 })), tides: [] });
  await t.put('spots', 'lA', { name: 'Roca calma', siteId: 's1', lat: 43.45, lon: -2.75, createdAt: 1 });
  const visita = async (id, date, wave, fish) => {
    const sid = 's-' + id;
    await t.put('trips', id, { date, siteId: 's1', siteName: 'Matxitxako', mode: 'Corcho', companions: [], eventos: [], createdAt: Date.parse(date), stops: [{ id: sid, spotId: 'lA', spotName: 'Roca calma', tFrom: '08:00', tTo: '11:00', baits: ['Cangrejo'], wave, wind: 8, waveV: 'ok', windV: 'ok' }] });
    if (fish) await t.put('catches', 'c-' + id, { tripId: id, date, ts: Date.parse(date) + 5000, items: [{ species: 'Sargo', n: fish, size: 'M', st: 'casa', stopId: sid, spotId: 'lA' }] });
  };
  await visita('l1', iso(-30), 0.5, 0); await visita('l2', iso(-26), 0.4, 1); await visita('l3', iso(-22), 0.5, 0);
  await visita('l4', iso(-18), 1.4, 5); await visita('l5', iso(-14), 1.5, 4); await visita('l6', iso(-10), 1.3, 6);
  await t.wait(1000); await t.reload(); await t.wait(1800);
}
module.exports = {
  name: 'Libretilla del maestro',
  async run(t) {
    await t.seed(); await t.goTab('salidas');
    await sembrar(t);
    await t.case('La libretilla en el Plan: ajustes, verdades, mitos e hipótesis con fuentes', async () => {
      await t.goTab('hoy'); await t.wait(1400);
      t.ok('hay un desplegable «Libretilla del maestro» cerrado', await t.page.evaluate(() => { const d = document.querySelector('details[data-uk="lib"]'); return !!d && !d.open && /Libretilla del maestro/.test(d.textContent) && /\d+ ajustes · \d+ ideas con fuentes/.test(d.textContent); }));
      await t.page.evaluate(() => { const d = document.querySelector('details[data-uk="lib"]'); d.open = true; }); await t.wait(400);
      const x = await t.page.evaluate(() => { const d = document.querySelector('details[data-uk="lib"]'); return { txt: d.textContent.replace(/\s+/g, ' '), n: d.querySelectorAll('details.lbit').length, hrefs: Array.from(new Set(Array.from(d.querySelectorAll('a[href]')).map(a => a.href))) }; });
      t.ok('para la próxima salida (previsión de poca mar) avisa del bajo para mar plato', /Para tu próxima salida/.test(x.txt) && /Mar plato y agua clara/.test(x.txt.split('Qué cambiar según la situación')[0]), x.txt.slice(0, 300));
      t.ok('trae ajustes por situación, ideas contrastadas, mitos y cosas por contrastar', /Qué cambiar según la situación/.test(x.txt) && /Lo que casi todos dicen/.test(x.txt) && /Mitos/.test(x.txt) && /Para contrastar con tus salidas/.test(x.txt));
      t.ok('más de 30 entradas desplegables', x.n >= 30, 'n=' + x.n);
      t.ok('cita 8 fuentes distintas con enlace https', x.hrefs.length === 8 && x.hrefs.every(h => /^https:\/\//.test(h)), JSON.stringify(x.hrefs));
      t.ok('dice cuántas fuentes coinciden y cuándo discrepan', /\d+ fuentes coinciden/.test(x.txt) && /Fuentes discrepan/.test(x.txt));
      t.ok('es honesto: no son millones de pescadores y los umbrales son orientativos', /No son los datos de millones de pescadores/.test(x.txt) && /orientativos/.test(x.txt));
      t.ok('contrasta con tus datos: con mar baja pescas menos (confirma)', /Tus datos lo confirman: Con mar de menos de 1 m pescas/i.test(x.txt) || /Tus datos lo confirman: Con ola de menos de 1 m pescas/i.test(x.txt), x.txt.slice(x.txt.indexOf('Tus datos'), x.txt.indexOf('Tus datos') + 200));
      t.ok('sin NaN ni undefined', !/NaN|undefined|\[object/.test(x.txt));
      await t.page.evaluate(() => { const m = document.getElementById('main'), e = document.querySelector('details[data-uk="lib"]'); if (m && e) m.scrollTo({ top: m.scrollTop + e.getBoundingClientRect().top - 70, behavior: 'instant' }); }); await t.wait(400);
      await t.shot(SHP + 'libretilla-plan');
      await t.page.evaluate(() => { const b = document.querySelector('details[data-uk="lib"] [data-a="md-probar"][data-id="l_d1"]'); if (b) { b.closest('details').open = true; b.click(); } }); await t.wait(700);
      t.ok('«Probar en la próxima salida» guarda la hipótesis de la libretilla', (await t.docs('hipotesis')).some(h => h.id === 'l_d1' && h.probar), JSON.stringify(await t.docs('hipotesis')));
    });
    await t.case('En directo: sugiere qué probar según mar, agua y lo que dices', async () => {
      await t.goTab('salidas'); await t.tap('[data-a="new-trip"]'); await t.tap('[data-a="lv-live"]', 500); await t.tap('[data-a="lv-start"]', 900);
      const s = (await t.docs('sesiones'))[0];
      t.ok('«Hoy contrastas» recuerda la hipótesis de la libretilla elegida', /Hoy contrastas/.test(await t.T('#sessbody')) && /marea subiendo o bajando/i.test(await t.T('#sessbody')), (await t.T('#sessbody')).slice(0, 300));
      await t.put('respuestas', 'S' + s.startedAt + '_ritmo', { ref: 'S' + s.startedAt, q: 'ritmo', a: 'nada', t: Date.now(), u: Date.now() });
      await t.put('respuestas', 'S' + s.startedAt + '_equipo', { ref: 'S' + s.startedAt, q: 'equipo', a: 'rotura', t: Date.now(), u: Date.now() });
      await t.wait(900);
      await t.tap('[data-a="lv-agua"][data-v="cristal"]', 700);
      const b = await t.page.evaluate(() => (document.querySelector('.lbn') || {}).textContent || '');
      t.ok('con agua cristal y «nada» sugiere afinar para mar plato', /Libretilla · qué probar ahora/.test(b) && /Mar plato y agua clara/.test(b), b.slice(0, 300));
      t.ok('y, como dijiste que se rompe, sugiere lo de las roturas', /Roturas y enganches/.test(b) && /roturas/i.test(b));
      t.ok('los pasos concretos (fluoro 0,20–0,22, bajo de 1,5–2 m) están ahí', await t.page.evaluate(() => /0,20–0,22/.test(Array.from(document.querySelectorAll('.lbn details')).map(d => d.textContent).join(' ')) && /1,5–2 m/.test(Array.from(document.querySelectorAll('.lbn details')).map(d => d.textContent).join(' '))));
      await t.page.evaluate(() => { const sh = document.getElementById('sheetbody'); if (sh) sh.scrollTop = 300; }); await t.wait(300);
      await t.shot(SHP + 'libretilla-directo');
      await t.page.evaluate(() => { const bt = document.querySelector('.lbn [data-a="lb-probar"]'); bt && bt.click(); }); await t.wait(700);
      const ev = ((await t.docs('sesiones'))[0].events || []);
      t.ok('«Lo pruebo ahora» queda en el registro de la salida', ev.some(e => e.type === 'prueba' && /^a\d$/.test(e.v)), JSON.stringify(ev.map(e => e.type + ':' + (e.v || ''))));
      t.ok('y se ve en el registro como «Prueba: …»', /Prueba: /.test(await t.T('#sessbody')));
    });
    await t.case('En directo con tu bajo montado: personaliza con el fluoro que llevas', async () => {
      const s = (await t.docs('sesiones'))[0];
      await t.put('sesiones', s.id, Object.assign({}, s, { equipos: [{ id: 'rgT', fluoro: '0,25', used: [] }], curEq: 'rgT' }));
      await t.wait(700); await t.reload(); await t.wait(2000);
      await t.page.evaluate(() => { const b = document.querySelector('#sessbar .sbt'); b && b.click(); }); await t.wait(900);
      await t.tapIf('[data-a="lv-agua"][data-v="cristal"]'); await t.wait(500);
      const b = await t.page.evaluate(() => Array.from(document.querySelectorAll('.lbn details')).map(d => d.textContent.replace(/\s+/g, ' ')).join(' | '));
      t.ok('«Llevas 0,25 mm: baja a 0,20–0,22»', /Llevas 0,25 mm: baja a 0,20–0,22/.test(b), b.slice(0, 400));
    });
  },
};
