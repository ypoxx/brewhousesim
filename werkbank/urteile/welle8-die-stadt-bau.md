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

Auf der Entwurfsleinwand 2752×1536 stehen in 1350 **drei von zehn Namen und
vier von zehn Kennzahlen gekürzt** da; zwei der drei Namen sind auf ein blankes
„…" zusammengeschrumpft (im Bildschirmfoto `stadt-w8/vor-e1.png` der dritte und
der fünfte Reiter). Bei 1366×768 sind es zwei Namen und sieben Kennzahlen.
`setzeAufschrift()` (stadt.js:640) kürzt sauber statt abzuschneiden — die
vierte Latte zählt deshalb null Überläufe —, aber **auf dem Schirm steht
weniger als der volle Name.** Zehn Reiter brauchen rund 2.300 Bezugspixel und
haben in der Zeile 1.688.

> **Ein Überlaufzähler kann diese Regression nicht sehen.** Deshalb steht
> `stadt-w8/reiterprobe.mjs` daneben: es liest den *gezeigten* Text gegen den
> vollen Titel. Ohne dieses Gerät hätte ich Teil A für erledigt halten können,
> während auf dem Schirm „…" steht.

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
`werkbank/schuss/stadt-w8/deckkarte-vorher.json`. Die Zahlen stimmen mit denen
der Aufsicht (27,1–28,2 % / 59,5–60,7 %) Ziffer für Ziffer überein — das ist
die Gerätekontrolle vor dem ersten Handgriff.

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
   bei y 353, also weit unter der Hauszeile, und darf die vollen 46 % nehmen — das
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
> jetzt **jeden** Namen und **jede** Kennzahl ganz (vorher sechs bis neun
> gekürzte Zeilen je Epoche: 3+4 in 1350, 4+5 in 1600, 3+5 in 1884, 1+5 in
> 1970), und mehr Schrift braucht mehr Fläche. Der Kasten ist von 1723 × 194
> auf 1266 × 442 gewachsen.
>
> **Wo die 1,8 Punkte genau liegen, mit dem Messband nachgehalten:** derselbe
> Kasten maß auf dem Weg dorthin 1266 × **330**, solange Name und Kennzahl noch
> einzeilig mit Auslassungspunkten standen (`reiterprobe-a2.json`), 1266 × 382
> mit umbrechender Kennzahl (`-a3`) und 1266 × 442 mit beidem (`-a4`).
> **Die beiden `white-space: normal` sind der ganze Aufschlag**; ohne sie läge
> die Werkbank bei rund 8,8 % statt 11,2 % und die Gesamtdeckung wieder bei
> 28–29 %.
>
> Zwei Zeilen in `stil/stadt.css` nehmen ihn zurück
> (`.knopf.stadt-reiter .wort` und `.zahl` auf `white-space: nowrap`) — und mit
> ihm genau den Stand, den Welle 8 ausdrücklich **nicht** zurücknehmen soll.
> Deshalb stehen sie, wie sie stehen, und der Preis steht hier.
>
> Die Rechnung, die ich für richtig halte: **1,8 Punkte Deckung in der
> Hügellinie gegen 47 Punkte im Vordergrund** — dort, wo jedes Zielblatt
> Marktstand, Fuhrwerk und Asphalt trägt.

## Das Hausschild — pixelgemessen, nicht behauptet

Der Blindvergleich hatte für 1350 gemessen: die Karte `DER SUD · 1350` deckt
das Schild `BRAUHAUS ZUM ANKER · GEGR. 1350` zu **65,7 % beim Laden und 75,6 %
nach dem Spielen** zu. Das war der erste Punkt seiner Liste „damit es kippt".

Nachgestellt mit `stadt-w8/schild.mjs` (Kasten aus dem DOM, Pixelvergleich
derselben Seite mit und ohne die Oberflächenebenen), beim Laden, beide Häfen:

| Epoche | Kasten | vor Welle 8 | nach Welle 8 |
|---|---|---|---|
| **1350** | (1330\|957) 175×99 | **66,9 %** | **0,0 %** |
| 1600 | (1132\|888) 217×116 | 0,0 % | 0,0 % |
| 1884 | (1258\|957) 228×117 | 0,0 % | 0,0 % |
| 1970 | (470\|904) 206×67 | 0,0 % | 0,0 % |

