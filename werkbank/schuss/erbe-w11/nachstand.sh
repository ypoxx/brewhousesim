#!/usr/bin/env bash
# NACHSTAND — der Vorzustand 7896ee6 PLUS ausschliesslich den Dateien DES
# ERBE aus dem Arbeitsbaum. Nichts sonst.
#
#   werkbank/schuss/erbe-w11/nachstand.sh [hafen]
#
# WARUM NICHT DER ARBEITSBAUM: in dieser Welle bauen drei Builder
# gleichzeitig. `git status -- spiel/` zeigt beim Schreiben dieser Zeile
# `stuecke/erbe.js`, `stuecke/fuhre.js` und `stuecke/gegner.js` als geaendert.
# Eine Zahl, die auf dem Arbeitsbaum erhoben ist, misst alle drei — und sie
# wandert, weil die anderen beiden weiterschreiben. Beim ersten Anlauf hat
# mich das eine Runde gekostet: `haushalt.ueberRand()` meldete in 1884 und
# 1970 je einen Kasten, der auf dem Vorzustand nicht dastand. Er gehoerte
# nicht mir.
#
# Die Regel dahinter steht in gauntlet/WELLE-11.md: die Dateimengen der drei
# Stuecke sind zusammenhanglos, und ein einzelnes Stueck laesst sich aus einem
# Stand herausnehmen — `.js` UND `.css`, das war der Fehler beim ersten Anlauf
# der Welle-8-Trennprobe.
#
# Der Stand wird bei jedem Aufruf NEU aus dem Arbeitsbaum gefuellt und traegt
# eine Marke aus dem Vorzustand plus der Pruefsumme der eigenen Dateien —
# damit kann er nie mit einem echten Messstand verwechselt werden und nie
# veraltet ausgeliefert werden.
set -uo pipefail
cd "$(dirname "$0")/../../.."

VOR=7896ee6
HAFEN=${1:-8942}
ORT=/tmp/erbe-w11-nachstand

MEINE="spiel/stuecke/erbe.js spiel/stuecke/erbe-daten.js spiel/stuecke/erbe-zusatz.js
       spiel/stil/erbe.css spiel/stil/erbe-zusatz.css"

SUMME=$(cat $MEINE | md5sum | cut -c1-12)
MARKE="erbe-w11:$VOR+$SUMME"

rm -rf "$ORT"
mkdir -p "$ORT"
git archive "$VOR" | tar -x -C "$ORT" || { echo "git archive fehlgeschlagen" >&2; exit 1; }
for p in $MEINE; do
  [ -f "$p" ] || { echo "fehlt im Arbeitsbaum: $p" >&2; exit 1; }
  cp "$p" "$ORT/$p" || exit 1
done
echo "$MARKE" > "$ORT/.messstand-marke"

ist_richtig() {
  [ "$(curl -s -m 5 "http://127.0.0.1:$HAFEN/.messstand-marke" 2>/dev/null)" = "$MARKE" ]
}

if ! curl -s -o /dev/null -m 3 "http://127.0.0.1:$HAFEN/" 2>/dev/null; then
  ( cd "$ORT" && setsid nohup python3 -m http.server "$HAFEN" --bind 127.0.0.1 \
      >>/tmp/erbe-w11-$HAFEN.log 2>&1 </dev/null & disown ) >/dev/null 2>&1
  sleep 2
fi

for i in 1 2 3 4 5; do ist_richtig && break; sleep 1; done
if ist_richtig; then
  echo "NACHSTAND $MARKE auf http://127.0.0.1:$HAFEN/spiel/  (Fassung geprueft)"
else
  echo "FEHLER: Hafen $HAFEN liefert nicht $MARKE" >&2
  curl -s -m 5 "http://127.0.0.1:$HAFEN/.messstand-marke" >&2
  exit 1
fi
