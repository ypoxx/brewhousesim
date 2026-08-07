#!/usr/bin/env bash
# DAS SCHNELLE TOR — EIN Lauf ueber 62 Wochen, einzeln durch das Messfenster.
#
#   werkbank/schuss/rahmen-w12/tor62.sh <hafen> <marke>
#
# Die beiden Partien der Epoche 1350 gehen in Woche 61 auseinander (Michaeli
# 1352). 62 Wochen genuegen also, um zu sehen, WELCHE gespielt wird:
#     kasseMichaeli 1352 = 164  ->  Partie A (LEITER leer, Tafel weggeklappt)
#     kasseMichaeli 1352 = 119  ->  Partie B (LEITER 3 Zeilen, Angebot genommen)
#
# UND WAS ES NICHT IST: ein Ersatz fuer die Abnahme. Der Drosselfaecher hat
# die Fassung 2 fuer 1350 durchgewunken (5 von 5 dieselbe Partie), und
# derselbe Stand spielte ungedrosselt ueber 400 Wochen trotzdem zwei Partien.
# Dasselbe Misstrauen gilt gegen dieses verkuerzte Tor. Es sagt nur, ob sich
# die Abnahme ueberhaupt lohnt.
set -uo pipefail
cd "$(dirname "$0")/../../.."
HAFEN=${1:-8950}
MARKE=${2:-X}
Z=werkbank/schuss/rahmen-w12/tor62
mkdir -p "$Z"

IST=$(curl -s -m 5 "http://127.0.0.1:$HAFEN/.messstand-marke" || true)
[ -z "$IST" ] && { echo "!!! Hafen $HAFEN liefert nichts — Messstand tot"; exit 1; }
echo "Hafen $HAFEN, Marke $IST"

N=$(ls "$Z"/lauf-*.json 2>/dev/null | wc -l); N=$((N+1))
ZIEL=$Z/lauf-$N.json
HAFEN=$HAFEN MESSFENSTER_WARTE=7200 werkbank/schuss/aufsicht/messfenster.sh \
  node werkbank/schuss/rueckkopplung-r3/linie.mjs 1 62 "$ZIEL"
[ -s "$ZIEL" ] || { echo "!!! keine Datei"; exit 1; }
python3 - "$ZIEL" "$IST" <<'PY'
import json,sys
d=json.load(open(sys.argv[1]))
j={x['jahr']:x for x in d['jahre']}
k=j.get(1352,{}).get('kasseMichaeli')
z=len(j.get(1352,{}).get('leiter') or [])
p={164:'A',119:'B'}.get(k,'? NEU')
print(f"TOR62 {sys.argv[1]}  Marke {sys.argv[2]}  kasseMich1352={k} LEITER={z} "
      f"Kasse {d['kasseMin']}-{d['kasseMax']} Fehler {len(d.get('fehler') or [])}  ->  Partie {p}")
PY
