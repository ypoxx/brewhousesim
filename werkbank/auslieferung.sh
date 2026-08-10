#!/usr/bin/env bash
# DIE AUSLIEFERUNG — stellt zusammen, was Netlify veroeffentlichen darf.
#
#   bash werkbank/auslieferung.sh          (ruft Netlify als Build-Befehl auf)
#
# Warum es das gibt (Entscheidung F7, Release-Schnitt vom 8. August 2026):
# Bis heute stand in netlify.toml `publish = "."`. Damit lag die GANZE
# Repo-Wurzel oeffentlich im Netz — 186 MB `design/`, 146 MB `werkbank/` samt
# interner Urteile, Bauberichte und Messrohdaten, 18 MB `zielbild/`. Das war
# nie beabsichtigt; es war die Vorgabe, die niemand angefasst hat, solange die
# Seite nur eine Werkstattseite war.
#
# Ausgeliefert wird ab jetzt (T2.1, Startseite gebaut):
#
#   spiel/**               das Spiel, unveraendert
#   index.html              die neue STARTSEITE (aus start/index.html)
#   impressum.html           die Unterseite (aus start/impressum.html)
#   datenschutz.html         die Unterseite (aus start/datenschutz.html)
#   favicon.png, og.png      Bildchen der Startseite (aus start/)
#   werkstatt.html          die bisherige Werkstattseite (Fortschrittsseite,
#                            bisher an der Wurzel index.html) — zieht um,
#                            weil index.html jetzt der Startseite gehoert
#   werkbank/stand.json      der Spiegel, den die Werkstattseite liest
#
# DIE FALLE, DIE HIER SCHON EINMAL ZUGESCHNAPPT IST, und deshalb steht sie
# hier: am 3. August starb die Werkstattseite still, weil ihre Deploy-Vorschau
# an einem geschlossenen Pull Request hing. Der Auftraggeber sah stundenlang
# einen alten Stand und hielt ihn fuer aktuell. **Eine Seite, die stehenbleibt,
# ohne es zu sagen, ist schlimmer als gar keine.** Darum prueft dieses Skript
# am Ende selbst nach, ob alles wirklich im Ausgabeverzeichnis liegt, und
# bricht sonst laut ab — ein fehlgeschlagener Build ist sichtbar, ein
# stiller Teil-Deploy nicht.
#
# `werkbank/stand.json` traegt oben ein Feld `stand` mit dem Zeitstempel. Steht
# dort etwas Altes, waehrend gearbeitet wird, zeigt die Seite eine Luege —
# dann `./werkbank/stand.py phase "..."` nachziehen, nicht dieses Skript
# verdaechtigen.
set -euo pipefail
cd "$(dirname "$0")/.."

ZIEL=auslieferung

rm -rf "$ZIEL"
mkdir -p "$ZIEL/werkbank"

cp -R spiel "$ZIEL/spiel"

# Die alte Wurzel-index.html ist die Werkstatt-/Fortschrittsseite (Gauntlet
# Loop). Sie bleibt erreichbar, zieht aber auf /werkstatt.html um, weil
# /index.html jetzt der neuen Startseite (T2.1) gehoert.
cp index.html "$ZIEL/werkstatt.html"

# Die neue Startseite und ihre Unterseiten (T2.1/T2.2/T2.3), jede eine
# eigenstaendige Datei ohne Build-Schritt.
cp start/index.html "$ZIEL/index.html"
cp start/impressum.html "$ZIEL/impressum.html"
cp start/datenschutz.html "$ZIEL/datenschutz.html"
cp start/favicon.png "$ZIEL/favicon.png"
cp start/og.png "$ZIEL/og.png"

cp werkbank/stand.json "$ZIEL/werkbank/stand.json"

# Die Werkpapiere unter `spiel/` gehen NICHT mit. `STAND.md`, `BEFUND-*.md`,
# `ZUSTAENDIGKEIT.md`, `LIESMICH.md` und die Ton-/Bildzettel sind interne
# Befunde und Hausordnung, kein Spiel — keine Zeile des Spiels laedt sie (im
# Quelltext stehen sie nur als Verweis im Kommentar). Das Kritikerblatt der
# Welle 13 fuehrt `spiel/BEFUND-*.md` und `spiel/STAND.md` ausdruecklich unter
# dem, was ein Blinder nicht sehen darf; oeffentlich ausliefern koennen wir sie
# dann erst recht nicht.
find "$ZIEL/spiel" -name '*.md' -type f -delete

# Nachsehen statt hoffen. Jede dieser Zeilen ist eine Seite, die sonst leer,
# tot oder eingefroren waere.
fehlt=0
for p in "$ZIEL/spiel/index.html" "$ZIEL/index.html" "$ZIEL/impressum.html" \
         "$ZIEL/datenschutz.html" "$ZIEL/werkstatt.html" "$ZIEL/favicon.png" \
         "$ZIEL/og.png" "$ZIEL/werkbank/stand.json"; do
  [ -s "$p" ] || { echo "AUSLIEFERUNG FEHLGESCHLAGEN: $p fehlt oder ist leer" >&2; fehlt=1; }
done
[ "$fehlt" = 0 ] || exit 1

# Und die Gegenprobe in die andere Richtung: nichts Internes darf mitgerutscht
# sein. `design/`, `zielbild/`, `prototyp/`, `gauntlet/`, `analyse/`,
# `feinkonzept/` und alles unter `werkbank/` ausser `stand.json` bleiben intern.
for p in design zielbild prototyp gauntlet analyse feinkonzept \
         werkbank/schuss werkbank/urteile werkbank/ohr werkbank/beleg; do
  [ -e "$ZIEL/$p" ] && { echo "AUSLIEFERUNG FEHLGESCHLAGEN: $p ist mitgerutscht" >&2; exit 1; }
done

echo "AUSLIEFERUNG steht: $(du -sh "$ZIEL" | cut -f1) in $(find "$ZIEL" -type f | wc -l) Dateien"
