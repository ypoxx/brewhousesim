#!/usr/bin/env bash
# RHO VORHER UND NACHHER — A/B im selben Augenblick, wiederaufnehmbar.
#
#   werkbank/schuss/stadt-w8/rho/lauf.sh
#
# Hafen 8908 traegt den Stand VOR Welle 8 (Symlinkwald, in dem nur die fuenf
# STADT-Dateien aus stadt-w8/vor/ kommen), Hafen 8907 den Arbeitsbaum. Alles
# uebrige ist DIESELBE Datei — damit ist der Unterschied genau diese Welle und
# nichts sonst. Dieselbe Bauart wie aufsicht/knopfboden-probe/aufsetzen.sh.
#
# Reihenfolge: erst Satz A ueber alle vier Epochen auf BEIDEN Haefen, dann B,
# dann C. Wer mitten im Lauf abbricht (der Container wird stuendlich
# zurueckgesetzt), hat dann trotzdem ein vollstaendiges, gepaartes Bild.
#
# Jeder Aufruf geht durch aufsicht/messfenster.sh, einer nach dem anderen.
# Fertige Laeufe werden uebersprungen.
set -uo pipefail
cd "$(dirname "$0")/../../../.."
Z=werkbank/schuss/stadt-w8/rho
mkdir -p "$Z"

for H in 8908 8907; do
  if ! curl -s -m 5 -o /dev/null "http://127.0.0.1:$H/spiel/index.html"; then
    echo "!!! Hafen $H tot — nicht gemessen" | tee -a "$Z/lauf.log"; exit 1
  fi
done

for L in A B C; do
  for E in 1 2 3 4; do
    for H in 8908 8907; do
      [ "$H" = 8908 ] && W=vor || W=nach
      D="$Z/$W-e$E-$L.json"
      [ -s "$D" ] && continue
      HAFEN=$H MESSFENSTER_WARTE=7200 werkbank/schuss/aufsicht/messfenster.sh \
        node werkbank/schuss/rueckkopplung-r3/linie.mjs "$E" 400 "$D" \
        >> "$Z/lauf.log" 2>&1
      if [ -s "$D" ]; then
        echo "--- $W e$E $L OK $(date -u +%H:%M:%S)" >> "$Z/lauf.log"
      else
        echo "!!! $W e$E $L KEINE DATEI $(date -u +%H:%M:%S)" >> "$Z/lauf.log"
      fi
    done
  done
done
echo "FERTIG $(date -u +%H:%M:%S)" >> "$Z/lauf.log"
