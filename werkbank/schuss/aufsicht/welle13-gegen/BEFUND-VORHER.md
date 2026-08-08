# Der Vorzustand, mit dem Lineal der Aufsicht gemessen

*8. August 2026, 08:30–08:55 UTC. Eingefrorener Stand `7e21973` auf Hafen 8931
(`aufsicht/messstand.sh 7e21973 8931`, Fassung geprüft). Gerät:
`probe13.mjs`, geschrieben **bevor** ein Ergebnis der Welle 13 vorlag. 100
Wochen Epoche 1, Saat 1350, Fenster 1600×900, **kein Reiter angefasst** — nur
Karren füllen, abschicken, WEITER.*

**Warum das hier steht:** die Welle 13 ist auf die Zahlen des blinden
Spielkritikers gestellt. Bevor irgendein Builder daran gemessen wird, misst die
Aufsicht denselben Vorzustand mit einem eigenen Gerät. Zwei Auflagen halten
das nicht aus.

---

## Was ziffernweise übereinstimmt — das Lineal ist geeicht

| | Kritiker | Aufsicht |
|---|---|---|
| Textzeilen auf dem ersten Schirm | 613 | **613** |
| *Ziel · gewinnen · überleben* auf dem ersten Schirm | 0 | **0** |
| `localStorage` / `sessionStorage` | leer | **0 Schlüssel, auch nach 100 Wochen** |
| `BRAUHAUS.lage` · Seitenfehler | 0 · 0 | **0 · 0** |
| Wochen ohne eine bezahlbare Preisoption | 127 von 284 (44,7 %) | **68 von 100** |
| Deckung unter 1× | 250 von 284 (88 %) | 57 von 100 |

Die ersten vier Zeilen sind identisch, nicht ähnlich. Das Gerät misst dasselbe
wie seines.

---

## A4 — DER LÜGENDE KNOPF: bestätigt, und schlimmer als aufgeschrieben

`preis:tafel` trägt in **100 von 100** gemessenen Wochen die Aufschrift
*„Michaelitafel schließen"* — es gibt keine zweite Aufschrift. In **97** dieser
Wochen liegt nichts auf dem Tisch. In den 3 Wochen, in denen wirklich etwas
liegt, ist der Knopf **zufällig** richtig.

Der Kritiker hatte „71 von 71 abgelesenen Zuständen"; er hat aber auch
*„Michaelitafel 1350 · 4 Angebote"* gesehen — in seinem Protokoll, bei 1350/2,
**nachdem er die Tafel selbst geöffnet und wieder geschlossen hatte.** Wer sie
nie anfasst, bekommt die ehrliche Aufschrift nie zu sehen.

**Die Auflage bleibt wie sie ist. Sie ist eher zu schwach formuliert als zu stark.**

---

## A5 — DIE TAFEL LIEGT NIE VON SELBST AUF: **falsch, so wie es dasteht**

Gemessen ohne einen einzigen Reiterklick:

| Jahresanfang | liegt die Tafel? |
|---|---|
| 1350/1 (Spielanfang) | **nein** |
| 1351/1 | **ja** |
| 1352/1 | **ja** |
| 1353/1 | **ja** |

Und sie bleibt liegen. Eine Zeitreihe nach dem Jahreswechsel-Klick, ohne danach
irgendetwas anzufassen — 60 · 120 · 250 · 400 · 600 · 900 · 1300 · 1800 · 2500 ·
3500 · 5000 · 8000 ms: **zwölfmal `liegt=true`.** Es ist also kein Rennen und
kein Aufblitzen; das Blatt liegt einfach da.

