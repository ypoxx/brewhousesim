# Welle 8 — DIE STADT, Baubericht

*Laufend geschrieben. Stand des Baumes beim Start: `76f3ca4`.*

## Auftrag

- **Teil A** — die Reiterzeile deckt 47 % des untersten Sechstels bei 8 % der
  Gesamtfläche. Nicht weniger anzeigen, sondern woanders anzeigen. Die
  Welle-7-Arbeit (zehn Reiter mit Namen UND lebender Kennzahl, 0 abgeschnittene
  Kästen) darf nicht zurückgenommen werden.
- **Teil B** — der vordere Hof ist leer, auch voll ausgebaut, in allen vier
  Epochen; in dreien ist das Tor leer. Was fehlt, sind flache Dinge auf dem
  Hofboden, keine weiteren Bauten.

## Messstand

| | |
|---|---|
| Hafen | 8907 (Arbeitsbaum) |
| Vorher-Sicherung | `werkbank/schuss/stadt-w8/vor/` — die fünf STADT-Dateien im Stand `76f3ca4` |
| Geräte | `stadt-w8/deckkarte.mjs` (Pixeldeckung je Rasterzelle), `stadt-w8/freiflaeche.mjs` (Kastenhüllen), dazu die Geräte der Aufsicht |

---

## BEFUND 1 — die 47 % sind nicht die Reiterzeile, sie sind die ganze Werkbank

Die Aufsicht schreibt „DIE STADT deckt allein 47 % des untersten Sechstels …
Es ist ihre Reiterzeile". Nachgemessen mit `aufsicht/deckung-je-stueck.mjs`
und mit den Kastenmaßen aus dem DOM:

| | Maß auf 2752×1536 | Fläche | des untersten Sechstels |
|---|---|---|---|
| `.stadt-werkbank` gesamt | x 33 · y 1331 · **1723 × 194** | **7,85 %** | **47,1 %** |
| davon Reiterzeile | 1723 × 56 | 1,94 % | **11,6 %** |
| davon Bauhof-Lade | 1723 × 132 | 5,91 % | **35,5 %** |

*(Pixelvergleich je Kasten, `stadt-w8/deckkarte.mjs`, Zahlen aus 1350; über
alle vier Epochen streut die Reiterzeile gar nicht (1,94 % / 11,6 %) und die
Lade um zwei Hundertstel (5,91–5,94 % / 35,5–35,6 %). Ein erster Anlauf des
Geräts lieferte für alle drei Zeilen dieselbe Zahl: er schaltete die Kette
nach oben sichtbar und damit die Geschwister mit. Verzeichnet, damit es
niemand wiederholt.)*

Die von `deckung-je-stueck.mjs` gemessenen 8,0 % / 47,1 % sind **Ziffer für
Ziffer die Werkbank** — DIE STADT deckt außerhalb dieses einen Kastens nichts
(die Ortsmarken sind 26×26 px). **Drei Viertel des Problems sind die
Bauhof-Lade, nicht die Reiterzeile.** Wer nur die Reiterzeile verschiebt,
kommt von 47,1 % auf 35,5 % und nicht auf 0.

Daraus folgt für Teil A: es muss die **ganze Werkbank** umziehen.

## BEFUND 2 — der Stand der Reiter war NICHT „alles steht"

Auf der Entwurfsleinwand 2752×1536 zeigen zwei der zehn Reiter als Namen nur
„…" (im Bildschirmfoto `stadt-w8/vor-e1.png` der dritte und der fünfte).
`setzeAufschrift()` (stadt.js:640) kürzt sauber statt abzuschneiden — die
vierte Latte zählt deshalb null Überläufe —, aber **auf dem Schirm steht
weniger als der volle Name.** Zehn Reiter brauchen rund 2.300 Bezugspixel und
haben in der Zeile 1.688.

Das ist die eigentliche Chance von Teil A: eine Werkbank, die **umbricht**,
hat mehr Zeilenlänge als eine, die in einer Zeile bleibt.

---

## Zahlen VORHER — `aufsicht/deckung-je-stueck.mjs`, Hafen 8907, 2752×1536

| Epoche | Oberfläche gesamt | unterstes Sechstel | DIE STADT gesamt | DIE STADT unten |
|---|---|---|---|---|
| 1350 | 27,8 % | 60,7 % | 8,0 % | **47,1 %** |
| 1600 | 28,2 % | 59,6 % | 8,0 % | **47,3 %** |
| 1884 | 27,1 % | 60,1 % | 8,0 % | **47,2 %** |
| 1970 | 27,7 % | 59,5 % | 8,0 % | **47,1 %** |

