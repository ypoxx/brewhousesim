#!/usr/bin/env bash
# EIN EINZELNER ABNAHMELAUF — 400 Wochen, eine Epoche, ein Messfenster.
#
#   werkbank/schuss/rahmen-w12/lauf.sh <epoche> <marke> <hafen> [<ordner>]
#
# Warum einzeln und nicht als Satz (`abnahme.sh`): der Container faellt
# derzeit etwa stuendlich auf einen aelteren Commit zurueck und nimmt dabei
# jeden laufenden Prozess mit. Ein Satz von sechs Laeufen am Stueck gibt
# vier Stunden lang keine Zeile aus; ein Lauf gibt nach sieben Minuten seine
# Pruefsumme her, und die steht dann im Arbeitsstand, bevor der naechste
# Reset kommt.
#
# PRUEFT VOR JEDEM LAUF DIE MARKE DES HAFENS. Ein Zeitstempel ist kein
# Lebenszeichen — `git reset --hard` setzt die Dateizeit auf jetzt. Nur der
# Server selbst kann sagen, welche Fassung er ausliefert.
set -uo pipefail
cd "$(dirname "$0")/../../.."
EP=${1:?epoche}
MARKE=${2:?marke}
HAFEN=${3:-8950}
Z=${4:-werkbank/schuss/rahmen-w12/abnahme5}
mkdir -p "$Z"

IST=$(curl -s -m 5 "http://127.0.0.1:$HAFEN/.messstand-marke" || true)
[ -z "$IST" ] && { echo "!!! HAFEN $HAFEN TOT — messstand.sh $MARKE $HAFEN"; exit 1; }
[ "$IST" != "$MARKE" ] && { echo "!!! HAFEN $HAFEN liefert $IST, verlangt war $MARKE"; exit 1; }

L=A
for c in A B C D E F G; do [ -s "$Z/e$EP-$c.json" ] || { L=$c; break; }; done
ZIEL=$Z/e$EP-$L.json
echo "== e$EP-$L auf Hafen $HAFEN, Marke $IST, Start $(date -u +%H:%M:%S) =="
HAFEN=$HAFEN MESSFENSTER_WARTE=7200 werkbank/schuss/aufsicht/messfenster.sh \
  node werkbank/schuss/rueckkopplung-r3/linie.mjs "$EP" 400 "$ZIEL"
if [ -s "$ZIEL" ]; then
  echo "--- e$EP-$L FERTIG $(date -u +%H:%M:%S)  md5 $(md5sum "$ZIEL" | cut -c1-12)"
else
  echo "!!! e$EP-$L KEINE DATEI"; exit 1
fi
