#!/usr/bin/env bash
# rho — die drei Schnitte und die Jahre unter 1x, vorher gegen nachher.
#
#   werkbank/schuss/gegner-w11/rho-auswerten.sh
#
# `fuhre-w6/schnitte.py` erwartet je Satz einen Ordner mit `e<epoche>-<X>.json`;
# `rho.sh` schreibt flach als `<marke>-e<epoche>.json`. Hier wird nur umgelegt,
# nicht gerechnet — die Zahlen kommen aus den beiden vorhandenen Geraeten.
set -uo pipefail
cd "$(dirname "$0")/../../.."
Z=werkbank/schuss/gegner-w11/rho
for m in vor nach; do
  mkdir -p "$Z/$m"
  for e in 1 2 3 4; do
    [ -f "$Z/$m-e$e.json" ] && cp "$Z/$m-e$e.json" "$Z/$m/e$e-A.json"
  done
done
echo "=== DREI SCHNITTE (fuhre-w6/schnitte.py) ==="
python3 werkbank/schuss/fuhre-w6/schnitte.py "$Z/vor" "$Z/nach"
echo
echo "=== JAHRE UNTER 1x (rueckkopplung-r3/auswerten.py) ==="
echo "--- VORHER (Messstand 7896ee6) ---"
python3 werkbank/schuss/rueckkopplung-r3/auswerten.py "$Z"/vor/e*.json
echo "--- NACHHER (Nachstand: 7896ee6 + gegner*.js/css) ---"
python3 werkbank/schuss/rueckkopplung-r3/auswerten.py "$Z"/nach/e*.json
