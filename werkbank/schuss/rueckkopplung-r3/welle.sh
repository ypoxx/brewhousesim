#!/usr/bin/env bash
# EINE WELLE MESSUNGEN — vier Epochen nebeneinander, ein Buchstabe je Lauf.
#
#   werkbank/schuss/rueckkopplung-r3/welle.sh <hafen> <ordner> <buchstabe>
#
# Die beharrliche Hand ist von der Last der Maschine unabhaengig (Begruendung
# in linie.mjs, Absatz BEHARRLICH), also duerfen die vier Epochen nebeneinander
# laufen. Nachgewiesen: dieselbe Reihe bei Lastmittel 1,5 und bei 13,7.
set -u
cd "$(dirname "$0")/../../.."
HAFEN=${1:-8901}
ORDNER=${2:-/tmp/rk3/nachher}
L=${3:-A}
mkdir -p "$ORDNER"
for E in 1 2 3 4; do
  HAFEN=$HAFEN node werkbank/schuss/rueckkopplung-r3/linie.mjs $E 400 "$ORDNER/e$E-$L.json" \
    > "$ORDNER/e$E-$L.log" 2>&1 &
done
wait
cat "$ORDNER"/e?-"$L".log
