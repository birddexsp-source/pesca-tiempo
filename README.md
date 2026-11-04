# pesca-tiempo

Previsión de oleaje para el cuaderno de pesca (costa de Bizkaia), a partir del modelo
**Euskalmet WAM Costa Vasca** (EuskOOS, 1,6 km). Una tarea de GitHub Actions lo descarga cada 3 h
para los spots de `spots.json` y guarda `docs/data/forecast.json`. `docs/index.html` es la página
para mirarlo desde el móvil (GitHub Pages).


## Cuaderno de pesca

App del cuaderno en `docs/cuaderno/`; código fuente en `cuaderno-src/` y pruebas en `tests/`. Empieza por **`cuaderno-src/README.md`**.
