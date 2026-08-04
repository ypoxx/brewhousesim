#!/usr/bin/env bash
# DREI DURCHGAENGE STATT EINEM — Sperrliste 5 des Kritikers, auf die
# Vorgangsfrage angewandt.
#
# Seine eigene Regel lautet: "Keine Epochenzahl aus einer einzigen Vorlage.
# Unter drei Durchgaengen je Datei ist die Latte nicht gemessen." Fuer die
# EPOCHENfrage hat er sie befolgt, fuer die VORGANGSfrage nicht — die Tabelle
# der Auflage 4 steht in seinem Urteil wie in der Nacharbeit der Vorrunde auf
# je einer einzigen Vorlage. Dass das zu wenig ist, ist in dieser Runde
# gemessen: dieselbe Aufnahme hat bei SUD in drei Staenden ja/nein/ja gesagt.
#
#   werkbank/schuss/klang-w6/gegenzug-wieder.sh /tmp/klang6/c c 2
set -uo pipefail
cd /home/user/brewhousesim
VON=${1:?verzeichnis fehlt}
NAME=${2:?name fehlt}
NR=${3:?durchgangsnummer fehlt}
AUS=werkbank/schuss/klang-w6/antworten/vorgang-$NAME-d$NR.json
python3 werkbank/schuss/klang-blind-w5/frage-vorgang.py \
  "$VON"/e1-gespielt.wav "$VON"/e2-gespielt.wav "$VON"/e3-gespielt.wav "$VON"/e4-gespielt.wav \
  "$VON"/e1-still.wav "$VON"/e2-still.wav "$VON"/e3-still.wav "$VON"/e4-still.wav \
  > "$AUS"
echo "-> $AUS"
python3 werkbank/schuss/klang-w6/vorgang-lies.py "$AUS"
