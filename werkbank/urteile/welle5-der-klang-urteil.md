# DER KLANG — blindes Urteil, Welle 5

**Gemessener Commit:** `2f0e4b45d203721350e836283697c98eb8b8a5de` (`2f0e4b4`,
"Welle 5 gestartet: DER PREIS baut, DER KLANG wird blind nachgeprueft").
Eingefroren nach `/tmp/klangstand5/2f0e4b4`, eigener Hafen **8917**, weil an
`stuecke/preis*.js` gleichzeitig gebaut wird. Waehrend der Erkundung ist HEAD
von `3e6d08c` auf `2f0e4b4` gewandert — alle Zahlen unten stehen auf `2f0e4b4`
und nur auf diesem.

**Belege:** `werkbank/schuss/klang-blind-w5/`
**Latte:** DREISSIG SEKUNDEN OHNE BILD, EIN FREMDES OHR NENNT EPOCHE UND VORGANG.

---

## URTEIL: **BESTEHT MIT AUFLAGE**

Die Latte ist im Wortlaut erfuellt und in der Sache nicht.

Erfuellt: in allen vier Epochen entsteht messbar Schall, alle vier Vorgaenge —
Fuhre, Sud, Michaelitag, Gegenzug — werden in allen vier Epochen wirklich
ausgeloest, jeder Klick wird binnen 0,07–0,21 s hoerbar beantwortet, kein Ruf
faellt in den Ersatzkasten, und das fremde Ohr des Hauses hat in einem
verdeckten Durchgang **8 von 8** Aufnahmen der richtigen Epoche zugeordnet.
Am **Pegel** ist die alte Auflage klar erledigt: Spielen ist das 3,6- bis
6,3-fache von Nichtstun.

Nicht erfuellt: **die Epoche kommt aus der Bettmusik, nicht aus dem Spiel.**
Die vier Aufnahmen, in denen ich keinen einzigen Klick getan habe und in denen
das Spiel nachweislich **null** Klaenge ausgeloest hat, werden richtig
zugeordnet — auf dem sauberen Satz 4 von 4, ueber alle Messungen **18 von 20
(90 %)**, gegen **12 von 20 (60 %)** fuer die gespielten. Das Spielen macht die
Zeit nicht hoerbarer, sondern schlechter erkennbar. Und das Ohr sagt selbst,
woran es liegt: viermal von vier begruendet es die stille Aufnahme mit dem
Instrument der Musik — *"Blockfloete"*, *"gezupfte Lautenmusik"*,
*"Blaskapelle mit Ventilblechblasinstrumenten"*, *"70er-Jahre-Funk/Jazz mit
E-Bass, Schlagzeug und E-Orgel"*. Genau der in der Aufgabe beschriebene Fall:
formal bestanden, der Sache nach nicht.

Dazu ein harter Einzelbefund: `fuhre:fuellen` legt 5 bis 12 identische Kopien
derselben Probe binnen einer halben Sekunde uebereinander; das blinde Ohr hat
das Ergebnis in 1970 ungefragt als *"8-Bit/Chiptune-Soundeffekt"* bei Sekunde 2
gemeldet — ein Geraeusch, das es in keiner der vier Epochen gab. Der Befund
reproduziert sich auf beiden Aufnahmesaetzen.

**In eigener Sache:** mein erster Aufnahmesatz hatte einen Fehler, den ich
beinahe dem Spiel angelastet haette — siehe Abschnitt 1. Die Zahlen unten sind
die des korrigierten Satzes.

---

## 1 — DAS MESSGERAET (eigenes, nicht das des Bauers)

Das Spiel bringt einen eigenen Weg zur Datei mit (`BRAUHAUS.ton.wav(30)` →
`rendere()`, `spiel/kern/ton.js:1268`). Der ist **nicht benutzt worden**: er
rendert den Graphen ein zweites Mal offline und beweist damit nicht, dass im
Browser etwas erklingt.

Gemessen wurde am **lebenden** Ausgang:
`werkbank/schuss/klang-blind-w5/aufnahme.mjs` haengt einen eigenen
`ScriptProcessorNode` an `BRAUHAUS.ton.ausgang()` (`spiel/kern/ton.js:1231`),
sammelt die Abtastwerte und schreibt das WAV selbst, **unnormalisiert**. Der
Abgriff endet in einem Gain mit Wert 0 — am Geraet des Bauers und am Hauptweg
ist nichts gedreht (ZUSTAENDIGKEIT 16).

Gespielt wurde mit der Maus (Playwright-Locator, echte Klicks), je Aufnahme
26 Vorlaufwochen und danach 30 s nach festem Zugplan, damit der Jahreswechsel
(und damit der Michaelitag) ins Fenster faellt.

### EIN FEHLER IN MEINEM EIGENEN PRUEFSTAND, GEFUNDEN UND BEHOBEN

