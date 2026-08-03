# WELLE 5 — DER PREIS, Bau

Laufend geschrieben. Stand der Datei = Stand der Arbeit.

**Gemessener Commit (Vorher-Stand):** `3e6d08c` auf eigenem Hafen 8900
(`werkbank/schuss/aufsicht/messstand.sh 3e6d08c`). Nachgeprueft: die
ausgelieferte `spiel/stuecke/preis.js` auf 8900 ist bitgleich mit
`git show 3e6d08c:spiel/stuecke/preis.js` (md5 `01c0dc1b…`) und beim Start
auch bitgleich mit dem Arbeitsbaum. `spiel/**` ist zwischen `3e6d08c` und
`2f0e4b4` (HEAD) unveraendert — der Messstand misst also denselben Stand, den
der Arbeitsbaum vor meiner ersten Aenderung hatte.

**Die Dateien dieser Runde** (alle in `werkbank/schuss/preis-w5/`):
`hand.mjs` (Referenzhand + Auszaehlung) · `hand-fest.mjs` (dieselbe Hand, nur
die Festlegungsregel getauscht) · `boden.mjs` (Kasse Buchung fuer Buchung) ·
`latte2.mjs` (Latte 2 a/b/c am Bildschirm) · `lauf.sh` (der sequenzielle
Messlauf) · `auswerten.py` · `tafel-schuss.mjs` (die Tafel aufschlagen und
fotografieren — sonst sieht man von diesem Stueck nichts) sowie die Bilder
`e1-tafel-1356.png`, `e2-tafel.png`, `e2-tafel-1606.png`.

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

| Epoche | Referenzhand | festlegungswillige Hand | wann |
|---|---|---|---|
| 1350 | 1 | **1** | 1350/1 |
| 1600 | 1 | **1** | 1600/1 |
| 1884 | 0 | **2** | 1884/1 · 1886/1 |
| 1970 | 0 | **3** | 1970/1 · 1972/1 · 1976/1 |

In 1350 und 1600 aendert der Wille nichts: es ist nur eine da. Damit ist die
Diagnose zweigeteilt und beide Teile sind gemessen — **1350/1600: das Spiel
gibt nicht mehr her. 1884/1970: das Spiel gibt her, die Messhand nahm nicht.**
Diese Trennung ist der Grund, warum unten nur an 1350 und 1600 etwas geaendert
wird und an 1884/1970 ausdruecklich nichts.

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

# WAS GEAENDERT WURDE

Drei Aenderungen, alle in eigenen Dateien
(`stuecke/preis.js`, `stuecke/preis-daten.js`, `stil/preis-zusatz.css`).
Kein `git`. `spiel/index.html` und `spiel/kern/**` unberuehrt.

## 1 — Der Vorgriff auf den Notpfennig (`preis.js`, Michaeli Schritt 7d)

Der Notpfennig war eine SCHONUNG: `buche()` nimmt nie unter ihn. Er wird ein
BODEN: kommt das Haus mit weniger an Michaeli an, schiesst der Rat vor, was
fehlt. **Angeschrieben, nicht geschenkt** — der Betrag geht auf denselben
`Z.rueckstand` wie eine nicht bezahlte Pflicht, kommt naechsten Michaeli mit
dem bestehenden Zehntel Aufschlag wieder (Schritt 2) und laesst den Rat, wenn
der Rueckstand ueber eine Jahreslast waechst, dasselbe Pfand nehmen wie sonst.
Die Strafe bleibt vollstaendig.

Er steht **hinter** Schritt 7c (der Schaetzung), nicht davor. Stuende er
davor, ginge er ueber `Z.hoehe` in den ANSCHLAG, der Anschlag in die
Angebotspreise und damit in den NENNER der Kennzahl — ein Boden, der sich
seinen eigenen Nenner mit anhebt, ist keiner. So hebt er den Zaehler und
laesst den Nenner stehen.

Dazu steht der Notpfennig jetzt mit Betrag am Bildschirm, **bevor** er das
erste Mal greift — er war bisher nirgends genannt (Platz und Begruendung
unter 3a).

