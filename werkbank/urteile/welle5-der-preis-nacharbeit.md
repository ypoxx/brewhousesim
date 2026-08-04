# WELLE 5 — DER PREIS, Nacharbeit an den fuenf Auflagen

Laufend geschrieben. Der Stand am Ende der Datei sagt, was fertig ist.

**Urteil, das hier abgearbeitet wird:** `werkbank/urteile/welle5-der-preis-urteil.md`
(BESTEHT MIT AUFLAGE, gemessen an `6b59a18`).

**Messstand.** `werkbank/schuss/aufsicht/messstand.sh 6b59a18 8906` — der
Vorher-Stand, eingefroren und von der reparierten Fassung selbst gegengeprueft
(`MESSSTAND 6b59a18 … (Fassung geprueft)`, Exit 0). Der Arbeitsbaum liegt auf
**8899**; `curl … /spiel/stuecke/preis.js | sha1sum` = `844e2bd…` = der
Arbeitsbaum, also liefert 8899 wirklich, was ich schreibe.

**Alles sequenziell.** Ein Browser nach dem anderen, nie zwei nebeneinander —
der Kritiker hat gemessen, dass dieses Spiel sequenziell gar nicht streut.

**Ueber wie viele Braujahre gemessen wird, steht ueber jeder Zahl.** Der
eingetragene Stand +0,591 / +0,231 / +0,393 / +0,275 ist der Wert der
unveraenderten Vorbild-Hand ueber **vierzehn Michaelitage / 400 Wochen**.
Jede rho-Zahl unten traegt diese Angabe.

---

## Was hier abgearbeitet wird

| Auflage | Sache | Stand |
|---|---|---|
| 1 | Der zweite Zaehler zaehlt Angebote, heisst aber Festlegungen | **erledigt** |
| 2 | Die Zahl fehlt in der offenen Tafel — also am Tag der Wahl | **erledigt** |
| 3 | `.pr-fest` schneidet den Satz ab, der den Preis nennt | **erledigt, am Bildschirm nachgemessen: 119 → 0** |
| 4 | Acht Amtszeiten, zwei bezahlbare Festlegungen | **gebaut, wird gemessen** |
| 5 | Der Satz bei `preis.js:1057` nennt die Hand nicht; Chronik E4 | **erledigt** |

*(Die Zeilen werden beim Abarbeiten fortgeschrieben.)*

---

## 0. Das Geraet ist geeicht, bevor eine Zahl kommt

Die unveraenderte Vorbild-Hand (`werkbank/schuss/preis-kritik-w5/linie-vorbild.mjs`,
Byte fuer Byte `rueckkopplung-r3/linie.mjs`) auf dem eingefrorenen `6b59a18`,
Hafen 8906, 400 Wochen, Saat 1350:

```
E1@8906: 400 Wochen (1350–1363), Kasse 39–609, KENNZAHL 1,55–18,44×
         ueber 14 Jahre, Festlegung 1×, Seitenfehler 0
Spearman +0,591   Pearson +0,587   <1x 0/14
```

**+0,591 ueber vierzehn Michaelitage** — Ziffer fuer Ziffer die Zahl des
Kritikers und die des eingetragenen Standes. Jede Zahl unten ist mit diesem
Geraet gemessen.

**Ein Griff, der ihm gefehlt hat, ist dazugekommen:** `BRAUHAUS.preis.taxe()`
(`preis.js`, neben `lage()`/`anschlag()`/`leiter()`). Er gibt je Michaeli die
Jahreslast, die Taxe jeder Festlegungskarte, die Kasse und die Frage
`bezahlbar` zurueck — nur gelesen, von nichts benutzt, aendert das Spiel
nicht. Der Kritiker konnte zaehlen, DASS jede Karte `disabled` ist; er musste
von Hand nachrechnen, WIE WEIT sie danebenliegt. Das steht jetzt da.

---

## 1. AUFLAGE 4 — der Befund, bevor gebaut wird

