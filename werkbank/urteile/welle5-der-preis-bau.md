# WELLE 5 — DER PREIS, Bau

Laufend geschrieben. Stand der Datei = Stand der Arbeit.

**Gemessener Commit (Vorher-Stand):** `3e6d08c` auf eigenem Hafen 8900
(`werkbank/schuss/aufsicht/messstand.sh 3e6d08c`). Nachgeprueft: die
ausgelieferte `spiel/stuecke/preis.js` auf 8900 ist bitgleich mit
`git show 3e6d08c:spiel/stuecke/preis.js` (md5 `01c0dc1b…`) und beim Start
auch bitgleich mit dem Arbeitsbaum. `spiel/**` ist zwischen `3e6d08c` und
`2f0e4b4` (HEAD) unveraendert — der Messstand misst also denselben Stand, den
der Arbeitsbaum vor meiner ersten Aenderung hatte.

**Messgeraet:** `werkbank/schuss/preis-w5/hand.mjs` — Kopie von
`werkbank/schuss/rueckkopplung-r3/linie.mjs` (nicht angefasst, kopiert),
zusaetzlich ausgezaehlt: `welt.chronik` nach `art`, alle Zeilen mit
`art='festlegung'` mit Jahr/Woche, der ABGELESENE Text des Chronikknopfes, und
in jeder Woche 1 die Sichtlage jedes Siegelknopfes (`disabled` UND
`data-soll-aus` UND Trefferlage, getrennt ausgewiesen — ZUSTAENDIGKEIT 25).

## DAS GERAET IST GEEICHT — und es streut, wenn man es falsch bedient

Vier Laeufe zu 400 Wochen auf `3e6d08c` gegen die veroeffentlichten Zahlen der
Welle 4 (`kern-nachmessung/BEFUND.md`):

| Epoche | Aufsicht Welle 4 | meine Hand, 4 Laeufe PARALLEL | meine Hand, SEQUENZIELL |
|---|---|---|---|
| 1350 | +0,591 | +0,591 | +0,591 |
| 1600 | +0,231 | +0,231 | +0,231 |
| 1884 | +0,393 | +0,354 **(falsch)** | +0,393 |
| 1970 | +0,108 | +0,305 **(falsch)** | — |

**Vier Browser auf vier Kernen sind ein kaputtes Geraet.** Der Lauf E1884
lief 331 Wochen Ziffer fuer Ziffer gleich und wich dann bei 1895/2 ab
(Kasse 16.670 gegen 11.270); sequenziell kommt exakt `Kasse 1757–23789` heraus,
also die Zahl der Aufsicht. `BEHARR=6` und `RUHE=1` machen die Hand
lastunempfindlich, aber nicht lastfrei. **Alle Urteilszahlen unten sind
sequenziell gemessen, ein Browser zur Zeit.** Das ist derselbe Fehler wie am
3. August, nur eine Etage hoeher: damals sah die Hand nach dem Klick nur
einmal hin, heute sehen vier Haende gleichzeitig hin.

---

# AUFTRAG 1 — DER ZAEHLER, DER NIE ZAEHLT

## Befund 1: Der Zaehler ist NICHT blind. Er zaehlt richtig.

Der urspruengliche Verdacht (preis.js zaehlt nur `Z.festGenommen`) ist
**gegenstandslos** — er wurde in Welle 3 bereits behoben. `festlegungenGesamt()`
(preis.js:1430) laeuft ueber `B.welt.chronik` und zaehlt jede Zeile mit
`art === 'festlegung'`, gleich von welchem Stueck.

Abgelesen, nicht nachgerechnet — der Knopftext ueber 400 Wochen, Epoche 1600:

```
Chronik des Hauses · 0 Festlegungen · 0 von dieser Tafel gebaut   (Wochen 1..n)
Chronik des Hauses · 1 Festlegungen · 0 von dieser Tafel gebaut   (ab 1600/1)
```

Der eine Chronikeintrag mit `art='festlegung'` stammt aus DIESEM Stueck; die
zweite Zahl (`von dieser Tafel gebaut`) zaehlt Bauten und steht bewusst
daneben. In 1350 laeuft der Zaehler ebenso von `0 Festlegungen` auf
`1 Festlegungen`, sobald die Zeile geschrieben wird. **Der Zaehler liest, was
dasteht.** Der Knopf war in 412–413 von 420 Wochen am Bildschirm.

## Befund 2: Der Befund der Aufsicht stimmt — es entsteht fast nichts.

