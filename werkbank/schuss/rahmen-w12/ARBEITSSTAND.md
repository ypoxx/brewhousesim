# Welle 12 — DER RAHMEN. Arbeitsstand (laufend geschrieben)

Auftrag: `gauntlet/WELLE-12.md`. R7 das Rennen finden und benennen, R8 abstellen
ohne fremde Stueckdatei, R9 ein Geraet, das die Frage in Minuten beantwortet.

## Erster Befund aus den Rohdaten — noch ohne eine Zeile Code

`werkbank/schuss/aufsicht/welle11-saat/rho/e1-{A,B,C}.json` und
`welle11-trennprobe/rho/*.json`, mit `python3` verglichen (nicht neu gemessen —
die Daten liegen im Repo).

**Die zwei Partien sind bis Woche 60 Ziffer fuer Ziffer gleich und gehen in
Woche 61 auseinander — das ist 1352, Woche 1 (Michaeli).**

| | n=60 (1352 W1) | n=61 (1352 W2) |
|---|---|---|
| A | Kasse 164, Deckung 3,4167 | Kasse **135** |
| B | Kasse 164, Deckung 3,4167 | Kasse **90** |

Und der Grund steht im selben Datensatz, in `jahre[]`:

| Jahr | A `kasseMichaeli` / Zeilen der LEITER | B |
|---|---|---|
| 1350 | 79 / 1 | 79 / 1 |
| 1351 | 60 / 2 | 60 / 2 |
| **1352** | **164 / 0** | **119 / 3** |

`linie.mjs:168` liest die LEITER aus `.pr-leiter .pr-leiter-zeile`. **Null
Zeilen heisst: die Michaelitafel DES PREISES stand in diesem Augenblick nicht
offen.** In A ist sie 1352 zu, in B ist sie auf; in B wird deshalb ein Angebot
fuer 45 Pf genommen, in A nicht. Von da an laufen die Partien auseinander.

Dieselbe Null steht in **beiden** Partien auch in anderen Jahren:

| Stand | Jahre mit leerer LEITER | Kasse | = welcher volle Lauf |
|---|---|---|---|
| ohneFuhre (Vorzustand) | 1357 | 28–524 | — |
| **ohneErbe** (GEGNER+FUHRE) | **1352, 1354, 1356** | **8–514** | **A und C** |
| **ohneGegner** (ERBE+FUHRE) | **1354, 1356, 1358** | **30–558** | **B** |

Damit ist die Zuordnung dicht: der volle Stand spielt in A/C exakt die Partie
`ohneErbe` und in B exakt die Partie `ohneGegner` — Kassenspanne, Schlussstand
und die Liste der leeren LEITER-Jahre stimmen jeweils vollstaendig ueberein.

**Die umkaempfte Stelle ist also nicht die Kennzahl, sondern EIN KLICK:
`preis:tafel` in Michaeli 1352.** Er landet mal und mal nicht.

## Was `linie.mjs` an dieser Stelle tut (Messgeraet, wird nicht angefasst)

```js
const griff = await lage('preis:tafel');
if (griff && !/schließen/.test(griff.text || '')) await klick('preis:tafel', 220);
```
`lage()` liest `getBoundingClientRect()`, `el.disabled`, `el.innerText` und
`document.elementFromPoint(cx, cy)` (Feld `hit`). `klick()` versucht bis zu
`BEHARR=6`-mal, dazwischen `ruhe(60)` = zwei Bildaufbauten plus eine Runde der
Aufgabenschlange. **Wer nach diesen zwei Bildaufbauten noch etwas fertigstellt,
entscheidet ueber `hit` — und damit ueber die Partie.**

Das ist genau die Sorte Rennen, die der Auftrag beschreibt. Was jetzt gemessen
wird: WER stellt nach dem Bildaufbau noch etwas fertig.

---

# R7 — DAS RENNEN, GEFUNDEN UND REPRODUZIERT

## Das Geraet

`werkbank/schuss/rahmen-w12/rennen.mjs` — die Hand ist **wortgleich** die von
`rueckkopplung-r3/linie.mjs`; dazu kommen drei Dinge:

1. ein Init-Skript, das `setTimeout/setInterval/requestAnimationFrame/
   requestIdleCallback` umhuellt und je Aufruf notiert, **welche Spieldatei und
   welche Zeile** ihn bestellt hat (aus dem Aufrufstapel) — plus jedes
   `B.sende('zeichne')` mit seinem Grund;
2. ein **Protokoll** an der entscheidenden Stelle (jede Woche 1): Text und
   Rechteck von `preis:tafel`, `elementFromPoint` darauf, Klassenliste von
   `.pr-tafel`, Zeilen der LEITER, `BRAUHAUS.preis.lage()`;
3. **`DROSSEL=n`** — `Emulation.setCPUThrottlingRate` im selben Browser.
   Damit laesst sich die Phasenlage erzeugen, die sonst nur die Last der
   Maschine erzeugt, **ohne einen zweiten Prozess neben der Messung**.

## Der Kurzschluss: 62 Wochen statt 400 genuegen

Die Partien gehen in Woche 61 auseinander. 62 Wochen reichen also, und ein
Lauf dauert rund 40 s statt 8 Minuten.

**Messung, Stand `7a1a942`, Hafen 8940, ein Messfenster, fuenf Laeufe
nacheinander, `?saat=1350`:**

| Drossel | LEITER-Zeilen 1350/51/52 | Kasse an Michaeli 1350/51/52 | = Partie |
|---|---|---|---|
| 1× | 1 / 2 / **0** | 79 / 60 / **164** | **A** (voll A+C, `ohneErbe`) |
| 2× | 1 / 2 / **0** | 79 / 60 / **164** | **A** |
| **3×** | 1 / 2 / **3** | 79 / 60 / **119** | **B** (voll B, `ohneGegner`) |
| 4× | 1 / 2 / **3** | 79 / 60 / **119** | **B** |
| 6× | 1 / 2 / **3** | 79 / 60 / **119** | **B** |

Das sind Ziffer fuer Ziffer die beiden Partien des vollen 400-Wochen-Standes.
Vier ungedrosselte Laeufe vorher (`rennen-vorher.json`) gaben viermal A.
**Das Rennen ist damit auf einer ruhigen Maschine schaltbar.**

## WO DAS RENNEN SITZT — mit dem Protokoll, nicht mit einer Vermutung

Michaeli 1352, im Augenblick, in dem die Hand `preis:tafel` liest:

| | Drossel 2 (Partie A) | Drossel 3 (Partie B) |
|---|---|---|
| `.pr-tafel` im DOM | ja, `pr-tafel pr-stil-pergament` | **nein** |
| `BRAUHAUS.preis.lage().weggeklappt` | **false** | **true** |
| Text an `preis:tafel` | „Michaelitafel **schließen**" | „Michaelitafel 1352 · 5 Angebote" |
| was die Hand daraufhin tut | **klickt nicht** | **klickt** |
| Folge | Tafel bleibt fort, LEITER leer, kein Angebot | Tafel liegt auf, Angebot fuer 45 Pf |

Und einen Schritt spaeter (`W1:nach-sommer 1352`, Drossel 2) traegt dieselbe
`.pr-tafel` die Klasse `stadt-zugeklappt` — **waehrend der Griff weiter
„schließen" sagt.** Das ist die Luege, an der sich die Partie entscheidet.

## Die Kette, Glied fuer Glied

