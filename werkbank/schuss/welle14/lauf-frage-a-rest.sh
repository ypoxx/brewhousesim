#!/usr/bin/env bash
# Rest der Frage-A-Kampagne, nach einer Zeitkuerzung: 1350 bleibt bei 180
# Wochen (Konsistenz mit e1-such-1/2, die schon liefen), 1600/1884/1970
# bekommen einen kleineren Deckel, um die Kampagne in dieser Sitzung
# abzuschliessen. Dokumentiert im Messblatt unter "Was an meiner Messung
# schwach ist".
set -uo pipefail
cd /home/user/brewhousesim
export HAFEN=8936
export SAAT=1350

echo "=== $(date -u +%H:%M:%S) START e1-such-3 ==="
werkbank/schuss/aufsicht/messfenster.sh node werkbank/schuss/welle14/hand-suchend.mjs 1 e1-such-3 180 12
echo "=== $(date -u +%H:%M:%S) ENDE  e1-such-3 ==="

for EP in 2 3 4; do
  for N in 1 2 3; do
    LAUF="e${EP}-such-${N}"
    echo "=== $(date -u +%H:%M:%S) START $LAUF ==="
    werkbank/schuss/aufsicht/messfenster.sh node werkbank/schuss/welle14/hand-suchend.mjs "$EP" "$LAUF" 100 6
    echo "=== $(date -u +%H:%M:%S) ENDE  $LAUF ==="
  done
done
echo "ALLE FRAGE-A-LAEUFE FERTIG"
