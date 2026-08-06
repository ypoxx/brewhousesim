# Welle 11 — DIE FUHRE. Arbeitsstand (laufend geschrieben)

*Auftrag: `gauntlet/WELLE-11.md`, Abschnitt DIE FUHRE. Vorzustand `7896ee6`.
Gemessen wird einzeln, jeder Browser durch `aufsicht/messfenster.sh`.*

| Stand auf Hafen | was |
|---|---|
| 8951 | VORZUSTAND `7896ee6` (`aufsicht/messstand.sh 7896ee6 8951`) |
| 8952 | NACHSTAND = `7896ee6` **plus ausschliesslich** `stuecke/fuhre*.js` und `stil/fuhre*.css` (`fuhre-w11/nachstand.sh 8952`) |

Der Nachstand ist bewusst **nicht** der Arbeitsbaum: in dieser Welle bauen
drei Builder gleichzeitig darin. Ein Nachstand aus dem Arbeitsbaum wuerde
die Arbeit DES ERBEN und DES GEGNERS mitmessen, und die Gesamtdeckung
stuende dann fuer alle drei zusammen. Alle „nachher"-Zahlen unten sind
deshalb **allein die Wirkung DER FUHRE**.

---

## 1 — Was vor der ersten Zeile Code gemessen wurde

### 1.1 Die eine Zahl, um die es geht

`messungen/vorher-sonde-w30.txt`, 30 × WEITER **ohne** Escape, 2752×1536:

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| `.fu-sommerblatt` | 1596×847 | 1596×847 | 1596×718 | 1596×943 |
| in px² | 1.351.246 | 1.351.246 | 1.145.541 | **1.504.427** |
| DIE FUHRE gesamt (Huellen) | 1.375.264 | 1.356.800 | 1.152.000 | 1.515.184 |
| alle neun Stuecke (Huellen) | 44,1 % | 44,7 % | 41,3 % | 50,9 % |
| `haushalt.tafeln()` | 1 | 1 | 1 | 1 |

Photographisch (`bild-w9/deckung.mjs`, `messungen/deckung-vorher-w30.txt`):
**48,8 / 48,1 / 44,8 / 53,3 %** — die Zahl aus dem Auftrag.

Ein einziges Blatt, bis zum **Achtfachen** der Schwelle von 200.000 px², ab
der `haushalt.tafeln()` von einer ganzseitigen Tafel spricht.

### 1.2 Ein Befund, der gegen den Auftrag spricht, und er gehoert zuerst hierher

**Der Ladezustand DER FUHRE war schon vorher innerhalb ihrer Grenze.**
Der Auftrag nennt 169.305 Bildpunkte gegen eine Grenze von 34.000. Diese
Zahl stammt aus `rahmen-w10/messen.mjs`, das photographisch je Stueck misst.
Das Spiel selbst sagt etwas anderes — `messungen/vorher-sonde-laden.txt`,
`BRAUHAUS.haushalt.miss().je.fuhre`, Vorzustand, Ladezustand:

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| Huellen, im Spiel gemessen | **0 px** | **0 px** | **0 px** | **2.288 px** |
| Kaesten | 0 | 0 | 0 | 2 |
| `haushalt.pruefe()` nennt `fuhre` | nein | nein | nein | nein |

Im Ladezustand traegt DIE FUHRE **nichts** im Bild: die vier Bretter
(`fu-haeuser`, `fu-tafel`, `fu-keller`, `fu-wagen`) sind von der
Platzordnung der STADT weggeschnitten, und die Ortsmarken (`.fu-marke`)
stehen auf `stadt-marke-ruht` mit `opacity: 0` — die STADT haelt sie
zurueck, solange ORTSMARKEN aus ist.

