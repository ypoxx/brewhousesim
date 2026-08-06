#!/usr/bin/env bash
# NACHSTAND DER FUHRE — der Vorzustand 7896ee6 PLUS ausschliesslich die
# Dateien dieses Stuecks.
#
#   werkbank/schuss/fuhre-w11/nachstand.sh [hafen]
#
# WARUM NICHT DER GANZE ARBEITSBAUM: in dieser Welle bauen DREI Builder
# gleichzeitig am selben Baum (DAS ERBE, DER GEGNER, DIE FUHRE). Ein
# Nachstand aus dem Arbeitsbaum wuerde deren Aenderungen mitmessen, und die
# Gesamtdeckung stuende dann fuer alle drei zusammen. Die Auflage verlangt
# aber, dass jeder meldet, was ER bewegt hat.
#
# Also: `git archive 7896ee6` (derselbe Vorzustand, gegen den gemessen wird)
# und darueber NUR `stuecke/fuhre*.js` und `stil/fuhre*.css` aus dem
# Arbeitsbaum. Das ist derselbe Gedanke wie
# `aufsicht/welle8-trennprobe/aufsetzen.sh` — .js UND .css, das war dort der
# Fehler beim ersten Anlauf.
#
# Die Marke traegt die Pruefsumme der eingespielten Stueckdateien, damit
# hinterher feststeht, welche Fassung gemessen wurde.
set -uo pipefail
cd "$(dirname "$0")/../../.."

HAFEN=${1:-8952}
GRUND=${GRUND:-7896ee6}
SHA=$(git rev-parse --short "$GRUND") || { echo "Unbekannter Commit: $GRUND" >&2; exit 1; }
MARKE=$SHA+$(LC_ALL=C ls spiel/stuecke/fuhre*.js spiel/stil/fuhre*.css | LC_ALL=C sort \
             | xargs md5sum | md5sum | cut -c1-10)
ORT=/tmp/fuhrestand/$MARKE

if [ ! -f "$ORT/spiel/index.html" ]; then
  rm -rf "$ORT"
  mkdir -p "$ORT"
  git archive "$SHA" | tar -x -C "$ORT" || { echo "git archive fehlgeschlagen" >&2; exit 1; }
  cp -a spiel/stuecke/fuhre*.js "$ORT/spiel/stuecke/"
  cp -a spiel/stil/fuhre*.css   "$ORT/spiel/stil/"
fi
echo "$MARKE" > "$ORT/.fuhrestand-marke"

ist_richtig() {
  [ "$(curl -s -m 5 "http://127.0.0.1:$HAFEN/.fuhrestand-marke" 2>/dev/null)" = "$MARKE" ]
}

if ist_richtig; then
  echo "FUHRESTAND $MARKE steht bereits auf http://127.0.0.1:$HAFEN/spiel/"
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
    >>/tmp/fuhrestand-$HAFEN.log 2>&1 </dev/null & disown ) >/dev/null 2>&1
sleep 2

if ist_richtig; then
  echo "FUHRESTAND $MARKE auf http://127.0.0.1:$HAFEN/spiel/  (Fassung geprueft)"
  exit 0
fi
echo "FUHRESTAND FEHLGESCHLAGEN: Hafen $HAFEN liefert NICHT $MARKE aus." >&2
exit 1