Roh: `werkbank/schuss/stadt-w8/deckung-vorher.txt`,
`werkbank/schuss/stadt-w8/deckkarte-vorher.json`.

*(wird fortgeschrieben)*

---

## WAS GEBAUT WURDE

### Teil A — die Werkbank hängt jetzt unter der Kopfleiste

`stil/stadt.css`: `.stadt-werkbank` von `bottom: 0,7 % · width: 62,6 %` auf
`top: 7,8 % · width: 46 %`; die Reiterzeile darin auf `max-width: 71,7 %`
(= 33 % der Bühne) und `flex-wrap: wrap`; die Bauhof-Lade auf ein Raster mit
drei gleichen Spalten.

**Warum genau dorthin, vier Bedingungen, jede gemessen** (Gerät
`stadt-w8/deckkarte.mjs`, Pixeldeckung je Rasterzelle, und
`stadt-w8/freiflaeche.mjs`, Kastenmaße aus dem DOM):

1. Rechts von x = 941 px beginnt die **Hauszeile des Skeletts** (x 952, y 160,
   847 × 39). Deshalb endet die *Reiterzeile* bei 33 %. Die *Lade* beginnt erst
   bei y 246, also unter der Hauszeile, und darf die vollen 46 % nehmen — das
   ist der Unterschied zwischen 410 und 299 Bezugspixeln je Bauknopf und damit
   zwischen „Verwaltungsbau" und „Verwaltungsba".
2. y = 120 liegt 7 px unter der Kopfleiste (endet bei 113).
3. Hausschild (y 957), Hoftor, Hofraute (Scheitel 823|1206) und der ganze
   vordere Hof liegen darunter und werden nicht mehr berührt.
4. St. Michael (x 1587–1680), Gasthof Lindenhof, Fluss und Brücke — die vier
   Wahrzeichen, die der Blindvergleich abgenommen hat — liegen rechts davon.

**Was am Schirm steht, steht mehr als vorher.** Name und Kennzahl brechen jetzt
um (`white-space: normal` statt `nowrap` mit Auslassungspunkten), weil die
Werkbank oben nach unten wachsen darf statt ins Stadtfenster.
Gerät `stadt-w8/reiterprobe.mjs`, zehn Reiter, vier Epochen, zwei Fenster:

| | gekürzter NAME | gekürzte KENNZAHL | Überlauf |
|---|---|---|---|
| **2752×1536 vorher** | 1–4 je Epoche | 4–5 | 0 |
| **2752×1536 nachher** | **0** | **0** | **0** |
| **1366×768 vorher** | 2 | 7 | 0 |
| **1366×768 nachher** | **0** | **0** | **0** |

Roh: `stadt-w8/reiterprobe-vorher.json` gegen `stadt-w8/reiterprobe-a4.json`.

**Zurückgenommen:** `#buehne .stadt-werkbank { width: 80 % }` unterhalb von
1612 px. Diese Zeile war richtig, solange die Werkbank unten lag; oben legte
sie sich in jeder Fenstergröße auf die Hauszeile. Was die Breite leisten
musste, leistet jetzt der Umbruch — nachgemessen, siehe Tabelle.

### Teil B — die Hoffracht

Zwölf neue freigestellte WebP in `spiel/bild/hof/` (`fracht_*`, `tor_*`), aus
drei 2×2-Bögen von `gen_image.py` (`gemini-3-pro-image`, `--ref` auf die eigene
Platte, reines Magenta als Grund). Neue Tabelle `K.fracht` in `stadt-daten.js`,
neue Funktionen `frachtbild/zeichneFracht` in `stadt.js`, neue Klasse
`.stadt-fracht` in `stadt.css`.

Fracht kostet nichts, trägt **keinen `data-zug`** (bläht Spalte (a) der zweiten
Latte nicht auf) und liegt in der Ebene `bau` — sie ist Bild und keine
Oberfläche. `wenn` bindet sie an den Spielstand: `keller` (Gespann fährt nur,
wenn Fass im Keller liegen), `kellervoll` (der zweite Stapel kommt ab halbem
Lagerplatz) — der Vorschlag des Kritikers wörtlich.

