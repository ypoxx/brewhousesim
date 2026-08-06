#!/usr/bin/env bash
# Alle Epochen nacheinander IN EINEM Messfenster — sequenziell, nie parallel.
#   werkbank/schuss/bild-w9/alle.sh 2 3 4
set -u
cd "$(dirname "$0")/../../.."
for e in "$@"; do
  echo "############ EPOCHE $e ############"
  PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node werkbank/schuss/bild-w9/aufnehmen.mjs "$e" "${WOCHEN:-34}" || echo "EPOCHE $e FEHLGESCHLAGEN"
done
