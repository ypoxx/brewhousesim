#!/usr/bin/env bash
# Letzte, stark gekuerzte Runde: aus Zeitgruenden nur noch je EIN Lauf fuer
# Epoche 2/3/4 (Frage A), ein F1-Lauf fuer 1884, ein Paar fuer den
# F3-Vergleich in 1970, und F2 einmal je Epoche. Wird im Messblatt als
# Kuerzung ausgewiesen.
set -uo pipefail
cd /home/user/brewhousesim
export HAFEN=8936
export SAAT=1350

for EP in 2 3 4; do
  LAUF="e${EP}-such-1"
  echo "=== $(date -u +%H:%M:%S) START $LAUF ==="
  werkbank/schuss/aufsicht/messfenster.sh node werkbank/schuss/welle14/hand-suchend.mjs "$EP" "$LAUF" 100 6
  echo "=== $(date -u +%H:%M:%S) ENDE  $LAUF ==="
done

echo "=== $(date -u +%H:%M:%S) START e3-sammel-keine ==="
FESTLEGE=keine werkbank/schuss/aufsicht/messfenster.sh \
  node werkbank/schuss/welle14/hand-sammler.mjs 3 e3-sammel-keine 130 8
echo "=== $(date -u +%H:%M:%S) ENDE  e3-sammel-keine ==="

echo "=== $(date -u +%H:%M:%S) START e4-sammel-keine ==="
FESTLEGE=keine werkbank/schuss/aufsicht/messfenster.sh \
  node werkbank/schuss/welle14/hand-sammler.mjs 4 e4-sammel-keine 150 10
echo "=== $(date -u +%H:%M:%S) ENDE  e4-sammel-keine ==="

echo "=== $(date -u +%H:%M:%S) START e4-sammel-konzern ==="
FESTLEGE=konzern werkbank/schuss/aufsicht/messfenster.sh \
  node werkbank/schuss/welle14/hand-sammler.mjs 4 e4-sammel-konzern 150 10
echo "=== $(date -u +%H:%M:%S) ENDE  e4-sammel-konzern ==="

for EP in 1 2 3 4; do
  echo "=== $(date -u +%H:%M:%S) F2 epoche $EP ==="
  werkbank/schuss/aufsicht/messfenster.sh \
    node werkbank/schuss/welle14/sichtbarkeit-f2.mjs "$EP" \
    >> werkbank/schuss/welle14/protokoll/f2-ergebnisse.jsonl
done

echo "ALLES FERTIG"
