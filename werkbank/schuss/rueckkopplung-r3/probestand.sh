#!/usr/bin/env bash
# PROBESTAND — der eingefrorene Stand des Kritikers PLUS ausschliesslich die
# Dateien dieses Stuecks. Auf Hafen 8901.
#
#   werkbank/schuss/rueckkopplung-r3/probestand.sh
#
# Warum: Der Arbeitsbaum auf 8899 traegt gleichzeitig die Arbeit von DER SUD
# und DER KLANG. DER SUD hat gemeldet, dass der Gaerraum sich jetzt als
# art:'bau' meldet und damit in Wochen ohne umkaempften Zug den NENNER der
# Kennzahl stellen kann — wer dort misst, misst zwei Aenderungen auf einmal
# und kann keiner von beiden eine Zahl zuschreiben. Der Messstand auf 8900
# traegt umgekehrt den Stand des Kritikers OHNE meine Aenderung.
#
# Der Probestand ist die Differenz von genau einer Sache: da7d690 plus
# preis.js, preis-daten.js und preis-zusatz.css aus dem Arbeitsbaum.
set -euo pipefail
cd "$(dirname "$0")/../../.."
SHA=${1:-da7d690}
QUELLE=/tmp/messstand/$SHA
ORT=/tmp/probestand
HAFEN=8901

[ -d "$QUELLE" ] || { echo "Messstand $SHA fehlt — erst werkbank/schuss/aufsicht/messstand.sh $SHA"; exit 1; }

rm -rf "$ORT"
mkdir -p "$ORT"
cp -a "$QUELLE"/. "$ORT"/
cp spiel/stuecke/preis.js        "$ORT"/spiel/stuecke/preis.js
cp spiel/stuecke/preis-daten.js  "$ORT"/spiel/stuecke/preis-daten.js
cp spiel/stil/preis-zusatz.css   "$ORT"/spiel/stil/preis-zusatz.css

echo "Unterschied zum Messstand $SHA:"
diff -rq "$QUELLE"/spiel "$ORT"/spiel || true

PID=$(ss -lptn "sport = :$HAFEN" 2>/dev/null | grep -o 'pid=[0-9]*' | head -1 | cut -d= -f2)
[ -n "${PID:-}" ] && kill "$PID" 2>/dev/null && sleep 1
(cd "$ORT" && exec 1>/dev/null 2>&1; setsid nohup python3 -m http.server "$HAFEN" >/tmp/probestand.log 2>&1 </dev/null & disown)
sleep 2
curl -s -o /dev/null -m 3 "http://127.0.0.1:$HAFEN/spiel/" \
  && echo "PROBESTAND $SHA + preis*.js auf http://127.0.0.1:$HAFEN/spiel/" \
  || { echo "PROBESTAND kam nicht hoch"; exit 1; }
