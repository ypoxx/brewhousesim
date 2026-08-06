#!/usr/bin/env bash
# NACHPROBE — nach der letzten Aenderung (das Schild des Gegners zog von der
# Ebene 'bau' in ein eigenes Fach der Ebene 'hand') wird alles nachgemessen,
# was daran haengen KOENNTE. Es sollte an nichts haengen: das Schild traegt
# keinen `data-zug` und `pointer-events: none`. "Sollte" ist kein Messwert.
#
#   werkbank/schuss/stadt-w9/nachprobe.sh [hafen]
set -uo pipefail
cd "$(dirname "$0")/../../.."
H=${1:-8932}
Z=werkbank/schuss/stadt-w9
L=$Z/log
export MESSFENSTER_WARTE=7200
sage() { echo "[$(date -u +%H:%M:%S)] $*" | tee -a "$L/nachprobe.log"; }
f() { werkbank/schuss/aufsicht/messfenster.sh "$@"; }

sage "NACHPROBE auf $H, Marke $(curl -s -m 5 http://127.0.0.1:$H/.messstand-marke)"
[ -s "$L/n-tor.txt" ]        || { HAFEN=$H f node $Z/tor.mjs        > "$L/n-tor.txt" 2>&1; sage tor; }
[ -s "$L/n-gespielt.txt" ]   || { HAFEN=$H f node $Z/gespielt.mjs   > "$L/n-gespielt.txt" 2>&1; sage gespielt; }
[ -s "$L/n-kaufprobe.txt" ]  || { HAFEN=$H f node $Z/kaufprobe.mjs  > "$L/n-kaufprobe.txt" 2>&1; sage kaufprobe; }
[ -s "$L/n-spielprobe.txt" ] || { HAFEN=$H f node werkbank/schuss/aufsicht/spielprobe.mjs > "$L/n-spielprobe.txt" 2>&1; sage spielprobe; }
[ -s "$L/n-lesbarkeit.txt" ] || { HAFEN=$H BREITE=1366 HOEHE=768 f node werkbank/schuss/aufsicht/lesbarkeit.mjs > "$L/n-lesbarkeit.txt" 2>&1; sage lesbarkeit; }
[ -s "$L/n-gewicht.txt" ]    || { HAFEN=$H f node werkbank/schuss/aufsicht/gewicht-gegenprobe.mjs > "$L/n-gewicht.txt" 2>&1; sage gewicht; }
[ -s "$Z/reiterprobe-schluss.json" ] || { HAFEN=$H ZIEL=$Z/reiterprobe-schluss.json f \
    node werkbank/schuss/stadt-w8/reiterprobe.mjs > "$L/n-reiterprobe.txt" 2>&1; sage reiterprobe; }
mkdir -p $Z/rho-schluss
for E in 1 2 3 4; do
  D=$Z/rho-schluss/e$E-a.json
  [ -s "$D" ] && continue
  HAFEN=$H f node werkbank/schuss/rueckkopplung-r3/linie.mjs $E 400 "$D" >> "$L/n-rho.txt" 2>&1
  sage "rho E$E"
done
sage "NACHPROBE FERTIG"
