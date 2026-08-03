#!/usr/bin/env python3
"""Antwortet der Klang auf den Klick — und zur richtigen SEKUNDE?

Nicht am Mitschnitt gemessen (der sagt nur, dass das Spiel etwas RUFEN
wollte), sondern an der Wellenform, die ich selbst mitgeschnitten habe:
Huellkurve in 25-ms-Fenstern, und je Klick der erste Fensterindex nach dem
Klick, an dem die Energie ueber das Doppelte des Ruhepegels der halben
Sekunde DAVOR steigt.

    ./antwortzeit.py roh/e1-einzel.wav
"""
import wave, array, math, json, sys, pathlib

F = 0.025


def huelle(pfad):
    with wave.open(pfad, 'rb') as w:
        n, rate, kn = w.getnframes(), w.getframerate(), w.getnchannels()
        a = array.array('h'); a.frombytes(w.readframes(n))
    if kn > 1:
        a = a[::kn]
    d = [x / 32768.0 for x in a]
    s = int(rate * F)
    h = []
    for i in range(0, len(d) - s + 1, s):
        f = d[i:i + s]
        h.append(math.sqrt(sum(x * x for x in f) / len(f)))
    return h, rate


def einsatz(h, tklick, fenster=1.2, faktor=2.0):
    """Erster Anstieg nach dem Klick. None, wenn nichts kommt."""
    i0 = int(tklick / F)
    vor = h[max(0, i0 - int(0.5 / F)):i0]
    if not vor:
        return None, None
    ruhe = sorted(vor)[len(vor) // 2]
    for i in range(i0, min(len(h), i0 + int(fenster / F))):
        if h[i] > max(ruhe * faktor, 0.008):
            return round(i * F - tklick, 3), round(h[i] / max(ruhe, 1e-6), 2)
    return None, round(ruhe, 5)


if __name__ == '__main__':
    aus = []
    for p in sys.argv[1:]:
        h, rate = huelle(p)
        j = json.load(open(p.replace('.wav', '.json')))
        e = []
        for k in j['klicks']:
            if not k['zug']:
                continue
            v, hub = einsatz(h, k['t'])
            e.append({'t_klick': k['t'], 'zug': k['zug'],
                      'antwort_nach_s': v, 'hub': hub})
        aus.append({'datei': pathlib.Path(p).name, 'klicks': e,
                    'ohne_antwort': sum(1 for x in e if x['antwort_nach_s'] is None)})
    print(json.dumps(aus, indent=1, ensure_ascii=False))
