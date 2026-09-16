#!/usr/bin/env python3
"""Isolate the hero line's word groups (number vs ticker) in both images."""
from PIL import Image
import sys

def lum(p): return 0.2126*p[0]+0.7152*p[1]+0.0722*p[2]

def groups(im, x0, x1, y0, y1, thr=210):
    cols=[x for x in range(x0,x1) if any(lum(im.getpixel((x,y)))>thr for y in range(y0,y1))]
    g=[]
    for x in cols:
        if g and x-g[-1][-1] <= 4: g[-1].append(x)
        else: g.append([x])
    out=[]
    for b in g:
        ys=[y for y in range(y0,y1) if any(lum(im.getpixel((x,y)))>thr for x in range(b[0],b[-1]+1))]
        out.append((b[0], b[-1], b[-1]-b[0]+1, ys[0], ys[-1], ys[-1]-ys[0]+1))
    return out

for path, label in (("reference/home/v1/node-1671-3913.png","REF"), ("shots/home-v1.png","ACT")):
    im = Image.open(path).convert("RGB")
    print(label, groups(im, 25, 250, 218, 258))
