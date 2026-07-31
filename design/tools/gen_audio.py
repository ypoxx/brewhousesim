#!/usr/bin/env python3
"""Erzeugt Ton — Musik, Geraeusch oder Sprache — und schreibt ihn auf die Platte.

Schluessel kommen aus der Umgebung und werden nie in dieses Repo geschrieben:
$ELEVENLABS_API_KEY und $GEMINI_API_KEY.

    ./gen_audio.py musik    --prompt "sparse hurdy-gurdy and tabor, austere" --out t.mp3 --dauer 20
    ./gen_audio.py geraeusch --prompt "heavy oak cask rolling on cobblestones" --out f.mp3 --dauer 3
    ./gen_audio.py stimme   --text "Der Ochsen ist leer seit Dienstag." --out w.mp3
    ./gen_audio.py stimmen                       # listet die verfuegbaren Stimmen

Was womit erzeugt wird:
  musik      ElevenLabs /v1/music
  geraeusch  ElevenLabs /v1/sound-generation
  stimme     ElevenLabs Text-to-Speech, bei --gemini stattdessen Gemini TTS

Ausstiegscodes: 0 gut, 1 Aufruf-/Konfigurationsfehler, 2 API-Fehler.
"""

import argparse
import base64
import json
import os
import pathlib
import struct
import sys
import urllib.error
import urllib.request

EL = "https://api.elevenlabs.io"
GEMINI = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

# Geprueft am 2026-07-31. Zwei deutsche Sprecher stehen zur Verfuegung; die
# uebrigen sind englischsprachig, funktionieren mit eleven_multilingual_v2 aber
# auch auf Deutsch.
STIMMEN = {
    "erzaehler": ("JBFqnCBsd6RMkjVDRZzb", "George — warm, erzaehlend, britisch"),
    "wirt":      ("MHOybJN5BsVS5H8m3mru", "Max Mustermann — ernst, deutsch"),
    "chronist":  ("wGD81UtSGECIRSWQjH8X", "Stefan Rank — sachlich, deutsch"),
    "fuhrmann":  ("N2lVS1w4EtoT3dr4eOWO", "Callum — rau"),
    "wirtin":    ("XrExE9yKIg1WjnnlVkGX", "Matilda — sachlich, weiblich"),
}


def schluessel(name):
    k = os.environ.get(name)
    if not k:
        sys.exit(f"kein Schluessel: {name} ist nicht gesetzt")
    return k.strip()


def hole(url, daten, kopf, roh=True):
    req = urllib.request.Request(url, data=json.dumps(daten).encode(), headers=kopf)
    try:
        with urllib.request.urlopen(req, timeout=300) as a:
            return a.read()
    except urllib.error.HTTPError as e:
        sys.exit(f"API-Fehler {e.code}: {e.read()[:600].decode(errors='replace')}")
    except urllib.error.URLError as e:
        sys.exit(f"Netzfehler: {e.reason}")


def el_kopf():
    return {"xi-api-key": schluessel("ELEVENLABS_API_KEY"), "Content-Type": "application/json"}


def als_wav(pcm, rate=24000):
    """Gemini liefert rohes 16-bit-PCM; hier bekommt es einen WAV-Kopf."""
    return (b"RIFF" + struct.pack("<I", 36 + len(pcm)) + b"WAVEfmt "
            + struct.pack("<IHHIIHH", 16, 1, 1, rate, rate * 2, 2, 16)
            + b"data" + struct.pack("<I", len(pcm)) + pcm)


def main():
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    u = p.add_subparsers(dest="art", required=True)

    m = u.add_parser("musik");     m.add_argument("--prompt", required=True)
    m.add_argument("--out", required=True); m.add_argument("--dauer", type=float, default=20)

    g = u.add_parser("geraeusch"); g.add_argument("--prompt", required=True)
    g.add_argument("--out", required=True); g.add_argument("--dauer", type=float, default=3)
    g.add_argument("--treue", type=float, default=0.4,
                   help="0 = frei erfunden, 1 = haelt sich streng an den Prompt")

    s = u.add_parser("stimme");    s.add_argument("--text", required=True)
    s.add_argument("--out", required=True)
    s.add_argument("--stimme", default="erzaehler",
                   help="Name aus STIMMEN oder eine rohe ElevenLabs-Voice-ID")
    s.add_argument("--modell", default="eleven_multilingual_v2")
    s.add_argument("--gemini", action="store_true", help="Gemini TTS statt ElevenLabs")
    s.add_argument("--gstimme", default="Charon",
                   help="Gemini-Stimme: Zephyr Puck Charon Kore Fenrir Leda Orus Aoede …")
    s.add_argument("--gmodell", default="gemini-2.5-pro-preview-tts")

    u.add_parser("stimmen")

    a = p.parse_args()

    if a.art == "stimmen":
        for name, (vid, wer) in STIMMEN.items():
            print(f"{name:12s} {vid}  {wer}")
        print("\nWeitere: curl -H \"xi-api-key: $ELEVENLABS_API_KEY\" "
              f"{EL}/v2/voices")
        return

    ziel = pathlib.Path(a.out)
    ziel.parent.mkdir(parents=True, exist_ok=True)

    if a.art == "musik":
        roh = hole(f"{EL}/v1/music", {"prompt": a.prompt,
                                      "music_length_ms": int(a.dauer * 1000)}, el_kopf())

    elif a.art == "geraeusch":
        roh = hole(f"{EL}/v1/sound-generation",
                   {"text": a.prompt, "duration_seconds": a.dauer,
                    "prompt_influence": a.treue}, el_kopf())

    elif a.art == "stimme" and a.gemini:
        # Gemini bricht ohne speechConfig wortlos ab (finishReason OTHER, kein Ton).
        antwort = json.loads(hole(
            GEMINI.format(model=a.gmodell) + "?key=" + schluessel("GEMINI_API_KEY"),
            {"contents": [{"parts": [{"text": a.text}]}],
             "generationConfig": {
                 "responseModalities": ["AUDIO"],
                 "speechConfig": {"voiceConfig": {
                     "prebuiltVoiceConfig": {"voiceName": a.gstimme}}}}},
            {"Content-Type": "application/json"}))
        try:
            teil = antwort["candidates"][0]["content"]["parts"][0]["inlineData"]["data"]
        except (KeyError, IndexError):
            sys.exit("Gemini hat keinen Ton geliefert: " + json.dumps(antwort)[:500])
        roh = als_wav(base64.b64decode(teil))
        if ziel.suffix.lower() != ".wav":
            ziel = ziel.with_suffix(".wav")

    else:
        vid = STIMMEN.get(a.stimme, (a.stimme, ""))[0]
        roh = hole(f"{EL}/v1/text-to-speech/{vid}",
                   {"text": a.text, "model_id": a.modell}, el_kopf())

    ziel.write_bytes(roh)
    print(f"{ziel}  {len(roh) // 1024} KB")


if __name__ == "__main__":
    main()
