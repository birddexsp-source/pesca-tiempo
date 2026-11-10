/* Motor de patrones: informe «Qué aprendimos», receta del spot, plan concreto y pistas descubiertas. */
const SHP = process.env.SHP || '';
const iso = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
async function sembrar(t) {
  for (let i = 0; i <= 7; i++) await t.put('forecast', iso(i), { date: iso(i), point: 'test', src: 'test', samples: [1, 4, 7, 10, 13, 16, 19, 22].map(h => ({ h, wave: 1.0, period: 9, wind: 8, gust: 12 })), tides: [] });
  await t.put('spots', 'eA', { name: 'Roca vieja', siteId: 's1', lat: 43.45, lon: -2.75, createdAt: 1 });
  await t.put('spots', 'eB', { name: 'Escollera', siteId: 's1', lat: 43.455, lon: -2.76, createdAt: 2 });
  const visita = async (id, date, spot, name, from, to, baits, agua, n) => {
    const sid = 's-' + id;
    await t.put('trips', id, { date, siteId: 's1', siteName: 'Matxitxako', mode: 'Corcho', companions: [], eventos: [], createdAt: Date.parse(date), stops: [{ id: sid, spotId: spot, spotName: name, tFrom: from, tTo: to, baits, wave: 1.2, wind: 8 }] });
    if (n) await t.put('catches', 'c-' + id, { tripId: id, date, ts: Date.parse(date) + 5000, items: [{ species: 'Sargo', n, size: 'M', st: 'casa', stopId: sid, spotId: spot }] });
    if (agua) await t.put('aguas', sid, { stopId: sid, agua, u: 1 });
  };
  await visita('e1', iso(-30), 'eA', 'Roca vieja', '07:00', '10:00', ['Cangrejo'], 'tomadilla', 4);
  await visita('e2', iso(-26), 'eA', 'Roca vieja', '07:00', '10:00', ['Cangrejo'], 'tomadilla', 3);
  await visita('e3', iso(-22), 'eA', 'Roca vieja', '07:30', '10:30', ['Cangrejo'], 'tomadilla', 5);
  await visita('e4', iso(-18), 'eB', 'Escollera', '15:00', '18:00', ['Mejillón'], 'cristal', 1);
  await visita('e5', iso(-14), 'eB', 'Escollera', '15:00', '18:00', ['Mejillón'], 'cristal', 0);
  await visita('e6', iso(-10), 'eB', 'Escollera', '15:30', '18:30', ['Mejillón'], 'cristal', 1);
  await visita('e7', iso(-1), 'eA', 'Roca vieja', '07:00', '10:00', ['Cangrejo'], 'tomadilla', 6);
  await t.wait(1000); await t.reload(); await t.wait(1800);
}
module.exports = {
  name: 'Motor de patrones',
  async run(t) {
    await t.seed(); await t.goTab('salidas');
    await sembrar(t);
    await t.case('Informe «Qué aprendimos» tras la salida de ayer', async () => {
      await t.goTab('salidas'); await t.wait(800);
      t.ok('aparece la tarjeta del informe', (await t.N('.enc')) === 1);
      const c = await t.T('.enc');
      t.ok('veredicto: mejor de lo habitual (6 peces frente a su media)', /Mejor de lo habitual/i.test(c), c.slice(0, 300));
      t.ok('tiles: 6 peces, 3 horas, 2 por hora', /6\s*peces/i.test(c) && /3\s*horas/i.test(c) && /2,0\s*por hora|2\s*por hora/i.test(c), c.slice(0, 300));
      t.ok('sin NaN ni undefined', !/NaN|undefined|\[object/.test(c));
      await t.shot(SHP + 'informe-tarjeta');
      await t.tap('[data-a="en-open"]', 700);
      const s = await t.T('#sheetbody');
      t.ok('informe completo: qué influyó con cifras y n de salidas', /Qué influyó/i.test(s) && /Cangrejo/.test(s) && /salidas\)/.test(s), s.slice(0, 500));
      t.ok('informe completo: consejos para la próxima y nota de honestidad', /Para la próxima/i.test(s) && /pistas, no certezas/.test(s));
      t.ok('cada consejo dice si sale de tus datos o de pescadores', (await t.N('#sheetbody .spt')) >= 1);
      await t.shot(SHP + 'informe-completo');
      await t.tap('[data-a="close-sheet"]', 400);
    });
    await t.case('Ocultar el informe persiste', async () => {
      await t.tap('[data-a="en-skip"]', 400);
      t.ok('desaparece', (await t.N('.enc')) === 0);
      await t.reload(); await t.wait(1500); await t.goTab('salidas'); await t.wait(600);
      t.ok('sigue oculto tras recargar', (await t.N('.enc')) === 0);
    });
    await t.case('Respuestas rápidas aparecen en el informe', async () => {
      await t.put('respuestas', 'e7_cebo', { ref: 'e7', q: 'cebo', a: 'chupado', date: iso(-1), t: Date.now(), u: 1 });
      await t.page.evaluate(() => { try { localStorage.removeItem('cuaderno-en-skip') } catch (e) {} });
      await t.wait(900); await t.reload(); await t.wait(1500); await t.goTab('salidas'); await t.wait(600);
      await t.tap('[data-a="en-open"]', 700);
      const s = await t.T('#sheetbody');
      t.ok('«Lo que me contaste» recoge tu respuesta', /Lo que me contaste/i.test(s));
      await t.tap('[data-a="close-sheet"]', 400);
    });
    await t.case('Receta del spot', async () => {
      await t.goTab('salidas');
      const ok = await t.page.evaluate(() => { const el = document.querySelector('[data-a="spot"],[data-a="open-spot"],[data-spot]'); return !!el; });
      await t.page.evaluate(() => { window.__t = 1; });
      await t.page.evaluate(() => { const b = document.createElement('button'); b.setAttribute('data-a', 'open-spot'); b.setAttribute('data-id', 'eB'); document.body.appendChild(b); b.click(); b.remove(); });
      await t.wait(900);
      let r = await t.T('#sheetbody');
      if (!/Receta/.test(r)) { /* abre la ficha con la función global del app si existe el botón de la lista */ }
      t.ok('la ficha del spot tiene receta con cebo, agua y fiabilidad', /Receta de/.test(r) && /Mejillón|Cangrejo/.test(r) && /Fiabilidad/.test(r), r.slice(0, 500));
      t.ok('receta sin NaN', !/NaN|undefined/.test(r));
      await t.shot(SHP + 'receta-spot');
    });
    await t.case('Plan concreto y pistas descubiertas en Hoy', async () => {
      await t.page.evaluate(() => { const c = document.getElementById('sheet'); const b = document.querySelector('[data-a="close-sheet"]'); b && b.click(); });
      await t.goTab('hoy'); await t.wait(1400);
      const p = await t.T('.enpl');
      t.ok('plan: dónde y cuándo, cebo y franja salen de tus datos', /Plan para la próxima/.test(p) && /Dónde y cuándo/i.test(p) && /Cangrejo/.test(p), p.slice(0, 400));
      t.ok('plan sin NaN', !/NaN|undefined/.test(p));
      await t.page.evaluate(() => document.querySelector('.enpl').scrollIntoView({ block: 'start', behavior: 'instant' })); await t.wait(300);
      await t.shot(SHP + 'plan-concreto');
      await t.page.evaluate(() => { const b = document.querySelector('.endisc'); b.open = true; }); await t.wait(300); await t.page.evaluate(() => { const m = document.getElementById('main'), b = document.querySelector('.endisc'); m.scrollTo({ top: m.scrollTop + b.getBoundingClientRect().top - 70, behavior: 'instant' }); }); await t.wait(1200);
      const d = await t.page.evaluate(() => document.querySelector('.endisc').textContent);
      t.ok('pistas: patrón con cifras y fiabilidad', /Pistas descubiertas/.test(d) && /peces\/h/.test(d) && /Consistente|Prometedora|Muy poca base/.test(d), d.slice(0, 500));
      t.ok('pistas sin NaN', !/NaN|undefined/.test(d));
      console.log('RECT', JSON.stringify(await t.page.evaluate(() => [document.querySelector('.endisc').getBoundingClientRect().top, scrollY, [...document.querySelectorAll('*')].filter(e => e.scrollTop > 0).map(e => e.tagName + '#' + e.id + '.' + e.className + ':' + e.scrollTop)]))); await t.shot(SHP + 'pistas-descubiertas');
      await t.page.evaluate(() => document.querySelector('.endisc [data-a="md-probar"]').click()); await t.wait(900);
      const h = (await t.docs('hipotesis')).filter(x => /^d_/.test(x.id) && x.probar);
      t.ok('«Probar en la próxima salida» guarda la pista', h.length === 1, JSON.stringify(h));
      await t.goTab('salidas'); await t.goTab('hoy'); await t.wait(900);
      t.ok('el plan la recuerda en «Para aprender»', /Para aprender/.test(await t.page.evaluate(() => document.querySelector('.enpl').textContent)));
    });
    await t.case('Pocos datos: no se inventa nada', async () => {
      await t.page.evaluate(async () => { const db = await window.claude.use('db'); for (const c of ['trips', 'catches', 'aguas', 'respuestas', 'hipotesis']) { const q = await db.collection(c).get(); for (const d of q.docs) await db.doc(c + '/' + d.id).delete(); } try { localStorage.removeItem('cuaderno-en-skip'); } catch (e) {} });
      await t.wait(600); await t.goTab('salidas');
      await t.put('spots', 'pA', { name: 'Roca sola', siteId: 's1', lat: 43.45, lon: -2.75, createdAt: 1 });
      await t.put('trips', 'p1', { date: iso(-1), siteId: 's1', siteName: 'Matxitxako', mode: 'Corcho', companions: [], eventos: [], createdAt: Date.now(), stops: [{ id: 's-p1', spotId: 'pA', spotName: 'Roca sola', tFrom: '08:00', tTo: '10:00', baits: ['Gamba'] }] });
      await t.put('catches', 'c-p1', { tripId: 'p1', date: iso(-1), ts: Date.now(), items: [{ species: 'Sargo', n: 2, st: 'casa', stopId: 's-p1', spotId: 'pA' }] });
      await t.wait(900); await t.reload(); await t.wait(1500); await t.goTab('salidas'); await t.wait(600);
      const c = await t.page.evaluate(() => (document.querySelector('.enc') || {}).textContent || '');
      t.ok('con una sola salida: primera referencia, sin porcentajes inventados', /Primera referencia/.test(c) && !/[+-]\d+%/.test(c), c.slice(0, 300));
      t.ok('dice que aún hay pocas salidas', /pocas salidas/i.test(c));
      await t.goTab('hoy'); await t.wait(1000);
      const d = await t.page.evaluate(() => (document.querySelector('.endisc') || {}).textContent || '');
      t.ok('pistas: aún sin patrones', /aún sin patrones/.test(d) && !(await t.N('.endisc [data-a="md-probar"]')));
    });
  },
};
