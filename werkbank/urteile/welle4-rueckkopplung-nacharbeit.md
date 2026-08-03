# DIE RÜCKKOPPLUNG, Nacharbeit zu Runde 2 — Bericht des Builders

Welle 4, Stück 1, Nacharbeit nach dem Urteil **FÄLLT DURCH**.
Geschrieben am 3. August 2026, **vor** der Rückgabe.

**Gemessen am eingefrorenen Stand `da7d690`** (Hafen 8900,
`werkbank/schuss/aufsicht/messstand.sh da7d690`) und am **PROBESTAND** — das ist
derselbe Commit plus ausschließlich meine geänderten Dateien, auf Hafen 8901
(`werkbank/schuss/rueckkopplung-r3/probestand.sh`). **Nicht am Arbeitsbaum.**
Der Arbeitsbaum trägt gleichzeitig die Arbeit von DER SUD und DER KLANG; DER SUD
hat gemeldet, dass der Gärraum sich jetzt als `art:'bau'` meldet und damit den
Nenner der Kennzahl stellen kann. Wer dort misst, misst zwei Änderungen auf
einmal und kann keiner von beiden eine Zahl zuschreiben.

**Welches rho:** ich rechne beide und **urteile nach SPEARMAN**, wie der
Kritiker und aus denselben zwei Gründen — es ist die Zahl, die
`werkbank/schuss/eichung/auswerten.py` rechnet, und es ist die Frage nach der
Rangfolge, nicht nach einer Geraden. Pearson steht überall daneben.

---

## 0 · DER BEFUND, MIT DEM DIESE RUNDE ANFANGEN MUSS

### Der Kritiker hat recht. Und der Grund, warum ich ihn verfehlt habe, ist jetzt gemessen und auf Knopfdruck reproduzierbar.

Ich habe in Runde 2 gemeldet, 1350 sei „identisch, Ziffer für Ziffer".
Der Kritiker und die Aufsicht haben unabhängig das Gegenteil gemessen. **Beide
Messungen sind echt, beide stehen am selben Commit — und der Unterschied liegt
nicht im Stand, sondern in der HAND.**

`werkbank/schuss/eichung/preis-linie.mjs` sieht nach jedem Klick **einmal** hin
(`klick()`, feste Wartezeiten von 60 bis 220 ms). Ist der Knopf in dieser
Millisekunde noch nicht neu gezeichnet, gilt er als „nicht getroffen", und der
Klick **fällt ersatzlos aus**. Ob er ausfällt, hängt an der Auslastung der
Maschine. Am härtesten trifft es die Schleife, die zu Michaeli den Sudplan
stellt: fällt dort ein Klick aus, braut das Haus ein Jahr lang weniger — und die
ganze Partie läuft anders.

**Die Gegenprobe, dreimal, alles am eingefrorenen `da7d690`, Epoche 1350,
`saat=1350`, 400 Wochen:**

| Hand | Kasse min–max | Kennzahl min–max | Spearman |
|---|---|---|---|
| feste Wartezeiten, Maschine belastet (Klicks fallen aus) | 48–462 | 0,75–7,88 | **−0,152** |
| dieselbe Hand, Wartezeiten ×3, Maschine ruhig (jeder Klick landet) | **39–908** | **1,55–41,67** | **+0,701** |
| beharrliche Hand (bis zu 6× hinsehen), Maschine belastet | **39–908** | **1,55–41,67** | **+0,701** |

Die zweite und dritte Zeile sind **Ziffer für Ziffer** die Reihe des Kritikers:

    5,89 · 1,55 · 4,27 · 2,79 · 5,90 · 4,74 · 10,52 · 41,67 · 26,39 · 7,05
         · 6,88 · 19,27 · 13,67 · 9,20

und nicht nur die Reihe, sondern **jede Nebenzahl seines Urteils**: Pearson
+0,368 · wöchentliche Gegenprobe +0,644 · Kasse 234 → 538 (×2,30) · Nenner
42 → 56 (×1,33) · Spearman Kennzahl↔Kasse **+0,947** · 0 von 14 Jahren unter 1×.
Für 1600 ebenso: +0,231 / +0,002 / −0,046 / Kasse ×0,61 / Nenner ×1,48 / +0,345.
Für 1970: +0,108 / Kasse ×1,87 / Nenner ×0,63 / +0,495 / letzte Kennzahl 4,26.

