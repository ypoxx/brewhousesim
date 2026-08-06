#!/usr/bin/env python3
"""DIESELBE SAAT, DIESELBE PARTIE? — Auswertung der Saatprobe.

  python3 werkbank/schuss/rahmen-w10/saat-auswerten.py

WARUM NICHT md5 UEBER DIE GANZE DATEI, und das ist wichtig:
`linie.mjs` schreibt je Woche auch den ABGELESENEN Knopftext mit. Diese Welle
hat das Preisschild auf ein geschuetztes Leerzeichen umgestellt (Auflage R4) —
„−9 Pf" traegt jetzt U+00A0 statt U+0020. Damit unterscheiden sich VOR und
OHNE in JEDER Datei, obwohl die PARTIE dieselbe ist. Ein md5-Vergleich ueber
die Staende hinweg wuerde hier einen Unterschied melden, den es nicht gibt.

Verglichen wird deshalb die PARTIE: die Jahresreihe der Kennzahl aus
`leiterRoh`, die Kassenspanne und die Zahl der Braujahre. Innerhalb eines
Standes wird ZUSAETZLICH die md5 verglichen — dort ist sie aussagekraeftig.
"""
import json, glob, os, hashlib, collections

Z = 'werkbank/schuss/rahmen-w10/saat'
saetze = collections.defaultdict(dict)
for p in sorted(glob.glob(f'{Z}/*.json')):
    b = os.path.basename(p)[:-5]              # z.B. VOR-e1-A
    stand, _, lauf = b.split('-')
    d = json.load(open(p))
    roh = [r for r in (d.get('leiterRoh') or []) if r.get('zugVerh')]
    saetze[stand][lauf] = {
        'reihe': [round(r['zugVerh'], 6) for r in roh],
        'jahre': [r['jahr'] for r in roh],
        'kasse': (d['kasseMin'], d['kasseMax']),
        'fehler': len(d.get('fehler') or []),
        'md5': hashlib.md5(open(p, 'rb').read()).hexdigest(),
    }

print(f"{'Stand':6s} {'Lauf':5s} {'J':>3s} {'Kasse':>14s} {'Fehler':>7s}  md5(8)   Partie gleich wie A?")
print('-' * 78)
for stand in sorted(saetze):
    a = saetze[stand].get('A')
    for lauf in sorted(saetze[stand]):
        e = saetze[stand][lauf]
        gleich = '—' if lauf == 'A' else (
            'JA' if a and e['reihe'] == a['reihe'] and e['kasse'] == a['kasse'] else 'NEIN')
        print(f"{stand:6s} {lauf:5s} {len(e['reihe']):3d} "
              f"{str(e['kasse'][0])+'–'+str(e['kasse'][1]):>14s} {e['fehler']:7d}  "
              f"{e['md5'][:8]}  {gleich}")
    md5s = {saetze[stand][l]['md5'] for l in saetze[stand]}
    reihen = {tuple(saetze[stand][l]['reihe']) for l in saetze[stand]}
    print(f"  -> {stand}: {len(saetze[stand])} Laeufe, {len(reihen)} verschiedene Partien, "
          f"{len(md5s)} verschiedene Pruefsummen  "
          f"{'GERAET DICHT' if len(reihen) == 1 else 'AUSEINANDER'}")
    print('-' * 78)

if 'VOR' in saetze and 'OHNE' in saetze:
    v = saetze['VOR'].get('A'); o = saetze['OHNE'].get('A')
    if v and o:
        print('VOR-A gegen OHNE-A — dieselbe Partie? '
              + ('JA' if v['reihe'] == o['reihe'] and v['kasse'] == o['kasse'] else 'NEIN'))
        print('  (die md5 unterscheidet sich immer: das geschuetzte Leerzeichen '
              'im Preisschild steht im mitgeschriebenen Knopftext.)')
