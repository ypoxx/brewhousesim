#!/usr/bin/env python3
"""AUSWERTUNG des blinden Kritikers — eigenes Geraet neben eichung/auswerten.py.

  python3 auswerten-rk.py /tmp/rk/e*-*.json

Rechnet je Epoche und je Lauf:
  * die LEITER-Reihe, wie das Spiel sie selbst je Jahr ins Bild schreibt
  * rho ueber (Jahresnummer, Kennzahl) — PEARSON und SPEARMAN, beide genannt
  * Jahre unter 1x
  * zusaetzlich, unabhaengig von der LEITER: der Jahresmedian der WOECHENTLICH
    abgelesenen Kopfzeile .deckung
  * Spalten (a) Preisentscheidungen aktiv+erreichbar, (b) Festlegungen,
    (c) Zuege des Gegners
  * wer den Nenner stellt
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


dateien = sys.argv[1:] or sorted(glob.glob('/tmp/rk/e*-*.json'))
proEpoche = collections.defaultdict(list)

for p in sorted(dateien):
    d = json.load(open(p))
    proEpoche[d['epoche']].append((p, d))

zus = {}
for ep in sorted(proEpoche):
    print('=' * 104)
    print(f'EPOCHE {ep}')
    zus[ep] = []
    for p, d in proEpoche[ep]:
        L = d['leiter']
        mal = [x['mal'] for x in L]
        jahre = [int(x['jahr']) for x in L]
        idx = list(range(len(mal)))
        rp = pearson(idx, mal)
        rs = spearman(idx, mal)
        u1 = sum(1 for m in mal if m < 1)
        # unabhaengige Reihe: Jahresmedian der woechentlich abgelesenen Kopfzeile
        proJahr = collections.defaultdict(list)
        for x in d['reihe']:
            if x['deckung'] is not None:
                proJahr[x['jahr']].append(x['deckung'])
        wj = sorted(proJahr)
        wmed = [st.median(proJahr[j]) for j in wj]
        wp = pearson(list(range(len(wmed))), wmed)
        ws = spearman(list(range(len(wmed))), wmed)
        wu1 = sum(1 for m in wmed if m < 1)
        a = [x['aPreisAktivErreichbar'] for x in d['reihe']]
        aa = [x['aPreisAktiv'] for x in d['reihe']]
        nenner = sorted(d['nennerZaehler'].items(), key=lambda t: -t[1])
        print('-' * 104)
        print(f"  Lauf {d['lauf']}  {d['wochen']} Wochen  {jahre[0] if jahre else '?'}-{d['schluss']['jahr']}  "
              f"Seitenfehler {len(d['fehler'])}  Abbruch {d['abgebrochen']}  lage {d['schluss']['lage']}")
        print(f"  (d) LEITER  {len(mal)} Jahre: {[round(m,2) for m in mal]}")
        print(f"      erste {mal[0]:.2f}  letzte {mal[-1]:.2f}  min {min(mal):.2f}  max {max(mal):.2f}"
              f"   Pearson {rp:+.3f}  Spearman {rs:+.3f}   Jahre <1x: {u1}/{len(mal)}")
        print(f"  (d) Kopfzeile woechentlich, Jahresmedian ({len(wmed)} Jahre): {[round(m,2) for m in wmed]}")
        print(f"      Pearson {wp:+.3f}  Spearman {ws:+.3f}   Jahre <1x: {wu1}/{len(wmed)}")
        print(f"  (a) Preisentscheidungen aktiv+erreichbar je Woche: median {st.median(a):.0f} "
              f"min {min(a)} max {max(a)}   (nur aktiv, auch verdeckt: median {st.median(aa):.0f})")
        print(f"  (b) unwiderrufliche Festlegungen am Ende: {d['schluss']['festlegungen']} "
              f"(selbst gesetzt: {d['festGesetzt']})")
        print(f"  (c) Zuege des Gegners ohne Hand: {d['schluss']['gegnerZuege']} in {d['wochen']} Wochen "
              f"= {d['schluss']['gegnerZuege']/max(1,d['wochen']):.2f}/Woche")
        print(f"  (d) Nenner, wer ihn stellt: Arten {d['nennerArt']}")
        for k, v in nenner[:5]:
            print(f"        {v:4d}x  {k}")
        zus[ep].append(dict(lauf=d['lauf'], n=len(mal), erst=mal[0], letzt=mal[-1],
                            pear=rp, spear=rs, u1=u1, wpear=wp, wspear=ws, wu1=wu1,
                            wn=len(wmed), wochen=d['wochen'], fehler=len(d['fehler']),
                            fest=d['schluss']['festlegungen'], geg=d['schluss']['gegnerZuege'],
                            amed=st.median(a)))

print('=' * 104)
print('ZUSAMMENFASSUNG — LEITER (Bildschirmreihe), Ziel |rho| < 0,7 und hoechstens 1 von 6 Jahren <1x')
print(f"{'Ep':>3} {'Lauf':>5} {'Jahre':>6} {'erste':>7} {'letzte':>7} {'Pearson':>9} {'Spearman':>9} {'<1x':>7} {'Urteil':>8}")
for ep in sorted(zus):
    for z in zus[ep]:
        ok = (abs(z['spear']) < 0.7 and abs(z['pear']) < 0.7 and z['u1'] <= z['n'] / 6)
        print(f"{ep:>3} {z['lauf']:>5} {z['n']:>6} {z['erst']:>7.2f} {z['letzt']:>7.2f} "
              f"{z['pear']:>+9.3f} {z['spear']:>+9.3f} {str(z['u1'])+'/'+str(z['n']):>7} "
              f"{'besteht' if ok else 'REISST':>8}")
print()
print('ZUSAMMENFASSUNG — Kopfzeile woechentlich, Jahresmedian (unabhaengige Gegenprobe)')
print(f"{'Ep':>3} {'Lauf':>5} {'Jahre':>6} {'Pearson':>9} {'Spearman':>9} {'<1x':>7}")
for ep in sorted(zus):
    for z in zus[ep]:
        print(f"{ep:>3} {z['lauf']:>5} {z['wn']:>6} {z['wpear']:>+9.3f} {z['wspear']:>+9.3f} "
              f"{str(z['wu1'])+'/'+str(z['wn']):>7}")
print()
print('STREUUNG je Epoche (LEITER)')
for ep in sorted(zus):
    sp = [z['spear'] for z in zus[ep]]
    pe = [z['pear'] for z in zus[ep]]
    le = [z['letzt'] for z in zus[ep]]
    print(f"  E{ep}: Spearman {min(sp):+.3f} .. {max(sp):+.3f} (Spanne {max(sp)-min(sp):.3f}) | "
          f"Pearson {min(pe):+.3f} .. {max(pe):+.3f} (Spanne {max(pe)-min(pe):.3f}) | "
          f"letzte {min(le):.2f} .. {max(le):.2f}")
