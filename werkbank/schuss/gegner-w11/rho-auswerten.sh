#!/usr/bin/env bash
# rho — die drei Schnitte und die Jahre unter 1x, vorher gegen nachher.
#
#   werkbank/schuss/gegner-w11/rho-auswerten.sh [vormarke] [nachmarke]
#
# `fuhre-w6/schnitte.py` erwartet je Satz einen Ordner mit `e<epoche>-<X>.json`;
# `rho.sh` schreibt flach als `<marke>-e<epoche>.json`. Hier wird nur umgelegt,
# nicht gerechnet — die Zahlen kommen aus den beiden vorhandenen Geraeten.
#
# Die Marke ist ein Argument, seit der Neuanlauf nach dem Container-Reset einen
# ZWEITEN Nachher-Satz gemessen hat (`nach2`, mit der reparierten Ausweiche).
# Der erste Satz (`nach`) bleibt liegen: eine Messung, die man ueberschreibt,
# kann man nicht mehr gegen sich selbst lesen.
set -uo pipefail
cd "$(dirname "$0")/../../.."
Z=werkbank/schuss/gegner-w11/rho
VOR=${1:-vor}
NACH=${2:-nach2}
for m in "$VOR" "$NACH"; do
  mkdir -p "$Z/$m"
  for e in 1 2 3 4; do
    [ -f "$Z/$m-e$e.json" ] && cp "$Z/$m-e$e.json" "$Z/$m/e$e-A.json"
  done
done
echo "=== DREI SCHNITTE (fuhre-w6/schnitte.py)  $VOR -> $NACH ==="
python3 werkbank/schuss/fuhre-w6/schnitte.py "$Z/$VOR" "$Z/$NACH"
echo
echo "=== JAHRE UNTER 1x (rueckkopplung-r3/auswerten.py) ==="
echo "--- VORHER (Messstand 7896ee6) ---"
python3 werkbank/schuss/rueckkopplung-r3/auswerten.py "$Z/$VOR"/e*.json
echo "--- NACHHER (Nachstand: 7896ee6 + gegner*.js/css) ---"
python3 werkbank/schuss/rueckkopplung-r3/auswerten.py "$Z/$NACH"/e*.json
