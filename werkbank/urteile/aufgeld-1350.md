# Der gerissene Kontrakt zeigt auf dieselbe Wunde

*Aufsicht, 9. August 2026. Gerät: `schuss/aufsicht/kontrakte.mjs` (T0.6),
gefahren an zwei Ständen.*

## Die Messung

| Stand | Aufgeld nach Lieferung |
|---|---|
| `b098fc6` — Welle-13-Abnahme, vor Bildtausch und vor dem GRIFF | E1 **GERISSEN** · E2 bestanden · E3 bestanden · E4 bestanden |
| heutiger Kopf — mit WebP und mit dem GRIFF | E1 **GERISSEN** · E2 bestanden · E3 bestanden · E4 bestanden |

**Zeile für Zeile identisch**, in allen vier Kontrakten und allen vier Epochen:
14 bestanden, 1 gerissen, 1 nicht messbar. Der Riss ist **vorbestehend**.
Weder der Bildtausch noch DER GRIFF hat ihn verursacht — der Builder hatte
recht, und ich habe es nicht geglaubt, sondern nachgemessen.

## Warum er trotzdem der wichtigste Fund des Tages ist

Der Kontrakt prüft: *nach einer Lieferung muss das Aufgeld größer als null
sein.* In **1350** ist es null. Der Grund steht schon im Baubericht zu T0.6:
**das Aufgeld rundet auf 0, weil der Ruf des Hauses zu niedrig ist.**

Daneben die Messung der Welle 14, mit einem ganz anderen Gerät erhoben:

> Die suchende Hand spielt 1350 mit Startkasse 112, Höchststand **112** und
> Endstand **0**. In 279 von 421 Wochen ist die Kasse leer.

**Zwei unabhängige Geräte zeigen auf dieselbe Stelle.** Der Kontrakttest sagt,
*welcher Hebel* klemmt: der Erlösaufschlag auf Lieferungen, der in dieser
Epoche rechnerisch verschwindet. Die Deckungsmessung sagt, *was das kostet*:
alles.

Das ist der Unterschied zwischen einem Symptom und einer Adresse. Bis heute
hieß der Befund *„1350 ist arm"*. Jetzt heißt er: **in 1350 rundet der einzige
Erlösaufschlag des Hauses auf null, und deshalb wächst die Kasse nie über
ihren Startwert.**

## Was daraus folgt — und was ausdrücklich nicht

**Für DEN ERSTEN PFENNIG (Welle 15, Stück 2) ist das die erste Adresse**, die
er prüft. Er prüft sie, er baut nicht blind darauf: dass zwei Geräte auf
dieselbe Stelle zeigen, macht sie zur besten Hypothese, nicht zur Ursache.

**Nicht erlaubt bleibt, was der Brief verbietet:** die Startkasse erhöhen,
Preise senken, Erlöse verschenken. Ein Aufgeld, das auf null rundet, wird
nicht dadurch geheilt, dass man ihm eine Zahl schenkt — die Frage ist, ob ein
Haus, das sorgfältig liefert, seinen Ruf so heben kann, dass der Aufschlag
greift, **und ob man das findet, ohne es vorher zu wissen.**

## Eine Berichtigung an meiner eigenen Buchführung

Der T0.6-Bericht führte diesen Fall als *„nicht messbar"*. Das Gerät führt ihn
als **gerissen**. Der Unterschied ist nicht kosmetisch: „nicht messbar" heißt
*das Gerät konnte nichts sagen*, „gerissen" heißt *das Spiel hält den Kontrakt
nicht ein*. Genau diese Trennung war der Grund, warum das Gerät drei Ausgänge
bekommen hat statt zwei. **Die Zusammenfassung war ungenauer als das Gerät**,
und die Zusammenfassung stand in meinem Commit.
