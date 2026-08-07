#!/usr/bin/env bash
# TRENNPROBE WELLE 11 — welches der drei Stuecke hat 1350 bistabil gemacht?
#
# Befund: am Integrationsstand spielt 1350 in drei einzeln gemessenen Laeufen
# ZWEI verschiedene Partien (rho +0,191 / -0,521 / +0,191, Spannweite 0,712,
# null Fehler in allen dreien). Der Vorzustand 7896ee6 war dreimal byteweise
# gleich. Die Bistabilitaet ist also in dieser Welle entstanden, und in ihr
# haben drei Stuecke gearbeitet: DAS ERBE, DER GEGNER, DIE FUHRE.
#
#   werkbank/schuss/aufsicht/welle11-trennprobe/aufsetzen.sh [neu-commit]
#
# Gebaut werden drei MISCHSTAENDE aus committeten Dateien — der Welle-11-Stand,
# in dem jeweils EIN Stueck auf den Vorzustand zurueckgesetzt ist:
#
#   8913  ohneErbe    ERBE   auf 7896ee6
#   8914  ohneGegner  GEGNER auf 7896ee6
#   8915  ohneFuhre   FUHRE  auf 7896ee6
#
# Welcher Stand 1350 wieder DREIMAL MIT EINER PRUEFSUMME spielt, nennt den
# Verursacher.
#
# EIN STUECK IST .js UND .css. Der erste Anlauf der Trennprobe in Welle 8 hat
# nur die Skripte zurueckgesetzt; beide Mischstaende kamen daraufhin auf die
# Zahlen des vollen Standes, und es sah aus, als sei KEINES der Stuecke die
# Ursache. stadt.css allein hatte 185 Zeilen geaendert. Die Besitztabelle in
# spiel/LIESMICH.md nennt beides: stuecke/<name>*.js UND stil/<name>*.css.
#
# WARNUNG, die in die Auswertung gehoert: ein Mischstand ist kein Stand, den
# jemand gebaut hat. Ruft die neue Fassung eines Stueckes eine API, die erst
# ein anderes mitbringt, wirft es — dann steht "Seitenfehler" ueber 0 in der
# Messdatei und die Zelle ist WERTLOS, nicht etwa ein Befund. Immer zuerst
# darauf sehen.
#
# Idempotent. Zweimal laufen lassen schadet nie.

set -uo pipefail
cd "$(dirname "$0")/../../../.."

ALT=7896ee6                       # Vorzustand: dreimal byteweise gleich
NEU=${1:-$(git rev-parse --short HEAD)}

setze() {                         # $1 Name, $2 Hafen, $3… Pfade aus $ALT
  local name=$1 hafen=$2; shift 2
  local ort=/tmp/trennprobe11/$name
  local marke="$name:$NEU-mit-$ALT"
  if [ ! -f "$ort/spiel/index.html" ]; then
    mkdir -p "$ort"
    git archive "$NEU" | tar -x -C "$ort" || { echo "git archive fehlgeschlagen" >&2; return 1; }
    for p in "$@"; do
      if git cat-file -e "$ALT:$p" 2>/dev/null; then
        git show "$ALT:$p" > "$ort/$p" || return 1
      else
        rm -f "$ort/$p"           # Datei gab es im Vorzustand nicht
      fi
    done
  fi
  echo "$marke" > "$ort/.messstand-marke"

  if [ "$(curl -s -m 5 "http://127.0.0.1:$hafen/.messstand-marke" 2>/dev/null)" = "$marke" ]; then
    echo "  steht schon: $name auf :$hafen"; return 0
  fi
  # Nur den Prozess auf DIESEM Hafen treffen — nie pkill mit Muster, das
  # erschlaegt die eigene Shell (am 2.8. und am 6.8. je einmal passiert).
  if curl -s -o /dev/null -m 3 "http://127.0.0.1:$hafen/"; then
    local pid=""
    command -v fuser >/dev/null 2>&1 &&
      pid=$(fuser -n tcp "$hafen" 2>/dev/null | tr -s ' ' '\n' | grep -E '^[0-9]+$' | head -1)
    [ -n "$pid" ] && kill "$pid" 2>/dev/null && sleep 1
  fi
  ( cd "$ort" && setsid nohup python3 -m http.server "$hafen" --bind 127.0.0.1 \
      >>"/tmp/trennprobe11-$hafen.log" 2>&1 </dev/null & disown ) >/dev/null 2>&1
  sleep 2
  if [ "$(curl -s -m 5 "http://127.0.0.1:$hafen/.messstand-marke" 2>/dev/null)" = "$marke" ]; then
    echo "  gesetzt:    $name auf http://127.0.0.1:$hafen/spiel/"
  else
    echo "  FEHLGESCHLAGEN: $name auf :$hafen liefert nicht $marke" >&2; return 1
  fi
}

echo "TRENNPROBE 11 — $ALT (alt) gegen $NEU (neu)"
setze ohneErbe   8913 spiel/stuecke/erbe.js   spiel/stuecke/erbe-daten.js \
                      spiel/stuecke/erbe-zusatz.js \
                      spiel/stil/erbe.css     spiel/stil/erbe-zusatz.css
setze ohneGegner 8914 spiel/stuecke/gegner.js spiel/stuecke/gegner-daten.js \
                      spiel/stuecke/gegner-zusatz.js \
                      spiel/stil/gegner.css   spiel/stil/gegner-zusatz.css
setze ohneFuhre  8915 spiel/stuecke/fuhre.js  spiel/stuecke/fuhre-daten.js \
                      spiel/stuecke/fuhre-zusatz.js \
                      spiel/stil/fuhre.css    spiel/stil/fuhre-zusatz.css
