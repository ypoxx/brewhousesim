# DER KLANG — Bericht des Builders, Welle 4

Geschrieben am 3. August 2026, **vor** der Rückgabe. Arbeitsstand: Arbeitsbaum
auf Hafen 8899, `?epoche=1..4&saat=1350`.

Auftrag: die dritte Latte aus `gauntlet/MESSLATTE.md` — *dreißig Sekunden ohne
Bild, ein fremdes Ohr nennt Epoche und Vorgang* — die in drei Wellen nie
gemessen wurde.

---

## Das Ergebnis in einer Zeile

**Vier Aufnahmen zu je dreißig Sekunden, dem blinden Ohr in vier Durchgängen
vorgelegt, davon drei in gemischter Reihenfolge: 4 von 4 richtig, jedes Mal.**
Im letzten Durchgang sagt das Ohr in **allen vier** Epochen zum ersten Mal
*„STÖRT: nichts"*.

| Datei | gehört | sicher | was das Ohr für den Vorgang hält | stört |
|---|---|---|---|---|
| `epoche1.wav` | **1** | 95 % | „Es wird über einem offenen Feuer gebraut, eine Flüssigkeit kocht sprudelnd, Holz wird von Hand gesägt und Wasser umgefüllt. Im Hintergrund läutet eine Glocke und es erklingt eine mittelalterliche Melodie auf einer Holzflöte." | nichts |
| `epoche2.wav` | **2** | 95 % | „Im Hof wird handwerklich gearbeitet, man hört das rhythmische Sägen von Holz und Hämmern. Im Hintergrund spielt ein Cembalo." | nichts |
| `epoche3.wav` | **3** | 100 % | „Im Brauhaus-Hof ist eine schwere, dampfbetriebene Maschine in Betrieb, begleitet vom Läuten einer Glocke und dem Tuten einer Dampfpfeife." | nichts |
| `epoche4.wav` | **4** | 100 % | „Ein Gabelstapler oder LKW mit laufendem Motor bewegt Kisten oder Flaschen im Brauereihof. Im Hintergrund läuft funkige Musik aus einem Radio und ein Telefon klingelt." | nichts |

Messgerät: `werkbank/hoerer.py` (unverändert, kein Eingriff während des Laufs —
ZUSTAENDIGKEIT §16), Modell `gemini-3.1-pro-preview`, je Datei ein eigener
Aufruf ohne Dateinamen und ohne Kenntnis der anderen drei.

**Die vier Durchgänge im Verlauf** — jeder nach einem Eingriff, jeder am
fertigen Dreißig-Sekünder gemessen, nicht an einer Probe:

| Durchgang | Reihenfolge | Ergebnis | was das Ohr ungefragt rügte |
|---|---|---|---|
| 0 · Ausgangsstand | 1,2,3,4 | 4/4 | „modernes Auto**hupen**" in 1600 |
| 1 · nach Probentausch | 1,2,3,4 | **3/4** | 1600 fiel durch: *„gehört: Epoche 3"* |
| 2 · nach Cembalo zurück | 2,1,4,3 | 4/4 | „Telefonklingeln" (1350), „Fahrradklingel" (1600) |
| 3 · nach Glockendichte | 4,2,3,1 | 4/4 | „Autohupe bei 0:03 und 0:26" (1600), „Rückfahrpiepser" (1970) |
| 4 · nach Sinus-Tropfen | 1,3,2,4 | **4/4** | **nichts, in allen vieren** |

Durchgang 1 ist der lehrreichste und steht unten unter „Was schiefging".

---

## Klingt es im Browser wirklich? — die Zahlen, nicht die Behauptung

Ein WAV aus dem `OfflineAudioContext` beweist nur, dass der Renderer rechnet.
Deshalb hängt seit dieser Runde ein **Analyser am wirklichen Ausgang** (hinter
dem Kompressor, `BRAUHAUS.ton.pegel()`), und die Aufnahme misst ihn viermal je
Sekunde, während das Spiel bedient wird. Zusätzlich schneidet ein
`MediaRecorder` am selben Knoten den **lebenden** Graphen mit.

