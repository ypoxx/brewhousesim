# stadt-r8 — die Geräte der Nacharbeit zu Welle 7

Gebaut für die Auflagen 1 und 6 des blinden Kritikers.

| Datei | wofür |
|---|---|
| `hofdecke.mjs` | wie voll der Hof ist, **nur innerhalb der Mauerraute** gezählt (`K.boden`), je Tiefenband und je Drittel. `?bau=keine` gegen `?bau=alle`. |
| `daten-alt-bauen.mjs` | stellt `stadt-daten.js` im Stand VOR der Nacharbeit her, indem es genau elf Zeilen zurücknimmt. **Bricht ab**, wenn ein Muster fehlt. |
| `daten-alt-aufsetzen.sh` | Hafen 8896 aus einem Symlink-Wald, in dem nur `stadt-daten.js` alt ist — damit ist vorher/nachher ein A/B im selben Augenblick. |
| `hofdecke-ab-vor.json` · `-ab-nach.json` | die Messwerte dieses A/B. |

**Der Hof ist eine Raute**, kein Rechteck: Scheitel (29,9 | 78,5), links 0,49 und
rechts 0,45 px je px, gültig von x 16,0 bis 48,3. Wer über ein Rechteck zählt,
misst zu zwei Dritteln Fläche, auf der gar kein Hof ist.

Die `.png` hier sind Arbeitsmaterial und werden von der `.gitignore` abgefangen;
`.mjs`, `.sh` und `.json` bleiben versioniert.
