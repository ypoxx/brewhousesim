#!/usr/bin/env bash
# DIESELBE SAAT, DIESELBE PARTIE? — die Abnahmebedingung, die über allen
# sechs Auflagen steht.
#
# Befund, der sie ausgelöst hat: auf dem Stand MIT der uhrgetriebenen Wache
# lag 1350 zwischen Satz A und Satz B auseinander (ρ −0,336 gegen +0,270,
# Kasse 28–524 gegen 34–583), während der Vorgänger auf `37f4b44` dreimal
# dieselbe Reihe bekam.
#
# Diese Probe misst DREI Dinge nebeneinander, alle mit `?saat=1350`,
# Epoche 1, 400 Wochen, jeder Lauf einzeln durchs Messfenster:
#
#   VOR    — Messstand 37f4b44 (8930).   Ist der Vorzustand HEUTE, auf DIESER
#            Maschine, dreimal derselbe? Das ist die Kontrolle: ohne sie
#            weiß niemand, ob die Streuung überhaupt von mir kommt.
#   MIT    — Nachstand mit der Wache (8931). Der Stand, auf dem A≠B war.
#   OHNE   — Nachstand ohne die Wache (8932). Der Stand, der ausgeliefert wird.
#
# Ergebnis ist eine md5 je Lauf. Drei gleiche md5 = das Gerät ist dicht.
set -uo pipefail
cd "$(dirname "$0")/../../.."
export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers MESSFENSTER_WARTE=7200
MF=werkbank/schuss/aufsicht/messfenster.sh
Z=werkbank/schuss/rahmen-w10
mkdir -p $Z/saat

werkbank/schuss/aufsicht/messstand.sh 37f4b44 8930 || exit 1
$Z/nachstand.sh 8932 || exit 1

for L in A B C; do
  for SATZ in "VOR 8930" "OHNE 8932"; do
    set -- $SATZ
    NAME=$1; HAFEN=$2
    echo "### $(date -u +%H:%M:%S)  $NAME $L"
    HAFEN=$HAFEN $MF node werkbank/schuss/rueckkopplung-r3/linie.mjs 1 400 \
      "$Z/saat/$NAME-e1-$L.json" > "$Z/saat/$NAME-e1-$L.log" 2>&1
  done
done

echo "### $(date -u +%H:%M:%S) PRUEFSUMMEN"
md5sum $Z/saat/*.json | sort
echo "### $(date -u +%H:%M:%S) SAATPROBE DURCH"
