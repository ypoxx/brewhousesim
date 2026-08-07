#!/usr/bin/env python3
"""ABNAHME WELLE 12 — dieselbe Saat, dieselbe Partie?

  python3 werkbank/schuss/rahmen-w12/auswerten-abnahme.py <ordner> [<ordner>…]

Je Ordner und Epoche:
  * wieviele VERSCHIEDENE PARTIEN in den Laeufen stecken (md5 der
    Ergebnisdatei — INNERHALB eines Standes ist sie aussagekraeftig)
  * zur Gegenprobe die Partie-Kennung ohne Dateiformat: Kassenspanne,
    Schlussstand, Jahresreihe der Kennzahl. Diese vergleicht auch ueber
    Staende hinweg (die md5 tut das nicht, siehe rahmen-w10/ARBEITSSTAND.md,
    „Eine Falle in der Pruefsumme")
  * rho ueber drei Schnitte (12/13/14 Braujahre), Spearman — Latte 0,700
  * Jahre unter 1x — erlaubt ist eines von sechs
  * Seitenfehler

Die harte Abnahme lautet: 1350 SECHSMAL eine Pruefsumme, 1600/1884/1970 je
DREIMAL eine.
"""
import json, sys, glob, os, hashlib, collections


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
    return '   —  ' if x is None else f'{x:+.3f}'.replace('.', ',')


EPJ = {1: 1350, 2: 1600, 3: 1884, 4: 1970}
SOLL = {1: 6, 2: 3, 3: 3, 4: 3}


def partie(d):
    """Die PARTIE, unabhaengig vom Dateiformat und vom Knopftext."""
    roh = [r for r in (d.get('leiterRoh') or []) if r.get('zugVerh')]
    return json.dumps({
        'kasse': [d['kasseMin'], d['kasseMax']],
        'schluss': d['schluss'],
        'wochen': d['wochen'],
        'reihe': [[r['jahr'], round(r['zugVerh'], 6)] for r in roh],
    }, sort_keys=True)


ordner = sys.argv[1:]
if not ordner:
    print(__doc__)
    sys.exit(1)

for o in ordner:
    print(f'\n=== {o} ===')
    print(f"{'Epoche':7s} {'Laeufe':>6s} {'md5':>5s} {'Partien':>7s}  "
          f"{'12 J':>7s} {'13 J':>7s} {'14 J':>7s} {'<1x':>6s} {'Fehler':>6s}  Urteil")
    print('-' * 92)
    alleGut = True
    for ep in (1, 2, 3, 4):
        dat = sorted(glob.glob(f'{o}/e{ep}-*.json'))
        if not dat:
            continue
        md5s, partien, zeilen, unter, fehler = [], [], [], [], 0
        for p in dat:
            md5s.append(hashlib.md5(open(p, 'rb').read()).hexdigest()[:8])
            d = json.load(open(p))
            partien.append(partie(d))
            fehler += len(d.get('fehler') or [])
            roh = [r for r in (d.get('leiterRoh') or []) if r.get('zugVerh')]
            j = [r['jahr'] for r in roh]
            w = [r['zugVerh'] for r in roh]
            zeilen.append([spearman(j[:n], w[:n]) if len(w) >= n else None for n in (12, 13, 14)])
            unter.append(f"{sum(1 for x in w if x < 1)}/{len(w)}")
        nMd5, nPartie = len(set(md5s)), len(set(partien))
        riss = any(r is not None and abs(r) >= 0.700 for z in zeilen for r in z)
        gut = (nPartie == 1 and nMd5 == 1 and len(dat) >= SOLL[ep] and not riss and fehler == 0)
        alleGut = alleGut and gut
        urteil = 'BESTANDEN' if gut else 'NICHT BESTANDEN'
        if len(dat) < SOLL[ep]:
            urteil += f' (nur {len(dat)} von {SOLL[ep]} Laeufen)'
        if nPartie > 1:
            urteil += f' — {nPartie} PARTIEN'
        if riss:
            urteil += ' — LATTE GERISSEN'
        if fehler:
            urteil += f' — {fehler} SEITENFEHLER'
        z = zeilen[0]
        print(f'{EPJ[ep]:<7d} {len(dat):>6d} {nMd5:>5d} {nPartie:>7d}  '
              f'{f(z[0]):>7s} {f(z[1]):>7s} {f(z[2]):>7s} {unter[0]:>6s} {fehler:>6d}  {urteil}')
        if nMd5 > 1:
            for p, m, in zip(dat, md5s):
                d = json.load(open(p))
                print(f'        {os.path.basename(p):16s} md5 {m}  Kasse {d["kasseMin"]}–{d["kasseMax"]}')
        if nPartie > 1:
            for p, pa in zip(dat, partien):
                print(f'        {os.path.basename(p):16s} partie {hashlib.md5(pa.encode()).hexdigest()[:8]}')
    print('-' * 92)
    print('URTEIL: ' + ('EINE SAAT, EINE PARTIE — abnehmbar' if alleGut
                        else 'NICHT ABNEHMBAR (siehe Zeilen oben)'))
