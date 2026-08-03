#!/usr/bin/env python3
"""ORTSTREUE — bleibt der Ort derselbe, wenn eine Platte neu gezeichnet wird?

Das Verfahren ist das des Kritikers aus Runde 6: der Turm von St. Michael hat
bei y=470 in allen vier Platten seine dunklen Kanten an derselben Stelle. Dazu
hier die Hofmauer, auf der DAS LOT rechnet, und die Flussbiegung.

    python3 werkbank/schuss/stadt-r7/ortstreue.py [platte.jpg ...]

Ohne Argumente werden die vier eingecheckten Platten verglichen.
"""
import sys

import numpy as np
from PIL import Image

PLATTEN = sys.argv[1:] or ['spiel/bild/platte-1350.jpg', 'spiel/bild/platte-1600.jpg',
                           'spiel/bild/platte-1884.jpg', 'spiel/bild/platte-1970.jpg']


def kanten(a, y, x0, x1, schwelle=48):
    """Dunkle Kanten in einer Bildzeile: wo faellt die Helligkeit ein."""
    z = a[y, x0:x1].mean(axis=1)
    d = np.abs(np.diff(z))
    return [x0 + int(i) for i in np.where(d > schwelle)[0]]


def zeile(a, y, x0, x1):
    return a[y, x0:x1].mean(axis=1)


for p in PLATTEN:
    a = np.asarray(Image.open(p).convert('RGB'), dtype=np.float32)
    print(f'\n{p}  {a.shape[1]}x{a.shape[0]}')
    print('  St. Michael, Zeile y=470, x 1480..1760:', kanten(a, 470, 1480, 1760))
    print('  Hofmauer, Spalte x=830, y 1100..1300:',
          [1100 + int(i) for i in np.where(np.abs(np.diff(a[1100:1300, 830].mean(axis=1))) > 40)[0]])
    print('  Fluss, Zeile y=900, x 2300..2752:', kanten(a, 900, 2300, 2752))
