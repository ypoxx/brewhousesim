#!/usr/bin/env bash
# DIE ABNAHME DER WELLE 9, DIE STADT — alles sequenziell durchs Messfenster.
#
#   werkbank/schuss/stadt-w9/abnahme.sh [hafen]
#
# Reihenfolge mit Absicht: erst die kurzen Proben (sie koennen einen Blocker
# zeigen, bevor drei Stunden Kennzahl verbrannt sind), dann die zwoelf
# rho-Laeufe. NIE zwei Browser gleichzeitig — jeder Aufruf geht einzeln durch
# `aufsicht/messfenster.sh`, so wie es der Auftrag verlangt.
#
# Wiederaufnehmbar: was schon als Datei daliegt, wird uebersprungen. Der
# Container wird regelmaessig zurueckgesetzt; ein Lauf, der von vorn anfangen
# muesste, waere in diesem Lauf schon zweimal verlorengegangen.
set -uo pipefail
cd "$(dirname "$0")/../../.."
H=${1:-8931}
Z=werkbank/schuss/stadt-w9
L=$Z/log
mkdir -p "$L" "$Z/rho"
export MESSFENSTER_WARTE=7200

sage() { echo "[$(date -u +%H:%M:%S)] $*" | tee -a "$L/abnahme.log"; }
fenster() { werkbank/schuss/aufsicht/messfenster.sh "$@"; }

sage "ABNAHME auf Hafen $H, Marke $(curl -s -m 5 http://127.0.0.1:$H/.messstand-marke)"

# ---- 1. Die kurzen Proben ------------------------------------------------
if [ ! -s "$L/tor-stadt.txt" ]; then
  HAFEN=$H fenster node $Z/tor.mjs > "$L/tor-stadt.txt" 2>&1; sage "tor.mjs (STADT)"
fi
if [ ! -s "$L/tor-aufsicht.txt" ]; then
  HAFEN=$H fenster node werkbank/schuss/aufsicht/tor.mjs > "$L/tor-aufsicht.txt" 2>&1
  sage "aufsicht/tor.mjs"
fi
if [ ! -s "$L/spielprobe.txt" ]; then
  HAFEN=$H fenster node werkbank/schuss/aufsicht/spielprobe.mjs > "$L/spielprobe.txt" 2>&1
  sage "aufsicht/spielprobe.mjs"
fi
if [ ! -s "$L/lesbarkeit.txt" ]; then
  HAFEN=$H fenster node werkbank/schuss/aufsicht/lesbarkeit.mjs > "$L/lesbarkeit.txt" 2>&1
  sage "aufsicht/lesbarkeit.mjs"
fi
if [ ! -s "$L/gewicht.txt" ]; then
  HAFEN=$H fenster node werkbank/schuss/aufsicht/gewicht-gegenprobe.mjs > "$L/gewicht.txt" 2>&1
  sage "gewicht-gegenprobe"
fi
if [ ! -s "$Z/reiterprobe-nachher.json" ]; then
  HAFEN=$H ZIEL=$Z/reiterprobe-nachher.json fenster \
    node werkbank/schuss/stadt-w8/reiterprobe.mjs > "$L/reiterprobe.txt" 2>&1
  sage "reiterprobe"
fi
if [ ! -s "$L/deckung-nachher.txt" ]; then
  HAFEN=$H MARKE=nachher fenster node $Z/deckung.mjs 1,2,3,4 > "$L/deckung-nachher.txt" 2>&1
  sage "Deckung Ladezustand"
fi
if [ ! -s "$L/gespielt.txt" ]; then
  HAFEN=$H fenster node $Z/gespielt.mjs > "$L/gespielt.txt" 2>&1
  sage "A3 nach 30 Wochen"
fi
if [ ! -s "$L/deckung-w30.txt" ]; then
  HAFEN=$H MARKE=nachher WOCHEN=30 fenster node $Z/deckung.mjs 1,2,3,4 > "$L/deckung-w30.txt" 2>&1
  sage "Deckung nach 30 Wochen"
fi

# ---- 2. Die Kennzahl: vier Epochen, je drei Laeufe -----------------------
for E in 1 2 3 4; do
  for N in a b c; do
    D=$Z/rho/e$E-$N.json
    [ -s "$D" ] && continue
    HAFEN=$H fenster node werkbank/schuss/rueckkopplung-r3/linie.mjs $E 400 "$D" \
      >> "$L/rho.txt" 2>&1
    sage "rho E$E Lauf $N: $(tail -2 "$L/rho.txt" | head -1)"
  done
done
sage "ABNAHME FERTIG"
