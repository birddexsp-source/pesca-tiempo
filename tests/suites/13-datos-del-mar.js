/* Datos externos del mar (Open-Meteo): historial de oleaje para visitas sin previsión guardada, y lluvia previa. */
const SHP = process.env.SHP || '';
const MOCK = process.env.MOCK !== '0';
const iso = (off) => { const d = new Date(); d.setDate(d.getDate() + off); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const WAVE = { [-7]: 2.0, [-6]: 3.6, [-5]: 2.9, [-4]: 2.2, [-3]: 1.6, [-2]: 1.2, [-1]: 1.0, 0: 0.9, 1: 3.4, 2: 2.9, 3: 1.6, 4: 1.2 };
const RAIN = { [-40]: 18, [-30]: 12, [-6]: 14, [-5]: 6, 1: 12, 2: 8 };
function respuesta(url) {
  const days = []; for (let o = -92; o <= 8; o++) days.push(o);
  const times = days.map(iso);
  if (/marine-api/.test(url)) return { daily: { time: times, wave_height_max: days.map(o => WAVE[o] != null ? WAVE[o] : 1.1), wave_period_max: days.map(() => 9) } };
  return { daily: { time: times, precipitation_sum: days.map(o => RAIN[o] != null ? RAIN[o] : 0.2) } };
}
module.exports = {
  name: 'Datos del mar (Open-Meteo)',
  async run(t) {
    const pedidas = [];
    await t.seed(); await t.goTab('salidas');
    await t.page.route(/open-meteo\.com/, r => { pedidas.push(r.request().url()); return MOCK ? r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(respuesta(r.request().url())) }) : r.abort(); });
    await t.case('Open-Meteo: visitas pasadas sin previsión de Windy ya tienen mar previo, y la tarjeta del día enseña lluvia', async () => {
      await t.put('spots', 'oA', { name: 'Roca prueba', siteId: 's1', lat: 43.45, lon: -2.75, createdAt: 1 });
      const d1 = iso(-5), d2 = iso(-2);
      await t.put('trips', 'ot1', { date: d1, siteId: 's1', siteName: 'Matxitxako', mode: 'Corcho', companions: [], eventos: [], stops: [{ id: 's-ot1', spotId: 'oA', spotName: 'Roca prueba', tFrom: '07:00', tTo: '10:00', wave: 2.9, wind: 8, waveV: 'ok', windV: 'ok', photos: [], need: [], tags: [], baits: ['Gamba'] }] });
      await t.put('trips', 'ot2', { date: d2, siteId: 's1', siteName: 'Matxitxako', mode: 'Corcho', companions: [], eventos: [], stops: [{ id: 's-ot2', spotId: 'oA', spotName: 'Roca prueba', tFrom: '08:00', tTo: '10:00', wave: 1.2, wind: 8, waveV: 'ok', windV: 'ok', photos: [], need: [], tags: [], baits: ['Gamba'] }] });
      await t.put('catches', 'oc1', { tripId: 'ot1', date: d1, ts: 5000, items: [{ species: 'Sargo', n: 4, st: 'casa', stopId: 's-ot1', spotId: 'oA' }] });
      await t.put('aguas', 's-ot1', { stopId: 's-ot1', agua: 'tomadilla', u: 1 });
      await t.put('aguas', 's-ot2', { stopId: 's-ot2', agua: 'cristal', u: 1 });
      const f3 = iso(2);
      await t.put('forecast', f3, { date: f3, point: 'test', src: 'test', samples: [1, 4, 7, 10, 13, 16, 19, 22].map(h => ({ h, wave: 1.5, period: 9, wind: 8, gust: 12 })), tides: [] });
      await t.wait(900); await t.reload(); await t.wait(3500); await t.goTab('hoy'); await t.wait(1200);
      await t.page.evaluate(d => { const b = document.querySelector('[data-d="' + d + '"]'); b && b.click(); }, f3); await t.wait(1000);
      const card = await t.page.evaluate(() => (document.querySelector('.agday') || {}).textContent || '');
      await t.page.evaluate(() => document.querySelector('.agday').scrollIntoView({ block: 'start' })); await t.wait(300);
      await t.shot(SHP + 'plan-mar');
      if (MOCK) {
        t.ok('se pidió el oleaje y la lluvia a Open-Meteo', pedidas.some(u => /marine-api/.test(u)) && pedidas.some(u => /precipitation_sum/.test(u)), pedidas.join(' | '));
        t.ok('sin previsión de Windy previa, el mar de fondo sale igualmente (pico 3,4 m hace 1 día)', /3,4 m/.test(card) && /1 día/.test(card), card);
        t.ok('lluvia de las últimas 48 h con su aviso (20 mm)', /Lluvia en las últimas 48 h: 20 mm/.test(card) && /desembocaduras/.test(card), card);
        t.ok('dice de dónde salen los datos', /Open-Meteo/.test(card));
        t.ok('la caché queda guardada para usarla sin cobertura', await t.page.evaluate(() => { try { return Object.keys(JSON.parse(localStorage.getItem('cuaderno-mar-v1')).wave).length > 50 } catch (e) { return false } }));
      } else {
        t.ok('sin conexión: no se inventa nada y lo dice', /Sin previsión guardada de los 3 días previos/.test(card) || /Sin conexión con Open-Meteo/.test(card), card);
      }
      await t.page.evaluate(() => { const b = document.createElement('button'); b.setAttribute('data-a', 'open-spot'); b.setAttribute('data-id', 'oA'); document.body.appendChild(b); b.click(); }); await t.wait(1300);
      const x = await t.page.evaluate(() => (document.getElementById('sheetbody') || {}).textContent || '');
      await t.page.evaluate(() => { const e = document.querySelector('.agwrap'); e && e.scrollIntoView({ block: 'start' }); }); await t.wait(300);
      await t.shot(SHP + 'ficha-mar');
      if (MOCK) {
        t.ok('ficha del spot: la visita de hace 5 días cuenta como «1 día tras 3,6 m» sin haber guardado previsión', /pico de 3,6 m hace 1 día/.test(x), x.slice(0, 300));
        t.ok('y muestra la lluvia previa de esa visita (20 mm)', /Lluvia en las 48 h previas: 20 mm/.test(x));
        t.eq('dos puntos en la línea de días (hace 1 día tras 3,6 m y hace 3 tras 2,9 m)', await t.N('#sheetbody .agdot'), 2);
      }
    });
    if (MOCK) await t.case('Hipótesis «la lluvia enturbia»: sin datos suficientes no opina; con ellos, compara el color del agua', async () => {
      await t.page.evaluate(() => { const b = document.querySelector('#sheet [data-a="close-sheet"]'); b && b.click(); }); await t.wait(400);
      await t.goTab('hoy'); await t.wait(800);
      const book = await t.page.evaluate(() => [...document.querySelectorAll('.mdh')].map(e => e.textContent));
      const L = book.find(x => /lluvia reciente enturbia/.test(x)) || '';
      t.ok('la hipótesis existe, con su fuente y sin veredicto todavía', /Faltan datos/.test(L) && /Fuente:/.test(L) && /con el agua apuntada/.test(L), L);
      const mk = async (id, off, agua) => { await t.put('trips', id, { date: iso(off), siteId: 's1', siteName: 'Matxitxako', mode: 'Corcho', companions: [], eventos: [], stops: [{ id: 's-' + id, spotId: 'oA', spotName: 'Roca prueba', photos: [], need: [], tags: [], baits: [] }] }); await t.put('aguas', 's-' + id, { stopId: 's-' + id, agua, u: 1 }); };
      await mk('ot3', -40, 'chocolate'); await mk('ot4', -30, 'tomada'); await mk('ot5', -50, 'cristal'); await mk('ot6', -20, 'cristal');
      await t.wait(900); await t.reload(); await t.wait(3500); await t.goTab('hoy'); await t.wait(1200);
      const book2 = await t.page.evaluate(() => [...document.querySelectorAll('.mdh')].map(e => e.textContent));
      const L2 = book2.find(x => /lluvia reciente enturbia/.test(x)) || '';
      t.ok('con 2 visitas con lluvia (agua 2,5 de media) y 2 sin ella (0): lo confirman tus datos', /Tus datos lo confirman/.test(L2) && /2,5/.test(L2), L2);
      await t.page.evaluate(() => document.querySelector('.mdh').scrollIntoView({ block: 'start' })); await t.wait(300);
      await t.shot(SHP + 'libro-lluvia');
    });
  }
};
