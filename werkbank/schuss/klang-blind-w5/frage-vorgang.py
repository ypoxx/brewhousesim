#!/usr/bin/env python3
"""MEIN eigenes Ohr, neben dem des Hauses gebaut — hoerer.py bleibt unberuehrt.

Zwei Fragen, die hoerer.py nicht stellt:

  1. VORGANG MIT ZWANG. Statt "was geschieht" wird eine Liste vorgelegt und
     je Punkt ja/nein plus SEKUNDE verlangt. In der Liste stehen BLENDER —
     Vorgaenge, die es im Spiel nirgends gibt (kein Klang im KATALOG von
     spiel/kern/ton.js bedient sie). Wer die Blender bejaht, raet.
  2. ANACHRONISMEN MIT SEKUNDE.

Das Ohr erfaehrt weder Epoche noch Dateiname (nur die Bytes gehen hinaus).

    ./frage-vorgang.py --jahr 1350 probe.wav
"""
import argparse, base64, json, mimetypes, os, pathlib, re, sys, time
import urllib.error, urllib.request

URL = ("https://generativelanguage.googleapis.com/v1beta/models/"
       "{modell}:generateContent")

# Vier echte Vorgaenge (a-d) und vier Blender (e-h). Die Blender sind an
# spiel/kern/ton.js:144-340 geprueft: kein KATALOG-Eintrag bedient sie.
PUNKTE = [
    ("a", "Ein Fuhrwerk / Fahrzeug faehrt vom Hof WEG (Abfahrt einer Lieferung)"),
    ("b", "Es wird gebraut: eine Sudpfanne / ein Sudwerk arbeitet"),
    ("c", "Ein einzelnes Glocken- oder Pfeifenzeichen, und danach wird Geld gezaehlt"),
    ("d", "Von einem FREMDEN Hof nebenan, gedaempft wie durch eine Wand, geschieht etwas"),
    ("e", "Ein Gewitter: Regen und Donner"),
    ("f", "Eine Kirchenorgel spielt"),
    ("g", "Ein Schiff legt am Fluss an: Wasser, Taue, Planken"),
    ("h", "Glas zerspringt: etwas geht zu Bruch"),
]

FRAGE = """Du hoerst dreissig Sekunden Ton aus einem Computerspiel. Du bekommst kein Bild
und keinen Dateinamen.

TEIL 1. Fuer jeden der folgenden Punkte: kommt er in dieser Aufnahme vor?
Antworte ehrlich mit nein, wenn du ihn nicht hoerst. Es ist ausdruecklich
moeglich, dass mehrere Punkte NICHT vorkommen.

{liste}

TEIL 2. Nenne jeden Klang, der aus der Zeit faellt, in der das Stueck spielt —
gib fuer jeden die Sekunde an, bei der er steht.

Antworte NUR mit diesem JSON, ohne Rahmen:
{{"punkte": {{"a": {{"da": true|false, "sekunde": <Zahl oder null>, "sicher": <0-100>}},
             ... fuer a bis h ...}},
  "jahr_geschaetzt": <die Jahreszahl, die du hoerst>,
  "anachronismen": [{{"sekunde": <Zahl>, "klang": "...", "warum": "..."}}]}}"""


def frag(pfad, modell, schluessel):
    daten = pathlib.Path(pfad).read_bytes()
    typ = mimetypes.guess_type(pfad)[0] or "audio/wav"
    if typ == "audio/x-wav":
        typ = "audio/wav"
    liste = "\n".join("  %s) %s" % (k, t) for k, t in PUNKTE)
    koerper = {
        "contents": [{"parts": [
            {"text": FRAGE.format(liste=liste)},
            {"inlineData": {"mimeType": typ, "data": base64.b64encode(daten).decode()}}
        ]}],
        "generationConfig": {"temperature": 0.2, "responseMimeType": "application/json",
                             "maxOutputTokens": 8192}
    }
    anfrage = urllib.request.Request(
        URL.format(modell=modell) + "?key=" + schluessel,
        data=json.dumps(koerper).encode(),
        headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(anfrage, timeout=240) as antwort:
            roh = json.load(antwort)
    except urllib.error.HTTPError as f:
        return {"abbruch": "API %s: %s" % (f.code, f.read().decode()[:300])}
    except Exception as f:
        return {"abbruch": "netz: %s" % f}

    kand = (roh.get("candidates") or [{}])[0]
    text = "".join(t.get("text", "")
                   for t in ((kand.get("content") or {}).get("parts") or [])).strip()
    if not text:
        return {"abbruch": "leer (finishReason=%s)" % kand.get("finishReason")}
    try:
        u = json.loads(text)
    except json.JSONDecodeError:
        return {"abbruch": "unlesbar", "rohtext": text[:500]}
    if not isinstance(u, dict) or "punkte" not in u:
        return {"abbruch": "kein punkte-Feld", "rohtext": text[:500]}
    # Eine Verweigerung darf nie als Messung gebucht werden.
    if re.search(r"fehlend|keine?\s+(audio|ton|tonspur)|leere?\s+zeitstempel"
                 r"|no\s+audio|cannot\s+(process|hear)", text, re.I):
        return {"abbruch": "Verweigerung", "rohtext": text[:300]}
    return u


def main():
    p = argparse.ArgumentParser()
    p.add_argument("datei", nargs="+")
    p.add_argument("--modell", default="gemini-3.1-pro-preview")
    a = p.parse_args()
    s = os.environ["GEMINI_API_KEY"]
    aus = []
    for d in a.datei:
        u = None
        # Wartezeit zwischen den Versuchen. Ohne sie feuern drei Versuche
        # binnen einer Sekunde in dieselbe Minutensperre (429) und die
        # Messung faellt aus, obwohl das Kontingent des Tages noch steht.
        for versuch in range(4):
            u = frag(d, a.modell, s)
            if not u.get("abbruch"):
                break
            time.sleep(20 * (versuch + 1))
        u["datei"] = pathlib.Path(d).name
        aus.append(u)
        pk = u.get("punkte") or {}
        sys.stderr.write("%s  echt=%s  blender=%s  %s\n" % (
            u["datei"],
            "".join(k for k in "abcd" if (pk.get(k) or {}).get("da")) or "-",
            "".join(k for k in "efgh" if (pk.get(k) or {}).get("da")) or "-",
            u.get("abbruch", "")))
    print(json.dumps(aus, indent=1, ensure_ascii=False))


if __name__ == "__main__":
    main()
