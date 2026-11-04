# Cuaderno de pesca — guía rápida (léeme primero)

App web offline-first (PWA) para el cuaderno de pesca de Jon. Un solo `index.html` en `docs/cuaderno/`,
publicado con GitHub Pages: https://birddexsp-source.github.io/pesca-tiempo/cuaderno/
Los datos viven en el móvil (IndexedDB) y se sincronizan solos al repo privado `birddexsp-source/pesca-datos`
(con un token que Jon puso en la app; **nunca tocarlo ni pedirlo**).

## Dónde está cada cosa

| Qué | Dónde |
|---|---|
| App publicada (lo que ve el móvil) | `docs/cuaderno/` (`index.html`, `sw.js`, `shim.js`, `img/`, semillas `*.json`) |
| Código fuente | `cuaderno-src/` |
| ├ Base antigua (pantallas originales, ya compilada) | `cuaderno-src/base/cuaderno-v5.html` |
| ├ Parches nuevos, uno por función, se aplican en orden | `cuaderno-src/parches/p17.js … p34.js` |
| └ Compilador | `cuaderno-src/build.py` |
| Pruebas automáticas | `tests/` (ver `tests/README.md`) |

Los parches añaden/sustituyen funciones sobre la base: p23–p26 equipo y fotos, p27–p31 estadísticas y
exportar, p32–p33 salida pasada/compañeros, **p34 salida en vivo** (consola, mapa de sitios, audio).

## Flujo de trabajo para cambiar algo

1. Edita el parche que toque en `cuaderno-src/parches/` (o crea `pNN.js` y añádelo a la lista `PARCHES` de `build.py`).
2. `python3 cuaderno-src/build.py` → regenera `docs/cuaderno/index.html`.
3. Si tocas el JS publicado: sube la versión `V='cuaderno-vNN'` en `docs/cuaderno/sw.js` (si no, el móvil no recarga).
4. `cd tests && npm test` → debe salir todo en verde.
5. `git add -A && git commit && git push`. Jon recarga la app dos veces para ver el cambio.

## Reglas importantes

- **Todos los parches comparten un único ámbito global** (están dentro de una misma función). Si dos
  declaran una función con el mismo nombre, gana la última y rompe a la otra sin avisar. Usa prefijos
  propios (`lv*` en la salida en vivo, `eqp*` en equipo…). El test `00-estatico` lo detecta.
- Estilo de la app: móvil primero, oscuro, rápido de rellenar en el spot, sin sobreingeniería, textos en español.
- `base/cuaderno-v5.html` ya está compilada: se puede editar directamente, pero lo normal es parchear.
- Las fotos del equipo están en `docs/cuaderno/img/`; si añades una, súbela también a la lista `GEAR` de `sw.js`.

## Modelo de datos (colecciones, base tipo Firestore sobre IndexedDB)

`sites` (sitios), `spots`, `trips` (salidas), `catches` (capturas), `barridos`, `gearInv` / `gearMeta` (equipo),
`speciesPhotos`, `companeros`, `sesiones` (documento `activa` = salida en vivo en curso).
Audios y fotos: blobs en `assets`. Detalle de la sesión en vivo: comentario al inicio de `parches/p34.js`.

## Limitaciones conocidas / ideas pendientes

- Cambiar de modalidad a mitad de salida guarda la salida con la modalidad final.
- Si se bloquea el móvil grabando audio, se pierde esa grabación.
- El barrido no está enlazado con la salida en vivo.
- Los audios se ven en el resumen al terminar, aún no en el detalle de una salida ya guardada.
- Ideas: estadísticas de compañeros por condiciones.
