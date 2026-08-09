#!/usr/bin/env bash
# Rest der Frage-F-Kampagne, nach einer Zeitkuerzung. e1-sammel-keine laeuft
# bereits (420/22, laesst man durchlaufen). 1600/1884 bekommen einen
# kleineren Deckel (nur F1, kein F3-Vergleich dort). 1970 ist der im Auftrag
# genannte Fall (kundige Hand, 50.000 in der Kasse) und bekommt darum einen
# groesseren, gepaarten Deckel fuer den F3-Vergleich mit/ohne 'konzern'.
set -uo pipefail
cd /home/user/brewhousesim
export HAFEN=8936
export SAAT=1350

for EP in 2 3; do
  LAUF="e${EP}-sammel-keine"
  echo "=== $(date -u +%H:%M:%S) START $LAUF ==="
  FESTLEGE=keine werkbank/schuss/aufsicht/messfenster.sh \
    node werkbank/schuss/welle14/hand-sammler.mjs "$EP" "$LAUF" 150 10
  echo "=== $(date -u +%H:%M:%S) ENDE  $LAUF ==="
done

echo "=== $(date -u +%H:%M:%S) START e4-sammel-keine ==="
FESTLEGE=keine werkbank/schuss/aufsicht/messfenster.sh \
  node werkbank/schuss/welle14/hand-sammler.mjs 4 e4-sammel-keine 300 16
echo "=== $(date -u +%H:%M:%S) ENDE  e4-sammel-keine ==="

echo "=== $(date -u +%H:%M:%S) START e4-sammel-konzern ==="
FESTLEGE=konzern werkbank/schuss/aufsicht/messfenster.sh \
  node werkbank/schuss/welle14/hand-sammler.mjs 4 e4-sammel-konzern 300 16
echo "=== $(date -u +%H:%M:%S) ENDE  e4-sammel-konzern ==="

for EP in 1 2 3 4; do
  for N in 1 2; do
    echo "=== $(date -u +%H:%M:%S) F2 epoche $EP lauf $N ==="
    werkbank/schuss/aufsicht/messfenster.sh \
      node werkbank/schuss/welle14/sichtbarkeit-f2.mjs "$EP" \
      >> werkbank/schuss/welle14/protokoll/f2-ergebnisse.jsonl
  done
done

echo "ALLE FRAGE-F-LAEUFE FERTIG"
