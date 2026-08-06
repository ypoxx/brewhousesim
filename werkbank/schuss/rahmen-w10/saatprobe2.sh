#!/usr/bin/env bash
# SAATPROBE, zweiter Teil: 1600, 1884, 1970 — EINZELN, nicht nebeneinander.
#
# Grund, und er ist ein Befund über das Messgerät:
# `rueckkopplung-r3/welle.sh` fährt die vier Epochen NEBENEINANDER und
# begründet das im Kopf mit „dieselbe Reihe bei Lastmittel 1,5 und bei 13,7".
# Auf demselben eingefrorenen Stand (8932) gilt das heute nicht:
#   1350 einzeln  (3 Läufe)  -> Kasse 28–524, dreimal dieselbe md5
#   1350 nebenher (welle.sh) -> Kasse 30–558
#   1884 nebenher (welle.sh) -> Kasse 2907–25557 statt 1757–23789
# Also wird hier einzeln gemessen, auf BEIDEN Ständen, abwechselnd.
set -uo pipefail
cd "$(dirname "$0")/../../.."
export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers MESSFENSTER_WARTE=7200
MF=werkbank/schuss/aufsicht/messfenster.sh
Z=werkbank/schuss/rahmen-w10
mkdir -p $Z/saat
for E in 2 3 4; do
  for SATZ in "VOR 8930" "OHNE 8932"; do
    set -- $SATZ
    echo "### $(date -u +%H:%M:%S)  $1 e$E"
    HAFEN=$2 $MF node werkbank/schuss/rueckkopplung-r3/linie.mjs $E 400 \
      "$Z/saat/$1-e$E-A.json" > "$Z/saat/$1-e$E-A.log" 2>&1
  done
done
echo "### $(date -u +%H:%M:%S) SAATPROBE-2 DURCH"
