#!/usr/bin/env python3
"""DER PREIS, Welle 5 — was diese Runde zaehlt, in einer Tabelle.

    python3 werkbank/schuss/preis-w5/auswerten.py <vorher-dir> <nachher-dir>

Die Spearman-Rechnung selbst steht NICHT hier: dafuer laeuft
`werkbank/schuss/rueckkopplung-r3/auswerten.py` unveraendert weiter, damit die
Zahl dieser Runde mit der Zahl der Welle 4 aus demselben Geraet kommt. Hier
steht nur, was die Welle-4-Auswertung nicht kennt: die Festlegungen der
Chronik, der Kassenboden und der Vorgriff.
"""
import json, sys, glob, os, collections

EPJ = {1: '1350', 2: '1600', 3: '1884', 4: '1970'}


def lies(d, muster):
    aus = collections.defaultdict(list)
    for p in sorted(glob.glob(os.path.join(d, muster))):
        j = json.load(open(p))
        aus[j['epoche']].append((os.path.basename(p), j))
    return aus


def spanne(werte):
    if not werte:
        return '—'
    if len(set(werte)) == 1:
        return f'{werte[0]}'
    return f'{min(werte)}…{max(werte)}'


def block(titel, ordner, muster='e?-?.json'):
    print('=' * 78)
    print(titel, f'({ordner})')
    print(f"{'Epoche':7} {'Laeufe':>6} {'festlegung':>11} {'Kasse min':>10} "
          f"{'Vorgriffe':>10} {'Rueckst. max':>13} {'Fehler':>7}")
    print('-' * 78)
    d = lies(ordner, muster)
    for e in sorted(d):
        laeufe = d[e]
        fest = [len(j.get('chronik', {}).get('festZeilen', [])) for _, j in laeufe]
        kmin = [j['kasseMin'] for _, j in laeufe]
        vg, rs = [], []
        for _, j in laeufe:
            roh = j.get('leiterRoh') or []
            vg.append(sum(1 for r in roh if r.get('vorgriff')))
            rs.append(max([r.get('rueckstand', 0) or 0 for r in roh] or [0]))
        fehl = sum(len(j['fehler']) for _, j in laeufe)
        print(f'{EPJ.get(e, e):7} {len(laeufe):>6} {spanne(fest):>11} {spanne(kmin):>10} '
              f'{spanne(vg):>10} {spanne(rs):>13} {fehl:>7}')


def willig(ordner):
    print('-' * 78)
    print('festlegungswillige Hand (hand-fest.mjs):')
    for p in sorted(glob.glob(os.path.join(ordner, 'willig-e?.json'))):
        j = json.load(open(p))
        z = j.get('chronik', {}).get('festZeilen', [])
        print(f"  {EPJ.get(j['epoche']):6} {len(z)} Festlegungen  "
              + ', '.join(f"{x['jahr']}/{x['woche']}" for x in z))
        print(f"         KNOPF: {j.get('knopfText')}")


def boden(ordner):
    ps = sorted(glob.glob(os.path.join(ordner, 'boden-e?.json')))
    if not ps:
        return
    print('-' * 78)
    print('KASSENBODEN, grobe Hand wie spielprobe.mjs, 60 Wochen:')
    print(f"  {'Epoche':7} {'Kasse Ende':>11} {'tiefst':>9} {'Wochen <=0':>11} {'Wochen <0':>10}")
    for p in ps:
        j = json.load(open(p))
        r = j['reihe']
        k = [x['kasse'] for x in r]
        print(f"  {EPJ.get(j['epoche']):7} {k[-1]:>11} {min(k):>9} "
              f"{sum(1 for x in k if x <= 0):>11} {sum(1 for x in k if x < 0):>10}")


if __name__ == '__main__':
    a = sys.argv[1] if len(sys.argv) > 1 else None
    b = sys.argv[2] if len(sys.argv) > 2 else None
    if a:
        block('VORHER', a, 'e?.json' if not glob.glob(os.path.join(a, 'e?-?.json')) else 'e?-?.json')
        willig(a)
        boden(a)
    if b:
        block('NACHHER', b)
        willig(b)
        boden(b)
