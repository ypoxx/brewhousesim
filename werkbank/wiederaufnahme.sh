#!/usr/bin/env bash
# WIEDERAUFNAHME — stellt den laufenden Gauntlet Loop nach einem Container-Reset her.
#
#   werkbank/wiederaufnahme.sh          # prüfen und herstellen
#   werkbank/wiederaufnahme.sh --pruefe # nur berichten, nichts anfassen
#
# Warum es das gibt: Der Container wird regelmäßig zurückgesetzt. `git reset --hard`
# holt die DATEIEN zurück — aber nicht die laufenden Prozesse, und nicht das Wissen
# darüber, welche es überhaupt gab. Am 2. August ist genau das passiert: der Stand auf
# der Fortschrittsseite blieb vier Stunden lang auf einem Befund stehen, der schon
# widerlegt war, und der Veröffentlicher lief nicht mehr, während vier Builder
# arbeiteten, die selbst kein git dürfen.
#
# Alles hier ist idempotent. Zweimal laufen lassen schadet nie.

set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

ZWEIG=claude/brauhaus-imperium-sim-163s85
HAFEN=8899
NUR_PRUEFEN=0
[ "${1:-}" = "--pruefe" ] && NUR_PRUEFEN=1

ok()   { printf '  \033[32m✓\033[0m %s\n' "$*"; }
tat()  { printf '  \033[33m→\033[0m %s\n' "$*"; }
weh()  { printf '  \033[31m✗\033[0m %s\n' "$*"; }

echo "WIEDERAUFNAHME — $(date -u '+%Y-%m-%d %H:%M UTC')"

# ---------------------------------------------------------------- 1 · der Baum
if [ ! -d werkbank ] || [ ! -d spiel/stuecke ]; then
  weh "Arbeitsbaum fehlt — hole $ZWEIG"
  [ $NUR_PRUEFEN -eq 1 ] || { git fetch origin "$ZWEIG" && git reset --hard "origin/$ZWEIG"; }
else
  ok "Arbeitsbaum steht ($(git rev-parse --short HEAD))"
fi

# ------------------------------------------------------- 2 · nicht gesicherte Arbeit
OFFEN=$(git status --short | wc -l)
if [ "$OFFEN" -gt 0 ]; then
  weh "$OFFEN Datei(en) uncommittet — die Builder dürfen kein git, also muss die Aufsicht"
  git status --short | sed 's/^/      /'
  echo "      → erst prüfen (alle vier Epochen laden, BRAUHAUS.lage 0), dann:"
  echo "        flock werkbank/.gitsperre bash -c 'git add -A && git commit -F <datei> && git push'"
else
  ok "nichts liegt herum"
fi
VORAUS=$(git rev-list --count "origin/$ZWEIG..HEAD" 2>/dev/null || echo '?')
[ "$VORAUS" = "0" ] && ok "origin ist auf Stand" || weh "$VORAUS Commit(s) noch nicht gepusht"

# ------------------------------------------------- 3 · verwaiste Git-Sperre lösen
if [ -f .git/index.lock ] && ! pgrep -x git >/dev/null 2>&1; then
  weh ".git/index.lock liegt verwaist da (kein git-Prozess)"
  [ $NUR_PRUEFEN -eq 1 ] || { rm -f .git/index.lock && tat "entfernt"; }
fi

# ----------------------------------------------------------- 4 · der Webserver
# Die Kritiker spielen das Spiel über http; ohne ihn misst niemand etwas.
if curl -s -o /dev/null -m 3 "http://127.0.0.1:$HAFEN/spiel/"; then
  ok "Server auf :$HAFEN"
else
  weh "Server auf :$HAFEN antwortet nicht"
  if [ $NUR_PRUEFEN -eq 0 ]; then
    (setsid nohup python3 -m http.server "$HAFEN" >/tmp/srv.log 2>&1 </dev/null &)
    sleep 2
    curl -s -o /dev/null -m 3 "http://127.0.0.1:$HAFEN/spiel/" && tat "gestartet" || weh "Start fehlgeschlagen"
  fi
fi

# ------------------------------------------------------- 5 · der Veröffentlicher
# Der einzige Prozess, der pushen darf. Ohne ihn steht die Fortschrittsseite still,
# während der Lauf weiterarbeitet — und beim nächsten Reset ist alles weg.
ANZ=$(pgrep -fc 'veroeffentlichen\.sh' 2>/dev/null || echo 0)
if [ "$ANZ" -eq 1 ]; then
  ok "Veröffentlicher läuft"
elif [ "$ANZ" -gt 1 ]; then
  weh "$ANZ Veröffentlicher — die jüngeren gezielt per PID beenden, nie pkill mit Muster"
  pgrep -f 'veroeffentlichen\.sh' | sed 's/^/      PID /'
else
  weh "kein Veröffentlicher"
  [ $NUR_PRUEFEN -eq 1 ] || {
    (setsid nohup ./werkbank/veroeffentlichen.sh 180 14400 >/tmp/pub.log 2>&1 </dev/null &)
    sleep 3; tat "gestartet (Takt 180 s, Laufzeit 4 h)"
  }
fi

# ------------------------------------------------------------ 6 · der Auftrag
echo
if [ -f werkbank/LAUFENDER-AUFTRAG.md ]; then
  ok "Auftrag steht in werkbank/LAUFENDER-AUFTRAG.md — DIESE DATEI JETZT LESEN"
  sed -n '/^## Wo der Lauf steht/,/^## /p' werkbank/LAUFENDER-AUFTRAG.md | head -20 | sed 's/^/      /'
else
  weh "werkbank/LAUFENDER-AUFTRAG.md fehlt — ohne ihn weiß niemand, was der Lauf tut"
fi

echo
echo "  Stand der Fortschrittsseite: $(python3 -c "import json;print(json.load(open('werkbank/stand.json'))['stand'])" 2>/dev/null || echo '?')"
echo "  Ist er älter als ein paar Stunden, ist er gelogen: ./werkbank/stand.py phase \"...\""
