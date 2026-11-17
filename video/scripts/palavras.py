"""Palavras com tempo para o áudio já cortado: leva a transcrição original para a linha do tempo do voz.mp3.

uso: python palavras.py <transcricao-original.json> <voz-mapa.json> <correcoes.json> <saida.json>

- Palavras que caíram nos trechos cortados saem.
- correcoes.json: lista de pares ["como o reconhecimento ouviu", "como foi dito"], palavra por palavra
  (ex.: ["entra em posto.", "entra imposto."]). O tempo do trecho é dividido entre as palavras corrigidas.
Saída: [{"t": palavra, "s": início em s, "e": fim em s}] (o mesmo formato da aula 1).
"""
import json
import sys

transcript, mapa_path, fixes_path, out = sys.argv[1:5]
sys.stdout.reconfigure(encoding="utf-8")

words = [w for seg in json.load(open(transcript, encoding="utf-8"))["segments"] for w in seg["words"]]
mapa = json.load(open(mapa_path, encoding="utf-8"))


def to_cut(t):
    for piece in mapa:
        if piece["original"] - 0.02 <= t <= piece["ate"] + 0.02:
            return piece["cortado"] + (t - piece["original"])
    return None


kept = []
for w in words:
    s, e = to_cut(w["s"]), to_cut(w["e"])
    if s is None or e is None:
        continue
    kept.append({"t": w["w"].strip(), "s": round(s, 3), "e": round(e, 3)})

fixes = json.load(open(fixes_path, encoding="utf-8")) if fixes_path != "-" else []
for wrong, right in fixes:
    a, b = wrong.split(), right.split()
    i = 0
    hits = 0
    while i <= len(kept) - len(a):
        if [w["t"] for w in kept[i : i + len(a)]] == a:
            start, end = kept[i]["s"], kept[i + len(a) - 1]["e"]
            step = (end - start) / len(b)
            kept[i : i + len(a)] = [
                {"t": t, "s": round(start + k * step, 3), "e": round(start + (k + 1) * step, 3)} for k, t in enumerate(b)
            ]
            i += len(b)
            hits += 1
        else:
            i += 1
    if hits == 0:
        print(f'aviso: correção não encontrada: "{wrong}"')

json.dump(kept, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=0)
print(f"ok: {len(kept)} palavras, fala termina em {kept[-1]['e']:.2f} s")
