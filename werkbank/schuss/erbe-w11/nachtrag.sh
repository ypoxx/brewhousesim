#!/usr/bin/env bash
# DER NACHTRAG — was der Container-Reset vom 6.8. 21:2x offen gelassen hat.
#
#   werkbank/schuss/erbe-w11/nachtrag.sh
#
# Wartet, bis `rho.sh` durch ist (die acht Laeufe belegen das Messfenster
# nacheinander; wer sich dazwischenschiebt, misst zwar auch allein, legt aber
# Last auf die Maschine — und genau daran gehen die Partien dieser Welle
# auseinander, siehe linie.mjs Kopf). Erst danach der Rest, einzeln.
#
# Offen war genau dreierlei:
#   * nach2-spielprobe  — die Datei trug nur „MESSFENSTER: belegt, warte",
#                         der Lauf ist im Wartefenster gestorben.
#   * nach2-blick       — die Bilder liegen unter .gitignore:67 und waren fort.
#   * *-brettprobe      — nie gelaufen.
set -uo pipefail
cd "$(dirname "$0")/../../.."
export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
export MESSFENSTER_WARTE=7200
M=werkbank/schuss/aufsicht/messfenster.sh
Z=werkbank/schuss/erbe-w11/messungen

while pgrep -f 'erbe-w11/rho\.sh' > /dev/null; do sleep 20; done
echo "== rho ist durch, Nachtrag beginnt $(date -u +%H:%M:%S)"

lauf() { local n=$1; shift
  echo "== $n  $(date -u +%H:%M:%S)"
  ( "$@" ) > "$Z/$n.txt" 2>&1
  echo "   fertig $(date -u +%H:%M:%S)  ($(wc -l < "$Z/$n.txt") Zeilen)"
}

# 1 — die abgeschnittene Spielprobe, neu
lauf nach2-spielprobe env HAFEN=8942 $M node werkbank/schuss/erbe-w11/spielprobe-hafen.mjs

# 2 — die Bilder neu, damit ich sie ANSEHE statt das Urteil abzuschreiben
lauf nach2-blick env HAFEN=8942 MARKE=nach2 $M node werkbank/schuss/erbe-w11/blick.mjs
lauf vor-blick   env HAFEN=8941 MARKE=vor   $M node werkbank/schuss/erbe-w11/blick.mjs

# 3 — die Gegenprobe zum Sud-Befund, vorher gegen nachher
lauf vor-brettprobe   env HAFEN=8941 MARKE=vor  $M node werkbank/schuss/erbe-w11/brettprobe.mjs
lauf nach2-brettprobe env HAFEN=8942 MARKE=nach $M node werkbank/schuss/erbe-w11/brettprobe.mjs

echo "NACHTRAG DURCH $(date -u +%H:%M:%S)"
