# DER SUD — Nacharbeit zu Welle 4

Laufend geschrieben. Was hier steht, ist gemessen, wenn eine Zahl daneben
steht; alles andere ist als Vermutung gekennzeichnet.

## Messbedingungen

| | |
|---|---|
| Urteil, an dem gearbeitet wird | `werkbank/urteile/welle4-der-sud-urteil.md` (BESTEHT MIT AUFLAGE) |
| Vom Kritiker gemessener Commit | 2953242 |
| Eigener Messstand VORHER | eingefrorene Kopie des Arbeitsbaums vor jeder Aenderung, Hafen **8913** |
| Eigener Messstand NACHHER | dieselbe Kopie, nur `sud.js` · `sud-daten.js` · `sud-zusatz.css` eingespielt, Hafen **8915** |
| Gegenprobe „nur der Zettel geheilt" | dieselbe Kopie, `sud-daten.js` **unveraendert**, Hafen 8916 |
| Saat | 1350, Schirm 1920 x 1080 |
| Werkzeug | Playwright/Chromium, echte Mausklicks |

Grund fuer eigene Haefen: 8899 ist der Arbeitsbaum, in den gerade zwei andere
Builder (preis*.js, ton.js) schreiben; 8900 und 8911 tragen fremde Messstaende.

## Stand der Arbeit

- [x] Urteil ganz gelesen (470 Zeilen)
- [x] Quelltext gelesen (sud.js, sud-daten.js, sud-zusatz.js, sud*.css)
- [x] VORHER-Messung, vier Epochen
- [x] Auflage 1 · 2 · 3 · 4 · 5
- [x] NACHHER-Messung, vier Epochen
- [x] Siegel und Ratsche nach der neuen Festlegung nachgeprüft
- [x] `node --check`, vier Epochen geladen, `BRAUHAUS.lage.length === 0`, 0 Konsolenfehler

## DIE VIER PROZENTZAHLEN — die Zahl, an der die Abnahme hängt

*Eine Bierentscheidung mit mehr als einem Knopf, gemessen mit
`rettung.mjs` (unveränderte Kopie des Kritikers), ganze Partie:*

| Epoche | VORHER | Wochen | NACHHER | Wochen | Auflage |
|---|---|---|---|---|---|
| **1350** | **2,7 %** | 301 | **99,2 %** | 118 | ≥ 25 % — **erfüllt** |
| 1600 | 99,7 % | 313 | **99,7 %** | 316 | gehalten |
| 1884 | 18,3 % | 338 | **60,8 %** | 97 | — |
| 1970 | 22,8 % | 114 | **20,5 %** | 146 | — |

Weil die Partien verschieden lang enden und die Zahl mit der Streckenlänge
fällt (Begründung unten), daneben dieselbe Messung über die **gleich lange
Strecke**, je Epoche die kürzere der beiden Partien — das ist die belastbare
Zahl:

| Epoche | Wochen | VORHER | NACHHER | Unterschied |
|---|---|---|---|---|
| **1350** | 103 | **6,8 %** | **99,0 %** | **+92,2** |
| 1600 | 313 | 99,7 % | 100,0 % | +0,3 |
| 1884 | 97 | 63,9 % | 60,8 % | −3,1 |
| 1970 | 114 | 22,8 % | 26,3 % | +3,5 |

1350 dreimal unabhängig nachgemessen, gegen denselben VORHER-Stand über
dieselbe Strecke:

| Lauf | Strecke | VORHER | NACHHER |
|---|---|---|---|
| 1 | 98 Wochen | 7,1 % | **99,0 %** |
| 2 | 103 Wochen | 6,8 % | **99,0 %** |
| 3 | 118 Wochen | 6,8 % | **99,2 %** |

1884 und 1970 bewegen sich um ±3 Punkte — das ist die Streuung dieser Messung
(zwei Partien, zwei verschiedene Zufallswege, geldgebundene Achsen). 1350
bewegt sich um 92 Punkte. Nur die zweite Zahl ist ein Befund.

### Welche der beiden Änderungen die Zahl trägt — die Gegenprobe

Ein dritter Stand, Hafen 8916: derselbe VORHER-Stand, **nur** `sud.js` und
`sud-zusatz.css` eingespielt, `sud-daten.js` **unverändert** — der geheilte
Kesselzettel ohne die zweite Bierfrage. Dieselbe Strecke, 118 Wochen:

| Stand | beide am Zettel | Brett rettet | Zettel weg | **ZUSAMMEN** |
|---|---|---|---|---|
| VORHER, nichts geheilt | 6 | 2 | 8 | **6,8 %** |
| **nur der Zettel geheilt** | 5 | 0 | 5 | **4,2 %** |
| Zettel **und** zweite Bierfrage | 14 | 103 | 1 | **99,2 %** |

Die Platzsuche allein bringt 1350 **nicht** über die Auflage — sie hält den
Zettel im Bild (weg von 8 auf 5 Wochen), aber ein Zettel, der zuverlässig
einen einzigen druckbaren Knopf zeigt, ist immer noch eine Entscheidung mit
einem Knopf. Über die volle Partie liegt dieser Stand bei **2,2 %**, also
genau dort, wo der Kritiker gemessen hat.

Erst die zweite Frage trägt die Zahl. Das ist zugleich die Antwort auf seinen
Satz *„die 78 Pf sind NICHT das Problem"*: das Problem war nicht der Preis
und nicht der verschwundene Zettel, sondern dass 1350 **nur eine Frage**
hatte.

