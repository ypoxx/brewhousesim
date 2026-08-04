# DER KLANG — Welle 6, Nacharbeit an der letzten offenen Auflage

**Auflage, gegen die gearbeitet wird:** AUFLAGE 4 aus `welle5-der-klang-urteil.md` —
*DER GEGENZUG IST NICHT ZU HOEREN.*

> Abgenommen ist die Auflage, wenn das Ohr den Gegenzug in ALLEN VIER Epochen
> bejaht UND ihn zugleich in der STILLEN Aufnahme derselben Epoche verneint.

**Stand zu Beginn** (eigene Messung der Vorrunde, `welle5-der-klang-nacharbeit.md`
Abschnitt 7): 1350 bejaht, 1600 / 1884 / 1970 verneinen. **1 von 4.**
Stille Gegenprobe: 0 von 32 Vorgangsfragen bejaht.

**Nicht brechen, was haelt** (dritte Latte, Verfahren des Kritikers):
still 2/12 (17 %) · gespielt 7/12 (58 %). Die stille Quote darf nicht steigen,
die gespielte nicht sinken.

**Gemessener Commit:** `0058dd1` ("Welle 6 gestartet"), eingefroren nach
`/tmp/messstand/0058dd1`, **eigener Hafen 8941**, gesetzt mit
`werkbank/schuss/aufsicht/messstand.sh 0058dd1 8941` (das Skript prueft die
ausgelieferte Fassung selbst — Marke `.messstand-marke` geantwortet: `0058dd1`).
In diesen Stand wird waehrend der Arbeit **nur** gespiegelt, was mir gehoert:
`spiel/kern/ton.js`, `spiel/stuecke/klang.js`, `spiel/ton/**`
(`werkbank/schuss/klang-w6/spiegle.sh`). Alles andere bleibt auf dem Commit —
am Arbeitsbaum prueft gleichzeitig ein Kritiker DER SUD.

**Belege:** `werkbank/schuss/klang-w6/`

---

## 1 — ZUERST DIE PROBEN, EINZELN, WIE IN DER VORRUNDE

Der Grund, warum die Latte drei Wellen lang nicht trug, lag nicht in der
Mischung, sondern in den Dateien. Also zuerst wieder: **jede Probe des
Gegenzugs einzeln einem fremden Ohr vorgelegt**, ohne Dateinamen und ohne
Absicht (`werkbank/schuss/klang/beschreibe.py`, unveraendert, Ohr
`gemini-3.6-flash`).

Vorgelegt wurden alle dreizehn Proben, die an einem `nachbar: true`-Eintrag
haengen, dazu die beiden Dateien des NACHBARHOF-Zeichens selbst.

| Probe | wofuer sie steht | was das fremde Ohr wirklich hoert | Urteil |
|---|---|---|---|
| `bau1` | NACHBARHOF-Zeichen 1350–1884, `gegner:bauen` | *"Rhythmisches Saegen, Feilen oder Schmirgeln von Hand · schweres menschliches Atmen"* | passt |
| `bau4` | dasselbe in 1970 | *"Elektrisches Motorengeraeusch / Werkzeuggeraeusch · metallisches Schlagen"* | passt |
| **`nachbar1`** | **das Tor drueben, 1350–1884** (`gegner:abloesen`, `gegner:uebernahme`) | ***"TROETE / TRILLERPFEIFE (Sekunde 0–1) · Tuerschliessen"*, Zeit: 20./21. Jh.** | **FALSCH** |
| `nachbar4` | dasselbe in 1970 | *"metallisches Aechzen und Quietschen einer schweren Tuer · lautes Klacken und Einrasten eines Riegels"* | passt |
| `unruhe` | Unruhe drueben (`entreissen`, `schluckt`) | *"Schritte auf Kies und Laub · gedaempfte menschliche Stimmen / Rufen im Hintergrund"* | passt |
| **`brand`** | **Brand / Unglueck drueben** (`gegner:unglueck`, `gegner:ende`) | ***"Kampfgeschrei · Klirren von Waffen · Schmerzenstoehnen"* — eine SCHLACHT, kein Feuer** | **FALSCH** |
| `karren` | Werben, Angebot 1350–1884 | *"Holzratschen · Klackern · hoelzernes Anschlagsgeraeusch"* | passt |
| `telefon` | dasselbe in 1970 | *"Telefonklingeln"* | passt |
| **`handschlag`** | **Bund geschlossen** (`gegner:binden`, `preis:handschlag`) | ***"Umblaettern einer Buchseite · Papierrascheln"*** | **FALSCH** |
| `siegel` | Macht, Festlegung 1350–1884 | *"Schritte auf Holz · Klopfen / Schliessen eines Holzgegenstandes"* | schwach |
| `maschine` | dasselbe in 1970 | *"Tippgeraeusche einer Schreibmaschine · Glockensignal · Wagenruecklauf"* | passt (1970) |
| **`muenzen`** | **Geld, Rohstoff 1350–1884** | ***"Rasselgeraeusch (Rassel / Maraca) · Holzklacken"* — keine Muenze** | **FALSCH** |
| `kasse` | dasselbe in 1970 | *"Registrierkasse mit Kassenklingel"* | passt |

