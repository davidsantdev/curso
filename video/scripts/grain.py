"""Granulação de filme: algumas texturas de ruído que se alternam a cada quadro.

Além do visual de cinema, o ruído evita 'degraus' (banding) nos degradês escuros depois da compressão em H.264.
uso: python scripts/grain.py public/grain
"""
import os
import sys

import numpy as np
from PIL import Image

folder = sys.argv[1] if len(sys.argv) > 1 else "public/grain"
os.makedirs(folder, exist_ok=True)
rng = np.random.default_rng(3)
for i in range(6):
    noise = np.clip(rng.normal(128, 46, size=(540, 960)), 0, 255).astype(np.uint8)
    Image.fromarray(noise, mode="L").save(os.path.join(folder, "%d.png" % i), optimize=True)
print("ok:", len(os.listdir(folder)), "texturas")