Gemessen mit derselben Linie in der Fassung, die Festlegungen WILL
(`werkbank/schuss/preis-w5b/linie.mjs`, `WILL=1` — die Hand des Kritikers,
`festhand.mjs`, nachgebaut), 400 Wochen, Hafen 8899 = Arbeitsbaum vor jeder
Aenderung. Sie nimmt in E1 **zwei** und in E2 **zwei** Festlegungen — Ziffer
fuer Ziffer der Befund des Kritikers.

### 1.1 Die Taxe laeuft der Lade NICHT in allen vier Epochen davon

Der Kritiker nennt als Ursache: „`festBasis()` haengt die Taxe an
`grund × teuerungJahr^Jahre` — sie waechst mit der Zeit, die Kasse nicht."
**In Epoche 1350 stimmt das nicht, und die Zahl steht hier daneben.**

| ueber 14 Braujahre | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| Taxe-Grundzahl `festBasis()` | 470 → **783** (×1,67) | 2.800 → 4.547 (×1,62) | 42.000 → 77.600 (×1,85) | 500.000 → 886.000 (×1,77) |
| Michaeli-Lade der Vorbild-Hand | 112 → **498 (Hoechstwert)** (×3,4) | 640 → 997 (×1,6) | 14.250 → 23.761 (×1,7) | 86.000 → 69.983 (×0,8) |
| Abstand zum billigsten der grossen | 8,9× → **3,0×** (**faellt**) | 8,3× → 8,6× (steigt) | 2,2× → 2,3× (steigt) | 1,3× → 2,4× (steigt) |

In 1350 waechst die Lade **doppelt so schnell wie die Taxe**; der Abstand zum
`realrecht` faellt von 8,9 auf 3,0 Laden. Die Karte bleibt trotzdem in jedem
einzelnen Jahr `disabled`. In 1600/1884/1970 hat der Kritiker recht: dort
steht die Lade, und die Taxe geht weg.

### 1.2 Und die Probe darauf: eine eingefrorene Taxe haette NICHTS geaendert