Der Kesselzettel lag im VORHER-Stand in 5,3 bis 7,0 % der Wochen als
`display: none` auf dem Schirm; nachher in **0,0 bis 4,1 %**, und in dem
Zustand, in dem er vorher immer verschwand — alle sieben fremden Bretter
offen —, behält er in allen vier Epochen alle vier Knöpfe.

## VORHER — mit dem Werkzeug des Kritikers nachgestellt

`werkbank/schuss/sud-w4b/rettung.mjs` ist eine unveraenderte Kopie von
`werkbank/schuss/sud-blind4/rettung.mjs`. Damit ist die Abnahmezahl dieselbe
Zahl, die er gemessen hat, und nicht eine eigene.

| Epoche | Wochen | Jahre | Zettel `display:none` | beide Wahlen am Zettel | Brett rettet | **ZUSAMMEN** | Kritiker |
|---|---|---|---|---|---|---|---|
| 1350 | 301 | 1350–1364 | 20 (6,6 %) | 6 (2,0 %) | 2 | **8/301 = 2,7 %** | 2,0 % |
| 1600 | 313 | 1600–1613 | 18 (5,8 %) | 59 (18,8 %) | 253 | **312/313 = 99,7 %** | 100 % |
| 1884 | 338 | 1884–1897 | 18 (5,3 %) | 54 (16,0 %) | 8 | **62/338 = 18,3 %** | 40,5 % |
| 1970 | 114 | 1970–1974 | 8 (7,0 %) | 20 (17,5 %) | 6 | **26/114 = 22,8 %** | 22,0 % |

Drei von vier Zahlen stellen sich nach (2,7 gegen 2,0 · 99,7 gegen 100 · 22,8
gegen 22,0). **1884 nicht: 18,3 % gegen 40,5 %.** Der Grund steht in der
Zeile daneben — der Kritiker spielte 116 Wochen bis 1888, mein Lauf 338
Wochen bis 1897. Beide 1884er Achsen haengen am Geld (siehe unten), und die
Kasse duennt aus, je laenger die Partie steht. Es ist keine Gegenmessung,
sondern eine laengere. Fuer die Abnahme zaehlt ohnehin 1350, und dort stimmen
wir auf 0,7 Punkte ueberein.

### Warum 1600 kann, was 1350 nicht kann — die Bauart, nicht der Preis

Die Spalte „Brett rettet" sagt es. Gezaehlt wird, wie viele Optionsknoepfe am
aufgeschlagenen Brett wirklich zu druecken sind. Die laufende Option ist immer
gesperrt (richtig so). Also entscheidet, wie viele **kostenlose** Alternativen
eine Epoche ueberhaupt hat:

| Epoche | Achsen | Optionen gesamt | davon kostenlos und nicht die laufende | Brett gibt ≥ 2 |
|---|---|---|---|---|
| 1350 | 1 (`wuerze`) | 3 | **1** (`sack`) | 2 von 295 |
| 1600 | 2 (`schuettung`, `gaerung`) | 5 | **2** (`weizen`, `hafer`) | 253 von 254 |
| 1884 | 2 (`kaelte`, `hefe`) | 5 | **1** (`warm`) | 8 von 284 |
| 1970 | 2 (`fuehrung`, `behandlung`) | 7 | **1** (`schoenen`) | 6 von 94 |

1600 hat zwei kostenlose Antworten und deshalb in 99,7 % der Wochen mehr als
einen Knopf — sie stehen beide an derselben Achse (`weizen` und `hafer`), und
für die Messlatte genügt das: zwei Knöpfe an einer Frage sind eine Wahl.

1350 hat EINE Frage, und ihre zweite Antwort kostet 78 Pf bei einer Kasse mit
Median 14 Pf. Das ist keine Preisfrage, das ist eine Bauartfrage — und sie
wird hier als solche behoben.

---

## AUFLAGE 1 + 4 — der Zettel darf nicht verschwinden

### Was der Kritiker widerlegt hat, und er hat recht

Ich hatte gemeldet, fremde Bretter der FUHRE deckten den Kesselzettel. **In
null Faellen lag ein fremdes Brett obenauf** — der Zettel nahm sich selbst
weg. `taktZugeklappt()` setzte `beiseite` → `display: none`, sobald
`stelleZettel()` unter acht Stellen keine fand. Mein Flicken aus Welle 4 (die
acht Stellen) hat das Symptom verschoben, nicht die Ursache beseitigt: acht
Stellen sind zu wenige, und die Antwort auf zu wenige Stellen ist nicht
Verschwinden, sondern **mehr Stellen**.

### Der Fehler, direkt vorgefuehrt (`werkbank/schuss/sud-w4b/eng.mjs`)

Alle sieben fremden Bretter aufgeschlagen, Woche 1, je Epoche. Gemessen wird
der Kesselzettel: Lage, Groesse, und wie viele seiner Knoepfe ein echter Klick
treffen wuerde.

| Epoche | VORHER Klasse | VORHER Groesse | VORHER bedienbar | NACHHER Klasse | NACHHER Lage | NACHHER bedienbar |
|---|---|---|---|---|---|---|
| 1350 | `beiseite` | **0 × 0** | **0 von 4** | — | 49,5 / 50,7 % | **4 von 4** |
| 1600 | `beiseite` | **0 × 0** | **0 von 4** | — | 43,5 / 50,7 % | **4 von 4** |
| 1884 | `beiseite` | **0 × 0** | **0 von 4** | — | 49,5 / 26,8 % | **4 von 4** |
| 1970 | `beiseite` | **0 × 0** | **0 von 4** | — | 43,5 / 50,7 % | **4 von 4** |