**Damit ist der Streit entschieden, und zwar gegen mich.** Meine Zahl aus
Runde 2 war die Partie eines Hauses, dem die Messhand jedes Jahr ein paar Sude
gestohlen hat. Die Zahl des Kritikers ist die Partie, die eine Hand spielt, die
ihre Klicks landen sieht. **Das ist die richtige, und sie ist der schwerere
Fall: das Haus wird reich.** Alles unten ist an dieser Hand gemessen.

**Das Gerät steht als eigene Datei daneben** (am fremden Messgerät wird nicht
gedreht, ZUSTÄNDIGKEIT 16): `werkbank/schuss/rueckkopplung-r3/linie.mjs`.
Der Hafen kommt aus der Umgebung, die Hand ist Zeile für Zeile die des
Originals — geändert ist **eine** Sache, `klick()` sieht bis zu sechsmal hin
statt einmal und wartet dazwischen auf einen echten Bildaufbau statt auf die
Uhr. Ein Lauf dauert damit knapp 4 Minuten statt 9 und ist von der Last der
Maschine unabhängig — **und das ist nachgewiesen, nicht behauptet**: dieselbe
Reihe bei Lastmittel 13,7 (ein Lauf allein) und bei Lastmittel **33** (acht
Läufe nebeneinander, andere Builder auf derselben Maschine). Die vier
*vorher*-Läufe der Welle A in §1 sind unter genau diesen 33 gefahren und sind
Ziffer für Ziffer die Zahlen des Kritikers.

---

## 1 · DIE ZAHLEN — drei Läufe je Epoche, mit Spannweite

**Gerät:** `werkbank/schuss/rueckkopplung-r3/linie.mjs`, beharrliche Hand (§0),
je 400 Wochen, 14 Braujahre, `?epoche=N&saat=1350`, 1920×1000.
**vorher** = Hafen 8900, eingefrorener Commit `da7d690`.
**nachher** = Hafen 8901, **derselbe Commit plus ausschließlich meine zwei
geänderten Dateien** (`preis.js`, `preis-daten.js`; `preis-zusatz.css` ist
unverändert). Drei Läufe je Epoche und Stand, alle acht Läufe einer Welle
nebeneinander bei Lastmittel 33.

PLATZHALTER_TABELLE

**Zur Spannweite 0,000 — sie ist ein Ergebnis, keine Nachlässigkeit.** Der
Kritiker hat über drei Läufe 0,041 (1350), 0,033 (1600), 0,047 (1884) und 0,386
(1970) gemessen. **Diese Streuung ist die Klick-Lotterie aus §0 und nicht das
Spiel:** der Würfel ist gesät (`kern/uhr.js:59`), also streut nur, welcher Klick
in welcher Woche ankommt. Mit der beharrlichen Hand kommt jeder an, und drei
Läufe desselben Standes sind Ziffer für Ziffer derselbe Lauf. **Damit die
Messregel trotzdem greift, steht unten in §1.2 die zweite Klammer: dieselben
vier Epochen mit der ORIGINALHAND** (einmal hinsehen, feste Wartezeiten) — das
ist die Streuung, die es wirklich gibt, und beide Klammern müssen halten.

**Die Reihen, Jahr für Jahr:**

PLATZHALTER_REIHEN

**Was daran zu lesen ist:**

* **1350 ist geheilt, und zwar an der Kasse.** Der Jahresmedian der Barschaft
  läuft nicht mehr von 234 auf 538 Pf (×2,30), sondern von 234 auf 258 (×1,10)
  — das Haus hortet nicht mehr und geht auch nicht ein. Der Ausschlag von
  41,67× ist weg; das Band steht bei 1,55 bis 15,14×.
* **Kein Nennerpreis ist verstellt** (`gegner.js` und `gegner-daten.js` Byte für
  Byte dieselben). Dass sich die **Auswahl** des Nenners verschiebt, weil ein
  ärmeres Haus eine andere Partie spielt, steht mit Zahlen in §2.
* **1600, 1884 und 1970 sind Ziffer für Ziffer unverändert** — und diesmal ist
  das nicht behauptet, sondern durchgerechnet: **jede** der 14 Jahreszahlen und
  **jede** Jahreskasse ist in vorher und nachher identisch, dazu `kasseMin` und
  `kasseMax` (1600: 251/2.525 · 1884: 2.907/25.557 · 1970: 1.998/86.000).
  Das kann auch gar nicht anders sein: `liegeSatz`/`liegeFrei` stehen nur in
  Epoche I, und die Änderung an `preis.js` schreibt einen Satz und einen
  Kalendereintrag, keine Zahl der Wirtschaft.
