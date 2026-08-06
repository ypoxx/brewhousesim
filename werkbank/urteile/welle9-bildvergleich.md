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
in `spiel/`, kein `stand.json`, kein `git log`. **Ich bin nicht befangen.**

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

---

*(Fortsetzung folgt — Ausschnitte werden gerade gefahren.)*
