# DER SUD — Nacharbeit zu Welle 4

Laufend geschrieben. Was hier steht, ist gemessen, wenn eine Zahl daneben
steht; alles andere ist als Vermutung gekennzeichnet.

## Messbedingungen

| | |
|---|---|
| Urteil, an dem gearbeitet wird | `werkbank/urteile/welle4-der-sud-urteil.md` (BESTEHT MIT AUFLAGE) |
| Vom Kritiker gemessener Commit | 2953242 |
| Eigener Messstand VORHER | eingefrorene Kopie des Arbeitsbaums vor jeder Aenderung, Hafen 8913 |
| Eigener Messstand NACHHER | eingefrorene Kopie nach der Nacharbeit, Hafen 8914 |
| Saat | 1350, Schirm 1920 x 1080 |
| Werkzeug | Playwright/Chromium, echte Mausklicks |

Grund fuer eigene Haefen: 8899 ist der Arbeitsbaum, in den gerade zwei andere
Builder (preis*.js, ton.js) schreiben; 8900 und 8911 tragen fremde Messstaende.

## Stand der Arbeit

- [x] Urteil ganz gelesen (470 Zeilen)
- [x] Quelltext gelesen (sud.js 2043 Z., sud-daten.js 524 Z., sud-zusatz.js, sud*.css)
- [ ] VORHER-Messung, vier Epochen (laeuft)
- [ ] Auflagen 1-5
- [ ] NACHHER-Messung, vier Epochen
- [ ] Abnahme

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
| 1600 | 2 (`schuettung`, `gaerung`) | 5 | **2** (`weizen`/`hafer`, —) | 253 von 254 |
| 1884 | 2 (`kaelte`, `hefe`) | 5 | **1** (`warm`) | 8 von 284 |
| 1970 | 2 (`fuehrung`, `behandlung`) | 6 | **2** (`schoenen`, `filter`) | 6 von 94 |

1600 hat zwei Fragen, und beide haben eine Antwort, die nichts kostet. Deshalb
steht dort in 99,7 % der Wochen mehr als ein Knopf. 1350 hat EINE Frage, und
ihre zweite Antwort kostet 78 Pf bei einer Kasse mit Median 14 Pf. Das ist
keine Preisfrage, das ist eine Bauartfrage — und sie wird hier als solche
behoben.

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

Damit ist Auflage 4 (die 1970er Charge mit Frist) mitbeantwortet: die beiden
Knoepfe `sud:zettel-charge-frei` und `-charge-schnitt` waren in 17 von 34
Wochen nur deshalb nicht zu druecken, weil der Zettel `display:none` trug —
`data-soll-aus` war in allen 17 Faellen 0. Dieser Weg ist zu.

*(wird fortgeschrieben)*
