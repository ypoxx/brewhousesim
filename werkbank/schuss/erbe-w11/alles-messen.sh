#!/usr/bin/env bash
# DER GANZE SATZ, SEQUENZIELL DURCHS MESSFENSTER.
#
#   werkbank/schuss/erbe-w11/alles-messen.sh
#
# Jeder Lauf einzeln, nie zwei Browser nebeneinander, jede Ausgabe sofort auf
# die Platte — ein Builder dieser Welle ist an einem Container-Reset
# gestorben, und nur weil er laufend geschrieben hatte, war seine Messung
# noch da.
#
# VOR  = 8941, Messstand 7896ee6
# NACH = 8942, Vorzustand + ausschliesslich die Dateien DES ERBE
set -uo pipefail
cd "$(dirname "$0")/../../.."
export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
export MESSFENSTER_WARTE=7200
M=werkbank/schuss/aufsicht/messfenster.sh
Z=werkbank/schuss/erbe-w11/messungen
mkdir -p "$Z"

lauf() {                        # $1 = Zieldatei ohne .txt, Rest = Befehl
  local name=$1; shift
  if [ -s "$Z/$name.txt" ] && [ -z "${NEU:-}" ]; then
    echo "== $name: liegt schon"; return 0
  fi
  echo "== $name  $(date -u +%H:%M:%S)"
  ( "$@" ) > "$Z/$name.txt" 2>&1
  echo "   fertig $(date -u +%H:%M:%S)  ($(wc -l < "$Z/$name.txt") Zeilen)"
}

# ---- 1. Der Haushalt von innen, isoliert -------------------------------
lauf nach-laden      env HAFEN=8942            $M node werkbank/schuss/erbe-w11/probe.mjs
lauf nach-w30        env HAFEN=8942 WOCHEN=30  $M node werkbank/schuss/erbe-w11/probe.mjs
lauf vor-sonde-w30   env HAFEN=8941 WOCHEN=30 MARKE=vorher-w30 $M node werkbank/schuss/erbe-w11/sonde.mjs
lauf nach-sonde-w30  env HAFEN=8942 WOCHEN=30 MARKE=nachher-w30 $M node werkbank/schuss/erbe-w11/sonde.mjs

# ---- 2. Photographisch je Stueck (das Geraet der 239.643) --------------
lauf vor-messen-laden  env HAFEN=8941 $M node werkbank/schuss/rahmen-w10/messen.mjs erbe-vor-laden
lauf nach-messen-laden env HAFEN=8942 $M node werkbank/schuss/rahmen-w10/messen.mjs erbe-nach-laden
lauf vor-messen-w30    env HAFEN=8941 WOCHEN=30 ESC=1 $M node werkbank/schuss/rahmen-w10/messen.mjs erbe-vor-w30
lauf nach-messen-w30   env HAFEN=8942 WOCHEN=30 ESC=1 $M node werkbank/schuss/rahmen-w10/messen.mjs erbe-nach-w30

# ---- 3. Deckung des blinden Kritikers ----------------------------------
lauf vor-deckung-laden  env HAFEN=8941 $M node werkbank/schuss/bild-w9/deckung.mjs
lauf nach-deckung-laden env HAFEN=8942 $M node werkbank/schuss/bild-w9/deckung.mjs
lauf vor-deckung-w30esc  env HAFEN=8941 WOCHEN=30 ESCAPE=1 $M node werkbank/schuss/bild-w9/deckung.mjs
lauf nach-deckung-w30esc env HAFEN=8942 WOCHEN=30 ESCAPE=1 $M node werkbank/schuss/bild-w9/deckung.mjs
lauf vor-deckung-w30  env HAFEN=8941 WOCHEN=30 $M node werkbank/schuss/bild-w9/deckung.mjs
lauf nach-deckung-w30 env HAFEN=8942 WOCHEN=30 $M node werkbank/schuss/bild-w9/deckung.mjs

# ---- 4. Abnahme --------------------------------------------------------
lauf nach-tor        env HAFEN=8942 $M node werkbank/schuss/aufsicht/tor.mjs
lauf nach-spielprobe env HAFEN=8942 $M node werkbank/schuss/erbe-w11/spielprobe-hafen.mjs
lauf vor-lesbarkeit  env HAFEN=8941 BREITE=1366 HOEHE=768 $M node werkbank/schuss/aufsicht/lesbarkeit.mjs
lauf nach-lesbarkeit env HAFEN=8942 BREITE=1366 HOEHE=768 $M node werkbank/schuss/aufsicht/lesbarkeit.mjs
lauf nach-gewicht    env HAFEN=8942 $M node werkbank/schuss/aufsicht/gewicht-gegenprobe.mjs

echo "ALLES DURCH  $(date -u +%H:%M:%S)"
