#!/usr/bin/env bash
# Vier Epochen, HINTEREINANDER, jede einzeln durchs Messfenster.
# Nicht vier gleichzeitig mit Hoffnung auf die Sperre — dann stuende die
# Wartezeit im falschen Prozess.
cd "$(dirname "$0")/../../.."
export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
HAFEN=${HAFEN:-8906}
WOCHEN=${WOCHEN:-30}
mkdir -p werkbank/schuss/bild-w8/berichte
for E in 1 2 3 4; do
  echo "######## EPOCHE $E ########"
  HAFEN=$HAFEN MESSFENSTER_WARTE=7200 werkbank/schuss/aufsicht/messfenster.sh \
    node werkbank/schuss/bild-w8/aufnehmen.mjs "$E" "$WOCHEN" \
    >"werkbank/schuss/bild-w8/berichte/e$E.txt" 2>&1
  echo "  exit $?  →  werkbank/schuss/bild-w8/berichte/e$E.txt"
  tail -3 "werkbank/schuss/bild-w8/berichte/e$E.txt"
done
echo "######## FERTIG ########"
md5sum werkbank/schuss/bild-w8/bilder/*.png