Chromium mit `--autoplay-policy=no-user-gesture-required`, ein echter Mausklick
zum Freigeben, dann dreißig Sekunden Spiel:

| Epoche | AudioContext | Messungen über null | RMS Mittel | RMS größter | Spitze | webm |
|---|---|---|---|---|---|---|
| 1350 | `running` | **119 / 119** | 0,0722 | 0,2380 | 0,744 | 243 KB |
| 1600 | `running` | **120 / 120** | 0,0758 | 0,2114 | 0,737 | 246 KB |
| 1884 | `running` | **120 / 120** | 0,1095 | 0,3023 | 0,913 | 246 KB |
| 1970 | `running` | **121 / 121** | 0,0992 | 0,1848 | 0,642 | 246 KB |

Kein einziges Messfenster war still. Die vier `epocheN.webm` sind der
Mitschnitt vom lebenden Ausgang und liegen neben den WAV.

**Abnahmetor, nach jedem Eingriff gefahren** (`werkbank/schuss/klang/lage.mjs`):
vier von vier Epochen laden, `BRAUHAUS.lage.length === 0`, **keine
Konsolenfehler**, Tonschalter da, 80–86 bedienbare Züge. Dazu ein
Bildschirmfoto-Lauf mit `?stumm=1` — „keine Fehler auf der Seite", und es wird
weiterhin kein Byte Ton geladen. `node --check` auf allen geänderten `.js`.

---

## Was in den dreißig Sekunden geschieht — der Vorgang, nicht die Kulisse

Der alte Prüfstand (`werkbank/ohrprobe.mjs`) klickte, was gerade dalag. Der neue
(`werkbank/schuss/klang/aufnahme.mjs`) arbeitet einen **Wunschzettel von
Vorgängen** ab und nimmt in jeder Epoche den Knopf, den diese Epoche dafür hat:

> Fass auf den Wagen · noch ein Fass · **die Fuhre fährt ab** · ein Fass
> anstechen · Rohstoff kaufen · eine Woche weiter · **der Sud wird angestellt** ·
> **die Michaelitafel** · die Tafel wieder zu · **dem Nachbarn zuvorkommen** ·
> eine Woche weiter · Fass auf den Wagen · die Fuhre fährt ab · eine Woche weiter

Er startet in **Woche 26**. Grund: der **Michaelitag** ist einer der vier
Vorgänge, nach denen der Auftrag fragt, und er fällt auf die 30. Woche des
Braujahres. Vierzehn Handgriffe tragen fünf Wochen weit, nicht neunundzwanzig —
aus Woche 1 heraus ist Michaeli in dreißig Sekunden schlicht nicht erreichbar.
`?woche=` ist ein Parameter des Kerns, kein Kunstgriff.

Was dabei je Epoche erklingt (aus `pegel.json`, vom Spiel selbst protokolliert):

| Epoche | Rufe | verschiedene | die Fuhre | der Sud | Michaeli | der Gegenzug |
|---|---|---|---|---|---|---|
| 1350 | 31 | 19 | `fuhre:abfahrt:ochse` ×2, `fass-rollen` ×2 | `pfanne` ×3, `anstich`, `anstellen` ×3, `ausschlagen` ×3 | `preis:michaeli` + `preis:muenzen` | `gegner:zuvorkommen`, `gegner:fuhre`, `gegner:bauen` |
| 1600 | 39 | 23 | `abfahrt:pferd` ×2, `fass-rollen` ×2, `kerbe` | `anstellen` ×5, `ausschlagen` ×5, `pfanne` ×4, `hefe` | `preis:michaeli` + `muenzen` | `zuvorkommen`, `fuhre`, `zielen`, `bauen` |
| 1884 | 40 | 25 | `abfahrt:waggon` ×2, `fass-rollen` ×2 | `anstellen` ×5, `pfanne` ×4, `fehlsud` | `preis:michaeli` + `muenzen` | `zuvorkommen`, `werben`, `preis`, `fuhre` |
| 1970 | 45 | 23 | `abfahrt:lastzug` ×2, `fass-rollen` ×2, `kerbe` | `anstellen` ×8, `ausschlagen` ×6, `sperre`, `hefe` | `preis:michaeli` + `muenzen` | `abloesen`, `fuhre`, `bauen` |

