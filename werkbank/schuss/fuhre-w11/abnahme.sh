#!/usr/bin/env bash
# ABNAHME nach dem Neuanlauf — alles auf dem Stand, der ausgeliefert wird.
#
#   werkbank/schuss/fuhre-w11/abnahme.sh
#
# WARUM ES DAS GIBT: die Zahlen in §3.1–3.7 stehen auf dem Nachstand
# `7896ee6+118b191467` (= Commit 91fb766). Der Arbeitsbaum ist seither um zwei
# reine Kommentar-Commits weitergerueckt (§3.8) und traegt die Marke
# `7896ee6+cf76271455`. Zwei Marken, die sich nur im Kommentar unterscheiden,
# SOLLTEN dieselben Zahlen liefern — „sollten" ist aber kein Messwert. Also
# nachgemessen, auf dem Stand, der wirklich ausgeliefert wird.
#
# Dazu die Fertigmeldungsprobe des Auftrags: alle vier Epochen laden,
# BRAUHAUS.lage.length = 0, keine Konsolenfehler.
#
# Jeder Lauf einzeln durchs Messfenster — nie zwei nebeneinander.
set -uo pipefail
cd "$(dirname "$0")/../../.."
M=werkbank/schuss/aufsicht/messfenster.sh
Z=werkbank/schuss/fuhre-w11/messungen
export MESSFENSTER_WARTE=7200

lauf() { echo "== $1  $(date -u +%H:%M:%S)"; shift; "$@"; echo "   -> $? $(date -u +%H:%M:%S)"; }

mkdir -p werkbank/schuss/fuhre-w11/bilder

lauf "Sonde 30 Wochen OHNE Escape (Endstand cf76271455)" \
  env HAFEN=8952 WOCHEN=30 ESC=0 $M node werkbank/schuss/fuhre-w11/sonde.mjs abn-sonde-w30 \
  > $Z/abn-sonde-w30.log 2>&1

lauf "Sonde Ladezustand (Endstand)" \
  env HAFEN=8952 WOCHEN=0 ESC=0 $M node werkbank/schuss/fuhre-w11/sonde.mjs abn-sonde-laden \
  > $Z/abn-sonde-laden.log 2>&1

lauf "Tor — vier Epochen laden, lage, Konsolenfehler" \
  env HAFEN=8952 $M node werkbank/schuss/aufsicht/tor.mjs \
  > $Z/abn-tor.txt 2>&1

lauf "Deckung 30 Wochen OHNE Escape (Endstand)" \
  env HAFEN=8952 WOCHEN=30 NAME=abn-w30 $M node werkbank/schuss/fuhre-w11/deckung.mjs \
  > $Z/abn-deckung-w30.log 2>&1

echo "FERTIG $(date -u +%H:%M:%S)"
