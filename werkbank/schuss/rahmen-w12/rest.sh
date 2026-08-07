#!/usr/bin/env bash
# Die noch fehlenden Laeufe der harten Abnahme, EINER NACH DEM ANDEREN.
# Jeder Lauf schreibt seine Pruefsumme sofort in die Kladde — wer vom Reset
# erwischt wird, verliert hoechstens den laufenden.
set -uo pipefail
cd "$(dirname "$0")/../../.."
K=werkbank/schuss/rahmen-w12/abnahme5/kladde.log
# e2-A und e2-B laufen bereits ausserhalb dieses Skripts; hier fehlt nur
# noch e2-C, dann die drei Laeufe der Epoche 1970.
for ep in 2 4 4 4; do
  werkbank/schuss/rahmen-w12/lauf.sh $ep 813f776 8950 >> "$K" 2>&1
done
echo "== REST FERTIG $(date -u +%H:%M:%S) ==" >> "$K"
