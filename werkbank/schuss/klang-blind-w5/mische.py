#!/usr/bin/env python3
"""Mischt die acht Aufnahmen auf neutrale Namen und versiegelt den Schluessel.

Der Schluessel wird geschrieben und NICHT gelesen, bis die Antworten stehen.
Das Ohr sieht ohnehin nur die Bytes (hoerer.py schickt keinen Dateinamen mit,
nachgesehen in hoere(): es gehen FRAGE und inlineData hinaus, sonst nichts) —
die Mischung schuetzt den Pruefer vor sich selbst.
"""
import json, pathlib, random, shutil, sys

roh = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'werkbank/schuss/klang-blind-w5/roh')
ziel = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else 'werkbank/schuss/klang-blind-w5/blind')
ziel.mkdir(parents=True, exist_ok=True)

dateien = sorted(roh.glob('*.wav'))
random.Random(20260803).shuffle(dateien)

schluessel = {}
for i, q in enumerate(dateien, 1):
    name = 'probe-%02d.wav' % i
    shutil.copy(q, ziel / name)
    schluessel[name] = q.name

(ziel / 'schluessel.json').write_text(json.dumps(schluessel, indent=1))
print('%d Proben gemischt nach %s' % (len(dateien), ziel))
