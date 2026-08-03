# DIE RÜCKKOPPLUNG, Runde 2 — Bericht des Builders

Welle 4, Stück 1. Geschrieben am 3. August 2026, **vor** der Rückgabe.
Alles hier ist am Bildschirm gemessen, mit `werkbank/schuss/eichung/preis-linie.mjs`
(unverändert), je 400 Wochen, 14 Braujahre, `?epoche=N&saat=1350`, 1920×1000.
`rho` ist die **Spearman-Rangkorrelation** der Kennzahl gegen das Jahr — die
Rechnung, die die vier Zahlen aus `gauntlet/WELLE-4.md` exakt reproduziert
(−0,152 / +0,873 / +0,143 / −0,112; Pearson tut es nicht, der liefert
−0,157 / +0,711 / +0,169 / +0,029).

---

## 1 — Der Auftrag war: erst messen, was 1600 anders macht

**Antwort in einem Satz: 1600 ist die einzige Epoche, in der die Lade wächst,
während der Ausstoß steht — und die einzige, in der der Nenner der Kennzahl
sich in vierzehn Jahren nicht bewegt.**

Gemessen am Stand vor dem Bau, alle vier Epochen, je Michaelitag
(`werkbank/urteile/e1..e4.json` plus eine eigene Sonde, die zusätzlich
`welt.naechsterZug`, den Anschlag, den Ausstoß und alle Kandidaten des GEGNERS
mitschreibt):

| Epoche | Lade Michaeli | Ausstoß | Preis des nächsten **umkämpften** Zuges | eigene Preisleiter |
|---|---|---|---|---|
| 1350 | 112 → 113 Pf | 150 → 547 Pf | 19 → 42 Pf | 0,91–2,15× |
| **1600** | **430 → 4.637 fl** | **1.900 → 1.634 fl** | **170 → 151 fl** (Band 66–336, ohne Richtung) | 2,38–3,37× |
| 1884 | 11.150 → 24.704 M | 17.000 → 20.493 M | 1.706 → 12.000 M | 1,50–2,06× |
| 1970 | 86.000 → 50.000 DM | — | 38.221 → 19.683 DM | 1,37–3,17× |

Drei Befunde daraus, jeder einzeln nachprüfbar:

**(a) Das Haus in 1600 wächst nicht, es hortet.** Die Lade steigt um das
Elffache, der Ausstoß fällt leicht. Zuletzt liegen 4.637 fl bar gegen einen
Jahresumsatz von 1.634 fl — das Anderthalbfache eines Jahresumsatzes, in bar,
ohne Verwendung. In 1350 sind es 0,21 Jahresumsätze, in 1884 1,2 bei
dreifachem Anschlag.

**(b) Der Nenner der Kennzahl gehört nicht diesem Stück.** `welt.meldeZug`
nimmt den höchsten Rang zuerst und darin den billigsten Preis
(ZUSTÄNDIGKEIT 24). Rang 3 = `umkaempft` meldet ausschließlich DER GEGNER, aus
`grundwert = menge(adresse) × satz(mittel)`; ein *Zuvorkommen* kostet 45 im
Hundert davon. In 1600 sind beide Faktoren feste Tabellenwerte und der Adler
benutzt vierzehn Jahre lang die billigen Mittel (Zunftbrief 9, Heirat 7) — der
Nenner steht bei 66 bis 336 fl, ohne jede Richtung. In 1884 eskaliert er
dagegen (Vertrag 45 → Depot 70 → Hypothek 110), und in 1894–1896 hat er
zeitweise gar keinen umkämpften Zug, so dass Rang-2-Züge übernehmen, die mit
dem Anschlag wachsen. **Das ist das „Muster von 1884", nach dem der Auftrag
gefragt hat — und es liegt in `stuecke/gegner.js`, nicht in meinen Dateien.**

**(c) Was DIESES Stück anschlägt, wächst längst sauber mit.** Die Spalte
„eigene Tafel" der LEITER — Lade gegen die billigste Sprosse der Michaelitafel —
steht in 1600 über vierzehn Jahre bei 2,38× bis 3,37×, dem **engsten Band aller
vier Epochen**. Nebenbefund, der eine ältere Aussage berichtigt: was in
Welle 2b als „1600 besteht sauber, +0,165" verbucht wurde, war genau diese
Spalte. Die Kennzahl aus `welt.zugDeckung()` gab es damals noch nicht. **1600
ist nicht kaputtgegangen — es ist zum ersten Mal mit dem richtigen Nenner
gemessen worden.**

Daraus folgt der Eingriff: den Nenner kann dieses Stück nicht anfassen, also
muss der Zähler aufhören davonzulaufen.

