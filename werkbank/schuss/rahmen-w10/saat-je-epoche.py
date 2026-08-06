#!/usr/bin/env python3
"""Saatprobe je Epoche: spielt der ausgelieferte Stand dieselbe Partie wie
   der Vorzustand? Alle Laeufe EINZELN gemessen (nie zwei Browser nebeneinander).
     python3 werkbank/schuss/rahmen-w10/saat-je-epoche.py"""
import json, glob, os, collections

def rang(v):
    s = sorted(range(len(v)), key=lambda i: v[i]); r = [0]*len(v); i = 0
    while i < len(s):
        j = i
        while j+1 < len(s) and v[s[j+1]] == v[s[i]]: j += 1
        m = (i+j)/2+1
        for k in range(i, j+1): r[s[k]] = m
        i = j+1
    return r

def pear(x, y):
    n = len(x)
    if n < 3: return None
    mx, my = sum(x)/n, sum(y)/n
    num = sum((a-mx)*(b-my) for a, b in zip(x, y))
    den = (sum((a-mx)**2 for a in x)*sum((b-my)**2 for b in y))**.5
    return num/den if den else None

def sp(x, y): return pear(rang(x), rang(y))

EPJ = {'e1': 1350, 'e2': 1600, 'e3': 1884, 'e4': 1970}
d = collections.defaultdict(dict)
for p in sorted(glob.glob('werkbank/schuss/rahmen-w10/saat/*.json')):
    stand, ep, lauf = os.path.basename(p)[:-5].split('-')
    j = json.load(open(p))
    roh = [r for r in (j.get('leiterRoh') or []) if r.get('zugVerh')]
    d[ep][(stand, lauf)] = {
        'w': [r['zugVerh'] for r in roh], 'j': [r['jahr'] for r in roh],
        'kasse': (j['kasseMin'], j['kasseMax']), 'fehler': len(j.get('fehler') or []),
        'unter1': sum(1 for r in roh if r['zugVerh'] < 1)}

def f(x): return '  —   ' if x is None else f'{x:+.3f}'.replace('.', ',')
print(f"{'Epoche':7s} {'Stand':6s} {'Lauf':4s} {'12 J':>8s} {'13 J':>8s} {'14 J':>8s} "
      f"{'<1x':>6s} {'Kasse':>14s}  Urteil")
print('-'*88)
for ep in sorted(d):
    for k in sorted(d[ep]):
        e = d[ep][k]; z = []
        for n in (12, 13, 14):
            z.append(sp(e['j'][:n], e['w'][:n]) if len(e['w']) >= n else None)
        riss = any(r is not None and abs(r) >= .700 for r in z)
        print(f"{EPJ[ep]:<7d} {k[0]:6s} {k[1]:4s} {f(z[0]):>8s} {f(z[1]):>8s} {f(z[2]):>8s} "
              f"{str(e['unter1'])+'/'+str(len(e['w'])):>6s} "
              f"{str(e['kasse'][0])+'–'+str(e['kasse'][1]):>14s}  "
              f"{'REISST' if riss else 'besteht'}  Fehler {e['fehler']}")
    v = [d[ep][k]['w'] for k in d[ep] if k[0] == 'VOR']
    o = [d[ep][k]['w'] for k in d[ep] if k[0] == 'OHNE']
    if v and o:
        print(f"  -> {EPJ[ep]}: VOR und OHNE spielen "
              f"{'DIESELBE Partie' if v[0] == o[0] else 'VERSCHIEDENE Partien'}"
              f"   (VOR {len(set(map(tuple,v)))} Partie(n) in {len(v)} Laeufen, "
              f"OHNE {len(set(map(tuple,o)))} in {len(o)})")
    print('-'*88)