**Kein Fuß liegt auf der Mauer.** Jede Stelle ist gegen die Mauerformel
gerechnet (`K.boden`: Scheitel 29,9|78,5, links 0,49, rechts 0,45 px je px,
× 2752/1536 in Prozentpunkte) — und zwar an den **Bildrändern**, nicht in der
Mitte, weil ein 6,5 % breites Bild an seinem linken Rand 3,25 Punkte weiter
außen steht, wo die Mauer schon höher liegt. Zwei erste Stellen sind daran
gescheitert und wurden verschoben.

Das Gespann im Tor liegt als einziges auf `boden: 'gasse'` und steht auf der
Straße vor dem Tor (42 | 80) — im Zielbild jeder Epoche fährt es dort heraus,
und dort deckt es nichts mehr zu, weil die Werkbank aus dem Streifen weg ist.

### Das Gewichtsveto hält

| Epoche | vor Welle 8 | nach Teil B |
|---|---|---|
| 1350 | 6,04 MB | 6,25 MB |
| **1600 (schwerste)** | **7,42 MB** | **7,63 MB** |
| 1884 | 6,37 MB | 6,57 MB |
| 1970 | 4,32 MB | 4,45 MB |

Gemessen mit `aufsicht/gewicht-gegenprobe.mjs`, dem Gerät der Aufsicht, nicht
mit dem eigenen. **0,37 MB Luft.**

---

## Zahlen NACHHER — dasselbe Gerät, derselbe Hafen, dieselbe Saat

`aufsicht/deckung-je-stueck.mjs`, 2752×1536:

| Epoche | Oberfläche gesamt | unterstes Sechstel | DIE STADT gesamt | DIE STADT unten |
|---|---|---|---|---|
| 1350 | 27,8 → **29,6 %** | 60,7 → **13,4 %** | 8,0 → 10,6 % | 47,1 → **0,0 %** |
| 1600 | 28,2 → **30,3 %** | 59,6 → **11,9 %** | 8,0 → 11,2 % | 47,3 → **0,0 %** |
| 1884 | 27,1 → **29,1 %** | 60,1 → **12,5 %** | 8,0 → 10,8 % | 47,2 → **0,0 %** |
| 1970 | 27,7 → **29,8 %** | 59,5 → **11,9 %** | 8,0 → 10,6 % | 47,1 → **0,0 %** |

**Das unterste Sechstel fällt von 59,5–60,7 % auf 11,9–13,4 %.** Was dort noch
liegt, ist die Kopfleiste mit ihrem WEITER-Knopf (8,6–9,4 %) und rund drei
Punkte, die keinem Stück zugeordnet sind. **DIE STADT trägt dort null.**

> ### UND DER PREIS DAFÜR, weil er sonst geschönt wäre
>
> **Die Gesamtdeckung steigt um 1,8 bis 2,1 Punkte**, von 27,1–28,2 % auf
> 29,1–30,3 %. Das ist kein Messfehler, das ist Arithmetik: die Werkbank zeigt
> jetzt **jeden** Namen und **jede** Kennzahl ganz (vorher 7 bis 9 gekürzte
> Zeilen je Epoche), und mehr Schrift braucht mehr Fläche. Der Kasten ist von
> 1723 × 194 auf 1266 × 442 gewachsen.
>
> Wer die 1,8 Punkte nicht will, hat sie mit **einer** Zeile zurück:
> `.knopf.stadt-reiter .zahl { white-space: nowrap; }` in `stil/stadt.css`.
> Das kostet die vier bis fünf gekürzten Kennzahlen von Welle 7 zurück — genau
> den Stand, den Welle 8 ausdrücklich nicht zurücknehmen soll. Deshalb steht
> die Zeile so, wie sie steht, und der Preis steht hier.
>
> Die Rechnung, die ich für richtig halte: **1,8 Punkte Deckung in der
> Hügellinie gegen 47 Punkte im Vordergrund** — dort, wo jedes Zielblatt
> Marktstand, Fuhrwerk und Asphalt trägt.

## Was diese Welle NEBENBEI bewegt hat, ohne dass es beauftragt war

