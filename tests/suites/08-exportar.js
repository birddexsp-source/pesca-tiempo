/* Copia de seguridad desde Ajustes. */
const fs = require('fs'), path = require('path'), { OUT } = require('../lib/harness');
module.exports = {
  name: 'Exportar copia de seguridad',
  async run(t) {
    await t.seed(); await t.tap('[data-a="open-settings"]', 500);
    await t.case('bloque de exportar visible', async () => { t.ok('botones JSON / JSON+fotos / CSV', (await t.N('#expblk [data-a^="exp-"]')) === 3); });
    await t.case('JSON válido con todos los datos', async () => {
      const [dl] = await Promise.all([t.page.waitForEvent('download'), t.dom('[data-a="exp-json"]')]);
      const p = path.join(OUT, 'export.json'); await dl.saveAs(p); const J = JSON.parse(fs.readFileSync(p, 'utf8'));
      t.eq('app', J.app, 'cuaderno-pesca'); t.ok('docs presentes', J.docs.length > 100);
      const cols = new Set(J.docs.map(d => d.c)); for (const c of ['sites', 'spots', 'trips', 'gearInv']) t.ok('incluye ' + c, cols.has(c));
      t.ok('nombre con fecha', /\d{4}-\d{2}-\d{2}/.test(dl.suggestedFilename()), dl.suggestedFilename());
    });
    await t.case('JSON con fotos', async () => {
      const [dl] = await Promise.all([t.page.waitForEvent('download'), t.dom('[data-a="exp-json-ph"]')]);
      const p = path.join(OUT, 'export-fotos.json'); await dl.saveAs(p); t.ok('tiene sección de fotos', JSON.parse(fs.readFileSync(p, 'utf8')).fotos !== undefined);
    });
    await t.case('CSV con separador ; y BOM', async () => {
      const [dl] = await Promise.all([t.page.waitForEvent('download'), t.dom('[data-a="exp-csv"]')]);
      const p = path.join(OUT, 'export.csv'); await dl.saveAs(p); const b = fs.readFileSync(p);
      t.ok('empieza con BOM UTF-8', b[0] === 0xEF && b[1] === 0xBB && b[2] === 0xBF); t.ok('separa con ;', b.toString('utf8').split('\n')[0].includes(';'));
    });
  }
};
