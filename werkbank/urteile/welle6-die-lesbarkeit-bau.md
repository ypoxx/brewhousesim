# DIE LESBARKEIT — Bau, Welle 6

*Builder-Bericht. Vierte Latte, `gauntlet/MESSLATTE.md` §4:*

> Gemessen wird bei **1366×768**, nicht auf der Entwurfsleinwand. Keine Schrift
> unter **12 px**, kein aktiver Knopf unter **24×24 px**, kein abgeschnittener
> Text.

---

## Das Ergebnis in drei Zeilen

Alle vier Epochen bei 1366×768, gemessen mit `lesbarkeit.mjs` der Aufsicht auf
dem eingefrorenen Stand `5afb4e3`, bewegt wurde nur `grund.css`:

| Kriterium der Latte | vorher | nachher | Arbeitsbaum heute | Stand |
|---|---|---|---|---|
| Textknoten unter 12 px | 1.893 | 1.893 | 1.899 | **gerissen, unverändert** |
| aktive Knöpfe unter 24×24 px | **246 von 334** | **14 von 334** | **7 von 334** | *fast erfüllt* — 97 % geschlossen |
| abgeschnittene Kästen | 81 | **91** | 96 | gerissen, um 10 schlechter |

*(Die Spalte „Arbeitsbaum heute" enthält zusätzlich die laufende Arbeit von
DER SUD und DER KLANG und ist deshalb keine Vorher/Nachher-Rechnung.
Wo unten 1.885 statt 1.893 steht, zählt meine eigene Kopie des Messgeräts nur
innerhalb von `#buehne` und lässt die acht Knoten von `#kern-lage` weg; die
Differenz ist konstant und verschiebt keinen Vergleich.)*

**Ehrlich gesagt: die Latte ist nicht erfüllt.** Erfüllt ist ein Teil davon,
und zwar der, der in meiner Datei liegt. Die Schriftgrößen liegen **nicht** in
meiner Datei — sie stehen in 354 Regeln der sieben Stück-CSS, und dort dürfen
und sollen sie geändert werden. Was das kostet, ist unten gemessen, nicht
geschätzt: es kostet **151 abgeschnittene Kästen statt 81** und **31 Dinge über
dem Rand**, und diese Kästen sind der eigentliche Rest der Arbeit.

Geändert wurde **eine** Datei: `spiel/stil/grund.css`.
`spiel/index.html` und `spiel/kern/**` sind unberührt; es gibt keinen
KERN-Punkt.

---

## 1 — Der Messstand

Zwei andere Builder schreiben gleichzeitig an `stuecke/sud*.js` und
`kern/ton.js`. Alle Zahlen unten sind deshalb auf einem **eingefrorenen Stand**
gemessen: `git archive 5afb4e3` in ein eigenes Verzeichnis, eigener Hafen
**8942**, und in dieses Verzeichnis wird nur `spiel/stil/grund.css` kopiert.
Damit bewegt sich zwischen zwei Messungen genau die Zeile, die ich bewege.

Sequenziell, nie zwei Browser gleichzeitig. Die Reproduzierbarkeit ist geprüft:
derselbe Stand zweimal gemessen ergab Ziffer für Ziffer dieselbe Zeile
(1885 · 91 · 14/334 · 115 Paare).

Werkzeuge: `werkbank/schuss/aufsicht/lesbarkeit.mjs` (Original der Aufsicht,
unangetastet) und eine eigene Kopie im Scratchpad, die zusätzlich zählt, was
**über den Rand** läuft und was sich **gegenseitig verdeckt** — beides steht
nicht in der Latte, ist aber die Rechnung, die man bezahlt, wenn man Schrift
groß macht.

---

## 2 — Der Befund, nachgemessen

`stil/grund.css:12` (alt):

```css
--s: min(calc(100vw / 2752), calc(100vh / 1536));
```

