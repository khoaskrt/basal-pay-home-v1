#!/usr/bin/env python3
"""Compare landmark geometry between the Figma reference and our render.

    python3 scripts/visual-regression/home/landmarks.py

Both images are 393x852. Prints ref vs actual vs delta for the anchors that
matter, so drift can be corrected numerically instead of by eye.
"""
import sys
from PIL import Image

REF = "reference/home/v1/node-1671-3913.png"
ACT = "shots/home-v1.png"

PAGE_BG = (242, 243, 248)


def lum(p):
    return 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2]


def load(path):
    return Image.open(path).convert("RGB")


def bbox(im, x0, x1, y0, y1, pred):
    pts = [
        (x, y)
        for y in range(y0, y1)
        for x in range(x0, x1)
        if pred(im.getpixel((x, y)))
    ]
    if not pts:
        return None
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    return (min(xs), min(ys), max(xs), max(ys))


def is_blue(p):
    r, g, b = p
    return b > 150 and b - r > 60 and b - g > 40


def is_dark(p):
    return lum(p) < 110


def is_white(p):
    return min(p) > 249


def dark_band(im, x0, x1, y0, y1, thr=170):
    ys = [y for y in range(y0, y1) if any(lum(im.getpixel((x, y))) < thr for x in range(x0, x1))]
    if not ys:
        return None
    return (ys[0], ys[-1], ys[-1] - ys[0] + 1)


def dark_span(im, x0, x1, y0, y1, thr=170):
    xs = [x for x in range(x0, x1) if any(lum(im.getpixel((x, y))) < thr for y in range(y0, y1))]
    if not xs:
        return None
    return (xs[0], xs[-1])


def rows_of(pred, im, x0, x1, y0, y1, min_count=3, gap=3, step=1):
    groups = []
    for y in range(y0, y1, step):
        c = sum(1 for x in range(x0, x1) if pred(im.getpixel((x, y))))
        if c >= min_count:
            if groups and y - groups[-1][-1] <= gap:
                groups[-1].append(y)
            else:
                groups.append([y])
    return [(g[0], g[-1]) for g in groups]


def report(im, label):
    out = {}
    out["statusbar.time"] = bbox(im, 0, 160, 20, 60, is_dark)
    out["header.avatar"] = bbox(
        im, 0, 160, 40, 125, lambda p: max(p) - min(p) > 25 and lum(p) < 240
    )
    out["header.bell"] = bbox(im, 300, 393, 40, 125, is_white)
    out["header.text.x"] = dark_span(im, 80, 320, 55, 100)
    out["header.text.y"] = dark_band(im, 80, 320, 55, 105)
    out["card"] = bbox(im, 0, 393, 100, 370, is_blue)
    out["card.verified.y"] = None  # measured via white text on blue
    out["sheet.head.y"] = dark_band(im, 10, 200, 380, 430)
    out["sheet.head.x"] = dark_span(im, 0, 300, 380, 430)
    out["viewall.x"] = dark_span(im, 280, 393, 380, 430, 200)
    out["nav"] = bbox(
        im,
        0,
        393,
        700,
        852,
        lambda p: abs(p[0] - 16) < 12 and abs(p[1] - 23) < 12 and abs(p[2] - 39) < 14,
    )
    out["fab"] = bbox(
        im, 120, 280, 680, 830, lambda p: p[2] > 200 and p[2] - p[0] > 60
    )
    # transaction icon chips
    inchip = lambda p: p[2] > 235 and p[2] - p[0] > 12 and p[1] > 205
    outchip = lambda p: p[0] > 240 and p[0] - p[1] > 15 and p[2] > 225
    out["chips.in"] = rows_of(inchip, im, 15, 70, 400, 852)
    out["chips.out"] = rows_of(outchip, im, 15, 70, 400, 852)
    # row 1 title / date bands
    out["row1.bands"] = rows_of(
        lambda p: lum(p) < 200, im, 68, 300, 430, 560, min_count=2
    )
    out["row.titles.x"] = dark_span(im, 60, 340, 440, 500)
    return out


def fmt(v):
    if v is None:
        return "—"
    if isinstance(v, tuple):
        return "(" + ", ".join(f"{x:g}" for x in v) + ")"
    return str(v)


def main():
    ref, act = load(REF), load(ACT)
    r, a = report(ref, "ref"), report(act, "act")
    width = max(len(k) for k in r)
    print(f"{'landmark'.ljust(width)}  {'REFERENCE'.ljust(34)}  {'RENDER'.ljust(34)}  DELTA")
    print("-" * (width + 80))
    for k in r:
        rv, av = r[k], a.get(k)
        delta = ""
        if isinstance(rv, tuple) and isinstance(av, tuple) and len(rv) == len(av):
            delta = ", ".join(f"{b - x:+g}" for x, b in zip(rv, av))
        elif isinstance(rv, list) and isinstance(av, list):
            delta = f"{len(av) - len(rv):+d} groups"
        print(f"{k.ljust(width)}  {fmt(rv).ljust(34)}  {fmt(av).ljust(34)}  {delta}")


if __name__ == "__main__":
    sys.exit(main())
