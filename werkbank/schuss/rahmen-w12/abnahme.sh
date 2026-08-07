#!/usr/bin/env bash
# DIE HARTE ABNAHME DER WELLE 12.
#
#   werkbank/schuss/rahmen-w12/abnahme.sh <hafen> <ordner>
#
# Auftrag: „?saat=1350 liefert in 1350 SECHSMAL hintereinander dieselbe
# Pruefsumme, einzeln durch aufsicht/messfenster.sh am eingefrorenen Stand.
# Dazu je drei Laeufe in 1600, 1884 und 1970 mit je einer Pruefsumme."
#
# Sechs statt drei, weil das Abweichungsverhaeltnis 1:3 war: ein Dreiersatz
# waere zu rund 30 % Zufall, ein Sechsersatz zu unter 3 %.
#
# JEDER LAUF EINZELN durch das Messfenster — nie zwei nebeneinander, nie vier
# Epochen nebeneinander (`rueckkopplung-r3/welle.sh` faehrt inzwischen selbst
# nacheinander; hier wird ohnehin Lauf fuer Lauf gerufen).
#
# Die md5 wird INNERHALB eines Standes verglichen — dort ist sie
# aussagekraeftig. Ueber Staende hinweg nicht: `linie.mjs` schreibt den vom
# Bildschirm abgelesenen Knopftext mit, und der enthaelt seit Welle 10 ein
# geschuetztes Leerzeichen (rahmen-w10/ARBEITSSTAND.md, „Eine Falle in der
# Pruefsumme"). Fuer den Vergleich ueber Staende hinweg zaehlt die PARTIE:
# Kassenspanne, Jahresreihe, Zahl der Braujahre.
set -uo pipefail
cd "$(dirname "$0")/../../.."

HAFEN=${1:-8941}
Z=${2:-werkbank/schuss/rahmen-w12/abnahme}
LOG=$Z/lauf.log
mkdir -p "$Z"

M=$(curl -s -m 5 "http://127.0.0.1:$HAFEN/.nachstand-marke" \
    || curl -s -m 5 "http://127.0.0.1:$HAFEN/.messstand-marke")
[ -z "$M" ] && { echo "!!! Hafen $HAFEN liefert nichts" | tee -a "$LOG"; exit 1; }
echo "== ABNAHME auf Hafen $HAFEN, Stand $M, $(date -u +%F\ %H:%M:%S) ==" >> "$LOG"

lauf() {   # $1 epoche  $2 marke
  local ep=$1 marke=$2 ziel="$Z/e$1-$2.json"
  [ -s "$ziel" ] && { echo "  schon da: e$ep-$marke"; return 0; }
  HAFEN=$HAFEN MESSFENSTER_WARTE=7200 werkbank/schuss/aufsicht/messfenster.sh \
    node werkbank/schuss/rueckkopplung-r3/linie.mjs "$ep" 400 "$ziel" >> "$LOG" 2>&1
  if [ -s "$ziel" ]; then
    echo "--- e$ep-$marke OK ($M) $(date -u +%H:%M:%S)  md5 $(md5sum "$ziel" | cut -c1-12)" | tee -a "$LOG"
  else
    echo "!!! e$ep-$marke KEINE DATEI" | tee -a "$LOG"
  fi
}

for L in A B C D E F; do lauf 1 "$L"; done
for L in A B C;       do lauf 2 "$L"; done
for L in A B C;       do lauf 3 "$L"; done
for L in A B C;       do lauf 4 "$L"; done

echo "== ABNAHME FERTIG $(date -u +%H:%M:%S) ==" | tee -a "$LOG"
python3 werkbank/schuss/rahmen-w12/auswerten-abnahme.py "$Z" | tee -a "$LOG"