---

## 2 — Was gebaut wurde

### DIE VIERTE WURZEL — „Anschlag auf das bare Vermögen", nur in 1600

Die Pflichten haben drei Wurzeln (`fest` · `menge` · `ertrag`), und alle drei
hängen an **Flüssen**. Ein Haus, dessen Ausstoß steht und dessen Lade sich
trotzdem füllt, wird von keiner erfasst — der **Bestand** kommt in keiner vor.
Das war eine bewusste Entscheidung (ZUSTÄNDIGKEIT 21: eine Abgabe auf die
Barschaft frisst genau das Geld, das für den Michaelitag hingelegt wurde) und
sie ist richtig für eine Abgabe **ohne Freibetrag**.

Mit Freibetrag ist es keine Abgabe auf das Sparen, sondern eine auf das
Liegenlassen:

```
frei   = max( liegeFrei × Jahreslast , Preis der billigsten Festlegung dieser Zeit )
Anlage = liegeSatz × (Barschaft nach dem Zahltag − frei)
```

* Sie wird **nach** Pflicht, Rate, Handlohn und Umlage gebucht — sie meint, was
  nach dem Zahltag noch immer nicht gebraucht wird.
* Sie geht **nicht** in `pflichtSumme()` ein. Sonst schlüge die Barschaft über
  Umlage und Handlohn auf sich selbst durch, und aus der Rückkopplung würde
  eine Spirale.
* Sie respektiert den **Notpfennig** (sie geht durch `buche()`), der erste
  Michaeli einer Partie bleibt frei.
* Sie steht **angekündigt** in WAS FÄLLIG WIRD, mit dem Stand von heute, und
  fällt, sobald das Geld verbaut ist. Eine angekündigte Zahl, die sich durch
  einen Zug bewegen lässt, ist eine Entscheidung; eine, die erst am Zahltag
  auftaucht, ist eine Strafe.
* Sie steht als **Regel** unter der Rechnung, bevor sie das erste Mal
  zuschlägt, und als Rechnungszeile mit eigener Wurzelmarke, wenn sie greift.

Historisch ist sie kein Zusatz, sondern der Normalfall dieser Epoche: die
Epochendaten sagen selbst „Der Anschlag steht im Steuerbuch der Stadt:
**Vermögen** und Gewerb", und die fünf außerordentlichen Umlagen dieser Epoche
(Türkensteuer, Kontribution, Quartierlast, Salvaguardia, Brandsteuer) sind
genau die Jahre, in denen dieses geschätzte Vermögen aufs Neue angeschlagen
wurde.

**Warum nur in 1600:** Fehlen `liegeSatz`/`liegeFrei` in den Daten einer
Epoche, ist die Funktion ein Nichtstuer. In 1350, 1884 und 1970 stehen sie
nicht — dort käme die Lade nie über den Freibetrag, und die Zeile wäre totes
Gewicht in der Rechnungsspalte. Nachgemessen: die drei sind **Ziffer für Ziffer
unverändert** (Abschnitt 3).

### Die beiden Zahlen sind gemessen, nicht geraten

Vier Läufe derselben Linie, nur diese beiden Zahlen verändert:

| liegeFrei / liegeSatz | rho | Band | Festlegung |
|---|---|---|---|
| — (ohne alles) | **+0,873** | 2,27–67,33× | 1× |
| 2,0 / 0,45 | +0,644 | 2,02–13,02× | 1× |
| 1,5 / 0,55 | +0,723 | 1,96–8,07× | 1× |
| **1,0 / 0,70** | **−0,182 / +0,191 / +0,121** | **1,49–5,90 / 1,61–6,63 / 1,75–10,11×** | **1× / 1× / 1×** |

Die letzte Zeile ist **drei** vollständige Läufe desselben Standes, nicht einer
(zur Streuung siehe die Messwarnung unten). Größtes |rho| der drei: **0,191**.
Kein Lauf hat ein Jahr unter 1×.

### Zwei Fallen, beide gemessen, beide umgangen

**1. Der Boden auf der Festlegung ist nötig — und muss alle Festlegungen
zählen, nicht nur die offenen.** Ohne Boden (1,5/0,55) steht die Kennzahl bei
0,94–3,93× und rho −0,25 — und der Automat nimmt in vierzehn Jahren **keine
einzige Festlegung** mehr, weil die billigste dieser Zeit 420 fl kostete und
die Lade nie mehr so viel trug. Eine Kennzahl im Band um den Preis der
unwiderruflichen Wahl ist kein Fortschritt, sondern ein Tausch; die zweite
Messlatte zählt beides. — Zählt der Boden nur die **noch offenen**
Festlegungen, springt er in dem Augenblick weg, in dem die billigste genommen
ist: in 1600 von 280 fl auf 1,90 × 4.527 = 8.601 fl. Der Freibetrag lag damit
über jeder Lade, die diese Epoche je sieht, der Anschlag feuerte nie wieder,
und die Kennzahl ging auf 2,59× → 63,91×, rho **+0,947** — schlechter als ohne
alles. Ein Boden, der mit dem eigenen Greifen wegspringt, ist kein Boden.