**Woher die 169.305 px dann kommen, ist nachgestellt** (`warum.mjs`,
Vorzustand, Epoche 1): der photographische Durchgang blendet alle Kaesten
DER FUHRE aus und vergleicht zwei Aufnahmen. Der Unterschied liegt
**vollstaendig** in `x 37..873 × y 127..248`, in zwei Zeilenbloecken
127–179 und 193–248 — **das ist die Reiterzeile der STADT**
(der blinde Kritiker: „Reiterzeile oben links, x 35–890, y 120–235").
Der Grund: `beschriftung()` der STADT liest den Text der fremden Bretter,
um ihre Reiter zu beschriften; nimmt man der FUHRE die Schrift weg
(`visibility: hidden`), stehen die Reiter anders da, und der Vergleich
schreibt diese Aenderung der FUHRE zu. In meinem Nachbau sind das
28.813 px; der Rest der 169.305 entsteht, weil `messen.mjs` vor dem
Stueck-Durchgang einmal ALLE Kaesten ausblendet und wieder einschaltet —
die Reiterzeile kommt aus diesem Durchgang veraendert zurueck, verglichen
wird aber gegen die Aufnahme davor.

**Das betrifft nicht nur mich.** Jedes Stueck, dessen Bretter die STADT
zuklappt, bekommt denselben Aufschlag zugerechnet. Wer die Tabelle in
`gauntlet/WELLE-11.md` liest, sollte die Zahlen des Ladezustands mit
`BRAUHAUS.haushalt.miss()` gegenlesen, bevor er danach baut.

**Die Gegenprobe ist inzwischen gefahren und sie ist eindeutig.**
`messungen/nachher-laden.log`, derselbe Ladezustand auf dem Nachstand:

| Ladezustand, photographisch | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| `fuhre` vorher | 169.303 px | 151.951 | 125.997 | 105.811 |
| `fuhre` **nachher** | **169.305 px** | **151.951** | **125.997** | **105.953** |
| Deckung gesamt vorher → nachher | 18,4 → 18,4 % | 19,3 → 19,3 | 18,7 → 18,7 | 19,3 → 19,3 |

Ziffer fuer Ziffer dieselbe Zahl — **169.305 px**, genau die Zahl aus dem
Auftrag — waehrend das Spiel selbst fuer denselben Zustand **0 px** und
**0 Kaesten** meldet. Damit ist belegt: die 169.305 sind nicht DIE FUHRE,
und kein Bau der FUHRE kann sie bewegen.

*(Was davon unberuehrt bleibt: die Zahl fuer den GESPIELTEN Zustand. Dort
deckt die Sommertafel wirklich, und Huellen wie Kamera sagen dasselbe —
1.476.519 px photographisch gegen 1.375.264 px Huelle in 1350.)*

### 1.3 Auflage 7 des blinden Kritikers gehoert der FUHRE — und sie war falsch verortet

Der Kritiker sah in 1970 „ein Kästchen ‚FAE' … trägt darunter **zwei leere
Rechtecke in Rot** — die klassische Ersatzdarstellung für ein Zeichen, das
keine geladene Schrift zeichnen kann", und dasselbe unter „BRU". Der Rahmen
hat in Welle 10 daraufhin jedes Nicht-ASCII-Zeichen des Spiels gegen jede
Schriftkette geprueft, **kein einziges fehlendes gefunden** und die Ketten
trotzdem vorsorglich in Unifont enden lassen.

Es war nie ein Zeichen. Es sind die **Durstbetten der Ortsmarke DER FUHRE**:
`.fu-marke .fu-mbetten i`, 8×11 px, nur ein Rand in `--fu-warn`, ohne
Fuellung — ein Bett je Wagenschritt, den die Adresse gerade will. Zu sehen
in `bilder/blick-e4-bericht.png` unter „FAE" und „BRU", genau den zwei
Kuerzeln, die der Kritiker nennt (`stuecke/fuhre-daten.js`, `D.kurz`).
Behoben: gefuellte Striche statt leerer Kaesten, dieselbe Zahl an derselben
Stelle.

---

## 2 — Was gebaut wurde

| Datei | Aenderung | wofuer |
|---|---|---|
| `stuecke/fuhre.js` | `tastenSperre`: `stopImmediatePropagation()` → `stopPropagation()` (3 Stellen) | Auflage des Rahmens, `fuhre.js:3517` |
| `stuecke/fuhre.js` | `zeichneSommer` zerlegt: **Anschlag** (liegt) und **Bericht** (klappt auf), `Z.berichtOffen`, neuer Zug `fuhre:sommer-bericht` | A16 · Auftrag DIE FUHRE |
| `stil/fuhre.css` | `.fu-sommerblatt` gedeckelt auf `max(26%,700px)` × `max(17%,265px)`; Kopf/Fuss neu; `.fu-weit` fuer den aufgeschlagenen Bericht | dito |
| `stil/fuhre.css` | `.fu-marke .fu-mbetten i` gefuellt statt umrandet | Auflage 7 |

**Was ausdruecklich NICHT angefasst wurde**, weil die zweite Messlatte
daran haengt: die Klasse `.fu-sommerblatt`, die Zugschluessel
`fuhre:jahresplan:*` und `fuhre:sommer-zu`, die Reihenfolge der Sorten und
die Wirkung jedes Knopfes. Die messende Hand (`rueckkopplung-r3/linie.mjs`,
Woche 1 jedes Braujahres) sucht genau diese drei Dinge.

**Nichts ist fort.** Jede Zeile, die vorher auf der Tafel stand — der
Sommer Monat fuer Monat, der Umgang vor Michaeli, die Abgabe, das
Kerbholz, die Notsude, die verlorenen Adressen, der Weg zum guten Ende —
steht unveraendert im Bericht, hinter einem Knopf, der ihn aufschlaegt und
wieder zuklappt. Auf dem Anschlag steht zusaetzlich der Sommer in einer
Zeile: ausgeliefert, gekippt, uebrig, in die Lade, Abgabe.

### Zwei eigene Fehler beim Bauen, gefunden und behoben

**F1 — Der Kopf klebte, und deckte die halbe Entscheidung zu.**
Erste Fassung: Kopf `sticky top`, Fuss `sticky bottom`. Ist der Inhalt
hoeher als der Deckel — und in 1350 war er es um 84 px —, kleben beide und
liegen uebereinander. `messungen/probe1.txt`: `fuhre:jahresplan:duenn` und
`:grut` meldeten **VERDECKT**, `:stark` und `:kofent` „trifft". Die halbe
Jahresentscheidung war nicht anzufassen. Jetzt klebt nur der Fuss, an dem
die Entscheidung haengt; was ueberlaeuft, ist der Kopf.

**F2 — `BRAUHAUS.blatt.melde()` hat die Tafel bei 1366×768 geschlossen.**
Der Rahmen bietet den Stuecken an, ihr Blatt anzumelden. Diese Tafel hat es
getan. Gemessen bei 1366×768, 30 Wochen ohne Escape
(`messungen/klein1.txt` gegen `messungen/vorher-klein1.txt`):

| | Sommerblatt | erb-buch |
|---|---|---|
| Vorzustand | 792×492 offen | zu |
| mit `melde()` | **fort** | **308.428 px² offen** |
| ohne `melde()` | 700×162 offen | zu |

Die Kette: (1) der kleine Anschlag deckt das Erbe-Buch nicht mehr ueber
`DECKGRENZE` — also klappt die Platzordnung der STADT es nicht mehr zu;
(2) unterhalb der Entwurfsleinwand skaliert die Blattgrenze mit der
Flaeche, bei 1366×768 sind 200.000 px² nur noch 49.632 px², der Anschlag
ist dort ein ganzseitiges Blatt; (3) `raeumeAuf(false)` behaelt das
**zuletzt** ins DOM gehaengte Blatt, und das Fach DES ERBEN steht hinter
dem der FUHRE. Also blieb das Buch liegen und die Jahresentscheidung ging
zu. Dazu kaeme ein zweiter Preis: `melde()` laeuft bei jedem Zeichnen und
erzwingt ein Layout ueber die ganze Buehne — genau die Arbeit je
Bildaufbau, die der Rahmen in Welle 10 wieder ausgebaut hat, weil sie
1350 zwischen zwei Laeufen derselben Saat auseinandergehen liess.
`melde()` ist deshalb wieder heraus; die Begruendung steht im Quelltext.

---

## 3 — Die Zahlen

### 3.1 Nach 30 × WEITER, OHNE Escape — die Abnahme des Auftrags

Huellen, im Spiel gemessen (`sonde.mjs`), 2752×1536:

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| `.fu-sommerblatt` vorher | 1.351.246 | 1.351.246 | 1.145.541 | 1.504.427 px² |
| `.fu-sommerblatt` **nachher** | **189.612** | **189.612** | **182.803** | **182.803 px²** |
| `haushalt.tafeln()` vorher | 1 | 1 | 1 | 1 |
| `haushalt.tafeln()` **nachher** | **0** | **0** | **0** | **0** |
| DIE FUHRE vorher | 1.375.264 | 1.356.800 | 1.152.000 | 1.515.184 px |
| DIE FUHRE **nachher** | **195.456** | **196.480** | **187.200** | **191.984 px** |
| oberstes ⅙ DER FUHRE vorher → nachher | 140.800 → **0** | 140.800 → **0** | 140.800 → **0** | 140.800 → **0** |
| alle neun (Huellen) vorher | 44,1 % | 44,7 % | 41,3 % | 50,9 % |
| alle neun (Huellen) **nachher** | **21,8 %** | **22,4 %** | **21,7 %** | **26,5 %** |
| `verdeckt()` / `lage` / Seitenfehler | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 |

### 3.2 Dieselbe Lage photographisch — das Geraet des blinden Kritikers

`fuhre-w11/messen.mjs` (= `rahmen-w10/messen.mjs`, nur der Zielordner ist
geaendert), Bildpunkte durch Differenz zweier Aufnahmen, 2752×1536,
30 × WEITER **ohne** Escape:

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| Deckung gesamt **vorher** | 48,3 % | 47,9 % | 44,8 % | 53,3 % |
| Deckung gesamt **nachher** | **22,0 %** | **22,7 %** | **21,9 %** | **26,7 %** |
| oberstes ⅙ vorher → nachher | 55,8 → **30,5** | 56,4 → **31,1** | 56,3 → **31,1** | 58,8 → **36,9 %** |
| Mittelband vorher → nachher | 56,8 → **23,6** | 56,1 → **24,5** | 51,4 → **23,4** | 63,5 → **29,1 %** |
| unterstes ⅙ | 7,0 → 7,0 | 6,7 → 6,7 | 6,6 → 6,6 | 7,2 → 7,2 % |
| **fuhre** vorher | 1.476.519 | 1.528.368 | 1.398.569 | 1.658.986 px |
| **fuhre** nachher | **342.331** | **342.202** | **328.844** | **275.433 px** |
| fuhre, oberstes ⅙ | 25,3 → **0,0** | 25,9 → **0,0** | 25,5 → **0,0** | 23,0 → **0,0 %** |
| über dem Rand | 0 → 0 | 0 → 0 | 0 → 0 | 0 → 0 |
| Währungsbruch | 0 → 0 | 0 → 0 | 0 → 0 | 0 → 0 |
| fehlende Zeichen | 0 → 0 | 0 → 0 | 0 → 0 | 0 → 0 |
| `lage` / Seitenfehler / `verdeckt()` | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 |

Das Blatt selbst, photographisch als groesster Kasten der FUHRE gemessen:
**716×254 = 181.909 px²** (1350) und **716×239 = 171.288 px²** (1970) —
gegen 1.351.246 bzw. 1.504.427 px² vorher.

**Zwei Dinge, die gegen die schoene Zahl sprechen, und sie stehen hier:**

**Erstens: photographisch deckt DIE FUHRE 342.331 px, die Huelle nur
195.456.** Der Unterschied sind Schlagschatten und der Aufschlag aus §1.2 —
die Reiterzeile der STADT aendert sich, wenn man der FUHRE die Schrift
wegnimmt. Der Anteil DER FUHRE ist damit weiter zu hoch angesetzt, und zwar
in beiden Spalten gleichermassen; das Verhaeltnis 1.476.519 → 342.331
(−77 %) traegt trotzdem.

**Zweitens: ein Teil des Gewinns ist an andere Stuecke weitergegeben, nicht
eingespart.** Die grosse Tafel hat fremde Kaesten verdeckt und die
Platzordnung der STADT dazu gebracht, fremde Bretter zuzuklappen. Der kleine
Anschlag tut das nicht mehr. Gemessen auf demselben Stand, 1970:

| | vorher | nachher |
|---|---|---|
| gegner | 319.548 px | **554.170 px** |
| erbe (1350) | 142.518 px | **208.703 px** |

Diese Zunahme ist **nicht** die Arbeit DES GEGNERS oder DES ERBEN — beide
sind auf diesem Stand unveraendert. Sie ist meine: was vorher unter meiner
Tafel lag, liegt jetzt frei. Beide Stuecke raeumen in derselben Welle in
ihre Grenzen (28.000 px); danach faellt die Summe entsprechend. Die Zahl
„Gesamtdeckung unter 20 %" ist deshalb ein gemeinsames Ergebnis der drei
und nicht meines allein: allein DIE FUHRE bringt sie auf **21,9 bis
26,7 %**.

### 3.3 Dieselbe Zahl mit dem Geraet des blinden Kritikers

`fuhre-w11/deckung.mjs` (= `bild-w9/deckung.mjs`, nur der Zielordner ist
geaendert), 30 × WEITER **ohne** Escape:

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| **vorher** | 48,8 % | 48,1 % | 44,8 % | 53,3 % |
| **nachher** | **22,1 %** | **22,7 %** | **21,9 %** | **26,7 %** |

Zwei unabhaengig gefahrene Geraete, dieselbe Zahl auf die Zehntelstelle
(`messen.mjs` sagt 22,0 / 22,7 / 21,9 / 26,7).

**Die Latte „unter 20 %" ist damit NICHT genommen** — allein DIE FUHRE
bringt sie auf 21,9 bis 26,7 %. Was fehlt, ist der Ruhezustand der anderen
Stuecke; in 1970 traegt allein DER GEGNER 13,1 % (554.170 px, Grenze
28.000). Beide Nachbarn raeumen in derselben Welle.

### 3.4 Ladezustand — unveraendert, und das ist die Absicht

`deckung.mjs` ohne `WOCHEN`, Nachstand:

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| gesamt vorher (Welle 10) | 18,1–19,3 % | | | |
| gesamt **nachher** | **18,4 %** | **19,3 %** | **18,7 %** | **19,2 %** |
| oberstes ⅙ nachher | 35,6 % | 36,0 % | 36,3 % | 37,7 % |

Ziffer fuer Ziffer der Vorzustand. Die Georgi-Tafel liegt im Ladezustand
nicht, also kann sich dort nichts bewegen.

### 3.5 Escape — die Abnahme der Auflage des Rahmens

`escapeprobe.mjs`, 30 × WEITER, dann Escape, dann Chronik auf, dann Escape:

| Epoche | Sommertafel vor → nach Escape | Chronik offen → nach Escape | `tafeln()` | `spur()` des Rahmens |
|---|---|---|---|---|
| alle vier | **true → false** | **true → zu** | **0** | nicht leer (`erb-buch -> klemme+reiter`) |

Dazu in allen vier: `lage` 0 · Seitenfehler 0 · `verdeckt()` 0.

Das ist genau der Wortlaut der Auflage: *„mit aufliegender Sommertafel
schliesst Escape sie UND der Chronikgriff des Rahmens (`kern:chronik`)
laesst sich weiter mit Escape schliessen."* Dass `spur()` nicht leer ist,
ist der zweite Teil: die Blattaufsicht des Rahmens **sieht** den Anschlag
jetzt, weil `stopPropagation()` ihr die Taste nicht mehr abnimmt.

*(Beim ersten Anlauf war der Chronik-Teil dieser Probe falsch gemessen:
ich habe die Chronik 600 ms nach Escape aufgeschlagen und damit mitten in
das Nachfassen des Rahmens hinein, das ueber 2,6 s laeuft — `spur()` zeigte
„760ms: kern .blatt rolle -> klemme+knopf:kern:blatt-zu". Die Probe wartet
jetzt 3,2 s. Der Fehler lag in meinem Messgeraet, nicht im Spiel.)*

### 3.6 Die vierte Latte und das Tor

`aufsicht/lesbarkeit.mjs` bei **1366×768**, Nachstand:

| | vorher (Welle 10) | nachher |
|---|---|---|
| Ueberlaeufe | 14 | **14** |
| Textknoten unter 12 px | 497 | **497** |
| Knoepfe unter 24 px | 0 von 307 | **0 von 307** |
| abgeschnittene Kaesten je Epoche | 3/4/3/4 | **3/4/3/4** |

Nichts ist schlechter geworden, nichts besser — die Georgi-Tafel liegt im
Ladezustand nicht, und `lesbarkeit.mjs` misst nur den Ladezustand. **Der
Anschlag selbst ist deshalb gesondert bei 1366×768 geprueft** (`sonde.mjs`,
`messungen/klein2.txt`, 30 Wochen): 700×162, alle vier Sudknoepfe 342×24 —
genau auf dem Knopfboden — und alle vier „trifft".

`aufsicht/tor.mjs`: **TOR OFFEN**, E1–E4 je `lage=0 fehler=0`,
99/107/110/102 Zuege.
`aufsicht/spielprobe.mjs`: **BESTANDEN**, 60 Wochen je Epoche, `lage 0`,
`Fehler 0`.

### 3.7 ρ — die zweite Messlatte

`rueckkopplung-r3/linie.mjs` unveraendert, 400 Wochen je Epoche, Saat 1350,
je Epoche EIN Lauf, jeder einzeln durchs Messfenster. Ausgewertet mit
`fuhre-w6/schnitte.py` (drei Schnitte) und `rueckkopplung-r3/auswerten.py`
(Jahre unter 1×).

**NACHHER** (Nachstand 8952, `messungen/rho-nachher/`):

| Epoche | 12 J | 13 J | 14 J | Jahre < 1× | Kasse | Fehler |
|---|---|---|---|---|---|---|
| 1350 | +0,252 | +0,181 | **+0,191** | **0/14** | 8–514 | 0 |
| 1600 | −0,189 | +0,049 | **−0,116** | **0/14** | 291–2851 | 0 |
| 1884 | +0,168 | +0,346 | **+0,393** | **1/14** | 1757–23789 | 0 |
| 1970 | −0,112 | −0,236 | **−0,304** | **1/14** | 320–95857 | 0 |

**Die Latte haelt in allen vier Epochen** (groesster Wert 0,393, Latte
0,700), und die Jahre unter 1× liegen mit 0/0/1/1 von 14 unter der
Erlaubnis (ein Jahr von sechs = 2,33 von 14).

**1600, 1884 und 1970 sind Ziffer fuer Ziffer der Vorzustand**, wie ihn der
Rahmen in Welle 10 dreimal gemessen hat (Saetze A, B und C) — dieselben
drei Schnitte, dieselben Jahre unter 1×, dieselbe Spannweite der Kasse.

**1350 ist es nicht, und das steht hier, weil es gegen die einfache
Erzaehlung spricht.** Der Rahmen hat fuer 1350 auf demselben Stand ZWEI
verschiedene Reihen gemessen — Satz A und C −0,336 (Kasse 28–524, 2/14
Jahre unter 1×), Satz B +0,270 (Kasse 34–583, 0/14) — und das ausdruecklich
als **Geraetebefund** vermerkt: „elf Laeufe sind Ziffer fuer Ziffer der
Vorzustand und einer ist es nicht, und bei gesaetem Wuerfel ist das kein
Streuungsmass". Mein Lauf liefert eine dritte Zahl (+0,191, Kasse 8–514,
0/14) und liegt damit auf dem Ast von Satz B (positives ρ, 0 Jahre unter
1×). Beide Aeste bestehen die Latte deutlich.

