#!/usr/bin/env bash
# Gegenmessung der Aufsicht zu Welle 12 — eigener Stand, eigener Hafen.
# Der Builder hat an Hafen 8950 gemessen; diese Probe traut dem nicht, sondern
# friert HEAD selbst ein. spiel/ ist gegen 813f776 byteweise gleich (geprueft),
# also MUESSEN dieselben Zahlen herauskommen. Tun sie es nicht, ist eine der
# beiden Messungen falsch — und das waere der wichtigere Befund.
cd "$(dirname "$0")/../../../.."
Z=werkbank/schuss/aufsicht/welle12-gegen/rho
M=$(curl -s -m 5 http://127.0.0.1:8911/.messstand-marke)
[ -z "$M" ] && { echo "!!! Hafen 8911 tot" >> $Z/../lauf.log; exit 1; }
mkdir -p $Z
for S in "1 A" "2 A" "1 B" "3 A" "1 C" "4 A"; do
  set -- $S; E=$1; L=$2
  [ -s $Z/e$E-$L.json ] && continue
  HAFEN=8911 MESSFENSTER_WARTE=7200 werkbank/schuss/aufsicht/messfenster.sh \
    node werkbank/schuss/rueckkopplung-r3/linie.mjs $E 400 $Z/e$E-$L.json >> $Z/../lauf.log 2>&1
  [ -s $Z/e$E-$L.json ] && echo "--- e$E-$L OK ($M) $(date -u +%H:%M:%S)" >> $Z/../lauf.log \
                        || echo "!!! e$E-$L KEINE DATEI" >> $Z/../lauf.log
done
echo "GEGENMESSUNG FERTIG" >> $Z/../lauf.log