Rohantworten: `werkbank/schuss/klang-w6/antworten/proben-1.txt`, `proben-2.txt`.

### Der Fund, der die Auflage erklaert

`nachbar1.mp3` ist eine **Troete**. Und in `kern/ton.js` steht seit Welle 5,
warum das teuer war — der Bauer der Vorrunde hat genau diese Probe als
NACHBARHOF-Zeichen erprobt und wieder verworfen:

> *"Zweiter Anlauf: ein eigenes Tor, das drueben auf- und zugeht. Eindeutig
> … und das Ohr hat es NICHT als Gegenzug gemeldet, sondern als abfahrende
> Fuhre, denn ein Tor mit einem Karren dahinter ist eine Abfahrt."*

Eine Troete vor einem zuschlagenden Tor ist fuer ein Ohr keine Abfahrt aus
Versehen — sie ist eine **Hupe an einem Fahrzeug**. Das Zeichen, das den
Gegenzug haette tragen sollen, ist an einer kaputten Datei gescheitert und
danach durch ein schwaecheres ersetzt worden (Saegen, das der eigene Hof
genauso macht). Das ist derselbe Fehlertyp wie `abfahrt1` = Wasser und
`glocke` = Roehrenglocken in der Vorrunde.

*(Fortsetzung folgt — dieser Bericht wird laufend geschrieben.)*

### Was mit den falschen Proben geschehen ist

Jede neue Probe ist **vor** dem Einbau wieder einzeln vorgelegt worden. Das ist
nicht glatt gegangen, und die Fehlschlaege stehen hier, weil sie zur Messung
gehoeren (`erzeuge.py` traegt jeden Anlauf mit dem Satz, der ihn verurteilt hat;
alle Zwischenstaende liegen unter `alt/`).

| Probe | Anlaeufe | was am Ende drin ist | Stand |
|---|---|---|---|
| `nachbar1` | 1 | *"Quietschen und Knarren einer Holztuer · Zuschlagen einer schweren Holztuer"*, zeitlos, kein Anachronismus | **ersetzt** |
| `brand` | 2 | *"Knall · Knistern und Prasseln von Feuer und brennendem Holz"*, zeitlos, kein Anachronismus (vorher: Schlachtgetuemmel mit Waffen und Schmerzenslauten) | **ersetzt** |
| `handschlag` | 4 | *"Haendeklatschen"* (vorher: Umblaettern einer Buchseite — also dieselbe Auskunft wie `papier.mp3`) | **ersetzt** |
| `drueben1` | 4 | *"Maennliche Sprechstimmen · Schritte auf Kies · Wind"* — **neu, das Zeichen** | **neu** |
| `drueben4` | 4 | *"Rhythmisches metallisches Klopfen · maennliche sprechende Stimmen"* — **neu, das Zeichen** | **neu** |
| `siegel` | 2 | *nichts* — der Versuch kam als *"Ballhupe · mechanische Schreibmaschine, 20. Jahrhundert"* zurueck und war damit **schlechter** als die alte Probe. **Alte Probe zurueckgeholt.** | unveraendert |
| `muenzen` | 4 | *nichts* — viermal kam *"Rassel / Schellen / Percussion-Shaker"* zurueck, auch als nur noch eine einzelne Muenze fiel. **Alte Probe zurueckgeholt.** | unveraendert |

Zwei Fehlschlaege, und sie stehen so im Bericht, wie sie sind: `muenzen.mp3`
enthaelt weiterhin keine Muenze, und `siegel.mp3` kein Siegel. Beide sind
zeitlos und fuehren keinen Anachronismus ein; beide sagen aber weniger, als
ihr Name verspricht. Das ist die naechste Baustelle und nicht diese.

**Ein Werkzeugfehler, der mich einen guten Anlauf gekostet hat:** `erzeuge.py`
sicherte anfangs nur den allerersten Stand nach `alt/` und ueberschrieb danach
jeden Anlauf mit dem naechsten. Beim dritten Versuch an `drueben4` war damit
der zweite weg — ausgerechnet der einzige mit Stimmen. Das Werkzeug hebt jetzt
jeden Anlauf einzeln auf (`alt/<name>.NN.mp3`).

---

## 2 — WAS DAS ZEICHEN WIRKLICH GETAN HAT (gezaehlt, nicht vermutet)

