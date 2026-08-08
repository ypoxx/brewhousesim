#!/usr/bin/env bash
# SCHRITT 6 DER WELLE-13-ABNAHME — haelt die Wiederholbarkeit OHNE die
# Vorziehregel des Rundenschlusses?
#
#   werkbank/schuss/aufsicht/welle13-gegen/vorzug-probe.sh [hafen]
#
# DIE FRAGE, UND WER SIE GESTELLT HAT. Die Welle 12 hat die 420-ms-Wanduhrfrist
# in `preis.js:2737` als DEN Verursacher der Bistabilitaet benannt; der Satz
# steht seither in `spiel/LIESMICH.md`. DIE JAHRESTAFEL hat am 8. August
# widersprochen: diese Frist habe nie gefeuert, weil ihre erste Zeile ein
# `clearTimeout` war und das Spiel oefter als alle 420 ms zeichnet. Beides kann
# zugleich wahr sein — `kern/runde.js` zieht eine waehrend einer Zeichenrunde
# bestellte Frist VOR, und eine Frist, die vorher stets geloescht wurde, bevor
# sie ablief, feuert danach.
#
# **Eine Regel, die traegt, wird nicht auf einen unbelegten Verdacht hin
# entfernt.** Darum wird gemessen und nicht geschlossen. Gemessen wird am
# Commit `probe/ohne-vorzug`, in dem die Umhuellung von `window.setTimeout`
# ein Durchreicher ist — er haengt an keinem Zweig und wird nie ausgeliefert.
#
# WAS DIE PROBE BEANTWORTET UND WAS NICHT: Sie fragt, ob SECHS Laeufe an
# diesem Stand EINE Pruefsumme geben. Sie fragt NICHT, ob es dieselbe
# Pruefsumme ist wie mit der Regel — ohne Vorziehregel laeuft die Partie
# moeglicherweise anders, und das waere kein Fehler, sondern ein anderer Stand.
# Wer die beiden Pruefsummen vergleicht, beantwortet eine Frage, die niemand
# gestellt hat.
#
# SECHS UND NICHT DREI, weil 1350 genau die Epoche ist, in der die Abweichung
# schon einmal aufgetreten ist (Welle 11). Bei einem Abweichungsverhaeltnis von
# 1:3 waere ein Dreiersatz zu rund 30 % Zufall, ein Sechsersatz zu unter 3 %.
# MESSLATTE.md, „Wiederholbarkeit ist keine fuenfte Latte".
set -uo pipefail
cd "$(dirname "$0")/../../../.."
HAFEN=${1:-8934}
D=werkbank/schuss/aufsicht/welle13-gegen/vorzug
mkdir -p "$D"

./werkbank/schuss/aufsicht/messstand.sh probe/ohne-vorzug "$HAFEN" || exit 1

for L in A B C D E F; do
  Z="$D/e1-$L.json"
  [ -s "$Z" ] && { echo "e1-$L: liegt schon vor, $(md5sum < "$Z" | cut -c1-12)"; continue; }
  T0=$(date +%s)
  HAFEN=$HAFEN timeout 1800 node werkbank/schuss/rueckkopplung-r3/linie.mjs 1 400 "$Z" >/dev/null 2>&1
  if [ -s "$Z" ]; then
    echo "e1-$L: $(md5sum < "$Z" | cut -c1-12)  ($(( $(date +%s) - T0 ))s)"
  else
    echo "e1-$L: GESCHEITERT nach $(( $(date +%s) - T0 ))s"
  fi
done

echo "--- Pruefsummen ohne Vorziehregel ---"
P=$(for f in "$D"/e1-*.json; do md5sum < "$f" | cut -c1-12; done | sort -u)
N=$(ls "$D"/e1-*.json 2>/dev/null | wc -l)
echo "$N Laeufe, $(echo "$P" | wc -l) verschiedene Pruefsummen: $(echo $P)"
if [ "$(echo "$P" | wc -l)" = 1 ] && [ "$N" -ge 6 ]; then
  echo "URTEIL: Die Wiederholbarkeit haelt auch OHNE die Vorziehregel."
  echo "        Die Begruendung der Welle 12 war falsch; die Regel ist nicht"
  echo "        das, was 1350 stabil haelt. Ob sie trotzdem bleibt, entscheidet"
  echo "        die Aufsicht — eine Regel abzubauen kostet eine eigene Abnahme."
else
  echo "URTEIL: Ohne die Vorziehregel haelt die Wiederholbarkeit NICHT"
  echo "        (oder die Reihe ist unvollstaendig). Die Regel bleibt, und die"
  echo "        Begruendung der Welle 12 ist damit belegt statt behauptet."
fi
echo "--- drei Schnitte, zum Vergleich mit dem Stand MIT Regel ---"
python3 werkbank/schuss/fuhre-w6/schnitte.py "$D" 2>&1 || true
