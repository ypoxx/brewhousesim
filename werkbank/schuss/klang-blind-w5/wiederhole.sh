#!/usr/bin/env bash
# Drei Durchgaenge ueber dieselben acht Proben, NACHEINANDER.
#
# Warum nicht parallel: vier gleichzeitige Anfragen haben am 3.8. die
# Tagesmenge des Hausmodells (gemini-3.1-pro-preview, 250/Tag) aufgebraucht
# und 22 von 24 Antworten als leere Dateien zurueckgelassen. Eine Messung,
# die am Kontingent scheitert, ist keine Messung ueber das Spiel.
#
# Warum ein anderes Modell: dieselbe Tagesmenge war danach erschoepft. Das
# ZWEITE OHR steht deshalb ausdruecklich als zweites Ohr im Urteil, nicht als
# Ersatz fuer das erste.
set -u
cd "$(dirname "$0")"
MODELL=${MODELL:-gemini-3.6-flash}
mkdir -p durchgang2
for pass in a b c; do
  for f in blind/probe-*.wav; do
    n=$(basename "$f" .wav)
    z="durchgang2/$pass-$n.json"
    [ -s "$z" ] && [ "$(stat -c%s "$z")" -gt 60 ] && continue
    MODELL="$MODELL" timeout 300 python3 frage-epoche.py "$f" > "$z" 2>/dev/null
    [ "$(stat -c%s "$z")" -lt 60 ] && rm -f "$z"
    sleep 2
  done
  echo "Durchgang $pass fertig"
done