Vor jeder Aenderung: acht Aufnahmen am eingefrorenen Stand mit dem
**unveraenderten** Geraet des Kritikers (`klang-blind-w5/aufnahme.mjs`,
`RUHE=8`, `VORLAUF=26`, sein Zugplan, `saat=1350`). Dann am Mitschnitt
gezaehlt, wie oft das NACHBARHOF-Zeichen ueberhaupt anschlaegt — die
`nachbar: true`-Namen und die Sperre `NACHBAR_PAUSE` liest
`werkbank/schuss/klang-w6/nachbarzahl.py` aus `kern/ton.js` selbst aus, damit
niemand sie abschreibt.

| Epoche | Nachbarzuege im Fenster | Sekunden | **Zeichen (Sperre 4,5 s)** | Ohr in Welle 5 |
|---|---|---|---|---|
| 1 (1350) | 4 | 7,55 · 13,55 · 27,63 · 29,10 | **3** | **bejaht** |
| 2 (1600) | 2 | 21,08 · 22,56 | **1** | verneint |
| 3 (1884) | 3 | 3,54 · 7,56 · 11,06 | **2** | verneint |
| 4 (1970) | 13 | 7,56 … 29,15 | **4** | verneint |
| alle stillen | **0** | — | **0** | verneint (0 von 32) |

Zwei Dinge stehen damit fest:

* **In 1600 handelt der Nachbar im ganzen Messfenster genau zweimal, 1,5 s
  auseinander, bei Sekunde 21.** Die Sperre macht daraus **ein** Zeichen. Ein
  einziger Ausschlag von drei Sekunden in einer halben Minute — das ist die
  schwaerzeste der vier Epochen, und keine Sperre der Welt hilft dort. Dort
  muss das eine Zeichen tragen.
* **In 1970 schlaegt das Zeichen viermal an und wird trotzdem verneint.** Die
  Zahl allein ist es also nicht. Was 1350 von den anderen dreien unterscheidet,
  ist der Hof: `ZIEL_HOF` steht dort auf 0,034 gegen 0,048: ein Fuenftel
  weniger Deckel ueber dem Zeichen. Ein Zeichen, das nur in der leisesten
  Epoche durchkommt, ist kein Zeichen, sondern ein Zufall.

---

## 3 — WAS ICH GEAENDERT HABE (`spiel/kern/ton.js`, sonst nichts)

| | vorher | nachher | warum |
|---|---|---|---|
| `NACHBAR_DATEI` | `altNeu('bau1','bau4')` | `altNeu('drueben1','drueben4')` | dieselbe Datei wie `stadt:bau`, `preis:fertig`, `sud:bau`, `name:anschlagen` — zwei Hoefe mit demselben Geraeusch sind ein Hof |
| `NACHBAR_DAUER` | 3,2 s | 3,4 s | |
| `NACHBAR_PAUSE` | 4,5 s | 3,4 s | laesst den mittleren Nachbarzug von 1884 (7,56 s) durch; bleibt gleich der Dauer, damit sich zwei Zeichen nie ueberlagern |
| Pegel des Zeichens | `angleich(buf, 0.21)` | `0.27` | siehe oben: es kam nur in der leisesten Epoche durch |
| Wand des Zeichens | Tiefpass 1800 Hz | **900 Hz** | die Latte fragt woertlich nach *"gedaempft wie durch eine Wand"*; ausserdem bleibt von Sprache unter 900 Hz die Melodie und nicht das Wort (siehe unten) |
| Wand der uebrigen Nachbarklaenge (`fern`) | Tiefpass 2000 Hz | **1500 Hz** | auch sie sollen von drueben kommen — aber nicht so tief wie das Zeichen, dort steht der Vorgang selbst und der muss erkennbar bleiben |
| Vorladen | — | `ladeStill(NACHBAR_DATEI)` beim Legen des Bettes | `nachbarhof()` gibt auf, wenn der Puffer fehlt; solange das Zeichen auf `bau1` lief, war die Datei laengst geladen. `drueben1` ruft **kein** anderer Eintrag — ohne diese Zeile waere der erste Gegenzug jeder Partie stumm |
| Offline-Renderer | — | `NACHBAR_DATEI` in `noetig` | im Renderer war der Gegenzug **immer** stumm; gemessen wird dort nichts (Sperrliste 4), aber wer ihn zum Anhoeren benutzt, hoerte den halben Vorgang |

**Der eine Punkt, an dem ich ein Risiko eingehe und ihn deshalb hier nenne:**
`drueben1.mp3` traegt Stimmen — das ist sein Zweck, denn der eigene Hof hat
keine. Einzeln vorgelegt hat das fremde Ohr daran genau eine Sache geruegt:
*"Neuenglische Sprache (modernes Englisch) ab Sekunde 0"*. Eine erkennbare
Sprache waere in 1350 ein Anachronismus. Die Wand bei 900 Hz soll aus dem Wort
ein Murmeln machen; **ob sie das tut, entscheidet nicht mein Urteil, sondern
die Aufnahme** — die Vorgangsprobe fragt in Teil 2 ausdruecklich nach
Anachronismen mit Sekunde, und die Epochenfrage nach dem, was stoert. Beides
steht weiter unten.

