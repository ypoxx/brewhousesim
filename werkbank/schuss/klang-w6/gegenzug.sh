#!/usr/bin/env bash
# DIE ABNAHME DER AUFLAGE 4, mit dem UNVERAENDERTEN Werkzeug des Kritikers.
#
#   werkbank/schuss/klang-w6/gegenzug.sh /tmp/klang6/a a
#
# Legt alle acht Aufnahmen eines Standes `frage-vorgang.py` vor — vier
# gespielte und vier stille. Punkt (d) der Liste ist der Gegenzug:
#   "Von einem FREMDEN Hof nebenan, gedaempft wie durch eine Wand, geschieht
#    etwas"
# Punkte (e)-(h) sind Blender, die es im KATALOG nirgends gibt; wer sie bejaht,
# raet, und dann zaehlt auch sein Ja bei (d) nicht.
#
# Das Ohr erfaehrt weder Epoche noch Dateiname (nur die Bytes gehen hinaus,
# nachgesehen in frag()). Gemischt wird trotzdem NICHT: anders als bei der
# Epochenfrage steht die Antwort hier nicht in einer Ziffer, die man aus der
# Reihenfolge raten koennte — gefragt ist ja/nein je Punkt.
set -uo pipefail
cd /home/user/brewhousesim
VON=${1:?verzeichnis fehlt}
NAME=${2:?name fehlt}
AUS=werkbank/schuss/klang-w6/antworten/vorgang-$NAME.json
python3 werkbank/schuss/klang-blind-w5/frage-vorgang.py \
  "$VON"/e1-gespielt.wav "$VON"/e2-gespielt.wav "$VON"/e3-gespielt.wav "$VON"/e4-gespielt.wav \
  "$VON"/e1-still.wav "$VON"/e2-still.wav "$VON"/e3-still.wav "$VON"/e4-still.wav \
  > "$AUS"
echo "-> $AUS"
python3 werkbank/schuss/klang-w6/vorgang-lies.py "$AUS"
