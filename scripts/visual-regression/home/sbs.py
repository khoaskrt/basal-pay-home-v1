#!/usr/bin/env python3
"""Side-by-side / stacked crop comparison: reference vs render.

    python3 scripts/visual-regression/home/sbs.py out.png y0 y1 [x0 x1] [scale]
"""
import sys
from PIL import Image, ImageDraw

REF = "reference/home/v1/node-1671-3913.png"
ACT = "shots/home-v1.png"

out = sys.argv[1]
y0, y1 = int(sys.argv[2]), int(sys.argv[3])
x0 = int(sys.argv[4]) if len(sys.argv) > 4 else 0
x1 = int(sys.argv[5]) if len(sys.argv) > 5 else 393
scale = float(sys.argv[6]) if len(sys.argv) > 6 else 3.0

ref = Image.open(REF).convert("RGB").crop((x0, y0, x1, y1))
act = Image.open(ACT).convert("RGB").crop((x0, y0, x1, y1))
w, h = ref.size
sw, sh = int(w * scale), int(h * scale)
ref = ref.resize((sw, sh), Image.NEAREST)
act = act.resize((sw, sh), Image.NEAREST)

pad, label = 26, 26
canvas = Image.new("RGB", (sw, sh * 2 + pad * 3 + label * 2), (24, 26, 33))
d = ImageDraw.Draw(canvas)
d.text((8, 6), "REFERENCE (Figma)", fill=(255, 255, 255))
canvas.paste(ref, (0, label))
d.text((8, label + sh + pad + 6), "RENDER (Next.js)", fill=(255, 255, 255))
canvas.paste(act, (0, label * 2 + sh + pad))
canvas.save(out)
print(f"{out}  {canvas.size}")
