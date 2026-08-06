#!/usr/bin/env bash
# NACHSTAND — ein eingefrorener Stand des ARBEITSBAUMS auf eigenem Hafen.
#
#   werkbank/schuss/rahmen-w10/nachstand.sh [hafen]
#
# WARUM ES DAS NEBEN messstand.sh GIBT:
# `aufsicht/messstand.sh` friert einen COMMIT ein (`git archive`). Der Builder
# darf in diesem Lauf nicht committen — „niemals git add, git commit, git push".
# Ein Nachher-Stand kann also kein Commit sein. Er darf aber trotzdem kein
# wandernder Arbeitsbaum sein: „Eine Zahl auf einem wandernden Ziel ist keine
# Messung."
#
# Also derselbe Gedanke, andere Quelle: der Arbeitsbaum wird EINMAL kopiert,
# bekommt eine Marke aus seiner eigenen Pruefsumme, und der Server liefert nur
# noch die Kopie aus. Wer waehrend der Messung weiterschreibt, aendert die
# Messung nicht mehr — und die Marke sagt hinterher, welche Fassung gemessen
# wurde.
set -uo pipefail
cd "$(dirname "$0")/../../.."

HAFEN=${1:-8921}
# Die Marke: Pruefsumme ueber alle ausgelieferten Spieldateien.
MARKE=$(find spiel -type f \( -name '*.js' -o -name '*.css' -o -name '*.html' \) \
        | LC_ALL=C sort | xargs md5sum | md5sum | cut -c1-12)
ORT=/tmp/nachstand/$MARKE

if [ ! -f "$ORT/spiel/index.html" ]; then
  rm -rf "$ORT"
  mkdir -p "$ORT"
  cp -a spiel "$ORT/spiel"
fi
echo "$MARKE" > "$ORT/.nachstand-marke"

ist_richtig() {
  [ "$(curl -s -m 5 "http://127.0.0.1:$HAFEN/.nachstand-marke" 2>/dev/null)" = "$MARKE" ]
}

if ist_richtig; then
  echo "NACHSTAND $MARKE steht bereits auf http://127.0.0.1:$HAFEN/spiel/"
  exit 0
fi

if curl -s -o /dev/null -m 3 "http://127.0.0.1:$HAFEN/"; then
  PID=""
  if command -v fuser >/dev/null 2>&1; then
    PID=$(fuser -n tcp "$HAFEN" 2>/dev/null | tr -s ' ' '\n' | grep -E '^[0-9]+$' | head -1)
  fi
  [ -n "$PID" ] && kill "$PID" 2>/dev/null && sleep 1
fi

( cd "$ORT" && setsid nohup python3 -m http.server "$HAFEN" --bind 127.0.0.1 \
    >>/tmp/nachstand-$HAFEN.log 2>&1 </dev/null & disown ) >/dev/null 2>&1
sleep 2

if ist_richtig; then
  echo "NACHSTAND $MARKE auf http://127.0.0.1:$HAFEN/spiel/  (Fassung geprueft)"
  exit 0
fi
echo "NACHSTAND FEHLGESCHLAGEN: Hafen $HAFEN liefert NICHT $MARKE aus." >&2
exit 1
