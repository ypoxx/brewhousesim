#!/usr/bin/env bash
# DIE DRITTE LATTE, mit dem VERFAHREN DES KRITIKERS, unveraendert.
#
#   SAAT=606 werkbank/schuss/klang-w6/epoche.sh /tmp/klang6/b b
#
# Acht Aufnahmen -> auf probe-NN gemischt (mische.py des Kritikers, Schluessel
# versiegelt) -> drei Durchgaenge je Datei durch hoerer.hoere() OHNE --erwartet
# (frage.py der Vorrunde, das HTTP 429 abfaengt und wartet) -> Auszaehlung.
# An werkbank/hoerer.py wird nichts gedreht (ZUSTAENDIGKEIT 16).
set -uo pipefail
cd /home/user/brewhousesim
VON=${1:?verzeichnis fehlt}
NAME=${2:?name fehlt}
POOL=/tmp/klang6/pool-$NAME
rm -rf "$POOL"
SAAT=${SAAT:-606} python3 werkbank/schuss/klang-blind-w5/mische.py "$VON" "$POOL"
cp "$POOL/schluessel.json" "werkbank/schuss/klang-w6/antworten/epoche-$NAME-schluessel.json"
MODELL=${MODELL:-gemini-3.6-flash} PAUSE=${PAUSE:-4} \
  python3 werkbank/schuss/klang-w5-nach/frage.py 3 "$POOL"/probe-*.wav \
  > "werkbank/schuss/klang-w6/antworten/epoche-$NAME-antworten.json"
python3 werkbank/schuss/klang-w6/epoche-lies.py \
  "werkbank/schuss/klang-w6/antworten/epoche-$NAME-antworten.json" \
  "werkbank/schuss/klang-w6/antworten/epoche-$NAME-schluessel.json"
