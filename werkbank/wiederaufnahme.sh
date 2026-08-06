#!/usr/bin/env bash
# WIEDERAUFNAHME — stellt den laufenden Gauntlet Loop nach einem Container-Reset her.
#
#   werkbank/wiederaufnahme.sh          # prüfen und herstellen
#   werkbank/wiederaufnahme.sh --pruefe # nur berichten, nichts anfassen
#
# Warum es das gibt: Der Container wird regelmäßig zurückgesetzt. `git reset --hard`
# holt die DATEIEN zurück — aber nicht die laufenden Prozesse, und nicht das Wissen
# darüber, welche es überhaupt gab. Am 2. August ist genau das passiert: der Stand auf
# der Fortschrittsseite blieb vier Stunden lang auf einem Befund stehen, der schon
# widerlegt war, und der Veröffentlicher lief nicht mehr, während vier Builder
# arbeiteten, die selbst kein git dürfen.
#
# Alles hier ist idempotent. Zweimal laufen lassen schadet nie.

set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

ZWEIG=claude/brauhaus-imperium-sim-163s85
HAFEN=8899
NUR_PRUEFEN=0
[ "${1:-}" = "--pruefe" ] && NUR_PRUEFEN=1

ok()   { printf '  \033[32m✓\033[0m %s\n' "$*"; }
tat()  { printf '  \033[33m→\033[0m %s\n' "$*"; }
weh()  { printf '  \033[31m✗\033[0m %s\n' "$*"; }

echo "WIEDERAUFNAHME — $(date -u '+%Y-%m-%d %H:%M UTC')"

# ---------------------------------------------------------------- 1 · der Baum
if [ ! -d werkbank ] || [ ! -d spiel/stuecke ]; then
  weh "Arbeitsbaum fehlt — hole $ZWEIG"
  [ $NUR_PRUEFEN -eq 1 ] || { git fetch origin "$ZWEIG" && git reset --hard "origin/$ZWEIG"; }
else
  ok "Arbeitsbaum steht ($(git rev-parse --short HEAD))"
fi

# ------------------------------------------------------- 2 · nicht gesicherte Arbeit
OFFEN=$(git status --short | wc -l)
if [ "$OFFEN" -gt 0 ]; then
  weh "$OFFEN Datei(en) uncommittet — die Builder dürfen kein git, also muss die Aufsicht"
  git status --short | sed 's/^/      /'
  echo "      → erst prüfen (alle vier Epochen laden, BRAUHAUS.lage 0), dann:"
  echo "        flock werkbank/.gitsperre bash -c 'git add -A && git commit -F <datei> && git push'"
else
  ok "nichts liegt herum"
fi
# ZUERST HOLEN, DANN VERGLEICHEN. Bis zum 4. August verglich diese Stelle HEAD
# nur gegen die LOKALE Remote-Referenz. Nach einem Container-Reset, der einen
# alten Klon zurueckbringt, ist die genauso alt wie der Baum — das Skript
# meldete dann "origin ist auf Stand", waehrend origin zwei Commits VORAUS war.
# In der Nacht zum 4.8. sah es deshalb so aus, als waeren die Reparatur von
# messstand.sh und das fertige Urteil DER PREIS verloren; beide lagen laengst
# auf origin. Wer daraufhin neu baut, macht die Arbeit doppelt — oder
# ueberschreibt sie. Ein Holen kostet hier 14 Sekunden.
# NACHTRAG 4. August, 20:23 UTC — DERSELBE FEHLER EINE EBENE TIEFER.
# Nach dem sechsten Container-Reset stand der Baum auf einem Commit vom
# 3. August 23:16, origin auf dem Stand von 19:2x — und dieses Skript meldete
# "origin ist auf Stand". Ursache: `git fetch … 2>/dev/null || true` hat einen
# FEHLGESCHLAGENEN Fetch verschluckt (zwei Minuten nach dem Boot gab es noch
# kein Netz). Der Vergleich lief danach gegen die mitrestaurierte, genauso alte
# Referenz origin/<zweig> — 0 voraus, 0 zurueck, gruener Haken.
#
# Ein Vergleich, der nicht holen konnte, ist KEIN Freibrief. Deshalb wird der
# Fetch jetzt bis zu dreimal versucht und sein Scheitern LAUT gemeldet, statt
# unter einem Haken zu verschwinden. Ein Messgeraet, das im Fehlerfall
# schweigt, hat diesen Lauf schon fuenfmal in die Irre gefuehrt.
GEHOLT=0
if [ $NUR_PRUEFEN -eq 1 ]; then
  GEHOLT=1
else
  for _v in 1 2 3; do
    if git fetch -q origin "$ZWEIG" 2>/dev/null; then GEHOLT=1; break; fi
    sleep $((_v * 3))
  done
fi
VORAUS=$(git rev-list --count "origin/$ZWEIG..HEAD" 2>/dev/null || echo '?')
ZURUECK=$(git rev-list --count "HEAD..origin/$ZWEIG" 2>/dev/null || echo '?')
if [ $GEHOLT -eq 0 ]; then
  weh "origin NICHT erreichbar — dreimal versucht. Der Vergleich unten ist WERTLOS."
  echo "      Der Baum kann beliebig alt sein und es sieht wie 'auf Stand' aus."
  echo "      → später erneut: git fetch origin $ZWEIG && $0"
  echo "      lokal: HEAD $(git rev-parse --short HEAD), letzte bekannte Referenz $(git rev-parse --short "origin/$ZWEIG" 2>/dev/null || echo '?')"