Und eine zweite Zeile derselben Aenderung, die leicht zu uebersehen ist:
**geliehenes Geld ist keine Nahrung.** Die Nahrung des Jahres ist die
Veraenderung der Lade von Michaeli zu Michaeli. Ohne Abzug stuende der
Vorgriff des Vorjahrs darin als Zuwachs des Hauses — der Schoss wuerde auf ein
Darlehen erhoben, und der Nachlass fuer ein Fehljahr (`Z.ertrag <= 0`) bliebe
genau dem Haus versagt, fuer das er gemacht ist. `Z.ertrag` zieht den Vorgriff
des Vorjahres deshalb ab (`preis.js`, Michaeli Schritt 1). Das ist keine
Feinheit: ohne sie waere aus dem Boden eine zweite Strafe geworden.

## 2 — Je eine zweite Sprosse fuer 1350 und 1600 (`preis-daten.js`)

Nur dort, wo die Messung eine leere Tafel nachgewiesen hat. 1884 und 1970
bleiben **unberuehrt** — dort bietet das Spiel jedes Jahr etwas Bedienbares an.

| Epoche | neu | Taxe | ab | Wirkung (nur bestehende Mechanik) |
|---|---|---|---|---|
| 1350 | Der eigene Brunnen im Hof | 0,34 × 470 = 160 → 277 Pf | 1355 | `pflichtWeg: 'wasserzins'` |
| 1600 | Der Hofbefreiungsbrief | 0,20 × 2.800 = 560 → 944 fl | 1604 | `pflichtWeg: 'zunftumlage'`, `ansehen −5` |

Die drei bzw. drei grossen Festlegungen bleiben, wo sie sind. Was gefehlt hat,
ist die Sprosse dazwischen, und sie ist so bemessen, dass sie in etwa jedem
zweiten Jahr erreichbar ist und nie geschenkt.

## 3 — `stil/preis-zusatz.css`, und zwei Ueberlaeufe, die ich mir selbst gebaut habe

Beides am Bildschirm gefunden, nicht im Quelltext, und beides steht hier, weil
es Arbeit war, die ich zweimal machen musste.

**(a) Die linke Spalte ist voll.** Der Notpfennig gehoerte inhaltlich in DIE
RECHNUNG. Dort eingebaut hat er in 1600 die Spalte zum Ueberlaufen gebracht:
WAS SCHON STEHT wurde unten abgeschnitten und die vierte Wurzel brach mitten
im Wort ab — derselbe Ueberlauf, der am 3. August schon einmal gemeldet und
durch Kuerzen geheilt worden war. Gegenprobe am eingefrorenen Stand auf 8900:
die Spalte ist dort schon ohne mich randvoll (DIE BIERORDNUNG bricht ab, Bild
`/tmp/…/e2-tafel-VORHER.png`). Der Notpfennig steht jetzt als letzte Zeile in
WAS FÄLLIG WIRD — rechts steht, was faellig wird, und er ist, was NICHT
faellig wird. Dort traegt die Spalte ihn ohne Abschnitt
(`werkbank/schuss/preis-w5/e2-tafel.png`).

**(b) Fuenf Siegelkarten nebeneinander.** 1600 hat vier Festlegungen; mit
meiner fuenfter passen sie nur, solange keine genommen ist — und genau dann
lief der Satz „Preis dieser Amtszeit …" aus der Karte heraus und LEGTE SICH
UEBER den Hinweis „Über der Kasse: es fehlen 6.060 fl" darunter. Die
Zusatzlage setzt seit Runde 1 `flex: 0 1 auto; min-height: 0` auf alle Kinder
der Karte, aber `overflow` stand nur an dreien. Es steht jetzt auch an
`.pr-satz-klein`, `.pr-sperrt` und `.pr-hinweis`: geklippt wird von unten, die
Zahl bleibt oben. Nachgesehen im schwersten Fall (1606, nichts genommen, fuenf
Karten): kein Text liegt mehr auf einem anderen
(`werkbank/schuss/preis-w5/e2-tafel-1606.png`).

**(c)** `.pr-last.pr-last-boden` (die Notpfennigzeile abgesetzt, Zahl gruen —
sie nimmt nicht, sie laesst) und `.pr-zeile.pr-zufluss-geborgt` (der Vorgriff
steht in der Rechnung nicht gruen wie ein Ertrag, sondern in der Tinte des
Rueckstands, mit dem er wiederkommt).