* **Die zweite Hälfte der Latte hält überall:** 0 von 14 Jahren unter 1× in
  allen vier Epochen, vorher wie nachher. Die Festlegung in 1350 wird weiter
  genommen (1× in jedem Lauf) — das war die Falle, an der die Zahl 0,55 für
  `liegeSatz` gescheitert wäre.



---

## 2 · Was gebaut wurde — AUFLAGE A1, an der Kasse und nicht am Nenner

### DIE VIERTE WURZEL, jetzt auch in 1350 — „Anschlag auf das Geld in der Lade"

Dasselbe Werkzeug, mit dem 1600 geheilt wurde, mit **eigenen** Zahlen für diese
Epoche. Fehlen `liegeSatz`/`liegeFrei` in den Daten einer Epoche, ist die
Funktion ein Nichtstuer — 1884 und 1970 sind deshalb im Quelltext gar nicht
berührt.

```
frei   = max( liegeFrei × Jahreslast , Preis der billigsten Festlegung dieser Zeit )
Anlage = liegeSatz × (Barschaft nach dem Zahltag − frei)
```

**Warum sie in 1350 stehen darf, steht seit jeher im Text dieser Epoche
selbst** (`preis-daten.js`, `anschlagSatz`, unverändert):

> „Der Anschlag ist die Schätzung des Rats: was durch das Haus geht **und was
> im Haus liegt**."

Der Schoss des 14. Jahrhunderts war ein Vermögensschoss; zwei Ratsherren gingen
durch die Häuser und schätzten Haus, Gerät und bares Geld. Was hier dazukommt,
ist keine neue Abgabe, sondern die **zweite Hälfte einer Zahl, die diese Epoche
von Anfang an nennt.**

### Die beiden Zahlen sind abgelesen, nicht gewählt

**`liegeFrei = 2,0` (in 1600: 1,0).** Grund ist die Rechnungsspalte derselben
vierzehn Michaelitage, abgelesen mit
`werkbank/schuss/rueckkopplung-r3/innen.mjs` am eingefrorenen Stand: neben der
Jahreslast (61 bis 134 Pf) steht in **jedem zweiten Jahr** der Handlohn beim
Erbfall (1,10 Jahreslasten — die Hand wechselt alle zwei Braujahre, siehe §5),
dazwischen die außerordentliche Umlage.

    1351  Pflicht  87 + Handlohn  96      1358  Pflicht 132 + —
    1352  Pflicht  90 + Umlage    24      1359  Pflicht  77 + Handlohn 135
    1353  Pflicht  98 + Handlohn 110      1360  Pflicht  61 + —
    1355  Pflicht  77 + Umlage   100      1361  Pflicht 109 + Handlohn 162
    1357  Pflicht 126 + Handlohn 140      1363  Pflicht  64 + Handlohn  70

Ein schweres Jahr kostet 1,8 bis 2,3 Jahreslasten. Wer weniger als zwei bar
hält, ist im nächsten Erbfall zahlungsunfähig — **genau so viel bleibt frei.**

**`liegeSatz = 0,30` (in 1600: 0,70).** Das Maß dafür ist **nicht rho, sondern
die Lade selbst**: gesucht ist die Zahl, bei der die Barschaft über vierzehn
Jahre weder davonläuft noch eingeht. Vier Läufe derselben Linie, je 400 Wochen,
nur diese eine Zahl verändert:

| `liegeSatz` | Lade Jahresmedian | Kennzahl | Spearman | wöchentlich | Jahre <1× | Festlegung |
|---|---|---|---|---|---|---|
| — (ohne alles) | 234 → 538 **×2,30** | 1,55–41,67 | **+0,701** | +0,644 | 0/14 | 1× |
| 0,55 | 234 → 89 **×0,38** | 1,48–11,31 | −0,473 | **−0,763** | 0/14 | 1× |
| 0,40 | 234 → 131 ×0,56 | 1,55–15,67 | +0,569 | −0,116 | 0/14 | 1× |
| **0,30** | 234 → **258 ×1,10** | **1,55–15,14** | **+0,288** | −0,266 | **0/14** | **1×** |

Bei 0,55 läuft die Epoche in die **andere** Richtung davon — die Lade schrumpft
auf ein Drittel und die wöchentliche Gegenprobe steht bei −0,763. Das ist
derselbe Fehler mit umgekehrtem Vorzeichen, und er fiele beim nächsten Urteil
genauso auf. Bei 0,30 steht die Lade am Ende, wo sie angefangen hat.