Der Kasten stimmt auf den Pixel mit dem überein, den der Kritiker angegeben
hat — (1330|957), 175×99. Der Vorher-Wert 66,9 % gegen seine 65,7 % ist der
Unterschied zwischen `b6b06bb` und `76f3ca4`, nicht zwischen zwei Geräten.

**Das eigene Schild ist frei. Aber nicht durch mich** — siehe gleich darunter.

## Was diese Welle NEBENBEI bewegt hat, ohne dass es beauftragt war

**Das Hausschild ist frei.** Der Blindvergleich hatte in 1350 gemessen, dass
die Karte `DER SUD · 1350` **65,7 % beim Laden und 75,6 % nach dem Spielen**
des Schildes `BRAUHAUS ZUM ANKER · GEGR. 1350` zudeckt — sein erster Punkt
unter „damit es kippt". Der ist erledigt, aber **nicht von mir**: DER SUD sucht
für seinen Kesselzettel selbst eine freie Stelle (`sud.js:stelleZettel`), und
weil die Werkbank den unteren Rand geräumt hat, hat er eine andere gefunden.
In den Schüssen `stadt-w8/a4-e1.png` (nur Teil A) und `stadt-w8/b3-e1.png`
(mit Hoffracht) steht das Schild vollständig da.

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

| Datei | über die Leitung | auf der Platte | gehört |
|---|---|---|---|
| `spiel/bild/name/schild2.png` | **683 KB** | 682 KB | DER NAME |
| `spiel/bild/gegner/hof2.png` | **489 KB** | 488 KB | DER GEGNER |

Zum Vergleich: die zwölf neuen Frachtbilder dieser Welle wiegen zusammen
640 KB, und in der schwersten Epoche laden davon vier mit 203 KB. **Eine
einzige fremde Datei wiegt mehr als die ganze Hoffracht.** Die Umstellung von
PNG auf WebP hat in Welle 7 für die 32 Hofbilder 27 → 13 MB gebracht;
dasselbe Gerät (`stadt-gewicht/umpacken.mjs`) liegt im Repo und ist auf jeden
Ordner anwendbar.

## „Was gegraben wird, bleibt" — nachgewiesen, nicht behauptet

`diff` der gesicherten Fassung gegen die neue, Block `aufbauten` in
`stadt-daten.js`: **byteweise identisch**. Über die ganze Datei gibt es
**null entfernte Zeilen** — die Welle hat nur die Tabelle `fracht` hinzugefügt.
Kein Ort, kein `dx`, kein `dy`, keine `breite` eines Aufbaus ist angefasst.
Der Ziehbrunnen steht, wo er 1350 gegraben wurde.

