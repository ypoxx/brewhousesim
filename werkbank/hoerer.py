#!/usr/bin/env python3
"""Das fremde Ohr — Latte 3 aus gauntlet/MESSLATTE.md, ausführbar.

    ./werkbank/hoerer.py probe.wav
    ./werkbank/hoerer.py probe.wav --erwartet 3        # nennt Bestanden/Durchgefallen
    ./werkbank/hoerer.py aufnahmen/*.wav --blind   # mischt selbst, Epoche aus dem Dateinamen

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
import re
import time
import random
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
        "generationConfig": {
            "temperature": 0.2,
            "responseMimeType": "application/json",
            # Ohne diese Grenze bricht die Antwort mitten im JSON ab: die
            # Denk-Token des Modells zaehlen mit, und das Urteil steht am ENDE.
            # Ein abgeschnittenes JSON hat der Latte schon einmal ein falsches
            # DURCHGEFALLEN untergeschoben — der teuerste Fehler, den ein
            # Messgeraet machen kann.
            "maxOutputTokens": 4096
        }
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
        return {"abbruch": "keine Antwort (finishReason=%s)" % kand.get("finishReason")}
    return deute(text, kand.get("finishReason"))


# Eine Verweigerung ist keine Antwort. Der blinde Kritiker von DER KLANG hat am
# 3. August gemessen, dass eine Modell-Verweigerung zu "Epoche 1, sicher 0"
# geborgen wurde — mit --erwartet waere daraus ein Fehlurteil UEBER DAS SPIEL
# geworden, obwohl das Ohr nie etwas gehoert hat. Die Huerde ist mit Absicht eng:
# nur wenn der Text das Nichthoeren AUSSPRICHT und die Sicherheit bei 0 liegt.
# Bloss niedrige Sicherheit bleibt ein echter, zaehlender Fehlgriff.
# ERWEITERT am 3.8. abends: die erste Fassung liess
#   "Aufgrund der fehlenden Audiodaten … leere Zeitstempel"
# bei sicher=0 durch und buchte sie als Epoche 1. Mit --erwartet 1 waere daraus
# ein BESTANDEN OHNE MESSUNG geworden — noch schlimmer als ein falsches
# Durchgefallen, weil es niemandem auffaellt. Gemessen und gemeldet vom blinden
# Kritiker DER KLANG (Welle 5).
VERWEIGERT = re.compile(
    r"keine?\s+(audio|ton|klang|datei)|fehlende[nr]?\s+(audio|ton|klang|datei)"
    r"|nicht\s+(hoeren|hören|verarbeiten|abspielen)"
    r"|no\s+audio|cannot\s+(process|hear|access)|unable\s+to\s+(process|hear)"
    r"|i'?m\s+sorry|es\s+wurde\s+keine|leere[nr]?\s+zeitstempel"
    r"|ohne\s+(audio|ton)|audiodaten\s+fehl", re.I)


def verweigert(u, text):
    """Wahr, wenn die Antwort sagt, dass gar nichts gehoert wurde."""
    s = u.get("sicher")
    return (s in (0, None)) and bool(VERWEIGERT.search(text or ""))


def deute(text, grund=None):
    """Macht aus der Antwort ein Urteil — auch wenn das JSON abgeschnitten ist.

    Ein Messgeraet darf schweigen ('abbruch'), aber es darf niemals eine
    unvollstaendige Antwort als Fehlurteil ausgeben.
    """
    try:
        u = json.loads(text)
        # Einmal kam eine Liste statt eines Objekts zurueck und riss das
        # Skript mit einem Traceback ab.
        if isinstance(u, list):
            u = next((x for x in u if isinstance(x, dict)), None)
        if isinstance(u, dict) and u.get("epoche") is not None:
            if verweigert(u, text):
                return {"abbruch": "Verweigerung, kein Urteil (sicher=%s)" % u.get("sicher"),
                        "rohtext": text[:400]}
            return u
    except json.JSONDecodeError:
        pass

    # Bergung: Die Ziffer steht im Rohtext, auch wenn die Klammer fehlt.
    e = re.search(r'"epoche"\s*:\s*([1-4])', text)
    if not e:
        return {"abbruch": "unlesbare Antwort%s" % (" (%s)" % grund if grund else ""),
                "rohtext": text[:400]}

    def feld(name):
        m = re.search(r'"%s"\s*:\s*"((?:[^"\\]|\\.)*)"' % name, text)
        return m.group(1) if m else ""

    s = re.search(r'"sicher"\s*:\s*(\d+)', text)
    u = {"epoche": int(e.group(1)), "sicher": int(s.group(1)) if s else None,
         "vorgang": feld("vorgang"), "woran": feld("woran"),
         "stoert": feld("stoert"), "geborgen": True}
    if verweigert(u, text):
        return {"abbruch": "Verweigerung, kein Urteil (sicher=%s)" % u.get("sicher"),
                "rohtext": text[:400]}
    return u


def main():
    p = argparse.ArgumentParser(description="Blindes Ohr für die Tonlatte")
    p.add_argument("datei", nargs="+", help="Tondateien (wav/mp3)")
    p.add_argument("--erwartet", type=int, default=None,
                   help="Epoche 1-4; ist sie gesetzt, wird geurteilt")
    p.add_argument("--blind", action="store_true",
                   help="mischt die Dateien SELBST und deckt den Schlüssel erst "
                        "am Ende auf; die Epoche wird aus dem Dateinamen gelesen "
                        "(…e1…, …epoche2…)")
    p.add_argument("--modell", default="gemini-3.1-pro-preview")
    a = p.parse_args()

    schluessel = os.environ.get("GEMINI_API_KEY")
    if not schluessel:
        sys.stderr.write("$GEMINI_API_KEY fehlt.\n")
        sys.exit(1)

    dateien = list(a.datei)
    soll_je = {}
    if a.blind:
        # BLIND HEISST BLIND. Bis zum 3. August 2026 tat --blind nur dies:
        #   soll = i + 1
        # Es mischte NICHT, es unterstellte die Reihenfolge 1,2,3,4 — und die
        # Aufrufzeile in dieser Datei lud mit `e1 e2 e3 e4 --blind` genau dazu
        # ein. Wer das tippte, mass seine eigene Sortierung und nannte das
        # Ergebnis blind. Gefunden vom blinden Kritiker DER KLANG (Welle 5).
        # Jetzt liest das Werkzeug die Soll-Epoche aus dem DATEINAMEN, mischt
        # selbst und deckt den Schluessel erst auf, wenn alle Antworten da sind.
        for d in dateien:
            m = re.search(r'(?:^|[^0-9])e(?:poche)?[ _-]?([1-4])(?:[^0-9]|$)',
                          pathlib.Path(d).name, re.I)
            if not m:
                sys.stderr.write(
                    "--blind braucht die Epoche im Dateinamen (z.B. epoche3.wav): %s\n" % d)
                sys.exit(1)
            soll_je[d] = int(m.group(1))
        random.shuffle(dateien)
        print("%d Aufnahmen gemischt. Der Schlüssel steht am Ende.\n" % len(dateien))

    treffer, gesamt, unlesbar = 0, 0, 0
    for i, datei in enumerate(dateien):
        if not pathlib.Path(datei).exists():
            sys.stderr.write("Nicht gefunden: %s\n" % datei)
            sys.exit(1)
        soll = soll_je.get(datei) if a.blind else a.erwartet

        # Ein Abbruch ist kein Urteil. Lieber zweimal fragen als einmal falsch
        # durchfallen lassen — aber MIT WARTEZEIT dazwischen. Ohne sie liefen
        # die drei Versuche in Millisekunden gegen dieselbe Sperre und waren
        # zu dritt so wertlos wie einer: den blinden Kritiker DER KLANG hat
        # das 22 von 24 Messungen gekostet (HTTP 429).
        for versuch in range(3):
            u = hoere(datei, a.modell, schluessel)
            if not u.get("abbruch"):
                break
            if versuch < 2:
                time.sleep(5 * (versuch + 1))

        print("── %s" % pathlib.Path(datei).name)
        if u.get("abbruch"):
            print("   OHR SCHWEIGT: %s" % u["abbruch"])
            if u.get("rohtext"):
                print("   Rohtext: %s" % u["rohtext"][:200])
            print("   Urteil:  KEINE MESSUNG — nicht als Durchfallen werten.")
            print()
            unlesbar += 1
            continue

        print("   gehört:  Epoche %s  (sicher %s)%s"
              % (u.get("epoche"), u.get("sicher"),
                 "  [aus abgeschnittener Antwort geborgen]" if u.get("geborgen") else ""))
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

    if a.blind:
        # Der Schluessel erst hier — vorher konnte ihn niemand sehen, auch der
        # nicht, der das Werkzeug aufruft. Das ist der Unterschied zwischen
        # blind und "in der Reihenfolge, die ich selbst gewaehlt habe".
        print("── Schlüssel (erst jetzt aufgedeckt)")
        for d in dateien:
            print("   %-34s war Epoche %d" % (pathlib.Path(d).name, soll_je[d]))
        print()

    if unlesbar:
        print("%d Datei(en) ohne Messung — dreimal gefragt, dreimal unlesbar." % unlesbar)
    if gesamt:
        print("Ohr: %d von %d richtig." % (treffer, gesamt))
    # Ausstiegscodes getrennt. Vorher stand 3 sowohl fuer "durchgefallen" als
    # auch fuer "es gab gar keine Messung" — wer das Skript in einer Kette
    # aufruft, konnte beides nicht unterscheiden und haette eine ausgefallene
    # Messung als Urteil ueber das Spiel gebucht. Gemessen und gemeldet vom
    # blinden Kritiker DER KLANG am 3. August 2026.
    #   0 = alles richtig, nichts fehlt
    #   2 = ueberhaupt keine Messung zustande gekommen
    #   3 = gemessen und danebengelegen
    #   4 = gemessen, alles Gemessene richtig, aber es fehlen Messungen
    if gesamt and treffer < gesamt:
        sys.exit(3)
    if gesamt and unlesbar:
        sys.exit(4)
    if gesamt:
        sys.exit(0)
    if unlesbar:
        sys.exit(2)


if __name__ == "__main__":
    main()
