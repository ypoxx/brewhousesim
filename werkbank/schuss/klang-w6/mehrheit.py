#!/usr/bin/env python3
"""Mehrheit ueber mehrere Durchgaenge derselben Vorgangsfrage.

Sperrliste 5 des Kritikers, auf seine Vorgangsfrage angewandt: eine einzelne
Vorlage ist keine Messung. Ein Punkt gilt als bejaht, wenn er in der MEHRHEIT
der Durchgaenge bejaht wurde.

    ./mehrheit.py antworten/vorgang-d.json antworten/vorgang-d-d2.json ...
"""
import json, pathlib, sys

ECHT = "abcd"
BLENDER = "efgh"
WAS = {"a": "FUHRE", "b": "SUD", "c": "MICHAELI", "d": "GEGENZUG"}

zaehl = {}
laeufe = {}
for pfad in sys.argv[1:]:
    for u in json.loads(pathlib.Path(pfad).read_text()):
        if u.get("abbruch"):
            continue
        name = u["datei"].replace(".wav", "")
        pk = u.get("punkte") or {}
        z = zaehl.setdefault(name, {k: 0 for k in ECHT + BLENDER})
        laeufe[name] = laeufe.get(name, 0) + 1
        for k in ECHT + BLENDER:
            if (pk.get(k) or {}).get("da"):
                z[k] += 1

print("| Aufnahme | Laeufe | " + " | ".join(WAS[k] for k in ECHT) + " | Blender bejaht |")
print("|" + "---|" * (len(ECHT) + 3))
for name in sorted(zaehl, key=lambda n: ("still" in n, n)):
    n = laeufe[name]
    z = zaehl[name]
    felder = ["%d/%d%s" % (z[k], n, " **ja**" if z[k] * 2 > n else "") for k in ECHT]
    bl = sum(z[k] for k in BLENDER)
    print("| %s | %d | %s | %d von %d |" % (name, n, " | ".join(felder), bl, 4 * n))

gespielt = [x for x in zaehl if "gespielt" in x]
still = [x for x in zaehl if "still" in x]
ja_g = sum(1 for x in gespielt if zaehl[x]["d"] * 2 > laeufe[x])
ja_s = sum(1 for x in still if zaehl[x]["d"] * 2 > laeufe[x])
print()
print("GEGENZUG mehrheitlich bejaht — gespielt %d von %d, still %d von %d"
      % (ja_g, len(gespielt), ja_s, len(still)))
print("AUFLAGE 4 nach Mehrheit: %s"
      % ("ABGENOMMEN" if ja_g == len(gespielt) == 4 and ja_s == 0 else "NICHT abgenommen"))
