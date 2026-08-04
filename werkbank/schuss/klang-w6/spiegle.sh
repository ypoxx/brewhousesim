#!/usr/bin/env bash
# Spiegelt MEINE Dateien in den eingefrorenen Messstand. Alles andere bleibt
# auf dem Stand des Commits — damit unterscheiden sich Vorher und Nachher nur
# in dem, was mir gehoert.
set -uo pipefail
STAND=${STAND:-/tmp/messstand/0058dd1}
cd /home/user/brewhousesim
mkdir -p "$STAND/spiel/ton/klang"
# tote Proben im Stand entfernen, die es hier nicht mehr gibt
for q in "$STAND"/spiel/ton/klang/*.mp3; do
  n=$(basename "$q")
  [ -f "spiel/ton/klang/$n" ] || rm -f "$q"
done
cp -f spiel/ton/klang/*.mp3 "$STAND/spiel/ton/klang/"
cp -f spiel/kern/ton.js "$STAND/spiel/kern/ton.js"
cp -f spiel/stuecke/klang.js "$STAND/spiel/stuecke/klang.js"
echo "gespiegelt nach $STAND"
