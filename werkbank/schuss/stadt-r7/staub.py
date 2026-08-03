#!/usr/bin/env python3
"""STAUB — ein Fleck, der einem Bild den Boden wegzieht.

Runde 6 ging unter anderem an dieser Datei zurueck:

    bild/hof/pferdestall.png hat 17,1 Prozent leeren Rand unten (jede andere
    der 32 Hofdateien hoechstens 2,1). Mit anker:'unten' malt der Stall
    deshalb bei 64,1 Prozent Buehnenhoehe, traegt aber den z-Index 680.

Nachgemessen ist der leere Rand kein Zeichenfehler, sondern ein Staubkorn:
bei y = 748..768 stehen einzelne Pixel mit Alpha 1..12 — unsichtbar, aber
gross genug, dass die Freistellung den Rahmen bis dorthin aufzieht. Das Bild
haengt seither 17 Prozent seiner Hoehe ueber dem eigenen Fuss.

    python3 werkbank/schuss/stadt-r7/staub.py <bild.png> [--schwelle 25]
                                              [--kleinstes 400] [--rand 14]

Schreibt die Datei an Ort und Stelle neu: Alpha unter der Schwelle wird 0,
zu kleine Inseln fallen weg, dann auf die Umrandung zuschneiden und denselben
weichen Rand anlegen wie freistellen.py (zwei Reihen frei, acht weich).
"""
import sys

import numpy as np
import scipy.ndimage as ndi
from PIL import Image

datei = sys.argv[1]


def zahl(name, vorgabe):
    return int(sys.argv[sys.argv.index(name) + 1]) if name in sys.argv else vorgabe


schwelle = zahl('--schwelle', 25)
kleinstes = zahl('--kleinstes', 400)
rand = zahl('--rand', 14)

im = Image.open(datei).convert('RGBA')
b = np.asarray(im).copy()
a = b[:, :, 3].astype(np.int16)
H0, W0 = a.shape

a[a < schwelle] = 0
mark, n = ndi.label(a > 0)
if n:
    zaehlung = np.bincount(mark.ravel(), minlength=n + 1)
    klein = np.isin(mark, np.where(zaehlung < kleinstes)[0])
    klein &= mark > 0
    a[klein] = 0

ys, xs = np.where(a > 0)
y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
rgb = b[y0:y1, x0:x1, :3]
al = a[y0:y1, x0:x1].astype(np.uint8)

H, W = al.shape
neu = np.zeros((H + 2 * rand, W + 2 * rand, 4), dtype=np.uint8)
neu[rand:rand + H, rand:rand + W, :3] = rgb
neu[rand:rand + H, rand:rand + W, 3] = al

A = neu[:, :, 3].astype(np.float32)
yy, xx = np.mgrid[0:A.shape[0], 0:A.shape[1]]
d = np.minimum.reduce([yy, xx, A.shape[0] - 1 - yy, A.shape[1] - 1 - xx]).astype(np.float32)
A *= np.clip((d - 1.0) / 8.0, 0, 1)
neu[:, :, 3] = A.astype(np.uint8)

Image.fromarray(neu, 'RGBA').save(datei)
k = neu[:, :, 3]
print(f'{datei}  {W0}x{H0} -> {neu.shape[1]}x{neu.shape[0]}  '
      f'Kante max Alpha: {max(k[0].max(), k[-1].max(), k[:, 0].max(), k[:, -1].max())}')
