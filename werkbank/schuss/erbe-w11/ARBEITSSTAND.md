# WELLE 11 — DAS ERBE. Arbeitsstand (laufend geschrieben)

Auftrag: `gauntlet/WELLE-11.md`. Vorzustand **`7896ee6`** (dort ist `spiel/`
byteweise gleich mit `HEAD` — `git diff --stat 7896ee6 HEAD -- spiel/` ist
leer).

Meine Dateien: `spiel/stuecke/erbe*.js` · `spiel/stil/erbe*.css`. Sonst nichts.

---

## Die Lage vor der ersten Zeile Code — gemessen, nicht abgeschrieben

`werkbank/schuss/erbe-w11/sonde.mjs` und `breiten.mjs`, Messstand `7896ee6`
auf Hafen 8941, einzeln durch `aufsicht/messfenster.sh`, 2752x1536,
`?saat=1350`.

### Woher die Bildpunkte kamen (Ladezustand, alle vier Epochen gleich)

| Kasten | Mass | Bildpunkte |
|---|---|---|
| `.erb-leiste` | 1211x104 @1486,1100 | **126.461** |
| `.knopf.erb-weit` (die Tat) | 347x29 | 9.889 |
| 3x `.knopf.erb-uebergabe` | je 272x29 | 3x 7.751 |
| `.erb-hand` · `.erb-stand` · `.erb-nimmt` · `.erb-uhr` | je 17 px hoch | 13.891 |
| **Haushalt (`BRAUHAUS.haushalt.miss()`), Vereinigung** | | **136.192** |
| **photographisch (`rahmen-w10/messen.mjs`, mit Schlagschatten)** | | **239.643** |

Die vier Textspalten waren Kaesten, weil sie ein `border-left: 1px solid
var(--linie)` trugen — vier Striche von 17 px Laenge, und die Regel des
blinden Kritikers rechnet dafuer die ganze Huelle. Solange das Papier der
Leiste darunter lag, fiel das nicht auf.

Im obersten Sechstel: **0 px** — die Leiste sitzt bei y 71,6 %. Diese Zahl war
also nie das Problem und ist es auch jetzt nicht.

### Die beiden benannten Maengel, nachgestellt

**Auflage 9 — gekuerzte Kaufknoepfe.** `breiten.mjs` misst je Knopf, was das
Wort BRAUCHT (`scrollWidth`) gegen das, was es HAT (`clientWidth`):

| Epoche/Zustand | Knopf | braucht | hat | |
|---|---|---|---|---|
| E4 laden | `erbe:uebergabe:leibgeding` „Versorgungszusage · jährlich" | 253 | 157 | **gekuerzt** |
| E4 w30 | dasselbe | 253 | 201 | **gekuerzt** |
| E4 w30 | `erbe:nachschrift` „Nachschrift · 2 Häuser" | 199 | 176 | **gekuerzt** |

Ursache: `flex: 1 1 0` gab jedem Knopf ein Viertel der Leiste, gleichgueltig
wie lang seine Aufschrift war, und `text-overflow: ellipsis` schnitt den Rest
weg. In E1–E3 passte es zufaellig; in E4 ist die Schrift Maschinenschrift
(`var(--mono)`) und damit rund 40 % breiter — deshalb traf es genau dort.

**Rahmen-Auflage 2 — das Buch ohne Griff.** `erb-buch` 1156x1075 = **29,4 %**
der Buehne, `data-zug` darin: 4 im Ladezustand und **0 nach 30 Wochen** (nach
dem Erbfall sind beide Laden leer, also gibt es keine Zeilenknoepfe mehr). Ein
Blatt, das ein knappes Drittel des Bildes deckt und keinen einzigen Zug
traegt.

Und das leere untere Drittel des Kritikers, nachgemessen (Unterkante des
Inhalts gegen Kastenhoehe, 1075 px):

| | E1 | E2 | E3 | E4 |
|---|---|---|---|---|
| Ladezustand | 535 | 535 | 530 | 578 |
| nach 30 Wochen | 618 | 592 | 558 | 664 |

