/* Hipótesis de Jon para mucha mar a corcho: en la Libretilla, en el Plan y en directo. */
const SHP = process.env.SHP || '';
const iso = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
async function sembrar(t, wave) {
  for (let i = 0; i <= 7; i++) await t.put('forecast', iso(i), { date: iso(i), point: 'test', src: 'test', samples: [1, 4, 7, 10, 13, 16, 19, 22].map(h => ({ h, wave, period: 9, wind: 8, gust: 12 })), tides: [] });
  await t.put('spots', 'lA', { name: 'Roca grande', siteId: 's1', lat: 43.45, lon: -2.75, createdAt: 1 });
  const visita = async (id, date, w, fish) => {
    const sid = 's-' + id;
    await t.put('trips', id, { date, siteId: 's1', siteName: 'Matxitxako', mode: 'Corcho', companions: [], eventos: [], createdAt: Date.parse(date), stops: [{ id: sid, spotId: 'lA', spotName: 'Roca grande', tFrom: '08:00', tTo: '11:00', baits: ['Cangrejo'], wave: w, wind: 8, waveV: 'ok', windV: 'ok' }] });
    if (fish) await t.put('catches', 'c-' + id, { tripId: id, date, ts: Date.parse(date) + 5000, items: [{ species: 'Sargo', n: fish, size: 'M', st: 'casa', stopId: sid, spotId: 'lA' }] });
  };
  await visita('m1', iso(-20), 1.7, 3); await visita('m2', iso(-14), 1.8, 4); await visita('m3', iso(-8), 1.6, 2);
  await t.wait(1000); await t.reload(); await t.wait(1800);
}
module.exports = {
  name: 'Hipótesis de mucha mar a corcho',
  async run(t) {
    await t.seed(); await t.goTab('salidas');
    await sembrar(t, 1.8);
    await t.case('Libretilla: sección «Hipótesis tuyas» con las 4 ideas, marcadas por probar y sin enlace falso', async () => {
      await t.goTab('hoy'); await t.wait(1400);
      await t.page.evaluate(() => { document.querySelector('details[data-uk="lib"]').open = true; }); await t.wait(400);
      const x = await t.page.evaluate(() => { const d = document.querySelector('details[data-uk="lib"]'); const sec = d.textContent.replace(/\s+/g, ' '); return { txt: sec, hrefs: Array.from(new Set(Array.from(d.querySelectorAll('a[href]')).map(a => a.href))), sub: d.querySelector('summary').textContent.replace(/\s+/g, ' ') }; });
      t.ok('el desplegable cuenta las hipótesis tuyas aparte', /ideas con fuentes · 4 hipótesis tuyas/.test(x.sub), x.sub);
      t.ok('hay sección «Hipótesis tuyas · 4»', /Hipótesis tuyas · 4/.test(x.txt));
      t.ok('trae menos plomo, masilla, bola de verdel y boya tensa', /menos plomo/i.test(x.txt) && /Masilla o cebo pesado, sin plomo/.test(x.txt) && /Bola con engodo de verdel en vez de sardina/.test(x.txt) && /boya tensa o al plomín/.test(x.txt));
      t.ok('con los números que dijiste: 10 g → 5 g y 1,5–2,5 m', /si el corcho aguanta 10 g, montar 5 g/.test(x.txt) && /1,5–2,5 m/.test(x.txt));
      t.ok('dice que es idea tuya, sin fuente contrastada', /Hipótesis tuya · por probar/.test(x.txt) && /Idea tuya, de vídeos de pesca/.test(x.txt));
      t.ok('las fuentes con enlace siguen siendo 8 (la idea tuya no inventa enlace)', x.hrefs.length === 8 && x.hrefs.every(h => /^https:\/\//.test(h)), JSON.stringify(x.hrefs));
      t.ok('sale un ajuste nuevo «Mucha mar a corcho» entre los de situación', /Mucha mar a corcho \(≈1,5–2,5 m\)/.test(x.txt));
      t.ok('sin NaN ni undefined', !/NaN|undefined|\[object/.test(x.txt));
      await t.page.evaluate(() => { const h = Array.from(document.querySelectorAll('details[data-uk="lib"] h4')).find(e => /Hipótesis tuyas/.test(e.textContent)); const m = document.getElementById('main'); if (h && m) m.scrollTo({ top: m.scrollTop + h.getBoundingClientRect().top - 90, behavior: 'instant' }); const d = h && h.nextElementSibling && h.nextElementSibling.nextElementSibling; d && (d.open = true); }); await t.wait(500);
      await t.shot(SHP + 'hipotesis-mar');
      await t.page.evaluate(() => { const b = document.querySelector('details[data-uk="lib"] [data-a="md-probar"][data-id="l_h1"]'); b.closest('details').open = true; b.click(); }); await t.wait(700);
      t.ok('«Probar en la próxima salida» guarda la hipótesis', (await t.docs('hipotesis')).some(h => h.id === 'l_h1' && h.probar), JSON.stringify(await t.docs('hipotesis')));
    });
    await t.case('En el Plan, con mucha mar prevista, avisa de la a10 para la próxima salida', async () => {
      const x = await t.page.evaluate(() => { const d = document.querySelector('details[data-uk="lib"]'); return d.textContent.replace(/\s+/g, ' ').split('Qué cambiar según la situación')[0]; });
      t.ok('«Para tu próxima salida» incluye «Mucha mar a corcho»', /Para tu próxima salida/.test(x) && /Mucha mar a corcho/.test(x), x.slice(0, 400));
    });
    await t.case('En directo a corcho con 1,8 m: sugiere el ajuste y recuerda la hipótesis que vas a probar', async () => {
      await t.goTab('salidas'); await t.tap('[data-a="new-trip"]'); await t.tap('[data-a="lv-live"]', 500); await t.tap('[data-a="lv-start"]', 900);
      const b = await t.page.evaluate(() => (document.querySelector('.lbn') || {}).textContent || '');
      t.ok('«Libretilla · qué probar ahora» incluye «Mucha mar a corcho»', /Libretilla · qué probar ahora/.test(b) && /Mucha mar a corcho/.test(b), b.slice(0, 300));
      t.ok('y «Hoy contrastas» recuerda lo de menos plomo', /Hoy contrastas/.test(b) && /menos plomo/i.test(b));
      await t.page.evaluate(() => { const sh = document.getElementById('sheetbody'); if (sh) sh.scrollTop = 300; }); await t.wait(300);
      await t.shot(SHP + 'hipotesis-directo');
    });
  },
};
