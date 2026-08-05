#!/usr/bin/env bash
# AUFSETZEN — stellt beide Haefen der Knopfboden-Probe her und startet sie.
#
#   werkbank/schuss/aufsicht/knopfboden-probe/aufsetzen.sh
#
# Idempotent. Nach JEDEM Container-Reset einmal aufrufen; fertige Laeufe
# werden uebersprungen.
#
# WARUM ES DAS GIBT: zwischen dem 4. und 5. August 2026 wurde der Container
# stuendlich zurueckgesetzt. Jedes Mal waren /tmp, beide Messstaende und der
# laufende Satz weg — und der Aufbau steckte im Kopf der Aufsicht statt in
# einer Datei. Dreimal von Hand nachgebaut ist zweimal zu oft.
set -uo pipefail
cd "$(dirname "$0")/../../../.."

SHA=517ca3f
Z=werkbank/schuss/aufsicht/knopfboden-probe

# ---- Hafen 8901: der Stand MIT Boden, unveraendert
./werkbank/schuss/aufsicht/messstand.sh $SHA 8901 >/dev/null 2>&1

# ---- Hafen 8902: derselbe Stand, Knopfboden ausgebaut
ORT=/tmp/probe-knopfboden/$SHA
if [ "$(curl -s -m 5 http://127.0.0.1:8902/.messstand-marke 2>/dev/null)" != "$SHA-ohne-boden" ]; then
  rm -rf "$ORT"; mkdir -p "$ORT"
  git archive $SHA | tar -x -C "$ORT" || { echo "git archive fehlgeschlagen" >&2; exit 1; }
  python3 - "$ORT/spiel/stil/grund.css" <<'PY' || exit 1
import sys
p=sys.argv[1]; s=open(p).read()
alt="""@media (max-width: 2751px), (max-height: 1535px) {
  #buehne .knopf,
  #buehne [data-zug] {
    min-width: 24px;
    min-height: 24px;
  }
}"""
if alt not in s:
    print("Knopfboden-Block nicht gefunden — Probe waere sinnlos", file=sys.stderr); sys.exit(1)
open(p,'w').write(s.replace(alt,"/* PROBE: Knopfboden AUSGEBAUT. Nie ausgeliefert, nie committet. */",1))
PY
  echo "$SHA-ohne-boden" > "$ORT/.messstand-marke"
  # Alten Horcher auf 8902 nur ueber den Hafen finden, nie ueber ein Textmuster.
  if command -v fuser >/dev/null 2>&1; then
    P=$(fuser -n tcp 8902 2>/dev/null | tr -s ' ' '\n' | grep -E '^[0-9]+$' | head -1)
    [ -n "$P" ] && kill "$P" 2>/dev/null && sleep 1
  fi
  ( cd "$ORT" && setsid nohup python3 -m http.server 8902 --bind 127.0.0.1 \
      >>/tmp/probe-8902.log 2>&1 </dev/null & disown ) >/dev/null 2>&1
  sleep 2
fi

# ---- beide Marken pruefen, sonst gar nicht erst messen
A=$(curl -s -m 5 http://127.0.0.1:8901/.messstand-marke)
B=$(curl -s -m 5 http://127.0.0.1:8902/.messstand-marke)
if [ "$A" != "$SHA" ] || [ "$B" != "$SHA-ohne-boden" ]; then
  echo "MARKEN FALSCH: 8901='$A' 8902='$B' — nicht gestartet" >&2
  exit 1
fi
echo "8901=$A  8902=$B"

# ---- laeuft schon eine Probe? Dann nicht zwei nebeneinander.
if pgrep -f 'knopfboden-probe/probe\.sh' >/dev/null 2>&1; then
  echo "Probe laeuft bereits"; exit 0
fi
setsid nohup "$Z/probe.sh" >/dev/null 2>&1 & disown
sleep 2
echo "Probe gestartet"