Bei 1366×768 ist `--s` = **0,4963 px**. Jede Schrift im Spiel steht als
`calc(var(--s) * N)`, N läuft von 10 bis 46, der Schwerpunkt liegt bei 13–19.
Damit das **kleinste** Vielfache (N = 10) 12 px erreicht, müsste `--s` auf
**1,20 px** — Faktor **2,42**.

Verteilung der 1.885 zu kleinen Textknoten über alle vier Epochen bei 1366×768:

| Stück | Knoten unter 12 px | | Vielfaches N | Knoten |
|---|---|---|---|---|
| DIE FUHRE | 771 | | N = 10 | 71 |
| DER SUD | 350 | | N = 11 | 75 |
| DIE STADT | 191 | | N = 12 | 112 |
| DER GEGNER | 172 | | N = 13 | 156 |
| DAS ERBE | 164 | | N = 14 | 268 |
| DER NAME | 149 | | N = 15 | **337** |
| DER PREIS | 48 | | N = 16 | 235 |
| Kern | 44 | | N = 17 | 203 |
| DER KLANG | 4 | | N = 18–24 | 428 |

---

## 3 — Die drei Wege, gegeneinander gemessen

Der Auftrag nannte drei denkbare Wege. Alle drei sind gemessen, keiner
geschätzt.

### Weg A — `--s` anheben (Untergrenze einziehen)

Epoche 1884, 1366×768, `--s` per Faktor hochgezogen:

| Faktor | kleinste | <12 px | Überlauf | Knopf<24 | über den Rand |
|---|---|---|---|---|---|
| 1,00 | 5,0 px | 474 | 20 | 64/87 | 1 |
| 1,20 | 5,7 px | 452 | 27 | 50/87 | 1 |
| 1,40 | 5,7 px | 368 | 42 | 40/87 | 4 |
| 1,60 | 5,7 px | 262 | 44 | 31/86 | 8 |
| 1,80 | 5,7 px | 125 | 53 | 21/87 | 16 |
| 2,00 | 5,7 px | 85 | 54 | 11/87 | 20 |
| **2,42** | 5,7 px | **80** | **64** | 9/88 | **35** |

Zwei Dinge stehen in dieser Tabelle.

**Erstens: der Weg endet bei 5,7 px und kommt nie tiefer.** Auch bei Faktor
2,42 bleiben 80 Textknoten unter 10 px. Der Grund ist eine einzelne Zeile in
einem fremden Stück, `stuecke/fuhre.js:2460`:

```js
var BEZUG = 'min(calc(100vw / 2752), calc(100vh / 1536))';
```

DIE FUHRE gibt ihrer Adressliste ein **eigenes** Bezugspixel, um sie aufs Brett
zu zwingen (Faktor bis herunter auf 0,62) — und **rechnet die Formel aus
`grund.css` dafür nach, statt sie zu lesen**. Jede Änderung an `--s` ist unter
`.fu-liste` wirkungslos. Das ist keine Nebensache: 771 der 1.885 zu kleinen
Knoten liegen dort.

**Zweitens: der Überlauf wächst schneller als die Schrift gewinnt** — und
abgeschnittener Text ist selbst ein Rissgrund derselben Latte. Bei Faktor 2,42
stehen 35 Dinge über dem Rand und die Tafeln verdecken einander auf 241 % der
Bildfläche. Das ist kein Spiel mehr, das ist ein Stapel.

Mit einem echten Boden in der Datei gemessen, alle vier Epochen, jeweils **mit**
dem Knopfboden aus §4:

| Boden | `--s` | <12 px | <10 px | Überlauf | Knopf<24 | über Rand |
|---|---|---|---|---|---|---|
| **aus** | 0,496 px | 1.885 | 1.800 | **91** | 14/334 | **1** |
| 0,55 px | 0,550 px | 1.816 | 1.561 | 121 | 8/332 | 2 |
| 0,60 px | 0,600 px | 1.743 | 1.262 | 131 | 8/332 | 8 |