Also 49 bis 62 % gefuellt. Der Kritiker hat recht, und „ein Drittel" ist noch
freundlich.

---

## Was gebaut wurde

| Datei | Aenderung | wofuer |
|---|---|---|
| `stil/erbe.css` | `.erb-leiste` ohne Grund, Rahmen, Schatten und Kopfstreifen; Lichthof am Band | Haushalt |
| `stil/erbe.css` | Bandtrenner als Zeichen (`::before`) statt `border-left` | Haushalt |
| `stil/erbe.css` | `.erb-knopf` `flex: 0 0 auto`, flacher, enger | Auflage 9 + Haushalt |
| `stil/erbe.css` | `.erb-buch` 40 % x 54 % ab 17,5 %, `overflow-y: auto` | Rahmen-A2, A16, oberstes ⅙ |
| `stil/erbe.css` | Epochenpapier nur noch fuers Buch, Epoche auf der Leiste in Schrift und Knopfrand | Folge daraus |
| `stuecke/erbe.js` | `Z.buchOffen`, Griff `erbe:buch`, Schliessknopf `erbe:buch:zu`, `B.blatt.melde()` | Rahmen-A2 |
| `stuecke/erbe.js` | kuerzere Aufschriften, `kurzName` ohne `…` | Auflage 9 |
| `stuecke/erbe-daten.js` | `buchName`/`buchKurz` je Epoche | Griff |

### Der Kern in einem Satz

Auf der Leiste steht Wort fuer Wort dasselbe wie vorher — das Papier
darunter ist fort, und das ist der ganze Unterschied. Das Buch gehoert sich
selbst: zugeklappt steht es nicht im DOM, aufgeschlagen hat es einen eigenen
Schliessknopf.

---

## Wie gemessen wird — und warum nicht im Arbeitsbaum

Drei Builder schreiben gleichzeitig in `spiel/`. `git status -- spiel/` zeigte
beim Beginn der Messung `erbe.js`, `fuhre.js` und `gegner.js` als geaendert.
Ein erster Anlauf auf dem Arbeitsbaum (Hafen 8899) meldete prompt
`haushalt.ueberRand() = 1` in 1884 und 1970 — auf dem Vorzustand steht dort
nichts, und auf meinem isolierten Stand auch nicht. **Der Kasten gehoerte
nicht mir.**

Deshalb:

* **VOR** = `aufsicht/messstand.sh 7896ee6 8941` — der eingefrorene Vorzustand.
* **NACH** = `erbe-w11/nachstand.sh 8942` — derselbe Vorzustand PLUS
  ausschliesslich `stuecke/erbe*.js` und `stil/erbe*.css` aus dem
  Arbeitsbaum. Nichts sonst. Die Marke traegt den Vorzustand und die
  Pruefsumme meiner fuenf Dateien.

Jeder Lauf einzeln durch `aufsicht/messfenster.sh`, nie zwei Browser
nebeneinander, `?saat=1350`, 2752x1536.

---

## DIE ZAHLEN — Ladezustand

### Je Stueck, photographisch (`rahmen-w10/messen.mjs` — das Geraet, aus dem die 239.643 stammen)

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| `erbe` **vorher** | 233.181 | 238.810 | **239.643** | 211.525 px |
| `erbe` **nachher** | **17.297** | **15.465** | **17.445** | **22.497** px |
| Grenze | 28.000 | 28.000 | 28.000 | 28.000 px |
| Kaesten des Stuecks vorher → nachher | 18 → 5 | 23 → 5 | 24 → 5 | 23 → 5 |
| oberstes ⅙ vorher → nachher | 0 → 0 | 0 → 0 | 0 → 0 | 0 → 0 |

Die 239.643 des Auftrags sind damit auf demselben Geraet nachgestellt (1884)
und liegen jetzt bei **17.445**. Groesster Wert der vier Epochen: **22.497**
(1970, Maschinenschrift, breiteste Aufschriften) gegen 28.000 erlaubt —
**20 % Luft**.

### Innensicht (`BRAUHAUS.haushalt.miss().je.erbe`)

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| vorher | 136.192 | 136.192 | 136.192 | 136.192 px |
| nachher | **19.296** | **17.184** | **19.488** | **24.960** px |
| oberstes ⅙ | 0 → 0 | 0 → 0 | 0 → 0 | 0 → 0 |

