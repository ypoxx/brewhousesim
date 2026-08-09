#!/usr/bin/env bash
# IST 1884 BISTABIL? — die Trennprobe, streng nacheinander.
#
#   werkbank/schuss/aufsicht/e3-bistabil.sh
#
# DER ANLASS. Beim Beweis, dass der Bildtausch PNG->WebP die Partie nicht
# bewegt, wich 1884 ab: 7b35bb91 statt f017dc12. Zwei Nachlaeufe am SELBEN
# WebP-Stand gaben aber wieder f017dc12. Damit steht der Verdacht nicht mehr
# gegen den Bildtausch, sondern gegen die Epoche: **1884 spielt womoeglich zwei
# Partien an einem Stand** — dasselbe, was 1350 in Welle 11 getan hat und was
# damals vier Tage gekostet hat.
#
# ZWEI DINGE MACHEN DIESE PROBE NOETIG UND NICHT NUR NUETZLICH:
#   * Die Wiederholbarkeit ist die Voraussetzung aller anderen Zahlen. Faellt
#     sie in 1884, ist nicht der Wert unsicher, sondern das Geraet.
#   * 1884 ist seit der Welle-13-Abnahme die Epoche mit der zweitknappsten
#     rho-Reserve (0,205). Wer dort misst, misst an einer duennen Stelle.
#
# WARUM ZWEI STAENDE. Ein Lauf am WebP-Stand allein koennte den Bildtausch
# nicht entlasten. Gemessen wird deshalb beides, mit derselben Hand, derselben
# Saat, derselben Laenge — und **nacheinander, nie nebeneinander**. Die
# abweichende Zahl entstand, waehrend zwei Laeufe um dieselbe Maschine
# stritten; das darf hier nicht wieder passieren.
#
# SECHS JE STAND, nicht drei: bei einem Abweichungsverhaeltnis von 1:3 waere
# ein Dreiersatz zu rund 30 % Zufall, ein Sechsersatz zu unter 3 %
# (MESSLATTE.md, „Wiederholbarkeit ist keine fuenfte Latte").
set -uo pipefail
cd "$(dirname "$0")/../../.."
D=werkbank/schuss/aufsicht/e3-bistabil
mkdir -p "$D"

probe () {           # probe <marke> <commit> <hafen>
  local marke=$1 commit=$2 hafen=$3
  ./werkbank/schuss/aufsicht/messstand.sh "$commit" "$hafen" >/dev/null 2>&1 || {
    echo "$marke: MESSSTAND FEHLGESCHLAGEN"; return 1; }
  echo "--- $marke ($commit, Hafen $hafen) ---"
  for L in A B C D E F; do
    local Z="$D/$marke-$L.json"
    [ -s "$Z" ] && { echo "  $L: liegt vor"; continue; }
    HAFEN=$hafen timeout 900 node werkbank/schuss/rueckkopplung-r3/linie.mjs 3 100 "$Z" >/dev/null 2>&1
    [ -s "$Z" ] && echo "  $L: fertig" || echo "  $L: GESCHEITERT"
  done
}

probe mit-webp  HEAD     8936
probe ohne-webp b098fc6  8933

{ python3 - "$D" <<'PY'
import json, glob, hashlib, sys, collections, os
D = sys.argv[1]
P = ('jahr','woche','kasse','rohstoff','faesser','plaetze','amtszeit')
def h(p):
    d = json.load(open(p))
    return hashlib.md5(repr([tuple(w.get(k) for k in P) for w in (d.get('reihe') or [])][:100]).encode()).hexdigest()[:8]
for marke in ('ohne-webp', 'mit-webp'):
    fs = sorted(glob.glob(f'{D}/{marke}-*.json'))
    if not fs:
        print(f'{marke}: keine Messung'); continue
    z = collections.Counter(h(f) for f in fs)
    zeile = ' · '.join(f'{k} ({v}×)' for k, v in z.most_common())
    print(f'{marke:12} {len(fs)} Laeufe, {len(z)} Pruefsumme(n): {zeile}')
print()
alle = collections.Counter()
for marke in ('ohne-webp', 'mit-webp'):
    for f in glob.glob(f'{D}/{marke}-*.json'): alle[h(f)] += 1
if len(alle) <= 1:
    print('URTEIL: 1884 ist stabil. Die eine abweichende Zahl entstand unter')
    print('        Nebenlast und ist keine Eigenschaft der Epoche.')
else:
    print('URTEIL: 1884 IST BISTABIL — dieselbe Saat, derselbe Stand, zwei Partien.')
    print('        Das ist keine Frage des Bildtauschs, sondern die Voraussetzung')
    print('        aller 1884-Zahlen. Alles Weitere an dieser Epoche wartet.')
PY
} 2>&1 | tee "$D/BEFUND.txt"
