#!/usr/bin/env bash
# MESSFENSTER — genau EINE Messung auf dieser Maschine, nie zwei nebeneinander.
#
#   werkbank/schuss/aufsicht/messfenster.sh node werkbank/schuss/…/linie.mjs 4 400 /tmp/…json
#   HAFEN=8961 werkbank/schuss/aufsicht/messfenster.sh node …
#
# Alles hinter dem Skriptnamen wird unveraendert ausgefuehrt, sobald das Fenster
# frei ist. Umgebungsvariablen (HAFEN, RUHE, …) wirken wie sonst auch.
#
# ------------------------------------------------------------------------
# WARUM ES DAS GIBT
#
# Der Lauf weiss seit dem 3. August mit Zahlen, dass parallele Browser die
# Messung verderben: dieselbe Messhand lieferte rho +0,354 statt +0,393 und
# +0,305 statt +0,108. Unter Last faellt ein Klick aus, das Haus braut ein Jahr
# weniger, und die ganze Partie laeuft anders. Die Regel dazu stand im
# LAUFENDER-AUFTRAG — adressiert an die AUFSICHT.
#
# Am 4. August um 14:22 UTC hat die Aufsicht beim Selbst-Check gesehen, dass
# ZWEI BUILDER derselben Welle gleichzeitig je eine 400-Wochen-Messung fuhren.
# Jeder fuer sich sequenziell, zueinander parallel. Beide bekamen die Bedingung
# gemeldet, beide haben richtig reagiert und ihren Satz wiederholt — und um
# 15:22 UTC ueberlappten die Wiederholungen erneut. Das ist kein Ungehorsam,
# das ist die Lage: jeder wartet auf den anderen, keiner hat den Vortritt, und
# eine Bitte ist kein Schiedsrichter.
#
# Deshalb eine Sperre statt einer Regel. Wer sie benutzt, kann nicht mehr
# danebenliegen; wer sie vergisst, faellt beim naechsten Selbst-Check auf.
#
# WAS DIE SPERRE NICHT IST: kein Ersatz fuer sequenzielles Messen INNERHALB
# eines Satzes. Wer vier Epochen misst, ruft dieses Skript viermal
# hintereinander auf — nicht viermal gleichzeitig und hofft auf die Sperre.
# Das wuerde funktionieren, aber die Wartezeit stuende dann im falschen Prozess
# und niemand saehe mehr, wer worauf wartet.
#
# WAS ES NICHT KANN, ausdruecklich — damit niemand sich darauf verlaesst:
# Es begrenzt die WARTENDEN, nicht den HALTENDEN. Haengt eine Messung fest,
# waehrend sie das Fenster haelt, warten alle anderen die vollen 90 Minuten und
# scheitern dann mit 75. Einen Totmannknopf gibt es nicht.
#
# Wer beim Selbst-Check einen langen Halter sieht, prueft ihn, statt ihn zu
# erschlagen — am 4. August sah ein Lauf mit 20 Minuten Laufzeit und 4 Sekunden
# CPU nach einem Haenger aus und arbeitete in Wirklichkeit: die Last liegt in
# den Chromium-Kindern, nicht im Elternprozess. Der richtige Blick:
#
#   ps -eo pid,ppid,etime,time,cmd --forest | grep -A3 "<pid des halters>"
#   → lebt der Browser? waechst die CPU-Zeit des Renderers?
#   ls -la --time-style=+%H:%M:%S <zielverzeichnis>
#   → kommen weiter Ergebnisdateien an?
# ------------------------------------------------------------------------
set -uo pipefail
cd "$(dirname "$0")/../../.."

if [ $# -eq 0 ]; then
  echo "Aufruf: $0 <befehl…>" >&2
  echo "  z.B.: $0 node werkbank/schuss/rueckkopplung-r3/linie.mjs 4 400 /tmp/e4.json" >&2
  exit 1
fi

SPERRE=werkbank/.messsperre
WARTE=${MESSFENSTER_WARTE:-5400}   # 90 min; eine 400-Wochen-Messung dauert 7-15 min
touch "$SPERRE" 2>/dev/null || true

exec 9>>"$SPERRE" || { echo "MESSFENSTER: Sperrdatei nicht zu oeffnen — messe UNGESPERRT" >&2; exec "$@"; }

if ! flock -w 1 9; then
  echo "MESSFENSTER: belegt, warte (max ${WARTE}s) …" >&2
  ANFANG=$SECONDS
  if ! flock -w "$WARTE" 9; then
    # NICHT still weitermessen und NICHT still abbrechen. Beides waere ein
    # Messgeraet, das im Fehlerfall schweigt — die Sorte, die diesen Lauf schon
    # viermal in die Irre gefuehrt hat.
    echo "MESSFENSTER: nach ${WARTE}s immer noch belegt. NICHT gemessen." >&2
    echo "  Wer haelt das Fenster:" >&2
    fuser -v "$SPERRE" 2>&1 | sed 's/^/    /' >&2
    exit 75   # EX_TEMPFAIL: spaeter wieder versuchen, kein Messergebnis
  fi
  echo "MESSFENSTER: frei nach $((SECONDS - ANFANG))s" >&2
fi

echo "MESSFENSTER offen — load $(cut -d' ' -f1-3 /proc/loadavg)" >&2
exec "$@"
