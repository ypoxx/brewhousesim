#!/usr/bin/env python3
"""Ein fremdes Ohr beschreibt EINE Tonprobe — ohne Dateinamen, ohne Absicht.

Damit findet man, was in einer Probe wirklich drin ist. Der Bauer hoert nicht
mit; er liest nur, was das Ohr gehoert hat. Genau so ist im ersten Durchgang
das Autohupen in 1600 aufgefallen — kein Mensch hat es gesucht.

    ./werkbank/schuss/klang/beschreibe.py spiel/ton/klang/hof2.mp3 --jahr 1600
    ./werkbank/schuss/klang/beschreibe.py spiel/ton/klang/hof*.mp3 --jahr 0
"""

import argparse
import base64
import concurrent.futures
import json
import mimetypes
import os
import pathlib
import re
import sys
import urllib.error
import urllib.request

URL = ("https://generativelanguage.googleapis.com/v1beta/models/"
       "{modell}:generateContent")

FRAGE = """Du hörst eine kurze Tonaufnahme. Du bekommst kein Bild und keinen Dateinamen.

1. Zähle JEDEN einzelnen Klang auf, den du hörst. Auch leise im Hintergrund.
2. In welchem Jahrhundert könnte diese Aufnahme spielen, allein nach dem Klang?
3. Kommt darin irgendetwas vor, das es im Jahr {jahr} noch NICHT gab — ein
   Motor, eine Hupe, ein elektrisches Gerät, eine Sirene, eine Stimme,
   ein Musikstil? Nenne es genau und sage, an welcher Stelle (Sekunde).
4. Kommt eine SINGENDE oder SPRECHENDE menschliche Stimme vor?

Antworte NUR mit diesem JSON, ohne Rahmen:
{{"klaenge": ["...","..."], "jahrhundert": "...", "falsch": "...", "stimme": "ja|nein"}}"""


def frage(pfad, jahr, modell, schluessel):
    daten = pathlib.Path(pfad).read_bytes()
    typ = mimetypes.guess_type(pfad)[0] or "audio/wav"
    typ = {"audio/x-wav": "audio/wav", "audio/mpeg": "audio/mp3"}.get(typ, typ)
    körper = {
        "contents": [{"parts": [
            {"text": FRAGE.format(jahr=jahr)},
            {"inlineData": {"mimeType": typ,
                            "data": base64.b64encode(daten).decode()}}]}],
        "generationConfig": {"temperature": 0.1,
                             "responseMimeType": "application/json",
                             "maxOutputTokens": 4096}}
    anfrage = urllib.request.Request(
        URL.format(modell=modell) + "?key=" + schluessel,
        data=json.dumps(körper).encode(),
        headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(anfrage, timeout=240) as antwort:
            roh = json.load(antwort)
    except urllib.error.HTTPError as f:
        return {"abbruch": "API %s: %s" % (f.code, f.read().decode()[:200])}
    except Exception as f:                                    # noqa: BLE001
        return {"abbruch": str(f)[:200]}
    kand = (roh.get("candidates") or [{}])[0]
    text = "".join(t.get("text", "")
                   for t in ((kand.get("content") or {}).get("parts") or [])).strip()
    if not text:
        return {"abbruch": "keine Antwort (%s)" % kand.get("finishReason")}
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        m = re.search(r'"falsch"\s*:\s*"((?:[^"\\]|\\.)*)"', text)
        return {"klaenge": [], "jahrhundert": "?",
                "falsch": m.group(1) if m else text[:200], "geborgen": True}


def main():
    p = argparse.ArgumentParser()
    p.add_argument("datei", nargs="+")
    p.add_argument("--jahr", default="1600")
    p.add_argument("--modell", default="gemini-3.1-pro-preview")
    a = p.parse_args()
    k = os.environ.get("GEMINI_API_KEY")
    if not k:
        sys.exit("$GEMINI_API_KEY fehlt.")

    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        for datei, u in zip(a.datei,
                            pool.map(lambda d: frage(d, a.jahr, a.modell, k), a.datei)):
            print("── %s" % pathlib.Path(datei).name)
            if u.get("abbruch"):
                print("   OHR SCHWEIGT: %s\n" % u["abbruch"])
                continue
            print("   Klänge:  %s" % " · ".join(u.get("klaenge") or []))
            print("   Zeit:    %s" % u.get("jahrhundert"))
            print("   FALSCH:  %s" % (u.get("falsch") or "—"))
            print("   Stimme:  %s\n" % u.get("stimme"))


if __name__ == "__main__":
    main()
