#!/usr/bin/env python3
"""KLICKANTEIL — die Zahl, an der DIE WOCHE gemessen wird (WELLE-13 R13).

   python3 klickanteil.py vorher-e1 vorher-e2 ...

   Zaehlt aus den Protokollen der Hand jeden echten Mausklick nach data-zug
   und gibt: haeufigster Knopf in Prozent aller Klicks, die drei haeufigsten
   zusammen, dazu die Zahl der gespielten und der erzaehlten Wochen.
"""
import json, sys
from collections import Counter

W = '/home/user/brewhousesim/werkbank/schuss/woche-w13/protokoll'


def ev(lauf):
    out = []
    for line in open(f'{W}/{lauf}.jsonl'):
        line = line.strip()
        if not line:
            continue
        try:
            out.append(json.loads(line))
        except Exception:
            pass
    return out


print('=' * 100)
for lauf in sys.argv[1:]:
    E = ev(lauf)
    j = json.load(open(f'{W}/{lauf}-wahl.json'))
    kl = Counter(e['zug'] for e in E if e['was'] == 'klick')
    n = sum(kl.values())
    top = kl.most_common(8)
    eins = top[0][1] / n * 100 if n else 0
    drei = sum(v for _, v in top[:3]) / n * 100 if n else 0
    print(f"\n{lauf}  (Epoche {j['epoche']}, Saat {j['saat']}, {j['fenster']})")
    print(f"  gespielte Wochen {j['gespielteWochen']}   erzaehlte Wochen {j.get('sprungWochen', 0)}"
          f"   Klicks {n}   verfehlt {j['danebengegriffen']}")
    print(f"  Kasse Ende {j['schluss']['kasse']}   lage {j['schluss']['lage']}"
          f"   Seitenfehler {len(j['fehler'])}   Abbruch {j['abbruch'] or 'nein'}")
    print(f"  HAEUFIGSTER KNOPF        {eins:5.1f} %   (Latte <= 35 %)  {'OK' if eins <= 35 else 'DURCHGEFALLEN'}")
    print(f"  DIE DREI HAEUFIGSTEN     {drei:5.1f} %   (Latte <= 60 %)  {'OK' if drei <= 60 else 'DURCHGEFALLEN'}")
    print('  Rangliste:')
    for k, v in top:
        print(f"    {v:5d}  {v / n * 100:5.1f} %  {k}")
    uw = j.get('uebergabeGesehen', [])
    print(f"  Wochen mit „Übergabe" if False else f"  Wochen, in denen das Wort Übergabe im Bild stand: {len(uw)}")
    if uw:
        print(f"    zuerst in Woche {uw[0]['n']} ({uw[0]['jahr']}/{uw[0]['woche']}): {uw[0]['zeilen'][:2]}")
    zw = j.get('ersterSchirmZielWorte', [])
    print(f"  Erster Schirm, Zeilen mit Ziel/gewinnen/überleben/Übergabe: {len(zw)}")
    for t in zw[:4]:
        print(f"    · {t[:120]}")