Der erste Satz Aufnahmen (`roh/`) hat in den **ersten zwei Sekunden** das
4,51- / 4,81- / 7,55- / 7,90-fache des uebrigen Effektivwerts getragen — in den
stillen genauso wie in den gespielten. Das sah nach einem Schleifenanfang des
Spiels aus, und beide Ohren haben genau dort ungefragt einen Anachronismus
gemeldet (*"metallisches Rattern eines modernen Rolltores"*, *"ein modernes
Motorengeraeusch aehnlich einem Hubschrauber"*).

Es war **mein** Fehler, nicht der des Spiels. Der Vorlauf schaltet 25 Wochen in
rund zehn Sekunden durch; was davon noch ausklingt, stand am Anfang jeder
Aufnahme. Gegenprobe mit acht Sekunden Ruhe zwischen Vorlauf und Abgriff
(`RUHE=8`, `aufnahme.mjs`):

| Aufnahme | Faktor erste 2 s / Rest, ohne Ruhe | mit 8 s Ruhe |
|---|---|---|
| e1-still | 4,51× | **0,77×** |
| e4-still | 7,90× | **1,04×** |

Die Anschuldigung gegen die Schleifenanfaenge ist damit **zurueckgezogen**.
Alle Zahlen unten stehen auf dem sauberen Satz `rein/` (mit 8 s Ruhe); `roh/`
bleibt als Beleg liegen, weil der erste Blinddurchgang darauf lief.

### Beleg, dass Schall entsteht (sauberer Satz `rein/`)

| Aufnahme | AudioContext | Abtastwerte | rms | Spitze | Ereignisse | Klicks | `lage` | Konsolenfehler |
|---|---|---|---|---|---|---|---|---|
| e1-gespielt | `running` | 1 314 816 (29,81 s) | 0,11117 | 0,8187 | 35 | 13 | 0 | 0 |
| e2-gespielt | `running` | 1 314 816 (29,81 s) | 0,11846 | 0,8187 | 39 | 13 | 0 | 0 |
| e3-gespielt | `running` | 1 318 912 (29,91 s) | 0,16899 | 0,8187 | 40 | 13 | 0 | 0 |
| e4-gespielt | `running` | 1 310 720 (29,72 s) | 0,16228 | 0,8187 | 52 | 13 | 0 | 0 |
| e1-still | `running` | 1 318 912 (29,91 s) | 0,03119 | 0,4413 | **0** | 0 | 0 | 0 |
| e2-still | `running` | 1 318 912 (29,91 s) | 0,03020 | 0,1949 | **0** | 0 | 0 | 0 |
| e3-still | `running` | 1 318 912 (29,91 s) | 0,02682 | 0,2324 | **0** | 0 | 0 | 0 |
| e4-still | `running` | 1 318 912 (29,91 s) | 0,02800 | 0,2303 | **0** | 0 | 0 | 0 |

Pegelverlauf in 0,5-s-Fenstern: `pegel-rein.json` (und `pegel.json` fuer `roh/`).
`BRAUHAUS.ton.geraten()` war nach **jeder** der vierundzwanzig Aufnahmen leer —
kein einziger Ruf ist in den Notfallkasten gefallen.

### Gegenprobe auf den eigenen Messfehler

Ein `ScriptProcessor` auf dem Hauptfaden kann Puffer verlieren und Knackser
erzeugen, die ein Ohr als Anachronismus meldet. Nachgezaehlt: 1 318 912 / 4096
= **322,0 Puffer, kein einziger verloren**. Die groessten Abtastwertspruenge
liegen nicht auf den Pufferkanten (Rest 3590 / 3366 / 1660 / 2549 von 4096),
und die mittleren Kantenspruenge liegen in derselben Groessenordnung wie die
in der Puffermitte (e1-gespielt 0,0263 gegen 0,0166). Die Transienten sind
Spielton, kein Messfehler.

---

## 2 — DAS FREMDE OHR

Die acht Aufnahmen wurden auf neutrale Namen `probe-01..08` gemischt
(`mische.py`), der Schluessel versiegelt und erst nach dem Einlauf aller
Antworten geoeffnet. `hoerer.py` schickt nur Frage und Bytes hinaus — der
Dateiname geht nicht mit (nachgesehen in `hoere()`).

### Ohr 1 — das Werkzeug des Hauses (`hoerer.py`, `gemini-3.1-pro-preview`)

| Probe | Quelle | Soll | Art | gehoert | sicher | Urteil |
|---|---|---|---|---|---|---|
| probe-01 | e2-still | 2 | still | 2 | 100 | RICHTIG |
| probe-02 | e3-still | 3 | still | 3 | 90 | RICHTIG |
| probe-03 | e4-gespielt | 4 | gespielt | 4 | 85 | RICHTIG |
| probe-04 | e1-gespielt | 1 | gespielt | 1 | 95 | RICHTIG |
| probe-05 | e4-still | 4 | still | 4 | 100 | RICHTIG |
| probe-06 | e3-gespielt | 3 | gespielt | 3 | 100 | RICHTIG |
| probe-07 | e1-still | 1 | still | 1 | 95 | RICHTIG |
| probe-08 | e2-gespielt | 2 | gespielt | 2 | 80 | RICHTIG |

**gespielt 4/4 · still 4/4.** Mittlere Sicherheit: still 97,5 — gespielt 90,0.

### Ohr 2 auf dem SAUBEREN Satz (`rein/`, neu gemischt, Saat 77) — die
### entscheidende Vorlage, weil der Vorlaufschwanz hier fehlt

| Probe | Quelle | Soll | Art | gehoert | sicher | Urteil |
|---|---|---|---|---|---|---|
| probe-01 | e4-gespielt | 4 | gespielt | **3** | 95 | **FALSCH** |
| probe-03 | e1-gespielt | 1 | gespielt | 1 | 90 | RICHTIG |
| probe-07 | e2-gespielt | 2 | gespielt | 2 | 85 | RICHTIG |
| probe-08 | e3-gespielt | 3 | gespielt | 3 | 95 | RICHTIG |
| probe-02 | e2-still | 2 | still | 2 | 90 | RICHTIG |
| probe-04 | e4-still | 4 | still | 4 | 100 | RICHTIG |
| probe-05 | e3-still | 3 | still | 3 | 90 | RICHTIG |
| probe-06 | e1-still | 1 | still | 1 | 85 | RICHTIG |

**gespielt 3/4 · still 4/4.**

Und hier steht die Begruendung des Ohres fuer die **stillen** Aufnahmen, in
denen das Spiel nachweislich **null** Klaenge ausgeloest hat — viermal von vier
ist es die **Musik des Bettes**:

- e1-still → *"an der einfachen, akustischen Holzfloete (Blockfloete)"*
- e2-still → *"an der gezupften Lautenmusik im Stil der Renaissance"*
- e3-still → *"eine typische Blaskapelle mit Ventilblechblasinstrumenten wie
  Tuba und Trompeten, wie sie im 19. Jahrhundert populaer wurden"*
- e4-still → *"die typische 70er-Jahre-Funk/Jazz-Musik mit E-Bass, Schlagzeug
  und E-Orgel"*

Das ist der Kern des Urteils, im Wortlaut des Ohres: **die Zeit steht in der
Musik, nicht im Hof und nicht im Vorgang.**

### Ohr 2 auf dem ersten Satz (`roh/`), drei Durchgaenge, 24 Messungen

| Probe | Quelle | Soll | Art | drei Durchgaenge | Treffer |
|---|---|---|---|---|---|
| probe-01 | e2-still | 2 | still | 2 · 2 · 2 | 3/3 |
| probe-02 | e3-still | 3 | still | 3 · 3 · 3 | 3/3 |
| probe-03 | e4-gespielt | 4 | gespielt | 4 · 4 · **3** | 2/3 |
| probe-04 | e1-gespielt | 1 | gespielt | **3 · 3 · 3** | **0/3** |
| probe-05 | e4-still | 4 | still | 4 · 4 · 4 | 3/3 |
| probe-06 | e3-gespielt | 3 | gespielt | 3 · 3 · 3 | 3/3 |
| probe-07 | e1-still | 1 | still | **3** · 1 · **2** | 1/3 |
| probe-08 | e2-gespielt | 2 | gespielt | **3 · 3 · 3** | **0/3** |

**gespielt 5/12 (42 %) · still 10/12 (83 %).**

Der Fehlgriff ist nicht zufaellig, sondern gerichtet: **1350 gespielt und 1600
gespielt werden je dreimal von drei als 1884 gehoert.** Dasselbe hatte Ohr 1
beim allerersten, noch ungemischten Anlauf ueber `e1-gespielt.wav` gesagt —
*"Epoche 3, sicher 85: das deutliche Zischen und Stampfen einer industriellen
Dampfmaschine"*. Auf dem sauberen Satz kippt es in dieselbe Richtung, nur bei
einer anderen Epoche: **1970 gespielt wird als 1884 gehoert**, begruendet mit
*"laute Dampfpfeifen, zischender Wasserdampf von Dampfmaschinen"*. Wohin die
Verwechslung geht, schwankt; **dass** sie zu 1884 geht, tut sie nicht.

### ALLE EPOCHENMESSUNGEN ZUSAMMEN (beide Ohren, beide Saetze, 40 Messungen)

| Vorlage | still | gespielt |
|---|---|---|
| Ohr 1, `roh/`, 1 Durchgang | 4/4 | 4/4 |
| Ohr 2, `roh/`, 3 Durchgaenge | 10/12 | 5/12 |
| Ohr 2, `rein/`, 1 Durchgang | 4/4 | 3/4 |
| **Summe** | **18/20 = 90 %** | **12/20 = 60 %** |

Die stille Aufnahme wird in jeder einzelnen Zeile mindestens so oft richtig
erkannt wie die gespielte, insgesamt um dreissig Punkte oefter.

### PRUEFUNG DES WERKZEUGS `werkbank/hoerer.py` — drei Befunde

1. **Die Verweigerungssperre greift nicht.** Auf `probe-04` kam zurueck:
   *"Aufgrund der fehlenden Audiodaten kann der genaue Vorgang nicht ermittelt
   werden … Es wurden lediglich leere Zeitstempel von 00:00 bis 00:30 …
   uebergeben"* — bei `"epoche": 1, "sicher": 0`. Die Regex `VERWEIGERT`
   (hoerer.py, Z. 103–107) trifft weder *"fehlende Audiodaten"* noch *"leere
   Zeitstempel"*; sie verlangt `keine audio|ton|klang|datei` oder `es wurde
   keine`. Das Nichthoeren wurde als **Messung Epoche 1** gebucht. Bei
   `--erwartet 1` waere daraus ein **BESTANDEN** geworden fuer eine Messung,
   die nie stattgefunden hat — derselbe Fehlertyp, den der Kommentar darueber
   fuer geheilt erklaert, nur mit anderem Wortlaut. Nachgefragt lieferte
   dieselbe Datei zweimal Epoche 1 (sicher 95 / 90).
2. **`--blind` mischt nicht.** `soll = (i + 1) if a.blind else a.erwartet`
   (Z. 232) setzt nur voraus, dass die Dateien in der Reihenfolge 1,2,3,4
   uebergeben werden. Blind ist daran das Modell (das nie einen Dateinamen
   sieht), nicht die Vorlage. Wer dem Namen glaubt und ungemischt aufruft,
   misst trotzdem — aber der Pruefer kennt die Reihenfolge. Gemischt wurde
   hier deshalb selbst.
3. **Keine Wartezeit zwischen den Wiederholungen.** `for versuch in range(3)`
   (Z. 253) feuert drei Versuche binnen einer Sekunde. Bei einer
   Minutensperre (HTTP 429) sind damit alle drei Versuche verbraucht, und die
   Datei faellt als "dreimal unlesbar" aus, obwohl das Tageskontingent steht.
   Am 3. August hat mich das 22 von 24 Messungen gekostet.

Gedreht wurde an `hoerer.py` **nichts** (ZUSTAENDIGKEIT 16). Die drei Befunde
stehen hier; das eigene Geraet steht danebengebaut in `frage-vorgang.py`.

---

## 3 — DIE ENTSCHEIDENDE GEGENPROBE: SPIEL ODER KULISSE?

Dieselbe Strecke, derselbe Stand (Woche 26 nach 25 Vorlaufklicks), einmal mit
Zuegen und einmal mit **keinem einzigen Klick** — nachgewiesen null Klaenge im
Mitschnitt.

| Epoche | still rms | gespielt rms | still/gespielt | Hub still (p90/p10) | Hub gespielt |
|---|---|---|---|---|---|
| 1 (1350) | 0,03118 | 0,11116 | **28,0 %** | 3,83 | 8,09 |
| 2 (1600) | 0,03019 | 0,11845 | **25,5 %** | 3,93 | 11,76 |
| 3 (1884) | 0,02681 | 0,16898 | **15,9 %** | 2,57 | 18,02 |
| 4 (1970) | 0,02799 | 0,16227 | **17,2 %** | 3,74 | 15,03 |

Der Pegel spricht **klar fuer** den Bauer: Spielen ist das 3,6- bis 6,3-fache
von Nichtstun, und der Hub der gespielten Strecke liegt in jeder Epoche zwei-
bis siebenfach ueber dem der stillen. Ein Dauerteppich traegt die Epoche
pegelmaessig nicht. Das war die offene Auflage aus der Vorwelle, und **am Pegel
ist sie erledigt** — deutlicher, als meine erste, verunreinigte Messung
(32,9–39,6 %) es aussehen liess.

**Die Epochenerkennung spricht dagegen, und sie ist die Latte.** Aus den
stillen Aufnahmen — kein Vorgang, nur Bett und Hof — faellt die Epoche ueber
alle Messungen **18 von 20 (90 %)** richtig, gegen **12 von 20 (60 %)** aus den
gespielten. Beide Ohren begruenden die stille Aufnahme mit der Kulisse, und
weit ueberwiegend mit der **Musik**:

- e1-still → *"an der einfachen, akustischen Holzfloete (Blockfloete) und dem
  Fehlen jeglicher mechanischer Hintergrundgeraeusche"*
- e2-still → *"an der gezupften Lautenmusik im Stil der Renaissance"* /
  *"das Cembalo als Instrument und der musikalische Stil"*
- e3-still → *"eine typische Blaskapelle mit Ventilblechblasinstrumenten wie
  Tuba und Trompeten, wie sie im 19. Jahrhundert populaer wurden"*
- e4-still → *"die typische 70er-Jahre-Funk/Jazz-Musik mit E-Bass, Schlagzeug
  und E-Orgel"*

Damit ist die Latte formal bestanden und der Sache nach nicht: das Ohr erkennt
die Zeit an der Kulisse — genauer, an der Bettmusik.

Verschaerfend: die stille Aufnahme ist **oefter richtig** als die gespielte, in
jeder einzelnen Vorlage. Die Vorgaenge tragen die Epoche nicht nur nicht — sie
stoeren sie.

---

## 4 — WELCHE VORGAENGE SIND HOERBAR?

### Was das Spiel wirklich ausloest (eigener Mitschnitt, Sekunde der Aufnahme)

Sekunden aus dem sauberen Satz `rein/`, gezaehlt am eigenen Mitschnitt:

| Epoche | FUHRE | SUD | MICHAELITAG | GEGENZUG (`nachbar:true`) |
|---|---|---|---|---|
| 1 (1350) | 2× `fuhre:abfahrt:ochse` 3,55 / 11,15 | 4× (`sud:pfanne` 3,55/11,15/21,13 · `sud:anstich` 6,10) | 1× **15,11** | 4× (`werben` 7,65 · `entreissen` 13,62/27,65 · `fuhre` 29,18) |
| 2 (1600) | 2× `fuhre:abfahrt:pferd` 3,54 / 11,09 | 3× (`sud:anstellen` 3,54 · `sud:pfanne` 3,54/21,14) | 1× **15,08** | 2× (`fuhre` 21,14 · `entreissen` 22,70) |
| 3 (1884) | 2× `fuhre:abfahrt:waggon` 3,55 / 11,14 | 6× (`anstich` 6,08 · `anstellen` 11,14/13,57 · `pfanne` 11,14/13,57 · `ausschlagen` 15,13) | 1× **15,13** | 3× (`bauen` 3,55 · `aufstocken` 7,59 · `unglueck` 11,14) |
| 4 (1970) | 2× `fuhre:abfahrt:lastzug` 3,54 / 11,16 | 3× (`sud:anstich` 6,13 · `sud:pfanne` 11,16/21,18) | 1× **15,20** | 13× (`werben` 7,63 · `uebernahme` 11,16 · `binden`/`werben`/`aufstocken` 13,56 · …) |

**Alle vier Vorgaenge feuern in allen vier Epochen.** Nichts bleibt stumm im
Sinne von "wird nie gerufen".

### Antwortet der Klang auf den Zug — und zur richtigen Sekunde?

Dafuer eigene Einzelschlag-Aufnahmen: 14 s, davon 6 s Ruhe, **genau ein Klick**,
dann Ruhe (`einzel/`, `einzelschlag.json`). Gemessen an der Wellenform in
25-ms-Fenstern, Einsatz = erstes Fenster ueber dem Dreifachen des Ruhemedians
der 4 s davor.

| Aufnahme | Zug | Ruf im Log nach | **akustischer Einsatz nach** | Hub gegen Ruhe |
|---|---|---|---|---|
| e1-abfahrt | `fuhre:abschicken` | 0,040 s | 0,130 s | 7,5× |
| e2-abfahrt | `fuhre:abschicken` | 0,060 s | 0,100 s | 9,3× |
| e3-abfahrt | `fuhre:abschicken` | 0,060 s | 0,070 s | 13,3× |
| e4-abfahrt | `fuhre:abschicken` | 0,060 s | 0,155 s | 9,6× |
| e2-weiter | `weiter` | 0,050 s | 0,080 s | 8,0× |
| e3-weiter | `weiter` | 0,060 s | 0,070 s | 9,4× |
| e4-weiter | `weiter` | 0,050 s | 0,205 s | 8,0× |
| e1-weiter | `weiter` | 0,060 s | **0,925 s** | 5,7× |

Sieben von acht Zuegen werden binnen **0,07–0,21 s** hoerbar beantwortet — das
ist zur richtigen Sekunde. Der Ausreisser ist der Wochenknopf in **1350**
(`uhr:woche` → `woche1.mp3`, die Holzklapper): der Ruf steht nach 60 ms, der
hoerbare Ausschlag erst nach 0,93 s. Der haeufigste Ton des ganzen Spiels ist
ausgerechnet in der ersten Epoche der leiseste.

### Blender — raet das Ohr?

Eigenes Geraet, `frage-vorgang.py`: vier echte Vorgaenge (a–d) und vier
**Blender** (e–h), die es im KATALOG nirgends gibt — Gewitter, Kirchenorgel,
anlegendes Schiff, zerspringendes Glas.

| Aufnahme | FUHRE | SUD | MICHAELI | GEGENZUG | Blender bejaht | Jahr geschaetzt |
|---|---|---|---|---|---|---|
| e4-gespielt | ja (3 s) | ja (0 s) | ja (5 s) | ja (17 s) | **0 von 4** | 1950 |
| e1-gespielt | ja (2 s) | ja (18 s) | ja (**15 s**) | **NEIN** | **0 von 4** | 1500 |

Das Ohr raet nicht: **kein einziger Blender wurde bejaht**, alle vier mit
Sicherheit 90–100 verneint. Damit zaehlt auch sein Nein.

Und es sagt Nein zum **GEGENZUG in 1350** — obwohl dort vier Nachbarzuege mit
`nachbar:true` stehen (7,57 / 13,64 / 27,57 / 29,29 s). Der Michaelitag dagegen
wird in 1350 auf **Sekunde 15** gehoert, wo er in der vorgelegten Aufnahme
(`roh/e1-gespielt`) tatsaechlich bei 15,18 s steht: punktgenau. Die uebrigen Sekundenangaben des Ohres sind unzuverlaessig
(Sud in 1350 bei 18 s statt 3,64/6,05/11,14/21,23) — als Nachweis taugt die
Sekunde nur dort, wo sie trifft, nicht als Widerlegung.

**Diese Tabelle steht auf zwei Aufnahmen, nicht auf acht.** Die uebrigen sechs
Blenderproben sind am Tageskontingent der Schnittstelle gescheitert (HTTP 429
auf vier verschiedenen Modellen), nicht am Spiel. Insbesondere fehlt die
Gegenprobe, die ich am meisten wollte: dieselbe Blenderliste ueber eine
**stille** Aufnahme, in der nachweislich **null** Vorgaenge liegen. Ohne sie
ist nicht ausgeschlossen, dass das Ohr Fuhre, Sud und Michaelitag auch dort
bejaht haette, wo es sie nicht geben kann. Auflage 4 ist deshalb bewusst
schwach formuliert.

---

## 5 — ANACHRONISMEN MIT SEKUNDE

Ungefragt gemeldet, jeweils aus der verdeckten Vorlage:

| Aufnahme | Sekunde | Was das Ohr meldet | Was dort wirklich liegt |
|---|---|---|---|
| **e4-gespielt** (1970) | **2 s** | *"8-Bit/Chiptune-Soundeffekt — ein digitaler Synthesizer-Klang aus der Aera der fruehen Videospiele (1980er)"* | 2,13–2,59 s: **zwoelf** Ausloesungen `fuhre:fass-rollen` → `fassstahl.mp3` binnen 0,46 s |
| **e4-gespielt** (1970) | **14 s** | *"Cartoon-Sprungfeder (Boing) — ein kuenstlicher, ueberzeichneter Cartoon-Soundeffekt"* | 13,60 s: vier Klaenge gleichzeitig — `woche4` (Stechuhr) + `handschlag` + `telefon` + `bau4` |
| **e2-gespielt** (1600) | durchgehend | *"ein sehr leises, bestaendiges Rauschen … wie entfernter Autoverkehr oder ein Flugzeug"* | Grundteppich `hof2`; auf dem sauberen Satz nicht wiederholt |
| **e1-gespielt** (1350) | — | *"ein kurzes, unpassendes elektronisches Piepen im Hintergrund"* (Ohr 1, erster Anlauf) | nicht auf eine Probe festgelegt; auf dem sauberen Satz nicht wiederholt |
| ~~e1-still / e2-still~~ | ~~0–2 s~~ | ~~*"Rattern eines modernen Rolltores"* / *"Motorengeraeusch aehnlich einem Hubschrauber"*~~ | **ZURUECKGEZOGEN — das war der ausklingende Vorlauf meines eigenen Pruefstands, siehe Abschnitt 1** |

Auf dem sauberen Satz (`rein/`) hat Ohr 2 bei allen acht Aufnahmen ausdruecklich
**keinen** Anachronismus gemeldet (*"nein, saemtliche Klaenge entsprechen exakt
…"*). Die verbleibenden Meldungen oben stammen aus dem ersten Satz. Der einzige
Fund, der sich auf beiden Saetzen im Mitschnitt nachweisen laesst, ist die
Stapelung.

**Der harte Fund ist der erste.** `fuhre:fuellen` (Zugschluessel, `fuhre.js:3083`)
ruft `fuelleNachDurst()` (`fuhre.js:1297`), das in einer Schleife `lade()`
(`fuhre.js:1260`) je Haus aufruft; jedes `lade()` spielt am Ende
`B.ton.spiele('fuhre:fass-rollen', …)` (`fuhre.js:1273`). Gezaehlt in meinen
Mitschnitten, groesste Haeufung derselben Probe in 0,5 s:

| Epoche | Kopien von `fuhre:fass-rollen` in 0,5 s | Datei |
|---|---|---|
| 1 (1350) | 5 | `fassholz.mp3` |
| 2 (1600) | 8 | `fassholz.mp3` |
| 3 (1884) | 10 | `fassholz.mp3` |
| 4 (1970) | **12** | `fassstahl.mp3` |

Zwoelf identische Kopien mit 40-ms-Versatz sind kein Fass, das rollt, sondern
ein Kammfilter. Das ist die Sorte Geraeusch, die es in **keiner** der vier
Epochen gab, und das blinde Ohr hat sie genau dort und nur dort gemeldet. Die
Zaehlung reproduziert sich unveraendert auf dem sauberen Satz `rein/`
(5 / 8 / 10 / 12).

---

## 6 — IST ES HEIL?

- **Alle vier Epochen laden.** `?epoche=1..4&saat=1350`, Jahr 1350 / 1600 /
  1884 / 1970 gesetzt (`BRAUHAUS.welt.zeit`, nicht `uhr.jahr`), 81 / 82 / 86 /
  81 bedienbare Zuege im Bild.
- **`BRAUHAUS.lage.length === 0`** in allen vier Epochen, und ebenso am Ende
  jeder der **vierundzwanzig** Aufnahmen (nach bis zu 39 gespielten Wochen).
- **Konsolenfehler: 0** — ueber alle vier Erkundungen und alle vierundzwanzig
  Aufnahmen, `console.error` und `pageerror` mitgeschrieben.
- **`BRAUHAUS.ton.geraten()` leer** nach jeder Aufnahme: kein Ruf faellt in den
  Ersatzkasten.
- **Ungenutzte Probe in `spiel/ton/klang/`: KEINE.** Alle 46 mp3 sind
  erreichbar — 8 als Bett/Hof, die uebrigen 38 ueber KATALOG-Eintraege, die ein
  Stueck nennt oder die ich im Lauf gehoert habe. `fabrikpfeife.mp3`, die
  frueher tote Datei, haengt jetzt an `preis:michaeli` in Epoche 3 und
  `uhr:woche` in Epoche 3.
  Kein Dateibefund, aber vermerkt: drei der 91 KATALOG-Eintraege ruft kein
  Stueck — `fuhre:listen`, `gegner:mitbieten`, `gegner:oeffnen`. Sie hinterlassen
  keine verwaiste Datei, weil ihre Proben (`papier`, `muenzen`/`kasse`) anderswo
  gebraucht werden.

---

## AUFLAGEN (im Wortlaut)

**AUFLAGE 1 — DIE ZEIT MUSS AUS DEM VORGANG KOMMEN, NICHT AUS DER BETTMUSIK.**
Aus einer Aufnahme, in der das Spiel **null** Klaenge ausloest, darf ein fremdes
Ohr die Epoche nicht mehr zuverlaessig nennen. Gemessen wird gegen den heutigen
Stand: **still 18/20 (90 %) gegen gespielt 12/20 (60 %)**. Abgenommen ist die
Auflage, wenn bei unveraendertem Verfahren die **stille** Trefferquote deutlich
unter die **gespielte** faellt und die gespielte zugleich nicht sinkt. Das Bett
ist die naechstliegende Stellschraube: **viermal von vier** hat das Ohr die
stille Aufnahme ausdruecklich am Instrument der Musik festgemacht —
*"Blockfloete"*, *"gezupfte Lautenmusik"*, *"Blaskapelle mit
Ventilblechblasinstrumenten"*, *"70er-Jahre-Funk/Jazz mit E-Bass, Schlagzeug
und E-Orgel"*. Solange vier Musikstuecke aus vier Jahrhunderten unter dem Hof
liegen, misst die Latte die Musik und nicht das Spiel.

**AUFLAGE 2 — DIE GESPIELTE STRECKE DARF NICHT NACH 1884 KLINGEN.**
Ueber beide Aufnahmesaetze faellt die Verwechslung gerichtet auf Epoche 3:
`e1-gespielt` und `e2-gespielt` je dreimal von drei (Ohr 2, Satz `roh/`) und
`e1-gespielt` einmal bei Ohr 1, begruendet mit *"Zischen und Stampfen einer
industriellen Dampfmaschine"*; auf dem sauberen Satz trifft es `e4-gespielt`,
begruendet mit *"laute Dampfpfeifen, zischender Wasserdampf von
Dampfmaschinen"*. Der Verdacht liegt auf den Werkklaengen (`sud1..sud4` an
`sud:pfanne`/`sud:anstellen`) — **nachgewiesen ist er nicht**, die
Einzelvorlage der Proben scheiterte am Kontingent. Abgenommen, wenn ueber drei
Durchgaenge je Epoche keine gespielte Aufnahme mehrheitlich nach 1884 gehoert
wird.

**AUFLAGE 3 — KEIN KAMMFILTER AUS GESTAPELTEN KOPIEN.**
`fuhre:fuellen` legt ueber `fuelleNachDurst()` → `lade()` (`fuhre.js:1297`,
`1260`, `1273`) 5 / 8 / 10 / **12** identische `fuhre:fass-rollen` binnen 0,46 s
uebereinander. Das blinde Ohr meldet das Ergebnis als *"8-Bit/Chiptune-
Soundeffekt (1980er)"* bei Sekunde 2 einer Aufnahme von 1970. Kein Name darf in
einem halben Sekundenfenster mehr als **zwei** Kopien seiner Probe erzeugen.
Abgenommen an einem Mitschnitt, nicht am Quelltext.

**AUFLAGE 4 — DER GEGENZUG IST IN 1350 NICHT ZU HOEREN.** *(schwach belegt)*
Bei vier `nachbar:true`-Zuegen im Fenster (7,57 / 13,64 / 27,57 / 29,29 s) hat
das Ohr den fremden Hof in 1350 mit Sicherheit 95 **verneint**, waehrend es in
1970 dieselbe Frage mit Sicherheit 90 bejaht — und dabei nachweislich nicht
raet, denn alle vier Blender hat es verneint. Der Befund steht auf **einer**
Aufnahme je Epoche und ohne die stille Gegenprobe; er ist ein Hinweis, kein
Beweis. Abgenommen, wenn das Ohr den Gegenzug in allen vier Epochen bejaht und
ihn zugleich in der stillen Aufnahme derselben Epoche verneint.

**AUFLAGE 5 — DER WOCHENKNOPF VON 1350 IST ZU LEISE.**
`weiter` → `uhr:woche` → `woche1.mp3`: Ruf nach 60 ms, hoerbarer Ausschlag erst
nach **0,925 s** (alle anderen sieben Einzelschlaege: 0,07–0,21 s). Der
haeufigste Ton des Spiels antwortet in der ersten Epoche als einziger nicht
sofort. Abgenommen am Einzelschlag: Einsatz unter 0,3 s.

**AUFLAGE 6 — DIE VERWEIGERUNGSSPERRE IN `werkbank/hoerer.py` HAELT NICHT.**
*(Richtet sich an den Halter des Messgeraets, nicht an DEN KLANG.)* Die Regex
`VERWEIGERT` hat *"Aufgrund der fehlenden Audiodaten … leere Zeitstempel"* bei
`sicher: 0` durchgelassen und als Epoche 1 gebucht; mit `--erwartet 1` waere
daraus ein **BESTANDEN** ohne Messung geworden. Dazu fehlt den drei
Wiederholungen (Z. 253) jede Wartezeit, sodass eine Minutensperre alle drei
Versuche auf einmal verbrennt. Geaendert habe ich nichts.

---

## SPERRLISTE (im Wortlaut)

1. **Kein Klang, den es in der Epoche nicht gab — auch keiner, der erst aus der
   Mischung entsteht.** Zwoelf gestapelte Kopien einer Fassprobe sind ein
   solcher Klang, obwohl jede Kopie fuer sich richtig ist.
2. **Das Bett darf die Epoche nicht allein tragen.** Ein Stand, bei dem die
   stille Aufnahme haeufiger richtig erkannt wird als die gespielte, gilt als
   durchgefallen, gleich wie hoch die Gesamtquote ist.
3. **Am Messgeraet anderer wird nicht gedreht** (ZUSTAENDIGKEIT 16).
   `werkbank/hoerer.py` ist bei dieser Pruefung Zeichen fuer Zeichen unveraendert
   geblieben; Befunde darueber stehen als Auflage 6, nicht als Aenderung.
4. **Keine Zahl aus dem Offline-Renderer des Spiels** (`ton.wav()`,
   `ton.rendere()`) darf als Beleg fuer "es klingt" gelten. Nur ein Mitschnitt
   am lebenden Ausgang zaehlt.
5. **Keine Epochenzahl aus einer einzigen Vorlage.** Dieselbe Datei
   (`e1-gespielt.wav`) hat beim selben Ohr einmal Epoche 3 und danach zweimal
   Epoche 1 ergeben. Unter drei Durchgaengen je Datei ist die Latte nicht
   gemessen.
6. **Eine Verweigerung oder ein HTTP 429 ist kein Urteil ueber das Spiel.**
   Ausgefallene Messungen werden gezaehlt und genannt, nie als Fehlgriff des
   Spiels gebucht.

---

## WAS ICH NICHT GEMESSEN HABE

- Die Blender- und Vorgangsprobe (`frage-vorgang.py`) liegt fuer **2 der 8**
  Aufnahmen vor (e4-gespielt, e1-gespielt, beide aus `roh/`). Die uebrigen
  sechs sind am Tageskontingent der Schnittstelle gescheitert (HTTP 429,
  `generate_requests_per_model_per_day, limit: 250`, auf vier Modellen), nicht
  am Spiel. Die Aussagen zu GEGENZUG-in-1350 und zu den Blendern stehen damit
  auf zwei Aufnahmen und sind entsprechend schwaecher als die Epochenzahlen.
- **Die wichtigste fehlende Gegenprobe:** die Blenderliste ueber eine
  **stille** Aufnahme. Nur sie haette gezeigt, ob das Ohr Vorgaenge auch dort
  bejaht, wo nachweislich keine sind. Vorbereitet und gestartet
  (`vorgang-rein/`), am Kontingent gescheitert.
- Ohr 1 (`gemini-3.1-pro-preview`, das Modell von `hoerer.py`) hat nur **einen**
  Durchgang und nur ueber den ersten, verunreinigten Satz. Der saubere Satz ist
  ausschliesslich von Ohr 2 (`gemini-3.6-flash`) gehoert worden. Beide sind
  Gemini-Modelle; ein andersartiges Ohr gab es nicht.
- Dieselbe Datei hat beim selben Ohr unterschiedliche Antworten gegeben
  (`e1-gespielt`: einmal Epoche 3, danach zweimal Epoche 1). Vier der 40
  Epochenmessungen stehen auf Einzeldurchgaengen.
- Nur eine Saat (`saat=1350`) und ein Zugplan. Ob ein anderer Zufallsstand
  andere Vorgaenge in das Fenster legt, ist offen.
- Ob `sud1.mp3`/`sud2.mp3` wirklich die Ursache der Verwechslung mit 1884 sind,
  ist **nicht** nachgewiesen — die Einzelvorlage der verdaechtigen Proben
  scheiterte am Kontingent. Auflage 2 nennt sie als Verdacht, nicht als Befund.
