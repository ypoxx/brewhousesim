# DER PREIS — Urteil des blinden Kritikers, Welle 5

**Gemessener Commit: `6b59a18`** ("DER PREIS, Welle 5: Kassenboden gebaut,
Zaehler-Verdacht widerlegt"), eingefroren auf **eigenem Hafen 8906** ueber
`werkbank/schuss/preis-kritik-w5/hafen.sh 6b59a18 8906`.
Alle Zahlen dieses Urteils stammen von diesem Stand, nicht aus dem Arbeitsbaum
(an `kern/ton.js` und `spiel/ton/**` schrieb waehrenddessen ein anderer Builder).
Der einzige spaetere Commit `e372d8b` beruehrt keine Spieldatei
(`werkbank/LAUFENDER-AUFTRAG.md`, `werkbank/stand.json`).

> ## ⚠ ZUERST EIN BEFUND AM MESSSTAND DER AUFSICHT, weil er jede Zahl dieser Welle betrifft
>
> **`werkbank/schuss/aufsicht/messstand.sh` stellt den Hafen in diesem
> Container NICHT um und meldet den Fehlschlag nur ueber den Exit-Code.**
>
> Zeile 32 des Skripts:
> ```bash
> PID=$(ss -lptn "sport = :$HAFEN" 2>/dev/null | grep -o 'pid=[0-9]*' | head -1 | cut -d= -f2)
> ```
> `ss` ist hier **nicht installiert** (`command -v ss` → leer; `lsof` und
> `fuser` sind da). Unter `set -euo pipefail` reisst diese Zeile das Skript ab,
> **bevor** es den Server auf den verlangten Commit umsetzt. `messstand.sh
> 6b59a18` endet mit **Exit 1 und ohne jede Ausgabe** — und auf Hafen 8900
> laeuft unveraendert weiter, was vorher dort lief.
>
> Was vorher dort lief, war `/tmp/messstand/3e6d08c` (PID 26500, `CWD=/tmp/messstand/3e6d08c`)
> — **der Stand von VOR dem Bau dieser Welle**, genau der Commit, den
> `preis.js:1057` als Vorher-Messung zitiert. Der erste Satz Messungen dieses
> Urteils lief eine Stunde lang gegen diesen falschen Stand, und der einzige
> Grund, warum es auffiel, war eine Feldpruefung: `BRAUHAUS.preis.leiter()`
> lieferte keine Schluessel `vorgriff`/`rueckstand`, obwohl `preis.js:1141-1142`
> sie schreibt. Die ausgelieferte `preis.js` war 115.079 Byte gross, die des
> Commits 121.237.
>
> **Auflage an die Aufsicht (ZUSTAENDIGKEIT-Vorlage, siehe unten):** ein
> Messstand muss die AUSGELIEFERTE Datei gegen den Commit pruefen, nicht nur
> `HTTP 200` sehen. `hafen.sh` daneben tut das (drei Dateien, `sha1sum` gegen
> `git show`) und ist elf Zeilen lang.
>
> Der Nachweis, im Wortlaut:
> ```
> $ command -v ss                                   → (leer)
> $ bash werkbank/schuss/aufsicht/messstand.sh 6b59a18; echo EXIT=$?
> EXIT=1                                            (keine Zeile Ausgabe)
> $ curl -s http://127.0.0.1:8900/spiel/stuecke/preis.js | sha1sum
> 3ce38cf47886ac333be0e0e2fd6851fe755ef2c4
> $ git show 3e6d08c:spiel/stuecke/preis.js | sha1sum
> 3ce38cf47886ac333be0e0e2fd6851fe755ef2c4        ← Hafen 8900 trug 3e6d08c
> $ git show 6b59a18:spiel/stuecke/preis.js | sha1sum
> 844e2bd9a31290b3930cda5bc42f4e09c4b43fcd        ← verlangt war das
> ```
> Dazu aus `/proc`: `PID 26500  CWD=/tmp/messstand/3e6d08c  CMD=python3 -m http.server 8900`.
>
> Die verworfenen Zahlen liegen unter `/tmp/pk5-3e6d08c-falsch/` und werden in
> diesem Urteil **nirgends** verwendet — ausser als Gegenprobe an einer Stelle,
> wo sie ausdruecklich als solche benannt ist.
>
> **Nebenbefund, der die Sache erst gefaehrlich macht:** die Falle greift
> lautlos. `tor.mjs` gab auf dem falschen Stand „TOR OFFEN" fuer alle vier
> Epochen, das Spiel lief, die Zahlen sahen plausibel aus. Nur ein Feld, das
> der Builder DIESER Welle neu geschrieben hat (`preis.js:1141` `vorgriff`),
> fehlte im Ergebnis — daran ist es aufgefallen. Ohne diesen Zufall waere ein
> vollstaendiges Urteil ueber den falschen Commit entstanden.

Belege und Messgeraete: `werkbank/schuss/preis-kritik-w5/`
(`hand.mjs`, `decke.mjs`, `boden.mjs`, `auswerten.py`, `welle-seq.sh`,
`linie-vorbild.mjs` = unveraenderte Kopie des Vorbilds).

*(LAUFEND MITGESCHRIEBEN — der Stand am Ende der Datei sagt, was fertig ist.)*

---

## 0. Heil? — Das Abnahmetor

`HAFEN=8906 node werkbank/schuss/aufsicht/tor.mjs` auf `6b59a18`:

```
E1: OK   jahr=1350 zuege=105 lage=0 fehler=0
E2: OK   jahr=1600 zuege=112 lage=0 fehler=0
E3: OK   jahr=1884 zuege=116 lage=0 fehler=0
E4: OK   jahr=1970 zuege=107 lage=0 fehler=0
TOR OFFEN
```

Alle vier Epochen laden, `BRAUHAUS.lage.length === 0`, keine Konsolenfehler.

---

## 1. Das Messgeraet, bevor die Zahlen kommen

Gemessen wird SEQUENZIELL, ein Browser nach dem anderen
(`werkbank/schuss/preis-kritik-w5/welle-seq.sh`). Das Vorbild
`werkbank/schuss/rueckkopplung-r3/welle.sh` startet vier Epochen nebeneinander;
die Aufsicht hat gemessen, dass genau das die Zahlen auseinanderzieht.

Die Hand ist `hand.mjs`. Sie ist Zeile fuer Zeile die des Vorbilds
`werkbank/schuss/rueckkopplung-r3/linie.mjs` (ZUSTAENDIGKEIT 16: am fremden
Messgeraet wird nicht gedreht — das Vorbild liegt unangetastet daneben als
`linie-vorbild.mjs`), mit genau drei Aenderungen:

1. **Die Plus-Falle ist raus.** `kern/buehne.js:166` schreibt `data-preis` mit
   Vorzeichen; `spiel/stuecke/preis.js:1901` setzt fuer eine Festlegung, die
   Geld hereinbringt, `preis: (zufluss || 0)` — also POSITIV. Das Vorbild
   rechnet an drei Stellen `Math.abs(z.preis)` und macht daraus eine Ausgabe.
   `hand.mjs` rechnet `kosten(p) = Math.max(0, -p)`. Mit `ABS=1` ist die Falle
   wieder da, damit sie messbar bleibt statt behauptet.
2. 420 Wochen = **vierzehn Braujahre** (`kern/uhr.js:18`, `WOCHEN_IM_JAHR = 30`).
3. Mehr wird mitgeschrieben, gespielt wird nicht anders.

### Das Geraet ist reproduzierbar — die gemeldete Streuung war es nicht

Zwei voneinander unabhaengige, NACHEINANDER gelaufene Messungen derselben
Epoche 1 (zwei Prozesse, vier Minuten auseinander, `/tmp/pk5/e1-erst.json`
gegen `/tmp/pk5/e1-A.json`):

* Kassenreihe ueber 420 Wochen **Ziffer fuer Ziffer identisch**
* Kennzahlreihe ueber 15 Michaelitage **Ziffer fuer Ziffer identisch**
  (`5,895 · 1,548 · 4,104 · 4,393 · 13,100 · 6,104 · 9,452 · 15,136 · 15,792 ·
  11,000 · 18,444 · 10,600 · 10,886 · 8,200 · 4,840`)

Sequenziell gemessen streut dieses Spiel **gar nicht**. Wer Streuung meldet,
misst seinen Browser.

### UND EIN BEFUND AM MASSSTAB SELBST, bevor die Zahlen kommen

`rho` haengt daran, WIE VIELE MICHAELITAGE man zaehlt. Dieselbe Reihe, Epoche 1,
`6b59a18`:

| Michaelitage | 12 | 13 | 14 | 15 |
|---|---|---|---|---|
| Spearman | — | **+0,692** | **+0,591** | **+0,421** |

Der eingetragene Stand **+0,591** ist der Wert bei **vierzehn** Michaelitagen —
das sind die 400 Wochen des Vorbilds. Bei dreizehn steht dieselbe Partie auf
+0,692 und damit **acht Tausendstel unter der Latte**. Die Latte |rho| < 0,700
wird in E1 nicht mit Abstand bestanden, sondern mit der Wahl der Laufzeit.
Das gehoert neben jede Zahl geschrieben, die diese Latte nennt.

### Der Kassenboden laesst sich BUCHUNG FUER BUCHUNG messen, nicht nur wochenweise

`kern/uhr.js:170` (`schliesseJahr` → `welt.rechneJahrAb`) und der Michaeli des
Stuecks laufen INNERHALB eines einzigen WEITER-Klicks ab. Wer nur am
Wochenanfang hinsieht, sieht die Kasse erst wieder, NACHDEM der Vorgriff sie
gehoben hat — der Boden waere per Bauart unsichtbar.

`B.protokoll` ist aber vollstaendig: Anfangslade plus Summe aller Buchungen
trifft die Endkasse auf den Pfennig (E1: 112 + Σ3.696 Buchungen = 242, gemessen
242). Der Boden wird deshalb hier **Buchung fuer Buchung** gezaehlt.

### Zwischenbefund am Zaehler selbst (Quelltext, gegengelesen am Bildschirm)

`spiel/stuecke/preis.js:2393` setzt den Griff-Text zusammen:

```js
text: 'Chronik des Hauses · ' + festlegungenGesamt() + ' Festlegungen · '
      + Object.keys(Z.fertig).length + ' von dieser Tafel gebaut',
```

`festlegungenGesamt()` (Zeile 1502) zaehlt richtig — alle Chronikeintraege mit
`art === 'festlegung'`, aus allen vier Stuecken. Die ZWEITE Zahl aber ist
`Z.fertig` — das sind FERTIGE ANGEBOTE (Zeile 1177 `Z.fertig[k] = jahr()` in
`fertigstellen`), nicht Festlegungen. Sie steht in einem Satz, der von
Festlegungen handelt.

Gemessen, Epoche 1600: das Haus nimmt **genau eine** Festlegung, und zwar
`preis:festlege:reinheit` — von genau dieser Tafel. Der Griff sagt dazu:

> `Chronik des Hauses · 1 Festlegungen · 0 von dieser Tafel gebaut`

Wer das liest, schliesst: die eine Festlegung kam von woanders. Sie kam von hier.

---

## 2. DIE FRAGEN DES AUFTRAGS

Gemessen mit `hand.mjs`, 420 Wochen = **vierzehn Braujahre** je Epoche
(`kern/uhr.js:18`, `WOCHEN_IM_JAHR = 30`); darin liegen fuenfzehn Michaelitage,
weil Woche 1 des Anfangs- und des Schlussjahres beide gezaehlt werden.
Drei Laeufe je Epoche, sequenziell, Saat 1350.

### 2.1 Frage 1 — Nimmt eine sorgfaeltig gespielte Partie unwiderrufliche Festlegungen, und zeigt der Zaehler sie an?

**Ja, sie nimmt welche — aber sehr wenige, und der Zaehler zeigt sie richtig an.**
Der Verdacht „steht in allen vier Epochen auf 0" trifft auf `6b59a18` nicht mehr zu.

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| Festlegungen in 14 Jahren geklickt | **1** | **1** | **1** | **2** |
| davon mit PLUS-Preisschild | 0 | 0 | **1** | **1** |
| `welt.chronik` mit `art='festlegung'` | 1 | 1 | 1 | 2 |
| Zaehler am Griff zum Schluss | `· 1 Festlegungen ·` | `· 1 Festlegungen ·` | `· 1 Festlegungen ·` | `· 2 Festlegungen ·` |
| Angebote genommen | 1 | **0** | 3 | 2 |

Der Zaehler ist Jahr fuer Jahr mitgelaufen, nicht nur am Ende: in 1350 steht er
bis 1353 auf `0 Festlegungen`, springt an dem Michaeli auf `1`, an dem
`preis:festlege:vertrag` geklickt wurde (1354), und bleibt dort. In 1970 steht
er 1970–1975 auf `1` und ab 1976 auf `2`. `festlegungenGesamt()`
(`preis.js:1502`) zaehlt die Chronik des ganzen Hauses, wie er heisst.

**Was genommen wurde, im Wortlaut der Zugschluessel:**

```
E1  1354  preis:festlege:vertrag      Preisschild  −99
E2  1600  preis:festlege:reinheit     Preisschild  −280
E3  1884  preis:festlege:aktien       Preisschild  +11.000   ← PLUS
E4  1970  preis:festlege:konzern      Preisschild  +65.000   ← PLUS
E4  1976  preis:festlege:privat       Preisschild  −72.000
```

**Die Plus-Falle ist echt und sie kostet ein Drittel des Stuecks.**
`preis.js:1901` setzt fuer eine Festlegung ohne Ausgabe `preis: (zufluss || 0)`
— positiv. Nur zwei Karten im ganzen Spiel tragen das: `aktien` in 1884
(`preis-daten.js:891`, `wirkung.einmal: 7`) und `konzern` in 1970
(`preis-daten.js:1147`, `einmal: 6`). Eine Hand mit `Math.abs()` liest daraus
eine Ausgabe von 11.000 M bzw. 65.000 DM, haelt sie an ihrer Deckungsregel und
klickt sie **nie**. Das Vorbild `linie.mjs` tut genau das an drei Stellen
(Zeilen 233, 240, 244 der Kopie `linie-vorbild.mjs`). In E4 heisst das: die
Vorbild-Hand nimmt in vierzehn Jahren **eine** Festlegung, diese Hand **zwei**.

Und die Falle ist im Spiel keine Falle, sondern eine gute Karte mit Preis:
`aktien` bringt 1884 elftausend Mark und haengt dem Haus dafuer eine Dividende
von 34 % der Jahreslasten an (`preis-daten.js:893`). Gemessen: der Rueckstand
steigt 1888–1890 auf 228 / 1.890 / 509 M, die Kennzahl faellt 1890 auf
**0,51×** — das einzige Jahr unter 1× in allen vier Epochen. Das ist genau die
zweiseitige Kurve, die die Latte verlangt. Wer mit `Math.abs()` misst, sieht
diesen Teil des Stuecks ueberhaupt nicht.

**Aber: die Zahl 1 ist keine Zurueckhaltung der Hand, sondern das Angebot.**
In 1350 gibt es ueber vierzehn Jahre genau drei Festlegungen vor 1380
(`freikauf` 2,20 · `realrecht` 1,70 · `vertrag` 0,18 vom Grundbetrag 470,
dazu `brunnen` 0,34 ab 1355). Nach `vertrag` (99 Pf, 1354) sind die
verbleibenden `freikauf` und `realrecht` in **jedem** Michaeli bis 1364
`disabled` mit `data-soll-aus="1"` — 1.200 bis 1.900 Pf gegen eine Kasse, die
nie ueber 609 kommt. Acht Amtszeiten in vierzehn Jahren, jede mit Anspruch auf
genau eine Festlegung (`preis.js:1479 festlegungOffen`), und sieben davon haben
nichts, was sie bezahlen koennten.

### 2.2 Frage 2 — Der Kassenboden

**Die Kasse beruehrt die Null in keiner der vier Epochen, und sie unterschreitet
sie nie.** Nicht wochenweise gezaehlt, sondern **Buchung fuer Buchung** aus
`B.protokoll` (Begruendung unten); die Rekonstruktion trifft die Endkasse in
allen vier Epochen auf den Pfennig.

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| Buchungen in 14 Jahren | 3.696 | 5.903 | 5.082 | 3.707 |
| Wochen mit Kasse **= 0** | **0** | **0** | **0** | **0** |
| Wochen mit Kasse **< 0** | **0** | **0** | **0** | **0** |
| Buchungen mit Kasse ≤ 0 | **0** | **0** | **0** | **0** |
| tiefster Stand ueberhaupt | **39** | **251** | **58** | **297** |
| erreicht bei | 1351/2 | 1601/3 | 1888/15 | 1972/5 |
| Notpfennig der Epoche | 48 | 280 | 4.200 | 50.000 |
| **`vorgriff` > 0 in Jahren** | **0/15** | **0/15** | **0/15** | **0/15** |
| `rueckstand` > 0 in Jahren | 0/15 | 0/15 | **3/15** | 0/15 |

Drei Dinge stehen darin, und sie sind nicht dasselbe:

1. **Der Boden greift nicht, weil das Haus ihn nicht braucht.** Der gebaute
   Vorgriff (`preis.js:1088–1101`) ist in **sechzig** gemessenen Michaelitagen
   **kein einziges Mal** ausgeloest worden. Das ist keine Kritik am Bau — es
   heisst nur, dass die Behauptung, die den Bau traegt, mit einer sorgfaeltigen
   Hand nicht nachstellbar ist. Ob er unter einer schlechten Hand greift, misst
   `boden.mjs` (Abschnitt 4).
2. **Was die Null wirklich fernhaelt, ist aelter als dieser Bau.** In 1884
   steht die Kasse zu Michaeli 1889 und 1890 auf **exakt 4.201** — dem
   Notpfennig. Das ist die Schonung in `buche()` (`preis.js:670–671`,
   `frei = max(0, kasse − notpfennig())`): die Pflicht wird nur bis zum
   Notpfennig bezahlt, der Rest wandert in den Rueckstand (228 / 1.890 / 509 M).
   Der Boden, der hier haelt, ist der alte.
3. **Waehrend des Jahres hilft beides nicht.** In 1970 faellt die Kasse in
   Woche 1972/5 auf **297 DM** — bei einem Notpfennig von 50.000. Der
   Notpfennig ist ein Michaeli-Begriff; zwischen zwei Michaelitagen deckt ihn
   nichts. In 1884 steht das Haus mit **58 M** da (Notpfennig 4.200). Das ist
   nicht falsch, aber der Satz auf dem Blatt („der Rat laesst dem Haus den
   Notpfennig … stehen") gilt an genau einem Tag im Jahr.

**Kann das Haus in diesen Wochen noch handeln?** Ja — es gibt keine Woche ohne
Zug. In allen vier Epochen ist `welt.zugDeckung()` in **0 von 420** Wochen
`null`, und die Zahl der erreichbaren, aktiven Zuege mit Preisschild faellt nie
auf 0 (Minimum ueber die Partie: 7 · 7 · 6 · 7). Der Todzustand aus
ZUSTAENDIGKEIT 3 ist mit sorgfaeltiger Hand nicht mehr herstellbar.

**Warum Buchung fuer Buchung und nicht wochenweise:** `kern/uhr.js:170`
(`schliesseJahr` → `welt.rechneJahrAb`) und der Michaeli des Stuecks laufen
INNERHALB eines einzigen WEITER-Klicks. `kern/welt.js:412–413` zieht dort

```js
var unterhalt = Math.round(W.haus.kasse * 0.04 + W.vorrat.plaetze * 0.6);
W.haus.kasse -= unterhalt;
```

**an `zahle()` vorbei und ohne jede Deckungspruefung** — die einzige Stelle im
ganzen Spiel, an der die Kasse rechnerisch negativ werden kann. Wer nur am
Wochenanfang hinsieht, sieht die Kasse erst wieder, nachdem Michaeli sie
gehoben hat, und wuerde einen Boden bescheinigen, den er nicht gemessen hat.
Die Buchungsreihe zeigt: in vierzehn Jahren mal vier Epochen ist es dazu nie
gekommen — der kleinste Zwischenstand war 39 Pf.

### 2.3 Die zweite Messlatte

#### (d) Barschaft / Preis des naechsten sinnvollen Zuges — DER STAND HAELT

Spearman ueber (Jahr, `BRAUHAUS.preis.leiter().zugVerh`), drei Laeufe je Epoche.

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| **rho bei 14 Michaelitagen** (Stand-Vergleich) | **+0,591** | **+0,231** | +0,108 | +0,077 |
| eingetragener Stand | +0,591 | +0,231 | +0,393 | +0,108 |
| rho bei 15 Michaelitagen (volle 420 W) | +0,421 | +0,289 | +0,275 | +0,250 |
| Spannweite ueber drei Laeufe | **0,000** | **0,000** | **0,000** | **0,000** |
| Jahre unter 1× | 0/15 | 0/15 | **1/15** | 0/15 |
| Kennzahl klein–gross | 1,55–18,44× | 1,54–15,11× | 0,51–11,97× | 2,25–80,13× |
| Wochen ohne Kennzahl | 0/420 | 0/420 | 0/420 | 0/420 |

**E1 und E2 reproduzieren den Stand auf die dritte Stelle.** Das ist der Beleg,
dass er nicht kaputtgegangen ist — und zugleich der Beleg, dass diese Hand dort,
wo es keine Plus-Preisschilder gibt, Zug fuer Zug die des Vorbilds ist.

**E3 und E4 weichen ab, und zwar aus einem genannten Grund:** dort nimmt diese
Hand die Plus-Festlegung, die das Vorbild nicht sieht (2.1). Sie spielt also
eine andere Partie. Die Gegenprobe mit wiederhergestellter `Math.abs()`-Falle
(`ABS=1`) steht in Abschnitt 4.

**|rho| < 0,700 ist in allen vier Epochen und allen zwoelf Laeufen erfuellt.**
Hoechster Betrag: +0,591 (E1, 14 Jahre). „Hoechstens ein Jahr von sechs unter
1×" ist ebenfalls erfuellt: 0 / 0 / 1 / 0 von je fuenfzehn.

**Und ein Befund an der Latte selbst.** `rho` haengt sichtbar daran, wie viele
Michaelitage man zaehlt — dieselbe Partie, Epoche 1350:

| Michaelitage | 12 | 13 | **14** | 15 |
|---|---|---|---|---|
| Spearman E1350 | +0,762 | +0,692 | **+0,591** | +0,421 |
| Spearman E1884 | −0,119 | +0,055 | +0,108 | +0,275 |

Bei zwoelf Jahren **reisst E1 die Latte** (+0,762), bei dreizehn liegt sie acht
Tausendstel darunter, bei vierzehn ist sie bestanden. Wer diese Latte zitiert,
muss die Laufzeit dazusagen, sonst ist sie kein Mass.

#### (a) Entscheidungen mit Preisschild nebeneinander, erreichbar UND aktiv

**Was ich gelesen habe (ZUSTAENDIGKEIT 25):** `kern/buehne.js:184` setzt
`k.setAttribute('data-soll-aus', opt.aus ? '1' : '0')` fuer **jeden** Knopf aus
`B.knopf()`. „Aktiv" heisst darum in dieser Messung `data-soll-aus !== "1"`,
„erreichbar" heisst von `elementFromPoint` getroffen; beide sind getrennt
gezaehlt.

Je Woche ueber 420 Wochen, Median und Spannweite:

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| Zuege mit Preisschild, gesamt | 27 (21–39) | 28 (22–40) | 31 (25–41) | 30 (25–44) |
| davon **aktiv** nach `data-soll-aus` | 26 (21–36) | 28 (18–34) | 28 (19–36) | 27 (15–38) |
| davon **aktiv UND erreichbar** | **18 (7–26)** | **22 (7–25)** | **20 (6–27)** | **14 (7–22)** |
| `disabled` MIT `data-soll-aus="0"` | 2.708 | 2.700 | 2.450 | 3.138 |
| Knoepfe ganz OHNE `data-soll-aus` | 3.599 | 5.883 | 3.250 | 5.178 |

Ueber den ganzen Bildschirm gesehen steht die Zahl gut: 14 bis 22 bezahlbare,
druckbare Entscheidungen in jeder Woche.

**Auf der Michaelitafel selbst steht sie nicht gut.** Karten (Angebote +
Festlegungen), die zugleich nicht `disabled` und von `elementFromPoint`
getroffen sind, je Michaelitag:

```
E1  1350:3  1351:0  1352:1  1353:0  1354:1  1355:0  1356:4  1357:0  1358:3  1359:0  1360:4  1361:0  1362:4  1363:0
E2  1600:4  1601:0  1602:0  1603:0  1604:1  1605:0  1606:4  1607:0  1608:2  1609:0  1610:2  1611:0  1612:1  1613:0
E3  1884:6  1885:0  1886:2  1887:0  1888:0  1889:0  1890:3  1891:0  1892:3  1893:0  1894:3  1895:0  1896:5  1897:0
E4  1970:5  1971:0  1972:2  1973:0  1974:4  1975:0  1976:7  1977:0  1978:5  1979:0  1980:5  1981:0  1982:5  1983:0
```

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| Michaelitage mit **0** anfassbaren Karten | **7/14** | **8/14** | **8/14** | **7/14** |
| Michaelitage mit genau 1 | 2 | 2 | 0 | 0 |
| Michaelitage mit **≥2 — also „nebeneinander"** | **5/14** | **4/14** | **6/14** | **7/14** |

Das Muster ist nicht zufaellig: es sind ausnahmslos die **ungeraden** Jahre, in
allen vier Epochen dasselbe, und der Amtszeitwechsel laeuft im selben Takt
(`erbe-daten.js` `STUNDE_ABSTAND = 2`, zitiert in `preis.js:117`). An diesen
Tagen wird **keine einzige** der sieben bis neun Karten von `elementFromPoint`
getroffen, obwohl sie Flaeche haben und teils nicht `disabled` sind. Sie liegen
unter etwas. Alle Faecher haengen auf `#ebene-blatt` (`grund.css:104`,
z-index 60) und stapeln sich in Ladereihenfolge — DAS ERBE laedt als letztes
(`index.html:108`), sein Fach ist der letzte Bruder und liegt oben. Wer genau
verdeckt, misst `decke.mjs` (Abschnitt 4).

**Die Eichung aus ZUSTAENDIGKEIT 17** („Barschaft ≥ zweitbilligstes Angebot in
jedem der ersten fuenf Braujahre") ist zweimal gerissen:

* 1350: **1353 — Kasse 246 gegen zweitbilligstes Angebot 280.**
* 1600: **1603 — Kasse 597 gegen zweitbilligstes Angebot 840.**
* 1884 und 1970: alle fuenf Jahre erfuellt.

#### (b) Unwiderrufliche Festlegungen

1 / 1 / 1 / 2 in vierzehn Jahren, Spannweite ueber drei Laeufe **0**. Zahlen und
Zugschluessel in 2.1.

#### (c) Zuege des Gegners ohne dich

`B.protokoll` mit `wer === 'gegner'`, 420 Wochen:

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| Gegnerzuege gesamt | 285 | 813 | 324 | 604 |
| je 100 Wochen | 67,9 | 193,6 | 77,1 | 143,8 |
| Wochen mit Zuwachs | 181/420 | 380/420 | 197/420 | 332/420 |
| Spannweite ueber drei Laeufe | 0 | 0 | 0 | 0 |

**Ein Loch, und es gehoert nicht diesem Stueck.** In 1350 verstummt der Gegner
nach 1358 vollstaendig:

```
1350:31 1351:34 1352:42 1353:37 1354:40 1355:36 1356:41 1357:23
1358: 1 1359: 0 1360: 0 1361: 0 1362: 0 1363: 0 1364: 0
```

Der letzte Eintrag ist `Brauhaus zum Adler gibt auf. Der Hof gegenüber steht
leer.` (1358/1). Danach **sieben Braujahre — die halbe Partie — ohne einen
einzigen Zug des Gegners**. Das ist ein Befund fuer DER GEGNER, nicht fuer DER
PREIS; er steht hier, weil Spalte (c) ihn zaehlt.

## 3. GEGENPROBEN

### 3.1 Der Kassenboden GREIFT — aber nur unter einer schlechten Hand

`boden.mjs` spielt gar nicht, sie drueckt nur WEITER. Das Haus braut, verkauft
nichts, zahlt aber jeden Michaeli.

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| Wochen bis das Haus zumacht | **102** (1353/13) | **102** (1603/13) | **100** (1887/11) | **98** (1973/9) |
| Wochen mit Kasse **= 0** | **4** | 0 | 0 | 0 |
| Wochen mit Kasse **< 0** | 0 | 0 | 0 | 0 |
| `vorgriff` gegriffen in Jahren | **1351, 1352, 1353** | **1602, 1603** | nie | **1973** |
| Hoehe des Vorgriffs | 49 · 46 · 35 Pf | 71 · 81 fl | — | 20.197 DM |
| Kasse danach | genau 48 | genau 280 | — | genau 50.000 |
| Wochen ohne erreichbaren Preiszug | 0 | 0 | 0 | 0 |

**Der gebaute Boden tut, was auf ihm steht.** Er hebt die Kasse auf den
Notpfennig, schreibt den Betrag an (`rueckstand` 83 / 66 / 69 Pf in E1) und
laesst das Haus das naechste Braujahr brauen.

**Die Null wird trotzdem beruehrt, und zwar dort, wo der Boden nicht hinreicht:
mitten im Braujahr.** In 1350 steht die Kasse in den Wochen **27, 28, 29 und 30
auf 0** — vier Wochen. Ausloeser ist kein einzelner Posten, sondern ein
Dauertropf: `Dach, Geschirr, Wache −1 Pf` in **jeder** Woche und
`Ein Sud Grutbier −7 Pf` in jeder dritten, gegen eine Anfangslade von 112 Pf
ohne Einnahme. Der Vorgriff kommt erst am Michaeli danach (1351/1, +49 Pf).

**Und was das Haus in diesen vier Wochen tun kann: zusehen.** Es stehen 8
erreichbare, nicht gesperrte Zuege mit Preisschild auf dem Bildschirm, aber
`welt.zugDeckung()` steht auf **0** — keiner davon ist bezahlbar. Ein Zustand,
aus dem heraus es keinen Zug gibt, dauert hier vier Wochen und endet von selbst;
er versteinert das Haus nicht mehr (ZUSTAENDIGKEIT 3 ist damit erledigt), und
nach gut drei Braujahren macht das Haus zu, statt ewig weiterzulaufen
(ZUSTAENDIGKEIT 12 greift).

### 3.1b Eine Hand, die Festlegungen WILL, bekommt zwei — und danach nichts mehr

`festhand.mjs` (Kopie von `hand.mjs`, ein Unterschied: sie nimmt die
**teuerste** Festlegung, die das Spiel zulaesst, statt der billigsten unter
45 % der Kasse, und laesst die Angebote stehen, damit das Geld dafuer da ist).

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| Festlegungen in 14 Jahren | **2** | **2** | **2** | s. u. |
| genommen | `vertrag` 1350 −85 · `brunnen` 1356 −200 | `reinheit` 1600 −280 · `hofbefreiung` 1604 −650 | `aktien` 1884 **+11.000** · `konvention` 1886 −10.000 | |
| Michaelitage danach mit ueberhaupt einer **aktiven** Festlegung | **0** von 7 (1357–1363) | **0** von 9 (1605–1613) | **0** von 11 (1887–1897) | |
| Zaehler | `· 2 Festlegungen · 0 von dieser Tafel gebaut` | dito | dito | |

**Das ist die Antwort auf Frage 1 in einer Zeile:** vierzehn Braujahre, acht
Amtszeiten, jede mit Anspruch auf genau eine unwiderrufliche Wahl
(`preis.js:1479`) — und das Haus kann in seiner ganzen Geschichte **zwei**
bezahlen. Ab dem dritten Braujahr (E3: ab 1887, also elf Jahre lang) traegt
**jede** Festlegungskarte `disabled` mit `data-soll-aus="1"`, weil ihre Taxe an
der Teuerung haengt und nicht an der Kasse (`preis.js:1494 festBasis`), waehrend
die Kasse nicht mitwaechst.

Und der Zaehler sagt in allen drei Faellen `2 Festlegungen · **0** von dieser
Tafel gebaut`, obwohl **beide** von dieser Tafel kamen (siehe 5.2).

### 3.2 Die Plus-Falle, gemessen statt behauptet

Dieselbe Hand mit wiederhergestelltem `Math.abs()` (`ABS=1`), 420 Wochen:

| | E3 1884 | E4 1970 |
|---|---|---|
| Festlegungen mit `Math.abs()` | **0** | **0** |
| Festlegungen mit Vorzeichen | 1 | 2 |
| `welt.chronik` `art='festlegung'` | 0 statt 1 | 0 statt 2 |
| Zaehler zeigt dann | `· 0 Festlegungen ·` | `· 0 Festlegungen ·` |
| Kasse | 1.757–23.789 | 1.998–86.000 |
| Kasse mit Vorzeichen-Hand | 58–23.453 | 1.342–267.629 |

**Damit ist der gemeldete Verdacht erklaert, ohne dass am Zaehler etwas fehlt.**
„Chronik des Hauses · 0 Festlegungen" in 1884 und 1970 ist keine kaputte Anzeige
— es ist die wahre Zahl einer Hand, die die einzigen zwei bezahlbaren
Festlegungen dieser Epochen nie anklickt, weil sie ihr Preisschild mit dem
falschen Vorzeichen liest. Der Zaehler hat die ganze Zeit die Wahrheit gesagt.

Die Kasse in 1970 zeigt, was der Unterschied wert ist: **86.000 DM Hoechststand
mit `Math.abs()`, 267.629 DM mit Vorzeichen.**

### 3.3 Was auf der Michaelitafel liegt

`decke.mjs` (die Hand, die NICHT spielt, nur WEITER drueckt und die Tafel
aufschlaegt) findet in **jedem** erreichten Michaeli **alle** Karten getroffen —
8/8 · 9/9 · 8/8 · 9/9, ueber alle vier Epochen, auch in den Jahren mit
Amtszeitwechsel (1351, 1353, 1601, 1603, …). Sie kommt allerdings nur bis zum
dritten bis vierten Braujahr, weil das nicht spielende Haus dort zumacht (3.1).

Die Verdeckung entsteht also **erst in der gespielten Partie**. Welches Element
dort ueber den Karten liegt, misst `decke2.mjs` (dieselbe spielende Hand,
zusaetzlich der Elementpfad unter dem Mauspunkt) — Ergebnis unten.

## 4. AM BILDSCHIRM: laeuft Text ueber seinen Kasten?

`ueberlauf.mjs`, vier Epochen mal drei Aufloesungen (1920×1080, 1440×900,
1280×800), Michaelitafel aufgeschlagen. `BRAUHAUS.lage` = 0 und
Seitenfehler = 0 auf allen zwoelf Seiten; der Koerper wird nie breiter als das
Fenster.

**Ja, an 415 Stellen — davon 119 bei DER PREIS.**

| Stelle | Sichtungen | Art |
|---|---|---|
| `span.wort` (Knopftexte, alle Stuecke) | 111 | breiter als der Kasten |
| `span.zahl` | 84 | breiter |
| `div.sud-kartensatz` | 63 | hoeher |
| **`span.pr-was`** | **36** | breiter |
| **`span.pr-wurzel`** | **36** | breiter |
| **`span.pr-folge-text`** | **16** | hoeher |
| **`div.pr-satz-klein`** | **9** | hoeher |
| **`b.pr-fest-name`** | **8** | hoeher |
| **`div.pr-was-text`** | **8** | hoeher |
| **`div.pr-sperrt`** | **3** | hoeher |
| **`div.pr-hinweis`** | **3** | hoeher |

Zwei verschiedene Dinge stecken darin, und nur eines ist ein Fehler:

* **`pr-was` / `pr-wurzel` sind absichtlich gekuerzt.** `preis.css:139` setzt
  `overflow:hidden; text-overflow:ellipsis; white-space:nowrap`. Am Bildschirm
  steht „Grutgeld an den Grut…", „Malzaufschlag des Kur…". Das ist gewollt,
  aber es trifft in 1600 **vier von fuenf** Zeilen der Rechnung — die Namen der
  Pflichten sind dort nicht mehr lesbar, und daneben steht die Wurzel
  („nach dem Ausstoß im Schnitt der letzten drei…") ebenfalls abgeschnitten.
* **Auf den Festlegungskarten wird Text WEGGESCHNITTEN.** `preis.css:224` gibt
  `.pr-fest` ein `overflow:hidden`; die Kinder sind 2 bis 9 px hoeher als ihr
  Kasten. Im Bild `bild/e2-1920x1080.png` ist das zu sehen:
  auf *Der Zunftbrief mit dem Ratssitz* endet die Regel mitten in
  „Der Landesherr nimmt dafür jährlich **seinen Teil**", auf *Der Bierbann über
  vier Dörfer* endet der Satz „Dafür neu und für immer: Bannzins an den
  **Landesherrn**" im Nichts. Das ist der Satz, der sagt, was die
  unwiderrufliche Entscheidung KOSTET — und er ist abgeschnitten.

**Ausserhalb der Tafel, aber ueber der Zahl dieser Messlatte:** bei 1280×800
schiebt die Reiterleiste der STADT sich vor die Kennzahl des Kerns. Im Bild
`bild/e1-1280x800.png` liest man unten rechts nur noch
`g: Zuvorkommen Klosterschenke Obernberg — 19 Pf (Kasse reicht 5,9×)` — die
Worte „nächster Zu" liegen hinter dem Reiter `STADT Z…`. Bei 1920×1080 steht
die Zeile vollstaendig da. Gehoert dem KERN (`kern/kopf.js:127`, `left:93%`)
und der STADT, nicht diesem Stueck.

**Ein Befund, der DIESEM Stueck gehoert und den man nur im Bild sieht:** es gibt
**zwei** Knoepfe mit der Aufschrift `Chronik des Hauses`.

* `preis.js:2393` — auf dem Griff, **mit** den Zahlen
  (`· N Festlegungen · M von dieser Tafel gebaut`), gezeichnet **nur wenn die
  Tafel ZU ist** (`zeichneGriff` kehrt bei `sichtbar` vorher zurueck, Zeile 2329).
* `preis.js:2220` — oben rechts **in der offenen Tafel**, mit dem blanken Text
  `Chronik des Hauses`, **ohne jede Zahl**.

Am Michaelitag, in dem Augenblick, in dem die unwiderrufliche Wahl getroffen
wird, steht also nirgends, wie viele Festlegungen das Haus schon hat. Die Zahl
erscheint erst, nachdem man die Tafel zugemacht hat. Nachgewiesen im Bild
`bild/e2-1920x1080.png` und in der Messreihe: `zaehlerNachSchluss` ist in jedem
zweiten Michaeli `None`, weil der Griff dann nicht erreichbar ist.

## SPERRLISTE `design/PRUEFUNG.md` — nichts gefunden

Die fuenf Standardfallen aus `design/PRUEFUNG.md` §1.1, gegen die Daten und
Texte dieses Stuecks gehalten (`spiel/stuecke/preis-daten.js`, vier
Epochenbloecke getrennt durchsucht):

| Falle | Befund bei DER PREIS |
|---|---|
| Hektoliter vor 1872 | **kein Verstoss.** `hl`/`Hektoliter` kommt nur in den Bloecken der Epochen 3 (ab 1884) und 4 (ab 1970) vor, in 1350 und 1600 kein einziges Mal. Der Kern schaltet die Einheit ohnehin bei 1872 um (`kern/welt.js:254`). |
| Emailschild vor den 1890ern | **kein Verstoss.** `preis-daten.js:857` — `{ k: 'email', name: 'Emailschilder an fünfzehn Häusern', … ab: 1893 }`. Das Angebot ist vor 1893 nicht auf der Tafel. Die Regel steht ausserdem als Kommentar in `preis-daten.js:26`. |
| Strichcode / Taschenrechner 1970 | **kein Verstoss.** Kein `Strichcode`, `EAN`, `Rechner` in irgendeinem Epochenblock. |
| Untergaeriges Lager 1350 | **kein Verstoss.** `Lager`/`Lagerbier` kommt im Block der Epoche 1 nicht vor. |
| Klares goldenes Bier vor 1878 | **kein Verstoss.** `golden`/`klar` als Biereigenschaft in keinem Epochenblock. |