Sorgfaeltig gespielte Partie, 400 Wochen = 14 Braujahre, 8 Amtszeiten,
`saat=1350`, Referenzhand unveraendert:

| Epoche | `art='festlegung'` in 14 Jahren | wann |
|---|---|---|
| 1350 | **1** | 1354/1 |
| 1600 | **1** | 1600/1 |
| 1884 | **0** | — |
| 1970 | **0** | — |

Zum Vergleich die ganze Chronik nach Art (E1350, 400 Wochen): `anfang 2 ·
gegner 36 · sud 1 · preis 2 · fuhre 62 · ruf 37 · erbfall 32 · festlegung 1`.

## Befund 3: WARUM — die Preisleiter der Festlegung hat nur eine Sprosse

Das Entscheidende steht in der Sichtlage der Siegelknoepfe, Woche 1 jedes
Jahres (Preis / `disabled` mit `data-soll-aus`). Epoche 1350:

```
1350  Kasse   112  freikauf -1000/AUS(soll-aus=1)  realrecht -800/AUS1  vertrag  -85/AN
1351  Kasse    65  freikauf -1100/AUS1             realrecht -830/AUS1  vertrag  -88/AUS1
1352  Kasse   197  …                                                    vertrag  -92/AN
1353  Kasse   246  …                                                    vertrag  -95/AN
1354  Kasse   393  …                                                    vertrag  -99/AN  <- genommen
1355  Kasse   293  freikauf -1300/AUS1             realrecht  -970/AUS1
1356  Kasse   397  freikauf -1300/AUS1             realrecht -1000/AUS1
…     …            …                               …
1363  Kasse   246  freikauf -1700/AUS1             realrecht -1300/AUS1
```

Ab 1355 steht **neun Jahre lang keine einzige bedienbare Festlegung** auf der
Tafel. Epoche 1600 ist schaerfer: nach `reinheit` (−280, genommen 1600/1)
bleiben `eigentum` −6.700…−11.000, `ratssitz` −5.300…−8.600 und `bierbann`
−7.800…−13.000 gegen eine Michaeli-Lade von 377 bis 997 fl — **dreizehn Jahre,
null bedienbare Festlegungen.**

Der Grund ist arithmetisch und steht in `festBasis()`: der Preis waechst mit
`teuerungJahr^t` (1,040 / 1,038 / 1,048 / 1,045), die Lade waechst nicht mit.
Die Schere geht auf und schliesst sich nie wieder. Es gibt genau eine erreichbare
Sprosse je Epoche (`vertrag` 0,18 · `reinheit` 0,10 · `konvention` 0,22 ·
`privat` 0,11), sie ist EINMALIG, und danach ist die naechste Sprosse das
Sechs- bis Zwanzigfache der Lade.

**Antwort auf die gestellte Frage:** der Zaehler ist richtig, die Ereignisse
sind zu selten — und zwar nicht knapp, sondern um eine Groessenordnung. Nach
Jahr 2 ist die unwiderrufliche Entscheidung in 1350 und 1600 kein Zug mehr,
sondern ein Bild an der Wand.

## Befund 4: In 1884 und 1970 liegt es NICHT am Spiel, sondern an der Hand

Dieselbe Sichtlage, Epoche 1884 und 1970 — hier ist in JEDEM Jahr etwas
bedienbar:

```
1884 Kasse 14250  aktien +11000/AN   bahnvertrag -32000/AUS1  konvention  -9200/AN
1888 Kasse  7012  aktien  +9900/AN   bahnvertrag -38000/AUS1  konvention -11000/AUS1
1897 Kasse 18307  aktien +17000/AN   bahnvertrag -58000/AUS1  konvention -17000/AN
1970 Kasse 86000  konzern +65000/AN  handelsmarke -110000/AUS1  privat -55000/AN
1980 Kasse 64397  konzern +140000/AN genossenschaft -170000/AUS1
```

`aktien` (1884) und `konzern` (1970) tragen ein Preisschild mit **Plus** — sie
bringen Geld herein — und sind in allen vierzehn Jahren aktiv. Die
Referenzhand nimmt sie trotzdem nie, weil ihre eigene Regel
`Math.abs(preis) <= Kasse*0,45` lautet: sie rechnet einen Zufluss als Ausgabe
und lehnt ihn ab. Das ist eine Regel der HAND, nicht des Spiels.

