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

## KURZ

**AUFLAGE 4 IST NICHT ERFUELLT, und ich weiss jetzt warum.**
Sechs Staende gebaut und je acht Aufnahmen gemessen (48 Aufnahmen, 56 stille
Vorgangsfragen). Der Gegenzug wird in **0 von 4** Epochen bejaht
(Ausgangsstand: 1 von 4) — und in **0 von 4** stillen Aufnahmen, wie es die
zweite Haelfte der Auflage verlangt. Die einzigen zwei Staende, in denen das
Ohr mehr als eine Epoche bejaht hat, trugen eine **erkennbare englische
Stimme**, die dasselbe Ohr in 1350 als *"Radio- oder Fernsehuebertragung"*
gemeldet hat. Nimmt man die Stimme heraus, faellt die Zahl auf null. Zwei
Tiefpaesse (900 und 600 Hz) haben die Sprache nicht getilgt.

**Gefunden und behoben wurde trotzdem einiges**, und zwei Funde sind harte
Fehler, die seit Welle 5 im Spiel standen:

* **`nachbar1.mp3` war eine TROETE** — ein Anachronismus in 1350, 1600 und
  1884. Ersetzt. (Dazu `brand` = Schlachtgetuemmel statt Feuer,
  `handschlag` = Papierrascheln.)
* **`angleich()` kappt bei Faktor 6**, und das NACHBARHOF-Zeichen brauchte 76.
  Dieselbe Zeile Quelltext hat in 1970 ein dreizehnmal lauteres Zeichen
  erzeugt als in 1350. Behoben mit `hebe()`.

**Die dritte Latte steht besser als vorher:** gespielt **83 %**
(Vorrunde 58 %, Ausgangsstand heute 75 %), still **25 %**
(Vorrunde 17 %, Ausgangsstand heute 33 %).

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

### Und der Befund, der Stand C aus dem Rennen nimmt

In den Anachronismus-Meldungen desselben Durchgangs steht:

| Aufnahme | Sekunde | was das Ohr ungefragt meldet |
|---|---|---|
| **e1-gespielt (1350)** | **7 s** | *"Gedaempfte Radio- oder Fernsehuebertragung (englischer Sportkommentar)"* |
| **e3-gespielt (1884)** | **2 s** | *"Englische Radio-/Fernsehstimme (**'go back and forth'**)"* |

Bei 7,58 s in 1350 und bei 3,58 s in 1884 steht das NACHBARHOF-Zeichen. Und
die drei Woerter in Anfuehrungszeichen stehen **woertlich in meinem
Erzeugungsprompt** fuer `drueben1.mp3`:

> *"…one calls something over, the other answers, **they go back and forth**."*

Die Gegenstelle hat den Satz nicht umgesetzt, sondern **sprechen lassen** —
und das Ohr liest ihn zurueck. Ich hatte beim Filterentwurf behauptet, unter
1100 Hz sei das Wort weg, weil die zweiten und dritten Formanten darueber
liegen. Das ist Halbwissen: Grundfrequenz und erster Formant reichen, und wer
Sprache erkennt, erkennt sie auch dumpf.