**(d) Eine Regel, die man nicht zu Ende lesen kann, ist keine.** Die erste
Fassung der Brunnen-Regel („…und hängt nicht mehr an der Röhre, die der Rat
sperren kann") brach in 1356 in der letzten Kartenzeile ab. Gekuerzt auf
„Der Wasserzins an die Stadt endet. Für immer. Das Haus schöpft aus eigenem
Grund." (`werkbank/schuss/preis-w5/e1-tafel-1356.png`).

---

# KERN: die eine Zeile, die nicht mir gehoert

`spiel/kern/welt.js:412` in `rechneJahrAb()`:

```js
var unterhalt = Math.round(W.haus.kasse * 0.04 + W.vorrat.plaetze * 0.6);
W.haus.kasse -= unterhalt;                 // ungeprueft
```

`welt.zahle()` zwei Bildschirme darueber prueft die Deckung und gibt `false`
zurueck, wenn die Lade nicht reicht. **Diese Zeile prueft nicht.** Bei Kasse 0
und zwoelf Plaetzen zieht sie −7 ab und die Lade steht auf −7; genau so
entsteht der von der Aufsicht gemessene Stand `E1 = −1`. Es ist die einzige
Stelle im ganzen Spiel, die `haus.kasse` ausserhalb von `zahle`/`nimm`
veraendert — nachgeprueft ueber alle acht `spiel/stuecke/*.js`, kein Stueck
schreibt die Kasse direkt.

**Vorschlag:** dieselbe Deckungspruefung wie in `zahle`, also den Unterhalt auf
die vorhandene Lade begrenzen —

```js
var unterhalt = Math.min(Math.max(0, Math.floor(W.haus.kasse)),
                         Math.round(W.haus.kasse * 0.04 + W.vorrat.plaetze * 0.6));
```

— und den nicht gedeckten Rest wie jede andere unbezahlbare Zeile ins
Protokoll schreiben. Mein Vorgriff faengt den Fall an Michaeli desselben
Wochenwechsels ab (`uhr.js:160`: `rechneJahrAb()` laeuft VOR `sende('jahr')`,
also vor `michaeli()`), aber er repariert nur; die Kasse war in der Zwischenzeit
negativ, und ein anderes Stueck, das in diesem Augenblick `welt.kann()` fragt,
bekommt eine falsche Auskunft.

---

# NACHHER — AUFTRAG 2, und ein Teilbefund, der GEGEN mich ausfaellt

`spielprobe.mjs`, 60 Wochen je Epoche, unveraendert:

| Epoche | vorher | nachher |
|---|---|---|
| 1350 | Kasse **−1** | Kasse **48** = Notpfennig |
| 1600 | Kasse 13 | Kasse **280** = Notpfennig |
| 1884 | Kasse 117 | Kasse **4.200** = Notpfennig |
| 1970 | Kasse 334 | Kasse **50.000** = Notpfennig |

Buchung fuer Buchung, 1350, dieselben 60 Wochen (`boden.mjs`):

| | vorher | nachher |
|---|---|---|
| Kasse am Ende | −1 | **48** |
| tiefster Stand | −1 | **0** |
| Wochen unter null | 1 | **0** |
| Wochen auf oder unter null | 21 | **26** |

**Die letzte Zeile geht gegen mich, und sie steht hier, weil sie gemessen
ist.** Unter null faellt die Kasse nicht mehr; auf null steht sie oefter. Der
Grund steht im Protokoll und ist nicht das, was er zu sein scheint:

```
1351/ 1   13 ->   48    verfall  −8  Sommer: Unterhalt und Abgaben
                        spieler +43  Vorgriff auf den Notpfennig
…
1351/ 9   25 ->    0    spieler −25  Zuvorkommen beim Schenke am Tor
```

Dieselbe Woche im Lauf VORHER:

```
1351/ 9    7 ->    6    spieler −25  Zuvorkommen beim Schenke am Tor (NICHT BEZAHLBAR)
```

Das Haus steht in derselben Woche auf null, weil es zum ersten Mal etwas
KAUFEN konnte. Der Boden hat aus einer toten Woche einen Zug gemacht und das
Geld ist in den Zug gegangen. Die grobe Hand der `spielprobe.mjs` nimmt jede
Woche irgendeinen bedienbaren Knopf und verkauft nie — eine solche Hand
faehrt jede Lade auf null, gleich wie hoch der Boden liegt. Mit der
sorgfaeltig gespielten Linie steht die Kasse in 1350 nie auf null (tiefster
Stand vorher 39 Pf ueber vierzehn Jahre).

**Was der Boden leistet, ist damit genau benannt und nicht mehr:** die Kasse
faellt nicht mehr unter null, und das Haus beginnt jedes Braujahr mit dem
Notpfennig statt mit 5 Pf. Was er NICHT leistet: er haelt eine Hand, die
jeden Pfennig ausgibt, nicht vom Nullpunkt fern. Dafuer braeuchte es einen
WOECHENTLICHEN Vorgriff; der waere eine Geldpumpe in genau dem Mass, in dem
die Hand sie leerzieht, und ich habe ihn nicht gebaut, weil ich seine Wirkung
auf die zweite Messlatte nicht in der verbleibenden Zeit dreifach nachmessen
kann. Er steht als Vorschlag da, nicht als Arbeit.

# LATTE 2 (d) — DIE WELLENZAHL, und was sie in 1970 macht

Sequenziell, ein Browser zur Zeit, 400 Wochen, `saat=1350`, Referenzhand
unveraendert. Runde A (B und C laufen, sie stehen unten nach, sobald sie da
sind):

| Epoche | Welle 4 (Aufsicht, `3e6d08c`) | nachher, Runde A | Jahre < 1× |
|---|---|---|---|
| 1350 | +0,591 | **+0,591** | 0/14 |
| 1600 | +0,231 | **+0,231** | 0/14 |
| 1884 | +0,393 | **+0,393** | 1/14 |
| 1970 | +0,108 | **+0,275** | 0/14 |

**Drei von vier sind Ziffer fuer Ziffer unberuehrt.** 1970 ist es nicht, und
die Ursache ist auf eine einzige Woche zurueckverfolgt.

Die Kennzahlreihe von 1970, Jahr fuer Jahr, gegen die zwoelf Laeufe der
Aufsicht am eingefrorenen Stand:

```
Aufsicht vorher : 2,25 2,36 3,13 2,29 6,41 2,75 2,12 2,30 [1,96 3,29 2,27] 9,14 2,15 4,26
meins   nachher : 2,25 2,36 3,13 2,29 6,41 2,75 2,12 2,30 [2,37 3,69 2,46] 9,14 2,15 4,26
```

Elf von vierzehn Jahren sind identisch. Die drei eingeklammerten sind 1978,
1979, 1980. Die erste Abweichung der ganzen Partie steht in Woche 240:

```
1978/1   Aufsicht  Kasse 41.240      meins  Kasse 50.000
```

50.000 DM ist der Notpfennig von 1970. **Der Boden hat genau einmal gegriffen,
am aermsten Michaeli der Epoche, und zwar exakt auf die Zahl, auf die er
greifen soll.** Was er dabei angehoben hat, ist der TIEFSTE Wert der Reihe:
1,96× auf 2,37×. Das Minimum ueber die ganze Epoche steigt von 1,96 auf 2,12.

**Der Preis dafuer steht daneben und ich rede ihn nicht klein: `rho` geht von
+0,108 auf +0,275.** Die Latte (|rho| < 0,7, hoechstens ein Jahr von sechs
unter 1×) haelt mit Abstand, und kein Jahr faellt unter 1×. Aber die Zahl, die
die Welle 4 erreicht hat, ist in dieser einen Epoche schlechter geworden, und
das ist die unvermeidliche Kehrseite eines Bodens: er hebt die tiefen Jahre,
und die tiefen Jahre lagen hier in der Mitte der Partie. Wer +0,108 halten
will, muss den Boden in 1970 hoeher oder niedriger legen — er darf ihn nicht
wegnehmen, denn 1,96× war die Stelle, an der die Epoche am naechsten am
Stillstand stand.

**Ein Nebenbefund ueber das Geraet, und er bestaetigt die Eichung oben:** mein
PARALLEL gemessener Vorher-Lauf von 1970 wich schon im vierten Jahr von der
Aufsicht ab (2,57 statt 2,29) und lieferte +0,305. Sequenziell stimmen elf von
vierzehn Jahren Ziffer fuer Ziffer, und die drei uebrigen haengen an einer
benannten Woche. Das ist der Unterschied zwischen einer Messung und einem
Wuerfel.

# LATTE 2 (a) (b) (c) — am Bildschirm gezaehlt, nachher

`werkbank/schuss/preis-w5/latte2.mjs`, 62 Wochen je Epoche, grobe Hand
(WEITER plus ein Zug), Zaehlung bei jedem Wochenanfang. **Gelesen wurde
`data-soll-aus`, und die Zahl nach `disabled` steht daneben** (ZUSTAENDIGKEIT
25). „Erreichbar UND aktiv" heisst hier: Preisschild vorhanden UND
`data-soll-aus !== "1"` UND von `elementFromPoint` getroffen.

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| (a) Preisschilder gleichzeitig, Median | 32 | 27 | 37 | 39 |
| (a) davon erreichbar+aktiv, Median — **nach `data-soll-aus`** | 11 | 12 | 12 | 13 |
| (a) dieselbe Zahl — nach `disabled` | 11 | 12 | 12 | 13 |
| (a) Hoechstwert erreichbar+aktiv | 16 | 16 | 20 | 18 |
| (c) Protokollzeilen des Gegners in 62 Wochen | 42 | 37 | 36 | 83 |

**Die beiden Lesarten sind hier deckungsgleich** (bis auf einen einzigen
Hoechstwert in 1350: 16 gegen 15). Das ist die gute Nachricht zu
ZUSTAENDIGKEIT 25 und zugleich der Grund, warum ich beide Zahlen nenne statt
einer.

Zwei Befunde, die dabei abgefallen sind und NICHT meine sind:

* **Knoepfe ganz ohne `data-soll-aus`:** 768 / 714 / 760 Sichtungen in 62
  Wochen. Die Kernaenderung `9868aaa` haengt an `B.knopf()`; was nicht durch
  `B.knopf()` geht, traegt das Merkmal nicht. Wer nach `data-soll-aus` zaehlt,
  zaehlt diese Zuege nicht mit.
* **`disabled` mit `data-soll-aus="0"`** — nach ZUSTAENDIGKEIT 25 ein Fehler,
  kein Zustand: 263 / 313 / 207 Sichtungen. Welchem Stueck sie gehoeren, habe
  ich nicht auseinandersortiert; die Zahl steht hier, damit sie jemand
  auseinandersortiert.

**(b) ist mit dieser Hand nicht zaehlbar, und das ist selbst ein Befund:**
`Siegelknoepfe gleichzeitig: hoechstens 0` in allen vier Epochen. Die
Festlegungen stehen hinter EINEM Klick — `preis:tafel` —, und die Tafel ist
beim Aufschlagen des Spiels zu. Eine Hand, die den Griff nicht findet, sieht
von der unwiderruflichen Entscheidung dieses Stuecks NICHTS. Die sorgfaeltige
Hand oeffnet ihn (`hand.mjs`, Woche 1) und sieht dann drei bis fuenf Karten
nebeneinander. Fuer einen Kritiker mit der Maus heisst das: der Griff oben
rechts ist der einzige Weg zu diesem Stueck.

## Fortschritt

- [x] Werkzeug aufgesetzt, Messstand `3e6d08c` auf 8900, Geraet geeicht
- [x] AUFTRAG 1 — Messung: 1 / 1 / 0 / 0 in 14 Jahren; Zaehler richtig,
      Ereignisse zu selten; in 1884/1970 nahm die Referenzhand nicht
- [x] AUFTRAG 2 — Ursache getrennt: KERN bringt unter null, leerer
      Jahresanfang bringt auf null
- [x] Aenderungen eingebaut, `node --check` auf allen drei .js, TOR OFFEN,
      SPIELPROBE BESTANDEN
- [ ] Latte 2 nachgemessen, drei Laeufe je Epoche, sequenziell *(laeuft)*
