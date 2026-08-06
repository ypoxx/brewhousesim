#!/usr/bin/env bash
# Alle Ausschnitte in EINEM Browserstart. Koordinaten in der Flaeche 2752x1536.
set -u
cd "$(dirname "$0")/../../.."
Z=zielbild
G=werkbank/schuss/bild-w9/bilder
export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
S="node werkbank/schuss/bild-w9/schnitt.mjs"

# 1) Kirche + Marktplatz, 1884 — steht ST. MICHAEL da?
$S kirche3 1450 250 700 400  $Z/03-1884.jpg $G/e3-a-laden.png $G/e3-c-gespielt-esc.png
# 2) Hoftor mit dem Anker-Schild, 1350
$S schild1 1050 850 800 400  $Z/01-1350.jpg $G/e1-a-laden.png $G/e1-c-gespielt-esc.png
# 3) Brauhof links, 1350 — Pfanne, Brauerinnen, Malzboden auf Stelzen
$S hof1 450 700 1150 620     $Z/01-1350.jpg $G/e1-a-laden.png $G/e1-c-gespielt-esc.png
# 4) 1970 rechts unten — Kaesten am Rand, FAE-Kasten, DAS ERBE
$S rand4 2050 950 700 400    $Z/04-1970.jpg $G/e4-a-laden.png $G/e4-c-gespielt-esc.png
# 5) 1970 DAS ERBE Zeile — abgeschnittene Beschriftungen
$S erbe4 1480 1090 1290 130  $Z/04-1970.jpg $G/e4-a-laden.png $G/e4-c-gespielt-esc.png
# 6) 1970 oben rechts — laeuft ein Kasten aus dem Bild?
$S ecke4 2350 40 402 300     $Z/04-1970.jpg $G/e4-c-gespielt-esc.png
# 7) 1970 Leuchtschrift am Dach
$S marke4 700 500 1000 450   $Z/04-1970.jpg $G/e4-a-laden.png $G/e4-c-gespielt-esc.png
# 8) unterstes Sechstel 1970 — Asphalt, Autos
$S unten4 0 1280 2752 256    $Z/04-1970.jpg $G/e4-a-laden.png $G/e4-c-gespielt-esc.png
# 9) unterstes Sechstel 1350
$S unten1 0 1280 2752 256    $Z/01-1350.jpg $G/e1-a-laden.png
# 10) 1600 Brauhof — Darre mit Rauch?
$S darre2 350 450 1150 620   $Z/02-1600.jpg $G/e2-a-laden.png $G/e2-c-gespielt-esc.png
# 11) 1884 Gasthof-Schild, vom Gegnerkarte verdeckt?
$S gast3 1650 720 700 220    $Z/03-1884.jpg $G/e3-c-gespielt-esc.png
# 12) 1970 Adler/Nordstern-Karten uebereinander
$S karten4 1950 560 800 400  $Z/04-1970.jpg $G/e4-c-gespielt-esc.png
