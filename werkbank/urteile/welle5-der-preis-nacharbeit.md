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
| 4 | Acht Amtszeiten, zwei bezahlbare Festlegungen | **erledigt: 2/2/2/4 → 4/4/3/4 Festlegungen, gemessen** |
| 5 | Der Satz bei `preis.js:1057` nennt die Hand nicht; Chronik E4 | **erledigt** |

**Die Wellenzahl ist dabei Ziffer fuer Ziffer stehengeblieben:
+0,591 / +0,231 / +0,393 / +0,275 ueber vierzehn Michaelitage, Spannweite
0,000 ueber drei Laeufe je Epoche, sechzehn Laeufe insgesamt.**

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

*(Kleine Berichtigung an seiner Zahl, weil ich seine Datei nachgezaehlt habe:
das Urteil sagt „an 415 Stellen"; `ueberlauf.json.gz` enthaelt **416**
Sichtungen. An der Sache aendert das nichts — die 119 bei DER PREIS stimmen
Ziffer fuer Ziffer.)*

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

---

## 6. AUFLAGE 4 — WAS GEBAUT WURDE

Nicht die Steigung, sondern die Leiter (Begruendung und Gegenrechnung in
Abschnitt 1). **`festBasis()` ist unangetastet.** Dazugekommen sind sieben
Sprossen, in `stuecke/preis-daten.js`, jede mit `ab:` gestaffelt, damit die
Wahl ueber die acht Amtszeiten verteilt wiederkommt statt sich in den ersten
zwei Jahren zu erschoepfen:

| Epoche | neu | Anteil | ab | was sie kostet, fuer immer |
|---|---|---|---|---|
| 1350 | Die Marktbank auf ewig | 0,42 | 1352 | Standgeld an den Rat (`pflichtNeu`, fest) — **der Ertrag ist fest, das Standgeld waechst mit der Teuerung** |
| 1350 | **Die Pfründe im Haus** | 0,0 | 1353 | **Zufluss** (`einmal: 8`) gegen Kost und Pflege des Pfründners, ohne Ende |
| 1350 | Der Jahrtag in der Pfarrkirche | 0,50 | 1357 | Jahrtag und Seelgerät an die Pfarre (`pflichtNeu`, fest) · +16 Ansehen · zwei Häuser gebunden |
| 1600 | Die ewige Gült auf die Stadt | 0,15 | 1601 | nichts — aber das Geld ist aus dem Haus und kommt nie zurück (`ertrag` 45 fl) |
| 1600 | **Der Gültbrief auf das Anwesen** | 0,0 | 1603 | **Zufluss** (`einmal: 5`) gegen eine ewige Gült, nicht ablösbar |
| 1884 | Die Betriebskrankenkasse | 0,17 | 1885 | Beiträge (`pflichtNeu`, fest) · +14 Ansehen |
| 1970 | Der Eintrag in die Denkmalliste | 0,085 | 1973 | Unterhalt nach Auflage (`pflichtNeu`, fest) · Wachstumsdeckel |

**ZWEI ZUFLUSS-KARTEN SIND DER KERN DES BAUS.** Der Kritiker hat selbst gezeigt, warum
1970 als einzige Epoche funktioniert: „moeglich nur, weil sie mit `konzern`
(+65.000 DM) anfaengt." 1884 hat dieselbe Karte (`aktien`). **1350 und 1600
hatten keine** — und 1600 ist der aermste Fall von allen. Der Rentenkauf ist
der historisch exakte Gegenstand dafuer: Zins nehmen war verboten, eine Gült
kaufen nicht, und der ganze Kredit dieser Jahrhunderte lief ueber diesen einen
Brief. Beide Seiten liegen jetzt nebeneinander auf der Tafel — kaufen oder
verkaufen, und beides unwiderruflich, weil eine EWIGE Gült nicht ablösbar war.

