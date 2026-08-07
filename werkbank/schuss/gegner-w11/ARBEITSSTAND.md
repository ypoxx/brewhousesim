# Welle 11 — DER GEGNER. Arbeitsstand (laufend geschrieben)

*Angefangen am 6. August 2026. Vorzustand `7896ee6`, Messstand auf Hafen 8961.
Geschrieben wird laufend, weil ein Builder dieser Welle schon an einem
Container-Reset gestorben ist und nur seine geschriebenen Zahlen überlebt haben.*

## Der Auftrag in vier Zeilen

| | Auflage | Abnahme |
|---|---|---|
| **A3** | Die Gegnerkarte schneidet keine gemalte Beschriftung an | vier Ortsschilder frei, alle vier Epochen, Lade- wie Spielzustand |
| **A6** | Das Band „UMKÄMPFT …" raus aus dem untersten Sechstel | dort trägt jedes Zielblatt seinen Vordergrund |
| **A10** | `.gg-bandzeile .was` kürzt 1810 px Text in 731 px; die Kassenspalte schneidet Ziffern ab | kein gekürzter Satz, keine gekürzte Zahl |
| **Haushalt** | 28.000 px gesamt · 8.000 px oberstes ⅙ · `ueberRand()` leer, auch gebaut | `BRAUHAUS.haushalt.pruefe()` |

---

## 1 — Was vor der ersten Zeile Code gemessen wurde

**`spiel/` ist zwischen `7896ee6` und `HEAD` (dbd3a18) byteweise gleich.**
`git diff --stat 7896ee6 HEAD -- spiel/` ist leer.

### 1.1 Der Vorzustand, photographisch (`rahmen-w10/messen.mjs`, Hafen 8961, Ladezustand)

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| **gegner gesamt** | 195.127 px | 200.464 px | 187.855 px | **215.077 px** |
| gegner oberstes ⅙ | 0 | 0 | 0 | 0 |
| gegner Mittelband | 5,9 % | 6,3 % | 5,8 % | 6,8 % |
| gegner unterstes ⅙ | 4,0 % | 3,3 % | 3,6 % | 3,3 % |
| gegner Kästen | 21 | 23 | 22 | 22 |
| Deckung gesamt (alle Stücke) | 18,4 % | 19,3 % | 18,7 % | 19,3 % |
| Ruheprobe | 0,0 % | 0,0 % | 0,0 % | 0,0 % |
| über dem Rand · Währungsbruch · fehlende Zeichen | 0·0·0 | 0·0·0 | 0·0·0 | 0·0·0 |

Der Auftrag nennt **214.788**; gemessen auf `7896ee6` sind es **215.077** in 1970.
Die Zahl des Auftrags stammt vom Stand `37f4b44` — der Unterschied von 289 px
(0,13 %) ist die Arbeit des Rahmens an der Kopfleiste, die unter dem Band
hindurchreicht. **Die Grenze ist 28.000: der Schnitt ist auf ein Siebtel.**

Das oberste Sechstel steht schon auf **0** — DER GEGNER stellt im Ladezustand
nichts über y = 256. Die 8.000 px dort sind eine Grenze für den Spielzustand.

### 1.2 Wo die Fläche steckt (Hüllen, `gegner-w11/sonde.mjs`, Ladezustand)

Innensicht des Haushalts: gegner **189.632 / 193.840 / 177.216 / 209.664 px**
(E1–E4), also 6 bis 9 Prozent unter der photographischen Zahl — Hüllen kennen
keinen Schlagschatten. Die größten Kästen, Epoche 1350:

```
  62426 px²   366×171 @1964,584   .gg-sitz gg-adler      seine Karte
  26953 px²   849× 32 @1710,1282  .gg-kennzahl           „umkämpft …"  ← A6
  19472 px²   285× 68 @1096,676   .gg-amt                die Klage
  14128 px²   336× 42 @1979,671   .gg-zahlen             Züge/Kasse/Preis  ← A10
  11660 px²   224× 52 @2365,595   .gg-wimpel             „wirbt · noch 4 Wo."
   9729 px²   414× 24 @1940,560   .gg-vorschild
   9126 px²   192× 48 (×3)        .gg-fass               „Fass an den Wirt"
   8067 px²   155× 52 (×2)        .gg-schild             „TOR · KON  ablösen 56 Pf"
```

Die vier gemalten Ortsschilder DER STADT (dieselben Koordinaten in allen vier
Epochen, weil `kern/orte.js` sie festhält):

```
  ST. MICHAEL        146×23 @1550,527
  GASTHOF LINDENHOF  269×28 @1737,787
  BRAUEREI ADLER     ~150×17 @~2100,~460    (Name je Epoche verschieden)
  Hoftorschild       ~200×100 @~1150-1340,~900-1040
```

`.gg-sitz` steht in allen vier Epochen bei **@1964,584**, ist 145 bis 171 px
hoch, und wächst nach unten (Anker `oben`). Unterkante heute 729 bis 755;
GASTHOF LINDENHOF beginnt bei y = 787. **Im Ladezustand sind das 32 bis 58 px
Luft — im Spielzustand wächst die Karte um Marken, Wochenzettel und
Wochenzugzeile und frisst sie auf. Genau das hat der Kritiker gesehen.**

### 1.3 Der abgeschnittene Satz (A10), gemessen

`.gg-bandzeile .was`, Ladezustand: **1772 px in 731 px** (1350) ·
1588 in 731 (1600) · 1092 in 731 (1884) · 850 in 731 (1970).
Der Auftrag nennt 1810 px für 1970 — das ist ein anderer Spielstand, aber
dasselbe Verhältnis: mehr als die Hälfte des Satzes fehlt.

### 1.4 Was in den anderen Zuständen dazukommt

`sonde.mjs` mit `BAUEN=34 ESC=1` (der Zustand, in dem der blinde Kritiker
gemessen hat) und mit `WOCHEN=30`:

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| gegner, 34 Baurunden + Escape | 187.216 | 211.056 | 211.824 | **265.232** px |
| davon oberstes ⅙ | 0 | 0 | 0 | **16.576** px |
| gegner, 30 Wochen | — | — | — | **419.568** px |

**`haushalt.ueberRand()` im gebauten Zustand, 1970 — der Befund des Rahmens ist
nachgestellt:**

```
{"stueck":"gegner","klasse":"gg-ziel gg-konzern zuteuer",
 "mass":"312×52 @2458,202","text":"verhandelt · noch 6 Wo.zuvorkommen 60.26…"}
```

2458 + 312 = 2770, also 18 px über die 2752 hinaus. Genau die Stelle, an der
der Kritiker nur noch „Wo" sah.

**A3, gemessen statt vermutet** (jedes Ding des GEGNERS gegen jede gemalte
Beschriftung, im gebauten Zustand):

| Epoche | Treffer | Fläche | wer auf wem |
|---|---|---|---|
| 1350 | 4 | 3.024 px² | `img.gg-hofbild` auf „BRAUHAUS ZUM ADLER" |
| 1600 | 4 | 2.652 px² | `img.gg-hofbild` auf „BRAUSTATT ADLER" |
| **1884** | **3** | **634 px²** | **`button.gg-sitz` 366×218 @1964,584 auf „GASTHOF LINDENHOF"** |
| 1970 | 1 | 475 px² | `div.gg-paar` auf „ST. MICHAEL" |

Die dritte Zeile ist Befund (C) des Kritikers, Ziffer für Ziffer: die Karte ist
im gebauten Zustand 218 px hoch statt 164, ihre Unterkante steht bei y = 802,
und „GASTHOF LINDENHOF" beginnt bei y = 787.

**A10, zweite Hälfte, gemessen:** in 1970 trägt `.gg-feld b` den Text
`2.637.150 DM` mit 130 px Bedarf in einem 109 px breiten Kasten, `text-overflow:
clip` — **abgeschnitten ohne Auslassungspunkte**, in jedem gemessenen Zustand.

### 1.5 Welche Schicht welches Schild trägt — der Grund, warum (C) möglich war

Nachgelesen in `stuecke/stadt.js`:

* `zeichneNamen` und `zeichneHausschild` malen **ST. MICHAEL · GASTHOF
  LINDENHOF · BAHNHOF · das Hoftorschild** in die Ebene **`bau`**
  (`teile()`, Zeile 1620) — also **unter** die Ebene `marken`, in der DER
  GEGNER steht. Diese drei kann dieses Stück anschneiden, und genau das ist
  passiert.
