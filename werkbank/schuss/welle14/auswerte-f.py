#!/usr/bin/env python3
"""Fasst die Frage-F-Laeufe zusammen: Preislage (tafelBeobachtungen) je Epoche,
und den F3-Nutzenvergleich mit/ohne Festlegung."""
import json, glob, statistics as st

WURZ = '/home/user/brewhousesim/werkbank/schuss/welle14/protokoll'

def komma(x, n=2):
    if x is None: return '-'
    return f"{x:.{n}f}".replace('.', ',')

print("### F1 — Preislage je Michaelitafel (Sammelhand, FESTLEGE=keine) ###")
for ep in [1, 2, 3, 4]:
    try:
        with open(f'{WURZ}/e{ep}-sammel-keine-ergebnis.json') as f:
            d = json.load(f)
    except FileNotFoundError:
        print(f"EPOCHE {ep}: kein Sammellauf")
        continue
    tafeln = d.get('tafelBeobachtungen', [])
    print(f"\nEPOCHE {ep}: {len(tafeln)} Michaelitafeln gesehen, "
          f"Partie bis {d.get('jahrEnde')}/{d.get('wocheEnde')} "
          f"({d.get('braujahre')} Braujahre), Endgrund={d.get('endgrund')} "
          f"Abbruch={(d.get('abbruch') or {}).get('grund')}, Kasse-Ende={d.get('kasseEnde')}")
    unbezahlbar = 0
    for t in tafeln:
        bez = 'bezahlbar' if (t['billigsteKosten'] is not None and t['kasse'] >= t['billigsteKosten']) else 'UNBEZAHLBAR'
        if bez == 'UNBEZAHLBAR': unbezahlbar += 1
        print(f"  {t['jahr']}: {t['anzahl']} Karten, billigste Kosten={t['billigsteKosten']} "
              f"Kasse={t['kasse']} Kasse/billigste={komma(t['kasseDurchBilligste'])}x [{bez}]")
    if tafeln:
        print(f"  -> {unbezahlbar} von {len(tafeln)} Michaelitagen ohne bezahlbare Karte")

print("\n### F3 — Nutzen einer Festlegung, mit/ohne, sonst gleich ###")
paare = [(1, 'keine', 'vertrag'), (4, 'keine', 'konzern')]
for ep, ohne_tag, mit_tag in paare:
    try:
        with open(f'{WURZ}/e{ep}-sammel-{ohne_tag}-ergebnis.json') as f:
            ohne = json.load(f)
        with open(f'{WURZ}/e{ep}-sammel-{mit_tag}-ergebnis.json') as f:
            mit = json.load(f)
    except FileNotFoundError as e:
        print(f"EPOCHE {ep}: Vergleichslauf fehlt ({e})")
        continue
    print(f"\nEPOCHE {ep}: ohne vs. mit '{mit_tag}'")
    for tag, l in [('ohne', ohne), ('mit ' + mit_tag, mit)]:
        print(f"  {tag:14s} bis {l.get('jahrEnde')}/{l.get('wocheEnde')} "
              f"({l.get('braujahre')} Braujahre), Kasse-Ende={l.get('kasseEnde')}, "
              f"Endgrund={l.get('endgrund')} Abbruch={(l.get('abbruch') or {}).get('grund')}, "
              f"Festlegung={mit.get('festlegungGenommen') if l is mit else '-'}")
    if ohne.get('kasseEnde') is not None and mit.get('kasseEnde') is not None:
        diff = mit['kasseEnde'] - ohne['kasseEnde']
        print(f"  -> Differenz Kasse-Ende (mit − ohne) = {diff}")