*(Fortsetzung folgt.)*

---

## 4 — STAND A: DAS ZEICHEN SCHLAEGT OEFTER AN — UND WIRD LEISER

Acht frische Aufnahmen mit demselben Geraet, derselben Umgebung und demselben
Zugplan (`/tmp/klang6/a`). Zuerst die Zaehlung:

| Epoche | Nachbarzuege | Zeichen vorher (4,5 s) | **Zeichen jetzt (3,4 s)** |
|---|---|---|---|
| 1 (1350) | 4 | 3 | 3 |
| 2 (1600) | 2 | 1 | **1** |
| 3 (1884) | 3 | 2 | **3** |
| 4 (1970) | 13 | 4 | 4 |
| alle vier stillen | **0** | **0** | **0** |

Und dann der Befund, der mir nicht gefaellt und der deshalb hier steht:
**das Zeichen ist LEISER geworden, nicht lauter.** Gemessen an der Wellenform
(`werkbank/schuss/klang-w6/zeichenhub.py`, Effektivwert der 3,4 s, in denen
das Zeichen liegt):

| Aufnahme | Sekunde | rms im Zeichen vorher | jetzt | |
|---|---|---|---|---|
| e1-gespielt | 7,6 | 0,1191 | **0,0656** | 0,55× |
| e1-gespielt | 27,6 | 0,1194 | **0,0574** | 0,48× |
| e2-gespielt | 21,1 | 0,1407 | **0,1047** | 0,74× |
| e4-gespielt | 27,6 | 0,1749 | **0,1679** | 0,96× |

Der Grund ist der Tiefpass: was ein Filter bei 900 Hz wegnimmt statt bei
1800 Hz, nimmt er auch dem Pegel. Die Anhebung von 0,21 auf 0,27 hat das nicht
aufgewogen — sie war ein Sechstel, der Filter kostet die Haelfte. Der Pegel des
ganzen Bandes hat sich dabei kaum bewegt (gespielt 0,153 → 0,144 in 1350,
0,170 → 0,173 in 1970), die stillen Aufnahmen liegen unveraendert bei 0,013.

**Ob das reicht, entscheidet nicht meine Rechnung, sondern das Ohr.** Die
Vorgangsprobe laeuft; ihr Ergebnis steht unten, und danach richtet sich, ob
der Pegel nachgezogen wird.

### Stand A, gemessen: **1 von 4** — unveraendert

`werkbank/schuss/klang-w6/antworten/vorgang-a.json`, Werkzeug
`klang-blind-w5/frage-vorgang.py` **unveraendert**, Ohr `gemini-3.1-pro-preview`
(dasselbe wie in der Vorrunde und beim Kritiker).

| Aufnahme | FUHRE | SUD | MICHAELI | **GEGENZUG** | Blender bejaht |
|---|---|---|---|---|---|
| e1-gespielt | ja (2 s, 100) | nein | ja (15 s, 100) | **ja (8 s, sicher 100)** | 0 von 4 |
| e2-gespielt | ja (9 s, 100) | nein | ja (7 s, 100) | **nein** | 0 von 4 |
| e3-gespielt | ja (2 s, 95) | ja (6 s, 95) | ja (5 s, 100) | **nein** | 2 von 4 |
| e4-gespielt | ja (4 s, 100) | nein | ja (7 s, 100) | **nein** | 0 von 4 |
| e1-still | nein | nein | nein | **nein** | 0 von 4 |
| e2-still | nein | nein | nein | **nein** | 0 von 4 |
| e3-still | nein | nein | nein | **nein** | 0 von 4 |
| e4-still | nein | nein | nein | **nein** | 0 von 4 |

**GEGENZUG gespielt 1 von 4 · still 0 von 4. Vorgangsfragen in den stillen
Aufnahmen: 0 von 32.** Die zweite Haelfte der Auflage — *"und ihn zugleich in
der stillen Aufnahme derselben Epoche verneint"* — haelt also weiterhin
vollstaendig. Die erste nicht.

Zwei Dinge sind trotzdem besser geworden und werden hier genannt, weil sie die
Richtung stuetzen:

* In 1350 steht das Ja jetzt bei **Sekunde 8 mit Sicherheit 100** (Vorrunde:
  Sekunde 10, Sicherheit 85). Im Mitschnitt liegt das Zeichen bei **7,6 s** —
  das Ohr trifft die Sekunde, an der es wirklich steht.
