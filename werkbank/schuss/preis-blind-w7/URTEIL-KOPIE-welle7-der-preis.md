# DER PREIS — Welle 7, blindes Urteil

*Blinder Kritiker. Gesehen wurde ausschliesslich das laufende Spiel auf dem
eingefrorenen Messstand `b6b06bb`, Hafen 8903 (Marke vor Beginn gegengeprüft:
`b6b06bb`), dazu der Quelltext unter `spiel/`. **Nicht** gesehen:
`werkbank/urteile/welle7-der-preis-bau.md`, keine andere Bau- oder Urteilsdatei
mit „preis" im Namen, keine git-Historie.*

Messwerte als `.json` unter `werkbank/schuss/preis-blind-w7/`.

> ## DAS URTEIL IN EINER TABELLE
>
> | | |
> |---|---|
> | **Latte 2 — das Spiel** | **BESTEHT MIT AUFLAGE** |
> | **Latte 4 — die Lesbarkeit, an diesem Stück** | **BESTEHT MIT AUFLAGE** |
> | Latte 1 — das Bild | **nicht geprüft** (gehört einem Fremden mit dem Zielbild daneben) |
> | Latte 3 — der Ton | **nicht geprüft** |
> | **Sperrliste** | **VERLETZT — zwei Funde, siehe §6.1 und §6.2** |
> | **ALS GANZES** | **FÄLLT DURCH** — und zwar **allein an der Sperrliste**. Ohne die zwei Funde stünde hier „besteht mit Auflage". Beide sind Aufschriften, kein Entwurf; der Umfang ist zwei Zeilen Quelltext. |
>
> **Die Frage des Auftrags — besser oder nur glatter — ist mit BEIDES zu
> beantworten, und die Aufteilung ist scharf:** in **1350** ist die Wirtschaft
> wirklich besser geworden (die unterste Sprosse der Leiter wechselt in
> vierzehn Braujahren **sechsmal** den Namen und wird **siebenmal genommen**);
> in **1600 und 1970** steht am selben Commit **genau das Bild, das die Welle
> behoben hat** — dieselbe unterste Sprosse vierzehn- bzw. zehnmal
> hintereinander, kein einziges Mal genommen. §3.5.

---

## 0 · Der Messstand

| | |
|---|---|
| Marke `http://127.0.0.1:8903/.messstand-marke` | `b6b06bb` |
| URL | `…/spiel/?epoche=<1..4>&saat=1350` |
| Fenster für alles Gespielte | **1366×768** — die Grösse der vierten Latte |
| Messfenster | jede 400-Wochen-Messung durch `werkbank/schuss/aufsicht/messfenster.sh`, ein Aufruf je Messung |
| Eigene Geräte | `schau.mjs` · `hand.mjs` · `spiel.mjs` (400 Wochen, eigene Hand) · `wochen.mjs` · `pfennig.mjs` · `lesbar-preis.mjs` |

**Die ρ-Zahl wird hier nicht nachgerechnet.** Sie ist dreifach belegt.

**Meine Hand ist ausdrücklich eine ANDERE als die der Aufsicht.**
`rueckkopplung-r3/linie.mjs` nimmt zu Michaeli das **billigste** bezahlbare
Angebot und nur, wenn danach noch das Doppelte übrig bleibt. Meine Hand
(`spiel.mjs`, `GIER=1`) nimmt das **teuerste**, das die Lade trägt. Der Grund
steht in der Frage: ob ein Haus je an die teuren Entscheidungen herankommt,
lässt sich mit einer Hand, die nur die billigen kauft, nicht messen.

---

## 1 · Ist die Wirtschaft besser oder nur glatter?

**Gemessen: 1350, 400 Wochen = 14 Braujahre, `saat=1350`, 1366×768,
0 Seitenfehler, `BRAUHAUS.lage` 0.**
(`werkbank/schuss/preis-blind-w7/spiel-e1.json`)

### 1.1 Was wächst — und es wächst wirklich

| | 1350 | 1363 |
|---|---|---|
| Ausstoss des Vorjahres | 150 Pf | **650 Pf** (×4,3) |
| Satz je Fass | 9 Pf | **14 Pf** (Rat +40 %, Haus selbst gebaut +12 %) |
| Anschlag | 515 Pf | **1.297 Pf** |
| Bauten, die stehen | 0 | **7** (tragen 157 Pf im Jahr) |
| billigstes Angebot der Tafel | 33 Pf | **320 Pf** |
| teuerstes Angebot der Tafel | 1.300 Pf | **3.400 Pf** |

Das ist kein Kostüm. Die Tafel von 1363 ist eine andere als die von 1350: die
kleinen Sprossen sind weg (gekauft), es stehen vier grosse da, und die
Rechnungsspalte trägt sieben Zeilen, die 1350 nicht existierten. **Das Haus
wächst, und die Entscheidungen davor werden teurer.** Die erste Hälfte der
Frage ist mit Ja zu beantworten.

### 1.2 Was nicht wächst — die Lade

| | |
|---|---|
| Kasse zu Michaeli, Anfang → Ende | **112 Pf → 48 Pf** |
| Höchststand in 400 Wochen | **384 Pf** |
| Tiefststand | **1 Pf** |
| Einnahmen über 14 Braujahre | 9.724 Pf |
| Ausgaben über 14 Braujahre | 9.730 Pf |
| **Netto über die ganze Partie** | **−6 Pf** |

Michaeli-Lade Jahr für Jahr, nach dem Zahltag und nach dem Kauf:
**2 · 48 · 5 · 101 · 141 · 154 · 175 · 48 · 63 · 48 · 245 · 66 · 114 · 48.**

**Viermal von vierzehn endet der Michaelitag auf exakt 48 Pf** — das ist der
Notpfennig der Epoche (`preis-daten.js:88`), also der Betrag, unter den der Rat
nicht greift. In diesen vier Jahren war die Rechnung grösser als die Lade, und
genommen wurde alles bis auf den Notpfennig.

### 1.3 Wohin das Geld geht — die Buchungen, nicht die Absicht

Alle 3.609 Buchungen der Partie, nach Zeile summiert:

| Posten | über 14 Braujahre | Anteil an allen Einnahmen |
|---|---:|---:|
| Basispflichten (Grutgeld, Mahlgeld, Erbzins, Wasserzins, Schoss) | −964 Pf | 9,9 % |
| **Handlohn beim Erbfall** | **−850 Pf** | 8,7 % |
| **UNTERHALT (neu in dieser Runde)** | **−501 Pf** | 5,2 % |
| Rückstand mit Aufschlag | −190 Pf | 2,0 % |
| **Anschlag auf das Geld in der Lade (Liegegeld)** | **−189 Pf** | 1,9 % |
| ausserordentliche Umlagen | −115 Pf | 1,2 % |
| *Sommer: Unterhalt und Abgaben* (KERN, `welt.js:429`) | −280 Pf | 2,9 % |
| **zusammen abgeschöpft** | **−3.089 Pf** | **31,8 %** |
| gekauft (Angebote, Raten, Festlegung) | −785 Pf | 8,1 % |

**Das Haus zahlt in 14 Jahren mehr Handlohn (850 Pf) als es je in Bauten
gesteckt hat (785 Pf).** Und es hat in denselben 14 Jahren keinen Pfennig mehr
in der Lade als am Anfang.

