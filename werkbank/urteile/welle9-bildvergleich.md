# Welle 9 — Bildvergleich, blind

*Erste Latte. Ein fremdes Auge hält den gebauten Bildschirm gegen die vier Zielblätter
und beantwortet je Epoche eine einzige Frage: **Gewinnt das Zielbild noch?***

---

## 1 — Wie gemessen wurde

**Messstand.** `curl -s http://127.0.0.1:8907/.messstand-marke` → `37f4b44`, geprüft vor der
ersten und nach der letzten Aufnahme. Jeder Browser lief durch
`werkbank/schuss/aufsicht/messfenster.sh` mit `HAFEN=8907 MESSFENSTER_WARTE=7200`; das Fenster
war beim ersten Aufruf 557 s belegt, danach 108 s und 120 s. Nie zwei Browser nebeneinander.

**Fläche.** 2752×1536, dieselbe Fläche wie die Zielblätter. Kein Skalieren, kein Zuschneiden.

**Was gefahren wurde.** `werkbank/schuss/bild-w9/aufnehmen.mjs` (eigenes Gerät, nicht geerbt),
je Epoche `?epoche=N&saat=1350`:

* **Zustand A** — Aufnahme 1,8 s nach `networkidle`, ohne einen einzigen Klick.
* **Zustand B** — danach 34 Runden: je Runde `stadt:bauhof` aufklappen, alle freigegebenen
  `stadt:bau:*` der Reihe nach klicken (max. 5), Bauhof zuklappen, `weiter` klicken.
  Aufnahme nach 0,9 s Ruhe.
* **Zustand C** — Zustand B nach einem `Escape`.

**Klickprotokolle** liegen als `werkbank/schuss/bild-w9/bilder/e*-protokoll.txt` daneben.
Zusammengefasst:

| Epoche | Klicks | davon Bauklicks | gebaut | Endstand | `BRAUHAUS.lage` | Seitenfehler |
|---|---|---|---|---|---|---|
| 1350 | 73 | 5 | Grutkammer · Gärbottiche · Ochsenstall · Gewölbekeller · Küferei | 1351/5, Kasse 36 Pf | 0 | keine |
| 1600 | 74 | 6 | Gärbottiche · Waschhaus · Kontor · Rossmühle · Hopfenlager · Pferdestall | 1601/5, Kasse 85 fl | 0 | keine |
| 1884 | 73 | 5 | Kontor · Hopfenlager · Pferdestall · Mälzereiturm · Flaschenhalle | 1885/5, Kasse 3.214 M | 0 | keine |
| 1970 | 72 | 4 | Fahrzeugwaage · Mälzereiturm · Verwaltungsbau · Neues Sudhaus | 1971/5, Kasse 52.661 DM | 0 | keine |

**md5 jeder Aufnahme** (`bilder/`):

```
0e3b300a24645e057009577a1fdbe6bb  e1-a-laden.png
dbf8ed95778fb036276d1505bf59953e  e1-b-gespielt.png
dbf8ed95778fb036276d1505bf59953e  e1-c-gespielt-esc.png
32197bc02d43ba0241735faa41d11d56  e2-a-laden.png
f7c1cc0c2f140285b477ba29d99d5c67  e2-b-gespielt.png
f7c1cc0c2f140285b477ba29d99d5c67  e2-c-gespielt-esc.png
814c93059eb3b6f8cd5acbea85e7353e  e3-a-laden.png
392e87bc50f151f85f4558af4c9b00f2  e3-b-gespielt.png
8cfb96ee26ed8b4c8d12a0f69e61329f  e3-c-gespielt-esc.png
9c3872d6070918fa9001c3d1c0d4b1c4  e4-a-laden.png
d8af8997b1a7f0c944ef4e41b2ab4af7  e4-b-gespielt.png
734c47ce9b2ce54c0544262f658fee15  e4-c-gespielt-esc.png
```

In 1350 und 1600 sind B und C **byteweise identisch** — `Escape` ändert dort nichts; es gab
keine offene Tafel zum Schließen. In 1884 und 1970 unterscheiden sie sich.

**Was ich gelesen habe:** `gauntlet/MESSLATTE.md`, `zielbild/README.md`, `zielbild/prompts/*`,
`spiel/LIESMICH.md`, `spiel/index.html`, Teile von `stuecke/stadt.js` (nur um den Bauhof
bedienen zu können), `werkbank/schuss/aufsicht/messfenster.sh`,
`werkbank/schuss/aufsicht/deckung-je-stueck.mjs` und `werkbank/schuss/bild-w8/deckung.mjs`
— beide nur als Messgerät, und **beide habe ich verworfen**, siehe §2.

**Was ich nicht gelesen habe:** nichts unter `werkbank/urteile/`, nicht
`werkbank/LAUFENDER-AUFTRAG.md`, keine `gauntlet/WELLE-*.md` (auch nicht
`gauntlet/EPOCHENBOGEN.md`, das nicht auf meiner Leseliste stand), nichts unter
`werkbank/schuss/stadt-w9/`, keine `berichte/`- oder `bogen/`-Ordner, keine `BEFUND-*.md`
in `spiel/`, kein `stand.json`, kein `git log`, `git show` oder `git diff`.
**Ich bin nicht befangen.**

> **Ein Hinweis, den die Aufsicht braucht, und den ich melde, statt ihn zu verschweigen.**
> Diese Datei lag beim Beginn meiner Arbeit **nicht auf der Platte** — ich habe sie neu
> angelegt. `git status` weist sie aber als *geändert* (` M`) aus, nicht als *unverfolgt*:
> unter demselben Pfad steht also im Baum eine ältere Fassung, die ich **nie gesehen habe**
> und die die Platte auch nicht enthielt. Ein Vergleich der beiden Fassungen wird deshalb
> aussehen wie eine Überschreibung; er ist keine. Wenn dort ein früheres Urteil steht, ist
> es durch mein Schreiben auf der Platte nicht verlorengegangen, sondern nur im Arbeitsbaum
> ersetzt — im Baum liegt es weiter. Ich habe es nicht aufgerufen und weiß nicht, was
> darin steht.

---

## 2 — Zwei geerbte Messgeräte, die ich verworfen habe