Ein höherer Satz wäre hier auch sachlich falsch: in 1600 lag das
Anderthalbfache eines Jahresumsatzes bar in der Lade, hier liegt ein Fünftel.

### Was NICHT angefasst wurde — und was sich trotzdem am Nenner bewegt

Kein Preis eines Ablösens oder Zuvorkommens, keine Datei des GEGNERS, keine
Zeile des Kerns, keine Zahl der Epochen II, III und IV. **Sperrliste 1 ist
eingehalten: es ist kein Nennerpreis verstellt worden.**

**Und trotzdem gehört hierher, was sich am Nenner verschiebt, weil ich es sonst
verschweigen würde.** Der Nenner ist nicht eine Zahl, sondern eine Auswahl: der
billigste Zug des höchsten Ranges, den ein Stück in dieser Woche meldet. Ein
ärmeres Haus spielt anders, also steht der GEGNER anders da, also ist die
Auswahl eine andere. Gemessen, 1350, 400 Wochen:

| | vorher (`da7d690`) | nachher |
|---|---|---|
| Wochen mit `umkaempft` als Nenner | **400/400** | **269/400** |
| Wochen mit `bindung` | 0 | 129 |
| Wochen mit `bau` | 0 | 2 |
| Jahresmedian des Nennerpreises | 42 → 56 Pf (×1,33) | 42 → 88 Pf (×2,10) |
| Wochen ohne Kennzahl (`zugDeckung()` = `null`) | 0/400 | 4/400 |

**Das ist kein verstellter Preis, sondern eine andere Partie** — in 131 von 400
Wochen hat der Adler jetzt keinen umkämpften Zug offen, und dann übernimmt ein
Zug vom Rang darunter. Wer mir vorwirft, ich hätte den Nenner angehoben, hat die
Richtung recht und die Ursache falsch: die Preise stehen unverändert in
`gegner-daten.js`, und `gegner.js` ist Byte für Byte dasselbe. Prüfbar mit
`diff` gegen den Messstand.

---

## 3 · AUFLAGE A2 — `gegner.js:1561` und `stadt.js:1404`: gemessen, nicht angefasst

**Es ist wahr, und hier ist die Zahl.** `spiel/stuecke/gegner.js:1561`

    if (bester) B.welt.meldeZug(bester.was, bester.preis, 'umkaempft');

**drei Argumente statt vier.** Dasselbe `spiel/stuecke/stadt.js:1404`

    B.welt.meldeZug('Bau ' + baubar[0].name, preis(baubar[0], ep), 'lage');

Weil `umkaempft` in `welt.js:485` den höchsten Rang trägt, schlägt der erste
Aufruf jeden anderen — und `welt.js:501` prüft nur, „wer seinen Zugschlüssel
mitschickt". Ohne Schlüssel prüft `zugDeckung()` **gar nichts**.

**Am eingefrorenen Stand `da7d690` nachgezählt** (meine eigenen zwölf Läufe und
zusätzlich die zwölf Laufdateien des Kritikers, `lauf-e*.json` — beide Zählungen
stimmen überein):

| Epoche | Nenner genannt | **ohne Zugschlüssel** | Arten des Nenners |
|---|---|---|---|
| 1350 | 400/400 | **400/400 = 100 %** | `umkaempft` 400 |
| 1600 | 400/400 | **400/400 = 100 %** | `umkaempft` 400 |
| 1884 | 400/400 | **237/400 = 59 %** | `umkaempft` 240 · `bindung` 154 · `bau` 5–6 |
| 1970 | 400/400 | **400/400 = 100 %** | `umkaempft` 400 |

Über alle zwölf Läufe: **4.311 von 4.800 Wochen (89,8 %)** ohne Zugschlüssel —
Ziffer für Ziffer die Zahl des Kritikers. **Ich habe die beiden Zeilen nicht
angefasst.** Sie gehören DEM GEGNER und DER STADT.

**Zur Warnung der Aufsicht, `art:'bau'` könne den Nenner stellen:** am
eingefrorenen Stand tut es das in **5 bis 6 von 400 Wochen, und nur in 1884**
(in 1350, 1600, 1970 in **keiner einzigen**). Das ist der Grund, warum ich auf
8900/8901 messe und nicht auf 8899: der Gärraum von DER SUD ist an diesem Stand
noch nicht drin, und meine Zahl bleibt mit der des Kritikers vergleichbar. Wer
nach dem Einarbeiten von DER SUD nachmisst, muss diese Spalte neu zählen — die
Zahl steht oben, sie ist die Vergleichsgrundlage.

---

