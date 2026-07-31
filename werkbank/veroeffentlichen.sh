#!/usr/bin/env bash
# Schiebt den Stand des laufenden Gauntlet Loops regelmaessig nach GitHub, damit
# Netlify die Fortschrittsseite neu baut und der Auftraggeber vom Handy zusehen
# kann, ohne dass jemand nachfragt.
#
# Die Agenten im Lauf duerfen selbst nicht committen — parallele Schreiber
# zerlegen sonst den Git-Index. Also tut es dieser eine Prozess, unter einer
# Sperre, die sich die Aufsicht mit ihm teilt.
#
#   werkbank/veroeffentlichen.sh [sekunden-zwischen-laeufen] [gesamtdauer-sekunden]
#
# Standard: alle 3 Minuten, hoechstens 5 Stunden.

set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

TAKT=${1:-180}
ENDE=$(( $(date +%s) + ${2:-18000} ))
ZWEIG=$(git rev-parse --abbrev-ref HEAD)
SPERRE=werkbank/.gitsperre

echo "veroeffentliche $ZWEIG alle ${TAKT}s"

while [ "$(date +%s)" -lt "$ENDE" ]; do
  sleep "$TAKT"

  (
    flock -w 120 9 || exit 0

    git add -A -- werkbank/stand.json werkbank/schuss spiel 2>/dev/null
    if git diff --cached --quiet; then
      exit 0
    fi

    STUECKE=$(python3 -c "
import json,pathlib
p = pathlib.Path('werkbank/stand.json')
d = json.loads(p.read_text()) if p.is_file() else {}
s = d.get('stuecke', [])
fertig = sum(1 for x in s if x.get('status') == 'bestanden')
print(f\"{d.get('phase','')} — {fertig}/{len(s)} bestanden\" if s else d.get('phase',''))
" 2>/dev/null || echo "Stand des Laufs")

    git -c user.name="Claude" -c user.email="noreply@anthropic.com" \
        commit -q -m "Werkbank: ${STUECKE}" \
        -m "Automatischer Zwischenstand des laufenden Gauntlet Loops." \
        -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"

    for i in 1 2 3 4; do
      git push -q origin "$ZWEIG" 2>/dev/null && break
      sleep $(( 2 ** i ))
    done
  ) 9>"$SPERRE"
done

echo "fertig"
