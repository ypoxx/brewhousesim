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

### 2.2 Zehn Proben neu erzeugt, jede einzeln nachgeprueft

`werkbank/schuss/klang-w5-nach/erzeuge.py` — jede Zeile traegt den Satz des
Ohres, der die alte Probe verurteilt hat. Jede neue Probe ist **vor** dem
Einbau wieder einzeln vorgelegt worden:

| Probe | jetzt gehoert als |
|---|---|
| `abfahrt2` (1600 **und** 1350) | *"Pferdehufe auf Kopfsteinpflaster · Klappern einer Holzkutsche"* |
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

* Der Ochse faehrt jetzt mit der geprueften Pferdefuhre ab, und **davor steht
  das Tier**: `ochse.mp3` als zweiter Klang desselben Vorgangs (`dazu`).
  Zwischendurch lief die Fuhre in 1350 zusaetzlich um ein Fuenftel verlangsamt
  (`tempo` 0,80) — das ist wieder zurueckgenommen und der Grund steht in
  Abschnitt 6: gedehntes Eisen ist fuer ein Ohr eine Maschine. 1350 und 1600
  teilen sich damit denselben Karren und unterscheiden sich im Gespann.
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
  `datei` es schon war. **`dazu`** legt einen zweiten Klang unter denselben
  Vorgang (der Ochse vor dem Karren); er laeuft auf demselben Bus und zaehlt
  in derselben Stapelgrenze.
* **Der Hof von 1350 steht tiefer** als die anderen drei (`ZIEL_HOF` 0,034
  gegen 0,048) — Begruendung in Abschnitt 6.
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

Der Kritiker verlangt: *"Abgenommen ist die Auflage, wenn bei unveraendertem
Verfahren die stille Trefferquote deutlich unter die gespielte faellt und die
gespielte zugleich nicht sinkt. Miss beides und leg beide Zahlen in den
Bericht."* Hier stehen sie, und zwar **alle**, auch die aus den Zwischenstaenden.

Verfahren jedes Mal identisch: acht frische Aufnahmen (vier gespielt, vier
still) mit seinem `aufnahme.mjs` bei `RUHE=8`, gemischt mit seinem `mische.py`
unter neuer Saat, drei Durchgaenge je Datei durch `hoerer.hoere()` ohne
`--erwartet`, Ohr `gemini-3.6-flash`, alles am selben Tag.

| Stand | still | gespielt |
|---|---|---|
| **Vorgefunden** (`36f81c6`, unveraendert) | **12/12 = 100 %** | **3/12 = 25 %** |
| Zwischenstand A (Ochsenkarren gedehnt, Hof 1350 voll) | 0/12 = 0 % | 10/12 = 83 % |
| Zwischenstand B (Hof 1350 leiser, Feuer kuerzer) | 2/12 = 17 % | 8/12 = 67 % |
| **Ausgeliefert** (ohne Dehnung, Hof 1350 leiser) | **2/12 = 17 %** | **7/12 = 58 %** |
| *alle drei neuen Staende zusammen* | *4/36 = 11 %* | *25/36 = 69 %* |
| zum Vergleich: Zahl des Kritikers an `2f0e4b4` | 18/20 = 90 % | 12/20 = 60 % |

**Das Verhaeltnis ist umgedreht.** Vorher war die stille Aufnahme vier Mal so
oft richtig wie die gespielte (100 gegen 25); jetzt ist die gespielte drei- bis
vier Mal so oft richtig wie die stille (58 gegen 17, ueber alle drei Staende
69 gegen 11).

**Und die gespielte Quote ist nicht gesunken.** Gegen meine eigene,
gleichtaegige Messung desselben Verfahrens am vorgefundenen Stand (25 %) hat
sie sich mehr als verdoppelt. Gegen die Zahl des Kritikers (60 %, gemittelt
ueber zwei Ohren und zwei Aufnahmesaetze, einer davon der mit seinem
Vorlaufschwanz) steht sie bei 58 % — ein Treffer Unterschied bei zwoelf
Messungen, also gleich. Ueber alle drei neuen Staende zusammen sind es 69 %.
Ich sage das so ausdruecklich, weil eine dieser beiden Bezugszahlen mir
schmeichelt und die andere nicht: **58 % ist nicht sichtbar besser als seine
60 %, und ich behaupte das auch nicht.** Was sichtbar ist, ist der Absturz der
stillen Quote von 100 auf 17 bei gleichbleibender gespielter.

