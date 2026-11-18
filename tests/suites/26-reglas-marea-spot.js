/* Reglas fuertes del spot dichas en audio: solo en bajamar, solo con mareas vivas, la ola importa poco (caso Txatxarramendi). */
const SHP = process.env.SHP || '';
const iso = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const tides = (d, big) => big
  ? [{ t: d + 'T04:50', k: 'high', h: 4.4 }, { t: d + 'T11:00', k: 'low', h: 0.6 }, { t: d + 'T17:15', k: 'high', h: 4.3 }, { t: d + 'T23:30', k: 'low', h: 0.8 }]
  : [{ t: d + 'T04:30', k: 'low', h: 1.7 }, { t: d + 'T10:50', k: 'high', h: 3.2 }, { t: d + 'T17:25', k: 'low', h: 1.5 }, { t: d + 'T23:40', k: 'high', h: 3.0 }];
const card = (t) => t.page.evaluate(() => { const a = [].find.call(document.querySelectorAll('article.psite'), (x) => /Txatxa/.test(x.textContent)); return a ? a.innerText.replace(/\s+/g, ' ') : ''; });
module.exports = {
  name: 'Reglas de marea del spot (Txatxarramendi)',
  async run(t) {
    await t.seed(); await t.goTab('salidas');
    for (const s of await t.docs('spots')) await t.put('spots', s.id, Object.assign({}, s, { status: 'descartado' }));
    for (let i = 0; i <= 2; i++) await t.put('forecast', iso(i), { date: iso(i), point: 'test', src: 'test', samples: [1, 4, 7, 10, 13, 16, 19, 22].map((h) => ({ h, wave: 2.6, period: 10, wind: 8, gust: 12 })), tides: tides(iso(i), i === 1) });
    await t.put('sites', 'tx', { name: 'Txatxarramendi', lat: 43.395, lon: -2.692, desc: '', createdAt: 5, status: 'activo' });
    await t.put('spots', 'tx1', { name: 'Txatxa 1', siteId: 'tx', lat: 43.395, lon: -2.692, createdAt: 6, status: 'activo', from: 'final-baja', to: 'repunte', faseSolo: true, vivaMin: 3, olaDaIgual: true });
    /* una visita con «poca mar» que antes hacía aprender «≥ 1,1 m de ola» */
    await t.put('trips', 'tv1', { date: iso(-7), siteId: 'tx', siteName: 'Txatxarramendi', mode: 'Corcho', companions: [], eventos: [], createdAt: 1, stops: [{ id: 'stv1', spotId: 'tx1', spotName: 'Txatxa 1', tFrom: '10:47', tTo: '12:11', wave: 1, waveV: 'poco', tpFrom: 'baja', tpTo: 'baja', range: 3.1, baits: [] }] });
    await t.put('catches', 'cv1', { tripId: 'tv1', date: iso(-7), items: [{ species: 'Sargo', key: 'sargo', n: 2, size: 'M', st: 'casa', stopId: 'stv1', spotId: 'tx1' }] });
    await t.wait(900); await t.reload(); await t.wait(1800); await t.goTab('hoy'); await t.wait(1400);
    await t.case('La receta enseña lo que dijiste: bajamar, mareas vivas y que la ola importa poco', async () => {
      const x = await card(t);
      t.ok('«solo final de la bajada → repunte de bajamar»', /solo final de la bajada → repunte de bajamar/.test(x), x.slice(0, 400));
      t.ok('«mareas vivas (≥ 3 m)»', /mareas vivas \(≥ 3 m\)/.test(x), x.slice(0, 400));
      t.ok('«la ola importa poco» y ya no exige «≥ 1,1 m»', /la ola importa poco/.test(x) && !/≥ 1,1 m/.test(x), x.slice(0, 400));
    });
    await t.case('Con mareas muertas no lo recomienda y dice por qué', async () => {
      const x = await card(t);
      t.ok('aviso «Mareas muertas (1,7 m de recorrido): este sitio pide mareas vivas»', /Mareas muertas \(1,7 m de recorrido\): este sitio pide mareas vivas/.test(x), x.slice(0, 400));
      t.ok('sin ventana buena hoy', /sin ventana buena/.test(x), x.slice(0, 200));
      await t.shot(SHP + 'reglas-hoy');
    });
    await t.case('Con mareas vivas, la ventana cae en la bajamar (11:00) y no en pleamar', async () => {
      await t.page.evaluate((d) => { const b = document.querySelector('[data-a="day"][data-d="' + d + '"]'); b && b.click(); }, iso(1)); await t.wait(1200);
      const x = await card(t);
      const m = x.match(/mejor (\d\d):(\d\d)–(\d\d):(\d\d)/);
      t.ok('hay ventana y sin aviso', !!m && !/pide mareas vivas/.test(x), x.slice(0, 300));
      if (m) { const a = +m[1] * 60 + +m[2], b = +m[3] * 60 + +m[4]; t.ok('la ventana rodea la bajamar de las 11:00 (entre 09:00 y 13:00)', a >= 540 && b <= 780 && a <= 660 && b >= 660, m[0]); }
      await t.shot(SHP + 'reglas-viva');
    });
    await t.case('Matxitxako: pide agua algo tomada; si lo probable es agua clara, el Plan lo avisa y lo baja', async () => {
      for (let i = -8; i <= 2; i++) await t.put('forecast', iso(i), { date: iso(i), point: 'test', src: 'test', samples: [1, 4, 7, 10, 13, 16, 19, 22].map((h) => ({ h, wave: 0.8, period: 9, wind: 8, gust: 12 })), tides: tides(iso(i), true) });
      await t.put('sites', 'mx', { name: 'Matxitxako', lat: 43.4565, lon: -2.7525, desc: '', createdAt: 9, status: 'activo' });
      await t.put('spots', 'mx1', { name: 'Piedra B', siteId: 'mx', lat: 43.4565, lon: -2.7529, createdAt: 10, status: 'activo', minWave: 0.5, maxWave: 1.3, aguaMin: 'tomadilla' });
      await t.put('trips', 'tm1', { date: iso(-3), siteId: 'mx', siteName: 'Matxitxako', mode: 'Corcho', companions: [], eventos: [], createdAt: 2, stops: [{ id: 'stm1', spotId: 'mx1', spotName: 'Piedra B', tFrom: '09:00', tTo: '12:00', wave: 0.8, baits: [] }] });
      await t.put('aguas', 'stm1', { stopId: 'stm1', agua: 'cristal', u: 1 });
      await t.wait(900); await t.reload(); await t.wait(2200); await t.goTab('hoy'); await t.wait(1500);
      const mc = () => t.page.evaluate(() => { const a = [].find.call(document.querySelectorAll('article.psite'), (x) => /Matxitxako/.test(x.querySelector('h3') ? x.querySelector('h3').textContent : '')); return a ? a.innerText.replace(/\s+/g, ' ') : ''; });
      await t.page.evaluate((d) => { const b = document.querySelector('[data-a="day"][data-d="' + d + '"]'); b && b.click(); }, iso(1)); await t.wait(1200);
      const x = await mc();
      t.ok('chip «agua algo tomada o tras temporal» en la receta', /agua algo tomada o tras temporal/.test(x), x.slice(0, 350));
      t.ok('aviso «Agua probable cristal: aquí rinde con el agua algo más tomada»', /Agua probable cristal: aquí rinde con el agua algo más tomada/.test(x), x.slice(0, 350));
      await t.shot(SHP + 'reglas-agua');
    });
    await t.case('Se puede marcar desde el editor del spot', async () => {
      await t.page.evaluate(() => { const b = document.createElement('button'); b.setAttribute('data-a', 'edit-spot'); b.setAttribute('data-id', 'tx1'); document.body.appendChild(b); b.click(); b.remove(); }); await t.wait(700);
      t.ok('las casillas, marcadas', await t.page.evaluate(() => ['sp-fsolo', 'sp-viva', 'sp-olaig'].every((i) => { const e = document.getElementById(i); return e && e.checked; })));
      await t.page.evaluate(() => { document.getElementById('sp-olaig').checked = false; }); await t.tap('#sp-save', 900);
      const s = (await t.docs('spots')).find((x) => x.id === 'tx1');
      t.ok('se guarda: la ola deja de dar igual y lo demás sigue', s.olaDaIgual === false && s.faseSolo === true && s.vivaMin === 3, JSON.stringify(s));
    });
  }
};
