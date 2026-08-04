#!/usr/bin/env python3
"""Wie oft schlaegt das NACHBARHOF-Zeichen wirklich an?

Der Mitschnitt haelt jeden `spiele()`-Ruf fest. Welche Namen `nachbar: true`
tragen, steht im KATALOG von kern/ton.js; die Drossel NACHBAR_PAUSE steht
daneben. Beides wird hier aus der Datei gelesen, nicht abgeschrieben.
"""
import json, pathlib, re, sys

TON = pathlib.Path('/home/user/brewhousesim/spiel/kern/ton.js').read_text()
NACHBARN = set(re.findall(r"'([a-z]+:[a-zA-Z]+)':\s*\{[^}]*nachbar:\s*true", TON))
m = re.search(r'var NACHBAR_PAUSE = ([0-9.]+)', TON)
PAUSE = float(m.group(1)) if m else 4.5
m = re.search(r'var NACHBAR_DAUER = ([0-9.]+)', TON)
DAUER = float(m.group(1)) if m else 3.2

print('nachbar-Namen im Katalog: %d   PAUSE %.2f s   DAUER %.2f s' % (len(NACHBARN), PAUSE, DAUER))
for pfad in sorted(sys.argv[1:]):
    d = json.loads(pathlib.Path(pfad).read_text())
    ruf = [(e['t'], e['name']) for e in d['mitschnitt'] if e['name'] in NACHBARN]
    letzt, zeichen = None, []
    for t, n in ruf:
        if letzt is None or t - letzt >= PAUSE:
            letzt = t
            zeichen.append((t, n))
    print('%-22s  nachbar-Zuege %2d  ZEICHEN %d  bei %s'
          % (pathlib.Path(pfad).stem, len(ruf), len(zeichen),
             ' · '.join('%.1f s (%s)' % (t, n) for t, n in zeichen) or '—'))
