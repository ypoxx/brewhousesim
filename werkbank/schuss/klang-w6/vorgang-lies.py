#!/usr/bin/env python3
"""Liest die Antworten von frage-vorgang.py und stellt die Abnahme hin.

Die Auflage 4 lautet: das Ohr bejaht den GEGENZUG — Punkt (d) — in allen vier
Epochen UND verneint ihn in der stillen Aufnahme derselben Epoche.
Ein Abbruch (Verweigerung, HTTP 429) ist KEINE Messung und wird als solcher
gezaehlt, nie als Nein des Spiels.
"""
import json, pathlib, sys

ECHT = "abcd"
BLENDER = "efgh"
WAS = {"a": "FUHRE", "b": "SUD", "c": "MICHAELI", "d": "GEGENZUG"}


def lies(pfad):
    d = json.loads(pathlib.Path(pfad).read_text())
    zeilen, offen = {}, []
    for u in d:
        name = u.get("datei", "?").replace(".wav", "")
        if u.get("abbruch"):
            offen.append("%s: %s" % (name, u["abbruch"]))
            continue
        pk = u.get("punkte") or {}
        zeilen[name] = {
            "echt": {k: bool((pk.get(k) or {}).get("da")) for k in ECHT},
            "sek": {k: (pk.get(k) or {}).get("sekunde") for k in ECHT},
            "sicher": {k: (pk.get(k) or {}).get("sicher") for k in ECHT},
            "blender": [k for k in BLENDER if (pk.get(k) or {}).get("da")],
            "jahr": u.get("jahr_geschaetzt"),
            "anach": u.get("anachronismen") or [],
        }
    return zeilen, offen


def main():
    zeilen, offen = lies(sys.argv[1])
    kopf = "| Aufnahme | " + " | ".join(WAS[k] for k in ECHT) + " | Blender bejaht | Anachronismen |"
    print(kopf)
    print("|" + "---|" * (len(ECHT) + 3))
    for name in sorted(zeilen, key=lambda n: (("still" in n), n)):
        z = zeilen[name]
        felder = []
        for k in ECHT:
            if z["echt"][k]:
                s = z["sek"][k]
                felder.append("ja (%s s, sicher %s)" % (s, z["sicher"][k]) if s is not None
                              else "ja (sicher %s)" % z["sicher"][k])
            else:
                felder.append("nein")
        an = "; ".join("%s s: %s" % (a.get("sekunde"), a.get("klang")) for a in z["anach"]) or "—"
        print("| %s | %s | %s von 4 | %s |"
              % (name, " | ".join(felder), len(z["blender"]), an))

    gespielt = [n for n in zeilen if "gespielt" in n]
    still = [n for n in zeilen if "still" in n]
    ja_g = sum(1 for n in gespielt if zeilen[n]["echt"]["d"])
    ja_s = sum(1 for n in still if zeilen[n]["echt"]["d"])
    # Der Kritiker zaehlt "32 Vorgangsfragen" in den stillen Aufnahmen: das
    # sind ALLE ACHT Punkte je Aufnahme, echte und Blender zusammen. Damit die
    # Zahl mit seiner vergleichbar bleibt, wird hier genauso gezaehlt.
    vorgangsfragen = (sum(1 for n in still for k in ECHT if zeilen[n]["echt"][k])
                      + sum(len(zeilen[n]["blender"]) for n in still))
    print()
    print("GEGENZUG gespielt: %d von %d   still: %d von %d"
          % (ja_g, len(gespielt), ja_s, len(still)))
    print("Vorgangsfragen in den STILLEN Aufnahmen bejaht: %d von %d"
          % (vorgangsfragen, 8 * len(still)))
    print("Blender bejaht insgesamt: %d von %d"
          % (sum(len(zeilen[n]["blender"]) for n in zeilen), 4 * len(zeilen)))
    if offen:
        print("OHNE MESSUNG (kein Urteil ueber das Spiel): " + " · ".join(offen))
    abgenommen = (ja_g == 4 == len(gespielt)) and ja_s == 0 and len(still) == 4
    print("AUFLAGE 4: %s" % ("ABGENOMMEN" if abgenommen else "NICHT abgenommen"))


if __name__ == "__main__":
    main()
