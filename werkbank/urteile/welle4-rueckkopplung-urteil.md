# DIE RÜCKKOPPLUNG — Urteil des blinden Kritikers

**Gemessen am eingefrorenen Stand `da7d690`** (Hafen 8900, gesetzt mit
`werkbank/schuss/aufsicht/messstand.sh`), `?epoche=1..4&saat=1350`, **400 Wochen je Lauf,
drei Läufe je Epoche = 12 Läufe = 4.800 gemessene Wochen.** Nicht auf 8899 — dort schreiben
Builder, und eine Zahl von einem wandernden Ziel ist keine Messung. Ich habe weder den
Bericht des Builders noch eine Nacharbeitsnotiz gelesen; alles unten steht am Bildschirm
oder im Quelltext mit Zeile.

---

## URTEIL: **FÄLLT DURCH**

**1600 ist geheilt — und 1350 läuft jetzt nach oben davon.**
Das Ziel der Welle war `|rho| < 0,7` in **allen vier** Epochen. In 1350 steht Spearman in
**drei von drei Läufen** bei oder über 0,7 (+0,742 · +0,701 · +0,701). Das ist genau der
Fehler, den 1600 vor dieser Runde hatte, nur eine Epoche weiter links.

Das ist kein Ausreißer: die Spannweite über drei Läufe ist 0,041, und die ersten neun Jahre
der Leiter sind in allen drei Läufen Ziffer für Ziffer identisch. Es liegt auch nicht an
meinem Gerät: eine **wortgleiche Kopie des Originalgeräts** der Eichung
(`preis-linie.mjs`, geändert ist nur die Hafennummer) liest an demselben Stand für 1350
dieselbe Reihe und **Spearman +0,701** (§3.5).

**Was für den Builder spricht, und ich sage es zuerst:** die Reparatur von 1600 ist echt und
an der richtigen Stelle gemacht. rho fällt von +0,873 auf **+0,231 / +0,264 / +0,231**, die
Streuung über drei Läufe ist 0,033, und sie kommt nicht daher, dass der Nenner verstellt
wurde, sondern daher, dass die Kasse in 1600 jetzt **fällt** (Jahresmedian ×0,61), während
die Preise steigen (×1,48). Wer nur 1600 gelesen hätte, hätte bestanden. Die Auflage der
Welle lautete aber: **ohne die drei anderen zu brechen.**

---

## 1 · Ist es heil? — ja

`werkbank/schuss/rueckkopplung/heil.mjs`, alle vier Epochen frisch geladen, nichts geklickt:

| Epoche | `BRAUHAUS.lage.length` | `pageerror` | `console.error` | Kopfzeile im Anfangsbild |
|---|---|---|---|---|
| 1350 | 0 | 0 | 0 | `nächster Zug: Zuvorkommen Klosterschenke Obernberg — 19 Pf (Kasse reicht 5,9×)` |
| 1600 | 0 | 0 | 0 | `nächster Zug: Zuvorkommen Mühlschenke — 170 fl (Kasse reicht 3,8×)` |
| 1884 | 0 | 0 | 0 | `nächster Zug: Ablösung Ausschank am Markt — 1.706 M (Kasse reicht 8,4×)` |
| 1970 | 0 | 0 | 0 | `nächster Zug: Ablösung Brückenwirt — 38.221 DM (Kasse reicht 2,3×)` |

Über alle 12 Läufe à 400 Wochen: **0 Seitenfehler, 0 Konsolenfehler, kein Abbruch, kein
totes Haus, `BRAUHAUS.lage.length === 0` in jeder gemessenen Woche.**

`data-deckung` gibt es an diesem Stand **einmal**, nicht zweimal: nur `kern/kopf.js:130`
setzt es (ZUSTÄNDIGKEIT 19 ist umgesetzt, `spiel/stuecke/name.js:95` bestätigt die Abgabe).
Der Warnhinweis aus dem Auftrag ist an diesem Commit erledigt.

---

## 2 · Womit gemessen wurde, und warum nicht mit dem vorhandenen Gerät

`werkbank/schuss/eichung/preis-linie.mjs` ist ein gutes Vorbild für die *Hand*, als
Messgerät dieser Runde aber unbrauchbar: **Zeile 39 zeigt fest auf `127.0.0.1:8899`** — den
Arbeitsbaum, in dem gerade geschrieben wird. Am fremden Messgerät wird nicht gedreht
(ZUSTÄNDIGKEIT 16), also steht meins daneben:

* `werkbank/schuss/rueckkopplung/linie-rk.mjs` — dieselbe sorgfältige Hand (Sudplan zu
  Michaeli, Rohstoff vor dem Ausgehen, Zahlungsziel einmal im Jahr, Knappheit der Epoche
  einlösen, zu Michaeli nur nehmen, was die Kasse handlungsfähig lässt: `kasse − p ≥ 2p`),
  aber **Hafen 8900** und **zwei** Reihen statt einer: die LEITER, wie das Spiel sie selbst
  je Jahr ins Bild schreibt, und **zusätzlich jede Woche die Kopfzeile `.deckung`** samt
  Zugschlüssel, Art und Preis des genannten Zuges.
