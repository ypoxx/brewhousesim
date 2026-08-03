#!/usr/bin/env python3
"""DIE RUECKKOPPLUNG r3 — Auswertung, drei Laeufe je Epoche mit Spannweite.

  python3 auswerten.py /tmp/rk3/vorher/e*.json

Rechnet je Epoche und Lauf:
  * die KENNZAHL-Reihe, roh aus `BRAUHAUS.preis.leiter()` (Zahlen, nicht
    gesetzte Zeichen) und zum Vergleich die abgelesene LEITER-Tafel
  * rho ueber (Jahresnummer, Kennzahl) — SPEARMAN und PEARSON, beide genannt.
    Geurteilt wird nach SPEARMAN: das rechnet das vorhandene Geraet dieser
    Welle (werkbank/schuss/eichung/auswerten.py) und es ist die Frage nach
    der Rangfolge, nicht nach einer Geraden.
  * Jahre unter 1x, Spannweite ueber die Laeufe
  * Jahresmedian der WOECHENTLICH abgelesenen Kennzahl als Gegenprobe
  * Kasse und Nennerpreis je Jahr (Median) — der Treiber
"""
import json, sys, glob, statistics as st, collections


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


def f(x, n=3):
    return '—' if x is None else f'{x:+.{n}f}'.replace('.', ',')


dateien = sys.argv[1:] or sorted(glob.glob('/tmp/rk3/*/e*.json'))
proEpoche = collections.defaultdict(list)
for p in sorted(dateien):
    d = json.load(open(p))
    proEpoche[d['epoche']].append((p, d))

EPJ = {1: 1350, 2: 1600, 3: 1884, 4: 1970}
zus = {}

for ep in sorted(proEpoche):
    print('=' * 100)
    print(f'EPOCHE {EPJ.get(ep, ep)}')
    sp_alle, pe_alle, letzte = [], [], []
    for p, d in proEpoche[ep]:
        roh = [r for r in (d.get('leiterRoh') or []) if r.get('zugVerh')]
        werte = [r['zugVerh'] for r in roh]
        jahre = [r['jahr'] for r in roh]
        sp = spearman(jahre, werte)
        pe = pearson(jahre, werte)
        unter = sum(1 for w in werte if w < 1)
        sp_alle.append(sp)
        pe_alle.append(pe)
        letzte.append(werte[-1] if werte else None)
        name = p.split('/')[-1]
        reihe = ' · '.join(f'{w:.2f}'.replace('.', ',') for w in werte)
        print(f'  {name:16s} {len(werte):2d} J  Spearman {f(sp)}  Pearson {f(pe)}  '
              f'<1x {unter}/{len(werte)}  Fehler {len(d.get("fehler") or [])}  '
              f'Abbruch {"ja" if d.get("abgebrochen") else "nein"}  Fest {d.get("festGesetzt")}x')
        print(f'                   {reihe}')
        # Gegenprobe: Jahresmedian der woechentlich abgelesenen Kennzahl
        prj = collections.defaultdict(list)
        for w in d.get('reihe') or []:
            if w.get('deckung'):
                prj[w['jahr']].append(w['deckung'])
        js = sorted(prj)
        med = [st.median(prj[j]) for j in js]
        print(f'                   woechentlich: Spearman {f(spearman(js, med))} '
              f'ueber {len(js)} Jahre, Median {st.median(med):.2f}')
        # Treiber: Kasse und Nennerpreis je Jahr
        kj, nj = collections.defaultdict(list), collections.defaultdict(list)
        for w in d.get('reihe') or []:
            kj[w['jahr']].append(w['kasse'])
            if w.get('nennerPreis'):
                nj[w['jahr']].append(w['nennerPreis'])
        ks = [st.median(kj[j]) for j in js if j in kj]
        ns = [st.median(nj[j]) for j in js if j in nj]
        if len(ks) >= 3 and len(ns) >= 3:
            print(f'                   Kasse {ks[0]:.0f}→{ks[-1]:.0f} (x{ks[-1]/max(1,ks[0]):.2f})  '
                  f'Nenner {ns[0]:.0f}→{ns[-1]:.0f} (x{ns[-1]/max(1,ns[0]):.2f})  '
                  f'rho Kennzahl↔Kasse {f(spearman(ks[:len(med)], med[:len(ks)]))}')
    gs = [s for s in sp_alle if s is not None]
    gp = [s for s in pe_alle if s is not None]
    if gs:
        print(f'  >> SPEARMAN {min(gs):+.3f} .. {max(gs):+.3f}   Spannweite {max(gs)-min(gs):.3f}'
              .replace('.', ','))
        print(f'  >> PEARSON  {min(gp):+.3f} .. {max(gp):+.3f}   Spannweite {max(gp)-min(gp):.3f}'
              .replace('.', ','))
        urteil = 'BESTEHT' if max(abs(x) for x in gs) < 0.700 else 'REISST'
        print(f'  >> LATTE |rho| < 0,700 nach Spearman: {urteil}')
        zus[ep] = (min(gs), max(gs), urteil)

print('=' * 100)
for ep in sorted(zus):
    a, b, u = zus[ep]
    print(f'{EPJ.get(ep, ep)}  Spearman {a:+.3f} .. {b:+.3f}   {u}'.replace('.', ','))
