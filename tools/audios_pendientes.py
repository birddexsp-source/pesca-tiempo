#!/usr/bin/env python3
"""Transcribe los audios de notas de voz del cuaderno que aún no tienen texto.
Uso: python3 audios_pendientes.py [/ruta/pesca-datos] [--escribir]
- Lee data/trips/*.json y busca eventos type=note con audio y sin 'text'.
- Convierte blobs/<id> (webm) a 16 kHz y los transcribe con Whisper small (sherpa-onnx, offline).
- Sin --escribir solo imprime (id de audio, hora, duración, texto bruto). Con --escribir guarda 'text' (bruto, marcado) en el evento y sube 'u'.
La interpretación (descripción, spots, equipo) la hace Claude leyendo la salida; esto es solo la parte mecánica."""
import sys, os, json, glob, subprocess, time, datetime, urllib.request, tarfile
import numpy as np
R = next((a for a in sys.argv[1:] if not a.startswith('--')), '/home/claude/pesca-datos')
ESC = '--escribir' in sys.argv
M = '/tmp/asr/sherpa-onnx-whisper-small/'
URL = 'https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-small.tar.bz2'
if not os.path.exists(M + 'small-tokens.txt'):
    os.makedirs('/tmp/asr', exist_ok=True)
    print('Descargando modelo…', file=sys.stderr)
    urllib.request.urlretrieve(URL, '/tmp/asr/small.tar.bz2')
    tarfile.open('/tmp/asr/small.tar.bz2').extractall('/tmp/asr')
import sherpa_onnx
rec = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=M + 'small-encoder.int8.onnx', decoder=M + 'small-decoder.int8.onnx', tokens=M + 'small-tokens.txt', language='es', task='transcribe', num_threads=4)
tz = datetime.timezone(datetime.timedelta(hours=1))
def trans(path):
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'], capture_output=True).stdout
    a = np.frombuffer(pcm, dtype=np.float32); out = []
    for i in range(0, len(a), 16000 * 28):
        s = rec.create_stream(); s.accept_waveform(16000, a[i:i + 16000 * 28]); rec.decode_stream(s); out.append(s.result.text.strip())
    return len(a) / 16000, ' '.join(out)
for fn in sorted(glob.glob(R + '/data/trips/*.json')):
    doc = json.load(open(fn)); d = doc.get('d')
    if not d: continue
    pend = [e for e in d.get('eventos', []) if e.get('audio') and not e.get('text')]
    if not pend: continue
    print('\n== %s · %s · %s' % (os.path.basename(fn)[:-5], d.get('date'), d.get('siteName')))
    changed = False
    for e in pend:
        b = R + '/blobs/' + e['audio']
        if not os.path.exists(b) or os.path.getsize(b) < 1000:
            print('  %s  [audio vacío o sin subir: %s]' % (datetime.datetime.fromtimestamp(e['t'] / 1000, tz).strftime('%H:%M'), e['audio'][:6])); continue
        dur, txt = trans(b)
        print('  %s (%s, %.0f s): %s' % (datetime.datetime.fromtimestamp(e['t'] / 1000, tz).strftime('%H:%M'), e['audio'][:6], dur, txt))
        if ESC: e['text'] = txt; changed = True
    if ESC and changed:
        doc['u'] = int(time.time() * 1000); json.dump(doc, open(fn, 'w'), ensure_ascii=False, separators=(',', ':'))
