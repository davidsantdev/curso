"""Efeitos sonoros sintetizados (sem direitos de terceiros): whoosh, impacto, clique e os sons da edição de memes.

uso: python scripts/sfx.py <pasta public>   ->   public/sfx/*.wav (48 kHz, estéreo)
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


def bandpass(signal, center, width_octaves=0.6):
    spec = np.fft.rfft(signal)
    freqs = np.maximum(np.fft.rfftfreq(len(signal), 1 / SR), 1)
    spec *= np.exp(-0.5 * (np.log2(freqs / center) / width_octaves) ** 2)
    return np.fft.irfft(spec, n=len(signal))


# ---------------------------------------------------------------- sons da edição de memes (aula 3 em diante)


def pop(duration=0.16):
    """'Pop' de bolha: sobe rápido de afinação e some (quando um meme ou adesivo aparece)."""
    n = int(SR * duration)
    t = np.arange(n) / SR
    freq = 260 + 900 * (1 - np.exp(-t / 0.018))
    body = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-t / 0.035) * (1 - np.exp(-t / 0.0015))
    return body, body


def ding(duration=1.1):
    """Sininho de notificação: duas notas que soam juntas, com um leve eco do lado direito."""
    n = int(SR * duration)
    t = np.arange(n) / SR
    tone = lambda f, tau: np.sin(2 * np.pi * f * t) * np.exp(-t / tau)
    note = tone(1318.5, 0.32) + 0.55 * tone(1975.5, 0.22) + 0.18 * tone(2637, 0.12)
    note *= 1 - np.exp(-t / 0.002)
    delay = int(0.09 * SR)
    right = np.concatenate([np.zeros(delay), note[:-delay]]) * 0.5 + note * 0.7
    return note, right


def cash(duration=1.3):
    """Caixa registradora: o 'tchic' metálico da gaveta e o 'plim' do sino."""
    n = int(SR * duration)
    t = np.arange(n) / SR
    chic = bandpass(rng.standard_normal(n), 5200, 0.5) * np.exp(-np.maximum(t - 0.0, 0) / 0.03) * 0.8
    coins = np.zeros(n)
    for k, at in enumerate([0.03, 0.07, 0.1, 0.15, 0.19]):
        start = int(at * SR)
        seg = np.arange(n - start) / SR
        coins[start:] += np.sin(2 * np.pi * (4200 + 600 * k) * seg) * np.exp(-seg / 0.025) * 0.35
    start = int(0.12 * SR)
    seg = np.arange(n - start) / SR
    bell = np.zeros(n)
    for f, a, tau in [(2093, 1.0, 0.5), (3136, 0.55, 0.35), (4186, 0.3, 0.25), (5274, 0.18, 0.16)]:
        bell[start:] += a * np.sin(2 * np.pi * f * seg) * np.exp(-seg / tau)
    mix = chic + coins + bell * 0.9
    return mix, mix


def scratch(duration=0.42):
    """Arranhão de disco: ruído filtrado que vai e volta de afinação (a 'quebra' de expectativa)."""
    n = int(SR * duration)
    noise = rng.standard_normal(n + 2048)
    win, hop = 1024, 128
    window = np.hanning(win)
    freqs = np.maximum(np.fft.rfftfreq(win, 1 / SR), 1)
    out = np.zeros(n + win)
    for start in range(0, n, hop):
        x = start / n
        center = 2600 * (0.25 + 0.75 * abs(np.cos(np.pi * 1.6 * x))) if x < 0.85 else 600
        gain = np.exp(-0.5 * (np.log2(freqs / center) / 0.35) ** 2)
        out[start : start + win] += np.fft.irfft(np.fft.rfft(noise[start : start + win] * window) * gain) * window
    out = out[:n]
    t = np.linspace(0, 1, n)
    out *= np.minimum(1, t / 0.04) * (1 - t) ** 0.6
    return out, out


def glitch(duration=0.32):
    """Glitch digital: rajadas curtas de ruído 'esmigalhado' (código, tela, erro)."""
    n = int(SR * duration)
    out = np.zeros(n)
    pos = 0
    while pos < n:
        size = int(SR * rng.uniform(0.012, 0.04))
        burst = np.sign(rng.standard_normal(size)) * rng.uniform(0.25, 1)
        hold = int(rng.integers(6, 40))
        burst = np.repeat(burst[::hold], hold)[:size]
        out[pos : pos + size] += burst[: max(0, min(size, n - pos))]
        pos += size + int(SR * rng.uniform(0.004, 0.02))
    out = lowpass(out, 7000)
    return out, np.roll(out, 90)


def tick(duration=0.6):
    """Tique-taque de relógio (duas batidinhas secas)."""
    n = int(SR * duration)
    out = np.zeros(n)
    for at, f in [(0.0, 3400), (0.3, 2600)]:
        start = int(at * SR)
        seg = np.arange(n - start) / SR
        out[start:] += np.sin(2 * np.pi * f * seg) * np.exp(-seg / 0.006)
    return out, out


def boom(duration=1.6):
    """Grave de meme: um 808 que cai de afinação, com um pouco de saturação."""
    n = int(SR * duration)
    t = np.arange(n) / SR
    freq = 46 + 90 * np.exp(-t / 0.06)
    sub = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-t / 0.55) * (1 - np.exp(-t / 0.002))
    sub = np.tanh(sub * 2.2) / np.tanh(2.2)
    knock = lowpass(rng.standard_normal(n), 1800) * np.exp(-t / 0.01) * 0.5
    return sub + knock, sub + knock


def riser(duration=1.2):
    """Subida de ruído filtrado que cresce até o corte (entrada dos capítulos)."""
    n = int(SR * duration)
    noise = rng.standard_normal(n + 4096)
    win, hop = 2048, 256
    window = np.hanning(win)
    freqs = np.maximum(np.fft.rfftfreq(win, 1 / SR), 1)
    out = np.zeros(n + win)
    for start in range(0, n, hop):
        x = start / n
        center = 300 * (12 ** x)
        gain = np.exp(-0.5 * (np.log2(freqs / center) / 0.8) ** 2)
        out[start : start + win] += np.fft.irfft(np.fft.rfft(noise[start : start + win] * window) * gain) * window
    out = lowpass(out[:n], 6000)
    t = np.linspace(0, 1, n)
    out *= t**2.2
    pan = np.linspace(0.5, -0.5, n)
    return out * np.cos((pan + 1) * np.pi / 4), out * np.sin((pan + 1) * np.pi / 4)


folder = os.path.join(sys.argv[1] if len(sys.argv) > 1 else "public", "sfx")
os.makedirs(folder, exist_ok=True)
# a ordem importa: o gerador aleatório é o mesmo, então os três primeiros saem iguais aos da aula 1
save(os.path.join(folder, "whoosh.wav"), *whoosh(), peak=0.5)
save(os.path.join(folder, "impacto.wav"), *impact(), peak=0.6)
save(os.path.join(folder, "clique.wav"), *click(), peak=0.35)
save(os.path.join(folder, "pop.wav"), *pop(), peak=0.4)
save(os.path.join(folder, "ding.wav"), *ding(), peak=0.32)
save(os.path.join(folder, "caixa.wav"), *cash(), peak=0.34)
save(os.path.join(folder, "arranhao.wav"), *scratch(), peak=0.4)
save(os.path.join(folder, "glitch.wav"), *glitch(), peak=0.3)
save(os.path.join(folder, "tique.wav"), *tick(), peak=0.3)
save(os.path.join(folder, "boom.wav"), *boom(), peak=0.62)
save(os.path.join(folder, "subida.wav"), *riser(), peak=0.38)
print("ok:", ", ".join(sorted(os.listdir(folder))))
