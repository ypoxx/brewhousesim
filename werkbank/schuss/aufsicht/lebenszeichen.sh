#!/usr/bin/env bash
# Wer arbeitet gerade? — juengste Schreibzeit je Pfadgruppe.
#
#   werkbank/schuss/aufsicht/lebenszeichen.sh "Name:pfad pfad" "Name2:pfad"
#
# WARUM ES DIESE DATEI GIBT: die Aufsicht hat diesen Test stundenlang inline
# getippt und dabei `find -printf '%TH:%TM' | sort -r` benutzt. Das sortiert
# ZEICHENKETTEN — "23:54" steht damit vor "01:15", und ein Agent, der gerade
# eben geschrieben hat, sieht aus, als schwiege er seit Stunden. In der Nacht
# zum 4. August hat das den PREIS-Kritiker zweimal fuer tot erklaert, waehrend
# sein Urteil von 594 auf 713 Zeilen wuchs.
# Richtig ist ein voller Zeitstempel (%TY-%Tm-%Td %TH:%TM:%TS) oder, wie hier,
# der Abstand in Minuten aus %T@.
set -uo pipefail
cd "$(dirname "$0")/../../.."
JETZT=$(date +%s)
for arg in "$@"; do
  name=${arg%%:*}; pfade=${arg#*:}
  # shellcheck disable=SC2086
  juengste=$(find $pfade -type f -printf '%T@\n' 2>/dev/null | sort -rn | head -1)
  if [ -z "$juengste" ]; then
    printf "  %-20s —  keine Datei gefunden\n" "$name"; continue
  fi
  alt=$(( (JETZT - ${juengste%.*}) / 60 ))
  # shellcheck disable=SC2086
  frisch=$(find $pfade -type f -newermt '-15 minutes' 2>/dev/null | wc -l)
  zeit=$(date -u -d "@${juengste%.*}" '+%H:%M:%S')
  printf "  %-20s zuletzt %s UTC  (vor %s min, %s Datei(en) in 15 min)\n" \
         "$name" "$zeit" "$alt" "$frisch"
done
