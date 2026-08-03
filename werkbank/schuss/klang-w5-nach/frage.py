#!/usr/bin/env python3
"""Legt gemischte Proben dem fremden Ohr vor — mit dem Werkzeug des Hauses.

An werkbank/hoerer.py wird NICHTS gedreht (ZUSTAENDIGKEIT 16); es wird nur
seine Funktion hoere() gerufen, also dieselbe Frage und dieselbe Deutung wie
beim Kritiker. --erwartet wird nie gesetzt, es sickert nichts durch.

Zwei Dinge tut dieses Skript zusaetzlich, und beide nur ausserhalb von
hoerer.py:
  * hoere() beendet den Prozess bei HTTP 429 (sys.exit(2)). Hier wird das
    SystemExit gefangen und nach Wartezeit erneut gefragt — eine Sperre ist
    kein Urteil ueber das Spiel (Sperrliste 6).
  * zwischen zwei Fragen liegt eine Pause, damit die Minutensperre nicht
    ganze Durchgaenge verbrennt.

    MODELL=gemini-3.6-flash ./frage.py 3 pool/probe-*.wav > antworten.json
                             ^ Durchgaenge
"""
import json, os, pathlib, sys, time, importlib.util

W = pathlib.Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('hoerer', W / 'hoerer.py')
hoerer = importlib.util.module_from_spec(spec); spec.loader.exec_module(hoerer)

SCHL = os.environ['GEMINI_API_KEY']
MODELL = os.environ.get('MODELL', 'gemini-3.6-flash')
PAUSE = float(os.environ.get('PAUSE', '4'))

def frag(pfad):
    """Gibt (urteil, ausfallgrund). Ein Ausfall ist keine Messung."""
    for versuch in range(4):
        try:
            u = hoerer.hoere(pfad, MODELL, SCHL)
        except SystemExit:
            time.sleep(20 * (versuch + 1)); continue
        if not u.get('abbruch'):
            return u, None
        time.sleep(8 * (versuch + 1))
    return None, 'kein Urteil nach vier Versuchen'

runden = int(sys.argv[1])
dateien = sys.argv[2:]
aus = []
for r in range(1, runden + 1):
    for pfad in dateien:
        u, grund = frag(pfad)
        satz = {'durchgang': r, 'datei': pathlib.Path(pfad).name, 'modell': MODELL}
        satz.update(u if u else {'ausfall': grund})
        aus.append(satz)
        sys.stderr.write('D%d %-16s -> %s (sicher %s)\n'
                         % (r, satz['datei'], satz.get('epoche', 'AUSFALL'), satz.get('sicher')))
        sys.stderr.flush()
        time.sleep(PAUSE)
print(json.dumps(aus, indent=1, ensure_ascii=False))
