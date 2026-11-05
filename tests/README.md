# Pruebas del Cuaderno de pesca

Validan **todo** el cuaderno (`docs/cuaderno`) abriéndolo en un Chromium con tamaño de móvil y usándolo
como lo usarías tú: botones, hojas, mapa, audio, recargas, sin conexión…

## Ejecutar

```bash
cd tests
npm install                      # solo la primera vez (instala Playwright)
npx playwright install chromium  # solo la primera vez
npm test                         # TODAS las pruebas (≈ 2,5 min)
node run.js vivo audio           # solo las suites cuyo nombre contenga «vivo» o «audio»
node run.js --list               # lista las suites
node run.js --verbose            # enseña también cada comprobación que pasa
```

Sale con código 1 si algo falla. Al final imprime un resumen y la lista de fallos.
Las capturas de lo que falla y los archivos exportados quedan en `tests/out/` (se borra en cada ejecución).

## Qué cubre

| Suite | Comprueba |
|---|---|
| 00-estatico | archivos, JSON de semillas, fotos referenciadas, service worker, **funciones duplicadas** (un parche pisando a otro), sin tokens |
| 01-carga | arranque, 5 pestañas, Plan sin horas inválidas, ajustes, datos tras recargar |
| 02-equipo | categorías, **fotos que cargan**, alta de una caña, «Por comprar» completo |
| 03-salida-pasada | las dos opciones de Nueva salida, asistente, equipo usado, editar sin perder equipo |
| 04-captura-rapida | ⚡ sin salida en curso, guardar y otra, cantidad, ordenar en una salida |
| 05-salida-en-vivo | montar, recargar a mitad, capturas propias y de compañeros, cambio de spot/equipo, cronómetro, botón atrás, terminar y guardar |
| 06-audio-y-mapa | mapa de sitios (elegir/crear), notas de voz dentro de los cambios, persistencia, descargas |
| 07-companeros-y-stats | Compañeros (tú vs ellos), Rendimiento por equipo y filtros, ficha |
| 08-exportar | JSON, JSON con fotos y CSV |
| 09-pantallas-moviles | sin desbordes en 360×640 en todas las pantallas |
| 10-offline-pwa | service worker, precarga de fotos, arranque y datos sin red |
| 11-editar-captura-y-engodo | tocar una captura del registro para editarla/borrarla, categoría Engodo y marcarlo en la salida |

## Añadir o editar una prueba

Cada archivo de `suites/` exporta `{ name, run(t) }` (`static: true` si no necesita navegador,
`launch: { viewport }` para cambiar el tamaño). Dentro, agrupa con `t.case('nombre', async () => { … })`
y comprueba con `t.ok(...)`/`t.eq(...)`. Ayudantes más usados (ver `lib/harness.js`):

- `t.seed()` datos de ejemplo (compañero, 2 sitios, 3 spots, 1 salida anterior)
- `t.tap(sel)` pulsa y espera (reintenta hasta 3 s) · `t.tapIf(sel)` · `t.fill(sel, texto)` · `t.goTab('equipo')`
- `t.T(sel)` texto · `t.N(sel)` cuántos · `t.has(sel)` · `t.toast()`
- `t.docs('trips')` lee la base · `t.put(col, id, datos)` escribe · `t.reload()` recarga la página
- `t.overflow()` elementos que se salen de la pantalla · `t.shot('nombre')` captura

Cada suite arranca con una base vacía (IndexedDB nueva), así que no se pisan entre sí.
Las pruebas siempre miran lo **publicado** en `docs/cuaderno`: ejecútalas antes de subir cambios.

Si a propósito dejas una función duplicada en el código, añádela a `DUP_CONOCIDOS` en `00-estatico.js`.