**2. Der Boden hängt an `festBasis()` und damit an der Zeit, nicht am
Vermögen.** Hinge er am Anschlag, wüchse der Freibetrag mit genau dem, was er
begrenzen soll.

### Zwei Nachzüge, beide aus einer Messung

* **`reinheit` (Festlegung 1600) von 0,15 auf 0,10 der Taxe** — mit der
  flacheren Lade wäre die einzige bezahlbare unwiderrufliche Wahl dieser Epoche
  unerreichbar geworden (gemessen: `Festlegung 0×`, wo vorher 1× stand).
  0,10 × 2.800 = 280 fl, erreichbar aus der Eröffnungslade von 640 fl.
* **Ihre Wirkung von +16 % auf +9 % je Fass und von +10 auf +5 Ansehen** —
  halber Preis, halbe Wirkung. Mit unveränderter Wirkung stieg die Lade in
  denselben vierzehn Jahren auf 1.027 statt 820 fl, und der Adler wirbt bei mehr
  Ansehen häufiger; die billigste Antwort auf eine Werbung fiel damit auf 73 bis
  104 fl und die Kennzahl auf rho **+0,807** statt +0,19.
* **Der erste Michaeli bleibt frei.** Ohne diese Sperre stand in 1600 im
  Eröffnungsjahr `Anschlag auf das bare Vermögen −200 fl` in einer Spalte, die
  sonst leer ist, und die Lade begann mit 440 statt 640 fl — das Haus zahlt für
  ein Jahr, das es nicht gespielt hat.
* **Ein Lesegriff für die Konsole:** `BRAUHAUS.preis.lage()` /
  `.anschlag()` / `.leiter()`, das Gegenstück zu `BRAUHAUS.gegner.lage()`.
  Ohne ihn lässt sich am Bildschirm nicht nachprüfen, woraus ein Anschlag
  entstanden ist. Er ändert nichts und wird von nichts benutzt.

---

## 3 — Die Zahlen, vorher und nachher, **alle vier Epochen**

Gleiches Skript, gleiche Saat, gleiche 400 Wochen. „Vorher" ist
`werkbank/urteile/e1..e4.json` (Stand `ee1715b`), „nachher" der Arbeitsbaum.

| Epoche | | Start → Ende | min–max | rho | Jahre unter 1× | Lade | Festlegung | Seitenfehler |
|---|---|---|---|---|---|---|---|---|
| 1350 | vorher | 5,89 → 2,69 | 0,75–7,88 | −0,152 | 1 von 14 | 46–462 | 1× | 0 |
| 1350 | **nachher** | **5,89 → 2,69** | **0,75–7,88** | **−0,152** | **1 von 14** | **46–462** | **1×** | **0** |
| 1600 | vorher | 3,76 → **27,81** | 2,27–**67,33** | **+0,873** | 0 von 14 | 310–5.217 | 1× | 0 |
| 1600 | **nachher** | **3,76 → 4,85** | **1,75–10,11** | **+0,121** | **0 von 14** | **224–2.549** | **1×** | **0** |
| 1600 | *(2. Lauf)* | 3,76 → 1,61 | 1,61–6,63 | +0,191 | 0 von 14 | 229–2.549 | 1× | 0 |
| 1600 | *(3. Lauf)* | 3,76 → 2,70 | 1,49–5,90 | −0,182 | 0 von 14 | 229–2.549 | 1× | 0 |
| 1884 | vorher | 8,35 → 2,06 | 0,63–10,18 | +0,143 | 1 von 14 | 1.117–30.643 | 0× | 0 |
| 1884 | **nachher** | **8,35 → 2,06** | **0,63–10,18** | **+0,143** | **1 von 14** | **1.117–30.643** | **0×** | **0** |
| 1970 | vorher | 2,25 → 2,54 | 0,81–6,53 | −0,112 | 1 von 14 | 1.065–104.531 | 0× | 0 |
| 1970 | **nachher** | **2,25 → 2,54** | **0,81–6,53** | **−0,112** | **1 von 14** | **1.065–104.531** | **0×** | **0** |

