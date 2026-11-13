/* Interfaz visual: lo justo a la vista y el detalle al tocar, sin listas eternas ni desbordes. */
const SHP = process.env.SHP || '';
const iso = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
async function sembrar(t) {
  for (let i = 0; i <= 7; i++) await t.put('forecast', iso(i), { date: iso(i), point: 'test', src: 'test', samples: [1, 4, 7, 10, 13, 16, 19, 22].map(h => ({ h, wave: 1.0 + i * 0.2, period: 9, wind: 8 + i, gust: 14 })), tides: [] });
  await t.put('spots', 'uA', { name: 'Roca vieja', siteId: 's1', lat: 43.45, lon: -2.75, createdAt: 1 });
  await t.put('spots', 'uB', { name: 'Escollera', siteId: 's1', lat: 43.455, lon: -2.76, createdAt: 2 });
  const visita = async (id, date, spot, name, from, to, baits, agua, items) => {
    const sid = 's-' + id;
    await t.put('trips', id, { date, siteId: 's1', siteName: 'Matxitxako', mode: 'Corcho', companions: [], eventos: [], createdAt: Date.parse(date), stops: [{ id: sid, spotId: spot, spotName: name, tFrom: from, tTo: to, baits, wave: 1.2, wind: 8 }] });
    if (items.length) await t.put('catches', 'c-' + id, { tripId: id, date, ts: Date.parse(date) + 5000, items: items.map(i => ({ species: i[0], n: i[1], size: 'M', st: 'casa', stopId: sid, spotId: spot })) });
    if (agua) await t.put('aguas', sid, { stopId: sid, agua, u: 1 });
  };
  const D = [[-30, 'uA', 'Roca vieja', '07:00', '10:00', ['Cangrejo'], 'tomadilla', [['Sargo', 4], ['Boga', 2]]], [-26, 'uA', 'Roca vieja', '07:00', '10:00', ['Cangrejo'], 'tomadilla', [['Sargo', 3]]], [-22, 'uA', 'Roca vieja', '07:30', '10:30', ['Cangrejo'], 'tomadilla', [['Sargo', 5], ['Oblada', 2]]], [-18, 'uB', 'Escollera', '15:00', '18:00', ['Mejillón'], 'cristal', [['Sargo', 1]]], [-14, 'uB', 'Escollera', '15:00', '18:00', ['Mejillón'], 'cristal', []], [-10, 'uB', 'Escollera', '15:30', '18:30', ['Mejillón'], 'cristal', [['Lubina', 1]]], [-5, 'uA', 'Roca vieja', '07:00', '10:00', ['Cangrejo'], 'tomadilla', [['Sargo', 2]]], [-1, 'uA', 'Roca vieja', '07:00', '10:00', ['Cangrejo'], 'tomadilla', [['Sargo', 6]]]];
  let k = 0; for (const d of D) { k++; await visita('u' + k, iso(d[0]), d[1], d[2], d[3], d[4], d[5], d[6], d[7]); }
  await t.wait(1000); await t.reload(); await t.wait(1800);
}
const H = (t, sel) => t.page.evaluate((s) => { const e = document.querySelector(s); return e ? e.scrollHeight : 0; }, sel);
const scrollTo = (t, sel) => t.page.evaluate((s) => { const m = document.getElementById('main'), e = document.querySelector(s); if (m && e) m.scrollTo({ top: m.scrollTop + e.getBoundingClientRect().top - 70, behavior: 'instant' }); }, sel);
const openSpot = async (t, id) => { await t.page.evaluate((id) => { const b = document.createElement('button'); b.setAttribute('data-a', 'open-spot'); b.setAttribute('data-id', id); document.body.appendChild(b); b.click(); b.remove(); }, id); await t.wait(900); };
const closeSheet = async (t) => { await t.page.evaluate(() => { const b = document.querySelector('[data-a="close-sheet"]'); b && b.click(); }); await t.wait(500); };
const noJunk = (s) => !/NaN|undefined|\[object/.test(s);
module.exports = {
  name: 'Interfaz visual',
  async run(t) {
    await t.seed(); await t.goTab('salidas');
    await sembrar(t);
    await t.case('Plan: una recomendación clara y el resto plegado', async () => {
      await t.goTab('hoy'); await t.wait(1400);
      const h = await H(t, '#main');
      t.ok('el Plan ya no es una lista eterna (menos de 3000 px con 7 días y 6 spots)', h > 0 && h < 3000, 'h=' + h);
      const top = await t.page.evaluate(() => (document.querySelector('section.pnext') || {}).textContent || '');
      t.ok('«Tu próxima salida»: día, sitio y spots abiertos', /Tu próxima salida/i.test(top) && /Matxitxako/.test(top) && /\d+\s*de\s*\d+ spots/.test(top), top.slice(0, 200));
      t.ok('tres fichas: ventana, franja y cebo', (await t.N('section.pnext .pnt > div')) === 3 && /Ventana/i.test(top) && /Franja/i.test(top) && /Cebo/i.test(top) && /Cangrejo/.test(top));
      t.ok('veredicto del día antes que la recomendación', await t.page.evaluate(() => { const v = document.querySelector('.pverdict'), n = document.querySelector('section.pnext'); return !!v && !!n && (v.compareDocumentPosition(n) & 4) > 0; }));
      t.ok('condiciones y agua vienen plegadas con un resumen de una línea', (await t.N('details.uiacc[data-uk="pmet"]:not([open])')) === 1 && (await t.N('details.uiacc[data-uk="pagua"]:not([open])')) === 1);
      t.ok('las reglas de cada spot vienen plegadas', (await t.N('.psmd:not([open])')) >= 1 && (await t.N('.psmd[open]')) === 0);
      t.ok('sin NaN/undefined en el Plan', noJunk(await t.page.evaluate(() => document.getElementById('main').textContent)));
      await t.page.evaluate(() => document.getElementById('main').scrollTo({ top: 0, behavior: 'instant' })); await t.wait(300);
      await t.shot(SHP + 'ui-plan');
      await scrollTo(t, 'section.pnext'); await t.wait(500); await t.shot(SHP + 'ui-plan-recomendacion');
    });
    await t.case('Plan: al tocar se abre y se queda abierto', async () => {
      await t.page.evaluate(() => document.querySelector('[data-uk="pmet"] > summary').click()); await t.wait(500);
      t.ok('se abre «Condiciones del día» y se ve el gráfico', (await t.N('details[data-uk="pmet"][open] .pmeteo')) === 1);
      await t.goTab('salidas'); await t.goTab('hoy'); await t.wait(900);
      t.ok('al volver sigue abierto (recuerda lo que abriste)', (await t.N('details[data-uk="pmet"][open]')) === 1);
      await t.page.evaluate(() => document.querySelector('.pmore > summary').click()); await t.wait(400);
      t.ok('«Por qué y otras opciones» enseña el consejo del maestro', /El maestro dice/.test(await t.page.evaluate(() => document.querySelector('.pmore').textContent)));
      await t.page.evaluate(() => document.querySelector('[data-uk="pmet"] > summary').click()); await t.wait(300);
    });
    await t.case('Ficha del spot: pestañas en vez de una lista de 4000 px', async () => {
      await openSpot(t, 'uA');
      t.ok('3 pestañas: Resumen, Cómo rinde, Visitas', (await t.N('.stx button')) === 3);
      const h = await H(t, '#sheetbody');
      t.ok('la ficha cabe en menos de 1500 px (antes ~4200)', h > 0 && h < 1500, 'h=' + h);
      const r = await t.page.evaluate(() => document.querySelector('.stpn[data-p="res"]').textContent);
      t.ok('Resumen: cebo y especies del spot', /Cangrejo/.test(r) && /Sargo/.test(r));
      await t.shot(SHP + 'ui-spot-resumen');
      await t.page.evaluate(() => document.querySelector('.stx [data-v="rin"]').click()); await t.wait(400);
      t.ok('«Cómo rinde» tiene receta y agua', /Receta de Roca vieja/.test(await t.page.evaluate(() => document.querySelector('.stpn[data-p="rin"]').textContent)) && (await t.N('.stpn[data-p="rin"]:not([hidden])')) === 1);
      await t.shot(SHP + 'ui-spot-rinde');
      await t.page.evaluate(() => document.querySelector('.stx [data-v="vis"]').click()); await t.wait(400);
      t.ok('«Visitas»: cada visita compacta con el agua plegada', (await t.N('.stpn[data-p="vis"] .mvc')) >= 4 && (await t.N('.stpn[data-p="vis"] .mvdet:not([open])')) >= 4);
      t.ok('«Visitas»: historial plegado', (await t.N('.stpn[data-p="vis"] details[data-uk="sthis"]:not([open])')) === 1);
      await t.shot(SHP + 'ui-spot-visitas');
      t.ok('sin desbordes horizontales', (await t.overflow()).length === 0);
      await closeSheet(t);
    });
    await t.case('Salidas: filas compactas y las últimas primero', async () => {
      await t.goTab('salidas'); await t.wait(900);
      const rows = await t.page.evaluate(() => [...document.querySelectorAll('article.trow')].filter(r => !r.hidden).map(r => Math.round(r.getBoundingClientRect().height)));
      t.ok('se ven 6 salidas, de menos de 110 px cada una (antes ~255)', rows.length === 6 && rows.every(x => x < 110), JSON.stringify(rows));
      t.ok('las anteriores quedan tras «Ver las 3 salidas anteriores»', /Ver las 3 salidas anteriores/.test(await t.T('.trmore') || ''));
      t.ok('cada fila dice fecha, salida y peces', await t.page.evaluate(() => { const r = document.querySelector('article.trow:not([hidden])'); return !!r.querySelector('.dchip') && !!r.querySelector('.trm h3'); }));
      await scrollTo(t, '.mhead'); await t.wait(400); await t.shot(SHP + 'ui-salidas');
      await t.tap('[data-a="ui-trall"]', 700);
      t.ok('al pulsar se ven todas', (await t.page.evaluate(() => [...document.querySelectorAll('article.trow')].filter(r => !r.hidden).length)) === 9 && (await t.N('.trmore')) === 0);
      t.ok('al tocar una fila se abre la salida', await t.page.evaluate(() => { const o = document.querySelector('article.trow [data-a="trip-open"]'); o.click(); return true; }));
      await t.wait(900);
      t.ok('abre el detalle con pestañas', (await t.N('[data-a="trip-tab"]')) >= 2);
      await t.tapIf('[data-a="trip-back"]', 600);
    });
    await t.case('Capturas: lo justo y el resto plegado', async () => {
      await t.goTab('capturas'); await t.wait(1000);
      const h = await H(t, '#main');
      t.ok('Capturas compacto (menos de 1700 px)', h > 0 && h < 1700, 'h=' + h);
      t.ok('tallas, spots y cebos en filas plegadas con resumen', (await t.N('#main details.uiacc:not([open])')) >= 3);
      t.ok('ranking de especies sigue a la vista', /Ranking de especies/.test(await t.T('#main')));
      await t.shot(SHP + 'ui-capturas');
      await t.page.evaluate(() => document.querySelector('#main details[data-uk="capbait"] > summary').click()); await t.wait(400);
      t.ok('al abrir «Tus cebos» salen las cifras por cebo', /Cangrejo/.test(await t.T('details[data-uk="capbait"] .uib')));
    });
    await t.case('Ficha de especie: resumen corto', async () => {
      await t.page.evaluate(() => { const b = document.createElement('button'); b.setAttribute('data-a', 'sp-open'); b.setAttribute('data-k', 'sargo'); document.body.appendChild(b); b.click(); b.remove(); }); await t.wait(900);
      const h = await H(t, '#sheetbody');
      t.ok('Resumen de la especie en menos de 1600 px (antes ~2500)', h > 0 && h < 1600, 'h=' + h);
      t.ok('detalle plegado: números, cuándo y «para otra como esta»', (await t.N('.spp[data-p="res"] details.uiacc:not([open])')) === 3);
      t.ok('sin bloques duplicados de talla mínima o cebo', (await t.N('#sheetbody > .block.szb')) === 0);
      await t.shot(SHP + 'ui-especie');
      await closeSheet(t);
    });
    await t.case('Ajustes: filas con icono', async () => {
      await t.goTab('hoy'); await t.tap('[data-a="open-settings"]', 800);
      const h = await H(t, '#sheetbody');
      t.ok('Ajustes en menos de 1000 px (antes ~1700)', h > 0 && h < 1000, 'h=' + h);
      t.ok('5 filas: completar, respuestas, copia, descripciones e instalar app', (await t.N('#sheetbody > details.uiacc')) === 5);
      t.ok('copia de seguridad plegada hasta que la abres', (await t.N('#sheetbody > details[data-uk="set-ex"]:not([open])')) === 1);
      await t.shot(SHP + 'ui-ajustes');
      await t.page.evaluate(() => document.querySelector('[data-uk="set-ex"] > summary').click()); await t.wait(400);
      t.ok('al abrir salen los botones de descarga', (await t.N('[data-uk="set-ex"] .uib button')) >= 3);
      await closeSheet(t);
    });
    await t.case('Nueva salida y formulario', async () => {
      await t.goTab('salidas'); await t.tap('[data-a="new-trip"]', 700);
      const lh = await t.page.evaluate(() => Math.round(document.querySelector('.lvch').getBoundingClientRect().height));
      t.ok('las dos opciones son tarjetas compactas (menos de 360 px; antes ~850)', lh > 0 && lh < 360, 'h=' + lh);
      await t.shot(SHP + 'ui-nueva-salida');
      await t.tap('[data-a="lv-past"]', 900);
      const h = await H(t, '#sheetbody');
      t.ok('paso 1 del formulario en menos de 1700 px (antes ~2000)', h > 0 && h < 1700, 'h=' + h);
      t.ok('lo opcional va en filas: cebos, descripción y Windy', (await t.N('#stp details.uiacc')) >= 3);
      t.ok('fecha y modalidad siguen a la vista', /Fecha/i.test(await t.T('#stp')) && /Modalidad/i.test(await t.T('#stp')));
      await t.shot(SHP + 'ui-formulario');
      await t.page.evaluate(() => document.querySelector('[data-uk="fm-cebo"] > summary').click()); await t.wait(400);
      t.ok('al abrir los cebos salen para marcar', (await t.N('[data-uk="fm-cebo"] .bchip')) >= 3);
      t.ok('sin desbordes horizontales', (await t.overflow()).length === 0);
      await closeSheet(t);
    });
    await t.case('Tarjetas de Salidas: informe y preguntas compactos', async () => {
      await t.page.evaluate(() => { try { localStorage.removeItem('cuaderno-en-skip'); } catch (e) { } });
      await t.reload(); await t.wait(1200); await t.goTab('salidas'); await t.wait(900);
      const enc = await t.page.evaluate(() => { const e = document.querySelector('.enc'); return e ? Math.round(e.getBoundingClientRect().height) : 0; });
      t.ok('«Qué aprendimos» muestra el veredicto, 4 cifras y un solo consejo (menos de 360 px)', enc > 0 && enc < 360 && (await t.N('.enc .entip')) === 1, 'h=' + enc);
      const q = await t.page.evaluate(() => { const o = document.querySelector('.qrcard .qro'); return o ? Math.round(o.getBoundingClientRect().height) : 0; });
      t.ok('las respuestas son chips de una línea', q > 0 && q <= 52, 'h=' + q);
      t.ok('sin desbordes horizontales en Salidas', (await t.overflow()).length === 0);
      await t.shot(SHP + 'ui-tarjetas');
    });
    await t.case('Sin desbordes en el resto de pantallas', async () => {
      for (const tab of ['hoy', 'mapa', 'equipo', 'capturas']) { await t.goTab(tab); await t.wait(900); t.ok('sin desbordes horizontales en ' + tab, (await t.overflow()).length === 0, JSON.stringify((await t.overflow()).slice(0, 2))); }
    });
  },
};
