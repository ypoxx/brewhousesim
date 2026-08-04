# DIE FUHRE · Welle 6 · Urteil des blinden Kritikers

*Gespielt und gemessen am eingefrorenen Messstand `http://127.0.0.1:8900`,
Marke `7440a09` (dreimal gegengeprüft: `curl -s /.messstand-marke` → `7440a09`).
Saat 1350, alle vier Epochen. Der Kritiker hat den Baubericht des Builders
nicht gelesen und keine Commit-Historie eingesehen; gelesen hat er den
Quelltext des Spiels, weil ein Urteil ohne Ursache nichts wert ist.*

**Diese Datei wird laufend geschrieben, nicht am Ende.** Was hier steht, ist
gemessen. Was noch fehlt, steht unter „Noch offen".

---

## 0 — Der Messstand und die Geräte

| | |
|---|---|
| Messstand | `:8900`, Marke `7440a09` |
| ρ-Gerät | `werkbank/schuss/rueckkopplung-r3/linie.mjs`, 400 Wochen, je Epoche **drei** Läufe, jeder einzeln durch `messfenster.sh` |
| Lesbarkeit | eigenes Gerät `werkbank/schuss/fuhre-blind-w6/lesbar.mjs` — trennt **FUHRE** von **fremd** |
| Griff | eigenes Gerät `…/griff.mjs` — `elementFromPoint` je Zug, je Reiterstellung |
| Schnitt | eigenes Gerät `…/schnitt.mjs` — trennt **abgeschnitten** von **gerollt**, achsenweise |

**Warum eigene Geräte und nicht `aufsicht/lesbarkeit.mjs`:** dessen Zahl ist
eine Summe über das ganze Spiel und sagt nicht, welches Stück sie erzeugt hat
— ein Kritiker der FUHRE würde damit über fremde Arbeit mit urteilen. Und
seine Überlaufzählung (`lesbarkeit.mjs:26–32`) prüft, ob *irgendeine* Achse
auf `hidden` steht, und zählt dann *jede* überlaufende Achse mit. Ein Kasten
mit `overflow-x: hidden; overflow-y: auto`, der nur senkrecht überläuft,
erscheint dort als „abgeschnittener Kasten", obwohl er rollt. **Genau so
entstehen die vier „abgeschnittenen Kästen" der FUHRE, die es nicht gibt.**

---

## 1 — LATTE 4, DIE LESBARKEIT (1366×768)

### 1.1 Die drei Zahlen der Latte, am Stück gemessen

