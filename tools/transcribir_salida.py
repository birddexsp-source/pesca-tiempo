#!/usr/bin/env python3
"""Transcribe los audios de una salida guardada en pesca-datos y escribe `text` en cada evento.
Uso: python3 tools/transcribir_salida.py <ruta-clon-pesca-datos> [id_salida]   (sin id: todas las salidas con audios sin texto)
Requisitos: pip install sherpa-onnx numpy; modelo Whisper small en /tmp/asr/sherpa-onnx-whisper-small (ver AUTOMATIZAR.md).
Solo añade `text` y sube `u`; no cambia orden ni nada más. Luego Claude ordena/describe y hace commit+push."""
import sys, os, json, time, subprocess, glob
import numpy as np, sherpa_onnx
M = '/tmp/asr/sherpa-onnx-whisper-small'
def reco():
    return sherpa_onnx.OfflineRecognizer.from_whisper(
        encoder=glob.glob(M + '/*encoder.int8.onnx')[0], decoder=glob.glob(M + '/*decoder.int8.onnx')[0],
        tokens=glob.glob(M + '/*tokens.txt')[0], language='es', task='transcribe', num_threads=2)
def pcm(path):
    out = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', path, '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'], capture_output=True).stdout
    return np.frombuffer(out, dtype=np.float32)
def main():
    repo = sys.argv[1]; only = sys.argv[2] if len(sys.argv) > 2 else None
    r = None; n = 0
    for f in sorted(glob.glob(repo + '/data/trips/*.json')):
        if only and os.path.basename(f) != only + '.json': continue
        j = json.load(open(f)); d = j.get('d') or {}
        todo = [e for e in d.get('eventos', []) if e.get('audio') and not e.get('text')]
        if not todo or j.get('del'): continue
        r = r or reco()
        for e in todo:
            bp = os.path.join(repo, 'blobs', e['audio'])
            if not os.path.exists(bp): print('falta blob', e['audio']); continue
            w = pcm(bp); partes = []
            for k in range(0, len(w), 16000 * 28):   # Whisper solo admite <30 s por trozo
                s = r.create_stream(); s.accept_waveform(16000, w[k:k + 16000 * 28]); r.decode_stream(s); partes.append(s.result.text.strip())
            t = ' '.join(x for x in partes if x)
            if t: e['text'] = t; n += 1
        j['u'] = int(time.time() * 1000); json.dump(j, open(f, 'w'), ensure_ascii=False)
        print('actualizada', os.path.basename(f))
    print(n, 'transcripciones')
main()
