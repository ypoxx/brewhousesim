#!/usr/bin/env bash
# NACHTRAG 2 — die zwei Zahlen, die der ZWEITE Anlauf bewegt haben KANN.
#
# Zwischen `nach-*` und dem ausgelieferten Stand liegt der staerkere Lichthof
# (eine Stufe groesser, fett, vier Lagen) und der laengere Kommentar. Was das
# NICHT bewegt, ist nachgewiesen:
#   * rahmen-w10/messen.mjs — `nach2-messen-laden.txt` ist Ziffer fuer Ziffer
#     gleich mit `nach-messen-laden.txt`. Es misst Kastenhuellen.
#   * bild-w9/deckung.mjs   — es zaehlt nur Elemente MIT deckendem Grund,
#     Rahmen oder Verlauf (deckung.mjs:26–44). Ein Schlagschatten macht aus
#     `.erb-band` keinen Kasten; die Zahl kann sich nicht bewegt haben.
# Was es SEHR WOHL bewegt:
#   * einzeln.mjs  — es nimmt den Kasten photographisch weg und zaehlt jeden
#     geaenderten Bildpunkt, Schrift und Lichthof eingeschlossen. Genau die
#     Zahl, die ich als „die ehrliche" berichte. `nach-einzeln.txt` stammt vom
#     SCHWACHEN Lichthof und ist damit zu guenstig.
#   * das Gewicht — E2 stand bei 7,73 von 8 MB. Der Kommentar ist gewachsen.
set -uo pipefail
cd "$(dirname "$0")/../../.."
export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
export MESSFENSTER_WARTE=7200
M=werkbank/schuss/aufsicht/messfenster.sh
Z=werkbank/schuss/erbe-w11/messungen

while pgrep -f 'erbe-w11/nachtrag\.sh' > /dev/null; do sleep 20; done
echo "== Nachtrag 1 ist durch, Nachtrag 2 beginnt $(date -u +%H:%M:%S)"

lauf() { local n=$1; shift
  echo "== $n  $(date -u +%H:%M:%S)"
  ( "$@" ) > "$Z/$n.txt" 2>&1
  echo "   fertig $(date -u +%H:%M:%S)"
}

lauf nach2-einzeln env HAFEN=8942 SEL=.erb-leiste,.erb-band NAME=nach2 $M node werkbank/schuss/erbe-w11/einzeln.mjs
lauf nach2-gewicht env HAFEN=8942 $M node werkbank/schuss/aufsicht/gewicht-gegenprobe.mjs

echo "NACHTRAG 2 DURCH $(date -u +%H:%M:%S)"