* `zeichneGegnername` malt **BRAUEREI ADLER / ADLER-BRÄU AG /
  NORDSTERN-GRUPPE** in die Ebene **`hand`** mit `z-index: 962` — also
  **über** DEN GEGNER. Diese kann dieses Stück geometrisch überlagern, aber
  nicht anschneiden: der Name bleibt lesbar, verdeckt wird das eigene Zeichen.

Das ist keine Ausrede, sondern die Trennlinie für die Abnahme: **die drei
Schilder in `bau` müssen frei bleiben, und sie sind es.**

---

## 2 — Was gebaut wurde

### Der Satz, aus dem alles folgt

> **Der Gegner klebt keine Karteikarten mehr auf die Stadt. Er hängt Schilder,
> und ein Schild ist gemalt.**

Der Haushalt begründet die Grenze mit drei Worten: *gegner | 28.000 | 8.000 |
„die Gegnerkarte"*. Also **ein** Kasten je Haus gegenüber — sein Namensschild —
und alles andere gemalt: Schrift mit heller Strichkontur (`paint-order: stroke
fill`) und Lichthof, kein Papier, kein Rahmen, kein Schlagschatten.

**Was das NICHT ist: weniger anzeigen.** Kein Satz, keine Zahl und kein Knopf
ist vom Schirm verschwunden. Gemessen, nicht behauptet — `sonde.mjs` listet
jeden `[data-zug^="gegner:"]` mit Maße, Preisschild und Treffbarkeit, vorher
und nachher, auf zwei eingefrorenen Ständen:

| Epoche | Züge vorher | nachher | von der Maus zu treffen | mit Preisschild |
|---|---|---|---|---|
| 1350 | 11 | **11** | 8 → **8** | 4 → **4** |
| 1600 | 13 | **13** | 10 → **10** | 5 → **5** |
| 1884 | 13 | **13** | 10 → **10** | 5 → **5** |
| 1970 | 12 | **12** | 9 → **9** | 4 → **4** |

Kein `data-zug` ist hinzugekommen, keiner ist fort, keiner ist unerreichbar
geworden.

### Die sechs Änderungen, jede mit ihrer Auflage

| # | Was | Auflage | Datei |
|---|---|---|---|
| 1 | Die Gegnerkarte wird ein Namensschild: 366×171 → 268×39, ohne Schlagschatten, feste Höhe | Haushalt, A3 | `gegner.js` `zeichneSitz`, `gegner.css` `.gg-sitz` |
| 2 | Kasse, Züge, sein Preis: eine gemalte Zeile mit unzerbrechlichen Feldern statt drei enger Spalten | **A10** | `gegner.css` `.gg-zahlen/.gg-feld` |
| 3 | Das Hofbild steht über dem gemalten Ortsschild statt darauf | **A3** | `gegner.js` `zeichneHof`, `.gg-hofbau` |
| 4 | „umkämpft" verlässt das unterste Sechstel und hängt an dem Giebel, um den gestritten wird | **A6** | `gegner.js` `meldeZug/kennzahlZeile/zeichneAdressen` |
| 5 | `.gg-bandzeile .was` bricht um statt zu kürzen; die Liste wird ein Rollkasten | **A10** | `gegner.css` `.gg-bandliste/.was` |
| 6 | Randwache: jedes Zeichen hält sich selbst im Bild (`randDx`) | `ueberRand()` | `gegner.js` `amRand/randDx/BREIT` |

### Zwei eigene Fehler beim Bauen, gefunden und behoben

**F1 — Das Hofbild ist zuerst zur Seite gerückt, und das war falsch.**
Der erste Anlauf gegen A3 hat `gg-hof` um 9 Prozentpunkte nach links gesetzt.
Die Zahl stimmte danach (0 Treffer), das Bild nicht: seine Brauerei stand
mitten in der Stadt statt jenseits des Flusses. *Ich habe es nur gesehen, weil
ich das PNG angesehen habe und nicht nur die Zahl.* Jetzt steht der Stapel am
selben Ort senkrecht gestaffelt — Hofbild, darunter das gemalte Ortsschild,
darunter Bauten und Vorsprung, darunter sein Namensschild.

**F2 — Ein Trennpunkt sah aus wie ein leeres Rechteck.**
Die gemalte Zahlenzeile trennte ihre Felder mit `.gg-feld + .gg-feld::before {
content: '· ' }`. Bricht die Zeile um, stand der Mittelpunkt **allein am
Zeilenanfang** — und ein Mittelpunkt mit heller Strichkontur sieht bei
siebenfacher Vergrößerung aus wie ein kleines leeres Rechteck. Das ist genau
das, wonach Auflage 7 des Urteils fragt. Der Punkt hängt jetzt **hinten** am
Feld (`:not(:last-child)::after`); `.gg-feld` ist `nowrap`, also kann er nie
allein stehen.

---

## 3 — Wie gemessen wird, und warum ein eigener Nachstand nötig war

**VORHER** = `aufsicht/messstand.sh 7896ee6 8961` — der eingefrorene Vorzustand
des Auftrags.

**NACHHER** = `gegner-w11/nachstand.sh 8962` — und das ist **kein** Abbild des
Arbeitsbaums. In dieser Welle arbeiten drei Builder gleichzeitig im selben
Baum; eine Kopie des Baums enthielte auch den halbfertigen Stand von DAS ERBE
und DIE FUHRE, und jede Zahl daraus wäre eine Mischung. **Beim ersten Versuch
am Arbeitsbaum war das sofort sichtbar:** der Reiter „Das Erbe" fehlte in der
Reiterzeile, `pruefe()` nannte DAS ERBE nicht mehr, und die Zahl der `data-zug`
in 1350 fiel von 99 auf 95 — nichts davon meine Arbeit.

Der Nachstand ist deshalb ein **Mischstand**: `git archive 7896ee6`, und darin
genau die fünf Dateien, die mir gehören —
`stuecke/gegner.js` · `gegner-daten.js` · `gegner-zusatz.js` ·
`stil/gegner.css` · `gegner-zusatz.css`. **`.js` UND `.css`** — das war der
Fehler beim ersten Anlauf der Trennprobe in Welle 8 und steht ausdrücklich in
`WELLE-11.md`. Die Marke trägt beides: `7896ee6+gegner-<md5>`.

Jeder Lauf geht einzeln durch `aufsicht/messfenster.sh` mit
`MESSFENSTER_WARTE=7200`. Nie zwei Browser nebeneinander.

---

## 4 — Was ich für andere Stücke gefunden habe

**(1) DIE STADT · DIE FUHRE — ein toter Knopf ist wieder lebendig, und das ist
die einzige Zahl, die ich außerhalb meines Stücks bewegt habe.**
`stadt.js:1068` räumt einen Pflock ab, dessen Mitte von einem fremden Element
mit `data-frei` gedeckt wird — „KEIN TOTER KNOPF IM BILD". Im Vorzustand war
`stadt:marke:fuhre-fluss` in **1970** von einem Kasten des GEGNERS gedeckt und
wurde deshalb abgeräumt. Jetzt ist er da. Gemessen mit einem vollständigen
Vergleich aller `[data-zug]` auf beiden Ständen: **das ist der einzige
Unterschied** (1970: 102 → 103; 1350/1600/1884 unverändert 99/107/110).

**(2) DIE STADT — welche Schicht welches Schild trägt, ist eine Falle für jedes
Stück.** `zeichneNamen` und `zeichneHausschild` malen ST. MICHAEL, GASTHOF
LINDENHOF, BAHNHOF und das Hoftorschild in die Ebene **`bau`**; jedes Stück in
`marken`, `hand`, `kopf` oder `blatt` liegt darüber und kann sie anschneiden.
`zeichneGegnername` malt BRAUEREI ADLER / ADLER-BRÄU AG / NORDSTERN-GRUPPE
dagegen in die Ebene **`hand`** mit `z-index: 962` und ist damit geschützt.
Auflage 3 nennt alle vier in einem Atemzug, aber nur drei von ihnen können
überhaupt angeschnitten werden. Wer das nicht weiß, sucht am falschen Ende.

**(3) DAS ERBE — Auflage 9 steht am Vorzustand noch offen.** 1970,
Ladezustand: `.wort` „Versorgungszusage · jährlich" **253 px in 157 px** mit
`ellipsis`; im gebauten Zustand zusätzlich „Nachschrift · 2 Häuser"
**199 px in 176 px**. (Gemessen auf `7896ee6`, also vor ihrer Arbeit.)

