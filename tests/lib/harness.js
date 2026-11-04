/* Arnés de pruebas del Cuaderno de pesca.
   Arranca un servidor local con docs/cuaderno, abre un Chromium móvil con datos vacíos
   (IndexedDB nuevo por suite) y da helpers cortos para usar la app como una persona. */
const http = require('http'), fs = require('fs'), path = require('path');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright')); }

const ROOT = path.resolve(__dirname, '..', '..');
const APP = path.join(ROOT, 'docs', 'cuaderno');
const OUT = path.join(ROOT, 'tests', 'out');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };

function serve() {
  return new Promise(res => {
    const srv = http.createServer((q, r) => {
      let p = path.join(APP, decodeURIComponent(q.url.split('?')[0]));
      if (p.endsWith(path.sep) || p === APP) p = path.join(p, 'index.html');
      fs.readFile(p, (e, b) => {
        if (e) { r.writeHead(404); r.end(); return; }
        r.writeHead(200, { 'content-type': MIME[path.extname(p)] || 'application/octet-stream' }); r.end(b);
      });
    }).listen(0, () => res({ srv, url: 'http://localhost:' + srv.address().port + '/' }));
  });
}

class T {
  constructor(opts) { this.opts = opts; this.pass = 0; this.fail = 0; this.fails = []; this.errs = []; this.suite = ''; this.n = 0; }
  /* ---------- aserciones ---------- */
  ok(name, cond, detail) {
    if (cond) { this.pass++; if (this.opts.verbose) console.log('   ✓ ' + name); }
    else { this.fail++; this.fails.push(this.suite + ' › ' + name + (detail ? ' (' + detail + ')' : '')); console.log('   ✗ ' + name + (detail ? '  → ' + detail : '')); this._shot = name; }
    return !!cond;
  }
  eq(name, a, b) { return this.ok(name, JSON.stringify(a) === JSON.stringify(b), 'esperado ' + JSON.stringify(b) + ', obtenido ' + JSON.stringify(a)); }
  async case(name, fn) {
    console.log('  · ' + name);
    const before = this.fail;
    try { await fn(); } catch (e) { this.ok(name + ' (no debería lanzar)', false, String(e.message || e).split('\n')[0]); }
    if (this.fail > before && this.page) await this.shot('fallo-' + this.suite + '-' + (++this.n));
    // errores de JS de la página
    if (this.errs.length) { const e = this.errs.splice(0); this.ok('sin errores de JS en «' + name + '»', false, e[0].slice(0, 200)); }
  }
  /* ---------- navegador ---------- */
  async launch(o = {}) {
    this.browser = await chromium.launch({ args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'] });
    this.ctx = await this.browser.newContext({
      viewport: o.viewport || { width: 390, height: 844 }, deviceScaleFactor: 1, acceptDownloads: true,
      geolocation: { latitude: 43.4207, longitude: -2.7253 }, permissions: ['geolocation', 'microphone'], locale: 'es-ES', timezoneId: 'Europe/Madrid'
    });
    this.page = await this.ctx.newPage();
    this.page.on('pageerror', e => this.errs.push(String(e.stack || e).split('\n').slice(0, 3).join(' / ')));
    this.page.on('console', m => { if (m.type() === 'error' && !/tile|404|Failed to load resource|net::ERR/.test(m.text())) this.errs.push('console: ' + m.text()); });
    await this.page.route(/leaflet|tile|fonts|basemaps|arcgis|openstreetmap/, r => r.request().url().startsWith('http://localhost') ? r.continue() : r.abort());
    await this.page.goto(this.opts.url + (o.hash || '#salidas'));
    await this.ready();
  }
  async ready() {
    // espera a que las semillas del equipo estén cargadas
    for (let i = 0; i < 80; i++) { const n = await this.docs('gearInv').then(d => d.length).catch(() => 0); if (n >= 100) break; await this.wait(250); }
    await this.wait(900);
  }
  async close() { try { await this.browser.close(); } catch (e) { } }
  async reload() { await this.page.reload(); await this.ready(); }
  wait(ms) { return this.page ? this.page.waitForTimeout(ms) : new Promise(r => setTimeout(r, ms)); }
  /* ---------- usar la app ---------- */
  async dom(sel) { return this.page.evaluate(s => { const e = document.querySelector(s); if (e) e.click(); return !!e; }, sel); }
  async tap(sel, ms = 300) { let r = await this.dom(sel); for (let i = 0; !r && i < 12; i++) { await this.wait(250); r = await this.dom(sel); } if (!r) throw new Error('no existe ' + sel); await this.wait(ms); return r; }
  async tapIf(sel, ms = 300) { const r = await this.dom(sel); if (r) await this.wait(ms); return r; }
  async fill(sel, v) { await this.page.fill(sel, v); }
  async T(sel) { return this.page.evaluate(s => { const e = document.querySelector(s); return e ? e.innerText.replace(/\s+/g, ' ').trim() : null; }, sel); }
  async N(sel) { return this.page.evaluate(s => document.querySelectorAll(s).length, sel); }
  async has(sel) { return (await this.N(sel)) > 0; }
  async shot(name) { fs.mkdirSync(OUT, { recursive: true }); await this.page.evaluate(() => { const t = document.querySelector('#toast'); if (t) t.innerHTML = ''; }); await this.page.screenshot({ path: path.join(OUT, name + '.png') }); }
  async toast() { return this.T('#toast'); }
  async openAllDetails() { await this.page.evaluate(() => document.querySelectorAll('details').forEach(d => d.open = true)); await this.wait(150); }
  /* ---------- datos ---------- */
  docs(col) { return this.page.evaluate(async c => { const db = await window.claude.use('db'); const s = await db.collection(c).get(); return s.docs.map(d => Object.assign({ id: d.id }, d.data())); }, col); }
  put(col, id, data) { return this.page.evaluate(async ([c, i, d]) => { const db = await window.claude.use('db'); await db.collection(c).doc(i).set(d); }, [col, id, data]); }
  /* Datos de ejemplo comunes: compañero, 2 sitios, 3 spots, 1 salida anterior */
  async seed() {
    await this.put('companeros', 'k1', { name: 'Mikel', createdAt: 1 });
    await this.put('sites', 's1', { name: 'Matxitxako', lat: 43.4559, lon: -2.7525, desc: '', createdAt: 1, status: 'activo' });
    await this.put('sites', 's2', { name: 'Aritzatxu', lat: 43.42, lon: -2.72, desc: '', createdAt: 2, status: 'activo' });
    await this.put('spots', 'sp1', { name: 'Punta del faro', lat: 43.456, lon: -2.752, siteId: 's1' });
    await this.put('spots', 'sp2', { name: 'Cala de abajo', lat: 43.457, lon: -2.754, siteId: 's1' });
    await this.put('spots', 'sp3', { name: 'Rocas del medio', lat: 43.421, lon: -2.721, siteId: 's2' });
    await this.put('trips', 'd1', { date: '2026-10-25', mode: 'Spinning', siteId: 's1', siteName: 'Matxitxako', stops: [], equipos: [] });
    await this.wait(900);
  }
  async goTab(id) { await this.tap('#t-' + id, 350); }
  /* sin desbordes horizontales en lo que se ve */
  async overflow() {
    return this.page.evaluate(() => { const out = []; document.querySelectorAll('#sheet *, #pick *, main *').forEach(e => { const r = e.getBoundingClientRect(); if (r.width > 0 && (r.right > innerWidth + 1 || r.left < -1) && !e.closest('.leaflet-container,.sbt,details:not([open])') && !(function(n){for(n=n.parentElement;n&&n!==document.body;n=n.parentElement){const o=getComputedStyle(n).overflowX;if(o==='auto'||o==='scroll')return true}return false})(e)) out.push((e.className || e.tagName) + ':' + Math.round(r.right)); }); return out.slice(0, 5); });
  }
}

module.exports = { T, serve, launch: null, ROOT, APP, OUT };
