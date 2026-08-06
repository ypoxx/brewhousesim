#!/usr/bin/env bash
# DER REST DES SATZES, in der Reihenfolge, in der er gebraucht wird.
# Zuerst die kurze Abnahme, dann rho (das Lange), dann die Gegenproben.
# Alles einzeln durchs Messfenster. Jede Ausgabe sofort auf die Platte.
set -uo pipefail
cd "$(dirname "$0")/../../.."
export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers MESSFENSTER_WARTE=7200
M=werkbank/schuss/aufsicht/messfenster.sh
Z=werkbank/schuss/erbe-w11/messungen
lauf() { local n=$1; shift; [ -s "$Z/$n.txt" ] && { echo "== $n liegt schon"; return 0; }
         echo "== $n $(date -u +%H:%M:%S)"; ( "$@" ) > "$Z/$n.txt" 2>&1; echo "   fertig $(date -u +%H:%M:%S)"; }

# 1 — Abnahme auf dem ausgelieferten Stand, kurz und zuerst
lauf nach2-tor        env HAFEN=8942 $M node werkbank/schuss/aufsicht/tor.mjs
lauf nach2-lesbarkeit env HAFEN=8942 BREITE=1366 HOEHE=768 $M node werkbank/schuss/aufsicht/lesbarkeit.mjs
lauf nach2-spielprobe env HAFEN=8942 $M node werkbank/schuss/erbe-w11/spielprobe-hafen.mjs
lauf vor-brettprobe   env HAFEN=8941 MARKE=vor  $M node werkbank/schuss/erbe-w11/brettprobe.mjs
lauf nach2-brettprobe env HAFEN=8942 MARKE=nach $M node werkbank/schuss/erbe-w11/brettprobe.mjs
echo "ABNAHME DURCH $(date -u +%H:%M:%S)"

# 2 — rho, das Lange
werkbank/schuss/erbe-w11/rho.sh > $Z/RHO.log 2>&1
echo "RHO DURCH $(date -u +%H:%M:%S)"

# 3 — Gegenproben, die den ersten Einfrierstand bestaetigen
lauf nach2-messen-laden  env HAFEN=8942 $M node werkbank/schuss/rahmen-w10/messen.mjs erbe-nach2-laden
lauf nach2-deckung-laden env HAFEN=8942 $M node werkbank/schuss/bild-w9/deckung.mjs
lauf nach2-einzeln  env HAFEN=8942 SEL=.erb-leiste,.erb-band NAME=nach2 $M node werkbank/schuss/erbe-w11/einzeln.mjs
lauf nach2-w30      env HAFEN=8942 WOCHEN=30 $M node werkbank/schuss/erbe-w11/probe.mjs
lauf nach2-gewicht  env HAFEN=8942 $M node werkbank/schuss/aufsicht/gewicht-gegenprobe.mjs
lauf nach2-deckung-w30esc env HAFEN=8942 WOCHEN=30 ESCAPE=1 $M node werkbank/schuss/bild-w9/deckung.mjs
echo "ALLES DURCH $(date -u +%H:%M:%S)"
