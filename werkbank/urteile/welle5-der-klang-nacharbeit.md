# DER KLANG — Nacharbeit zu Welle 5

**Urteil, gegen das gearbeitet wird:** `welle5-der-klang-urteil.md`,
BESTEHT MIT AUFLAGE, gemessen an `2f0e4b4`.
**Ausgangsstand dieser Nacharbeit:** `36f81c6`. Zwischen `2f0e4b4` und `36f81c6`
haben sich an `spiel/` nur `preis*.js` und `preis-zusatz.css` bewegt (anderer
Builder); `kern/ton.js`, `stuecke/klang.js` und `ton/**` sind Zeichen fuer
Zeichen unveraendert. Der Ton, den der Kritiker gemessen hat, ist also der Ton,
den ich vorgefunden habe.

**Belege:** `werkbank/schuss/klang-w5-nach/` (Werkzeuge, Erzeugungsprompts,
Antworten). Die Aufnahmen selbst liegen im Arbeitsverzeichnis der Messung.

---

## 0 — Der Messstand (eingefroren, damit Zahlen nicht wandern)

Am Arbeitsbaum baut gleichzeitig DER PREIS. Eine Zahl auf einem wandernden Ziel
ist keine Zahl. Deshalb:

* `/tmp/klangbau/stand/` — vollstaendige Kopie des Arbeitsbaums zu Beginn,
  eigener Hafen **8931**.
* In diesen Stand wird waehrend der Arbeit **nur** kopiert, was mir gehoert:
  `spiel/kern/ton.js`, `spiel/stuecke/klang.js`, `spiel/ton/**`. Alles
  andere — auch `preis*.js` — bleibt auf dem Stand des Beginns. Vorher-Messung
  und Nachher-Messung unterscheiden sich damit **nur** in meinen Dateien.
* Aufgenommen wird mit dem Geraet des Kritikers,
  `werkbank/schuss/klang-blind-w5/aufnahme.mjs`, **Zeichen fuer Zeichen
  unveraendert** (Mitschnitt am lebenden Ausgang, eigener WAV-Schreiber, kein
  Gebrauch von `ton.wav()`/`ton.rendere()` — Sperrliste 4). Gleiche Umgebung
  wie er: `RUHE=8`, `VORLAUF=26`, derselbe Zugplan, `saat=1350`.
* Gehoert wird mit `werkbank/hoerer.py`, ebenfalls unveraendert (ZUSTAENDIGKEIT
  16); gerufen wird nur `hoere()`, ohne `--erwartet`. Gemischt wird mit seinem
  `mische.py`, drei Durchgaenge je Datei (Sperrliste 5).
* Dass der Stand seine Messung traegt, ist nachgeprueft: die Vorher-Aufnahmen
  reproduzieren seine Effektivwerte auf die vierte Stelle (0,11221 gegen
  0,11117 in 1350; 0,16147 gegen 0,16227 in 1970).

---

## 1 — WAS ICH VORGEFUNDEN HABE, UND ES IST SCHLIMMER ALS SEIN BEFUND

Der Kritiker misst **still 18/20 (90 %) gegen gespielt 12/20 (60 %)** ueber
zwei Ohren und zwei Aufnahmesaetze. Ich habe seinen Versuch am selben Tag,
mit demselben Werkzeug und einem Ohr (`gemini-3.6-flash`) in drei Durchgaengen
ueber acht frische Aufnahmen wiederholt:

| Vorlage (`36f81c6`, unveraendert) | still | gespielt |
|---|---|---|
| Ohr `gemini-3.6-flash`, 3 Durchgaenge | **12/12 = 100 %** | **3/12 = 25 %** |

**Nichtstun trug die Epoche vollstaendig. Spielen traf den Zufall.** Vier
Epochen, vier Moeglichkeiten, 25 % — das ist das Raten selbst. Der Kritiker hat
den Befund richtig benannt und in der Schaerfe unterschaetzt.

Und die Begruendung des Ohres steht **zwoelfmal von zwoelf** auf der Bettmusik:
*"Blockfloete/Schalmei"*, *"gezupfte Lautenmusik im Renaissance-Stil"*,
*"Blechblasmusik der Gruenderzeit mit Tuba"*, *"E-Bass, Schlagzeug und
E-Orgel"*.

