# Welle 13 · Stück 1 · DER RAHMEN — Baubericht

*Laufend geschrieben, nicht am Ende. Jede Zahl hier ist am laufenden Spiel
gemessen; wo etwas nicht gemessen ist, steht es ausdrücklich dabei.*

**Dateien, die mir gehören:** `spiel/kern/**`.
**Eine Zeile außerhalb**, von der Aufsicht ausdrücklich erlaubt:
`spiel/index.html` bekommt `<script src="kern/stand.js"></script>` (Zeile 85).
**Nicht angefasst:** `spiel/stuecke/**`, `spiel/stil/**` — kein Zeichen.

Hafen dieses Laufs: **8921**. Meßgeräte: `werkbank/schuss/rahmen-w13/`,
Sammellauf `sh werkbank/schuss/rahmen-w13/alles.sh`.

> **Eine Vorbemerkung, ohne die man meine Zahlen falsch liest.** Drei andere
> Builder — DIE JAHRESTAFEL, DIE WOCHE, DER GEGENZUG — schreiben zur selben
> Stunde in `spiel/stuecke/**`, und ein Veröffentlicher sichert alle 180 s.
> **Das Spiel bewegt sich unter meinen Messungen.** Zwischen meinem ersten
> und meinem letzten 1350-Lauf ist die Kasse nach zwölf Wochen von 60 Pf auf
> 1 Pf gefallen, ohne daß ich eine Zeile daran geändert hätte. Was ich messe,
> ist deshalb immer ein **Vergleich innerhalb desselben Laufs** — derselbe
> Stand vor und nach dem Neuladen, dieselbe Adresse dreimal hintereinander.
> Absolutwerte aus zwei verschiedenen Stunden gehören nicht nebeneinander,
> und wo ich zwei nebeneinanderstelle, steht die Stunde dabei.

---

## Wo ich stehe

- [x] R1 Spielstand — gemessen, vier Epochen, besteht
- [x] R2 `?neu=1` — gemessen mit Gegenbeweis, vier Epochen, besteht
- [x] R3 `meldeZiel(satz, naehe)` — gebaut; **DIE FUHRE ruft es** (`fuhre.js:2760`)
- [x] R4 Der Anschlag am Anfang — gebaut, gemessen
- [x] R5 `springe()` — geprüft, Fehler gefunden, neu gebaut, dokumentiert; **DIE FUHRE ruft es** (`fuhre.js:1731`)
- [x] `spiel/LIESMICH.md` fortgeschrieben: `meldeZiel`, Spielstand-API, `springe()`-Kasten, `&neu=1`
- [x] Schlußabnahme: vier Epochen `schuss.mjs`, PNG angesehen

---

## Was ich geändert habe

| Datei | was |
|---|---|
| `kern/stand.js` | **neu.** Der Spielstand. 454 Zeilen, davon die Hälfte Begründung. |
| `kern/uhr.js` | Würfel-Zählerstand lesbar/setzbar · `eineWoche()` herausgelöst · `springe()` neu gebaut · `springeWochen()` neu · Sicherungspunkte in `naechsteWoche()`, `springe*()`, `beende()` |
| `kern/welt.js` | `meldeZiel(satz, naehe)` · `bestesZiel()` · `zielMeldungen` |
| `kern/kopf.js` | Zielzeile am unteren Rand · Standzeile *„fortgesetzt · 1350/12"* · Knopf *„Neue Partie"* mit Rückfrage · Escape und fremder Reiter schließen die Rückfrage |
| `kern/buehne.js` | Zielmeldungen werden vor jedem Zeichnen vergessen · Zug 2 des Spielstandes zwischen `aufbau()` und erstem Bild |
| `kern/basis.js` | `?neu=1` |
| `kern/start.js` | `B.stand.starte()` an der einen richtigen Stelle · der Anschlag am Anfang (R4) |
| `spiel/index.html` | **eine Zeile**, die erlaubte |
| `spiel/LIESMICH.md` | `meldeZiel` · Spielstand-API · `springe()`-Kasten · `&neu=1` |

---

## R1 — Speichern und fortsetzen

### Wie es gebaut ist

`kern/stand.js` schreibt nach **jedem** Wochenwechsel den ganzen Zustand des
Kerns nach `localStorage`, Schlüssel `brauhaus:<epoche>:<saat>` — Epoche aus
der **Adresse**, nicht aus dem Jahr, in dem die Partie gerade steht, damit
dieselbe URL ihren Stand auch nach einem Epochenwechsel wiederfindet.

Gesichert: `haus`, `zeit` (mit Amtszeit), `vorrat`, `adressen`, `gegner`,
`chronik`, `protokoll` — **und der Zählerstand des Würfels**. Ohne den
letzten würfelt eine fortgesetzte Partie ab der Wiederaufnahme noch einmal
dieselben Zahlen wie am Anfang; der Spielstand wäre ein Zeitreisegerät, und
niemand sähe es.

**Das Einsetzen läuft in zwei Zügen, und der zweite ist gemessen erzwungen.**
Erster Bau: alles auf einmal vor `buehne.starte()`. Ergebnis der ersten
Abnahme (E1, zwölf Wochen):

| | nach 12 Wochen | nach dem Neuladen |
|---|---|---|
| Jahr/Woche | 1350/13 | 1350/13 ✔ |
| Kasse | 60 | 60 ✔ |
| Fässer | 12 | 12 ✔ |
| **Chronik** | **8** | **11** ✘ |
| **Buch** | **42** | **43** ✘ |

