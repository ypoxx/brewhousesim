#!/usr/bin/env bash
# Schiebt den Stand des laufenden Gauntlet Loops regelmaessig nach GitHub, damit
# Netlify die Fortschrittsseite neu baut und der Auftraggeber vom Handy zusehen
# kann, ohne dass jemand nachfragt.
#
# Die Agenten im Lauf duerfen selbst nicht committen — parallele Schreiber
# zerlegen sonst den Git-Index. Also tut es dieser eine Prozess, unter einer
# Sperre, die sich die Aufsicht mit ihm teilt.
#
#   werkbank/veroeffentlichen.sh [sekunden-zwischen-laeufen] [gesamtdauer-sekunden]
#
# Standard: alle 3 Minuten, hoechstens 5 Stunden.

set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

TAKT=${1:-180}
ENDE=$(( $(date +%s) + ${2:-18000} ))
ZWEIG=$(git rev-parse --abbrev-ref HEAD)
SPERRE=werkbank/.gitsperre

echo "veroeffentliche $ZWEIG alle ${TAKT}s"

while [ "$(date +%s)" -lt "$ENDE" ]; do
  sleep "$TAKT"

  (
    flock -w 120 9 || exit 0

    # Nur Pfade uebergeben, die es wirklich gibt: "git add" bricht bei einem
    # einzigen unbekannten Pfad komplett ab und stellt dann gar nichts bereit —
    # lautlos, wenn man den Fehler wegwirft. Genau daran hat dieser Prozess in
    # seiner ersten Fassung eine Viertelstunde lang nichts veroeffentlicht.
    # Werkzeuge der Werkbank und die Gauntlet-Papiere gehoeren mit dazu: ein
    # Bauer, der sich ein Skript schreibt, legt es nach werkbank/ — das lag
    # sonst nur lokal und waere beim naechsten Container-Reset weg gewesen.
    # werkbank/urteile GEHOERT DAZU, und das war es lange nicht. Die Laufregel
    # sagt Buildern und Kritikern, sie sollen Teilergebnisse LAUFEND in ihre
    # Urteils- oder Berichtsdatei schreiben, statt erst am Ende — weil Agenten
    # mitten im Lauf sterben. Genau dieses Verzeichnis war als einziges unter
    # werkbank/ von der Liste hier nicht gedeckt. Ein Kritiker, der zwei Stunden
    # misst und laufend schreibt, haette bei einem Container-Reset alles
    # verloren, waehrend die Regel ihm sagte, er sei sicher. Am 4. August von
    # der Aufsicht bemerkt und geschlossen.
    PFADE=()
    shopt -s nullglob
    # Und werkbank/*.md, seit am 6. August dasselbe Loch eine Ebene hoeher
    # auffiel: LAUFENDER-AUFTRAG.md, das Zustandsdokument des ganzen Laufs, war
    # von dieser Liste nie erfasst. Es hing allein an den Handcommits der
    # Aufsicht — und zwischen zweien davon liegt regelmaessig ein Reset.
    for p in werkbank/stand.json werkbank/schuss werkbank/urteile spiel gauntlet \
             werkbank/*.py werkbank/*.mjs werkbank/*.sh werkbank/*.md; do
      [ -e "$p" ] && PFADE+=("$p")
    done
    shopt -u nullglob
    [ ${#PFADE[@]} -eq 0 ] && exit 0

    git add -A -- "${PFADE[@]}" || exit 0
    if git diff --cached --quiet; then
      exit 0
    fi

    STUECKE=$(python3 -c "
import json,pathlib
p = pathlib.Path('werkbank/stand.json')
d = json.loads(p.read_text()) if p.is_file() else {}
s = d.get('stuecke', [])
fertig = sum(1 for x in s if x.get('status') == 'bestanden')
print(f\"{d.get('phase','')} — {fertig}/{len(s)} bestanden\" if s else d.get('phase',''))
" 2>/dev/null || echo "Stand des Laufs")

    git -c user.name="Claude" -c user.email="noreply@anthropic.com" \
        commit -q -m "Werkbank: ${STUECKE}" \
        -m "Automatischer Zwischenstand des laufenden Gauntlet Loops." \
        -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"

    for i in 1 2 3 4; do
      git push -q origin "$ZWEIG" 2>/dev/null && break
      sleep $(( 2 ** i ))
    done
  ) 9>"$SPERRE"

  # SICH SELBST NEU LADEN. Bis zum 5. August lief dieser Prozess mit der
  # Fassung, die beim Start auf der Platte lag — und `wiederaufnahme.sh`
  # startet ihn, BEVOR der Baum aus origin zurueckgeholt ist. Nach einem
  # Container-Reset lief also die ALTE Fassung weiter, auch nachdem die neue
  # laengst im Baum stand.
  #
  # Gekostet hat das die Sicherung von `werkbank/urteile/`: drei Commits am
  # Nachmittag des 5. August nahmen ausschliesslich `werkbank/schuss/` mit,
  # waehrend zwei fertige Urteile stundenlang uncommittet dastanden. Gefunden
  # hat es der blinde Kritiker DER PREIS, der seine eigene Datei nicht in den
  # Commits wiederfand — und sich vorsorglich eine Zweitschrift anlegte.
  #
  # `exec` ersetzt den Prozess durch die Fassung, die JETZT auf der Platte
  # liegt. Damit heilt jeder Baum-Wiederherstellung auch diesen Prozess, ohne
  # dass jemand daran denken muss. Die verbleibende Laufzeit wird
  # weitergereicht, damit die vier Stunden nicht bei jedem Takt neu beginnen.
  REST=$(( ENDE - $(date +%s) ))
  [ "$REST" -gt "$TAKT" ] && exec "$0" "$TAKT" "$REST"
done

echo "fertig"
