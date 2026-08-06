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

## Zwischenstand der Messung

*(wird laufend ergaenzt; alle Rohdaten in `messungen/`)*
