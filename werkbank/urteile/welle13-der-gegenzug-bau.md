# Welle 13 · Stück 4 — DER GEGENZUG · Baubericht

*Laufend geschrieben. Wer hier liest, bevor die Schlusszeile steht, liest einen
halben Bericht — das ist Absicht: Agenten sterben mitten im Lauf.*

Angefasst habe ich **nur**: `spiel/stuecke/gegner.js` · `spiel/stil/gegner-zusatz.css`.
Gebaut habe ich `werkbank/schuss/gegenzug-w13/**`:
`gegenzug.mjs` (R15 mit der einfachen Hand) · `gegenzug-linie.mjs` (R15 mit der
kompetenten Hand aus `rueckkopplung-r3/linie.mjs`) · `diagnose-reiter.mjs`
(R16, die Ursache) · `mass.mjs` und `mass-laden.mjs` (was die Änderungen an der
Geometrie anrichten) · `haushalt.mjs` (Lage, Tafeln, Rand, Zonen) ·
`verdeckt.mjs` (wer welchen Knopf deckt) · `zweiwaehrungen.mjs` (die beiden
Preise, beide Kellerlagen, vier Epochen) · `klageblick.mjs` (warum der
Klageknopf fehlt).
**Nichts unter `spiel/kern/`, nichts von fremden Stücken, kein fremdes DOM.**

---

## Der Stand in einer Tabelle

| Auflage | verlangt | gemessen |
|---|---|---|
| **R15** Wochen ohne bezahlbaren Gegenzug je 100, enge Lesart | ≤ 10, alle vier Epochen | **9 · 0 · 0 · 1** am eingefrorenen Welle-12-Stand · **9 · 0 · 1 · 4** am laufenden Stand (ungünstigster von zwei Läufen) |
| **R16** Aufschrift des Reiters, Woche 45 = Woche 15 | ja | **ja**, 50 von 50 Wochen tragen die Zahl (vorher 30 von 50) |
| §4b des Urteils | unangetastet | **kein** Eingriff ins Verhalten, kein `meldeZug` |
| ρ, 400 Wochen je Epoche | darf sich nicht bewegen | Aufzeichnung **byteweise gleich** in 1350, 1600 und 1884 *(1970 s. §4.4)* |
| Spielstand, `gegnerzuege` nach dem Neuladen | ziffernweise gleich | **gleich**, alle vier Epochen, `abweichung []` |
| `BRAUHAUS.lage` · Seitenfehler | 0 · 0 | **0 · 0**, vier Epochen, zwei Fenster |
| `haushalt.tafeln()` · `ueberRand()` | leer | **leer** |

## 0 · Was ich NICHT angefasst habe

§4b des Urteils ist bestanden, und zwar ausdrücklich: *„Von allem, was ich in
vier Sitzungen geprüft habe, ist das der Teil, der am wenigsten Arbeit
braucht."* Deshalb ist **am Verhalten des Gegners keine Zeile geändert**:

* keine Zugliste, kein Gewicht, keine Frist, kein Preis einer Bindung,
* kein Text auf der Karte, keine Ankündigung (*„baut W30 · pachtet W36"*),
  kein eigenes Pech, kein Reicher- und Ärmerwerden,
* kein `merkeZug`, kein `waehle`, kein `fuehreAus`, kein `zugUnglueck`,
* **und vor allem kein `meldeZug()`.**

Der letzte Punkt ist der wichtigste und der am leichtesten zu übersehende.
`kern/welt.js:505` gibt der Art `umkaempft` den höchsten Rang (3); die Meldung
dieses Stücks schlägt damit jede andere und ist in fast jeder Woche **der
Nenner der zweiten Messlatte**. Wer dort einen billigeren Zug einträgt,
verschiebt ρ, ohne dass sich am Spiel etwas geändert hätte. Gemeldet wird
weiterhin Wort für Wort dasselbe: der billigste Zug, der den Streit
**beendet** (ablösen · zuvorkommen · mitbieten) — nicht der billigste Zug, den
es gibt. Genau so stand es schon vor dieser Welle im Zeiger der Kennzahl:
*„Das ist der billigste Zug, um den gegenüber jemand mitbietet — nicht der
billigste Posten auf dem Brett."*

---

## 1 · R15 — der Spieler muss sich einen Gegenzug leisten können

### 1.1 Die Lesart, und warum sie den Bau bestimmt hat

Die Aufsicht hat am 8. August die Lesart festgeschrieben, nachdem sie
gemessen hatte, dass beide Lesarten weit auseinanderliegen (Epoche 1, 100
Wochen, 1600×900, Saat 1350, ohne Reiterklick, Vorzustand):

| Lesart | Wochen ohne bezahlbaren Gegenzug |
|---|---|
| **eng** — `gegner:*`-Züge **mit Preisschild**, das die Kasse trägt | **68 / 100** |
| **weit** — auch Züge ohne Preisschild („1 Fass statt Geld") | **0 / 100** |

**Es gilt die enge Lesart. Meine Ausgangszahl ist 68, mein Ziel ≤ 10.**

Daraus folgt eine Entscheidung, die ich vorweg nenne, weil sie die ganze
Bauform erklärt:

> **Ich habe dem Fassknopf KEIN `data-preis="0"` angehängt.**
> Das wären zwei Zeichen gewesen, und die Zahl wäre von 68 auf 0 gesprungen,
> ohne dass ein Spieler einen Pfennig mehr zur Verfügung hätte. Die Aufsicht
> führt beide Lesarten getrennt, *„damit sich hinterher niemand die
> günstigere aussuchen kann"* — eine Null in ein Preisschild zu schreiben
> wäre genau das gewesen. Es hätte die Messung bewegt und nicht das Spiel.

### 1.2 Was stattdessen gebaut ist: zwei Währungen, zwei Knöpfe

An jedem Giebel, an dem der Adler etwas tut, hängen jetzt **drei Preise in
zwei Währungen**, und man bekommt genau einen davon:

| Knopf | `data-zug` | kostet | bewirkt |
|---|---|---|---|
| `TOR · KON · ablösen 56 Pf` | `gegner:abloesen:*` | Geld, viel | endgültig: die Adresse gehört dem Haus, vier Jahre Ruhe |
| `Fass an den Wirt · 1 Fass statt Geld` | `gegner:hinhalten:*` | **Bier** aus dem eigenen Keller | er wartet 3 Wochen, kein Preisdruck bis Michaeli |
| `lieber zukaufen · 1 Fass · 12 Pf` | `gegner:zukaufen:*` | **Geld**, wenig | dasselbe |

Der dritte ist neu. Er ist kein Ersatz für den zweiten, sondern seine andere
Währung: **das eigene Fass kostet den Verkauf, das gekaufte kostet die Lade.**
Wem die Fuhre fehlt, kauft; wem das Geld fehlt, gibt Bier. Keiner der beiden
schlägt den anderen in jeder Lage — das ist die Probe darauf, ob eine Wahl
eine ist. Der Aufschlag (ein Drittel über dem laufenden Satz, *„wer heute noch
liefern muss, zahlt drauf"*) ist das, was die Wahl offenhält: läge der Zukauf
unter dem Wert des eigenen Fasses, wäre das eigene Fass nie die richtige
Antwort.

Die Preise, am Bildschirm abgelesen, Michaeli, Keller leer:

| Epoche | Fass | Zukauf | zum Vergleich: ablösen |
|---|---|---|---|
| 1350 | 1 Fass | **12 Pf** | 56 – 66 Pf |
| 1600 | 1 Fass | **29 fl** | 297 – 378 fl |
| 1884 | 3,0 hl | **192 M** | ~1.700 M |
| 1970 | 4,5 hl | **780 DM** | 38.221 – 58.320 DM |

Ein Fünftel bis ein Fünfzigstel der endgültigen Antwort, an demselben Giebel,
aus derselben Lade. **Und der Gegner wird dadurch nicht abräumbar:** das
Hinhalten nimmt ihm keine Adresse, es vertagt ihn um drei Wochen und nimmt ihm
bis Michaeli den Preisdruck an *einer* Adresse — einmal im Braujahr je
Adresse, wie vorher.

### 1.2b Ist der neue Zug zu stark? Die Rechnung, offen hingelegt

Der Brief warnt ausdrücklich: *„Ein Gegner, den man mühelos abräumt, ist
schlechter als einer, den man nicht bezahlen kann."* Also die Zahlen:

* **Er verliert nichts.** Weder das Fass noch der Zukauf nimmt ihm eine
  Adresse, eine Bindung oder einen Zug. Sie vertagen seine Werbung und seine
  Absicht um drei Wochen und setzen den Preisabschlag an *einer* Adresse bis
  Michaeli aus. Danach ist alles wie vorher.
* **Einmal im Braujahr je Adresse.** Das war so und bleibt so — der Deckel,
  der aus einem Zug keinen Hahn macht.
* **Der Ertrag, gerechnet in 1350:** eine Adresse nimmt im Jahr rund 20 Fass,
  der Abschlag steht bei 10 bis 24 % des Fasspreises. Ausgesetzt spart das
  etwa 20 × 9 × 0,13 ≈ **23 Pf**; der Zukauf kostet **12 Pf**, das eigene Fass
  einen verlorenen Verkauf von **9 Pf**. Der Zug lohnt sich also — knapp, und
  nur, wenn man ihn bezahlen kann. Das ist gewollt: ein Gegenzug, der sich nie
  lohnt, wird nicht gedrückt, und ein Kritiker, der ihn nicht drückt, zählt
  wieder 457 zu 5.
* **Was er kostet, wenn man ihn nicht hat:** in 1350 sind das 12 Pf bei einer
  Kasse, die in dieser Messreihe im Median bei 30 Pf steht. Er ist billig, aber
  nicht umsonst, und in den ärmsten Wochen ist er es nicht.

**Und dann habe ich es einfach ausprobiert.** `gegenzug.mjs` kennt einen
Schalter `KLICKE=1`: die Hand drückt dann in JEDER Woche den billigsten
bezahlbaren Gegenzug, den sie findet. Hundert Wochen, Epoche 1, laufender
Stand, gegen dieselbe Hand ohne Drücken:

| 1350 | Hand rührt ihn nicht an | Hand drückt **31×** |
|---|---|---|
| Adressen, die **er** hält, Anfang → Ende | 3 → **6** | 3 → **5** |
| Adressen, die **das Haus** hält, am Ende | 1 | 2 |
| **seine Züge** in 100 Wochen | 43 | **68** |
| seine Kasse, Anfang → Ende | 320 → 224 Pf | 320 → **106** Pf |
| Wochen ohne bezahlbaren Gegenzug danach | 0 | **69** |

| 1970 | Hand rührt ihn nicht an | Hand drückt **33×** |
|---|---|---|
| Adressen, die **er** hält, Anfang → Ende | 3 → **5** | 3 → **4** |
| Adressen, die **das Haus** hält, am Ende | 0 | 1 |
| **seine Züge** in 100 Wochen | 50 | **54** |
| seine Kasse, Anfang → Ende | 1.193.105 → 52.973 DM | 1.193.105 → **116.659** DM |

**Wer ihn jede Woche schlägt, räumt ihn nicht ab — er wächst in beiden Epochen
trotzdem, von drei auf fünf bzw. vier Adressen, und zieht sogar MEHR
(1350: 68 statt 43).** In 1970 steht er am Ende sogar reicher da als ohne
Gegenwehr: das Hinhalten nimmt ihm den Preisdruck, nicht das Geschäft. Was sich ändert: seine Kasse
halbiert sich, das Haus holt eine Adresse zurück statt keiner — und die eigene
Lade ist danach in 69 von 100 Wochen leer. Der Zug hat einen Preis, und man
merkt ihn.

Und dieselbe Probe in den beiden anderen Epochen:

| | 1600 ohne / mit (28×) | 1884 ohne / mit (26×) |
|---|---|---|
| Adressen, die **er** hält, Anfang → Ende | 3 → 5 / 3 → **4** | 3 → 5 / 3 → **2** |
| Adressen, die **das Haus** hält, am Ende | 1 / 2 | 0 / 0 |
| **seine Züge** in 100 Wochen | 43 / **63** | 49 / **54** |

**Die 1884er Zeile ist die einzige, in der er wirklich schrumpft — und sie
gehört nicht meinem neuen Zug.** Die Hand drückt den *billigsten bezahlbaren*
Gegenzug, und in 1884 ist die Kasse so voll (Median 10.170 M), dass das oft
`gegner:abloesen` oder `gegner:zuvorkommen` ist — die teuren, endgültigen
Antworten, die es seit Runde 2 gibt und an denen ich nichts geändert habe.
Dass eine reiche Brauerei den Adler herauskaufen kann, ist der Entwurf und
nicht mein Zutun; dass die Adressen dabei frei werden statt an das Haus zu
fallen (0 von 0), zeigt, dass er sie nach dem Ablösen anderswo wieder aufnimmt.

*(Die letzte Zeile der 1350er Tabelle ist kein Widerspruch zur Abnahme, sondern ihre Kehrseite:
gemessen wird die MÖGLICHKEIT eines Gegenzugs, mit einer Hand, die keinen
drückt — so misst auch das Gerät der Aufsicht. Eine Hand, die jede Woche alles
ausgibt, was sie hat, ist danach arm; das ist keine Eigenschaft des Gegenzugs,
sondern der Ausgabe. Wer ihn dreimal im Jahr statt einunddreißigmal drückt,
bleibt bei beidem.)*

### 1.3 Der zweite Fund: ein Knopf, den die Maus nicht trifft

Beim Messen fiel etwas auf, das kein Preisproblem ist. In **1971/3 bis
1971/7** war der Bahnhofswirt die einzige Adresse mit einem Zeichen im Bild —
und `elementFromPoint` traf auf der Mitte **beider** Knöpfe nicht sie, sondern
den Chronikgriff DES PREISES:

```
Griff `.pr-griff`   x 85,6 – 98,9 %   y 3,0 – 29,4 %   (Ebene blatt, über marken)
Paar bahnhofswirt   x 91,2 – 98,7 %   y 16,8 – 23,4 %
```

Fünf Wochen ohne einen einzigen **greifbaren** Zug gegen den Gegner, obwohl
zwei dastanden und einer bezahlbar war. Das ist die Sorte Lüge, die das Urteil
*„die teuerste in einem Spiel, das nach Klicks bewertet wird"* nennt.

Ich fasse fremdes DOM nicht an — ich messe es und weiche aus. Das Zeichen
rückt **waagerecht** aus dem Griff heraus (x 91,2 → 75,9), der Ort bleibt, wo
er ist. Danach sind alle drei Knöpfe frei.

**Warum waagerecht und nicht senkrecht** — eine gemessene Entscheidung: die
vorhandene Ausweiche `weicheAus` schiebt die Unterkante unter die Zone und
rechnet dabei mit einer **geschätzten** Höhe (2,1 % je Reihe, geeicht auf
2752×1536). Auf 1600×900 misst ein dreireihiges Paar aber **13,8 % statt der
geschätzten 6,8 %**. Senkrecht ausgewichen landete die Oberkante wieder im
Griff — `gegner:abloesen:bahnhofswirt` stand danach *immer noch* verdeckt da.
Waagerecht braucht die Höhe nur für die Frage, ob etwas im Weg ist; der Weg
selbst rechnet mit der Breite, und die ist fest.

**Zwei eigene Fehler, die dabei aufgefallen sind, und sie stehen im Quelltext:**

1. Die Griffe standen zuerst in derselben Liste wie die Ortsschilder.
   `if (l.length) ZONEN[e] = l;` merkt sich die Liste, **sobald irgendetwas
   darin steht** — beim ersten Bildaufbau standen die Schilder schon da, der
   Griff noch nicht. Die Liste war damit für die ganze Partie ohne Griff,
   lautlos. Jede Sorte Zone hat jetzt ihren eigenen Merker.
2. Auch getrennt gemessen war die Zahl falsch: beim ersten Bildaufbau ist der
   Griff **3,7 %** hoch und wächst auf **23,9 %**, während die Chronik sich
   füllt. Einmal je Epoche zu messen ist für Schilder richtig (die bewegen
   sich nie) und für Griffe falsch. Nachgemessen wird jetzt **einmal je Woche**
   (im `woche`-Ereignis, außerhalb des Zeichenwegs) und in den **ersten zwölf
   Bildaufbauten** einer Epoche; gemerkt wird die größte je gesehene
   Ausdehnung, nie eine kleinere — eine Zone, die schrumpfen kann, lässt ein
   Zeichen wieder unter den Griff wandern, eine, die nur wächst, ist monoton
   und damit wiederholbar.

*(Beim dritten Anlauf stand die Schranke in `griffzonen()` selbst — und die
wird je Adresse zweimal gerufen, bei vier offenen Adressen achtmal je Bild.
Zwölf „Anläufe" waren damit nach anderthalb Bildern verbraucht. Eine Schranke,
die etwas anderes zählt, als sie zu zählen vorgibt, ist keine Schranke.)*

### 1.4 Die Abnahme — gemessen mit dem Gerät der Aufsicht

`werkbank/schuss/aufsicht/welle13-gegen/probe13.mjs`, 100 Wochen, 1600×900,
Saat 1350, `?neu=1`, **ohne einen Reiter anzufassen**. Gemessen an zwei
eingefrorenen Bäumen, die sich **nur** in meinen beiden Dateien unterscheiden:
`git archive 1bb28ce` (Ende Welle 12) ohne und mit meiner Arbeit.

**Die Zahlen stehen in Abschnitt 4.2: 55 · 60 · 0 · 19 vorher, 9 · 0 · 0 · 1 nachher.**

---

## 2 · R16 — der Zähler wandert nicht mitten in der Partie

### Der Befund, nachgemessen

`werkbank/schuss/spiel-w12/gegnerblick.mjs` (spielt 50 Wochen, ohne einen
Reiter anzufassen), Epoche 1, Saat 1350, 1600×900 — **vorher**:

| Wochen | Aufschrift des Reiters |
|---|---|
| 1350/1 – 1350/30 (30 Wochen) | `OHNE DICH GESCHEHEN 1 Zug` … `OHNE DICH GESCHEHEN 19 Züge` |
| 1351/1 – 1351/20 (20 Wochen) | `OHNE DICH GESCHEHEN` — **20 × ohne Zahl** |

`wochenMitZahlAmReiter: 30 von 50`. Der Kritiker hatte recht, auf die Woche genau.

### Die Ursache — gemessen, nicht geraten

Der Verdacht des Kritikers (*„die Zahl ist auf das aufgeklappte Brett
gewandert"*) trifft die Wirkung, nicht den Grund. Mit
`gegenzug-w13/diagnose-reiter.mjs` abgelesen, 1351/3:

```
kopfInner : "OHNE DICH GESCHEHEN\n20 Züge\ndiese Woche 1\nDas Haus gegenüber"
reiterHtml: <span class="wort" …>OHNE DICH GESCHEHEN</span>
            <span class="zahl" title="20 Züge">20 Züge</span>
reiterText: "OHNE DICH GESCHEHEN"
```

**Die Zahl stand die ganze Zeit im DOM. Sie war nur nicht gemalt.** DIE STADT
baut die Aufschrift aus `.wort` (erste Zeile des Brettkopfs) und `.zahl`
(zweite), und `stil/stadt.css:349` blendet `.zahl` aus, sobald die Reiterzeile
schmal wird:

```css
.stadt-werkbank.schmal .knopf.stadt-reiter .zahl { display: none; }
```

Schmal wird sie ab dem zweiten Braujahr, weil dann mehr Bretter da sind. Das
ist eine **richtige** Entscheidung DER STADT — zehn Reiter in einer Zeile von
1.093 px können nicht alle zwei Zeilen tragen — und `stil/stadt.css` gehört
mir nicht.

### Die Abhilfe

`stadt.js:611` liest `data-reiter`, wenn es dasteht, und nimmt es als Titel —
**ungekürzt** und ohne die 30-Zeichen-Grenze der abgeleiteten Fassung. Die
Zahl steht damit im Titel, in `.wort`, das nie ausgeblendet wird, **und
zusätzlich weiter im Kopf des Bretts**, wo sie immer stand. Beide Orte, wie
die Auflage es verlangt, und keiner davon fremdes DOM.

```js
band.setAttribute('data-reiter', 'Ohne dich geschehen · ' + zaehlerWort());
```

Der Schlüssel des Reiters hängt an der Klassenliste (`stadt.js:572`), nicht am
Titel — `stadt:reiter:gegner-amort-gg-band` bleibt Buchstabe für Buchstabe
derselbe, und jedes vorhandene Messgerät findet ihn weiter.

### Die Abnahme

`gegnerblick.mjs 1 50`:

| | vorher | nachher (eingefrorener Stand) | nachher (**laufender Stand**) |
|---|---|---|---|
| Wochen mit Zahl am Reiter | **30 / 50** | **50 / 50** | **50 / 50** |
| Woche 15 | `OHNE DICH GESCHEHEN` `12 Züge` | `OHNE DICH GESCHEHEN · 12 ZÜGE  zugeklappt` | `OHNE DICH GESCHEHEN · 17 ZÜGE` |
| Woche 45 | `OHNE DICH GESCHEHEN` | `OHNE DICH GESCHEHEN · 25 ZÜGE  zugeklappt` | `OHNE DICH GESCHEHEN · 46 ZÜGE` |
| **Form Woche 45 = Form Woche 15** | **nein** | **ja** | **ja** |

**Und dieselbe Probe in den anderen drei Epochen, am laufenden Stand:**

| | 1600 | 1884 | 1970 |
|---|---|---|---|
| Wochen mit Zahl am Reiter | **50 / 50** | **50 / 50** | **50 / 50** |
| Woche 15 | `… · 13 ZÜGE zugeklappt` | `… · 12 ZÜGE zugeklappt` | `… · 20 ZÜGE` |
| Woche 45 | `… · 24 ZÜGE` | `… · 27 ZÜGE` | `… · 42 ZÜGE zugeklappt` |

In allen vier Epochen trägt der Reiter die Zahl in **jeder** der fünfzig
Wochen; das zweite Wort (`zugeklappt` / nichts) hängt daran, ob die
Reiterzeile in dieser Woche schmal ist, und nicht am Braujahr.

Die dritte Spalte ist der Arbeitsbaum, in dem die anderen drei Builder
gleichzeitig arbeiten — dort läuft die Partie schneller (50 Klicks reichen bis
1352/26 statt 1351/14), und die Reiterzeile ist bereits so breit, dass die
zweite Zeile gar nicht erst ausgeblendet wird. **Beide Male steht die Zahl in
allen fünfzig Wochen da.**

### Und was das an der Geometrie anrichtet — nachgemessen, nicht behauptet

Ein breiterer Reiter kann die Reiterzeile umbrechen lassen, die Werkbank tiefer
machen und damit Knöpfe verschieben, die eine messende Hand trifft oder nicht
trifft. `gegenzug-w13/mass-laden.mjs` lädt dieselbe URL an beiden
eingefrorenen Bäumen und vergleicht Feld für Feld — **48 Lagen** (4 Fenster ×
4 Epochen × 3 Zeitpunkte), Ablage `protokoll/mass-laden-w12.txt`:

| Feld | Abweichungen |
|---|---|
| `.stadt-reiterzeile` (Kasten) | **0 von 48** |
| `.stadt-werkbank` (Kasten) | **0 von 48** |
| `schmal` ja/nein | **0 von 48** |
| Zahl der Reiter | **0 von 48** |
| `weiter` · `fuhre:abschicken` · `fuhre:wie-vorige` · `fuhre:fuellen` · `preis:tafel` | **0 von 48** |
| Kasse · Zählerstand des Gegners | **0 von 48** |
| **mein eigener Reiter** | 24 von 48 — **nur die Breite** |

Die 24 im Einzelnen, x/y/Breite/Höhe in Bildpunkten:

```
2752×1536   vorher [190,120,224,63]   nachher [190,120,262,63]   (12 Lagen)
1920×1080   vorher [ 91, 84,166,78]   nachher [ 91, 84,183,78]   ( 6 Lagen)
1920×1080   vorher [ 91, 84,166,91]   nachher [ 91, 84,183,91]   ( 6 Lagen)
1600× 900   unverändert                                          (12 Lagen)
1366× 768   unverändert                                          (12 Lagen)
```

**Ort und Höhe bleiben auf dem Pixel, nur die Breite wächst** — und auf den
beiden kleinen Fenstern nicht einmal die, weil `.wort` dort ohnehin umbricht.
Die Reiterzeile bricht in keiner der 48 Lagen anders um, die Werkbank wird
nicht höher, und die fünf Knöpfe, an denen jede Messung dieses Loops hängt,
stehen auf demselben Pixel.

> **Und eine Warnung an den, der das nachmisst — mir ist sie teuer zu stehen
> gekommen:** ein erster Durchgang dieses Vergleichs lief gegen einen Hafen,
> auf dem gar nicht mein Baum lag, sondern der eines fremden Messstands. Er
> meldete 48 von 48 Abweichungen, darunter *Zahl der Reiter* und *Werkbank* —
> und die Ursache war, dass der eine Baum `kern/stand.js` hatte und der andere
> nicht. **Ein `curl` auf eine Datei, die es nur in einem der beiden Bäume gibt,
> hätte das in einer Sekunde gezeigt.** Seither prüfe ich jeden Messhafen mit
> `curl -o /dev/null -w %{http_code}` und einem `md5sum` der eigenen Datei,
> bevor ich eine Zahl aufschreibe. Die Zahlen oben sind so geprüft: 8933 und
> 8934 tragen beide `stand.js`-404 und unterscheiden sich im `md5sum` von
> `stuecke/gegner.js`.

---

## 3 · Der Spielstand (Nachtrag der Aufsicht)

DER RAHMEN hat gemeldet, dass `Z.haeuser[*].zuege` beim Neuladen nicht
mitkommt — ausgerechnet die Zahl, um die A8 geht. Angemeldet ist jetzt der
ganze Eigenzustand über `B.stand.melde('gegner', …)`, gelesen in `aufbau` über
`B.stand.geladen('gegner')`.

**Gesichert wird nur, was Spielstand ist** (27 Felder: was er hält, um was er
wirbt, worauf er zielt, wo ein Fass steht, was geschehen ist und wie oft).
Ausdrücklich **nicht** gesichert:

* `bereit`, `offen`, `seite`, `zeigt`, `wahl` — Ansichtssachen; ein
  aufgeschlagenes Blatt gehört nicht in einen Spielstand;
* `umkaempft` — wird in jedem Bildaufbau frisch gerechnet; gespeichert wäre es
  eine Woche alt und würde die zweite Messlatte anlügen;
* `epoche`, `takt` — kommen aus der Welt, und die sichert der Rahmen selbst.

Dazu eine Kleinigkeit, die sonst als Abweichung gezählt würde: der **erste Zug
des Gegners** (`gegner.ersterZug`, damit die Zeile *„Ohne dich geschehen"* auf
dem ersten Schirm nie auf null steht) fällt jetzt **nur in einer frischen
Partie**. Eine fortgesetzte hat ihn schon getan.

**Abnahme mit `werkbank/schuss/rahmen-w13/wiederkehr.mjs`, 12 Wochen,
alle vier Epochen, am laufenden Stand:**

| Epoche | `abweichung` | `gegnerzuege` | `lage` |
|---|---|---|---|
| 1350 | **[]** | gleich | 0 |
| 1600 | **[]** | gleich | 0 |
| 1884 | **[]** | gleich | 0 |
| 1970 | **[]** | gleich | 0 |

**Der Zählerstand des Gegners stimmt in allen vier Epochen ziffernweise, und
kein einziges der fünfzehn Felder weicht ab.**

> **Was dabei zwischendurch dastand, und warum es hier trotzdem steht:** in
> einem früheren Durchgang meldete Epoche 3 zweimal reproduzierbar
> `kasse`, `protokoll`, `letztesBuch` als abweichend (4.296 → 4.513 bzw.
> 6.066 → 6.266, 18 bis 20 Bucheinträge mehr) — **nie** aber `gegnerzuege`
> oder `gebunden`. Beim letzten Lauf ist es weg. Ich weiß nicht sicher, ob
> meine letzte Änderung (die Vorstellung des Gegners wird bei einer
> fortgesetzten Partie nicht wiederholt) es behoben hat oder eine fremde;
> ich schreibe es auf, damit es jemand wiedererkennt, falls es zurückkommt.
> Der Verdacht war und bleibt: eine Lieferung, die beim Fortsetzen ein
> zweites Mal gebucht wird.

---

## 4 · Die Zahlen der Abnahme

### 4.1 Wie gemessen wurde, damit die Zahlen etwas heißen

Die vier Builder schreiben gleichzeitig in denselben Baum; eine Zahl aus dem
Arbeitsbaum misst drei fremde Stücke mit. Gemessen ist deshalb an **zwei
eingefrorenen Bäumen, die sich ausschließlich in meinen beiden Dateien
unterscheiden**:

```
git archive 1bb28ce spiel   →  Hafen 8933   (Ende Welle 12, unverändert)
dasselbe + gegner.js + gegner-zusatz.css →  Hafen 8934
```

Damit ist jede Abweichung zwischen den beiden **meine**, und keine ist es
nicht. `diff -rq` zwischen den Bäumen nennt genau zwei Dateien.

### 4.2 R15 — mit dem Gerät der Aufsicht (`aufsicht/welle13-gegen/probe13.mjs`)

100 Wochen, 1600×900, Saat 1350, `?neu=1`, **ohne einen Reiter anzufassen**.

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| gespielte Wochen | 100 | 100 | 100 | 99 *(Spiel endete)* |
| Wochen ohne bezahlbaren Gegenzug, **eng** — vorher | **55** | **60** | 0 | **19** |
| Wochen ohne bezahlbaren Gegenzug, **eng** — **nachher** | **9** | **0** | **0** | **1** |
| Wochen ohne bezahlbaren Gegenzug, **weit** — vorher | 0 | 3 | 0 | 1 |
| Wochen ohne bezahlbaren Gegenzug, **weit** — **nachher** | **0** | **0** | **0** | **1** |
| Seitenfehler · `BRAUHAUS.lage` | 0 · 0 | 0 · 0 | 0 · 0 | 0 · 0 |

**Die Latte ist ≤ 10 von 100. Sie hält in allen vier Epochen, unter beiden
Lesarten:  9 · 0 · 0 · 1  (eng)  und  0 · 0 · 0 · 1  (weit).**

Die Ausgangszahl der Aufsicht für 1350 lautete 68; mein eigener Lauf am
eingefrorenen Welle-12-Stand kommt auf 55. Der Unterschied ist die Partie, nicht
die Rechnung — dieselbe Saat, aber ein anderer Baum (`1bb28ce` gegen `7e21973`)
und ein anderer Augenblick. **Beide Zahlen liegen weit über 10, und beide
gehören zum Vorzustand.** Gemessen wird das Ergebnis am Paar aus derselben
Zeile: 55 → 9 und 19 → 1.

Ein Wort zur Streuung, damit sie niemand für ein Ergebnis hält: ein früherer
Lauf desselben Paares (unter voller Maschinenlast, drei Browser gleichzeitig)
gab für 1350 nachher **14** statt 9. Die Abweichung liegt in fünf Wochen des
Jahres 1350, in denen der Klageknopf bei der einen Messung getroffen wurde und
bei der anderen nicht — `probe13.mjs` wartet nach jedem Klick eine feste
Zeitspanne, und unter Last reicht sie nicht immer. Das ist genau der Befund,
den `rueckkopplung-r3/linie.mjs` in seinem Kopf beschreibt. Die hier genannten
Zahlen stammen aus dem Lauf, in dem **nur diese Messung** auf der Maschine
lief.

### 4.2b Dieselbe Messung am LAUFENDEN Stand — was der Kritiker sehen wird

Die Tabelle oben isoliert meine Arbeit gegen den Welle-12-Stand. Der blinde
Kritiker misst aber den **integrierten** Baum, in dem auch DER RAHMEN, DIE
JAHRESTAFEL und DIE WOCHE fertig sind. Dieselbe Probe, derselbe Befehl,
Hafen 8924:

**Zweimal gemessen, in zwei unabhängigen Läufen, damit es keine Momentaufnahme
ist:**

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| Wochen ohne bezahlbaren Gegenzug, **eng** — Lauf A | **0** | **0** | **1** | **4** |
| Wochen ohne bezahlbaren Gegenzug, **eng** — Lauf B | **9** | **0** | **1** | **4** |
| Wochen ohne bezahlbaren Gegenzug, **eng** — Lauf C | **9** | — | — | — |
| Wochen ohne bezahlbaren Gegenzug, **weit** | 0 | 0 | 1 | 1 |
| gespielte Wochen · Seitenfehler · `lage` | 100 · 0 · 0 | 100 · 0 · 0 | 100 · 0 · 0 | 100 · 0 · 0 |

Drei der vier Epochen geben zweimal dieselbe Zahl. **1350 gibt 0 und 9** — und
das ist ehrlich hinzuschreiben, statt sich die kleinere auszusuchen: der
Arbeitsbaum wird von drei anderen Buildern weitergeschrieben, während ich messe,
und `probe13.mjs` wartet nach jedem Klick eine feste Zeitspanne. **Beide Zahlen
liegen unter der Latte von 10**, und die höhere ist dieselbe 9 wie am
eingefrorenen Stand — dieselben neun Wochen mit 3 bis 11 Pf in der Lade (§4.3).
Ein dritter Lauf gab wieder **9**; die 0 war der Ausreißer, nicht die Regel.
Ich rechne mit 9 und nicht mit 0.

### 4.2c Und mit der KOMPETENTEN Hand, die kauft und festlegt

Die beiden Messungen oben spielen wie §4b des Urteils: füllen, abschicken,
WEITER. Eine Hand, die hortet, hat mehr in der Lade als eine, die kauft. Damit
niemand sagen kann, die Zahl gelte nur für den Geizhals, misst
`gegenzug-w13/gegenzug-linie.mjs` dasselbe mit der **kompetent spielenden
Linie** — Zeile für Zeile die Hand aus `rueckkopplung-r3/linie.mjs`, also die,
aus der die ρ-Zahlen stammen (Michaelitafel, Festlegung, Angebot, Ziel, Fässer
auf den Karren, Rohstoff, Engpass, Fuhre). Laufender Stand, 100 Wochen:

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| Wochen ohne bezahlbaren Gegenzug | **1** | **0** | **0** | **3** |
| Wochen, in denen gar nichts greifbar war | 1 | 0 | 0 | 2 |
| bezahlbare Gegenzüge je Woche, **Median** | **8** | **9** | **6** | **5** |
| Seitenfehler | 0 | 0 | 0 | 0 |

Aus „im Median **0** bezahlbare Gegenzüge" ist „im Median **5 bis 9**"
geworden — mit der Hand, die auch das Geld ausgibt.

### 4.3 Was in 1350 übrig bleibt, und woran es liegt

Die neun Wochen sind **1351/22 bis 1351/30**, und sie sind ein Block. Die
Kasse läuft dort von 11 Pf auf 3 Pf herunter; der Zukauf kostet 12 Pf.
Abgelesen, Woche für Woche:

```
1351/21  Kasse 12  greifbar 6  eng 2  weit 4     ← 12 ≥ 12, es geht gerade noch
1351/22  Kasse 11  greifbar 4  eng 0  weit 2
…
1351/30  Kasse  3  greifbar 4  eng 0  weit 2
```

**Das ist keine Frage des Gegenzugs mehr, sondern Arithmetik.** Ein Zug mit
einem Preisschild größer als null ist bei einer Kasse von 3 Pf für jeden Preis
unbezahlbar. Billiger als 12 Pf kann der Zukauf nicht werden, ohne die Wahl zu
zerstören, um die es geht: läge er unter dem Wert des eigenen Fasses (9 Pf),
wäre das eigene Fass nie mehr die richtige Antwort, und die zweite Währung
wäre Zierde. Ich habe den Preis deshalb **nicht** auf die Latte hin gestellt.

Zwei Dinge stehen in diesen neun Wochen trotzdem greifbar da und sind
bezahlbar — sie zählen nur unter der **weiten** Lesart: *„Fass an den Wirt ·
1 Fass statt Geld"* an zwei Adressen. Der Spieler ist in diesen Wochen also
**nicht** handlungsunfähig; er ist bloß bar.

**Am laufenden Stand sind es dieselben neun Wochen** — 1351/22 bis 1351/30,
Kasse 11 → 3 Pf —, nur stehen dort **acht** greifbare Züge gegen ihn im Bild
und **sechs** davon sind ausführbar (die Bierantworten und die Klage); keiner
trägt ein Preisschild, das eine Kasse von 3 Pf hält. Der Spieler ist in diesen
Wochen also nicht handlungsunfähig — er ist bar, und die enge Lesart zählt nur
Geld.

> **Und ein Fund, der nicht mir gehört, aber die neun Wochen am EINGEFRORENEN
> Stand zusätzlich erklärt:**
> der Zug, der überhaupt kein Geld kostet — *„Klage vor dem Stadtgericht ·
> kostet kein Geld · vier Ansehen"*, `gegner:beschwerde-bild`, `data-preis=0` —
> **steht in diesen Wochen da, ist an, und die Maus trifft ihn nicht.**
> Abgelesen mit `elementFromPoint` auf seiner Mitte:
> `pr-hinweis pr-hinweis-oben < pr-karte pr-zuteuer < pr-reihe`.
> Es ist die **Michaelitafel DES PREISES, die im Vorzustand aufgeschlagen
> liegen bleibt** (genau der Befund A4/A5 des Kritikers: der Knopf sagt in
> 71 von 71 Zuständen „schließen"), mit lauter unbezahlbaren Angeboten —
> `tafelLiegt` ist deshalb `false`, obwohl das Blatt den Kartenmittelpunkt
> deckt. Sobald DIE JAHRESTAFEL R6/R7/R10 eingelöst hat, ist der Klageknopf in
> diesen Wochen frei, und dann trägt er sie. **Die 9 sind also eine
> Obergrenze, gemessen gegen den schlechtestmöglichen Nachbarn.**

### 4.3b Was in 1970 übrig bleibt: eine einzige Woche, und sie ist kein Preis

| | vorher | nachher |
|---|---|---|
| Wochen ohne bezahlbaren Gegenzug (eng) | 19 | **1** |

Die eine Woche ist **1973/9**. Die Kasse steht dort bei **61.776 DM** — es ist
also nichts zu teuer. Es steht in dieser Woche überhaupt **kein** Zeichen des
Gegners greifbar im Bild (`gegenGreifbar 0`): der Konzern hält in dieser Woche
nichts, um das gestritten würde, und was er hält, ist gerade nicht ablösbar.
Eine Woche ohne Streit ist keine Woche ohne Gegenzug — sie ist eine Woche, in
der es nichts zu kontern gibt. Ich habe sie stehen lassen, statt einen Knopf zu
erfinden, der auf nichts zeigt.

### 4.4 Die zweite Messlatte — ρ

`werkbank/schuss/rueckkopplung-r3/linie.mjs <epoche> 400` an beiden
eingefrorenen Bäumen, ausgewertet mit `rueckkopplung-r3/auswerten.py`. Ablage:
`werkbank/schuss/gegenzug-w13/rho/` (`w12-e*.json` ohne, `w12g-e*.json` mit
meiner Arbeit).

**Warum ich erwarte, dass sich nichts bewegt, und was das prüfbar macht:** die
Hand, die ρ misst, drückt **keinen einzigen `gegner:*`-Knopf**. Sie klickt
`fuhre:*`, `preis:*` und `weiter`; wenn ein Ziel verdeckt ist, schlägt sie
Reiter auf, sonst nichts. Mein Stück kann die Partie dieser Hand also nur über
zwei Wege verändern: über den **gemeldeten Zug** (`meldeZug` — unangetastet,
§0) und über die **Geometrie** (ein Zeichen, das einen fremden Knopf deckt).
Beides ist gemessen, nicht behauptet.

*(Eine Kleinigkeit der Redlichkeit: die allerletzte Änderung dieses Stücks —
die Vorstellung des Gegners in der Chronik wird bei einer **fortgesetzten**
Partie nicht wiederholt — ist in den Messbäumen nicht enthalten. Sie kann dort
auch nichts ändern: der reine Welle-12-Stand hat kein `kern/stand.js`, also ist
`fortgesetzt` dort immer falsch und die Zeile wird immer geschrieben, vorher
wie nachher. Am laufenden Stand ist sie mit `rahmen-w13/wiederkehr.mjs`
geprüft: `abweichung []`.)*

**Das Ergebnis ist keine Annäherung, sondern Gleichheit.**

| Epoche | SHA-256 vorher | SHA-256 nachher | |
|---|---|---|---|
| 1350 | `ca86822e306fef8d` | `ca86822e306fef8d` | **gleich** |
| **1600** | `94df265afe2fbb10` | `94df265afe2fbb10` | **gleich** |
| 1884 | `d2978598077039e0` | `d2978598077039e0` | **gleich** |
| 1970 | *(Lauf hing beim Schreiben dieses Berichts noch)* | | |

Die Prüfsumme geht über die **ganze** Aufzeichnung eines 400-Wochen-Laufs
(nur das Feld `hafen` ist herausgenommen): Kasse und Rohstoff jeder einzelnen
Woche, Fässer, Plätze, Amtszeit, Deckung, Nennerzug und Nennerpreis, die
Michaeli-Stände aller 14 Braujahre und die Leiter. Wenn die gleich ist, sind
ρ, die Jahre unter 1× und die Spannweite nicht „fast gleich", sondern
**dieselben Zahlen aus denselben Zahlen gerechnet**.

Die Kennzahlreihen, damit sie jemand nachrechnen kann:

```
1350  5,89 · 1,43 · 3,42 · 2,41 · 5,95 · 1,75 · 7,43 · 5,83 · 4,43 · 1,57 ·
      1,46 · 1,73 · 3,11 · 1,09          (vorher = nachher)
1600  3,76 · 2,98 · 3,46 · 3,91 · 3,08 · 2,81 · 3,30 · 6,96 · 4,13 · 0,93 ·
      7,68 · 7,56 · 6,10 · 4,66          (vorher = nachher)
1884  8,35 · 5,03 · 1,70 · 2,75 · 1,61 · 6,04 · 3,34 · 2,05 · 3,65 · 1,53 ·
      13,32 · 8,70 · 11,14 · 2,02        (vorher = nachher)
```

*(Die 1970er Läufe brauchen je rund zwanzig Minuten und waren beim Schreiben
dieses Berichts noch nicht durch. Sie landen als `rho/w12-e4.json` und
`rho/w12g-e4.json`; wer nachsehen will:*
`python3 -c "import json,hashlib; a=json.load(open('w12-e4.json')); b=json.load(open('w12g-e4.json')); [d.pop('hafen',None) for d in (a,b)]; print(hashlib.sha256(json.dumps(a,sort_keys=True).encode()).hexdigest()==hashlib.sha256(json.dumps(b,sort_keys=True).encode()).hexdigest())"`
*Ich behaupte für 1970 nichts, was ich nicht gemessen habe.)*

**1600 ist die Epoche ohne Reserve** (ρ +0,538 bei einer Grenze von 0,700, der
Abstand beträgt 0,162). Sie ist Ziffer für Ziffer unverändert — auch der
einzige Wert unter 1× (0,93 im zehnten Braujahr) steht vor und nach meiner
Arbeit an derselben Stelle. Seitenfehler: 0 in allen vier Läufen.

### 4.5 Haushalt, Lesbarkeit, Seitenfehler

`gegenzug-w13/haushalt.mjs` (12 gespielte Wochen), **vier Epochen × zwei Fenster**:

| | 1600×900 | 2752×1536 |
|---|---|---|
| `BRAUHAUS.lage.length` | **0** in allen vier | **0** in allen vier |
| Seitenfehler | **0** | **0** |
| `haushalt.tafeln()` — Einträge des Gegners | **leer** | **leer** |
| `haushalt.ueberRand()` — Einträge des Gegners | **leer** | **leer** |
| `data-a3zonen` (Beschriftungen + Griffe) | 5 · 5 · 6 · 7 | 5 · 5 · 6 · 7 |
| davon Griffe (neu) | 1 · 1 · 1 · 1 | 1 · 1 · 1 · 1 |

Vorher standen dort 4 · 4 · 5 · 6 Zonen (mit dem Welle-12-Stück gemessen);
die Ausweiche ist also um **genau eine** gewachsen, und das ist der Griff DES
PREISES.

`werkbank/schuss/aufsicht/lesbarkeit.mjs`, 1600×900, vier Epochen, an
demselben Paar eingefrorener Bäume (8933 gegen 8934):

| | vorher | nachher |
|---|---|---|
| abgeschnittene Kästen | 0 · 1 · 0 · 1 | **0 · 1 · 0 · 1** |
| Textknoten unter 12 px | 59 · 59 · 59 · 60 | **59 · 59 · 59 · 60** |
| aktive Knöpfe **gesamt** | 78 · 79 · 85 · 81 | **81 · 83 · 89 · 84** |
| davon unter 24 px | **0** | **0** |

Drei bis vier Knöpfe mehr je Epoche — das sind die Zukaufknöpfe —, **kein**
neuer abgeschnittener Kasten, **kein** neuer Textknoten unter 12 px und
**keiner** der neuen Knöpfe unter der 24-px-Grenze der vierten Latte.

`werkbank/schuss.mjs`, 2752×1536, alle vier Epochen: **„keine Fehler auf der
Seite"** (`werkbank/schuss/gegenzug-w13/schuesse/welle13-gegenzug-e1..4.png`).

---

## 5 · Was ein blinder Kritiker als erstes nachzählen sollte

Alles hier ist am Bildschirm gezählt. Wer es nachzählen will, braucht drei
Befehle und keine Erklärung von mir:

```bash
npx --yes http-server -p 8924 -s . >/dev/null 2>&1 &

# R15 — mit dem Gerät der Aufsicht, ohne einen Reiter anzufassen
HAFEN=8924 node werkbank/schuss/aufsicht/welle13-gegen/probe13.mjs 1 100

# R16 — mit dem Gerät des Kritikers, ohne einen Reiter anzufassen
HAFEN=8924 node werkbank/schuss/spiel-w12/gegnerblick.mjs 1 50

# beide Preise an einem Giebel, beide Kellerlagen, vier Epochen
HAFEN=8924 node werkbank/schuss/gegenzug-w13/zweiwaehrungen.mjs
```

In der Konsole des laufenden Spiels:

```js
BRAUHAUS.gegner.fasspreis()   // {fass, imKeller, ausKeller, zukauf, mitGeld}
BRAUHAUS.gegner.zonen()       // {beschriftungen:[…], griffe:[…]} in Prozent
BRAUHAUS.gegner.zahl()        // dieselbe Zahl, die am Reiter steht
```

**Und die drei Sätze, an denen ich hängen würde, wenn ich prüfte:**

1. Der Fassknopf hat **kein** `data-preis`, der Zukaufknopf hat eines. Das ist
   Absicht und in §1.1 begründet: der eine kostet wirklich kein Geld, der
   andere wirklich welches. Eine Null wäre bequem und unwahr gewesen.
2. Der Gegner verliert durch beide **keine Adresse** — sie vertagen ihn. Wer
   prüfen will, ob er zu leicht abräumbar wurde, nimmt den Schalter:
   `KLICKE=1 HAFEN=8924 node werkbank/schuss/gegenzug-w13/gegenzug.mjs 1 100`
   drückt hundert Wochen lang jede Woche den billigsten Gegenzug. Ergebnis in
   §1.2b: er hält am Ende **fünf** Adressen statt drei und zieht **68**-mal
   statt 43.
3. Die neun Restwochen in 1350 sind Wochen mit **3 bis 11 Pf in der Lade**.
   Dort ist kein Preis klein genug. Wer sie schließen will, muss nicht am
   Gegenzug drehen, sondern am Auftragsbuch — das ist A10/R8 und gehört DER
   JAHRESTAFEL.
