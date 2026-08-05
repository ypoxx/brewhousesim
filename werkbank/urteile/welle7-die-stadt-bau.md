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

*(Teil B wird darunter fortgeschrieben)*