`BRAUHAUS.haushalt.pruefe()` nennt DAS ERBE in keiner Epoche mehr.

### Gesamtdeckung (`bild-w9/deckung.mjs`, Ladezustand)

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| gesamt vorher | 18,4 % | 19,3 % | 18,7 % | 19,3 % |
| gesamt **nachher** | **15,3 %** | **16,1 %** | **15,5 %** | **16,4 %** |
| oberstes ⅙ vorher | 35,6 % | 36,0 % | 36,3 % | 37,7 % |
| oberstes ⅙ **nachher** | **34,5 %** | **34,9 %** | **35,2 %** | **36,3 %** |
| unterstes ⅙ | 7,1 → 7,1 | 6,5 → 6,5 | 6,8 → 6,8 | 6,5 → 6,5 % |

Das oberste Sechstel faellt um 1,1 bis 1,4 Punkte, obwohl DAS ERBE dort **null**
Bildpunkte hatte und hat. Das ist ein Nebeneffekt und gehoert der STADT: mit
dem Brett verschwindet auch sein Reiter aus der Reiterzeile (Auflage 12 des
Kritikers verlangt, dass sie kuerzer wird).

---

## Auflage 9 — die gekuerzten Kaufknoepfe

`probe.mjs` prueft JEDEN Knopf des ganzen Spiels mit `data-preis` auf ein
Auslassungszeichen oder einen ueberlaufenden Textknoten, im Lade- und im
30-Wochen-Zustand aller vier Epochen:

| | vorher | nachher |
|---|---|---|
| gekuerzte Knoepfe **mit Preisschild** | 2 (beide `erbe:*`, in 1970) | **0** |

Was uebrig bleibt und **nicht mir gehoert**: `gegner:oeffnen:konzern` traegt in
1970 „2.910.070 DM" in einem Kasten fuer 109 von 130 px. Das ist kein Knopf mit
Preisschild (`data-preis` fehlt), faellt also nicht unter Auflage 9 — aber es
ist eine gekuerzte ZAHL, und der Kritiker hat in Welle 7 ausdruecklich
festgehalten, dass eine gekuerzte Zahl sich wie eine vollstaendige liest.
**Meldung an DEN GEGNER.**

---

## Rahmen-Auflage 2 — der eigene Griff

| | vorher | nachher |
|---|---|---|
| `data-zug` in `erb-buch`, Ladezustand | 4 | **5** |
| `data-zug` in `erb-buch`, nach 30 Wochen | **0** | **1** (der Schliessknopf) |
| Buch zugeklappt | im DOM, von der STADT weggeschnitten | **gar nicht im DOM** |
| Griff zum Aufschlagen | Reiter der STADT | **`erbe:buch` auf der eigenen Leiste** |
| `haushalt.geklemmt()` nach 30 × WEITER + Escape | 1 (`erbe .erb-buch blatt`) | **leer** |
| Buchmass | 1156x1075 = 29,4 % | **1101x829 = 21,6 %** |
| Anteil am obersten ⅙, aufgeschlagen | 60.320 px | **0** |

Nachgestellt in allen vier Epochen: Griff drücken → Buch auf; Escape → Buch zu
und aus dem DOM; Griff drücken → wieder auf; `erbe:buch:zu` → wieder zu.
Kein Konsolenfehler, `BRAUHAUS.lage` 0, `verdeckt()` 0.

**Was ich dabei ueber den Rahmen gelernt habe und melde, obwohl es gegen die
schoene Zahl spricht:** wer das Buch aufschlaegt und INNERHALB von 2,6 s
Escape drueckt und es sofort wieder aufschlaegt, bekommt es nicht — das
Escape-Fenster des Rahmens (`kern/haushalt.js`, ANLAEUFE bis 2600 ms) fasst
nach und macht es wieder zu. Bei meiner ersten Probe habe ich nur 1,2 s
gewartet und daraufhin „KEIN SCHLIESSKNOPF" gemessen. Das war nicht das Buch,
das war die Uhr des Rahmens.