elif [ "$VORAUS" = "0" ] && [ "$ZURUECK" = "0" ]; then
  ok "origin ist auf Stand"
elif [ "$ZURUECK" != "0" ] && [ "$ZURUECK" != "?" ]; then
  weh "origin ist $ZURUECK Commit(s) VORAUS — der Baum ist alt, nicht origin"
  echo "      → git fetch origin $ZWEIG && git reset --hard origin/$ZWEIG"
  [ "$VORAUS" != "0" ] && [ "$VORAUS" != "?" ] && \
    echo "      ACHTUNG: dazu $VORAUS eigene(r) Commit(s), die origin nicht hat — erst sichern"
else
  weh "$VORAUS Commit(s) noch nicht gepusht"
fi

# ------------------------------------------------- 3 · verwaiste Git-Sperre lösen
if [ -f .git/index.lock ] && ! pgrep -x git >/dev/null 2>&1; then
  weh ".git/index.lock liegt verwaist da (kein git-Prozess)"
  [ $NUR_PRUEFEN -eq 1 ] || { rm -f .git/index.lock && tat "entfernt"; }
fi

# ----------------------------------------------------------- 4 · der Webserver
# Die Kritiker spielen das Spiel über http; ohne ihn misst niemand etwas.
if curl -s -o /dev/null -m 3 "http://127.0.0.1:$HAFEN/spiel/"; then
  ok "Server auf :$HAFEN"
else
  weh "Server auf :$HAFEN antwortet nicht"
  if [ $NUR_PRUEFEN -eq 0 ]; then
    (setsid nohup python3 -m http.server "$HAFEN" >/tmp/srv.log 2>&1 </dev/null &)
    sleep 2
    curl -s -o /dev/null -m 3 "http://127.0.0.1:$HAFEN/spiel/" && tat "gestartet" || weh "Start fehlgeschlagen"
  fi
fi

# ------------------------------------------------------- 5 · der Veröffentlicher
# Der einzige Prozess, der pushen darf. Ohne ihn steht die Fortschrittsseite still,
# während der Lauf weiterarbeitet — und beim nächsten Reset ist alles weg.
# NICHT `pgrep -fc … || echo 0`: pgrep gibt bei null Treffern die Zeile "0" aus
# UND endet mit Status 1, also feuert das `|| echo 0` zusätzlich — heraus kommt
# "0\n0", und jeder Vergleich danach bricht mit "integer expression expected".
# Am 3.8. passiert, genau in dem Lauf, in dem der Veröffentlicher tot war.
ANZ=$(pgrep -f 'veroeffentlichen\.sh' 2>/dev/null | wc -l)
if [ "$ANZ" -eq 1 ]; then
  ok "Veröffentlicher läuft"
elif [ "$ANZ" -gt 1 ]; then
  weh "$ANZ Veröffentlicher — die jüngeren gezielt per PID beenden, nie pkill mit Muster"
  pgrep -f 'veroeffentlichen\.sh' | sed 's/^/      PID /'
elif [ "$ZURUECK" != "0" ] && [ "$ZURUECK" != "?" ]; then
  # KEIN VERÖFFENTLICHER AUF EINEM ALTEN BAUM. Beim siebzehnten Reset am
  # 6. August stand der Baum 333 Commits zurück, und dieses Skript hat ihm
  # ahnungslos einen Veröffentlicher danebengestellt. Der committet `-A` über
  # die ganze Werkbank: hätte in diesem Baum irgendwer eine Datei angefasst,
  # wäre 333 Commits Arbeit als Rücknahme auf origin gelandet — automatisch,
  # alle drei Minuten, ohne dass jemand hinsieht.
  weh "kein Veröffentlicher — und er wird hier auch NICHT gestartet"
  echo "      Der Baum ist $ZURUECK Commit(s) alt. Reihenfolge:"
  echo "      1. laufende Veröffentlicher per PID beenden"
  echo "      2. git reset --hard origin/$ZWEIG"
  echo "      3. $0 erneut — dann startet er von selbst"
else
  weh "kein Veröffentlicher"
  [ $NUR_PRUEFEN -eq 1 ] || {
    (setsid nohup ./werkbank/veroeffentlichen.sh 180 14400 >/tmp/pub.log 2>&1 </dev/null &)
    sleep 3; tat "gestartet (Takt 180 s, Laufzeit 4 h)"
  }
fi

# ------------------------------------------------------------ 6 · der Auftrag
echo
if [ -f werkbank/LAUFENDER-AUFTRAG.md ]; then
  ok "Auftrag steht in werkbank/LAUFENDER-AUFTRAG.md — DIESE DATEI JETZT LESEN"
  # Nicht auf eine feste Überschrift festnageln — die wandert, wenn eine neue
  # Welle anfängt. Am 2.8. hat genau das den Auszug stumm gemacht: das Skript
  # suchte "## Wo der Lauf steht", während oben "## Welle 3 läuft" stand.
  # Genommen wird der erste Abschnitt NACH der Grundaufgabe, also der jüngste.
  awk '/^## /{n++} n>=2 && n<3' werkbank/LAUFENDER-AUFTRAG.md | head -22 | sed 's/^/      /'
else
  weh "werkbank/LAUFENDER-AUFTRAG.md fehlt — ohne ihn weiß niemand, was der Lauf tut"
fi

echo
echo "  Stand der Fortschrittsseite: $(python3 -c "import json;print(json.load(open('werkbank/stand.json'))['stand'])" 2>/dev/null || echo '?')"
echo "  Ist er älter als ein paar Stunden, ist er gelogen: ./werkbank/stand.py phase \"...\""
