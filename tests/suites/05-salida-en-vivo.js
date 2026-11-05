/* «Estoy pescando»: montar, capturas, cambios de spot/equipo, cronómetro, terminar. */
module.exports = {
  name: 'Salida en vivo (consola completa)',
  async run(t) {
    await t.seed(); await t.goTab('salidas');
    const sesion = async () => (await t.docs('sesiones'))[0];
    await t.case('cancelar al montar no crea nada', async () => {
      await t.tap('[data-a="new-trip"]'); await t.tap('[data-a="lv-live"]', 500);
      t.ok('pantalla de montar', await t.has('#lvbody'));
      await t.tap('[data-a="close-sheet"]', 300);
      t.eq('sin sesión', (await t.docs('sesiones')).length, 0);
    });
    await t.case('montar: sitio, modalidad, compañero nuevo y equipo', async () => {
      await t.tap('[data-a="new-trip"]'); await t.tap('[data-a="lv-live"]', 500);
      t.ok('sitio de la última salida preseleccionado', (await t.T('.lvsite')).includes('Matxitxako'));
      t.ok('modalidad de la última salida', (await t.page.evaluate(() => [...document.querySelectorAll('[data-a="lv-mode"].on')].map(x => x.dataset.v))).includes('Spinning'));
      await t.tap('[data-a="comp-add"]'); await t.fill('#comp-new', 'Ander'); await t.tap('[data-a="comp-new"]');
      t.ok('Ander añadido a la lista', (await t.T('#compblk')).includes('Ander'));
      t.ok('Ander guardado como compañero', (await t.docs('companeros')).some(c => c.name === 'Ander'));
      await t.tap('[data-a="comp-pick"][data-id="k1"]'); await t.tapIf('[data-a="comp-add"]');
      await t.page.evaluate(() => ['lvcana', 'lvcarrete', 'lvcorcho', 'lvanzuelo'].forEach(k => { const d = document.querySelector('details[data-lk="' + k + '"]'); if (d) { d.open = true; const x = d.querySelector('.utile'); x && x.click(); } })); await t.wait(250);
      t.ok('4 piezas marcadas', (await t.N('.utile.on')) >= 3);
      await t.tap('[data-a="lv-start"]', 800);
      const s = await sesion();
      t.ok('sesión creada', !!s); t.eq('modalidad', s.mode, 'Spinning'); t.eq('2 compañeros', (s.companions || []).length, 2);
      t.eq('un equipo', (s.equipos || []).length, 1); t.ok('equipo actual', !!s.curEq);
      t.ok('consola abierta', await t.has('#sessbody')); t.ok('barra fija visible', await t.has('#sessbar'));
    });
    await t.case('recargar a mitad de salida la conserva', async () => {
      await t.reload();
      t.ok('barra tras recargar', await t.has('#sessbar'));
      await t.tap('#sessbar .sbt', 400); t.ok('consola desde la barra', await t.has('#sessbody'));
    });
    await t.case('captura: cancelar vuelve a la consola, guardar también', async () => {
      await t.tap('[data-a="lv-cap"]', 600); t.ok('hoja de captura', await t.has('#qc-ok'));
      t.ok('pregunta de quién es', (await t.T('#sheetbody')).toUpperCase().includes('QUIÉN'));
      await t.tap('[data-a="close-sheet"]', 500); t.ok('cancelar → consola', await t.has('#sessbody'));
      await t.tap('[data-a="lv-cap"]', 600); await t.tap('[data-a="qc-sp"]', 150); await t.tap('#qc-ok', 900);
      t.ok('guardar → consola', await t.has('#sessbody'));
      const c = (await t.docs('catches'))[0]; t.ok('captura con id de sesión', c && c.sess === 'activa');
      t.ok('con el equipo actual', c && c.items[0].eq === (await sesion()).curEq);
      t.ok('contador sube', (await t.T('.lvhead')).includes('1 tuya'));
    });
    await t.case('captura de un compañero queda a su nombre', async () => {
      await t.tap('[data-a="lv-cap"]', 600); await t.tap('[data-a="qc-who"][data-w="k1"]', 300);
      await t.tap('[data-a="qc-sp"]', 150); await t.tap('#qc-ok', 900);
      const its = [].concat(...(await t.docs('catches')).map(c => c.items));
      t.ok('un ítem con who=k1', its.some(i => i.who === 'k1'));
      t.ok('contador de compañeros', (await t.T('.lvhead')).includes('1 de un compañero'));
    });
    await t.case('cambio de spot: validaciones y guardado con motivo', async () => {
      await t.tap('[data-a="lv-spot"]', 400);
      await t.tap('[data-a="lv-sp-save"]', 300); t.ok('no deja guardar sin elegir spot', /Elige el spot/.test(await t.toast()));
      await t.tap('[data-a="lv-who"][data-id=""]', 150);
      await t.tap('[data-a="lv-sp-sp"][data-id="sp2"]', 150); await t.tap('[data-a="lv-why"][data-v="Mucha ola"]', 150);
      await t.tap('[data-a="lv-sp-save"]', 900);
      t.ok('vuelve a la consola', await t.has('#sessbody'));
      const s = await sesion(); t.eq('mi spot actual', s.where[''].id, 'sp2'); t.ok('compañeros no se movieron', !s.where.k1);
      t.ok('evento con motivo', s.events.some(e => e.type === 'spot' && e.why === 'Mucha ola'));
      await t.tap('[data-a="lv-cap"]', 600); t.ok('la captura propone el spot nuevo por defecto', (await t.page.evaluate(() => (document.querySelector('#qc-spot') || {}).value)) === 'sp2'); await t.tap('[data-a="close-sheet"]', 400);
    });
    await t.case('cambio de equipo: sin cambios avisa; con cambios crea equipo B', async () => {
      await t.tap('[data-a="lv-eq"]', 400); await t.tap('[data-a="lv-eq-save"]', 300);
      t.ok('avisa de que no cambió nada', /No has cambiado nada/.test(await t.toast()));
      await t.page.evaluate(() => { const d = document.querySelector('details[data-lk="lvanzuelo"]'); d.open = true; const x = d.querySelectorAll('.utile'); x[x.length - 1].click(); }); await t.wait(200);
      await t.tap('[data-a="lv-eq-mode"][data-v="Surfcasting"]', 150); await t.tap('[data-a="lv-why"][data-v="No picaban"]', 150);
      await t.tap('[data-a="lv-eq-save"]', 900);
      const s = await sesion(); t.eq('2 equipos', s.equipos.length, 2); t.eq('modalidad nueva', s.mode, 'Surfcasting');
      t.ok('motivo en el equipo B', s.equipos[1].why === 'No picaban'); t.eq('equipo actual = B', s.curEq, s.equipos[1].id);
      t.ok('la consola muestra «Equipo B»', (await t.T('.lvhead')).includes('Equipo B'));
    });
    await t.case('cambio de bajo: marcar qué cambias, fluoro y anzuelo; queda en el registro', async () => {
      await t.tap('[data-a="lv-eq"]', 400);
      t.ok('no hay bloque de bajo hasta marcarlo', !(await t.has('.lvbajo')));
      await t.tap('[data-a="lv-what"][data-v="bajo"]', 200);
      t.ok('aparece el bloque Cambio de bajo', await t.has('.lvbajo'));
      await t.tap('[data-a="lv-bj-f"][data-v="0,20"]', 150);
      await t.fill('#lv-bj-a', 'nº 4 azul'); await t.tap('[data-a="lv-eq-save"]', 900);
      const s = await sesion(); const e = s.events.filter(x => x.type === 'eq').pop();
      t.ok('evento con what=bajo y datos del bajo', e.what && e.what.indexOf('bajo') > -1 && e.bajo && e.bajo.fluoro === '0,20' && e.bajo.anzuelo === 'nº 4 azul', JSON.stringify(e));
      t.eq('3 equipos', s.equipos.length, 3); t.eq('fluoro en el equipo nuevo', s.equipos[2].fluoro, '0,20');
      t.ok('la consola sigue abierta', await t.has('#sessbody'));
    });
    await t.case('la X de una subhoja vuelve a la consola', async () => {
      await t.tap('[data-a="lv-spot"]', 300); await t.tap('[data-a="close-sheet"]', 400); t.ok('consola', await t.has('#sessbody'));
    });
    await t.case('cronómetro por persona: terminó / sigue', async () => {
      await t.tap('[data-a="lv-end"][data-id="k1"]', 300);
      t.ok('Mikel marcado como terminado', (await sesion()).ends.k1 > 0 && /terminó/.test(await t.T('.lvp:nth-of-type(3)') || await t.T('#sessbody')));
      await t.tap('[data-a="lv-end"][data-id="k1"]', 300); t.ok('«Sigue» lo reactiva', !(await sesion()).ends.k1);
      await t.tap('[data-a="lv-end"][data-id="k1"]', 300);
    });
    await t.case('botón atrás del móvil cierra la hoja sin salir de la app', async () => {
      await t.page.goBack(); await t.wait(500);
      t.ok('hoja cerrada', !(await t.has('#sheet:not([hidden])'))); t.ok('seguimos en la app', t.page.url().startsWith('http://localhost'));
      await t.tap('#sessbar .sbt', 400);
    });
    await t.case('terminar pide confirmación y deja la salida guardada al instante', async () => {
      await t.tap('[data-a="sess-finish"]', 200); t.ok('pide «¿Seguro?»', (await t.T('[data-a="sess-finish"]')).includes('Seguro'));
      await t.wait(4300); t.eq('el aviso caduca', await t.T('[data-a="sess-finish"]'), 'Terminar salida');
      await t.tap('[data-a="sess-finish"]', 200); await t.tap('[data-a="sess-finish"]', 2500);
      t.ok('aviso de salida guardada', /Salida guardada/.test(await t.toast() || ''), await t.toast());
      t.ok('sin editor abierto: nada que rellenar', !(await t.has('#sheet [data-a="save-trip"], #sheet [data-a="next-step"]')));
      const tr = (await t.docs('trips')).filter(x => x.id !== 'd1');
      t.eq('salida guardada', tr.length, 1);
      t.ok('con el sitio que elegí al empezar (no el que adivina el GPS)', tr[0].siteName === 'Matxitxako');
      t.ok('con 3 equipos y eventos', tr[0].equipos.length === 3 && tr[0].eventos.length >= 5);
      t.ok('con compañeros', (tr[0].companions || []).length === 2);
      t.eq('la sesión se borra', (await t.docs('sesiones')).length, 0); t.ok('la barra desaparece', !(await t.has('#sessbar')));
      const its = [].concat(...(await t.docs('catches')).filter(c => c.tripId === tr[0].id).map(c => c.items));
      t.ok('las capturas pasaron a la salida', its.length >= 2);
      t.eq('ya no quedan capturas «por ordenar»', (await t.docs('catches')).filter(c => c.quick).length, 0);
      await t.reload();
      await t.page.evaluate(id => { const o = document.querySelector('[data-a="trip-open"][data-id="' + id + '"]'); o && o.click(); const b = document.querySelector('[data-a="edit-trip"][data-id="' + id + '"]'); b && b.click(); }, tr[0].id); await t.wait(700);
      t.ok('se puede abrir para completar en casa', await t.has('#sheet [data-a="next-step"]'));
      for (let i = 0; i < 3; i++) await t.tapIf('[data-a="next-step"]', 450);
      t.ok('registro de la salida en el resumen', await t.has('.lvtl'));
      await t.tap('[data-a="save-trip"]', 1500);
      t.eq('sigue habiendo una sola salida', (await t.docs('trips')).filter(x => x.id !== 'd1').length, 1);
    });
  }
};
