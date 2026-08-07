#!/usr/bin/env bash
# WELLE 12 — DER GANZE ABNAHMESATZ, NACHEINANDER, AUF EINEM EINGEFRORENEN
# STAND.
#
#   werkbank/schuss/rahmen-w12/alles.sh <hafen>
#
# Reihenfolge mit Absicht: erst die billigen Proben (eine Minute), dann der
# Drosselfaecher (zwoelf Minuten), dann die weiche Abnahme (eine knappe halbe
# Stunde), zuletzt die harte (Stunden). Wer zuerst misst, was am schnellsten
# fehlschlaegt, verliert im Fehlerfall am wenigsten.
#
# JEDER Aufruf geht durch aufsicht/messfenster.sh — nie zwei Browser
# nebeneinander.
set -uo pipefail
cd "$(dirname "$0")/../../.."

HAFEN=${1:-8942}
Z=werkbank/schuss/rahmen-w12
LOG=$Z/alles.log
MF=werkbank/schuss/aufsicht/messfenster.sh
export PLAYWRIGHT_BROWSERS_PATH=${PLAYWRIGHT_BROWSERS_PATH:-/opt/pw-browsers}

sag() { echo "$@" | tee -a "$LOG"; }
sag "===== ALLES auf Hafen $HAFEN, Stand $(curl -s -m 5 "http://127.0.0.1:$HAFEN/.nachstand-marke"), $(date -u +%F\ %H:%M:%S) ====="

sag "--- 1  Geraet R9, Ladezustand"
HAFEN=$HAFEN MESSFENSTER_WARTE=7200 $MF node $Z/geraet.mjs 0  2>&1 | tee -a "$LOG" | tee $Z/geraet-lade.txt
sag "--- 2  Geraet R9, nach 30 Wochen"
HAFEN=$HAFEN MESSFENSTER_WARTE=7200 $MF node $Z/geraet.mjs 30 2>&1 | tee -a "$LOG" | tee $Z/geraet-w30.txt
sag "--- 3  Drosselfaecher (das Rennen)"
HAFEN=$HAFEN DROSSEL=1,2,3,4,6 LAEUFE=1 SPUR=0 MESSFENSTER_WARTE=7200 $MF \
  node $Z/rennen.mjs 1 62 $Z/rennen-endstand.json 2>&1 | tee -a "$LOG"
sag "--- 4  weiche Abnahme"
$Z/weich.sh "$HAFEN" $Z/weich 2>&1 | tee -a "$LOG"
sag "--- 5  harte Abnahme (6x 1350, je 3x 1600/1884/1970)"
$Z/abnahme.sh "$HAFEN" $Z/abnahme 2>&1 | tee -a "$LOG"
sag "===== ALLES FERTIG $(date -u +%F\ %H:%M:%S) ====="
