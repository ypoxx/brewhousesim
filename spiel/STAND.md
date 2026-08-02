# STAND — nach Welle 2b

Geschrieben von der Aufsicht am 2. August 2026, nachdem der Workflow
`wf_94fe188f-ca8` durch war: **zwölf Agenten, vier Stücke, je ein Builder, ein
blinder Kritiker und eine Nacharbeit. Kein Fehler, kein Abbruch.**

Der Stand von Welle 1 liegt unverändert in [`STAND-WELLE-1.md`](STAND-WELLE-1.md).

**Wie hier gemessen wurde.** Playwright, Chromium, 1920×1000, `?epoche=1..4&saat=1350`,
alles am Bildschirm — `elementFromPoint`, `innerText`, echte Mausklicks, die
Zahlen, die das Spiel selbst anzeigt. **Gemessen wird an einem eingefrorenen
Commit auf Hafen 8900** (`werkbank/schuss/aufsicht/messstand.sh`), nicht am
Arbeitsbaum: solange Builder darin schreiben, ist jede Zahl aus dem Arbeitsbaum
ein wanderndes Ziel. Wo eine Zahl von einem Builder oder Kritiker stammt, steht
es dabei.

---

## 1 — Was diese Welle geschlossen hat

**Die Kopfzeile nennt den umkämpften Zug.** Das war Auflage 1 aus drei von vier
Verdikten und die Ursache dafür, dass die zweite Messlatte über zwei Wellen
hinweg nicht zu beurteilen war. `kern/welt.js` hielt das blanke Minimum über
alle Meldungen; damit gewann in jeder Epoche derselbe feste Jahresposten der
Werbung, dessen Preis sich in 400 Wochen nicht bewegt. Die Kennzahl war die
Kasse mit anderer Beschriftung.

Alle vier Stücke haben unabhängig dieselbe Kernänderung verlangt, DIE FUHRE
schon in Welle 2. Eingearbeitet als `meldeZug(was, preis, art, zug)` mit
Rangordnung vor Preisvergleich (ZUSTAENDIGKEIT §24), Commit `c882fd7`:

| Epoche | Kopfzeile vorher | jetzt | nennt jetzt |
|---|---|---|---|
| 1350 | 12,4× | **5,89×** | Zuvorkommen Klosterschenke Obernberg · 19 Pf |
| 1600 | 35,6× | **3,76×** | Zuvorkommen Mühlschenke · 170 fl |
| 1884 | 274,0× | **8,35×** | Ablösung Ausschank am Markt · 1.706 M |
| 1970 | 47,8× | **3,54×** | Ablösung Landgasthof Hirsch · 24.300 DM |

Diese vier Zahlen sind genau die, die DER GEGNER unabhängig als die ehrlichen
gemessen hatte — zwei Wege, eine Zahl.

**Die zwölf unerreichbaren Züge sind frei.** `erreichbar.mjs` brettweise:
**0 von 80/90/93/84** statt 3/2/2/5. Ursache war DER GRIFF bei `top: 12,4 %`,
der das Paar des GEGNERS am Bahnhof zudeckte. *Einschränkung, die der
EICHUNG-Builder zu Recht angemerkt hat:* `erreichbar.mjs` schlägt nur
`stadt:reiter:*` auf. Ein Klick auf `name:blatt` legt weitere 17/18/11/11 Züge
frei, davon 12/13/6/5 mit Preisschild — auch sie sind alle erreichbar, aber der
Nenner der Aussage war zu klein.

**Der Jahreswechsel kostet einen Klick, nicht anderthalb.** `nurweiter.mjs`
schafft drei Braujahre in allen vier Epochen mit nichts als WEITER.

**Ein fünftes Spielerverb, epocheneigen.** DER GEGNER hat für 1970 MITBIETEN
gebaut: ein Notartermin mit drei Geboten nebeneinander, jedes mit eigenem
Preisschild, jedes die anderen ausschließend, keines sicher. Von der Aufsicht
nachgezählt (`werkbank/schuss/aufsicht/mitbieten.mjs`): es gibt das Verb **nur**
in 1970 — in den anderen drei Epochen taucht in 120 Wochen kein
`gegner:mitbieten*` auf —, und es ist über vier Saaten in 11/15/5/10 der
angebotenen Wochen bezahlbar. *Hinweis für den nächsten Kritiker, kein Mangel:*
bei `saat=1350` ist der **erste** Notartermin unbezahlbar (Kasse 49.760 gegen
87.091 DM, alle drei Knöpfe aus). Wer einmal hinsieht und weitergeht, hält das
Verb für tot.

**Ein Sachfehler ist raus.** „1980 Pfand- und Rücknahmepflicht" ist ersetzt; die
Datei nennt jetzt Verpackungsverordnung 1991 und Zwangspfand 2003 und behauptet
kein Gesetz, das es nicht gab.

---

## 2 — Was gebaut wurde und nicht ankommt

Zwei Stücke haben etwas Richtiges gebaut, und beides erreicht den Bildschirm
nicht. Beide Befunde stehen ausführlich in [`BEFUND-ENDE.md`](BEFUND-ENDE.md).

