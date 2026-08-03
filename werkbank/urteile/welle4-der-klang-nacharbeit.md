# DER KLANG — Nacharbeit zur Auflage (Welle 4, Runde 3)

Der tragende Befund des Kritikers wird **nicht bestritten, sondern bestätigt**: die
Epoche wurde vom Klangbett getragen, nicht vom Vorgang. Seine Gegenprobe (94 / 97 /
59 / 75 % des Pegels bei stiller Hand) und die unabhängige Nachmessung der Aufsicht
(102 / 105 / 100 / 101 %) zeigen dasselbe. Mein eigener Bericht der Vorrunde hat
daraus „4 von 4 richtig" gemacht und nie gefragt, **woher** das Richtige kam. Das
war der Fehler, und er ist größer als jeder einzelne Klang.

Alle Zahlen unten stammen aus eigenen Läufen mit **seinen** Skripten
(`aufnehmen.mjs`, `aufnehmen-still.mjs`, `antwortet.mjs`, `hoere-nach.mjs`,
`ohr-zwei.py`, `werkbank/hoerer.py`), am lebenden `BRAUHAUS.ton.ausgang()`.
Belege: `werkbank/schuss/klang-nacharbeit/`.

---

## DIE GEGENPROBE, um die es geht

Dreißig Sekunden gespielt gegen dreißig Sekunden mit stiller Hand, je Epoche,
`mitschnitt()` im stillen Lauf leer.

| | E1 · 1350 | E2 · 1600 | E3 · 1884 | E4 · 1970 |
|---|---|---|---|---|
| rms still | 0,03297 | 0,03501 | 0,02590 | 0,02650 |
| rms gespielt | 0,10759 | 0,10341 | 0,17005 | 0,14286 |
| **Anteil des stillen Laufs** | **31 %** | **34 %** | **15 %** | **19 %** |
| vorher (Kritiker) | 94 % | 97 % | 59 % | 75 % |

**Der gespielte Lauf liegt jetzt beim Drei- bis Siebenfachen des ungespielten.**
Nichtstun klingt nicht mehr wie Spielen. Erreicht durch drei Eingriffe, nicht durch
einen: Bett und Hof auf gut die Hälfte (`ZIEL` 0,055/0,075 → 0,038/0,048), das Werk
auf knapp das Doppelte (`PEGEL.werk` 0,42 → 0,80), und — der wirksamste Teil —
**jede Werkprobe wird auf 2,6 s geschnitten** statt fünf bis acht Sekunden voll
auszulaufen. Im Spiel fällt alle halbe Sekunde ein Klick; vorher lagen an jeder
Stelle ein Dutzend Klänge übereinander, und der Hof war auch beim Spielen eine Wand.

Und das Bett trägt die Epoche trotzdem noch: das blinde Ohr nennt sie weiter
**4 von 4** richtig (siehe unten). Die Kulisse war nicht zu entfernen, sondern in
das richtige Verhältnis zu setzen.

---

## Die Auflagen, einzeln

### 1 — Gegenzug hörbar machen · **teilweise erfüllt, Abnahme NICHT erreicht**

Abnahme verlangt: `gegner` JA in ≥ 3/4 Aufnahmen **und** Sekunde auf ±2 s,
Blenderrate ≤ 1/16.

Was getan wurde: der Gegenzug hat einen eigenen **Ort** statt eines eigenen Namens.

* Alles, was der Nachbar tut, geht durch `fern` (Tiefpass 2000 Hz + kurzer
  Nachschlag) auf einen **eigenen Bus** `fremd`, nicht mehr durch `werk`.
* Jeder wirkliche Gegenzug (`nachbar: true`, 15 Einträge) zieht das
  **Nachbarhof-Zeichen** nach sich: 3,2 s gedämpftes Bauen hinter einer Wand
  (1050→1800 Hz, Nachschlag 0,19 s), unter dem Bett auf 0,28, Hof auf 0,34 und
  **das eigene Werk auf 0,42** zurücktreten. Sperre 4,5 s, damit es beim schnellen
  Weiterklicken kein Dauerläufer wird.
* Das **eigene** Bauen tritt zurück: `stadt:bau` 0,85 → 0,55, `sud:bau` 0,8 → 0,5
  und auf 1,8 s geschnitten.

