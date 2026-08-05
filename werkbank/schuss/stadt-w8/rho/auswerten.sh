#!/usr/bin/env bash
# Die drei Schnitte (12/13/14 Braujahre) fuer VORHER und NACHHER nebeneinander.
#   werkbank/schuss/stadt-w8/rho/auswerten.sh
# Rechnet mit dem vorhandenen Geraet sud-w6-nach/schnitte.py — nicht mit einer
# eigens gewaehlten Lesart. Wer eine Lesart waehlt, nachdem er die Zahlen
# kennt, misst sich selbst (MESSLATTE.md, 5. August).
set -uo pipefail
cd "$(dirname "$0")/../../../.."
Z=werkbank/schuss/stadt-w8/rho
for W in vor nach; do
  echo
  echo "################ $W ################"
  ls $Z/$W-e*.json >/dev/null 2>&1 || { echo "  keine Datei"; continue; }
  python3 werkbank/schuss/sud-w6-nach/schnitte.py $Z/$W-e*.json | tail -12
done
