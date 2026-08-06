#!/usr/bin/env bash
# ABNAHME nach dem Neuanlauf — alles auf dem Stand, der ausgeliefert wird.
#
#   werkbank/schuss/fuhre-w11/abnahme.sh
#
# WARUM ES DAS GIBT: die Zahlen in §3.1–3.7 stehen auf dem Nachstand
# `7896ee6+118b191467` (= Commit 91fb766). Der Arbeitsbaum ist seither um zwei
# reine Kommentar-Commits weitergerueckt (§3.8) und traegt die Marke
# `7896ee6+cf76271455`. Zwei Marken, die sich nur im Kommentar unterscheiden,
# SOLLTEN dieselben Zahlen liefern — „sollten" ist aber kein Messwert. Also
# nachgemessen, auf dem Stand, der wirklich ausgeliefert wird.
#
# Dazu die Fertigmeldungsprobe des Auftrags: alle vier Epochen laden,
# BRAUHAUS.lage.length = 0, keine Konsolenfehler.
#
# Jeder Lauf einzeln durchs Messfenster — nie zwei nebeneinander.
set -uo pipefail
cd "$(dirname "$0")/../../.."
M=werkbank/schuss/aufsicht/messfenster.sh
Z=werkbank/schuss/fuhre-w11/messungen
export MESSFENSTER_WARTE=7200

lauf() { echo "== $1  $(date -u +%H:%M:%S)"; shift; "$@"; echo "   -> $? $(date -u +%H:%M:%S)"; }

mkdir -p werkbank/schuss/fuhre-w11/bilder

lauf "Sonde 30 Wochen OHNE Escape (Endstand cf76271455)" \
  env HAFEN=8952 WOCHEN=30 ESC=0 $M node werkbank/schuss/fuhre-w11/sonde.mjs abn-sonde-w30 \
  > $Z/abn-sonde-w30.log 2>&1

lauf "Sonde Ladezustand (Endstand)" \
  env HAFEN=8952 WOCHEN=0 ESC=0 $M node werkbank/schuss/fuhre-w11/sonde.mjs abn-sonde-laden \
  > $Z/abn-sonde-laden.log 2>&1

lauf "Tor — vier Epochen laden, lage, Konsolenfehler" \
  env HAFEN=8952 $M node werkbank/schuss/aufsicht/tor.mjs \
  > $Z/abn-tor.txt 2>&1

lauf "Deckung 30 Wochen OHNE Escape (Endstand)" \
  env HAFEN=8952 WOCHEN=30 NAME=abn-w30 $M node werkbank/schuss/fuhre-w11/deckung.mjs \
  > $Z/abn-deckung-w30.log 2>&1

# Die Escape-Probe fehlte fuer den VORZUSTAND. Ohne sie steht die Zeile
# `geklemmt {"erbe .erb-buch blatt":1}` aus der Nachher-Probe ohne Vergleich da,
# und man kann nicht sagen, ob DIE FUHRE sie verursacht hat. Das gehoert
# gemessen, nicht vermutet — zumal es die Abnahme DES ERBEN beruehrt.
lauf "Escape-Probe auf dem VORZUSTAND (Vergleich zu nachher-escape.txt)" \
  env HAFEN=8951 $M node werkbank/schuss/fuhre-w11/escapeprobe.mjs vorher-escape \
  > $Z/vorher-escape.log 2>&1

# Die Gegenprobe zu den 169.305 px (§1.2). Sie lief beim ersten Anlauf schon,
# aber ihr Ergebnis stand nur auf der Konsole und in Bildern — und Bilder
# wandern in diesem Lauf nicht mit (.gitignore:67). Die Aufsicht hat
# angekuendigt, diese Zahl nachzupruefen; also steht sie jetzt als Text da.
lauf "Warum 169.305 px — Gegenprobe auf dem VORZUSTAND, Ladezustand, E1" \
  env HAFEN=8951 EPOCHE=1 WOCHEN=0 $M node werkbank/schuss/fuhre-w11/warum.mjs \
  > $Z/warum-e1-laden.txt 2>&1

# DIE GEMEINSAME ZAHL. Die Abnahme verlangt „Gesamtdeckung unter 20 %".
# DIE FUHRE allein bringt sie auf 21,9–26,7 % (§3.3) — der Rest liegt bei den
# beiden Nachbarn, die in derselben Welle raeumen. Solange nur behauptet wird,
# dass es zusammen aufgeht, ist es nicht gemessen. Also EINMAL gemessen, auf
# einem eingefrorenen Stand des ganzen Arbeitsbaums, mit genanntem Commit.
# Das ist ausdruecklich NICHT meine Zahl, sondern die der drei zusammen, und
# der Stand der beiden anderen ist an dieser Stelle ein Zwischenstand.
SHA=$(git rev-parse --short HEAD)
echo "== GEMEINSAM: Stand $SHA (alle drei Stuecke) auf Hafen 8953"
werkbank/schuss/aufsicht/messstand.sh "$SHA" 8953 || echo "  Messstand fehlgeschlagen"
lauf "Deckung 30 Wochen OHNE Escape — ALLE DREI, Stand $SHA" \
  env HAFEN=8953 WOCHEN=30 NAME=gemeinsam-w30 $M node werkbank/schuss/fuhre-w11/deckung.mjs \
  > $Z/gemeinsam-w30.log 2>&1
echo "   (Stand $SHA)" >> $Z/deckung-gemeinsam-w30.txt

echo "FERTIG $(date -u +%H:%M:%S)"
