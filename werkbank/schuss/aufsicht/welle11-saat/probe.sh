#!/usr/bin/env bash
# DIE ENTSCHEIDENDE FRAGE DER WELLE 11: laeuft 1350 auseinander?
# DIE FUHRE meldet +0,191 gegen -0,160 in zwei von zwei Laeufen auf ihrem
# Stand, auf dem Vorzustand nicht. Die Aufsicht misst 1350 DREIMAL EINZELN
# am eingefrorenen Integrationsstand. Drei gleiche md5 = die Welle ist
# abnehmbar; drei verschiedene = sie ist es nicht.
cd "$(dirname "$0")/../../../.."
Z=werkbank/schuss/aufsicht/welle11-saat/rho
M=$(curl -s -m 5 http://127.0.0.1:8909/.messstand-marke)
[ -z "$M" ] && { echo "!!! Hafen 8909 tot" >> $Z/../lauf.log; exit 1; }
mkdir -p $Z
for L in A B C; do
  [ -s $Z/e1-$L.json ] && continue
  HAFEN=8909 MESSFENSTER_WARTE=7200 werkbank/schuss/aufsicht/messfenster.sh \
    node werkbank/schuss/rueckkopplung-r3/linie.mjs 1 400 $Z/e1-$L.json >> $Z/../lauf.log 2>&1
  [ -s $Z/e1-$L.json ] && echo "--- e1-$L OK ($M) $(date -u +%H:%M:%S)" >> $Z/../lauf.log \
                       || echo "!!! e1-$L KEINE DATEI" >> $Z/../lauf.log
done
echo "FERTIG" >> $Z/../lauf.log
