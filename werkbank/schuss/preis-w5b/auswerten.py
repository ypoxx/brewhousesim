#!/usr/bin/env python3
"""DER PREIS, Welle 5 — Nacharbeit: was Auflage 4 zaehlt.

  python3 auswerten.py /tmp/pn5

Liest die Laeufe von `linie.mjs` (mit `WILL=1` die Hand, die Festlegungen
will) und zaehlt genau das, was der blinde Kritiker gezaehlt hat:

  * Festlegungen in vierzehn Braujahren
  * Michaelitage OHNE eine einzige bezahlbare Festlegung
  * Michaelitage mit LEERER Festlegungsreihe (Katalog aufgebraucht)
  * je Karte: in wie vielen Jahren sie auf der Tafel lag und bezahlbar war

Dazu die Gegenprobe zur Wellenzahl: fuer jede Karte der engste Abstand ihrer
Taxe zur 45-Prozent-Schwelle der Vorbild-Hand. Wird er negativ, greift die
Vorbild-Hand zu und die Wellenzahl bewegt sich.
"""
import json, sys, os, collections

ORT = sys.argv[1] if len(sys.argv) > 1 else '/tmp/pn5'
JAHR0 = {1: 1350, 2: 1600, 3: 1884, 4: 1970}


def lies(p):
    return json.load(open(p)) if os.path.exists(p) else None


def zaehle(d):
    leer_bezahlbar = leer_tafel = 0
    proKarte = collections.Counter()
    tafelKarten = collections.Counter()
    for t in d['taxen']:
        auf = [k for k in t['t']['karten'] if k['aufTafel']]
        bez = [k for k in auf if k['bezahlbar']]
        if not auf:
            leer_tafel += 1
        if not bez:
            leer_bezahlbar += 1
        for k in bez:
            proKarte[k['k']] += 1
        for k in auf:
            tafelKarten[k['k']] += 1
    return leer_bezahlbar, leer_tafel, proKarte, tafelKarten, len(d['taxen'])


print('EPOCHE   Festlegungen   Michaelitage OHNE bezahlbare   Tafel ganz leer')
for e in (1, 2, 3, 4):
    zeile = []
    for marke in ('vorher', 'nachher'):
        d = lies(f'{ORT}/{marke}-will-e{e}.json')
        if not d:
            zeile.append(None)
            continue
        lb, lt, pk, tk, n = zaehle(d)
        zeile.append((d['festGesetzt'], lb, lt, n, pk))
    if zeile[0] and zeile[1]:
        v, na = zeile[0], zeile[1]
        print(f'{JAHR0[e]}       {v[0]} -> {na[0]}          '
              f'{v[1]}/{v[3]} -> {na[1]}/{na[3]}                 {v[2]}/{v[3]} -> {na[2]}/{na[3]}')
        alle = sorted(set(list(v[4].keys()) + list(na[4].keys())))
        for k in alle:
            print(f'      {k:<16} bezahlbar in Jahren: {v[4][k]} -> {na[4][k]}')
    elif zeile[1]:
        na = zeile[1]
        print(f'{JAHR0[e]}       {na[0]}   {na[1]}/{na[3]}   {na[2]}/{na[3]}')