Der Boden kauft 142 Textknoten und sechs Knöpfe und bezahlt mit **vierzig**
abgeschnittenen Kästen und sieben Dingen über dem Rand. Solange die Stücke
ihre Schriftböden nicht gesetzt haben, ist das ein schlechtes Geschäft.
**Entscheidung: Boden gebaut, aber auf 0 gestellt** — samt Messreihe im
Kommentar, damit der nächste sie nicht noch einmal fahren muss.

### Weg B — die Schrift entkoppeln (`max(12px, …)` je Regel)

Alle 354 Schriftregeln zur Laufzeit umgeschrieben auf
`font-size: max(12px, calc(var(--s) * N))`, dazu der Knopfboden:

| | vorher | Weg B |
|---|---|---|
| kleinste Schrift | 4,9 px | **12,0 px** |
| Textknoten unter 12 px | 1.885 | **0** |
| aktive Knöpfe unter 24 px | 246/334 | **2/328** |
| abgeschnittene Kästen | 81 | **151** |
| über den Rand | 1 | **31** |

**Zwei der drei Kriterien fallen damit vollständig, mechanisch, ohne eine
einzige Gestaltungsentscheidung.** Der Preis steht in der letzten Zeile, und er
ist namentlich bekannt:

*Überlauf:* `stadt .wort` 40 · `stadt .zahl` 30 · `sud .sud-kartensatz` 23 ·
`erbe .wort` 10 · `fuhre .fu-brett` 9 · `gegner .was` 4 · `sud .sud-zettel` 4 ·
`fuhre .fu-notsud-zeile` 4 · `fuhre .fu-knappheit` 4 · `name .nm-medium` 4 ·
`name .nm-schiene` 4 · `erbe .erb-band` 4 · `stadt .nutzen` 3

*über den Rand:* `fuhre .fu-haus` 21 · `sud .sud-spalte` 8 ·
`stadt .stadt-rauch` 1 · `name .nm-band` 1

Bemerkenswert: `max(12px, …)` wirkt **auch** unter `.fu-liste`, weil 12 px ein
absolutes Maß ist und kein Vielfaches. Weg B ist der einzige der drei, der die
Zeile in `fuhre.js` überhaupt aushebelt.

### Weg C — die Tokens gestaffelt umrechnen

Affine Umrechnung N → 0,35 · N + 20,7 (so gewählt, dass N = 10 auf 12 px
kommt), alle 354 Regeln:

| | Weg B (flach) | Weg C (gestaffelt) |
|---|---|---|
| kleinste Schrift | **12,0 px** | 7,9 px |
| Textknoten unter 12 px | **0** | 328 |
| abgeschnittene Kästen | **151** | 163 |
| über den Rand | **31** | 32 |

**Weg C ist auf jeder Achse schlechter.** Er scheitert an derselben Stelle wie
Weg A — ein Vielfaches bleibt ein Vielfaches, und unter `.fu-liste` wird es
mit 0,62 multipliziert. Und er wächst mehr als nötig: `max(12px, …)` hebt jede
Regel um **genau so viel wie nötig** und ist damit die Lösung mit dem
geringsten Flächenzuwachs. Weg C ist abgewählt und braucht nicht noch einmal
gemessen zu werden.

---

## 4 — Was gebaut wurde

Alles in `spiel/stil/grund.css`.

### 4.1 Zwei Bezugspixel statt einem

```css
--s0: min(calc(100vw / 2752), calc(100vh / 1536));   /* rein proportional  */
--s-boden: 0px;                                       /* gemessen, s. §3    */
--s:  max(var(--s-boden), var(--s0));                 /* alles Beschriftete */
```

und die Sicherung dazu:

```css
#ebene-platte, #ebene-bau { --s: var(--s0); }
```

**Warum die Trennung, wenn der Boden auf 0 steht:** weil sie die Voraussetzung
dafür ist, dass ihn jemand anheben *kann*. Die Platte ist `width:100%;
object-fit:cover`, die Hofbauten setzen ihre Breite in **Prozent** der Bühne
(`stadt.js:1188`) — das Bild hängt also nicht an `--s`, wohl aber sein
Schattenwurf und alles, was daneben steht. Ein Boden auf den Bildebenen würde
ein Haus von seiner gemalten Fläche lösen; diese eine Zeile verhindert das ein
für alle Mal. Heute ist sie wirkungslos, morgen ist sie der Unterschied.