Und: `geklemmt()` traegt eine Zeile, wenn der Spieler das Buch OFFEN hat und
Escape drueckt — nicht weil ein Griff fehlt, sondern weil
`haushalt.schliesse()` die Klemme **immer zuerst** anlegt und **danach** erst
nach dem Griff des Stuecks fragt (`kern/haushalt.js:493`). `ohneGriff()` bleibt
dabei leer, das Buch geht wirklich zu. Im Abnahmefall der Auflage — 30 ×
WEITER, dann Escape, ohne dass jemand das Buch aufgeschlagen hat — ist
`geklemmt()` **leer**.

---

## DER BEFUND, DER GRÖSSER IST ALS MEINE EIGENE ZAHL

Nach **30 × WEITER und einem Escape** steigt die GESAMTdeckung auf meinem
Stand von 18,0 auf **47,0 %** — mit zwei unabhängigen Geräten gemessen:

| 30 Wochen + Escape | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| gesamt vorher (`bild-w9`, 3× Escape) | 18,1 % | 18,1 % | 17,9 % | 20,2 % |
| gesamt **nachher** | **47,1 %** | **46,8 %** | **46,5 %** | **52,4 %** |
| `erbe` vorher (`messen.mjs`, 1× Escape) | 208.709 | 224.692 | 218.949 | 52.423 px |
| `erbe` **nachher** | **15.028** | **15.250** | **11.109** | **0** px |
| Tafeln > 200.000 px² vorher | 2 (`.sud-achse`) | 2 | 2 | 2 |
| Tafeln > 200.000 px² **nachher** | **3** — dazu **`sud .sud-brett` 1293x1091 = 1.410.554 px²** | 3 | 3 | 3 |

**Mein Stueck ist in dieser Zahl auf null bis 0,4 % herunter. Was aufgegangen
ist, ist `sud-brett` — 33,4 % der Bühne.** Auf dem Vorzustand ist dasselbe
Brett in derselben Sekunde **weggeschnitten**.

Der Mechanismus, soweit er aus dem Quelltext folgt (`brettprobe.mjs` misst ihn
nach): `stadt.js:1408` schlägt zum Jahreswechsel **jedes** Brett über 25 % der
Bühne von selbst auf. Über dieser Schwelle lagen ZWEI: `erb-buch` (29,4 %) und
`sud-brett` (33,4 %). Sie liegen fast deckungsgleich übereinander, die
Platzordnung der STADT lässt nur eines liegen — und das war bisher meines.
Der Rahmen konnte meines danach schließen, weil es die Klasse `blatt` trägt;
**`sud-brett` trägt sie nicht, also erreicht Escape es nicht.**

**Das heisst: die 18,0–20,3 %, die Welle 10 fuer diesen Zustand berichtet hat,
waren verdeckt gemessen.** Das Erbe-Buch lag über dem Sud-Brett. Nimmt man das
Erbe-Buch weg — und genau das verlangt die Auflage —, steht darunter ein
Brett, das niemand geschlossen bekommt.

**Auflage, die daraus folgt, mit Datei und Abnahme — sie gehoert DEM SUD:**
`stil/sud.css` · `.sud-brett` misst 1293x1091 = 1.410.554 px² = 33,4 % der
Bühne und liegt damit über der 25-%-Schwelle von `stadt.js:1408`; es trägt
nicht die Klasse `blatt`, also fasst die Blattaufsicht des Rahmens es nicht an.
*Abnahme:* nach 30 × WEITER und einem Escape ist `BRAUHAUS.haushalt.tafeln()`
in allen vier Epochen leer, und die Gesamtdeckung liegt wieder unter 20 %.
Zwei Wege stehen offen: unter 25 % der Bühne bleiben (dann schlägt die STADT
es nicht mehr von selbst auf), oder die Klasse `blatt` tragen und
`BRAUHAUS.blatt.melde()` benutzen (dann räumt Escape es weg).

---

## Zwischenstand der uebrigen Messungen

*(wird laufend ergaenzt; alle Rohdaten in `messungen/`)*
