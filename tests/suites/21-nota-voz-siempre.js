/* Nota de voz en cualquier momento de la salida en directo, sin tener que marcar cambio de spot o de equipo. */
const SHP = process.env.SHP || '';
module.exports = {
  name: 'Nota de voz en cualquier momento',
  async run(t) {
    await t.seed(); await t.goTab('salidas');
    await t.tap('[data-a="new-trip"]'); await t.tap('[data-a="lv-live"]', 500); await t.tap('[data-a="lv-start"]', 900);
    await t.case('Botón grande de voz en la consola: un toque graba, otro guarda', async () => {
      t.ok('la consola tiene «Nota de voz» arriba del todo', await t.page.evaluate(() => { const b = document.querySelector('#sessbody .vqbig'); return !!b && /Nota de voz/.test(b.textContent) && b === document.querySelector('#sessbody').querySelector('[data-a]'); }));
      await t.tap('#sessbody [data-a="vq-rec"]', 1500);
      t.ok('graba: se pone rojo y marca el tiempo', await t.has('#sessbody .vqbig.on') && /Grabando/.test(await t.T('#sessbody .vqbig')));
      t.ok('y la barra de la salida también lo muestra', await t.has('#sessbar .vqb.on'));
      await t.tap('#sessbody [data-a="vq-rec"]', 1500);
      const ev = ((await t.docs('sesiones'))[0].events || []).filter(e => e.type === 'note' && e.audio);
      t.eq('queda una nota con audio y hora en el registro', ev.length, 1);
      t.ok('con la hora de cuando empezaste a hablar', ev[0] && Math.abs(ev[0].t - Date.now()) < 20000);
      t.ok('se ve en el registro de la salida', /🎙 Nota de voz/.test(await t.T('#sessbody')) && (await t.N('#sessbody .lvtl .qcrow')) >= 1);
      await t.shot(SHP + 'voz-consola');
    });
    await t.case('Desde la barra, en cualquier pestaña y sin abrir nada', async () => {
      await t.page.evaluate(() => { const b = document.querySelector('#sheet [data-a="close-sheet"]'); b && b.click(); }); await t.wait(400);
      await t.goTab('capturas'); await t.wait(500);
      t.ok('la barra tiene el micro en Capturas', await t.has('#sessbar .vqb'));
      await t.tap('#sessbar .vqb', 1500);
      t.ok('graba desde la barra', await t.has('#sessbar .vqb.on'));
      await t.tap('#sessbar .vqb', 1500);
      const ev = ((await t.docs('sesiones'))[0].events || []).filter(e => e.type === 'note' && e.audio);
      t.eq('segunda nota guardada', ev.length, 2);
      t.ok('el micro vuelve a su estado normal', !(await t.has('#sessbar .vqb.on')));
      await t.goTab('hoy'); await t.wait(500);
      t.ok('y también está en el Plan', await t.has('#sessbar .vqb'));
    });
  },
};