**Das Hausschild ist frei.** Der Blindvergleich hatte in 1350 gemessen, dass
die Karte `DER SUD · 1350` **65,7 % beim Laden und 75,6 % nach dem Spielen**
des Schildes `BRAUHAUS ZUM ANKER · GEGR. 1350` zudeckt — sein erster Punkt
unter „damit es kippt". Der ist erledigt, aber **nicht von mir**: DER SUD sucht
für seinen Kesselzettel selbst eine freie Stelle (`sud.js:stelleZettel`), und
weil die Werkbank den unteren Rand geräumt hat, hat er eine andere gefunden.
Im Schuss `stadt-w8/a4-e1.png` steht das Schild vollständig da.

**Und dieselbe Ursache kostet in 1884 einen Pflock.** Bei 1366×768 sitzt der
Kesselzettel jetzt 46 px höher (y 347 → 301) und liegt damit auf dem Pflock
`stadt:marke:fuhre-muehle`. Der Abräumer der STADT nimmt einen Pflock weg, den
die Maus nicht trifft (die Regel „KEIN TOTER KNOPF IM BILD", Auflage 3 aus
Welle 7) — **die Marke selbst bleibt stehen, die Auskunft geht nicht
verloren**, aber die Zahl der erreichbaren Züge in 1884 fällt von 86 auf 85.
Gemessen mit einem Zugvergleich über beide Häfen, alle vier Epochen; die
anderen drei sind Ziffer für Ziffer gleich (105 / 113 / 107).

> Das ist ein **fremder** Befund und wird deshalb gemeldet und nicht geheilt:
> die Stelle liegt in `sud.js`, und am fremden Stück wird nicht gedreht.

## Ein offener Befund am eigenen Stück: `FENSTER` stimmt nicht mehr

`stadt.js:442` hält `FENSTER = { x0: 0, y0: 11,2, x1: 100, y1: 87,5 }` — das
„Stadtfenster", in dem fremde Bretter ruhen dürfen und in das die Pflöcke
ausweichen. **Die 87,5 waren die Oberkante der alten Werkbank, die 11,2 die
Unterkante der Kopfleiste.** Beides beschreibt die Bühne nicht mehr: unten ist
jetzt frei, oben liegt die Werkbank.

Ich habe es **absichtlich nicht geändert.** `FENSTER` geht über `anteil()` in
die Schwellen GRENZE (0,035) und MARKE (0,024) ein und entscheidet damit, ob
ein fremdes Brett aufliegt oder als Reiter ruht — das bewegt das Bild jeder
Epoche und damit ρ. Eine solche Änderung gehört in eine Runde, in der sie
allein gemessen wird, nicht in dieselbe wie zwei andere.

## Abnahme

| | |
|---|---|
| `node --check` auf `stadt.js`, `stadt-daten.js`, `stadt-zusatz.js` | OK |
| `tor.mjs` | **TOR OFFEN** — vier Epochen, `lage` 0, 0 Fehler |
| `spielprobe.mjs` | **BESTANDEN** — 4 × 60 Wochen, 0 Fehler |
| `lesbarkeit.mjs` 1366×768 | **14 Überläufe · 505 Textknoten · 0 von 329 Knöpfen** — vorher 14 / 505 / 0 von 330 |
| Gewichtsveto | 7,63 MB in der schwersten Epoche gegen 8 |

Die Lesbarkeitszahlen sind **an beiden Häfen im selben Lauf** erhoben; der
Vorher-Hafen liefert Ziffer für Ziffer die in WELLE-8.md eingetragenen
14 / 505 / 0 von 330. Das ist die Gerätekontrolle für diesen A/B.

## BEFUND ZUM GEWICHT, wie beauftragt gemeldet und NICHT angefasst

In der schwersten Epoche (1600) liegen unter den 7,63 MB **1,17 MB in zwei
nicht umgestellten PNG fremder Stücke**:

| Datei | Größe | gehört |
|---|---|---|
| `spiel/bild/name/schild2.png` | **683 KB** | DER NAME |
| `spiel/bild/gegner/hof2.png` | **489 KB** | DER GEGNER |

Zum Vergleich: die zwölf neuen Frachtbilder dieser Welle wiegen zusammen
640 KB, und in der schwersten Epoche laden davon vier mit 203 KB. **Eine
einzige fremde Datei wiegt mehr als die ganze Hoffracht.** Die Umstellung von
PNG auf WebP hat in Welle 7 für die 32 Hofbilder 27 → 13 MB gebracht;
dasselbe Gerät (`stadt-gewicht/umpacken.mjs`) liegt im Repo und ist auf jeden
Ordner anwendbar.