* **Kein einziger Anachronismus im Zusammenhang mit dem Zeichen.** Die
  Befuerchtung, das "moderne Englisch" aus `drueben1` koenne durch die Wand
  kommen, hat sich nicht bestaetigt: gemeldet wurde ueber alle acht Aufnahmen
  ein einziger Anachronismus, *"Pfeife einer Dampflokomotive"* bei Sekunde 14
  in **1884** — dort steht die `fabrikpfeife`, und in 1884 ist eine Dampfpfeife
  kein Anachronismus. Die Wand traegt.
* Kein Blender ausser den zwei bekannten in 1884 (Gewitter, Kirchenorgel) —
  dieselben zwei wie in der Vorrunde.

**Die Deutung, und sie ist die Rechnung des vorigen Abschnitts:** das Zeichen
war leiser als vorher, nicht lauter. Also wird der Pegel nachgezogen.

---

## 5 — STAND B, UND DER FEHLER, DEN ER AUFGEDECKT HAT

Stand B: Pegel des Zeichens `angleich(buf, 0.55)` statt 0,27, Wand zurueck auf
1100 Hz, Dauer 4,2 s, eigenes Werk tritt fuer die ganze Dauer auf 0,30 zurueck.

**Ergebnis: wieder 1 von 4 — und diesmal eine ANDERE Epoche.**

| Aufnahme | FUHRE | SUD | MICHAELI | **GEGENZUG** | Blender |
|---|---|---|---|---|---|
| e1-gespielt (1350) | ja | ja | ja | **nein** | 0 von 4 |
| e2-gespielt (1600) | ja | nein | ja | **ja** | 0 von 4 |
| e3-gespielt (1884) | nein | nein | ja | **nein** | 2 von 4 |
| e4-gespielt (1970) | ja | nein | nein | **nein** | 0 von 4 |

**1600 hat den Gegenzug zum ersten Mal ueberhaupt bejaht** — die Epoche mit
dem einen einzigen Zeichen im ganzen Fenster. Dafuer ist 1350 gekippt, und in
1884 und 1970 sind auch die uebrigen Vorgaenge eingebrochen (1884: nur noch
MICHAELI, 1970: nur noch FUHRE). Das ist kein Fortschritt, das ist Rauschen mit
Kollateralschaden.

### Der Fehler: das Zeichen war in drei von vier Epochen fast stumm

Der Pegel im Mitschnitt hat sich naemlich gar nicht so verhalten, wie die
Zahl im Quelltext es versprach: 1970 sprang von 0,17 auf **0,235** im
Gesamteffektivwert (die Bremse hat gearbeitet), waehrend 1350, 1600 und 1884
sich um weniger als ein Zehntel bewegten. Das war nicht zu erklaeren — bis ich
die Proben selbst im Browser nachgemessen habe
(`werkbank/schuss/klang-w6/lautheit.mjs`, decodiert im Spiel, nicht geschaetzt):

| Probe | Effektivwert roh | Spitze | Faktor, den 0,55 braeuchte |
|---|---|---|---|
| **`drueben1`** (1350–1884) | **0,00722** | **0,048** | **76×** |
| `drueben4` (1970) | 0,14058 | 1,000 | 3,9× |
| `bau1` (zum Vergleich) | 0,12806 | 1,000 | 4,3× |
| `unruhe` | 0,03580 | 0,747 | 15,4× |
| `hof1` | 0,05145 | 0,942 | 10,7× |

**`drueben1.mp3` kam mit einem Zwanzigstel des Pegels von `drueben4` aus dem
Erzeuger.** Und `angleich()` — die Funktion, mit der jede Probe auf einen
festen Effektivwert gezogen wird — **kappt den Faktor bei 6**:

```js
return Math.max(0.15, Math.min(6, ziel / l));
```

Das Zeichen stand damit in **1350, 1600 und 1884 bei 0,043** und in **1970 bei
0,55**: der Faktor **dreizehn** zwischen zwei Epochen bei **demselben**
Zeichen. Im Quelltext stand 0,55, im Ton kamen 0,04 an, und keine der beiden
Zahlen war irgendwo abzulesen.

Das erklaert beide Staende auf einmal:

* **Stand A** — das Ohr hat in 1350 den Gegenzug bei **Sekunde 8** bejaht. Bei
  7,55 s steht dort `gegner:werben` (der Karren des Nachbarn hinter der Wand);
  das Zeichen selbst war zu leise, um irgendetwas beizutragen. Das Ja galt dem
  Zug, nicht dem Zeichen.
* **Stand B** — in 1970 ist das Zeichen mit 0,55 in die Bremse gefahren und hat
  den halben Hof mitgenommen; dort ist der Michaelitag verschwunden, den das
  Ohr sonst **immer** trifft.

Ich habe zwei Staende lang an Filter, Sperre und Dauer gedreht, waehrend eine
Datei schlicht stumm war. Das ist derselbe Fehlertyp wie die Troete in
`nachbar1.mp3`, nur eine Ebene tiefer: nicht der falsche INHALT, sondern der
nicht angekommene PEGEL — und beides sieht man dem Quelltext nicht an.

