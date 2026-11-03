// Descarga la previsión de oleaje del modelo Euskalmet WAM Costa Vasca (EuskOOS, 1,6 km)
// para cada spot de spots.json y la guarda en docs/data/forecast.json.
// Sin dependencias: Node 18+.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const BASE = 'https://www.euskoos.eus/ncWMS/wms';
const L = 'EuskalmetWAMBasqueCoast/';
const VARS = { hs: 'hs', tp: 'tp', dir: 'sd', ws: 'ws', wd: 'wd' }; // altura (m), periodo pico (s), dirección (°), viento (m/s y °)
const STEP_H = 3, HORIZON_H = 72;
const spots = JSON.parse(readFileSync(new URL('../spots.json', import.meta.url)));

async function q(v, lat, lon, iso) {
  const d = 0.004, lay = L + v;
  const u = `${BASE}?service=WMS&request=GetFeatureInfo&version=1.3.0&layers=${lay}&query_layers=${lay}` +
    `&crs=CRS:84&bbox=${lon - d},${lat - d},${lon + d},${lat + d}&width=101&height=101&i=50&j=50` +
    `&info_format=text/xml&time=${iso}`;
  for (let k = 0; k < 3; k++) {
    try {
      const r = await fetch(u);
      const t = await r.text();
      if (r.status === 400) return null;           // hora fuera del dominio del modelo
      if (!r.ok) throw new Error(r.status);
      const m = t.match(/<value>([^<]+)<\/value>/);
      return m ? Number(m[1]) : null;               // null = celda de tierra
    } catch (e) { await new Promise(r => setTimeout(r, 800 * (k + 1))); }
  }
  return null;
}

// Punto de mar más cercano al spot (el modelo no da valor en puerto/tierra).
async function snap(sp, iso) {
  const c = [];
  for (let i = -8; i <= 8; i++) for (let j = -8; j <= 8; j++)
    c.push([sp.lat + i * 0.005, sp.lon + j * 0.005, Math.hypot(i * 0.005 * 111, j * 0.005 * 80)]);
  c.sort((a, b) => a[2] - b[2]);
  for (const [la, lo, km] of c) {
    const v = await q('hs', la, lo, iso);
    if (v != null) return { lat: +la.toFixed(4), lon: +lo.toFixed(4), km: +km.toFixed(1) };
  }
  return null;
}

const t0 = new Date(); t0.setUTCMinutes(0, 0, 0);
t0.setUTCHours(Math.floor(t0.getUTCHours() / STEP_H) * STEP_H);
const times = []; for (let h = 0; h <= HORIZON_H; h += STEP_H) times.push(new Date(t0.getTime() + h * 3600e3).toISOString());

const out = { updated: new Date().toISOString(), source: 'EuskOOS · Euskalmet WAM Costa Vasca (1,6 km)', step_h: STEP_H, times: [], spots: {} };
for (const sp of spots) {
  const p = sp.sea ? { lat: sp.sea.lat, lon: sp.sea.lon, km: 0, manual: true } : await snap(sp, times[0]);
  if (!p) { console.warn('sin celda de mar para', sp.id); continue; }
  const s = { name: sp.name, sea: p, hs: [], tp: [], dir: [], ws: [], wd: [] };
  for (const iso of times) {
    const vals = await Promise.all(Object.entries(VARS).map(([k, v]) => q(v, p.lat, p.lon, iso)));
    Object.keys(VARS).forEach((k, i) => s[k].push(vals[i] == null ? null : Math.round(vals[i] * 100) / 100));
  }
  out.spots[sp.id] = s;
  console.log(sp.id, 'ok', p.km + ' km al mar');
}
out.times = times;
// Quita las horas finales sin datos (fuera del horizonte del modelo)
let last = times.length; while (last > 0 && Object.values(out.spots).every(s => s.hs[last - 1] == null)) last--;
out.times = times.slice(0, last);
for (const s of Object.values(out.spots)) for (const k of Object.keys(VARS)) s[k] = s[k].slice(0, last);
mkdirSync(new URL('../docs/data/', import.meta.url), { recursive: true });
writeFileSync(new URL('../docs/data/forecast.json', import.meta.url), JSON.stringify(out));
console.log('guardado', out.times.length, 'horas');
