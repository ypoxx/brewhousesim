# Welle 13 · Stück 4 — DER GEGENZUG · Baubericht

*Laufend geschrieben. Wer hier liest, bevor die Schlusszeile steht, liest einen
halben Bericht — das ist Absicht: Agenten sterben mitten im Lauf.*

Angefasst habe ich **nur**: `spiel/stuecke/gegner.js` · `spiel/stil/gegner-zusatz.css`.
Gebaut habe ich `werkbank/schuss/gegenzug-w13/**`.
**Nichts unter `spiel/kern/`, nichts von fremden Stücken, kein fremdes DOM.**

---

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

*(Zahlen folgen, sobald die Läufe durch sind — Abschnitt 4.)*

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

| | vorher | nachher |
|---|---|---|
| Wochen mit Zahl am Reiter | **30 / 50** | **50 / 50** |
| Woche 15 | `OHNE DICH GESCHEHEN 12 Züge` | `OHNE DICH GESCHEHEN · 12 ZÜGE  zugeklappt` |
| Woche 45 | `OHNE DICH GESCHEHEN` | `OHNE DICH GESCHEHEN · 25 ZÜGE  zugeklappt` |
| **Form Woche 45 = Form Woche 15** | **nein** | **ja** |

### Und was das an der Geometrie anrichtet — nachgemessen, nicht behauptet

`gegenzug-w13/mass-laden.mjs`, **48 Lagen** (4 Fenster × 4 Epochen × 3
Zeitpunkte), vorher gegen nachher, Feld für Feld:

| Feld | Abweichungen |
|---|---|
| `.stadt-reiterzeile` (Kasten) | **0 von 48** |
| `.stadt-werkbank` (Kasten) | **0 von 48** |
| `schmal` ja/nein | **0 von 48** |
| Zahl der Reiter | **0 von 48** |
| `weiter` · `fuhre:abschicken` · `fuhre:wie-vorige` · `fuhre:fuellen` · `preis:tafel` | **0 von 48** |
| Kasse · Zählerstand des Gegners | **0 von 48** |
| **mein eigener Reiter** | 24 von 48 — **nur die Breite**, 224 → 262 Bezugspixel bei 2752×1536; Höhe, Ort und Zeile unverändert |

Der Reiter wird also breiter, und **sonst bewegt sich nichts** — die
Reiterzeile bricht in keiner der 48 Lagen anders um, die Werkbank wird nicht
höher, und die fünf Knöpfe, an denen jede Messung dieses Loops hängt, stehen
auf demselben Pixel. Bei 1366×768 ändert sich nicht einmal die Breite (dort
bricht `.wort` ohnehin um).

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

| Epoche | `abweichung` | `gegnerzuege` |
|---|---|---|
| 1350 | **[]** | gleich |
| 1600 | **[]** | gleich |
| 1884 | `kasse`, `protokoll`, `letztesBuch` | **gleich** |
| 1970 | **[]** | gleich |

**Der Zählerstand des Gegners stimmt in allen vier Epochen ziffernweise.**

> **Ein Fund, der nicht mir gehört, und ich melde ihn statt ihn zu
> reparieren:** in **Epoche 3** weicht nach dem Neuladen die Kasse ab
> (4.296 → 4.513 bzw. 6.066 → 6.266) und das Buch hat 18 bis 20 Einträge mehr.
> In zwei Läufen reproduzierbar, in 1350/1600/1970 nicht. Es ist **nicht** der
> Gegner: `gegnerzuege` und `gebunden` stimmen, und eine Gegenprobe mit einer
> eigenen Hand (`/tmp`, 12 Wochen, Protokoll Eintrag für Eintrag verglichen)
> fand **null** zusätzliche Einträge. Es sieht nach einer Lieferung aus, die
> beim Fortsetzen ein zweites Mal gebucht wird — das gehört DER FUHRE oder DEM
> RAHMEN.

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

> **Und ein Fund, der nicht mir gehört, aber diese neun Wochen erklärt:**
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

`werkbank/schuss/rueckkopplung-r3/linie.mjs <epoche> 400` an beiden Bäumen,
ausgewertet mit `auswerten.py`. Ablage: `werkbank/schuss/gegenzug-w13/rho/`.

*(Zahlen folgen.)*

### 4.5 Haushalt, Lesbarkeit, Seitenfehler

`/tmp/haushalt.mjs` (12 gespielte Wochen), **vier Epochen × zwei Fenster**:

| | 1600×900 | 2752×1536 |
|---|---|---|
| `BRAUHAUS.lage.length` | **0** in allen vier | **0** in allen vier |
| Seitenfehler | **0** | **0** |
| `haushalt.tafeln()` — Einträge des Gegners | **leer** | **leer** |
| `haushalt.ueberRand()` — Einträge des Gegners | **leer** | **leer** |
| `data-a3zonen` (Beschriftungen + Griffe) | 5 · 5 · 6 · 7 | 5 · 5 · 6 · 7 |
| davon Griffe (neu) | 1 · 1 · 1 · 1 | 1 · 1 · 1 · 1 |

Vorher standen dort 4 · 4 · 5 · 6 Zonen; die Ausweiche ist also um **genau
eine** gewachsen, und das ist der Griff DES PREISES.

`werkbank/schuss/aufsicht/lesbarkeit.mjs`, 1600×900, vier Epochen:

| | vorher | nachher |
|---|---|---|
| abgeschnittene Kästen | 0 · 1 · 0 · 1 | **0 · 1 · 0 · 1** |
| aktive Knöpfe unter 24 px | 0 von 78/79/85/81 | **0 von 75/77/81/77** |
| Textknoten unter 12 px | 59 · 59 · 59 · 60 | 60 · 60 · 60 · 61 |

Der zweite Knopf bringt also **keinen** neuen abgeschnittenen Kasten und
keinen Knopf unter die 24-px-Grenze.

`werkbank/schuss.mjs`, 2752×1536, alle vier Epochen: **„keine Fehler auf der
Seite"** (`werkbank/schuss/gegenzug-w13/schuesse/welle13-gegenzug-e1..4.png`).
