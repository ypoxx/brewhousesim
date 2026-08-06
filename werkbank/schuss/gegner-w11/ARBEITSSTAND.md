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