Und 1350 hat seine eigene bekommen, nachdem der erste Messlauf gezeigt hat,
dass zwei Sprossen dort nicht reichen: **Die Pfründe im Haus**. Es darf
ausdruecklich NICHT derselbe Brief sein — die erste Regel von
`preis-daten.js` verlangt, dass zwischen zwei Epochen nichts wiederzuerkennen
ist ausser dem Ort. Der Rentenkauf gehoert der Ordnung des 16. Jahrhunderts.
Das Recht des 14. hat einen eigenen, derberen Weg an Bargeld: man verkauft
eine Pfruende. Ein alter Buerger legt sein Vermoegen auf den Tisch und isst
dafuer am Tisch des Hauses. Der Brief lautet auf das HAUS und nicht auf den
Mann — stirbt er, rueckt der naechste nach; deshalb ist die Last ewig und die
Karte gehoert auf diese Tafel und nicht unter die Angebote.

**Warum ueberhaupt eine Zufluss-Karte, gemessen:** mit den zwei
Ausgabe-Sprossen allein kam 1350 von zwei auf **drei** Festlegungen und blieb
bei elf von vierzehn Michaelitagen ohne bezahlbare Karte. Der Grund stand in
den Zahlen: die Lade der Hand, die Festlegungen will, steht ab 1357 zwischen
64 und 282 Pf, waehrend dieselbe Partie mit Angebotskaeufen 333 bis 498
haelt — wer nichts kauft, erwirtschaftet nichts. Mit der Pfruende steht 1350
bei **vier** Festlegungen. Das ist derselbe Hebel, den der Kritiker an 1970
selbst benannt hat.

**Kein bestehender Preis ist gesenkt worden.** Das ist die eine Aenderung, die
die Wellenzahl bewegen koennte: die Vorbild-Hand greift zu, sobald eine Karte
hoechstens 45 im Hundert der Michaeli-Lade kostet. Jede neue Sprosse liegt
darueber, und zwar gemessen an der Kassenreihe der Vorbild-Hand selbst:

| neue Karte | engster Abstand zur 45-Prozent-Schwelle | Jahr | von der Vorbild-Hand genommen |
|---|---|---|---|
| `marktbank` | **+29 %** (290 gegen 224) | 1360 | nein |
| `jahrtag` | +56 % (350 gegen 224) | 1360 | nein |
| `stadtguelt` | **+14 %** (510 gegen 449) | 1605 | nein |
| `krankenkasse` | +22 % (13.000 gegen 10.692) | 1896 | nein |
| `denkmal` | +92 % (55.000 gegen 28.705) | 1976 | nein |
| `pfruende` · `gueltbrief` | Zufluss statt Taxe: `einmal × Jahreslast` liegt in jedem gemessenen Jahr ueber der Schwelle | — | nein |

Gerechnet ist das gegen die Kassenreihe des Kritikers auf **seinem** Hafen
(`preis-kritik-w5/vorbild-e?.json.gz`, `6b59a18`), nicht gegen meine eigene —
und nachgemessen: die Vorbild-Hand nimmt nach dem Bau genau dieselben
Festlegungen wie vorher (**1 / 1 / 0 / 0**).

Der engste Abstand ist die Gült der Stadt mit 14 im Hundert. Das ist knapp, und
es steht hier, statt gerundet zu werden.

### Ein zweiter Bau, der aus Auflage 3 folgt: die Tafel zeigt vier Karten

Mit sechs bis sieben Festlegungen je Epoche waeren sieben Karten nebeneinander
in eine Reihe geraten, die 35 im Hundert der Spalte hoch ist — und jede waere
so schmal geworden, dass ihr Text wieder abgeschnitten haette. Die
Angebotsseite loest dasselbe seit jeher mit `angeboteJeJahr: 4`.

`festlegungenTafel()` zeigt deshalb **vier**: die **drei billigsten offenen** —
das ist die Wahl, die heute wirklich zu treffen ist — und dazu die
**teuerste**, denn sie ist das Ziel, auf das gespart wird, und ein Ziel, das
man nicht mehr sieht, ist keines. **Der ganze Katalog mit Taxe steht
unveraendert auf der Chronikseite** unter WAS DIESE ZEIT NOCH ANBIETET; dort
wird nichts weggelassen.

