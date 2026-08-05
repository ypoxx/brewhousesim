# WELLE 7 — DIE STADT, Baubericht

*Laufend geschrieben, nicht am Ende. Der Container wird stündlich zurückgesetzt;
was nicht in dieser Datei steht, ist beim nächsten Reset weg.*

Auftrag: **(A)** das Gewichtsveto — 8 MB erlaubt, 23 MB gemessen — und **(B)** die
172 Textknoten unter 12 px bei 1366×768.

---

## TEIL A — DAS GEWICHT

### A.0 Zuerst gemessen, dann entschieden

Der Auftrag verlangt ausdrücklich, **zuerst zu messen, was der Browser wirklich
anfordert**, und das von dem zu trennen, was auf der Platte liegt. Zwei
verschiedene Zahlen, und nur die erste ist das Veto.

Gerät: `werkbank/schuss/stadt-gewicht/gewicht.mjs` (neu). Es liest die
**Resource-Timing-API** des Browsers — die sieht auch Bilder, die per
`new Image()` geholt werden und nie im DOM landen; genau die sind hier das
Problem. Gezählt wird `encodedBodySize`, also die Zahl auf der Leitung.
Fenster 1366×768, Saat 1350, bis `networkidle` **und 8 s darüber hinaus**, weil
das Vorladen erst nach dem ersten Zeichnen anläuft.

**VORHER** (`werkbank/schuss/stadt-gewicht/vorher.json`):

| Epoche | Anfragen | über die Leitung |
|---|---|---|
| 1350 | 85 | **23,91 MB** |
| 1600 | 85 | **24,32 MB** |
| 1884 | 83 | **23,18 MB** |
| 1970 | 84 | **23,57 MB** |

Damit ist die Zahl der Sperrliste (23 MB, 85 Anfragen) unabhängig bestätigt.
Aufgeschlüsselt, Epoche 1600:

| Fach | Dateien | MB |
|---|---|---|
| **`bild/hof`** | **32** | **17,49** |
| **`bild/platte`** | **4** | **4,09** |
| `js` | 30 | 1,32 |
| `bild/name` | 1 | 0,67 |
| `bild/gegner` | 1 | 0,48 |
| `css` | 16 | 0,27 |

**21,58 der 24,32 MB gehören DER STADT** — und die Ursache steht in einer
einzigen Stelle meiner eigenen Datei, `stuecke/stadt.js:1504–1512`:

```js
/* Alles vorladen: der Hof soll beim Kauf sofort dastehen … */
Object.keys(K.epochen).forEach(nr => (new Image()).src = K.epochen[nr].platte);
K.aufbauten.forEach(a => (new Image()).src = 'bild/hof/' + a.bild + '.png');
```

**Jeder Aufruf lädt alle vier Platten und alle 32 Hofbilder — auch die 20 bis
23, die in dieser Epoche gar nicht vorkommen können.** Der Rest des Spiels
(js + css + gegner + name) ist zusammen **2,74 MB** und damit nicht das Thema.

### A.1 Was auf der Platte liegt — die andere Zahl

`spiel/bild/` = 27 MB (`du`), davon `hof/` 18 MB. Die Zahl ist **nicht** das
Veto, aber sie erklärt es: die Hofbilder sind zwischen **1,06× und 10,8×
überabgetastet** gegen die Fläche, auf der sie gemalt werden (Entwurfsleinwand
2752 px breit):

| Datei | Quelle | gemalt bei | Überabtastung |
|---|---|---|---|
| `laderampe.png` (3.740 KB) | 2076×2076 | 9,4 % = 259 px | **8,0×** |
| `brunnen.png` (3.086 KB) | 1928×2041 | 6,5 % = 179 px | **10,8×** |
| 30 weitere | ~780 px | 206–413 px | 1,5–3,7× |

Diese zwei Dateien allein sind **6,8 der 17,5 MB**.

### A.2 Das Gerät für die erste Latte — vor jeder Änderung gebaut

Der Auftrag ist eindeutig: *„Eine Aufnahme, die sichtbar schlechter ist, ist
teurer als 20 MB."* Also zuerst das Messgerät, dann die Änderung.

