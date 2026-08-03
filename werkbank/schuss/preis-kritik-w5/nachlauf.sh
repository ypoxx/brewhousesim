#!/usr/bin/env bash
# DIE NACHMESSUNGEN, sequenziell hinter der Hauptwelle.
#   werkbank/schuss/preis-kritik-w5/nachlauf.sh
set -u
cd "$(dirname "$0")/../../.."
D=werkbank/schuss/preis-kritik-w5
export HAFEN=${HAFEN:-8906}   # eigener Hafen, siehe hafen.sh — NICHT 8900

echo "=== 1. WER LIEGT AUF DER MICHAELITAFEL (decke.mjs) ==="
for E in 1 2 3 4; do node $D/decke.mjs $E 14 /tmp/pk5/decke-e$E.json; done

echo "=== 2. ZUSTAENDIGKEIT 25, Knopf fuer Knopf (knoepfe.mjs) ==="
node $D/knoepfe.mjs 62 /tmp/pk5/knoepfe.json

echo "=== 3. LAEUFT TEXT UEBER SEINEN KASTEN (ueberlauf.mjs) ==="
node $D/ueberlauf.mjs

echo "=== 4. DER KASSENBODEN unter der faulen Hand (boden.mjs) ==="
for E in 1 2 3 4; do node $D/boden.mjs $E faul 420 /tmp/pk5/boden-e$E-faul.json; done

echo "=== 5. DIE PLUS-FALLE: dieselbe Hand mit Math.abs (ABS=1) ==="
for E in 3 4; do ABS=1 node $D/hand.mjs $E 420 /tmp/pk5/e$E-ABS.json; done

echo "=== 6. DIE HAND, DIE FESTLEGUNGEN WILL (festhand.mjs) ==="
for E in 1 2 3 4; do node $D/festhand.mjs $E 420 /tmp/pk5/fest-e$E.json; done

echo "=== NACHLAUF FERTIG ==="
