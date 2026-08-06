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

*(Was davon unberuehrt bleibt: die Zahl fuer den GESPIELTEN Zustand. Dort
deckt die Sommertafel wirklich, und Huellen wie Kamera sagen dasselbe.)*

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

*(Fortsetzung: photographische Messung und ρ weiter unten, sobald die
Laeufe durch sind.)*
