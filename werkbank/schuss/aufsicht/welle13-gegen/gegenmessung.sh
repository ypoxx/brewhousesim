#!/usr/bin/env bash
# SCHRITT 4 DER WELLE-13-ABNAHME — die eigene Gegenmessung der Aufsicht.
#
#   werkbank/schuss/aufsicht/welle13-gegen/gegenmessung.sh [hafen]
#
# Gemessen wird gegen `BEFUND-VORHER.md`, erhoben am Vorzustand `7e21973` mit
# GENAU DIESEN GERAETEN, bevor ein Bauergebnis vorlag. Darum wird an keinem
# davon gedreht: `probe13.mjs` ist am 8. August um 08:30 UTC geschrieben
# worden, waehrend die Builder noch arbeiteten, und `hand3.mjs`/`zaehle.mjs`
# haben die Ausgangszahlen des Spielkritikers erzeugt. Ein Mass, das man
# anfasst, nachdem man das Ergebnis kennt, misst nicht — es begruendet.
#
# NACHEINANDER, NIE NEBENEINANDER. Am 7. August hat die Maschinenlast
# entschieden, welche von zwei Partien herauskam; das hat vier Tage gekostet.
#
# JEDER SCHRITT UEBERSPRINGT, WAS SCHON VORLIEGT. Der Container wird
# stuendlich zurueckgesetzt und zwischendurch angehalten — am 8. August lief
# eine Reihe 53 Minuten Wanduhr fuer einen einzigen fertigen Lauf. Ohne diese
# Zeile faengt die Reihe nach jedem Reset von vorn an und wird nie fertig.
set -uo pipefail
cd "$(dirname "$0")/../../../.."
HAFEN=${1:-8933}
G=werkbank/schuss/aufsicht/welle13-gegen
S=werkbank/schuss/spiel-w12
LOG=$G/gegenmessung.log

# Ein Hafen ist kein Baum: erst nachsehen, welche Fassung dort liegt.
KOPF=$(curl -s -m 5 "http://127.0.0.1:$HAFEN/spiel/index.html" | md5sum | cut -c1-12)
MARK=$(curl -s -m 5 "http://127.0.0.1:$HAFEN/.messstand-marke")
echo "=== Gegenmessung auf Hafen $HAFEN · Messstand $MARK · index.html $KOPF ===" | tee -a "$LOG"
[ -z "$MARK" ] && { echo "!!! Hafen $HAFEN tot — messstand.sh zuerst" | tee -a "$LOG"; exit 1; }

# DIE MARKE IST DIE DATEI, DIE AM ENDE GESCHRIEBEN WIRD — nicht die, in die
# waehrend des Laufs gestroemt wird. `probe13.mjs` und `hand3.mjs` schreiben
# ihr `.jsonl` Zeile fuer Zeile mit, damit ein sterbender Agent nichts
# verliert; wer darauf ueberspringt, nimmt eine abgebrochene Messung
# stillschweigend als fertig. Gepruefte Marken: `<marke>-summe.json` (probe13,
# Zeile 245), `wiederkehr-e<N>.json` (Zeile 54), `<lauf>-wahl.json` (hand3,
# Zeile 364). Alle drei entstehen erst nach dem letzten Klick.
lauf () {  # lauf <schlussdatei> <beschriftung> <befehl…>
  local ziel=$1 name=$2; shift 2
  if [ -s "$ziel" ]; then echo "$name: liegt schon vor" | tee -a "$LOG"; return; fi
  local t0=$(date +%s)
  timeout 3600 "$@" >>"$LOG" 2>&1
  if [ -s "$ziel" ]; then
    echo "$name: fertig ($(( $(date +%s) - t0 ))s)" | tee -a "$LOG"
  else
    echo "$name: GESCHEITERT nach $(( $(date +%s) - t0 ))s" | tee -a "$LOG"
  fi
}

echo "--- 1/3 · probe13, 100 Wochen je Epoche, gegen BEFUND-VORHER.md ---" | tee -a "$LOG"
for E in 1 2 3 4; do
  lauf "$G/protokoll/nachher-e$E-summe.json" "probe13 e$E" \
       env MARKE=nachher-e$E HAFEN=$HAFEN node "$G/probe13.mjs" "$E" 100
done

echo "--- 2/3 · wiederkehr, das Neuladen nach zwoelf Wochen ---" | tee -a "$LOG"
for E in 1 2 3 4; do
  lauf "$S/protokoll/wiederkehr-e$E.json" "wiederkehr e$E" \
       env HAFEN=$HAFEN node "$S/wiederkehr.mjs" "$E"
done

# Die Hand des Spielkritikers, unveraendert: 20 Minuten je Epoche bei 1600x900,
# denn bei genau dieser Fenstergroesse sind die 71 %/78 % entstanden. Die neuen
# Laeufe heissen n1..n4, damit `zaehle.mjs` sie neben e1..e4 stellen kann,
# ohne dass eine Ausgangszahl ueberschrieben wird.
echo "--- 3/3 · hand3, 20 Minuten je Epoche bei 1600x900 ---" | tee -a "$LOG"
for E in 1 2 3 4; do
  lauf "$S/protokoll/n$E-wahl.json" "hand3 n$E" \
       env HAFEN=$HAFEN node "$S/hand3.mjs" "$E" 20 "n$E" 1600 900
done

echo "--- Auszaehlung: vorher (e1..e4) gegen nachher (n1..n4) ---" | tee -a "$LOG"
node "$S/zaehle.mjs" e1 e2 e3 e4 n1 n2 n3 n4 2>&1 | tee "$G/AUSZAEHLUNG.txt"
echo "=== GEGENMESSUNG DURCH ===" | tee -a "$LOG"
