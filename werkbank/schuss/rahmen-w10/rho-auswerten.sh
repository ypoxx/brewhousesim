#!/usr/bin/env bash
# rho NACHHER auswerten: drei Schnitte je Lauf + Jahre unter 1x.
cd "$(dirname "$0")/../../.."
Z=werkbank/schuss/rahmen-w10
{
  echo "=== DREI SCHNITTE (fuhre-w6/schnitte.py) ==="
  python3 werkbank/schuss/fuhre-w6/schnitte.py $Z/rho-nachher
  echo
  echo "=== JAHRE UNTER 1x und Spannweite (rueckkopplung-r3/auswerten.py) ==="
  python3 werkbank/schuss/rueckkopplung-r3/auswerten.py $Z/rho-nachher/e*.json \
    | grep -E "EPOCHE|<1x|SPEARMAN|LATTE"
} | tee $Z/rho-nachher.txt
