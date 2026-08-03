#!/usr/bin/env python3
"""Aus den Nenner-Messungen die zweite Latte rechnen.

    python3 werkbank/schuss/aufsicht/auswerten.py /tmp/nenner/fest

Die Latte (gauntlet/MESSLATTE.md, Latte 2, Punkt d): Barschaft ÷ Preis des
naechsten sinnvollen Zuges darf ueber die Partie weder davonlaufen noch
zusammenbrechen. Ziel dieser Welle: |rho| < 0,7 in allen vier Epochen,
hoechstens ein Jahr von sechs unter 1×.

Gerechnet wird gegen DREI Nenner, damit der Streit um den Nenner sichtbar
bleibt statt in einer Zahl zu verschwinden:
  kopf       was das Spiel selbst behauptet
  alles      billigstes erreichbares Preisschild
  umkaempft  billigstes Schild an einer umkaempften Adresse  <- die Latte
"""
import json, sys, pathlib

ORT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '/tmp/nenner/fest')

def rho(paare):
    """Spearman ohne scipy: Rangkorrelation Jahr gegen Kennzahl."""
    n = len(paare)
    if n < 3: return None
    def raenge(v):
        s = sorted(range(n), key=lambda i: v[i]); r = [0]*n
        i = 0
        while i < n:
            j = i
            while j+1 < n and v[s[j+1]] == v[s[i]]: j += 1
            for k in range(i, j+1): r[s[k]] = (i+j)/2 + 1
            i = j+1
        return r
    a, b = raenge([p[0] for p in paare]), raenge([p[1] for p in paare])
    ma, mb = sum(a)/n, sum(b)/n
    za = sum((x-ma)*(y-mb) for x, y in zip(a, b))
    na = (sum((x-ma)**2 for x in a) * sum((y-mb)**2 for y in b)) ** 0.5
    return za/na if na else None

NAME = {1: '1350', 2: '1600', 3: '1884', 4: '1970'}
print(f"{'Epoche':8} {'Jahre':6} {'rho kopf':>9} {'rho alles':>10} {'rho UMKÄMPFT':>13} "
      f"{'Jahre <1×':>10} {'Median umk.':>12} {'Nenner':>7}")
print('-' * 82)
for e in (1, 2, 3, 4):
    p = ORT / f'e{e}.json'
    if not p.exists():
        print(f'{NAME[e]:8} — nicht gemessen'); continue
    d = json.load(open(p))
    # Abbruchzeilen tragen weder Jahr noch Angebot — sie zaehlen nicht mit,
    # werden aber gemeldet, damit ein abgebrochener Lauf nicht als kurzer
    # Lauf durchgeht.
    ab = [r for r in d['zeilen'] if r.get('abbruch')]
    z = [r for r in d['zeilen'] if r.get('umkaempft') and r.get('jahr') is not None]
    if not z:
        print(f'{NAME[e]:8} — keine umkämpften Angebote'); continue
    jahre = {}
    for r in z:
        jahre.setdefault(r['jahr'], []).append(r)
    def med(v):
        v = sorted(v); return v[len(v)//2] if v else None
    reihen = {}
    for schl, hol in (('kopf', lambda r: r.get('kopf')),
                      ('alles', lambda r: r['alles']['deckung'] if r.get('alles') else None),
                      ('umk', lambda r: r['umkaempft']['deckung'])):
        reihen[schl] = [(j, med([hol(r) for r in rs if hol(r) is not None]))
                        for j, rs in sorted(jahre.items())]
        reihen[schl] = [(j, v) for j, v in reihen[schl] if v is not None]
    unter = sum(1 for _, v in reihen['umk'] if v < 1.0)
    # Nach dem Ende ist die Kopfzeile weg — kopfText ist dann None und zaehlt
    # nicht als eigener Nenner mit.
    nenner = len({(r.get('kopfText') or '').split('—')[0].strip()
                  for r in z if r.get('kopfText')})
    def f(x): return f'{x:+.3f}' if x is not None else '   —  '
    print(f"{NAME[e]:8} {len(reihen['umk']):<6} {f(rho(reihen['kopf'])):>9} "
          f"{f(rho(reihen['alles'])):>10} {f(rho(reihen['umk'])):>13} "
          f"{unter:>4} von {len(reihen['umk']):<3} {med([r['umkaempft']['deckung'] for r in z]):>11.2f}× {nenner:>7}"
          + (f'   ABBRUCH: {ab[0]["abbruch"]}' if ab else ''))
print('-' * 82)
print('Ziel: |rho UMKÄMPFT| < 0,7 · höchstens ein Jahr von sechs unter 1× ·'
      ' Nenner muss wechseln, sonst misst sich das Spiel gegen eine Kleinigkeit')
