#!/usr/bin/env bash
# EIGENSTAND — ein eingefrorener Stand aus dem ARBEITSBAUM, auf eigenem Hafen.
#
#   werkbank/schuss/stadt-w9/eigenstand.sh [hafen]
#
# WARUM ES DAS NEBEN messstand.sh GIBT: `messstand.sh` friert einen COMMIT
# ein (`git archive`). Ein Builder darf in diesem Lauf nicht committen — er
# haette also entweder keinen eingefrorenen Stand oder muesste im
# wandernden Arbeitsbaum messen. Beides ist verboten bzw. wertlos:
# "Eine Zahl auf einem wandernden Ziel ist keine Messung."
#
# Also dasselbe Verfahren ohne Commit: der Arbeitsbaum wird KOPIERT, die
# Kopie bekommt eine Marke aus der Pruefsumme aller ausgelieferten Dateien
# unter spiel/, und der Server auf dem Hafen wird gegen genau diese Marke
# geprueft. Schreibt jemand waehrend der Messung im Arbeitsbaum, aendert das
# an der Kopie nichts — und die Marke sagt hinterher, welche Fassung
# gemessen wurde.
#
# Die Marke steht in /tmp/stadt-w9-stand/<marke>/.messstand-marke und wird,
# wie bei messstand.sh, VOM SERVER zurueckgelesen. Liefert er etwas anderes
# aus, schlaegt das Skript laut fehl.
set -uo pipefail
cd "$(dirname "$0")/../../.."

HAFEN=${1:-8931}
MARKE=$(find spiel -type f \( -name '*.js' -o -name '*.css' -o -name '*.html' \) -print0 \
        | sort -z | xargs -0 md5sum | md5sum | cut -c1-12)
ORT=/tmp/stadt-w9-stand/$MARKE

if [ ! -f "$ORT/spiel/index.html" ]; then
  rm -rf "$ORT"; mkdir -p "$ORT"
  # nur, was ausgeliefert wird: spiel/ ganz. Werkbank und Urteile gehoeren
  # nicht auf einen Messstand.
  cp -a spiel "$ORT/spiel" || { echo "kopieren fehlgeschlagen" >&2; exit 1; }
fi
echo "w9-$MARKE" > "$ORT/.messstand-marke"

ist_richtig() {
  [ "$(curl -s -m 5 "http://127.0.0.1:$HAFEN/.messstand-marke" 2>/dev/null)" = "w9-$MARKE" ]
}

if ist_richtig; then
  echo "EIGENSTAND w9-$MARKE steht bereits auf http://127.0.0.1:$HAFEN/spiel/"
  exit 0
fi

if curl -s -o /dev/null -m 3 "http://127.0.0.1:$HAFEN/"; then
  PID=""
  command -v fuser >/dev/null 2>&1 &&
    PID=$(fuser -n tcp "$HAFEN" 2>/dev/null | tr -s ' ' '\n' | grep -E '^[0-9]+$' | head -1)
  [ -n "$PID" ] && kill "$PID" 2>/dev/null && sleep 1
fi

( cd "$ORT" && setsid nohup python3 -m http.server "$HAFEN" --bind 127.0.0.1 \
    >>"/tmp/stadt-w9-$HAFEN.log" 2>&1 </dev/null & disown ) >/dev/null 2>&1
sleep 2

if ist_richtig; then
  echo "EIGENSTAND w9-$MARKE auf http://127.0.0.1:$HAFEN/spiel/  (Fassung geprueft)"
  exit 0
fi
echo "EIGENSTAND FEHLGESCHLAGEN: Hafen $HAFEN liefert NICHT w9-$MARKE aus." >&2
exit 1
