#!/usr/bin/env python3
"""rho ueber DREI SCHNITTE — 12, 13 und 14 Braujahre.

MESSLATTE.md §2 verlangt seit dem 4. August 2026 alle drei Schnitte, und die
Latte ist gerissen, sobald EINER ueber 0,700 liegt. Das vorhandene Geraet
werkbank/schuss/rueckkopplung-r3/auswerten.py rechnet rho nur ueber die volle
Reihe; dieses hier schneidet zusaetzlich auf die ersten 12 bzw. 13 Jahre.

  python3 werkbank/schuss/fuhre-w6/schnitte.py <ordner…>

Ein Ordner je Satz, darin e<epoche>-<buchstabe>.json aus
werkbank/schuss/rueckkopplung-r3/linie.mjs.

WARUM ES IM REPO LIEGT UND NICHT IM SCRATCHPAD: der Container-Reset am
4. August 2026 um 20:21 UTC hat /tmp geloescht, und mit ihm die erste Fassung
dieses Skripts. tor.mjs daneben traegt denselben Satz aus demselben Grund.
Gerechnet wird Spearman, wie in auswerten.py — die Frage ist die nach der
Rangfolge, nicht die nach einer Geraden.
"""
import json, sys, glob, os


def pearson(xs, ys):
    n = len(xs)
    if n < 3:
        return None
    mx, my = sum(xs) / n, sum(ys) / n
    num = sum((a - mx) * (b - my) for a, b in zip(xs, ys))
    den = (sum((a - mx) ** 2 for a in xs) * sum((b - my) ** 2 for b in ys)) ** .5
    return num / den if den else None


def raenge(v):
    s = sorted(range(len(v)), key=lambda i: v[i])
    r = [0] * len(v)
    i = 0
    while i < len(s):
        j = i
        while j + 1 < len(s) and v[s[j + 1]] == v[s[i]]:
            j += 1
        m = (i + j) / 2 + 1
        for k in range(i, j + 1):
            r[s[k]] = m
        i = j + 1
    return r


def spearman(xs, ys):
    if len(xs) < 3:
        return None
    return pearson(raenge(xs), raenge(ys))


def f(x):
    return '  —   ' if x is None else f'{x:+.3f}'.replace('.', ',')


EPJ = {1: 1350, 2: 1600, 3: 1884, 4: 1970}
ordner = sys.argv[1:]
if not ordner:
    print(__doc__)
    sys.exit(1)

print(f"{'Epoche':8s} {'Satz':12s} {'12 J':>8s} {'13 J':>8s} {'14 J':>8s}   Urteil")
print('-' * 70)
gesamt = {}
for ep in (1, 2, 3, 4):
    for o in ordner:
        for p in sorted(glob.glob(f'{o}/e{ep}-*.json')):
            d = json.load(open(p))
            roh = [r for r in (d.get('leiterRoh') or []) if r.get('zugVerh')]
            j = [r['jahr'] for r in roh]
            w = [r['zugVerh'] for r in roh]
            zeile, riss = [], False
            for n in (12, 13, 14):
                r = spearman(j[:n], w[:n]) if len(w) >= n else None
                zeile.append(r)
                if r is not None and abs(r) >= 0.700:
                    riss = True
            name = os.path.basename(o.rstrip('/'))
            print(f'{EPJ[ep]:<8d} {name:12s} {f(zeile[0]):>8s} {f(zeile[1]):>8s} '
                  f'{f(zeile[2]):>8s}   {"REISST" if riss else "besteht"}   '
                  f'({len(w)} J, Kasse {d["kasseMin"]}–{d["kasseMax"]}, '
                  f'Fehler {len(d.get("fehler") or [])}'
                  f'{", ABBRUCH" if d.get("abgebrochen") else ""})')
            gesamt.setdefault(name, []).append(riss)
print('-' * 70)
for name, rs in gesamt.items():
    print(f'{name:12s}: {"LATTE GERISSEN" if any(rs) else "LATTE HAELT"} '
          f'({sum(rs)} von {len(rs)} Laeufen ueber 0,700)')
