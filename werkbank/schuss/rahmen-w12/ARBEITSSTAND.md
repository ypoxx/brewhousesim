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
