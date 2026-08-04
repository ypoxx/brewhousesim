# KERN `welt.js:413` — die Kasse kann nicht mehr negativ werden

**Der Befund, gemessen vor der Änderung** mit `../kassenboden.mjs`, das
`B.protokoll` Buchung für Buchung nachrechnet statt nur den Wochenschluss
abzulesen:

| Epoche | tiefste Wochenkasse | tiefster **Zwischenstand** |
|---|---|---|
| **1350** | 0 | **−7** ← gebucht bei „Sommer: Unterhalt und Abgaben" |
| 1600 | 222 | 199 |
| 1884 | 7.065 | 7.041 |
| 1970 | 31.295 | 29.803 |

**Wochenweise ist es unsichtbar.** Der Vorgriff von DER PREIS fängt den Fall im
selben Wochenwechsel ab, weil `uhr.js:160` `rechneJahrAb()` vor `sende('jahr')`
laufen lässt. Wer nur die Wochenkasse liest, sieht 0 und hält es für den Boden.
Ein Stück, das in genau diesem Augenblick `welt.kann()` fragt, bekam eine
falsche Auskunft.

**Nach der Änderung:** 1350 von −7 auf **0**, die anderen drei Ziffer für Ziffer
unverändert.

## Die Wellenzahl bleibt unberührt

Acht Läufe à 400 Wochen, sequenziell, eingefrorener Stand `eda73c7`:

| Epoche | vorher | nachher | gleich? |
|---|---|---|---|
| 1350 | +0,591 | +0,591 | **ja** |
| 1600 | +0,231 | +0,231 | **ja** |
| 1884 | +0,393 | +0,393 | **ja** |
| 1970 | +0,275 | +0,275 | **ja** |

Jahre unter 1× unverändert 0/0/1/0, null Seitenfehler.

> Das ist der Prüfstein für jede Kernänderung: **wo eine Aufräumaktion die
> Messzahl verbessert, ist sie verdächtig; wo sie sie unberührt lässt, hat sie
> nur aufgeräumt.** Dritte Kernänderung in Folge, die diesen Prüfstein besteht.
