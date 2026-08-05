#!/usr/bin/env bash
# DEN VORHER-HAFEN HERSTELLEN — ein Aufruf, nach jedem Container-Reset.
#
#   werkbank/schuss/stadt-w8/hafen-vor-aufsetzen.sh [hafen]
#
# Baut `stadt-w8/hafen-vor/` als Symlinkwald auf den Arbeitsbaum, in dem NUR
# die fuenf STADT-Dateien aus `stadt-w8/vor/` (Stand 76f3ca4) alt sind, und
# startet darauf einen http-server. Alles uebrige ist dieselbe Datei wie im
# Arbeitsbaum — damit ist jedes Vorher/Nachher ein A/B im selben Augenblick.
#
# "Zweimal von Hand ist einmal zu oft" (LAUFENDER-AUFTRAG, 5. August). Und:
# kein Skript meldet Erfolg, ohne das Ergebnis anzusehen — deshalb prueft es
# am Ende, ob der Hafen wirklich die ALTE stadt.css ausliefert.
set -uo pipefail
cd "$(dirname "$0")/../../.."
HAFEN=${1:-8908}
W=werkbank/schuss/stadt-w8/hafen-vor
BAUM=$(pwd)

rm -rf "$W/spiel"
mkdir -p "$W/spiel/stuecke" "$W/spiel/stil"
for f in "$BAUM"/spiel/*; do
  n=$(basename "$f")
  [ "$n" = stuecke ] || [ "$n" = stil ] || ln -sfn "$f" "$W/spiel/$n"
done
for f in "$BAUM"/spiel/stuecke/*; do ln -sfn "$f" "$W/spiel/stuecke/$(basename "$f")"; done
for f in "$BAUM"/spiel/stil/*;    do ln -sfn "$f" "$W/spiel/stil/$(basename "$f")"; done
for f in "$BAUM"/werkbank/schuss/stadt-w8/vor/*; do
  n=$(basename "$f")
  case "$n" in
    *.css) ln -sfn "$f" "$W/spiel/stil/$n" ;;
    *.js)  ln -sfn "$f" "$W/spiel/stuecke/$n" ;;
  esac
done

if fuser -n tcp "$HAFEN" >/dev/null 2>&1; then
  echo "Hafen $HAFEN ist schon belegt — nichts gestartet."
else
  ( cd "$W" && nohup npx --yes http-server -p "$HAFEN" -s . >/dev/null 2>&1 & )
  sleep 6
fi

# Gegenprobe: die ALTE Werkbank lag unten. Steht `bottom: 0.7%` drin, ist es
# der Vorher-Stand; steht `top: 7.8%` drin, liefert der Hafen den Arbeitsbaum
# und jede Messung daran waere wertlos.
CSS=$(curl -s -m 5 "http://127.0.0.1:$HAFEN/spiel/stil/stadt.css")
if printf '%s' "$CSS" | grep -q 'bottom: 0.7%'; then
  echo "Hafen $HAFEN steht und liefert den Stand VOR Welle 8."
else
  echo "!!! Hafen $HAFEN liefert NICHT den Vorher-Stand — nicht messen." >&2
  exit 1
fi
