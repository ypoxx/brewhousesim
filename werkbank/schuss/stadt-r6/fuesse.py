#!/usr/bin/env python3
"""DIE FUSSPROFILE — was DAS LOT im Spiel braucht.

Fuer jedes Bild in spiel/bild/hof je 24 Spalten die UNTERSTE undurchsichtige
Zeile, als Anteil der Bildhoehe. Damit kann das Stueck zur Zeichenzeit sagen,
wo ein Aufbau den Boden beruehrt — ohne Schuss, ohne Python, im Spiel.

    python3 werkbank/schuss/stadt-r6/fuesse.py > /dev/stdout

Seit Welle 7 liegen die Hofbilder als .webp statt .png (gleiche Pixelgroesse,
Alphakanal verlustfrei). Auf dieser Maschine ist weder PIL noch numpy
installiert; wer die Fussprofile nachmessen will, ohne beides nachzuruesten,
nimmt werkbank/schuss/stadt-gewicht/fuesse-pruefen.mjs — das misst dasselbe im
Browser und vergleicht gleich gegen die eingetragene Tabelle.
"""
import pathlib
import numpy as np
from PIL import Image

N = 24
ORDNER = pathlib.Path('spiel/bild/hof')
zeilen = []
for p in sorted(ORDNER.glob('*.webp')):
    a = np.asarray(Image.open(p).convert('RGBA'))[:, :, 3] > 60
    h, w = a.shape
    werte = []
    for i in range(N):
        x0, x1 = int(i * w / N), max(int((i + 1) * w / N), int(i * w / N) + 1)
        band = a[:, x0:x1]
        ys = np.where(band.any(axis=1))[0]
        werte.append(round(float(ys.max() + 1) / h, 4) if len(ys) else -1)
    zeilen.append(f"    {p.stem}: [{', '.join(str(v) for v in werte)}]")
print('  fuesse: {\n' + ',\n'.join(zeilen) + '\n  },')
