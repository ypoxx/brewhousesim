#!/usr/bin/env bash
# Schlussmessung Welle 7. Wiederaufnehmbar, ueberspringt fertige Laeufe.
cd "$(dirname "$0")/../../../.."
Z=werkbank/schuss/aufsicht/welle7-schluss/rho
M=$(curl -s -m 5 http://127.0.0.1:8903/.messstand-marke)
[ -z "$M" ] && { echo "!!! Hafen 8903 tot — nicht gemessen" >> $Z/../lauf.log; exit 1; }
for E in 1 4 2 3; do
  for L in A B C; do
    [ -s $Z/e$E-$L.json ] && continue
    mkdir -p $Z
    HAFEN=8903 MESSFENSTER_WARTE=7200 werkbank/schuss/aufsicht/messfenster.sh \
      node werkbank/schuss/rueckkopplung-r3/linie.mjs $E 400 $Z/e$E-$L.json \
      >> $Z/../lauf.log 2>&1
    if [ -s $Z/e$E-$L.json ]; then
      echo "--- e$E-$L OK ($M) $(date -u +%H:%M:%S)" >> $Z/../lauf.log
    else
      echo "!!! e$E-$L KEINE DATEI $(date -u +%H:%M:%S)" >> $Z/../lauf.log
    fi
  done
done
echo "FERTIG" >> $Z/../lauf.log