### Der mechanische Grund, den bisher niemand genannt hat

Bett und Hof liefen **ohne jedes Zutun** — und `ducke()`/`zaesur()` zogen sie
unter **jeden** Vorgang weg. Im Spiel faellt alle ein bis zwei Sekunden ein
Zug. Also war die einzige Schicht, die die Zeit wirklich trug, genau dann am
lautesten, wenn **niemand spielte**, und genau dann verschwunden, wenn jemand
spielte. Das ist die Latte auf den Kopf gestellt, und es erklaert beide Zahlen
auf einmal.

### Der zweite Grund: die Vorgangsproben halten nicht, was ihr Name verspricht

Ich habe jede epochentragende Probe **einzeln** vorgelegt
(`werkbank/schuss/klang/beschreibe.py`, ohne Dateinamen, ohne Absicht). Was
zurueckkam:

| Probe | wofuer sie stand | was das fremde Ohr wirklich hoert |
|---|---|---|
| `abfahrt1` | Ochsenfuhre 1350 — **der Hauptvorgang der ersten Epoche** | *"Plaetschern von Wasser · Gluckern und Blubbern · Tropfgeraeusche"* |
| `abfahrt2` | Pferdefuhre 1600 | *"Metallisches Kurbeln und Ratschen einer Mechanik"* |
| `abfahrt3` | Rangieren am Waggon 1884 | *"Zischen · MENSCHLICHES PFEIFEN EINER MELODIE · Quietschen"* |
| `abfahrt4` | Lastzug 1970 | Motor **plus** *"Zischen einer Druckluftentlastung, Sekunde 2–4"* |
| `sud1` | offenes Holzfeuer 1350 | *"Wassergluckern · Blubbern"* — kein Feuer |
| `sud3` | Dampfventil 1884 | *"SPRUEHDOSE / AEROSOLSPRAY (erst ab 1927)"* · *"Spielzeughupe"* |
| `fassstahl` | rollendes Stahlfass 1970 | *"GONGSCHLAG · resonierender Nachhall, 21. Jahrhundert"* |
| `werksglocke` | Werksglocke 1970 | *"hoher, schriller ELEKTRONISCHER Pfeifton"* |
| `glocke` | Kirchenglocke 1350/1600 | *"ROEHRENGLOCKEN"* — Orchesterinstrument |

**Die FUHRE hatte in drei von vier Epochen gar keinen Abfahrtsklang.** Damit
ist der Befund des Kritikers vollstaendig erklaert, und zwar in beide
Richtungen: die stille Aufnahme trug die Epoche, weil unter ihr Musik lag; die
gespielte trug sie nicht, weil die Vorgaenge etwas anderes waren als ihr Name.

Drei Verwechslungen des Ohres fallen damit an ihren Ort:

* *"eine einfache mittelalterliche HOLZFLOETENMELODIE"* in der gespielten
  Aufnahme von **1884** (2 von 3) — das war das gepfiffene Liedchen in
  `abfahrt3`, dazu die `fabrikpfeife`, die in 1884 sowohl den WEITER-Knopf als
  auch den Michaelitag bediente: acht Wiederholungen desselben reinen
  Pfeiftons in dreissig Sekunden, und ein wiederholter reiner Ton ist fuer ein
  Ohr eine Melodie.
* *"zischender Wasserdampf, Stampfen einer Dampfmaschine"* in **1970**
  (3 von 3, Auflage 2) — das Druckluftzischen aus `abfahrt4` und zwoelf
  gestapelte Gongschlaege aus `fassstahl` (Auflage 3).