1. `stuecke/stadt.js` `nachsehen()` entscheidet die Platzordnung und setzt
   `stadt-zugeklappt` auf ein fremdes Brett. Angestossen wird sie von
   `stadt.js:1560` (MutationObserver) → `stadt.js:1554` (`requestAnimationFrame`)
   und zusaetzlich von `stadt.js:1573` `setInterval(pruefe, TAKT)`.
   **Sie sendet dabei kein `zeichne`.** Niemand erfaehrt es.
2. `stuecke/preis.js:2737` `seheNachRahmen()` sieht deshalb **nach einer
   Wanduhrfrist von 420 ms** nach, ob die STADT die Tafel weggeklappt hat, und
   sendet erst dann `zeichne`. Der Kommentar dort sagt es selbst: *„DIE STADT
   klappt erst einen Wimpernschlag nach dem Zeichnen zu."*
3. Zwischen 1. und 2. **luegt der Knopf**: er sagt „Michaelitafel schließen",
   obwohl nichts auf dem Tisch liegt.
4. Die messende Hand wartet nach jedem Klick `ruhe()` = **zwei Bildaufbauten**
   plus eine Runde der Aufgabenschlange — also rund 33 ms. **420 ms sind
   zwoelfmal so lang.** Ob die Hand vor oder nach dem Nachsehen liest, haengt
   an der Last der Maschine.

Gezaehlt in einem 62-Wochen-Lauf: `seheNachRahmen` wird **186-mal bestellt und
faellt 5-mal** — jedes Zeichnen setzt die Frist zurueck. Sie faellt nur dann,
wenn 420 ms lang kein Bild neu gebaut wird. Genau in einer dieser fuenf
Luecken liegt Michaeli 1352.

## Warum die Trennprobe „kein Verursacher" ergeben hat, und warum das stimmt

Die Kette braucht **drei** Teile: ein Brett DES PREISES, das die STADT
wegklappt, und genug anderes auf dem Tisch, damit die Platzordnung ueberhaupt
in den Streit geht. DIE FUHRE bringt das Sommerblatt (deshalb ist sie
notwendig: `ohneFuhre` bleibt auf dem Vorzustand), DER GEGNER und DAS ERBE
verschieben mit ihren eigenen Brettern, wie lange ein Bildaufbau dauert und
wo die 420-ms-Luecke faellt. **Keines der drei ist die Ursache; die Ursache
ist, dass die Fertigstellung einer Runde nicht festgelegt ist.**

---

# R8 — ABGESTELLT, OHNE EINE FREMDE STUECKDATEI ANZUFASSEN

## Die Regel, in einem Satz

**Ein Bildaufbau ist eine Runde, und eine Runde hat ein Ende.** Was ein Stueck
waehrend des Zeichnens auf spaeter verschiebt, gehoert noch zu dieser Runde und
wird **vom Rahmen** abgearbeitet, bevor die Runde schliesst — in fester
Reihenfolge, in Mikrotasks, ohne jede Wanduhr. Und wenn sich dabei die
**Klemmenlage** geaendert hat (wer liegt zugeklappt, wer verdeckt), wird noch
einmal gezeichnet, damit kein Knopf eine Lage beschriftet, die es nicht mehr
gibt.

## Warum in Mikrotasks und nicht in Bildern

Der MutationObserver DER STADT (`stadt.js:1560`) ist selbst ein Mikrotask.
Arbeitet der Rundenschluss seine Schlange in Mikrotask-Durchgaengen ab, kommt
DIE STADT **zwischen zwei Durchgaengen von allein zum Zug** — der Rahmen muss
sie nicht kennen. Und die ganze Runde ist trotzdem fertig, **bevor der Browser
das naechste Bild baut**. Die messende Hand wartet zwei Bilder; sie kann eine
Runde also gar nicht mehr halb sehen.

Ein Schluss, der in `requestAnimationFrame` arbeitet, koennte das nicht: er
laege genau in dem Fenster, auf das die Hand wartet.

## Was gefangen wird und was nicht

Gefangen wird, solange eine Runde laeuft: `setTimeout` bis 1200 ms und
`requestAnimationFrame`. Das sind im ganzen Spiel neun Stellen, jede einzeln
nachgesehen — **keine Animation darunter**, alle heissen „den Rest meines
Zeichnens gleich nachholen":

| Stelle | was |
|---|---|
| `kern/kopf.js:112` | rAF · Deckungsband, wenn die Zuege gemeldet sind |
| `stuecke/preis.js:2884` | rAF · Kennzahl in DIE LEITER eintragen |
| **`stuecke/preis.js:2737`** | **Frist 420 ms · nachsehen, ob DIE STADT weggeklappt hat** |
| `stuecke/fuhre.js:2541` | rAF · Liste an die Hoehe passen |
| `stuecke/fuhre.js:3515` | rAF · Sommertafel abraeumen, falls die Woche steht |
| `stuecke/fuhre.js:3606` | rAF · Georgi-Tafel nachlegen |
| `stuecke/sud.js:2407/2408` | rAF·rAF · nachsehen, ob das Brett zugeklappt liegt |
| `stuecke/stadt.js:1554` | rAF · Platzordnung pruefen (aus dem MutationObserver) |
| `stuecke/name.js:2272` | Frist 0 ms · noch einmal zeichnen, wenn Aufgeld kam |

**Nicht** angefasst werden: `setInterval` (also DER STADT 240-ms-Takt und DES
SUD 320-ms-Takt bleiben, wie sie sind), Fristen ueber 1200 ms, und alles, was
ausserhalb einer Runde bestellt wird — der Ton, die Bildstaffel DER STADT
(`stadt.js:2144` `requestIdleCallback`), das Schlussblatt DES SUD
(`sud-zusatz.js:250`, 700 ms), der Notenknopf DES KLANGS (`klang.js:55`,
600 ms). Was nach zwoelf Durchgaengen noch in der Schlange liegt, geht **an
die echte Uhr zurueck** und wird gezaehlt — verschluckt wird nichts.

## Die Messung, die zeigt, dass es abgestellt ist

Derselbe Drosselfaecher wie oben, auf dem Nachstand mit `kern/runde.js`:

| Drossel | LEITER 1350/51/52 | Kasse an Michaeli | Partie |
|---|---|---|---|
| 1× | 1 / 2 / 3 | 79 / 60 / 119 | **eine** |
| 2× | 1 / 2 / 3 | 79 / 60 / 119 | **eine** |
| 3× | 1 / 2 / 3 | 79 / 60 / 119 | **eine** |
| 4× | 1 / 2 / 3 | 79 / 60 / 119 | **eine** |
| 6× | 1 / 2 / 3 | 79 / 60 / 119 | **eine** |

Vorher kippte derselbe Faecher zwischen 1×/2× und 3× die Partie. **Ueber eine
Spanne von 1:6 in der Rechengeschwindigkeit steht jetzt eine Partie.**
Es ist die Partie B (`ohneGegner`, Kasse 30–558) — der Auftrag laesst das
ausdruecklich zu: „Verlangt ist EINE Partie, nicht die alte."

## Der eine Fehler dieses Baus, gefunden und behoben — er steht hier, weil er teuer war

