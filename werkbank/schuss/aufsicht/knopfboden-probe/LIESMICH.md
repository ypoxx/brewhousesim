# Probe: bewegt der Knopfboden die ρ-Zahlen?

Verdacht des Builders DER SUD vom 5. August 2026, nachdem er ausgeschlossen
hatte, dass die Wanderung von 1600 und 1970 an seinen Dateien liegt: der
**Knopfboden** aus der Lesbarkeitsarbeit (`stil/grund.css`, `min-width/min-height:
24px` hinter dem Medienschalter) vergrößert unterhalb der Entwurfsleinwand jedes
Brett — und verschiebt damit möglicherweise, was die Messhand trifft.

**A/B am selben Commit `517ca3f`:** Hafen 8901 mit Boden, Hafen 8902 ohne. Dass
sich sonst nichts unterscheidet, ist geprüft (`git diff --stat` über `spiel/` ist
leer); die Fassung ohne Boden liegt nur auf der Platte des Messstands und wird
nie ausgeliefert.

> **Diese beiden Ordner müssen existieren, auch leer.** Am 5. August um 05:26 hat
> der siebte Container-Reset `ohne/` mitgenommen — Git kennt keine leeren Ordner —
> und **zwei Messläufe schrieben vierzig Minuten lang ins Nichts**, während das
> Protokoll „fertig" meldete. Ursache: das Probenskript sah den Exitcode nicht an.
> Genau die Sorte Fehler, gegen die dieser Lauf sonst prüft. Das Skript prüft
> jetzt, ob die Datei entstanden ist, und bricht sonst laut ab; diese Datei hält
> die Ordner am Leben.