**Der eigene Vorher-Lauf ist gefahren, und er spricht gegen mich.**
`messungen/rho-vorher/e1-a.json`, `7896ee6`, heute, dieselbe Maschine:

| 1350 | 12 J | 13 J | 14 J | Jahre < 1× | Kasse |
|---|---|---|---|---|---|
| **vorher** (7896ee6) | −0,245 | −0,170 | **−0,336** | **2/14** | 237→66, 28–524 |
| **nachher** | +0,252 | +0,181 | **+0,191** | **0/14** | 237→110, 8–514 |

Der Vorzustand liefert heute Ziffer fuer Ziffer den Satz A des Rahmens.
**Meine Fassung liefert etwas anderes.** Die Kennzahlreihe laeuft in den
ersten drei Braujahren gleich (5,89 · 1,43 · 3,42) und geht im **vierten**
auseinander (2,41 gegen 3,32).

**Was ich dazu weiss, und was ich nicht weiss.** Der Nenner sagt, dass es
eine andere Partie ist, nicht eine andere Rechnung: vorher gewinnt die
Nennerzeile in 400 von 400 Wochen ohne Zugschluessel und mit der Art
`umkaempft` (das ist DER GEGNER), nachher in 242 von 400 — dazwischen
144 Wochen `bindung` und 14 `lage`, also Zuege DER FUHRE selbst.
**Der wahrscheinliche Weg dahin liegt in der messenden Hand und nicht im
Spiel:** `linie.mjs:klick()` klickt, wenn ein Knopf nicht getroffen wird,
DER REIHE NACH JEDEN Reiter der STADT, bis er trifft — und jeder dieser
Klicks ist ein Umschalter, der Bretter auf- und zuklappt. Wie oft dieser
Notweg gegangen wird, haengt daran, was gerade wie gross wo liegt. Eine
kleinere Georgi-Tafel deckt weniger zu, also faellt der Notweg oefter weg,
also bleiben andere Bretter offen, also findet die Hand in spaeteren Wochen
andere Knoepfe. Belegen kann ich diese Kette nicht — dazu muesste ich die
Hand mitschreiben lassen, und an fremden Messgeraeten wird nicht gedreht.

