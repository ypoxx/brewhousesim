#!/usr/bin/env bash
# DER ABSCHLUSS DER PHASE 0 — alles, was auf eine freie Maschine gewartet hat.
#
#   werkbank/schuss/aufsicht/p0-abschluss.sh [hafen]
#
# Nacheinander, agentenlos, an EINEM eingefrorenen Stand: dem heutigen Kopf.
# Gemessen wird gegen die Abnahmereihe der Welle 13 am Stand `b098fc6`, die in
# `welle13-gegen/wdh/` liegt und je Epoche eine einzige Pruefsumme traegt.
#
# WAS SEIT b098fc6 AM SPIEL GEAENDERT WURDE — und was der Stapel daher belegen
# muss:
#   * `sud.js`: die verdeckte `fuelle`-Deklaration heisst jetzt `fuelleRueck`
#     (T0.10). Damit werden {nr} und {ab} in den 1970er Ruecklaeufertexten
#     wirklich ersetzt. Das ist eine TEXTaenderung — sie darf die Partie nicht
#     um einen Pfennig bewegen.
#   * `bild/gegner/hof3.png` und `hof4.png` geloescht (T0.4). Sie wurden nie
#     gezeichnet; nichts darf sie vermissen.
#   * die Messgeraete tragen `&neu=1` (T0.5). Der Schalter raeumt localStorage;
#     unter Playwright war er ohnehin leer. Auch das darf nichts bewegen.
#
# Die Schwelle dafuer steht in `werkbank/KURZLAUF-EICHUNG.md`, festgeschrieben
# BEVOR diese Zahlen vorlagen: 100 Wochen, Pruefsumme ueber die Felder der
# Klasse *Partie*. Der Kurzlauf ist ein VETO, kein Freispruch.
set -uo pipefail
cd "$(dirname "$0")/../../.."
HAFEN=${1:-8935}
A=werkbank/schuss/aufsicht
D=$A/p0-abschluss
mkdir -p "$D"
LOG=$D/lauf.log

echo "=== P0-ABSCHLUSS $(date -u +%H:%M:%S) ===" | tee "$LOG"
./werkbank/schuss/aufsicht/messstand.sh HEAD "$HAFEN" 2>&1 | tee -a "$LOG" || exit 1

lauf () {  # lauf <schlussdatei> <name> <befehl…>
  local ziel=$1 name=$2; shift 2
  [ -s "$ziel" ] && { echo "$name: liegt schon vor" | tee -a "$LOG"; return 0; }
  local t0=$(date +%s)
  timeout 1800 "$@" >>"$LOG" 2>&1
  [ -s "$ziel" ] && echo "$name: fertig ($(( $(date +%s) - t0 ))s)" | tee -a "$LOG" \
                 || echo "$name: GESCHEITERT nach $(( $(date +%s) - t0 ))s" | tee -a "$LOG"
}

echo "--- 1/5 · Stufe 0: das Tor (vier Epochen laden, lage 0, keine Konsolenfehler)" | tee -a "$LOG"
HAFEN=$HAFEN node "$A/tor.mjs" 2>&1 | tee -a "$LOG" | tail -6
TOR=${PIPESTATUS[0]}
echo "Tor-Ausgang: $TOR" | tee -a "$LOG"

echo "--- 2/5 · Kurzlauf 100 Wochen je Epoche (T0.5/T0.10/T0.4-Beweis)" | tee -a "$LOG"
for E in 1 2 3 4; do
  lauf "$D/kurz-e$E.json" "kurz e$E" \
       env HAFEN=$HAFEN node werkbank/schuss/rueckkopplung-r3/linie.mjs "$E" 100 "$D/kurz-e$E.json"
done

