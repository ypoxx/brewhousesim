# stadt-w8 — die Geräte der Welle 8

| Datei | wofür |
|---|---|
| `deckkarte.mjs` | Pixeldeckung je Rasterzelle (32×24) für ALLE Stücke, dazu getrennt Reiterzeile / Bauhof-Lade / Werkbank. Beantwortet die Frage, die `aufsicht/deckung-je-stueck.mjs` nicht stellt: **wo** ist noch Platz. |
| `freiflaeche.mjs` | Kastenmaße aller sichtbaren Oberflächenkästen aus dem DOM, je Stück. Ausdrücklich **keine** Deckungsmessung — eine Hülle deckt nicht, was in ihr durchsichtig ist. |
| `reiterprobe.mjs` | was auf den zehn Reitern **wirklich steht**: gezeigter Text gegen vollen Titel, in beiden Fenstern. Ein Überlaufzähler sieht diese Regression nicht, weil `setzeAufschrift()` sauber kürzt statt abzuschneiden. |
| `schneiden.mjs` | zerlegt einen 2×2-Bogen in freigestellte WebP. Ersetzt `stadt-r6/freistellen.py`, das hier nicht mehr läuft (kein numpy, kein PIL, kein scipy). |
| `nachpacken.mjs` | packt eine vorhandene Hofdatei dichter, mit PSNR-Gegenprobe. **Nicht angewandt** — die Gegenprobe kam auf 36–38 dB, unter der 40-dB-Schwelle, und das Gewichtsveto hielt auch ohne. |
| `schild.mjs` | wieviel Bildpunkte des Hausschilds die Oberfläche zudeckt — die Messung des blinden Kritikers nachgestellt. |
| `rho/lauf.sh` | ρ vorher **und** nachher als A/B im selben Augenblick, zwei Häfen aus demselben Baum. Wiederaufnehmbar. |
| `vor/` | die fünf STADT-Dateien im Stand `76f3ca4`, aus denen der Vorher-Hafen gebaut wird |
| `hafen-vor/` | der Symlinkwald für Hafen 8908 |
| `bogen/` | die drei erzeugten 2×2-Bögen und ihre Schnittpläne |

Die `.png`/`.jpg` hier sind Arbeitsmaterial und werden von der `.gitignore`
abgefangen; `.mjs`, `.sh`, `.json`, `.txt` und `.md` bleiben versioniert.
