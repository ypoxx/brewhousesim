#!/usr/bin/env bash
# A/B DER WEBP-UMSTELLUNG — der einzige Weg, sie mit dem Auge zu pruefen.
#
# Baut einen ZWEITEN Messstand, der byteweise derselbe Baum ist wie 8903, nur
# mit den 32 alten PNG statt der 32 WebP. Danach zeigen zwei Bildschirmfotos
# derselben Woche denselben Zug — und jeder Unterschied ist die Umstellung
# selbst, nichts sonst.
#
#   werkbank/schuss/stadt-blind-w7/ab-webp-aufsetzen.sh
#   -> Hafen 8907 mit PNG, Hafen 8903 (fremd, unangetastet) mit WebP
#
# Die PNG kommen aus einem aelteren Messstand, der sie noch auf der Platte hat.
# Die Alphakanaele beider Saetze sind byteweise gleich (32 von 32 geprueft),
# also stammen die WebP nachweislich aus genau diesen PNG.
set -uo pipefail
QUELLE=${QUELLE:-/home/user/brewhousesim}
PNGQ=${PNGQ:-/tmp/messstand/3e6d08c/spiel/bild/hof}
ZIEL=${ZIEL:-/tmp/claude-0/-home-user-brewhousesim/2945a2cf-1639-5611-b3d8-e1847b092d58/scratchpad/ab-png}
HAFEN=${HAFEN:-8907}

[ -d "$PNGQ" ] || { echo "KEINE PNG-QUELLE $PNGQ — A/B nicht moeglich"; exit 1; }

rm -rf "$ZIEL"; mkdir -p "$ZIEL"
cp -r "$QUELLE/spiel" "$ZIEL/spiel"
cp "$PNGQ"/*.png "$ZIEL/spiel/bild/hof/"
rm -f "$ZIEL"/spiel/bild/hof/*.webp
sed -i "s#'bild/hof/' + name + '.webp'#'bild/hof/' + name + '.png'#" "$ZIEL/spiel/stuecke/stadt.js"
grep -q "name + '.png'" "$ZIEL/spiel/stuecke/stadt.js" || { echo "PFAD NICHT UMGESTELLT — Lauf verworfen"; exit 1; }
echo "png-ab" > "$ZIEL/.messstand-marke"

if fuser -n tcp "$HAFEN" >/dev/null 2>&1; then echo "Hafen $HAFEN schon belegt — nichts getan"; exit 0; fi
( cd "$ZIEL" && exec python3 -m http.server "$HAFEN" --bind 127.0.0.1 >/dev/null 2>&1 ) &
sleep 2
M=$(curl -s "http://127.0.0.1:$HAFEN/.messstand-marke")
[ "$M" = "png-ab" ] || { echo "MARKE FEHLT ($M) — Stand nicht brauchbar"; exit 1; }
echo "A/B-Stand auf $HAFEN steht. 32 PNG statt WebP, sonst identisch."