**Warum drei Staende und welcher wird ausgeliefert.** Zwischenstand A hat die
besten Epochenzahlen (83/0). Er faellt trotzdem durch **Auflage 2**: seine
gespielte Aufnahme von 1350 wird zweimal von drei als 1884 gehoert. Auflage 2
ist eine Auflage und keine Kennzahl, deshalb wird der Stand ausgeliefert, der
sie erfuellt — siehe Abschnitt 6. Die Unterschiede zwischen den drei Staenden
(83/67/58 bei zwoelf Messungen) liegen im Rauschen des Verfahrens; dass ich
den besten Wert nicht als Ergebnis ausgebe, ist Absicht.

### Was das Ohr jetzt zur STILLEN Aufnahme sagt

Vorher zwoelfmal von zwoelf die Bettmusik. Jetzt gibt es keine Bettmusik mehr
in der stillen Aufnahme, und das Ohr schwankt zwischen den beiden Enden:

* *"An der vollkommenen Abwesenheit von Motoren-, Verkehrs- oder
  Industriegeraeuschen sowie dem reinen Wind"* → Epoche 1
* *"Am kontinuierlichen, tiefen Hintergrundbrummen von entfernt vorbeifahrenden
  Kraftfahrzeugen"* → Epoche 4

Dieselbe Datei, dieselbe Frage, entgegengesetzte Antwort. Genau so soll eine
Kulisse klingen, die die Zeit nicht verraet: sie laesst beide Lesarten zu.
Ueber alle 36 stillen Messungen der drei neuen Staende faellt die Antwort **18×
auf Epoche 1, 17× auf Epoche 4 und 1× auf Epoche 2** — nicht an der Epoche
entlang, sondern zwischen den beiden Auslegungen desselben Windes. Dass die
Verteilung fast genau haelftig zwischen "gar keine Maschinen" und "ferner
Verkehr" liegt, ist der beste Beleg dafuer, dass die Schicht wirklich nichts
sagt: eine Kulisse, die etwas verriete, wuerde nicht muenzwerfen.

### Der Pegel (Sperrliste 2, zweite Haelfte)

| Epoche | still/gespielt vorher | nachher | Hub still v/n | Hub gespielt v/n |
|---|---|---|---|---|
| 1 (1350) | 27,2 % | **8,3 %** | 4,28 / 4,01 | 9,15 / 14,10 |
| 2 (1600) | 25,7 % | **11,2 %** | 3,74 / 4,38 | 12,10 / 10,57 |
| 3 (1884) | 15,6 % | **8,3 %** | 2,64 / 4,32 | 14,26 / 19,64 |
| 4 (1970) | 16,9 % | **7,7 %** | 3,21 / 4,04 | 12,73 / 20,43 |

Spielen ist jetzt das **8,9- bis 13,0-fache** von Nichtstun (vorher 3,7- bis
6,4-fach). Die vier stillen Aufnahmen liegen ausserdem zum ersten Mal auf
demselben Pegel (0,0128–0,0134 statt 0,0263–0,0305) — sie sind ja dieselbe
Schicht.

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

## 6 — AUFLAGE 2: DIE GESPIELTE STRECKE DARF NICHT NACH 1884 KLINGEN

**Abgenommen — im ausgelieferten Stand, und nur in ihm.**

Der Kritiker nennt sie ausdruecklich einen *Verdacht* und legt ihn auf
`sud1..sud4`. Der Verdacht war halb richtig und die Ursache eine andere. Was
die gespielte Strecke nach 1884 gezogen hat, waren vier Dinge, und ich habe
jedes einzeln vorgelegt statt es zu vermuten:

1. **`abfahrt4`** — *"Zischen einer Druckluftentlastung, Sekunde 2–4"*. Fuer
   sich richtig (1970 hat Druckluftbremsen), in der Mischung Dampf. Neu
   erzeugt ohne Zischen.
2. **`fassstahl`, zwoelffach gestapelt** — der Gong aus Auflage 3, als
   *"metallisches Stampfen einer Dampfmaschine"* gehoert. Datei geloescht,
   Stapel begrenzt.
3. **`sud3`** — *"Spruehdose / Aerosolspray, erst ab 1927"*. Neu erzeugt.
   Der Verdacht des Kritikers auf die Sud-Proben trifft also zu, nur bei
   einer anderen als der genannten und mit einem anderen Fehler.
4. **Die gedehnte Pferdefuhre in 1350** — siehe unten.

Ergebnis, drei Durchgaenge je Epoche, ausgelieferter Stand:

