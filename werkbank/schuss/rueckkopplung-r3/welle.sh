#!/usr/bin/env bash
# EINE WELLE MESSUNGEN — vier Epochen, ein Buchstabe je Lauf.
#
#   werkbank/schuss/rueckkopplung-r3/welle.sh <hafen> <ordner> <buchstabe>
#   NEBENEINANDER=1 werkbank/schuss/rueckkopplung-r3/welle.sh …   # alte Art
#
# ------------------------------------------------------------------------
# DIESE DATEI HAT BIS ZUM 6. AUGUST 2026 EINE ZUSAGE GETRAGEN, DIE NICHT HAELT.
#
# Sie lautete: „Die beharrliche Hand ist von der Last der Maschine unabhaengig,
# also duerfen die vier Epochen nebeneinander laufen. Nachgewiesen: dieselbe
# Reihe bei Lastmittel 1,5 und bei 13,7." Zwei Lastpunkte sind kein Nachweis.
#
# Gefunden hat es der Builder DER RAHMEN in Welle 10, an sich selbst: zwei
# Saetze desselben eingefrorenen Standes gingen in 1350 auseinander — rho(14 J)
# −0,336 gegen +0,270, Kasse 28–524 gegen 34–583. **Einzeln** gemessen spielt
# derselbe Stand dreimal dieselbe Partie, mit derselben Pruefsumme, und es ist
# dieselbe wie auf dem Vorzustand. Nebeneinander gemessen nicht immer.
#
# Warum das schwerer wiegt als ein falscher Wert: bei gesaetem Wuerfel ist
# „zweimal dasselbe" die VORAUSSETZUNG jeder Zahl, die dieser Lauf erhoben hat.
# Jeder Beleg der Wellen 7 bis 9 steht auf „drei Laeufe, eine md5". Faellt die
# Wiederholbarkeit, ist nicht der Wert unsicher, sondern das Geraet.
#
# Deshalb laufen die vier Epochen jetzt NACHEINANDER. Das kostet Zeit — ein
# Lauf dauert allein rund elf Minuten, vier also knapp eine Stunde statt einer
# Viertelstunde. Eine Stunde fuer eine Zahl, die sich wiederholen laesst, ist
# billiger als eine Viertelstunde fuer eine, die es nicht tut.
#
# NEBENEINANDER=1 stellt die alte Art wieder her. Wer sie benutzt, schreibt in
# seinen Bericht, dass die Zahlen daraus stammen — und rechnet damit, dass eine
# Gegenmessung sie nicht reproduziert.
# ------------------------------------------------------------------------
set -u
cd "$(dirname "$0")/../../.."
HAFEN=${1:-8901}
ORDNER=${2:-/tmp/rk3/nachher}
L=${3:-A}
mkdir -p "$ORDNER"

if [ "${NEBENEINANDER:-0}" = "1" ]; then
  echo "!!! NEBENEINANDER: die vier Epochen laufen gleichzeitig." >&2
  echo "!!! Die Reihen sind dann nicht zuverlaessig wiederholbar (siehe Kopf)." >&2
  for E in 1 2 3 4; do
    HAFEN=$HAFEN node werkbank/schuss/rueckkopplung-r3/linie.mjs $E 400 "$ORDNER/e$E-$L.json" \
      > "$ORDNER/e$E-$L.log" 2>&1 &
  done
  wait
else
  for E in 1 2 3 4; do
    HAFEN=$HAFEN node werkbank/schuss/rueckkopplung-r3/linie.mjs $E 400 "$ORDNER/e$E-$L.json" \
      > "$ORDNER/e$E-$L.log" 2>&1
  done
fi

cat "$ORDNER"/e?-"$L".log
