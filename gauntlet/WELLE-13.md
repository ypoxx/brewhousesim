# WELLE 13 — DIE ERSTE VOLLVERSION. Ein Spiel, das man spielen darf.

*Angesetzt am 8. August 2026 von der Aufsicht, auf den Zahlen der Spielprobe
Welle 12 (`werkbank/urteile/welle12-spielprobe.md`, 581 Zeilen, 13 Auflagen,
1 032 gespielte Wochen, 3 709 echte Mausklicks, null Seitenfehler).*

Der Auftraggeber hat gefragt, ob aus dem Stand jetzt **eine erste Vollversion**
wird, die man spielen kann. Diese Welle ist die Antwort. Sie baut kein neues
Spiel — sie macht das vorhandene bedienbar.

> **Der Satz des blinden Spielkritikers, an dem diese Welle gemessen wird:**
> *„Dieses Spiel wird an seinem Ende gut, und man kommt zu selten dorthin. Die
> zwanzig Minuten dazwischen verkaufen es nicht."*

---

## Was gemessen wurde und deshalb feststeht

Alles hier ist am Bildschirm gezählt, nicht im Quelltext gelesen. Fenster
1600×900, Saat 1350, Stand `3d9f5c2`.

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| gespielte Wochen | 284 | 310 | 308 | 128 *(Spiel endete)* |
| echte Mausklicks | 1 494 | 838 | 821 | 343 |
| greifbare Züge, Median je Woche | 48 | 54 | 50 | 48 |
| davon **bezahlbar**, Median | **2** | **3** | **7** | **0** |
| Wochen ohne *eine* bezahlbare Preisoption | **127/284** | 20/310 | 7/308 | **70/128** |
| Deckung (Kasse ÷ nächster sinnvoller Zug), Median | **0,16×** | 0,61× | 0,62× | **0,08×** |
| Züge des Gegners · Züge gegen ihn | 140 · **0** | 151 · **4** | 96 · **1** | 70 · **0** |
| unwiderrufliche Festlegungen getroffen | **0** | 1 | 1 | **0** |
| `BRAUHAUS.lage` · Seitenfehler | 0 · 0 | 0 · 0 | 0 · 0 | 0 · 0 |

**Vier Zahlen tragen diese Welle:**

1. **742 von 1 030 Wochen** haben eine Deckung unter 1×. In sieben von zehn
   Wochen konnte der Spieler den Zug, den das Spiel selbst unten am Rand als den
   nächsten sinnvollen ausweist, **nicht bezahlen**.
2. **1 256 von 1 760 Klicks (71 %)** entfallen auf zwei Knöpfe — *„Wie vorige
   Woche"* und *„FUHRE ABSCHICKEN"*. Mit *„Nach Durst füllen"* sind es **78 %**.
3. Die Wörter **Ziel · gewinnen · überleben** kommen auf dem ersten Schirm
   **null Mal** vor — bei **613 sichtbaren Textzeilen**.
4. Ein Neuladen nach zwölf gespielten Wochen setzt Jahr, Woche, Kasse, Fässer,
   Chronik und Buch **ziffernweise auf den Anfang zurück**. `localStorage`,
   `sessionStorage` und `document.cookie` sind leer.

**Was ausdrücklich in Ordnung ist und nicht angefasst wird:** der Gegner zieht
(457 Züge in vier Sitzungen, in 23 von 25 Wochen mit neuem Text auf der Karte,
ohne dass ein Brett aufgeklappt werden muss), die Zeile *„nächster Zug: … (Kasse
reicht 5,9×)"* ist nach dem Urteil des Kritikers **die beste Zeile des Spiels**,
und das Schlussblatt *„Der Rat entzieht das Braurecht · 1353"* ist **das beste
Blatt des Spiels**. Wer daran etwas wegnimmt, hat die Welle verfehlt.

---

## Drei Entscheidungen der Aufsicht, damit niemand raten muss

