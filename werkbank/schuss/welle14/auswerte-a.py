#!/usr/bin/env python3
"""Fasst die Frage-A-Laeufe (hand-suchend.mjs) je Epoche zusammen.
Liest werkbank/schuss/welle14/protokoll/e<EP>-such-<N>-ergebnis.json
"""
import json, glob, statistics as st, collections, sys

WURZ = '/home/user/brewhousesim/werkbank/schuss/welle14/protokoll'

def komma(x, n=2):
    if x is None: return '-'
    return f"{x:.{n}f}".replace('.', ',')

for ep in [1, 2, 3, 4]:
    dateien = sorted(glob.glob(f'{WURZ}/e{ep}-such-*-ergebnis.json'))
    if not dateien:
        print(f"EPOCHE {ep}: keine Ergebnisse")
        continue
    laeufe = []
    for d in dateien:
        with open(d) as f:
            laeufe.append(json.load(f))
    print(f"\n=== EPOCHE {ep} — {len(laeufe)} Lauf/Laeufe ===")
    for l in laeufe:
        print(f"  {l['lauf']:14s} braujahre={l.get('braujahre')} "
              f"bis={l.get('jahrEnde')}/{l.get('wocheEnde')} "
              f"kasseEnde={l.get('kasseEnde')} "
              f"endgrund={l.get('endgrund')} abbruch={(l.get('abbruch') or {}).get('grund')} "
              f"deckungMedian={komma(l.get('deckungMedian'))} "
              f"ersteWocheDauerhaftUnter1x={l.get('ersteWocheDauerhaftUnter1x')} "
              f"pruefsumme={l.get('pruefsumme')} "
              f"echteWochen={l.get('echteWochenGesamt')}")
    gruende = collections.Counter()
    for l in laeufe:
        g = l.get('endgrund') or ('abbruch:' + (l.get('abbruch') or {}).get('grund', '?'))
        gruende[g] += 1
    print(f"  Endgruende/Abbruch-Verteilung: {dict(gruende)}")
    braujahre = [l.get('braujahre') for l in laeufe if l.get('braujahre') is not None]
    if braujahre:
        print(f"  Braujahre: min={min(braujahre)} max={max(braujahre)} median={komma(st.median(braujahre),1)}")
    pruefsummen = [l.get('pruefsumme') for l in laeufe]
    print(f"  Pruefsummen (roh, inkl. Erkundungsreihenfolge) gleich: {len(set(pruefsummen))==1} ({pruefsummen})")
    pw = [l.get('pruefsummeWochen') for l in laeufe]
    if any(pw):
        print(f"  Pruefsummen (nur Wochenreihe, wirtschaftlich) gleich: {len(set(pw))==1} ({pw})")
