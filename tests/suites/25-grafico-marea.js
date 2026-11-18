/* Gráfico de marea de la salida: ventana pescada (de hora a hora) y picadas dentro de ella. */
const SHP = process.env.SHP || '';
module.exports = {
  name: 'Gráfico de marea: ventana y picadas',
  async run(t) {
    await t.seed(); await t.goTab('salidas');
    await t.put('trips', 'tg1', { date: '2026-11-18', siteId: 's1', siteName: 'Portoko', mode: 'Corcho', companions: [], eventos: [], createdAt: 1, tideNote: 'Bajamar 04:30 (1,7 m) · Pleamar 10:50 (3,2 m) · Bajamar 17:25 (1,5 m) · Pleamar 23:40 (3 m)',
      stops: [{ id: 'sg1', spotId: '', spotName: 'Atxeta-punte', tFrom: '10:18', tTo: '10:52', tpFrom: 'plea', tpTo: 'plea', baits: [] }, { id: 'sg2', spotId: '', spotName: 'Rampa', tFrom: '14:00', tTo: '15:10', baits: [] }] });
    await t.put('catches', 'cg1', { tripId: 'tg1', date: '2026-11-18', siteName: 'Portoko', photos: [], notes: '', createdAt: 2, items: [{ species: 'Sargo', key: 'sargo', n: 1, size: 'M', st: 'casa', stopId: 'sg1' }, { species: 'Sargo', key: 'sargo', n: 1, size: 'L', st: 'casa', stopId: 'sg1' }, { species: 'Sargo', key: 'sargo', n: 1, size: 'M', st: 'esc', stopId: 'sg1' }, { species: 'Sargo', key: 'sargo', n: 2, size: 'S', st: 'casa', who: 'Mikel', stopId: 'sg2' }] });
    await t.wait(800); await t.reload(); await t.wait(1500); await t.goTab('salidas'); await t.wait(800);
    await t.page.evaluate(() => { const o = document.querySelector('[data-a="trip-open"][data-id="tg1"]'); o && o.click(); }); await t.wait(1200);
    await t.case('El gráfico marca la ventana de cada spot con su hora de a–hasta', async () => {
      const x = await t.page.evaluate(() => Array.from(document.querySelectorAll('.tchart .tw')).map(e => e.textContent));
      t.ok('«10:18–10:52» en el gráfico', x.indexOf('10:18–10:52') >= 0, JSON.stringify(x));
      t.ok('«14:00–15:10» en el gráfico', x.indexOf('14:00–15:10') >= 0, JSON.stringify(x));
    });
    await t.case('Las picadas salen dentro de su ventana: tuyas llenas, escapada hueca, y no cuentan las de compañeros', async () => {
      t.eq('2 puntos llenos (tuyas)', await t.N('.tchart circle.bk'), 2);
      t.eq('1 punto hueco (escapada)', await t.N('.tchart circle.be'), 1);
      t.ok('el spot sin picadas mío (solo capturó Mikel) queda tenue', await t.page.evaluate(() => { const r = Array.from(document.querySelectorAll('.tchart rect[opacity]')); return r.some(e => e.getAttribute('opacity') === '.14') && r.some(e => e.getAttribute('opacity') === '.34'); }));
    });
    await t.case('Bajo el gráfico, una línea por spot: horas, duración, marea y picadas', async () => {
      const x = await t.page.evaluate(() => { const c = document.querySelector('.tcap'); return c ? c.innerText.replace(/\s+/g, ' ') : ''; });
      t.ok('10:18–10:52 · 34 min · pleamar · 3 picadas', /10:18–10:52 · 34 min · pleamar/.test(x) && /3 picadas/.test(x), x);
      t.ok('«1 escapada» y «2 en casa»', /2 en casa/.test(x) && /1 escapada/.test(x), x);
      t.ok('el otro spot, «sin picadas»', /14:00–15:10 · 1 h 10/.test(x) && /sin picadas/.test(x), x);
      t.ok('sin NaN ni undefined', !/NaN|undefined|\[object/.test(x));
      await t.page.evaluate(() => { const g = document.querySelector('.tchart'); g && g.scrollIntoView({ block: 'center' }); }); await t.wait(400);
      await t.shot(SHP + 'grafico-marea');
    });
  }
};
