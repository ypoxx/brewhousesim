#!/usr/bin/env bash
# NACHZUSTAND messen — je Lauf durchs Messfenster, nie zwei nebeneinander.
# Stand 8952 = 7896ee6 + ausschliesslich die Dateien DER FUHRE.
cd "$(dirname "$0")/../../.."
set -u
M=werkbank/schuss/aufsicht/messfenster.sh
export HAFEN=8952 MESSFENSTER_WARTE=7200
Z=werkbank/schuss/fuhre-w11/messungen
echo "== nachher: 30 Wochen OHNE Escape (messen.mjs) $(date -u +%H:%M:%S)"
WOCHEN=30 ESC=0 $M node werkbank/schuss/fuhre-w11/messen.mjs nachher-w30 > $Z/nachher-w30.log 2>&1
echo "  -> $? $(date -u +%H:%M:%S)"
echo "== nachher: Ladezustand (messen.mjs) $(date -u +%H:%M:%S)"
WOCHEN=0 ESC=0 $M node werkbank/schuss/fuhre-w11/messen.mjs nachher-laden > $Z/nachher-laden.log 2>&1
echo "  -> $? $(date -u +%H:%M:%S)"
echo "== nachher: deckung.mjs 30 Wochen ohne Escape $(date -u +%H:%M:%S)"
WOCHEN=30 NAME=nachher-w30 $M node werkbank/schuss/fuhre-w11/deckung.mjs > $Z/nachher-deckung-w30.log 2>&1
echo "  -> $? $(date -u +%H:%M:%S)"
echo "== nachher: deckung.mjs Ladezustand $(date -u +%H:%M:%S)"
WOCHEN=0 NAME=nachher-laden $M node werkbank/schuss/fuhre-w11/deckung.mjs > $Z/nachher-deckung-laden.log 2>&1
echo "  -> $? $(date -u +%H:%M:%S)"
echo "== Lesbarkeit 1366x768 $(date -u +%H:%M:%S)"
BREITE=1366 HOEHE=768 $M node werkbank/schuss/aufsicht/lesbarkeit.mjs > $Z/nachher-lesbarkeit.txt 2>&1
echo "  -> $? $(date -u +%H:%M:%S)"
echo "== Tor $(date -u +%H:%M:%S)"
$M node werkbank/schuss/aufsicht/tor.mjs > $Z/nachher-tor.txt 2>&1
echo "  -> $? $(date -u +%H:%M:%S)"
echo "== Spielprobe $(date -u +%H:%M:%S)"
$M node werkbank/schuss/aufsicht/spielprobe.mjs > $Z/nachher-spielprobe.txt 2>&1
echo "  -> $? $(date -u +%H:%M:%S)"
echo "== Sonde 30 Wochen (Endstand) $(date -u +%H:%M:%S)"
WOCHEN=30 $M node werkbank/schuss/fuhre-w11/sonde.mjs nachher-sonde-w30 > $Z/nachher-sonde-w30.log 2>&1
echo "  -> $? $(date -u +%H:%M:%S)"
echo "FERTIG $(date -u +%H:%M:%S)"