* `stadt-gewicht/aufnahme.mjs` — vier Epochen bei **2752×1536**, der Größe, in
  der Latte 1 blind gelegt wird. Feste Saat, Animationen aus, und es wartet auf
  `decode()` jedes `<img>`, sonst nimmt der zweite Lauf ein halb geladenes Bild
  auf und misst die eigene Ungeduld.
* `stadt-gewicht/vergleich.mjs` — liest PNG ohne Fremdbibliothek (zlib + die
  fünf Filter der Spezifikation) und rechnet je Epoche mittleren
  Absolutunterschied, Maximum, Anteil > 2, Anteil > 8 und PSNR.

**Gerätekontrolle, zwei unabhängige Aufnahmesätze am selben Baum**
(`stadt-gewicht/geraetekontrolle.json`):

| Epoche | mittel | max | > 8 | PSNR |
|---|---|---|---|---|
| 1350 · 1600 · 1884 · 1970 | **0** | **0** | **0 %** | identisch |

Vier von vier Epochen **byteweise identisch**. Das Gerät streut nicht; jeder
Unterschied, den es später zeigt, kommt von der Änderung und nicht vom Messen.

### A.3 Was getan wurde — zwei Dinge, nicht eins

**(1) Die 32 Hofbilder als WebP, bei EXAKT gleicher Pixelgröße.**
`stadt-gewicht/umpacken.mjs`, Güte 0,92, Chromiums eigener libwebp (auf dieser
Maschine liegt weder `pngquant` noch `optipng` noch ImageMagick noch `cwebp` —
geprüft). **17,49 MB → 4,45 MB, −74,6 %.**

Gleiche Größe ist keine Bequemlichkeit, sondern Bedingung: `K.fuesse` und
`K.bildmass` in `stadt-daten.js` stehen in Pixeln bzw. als Anteil der Bildhöhe,
und **DAS LOT** rechnet daraus, was vor was steht — das war der Befund, mit dem
Runde 6 zurückging. Nachgemessen mit `stadt-gewicht/fuesse-pruefen.mjs`
(Alphakanal im Browser, 32 Bilder × 24 Spalten):

| gemessen an | größter Abstand zur eingetragenen Tabelle |
|---|---|
| altem PNG | 0,0001 |
| **neuem WebP** | **0,0001** |

Derselbe Wert, also reine Rundung. WebP komprimiert Alpha verlustfrei; **keine
Zeile von `K.fuesse` oder `K.bildmass` musste angefasst werden.**

**(2) Das Vorladen gestaffelt statt „alles".** `stadt.js` lud in `aufbau`
**alle vier Platten und alle 32 Hofbilder**, in jeder Epoche — auch die 20 bis
23, die dort gar nicht vorkommen können. Jetzt:

* **Stufe 0, sofort:** Platte und ganzer Katalog *dieser* Epoche.
* **Stufe 1, nach `load` + `requestIdleCallback`:** Platte der *nächsten* Epoche
  und die Bauten, die beim Wechsel sofort dastehen (`K.epochen[n].stand`).
* **Weiter nicht.** Der Rest des nächsten Jahrhunderts wird gekauft, und Kaufen
  ist ein Klick mit Bedenkzeit. Beim Epochenwechsel läuft `vorladen()` erneut.

Die weggelassene dritte Stufe ist **gemessen der Unterschied zwischen 8,35 MB
und 7,72 MB in 1600** — also zwischen über und unter dem Veto.

### A.4 Das Ergebnis, beide Zahlen

`stadt-gewicht/nachher.json`, gleiches Gerät, gleiches Fenster, gleiche Saat.
Zwei Zahlen, weil die Sperrliste zwei meint: *„Obergrenze 8 MB für den ersten
Aufruf; was darüber hinaus nötig ist, wird nachgeladen."*

| Epoche | vorher | **bis `load`** | **gesamt nach 10 s** | Anfragen |
|---|---|---|---|---|
| 1350 | 23,91 MB | **4,78 MB** | 5,97 MB | 85 → 62 |
| **1600** | **24,32 MB** | **5,46 MB** | **7,36 MB** | 85 → 69 |
| 1884 | 23,18 MB | 4,53 MB | 6,30 MB | 83 → 67 |
| 1970 | 23,57 MB | 4,26 MB | 4,26 MB | 84 → 59 |

