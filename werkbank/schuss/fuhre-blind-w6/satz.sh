#!/usr/bin/env bash
# BLINDER KRITIKER DIE FUHRE, Welle 6 — der Messsatz.
# Zwoelf Laeufe, streng hintereinander, jeder einzeln durch das Messfenster.
# Kein Hintergrund-Nebeneinander: die Schleife wartet auf jeden Aufruf.
cd /home/user/brewhousesim
Z=werkbank/schuss/fuhre-blind-w6
mkdir -p "$Z/rho"
for lauf in A B C; do
  for ep in 1 2 3 4; do
    ziel="$Z/rho/e$ep-$lauf.json"
    [ -s "$ziel" ] && { echo "== e$ep-$lauf liegt schon vor"; continue; }
    echo "== $(date -u +%H:%M:%S) e$ep lauf $lauf"
    HAFEN=8900 MESSFENSTER_WARTE=7200 werkbank/schuss/aufsicht/messfenster.sh \
      node werkbank/schuss/rueckkopplung-r3/linie.mjs "$ep" 400 "$ziel" \
      >>"$Z/rho/satz.log" 2>&1
    rc=$?
    echo "   rc=$rc $(date -u +%H:%M:%S)"
    [ "$rc" -ne 0 ] && echo "   !! FEHLER e$ep-$lauf rc=$rc — NICHT gemessen"
  done
done
echo "== SATZ FERTIG $(date -u +%H:%M:%S)"
