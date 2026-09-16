#!/usr/bin/env python3
"""Ink-box comparison of every text run: reference vs render.

For each labelled text run we isolate its ink bounding box in both 393x852
images and report the width delta, which is what tells us whether a font-size
or a spacing value is off.
"""
from PIL import Image

REF = "reference/home/v1/node-1671-3913.png"
ACT = "shots/home-v1.png"


def lum(p):
    return 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2]


# label, x0, x1, y0, y1, mode
#   dark  -> ink darker than the surface
#   light -> ink lighter than the surface (white text on the blue card)
RUNS = [
    ("statusbar 10:53", 30, 130, 25, 55, "dark", 170),
    ("welcome back!", 58, 300, 68, 88, "dark", 200),
    ("name", 58, 300, 88, 110, "dark", 170),
    ("card.available", 20, 210, 196, 220, "light", 200),
    ("card.amount", 20, 165, 218, 252, "light", 200),
    ("card.usdt", 166, 270, 231, 250, "light", 200),
    ("card.fiat", 20, 240, 262, 280, "light", 190),
    ("card.verified", 38, 118, 152, 178, "light", 190),
    ("btn.deposit", 30, 196, 296, 334, "dark", 140),
    ("btn.send", 196, 372, 296, 334, "light", 190),
    ("send.label", 262, 340, 300, 332, "light", 210),
    ("head.history", 0, 260, 396, 424, "dark", 210),
    ("head.viewall", 280, 380, 396, 424, "dark", 215),
    ("r1.title.l1", 60, 320, 458, 482, "dark", 170),
    ("r1.title.l2", 60, 320, 482, 502, "dark", 170),
    ("r1.date", 60, 320, 503, 524, "dark", 215),
    ("r3.title", 60, 320, 608, 632, "dark", 170),
    ("r3.date", 60, 320, 636, 656, "dark", 215),
    ("nav.home", 50, 115, 788, 808, "light", 150),
    ("nav.account", 275, 355, 788, 808, "light", 150),
]


def ink(im, x0, x1, y0, y1, mode, thr):
    xs, ys = [], []
    for y in range(y0, y1):
        for x in range(x0, x1):
            v = lum(im.getpixel((x, y)))
            hit = v < thr if mode == "dark" else v > thr
            if hit:
                xs.append(x)
                ys.append(y)
    if not xs:
        return None
    return (min(xs), min(ys), max(xs), max(ys))


def main():
    ref = Image.open(REF).convert("RGB")
    act = Image.open(ACT).convert("RGB")
    print(f"{'run'.ljust(18)} {'REF x0,x1,w'.ljust(20)} {'ACT x0,x1,w'.ljust(20)} "
          f"{'REF y0,y1'.ljust(12)} {'ACT y0,y1'.ljust(12)} {'Δw':>5} {'Δx':>4} {'Δy':>4}")
    print("-" * 108)
    for label, x0, x1, y0, y1, mode, thr in RUNS:
        r = ink(ref, x0, x1, y0, y1, mode, thr)
        a = ink(act, x0, x1, y0, y1, mode, thr)
        if not r or not a:
            print(f"{label.ljust(18)} {'missing' if not r else ''} {'missing' if not a else ''}")
            continue
        rw, aw = r[2] - r[0] + 1, a[2] - a[0] + 1
        print(
            f"{label.ljust(18)} "
            f"{f'{r[0]},{r[2]},{rw}'.ljust(20)} {f'{a[0]},{a[2]},{aw}'.ljust(20)} "
            f"{f'{r[1]},{r[3]}'.ljust(12)} {f'{a[1]},{a[3]}'.ljust(12)} "
            f"{aw - rw:>5} {a[0] - r[0]:>4} {a[1] - r[1]:>4}"
        )


if __name__ == "__main__":
    main()