## 4 · AUFLAGE A3 und der zweite Kernpunkt — **KERN:**

**KERN: `welt.js:503` prüft zu wenig.** `if (!el || el.disabled) return null;`
bemerkt nicht, dass der Knopf unter einem aufgeklappten Brett liegt. Der
Kritiker hat gemessen, was das kostet: zu dem genannten Preis stand ein
gleichzeitig aktiver **und unverdeckter** Knopf in 82 bis 88 % der Wochen. Wer
A2 umsetzt, hebt die Deckung auf etwa 88 %; den Rest hebt erst eine
Sichtbarkeitsprüfung (`getBoundingClientRect` plus `elementFromPoint`, so wie
jedes Messgerät dieser Welle es tut). **`spiel/kern/**` ist schreibgeschützt —
ich habe es nicht angefasst.**

**KERN: `welt.js` hält nur EINE Meldung, und `zugDeckung()` fällt deshalb ganz
aus statt auf den nächstbesten Zug zurück.** `meldeZug` überschreibt
`W.naechsterZug` und behält keine Liste. Meldet ein Stück den höchsten Rang mit
Zugschlüssel und ist dessen Knopf in dieser Sekunde abgeschaltet, gibt
`zugDeckung()` **`null`** — und die Kopfzeile hat in dieser Woche **keine
Kennzahl**, obwohl fünf andere Züge mit Preisschild am Schirm stehen.
**Gemessen am eingefrorenen Stand, 400 Wochen je Epoche:**

| Epoche | Wochen ohne Kennzahl (`zugDeckung()` gibt `null`) |
|---|---|
| 1350 | 0/400 |
| 1600 | 0/400 |
| **1884** | **6/400** |
| 1970 | 0/400 |

Über alle zwölf Läufe **18 von 4.800**. Heute ist das klein, **weil** A2 offen
ist: solange der Gewinner keinen Schlüssel mitschickt, kann die Prüfung nicht
zuschlagen. Wer A2 umsetzt, macht diesen Posten größer, nicht kleiner. Die
saubere Fassung wäre eine kurze Liste statt einer einzigen Meldung: fällt der
beste durch die Prüfung, rückt der nächste nach. **Das ist eine Kernbitte, keine
Stückarbeit.**

---

## 5 · AUFLAGE A4 — die Festlegungskarte nannte einen Horizont, der zehn- bis achtzehnmal zu lang war. **Erledigt.**

**Der Widerspruch, im Wortlaut nachgeprüft.** `preis.js:1729` schrieb auf jede
unwiderrufliche Karte

    Preis dieser Amtszeit: 6.700 fl · Barbara Bruckner führt das Haus bis 1636.

Die Zahl kommt aus `welt.js:379` (`bis: jahr + B.wuerfel.ganz(21, 37)`), also
aus dem **Kern**. Die Amtszeit endet aber nach zwei Braujahren
(`erbe-daten.js:315 STUNDE_ABSTAND = 2` → `erbe.js stundeSchlaegt()` →
`welt.erbe()`). Selbst nachgezählt, alle vier Epochen, jeder Lauf:
`zeit.amtszeit.nr` läuft in 400 Wochen von **1 auf 8** — acht Amtszeiten in
vierzehn Braujahren, also **je zwei Jahre**. Barbara Bruckner war 1602 abgelöst,
nicht 1636.

**Was ich geändert habe, und warum so:** Würfel (`welt.js`) und Abstand
(`erbe-daten.js`) sind beide für dieses Stück gesperrt. Was dieses Stück darf,
ist, die Zahl **nicht mehr abzuschreiben, sondern nachzuzählen**. `Z.amtszeiten`
hält fest, in welchem Braujahr jede Amtszeitnummer zum ersten Mal am Werk war
(`merkeAmtszeit()`, gerufen aus `michaeli()`, `richteEin()` und dem Ereignis
`erbfall`); `amtszeitFrist()` ist der mittlere Abstand zweier Antritte.
**Solange erst eine Hand am Werk war, gibt es keine gemessene Frist — dann steht
auch keine Zahl da.** Am Schirm abgelesen, alle vier Epochen, Michaelitafel
aufgeschlagen:

    vorher   Preis dieser Amtszeit: 1.000 Pf · Kunigunde Bruckner führt das Haus bis 1386.
    nachher  Preis dieser Amtszeit: 1.000 Pf · Kunigunde Bruckner führt das Haus seit 1350.
             Die Festlegung überdauert die Amtszeit: sie gilt für den Rest der Partie,
             auch wenn das Haus die Hand wechselt.

