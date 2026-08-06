#!/usr/bin/env bash
# ABNAHME DES GEGNERS — der ganze Satz, sequenziell durchs Messfenster.
#
#   werkbank/schuss/gegner-w11/abnahme.sh <hafen> <marke>
#
# Jeder Lauf geht einzeln durch `aufsicht/messfenster.sh`: es misst immer nur
# einer auf dieser Maschine, und drei Builder teilen sich das Fenster.
# Die Ergebnisse landen unter messungen/<marke>-*.
set -uo pipefail
cd "$(dirname "$0")/../../.."
export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
export MESSFENSTER_WARTE=7200
HAFEN=${1:-8962}
M=${2:-nach}
Z=werkbank/schuss/gegner-w11/messungen
F=werkbank/schuss/aufsicht/messfenster.sh

echo "### $M auf Hafen $HAFEN — $(date -u +%H:%M:%S)"

HAFEN=$HAFEN $F node werkbank/schuss/aufsicht/tor.mjs            > "$Z/$M-tor.txt" 2>&1
echo "tor        $? $(date -u +%H:%M:%S)"

HAFEN=$HAFEN $F node werkbank/schuss/aufsicht/spielprobe.mjs     > "$Z/$M-spielprobe.txt" 2>&1
echo "spielprobe $? $(date -u +%H:%M:%S)"

HAFEN=$HAFEN BREITE=1366 HOEHE=768 $F node werkbank/schuss/aufsicht/lesbarkeit.mjs \
                                                                 > "$Z/$M-lesbarkeit.txt" 2>&1
echo "lesbarkeit $? $(date -u +%H:%M:%S)"

# Photographisch, je Stueck — dasselbe Geraet, mit dem der Haushalt gerechnet
# wurde. Es schreibt in rahmen-w10/messungen; die Kopie kommt hierher.
HAFEN=$HAFEN $F node werkbank/schuss/rahmen-w10/messen.mjs "gegnerw11-$M-laden" \
                                                                 > "$Z/$M-foto-laden.log" 2>&1
cp werkbank/schuss/rahmen-w10/messungen/gegnerw11-$M-laden.txt  "$Z/" 2>/dev/null
cp werkbank/schuss/rahmen-w10/messungen/gegnerw11-$M-laden.json "$Z/" 2>/dev/null
echo "foto-laden $? $(date -u +%H:%M:%S)"

HAFEN=$HAFEN WOCHEN=30 $F node werkbank/schuss/rahmen-w10/messen.mjs "gegnerw11-$M-w30" \
                                                                 > "$Z/$M-foto-w30.log" 2>&1
cp werkbank/schuss/rahmen-w10/messungen/gegnerw11-$M-w30.txt  "$Z/" 2>/dev/null
cp werkbank/schuss/rahmen-w10/messungen/gegnerw11-$M-w30.json "$Z/" 2>/dev/null
echo "foto-w30   $? $(date -u +%H:%M:%S)"

# Das Geraet des blinden Kritikers selbst, Ladezustand. Es schreibt auf feste
# Pfade in bild-w9/ — die drei Builder wuerden einander ueberschreiben, also
# wird die Ausgabe sofort hierher kopiert.
HAFEN=$HAFEN $F node werkbank/schuss/bild-w9/deckung.mjs         > "$Z/$M-deckung-laden.txt" 2>&1
echo "deckung    $? $(date -u +%H:%M:%S)"
echo "### fertig $(date -u +%H:%M:%S)"
