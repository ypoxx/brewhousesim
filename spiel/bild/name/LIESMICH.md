# spiel/bild/name/

Gehört **DEM NAMEN** (Zuständigkeit §14). Der Rest von `spiel/bild/` bleibt DER STADT,
einschließlich der vier Platten, des Hofbaukastens und der Ortsmarken. Wer hier ein
Verzeichnis aufzählt, um daraus Bauwerke abzuleiten, überspringt diesen Ordner.

## Vier Bilder, vier Träger-Medien

| Datei | Epoche | Was es ist | Ort aus `kern/orte.js` |
|---|---|---|---|
| `zeiger1.png` | 1350 | **Bierzeiger** — Stange mit Strohkranz und Ankerbrett | `sudhaus` |
| `schild2.png` | 1600 | **Wirtshausschild** — geschmiedeter Ausleger, Anker auf Grün | `lindenhof` und jede Adresse mit Schild |
| `saeule3.png` | 1884 | **Litfaßsäule** mit lithografischen Plakaten | `marktplatz` |
| `tafel4.png` | 1970 | **Werbetafel am Straßenrand**, dazu Bierkästen | `strasse` |

Jedes Bild erscheint **nur, wenn der zugehörige Träger wirklich läuft**
(`bildWenn` in `stuecke/name-daten.js`) und **nicht**, solange das Zeichen verdeckt ist.
Ein Etikett klebt am Fass und steht deshalb nicht in der Stadt — in 1884 zeigt die Platte
die Säule nur, wenn die Säule gemietet ist.

## Wie sie entstanden sind

`design/tools/gen_image.py` (`gemini-3-pro-image`, `--aspect 1:1 --resolution 2K`,
`--ref spiel/bild/platte-1884.jpg`, damit Strich, Palette und Blickwinkel zur Platte
passen), erzeugt auf vollflächigem Magenta und danach freigestellt: globaler
Magenta-Test statt Flutfüllung vom Rand (sonst bleibt die Fläche *innerhalb* des
Strohkranzes und zwischen den Voluten stehen), weiche Kante über die
Magentahaftigkeit, Entfärben des Saums, nur die größte zusammenhängende Fläche
behalten, dann zuschneiden und auf 760 px längste Kante.

## Der Maßstab — nachgemessen, nicht geschätzt

Es gilt dieselbe Regel wie für den Hofbaukasten der STADT: **wer etwas neben Figuren
stellt, wird an den Figuren der Platte gemessen.** Die erste Fassung war überall
etwa doppelt bis achtfach zu groß; die Litfaßsäule maß vierzehn Meter.

| Bild | `breite` (% der Bühne) | Höhe am Schuss | Mensch daneben | Ergibt |
|---|---|---|---|---|
| `zeiger1` | 5,5 | 151 px | Magd am Tor 72 px | Stange rund 3,5 m |
| `schild2` | 2,4 | 64 px | Leute an der Brücke 55 px | Ausleger rund 2 m |
| `saeule3` | 1,4 | 94 px | Leute am Markt 45 px | Säule rund 3,6 m |
| `tafel4` | 4,6 | 145 px | Auto 110 px lang (4,2 m) | Tafel rund 4,8 m breit |

Gemessen an einem Schuss in 2752×1536, nicht am Bildschirmfenster.

## Ortsmarken

Jedes Element, das dieses Stück auf die Platte setzt, trägt `data-frei="name"` —
**vollständig, nicht halb** (Zuständigkeit §10). Das gilt für das Hauptzeichen, für
jedes Nebenschild an einer Adresse, für das nachgeahmte Zeichen des Adlers und für
dessen Beschriftung. Das Pflock-System der STADT lässt sie damit in Ruhe.
