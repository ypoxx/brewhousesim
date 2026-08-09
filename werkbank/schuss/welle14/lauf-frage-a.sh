#!/usr/bin/env bash
# Frage A — drei Laeufe je Epoche, gleiche Saat, sequenziell, jeder einzeln
# hinter dem Messfenster. Bricht NICHT beim ersten Fehler ab (set -e wuerde
# einen einzelnen missglueckten Lauf die ganze Kampagne kosten); jeder Lauf
# wird einzeln geloggt.
set -uo pipefail
cd /home/user/brewhousesim
MAXWOCHEN=${MAXWOCHEN:-180}
MAXMIN=${MAXMIN:-12}
export HAFEN=8936
export SAAT=1350

for EP in 1 2 3 4; do
  for N in 1 2 3; do
    LAUF="e${EP}-such-${N}"
    echo "=== $(date -u +%H:%M:%S) START $LAUF ==="
    werkbank/schuss/aufsicht/messfenster.sh node werkbank/schuss/welle14/hand-suchend.mjs \
      "$EP" "$LAUF" "$MAXWOCHEN" "$MAXMIN"
    echo "=== $(date -u +%H:%M:%S) ENDE  $LAUF (exit $?) ==="
  done
done
echo "ALLE FRAGE-A-LAEUFE FERTIG"
