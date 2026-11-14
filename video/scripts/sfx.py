"""Efeitos sonoros sintetizados (sem direitos de terceiros): whoosh, impacto grave e clique.

uso: python scripts/sfx.py <pasta public>   ->   public/sfx/{whoosh,impacto,clique}.wav (48 kHz, estéreo)
Os níveis ficam baixos de propósito: no vídeo, o volume de cada efeito ainda é reduzido.
"""
import os
import sys
import wave

import numpy as np

SR = 48000
rng = np.random.default_rng(7)


def save(path, left, right, peak):
    stereo = np.stack([left, right], axis=1)
    stereo *= peak / (np.abs(stereo).max() or 1)
    fade = int(0.004 * SR)  # sem estalo no começo e no fim
    ramp = np.linspace(0, 1, fade)[:, None]
    stereo[:fade] *= ramp
    stereo[-fade:] *= ramp[::-1]
    data = (np.clip(stereo, -1, 1) * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


def lowpass(signal, cutoff):
    spec = np.fft.rfft(signal)
    freqs = np.fft.rfftfreq(len(signal), 1 / SR)
    spec *= 1 / np.sqrt(1 + (freqs / cutoff) ** 4)
    return np.fft.irfft(spec, n=len(signal))


def whoosh(duration=1.15, peak_at=0.48):
    """Ruído com um filtro passa-faixa que sobe e desce (o 'vuuush'), passando da esquerda para a direita."""
    n = int(SR * duration)
    noise = rng.standard_normal(n + 4096)
    win, hop = 2048, 256
    window = np.hanning(win)
    freqs = np.maximum(np.fft.rfftfreq(win, 1 / SR), 1)
    out = np.zeros(n + win)
    for start in range(0, n, hop):
        x = min((start + win / 2) / SR / duration, 1)
        rise = x / peak_at if x < peak_at else (1 - x) / (1 - peak_at)
        center = 180 * (9 ** max(rise, 0) ** 1.4)  # ~180 Hz -> ~1,6 kHz -> volta
        gain = np.exp(-0.5 * (np.log2(freqs / center) / 1.0) ** 2)
        out[start : start + win] += np.fft.irfft(np.fft.rfft(noise[start : start + win] * window) * gain) * window
    out = lowpass(out[:n], 4500)  # sem chiado no agudo
    t = np.linspace(0, 1, n)
    env = np.where(t < peak_at, (t / peak_at) ** 2.2, ((1 - t) / (1 - peak_at)) ** 1.6)
    out *= env
    pan = np.linspace(-0.55, 0.55, n)
    return out * np.cos((pan + 1) * np.pi / 4), out * np.sin((pan + 1) * np.pi / 4)


def impact(duration=1.9):
    """Grave curto com queda de afinação + ataque abafado + cauda escura (o 'tum' dos títulos)."""
    n = int(SR * duration)
    t = np.arange(n) / SR
    freq = 38 + 34 * np.exp(-t / 0.11)
    sub = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-t / 0.42) * (1 - np.exp(-t / 0.003))
    hit = lowpass(rng.standard_normal(n), 2600) * np.exp(-t / 0.014) * 0.45
    tail_l = lowpass(rng.standard_normal(n), 520) * np.exp(-t / 0.55) * 0.16
    tail_r = lowpass(rng.standard_normal(n), 520) * np.exp(-t / 0.55) * 0.16
    return sub + hit + tail_l, sub + hit + tail_r


def click(duration=0.09):
    """Clique de interface, curto e discreto (itens de lista)."""
    n = int(SR * duration)
    t = np.arange(n) / SR
    body = np.sin(2 * np.pi * 1850 * t) * np.exp(-t / 0.011) + 0.35 * np.sin(2 * np.pi * 3700 * t) * np.exp(-t / 0.005)
    body *= 1 - np.exp(-t / 0.0008)
    return body, body


folder = os.path.join(sys.argv[1] if len(sys.argv) > 1 else "public", "sfx")
os.makedirs(folder, exist_ok=True)
save(os.path.join(folder, "whoosh.wav"), *whoosh(), peak=0.5)
save(os.path.join(folder, "impacto.wav"), *impact(), peak=0.6)
save(os.path.join(folder, "clique.wav"), *click(), peak=0.35)
print("ok:", ", ".join(sorted(os.listdir(folder))))
