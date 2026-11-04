/* Comprobaciones sin navegador: archivos, semillas, service worker, funciones duplicadas. */
const fs = require('fs'), path = require('path');
const { APP } = require('../lib/harness');
// Duplicados que ya existían antes de las pruebas y son conocidos (el último gana). Si aparece uno NUEVO, falla.
const DUP_CONOCIDOS = ['histChips', 'renderHoy', 'updateCarousel', 'drawLayer', 'modeChips'];
module.exports = {
  name: 'Estático: archivos, semillas y service worker', static: true,
  async run(t) {
    const html = fs.readFileSync(path.join(APP, 'index.html'), 'utf8');
    const sw = fs.readFileSync(path.join(APP, 'sw.js'), 'utf8');
    await t.case('index.html y archivos base existen', async () => {
      ['index.html', 'sw.js', 'shim.js', 'leaflet.min.js', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png'].forEach(f => t.ok('existe ' + f, fs.existsSync(path.join(APP, f))));
      t.ok('el HTML no está vacío (>400 KB)', html.length > 400000, html.length + ' bytes');
    });
    await t.case('manifest.webmanifest es JSON válido', async () => {
      const m = JSON.parse(fs.readFileSync(path.join(APP, 'manifest.webmanifest'), 'utf8'));
      t.ok('tiene nombre e iconos', !!m.name && Array.isArray(m.icons) && m.icons.length > 0);
    });
    await t.case('funciones globales sin duplicar (un parche pisando a otro)', async () => {
      const cnt = {}; for (const m of html.matchAll(/^\s*function\s+([A-Za-z0-9_$]+)\s*\(/gm)) cnt[m[1]] = (cnt[m[1]] || 0) + 1;
      const dup = Object.keys(cnt).filter(k => cnt[k] > 1 && !DUP_CONOCIDOS.includes(k));
      t.ok('ninguna función nueva duplicada', dup.length === 0, dup.join(', '));
    });
    await t.case('semillas de equipo: JSON válido y fotos existentes', async () => {
      const files = fs.readdirSync(APP).filter(f => /^gear-seed\d*\.json$/.test(f));
      t.ok('hay semillas', files.length >= 8, files.length + ' archivos');
      let items = 0, missing = [];
      for (const f of files) {
        const d = JSON.parse(fs.readFileSync(path.join(APP, f), 'utf8')); const L = Array.isArray(d) ? d : (d.items || d.patch || []);
        (Array.isArray(L) ? L : []).forEach(it => { items++; if (it && it.foto && !fs.existsSync(path.join(APP, it.foto))) missing.push(f + ':' + it.foto); });
      }
      t.ok('todas las fotos de las semillas existen', missing.length === 0, missing.slice(0, 4).join(', '));
      t.ok('semillas con contenido', items > 100, items + ' elementos');
    });
    await t.case('todas las imágenes referenciadas en el código existen', async () => {
      const refs = [...new Set([...html.matchAll(/img\/[A-Za-z0-9_\-./]+\.(?:webp|png|jpg|svg)/g)].map(m => m[0]))];
      const miss = refs.filter(r => !fs.existsSync(path.join(APP, r)));
      t.ok('sin imágenes rotas (' + refs.length + ' referencias)', miss.length === 0, miss.slice(0, 5).join(', '));
    });
    await t.case('service worker: precarga y versión', async () => {
      const v = /const V='(cuaderno-v\d+)'/.exec(sw);
      t.ok('tiene versión de caché', !!v, v && v[1]);
      const shell = [...sw.slice(sw.indexOf('SHELL=[') + 7, sw.indexOf(']', sw.indexOf('SHELL=['))).matchAll(/'([^']+)'/g)].map(m => m[1]).filter(f => f !== './');
      const miss = shell.filter(f => !fs.existsSync(path.join(APP, f)));
      t.ok('todo lo del SHELL existe (' + shell.length + ')', miss.length === 0, miss.join(', '));
      const gear = [...sw.matchAll(/"(img\/gear\/[^"]+)"/g)].map(m => m[1]);
      const miss2 = gear.filter(f => !fs.existsSync(path.join(APP, f)));
      t.ok('precarga de fotos de equipo existe (' + gear.length + ')', gear.length > 50 && miss2.length === 0, miss2.slice(0, 3).join(', '));
    });
    await t.case('sin secretos en el código publicado', async () => {
      t.ok('no hay tokens de GitHub', !/(ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})/.test(html));
    });
  }
};