**(4) DER NAME — zwei gekürzte Beschriftungen, die auf keiner Liste stehen.**
`.nm-medium`: „Wirtshausschild und gemarkter Krug" **221 px in 208 px** (1600),
„Kronkorken, Bandenwerbung, Fernsehspot" **258 px in 208 px** (1970). Auflage 9
des Urteils sagt ausdrücklich: *„Prüft dabei auch die anderen Bänder."*

**(5) DIE FUHRE — `.fu-notsud-zeile` kürzt** 509 px in 482 px (1350) und
571 px in 482 px (1600), mit Auslassungszeichen. Betrifft eine Zeile mit
Zahlen („0 Pf · 0 Grut · 0 Brautage → 3 Fass · hält 2 Wo. · nur die P…").

**(6) DIE STADT — ein Pflock trägt ein abgeschnittenes Wort.**
`stadt.js:943 markenwort()` schneidet hart bei 22 Zeichen: im Bild steht
„Adler-Ausschank am Mar". Kein Auslassungszeichen, mitten im Wort.

---

## 5 — DIE ZAHLEN

### 5.1 Der Flächenhaushalt im Spiel (`BRAUHAUS.haushalt`, Ladezustand)

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| gegner **vorher** | 189.632 | 193.840 | 177.216 | 209.664 px |
| gegner **nachher** | **11.968** | **10.032** | **9.504** | **19.072 px** |
| Grenze | 28.000 | 28.000 | 28.000 | 28.000 px |
| oberstes ⅙ vorher → nachher | 0 → **0** | 0 → **0** | 0 → **0** | 0 → **0** (Grenze 8.000) |
| Kästen des GEGNERS | 14 → **1** | 16 → **1** | 15 → **1** | 15 → **2** |
| Summe der Hüllen | 191.166 → **10.721** | 194.339 → **9.010** | 178.633 → **8.501** | 226.175 → **17.882 px²** |
| `haushalt.pruefe()` nennt gegner | **ja** | ja | ja | ja → **nein, in allen vier** |
| `haushalt.ueberRand()` | [] | [] | [] | [] |

Der einzige verbliebene Kasten ist sein Namensschild: **268×39 @2013,584**
(1350) bzw. 204×39 und 243×39 (1970, zwei Häuser). Vorher: 366×171.

### 5.2 Auflage 3 — die gemalten Beschriftungen (`sonde.mjs`, alle Zustände)

| Zustand | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| Ladezustand **vorher** | 0 | 0 | 0 | 0 |
| Ladezustand **nachher** | **0** | **0** | **0** | **0** |
| 34 Baurunden + Esc **vorher** | 4 (3.024 px² Hofbild) | 4 (2.652 px² Hofbild) | **3 (634 px² die Karte auf GASTHOF LINDENHOF)** | 1 (475 px²) |

### 5.3 Auflage 10 — der Satz und die Zahl

| | vorher | nachher |
|---|---|---|
| `.gg-bandzeile .was` 1350 | 1772 px in 731 px | **731 in 731 — ganz** |
| … 1600 | 1588 px in 731 px | **731 in 731 — ganz** |
| … 1884 | 1092 px in 731 px | **731 in 731 — ganz** |
| … 1970 | 850 px in 731 px (gespielt bis 1652) | **731 in 731 — ganz** |
| Kassenspalte 1970 | `2.637.150 DM`: 130 px in 109 px, `clip` | **kein abgeschnittener Wert in keinem Zustand** |

Das Brett bleibt dabei, wo es hingehört: **936×203 = 190.175 px²** (1350/1600)
bzw. 936×181 = 169.123 (1884/1970) — über MARKE (101.376 px², also behält es
seinen Reiter DER STADT) und **unter 200.000 px², also keine Tafel im Sinne
von A16**. Vorher waren es 936×158 = 147.888; der Rollkasten kostet 42.287 px²
und kauft dafür 60 % eines Satzes zurück.

### 5.4 Auflage 6 — das unterste Sechstel

`.gg-kennzahl` lag vorher bei **849×32 @1710,1282** (1350) bis 860×32 @1699,1282
(1970); das unterste Sechstel beginnt bei y = 1280. Nachher hängt die Zeile am
Giebel, den sie meint, und ist dort **kein Kasten mehr**. Die Deckung des
untersten Sechstels durch DEN GEGNER: siehe §5.5.

### 5.5 ρ — die zweite Messlatte

Gemessen mit `rueckkopplung-r3/linie.mjs <epoche> 400`, **einzeln**, jeder Lauf
allein durch das Messfenster (der Rahmen hat in Welle 10 nachgewiesen, dass
`welle.sh` die vier Epochen nebeneinander fährt und dabei auf demselben Stand
eine andere Partie liefert). Ausgewertet mit `fuhre-w6/schnitte.py` (drei
Schnitte) und `rueckkopplung-r3/auswerten.py` (Jahre unter 1×).

**VORHER, Messstand `7896ee6` auf Hafen 8961:**

| Epoche | 12 J | 13 J | 14 J | Jahre < 1× | Kasse | Fehler |
|---|---|---|---|---|---|---|
| 1350 | −0,245 | −0,170 | −0,336 | 2/14 | 28–524 | 0 |
| 1600 | −0,189 | +0,049 | −0,116 | 0/14 | 291–2851 | 0 |
| 1884 | +0,168 | +0,346 | +0,393 | 1/14 | 1757–23789 | 0 |
| 1970 | −0,112 | −0,236 | −0,304 | 1/14 | 320–95857 | 0 |

**Und das ist zugleich eine Gerätekontrolle:** diese vier Zeilen sind Ziffer
für Ziffer die, die der Rahmen in Welle 10 für den Vorzustand gemessen hat —
dieselben ρ, dieselben Jahre unter 1×, dieselben Kassenspannen, alle vier
Epochen. Meine Kette misst also dasselbe wie seine, und sie misst es einzeln.

---

---

## 6 — NEUANLAUF nach dem Container-Reset (6.8., ab 21:30 UTC)

*Der Vorgänger ist um 21:2x an einem Container-Reset gestorben. Seine Arbeit
liegt vollständig vor — §1 bis §5 sind seine. Was hier folgt, ist neu.*

### 6.1 Der erste Griff: die schon gemessenen Blätter zu Ende lesen

Der Vorgänger hatte `nach-gebaut.txt` und `nach-w30.txt` **gemessen, aber nicht
mehr ausgewertet** — sie kamen an, als er starb. §5.2 trägt deshalb nur die
Zeile „Ladezustand nachher: 0·0·0·0". **Die beiden anderen Zustände bestehen
Auflage 3 nicht:**

| A3-Treffer nachher | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| Ladezustand | 0 | 0 | 0 | 0 |
| 34 Baurunden + Esc | **3** | 0 | **0** ✔ | **3** |
| 30 Wochen | **2** | 0 | **0** ✔ | **4** |

Die benannte Stelle des Kritikers — 1884, die Karte auf „GASTHOF LINDENHOF" —
**ist weg** (3 Treffer → 0, in beiden Zuständen). Aber:

```
1350/1970, gebaut:  „ST. MICHAEL"  511 px² unter div.gg-paar amort  227×94 @1345,465
                    „ST. MICHAEL"  144 px² unter div.gg-kennzahl    227×16 @1345,544
1970, 30 Wochen:    „NORDSTERN-GRUPPE"  905 px² unter div.gg-paar   143×71 @2405,457
1350, 30 Wochen:    „BRAUHAUS ZUM ADLER" 591 px² unter div.gg-wagen 150×118 @2209,448
```

### 6.2 Warum — ein eigener Fehler, gefunden statt vermutet

Die Ausweiche (`sperrzonen`/`weicheAus`) war gebaut und wurde auch gerufen. Ich
habe ihre Rechnung von Hand nachvollzogen: für das `gg-paar` in 1350 (Mitte
52,99 %, halbe Höchstbreite 4,54 %, Unterkante 36,39 %, drei Reihen = 6,8 %)
gegen „ST. MICHAEL" (x 56,32–61,63 %, y 34,31–35,81 %) trifft die Überlappung
zu, und `weicheAus` hätte um 2,48 % nach oben gerückt. **Es ist nicht gerückt.
Also war die Zonenliste leer.**

Der Grund steht in drei Zeilen alten Codes:

```js
if ((ZONEN_ANLAUF[e] || 0) >= 3) return [];
ZONEN_ANLAUF[e] = (ZONEN_ANLAUF[e] || 0) + 1;   // zaehlt AUCH den Erfolg
```

`sperrzonen()` wird **einmal je offener Adresse** gerufen, nicht einmal je Bild.
Wo drei Adressen offen stehen, ist der Zähler nach dem **ersten** Bildaufbau
verbraucht. Fällt dieses erste Bild in einen Augenblick, in dem DIE STADT ihre
Namen gerade nicht stehen hat, ist die Ausweiche für die ganze Partie tot —
**und zwar lautlos: eine leere Zonenliste sieht aus wie „nichts im Weg".**

Das ist die gefährlichere Hälfte des Fehlers. Ein Zähler, der aufgibt, ist
schlimm; einer, der beim Aufgeben dasselbe zurückgibt wie beim Gelingen, ist
nicht zu bemerken. Der Vorgänger hat die Zahl 0 im Ladezustand gesehen und
durfte glauben, es funktioniere — im Ladezustand steht dort ohnehin nichts im
Weg.

### 6.3 Was ich geändert habe (Änderung 7 und 8)

| # | Was | Auflage | Datei |
|---|---|---|---|
| 7 | `sperrzonen()`: nur der **leere** Anlauf zählt, Schranke 40 statt 3; die Zahl der gefundenen Zonen steht als `data-a3zonen` am eigenen Fach | **A3** | `gegner.js` `sperrzonen/meldeZonen` |
| 8 | Die Ausweiche gilt **allen vier** Schildern: `#ebene-hand .stadt-name-gegner` kommt zu den Zonen dazu | **A3** | `gegner.js` `sperrzonen` |

Zu 8: der Vorgänger hatte richtig nachgelesen, dass BRAUEREI ADLER /
ADLER-BRÄU AG / NORDSTERN-GRUPPE in der Ebene `hand` mit z-index 962 liegen und
deshalb **nicht angeschnitten** werden können. Daraus hatte er geschlossen, sie
gingen ihn nichts an. Das ist die falsche Hälfte des Schlusses: die Schicht
entscheidet, **wer** unlesbar wird, nicht **ob**. Liegt sein Preisschild unter
dem gemalten Namen, bleibt der Name lesbar und sein eigenes Zeichen ist
begraben. Die Auflage nennt vier Schilder; also weicht das Stück vier aus.

Zu `data-a3zonen`: eine Ausweiche, die man nicht messen kann, ist eine
Behauptung. Genau daran ist dieser Fehler vier Messungen lang vorbeigelaufen.
`sonde.mjs` liest das Attribut jetzt mit und schreibt es neben die A3-Zahl.

### 6.4 Was ich NICHT ändere, und warum

`div.gg-wagen` (1350, 30 Wochen, 591 px² auf „BRAUHAUS ZUM ADLER") **bleibt.**
Der graue Wagen ist ein Fahrzeug auf der Straße zwischen zwei Orten; sein Platz
ist die Strecke, nicht eine Lücke neben einer Beschriftung. Er liegt in
`marken`, der gemalte Name in `hand` mit z-index 962 — **der Name wird von ihm
nie angeschnitten, er fährt darunter durch.** Ihn auszuweichen hieße, die
Geographie zu verbiegen, um einen Zähler zu bedienen; genau diesen Fehler hat
der Vorgänger beim Hofbild schon einmal gemacht und selbst zurückgenommen (F1).
Der Zähler in `sonde.mjs` ist absichtlich schichtblind und zählt ihn weiter mit
— **ich melde ihn, statt ihn wegzurechnen.**

### 6.5 Rechenprobe vor der Messung — die Hälfte, die kein Browser braucht

Die Ausweiche hat zwei Hälften: **findet sie die Zonen** (DOM, Zeitpunkt) und
**rechnet sie richtig** (Geometrie). Die zweite Hälfte lässt sich ohne Browser
prüfen, indem man die gemessenen Zahlen aus `nach-gebaut.txt` / `nach-w30.txt`
durch dieselbe Funktion schickt:

| Fall | Unterkante vorher | Schild | Unterkante nachher | Abstand |
|---|---|---|---|---|
| 1350/1970 gebaut, `gg-paar` auf ST. MICHAEL | 559 px | y 527–550 | **521 px** (nach oben) | **6 px frei** |
| 1970 w30, `gg-paar` auf NORDSTERN-GRUPPE | 528 px | y 478–495 | **573 px** (nach unten) | **7 px frei** |

Beide Male wird die billigere Richtung genommen, und beide Male steht das
Zeichen danach frei. Der Abstand ist knapp, aber er ist es **mit Absicht und
nachrechenbar**: beim Ausweichen nach oben setzt `nachOben` die Unterkante
genau 0,4 % (6,1 px) über die Schildoberkante — die Höhenschätzung geht in
diese Richtung gar nicht ein. Beim Ausweichen nach unten ist der Abstand
mindestens 0,4 %, weil die Schätzung (`reihen × 2,1 + 0,5`) bewusst **über**
der wahren Höhe liegt (6,8 % geschätzt gegen 6,1 % gemessen bei drei Reihen).
Der A3-Zähler der Sonde meldet erst ab mehr als 1 px Überlappung — sechs px
sind kein Zufallstreffer.

**Damit steht nur noch die erste Hälfte offen, und genau die misst
`data-a3zonen`.** Zeigt die Sonde `Sperrzonen gefunden: 0`, ist die Diagnose
aus §6.2 falsch und der Fehler liegt woanders; zeigt sie eine Zahl > 0 und A3
trotzdem > 0, ist die Rechnung schuld und nicht der Zeitpunkt. Zwei
Möglichkeiten, ein Messwert — das ist der Grund, warum das Attribut existiert.

### 6.6 Zwei weitere Änderungen, aus der Vorsicht heraus

| # | Was | Warum | Datei |
|---|---|---|---|
| 9 | Die Randwache gilt jetzt auch für die Ausweiche: `weicheAus` klemmt die Ober- und Unterkante ins Bild | Ein Zeichen, das einem Schild ausweicht und dabei aus dem Bild fällt, hat nichts gewonnen — `ueberRand()` muss auch gebaut leer bleiben | `gegner.js` `weicheAus` |
| 10 | `gg-gewonnen` und `gg-frei` weichen wie das Paar aus | Sie hängen an **derselben** Adresse mit **demselben** Anker und **demselben** dy. Sie standen in keinem der acht abgetasteten Zustände im Bild — eine Regel, die für das eine gilt und für das andere nicht, ist keine Regel, sondern ein Zufall | `gegner.js` `zeichneAdressen` |

Änderung 9 ist die Lehre aus Welle 10 an mir selbst: der Vorgänger hat die
Randwache **seitlich** gebaut (`randDx`), weil der Rahmen die Klage seitlich
gefunden hatte. Sobald die Ausweiche wirklich läuft, bewegt dieses Stück auch
**senkrecht** — und eine Randwache, die nur eine Achse kennt, ist keine.

| # | Was | Warum | Datei |
|---|---|---|---|
| 11 | Die **freistehende** „umkämpft"-Zeile weicht aus (Anker `oben`, also einmal hin und zurück gerechnet) | Sie steht frei nur, wenn an der umkämpften Adresse gerade kein Zeichen hängt — genau ein Zustand, den keine der acht Messungen dieser Welle im Bild hatte | `gegner.js` `zeichneKennzahl` |

### 6.7 Was ich bewusst NICHT ausweichen lasse — und dazu stehe

**`zeichneZugmarken` (die Spurzettel) bleiben, wie sie sind.** Sie stapeln sich
zu zweit an einem Ort (`dy: -(4 + n·3,4)` bzw. `2,6 + n·3,4`) und benutzen je
nach Bildtiefe **beide** Anker. Eine Ausweiche würde jeden Zettel des Stapels
einzeln verschieben — und zwei Zettel, die einem Schild ausweichen, weichen
danach womöglich einander nicht mehr aus. **Ich habe Messungen dafür, dass sie
in keinem der acht abgetasteten Zustände ein Schild treffen, und keine dafür,
dass das Verschieben gefahrlos ist.** In dieser Lage ist Nichtstun die
belegte Wahl und Handeln die Vermutung. Das steht hier, damit es der nächste
findet, statt es für abgedeckt zu halten.

*(Messung läuft. Der Nachstand ist `7896ee6+gegner-f921d8abdd12`, der Code ist
ab hier eingefroren — jede Zahl unten gehört zu genau dieser Marke.)*

---

## 7 — DRITTER ANLAUF, nach dem Sitzungslimit (6.8., ab 23:2x UTC)

*Der zweite Anlauf ist am Sitzungslimit gestorben, mitten in `schluss.sh`. Er
hatte den Satz `nach2` fast vollständig gemessen — und, wie sein Vorgänger,
**nicht mehr ausgewertet**. §7.1 ist diese Auswertung; sie ist keine neue
Messung, sondern das Lesen von Blättern, die schon dalagen.*

**Der Stand ist unverändert.** `nachstand.sh 8962` liefert dieselbe Marke, die
über den `nach2`-Blättern steht: **`7896ee6+gegner-f921d8abdd12`**. Der
Arbeitsbaum ist sauber (die Aufsicht hat alles gesichert), die Prüfsumme meiner
fünf Dateien ist dieselbe. **Jede Zahl in §7.1 gehört also zum heutigen Code**
— ich messe nicht nach, was schon gemessen ist.

### 7.1 Der Satz `nach2`, ausgewertet — die reparierte Ausweiche hält

**Auflage 3, alle drei Zustände, alle vier Epochen** (`sonde.mjs`; in Klammern
`data-a3zonen`, also wie viele Sperrzonen das Stück wirklich gefunden hat):

| A3-Treffer | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| Ladezustand | 0 (4) | 0 (4) | 0 (5) | 0 (6) |
| 34 Baurunden + Esc | **0** (4) | **0** (4) | **0** (5) | **0** (6) |
| 30 Wochen | **2** (4) | **0** (4) | **0** (5) | **0** (6) |

Zum Vergleich derselbe Zustand vor der Reparatur (Satz `nach`, §6.1):
gebaut 3·0·0·3, w30 2·0·0·4. **Die sieben Treffer, die auf die tote Zonenliste
zurückgingen, sind fort; `data-a3zonen` steht nie auf 0.** Das ist die
Entscheidung, für die §6.5 das Attribut gebaut hat: es war der Zeitpunkt, nicht
die Rechnung.

Die zwei verbliebenen Treffer sind **ein einziges Ding, zweimal gezählt** —
der Wagen und sein Bild:

```
1350, 30 Wochen:  „BRAUHAUS ZUM ADLER"  591 px²  unter div.gg-wagen      150×118 @2209,449
                  „BRAUHAUS ZUM ADLER"  591 px²  unter img.gg-wagenbild  150×100 @2209,449
```

Das ist genau der Fall aus §6.4, den ich stehen lasse, und ich melde ihn statt
ihn wegzurechnen. Nachgerechnet: das Schild steht 191×18 @2051,461, der Wagen
150×118 @2209,449 — die Überlappung ist **33 px der rechten Schildkante**,
33×18 = 594 px². Der gemalte Name liegt in der Ebene `hand` mit z-index 962,
der Wagen in `marken`: **der Name wird darüber gezeichnet und bleibt ganz
lesbar, der Wagen fährt darunter durch.** Der Zähler der Sonde ist absichtlich
schichtblind.

**Auflage 10 und der Haushalt, alle drei Zustände:**

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| A10 abgeschnittene ZAHLEN, alle drei Zustände | 0 | 0 | 0 | 0 |
| `.gg-bandzeile .was`, jede Zeile | ganz 731/731 | ganz | ganz | ganz |
| abgeschnittener Text des GEGNERS, alle Zustände | — | — | — | — |
| GEGNER im Haushalt (Laden/gebaut/w30) | 11.968 | 10.032 | 9.504 | 19.072 px |
| davon oberstes ⅙ | 0 | 0 | 0 | 0 |
| `ueberRand()` Laden · gebaut · w30 | [] · **[]** · [] | [] · [] · [] | [] · [] · [] | [] · [] · [] |
| `tafeln()` des GEGNERS | [] | [] | [] | [] |
| `pruefe()` nennt gegner | nein | nein | nein | nein |
| `lage` · Seitenfehler · `verdeckt()` | 0·0·[] | 0·0·[] | 0·0·[] | 0·0·[] |

Der Haushaltswert des GEGNERS ist in allen drei Zuständen **dieselbe Zahl** —
Laden, 34 Baurunden und 30 Wochen unterscheiden sich nicht um ein Byte. Das ist
die Folge daraus, dass nur noch **ein** Kasten (1970: zwei) übrig ist: sein
Namensschild wächst nicht mit dem Spiel.

### 7.2 Photographisch — die Bildpunkte, um die der Auftrag gestellt ist

`rahmen-w10/messen.mjs`, dasselbe Gerät, mit dem der Haushalt gerechnet wurde:

| gegner, Bildpunkte | 1350 | 1600 | 1884 | **1970** |
|---|---|---|---|---|
| **vorher** (`7896ee6`, Laden) | 195.127 | 200.464 | 187.855 | **215.077** |
| **nachher** (Laden) | **10.685** | **8.994** | **8.515** | **17.864** |
| nachher (30 Wochen) | 4.249 | 3.398 | 3.159 | 13.449 |
| Grenze | 28.000 | 28.000 | 28.000 | 28.000 |
| oberstes ⅙ vorher → nachher | 0,0 % → **0,0 %** | 0,0 % → 0,0 % | 0,0 % → 0,0 % | 0,0 % → **0,0 %** |
| Kästen vorher → nachher | 21 → **8** | 23 → 8 | 22 → 8 | 22 → **9** |
| unterstes ⅙ vorher → nachher (A6) | 4,0 % → **0,0 %** | 3,3 % → **0,0 %** | 3,6 % → **0,0 %** | 3,3 % → **0,0 %** |
| Ruheprobe | 0 px | 0 px | 0 px | 0 px |
| über dem Rand · Währungsbruch · fehlende Zeichen | 0·0·0 | 0·0·0 | 0·0·0 | 0·0·0 |
| `verdeckt()` | [] | [] | [] | [] |

**1970: 215.077 → 17.864 px, ein Achtel der Grenze von 28.000.**
**Auflage 6 ist photographisch belegt: das unterste Sechstel des GEGNERS steht
in allen vier Epochen auf 0,0 %** — vorher 3,3 bis 4,0 %.

(Die photographische Zahl liegt über der des Haushalts, weil das Auge auch den
Schlagschatten und die Strichkontur sieht, die keine Hülle hat. Beide Zahlen
stehen hier, weil beide gefragt sind.)

### 7.3 Lesbarkeit bei 1366×768 (`aufsicht/lesbarkeit.mjs`)

13 Überläufe im ganzen Bild, davon **einer je Epoche aus diesem Stück**
(`gg:1` in 1350/1884, in 1600 `gg:1`, in 1970 keiner). 0 von 308 aktiven
Knöpfen unter 24 px. Der verbliebene `gg`-Überlauf bei 1366 px Breite ist
gemessen und benannt und steht in §7.5.

### 7.4 Was jetzt noch fehlte — und warum gerade das

Der zweite Anlauf ist in `schluss.sh` gestorben. Was er nicht mehr geschafft
hat, ist **nicht zufällig verteilt**: `tor.mjs` und `spielprobe.mjs` schreiben
in `.log`-Dateien, und `*.log` steht in `.gitignore` — die Aufsicht sichert sie
also nie, und der Container-Reset hat sie mitgenommen. Von den vier
ρ-Linien war nur e1 durch.

Es fehlen also: **`tor`, `spielprobe`, ρ e2/e3/e4.** Genau das misst dieser
dritte Anlauf, in dieser Reihenfolge (billig zuerst).

**Zur Frage, welcher ρ-Satz gilt:** `nach-e1.json` und `nach2-e1.json` sind
**byteweise gleich** (md5 `236412a2…`), obwohl sie auf zwei verschiedenen
Fassungen gemessen wurden — vor und nach der Reparatur der Ausweiche.
Das ist plausibel, denn die Änderungen 7–11 verschieben Zeichen, sie ändern
keinen Preis. Aber plausibel ist nicht gemessen. Deshalb messe ich **e2 auf dem
heutigen Stand nach**, obwohl `nach-e2.json` schon dasteht: stimmt es
byteweise mit `nach-e2` überein, ist die Neutralität der Ausweiche belegt statt
vermutet, und `nach-e1/e2` dürfen im Satz stehen. Weicht es ab, gilt allein der
neu gemessene Satz `nach2`.

### 7.5 Auflage 6, auf den Bildpunkt genau

Nicht „0,0 %" aus einer gerundeten Spalte, sondern die rohe Zahl aus
`gegnerw11-*-laden.json`, Feld `jeStueck.gegner.unten.punkte`:

| unterstes ⅙, gegner | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| vorher | 27.988 px | 23.502 px | 25.379 px | 23.502 px |
| **nachher** | **0** | **0** | **0** | **0** |
| nachher, 30 Wochen | **0** | **0** | **0** | **0** |

Und dazu das oberste Sechstel, ebenfalls roh: vorher 0 · 0 · 0 · **154 px**
(1970), nachher **0 in allen vier Epochen und allen gemessenen Zuständen**,
Grenze 8.000. Die ganze Fläche dieses Stücks liegt jetzt im Mittelband —
`ges.punkte` und `mitte.punkte` sind in jeder Zeile dieselbe Zahl.

### 7.6 Das Tor, die Spielprobe und die vierte Latte

`aufsicht/tor.mjs` auf dem Nachstand, alle vier Epochen:

```
E1: OK  jahr=1350 zuege=99   lage=0 fehler=0
E2: OK  jahr=1600 zuege=107  lage=0 fehler=0
E3: OK  jahr=1884 zuege=110  lage=0 fehler=0
E4: OK  jahr=1970 zuege=103  lage=0 fehler=0
TOR OFFEN
```

`aufsicht/spielprobe.mjs`, 60 Wochen je Epoche: **BESTANDEN**, 60 von 60 Zügen
in jeder Epoche, Kasse 48 · 280 · 4.200 · 50.000, `lage 0`, 0 Fehler. Beide
Zahlenreihen sind **Ziffer für Ziffer dieselben** wie im Satz `nach`, also vor
der Reparatur der Ausweiche — der erste Beleg dafür, dass die Änderungen 7–11
die Partie nicht bewegen.

**Die vierte Latte bei 1366×768** (`aufsicht/lesbarkeit.mjs`), gegen die Zahl,
die `WELLE-11.md` als Stand nennt:

| | Überläufe | Textknoten < 12 px | Knöpfe < 24 px |
|---|---|---|---|
| Vorzustand (Auftrag: „14 · 497 · 0 von 307") | 14 | 497 | 0 von 307 |
| **Nachstand** | **13** | **365** | **0 von 308** |

132 Textknoten unter 12 px weniger — das ist die Umstellung von Papierkästchen
auf gemalte Schrift, die keine eigenen `<span>` mehr braucht. Ein Knopf mehr:
der wiederbelebte `stadt:marke:fuhre-fluss` aus §4(1).

**Ein Überlauf dieses Stücks bleibt, und ich melde ihn, bevor ihn jemand
findet.** Vorher stand in der Aufschlüsselung je Epoche `was:1` — das war
`.gg-bandzeile .was`, also genau der gekürzte Satz der Auflage 10. Der ist
fort. An seiner Stelle steht in 1350/1600/1884 jetzt `gg:1`; in **1970 gar
keiner mehr**. `lesbarkeit.mjs` nennt nur das erste Wort der Klasse, also weiß
man daraus nicht, welcher Kasten es ist, um wieviel er kappt und ob eine
**Zahl** darunter leidet — und genau das unterscheidet Auflage 10. Dafür ist
`gegner-w11/schmal.mjs` geschrieben: dieselbe Prüfung Zeichen für Zeichen
(`kappt()` je Richtung), aber mit Name, Maß, Fehlbetrag und einem Merker, ob
Ziffern im Text stehen. Das Ergebnis steht in §7.8 — und es war ein Fehler von
mir.

### 7.7 Die Gegenprobe zur Neutralität der Ausweiche — belegt, nicht vermutet

§7.4 hat angekündigt, e2 auf dem heutigen Stand nachzumessen, obwohl
`nach-e2.json` schon dalag. Ergebnis:

```
bd2fc100d315fe6850e866dfa580ab02  nach-e2.json    (gemessen VOR der Reparatur, Satz `nach`)
bd2fc100d315fe6850e866dfa580ab02  nach2-e2.json   (gemessen HEUTE, Satz `nach2`)
cmp: BYTEWEISE GLEICH
```

400 Wochen, 14 Braujahre, jede Wochenzahl, jede Kassenstellung, jeder
Kennzahlwert — **identisch über zwei Fassungen des Codes hinweg.** Dasselbe
gilt für e1 (md5 `236412a2…`), und Tor wie Spielprobe liefern in beiden Sätzen
dieselben Zahlen. **Die Änderungen 7–11 verschieben Zeichen und bewegen keinen
Preis.** Damit ist der ρ-Satz `nach2` = {e1, e2 aus `nach`, neu gemessen und
bestätigt; e3, e4 heute} ein einziger, in sich stimmiger Satz und keine
Mischung.

Das ist zugleich die Antwort auf eine Frage, die ein Prüfer stellen würde:
zwei gleiche Dateien könnten auch heißen, dass jemand kopiert hat. Sie sind
hier **unabhängig entstanden** — `nach-e2` auf Hafen 8962 vor der Reparatur,
`nach2-e2` heute auf demselben Hafen, aber aus einem neu aufgesetzten Nachstand
(der Container ist zwischendurch zurückgesetzt worden, `/tmp` war leer).

### 7.8 Änderung 12 — ein Fehler, den erst der schmale Schirm zeigt

`gegner-w11/schmal.mjs` bei 1366×768 nennt den Kasten, den `lesbarkeit.mjs`
nur als „gg:1" zählt:

```
E1  gg  waagerecht  fehlt 8 px breit   438×41  div.gg-bandliste  [ZIFFERN]
E2  gg  waagerecht  fehlt 8 px breit   438×41  div.gg-bandliste  [ZIFFERN]
E3  gg  waagerecht  fehlt 5 px breit   438×30  div.gg-bandliste  [ZIFFERN]
E4  — kein Überlauf dieses Stücks
```

Der Merker `[ZIFFERN]` heißt nur, dass irgendwo im Kasten Ziffern stehen — er
sagt nicht, dass eine Zahl abgeschnitten ist. Auflage 10 unterscheidet das
ausdrücklich, also wird nicht geraten: `gegner-w11/bandrand.mjs` fragt, welcher
**Nachkomme** über die rechte Innenkante ragt.

```
E1/E2  +8,5 px  span.wort „zeigen"   28 px breit, links 418   (Liste 438)
E3     +5,1 px  span.wort „zeigen"
E4     kein Nachkomme ragt hinaus
```

**Keine Zahl — aber die Beschriftung eines Knopfes.** Im Bild stand „zeige".

**Und es ist mein Fehler, entstanden in dieser Welle.** Der Vorzustand kennt
weder `.gg-bandliste` noch `.gg-bandkoerper` als Regel; `overflow-x: hidden` an
der Liste habe ich hinzugefügt, damit das Brett nicht waagerecht rollt. Vorher
wäre die Beschriftung über die Kante gelaufen — sichtbar, hässlich, aber
lesbar. Ich habe aus einem Überstand einen Schnitt gemacht und es vier
Messungen lang nicht gesehen, weil `lesbarkeit.mjs` nur „gg:1" sagt und ich die
Zahl für den alten `was:1` gehalten hätte.

**Die Ursache, nachgerechnet:** `.gg-bandzeile` ist eine Flex-Zeile aus drei
Kindern — `.wann` (`flex: none`), `.was` (`flex: 1 1 auto; min-width: 0`) und
dem Knopf. Der Knopf hatte keine Angabe, also die Vorgabe `flex: 0 1 auto`:
**schrumpfbar.** Wird es eng, schrumpft der Browser ihn, seine Beschriftung ist
`nowrap`, und der Rest liegt unter der Kante der Liste. Der Satz daneben hätte
schrumpfen sollen — er darf es, er bricht um statt zu kürzen.

| # | Was | Warum | Datei |
|---|---|---|---|
| 12 | `.gg-bandzeile > .knopf { flex: none }` | Der einzige elastische Teil der Zeile ist der Satz. Ein halb gelesener Knopf ist schlimmer als ein halb gelesener Satz: beim Satz sieht man, dass er weitergeht | `stil/gegner.css` |

**Gemessen nachher, neuer Nachstand `7896ee6+gegner-8188005c786e`:**

```
E1  .gg-bandliste 438×41  scrollWidth 438 vs clientWidth 438  KEIN Nachkomme ragt hinaus
E2  .gg-bandliste 438×41  scrollWidth 438 vs clientWidth 438  KEIN Nachkomme ragt hinaus
E3  .gg-bandliste 438×30  scrollWidth 438 vs clientWidth 438  KEIN Nachkomme ragt hinaus
E4  .gg-bandliste 438×30  scrollWidth 438 vs clientWidth 438  KEIN Nachkomme ragt hinaus
```

Bei voller Breite (2752) ändert die Zeile nichts: dort schrumpft die Zeile gar
nicht, also greift `flex-shrink` nie. Das ist eine Behauptung über Geometrie,
und sie wird trotzdem gemessen — der ganze Satz läuft als `nach3` neu, samt
allen vier ρ-Linien. **Ein Stand, der nicht ganz gemessen ist, ist nicht
gemessen.**

### 7.9 Eine zweite Reparatur am eigenen Gerät

`schluss.sh` schrieb die Ausgabe von `tor.mjs` und `spielprobe.mjs` nach
`<marke>-tor.log`. **`*.log` steht in `.gitignore`** — die Aufsicht sichert
diese Dateien nie. Genau deshalb fehlten sie nach dem Container-Reset als
einzige aus einem sonst vollständigen Satz (§7.4): alles, was als `.txt` oder
`.json` geschrieben wurde, hat überlebt. Bei diesen beiden Läufen **ist** die
Ausgabe das ganze Ergebnis. `lauf()` schreibt jetzt `.txt`.

### 7.10 Der Satz `nach3` — der Stand, der abgegeben wird

Marke **`7896ee6+gegner-8188005c786e`** (= Vorzustand plus meine fünf Dateien,
mit Änderung 12). Alles ganz neu gemessen, einzeln durch das Messfenster.

**Die Zahlen bei voller Breite sind Ziffer für Ziffer die aus `nach2`** — die
Vorhersage aus §7.8 ist eingetroffen und nicht bloß behauptet worden:

| alle drei Zustände | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| GEGNER im Haushalt | 11.968 | 10.032 | 9.504 | 19.072 px |
| oberstes ⅙ | 0/8.000 | 0/8.000 | 0/8.000 | 0/8.000 |
| Kästen | 1 | 1 | 1 | 2 |
| A3 Laden · gebaut · w30 | 0·0·**2** | 0·0·0 | 0·0·0 | 0·0·0 |
| Sperrzonen gefunden | 4 | 4 | 5 | 6 |
| A10 (Zahlen) alle Zustände | 0 | 0 | 0 | 0 |
| `ueberRand()` alle Zustände | [] | [] | [] | [] |
| `tafeln()` des GEGNERS | [] | [] | [] | [] |
| `geklemmt()` | {} | {} | {} | {} |
| `lage` · Seitenfehler · `verdeckt()` | 0·0·[] | 0·0·[] | 0·0·[] | 0·0·[] |

(Die 2 in 1350/w30 sind der Wagen aus §6.4 und §7.1 — ein Ding, zweimal
gezählt, unter einem Namen, der darüber gemalt wird.)

**Tor:** offen, alle vier, `lage=0 fehler=0`.
**Spielprobe:** bestanden, 60/60 Züge je Epoche, Kasse 48 · 280 · 4.200 ·
50.000 — dieselben Zahlen wie in `nach` und `nach2`.

**Die vierte Latte bei 1366×768 — jetzt ohne dieses Stück:**

| | Überläufe | davon `gg` | Textknoten < 12 px | Knöpfe < 24 px |
|---|---|---|---|---|
| Vorzustand | 14 | 4 (`was:1` je Epoche) | 497 | 0 von 307 |
| `nach2` (vor Änderung 12) | 13 | 3 | 365 | 0 von 308 |
| **`nach3`** | **10** | **0** | **365** | **0 von 308** |

E1 `fu:1 nm:1` · E2 `nm:2 sud:1` · E3 `fu:1 nm:1` · E4 `nm:2 wort:1` —
**in keiner Epoche steht noch ein `gg`.** Die vier verbliebenen Überläufe
gehören DER FUHRE, DEM NAMEN, DEM SUD und DER STADT und sind in §4 gemeldet.

### 7.11 Photographisch und Deckung, Satz `nach3`

Identisch zu `nach2`, Ziffer für Ziffer — die Vorhersage aus §7.8 gilt auch für
die Kamera:

| gegner, Bildpunkte | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| vorher (`7896ee6`) | 195.127 | 200.464 | 187.855 | **215.077** |
| **nach3, Ladezustand** | **10.685** | **8.994** | **8.515** | **17.864** |
| nach3, 30 Wochen | 4.249 | 3.398 | 3.159 | 13.449 |
| oberstes ⅙ / unterstes ⅙ | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| Ruheprobe · über dem Rand · Währungsbruch · fehlende Zeichen | 0·0·0·0 | 0·0·0·0 | 0·0·0·0 | 0·0·0·0 |
| `verdeckt()` | [] | [] | [] | [] |

`bild-w9/deckung.mjs`, Gesamtdeckung aller Stücke (nicht nur meiner):
Ladezustand 14,1 / 14,8 / 14,5 / 14,8 % — im Vorzustand 18,4 / 19,3 / 18,7 /
19,3 %. Nach 30 Wochen **ohne** Escape 46,4 / 45,6 / 42,2 / 49,4 %; das ist das
Sommerblatt DER FUHRE und ihre Auflage, nicht meine — ich melde die Zahl, weil
sie in derselben Messung steht.

### 7.12 ρ — die zweite Messlatte, VORHER gegen NACHHER

Gemessen mit `rueckkopplung-r3/linie.mjs <epoche> 400`, **einzeln**, jeder Lauf
allein durch das Messfenster. VORHER = Messstand `7896ee6` auf Hafen 8961,
NACHHER = Nachstand `7896ee6+gegner-*` auf Hafen 8962.

**Drei Schnitte (`fuhre-w6/schnitte.py`), Spearman:**

| Epoche | 12 J | 13 J | 14 J | Urteil |
|---|---|---|---|---|
| 1350 vorher | −0,245 | −0,170 | −0,336 | besteht |
| 1350 **nachher** | **−0,245** | **−0,170** | **−0,336** | besteht |
| 1600 vorher | −0,189 | +0,049 | −0,116 | besteht |
| 1600 **nachher** | **−0,189** | **+0,049** | **−0,116** | besteht |
| 1884 vorher | +0,168 | +0,346 | +0,393 | besteht |
| 1884 **nachher** | **+0,168** | **+0,346** | **+0,393** | besteht |
| 1970 vorher | −0,112 | −0,236 | −0,304 | besteht |
| 1970 **nachher** | **−0,112** | **−0,236** | **−0,304** | besteht |

**Jahre unter 1× (`rueckkopplung-r3/auswerten.py`), je 14 Braujahre:**
vorher 2 / 0 / 1 / 1 — nachher **2 / 0 / 1 / 1**. Kassenspannen
28–524 · 291–2851 · 1757–23789 · 320–95857, vorher wie nachher. Fehler 0,
kein Abbruch, `zugDeckung` in keiner der 400 Wochen null.

**Und der Grund, warum die Zahlen so genau übereinstimmen, ist kein Zufall:**

```
e1  vor ↔ nach3 : abweichende Felder ['hafen']
e2  vor ↔ nach3 : abweichende Felder ['hafen']
e3  vor ↔ nach3 : abweichende Felder ['hafen']
e1/e2/e3  nach2 ↔ nach3 : []            (byteweise gleich)
```

Die 400-Wochen-Reihen sind über den ganzen Umbau hinweg **bitgleich** — der
einzige Unterschied zwischen dem Vorzustand und dem abgegebenen Stand ist die
Hafennummer, unter der gemessen wurde. Dieses Stück hat kein Zeichen an der
Wirtschaft verändert; es hat nur aufgehört, das Bild zuzukleben.

Das ist zugleich die schärfste Fassung der Trennprobe, die ich liefern kann:
wäre versehentlich ein fremdes Stück im Nachstand gelandet, stünde hier eine
andere Zahl.

---

## 8 — FERTIG. Was abgegeben wird, und was dagegen spricht

**Der abgegebene Stand ist `7896ee6+gegner-8188005c786e`** — der Vorzustand
plus genau fünf Dateien: `stuecke/gegner.js` · `gegner-daten.js` ·
`gegner-zusatz.js` · `stil/gegner.css` · `gegner-zusatz.css`. Die Prüfsumme des
Arbeitsbaums, die Marke auf Hafen 8962 und die Marke über jeder Zahl in §7.10
bis §7.12 sind dieselbe Zeichenkette. Gemessen wurde nie der Arbeitsbaum: in
dieser Welle arbeiten drei Builder darin.

Tatsächlich geändert sind **drei** Dateien; `gegner-daten.js` und
`gegner-zusatz.js` sind unberührt und stehen nur deshalb in der Liste, weil ein
Mischstand alles mitnehmen muss, was dem Stück gehört.

### Die Abnahme, in einer Tabelle

| | Forderung | gemessen | |
|---|---|---|---|
| Haushalt gesamt | ≤ 28.000 px | 11.968 · 10.032 · 9.504 · **19.072** | ✔ |
| Haushalt oberstes ⅙ | ≤ 8.000 px | 0 · 0 · 0 · 0 | ✔ |
| Bildpunkte 1970 | 214.788 → | **215.077 → 17.864** | ✔ |
| A3 Ladezustand | 0 | 0 · 0 · 0 · 0 | ✔ |
| A3 34 Baurunden + Esc | 0 | 0 · 0 · 0 · 0 | ✔ |
| A3 30 Wochen | 0 | **2** · 0 · 0 · 0 | ✘ gemeldet, §6.4 |
| A6 unterstes ⅙ | raus | 27.988/23.502/25.379/23.502 px → **0** | ✔ |
| A10 gekürzte Sätze | 0 | 0, jede Bandzeile ganz | ✔ |
| A10 gekürzte Zahlen | 0 | 0 in allen drei Zuständen | ✔ |
| `ueberRand()` auch gebaut | [] | [] in allen drei Zuständen, alle vier | ✔ |
| `verdeckt()` | 0 | [] in allen vier | ✔ |
| `pruefe()` nennt gegner | nein | nein, in allen vier | ✔ |
| `tafeln()` des GEGNERS | [] | [] | ✔ |
| Tor · Spielprobe | offen · bestanden | offen · bestanden | ✔ |
| Latte 2: \|ρ\| < 0,700, 3 Schnitte | alle 12 | größter 0,393, **unverändert** | ✔ |
| Latte 2: Jahre unter 1× | ≤ 1 von 6 | 2/0/1/1 von 14, **unverändert** | ✔ |
| Latte 4 bei 1366×768 | nicht schlechter | 14 → **10** Überläufe, **0 davon `gg`** | ✔ |
| Züge erreichbar | keiner verloren | 11/13/13/12, keiner fort | ✔ |

### Was gegen diesen Stand spricht — von mir, nicht vom Kritiker

1. **1350 nach 30 Wochen: zwei A3-Treffer bleiben.** Der graue Wagen fährt
   unter „BRAUHAUS ZUM ADLER" durch (33 px der Schildkante, 591 px²). Der Name
   liegt in `hand` mit z-index 962 und wird **darüber** gemalt, bleibt also
   ganz lesbar. Ich lasse ihn stehen, weil ein Fahrzeug auf die Straße gehört
   und nicht in eine Lücke neben eine Beschriftung — und melde ihn, statt den
   Zähler schichtblind zu machen, der ihn findet.
2. **Die Spurzettel weichen nicht aus** (§6.7). Ich habe Messungen dafür, dass
   sie in keinem der neun abgetasteten Zustände ein Schild treffen, und keine
   dafür, dass das Verschieben zweier gestapelter Zettel gefahrlos ist.
3. **`weicheAus` prüft nach einer Verschiebung die schon geprüften Zonen nicht
   erneut.** Bei vier bis sechs Zonen ist das in allen gemessenen Zuständen
   folgenlos (A3 = 0 dort), aber es ist eine Schleife ohne Fixpunkt. Wer eine
   siebte Zone hinzufügt, prüft das nach.
4. **Ein Knopf dieses Stücks ist 22 px hoch** (`gg-winzig`, „zeigen") — unter
   den 24 px, die die vierte Latte empfiehlt. Er ist **unverändert aus dem
   Vorzustand**, `lesbarkeit.mjs` zählt ihn bei 1366×768 nicht (0 von 308),
   und meine eigene Sonde meldet ihn trotzdem. Ich habe ihn nicht angefasst,
   weil er nicht zu meinen Auflagen gehört; er steht hier, damit er nicht
   verlorengeht.
5. **Zwei Zahlen dieser Welle stammen aus einem Satz, den ich nicht selbst
   gefahren habe:** ρ e1 und e2 wurden zuerst vom zweiten Anlauf gemessen. Ich
   habe beide auf dem heutigen Stand **wiederholt** — `nach3-e1/e2` sind
   byteweise gleich mit `nach2-e1/e2`. Es ist also nichts übernommen, sondern
   nachgemessen.

### Für den nächsten, der hier weiterarbeitet

* **`data-a3zonen` ist der Griff an dieser Ausweiche.** Steht dort 0, weicht
  das Stück gerade nichts aus — und eine leere Zonenliste sieht in jeder
  anderen Messung aus wie „nichts im Weg". An genau dieser Verwechslung sind
  vier Messungen vorbeigelaufen.
* **`lesbarkeit.mjs` sagt nur das erste Wort der Klasse.** `gegner-w11/schmal.mjs`
  und `bandrand.mjs` sagen, welcher Kasten, um wieviel und ob Ziffern
  betroffen sind. Ohne die beiden hätte ich Änderung 12 nie gefunden.
* **Ergebnisse gehören nie in eine `.log`-Datei** (§7.9).

---

## 9 — ZUR BISTABILITÄT IN 1350: was dieses Stück dazu beitragen kann

Der Stand der Aufsicht (`b857fc7`) hält die Welle an, weil **1350 nicht mehr
dieselbe Partie spielt**: dreimal einzeln gemessen, null Fehler, Kennzahl
+0,191 · +0,191 · −0,521, Spannweite 0,712 — größer als die Latte selbst. Der
Vorzustand war dreimal byteweise gleich. Die Trennprobe soll klären, welches
der drei Stücke es ist.

**DER GEGNER hat 1350 dreimal gemessen, auf zwei unabhängig aufgesetzten
Mischständen, und dreimal dieselbe Datei erhalten:**

| Lauf | Stand | md5 der 400-Wochen-Reihe |
|---|---|---|
| `vor-e1` | `7896ee6`, Hafen 8961 | `901a9365…` |
| `nach-e1` | `7896ee6+gegner-f921d8abdd12`, Hafen 8962 | `236412a2…` |
| `nach2-e1` | derselbe Mischstand, **nach Container-Reset neu aufgesetzt** | `236412a2…` |
| `nach3-e1` | `7896ee6+gegner-8188005c786e` (mit Änderung 12) | `236412a2…` |

Und `vor-e1` unterscheidet sich von allen dreien in **genau einem Feld**:
`hafen` (8961 gegen 8962). Kennzahlreihe, Kassenreihe, Nennerpreise,
Zugdeckung, Jahre unter 1× — Ziffer für Ziffer gleich.

**Damit ist für dieses Stück belegt:**

* Der Vorzustand ist auf meinem Weg **nicht bistabil** — vier Läufe in 1350
  auf drei verschiedenen Ständen, alle identisch.
* Ein Mischstand aus `7896ee6` **plus nur den Dateien des GEGNERS** spielt
  dieselbe Partie wie `7896ee6` allein, bitgleich.
* Dasselbe gilt für 1600, 1884 und 1970 (§7.12: `vor ↔ nach3` unterscheidet
  sich in allen vier Epochen nur im Feld `hafen`).

Das ist kein Freispruch für DEN GEGNER am **Integrationsstand** — dort liegen
alle drei Stücke übereinander, und Bistabilität kann aus einem Zusammenspiel
entstehen, das keiner der drei allein zeigt. Es ist aber die Zahl, die eine
Trennprobe von diesem Stück braucht: **allein gemessen ist dieses Stück in
allen vier Epochen bitstabil gegen den Vorzustand.**

Ein Grund, warum das plausibel ist und nicht nur gemessen: dieses Stück ruft
seit Änderung 7 **vier bis sechs `getBoundingClientRect` je Epoche und Partie**
(einmal je Epoche, danach aus `ZONEN` bedient) statt bei jedem Bildaufbau. Die
Randwache (`amRand`/`randDx`) rechnet ganz ohne DOM-Abfrage, aus den
Höchstbreiten im Stil. Layoutabfragen im Zeichentakt sind der bekannte Weg,
auf dem dieselbe Saat zweimal verschieden läuft — der Rahmen hat das in
Welle 10 gemessen. Wer die Bistabilität sucht, sucht dort nach einem Stück,
das im Takt misst.
