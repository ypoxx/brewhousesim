#!/usr/bin/env python3
"""Zweites Ohr, NEBEN werkbank/hoerer.py gebaut (ZUSTAENDIGKEIT 16: am
Messgeraet der anderen wird nicht gedreht). Es misst etwas anderes als das
erste: nicht die Epoche, sondern den VORGANG und seine Sekunde.

    ./ohr-zwei.py probe-alpha.wav

Zwei Fragen, beide blind:
  A  offen  — nenne jeden hoerbaren Vorgang mit der Sekunde.
  B  Menue  — acht Kandidaten, VIER davon kommen im Spiel nicht vor.
             Wer die Blender genauso oft hoert wie die echten Vorgaenge,
             hoert nichts; damit hat diese Messung eine eigene Nullprobe.

Ein Abbruch ist KEINE MESSUNG. Wie beim ersten Ohr wird eine unlesbare
Antwort nie als Fehlurteil verbucht.
"""
import base64, json, mimetypes, os, pathlib, re, sys, urllib.error, urllib.request

URL = ("https://generativelanguage.googleapis.com/v1beta/models/"
       "{m}:generateContent")

FRAGE_A = """Du hoerst dreissig Sekunden Ton aus einem Computerspiel. Kein Bild.

Schreibe eine Zeitleiste: jeder Vorgang, den du hoerst, mit der Sekunde, an der
er beginnt. Rate nicht, was das Spiel sein koennte — beschreibe nur, was du hoerst.

Antworte NUR mit JSON:
{"leiste": [{"sek": <zahl>, "was": "..."}], "dauerhaft": "was ununterbrochen laeuft",
 "aenderung": "aendert sich der Grundklang im Verlauf, ja/nein und wo"}"""

MENUE = [
    ("fuhre",     "ein beladenes Gefaehrt setzt sich in Bewegung und faehrt weg"),
    ("sud",       "Sieden, Ruehren, Umschlagen von Fluessigkeit — ein Brauvorgang"),
    ("zahltag",   "eine einzelne Glocke und danach gezaehltes Geld"),
    ("gegner",    "jemand anderes handelt, ohne dass man es angestossen hat: Werben, Bauen, Zugreifen im Nachbarhof"),
    ("blender_regen",  "Regen oder Gewitter"),
    ("blender_hund",   "ein bellender Hund"),
    ("blender_chor",   "mehrstimmiger Kirchengesang"),
    ("blender_schiff", "ein Schiffshorn oder eine Sirene auf dem Wasser"),
]

FRAGE_B = """Du hoerst dreissig Sekunden Ton. Kein Bild.

Fuer JEDEN der folgenden Punkte: hoerst du das? Wenn ja, bei welcher Sekunde,
und wie sicher bist du (0-100)? Wenn nein, schreibe sek -1 und sicher 0.
Sei streng: was du nicht wirklich hoerst, ist nicht da.

""" + "\n".join("%s = %s" % (k, t) for k, t in MENUE) + """

Antworte NUR mit JSON:
{"<schluessel>": {"da": true|false, "sek": <zahl>, "sicher": <0-100>}, ...}"""


def frage(pfad, text, modell, schluessel):
    daten = pathlib.Path(pfad).read_bytes()
    typ = mimetypes.guess_type(pfad)[0] or "audio/wav"
    if typ == "audio/x-wav":
        typ = "audio/wav"
    koerper = {"contents": [{"parts": [
        {"text": text},
        {"inlineData": {"mimeType": typ, "data": base64.b64encode(daten).decode()}}]}],
        "generationConfig": {"temperature": 0.2, "responseMimeType": "application/json",
                             "maxOutputTokens": 4096}}
    anfrage = urllib.request.Request(URL.format(m=modell) + "?key=" + schluessel,
                                     data=json.dumps(koerper).encode(),
                                     headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(anfrage, timeout=240) as a:
            roh = json.load(a)
    except urllib.error.HTTPError as f:
        return {"abbruch": "API %s: %s" % (f.code, f.read().decode()[:200])}
    k = (roh.get("candidates") or [{}])[0]
    t = "".join(p.get("text", "") for p in ((k.get("content") or {}).get("parts") or [])).strip()
    if not t:
        return {"abbruch": "leer (finishReason=%s)" % k.get("finishReason")}
    try:
        return json.loads(t)
    except json.JSONDecodeError:
        m = re.search(r'\{.*\}', t, re.S)
        if m:
            try:
                return json.loads(m.group(0))
            except json.JSONDecodeError:
                pass
        return {"abbruch": "unlesbar", "rohtext": t[:300]}


def main():
    s = os.environ.get("GEMINI_API_KEY")
    if not s:
        sys.stderr.write("$GEMINI_API_KEY fehlt.\n"); sys.exit(1)
    modell = os.environ.get("OHR_MODELL", "gemini-3.1-pro-preview")
    alles = {}
    for pfad in sys.argv[1:]:
        name = pathlib.Path(pfad).name
        a = frage(pfad, FRAGE_A, modell, s)
        b = frage(pfad, FRAGE_B, modell, s)
        alles[name] = {"offen": a, "menue": b}
        print("── %s" % name)
        if a.get("abbruch"):
            print("   A KEINE MESSUNG: %s" % a["abbruch"])
        else:
            for e in (a.get("leiste") or []):
                print("   %5ss  %s" % (e.get("sek"), e.get("was")))
            print("   dauerhaft: %s" % a.get("dauerhaft"))
            print("   aendert:   %s" % a.get("aenderung"))
        if b.get("abbruch"):
            print("   B KEINE MESSUNG: %s" % b["abbruch"])
        else:
            for k, _ in MENUE:
                v = b.get(k) or {}
                print("   %-16s %s  sek %s  sicher %s"
                      % (k, "JA " if v.get("da") else "nein", v.get("sek"), v.get("sicher")))
        print()
    print(json.dumps(alles, ensure_ascii=False))


if __name__ == "__main__":
    main()