**Was diese Regel kostet, und ich sage es selbst:** sind mehr als drei Karten
zugleich bezahlbar, liegt die vierte bezahlbare nicht auf der Tafel, sondern
nur in der Chronik. Weil die drei gezeigten die BILLIGSTEN sind, ist jede
verdeckte teurer als drei, die dastehen — der Spieler hat also nie weniger als
drei bezahlbare Wahlen, aber er kann eine teure bezahlbare uebersehen. Das ist
der Preis dafuer, dass keine Karte mehr abgeschnitten wird.

---

## 7. DIE WELLENZAHL — drei Laeufe je Epoche, 400 Wochen = vierzehn Michaelitage

Gemessen mit dem **unveraenderten** Vorbild
(`werkbank/schuss/preis-kritik-w5/linie-vorbild.mjs`, Byte fuer Byte
`rueckkopplung-r3/linie.mjs` — ZUSTAENDIGKEIT 16), sequenziell, ein Browser
nach dem anderen, Saat 1350, Hafen 8899.

**Die Laufzeit steht in der Zahl:** vierzehn Michaelitage. Der Kritiker hat
gezeigt, dass dieselbe Partie in E1 bei zwoelf Michaelitagen auf +0,762 steht
und die Latte reisst, bei dreizehn auf +0,692, bei vierzehn auf +0,591, bei
fuenfzehn auf +0,421. Ich messe ueber vierzehn, weil der eingetragene Stand aus
dieser Zaehlweise stammt, und schreibe es an jede Zahl.

### DIE LATTE HAELT, UND SIE HAELT ZIFFER FUER ZIFFER

Zwoelf Laeufe, drei je Epoche, sequenziell, auf dem **letzten** Stand
(alle Aenderungen dieser Nacharbeit eingebaut):

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| eingetragener Stand (`6b59a18`) | +0,591 | +0,231 | +0,393 | +0,275 |
| **Lauf A** | **+0,591** | **+0,231** | **+0,393** | **+0,275** |
| **Lauf B** | **+0,591** | **+0,231** | **+0,393** | **+0,275** |
| **Lauf C** | **+0,591** | **+0,231** | **+0,393** | **+0,275** |
| **Spannweite ueber drei Laeufe** | **0,000** | **0,000** | **0,000** | **0,000** |
| **Bestaetigungslauf auf dem ALLERLETZTEN Stand** | **+0,591** ×3 | **+0,231** | **+0,393** | **+0,275** |
| Jahre unter 1× | 0/14 | 0/14 | **1/14** | 0/14 |
| Pearson (zum Vergleich) | +0,587 | +0,002 | +0,315 | +0,294 |
| Kasse ueber 400 Wochen | 39–609 | 251–2.525 | 1.757–23.789 | 1.998–86.000 |
| Kennzahl klein–gross | 1,55–18,44× | 1,54–15,11× | 0,84–9,40× | 2,12–9,14× |
| Wochen ohne Kennzahl (`zugDeckung` null) | 0/400 | 0/400 | 0/400 | 0/400 |
| Seitenfehler · Abbrueche · `lage` | 0 · 0 · 0 | 0 · 0 · 0 | 0 · 0 · 0 | 0 · 0 · 0 |
| Festlegungen der Vorbild-Hand | 1 | 1 | 0 | 0 |

**|rho| < 0,700 in allen vier Epochen und allen zwoelf Laeufen.** Hoechster
Betrag +0,591 (E1). „Hoechstens ein Jahr von sechs unter 1×" ist erfuellt:
0 / 0 / 1 / 0 von je vierzehn.

**Die Zahlen sind nicht nur innerhalb der Latte — sie sind Ziffer fuer Ziffer
dieselben wie vor dem Bau**, in allen vier Epochen. Auch die Kassenreihe, die
Kennzahlreihe und die Zahl der Festlegungen der Vorbild-Hand (1/1/0/0) sind
unveraendert. Das ist kein Zufall, sondern die Bauregel: kein bestehender
Preis ist gesenkt worden, und jede neue Karte liegt gemessen ueber der
Schwelle, ab der diese Hand zugreift (Tabelle in Abschnitt 6). Was diese Hand
nie anfasst, kann ihre Partie nicht veraendern — und genau das ist hier
zwoelfmal nachgemessen statt behauptet.