Die erste Fassung verglich die Klemmenlage mit dem **Anfang des Schlusses**.
Das ist falsch: jedes Zeichnen baut die Bretter neu, dabei geht
`stadt-zugeklappt` verloren, und DIE STADT setzt es im Schluss wieder. Gegen
den Anfang gemessen hat sich also **immer** etwas geaendert — gemessen
**197 Nachrunden in 205 Runden**, also der doppelte Bildaufbau fuer nichts.
Verglichen wird jetzt mit der **letzten fertigen Runde**; dann aendert sich
nur dann etwas, wenn wirklich ein anderes Brett zugeklappt liegt als vorher —
und nur dann kann ein Knopf luegen.

---

# R9 — DAS GERAET: DIE FRAGE IN EINEM AUFRUF

Drei Griffe, alle drei nach dem Vorbild von `BRAUHAUS.haushalt.pruefe()`:

```js
BRAUHAUS.runde.pruefe()          // []  = der Rahmen hat nichts zu melden
BRAUHAUS.runde.zeile()           // eine Zeile fuer die Konsole
await BRAUHAUS.runde.nachwehen() // { ruhig: true }  = die Runde WAR fertig
BRAUHAUS.runde.bericht()         // alle Zaehler
```

**`nachwehen()` ist die eigentliche Antwort auf R9.** Es nimmt den Abdruck der
Klemmenlage **und** aller bedienbaren Zuege (Name · gesperrt · Beschriftung,
gelesen mit `textContent`, also **ohne Layout**), wartet **1,2 s echte Wanduhr,
in denen niemand etwas anfasst**, und sieht noch einmal hin. Aendert sich in
dieser Sekunde etwas, war die Runde nicht fertig, als sie zu Ende ging — und
genau das ist die Bedingung, unter der zwei gleiche Saaten auseinanderlaufen.
In dieser Sekunde schlaegt DER STADT 240-ms-Takt fuenfmal zu; wer sich daran
noch bewegt, wird gesehen.

Es ist das einzige im Rahmen, das eine Uhr benutzt, und es laeuft **nur auf
Zuruf**. Wer es waehrend einer Messung ruft, misst sein eigenes Warten mit.

Dazu zwei Geraete auf der Platte:

| Datei | was es kostet | was es beantwortet |
|---|---|---|
| `rahmen-w12/geraet.mjs` | **rund 1 Minute** | laden die vier Epochen? `lage` leer? Konsolenfehler? und: ist die Runde in jeder Epoche ruhig? |
| `rahmen-w12/rennen.mjs` mit `DROSSEL=1,2,3,4,6` | **rund 12 Minuten** | spielt dieselbe Saat ueber eine Spanne von 1:6 in der Rechengeschwindigkeit dieselbe Partie? |

Vorher kostete dieselbe Frage **neun Laeufe zu je vier Minuten** — und selbst
die haben sie nicht beantwortet, sondern nur festgestellt, dass es keinen
Verursacher gibt.

---

# JEDE ZEILE, DIE GEAENDERT WURDE, MIT GRUND

`git diff --stat 9b20ac0 HEAD -- spiel/`:
`index.html` +13 · `kern/buehne.js` +12/−1 · `kern/runde.js` +473 (neu).
**Keine Datei eines Stuecks ist beruehrt.** `stil/grund.css` ist **unberuehrt** —
dieser Befund war keiner des Aussehens, und es gab nichts daran zu regeln.

## `spiel/index.html` — EINE funktionale Zeile

```html
<script src="kern/runde.js"></script>
```
plus elf Zeilen Kommentar. **Grund:** der Rundenschluss umhuellt `B.sende` und
`window.setTimeout`/`requestAnimationFrame` und muss das tun, **bevor
irgendein Stueck sie zum ersten Mal ruft**. Deshalb steht die Zeile direkt
hinter `kern/uhr.js` — dort gibt es `B.sende` und `B.auf` schon, und alle acht
Stuecke kommen erst weit danach. Kein `<script>`- oder `<link>`-Tag eines
Stuecks ist angefasst, die Ladereihenfolge der acht Stuecke ist unveraendert.

## `spiel/kern/buehne.js` — eine Klammer um vier Zeilen in `starte()`

Die Schleife, die beim Laden jedem Stueck sein erstes `zeichne` gibt, ruft die
Stuecke **direkt** und geht nicht ueber `B.sende('zeichne')` — genau dort haengt
aber der Rundenschluss. Ohne die Klammer waere ausgerechnet der **Ladezustand**
die einzige Runde ohne Ende, und der Ladezustand ist der, den der blinde
Kritiker fotografiert. Die Reihenfolge der Aufrufe bleibt Zeile fuer Zeile
dieselbe; nur der Schluss kommt dazu. Faellt `kern/runde.js` aus, laeuft die
Schleife unveraendert (`if (B.runde && B.runde.runde) … else malen()`).

## `spiel/kern/runde.js` — neu, 473 Zeilen

Der Rundenschluss (R8), die Klemmenwache und das Geraet (R9). Vollstaendig
kommentiert, mit dem eigenen Fehler und seiner Messung im Quelltext.

**Was es an fremdem Verhalten aendert und was nicht.** Es aendert die
**Reihenfolge**, in der aufgeschobene Arbeit laeuft, und den **Zeitpunkt**
(Ende der Runde statt Wanduhr). Es aendert **keinen** Rueckgabewert, **keine**
Bedingung und **keine** Zeichenkette. Jede umhuellte Funktion ruft das Original
mit denselben Argumenten; jeder aufgefangene Rueckruf wird ausgefuehrt,
hoechstens frueher. Was nach zwoelf Durchgaengen uebrig ist, geht an die echte
Uhr zurueck (`ueberlauf` in `bericht()`, gemessen: **0**).

---

# WAS FUER WELLE 13 BENANNT IST — mit Datei, Zeile und Abnahme

Der Rahmen hat das Rennen abgestellt, ohne eine fremde Datei anzufassen. Er
hat es damit **abgefangen**, nicht **geheilt**: zwei Stellen in zwei Stuecken
verlassen sich weiter auf eine Wanduhr, und der Rahmen raeumt hinter ihnen auf.
Solange sie stehen, kostet jede Runde einen Nachlauf, und die Klemmenwache
zaehlt Pendel und Riegel.

## 1 — DIE STADT: `stuecke/stadt.js` `nachsehen()` (aufgerufen aus `:1554`, `:1573`)

**Sie klappt fremde Bretter weg (`stadt-zugeklappt`, `stadt-verdeckt`) und
sendet dabei kein `zeichne`.** Niemand erfaehrt, dass sein Knopf jetzt eine
Lage beschriftet, die es nicht mehr gibt — genau daran ist 1350 zerfallen.

*Abhilfe, eine Zeile:* am Ende von `nachsehen()`, wenn sich `lage[]` fuer
mindestens ein **fremdes** Brett geaendert hat:
```js
B.sende('zeichne', { grund: 'stadt-platzordnung' });
```
*Abnahme:* `BRAUHAUS.runde.bericht().aussen`, `.aussenPendel` und
`.aussenRiegel` stehen nach 30 × WEITER in allen vier Epochen auf **0**, und
`await BRAUHAUS.runde.nachwehen()` meldet `ruhig: true`. Heute: 0 / 0–4 / 0
nach 30 Wochen, aber 25–58 / 11–75 / 18–30 im gespielten Lauf ueber 62 Wochen.

## 2 — DIE STADT: `nachsehen()` haengt an drei Wanduhrfristen