Auf dem Tisch stehen bei 1351/1: `preis:nimm:dach` („Nehmen −34 Pf"),
`preis:nichts` („Nichts nehmen · das Geld bleibt liegen"), `preis:tafel-zu`
(„Das Jahr beginnen") — und das große Blatt `pr-tafel` mit der Überschrift
*„MICHAELI 1351 · Der Rat setzt den Bierpfennig."*

**Woher die 0 von 10 des Kritikers kommt:** sein eigenes Protokoll
(`spiel-w12/protokoll/e1.jsonl`) trägt bei 1351/1 die Zeile
`michaeli-fehlt · knopfText: „Michaelitafel schließen"` — **an derselben Stelle,
an der ich das Blatt liegen sehe.** Dazwischen liegen seine eigenen Klicks: er
macht am Jahreswechsel einen `rundgang` über die Reiter (4 in dieser Sitzung,
13 × `brett-gesucht`) und liest erst danach. Seine Hand hat sich die Tafel
selbst weggeklickt und dann festgestellt, dass sie fehlt.

> **Das ist kein Vorwurf an den Kritiker** — er hat diese Schwäche in seinem
> Abschnitt X selbst benannt: *„Meine Hand ist ein Skript, kein Mensch … sie
> fasst nichts an, wonach sie nicht ausdrücklich sucht."* Es ist der Grund,
> warum die Aufsicht nachmisst, statt ein Urteil weiterzureichen.

**Was wirklich fehlt, und das ist enger und billiger:**
1. Am **Spielanfang** liegt die Tafel nicht — und genau dort steht der Knopf,
   der behauptet, sie läge.
2. Am Jahreswechsel trägt sie **ein** Angebot (−34 Pf), nicht die fünf, von
   denen das Urteil spricht. Die fünf sieht nur, wer sie in Woche 2 sucht.

---

## A6 — REITER, DIE NICHTS BEWIRKEN: bestätigt, ziffernweise

Bei liegender Michaelitafel (1351/1) vier fremde Reiter der Reihe nach mit
echter Maus gegriffen — alle vier **greifbar und wirklich geklickt**:

| Klick auf | greifbare Züge danach | Tafelknöpfe danach |
|---|---|---|
| *(vorher)* | 25 | 3 |
| `sud-sud-brett` | 26 | 3 |
| `fuhre-fu-brett-fu-keller` | 26 | 3 |
| `name-nm-band` | 26 | 3 |
| `gegner-amort-gg-band` | 26 | 3 |

Vier Klicks, nichts geschieht. Die Tafel verschwindet dabei **nicht** — sie
bleibt liegen, und die Reiter darunter sind tot. Das deckt sich mit der Messung
des Kritikers am Jahreswechsel 1601 (acht Klicks, achtmal 30 greifbare Züge).

---

## A9 — DER BEZAHLBARE GEGENZUG: die Auflage muss sagen, welche Lesart gilt

| Lesart | Wochen ohne bezahlbaren Gegenzug |
|---|---|
| **eng** — nur Züge mit Preisschild, das die Kasse trägt | **68 von 100** |
| **weit** — auch Züge ohne Preisschild („Fass an den Wirt · 1 Fass statt Geld") | **0 von 100** |

Unter der weiten Lesart ist die Abnahme *„höchstens 10 von 100"* **heute schon
erfüllt, ohne dass irgendjemand etwas tut.** Das ist ein Loch im Wellenbrief
der Aufsicht, nicht im Bau — und es wird geschlossen, bevor jemand daran
gemessen wird.

**Gültig ist die enge Lesart**, mit einem Zusatz: ein Zug ohne Preisschild zählt
nur dann als Gegenzug, wenn er **wirklich ausführbar** ist — der Knopf „Fass an
den Wirt" ist greifbar und trotzdem sinnlos, solange der Keller leer ist. Der
Kritiker hat genau das gesehen: *„war in meinen Sitzungen fast immer mit
‚Vorrat reicht nicht' abgeschaltet."*

---

## Was daraus für die Welle folgt

* **R6 bleibt** (der Knopf lügt, 97 von 100).
* **R7 wird enger**: nicht „zehn von zehn Jahresanfängen" — das ist schon fast
  da —, sondern **der Spielanfang** und **die Zahl der Angebote, die zu Michaeli
  wirklich auf dem Tisch liegen**.
* **R10/A6 bleibt** und ist die eigentliche Ursache dafür, dass ein sorgfältiger
  Spieler das beste Brett des Spiels nicht zu Gesicht bekommt.
* **R15 bekommt die enge Lesart** samt Ausführbarkeit. Baseline 68 von 100.

*Alle Zahlen dieses Blattes sind mit `probe13.mjs`, `zeitreihe.mjs` und
`reiterprobe.mjs` am Stand `7e21973` erhoben und in
`protokoll/vorher-e1.jsonl` (100 Zeilen, eine je Woche) nachlesbar.*