Dazu in allen vieren ein **Erbfall** (`erbe:stunde · erbe:fallen · erbe:erbteil`)
und der Ruf des Hauses (`name:aufgeld`, `name:urteil-gut`, `name:nachahmung`).

**Und das Wichtigste an dieser Tabelle:** `BRAUHAUS.ton.geraten()` ist in allen
vier Aufnahmen **leer**. Kein einziger Ruf des Spiels landet mehr im
Notfallkasten. Vorher fielen sämtliche Rufe von DER SUD, DER NAME und DAS ERBE
hinein — alle drei Stücke wurden nach `kern/ton.js` gebaut. Das hieß in der
Sache: **jeder** Sud-Ruf klang nach der kochenden Pfanne (auch das Anstechen,
die Hefe, der Rückruf), **jeder** Name- und Erbe-Ruf nach Papier.

---

## Wie es messbar zwischen den Epochen unterscheidet

Das Ohr begründet seine Zuordnung jedes Mal selbst, und die Begründungen sind
über alle Durchgänge dieselben drei Schichten:

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| **Bett** (Musik) | Holzflöte, modal | **Cembalo** | Blaskapelle / Drehorgel | Funk, E-Bass, Radio |
| **Hof** (Grundton) | Feuer unter der Pfanne, Blubbern, Tropfen | Schmiedehammer, knarrende Winde, Karren | **Dampfmaschine**, Riemen, Schwungrad | **Dieselmotor**, Klappern |
| **Werk** (Vorgang) | Ochsengespann, Handsäge, Zapfen | Pferdefuhrwerk, Handhammer | Rangieren, Dampfpfeife | Lastzug, Druckluft, Telefon, Flaschen |