**Zur Buchfuehrung ueber die Laeufe, damit die Zahl nachstellbar ist.** Die
zwoelf Laeufe oben liegen auf dem Stand, der alles ausser der letzten Karte
enthaelt. Danach ist in 1350 die Pfruende dazugekommen (Begruendung in
Abschnitt 6), und weil eine Zahl nur zaehlt, wenn sie den LETZTEN Stand misst,
sind danach **drei weitere Laeufe fuer 1350** und **je einer fuer 1600, 1884
und 1970** gelaufen: `+0,591 ×3 · +0,231 · +0,393 · +0,275`, Ziffer fuer
Ziffer. Die neue Karte liegt allein im Datenblock der Epoche 1350; die drei
anderen Epochen koennen sich davon nicht bewegen, und der Bestaetigungslauf
zeigt, dass sie es nicht tun. **Insgesamt sechzehn Laeufe der Vorbild-Hand,
alle sequenziell, alle mit Seitenfehler 0 und `lage` 0.**

### Eine Karte, die ich selbst zurueckgenommen habe, bevor sie gemessen war

Die ewige Gült stand im ersten Ansatz auf `ertrag: 150` gegen eine Taxe von
420 fl — **Ruecklauf 2,8 Jahre, das beste Geschaeft der ganzen Epoche**, besser
als jedes Angebot ausser der Darre. Eine unwiderrufliche Wahl, die sich in drei
Jahren bezahlt macht, ist keine Wahl, sondern ein Geschenk mit Siegel. Der
Zins steht jetzt auf **45 fl** (Ruecklauf neun bis fuenfzehn Jahre, in der
Nachbarschaft von `auswaertiger` 11,8 und `hopfenkontrakt` 15,7). Ihr Wert
liegt woanders und ist eine Regel dieser Epoche: auf bares Geld schlaegt der
Rat siebzig im Hundert dessen an, was ueber dem Freibetrag liegt — was in
einer Guelt steckt, liegt nicht mehr bar in der Lade.

Aus demselben Grund ist die Marktbank von `ertrag: 26` auf `44` gegangen: mit
26 gegen ein Standgeld von 16 bis 27 Pf im Jahr trug sie sich **nie**, und
eine Karte, die niemand nehmen kann wollen, fuellt keine Luecke. Der
Messlauf, der auf dem ersten Ansatz schon zur Haelfte durch war, wurde
weggeworfen und der ganze Satz neu gemessen — die Zahlen unten stehen alle auf
demselben, letzten Stand.

---

## 8. AUFLAGE 4 — WAS DABEI HERAUSKOMMT, gezaehlt wie der Kritiker gezaehlt hat

Zwei Haende, weil eine allein in die Irre fuehrt. Beide 400 Wochen = vierzehn
Michaelitage, sequenziell, Saat 1350, Endstand.

### (i) Die Hand des Kritikers — sie WILL Festlegungen und laesst die Angebote stehen

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| Festlegungen in 14 Jahren, **vorher** | 2 | 2 | 2 | 4 |
| Festlegungen in 14 Jahren, **nachher** | **4** | **4** | **3** | **4** |
| Michaelitage ohne bezahlbare Festlegung, vorher | 11/14 | 12/14 | 11/14 | 8/14 |
| Michaelitage ohne bezahlbare Festlegung, nachher | **7/14** | **8/14** | **9/14** | **7/14** |
| Michaelitage mit **leerer** Festlegungsreihe, vorher | 0/14 | 0/14 | 0/14 | **5/14** |
| dieselbe Zahl, nachher | 0/14 | 0/14 | 0/14 | **0/14** |

