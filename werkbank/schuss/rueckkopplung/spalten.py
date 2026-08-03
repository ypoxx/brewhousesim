#!/usr/bin/env python3
"""Latte 2, Spalten (a) (b) (c) (e) — je Epoche, aus den Laeufen des blinden
Kritikers gerechnet.

  python3 spalten.py /tmp/rk/e*-*.json [/tmp/rk/verben.json]
"""
import json, re, sys, glob, collections, statistics as st

dateien = [p for p in (sys.argv[1:] or sorted(glob.glob('/tmp/rk/e*-*.json'))) if 'verben' not in p]
verbenP = [p for p in sys.argv[1:] if 'verben' in p]

proEp = collections.defaultdict(list)
for p in sorted(dateien):
    d = json.load(open(p))
    proEp[d['epoche']].append(d)

schluessel = {}
print('=' * 100)
print('SPALTE (a)  Entscheidungen mit Preisschild NEBENEINANDER, erreichbar UND aktiv')
print('SPALTE (b)  unwiderrufliche Festlegungen ueber 14 Jahre')
print('SPALTE (c)  Zuege des Gegners, die ohne die Hand des Spielers geschehen')
print('=' * 100)
for ep in sorted(proEp):
    for d in proEp[ep]:
        a = [x['aPreisAktivErreichbar'] for x in d['reihe']]
        # Wann springt der Festlegungszaehler? -> in welchem Jahr wurde festgelegt
        fest, vor = [], None
        for x in d['reihe']:
            if vor is not None and x['bFestlegungen'] > vor:
                fest.append((x['jahr'], x['woche'], x['bFestlegungen'] - vor))
            vor = x['bFestlegungen']
        jahre = sorted(set(x['jahr'] for x in d['reihe']))
        geg = d['schluss']['gegnerZuege']
        print(f"E{ep} Lauf {d['lauf']}  {d['wochen']} Wochen, {len(jahre)} Jahre "
              f"({jahre[0]}-{jahre[-1]})")
        print(f"   (a) je Woche: median {st.median(a):.0f}  min {min(a)}  max {max(a)}  "
              f"  Wochen mit <2: {sum(1 for v in a if v < 2)}  mit <5: {sum(1 for v in a if v < 5)}")
        print(f"   (b) Festlegungen gesamt {d['schluss']['festlegungen']}: {fest}")
        print(f"   (c) Gegnerzuege {geg} = {geg/max(1,len(jahre)):.1f} je Jahr, "
              f"{geg/max(1,d['wochen']):.2f} je Woche")
    # Ereignisnummern (gegner:zeige:47) sind keine Verben, sondern Ereignisse —
    # wer sie mitzaehlt, misst, wie viel passiert ist, nicht wie viel man tun kann.
    schluessel[ep] = set(k for k in proEp[ep][0]['zugSchluessel']
                         if not re.search(r':\d+$', k))

print()
print('=' * 100)
print('SPALTE (e)  VERBLISTE JE EPOCHE — Zugschluessel, die in 400 Wochen am Schirm standen')
print('=' * 100)
for ep in sorted(schluessel):
    print(f"  E{ep}: {len(schluessel[ep])} verschiedene Zugschluessel")
alleEp = sorted(schluessel)
gemein = set.intersection(*[schluessel[e] for e in alleEp]) if alleEp else set()
print(f"  In ALLEN VIER gleich: {len(gemein)}")
for e in alleEp:
    eigen = schluessel[e] - set.union(*[schluessel[x] for x in alleEp if x != e])
    print(f"  NUR in E{e}: {len(eigen)}  ->  {sorted(eigen)[:14]}")
print()
print('  Paarweise Jaccard-Aehnlichkeit der Zugschluessel-Mengen:')
for i in alleEp:
    zeile = []
    for j in alleEp:
        s = len(schluessel[i] & schluessel[j]) / max(1, len(schluessel[i] | schluessel[j]))
        zeile.append(f'{s:.2f}')
    print(f'    E{i}: ' + '  '.join(zeile))

if verbenP:
    v = json.load(open(verbenP[0]))
    print()
    print('  Beschriftungen am Schirm (verben.mjs, Bretter aufgeschlagen):')
    txt = {}
    for k in v:
        txt[k] = set(x['text'] for x in v[k]['zuege'].values() if x['text'])
        print(f"    {k}: {v[k]['anzahl']} Zugschluessel, {len(txt[k])} verschiedene Beschriftungen")
    ks = sorted(txt)
    gem = set.intersection(*[txt[k] for k in ks])
    print(f"    Beschriftungen in ALLEN VIER gleich: {len(gem)}")
    for k in ks:
        eigen = txt[k] - set.union(*[txt[x] for x in ks if x != k])
        print(f"    NUR in {k}: {len(eigen)} -> {sorted(eigen)[:12]}")
