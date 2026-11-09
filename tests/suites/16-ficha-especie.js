/* Ficha de especie completa: pestañas, tus números, legal con fuentes, mitos contrastados con tus datos. */
const SHP = process.env.SHP || '';
const ANTES = !!process.env.ANTES;
async function sembrar(t) {
  await t.put('spots', 'fA', { name: 'Roca vieja', siteId: 's1', lat: 43.45, lon: -2.75, createdAt: 1 });
  await t.put('spots', 'fB', { name: 'Escollera', siteId: 's1', lat: 43.455, lon: -2.76, createdAt: 2 });
  const visita = async (id, date, spot, name, from, to, baits, agua, items) => {
    const sid = 's-' + id;
    await t.put('trips', id, { date, siteId: 's1', siteName: 'Matxitxako', mode: 'Corcho', companions: [], eventos: [], createdAt: Date.parse(date), stops: [{ id: sid, spotId: spot, spotName: name, tFrom: from, tTo: to, baits, wave: 1.2, wind: 8 }] });
    await t.put('catches', 'c-' + id, { tripId: id, date, ts: Date.parse(date) + 5000, items: items.map(i => Object.assign({ st: 'casa', stopId: sid, spotId: spot }, i)) });
    if (agua) await t.put('aguas', sid, { stopId: sid, agua, u: 1 });
  };
  await visita('f1', '2026-10-10', 'fA', 'Roca vieja', '07:00', '10:00', ['Cangrejo'], 'tomadilla', [{ species: 'Sargo', n: 3, size: 'M', bait: 'Cangrejo' }, { species: 'Boga', n: 2, size: 'S' }]);
  await t.put('trips', 'f1', Object.assign({}, (await t.docs('trips')).find(x => x.id === 'f1')));
  await visita('f2', '2026-11-02', 'fB', 'Escollera', '08:00', '11:00', ['Mejillón'], 'cristal', [{ species: 'Sargo', n: 1, size: 'L', bait: 'Mejillón' }, { species: 'Oblada', n: 4, size: 'S' }]);
  await visita('f3', '2026-11-06', 'fA', 'Roca vieja', '07:30', '10:30', ['Cangrejo'], 'tomada', [{ species: 'Sargo', n: 2, size: 'M', bait: 'Cangrejo' }]);
  await t.wait(1000); await t.reload(); await t.wait(1800);
}
async function abrir(t, k) {
  await t.page.evaluate((k) => { const b = document.createElement('button'); b.setAttribute('data-a', 'sp-open'); b.setAttribute('data-k', k); document.body.appendChild(b); b.click(); b.remove(); }, k);
  await t.wait(900);
}
module.exports = {
  name: 'Ficha de especie completa',
  async run(t) {
    await t.seed(); await t.goTab('salidas');
    await sembrar(t);
    await t.case('Ficha del sargo: resumen con tus números', async () => {
      await abrir(t, 'sargo');
      await t.shot(SHP + 'sargo-resumen');
      if (ANTES) return;
      const r = await t.T('#sheetbody');
      t.ok('hay pestañas Resumen · Pescar · Mitos · Legal · Ficha', (await t.N('.spx-nav button')) === 5);
      t.ok('tus números: 6 capturas de sargo en 3 salidas y 2 spots', /6\s*capturas/i.test(r) && /3\s*salidas/i.test(r) && /2\s*spots/i.test(r), r.slice(0, 400));
      t.ok('tu mejor sitio, cebo y agua salen de tus datos', /Roca vieja/.test(r) && /Cangrejo/.test(r) && /Tomad/i.test(r), r.slice(0, 600));
      t.ok('las capturas por mes dibujan octubre y noviembre', (await t.N('.spmc b:not(:empty)')) === 2);
      t.ok('sin NaN ni undefined en la ficha', !/NaN|undefined|\[object/.test(r));
    });
    await t.case('Pescar, Mitos y Legal', async () => {
      if (ANTES) return;
      await t.tap('[data-a="spx-tab"][data-v="pes"]', 400);
      let r = await t.T('.spp[data-p="pes"]');
      t.ok('cebos recomendados con lo que ya has usado', /Cangrejo/.test(r) && /Con él: 5 capturas/.test(r) && /Aún sin probar/.test(r), r.slice(0, 500));
      await t.shot(SHP + 'sargo-pescar');
      await t.tap('[data-a="spx-tab"][data-v="mit"]', 400);
      r = await t.T('.spp[data-p="mit"]');
      t.ok('mitos con veredicto y fuente', /Falso/.test(r) && /Sin verificar/.test(r));
      await t.page.evaluate(() => { document.querySelectorAll('.spmit').forEach((d, i) => { d.open = i < 2; }); });
      await t.wait(300);
      t.ok('un mito enlaza con tus datos del maestro', /Tus datos/.test(await t.T('.spp[data-p="mit"]')));
      await t.shot(SHP + 'sargo-mitos');
      await t.tap('[data-a="spx-tab"][data-v="leg"]', 400);
      r = await t.T('.spp[data-p="leg"]');
      t.ok('legal: el sargo no tiene talla mínima en el Cantábrico y se explica', /Sin talla mínima en el Cantábrico/.test(r) && /RD 560\/1995/.test(r));
      t.ok('legal: reglas generales (5 kg, 6 anzuelos) y fuentes con enlace', /5 kg por licencia/.test(r) && /6 anzuelos/.test(r) && (await t.N('.spsrc')) >= 3);
      await t.shot(SHP + 'sargo-legal');
      await t.tap('[data-a="spx-tab"][data-v="fic"]', 400);
      r = await t.T('.spp[data-p="fic"]');
      t.ok('ficha: cifras con su nivel de fiabilidad', /45 cm/.test(r) && /Ciencia/.test(r));
      await t.shot(SHP + 'sargo-ficha');
    });
    await t.case('Lubina: normativa con aviso de fuentes distintas; especie sin datos no inventa', async () => {
      if (ANTES) { await t.tap('[data-a="close-sheet"]', 300); await abrir(t, 'lubina'); await t.shot(SHP + 'lubina-resumen'); return; }
      await t.tap('[data-a="close-sheet"]', 300); await abrir(t, 'lubina');
      await t.tap('[data-a="spx-tab"][data-v="leg"]', 400);
      let r = await t.T('.spp[data-p="leg"]');
      t.ok('lubina: 42/44 cm, 5 kg y aviso de que las fuentes no coinciden', /42 cm al oeste de Donostia/.test(r) && /5 kg/.test(r) && /no coinciden/.test(r) && /protección diferenciada/.test(r), r.slice(0, 500));
      await t.shot(SHP + 'lubina-legal');
      await t.tap('[data-a="spx-tab"][data-v="res"]', 300);
      t.ok('sin capturas: «Tu primera captura» con plan', /Aún sin capturas/i.test(await t.T('#sheetbody')) && /Tu primera captura/i.test(await t.T('#sheetbody')));
      await t.shot(SHP + 'lubina-resumen');
      await t.tap('[data-a="close-sheet"]', 300); await abrir(t, 'rape');
      r = await t.T('#sheetbody');
      t.ok('especie sin datos: lo dice y no inventa nada', /Todavía no tengo datos verificados/.test(r) && !/NaN|undefined/.test(r), r.slice(0, 300));
      await t.tap('[data-a="spx-tab"][data-v="leg"]', 300);
      t.ok('y aun así enseña las reglas generales', /5 kg por licencia/.test(await t.T('.spp[data-p="leg"]')));
    });
  }
};