`--s0` ist außerdem das, was DIE FUHRE braucht, um aufzuhören, die Formel
nachzurechnen (Auflage 1 unten).

### 4.2 Der Knopfboden

```css
@media (max-width: 2751px), (max-height: 1535px) {
  #buehne .knopf,
  #buehne [data-zug] { min-width: 24px; min-height: 24px; }
}
```

**246 → 14 von 334.** Das ist die eine Stelle, an der die Latte in meiner Datei
liegt: `.knopf` hatte `min-height: calc(var(--s) * 46)`, und 46 × 0,4963 =
22,8 px.

Die ID im Selektor gibt der Regel Vorrang vor den Klassenregeln der Stücke —
absichtlich.

**Warum der Medienschalter:** `min-height: 24px` **ersetzt** den Wert des
Stücks, es hebt ihn nicht an. Auf der Entwurfsleinwand 2752×1536 wäre das eine
*Verkleinerung* (dort sind es volle 46 px) — also genau dort, wo Latte 1 blind
vergleicht. Der Boden gilt deshalb nur unterhalb der Entwurfsleinwand.

Beide Teile sind nötig, und das ist gemessen (Epoche 1884):

| | Knopf<24 | Überlauf |
|---|---|---|
| nur `min-height` | 15/87 | 20 |
| nur `min-width` | 64/87 | 24 |
| **beide** | **2/87** | 24 |

`min-width` allein gewinnt **keinen einzigen** Knopf — die zu kleinen scheitern
alle zuerst an der Höhe. Zusammen schließen die beiden 13 weitere. Über alle
vier Epochen ist `min-height` allein sogar deutlich schlechter (73/339
Knöpfe, 2.056 zu kleine Textknoten), weil DIE STADT ihre Werkbankzeile nach
verfügbarer Breite füllt.

---

## 5 — Die Bildlatte, vorher und nachher

Aufnahmen aller vier Epochen, je zweimal, mit `werkbank/schuss.mjs` im Format
der Zielbilder (2752×1536) und zusätzlich bei 1366×768:

```
werkbank/schuss/lesbarkeit/vorher/E{1..4}-2752.png
werkbank/schuss/lesbarkeit/vorher/E{1..4}-1366.png
werkbank/schuss/lesbarkeit/nachher/E{1..4}-2752.png
werkbank/schuss/lesbarkeit/nachher/E{1..4}-1366.png
```

**Auf der Entwurfsleinwand sind E1, E2 und E3 Byte für Byte identisch**
(gleiche MD5-Summe vorher/nachher). E4 weicht in einem Kasten von 194 × 68 px
ab (0,066 % der Fläche, größte Abweichung 30 von 255). Der Kasten sitzt in DER
GEGNER, und er ist **nicht meine Änderung**: mit der *alten* Datei zweimal
hintereinander aufgenommen weicht derselbe Kasten genauso ab (87 Pixel, max 11,
x 2128–2264, y 911–970). Dort steht etwas, das von Lauf zu Lauf anders
gezeichnet wird.

→ **Latte 1 ist unberührt.** Das war die Bedingung, unter der ich überhaupt
etwas anfassen durfte, und sie ist nicht behauptet, sondern nachgerechnet.

Bei 1366×768 sichtbar verändert: die Knopfzeilen sind höher und treffbar. Preis
dafür: in DER STADT werden zwei Werkbank-Beschriftungen eine Stufe früher
abgeschnitten (`SUDPLAN` → `SUDPL…`, `DAS ERBE ^` → `DAS ER…`). Das sind die
zehn zusätzlichen Kästen aus der Kopfzeile dieses Berichts, und sie sind
namentlich in Auflage 3 vermerkt.

