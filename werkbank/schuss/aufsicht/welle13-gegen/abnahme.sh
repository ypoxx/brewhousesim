#!/usr/bin/env bash
# DIE ABNAHME DER WELLE 13 — die Wiederholbarkeit, einzeln und nacheinander.
#
#   werkbank/schuss/aufsicht/welle13-gegen/abnahme.sh [hafen]
#
# Sechs Laeufe in 1350 (dort ist die Abweichung schon einmal aufgetreten), drei
# in jeder anderen Epoche. NACHEINANDER, nie nebeneinander: am 7. August hat
# `welle.sh` vier Epochen parallel gefahren, und die Maschinenlast hat
# entschieden, welche von zwei Partien herauskam. Das hat vier Tage gekostet.
set -uo pipefail
cd "$(dirname "$0")/../../../.."
HAFEN=${1:-8933}
D=werkbank/schuss/aufsicht/welle13-gegen/wdh
mkdir -p "$D"

# Ein Hafen ist kein Baum: erst nachsehen, welche Fassung dort liegt.
KOPF=$(curl -s "http://127.0.0.1:$HAFEN/spiel/index.html" | md5sum | cut -c1-12)
BAUM=$(md5sum spiel/index.html | cut -c1-12)
echo "Hafen $HAFEN liefert index.html $KOPF, Arbeitsbaum hat $BAUM"

for E in "1 A" "1 B" "1 C" "1 D" "1 E" "1 F" "2 A" "2 B" "2 C" "3 A" "3 B" "3 C" "4 A" "4 B" "4 C"; do
  set -- $E
  EP=$1; L=$2
  Z="$D/e$EP-$L.json"
  [ -s "$Z" ] && { echo "e$EP-$L: liegt schon vor, $(md5sum < "$Z" | cut -c1-12)"; continue; }
  T0=$(date +%s)
  HAFEN=$HAFEN timeout 1800 node werkbank/schuss/rueckkopplung-r3/linie.mjs "$EP" 400 "$Z" >/dev/null 2>&1
  if [ -s "$Z" ]; then
    echo "e$EP-$L: $(md5sum < "$Z" | cut -c1-12)  ($(( $(date +%s) - T0 ))s)"
  else
    echo "e$EP-$L: GESCHEITERT nach $(( $(date +%s) - T0 ))s"
  fi
done
echo "--- Pruefsummen je Epoche ---"
for EP in 1 2 3 4; do
  echo "E$EP: $(for f in $D/e$EP-*.json; do md5sum < "$f" | cut -c1-12; done | sort -u | tr '\n' ' ')"
done
