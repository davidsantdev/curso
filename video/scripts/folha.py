"""Junta os quadros de out/quadros numa folha de contato (para revisar o visual de várias cenas de uma vez).

uso: python scripts/folha.py <saida.png> [colunas] [largura_de_cada] [arquivos...]
"""
import glob
import os
import sys

from PIL import Image, ImageDraw

out = sys.argv[1]
cols = int(sys.argv[2]) if len(sys.argv) > 2 else 3
width = int(sys.argv[3]) if len(sys.argv) > 3 else 640
files = sys.argv[4:] or sorted(glob.glob("out/quadros/*.png"))
height = width * 9 // 16
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * width + (cols - 1) * 6, rows * height + (rows - 1) * 6), (40, 40, 40))
draw = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    im = Image.open(f).convert("RGB").resize((width, height), Image.LANCZOS)
    x, y = (i % cols) * (width + 6), (i // cols) * (height + 6)
    sheet.paste(im, (x, y))
    label = os.path.splitext(os.path.basename(f))[0].lstrip("0") + " s"
    draw.rectangle([x, y, x + 9 * len(label) + 10, y + 20], fill=(0, 0, 0))
    draw.text((x + 5, y + 4), label, fill=(255, 220, 120))
sheet.save(out)
print("ok", sheet.size, len(files), "quadros")