Die vier Epochen sehen weiterhin zueinander so aus, wie sie gedacht sind: die
Änderung ist epochenblind — sie kennt weder `data-epoche` noch ein Stück.

---

## 6 — Auflagen an die Stücke

Keine dieser Änderungen habe ich vorgenommen; sie liegen alle in fremden
Dateien. Sie sind gemessen, benannt und in der Reihenfolge ihres Ertrags
sortiert.

### Auflage 1 — DIE FUHRE: eine Zeile, 771 Textknoten

`stuecke/fuhre.js:2460`

```js
var BEZUG = 'min(calc(100vw / 2752), calc(100vh / 1536))';   // ALT
var BEZUG = 'var(--s0)';                                     // NEU
```

Die Formel aus `grund.css` ist dort abgeschrieben. Solange sie abgeschrieben
ist, wirkt **keine** Änderung am Bezugspixel unter `.fu-liste` — bei Faktor
2,42 blieben genau deshalb 80 Knoten unter 10 px stehen. `--s0` existiert
seit heute und ist genau dafür da. Ein Selbstbezug (`--s: calc(f * var(--s))`)
ist nach CSS-Regel ungültig; `--s0` löst das.

Zweitens: der Boden von 0,62 macht die Adressliste auf 1366×768 zu **4,3 px**
Schrift. Das ist die kleinste Schrift im ganzen Spiel. Rollen wäre hier das
kleinere Übel — der Kommentar an Ort und Stelle entscheidet sich anders, aber
er entscheidet sich gegen eine Zahl, die er bei 1920×1000 gemessen hat, nicht
bei 1366×768.

Drittens: `fuhre .fu-haus` läuft bei jeder Vergrößerung als erstes über den
Rand (21 von 31 Fällen in Weg B).

### Auflage 2 — alle sieben Stücke: der Schriftboden

In **jedem** `stil/<stueck>.css` und `stil/<stueck>-zusatz.css`:

```css
font-size: calc(var(--s) * N)   →   font-size: max(12px, calc(var(--s) * N))
```

354 Regeln, mechanisch, ohne Gestaltungsentscheidung. Auf der Entwurfsleinwand
ändert sich damit **nichts** für N ≥ 12 (dort ist `--s` = 1 px); nur die fünf
Regeln mit N = 10 und N = 11 werden dort auf 12 px angehoben. Ergebnis bei
1366×768: kleinste Schrift 12,0 px, **0** Textknoten darunter.

Verteilung der Arbeit, ausgezählt am laufenden Bild:

| Datei | Regeln | | Datei | Regeln |
|---|---|---|---|---|
| `fuhre.css` | 48 | | `sud.css` | 35 |
| `fuhre-zusatz.css` | 52 | | `sud-zusatz.css` | 6 |
| `gegner.css` | 48 | | `stadt.css` | 17 |
| `gegner-zusatz.css` | 17 | | `stadt-zusatz.css` | 1 |
| `preis.css` | 46 | | `erbe.css` | 16 |
| `preis-zusatz.css` | 10 | | `klang.css` | 1 |
| `name.css` | 40 | | `grund.css` *(meine)* | 12 |

Dazu **fünf inline gesetzte** Schriftgrößen aus `stuecke/stadt.js:1269`
(`el.style.fontSize = 'calc(var(--s) * ' + …`) — die brauchen denselben Boden
im Javascript. Summe 354.

### Auflage 3 — die Kästen, die danach übrig bleiben

Das ist die eigentliche Gestaltungsarbeit, und sie ist nicht mechanisch. Nach
Auflage 2 sind es 151 abgeschnittene Kästen statt 81. Namentlich:

| Stück | Kasten | Fälle | was zu tun ist |
|---|---|---|---|
| DIE STADT | `.wort`, `.zahl`, `.nutzen` | 73 | Werkbankzeile: weniger Einträge nebeneinander oder zweizeilig |
| DER SUD | `.sud-kartensatz`, `.sud-zettel`, `.sud-zverfahren` | 28 | Kartensatz umbrechen |
| DIE FUHRE | `.fu-brett`, `.fu-notsud-zeile`, `.fu-knappheit`, `.fu-haus` | 38 | Adressliste rollen statt schrumpfen (s. Auflage 1) |
| DAS ERBE | `.wort`, `.erb-band` | 14 | Band umbrechen |
| DER NAME | `.nm-medium`, `.nm-schiene`, `.nm-band` | 9 | Schiene kürzen |
| DER GEGNER | `.was` | 4 | Zeile kürzen |

Die harte Wahrheit dahinter: **bei 1366×768 passt bei 12 px Mindestschrift
nicht mehr so viel Text auf den Schirm wie bei 5 px.** Das ist keine
Umsetzungsfrage, das ist eine Inhaltsfrage. Wer Auflage 2 umsetzt und Auflage 3
nicht, tauscht eine Latte gegen eine andere.

### Auflage 4 — DER SUD: die letzten 14 Knöpfe

`stil/sud.css:526`

```css
#buehne .sud-zettel .knopf.sud-tat.klein.voll { min-height: calc(var(--s) * 24); }
```

Diese Regel unterbietet den Knopfboden mit einer eigenen ID-Regel und behält
damit als einzige im ganzen Spiel Knöpfe unter der Zielfläche. Nötig ist
`min-height: max(24px, calc(var(--s) * 24))` — oder ersatzlos streichen, dann
greift der Boden aus `grund.css`.

Auf meinem eingefrorenen Stand (5afb4e3) sind es 14 von 334, gemessen 83×20,
168×22, 168×19, 168×13, 168×23. Auf dem **laufenden Arbeitsbaum** sind es
inzwischen **7 von 334** — DER SUD arbeitet gerade an `stil/sud-zusatz.css`
und hat einen Teil davon nebenbei mit erledigt. Übrig bleiben ausschließlich
`sud:zettel-wechsel-frei` und `sud:zettel-wechsel-kauf`, gemessen 168×23,
168×21 und 168×14. Es ist genau diese eine Zeile.

---

## 7 — Was das kosten würde

| Auflage | Aufwand | Ertrag |
|---|---|---|
| 1 — FUHRE `BEZUG` | **eine Zeile** | macht das Bezugspixel überhaupt erst wirksam; 771 Knoten erreichbar |
| 4 — SUD `min-height` | **eine Zeile** | 14 → 0 Knöpfe, Kriterium 2 vollständig erfüllt |
| 2 — Schriftboden | 354 Regeln, mechanisch (ein `sed` je Datei plus Sichtprüfung) | 1.885 → 0, Kriterium 1 vollständig erfüllt |
| 3 — die Kästen | **echte Gestaltungsarbeit in sechs Stücken**, Inhalt muss weichen | 151 → 0, Kriterium 3 |

Die ersten drei Zeilen sind zusammen eine gute Stunde Arbeit und schließen
zwei der drei Kriterien vollständig. Die vierte ist die Welle.

---

## 8 — Was ich nicht getan habe, und warum

- **`--s` einfach angehoben.** Gemessen: geht nicht (§3, Weg A). Wer es
  trotzdem tut, hat bei Faktor 2,42 fünfunddreißig Dinge über dem Rand.
- **Fremde CSS angefasst.** Die Schriftregeln liegen in den Stück-Dateien; das
  ist deren Zuständigkeit. Gemessen, benannt, als Auflage geschrieben.
- **Den Knopfboden mit `!important` durchgedrückt.** Es hätte die 14 Knöpfe
  von DER SUD geholt und wäre ein Griff in ein fremdes Stück gewesen — noch
  dazu einer, der auf der Entwurfsleinwand die 46-px-Höhe des Grundknopfs
  gegen 24 px eingetauscht hätte. Auflage 4 statt Übergriff.