Am Pegel ist der Gegenzug damit **der lauteste Einzelausschlag der halben Minute**,
exakt an seiner Sekunde. E1, 250-ms-Fenster um Sekunde 26 (dort steht
`gegner:werben`): 0,192 · 0,277 · 0,261 · 0,221 gegen einen Median von 0,03–0,09 in
den zehn Sekunden davor.

**Das fremde Ohr nennt ihn trotzdem nicht verlässlich an der richtigen Sekunde.**
Schlussmessung mit `ohr-zwei.py` auf den vier abgelegten Aufnahmen:

| | E1 | E2 | E3 | E4 |
|---|---|---|---|---|
| Wahrheit im Mitschnitt | 26,0 s | **keiner** | 26,0 s | 8,6 · 23,4 · 26,0 s |
| `gegner` | JA sek 26 (90) | JA sek 2 (90) | JA sek 0 (80) | nein |
| Urteil | **Treffer** | Falschtreffer | daneben | verfehlt |

**1 von 4 auf ±2 s.** Vorher: 0 von 4 JA überhaupt. Blenderrate in diesem Durchgang
**0 von 16**, über alle Durchgänge dieser Runde 2 von 96.

Was ich dabei gelernt und gemessen habe, weil es die nächste Runde spart — drei
Anläufe, jeder an einer Messung gescheitert:

1. **Zeichen = `bau1`/`bau4`.** 4/4 JA (vorher 0/4), aber dreimal die falsche
   Sekunde: in 1884 Sekunde 12, wo `sud:bau` steht. Das Ohr hörte „Geräusch einer
   Handsäge" und nannte das den Gegenzug — zu Recht, es war derselbe Klang.
2. **Zeichen = eigenes Tor** (`nachbar1`/`nachbar4`, neu erzeugt: quietschendes
   Scharnier, Zuschlagen, Riegel). Eindeutig, sonst quietscht in keiner Epoche
   etwas, und im Pegel der lauteste Ausschlag — und das Ohr meldete es zweimal als
   **`fuhre`** statt als `gegner`. Ein Tor mit einem Karren dahinter ist eine
   Abfahrt. Gefragt wird aber nach „Werben, Bauen, Zugreifen".
3. **Zeichen = Tor + Bauen dahinter.** In 1350 Treffer, in 1884 daneben.

Der Rest ist ehrlich zu benennen: **die Messung selbst streut stark.** Dieselbe
Aufnahme, zweimal vorgelegt, ergab in 1350 einmal Sekunde 26 und einmal Sekunde 13.
Über sechs Durchgänge dieser Runde: E1 zweimal Treffer, viermal daneben; E3 einmal
Treffer, viermal daneben; E4 zweimal Treffer, einmal verfehlt. Ich habe keinen
Durchgang unterschlagen.

Und zwei Dinge, die **nicht** am Klang liegen und die die Abnahme mitbestimmen:

* **In E2 gibt es in diesen dreißig Sekunden gar keinen Gegenzug** — der Kritiker
  hat das selbst festgehalten. Ein JA dort ist immer ein Falschtreffer, ein NEIN
  bringt keinen Punkt. Die erreichbare Obergrenze der Abnahme ist damit 3 von 4,
  nicht 4 von 4.
* In E1 und E3 ist der **einzige** Gegenzug der halben Minute bei Sekunde 26, vier
  Sekunden vor Schluss, gemeinsam mit fünf eigenen Klängen (`uhr:woche`,
  `sud:anstellen`, `sud:ausschlagen`, `sud:pfanne`, `name:verlust`). Das ist die
  Zugfolge des Aufnahmeskripts, nicht der Tonbus.

Vorschlag für die Abnahme, falls die Aufsicht sie schärfen will: `gegner` JA bei
unveränderter Blenderrate **plus** ein Pegelbeleg an der Sekunde des Mitschnitts.
Das erste misst den Klang, das zweite misst nicht die Tagesform des Modells.

### 2 — Epoche 4 entteppichen · **erfüllt**

| | E1 | E2 | E3 | **E4** |
|---|---|---|---|---|
| Bett-Schwankung, 8 s Nichtstun | ×8,33 | ×9,06 | ×3,58 | **×4,86** (vorher ×1,4) |
| Michaelitag, Hub | 2,38 | 2,08 | 2,36 | **1,50** (vorher 0,87) |

Beide Abnahmen (≥ ×2,5 und ≥ 1,4) sind in **allen vier** Epochen erfüllt, nicht nur
in der gerügten. Zwei Eingriffe:

