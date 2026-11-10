/* Planificador por sitio: el maestro elige el SITIO (no un spot suelto) y ordena sus spots por hora. */
const SHP = process.env.SHP || '';
const iso = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
async function sembrar(t) {
  /* el resto de spots de la semilla se descartan para que solo cuente el sitio de la prueba */
  for (const s of await t.docs('spots')) await t.put('spots', s.id, Object.assign({}, s, { status: 'descartado' }));
  /* mar en calma por la mañana y con olas por la tarde */
  for (let i = 0; i <= 7; i++) await t.put('forecast', iso(i), { date: iso(i), point: 'test', src: 'test', samples: [1, 4, 7, 10, 13, 16, 19, 22].map((h, k) => ({ h, wave: k < 4 ? 0.7 : 2.0, period: 9, wind: 8, gust: 12 })), tides: [] });
  await t.put('sites', 's9', { name: 'Cala Brava', lat: 43.5, lon: -2.8, desc: '', createdAt: 5, status: 'activo' });
  await t.put('spots', 'pA', { name: 'Abrigo', siteId: 's9', lat: 43.5, lon: -2.8, createdAt: 6, minWave: 0, maxWave: 1.4 });
  await t.put('spots', 'pB', { name: 'Punta expuesta', siteId: 's9', lat: 43.501, lon: -2.801, createdAt: 7, minWave: 1.2, maxWave: 3.0 });
  await t.put('spots', 'pC', { name: 'Cala virgen', siteId: 's9', lat: 43.502, lon: -2.802, createdAt: 8, status: 'pendiente' });
  const visita = async (id, date, spot, name) => {
    const sid = 's-' + id;
    await t.put('trips', id, { date, siteId: 's9', siteName: 'Cala Brava', mode: 'Corcho', companions: [], eventos: [], createdAt: Date.parse(date), stops: [{ id: sid, spotId: spot, spotName: name, tFrom: '08:00', tTo: '11:00', baits: ['Gamba'], wave: 1.0, wind: 8, waveV: 'ok', windV: 'ok' }] });
    await t.put('catches', 'c-' + id, { tripId: id, date, ts: Date.parse(date) + 5000, items: [{ species: 'Sargo', n: 2, size: 'M', st: 'casa', stopId: sid, spotId: spot }] });
  };
  let k = 0;
  for (const [d, sp, nm] of [[-40, 'pA', 'Abrigo'], [-33, 'pA', 'Abrigo'], [-27, 'pA', 'Abrigo'], [-38, 'pB', 'Punta expuesta'], [-31, 'pB', 'Punta expuesta'], [-24, 'pB', 'Punta expuesta']]) { k++; await visita('w' + k, iso(d), sp, nm); }
  await t.wait(1000); await t.reload(); await t.wait(1800);
}
const txt = (t, sel) => t.page.evaluate((s) => { const e = document.querySelector(s); return e ? e.textContent.replace(/\s+/g, ' ') : ''; }, sel);
module.exports = {
  name: 'Planificador por sitio',
  async run(t) {
    await t.seed(); await t.goTab('salidas');
    await sembrar(t);
    await t.case('El plan recomienda el sitio entero y ordena sus spots por hora', async () => {
      await t.goTab('hoy'); await t.wait(1400);
      const top = await txt(t, 'section.pnext');
      t.ok('«Tu próxima salida» nombra el sitio, no un spot suelto', /Tu próxima salida/i.test(top) && /Cala Brava/.test(top) && !/ · Abrigo|· Punta expuesta/.test(top.split('Ventana')[0]), top.slice(0, 220));
      const orden = await t.page.evaluate(() => [].map.call(document.querySelectorAll('section.pnext .pnr .pna'), (u) => u.firstChild.textContent.trim()));
      t.ok('empieza en el spot abrigado (mar en calma) y sigue en el expuesto (con olas)', orden.length === 2 && orden[0] === 'Abrigo' && orden[1] === 'Punta expuesta', JSON.stringify(orden));
      const horas = await t.page.evaluate(() => [].map.call(document.querySelectorAll('section.pnext .pnr .pnh2'), (i) => i.textContent));
      t.ok('cada tramo lleva su hora y van de menos a más', horas.length === 2 && horas[0] < horas[1], JSON.stringify(horas));
      const adv = await txt(t, '.mdadv');
      t.ok('«El maestro dice» muestra el recorrido «Empieza en … → luego …»', /Cala Brava/.test(adv) && /Empieza en Abrigo \d\d:\d\d–\d\d:\d\d → luego Punta expuesta/.test(adv), adv.slice(0, 300));
      const pl = await txt(t, '.enpl');
      t.ok('el plan concreto trae el recorrido numerado', /Recorrido/.test(pl) && /1\. Abrigo/.test(pl) && /2\. Punta expuesta/.test(pl), pl.slice(0, 300));
      t.ok('un spot por descubrir no entra en el recorrido', !/Cala virgen/.test(top) && !/Empieza en[^→]*Cala virgen/.test(adv) && !/→ luego Cala virgen/.test(adv));
      t.ok('sin NaN ni undefined', !/NaN|undefined|\[object/.test(top + adv + pl));
      await t.shot(SHP + 'plan-por-sitio');
    });
    await t.case('Spots abiertos con este mar y qué investigar (zonas sin probar)', async () => {
      const top = await txt(t, 'section.pnext');
      t.ok('en vez de un %, dice cuántos spots están abiertos', /2\s*de 2 spots/.test(top) && !/\d+\s*%/.test(top), top.slice(0, 200));
      t.ok('«Qué investigar»: más mar que lo máximo probado, con qué hacer', /Qué investigar/.test(top) && /Ola de hasta [\d,]+ m: más de lo máximo que has pescado aquí \(1(,0)? m\)/.test(top) && /Ve a comprobar hasta dónde se puede/.test(top), top.slice(0, 500));
      const adv = await txt(t, '.mdadv');
      t.ok('el viento dentro de lo probado se dice como tal', /Viento de hasta 8 kph: dentro de lo que ya has pescado aquí/.test(adv), adv.slice(0, 500));
      t.ok('compara con la última vez («más mar que…»)', /Más mar que la última vez \(1(,0)? → /.test(adv), adv.slice(0, 500));
      t.ok('la jornada se cuenta en horas', /\d+ h de jornada/.test(adv));
      await t.page.evaluate(() => { const m = document.getElementById('main'), e = document.querySelector('section.pnext'); if (m && e) m.scrollTo({ top: m.scrollTop + e.getBoundingClientRect().top - 70, behavior: 'instant' }); }); await t.wait(400);
      await t.shot(SHP + 'plan-que-investigar');
    });
    await t.case('Si la previsión cae en lo ya probado, lo dice y no manda investigar', async () => {
      for (let i = 0; i <= 7; i++) await t.put('forecast', iso(i), { date: iso(i), point: 'test', src: 'test', samples: [1, 4, 7, 10, 13, 16, 19, 22].map((h) => ({ h, wave: 0.9, period: 9, wind: 8, gust: 12 })), tides: [] });
      await t.wait(900); await t.reload(); await t.wait(1800); await t.goTab('hoy'); await t.wait(1200);
      const top = await txt(t, 'section.pnext');
      t.ok('«Dentro de lo que ya has pescado aquí», sin «Qué investigar»', /Dentro de lo que ya has pescado aquí/.test(top) && !/Qué investigar/.test(top), top.slice(0, 400));
    });
    await t.case('Un día malo para todo el sitio sale en «Mejor no ir» con el spot que falla', async () => {
      await t.put('forecast', iso(3), { date: iso(3), point: 'test', src: 'test', samples: [1, 4, 7, 10, 13, 16, 19, 22].map((h) => ({ h, wave: 4.5, period: 9, wind: 40, gust: 55 })), tides: [] });
      await t.put('trips', 'w-mal', { date: iso(-20), siteId: 's9', siteName: 'Cala Brava', mode: 'Corcho', companions: [], eventos: [], createdAt: Date.parse(iso(-20)), stops: [{ id: 's-w-mal', spotId: 'pA', spotName: 'Abrigo', tFrom: '08:00', tTo: '08:40', wave: 1.4, wind: 30, waveV: 'ok', windV: 'mucho' }] });
      await t.put('catches', 'c-w-mal', { tripId: 'w-mal', date: iso(-20), ts: Date.parse(iso(-20)) + 5000, items: [] });
      await t.wait(900); await t.reload(); await t.wait(1800); await t.goTab('hoy'); await t.wait(1200);
      const adv = await txt(t, '.mdadv');
      t.ok('«Mejor no ir» cita el sitio y el spot con su motivo', /Mejor no ir/.test(adv) && /Cala Brava/.test(adv.split('Mejor no ir')[1] || '') && /Abrigo: viento/.test(adv), adv.slice(0, 400));
    });
  },
};
