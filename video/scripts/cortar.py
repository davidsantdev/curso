"""Corta trechos de uma narração sem estalos e mantém as pausas naturais.

uso: python cortar.py <cortes.json>

O arquivo de cortes fica na pasta do áudio e diz, para cada trecho, onde ele começa e termina na gravação original
(em segundos, tirados da transcrição com o tempo de cada palavra):

{
  "fonte": "voz-original.mp3",
  "saida": "voz.mp3",
  "cortes": [
    {
      "motivo": "Não é promessa de nada",
      "fim_da_fala_anterior": 71.56,   # fim da última palavra que fica
      "inicio_do_trecho": 71.80,       # início da primeira palavra que sai
      "fim_do_trecho": 73.02,          # fim da última palavra que sai
      "inicio_da_fala_seguinte": 73.60, # início da primeira palavra que volta
      "pausa": 0.6                     # opcional: silêncio total entre as duas falas, em segundos
    }
  ]
}

O corte acontece no ponto mais silencioso de cada intervalo entre palavras, com um cruzamento de 12 ms. Sem "pausa",
fica a pausa que vinha depois do trecho cortado. Gera também <saida>-mapa.json, que converte um tempo da gravação
original para o tempo do áudio cortado (para sincronizar os slides sem transcrever de novo).
"""
import json
import subprocess
import sys
import wave
from pathlib import Path

import av
import numpy as np

RATE = 44100
FADE = int(0.012 * RATE)
FFMPEG = Path(__file__).resolve().parents[1] / "node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe"


def load(path):
    resampler = av.AudioResampler(format="flt", layout="mono", rate=RATE)
    chunks = []
    with av.open(str(path)) as container:
        for frame in container.decode(audio=0):
            chunks.extend(f.to_ndarray().reshape(-1) for f in resampler.resample(frame))
        chunks.extend(f.to_ndarray().reshape(-1) for f in resampler.resample(None))
    return np.concatenate(chunks).astype(np.float32)


def quietest(audio, start, end):
    """Amostra no meio da janela de 10 ms mais silenciosa entre `start` e `end` (segundos)."""
    a, b = int(start * RATE), int(end * RATE)
    hop = int(0.01 * RATE)
    if b - a <= hop:
        return (a + b) // 2
    frames = (b - a) // hop
    rms = np.sqrt(np.mean(audio[a : a + frames * hop].reshape(frames, hop) ** 2, axis=1))
    return a + int(np.argmin(rms)) * hop + hop // 2


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    spec_path = Path(sys.argv[1]).resolve()
    folder = spec_path.parent
    spec = json.loads(spec_path.read_text(encoding="utf-8"))
    audio = load(folder / spec["fonte"])

    pieces = []
    mapa = []  # (início no original, início no cortado, fim no original)
    cursor = 0
    out_len = 0
    for cut in sorted(spec["cortes"], key=lambda c: c["inicio_do_trecho"]):
        a = quietest(audio, cut["fim_da_fala_anterior"], cut["inicio_do_trecho"])
        b = quietest(audio, cut["fim_do_trecho"], cut["inicio_da_fala_seguinte"])
        keep = audio[cursor:a].copy()
        mapa.append((cursor / RATE, out_len / RATE, a / RATE))
        pieces.append(keep)
        out_len += len(keep)

        gap_now = (a / RATE - cut["fim_da_fala_anterior"]) + (cut["inicio_da_fala_seguinte"] - b / RATE)
        target = cut.get("pausa")
        if target and target > gap_now:
            silence = np.zeros(int((target - gap_now) * RATE), dtype=np.float32)
            pieces.append(silence)
            out_len += len(silence)
        cursor = b
        print(f'corte "{cut["motivo"]}": {a / RATE:.2f}s a {b / RATE:.2f}s ({(b - a) / RATE:.1f}s fora), pausa {max(gap_now, target or 0):.2f}s')

    tail = audio[cursor:].copy()
    mapa.append((cursor / RATE, out_len / RATE, len(audio) / RATE))
    pieces.append(tail)

    # emendas suaves: fade-out no fim de cada pedaço e fade-in no começo do seguinte
    ramp = np.linspace(0, 1, FADE, dtype=np.float32)
    for i, piece in enumerate(pieces):
        if len(piece) > 2 * FADE:
            if i > 0:
                piece[:FADE] *= ramp
            if i < len(pieces) - 1:
                piece[-FADE:] *= ramp[::-1]
    result = np.concatenate(pieces)

    wav_path = folder / (Path(spec["saida"]).stem + ".wav")
    with wave.open(str(wav_path), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(RATE)
        wav.writeframes((np.clip(result, -1, 1) * 32767).astype("<i2").tobytes())
    subprocess.run(
        [str(FFMPEG), "-y", "-loglevel", "error", "-i", str(wav_path), "-codec:a", "libmp3lame", "-b:a", "192k", str(folder / spec["saida"])],
        check=True,
    )
    wav_path.unlink()

    (folder / (Path(spec["saida"]).stem + "-mapa.json")).write_text(
        json.dumps([{"original": round(o, 3), "cortado": round(c, 3), "ate": round(e, 3)} for o, c, e in mapa], indent=1),
        encoding="utf-8",
    )
    print(f"{spec['saida']}: {len(audio) / RATE:.1f}s → {len(result) / RATE:.1f}s")


if __name__ == "__main__":
    main()