Im haertesten Zustand, den das Spiel hergibt — jedes fremde Brett offen —
verlor der Zettel bisher in allen vier Epochen alle vier Knoepfe. Jetzt
behaelt er alle vier, in voller Groesse, ohne `knapp` und ohne `gedraengt`:
er weicht um 20 bis 26 Prozentpunkte nach rechts aus und sitzt dort frei.

### Was gebaut wurde

1. **Das Raster** (`AUSWEICHSTELLEN`, `sud.js`). Nach den acht Stellen am
   Sudhaus sucht der Zettel ein Raster ueber die ganze Buehne ab, nach dem
   Quadrat der Entfernung vom Sudhaus sortiert (y mit 3,2 gewichtet, weil ein
   Prozentpunkt Hoehe bei 2752 × 1536 nur 0,56 Prozentpunkte Breite lang ist).
   Er geht so weit weg, wie er muss, und keinen Punkt weiter. Alle Stellen
   haengen weiter am Ort `sudhaus`; eigene Koordinaten gibt es nicht.
2. **Der Vorfilter** (`grobFrei`). 138 Stellen mal 150 fremde Knoepfe waeren
   20.000 `elementFromPoint` alle 320 ms. Deshalb wird erst gerechnet —
   Rechteck gegen fremde Knopfmittelpunkte, ohne den Zettel zu bewegen — und
   nur was das uebersteht, wird wirklich nachgemessen (hoechstens 20 bzw. 28
   Stellen je Durchgang). Gemessen: das Aufschlagen aller sieben Bretter
   dauert mit der Suche 3,2 s gegen 3,1 s ohne sie.
3. **KNAPP**. Findet auch das Raster nichts, wirft der Zettel Kopfzeile,
   Verfahrenszeile und Zahlen ab und behaelt nur die Knoepfe — 11,5 % × 11 %
   = 1,27 % der Buehne statt 2,145 %. Damit passt er in Luecken, in die der
   volle nicht passt, und sucht beide Listen noch einmal ab.
4. **GEDRAENGT statt weg**. Erst wenn auch das nichts findet, bleibt er
   stehen — sichtbar, mit gestricheltem Rand, und seine untreffbaren Knoepfe
   tragen `data-verdeckt="1"`. `display: none` gilt ab jetzt fuer **genau
   einen** Fall: das eigene Brett liegt offen. Den hat der Kritiker
   ausdruecklich nicht beanstandet.
5. **Und dieser eine Fall wird jetzt richtig erkannt.** Unter Last hat eine
   Messung den Zettel trotzdem `beiseite` angetroffen, bei geschlossenem
   Brett. Ursache: der Rahmen der STADT stempelt `stadt-zugeklappt` erst in
   seinem naechsten Takt (`stadt.js`: 240 ms), ein frisch gezeichnetes Brett
   traegt also kurz gar nichts — und „nichts" hiess hier „offen". Die STADT
   sagt aber selbst, ein Brett *liegt beim Laden zu*. Bis ihr Stempel an
   diesem Brett einmal war, gilt jetzt die alte Lage
   (`data-sud-gesehen`). Gegenprobe (`auf.mjs`), Reiter dreimal gedrueckt:
   `zu → auf → zu → auf`, der Zettel tritt jedes Mal richtig zurueck und
   kommt jedes Mal zurueck, und am offenen Brett stehen in 1350 vier
   bedienbare Optionsknoepfe.

Damit ist Auflage 4 (die 1970er Charge mit Frist) mitbeantwortet: die beiden
Knoepfe `sud:zettel-charge-frei` und `-charge-schnitt` waren in 17 von 34
Wochen nur deshalb nicht zu druecken, weil der Zettel `display:none` trug —
`data-soll-aus` war in allen 17 Faellen 0. Dieser Weg ist zu.

---

## AUFLAGE 2 — 1350 braucht mehr als eine Gelegenheit

### Was gebaut wurde: eine zweite Frage, die keinen Pfennig kostet

`DAS BRAUWASSER` (`sud-daten.js`, Epoche 1, Achse `wasser`), drei Antworten:

| | Preis | `hoechst` | Wirkung | was es kostet |
|---|---|---|---|---|
| `bach` — Wasser aus dem Stadtbach | 0 | 3 | neutral | nichts (Vorgabe) |
| `brunnen` — Wasser aus dem Ziehbrunnen | **0** | 3 | Haltbarkeit ×1,15 | **ein Fass je Sud** |
| `roehre` — Röhrenrecht an der Quelle | **30 Pf** | 3 | Haltbarkeit ×1,35, Güte-Anker 78 | unwiderruflich, gesiegelt |

Drei Entscheidungen dahinter, jede einzeln nachprüfbar:

* **Der Preis der freien Antwort ist Ausbeute, nicht Münze.** WELLE-2 §1 — Welle 2
  nimmt kein neues Geld aus der Kasse. Genau deshalb steht sie immer bereit,
  auch bei Kassenstand 0, und genau das war die Auflage.
* **Alle drei tragen `hoechst: 3`, decken also nichts.** `hoechsteStufe()` nimmt
  das Minimum über alle Achsen. Eine neue Achse mit `hoechst: 2` hätte dem
  `sack` und dem `brief` ihre ganze Wirkung genommen — 1350 wäre mit
  Hopfenbrief auf Grutbier festgenagelt geblieben. Der Deckel des
  Vorgabestands liegt weiter auf Stufe 2, und zwar dort, wo er lag: an der Grut.
* **Die Vorgabe ist exakt neutral** (haltbar 1,0 · gaer 0 · roh 0 · risiko 0).
  Die Vorgabepartie von 1350 bleibt Zahl für Zahl dieselbe, einschließlich der
  null Sude durch den Gärkeller, die der Kritiker als schärfsten Beleg
  zitiert. Das Stück verschlechtert keinen vorgefundenen Zustand.