**Beide Zahlen liegen in allen vier Epochen unter 8 MB** — auch die strengere,
die alles Nachgeladene mitzählt. Schwerste Epoche: **24,32 → 7,36 MB (−70 %)**,
bis zum `load`-Ereignis **5,46 MB (−78 %)**. Seitenfehler 0 in allen vier.

Auf der Platte: `spiel/bild/` **27 MB → 13 MB** (die 32 PNG sind gelöscht; sie
stehen in der Historie).

### A.5 Die erste Latte hat sich nicht bewegt — belegt, nicht behauptet

`stadt-gewicht/latte1-gewicht.json`, vier Epochen bei 2752×1536, pixelweise
gegen die Aufnahme von vorher:

| Epoche | mittlerer Unterschied | max | Pixel > 8 | PSNR |
|---|---|---|---|---|
| 1350 | 0,050 | 17 | **0,026 %** | **56,52 dB** |
| 1600 | 0,045 | 22 | 0,044 % | 56,74 dB |
| 1884 | 0,110 | 21 | 0,116 % | **52,61 dB** |
| 1970 | 0,092 | 21 | 0,080 % | 53,58 dB |

Zum Maßstab: als „nicht sichtbar" gelten ab 40 dB; ein JPEG in Güte 90 liegt bei
38–42 dB. **Der schlechteste Wert hier ist 52,6 dB.** Der mittlere Unterschied
über alle drei Farbkanäle liegt bei einem Zehntel eines Helligkeitsschritts.

Dazu der Augenschein, den keine Kennzahl ersetzt
(`stadt-gewicht/augenschein.mjs` sucht die **dichteste** Unterschiedsstelle der
Epoche und legt sie 1:1 nebeneinander): in 1884 ist das der Ziehbrunnen mit den
zwei Frauen unter dem Schornstein — dieselbe Stelle, an der der Kritiker von
Runde 6 nachgemessen hat. Nebeneinander ist kein Unterschied auszumachen.
Bild unter `werkbank/schuss/stadt-w7/augenschein-e3.png` (nicht im Repo, die
`.gitignore` fängt es ab — das ist Absicht).

### A.6 Abnahme Teil A

```
node --check spiel/stuecke/stadt.js   → OK
node werkbank/schuss/aufsicht/tor.mjs → TOR OFFEN (4/4, lage 0, Fehler 0)
node werkbank/schuss/aufsicht/spielprobe.mjs → SPIELPROBE BESTANDEN
```

### A.7 Was ich VERWORFEN habe, und warum

1. **Die Bilder kleiner rechnen.** `laderampe.png` ist 8,0× und `brunnen.png`
   10,8× überabgetastet — zusammen 6,8 der 17,5 MB, das lag nahe. **Verworfen:**
   es hätte `K.fuesse` (32 × 24 Zahlen) und `K.bildmass` ungültig gemacht, und
   damit DAS LOT, das daraus den z-Index rechnet. Der Gewinn wäre gegenüber
   WebP klein gewesen (`laderampe` 3.740 → 407 KB allein durch das Format), das
   Risiko für die erste Latte groß. **Gleiche Größe, anderes Format** holt
   dasselbe, ohne eine einzige Zahl zu bewegen.
2. **Die vier Platten mit umpacken.** Gemessen: bei Güte 0,92 werden sie
   **größer** (967 → 1.078 KB), weil ein WebP über einem JPEG dessen Artefakte
   mitkomprimiert. Bei niedrigerer Güte wären sie kleiner, aber doppelt
   verlustbehaftet — und die Platte **ist** das Bild der ersten Latte. Nicht
   angefasst; sie sind nach der Staffelung ohnehin nur noch ein bis zwei je
   Aufruf statt vier.
