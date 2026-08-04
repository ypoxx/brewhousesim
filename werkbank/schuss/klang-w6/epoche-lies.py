#!/usr/bin/env python3
"""Zaehlt die dritte Latte aus: still gegen gespielt, drei Durchgaenge.

Der Schluessel wird ERST HIER gelesen — vorher hat ihn niemand gesehen, auch
der nicht, der die Fragen gestellt hat. Ein Ausfall (Verweigerung, HTTP 429)
ist keine Messung und wird gezaehlt, nie als Fehlgriff des Spiels gebucht.
"""
import json, pathlib, re, sys

antworten = json.loads(pathlib.Path(sys.argv[1]).read_text())
schluessel = json.loads(pathlib.Path(sys.argv[2]).read_text())

def soll(quelle):
    m = re.search(r'e([1-4])-', quelle)
    return int(m.group(1)) if m else None

def art(quelle):
    return 'still' if 'still' in quelle else 'gespielt'

zaehler = {'still': [0, 0], 'gespielt': [0, 0]}
ausfall = 0
zeilen = []
for s in antworten:
    quelle = schluessel.get(s['datei'], '?')
    if s.get('ausfall') or s.get('abbruch'):
        ausfall += 1
        zeilen.append((s['durchgang'], s['datei'], quelle, None, None))
        continue
    e = int(s.get('epoche') or 0)
    a = art(quelle)
    zaehler[a][1] += 1
    if e == soll(quelle):
        zaehler[a][0] += 1
    zeilen.append((s['durchgang'], s['datei'], quelle, e, s.get('sicher')))

for z in sorted(zeilen):
    print('D%d %-14s %-16s gehoert %s (sicher %s)%s'
          % (z[0], z[1], z[2].replace('.wav', ''), z[3] if z[3] else 'AUSFALL', z[4],
             '' if z[3] is None or z[3] == soll(z[2]) else '   FALSCH'))
print()
for a in ('still', 'gespielt'):
    t, g = zaehler[a]
    print('%-9s %2d/%-2d = %s' % (a, t, g, ('%d %%' % round(100 * t / g)) if g else '—'))
if ausfall:
    print('%d Messung(en) ausgefallen — kein Urteil ueber das Spiel.' % ausfall)