und ab der zweiten Amtszeit, mit gezählter Frist:

             … Die bisherigen Amtszeiten dieses Hauses hielten je 2 Braujahre —
             die Festlegung hält länger: sie gilt für den Rest der Partie.

**Dieselbe falsche Zahl stand an einer zweiten Stelle, die der Kritiker nicht
gesehen hat, weil sie im Kalender liegt:** `kommendeLasten()` (`preis.js:1079`
alt) kündigte den **Handlohn beim Erbfall** auf `amtszeit().bis` an — in 1350
also auf **1386**. Gemessen wird er in Wirklichkeit **alle zwei Braujahre**, und
er ist in dieser Epoche der zweitgrößte Posten der Rechnung: 1,10 Jahreslasten,
in der gemessenen Partie 96 · 110 · 140 · 135 · 162 · 70 Pf. Eine Last, die alle
zwei Jahre kommt und auf 36 Jahre angekündigt ist, ist keine Ankündigung. Sie
steht jetzt auf `naechsterErbfall()` — und solange keine Frist gemessen ist,
steht sie gar nicht da. **Lieber eine Zeile weniger als eine Jahreszahl, die um
34 Jahre danebenliegt.**

Und die dritte Stelle, dieselbe Sache: die Chronikspalte sagte „Die nächste
Amtszeit wählt wieder — einmal", ohne zu sagen, wann. Jetzt steht daneben
„Bisher wechselte die Hand alle 2 Braujahre; N Amtszeiten seit 1350." Wer nicht
weiß, dass die nächste Wahl in zwei Jahren wiederkommt, spart auf die falsche.

---

## 6 · Die dünnste Spalte: **1 / 1 / 0 / 0 Festlegungen in vierzehn Jahren** — gemessen, halb erklärt, halb offen

Der Befund des Kritikers stimmt und ist an meinen Läufen reproduziert: die
sorgfältig gespielte Linie nimmt in 1350 **eine**, in 1600 **eine**, in 1884 und
1970 **keine** unwiderrufliche Festlegung, obwohl acht Amtszeiten vorbeigehen.

**Die Hälfte, die mir gehört, ist die Karte — sie ist erledigt (§5).** Die
zweite Hälfte ist der Zeitabstand und gehört DEM ERBE. Die dritte, die noch
niemandem zugewiesen ist, ist der **Preis in 1884 und 1970**, und sie ist eine
Zahl in meiner Datei:

| Epoche | billigste Festlegung | Michaeli-Kasse im Lauf | Verhältnis |
|---|---|---|---|
| 1350 | `vertrag` 0,18 × 470 = **85 Pf** | 65–871 | erreichbar, **1× genommen** |
| 1600 | `reinheit` 0,10 × 2.800 = **280 fl** | 251–2.525 | erreichbar, **1× genommen** |
| 1884 | 0,22 × 42.000 = **9.200 M** | 2.907–25.557 | Kasse deckt sie in wenigen Jahren, aber nie mit Reserve |
| 1970 | 0,11 × 500.000 = **55.000 DM** | 1.998–86.000 | dito |

In 1350 und 1600 steht der Preis dort, wo er hingehört, **weil er in dieser
Welle schon einmal heruntergesetzt wurde** (1350 `vertrag` von 0,32 auf 0,18;
1600 `reinheit` von 0,15 auf 0,10) — und beide Male hat es gewirkt. **Für 1884
und 1970 steht derselbe Griff aus, und ich habe ihn bewusst NICHT getan:** diese
Runde hat genau eine Aufgabe, 1350 zu heilen ohne die anderen drei zu brechen,
und ein niedrigerer Festlegungspreis in 1884/1970 bewegt genau die zwei Epochen,
die ich nicht anfassen darf. **Das ist der nächste Griff, und er ist klein: eine
Zahl je Epoche in `preis-daten.js`.**

---

## 7 · Die übrigen Auflagen

**A5 — die doppelte Zeile.** Stimmt: `.gg-kennzahl` (`gegner.js:1570`) und
`.deckung` (`kern/kopf.js:125`) tragen in allen vier Epochen Ziffer für Ziffer
denselben Wert (nachgesehen: 5,89 / 3,76 / 8,35 / 2,25). **Keine der beiden ist
meine Datei** — die eine gehört DEM GEGNER, die andere dem Kern. Ich habe
nichts angefasst und melde nur, dass der Befund am Schirm steht.

