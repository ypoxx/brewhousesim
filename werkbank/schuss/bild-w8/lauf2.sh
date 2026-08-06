#!/usr/bin/env bash
# Nachtrag: Obergrenze (bau=alle) und gespielt-ohne-Blatt, vier Epochen nacheinander.
cd "$(dirname "$0")/../../.."
export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
HAFEN=${HAFEN:-8906}; WOCHEN=${WOCHEN:-30}
mkdir -p werkbank/schuss/bild-w8/berichte
for E in 1 2 3 4; do
  echo "######## NACHTRAG EPOCHE $E ########"
  HAFEN=$HAFEN MESSFENSTER_WARTE=7200 werkbank/schuss/aufsicht/messfenster.sh \
    node werkbank/schuss/bild-w8/nachtrag.mjs "$E" "$WOCHEN" \
    >"werkbank/schuss/bild-w8/berichte/n$E.txt" 2>&1
  echo "  exit $? → berichte/n$E.txt"; tail -2 "werkbank/schuss/bild-w8/berichte/n$E.txt"
done
echo "######## NACHTRAG FERTIG ########"