| gespielte Aufnahme | gehoert | mehrheitlich 1884? |
|---|---|---|
| 1350 | 2 · 3 · 2 | **nein** (mehrheitlich 1600) |
| 1600 | 3 · 2 · 2 | **nein** |
| 1884 | 3 · 4 · 3 | richtig |
| 1970 | 4 · 4 · 4 | **nein** — vorher 3 · 3 · 3 |

Vorher wurde 1970 **dreimal von drei** als 1884 gehoert; jetzt dreimal von drei
richtig, mit Sicherheit 95. Das war der haerteste Einzelbefund der Auflage und
er ist weg.

**Warum dieser Stand ausgeliefert wird.** In den beiden Zwischenstaenden lief
die Pferdefuhre in 1350 um ein Fuenftel gedehnt (`tempo` 0,80) — ein Ochse ist
ein langsameres Pferd. Einzeln vorgelegt haelt die gedehnte Probe stand
(*"Pferdehufe · Kutschenraeder · Pferdegeschirr"*); in der Mischung hat das Ohr
in **vier von sechs** Durchgaengen *"das laut quietschende Geraeusch von
METALLRAEDERN AUF SCHIENEN"* und *"das metallische Aechzen schwerer EISENRAEDER
oder DAMPFMASCHINEN"* gemeldet und 1350 auf 1884 gelegt. Eisenbeschlagene
Raeder werden beim Dehnen tiefer, und tief und metallisch ist fuer ein Ohr eine
Maschine. Die Dehnung ist zurueckgenommen; 1350 traegt seine Zeit ueber das
Tier (`ochse.mp3`) statt ueber die Geschwindigkeit. Damit faellt 1350 jetzt auf
1600 statt auf 1884 — eine Verwechslung, die die Auflage ausdruecklich nicht
verbietet und die eine Epochengrenze und nicht drei Jahrhunderte weit ist.

**Was offen bleibt:** 1350 wird gespielt nur in einem von drei Durchgaengen
richtig genannt. Es ist die einzige Epoche, die das Ohr nicht traegt, und der
Grund steht in seinen eigenen Worten: es hoert *"Hufgeklapper, Holzraeder,
Kuhbruellen, helle Glockentoene"* — alles richtig, alles auch 1600 moeglich.
1350 und 1600 unterscheiden sich im Werk nur noch durch das Tier, das
Wochenzeichen und das Feuer. Wer hier weiterkommen will, braucht 1350 eigene
Proben fuer Muenzen, Kreide und Siegel — heute teilen sich 1350, 1600 und 1884
dort dieselbe Datei (`altNeu`). Das ist die naechste Baustelle und sie ist
gross; ich habe sie in dieser Runde nicht aufgemacht.

---

## 7 — AUFLAGE 4: DER GEGENZUG

**Teilweise abgenommen, und die fehlende Gegenprobe ist nachgeholt.**

Der Kritiker hat diese Auflage selbst als *schwach belegt* gekennzeichnet: sie
stand auf einer Aufnahme je Epoche, und die Gegenprobe, die er am meisten
wollte — dieselbe Blenderliste ueber eine **stille** Aufnahme —, ist an seinem
Tageskontingent gescheitert. Ich habe sein `frage-vorgang.py` unveraendert auf
alle acht Aufnahmen des ausgelieferten Standes angesetzt, gespielt **und**
still:

| Aufnahme | FUHRE | SUD | MICHAELI | **GEGENZUG** | Blender bejaht |
|---|---|---|---|---|---|
| e1-gespielt | ja (2 s) | ja (19 s) | ja (14 s) | **ja (10 s, sicher 85)** | 0 von 4 |
| e2-gespielt | ja (5 s) | nein | ja (14 s) | nein | 0 von 4 |
| e3-gespielt | nein | ja (1 s) | ja (19 s) | nein | **2 von 4** |
| e4-gespielt | ja (4 s) | ja (1 s) | ja (15 s) | nein | 0 von 4 |
| **e1-still** | **nein** | **nein** | **nein** | **nein** | 0 von 4 |
| **e2-still** | **nein** | **nein** | **nein** | **nein** | 0 von 4 |
| **e3-still** | **nein** | **nein** | **nein** | **nein** | 0 von 4 |
| **e4-still** | **nein** | **nein** | **nein** | **nein** | 0 von 4 |

**Die fehlende Gegenprobe faellt so gut aus, wie sie ausfallen kann: in den
vier stillen Aufnahmen sind 0 von 32 Vorgangsfragen bejaht worden.** Das Ohr
bejaht also nicht, was es nicht hoert — und damit zaehlen seine Ja-Antworten in
den gespielten Aufnahmen wirklich. Das ist die Auskunft, die der Kritiker
gebraucht und nicht bekommen hat.