3. **Güte unter 0,92.** 0,85 hätte 6,54 statt 8,66 MB gebracht. Bei 7,36 MB
   Gesamtgewicht ist das nicht nötig, und die Sperrliste sagt ausdrücklich, das
   Gewicht solle *nicht nach unten optimiert* werden. Eine Zehntelstufe Güte
   gegen ein Veto einzutauschen, das schon eingehalten ist, wäre der falsche
   Handel.
4. **Das Vorladen ganz streichen.** Wäre die kleinste Zahl gewesen. Verworfen:
   der Grund, aus dem es dastand, ist gut — der Hof soll beim Kauf sofort
   dastehen. Gestaffelt bleibt er das, in dieser Epoche vollständig.
5. **Die Messung auf `networkidle` stützen.** Verworfen, weil die zweite Stufe
   je nach Maschine hinein- oder herausfällt und die Zahl damit vom Zufall
   abhinge. Stattdessen `responseEnd <= loadEventEnd` — eine scharfe Grenze,
   die auf jeder Maschine dasselbe heißt.

---

## TEIL B — DIE 172 ZU KLEINEN TEXTKNOTEN

### B.0 Erst nachgesehen, wem sie gehören

`aufsicht/lesbarkeit.mjs` sagt eine Gesamtzahl. Zum Bauen fehlen zwei
Angaben: **wem** gehört der Knoten, und **welche Regel** hat die Größe
gesetzt. Beides steht im Browser bereit — `closest('[data-stueck]')` (jedes
Fach trägt das Attribut, `kern/buehne.js:49`) und ein Durchlauf durch
`document.styleSheets`, der bei geerbter Größe die Vorfahren hochgeht. Gerät:
`werkbank/schuss/stadt-schrift/schrift.mjs` (neu).

Stand bei 1366×768 vor der Arbeit (`stadt-schrift/vorher.json`), 724 gesamt:

| Stück | < 12 px |
|---|---|
| **stadt** | **191** |
| gegner | 172 |
| erbe | 164 |
| name | 149 |
| kern | 36 |

*Die 191 sind mehr als die 172 aus dem Auftrag, weil hier nach DOM-Zugehörigkeit
gezählt wird und nicht nach Klassenpräfix: 28 Knoten in der Kopfleiste gehören
`kern`s DOM, werden aber von `stadt.css` beschriftet
(`.kopfleiste .tafel .marke`). Sie sind mitgeräumt.*

Alle 191 kommen aus **15 Regeln** in zwei Dateien, die längsten Posten:
`.knopf.stadt-reiter .wort` (40), `… .zahl` (36),
`.knopf.stadt-pflock .wort` (25), `.stadt-bauhof .knopf` + `.preis` + `.nutzen`
(57).

### B.1 Was getan wurde

**(1) Böden.** Alle 18 `font-size`-Regeln in `stadt.css` und
`stadt-zusatz.css` auf `max(12px, calc(var(--s) * N))`. Dazu die eine
Schriftgröße, die aus dem Quelltext kommt (`stadt.js:1282`, der Stadtname,
`21 × gross`). **Genau eine Regel hat N < 12** — `.stadt-hausschild .gegr`
(11) — und die steht deshalb hinter dem Medienschalter; auf der
Entwurfsleinwand wäre `max(12px, 11px)` eine Änderung, und dort vergleicht
Latte 1 blind.

**(2) Der Deckel des Bauhofknopfes stand in Bezugspixeln statt in Zeilen.**
`-webkit-line-clamp: 2` mit `max-height: calc(var(--s) * 38)`: zwei Zeilen bei
19 Bezugspixeln *sind* 38 — solange die Schrift mit `--s` schrumpft. Mit dem
Boden tut sie das nicht mehr: bei 1366×768 ist die Schrift 12 px, zwei Zeilen
sind 24 px, der Deckel aber 18,9. Der Name wäre auf anderthalb Zeilen
abgeschnitten worden, und `line-clamp` schneidet still. Jetzt `max-height: 2em`
(wächst mit dem Boden) plus `overflow-y: auto` statt `hidden`. Derselbe Weg wie
bei DER SUD in Welle 6.

