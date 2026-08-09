#!/usr/bin/env bash
# Frage F — Sammelhand (F1 Preislage, Basis fuer F3) je Epoche einmal ohne
# Festlegung, dazu zwei gezielte "mit"-Laeufe fuer den F3-Vergleich, und die
# Sichtbarkeitsmessung F2 (schnell, zweimal je Epoche).
set -uo pipefail
cd /home/user/brewhousesim
export HAFEN=8936
export SAAT=1350
MAXWOCHEN=${MAXWOCHEN:-420}
MAXMIN=${MAXMIN:-22}

# F1-Basis "ohne Festlegung", alle vier Epochen
for EP in 1 2 3 4; do
  LAUF="e${EP}-sammel-keine"
  echo "=== $(date -u +%H:%M:%S) START $LAUF ==="
  FESTLEGE=keine werkbank/schuss/aufsicht/messfenster.sh \
    node werkbank/schuss/welle14/hand-sammler.mjs "$EP" "$LAUF" "$MAXWOCHEN" "$MAXMIN"
  echo "=== $(date -u +%H:%M:%S) ENDE  $LAUF ==="
done

# F3 "mit" — je eine gezielte Festlegung, sonst gleiche Regeln
echo "=== $(date -u +%H:%M:%S) START e1-sammel-vertrag ==="
FESTLEGE=vertrag werkbank/schuss/aufsicht/messfenster.sh \
  node werkbank/schuss/welle14/hand-sammler.mjs 1 e1-sammel-vertrag "$MAXWOCHEN" "$MAXMIN"
echo "=== $(date -u +%H:%M:%S) ENDE  e1-sammel-vertrag ==="

echo "=== $(date -u +%H:%M:%S) START e4-sammel-konzern ==="
FESTLEGE=konzern werkbank/schuss/aufsicht/messfenster.sh \
  node werkbank/schuss/welle14/hand-sammler.mjs 4 e4-sammel-konzern "$MAXWOCHEN" "$MAXMIN"
echo "=== $(date -u +%H:%M:%S) ENDE  e4-sammel-konzern ==="

# F2 — Sichtbarkeit, schnell, zweimal je Epoche
for EP in 1 2 3 4; do
  for N in 1 2; do
    echo "=== $(date -u +%H:%M:%S) F2 epoche $EP lauf $N ==="
    werkbank/schuss/aufsicht/messfenster.sh \
      node werkbank/schuss/welle14/sichtbarkeit-f2.mjs "$EP" \
      >> werkbank/schuss/welle14/protokoll/f2-ergebnisse.jsonl
  done
done

echo "ALLE FRAGE-F-LAEUFE FERTIG"