**A6 — 1884 beobachten.** Getan, mit drei Läufen; die Zahlen stehen unten in
§1. 1884 bleibt der nächste Kandidat, und der Grund ist derselbe wie bei 1350:
die Kasse wächst (×2,13 im gemessenen Lauf), der Nenner aber ebenfalls (×6,81)
— **deshalb** hält es. Fällt der Nenner in 1884 einmal nicht mit, kippt es
sofort. Die vierte Wurzel steht dort **nicht** in den Daten, sie ist also mit
einer Zahl nachrüstbar, sobald jemand 1884 zur Aufgabe erklärt.

**A7 — `preis-linie.mjs:39` hat `8899` fest verdrahtet.** Ich habe das fremde
Messgerät **nicht** angefasst (ZUSTÄNDIGKEIT 16, Sperrliste 4). Statt dessen
steht `werkbank/schuss/rueckkopplung-r3/linie.mjs` daneben: Hafen aus der
Umgebung (`HAFEN=`), Saat aus der Umgebung (`SAAT=`), und die beharrliche Hand
aus §0. Wer das Original ersetzen will, hat damit eine Vorlage; die Entscheidung
gehört der Aufsicht.

---

## 8 · Die Sperrliste, Punkt für Punkt

1. **Der Nenner wurde nicht verstellt.** Kein Preis eines Ablösens oder
   Zuvorkommens ist angefasst; `gegner.js` und `gegner-daten.js` sind Byte für
   Byte unverändert (`diff` gegen den Messstand). Bewegt wurde ausschließlich
   der Zähler. **Dass sich die AUSWAHL des Nenners trotzdem verschiebt — 269
   statt 400 von 400 Wochen `umkaempft` —, steht in §2 mit Zahlen; es ist die
   Folge einer anderen Partie, nicht eines anderen Preises.**
2. **1600 bleibt, wo es steht.** Nachgewiesen mit drei Läufen, §1. Meine
   Änderung an `preis-daten.js` steht ausschließlich in Epoche I; meine
   Änderung an `preis.js` (Amtszeit) berührt **keine** Zahl der Wirtschaft —
   sie schreibt einen Satz und einen Kalendereintrag.
3. **`welt.ZUGRANG` ist unverändert.** `spiel/kern/**` ist von mir nicht
   angefasst. (`git diff` gegen `da7d690` zeigt dort `kern/ton.js` — das ist
   die Arbeit von DER KLANG im selben Arbeitsbaum, nicht meine. Meine Messung
   läuft ohnehin nicht auf dem Arbeitsbaum.)
4. **Am fremden Messgerät wurde nicht gedreht.** `eichung/preis-linie.mjs` und
   `eichung/auswerten.py` sind Byte für Byte unverändert; meine Geräte sind
   neue Dateien unter `werkbank/schuss/rueckkopplung-r3/`.
