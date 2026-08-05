#!/usr/bin/env bash
# ALLES SEQUENZIELL, jeder Lauf EINZELN durchs Messfenster. Nach Wichtigkeit.
cd /home/user/brewhousesim
Z=werkbank/schuss/sud-blind-r2
mkdir -p "$Z/lage" "$Z/rho" "$Z/spiel"
lauf () {
  f="$1"; shift
  [ -s "$f" ] && { echo "== $f schon da"; return; }
  echo "== $(date -u +%H:%M:%S) START $f"
  HAFEN=8901 werkbank/schuss/aufsicht/messfenster.sh "$@"
  echo "== $(date -u +%H:%M:%S) ENDE  $f rc=$?"
}
# 1) DIE KLEMME ueber viele Wochen + DIE PREISSCHILDER, Brett aufgeschlagen
for ep in 1 2 3 4; do
  lauf "$Z/lage/auf-e$ep.json" env BRETT=auf node $Z/sudlage.mjs $ep 400 "$Z/lage/auf-e$ep.json"
done
# 2) KANN MAN ES SPIELEN — echtes Klickprotokoll, 5 Braujahre je Epoche
for ep in 1 2 3 4; do
  lauf "$Z/spiel/e$ep.json" node $Z/spielen.mjs $ep 150 "$Z/spiel/e$ep.json"
done
# 3) LATTE 2 — drei Laeufe je Epoche als Geraetekontrolle
for ep in 1 2 3 4; do
  for b in A B C; do
    lauf "$Z/rho/e${ep}-${b}.json" node werkbank/schuss/rueckkopplung-r3/linie.mjs $ep 400 "$Z/rho/e${ep}-${b}.json"
  done
done
echo "== SATZ FERTIG $(date -u +%H:%M:%S)"
