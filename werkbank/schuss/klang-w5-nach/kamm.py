#!/usr/bin/env python3
"""AUFLAGE 3 AM MITSCHNITT NACHGEMESSEN, nicht am Quelltext.

Zwoelf identische Kopien derselben Probe mit 40 ms Versatz sind ein
Kammfilter. Man sieht das nicht am Pegel und nicht an der Huellkurve — man
sieht es an der AUTOKORRELATION: eine Welle, die sich selbst nach 40 ms
gleicht, korreliert bei genau dieser Verschiebung stark mit sich selbst.
Ein Fass, das einmal rollt, tut das nicht.

Gemessen wird in dem Fenster, in dem `fuhre:fuellen` steht (Vorgabe 2,0-3,2 s
der Aufnahme), ueber Verschiebungen von 10 bis 300 ms. Ausgegeben wird der
hoechste Wert und die Verschiebung, bei der er steht.

    ./kamm.py vorher/e4-gespielt.wav nachher/e4-gespielt.wav
    VON=2.0 BIS=3.2 ./kamm.py …

Kein numpy im Haus; das reicht auch ohne.
"""
import array
import json
import math
import os
import pathlib
import sys
import wave

VON = float(os.environ.get("VON", "2.0"))
BIS = float(os.environ.get("BIS", "3.2"))
LAG_VON = float(os.environ.get("LAGVON", "0.010"))
LAG_BIS = float(os.environ.get("LAGBIS", "0.300"))


def spur(pfad):
    with wave.open(pfad, "rb") as w:
        n, rate, kn = w.getnframes(), w.getframerate(), w.getnchannels()
        a = array.array("h")
        a.frombytes(w.readframes(n))
    if kn > 1:
        a = a[::kn]
    return [x / 32768.0 for x in a], rate


def autokorr(d, rate):
    """Normierte Autokorrelation ueber dem Messfenster, je Verschiebung."""
    i0, i1 = int(VON * rate), int(BIS * rate)
    # gleitender Mittelwert heraus, sonst zaehlt der Gleichanteil mit
    stueck = d[i0:i1 + int(LAG_BIS * rate)]
    m = sum(stueck) / max(1, len(stueck))
    s = [x - m for x in stueck]
    kern = i1 - i0
    e0 = sum(x * x for x in s[:kern])
    if e0 <= 0:
        return []
    aus = []
    lag = int(LAG_VON * rate)
    ende = int(LAG_BIS * rate)
    schritt = max(1, int(rate * 0.0005))          # halbe Millisekunde
    while lag <= ende:
        q = sum(s[i] * s[i + lag] for i in range(0, kern, 4))
        e1 = sum(s[i] * s[i] for i in range(0, kern, 4))
        e2 = sum(s[i + lag] * s[i + lag] for i in range(0, kern, 4))
        n = math.sqrt(e1 * e2)
        aus.append((round(lag / rate * 1000, 1), round(q / n, 4) if n else 0.0))
        lag += schritt
    return aus


if __name__ == "__main__":
    ergebnis = []
    for p in sys.argv[1:]:
        d, rate = spur(p)
        k = autokorr(d, rate)
        hoch = max(k, key=lambda x: x[1]) if k else (None, None)
        ergebnis.append({"datei": str(pathlib.Path(p)),
                         "fenster_s": [VON, BIS],
                         "hoechste_selbstaehnlichkeit": hoch[1],
                         "bei_ms": hoch[0],
                         "kurve": k[::10]})
    print(json.dumps(ergebnis, indent=1))
