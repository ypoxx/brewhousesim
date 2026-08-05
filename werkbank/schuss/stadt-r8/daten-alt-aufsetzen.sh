#!/usr/bin/env bash
# HAFEN 8896 — derselbe Baum, nur stadt-daten.js im Stand VOR der Nacharbeit
# zu Auflage 1 und 6. Damit ist "vorher/nachher" ein A/B im selben Augenblick
# und nicht ein Vergleich ueber eine halbe Stunde, in der andere Stuecke bauen.
#
# Warum ein zweiter Wald neben hafen-alt: der dort liegt die ALTE stadt.js,
# und die holt `bild/hof/*.png` — die Dateien gibt es seit der WebP-Umstellung
# nicht mehr. Ein Hafen, der die Hofbilder gar nicht laedt, misst keine
# Hofdecke, sondern eine leere Platte.
set -uo pipefail
cd "$(dirname "$0")/../../.."
WURZEL=$(pwd)
BAUM=werkbank/schuss/stadt-r8/hafen-daten-alt

node werkbank/schuss/stadt-r8/daten-alt-bauen.mjs || exit 1

rm -rf "$BAUM"
mkdir -p "$BAUM/spiel/stuecke"
for e in "$WURZEL"/*; do
  n=$(basename "$e"); [ "$n" = "spiel" ] && continue
  ln -sfn "$e" "$BAUM/$n"
done
for e in "$WURZEL"/spiel/*; do
  n=$(basename "$e"); [ "$n" = "stuecke" ] && continue
  ln -sfn "$e" "$BAUM/spiel/$n"
done
for e in "$WURZEL"/spiel/stuecke/*; do
  n=$(basename "$e"); [ "$n" = "stadt-daten.js" ] && continue
  ln -sfn "$e" "$BAUM/spiel/stuecke/$n"
done
cp werkbank/schuss/stadt-r8/stadt-daten-vor-r8.js "$BAUM/spiel/stuecke/stadt-daten.js"

if fuser -n tcp 8896 >/dev/null 2>&1; then
  echo "8896 belegt (PID $(fuser -n tcp 8896 2>/dev/null)) — nicht neu gestartet."
else
  (cd "$BAUM" && setsid python3 -m http.server 8896 </dev/null >/dev/null 2>&1 &)
  sleep 1.5
fi
echo "8896: HTTP $(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8896/spiel/)"
echo "stadt-daten 8896 $(curl -s http://127.0.0.1:8896/spiel/stuecke/stadt-daten.js | md5sum | cut -c1-8)  8899 $(curl -s http://127.0.0.1:8899/spiel/stuecke/stadt-daten.js | md5sum | cut -c1-8)"
echo "stadt.js    8896 $(curl -s http://127.0.0.1:8896/spiel/stuecke/stadt.js | md5sum | cut -c1-8)  8899 $(curl -s http://127.0.0.1:8899/spiel/stuecke/stadt.js | md5sum | cut -c1-8)"
