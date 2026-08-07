#!/usr/bin/env bash
# DIE WEICHE ABNAHME DER WELLE 12 — nichts aus Welle 10 und 11 darf
# zurueckgenommen werden.
#
#   werkbank/schuss/rahmen-w12/weich.sh <hafen> <ordner>
#
# Verlangt (WELLE-12.md): Deckung nach 30 Wochen ohne Escape 13,8–15,0 %,
# tafeln() leer, Latte 4 = 10 Ueberlaeufe / 365 Textknoten / 0 von 308
# Knoepfen, verdeckt() 0, haushalt.pruefe() ohne Beanstandung, Gewicht unter
# 8 MB je Epoche.
#
# ALLES NACHEINANDER, jedes Stueck durch das Messfenster — nie zwei Browser
# nebeneinander (aufsicht/messfenster.sh sagt, warum).
set -uo pipefail
cd "$(dirname "$0")/../../.."

HAFEN=${1:-8941}
Z=${2:-werkbank/schuss/rahmen-w12/weich}
mkdir -p "$Z"
MF="werkbank/schuss/aufsicht/messfenster.sh"

lauf() {  # $1 name, Rest: Befehl
  local name=$1; shift
  [ -s "$Z/$name.txt" ] && { echo "  schon da: $name"; return 0; }
  echo "--- $name  $(date -u +%H:%M:%S)"
  HAFEN=$HAFEN MESSFENSTER_WARTE=7200 $MF "$@" > "$Z/$name.txt" 2>&1
  tail -3 "$Z/$name.txt" | sed 's/^/      /'
}

lauf tor            node werkbank/schuss/aufsicht/tor.mjs
# spielprobe.mjs zeigt FEST auf 8899 (den Arbeitsbaum) und nimmt kein HAFEN
# entgegen. Am fremden Messgeraet wird nicht gedreht — also laeuft sie nur
# fuer den NACHHER-Satz mit, wo der Arbeitsbaum der gemessene Stand ist.
[ "${OHNE_SPIELPROBE:-0}" = "1" ] || \
lauf spielprobe     node werkbank/schuss/aufsicht/spielprobe.mjs
lauf deckung-lade   node werkbank/schuss/bild-w9/deckung.mjs
lauf deckung-w30    env WOCHEN=30 node werkbank/schuss/bild-w9/deckung.mjs
lauf lesbarkeit     node werkbank/schuss/aufsicht/lesbarkeit.mjs
lauf gewicht        node werkbank/schuss/aufsicht/gewicht-gegenprobe.mjs
lauf haushalt-lade  env WOCHEN=0  ESC=0 node werkbank/schuss/rahmen-w10/rahmenprobe.mjs 1,2,3,4
lauf haushalt-w30   env WOCHEN=30 ESC=0 node werkbank/schuss/rahmen-w10/rahmenprobe.mjs 1,2,3,4
lauf haushalt-w30e1 env WOCHEN=30 ESC=1 node werkbank/schuss/rahmen-w10/rahmenprobe.mjs 1,2,3,4
# messen.mjs legt seine Rohdaten unter einem NAMEN ab; der Name traegt den
# Ordner, damit ein Vorher- und ein Nachher-Satz sich nicht ueberschreiben.
lauf messen-lade    node werkbank/schuss/rahmen-w10/messen.mjs "w12-$(basename "$Z")"
echo "== WEICHE ABNAHME FERTIG $(date -u +%H:%M:%S) =="