**Der Befund, wegen dem der Kritiker durchgefallen waere, ist weg:** „danach
traegt in E1 ab 1357, in E2 ab 1605 und in E3 ab 1887 JEDE Festlegungskarte
`disabled`". In 1970 kam dazu, dass in den letzten fuenf Braujahren gar keine
Karte mehr auf der Tafel lag — der Katalog war aufgebraucht. Beides ist
gezaehlt behoben.

**Diese Hand verarmt sich selbst, und das gehoert in den Befund.** Sie kauft
grundsaetzlich kein Angebot, also waechst das Haus nicht; ihre Lade steht in
1350 ab 1357 zwischen 64 und 282 Pf, waehrend dieselbe Partie mit
Angebotskaeufen 333 bis 498 haelt. Die verbleibenden „Michaelitage ohne
bezahlbare Festlegung" sind zum grossen Teil die Jahre unmittelbar NACH einer
Festlegung — genau so soll ein Preis wirken.

### (ii) Die Hand, die das Haus fuehrt UND ihre Amtszeit nutzt

Wortgleich die Vorbild-Linie (Angebote, Sud, Fuhre — alles), nur ohne deren
Faustregel „hoechstens 45 im Hundert der Lade": sie nimmt die billigste
Festlegung, die das Spiel zulaesst. Das ist der Spieler, um den es geht.

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| **Festlegungen in 14 Jahren** | **4** | **4** | **3** | **4** |
| Michaelitage MIT bezahlbarer Festlegung | 7/14 | 6/14 | 5/14 | 7/14 |
| genommen | 1350 `vertrag` · 1354 `marktbank` · 1356 `brunnen` · 1358 `pfruende` | 1600 `reinheit` · 1602 `stadtguelt` · 1604 `hofbefreiung` · 1606 `gueltbrief` | 1884 `konvention` · 1886 `aktien` · 1888 `krankenkasse` | 1970 `privat` · 1972 `konzern` · 1974 `denkmal` · 1982 `handelsmarke` |
| Kasse ueber 400 Wochen | 22–590 | 24–3.069 | 1.271–23.643 | 0–210.995 |
| Seitenfehler · `lage` | 0 · 0 | 0 · 0 | 0 · 0 | 0 · 0 |

**Vier von acht Amtszeiten treffen eine unwiderrufliche Wahl, und sie treffen
sie im Abstand von zwei Jahren.** Das ist genau der Takt, den `festlegungOffen`
vorgibt (eine je Amtszeit, acht Amtszeiten in vierzehn Jahren), und es ist der
Stand, den der Kritiker an 1970 als den erreichbaren bezeichnet hat: „1970
zeigt, dass es geht: dort raeumt dieselbe Hand 4 von 4 ab." Jetzt tun es drei
von vier Epochen.

**Was NICHT erreicht ist, und ich sage es selbst:** die grossen Festlegungen —
`freikauf` 2,20 · `realrecht` 1,70 in 1350, `eigentum` 2,40 · `ratssitz`
1,90 · `bierbann` 2,80 in 1600, `bahnvertrag` 0,75 · `marke` 0,62 in 1884 —
bleiben in vierzehn Braujahren unerreichbar. Sie kosten das Zwei- bis
Dreizehnfache der hoechsten Michaeli-Lade, die eine Epoche je sieht, und keine
Zahlungsweise und keine Teuerungsbremse holt das in vierzehn Jahren ein
(Rechnung in 1.2). Sie sind der Horizont dieses Stuecks und stehen auf der
Tafel als vierte Karte, damit man sieht, worauf man spart — aber wer nach
vierzehn Braujahren miszt, wird sie nie genommen sehen. Das ist eine
Entwurfsentscheidung, keine Panne; wer sie anders will, muss den Anteil senken,
und dann faellt die Karte in den Griff der Faustregel und bewegt die
Wellenzahl.


---

## 9. KERN: die eine Zeile, die nicht mir gehoert — unveraendert offen

`spiel/kern/welt.js:412-413`, `rechneJahrAb()`:

```js
var unterhalt = Math.round(W.haus.kasse * 0.04 + W.vorrat.plaetze * 0.6);
W.haus.kasse -= unterhalt;                 // ungeprueft
```