echo "--- 3/5 · Vergleich gegen die Abnahmereihe b098fc6, Felder der Klasse Partie" | tee -a "$LOG"
python3 - "$D" 2>&1 | tee -a "$LOG" <<'PY'
import json, sys, hashlib, os
D = sys.argv[1]
PARTIE = ('jahr','woche','kasse','rohstoff','faesser','plaetze','amtszeit')
def reihe(p, n=100):
    d = json.load(open(p))
    return [tuple(w.get(k) for k in PARTIE) for w in (d.get('reihe') or [])][:n]
riss = 0
print(f"{'Epoche':8}{'vorher (b098fc6)':>20}{'heute':>12}{'Urteil':>12}")
for e, alt in ((1,'e1-A'), (2,'e2-A'), (3,'e3-A'), (4,'e4-A')):
    a = f'werkbank/schuss/aufsicht/welle13-gegen/wdh/{alt}.json'
    b = f'{D}/kurz-e{e}.json'
    if not (os.path.exists(a) and os.path.exists(b)):
        print(f'{e:<8}{"— Datei fehlt":>32}'); riss += 1; continue
    ra, rb = reihe(a), reihe(b)
    ha = hashlib.md5(repr(ra).encode()).hexdigest()[:8]
    hb = hashlib.md5(repr(rb).encode()).hexdigest()[:8]
    ok = ra == rb
    if not ok:
        riss += 1
        for i,(x,y) in enumerate(zip(ra,rb)):
            if x != y:
                print(f'   erste Abweichung in Woche {i+1}: {x} gegen {y}'); break
    print(f'{e:<8}{ha:>20}{hb:>12}{"gleich" if ok else "ABWEICHUNG":>12}')
print()
print('URTEIL: die Partie hat sich nicht bewegt' if not riss
      else f'URTEIL: {riss} Epoche(n) abgewichen — VOLLE ABNAHME noetig, der Kurzlauf ist ein Veto')
PY

echo "--- 4/5 · E3-Doppelbuchung: wiederkehr sechsfach (GEGENZUG-Warnzettel)" | tee -a "$LOG"
for L in A B C D E F; do
  Z="$D/wiederkehr-e3-$L.json"
  [ -s "$Z" ] && continue
  HAFEN=$HAFEN timeout 300 node werkbank/schuss/spiel-w12/wiederkehr.mjs 3 >>"$LOG" 2>&1
  cp werkbank/schuss/spiel-w12/protokoll/wiederkehr-e3.json "$Z" 2>/dev/null
  echo "e3-$L: $( [ -s "$Z" ] && md5sum < "$Z" | cut -c1-12 || echo GESCHEITERT )" | tee -a "$LOG"
done
python3 - "$D" 2>&1 | tee -a "$LOG" <<'PY'
import json, glob, sys
fs = sorted(glob.glob(f'{sys.argv[1]}/wiederkehr-e3-*.json'))
schief = []
for f in fs:
    d = json.load(open(f))
    a, b = d.get('nachSpielen') or {}, d.get('nachNeuladen') or {}
    ab = [k for k in ('jahr','woche','kasse','faesser','chronik','protokoll') if a.get(k) != b.get(k)]
    if ab: schief.append((f.split('/')[-1], ab, [(a.get(k), b.get(k)) for k in ab]))
print(f'wiederkehr e3: {len(fs)} Laeufe, {len(schief)} mit Abweichung')
for n, ab, w in schief: print('  ', n, ab, w)
print('URTEIL: der E3-Verdacht ist ausgeraeumt' if fs and not schief
      else 'URTEIL: der E3-Verdacht BESTEHT — Doppelbuchung beim Fortsetzen' if schief
      else 'URTEIL: keine Messung')
PY

echo "--- 5/5 · Gewichtsveto, beide Lesarten" | tee -a "$LOG"
HAFEN=$HAFEN node "$A/gewicht-gegenprobe.mjs" 2>&1 | tee -a "$LOG" | tail -12

echo "=== P0-ABSCHLUSS DURCH $(date -u +%H:%M:%S) ===" | tee -a "$LOG"
