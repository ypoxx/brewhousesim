#!/usr/bin/env python3
"""DREI SCHNITTE — rho ueber 12, 13 und 14 Braujahre.

  python3 schnitte.py /tmp/sudnach/rho/e*.json

Seit dem 4. August 2026 bindend (gauntlet/MESSLATTE.md, Abschnitt 2):
„Wer rho nennt, nennt die Laufzeit dazu, und misst ueber ALLE DREI SCHNITTE
(12, 13, 14 Braujahre). Die Latte ist gerissen, sobald EINER davon ueber 0,7
liegt."

Dieses Geraet steht NEBEN werkbank/schuss/rueckkopplung-r3/auswerten.py und
dreht es nicht (Sperrliste 7 des blinden Kritikers). Es rechnet dieselbe Zahl
auf dieselbe Weise — Spearman ueber (Jahresnummer, zugVerh) aus `leiterRoh` —
und schneidet die Reihe nur zusaetzlich nach vorn ab. Bei 14 Braujahren muss
es Ziffer fuer Ziffer dasselbe liefern wie auswerten.py; das ist die
eingebaute Gegenprobe.
"""
import json, sys, glob, collections


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
        mittel = (i + j) / 2 + 1
        for k in range(i, j + 1):
            r[s[k]] = mittel
        i = j + 1
    return r


def spearman(xs, ys):
    if len(xs) < 3:
        return None
    return pearson(raenge(xs), raenge(ys))


def f(x):
    return '  —   ' if x is None else f'{x:+.3f}'.replace('.', ',')


SCHNITTE = (12, 13, 14)
EPJ = {1: 1350, 2: 1600, 3: 1884, 4: 1970}

dateien = sys.argv[1:] or sorted(glob.glob('/tmp/sudnach/rho/e*.json'))
proEpoche = collections.defaultdict(list)
for p in sorted(dateien):
    d = json.load(open(p))
    proEpoche[d['epoche']].append((p, d))

gesamt = {}
for ep in sorted(proEpoche):
    print('=' * 92)
    print(f'EPOCHE {EPJ.get(ep, ep)}')
    proSchnitt = collections.defaultdict(list)
    unterAlle = []
    for p, d in proEpoche[ep]:
        roh = [r for r in (d.get('leiterRoh') or []) if r.get('zugVerh')]
        werte = [r['zugVerh'] for r in roh]
        jahre = [r['jahr'] for r in roh]
        zeile, u = [], None
        for n in SCHNITTE:
            if len(werte) >= n:
                s = spearman(jahre[:n], werte[:n])
                proSchnitt[n].append(s)
                zeile.append(f'{n}J {f(s)}')
            else:
                zeile.append(f'{n}J  fehlt')
        u = sum(1 for w in werte if w < 1)
        unterAlle.append(u)
        name = p.split('/')[-1]
        print(f'  {name:14s} {len(werte):2d} J   ' + '   '.join(zeile)
              + f'   <1x {u}/{len(werte)}   Fehler {len(d.get("fehler") or [])}'
              + f'   Abbruch {"ja" if d.get("abgebrochen") else "nein"}')
        print('                 ' + ' · '.join(f'{w:.2f}'.replace('.', ',') for w in werte))
    zus = []
    for n in SCHNITTE:
        v = [x for x in proSchnitt[n] if x is not None]
        if not v:
            continue
        spann = max(v) - min(v)
        riss = max(abs(x) for x in v) > 0.700
        zus.append((n, min(v), max(v), spann, riss))
        print(f'  >> {n} Braujahre: Spearman {f(min(v))} bis {f(max(v))}  '
              f'Spannweite {spann:.3f}'.replace('.', ',')
              + f'  {"REISST" if riss else "haelt"}')
    riss = any(z[4] for z in zus)
    print(f'  >> Jahre unter 1x: {unterAlle}   '
          f'>> LATTE ueber alle drei Schnitte: {"REISST" if riss else "BESTEHT"}')
    gesamt[ep] = (zus, riss, unterAlle)

print('=' * 92)
print(f'{"Epoche":8s} {"12 Braujahre":>26s} {"13":>26s} {"14":>26s}')
for ep in sorted(gesamt):
    zus, riss, _ = gesamt[ep]
    d = {n: (a, b, s) for n, a, b, s, _r in zus}
    sp = []
    for n in SCHNITTE:
        if n in d:
            a, b, s = d[n]
            sp.append(f'{f(a)} bis {f(b)} (±{s:.3f})'.replace('.', ','))
        else:
            sp.append('—')
    print(f'{EPJ.get(ep, ep):<8} ' + ' '.join(f'{x:>26s}' for x in sp)
          + ('   REISST' if riss else '   besteht'))