Die Gegenrechnung ist entscheidbar, ohne dass man sie spielen muss: friert man
`festBasis()` auf den Wert des Eroeffnungsjahres ein (die schaerfste Fassung
von „haeng die Taxe an etwas, das nicht davonlaeuft"), kostet die billigste
der **grossen** Festlegungen

| | 1350 `realrecht` | 1600 `ratssitz` | 1884 `bahnvertrag` | 1970 `genossenschaft` |
|---|---|---|---|---|
| eingefroren auf das Eroeffnungsjahr | **800** | **5.300** | **31.500** | **110.000** |
| hoechste Michaeli-Lade in 14 Jahren | **498** | **997** | **23.761** | **86.000** |
| erreichbar? | nein | nein | nein | nein |

**Null zusaetzliche Festlegungen in allen vier Epochen.** Die Ursache ist
also nicht die Steigung, sondern die **Luecke in der Leiter**: die Anteile
springen von 0,18 / 0,10 / 0,22 / 0,11 unmittelbar auf 1,70 / 1,90 / 0,62 /
0,22 — dazwischen liegt in drei von vier Epochen **nichts**. Deshalb wird
unten die Leiter gefuellt und die Steigung nicht angefasst: eine Aenderung an
`festBasis()` haette jede heute erreichbare Karte VERBILLIGT, und genau das
ist die einzige Aenderung, die die Wellenzahl bewegen kann (die Vorbild-Hand
greift bei `|Preis| ≤ 45 % der Lade` zu).

---

## 2. AUFLAGE 1 — der zweite Zaehler zaehlt jetzt, was danebensteht

`preis.js` setzte den Grifftext zusammen aus
`festlegungenGesamt()` + `' Festlegungen · '` + `Object.keys(Z.fertig).length`
+ `' von dieser Tafel gebaut'`. `Z.fertig` sind FERTIGE ANGEBOTE. Der Kritiker
hat abgelesen: `2 Festlegungen · 0 von dieser Tafel gebaut`, obwohl beide von
dieser Tafel kamen.

**Gebaut:** eine einzige Funktion `chronikAufschrift()` setzt den Satz zusammen,
und beide Chronikknoepfe lesen sie — damit koennen Griff und Reiter nie mehr
Verschiedenes behaupten. Drei Zahlen, drei Woerter:

```
Chronik des Hauses · 2 Festlegungen · 2 von dieser Tafel · 6 Bauten stehen
```

* `festlegungenGesamt()` — alle Chronikzeilen mit `art='festlegung'`, aus allen
  vier Stuecken (unveraendert).
* `festlegungenEigen()` — `Object.keys(Z.festGenommen).length`, **neu**: die
  Festlegungen DIESER Tafel. Das ist die Zahl, die im Satz ueber Festlegungen
  stehen muss.
* `bautenFertig()` — die alte Zahl, nicht verschwunden, sondern in ihr eigenes
  Satzglied mit ihrem eigenen Wort gerueckt („Bauten stehen"). Auf dem Reiter in
  der offenen Tafel steht sie nicht mit, weil dort Platz die knappe Ware ist.

Am Bildschirm abgelesen (`bild/e2-1920x1080.png`, 1600, Tafel offen):
`Chronik des Hauses · 0 Festlegungen · 0 von dieser Tafel`. Nach dem
Reinheitsgebot steht dort `1 Festlegung · 1 von dieser Tafel` — Einzahl und
Mehrzahl unterscheidet der Satz jetzt auch.

## 3. AUFLAGE 2 — die Zahl steht jetzt dort, wo entschieden wird

Zwei Stellen statt einer, und die zweite ist die wichtige:

1. **Der Reiter in der offenen Tafel** (`preis.js`, `zeichneTafel`) traegt die
   Aufschrift mit den Zahlen. Er ist der einzige Chronikknopf, den man am
   Michaelitag ueberhaupt sieht — `zeichneGriff` kehrt bei aufgeschlagener
   Tafel vorher zurueck.
2. **Die Ueberschrift DIE FESTLEGUNG** — zwei Handbreit ueber dem Knopf, der
   die Zahl um eins erhoeht, steht jetzt:

   > Eine je Amtszeit. Sie ändert eine Regel für den Rest der Partie und wird
   > nicht zurückgenommen. · **Das Haus hat 0 Festlegungen, 0 davon von dieser
   > Tafel · heute 3 zu haben**

   Der letzte Halbsatz ist gezaehlt, nicht behauptet: er nennt, wie viele
   Karten der Tafel heute wirklich bezahlbar sind, und sagt „heute reicht die
   Kasse für keine", wenn es keine gibt. Nachgesehen in
   `bild/e2-tafel-1610.png` („heute 3 zu haben") und `bild/e1-tafel-1362.png`
   („heute 1 zu haben").

## 4. AUFLAGE 3 — die Karte traegt ihren eigenen Text. Gemessen: 119 → 0

`.pr-fest`/`.pr-karte` hatten `overflow: hidden`, ihre Kinder
`flex: 0 1 auto; min-height: 0`. Die Kinder schrumpften also unter ihren Inhalt
und schnitten den Rest weg — darunter der Satz, der den Preis der
unwiderruflichen Wahl nennt.

**Gebaut:** der Text wandert in einen eigenen Kasten `div.pr-karte-text`
(`preis.js`, `karteText`). Er bekommt den ganzen uebrigen Platz der Karte und
traegt seinen Ueberschuss selbst (`overflow-y: auto`); **seine Kinder schrumpfen
nicht mehr** (`flex: 0 0 auto; overflow: visible`) und schneiden deshalb auch
nichts mehr ab. Hinweis und Knopf bleiben direkte Kinder der Karte: die
Handlung wird nie aus der Karte gedrueckt und scrollt auch nicht weg.
Die drei alten `overflow: hidden` der Zusatzlage sind zurueckgenommen — sie
haben die Ueberlagerung beseitigt, indem sie den Satz abgeschnitten haben. Sie
stehen als Kommentar da, damit sie niemand versehentlich wieder einfuehrt.

Dazu der zweite Teil der Auflage: **`preis.css:139` kuerzt `pr-was` nicht mehr
mit Ellipse.** Die Zeile der Rechnung darf umbrechen, und die Wurzel bekommt
ihre eigene Zeile darunter (sie ist ein Halbsatz zur Zeile darueber, keine
Spalte). Die ZAHL bleibt rechts, einzeilig.

**Nachgemessen mit dem Geraet des Kritikers** (`ueberlauf.mjs`, vier Epochen mal
drei Aufloesungen, Michaelitafel aufgeschlagen, Hafen 8899):

| Stelle | Kritiker auf `6b59a18` | jetzt |
|---|---|---|
| `span.pr-was` | 36 | **0** |
| `span.pr-wurzel` | 36 | **0** |
| `span.pr-folge-text` | 16 | **0** |
| `div.pr-satz-klein` | 9 | **0** |
| `b.pr-fest-name` | 8 | **0** |
| `div.pr-was-text` | 8 | **0** |
| `div.pr-sperrt` | 3 | **0** |
| `div.pr-hinweis` | 3 | **0** |
| **alle `pr-*` zusammen** | **119** | **0** |
| alle Stuecke zusammen | 416 | 297 |

`BRAUHAUS.lage` = 0, Seitenfehler 0, Koerper nie breiter als das Fenster, auf
allen zwoelf Seiten. **Die 297, die bleiben, gehoeren DEM SUD
(`div.sud-kartensatz`), DEM GEGNER, DEM NAMEN und den Reitern der STADT
(`span.wort`, `span.zahl` aus `B.knopf()`) — aus `pr-*` kein einziger.**
Bilder: `werkbank/schuss/preis-w5b/bild/`.

Am Bild nachgesehen, die zwei Stellen, die der Kritiker benannt hat
(`bild/e2-1920x1080.png`): auf *Der Zunftbrief mit dem Ratssitz* steht die Regel
jetzt bis „Der Anschlag wird am Tisch gemacht, an dem das Haus sitzt.", auf
*Der Bierbann über vier Dörfer* steht „Dafür neu und für immer: Bannzins an den
Landesherrn." vollstaendig da. Und in der Rechnungsspalte von 1600 sind alle
fuenf Namen lesbar — „Ungeld auf den Ausschank", „Malzaufschlag des
Kurfürsten", „Pachtzins ans Kloster", „Zunftumlage und Meisterbüchse",
„Stadtanlage nach der Nahrung" — statt vier von fuenf abgeschnitten.

## 5. AUFLAGE 5 — der Satz nennt seine Hand, und die Chronik nennt den Preis

`preis.js`, Michaeli-Schritt 7d, im Wortlaut ergaenzt:

* **die Hand steht jetzt im Satz:** „GEMESSEN MIT DER GROBEN HAND
  (`spielprobe.mjs` bzw. `preis-w5/boden.mjs`: WEITER druecken, jede Woche
  irgendeinen bedienbaren Knopf, nie verkaufen), am eingefrorenen Stand
  `3e6d08c`, Buchung fuer Buchung, Epoche 1350: … steht in Woche 16 auf null
  und bleibt dort bis Woche 30".
* **die Gegenzahl steht daneben:** unter sorgfaeltiger Hand greift der Vorgriff
  in **0 von 60** Michaelitagen, und die Kasse beruehrt in **0 von 1.680**
  Wochen die Null (Zahlen des Kritikers, uebernommen und benannt).
* **der Preis steht daneben und wird nicht kleingeredet:** der Bau hebt in 1970
  die Kasse 1978 und 1979 auf genau den Notpfennig und verschiebt die
  **Wellenzahl von E4 von +0,108 auf +0,275, also um +0,167** (vierzehn
  Michaelitage, Vorbild-Hand). Der kleinste Wert der Reihe steigt von 1,955×
  auf 2,124×.

Das steht im Quelltext und nicht nur in einem Bericht, weil der Quelltext das
einzige ist, was mit dem Bau mitwandert.
