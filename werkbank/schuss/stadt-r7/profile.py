#!/usr/bin/env python3
"""DIE FUSSPROFILE UND DIE BILDMASSE — was DAS LOT und DIE TIEFE brauchen.

Erweitert werkbank/schuss/stadt-r6/fuesse.py um die zweite Zahl, die Runde 7
gekostet hat: die natuerliche Groesse jeder Hofdatei. Ohne sie kann das Stueck
zur Zeichenzeit nicht sagen, wie hoch ein Aufbau auf der Buehne wird — und ohne
das nicht, wo sein Fuss liegt. Genau daran hing der Pferdestall, der 17 Prozent
seiner Hoehe ueber dem eigenen Fuss haengt und trotzdem den z-Index seiner
Unterkante trug.

    python3 werkbank/schuss/stadt-r7/profile.py

Gibt zwei fertige Bloecke fuer stuecke/stadt-daten.js aus.
"""
import pathlib

import numpy as np
from PIL import Image

N = 24
ORDNER = pathlib.Path('spiel/bild/hof')

fuesse, masse = [], []
for p in sorted(ORDNER.glob('*.png')):
    bild = Image.open(p).convert('RGBA')
    a = np.asarray(bild)[:, :, 3] > 60
    h, w = a.shape
    werte = []
    for i in range(N):
        x0, x1 = int(i * w / N), max(int((i + 1) * w / N), int(i * w / N) + 1)
        ys = np.where(a[:, x0:x1].any(axis=1))[0]
        werte.append(round(float(ys.max() + 1) / h, 4) if len(ys) else -1)
    fuesse.append(f"    {p.stem}: [{', '.join(str(v) for v in werte)}]")
    masse.append(f"    {p.stem}: [{w}, {h}]")

print('  fuesse: {\n' + ',\n'.join(fuesse) + '\n  },')
print()
print('  bildmass: {\n' + ',\n'.join(masse) + '\n  },')
