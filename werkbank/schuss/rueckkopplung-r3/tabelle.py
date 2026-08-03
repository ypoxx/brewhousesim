#!/usr/bin/env python3
"""Die Tabelle fuer den Bericht: drei Laeufe je Epoche, vorher und nachher,
mit Spannweite. Spearman ist die Zahl, nach der geurteilt wird; Pearson steht
daneben.

  python3 tabelle.py /tmp/rk3/v /tmp/rk3/n
"""
import json, sys, glob, os, statistics as st, collections



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

EPJ = {1: 1350, 2: 1600, 3: 1884, 4: 1970}
V, N = sys.argv[1], sys.argv[2]


def lies(ordner, ep):
    aus = []
    for p in sorted(glob.glob(f'{ordner}/e{ep}-*.json')):
        d = json.load(open(p))
        roh = [r for r in (d.get('leiterRoh') or []) if r.get('zugVerh')]
        w = [r['zugVerh'] for r in roh]
        j = [r['jahr'] for r in roh]
        prj = collections.defaultdict(list)
        kj = collections.defaultdict(list)
        for x in d.get('reihe') or []:
            if x.get('deckung'):
                prj[x['jahr']].append(x['deckung'])
            kj[x['jahr']].append(x['kasse'])
        js = sorted(prj)
        med = [st.median(prj[y]) for y in js]
        ks = [st.median(kj[y]) for y in sorted(kj)]
        aus.append(dict(
            datei=os.path.basename(p), n=len(w), reihe=w,
            sp=spearman(j, w), pe=pearson(j, w),
            unter=sum(1 for x in w if x < 1),
            wo=spearman(js, med),
            kasse=(ks[0], ks[-1]), fest=d.get('festGesetzt'),
            fehler=len(d.get('fehler') or []), abbruch=bool(d.get('abgebrochen')),
            mn=min(w), mx=max(w)))
    return aus


def z(x, n=3):
    return '—' if x is None else f'{x:+.{n}f}'.replace('.', ',')


print('| Epoche | | Lauf A | Lauf B | Lauf C | **Spannweite** | Jahre <1× | Festlegung | Fehler |')
print('|---|---|---|---|---|---|---|---|---|')
for ep in (1, 2, 3, 4):
    for name, ordner in (('vorher', V), ('nachher', N)):
        l = lies(ordner, ep)
        if not l:
            continue
        sp = [x['sp'] for x in l if x['sp'] is not None]
        sw = (max(sp) - min(sp)) if sp else 0
        dick = '**' if name == 'nachher' else ''
        print(f'| {EPJ[ep]} | {name} | ' + ' | '.join(dick + z(x['sp']) + dick for x in l)
              + f' | {dick}{sw:.3f}{dick} '.replace('.', ',')
              + f'| {"/".join(str(x["unter"])+"/"+str(x["n"]) for x in l)} '
              + f'| {"/".join(str(x["fest"]) for x in l)}× '
              + f'| {sum(x["fehler"] for x in l)} |')

print()
print('| Epoche | | Kennzahl min–max | Kasse Jahresmedian | Pearson | wöchentlich |')
print('|---|---|---|---|---|---|')
for ep in (1, 2, 3, 4):
    for name, ordner in (('vorher', V), ('nachher', N)):
        l = lies(ordner, ep)
        if not l:
            continue
        a = l[0]
        print(f'| {EPJ[ep]} | {name} | {a["mn"]:.2f}–{a["mx"]:.2f}× '
              .replace('.', ',')
              + f'| {a["kasse"][0]:.0f} → {a["kasse"][1]:.0f} '
                f'(×{a["kasse"][1]/max(1,a["kasse"][0]):.2f}) '.replace('.', ',')
              + f'| {z(a["pe"])} | {z(a["wo"])} |')

print()
for ep in (1, 2, 3, 4):
    for name, ordner in (('vorher ', V), ('nachher', N)):
        l = lies(ordner, ep)
        if l:
            print(f'{EPJ[ep]} {name}: '
                  + ' · '.join(f'{x:.2f}'.replace('.', ',') for x in l[0]['reihe']))
