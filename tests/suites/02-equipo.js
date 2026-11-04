/* Pestaña Equipo: categorías, fotos, alta/edición de cosas y «Por comprar». */
module.exports = {
  name: 'Equipo: inventario, fotos y por comprar',
  async run(t) {
    await t.case('las categorías existen y tienen elementos', async () => {
      await t.goTab('equipo');
      const txt = await t.T('main');
      for (const c of ['Cañas', 'Carretes', 'Corchos', 'Anzuelos', 'Señuelos', 'Sedales']) t.ok('categoría ' + c, (txt || '').includes(c));
      const inv = await t.docs('gearInv');
      for (const k of ['cana', 'carrete', 'corcho', 'anzuelo', 'senuelo', 'linea']) t.ok('hay «' + k + '» en el inventario', inv.some(x => x.kind === k));
    });
    await t.case('las fotos del equipo cargan de verdad', async () => {
      await t.tap('[data-a="eqp-cat"][data-k="cana"],[data-a="eqp-cat"]', 500);
      await t.wait(1500);
      const r = await t.page.evaluate(() => { const im = [...document.querySelectorAll('img.ivph')]; return { n: im.length, rotas: im.filter(i => i.complete && i.naturalWidth === 0).map(i => i.getAttribute('src')) }; });
      t.ok('hay fotos en la lista', r.n > 0, r.n + '');
      t.ok('ninguna foto rota', r.rotas.length === 0, r.rotas.slice(0, 3).join(', '));
    });
    await t.case('abrir una ficha y volver', async () => {
      await t.tap('[data-a="eqp-open"]', 400);
      t.ok('se ve el detalle', (await t.T('#eqpane')).length > 20);
      await t.tapIf('[data-a="eqp-home"]');
    });
    await t.case('añadir una caña nueva y borrarla', async () => {
      await t.goTab('equipo'); await t.tapIf('[data-a="eqp-home"]');
      await t.tap('[data-a="eqp-cat"][data-k="cana"]', 400);
      await t.tap('[data-a="eqp-new"]', 400);
      const inputs = await t.N('#eqpane input, #sheet input');
      t.ok('formulario con campos', inputs > 0, inputs + '');
      const nm = await t.page.evaluate(() => { const i = document.querySelector('#eqpane input[data-f="name"], #sheet input[data-f="name"], #eqpane input, #sheet input'); return i && (i.getAttribute('data-f') || i.id || i.name); });
      await t.page.evaluate(() => { const i = document.querySelector('#eqpane input[data-f="name"], #sheet input[data-f="name"]') || document.querySelector('#eqpane input, #sheet input'); i.value = 'Caña de prueba TEST'; i.dispatchEvent(new Event('input', { bubbles: true })); i.dispatchEvent(new Event('change', { bubbles: true })); });
      await t.tap('[data-a="eqp-save"]', 600);
      t.ok('se guardó en el inventario', (await t.docs('gearInv')).some(x => x.name === 'Caña de prueba TEST'), nm);
    });
    await t.case('marcar «por comprar», anotar y marcar comprado', async () => {
      await t.goTab('equipo'); await t.tapIf('[data-a="eqp-home"]');
      await t.tap('[data-a="eqp-cat"]', 400); await t.tap('[data-a="eqp-open"]', 400);
      await t.tap('[data-a="eqp-buytog"]', 400);
      t.ok('queda marcado', /quitar/i.test(await t.T('[data-a="eqp-buytog"]')));
      await t.fill('#buynote', '2 más'); await t.page.evaluate(() => document.querySelector('#buynote').dispatchEvent(new Event('change', { bubbles: true }))); await t.wait(300);
      t.ok('persistido con nota', (await t.docs('gearInv')).some(x => x.comprar === true && x.comprarNota === '2 más'));
      await t.tapIf('[data-a="eqp-cat"]', 300); await t.tapIf('[data-a="eqp-home"]', 300); await t.tap('[data-a="eqp-buy"]', 400);
      t.ok('aparece en la lista de compra', (await t.T('#eqpane')).includes('2 más'));
      await t.tap('[data-a="buy-done"]', 400);
      t.ok('comprado lo quita', !(await t.docs('gearInv')).some(x => x.comprar));
      t.ok('lista vacía', /Nada pendiente/.test(await t.T('#eqpane')));
    });
  }
};
