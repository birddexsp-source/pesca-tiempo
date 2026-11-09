/* Preguntas rápidas: durante la salida (una cada vez) y después (tarjeta en Salidas), con voz y texto. */
const SHP = process.env.SHP || '';
module.exports = {
  name: 'Preguntas rápidas',
  async run(t) {
    await t.seed(); await t.goTab('salidas');
    await t.case('Después: tarjeta en Salidas con preguntas de la última salida', async () => {
      const today = new Date().toISOString().slice(0, 10);
      await t.put('trips', 'pq1', { date: today, siteId: 's1', siteName: 'Matxitxako', mode: 'Corcho', companions: [], eventos: [], createdAt: Date.now(), stops: [] });
      await t.wait(900); await t.reload(); await t.wait(1500); await t.goTab('salidas'); await t.wait(600);
      const c = await t.T('.qrcard[data-kind="post"]');
      t.ok('aparece «Cuéntame de tu salida» con las 4 preguntas', /Cuéntame de tu salida/.test(c) && /¿Por qué terminaste\?/.test(c) && /¿Qué cambiarías/.test(c), c);
      await t.shot(SHP + 'preguntas-despues');
      await t.tap('.qrcard[data-kind="post"] [data-q="volver"] [data-v="si"]', 600);
      await t.page.fill('.qrcard[data-kind="post"] textarea[data-qrt="cambiar"]', 'Gamba más dura y lanzar más lejos'); await t.page.keyboard.press('Tab'); await t.wait(800);
      const D = await t.docs('respuestas');
      t.ok('volver=sí y la nota escrita se guardan en esa salida', D.some(x => x.ref === 'pq1' && x.q === 'volver' && x.a === 'si') && D.some(x => x.ref === 'pq1' && x.q === 'cambiar' && /Gamba más dura/.test(x.txt || '')));
      t.ok('lo contestado se marca ✓', (await t.N('.qrcard[data-kind="post"] .qrq.done')) === 2);
      await t.tap('.qrcard[data-kind="post"] [data-a="qr-skipall"]', 600);
      t.ok('«Ahora no» oculta la tarjeta', !(await t.has('.qrcard[data-kind="post"]:not([hidden])')));
    });
    await t.case('En directo: pregunta cuando toca, de un toque y con voz', async () => {
      await t.goTab('salidas'); await t.tap('[data-a="new-trip"]'); await t.tap('[data-a="lv-live"]', 500); await t.tap('[data-a="lv-start"]', 900);
      t.ok('recién empezada no pregunta nada', !(await t.has('#sessbody .qrcard:not([hidden])')));
      const s = (await t.docs('sesiones'))[0];
      await t.put('sesiones', 'activa', Object.assign({}, s, { startedAt: Date.now() - 45 * 60000 }));
      await t.wait(900); await t.reload(); await t.wait(1200); await t.tap('#sessbar .sbt', 600);
      t.ok('a los 45 min sale «Pregunta rápida» con el ritmo', /Pregunta rápida/.test(await t.T('#sessbody')) && /¿Cómo va la pesca\?/.test(await t.T('#sessbody')));
      await t.shot(SHP + 'pregunta-directo');
      await t.tap('#sessbody .qrcard [data-a="qr-a"][data-v="poco"]', 700);
      const r = (await t.docs('respuestas')).find(x => x.q === 'ritmo');
      t.ok('la respuesta se guarda', r && r.a === 'poco' && /^S/.test(r.ref), JSON.stringify(r));
      t.ok('y pasa a la siguiente (cebo, porque no hay capturas)', /¿Cómo te vuelve el cebo\?/.test(await t.T('#sessbody .qrcard')));
      await t.tap('#sessbody .qrcard [data-a="qr-rec"]', 1500); t.ok('grabando', await t.has('#sessbody .qrcard .rdot'));
      await t.tap('#sessbody .qrcard [data-a="qr-rec"]', 1500);
      const r2 = (await t.docs('respuestas')).find(x => x.q === 'cebo');
      t.ok('la nota de voz se guarda ligada a la pregunta', r2 && !!r2.audio, JSON.stringify(r2));
      await t.tap('#sessbody .qrcard [data-a="qr-skip"]', 600);
      t.ok('«Ahora no» pasa a otra', !/¿Cómo te vuelve el cebo\?/.test(await t.T('#sessbody .qrcard')));
    });
    await t.case('Ajustes: lista de respuestas con sitio para el texto de las notas de voz', async () => {
      await t.tap('[data-a="open-settings"]', 700);
      const b = await t.T('#qrblk');
      t.ok('«Mis respuestas rápidas» cuenta lo guardado y las notas sin texto', /Mis respuestas rápidas/.test(b) && /4 guardadas/.test(b) && /1 nota de voz sin texto/.test(b), b);
      await t.page.evaluate(() => { document.getElementById('qrblk').open = true; });
      await t.page.fill('#qrblk textarea[data-qre]', 'El cebo vuelve chupado'); await t.page.keyboard.press('Tab'); await t.wait(800);
      t.ok('el texto de la nota se guarda', (await t.docs('respuestas')).some(x => x.q === 'cebo' && /chupado/.test(x.txt || '')));
      await t.shot(SHP + 'ajustes-respuestas');
    });
  }
};