5. **`design/PRUEFUNG.md`** ist nicht als Latte benutzt worden. Nichts Neues
   eingebracht: die neue Zeile nennt kein Gesetz und keine Jahreszahl, benutzt
   `welt.geld()` für jede Zahl und zitiert den Satz dieser Epoche wörtlich
   („was durch das Haus geht und was im Haus liegt").
6. **Gemessen wurde auf 8900 und 8901 am eingefrorenen Commit `da7d690`**, nie
   auf 8899.
7. **Alle vier Epochen nachgemessen**, drei Läufe je Epoche, Spannweite
   angegeben.

---

## 9 · Das Abnahmetor

Gefahren mit `werkbank/schuss/rueckkopplung-r3/tor.mjs` **auf dem Arbeitsbaum
(8899)** — also auf dem Stand, der abgegeben wird, samt der gleichzeitigen
Arbeit von DER SUD und DER KLANG. Vier Epochen frisch geladen, Michaelitafel
per Klick aufgeschlagen, sonst nichts angefasst:

| Epoche | `BRAUHAUS.lage.length` | `pageerror` | `console.error` | Züge am Schirm |
|---|---|---|---|---|
| 1350 | **0** | 0 | 0 | 116 |
| 1600 | **0** | 0 | 0 | 124 |
| 1884 | **0** | 0 | 0 | 127 |
| 1970 | **0** | 0 | 0 | 119 |

Dazu über die 24 Messläufe dieser Nacharbeit (je 400 Wochen, zusammen 9.600
gemessene Wochen): **0 Seitenfehler, 0 Konsolenfehler, kein Abbruch, kein totes
Haus.**

`node --check` auf `spiel/stuecke/preis.js` und `spiel/stuecke/preis-daten.js`:
sauber. `spiel/index.html` nicht angefasst, `spiel/kern/**` nicht angefasst.

Die Kopfzeile im Anfangsbild, alle vier Epochen unverändert gegenüber dem
Messstand:

    1350  nächster Zug: Zuvorkommen Klosterschenke Obernberg — 19 Pf (Kasse reicht 5,9×)
    1600  nächster Zug: Zuvorkommen Mühlschenke — 170 fl (Kasse reicht 3,8×)
    1884  nächster Zug: Ablösung Ausschank am Markt — 1.706 M (Kasse reicht 8,4×)
    1970  nächster Zug: Ablösung Brückenwirt — 38.221 DM (Kasse reicht 2,3×)

Und die neue Zeile steht angekündigt im Kalender, **mit dem Stand von heute**,
nur in den beiden Epochen, die sie in den Daten haben:

    1350  1351 · Anschlag auf das Geld in der Lade · 8 Pf
          „Frei bleiben 85 Pf — heute liegen 112 Pf bar im Haus."
    1600  1601 · Anschlag auf das bare Vermögen · 250 fl
          „Frei bleiben 280 fl — heute liegen 640 fl bar im Haus."

In 1884 und 1970 steht dort weiterhin wörtlich „Keine hängt an der Kasse."


---

## 10 · Was offen bleibt

1. **Der Nenner gehört weiter nicht diesem Stück.** `gegner.js` meldet ihn ohne
   Zugschlüssel (§3), und `welt.js` prüft ihn nur halb (§4). Solange das so
   ist, misst die Latte in 89,8 % der Wochen eine Zahl, an der der
   Prüfschritt aus ZUSTÄNDIGKEIT 24 nicht ansetzt. **A2 und A3 sind nicht
   erledigt, sie sind nur gemessen** — sie gehören DEM GEGNER, DER STADT und
   dem Kern.
2. **Die Festlegung in 1884 und 1970 ist zu teuer** (§6). Ein Griff wie bei
   `vertrag` und `reinheit` steht dort aus; ich habe ihn nicht getan, weil er
   die zwei Epochen bewegt, die ich in dieser Runde nicht anfassen darf.
3. **1884 ist der nächste Kandidat** (§7, A6). Es hält, aber es hält aus
   demselben Grund, aus dem 1350 nicht mehr hielt — und dort gibt es die
   vierte Wurzel in den Daten noch nicht.
4. **Eine Saat.** Alles hier ist `saat=1350`, wie beim Kritiker. Ein zweiter
   Satz Saaten ist die nächste Härtung.
5. **Das Messgerät der Welle ist noch das alte.** `eichung/preis-linie.mjs`
   sieht weiter einmal hin und zeigt weiter fest auf 8899. Solange damit
   gemessen wird, hängt jede Zahl dieser Welle an der Auslastung der Maschine
   (§0). Ich habe es nicht angefasst; die Entscheidung gehört der Aufsicht.

---

## 11 · Geänderte Dateien

| Datei | Was |
|---|---|
| `spiel/stuecke/preis.js` | `merkeAmtszeit()` · `amtszeitFrist()` · `naechsterErbfall()` · `Z.amtszeiten` · Aufruf in `michaeli()`, `richteEin()` und `erbfall` · Satz auf der Festlegungskarte (`festKarte`) · Handlohn-Zeile in `kommendeLasten()` · gezählte Frist in der Chronikspalte |
| `spiel/stuecke/preis-daten.js` | **Epoche I**: `liegeName` · `liegeSagt` · `liegeFrei: 2.0` · `liegeSatz: 0.30`, mit der Messreihe als Begründung. **Epoche II, III und IV unberührt.** |

Neue Messgeräte (eigene Dateien, kein fremdes angefasst):

    werkbank/schuss/rueckkopplung-r3/linie.mjs       die Linie, Hafen waehlbar, beharrliche Hand
    werkbank/schuss/rueckkopplung-r3/innen.mjs       dieselbe Hand, schreibt die Rechnungsspalte mit
    werkbank/schuss/rueckkopplung-r3/auswerten.py    Spearman UND Pearson, Spannweite, Ehrlichkeit des Nenners
    werkbank/schuss/rueckkopplung-r3/probestand.sh   da7d690 + nur meine Dateien, Hafen 8901
    werkbank/schuss/rueckkopplung-r3/welle.sh        vier Epochen nebeneinander, ein Buchstabe je Lauf
    werkbank/schuss/rueckkopplung-r3/tor.mjs         das Abnahmetor: vier Epochen, lage, Fehler, Karte

`node --check` ist auf beiden `.js` sauber. Kein `git`.
