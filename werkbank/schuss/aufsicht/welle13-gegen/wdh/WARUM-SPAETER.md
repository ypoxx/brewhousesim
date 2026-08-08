# Die Wiederholbarkeitsprobe der Welle 13 — verschoben, mit Grund

*8. August 2026, 09:05 UTC.*

Ich habe um 08:35 versucht, die Wiederholbarkeit früh zu prüfen: Mischstand
`459de56` auf Hafen 8932 eingefroren, dreimal `linie.mjs 1 400`. **Alle drei
Läufe sind in die 600-Sekunden-Frist gelaufen**, ohne eine Datei zu schreiben.
Dieselbe Hand schafft am selben Stand acht Wochen anstandslos
(`E1@8932: 8 Wochen, Kasse 80–154, Seitenfehler 0`) — es ist also kein Fehler
im Spiel, sondern Tempo: **zwei Builder fahren gleichzeitig eigene
Playwright-Sitzungen.**

**Ich setze die Frist nicht hoch, sondern die Messung ab.** Das ist die Lehre
der Welle 12, wörtlich aus `gauntlet/MESSLATTE.md`: Wiederholbarkeit ist keine
fünfte Latte, sondern die Voraussetzung der anderen vier, und sie wird
**einzeln** und an einem **eingefrorenen** Stand gemessen. Genau vier Tage hat
es gekostet, dass `welle.sh` vier Epochen nebeneinander laufen ließ und die
Maschinenlast entschied, welche von zwei Partien herauskam. Eine
Wiederholbarkeitszahl, die unter der Last zweier fremder Browser entsteht,
beweist im günstigen Fall nichts und im ungünstigen das Falsche.

**Sie wird nachgeholt, wenn alle vier Builder fertig sind und die Maschine
still ist** — drei Läufe je Epoche, sechs in 1350, jeder einzeln durchs
Messfenster, an einem Stand, der sich nicht bewegt. Erst dann ist die Zahl
etwas wert.

*Der Ordner bleibt leer stehen, damit niemand später denkt, hier sei gemessen
worden.*
