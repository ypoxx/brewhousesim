#!/usr/bin/env bash
# Zieht 1600 und 1884 vor, damit alle vier Epochen zuerst EINMAL abgedeckt sind,
# bevor die Wiederholungslaeufe der Geraetekontrolle drankommen. Laeuft neben
# schluss.sh; das Messfenster serialisiert beide.
cd "$(dirname "$0")/../../../.."
Z=werkbank/schuss/aufsicht/welle7-schluss/rho
for E in 2 3; do
  [ -s $Z/e$E-A.json ] && continue
  M=$(curl -s -m 5 http://127.0.0.1:8903/.messstand-marke)
  [ -z "$M" ] && { echo "!!! Hafen 8903 tot" >> $Z/../lauf.log; exit 1; }
  HAFEN=8903 MESSFENSTER_WARTE=7200 werkbank/schuss/aufsicht/messfenster.sh \
    node werkbank/schuss/rueckkopplung-r3/linie.mjs $E 400 $Z/e$E-A.json >> $Z/../lauf.log 2>&1
  [ -s $Z/e$E-A.json ] && echo "--- e$E-A OK ($M) $(date -u +%H:%M:%S)" >> $Z/../lauf.log \
                       || echo "!!! e$E-A KEINE DATEI $(date -u +%H:%M:%S)" >> $Z/../lauf.log
done
echo "VORZIEHEN FERTIG" >> $Z/../lauf.log