`werkbank/schuss/aufsicht/deckung-je-stueck.mjs` und `werkbank/schuss/bild-w8/deckung.mjs`
trennen **nach Ebene**: `platte` und `bau` gelten als Bild, alles darüber als Oberfläche
(Zeile 38–41 des ersten). Das stimmt für dieses Spiel nicht. In `spiel/index.html:57–60`
liegen `marken`, `hand` und `blatt` über `bau`, und in der Probe trägt die Ebene `marken`
vier Fächer — `fach-gegner`, `fach-sud`, `fach-name`, `fach-stadt` —, die Ebene `hand`
drei. Auf denselben Ebenen stehen die **gemalten Ortsschilder, Fässer und Wagen**. Wer sie
pauschal ausblendet, löscht Welt und misst zu viel.

Mein Gerät `werkbank/schuss/bild-w9/deckung.mjs` trennt **nach Eigenschaft**: Kasten ist,
was einen deckenden Grund (`background-color` mit α > 0,35 oder einen Verlauf) oder einen
sichtbaren Rahmen (≥ 1 px, α > 0,3) hat; was nur ein freigestelltes Bild trägt, ist Welt.
Gezählt wird in **Bildpunkten** (zwei Aufnahmen, Schwelle 8 Stufen je Kanal), nicht in
Rechteck-Hüllen — eine Hülle deckt nicht, was in ihr durchsichtig ist.

Die Epochenplatte selbst wird ausgenommen: sie ist das einzige Element, dessen Fläche den
ganzen Schirm füllt.

---

## 3 — Der Befund

### 3.1 Was zuerst auffällt, in jeder einzelnen Epoche

Die Zielblätter tragen **zwei** Dinge, die keine Welt sind: die Kopfleiste oben Mitte und
die WEITER-Tafel unten rechts. Sonst nichts. Ausgemessen an `01-1350.jpg`: Kopfleiste
1610 × 72 px, WEITER-Tafel 262 × 62 px — zusammen **132.164 von 4.227.072 Bildpunkten,
also 3,1 %**. Der Rest der Fläche ist gemalte Welt, randlos, bis in jede Ecke.

Das gebaute Spiel trägt in **allen vier** Epochen, schon im Ladezustand, folgende Kästen
gleichzeitig auf dem Schirm (Koordinaten in der Fläche 2752 × 1536, aus `e*-a-laden.png`):

| # | Kasten | ungefähr | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|---|---|
| 1 | Reiterzeile oben links, 10–11 dunkelbraune Karteireiter | x 35–890, y 120–235 | ✓ | ✓ | ✓ | ✓ |
| 2 | Kopfleiste mit **sieben** Feldern | x 570–2185, y 50–110 | ✓ | ✓ | ✓ | ✓ |
| 3 | Titelband „Brauhaus zum Anker · Jahr · Name · Leitwort" | x 955–1805, y 160–200 | ✓ | ✓ | ✓ | ✓ |
| 4 | „Michaelitafel · 5 Angebote", 6 Zahlenzeilen | x 2085–2720, y 52–170 | ✓ | ✓ | ✓ | ✓ |
| 5 | „Chronik des Hauses …" | x 2085–2720, y 195–245 | ✓ | ✓ | ✓ | ✓ |
| 6 | „DER SUD · Jahr", großes Blatt mit 4–6 Knöpfen | ~350 × 240 | ✓ | ✓ | ✓ | ✓ |
| 7 | Gegnerkarte („BRAUHAUS ZUM ADLER" / „ADLER-BRÄU AG") | ~390 × 165 | ✓ | ✓ | ✓ | ✓ |
| 8 | „DAS ERBE"-Band mit vier Preisfeldern | x 1490–2705, y 1110–1195 | ✓ | ✓ | ✓ | ✓ |
| 9 | Band „UMKÄMPFT …" | x 1810–2580, y 1285–1320 | ✓ | ✓ | ✓ | ✓ |
| 10 | Band „nächster Zug: …" | x 1710–2680, y 1360–1400 | ✓ | ✓ | ✓ | ✓ |
| 11 | WEITER-Tafel, deutlich größer als im Zielblatt | x 2295–2705, y 1425–1510 | ✓ | ✓ | ✓ | ✓ |
| 12 | 4–8 freistehende Wirtskästen („ablösen …" / „Fass an den Wirt") | je ~230 × 100 | ✓ | ✓ | ✓ | ✓ |
| 13 | Grüner Klagekasten | ~270 × 75 | ✓ | ✓ | ✓ | ✓ |
| 14 | „DER ANKER · RUF n" mit Anschlagzeile | ~280 × 90 | ✓ | ✓ | ✓ | ✓ |
| 15 | Notenknopf oben links | ~50 × 50 | ✓ | ✓ | ✓ | ✓ |

Das sind **zwei Kästen im Zielblatt gegen mindestens fünfzehn im Spiel**, und die
Verteilung ist die eigentliche Wunde: die Zielblätter halten ihre beiden Kästen am **oberen
Rand und in einer Ecke**. Das Spiel legt seine Kästen quer über die **Bildmitte** — genau
dorthin, wo der Brauhof steht.

### 3.2 Was das Spiel gewonnen hat — und es ist viel

Damit kein falscher Eindruck entsteht: **die gemalte Welt darunter hält dem Zielblatt
stand.** Strichführung, Farbe, Kamera, Horizonthöhe und Ort stimmen so genau überein, dass
ich beim ersten Hinsehen bei allen vier Blättern kurz unsicher war, welches welches ist,
solange man die Kästen wegdenkt. Konkret:

* **1884** — der rote Backsteinschlot mit dunkler Rauchfahne steht bei x ≈ 540, y ≈ 250–910
  und läuft oben aus dem Bild; im Zielblatt bei x ≈ 500, y ≈ 110–780. Die **Kupferhaube**
  auf dem Sudhaus (x ≈ 790, y ≈ 460) sitzt im Zielblatt bei x ≈ 800, y ≈ 400. Die **vier
  Gärtanks** mit dem Rohr obendrüber stehen an derselben Stelle. Der **Eiskeller** ist als
  begrünter Hügel mit Steinbogen gebaut, davor liegen **weiße Eisblöcke** — das steht so in
  keinem Zielblatt und ist besser als das Zielblatt.