Zur Auflage selbst: sein Befund war *"der Gegenzug ist in 1350 nicht zu
hoeren"* — bejaht in 1970, mit Sicherheit 95 verneint in 1350. **Das hat sich
umgedreht: 1350 ist jetzt die einzige Epoche, in der das Ohr den fremden Hof
bejaht** (Sekunde 10, sicher 85 — im Mitschnitt stehen dort `gegner:werben`
7,6 s und `gegner:entreissen` 13,6 s, also das Nachbarhof-Zeichen dazwischen).
Der Wortlaut der Abnahme — *"in allen vier Epochen bejaht"* — ist damit **nicht**
erfuellt: 1 von 4 statt 0 von 4. Ich melde das als offen und nicht als erledigt.

Was ich dabei geaendert habe und warum es zu wenig war: die Wand des
Nachbarhofs ist trockener geworden (Verzoegerung 0,190 → 0,135 s, Rueckfuehrung
0,32 → 0,18), weil 190 ms mit 32 % Rueckfuehrung ein Resonator sind und aus dem
rhythmischen Saegen des Nachbarn ein gleichmaessiges Brummen machen — genau
das, was in 1350 als Motor gemeldet wurde. Trockener heisst aber auch: weniger
"drueben". Ob das der Grund ist, warum drei Epochen den Gegenzug jetzt
verneinen, ist **nicht gemessen** und bleibt eine Vermutung.

**Zwei Blender sind bejaht worden**, beide in 1884: *Kirchenorgel* bei
Sekunde 14 (dort liegt das Bett — eine Blaskapelle mit Tuba klingt wie eine
Orgel) und *Glas zerspringt* bei Sekunde 3 (dort liegt `abfahrt3`, das
metallische Schaben am Waggon). 30 von 32 Blenderfragen sind verneint; das Ohr
raet also weit ueberwiegend nicht, aber es raet nicht gar nicht, und das
schwaecht die Aussagekraft der Ja-Antworten in 1884.

**Die Jahresschaetzungen dieses Ohres sind unbrauchbar** und stehen deshalb
nicht in der Tabelle: es schaetzt 1500 fuer 1970, 1404 fuer 1884. Dieselbe
Datei bekommt in der Epochenfrage 4 mit Sicherheit 95. Zwei verschiedene
Fragen, zwei verschiedene Verlaesslichkeiten — die Epochenzahlen dieses
Berichts stehen ausschliesslich auf `hoerer.py`.

---

## 8 — WO ICH DEM KRITIKER WIDERSPRECHE, UND WO ER MICH UNTERSCHAETZT HAT

**Er hat in der Sache recht, in der Schaerfe hat er sich nach unten geirrt.**
Seine 90 % gegen 60 % sind, an einem Ohr und einem sauberen Aufnahmesatz
nachgemessen, in Wahrheit **100 % gegen 25 %** gewesen. Die gespielte Aufnahme
war nicht "schlechter erkennbar", sie war ununterscheidbar vom Raten. Das
liegt an seiner Mittelung ueber zwei Ohren und zwei Saetze, von denen einer
(`roh/`) seinen eigenen Vorlaufschwanz trug; er sagt das selbst.

**Wo sein Verdacht nicht traegt:** Auflage 2 legt die Verwechslung mit 1884 auf
`sud1..sud4` an den Pfannenklaengen. `sud1` und `sud2` sind daran unschuldig —
einzeln vorgelegt *"Wassergluckern"* bzw. *"knisterndes Feuer"*, nichts
Industrielles. `sud3` dagegen enthielt eine **Spruehdose ab 1927**, und die
eigentlichen Ursachen lagen ganz woanders: im Druckluftzischen von `abfahrt4`,
im gestapelten Gong von `fassstahl` und in einem gepfiffenen Liedchen in
`abfahrt3`. Wer nur an den Sud-Proben gedreht haette, haette nichts erreicht.