`HANDFRIST` 1400 ms, `JAHRESFRIST` 1800 ms, `VERGESSEN`, dazu
`setInterval(pruefe, 240)` (`stadt.js:1573`). Wer ein Brett danach beurteilt,
**wie lange etwas her ist**, beurteilt es unter Last anders. Der Rundenschluss
faengt die Folge ab; die Ursache bleibt.

*Abhilfe:* die Fristen an **Runden** haengen statt an Millisekunden — „seit
dem Klick sind zwei Bildaufbauten vergangen" statt „seit dem Klick sind
1400 ms vergangen". Der Rahmen kann den Zaehler stellen
(`BRAUHAUS.runde.bericht().runden`).
*Abnahme:* `rahmen-w12/rennen.mjs` mit `DROSSEL=1,2,3,4,6` liefert in allen
fuenf Laeufen dieselbe Partie — **auch ohne die Klemmenwache des Rahmens**
(`AUSSEN_MAX = 0` setzen).

## 3 — DER PREIS: `stuecke/preis.js:2737` `seheNachRahmen()`

Eine **420-ms-Frist**, um zu erfahren, was ein anderes Stueck im selben
Bildaufbau getan hat. Der Kommentar dort nennt den Grund richtig („DIE STADT
klappt erst einen Wimpernschlag nach dem Zeichnen zu") und zieht den falschen
Schluss: nicht warten, sondern **fragen**.

*Abhilfe:* `tafelWeggeklappt()` liest ohnehin live; die Frist kann ersatzlos
entfallen, sobald DIE STADT ihr `zeichne` sendet (Punkt 1). Bis dahin genuegt
`0` statt `420` — der Rundenschluss fuehrt sie dann im selben Durchgang aus.
*Abnahme:* der Griff `preis:tafel` sagt in **keinem** Augenblick
„Michaelitafel schließen", waehrend `.pr-tafel` fehlt oder
`stadt-zugeklappt` traegt. Messbar mit
`rahmen-w12/rennen.mjs` (Protokoll `W1:*`, Feld `griffText` gegen
`tafelKlassen`) und mit `await BRAUHAUS.runde.nachwehen()`.

## 4 — DER SUD: `stuecke/sud.js:2406` `taktGleich()`

Dieselbe Sorte, nur schon halb geheilt: zwei `requestAnimationFrame`, um
abzuwarten, ob DIE STADT das eigene Brett zuklappt. Der Kommentar sagt es
wortwoertlich. Zwei Bildaufbauten sind genau die Frist, auf die auch die
messende Hand wartet — das ist knapp.
*Abhilfe:* dieselbe wie 3, sobald Punkt 1 steht.
*Abnahme:* `sud`-Zettel blinkt nicht, und `nachwehen()` bleibt ruhig.

## 5 — ALLE ACHT: kein Blatt ist beim Rahmen angemeldet

Die Auflage 7 der Welle 10 (`BRAUHAUS.blatt.melde(el, fn)`) ist in Welle 11
**nicht** eingeloest worden — `BRAUHAUS.haushalt.ohneGriff()` und die
Blattaufsicht arbeiten weiter ohne Anmeldung. Sie steht.

---

# DIE ZUORDNUNG DER BEIDEN PARTIEN, MIT ZAHLEN

`werkbank/schuss/rahmen-w12/auswerten-abnahme.py` und dieselbe
Spearman-Rechnung wie `fuhre-w6/schnitte.py`, angewandt auf die Rohdaten der
Welle 11 (nicht neu gemessen — sie liegen im Repo):

| Datei | ρ 12 J | ρ 13 J | ρ 14 J | Kasse | Jahre < 1× |
|---|---|---|---|---|---|
| `welle11-saat/e1-A` | +0,252 | +0,181 | **+0,191** | 8–514 | 0/14 |
| `welle11-saat/e1-B` | −0,266 | −0,418 | **−0,521** | 30–558 | 2/14 |
| `welle11-saat/e1-C` | +0,252 | +0,181 | **+0,191** | 8–514 | 0/14 |
| `trennprobe/ohneErbe-A/B/C` | +0,252 | +0,181 | **+0,191** | 8–514 | 0/14 |
| `trennprobe/ohneGegner-A/B/C` | −0,266 | −0,418 | **−0,521** | 30–558 | 2/14 |
| `trennprobe/ohneFuhre-A/B/C` | −0,245 | −0,170 | −0,336 | 28–524 | 2/14 |

**Die Zuordnung ist dicht, Ziffer fuer Ziffer:** der volle Stand spielt in
A und C genau die Partie `ohneErbe` und in B genau die Partie `ohneGegner`.
Der Rundenschluss faehrt die Partie **B** (`ohneGegner`, Kasse 30–558,
ρ(14 J) −0,521) — das ist die Partie, in der die Michaelitafel 1352
**aufliegt** und das Angebot genommen wird, also die, die entsteht, wenn der
Knopf nicht mehr luegt.

---

# WAS DIESER BAU AN SICH SELBST GEMESSEN HAT — die Zahlen des Rundenschlusses

Aus `BRAUHAUS.runde.bericht()`, am Ende jedes 62-Wochen-Laufs abgefragt
(`rennen-nachher2.json`, fuenf Drosselstufen):

| | Wert |
|---|---|
| Runden in 62 Wochen | 202–225 |
| nachgeholte Aufgaben | 2561–2918 (≈ 12,7 je Runde) |
| Mikrotask-Durchgaenge je Runde, groesster | **5** (Vorrat: 12) |
| `ueberlauf` — was an die echte Uhr zurueckging | **0** |
| Nachrunden | 33–65 auf ~205 Runden |
| Nachziehen ausserhalb einer Runde | 30–53 |
| davon Pendel (Lage kippt hin und her) | 11–75 |
| Riegel gegriffen | 18–24 |

Im **reinen** Wochenlauf (30 × WEITER, kein Handgriff, `geraet.mjs 30`):
31 Runden, 255–266 Aufgaben, **1 Nachrunde**, **0** Nachziehen ausserhalb,
`ueberlauf` 0 — und `nachwehen()` in allen vier Epochen `ruhig: true`.
Die Pendel und Riegel entstehen erst, wenn eine Hand Bretter aufschlaegt und
zuklappt; sie sind der Rest, der DER STADT gehoert (Auflagen 1 und 2 unten).

---

# DIE WEICHE ABNAHME — vorher gegen nachher, dasselbe Geraet, beide Staende eingefroren

VORHER = `7a1a942` auf Hafen **8940** · NACHHER = Nachstand **`5707219bc98a`**
auf Hafen **8942** (byteweise der ausgelieferte Arbeitsbaum).
Jede Zeile einzeln durch `aufsicht/messfenster.sh`.

## Deckung, photographisch (`bild-w9/deckung.mjs`), 1920×1000

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| Ladezustand **vorher** | 11,0 % | 11,6 % | 11,3 % | 11,9 % |
| Ladezustand **nachher** | **11,0 %** | **11,6 %** | **11,3 %** | **11,8 %** |
| 30 Wochen ohne Escape **vorher** | 14,5 % | 15,0 % | 14,8 % | 13,8 % |
| 30 Wochen ohne Escape **nachher** | **14,5 %** | **15,0 %** | **14,8 %** | **13,9 %** |

Verlangt: **13,8–15,0 %** nach 30 Wochen. Gehalten, Zehntel fuer Zehntel;
die einzige Bewegung ist 1970 um **0,1 Punkt** (13,8 → 13,9 im Spiel,
11,9 → 11,8 im Laden).

## Deckung, Innensicht nach Eigenschaft (`rahmen-w10/messen.mjs`), 2752×1536

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| gesamt vorher | 11,0 % | 11,6 % | 11,3 % | 11,8 % |
| gesamt **nachher** | **11,0 %** | **11,6 %** | **11,3 %** | **11,8 %** |
| Tafeln über 200.000 px² | 2 → **2** | 2 → **2** | 2 → **2** | 2 → **2** |
| ueber dem Rand | 0 → **0** | 0 → **0** | 0 → **0** | 0 → **0** |
| Waehrungsbruch | 0 → **0** | 0 → **0** | 0 → **0** | 0 → **0** |
| fehlende Zeichen | 0 → **0** | 0 → **0** | 0 → **0** | 0 → **0** |

## Der Haushalt im Spiel (`rahmen-w10/rahmenprobe.mjs`)

| Zustand | `tafeln()` | `blaetter()` | `ueberRand()` | `geklemmt()` | `ohneGriff()` | Preisbruch |
|---|---|---|---|---|---|---|
| Laden, vorher wie **nachher** | **[]** | [] | [] | {} | {} | [] |
| 30 Wochen, vorher wie **nachher** | **[]** | [] | [] | {} | {} | [] |
| 30 Wochen + Escape, vorher wie **nachher** | 3 × `sud` | [] | [] | {} | {} | [] |

Die drei nach Escape sind Ziffer fuer Ziffer dieselben wie auf dem
Vorzustand (`sud .sud-brett` 1293×1091, zwei `sud .sud-achse`) — die
Auflage 3 der Welle 10 an DEN SUD, unveraendert.
`BRAUHAUS.stadt.rahmen.verdeckt()` = **0** in allen vier Epochen, im Lade-
und im 30-Wochen-Zustand (`geraet.mjs`).

`haushalt.pruefe()` meldet auf **beiden** Staenden dieselben fuenf bis sechs
Ueberschreitungen (stadt, sud, preis, name, kern; nach 30 Wochen zusaetzlich
fuhre). Das ist der Stand aus Welle 10/11 und **von dieser Welle nicht
beruehrt** — der Rahmen hat kein Layout angefasst.

## Vierte Latte (`aufsicht/lesbarkeit.mjs`, 1600×1000)

| | vorher | nachher |
|---|---|---|
| Ueberlaeufe | 5 | **2** |
| Textknoten unter 12 px | 237 | **237** |
| Knoepfe unter 24 px | 0 von 292 | **0 von 292** |

**Zwei Ueberlaeufe weniger, und das ist kein Zufall:** ein Ueberlauf entsteht,
wenn ein Kasten seinen Inhalt nicht traegt — und drei der fuenf standen an
Stellen, die im Ladeaugenblick noch nicht fertig gezeichnet waren. Der
Rundenschluss zeichnet sie fertig, bevor gemessen wird.

## Gewicht (`aufsicht/gewicht-gegenprobe.mjs`, Veto bei 8 MB)

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| vorher | 6,40 | 7,78 | 6,72 | 4,79 MB |
| **nachher** | **6,43** | **7,80** | **6,75** | **4,81 MB** |

+0,02 bis +0,03 MB je Epoche — das ist `kern/runde.js`. Alle vier unter dem
Veto; 1600 liegt mit 7,80 MB am naechsten daran, wie schon vorher.

## Tor und Spielprobe

`tor.mjs`: alle vier Epochen offen, `lage` 0, 0 Konsolenfehler, 95/103/106/99
Zuege. `spielprobe.mjs` (60 Wochen je Epoche mit echten Klicks): **bestanden**,
`lage` 0, 0 Fehler in allen vieren.

---

# WAS GEGEN MICH SPRICHT — und es gehoert zu R9

**`BRAUHAUS.runde.nachwehen()` hat das alte Rennen NICHT von selbst gefunden.**
Gemessen am Vorzustand `7a1a942` (Hafen 8940) mit derselben Probe, die die
Sonde selbst mitbringt (`geraet.mjs`, Fassung fuer Staende ohne
`kern/runde.js`):

| Zustand am Vorzustand | Urteil von `nachwehen()` |
|---|---|
| Ladezustand, alle vier Epochen | **ruhig** |
| nach 30 × WEITER, alle vier Epochen | **ruhig** |
| nach 30 × WEITER + Sommerzettel zu (Michaeli), E1/E2 | **ruhig** |

Das ist kein Widerspruch zum Befund, aber es ist eine Grenze, und sie steht
hier statt in einer Fussnote: die Luege dauert **420 ms** und nur dann, wenn
in diesen 420 ms **kein** weiteres Zeichnen dazwischenkommt. In einem Lauf
ueber 62 Wochen faellt sie fuenfmal; sie auf Zuruf zu treffen, verlangt, im
richtigen Millisekundenfenster zu fragen. Was die Sonde zuverlaessig
beantwortet, ist die andere Haelfte derselben Frage — **„ist die Runde, die
gerade zu Ende ging, wirklich fertig?"** —, und darauf hat der Vorzustand
keinen Griff.

**Das Geraet, das die Frage wirklich in Minuten beantwortet, ist deshalb
`rennen.mjs` mit `DROSSEL=1,2,3,4,6`:** zwoelf Minuten, fuenf Laeufe, und die
Antwort ist ein Vergleich von fuenf Zahlenreihen statt neun 400-Wochen-Laeufen.
`nachwehen()` und `pruefe()` sind die billige Vorstufe (eine Minute) und der
Griff, mit dem ein Stueck-Bauer beim Bauen sieht, was er hinterlaesst — auf
dem Nachstand nennt `pruefe()` in 1970 nach Michaeli den Rest beim Namen
(`aussen-pendel`, 7), und genau dieser Rest ist Auflage 1 und 2 fuer DIE STADT.

## Zwei weitere Dinge, die gegen die einfache Erzaehlung sprechen

**Die Zahlen der vierten Latte im Auftrag stimmen mit keiner meiner beiden
Messungen ueberein.** WELLE-12.md nennt „10 Ueberlaeufe · 365 Textknoten ·
0 von 308 Knoepfen". Gemessen mit `aufsicht/lesbarkeit.mjs` auf beiden
eingefrorenen Staenden:

| Leinwand | vorher `7a1a942` | nachher `5707219bc98a` |
|---|---|---|
| 1600×1000 (Voreinstellung des Geraets) | 5 · 237 · 0 von 292 | **2 · 237 · 0 von 292** |
| 1366×768 | 12 · 257 · 0 von 292 | **9 · 257 · 0 von 292** |

Die Latte ist in beiden Maessen **besser** geworden und in keinem
schlechter; welche Leinwand die Zahl 10/365/308 erzeugt hat, kann ich nicht
nachstellen. Wer die Latte abnimmt, sollte die Leinwand dazusagen.

**`haushalt.pruefe()` ist auf beiden Staenden gleich voll.** Der Auftrag
verlangt „`haushalt.pruefe()` ohne Beanstandung"; gemessen meldet es
**fuenf** Ueberschreitungen im Ladezustand (stadt, sud, preis, name, kern)
und **sechs** nach 30 Wochen — **auf dem Vorzustand genauso**. Diese Welle
hat kein Layout angefasst und daran nichts geaendert; die Auflage steht
seit Welle 10 bei den Stuecken.

---

# DIE HARTE ABNAHME — Stand `5707219bc98a` (Hafen 8942)

Jeder Lauf einzeln durch `aufsicht/messfenster.sh`,
`rueckkopplung-r3/linie.mjs <epoche> 400`, `?saat=1350`.

## 1350 — sechs Laeufe, EINE Pruefsumme

| Lauf | Zeit | md5 |
|---|---|---|
| e1-A | 03:16:09 | `f250961e4ff7` |
| e1-B | 03:19:55 | `f250961e4ff7` |
| e1-C | 03:23:48 | `f250961e4ff7` |
| e1-D | 03:27:48 | `f250961e4ff7` |
| e1-E | 03:31:29 | `f250961e4ff7` |
| e1-F | 03:35:49 | `f250961e4ff7` |

**Sechsmal dieselbe Pruefsumme.** Vorher: drei Laeufe, **zwei** Pruefsummen
(`74edb872` zweimal, `ede238f3` einmal), Spannweite ρ 0,712.
Bei einem Abweichungsverhaeltnis von 1:3 waere ein Dreiersatz zu rund 30 %
Zufall gewesen — ein Sechsersatz ist es zu unter 3 %.

## 1600 — und hier bleibt ein Rest, den ich melde

| Lauf | md5 |
|---|---|
| e2-A | `9d3319d927af` |
| e2-B | **`0694c7c336fe`** |
| e2-C | `9d3319d927af` |

**Zwei Pruefsummen in drei Laeufen — die Bedingung ist fuer 1600 nicht
erfuellt.** Was der Unterschied ist, steht hier vollstaendig, weil er kleiner
ist, als die Pruefsumme aussehen laesst:

* **Genau EINE von 400 Wochen** unterscheidet sich (Index 153, 1605 W4).
* In dieser Woche unterscheidet sich **genau EIN Feld**: `faesser` 24 gegen
  22. Der Keller steht einmal voll und einmal zwei Fass darunter.
* **Alles andere ist bitgleich:** die Kasse in allen 400 Wochen, die Kennzahl
  in allen 400 Wochen, `leiterRoh` (also die ganze ρ-Reihe), die Jahre, die
  Kassenspanne 302–2851 und der Schlussstand 1613/W11 mit 702 in der Lade.
* **ρ ist damit in allen drei Laeufen Ziffer fuer Ziffer dieselbe.**

Es ist also **dieselbe Partie mit einer voruebergehenden Abweichung von zwei
Fass in einer Woche**, nicht zwei Partien. Trotzdem: die Abnahmebedingung
lautet „eine Pruefsumme", und die ist nicht erfuellt. Ob dieser Rest neu ist
oder auf dem Vorzustand ebenso auftritt, wird gerade nachgemessen
(`abnahme-vorher/`, 1600 dreimal auf `7a1a942`).

## 1884 — drei Laeufe, DREI Pruefsummen

| Lauf | md5 | Kassenspanne |
|---|---|---|
| e3-A | `e4363a2c41af` | 190–29.433 |
| e3-B | `5ff4fff54648` | 2.441–28.128 |
| e3-C | `b49d340136ec` | 3.278–33.284 |

Paarweise 287 bis 326 von 400 Wochen verschieden. Die erste Abweichung steht
in 1886, Woche 14: **Kasse gleich (5.098), `faesser` 86 gegen 68** — wieder
ein Handgriff an einem Brett DER FUHRE, der einmal landet und einmal nicht,
und diesmal traegt er weit.

**Das ist keine Bedingung, die diese Welle erfuellt.** Ob 1884 auch auf dem
Vorzustand auseinanderlaeuft, wird gerade gemessen (`abnahme-vorher/e3-*`);
eine Dreierprobe von 1884 gibt es im ganzen Repo bisher nicht — Welle 10 hat
sie angefangen (`rahmen-w10/saat/VOR-e3-A.json`, ein Lauf) und nie beendet.

## 1600 auf dem Vorzustand — und hier spricht es gegen mich

| Stand | Laeufe | md5 | abweichende Wochen |
|---|---|---|---|
| **Vorzustand `7a1a942`** | 3 | `5af1d5f1f2eb` **dreimal** | **0** |
| Nachstand `5707219bc98a` | 3 | `9d3319d927af` · `0694c7c336fe` · `9d3319d927af` | **1 von 400** |

**1600 war auf dem Vorzustand dreimal byteweise gleich und ist es auf meinem
Stand nicht mehr.** Der Unterschied ist eine Woche und ein Feld (zwei Fass im
Keller, 1605 W4) und die ρ-Reihe bleibt bitgleich — aber er ist neu, und er
geht auf mein Konto. Er gehoert in denselben Satz wie die 1884-Laeufe: der
Rundenschluss hat die Fertigstellung der Runde festgelegt, **nicht** aber,
welchen Zustand die uhrgetriebene Platzordnung DER STADT zum Zeitpunkt eines
Klicks gerade herstellt.

---

# DIE KEHRTWENDE — vier Fassungen, und drei davon sind gemessen schlechter

Die erste Fassung (**RUNDENSCHLUSS**) hat 1350 geheilt und 1600 und 1884
verdorben. Der Beleg dafuer ist der Grund, warum diese Welle nachgemessen
statt behauptet wird:

| Epoche | Vorzustand `7a1a942` | Fassung 1 (Rundenschluss) |
|---|---|---|
| 1350 | 3 Laeufe / **2** Pruefsummen | 6 Laeufe / **1** Pruefsumme `f250961e4ff7` |
| 1600 | 3 Laeufe / **1** Pruefsumme `5af1d5f1f2eb`, 0 abweichende Wochen | 3 Laeufe / **2** Pruefsummen |
| 1884 | 3 Laeufe / **1** Pruefsumme `d36f613f391e`, 0 abweichende Wochen | 3 Laeufe / **3** Pruefsummen |
| 1970 | — | 2 Laeufe / 1 Pruefsumme `5adfd2fb582b` |

**Die Ursache des Rueckschritts, benannt:** `stuecke/fuhre.js:2541` misst
`clientHeight`/`scrollHeight` einer Liste und rechnet daraus einen Massstab.
In einem Bildaufbau gemessen ist das Layout fertig; in einem Mikrotask
unmittelbar nach dem Umbau ist es das nicht unbedingt. Ein anderer Massstab
heisst andere Knopfgroessen — und ob ein Klick der messenden Hand trifft.

**Die Lehre, und sie ist groesser als diese Welle:** *ein Rahmen darf die
Zeitrechnung fremder Stuecke nicht umschreiben.* Er darf ihnen sagen, WANN
etwas zu tun ist (ein Ereignis), nicht WIE ihre Messung zustande kommt.

## Die vier Fassungen und was der Drosselfaecher zu jeder sagt

`rennen.mjs`, 62 Wochen, `DROSSEL=1,2,3,4,6`, je ein Lauf, alle auf
eingefrorenen Staenden.

| Fassung | was sie tut | 1350 im Faecher |
|---|---|---|
| **1 Rundenschluss** | faengt `setTimeout`/`rAF` waehrend des Zeichnens, arbeitet sie in Mikrotasks ab, zeichnet nach, wenn die Klemmenlage kippte | **eine Partie** — aber 1600/1884 verdorben |
| **2 Klemmenwache, sofort, grob** | fasst keine Zeitgeber an; vergleicht die Klemmenlage mit der am Rundenende und zeichnet bei jeder Aenderung sofort nach | **eine Partie** (5 von 5) |
| **3 Klemmenwache, ein Bild spaeter** | dasselbe, aber der Vergleich wartet einen Bildaufbau | **DREI Partien** (1x/2x · 3x · 4x) |
| **4 Klemmenwache, nur echter Klassenwechsel** | `attributeOldValue`, nur wenn an einem bestehenden Element eine Klemmklasse kam oder ging | **ZWEI Partien** (1x · 2x/3x/4x/6x) |

Fassung 2 ist die ausgelieferte. Sie ist die **teuerste** der drei
Klemmenwachen (861 Runden statt 202 in 62 Wochen, 519 Nachzuege) und die
einzige, die haelt: **jedes** Wiederanlegen einer Klemme kommt dem naechsten
Blick der Hand zuvor, nicht nur das an einem alten Element.

Fassung 3 und 4 stehen hier, weil sie beide „sauberer" aussahen und beide
messbar schlechter sind. Wer sie noch einmal versucht, findet hier die Zahl.

---

# DIE HARTE ABNAHME DER AUSGELIEFERTEN FASSUNG (Klemmenwache)

Stand **`7f30b3dfa40e`** auf Hafen 8946, jeder Lauf einzeln durch
`aufsicht/messfenster.sh`, `linie.mjs <epoche> 400`, `?saat=1350`.
Reihenfolge mit Absicht: **zuerst die beiden Epochen, die Fassung 1
verdorben hatte.**

## 1884 — drei Laeufe, EINE Pruefsumme

| Lauf | Zeit | md5 |
|---|---|---|
| e3-A | 06:16:44 | `32587e1d4e9c` |
| e3-B | 06:23:55 | `32587e1d4e9c` |
| e3-C | 06:30:50 | `32587e1d4e9c` |

Fassung 1 hatte hier **drei verschiedene** Pruefsummen. Der Rueckschritt ist
fort.

## 1600 — drei Laeufe, EINE Pruefsumme

| Lauf | Zeit | md5 |
|---|---|---|
| e2-A | 06:42:59 | `616c2ea42e00` |
| e2-B | 06:55:02 | `616c2ea42e00` |
| e2-C | 07:07:06 | `616c2ea42e00` |

Fassung 1 hatte hier **zwei** Pruefsummen. Auch dieser Rueckschritt ist fort.

---

# NEUANLAUF NACH DEM EINUNDZWANZIGSTEN RESET (7.8., ab 08:3x UTC)

## Der erste Griff war in die eigenen Messdaten, und er sitzt

`abnahme2/` ist der Satz der **ausgelieferten** Fassung 2 (Klemmenwache,
Stand `7f30b3dfa40e`, Hafen 8946). Er war beim Reset nicht ausgewertet.
Ausgewertet steht da:

| Epoche | Laeufe | Pruefsummen |
|---|---|---|
| 1600 | 3 | **1** — `616c2ea42e00` |
| 1884 | 3 | **1** — `32587e1d4e9c` |
| **1350** | **2** | **ZWEI** — `d558a8a12799` · `1a7c625b59e6` |

**1350 ist auf der ausgelieferten Fassung NICHT geheilt.** Das ist der Befund,
der beim Reset noch nicht dastand, und er kehrt die Lage um.

Die beiden 1350-Laeufe sind bis Woche 60 Ziffer fuer Ziffer gleich und gehen in
**Woche 61 (1352 W2)** auseinander — dieselbe Stelle wie auf dem Vorzustand:

| | e1-A | e1-B |
|---|---|---|
| Kassenspanne | **8–514** | **30–558** |
| Michaeli 1352, Kasse / LEITER-Zeilen | 164 / **0** | 119 / **3** |
| Schluss 1363 W11 | Kasse 98 | Kasse 140 |
| abweichende Wochen | — | **339 von 400** |

Das sind Ziffer fuer Ziffer die beiden alten Partien A (`ohneErbe`) und B
(`ohneGegner`). Die Klemmenwache allein stellt das Rennen nicht ab.

## Damit steht die Bilanz der Welle so — beide Fassungen halbfertig

| Epoche | Vorzustand `7a1a942` | **F1** Rundenschluss `5707219bc98a` | **F2** Klemmenwache `7f30b3dfa40e` |
|---|---|---|---|
| 1350 | 3 / **2** | 6 / **1** ✔ | 2 / **2** ✘ |
| 1600 | 3 / 1 | 3 / **2** ✘ | 3 / **1** ✔ |
| 1884 | 3 / 1 | 3 / **3** ✘ | 3 / **1** ✔ |
| 1970 | — | 2 / 1 | — |

**Keine der beiden Fassungen erfuellt die Abnahme.** F1 heilt genau das, was F2
offen laesst, und umgekehrt. Und das ist kein Zufall, sondern folgt aus dem,
was schon gemessen ist:

* Was 1350 heilt, ist das **Vorziehen der 420-ms-Frist** in
  `stuecke/preis.js:2737` — nur F1 tut das.
* Was 1600/1884 verdirbt, ist das Vorziehen von
  **`requestAnimationFrame`**, namentlich `stuecke/fuhre.js:2541`
  (`clientHeight`/`scrollHeight` — eine Messung, die einen fertigen
  Bildaufbau braucht) — nur F1 tut das.

F1 hat beides in einem Griff getan. **Die Trennung ist die Fassung 5:**
`setTimeout` waehrend einer Zeichenrunde vorziehen, `requestAnimationFrame`
**nicht anfassen**. Damit steht die eigene Lehre der Welle wortwoertlich im
Bau: *ein Rahmen darf einem Stueck sagen, WANN etwas zu tun ist, nicht WIE
seine Messung zustande kommt.* Ein `rAF` IST eine Messstelle (Layout fertig);
ein `setTimeout` ist keine, es heisst nur „spaeter".

Gefangen werden dabei im ganzen Spiel genau **zwei** Stellen — beide nachgesehen:
`stuecke/preis.js:2737` (420 ms, der Verursacher) und `stuecke/name.js:2272`
(0 ms, „noch einmal zeichnen, wenn Aufgeld kam"). Alle sieben rAF-Stellen
bleiben unberuehrt.

## Das schnelle Tor, das diesmal taugt — und warum der Drosselfaecher nicht taugte

Der Drosselfaecher hat F2 fuer 1350 **durchgewinkt** (5 von 5 dieselbe Partie
ueber 62 Wochen) und ist damit widerlegt: derselbe Stand spielt ungedrosselt
in 400 Wochen zwei Partien. Gleichmaessige Drosselung erkundet eine andere
Gegend als das natuerliche Zittern der Maschine.

Das richtige billige Tor steht in den Daten selbst: **die Partie entscheidet
sich in Woche 61.** Also `linie.mjs 1 62` — rund 40 s statt 7 Minuten —
mehrfach ungedrosselt hintereinander, und verglichen wird `kasseMichaeli`
von 1352: **164 = Partie A, 119 = Partie B.** Acht Laeufe kosten sechs
Minuten und beantworten dieselbe Frage wie sechs 400-Wochen-Laeufe.

---

# DRITTER ANLAUF (7.8., ab 12:1x UTC) — nach dem zweiundzwanzigsten Reset

## ZUERST: WELCHER MESSORDNER GEHOERT ZU WELCHER FASSUNG

Die Aufsicht hat die Prüfsummen selbst gezählt und gefragt, ob ein Ordner
Läufe aus zwei Fassungen mischt. **Er tut es nicht**, und der Beweis liegt in
den Prüfsummen selbst, nicht in meinem Wort. Nachgerechnet mit `md5sum`:

| Ordner | Fassung | Marke (`nachstand.sh`) | Prüfsummen |
|---|---|---|---|
| `abnahme-vorher/` | **Vorzustand**, Commit `7a1a942` | Hafen 8940 | e2 3× `5af1d5f1f2eb` · e3 3× `d36f613f391e` |
| `abnahme/` | **F1 Rundenschluss** | `5707219bc98a` | e1 6× `f250961e4ff7` · e2 `9d3319d927af`/`0694c7c336fe`/`9d3319d927af` · e3 `e4363a2c41af`/`5ff4fff54648`/`b49d340136ec` · e4 2× `5adfd2fb582b` |
| `abnahme2/` | **F2 Klemmenwache** | `7f30b3dfa40e` | e1 `d558a8a12799`/`1a7c625b59e6` · e2 3× `616c2ea42e00` · e3 3× `32587e1d4e9c` |

**Warum das dicht ist und nicht bloss behauptet:** `linie.mjs` schreibt den vom
Bildschirm abgelesenen Knopftext mit. Die Prüfsumme ist deshalb **zwischen
Ständen verschieden, auch bei gleicher Partie** — das ist die Falle aus
`rahmen-w10/ARBEITSSTAND.md`, und hier ist sie der Nutzen: kein einziger
Prüfsummenwert kommt in zwei Ordnern vor. Drei disjunkte Wertemengen =
drei Stände. Kein Ordner mischt.

**Gegenprobe an der Marke:** `nachstand.sh` bildet die Marke als md5 über alle
ausgelieferten Spieldateien. Der Arbeitsbaum, wie ich ihn vorgefunden habe,
rechnet sich zu **`7f30b3dfa40e`** — also byteweise der Stand, auf dem
`abnahme2/` gemessen wurde. Der vorgefundene Baum **ist** F2.

`5707219bc98a` und `7f30b3dfa40e` sind **keine Commits** (`git cat-file` kennt
sie nicht) — sie sind Nachstands-Marken. Wer sie für Commits hält, sucht
vergeblich.

## Der Bau: FASSUNG 5 = F1 minus `requestAnimationFrame`

Gebaut, was am Ende des zweiten Anlaufs als Trennung benannt war. `runde.js`
ist **wortgleich F1**, mit genau diesen Schnitten:

* `window.requestAnimationFrame` / `cancelAnimationFrame` werden **nicht mehr
  umhüllt**. `oRAF`, `oCAF`, `hatRAF` sind fort.
* Die Schlange kennt nur noch eine Art (`merke(fn, args)` statt
  `merke(art, fn, args)`); `fuehreAus` und `zurueckAnDieUhr` entsprechend.
* Die Klemmenwache aus F1 bleibt Zeile für Zeile, nur in `B.wage` eingepackt
  (aus F2 übernommen) und in eine benannte Funktion `pruefeKlemmen` gezogen.

Gefangen werden dadurch im ganzen Spiel **zwei** Stellen statt neun:
`stuecke/preis.js:2737` (420 ms, der Verursacher) und `stuecke/name.js:2272`
(0 ms). Alle sieben rAF-Stellen bleiben unberührt — namentlich
`stuecke/fuhre.js:2541`, an dem F1 1600 und 1884 zerbrochen hat.

`kern/buehne.js` und `spiel/index.html` bleiben, wie sie in F1/F2 waren.

## Das schnelle Tor auf F5 — Stand `813f776`, Hafen 8950, 62 Wochen, ungedrosselt

Jeder Lauf einzeln durch `aufsicht/messfenster.sh`, `linie.mjs 1 62`,
`?saat=1350`. `kasseMichaeli` 1352: **164 = Partie A · 119 = Partie B.**
Gerät: `rahmen-w12/tor62.sh`.

| Lauf | kasseMich 1352 | LEITER | Kasse | Partie |
|---|---|---|---|---|
| 1 | 119 | 3 | 34–315 | **B** |
| 2 | 119 | 3 | 34–315 | **B** |
| 3 | 119 | 3 | 34–315 | **B** |
| 4 | 119 | 3 | 34–315 | **B** |
| 5 | 119 | 3 | 34–315 | **B** |

**Fünf von fünf: Partie B.** Das Tor ist offen — es sagt nur, dass sich die
Abnahme lohnt, nicht dass sie besteht (siehe die Warnung in `tor62.sh`).

# DIE HARTE ABNAHME DER FASSUNG 5 — Stand `813f776`, Hafen 8950

Jeder Lauf **einzeln** durch `aufsicht/messfenster.sh`,
`rueckkopplung-r3/linie.mjs <epoche> 400`, `?saat=1350`, Gerät
`rahmen-w12/lauf.sh`, Ordner `rahmen-w12/abnahme5/`. Die Marke des Hafens
wird **vor jedem Lauf** geprüft; ein Lauf gegen eine falsche Marke bricht ab.

Reihenfolge mit Absicht: **1884 zuerst** — das ist die Epoche, die F1 am
lautesten verdorben hat (3 Läufe, 3 Prüfsummen). Wenn die Trennung
(`rAF` unberührt) trägt, muss sie hier zuerst zu sehen sein.

## 1884

| Lauf | fertig | md5 | Kassenspanne |
|---|---|---|---|
| e3-A | 12:55:20 | `3f008dc880b9` | 2.907–25.557 |
| e3-B | 13:00:41 | `3f008dc880b9` | 2.907–25.557 |
| e3-C | 13:05:52 | `3f008dc880b9` | 2.907–25.557 |

**Drei Läufe, EINE Prüfsumme.** F1 hatte hier drei verschiedene. Der
Rückschritt, den das Vorziehen von `requestAnimationFrame` gekostet hat, ist
mit dem Vorziehen fort — und das Vorziehen der Fristen allein kostet ihn
nicht. Damit steht die Trennung als Messung da, nicht als Behauptung.

## 1350 — die Epoche, an der F2 gescheitert ist. Sechs Läufe verlangt.

| Lauf | fertig | md5 | Kassenspanne |
|---|---|---|---|
| e1-A | 13:11:19 | `3e87b7a47385` | 34–524 |
| e1-B | 13:16:44 | `3e87b7a47385` | 34–524 |
| e1-C | 13:22:11 | `3e87b7a47385` | 34–524 |
| e1-D | 13:27:37 | `3e87b7a47385` | 34–524 |
| e1-E | 13:33:10 | `3e87b7a47385` | 34–524 |
| e1-F | 13:38:41 | `3e87b7a47385` | 34–524 |

**Sechs Läufe, EINE Prüfsumme.** Das ist die Bedingung, an der F2 gescheitert
ist (2 Läufe, 2 Prüfsummen) und die F1 als einzige erfüllt hatte. F5 erfüllt
sie, ohne 1884 zu verderben.

Die Kassenspanne ist **34–524** und damit weder die alte Partie A (8–514) noch
die alte Partie B (30–558). Das schnelle Tor sagt für die ersten 62 Wochen
`kasseMichaeli` 1352 = 119, also den Ast der Partie B — über die vollen 400
Wochen läuft die Partie danach anders weiter als die alte B, weil der
Fristenschluss auch die späteren Augenblicke festlegt, an denen die alte B
noch gezittert hat. Der Auftrag lässt das ausdrücklich zu: verlangt ist EINE
Partie, nicht die alte.

## 1600
