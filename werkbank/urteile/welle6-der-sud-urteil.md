# DER SUD — blindes Urteil, Welle 6

*(IN ARBEIT — wird laufend fortgeschrieben.)*

**Gemessener Commit:** `05af148` ("Nachmessung: die Kernaenderung laesst die
Wellenzahl unberuehrt"), eingefroren mit
`werkbank/schuss/aufsicht/messstand.sh HEAD 8917` →
`MESSSTAND 05af148 auf http://127.0.0.1:8917/spiel/ (Fassung geprueft)`.
Alle Zahlen von diesem Hafen, alle Laeufe SEQUENZIELL, nie zwei Browser
gleichzeitig.

**Werkzeuge** (unter `werkbank/schuss/sud-w6/`):
* `blick.mjs` — Aufnahme eines Bretts; jeder Knopf mit `elementFromPoint` auf
  dem KNOPF, dazu `data-soll-aus`, `data-aus-grund`, `data-verdeckt`,
  `data-preis`.
* `sudhand.mjs` — eine sorgfaeltig gespielte Partie ueber 400 Wochen =
  14 Braujahre. Die Wirtschaftshand ist Zeile fuer Zeile die aus
  `werkbank/schuss/rueckkopplung-r3/linie.mjs` (kopiert, nicht angefasst);
  dazu die Sudgriffe. `STIL=reich` nimmt auf jeder Achse die letzte (teuerste,
  meist unwiderrufliche) Karte, `STIL=arm` die letzte kostenlose.
* `siegel.mjs` — kauft die Festlegung in der laufenden Partie mit der Maus und
  versucht danach auf sechs Wegen zurueck.
* `heil.mjs` — Ladeprobe, `BRAUHAUS.lage`, Konsolenfehler, Textueberlauf,
  zweimal gemessen: beim Laden und nach 30 gespielten Wochen.
* `linie.mjs` — Kopie des Vorbilds, unveraendert, fuer die zweite Latte (d).

---

## Das Brett: was ueberhaupt zur Wahl steht

Aus `spiel/stuecke/sud-daten.js` ausgelesen und am Schirm nachgeprueft
(`blick.mjs`, Woche 1 jeder Epoche):

| Epoche | Achse (`data-zug`) | Karten | mit Preis | `fest` (unwiderruflich) |
|---|---|---|---|---|
| 1350 | `sud:wuerze:{grut,sack,brief}` | 3 | 1 | `brief` 78 Pf |
| 1350 | `sud:wasser:{bach,brunnen,roehre}` | 3 | 1 | `roehre` 30 Pf |
| 1600 | `sud:schuettung:{rein,weizen,hafer}` | 3 | **0** | **keine** |
| 1600 | `sud:gaerung:{ober,keller}` | 2 | 1 | `keller` 260 fl |
| 1884 | `sud:kaelte:{natureis,warm,maschine}` | 3 | 1 | `maschine` 9.800 M (`sperrt: ['natureis']`) |
| 1884 | `sud:hefe:{betrieb,reinzucht}` | 2 | 1 | `reinzucht` 3.400 M |
| 1970 | `sud:fuehrung:{erfahrung,labor,rechner}` | 3 | 2 | `labor` 42.000, `rechner` 118.000 DM |
| 1970 | `sud:behandlung:{natur,schoenen,filter,pasteur}` | 4 | 2 | `pasteur` 74.000 DM (`filter` 26.000 ist `einmal`, nicht fest) |

Dazu in jeder Epoche wiederkehrend: `sud:anstich-jung` / `sud:anstich-alt`
(zwei Knoepfe an derselben Frage), `sud:hefe-fuehren`, `sud:gaerraum` (mit
Preisschild), zeitweise `sud:charge-frei:<nr>` / `sud:charge-schnitt:<nr>`, und
der Kesselzettel `sud:zettel-anstich`, `sud:zettel-hefe-fass`,
`sud:zettel-wechsel-frei`, `sud:zettel-wechsel-kauf`.

Alle vier Epochen laden mit `BRAUHAUS.lage.length === 0` und **0**
Konsolenfehlern.

---

## Epoche 1350 — sorgfaeltig gespielt, `STIL=reich`, 400 Wochen / 14 Braujahre

`/tmp/sudw6/e1-reich.json`, Beleg `werkbank/schuss/sud-w6/`.
0 Konsolenfehler, kein Abbruch, `lage 0` am Ende, Kasse 0–144 Pf.

**1 Wird etwas entschieden?**

| | Zahl |
|---|---|
| Wochen, in denen `sud:wuerze:*` ≥2 Karten aktiv UND von der Maus erreichbar hatte | **14 von 400** |
| dito `sud:wasser:*` | **1 von 400** |
| Wochen mit `sud:anstich-jung` und `sud:anstich-alt` zugleich offen | 362 von 400 |
| Wochen mit `sud:charge-frei`/`-schnitt` zugleich | 0 von 400 |
| Wochen mit zwei Umstellungen am Kesselzettel zugleich | 0 von 400 |
| Preisschilder im SUD zugleich aktiv+erreichbar | 0 in 378 W · 1 in 20 W · **2 in 2 W** |

Genommen wurden: `sud:wasser:roehre` (1350/1, 30 Pf = 39 % der Barschaft),
`sud:wuerze:brief` (1350/24, 78 Pf = **54 % der Barschaft**), `sud:gaerraum`
2× (59 Pf), `sud:hefe-fuehren` 32×, `sud:anstich-jung` 339×.

**Was sich danach messbar aendert:** Kesselzettel am Ende:
`höchstens Starkbier · Zeug 98 % · Fass ×1,19`; Brett: zwei Siegelzeilen
(`Ratsbrief, gesiegelt: …`, `Röhrenrecht, verbrieft: …`). Kasse nach
`sud:wuerze:brief`: acht Wochen 69 68 71 74 73 72 48 24, Kennzahl faellt in
diesem Fenster auf **0,53**, das Haus spielt aber weitere 13 Braujahre.

**3 Sichtbar, aber bedienbar?** 5.224 Knopfablesungen:

| Kreuztabelle (nur abgeschaltete Knoepfe) | Zahl |
|---|---|
| Brett · `grund=spiel` · `soll=1` · Maus trifft | 2.926 |
| Brett · `grund=spiel` · `soll=1` · trifft nicht | 27 |
| Brett · `grund=brett-zugeklappt` · `soll=1` · trifft | 161 |
| Brett · `grund=brett-zugeklappt` · **`soll=0`** · **Maus trifft** | **39** |
| Brett · `grund=brett-zugeklappt` · `soll=0` · trifft nicht | 8 |
| Zettel · `grund=brett-offen` · `soll=0` · trifft nicht | 770 |
| Zettel · `grund=brett-offen` · `soll=1` · trifft nicht | 382 |
| Zettel · `grund=spiel` · `soll=1` | 31 |
| `data-verdeckt="1"` | **0** |

Also: **kein einziger Knopf mit `data-verdeckt="1"`** in 400 Wochen. Die
`soll=0`-Abschaltungen tragen alle einen genannten Grund
(`brett-zugeklappt` bzw. `brett-offen`), keinen stillen.

## Epoche 1350 — dieselbe Epoche, andere Hand: `STIL=arm`, nie gekauft

`/tmp/sudw6/e1-arm.json`. 400 Wochen, 14 Braujahre, 0 Fehler, kein Abbruch.

| | reich | arm |
|---|---|---|
| `sud:wuerze:*` ≥2 Karten offen | 14/400 W | **103/400 W** |
| `sud:wasser:*` ≥2 Karten offen | 1/400 W | **311/400 W** |
| Preisschilder zugleich aktiv+erreichbar | 0 in 378 W, 1 in 20 W, 2 in 2 W | 0 in 55 W, 1 in 238 W, **2 in 106 W, 3 in 1 W** |
| Kesselzettel: zwei Umstellungen zugleich | 0/400 W | 38/400 W |
| Festlegungen gekauft | 2 (30 + 78 Pf) | 0 |
| Kasse ueber die Partie | 0–144 | 0–232 |
| Faesser gesamt (`gesamtFass`) | **1.027** | 945 |
| `guete` am Ende | **98** | 90 |
| Anzeigen (`jahrAnzeige`) | 0 | **2** |

**Das ist der Kern des Stuecks, in Zahlen:** wer die unwiderrufliche Karte
kauft, nimmt sich die Frage weg (14 bzw. 1 statt 103 bzw. 311 Wochen mit
offener Wahl) und bekommt dafuer 8,7 % mehr Fass, 8 Punkte Zeug und keine
Anzeige. Wer nicht kauft, behaelt die Wahl 311 von 400 Wochen — und wird
zweimal angezeigt.

**4 Traegt die Partie ein eigenes Bier?** Ja, und es steht am Schirm:

* reich, Kesselzettel 1363: `Offen gehopft, mit Hopfenbrief · Röhrenrecht an
  der Quelle · höchstens Starkbier · Zeug 98 % · Fass ×1,19`; dazu zwei
  Siegelzeilen auf dem Brett (`Ratsbrief, gesiegelt: …`, `Röhrenrecht,
  verbrieft: …`).
* arm, Kesselzettel 1363: `Hopfen im Sack, heimlich · Wasser aus dem
  Ziehbrunnen · höchstens Starkbier · Zeug 90 % · Fass ×1,15`, **keine**
  Siegelzeile, dafuer die beiden offenen Umstellungen (`Grut vom Grutamt ·
  nur Grutbier`, `Röhrenrecht an der Quelle −30 Pf · lässt Starkbier zu`).

Der DECKEL (`höchstens Starkbier`) ist in beiden Partien derselbe — beide
Wege erreichen `hoechst 3`. Verschieden sind Name, Zeug, Fassfaktor und die
Anzeigen.

**Die Klemme (Befund zu Frage 3).** In `reich` 24 von 400 Wochen, in `arm`
38 von 400 Wochen steht das Sudbrett vollstaendig im Bild (gemessen
902 × 645…710 px an Position 23/124), das Brett traegt **nicht**
`stadt-zugeklappt` (`brettKlassen: "sud-brett"`), `elementFromPoint` auf dem
KNOPF liefert den Knopf (`SPAN.wort` in ihm) — und trotzdem sind alle seine
Knoepfe `disabled` mit `data-aus-grund="brett-zugeklappt"`, 144 davon (arm)
mit `data-soll-aus="0"`, also gegen den Willen des Spiels. Belege:
`/tmp/sudw6-klemmer-e1-{reich,arm}-*.png`.

**Aber es kostet keinen Zug.** In `arm` war in **38 von 38** dieser Wochen der
Kesselzettel lebendig, mit `sud:zettel-wechsel-frei` (0) und
`sud:zettel-wechsel-kauf` (−30 Pf) aktiv und von der Maus erreichbar. In
`reich` in 21 von 24; in den drei uebrigen (Wochen 90, 120, 210) trugen alle
Zettelknoepfe `data-soll-aus="1"` — da sagte das Spiel selbst nein.

## Epoche 1600 — `STIL=reich`, 400 Wochen / 14 Braujahre

`/tmp/sudw6/e2-reich.json`. 0 Fehler, kein Abbruch, `lage 0`, Kasse 124–955 fl.

| | Zahl |
|---|---|
| `sud:schuettung:*` ≥2 Karten aktiv+erreichbar | 343/400 W — **davon mit Preisschild 0** |
| `sud:gaerung:*` ≥2 Karten aktiv+erreichbar | **0/400 W** (hoechstens **eine** Karte zugleich) |
| Preisschilder im SUD zugleich aktiv+erreichbar | 0 in **364 W**, 1 in 35 W, **2 in genau 1 W** |
| Anstich jung/alt zugleich | 326/400 W |
| Charge frei/verschneiden zugleich | 0/400 W |
| Festlegung genommen | `gaerung:keller`, 1601/9, **260 fl = 53 % der Barschaft** |

Das ist der duennste Befund der vier Epochen: **DIE GÄRUNG ist nie eine Wahl
zwischen zwei Knoepfen** — `ober` laeuft und ist deshalb abgeschaltet, `keller`
steht allein daneben; nach dem Kauf ist `ober` verdraengt. Und **DIE
SCHÜTTUNG hat in 1600 kein einziges Preisschild** (`rein`, `weizen`, `hafer`
kosten alle 0). Ueber vierzehn Braujahre traegt DER SUD in 1600 also in
364 von 400 Wochen **kein** Preisschild, und in genau **einer** Woche zwei.

Nach dem Kauf: Kasse acht Wochen 256 280 304 327 351 349 347 352, Kennzahl
1,19–1,93 — die Kasse traegt danach weiter.

Bier am Schirm 1613: `Mit Hafer und Wicke gestreckt · Kellergärung im
Felsenkeller · höchstens Schankbier · Stellhefe 62 % · Fass ×1,01`, dazu eine
Siegelzeile `Bauabnahme der Zunft: Kellergärung im Felsenkeller.` (Diese Hand
nimmt auf jeder Achse die LETZTE Karte der Reihe; in 1600 ist das auf der
Schuettung `hafer` — kostenlos, aber mit `hoechst 1`. Der Deckel faellt
dadurch auf `Schankbier`. Der Vergleich mit einer Hand, die `rein` behaelt,
steht weiter unten beim Siegelangriff.)

Klemme in 1600: **53 von 400 Wochen**, 183 Ablesungen `soll=0` + `disabled` +
Maus trifft, davon an den Entscheidungskarten selbst:
`sud:schuettung:rein` 39×, `sud:schuettung:weizen` 39×,
`sud:gaerung:keller` 4×. In **53 von 53** dieser Wochen war der Kesselzettel
lebendig.

## Ergaenzung zu 1350: was die Wahl im Ergebnis wert ist

Beide Partien, Woche fuer Woche abgelesen (`reihe`):

| | reich (kauft beide Siegel) | arm (kauft nie) |
|---|---|---|
| Kasse min / median / max / Mittel | 0 / 71 / 144 / 68,9 | 0 / 63 / 232 / 64,5 |
| Sude gesamt | 326 | **351** |
| Fass gesamt | **1.027** | 945 |
| eingelegt gesamt (`gesamtLegte`) | **325** | 276 |
| `guete` am Ende | **98** | 90 |
| Anzeigen | **0** | 2 |

Die arme Hand braut MEHR (351 Sude) und liefert WENIGER (945 Fass). Das ist
die Folge der Wahl, und sie ist am Fassfaktor am Kesselzettel abzulesen
(×1,19 gegen ×1,15).

## Epoche 1600 — `STIL=arm` (kauft nie)

`/tmp/sudw6/e2-arm.json`. 400 W, 14 J, 0 Fehler, Kasse 148–812 fl.
`schuettung` ≥2 offen in 347/400 W (0 Preisschilder), `gaerung` **0/400 W**.
Preisschilder zugleich: 0 in 84 W, **1 in 315 W**, 2 in 1 W.
Bier 1613: `Mit Hafer und Wicke gestreckt · Obergärig, warm geführt ·
höchstens Schankbier · Stellhefe 98 % · Fass ×1,19`, keine Siegelzeile, und —
sauber — am Kesselzettel steht der Preis der ungekauften Festlegung im
Klartext: `Kellergärung im Felsenkeller 260 fl — die Kasse trägt es noch
nicht.`

**Ein harter Befund an 1600.** Die 260 fl der einen Festlegung haben in dieser
Partie am Bier NICHTS geaendert: beide Partien enden mit `höchstens
Schankbier`, weil `schuettung:hafer` (kostenlos, `hoechst 1`) den Deckel setzt
und der Deckel das MINIMUM ueber die Achsen ist. Die bezahlte Karte hebt
nicht, sie deckelt nur — das steht auch so am Brett
(`Dieses Brett deckelt sie — es hebt sie nie`, sud.js:1325). Das ist
konsequent, aber es heisst: wer in 1600 auf einer Achse die schlechte
KOSTENLOSE Karte nimmt, macht die teuerste Festlegung der Epoche wertlos, und
die Kasse ist trotzdem leer.

## Epoche 1884 — `STIL=reich`

`/tmp/sudw6/e3-reich.json`. 400 W, 14 J, 0 Fehler, Kasse 209–18.682 M.

| | Zahl |
|---|---|
| `sud:kaelte:*` ≥2 Karten aktiv+erreichbar | 49/400 W, **alle mit Preisschild** |
| `sud:hefe:*` ≥2 Karten aktiv+erreichbar | **0/400 W** (nur eine Karte zugleich) |
| Preisschilder zugleich aktiv+erreichbar | 0 in 118 W, 1 in 233 W, **2 in 48 W, 3 in 1 W** |
| Anstich jung/alt zugleich | 309/400 W |
| Charge frei/verschneiden | 0/400 W (`ep().charge` gibt es nur in 1970) |

Festlegungen, die diese Hand wirklich genommen hat:
* `hefe:reinzucht` 1884/1 fuer **3.400 M = 30 %** der Barschaft
* `kaelte:maschine` **erst 1896/1** fuer **9.800 M = 52 %** der Barschaft —
  also im 13. von 14 Braujahren; zwoelf Jahre lang lief das Haus auf
  `natureis`.

Dazu `sud:gaerraum` 5× fuer zusammen 17.182 M, und der Preis waechst mit der
Teuerung: 1.900 → 2.470 → 3.211 → 4.174 → 5.427 M. Nach jedem Kauf traegt die
Kasse weiter (Kennzahl nach `kaelte:maschine`: 2,12–2,42).

Bier 1897: `Lindesche Kältemaschine · Reinzuchthefe nach Hansen · **höchstens
Exportbier** · Führung 98 % · Fass ×1,19`, dazu zwei Siegelzeilen.
Kennzahl 1,02–8,35 ueber 14 Jahre, **0 Jahre unter 1×**, Spearman −/+0,134.

## Epoche 1884 — `STIL=arm`

`/tmp/sudw6/e3-arm.json`. 400 W, 14 J, 0 Fehler, Kasse 13–14.250 M.
`kaelte` ≥2 offen nur 2/400 W (die Hand stellt in Woche 1 auf `warm` und
`warm` verdraengt nichts, aber `natureis` ist danach die einzige
kostenlose Gegenkarte und laeuft nicht) — Preisschilder zugleich: **2 in 73 W,
3 in 2 W**.
Bier 1897: `Ohne Kühlung durchgären lassen · Betriebshefe aus dem Bottich ·
**höchstens Schankbier** · Führung 79 % · Fass ×1,09`, keine Siegelzeile,
dafuer am Zettel `Natureis aus dem Fluss — lässt Exportbier zu` und
`Reinzuchthefe nach Hansen −3.400 M — lässt Exportbier zu`.

Damit steht der Unterschied zwischen den beiden 1884-Partien schwarz auf weiss
am Schirm: **Exportbier / 98 % / ×1,19** gegen **Schankbier / 79 % / ×1,09**.

## Epoche 1970 — beide Haende

`/tmp/sudw6/e4-reich.json`, `/tmp/sudw6/e4-arm.json`. Je 400 W, 14 J, 0 Fehler,
kein Abbruch, `lage 0`. Kasse 622–129.404 bzw. 304–112.763 DM.

| | reich | arm |
|---|---|---|
| `sud:fuehrung:*` ≥2 Karten aktiv+erreichbar | **0/400 W** | **0/400 W** |
| `sud:behandlung:*` ≥2 Karten aktiv+erreichbar | 322/400 W, alle mit Preis, bis zu **3** | 333/400 W, bis zu 3 |
| Preisschilder zugleich aktiv+erreichbar | 3 in 189 W, **4 in 87 W** | 3 in 241 W, 4 in 48 W |
| `sud:charge-frei`/`-schnitt` zugleich | 9/400 W | **59/400 W** |
| `sud:fuehrung:labor` (42.000, fest) aktiv+erreichbar | 276/400 W | 289/400 W |
| `sud:fuehrung:rechner` (118.000, fest) aktiv+erreichbar | **0/400 W** | **0/400 W** |
| `sud:behandlung:pasteur` (74.000, fest) aktiv+erreichbar | 87/400 W | 48/400 W |
| Festlegungen genommen | **0** | **0** |

1970 ist die reichste Epoche des Stuecks: bis zu **vier** Preisschilder
nebeneinander, aktiv und von der Maus erreichbar, und die einzige mit der
Chargenwahl (`ep().charge` steht nur in `SUD_DATEN.epochen[4]`).

Zwei Befunde:

1. **`sud:fuehrung:rechner` — 118.000 DM, die teuerste unwiderrufliche Karte
   des ganzen Spiels — war in 800 gemessenen Wochen NIE aktiv und
   erreichbar.** `B.welt.kann` ist schlicht `kasse >= betrag`
   (`kern/welt.js:261`); die Kasse stand in nur 2 von 400 Wochen ueber
   118.000, und in keiner davon war die Karte offen. Eine Wahl, die eine
   sorgfaeltig gespielte Partie ueber vierzehn Braujahre nicht einmal
   ANFASSEN kann, ist fuer Latte (b) keine.
2. **DIE FÜHRUNG ist nie eine Wahl zwischen zwei Knoepfen**: `erfahrung`
   laeuft (abgeschaltet als „läuft"), `labor` steht offen, `rechner` ist zu
   teuer — hoechstens eine Karte zugleich, in 400 von 400 Wochen.

Bier 1983: reich `Nach Erfahrung des Braumeisters · Naturtrüb, unfiltriert ·
höchstens Pilsner · Streuung ±7 % · Fass ×1,19`; arm `… · Schönen mit
Kieselsol · höchstens Pilsner · Streuung ±8 % · Fass ×1,16`. Beide bleiben bei
`höchstens Pilsner`, weil `fuehrung:erfahrung` mit `hoechst 2` deckelt.

**Der ehrliche `verdeckt`-Fall.** 1970 ist die einzige Epoche, in der
`data-verdeckt="1"` ueberhaupt auftritt: 38 Ablesungen (reich) und 14 (arm),
alle mit `data-aus-grund="verdeckt"`, `data-soll-aus="0"` und **nicht** von der
Maus erreichbar. Das ist genau der Fall, den ZUSTAENDIGKEIT 25 einen Fehler
nennt — und das Stueck meldet ihn selbst an, statt ihn zu verschweigen.

## Frage 1 zusammengezogen — wie oft steht eine Bierfrage mit mehr als einem Knopf an?

Je Epoche, 400 Wochen = 14 Braujahre, sorgfaeltig gespielt, beide Haende.
Gezaehlt wird nur, was AKTIV **und** von der Maus erreichbar ist
(`elementFromPoint` auf dem Knopf).

| Epoche | Achse | ≥2 Karten offen (reich / arm) | davon mit Preisschild |
|---|---|---|---|
| 1350 | `wuerze` | 14 / 103 von 400 | 14 / 103 |
| 1350 | `wasser` | 1 / 311 von 400 | 1 / 311 |
| 1600 | `schuettung` | 343 / 347 von 400 | **0 / 0** |
| 1600 | `gaerung` | **0 / 0** von 400 | — |
| 1884 | `kaelte` | 49 / 2 von 400 | 49 / 2 |
| 1884 | `hefe` | **0 / 0** von 400 | — |
| 1970 | `fuehrung` | **0 / 0** von 400 | — |
| 1970 | `behandlung` | 322 / 333 von 400 | 322 / 333 |

**Drei von acht Achsen sind in 800 gemessenen Wochen NIE eine Wahl zwischen
zwei Knoepfen** — `gaerung` (1600), `hefe` (1884), `fuehrung` (1970). Der
Grund ist in allen drei Faellen derselbe und steht in `sud.js:1094`:
`aus: !!kannNicht || (ist && !offenPreis)` — die laufende kostenlose Karte ist
abgeschaltet („läuft"), und wo nur zwei Karten stehen, bleibt genau eine
druckbar. Es ist ein Knopf mit Preisschild, kein Gegenueber.

Preisschilder DES SUD nebeneinander, aktiv und erreichbar (Latte 2 a):

| Epoche / Hand | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| 1350 reich | 378 | 20 | 2 | – | – |
| 1350 arm | 55 | 238 | 106 | 1 | – |
| 1600 reich | **364** | 35 | 1 | – | – |
| 1600 arm | 84 | 315 | 1 | – | – |
| 1884 reich | 118 | 233 | 48 | 1 | – |
| 1884 arm | 247 | 78 | 73 | 2 | – |
| 1970 reich | 60 | 18 | 46 | **189** | **87** |
| 1970 arm | 49 | 18 | 44 | **241** | 48 |

1970 traegt die Latte, 1350 und 1884 tragen sie halb, **1600 traegt sie
nicht**: dort steht in 364 von 400 Wochen kein Preisschild am Sudbrett und in
genau einer Woche zwei.

Die wiederkehrende Wahl `sud:anstich-jung` (+14) gegen `sud:anstich-alt` (+6)
steht dagegen in 309–369 von 400 Wochen offen, in allen vier Epochen. Sie
KOSTET auch etwas — `B.welt.menge(1)`, ein Fass, und beim jungen Fass „es wäre
noch lange zu verkaufen gewesen" (`sud.js:1428`) — aber **beide Knoepfe tragen
`data-preis` 0**. Fuer eine Zaehlung nach Preisschildern ist sie unsichtbar.

## Frage 2 — HAELT DAS SIEGEL?

`werkbank/schuss/sud-w6/siegel.mjs`: die Festlegung wird in der laufenden,
sorgfaeltig gespielten Partie MIT DER MAUS gekauft (200 Wochen Vorlauf, eine
Hand, die auf jeder Achse die teuerste bezahlbare Karte nimmt und nie
zurueckgeht). Danach wird auf sechs Wegen zurueckversucht, und danach noch
sechs Wochen weitergespielt.

### 1350 — `/tmp/sudw6/siegel2-e1-angriff.json`

Gekauft (mit der Maus): `wasser:roehre` und `wuerze:brief`, beide in
`SUD_DATEN` mit `fest: true`. **18 Versuche, zurueckgekommen: 2 — beide auf
Weg 6.**

| Weg | Ergebnis |
|---|---|
| 1 Maus auf jede Geschwisterkarte (`bach`, `brunnen`, `grut`, `sack`) | Knopf steht da, `hit: true`, aber `disabled` mit `data-soll-aus="1"` und `data-aus-grund="spiel"` — **das Spiel sagt nein, und sagt es auch** |
| 2 Kesselzettel `sud:zettel-wechsel-frei` / `-kauf` / `-frei2` | **die Knoepfe existieren gar nicht mehr** (`fehlt: true`) — die Kandidatenliste in `sud.js:1675` ueberspringt jede verdraengte Karte |
| 3 Tastatur (Leertaste/Eingabe) | `kern/kopf.js:206` kennt nur `[data-zug="weiter"]` — kein Weg |
| 4 `disabled` entfernt + `el.click()` + `dispatchEvent(MouseEvent)` | beide Ereignisse liefen (`el.click() gelaufen`, `MouseEvent gelaufen`) — `verfahren` blieb `roehre` bzw. `brief` |
| 5 echte Maus auf den ENTSPERRTEN Knopf | `verfahren` blieb `roehre` bzw. `brief` |
| 6 `BRAUHAUS.sud.zustand().verfahren[achse] = …` aus der Konsole | **kommt zurueck** (`roehre → bach`, `brief → grut`) |

Weg 4 und 5 scheitern nicht am Knopf, sondern an `waehle()` selbst
(`sud.js:939`: `if (verdraengt(a, o)) return;`). Der Riegel liegt also HINTER
dem `disabled`, nicht darin — das ist die richtige Stelle. Weg 6 ist kein Weg
der Maus, sondern die Konsole: `B.sud.zustand()` gibt `Z` als Referenz heraus
(`sud.js:931`). Das ist keine Luecke des Spiels, aber es sei genannt, weil ein
Kritiker sonst danach sucht.

Nach sechs weiteren gespielten Wochen: `fest` und `verfahren` unveraendert,
beide Siegelzeilen stehen weiter am Brett.

### 1600, 1884, 1970 — dieselben sechs Wege

| Epoche | mit der Maus gekauft | Wege | zurueckgekommen |
|---|---|---|---|
| 1600 | `gaerung:keller` 260 fl **[fest]** | 7 | **1** — nur Weg 6 (Konsole) |
| 1884 | `hefe:reinzucht` 3.400 M **[fest]** | 7 | **1** — nur Weg 6 (Konsole) |
| 1970 | `fuehrung:labor` 42.000 DM **[fest]** | 10 | **1** — nur Weg 6 (Konsole) |
| 1970 | `behandlung:filter` 26.000 DM **[nur `einmal`, NICHT fest]** | 10 | 5 — Maus, synthetischer Klick, Konsole |

Die vierte Zeile ist **kein** Siegelbruch. `behandlung:filter` traegt in
`sud-daten.js` `einmal: true` und **nicht** `fest: true`; sein Schild heisst
darum „einmal zu zahlen" und nie „unwiderruflich" (`sud.js:1109–1113`). Wer
einmal bezahlt hat, darf danach wechseln — das ist die Ansage, und sie haelt.

**Alle vier Karten, die das Wort „unwiderruflich" tragen und die eine gute
Hand in vierzehn Braujahren wirklich kauft, halten auf jedem Weg der Maus,
der Tastatur und des synthetischen Klicks.** Der einzige Rueckweg ist die
Konsole.

Die Ratsche steht auch am Schirm: nach `fuehrung:labor` heisst die Siegelzeile
in 1970 nicht „entschieden", sondern
`Labor eingerichtet: … Zurück geht es nicht — nur noch weiter hinauf.` —
und `sud:fuehrung:rechner` steht daneben mit `−118.000 DM`, `data-soll-aus="1"`
(Kasse 86.920), also lesbar und ehrlich gesperrt.

## Frage 5 — ist es heil?

`werkbank/schuss/sud-w6/heil.mjs`, je Epoche zweimal gemessen: beim Laden mit
aufgeschlagenem Sudbrett und nach 30 sorgfaeltig gespielten Wochen.

| Epoche | `BRAUHAUS.lage.length` (laden / gespielt) | Konsolenfehler | Kaesten mit ueberlaufendem Inhalt, gesamt / davon SUD |
|---|---|---|---|
| 1350 | 0 / 0 | **0** | 29 / 6 |
| 1600 | 0 / 0 | **0** | 27 / 4 |
| 1884 | 0 / 0 | **0** | 25 / 5 |
| 1970 | 0 / 0 | **0** | 31 / 7 |

Dazu kommen 0 Konsolenfehler in allen acht 400-Wochen-Partien und in allen
vier Siegelangriffen — **kein einziger `pageerror`, kein einziger
`console.error` in ueber 4.000 gespielten Wochen.**

Die SUD-Treffer sind ausnahmslos `.sud-kartensatz` (in 1600 zusaetzlich eine
`fu-notsud-zeile`, die der FUHRE gehoert). Das ist **kein Text, der ueber
seinen Kasten laeuft**, sondern das Gegenteil: `spiel/stil/sud.css:95-100`
setzt `-webkit-line-clamp: 3`, der Satz wird nach drei Zeilen mit Auslassung
abgeschnitten, und der volle Text haengt am `title` des Knopfes
(`sud.js:1085`). 40 bis 108 px Text stehen je Karte hinter der Auslassung.

## Frage 3, sauber ausgemessen — DIE KLEMME

Der Verdacht aus den acht Partien war: das Brett steht im Bild und kann
nichts. Die Frage war, ob das nur meine Hand war, die zu schnell hinsah.
`werkbank/schuss/sud-w6/klemme.mjs` fasst deshalb NICHTS an, wenn es den
Zustand findet, sondern sieht 8 Sekunden lang alle 200 ms nach (40 Proben).

**1350, Braujahr 1352, Woche 61** (Beleg `/tmp/sudw6/klemme-e1-0.png`):

```
brettKlassen      "sud-brett"          <- KEIN stadt-zugeklappt
brettMasse        23,124,902,645 px    <- vollstaendig im Bild
knopfTrifft       true                 <- elementFromPoint auf dem KNOPF trifft ihn
reiterAuf         true                 <- der Reiter der STADT sagt "liegt auf"
BRAUHAUS.sud.zustand().brettZu   true  <- DER SUD sagt "zugeklappt"
tote Knoepfe mit data-aus-grund="brett-zugeklappt"   10
davon mit data-soll-aus="0"                           6
```

Nach 8 Sekunden ohne jede Eingabe: **unveraendert 10**. Nach EINEM Klick auf
den Reiter: **immer noch 10**. Nach ZWEI Klicks: 0.

**1970, Woche 61**: dasselbe, 11 tote Knoepfe, davon 6 mit `soll-aus="0"`,
loest sich in 8 s nicht, nach zwei Reiterklicks 0.

Das Bild zeigt es: der Reiter unten heisst `DAS SUD… liegt auf`, das Brett
steht offen und lesbar da, und `Hopfen im Sack, heimlich`,
`Wasser aus dem Ziehbrunnen`, `Röhrenrecht an der Quelle −30 Pf` (Kasse 47 Pf),
`Bottich beim Küfer bestellen −26 Pf` sind grau.

**Woher es kommt** (`spiel/stuecke/sud.js:2074–2078`):

```js
var zu = brett.classList.contains('stadt-zugeklappt');
if (zu) brett.setAttribute('data-sud-gesehen', '1');
else if (!brett.hasAttribute('data-sud-gesehen')) zu = Z.brettZu;
Z.brettZu = zu;
```

Bei jedem Neuzeichnen ist `brett` ein FRISCHER Knoten ohne `data-sud-gesehen`.
Hat die STADT ihren Stempel bis dahin schon wieder abgeraeumt, greift der
`else`-Zweig und uebernimmt den ALTEN Wert. War der `true`, bleibt er `true` —
und zwar bei jedem weiteren Neuzeichnen wieder, weil der neue Knoten die Marke
auch nicht bekommt. Der 320-ms-Takt (`sud.js:2228`) reisst es nicht heraus, er
schreibt denselben Fehler nur oefter. Erst wenn die STADT das Brett wirklich
noch einmal zuklappt, wird die Marke gesetzt, und das naechste Aufschlagen
loest die Klemme — genau das sind die zwei Reiterklicks.

**Wie oft, in einer sorgfaeltig gespielten Partie** (400 Wochen je Epoche und
Hand):

| Epoche | Wochen mit Klemme (reich / arm) | Ablesungen `soll=0` + `disabled` + Maus trifft |
|---|---|---|
| 1350 | 24 / 38 | 39 / **144** |
| 1600 | 53 / 47 | 183 / 192 |
| 1884 | 46 / 39 | 174 / 107 |
| 1970 | 20 / 21 | 93 / 95 |

Betroffen sind auch die Entscheidungskarten selbst, nicht nur das Beiwerk:
`sud:wasser:roehre` 26×, `sud:wuerze:brief` 6× (1350 arm),
`sud:schuettung:rein`/`weizen` je 39× (1600), `sud:kaelte:warm` 37× (1884),
`sud:fuehrung:labor` 14×, `sud:behandlung:filter` 16×, `sud:behandlung:pasteur`
3× (1970 reich).

**Was es NICHT kostet.** In jeder dieser Wochen habe ich zusaetzlich den
Kesselzettel gemessen. Er lebt: 1350 arm 38/38, 1600 reich 53/53, 1600 arm
47/47, 1884 reich 40/46, 1884 arm 34/39, 1970 arm 21/21, 1350 reich 21/24 (in den drei
uebrigen trugen alle Zettelknoepfe `data-soll-aus="1"`, da sagte das Spiel
selbst nein). **Kein einziger Zug ist dem Spieler dadurch verlorengegangen** —
aber er muss ihn auf dem Zettel suchen, waehrend das Brett offen und tot vor
ihm steht.

## Frage 4 — traegt die Partie ein eigenes Bier?

**Ja, und es steht in vier Zahlen am Kesselzettel.** Dieselbe Epoche, drei
verschieden gespielte Partien (`STIL=reich`, `STIL=arm`, und die aufsteigende
gute Hand aus `siegel.mjs`):

| Epoche | Hand | Verfahren am Ende | Deckel | Zeug/Stellhefe/Führung/Streuung | Fassfaktor |
|---|---|---|---|---|---|
| 1350 | reich | brief · roehre | Starkbier | Zeug 98 % | ×1,19 |
| 1350 | arm | sack · brunnen | Starkbier | Zeug 90 % | ×1,15 |
| 1600 | gute Hand | rein · keller | **Märzenbier** | Stellhefe 98 % | ×1,19 |
| 1600 | reich | hafer · keller | Schankbier | Stellhefe 62 % | ×1,01 |
| 1600 | arm | hafer · ober | Schankbier | Stellhefe 98 % | ×1,19 |
| 1884 | reich | maschine · reinzucht | **Exportbier** | Führung 98 % | ×1,19 |
| 1884 | arm | warm · betrieb | Schankbier | Führung 79 % | ×1,09 |
| 1970 | gute Hand | labor · filter | **Exportbier** | Streuung ±3 % | ×1,19 |
| 1970 | reich | erfahrung · natur | Pilsner | Streuung ±7 % | ×1,19 |
| 1970 | arm | erfahrung · schoenen | Pilsner | Streuung ±8 % | ×1,16 |

Dazu am Brett das Feld `WAS BEIM WIRT ANKOMMT` mit Sorte, Zahl der Haeuser und
`trägt die Pfanne` / `schlägt als … aus` je Sprosse, und die Siegelzeilen.
Ein Aussenstehender kann an zwei Partien ohne Quelltext ablesen, welche
verschieden gespielt wurde.

Ein Nebenbefund, der zur Sache gehoert: der Deckel ist das **Minimum** ueber
die Achsen. In 1600 macht `schuettung:hafer` (kostenlos, `hoechst 1`) die
teuerste Festlegung der Epoche (`gaerung:keller`, 260 fl) am Deckel wertlos —
beide Partien enden bei `höchstens Schankbier`. Das steht am Knopf
(`hafer` traegt `nur Schankbier`) und am Brett
(`Dieses Brett deckelt sie — es hebt sie nie`, `sud.js:1325`), ist also
angesagt; es heisst aber, dass die einzige Kaufentscheidung dieser Epoche
neben einer kostenlosen Karte verpuffen kann.

*(Latte d folgt — zwoelf Laeufe laufen.)*
