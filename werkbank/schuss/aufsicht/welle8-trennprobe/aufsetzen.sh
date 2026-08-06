#!/usr/bin/env bash
# TRENNPROBE — welches der beiden Stuecke hat 1350 verarmt?
#
# Zwischen dem Messstand der Welle 7 (b6b06bb) und dem der Welle 8 (8b81250)
# liegen ZWEI Stuecke: DIE STADT (Welle 8) und die Nacharbeit von DER PREIS
# aus Welle 7 (f63d40e). Gemessen ist die Wirkung, nicht die Ursache:
#
#   1350, gleiche Saat, gleiche Hand:  Kasse nie unter 26  ->  70 Wochen auf 0
#                                      3 statt 1 Braujahr unter 1x
#
# Diese Probe baut zwei MISCHSTAENDE aus committeten Dateien. Es wird nichts
# geschrieben, was nicht schon im Repo steht — die Aufsicht misst, sie baut
# nicht.
#
#   Hafen 8911  "ohnePreis"  = Welle 8, aber preis*.js von b6b06bb
#   Hafen 8912  "ohneStadt"  = Welle 8, aber stadt*.js von b6b06bb
#
# Faellt 1350 auf einem der beiden Staende zurueck auf die alten Werte, gehoert
# der Befund dem jeweils ANDEREN Stueck.
#
# WARNUNG, die in die Auswertung gehoert: ein Mischstand ist kein Stand, den
# jemand gebaut hat. Ruft die neue STADT eine API, die erst die neue Fassung
# von DER PREIS mitbringt, wirft es — dann steht "Seitenfehler" ueber 0 in der
# Messdatei und die Zelle ist WERTLOS, nicht etwa ein Befund. Immer zuerst
# darauf sehen.
#
#   werkbank/schuss/aufsicht/welle8-trennprobe/aufsetzen.sh
#
# Idempotent. Zweimal laufen lassen schadet nie.

set -uo pipefail
cd "$(dirname "$0")/../../../.."

ALT=b6b06bb          # Messstand Welle 7 — davor lag beides in alter Fassung
NEU=8b81250          # Messstand Welle 8 — danach liegt beides in neuer

setze() {                       # $1 = Name, $2 = Hafen, $3… = Pfade aus $ALT
  local name=$1 hafen=$2; shift 2
  local ort=/tmp/trennprobe/$name
  if [ ! -f "$ort/spiel/index.html" ]; then
    mkdir -p "$ort"
    git archive "$NEU" | tar -x -C "$ort" || { echo "git archive fehlgeschlagen" >&2; return 1; }
    for p in "$@"; do
      git show "$ALT:$p" > "$ort/$p" || { echo "fehlt in $ALT: $p" >&2; return 1; }
    done
  fi
  # Die Marke traegt beide Commits UND den Namen — ein Mischstand darf nie mit
  # einem echten Messstand verwechselt werden.
  echo "$name:$NEU-mit-$ALT" > "$ort/.messstand-marke"

  if [ "$(curl -s -m 5 "http://127.0.0.1:$hafen/.messstand-marke" 2>/dev/null)" = "$name:$NEU-mit-$ALT" ]; then
    echo "  steht schon: $name auf :$hafen"
    return 0
  fi
  # Horcht dort etwas Falsches, nur den Prozess auf DIESEM Hafen treffen —
  # nie pkill mit Muster, das erschlaegt die eigene Shell (am 2.8. passiert).
  if curl -s -o /dev/null -m 3 "http://127.0.0.1:$hafen/"; then
    local pid=""
    command -v fuser >/dev/null 2>&1 &&
      pid=$(fuser -n tcp "$hafen" 2>/dev/null | tr -s ' ' '\n' | grep -E '^[0-9]+$' | head -1)
    [ -n "$pid" ] && kill "$pid" 2>/dev/null && sleep 1
  fi
  ( cd "$ort" && setsid nohup python3 -m http.server "$hafen" --bind 127.0.0.1 \
      >>"/tmp/trennprobe-$hafen.log" 2>&1 </dev/null & disown ) >/dev/null 2>&1
  sleep 2
  if [ "$(curl -s -m 5 "http://127.0.0.1:$hafen/.messstand-marke" 2>/dev/null)" = "$name:$NEU-mit-$ALT" ]; then
    echo "  gesetzt:    $name auf http://127.0.0.1:$hafen/spiel/"
  else
    echo "  FEHLGESCHLAGEN: $name auf :$hafen liefert nicht die erwartete Marke" >&2
    return 1
  fi
}

# EIN STUECK IST NICHT SEINE .js — ES IST .js UND .css.
# Der erste Anlauf dieser Probe hat nur die Skripte zurueckgesetzt. Beide
# Mischstaende kamen daraufhin auf DIESELBEN Zahlen wie der volle Welle-8-Stand
# (3/14 Jahre unter 1x, 70 bzw. 74 Wochen ohne Kennzahl) — es sah aus, als sei
# KEINES der beiden Stuecke die Ursache. Der Grund war die Probe selbst:
# `stadt.css` allein hat 185 Zeilen geaendert und stand in beiden Staenden in
# der NEUEN Fassung. Und dass Layout die Kennzahl bewegt, ist in diesem Lauf
# gemessen (Knopfboden, 1970, 0,811) — die messende Hand klickt, was sie
# trifft, und was verdeckt ist, klickt sie nicht.
# Die Besitztabelle in spiel/LIESMICH.md sagt es woertlich: einem Stueck
# gehoeren stuecke/<name>*.js UND stil/<name>*.css.
echo "TRENNPROBE $ALT (alt) gegen $NEU (neu)"
setze ohnePreis 8911 spiel/stuecke/preis.js spiel/stuecke/preis-daten.js \
                     spiel/stil/preis-zusatz.css
setze ohneStadt 8912 spiel/stuecke/stadt.js spiel/stuecke/stadt-daten.js \
                     spiel/stil/stadt.css spiel/stil/stadt-zusatz.css