**① Das Epochenversprechen (A12) wird in dieser Welle NICHT eingelöst.**
Epoche I umfasst 167 Jahre; bei gemessenen 14,2 Wochen je Minute wären das rund
sechs Stunden, bis 2025 rund vierundzwanzig. **Für die erste Vollversion gilt:
jede Epoche ist ein eigenes Szenario, und der Startschirm sagt das mit klaren
Worten.** Der Epochenwechsel bleibt als Aufgabe offen und bekommt eine eigene
Welle, sobald der Spielstand steht. Was **nicht** geht, ist so zu tun, als sei
er da.

**② Der Spielstand darf die Wiederholbarkeit nicht anfassen.** Jede Zahl, die
dieser Lauf seit Welle 7 erhoben hat, steht auf *„dieselbe Saat, dieselbe
Partie"*. Ein gespeicherter Stand, der beim zweiten Öffnen derselben URL
zurückgeladen wird, macht aus jeder Messreihe ab Lauf zwei etwas anderes.
Darum ist `?neu=1` **Teil der Abnahme, nicht Beiwerk** (siehe Stück 1).
*(Playwright öffnet je Lauf einen frischen Kontext mit leerem `localStorage` —
die Messhand ist dadurch von sich aus geschützt. Das ist ein glücklicher
Umstand, kein Entwurf, und deshalb wird zusätzlich `?neu=1` verlangt.)*

**③ Wer ein großes Blatt auflegt, nimmt es beim Klick auf einen fremden Reiter
selbst wieder weg.** Auflage A6 des Kritikers lässt zwei Wege offen —
Reiter abschalten oder Blatt schließen. Gewählt ist das Schließen, weil die
Reiterleiste DER STADT gehört und diese Welle DIE STADT nicht öffnet. Jedes
Stück horcht auf Klicks auf `stadt:reiter:*` und schließt **sein eigenes**
Blatt. Kein Stück fasst fremdes DOM an.

---

## Die vier Stücke

Ein Builder je Stück, danach ein **blinder** Kritiker je Stück, der nur das
laufende Spiel sieht. Dateibesitz nach `spiel/LIESMICH.md` — **ein Stück ist
`.js` UND `.css`.**

### Stück 1 · DER RAHMEN — der Spielstand und der erste Satz
*Dateien: `kern/**` (du bist der einzige, der dort schreiben darf).*

**R1 — Speichern und fortsetzen.** (A1) Nach jedem Wochenwechsel wird der
vollständige Weltzustand nach `localStorage` geschrieben, unter einem Schlüssel
aus Epoche **und** Saat (`brauhaus:1:1350`). Beim Laden derselben URL wird er
gefunden, die Partie läuft weiter, und im Kopf steht sichtbar
*„fortgesetzt · 1354/12"*. Ein Knopf **„Neue Partie"** verwirft ihn nach
Rückfrage.
*Abnahme:* zwölf Wochen spielen, `location.reload()` — Jahr, Woche, Kasse,
Fässer, Chronik und Buch stimmen **Ziffer für Ziffer**. Das ist genau die Probe
aus §6 des Urteils, die heute reißt.

**R2 — `?neu=1` startet frisch und schreibt nichts.** Ohne diesen Schalter ist
die zweite Messlatte nicht mehr messbar (Entscheidung ②). Ein Lauf mit `?neu=1`
lässt `localStorage` hinterher **leer** zurück.
*Abnahme:* dreimal `?epoche=1&saat=1350&neu=1` hintereinander im **selben**
Browserkontext ergibt **dieselbe Prüfsumme**.

**R3 — Der zweite Satz am unteren Rand.** (A2) `kern/kopf.js:146` trägt heute
*„nächster Zug: …"*. Daneben gehört, von Woche 1 an und ohne dass ein Brett
aufgeschlagen werden muss, **was das gute Ende ist und wie weit das Haus davon
entfernt ist.** Du baust den Platz und die Schnittstelle —
`B.welt.meldeZiel(satz, naehe)`, gebaut wie das schon vorhandene
`meldeZug(was, preis, art, zug)`. **Den Satz liefert DIE FUHRE** (Stück 3), die
ihn in `uebergabeFehlt()` bereits fertig hat. Steht kein Satz an, bleibt die
Zeile leer statt zu lügen.