Der Beleg, dass das **Bett** die Epoche trägt, ist ein Fehlschlag: als `bett2`
in Durchgang 1 versehentlich mit einer **Blockflöte** zurückkam — dem
Leitinstrument von `bett1` —, fiel 1600 sofort durch (*„gehört: Epoche 3,
sicher 85 — rhythmisches Stampfen und Zischen einer Dampfmaschine"*). Mit dem
Cembalo zurück nennt das Ohr 1600 in jedem folgenden Durchgang mit 95–100 % und
**begründet es jedes Mal zuerst mit dem Cembalo**.

> **Zwei Epochen mit einem Leitinstrument sind für ein blindes Ohr eine Epoche.**

---

## Was schiefging, und was daraus wurde

### 1 — Die Autohupe, die drei Epochen lang mitlief

`beschreibe.py` legt **eine einzelne Probe** einem fremden Ohr vor, ohne
Dateinamen und ohne Absicht. Über `karren.mp3` sagte es:

> Klänge: Rhythmisches Rütteln · **Autohupe** · Verkehrsrauschen · Motorenbrummen.
> FALSCH: Autohupe bei Sekunde 00:02, Motorengeräusche im Hintergrund.

Diese Probe lief in **1350, 1600 und 1884**, jedes Mal wenn der Nachbar um ein
Haus warb (`gegner:werben`, `gegner:zuvorkommen`). Kein Mensch hat danach
gesucht. Die gleiche Prüfung fand acht weitere:

| Probe | was das Ohr hörte | wo sie lief |
|---|---|---|
| `karren` | **Autohupe**, Motoren, 20./21. Jh. | Werbung des Nachbarn, E1–E3 |
| `woche1` | **Fahrradklingel**, 19.–21. Jh. | WEITER in 1350 — der häufigste Ton des Spiels |
| `abfahrt1` | **Rollkoffer**, Hartplastikrollen | die Ochsenfuhre von 1350 |
| `abfahrt2` | „rotierende Münze" | das Pferdefuhrwerk von 1600 |
| `siegel` | **Plastikfolie / Zellophan** | `fuhre:siegel` — sechs Rufstellen |
| `kerbe` | mechanischer **Schalter**, 20. Jh. | das Kerbholz, alle Epochen |
| `hof3` | **Elektromotor** ab 00:00 | das Hofband von 1884, durchgehend |
| `bett3` | **Smartphone-Piepen** bei 0:45 | Musik von 1884 |
| `bett2` | Spätbarock, Menuett, **18. Jh.** | Musik von 1600 |
| `fassstahl` | „Boing, Maultrommel" | das Stahlfass von 1970 |
| `hof1` | RMS 0,014 — das leiseste Band, nur ein knarrendes Rad | das Hofband von 1350 |

Alle ersetzt. Die Prompts, die es am Ende trafen, stehen in
`werkbank/schuss/klang/erzeuge.py`, **jede mit dem Satz des Ohres daneben, der
die alte Probe verurteilt hat.**

### 2 — Eine Probe kann einzeln tadellos sein und in der Mischung kippen

`glocke.mp3` war einzeln geprüft *„Glockenschlag, zeitlos, nichts falsch"* — und
in den fertigen dreißig Sekunden von 1600 *„eine moderne **Autohupe** bei 0:03
und 0:26"*, in 1350 *„ein modernes Telefonklingeln"*. Zwei Lehren:

* **Beides muss gemessen werden**, die Probe und die halbe Minute. Die zweite
  Messung findet Dinge, die die erste nicht finden kann.
* **Dichte ist ein Klang.** In 1600 lagen sieben glockenähnliche Schläge in
  dreißig Sekunden (`uhr:woche` ×3, `erbe:stunde`, `erbe:fallen`,
  `preis:michaeli`, `name:urteil-gut`); daraus machte das Ohr eine Klingel.
  `erbe:stunde` ist jetzt eine Kerbe, `name:urteil-gut` ein Handschlag,
  `erbe:erbteil` der Kiel im Hausbuch statt klimpernder Münzen unmittelbar nach
  dem Totengeläut — dieses Paar hatte das Ohr als Telefon gehört.

### 3 — Der teuerste Fund: eine Regel, die im Kopf der Datei stand und nicht stimmte

`kern/ton.js` behauptet seit Welle 2: *„Kein einziger Oszillator in dieser
Datei"*, mit ausführlicher Begründung. Sie stimmte nicht. Der Tropfen im leeren
Keller (`kellerBand()`) war ein von 900 auf 420 Hz abfallender **Sinus**,
viermal in einer Schleife von sechs Sekunden — und diese Schleife startet mit
`sommer:keller-leer` **am Michaelitag** und läuft bis zum Ende, in allen vier
Epochen. Das Ohr meldete in 1350 *und* unabhängig in 1884:

> „Es sind mehrfach elektronische Pieptöne zu hören, die wie ein modernes
> digitales Gerät klingen und nicht ins Mittelalter passen."

Genau in den beiden Epochen, deren Mischung dünn genug ist, dass man ihn hört.
Der Tropfen ist jetzt Rauschen durch ein zweipoliges Bandpassfilter (RBJ,
Güte 1,2). Danach: alle vier „STÖRT: nichts".

> **Eine Regel im Kopf einer Datei ist keine Messung.** Der Satz stand
> zweieinhalb Wellen lang da und niemand hat ihn gegen den Code gehalten.

### 4 — Das Messgerät hat einmal geschwiegen, ohne es zu sagen

In Durchgang 1 kam für `epoche2.wav` zurück: *„Da keine Audiodatei übertragen
wurde, kann das Geschehen nicht analysiert werden"* — mit `epoche: 3,
sicher: 0`. `hoerer.py` wertet das als **DURCHGEFALLEN**, weil es formal
gültiges JSON ist; die Wiederholschleife greift nur bei `abbruch`. Die Datei war
nachweislich in Ordnung (30,0 s, RMS 0,111, Spitze 0,89 — direkt aus dem WAV
nachgerechnet). Erst die Wiederholung ergab das echte Urteil, und das war
ebenfalls „durchgefallen", aber aus einem **anderen und wirklichen** Grund.

> **Bitte an die Aufsicht, kein Eingriff von mir** (§16: am Messgerät wird nicht
> gedreht, während die Latte läuft): `hoerer.py` sollte eine Antwort mit
> `sicher: 0` **oder** einer Vorgangsbeschreibung, die das Fehlen der Datei
> beklagt, als *keine Messung* behandeln und wiederholen — so wie es einen
> `abbruch` behandelt. Sonst kann ein Übertragungsfehler ein Stück durchfallen
> lassen, und das ist der teuerste Fehler, den ein Messgerät machen kann.

---

## Was gebaut wurde

### `spiel/kern/ton.js` (ZUSTAENDIGKEIT §11 — diese Datei gehört diesem Stück)

**Die alte API ist Zeichen für Zeichen unverändert** — `melde · spiele ·
schleife · halt · bett · setzeStumm · setzeLaut`, und `spiele` gibt weiterhin
einen Wahrheitswert zurück. Alles Neue ist additiv.

1. **Der Katalog deckt jetzt alle sieben Stücke.** 38 neue Einträge für
   `sud:*` (14), `name:*` (16), `erbe:*` (8), dazu sechs nachgetragene
   `gegner:*`-Namen (`zielen`, `binden`, `angebot`, `hinhalten`, `mitbieten`,
   `oeffnen`) und `fuhre:probe` / `fuhre:listen`. Vorher: 39 Einträge, und alles
   aus Welle 2 und 3 fiel in den Notfallkasten.
2. **`BRAUHAUS.ton.pegel()`** — ein Analyser am wirklichen Ausgang (hinter dem
   Kompressor). Gibt `{zustand, stumm, laut, rms, spitze, hoechste, lauteste}`.
   `hoechste`/`lauteste` sind Höchstwerte seit dem Laden, damit ein Prüfer nicht
   das richtige Millisekundenfenster treffen muss.
3. **`BRAUHAUS.ton.ausgang()`** — der lebende Knoten, damit ein Prüfstand von
   außen einen `MediaStreamDestination` anhängen und wirklich mitschneiden kann,
   statt dem Offline-Renderer zu glauben.
4. **`BRAUHAUS.ton.geraten()`** — zählt, welche Namen im Notfallkasten gelandet
   sind. Eine leere Rückgabe heißt: jeder Ruf des Spiels hat einen eigenen Klang.
   Damit ist die Lücke *zählbar*, statt nur nach Papier zu klingen.
5. **Der Sinus-Tropfen ist weg** (siehe oben), `SCHNITT.bett3` von 1,5 s auf
   2,5 s Ausschnitt am Ende, damit der Meldeton bei 44,4 s sicher draußen bleibt.

### `spiel/ton/klang/` — 14 Proben ersetzt, 4 neu, 1 verworfen

**Ersetzt (14):** `karren · abfahrt1 · abfahrt2 · abfahrt4 · woche1 · siegel ·
kerbe · hof1 · hof3 · fassholz · fassstahl · handschlag · glocke · bett2`.
**Neu (4):** `anstich · flaschen · feder · hefe`.
**Unverändert und geprüft:** `hof2 · bett1 · bett3 · bett4 · sud1..4 · abfahrt3 ·
woche2..4 · muenzen · kasse · maschine · kreide · telefon · papier · bau1 · bau4 ·
brand · unruhe · horchen · fabrikpfeife`.
Die `.alt.mp3`-Sicherungen des Erzeugers sind wieder gelöscht (Ballast im Repo).
Der Ordner hat **43 Dateien, 7,0 MB**.

Ein Prompt hat es **dreimal** gebraucht (`siegel`: Zellophan → Gummispielzeug →
Ratsche → Holzstempel), zwei je zweimal, `bett2` dreimal. Zwei Grenzen der
Gegenstelle sind dabei teuer gelernt und stehen jetzt im Kopf von `erzeuge.py`:
`/v1/sound-generation` nimmt höchstens **450 Zeichen** (darüber 400
`text_too_long` und **gar kein Ton** — die erste Fuhre von 17 Proben lieferte
deshalb nur 6), und höchstens **5 gleichzeitige** Anfragen.

Eine Probe hat es nicht geschafft: **`maische` gibt es nicht.** Zwei Anläufe
kamen als „Espressomaschine" und als „Holzratsche" zurück. Das Anstellen klingt
jetzt über `sud1..sud4` — und das ist ohnehin näher am Spiel: die Pfanne *ist*
der Sud.

---

## Was offen bleibt

1. **Der Michaelitag steht am Ende der Aufnahme, nicht in ihrer Mitte.** Er ist
   drin (Glocke + Münzen bzw. Telefon + Registrierkasse), aber als letzter Ton.
   Wer die Aufnahme nach 25 s abbricht, hört ihn nicht.
2. **`fuhre:siegel` kommt in keiner der vier Aufnahmen vor** — der Ton mit den
   sechs Rufstellen im Spiel wird von diesem Wunschzettel nie ausgelöst. Er ist
   geprüft (Holzstempel auf Pergament, „zeitlos, nichts falsch"), aber nicht in
   einer gemessenen halben Minute belegt.
3. **`hof2` ist unverändert** und die einzige Probe mit einer menschlichen
   Stimme im Grundband („männliche Stimme im Hintergrund"). Das Ohr hat sie nie
   gerügt und datiert sie auf „17. Jahrhundert" — aber der Kopf von
   `klang-erzeuge.py` warnt zu Recht, dass Sprache im Bett die Aufmerksamkeit
   zieht. Wer sie ersetzt, muss messen: **zwei** Versuche, sie zu verbessern,
   kamen schlechter zurück (Streichholz 1600; elektronisches Lachen).
4. **`bett2` datiert das Ohr weiterhin auf „17.–18. Jahrhundert"**, nicht auf
   1600 — es rügt es aber nicht als falsch, und es ist genau das Merkmal, an dem
   es 1600 erkennt. Ein Cembalo/Virginal ist für 1600 richtig; der *Stil* ist es
   nicht ganz. Wer daran dreht, riskiert die Epochenzuordnung; **die Latte war
   schon einmal daran gerissen**.
5. **`fabrikpfeife.mp3` liegt ungenutzt im Ordner.** Sie ist geprüft
   („Dampfpfeife, 19. Jh., nichts falsch") und wäre der naheliegende Ton für
   `sud:sperre` oder den Feierabend in 1884.
6. **Der Erbfall klingt in allen vier Epochen an derselben Stelle** — er wird
   vom Wunschzettel bei Woche 26 zuverlässig ausgelöst. Das ist gut für die
   Aufnahme und sagt nichts darüber, wie oft er im wirklichen Spiel vorkommt;
   das misst DAS ERBE, nicht DER KLANG.

---

## KERN: keine Änderung nötig

Ich habe **nur** `kern/ton.js` angefasst, und die gehört nach ZUSTAENDIGKEIT §11
diesem Stück. Keine andere Kerndatei war nötig. `spiel/index.html` ist
unberührt; `kern/ton.js` hängt `stuecke/klang.js` und `stil/klang.css` weiterhin
selbst nach (ZUSTAENDIGKEIT §15 hat das für die Glättung auf feste Plätze
vorgemerkt — von mir aus unverändert, damit die Datei nicht zweimal geladen wird).

Eine Bitte an die Aufsicht steht oben unter „Was schiefging" §4: die
Wiederholschleife in `werkbank/hoerer.py`. Das ist ein Messgerät, kein Kern, und
§16 verbietet mir, während des Laufs daran zu drehen.

**Fremdbefund, keine Baustelle von mir:** während der ganzen Runde ist in keiner
Messung ein Konsolenfehler aus einem fremden Stück aufgetreten —
`BRAUHAUS.lage.length` war in jeder der ~40 Ladungen 0, in allen vier Epochen.
Die beiden gleichzeitig arbeitenden Builder (`preis*`, `sud*`) haben nichts
kaputt gemacht, das ich hätte sehen können.

---

## Geänderte und neue Dateien

**Geändert:**

| Datei | was |
|---|---|
| `spiel/kern/ton.js` | Katalog für alle sieben Stücke · `pegel()` · `ausgang()` · `geraten()` · Sinus-Tropfen ersetzt · `SCHNITT.bett3` |
| `spiel/ton/LIESMICH.md` | Stand Welle 4, die widerlegte Oszillator-Regel, das neue Messverfahren |

**Neu unter `spiel/ton/klang/`** (4): `anstich.mp3` · `flaschen.mp3` ·
`feder.mp3` · `hefe.mp3`
**Ersetzt unter `spiel/ton/klang/`** (14): `karren` · `abfahrt1` · `abfahrt2` ·
`abfahrt4` · `woche1` · `siegel` · `kerbe` · `hof1` · `hof3` · `fassholz` ·
`fassstahl` · `handschlag` · `glocke` · `bett2`

**Neu unter `werkbank/schuss/klang/`:**

| Datei | wofür |
|---|---|
| `aufnahme.mjs` | die vier Aufnahmen — Wunschzettel von Vorgängen, Pegelmessung, WEBM-Mitschnitt |
| `lage.mjs` | das Abnahmetor: vier Epochen, `lage`, Konsolenfehler, AudioContext |
| `beschreibe.py` | ein fremdes Ohr beschreibt **eine** Probe, ohne Dateinamen |
| `proben.mjs` | Dauer, Effektivwert und Spitze jeder Probe — findet stumme und zu leise |
| `erzeuge.py` | die Prompts, jede mit dem Satz des Ohres, der die alte Probe verurteilt hat |
| `zuege.mjs` | welche Knöpfe eine Epoche über N Wochen hergibt (Grundlage des Wunschzettels) |

**Die abgelegten Aufnahmen** — zusammen **8,3 MB**, Grenze war 20 MB:

| Datei | Größe | was |
|---|---|---|
| `werkbank/schuss/klang/epoche1.wav` | 1,92 MB | 30 s, 32 kHz mono — das, was das Ohr bekommt |
| `werkbank/schuss/klang/epoche2.wav` | 1,92 MB | |
| `werkbank/schuss/klang/epoche3.wav` | 1,92 MB | |
| `werkbank/schuss/klang/epoche4.wav` | 1,92 MB | |
| `werkbank/schuss/klang/epoche1..4.webm` | je ~245 KB | Mitschnitt vom **lebenden** Ausgang |
| `werkbank/schuss/klang/pegel.json` | 7 KB | Pegel, Klickfolge, Klangfolge, `geraten()`, `lage`, Fehler |

WAV, nicht Opus: `werkbank/hoerer.py` und das fremde Ohr nehmen WAV sicher
entgegen, und vier Dateien zu 1,92 MB liegen deutlich unter der Grenze. Die
WEBM liegen als Beleg daneben und kosten zusammen 1 MB.

---

## Wie man das alles nachfährt

```bash
npx --yes http-server -p 8899 -s . >/dev/null 2>&1 &

node werkbank/schuss/klang/lage.mjs          # Abnahmetor: 4 Epochen, lage=0
node werkbank/schuss/klang/proben.mjs        # jede Probe: Dauer, RMS, Spitze
node werkbank/schuss/klang/aufnahme.mjs      # vier WAV + WEBM + pegel.json
./werkbank/hoerer.py werkbank/schuss/klang/epoche1.wav \
   werkbank/schuss/klang/epoche2.wav werkbank/schuss/klang/epoche3.wav \
   werkbank/schuss/klang/epoche4.wav --blind

# und wenn eine einzelne Probe verdächtig ist:
./werkbank/schuss/klang/beschreibe.py spiel/ton/klang/hof2.mp3 --jahr 1600
```