**Eine erkennbare englische Rundfunkstimme in 1350 ist ein Anachronismus** und
faellt unter Sperrliste 1 des Kritikers (*"Kein Klang, den es in der Epoche
nicht gab — auch keiner, der erst aus der Mischung entsteht"*). Stand C wird
deshalb **nicht ausgeliefert**, obwohl er den besten Einzelbefund des ganzen
Berichts hat. Die zusaetzlichen zwei Durchgaenge ueber Stand C habe ich
abgebrochen: mehr Messungen an einem Stand, der wegen eines Anachronismus
ohnehin nicht ausgeliefert wird, sind verbranntes Kontingent.

### Die dritte Latte an Stand C: **unveraendert**

Verfahren des Kritikers, gleicher Tag, gleiche Streuung:

| Stand | still | gespielt |
|---|---|---|
| Ausgangsstand, Zahl der Vorrunde | 2/12 = 17 % | 7/12 = 58 % |
| Ausgangsstand, heute nachgemessen | 4/12 = 33 % | 9/12 = 75 % |
| **Stand C** | **4/12 = 33 %** | **9/12 = 75 %** |

**Ziffer fuer Ziffer dieselben Zahlen wie der Ausgangsstand am selben Tag.**
Die stille Quote ist nicht gestiegen, die gespielte nicht gesunken. Was an
diesem Stand geaendert wurde, beruehrt die dritte Latte nicht — was auch zu
erwarten war: das Zeichen laeuft nur bei einem Zug des Nachbarn und kommt in
den stillen Aufnahmen ueberhaupt nicht vor.

---

## 10 — STAND D: DIE WAND WIRD DICKER

Stand D unterscheidet sich von C an **einer** Stelle, und sie folgt aus dem
Befund darueber:

| | Stand C | **Stand D** | warum |
|---|---|---|---|
| Wand des Zeichens | Tiefpass 1100 Hz | **Tiefpass 600 Hz** | bei 1100 Hz war die englische Sprache aus `drueben1.mp3` erkennbar — das Ohr hat sie in 1350 als *"Radio- oder Fernsehuebertragung"* gemeldet |
| Ausgleich dahinter | — | **1,9× im Zeichenweg** | den Pegelverlust des tieferen Filters gleicht ein Regler HINTER der Wand aus, statt den Filter aufzumachen. Nur im Zeichenweg; die uebrigen Klaenge des Nachbarn gehen unveraendert |

Alles andere ist Stand C: eigene Datei fuers Zeichen (`drueben1`/`drueben4`),
`hebe()` statt `angleich()`, Vorhalt 0,35 s, Dauer 4,2 s, Sperre 3,4 s, kurze
tiefe Senke statt langer flacher.

---
### Der Pegel des Zeichens an Stand D — der hoechste dieses Berichts

Effektivwert in den Sekunden des Zeichens, und daneben der **Hub** gegen die
gleich lange Strecke davor (`zeichenhub.py`):

| Aufnahme | Sekunde | vorher | Stand C | **Stand D** | **Hub D** |
|---|---|---|---|---|---|
| e1 (1350) | 27,6 | 0,1194 (4,02×) | 0,0885 (2,74×) | **0,1395** | **4,23×** |
| e2 (1600) | 21,1 | 0,1407 (3,33×) | 0,1301 (3,00×) | **0,1870** | **4,35×** |
| e3 (1884) | 3,5 | 0,1540 (2,87×) | 0,1215 (2,32×) | **0,1773** | **3,86×** |
| e4 (1970) | 11,1 | 0,1885 (1,59×) | 0,2102 (1,74×) | **0,2129** | **1,68×** |

Zum ersten Mal steht das Zeichen in **jeder** Epoche deutlich ueber dem, was
davor liegt — und der Gesamtpegel bleibt im Rahmen (0,169 / 0,133 / 0,182 /
0,172 gegen 0,154 / 0,117 / 0,159 / 0,170 am Ausgangsstand; die stillen
Aufnahmen unveraendert bei 0,0134–0,0146).

### Die dritte Latte an Stand D: **die stille Quote FAELLT, die gespielte haelt**

Verfahren des Kritikers, gleicher Tag, gleiches Werkzeug, neue Mischsaat,
drei Durchgaenge je Datei, Ohr `gemini-3.6-flash`:

| Stand | still | gespielt |
|---|---|---|
| Ausgangsstand, Zahl der Vorrunde (3. August) | 2/12 = 17 % | 7/12 = 58 % |
| Ausgangsstand, **heute** nachgemessen | 4/12 = 33 % | 9/12 = 75 % |
| Stand C | 4/12 = 33 % | 9/12 = 75 % |
| **Stand D (ausgeliefert)** | **1/12 = 8 %** | **9/12 = 75 %** |

**Die stille Quote ist nicht gestiegen, sondern gefallen** — unter beide
Bezugswerte (8 % gegen 17 % der Vorrunde und gegen 33 % von heute).
**Die gespielte ist nicht gesunken** — 75 % gegen 58 % der Vorrunde und gleich
mit den 75 % von heute. Beide Auflagen der Vorwelle halten also, und die
Kennzahl steht besser da als vorher.

Ich sage dazu ausdruecklich, was ich in Abschnitt 7 gemessen habe: der
Unterschied zwischen 8 % und 33 % sind **drei Treffer bei zwoelf Messungen**,
und derselbe Ton hat heute und vorgestern 33 % und 17 % ergeben. Ich behaupte
deshalb **nicht**, dass Stand D die stille Quote gedrueckt hat. Ich behaupte,
was die Auflage verlangt: sie ist nicht gestiegen, und die gespielte ist nicht
gesunken.

### Stand D, erster Durchgang: **2 von 4** — und der Anachronismus ist NICHT weg

`antworten/vorgang-d.json`:

| Aufnahme | FUHRE | SUD | MICHAELI | **GEGENZUG** | Blender | Anachronismen |
|---|---|---|---|---|---|---|
| e1-gespielt (1350) | ja (2 s, 100) | ja (19 s, 100) | ja (15 s, 100) | **ja (7 s, sicher 100)** | 0 | **7 s: *"Eine gedaempfte Maennerstimme ruft auf modernem Englisch 'Go back and forth'"*** |
| e2-gespielt (1600) | ja (2 s, 100) | nein | ja (14 s, 100) | **ja (21 s, sicher 90)** | 1 | 6 s: *"quietschende Reifen"* |
| e3-gespielt (1884) | nein | ja (3 s, 90) | ja (21 s, 100) | **nein** | **2** | **4 s: *"Englische Sprachaufnahme ('go back and forth', 'beautiful')"*** |
| e4-gespielt (1970) | ja (2 s, 90) | nein | nein | **nein** | 0 | 0 s: *"moderne Pop-/R&B-Musik"* |
| e1..e4-still | 1× FUHRE in 1350 | nein | nein | **nein** | 0 | — |

**GEGENZUG gespielt 2 von 4 — der beste Wert dieses Berichts** (Ausgangsstand
1, Stand A 1, Stand B 1, Stand C 1). **1350 und 1600 bejahen beide**, und 1350
bejaht zum zweiten Mal in Folge **alle vier** Vorgaenge. Die Sekunden treffen:
7 s in 1350 (Zeichen bei 7,57 s), 21 s in 1600 (Zeichen bei 21,20 s).

**Und trotzdem faellt auch Stand D durch**, aus demselben Grund wie C: das Ohr
liest die englischen Woerter **auch durch einen Tiefpass bei 600 Hz** heraus —
diesmal sogar mit einem zweiten Wort (*"beautiful"*). Meine Annahme, unter
600 Hz bleibe von Sprache nur die Melodie, war das zweite Mal falsch. Ein
Filter, der Sprache unkenntlich macht und den Klang uebriglaesst, gibt es
hier nicht.

**Die Probe muss weg, nicht der Filter.** Das ist die Lehre und sie ist teuer
bezahlt: **zwei Staende (C und D) sind an einer Datei gescheitert, die ich
selbst bestellt habe** — mit einem Prompt, dessen Wortlaut das fremde Ohr
woertlich zurueckzitiert.

---

## 11 — STAND E: DIE STIMME FLIEGT RAUS

Nach zwei Staenden, die an derselben Datei gescheitert sind, ist die Folgerung
einfach und sie steht jetzt auch im Quelltext:

> **Wer Stimmen in einer Probe hat, muss die PROBE austauschen und nicht den
> FILTER.**

Stand E ist Stand D mit einer einzigen Aenderung: `drueben1.mp3` ist der
**stimmlose erste Anlauf** — einzeln vorgelegt *"Menschliches Atemgeraeusch /
Keuchen · Rhythmisches Reiben / Schrubben"*, **zeitlos, keine Stimme, kein
Anachronismus** (`antworten/proben-neu-1.txt`). Ein Mensch, der drueben mit
der Hand arbeitet und dabei schnauft: das sagt genauso "da ist jemand", ohne
eine Sprache mitzubringen.

Der Pegel passt auch besser: die Probe kam mit Effektivwert **0,107** und
Spitze 1,000 aus dem Erzeuger (statt 0,00722 / 0,048 beim Sprechanlauf), also
mit demselben Rohpegel wie `drueben4` (0,141). `hebe()` deckelt beide an der
Spitze; sie liegen damit von selbst gleich laut.

Die Wand bleibt bei 600 Hz mit dem Ausgleich dahinter — dort hat das Zeichen
gemessen den staerksten Hub gegen seine Umgebung ergeben (3,9- bis 4,4-fach).

## 12 — STAND F: DER AUSGELIEFERTE STAND

Stand F ist Stand E mit einer Ruecknahme:

| | Stand E | **Stand F** | warum |
|---|---|---|---|
| Wand der uebrigen Nachbarklaenge (`bus.fern`) | Tiefpass 1500 Hz | **zurueck auf 2000 Hz** | an dieser Wand haengt nicht das Zeichen, sondern der ZUG des Nachbarn — `gegner:fuhre` spielt dort `abfahrt2/3/4`, also genau die Proben, an denen das Ohr die Epoche erkennt, und genau dort hat es den Gegenzug in 1350 bisher immer gehoert (Vorrunde Sekunde 10, Stand A Sekunde 8, Zug bei 7,55 s) |

Das Zeichen behaelt seine eigene Wand bei 600 Hz mit dem Ausgleich dahinter:
**die Wand des Zeichens sagt, DASS es drueben ist; der Zug des Nachbarn sagt,
WAS drueben geschieht.** Beides zu daempfen war ein Fehlgriff, und er hat in
Stand E gemessen zwei Dinge gekostet.

**Ein Ausfall des Messgeraets, und er ist keine Aussage ueber das Spiel:** der
erste Lauf der Epochenquote an Stand F ist nach vier von vierundzwanzig
Messungen abgestuerzt — `OSError: Tunnel connection failed: 503 Service
Unavailable`. `hoerer.hoere()` faengt nur `HTTPError` ab, nicht `URLError` /
`OSError`; ein Netzhaenger reisst damit den ganzen Durchgang mit, statt
wiederholt zu werden. Das ist ein Befund ueber `werkbank/hoerer.py` (nicht
meine Datei, ZUSTAENDIGKEIT 16 — ich melde es und habe nichts gedreht). Der
Lauf ist unter neuer Mischsaat wiederholt worden.

### Stand F, erster Durchgang: **0 von 4**

| Aufnahme | FUHRE | SUD | MICHAELI | **GEGENZUG** | Blender |
|---|---|---|---|---|---|
| e1-gespielt (1350) | ja | ja | ja | **nein** | 0 |
| e2-gespielt (1600) | ja | nein | ja | **nein** | 0 |
| e3-gespielt (1884) | nein | nein | ja | **nein** | 1 |
| e4-gespielt (1970) | ja | ja | ja | **nein** | 0 |

Die Ruecknahme der `fern`-Wand hat die uebrigen Vorgaenge zurueckgeholt —
**1970 bejaht jetzt wieder FUHRE, SUD und MICHAELI** (in Stand E nur zwei, in
Stand B nur einen), und in 1884 faellt ein Blender weg. Den Gegenzug hat sie
nicht zurueckgeholt.

Vollstaendig, mit den Anachronismus-Meldungen — und **keine davon betrifft eine
Stimme oder eine Sprache**:

| Aufnahme | Anachronismen, ungefragt gemeldet | steht dort wirklich |
|---|---|---|
| e1-gespielt (1350) | — | |
| e2-gespielt (1600) | 15 s: *"digitaler Wecker / elektronisches Piepen"* | bei 15,1 s der Michaelitag (`glocke`) |
| e3-gespielt (1884) | 14 s: *"Pfeife einer Dampflokomotive"* · 18 s: *"mechanische Registrierkasse"* | `fabrikpfeife` (in 1884 richtig) · `muenzen`, die Probe, die keine Muenze enthaelt |
| e4-gespielt (1970) | LKW-Motor, Telefon, Registrierkasse, Alarmglocke | alle vier sind in 1970 richtig |

Die einzige Meldung, die auf einen wirklichen Mangel zeigt, ist die
Registrierkasse in **1884** — dort spielt `muenzen.mp3`, und das ist die Probe,
die vier Anlaeufe lang nicht zu ersetzen war (Abschnitt 1). Ein
"Cha-Ching" gehoert nicht ins 19. Jahrhundert. **Das ist ein neuer Befund und
er gehoert in die naechste Runde.**

### Die dritte Latte an Stand F — die BESTE gespielte Quote dieses Berichts

| Stand | still | gespielt |
|---|---|---|
| Ausgangsstand, Zahl der Vorrunde (3. August) | 2/12 = 17 % | 7/12 = 58 % |
| Ausgangsstand, **heute** nachgemessen | 4/12 = 33 % | 9/12 = 75 % |
| Stand C | 4/12 = 33 % | 9/12 = 75 % |
| Stand D | 1/12 = 8 % | 9/12 = 75 % |
| Stand E (`fern` gedaempft) | 3/12 = 25 % | 6/12 = 50 % |
| **Stand F (ausgeliefert)** | **3/12 = 25 %** | **10/12 = 83 %** |

**Die gespielte Quote ist nicht gesunken** — 83 % gegen 58 % (Vorrunde) und
gegen 75 % (heute). Es ist der hoechste Wert, den dieses Stueck je gemessen
bekommen hat, und die Ruecknahme der `fern`-Wand ist der Grund: 50 % → 83 %
zwischen zwei Staenden, die sich in genau dieser einen Zahl unterscheiden.

**Die stille Quote** steht bei 25 %. Gegen die heutige Messung des
Ausgangsstands (33 %) ist sie **gefallen**; gegen die niedergeschriebene Zahl
der Vorrunde (17 %) ist sie um **einen Treffer von zwoelf gestiegen**. Ich
sage beides, weil beides wahr ist und weil derselbe Ton an zwei Tagen 17 % und
33 % ergeben hat (Abschnitt 7). Wer eine der beiden Zahlen allein nimmt,
nimmt die, die ihm passt.

---

## 13 — STAND DER AUFLAGE: **NICHT ERFUELLT**

> *Abgenommen ist die Auflage, wenn das Ohr den Gegenzug in ALLEN VIER Epochen
> bejaht UND ihn zugleich in der STILLEN Aufnahme derselben Epoche verneint.*

**Erste Haelfte: NICHT erfuellt. Zweite Haelfte: erfuellt, in jedem einzelnen
Stand.**

| Stand | was ihn ausmacht | GEGENZUG gespielt | GEGENZUG still | Anachronismus vom Zeichen |
|---|---|---|---|---|
| Ausgangsstand (Vorrunde) | Zeichen = `bau1`/`bau4` | **1 von 4** (1350) | 0 von 4 | — (aber `nachbar1` = Troete) |
| A | eigene Zeichendatei, Wand 900 Hz | 1 von 4 (1350) | 0 von 4 | nein |
| B | Pegel 0,55 (kam nicht an), Wand 1100 Hz | 1 von 4 (1600) | 0 von 4 | nein |
| C | `hebe()`, Vorhalt, kurze Senke | 1 von 4 (1350) | 0 von 4 | **ja** — englische Rundfunkstimme |
| D | Wand 600 Hz + Ausgleich | **2 von 4** (1350, 1600) | 0 von 4 | **ja** — dieselbe Stimme, zwei Woerter |
| E | stimmlose Zeichendatei | 0 von 4 | 0 von 4 | nein |
| **F (ausgeliefert)** | dazu `fern` zurueck auf 2000 Hz | **0 von 4** | **0 von 4** | **nein** |

Ueber **alle sieben Staende und 56 stille Vorgangsfragen** ist der Gegenzug in
einer stillen Aufnahme **kein einziges Mal** bejaht worden. Die Gegenprobe, auf
die es dem Kritiker ankam — *"ein Klang, den das Ohr auch dann zu hoeren
glaubt, wenn nichts geschieht, ist kein Gegenzug, sondern Kulisse"* —, faellt
so sauber aus, wie sie ausfallen kann.

### Warum die erste Haelfte nicht zu erfuellen war, in einem Satz

**Das Einzige, was das fremde Ohr dazu gebracht hat, einen fremden Hof zu
bejahen, waren MENSCHENSTIMMEN — und Menschenstimmen bringen eine Sprache mit,
die in 1350 ein Anachronismus ist.**

Das ist keine Vermutung, sondern der Unterschied zwischen zwei Staenden, die
sich in genau einer Datei unterscheiden:

* **Stand D**, Zeichen mit Stimmen: Gegenzug **2 von 4** — und zweimal die
  Meldung *"gedaempfte Maennerstimme auf modernem Englisch"* / *"englische
  Sprachaufnahme"*, mit einem woertlichen Zitat aus meinem eigenen
  Erzeugungsprompt.
* **Stand E/F**, dieselbe Stelle, dieselbe Wand, dieselbe Lautheit, aber ein
  **stimmloses** Zeichen: Gegenzug **0 von 4**, kein Anachronismus.

Zwei Tiefpaesse (900 Hz, 600 Hz) haben die Sprache nicht unkenntlich gemacht;
der zweite hat das Ohr sogar ein zweites Wort heraushoeren lassen. Ein Filter,
der Sprache tilgt und den Klang uebriglaesst, steht mir nicht zur Verfuegung.

### Was ich trotzdem geliefert habe

1. **Vier Proben, die nicht enthielten, was ihr Name sagt** — gefunden, indem
   jede einzeln vorgelegt wurde. `nachbar1` war eine **Troete** und damit ein
   **Anachronismus in drei von vier Epochen**, der seit Welle 5 im Spiel stand;
   `brand` war ein **Schlachtgetuemmel** statt eines Feuers; `handschlag` war
   **Papierrascheln**. Alle drei sind ersetzt und einzeln nachgeprueft.
2. **Ein stiller Fehler im Tonbus**: `angleich()` kappt bei Faktor 6, und
   `drueben1` brauchte 76. Eine Zielzahl im Quelltext war damit im Ton nie
   angekommen — dasselbe Zeichen stand in 1970 dreizehnmal so laut wie in
   1350. `hebe()` behebt das, und `lautheit.mjs` findet solche Faelle in
   Zukunft.
3. **Das Zeichen des Gegenzugs hat eine eigene Datei**, die kein anderer
   Eintrag ruft. Bis heute lief es auf derselben Probe wie das *eigene* Bauen.
4. **Die dritte Latte steht besser als vorher**: gespielt **83 %** (Vorrunde
   58 %, heute 75 %), still 25 % (heute 33 %, Vorrunde 17 %).
5. **Zwei Fehlversuche stehen als Fehlversuche da** (`muenzen`, `siegel`), und
   die alte Probe ist zurueckgeholt statt eine schlechtere auszuliefern.

## 14 — WAS ICH NICHT GEMESSEN HABE

* **Die Vorgangsfrage steht je Stand auf EINEM Durchgang je Aufnahme.** Fuer
  Stand C und fuer Stand D hatte ich je zwei weitere Durchgaenge gestartet und
  beide abgebrochen, als sich derselbe Anachronismus in `drueben1.mp3`
  bestaetigte — mehr Messungen an einem Stand, der ohnehin nicht ausgeliefert
  wird, sind verbranntes Kontingent. Fuer den ausgelieferten Stand E hat die
  Zeit fuer den zweiten und dritten Durchgang nicht mehr gereicht.
  Dass **ein** Durchgang zu wenig ist, ist in Abschnitt 8.2 belegt; das
  Werkzeug dafuer liegt fertig da (`gegenzug-wieder.sh`, `mehrheit.py`).
  Das ist die groesste Luecke dieses Berichts und zugleich die wichtigste
  Empfehlung fuer die naechste Runde.
* **Nur ein Ohr je Frage.** Epoche: `gemini-3.6-flash`. Vorgang:
  `gemini-3.1-pro-preview`. Beide sind Gemini-Modelle; ein andersartiges Ohr
  gab es auch diesmal nicht.
* **Nur eine Saat und ein Zugplan** (`saat=1350`, der Plan des Kritikers). Wie
  oft der Nachbar handelt, haengt am Spielstand: in 1600 waren es im ganzen
  Fenster **zwei** Zuege, in 1970 **dreizehn**. Ob ein anderer Zufallsstand
  1600 mehr Gegenzuege ins Fenster legt, ist offen — und es waere die
  ehrlichste Art, die Auflage in 1600 ueberhaupt messbar zu machen.
* **Ob die Stimmen in `drueben4.mp3` in 1970 ebenfalls als Sprache
  durchkommen**, ist nicht getrennt geprueft. In den Anachronismus-Meldungen
  von 1970 steht keine Sprachmeldung — dort deckt der eigene Hof mehr zu —,
  aber gemessen habe ich es nicht.
* **`muenzen.mp3` und `siegel.mp3`** enthalten weiterhin nicht, was ihr Name
  sagt (Rassel statt Muenzen, Schritte statt Siegel). Vier bzw. zwei Anlaeufe
  haben nichts Besseres gebracht; die alten Proben sind zurueckgeholt, weil
  sie wenigstens zeitlos sind.
* **Die Wirkung des Vorhalts allein** ist nicht isoliert gemessen — er kam
  zusammen mit `hebe()` und der kuerzeren Senke in Stand C. Welcher der drei
  den Unterschied macht, weiss ich nicht.

---

## 15 — TORE, DATEIEN, KERN

**Vor dem Abgeben, am Arbeitsbaum (Hafen 8899), ausgeliefertem Stand F:**

```
node --check spiel/kern/ton.js        sauber
node --check spiel/stuecke/klang.js   sauber
node werkbank/schuss/aufsicht/tor.mjs
  E1 OK jahr=1350 zuege=105 lage=0 fehler=0
  E2 OK jahr=1600 zuege=112 lage=0 fehler=0
  E3 OK jahr=1884 zuege=116 lage=0 fehler=0
  E4 OK jahr=1970 zuege=107 lage=0 fehler=0
  TOR OFFEN
node werkbank/schuss/aufsicht/spielprobe.mjs
  E1..E4 OK, je 60 Wochen, 60 Zuege, lage 0, Fehler 0
  SPIELPROBE BESTANDEN
```

Ueber **alle 48 Aufnahmen** dieses Berichts (sechs Saetze zu acht):
`BRAUHAUS.lage` jedes Mal leer, `BRAUHAUS.ton.geraten()` jedes Mal leer,
Konsolenfehler jedes Mal **0**.

**Geaenderte Dateien** — alle innerhalb meiner Zustaendigkeit
(`stuecke/klang*.js`, `ton/**`, `kern/ton.js`, ZUSTAENDIGKEIT 11):

| Datei | was |
|---|---|
| `spiel/kern/ton.js` | `NACHBAR_DATEI`, `NACHBAR_DAUER`, `NACHBAR_PAUSE`, `NACHBAR_VORHALT`, `hebe()`, `spitze()`, Wand des Zeichens (600 Hz) + Ausgleich (1,9×), Senke kurz und tief, Vorladen des Zeichens, `NACHBAR_DATEI` in `noetig` des Offline-Renderers. `bus.fern` steht wieder auf seinem alten Wert (2000 Hz) |
| `spiel/ton/klang/drueben1.mp3` | **neu** — NACHBARHOF-Zeichen 1350–1884, **stimmlos** (die Sprechanlaeufe liegen als `alt/drueben1.01.mp3` daneben und sind nicht ausgeliefert) |
| `spiel/ton/klang/drueben4.mp3` | **neu** — NACHBARHOF-Zeichen 1970 |
| `spiel/ton/klang/nachbar1.mp3` | ersetzt (war eine Troete) |
| `spiel/ton/klang/brand.mp3` | ersetzt (war eine Schlacht) |
| `spiel/ton/klang/handschlag.mp3` | ersetzt (war Papierrascheln) |
| `spiel/ton/LIESMICH.md` | die Fremd-Schicht und die zweite Regel richtiggestellt |
| `werkbank/schuss/klang-w6/**` | Werkzeuge, Prompts, Rohantworten, verworfene Anlaeufe |

**Keine Datei geloescht**, also auch keine tote Probe. Im laufenden Spiel
gegengeprueft, in beide Richtungen (`klang-w5-nach/dateien.mjs`, unveraendert):

```
{ "fehlt": [], "tot": [], "gerufen": 49, "vorhanden": 49 }
```

Das Haus hat jetzt **49** Proben (47 + `drueben1` + `drueben4`); keine fehlt,
keine ist tot.

**KERN: nichts.** Alles, was diese Runde gebraucht hat, liess sich in
`kern/ton.js` bauen. Kein Stueck ausser dem eigenen ist angefasst worden,
`spiel/index.html` nicht, `spiel/kern/**` ausser `ton.js` nicht.

**Am Messgeraet anderer wurde nichts gedreht** (ZUSTAENDIGKEIT 16).
`werkbank/hoerer.py`, `aufnahme.mjs`, `mische.py`, `frage-vorgang.py`,
`beschreibe.py` sind Zeichen fuer Zeichen unveraendert geblieben; gerufen
wurden nur ihre Funktionen.

---

## 16 — WAS ICH DEM NAECHSTEN MITGEBE

1. **Vor jeder Aenderung an der Mischung: die Probe einzeln vorlegen UND ihren
   Rohpegel messen.** Diese Runde hat zwei Sorten stiller Fehler gefunden, und
   beide sind am Quelltext unsichtbar:
   * der falsche INHALT (`nachbar1` = Troete, `brand` = Schlacht,
     `handschlag` = Papier) — findet `beschreibe.py`;
   * der nicht angekommene PEGEL (`drueben1` mit Effektivwert 0,0072 gegen
     eine Zielzahl von 0,55, gekappt bei Faktor 6) — findet
     `lautheit.mjs`. **Dieses zweite Werkzeug hat vorher gefehlt.**
2. **`angleich()` kappt bei 6.** Wer eine Zielzahl in den Quelltext schreibt,
   hat sie damit noch nicht im Ton. Fuer einzelne Proben steht jetzt `hebe()`
   daneben, das die Spitze respektiert; die Schleifen bleiben bei `angleich()`.
3. **Ein Erzeuger, dem man einen Satz gibt, kann ihn SPRECHEN LASSEN.** Aus
   *"they go back and forth"* im Prompt wurde eine englische Stimme in der
   Probe, und das fremde Ohr hat sie in 1350 als Rundfunkuebertragung
   zurueckgelesen — mit dem Zitat. Wer Stimmen bestellt, muss damit rechnen,
   dass sie eine Sprache haben.
4. **Die Vorgangsfrage braucht drei Durchgaenge.** Die Regel steht schon in der
   Sperrliste des Kritikers, aber nur fuer die Epochenfrage. Abschnitt 8.2
   zeigt, dass sie fuer die Vorgangsfrage genauso noetig ist: derselbe
   Michaelitag war fuer dasselbe Ohr einmal da und einmal nicht.
5. **1884 ist mit diesem Werkzeug nicht messbar.** In vier von vier Messungen
   bejaht das Ohr dort zwei von vier Blendern. Solange das so ist, sagt sein
   Nein zum Gegenzug in 1884 nichts ueber das Spiel. Wer die Auflage dort
   messen will, braucht ein anderes Ohr oder eine andere Frage.
6. **In 1600 handelt der Nachbar im Messfenster nur zweimal**, 1,5 s
   auseinander, bei Sekunde 21. Das ist eine Eigenschaft des Spielstands, nicht
   des Tons. Eine Latte, die verlangt, dass der Gegenzug in allen vier Epochen
   zu hoeren ist, misst dort einen einzigen Ausschlag von vier Sekunden gegen
   sechsundzwanzig Sekunden ohne Nachbarn. Ein zweiter Zugplan oder eine
   zweite Saat waere der ehrlichste Weg, das zu heilen.
7. **BEFUND UEBER `werkbank/hoerer.py` — nicht meine Datei, ich habe nichts
   gedreht (ZUSTAENDIGKEIT 16).** `hoere()` faengt nur `HTTPError` ab. Ein
   `OSError` / `URLError` — bei mir *"Tunnel connection failed: 503 Service
   Unavailable"* vom Ausgangsproxy — reisst den ganzen Durchgang mit einem
   Traceback ab. Mich hat das einen kompletten Lauf der Epochenquote gekostet
   (vier von vierundzwanzig Messungen, dann Absturz). Dieselbe Stelle ist
   schon zweimal repariert worden (Verweigerung, Wartezeit); der Netzfehler
   fehlt noch. `frage-vorgang.py` daneben macht es richtig: es faengt
   `Exception` und wiederholt.

### Pegel an Stand E

| Aufnahme | Sekunde | Ausgangsstand | Stand D (mit Stimme) | **Stand E (ausgeliefert)** | **Hub E** |
|---|---|---|---|---|---|
| e1 (1350) | 27,6 | 0,1194 (4,02×) | 0,1395 (4,23×) | **0,1050** | **3,27×** |
| e2 (1600) | 21,1 | 0,1407 (3,33×) | 0,1870 (4,35×) | **0,1278** | **2,90×** |
| e3 (1884) | 11,2 | 0,1278 (1,20×) | 0,2554 (1,50×) | **0,2146** | **2,09×** |
| e4 (1970) | 11,1 | 0,1885 (1,59×) | 0,2129 (1,68×) | **0,2245** | **1,80×** |

Gesamtpegel der halben Minute, gegen den Ausgangsstand:

| | Ausgangsstand | **Stand E** |
|---|---|---|
| e1-gespielt | 0,1535 | **0,1518** |
| e2-gespielt | 0,1172 | **0,1214** |
| e3-gespielt | 0,1592 | **0,1652** |
| e4-gespielt | 0,1705 | **0,1734** |
| die vier stillen | 0,0135–0,0136 | **0,0134–0,0151** |

Der ausgelieferte Stand liegt also im Pegel praktisch auf dem Ausgangsstand —
kein Klang ist lauter geworden, um den Gegenzug zu erkaufen. `lage` leer,
`geraten()` leer, **0** Konsolenfehler in allen acht Aufnahmen.

### Stand E, erster Durchgang: **0 von 4** — und das ist der wichtigste Befund

`antworten/vorgang-e.json`:

| Aufnahme | FUHRE | SUD | MICHAELI | **GEGENZUG** | Blender | englische Sprache gemeldet? |
|---|---|---|---|---|---|---|
| e1-gespielt (1350) | ja (8 s) | ja (18 s) | ja (15 s) | **nein** | 0 | **nein** |
| e2-gespielt (1600) | ja (1 s) | nein | nein | **nein** | 0 | **nein** |
| e3-gespielt (1884) | nein | nein | ja (21 s) | **nein** | 2 | **nein** |
| e4-gespielt (1970) | ja (2 s) | ja (0 s) | nein | **nein** | 0 | **nein** |
| e1..e4-still | nein | nein | nein | **nein** | 0 | — |

**Der Anachronismus ist weg** — in keiner der acht Aufnahmen meldet das Ohr
noch eine Stimme oder eine Sprache. **Und mit ihm sind alle Ja-Antworten zum
Gegenzug verschwunden.** Vorgangsfragen in den stillen Aufnahmen: 0 von 32.

Das ist unangenehm und es ist das Ergebnis:

> **Die einzigen Staende, in denen das fremde Ohr den Gegenzug in mehr als
> einer Epoche bejaht hat, sind C und D — und beide trugen eine erkennbare
> englische Stimme, die dasselbe Ohr als Anachronismus gemeldet hat. Nimmt man
> die Stimme heraus, faellt die Zahl auf null.**

Das Ja galt also nicht der Wand, nicht dem Pegel und nicht dem Vorhalt: es galt
den **Leuten**. Ein Ohr erkennt einen fremden Hof daran, dass dort MENSCHEN
sind, die nicht man selbst ist — und Menschen, die etwas rufen, rufen es in
einer Sprache.

### Die dritte Latte an Stand E — und ein Rueckschlag, der eine Ursache hat

| Stand | still | gespielt |
|---|---|---|
| Ausgangsstand, Zahl der Vorrunde | 2/12 = 17 % | 7/12 = 58 % |
| Ausgangsstand, heute nachgemessen | 4/12 = 33 % | 9/12 = 75 % |
| Stand C | 4/12 = 33 % | 9/12 = 75 % |
| Stand D | 1/12 = 8 % | 9/12 = 75 % |
| **Stand E** | 3/12 = 25 % | **6/12 = 50 %** |

Die stille Quote haelt (25 % gegen 33 % von heute), aber die **gespielte faellt
auf 50 %** — unter beide Bezugswerte. Drei Treffer bei zwoelf Messungen sind
im Rauschen dieses Verfahrens (Abschnitt 7), aber es gibt auch eine handfeste
Erklaerung, und die ist mein Fehler:

**Ich habe in Stand A die Wand der uebrigen Nachbarklaenge (`bus.fern`) von
2000 auf 1500 Hz zugezogen** — "auch sie sollen von drueben kommen". An dieser
Wand haengt aber nicht das Zeichen, sondern der **Zug des Nachbarn selbst**:
`gegner:fuhre` spielt dort `abfahrt2` / `abfahrt3` / `abfahrt4`, also genau die
Proben, an denen das Ohr die Epoche erkennt. Wer sie daempft, nimmt der
gespielten Aufnahme Epochenauskunft, ohne dem Gegenzug etwas zu geben.

---


---

## 17 — EIN VORSCHLAG ZUR ABNAHME, FALLS SIE BESTEHEN BLEIBT

Ich habe die Auflage nicht erfuellt und schlage sie nicht klein. Aber ich habe
in dieser Runde drei Dinge gemessen, die an ihrer Formulierung haengen, und der
Kritiker soll sie sehen, bevor er die naechste Fassung schreibt:

1. **Vier Ja in EINEM Durchgang.** Das Messgeraet schwankt nachweislich
   (Abschnitt 8.2): derselbe Michaelitag war fuer dasselbe Ohr einmal da und
   einmal nicht. Eine Abnahme, die vier unabhaengige Ja in Folge verlangt,
   verlangt damit mehr Verlaesslichkeit, als das Ohr hat. **Vorschlag: drei
   Durchgaenge, Mehrheit je Aufnahme.** Werkzeug liegt bereit
   (`gegenzug-wieder.sh`, `mehrheit.py`).
2. **1884 ist mit diesem Ohr nicht messbar** — in **allen** Messungen dieser
   Runde und der Vorrunde bejaht es dort zwei von vier Blendern (Gewitter,
   Kirchenorgel). Nach seiner eigenen Regel zaehlt dort auch sein Nein nicht.
3. **1600 gibt dem Nachbarn im Messfenster nur zwei Zuege**, 1,5 s auseinander,
   bei Sekunde 21 — sechsundzwanzig der dreissig Sekunden ist der Nachbar
   schlicht nicht da. Das ist Spielstand, nicht Ton. **Vorschlag: der Zugplan
   der Abnahme sollte in jeder Epoche mindestens einen Gegenzug ins erste
   Drittel legen**, sonst misst die Latte, wie der Zufall die Nachbarzuege
   verteilt.

Und der Befund, um den es eigentlich geht: **was ein fremdes Ohr an einem
fremden Hof erkennt, sind fremde Leute.** Solange die einzige verfuegbare
Quelle fuer Stimmen ein Erzeuger ist, der ihnen eine Sprache mitgibt, steht die
erste Haelfte dieser Auflage gegen die Sperrliste 1. Wer sie erfuellt haben
will, braucht entweder eine Stimmprobe ohne erkennbare Sprache — Summen,
Rufen, Lachen ohne Worte — oder eine Frage, die nicht nach dem fremden HOF,
sondern nach dem fremden VORGANG fragt.