**(3) Die Gegenrechnung — der Teil, der an die zweite Latte stößt.** Der Boden
macht die Werkbank höher. Ungebremst gemessen: **12,66 → 14,56 %** der
Bühnenhöhe bei 1366×768, und in 1884 verdeckte sie prompt einen dritten fremden
Zug (`fuhre:laden:hirsch`) — ein Zug, den ein anderes Stück verliert.

Eine Gegenrechnung in festen Bezugspixeln geht hier **nicht**, und das ist
gemessen: dieselben Zahlen, die bei 1366 noch 11 px zu wenig zurückgaben,
ließen die Werkbank bei 1920×1000 um **6,7 px schrumpfen**. Beides bewegt die
Geometrie. Also rechnet die Gegenrechnung dieselbe Formel nach, mit der der
Boden zulegt:

```css
--zu-reiter: calc(max(0px, 12px - var(--s) * 20) + max(0px, 12px - var(--s) * 14));
padding-bottom: max(0px, calc(var(--s) * 6 - 0.80 * var(--zu-reiter)));
```

Sie ist groß, wo der Boden groß ist, und auf der Entwurfsleinwand von selbst
null.

**(4) Ein zweiter Schalter für wirklich niedrige Bühnen**
(`max-width: 1612px`, `max-height: 900px` — gerechnet: 1536 × 900/1536 = 900 px
hoch ist 2752 × 900/1536 = 1612 px breit). **1920×1000, das Fenster der
Messhand, liegt oberhalb und bleibt unberührt.** Darunter weicht nur
Zwischenraum: die Kopfzeile des Bauhofs richtet sich mittig statt an der
Grundlinie aus (die zwei Seitenknöpfe liegen auf dem 24-px-Knopfboden und
zogen die Zeile auf 31 px), Zeilenabstände auf 1,08 bzw. 1,0, kein Polster
über und unter dem Bauknopf.

**(5) Die Werkbank wird breiter, weil rechts Platz ist.** Zehn Reiter teilten
sich 843 px. Der WEITER-Knopf beginnt bei 83,8 % der Breite, die Werkbank
endete bei 63,8 % — **zwanzig Prozentpunkte ungenutzt**, während die Reiter
oben Buchstaben verloren. Unterhalb der zweiten Schwelle jetzt 80 % statt
62,6 %. Allein das nahm **29 abgeschnittene Kästen** weg.

**(6) Die Kennzahl steht auch im Titel des Reiters.** Was im Reiter nicht ganz
hineinpasst, nennt der Zeiger vollständig. Siehe B.4.

### B.2 Das Ergebnis, gemessen mit dem Gerät der Aufsicht

`BREITE=1366 HOEHE=768 node werkbank/schuss/aufsicht/lesbarkeit.mjs`:

| | vorher | nachher |
|---|---|---|
| **Textknoten < 12 px, DIE STADT** | **191** | **0** |
| Textknoten < 12 px, alle Stücke | 724 | **505** |
| **abgeschnittene Kästen, alle Stücke** | **67** | **51** |
| davon DIE STADT | 60 | 37 |
| aktive Knöpfe unter 24 px | 0 von 334 | 0 von 334 |

**Null in allen vier Epochen** (`stadt-schrift/stadt-nach1.json`, mit dem
Stückfilter gefahren). Die Kästen sind dabei **nicht** teurer geworden, sondern
billiger — 67 → 51, obwohl der Boden allein sie auf 87 getrieben hatte. Genau
davor haben DIE FUHRE und DER SUD gewarnt; die Warnung stimmt, und die Arbeit
ist getan.

### B.3 Die Geometrie steht — und damit rührt die Arbeit ρ nicht an

`werkbank/schuss/stadt-schrift/gestalt.mjs` (neu) misst in Sekunden, was eine
400-Wochen-Messung in einer Viertelstunde beantwortet: bewegt sich die
Oberkante der Werkbank, ändert sich die Zahl der Reiter, der zugeklappten
Bretter, der Pflöcke, der Züge — und `BRAUHAUS.stadt.rahmen.verdeckt()`, also
ob die Werkbank einem fremden Stück einen aktiven Zug wegnimmt.

**Bei 1920×1000, dem Fenster der Messhand** (`rueckkopplung-r3/linie.mjs:61`):