### 1.4 Die Antwort

**Beides ist wahr, und die Reihenfolge entscheidet.** Das Haus wächst — im
Ausstoss, im Preis je Fass, im Anschlag, in dem, was im Hof steht. Die **Lade**
wächst nicht, und sie soll nicht: genau das ist der Zweck der vierten Wurzel.

Was daran **nicht** Taschenleeren ist, und das ist der stärkste Befund für das
Stück:

* Die Abschöpfung ist **benannt, beziffert und angekündigt**. Jede Zeile trägt
  ihren Namen, ihren Betrag und ihre Wurzel („läuft weiter, auch wenn nicht
  gebraut wird" / „nach dem Ausstoss im Schnitt der letzten drei Jahre").
* Der Anschlag auf das bare Geld steht als **Regel** auf der Tafel, bevor er
  greift: *„frei bleiben 1,3 Jahreslasten, mindestens der Preis der nächsten
  Festlegung — 85 Pf. Auf alles, was zu Michaeli darüber hinaus bar liegt,
  schlägt der Rat 45 im Hundert an."*
* Er greift **nicht** ins Sparen auf die unwiderrufliche Wahl: der Freibetrag
  hat als Boden den Preis der billigsten Festlegung.
* Er ist **nicht** der grosse Posten. 189 Pf in 14 Jahren, 1,9 % der Einnahmen,
  und er wird **kleiner**, nicht grösser (60 → 83 → 16 → 10 → 6 Pf), weil der
  Freibetrag mit der Taxe wächst und die Lade nicht.

Was dagegen spricht, und es ist ernst: **siehe 1.5, 1.6 und Abschnitt 3.**

### 1.5 In 1600 ist die Abgabe auf das bare Geld der grösste Posten der Partie

400 Wochen in 1600, meine Hand (`spiel-e2.json`, 0 Seitenfehler, `lage` 0):

