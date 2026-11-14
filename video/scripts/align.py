"""Junta o texto do roteiro (palavras certas) com os tempos do Whisper (quando cada palavra é falada).

uso: python align.py <transcricao.json> <roteiro.md> <palavras.json>
Saída: lista [{"t": palavra como aparece no roteiro, "s": início em s, "e": fim em s}].
Palavras do roteiro que o Whisper não reconheceu ganham tempos interpolados entre as vizinhas.
"""
import difflib
import json
import re
import sys
import unicodedata

transcript, roteiro, out = sys.argv[1], sys.argv[2], sys.argv[3]

# grafias que ficam melhores na tela do que no roteiro
DISPLAY = {"Po,": "Pô,"}


def spoken_text(md):
    body = md.split("## Roteiro", 1)[1].split("## Depois de gravar", 1)[0]
    lines = []
    for line in body.splitlines():
        line = line.strip()
        if not line or line.startswith("#") or line.startswith("**Na tela:**"):
            continue
        lines.append(line.replace("**", "").replace("*", ""))
    return " ".join(lines)


def key(token):
    token = unicodedata.normalize("NFKD", token.lower())
    token = "".join(ch for ch in token if not unicodedata.combining(ch))
    return re.sub(r"[^a-z0-9]", "", token)


data = json.load(open(transcript, encoding="utf-8"))
heard = [w for seg in data["segments"] for w in seg["words"]]
script = [DISPLAY.get(t, t) for t in spoken_text(open(roteiro, encoding="utf-8").read()).split()]

a = [key(t) for t in script]
b = [key(w["w"]) for w in heard]
times = [None] * len(script)
matcher = difflib.SequenceMatcher(a=a, b=b, autojunk=False)
for tag, i1, i2, j1, j2 in matcher.get_opcodes():
    if tag == "equal":
        for k in range(i2 - i1):
            times[i1 + k] = (heard[j1 + k]["s"], heard[j1 + k]["e"])
    elif tag == "replace":
        # mesmo trecho, escrito diferente ("4.500 reais" x "R$ 4.500"): divide o tempo ouvido entre as palavras do roteiro
        start, end = heard[j1]["s"], heard[j2 - 1]["e"]
        step = (end - start) / (i2 - i1)
        for k in range(i2 - i1):
            times[i1 + k] = (start + k * step, start + (k + 1) * step)

# palavras sem tempo (o Whisper não ouviu): espalha entre a anterior e a próxima com tempo
i = 0
while i < len(times):
    if times[i] is not None:
        i += 1
        continue
    j = i
    while j < len(times) and times[j] is None:
        j += 1
    left = times[i - 1][1] if i > 0 else 0.0
    right = times[j][0] if j < len(times) else left + 0.4 * (j - i)
    if right - left < 0.12 * (j - i):  # sem folga: encosta na palavra anterior
        right = left + 0.12 * (j - i)
    step = (right - left) / (j - i)
    for k in range(i, j):
        times[k] = (left + (k - i) * step, left + (k - i + 1) * step)
    i = j

words = []
for token, (s, e) in zip(script, times):
    words.append({"t": token, "s": round(s, 3), "e": round(max(e, s + 0.05), 3)})

# tempos sempre crescentes (o Whisper às vezes devolve sobreposição)
for k in range(1, len(words)):
    if words[k]["s"] < words[k - 1]["s"]:
        words[k]["s"] = words[k - 1]["s"]
    if words[k]["e"] < words[k]["s"]:
        words[k]["e"] = words[k]["s"] + 0.05

with open(out, "w", encoding="utf-8") as f:
    json.dump(words, f, ensure_ascii=False, separators=(",", ":"))
print("ok: %d palavras, de %.2fs a %.2fs" % (len(words), words[0]["s"], words[-1]["e"]))
