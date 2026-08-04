#!/usr/bin/env python3
"""BLINDER KRITIKER · DIE FUHRE · Welle 6 — rho ueber DREI SCHNITTE.

Die Latte ist seit dem 4. August dreifach geschnitten: 12, 13 und 14
Braujahre, und sie reisst, sobald EINER davon ueber 0,7 liegt. Ein 400-Wochen-
Lauf traegt alle drei Schnitte in sich — sie werden hier aus DERSELBEN Reihe
genommen, nicht in drei Laeufen gemessen.

Gerechnet wird Spearman ueber (Jahr, Kennzahl) aus `leiterRoh[].zugVerh` —
das ist die Zahl, die das Spiel selbst je Braujahr auf die Leiter schreibt.

  python3 rho.py <ordner mit e<ep>-<lauf>.json>
"""
import json, glob, os, sys, collections

def pearson(xs, ys):
    n = len(xs)
    if n < 3: return None
    mx, my = sum(xs)/n, sum(ys)/n
    num = sum((a-mx)*(b-my) for a, b in zip(xs, ys))
    den = (sum((a-mx)**2 for a in xs) * sum((b-my)**2 for b in ys)) ** .5
    return num/den if den else None

def raenge(v):
    s = sorted(range(len(v)), key=lambda i: v[i])
    r = [0]*len(v); i = 0
    while i < len(s):
        j = i
        while j+1 < len(s) and v[s[j+1]] == v[s[i]]: j += 1
        m = (i+j)/2 + 1
        for k in range(i, j+1): r[s[k]] = m
        i = j+1
    return r

def spearman(xs, ys):
    if len(xs) < 3: return None
    return pearson(raenge(xs), raenge(ys))

EPJ = {1: 1350, 2: 1600, 3: 1884, 4: 1970}
ORD = sys.argv[1] if len(sys.argv) > 1 else '.'
SCHNITTE = (12, 13, 14)

def z(x): return '—' if x is None else f'{x:+.3f}'.replace('.', ',')

zeilen = []
riss = []
print('| Epoche | Lauf | 12 Braujahre | 13 | 14 | Jahre <1× | Kennzahl min–max | Fehler | Abbruch |')
print('|---|---|---|---|---|---|---|---|---|')
je_ep = collections.defaultdict(lambda: collections.defaultdict(list))
for ep in (1, 2, 3, 4):
    for p in sorted(glob.glob(f'{ORD}/e{ep}-*.json')):
        d = json.load(open(p))
        roh = [r for r in (d.get('leiterRoh') or []) if r.get('zugVerh')]
        j = [r['jahr'] for r in roh]; w = [r['zugVerh'] for r in roh]
        sp = {}
        for n in SCHNITTE:
            sp[n] = spearman(j[:n], w[:n]) if len(w) >= n else None
            if sp[n] is not None: je_ep[ep][n].append(sp[n])
            if sp[n] is not None and abs(sp[n]) > 0.7:
                riss.append((EPJ[ep], os.path.basename(p), n, sp[n]))
        print(f'| {EPJ[ep]} | {os.path.basename(p)[3:-5]} | '
              + ' | '.join(z(sp[n]) for n in SCHNITTE)
              + f' | {sum(1 for x in w if x < 1)}/{len(w)} '
              + f'| {min(w):.2f}–{max(w):.2f}× '.replace('.', ',')
              + f'| {len(d.get("fehler") or [])} '
              + f'| {"JA — " + str(d["abgebrochen"].get("grund")) if d.get("abgebrochen") else "nein"} |')

print()
print('| Epoche | 12 Braujahre | 13 | 14 | groesste Spannweite ueber die Laeufe |')
print('|---|---|---|---|---|')
for ep in (1, 2, 3, 4):
    if not je_ep[ep]: continue
    zellen, sw = [], 0
    for n in SCHNITTE:
        v = je_ep[ep][n]
        if not v: zellen.append('—'); continue
        sw = max(sw, max(v)-min(v))
        gleich = (max(v)-min(v)) < 1e-9
        zellen.append(z(v[0]) + ('' if gleich else ' … ' + z(v[-1])) + f' ({len(v)}×)')
    print(f'| {EPJ[ep]} | ' + ' | '.join(zellen) + f' | {sw:.3f} |'.replace('.', ','))

print()
if riss:
    print('**REISST** (|rho| > 0,7):')
    for e, p, n, v in riss: print(f'  {e}  {p}  {n} Braujahre  {z(v)}')
else:
    print('**Kein Schnitt ueber 0,7 in keinem Lauf.**')
