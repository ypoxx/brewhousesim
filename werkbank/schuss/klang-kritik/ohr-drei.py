#!/usr/bin/env python3
"""Drittes Ohr: die Anachronismenprobe. Anders als die beiden anderen Fragen
bekommt dieses Ohr das Jahr GENANNT — anders laesst sich nicht pruefen, ob
etwas hineingehoert. Gegen das Gefaelligkeitsrisiko steht die Bauart der Frage:
verlangt wird fuer JEDEN gehoerten Klang das frueheste Jahr, in dem es ihn
geben konnte, mit Sekunde. Damit muss das Ohr sich festlegen, statt zu nicken.

    ./ohr-drei.py 1884 probe-beta.wav
"""
import base64, json, mimetypes, os, pathlib, re, sys, urllib.error, urllib.request

URL = ("https://generativelanguage.googleapis.com/v1beta/models/"
       "{m}:generateContent")

FRAGE = """Du hoerst dreissig Sekunden Ton aus einem Computerspiel, das im Jahr %s
in einem Brauhaus-Hof spielt. Du bekommst kein Bild.

Nenne JEDEN einzelnen Klang, den du hoerst — auch die Musik, auch das, was
durchgehend im Hintergrund laeuft. Fuer jeden Klang:
  sek   = die Sekunde, an der er beginnt (durchgehende Klaenge: 0)
  was   = was es ist
  ab    = das frueheste Jahr, in dem es diesen Klang so geben konnte
          (Musikstil: das frueheste Jahr, in dem dieser Stil gespielt wurde)
  grund = ein kurzer Satz dazu

Sei streng und nenne bei der Musik den Stil beim Namen. Rechne nichts schoen.

Antworte NUR mit JSON:
{"klaenge": [{"sek": <zahl>, "was": "...", "ab": <jahr>, "grund": "..."}]}"""


def main():
    if len(sys.argv) < 3:
        sys.stderr.write("Aufruf: ohr-drei.py <jahr> <datei...>\n"); sys.exit(1)
    jahr = sys.argv[1]
    s = os.environ.get("GEMINI_API_KEY")
    if not s:
        sys.stderr.write("$GEMINI_API_KEY fehlt.\n"); sys.exit(1)
    modell = os.environ.get("OHR_MODELL", "gemini-3.1-pro-preview")
    for pfad in sys.argv[2:]:
        daten = pathlib.Path(pfad).read_bytes()
        typ = mimetypes.guess_type(pfad)[0] or "audio/wav"
        if typ == "audio/x-wav":
            typ = "audio/wav"
        k = {"contents": [{"parts": [
            {"text": FRAGE % jahr},
            {"inlineData": {"mimeType": typ, "data": base64.b64encode(daten).decode()}}]}],
            "generationConfig": {"temperature": 0.2, "responseMimeType": "application/json",
                                 "maxOutputTokens": 24576}}
        a = urllib.request.Request(URL.format(m=modell) + "?key=" + s,
                                   data=json.dumps(k).encode(),
                                   headers={"Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(a, timeout=240) as r:
                roh = json.load(r)
        except urllib.error.HTTPError as f:
            print("── %s\n   KEINE MESSUNG: API %s" % (pathlib.Path(pfad).name, f.code)); continue
        c = (roh.get("candidates") or [{}])[0]
        t = "".join(p.get("text", "") for p in ((c.get("content") or {}).get("parts") or [])).strip()
        print("── %s   (Spiel-Jahr %s)" % (pathlib.Path(pfad).name, jahr))
        if not t:
            print("   KEINE MESSUNG: leer (%s)" % c.get("finishReason")); continue
        try:
            liste = json.loads(t).get("klaenge") or []
        except json.JSONDecodeError:
            liste = []
            for m in re.finditer(r'\{[^{}]*"ab"\s*:\s*(\d+)[^{}]*\}', t):
                try:
                    liste.append(json.loads(m.group(0)))
                except json.JSONDecodeError:
                    pass
            if not liste:
                print("   KEINE MESSUNG: unlesbar — %s" % t[:200]); continue
            print("   [aus abgeschnittener Antwort geborgen]")
        for e in liste:
            spaet = e.get("ab") and int(e["ab"]) > int(jahr)
            print("   %5ss  ab %s  %s%s" % (e.get("sek"), e.get("ab"),
                  "ZU SPAET · " if spaet else "", e.get("was")))
            if spaet:
                print("           %s" % e.get("grund"))
        print()


if __name__ == "__main__":
    main()
