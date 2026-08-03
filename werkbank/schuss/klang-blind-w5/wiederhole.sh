#!/usr/bin/env bash
# Drei Durchgaenge ueber dieselben acht Proben. Ein Messgeraet, das bei
# derselben Datei zweimal etwas anderes sagt, braucht eine Streuungszahl —
# und dieses hier tut das nachweislich (e1-gespielt: einmal Epoche 3, danach
# zweimal Epoche 1).
set -u
cd "$(dirname "$0")"
for pass in a b c; do
  for f in blind/probe-*.wav; do
    n=$(basename "$f" .wav)
    [ -s "durchgang/$pass-$n.json" ] && continue
    mkdir -p durchgang
    timeout 400 python3 frage-epoche.py "$f" > "durchgang/$pass-$n.json" 2>/dev/null &
    while [ "$(jobs -r | wc -l)" -ge 4 ]; do wait -n; done
  done
  wait
  echo "Durchgang $pass fertig"
done
