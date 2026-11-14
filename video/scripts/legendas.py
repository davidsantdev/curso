"""Gera a legenda .srt (para o YouTube e players) a partir das palavras com tempo.

uso: python scripts/legendas.py src/data/palavras.json out/aula-01.srt
Cada legenda tem até 2 linhas de ~42 caracteres e quebra no fim das frases ou nas pausas.
"""
import json
import sys

source, out = sys.argv[1], sys.argv[2]
words = json.load(open(source, encoding="utf-8"))

MAX_CHARS = 84
cues, current = [], []
for i, word in enumerate(words):
    current.append(word)
    text = " ".join(w["t"] for w in current)
    nxt = words[i + 1] if i + 1 < len(words) else None
    ends_sentence = word["t"][-1] in ".?!:"
    pause = nxt is not None and nxt["s"] - word["e"] > 0.45
    too_long = nxt is not None and len(text) + 1 + len(nxt["t"]) > MAX_CHARS
    if nxt is None or ends_sentence or pause or too_long:
        cues.append(current)
        current = []


def two_lines(text):
    if len(text) <= 42:
        return text
    middle = len(text) // 2
    cut = min((i for i, ch in enumerate(text) if ch == " "), key=lambda i: abs(i - middle))
    return text[:cut] + "\n" + text[cut + 1 :]


def stamp(seconds):
    ms = int(round(seconds * 1000))
    return "%02d:%02d:%02d,%03d" % (ms // 3600000, ms // 60000 % 60, ms // 1000 % 60, ms % 1000)


with open(out, "w", encoding="utf-8") as f:
    for n, cue in enumerate(cues, 1):
        start = cue[0]["s"]
        end = cue[-1]["e"] + 0.25
        if n < len(cues):
            end = min(end, cues[n][0]["s"] - 0.02)
        f.write("%d\n%s --> %s\n%s\n\n" % (n, stamp(start), stamp(end), two_lines(" ".join(w["t"] for w in cue))))
print("ok: %d legendas" % len(cues))