In `stadt.js` sind elf Zeilen entfernt, alle in **zwei Kommentaren**, die den
alten Vertrag der Werkbank beschrieben („sie fängt erst bei 87,5 Prozent der
Höhe an"). In `stadt.css` sind es vierzehn Zeilen, alle in den drei Regeln,
die diese Welle absichtlich umschreibt (`bottom`/`width` der Werkbank,
`nowrap`+`ellipsis` an Reitername und Kennzahl, `flex` der Bauzeile) plus die
zurückgenommene 80-%-Zeile. `stadt-zusatz.js`: unverändert.

---

## ρ — VORHER UND NACHHER, als A/B im selben Augenblick

**Warum A/B und nicht nacheinander:** seit dem 5. August ist gemessen, dass
**Layout ρ bewegt** — der Knopfboden verschob 1970 um 0,811 bei null Fehlern in
beiden Läufen. Diese Welle verschiebt einen Kasten von 1723 × 194 px vom
unteren an den oberen Rand. Wer vorher und nachher zu verschiedenen Zeiten
misst, kann hinterher nicht mehr sagen, was die Zahl bewegt hat.

Also zwei Häfen aus **demselben Baum**, die sich in **genau fünf Dateien**
unterscheiden:

| | |
|---|---|
| Hafen 8908 „vor" | Symlinkwald `stadt-w8/hafen-vor/`; nur `stadt.js`, `stadt-daten.js`, `stadt-zusatz.js`, `stadt.css`, `stadt-zusatz.css` kommen aus `stadt-w8/vor/` (Stand `76f3ca4`) |
| Hafen 8907 „nach" | der Arbeitsbaum |

**Gerätekontrolle des Vorher-Hafens, bevor eine einzige ρ-Zahl fiel:**
`lesbarkeit.mjs` bei 1366×768 liefert dort **14 Überläufe · 505 Textknoten ·
0 von 330 Knöpfen** — Ziffer für Ziffer die in `gauntlet/WELLE-8.md`
eingetragenen Zahlen. Der Hafen ist damit nachweislich der Stand von vorher.

Skript `stadt-w8/rho/lauf.sh`, wiederaufnehmbar, jeder Aufruf einzeln durch
`aufsicht/messfenster.sh`, Reihenfolge Satz A über alle vier Epochen auf beiden
Häfen, dann B, dann C — wer mitten im Lauf abbricht, hat trotzdem ein
gepaartes Bild. Rohdaten `stadt-w8/rho/*.json`, gerechnet mit dem vorhandenen
Gerät `sud-w6-nach/schnitte.py` über alle drei Schnitte.

### Satz A, alle acht Läufe durch — 6. August, 00:44 UTC

| Epoche | 12 Braujahre | 13 | 14 | Jahre < 1× |
|---|---|---|---|---|
| **1350 vor** | −0,245 | −0,170 | −0,336 | 1/14 |
| **1350 nach** | **−0,014** | **+0,137** | **−0,007** | 1/14 |
| **1600 vor** | +0,189 | −0,066 | −0,156 | 1/14 |
| **1600 nach** | **+0,476** | **+0,297** | **+0,160** | 1/14 |
| **1884 vor** | +0,168 | +0,346 | +0,393 | 1/14 |
| **1884 nach** | **−0,210** | **−0,016** | **+0,130** | 1/14 |
| **1970 vor** | **+0,699** | +0,637 | +0,653 | 1/14 |
| **1970 nach** | **+0,692** | **+0,330** | **+0,116** | **0/14** |

**|ρ| < 0,700 in allen vier Epochen über alle drei Schnitte, vorher wie
nachher.** Null Seitenfehler, kein Abbruch, alle Läufe volle 400 Wochen und
14 Braujahre. Roh: `stadt-w8/rho/ergebnis-A.txt`.

> ### DIE GERÄTEKONTROLLE, und sie ist so gut, wie sie sein kann
>
> Der Vorher-Hafen liefert für **1600, 1884 und 1970 Ziffer für Ziffer die in
> `gauntlet/MESSLATTE.md` eingetragenen Zahlen** — +0,189 / −0,066 / −0,156,
> +0,168 / +0,346 / +0,393 und **+0,699 / +0,637 / +0,653**. Das ist keine
> Näherung, das sind dieselben drei Nachkommastellen. Damit ist bewiesen: der
> Vorher-Hafen ist der Stand von vorher, und das Gerät misst, was es messen
> soll.
>
> **1350 weicht ab** — −0,245 / −0,170 / −0,336 gegen die eingetragenen
> −0,259 / −0,236 / −0,380. Der Unterschied ist nicht meiner: die
> eingetragenen Zahlen stammen vom eingefrorenen Stand `b6b06bb`, meine vom
> Baum `76f3ca4`. Dazwischen liegt Arbeit anderer Stücke. Beide Reihen liegen
> weit unter der Latte, und der Abstand nach oben ist in derselben Größenordnung.

> ### WAS ICH BEWEGT HABE — und ich sage es, bevor der Kritiker es sagt
>
> **Layout bewegt ρ, und diese Welle verschiebt einen Kasten von 1723 × 194 px
> über die halbe Bühne.** Der Ausschlag ist gemessen, nicht geschätzt, und er
> ist in jeder Epoche anders:
>
> | Epoche | Δρ bei 12 Braujahren | Richtung |
> |---|---|---|
> | 1350 | **+0,231** | von −0,245 auf −0,014 — näher an null |
> | 1600 | **+0,287** | von +0,189 auf +0,476 — **weiter von null weg** |
> | 1884 | **−0,378** | von +0,168 auf −0,210 — Vorzeichen gedreht |
> | 1970 | **−0,007** | von +0,699 auf +0,692 |
>
> **Drei Dinge gehören unmittelbar daneben, sonst ist die Meldung geschönt:**
>
> 1. **1600 ist um 0,287 schlechter geworden.** Es steht bei +0,476 und damit
>    weiter unter der Latte, aber der Abstand ist von 0,511 auf 0,224
>    geschrumpft. Wer als nächster an dieser Epoche baut, muss das wissen.
> 2. **1970 steht weiter auf einem Tausendstel-Rand** — +0,692 statt +0,699.
>    Der Riss ist nicht behoben, er ist um sieben Tausendstel weiter weg.
>    Wer sich darauf verlässt, verlässt sich auf 0,008. Dafür sind die
>    Schnitte 13 und 14 deutlich besser (+0,637 → +0,330, +0,653 → +0,116),
>    und **1970 hat zum ersten Mal null Braujahre unter 1×** statt einem.
> 3. **Der Ausschlag geht in beide Richtungen und ist in 1884 größer als der
>    Abstand zur Latte in 1600.** Das ist kein Zufallsrauschen: die Spannweite
>    innerhalb eines Laufs ist 0,000, und beide Läufe jeder Zeile sind
>    fehlerfrei über volle 400 Wochen. Es ist eine **andere Partie**, genau wie
>    beim Knopfboden am 5. August — die Werkbank gibt 47 Punkte des unteren
>    Sechstels frei, und darunter liegen fremde Züge, die vorher nicht
>    erreichbar waren.

### Satz B UND Satz C durch — 6. August, 03:23 UTC: BYTEWEISE IDENTISCH

**Alle 24 Läufe sind durch: drei je Epoche, vorher und nachher.** Die Sätze B
und C liefern dieselben Ziffern wie A, und zwar nicht nur auf drei
Nachkommastellen: **die Ergebnisdateien jeder Zelle haben in allen drei Sätzen
dieselbe md5** (`stadt-w8/rho/pruefsummen.txt`).

| | A = B = C |
|---|---|
| vor e1 | `ae23f4f661f23c2abd6c32864cbb6043` |
| vor e2 | `9265842fd8a5f97430b538a1d0f87cc6` |
| vor e3 | `bdbac962183ec785c3539cf094077227` |
| vor e4 | `89186aa6fb11fd1dcda6f8ff86a41e7a` |
| nach e1 | `8485064bc10f16ecda88f47c0180fccc` |
| nach e2 | `9840bec5447e87d4dcdfa38783e10de7` |
| nach e3 | `a69a57f5f467b7b61a54525f443df96b` |
| nach e4 | `182df2ef314d93d092b3eae627c6867a` |

Das ist die strengste Form der Gerätekontrolle, die dieser Lauf kennt — dieselbe,
mit der die Aufsicht am 5. August 1350 und 1970 abgenommen hat. Die Zahlen oben
stehen damit auf **drei** unabhängigen Läufen je Zelle. Spannweite 0,000 in
allen 24 Läufen, null Seitenfehler, kein Abbruch, jeder Lauf volle 400 Wochen
und 14 Braujahre. Roh: `stadt-w8/rho/ergebnis-ABC.txt`, `pruefsummen.txt`,
`lauf.log`.

> **Was die byteweise Gleichheit NICHT beweist**, damit sie niemand
> überliest: sie zeigt, dass das Gerät reproduzierbar ist, nicht dass die Zahl
> richtig ist. Der Würfel ist gesät, die Hand ist dieselbe, die Maschine war
> allein — drei gleiche Läufe sind unter diesen Bedingungen zu erwarten. Der
> Beleg für die *Richtigkeit* ist ein anderer: dass der Vorher-Hafen die
> eingetragenen Zahlen dreier Epochen Ziffer für Ziffer trifft.


---

## WAS ICH VERWORFEN HABE — und warum

**1 — Nur die Reiterzeile verschieben.** Der Auftrag nennt sie als Verursacher.
Die Messung sagt: sie trägt 11,6 % des untersten Sechstels, die Bauhof-Lade
35,5 %. Wer nur den Reiter verschiebt, kommt auf 35 statt auf 0. Verworfen,
bevor die erste Zeile CSS geschrieben war — das ist der Wert von BEFUND 1.

**2 — Die Werkbank NACH OBEN, aber schmal und hoch am linken Rand (eine
senkrechte Reiterleiste).** Gerechnet und verworfen: ein senkrechter Reiter
braucht die volle Spaltenbreite für seinen Namen. Zehn Reiter à 330 × 56 sind
194.000 px² gegen 96.000 waagerecht — **doppelte Fläche für denselben Text.**
Waagerechte Schrift ist flächeneffizient; das ist keine Geschmacksfrage.

**3 — Die Werkbank NUR nach oben schieben und sonst nichts.** Bei 62,6 %
Breite hätte sie ab x = 952 auf der Hauszeile des Skeletts gelegen. Fremde
Oberfläche zu verdecken senkt die Deckungszahl nicht (die Fläche war schon
gedeckt) und nimmt einem anderen Stück seine Zeile. Deshalb die Zweiteilung
33 % / 46 %.

**4 — Die Werkbank in die Mitte zwischen Schornstein und Kirchturm
(x 622 – 1572).** Das hätte den Wasserturm und den Schornstein von 1884/1970
freigelassen — die Lücke zwischen beiden ist 967 px breit und der Kasten
braucht 950. Verworfen, weil in 1350 bei (805|478) das **Hauszeichen des
NAMEN** steht: der Kasten hätte es zu zwei Dritteln zugedeckt. Fremdes UI
zudecken war Fund Nummer eins des Blindvergleichs; ich baue ihn nicht nach.
Der Preis dafür steht im Kopf von `stil/stadt.css`: Wasserturm und
Schornstein liegen jetzt zu zwei Dritteln hinter der Werkbank.

**5 — Die Werkbank so hoch schieben, dass ihre Unterkante genau auf dem
untersten Sechstel sitzt (y 1086–1280).** Gerechnet: die Hofraute trägt
zwischen y 1086 und ihrem Scheitel (823|1206) die Fläche x 578–1090 — **genau
den vorderen Hof, den Teil B füllen soll.** Teil A hätte Teil B erschlagen.

**6 — Die zwei fetten eigenen Hofbilder dichter packen, um Luft für die
Fracht zu schaffen** (`laderampe` 407 KB, `brunnen` 294 KB). Gerät gebaut
(`stadt-w8/nachpacken.mjs`), gemessen, **verworfen**: die Gegenprobe kommt bei
Güte 0,80 auf **36,1 und 37,8 dB PSNR**, unter der 40-dB-Schwelle, die dieser
Lauf für „unsichtbar" benutzt. Ursache ist, dass diese Dateien seit Welle 7
schon WebP sind — ein zweiter verlustbehafteter Durchgang addiert sich.
Stattdessen: die Frachtbilder selbst von Güte 0,86 auf 0,78 (740 → 640 KB) und
`fracht_bank` nur in 1350. Damit hält das Veto ohne einen Eingriff in
bestehende Bilder.

**7 — `FENSTER` in `stadt.js:442` an die neue Lage anpassen.** Wäre richtig
(die 87,5 % waren die Oberkante der alten Werkbank), bewegt aber über
`anteil()` die Schwellen, ab denen fremde Bretter ruhen — und damit das Bild
jeder Epoche und ρ. In derselben Welle wie zwei andere Änderungen wäre nicht
mehr trennbar, was was bewegt hat. Als offener Befund gemeldet.

**8 — Die Hoffracht als kaufbare Aufbauten in `K.aufbauten`.** Verworfen: sie
hätte `data-zug` getragen und Spalte (a) der zweiten Latte um acht Einträge
aufgebläht, die keine Entscheidung sind. Fracht ist Bild und liegt deshalb in
der Ebene `bau`, ohne Knopf, ohne Preis, ohne Zeiger.

## OFFEN, mit Koordinaten, damit es billig zu beheben ist

**`faesser2` und `kasten2` sind dasselbe Bild wie `faesser` und `kasten`** und
überlappen es zu rund zwei Dritteln (Fuß 28|73,5 gegen 30|75 bzw. 31|73 gegen
28|72,5). Sie erscheinen nur ab halbvollem Keller. Ein `scale: -1 1` auf dem
zweiten Stück (NICHT `transform` — daran hängt `.amort`) und ein Schritt nach
rechts würden zwei Haufen daraus machen statt eines dickeren. **Nicht getan**,
weil jede Änderung an `spiel/` die zwölf bereits gemessenen Nachher-Läufe
entwertet hätte, und das für einen Schönheitsfehler in einem seltenen Zustand
zu teuer ist.

## Der Messstand bleibt stehen

Beide Häfen laufen weiter (8907 Arbeitsbaum, 8908 der Stand vor Welle 8). Nach
einem Container-Reset stellt **ein Aufruf** den Vorher-Hafen wieder her:

    werkbank/schuss/stadt-w8/hafen-vor-aufsetzen.sh 8908

Das Skript prüft selbst, ob der Hafen wirklich `bottom: 0.7%` ausliefert, und
bricht sonst ab. „Zweimal von Hand ist einmal zu oft."