**Das Urteil über die Partie liegt zugeklappt unter dem Sudbuch.** DIE FUHRE
malt ein Schlussblatt, 1075×628 px, mit dem Urteil im Klartext („Das Brauhaus
zum Anker hört auf · 1353 Der Rat entzieht dem Haus zum Anker das B…"). In
**allen vier Epochen** trägt es die Klasse `stadt-zugeklappt` und liegt unter
`sud-schluss` — der Rechenschaft eines einzelnen Stücks über sich selbst. DER
SUD hat das selbst gefunden und seine Klappe zurückgenommen; bei 1440×900,
1600×1000 und 2752×1536 steht das Schlussblatt offen. **Bei 1920×1000 greift es
nicht**, weil das Sudbuch dort 13,75 % der Bühne misst und über der Schwelle
bleibt.

*Das berichtigt einen früheren Befund der Aufsicht:* „das Ende ist stumm" war
richtig in dem, was der Spieler sieht, und falsch in der Ursache. Ein Ende gibt
es, und es hat Worte.

**Der Boden der Wirtschaft ist gebaut und wird nicht erreicht.** DIE STADT hat
DIE VERWERTUNG gebaut — vier epocheneigene Wege, den Hof zu Geld zu machen
(1350 VERSATZ 45 %, 1600 WIEDERKAUF 55 %, 1884 HYPOTHEK 70 % mit 5,5 % Zins und
stehenbleibendem Bau, 1970 ABBRUCH 85 %) — und meldet für 1350 Kassenstände von
0/0/0 statt −6/−7/−14.

Nachgemessen am Stand `cb9d86e`, nur WEITER: **genau die alten Zahlen.**
Michaelitage 112 / −6 / −7 / −14, **44 von 103 Wochen unter null**, in der
Chronik **keine einzige Pfändungszeile**, `lage` 0, kein Seitenfehler. Ein
synthetisch gesendetes `jahr`-Ereignis bei Kasse −25 bewegt weder Kasse noch
Chronik.

---

## 3 — Die Kennzahl der zweiten Latte

Ziel dieser Welle: **|rho| < 0,7 in allen vier Epochen, höchstens ein Jahr von
sechs unter 1×.**

Auf der **sorgfältig gespielten Linie** (vier aufgezeichnete 400-Wochen-Läufe des
EICHUNG-Builders; die Aufsicht hat 1350 mit seinem eigenen Skript nachgefahren
und es reproduziert, 3,39 → 0,16 bei ihm wie bei mir):

| Epoche | Start → Ende | rho | Jahre unter 1× | Latte |
|---|---|---|---|---|
| 1350 | 3,39 → 0,16 | −0,795 | 6 von 12 | reißt beide |
| **1600** | 3,56 → 2,69 | **+0,165** | **0 von 14** | **besteht** |
| 1884 | 5,09 → 1,40 | −0,367 | 2 von 14 | besteht |
| 1970 | 3,44 → 0,06 | −0,572 | 9 von 11 | reißt das zweite |

Der Builder schließt daraus „elf Läufe und kein Kippen". Das ist wahr für die
Richtung **nach oben** — die Latte ist aber zweiseitig, und 1350 fällt um den
Faktor 21, 1970 um den Faktor 57.

**1600 besteht sauber, und das ist der Beleg, der bisher fehlte:** ein Haus
verachtfacht sein Vermögen, und die Kennzahl bleibt im Band 1,44–3,17, weil die
Preise 1,32× schneller wachsen als die Barschaft. Die Wirtschaft *kann* also.

**Die Aufgabe heißt darum nicht „die Wirtschaft reparieren", sondern 1350 und
1970 nach dem Muster von 1600 bauen.**

---

## 4 — Was als Nächstes drankommt

[`../gauntlet/WELLE-3.md`](../gauntlet/WELLE-3.md) steht und ist auf diese Zahlen
gestützt. Vier Stücke: **DAS ENDE** (vier Epochen, vier Ausgänge, und eines, das
spricht) · **DIE RÜCKKOPPLUNG** (1350 und 1970 nach dem Muster von 1600) · **DIE
KOPFZEILE** (erledigt in dieser Welle — der Punkt schrumpft auf: die
Übergangszeile aus `gegner.js` darf jetzt verschwinden) · **DAS FÜNFTE VERB**
(erledigt für 1970).

Dazu der Kleinkram, der kein eigenes Stück braucht:

* **`stuecke/name.js:1135`** — der Spieler liest in allen vier Epochen eine
  Übergabenotiz zwischen zwei Buildern, die ein JS-Feld beim Namen nennt.
* **Der Zähler „Chronik des Hauses · N Festlegungen"** steht auf 0. DER GEGNER
  hat die Ursache gefunden: `stuecke/preis.js:1525` zählt
  `Object.keys(Z.festGenommen)` statt
  `chronik.filter(c => c.art === 'festlegung').length`.
* **Drei Braujahre sind zu kurz.** Die Amtszeit in 1350 läuft bis 1386, die
  Partie endet 1353 — auf sorgfältig gespielter Linie trägt sie vierzehn Jahre.
  Der Abbruch trifft den, der nichts tut.
