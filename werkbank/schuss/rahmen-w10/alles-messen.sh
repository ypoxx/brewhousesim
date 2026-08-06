#!/usr/bin/env bash
# DER GANZE SATZ, sequenziell durchs Messfenster.
#   werkbank/schuss/rahmen-w10/alles-messen.sh
#
# VORHER  = eingefrorener Commit 37f4b44 auf Hafen 8930 (aufsicht/messstand.sh)
# NACHHER = eingefrorene Kopie des Arbeitsbaums auf Hafen 8931 (nachstand.sh)
#
# Der Vorzustand wird NEU gemessen, obwohl der Vorgaenger ihn schon gemessen
# hat: seine Fassung von messen.mjs hat die Kastenliste beim Maskieren selbst
# verschoben (siehe ARBEITSSTAND.md, Punkt 4). Die Prozente sind davon nicht
# betroffen, die Koordinaten und damit die Rand- und Tafellisten sehr wohl.
# Beide Saetze stehen nebeneinander im Bericht.
set -uo pipefail
cd "$(dirname "$0")/../../.."
export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
export MESSFENSTER_WARTE=7200
MF=werkbank/schuss/aufsicht/messfenster.sh
Z=werkbank/schuss/rahmen-w10

echo "### $(date -u +%H:%M:%S) Staende einfrieren"
werkbank/schuss/aufsicht/messstand.sh 37f4b44 8930 || exit 1
$Z/nachstand.sh 8931 || exit 1

echo "### $(date -u +%H:%M:%S) Deckung VORHER (37f4b44, Hafen 8930)"
HAFEN=8930 $MF node $Z/messen.mjs vorher2-laden        > $Z/messungen/lauf-vorher2-laden.log 2>&1
HAFEN=8930 WOCHEN=30 ESC=1 $MF node $Z/messen.mjs vorher2-w30-esc1 > $Z/messungen/lauf-vorher2-w30.log 2>&1

echo "### $(date -u +%H:%M:%S) Deckung NACHHER (Arbeitsbaum eingefroren, Hafen 8931)"
HAFEN=8931 $MF node $Z/messen.mjs nachher-laden        > $Z/messungen/lauf-nachher-laden.log 2>&1
HAFEN=8931 WOCHEN=30 ESC=1 $MF node $Z/messen.mjs nachher-w30-esc1 > $Z/messungen/lauf-nachher-w30.log 2>&1

echo "### $(date -u +%H:%M:%S) Lesbarkeit (vierte Latte, 1366x768)"
HAFEN=8930 BREITE=1366 HOEHE=768 $MF node werkbank/schuss/aufsicht/lesbarkeit.mjs > $Z/messungen/lesbarkeit-vorher.txt 2>&1
HAFEN=8931 BREITE=1366 HOEHE=768 $MF node werkbank/schuss/aufsicht/lesbarkeit.mjs > $Z/messungen/lesbarkeit-nachher.txt 2>&1

echo "### $(date -u +%H:%M:%S) Gewicht"
HAFEN=8931 $MF node werkbank/schuss/aufsicht/gewicht-gegenprobe.mjs > $Z/messungen/gewicht-nachher.txt 2>&1

echo "### $(date -u +%H:%M:%S) rho NACHHER — drei Saetze je vier Epochen"
for L in A B C; do
  $MF werkbank/schuss/rueckkopplung-r3/welle.sh 8931 $Z/rho-nachher $L \
      > $Z/rho-nachher-$L.log 2>&1
  echo "### $(date -u +%H:%M:%S) Satz $L durch"
done

echo "### $(date -u +%H:%M:%S) ALLES DURCH"
