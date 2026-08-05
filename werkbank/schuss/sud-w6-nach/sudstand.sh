#!/usr/bin/env bash
# SUDSTAND — mein eigenes Geraet neben messstand.sh (Sperrliste 7).
#
# messstand.sh kann nur COMMITS ausliefern (git archive); ein Builder misst
# seinen ARBEITSBAUM und darf git nicht anfassen. Dies friert den Baum als
# Kopie ein, legt dieselbe Marke, die messstand.sh eingefuehrt hat, und
# PRUEFT AM ENDE, ob der Hafen sie wirklich ausliefert.
#
# Es liegt unter werkbank/ und nicht im scratchpad, weil der scratchpad zwei
# Container-Resets nicht ueberlebt hat und das hier committet wird.
#
#   werkbank/schuss/sud-w6-nach/sudstand.sh [hafen]
set -uo pipefail
HAFEN=${1:-8951}
QUELLE=/home/user/brewhousesim
ORT=/tmp/sudstand
mkdir -p "$ORT"; rm -rf "$ORT/spiel"; cp -a "$QUELLE/spiel" "$ORT/spiel"
MARKE=$(md5sum "$QUELLE/spiel/stuecke/sud.js" "$QUELLE/spiel/stuecke/sud-daten.js" \
        "$QUELLE/spiel/stil/sud.css" "$QUELLE/spiel/stil/sud-zusatz.css" \
        "$QUELLE/spiel/stil/grund.css" | md5sum | cut -c1-12)
echo "$MARKE" > "$ORT/.messstand-marke"
ist() { [ "$(curl -s -m 5 "http://127.0.0.1:$HAFEN/.messstand-marke" 2>/dev/null)" = "$MARKE" ]; }
if ! ist; then
  if curl -s -o /dev/null -m 3 "http://127.0.0.1:$HAFEN/"; then
    for p in /proc/[0-9]*; do c=$(tr '\0' ' ' < "$p/cmdline" 2>/dev/null)
      case "$c" in *http.server*" $HAFEN"*) kill "${p#/proc/}" 2>/dev/null; break;; esac; done
    sleep 1
  fi
  ( cd "$ORT" && setsid nohup python3 -m http.server "$HAFEN" --bind 127.0.0.1 \
      >>/tmp/sudstand-$HAFEN.log 2>&1 </dev/null & disown ) >/dev/null 2>&1
  sleep 2
fi
ist && { echo "SUDSTAND $MARKE auf http://127.0.0.1:$HAFEN/spiel/ (Fassung geprueft)"; exit 0; }
echo "SUDSTAND FEHLGESCHLAGEN: Hafen $HAFEN liefert NICHT $MARKE aus." >&2; exit 1
