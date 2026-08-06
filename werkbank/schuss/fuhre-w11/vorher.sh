#!/usr/bin/env bash
# VORZUSTAND 7896ee6 auf Hafen 8951 — je Lauf durchs Messfenster, nie zwei nebeneinander.
cd "$(dirname "$0")/../../.."
set -u
M=werkbank/schuss/aufsicht/messfenster.sh
export HAFEN=8951 MESSFENSTER_WARTE=7200
echo "== vorher: 30 Wochen OHNE Escape (messen.mjs) $(date -u +%H:%M:%S)"
WOCHEN=30 ESC=0 $M node werkbank/schuss/fuhre-w11/messen.mjs vorher-w30 > werkbank/schuss/fuhre-w11/messungen/vorher-w30.log 2>&1
echo "  -> $? $(date -u +%H:%M:%S)"
echo "== vorher: Ladezustand (messen.mjs) $(date -u +%H:%M:%S)"
WOCHEN=0 ESC=0 $M node werkbank/schuss/fuhre-w11/messen.mjs vorher-laden > werkbank/schuss/fuhre-w11/messungen/vorher-laden.log 2>&1
echo "  -> $? $(date -u +%H:%M:%S)"
echo "== vorher: deckung.mjs 30 Wochen ohne Escape $(date -u +%H:%M:%S)"
WOCHEN=30 NAME=vorher-w30 $M node werkbank/schuss/fuhre-w11/deckung.mjs > werkbank/schuss/fuhre-w11/messungen/vorher-deckung-w30.log 2>&1
echo "  -> $? $(date -u +%H:%M:%S)"
echo "FERTIG $(date -u +%H:%M:%S)"
