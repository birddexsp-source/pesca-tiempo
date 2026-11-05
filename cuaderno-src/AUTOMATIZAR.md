# «He tenido esta pesca» (automático)
1. Jon graba audios en la salida (cada uno con su hora, en el registro). La app los sube sola a `pesca-datos`.
2. En casa dice «he tenido esta pesca». Claude (sesión con acceso a `pesca-datos`):
   - clona `birddexsp-source/pesca-datos`;
   - `python3 tools/transcribir_salida.py <clon> [id_salida]` (añade `text` a cada audio; la app lo muestra bajo el hecho);
   - ordena eventos, escribe títulos/descripciones y completa campos **sin inventar** (lo dudoso se pregunta o se deja vacío);
   - commit + push; la app lo recoge al sincronizar.
3. No se toca nunca el token de la app.
Modelo ASR: Whisper small de https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-small.tar.bz2 → /tmp/asr/ ; `pip install sherpa-onnx numpy`.
