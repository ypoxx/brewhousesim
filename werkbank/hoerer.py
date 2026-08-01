#!/usr/bin/env python3
"""Das fremde Ohr — Latte 3 aus gauntlet/MESSLATTE.md, ausführbar.

    ./werkbank/hoerer.py probe.wav
    ./werkbank/hoerer.py probe.wav --erwartet 3        # nennt Bestanden/Durchgefallen
    ./werkbank/hoerer.py e1.wav e2.wav e3.wav e4.wav --blind

Das Ohr bekommt NUR den Ton. Kein Bild, kein Dateiname, keine Epoche, keine
Beschreibung dessen, was der Bauer sich gedacht hat. Es bekommt die vier
möglichen Jahre und muss eines wählen und sagen, was geschieht.

Genau das ist die Latte: rät es falsch, geht die Arbeit zurück an den Builder.
Wer hier heimlich die Epoche in den Prompt schreibt, misst nichts mehr.

Ausstiegscodes: 0 bestanden (oder kein --erwartet gesetzt), 1 Aufruffehler,
2 API-Fehler, 3 durchgefallen.
"""

import argparse
import base64
import json
import mimetypes
import os
import pathlib
import sys
import urllib.error
import urllib.request

URL = ("https://generativelanguage.googleapis.com/v1beta/models/"
       "{modell}:generateContent")

FRAGE = """Du hörst eine Tonaufnahme aus einem Computerspiel. Du bekommst kein Bild.

Das Spiel spielt in EINEM einzigen Brauhaus-Hof in EINER Stadt, aber zu vier
verschiedenen Zeiten:

  1 = um 1350
  2 = um 1600
  3 = um 1884
  4 = um 1970

Sage mir allein nach dem Klang:

1. Welche der vier Zeiten ist das? Nenne die Ziffer.
2. Wie sicher bist du, von 0 bis 100?
3. Was geschieht gerade? Ein oder zwei Sätze.
4. Woran genau hast du die Zeit erkannt? Nenne die konkreten Klänge.
5. Gibt es etwas, das nicht in diese Zeit passt? Wenn ja, was.

Antworte NUR mit diesem JSON, ohne Rahmen:
{"epoche": <1-4>, "sicher": <0-100>, "vorgang": "...", "woran": "...", "stoert": "..."}"""


def hoere(pfad, modell, schluessel):
    daten = pathlib.Path(pfad).read_bytes()
    typ = mimetypes.guess_type(pfad)[0] or "audio/wav"
    if typ == "audio/x-wav":
        typ = "audio/wav"
    if typ == "audio/mpeg":
        typ = "audio/mp3"

    körper = {
        "contents": [{"parts": [
            {"text": FRAGE},
            {"inlineData": {"mimeType": typ,
                            "data": base64.b64encode(daten).decode()}}
        ]}],
        # Kein thinking-Budget nötig; das Ohr soll hören, nicht grübeln.
        "generationConfig": {"temperature": 0.2, "responseMimeType": "application/json"}
    }

    anfrage = urllib.request.Request(
        URL.format(modell=modell) + "?key=" + schluessel,
        data=json.dumps(körper).encode(),
        headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(anfrage, timeout=180) as antwort:
            roh = json.load(antwort)
    except urllib.error.HTTPError as f:
        sys.stderr.write("API %s: %s\n" % (f.code, f.read().decode()[:400]))
        sys.exit(2)

    kand = (roh.get("candidates") or [{}])[0]
    teile = (kand.get("content") or {}).get("parts") or []
    text = "".join(t.get("text", "") for t in teile).strip()
    if not text:
        sys.stderr.write("Keine Antwort. finishReason=%s\n" % kand.get("finishReason"))
        sys.exit(2)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {"epoche": 0, "sicher": 0, "vorgang": text[:300],
                "woran": "", "stoert": "Antwort war kein JSON"}


def main():
    p = argparse.ArgumentParser(description="Blindes Ohr für die Tonlatte")
    p.add_argument("datei", nargs="+", help="Tondateien (wav/mp3)")
    p.add_argument("--erwartet", type=int, default=None,
                   help="Epoche 1-4; ist sie gesetzt, wird geurteilt")
    p.add_argument("--blind", action="store_true",
                   help="mehrere Dateien: erwartet 1,2,3,4 in dieser Reihenfolge")
    p.add_argument("--modell", default="gemini-3.1-pro-preview")
    a = p.parse_args()

    schluessel = os.environ.get("GEMINI_API_KEY")
    if not schluessel:
        sys.stderr.write("$GEMINI_API_KEY fehlt.\n")
        sys.exit(1)

    treffer, gesamt = 0, 0
    for i, datei in enumerate(a.datei):
        if not pathlib.Path(datei).exists():
            sys.stderr.write("Nicht gefunden: %s\n" % datei)
            sys.exit(1)
        soll = (i + 1) if a.blind else a.erwartet
        u = hoere(datei, a.modell, schluessel)

        print("── %s" % pathlib.Path(datei).name)
        print("   gehört:  Epoche %s  (sicher %s)" % (u.get("epoche"), u.get("sicher")))
        print("   Vorgang: %s" % u.get("vorgang"))
        print("   woran:   %s" % u.get("woran"))
        if u.get("stoert"):
            print("   STÖRT:   %s" % u.get("stoert"))
        if soll:
            gesamt += 1
            gut = int(u.get("epoche") or 0) == int(soll)
            treffer += 1 if gut else 0
            print("   Urteil:  %s (erwartet %s)"
                  % ("BESTANDEN" if gut else "DURCHGEFALLEN", soll))
        print()

    if gesamt:
        print("Ohr: %d von %d richtig." % (treffer, gesamt))
        sys.exit(0 if treffer == gesamt else 3)


if __name__ == "__main__":
    main()