* **Der Atem.** Bett und Hof laufen über eine langsame Kontur mit einer Runde von
  7,0 s — kurz genug, dass in jedem Achtsekundenfenster der höchste und der tiefste
  Punkt vorkommen. Der tiefste Punkt ist je Epoche verschieden (1350/1600 0,46,
  1884 0,34, **1970 0,24**), weil `hof4`/`bett4` als das gleichförmigste Material
  aus dem Erzeuger kamen. Die Kontur ist ein Band im Kontext, das auf dem
  Gain-Parameter liegt; kein Oszillator, keine Zeitschaltuhr.
* **Die Zäsur.** Der Michaelitag ging vorher unter, und beim zweiten Messen lag es
  **nicht am Bett, sondern am Werk**: das Jahr wechselt nach einer Reihe schneller
  Klicks, deren Klänge noch im Raum stehen. Mehr Pegel half nicht (Hub 0,87 in 1350,
  0,74 in 1600, obwohl die Glocke lauter stand). Jetzt gehen Bett, Hof, Werk **und**
  der Fremdbus auf 0,22 zurück, und das Zeichen läuft auf einem eigenen Bus daran
  vorbei. Dazu eine Sperre in `ducke()`: ein späterer, flacherer Zug darf einen
  tieferen, der noch läuft, nicht mehr aufheben — vorher hob `sud:ausschlagen` die
  Zäsur des Michaelitags auf, weil es eine Zehntelsekunde später in dieselbe Sekunde
  fiel. Genau daran hing der Hub.
* Das Geld kommt **0,62 s nach** der Glocke statt gleichzeitig. Das ist zugleich
  Auflage 5 (siehe dort) und macht daraus, wonach das prüfende Ohr sucht: „eine
  einzelne Glocke und danach gezähltes Geld".

### 3 — `gegner:uebernahme` in den Katalog · **erfüllt**

`BRAUHAUS.ton.geraten()` ist nach zwanzig Wochen in **jeder** Epoche `{}` — und
ebenso in allen acht 30-s-Aufnahmen (`epoche*-messung.json`).

Nachgezählt an der Zugmaschine statt an der Zeichenkette: `merkeZug()` bildet
`'gegner:' + art` aus **siebzehn** Werten (`angebot · aufstocken · bauen · ende ·
erbe · fuhre · laesstab · macht · not · preis · rohstoff · schluckt · uebernahme ·
unglueck · verlieren · werben · zielen`), dazu `binden` und `entreissen` aus
gegner.js:579. Sechs fehlten: `uebernahme · schluckt · not · ende · erbe ·
laesstab`. Alle sechs stehen jetzt im Katalog. Mitgeprüft und ergänzt: vier Namen
aus der Erbleiste (`anfechten · nachschrift · seelgeraet · verlaengern`).
Katalog 81 → **91** Einträge.

### 4 — Ragtime raus aus 1884 · **erfüllt**

`bett3.mp3` neu erzeugt: eine deutsche Blaskapelle, streng auf dem Schlag, ohne
Klavier, ohne Synkopen. Die alte Datei liegt als
`werkbank/schuss/klang-nacharbeit/bett3-ragtime-alt.mp3`.

* Einzeln vorgelegt (`beschreibe.py`, ohne Dateinamen): *„Melodie eines tiefen
  Blechblasinstruments (Tuba oder Euphonium) … **19. Jahrhundert** … FALSCH:
  Nichts."* Die alte Datei an derselben Stelle: *„21. Jahrhundert"*.
* In der fertigen halben Minute nennt das blinde Ohr 1884 mit 90 % Sicherheit und
  begründet es mit Dampfmaschine und Dampfpfeife. **Das Wort „Ragtime" fällt in
  keinem Durchgang dieser Runde mehr** — vorher dreimal unabhängig.
* Nebenbefund: die alte Datei trug bei Sekunde 44 einen elektronischen Meldeton.
  Der lag schon vorher außerhalb der Schleife (`SCHNITT.bett3`) und ist jetzt weg.

### 5 — Michaeliklang E4 ersetzen · **erfüllt**

Der Befund war schärfer, als er aussah: `telefon.mp3` ist **für sich tadellos** —
einzeln vorgelegt *„mechanisches Telefonklingeln, 20. Jahrhundert, FALSCH: nichts"*.
Der Anachronismus entstand erst in der **Mischung**: bei Sekunde 16/17 fielen
`preis:michaeli` (Telefon) und `preis:muenzen` (Registrierkasse) in dieselbe
Sekunde, und aus Klingel plus Kassenglocke wurde ein „digitaler Handy-Klingelton".

