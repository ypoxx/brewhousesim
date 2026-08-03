#!/usr/bin/env bash
# EIGENER HAFEN — ein eingefrorener Stand auf einem eigenen Port.
#
#   werkbank/schuss/preis-kritik-w5/hafen.sh <commit> [hafen]
#
# WARUM DIESE DATEI NEBEN `werkbank/schuss/aufsicht/messstand.sh` STEHT:
# `messstand.sh` braucht `ss` (iproute2), und `ss` ist in diesem Container
# NICHT INSTALLIERT. Unter `set -euo pipefail` reisst die Zeile
#
#     PID=$(ss -lptn "sport = :$HAFEN" ... | grep -o 'pid=[0-9]*' | head -1 ...)
#
# das Skript ab, BEVOR es den Server auf den verlangten Commit umstellt.
# Der Aufruf endet mit Exit 1 — und auf Hafen 8900 laeuft weiter, was vorher
# dort lief. Am 3.8.2026 war das `/tmp/messstand/3e6d08c`, ein Stand von VOR
# dem Bau dieser Welle. Wer den Exit-Code nicht prueft, misst eine Stunde lang
# den falschen Commit. (Genau das ist hier passiert; die Zahlen wurden
# verworfen und neu gemessen.)
#
# Dieser Hafen prueft nach dem Hochfahren, dass die AUSGELIEFERTE Datei mit dem
# Commit uebereinstimmt — nicht nur, dass irgendetwas antwortet.
set -euo pipefail
cd "$(dirname "$0")/../../.."
WAS=${1:-HEAD}
HAFEN=${2:-8906}
SHA=$(git rev-parse --short "$WAS")
ORT=/tmp/preis-kritik-w5/$SHA

mkdir -p "$ORT"
[ -f "$ORT/spiel/index.html" ] || git archive "$WAS" | tar -x -C "$ORT"

if ! curl -s -o /dev/null -m 2 "http://127.0.0.1:$HAFEN/spiel/"; then
  (cd "$ORT" && setsid nohup python3 -m http.server "$HAFEN" --bind 127.0.0.1 \
     >/tmp/preis-kritik-w5-$HAFEN.log 2>&1 </dev/null & disown)
  sleep 2
fi

# DIE PROBE, die messstand.sh fehlt: stimmt die ausgelieferte Datei mit dem
# Commit ueberein? Drei Dateien, nicht eine.
for D in spiel/stuecke/preis.js spiel/kern/welt.js spiel/kern/buehne.js; do
  A=$(curl -s "http://127.0.0.1:$HAFEN/$D" | sha1sum | cut -d' ' -f1)
  B=$(git show "$SHA:$D" | sha1sum | cut -d' ' -f1)
  if [ "$A" != "$B" ]; then
    echo "HAFEN $HAFEN liefert NICHT $SHA — $D weicht ab ($A != $B)"
    exit 1
  fi
done
echo "HAFEN $HAFEN traegt $SHA — drei Dateien gegengeprueft. http://127.0.0.1:$HAFEN/spiel/"