**Was trotzdem feststeht:**
* Beide Reihen bestehen die Latte mit grossem Abstand (0,336 und 0,191
  gegen 0,700), und der groesste Wert aller vier Epochen ist unveraendert
  0,393 (1884).
* Die Jahre unter 1× sind **besser** geworden: 2/0/1/1 → **0/0/1/1** von
  14, erlaubt sind 2,33.
* 1600, 1884 und 1970 sind Ziffer fuer Ziffer unveraendert.
* 1350 ist die Epoche, die schon beim Rahmen auf dem UNVERAENDERTEN Stand
  zwischen zwei Laeufen umgesprungen ist (Satz B: +0,270, 0/14) — mein
  Nachher-Lauf liegt auf genau diesem Ast.


---

## 4 — Was DIE FUHRE weiter offen laesst, mit Datei, Zahl und Abnahme

Damit es niemand suchen muss, und weil es gegen meine eigene Zahl spricht:
**der 30-Wochen-Zustand ist nicht der einzige, in dem dieses Stueck ein
formatfuellendes Blatt legt.** Zwei weitere kommen spaeter in der Partie und
sind von der Abnahme dieser Welle nicht erfasst:

| Blatt | Datei · Zeile | Mass (2752×1536) | wann |
|---|---|---|---|
| `.fu-ausgangblatt` (Antrag · Übergabe) | `stil/fuhre-zusatz.css:600` | 56 % × 46,5–70 % = **1.542×714 bis 1.075** = 1,10 bis 1,66 Mio px² | Michaeli, sobald ein Antrag vorliegt bzw. das Haus uebergeben werden darf |
| `.fu-schlussblatt` | `stil/fuhre-zusatz.css:357` | 56 % × bis 80 % = **1.542×1.229** = bis 1,89 Mio px² | am Ende der Partie |