* *"Fahrradklingel"*, *"Autohupe"*, *"Sirene"* in **1350** — die
  Roehrenglocken. Dieselbe Ruege steht schon im Bericht der Welle 4 (*"eine
  moderne Autohupe bei 0:03 und 0:26"*, 1600); sie ist damals der Probe
  `karren` angelastet worden und stand in Wahrheit auch hier.

---

## 2 — WAS ICH GEBAUT HABE

### 2.1 Der ruhende Hof (`kern/ton.js`) — Kern der Auflage 1

Drei Dauerschichten statt zwei:

| Schicht | Datei | laeuft |
|---|---|---|
| **GRUND** | `grund.mp3`, **in allen vier Epochen dieselbe** | immer |
| **BETT** | `bett1..4.mp3`, Musik der Epoche | nur waehrend gearbeitet wird |
| **HOF** | `hof1..4.mp3`, Arbeitsgeraeusch der Epoche | nur waehrend gearbeitet wird |

`belebe()` holt Bett und Hof bei jedem Vorgang binnen 0,7 s herauf und haelt
sie 3,2 s; danach sinken sie in 2,6 s auf **null**. Im Spiel faellt alle ein
bis zwei Sekunden ein Zug — wer spielt, hoert alles wie bisher. Wer nichts
tut, hoert nach gut sechs Sekunden nur noch Wind.

**Ein Hof, in dem niemand arbeitet, klingt in jedem Jahrhundert gleich. Die
Zeit hoert man erst, wenn jemand etwas tut.**

`LEBEN_TIEF` steht auf **0** und nicht auf 0,05, und das ist gemessen: mit
0,05 — 26 dB unter dem Grund, im Pegelverlauf nicht mehr zu finden — hat das
fremde Ohr die stille Aufnahme von 1350 immer noch mit Sicherheit 90 richtig
genannt, begruendet mit *"das Spiel einer einfachen Holzfloete"*. Eine Melodie
ist noch weit unter dem Rauschen eine Melodie.

Zwei Zahlen gehen dabei in die **andere** Richtung, und das ist Absicht: das
Bett steht jetzt **lauter** als in Welle 4 (`ZIEL.bett` 0,038 → 0,048) und
duckt sich nicht mehr beliebig tief (`BETT_BODEN` 0,60). Solange das Bett auch
ohne Zutun lief, war jedes Dezibel davon ein Dezibel gegen die Latte; jetzt
laeuft es nur bei Arbeit, und dort soll man es hoeren. Die Zaesur des
Michaelitags kennt den Boden nicht — sie darf weiter alles anhalten.

`grund.mp3` ist im zweiten Anlauf entstanden: der erste enthielt ein
klapperndes Fensterbrett und kam als *"das deutliche, schnelle Tippgeraeusch
einer SCHREIBMASCHINE, Epoche 4, sicher 85"* zurueck. Eine neutrale Schicht,
die nach 1970 klingt, ist keine neutrale Schicht.

### 2.2 Neun Proben neu erzeugt, jede einzeln nachgeprueft

`werkbank/schuss/klang-w5-nach/erzeuge.py` — jede Zeile traegt den Satz des
Ohres, der die alte Probe verurteilt hat. Jede neue Probe ist **vor** dem
Einbau wieder einzeln vorgelegt worden:

| Probe | jetzt gehoert als |
|---|---|
| `abfahrt2` (1600, und mit `tempo` 0,80 auch 1350) | *"Pferdehufe auf Kopfsteinpflaster · Klappern einer Holzkutsche"* |
| `abfahrt3` (1884) | *"Metallisches Schaben und Gleiten · Rasseln einer Metallmechanik"* — das gepfiffene Lied ist weg |
| `abfahrt4` (1970) | *"Motorleerlauf · aufheulender Motor · Auspuff"* — das Zischen ist weg |
| `sud1` (1350) | *"knisterndes Feuer · brennendes Holz"* |
| `sud3` (1884) | *"zischender Hochdruckdampf · Ventilhebel"* — die Spruehdose ist weg |
| `werksglocke` (1970) | *"Schulglocke · elektrische Metallklingel"* |
| `glocke` (1350/1600) | *"Glockenlaeuten · Nachhall, 14. Jahrhundert"* |
| `schicht` (neu, 1884) | *"Glockenschlag mit Nachhall"* |
| `ochse` (neu, 1350) | *"Kuhbloeken, zeitlos"* |
| `grund` (neu, alle vier) | *"Windrauschen · sanftes Luftstroemungsgeraeusch, zeitlos"* |

**Zwei Proben habe ich NICHT hinbekommen, und das steht hier, weil es die
Wahrheit ist.** Sieben Versuche auf eine Ochsenfuhre haben fuenfmal Wasser,
einmal einen Wuerfelbecher und einmal eine Tuerklinke geliefert; vier Versuche
auf ein rollendes Stahlfass einen bellenden Hund, ein Klopfen auf Holz und
zweimal eine Triangel. `abfahrt1.mp3` und `fassstahl.mp3` sind **geloescht**:

* Der Ochse faehrt jetzt mit der geprueften Pferdefuhre ab, um ein Fuenftel
  verlangsamt (`tempo`), und **davor steht das Tier**: `ochse.mp3` als
  zweiter Klang desselben Vorgangs (`dazu`). Nachgeprueft, dass das Dehnen
  selbst nichts kaputt macht: die um 20 % verlangsamte Probe einzeln
  vorgelegt bleibt *"Pferdehufe · Kutschenraeder · Pferdegeschirr"*.
* Das Fass rollt in allen vier Epochen als `fassholz` — einzeln vorgelegt
  *"hoelzernes Poltern und Knarren, zeitlos"*. Das sagt weniger als ein
  Stahlfass, aber es sagt nichts Falsches; die Zeit sagt in 1970 der Lastzug.

Nach beiden Loeschungen und drei Neuzugaengen: **47 Proben, keine fehlt, keine
ist tot** (`werkbank/schuss/klang-w5-nach/dateien.mjs` — im laufenden Spiel
gemessen, in beide Richtungen, alle vier Epochen).

### 2.3 Vier kleinere Eingriffe, jeder aus einer Messung

* **Stapelgrenze** (Auflage 3, unten).
* **`mindest`** — eine Lautheits-UNTERgrenze je Katalogeintrag. Hebt zu leise
  Proben an und senkt laute nie. Haengt an Auflage 5.
* **`laut`, `laenge`, `tempo` duerfen Funktionen der Epoche sein** — wie
  `datei` es schon war.
* **Die Wand des Nachbarhofs ist trockener**: Verzoegerung 0,190 → 0,135 s,
  Rueckfuehrung 0,32 → 0,18. 190 ms mit 32 % Rueckfuehrung sind ein
  Resonator, und durch einen Tiefpass gejagt macht er aus dem rhythmischen
  Saegen des Nachbarn ein gleichmaessiges Brummen.
* **`bett:epocheN` faellt nicht mehr in den Notfallkasten.** `T.bett()` ruft
  einen Namen, den der Katalog nicht kennt; heute faellt das nur deshalb nicht
  auf, weil der Ruf kommt, bevor der Browser den Ton freigibt. Ein
  Epochenwechsel im laufenden Spiel haette ihn als geratenen Ruf gebucht und
  als Papierrascheln gespielt.

---

## 3 — AUFLAGE 1: BEIDE ZAHLEN, WIE VERLANGT

OFFEN — Endmessung laeuft.

---

## 4 — AUFLAGE 3: KEIN KAMMFILTER

**Abgenommen.**

Die Grenze sitzt in `kern/ton.js` (`entstapele()`), nicht in `fuhre.js`: sie
gehoert in den Bus, der die Kopien wirklich erzeugt, und sie gilt fuer **jede**
Probe. Der Schluessel ist die **Datei** und nicht der Name — `gegner:bauen`,
`gegner:aufstocken` und `stadt:bau` sind drei Namen und eine Probe.
Eine dritte Kopie wird **gestundet**, nicht verworfen: sie rueckt nach hinten,
bis sie Platz hat (mindestens 0,22 s Abstand, hoechstens zwei je halbem
Sekundenfenster). Aus zwoelf Faessern in einer halben Sekunde wird eine Reihe
von Faessern. Wer weiter als 1,10 s geschoben werden muesste, faellt aus.

**Am Mitschnitt gemessen** — Selbstaehnlichkeit (Autokorrelation) der
Wellenform im Fenster 2,0–3,2 s, dort wo `fuhre:fuellen` steht
(`werkbank/schuss/klang-w5-nach/kamm.py`):

| Epoche | vorher | nachher |
|---|---|---|
| 1 (1350) | **0,506 bei 40,4 ms** | 0,396 bei 18,0 ms |
| 2 (1600) | 0,336 bei 30,0 ms | 0,252 bei 10,0 ms |
| 3 (1884) | 0,378 bei 29,0 ms | 0,251 bei 18,0 ms |
| 4 (1970) | 0,459 bei 185,6 ms | 0,322 bei 250,5 ms |

Die Spitze bei **40 ms** — dem Versatz, mit dem `fuelleNachDurst()` seine
Kopien legt — ist verschwunden. Was uebrig bleibt, steht bei 10–18 ms und ist
die gewoehnliche Kurzzeitaehnlichkeit jeder Wellenform.

**Im lebenden Spiel nachgezaehlt** (`ton.dichte()`, zwoelf Rufe binnen 0,46 s,
genau die Schleife aus `fuhre.js`):

| Epoche | hoechste Zahl gleichzeitig angesetzter Kopien je Probe | gestundet | ausgefallen |
|---|---|---|---|
| 1 | `fassholz` **2** | 8 | 3 |
| 2 | `sud2` 2 · `fassholz` **2** | 9 | 3 |
| 3 | `fassholz` **2** | 8 | 3 |
| 4 | `sud4` 2 · `fassholz` **2** | 9 | 3 |

Nirgends mehr als zwei. `geraten()` leer, `lage` 0 in allen vier Epochen.

---

## 5 — AUFLAGE 5: DER WOCHENKNOPF VON 1350

**Abgenommen.**

Erst die Ursache, gemessen statt vermutet: `woche1.mp3` ist die **leiseste
Probe des Hauses**. Effektivwert 0,0373 gegen 0,0950 (`woche2`), 0,2040
(`woche4`), 0,2443 (`fabrikpfeife`). In 25-ms-Fenstern traegt ihr erster
Schlag 0,146 gegen 0,406 bei `woche2`. Die Probe selbst ist richtig — einzeln
vorgelegt *"drei trockene Klack-Geraeusche, 14. Jahrhundert"* —, sie war
schlicht zu leise abgemischt. `mindest: 0.095` hebt sie um das 2,55-fache;
`duck: 0.30` laesst den Hof dafuer kurz zuruecktreten.

Einzelschlaege, 14 s mit genau einem Klick, gemessen mit dem
`antwortzeit.py` des Kritikers, unveraendert (beide Schwellen: sein Werkzeug
rechnet mit dem Doppelten des Ruhemedians, sein Bericht nennt das Dreifache):

| Aufnahme | Zug | vorher 2× | vorher 3× | **nachher 2×** | **nachher 3×** |
|---|---|---|---|---|---|
| e1-weiter | `weiter` | 0,100 | **0,925** | 0,060 | **0,060** |
| e2-weiter | `weiter` | 0,080 | 0,080 | −0,005 | −0,005 |
| e3-weiter | `weiter` | 0,045 | 0,070 | −0,010 | 0,015 |
| e4-weiter | `weiter` | 0,130 | 0,130 | 0,060 | 0,110 |
| e1-abfahrt | `fuhre:abschicken` | 0,055 | 0,105 | −0,020 | 0,030 |
| e2-abfahrt | `fuhre:abschicken` | 0,075 | 0,100 | −0,010 | 0,090 |
| e3-abfahrt | `fuhre:abschicken` | 0,070 | 0,070 | 0,075 | 0,075 |
| e4-abfahrt | `fuhre:abschicken` | 0,080 | 0,080 | 0,020 | 0,020 |

Der Ausreisser von 0,925 s ist auf **0,060 s** gefallen, der Hub gegen die
Ruhe von 5,7× auf 17,3× — der Wochenknopf von 1350 ist jetzt der
**deutlichste** der acht Einzelschlaege. Alle acht liegen unter 0,3 s.
(Negative Werte heissen: der Einsatz faellt in dasselbe 25-ms-Fenster wie der
Klick, dessen Zeit nur auf 10 ms genau steht.)

---

## 6 — AUFLAGE 2 und AUFLAGE 4

OFFEN — Messungen laufen.
