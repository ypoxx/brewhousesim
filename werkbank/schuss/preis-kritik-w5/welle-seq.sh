#!/usr/bin/env bash
# EINE WELLE MESSUNGEN, SEQUENZIELL — ein Lauf nach dem anderen.
#
#   werkbank/schuss/preis-kritik-w5/welle-seq.sh <hafen> <ordner> <buchstabe> [wochen]
#
# WARUM NICHT NEBENEINANDER wie das Vorbild: die Aufsicht hat gemessen, dass
# vier gleichzeitige Browser dieselbe Hand auseinanderziehen (+0,354 statt
# +0,393; +0,305 statt +0,108). Mehrere Browser gleichzeitig sind ein kaputtes
# Geraet. Also einer nach dem anderen, auch wenn es viermal so lange dauert.
set -u
cd "$(dirname "$0")/../../.."
HAFEN=${1:-8900}
ORDNER=${2:-/tmp/pk5}
L=${3:-A}
W=${4:-420}
mkdir -p "$ORDNER"
for E in 1 2 3 4; do
  HAFEN=$HAFEN node werkbank/schuss/preis-kritik-w5/hand.mjs $E "$W" "$ORDNER/e$E-$L.json" \
    2>&1 | tee "$ORDNER/e$E-$L.log"
done
