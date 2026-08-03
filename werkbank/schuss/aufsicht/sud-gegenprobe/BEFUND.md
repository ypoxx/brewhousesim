# Gegenprobe der Aufsicht zu DER SUD, Nacharbeit — 3. August 2026

Eigener Code (`bier.mjs`), nicht das Skript des Builders und nicht das des
Kritikers. Maßstab: in wie vielen Wochen sind **mindestens zwei** Sud-Knöpfe
zugleich *nicht gesperrt* **und** von `elementFromPoint` in ihrer Mitte
getroffen — also wirklich anklickbar, nicht nur vorhanden.

- **vorher**: Commit `2953242`, eigener eingefrorener Hafen 8920, geprüft
  (`sud.js` byteweise identisch mit dem Commit; 333 Zeilen Unterschied zu HEAD).
- **nachher**: Arbeitsbaum auf 8899. Je 120 Wochen angesetzt, bis zum Spielende.

| Epoche | vorher | nachher |
|---|---|---|
| 1350 | 57,8 % (59/102) | **100,0 %** (102/102) |
| 1600 | 57,8 % (59/102) | **100,0 %** (102/102) |
| 1884 | 60,0 % (60/100) | **100,0 %** (100/100) |
| 1970 | 60,2 % (59/98) | **100,0 %** (98/98) |

**Befund: die Nacharbeit trägt.** Der Kesselzettel nimmt sich nicht mehr selbst
weg.

**Warum diese Zahlen nicht die des Builders sind.** Er meldet vorher/nachher
6,8→99,2 · 99,7→100 · 63,9→60,8 · 22,8→26,3. Der Unterschied ist der Maßstab,
nicht der Befund: er zählt *eine Bierentscheidung mit mehr als einem Knopf*,
also eine bestimmte Achse; hier zählt **jeder** treffbare Sud-Knopf. Meine
Zahlen sind deshalb vorher höher und nachher gleichmäßiger. **Wer beide
vergleicht, vergleicht zwei Fragen.** Für die Frage „verschwindet der Zettel
noch?" ist die hiesige Messung die direktere; für „hat der Spieler eine echte
Wahl über das Bier?" die seine.

**Was hier NICHT gemessen wurde:** ob die Entscheidung etwas *kostet* und etwas
*ändert*. Das ist die eigentliche Frage des Stücks und gehört einem blinden
Kritiker, nicht der Aufsicht.
