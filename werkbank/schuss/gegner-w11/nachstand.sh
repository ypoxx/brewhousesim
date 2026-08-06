#!/usr/bin/env bash
# NACHSTAND DES GEGNERS — der Vorzustand, und darin NUR meine Dateien neu.
#
#   werkbank/schuss/gegner-w11/nachstand.sh [hafen]
#
# WARUM NICHT rahmen-w10/nachstand.sh:
# Das kopiert den ganzen Arbeitsbaum. In dieser Welle arbeiten DREI Builder
# gleichzeitig im selben Baum — DAS ERBE, DER GEGNER, DIE FUHRE. Eine Kopie
# des Baums enthaelt also auch den halbfertigen Stand der beiden anderen, und
# jede Zahl daraus waere eine Mischung. Beim ersten Versuch am Arbeitsbaum war
# das sofort zu sehen: der Reiter „Das Erbe" fehlte in der Reiterzeile und
# `pruefe()` nannte DAS ERBE nicht mehr — beides nicht meine Arbeit.
#
# Deshalb derselbe Gedanke wie in aufsicht/welle8-trennprobe/aufsetzen.sh:
# ein Mischstand aus dem eingefrorenen Vorzustand und GENAU den vier Dateien,
# die mir gehoeren. `.js` UND `.css` — das war der Fehler beim ersten Anlauf
# der Trennprobe und steht deshalb ausdruecklich in WELLE-11.md.
#
#   spiel/stuecke/gegner.js · gegner-daten.js · gegner-zusatz.js
#   spiel/stil/gegner.css   · gegner-zusatz.css
#
# Die Marke traegt den Vorzustand UND die Pruefsumme meiner Dateien: ein
# Mischstand darf nie mit einem echten Messstand verwechselt werden, und die
# Zahl muss hinterher sagen, welche Fassung gemessen wurde.
set -uo pipefail
cd "$(dirname "$0")/../../.."

VOR=${VOR:-7896ee6}
HAFEN=${1:-8962}
MEIN=$(ls spiel/stuecke/gegner*.js spiel/stil/gegner*.css | LC_ALL=C sort)
MARKE="$VOR+gegner-$(echo "$MEIN" | xargs md5sum | md5sum | cut -c1-12)"
ORT=/tmp/gegner-w11/$(echo "$MARKE" | tr '+' '_')

if [ ! -f "$ORT/spiel/index.html" ]; then
  rm -rf "$ORT"; mkdir -p "$ORT"
  git archive "$VOR" | tar -x -C "$ORT" || { echo "git archive fehlgeschlagen" >&2; exit 1; }
  for p in $MEIN; do cp "$p" "$ORT/$p" || exit 1; done
fi
echo "$MARKE" > "$ORT/.messstand-marke"

ist_richtig() {
  [ "$(curl -s -m 5 "http://127.0.0.1:$HAFEN/.messstand-marke" 2>/dev/null)" = "$MARKE" ]
}

if ist_richtig; then
  echo "NACHSTAND $MARKE steht bereits auf http://127.0.0.1:$HAFEN/spiel/"
  exit 0
fi

# Nur den Prozess treffen, der wirklich auf DIESEM Hafen horcht — nie
# `pkill -f` mit Muster, das erschlaegt die eigene Shell (am 2.8. passiert).
if curl -s -o /dev/null -m 3 "http://127.0.0.1:$HAFEN/"; then
  PID=""
  command -v fuser >/dev/null 2>&1 &&
    PID=$(fuser -n tcp "$HAFEN" 2>/dev/null | tr -s ' ' '\n' | grep -E '^[0-9]+$' | head -1)
  [ -n "$PID" ] && kill "$PID" 2>/dev/null && sleep 1
fi

( cd "$ORT" && setsid nohup python3 -m http.server "$HAFEN" --bind 127.0.0.1 \
    >>/tmp/gegner-nachstand-$HAFEN.log 2>&1 </dev/null & disown ) >/dev/null 2>&1
sleep 2

if ist_richtig; then
  echo "NACHSTAND $MARKE auf http://127.0.0.1:$HAFEN/spiel/  (Fassung geprueft)"
  exit 0
fi
echo "NACHSTAND FEHLGESCHLAGEN: Hafen $HAFEN liefert NICHT $MARKE aus." >&2
exit 1
