/* La app arranca, las pestañas funcionan y no hay errores de JS. */
module.exports = {
  name: 'Arranque y navegación',
  async run(t) {
    await t.case('carga con datos de equipo y sin errores', async () => {
      const inv = await t.docs('gearInv');
      t.ok('inventario sembrado (≥100 cosas)', inv.length >= 100, inv.length + '');
      t.ok('hay barra de pestañas', await t.has('.tabbar'));
      t.ok('cabecera con botón de captura rápida', await t.has('[data-a="quick-cap"]'));
    });
    await t.case('las 5 pestañas abren y muestran algo', async () => {
      for (const [id, txt] of [['hoy', ''], ['mapa', ''], ['salidas', ''], ['equipo', 'Mi equipo'], ['capturas', '']]) {
        await t.goTab(id); const h = await t.T('main');
        t.ok('pestaña ' + id + ' tiene contenido', !!h && h.length > 5, (h || '').slice(0, 40));
        if (txt) t.ok('pestaña ' + id + ' dice «' + txt + '»', (h || '').includes(txt));
      }
    });
    await t.case('el Plan muestra sol sin horas inválidas', async () => {
      await t.goTab('hoy'); await t.wait(500);
      const txt = await t.T('main');
      t.ok('sin «NaN» ni «Invalid»', !/NaN|Invalid/.test(txt || ''), (txt || '').slice(0, 80));
    });
    await t.case('ajustes se abre y se cierra', async () => {
      await t.tap('[data-a="open-settings"]', 500);
      t.ok('hoja de ajustes visible', await t.has('#sheet:not([hidden])'));
      await t.tap('[data-a="close-sheet"]'); t.ok('se cierra', !(await t.has('#sheet:not([hidden])')));
    });
    await t.case('recargar mantiene los datos', async () => {
      await t.put('sites', 'x1', { name: 'Sitio de prueba', lat: 43.4, lon: -2.7, desc: '', createdAt: 1, status: 'activo' });
      await t.reload();
      t.ok('el sitio sigue ahí tras recargar', (await t.docs('sites')).some(s => s.id === 'x1'));
    });
  }
};
