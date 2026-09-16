#!/usr/bin/env python3
"""Fit the balance card's aurora artwork with plain CSS radial-gradients.

The card background in the Figma frame is a mesh/aurora gradient. Instead of
eyeballing it, this script:

  1. crops the card out of the 1x reference,
  2. masks out everything that is painted on top (pill, eye button, text,
     buttons, rounded corners),
  3. runs matching pursuit over a bank of elliptical radial-gradient shapes,
     solving each layer's colour + alpha with linear least squares,
  4. prints the resulting CSS `background-image` stack.

The compositing model is exactly CSS's own source-over compositing for
`radial-gradient(rgba(...) 0%, rgba(...,0) 100%)`, so the emitted stack
reproduces the fit.

    uv run --with numpy --with pillow python3 scripts/visual-regression/home/fit_card.py
"""
from __future__ import annotations

import sys

import numpy as np
from PIL import Image

REF = "reference/home/v1/node-1671-3913.png"

# card box on the 393x852 frame
CX0, CY0, CW, CH = 11, 127, 371, 231
CORNER_R = 28

# rectangles / circles painted on top of the artwork, in card-local coords
OCCLUDERS = [
    # (x0, y0, x1, y1)
    (16, 20, 114, 61),        # verified pill
    (14, 70, 132, 92),        # "Available balance"
    (16, 92, 180, 128),       # hero number + USDT
    (14, 126, 152, 150),      # ≈ … VND
    (14, 160, 186, 215),      # deposit button
    (184, 160, 358, 215),     # send button
]
EYE = (330 - CX0, 168 - CY0, 19)  # centre x, centre y, radius


def build_mask() -> np.ndarray:
    yy, xx = np.mgrid[0:CH, 0:CW]
    mask = np.ones((CH, CW), dtype=bool)

    # rounded corners
    for cx, cy in ((CORNER_R, CORNER_R), (CW - 1 - CORNER_R, CORNER_R),
                   (CORNER_R, CH - 1 - CORNER_R), (CW - 1 - CORNER_R, CH - 1 - CORNER_R)):
        outside = ((xx - cx) ** 2 + (yy - cy) ** 2) > (CORNER_R - 1) ** 2
        quad = ((xx < CORNER_R) if cx < CW / 2 else (xx > CW - 1 - CORNER_R)) & (
            (yy < CORNER_R) if cy < CH / 2 else (yy > CH - 1 - CORNER_R)
        )
        mask[quad & outside] = False

    # a 3px rim avoids the rounded-edge antialiasing
    mask[:3, :] = mask[-3:, :] = False
    mask[:, :3] = mask[:, -3:] = False

    for x0, y0, x1, y1 in OCCLUDERS:
        mask[max(0, y0 - 3):y1 + 3, max(0, x0 - 3):x1 + 3] = False

    ex, ey, er = EYE
    mask[((xx - ex) ** 2 + (yy - ey) ** 2) <= (er + 3) ** 2] = False
    return mask


def shape(cx: float, cy: float, rx: float, ry: float) -> np.ndarray:
    """CSS radial-gradient(rx ry at cx cy, A 0%, transparent 100%) alpha profile."""
    yy, xx = np.mgrid[0:CH, 0:CW]
    t = np.sqrt(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2)
    return np.clip(1.0 - t, 0.0, 1.0).astype(np.float64)


def candidates():
    xs = [0.06, 0.22, 0.42, 0.62, 0.82, 0.98]
    ys = [0.05, 0.26, 0.5, 0.74, 0.97]
    radii = [(0.22, 0.24), (0.38, 0.4), (0.6, 0.62), (0.9, 0.95), (1.4, 1.5)]
    for fy in ys:
        for fx in xs:
            for frx, fry in radii:
                yield (fx * CW, fy * CH, frx * CW, fry * CH)


