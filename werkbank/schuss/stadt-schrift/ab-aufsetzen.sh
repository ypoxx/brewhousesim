#!/usr/bin/env bash
# A/B FUER TEIL B — zwei Haefen auf DEMSELBEN Baum, im selben Augenblick.
#
#   werkbank/schuss/stadt-schrift/ab-aufsetzen.sh
#     -> 8898  ALT     (Schriftboeden der Welle 7 zurueckgenommen)
#     -> 8899  JETZT   (der Arbeitsbaum, wie er ist)
#
# WARUM ES DAS GIBT, und es ist teuer gelernt:
# Die Aufnahme von 12:14 gegen die von 12:53 zeigte in 1350 einen Unterschied
# von 248 Pixeln in der rechten oberen Ecke. Es war NICHT die Schrift der
# STADT — es waren die Zahlen der Michaelitafel: "Tafel 36 Pf / 3,11x /
# 8 Pf" gegen "33 Pf / 3,39x / 12 Pf". Dazwischen hat DER PREIS
# preis.js, preis-daten.js und preis.css geaendert (Zeitstempel 12:20 bis
# 12:50). Zwei Stuecke bauen gleichzeitig am selben Baum; eine Aufnahme von
# vorhin gegen eine von jetzt misst also BEIDE.
#
# Also A/B statt vorher/nachher: beide Aufnahmen entstehen jetzt, mit
# demselben Stand aller fremden Dateien, und der einzige Unterschied sind die
# drei Dateien der STADT. Genau das hat DER SUD in Welle 6 gebaut, als er
# ausschliessen musste, dass er selbst rho bewegt hat.
#
# Der Hafen 8898 wird aus einem SYMLINK-WALD gebaut: alles zeigt in den
# Arbeitsbaum, nur stadt.css, stadt-zusatz.css und stadt.js sind echte
# Dateien aus alt/. Damit ist ausgeschlossen, dass sich irgendetwas anderes
# unterscheidet — es gibt gar nichts anderes.
set -uo pipefail
cd "$(dirname "$0")/../../.."
WURZEL=$(pwd)
ALT=werkbank/schuss/stadt-schrift/alt
BAUM=werkbank/schuss/stadt-schrift/hafen-alt

node werkbank/schuss/stadt-schrift/alt-bauen.mjs || exit 1

rm -rf "$BAUM"
mkdir -p "$BAUM/spiel/stil" "$BAUM/spiel/stuecke"
for e in "$WURZEL"/*; do
  n=$(basename "$e"); [ "$n" = "spiel" ] && continue
  ln -sfn "$e" "$BAUM/$n"
done
for e in "$WURZEL"/spiel/*; do
  n=$(basename "$e")
  case "$n" in stil|stuecke) continue ;; esac
  ln -sfn "$e" "$BAUM/spiel/$n"
done
for e in "$WURZEL"/spiel/stil/*; do
  n=$(basename "$e")
  case "$n" in stadt.css|stadt-zusatz.css) continue ;; esac
  ln -sfn "$e" "$BAUM/spiel/stil/$n"
done
for e in "$WURZEL"/spiel/stuecke/*; do
  n=$(basename "$e")
  case "$n" in stadt.js) continue ;; esac
  ln -sfn "$e" "$BAUM/spiel/stuecke/$n"
done
cp "$ALT/stadt.css" "$BAUM/spiel/stil/stadt.css"
cp "$ALT/stadt-zusatz.css" "$BAUM/spiel/stil/stadt-zusatz.css"
cp "$ALT/stadt.js" "$BAUM/spiel/stuecke/stadt.js"

# Nur starten, wenn nicht schon etwas auf 8898 haengt — und den Hafen ueber
# fuser finden, NIE ueber ein Textmuster: pkill -f trifft die eigene Shell
# und hat in diesem Lauf schon viermal einen Agenten getoetet.
if fuser -n tcp 8898 >/dev/null 2>&1; then
  echo "8898 ist schon belegt (PID $(fuser -n tcp 8898 2>/dev/null)) — nicht neu gestartet."
else
  # setsid + </dev/null, sonst haelt die Pipe des Kindes den Aufruf offen und
  # das Skript "haengt", obwohl der Hafen laengst steht (einmal passiert).
  (cd "$BAUM" && setsid python3 -m http.server 8898 </dev/null >/dev/null 2>&1 &)
  sleep 1.5
fi

for h in 8898 8899; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$h/spiel/")
  echo "Hafen $h: HTTP $code"
done
# Die Gegenprobe, ohne die das Ganze nichts wert ist: liefern die beiden
# Haefen WIRKLICH verschiedene stadt.css und GLEICHE preis.js?
echo "stadt.css  8898 $(curl -s http://127.0.0.1:8898/spiel/stil/stadt.css | md5sum | cut -c1-8)  " \
     "8899 $(curl -s http://127.0.0.1:8899/spiel/stil/stadt.css | md5sum | cut -c1-8)"
echo "preis.js   8898 $(curl -s http://127.0.0.1:8898/spiel/stuecke/preis.js | md5sum | cut -c1-8)  " \
     "8899 $(curl -s http://127.0.0.1:8899/spiel/stuecke/preis.js | md5sum | cut -c1-8)"
echo "stadt-daten 8898 $(curl -s http://127.0.0.1:8898/spiel/stuecke/stadt-daten.js | md5sum | cut -c1-8)  " \
     "8899 $(curl -s http://127.0.0.1:8899/spiel/stuecke/stadt-daten.js | md5sum | cut -c1-8)"
