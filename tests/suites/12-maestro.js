/* El maestro pescador: hipótesis contrastadas con tus datos, consejo del Plan y avisos en la salida en directo. */
const SHP = process.env.SHP || '';
async function sembrar(t) {
  const W = { '2026-12-04': 1.0, '2026-12-05': 1.1, '2026-12-06': 1.0, '2026-12-07': 1.5, '2026-12-08': 2.0, '2026-12-09': 3.4, '2026-12-10': 2.6, '2026-12-11': 1.8, '2026-12-12': 1.4, '2026-12-13': 1.0, '2026-12-14': 0.9, '2026-12-15': 2.8, '2026-12-16': 3.2 };
  const V = { '2026-12-12': 30, '2026-12-16': 26 };
  for (const [d, w] of Object.entries(W)) await t.put('forecast', d, { date: d, point: 'test', src: 'test', samples: [1, 4, 7, 10, 13, 16, 19, 22].map(h => ({ h, wave: w, period: 9, wind: V[d] || 8, gust: (V[d] || 8) + 4 })), tides: [] });
  await t.put('spots', 'mA', { name: 'Roca turbia', siteId: 's1', lat: 43.45, lon: -2.75, createdAt: 1 });
  await t.put('spots', 'mB', { name: 'Roca limpia', siteId: 's1', lat: 43.455, lon: -2.76, createdAt: 2 });
  await t.put('spots', 'mC', { name: 'Cala nueva', siteId: 's1', lat: 43.46, lon: -2.77, createdAt: 3 });
  const visita = async (id, date, spot, name, from, to, hA, hB, baits, agua, items, extra) => {
    const sid = 's-' + id;
    await t.put('trips', id, { date, siteId: 's1', siteName: 'Matxitxako', mode: 'Corcho', companions: [], eventos: [], stops: [{ id: sid, spotId: spot, spotName: name, tFrom: from, tTo: to, wave: 1.5, wind: 8, waveV: 'ok', windV: 'ok', hA, hB, photos: [], need: [], tags: [], baits }, ].map(x => Object.assign(x, extra || {})) });
    if (items.length) await t.put('catches', 'c-' + id, { tripId: id, date, ts: 5000 + Math.random() * 100, items: items.map(i => Object.assign({ st: 'casa', stopId: sid, spotId: spot }, i)) });
    if (agua) await t.put('aguas', sid, { stopId: sid, agua, u: 1 });
  };
  await visita('m1', '2026-12-10', 'mA', 'Roca turbia', '07:00', '10:00', 1.0, 2.2, ['Gamba'], 'tomadilla', [{ species: 'Sargo', n: 4 }, { species: 'Boga', n: 1 }]);
  await visita('m2', '2026-12-11', 'mB', 'Roca limpia', '08:00', '10:00', 2.2, 3.0, ['Gamba'], 'cristal', [{ species: 'Boga', n: 6 }, { species: 'Sargo', n: 1 }]);
  await visita('m3', '2026-12-09', 'mA', 'Roca turbia', '07:30', '10:30', 2.5, 1.4, ['Mejillón'], 'tomada', [{ species: 'Sargo', n: 3 }]);
  await visita('m4', '2026-12-06', 'mB', 'Roca limpia', '07:00', '10:00', 1.0, 2.0, ['Cangrejo'], 'cristal', [{ species: 'Sargo', n: 1 }]);
  await visita('m5', '2026-12-07', 'mA', 'Roca turbia', '08:00', '11:00', 2.4, 1.2, ['Gamba'], 'cristal', []);
  await visita('m6', '2026-12-05', 'mA', 'Roca turbia', '07:00', '09:30', 1.1, 2.3, ['Cangrejo'], 'tomadilla', [{ species: 'Sargo', n: 3 }]);
  await visita('m7', '2026-11-20', 'mA', 'Roca turbia', '08:00', '09:00', 1.0, 1.5, ['Gamba'], null, [], { wind: 25, windV: 'mucho' });
  await t.wait(900); await t.reload(); await t.wait(1800);
}
module.exports = {
  name: 'El maestro pescador',
  async run(t) {
    await t.seed(); await t.goTab('salidas');
    await t.case('El maestro: consejo del Plan, libro de hipótesis y «probar en la próxima salida»', async () => {
      await sembrar(t);
      await t.goTab('hoy'); await t.wait(1200);
      await t.page.evaluate(() => { const b = document.querySelector('[data-d="2026-12-11"]'); b && b.click(); }); await t.wait(1000);
      const adv = await t.page.evaluate(() => (document.querySelector('.mdadv') || {}).textContent || '');
      t.ok('el Plan abre con «El maestro dice» y mejores opciones con su «por qué»', /El maestro dice/.test(adv) && /Mejores opciones/.test(adv) && /¿Por qué\?/.test(adv), adv.slice(0, 200));
      t.ok('«Mejor no ir» cita el viento de 25 kph de tu visita', /Mejor no ir/.test(adv) && /No vayas a Roca turbia/.test(adv) && /viento 2[6-9]|viento 30/.test(adv), adv);
      await t.page.evaluate(() => document.querySelector('.pdays').scrollIntoView({ block: 'start' })); await t.wait(300); await t.shot(SHP + 'plan-arriba');
      const book = await t.page.evaluate(() => [...document.querySelectorAll('.mdh')].map(e => e.textContent));
      t.eq('7 hipótesis en el libro', book.length, 7);
      const H = (re) => book.find(x => re.test(x)) || '';
      t.ok('tomadilla vs cristal: lo confirman tus datos con las cifras', /Tus datos lo confirman/.test(H(/tomadilla rinde/)) && /1,3 sargos\/h/.test(H(/tomadilla rinde/)) && /0,3 sargos\/h/.test(H(/tomadilla rinde/)), H(/tomadilla rinde/));
      t.ok('barro: faltan datos y no se inventa un veredicto', /Faltan datos/.test(H(/chocolate/)));
      t.ok('cangrejo aleja bogas: 0 % frente a 47 % (hipótesis oída, ahora confirmada por tus datos)', /0 % de bogas/.test(H(/cangrejo/)) && /47 % de bogas/.test(H(/cangrejo/)) && /confirman/.test(H(/cangrejo/)), H(/cangrejo/));
      t.ok('cada hipótesis dice su fuente', book.every(x => /Fuente:/.test(x)));
      await t.page.evaluate(() => document.querySelector('.mdh').scrollIntoView({ block: 'start' })); await t.wait(300);
      await t.shot(SHP + 'plan-libro');
      await t.page.evaluate(() => document.querySelector('[data-a="md-probar"][data-id="bogas"]').click()); await t.wait(900);
      t.ok('«Probar en la próxima salida» se guarda', (await t.docs('hipotesis')).some(h => h.id === 'bogas' && h.probar));
      t.ok('y el botón se marca', /✓/.test(await t.page.evaluate(() => document.querySelector('[data-a="md-probar"][data-id="bogas"]').textContent)));
    });
    await t.case('Salida en directo: «Hoy pruebas» y aviso de bogas con acciones', async () => {
      await t.goTab('salidas'); await t.tap('[data-a="new-trip"]'); await t.tap('[data-a="lv-live"]', 500); await t.tap('[data-a="lv-start"]', 900);
      const s = (await t.docs('sesiones'))[0];
      t.ok('sin capturas de bogas aún no hay aviso', !(await t.has('.mdalert')));
      t.ok('«Hoy pruebas» recuerda la hipótesis elegida', /Hoy pruebas/.test(await t.T('#sessbody')) && /bogas, la pesca de sargo/.test(await t.T('#sessbody')));
      await t.put('catches', 'qq1', { sess: s.id, quick: true, date: '2026-12-11', ts: Date.now(), items: [{ species: 'Boga', n: 4, st: 'casa' }, { species: 'Sargo', n: 1, st: 'casa' }] });
      await t.wait(900);
      await t.page.evaluate(() => { const b = document.querySelector('#sessbar .sbt'); b && b.click(); }); await t.wait(900);
      t.ok('con 4 bogas de 5 peces sale «Están entrando bogas»', /Están entrando bogas/.test(await t.T('#sessbody')) && /4 de tus 5/.test(await t.T('#sessbody')));
      await t.shot(SHP + 'directo-arriba');
      await t.page.evaluate(() => { const sh = document.getElementById('sheetbody'); if (sh) sh.scrollTop = 380; }); await t.wait(300);
      await t.shot(SHP + 'directo-medio');
      await t.tap('[data-a="lv-boga"][data-v="duro"]', 500);
      t.ok('lo que pruebas queda anotado en el registro de la salida', ((await t.docs('sesiones'))[0].events || []).some(e => e.type === 'boga' && e.v === 'duro'));
      t.ok('y se ve en el registro', /cebo duro \/ cangrejo por las bogas/.test(await t.T('#sessbody')));
    });
    await t.case('Editar una salida: chips de agua en cada spot y mar previo', async () => {
      await t.page.evaluate(() => { const b = document.querySelector('#sheet [data-a="close-sheet"]'); b && b.click(); }); await t.wait(400);
      await t.goTab('salidas'); await t.wait(800);
      await t.page.evaluate(() => { const o = document.querySelector('[data-a="trip-open"][data-id="m3"]'); o && o.click(); }); await t.wait(900);
      await t.page.evaluate(() => { const b = document.querySelector('[data-a="edit-trip"][data-id="m3"]'); b && b.click(); }); await t.wait(900);
      for (let k = 0; k < 4 && !(await t.has('.agblk')); k++) { await t.tapIf('[data-a="next-step"]'); await t.wait(500); }
      t.ok('el editor muestra «Cómo estaba el agua» con 4 chips', (await t.N('.agblk .ag')) === 4);
      t.ok('con el agua ya apuntada marcada (tomada)', await t.has('.agblk .ag.tomada.on'));
      await t.page.evaluate(() => document.querySelector('.agblk .ag.chocolate').click()); await t.wait(900);
      t.eq('un toque en el editor guarda el agua', ((await t.docs('aguas')).find(a => a.stopId === 's-m3') || {}).agua, 'chocolate');
      t.ok('el desplegable del mar previo explica de dónde sale', /pico de 3,4 m hace 0 días|pico de 3,4 m/.test(await t.page.evaluate(() => document.querySelector('.agblk .agd').textContent)));
      await t.page.evaluate(() => document.querySelector('.agblk').scrollIntoView({ block: 'center' })); await t.wait(300);
      await t.shot(SHP + 'editor-agua');
    });
  }
};