* **Gemessen wird am Anfang der Woche, vor jedem eigenen Handgriff.** Wer erst alle Bretter
  aufschlägt und dann die Kopfzeile liest, misst seinen eigenen Rundgang.
* Gegenprobe, dass beide Reihen dieselbe Zahl meinen: die LEITER-Zeile eines Jahres ist
  Ziffer für Ziffer die Kopfzeile, die ich in Woche 1 **vor** dem Aufklappen der
  Michaelitafel gelesen habe (1600: LEITER 3,76 = gelesen 3,76; 1601: 1,75 = 1,75).
* **Kreuzprobe mit dem Originalgerät:** `preis-linie-8900.mjs` ist eine wortgleiche Kopie
  von `eichung/preis-linie.mjs`, in der **nur die Hafennummer** verändert ist
  (`diff` zeigt genau eine Zeile). Siehe §3.5.

**Ein Messfehler meines Geräts, offengelegt:** die letzte LEITER-Zeile eines Laufs steht
beim Ablesen manchmal noch ohne Kennzahl da (`preis.js:1280 fuelleKennzahl` füllt sie einen
Bildaufbau später). Deshalb hat mal 13, mal 14 Jahre in der Reihe. Der Unterschied bewegt
rho um bis zu 0,04 — **er kippt kein Urteil**, aber er gehört genannt.

---

## 3 · Spalte (d), die Kennzahl — alle vier Epochen, drei Läufe

**Welches rho:** beide. Sie sagen hier Verschiedenes, und das ist selbst ein Befund.
`rho` läuft über (Jahresnummer, Kennzahl des Jahres). Spearman ist das, was das vorhandene
Gerät dieser Welle rechnet (`werkbank/schuss/eichung/auswerten.py`, Funktion `spearman`).

### 3.1 · Die LEITER (was das Spiel selbst je Jahr ins Bild schreibt)

| Ep | Lauf | Jahre | erste | letzte | **Pearson** | **Spearman** | Jahre <1× | |
|---|---|---|---|---|---|---|---|---|
| **1350** | A | 13 | 5,89 | 13,67 | +0,442 | **+0,742** | 0/13 | **REISST** |
| **1350** | B | 14 | 5,89 | 14,45 | +0,416 | **+0,701** | 0/14 | **REISST** |
| **1350** | C | 14 | 5,89 | 9,20 | +0,368 | **+0,701** | 0/14 | **REISST** |
| 1600 | A | 14 | 3,76 | 3,22 | +0,002 | +0,231 | 0/14 | besteht |
| 1600 | B | 13 | 3,76 | 2,73 | +0,055 | +0,264 | 0/13 | besteht |
| 1600 | C | 14 | 3,76 | 3,22 | +0,002 | +0,231 | 0/14 | besteht |
| 1884 | A | 13 | 8,35 | 9,40 | +0,305 | +0,346 | 1/13 | besteht |
| 1884 | B | 14 | 8,35 | 5,18 | +0,316 | +0,393 | 1/14 | besteht |
| 1884 | C | 13 | 8,35 | 9,40 | +0,305 | +0,346 | 1/13 | besteht |
| 1970 | A | 13 | 2,25 | 2,15 | +0,238 | −0,055 | 0/13 | besteht |
| 1970 | B | 14 | 2,25 | 4,26 | +0,269 | +0,108 | 0/14 | besteht |
| 1970 | C | 13 | 2,25 | 1,03 | −0,181 | −0,278 | 0/13 | besteht |

