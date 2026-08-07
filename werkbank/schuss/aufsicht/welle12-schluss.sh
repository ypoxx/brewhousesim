#!/usr/bin/env bash
# Die zwei fehlenden 1970-Laeufe der Abnahme 5. Die Schlange des Rahmens ist mit
# ihm gestorben; der Stand 813f776 steht noch auf Hafen 8950 (Marke geprueft).
cd "$(dirname "$0")/../../.."
Z=werkbank/schuss/rahmen-w12/abnahme5
M=$(curl -s -m 5 http://127.0.0.1:8950/.messstand-marke)
[ "$M" != "813f776" ] && { echo "!!! Hafen 8950 liefert '$M' statt 813f776" >> $Z/../schluss.log; exit 1; }
for L in B C; do
  [ -s $Z/e4-$L.json ] && continue
  HAFEN=8950 MESSFENSTER_WARTE=7200 werkbank/schuss/aufsicht/messfenster.sh \
    node werkbank/schuss/rueckkopplung-r3/linie.mjs 4 400 $Z/e4-$L.json >> $Z/../schluss.log 2>&1
  [ -s $Z/e4-$L.json ] && echo "--- e4-$L OK ($M) $(date -u +%H:%M:%S)" >> $Z/../schluss.log \
                       || echo "!!! e4-$L KEINE DATEI" >> $Z/../schluss.log
done
echo "1970 FERTIG" >> $Z/../schluss.log
