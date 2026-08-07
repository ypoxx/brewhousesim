#!/usr/bin/env bash
# Misst 1350 DREIMAL auf jedem der drei Mischstaende. Wiederaufnehmbar.
# Erst aufsetzen.sh laufen lassen.
#
# Die Frage ist NICHT, welchen Wert ein Stand liefert, sondern ob er DREIMAL
# DENSELBEN liefert. Auswertung:
#
#   md5sum werkbank/schuss/aufsicht/welle11-trennprobe/rho/*.json
#
# Drei gleiche Pruefsummen auf einem Stand = ohne dieses Stueck ist 1350 wieder
# stabil, also gehoert die Bistabilitaet ihm.
#
# ZUERST auf "Fehler 0" sehen: ein Mischstand, der wirft, misst nichts.

set -uo pipefail
cd "$(dirname "$0")/../../../.."
Z=werkbank/schuss/aufsicht/welle11-trennprobe/rho
mkdir -p $Z

for S in "ohneErbe 8913" "ohneGegner 8914" "ohneFuhre 8915"; do
  set -- $S; NAME=$1; HAFEN=$2
  MARKE=$(curl -s -m 5 "http://127.0.0.1:$HAFEN/.messstand-marke")
  [ -z "$MARKE" ] && { echo "!!! Hafen $HAFEN tot — aufsetzen.sh laufen lassen" >> $Z/../lauf.log; continue; }
  for L in A B C; do
    [ -s $Z/$NAME-$L.json ] && continue
    HAFEN=$HAFEN MESSFENSTER_WARTE=7200 werkbank/schuss/aufsicht/messfenster.sh \
      node werkbank/schuss/rueckkopplung-r3/linie.mjs 1 400 $Z/$NAME-$L.json >> $Z/../lauf.log 2>&1
    [ -s $Z/$NAME-$L.json ] && echo "--- $NAME-$L OK ($MARKE) $(date -u +%H:%M:%S)" >> $Z/../lauf.log \
                            || echo "!!! $NAME-$L KEINE DATEI $(date -u +%H:%M:%S)" >> $Z/../lauf.log
  done
  echo "=== $NAME: $(md5sum $Z/$NAME-*.json 2>/dev/null | awk '{print $1}' | sort -u | wc -l) verschiedene Partie(n) in 3 Laeufen" >> $Z/../lauf.log
done
echo "TRENNPROBE 11 FERTIG" >> $Z/../lauf.log