**R4 — Der Startschirm sagt, was das hier ist.** (Entscheidung ①) `kern/start.js`
nennt in wenigen Sätzen: du führst ein Brauhaus, jede Epoche ist ein eigenes
Szenario mit eigenem Anfang, so endet es gut, so endet es schlecht. Kein
Handbuch — der Kritiker war nach zwei Minuten handlungsfähig, ihm fehlte nur
das Wozu.

**R5 — `B.uhr.springe()` ist gebaut und wird von keinem Stück je aufgerufen**
(geprüft: kein Treffer außerhalb von `uhr.js`). Prüfe es, mache es benutzbar
und schreibe DREI Zeilen in `spiel/LIESMICH.md`, wie ein Stück es ruft und was
dabei mit `woche`/`jahr`-Ereignissen und mit dem Spielstand geschieht. DIE
FUHRE braucht es für R14.

---

### Stück 2 · DIE JAHRESTAFEL — das einzige Brett mit echten Entscheidungen
*Dateien: `stuecke/preis*.js` · `stil/preis*.css`.*

Die Michaelitafel ist nach dem Urteil des Kritikers **das einzige Brett des
Spiels, auf dem Entscheidungen mit Preisschild nebeneinander stehen, die
einander ausschließen** — der Ausschluss ist gemessen, nicht behauptet
(1350 `preis:nimm:dach`: danach 3 Angebote und 3 Festlegungen abgeschaltet).
Sie ist damit das Herzstück der zweiten Messlatte. Und man bekommt sie nicht zu
sehen.

**R6 — Der Knopf `preis:tafel` darf nicht lügen.** (A4) Er trägt in 1350 über
**71 abgelesene Zustände** hinweg immer *„Michaelitafel schließen"* — auch wenn
keine Tafel liegt. In 1600 wechselt er richtig auf *„Michaelitafel 1600 ·
4 Angebote"*, fällt aber unmittelbar nach dem Jahreswechsel wieder auf
*„schließen"* zurück (gemessen an zwei Jahreswechseln). **Die Aufschrift wird
aus dem Zustand gerechnet, in dem der Knopf gerade gezeichnet wird.** Das ist
dieselbe Klasse Fehler, die `spiel/LIESMICH.md` als Ursache der Bistabilität
vom 7. August benennt — Welle 12 hat das Rennen abgestellt, **die Lüge steht
unverändert.**

**R7 — Die Tafel liegt zu Michaeli von selbst auf.** (A5) In zehn Braujahren
1350 lag sie **kein einziges Mal** von selbst auf; in 1600 fehlte sie an jedem
geprüften Jahreswechsel. In Woche 1 jedes Braujahres wird sie aufgeschlagen —
so wie das Sommerblatt zu Georgi —, und erst *„Das Jahr beginnen"* legt sie weg.
*Abnahme:* zehn Braujahre 1350 spielen, ohne einen Reiter anzufassen; die Tafel
muss **zehnmal** von selbst dagelegen haben.

**R8 — Wenn nichts bezahlbar ist, sagt die Tafel, woher das Geld kommt.** (A10)
Der Satz *„HEUTE NICHT · Die Kasse reicht für keines dieser Angebote. Das
billigste — Der feste Fasskauf bei der Zunft — kostet 60 Pf, es fehlen 12 Pf"*
ist vorbildlich. Was fehlt, ist der Satz danach: **woher die 12 Pfennig kommen
sollen** — und zwar als benannter, in dieser Woche wirklich greifbarer Zug, nicht
als Ratschlag. In der 1350-Sitzung war in **127 von 284 Wochen** überhaupt nichts
mit Preisschild bezahlbar.

**R9 — Kein abgeschnittener Text bei 1600×900.** (A13) Gleichzeitig abgeschnitten
auf einem Blatt (1350, Michaeli 1359): *„Zusammen im Jahr"* in DIE RECHNUNG,
*„Der Anschlag steht im Steuerbuch der Stadt"* in DER ANSCHLAG, *„1 fertig ·
0 im Bau · 0 durch eine Wahl für immer"* in WAS SCHON STEHT, und die
Knopfaufschrift *„Nehmen −110 Pf"* bricht mitten im Wort. Geprüft wird **mit**
gezeichneter Rollleiste.

