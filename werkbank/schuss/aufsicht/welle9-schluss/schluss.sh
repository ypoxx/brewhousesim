#!/usr/bin/env bash
# Gegenmessung der Aufsicht zu Welle 9. Wiederaufnehmbar.
# 1350 dreifach (dort war die Verarmung), die uebrigen drei je einmal —
# jeder Wert muss die Meldung des Builders Ziffer fuer Ziffer treffen.
cd "$(dirname "$0")/../../../.."
Z=werkbank/schuss/aufsicht/welle9-schluss/rho
M=$(curl -s -m 5 http://127.0.0.1:8907/.messstand-marke)
[ -z "$M" ] && { echo "!!! Hafen 8907 tot" >> $Z/../lauf.log; exit 1; }
mkdir -p $Z
for S in "1 A" "2 A" "1 B" "3 A" "1 C" "4 A"; do
  set -- $S; E=$1; L=$2
  [ -s $Z/e$E-$L.json ] && continue
  HAFEN=8907 MESSFENSTER_WARTE=7200 werkbank/schuss/aufsicht/messfenster.sh \
    node werkbank/schuss/rueckkopplung-r3/linie.mjs $E 400 $Z/e$E-$L.json >> $Z/../lauf.log 2>&1
  [ -s $Z/e$E-$L.json ] && echo "--- e$E-$L OK ($M) $(date -u +%H:%M:%S)" >> $Z/../lauf.log \
                        || echo "!!! e$E-$L KEINE DATEI $(date -u +%H:%M:%S)" >> $Z/../lauf.log
done
echo "FERTIG" >> $Z/../lauf.log
