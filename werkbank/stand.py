#!/usr/bin/env python3
"""Schreibt den Stand des Laufs auf die Werkbank-Seite.

Jeder Agent im Lauf ruft dieses Werkzeug auf, statt `stand.json` selbst zu
schreiben — es sperrt die Datei, liest, ändert und schreibt atomar zurück, damit
sich parallele Builder und Kritiker nicht gegenseitig überschreiben.

    ./stand.py phase "Welle 2 — die Stadt lebt"
    ./stand.py latte "Der gebaute Screen muss im Blindvergleich gegen zielbild/03-1884.jpg gewinnen."
    ./stand.py zahl Runden 12
    ./stand.py chronik "Stadtansicht 1884, Runde 3: Kritiker sieht die Referenz vorn."
    ./stand.py stueck --name "Stadtansicht 1884" --status zurueck --runde 3 \
        --gebaut werkbank/schuss/stadt-1884-r3.png --referenz zielbild/03-1884.jpg \
        --luecke "Die Dachflaechen haben keine Textur; die Referenz hat Ziegelreihen."

Status: laeuft · zurueck · bestanden
Pfade zu Bildern sind relativ zur Repo-Wurzel, weil die Seite dort liegt.
"""

import argparse
import fcntl
import json
import os
import pathlib
import tempfile
from datetime import datetime, timezone

WURZEL = pathlib.Path(__file__).resolve().parent.parent
STAND = WURZEL / "werkbank" / "stand.json"
SPERRE = WURZEL / "werkbank" / ".sperre"
LEER = {"stand": None, "phase": None, "latte": None, "zahlen": {}, "stuecke": [], "chronik": []}
STATUS = ("laeuft", "zurueck", "bestanden")


def jetzt():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def schreibe(daten):
    daten["stand"] = jetzt()
    STAND.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=str(STAND.parent), suffix=".json")
    with os.fdopen(fd, "w") as f:
        json.dump(daten, f, ensure_ascii=False, indent=1)
    os.replace(tmp, STAND)


def lies():
    if not STAND.is_file():
        return dict(LEER)
    try:
        d = json.loads(STAND.read_text())
    except json.JSONDecodeError:
        return dict(LEER)
    for k, v in LEER.items():
        d.setdefault(k, v if not isinstance(v, (dict, list)) else type(v)())
    return d


def main():
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    unter = p.add_subparsers(dest="befehl", required=True)

    unter.add_parser("phase").add_argument("text")
    unter.add_parser("latte").add_argument("text")
    unter.add_parser("chronik").add_argument("text")

    z = unter.add_parser("zahl")
    z.add_argument("name")
    z.add_argument("wert")

    s = unter.add_parser("stueck")
    s.add_argument("--name", required=True)
    s.add_argument("--status", choices=STATUS)
    s.add_argument("--runde", type=int)
    s.add_argument("--luecke")
    s.add_argument("--gebaut")
    s.add_argument("--referenz")
    s.add_argument("--still", action="store_true",
                   help="keinen Chronikeintrag erzeugen")

    a = p.parse_args()

    SPERRE.parent.mkdir(parents=True, exist_ok=True)
    with open(SPERRE, "w") as sperre:
        fcntl.flock(sperre, fcntl.LOCK_EX)
        d = lies()

        if a.befehl in ("phase", "latte"):
            d[a.befehl] = a.text
            if a.befehl == "phase":
                d["chronik"].append({"zeit": jetzt(), "text": a.text})
        elif a.befehl == "chronik":
            d["chronik"].append({"zeit": jetzt(), "text": a.text})
        elif a.befehl == "zahl":
            d["zahlen"][a.name] = a.wert
        elif a.befehl == "stueck":
            treffer = next((x for x in d["stuecke"] if x.get("name") == a.name), None)
            if treffer is None:
                treffer = {"name": a.name, "status": "laeuft", "runde": 1}
                d["stuecke"].append(treffer)
            for feld in ("status", "runde", "luecke", "gebaut", "referenz"):
                wert = getattr(a, feld)
                if wert is not None:
                    treffer[feld] = wert
            if not a.still:
                teil = [a.name]
                if a.runde is not None:
                    teil.append(f"Runde {a.runde}")
                if a.status:
                    teil.append({"laeuft": "läuft", "zurueck": "zurück an den Builder",
                                 "bestanden": "bestanden"}[a.status])
                eintrag = " · ".join(teil)
                if a.luecke:
                    eintrag += f" — {a.luecke}"
                d["chronik"].append({"zeit": jetzt(), "text": eintrag})

        d["chronik"] = d["chronik"][-200:]
        schreibe(d)

    print(f"stand.json geschrieben ({len(d['stuecke'])} Stücke, {len(d['chronik'])} Chronikzeilen)")


if __name__ == "__main__":
    main()