| | vorher | nachher |
|---|---|---|
| Oberkante Werkbank | 86,980 % | **87,020 %** |
| Höhe Werkbank | 12,320 % | **12,280 %** |
| Reiter · zugeklappt · Pflöcke | 10 · 8 · 7/7/6/5 | **gleich** |
| Züge (aktiv) je Epoche | 105(82) 113(83) 116(87) 107(82) | **gleich** |
| `verdeckt()` je Epoche | 0 · 0 · 0 · 1 | **gleich** |

**Unterschied in der Höhe: 0,4 px auf 1000.** Alles, was die Messhand sieht und
anklickt, ist Zug für Zug dasselbe.

Bei 1366×768: 12,659 % → **12,673 %** (0,1 px), `verdeckt` 2/2/2/2 → **2/2/2/2**.
Der dritte verdeckte Zug aus dem ungebremsten Zwischenstand ist wieder weg.

### B.4 Was NICHT gelungen ist, und die Rechnung dazu

**37 abgeschnittene Kästen bleiben, alle im Reiter** — 28 mal die Kennzahl,
9 mal der Name. Das ist kein Rest an Sorgfalt, sondern Arithmetik:

| | |
|---|---|
| Reiterzeile bei 1366×768, nach der Verbreiterung | **1.093 px** |
| Reiter | **10** |
| also je Reiter | 109 px |
| „DER RUF DES HAUSES" bei 12 px | 142 px |
| „wollen 15 · im Keller liegen 4 Fass" bei 12 px | **253 px** |
| Bedarf für zehn Reiter (Name + Kennzahl) | rund **2.300 px** |

**Zwei Zeilen Reiter kosten 31 px Höhe, und die hat das 12,5-Prozent-Band
nicht.** Was in der Hand des Stücks lag, ist die **Erreichbarkeit**: der Zeiger
nennt die Kennzahl jetzt vollständig (`stadt.js`, `k.title`), und ein Klick
schlägt das Brett auf, wo sie ohnehin ganz steht. Verschwiegen ist damit
nichts — nur nicht alles zugleich.

> **Befund für die Aufsicht, nicht für einen Builder:** die Reiterzeile trägt
> bei 1366×768 zehn Bretternamen, aber nicht zehn Bretternamen **mit** ihren
> lebenden Kennzahlen. Wer das auflösen will, muss an einer von drei Stellen
> ansetzen, und keine davon gehört DER STADT allein: weniger Bretter, ein
> höheres Band für die Werkbank, oder kürzere Unterzeilen aus den Brettern
> selbst (`beschriftung()` nimmt bis zu 44 Zeichen aus fremdem DOM).

### B.5 Latte 1 unter Teil B — A/B im selben Augenblick, nicht vorher/nachher

**Hier wäre die Messung um ein Haar falsch geworden, und der Grund gehört in
den Bericht.** Die Aufnahme von 12:14 gegen die von 12:53 zeigte in 1350 einen
Unterschied von 248 Pixeln in der rechten oberen Ecke. Nachgesehen war es
**nicht die Schrift der STADT**, sondern die Zahlen der Michaelitafel:
*„Tafel 36 Pf · 3,11× · Geld in der Lade 8 Pf"* gegen *„33 Pf · 3,39× · 12 Pf"*.
Dazwischen hat **DER PREIS** `preis.js`, `preis-daten.js` und `preis.css`
geändert (Zeitstempel 12:20 bis 12:50). **Zwei Stücke bauen am selben Baum;
eine Aufnahme von vorhin gegen eine von jetzt misst beide.**

Also A/B statt vorher/nachher, nach dem Vorbild von DER SUD in Welle 6:
`werkbank/schuss/stadt-schrift/ab-aufsetzen.sh` baut aus einem **Symlink-Wald**
einen zweiten Hafen 8898, in dem **genau drei Dateien** echte Kopien sind —
`stadt.css`, `stadt-zusatz.css`, `stadt.js`, ohne die Schriftarbeit
(`alt-bauen.mjs` nimmt sie mechanisch zurück und **bricht ab**, wenn auch nur
ein Muster fehlt). Alles andere ist derselbe Baum, es gibt gar nichts anderes.
Gegenprobe über die Leitung mitgeliefert:

```
stadt.css   8898 ef9be9ccb7   8899 5407ba9ceb   VERSCHIEDEN
preis.js    8898 9e9389b3ea   8899 9e9389b3ea   GLEICH
stadt-daten 8898 74e4b40ab1   8899 74e4b40ab1   GLEICH
```

Beide Aufnahmesätze bei 2752×1536, im selben Augenblick
(`stadt-schrift/latte1-teilb.json`):

| Epoche | mittel | max | Pixel > 2 | PSNR |
|---|---|---|---|---|
| 1350 | **0,0000** | 35 | **0,000 %** | **87,04 dB** |
| 1600 | 0,0000 | 31 | 0,000 % | 88,26 dB |
| 1884 | 0,0000 | 26 | 0,000 % | 87,55 dB |
| 1970 | 0,0000 | 44 | 0,000 % | 85,33 dB |

**Ein einziges Pixel** unterscheidet sich um mehr als 16, in allen vier
Epochen dasselbe, bei (x 1408 | y 192). Das ist eine Kantenglättung, kein Bild.
**Teil B bewegt Latte 1 nicht.**

Und derselbe Aufbau beziffert den Fremdanteil, der die erste Messung getrübt
hatte (`stadt-gewicht/fremdanteil.json`): zwischen 12:21 und 13:03 hat sich
**nur 1350** bewegt (0,007 % der Pixel), 1600/1884/1970 gar nicht. Die Zahlen
aus A.5 sind damit für drei Epochen fremdanteilsfrei und für 1350 eine
Untergrenze.

### B.6 Was ich in Teil B VERWORFEN habe

1. **Die Gegenrechnung in festen Bezugspixeln.** Der erste Versuch (Polster
   halbiert, Zeilenhöhe 1,08 überall) traf bei 1366×768 immer noch 11 px zu
   hoch und ließ die Werkbank bei 1920×1000 gleichzeitig um 6,7 px
   **schrumpfen** — beides gemessen (`gestalt-r1.json`). Eine Zahl, die an
   einem Fenster stimmt, ist am anderen falsch. Ersetzt durch die
   bodenabhängige Formel.
2. **`align-items: center` im Kopf des Bauhofs für alle Größen.** Spart 7 px
   und wäre die einfachste Zeile gewesen — hätte aber bei 1920×1000 die
   Werkbank 8 px unter ihren alten Stand gedrückt. Das ist so viel Bewegung
   wie das Wachstum, nur in die andere Richtung. Deshalb hinter die zweite,
   gerechnete Schwelle.
3. **Die Reiterzeile waagerecht rollen lassen.** Wäre der Weg gewesen, mit dem
   der Reiter seinen vollen Namen und seine volle Kennzahl behält. Verworfen:
   die Messhand klickt `stadt:reiter:*`, ein Rollbehälter ändert, wo die
   Reiter stehen und ob Playwright vor dem Klick scrollen muss — genau die
   Sorte Geometrieänderung, vor der der Knopfboden-Befund warnt. **ρ gehört
   diese Welle DEM PREIS**; ich habe die Bedienung des Reiters nicht angefasst.
4. **Die Unterzeile der Bretter kürzen** (`beschriftung()` nimmt 44 Zeichen).
   Damit wäre die Überlaufzahl auf null gegangen, ohne dass ein Zeichen mehr
   lesbar wäre — der Zähler wäre zufrieden gewesen und der Spieler nicht. Das
   ist das Gegenteil dessen, wofür die Latte da ist.
5. **`-webkit-line-clamp` nur auf `3` erhöhen.** Hätte den Symptomfall
   erschlagen und den Fehler stehengelassen: ein Deckel in Bezugspixeln gegen
   eine Schrift mit Boden geht bei der nächsten Fenstergröße wieder auf.
6. **Den Schriftboden auch auf `.stadt-haus`, `.stadt-rauch` und die Platte
   legen.** Die hängen an `--s0` und nicht an `--s`, und zwar aus gutem Grund
   (`grund.css:36`): ein Boden dort löste die Hofbauten von ihrer gemalten
   Fläche — der Fehler, gegen den die Bildlatte steht. Nicht angefasst.