Die zweite Bedingung („höchstens ein Jahr von sechs unter 1×") hält überall: 0/13 bzw. 0/14,
und in 1884 1/13 bzw. 1/14 — das ist unter 1/6. **Diese Hälfte des Ziels ist in allen vier
Epochen erfüllt.** Gerissen ist allein die andere.

### 3.2 · Gegenprobe: Jahresmedian der wöchentlich abgelesenen Kopfzeile

(400 Ablesungen statt 14 — unabhängig davon, ob die LEITER ihre letzte Zeile gefüllt hat)

| Ep | A | B | C | Jahre <1× |
|---|---|---|---|---|
| 1350 | +0,644 | **+0,714** | +0,644 | 0/14 |
| 1600 | −0,046 | −0,046 | −0,046 | 0/14 |
| 1884 | +0,525 | +0,525 | +0,525 | 0/14 |
| 1970 | +0,473 | +0,473 | +0,499 | 0/14 |

(Spearman; Pearson dazu: 1350 +0,468/+0,606/+0,468 · 1600 −0,020 · 1884 +0,561 ·
1970 +0,521/+0,521/+0,247.)

Die zweite Reihe **entlastet 1350 nicht** — sie bestätigt die Richtung und liegt nur wenig
tiefer, weil die Jahresmediane die Ausschläge glätten, an denen die LEITER-Zeile hängt.

### 3.3 · Streuung — sie ist klein genug, das Urteil trägt

| Ep | Spearman min..max | Spannweite | Pearson min..max | letzte Kennzahl |
|---|---|---|---|---|
| **1350** | **+0,701 .. +0,742** | **0,041** | +0,368 .. +0,442 | 9,20 .. 14,45 |
| 1600 | +0,231 .. +0,264 | 0,033 | +0,002 .. +0,055 | 2,73 .. 3,22 |
| 1884 | +0,346 .. +0,393 | 0,047 | +0,305 .. +0,316 | 5,18 .. 9,40 |
| 1970 | −0,278 .. +0,108 | **0,386** | −0,181 .. +0,269 | 1,03 .. 4,26 |

Drei Läufe desselben Standes liefern in 1350, 1600 und 1884 **nicht** verschiedene rho: der
Würfel ist gesät (`kern/uhr.js:59`), und was streut, ist nur, in welcher Woche ein Klick der
Hand ankommt. In 1350 sind die ersten neun Jahre identisch
(5,89 · 1,55 · 4,27 · 2,79 · 5,90 · 4,74 · 10,52 · 41,67 · 26,39), erst danach laufen die
Läufe auseinander.

**In 1970 streut es wirklich** (0,386 auf Spearman, 0,450 auf Pearson): Lauf C hat einen
anderen Partieverlauf — Kassenspitze 109.104 statt 86.000 DM, 554 statt 842 Gegnerzüge.
**Dort trägt keine Einzelzahl ein Urteil**, aber alle drei Läufe liegen weit innerhalb der
Latte, also trägt der Befund trotzdem.

### 3.4 · Warum 1350 wegläuft — es sind nicht die Preise, es ist die Kasse

Jahresmediane über 14 Jahre:

| Epoche | Kasse | Faktor | Nennerpreis | Faktor | Spearman Kennzahl↔Kasse | Spearman Kennzahl↔Nenner |
|---|---|---|---|---|---|---|
| **1350** | 234 → 538 Pf | **×2,30** | 42 → 56 Pf | ×1,33 | **+0,947** | −0,202 |
| 1600 | 1.360 → 824 fl | ×0,61 | 170 → 252 fl | ×1,48 | +0,345 | −0,613 |
| 1884 | 9.508 → 13.164 M | ×1,38 | 1.706 → 2.527 M | ×1,48 | +0,916 | −0,455 |
| 1970 | 25.273 → 47.359 DM | ×1,87 | 20.239 → 12.758 DM | ×0,63 | +0,495 | −0,725 |

In 1350 wächst die Barschaft um Faktor 2,3, der Preis des nächsten sinnvollen Zuges nur um
1,33. Am Bildschirm abgelesen: 1350/W1 „Kasse reicht 5,9×", 1356/W21 „Kasse reicht 29,1×",
1363/W10 „Kasse reicht 21,6×". Zwischenzeitliches Maximum über 400 Wochen: **60,20×.**

Und die Latte ist **zweiseitig** — 1350 ist nur noch einseitig. Wochen unter 1×, gezählt an
allen 400 Ablesungen je Lauf, nicht am Jahresmedian:

| Epoche | A | B | C |
|---|---|---|---|
| 1350 | 1/400 | 1/400 | 1/400 |
| 1600 | 0/400 | 0/400 | 0/400 |
| 1884 | 27/394 | 27/394 | 27/394 |
| 1970 | 59/400 | 59/400 | 43/400 |

Über alle 4.782 Ablesungen der zwölf Läufe: Minimum **0,08×**, Maximum **60,20×**, **nie
negativ** — das ist die Gegenrichtung der §13-Auflage („die Leiter darf in keiner Epoche
negativ werden"), und sie hält. Aber 1350 wird in 400 Wochen genau einmal eng (0,93×) und
1600 kein einziges Mal. Die beiden frühen Epochen messen nur noch eine Richtung.

**Nebenbefund, der beim nächsten Griff wichtig wird:** 1884 driftet über den Lauf um
Faktor 2,77 nach oben (Jahresmedian der letzten fünf gegen die ersten fünf Jahre) und hält
`|rho| < 0,7` nur, weil eine Delle 1889–1891 die Rangfolge bricht. 1350 driftet um
Faktor 3,20. **1884 ist der nächste Kandidat.**

### 3.5 · Kreuzprobe mit dem Originalgerät

Der schwerste Einwand gegen alles oben wäre: *deine Hand ist nicht die der Eichung, du misst
deinen eigenen Automaten.* Also habe ich das Originalgerät selbst laufen lassen —
`werkbank/schuss/rueckkopplung/preis-linie-8900.mjs` ist eine wortgleiche Kopie von
`eichung/preis-linie.mjs`, in der `diff` **genau eine** Zeile zeigt: `8899` → `8900`.

Ergebnis, 1350, 400 Wochen, am eingefrorenen Stand:

    LEITER  5,89 · 1,55 · 4,27 · 2,79 · 5,90 · 4,74 · 10,52 · 41,67 · 26,39 · 7,05 · 6,88 · 19,27 · 13,67 · 9,20
    Pearson +0,368   Spearman +0,701   Jahre <1x: 0/14   Seitenfehler 0   kein Abbruch

Das ist **Ziffer für Ziffer** die Reihe meines Laufes C (siehe Tabelle 3.1: +0,368 /
+0,701). Der Befund hängt nicht an meiner Hand und nicht an meinem Gerät. **Er hängt am
Stand.**

Und er hängt auch nicht am Hafen: dasselbe Gerät hatte laut Auftrag vor dieser Runde für
1350 „5,89 → 2,69, rho −0,152" gelesen. Derselbe Startwert (5,89), dasselbe Gerät, dieselbe
Saat — und ein anderes Ende.

---

## 4 · Ist die Zahl ehrlich? — die Kennzahl ist besser als ihr Prüfschritt

Gemessen Woche für Woche über 400 Wochen, gelesen an der Kopfzeile (Klasse `.deckung`,
`kern/kopf.js:125`, Text ab `kopf.js:131`):

| Epoche | Art des Nenners | Zugschlüssel mitgeschickt | häufigster Nenner |
|---|---|---|---|
| 1350 | `umkaempft` 400/400 | **0/400** | Ablösung Pfarrschenke St. Michael (85–114×) |
| 1600 | `umkaempft` 400/400 | **0/400** | Ablösung Pfarrschenke St. Michael (76×) |
| 1884 | `umkaempft` 240 · `bindung` 154 · `bau` 6 | 163/400 | `erbe:tafel:verschreibe` (154×) |
| 1970 | `umkaempft` 400/400 | **0/400** | Zuvorkommen Fährhaus am Fluss (51×) |

Über alle 12 Läufe: in **4.311 von 4.800 Wochen (89,8 %)** nennt die Kopfzeile einen Zug
**ohne Zugschlüssel**; ein Knopf mit demselben Preis war gleichzeitig aktiv und unverdeckt
in **4.087 von 4.800 (85,1 %)**.

### 4.1 · Das Gute: kein billiger Dauerposten mehr

Der Nenner ist **nicht** der 9-Pf-Umtrunk und **nicht** der feste Jahresposten der Werbung,
gegen den ZUSTÄNDIGKEIT 24 geschrieben wurde. Er ist ein umkämpfter Zug, und sein Preis
bewegt sich: über 400 Wochen nimmt er **28 (1350) · 31 (1600) · 38 (1884) · 52 (1970)**
verschiedene Werte an (1350: 15–96 Pf, Median 48; 1970: 5.468–63.180 DM, Median 19.629).
Er heißt in 324 von 400 Wochen (1350) *Ablösung* — die Auslösung einer fremden Bindung, die
teuerste Sorte Zug, die dieses Spiel regelmäßig anbietet — und nicht *Umtrunk*.

Zu ihm gehören echte Knöpfe mit Preisschild an den Giebeln:
`gegner:abloesen:<adresse>` (`gegner.js:1944`, `data-preis` gesetzt) und
`gegner:zuvorkommen:<adresse>` (`gegner.js:1973`). Im Preisfeld am Schirm liegt er im
Mittelfeld: 1600/W1 Nenner 170 fl = Rang 8 von 14 aktiven Preisschildern, billigster Knopf
18 fl (`name:anschlag:kirchweih`), teuerster 588 fl (`gegner:abloesen:ochse`).

### 4.2 · Der Fehler: der Prüfschritt aus ZUSTÄNDIGKEIT 24 ist genau dort wirkungslos, wo die Zahl herkommt

`welt.js:495–506` gibt `null` zurück, wenn zu der Meldung kein bedienbarer Knopf am
Bildschirm steht — aber nur, wer „seinen Zugschlüssel mitschickt, wird beim Wort genommen"
(`welt.js:501`).

    spiel/stuecke/gegner.js:1561
      if (bester) B.welt.meldeZug(bester.was, bester.preis, 'umkaempft');

**Drei Argumente statt vier.** Und weil `umkaempft` in `welt.js:485` den höchsten Rang (3)
trägt, schlägt genau dieser Aufruf jeden anderen. Ergebnis, gemessen: in 1350, 1600 und 1970
stellt er **400 von 400 Wochen in jedem Lauf** den Nenner — und in genau diesen Wochen prüft
`zugDeckung()` gar nichts. Dasselbe gilt für `spiel/stuecke/stadt.js:1404` (ebenfalls drei
Argumente). `preis.js:1251`, `fuhre.js:2324`, `sud.js:1897` und `erbe.js:863` schicken ihn
korrekt mit.

Was das kostet, gemessen: zu dem in der Kopfzeile genannten Preis stand ein Knopf, der
gleichzeitig **aktiv und unverdeckt** war, in

| Epoche | Lauf A | Lauf B | Lauf C |
|---|---|---|---|
| 1350 | 354/400 (88 %) | 329/400 (82 %) | 354/400 (88 %) |
| 1600 | 350/400 (88 %) | 350/400 (88 %) | 350/400 (88 %) |
| 1884 | 349/400 (87 %) | 349/400 (87 %) | 349/400 (87 %) |
| 1970 | 336/400 (84 %) | 350/400 (88 %) | 350/400 (88 %) |

In **12–18 % der Wochen** nennt die Kopfzeile also eine Zahl, zu der in dieser Sekunde kein
greifbarer Knopf gehört. Das ist keine Fälschung — der Knopf existiert, er liegt unter einem
Brett —, aber es ist genau das, wogegen ZUSTÄNDIGKEIT 24 geschrieben wurde, und der Kern
kann es nicht bemerken, weil der Schlüssel fehlt. Auch **mit** Schlüssel bemerkte er nur die
Hälfte: `welt.js:503` prüft `el.disabled`, nicht ob das Element sichtbar ist.

### 4.3 · Der zweite Einwand: daneben wartet Teureres

Die teuerste Entscheidung mit Preisschild, die gleichzeitig aktiv und erreichbar am Schirm
steht, im Verhältnis zum genannten Nenner:

| Epoche | Median | Maximum | Wochen mit ≥10× daneben |
|---|---|---|---|
| 1350 | 2,4–2,5× | 24,0× | 2/400 |
| 1600 | 3,0× | 14,2× | 9/400 |
| 1884 | 5,6× | 38,7× | **107/400** |
| 1970 | 5,7–5,8× | 40,7× | **82–94/400** |

In 1884 und 1970 steht in gut jeder vierten Woche eine Entscheidung am Schirm, die zehnmal
mehr kostet als die, an der die Latte hängt — z. B. `gegner:abloesen:ochse` mit 287.235 DM
in 1970 gegen einen Nenner von median 12.000–32.000 DM. Das ist regelkonform (der Nenner
*soll* der billigste umkämpfte Zug sein), aber es heißt: **die Latte misst die Untergrenze
des Handlungsraums, nicht seine Spannweite.** Wer sie zweiseitig haben will, muss das wissen.

### 4.4 · Zwei Zeilen sagen dasselbe

Am Bildschirm stehen übereinander (Beleg: `werkbank/schuss/rueckkopplung/kopfzeile-e1.png`
und `-e4.png`):

    UMKÄMPFT  Zuvorkommen Klosterschenke Obernberg — 19 Pf · Kasse reicht 5,9×      .gg-kennzahl (gegner.js:1570)
    nächster Zug: Zuvorkommen Klosterschenke Obernberg — 19 Pf (Kasse reicht 5,9×)  .deckung     (kopf.js:125)

In allen vier Epochen tragen beide Ziffer für Ziffer denselben Wert (5,89 / 3,76 / 8,35 /
2,25). Der Zweikampf um den Nenner ist entschieden — die zweite Zeile ist reine Verdopplung
im engsten Platz des Bildes, direkt über WEITER.

---

## 5 · Die übrigen Spalten der Latte 2, je Epoche, am Bildschirm gezählt

### (a) Entscheidungen mit Preisschild nebeneinander, erreichbar UND aktiv

Woche für Woche über 400 Wochen (`[data-zug][data-preis]`, nicht `disabled`, Mittelpunkt
trifft sich selbst):

| Epoche | Median (A/B/C) | min | max | Wochen mit <2 | Wochen mit <5 |
|---|---|---|---|---|---|
| 1350 | 21 / 20 / 21 | 6 | 27 | 0 | 0 |
| 1600 | 21 / 21 / 20 | 6 | 27 | 0 | 0 |
| 1884 | 21 / 20 / 20 | 7 | 27 | 0 | 0 |
| 1970 | 14 / 14 / 15 | 6 | 25 | 0 | 0 |

Am **ersten** Michaelitag, ohne dass etwas gekauft wird
(`werkbank/schuss/rueckkopplung/michaeli1.mjs`, Beleg `michaeli1.json`):

| Epoche | Kasse | ohne Tafel | mit Michaelitafel | Angebote aktiv | Festlegungen aktiv |
|---|---|---|---|---|---|
| 1350 | 112 Pf | 14 | 10 | 2/5 (`dach` 36, `bottich` 45) | 1/3 (`vertrag` 85) |
| 1600 | 640 fl | 15 | 12 | 3/5 (`darre` 210, `wappenbrief` 500, `auswaertiger` 630) | 1/4 (`reinheit` 280) |
| 1884 | 14.250 M | 15 | 13 | 4/5 (`braumeister` 3.100, `malzkontrakt` 4.200, `maelzerei` …) | 2/3 |
| 1970 | 86.000 DM | 13 | 10 | 3/5 | 2/4 |

**Damit ist die Auflage aus ZUSTÄNDIGKEIT 13 erfüllt** („in jeder der vier Epochen muss
innerhalb der ersten drei Braujahre mindestens eine unwiderrufliche Festlegung tatsächlich
anklickbar werden, nachgewiesen am Bildschirm"): sie ist in allen vier Epochen **im ersten
Jahr** anklickbar. Auch ZUSTÄNDIGKEIT 17 (die Kasse deckt am Michaelitag das
**zweit**billigste Angebot) hält im ersten Jahr in allen vier Epochen: 45 ≤ 112 ·
500 ≤ 640 · 4.200 ≤ 14.250 · und in 1970 mit weitem Abstand. Und die Leiter wird in keiner
Epoche mehr negativ (Minimum über 4.800 Wochen: 0,08×), was §13 ausdrücklich verlangt hatte.

**Ein Wort zur Vokabel „aktiv":** sie heißt in diesem Spiel *bezahlbar* (`B.welt.kann(p)`),
nicht *bezahlbar mit Reserve*. Meine Hand kauft nur, wenn nach dem Kauf noch das Doppelte in
der Kasse liegt — und kauft deshalb nur an **4 von 14** (1350), **1 von 14** (1600),
**3 von 14** (1884), **2 von 14** (1970) Michaelitagen, obwohl an fast jedem 1–4 Angebote
„aktiv" dastehen. Wer die Spalte (a) an „aktiv" misst, misst großzügiger, als eine
vorsichtige Hand spielt.

### (b) Unwiderrufliche Festlegungen — was eine sorgfältig gespielte Partie über 14 Jahre wirklich nimmt

Gezählt an `B.welt.chronik` mit `art === 'festlegung'` — dieselbe Quelle, aus der
`preis.js:1362 festlegungenGesamt` zählt:

| Epoche | genommen in 14 Jahren (A/B/C) | wann | Michaelitage mit ≥1 anklickbarer Festlegung¹ |
|---|---|---|---|
| 1350 | **1 / 1 / 1** | 1352 | 1 von 14 |
| 1600 | **1 / 1 / 1** | 1600 | 1 von 14 |
| 1884 | **0 / 0 / 0** | — | 11–12 von 14 |
| 1970 | **0 / 0 / 0** | — | 12–13 von 14 |

¹ gezählt **nach** dem Zug der Hand — sie kauft am selben Tag zuerst, und ein Kauf schaltet
die Festlegung ab. Ohne jeden Kauf gezählt (`michaeli1.mjs`) sind es am ersten Michaelitag
1 von 3 (1350), 1 von 4 (1600), 2 von 3 (1884), 2 von 4 (1970). Die Spalte misst also die
Reihenfolge mit, in der eine Hand an einem Tag entscheidet: **Angebot und Festlegung stehen
nebeneinander, aber sie schließen einander über die Kasse aus.** Das ist eine echte Wahl —
und es heißt zugleich, dass die eine unwiderrufliche Karte des Tages verschwindet, sobald
man die andere anfasst.

Das ist die dünnste Spalte der Latte, und die Ursache ist **nicht** die, die auf dem
Preisschild steht. `preis.js:1333 festlegungOffen()` lässt **eine Festlegung je Amtszeit**
zu. Die Amtszeit wechselt aber nicht nach den 21–37 Jahren, die `welt.js:379` würfelt,
sondern **alle zwei Braujahre**: `erbe-daten.js:315 STUNDE_ABSTAND = 2` →
`erbe.js:494 stundeSchlaegt()` → `welt.erbe()`. Gemessen in **allen vier Epochen und allen
zwölf Läufen**: `zeit.amtszeit.nr` läuft in 400 Wochen von **1 auf 8**, mit Wechseln
in den Wochen 12–18 der Jahre +2, +4, +6, …

Das heißt: das Spiel **erlaubt bis zu 8** unwiderrufliche Festlegungen in 14 Jahren, und
eine sorgfältige Hand nimmt **1 oder 0**. Aus zwei verschiedenen Gründen:

* **1350 und 1600:** an mindestens **10 von 14** Michaelitagen stand überhaupt keine aktive
  Festlegung da — an genau diesen Tagen hat die Hand auch nichts gekauft, die Kasse war also
  unberührt und trotzdem war keine bezahlbar.
* **1884 und 1970:** an **11–13 von 14** Michaelitagen stand eine da, aber sie kostete mehr
  als 45 % der Kasse. Eine unwiderrufliche Entscheidung, die eine vorsichtige Hand
  zahlungsunfähig macht, ist eine Karte, die man ansieht und nicht nimmt.

**Und ein Widerspruch am Preisschild selbst.** Jede Festlegungskarte trägt
(`preis.js:1729`):

    Preis dieser Amtszeit: 6.700 fl · Barbara Bruckner führt das Haus bis 1636.
    Preis dieser Amtszeit: 1.000 Pf · Kunigunde Bruckner führt das Haus bis 1386.
    Preis dieser Amtszeit: 32.000 M · Wilhelmine Bruckner führt das Haus bis 1920.
    Preis dieser Amtszeit: 110.000 DM · Margarete Bruckner führt das Haus bis 2006.

Barbara Bruckner ist 1602 abgelöst, nicht 1636. Die Karte der **unwiderruflichen**
Entscheidung nennt einen Horizont, der 10- bis 18-mal zu lang ist. Wer nach diesem Satz
kauft, kauft 36 Jahre und bekommt 2.

### (c) Züge des Gegners, die ohne dich geschehen

Gezählt an `B.protokoll` mit `wer === 'gegner'` (geschrieben in `gegner.js:416`); das Spiel
zeigt dieselbe Größe selbst an, als `OHNE DICH GESCHEHEN N Zug` am Reiter
`stadt:reiter:gegner-amort-gg-band`:

| Epoche | über 400 Wochen (A/B/C) | je Jahr | je Woche |
|---|---|---|---|
| 1350 | 449 / 454 / 449 | 32,1 | 1,12 |
| 1600 | 796 / 796 / 796 | 56,9 | 1,99 |
| 1884 | 324 / 324 / 324 | 23,1 | 0,81 |
| 1970 | 842 / 842 / 554 | 39,6–60,1 | 1,39–2,10 |

Die Spalte ist gefüllt und **je Epoche verschieden** — Faktor 2,6 zwischen der stillsten
(1884) und der lautesten Zeit (1970).

### (e) Die Verbliste je Epoche — viermal dieselbe? Nein.

Zwei unabhängige Zählungen.

**Zugschlüssel, die in 400 Wochen am Schirm standen** (Ereignisnummern wie
`gegner:zeige:47` herausgerechnet, sonst zählt man Ereignisse statt Verben):

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| verschiedene Zugschlüssel | 196 | 200 | 203 | 230 |
| in allen vier gleich | 111 | 111 | 111 | 111 |
| nur in dieser Epoche | 61 | 53 | 63 | 86 |

Jaccard-Ähnlichkeit: E1/E2 0,51 · E2/E3 0,45 · E3/E4 0,43 · E1/E4 0,41 · E1/E3 0,40 ·
E2/E4 0,42. **Kein Paar über 0,52.**

**Beschriftungen am Bildschirm** (`werkbank/schuss/rueckkopplung/verben.mjs`, jedes Brett
aufgeschlagen, Zahlen und Währung herausnormiert):

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| verschiedene Beschriftungen | 83 | 86 | 91 | 87 |
| nur in dieser Epoche | 40 | 40 | 44 | 44 |

**In allen vier identisch: 38.** Das sind die Wörter der Kernwoche — `WEITER`,
`FUHRE ABSCHICKEN`, `Nach Durst füllen`, `Wie vorige Woche`, `Nehmen`, `Festlegen`,
`So verabreden`, `Schließen`, `Das Jahr beginnen`. Alles darüber ist epochenverschieden:

* **1350** Grut vom Grutherrn · Bannbrief · Hopfen im Sack heimlich · Brautage vom Rat ·
  ANSCHLAGTAFEL mit Kreide an der Sudhauswand · Gewölbekeller
* **1600** Kellergärung im Felsenkeller · Den gemarkten Krug einführen · Anzeige bei der
  Zunftlade · Mit Hafer und Wicke gestreckt · Ausgedinge · jährlich
* **1884** Dampfsudwerk · Eis schneiden · Annonce im Wochenblatt · HYPOTHEK ·
  Flaschenhalle · Ganzer Wagen / Halber Wagen · Betriebshefe aus dem Bottich
* **1970** Kieselgurfilter · Betriebslabor, Stammwürze und Bittereinheiten · Anzeige beim
  Bundeskartellamt · Kastenaktion beim Handel · Bierdeckel drucken lassen · ABBRUCH ·
  Fahrzeugwaage

**Urteil zu (e): die Epochen sind keine Kostüme.** Rund die Hälfte der Wortliste ist
epocheneigen, und die eigenen Wörter benennen jeweils eine andere Sache, nicht dieselbe
Sache anders. Der Einwand, der bleibt: die **Kernwoche** — laden, abschicken, weiter — ist
in 620 Jahren dieselbe (`spiel/STAND-WELLE-1.md:213` hatte das schon so aufgeschrieben, es
gilt weiter), und 1350 und 1600 stehen sich mit Jaccard 0,51 am nächsten.

---

## AUFLAGEN

**A1 — 1350 zurück unter die Latte, und zwar an der Kasse, nicht am Nenner.**
Gemessen: Spearman **+0,742 / +0,701 / +0,701** über je 400 Wochen; Ziel `< 0,700`. Der
Treiber ist belegt: Jahresmedian der Kasse 234 → 538 Pf (×2,30) bei einem Nennerpreis, der
nur um ×1,33 steigt; Spearman der Kennzahl gegen die Kasse **+0,947**, gegen den
Nennerpreis −0,202. Die Kennzahl ist **nicht** kaputt — das Braujahr von 1350 wirft ab
Jahr 6 mehr ab, als das Haus ausgeben kann. Der Beleg steht doppelt: mit meinem Gerät
(drei Läufe) und mit einer wortgleichen Kopie des Originalgeräts (§3.5). Nachzuweisen an
derselben Reihe, mit **drei** Läufen, und **1600 bleibt dabei, wo es steht**
(+0,231 / +0,264 / +0,231).

**A2 — `gegner.js:1561` bekommt sein viertes Argument.**
`B.welt.meldeZug(bester.was, bester.preis, 'umkaempft')` → mit Zugschlüssel
(`gegner:abloesen:<k>` bzw. `gegner:zuvorkommen:<k>`; beide existieren als `[data-zug]` mit
`data-preis`, `gegner.js:1944` und `:1973`). Solange er fehlt, ist der Prüfschritt aus
ZUSTÄNDIGKEIT 24 in **4.311 von 4.800** gemessenen Wochen wirkungslos, und die Kopfzeile
nennt in 12–18 % der Wochen eine Zahl ohne greifbaren Knopf. Dasselbe für `stadt.js:1404`.
**Gehört DEM GEGNER bzw. DER STADT, nicht dem Kern.**

**A3 — `welt.js:503` prüft zu wenig.**
`if (!el || el.disabled) return null;` merkt nicht, dass der Knopf unter einem
aufgeklappten Brett liegt. Wer A2 umsetzt, hebt die Deckung von 82–88 % nur auf etwa 88 % —
den Rest hebt erst eine Sichtbarkeitsprüfung. **Kernbitte, keine Stückarbeit.**

**A4 — die Festlegungskarte nennt einen falschen Horizont.**
`preis.js:1729` schreibt „… führt das Haus bis 1636" auf jede unwiderrufliche Karte,
während die Amtszeit nach zwei Braujahren endet (`erbe-daten.js:315 STUNDE_ABSTAND = 2`;
gemessen: `amtszeit.nr` 1 → 8 in 14 Jahren, in allen vier Epochen und allen zwölf Läufen).
Entweder der Satz nennt die wahre Frist, oder `welt.js:379` würfelt eine, die stimmt.
Es ist der einzige Satz, der einer **unwiderruflichen** Entscheidung ihren Zeitraum angibt.

**A5 — die doppelte Zeile.**
`.gg-kennzahl` (`gegner.js:1570`) und `.deckung` (`kopf.js:125`) sagen in allen vier Epochen
Ziffer für Ziffer dasselbe und stehen übereinander im engsten Platz des Bildes. Eine der
beiden ist überflüssig geworden; welche, entscheidet die Aufsicht, nicht ein Stück.

**A6 — 1884 beobachten.**
Aufwärtsdrift ×2,77 über 14 Jahre, gehalten nur durch eine Delle 1889–1891
(Spearman +0,346 / +0,393 / +0,346; wöchentliche Gegenprobe +0,525). Es hält, aber knapp,
und es hält aus demselben Grund, aus dem 1350 nicht mehr hält.

**A7 — `preis-linie.mjs:39` hat `8899` fest verdrahtet.**
Wer damit misst, während Builder schreiben, misst ein wanderndes Ziel. Der Hafen gehört als
Argument oder Umgebungsvariable heraus — **von der Aufsicht, nicht von einem Builder**
(ZUSTÄNDIGKEIT 16).

---

## SPERRLISTE — im Wortlaut

1. **Der Nenner wird nicht verstellt, um rho zu senken.** Wer die Preise der Ablösungen oder
   des Zuvorkommens anhebt, damit die Kennzahl flacher läuft, entwertet die Latte genauso
   wie das Herunterpreisen der Angebote, das ZUSTÄNDIGKEIT 17 schon verboten hat. In 1350
   ist die **Kasse** zu reparieren, nicht der Nenner.
2. **1600 wird in dieser Sache nicht mehr angefasst.** +0,231 / +0,264 / +0,231, 0 von 14
   Jahren unter 1×, Streuung 0,033 über drei Läufe. Wer 1350 richtet, weist nach, dass 1600
   auf demselben Stand bleibt.
3. **`welt.ZUGRANG` bleibt, wie es ist.** Die Rangordnung `umkaempft 3 ·
   bindung/adresse/bau 2 · lage 1 · ohne Art 0` (`welt.js:485`) hält den 9-Pf-Umtrunk aus
   dem Nenner heraus. Wer sie umstellt, um eine Epoche zu glätten, macht die Zahl
   vergleichslos zu allem, was diese Welle vorher gemessen hat.
4. **Am Messgerät anderer wird nicht gedreht** (ZUSTÄNDIGKEIT 16). Kein Builder ändert
   `werkbank/schuss/eichung/preis-linie.mjs` oder `eichung/auswerten.py`, solange eine Latte
   damit läuft. Meine Geräte stehen daneben, nicht darüber, und sind neue Dateien:
   `werkbank/schuss/rueckkopplung/*`.
5. **`design/PRUEFUNG.md` ist Sperrliste, keine Latte.** Nichts in diesem Urteil ist daran
   gemessen, und nichts darin gilt als Ersatz für Latte 2.
6. **Gemessen wird auf 8900 am eingefrorenen Commit, nicht auf 8899 im Arbeitsbaum.** Eine
   Zahl von einem wandernden Ziel kann man niemandem vorhalten, und niemand kann sie
   nachstellen.
7. **Eine Epoche wird nicht geheilt, ohne die anderen drei nachzumessen.** Diese Runde ist
   der Beleg: 1600 ist repariert, 1350 gerissen, und beides steht in derselben Messung.

---

## Belege

    werkbank/schuss/rueckkopplung/linie-rk.mjs           Messgerät (Hafen 8900, Kopfzeile je Woche)
    werkbank/schuss/rueckkopplung/preis-linie-8900.mjs   Kreuzprobe: Kopie des Originalgeräts, nur Hafen geändert
    werkbank/schuss/rueckkopplung/auswerten-rk.py        rho (Pearson UND Spearman), Jahre <1x, Ehrlichkeit des Nenners
    werkbank/schuss/rueckkopplung/spalten.py             Spalten (a) (b) (c) (e)
    werkbank/schuss/rueckkopplung/heil.mjs               lage.length, Konsolenfehler, Anfangsbild
    werkbank/schuss/rueckkopplung/verben.mjs             Verbliste je Epoche, Bretter aufgeschlagen
    werkbank/schuss/rueckkopplung/michaeli1.mjs          erster Michaelitag, nichts gekauft
    werkbank/schuss/rueckkopplung/schirmbild.mjs         Kopfzeile als Bild
    werkbank/schuss/rueckkopplung/kopfzeile-e1..e4.png · kopfzeile.json · michaeli1.json · verben.json
    Rohdaten der zwölf Läufe: /tmp/rk/e{1..4}-{A,B,C}.json
