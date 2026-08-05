#!/usr/bin/env bash
cd "$(dirname "$0")/../../../.."
Z=werkbank/schuss/aufsicht/welle7-nach-preis/rho
M=$(curl -s -m 5 http://127.0.0.1:8904/.messstand-marke)
[ -z "$M" ] && { echo "!!! Hafen 8904 tot" >> $Z/../lauf.log; exit 1; }
for S in "1 A" "1 B" "1 C" "4 A" "2 A" "3 A"; do
  set -- $S; E=$1; L=$2
  [ -s $Z/e$E-$L.json ] && continue
  mkdir -p $Z
  HAFEN=8904 MESSFENSTER_WARTE=7200 werkbank/schuss/aufsicht/messfenster.sh \
    node werkbank/schuss/rueckkopplung-r3/linie.mjs $E 400 $Z/e$E-$L.json >> $Z/../lauf.log 2>&1
  [ -s $Z/e$E-$L.json ] && echo "--- e$E-$L OK ($M) $(date -u +%H:%M:%S)" >> $Z/../lauf.log \
                        || echo "!!! e$E-$L KEINE DATEI $(date -u +%H:%M:%S)" >> $Z/../lauf.log
done
echo "FERTIG" >> $Z/../lauf.log