### Was daraus in `kern/ton.js` geworden ist

Neben `angleich()` steht jetzt `hebe(buf, ziel, deckel)`. Es zieht auf den
Zielwert, aber **nie ueber die Spitze der Probe hinaus**:

```js
return Math.max(0.15, Math.min(ziel / l, (deckel || 0.9) / s));
```

`drueben1` bekommt damit den Faktor 19,2 (Spitze 0,048 → 0,92) und landet bei
einem Effektivwert um **0,138**; `drueben4` bekommt 0,92 und landet bei
**0,129**. **Dasselbe Zeichen ist in allen vier Epochen gleich laut** — genau
das, was der Kommentar an dieser Stelle seit Welle 5 verlangt und was seither
nicht stimmte. Was dann noch fehlt, fehlt in der Datei und nicht im Regler.

`angleich()` selbst ist unangetastet geblieben: fuer die Schleifen, deren
Rohpegel dicht beieinander liegen, ist die Kappung bei 6 richtig.

### Stand B in Zahlen, vollstaendig

`antworten/vorgang-b.json`:

| Aufnahme | FUHRE | SUD | MICHAELI | **GEGENZUG** | Blender | Anachronismen |
|---|---|---|---|---|---|---|
| e1-gespielt | ja (2 s, 90) | ja (6 s, 100) | ja (14 s, 100) | **nein** | 0 | 21 s: *"Klicken einer Computermaus"* |
| e2-gespielt | ja (1 s, 90) | nein | ja (7 s, 95) | **ja (24 s, sicher 90)** | 0 | — |
| e3-gespielt | nein | nein | ja (21 s, 100) | **nein** | 2 | 14 s: *"modernes Zughorn"* |
| e4-gespielt | ja (0 s, 100) | nein | **nein** | **nein** | 0 | vier Meldungen, darunter *"Funk/Pop-Hintergrundmusik"* |
| e1..e4-still | nein | nein | nein | **nein** | 1 (Gewitter in 1600) | — |

**GEGENZUG gespielt 1 von 4 · still 0 von 4 · Vorgangsfragen in den stillen
Aufnahmen 1 von 32.** Auch der Rest ist schlechter: in 1970 ist der
Michaelitag verschwunden, den das Ohr sonst in jeder Messung dieses Berichts
und der Vorrunde getroffen hat, und dort stehen vier Anachronismus-Meldungen
statt keiner. Genau das erwartet man, wenn ein Klang in die Bremse faehrt und
den halben Hof mitnimmt.

**Stand B wird deshalb nicht ausgeliefert.** Sein Wert liegt darin, dass er den
Pegelfehler sichtbar gemacht hat.

---

## 6 — STAND C: WAS AUS BEIDEN FEHLERN GELERNT IST

Stand C ist der ausgelieferte Stand. Er nimmt von B nur das mit, was gemessen
getragen hat, und dreht zurueck, was geschadet hat:

| | Stand A | Stand B | **Stand C** | warum |
|---|---|---|---|---|
| Pegel des Zeichens | `angleich(., 0.27)` → in 1350–1884 **0,043** (Kappung), in 1970 0,27 | `angleich(., 0.55)` → 0,043 / **0,55** | **`hebe(., 0.30, 0.92)`** → **0,139 / 0,129** | gleich laut in allen vier Epochen, und niemals in die Bremse |
| Wand des Zeichens | 900 Hz | 1100 Hz | **1100 Hz** | 900 Hz hat die Haelfte des Pegels gekostet |
| Dauer | 3,4 s | 4,2 s | **4,2 s** | in 1600 gibt es nur ein einziges Zeichen im Fenster |
| eigenes Werk duckt | 0,42 fuer 3,3 s | 0,30 fuer **4,1 s** | **0,30 fuer 1,4 s** | die lange Senke hat in 1884 FUHRE und SUD mitgerissen |
| Bett/Hof ducken | 0,28 / 0,34 fuer 3,3 s | 0,28 / 0,34 fuer 4,1 s | **0,34 / 0,38 fuer 2,0 s** | Bett und Hof tragen die Epoche; vier lange Senken in 1970 waeren die dritte Latte gewesen |
| **Vorhalt** | — | — | **0,35 s** | neu, siehe unten |
| Einsatz des Zeichens | 0,22 s Rampe | 0,22 s | **0,08 s** | wer ein Loch macht, darf nicht hineinschleichen |

### Der Vorhalt — abgeschrieben beim Michaelitag

