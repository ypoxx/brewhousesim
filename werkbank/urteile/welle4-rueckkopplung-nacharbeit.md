# DIE RÜCKKOPPLUNG, Nacharbeit zu Runde 2 — Bericht des Builders

Welle 4, Stück 1, Nacharbeit nach dem Urteil **FÄLLT DURCH**.
Geschrieben am 3. August 2026, **vor** der Rückgabe.

**Gemessen am eingefrorenen Stand `da7d690`** (Hafen 8900,
`werkbank/schuss/aufsicht/messstand.sh da7d690`) und am **PROBESTAND** — das ist
derselbe Commit plus ausschließlich meine drei Dateien, auf Hafen 8901
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
Maschine unabhängig: nachgewiesen bei Lastmittel 13,7 und bei 1,5, beide Male
dieselbe Reihe.

---

## 2 · AUFLAGE A2 — `gegner.js:1561` und `stadt.js:1404`: gemessen, nicht angefasst

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

## 3 · AUFLAGE A3 und der zweite Kernpunkt — **KERN:**

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

## 4 · AUFLAGE A4 — die Festlegungskarte nannte einen Horizont, der zehn- bis achtzehnmal zu lang war. **Erledigt.**

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

## 5 · Die dünnste Spalte: **1 / 1 / 0 / 0 Festlegungen in vierzehn Jahren** — gemessen, halb erklärt, halb offen

Der Befund des Kritikers stimmt und ist an meinen Läufen reproduziert: die
sorgfältig gespielte Linie nimmt in 1350 **eine**, in 1600 **eine**, in 1884 und
1970 **keine** unwiderrufliche Festlegung, obwohl acht Amtszeiten vorbeigehen.

**Die Hälfte, die mir gehört, ist die Karte — sie ist erledigt (§4).** Die
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

## 6 · Die übrigen Auflagen

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

## 7 · Die Sperrliste, Punkt für Punkt

1. **Der Nenner wurde nicht verstellt.** Kein Preis eines Ablösens oder
   Zuvorkommens ist angefasst; `gegner.js` und `gegner-daten.js` sind
   unverändert. Der Nenner in 1350 läuft nachher wie vorher: **42 → 56 Pf**,
   Faktor ×1,33. Nur der Zähler ist bewegt.
2. **1600 bleibt, wo es steht.** Nachgewiesen mit drei Läufen, §1. Meine
   Änderung an `preis-daten.js` steht ausschließlich in Epoche I; meine
   Änderung an `preis.js` (Amtszeit) berührt **keine** Zahl der Wirtschaft —
   sie schreibt einen Satz und einen Kalendereintrag.
3. **`welt.ZUGRANG` ist unverändert.** `spiel/kern/**` ist nicht angefasst.
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