`welt.zahle()` zwei Bildschirme darueber prueft die Deckung und gibt `false`
zurueck, wenn die Lade nicht reicht. **Diese Zeile prueft nicht.** Sie ist die
einzige Stelle im ganzen Spiel, an der die Kasse rechnerisch negativ werden
kann; der Kritiker hat es unabhaengig gefunden und dieselbe Zeile genannt. In
4 × 14 Braujahren ist es unter sorgfaeltiger Hand nie dazu gekommen (kleinster
Zwischenstand 39 Pf), und mein Vorgriff faengt den Fall an Michaeli desselben
Wochenwechsels ab (`uhr.js:160`: `rechneJahrAb()` laeuft VOR `sende('jahr')`).
Er repariert aber nur: die Kasse war in der Zwischenzeit negativ, und ein
Stueck, das in diesem Augenblick `welt.kann()` fragt, bekommt eine falsche
Auskunft.

**Vorschlag, unveraendert aus dem Bau der Welle 5:**

```js
var unterhalt = Math.min(Math.max(0, Math.floor(W.haus.kasse)),
                         Math.round(W.haus.kasse * 0.04 + W.vorrat.plaetze * 0.6));
```

`spiel/kern/**` ist schreibgeschuetzt, `spiel/index.html` eingefroren — beides
unberuehrt.

## 10. Befunde des Kritikers, die DIESES Stueck betreffen und die ich NICHT geaendert habe

* **ZUSTAENDIGKEIT 17, zweimal gerissen** (1350 im Jahr 1353: Kasse 246 gegen
  zweitbilligstes Angebot 280; 1600 im Jahr 1603: 597 gegen 840). Die Eichung
  weist die Umsetzung ausdruecklich DER FUHRE zu. Meine Laeufe reproduzieren
  die Kassenreihe Ziffer fuer Ziffer, also steht der Befund unveraendert. Er
  liesse sich von hier aus nur beheben, indem die Angebotspreise gesenkt
  wuerden — und das ist genau die Aenderung, die die Kennzahl bewegt, weil das
  billigste Angebot dieser Tafel in den Nenner geht. Ohne Auftrag fasse ich
  das nicht an.
* **DER GEGNER verstummt in 1350 nach 1358** — nicht dieses Stueck, und von
  hier aus nicht erreichbar.
* **`disabled` MIT `data-soll-aus="0"`** (309/379/367/407 Sichtungen) und
  **Knoepfe ganz OHNE `data-soll-aus`** (822/848/838/914): der Kritiker hat
  ausdruecklich gezaehlt, dass davon **aus `preis:*` kein einziger** kommt.
  Alle neuen Knoepfe dieses Baus gehen wie alle bisherigen durch `B.knopf()`
  und tragen das Merkmal (ZUSTAENDIGKEIT 25).
* **Die Kennzahl ist bei 1280×800 halb hinter dem Reiter der STADT**
  (`kern/kopf.js:127`, `left: 93%`) — KERN und STADT.


---

## 11. ABNAHME

```
node --check spiel/stuecke/preis.js         OK
node --check spiel/stuecke/preis-daten.js   OK
node --check spiel/stuecke/preis-zusatz.js  OK

node werkbank/schuss/aufsicht/tor.mjs
  E1: OK  jahr=1350  zuege=105  lage=0  fehler=0
  E2: OK  jahr=1600  zuege=112  lage=0  fehler=0
  E3: OK  jahr=1884  zuege=116  lage=0  fehler=0
  E4: OK  jahr=1970  zuege=107  lage=0  fehler=0
  TOR OFFEN

node werkbank/schuss/aufsicht/spielprobe.mjs
  E1: OK  60 Wochen, Jahr 1352, Kasse 48       lage 0, Fehler 0
  E2: OK  60 Wochen, Jahr 1602, Kasse 280      lage 0, Fehler 0
  E3: OK  60 Wochen, Jahr 1886, Kasse 4.200    lage 0, Fehler 0
  E4: OK  60 Wochen, Jahr 1972, Kasse 50.000   lage 0, Fehler 0
  SPIELPROBE BESTANDEN
```

