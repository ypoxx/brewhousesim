#!/bin/sh
# Die ganze Abnahme des RAHMENS, Welle 13, in einem Zug — eigener Hafen 8921.
#   sh werkbank/schuss/rahmen-w13/alles.sh
set -e
cd /home/user/brewhousesim
export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
export HAFEN=${HAFEN:-8921}
W=werkbank/schuss/rahmen-w13

echo "=== R1  WIEDERKEHR — 12 Wochen, neu laden, Ziffer fuer Ziffer"
for e in 1 2 3 4; do node $W/wiederkehr.mjs $e 12 >$W/protokoll/wiederkehr-e$e.log 2>&1 || true; done

echo "=== R5  SPRUNGPROBE — springen gegen klicken"
for e in 1 2; do node $W/sprungprobe.mjs $e 30 >$W/protokoll/sprungprobe-e$e.log 2>&1 || true; done

echo "=== R4  GRIFFPROBE — steht der Anschlag einem Zug im Weg?"
for e in 1 2 3 4; do node $W/griffprobe.mjs $e 1600 900 >$W/protokoll/griffprobe-e$e.log 2>&1 || true; done

echo "=== KOSTEN — was das Sichern im Zeichenweg kostet"
node $W/kosten.mjs 1 30 >$W/protokoll/kosten-e1.log 2>&1 || true

echo "=== R2  NEUPROBE — dreimal dieselbe Adresse im selben Kontext (E1, Nachlauf am Endstand)"
node $W/neuprobe.mjs 1 30 >$W/protokoll/neuprobe-e1.log 2>&1 || true

echo "=== SCHUSS — vier Epochen, Entwurfsleinwand"
for e in 1 2 3 4; do
  node werkbank/schuss.mjs "http://127.0.0.1:$HAFEN/spiel/?epoche=$e" \
    werkbank/schuss/welle13-rahmen-e$e.png 2752 1536
done
echo "=== fertig"