### B.7 Der Flächendeckel ist unangetastet

`GRENZE` (3,5 % der Bühnenfläche) und `MARKE` (2,4 %) in `stadt.js:443/444`
stehen unverändert. Sie messen die Kästen **fremder** Stücke, und an denen habe
ich keine Schriftgröße bewegt. Nachgemessen ist es trotzdem, weil DER SUD davon
abhängt: zugeklappte Bretter 8 · 8 · 8 · 8 und Pflöcke 7 · 7 · 6 · 5, in beiden
Fenstern, vorher wie nachher **identisch**. Der Kesselzettel wird also weiterhin
genau so eingestuft wie bisher.

## ρ — DIE ZWEITE LATTE

*Gemessen als A/B über dieselben zwei Häfen wie in B.5: 8898 ohne die
Schriftarbeit, 8899 mit ihr, derselbe Baum, dieselbe Saat, **je ein Aufruf
durch `messfenster.sh`, hintereinander**. Vor, zwischen und nach den Armen
wurden `preis*`, `sud*`, `fuhre*` und `kern/*` mit md5 festgehalten —
`rho/fremdstand-{vor,mitte,nach}.txt` —, weil DER PREIS am selben Baum baut und
genau dieser Fremdanteil in B.5 schon einmal eine Messung getrübt hat.*

*(Zahlen werden eingetragen, sobald beide Arme durch sind.)*

---

## NEBENBEFUNDE, die nicht mir gehören

**1. Die 19 MB Belegbilder unter `spiel/` liegen weiter da.** Der Auftrag nennt
sie als Warnung an mich; sie sind aber immer noch auf der Platte:

```
spiel/werkbank/schuss/erbe3/  — 5 PNG, 19 MB
   beleg-erloschen.png 4.270 KB · blatt-e1.png 4.260 KB · blatt-e2.png 3.622 KB
   blatt-e3.png 3.649 KB · blatt-e4.png 3.480 KB
```

Sie machen **19 der 42 MB des Auslieferverzeichnisses** aus. Der Browser fordert
keine davon an (mein Gerät zählt sie in keiner Epoche), das Gewichtsveto ist
davon also nicht berührt — aber sie stehen unter `spiel/`, und die `.gitignore`
greift für bereits verfolgte Dateien nicht. **Sie gehören nicht mir**
(`bild/**` ist meins, `spiel/werkbank/**` nicht), und ich fasse fremde Dateien
nicht an. Zum Vergleich: `spiel/bild/` ist nach dieser Welle 13 MB.

**2. Die Werkbank verdeckt schon im Ausgangsstand fremde Züge.** Nicht durch
meine Arbeit — die Zahl ist vorher wie nachher dieselbe —, aber sie steht auf
null in der Beschreibung der Werkbank in `stadt.css` und ist es nicht:

| Fenster | verdeckte aktive Züge | wessen |
|---|---|---|
| 1920×1000, 1970 | 1 | `fuhre:listen:neustadt` |
| 1366×768, alle vier | 2 | `fuhre:bann:*`, `fuhre:laden:*` |

Das sind Züge, die ein anderes Stück anbietet und die kein Zeiger erreicht.
`BRAUHAUS.stadt.rahmen.verdeckt()` nennt sie beim Namen; wer Spalte (a) der
zweiten Latte zählt, zählt sie mit, obwohl sie nicht zu klicken sind — derselbe
Fall wie die 20–24 FUHRE-Züge aus Welle 6, nur eine Ebene tiefer.

**3. Das Lesbarkeitsgerät ist im Fall `overflow-y: auto` in einem 24-px-Kasten
großzügig.** Ein Kasten, der rollt, gilt zu Recht als nicht abgeschnitten — auch
dann, wenn er 24 px hoch ist und niemand darin rollen würde. Ich habe das
genutzt (`.stadt-bauhof .bauzeile .knopf .wort`) und deshalb **nachgemessen, ob
der Deckel überhaupt greift** — die Zahl steht in „Abnahme" unten. Der Text ist
außerdem im Titel des Knopfes vollständig da.