Von den vier Vorgaengen, nach denen die Latte fragt, trifft das fremde Ohr
ueber alle Messungen dieses Berichts zwei fast immer (FUHRE, MICHAELI) und zwei
selten (SUD, GEGENZUG). Der Michaelitag ist nicht deshalb sicher, weil er
lauter waere — er ist sicher, weil vor ihm eine **Zaesur** steht: alles andere
tritt zurueck, dann kommt das Zeichen. Ein Ereignis in einem vollen Band ist
kein Ereignis.

Der Gegenzug bekommt dieselbe Behandlung, nur kleiner: der eigene Hof geht
**0,35 s vor** dem Zeichen herunter, und erst in dieses Loch hinein kommt der
Nachbar. In diesen 0,35 s steht der Zug des Nachbarn selbst allein da — er
laeuft auf dem `fern`-Bus, und `senke()` kennt nur Bett, Hof und Werk. Erst
hoert man, **dass** drueben etwas ist, dann **was**.

### Der Pegel steht jetzt, und zwar in allen vier Epochen gleich

Effektivwert in den Sekunden, in denen das Zeichen liegt
(`zeichenhub.py`, an der Wellenform des Mitschnitts):

| Aufnahme | Sekunde | vorher | Stand A | Stand B | **Stand C** |
|---|---|---|---|---|---|
| e1 (1350) | 7,6 | 0,1191 | 0,0656 | 0,0678 | **0,1393** |
| e1 (1350) | 27,6 | 0,1194 | 0,0574 | 0,0577 | **0,0885** |
| e2 (1600) | 21,1 | 0,1407 | 0,1047 | 0,0968 | **0,1301** |
| e3 (1884) | 11,1 | 0,1278 | 0,1563 | 0,1719 | **0,2081** |
| e4 (1970) | 27,6 | 0,1749 | 0,1679 | 0,2745 | **0,1193** |

Und der Gesamtpegel der halben Minute ist wieder da, wo er war — die Bremse
arbeitet nicht mehr:

| | vorher | Stand B | **Stand C** |
|---|---|---|---|
| e1-gespielt | 0,1535 | 0,1390 | **0,1533** |
| e2-gespielt | 0,1172 | 0,1199 | **0,1237** |
| e3-gespielt | 0,1592 | 0,1502 | **0,1672** |
| e4-gespielt | 0,1705 | **0,2349** | **0,1698** |
| alle vier stillen | 0,0135–0,0136 | 0,0128–0,0151 | **0,0127–0,0147** |

In allen acht Aufnahmen jedes Standes: `BRAUHAUS.lage` leer, `geraten()` leer,
**null** Konsolenfehler.

---

## 7 — DIE DRITTE LATTE, HEUTE NEU GEMESSEN — AUCH AM AUSGANGSSTAND

Bevor die Zahlen von Stand C kommen, eine, die niemand bestellt hat und die
alles andere einordnet. Ich habe das Verfahren des Kritikers **am
unveraenderten Ausgangsstand** wiederholt — dieselben acht Aufnahmen
(`/tmp/klang6/vorher`), gemischt mit seinem `mische.py` unter neuer Saat, drei
Durchgaenge je Datei durch `hoerer.hoere()` ohne `--erwartet`, Ohr
`gemini-3.6-flash`:

| Stand | still | gespielt |
|---|---|---|
| Ausgangsstand, Zahl der Vorrunde (3. August) | 2/12 = **17 %** | 7/12 = **58 %** |
| **Ausgangsstand, heute neu gemessen (derselbe Code)** | **4/12 = 33 %** | **9/12 = 75 %** |

**Derselbe Ton, dasselbe Werkzeug, dasselbe Verfahren, zwei Ziffern
Unterschied in beide Richtungen.** Das ist keine Aenderung am Spiel, das ist
die Streuung des Messverfahrens: zwei Treffer bei zwoelf Messungen sind
17 Prozentpunkte. Wer eine Bewegung von 58 auf 75 oder von 17 auf 33 als
Wirkung liest, liest Rauschen.

Die Zahlen von Stand C werden deshalb gegen **beide** Bezugswerte gestellt, und
ich sage vorher, welcher der strengere ist: der von heute.

---

## 8 — WAS DAS MESSGERAET UEBER SICH SELBST VERRAET

Drei Befunde ueber die Vorgangsfrage, alle aus den Zahlen dieser Runde. Sie
sind keine Ausrede — die Auflage ist nicht erfuellt, und das steht unten so da.
Aber wer die naechste Runde plant, sollte sie kennen.

### 8.1 In 1884 raet das Ohr, und zwar in JEDER Messung

`frage-vorgang.py` legt vier **Blender** vor — Gewitter, Kirchenorgel,
anlegendes Schiff, zerspringendes Glas —, die kein einziger KATALOG-Eintrag
bedient. Der Kritiker schreibt dazu: *"Wer die Blender bejaht, raet."*

