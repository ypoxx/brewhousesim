#!/usr/bin/env bash
# DER SCHLUSSATZ DES GEGNERS — alles, was die Fertigmeldung braucht.
#
#   werkbank/schuss/gegner-w11/schluss.sh <hafen> <marke>
#
# Jeder Lauf geht EINZELN durch `aufsicht/messfenster.sh`. Das Fenster wird
# zwischen den Laeufen freigegeben, damit die beiden anderen Builder dieser
# Welle dazwischenkommen koennen — es misst immer nur einer, aber niemand
# haelt die Sperre laenger als seinen eigenen Lauf.
#
# Reihenfolge ist Absicht: erst die billigen Sonden, die sagen, OB der Stand
# taugt; dann die teuren Aufnahmen; ganz zuletzt die vier 400-Wochen-Linien.
# Wer zuerst misst, was 40 Minuten dauert, erfaehrt zuletzt, dass es umsonst
# war.
set -uo pipefail
cd "$(dirname "$0")/../../.."
export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
export MESSFENSTER_WARTE=7200
HAFEN=${1:-8962}
M=${2:-nach2}
Z=werkbank/schuss/gegner-w11/messungen
R=werkbank/schuss/gegner-w11/rho
F=werkbank/schuss/aufsicht/messfenster.sh
mkdir -p "$Z" "$R"

lauf() {                       # lauf <name> <env…> -- <befehl…>
  local name=$1; shift
  echo "### $name  start $(date -u +%H:%M:%S)"
  HAFEN=$HAFEN $F "$@" > "$Z/$M-$name.log" 2>&1
  echo "### $name  ende $? $(date -u +%H:%M:%S)"
}

# --- 1  die drei Zustaende, DOM-seitig (billig, sagt sofort Bescheid) -------
echo "### sonde-laden start $(date -u +%H:%M:%S)"
HAFEN=$HAFEN $F node werkbank/schuss/gegner-w11/sonde.mjs "$M-laden" \
  > "$Z/$M-laden.log" 2>&1
echo "### sonde-laden ende $? $(date -u +%H:%M:%S)"

echo "### sonde-gebaut start $(date -u +%H:%M:%S)"
HAFEN=$HAFEN BAUEN=34 ESC=1 $F node werkbank/schuss/gegner-w11/sonde.mjs "$M-gebaut" \
  > "$Z/$M-gebaut.log" 2>&1
echo "### sonde-gebaut ende $? $(date -u +%H:%M:%S)"

echo "### sonde-w30 start $(date -u +%H:%M:%S)"
HAFEN=$HAFEN WOCHEN=30 $F node werkbank/schuss/gegner-w11/sonde.mjs "$M-w30" \
  > "$Z/$M-w30.log" 2>&1
echo "### sonde-w30 ende $? $(date -u +%H:%M:%S)"

# --- 2  die Abnahme des Tores ----------------------------------------------
lauf tor        node werkbank/schuss/aufsicht/tor.mjs
lauf spielprobe node werkbank/schuss/aufsicht/spielprobe.mjs

echo "### lesbarkeit start $(date -u +%H:%M:%S)"
HAFEN=$HAFEN BREITE=1366 HOEHE=768 $F node werkbank/schuss/aufsicht/lesbarkeit.mjs \
  > "$Z/$M-lesbarkeit.txt" 2>&1
echo "### lesbarkeit ende $? $(date -u +%H:%M:%S)"

# --- 3  photographisch: die Bildpunkte je Stueck ---------------------------
echo "### foto-laden start $(date -u +%H:%M:%S)"
HAFEN=$HAFEN $F node werkbank/schuss/rahmen-w10/messen.mjs "gegnerw11-$M-laden" \
  > "$Z/$M-foto-laden.log" 2>&1
echo "### foto-laden ende $? $(date -u +%H:%M:%S)"
cp werkbank/schuss/rahmen-w10/messungen/gegnerw11-$M-laden.txt  "$Z/" 2>/dev/null
cp werkbank/schuss/rahmen-w10/messungen/gegnerw11-$M-laden.json "$Z/" 2>/dev/null

echo "### foto-w30 start $(date -u +%H:%M:%S)"
HAFEN=$HAFEN WOCHEN=30 $F node werkbank/schuss/rahmen-w10/messen.mjs "gegnerw11-$M-w30" \
  > "$Z/$M-foto-w30.log" 2>&1
echo "### foto-w30 ende $? $(date -u +%H:%M:%S)"
cp werkbank/schuss/rahmen-w10/messungen/gegnerw11-$M-w30.txt  "$Z/" 2>/dev/null
cp werkbank/schuss/rahmen-w10/messungen/gegnerw11-$M-w30.json "$Z/" 2>/dev/null

# --- 4  das Geraet des blinden Kritikers -----------------------------------
# Es schreibt auf feste Pfade in bild-w9/; drei Builder wuerden einander
# ueberschreiben, also zaehlt hier die abgefangene Ausgabe.
echo "### deckung-laden start $(date -u +%H:%M:%S)"
HAFEN=$HAFEN $F node werkbank/schuss/bild-w9/deckung.mjs > "$Z/$M-deckung-laden.txt" 2>&1
echo "### deckung-laden ende $? $(date -u +%H:%M:%S)"

echo "### deckung-w30 start $(date -u +%H:%M:%S)"
HAFEN=$HAFEN WOCHEN=30 ESCAPE=1 $F node werkbank/schuss/bild-w9/deckung.mjs \
  > "$Z/$M-deckung-w30esc.txt" 2>&1
echo "### deckung-w30 ende $? $(date -u +%H:%M:%S)"

echo "### deckung-w30-ohne-esc start $(date -u +%H:%M:%S)"
HAFEN=$HAFEN WOCHEN=30 $F node werkbank/schuss/bild-w9/deckung.mjs \
  > "$Z/$M-deckung-w30.txt" 2>&1
echo "### deckung-w30-ohne-esc ende $? $(date -u +%H:%M:%S)"

# --- 5  die zweite Messlatte, vier Epochen, EINZELN ------------------------
for e in 1 2 3 4; do
  echo "### rho $M e$e start $(date -u +%H:%M:%S)"
  HAFEN=$HAFEN $F node werkbank/schuss/rueckkopplung-r3/linie.mjs "$e" 400 \
    "$R/$M-e$e.json" > "$R/$M-e$e.log" 2>&1
  echo "### rho $M e$e ende $? $(date -u +%H:%M:%S)"
done

echo "### SCHLUSSATZ FERTIG $(date -u +%H:%M:%S)"
