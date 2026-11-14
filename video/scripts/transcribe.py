"""Transcreve o áudio com o tempo de cada palavra (faster-whisper, roda local, na CPU).

uso: python transcribe.py <audio> <saida.json> [modelo] [volume.json]
Gera <saida.json> (segmentos + palavras), <saida.txt> (texto com tempos, para leitura) e o volume da voz
quadro a quadro (padrão: <saida>-volume.json), que anima as barrinhas da voz no vídeo.
"""
import json
import sys
import time

import av
import numpy as np
from faster_whisper import WhisperModel

source, out = sys.argv[1], sys.argv[2]
model_name = sys.argv[3] if len(sys.argv) > 3 else "small"
volume_out = sys.argv[4] if len(sys.argv) > 4 else out.replace(".json", "-volume.json")
FPS = 30


def load_audio(path, rate=16000):
    """Decodifica para mono float32 em 16 kHz (o av 19 não aceita o parâmetro que o faster-whisper usa)."""
    resampler = av.AudioResampler(format="s16", layout="mono", rate=rate)
    chunks = []
    with av.open(path) as container:
        for frame in container.decode(audio=0):
            chunks.extend(f.to_ndarray().reshape(-1) for f in resampler.resample(frame))
        chunks.extend(f.to_ndarray().reshape(-1) for f in resampler.resample(None))
    return np.concatenate(chunks).astype(np.float32) / 32768.0


started = time.time()
audio = load_audio(source)

# volume da voz por quadro de vídeo (RMS, 0 a 1), para animações que reagem à fala
hop = 16000 // FPS
frames = len(audio) // hop
rms = np.sqrt(np.mean(audio[: frames * hop].reshape(frames, hop) ** 2, axis=1))
envelope = np.clip(rms / (np.percentile(rms, 98) or 1), 0, 1)
with open(volume_out, "w", encoding="utf-8") as f:
    json.dump({"fps": FPS, "values": [round(float(v), 3) for v in envelope]}, f)

model = WhisperModel(model_name, device="cpu", compute_type="int8", cpu_threads=6)
prompt = (
    "Opa, fala galera, professor na área. Vender sem estoque, dropshipping, fornecedor, "
    "CDC, Código de Defesa do Consumidor. R$ 99, R$ 45, R$ 4.500."
)
segments, info = model.transcribe(
    audio,  # o array já decodificado
    language="pt",
    word_timestamps=True,
    beam_size=5,
    initial_prompt=prompt,
)

data = {"model": model_name, "duration": info.duration, "segments": []}
for seg in segments:
    data["segments"].append(
        {
            "start": round(seg.start, 3),
            "end": round(seg.end, 3),
            "text": seg.text.strip(),
            "words": [
                {"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3), "p": round(w.probability, 3)}
                for w in seg.words
            ],
        }
    )

with open(out, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=1)
with open(out.replace(".json", ".txt"), "w", encoding="utf-8") as f:
    for seg in data["segments"]:
        f.write("[%7.2f - %7.2f] %s\n" % (seg["start"], seg["end"], seg["text"]))

words = sum(len(s["words"]) for s in data["segments"])
print("ok: %d segmentos, %d palavras, %.0f s de processamento" % (len(data["segments"]), words, time.time() - started))
