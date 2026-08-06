#!/usr/bin/env bash
# RHO — die zweite Messlatte, vorher gegen nachher, EINZELN gemessen.
#
#   werkbank/schuss/erbe-w11/rho.sh
#
# Je Epoche EIN Lauf vorher und EINER nachher — so hat es die Welle
# angesetzt; die Dreifachprobe macht die Aufsicht. Abwechselnd VOR/NACH,
# damit kein Zeitraum einem Stand zugutekommt, und jeder Lauf allein durchs
# Messfenster.
#
# NIE `welle.sh`: der Rahmen der Welle 10 hat am 6. August nachgewiesen, dass
# dasselbe Skript nebeneinander eine andere Partie liefert als einzeln
# (1350: Kasse 30–558 statt 28–524).
set -uo pipefail
cd "$(dirname "$0")/../../.."
export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
export MESSFENSTER_WARTE=7200
M=werkbank/schuss/aufsicht/messfenster.sh
# Die Dateinamen folgen dem, was fuhre-w6/schnitte.py erwartet:
# <ordner>/e<epoche>-<buchstabe>.json
Z=werkbank/schuss/erbe-w11/messungen/rho
mkdir -p "$Z/vor" "$Z/nach"

for e in 1 2 3 4; do
  for stand in vor nach; do
    [ "$stand" = vor ] && h=8941 || h=8942
    f="$Z/$stand/e$e-A.json"
    if [ -s "$f" ]; then echo "== $stand e$e: liegt schon"; continue; fi
    echo "== $stand e$e auf :$h   $(date -u +%H:%M:%S)"
    HAFEN=$h $M node werkbank/schuss/rueckkopplung-r3/linie.mjs "$e" 400 "$f" \
      > "$Z/$stand/e$e-A.log" 2>&1
    echo "   fertig $(date -u +%H:%M:%S)  $( [ -s "$f" ] && echo "$(wc -c < "$f") B" || echo LEER )"
  done
done
echo "RHO DURCH  $(date -u +%H:%M:%S)"
python3 werkbank/schuss/fuhre-w6/schnitte.py "$Z/vor" "$Z/nach" \
  | tee werkbank/schuss/erbe-w11/messungen/rho-schnitte.txt