Die drei zusätzlichen Zeilen stammen aus dem `aufbau()` der Stücke, das nach
dem Einsetzen läuft und selbst in die Chronik schreibt (*„Die Hand am Haus ist
Kunigunde Bruckner, sparsam …"*). Beim **ersten** Start der Partie sind genau
diese Zeilen geschrieben worden — sie stehen im gesicherten Stand also schon
drin. Ein zweites Mal geschrieben sind sie Doubletten.

Also:

* **Zug 1**, vor `buehne.starte()`: Haus, Zeit, Vorrat, Adressen, Gegner,
  Würfel, Stückstände. Jedes Stück baut auf der Welt auf, die wirklich gilt —
  keines sieht je die frische Welt und wird danach heimlich umgestellt.
* **Zug 2**, nach dem `aufbau()` aller Stücke und **vor dem ersten Bild**
  (`kern/buehne.js`): Chronik, Buch, und noch einmal der Zählerstand des
  Würfels. Ohne geladenen Stand tut der Aufruf nichts — der Ladezustand einer
  frischen Partie ist Zeile für Zeile derselbe wie vor Welle 13.

### Abnahme — `werkbank/schuss/rahmen-w13/wiederkehr.mjs`

Nachbau von `werkbank/schuss/spiel-w12/wiederkehr.mjs`, dem Gerät, an dem der
blinde Kritiker §6 gemessen hat: dieselbe Hand (*Wie vorige Woche* /
*Nach Durst füllen*, *FUHRE ABSCHICKEN*, *WEITER*), dasselbe Fenster
1600×900, zwölf Wochen, dann `reload()`.

Verglichen wird **Ziffer für Ziffer** über 15 Felder: Jahr, Woche, Kasse,
Rohstoff, Ansehen, Fässer, Chronik, Buch, Amtszeitnummer, Amtszeitname,
Bindungen aller zwölf Adressen, Züge der Gegner, Würfelzählerstand, letzte
Chronikzeile im Wortlaut, letzte Buchzeile im Wortlaut.

**Der Lauf am Endstand dieser Welle** (Reihenfolge: Jahr/Woche · Kasse ·
Fässer · Chronik · Buch):

| | Anfang | nach 12 Runden | **nach dem Neuladen** | Abweichung |
|---|---|---|---|---|
| **1350** | 1350/1 · 112 · 4 · 4 · 1 | 1350/12 · 1 · 12 · 9 · 41 | **1350/12 · 1 · 12 · 9 · 41** | nur `gegnerzuege` |
| **1600** | 1600/1 · 640 · 8 · 4 · 1 | 1600/12 · 558 · 24 · 7 · 35 | **1600/12 · 558 · 24 · 7 · 35** | nur `gegnerzuege` |
| **1884** | 1884/1 · 14.250 · 7 · 4 · 1 | 1884/12 · 2.994 · 79 · 11 · 40 | **1884/12 · 2.994 · 79 · 11 · 40** | nur `gegnerzuege` |
| **1970** | 1970/1 · 86.000 · 140 · 4 · 1 | 1970/12 · 340 · 200 · 15 · 57 | **1970/12 · 340 · 200 · 15 · 57** | nur `gegnerzuege` |

**Der erste Lauf, gefahren um 07:51 an einem früheren Stand des Spiels**, ist
die Zeile, die neben §6 des Urteils gehört — dieselbe Hand, dieselbe Saat,
dasselbe Fenster:

| 1350 | Anfang | nach 12 Wochen | nach dem Neuladen |
|---|---|---|---|
| **Urteil §6 (Welle 12)** | 1350/1 · 112 · 4 · 4 · 1 | 1350/13 · 60 · 12 · 8 · 42 | **1350/1 · 112 · 4 · 4 · 1** ✘ |
| **heute, 07:51** | 1350/1 · 112 · 4 · 4 · 1 | 1350/13 · 60 · 12 · 8 · 42 | **1350/13 · 60 · 12 · 8 · 42** ✔ |

Der Kritiker hat 1350/13 · 60 · 12 · 8 · 42 gemessen, und genau das stand
nach dem Neuladen wieder da. *(Daß der Lauf um 08:26 andere Absolutwerte hat,
liegt an den drei anderen Bauern — siehe die Vorbemerkung. Was in beiden
Läufen gleich ist: links und rechts vom Neuladen dieselben Ziffern.)*

Weiter gemessen, in allen vier Epochen:

* `localStorage` trägt genau **einen** Schlüssel: `brauhaus:1:1350` bzw.
  `:2:` `:3:` `:4:`.
* Im Kopf steht **`fortgesetzt · 1350/12`** — ein Element mit
  `data-fortgesetzt="1350/12"`, in jeder Epoche mit ihrem Jahr und ihrer
  Woche. Der Knopf `kern:neu` („Neue Partie") steht daneben.
* `BRAUHAUS.lage.length` = **0**, Seitenfehler = **0**.
* Die fortgesetzte Partie **läuft weiter**: ein weiteres WEITER schaltet die
  Woche in allen vier Epochen wirklich weiter (`laeuftWeiter: true`).

Rohdaten: `werkbank/schuss/rahmen-w13/protokoll/wiederkehr-e{1..4}.json`,
Bilder: `…/schuesse/wiederkehr-e{1..4}-{vor,nach}-neuladen.png`.

### Die eine Abweichung, und sie gehört nicht mir

`gegnerzuege` steht nach dem Neuladen auf `adler:1` statt `adler:12`. Der Wert
in `B.welt.gegner[].zuege` **wird** richtig eingesetzt; DER GEGNER überschreibt
ihn beim ersten eigenen Zug wieder, weil er ihn nur spiegelt:

* `spiel/stuecke/gegner.js:517` — `bauePartei()` legt `Z.haeuser[k].zuege = 0`
  an, immer, auch bei fortgesetzter Partie.
* `spiel/stuecke/gegner.js:567` — `g.zuege = h.zuege` schreibt den eigenen
  Zähler in den Weltzustand zurück.

**Das ist der Regelfall, nicht die Ausnahme:** der Eigenzustand (`Z`) *aller
acht* Stücke wird in dieser Welle nicht mitgesichert, weil kein Stück
angefaßt werden darf. Was ein Stück braucht, sind **zwei Zeilen** und keine
Kernänderung — die API steht und ist in `spiel/LIESMICH.md` dokumentiert:

```js
BRAUHAUS.stand.melde('gegner', function () {           // beim Laden, einmal
  return { haeuser: Z.haeuser, zuege: Z.zuege };
});
var alt = BRAUHAUS.stand.geladen('gegner');            // in aufbau(); null = frisch
if (alt) { Z.haeuser = alt.haeuser; Z.zuege = alt.zuege; }
```

`BRAUHAUS.stand.bericht().stuecke` sagt jederzeit, wer angemeldet ist — heute
ist die Liste **leer**. Namentlich betroffen und mit Datei/Zeile benannt:

| Stück | wo der Eigenzustand liegt | was ein Neuladen heute kostet |
|---|---|---|
| **gegner** | `stuecke/gegner.js:517` `bauePartei()` · `:63` `Z.zuege` | Zugzähler, Bauten, Absichten, Marken des Adlers |
| **fuhre** | `stuecke/fuhre.js` `Z` (u. a. `Z.startJahr`, `Z.verladen`, `Z.verladenVorjahr`, `Z.ladung`, `Z.uebergabe`, `Z.uebergabeNein`) | Ladung, Jahresplan, **die Frist der Übergabe** und `verladenVorjahr` — genau die Zahlen, aus denen `uebergabeFehlt()` den Zielsatz rechnet |
| **preis** | `stuecke/preis.js` `Z` (genommene Angebote, getroffene Festlegungen) | welche Michaeli-Angebote schon weg sind, welche Festlegung getroffen ist |
| **sud** | `stuecke/sud.js` `Z` (`Z.kalt`, `Z.jahrSude`) | der Zähler der kalten Pfanne — eine der drei Ursachen, an denen die Partie endet |
| **erbe** | `stuecke/erbe.js` `Z` (`Z.uebergeben`, `Z.form`, `Z.gnadeBis`) | Verschreibungen, Leibgeding, Fristen |
| **name / stadt** | `Z` beider Stücke | Anschläge, Aufgeld, Platzordnung |

Das gehört in die Nacharbeit dieser Welle oder in die nächste; die Abnahme
aus R1 (Jahr, Woche, Kasse, Fässer, Chronik, Buch) hängt an keinem davon.

### Der Knopf „Neue Partie" und die Rückfrage

Er steht unter der Hauszeile und erscheint, **sobald ein Stand vorliegt** —
also ab dem ersten Wochenwechsel. Ein Klick legt eine Rückfrage mit zwei
echten Knöpfen auf (`kern:neu:ja`, `kern:neu:nein`), nicht `window.confirm()`:
Playwright weist einen Browserdialog standardmäßig ab, der Knopf täte dann
nichts, und *„ein Knopf, der sich anfassen läßt und nichts tut, ist die
teuerste Sorte Lüge in einem Spiel, das nach Klicks bewertet wird"* (§9 A6).
*Ja* verwirft **nur den Stand dieser Adresse** und lädt neu. Escape schließt
die Rückfrage, ein Klick auf einen fremden `stadt:reiter:*` ebenfalls
(Entscheidung ③ der Aufsicht).

---

## R2 — `?neu=1` startet frisch und schreibt nichts

Drei Betriebsarten, die Adresse entscheidet:

* **`spiel`** — Normalfall: laden und schreiben.
* **`neu`** (`?neu=1`) — lädt nichts, schreibt nichts, und räumt beim
  Anlassen **jeden** Schlüssel `brauhaus:*` aus dem Speicher. Nicht nur den
  eigenen: der Schalter ist das Werkzeug der messenden Hand, sein Versprechen
  lautet *„schreibt nichts und läßt nichts liegen"*, und die Abnahme prüft den
  Speicher als Ganzes. Wer nur **eine** Partie loswerden will, nimmt den Knopf.
* **`aufnahme`** (`?jahr=` oder `?woche=` in der Adresse) — wer die Uhr von
  außen stellt, will einen bestimmten Augenblick sehen und keine fremde
  Partie: lädt nichts, schreibt nichts, läßt einen vorhandenen Stand liegen.

### Abnahme — `werkbank/schuss/rahmen-w13/neuprobe.mjs`

**Ein** Browserkontext, sieben Ladevorgänge derselben Adresse, je 30 gespielte
Wochen. Prüfsumme = SHA-256 über die Wochenreihe (Jahr, Woche, Kasse,
Rohstoff, Ansehen, Fässer, Chronik, Buch, Würfelzählerstand, Bindungslage
aller zwölf Adressen), erste 16 Stellen.

**Mit `&neu=1`, dreimal hintereinander, in allen vier Epochen:**

| Epoche | Prüfsummen der drei Läufe | Schluß (alle drei) | `localStorage` | `sichere()` gerufen |
|---|---|---|---|---|
| **1350** | `d71923b8a80abf5c` ×3 | 1351/1 · Kasse 48 | **leer** | 0× |
| **1600** | `e5cf4213fbb98ebd` ×3 | 1601/1 · Kasse 291 | **leer** | 0× |
| **1884** | `11b8ad938e51f69f` ×3 | 1884/30 · Kasse 2.562 | **leer** | 0× |
| **1970** | `1f1d3ba7345a49b4` ×3 | 1970/30 · Kasse 340 | **leer** | 0× |

**Je eine Prüfsumme. Speicher leer. Null Schreibvorgänge.** ✔

**Der Gegenbeweis — dieselbe Adresse ohne den Schalter, im selben Kontext:**

| Epoche | Prüfsummen der drei Läufe | Anfang der drei Läufe |
|---|---|---|
| **1350** | `d71923b8a80abf5c` · **`2d7688463ca134c4`** · **`612bd20beea9d238`** | 1350/1 · **1351/1** · **1352/1** |
| **1600** | `e5cf4213fbb98ebd` · **`02cc10f84655a0eb`** · **`7e4a6ad6c9b31a80`** | 1600/1 · **1601/1** · **1602/1** |
| **1884** | `11b8ad938e51f69f` · **`03e914ffdf43b237`** · **`6e7f00c002174fe4`** | 1884/1 · **1884/30** · **1885/30** |
| **1970** | `1f1d3ba7345a49b4` · **`f61c288bde4b23b9`** · **`61d1d589696a54e5`** | 1970/1 · **1970/30** · **1971/30** |

Das ist genau die Gefahr aus Entscheidung ② der Aufsicht, und sie ist echt:
ohne `?neu=1` ist ab Lauf zwei jede Zahl einer Meßreihe eine andere Partie.
Der Stand im Speicher wuchs dabei von 22.083 auf 49.790 Zeichen (1350) bzw.
von 60.501 auf 70.524 (1970).

**Zwei Befunde, die dabei mitkommen und beide zählen:**

1. Lauf 1 *ohne* Schalter hat **dieselbe** Prüfsumme wie die drei Läufe *mit*
   Schalter (`d71923b8a80abf5c`). `?neu=1` ändert also **am Spiel nichts** —
   es ändert nur, ob geladen und geschrieben wird. Der Schalter ist kein
   zweiter Spielmodus.
2. Ein `?neu=1` nach den drei Läufen ohne Schalter räumt den hinterlassenen
   Stand weg (`localStorage` danach **leer**) und ergibt wieder
   `d71923b8a80abf5c` — dieselbe Partie wie ganz am Anfang.

`BRAUHAUS.lage.length` in allen sieben Läufen jeder Epoche: **0**.
Seitenfehler: **0**. Rohdaten: `…/protokoll/neuprobe-e{1..4}.json`.

### Eine Empfehlung an die Aufsicht, die nicht mir gehört

Die vorhandenen Meßgeräte benutzen `?neu=1` **nicht** —
`werkbank/schuss/rueckkopplung-r3/linie.mjs:66`,
`werkbank/schuss/spiel-w12/hand3.mjs`, `…/gegnerblick.mjs`,
`werkbank/schuss/aufsicht/messfenster.sh` und `werkbank/schuss.mjs` laden
alle ohne den Schalter. Heute schützt sie allein, daß Playwright je Lauf
einen frischen Kontext öffnet. **Das ist ein glücklicher Umstand, kein
Entwurf** (Entscheidung ② der Aufsicht). Am fremden Meßgerät wird nicht
gedreht (ZUSTAENDIGKEIT 16), also steht es hier statt in deren Dateien: wer
zwei Läufe im selben Kontext fährt oder einen Browser mit Profil benutzt,
mißt ab Lauf zwei eine andere Partie. Der Schalter kostet acht Zeichen in
der Adresse.

---

## R3 — Der zweite Satz am unteren Rand

```js
BRAUHAUS.welt.meldeZiel(satz, naehe)
```

Gebaut wie `meldeZug(was, preis, art, zug)`: **in jedem Zeichendurchgang neu
melden**, denn `kern/buehne.js` vergißt die Meldungen vor jedem Durchgang —
genauso wie den nächsten Zug. `satz` ist Klartext, `naehe` ist 0..1 oder
`null` („unbekannt"). Melden mehrere Stücke, gewinnt die größte `naehe`; bei
Gleichstand die zuerst gemeldete. `B.welt.bestesZiel()` gibt die Meldung
zurück, die gezeigt wird, oder `null`.

Der Rahmen zeichnet sie **über** *„nächster Zug: …"* (`left:93% · top:86,6 %`,
rechtsbündig, dieselbe Schrift, derselbe Lichthof), mit `data-ziel="1"` und
`data-ziel-naehe`. Form:

```
Ziel: Noch 3 Braujahre, dann ist das Haus alt genug für eine Übergabe.  (40 % des Wegs)
nächster Zug: Zuvorkommen Klosterschenke Obernberg — 19 Pf  (Kasse reicht 5,9×)
```

**Meldet niemand, bleibt die Zeile leer** — sie erfindet nichts, und sie zeigt
nichts Altes. Heute meldet niemand: **DIE FUHRE liefert den Satz** (R11), sie
hat ihn in `stuecke/fuhre.js:1020` `uebergabeFehlt()` seit Welle 6 im
Klartext. Gemessen im Ladezustand: `document.querySelector('.zielzeile')`
ist `null`, und das ist der richtige Zustand, solange niemand meldet.

Dokumentiert in `spiel/LIESMICH.md` unter *„Welt — lesen frei, ändern nur
über die API"*.

**Nachtrag am Ende des Laufs: DIE FUHRE hat die Schnittstelle genommen.**
`stuecke/fuhre.js:2760` `meldeZiel()` ruft sie in jedem Zeichendurchgang
(`:5303`), mit drei Sätzen und einer gerechneten Nähe:

* `:2766` *„… liegt auf dem Tisch — noch n Wochen"* (Angebot liegt)
* `:2772` *„das Haus weitergeben, solange es steht — zu Michaeli liegt das Angebot."*, `naehe` 0,95
* `:2775` *„das Haus weitergeben, solange es steht. "* + `uebergabeFehlt()`, `naehe` aus `zielNaehe()`

`:2761` prüft `if (!B.welt.meldeZiel) return;` — *„Rahmen ohne R3 — dann
keine Zeile"*. Die Schnittstelle hält also auch von der anderen Seite.

---

## R4 — Der Startschirm sagt, was das hier ist

`kern/start.js` legt beim Anlassen einen **Anschlag** unten links auf
(`left:2,4 % · top:74,4 % · width:47 %`), vier Absätze, kein Handbuch:

> **BRAUHAUS ZUM ANKER · 1350 · DAS RECHT**
> Du führst dieses Haus: brauen, ausliefern, die Abnehmer halten, die Abgaben
> zahlen. *(dazu der Satz der Epoche aus `welt.js`)*
> **DAS ZIEL —** das Haus so weit bringen, daß es übergeben werden kann: an
> die nächste Hand, vor dem Rat. **Gewinnen** heißt hier nicht groß werden,
> sondern übergeben können — und die meisten Jahre geht es zuerst ums
> **Überleben**.
> **SO ENDET ES SCHLECHT —** wenn niemand in der Stadt mehr abnimmt, ist das
> Haus zu. Nicht die leere Kasse macht es zu, sondern das leere Auftragsbuch.
> Auch eine Pfanne, die drei Jahre kalt bleibt, und ein leerer Hof mit
> Schulden beenden die Partie.
> **JEDE EPOCHE IST EIN EIGENES SZENARIO —** 1350, 1600, 1884, 1970, jede mit
> eigenem Anfang und eigenem Ende. Sie zeigen denselben Ort, aber man spielt
> sie einzeln; keine wächst in die nächste hinüber.
> **[ Anfangen ]**

Der letzte Absatz ist Entscheidung ① der Aufsicht, wörtlich eingelöst. Die
drei Sätze zum schlechten Ende sind nicht erfunden, sondern die drei Ursachen,
die im Spiel wirklich `B.uhr.beende()` rufen: `stuecke/fuhre.js:959`
(keine Abnehmer), `stuecke/sud.js:1058` (drei Jahre kalte Pfanne),
`stuecke/stadt.js:322` (leerer Hof, negative Kasse). Der Satz *„Nicht die
leere Kasse hat das Haus zugemacht"* steht im Schlußblatt des Spiels selbst
und ist nach dem Urteil dessen bester Satz.

**Kein Wort aus einer einzelnen Epoche.** Der erste Entwurf sagte *„wenn keine
Schenke der Stadt mehr ein Faß nimmt, ist das Braurecht weg"* — drei Wörter
von 1350, und derselbe Anschlag steht auch 1970 da, wo es Gaststätten,
Hektoliter und kein verliehenes Braurecht gibt. Was epochenweise wechselt,
kommt aus `welt.js` (`e.name`, `e.sagt`, das Jahr) und nicht aus einem Satz,
den der Rahmen erfindet.

**Drei Dinge, die dieser Anschlag ausdrücklich nicht tut**, und jedes hat
einen Grund, der eine Meßreihe rettet:

1. **Er hält nichts auf.** Kein Vorschaltbild, kein Klick, der erst
   weggeräumt werden müßte. Jede messende Hand dieses Laufs (`hand3.mjs`,
   `linie.mjs`, `gegnerblick.mjs`, `schuss.mjs`) fängt unmittelbar nach dem
   Laden an zu klicken; ein Blatt davor hätte jede Meßreihe seit Welle 7
   unbrauchbar gemacht.
2. **Er nimmt keinen Klick.** Der Behälter trägt `pointer-events:none`, nur
   der Knopf *„Anfangen"* nimmt selbst an. `document.elementFromPoint` — mit
   dem der Kritiker prüft, ob ein Knopf wirklich zu greifen ist — sieht durch
   ihn hindurch. Er kann keinem Zug im Weg stehen.
3. **Er ist kein Kasten.** Kein Grund, kein Rand, nur der Lichthof, den die
   Hauszeile auch trägt. Siehe Flächenhaushalt unten.

Weg ist er nach dem ersten Wochenwechsel (Horcher auf `woche` und `jahr`,
**keine Frist**) oder früher, wenn jemand *„Anfangen"* drückt.

---

## R5 — `B.uhr.springe()` geprüft

**Es war kaputt, und daß kein Stück es je gerufen hat, war Glück.** Was
dastand:

```js
springe: function (jahre) {
  var n = B.grenze(jahre | 0, 1, 400);
  for (var i = 0; i < n && !B.welt.zeit.ende; i++) {
    B.welt.zeit.woche = WOCHEN_IM_JAHR;      // <- der Fehler
    B.uhr.schliesseJahr();
  }
  B.sende('zeichne', { grund: 'sprung' });
}
```

Die markierte Zeile setzt den Zähler auf die letzte Woche und schließt das
Jahr. Damit **fanden die übersprungenen Wochen nicht statt**: kein
`vorwoche`, kein `woche`, kein `welt.verfall()`. Das Bier im Keller verdarb
nicht, der Gegner zog nicht, geliefert wurde nicht, gezahlt wurde nicht — nur
der Jahresabschluß lief. Ein Haus, das zwölf Jahre „springt", käme mit vollem
Keller und ohne einen einzigen Zug des Adlers heraus. Als Werkzeug für A7
(*„Wochen ohne Entscheidung werden zusammengefaßt"*) war das unbrauchbar:
zusammenfassen heißt, daß dasselbe passiert, nur ohne Hand.

Dazu lief `B.sende('zeichne')` bei **jedem** Jahresschluß mit — zwölf Jahre
also zwölfmal, zwölf Bilder, die niemand sah, jedes mit den sieben
rAF-Stellen des Spiels im Schlepptau.

**Jetzt:** `eineWoche()` ist aus `naechsteWoche()` herausgelöst; ein Sprung
läßt jede Woche wirklich laufen, mit allen Ereignissen, und malt **einmal** am
Ende (`grund:'sprung'`). Der Würfel dreht sich dabei genau so oft wie beim
Spielen. Ein Sprung ist damit *„n-mal WEITER drücken, ohne hinzusehen"* und
nichts anderes.

```js
BRAUHAUS.uhr.springe(3)          // 3 Braujahre  -> {jahre, wochen, angehalten}
BRAUHAUS.uhr.springeWochen(8)    // 8 Wochen     -> dito
```

`angehalten`: `null` · `'ende'` (das Spiel ist zu Ende gegangen — man
überspringt kein Spielende) · `'grenze'` (`B.uhr.SPRUNG_HOECHST` = 3.000
Wochen, der Riegel gegen einen Rechenfehler in einem Stück).
Gesichert wird **einmal** am Ende des Sprungs, nicht je Woche.
Drei Zeilen dazu stehen in `spiel/LIESMICH.md` im Kasten *„springe() — die
drei Zeilen, nach denen Welle 13 gefragt hat"*.

**Nachtrag am Ende des Laufs: DIE FUHRE ruft es.** `stuecke/fuhre.js:1717`
`springeWochen(n)` → `:1731` `B.uhr.springeWochen(1)`, angeboten über den
Knopf in `:3722`. Damit ist R5 nicht mehr nur „geprüft und gebaut", sondern
im Spiel — und A7 hat sein Werkzeug.

### Abnahme — `werkbank/schuss/rahmen-w13/sprungprobe.mjs`

Die Frage ist nicht *„läuft es durch"*, sondern **ist ein Sprung dasselbe wie
Klicken**. Also zweimal gespielt, dieselbe Saat, zwei frische Kontexte:
**A** — mit echter Maus WEITER drücken, bis die Woche 30-mal wirklich
gerückt ist; **B** — einmal `B.uhr.springeWochen(30)`. Verglichen werden elf
Felder. Dazu **C**, die alte Fassung mit derselben Hand nachgestellt
(`woche = 30` setzen, `schliesseJahr()` rufen).

**Epoche 1350, Saat 1350, ein Braujahr:**

| | Jahr/Woche | Kasse | Rohstoff | Chronik | Buch | Züge d. Gegners | Verfall-Buchungen | Würfelzähler |
|---|---|---|---|---|---|---|---|---|
| Anfang | 1350/1 | 112 | 40 | 4 | 1 | 1 | 0 | 1312461287 |
| **A geklickt** | 1351/1 | 48 | 7 | 20 | 98 | 19 | 16 | 691532714 |
| **B gesprungen** | **1351/1** | **48** | **7** | **20** | **98** | **19** | **16** | **691532714** |
| C alte Fassung | 1351/1 | **88** | **40** | **13** | **14** | **1** | **7** | 1688532169 |

**A gegen B: keine Abweichung in elf von elf Feldern** — bis auf den
Zählerstand des Würfels. Ein Sprung ist Ziffer für Ziffer dasselbe wie
dreißigmal WEITER drücken, ohne hinzusehen.

**A gegen C: sieben von elf Feldern weichen ab**, und die Liste liest sich
wie die Fehlerbeschreibung: der **Rohstoff steht unverändert auf 40** (es
wurde nie gebraut), es gibt **7 statt 16** Verfall-Buchungen, **14 statt 98**
Buchzeilen, und der Adler hat **einen statt neunzehn** Zügen getan. Das ist
kein erzähltes Jahr; das ist ein Jahr, das nicht stattgefunden hat.

**Epoche 1600, dieselbe Probe, dasselbe Bild:**

| | Jahr/Woche | Kasse | Rohstoff | Chronik | Buch | Züge d. Gegners | Verfall |
|---|---|---|---|---|---|---|---|
| **A geklickt** | 1601/1 | 291 | 1 | 17 | 104 | 19 | 14 |
| **B gesprungen** | **1601/1** | **291** | **1** | **17** | **104** | **19** | **14** |
| C alte Fassung | 1601/1 | **370** | **65** | **14** | **17** | **1** | **7** |

`abweichungSprungGegenKlicken` = **[]** in beiden Epochen. `lage` = 0,
Seitenfehler = 0. Rückgabe jeweils `{jahre:1, wochen:30, angehalten:null}`.
Rohdaten: `…/protokoll/sprungprobe-e{1,2}.json`.

**Was ich am Klickweg ausdrücklich NICHT geändert habe:** am Jahreswechsel
gab es immer **zwei** Zeichenrunden — eine mit `grund:'jahr'` aus
`schliesseJahr()`, eine mit `grund:'woche'` aus `naechsteWoche()`. Sie
zusammenzulegen wäre aufgeräumter und **wäre eine Änderung am Spielverlauf**;
sieben rAF-Stellen des Spiels hängen an der Zahl der Zeichenrunden, und die
Wiederholbarkeit dieses Laufs ist teuer erkauft. `stumm` gilt nur im Sprung.

---

## Die Falle: kostet das Sichern Zeit im Zeichenweg?

**Gemessen** (`werkbank/schuss/rahmen-w13/kosten.mjs`, E1, Saat 1350, je
21 Durchläufe von `JSON.stringify` + `localStorage.setItem` an einem eigenen
Schlüssel, `performance.now()` **in der Probe**, nicht im Spiel):

| Stand | Buchzeilen | Länge des Standes | min / Mittel / max |
|---|---|---|---|
| Ladezustand 1350/1 | 1 | 5.430 Zeichen | 0,00 / **0,10** / 1,30 ms |
| nach 10 Runden · 1350/18 | 152 | 31.543 Zeichen | 0,20 / **0,50** / 2,50 ms |
| nach 20 Runden · 1351/8 | 263 | 50.587 Zeichen | 0,30 / **0,70** / 4,30 ms |
| nach 30 Runden · 1351/28 | 367 | 67.666 Zeichen | 0,50 / **0,70** / 2,80 ms |

**Der Mittelwert liegt bei 0,7 ms je Wochenwechsel.** Zum Vergleich, aus dem
Kopf von `kern/runde.js`: die Wanduhrfrist, an der Welle 12 zerbrochen ist,
war **420 ms**, und die messende Hand wartet nach jedem Klick rund **33 ms**.
Das Sichern liegt zwei Größenordnungen darunter, und — was mehr zählt als die
Zahl — es **verzweigt nicht**: es ist derselbe synchrone Block in jeder
Woche, ohne Frist, ohne Wiederholung, ohne Bedingung auf eine Uhr.

Was gebaut ist, damit die Antwort überhaupt eine Chance hat:

* In `kern/stand.js` steht **kein** `setTimeout`, **kein** `setInterval`,
  **kein** `requestAnimationFrame` und **kein** `Date.now()`/
  `performance.now()`. Nachprüfbar mit einem `grep` über die Datei.
* Gesichert wird **synchron** am Ende von `naechsteWoche()`, in derselben
  Aufrufkette wie der Klick auf WEITER — nach dem `zeichne`, vor der Rückkehr
  aus dem Klickbehandler. Kein *„gleich noch sichern"*.
* **Kein Zeitstempel im Stand.** Damit ist der geschriebene Stand selbst
  wiederholbar: dieselbe Saat, dieselben Klicks, Zeichen für Zeichen derselbe
  Eintrag. Das ist die einzige Art, diese Datei überhaupt prüfbar zu machen.
* Wird der Text zu lang (> 3.000.000 Zeichen), wird **das Buch von vorn**
  gekürzt (das älteste zuerst, mindestens 500 Zeilen bleiben) und der Verlust
  im Stand vermerkt (`buchAb`). Die Chronik wird nie gekürzt.
* Sagt der Speicher nein (privates Fenster, kein Platz), läuft das Spiel wie
  vor Welle 13 weiter, und `BRAUHAUS.stand.bericht().klagen` sagt, warum.

---

## Flächenhaushalt — diese Welle kostet **null Pixel**

Gemessen im Ladezustand E1, 2752×1536, **vor** meinen Änderungen:

```
kern        98.096 / 120.000 px          oben  78.336 / 80.000 px
```

Im obersten Sechstel waren das **1.664 px Vorrat** — kein Platz für einen
weiteren Kasten. Deshalb trägt **alles**, was diese Welle an den Bildschirm
schreibt, keinen Grund und keinen Rahmen, sondern denselben Lichthof wie die
Hauszeile und die Zeile *„nächster Zug: …"*: die Standzeile, der Knopf *„Neue
Partie"*, die Rückfrage, die Zielzeile und der Anschlag am Anfang.
`haushalt.istKasten()` sieht so etwas nicht — es prüft Hintergrundfarbe
(Alpha > 0,35), Verlauf und Rand (≥ 1 px). Ein echtes `<button>` mit
sichtbarem deutschem Text und stabilem `data-zug` bleibt es trotzdem; die
Bedienregel hängt am Knopf, nicht am Grund.

**Nachgemessen, und zwar so, daß es nicht zu bestreiten ist**
(`griffprobe.mjs`): in **einem** Augenblick wird `haushalt.miss()` zweimal
gerufen — einmal wie es steht, und einmal, nachdem `.standzeile`,
`.zielzeile`, `.startzettel` und `.neu-frage` aus dem DOM genommen wurden
(und danach wieder eingehängt). Beide Zahlen aus demselben Fenster,
demselben Bild, derselben Sekunde:

| Epoche (1600×900) | kern **mit** | kern **ohne** | Unterschied |
|---|---|---|---|
| 1350 | 105.395 / oben 84.541 | 105.395 / oben 84.541 | **0 / 0** |
| 1600 | 107.931 / oben 87.078 | 107.931 / oben 87.078 | **0 / 0** |
| 1884 | 112.158 / oben 91.305 | 112.158 / oben 91.305 | **0 / 0** |
| 1970 | 110.467 / oben 89.614 | 110.467 / oben 89.614 | **0 / 0** |

`kaesten` bleibt in jeder Epoche **9** — Kopfleiste, ihre sieben Tafeln und
die WEITER-Tafel, genau wie vor der Welle.

> **Ein Befund, der nicht meiner ist und deshalb hierhin gehört:** bei
> **1600×900** liegt `kern` schon **ohne** meine Zeilen bei 84.541–91.305 px
> im obersten Sechstel, also über der Grenze von 80.000 — und das gilt für
> jede Zeile dieser Tabelle in der Spalte *ohne*. Der Grund ist nicht der
> Inhalt, sondern die Rasterung: `haushalt.miss()` legt ein 4-px-Raster über
> das **Fenster** und rechnet die Zellen auf die Bezugsfläche 2752×1536 hoch;
> bei 1600 Breite deckt eine Zelle 6,88 Bezugspixel je Kante, und jede Kante
> eines Kastens wird aufgerundet. Auf der Entwurfsleinwand 2752×1536 mißt
> dieselbe Kopfleiste 78.336 px. **Wer den Haushalt abnimmt, mißt auf der
> Entwurfsleinwand** — sonst mißt er die Rasterweite mit.

---

## Der Anschlag: zwei Fehler, die ich selbst gemessen und behoben habe

Beide gefunden mit `werkbank/schuss/rahmen-w13/griffprobe.mjs`, beide vom
selben Schlag — etwas, das man am Bildschirm nicht sieht und das trotzdem
eine Partie verschiebt.

**1 · Ein unsichtbarer Balken, der Klicks fraß.** `pointer-events:auto` stand
am umschließenden `<div>` des *„Anfangen"*-Knopfes. Das ist ein Blockelement
über die volle Breite des Anschlags — ein Streifen von rund 750×40 px, der
Klicks abfing. Gemessen: `sud:gaerung:keller` (1600) und
`fuhre:listen:neustadt` (1970) lagen darunter, waren am Bildschirm zu sehen
und ließen sich nicht anfassen. Genau daraus wird ein ausgefallener Klick,
und aus einem ausgefallenen Klick eine andere Partie. `pointer-events:auto`
gehört an den Knopf und an nichts sonst.
*Nach der Änderung:* `vomAnschlagVerdeckt` = **[]** in allen vier Epochen.

**2 · Der Anschlag lief durch den Zielsatz.** Im ersten Entwurf 47 % breit ab
74,4 % Höhe — auf der Aufnahme 2752×1536 lief *„JEDE EPOCHE IST EIN EIGENES
SZENARIO …"* mitten durch *„Ziel: das Haus weitergeben …"*. Jetzt ist die
Zielzeile auf **53 % Breite** begrenzt (also nie weiter links als 40 %) und
der Anschlag auf **36 %** — sie können sich nicht mehr treffen, egal wie lang
der Satz wird, den ein Stück meldet.

**3 · Er war zu blaß zum Lesen.** Drei Schatten wie die Hauszeile reichen für
eine Zeile, nicht für zwölf über einem gezeichneten Hof. Jetzt vier engere
Schatten und `font-weight:600` — nachgesehen am Ausschnitt in voller
Auflösung, nicht am verkleinerten Gesamtbild.

---

## Schlußabnahme

### Die geforderte — vier Epochen, Entwurfsleinwand

```
node werkbank/schuss.mjs "http://127.0.0.1:8921/spiel/?epoche=N" \
     werkbank/schuss/welle13-rahmen-eN.png 2752 1536
```

| | Ausgabe | `BRAUHAUS.lage.length` | `haushalt.tafeln()` | `ueberRand()` |
|---|---|---|---|---|
| **1350** | **keine Fehler auf der Seite** | **0** | leer | leer |
| **1600** | **keine Fehler auf der Seite** | **0** | leer | leer |
| **1884** | **keine Fehler auf der Seite** | **0** | leer | leer |
| **1970** | **keine Fehler auf der Seite** | **0** | leer | leer |

Bilder: `werkbank/schuss/welle13-rahmen-e{1..4}.png`. **Angesehen**, nicht nur
erzeugt — und zweimal daraufhin geändert (siehe *„Der Anschlag: zwei Fehler"*).
Der Ausschnitt des Anschlags in voller Auflösung liegt als
`werkbank/schuss/rahmen-w13/schuesse/griff-e{1..4}-1600x900.png` daneben.

### Die Wörter, nach denen §5 des Urteils fragt

Gezählt über alle sichtbaren Textzeilen des ersten Schirms, 1600×900, wie der
Kritiker gezählt hat (dort: **0 von 613 Zeilen**):

| | Textzeilen | *Ziel* | *gewinnen* | *überleben* |
|---|---|---|---|---|
| **1350** | 410 | **2** | **1** | **1** |
| **1600** | 425 | **5** | **1** | **1** |
| **1884** | 426 | **2** | **1** | **1** |
| **1970** | 437 | **3** | **1** | **1** |

Und zwar an **zwei** Stellen, ohne daß ein Brett aufgeschlagen wird:

* im Anschlag — *„DAS ZIEL —"* und *„Gewinnen heißt hier nicht groß werden,
  sondern übergeben können — und die meisten Jahre geht es zuerst ums
  Überleben."*
* am unteren Rand, aus DER FUHRE über `meldeZiel` — *„Ziel: das Haus
  weitergeben, solange es steht. Noch 5 Braujahre, dann ist das Haus alt
  genug für eine Übergabe. (33 % des Wegs)"*

*(Die höheren Zählungen in 1600 und 1970 kommen von Wörtern anderer Stücke,
die „Ziel" im Sinne von Zahlungsziel benutzen — *„Auf Ziel bis Michaeli"*,
*„Lastschrift mit dem Lieferschein, kein Ziel."*. Sie sind mitgezählt, weil
der Kritiker so gezählt hat; die beiden Stellen oben tragen die Latte allein.)*

### Steht der Anschlag einem Zug im Weg?

| Epoche (1600×900) | Züge im Sichtfeld | greifbar | **vom Anschlag verdeckt** |
|---|---|---|---|
| 1350 | 95 | 41 | **0** |
| 1600 | 103 | 43 | **0** |
| 1884 | 106 | 41 | **0** |
| 1970 | 99 | 39 | **0** |

---

## Was ein Kritiker nachzählen kann, ohne Quelltext zu lesen

```js
BRAUHAUS.stand.zeile()      // Modus, Schlüssel, Größe, wie oft geschrieben
BRAUHAUS.stand.bericht()    // dazu: welche Stücke ihren Zustand anmelden (heute: keines)
BRAUHAUS.uhr.springe(1)     // -> {jahre, wochen, angehalten}
BRAUHAUS.welt.bestesZiel()  // was in der Zielzeile steht, oder null
BRAUHAUS.haushalt.tafel()   // Flächenhaushalt, eine Zeile je Stück
```

Am Bildschirm: `[data-fortgesetzt]` trägt *„JJJJ/WW"*, `.zielzeile` trägt
`data-ziel-naehe`, `[data-zug="kern:neu"]` ist der Knopf *„Neue Partie"*,
`[data-zug="kern:anfangen"]` legt den Anschlag beiseite.
`localStorage` trägt genau einen Schlüssel: `brauhaus:<epoche>:<saat>`.

**Zwei Dinge, die ein Kritiker suchen und nicht finden wird, und beide mit
Absicht:**

1. **Der Knopf *„Neue Partie"* fehlt in Woche 1.** Er erscheint erst, wenn
   wirklich ein Stand im Speicher liegt — also nach dem ersten
   Wochenwechsel. Ein Knopf, der verspricht, einen Stand zu verwerfen, den es
   nicht gibt, wäre dieselbe Lüge, an der Welle 12 gehangen hat.
2. **Die Zielzeile fehlt, solange kein Stück meldet.** Steht kein Satz an,
   bleibt die Zeile leer, statt einen alten zu wiederholen.

---

## Was offen bleibt — namentlich, mit Datei und Zeile

*(Nichts davon gehört in diese Welle; alles davon gehört benannt.)*

| # | was | wo | Abnahme |
|---|---|---|---|
| 1 | Der Eigenzustand der acht Stücke wird nicht gesichert | `stuecke/*.js`, je das `Z`-Objekt; am sichtbarsten `gegner.js:517` + `:567` | nach `B.stand.melde()`/`geladen()` muß `wiederkehr.mjs` auch bei `gegnerzuege` keine Abweichung mehr melden |
| 2 | Die Meßgeräte laden ohne `?neu=1` | `rueckkopplung-r3/linie.mjs:66`, `spiel-w12/hand3.mjs`, `…/gegnerblick.mjs`, `aufsicht/messfenster.sh`, `werkbank/schuss.mjs` | drei Läufe im **selben** Kontext ergeben dieselbe Prüfsumme |
| 3 | `haushalt.miss()` mißt bei kleinen Fenstern die Rasterweite mit | `kern/haushalt.js:186` (`RASTER = 4`) | dieselbe Seite bei 1600×900 und 2752×1536 darf nicht 84.541 gegen 78.336 px für dieselben neun Kästen melden |
| 4 | Epochenwechsel im Spiel | Entscheidung ① der Aufsicht — eigene Welle, sobald der Spielstand steht | — |

---

## Meine eigene Prüfung, und was an ihr schwach ist

*Steht bewußt am Schluß und nicht in einer Fußnote.*

1. **Meine Hand ist einfacher als die des Kritikers.** `wiederkehr.mjs`
   drückt vier Knöpfe in fester Reihenfolge und prüft nicht mit
   `elementFromPoint`, ob sie wirklich getroffen hat. Für die Frage *„steht
   nach dem Neuladen dasselbe da"* genügt das — beide Seiten des Vergleichs
   sehen denselben Zustand. Für Aussagen über Spielstärke oder Deckung taugt
   sie nicht, und ich mache keine.
2. **Zwölf Wochen sind kurz.** Die Wiederkehr-Probe deckt eine Sitzung von
   zwölf Runden ab, nicht 284. Die Prüfsummenprobe geht über 30 Runden und
   damit über einen Jahreswechsel; über einen **Epochenwechsel** oder einen
   **Erbfall in der fortgesetzten Partie** habe ich nicht gemessen.
3. **Ich habe den vollen Speicher nie gesehen.** Die Kürzung des Buches
   (> 3.000.000 Zeichen) und das Aufgeben nach drei Verweigerungen sind
   gebaut und gelesen, aber nicht ausgelöst worden; der größte gemessene
   Stand war 70.524 Zeichen (1970, drei Läufe ohne `neu=1`). Das ist ein
   Zweiundvierzigstel der Grenze.
4. **Das Spiel bewegte sich unter der Messung.** Drei andere Bauer
   schreiben zur selben Stunde in `spiel/stuecke/**`. Jede meiner Zahlen ist
   ein Vergleich **innerhalb** eines Laufs; Absolutwerte aus zwei Stunden
   stehen nirgends nebeneinander, ohne daß die Stunde dabeisteht.
5. **Die Zielzeile habe ich nicht selbst gefüllt.** Was am unteren Rand
   steht, kommt aus `stuecke/fuhre.js` — ich habe den Platz, die Regel und
   die Leerfassung gemessen, nicht den Satz.
6. **Ein Fenster.** 1600×900 für die Zählungen, 2752×1536 für die Bilder.
   Bei 1366×768 habe ich nicht gemessen.

---

## Stand dieses Berichts

Alle fünf Auflagen R1–R5 sind gebaut und gemessen. Zwei davon (`meldeZiel`,
`springeWochen`) werden von DER FUHRE bereits gerufen. `spiel/LIESMICH.md` ist
fortgeschrieben. Vier Epochen: *„keine Fehler auf der Seite"*, `lage` 0.
