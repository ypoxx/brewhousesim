#!/usr/bin/env bash
# DIE ZWEITE MESSLATTE — vier Epochen, 400 Wochen, EINZELN.
#
#   werkbank/schuss/gegner-w11/rho.sh <hafen> <marke>
#
# Einzeln heisst: ein Lauf nach dem anderen, jeder durch das Messfenster.
# Der Rahmen hat in Welle 10 nachgewiesen, dass `rueckkopplung-r3/welle.sh`
# die vier Epochen NEBENEINANDER faehrt und dabei auf demselben eingefrorenen
# Stand eine andere Partie liefert als einzeln (1350: Kasse 28–524 einzeln
# gegen 30–558 nebeneinander). Deshalb hier nur einzeln.
set -uo pipefail
cd "$(dirname "$0")/../../.."
export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
export MESSFENSTER_WARTE=7200
HAFEN=${1:-8962}
M=${2:-nach}
Z=werkbank/schuss/gegner-w11/rho
mkdir -p "$Z"
for e in 1 2 3 4; do
  echo "### $M e$e start $(date -u +%H:%M:%S)"
  HAFEN=$HAFEN werkbank/schuss/aufsicht/messfenster.sh \
    node werkbank/schuss/rueckkopplung-r3/linie.mjs "$e" 400 "$Z/$M-e$e.json" \
    > "$Z/$M-e$e.log" 2>&1
  echo "### $M e$e ende  $? $(date -u +%H:%M:%S)"
done
