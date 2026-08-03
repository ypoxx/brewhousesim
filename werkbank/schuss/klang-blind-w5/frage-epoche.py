#!/usr/bin/env python3
"""Legt die gemischten Proben dem fremden Ohr vor — mit dem Werkzeug des
Hauses (werkbank/hoerer.py), aber ohne --erwartet, damit nichts durchsickert.

Gedreht wird an hoerer.py nichts: es wird nur seine Funktion hoere() gerufen,
also genau dieselbe Frage und dieselbe Deutung wie beim Bauer.

    ./frage-epoche.py blind/probe-*.wav > antworten.json
"""
import json, os, pathlib, sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
import importlib.util
spec = importlib.util.spec_from_file_location(
    'hoerer', pathlib.Path(__file__).resolve().parents[2] / 'hoerer.py')
hoerer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(hoerer)

schluessel = os.environ['GEMINI_API_KEY']
modell = os.environ.get('MODELL', 'gemini-3.1-pro-preview')

aus = []
for pfad in sys.argv[1:]:
    u = None
    for _ in range(3):
        u = hoerer.hoere(pfad, modell, schluessel)
        if not u.get('abbruch'):
            break
    u['datei'] = pathlib.Path(pfad).name
    aus.append(u)
    sys.stderr.write('%s -> Epoche %s (sicher %s)\n'
                     % (u['datei'], u.get('epoche'), u.get('sicher')))
print(json.dumps(aus, indent=1, ensure_ascii=False))