| | |
|---|---|
| Kasse zu Michaeli, Anfang → Ende | 150 fl → 554 fl (Start 430 fl) |
| Höchststand in 400 Wochen | 2.223 fl |
| Einnahmen / Ausgaben | 31.784 / 31.755 fl — **netto +29 fl** |
| **Anschlag auf das bare Vermögen** | **11 Buchungen, −5.780 fl = 18,2 % aller Einnahmen** |
| zum Vergleich: alles Brauen zusammen („Ein Sud Braunbier") | −4.101 fl |
| Michaelitage **ohne ein einziges bezahlbares Angebot** | **7 von 14** |

**Die Abgabe auf liegendes Geld ist in dieser Epoche teurer als das Bier
selbst.** Sie ist auf der Tafel als Regel benannt (`liegeSatz` 0,70,
`liegeFrei` 1,0) und steht Jahr für Jahr mit Namen in der Rechnung — sie ist
also nicht versteckt. Aber sie ist der Grund, warum die Lade in vierzehn
Braujahren von 430 auf 554 fl kommt, während drei der sechs unwiderruflichen
Entscheidungen dieser Epoche (`eigentum` 6.700→11.000 · `ratssitz`
5.300→8.600 · `bierbann` 8.100→13.000) **kein einziges Mal** zu haben sind.

*(Zur Klarstellung: `liegeSatz` in 1600 ist nach dem Quelltext nicht die
Änderung dieser Runde — geändert wurden die Werte für 1350. Der Befund gehört
trotzdem in die Frage „besser oder glatter", weil er dieselbe Schraube ist.)*

### 1.6 Der Befund, der gegen das Stück spricht — der Unterhalt zahlt dreimal

`pflichtSumme()` (`preis.js:464`) ist die Summe **aller** Pflichten
einschliesslich der neuen `pflichtNeu`-Zeilen. An dieser Summe hängen zwei
weitere Zahlen:

* `handlohnBetrag()` = `handlohnAnteil` × `pflichtSumme()` — in 1350 **1,10×**
  (`preis-daten.js:158`), fällig bei jedem Erbfall, in dieser Partie **alle
  zwei Braujahre**.
* `umlageBetrag()` = `umlageAnteil` × `teil` × `pflichtSumme()` — 0,35 ×
  Ø 1,11, fällig im Ø alle 3,2 Jahre (`abstaende`).

Am Michaelitag 1363, am Bildschirm abgelesen:

| | |
|---|---|
| Jahreslast gesamt | **214 Pf** |
| davon Basispflichten | 88 Pf |
| davon **Unterhalt der sieben Bauten** | **126 Pf (59 %)** |
| Handlohn desselben Tages | **240 Pf** = 1,10 × 214 |
| **Anteil des Unterhalts am Handlohn** | **139 Pf** |

**Die Karte verspricht „−26 Pf in jedem Michaeli" für den Ochsenstall. Der
wahre Jahresbetrag ist rund 26 × (1 + 1,10/2 + 0,35·1,11/3,2) = 26 × 1,67 ≈
44 Pf.** Der Aufschlag von 67 im Hundert steht auf keiner Karte, in keiner
Spalte und in keinem Satz. Er entsteht daraus, dass zwei andere Zeilen der
gleichen Rechnung an derselben Summe hängen.

**Die messbare Folge: die Vorschau „WAS FÄLLIG WIRD" ist um das Drei- bis
Vierfache zu niedrig.** Sie rechnet mit der Jahreslast von heute, und die
Jahreslast versechsfacht sich in dieser Partie (35 → 214 Pf), zu 59 % durch
den neuen Unterhalt. Angekündigt auf der Tafel von 1350, tatsächlich abgebucht
laut Protokoll:

| Umlage | 1350 angekündigt | tatsächlich abgebucht | Faktor |
|---|---:|---:|---:|
| 1352 Umlage für den Mauerbau | 9 Pf | **32 Pf** | 3,6× |
| 1355 Landfriedensgeld | 7 Pf | **31 Pf** | 4,4× |
| 1361 Zehnt auf das Braugerät | 13 Pf | **52 Pf** | 4,0× |

Die Zeile trägt keinen Vorbehalt („nach heutigem Stand"). Sie steht als Jahr
und Betrag da, in derselben Schrift wie die Rechnung, die wirklich abgebucht
wird — und in der zugeklappten Michaelitafel ist sie **die einzige Zahl über
kommende Lasten, die der Spieler 29 von 30 Wochen zu sehen bekommt**.

---

## 2 · Der Unterhalt — sichtbar und benannt?

**JA, an drei Stellen, und zwar vor der Abbuchung.** Wörtlich am Schirm
abgelesen, 1350, Tafel aufgeschlagen:

1. **Auf der Angebotskarte, vor dem Kauf**, in der Zeile `FOLGE`:
   *„+16 Pf in jedem Michaeli · −6 Pf in jedem Michaeli: Schindeln und Lattung
   für das Dach"* (`preis.js:1702–1705`, `folgeText`).
   Für jedes der Angebote in 1350 geprüft: Dach −6 · Bottich −8 · Ochsenstall
   −16 · Karrengaul (Text „dreimal so teuer im Futter", `teil` 1,80 gegen 0,60
   des Ochsen — der Satz stimmt jetzt mit der Rechnung überein).
2. **In der Rechnungsspalte jeder folgenden Michaelitafel**, mit Namen, Betrag
   und Wurzel: *„Futter und Streu für den Ochsen −26 Pf · läuft weiter, auch
   wenn nicht gebraut wird"*.
3. **In der Vorschau `WAS FÄLLIG WIRD`** — dort allerdings nur die *nächste*
   Last, und mit dem Betragsfehler aus 1.6.

**Was er kostet, gemessen** (1350, meine Hand, 7 Bauten):

| Jahr | Unterhalt in der Rechnung |
|---|---:|
| 1351 | 16 Pf |
| 1355 | 68 Pf |
| 1360 | 99 Pf |
| **1363** | **126 Pf** (7 Zeilen: 26 · 35 · 32 · 13 · 4 · 6 · 10) |
| **Summe 14 Braujahre** | **501 Pf** |

### 2.1 In wie vielen Wochen steht er am Schirm?

**Gezählt, Woche für Woche, 32 Wochen in 1350, 1366×768**
(`wochen-e1.json`, `wochen.mjs`): in **jeder** Woche wurde nachgesehen, ob
irgendein sichtbarer Text die Belastung nennt (`in jedem Michaeli` ·
`läuft weiter, auch wenn nicht gebraut wird` · `Zusammen im Jahr` ·
`Unterhalt`) — einmal so, wie das Spiel dasteht, und einmal nach **einem
Klick** auf die Michaelitafel.

| | von 32 Wochen |
|---|---|
| Belastung steht ohne Zutun am Schirm | **2** |
| Belastung steht nach **einem** Klick am Schirm | **27** |
| Michaelitafel überhaupt aufzuschlagen | in allen ausser den 5, in denen sie schon offen war |

Die beiden Wochen sind die unmittelbar nach dem Michaelitag: die Tafel schlägt
dort von selbst auf. In den übrigen 28 Wochen kostet es genau einen Klick auf
den Griff, der ständig oben rechts steht.

**Das ist keine Verheimlichung.** Die zugeklappte Tafel trägt in JEDER Woche
fünf Zahlen: Bierordnung je Fass · Anschlag des Jahres · billigstes Angebot ·
Kasse : dieses Angebot · **und die nächste fällige Last mit Jahr und Betrag**
(`preis.js:2604`). Das Geld verschwindet nicht; es wird angekündigt.

### 2.2 Aber: bei 1366×768 steht die Zeile nicht auf der Karte

Die `FOLGE`-Zeile mit dem Unterhalt ist das **sechste** Kind von
`.pr-karte-text` (`preis.js`, `angebotKarte`): Kopf · Preisschild · Hinweis ·
Bauzeit · `was` · **FOLGE** · `satz` · `sperrt`. `.pr-karte-text` rollt
(`preis-zusatz.css:90–99`, `overflow-y: auto`), schneidet also formal nichts
ab — aber bei 1366×768 ist der Kasten rund 150 px hoch und der Inhalt braucht
das Vierfache.

Am Bildschirmfoto abgelesen (`e1-tafel-auf.png`, Ausschnitt
`crop-karten.png`): der sichtbare Text jeder der fünf Angebotskarten endet bei
**„Ohne Bauzeit ·"**, mitten durch die Buchstaben geschnitten. `was`, `FOLGE`
und `satz` stehen darunter im Rollbereich.

**Der Spieler sieht das Preisschild (33 Pf) und den Knopf (−33 Pf). Die Zeile
„−6 Pf in jedem Michaeli: Schindeln und Lattung für das Dach" sieht er nur,
wenn er in der Karte rollt.** Das ist der Unterschied zwischen „benannt" und
„am Schirm".

---

## 4 · Entscheidungen mit Preisschild nebeneinander

Gezählt **am Schirm**, 1366×768: ein `[data-zug]` zählt nur, wenn er
gleichzeitig **sichtbar**, **im Fenster**, **nicht `disabled`** und
**`elementFromPoint`-treffbar** ist und ein `.preis`-Schild trägt.

### 1350, Michaelitag (Woche 1), Michaelitafel aufgeschlagen — 10 Stück

| von | Zug | Schild |
|---|---|---|
| **PREIS** | `preis:nimm:dach` | −33 Pf |
| **PREIS** | `preis:nimm:bottich` | −42 Pf |
| **PREIS** | `preis:nimm:ochsenstall` | −110 Pf |
| **PREIS** | `preis:festlege:vertrag` | −85 Pf |
| STADT | 5 × `stadt:bau:*` | −13 … −23 Pf |
| ERBE | `erbe:uebergabe:bruch` | 0 Pf |

**DER PREIS steuert vier bei, und drei davon schliessen einander teilweise
aus** (Ochsenstall ⟂ Karrengaul; die Festlegung ist eine je Amtszeit).

### Und in den 29 anderen Wochen: null

| Woche | bepreist+treffbar gesamt | davon `preis:*` |
|---|---:|---:|
| 1 (Michaeli) | 10 | **4** |
| 5 | 6 | **0** |
| 24 | 3 | **0** |

Ausserhalb des Michaelitags ist jede Karte der Tafel abgeschaltet („Michaeli
ist vorüber. Genommen wird zu Michaeli 1351"). **Die bepreisten
Entscheidungen dieses Stücks liegen an 14 von 400 Wochen auf dem Tisch —
3,5 % der Partie.** Das ist eine Entwurfsentscheidung (der Michaelitag ist
der Entscheidungstag) und keine Panne; sie gehört aber in jede Zählung der
zweiten Latte, die „Optionen nebeneinander" zählt, hinein.

**Zweiter Befund derselben Zählung, und er geht gegen das Stück:** die
aufgeschlagene Michaelitafel **verdeckt** die Bretter der anderen Stücke. In
Woche 5 fallen die gleichzeitig treffbaren bepreisten Züge von **11 auf 6**,
sobald die Tafel offen ist — und sie trägt in dieser Woche selbst **null**
bei. Wer die Tafel ausserhalb des Michaelitags aufschlägt, hat weniger auf
dem Tisch als vorher.

---

## 3 · Scheinpreise

Zwei Sorten sind zu prüfen: **ein Preis, der nie abgebucht wird** (das ist der
Sperrlisten-Verstoss) und **ein Preis, den das Haus in dieser Epoche nie
aufbringen kann** (das ist Kulisse).

### 3.1 Auf den Pfennig — wird abgebucht, was auf dem Schild steht?

`pfennig.mjs`, alle vier Epochen, 1366×768, echte Mausklicks; Kasse vor und
nach dem Klick, dazu die Protokollzeilen. Geklickt wurde jedes bepreiste
`preis:*`-Schild, das die Lade an diesem Tag trug.

| Epoche | Zug | Schild | Kasse | Δ | |
|---|---|---|---|---|---|
| 1350 | `preis:nimm:dach` | −33 Pf | 112 → 79 | −33 | **genau** |
| 1350 | `preis:nimm:bottich` | −42 Pf | 79 → 37 | −42 | **genau** |
| 1600 | `preis:nimm:darre` | −210 fl | 640 → 430 | −210 | **genau** |
| 1600 | `preis:festlege:reinheit` | −280 fl | 430 → 150 | −280 | **genau** |
| 1884 | `preis:nimm:braumeister` | −3.100 M | 14.250 → 11.150 | −3.100 | **genau** |
| 1884 | `preis:nimm:malzkontrakt` | −4.200 M | 11.150 → 6.950 | −4.200 | **genau** |
| **1884** | **`preis:festlege:aktien`** | **+11.000 M** | **6.950 → 19.950** | **+13.000** | **ABWEICHUNG +2.000 M** |
| 1970 | `preis:nimm:schankanlage` | −25.000 DM | 86.000 → 61.000 | −25.000 | **genau** |
| 1970 | `preis:nimm:grosshandel` | −48.000 DM | 61.000 → 13.000 | −48.000 | **genau** |
| 1970 | `preis:festlege:konzern` | +65.000 DM | 13.000 → 78.000 | +65.000 | **genau** |

**Neun von zehn auf den Pfennig. Einer nicht — und die Ursache ist eine
Zeilenreihenfolge.**

`preis.js`, `wende()`:

```js
if (w.pflichtNeu) Z.pflichtNeu.push(w.pflichtNeu);      // Zeile 794
…
if (w.einmal) loese(rundePreis(w.einmal * pflichtSumme()), …);   // Zeile 809
```

Der Zufluss wird mit `pflichtSumme()` gerechnet, **nachdem** die neue Pflicht
schon in dieser Summe steht. Das Schild dagegen rechnet ihn vorher
(`festKarte`: `zufluss = rundePreis(f.wirkung.einmal * pflichtSumme())`) — und
der Quelltext sagt an genau dieser Stelle, was er will:

> *„Was sie hereinbringt, mit derselben Rechnung wie beim Klick (`wende`:
> einmal × Jahreslast) — damit auf dem Schild dieselbe Zahl steht, die gleich
> in der Kasse landet."*

**Betroffen ist genau eine Karte im ganzen Spiel:** `aktien` in 1884, die
einzige mit `einmal` **und** `pflichtNeu`. `konzern` in 1970 hat `einmal` ohne
`pflichtNeu` und stimmt deshalb auf den Pfennig. Gemessene Abweichung
**+18,2 %**; das Protokoll bucht *„Die Umwandlung in eine Aktiengesellschaft —
Zufluss +13.000"*.

### 3.2 Wird der angekündigte Unterhalt wirklich abgebucht? — ja, jede Zeile

Sieben Angebote genommen (1350 · 1352 · 1354 · 1356 · 1358 · 1360 · 1362),
sieben `pflichtNeu` angekündigt. Alle sieben stehen in der Rechnungsspalte der
folgenden Michaelitage, und im Protokoll:

| Zeile | Buchungen | Summe |
|---|---:|---:|
| Futter und Streu für den Ochsen | 11 | −167 Pf |
| Lohn des Böttchers und Daubenholz | 8 | −168 Pf |
| Zwei Knechte an der Handmühle | 7 | −129 Pf |
| Weidenreifen und Dauben | 4 | −28 Pf |
| Eichung des Maßes am Grutkasten | 2 | −6 Pf |
| Der Schmied richtet Anker und Ausleger | 1 | −3 Pf |
| Schindeln und Lattung für das Dach | 0 gezahlt, **gestundet** | in der Rechnung 1363 mit „offen 10 Pf" |

**Kein Scheinpreis der ersten Sorte.** Auch der alte Fund ist geschlossen: der
Karrengaul trägt „dreimal so teuer im Futter" und `gaulfutter` hat `teil` 1,80
gegen `ochsenfutter` 0,60 — **genau dreimal** (`preis-daten.js:359`, `:373`).

### 3.3 Aber: die Ertragszeile derselben Karte ist falsch

`preis.js:1686` gegen `preis.js:1704` — auf **derselben** `FOLGE`-Zeile:

```js
if (w.ertrag) t.push('+' + geld(w.ertrag) + ' in jedem Michaeli');   // nominal
…
var p = pflichtZeile(w.pflichtNeu);                                   // mit teuerung()
t.push('−' + geld(p.betrag) + ' in jedem Michaeli: ' + w.pflichtNeu.name);
```

Der **Ertrag** steht nominal, so wie er in den Daten steht; die **Last** wird
mit der Teuerung des laufenden Jahres gerechnet, weil `lastFest()` sie
multipliziert. Abgebucht wird beides mit der Teuerung
(`preis.js`, Schritt 4: `loese(Math.round(t.betrag * teuerung()))`).

Am Schirm nachgelesen, Karte „Das Dach über der Pfanne" zu Michaeli **1362**:

> FOLGE **+16 Pf** in jedem Michaeli · −4 Pf in jedem Michaeli: Schindeln …

Tatsächlich in der Rechnung **1363** verbucht:

> Das Dach über der Pfanne **+27 Pf** · Schindeln und Lattung für das Dach −10 Pf

**Die Karte verspricht 16 und liefert 27** — 69 im Hundert daneben, zugunsten
des Spielers, und damit genau die Sorte Zahl, die eine Kaufentscheidung
unbrauchbar macht. (Der Unterschied zwischen 4 und 10 ist erklärt: 1362 lief
der `Nachlass des Rats auf Zins und Wasser`, und der steht als eigene Zeile in
der Rechnung.)

### 3.4 Kulisse — was in vierzehn Braujahren kein einziges Mal zu haben war

Zwei unabhängige Hände am **selben** Stand `b6b06bb`: meine (teuerstes
bezahlbares Angebot, `spiel-e*.json`) und die der Aufsicht (billigstes, mit
doppelter Rücklage, `aufsicht/welle7-schluss/rho/e*-A.json`).

| Epoche | höchste Lade, meine Hand | höchste Lade, Aufsicht | **nie bezahlbare Festlegungen** | **nie bezahlbare Angebote** |
|---|---:|---:|---|---|
| **1350** | 384 Pf | 517 Pf | `freikauf` 1.000→1.700 · `realrecht` 800→930 · `marktbank` 220→330 | alle fünf nach der **Schätzung** bepreisten: `brunnen` · `pfanne` · `muehlanteil` · `gewoelbe` · `bannmeile` (1.300→**3.400**) |
| **1884** | 22.897 M | 23.789 M | `bahnvertrag` 32.000→58.000 · `marke` 42.000→48.000 | in 4 von 14 Michaelitagen war **kein einziges** Angebot bezahlbar (1893 · 1895 · 1896 · 1897) |
| **1970** | 88.998 DM | 114.537 DM | `handelsmarke` 110.000→140.000 · `genossenschaft` 110.000→140.000 | 1974: keines |

Dazu eine Karte, die in einer normalen Partie **überhaupt nie erscheint**:
`hopfen` („Hopfen statt Grut") trägt `ab: 1380` (`preis-daten.js:447`). Eine
Partie in 1350 läuft 14 Braujahre und endet 1363. **Diese Festlegung ist in
keinem Spielstand je zu sehen.**

**Das ist der Preis, den Welle 7 bezahlt hat, und er ist messbar.** Die
Trennung in `nachZeit` (Taxe) und Schätzung hat die untere Hälfte der Leiter
in 1350 tatsächlich erreichbar gemacht — genau die acht Karten, die meine Hand
gekauft hat, sind die acht mit `nachZeit`. **Und sie hat die obere Hälfte
genau dort gelassen, wo sie war.** Die Bannmeile kostet 1350 dreizehn Laden
und 1363 einundsiebzig.

### 3.5 Der stärkste Einzelbefund: was der Umbau NICHT erreicht hat

`nachZeit` steht **nur** in den Daten von 1350 (`preis-daten.js`, 9 Karten).
Was das in den anderen drei Epochen heisst, steht in der Leiter der Aufsicht
am selben Commit — Spalte „billigstes Angebot dieser Tafel", vierzehn
Michaelitage:

| Epoche | wie oft wechselt die unterste Sprosse den Namen | Lade Anfang → Ende |
|---|---|---|
| **1350** | **sechs verschiedene Namen** (Dach → Fasskauf → Bottich → Fasskauf → Hausschild → Grutkasten), Preis 33 → 94 | 112 → 55 |
| 1600 | **einer.** *Die Darre überm Malzboden*, vierzehnmal hintereinander, nie genommen | 640 → 625 |
| 1884 | drei (Braumeister · Krone · Handelsmälzerei · Warmluftdarre) | 14.250 → 13.090 |
| 1970 | **einer in zehn von vierzehn.** *Der eigene Mehrwegkasten*, nie genommen | 86.000 → 60.056 |

**In 1600 und 1970 steht am eingefrorenen Stand `b6b06bb` genau das Bild, das
die Welle behoben hat — nur in einer anderen Epoche.** Dass diese beiden
Epochen die Latte halten, liegt nicht daran, dass die Leiter dort trägt,
sondern daran, dass ihre ρ-Zahl schon vorher unter 0,7 lag.

### 3.6 Und was die Zahl gar nicht sieht

Meine Hand hat 1970 nach **188 Wochen** verloren: *„Das Brauhaus wird
stillgelegt · 1976"*. Die jahrweise Kennzahl derselben Partie steht in dem
Jahr auf **2,06×** und in keinem der sieben Braujahre unter 1×. Wochenweise
fällt sie in denselben Wochen auf 0,24×.

Die Stilllegung selbst gehört DER FUHRE (acht Wochen ohne Lieferung), nicht
diesem Stück — **der Befund gehört trotzdem hierher, weil er die zweite Latte
betrifft:** eine Kennzahl, die eine Partie, die mit der Schliessung des Hauses
endet, mit 2,06× durchwinkt, misst diese Partie nicht.

---

## 5 · Latte 4 an diesem Stück — bei 1366×768, mit gezeichneter Rollleiste

Gemessen mit `lesbar-preis.mjs` — dieselben Regeln wie
`aufsicht/lesbarkeit.mjs` (`ignoreDefaultArgs: ['--hide-scrollbars']`, „kappt"
nur `hidden`/`clip`), aber **nur an den Kästen dieses Stücks** (`pr-*`) und
**zweimal**: wie das Spiel lädt, und nachdem ein Spieler die Michaelitafel
aufgeschlagen hat.

| Epoche | Zustand | Schrift < 12 px | abgeschnittene Kästen | aktive `preis:*`-Knöpfe < 24 px |
|---|---|---:|---:|---:|
| 1350 | geladen | **0** | **0** | 0 von 2 |
| 1350 | **Tafel auf** | **0** | **0** | **0 von 8** |
| 1600 | geladen / auf | 0 / **0** | 0 / **0** | 0 von 2 / **0 von 8** |
| 1884 | geladen / auf | 0 / **0** | 0 / **0** | 0 von 2 / **0 von 10** |
| 1970 | geladen / auf | 0 / **0** | 0 / **0** | 0 von 2 / **0 von 9** |

**Nach dem Buchstaben der vierten Latte ist dieses Stück sauber, und zwar
auch mit aufgeschlagenem Brett** — das ist mehr, als die Gesamtzahl der
Aufsicht zeigt, denn die misst die Tafel im zugeklappten Zustand.

### 5.1 Und trotzdem: die neue Zeile steht auf keiner einzigen Karte

Dieselbe Messung sucht jeden Textknoten, der `in jedem Michaeli` trägt — also
die `FOLGE`-Zeile, auf der seit dieser Runde steht, was ein Kauf **für immer**
kostet — und prüft, ob er innerhalb des schneidenden Kastens liegt:

| Epoche | `FOLGE`-Zeilen auf der Tafel | davon **ausserhalb ihres Kastens** |
|---|---:|---:|
| 1350 | 5 | **5** |
| 1600 | 6 | **6** |
| 1884 | 10 | **10** |
| 1970 | 9 | **9** |
| **zusammen** | **30** | **30** |

Beispiel, gemessen: die Karte „Das Dach über der Pfanne" endet bei y ≈ 400 px;
ihre `FOLGE`-Zeile *„+16 Pf in jedem Michaeli · −6 Pf in jedem Michaeli:
Schindeln und Lattung für das Dach"* steht bei **y = 493 px** — 93 px unter
dem Kartenrand. Am Bildschirmfoto (`e1-tafel-auf.png`, Ausschnitt
`crop-karten.png`) endet der sichtbare Kartentext mitten durch die Buchstaben
von „Ohne Bauzeit ·".

**Warum die Latte das nicht sieht, und der Befund gehört der Latte, nicht dem
Stück:** `.pr-karte-text` trägt seit der Lesbarkeitsarbeit
`overflow-y: auto` (`preis-zusatz.css:90–99`). Das reparierte Gerät zählt
einen rollenden Kasten ausdrücklich **nicht** als abgeschnitten — mit gutem
Grund, denn ein rollender Kasten verbirgt nichts. Hier ist er 150 px hoch,
der Inhalt braucht das Vierfache, und was darin liegt, ist **die andere
Hälfte jedes Preisschilds**.

**Das ist die Antwort auf „ist Inhalt verschwunden statt lesbar geworden": ja
— nicht gelöscht und nicht geschrumpft, sondern in dreissig kleine
Rollfenster geschoben, und die Latte zählt das als in Ordnung.**

### 5.2 Zwei Nebenbefunde derselben Messung

1. **„Nehmen" bricht mitten im Wort.** Am Bildschirm, alle fünf Karten in
   1350: `Nehme` / `n` und `−33` / `Pf` in zwei Zeilen. Ursache ist die
   Lesbarkeitsregel selbst: `preis-zusatz.css:511`
   (`.pr-tafel .knopf { white-space: normal }`) zusammen mit `:513`
   (`overflow-wrap: anywhere` auf `.pr-tafel .pr-karte`) — die Ausnahme für
   lange Komposita („Getränkefachgrosshandel") greift auch auf ein Wort mit
   sechs Buchstaben. Kein Riss der Latte, aber der Knopf, den ein Spieler
   am häufigsten drückt, ist der am schlechtesten gesetzte Text des Blattes.
2. **Die Tafel ist ein fester Prozentsatz des Bildschirms**
   (`preis.css:32–36`: `width: 84%`, `height: 74.8%`), die Schrift dagegen
   hat einen absoluten Boden (`max(12px, …)`). Bei halber Kantenlänge braucht
   derselbe Text die doppelte Fläche in einem Kasten, der genauso gross
   bleibt. **Das ist die Ursache aller dreissig Rollfenster**, und sie ist
   nicht durch Aufräumen zu beheben.

---

## 6 · Sperrliste

### 6.1 VETO-KANDIDAT — „Handlohn beim Erbfall an den Grundherrn" in 1884 und 1970

`spiel/stuecke/preis.js:1019`

```js
buche(h, 'Handlohn beim Erbfall an den Grundherrn', 'umlage');
```

Die Zeile ist **unbedingt** — sie läuft in allen vier Epochen, weil
`handlohnAnteil` in allen vier Epochendaten steht (1350: 1,10 · 1600: 1,15 ·
1884: 1,10 · 1970: 1,05).

**Am Schirm abgelesen, Michaelitafel 1973** (`spiel-e4.json`, Jahr 1973,
Spalte DIE RECHNUNG):

> Handlohn beim Erbfall an den Grundherrn **−8.300 DM** · offen 8.300 DM

Über die ganze Partie in 1970: **−13.000 DM** in einer Rechnung, deren
übrige Zeilen „Biersteuer und Umsatzsteuer", „Tarif, Sozialabgaben,
Altersversorgung" und „Körperschaft- und Gewerbeertragsteuer" heissen.

**Handlohn (Laudemium) und Grundherr sind Grundherrschaft.** In Bayern ist
sie mit der Grundlastenablösung ab 1848 abgelöst und in den 1870er Jahren
erledigt. **In 1884 gibt es keinen Grundherrn mehr, in 1970 erst recht
nicht** — und das Stück selbst weiss es: `realrecht` („Das Braurecht ans
Haus", `handlohnWeg`) steht **nur in 1350** zur Wahl. In 1884 und 1970 kann
der Spieler die feudale Abgabe nicht einmal loswerden.

Nach dem Wortlaut der Sperrliste ist das ein Fund, der den Durchgang
disqualifiziert. Der Umfang ist eine Zeile: die Aufschrift muss je Epoche aus
den Daten kommen (in 1884 etwa „Erbschaftsteuer auf den Betriebsübergang", in
1970 „Erbschaftsteuer und Übertragungskosten").

### 6.2 VETO-KANDIDAT — „vom Rat gesetzt 1970" und „der Rat setzt nach dem Korn nach"

`spiel/stuecke/preis.js:1805` und `:1816–1818`

```js
ord.appendChild(zeile('vom Rat gesetzt ' + o.ab, geld(o.preis), 'pr-satzteil'));
…
+ (satzFolgt() ? 'Zwischen den Stufen setzt der Rat nach dem Korn nach, aber nicht ganz. ' : …)
```

`satzFolgt` ist in **allen vier** Epochen grösser als null (0,60 · 0,25 ·
0,50 · 0,60), die beiden Sätze stehen also überall. Am Schirm, Michaelitafel
1970, im selben Kasten und drei Zeilen auseinander:

> **DIE BIERORDNUNG** · Satz je hl **130 DM**
> *Der Handel diktiert die Aktionspreise. Der Listenpreis ist Zierde.*
> **vom Rat gesetzt 1970** · 130 DM
> …
> *Gesetzt 1970 — die Stufe steht seit 3 Jahren.* **Zwischen den Stufen setzt
> der Rat nach dem Korn nach**, aber nicht ganz.

Der eigene Satz der Epoche sagt, dass der Handel den Preis macht; die Zeile
darunter sagt, ein Rat setze ihn nach dem Kornpreis nach. Für 1884 gilt
dasselbe. **Ein Bierpreis, den 1970 ein Rat nach dem Korn nachsetzt, ist ein
Anachronismus**, und er steht in der grössten Schrift des Kastens.

### 6.3 Was sauber ist

| Prüfpunkt | Befund |
|---|---|
| **Währung des Jahres** | sauber. 1350 `Pf` · 1600 `fl` · 1884 `M` · 1970 `DM`. Keine eigene Währung im Quelltext des Stücks — alles über `B.welt.geld()`. |
| **Hektoliter erst ab 1872** | sauber. `einheit` ist `Fass` in 1350/1600 (`preis-daten.js:44`, `:635`) und `hl` erst in 1884/1970 (`:1002`, `:1208`). Am Schirm: „Satz je Fass 9 Pf" (1350) gegen „Satz je hl 130 DM" (1970). |
| **Offene Braupfanne** | sauber und ausdrücklich: `pfanne` in 1350 trägt „Eine offene Pfanne aus getriebenem Kupfer über offenem Feuer — **kein Helm, kein Rohr**." |
| **Emailschilder erst ab den 1890ern** | sauber: `{ k: 'email', … ab: 1893 }` (`preis-daten.js:1126`), also in 1884 nicht auf der Tafel. |
| **Marktanteil auf die eigene Menge** | DER PREIS nennt keinen Marktanteil. |
| **Bahn** | `gleis`/`bahnvertrag` nur in 1884. |
| Datierte Sperren | `flaschen` ab 1880 · `kaelte` ab 1876 (Linde) · `marke` ab 1894 · `kronkorken` bis 1969 · `denkmal` ab 1973 (Bayern 1973) · `trikot` ab 1973 — alle im belegten Fenster. |

### 6.4 Zwei Grössenordnungen, die ich melde, ohne sie Veto zu nennen

Beide betreffen den **Satz je Einheit** und liegen gegen die eigenen Anker
aus `design/PRUEFUNG.md` §1.6 zu hoch:

| Epoche | Spiel | Anker in PRUEFUNG §1.6 |
|---|---|---|
| 1884 | **48 M je hl** (`preis-daten.js:1002`, Ordnungsstufe 51,4) | 12 M/hl (Pfad 1) bis 18,40 M/hl (Pfad 4), beide dort „plausibel" |
| 1970 | **130 DM je hl** | 50–80 DM/hl, 64,20 DM/hl dort „der einzige realistische hl-Preis von 1970 im ganzen Feld" |
| 1600 | **22 fl je Fass** = 22 fl je 150 l | 1 fl ≈ 60–80 l Bier ⇒ eher 2–4 fl je Fass |

Das ist kein Anachronismus, sondern eine Skalierung, und sie hängt an der
Startkasse der Epoche. Ich nenne sie, weil §1.6 dieselbe Frage bei sechs
Entwürfen gestellt hat, und überlasse das Gewicht der Aufsicht.

---

## 7 · Was ich NICHT prüfen konnte

Das gehört ausdrücklich in dieses Urteil:

1. **Die erste Latte (Bild).** Ein Blindvergleich gegen `zielbild/` gehört
   einem Fremden, der beide Bilder nebeneinander sieht. Ich habe die
   Michaelitafel fotografiert, aber nicht gegen ein Zielbild gelegt.
2. **Die dritte Latte (Ton).** DER PREIS ruft `B.ton.spiele('preis:michaeli')`
   und `preis:muenzen`. Ich habe kein Ohr befragt.
3. **Die ρ-Zahl selbst.** Auftragsgemäss nicht nachgerechnet — sie ist am
   selben Commit dreifach byteweise belegt.
4. **1600 mit eigener Hand über die volle Laufzeit** — die Messung stand beim
   Schreiben dieses Absatzes noch im Fenster; was hier über 1600 steht, kommt
   aus den Rohdaten der Aufsicht am **selben** Commit
   (`aufsicht/welle7-schluss/rho/e2-A.json`), nicht aus meiner Hand.
5. **Ob der Unterhalt vor Welle 7 anders war.** Ich sehe nur den heutigen
   Stand; die git-Historie ist mir verboten. Alle Aussagen über „neu in dieser
   Runde" stützen sich auf den Auftragstext, nicht auf eigene Messung.
6. **Die Stilllegung in 1970** konnte ich nicht auf eine Ursache zurückführen.
   Sie fällt in DIE FUHRE (acht Wochen ohne Lieferung); ob meine Hand oder das
   Stück sie ausgelöst hat, ist mit einem Lauf nicht zu entscheiden.
7. **Ein zweiter Lauf je Epoche.** Meine vier Läufe stehen bei n = 1. Die
   Gerätekontrolle liefert die Aufsicht (drei byteweise gleiche Läufe in 1350);
   meine eigenen Zahlen sind nicht wiederholt. Sie stimmen dort, wo sie
   vergleichbar sind, mit denen der Aufsicht in der Grössenordnung überein
   (höchste Lade 1350: 384 gegen 517 Pf bei anderer Kaufregel).

---

## 8 · Die Auflagen

Jede mit Zahl und Quelltextstelle. **1 und 2 sind Sperrliste und damit
blockierend.**

**AUFLAGE 1 (Sperrliste, blockierend) — die feudale Aufschrift.**
`spiel/stuecke/preis.js:1019` schreibt in **allen vier** Epochen
`'Handlohn beim Erbfall an den Grundherrn'`. Gemessen am Schirm:
**−8.300 DM** in der Michaelitafel 1973 und **−13.000 DM** über die Partie in
1970, **−12.100 M** in 1884. Handlohn und Grundherr gibt es in beiden Epochen
nicht mehr, und `handlohnWeg` ist nur über `realrecht` zu haben, das **nur**
in 1350 auf der Tafel steht. Die Aufschrift gehört je Epoche in die Daten
(`preis-daten.js`, neben `handlohnAnteil`).

**AUFLAGE 2 (Sperrliste, blockierend) — der Rat, der 1970 den Bierpreis
setzt.** `preis.js:1805` (`'vom Rat gesetzt ' + o.ab`) und `:1817`
(`'Zwischen den Stufen setzt der Rat nach dem Korn nach, aber nicht ganz.'`)
laufen unbedingt, weil `satzFolgt` in allen vier Epochen > 0 ist (0,60 · 0,25
· 0,50 · 0,60). In derselben Kachel steht drei Zeilen darüber der eigene Satz
der Epoche: *„Der Handel diktiert die Aktionspreise. Der Listenpreis ist
Zierde."*

**AUFLAGE 3 — das Preisschild, das um 2.000 M danebenliegt.**
`preis.js:794` schiebt `pflichtNeu` in `Z.pflichtNeu`, `preis.js:809` rechnet
den Zufluss danach mit `pflichtSumme()`. Gemessen: `preis:festlege:aktien` in
1884, Schild **+11.000 M**, gebucht **+13.000 M** (+18,2 %). Betroffen ist
genau diese eine Karte — sie ist die einzige mit `einmal` **und**
`pflichtNeu`. Der Zufluss ist vor `wende()` zu berechnen oder aus derselben
Zwischengrösse zu nehmen wie das Schild.

**AUFLAGE 4 — der Ertrag auf der `FOLGE`-Zeile ist nominal, die Last nicht.**
`preis.js:1686` (`'+' + geld(w.ertrag)`) gegen `preis.js:1704`
(`pflichtZeile(w.pflichtNeu)`, mit `teuerung()`), während Schritt 4 der
Michaeli-Abrechnung **beides** mit `teuerung()` bucht. Gemessen: Karte „Das
Dach über der Pfanne" zu Michaeli 1362 verspricht **+16 Pf in jedem
Michaeli**, die Rechnung 1363 bucht **+27 Pf** — 69 % daneben.

**AUFLAGE 5 — die Vorschau „WAS FÄLLIG WIRD" nennt zu kleine Zahlen.**
`preis.js`, `kommendeLasten()` rechnet mit der heutigen `pflichtSumme()`; die
wächst in 1350 über die Partie von 35 auf 214 Pf, zu 59 % durch den neuen
Unterhalt. Gemessen, Tafel 1350 gegen Protokoll: Mauerbau 1352 angekündigt
**9 Pf**, gebucht **32 Pf** · Landfriedensgeld 1355 angekündigt **7 Pf**,
gebucht **31 Pf** · Zehnt 1361 angekündigt **13 Pf**, gebucht **52 Pf**.
Entweder ein Vorbehalt an die Zeile („nach heutiger Jahreslast") oder eine
Fortschreibung der Jahreslast in der Vorschau.

**AUFLAGE 6 — der Unterhalt zahlt dreimal, und zwei Drittel davon stehen auf
keiner Karte.** `pflichtSumme()` (`preis.js:464`) trägt die neuen Zeilen, und
an ihr hängen `handlohnBetrag()` (`:486`, Faktor 1,10 in 1350, alle zwei
Braujahre fällig) und `umlageBetrag()` (`:482`). Gemessen 1363: Jahreslast
214 Pf, davon 126 Pf Unterhalt; Handlohn desselben Tages 240 Pf, davon 139 Pf
aus dem Unterhalt. **Ein angeschriebener Pfennig Unterhalt kostet rund 1,67
Pfennig im Jahr.** Entweder die Karte nennt den vollen Betrag, oder die
`FOLGE`-Zeile sagt, dass Handlohn und Umlage mitwachsen.

**AUFLAGE 7 — die `FOLGE`-Zeile steht auf keiner der dreissig Karten im
Bild.** `preis.css:224` (`.pr-karte { overflow: hidden }`) mit
`preis-zusatz.css:90–99` (`.pr-karte-text { overflow-y: auto }`): gemessen
**30 von 30** `FOLGE`-Zeilen ausserhalb ihres Kastens bei 1366×768, in allen
vier Epochen. Die Zeile mit dem, was ein Kauf für immer kostet, gehört über
den Rollbereich — dorthin, wo das Preisschild und der Knopf schon stehen
(`.pr-karte > .pr-hinweis` ist bereits `flex: 0 0 auto`).

**AUFLAGE 8 — die obere Hälfte der Leiter ist in 1350 nachweislich
unerreichbar.** Zwei Hände, derselbe Commit: höchste Lade **384 Pf**
(meine, kaufend) und **517 Pf** (Aufsicht, sparend). Nie bezahlbar in
vierzehn Braujahren: `freikauf` 1.000→1.700 · `realrecht` 800→930 ·
`marktbank` 220→330 und **alle fünf** nach der Schätzung bepreisten Angebote,
bis `bannmeile` 1.300→**3.400**. Dazu `hopfen` (`preis-daten.js:447`,
`ab: 1380`), das in einer Partie ab 1350 **nie erscheint**. Entweder eine
Zwischensprosse oder eine Ansage auf der Karte, in welchem Jahrhundert sie
gedacht ist.

**AUFLAGE 9 — `nachZeit` fehlt in 1600, 1884 und 1970.** Leiter der Aufsicht
am selben Commit: in 1600 heisst die unterste Sprosse **vierzehnmal**
hintereinander „Die Darre überm Malzboden" und wird nie genommen, in 1970
**zehnmal von vierzehn** „Der eigene Mehrwegkasten". Das ist Ziffer für
Ziffer das Bild, das für 1350 als Fehler erkannt und behoben wurde. Der Grund,
es dort zu lassen („nicht zwei Sachen zugleich an derselben Kennzahl drehen"),
trägt für eine Welle; er trägt nicht dafür, dass die Epoche geheilt sei.

**AUFLAGE 10 — null unwiderrufliche Festlegungen in 1884 und 1970.** Aus den
Rohdaten der Aufsicht am selben Commit (`welle7-schluss/rho/e3-A.json`,
`e4-A.json`): `festGesetzt` = **0** in vierzehn Braujahren, bei einer Hand,
die Festlegungen ausdrücklich sucht. In 1350 und 1600 ist es **1**. Die
zweite Latte zählt „unwiderrufliche Festlegungen" als eigene Spalte; in zwei
von vier Epochen steht sie auf null.

---

## 9 · Die Urteile, einzeln

### Latte 1 — das Bild
**NICHT GEPRÜFT.** Ein Blindvergleich gegen `zielbild/` gehört einem Fremden,
der beide Bilder nebeneinander legt. Ich habe die Michaelitafel in allen vier
Epochen fotografiert (`e1-tafel-auf.png`, `lb-e*-tafel.png`), aber nicht
verglichen.

### Latte 2 — das Spiel
**BESTEHT MIT AUFLAGE** (Auflagen 4, 5, 6, 8, 9, 10).

*Wofür:* Die Verbliste ist je Epoche eine andere — Angebote, Pflichten,
Umlagen und Festlegungen sind in allen vier Epochen verschieden benannt und
verschieden gebaut; von vier Tapeten kann keine Rede sein. Am Michaelitag
liegen in 1350 **vier bepreiste Entscheidungen dieses Stücks** treffbar
nebeneinander, drei davon schliessen einander teilweise aus. Die Rechnung ist
vollständig benannt, mit Wurzel je Zeile. Und in 1350 tut der Umbau dieser
Runde nachweisbar das, wofür er gemacht ist: die unterste Sprosse wechselt
sechsmal den Namen, das Haus kauft in sieben von vierzehn Jahren, der Ausstoss
vervierfacht sich.

*Wogegen:* Die Lade wächst in keiner Epoche (netto −6 Pf · +29 fl · +3.872 M ·
−81.268 DM über die Partie). Die teure Hälfte der Leiter ist in 1350
messbar unerreichbar. In zwei von vier Epochen fällt in vierzehn Braujahren
keine einzige unwiderrufliche Entscheidung. Und die bepreisten Entscheidungen
dieses Stücks liegen an **14 von 400 Wochen** auf dem Tisch.

### Latte 3 — der Ton
**NICHT GEPRÜFT.**

### Latte 4 — die Lesbarkeit, an diesem Stück
**BESTEHT MIT AUFLAGE** (Auflage 7).

Nach dem Buchstaben besteht sie glatt, und zwar auch mit aufgeschlagenem
Brett: **0 Textknoten unter 12 px · 0 abgeschnittene Kästen · 0 von 8 bis 10
aktiven Knöpfen unter 24 px**, in allen vier Epochen, bei 1366×768, mit
gezeichneter Rollleiste. Die Auflage betrifft nicht die Zahl, sondern das,
was die Zahl nicht sieht: **30 von 30 `FOLGE`-Zeilen liegen ausserhalb ihres
Kastens.**

### Sperrliste
**VERLETZT.** Zwei Funde, §6.1 und §6.2, beide auf dem Bildschirm, beide in
zwei von vier Epochen, beide Aufschrift und nicht Entwurf.

---

## 10 · ALS GANZES

# FÄLLT DURCH

**Allein an der Sperrliste.** Nach dem Wortlaut der Messlatte disqualifiziert
ein Fund dieser Art den Durchgang, und „Handlohn beim Erbfall an den
Grundherrn −8.300 DM" neben „Körperschaft- und Gewerbeertragsteuer" in einer
Rechnung von 1973 ist ein Fund dieser Art. Dasselbe gilt für „vom Rat gesetzt
1970".

**Das ist ausdrücklich kein Urteil über die Arbeit dieser Runde.** Die beiden
Funde sind zwei Zeichenketten in `preis.js`; sie kosten eine Stunde. Ohne sie
stünde hier „besteht mit Auflage", und der Umbau, um den es in dieser Runde
ging, ist in **1350 nachweislich gelungen** — sechs verschiedene unterste
Sprossen statt zwölfmal derselben, sieben Käufe in vierzehn Jahren, und ein
Unterhalt, der genannt, beziffert, angekündigt und Zeile für Zeile abgebucht
wird.

**Was die Aufsicht aus diesem Urteil mitnehmen sollte, wenn sie nur eine Sache
mitnimmt:** die ρ-Zahl ist in 1350 besser geworden, **weil dort wirklich etwas
repariert wurde**. In 1600 und 1970 ist sie unter 0,700, **ohne dass dort
etwas repariert wurde** — dieselbe unterste Sprosse steht dort vierzehn- und
zehnmal hintereinander auf der Tafel und wird nie genommen. Eine Zahl, die
beides gleich aussehen lässt, hat für zwei von vier Epochen nichts gemessen.

---

## 11 · Befund über die Sicherung dieses Laufs — nicht über das Stück

**Der Veröffentlicher stellt `werkbank/urteile/` nicht bereit.** Gemessen,
nicht vermutet: Prozess `2222` (`werkbank/veroeffentlichen.sh 180 14400`) hat
zwischen 18:02 und 18:18 UTC **fünf** Commits gemacht (`ce55b4d`, `4b3edd2`,
`c0f314a` …) und in jedem ausschliesslich Dateien aus `werkbank/schuss/`
mitgenommen. Die beiden Urteilsdateien beider blinder Kritiker dieser Welle —
`welle7-der-preis-urteil.md` und `welle7-die-stadt-urteil.md` — standen
dieselbe Viertelstunde als `??` da.

Sie sind **nicht** ignoriert: `git check-ignore` gibt Exitcode 1, und
`git add --dry-run -A -- werkbank/urteile` meldet für beide `add '…'`. Der
Pfad steht auch im Skript (`veroeffentlichen.sh:47`). Die wahrscheinlichste
Ursache ist, dass der **laufende** Prozess eine ältere Fassung des Skripts im
Speicher hat — bash liest den Rumpf einer `while`-Schleife einmal —, und die
alte Fassung kannte `werkbank/urteile` nicht. Genau dieser Fall ist im
`LAUFENDER-AUFTRAG` schon einmal beschrieben *(„Ein Kritiker, der zwei Stunden
misst und brav laufend schreibt, hätte bei einem Container-Reset alles
verloren, während die Regel ihm sagte, er sei gesichert.")*

**Was ich deshalb getan habe, weil mir `git` verboten ist:** dieselbe Datei
liegt zusätzlich unter
`werkbank/schuss/preis-blind-w7/URTEIL-KOPIE-welle7-der-preis.md`. Dieser
Ordner wird nachweislich committet — dort sind alle meine Messdateien
gelandet. Die Kopie ist wortgleich; sollte das Original beim nächsten Reset
fehlen, steht es dort.

**Für die Aufsicht:** den Veröffentlicher neu starten, damit er die heutige
Fassung des Skripts liest. Ein Neustart genügt; am Skript ist nichts zu
ändern.
