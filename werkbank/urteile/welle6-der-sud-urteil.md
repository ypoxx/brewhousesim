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

*(Rest folgt: 1884/arm, 1970, Siegelangriff, Heilprobe, Latte d.)*
