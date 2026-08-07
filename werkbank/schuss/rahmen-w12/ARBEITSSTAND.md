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
