#!/usr/bin/env bash
# 1350 ist die Epoche, die schon beim Rahmen zwischen zwei Laeufen desselben
# Standes auseinandergegangen ist (Satz A/C -0,336 gegen Satz B +0,270).
# Deshalb hier je Stand ein ZWEITER Lauf, streng nacheinander.
set -uo pipefail
cd "$(dirname "$0")/../../.."
Z=werkbank/schuss/fuhre-w11/messungen
export MESSFENSTER_WARTE=7200
for paar in "8951 vorher" "8952 nachher"; do
  set -- $paar
  echo "== 1350 zweiter Lauf $2  $(date -u +%H:%M:%S)"
  HAFEN=$1 werkbank/schuss/aufsicht/messfenster.sh \
    node werkbank/schuss/rueckkopplung-r3/linie.mjs 1 400 "$Z/rho-$2/e1-b.json" \
    >> "$Z/rho-$2/lauf.log" 2>&1
  echo "   -> $? $(date -u +%H:%M:%S)"
done
echo "== 1350, beide Staende, beide Laeufe"
python3 werkbank/schuss/rueckkopplung-r3/auswerten.py "$Z"/rho-vorher/e1-*.json > "$Z/rho-1350-vorher.txt" 2>&1
python3 werkbank/schuss/rueckkopplung-r3/auswerten.py "$Z"/rho-nachher/e1-*.json > "$Z/rho-1350-nachher.txt" 2>&1
echo "FERTIG $(date -u +%H:%M:%S)"
