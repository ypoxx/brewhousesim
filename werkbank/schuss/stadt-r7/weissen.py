#!/usr/bin/env python3
"""Weiss weiss machen, bevor freigestellt wird.

gen_image.py liefert JPEG. Ein JPEG-Weiss ist nicht (255,255,255), sondern
schwankt zwischen 249 und 255 und hat einen leichten Farbstich. Genau darauf
faellt die Freistellung herein: sie rechnet die Buntheit mit
(alpha = (246-hell)/14 + bunt/10), und ein Stich von 6 Stufen ergibt Alpha 0,6
auf leerem Hintergrund — das Bild wird als Ganzes "Objekt".

Also erst schnappen, dann freistellen:

    python3 werkbank/schuss/stadt-r7/weissen.py <roh.jpg> <sauber.png>
"""
import sys
import numpy as np
from PIL import Image

roh, ziel = sys.argv[1], sys.argv[2]
a = np.asarray(Image.open(roh).convert('RGB'), dtype=np.int16)
hell = a.min(axis=2)
bunt = a.max(axis=2) - a.min(axis=2)
weiss = (hell >= 242) & (bunt <= 14)
a[weiss] = 255
Image.fromarray(a.astype(np.uint8), 'RGB').save(ziel)
print(f'{ziel}  {weiss.mean() * 100:.1f} % der Flaeche auf reines Weiss geschnappt')