* **Der Preis von 30 Pf ist kein zweiter Hopfenbrief.** Er liegt bei 27 % der
  Startkasse (der Brief bei 70 %) und nahe am Gärraum, den der Kritiker selbst
  als weiter bezahlbar gemessen hat (26 Pf).

### Und die zweite Zeile des Kesselzettels entscheidet sich jetzt nach der Kasse

Bis hierher stand dort immer die nächste bezahlte Umstellung — in 1350 in 296
von 301 Wochen ein abgeschalteter Knopf. Jetzt:

| Lage | zweite Zeile | Zugschlüssel |
|---|---|---|
| Kasse trägt den Preis | die bezahlte Umstellung | `sud:zettel-wechsel-kauf` |
| Kasse trägt ihn nicht | die nächste **kostenlose** Umstellung, möglichst einer anderen Achse | `sud:zettel-wechsel-frei2` |
| es gibt keine zweite kostenlose | wieder die bezahlte, abgeschaltet, damit der Preis lesbar bleibt | `sud:zettel-wechsel-kauf` |

Der Schlüssel wechselt mit: ein Knopf, der nichts kostet, heißt hier nicht
`-kauf`. Der Preis, der dabei vom Knopf fällt, steht als Zeile darunter
(`Röhrenrecht an der Quelle 30 Pf — die Kasse trägt es noch nicht.`).
Gemessen mit erzwungener Kasse 0 (`zwang.mjs`): 1350 und 1600 tragen dann eine
**bedienbare** zweite Bierwahl, 1884 und 1970 haben keine zweite kostenlose
Antwort im ganzen Zeitalter und zeigen weiter den Preis.

Der Kesselzettel bleibt dabei in jedem geprüften Zustand bei **2,145 % der
Bühne** (13 % × 16,5 %) und **0 px Überstand** — auch mit gesperrter Charge in
1970 und mit der neuen Preiszeile. Die Ortsmarken-Schwelle der STADT (2,4 %)
wird nicht berührt.

---

## DIE ABNAHMEZAHL

Werkzeug: `werkbank/schuss/sud-w4b/rettung.mjs`, unveränderte Kopie des
Kritikers. Beide Stände unterscheiden sich in **genau drei Dateien**
(`sud.js`, `sud-daten.js`, `sud-zusatz.css`) und in sonst keiner — der
NACHHER-Stand ist eine Kopie des VORHER-Standes mit eingespielten eigenen
Dateien, damit die Arbeit der zwei anderen Builder an `preis*.js` und `ton.js`
die Zahl nicht verschiebt.

Die vier Prozentzahlen stehen oben. Aufgeschlüsselt für 1350, über dieselben
103 Wochen (`vergleich.mjs vorher end`):

| | VORHER | NACHHER |
|---|---|---|
| beide Bierwahlen **am Zettel** bedienbar | 6 | **13** |
| Brett rettet (≥ 2 Optionen bedienbar) | 1 | **89** |
| Zettel lag `display:none` | 7 | **2** |
| Optionsknöpfe am Brett | 3 | **6** |
| **ZUSAMMEN** | **7 / 103 = 6,8 %** | **102 / 103 = 99,0 %** |

Die Auflage verlangte „deutlich mehr als 2,0 %", Zielzahl 25 %. Gemessen
99,0 %, dreimal unabhängig (99,0 · 99,0 · 99,2). Die eine verbleibende Woche
ist die eine, in der der Reiter das Brett nicht rechtzeitig aufbrachte —
dieselbe Messungenauigkeit, die der Kritiker in seiner Sperrliste selbst
beschreibt.

### Warum „gleich lange Strecke" und nicht „ganze Partie"

Die 1350er Partien enden von Lauf zu Lauf verschieden lang: VORHER 301 Wochen
ohne Abbruch, die Gegenprobe „nur der Zettel" 223, die drei NACHHER-Läufe 98,
103 und 118 — alle drei mit demselben Grund, `braurecht-entzogen`, also
*„seit X Wochen hat keine Schenke der Stadt ein Fass genommen"*. Was ich dazu
gemessen habe, und was ich nicht behaupte:

