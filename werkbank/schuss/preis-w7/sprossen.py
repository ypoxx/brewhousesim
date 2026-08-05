#!/usr/bin/env python3
"""DIE UNTERSTE SPROSSE — die Zahl, gegen die Auflage 9 gebaut wird.

  python3 werkbank/schuss/preis-w7/sprossen.py <ordner mit e*-A.json ...>

WARUM ES DIESES GERAET GIBT, und warum NICHT rho.
Der blinde Kritiker der Welle 7 hat gezaehlt, dass in 1600 dieselbe unterste
Leitersprosse VIERZEHNMAL hintereinander auf der Michaelitafel steht und nie
genommen wird, in 1970 ZEHNMAL von vierzehn. Das ist Ziffer fuer Ziffer das
Bild, das in 1350 als Fehler erkannt und behoben wurde (`nachZeit`).

rho sagt darueber NICHTS: es liegt in beiden Epochen ohnehin unter der Latte,
und zwar nicht, weil die Leiter dort traegt, sondern weil die Zahl schon
vorher unter 0,7 lag. Eine Zahl, die eine geheilte und eine tote Leiter gleich
aussehen laesst, hat fuer diese Frage nichts gemessen. Die Aufsicht hat das am
5. August ausdruecklich so festgehalten: *„Wenn du an Auflage 9 gehst, ist das
die Zahl, gegen die du baust — nicht rho."*

WAS GEZAEHLT WIRD, aus `leiterRoh[].name` jedes 400-Wochen-Laufs
(`werkbank/schuss/rueckkopplung-r3/linie.mjs`):

  Jahre          wie viele Michaelitage der Lauf traegt
  Namen          wie viele VERSCHIEDENE Sprossen ueber die Partie unten standen
  laengste Reihe wie oft dieselbe Sprosse ohne Unterbrechung oben blieb
  Wechsel        wie oft der Name von einem Jahr zum naechsten umschlug

WAS DER WECHSEL IST UND WAS NICHT: er ist ein STELLVERTRETER fuer „genommen",
kein Beweis. Die billigste Sprosse wechselt, wenn sie gekauft wurde — sie
wechselt aber auch, wenn eine Sperre oder ein `ab`-Jahr sie vom Tisch nimmt.
Wer die Kaeufe wirklich zaehlen will, liest `BRAUHAUS.preis.lage()` mit; wer
nur wissen will, ob die Leiter gestiegen wird, dem reicht diese Spalte. Sie
reicht insbesondere, um den Befund des Kritikers nachzustellen — genau dafuer
ist sie gebaut.

Gut ist die Leiter, wenn die laengste Reihe klein ist. Vierzehn heisst: die
Tafel hat unten vierzehn Jahre lang dasselbe angeboten und niemand hat es
genommen.
"""
import json, sys, glob, os

EPJ = {1: 1350, 2: 1600, 3: 1884, 4: 1970}
ordner = sys.argv[1:]
if not ordner:
    print(__doc__)
    sys.exit(1)

print(f"{'Epoche':8s} {'Satz':12s} {'Jahre':>5s} {'Namen':>6s} {'längste Reihe':>14s} "
      f"{'Wechsel':>8s}   billigste Sprosse zuerst → zuletzt")
print('-' * 108)
for ep in (1, 2, 3, 4):
    for o in ordner:
        for p in sorted(glob.glob(f'{o}/e{ep}-*.json')):
            d = json.load(open(p))
            roh = [r for r in (d.get('leiterRoh') or []) if r.get('name')]
            if not roh:
                continue
            namen = [r['name'] for r in roh]
            versch = len(set(namen))
            lauf = best = 1
            wechsel = 0
            for i in range(1, len(namen)):
                if namen[i] == namen[i - 1]:
                    lauf += 1
                    best = max(best, lauf)
                else:
                    lauf = 1
                    wechsel += 1
            satz = os.path.basename(o.rstrip('/'))
            warn = '  ←  TOTE LEITER' if best >= len(namen) * 0.6 else ''
            print(f'{EPJ[ep]:<8d} {satz:12s} {len(namen):>5d} {versch:>6d} '
                  f'{best:>14d} {wechsel:>8d}   {namen[0][:34]} → {namen[-1][:34]}{warn}')
print('-' * 108)
print('Gelesen wird `leiterRoh[].name` — die billigste Sprosse, die an diesem')
print('Michaelitag auf der Tafel lag. Eine lange Reihe heisst: dieselbe Zeile')
print('stand oben und wurde nicht genommen.')