- **`werkbank/schuss/aufsicht/lesbarkeit.mjs` geändert.** Gehört der Aufsicht
  (ZUSTÄNDIGKEIT 16). Meine Zusatzmessungen liegen als eigene Kopie im
  Scratchpad.

---

## 9 — Abnahme

Alle drei Prüfungen auf dem **laufenden Arbeitsbaum** (Hafen 8899), sequenziell,
nach der Änderung. Geänderte `.js`-Dateien: **keine** — `node --check` entfällt,
die Änderung ist reines CSS.

```
$ node werkbank/schuss/aufsicht/tor.mjs
E1: OK   jahr=1350 zuege=105 lage=0 fehler=0
E2: OK   jahr=1600 zuege=113 lage=0 fehler=0
E3: OK   jahr=1884 zuege=116 lage=0 fehler=0
E4: OK   jahr=1970 zuege=107 lage=0 fehler=0
TOR OFFEN

$ node werkbank/schuss/aufsicht/spielprobe.mjs
  E1: OK   60 Wochen gespielt, 60 Zuege, Jahr 1352, Kasse 48,    lage 0, Fehler 0
  E2: OK   60 Wochen gespielt, 60 Zuege, Jahr 1602, Kasse 280,   lage 0, Fehler 0
  E3: OK   60 Wochen gespielt, 60 Zuege, Jahr 1886, Kasse 4200,  lage 0, Fehler 0
  E4: OK   60 Wochen gespielt, 60 Zuege, Jahr 1972, Kasse 50000, lage 0, Fehler 0
SPIELPROBE BESTANDEN

$ BREITE=1366 HOEHE=768 node werkbank/schuss/aufsicht/lesbarkeit.mjs
  E1: 25 abgeschnittene Kaesten · 462 Textknoten unter 12px (440 unter 10px) ·  2 von 82 Knoepfen unter 24px
  E2: 26 abgeschnittene Kaesten · 477 Textknoten unter 12px (453 unter 10px) ·  2 von 83 Knoepfen unter 24px
  E3: 24 abgeschnittene Kaesten · 476 Textknoten unter 12px (452 unter 10px) ·  2 von 87 Knoepfen unter 24px
  E4: 21 abgeschnittene Kaesten · 484 Textknoten unter 12px (461 unter 10px) ·  1 von 82 Knoepfen unter 24px

  Summe 1366×768: 96 Ueberlaeufe · 1899 Textknoten unter 12px · 7 von 334 Knoepfen unter 24px
```

Der Arbeitsbaum steht besser da als mein eingefrorener Stand (7 statt 14
Knöpfe), weil DER SUD parallel an `stil/sud-zusatz.css` arbeitet. Die
Vorher/Nachher-Rechnung in diesem Bericht steht deshalb auf dem eingefrorenen
Stand — sie ist die einzige, in der sich nur meine Zeile bewegt hat.

**Ein Lauf trägt kein Urteil:** die Vorher/Nachher-Messung auf dem
eingefrorenen Stand ist zweimal unabhängig gefahren worden und beide Male
ziffernidentisch (1885 · 91 · 14/334 · 115 Paare). Die Zahlen dieses Berichts
sind nachstellbar mit

```
git archive 5afb4e3 | tar -x -C <eigenes Verzeichnis>
python3 -m http.server <eigener Hafen> --bind 127.0.0.1
HAFEN=<eigener Hafen> BREITE=1366 HOEHE=768 node werkbank/schuss/aufsicht/lesbarkeit.mjs
```

---

## 10 — Der Stand der vierten Latte in einem Satz

Von den drei Kriterien ist eines fast geschlossen (Knöpfe: 246 → 7, es fehlt
**eine Zeile** in `sud.css`), eines unberührt (Schrift: 1.885 → 1.885, es
fehlen **354 mechanische Ersetzungen** in fremden Dateien, gemessener Effekt:
auf null) und eines um zehn Kästen schlechter geworden (abgeschnittener Text:
81 → 91, der Preis für die treffbaren Knöpfe) — und der Weg zu allen dreien
ist gemessen, nicht geraten.
