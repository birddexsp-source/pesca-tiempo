/* Notas de voz dentro de los cambios y selector de sitio con mapa. */
module.exports = {
  name: 'Notas de voz y mapa de sitios',
  async run(t) {
    await t.seed(); await t.goTab('salidas');
    await t.case('mapa: elegir un sitio existente', async () => {
      await t.tap('[data-a="new-trip"]'); await t.tap('[data-a="lv-live"]', 500);
      await t.tap('[data-a="lv-map"]', 900);
      t.ok('mapa abierto con pines', (await t.N('.leaflet-marker-icon')) >= 2);
      t.ok('barra inferior pide elegir o muestra el actual', (await t.T('#pkbar')).length > 5);
      await t.tap('[data-a="lm-ok"]', 400); t.ok('vuelve al montaje', await t.has('#lvbody'));
    });
    await t.case('mapa: crear un sitio nuevo', async () => {
      await t.tap('[data-a="lv-map"]', 900); await t.tap('[data-a="lm-new"]', 400);
      await t.tap('[data-a="lm-create"]', 300); t.ok('exige nombre', /nombre/i.test(await t.toast()));
      await t.fill('#lm-name', 'Playa nueva'); await t.tap('[data-a="lm-create"]', 900);
      const st = (await t.docs('sites')).find(x => x.name === 'Playa nueva');
      t.ok('sitio guardado con coordenadas', st && st.lat != null && st.lon != null && st.status === 'activo');
      t.eq('queda elegido', (await t.T('.lvsite b')), 'Playa nueva');
    });
    await t.case('mapa: cerrar con la X no cambia nada', async () => {
      await t.tap('[data-a="lv-map"]', 900); await t.tap('[data-a="mp-cancel"]', 400);
      t.eq('sigue Playa nueva', (await t.T('.lvsite b')), 'Playa nueva');
      await t.page.evaluate(() => { const b = [...document.querySelectorAll('[data-a="lv-site"]')].find(x => x.textContent === 'Matxitxako'); b && b.click(); }); await t.wait(250);
      t.eq('el chip reciente lo cambia', (await t.T('.lvsite b')), 'Matxitxako');
    });
    await t.case('empezar y grabar una nota de voz dentro de un cambio de spot', async () => {
      await t.tap('[data-a="lv-start"]', 800);
      t.ok('NO hay botón de nota de voz suelto en la consola', !(await t.has('[data-a="lv-voice"]')));
      await t.tap('[data-a="lv-spot"]', 400); await t.tap('[data-a="lv-sp-sp"][data-id="sp1"]', 150); await t.tap('[data-a="lv-why"][data-v="Viento"]', 150);
      t.ok('caja de grabación dentro del cambio', await t.has('.recbox'));
      await t.tap('[data-a="lv-rec"]', 1600); t.ok('grabando', await t.has('.recbox.on'));
      await t.tap('[data-a="lv-rec"]', 900); t.ok('audio listo para escuchar', await t.has('.recbox audio'));
      await t.tap('[data-a="lv-rec-del"]', 200); t.ok('se puede quitar', !(await t.has('.recbox audio')));
      await t.tap('[data-a="lv-rec"]', 1400); await t.tap('[data-a="lv-rec"]', 900);
      await t.tap('[data-a="lv-sp-save"]', 1500);
      const s = (await t.docs('sesiones'))[0]; const ev = s.events.find(e => e.type === 'spot');
      t.ok('el evento lleva audio', ev && !!ev.audio);
      t.ok('se reproduce en el registro', (await t.page.evaluate(() => [...document.querySelectorAll('#sessbody audio')].every(a => a.src.startsWith('blob:') && a.src.length > 10))) && (await t.N('#sessbody audio')) === 1);
    });
    await t.case('el audio sobrevive a recargar', async () => {
      await t.reload(); await t.tap('#sessbar .sbt', 400);
      t.eq('1 audio tras recargar', await t.N('#sessbody audio'), 1);
      t.ok('con fuente válida', await t.page.evaluate(() => document.querySelector('#sessbody audio').src.startsWith('blob:')));
    });
    await t.case('cambio de equipo con audio; en el resumen se oye y no hay descargas', async () => {
      await t.tap('[data-a="lv-eq"]', 400); await t.tap('[data-a="lv-why"][data-v="Rotura"]', 150);
      await t.tap('[data-a="lv-rec"]', 1300); await t.tap('[data-a="lv-rec"]', 800); await t.tap('[data-a="lv-eq-save"]', 1500);
      t.eq('2 audios en el registro', await t.N('#sessbody audio'), 2);
      await t.tap('[data-a="sess-finish"]', 200); await t.tap('[data-a="sess-finish"]', 2500);
      const tid = (await t.docs('trips')).filter(x => x.id !== 'd1')[0].id;
      await t.page.evaluate(id => { const o = document.querySelector('[data-a="trip-open"][data-id="' + id + '"]'); o && o.click(); const b = document.querySelector('[data-a="edit-trip"][data-id="' + id + '"]'); b && b.click(); }, tid); await t.wait(700);
      for (let i = 0; i < 3; i++) await t.tapIf('[data-a="next-step"]', 450);
      t.eq('sin enlaces de descarga', await t.N('.dlbtn'), 0);
      t.eq('los 2 audios se pueden oír en el resumen', await t.N('.lvtl audio'), 2);
      t.ok('sin la frase de «descárgalo y mándamelo»', !/descárgalo/.test(await t.T('.lvtl')));
    });
  }
};