**R10 — Dein Blatt schließt sich beim Klick auf einen fremden Reiter**
(Entscheidung ③, A6). Gemessen am Jahreswechsel 1601: acht Reiterklicks unter
liegendem Blatt, achtmal identisch 30 greifbare Züge — erst der neunte brachte
53. *„Ein Knopf, der sich anfassen lässt und nichts tut, ist die teuerste Sorte
Lüge in einem Spiel, das nach Klicks bewertet wird."*

---

### Stück 3 · DIE WOCHE — 71 % der Klicks sind zwei Knöpfe
*Dateien: `stuecke/fuhre*.js` · `stil/fuhre*.css`.*

**R11 — Liefere den Zielsatz.** (A2) `uebergabeFehlt()` hat ihn schon im
Klartext (*„Noch 3 Braujahre, dann ist das Haus alt genug für eine Übergabe"* /
*„Es führen 1 von 3 Häusern Bier des Anker"*). Rufe damit
`B.welt.meldeZiel(...)` aus Stück 1, in **jeder** Woche. Heute erfährt diesen
Satz nur, wer ein zugeklapptes Brett aufschlägt, das drei Wochen im Jahr
existiert.

**R12 — „DIE ÜBERGABE VOR DEM RAT" darf sich nicht verstecken.** (A3) Der Reiter
stand in **15 von 284 gespielten Wochen** da (Woche 2–4 jedes Jahres ab 1355)
und wurde **null Mal** bemerkt: ein braunes Rechteck unter zehn anderen braunen
Rechtecken. Solange das Angebot liegt, wird es als **aufgeschlagenes Blatt**
gezeigt — oder mindestens als Reiter mit eigener Farbe und sichtbarer Frist
(*„noch 3 Wochen"*).
*Abnahme:* 1350 bis 1355 spielen, **ohne einen einzigen Reiter anzufassen** —
das Angebot muss auffallen.

**R13 — Die Woche braucht mehr als zwei Knöpfe.** (A7) Entweder jede Woche trägt
eine Entscheidung, oder Wochen ohne Entscheidung werden zusammengefasst;
`B.uhr.springe()` ist genau dafür gebaut und wird von keinem Stück gerufen.
*Abnahme:* in einer 100-Wochen-Sitzung fallen auf den häufigsten Knopf
**höchstens 35 %** aller Klicks und auf die drei häufigsten zusammen
**höchstens 60 %** (heute: 71 % / 78 %). Wer stattdessen springt, zählt die
übersprungenen Wochen nicht mit — dann gilt die Latte auf den *gespielten*
Wochen.

**R14 — Dein Blatt schließt sich beim Klick auf einen fremden Reiter**
(Entscheidung ③, A6) — für das Georgi-Blatt und für das Übergabeblatt.

---

### Stück 4 · DER GEGENZUG — 457 zu 5
*Dateien: `stuecke/gegner*.js` · `stil/gegner*.css`.*

**Am Verhalten des Gegners wird nichts geändert.** §4b des Urteils besteht die
Latte klar und ausdrücklich: *„Von allem, was ich in vier Sitzungen geprüft
habe, ist das der Teil, der am wenigsten Arbeit braucht."* Diese Welle ändert
nur, was der Spieler **dagegen tun** kann.

**R15 — Der Spieler muss sich einen Gegenzug leisten können.** (A9) In vier
Sitzungen standen **457 Züge des Gegners** gegen **5 Züge des Spielers** — nicht
aus Unwillen, sondern weil *„ablösen 76 Pf"* bei 14 Pf in der Lade kein Zug ist.
Der Knopf *„Fass an den Wirt · 1 Fass statt Geld"* ist genau dafür gebaut und
war fast immer mit *„Vorrat reicht nicht"* abgeschaltet, weil der Keller leer
war.
*Abnahme:* über 100 Wochen darf es **höchstens 10 Wochen** geben, in denen
**kein** Zug gegen den Gegner bezahlbar ist. Gemessen in allen vier Epochen.

**R16 — Der Zähler wandert nicht mitten in der Partie.** (A8) Der Reiter *OHNE
DICH GESCHEHEN* trägt die Zahl der Züge nur im **ersten** Braujahr; ab 1351/1
steht dort in allen 20 geprüften Wochen nur noch der nackte Titel, weil das
Brett dann aufgeklappt ist. Die Zahl gehört an **beide** Orte.
*Abnahme:* mit `werkbank/schuss/spiel-w12/gegnerblick.mjs` (spielt, ohne einen
Reiter anzufassen) muss die Aufschrift in Woche 45 dieselbe Form haben wie in
Woche 15.

---

## Was diese Welle NICHT anfasst

* **A11 — die Verbliste je Epoche** (37 von 43–46 Verben in allen vier Epochen
  gleich, paarweiser Jaccard 0,70–0,81). Das ist Arbeit für DEN SUD und DIE
  STADT und braucht eine eigene Welle; es macht das Spiel nicht spielbar,
  sondern reicher.
* **A12 — der Epochenwechsel.** Entscheidung ①.
* **DIE STADT, DAS ERBE, DER NAME, DER SUD, DER KLANG** bleiben zu. Fünf
  Builder, die gleichzeitig in einen Baum schreiben, haben in dieser Welle
  nichts zu suchen — vier sind das Maß, das getragen hat.

---

## Abnahme der ganzen Welle

**Die harte — die Probe des Spielers.** Eine Sitzung von zwanzig Minuten je
Epoche, mit echten Mausklicks, am eingefrorenen Stand:

| | heute | verlangt |
|---|---|---|
| Neuladen nach 12 Wochen | Woche 1, Kasse 112 | **ziffernweise derselbe Stand** |
| *Ziel · gewinnen · überleben* auf dem ersten Schirm | **0 ×** | mindestens einmal, ohne ein Brett aufzuschlagen |
| Michaelitafel liegt von selbst auf | 0 von 10 Jahren | **10 von 10** |
| `preis:tafel` beschriftet die liegende Lage | 0 von 71 | **71 von 71** |
| häufigster Knopf, Anteil aller Klicks | 71 % (zwei Knöpfe) | **≤ 35 %** einzeln, **≤ 60 %** zu dritt |
| Wochen ohne bezahlbaren Gegenzug je 100 | ~100 | **≤ 10** |
| Reiterklick unter liegendem Blatt | 8 × ohne Wirkung | Blatt schließt sich |

**Die weiche — nichts aus Welle 10 bis 12 darf zurückgenommen werden.**

| | Stand nach Welle 12 |
|---|---|
| Wiederholbarkeit | `?saat=1350`, **drei Läufe je Epoche, eine Prüfsumme** — sechs, wo je eine Abweichung war |
| Latte 2 · ρ 12/13/14 Braujahre | 1350 −0,259/−0,236/−0,389 · 1600 +0,406/+0,489/**+0,538** · 1884 +0,161/+0,330/+0,169 · 1970 −0,112/−0,236/−0,304 |
| Latte 2 · Jahre unter 1× | 0 / 1 / 0 / 1 von 14 |
| Deckung je Stück | 11,0–11,6 % |
| `BRAUHAUS.haushalt.pruefe()` · `tafeln()` · `ueberRand()` | ohne Beanstandung · leer · leer |
| `BRAUHAUS.lage` · Seitenfehler | 0 · 0 in allen vier Epochen |
| Gewicht je Epoche | unter 8 MB |

> **1600 hat keine Reserve.** Es ist von −0,116 auf **+0,538** gewandert; der
> Abstand zur Latte beträgt **0,162**. Jedes Stück, das an Preisen, Erträgen
> oder Fristen dreht, misst 1600 zuerst.

**Die Reihenfolge des Loops bleibt unverändert:** Builder baut, **blinder**
Kritiker mit frischem Kontext spielt und misst — er sieht das laufende Spiel,
nie die Begründung des Builders —, dann Nacharbeit. Die Aufsicht misst danach
selbst nach, an einem **eigenen** eingefrorenen Stand.
