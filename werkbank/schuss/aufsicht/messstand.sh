#!/usr/bin/env bash
# MESSSTAND — ein eingefrorener Spielstand auf eigenem Hafen, damit gemessen
# werden kann, waehrend Builder am Arbeitsbaum schreiben.
#
#   werkbank/schuss/aufsicht/messstand.sh [commit] [hafen]
#   werkbank/schuss/aufsicht/messstand.sh HEAD 8931
#
# Warum es das gibt: Am 2. August wurde der Nenner im Arbeitsbaum gemessen,
# waehrend zwei Builder darin editierten. Eine Zahl auf einem wandernden Ziel
# ist keine Messung — niemand kann sie nachstellen. Der Messstand haengt an
# einem Commit und bleibt stehen.
#
# ------------------------------------------------------------------------
# DREI FEHLER, DIE DIESES SKRIPT SELBST HATTE, gemeldet vom blinden Kritiker
# DER PREIS in der Nacht zum 4. August 2026, nachdem sie ihn eine Stunde
# gekostet hatten — er hat eine Stunde lang gegen den FALSCHEN Commit gemessen
# und es nur gemerkt, weil er die ausgelieferte Datei gegengeprueft hat:
#
#   1. `ss` GIBT ES IN DIESEM CONTAINER NICHT. Die Zeile, die den alten Server
#      auf dem Hafen finden sollte, lief ins Leere.
#   2. `set -euo pipefail` liess das Skript an genau dieser Zeile still mit
#      Exit 1 abbrechen — ohne Ausgabe. Wer nicht auf den Exitcode sah, hielt
#      den Messstand fuer gesetzt.
#   3. Folge: der Server blieb auf dem ALTEN Commit stehen. "Frier X ein" und
#      "miss X" waren zwei verschiedene Dinge, und nichts sagte es.
#
# Die Lehre steckt jetzt im Bau: das Skript PRUEFT AM ENDE, ob der Server
# wirklich den verlangten Commit ausliefert, und schlaegt sonst laut fehl.
# Ein Messstand, der die falsche Fassung ausliefert, ist schlimmer als keiner.
# ------------------------------------------------------------------------
set -uo pipefail
cd "$(dirname "$0")/../../.."

WAS=${1:-HEAD}
HAFEN=${2:-8900}
SHA=$(git rev-parse --short "$WAS") || { echo "Unbekannter Commit: $WAS" >&2; exit 1; }
ORT=/tmp/messstand/$SHA

if [ ! -d "$ORT" ] || [ ! -f "$ORT/spiel/index.html" ]; then
  mkdir -p "$ORT"
  git archive "$WAS" | tar -x -C "$ORT" || { echo "git archive fehlgeschlagen" >&2; exit 1; }
fi

# Eine Datei, an der sich der Commit erkennen laesst — ohne `ss`, ohne pidfile,
# ohne Vertrauen. Wir fragen den SERVER, nicht das Betriebssystem.
PROBE=spiel/kern/welt.js
SOLL=$(git show "$WAS:$PROBE" | md5sum | cut -d' ' -f1)
ist_richtig() {
  local h
  h=$(curl -s -m 5 "http://127.0.0.1:$HAFEN/$PROBE" 2>/dev/null | md5sum | cut -d' ' -f1)
  [ "$h" = "$SOLL" ]
}

starte() {
  ( cd "$ORT" && setsid nohup python3 -m http.server "$HAFEN" --bind 127.0.0.1 \
      >>/tmp/messstand-$HAFEN.log 2>&1 </dev/null & disown ) >/dev/null 2>&1
  sleep 2
}

if ist_richtig; then
  echo "MESSSTAND $SHA steht bereits auf http://127.0.0.1:$HAFEN/spiel/"
  exit 0
fi

# Horcht dort etwas Falsches? Dann weg damit — aber NUR den Prozess treffen, der
# wirklich auf diesem Hafen horcht. NICHT `pkill -f "http.server $HAFEN"`: das
# Muster trifft auch die eigene Shell, deren Kommandozeile die Zeichenkette
# enthaelt, und erschlaegt den Aufrufer (am 2.8. passiert, Exit 144).
if curl -s -o /dev/null -m 3 "http://127.0.0.1:$HAFEN/"; then
  PID=""
  if command -v fuser >/dev/null 2>&1; then
    PID=$(fuser -n tcp "$HAFEN" 2>/dev/null | tr -s ' ' '\n' | grep -E '^[0-9]+$' | head -1)
  fi
  if [ -z "$PID" ] && command -v ss >/dev/null 2>&1; then
    PID=$(ss -lptn "sport = :$HAFEN" 2>/dev/null | grep -o 'pid=[0-9]*' | head -1 | cut -d= -f2)
  fi
  if [ -z "$PID" ]; then
    # Letzter Weg ohne ss und ohne fuser: im /proc nach dem Kommando suchen, das
    # genau diesen Hafen bedient. Die eigene Shell traegt "messstand.sh" im
    # Kommando und faellt durch das Muster.
    for p in /proc/[0-9]*; do
      c=$(tr '\0' ' ' < "$p/cmdline" 2>/dev/null)
      case "$c" in
        *http.server*" $HAFEN"*|*http.server*"$HAFEN "*) PID=${p#/proc/}; break ;;
      esac
    done
  fi
  [ -n "$PID" ] && kill "$PID" 2>/dev/null && sleep 1
fi

starte

if ist_richtig; then
  echo "MESSSTAND $SHA auf http://127.0.0.1:$HAFEN/spiel/  (Fassung geprueft)"
  exit 0
fi

echo "MESSSTAND FEHLGESCHLAGEN: Hafen $HAFEN liefert NICHT $SHA aus." >&2
echo "  Erwartet md5 $SOLL fuer $PROBE" >&2
echo "  Nimm einen freien Hafen: $0 $WAS <anderer-hafen>" >&2
exit 1
