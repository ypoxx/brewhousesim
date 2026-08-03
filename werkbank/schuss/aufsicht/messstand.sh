#!/usr/bin/env bash
# MESSSTAND — ein eingefrorener Spielstand auf eigenem Hafen, damit die Aufsicht
# messen kann, waehrend die Builder am Arbeitsbaum schreiben.
#
#   werkbank/schuss/aufsicht/messstand.sh [commit]     # Vorgabe HEAD
#
# Warum: Am 2. August habe ich den Nenner im Arbeitsbaum gemessen, waehrend zwei
# Builder darin editierten. Eine Zahl, die auf einem wandernden Ziel steht, ist
# keine Messung — man kann sie niemandem vorhalten und niemand kann sie
# nachstellen. Der Messstand haengt an einem Commit und bleibt stehen.
set -euo pipefail
cd "$(dirname "$0")/../../.."
WAS=${1:-HEAD}
SHA=$(git rev-parse --short "$WAS")
ORT=/tmp/messstand/$SHA
HAFEN=8900

if [ ! -d "$ORT" ]; then
  mkdir -p "$ORT"
  git archive "$WAS" | tar -x -C "$ORT"
fi

if ! curl -s -o /dev/null -m 3 "http://127.0.0.1:$HAFEN/spiel/"; then
  (cd "$ORT" && exec 1>/dev/null 2>&1; setsid nohup python3 -m http.server "$HAFEN" >/tmp/messstand.log 2>&1 </dev/null & disown)
  sleep 2
fi
# Der Server haelt EIN Verzeichnis. Zeigt er auf einen anderen Commit, neu setzen.
if [ "$(cat /tmp/messstand.sha 2>/dev/null || true)" != "$SHA" ]; then
  # NICHT `pkill -f "http.server $HAFEN"` — das Muster trifft auch die eigene
  # Shell, deren Kommandozeile die Zeichenkette enthaelt, und erschlaegt den
  # Aufrufer (am 2.8. passiert, Exit 144). Nur den Prozess treffen, der wirklich
  # auf dem Hafen horcht.
  PID=$(ss -lptn "sport = :$HAFEN" 2>/dev/null | grep -o 'pid=[0-9]*' | head -1 | cut -d= -f2)
  [ -n "${PID:-}" ] && kill "$PID" 2>/dev/null
  sleep 1
  (cd "$ORT" && exec 1>/dev/null 2>&1; setsid nohup python3 -m http.server "$HAFEN" >/tmp/messstand.log 2>&1 </dev/null & disown)
  sleep 2
  echo "$SHA" > /tmp/messstand.sha
fi
curl -s -o /dev/null -m 3 "http://127.0.0.1:$HAFEN/spiel/" \
  && echo "MESSSTAND $SHA auf http://127.0.0.1:$HAFEN/spiel/" \
  || { echo "MESSSTAND kam nicht hoch"; exit 1; }
