#!/usr/bin/env bash
# Misst 1350 auf beiden Mischstaenden. Wiederaufnehmbar: was schon daliegt,
# wird uebersprungen. Erst aufsetzen.sh laufen lassen.
#
# Gegen was verglichen wird:
#   Welle 7 (b6b06bb): Kasse 26–517, 0 Wochen auf null, 1 von 14 Jahren unter 1x
#   Welle 8 (8b81250): Kasse 0–143,  70 Wochen auf null, 3 von 14 Jahren unter 1x
#
# ZUERST auf "Seitenfehler" in der Ausgabe sehen. Ein Mischstand, der wirft,
# misst nichts — die Zelle ist dann wertlos und kein Befund.

set -uo pipefail
cd "$(dirname "$0")/../../../.."
Z=werkbank/schuss/aufsicht/welle8-trennprobe
mkdir -p $Z/rho

for S in "ohnePreis 8911" "ohneStadt 8912"; do
  set -- $S; NAME=$1; HAFEN=$2
  MARKE=$(curl -s -m 5 "http://127.0.0.1:$HAFEN/.messstand-marke")
  [ -z "$MARKE" ] && { echo "!!! Hafen $HAFEN tot — aufsetzen.sh laufen lassen" >> $Z/lauf.log; continue; }
  [ -s $Z/rho/e1-$NAME.json ] && continue
  HAFEN=$HAFEN MESSFENSTER_WARTE=7200 werkbank/schuss/aufsicht/messfenster.sh \
    node werkbank/schuss/rueckkopplung-r3/linie.mjs 1 400 $Z/rho/e1-$NAME.json >> $Z/lauf.log 2>&1
  [ -s $Z/rho/e1-$NAME.json ] && echo "--- $NAME OK ($MARKE) $(date -u +%H:%M:%S)" >> $Z/lauf.log \
                              || echo "!!! $NAME KEINE DATEI $(date -u +%H:%M:%S)" >> $Z/lauf.log
done
echo "TRENNPROBE FERTIG" >> $Z/lauf.log
