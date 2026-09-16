#!/usr/bin/env python3
"""Per-region mean absolute error, to see what still differs."""
from PIL import Image
import numpy as np

ref = np.asarray(Image.open("reference/home/v1/node-1671-3913.png").convert("RGB"), dtype=np.int16)
act = np.asarray(Image.open("shots/home-v1.png").convert("RGB"), dtype=np.int16)

REGIONS = [
    ("statusbar", 0, 0, 393, 54),
    ("avatar", 18, 70, 60, 112),
    ("greeting", 68, 72, 200, 90),
    ("name", 68, 90, 200, 110),
    ("bell", 328, 66, 376, 114),
    ("card pill", 25, 148, 125, 186),
    ("card eye", 322, 148, 362, 188),
    ("card label", 28, 198, 145, 216),
    ("card number", 28, 220, 190, 254),
    ("card fiat", 28, 256, 165, 274),
    ("card btn deposit", 28, 290, 195, 340),
    ("card btn send", 198, 290, 365, 340),
    ("card bg TL", 130, 140, 320, 200),
    ("card bg TR", 240, 190, 375, 290),
    ("card bg mid", 200, 200, 370, 290),
    ("card bg BL", 130, 340, 320, 356),
    ("sheet head", 0, 395, 393, 425),
    ("chip in 1", 16, 467, 64, 515),
    ("chip out 4", 16, 667, 64, 714),
    ("nav pill", 20, 757, 375, 817),
    ("nav home", 55, 758, 110, 812),
    ("nav acct", 280, 758, 350, 812),
    ("fab", 158, 708, 236, 786),
    ("below nav", 0, 818, 393, 852),
]


def main() -> None:
    print(f"{'region':20}{'MAE':>8}{'max':>6}")
    print("-" * 34)
    rows = []
    for name, x0, y0, x1, y1 in REGIONS:
        d = np.abs(ref[y0:y1, x0:x1] - act[y0:y1, x0:x1])
        rows.append((float(d.mean()), name, int(d.max())))
    for mae, name, mx in sorted(rows, reverse=True):
        print(f"{name:20}{mae:8.2f}{mx:6d}")


if __name__ == "__main__":
    main()
