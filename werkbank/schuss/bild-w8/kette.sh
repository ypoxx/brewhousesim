#!/usr/bin/env bash
# Reihenfolge nach Wert: erst die Chrom-/Ortsmessung, dann die Obergrenze,
# zuletzt die Vergleichsbogen. Alles einzeln durchs Messfenster.
cd /home/user/brewhousesim
export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
while pgrep -f "bild-w8/lauf.sh" >/dev/null; do sleep 20; done
echo "=== bauorte+chrom ==="
HAFEN=8906 MESSFENSTER_WARTE=7200 werkbank/schuss/aufsicht/messfenster.sh \
  node werkbank/schuss/bild-w8/bauorte.mjs > werkbank/schuss/bild-w8/berichte/bauorte.txt 2>&1
echo "  exit $?"
bash werkbank/schuss/bild-w8/lauf2.sh
echo "=== gegenueber ==="
HAFEN=8906 MESSFENSTER_WARTE=7200 werkbank/schuss/aufsicht/messfenster.sh \
  node werkbank/schuss/bild-w8/gegenueber.mjs > werkbank/schuss/bild-w8/berichte/gegenueber.txt 2>&1
echo "  exit $?"
echo "=== KETTE FERTIG ==="
