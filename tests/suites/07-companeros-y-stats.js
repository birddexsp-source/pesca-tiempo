/* Compañeros (tú vs ellos) y Rendimiento por equipo. Los datos se crean directamente por la base. */
module.exports = {
  name: 'Compañeros y estadísticas por equipo',
  async run(t) {
    await t.seed();
    const cana = (await t.docs('gearInv')).find(x => x.kind === 'cana'), cana2 = (await t.docs('gearInv')).filter(x => x.kind === 'cana')[1];
    await t.put('trips', 'ta', { date: '2026-11-01', mode: 'Spinning', siteId: 's1', siteName: 'Matxitxako', companions: [{ id: 'k1', name: 'Mikel', mode: 'Spinning' }],
      stops: [{ id: 'st1', spotId: 'sp1', name: 'Punta del faro' }],
      equipos: [{ id: 'eA', used: [{ id: cana.id, kind: 'cana', name: cana.name }] }, { id: 'eB', used: [{ id: cana2.id, kind: 'cana', name: cana2.name }] }] });
    await t.put('catches', 'ca', { tripId: 'ta', date: '2026-11-01', siteName: 'Matxitxako', photos: [], notes: '', items: [
      { species: 'Lubina', n: 2, st: 'casa', stopId: 'st1', eq: 'eA' }, { species: 'Sargo', n: 3, st: 'casa', stopId: 'st1', eq: 'eB' },
      { species: 'Lubina', n: 1, st: 'casa', stopId: 'st1', who: 'k1' }, { species: 'Dorada', n: 4, st: 'lib', stopId: 'st1', who: 'k1' }, { species: 'Sargo', n: 1, st: 'esc', stopId: 'st1', eq: 'eA' }] });
    await t.wait(700);
    await t.case('Compañeros: lista con totales y detalle', async () => {
      await t.goTab('salidas'); await t.tap('[data-a="open-comps"]', 500);
      const txt = await t.T('#sheetbody'); t.ok('muestra a Mikel', txt.includes('Mikel'));
      await t.tap('[data-a="cv-open"][data-id="k1"]', 400);
      const d = await t.T('#sheetbody'); t.ok('detalle con especies', /Lubina/.test(d) && /Dorada/.test(d), d.slice(0, 120));
      t.ok('barra tú vs compañero', await t.has('.cvbars, .cvBar, [class*="cvbar"]'));
      t.ok('no desborda', (await t.overflow()).length === 0);
      await t.tap('[data-a="cv-back"]', 300);
    });
    await t.case('Compañeros: añadir uno nuevo desde la pantalla', async () => {
      await t.fill('#cv-name', 'Unai'); await t.tap('[data-a="cv-new"]', 500);
      t.ok('queda guardado', (await t.docs('companeros')).some(c => c.name === 'Unai'));
      await t.tap('[data-a="close-sheet"]', 300);
    });
    await t.case('Rendimiento por equipo: reparto de capturas', async () => {
      await t.goTab('equipo'); await t.tapIf('[data-a="eqp-home"]'); await t.tap('[data-a="eqp-stats"]', 500);
      const rows = await t.page.evaluate(() => [...document.querySelectorAll('.eqrow')].map(x => x.innerText.replace(/\s+/g, ' ')));
      t.ok('hay filas de equipo', rows.length >= 2, rows.length + '');
      t.ok('se cuentan las capturas de cada caña (solo las mías)', rows.some(r => /\b3\b/.test(r)) && rows.some(r => /\b2\b/.test(r)), rows.slice(0, 3).join(' | '));
      await t.tapIf('[data-a="st-kind"][data-k="corcho"]', 300);
      await t.tapIf('[data-a="st-kind"][data-k="cana"]', 300);
    });
    await t.case('filtros de condiciones y reinicio', async () => {
      await t.page.selectOption('select[data-f="species"]', 'Lubina'); await t.wait(300);
      const r1 = await t.page.evaluate(() => [...document.querySelectorAll('.eqrow')].map(x => x.innerText.replace(/\s+/g, ' ')));
      t.ok('filtrar por Lubina deja solo esas', r1.length >= 1 && r1.every(r => !/Sargo/.test(r)));
      await t.tap('[data-a="st-reset"]', 300);
      const r2 = await t.N('.eqrow'); t.ok('reiniciar vuelve a todas', r2 >= r1.length);
    });
    await t.case('ficha de equipo con «Con este equipo»', async () => {
      await t.tap('.eqrow', 400); t.ok('sección de estadísticas en la ficha', await t.has('.sbk'));
    });
  }
};
