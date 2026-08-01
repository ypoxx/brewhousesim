#!/usr/bin/env python3
"""Das fremde Auge — Latte 1 aus gauntlet/MESSLATTE.md, ausführbar.

    ./werkbank/auge.py gebaut.png zielbild/01-1350.jpg --jahr 1350
    ./werkbank/auge.py gebaut.png ziel.jpg --jahr 1350 --laeufe 2

Zwei Bilder, A und B, in zufälliger (aber gesäter) Reihenfolge. Das Auge weiß
NICHT, welches das gebaute Spiel ist und welches die Messlatte. Es sagt, welches
das bessere Bildschirmfoto ist, und muss drei benennbare Stellen nennen.

Genau das ist die Latte: **solange ein Fremder das Zielbild wählt, geht die
Arbeit zurück an den Builder.**

Wer hier verrät, welches Bild wessen ist, misst nichts mehr.

Ausstiegscodes: 0 das Gebaute gewinnt (oder unentschieden), 1 Aufruffehler,
2 API-Fehler, 3 das Zielbild gewinnt.
"""

import argparse
import base64
import json
import mimetypes
import os
import pathlib
import random
import re
import sys
import urllib.error
import urllib.request

URL = ("https://generativelanguage.googleapis.com/v1beta/models/"
       "{modell}:generateContent")

FRAGE = """Du siehst zwei Bilder, A und B.

Beide sollen dasselbe sein: ein Bildschirmfoto eines Aufbauspiels über ein
Brauhaus in einer deutschen Kleinstadt um {jahr}. Dieselbe Stadt, dieselbe
Kameraposition, derselbe Zeichenstil, dieselbe Kopfleiste mit Zahlen.

Eines der beiden ist besser gezeichnet als das andere. Sage mir, welches — und
zwar streng nach dem Bild, nicht nach dem Text darauf. Beschriftungen, Zahlen
und Bedienleisten zählen NICHT; die sind in einem laufenden Spiel ohnehin
echter Text und nicht Teil der Zeichnung.

Worauf es ankommt:
· Stimmt der Maßstab? Sind Menschen, Fässer, Kessel, Brunnen, Wagen im richtigen
  Verhältnis zu den Häusern?
· Steht alles auf dem Boden, oder schwebt etwas, oder steht etwas ineinander?
· Ist der Brauhaushof ein bewohnter Arbeitsplatz oder eine leere Fläche?
· Sind Perspektive, Licht und Strichführung in sich stimmig?
· Passt alles in das Jahr {jahr}?

Antworte NUR mit diesem JSON, ohne Rahmen:
{{"besser": "A" oder "B", "sicher": <0-100>,
  "drei_stellen": ["...", "...", "..."],
  "was_das_schlechtere_verrat": "...",
  "anachronismus": "..."}}

"drei_stellen" sind drei konkrete, benennbare Stellen, an denen das bessere Bild
besser ist. Keine Stimmung, keine Adjektive ohne Ort."""


def lade_schluessel():
    k = os.environ.get("GEMINI_API_KEY")
    if k:
        return k.strip()
    p = os.environ.get("GEMINI_KEY_FILE")
    if p and pathlib.Path(p).is_file():
        return pathlib.Path(p).read_text().strip()
    sys.exit("kein $GEMINI_API_KEY")


def teil(pfad):
    daten = pathlib.Path(pfad).read_bytes()
    typ = mimetypes.guess_type(pfad)[0] or "image/png"
    return {"inline_data": {"mime_type": typ, "data": base64.b64encode(daten).decode()}}


def frage(a_pfad, b_pfad, jahr, modell, schluessel):
    koerper = {
        "contents": [{"parts": [
            {"text": FRAGE.format(jahr=jahr)},
            {"text": "BILD A:"}, teil(a_pfad),
            {"text": "BILD B:"}, teil(b_pfad),
        ]}],
        "generationConfig": {"temperature": 0.2, "maxOutputTokens": 8000},
    }
    req = urllib.request.Request(
        URL.format(modell=modell) + "?key=" + schluessel,
        data=json.dumps(koerper).encode(),
        headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            antwort = json.loads(r.read())
    except urllib.error.HTTPError as e:
        sys.exit("API: %s %s" % (e.code, e.read()[:400]))
    roh = ""
    for k in antwort.get("candidates", []):
        for t in k.get("content", {}).get("parts", []):
            roh += t.get("text", "")
    m = re.search(r"\{.*\}", roh, re.S)
    if not m:
        return {"roh": roh[:800]}
    try:
        return json.loads(m.group(0))
    except json.JSONDecodeError:
        return {"roh": roh[:800]}


def main():
    p = argparse.ArgumentParser()
    p.add_argument("gebaut")
    p.add_argument("ziel")
    p.add_argument("--jahr", required=True)
    p.add_argument("--laeufe", type=int, default=2)
    p.add_argument("--saat", type=int, default=0)
    p.add_argument("--modell", default="gemini-3-pro-preview")
    a = p.parse_args()
    s = lade_schluessel()
    r = random.Random(a.saat or hash(a.jahr) & 0xffff)
    punkte = {"gebaut": 0, "ziel": 0}
    for i in range(a.laeufe):
        # Reihenfolge tauschen, damit die Position nicht mitmisst.
        tausch = (i % 2 == 1) if a.laeufe > 1 else r.random() < 0.5
        pa, pb = (a.ziel, a.gebaut) if tausch else (a.gebaut, a.ziel)
        u = frage(pa, pb, a.jahr, a.modell, s)
        wahl = u.get("besser")
        wer = None
        if wahl in ("A", "B"):
            gewinner = pa if wahl == "A" else pb
            wer = "gebaut" if gewinner == a.gebaut else "ziel"
            punkte[wer] += 1
        print(json.dumps({"lauf": i + 1, "A": pa, "B": pb, "waehlt": wahl,
                          "also": wer, **u}, ensure_ascii=False))
    print(json.dumps({"jahr": a.jahr, "gebaut": punkte["gebaut"],
                      "ziel": punkte["ziel"]}, ensure_ascii=False))
    sys.exit(3 if punkte["ziel"] > punkte["gebaut"] else 0)


if __name__ == "__main__":
    main()
