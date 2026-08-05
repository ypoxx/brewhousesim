#!/usr/bin/env python3
"""Fasst die sudlage-Laeufe zu den zwei Zahlen zusammen, die das Urteil traegt:
   DIE KLEMME und DIE PREISSCHILDER."""
import json, sys, glob, os
EPJ = {1:1350, 2:1600, 3:1884, 4:1970}
print(f"{'Epoche':7s} {'Wo':>4s} {'Jahre':>5s} | {'BrettImBild':>11s} {'KLEMME':>6s} {'sollAus0':>8s} |"
      f" {'0':>4s} {'1':>4s} {'2':>4s} {'3+':>4s} {'>=2':>5s} {'>=2 m.Bier':>10s} | {'Reiterklicks':>13s} {'Fehler':>6s}")
print('-'*118)
for p in sorted(sys.argv[1:]):
    d = json.load(open(p)); a = d['auswertung']; pw = a['preisWochen']
    rk = [x.get('bedienbarNach') for x in d['reiterproben']]
    print(f"{EPJ[d['epoche']]:<7d} {a['wochen']:>4d} {a['jahre']:>5d} | {a['brettImBild']:>11d} "
          f"{a['klemme']:>6d} {a['klemmeSollAus0']:>8d} | {pw['n0']:>4d} {pw['n1']:>4d} {pw['n2']:>4d} "
          f"{pw['n3plus']:>4d} {a['wochenMitZweiPlus']:>5d} {pw.get('mitFass2plus',0):>10d} | "
          f"{str(rk)[:13]:>13s} {len(d['fehler']):>6d}")
print('-'*118)
for p in sorted(sys.argv[1:]):
    d = json.load(open(p)); a = d['auswertung']
    print(f"{EPJ[d['epoche']]}: Gruende {json.dumps(a['gruende'])}")
    print(f"      Schilder je Zug: {json.dumps(a['preisZuege'])}")
    r = d['reihe']
    print(f"      Kasse {r[0]['kasse']} -> {r[-1]['kasse']} (min {min(x['kasse'] for x in r)}), "
          f"lage max {max(x['lage'] for x in r)}, Brett offen {sum(1 for x in r if x['brettOffen'])}/{len(r)}")
