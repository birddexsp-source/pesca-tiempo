/* Ajustes → Completar salidas anteriores: detecta lo que falta y deja rellenarlo. */
const SHP = process.env.SHP || '';
module.exports = {
  name: 'Completar salidas anteriores',
  async run(t) {
    await t.seed(); await t.goTab('salidas');
    await t.put('spots', 'cA', { name: 'Roca vieja', siteId: 's1', lat: 43.45, lon: -2.75, createdAt: 1 });
    await t.put('trips', 'a1', { date: '2026-10-10', siteId: 's1', siteName: 'Matxitxako', mode: 'Corcho', companions: [], eventos: [], createdAt: 1, stops: [{ id: 'sa1', spotId: 'cA', spotName: 'Roca vieja', tFrom: '', tTo: '', wave: 1.2, wind: 10, baits: [] }] });
    await t.put('catches', 'ca1', { tripId: 'a1', date: '2026-10-10', ts: 5000, items: [{ species: 'Sargo', n: 3, st: 'casa', stopId: 'sa1', spotId: 'cA' }] });
    await t.put('trips', 'a2', { date: '2026-10-12', siteId: 's1', siteName: 'Matxitxako', mode: 'Corcho', companions: [], eventos: [], createdAt: 2, stops: [{ id: 'sa2', spotId: 'cA', spotName: 'Roca vieja', tFrom: '08:00', tTo: '10:00', wave: 1.0, wind: 8, waveV: 'ok', windV: 'ok', baits: ['Gamba'] }] });
    await t.put('aguas', 'sa2', { stopId: 'sa2', agua: 'cristal', u: 1 });
    await t.put('trips', 'a3', { date: '2026-10-14', siteId: 's1', siteName: 'Matxitxako', mode: 'Solo mirar el mar', companions: [], eventos: [], createdAt: 3, stops: [{ id: 'sa3', spotId: 'cA', spotName: 'Roca vieja', tFrom: '', tTo: '', baits: [] }] });
    await t.put('aguas', 'sa3', { stopId: 'sa3', agua: 'cristal', u: 1 });
    await t.wait(900); await t.reload(); await t.wait(1500);
    await t.case('Ajustes: bloque con lo que falta', async () => {
      await t.tap('[data-a="open-settings"]', 700);
      const b = await t.page.evaluate(() => document.getElementById('cmblk').parentElement.parentElement.textContent.replace(/\s+/g, ' '));
      t.ok('aparece «Completar salidas anteriores» arriba de todo', /Completar salidas anteriores/.test(b) && (await t.page.evaluate(() => document.getElementById('sheetbody').firstElementChild.contains(document.getElementById('cmblk')))), b);
      t.ok('cuenta 1 salida con datos sin marcar y progreso por variable', /1 salida tiene/.test(b) && /Horas\s*1\/2/.test(b) && /Agua\s*2\/3/.test(b) && /Cebo\s*1\/2/.test(b), b);
      t.ok('«Solo mirar el mar» no pide horas ni cebo', !/Horas\s*1\/3/.test(b));
      await t.shot(SHP + 'ajustes-bloque');
    });
    await t.case('Completar: rellenar y guardar', async () => {
      await t.tap('[data-a="cm-open"]', 700);
      t.ok('lista solo la salida incompleta con sus campos', (await t.N('.cmc')) === 1 && (await t.N('.cmr')) === 5, await t.T('#sheetbody'));
      await t.shot(SHP + 'completar-lista');
      await t.page.fill('[data-cmt="tFrom"]', '07:30'); await t.wait(500);
      await t.page.fill('[data-cmt="tTo"]', '10:00'); await t.wait(700);
      await t.tap('.cmc[data-k="a1|sa1"] [data-f="agua"][data-v="tomadilla"]', 500);
      await t.tap('.cmc[data-k="a1|sa1"] [data-a="cm-bait"][data-v="Mejillón"]', 500);
      await t.tap('.cmc[data-k="a1|sa1"] [data-f="waveV"][data-v="ok"]', 500);
      await t.tap('.cmc[data-k="a1|sa1"] [data-f="windV"][data-v="mucho"]', 700);
      const tr = (await t.docs('trips')).find(x => x.id === 'a1'), st = (tr.stops || [])[0] || {};
      t.ok('horas guardadas en la parada', st.tFrom === '07:30' && st.tTo === '10:00', JSON.stringify(st));
      t.ok('cebo y valoraciones guardados', (st.baits || []).includes('Mejillón') && st.waveV === 'ok' && st.windV === 'mucho', JSON.stringify(st));
      t.ok('agua guardada en su colección', (await t.docs('aguas')).some(a => a.stopId === 'sa1' && a.agua === 'tomadilla'));
      t.ok('lo marcado se queda visible en la ficha', await t.page.evaluate(() => !!document.querySelector('.cmc .ag.tomadilla.on') && !!document.querySelector('.cmc .cmb.on[data-v="Mejillón"]')));
      await t.shot(SHP + 'completar-hecho');
    });
    await t.case('Al volver, todo al día; «No lo sé» y filtros', async () => {
      await t.tap('[data-a="cm-back"]', 700);
      const b = await t.page.evaluate(() => document.getElementById('cmblk').parentElement.parentElement.textContent.replace(/\s+/g, ' '));
      t.ok('Ajustes muestra todo al día', /Todas tus salidas tienen los datos al día/.test(b) && /Horas\s*2\/2/.test(b), b);
      await t.put('trips', 'a4', { date: '2026-10-15', siteId: 's1', siteName: 'Matxitxako', mode: 'Corcho', companions: [], eventos: [], createdAt: 4, stops: [{ id: 'sa4', spotId: 'cA', spotName: 'Roca vieja', tFrom: '', tTo: '', baits: [] }] });
      await t.wait(900); await t.reload(); await t.wait(1500);
      await t.tap('[data-a="open-settings"]', 700); await t.tap('[data-a="cm-open"]', 700);
      await t.tap('[data-a="cm-f"][data-v="h"]', 500);
      t.ok('el filtro «Horas» solo muestra esa fila', (await t.N('.cmr')) === 1 && /horas pescando/i.test(await t.T('.cmr')), await t.T('#sheetbody'));
      await t.tap('[data-a="cm-skip"]', 500);
      t.ok('«No lo sé» la quita de la lista', (await t.N('.cmc')) === 0 && /Todo al día/.test(await t.T('#sheetbody')));
    });
  }
};