1970 hat jetzt eine **elektrische Werksglocke** (`werksglocke.mp3`, neu erzeugt;
einzeln: *„lautes mechanisches Klingeln wie eine Schulglocke, 19./20. Jahrhundert,
FALSCH: Nichts"*), und das Geld kommt 0,62 s später.

Der erste Anlauf steht hier, weil er gemessen gescheitert ist: dort war der Zahltag
von 1970 die `fabrikpfeife` — Auflage 7 in einem Aufwasch. Das Ohr nannte die Epoche
zwar mit 100 % richtig, meldete aber ungefragt *„STÖRT: Das laute Schnaufen und
Pfeifen einer Dampflokomotive passt nicht in die 1970er Jahre und gehört eher in die
Epoche um 1884."* Ein Anachronismus rückwärts ist auch einer. In der Schlussmessung
sagt das Ohr zu 1970: *„STÖRT: Nichts, die Geräusche passen in die Zeit um 1970."*

### 6 — Kopfraum · **erfüllt, und zwar baulich**

Hinter dem Kompressor sitzt eine **Bremse**: ein WaveShaper mit der Kennlinie
`1,2 · tanh(x/1,2)` über der Eingabe −1..+1. Alles darüber klemmt der Knoten auf den
Randwert. **Am Ausgang kann nie mehr als 0,818 stehen**, unabhängig davon, was
davor passiert; unterhalb von 0,3 weicht die Kennlinie um weniger als drei Prozent
von der Geraden ab. `ausgang()` gibt jetzt den Knoten **hinter** der Bremse zurück,
damit ein Prüfstand denselben Ton abgreift, der aus dem Lautsprecher kommt.

Gemessen an den vier Aufnahmen: Spitze **0,8187** in allen vieren, **0 übersteuerte
Proben** von 1 323 000 je Datei (vorher: E3 Spitze 1,0000, 2 Proben).

Eine Zwischenfassung mit `oversample: '4x'` stand wieder bei 1,0000 — die Filter der
Überabtastung schwingen an der Kante bei ±1 über, die Decke gilt dann für die
Kennlinie, aber nicht mehr für den Ausgang. `oversample` ist deshalb aus, und das
steht auch so im Quelltext.

### 7 — `fabrikpfeife.mp3` anschließen oder löschen · **erfüllt, angeschlossen**

Die tote Datei war die **richtige Probe an der falschen Stelle**, nicht überzählig:
`woche3.mp3` — das Wochenzeichen von 1884, der häufigste Ton der Epoche — ist
einzeln vorgelegt eine *„Trillerpfeife, Schiedsrichterpfeife"*. Zeitlich erlaubt
(seit 1868), aber im Hof einer Dampfbrauerei ist das Zeichen der Woche die
**Werkspfeife**. `uhr:woche` in 1884 ist jetzt `fabrikpfeife`; die Trillerpfeife
steht bei `sud:freigabe` — der Braumeister pfeift den Sud frei.

Gegengeprüft: **keine einzige tote Probe** mehr unter `spiel/ton/klang/` (46
Dateien, alle in `kern/ton.js` genannt). Die Sicherung der alten `bett3` liegt
außerhalb von `spiel/`, damit sie nicht selbst zur toten Datei wird.

### 8 — `werkbank/hoerer.py` · **nicht angefasst (ZUSTÄNDIGKEIT 16)**

Die Datei ist unberührt. Sein Befund hat sich in dieser Runde **zweimal
reproduziert**: `blindE/ton-3.wav` kam als *„Epoche 1, sicher 0"* mit dem Text
*„Da mir als Text-KI nur leere Zeitstempel … übermittelt wurden"* zurück, und
derselbe Fall trat einen Durchgang vorher bei einer anderen Datei auf. Beide Male
war es eine **Verweigerung**, die als Zahl herauskam, und beide Male hat `sicher: 0`
sie verraten. Von Hand als KEINE MESSUNG behandelt und erneut gefragt; beim zweiten
Mal kam ein Urteil mit Sicherheit 95. Die Reparatur bleibt bei der Aufsicht.

---

## Was die Latte selbst sagt: das blinde Ohr

Vier Aufnahmen, neutrale Namen, gemischte Reihenfolge, Schlüssel erst nach den
Antworten gelesen. `werkbank/hoerer.py`, unverändert.

| | gehört | wahr | sicher | STÖRT |
|---|---|---|---|---|
| ton-3 | 1 | 1 ✓ | 95 | *„Nichts, alle hörbaren Klänge passen authentisch in die Zeit um 1350."* |
| ton-4 | 2 | 2 ✓ | 100 | Reißverschluss am Anfang — **behoben, siehe unten** |
| ton-2 | 3 | 3 ✓ | 90 | *„kurz ein elektronisches Piepen"* — **offen** |
| ton-1 | 4 | 4 ✓ | 85 | *„Nichts, die Geräusche passen in die Zeit um 1970."* |

**4 von 4 richtig, mit einem Bett bei 45 % seines alten Pegels.** Das ist der Punkt,
auf den es ankommt: die Epoche kommt jetzt aus Klängen, die etwas bedeuten
(Ochse/Pferd/Waggon/Lastzug, Kirchenglocke/Dampfpfeife/Werksglocke, Holzfeuer/
Dampf/Motor), nicht mehr aus der Kulisse allein — und sie kommt trotzdem an.

Der **Reißverschluss in 1600** war eine Folge meines eigenen Eingriffs: mit dem
angehobenen Werkpegel stand das Papier (`stadt:reiter`) doppelt so laut wie vorher.
`stadt:reiter` 0,4 → 0,26 und die vier anderen Papierklänge entsprechend.
Nachgemessen an einer neuen Aufnahme von 1600: *„STÖRT: Nichts Auffälliges."*,
Epoche richtig, Anteil des stillen Laufs unverändert 34 %.

### Wo der Kritiker sich irrt, mit der Zahl daneben

**Die „Stahlsäge" in 1350 (von ihm selbst als strittig markiert).** Er hat sie
`fuhre:fass-rollen` (`fassholz.mp3`) zugeschrieben. Einzeln vorgelegt, ohne
Dateinamen: `fassholz.mp3` = *„Rumpeln eines Karrens, Klappern von Holz, Rollen von
Rädern"*, **19. Jahrhundert, nichts falsch** — keine Säge. Die Säge ist echt, aber
sie steckt in `bau1.mp3`: *„Rhythmisches Sägen von Holz mit einer Handsäge"* —
und dazu sagt dasselbe Ohr *„14. Jahrhundert (oder jedes andere, da das Geräusch
zeitlos ist), FALSCH: Nein, alle gehörten Geräusche gab es bereits im Jahr 1350."*
Also: **richtige Beobachtung, falsche Datei, und kein Anachronismus.** Der Fund war
trotzdem teuer wert — er hat mich auf `bau1` gestoßen, und dass Eigen- und
Fremdbauen aus derselben Datei kommen, ist die Ursache der halben Auflage 1.

**Das Bett von 1970 („Synth-Pop ab 1980", von ihm als strittig markiert).**
`bett4.mp3` einzeln vorgelegt: *„E-Bass, E-Gitarre und Funk-Musikstil"*. Kein
Synthesizer benannt. E-Bass und Funk sind 1970 seit Jahren da; seine beiden anderen
Durchgänge („Pop/Funk", „jazzig") und meiner sagen dasselbe. **Kein Fund** — seine
eigene Einschätzung war richtig.

Beim Ragtime dagegen hatte **er** recht und mein Einzelbefund nicht: `beschreibe.py`
nennt die alte `bett3` „Blasmusik, Trompeten, Tuba" — aber eben auch
„21. Jahrhundert", und in der Mischung haben drei Ohren unabhängig „Ragtime"
gesagt. Eine Probe kann für sich benennbar sein und in der halben Minute kippen.
Die Datei ist ersetzt.

---

## Was offen bleibt

1. **Auflage 1 ist nicht abgenommen.** 1 von 4 auf ±2 s statt ≥ 3 von 4. Der
   Gegenzug ist hörbar geworden (0/4 → 3–4/4 JA, am Pegel der lauteste Ausschlag
   der halben Minute an seiner Sekunde), aber nicht eindeutig **benennbar**. Die
   nächste Runde braucht dafür keine weitere Pegeländerung, sondern eine
   Probe, die der Nachbar hat und der eigene Hof nicht — und die zugleich
   „Werben/Bauen/Zugreifen" heißt. Drei Anläufe und ihre Messwerte stehen oben,
   damit der vierte nicht bei null anfängt.
2. **`kurz ein elektronisches Piepen` in 1884**, einmal gemeldet, Quelle nicht
   eingegrenzt. Verdacht: die Trillerpfeife bei `sud:freigabe` oder der Ausklang der
   Werkspfeife. Nicht nachgemessen — ehrlicher, das zu sagen, als es wegzuschreiben.
3. **In E2 gibt es in den geprüften dreißig Sekunden keinen Gegenzug.** Das ist die
   Zugfolge des Aufnahmeskripts, aber es begrenzt jede Abnahme, die auf
   „≥ 3 von 4 Aufnahmen" lautet.
4. **`ohr-zwei.py` streut.** Dieselbe Datei, zweimal gefragt, nennt verschiedene
   Sekunden. Eine Abnahme, die an einer einzelnen Zahl dieses Geräts hängt, misst
   mit.
5. Das **Ducken im Offline-Renderer** (`rendere()`/`wav()`) ist ungenau: alle
   Ereignisse werden vor dem Rendern geplant, `g.value` ist dabei immer der
   Anfangswert. Der lebende Weg — den der Prüfstand abgreift — ist korrekt. Der
   Offline-Weg ist seit dieser Runde nur noch Bequemlichkeit; gemessen wird am
   lebenden Ausgang.

---

## KERN

Nichts anzumelden. Auflage 3 nennt `spiel/stuecke/gegner.js:417`; dort war **keine
Änderung nötig**. Die sechs fehlenden Namen entstehen aus `'gegner:' + art` und
werden vollständig in `kern/ton.js` bedient — `geraten()` ist der Beleg, und der ist
in allen vier Epochen leer. Auch `fuhre.js:1439` (`'fuhre:abfahrt:' + …`) und die
sieben Namen, die `erbe.js` über `klang()` ruft, sind von der Katalogseite her
abgedeckt.

**Fremde Baustellen, aktenkundig, nicht angefasst:**

* `stadt:bau:seite` klickt in E2, E3 und E4 ohne Klangnamen — `stadt.js` ruft dort
  keinen. Vom Kritiker schon gemeldet, unverändert. Ein Wort von der Aufsicht, und
  DIE STADT hängt `stadt:bau` dort ein; im Katalog steht der Name bereit.
* `gegner:abloesen:lindenhof` (E3) und `gegner:abloesen:hirsch` (E4) sind bei
  gefüllter Lade unklickbar; kein Tonfehler.
* `werkbank/hoerer.py` — ZUSTÄNDIGKEIT 16, siehe Auflage 8.

---

## Geänderte Dateien

| Datei | was |
|---|---|
| `spiel/kern/ton.js` | Mischung, Atem, Zäsur, Fremdbus und zwei Wände, Nachbarhof-Zeichen, Längenschnitt, Einsatzpunkte, Bremse, 10 neue Katalogeinträge (81 → 91) |
| `spiel/ton/klang/bett3.mp3` | **ersetzt** — Blaskapelle 1884 statt Ragtime (Auflage 4) |
| `spiel/ton/klang/werksglocke.mp3` | **neu** — Zahltag 1970 (Auflage 5) |
| `spiel/ton/klang/nachbar1.mp3`, `nachbar4.mp3` | **neu** — das Tor von drüben, bei `gegner:abloesen` und `gegner:uebernahme` (Auflage 1) |
| `spiel/ton/klang/fabrikpfeife.mp3` | unverändert, jetzt **angeschlossen** als `uhr:woche` in 1884 (Auflage 7) |
| `werkbank/schuss/klang-nacharbeit/` | **neu** — acht Aufnahmen, Messungen, Antwortmessungen, `bett3-ragtime-alt.mp3`, `proben-einsatz.mjs` |

`spiel/index.html` unberührt, `spiel/kern/**` außer `ton.js` unberührt,
`preis*.js` / `sud*.js` / `gegner.js` unberührt. Kein `git`.

**Vor der Abgabe geprüft:** `node --check` auf `kern/ton.js` und `stuecke/klang.js`
sauber · alle vier Epochen laden (HTTP 200) · `BRAUHAUS.lage.length === 0` in allen
vier, über 20 Browsersitzungen dieser Runde · **null** `console.error`, **null**
`pageerror` in denselben Sitzungen · `BRAUHAUS.ton.geraten()` überall `{}` ·
Spitze 0,8187 und null übersteuerte Proben in allen vier Aufnahmen.