Dazu **sechzehn Laeufe der Vorbild-Hand** zu 400 Wochen, **acht Laeufe** der
beiden Festlegungs-Haende und **zwoelf Bildschirmseiten** von `ueberlauf.mjs`:
null Seitenfehler, null Abbrueche, `BRAUHAUS.lage` = 0 in allen.

**Angefasst wurden nur:** `spiel/stuecke/preis.js`,
`spiel/stuecke/preis-daten.js`, `spiel/stil/preis-zusatz.css`.
`spiel/index.html` und `spiel/kern/**` sind unberuehrt; kein `git`.

## 12. WAS OFFEN BLEIBT — ehrlich aufgezaehlt

1. **Die grossen Festlegungen bleiben in vierzehn Braujahren unerreichbar**
   (Abschnitt 8, letzter Absatz). Sie sind der Horizont, nicht der Zug.
2. **Die Tafel zeigt vier von bis zu sieben Karten.** Sind mehr als drei
   zugleich bezahlbar, liegt die vierte bezahlbare nur in der Chronik
   (Abschnitt 6). Der Grund ist Auflage 3: mehr Karten nebeneinander heisst
   schmalere Karten, und schmalere Karten haben den Text abgeschnitten.
3. **`kern/welt.js:412` ist weiter ungeprueft** (Abschnitt 9). KERN.
4. **ZUSTAENDIGKEIT 17 ist in 1353 und 1603 weiter gerissen** (Abschnitt 10).
   Von diesem Stueck aus nur zu beheben, indem die Angebotspreise fallen — und
   die stehen im Nenner der Kennzahl.
5. **Die Latte haengt weiter an der Laufzeit.** Bei zwoelf Michaelitagen steht
   E1 auf +0,762 und reisst; bei vierzehn auf +0,591. Der Kritiker hat der
   Aufsicht empfohlen, die Laufzeit in den Namen der Messlatte zu schreiben.
   Ich schliesse mich an und habe jede Zahl dieses Berichts mit ihr versehen.
6. **`wachstumsdeckel` ist im Kern kein Deckel, sondern eine Verguenstigung.**
   `umsatzGewicht()` faellt damit von 0,30 auf 0,18, und der ANSCHLAG faellt
   mit — die Angebote werden also billiger. Drei Karten dieses Stuecks
   (`konvention`, `genossenschaft`, `privat`) benutzen ihn als STRAFE
   („waechst nie wieder ueber seinen Bezirk hinaus"), und die neue Karte
   `denkmal` tut es ihnen gleich. Der Befund ist aelter als dieser Bau und
   nicht von ihm verursacht; ich habe ihn beim Nachrechnen gefunden und trage
   ihn ein, statt ihn stehenzulassen.

---

## Fortschritt

- [x] Urteil ganz gelesen, Belege des Kritikers nachgezaehlt (416 statt 415)
- [x] Messstand `6b59a18` auf 8906, Geraet an +0,591 geeicht
- [x] `BRAUHAUS.preis.taxe()` gebaut — der Griff, der dem Kritiker gefehlt hat
- [x] AUFLAGE 1 — zweiter Zaehler zaehlt Festlegungen, Bauten stehen daneben
- [x] AUFLAGE 2 — die Zahl steht am Michaelitag ueber der Siegelreihe
- [x] AUFLAGE 3 — 119 `pr-*`-Ueberlaeufe → **0**, zweimal nachgemessen
- [x] AUFLAGE 4 — sieben Sprossen, zwei davon mit Zufluss; 2/2/2/4 → 4/4/3/4
- [x] AUFLAGE 5 — Hand im Satz, Wellenzahl-Kosten im Quelltext
- [x] Wellenzahl: 16 Laeufe, +0,591 / +0,231 / +0,393 / +0,275, Spannweite 0,000
- [x] TOR OFFEN, SPIELPROBE BESTANDEN, `node --check` auf allen drei .js
- [x] Bericht laufend geschrieben