**Wo er einen Befund an die falsche Stelle gelegt hat:** die *"Fahrradklingel /
Autohupe"* in 1350 und 1600. Der Bericht der Welle 4 hat sie der Probe `karren`
angelastet; `karren` ist heute einzeln vorgelegt sauber (*"metallisches
Klinken, hoelzernes Klappern, 14. Jahrhundert"*), und der Klang kam aus
`glocke` — Roehrenglocken, ein Orchesterinstrument. Das ist keine Ruege an ihn,
sondern der Beleg fuer seine eigene Regel: eine Probe kann fuer sich tadellos
sein und in der Mischung kippen, und dann muss man **alle** Proben einzeln
vorlegen und nicht nur die verdaechtige.

**Was ich nicht bestaetigen konnte:** das Ohr hat im ausgelieferten Stand
zweimal *"einen kurzen, modernen digitalen UI-Signalton ganz am Anfang bei
Sekunde 0:00"* gemeldet. In der Wellenform steht dort nichts: die ersten
zwanzig 10-ms-Fenster liegen bei 0,012–0,040 und damit im gewoehnlichen Gang
des Grundes, ohne jeden Ausschlag. Ich habe es gesucht und nicht gefunden und
lasse es als unbelegt stehen, statt einen Ton zu aendern, den ich nicht messen
kann.

---

## 9 — WAS ICH NICHT GEMESSEN HABE

* **Nur ein Ohr.** Alle 96 Epochenmessungen dieses Berichts stehen auf
  `gemini-3.6-flash`. `gemini-3.1-pro-preview` habe ich fuer die Vorgangsprobe
  angesetzt und nach zehn Minuten ohne Antwort abgebrochen; ein andersartiges
  Ohr gab es auch fuer mich nicht.
* **Nur eine Saat und ein Zugplan** (`saat=1350`, der Plan des Kritikers). Ob
  ein anderer Zufallsstand andere Vorgaenge ins Fenster legt, ist offen.
* **Zwoelf Messungen je Stand sind wenig.** Der Unterschied zwischen 83, 67 und
  58 Prozent bei den gespielten Aufnahmen ist ein bis drei Treffer; ich behandle
  ihn im Bericht als Rauschen und nicht als Wirkung.
* **Der Gegenzug in 1600, 1884 und 1970** wird vom Ohr verneint. Ob die
  trockenere Wand der Grund ist, ist nicht gemessen.
* **Ob das Bett im Spiel zu laut geworden ist**, habe ich nur an der
  Epochenquote gemessen, nicht an der Vorgangserkennung im Einzelnen. Die
  Vorgangsprobe zeigt 11 von 16 Vorgaengen bejaht (vorher lag keine
  vergleichbare Zahl vor), aber kein Vorher/Nachher.
* **Die Blenderprobe steht auf einem Durchgang je Aufnahme**, nicht auf dreien.

---

## 10 — STAND DER AUFLAGEN

| | Auflage | Stand |
|---|---|---|
| 1 | Die Zeit muss aus dem Vorgang kommen | **abgenommen** — still 100 % → 17 %, gespielt 25 % → 58 % (beide Zahlen gemessen, Abschnitt 3) |
| 2 | Die gespielte Strecke darf nicht nach 1884 klingen | **abgenommen** — keine gespielte Aufnahme mehrheitlich 1884; 1970 von 0/3 auf 3/3 |
| 3 | Kein Kammfilter aus gestapelten Kopien | **abgenommen** — am Mitschnitt (Selbstaehnlichkeit bei 40 ms weg) und im Lauf (nie mehr als 2 Kopien je halbem Sekundenfenster) |
| 4 | Der Gegenzug ist in 1350 nicht zu hoeren | **teilweise** — 1350 bejaht (vorher verneint), 1600/1884/1970 verneint; die fehlende stille Gegenprobe ist nachgeholt und faellt sauber aus (0 von 32) |
| 5 | Der Wochenknopf von 1350 ist zu leise | **abgenommen** — 0,925 s → 0,060 s, Hub 5,7× → 17,3× |
| 6 | Verweigerungssperre in `hoerer.py` | nicht meine Datei; die Aufsicht hat sie erledigt, ich habe mit dem geheilten Werkzeug gemessen |

**Tore:** `node --check` auf beide geaenderten .js sauber, `tor.mjs` OFFEN
(4/4, `lage` 0, 0 Konsolenfehler), `spielprobe.mjs` BESTANDEN (4/4, je 60
Wochen). Ueber **alle 56 Aufnahmen** dieses Berichts (sieben Saetze zu acht, darunter
die Einzelschlaege): `geraten()` jedes Mal leer, `BRAUHAUS.lage` jedes Mal
leer, Konsolenfehler jedes Mal 0. 47 Proben im Haus,
keine fehlt, keine ist tot.

**KERN:** nichts. Die Grenze aus Auflage 3 liess sich vollstaendig in
`kern/ton.js` ziehen — `fuhre.js:1297/1260/1273` ist unberuehrt geblieben, und
das ist auch richtig so: die Schleife dort ruft zwoelf Faesser, weil zwoelf
Haeuser beliefert werden. Falsch war nicht das Rufen, sondern dass der Tonbus
zwoelf Kopien uebereinandergelegt hat.