**1350, 1884 und 1970 sind Ziffer für Ziffer identisch** — nicht „im Rahmen",
sondern dieselben Zahlen. Das ist keine Behauptung über den Quelltext: es sind
je zwei bis vier vollständige Läufe am Bildschirm.

1600 steht damit mitten in der Familie der drei anderen, und als einzige Epoche
ohne ein Jahr unter 1×:

| | rho | Band | Jahre unter 1× |
|---|---|---|---|
| 1350 | −0,152 | 0,75–7,88 | 1 von 14 |
| **1600** | **+0,121** (drei Läufe: −0,182 … +0,191) | **1,75–10,11** | **0 von 14** |
| 1884 | +0,143 | 0,63–10,18 | 1 von 14 |
| 1970 | −0,112 | 0,81–6,53 | 1 von 14 |

### Vier Epochen am Bildschirm, ohne Skript

`?epoche=1..4&saat=1350`, Michaelitafel per Mausklick geöffnet:
`BRAUHAUS.lage.length === 0` in allen vier · **0 Konsolenfehler, 0 pageerrors**
in allen vier · Züge auf dem Schirm 113 / 124 / 127 / 119, davon mit Preisschild
39 / 37 / 42 / 43. Die neue Zeile erscheint **nur** in 1600, dort dreifach: als
Regel unter der Rechnung, als angekündigter Posten „1601 · Anschlag auf das bare
Vermögen · 250 fl" zwischen Türkensteuer und Kriegskontribution, und als
Rechnungszeile mit eigener Wurzelmarke. In 1350/1884/1970 steht weiterhin
wörtlich „Keine hängt an der Kasse."

### Eine Messwarnung für den Kritiker

`preis-linie.mjs` ist **unter Last nicht bitgenau**. Ein Lauf von 1350, der
neben Dateischreibungen und einem zweiten Chromium lief, endete bei
0,89–7,77× / rho −0,429 statt 0,75–7,88 / −0,152 — gleiche Aussage, andere
Bahn. Drei ruhige Läufe desselben Standes reproduzieren die Grundlinie exakt.
In 1600 streuen drei Läufe desselben Standes über rho −0,182 … +0,191 und ein
Bandende von 5,90 bis 10,11 — das Urteil ist in allen dreien dasselbe, die
Ziffer nicht. Wer nachmisst, misst **einzeln** und ohne parallele Läufe. (Die
Ursache sind die festen `waitForTimeout` im Skript, nicht der Würfel; der ist
gesät.) **Für eine Aussage über 1600 reicht ein einzelner Lauf nicht — es
braucht drei.**

---

## 4 — Was offen bleibt

1. **Die eigentliche Unwucht sitzt in `stuecke/gegner.js`, nicht hier.** Der
   Nenner der Kennzahl ist in 1600 eine feste Tabelle. Dieser Bau hindert den
   Zähler am Davonlaufen; er macht den Nenner nicht mitwachsen. Solange das so
   bleibt, ist 1600 die Epoche, in der ein reiches Haus die halbe Stadt für
   Kleingeld aufkaufen könnte — die Kennzahl sagt das nicht mehr, das Spiel
   stimmt trotzdem noch nicht ganz. Siehe Abschnitt 5.
2. **1884 und 1970 nehmen auf der gespielten Linie in vierzehn Jahren keine
   einzige Festlegung** (`Festlegung 0×`, vorher wie nachher). Das ist nicht
   von mir verursacht und war schon am Stand `ee1715b` so, aber es ist ein
   offener Punkt der zweiten Messlatte (b) und es ist derselbe Befund, an dem
   1600 fast gescheitert wäre. In 1884 kostet die billigste Festlegung 0,22 ×
   42.000 = 9.200 M gegen eine Michaelilade von 4.200 bis 24.700; in 1970
   0,11 × 500.000 = 55.000 DM gegen 35.600 bis 126.900. **Ein Nachzug wie bei
   `reinheit` steht dort aus.** Ich habe ihn nicht gemacht, weil er die beiden
   Epochen bewegt hätte, die ich nicht anfassen sollte.
3. **Der Zähler „Chronik des Hauses · 0 Festlegungen"** (`preis.js`, in
   `seiteChronik`, `Object.keys(Z.festGenommen)`) ist **nicht** repariert — das
   ist Stück 2 dieser Welle (DER PREIS) und dieselbe Datei. Wer beides
   gleichzeitig baut, kollidiert; ich habe die Zeile bewusst stehen lassen.