Beide sind mit **Absicht** so gross: der Kopf von `fuhre-zusatz.css:580`
rechnet vor, dass die Platzordnung der STADT ein Blatt zum Jahreswechsel
erst ab 25 % der Buehne von selbst aufschlaegt (`stadt.js:1408`). Diese
Rechnung gilt fuer die Georgi-Tafel nicht mehr — sie schlaegt auch klein
auf, weil ein Brett, das WAEHREND des Spiels neu auftaucht, der Ordnung als
eben geholt gilt (nachgemessen, §3.1: `Sommerblatt true` in allen vier
Epochen). **Damit ist die Begruendung fuer die 26 % auch bei den
Ausgangblaettern hinfaellig**, und dieselbe Trennung — Anschlag liegt,
Bestand klappt auf — traegt dort ohne Aenderung am Spiel.
Ich habe es nicht mehr gemacht, weil jede weitere Aenderung an
`stuecke/fuhre*.js` die ρ-Messung dieser Welle ungueltig gemacht haette.
*Abnahme fuer den, der es aufnimmt:* `haushalt.tafeln()` bleibt auch dann
leer, wenn `BRAUHAUS.fuhre.stand().antrag` nicht null ist.

---

## 5 — Was in diesem Ordner liegt

| Datei | wozu |
|---|---|
| `sonde.mjs` | die Innensicht: `haushalt.miss()/tafeln()/pruefe()/ueberRand()`, dazu jeder SICHTBARE Kasten der FUHRE ueber 15.000 px² und ob die vier Planknoepfe sich selbst treffen. Schnell (20 s je Epoche), deshalb das Geraet zum Bauen. `BREITE`/`HOEHE` waehlbar |
| `messen.mjs` | = `rahmen-w10/messen.mjs`, nur Zielordner und `EPOCHEN` ergaenzt — photographisch, je Stueck |
| `deckung.mjs` | = `bild-w9/deckung.mjs` des blinden Kritikers, nur Zielordner und `EPOCHEN` ergaenzt |
| `warum.mjs` | die Gegenprobe zu den 169.305 px: stellt den Stueck-Durchgang nach und zeigt, WO der Unterschied liegt (§1.2) |
| `blick.mjs` | Aufnahmen von Anschlag und aufgeschlagenem Bericht, plus Masse und Trefferprobe |
| `escapeprobe.mjs` | die Abnahme der Rahmen-Auflage: Escape schliesst die Tafel UND die Chronik bleibt mit Escape schliessbar |
| `nachstand.sh` | friert `7896ee6` + **nur** die Dateien DER FUHRE ein (Builder duerfen nicht committen) |
| `vorher.sh` · `nachher.sh` · `rho.sh` | die Messsaetze, jeder Lauf einzeln durchs Messfenster |
| `messungen/` | alle Rohdaten. `vorher-*` = `7896ee6`, `nachher-*` = Nachstand |
| `bilder/` | `blick-*` bei 2752×1536, `klein-*` bei 1366×768, `warum-*` fuer §1.2 |