def main() -> int:
    ref = np.asarray(Image.open(REF).convert("RGB"), dtype=np.float64)
    target = ref[CY0:CY0 + CH, CX0:CX0 + CW]
    mask = build_mask()

    valid = mask
    n = int(valid.sum())

    # base = mean of the visible artwork
    current = np.zeros_like(target)
    base = target[valid].mean(axis=0)
    current[:] = base

    layers: list[tuple[float, float, float, float, np.ndarray, float]] = []
    shapes = []
    for (cx, cy, rx, ry) in candidates():
        s = shape(cx, cy, rx, ry)
        if s[valid].max() < 0.05:
            continue
        shapes.append((cx, cy, rx, ry, s))

    alphas = np.array([0.06, 0.12, 0.2, 0.3, 0.42, 0.55, 0.7, 0.85, 1.0])

    for step in range(11):
        residual = (target - current)[valid]
        cur_v = current[valid]
        err = float(np.sqrt((residual ** 2).mean()))

        best = None
        for (cx, cy, rx, ry, s) in shapes:
            m = s[valid]
            mm = float((m * m).sum())
            if mm < 1e-6:
                continue
            for alpha in alphas:
                # given alpha, the optimal (unclipped) colour is closed form
                w = ((m[:, None] * (residual + alpha * m[:, None] * cur_v)).sum(axis=0)) / mm
                colour = np.clip(w / alpha, 0.0, 255.0)
                a = (s * alpha)[..., None]
                pred_full = current * (1 - a) + colour * a
                score = float((((target - pred_full) ** 2) * mask[..., None]).sum() / (n * 3))
                if best is None or score < best[0]:
                    best = (score, cx, cy, rx, ry, s, colour.copy(), float(alpha))

        score, cx, cy, rx, ry, s, colour, alpha = best
        a = (s * alpha)[..., None]
        current = current * (1 - a) + colour * a
        layers.append((cx, cy, rx, ry, colour, alpha))

        new_err = float(np.sqrt(((target - current)[valid] ** 2).mean()))
        print(f"layer {step + 1}: at ({cx:6.1f},{cy:6.1f}) r({rx:6.1f},{ry:6.1f}) "
              f"rgb({colour[0]:.0f},{colour[1]:.0f},{colour[2]:.0f}) a={alpha:.2f} "
              f"-> rmse {err:.2f} -> {new_err:.2f}", flush=True)
        if err - new_err < 0.15:
            break

    final = float(np.sqrt(((target - current)[valid] ** 2).mean()))
    print(f"\nbase rgb({base[0]:.0f}, {base[1]:.0f}, {base[2]:.0f})   final rmse {final:.2f}")

    css = []
    for (cx, cy, rx, ry, colour, alpha) in reversed(layers):
        r, g, b = (int(round(c)) for c in colour)
        css.append(
            f"    radial-gradient({rx / CW * 100:.1f}% {ry / CH * 100:.1f}% "
            f"at {cx / CW * 100:.1f}% {cy / CH * 100:.1f}%, "
            f"rgba({r}, {g}, {b}, {alpha:.2f}) 0%, rgba({r}, {g}, {b}, 0) 100%),"
        )
    out = "\n".join(css)
    with open("shots/card-gradient.css", "w") as fh:
        fh.write(out + "\n")
    print("\n/* ---- generated: balance card artwork ---- */")
    print(out)
    print(f"\nbackground-color: #%02X%02X%02X;" % tuple(int(round(c)) for c in base))

    # save a preview of the fit for eyeballing
    Image.fromarray(current.astype(np.uint8)).save("shots/card-fit.png")
    Image.fromarray(target.astype(np.uint8)).save("shots/card-target.png")
    diff = np.abs(current - target).mean(axis=2)
    Image.fromarray(np.clip(diff * 3, 0, 255).astype(np.uint8)).save("shots/card-fit-diff.png")
    print(f"\nwrote shots/card-fit.png, card-target.png, card-fit-diff.png  (n={n})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
