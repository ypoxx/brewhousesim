#!/usr/bin/env python3
"""Eigener Pegelmesser — liest die WAV, die ich selbst geschrieben habe.

Kein numpy, kein ffmpeg: array + wave reichen. Gibt je Datei den
Effektivwert, die Spitze, den Verlauf in 0,5-s-Fenstern und den HUB
(lautestes Fenster / leisestes Fenster). Der Hub ist die Zahl, an der man
Teppich von Vorgang unterscheidet: ein Dauerteppich hat einen kleinen Hub.

    ./pegel.py roh/*.wav > pegel.json
"""
import wave, array, math, sys, json, pathlib

FENSTER = 0.5


def miss(pfad):
    with wave.open(pfad, 'rb') as w:
        n, rate, kn = w.getnframes(), w.getframerate(), w.getnchannels()
        roh = array.array('h')
        roh.frombytes(w.readframes(n))
    if kn > 1:
        roh = roh[::kn]
    d = [x / 32768.0 for x in roh]
    schritt = int(rate * FENSTER)
    verlauf = []
    for i in range(0, len(d) - schritt + 1, schritt):
        f = d[i:i + schritt]
        q = sum(x * x for x in f) / len(f)
        verlauf.append(round(math.sqrt(q), 5))
    ganz = math.sqrt(sum(x * x for x in d) / len(d))
    spitze = max(abs(x) for x in d)
    ruhe = sorted(verlauf)[len(verlauf) // 10]          # 10. Perzentil = Grundteppich
    laut = sorted(verlauf)[-max(1, len(verlauf) // 10)]  # 90. Perzentil
    return {
        'datei': pathlib.Path(pfad).name,
        'sekunden': round(len(d) / rate, 2), 'rate': rate,
        'rms': round(ganz, 5), 'spitze': round(spitze, 4),
        'verlauf_0s5': verlauf,
        'ruhepegel_p10': round(ruhe, 5), 'lautpegel_p90': round(laut, 5),
        'hub_p90_p10': round(laut / ruhe, 3) if ruhe > 1e-6 else None,
        'hub_max_min': round(max(verlauf) / min(verlauf), 3) if min(verlauf) > 1e-6 else None,
    }


if __name__ == '__main__':
    aus = [miss(p) for p in sys.argv[1:]]
    print(json.dumps(aus, indent=1))
