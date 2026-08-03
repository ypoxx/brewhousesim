# Nachmessung nach den zwei KERN-Änderungen — 3. August 2026, abends

Zwölf Läufe à 400 Wochen auf dem eingefrorenen Stand **mit** beiden
Kernänderungen (Hafen 8960), gegen die zwölf Läufe von vorher
(`../welle4-schluss/`, Stand `1b5ab7a`).

| Epoche | vorher | nachher | gleich? | Jahre < 1× | Fehler |
|---|---|---|---|---|---|
| 1350 | +0,591 ×3 | +0,591 ×3 | **ja** | 0/14 | 0 |
| 1600 | +0,231 ×3 | +0,231 ×3 | **ja** | 0/14 | 0 |
| 1884 | +0,393 ×3 | +0,393 ×3 | **ja** | 1/14 | 0 |
| 1970 | +0,108 ×3 | +0,108 ×3 | **ja** | 0/14 | 0 |

**Beide Kernänderungen verschieben die Wellenzahl nicht — Ziffer für Ziffer
identisch.** Das ist der gewünschte Ausgang: ehrlicher gemessen, gleiches
Ergebnis. Das Wellenziel steht.

## Was die zwei Änderungen bewirken

**(1) `data-soll-aus` an jedem Knopf** (`kern/buehne.js`, eine Zeile). Von 55 auf
**395 von 440** Zügen, und **0 statt 13/20/20/14** gesperrte Züge ohne jede
Auskunft. Damit ist Spalte (a) der zweiten Messlatte zum ersten Mal eindeutig:
`data-soll-aus="1"` heißt *das Spiel sagt nein*, `"0"` bei `disabled` heißt
*verdeckt* — und das ist ein Fehler, kein Zustand.

**(2) Rückfall auf den nächstbesten Zug** (`kern/welt.js`). `meldeZug` sammelt
jetzt alle Meldungen; `besterZug()` geht sie nach Rang und Preis durch, bis
einer bedienbar ist. Neu ist außerdem, dass „bedienbar" eine **Fläche**
verlangt — `disabled` allein ließ Knöpfe durch, die frei, aber zusammengeklappt
bei 0×0 lagen.

## Was die Aufsicht NICHT nachstellen konnte

Die Lücke, die (2) schließt, hat DIE RÜCKKOPPLUNG in sorgfältig gespielten
Partien gemessen: **18 von 4.800 Wochen**, davon 6 von 400 in 1884. Die
Gegenprobe der Aufsicht mit einer **passiven** Partie (nur WEITER) zeigt
**0 von 402 Wochen — vor wie nach der Änderung**. Die Lücke entsteht erst, wenn
Bretter offen stehen und einander verdecken, also im wirklichen Spiel. Die Zahl
des Builders steht; die Gegenprobe der Aufsicht ist dafür zu schwach und wird
hier als zu schwach ausgewiesen, statt als Bestätigung ausgegeben zu werden.
