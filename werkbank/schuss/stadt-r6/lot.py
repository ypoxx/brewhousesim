#!/usr/bin/env python3
"""DAS LOT, Teil 2: die Auswertung.

Je Aufbau die Differenzmaske gegen den leeren Hof, je Spalte die UNTERSTE
geaenderte Zeile, verglichen mit der Mauerlinie der vier Platten. Wer unter
der Linie zeichnet, steht auf der Mauer oder in der Luft darueber.

    python3 werkbank/schuss/stadt-r6/lot.py <ordner>
"""
import json
import sys
import pathlib
import numpy as np
from PIL import Image

ORDNER = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'werkbank/schuss/stadt-r6/lot')
B, H = 2752, 1536

X = np.arange(B, dtype=np.float64)
MAUER = np.where(X <= 823, 1205 - 0.49 * (823 - X), 1205 - 0.45 * (X - 823))


def lade(p):
    return np.asarray(Image.open(p).convert('RGB'), dtype=np.int16)


def main():
    zeilen = []
    for ep in (1, 2, 3, 4):
        grund_p = ORDNER / f'e{ep}-keine.png'
        if not grund_p.exists():
            continue
        grund = lade(grund_p)
        for p in sorted(ORDNER.glob(f'e{ep}-*.png')):
            s = p.stem.split('-', 1)[1]
            if s == 'keine':
                continue
            bild = lade(p)
            d = np.abs(bild - grund).sum(axis=2) > 24
            zahl = int(d.sum())
            spalten = d.any(axis=0)
            if not spalten.any():
                zeilen.append(dict(epoche=ep, schluessel=s, pixel=0, breit=0,
                                   tiefe=None, x=None, unter=0))
                continue
            ys = np.where(d.any(axis=1))[0]
            unten = np.where(spalten, (H - 1) - np.argmax(d[::-1], axis=0), -1)
            ueber = np.where(spalten, unten - MAUER, -1e9)
            i = int(np.argmax(ueber))
            zeilen.append(dict(epoche=ep, schluessel=s, pixel=zahl,
                               breit=int(spalten.sum()),
                               tiefe=round(float(ueber[i]), 1), x=i,
                               unter=int((ueber > 15).sum()),
                               oben=int(ys[0]), tiefsteZeile=int(unten[i])))
    zeilen.sort(key=lambda z: (z['epoche'], -(z['tiefe'] or -9999)))
    for z in zeilen:
        mark = '  <<<' if (z['tiefe'] or -999) > 15 else ''
        print(f"E{z['epoche']} {z['schluessel']:<18} px={z['pixel']:>7}"
              f"  unter der Mauer: {str(z['tiefe']):>7} px bei x={z['x']}"
              f"   {z['unter']}/{z['breit']} Spalten{mark}")
    (ORDNER / 'lot.json').write_text(json.dumps(zeilen, indent=1))
    print('\ngeschrieben:', ORDNER / 'lot.json')


main()
