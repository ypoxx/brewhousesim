#!/usr/bin/env bash
# Acht Aufnahmen (vier gespielt, vier still) mit dem UNVERAENDERTEN Geraet des
# Kritikers, am eingefrorenen Messstand. Erstes Argument: Zielverzeichnis.
#   werkbank/schuss/klang-w6/nimm.sh /tmp/klang6/vorher
set -uo pipefail
cd /home/user/brewhousesim
ZIEL=${1:?ziel fehlt}
HAFEN=${HAFEN:-http://127.0.0.1:8941}
mkdir -p "$ZIEL"
for e in 1 2 3 4; do
  for art in gespielt still; do
    RUHE=8 VORLAUF=26 HAFEN=$HAFEN \
      node werkbank/schuss/klang-blind-w5/aufnahme.mjs "$e" "$art" "$ZIEL/e$e-$art.wav" 1350 \
      || echo "FEHLER e$e-$art"
  done
done