4. **Die Lade in 1600 fällt in einer Woche auf 229 fl** (Notpfennig 280). Kein
   Michaelitag steht unter 1×, kein Wert ist negativ, aber der Boden wird
   berührt. Auch das gehört Stück 2.
5. **Eine Saat.** Alles hier ist `saat=1350`. Ein zweiter Satz Saaten wäre die
   nächste Härtung; die Zeit reichte für die vier Epochen mal sechs
   Parametersätze.

---

## 5 — KERN / GEGNER: was dieses Stück nicht darf

**KERN:** `welt.meldeZug` gibt der Art `umkaempft` (Rang 3) den Vorrang vor
`bau`/`bindung`/`adresse` (Rang 2) und nimmt darin den **billigsten** Preis.
Das war richtig gegen den Bierdeckel der Werbung (ZUSTÄNDIGKEIT 24) und es
macht die Kennzahl jetzt zur Geisel des billigsten Gegenzugs. Gemessen, 1600,
vierzehn Michaelitage: der Gewinner ist in 11 von 14 Jahren ein *Zuvorkommen*
zu 66 bis 170 fl, während dieselbe Tafel eine Sprosse zu 210 bis 1.700 fl
anbietet und die Lade 430 bis 4.637 fl hält. Ein Zug, der drei Hundertstel der
Barschaft kostet, ist kein „nächster sinnvoller Zug", sondern Kleingeld. Zwei
mögliche Fassungen, beide im Kern:

* `meldeZug` behält den höheren Rang nur, solange sein Preis nicht unter einem
  festen Bruchteil des billigsten Zuges des nächstniedrigeren Ranges liegt
  (z. B. ein Fünftel); darunter zählt der niedrigere Rang. Damit übernimmt in
  1600 die Michaelitafel, deren Band ohnehin 2,38–3,37× ist.
* Oder `zugDeckung()` gibt zusätzlich die Zahl des **teuersten heute
  bedienbaren** Zuges aus, und die Kopfzeile nennt beide. Der Kritiker sieht
  dann, ob ein Haus „fertig" ist, auch wenn der billigste Gegenzug klein bleibt.

Ich habe **keine** von beiden gebaut; `kern/**` ist schreibgeschützt und beide
verändern die Kennzahl aller vier Epochen auf einmal.

**GEGNER (fremdes Stück, kein Kern):** `stuecke/gegner.js`, `grundwert(a, m) =
menge(a) × m.satz`. Beide Faktoren sind in 1600 vierzehn Jahre konstant. In
1884 wächst der Nenner, weil der Konzern zu teureren Mitteln greift
(45 → 70 → 110). Der schmalste denkbare Eingriff wäre, `m.satz` in 1600 mit
demselben `teuerungJahr` mitlaufen zu lassen, mit dem hier alles andere
mitläuft (1,038/Jahr → ×1,62 in vierzehn Jahren), oder den Adler in 1600
ebenso eskalieren zu lassen wie den Konzern in 1884. **Das ist die andere
Hälfte der Reparatur und sie gehört DEM GEGNER.**

---

## 6 — Sperrliste `design/PRUEFUNG.md`

Nichts Neues gefunden und nichts Neues eingebracht. Die vierte Wurzel benutzt
`welt.geld()` für jede Zahl (Gulden in 1600, nie selbst geschrieben), sie
erscheint nur in Epoche II, sie behauptet kein Gesetz und keine Jahreszahl, und
der Satz auf dem Schirm zitiert die Epochendaten dieser Epoche wörtlich
(„Vermögen und Gewerb"). Keine Bahn, kein Emailschild, keine Destillierblase,
kein Marktanteil.

---

## 7 — Geänderte Dateien

| Datei | Was |
|---|---|
| `spiel/stuecke/preis.js` | `liegeFreibetrag()` · `liegegeld()` · `liegeName()` · Schritt 7a in `michaeli()` · Ankündigung in `kommendeLasten()` · Regeltext und vierte Wurzel in `spalteRechnung()` · `WURZEL.hoehe` · Lesegriff `BRAUHAUS.preis` |
| `spiel/stuecke/preis-daten.js` | Epoche II: `liegeName` · `liegeSagt` · `liegeFrei: 1.0` · `liegeSatz: 0.70` · Festlegung `reinheit` von 0,15 auf 0,10 und Wirkung von +16 %/+10 auf +9 %/+5. **Epoche I, III und IV unberührt.** |
| `spiel/stil/preis-zusatz.css` | `.pr-zeile.pr-wurzel-hoehe .pr-was` (eigene Kante für die vierte Wurzel) · `.pr-satz.pr-liege` |

`node --check` ist auf beiden `.js` sauber. Keine andere Datei angefasst,
kein `git`.
