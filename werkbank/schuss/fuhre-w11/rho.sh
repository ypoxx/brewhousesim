#!/usr/bin/env bash
# ρ — die zweite Messlatte, je Epoche EIN Lauf, streng nacheinander durchs
# Messfenster.
#
#   werkbank/schuss/fuhre-w11/rho.sh <hafen> <name>
#     z.B.  werkbank/schuss/fuhre-w11/rho.sh 8951 vorher
#           werkbank/schuss/fuhre-w11/rho.sh 8952 nachher
#
# 400 Wochen je Epoche, Saat 1350, `rueckkopplung-r3/linie.mjs` unveraendert.
# Die Dateinamen folgen dem, was `fuhre-w6/schnitte.py` erwartet:
# <ordner>/e<epoche>-a.json.
set -uo pipefail
cd "$(dirname "$0")/../../.."
HAFEN=${1:-8951}
NAME=${2:-lauf}
ZIEL=werkbank/schuss/fuhre-w11/messungen/rho-$NAME
mkdir -p "$ZIEL"
export MESSFENSTER_WARTE=7200
for e in 1 2 3 4; do
  echo "== rho $NAME E$e  $(date -u +%H:%M:%S)"
  HAFEN=$HAFEN werkbank/schuss/aufsicht/messfenster.sh \
    node werkbank/schuss/rueckkopplung-r3/linie.mjs "$e" 400 "$ZIEL/e$e-a.json" \
    >> "$ZIEL/lauf.log" 2>&1
  echo "   -> $? $(date -u +%H:%M:%S)"
done
echo "== auswerten"
python3 werkbank/schuss/fuhre-w6/schnitte.py "$ZIEL" > "$ZIEL/schnitte.txt" 2>&1
python3 werkbank/schuss/rueckkopplung-r3/auswerten.py "$ZIEL"/e*.json > "$ZIEL/jahre.txt" 2>&1
tail -40 "$ZIEL/schnitte.txt"
echo "FERTIG $(date -u +%H:%M:%S)"
