#!/usr/bin/env python3
"""DER ZWEITBLICK — Gemini als fremdes Auge auf einem Screenshot.

  GEMINI_API_KEY=... python3 werkbank/schuss/aufsicht/zweitblick.py <bild.png> [frage]

Angesetzt am 18. August 2026, mit ausdruecklicher Freigabe des Auftraggebers:
bei Vision-Urteilen darf Gemini als Zweitkorrektor mitsehen. Das Betriebsmodell
(UMSETZUNGSPLAN §1, „Fremde Sinne") sieht genau das vor — ein Auge, das nicht
aus derselben Modellfamilie stammt wie die Pruefer, sieht andere Dinge und
uebersieht andere. Konsens macht einen Befund hart; Widerspruch heisst:
selbst nochmal hinsehen, nicht mitteln.

Gibt reinen Text auf stdout. Exit 0 ok, 1 Aufruf-/Schluesselfehler, 2 API.
"""
import base64
import json
import os
import sys
import urllib.request

ENDPOINT = ("https://generativelanguage.googleapis.com/v1beta/models/"
            "gemini-2.5-flash:generateContent")

FRAGE_VORGABE = (
    "Du bist ein strenger UI-Pruefer. Das ist ein Screenshot eines deutschen "
    "Browser-Wirtschaftsspiels (Brauhaus-Simulation) bei 1366x768. Nenne die "
    "5 bis 8 groessten Probleme der Oberflaeche, die du WIRKLICH SIEHST — "
    "Lesbarkeit, Ueberlappungen, abgeschnittener Text, fehlende Hierarchie, "
    "Verstecktes, Uneinheitliches. Je Problem eine Zeile: wo im Bild, was, "
    "wie schlimm (A=unbenutzbar, B=stoert, C=Schoenheit). Danach ein Satz: "
    "was ein Neuling auf diesem Schirm zuerst tun wuerde und ob das richtig "
    "waere. Deutsch, keine Einleitung, keine Wiederholung der Aufgabe."
)


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__, file=sys.stderr)
        return 1
    schluessel = os.environ.get("GEMINI_API_KEY", "").strip()
    if not schluessel:
        print("GEMINI_API_KEY fehlt", file=sys.stderr)
        return 1
    bild = sys.argv[1]
    frage = sys.argv[2] if len(sys.argv) > 2 else FRAGE_VORGABE
    with open(bild, "rb") as f:
        b64 = base64.b64encode(f.read()).decode()
    rumpf = json.dumps({
        "contents": [{"parts": [
            {"inline_data": {"mime_type": "image/png", "data": b64}},
            {"text": frage},
        ]}],
        "generationConfig": {"temperature": 0.2, "maxOutputTokens": 1500},
    }).encode()
    anfrage = urllib.request.Request(
        ENDPOINT + "?key=" + schluessel, data=rumpf,
        headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(anfrage, timeout=90) as antwort:
            daten = json.load(antwort)
    except Exception as e:  # API-Fehler sauber melden, nicht stapeln
        print("API-Fehler: %s" % e, file=sys.stderr)
        return 2
    try:
        for teil in daten["candidates"][0]["content"]["parts"]:
            if "text" in teil:
                print(teil["text"])
        return 0
    except (KeyError, IndexError):
        print("Keine Textantwort: %s" % json.dumps(daten)[:300], file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main())