| Stand | e1g | e2g | **e3g (1884)** | e4g | die vier stillen |
|---|---|---|---|---|---|
| Vorrunde (Welle 5) | 0 | 0 | **2** | 0 | 0 · 0 · 0 · 0 |
| Stand A | 0 | 0 | **2** | 0 | 0 · 0 · 0 · 0 |
| Stand B | 0 | 0 | **2** | 0 | 0 · **1** · 0 · 0 |
| Stand C | 0 | 1 | **2** | ? | ? |

**Viermal von vier bejaht das Ohr in der gespielten Aufnahme von 1884 zwei
Blender** — jedes Mal Gewitter und Kirchenorgel, jedes Mal in genau dieser
Aufnahme und in keiner anderen. Nach der Regel des Kritikers zaehlt dort auch
sein **Nein** nicht: ein Zeuge, der zwei von vier erfundenen Vorgaengen
bejaht, ist fuer diese Aufnahme kein Zeuge. 1884 ist damit in **keinem** der
vier Staende messbar gewesen, und das war es auch schon in seinem eigenen
Urteil.

Woher die beiden Blender kommen, ist erklaerbar und in der Vorrunde schon
erklaert worden: bei Sekunde 14 liegt in 1884 das Bett, *"eine typische
Blaskapelle mit Ventilblechblasinstrumenten"* — das ist die "Kirchenorgel".
Das "zerspringende Glas" liegt bei Sekunde 3, wo `abfahrt3` metallisch am
Waggon schabt.

### 8.2 Dieselbe Aufnahme, dieselbe Frage, verschiedene Antworten

Der Kritiker hat fuer die EPOCHENfrage selbst eine Sperrliste geschrieben:

> *"Keine Epochenzahl aus einer einzigen Vorlage. Dieselbe Datei
> (`e1-gespielt.wav`) hat beim selben Ohr einmal Epoche 3 und danach zweimal
> Epoche 1 ergeben. Unter drei Durchgaengen je Datei ist die Latte nicht
> gemessen."*

Fuer die **Vorgangsfrage**, an der Auflage 4 haengt, ist diese Regel nie
angewandt worden — weder in seinem Urteil noch in der Nacharbeit der Vorrunde
noch in den Staenden A und B dieses Berichts. Jede Zeile jeder dieser Tabellen
steht auf **einer** Vorlage.

Dass das zu wenig ist, ist in dieser Runde gemessen. Der Vorgang **SUD** in
1350, ueber drei Staende hinweg, deren Unterschiede den Sud gar nicht
beruehren:

| | Vorrunde | Stand A | Stand B | Stand C |
|---|---|---|---|---|
| SUD in e1-gespielt | **ja** (19 s) | **nein** | **ja** (6 s) | **ja** |
| MICHAELI in e4-gespielt | ja (15 s) | ja (7 s) | **nein** | ? |

Der Michaelitag von 1970 ist der lauteste Einzelklang des Spiels (`laut: 1.5`,
mit eigener Zaesur) — und in Stand B war er fuer dasselbe Ohr nicht da.

### 8.3 Was daraus folgt

Eine Abnahme, die **vier Ja in einem einzigen Durchgang** verlangt, verlangt
von einem Messgeraet mit dieser Streuung mehr, als es hergibt: wenn jede
einzelne Antwort mit einer gewissen Wahrscheinlichkeit kippt, faellt die
Wahrscheinlichkeit fuer vier richtige Antworten in Folge steil ab, ganz ohne
dass sich am Ton etwas aendert. Deshalb ist Stand C zusaetzlich in **drei
Durchgaengen** gemessen worden — dieselbe Regel, die der Kritiker fuer die
Epochenfrage aufgestellt hat, auf seine Vorgangsfrage angewandt.

---

## 9 — STAND C, ERSTER DURCHGANG

`antworten/vorgang-c.json`:

| Aufnahme | FUHRE | SUD | MICHAELI | **GEGENZUG** | Blender |
|---|---|---|---|---|---|
| e1-gespielt (1350) | ja | **ja** | ja | **ja** | 0 von 4 |
| e2-gespielt (1600) | ja | nein | ja | **nein** | 1 von 4 |
| e3-gespielt (1884) | nein | nein | nein | **nein** | **2 von 4** |
| e4-gespielt (1970) | ja | nein | ja | **nein** | 0 von 4 |

**1350 ist die einzige Aufnahme in diesem ganzen Bericht — und in der
Vorrunde —, in der das Ohr ALLE VIER Vorgaenge bejaht und KEINEN Blender.**
Das ist der beste Einzelbefund, den dieses Stueck je bekommen hat. Er steht auf
einer Aufnahme.

1884 ist wieder unbrauchbar (zwei Blender, kein einziger echter Vorgang
bejaht — das Ohr hat dort in dieser Messung nichts erkannt und zwei erfundene
Dinge gehoert). 1600 und 1970 bejahen FUHRE und MICHAELI und verneinen den
Gegenzug.