* **Der Abbruch hängt daran, dass `fuhre:fuellen` nicht getroffen wird.** Als
  Element unter dem Mauszeiger meldet `elementFromPoint` **`DIV#buehne`** —
  also die Bühne selbst: es liegt **gar nichts darüber**, das Wagenbrett war
  zum Klickzeitpunkt nur noch nicht aufgeklappt. 60 ms Wartezeit reichen
  nicht. Das ist genau der Messfehler, den der Kritiker in seiner Sperrliste
  selbst beschreibt („70 ms Wartezeit reichen nicht, der Rahmen der STADT
  entscheidet erst im nächsten Bild").
* **Derselbe Fehlschlag tritt auf dem VORHER-Stand auf** (`schritt.mjs`, jeder
  Klick einzeln protokolliert): dort ab 1350/3 bzw. 1350/11, danach in jeder
  Woche, mit demselben `DIV#buehne` darunter. Er ist also nicht von diesem
  Stück verursacht und nicht von diesem Stück zu beheben — er liegt in der
  Wartezeit des Messskripts.
* **Was diesem Stück zuzurechnen ist:** der Hefeknopf `sud:zettel-anstich` ist
  jetzt von Woche 1 an bedienbar. Vorher war er es nicht — dieselbe Messung
  zeigt ihn in den ersten sechs Wochen als `aus` bei `data-soll-aus="0"`, also
  genau als den Defekt, den Auflage 1 beschreibt. Das Skript drückt ihn
  unbedingt, jede Woche, und er kostet ein Fass aus dem Lager. Über hundert
  Wochen ist das rund ein Fass je Woche weniger im Verkauf. Ein Mensch würde
  die Hefe nicht jede Woche mit einem Fass bezahlen; das Skript hat keine
  solche Regel. **Das ist die Folge einer festen Skriptregel, die auf einen
  neu erreichbaren Knopf trifft — kein neuer Nachteil im Spiel.**

Deshalb ist die gleich lange Strecke die belastbare Zahl, und sie ist
zugunsten des VORHER-Standes gerechnet: sie vergleicht seine besten 98 Wochen
(mit Startkasse) gegen dieselben 98 Wochen nachher.

---

## AUFLAGE 3 — „trägt Exportbier" auf einem Knopf, der kein Exportbier macht

Der Kritiker hat recht, und zwar zweimal.

**Erstens das Schild.** `hoechst` deckelt und hebt nie; das Wort „trägt"
behauptete das Gegenteil. Geändert an beiden Stellen, am Brett und am Zettel:

| | vorher | nachher |
|---|---|---|
| Option lässt die oberste Sorte zu | `trägt Exportbier` | **`lässt Exportbier zu`** |
| Option deckelt tiefer | `höchstens Lagerbier` | `höchstens Lagerbier` (unverändert — war schon ehrlich) |
| am Zettel | `trägt Starkbier` | **`lässt Starkbier zu`** |

Dazu am Knopf ein Titel, der es ausspricht: *„Eine Obergrenze, kein
Versprechen: dieses Verfahren steht Exportbier nicht im Weg. Bestellt wird die
Sorte an der Fuhre — dieses Brett deckelt nur, es hebt nie."*

**Zweitens die fehlende Hälfte.** Dass die Sorte woanders bestellt wird, stand
nirgends. Jetzt steht es im Feld WAS BEIM WIRT ANKOMMT, in zwei Zeilen:

* fest: *„Bestellt wird die Sorte an der Fuhre. Dieses Brett deckelt sie — es
  hebt sie nie: was hier offen steht, wird nur dann gebraut, wenn es auch
  bestellt ist."*
* aus dem eigenen Keller gerechnet, nur wenn es zutrifft: *„Die Pfanne lässt
  Exportbier zu — im Keller liegt keins. Dieses Brett öffnet nur die Schranke;
  angesetzt wird Exportbier an der Fuhre, und dort kostet es Brautage."*

Die zweite Zeile ist genau der Befund des Kritikers, vom Stück selbst gezählt:
sie erscheint in dem Zustand, den er dreimal gemessen hat (0 / 0 / 192.000 DM,
alle drei enden mit `pils` Stufe 2). Ein Spieler, der 192.000 DM ausgibt, liest
ab der ersten Woche danach, was ihm noch fehlt.

Was **nicht** geändert wurde: der Zug hebt weiterhin nicht. Das ist die
tragende Regel dieses Stücks (`sud-daten.js`: „Die Zahl geht NIE nach oben"),
sie ist an vier Epochen durchgezogen, und ein Stück, das die Sorte hebt, nähme
DER FUHRE die Bestellung weg. Von den zwei Wegen, die der Kritiker anbietet,
ist der erste gegangen.

---

## AUFLAGE 5 — `schalte()` soll Verdeckung nicht in `disabled` umschreiben

Halb zugestimmt, halb widersprochen — mit der Zahl daneben.

**Zugestimmt:** wer `disabled` zählt, konnte „das Spiel sagt nein" nicht von
„da liegt etwas darüber" unterscheiden. Das ist behoben. Jeder Knopf dieses
Stücks trägt jetzt drei Angaben statt einer:

| Attribut | Bedeutung |
|---|---|
| `data-soll-aus="1"` | das Spiel sagt nein — steht beim Zeichnen fest |
| `data-verdeckt="1"` | der Zug wäre erlaubt, aber etwas liegt darüber |
| `data-aus-grund` | in Worten: `spiel` · `verdeckt` · `brett-zugeklappt` · `brett-offen` |

**Widersprochen:** `disabled` selbst darf die Summe bleiben. Ein Knopf, den die
Maus nicht trifft, ist wirklich kein Knopf; ihn aktiv stehen zu lassen wäre die
größere Lüge, und genau dafür ist ein früherer Stand dieses Stücks vom
Kritiker der Runde 1 zu Recht gerügt worden (BEFUND-BRETTER.md §1: „ein Drittel
aller Bedienelemente ist für die Maus nicht da"). Die Trennung gehört in
*zusätzliche* Attribute, nicht in ein weicheres `disabled`.

Gemessen im Vorgabestand nach der Änderung: `verdeckt 0`, `brett-zugeklappt`
4–11 je Epoche — die zugeklappten eigenen Bretter, sauber als solche benannt.

---

## KERN: `data-soll-aus` für alle Stücke, aus einer Hand

Die Aufsicht hat nachgemessen, dass es das Attribut offenbar nur bei DIESEM
Stück gibt, und dass deshalb für 13 bis 20 gesperrte Züge je Epoche niemand
„das Spiel sagt nein" von „es ist verdeckt" unterscheiden kann. Ich habe die
Zahl auf dem eigenen VORHER-Stand nachgestellt und um die eine Angabe
erweitert, die für die Lösung entscheidet — **wer diese Knöpfe baut**
(`werkbank/schuss/sud-w4b/reichweite.mjs`, Vorgabestand, Woche 1):

| Epoche | Züge im Bild | davon aus `B.knopf()` | von Hand gebaut | gesperrt | gesperrt **ohne** `data-soll-aus` | und die stammen von |
|---|---|---|---|---|---|---|
| 1350 | 102 | **94** | 8 | 20 | **13** | ausschließlich `fuhre:*` |
| 1600 | 112 | **102** | 10 | 29 | **20** | ausschließlich `fuhre:*` |
| 1884 | 116 | **106** | 10 | 29 | **20** | ausschließlich `fuhre:*` |
| 1970 | 107 | **98** | 9 | 25 | **14** | ausschließlich `fuhre:*` |

Die 13 / 20 / 20 / 14 der Aufsicht stellen sich auf den Knopf genau nach. Und
sie liegen **alle** in einem einzigen Stück, das seine Knöpfe **über
`B.knopf()` baut**. Die von Hand gebauten 8 bis 10 sind sämtlich DER GEGNER
(`gegner:oeffnen:*`, `:abloesen:*`, `:hinhalten:*`, `:zuvorkommen:*`) und
gehören nicht zu den ungeklärten.

### Der Vorschlag: drei Zeilen in `kern/buehne.js`, kein Stück fasst etwas an

`B.knopf()` bekommt das Wissen bereits als Argument — `opt.aus` ist genau „das
Spiel sagt nein". Es wird nur nicht aufgeschrieben:

```js
    if (opt.aus) {
      k.disabled = true;
      k.setAttribute('aria-disabled', 'true');
    }
```

wird zu

```js
    /* Warum dieser Knopf aus ist, gehoert an den Knopf. Wer nur `disabled`
       zaehlt, verwechselt "das Spiel sagt nein" mit "da liegt etwas darueber"
       — gemessen: 13 bis 20 Faelle je Epoche (werkbank/schuss/sud-w4b/). */
    k.setAttribute('data-soll-aus', opt.aus ? '1' : '0');
    if (opt.aus) {
      k.disabled = true;
      k.setAttribute('aria-disabled', 'true');
    }
```

Das ist die ganze Änderung. Ihre gemessene Reichweite: **94 von 102 · 102 von
112 · 106 von 116 · 98 von 107** Zügen bekommen das Attribut, ohne dass ein
einziges Stück eine Zeile ändert — und darunter **alle** heute ungeklärten
gesperrten Züge. Der lokale Aufsatz von DER SUD (`sud.js`, `function knopf()`)
wird dadurch überflüssig und kann in der nächsten Welle ersatzlos entfallen;
bis dahin setzt er denselben Wert und stört nicht.

### Zwei Anschlussstücke, falls die Aufsicht weitergehen will

1. **Der Grund, nicht nur das Ja/Nein.** Wer `disabled` nachträglich umsetzt —
   für zugeklappte Bretter, für Verdeckung —, sollte sagen, warum. Ein Helfer
   im Kern, den jedes Stück benutzen kann:
   ```js
   B.sperre = function (el, grund) {          /* grund: null = wieder offen */
     if (!el) return;
     var aus = !!grund;
     if (el.disabled !== aus) {
       el.disabled = aus;
       if (aus) el.setAttribute('aria-disabled', 'true');
       else el.removeAttribute('aria-disabled');
     }
     if (grund) el.setAttribute('data-aus-grund', grund);
     else el.removeAttribute('data-aus-grund');
   };
   ```
   DER SUD führt dieselbe Buchführung seit dieser Runde in eigener Regie
   (`data-aus-grund` mit den Werten `spiel` · `verdeckt` · `brett-zugeklappt`
   · `brett-offen`); der Helfer würde sie nur allgemein machen.
2. **`B.zuege()` soll es mitliefern.** Der Zähler, den ein blinder Kritiker
   ohne Quelltext benutzt, gibt heute `offen: !el.disabled` zurück und
   verschweigt die Unterscheidung, um die es geht. Zwei Felder mehr —
   `sollAus: el.getAttribute('data-soll-aus') === '1'` und
   `grund: el.getAttribute('data-aus-grund')` — und die Sperrliste des
   Kritikers („Nicht zählen, was nur `disabled` ist") wäre keine Sperrliste
   mehr, sondern eine Voreinstellung.

Alle drei Änderungen liegen in `spiel/kern/buehne.js` und damit außerhalb
meines Besitzstands; angefasst habe ich sie nicht.

---

## WAS AM SIEGEL GEPRÜFT WURDE, WEIL EINE NEUE FESTLEGUNG DAZUKAM

`sud:wasser:roehre` ist die fünfte unwiderrufliche Festlegung des Spiels. Sie
ist mit dem Werkzeug des Kritikers geprüft, unverändert übernommen:

| Prüfung | Achse | gekauft | Rückwege | führten zurück |
|---|---|---|---|---|
| `siegel.mjs` 1350 | `wuerze` | `brief` 78 Pf | 9 | **0** |
| `siegel.mjs` 1350 | **`wasser`** | **`roehre` 30 Pf** | **9** | **0** |
| `ratsche.mjs` 1350 (Kasse 5.000.000) | `wuerze` | `brief` | 6 | **0** |
| `ratsche.mjs` 1350 (Kasse 5.000.000) | **`wasser`** | **`roehre`** | **6** | **0** |

Nach dem Kauf steht am Brett, was dort stehen soll: `bach` und `brunnen`
tragen *„das Siegel liegt darauf"*, `roehre` trägt *„läuft"*. Die neue Achse
hat keine teurere Festlegung über sich, also bleibt nach dem Siegel nichts
offen — genau wie bei `gaerung` in 1600.

---

## WAS ICH NICHT GEÄNDERT HABE, UND WARUM

* **Der Zug hebt die Sorte weiterhin nicht.** Auflage 3 bot zwei Wege; ich
  bin den ersten gegangen (das Schild sagt jetzt, dass es eine Obergrenze
  ist). Der zweite hätte die tragende Regel des Stücks umgedreht — „die Zahl
  geht NIE nach oben" ist über vier Epochen durchgezogen — und hätte DER
  FUHRE die Bestellung aus der Hand genommen.
* **1884 und 1970 haben weiterhin nur eine kostenlose Alternative im ganzen
  Zeitalter** (`kaelte:warm` bzw. `behandlung:schoenen`). Das ist dieselbe
  Bauart, die 1350 auf 2 % gedrückt hat, und es ist messbar: siehe die Spalte
  „Brett gibt ≥ 2" oben. Die Auflage nennt nur 1350, und vier Epochen auf
  einmal umzubauen hieße, die Wirtschaftszahlen aller anderen Builder dieser
  Welle zu verschieben, während sie messen. **Als Befund für die nächste Welle
  hiermit gemeldet**, mit der Zahl daneben.
* **`display: none` bleibt für den einen Fall, den der Kritiker ausdrücklich
  nicht beanstandet hat** — das eigene Brett liegt offen.

## Wo der Kritiker sich irrt — mit der Zahl daneben

**1. „1884: 40,5 %" ist keine Eigenschaft des Standes, sondern der
Partielänge.** Auf demselben Vorgabestand messe ich, mit seinem eigenen
unveränderten Werkzeug:

| gemessene Wochen | 1884, Anteil mit mehr als einem Knopf |
|---|---|
| 99 (bis 1887) | **62,6 %** |
| 116 (bis 1888, seine Strecke) | 40,5 % (seine Zahl) |
| 338 (bis 1897) | **18,3 %** |

Alle drei sind richtig. Die Zahl fällt monoton mit der Partielänge, weil beide
1884er Achsen nur bezahlte Alternativen haben und die Kasse mit den Jahren
ausdünnt. Seine Vergleichszeile — *1350 2,0 · 1600 100 · 1884 40,5 · 1970
22,0* — stellt vier Zahlen nebeneinander, die über **256 · 271 · 116 · 123**
verschiedene Wochen gerechnet sind. Für 1350 gegen 1600 trägt der Vergleich
(2,0 gegen 100 ist kein Längeneffekt); für 1884 gegen 1970 trägt er nicht.
Seine eigene Sperrliste sagt den Satz schon, nur für eine andere Größe: *„Die
Zahl hängt am eigenen Verhalten und muss immer mit der Spielweise genannt
werden."* Sie hängt auch an der Streckenlänge.

**2. „Die 78 Pf sind NICHT das Problem" — halb.** Er hat recht, dass der Kauf
das Brett nicht leerräumt: der Gärraum zu 26 Pf bleibt, das habe ich
nachgestellt. Für **seine eigene Messlatte** — eine Bierentscheidung mit mehr
als einem Knopf — war der Preis aber sehr wohl bindend, und zwar nicht als
Preis, sondern als Bauart: 1350 hatte im ganzen Zeitalter **genau eine**
kostenlose Alternative, und jeder zweite Knopf hing an 78 Pf gegen eine Kasse
mit Median 14 Pf. Die Gegenprobe steht oben und ist eindeutig: **nur den
Zettel geheilt, Daten unverändert → 4,2 % über 118 Wochen, 2,2 % über die
volle Partie.** Sein eigener Befund („der Zettel nimmt sich selbst weg") war
richtig und ist behoben — er war nur nicht die Ursache der 2,0 %. Erst die
zweite Frage hebt sie, auf 99,2 %.

**3. Seine Ursachenanalyse zum Zettel ist richtig, meine war falsch.** Das
gehört hierher, auch wenn es kein Irrtum von ihm ist: *„In NULL Fällen lag ein
fremdes Brett obenauf"* stimmt, mein gemeldeter Befund („fremde Bretter der
FUHRE decken den Kesselzettel") stimmte nicht. Nachgestellt und bestätigt.

---

## ABNAHME UND HEILPRÜFUNG auf dem abgelieferten Stand

`node --check` auf jede geänderte `.js`: bestanden (`sud.js`, `sud-daten.js`,
`sud-zusatz.js`). Vier Epochen geladen, Saat 1350, 1920 × 1080:

| Epoche | `BRAUHAUS.lage.length` | `pageerror` + `console.error` | Kesselzettel | seine vier Züge |
|---|---|---|---|---|
| 1350 | **0** | **0** | 2,145 % der Bühne, im Bild | alle vier `[an]` |
| 1600 | **0** | **0** | 2,145 %, im Bild | alle vier `[an]` |
| 1884 | **0** | **0** | 2,145 %, im Bild | alle vier `[an]` |
| 1970 | **0** | **0** | 2,145 %, im Bild | alle vier `[an]` |

Dazu der harte Zustand (alle sieben fremden Bretter offen, `eng.mjs`): Zettel
in allen vier Epochen im Bild, **4 von 4 Knöpfen bedienbar**, 0 Fehler.

Und die Kosten der Platzsuche, gemessen über 180 Bilder (`takt.mjs`):

| | Median | p95 | Maximum |
|---|---|---|---|
| VORHER, Vorgabestand | 16,7 ms | 26,7 ms | 232 ms |
| NACHHER, Vorgabestand | 16,6 ms | 39,1 ms | 283 ms |
| VORHER, alle Bretter offen | 16,7 ms | 30,8 ms | 134 ms |
| **NACHHER, alle Bretter offen** (die Suche läuft wirklich) | **16,7 ms** | **28,9 ms** | **55 ms** |

Die Suche kostet keine messbare Bildzeit. Der Grund steht im Quelltext: der
Vorfilter `grobFrei()` verwirft eine Stelle mit reiner Rechnung, und nur was
er durchlässt, kostet `elementFromPoint` — und was er durchlässt, hat per
Konstruktion keinen fremden Knopfmittelpunkt im Rechteck, so dass die teure
zweite Hälfte der Prüfung leerläuft.

---

## Angefasste Dateien

Nur der eigene Besitzstand, wie in der Sperrliste verlangt:

| Datei | was |
|---|---|
| `spiel/stuecke/sud.js` | Platzsuche des Zettels · zweite Zeile nach Kasse · `data-verdeckt` / `data-aus-grund` · Schildwortlaut · Kellerprüfung im Feld BEIM WIRT |
| `spiel/stuecke/sud-daten.js` | Achse `wasser` in Epoche 1 (DAS BRAUWASSER) |
| `spiel/stil/sud-zusatz.css` | `.knapp` · `.gedraengt` · `.sud-zpreiszeile` |

`spiel/index.html` nicht angefasst. `spiel/kern/**` nicht angefasst — die
Bitte an den Kern steht oben unter „KERN:". An `preis*.js` und `ton.js` wurde
nichts geändert.

## Werkzeuge und Rohdaten

Alles unter `werkbank/schuss/sud-w4b/`, jedes einzeln nachfahrbar:

| Datei | was sie misst |
|---|---|
| `rettung.mjs` | **unveränderte Kopie des Kritikers** — die Abnahmezahl |
| `vergleich.mjs` | VORHER gegen NACHHER über die gleich lange Strecke |
| `heil.mjs` | vier Epochen: `lage`, Konsolenfehler, Knopfzahlen, Zettelfläche |
| `eng.mjs` | alle sieben fremden Bretter offen — der Zustand, in dem der Zettel vorher immer verschwand |
| `zwang.mjs` | erzwungene Kasse 0 und gesperrte Charge: was in der zweiten Zeile steht, und ob der Zettel überläuft |
| `hoehe.mjs` | `scrollHeight` gegen `clientHeight`, Fläche in Prozent der Bühne |
| `schritt.mjs` | jeder Klick einzeln protokolliert — womit der frühe Partieabbruch aufgeklärt wurde |
| `takt.mjs` | Bildzeit mit und ohne laufende Platzsuche |
| `schild.mjs` · `export.mjs` | Auflage 3: was auf den Schildern steht, und der Fall mit 192.000 DM |
| `reichweite.mjs` | wie weit eine Kernänderung an `B.knopf()` trägt |
| `siegel.mjs` · `ratsche.mjs` | Kopien des Kritikers, auf die neue Festlegung angewandt |
| `vorher-e*.json` · `end-e*.json` · `end2-e1.json` · `nachher-e*.json` · `nurzettel-e1.json` | die Wochenaufnahmen, aus denen jede Zahl nachgerechnet werden kann |

Stände: VORHER `127.0.0.1:8913`, NACHHER `127.0.0.1:8915`, Gegenprobe `8916` —
alle drei eingefrorene Kopien **desselben** Arbeitsbaums (der Stand, wie er
vor dieser Nacharbeit im Baum lag; der Kritiker maß `2953242`, und zwischen
`2953242` und diesem Stand hat sich an keiner Datei des SUD etwas geändert —
das hat er selbst geprüft und in seine Messbedingungen geschrieben). Die
Stände unterscheiden sich **ausschließlich** in `sud.js`, `sud-daten.js` und
`sud-zusatz.css`; alles andere ist byteweise identisch, damit die Arbeit der
zwei anderen Builder an `preis*.js` und `ton.js` die Zahl nicht verschiebt.
8899 (Arbeitsbaum, zwei fremde Builder schreiben darin), 8900 und 8911
(fremde Messstände) wurden nicht benutzt.

---

## ZUSAMMENFASSUNG

| Auflage | Stand | Beleg |
|---|---|---|
| 1 · Der Zettel darf nicht verschwinden, wenn Geld und Entscheidung da sind | **erfüllt** | alle sieben Bretter offen: 4 von 4 Knöpfen bedienbar in allen vier Epochen (vorher 0 von 4); `display:none` von 5,3–7,0 % auf 0,0–4,1 % der Wochen |
| 2 · 1350 braucht mehr als eine Gelegenheit (Ziel ≥ 25 %) | **erfüllt** | **6,8 % → 99,0 %**, dreimal nachgemessen (99,0 · 99,0 · 99,2); Gegenprobe zeigt, dass die zweite Bierfrage sie trägt, nicht die Platzsuche |
| 3 · „trägt Exportbier" darf nicht auf einem Knopf stehen, der keins macht | **erfüllt** | „trägt Xbier" kommt in keiner Epoche mehr im Bild vor; stattdessen „lässt X zu" plus zwei Sätze, die sagen, wo bestellt wird — und eine Zeile, die den Keller nachzählt |
| 4 · Die 1970er Charge mit Frist muss bedienbar sein | **erfüllt** | derselbe Weg wie Auflage 1: `display:none` gilt nur noch für „das eigene Brett liegt offen" |
| 5 · `schalte()` soll Verdeckung nicht in `disabled` umschreiben | **erfüllt, mit Widerspruch in der Sache** | `data-verdeckt` und `data-aus-grund` trennen die drei Gründe; `disabled` bleibt die Summe, weil ein untreffbarer Knopf wirklich keiner ist |

Nicht erledigt und offen benannt: **1884 und 1970 haben dieselbe Bauart wie
1350 vorher** — nur eine kostenlose Alternative im ganzen Zeitalter. Gemessen,
begründet, für die nächste Welle gemeldet.
