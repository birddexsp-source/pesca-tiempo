"""Construye docs/cuaderno/index.html = base/cuaderno-v5.html + parches/p17..p42.js (en orden).
Uso:  python3 cuaderno-src/build.py      (desde la raíz del repo, o desde cualquier sitio)"""
import os, re
AQUI = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(AQUI, '..', 'docs', 'cuaderno', 'index.html')
PARCHES = ['p%d.js' % n for n in range(17, 54)]   # al añadir uno nuevo: crear pNN.js y subir el 35 aquí
h = open(os.path.join(AQUI, 'base', 'cuaderno-v5.html'), encoding='utf8').read()
pre = 'src="/_blob/\'+'
out = []; i = 0
while True:
    j = h.find(pre, i)
    if j < 0: out.append(h[i:]); break
    out.append(h[i:j]); k = j + len(pre); d = 0; m = k
    while True:
        ch = h[m]
        if ch in '([': d += 1
        elif ch in ')]': d -= 1
        elif d == 0 and h.startswith("+'\"", m): break
        m += 1
    out.append('data-blob="\'+' + h[k:m] + '+\'" src="data:image/gif;base64,R0lGODlhAQABAAAAACw="'); i = m + 3
h = ''.join(out); assert '/_blob/' not in h
L = '<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>'
h = h.replace(L, '<script src="shim.js"></script>\n<script src="leaflet.min.js"></script>', 1).replace(L, '')
patch = ''.join(open(os.path.join(AQUI, 'parches', f), encoding='utf8').read() + '\n' for f in PARCHES)
idx = h.rindex('})();'); h = h[:idx] + patch + h[idx:]
h = h.replace('<title>Cuaderno de pesca</title>', '<title>Cuaderno de pesca</title>\n<link rel="manifest" href="manifest.webmanifest"><link rel="icon" href="icon.svg"><link rel="apple-touch-icon" href="icon-192.png"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">', 1)
open(OUT, 'w', encoding='utf8').write(h); print('ok', len(h))
