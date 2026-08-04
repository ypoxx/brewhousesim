#!/usr/bin/env python3
"""Steht das NACHBARHOF-Zeichen wirklich in der Wellenform — und wie hoch?

Nicht der Quelltext entscheidet, ob ein Zeichen zu hoeren ist, sondern der
Mitschnitt. Dieses Werkzeug rechnet fuer jede Aufnahme:

  * wann das Zeichen anschlaegt (aus dem Mitschnitt und der Sperre in ton.js,
    beides ausgelesen, nicht abgeschrieben — siehe nachbarzahl.py),
  * den Effektivwert der Sekunden, in denen es liegt,
  * den Effektivwert der Sekunden davor,
  * und ausserdem das TIEFENVERHAELTNIS: wieviel Energie unter 900 Hz liegt.
    Das Zeichen geht durch einen Tiefpass bei 900 Hz; wenn es traegt, muss
    sich das Band unter 900 Hz waehrend des Zeichens heben.

Ohne numpy, ohne ffmpeg — die WAV sind 16 bit PCM, mono.
"""
import json, math, pathlib, re, struct, sys, wave

TON = pathlib.Path('/home/user/brewhousesim/spiel/kern/ton.js').read_text()
NACHBARN = set(re.findall(r"'([a-z]+:[a-zA-Z]+)':\s*\{[^}]*nachbar:\s*true", TON))
PAUSE = float(re.search(r'var NACHBAR_PAUSE = ([0-9.]+)', TON).group(1))
DAUER = float(re.search(r'var NACHBAR_DAUER = ([0-9.]+)', TON).group(1))


def proben(pfad):
    with wave.open(str(pfad), 'rb') as w:
        n, rate = w.getnframes(), w.getframerate()
        roh = w.readframes(n)
    d = struct.unpack('<%dh' % (len(roh) // 2), roh)
    return [x / 32768.0 for x in d], rate


def rms(d, a, b):
    a, b = max(0, a), min(len(d), b)
    if b <= a:
        return 0.0
    s = 0.0
    for i in range(a, b):
        s += d[i] * d[i]
    return math.sqrt(s / (b - a))


def tief(d, a, b, rate, kappe=900.0):
    """Effektivwert nach einem einpoligen Tiefpass — Anteil unter `kappe`."""
    a, b = max(0, a), min(len(d), b)
    if b <= a:
        return 0.0
    k = math.exp(-2 * math.pi * kappe / rate)
    y, s = 0.0, 0.0
    for i in range(a, b):
        y = (1 - k) * d[i] + k * y
        s += y * y
    return math.sqrt(s / (b - a))


def zeichenzeiten(js):
    d = json.loads(pathlib.Path(js).read_text())
    ruf = [e['t'] for e in d['mitschnitt'] if e['name'] in NACHBARN]
    letzt, aus = None, []
    for t in ruf:
        if letzt is None or t - letzt >= PAUSE:
            letzt = t
            aus.append(t)
    return aus


def main():
    print('PAUSE %.2f s   DAUER %.2f s' % (PAUSE, DAUER))
    for wav in sorted(pathlib.Path(sys.argv[1]).glob('*.wav')):
        js = wav.with_suffix('.json')
        if not js.exists():
            continue
        zt = zeichenzeiten(js)
        d, rate = proben(wav)
        ganz = rms(d, 0, len(d))
        if not zt:
            print('%-14s kein Zeichen   rms gesamt %.5f' % (wav.stem, ganz))
            continue
        teile = []
        for t in zt:
            a, b = int(t * rate), int((t + DAUER) * rate)
            v0, v1 = int((t - DAUER) * rate), a
            teile.append((t, rms(d, a, b), rms(d, v0, v1),
                          tief(d, a, b, rate), tief(d, v0, v1, rate)))
        print('%-14s rms gesamt %.5f' % (wav.stem, ganz))
        for t, im, vor, tim, tvor in teile:
            print('   %5.2f s  rms im Zeichen %.5f  davor %.5f  (%.2fx)   '
                  'unter 900 Hz %.5f / %.5f  (%.2fx)'
                  % (t, im, vor, im / vor if vor else 0, tim, tvor,
                     tim / tvor if tvor else 0))


if __name__ == '__main__':
    main()