* **1970** — das Mauerfragment mit **genau einem Rundturm** in einer Grünanlage **mit
  Bänken** steht bei x ≈ 250–460, y ≈ 270–540. Der Prompt verlangt das ausdrücklich
  („about thirty metres of wall and ONE round tower … with benches"), und das Zielblatt
  selbst zeigt es kleiner und ohne erkennbare Bänke. **Hier schlägt das Spiel das
  Zielbild.** Ebenso der **Stadtbus** (x ≈ 1310–1500, y ≈ 940–1050), der im Zielblatt
  gefordert, aber schlecht zu finden ist.
* **1970** — der Schlot von 1884 **steht und raucht nicht**. Die härteste Einzelforderung
  des 1970er Blatts ist erfüllt.
* **„GEGR. 1350"** auf dem Hoftorschild — das Zielblatt `03-1884.jpg` trägt an dieser
  Stelle den bekannten Fehler „GEGR. 1356". **Das Spiel hat recht und das Zielbild
  unrecht.**
* **Die Monatsnamen.** Die Zielblätter schreiben viermal „MAI". Das Spiel schreibt
  „SCHEIDING 1350", „GILBHART 1351", „SEPTEMBER 1884", „OKTOBER 1971" — alte Monatsnamen in
  I/II, neue in III/IV. Das ist reicher als die Latte.
* **Der Gegner heißt in jeder Epoche anders**: „Brauhaus zum Adler" (1350) → „Braustatt
  Adler" (1600) → „Brauerei Adler" (1884) → „Adler-Bräu AG" (1970). Die Zielblätter kennen
  nur „BRAUEREI ADLER". Auch das ist reicher.
* **Gekaufte Hofbauten stehen wirklich im Bild.** Nach 34 Wochen sind in 1350 Grutkammer
  (mit hängenden Kräuterbündeln), Gärbottiche, Ochsenstall, Gewölbekeller (begrünter Hügel
  mit Steinbogen) und Küferei (Strohdach) im Hof zu sehen; in 1970 steht das **Neue Sudhaus
  als Glaskasten mit sichtbaren Kupferkesseln** (x ≈ 730–940, y ≈ 750–940). Das ist echtes
  Wachstum im Bild und keine Kulisse.

### 3.3 Die Deckung in Bildpunkten — die Zahl, um die es geht

Gemessen mit `bild-w9/deckung.mjs`, drei Zustände, alle vier Epochen:

| | gesamt | oberstes ⅙ | Mittelband | unterstes ⅙ |
|---|---|---|---|---|
| **Zielblatt** (Kopfleiste + WEITER, von Hand ausgemessen) | **3,1 %** | 16,5 % | 0 % | 2,3 % |
| Spiel, **Ladezustand** — 1350 | 22,0 % | 50,6 % | 17,0 % | 13,4 % |
| Spiel, Ladezustand — 1600 | 22,6 % | 51,2 % | 18,2 % | 11,9 % |
| Spiel, Ladezustand — 1884 | 22,3 % | 52,1 % | 17,2 % | 12,5 % |
| Spiel, Ladezustand — 1970 | 22,8 % | 53,1 % | 17,9 % | 11,9 % |
| Spiel, **nach 30× WEITER** — 1350 | 50,9 % | 63,1 % | 57,3 % | 13,0 % |
| … 1600 | 50,3 % | 64,0 % | 56,4 % | 12,4 % |
| … 1884 | 47,0 % | 64,2 % | 51,5 % | 12,0 % |
| … 1970 | **55,7 %** | 66,5 % | 63,5 % | 13,6 % |
| Spiel, **30× WEITER, dann 3× Escape** — 1350 | 51,1 % | 51,6 % | 59,8 % | 16,0 % |
| … 1600 | 50,6 % | 52,7 % | 59,0 % | 15,0 % |
| … 1884 | 50,8 % | 52,9 % | 59,4 % | 14,0 % |
| … 1970 | **52,9 %** | 57,9 % | 61,0 % | 15,2 % |

Drei Sätze zu dieser Tabelle, und alle drei sind wichtig:

**Erstens: schon im Ladezustand ist die Deckung siebenfach.** 22 % gegen 3,1 %. Im obersten
Sechstel deckt das Spiel **über die Hälfte** der Fläche, das Zielblatt ein Sechstel.

**Zweitens: nach dreißig Wochen ist mehr als die Hälfte des Bildes weg.** Die Ursache ist
zum großen Teil eine **berechtigte Lesetafel** — „Von Georgi 1971 bis Michaeli — der Sommer
und der Zahltag", 1596 × 943 px bei (578, 169), also 35,6 % der Fläche allein. Sie steht am
Jahreswechsel und trägt unten selbst den Satz *„Solange die Tafel auf dem Tisch liegt, ruht
die Woche."* Das ist ein Modal, kein Unrat, und ich rechne es dem Spiel nicht als Schmutz an.

**Drittens, und das ist der eigentliche Fund: Escape räumt nicht auf, es tauscht.** Drei
Escape-Anschläge schließen die Georgi-Tafel — und darunter liegt bereits die nächste,
`erb-buch blatt`, **1156 × 1075 px bei (55, 207)**, „DAS ERBE — Festschreiben notariell, im
Liefervertrag · II. Hand". Sie deckt die **gesamte linke Bildhälfte samt dem kompletten
Brauhof** zu, also genau das Motiv, um das das ganze Spiel geht. Die Gesamtdeckung sinkt
dadurch nicht (51,1 % statt 50,9 % in 1350; 52,9 % statt 55,7 % in 1970), sie **wandert nur
von oben in die Mitte**: das oberste Sechstel fällt von 63 % auf 52 %, das Mittelband steigt
von 57 % auf 60 %. Nachweis: `bilder/e4-w30-esc.png` (md5 `e7779e2a…`) und
`bilder/e1-w30-esc.png` (md5 `bcd9dc4c…`).

Dazu kommt: das untere Drittel dieser Erbe-Tafel ist **leer** — etwa 40 % ihrer Fläche
trägt nichts als Grund. Sie deckt 28 % des Bildes zu, um 60 % ihrer selbst zu füllen.

**Die Gegenprobe auf mein eigenes Gerät — in allen vier Epochen gemacht.**
`bilder/e1-nackt.png` … `e4-nackt.png` zeigen, was übrig bleibt, wenn man nur die Kästen
ausblendet. Es bleibt jedes Mal eine **vollständige, randlose, unbeschädigte gemalte Welt** —
1350: Stadtmauer, Kirche, Fachwerk, Brauhof mit Pfanne und Brauerinnen, Holzsteg,
Wassermühle, Marktstand, Gänse, Schwein, Ochsenkarren, Straßenlaterne. 1600: Kirchturmhelm,
Renaissance-Giebel, Marktbrunnen mit Menge, zwei Steinbogenbrücken, Reb-/Hopfenzeilen.
1884: Schlot mit Rauchfahne, Kupferhaube, drei Gärtanks, Eiskeller mit Eisblöcken, Zug am
Bahnhof, Adler-Werk mit Flamme. 1970: Mauerfragment mit Rundturm und Bänken, Wohnblöcke,
Tankstellendach, Bus, Lastwagen, Käfer, Asphalt mit Mittelstrich, Fahrleitung.
**Kein einziges gemaltes Gebäude ist mitgelöscht worden.** Das ist der Beleg, dass die
Trennung nach Eigenschaft trägt und dass die 22 % nicht dadurch entstehen, dass ich Welt zu
Oberfläche erklärt hätte.

Diese vier nackten Aufnahmen sind zugleich der stärkste Satz, den ich über diese Welle sagen
kann: **hält man sie neben die Zielblätter, gewinnt kein Zielblatt mehr klar.** 1884 und 1970
gewinnt eher das Spiel. Erst wenn man die Oberfläche wieder einschaltet, kippt jedes einzelne
Blatt zurück.

*(Ein zugegebener Rest: die vier gemalten Ortsschilder — ST. MICHAEL, GASTHOF LINDENHOF,
BRAUEREI ADLER, das Hoftorschild — haben einen deckenden Grund und zählen deshalb als
Kasten, obwohl sie in den Zielblättern gemalt sind. Zusammen sind das rund 28.000 px², also
**0,7 Prozentpunkte**. Die ehrliche Zahl ist damit 21,3 % statt 22,0 % — an der Größenordnung
ändert das nichts.)*

### 3.4 Was in den Bildpunkten fehlt oder falsch steht — verortet

**(A) 1350 · Das Hoftorschild „BRAUHAUS ZUM ANKER" ist zugedeckt.**
Zielblatt `01-1350.jpg`: ein großes helles Brett auf einem Pfosten, x ≈ 1140–1350,
y ≈ 900–1010, mit Anker und den Worten BRAUHAUS / ZUM ANKER in dunklen Majuskeln — eines
der drei am besten lesbaren Objekte des ganzen Bildes.
Spiel `e1-a-laden.png` und `e1-c-gespielt-esc.png`: an derselben Stelle steht dasselbe
Brett, aber die Tafel **„DER SUD · 1350"** liegt darüber. Sichtbar ist **nur die
Fußzeile „GEGR. 1350"** bei x ≈ 1385, y ≈ 1235. Der Name des eigenen Hauses fehlt im Bild.
Ausschnitt: `bilder/schnitt-schild1-e1-a-laden.png` gegen `schnitt-schild1-01-1350.png`.
In 1600, 1884 und 1970 steht dasselbe Schild frei und ist dort **schöner gesetzt als im
Zielblatt** — der Fehler betrifft ausschließlich 1350.

**(B) 1884 · „ST. MICHAEL" fehlt ganz.**
Zielblatt `03-1884.jpg`: eine helle Tafel am Kirchturm, x ≈ 1795–1990, y ≈ 785–815.
Spiel `e3-a-laden.png` **und** `e3-c-gespielt-esc.png`: der Turm steht an derselben Stelle,
**ohne jede Beschriftung**. In 1350, 1600 und 1970 ist die Tafel da. Ausschnitt:
`bilder/schnitt-kirche3-e3-a-laden.png` gegen `schnitt-kirche3-03-1884.png`.

**(C) 1884 · „GASTHOF LINDENHOF" wird von der Gegnerkarte angeschnitten.**
Spiel `e3-c-gespielt-esc.png`, Ausschnitt `bilder/schnitt-gastlabel-e3-c-gespielt-esc.png`
bei 5× Vergrößerung: die Buchstaben „O" und „F" am Ende sind **in der oberen Hälfte
weggeschnitten**, weil die Unterkante der Karte „BRAUEREI ADLER" darüberliegt. Kein
Rollkasten, keine Kürzung — eine Überdeckung. Im Zielblatt ist der Name vollständig.

**(D) 1600 · Der Darre-Schlot mit Rauch fehlt.**
Zielblatt `02-1600.jpg` trägt in der linken Bildhälfte **zwei graue Rauchfahnen**: eine aus
einem hohen, sich verjüngenden Steinschlot bei x ≈ 490, y ≈ 300–620, eine zweite aus einem
großen Kessel bei x ≈ 1010, y ≈ 530–640. Sie sind die einzigen senkrechten Elemente, die
1600 von 1350 unterscheiden.
Spiel `e2-a-laden.png` und `e2-c-gespielt-esc.png`: **auf unserem Hof raucht nichts**, und
es gibt dort keinen Schlot. Die einzige Rauchfahne im ganzen Bild ist ein kleiner Kringel
über einem Stadthaus bei x ≈ 1200, y ≈ 580. Der 1600er Umriss verliert damit sein
Erkennungszeichen. Ausschnitt: `bilder/schnitt-darre2-02-1600.png` gegen
`schnitt-darre2-e2-c-gespielt-esc.png`.
**In der nackten Aufnahme `e2-nackt.png` bestätigt**, also nicht bloß von einem Kasten
verdeckt: die einzigen senkrechten Akzente des Hofes sind ein Dachreiter und der Kontorturm.
Dieselbe Aufnahme zeigt einen zweiten Unterschied: das Zielblatt zeigt das Brauhaus mit
**offener Steinarkade im Erdgeschoss**, in deren Bögen Fässer lagern; das Spiel zeigt an
derselben Stelle überwiegend **Dachfläche**.

**(E) 1350 · Die Braupfanne ist zu klein, und sie steht in einer Pfütze.**
Zielblatt: die offene Kupferpfanne über offenem Feuer misst rund **150 × 90 px**, zwei
Brauerinnen in langen Kleidern rühren mit Paddeln, Dampf steigt auf — das ist der optische
Mittelpunkt des Hofes.
Spiel `e1-a-laden.png`: dieselbe Pfanne misst rund **70 × 45 px** bei x ≈ 790, y ≈ 1075,
und um das Feuer herum liegt eine **hellblaue Fläche**, die wie eine Wasserlache aussieht.
Statt zweier großer Figuren stehen **acht kleine** im Hof verteilt; keine von ihnen rührt
erkennbar in der Pfanne. Ausschnitt `bilder/schnitt-hof1-e1-a-laden.png` gegen
`schnitt-hof1-01-1350.png`, beide 1:1.

**(F) Alle Epochen · Zwei Fernschreiber-Bänder im untersten Sechstel.**
Spiel, alle vier Epochen, Ladezustand wie gespielt: zwei Bänder in Schreibmaschinenschrift
auf flachem Grund, x ≈ 1810–2580 / y ≈ 1285–1320 („UMKÄMPFT Ablösung … · Kasse reicht 4,2×")
und x ≈ 1710–2680 / y ≈ 1360–1400 („nächster Zug: … (Kasse reicht 4,2×)"). Zusammen mit der
WEITER-Tafel bedecken sie die **rechten 45 % des untersten Sechstels**.
Im Zielblatt liegt an derselben Stelle: Asphalt mit weißer Mittellinie, ein gelber Käfer,
eine rote Limousine, eine hellgrüne Limousine, ein Baum, der Fluss — und sonst nur die
WEITER-Tafel. Ausschnitte `bilder/schnitt-unten4-04-1970.png` gegen
`schnitt-unten4-e4-c-gespielt-esc.png` und `schnitt-unten1-01-1350.png` gegen
`schnitt-unten1-e1-a-laden.png`.
Die Angabe „Kasse reicht 4,2×" ist eine **Messgröße aus der zweiten Latte**, die auf dem
Bildschirm des Spielers steht. Sie gehört in kein Bild.

**(G) 1970 · Zwei Kästen zeigen nicht darstellbare Zeichen.**
Spiel `e4-a-laden.png` und `e4-c-gespielt-esc.png`: ein Kästchen „FAE" bei x ≈ 2235–2280,
y ≈ 990–1030 trägt darunter **zwei leere Rechtecke** in Rot — die klassische Ersatzdarstellung
für ein Zeichen, das keine geladene Schrift zeichnen kann. In `e4-w30-esc.png` steht dasselbe
ein zweites Mal bei „BRU", x ≈ 2405, y ≈ 1055. Ausschnitt
`bilder/schnitt-fae4-e4-c-gespielt-esc.png` bei 3×.

**(H) 1970 · Ein Kasten hängt aus dem Bild.**
Spiel `e4-c-gespielt-esc.png`: am rechten Bildrand, x ab ≈ 2725, y ≈ 200–240, steht ein
Kasten mit **rot gestricheltem Rahmen**, von dem nur die Buchstaben „Wo" im Bild sind; der
Rest liegt außerhalb der 2752 px. Die Bühne füllt den Viewport exakt und rollt nicht — das
ist also kein Rollkasten, sondern ein Element, das über den Bildrand hinausragt. Ausschnitt
`bilder/schnitt-ecke4-e4-c-gespielt-esc.png`.

**(I) 1970 · Zwei Beschriftungen sind gekürzt, nicht übergelaufen.**
Spiel `e4-c-gespielt-esc.png`, Band DAS ERBE: die Knöpfe lesen **„Nachschrift · 2 Hä…"** und
**„Versorgungszusage · j…"**. Beide tragen ein Auslassungszeichen; der Rest ist fort. Das
sind Kaufknöpfe mit Preisschild (−28.366 DM bzw. −965 DM) — der Spieler sieht den Preis,
aber nicht, wofür. In `e4-a-laden.png` steht dieselbe Zeile als „Versorgungszusag…".
Ich habe geprüft, ob es nur ein Rollkasten ist: es ist keiner, das Auslassungszeichen ist
gesetzt. Ausschnitt `bilder/schnitt-erbe4-e4-c-gespielt-esc.png`.

**(J) Alle Epochen · Preis und Währung brechen um.**
1350 `e1-a-laden.png`, Kasten „DER ANKER · RUF 10": „Umtrunk beim Wirt" — „**−9**" in der
einen Zeile, „**Pf**" in der nächsten. 1884: „**−240**" / „**M**". 1970: „**−1.800**" /
„**DM**". Die Währung steht jedes Mal allein auf einer zweiten Zeile. Im Zielblatt steht
Geld immer in einem Stück.

**(K) 1350 · Die Sud-Tafel bricht ihre eigene Tabelle.**
`e1-a-laden.png`, Ausschnitt `schnitt-schild1-e1-a-laden.png`: die Zeile lautet
„Gärkeller 0/10   Zeug 70 % · Fass" und darunter „Fass        ×1,05". Das Wort „Fass" der
rechten Spalte ist in die nächste Zeile gerutscht und steht dort unter dem Wort „Gärkeller".
In 1884 dasselbe: „…36/36 Führung 70 % · Fass" / „×1,05".

**(L) Nach 30 Wochen · Die Reiterzeile ist auf 14 Reiter gewachsen und läuft über.**
`e4-w30-esc.png`, Ausschnitt `bilder/schnitt-reiter30-e4-w30-esc.png` bei 3×: die Zeile
reicht von x ≈ 35 bis x ≈ 2320, also über **83 % der Bildbreite**, und ist zweizeilig, weil
der Reiter „MITBIETEN · GASTHOF LINDENHOF" umbricht, während alle anderen einzeilig sind.
Bei zwei Reitern läuft der letzte Buchstabe über den eigenen Rand: das „N" von **„DIE GRUPPE
FRAGT AN"** und das „N" von **„OHNE DICH GESCHEHEN"** sitzen halb auf der Reiterkante.

**(M) Alle Epochen · Sieben braune Scheiben liegen im Straßenstaub.**
Die Ortsmarken (`stadt:marke:*`, 26 × 26 px) erscheinen als **flache dunkelbraune Kreise mit
Goldrand**, ohne Beschriftung im Ruhezustand, verteilt über Straßen und Wege — z. B. in
`e1-a-laden.png` bei (1555, 745), (2010, 975), (2300, 1035). Ausschnitt
`bilder/schnitt-sudwrap-e1-a-laden.png` zeigt zwei davon bei 4×: sie sehen aus wie große
Münzen, die auf dem Weg liegen. Kein Zielblatt kennt so etwas.

**(N) 1970 · Die Leuchtschrift schwebt.**
Zielblatt `04-1970.jpg`: „BRAUHAUS ZUM ANKER" steht als **großes helles Schild auf der
Dachkante** der Abfüllhalle, x ≈ 765–990, y ≈ 585–655, sichtbar montiert.
Spiel `e4-a-laden.png`: dasselbe Schild ist kleiner (x ≈ 1155–1330, y ≈ 990–1050) und hängt
**frei in der Luft über der Straße**, zwischen Halle und Bus, ohne erkennbare Befestigung.
Ausschnitt `bilder/schnitt-marke4-e4-c-gespielt-esc.png`.

**(O) Nach dem Bauen · Der Hof verfilzt.**
`e1-c-gespielt-esc.png` gegen `e1-a-laden.png`: die fünf gekauften Bauten sind da und sind
gut gezeichnet — aber ihre Dächer **überlagern einander und das Wohnhaus**, so dass im
oberen Hofdrittel eine ununterscheidbare braune Dachmasse entsteht. Der Gewölbekeller
(begrünter Hügel) wird von der Fassreihe halb verdeckt, die Küferei schiebt ihr Strohdach
über den Ochsenstall. `e3-c-gespielt-esc.png`: der neue Mälzereiturm bei x ≈ 1140–1310,
y ≈ 510–715 steht **vor den vier Gärtanks** und nimmt ihnen die obere Hälfte. Im Zielblatt
steht jedes Bauwerk frei und ist einzeln lesbar.

---

## 4 — Das Urteil je Epoche

Die Frage lautet: **Gewinnt das Zielbild noch?**

### 1350 — **Zielbild gewinnt**

Die gemalte Welt ist ebenbürtig (`e1-nackt.png` beweist es). Aber drei Bildpunkte-Befunde
gehen gegen das Spiel, und sie treffen alle den Mittelpunkt: das **Hoftorschild ist
zugedeckt** (A) — der Name des eigenen Hauses steht nicht im Bild —, die **Braupfanne ist
weniger als halb so groß** wie im Zielblatt und steht in einer blauen Lache (E), und die
zwei Brauerinnen sind durch acht kleine Figuren ersetzt, von denen keine rührt. Dazu 22 %
Deckung gegen 3,1 %, nach dreißig Wochen 51 %. Das Zielblatt zeigt in derselben Fläche mehr
Brauerei als das Spiel.

### 1600 — **Zielbild gewinnt**

Hier steht das Anker-Schild frei und ist sogar besser gesetzt als im Zielblatt, die
Renaissance-Giebel, der Kirchturmhelm, der Marktbrunnen, die Steinbogenbrücken und die
Hopfen-/Rebzeilen sitzen. Es fehlt aber das eine Ding, das 1600 überhaupt erst zu 1600 macht:
**die Darre und ihr Rauch** (D). Ohne senkrechten Schlot und ohne Rauchfahne unterscheidet
sich der Umriss des Hofes kaum von 1350 — und genau das ist der Vorwurf „vier Tapeten", nur
in Bildpunkten statt in Verblisten. Dazu dieselbe Deckung wie überall.

### 1884 — **unentschieden**

Das ist die stärkste Epoche des Spiels, und sie ist es knapp. Für das Spiel sprechen:
Schlot mit Rauchfahne, Kupferhaube, vier Gärtanks mit Rohr, Eiskeller **mit Eisblöcken**
(steht in keinem Zielblatt), Lokomotive am BAHNHOF, Adler-Werk mit Flamme, frei stehendes
Hoftorschild — und **„GEGR. 1350" statt des Zielblatt-Fehlers „GEGR. 1356"**. Gegen das
Spiel: **„ST. MICHAEL" fehlt vollständig** (B), **„GASTHOF LINDENHOF" wird angeschnitten**
(C), die Sud-Tafel deckt Marktplatz und Kirchenschiff, und nach dem Bauen verdeckt der
Mälzereiturm die Gärtanks (O). Weltseitig gewinnt das Spiel, oberflächenseitig verliert es
klar. Zusammen: unentschieden.

### 1970 — **Zielbild gewinnt**

Weltseitig ist das die beste Arbeit des ganzen Laufs — Mauerfragment mit **einem** Rundturm
in einer Grünanlage **mit Bänken** (besser als das Zielblatt), Bus mit Fahrgästen hinter den
Scheiben, Lastwagen mit Bierkästen, VW Käfer, Kombi mit Dachträger, Asphalt mit
Mittelstrich, Tankstellendach, Wohnblöcke, Fahrleitung, Adler-Tanks, **und der Schlot von
1884 steht und raucht nicht**. Trotzdem verliert das Blatt, weil hier die Oberflächenfehler
sich häufen: **zwei nicht darstellbare Zeichen im Bild** (G), ein **Kasten, der aus dem Bild
hängt** (H), **zwei gekürzte Kaufbeschriftungen** (I), die schwebende Leuchtschrift (N), und
mit **55,7 % bzw. 52,9 %** die höchste Deckung aller vier Epochen. Ein Bildschirmfoto dieser
Epoche zeigt nach dreißig Wochen mehr Kasten als Bild.

**Ergebnis: 3 × Zielbild gewinnt, 1 × unentschieden, 0 × Spiel gewinnt.**

Der eine Satz, der es trifft: **Die gemalte Welt hat die Latte eingeholt; das, was auf ihr
liegt, hat sie noch nie gesehen.**

---

## 5 — Auflagen

Jede folgt aus einem Befund oben, jede ist ohne Rückfrage abarbeitbar.

1. **Das Hoftorschild in 1350 freistellen.** Befund (A). Die Tafel `DER SUD · 1350` liegt in
   `e1-a-laden.png` über dem Anker-Schild; sichtbar bleibt nur „GEGR. 1350" bei (1385, 1235).
   Die Sud-Tafel muss dem Schild ausweichen — verschieben, nicht verkleinern. Abnahme: in
   einer Aufnahme 2752 × 1536 von `?epoche=1&saat=1350` sind die Worte BRAUHAUS ZUM ANKER
   und der Anker vollständig sichtbar, so wie sie es in Epoche 2, 3 und 4 bereits sind.

2. **„ST. MICHAEL" in 1884 nachtragen.** Befund (B). Die Tafel gibt es in 1350, 1600 und
   1970 und fehlt in 1884 in **beiden** Zuständen. Abnahme: sichtbar am Kirchturm bei
   x ≈ 1600–1720, y ≈ 780–830, in Lade- wie Spielzustand.

3. **Die Gegnerkarte darf keine gemalte Beschriftung anschneiden.** Befund (C). In
   `e3-c-gespielt-esc.png` schneidet die Unterkante der Karte „BRAUEREI ADLER" die
   Buchstaben O und F von „GASTHOF LINDENHOF" oben ab. Abnahme: die Karte weicht den vier
   Ortsschildern aus (ST. MICHAEL, GASTHOF LINDENHOF, BRAUEREI ADLER, Hoftorschild) — in
   allen vier Epochen, im Lade- wie im Spielzustand.

4. **1600 braucht Darre und Rauch.** Befund (D). Das Zielblatt trägt zwei graue Rauchfahnen
   aus der Brauerei; das Spiel keine. Abnahme: in `?epoche=2` steht auf dem eigenen Hof ein
   senkrechter Darren- oder Kesselschlot mit sichtbar aufsteigendem Rauch, und die Silhouette
   des Hofes unterscheidet sich in einer Aufnahme von der aus `?epoche=1`.
   *(Sperrlisten-Hinweis, damit niemand überzieht: kein Fabrikschornstein — die Darre ist
   ein gemauerter Kaminaufsatz, kein Industrieschlot.)*

5. **Die Braupfanne in 1350 vergrößern und die Lache entfernen.** Befund (E). Ziel:
   mindestens die Fläche, die das Zielblatt ihr gibt — rund 150 × 90 px bei 2752 × 1536,
   also etwa doppelt so breit wie jetzt. Die hellblaue Fläche um das Feuer bei (790, 1075)
   entfernen oder als etwas kenntlich machen, das nicht nach Wasser unter offenem Feuer
   aussieht. Zwei Brauerinnen am Kessel, erkennbar rührend, statt acht verteilter Figuren.

6. **Die zwei Fernschreiber-Bänder aus dem untersten Sechstel nehmen.** Befund (F). Die
   Bänder „UMKÄMPFT …" und „nächster Zug: … (Kasse reicht n×)" decken zusammen mit WEITER die
   rechten 45 % des untersten Sechstels. Abnahme: die Deckung des **untersten Sechstels**
   fällt in allen vier Epochen unter **6 %** (Zielblatt: 2,3 %), gemessen mit
   `bild-w9/deckung.mjs`. Die Angabe „Kasse reicht n×" ist eine Messgröße der zweiten Latte
   und gehört überhaupt nicht ins Bild.

7. **Die zwei leeren Rechtecke beseitigen.** Befund (G). In `e4-a-laden.png` bei (2235, 990)
   unter „FAE" und in `e4-w30-esc.png` bei (2405, 1055) unter „BRU" stehen je zwei leere
   Rechtecke — ein Zeichen, das keine geladene Schrift zeichnen kann. Abnahme: in keiner
   Aufnahme irgendeiner Epoche steht ein leeres Rechteck.

8. **Kein Kasten darf über den Bildrand hinausragen.** Befund (H). In `e4-c-gespielt-esc.png`
   hängt ein Kasten mit rot gestricheltem Rahmen ab x ≈ 2725 aus dem Bild; sichtbar ist nur
   „Wo". Abnahme: bei 2752 × 1536 liegt jedes Element mit deckendem Grund vollständig
   innerhalb der Fläche — geprüft im Lade- und im 30-Wochen-Zustand aller vier Epochen.

9. **Die zwei gekürzten Kaufknöpfe ganz schreiben.** Befund (I). „Nachschrift · 2 Hä…" und
   „Versorgungszusage · j…" im Band DAS ERBE tragen ein Auslassungszeichen, nicht einen
   Rollkasten. Abnahme: kein Knopf mit Preisschild trägt „…"; entweder der Kasten wird
   breiter oder der Text kürzer. **Prüft dabei auch die anderen Bänder** — ich habe nur DAS
   ERBE im Detail vergrößert.

10. **Preis und Währung nie trennen.** Befund (J). „−9 / Pf", „−240 / M", „−1.800 / DM"
    brechen zwischen Zahl und Währung um. Abnahme: in keiner Epoche steht eine Währungs­einheit
    allein auf einer Zeile.

11. **Die Sud-Tafel-Tabelle reparieren.** Befund (K). „Gärkeller 0/10 · Zeug 70 % · Fass" /
    „Fass ×1,05" — das Wort der rechten Spalte rutscht unter die linke. Abnahme: die beiden
    Spalten der Sud-Tafel bleiben in 1350 und 1884 in ihren Zeilen.

12. **Die Reiterzeile begrenzen.** Befund (L). Nach 30 Wochen sind es 14 Reiter über 83 % der
    Bildbreite, zweizeilig, mit zwei überlaufenden Endbuchstaben. Abnahme: die Reiterzeile
    bleibt einzeilig und unter **50 % der Bildbreite**, auch nach 30 Wochen in allen vier
    Epochen; kein Buchstabe berührt den Rand seines Reiters.

13. **Die Ortsmarken vom Boden nehmen oder in die Welt zeichnen.** Befund (M). Sieben flache
    braune Scheiben mit Goldrand liegen auf Straßen und Wegen (z. B. `e1-a-laden.png` bei
    (1555, 745), (2010, 975), (2300, 1035)). Entweder sie werden zu gemalten Dingen
    (Pflock, Schild, Wirtshausausleger), oder sie erscheinen nur, solange „ORTSMARKEN"
    eingeschaltet ist — der Reiter dafür ist schon da.

14. **Die Leuchtschrift von 1970 an ein Dach hängen.** Befund (N). Sie schwebt derzeit
    frei über der Straße bei (1155–1330, 990–1050). Abnahme: sie sitzt sichtbar auf der
    Dachkante der Abfüllhalle, wie im Zielblatt, und ist mindestens so breit wie dort
    (≈ 225 px bei 2752).

15. **Die Deckung im Ladezustand unter 8 % bringen.** Befunde §3.3. Gemessen 22,0–22,8 %
    gegen 3,1 % im Zielblatt. 8 % ist mehr als das Doppelte des Zielblatts und damit
    großzügig. Abnahme: `bild-w9/deckung.mjs` ohne `WOCHEN`, alle vier Epochen unter 8 %
    gesamt und unter **25 %** im obersten Sechstel.

16. **Nach dreißig Wochen darf höchstens eine Tafel liegen.** Befund §3.3, dritter Absatz.
    Derzeit liegen zwei ganzseitige Tafeln übereinander (`fu-sommerblatt` 1596 × 943 und
    `erb-buch` 1156 × 1075), und Escape tauscht nur die obere gegen die untere. Abnahme:
    nach 30 × WEITER und **einem** Escape ist in allen vier Epochen keine Tafel über
    200.000 px² mehr offen, und die Gesamtdeckung liegt unter **12 %**. Zusätzlich: die
    Erbe-Tafel trägt in ihrem unteren Drittel nichts — sie darf entsprechend kürzer sein.

17. **Gekaufte Bauten dürfen einander nicht verdecken.** Befund (O). In 1350 verschmelzen
    fünf gekaufte Dächer zu einer braunen Masse; in 1884 stellt sich der Mälzereiturm
    (1140–1310, 510–715) vor die vier Gärtanks. Abnahme: nach dem Kauf aller in der Epoche
    verfügbaren Hofbauten ist jedes einzelne Bauwerk in einer Aufnahme als eigener Körper
    erkennbar; kein Bauwerk verdeckt mehr als ein Drittel eines anderen.
    *(`spiel/LIESMICH.md` gibt den Weg vor: „Was gegraben wird, bleibt … Steht etwas davor,
    rückt das, was davorsteht." Der Brunnen und der Keller bleiben, der Turm rückt.)*

---

## 6 — Was an meiner Messung schwach ist

**(1) Meine Zielblatt-Zahl von 3,1 % ist von Hand abgelesen.** Ich habe die Kanten der
Kopfleiste und der WEITER-Tafel im Bild abgeschätzt (1610 × 72 und 262 × 62) und daraus
gerechnet. Ein Schwellwertverfahren hätte etwas anderes ergeben — ich schätze den Fehler auf
± 0,5 Prozentpunkte. **Am Verhältnis 1 : 7 ändert das nichts**, aber wer die Zahl 3,1 zitiert,
zitiert eine Ablesung.

**(2) Die vier gemalten Ortsschilder zähle ich als Kasten.** Sie haben einen deckenden Grund
und fallen deshalb in meine Eigenschaftsprüfung, obwohl sie in den Zielblättern gemalt sind.
Ich habe den Betrag mit ≈ 0,7 Prozentpunkten beziffert und in §3.3 abgezogen — aber ich habe
ihn **geschätzt, nicht gemessen**. Die Gegenprobe, ob umgekehrt Welt mitgelöscht wird, habe
ich in allen vier Epochen angesehen (`e1-nackt.png` … `e4-nackt.png`) und keinen Verlust
gefunden — aber „angesehen" heißt hier: mit dem Auge auf einer 2000-px-Darstellung, nicht
Element für Element gezählt. Ein kleines gemaltes Ding mit Rahmen könnte mir entgangen sein.

**(3) Ein Lauf je Zustand, keine Gerätekontrolle.** Jede Deckungszahl steht auf **einem**
Durchgang. Die Aufnahmen sind reproduzierbar gesät (`saat=1350`), und `e1-b` und `e1-c` sind
byteweise identisch — aber ich habe keinen Zustand zweimal erhoben und die Prüfsummen
verglichen, wie es die Aufsicht bei ρ tut. Die Zahlen sind Einzelmessungen.

**(4) Mein Spielweg ist einer von vielen.** Ich habe je Runde die **ersten fünf**
freigegebenen `stadt:bau:*`-Knöpfe geklickt, in DOM-Reihenfolge, also nicht nach Preis oder
Sinn. Ein anderer Weg baut andere Häuser und erzeugt ein anderes Bild. Die Befunde zur
Verfilzung (O) hängen daran, welche fünf gebaut wurden.

**(5) Ich habe nur 34 bzw. 30 Wochen gespielt.** Das ist ein Braujahr. Die Latte fragt nach
„genug Wochen, dass gekaufte Hofbauten im Bild stehen" — das ist erfüllt —, aber ein Haus
mit vierzehn Braujahren sieht anders aus. **Über den Spätzustand sage ich nichts.**

**(6) Der Escape-Befund ist zweideutig.** Ich habe dreimal Escape gedrückt und danach die
Erbe-Tafel gesehen. Ob Escape sie **geöffnet** hat oder ob sie schon darunter lag, kann ich
aus zwei Aufnahmen nicht entscheiden. Ich habe die zweite Lesart als die wahrscheinlichere
in den Text genommen; wer Auflage 16 abarbeitet, prüft das zuerst nach.

**(7) Ich habe die Bilder auf einem herunterskalierten Schirm angesehen.** Die
Gesamtaufnahmen kamen mir mit 2000 px Breite statt 2752 vor Augen; alles unter etwa 8 px
Schrifthöhe konnte ich dort nicht lesen. Deshalb die Ausschnitte — aber ich habe nur
**vierzehn** Stellen vergrößert. Es können weitere gekürzte oder überlaufende Beschriftungen
dastehen, die ich nicht gesehen habe. Auflage 9 sagt das ausdrücklich.

**(8) Ich habe die Lesbarkeitslatte nicht angefasst.** Alles hier ist bei 2752 × 1536
gemessen, der Entwurfsfläche. Was bei 1366 × 768 passiert, weiß ich nicht — und
`gauntlet/MESSLATTE.md` §4 sagt, dass genau dort die Schrift zusammenfällt.

**(9) Der Ton, die Bedienung und die Wirtschaft kommen hier nicht vor.** Ich urteile über
Bildpunkte. Dass eine Tafel das halbe Bild deckt, sagt nichts darüber, ob sie sich lohnt zu
lesen.