Alle vier Epochen, 1366×768, alle vier Bretter der FUHRE aufgeschlagen.
Getrennt gezählt: was in einem `#fach-*-fuhre` liegt, eine `fu-`-Klasse trägt
oder einen `data-zug="fuhre:*"` hat — gegen alles Übrige („fremd").

| Epoche | Schrift < 12 px **FUHRE** | *fremd* | Knopf < 24×24 **FUHRE** | *fremd* | echt abgeschnitten **FUHRE** | *fremd* |
|---|---|---|---|---|---|---|
| 1350 | **0** | 277 | **0** von 21 aktiven | 0 | **0** | 9 |
| 1600 | **0** | 281 | **0** von 20 aktiven | 0 | **0** | 8 |
| 1884 | **0** | 277 | **0** von 24 aktiven | 0 | **0** | 9 |
| 1970 | **0** | 284 | **0** von 22 aktiven | 0 | **0** | 10 |

Dazu abgeschnitten durch `text-overflow: ellipsis`: **FUHRE 0**, fremd
16 / 17 / 16 / 18. Gerollt (kein Rissgrund): FUHRE 3 je Epoche — die
Adressliste, die Sortenliste und die Anschlagtafel selbst.

**So weit: kein Riss.** 0 · 0 · 0 in allen vier Epochen.
Ich habe die vier Bretter einzeln aufgeschlagen und die Bildschirme selbst
angesehen: die Adresszeilen, die Zielkarten, die Sortenliste und die
Frachtstufen sind bei 1366×768 ohne Mühe zu lesen.

Die 277–284 Textknoten unter 12 px je Epoche liegen **außerhalb** der FUHRE
(Michaelitafel, Gegnerkarte, Erbeband, Werkbank, Kopfzeile). Sie sind hier
nur als Maßstab genannt: die FUHRE trägt an dieser Zahl **null**.

### 1.1a Und dann habe ich die Rollleiste eingeschaltet — und es riss doch

**Playwright startet Chromium mit `--hide-scrollbars`.** Das steht in der
Kommandozeile jedes headless-Laufs dieses Projekts, also auch in
`aufsicht/lesbarkeit.mjs` und in jedem Messgerät, das ich bisher benannt
habe. Ein echter Desktop-Browser unter Windows oder Linux zeichnet dagegen
eine **15–17 px breite Rollleiste** in jeden Kasten mit `overflow-y: auto` —
und die drei rollenden Kästen der FUHRE haben genau das. Ich habe deshalb
alles noch einmal mit `ignoreDefaultArgs: ['--hide-scrollbars']` gemessen
(`ECHTEBALKEN=1`, Rollleiste gemessen: `.fu-liste` 15 px, `.fu-sorten` 15 px,
`.fu-brett.fu-tafel` 17 px):

| Fenster | echt abgeschnittene Kästen der FUHRE | welche |
|---|---|---|
| 1600×1000 | 0 | — |
| **1366×768** | **2** | `.fu-kerbsatz` in **1350** und **1884** |
| 1280×800 | **4** | `.fu-kerbsatz` in 1350, 1884, 1970 · `.fu-frachtbrief` in 1884 |

Der Kasten: `.fu-kerbsatz`, `fuhre-zusatz.css:173–181` — `-webkit-line-clamp: 2`
plus `overflow: hidden`. Bei 12 px in einem 289 px breiten Kasten passt der
Satz in zwei Zeilen; **15 px Rollleiste weniger, also 274 px, und er braucht
drei** (gemessen 274 × 29 px Kasten gegen 274 × 43 px Inhalt). Die dritte
Zeile wird hart abgeschnitten. Betroffen:

* 1350 — „Der Grutherr schneidet die Kerbe ins Holz und zahlt aus. Zu Georgi
  wird gelöscht — in Geld, wenn welches da ist."
* 1884 — „Ein Wechsel auf drei Monate, akzeptiert vom Malzhändler. Fällig zu
  Georgi, wie jedes Papier dieses Hauses."

Das ist **der Erklärsatz des Kerbholzes** — nach `fuhre-daten.js` eine der
drei Antworten auf die leere Kasse und die Stelle, an der das Spiel dem
Spieler sagt, womit er sie bezahlt.

**Damit reißt Latte 4 an diesem Stück — in zwei von vier Epochen, bei
1366×768, auf jedem Bildschirm mit sichtbarer Rollleiste.** Auflage 2.

**Und ein Befund über die Messgeräte dieses Laufs**, der über die FUHRE
hinausgeht: **jede Lesbarkeitszahl, die hier bisher gemessen wurde, ist ohne
Rollleiste gemessen.** Für ein Spiel, das `overflow: hidden` auf `html, body`
setzt (`grund.css:100`) und seine Kästen einzeln rollen lässt, ist das kein
kleiner Unterschied: es sind 15 px je rollendem Kasten, und die Latte hängt
an Umbrüchen. Wer Latte 4 misst, misst sie ab jetzt **mit** Rollleiste — oder
sagt dazu, dass er es nicht getan hat.

### 1.2 Was verschwunden ist, statt lesbar zu werden — gezählt

Zwei Regeln in `stil/fuhre-zusatz.css` blenden unterhalb der
Entwurfsleinwand Text aus. Gezählt wurden die Knoten, die bei 1366×768
`display: none` tragen **und Text führen**:

| Was | Regel | 1350 | 1600 | 1884 | 1970 | Summe |
|---|---|---|---|---|---|---|
| `.fu-ziel-satz` — der Erklärsatz über DAS ZIEL | `fuhre-zusatz.css:874` | 1 | 1 | 1 | 1 | **4** |
| `.fu-zahlen` — „12·9·7 von 30 hl" je Adresse | `fuhre-zusatz.css:902` | 10 | 10 | 10 | 11 | **41** |

**45 Textknoten sind bei 1366×768 nicht mehr am Schirm.** Beide Male steht
der Text noch im `title` (`fuhre.js:2575` bzw. `fuhre.js:2741`) — also eine
Mausbewegung entfernt, aber nicht mehr im Bild.

Bewertung, getrennt nach Gewicht:

* **`.fu-ziel-satz` — vertretbar.** Der Satz beschreibt die Zahlungsweise im
  Allgemeinen. Was die drei Karten *voneinander* unterscheidet — Name, ein
  eigener Erklärtext je Karte, drei Prozentzahlen, der Knopf — steht
  vollständig in den Karten und ist bei 1366×768 lesbar. Ich habe das am Bild
  geprüft: „Bar auf die Hand / bar 100 % / Bestellung 66 % / Ausfall 0 %"
  gegen „Aufs Kerbholz … bar 40 % / Bestellung 100 % / Ausfall 5 %" gegen
  „Auf Borg … bar 12 % / Bestellung 132 % / Ausfall 15 %". Die Wahl ist ohne
  den Satz zu treffen.
* **`.fu-zahlen` — der teurere Verlust, aber gedeckt.** Die Zahlenkette trug
  den Absatz der drei letzten Braujahre gegen den Jahresbedarf. Sichtbar
  bleiben: der aktuelle Bedarf in Zeile 2 („will 4 Fass"), die drei Balken
  (`.fu-reihe`, mit `mager`-Färbung unter einem Drittel) und die drei
  Mahnpunkte. Die *Richtung* ist also weiter im Bild, die *Ziffer* nicht.
  Für die Entscheidung „wen belade ich" reicht das; für „wie knapp steht es"
  muss man hovern.

**Eine Auflage folgt daraus trotzdem** (Auflage 1, unten): der Balken trägt
keine Zahl und keinen Maßstab. Wer bei 1366×768 nur klickt und nie hovert,
sieht drei verschieden hohe Striche ohne Bezugsgröße.

### 1.3 Bedienbarkeit: was die Maus in der Mitte trifft

`griff.mjs`, 1366×768, je Reiterstellung gemessen, dann die beste Stellung je
Zug genommen:

| Epoche | fuhre-Züge | davon aktiv | ohne Fläche | nicht ganz im Fenster | Maus trifft nicht | unter 24 px |
|---|---|---|---|---|---|---|
| 1350 | 34 | 21 | 0 | 2 | 5 | **0** |
| 1600 | 40 | 20 | 0 | 1 | 6 | **0** |
| 1884 | 44 | 24 | 0 | 1 | 5 | **0** |
| 1970 | 36 | 22 | 0 | 4 | 7 | **0** |

Die 5–7 „trifft nicht" sind **nicht** verdeckte Knöpfe im Sinn der alten
Eichung, sondern die Adressen, die aus der rollenden Liste hinausgerollt
sind: `.fu-liste` ist bei 1366×768 221–254 px hoch und braucht 460–506 px.
Sichtbar sind damit **5 von 10** Adressen (1350/1600/1884) bzw. **5 von 11**
(1970); die übrigen erreicht man mit dem Mausrad.

**Das ist kein Riss der vierten Latte** — gerollter Text ist nicht
abgeschnittener Text, und der Kasten rollt wirklich (`overflow-y: auto`,
`scrollHeight` 460 gegen `clientHeight` 221). **Es ist aber ein Befund für
die zweite:** die Hälfte der Adressen — und mit ihnen in 1970 vier von fünf
`fuhre:listen:*`, der epocheneigenen Achse — steht beim Aufschlagen des
Bretts nicht im Bild und wird von keiner Zahl angekündigt. Die Kopfzeile
sagt „wollen 15 · im Keller liegen 4 Fass", nicht „10 Adressen".

Siehe Auflage 2.

### 1.4 Der teuerste Fund: der Sudplan zeigt bei 1366×768 ein Drittel von sich

Das ist der schwerste Befund dieser Runde, und er wurde von zwei
unabhängigen Geräten gemessen (`sicht.mjs` und `griff.mjs`).

Die Sortenliste der Anschlagtafel (`.fu-tafel .fu-sorten`) steht bei
1366×768 in **allen vier Epochen exakt auf ihrem Boden von 60 px**, während
sie 118–175 px Inhalt führt. Anteil jeder Sorte, der beim Aufschlagen im
sichtbaren Kasten liegt:

| Epoche | 1. Sorte | 2. Sorte | 3. Sorte | Kasten / Inhalt |
|---|---|---|---|---|
| 1350 | Dünnbier **100 %** | Grutbier 83 % | Starkbier **0 %** | 60 / 118 px |
| 1600 | Schankbier **100 %** | Braunbier **15 %** | Märzenbier **0 %** | 60 / 175 px |
| 1884 | Schankbier **100 %** | Lagerbier 52 % | Exportbier **0 %** | 60 / 137 px |
| 1970 | Vollbier Hell **100 %** | Pilsner 52 % | Exportbier **0 %** | 60 / 137 px |

**Die dritte Sorte ist in keiner Epoche im Bild.** Und `griff.mjs` bestätigt
unabhängig, dass ihre Stellknöpfe die Maus nicht treffen:
`fuhre:tafel-auf:stark` (1350) · `fuhre:tafel-auf:maerzen` und
`fuhre:tafel-ab/auf:braun` (1600) · `fuhre:tafel-auf:export` (1884 und 1970).

**Warum das mehr wiegt als die 45 versteckten Textknoten:** die dritte Sorte
ist in jeder Epoche das teure, lange, sommerfeste Bier — Starkbier,
Märzenbier, Exportbier. Sie ist die Sorte, an der die Knappheit der Epoche
hängt (drei Brautage · Fassplätze · fünf Fuder Eis · Regalmeter), und damit
die Entscheidung, um die dieses Stück gebaut ist. Wer bei 1366×768 die
Anschlagtafel aufschlägt, sieht das Dünnbier und den halben Zweiten. Der Rest
ist eine Radbewegung entfernt, ohne dass irgendetwas am Kasten sagt, dass es
ihn gibt.

**Zum Vergleich bei 1920×1080** (`sicht-1920.json`): Sorten 3/3 · 2/3 · 2/3 ·
3/3. Das Problem gehört also genau dem Fenster, in dem die Latte misst.

**Nach dem Wortlaut ist das kein Riss** — `overflow-y: auto` schneidet keinen
Text ab. **Nach dem Sinn ist es einer:** die vierte Latte steht im Papier
unter der Überschrift „auf dem Bildschirm, den die Leute wirklich haben", und
auf diesem Bildschirm ist die Hauptentscheidung des Stücks nicht zu sehen.
Auflage 1.

---

---

## 2 — DAS GEWICHTSVETO (8 MB): gerissen, aber nicht von der FUHRE

`werkbank/schuss/fuhre-blind-w6/gewicht.mjs`, ein Aufruf je Epoche, alle
Antworten byteweise gezählt:

| Epoche | Anfragen | geladen | davon `bild/hof/**` | `bild/platte/**` | **alles der FUHRE** |
|---|---|---|---|---|---|
| 1350 | 83 | 23,2 MB | 17,49 MB | 4,09 MB | **0,330 MB** |
| 1600 | 85 | 24,3 MB | 17,49 MB | 4,09 MB | **0,330 MB** |
| 1884 | 83 | 23,2 MB | 17,49 MB | 4,09 MB | **0,330 MB** |
| 1970 | 84 | 23,6 MB | 17,49 MB | 4,09 MB | **0,330 MB** |

**Das Veto steht weiter offen: 23,2–24,3 MB gegen eine Obergrenze von 8 MB.**
**Es ist aber nicht die Sache dieses Stücks.** 21,6 MB der 23,2 MB — also
**93 %** — sind `bild/hof/**` und `bild/platte/**`, und `bild/**` gehört nach
`spiel/LIESMICH.md` als Ganzes DER STADT. DIE FUHRE trägt mit allen ihren
Dateien zusammen **0,330 MB, also 1,4 %**. Ein Builder der FUHRE kann dieses
Veto weder reißen noch heilen.

---

## 3 — DIE VERBLISTE JE EPOCHE (Latte 2, vierter Punkt)

Alle `data-zug="fuhre:<verb>:…"` je Epoche, aus `griff-1366.json` gezählt:

| Verb | 1350 | 1600 | 1884 | 1970 |
|---|:--:|:--:|:--:|:--:|
| laden / abladen / abschicken / fuellen / leeren / wie-vorige | ✓ | ✓ | ✓ | ✓ |
| tafel-auf / tafel-ab (Sudplan) | ✓ | ✓ | ✓ | ✓ |
| kauf / rueckkauf | 3+1 | 3+1 | **4**+1 | 3+1 |
| ziel (drei Karten, die einander ausschließen) | ✓ | ✓ | ✓ | ✓ |
| **bann** — Bannbrief des Rats | **✓** | — | — | — |
| **pfand** — das Pfandfass | — | **✓** | — | — |
| **fracht** — die Frachtstufe der Bahn | — | — | **✓** | — |
| **listen** — Regalmeter im Handel | — | — | — | **✓** |

**Elf Verben sind in allen vier Epochen dieselben, eines ist je Epoche
verschieden.** Das ist kein Kostüm — die eigene Achse ist da, sie ist
benannt, und sie ist mechanisch verschieden (ein einmaliger unwiderruflicher
Kauf in 1350, ein wiederkehrender Preis in 1970). Es ist aber auch keine
eigene Verbliste: **1 von 12**. Der Unterschied zwischen den Epochen liegt in
diesem Stück nicht in den Verben, sondern in der Knappheit dahinter —
Brautage · Fassplätze · Eis und Frachtstufe · Regalmeter und Halte. Das ist
sichtbar und es trägt, aber wer nur die Verben zählt, zählt viermal fast
dasselbe.

---

## 4 — KANN MAN ES SPIELEN? Das Klickprotokoll

Gespielt mit einer Klickliste, die ich nach jedem Bild von Hand fortgeschrieben
habe (`werkbank/schuss/fuhre-blind-w6/hand.mjs` + `hand/e1.txt`); die Saat ist
fest, die Wiederholung von vorn ist identisch, die Partie wächst also um genau
die Züge, die ich dazugeschrieben habe. Jeder Klick ist als
`geklickt / GESPERRT / VERDECKT / KEINE FLAECHE / GIBT ES NICHT`
protokolliert, mit Jahr, Woche und Kasse danach.

**Erste Partie 1350, absichtlich unaufmerksam gespielt** (Ziel „Auf Borg"
verabredet, ein zweiter Grutbier-Sud, Grut einmal gekauft, danach jede Woche
nur noch „Wie vorige Woche" + „Fuhre abschicken" + WEITER):

| | |
|---|---|
| gespielt | 1350/1 bis **1354/13** — vier Braujahre, 122 Wochen, 509 Klicks |
| Ende | `Der Rat entzieht dem Haus zum Anker das Braurecht: seit 12 Wochen hat keine Schenke der Stadt ein Fass genommen.` |
| `BRAUHAUS.lage` | **0** durchgehend |
| Seitenfehler | **0** |

**Es ist spielbar, und es ist verlierbar, und es sagt warum.** Der Weg dahin
ist im Protokoll lückenlos: Rohstoff auf 0, Keller leer, „Wie vorige Woche"
und „Fuhre abschicken" gehen aus, der Rat gibt zwölf Wochen Frist, dann ist
Schluss. Das ist kein Defekt, das ist ein verlorenes Spiel — und genau das
hat in diesem Projekt lange gefehlt.

**Drei Beobachtungen aus dem Protokoll, die Auflagen tragen:**

1. **Nach dem Erbfall waren alle vier Bretter der FUHRE zugeklappt**, und ich
   habe elf Wochen lang ins Leere geklickt, bevor ich es am Bild gesehen habe.
   Ursache ist die Platzordnung der STADT (das Erbeblatt schlägt auf und legt
   sich über die halbe Bühne), nicht die FUHRE — aber die FUHRE ist der
   Leidtragende: `fuhre:wie-vorige` und `fuhre:abschicken` melden dabei
   `disabled`, und `disabled` heißt hier zweierlei (LAUFENDER-AUFTRAG,
   „`disabled` misst zwei Dinge zugleich"). **Am Bildschirm ist „das Brett
   liegt unter dem Erbeblatt" nicht von „der Keller ist leer" zu
   unterscheiden.** Auflage 3.
2. **Züge des Gegners geschehen ohne den Spieler** und stehen in der Chronik:
   `Gasthof Lindenhof geht an Brauhaus zum Adler. Gebunden mit Konzession des
   Rats bis 1355.` · `Mühlschenke nimmt nichts mehr.` · `Zum Goldenen Ochsen
   ist wieder frei.` Das ist der Anstoß-Test, und er ist bestanden.
3. **Ein Befund über das MESSEN, den dieser Lauf noch nicht hat.** Beim Laden
   sind **alle vier Bretter der FUHRE zugeklappt** (`stadt-zugeklappt`) — und
   zwar bei **jeder** Fenstergröße, 1366×768 wie 1920×1080 wie 2752×1536.
   Gemessen in Woche 1, je Epoche:

   | Epoche | fuhre-Züge, die `disabled` **nicht** gesetzt haben | davon von der Maus erreichbar |
   |---|---|---|
   | 1350 | 21 | **0** |
   | 1600 | 20 | **0** |
   | 1884 | 24 | **0** |
   | 1970 | 22 | **0** |

   Das ist die **andere Hälfte** des Befundes „`disabled` misst zwei Dinge
   zugleich" aus `LAUFENDER-AUFTRAG.md`. Dort geht Verdeckung *in* `disabled`
   über; hier geht sie **nicht** hinein: das zugeklappte Brett behält seine
   volle Geometrie (367×230 px) und lässt seine Knöpfe eingeschaltet. Ein
   Zähler, der `disabled` liest, meldet für 1350 **21 aktive Züge mit
   Preisschild, die der Spieler in diesem Augenblick nicht anfassen kann**.
   **Der vorgeschlagene Kern-Fix `data-soll-aus` schließt diese Hälfte
   nicht** — er würde diese 21 als „soll an" markieren und damit dieselbe
   Zahl bestätigen. Wer Spalte (a) zählt, muss `elementFromPoint` lesen, nicht
   `disabled`.
   *(Nebenbefund derselben Probe: ein Klick auf einen Brettreiter schaltet um.
   Viermal geklickt heißt zweimal auf und zweimal zu — daran ist meine erste
   1970er Hand fünfzehnmal ins Leere gelaufen. Kein Fehler des Spiels, aber
   eine Falle für jedes Messgerät, das Reiter „sicherheitshalber" mehrfach
   anklickt.)*

4. **Optionen mit Preisschild nebeneinander, die einander ausschließen**: die
   drei Zielkarten (bar / Kerbholz / Borg) sind genau das, sie sind nach der
   siebten Woche **unwiderruflich für das Braujahr**, und der Fußvermerk sagt
   es („Noch 7 Wochen, dann gilt das Wort bis Michaeli"). Gezählt am Schirm in
   Woche 1: 28–31 aktive Züge mit Preisschild von 82–85 aktiven Zügen.

**Zweite Partie, 1970, sorgfältiger gespielt** (Jahresbonus verabredet,
Exportbier und Pilsner hochgestellt, Hopfenkontrakt gekauft, das Fährhaus
listen lassen, dann jede Woche „Nach Durst füllen" und abschicken):

| | |
|---|---|
| gespielt | 1970/1 bis **1971/19**, 122 Klicks, `BRAUHAUS.lage` 0, Seitenfehler 0 |
| Klickergebnis | 104 geklickt · **2 „erst gerollt"** · 15 verdeckt (meine Schuld, s. Punkt 3) · 16 gesperrt |
| Chronik | `Klosterbräu Obernberg wird verkauft … an die Nordstern-Gruppe` · `Schenke am Tor ist wieder frei. Adler-Bräu AG hat die Bindung verloren.` · `Die Nordstern-Gruppe bietet 55.513 DM für ein Viertel des Hauses. Die Antwort wird nicht zurückgenommen` |

Die zwei „erst gerollt" sind genau `fuhre:tafel-auf:export` und
`fuhre:listen:faehrhaus` — **die epocheneigene Achse von 1970 und die teure
Sorte, beide nur nach einer Radbewegung erreichbar.** Das ist Abschnitt 1.4
im gespielten Protokoll statt in der Messung.

---

---

## 5 — LATTE 1: was die Lesbarkeitsarbeit auf der Entwurfsleinwand angerichtet hat

Latte 1 vergleicht **auf der Entwurfsleinwand 2752×1536**. Ich habe dort
dasselbe gemessen wie bei 1366×768 und beide Bilder angesehen.

**Was dort ausdrücklich NICHT passiert ist — und das ist die Hauptsache:**

| | 2752×1536 |
|---|---|
| `display: none` mit Text (FUHRE) | **0** in allen vier Epochen |
| über den Rand der Bühne (FUHRE) | **0** |
| Listenfaktor `.fu-liste` | 0,793 / 0,819 / 0,815 / 0,703 |
| sichtbare Adressen von allen | **10/10 · 10/10 · 10/10 · 11/11** |

Alle Regeln, die etwas verschwinden lassen (`.fu-ziel-satz`,
`.fu-z3 .fu-zahlen`) und der 24-px-Knopfboden des Skeletts stehen hinter dem
Medienschalter `(max-width: 2751px), (max-height: 1535px)`. **Auf der
Leinwand, gegen die Latte 1 blind vergleicht, ist davon nichts wirksam.** Die
Bretter zeigen dort ihren vollen Inhalt, elf von elf Adressen mitsamt der
Zahlenkette. Ich habe die Aufnahme angesehen: das Brett sieht aus wie das
Spiel, das es war.

**Was doch auf der Leinwand angekommen ist — gemessen, nicht vermutet.**
Die 46 Schriftböden in `stil/fuhre.css` stehen **hinter keinem
Medienschalter** (`grep -c "max(12px" stil/fuhre.css` → 46, `grep -n "@media"
stil/fuhre.css` → nichts). Auf der Leinwand ist `--s` = 1 px, also greift ein
Boden dort normalerweise nicht. **Er greift aber innerhalb der Adressliste**,
weil die sich ihr eigenes, kleineres Bezugspixel gibt (0,70–0,82). Gezählt,
2752×1536, alle vier Bretter auf:

| Epoche | FUHRE-Textknoten | davon **genau** auf 12,0 px | alle davon in `.fu-liste` |
|---|---|---|---|
| 1350 | 184 | **55** | 55 |
| 1600 | 195 | **30** | 30 |
| 1884 | 197 | **30** | 30 |
| 1970 | 199 | **77** | 77 |

Diese 30–77 Zeilen standen vorher bei 0,70–0,82 × N px und stehen jetzt auf
12,0 px. **Die Aufnahme, gegen die Latte 1 vergleicht, hat sich an dieser
einen Stelle also geändert.** Der Builder hat das Argument selbst gekannt und
für genau zwei Regeln gezogen — `.fu-fass em` steht mit der Begründung „auf
der Entwurfsleinwand wäre das ein sichtbarer Unterschied im Bild, gegen das
Latte 1 blind vergleicht" im Medienschalter (`fuhre-zusatz.css:857–860`). Für
die 46 Böden in `fuhre.css` gilt dasselbe Argument und ist nicht gezogen
worden.

**Ist das ein Riss von Latte 1?** Nein. Die Latte fragt, ob ein Fremder das
Zielbild wählt — und `zielbild/04-1970.jpg` enthält diese Adressliste
überhaupt nicht; sie ist eigene Erfindung des Bretts. Größere Schrift in
einem Brett macht das Bild nicht unähnlicher. **Es ist eine Auflage, keine
Latte** (Auflage 4).

**Ein zweiter Fund auf der Leinwand, und der ist unbequemer:** in 1970 sind
dort **11 von 22 aktiven Knöpfen** 22,6 px hoch, also unter der Zielfläche —
`fuhre:laden:*` (6×, 55,1 × 22,6) und `fuhre:listen:*` (5×, 159,5 × 22,6).
Bei 1366×768 sind es **0**, weil der 24-px-Boden des Skeletts dort greift.
**Die Knopflatte ist damit genau dort erfüllt, wo gemessen wird, und einen
Pixel daneben nicht.** Das ist nach dem Wortlaut der Latte in Ordnung
(gemessen wird bei 1366×768) und trotzdem eine Zahl, die man kennen sollte:
bei 1920×1080 greift der Boden ebenfalls, es betrifft also keinen wirklichen
Bildschirm — nur die Leinwand.

---

## Noch offen (wird nachgetragen)

* Latte 2 — ρ über drei Schnitte (12/13/14 Braujahre), vier Epochen, je drei
  Läufe. Läuft; 1350 und 1600 liegen vor.
* Sperrliste — Sachfund-Durchsicht des Zahlenwerks.
* Die Partien in 1600, 1884, 1970 mit der Maus.