Gegenprobe mit einer zweiten Hand (`hand-fest.mjs`, wortgleich bis auf diese
eine Regel: Zufluss zuerst, sonst die billigste nicht abgeschaltete):

| Epoche | Referenzhand | festlegungswillige Hand |
|---|---|---|
| 1350 | 1 (1354/1) | 1 (1350/1) |
| 1600 | 1 (1600/1) | 1 (1600/1) |
| 1884 | 0 | *(laeuft)* |
| 1970 | 0 | *(laeuft)* |

In 1350 und 1600 aendert der Wille nichts: es ist nur eine da. Damit ist die
Diagnose zweigeteilt und beide Teile sind gemessen — **1350/1600: das Spiel
gibt nicht mehr her. 1884/1970: das Spiel gibt her, die Messhand nahm nicht.**

---

# AUFTRAG 2 — DER KASSENBODEN

## Vorher, nachgestellt (spielprobe.mjs, 60 Wochen, grobe Hand)

```
E1: 60 Wochen, Jahr 1352, Kasse -1
E2: 60 Wochen, Jahr 1602, Kasse 13
E3: 60 Wochen, Jahr 1886, Kasse 117
E4: 60 Wochen, Jahr 1972, Kasse 334
```

Der Befund der Aufsicht ist Ziffer fuer Ziffer nachgestellt.

## Wer nimmt das letzte Geld — Buchung fuer Buchung

`werkbank/schuss/preis-w5/boden.mjs` spielt mit derselben groben Hand und
schreibt jede Protokollzeile mit, die in der Woche dazukam. Die Woche, in der
1350 unter null geht:

```
1352/ 1  Kasse    0 ->   -1
    verfall     -7  Sommer: Unterhalt und Abgaben     <- KERN, welt.js:412
    spieler      6  Der Rat lässt pfänden: Malzboden auf Stelzen
```

Und davor, 1351 Woche 16 bis 30, **fuenfzehn Wochen in Folge Kasse 0**:

```
1351/16  Kasse    0 ->    0
    spieler     -1  Dach, Geschirr, Wache (nicht bezahlbar)
…
1351/30  Kasse    0 ->    0
```

Zwei getrennte Befunde:

1. **Unter null bringt der KERN.** `spiel/kern/welt.js:412` rechnet
   `unterhalt = round(kasse*0,04 + plaetze*0,6)` und zieht ihn danach
   ungeprueft ab (`W.haus.kasse -= unterhalt`). Bei Kasse 0 und 12 Plaetzen
   sind das −7, ohne jede Deckungspruefung — `welt.zahle()` daneben prueft,
   diese Zeile nicht. Kein einziges Stueck schreibt `haus.kasse` direkt
   (nachgeprueft ueber alle acht `stuecke/*.js`). **Das ist eine
   Kernaenderung, sie steht unten als Absatz „KERN:".**
2. **Auf null bringt der leere Jahresanfang, und DAS ist meins.** Der
   Notpfennig (`preis-daten.js`: 48 / 280 / 4.200 / 50.000) ist heute nur eine
   Schonung: `buche()` nimmt nie unter ihn. Kommt das Haus aber schon MIT
   weniger an Michaeli an, gibt der Notpfennig ihm nichts — es beginnt das
   Braujahr mit 5 Pf und steht in Woche 16 bei null. Der Kommentar im
   Quelltext verspricht genau das Gegenteil („dem Handwerker blieb sein
   Werkzeug und der Vorrat, den er zum Weiterarbeiten brauchte").

Reihenfolge nachgeprueft (`kern/uhr.js:160`): `rechneJahrAb()` (der Sommer,
und damit der Kern-Abzug) laeuft VOR `B.sende('jahr')`, also vor
`michaeli()`. Ein Boden, den DER PREIS an Michaeli einzieht, faengt den
Kern-Abzug desselben Wochenwechsels noch im selben Zug ab.

---

## Fortschritt

- [x] Werkzeug aufgesetzt, Messstand `3e6d08c` auf 8900, Geraet geeicht
- [x] AUFTRAG 1 — Messung: 1 / 1 / 0 / 0 in 14 Jahren; Zaehler richtig,
      Ereignisse zu selten; in 1884/1970 nahm die Referenzhand nicht
- [x] AUFTRAG 2 — Ursache getrennt: KERN bringt unter null, leerer
      Jahresanfang bringt auf null
- [ ] Aenderungen einbauen
- [ ] Latte 2 nachgemessen, drei Laeufe je Epoche, sequenziell
