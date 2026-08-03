#!/usr/bin/env python3
"""Freistellen fuer bild/hof/*.png — Weiss raus, Rand weich, Kante alphafrei.

Runde 5 hat den Ordner auf die Fugennaht umgestellt: kein Pixel mit Alpha > 0
auf einer Bildkante, die aeussersten zwei Reihen durchsichtig, die naechsten
acht weich anlaufend. Wer ein neues Hofbild erzeugt, laesst es hier durch.

    python3 werkbank/schuss/stadt-r6/freistellen.py <roh.jpg> <ziel.png> [--rand 14]
"""
import sys
import numpy as np
from PIL import Image, ImageFilter

roh, ziel = sys.argv[1], sys.argv[2]
rand = 14
if '--rand' in sys.argv:
    rand = int(sys.argv[sys.argv.index('--rand') + 1])

im = Image.open(roh).convert('RGB')
a = np.asarray(im, dtype=np.float32)

# Weiss ist Hintergrund: je heller und je farbloser, desto durchsichtiger.
hell = a.min(axis=2)
bunt = a.max(axis=2) - a.min(axis=2)
alpha = np.clip((246.0 - hell) / 14.0 + bunt / 10.0, 0, 1)

# Loecher im Inneren schliessen (weisse Flaechen im Objekt bleiben deckend).
voll = (alpha > 0.5).astype(np.uint8) * 255
m = Image.fromarray(voll).filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.MinFilter(9))
from PIL import ImageDraw
innen = np.asarray(m) > 127
# Flutfuellung vom Rand: was vom Rand aus erreichbar ist, ist Hintergrund.
h, w = innen.shape
frei = ~innen
stapel = [(0, x) for x in range(w)] + [(h - 1, x) for x in range(w)] \
       + [(y, 0) for y in range(h)] + [(y, w - 1) for y in range(h)]
aussen = np.zeros_like(frei)
import collections
q = collections.deque([p for p in stapel if frei[p]])
for p in q:
    aussen[p] = True
while q:
    y, x = q.popleft()
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        ny, nx = y + dy, x + dx
        if 0 <= ny < h and 0 <= nx < w and frei[ny, nx] and not aussen[ny, nx]:
            aussen[ny, nx] = True
            q.append((ny, nx))
# Nur KLEINE eingeschlossene Weissflaechen sind Loecher im Objekt (ein weisses
# Tuch, ein Fensterlaibung). Eine grosse eingeschlossene Flaeche ist Himmel
# zwischen Seil, Schwengel und Pfosten und muss durchsichtig bleiben — genau
# daran ist der erste Brunnen-Schnitt gescheitert.
import scipy.ndimage as ndi  # noqa
loch = frei & ~aussen
mark, n = ndi.label(loch)
gross = np.zeros(n + 1, dtype=bool)
if n:
    zahl = np.bincount(mark.ravel(), minlength=n + 1)
    gross = zahl > 900
    gross[0] = True
alpha = np.where(loch & ~gross[mark], 1.0, alpha)

# Auf die Umrandung zuschneiden, dann einen leeren Rand anlegen.
ys, xs = np.where(alpha > 0.05)
y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
rgb = np.asarray(im, dtype=np.uint8)[y0:y1, x0:x1]
al = (alpha[y0:y1, x0:x1] * 255).astype(np.uint8)

H, W = al.shape
neu = np.zeros((H + 2 * rand, W + 2 * rand, 4), dtype=np.uint8)
neu[rand:rand + H, rand:rand + W, :3] = rgb
neu[rand:rand + H, rand:rand + W, 3] = al

# Die Kante weich auslaufen lassen: zwei Reihen ganz frei, acht weich.
A = neu[:, :, 3].astype(np.float32)
yy, xx = np.mgrid[0:A.shape[0], 0:A.shape[1]]
d = np.minimum.reduce([yy, xx, A.shape[0] - 1 - yy, A.shape[1] - 1 - xx]).astype(np.float32)
A *= np.clip((d - 1.0) / 8.0, 0, 1)
neu[:, :, 3] = A.astype(np.uint8)

Image.fromarray(neu, 'RGBA').save(ziel)
al = neu[:, :, 3]
print(f'{ziel}  {neu.shape[1]}x{neu.shape[0]}  '
      f'Kante max Alpha: {max(al[0].max(), al[-1].max(), al[:,0].max(), al[:,-1].max())}')
