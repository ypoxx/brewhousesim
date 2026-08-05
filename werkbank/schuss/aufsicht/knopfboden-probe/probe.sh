#!/usr/bin/env bash
# A/B: bewegt der Knopfboden die rho-Zahlen? 8901 mit, 8902 ohne, Commit 517ca3f.
# LIEGT IM REPO, nicht in /tmp — /tmp hat zwei Container-Resets nicht ueberlebt.
cd "$(dirname "$0")/../../../.."
Z=werkbank/schuss/aufsicht/knopfboden-probe
for E in 4 2; do
  for L in A B C; do
    for ARM in mit ohne; do
      [ -s $Z/$ARM/e$E-$L.json ] && continue
      H=8901; [ $ARM = ohne ] && H=8902
      M=$(curl -s -m 5 http://127.0.0.1:$H/.messstand-marke)
      if [ -z "$M" ]; then
        echo "!!! ABBRUCH: Hafen $H liefert keine Marke — nicht gemessen" >> $Z/lauf.log; exit 1
      fi
      mkdir -p $Z/$ARM
      HAFEN=$H MESSFENSTER_WARTE=7200 werkbank/schuss/aufsicht/messfenster.sh \
        node werkbank/schuss/rueckkopplung-r3/linie.mjs $E 400 $Z/$ARM/e$E-$L.json >> $Z/lauf.log 2>&1
      if [ -s $Z/$ARM/e$E-$L.json ]; then
        echo "--- $ARM/e$E-$L OK ($M) $(date -u +%H:%M:%S)" >> $Z/lauf.log
      else
        echo "!!! $ARM/e$E-$L KEINE DATEI — verworfen $(date -u +%H:%M:%S)" >> $Z/lauf.log
      fi
    done
  done
done
echo "FERTIG" >> $Z/lauf.log
