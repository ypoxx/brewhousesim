#!/usr/bin/env bash
# Der Messlauf dieser Runde — STRENG SEQUENZIELL, ein Browser zur Zeit.
#
#   HAFEN=8899 ZIEL=/pfad/nachher werkbank/schuss/preis-w5/lauf.sh
#
# WARUM SEQUENZIELL: vier Browser auf vier Kernen sind ein kaputtes Geraet.
# Nachgewiesen am 3. August: derselbe Commit, dieselbe Saat, E1884 lief 331
# Wochen Ziffer fuer Ziffer gleich und wich dann ab (Kasse 16.670 gegen
# 11.270), rho +0,354 statt +0,393. Sequenziell kommt Ziffer fuer Ziffer die
# Zahl der Aufsicht heraus. BEHARR und RUHE machen die Hand lastunempfindlich,
# aber nicht lastfrei.
set -u
HIER="$(cd "$(dirname "$0")" && pwd)"
HAFEN=${HAFEN:-8899}
ZIEL=${ZIEL:-/tmp/preis-w5}
WOCHEN=${WOCHEN:-400}
mkdir -p "$ZIEL"

for r in A B C; do
  for e in 1 2 3 4; do
    HAFEN=$HAFEN node "$HIER/hand.mjs" "$e" "$WOCHEN" "$ZIEL/e$e-$r.json" 2>&1 | head -4
  done
done

for e in 1 2 3 4; do
  HAFEN=$HAFEN node "$HIER/hand-fest.mjs" "$e" "$WOCHEN" "$ZIEL/willig-e$e.json" 2>&1 | head -4
done
echo "LAUF FERTIG — $ZIEL"
