# DIE FUHRE · Welle 6 · Urteil des blinden Kritikers

*Gespielt und gemessen am eingefrorenen Messstand `http://127.0.0.1:8900`,
Marke `7440a09` (dreimal gegengeprüft: `curl -s /.messstand-marke` → `7440a09`).
Saat 1350, alle vier Epochen. Der Kritiker hat den Baubericht des Builders
nicht gelesen und keine Commit-Historie eingesehen; gelesen hat er den
Quelltext des Spiels, weil ein Urteil ohne Ursache nichts wert ist.*

**Diese Datei wurde laufend geschrieben, nicht am Ende.** Sie ist jetzt
vollständig: zwölf ρ-Läufe (vier Epochen × drei), Lesbarkeit in vier
Fensterbreiten mit und ohne Rollleiste, vier gespielte Partien mit der Maus.

---

## 0 — Der Messstand und die Geräte

| | |
|---|---|
| Messstand | `:8900`, Marke `7440a09` |
| ρ-Gerät | `werkbank/schuss/rueckkopplung-r3/linie.mjs`, 400 Wochen, je Epoche **drei** Läufe (12 insgesamt), jeder einzeln durch `messfenster.sh`, Rohdaten in `…/fuhre-blind-w6/rho/` |
| ρ-Schnitte | eigenes Skript `…/rho.py` — 12/13/14 Braujahre aus **derselben** Reihe |
| Gewicht | eigenes Gerät `…/gewicht.mjs` — Bytes je Aufruf, nach Stück aufgeschlüsselt |
| Sicht | eigenes Gerät `…/sicht.mjs` — was beim Aufschlagen ohne Mausrad im Bild steht |
| Hand | eigenes Gerät `…/hand.mjs` — meine Klickliste, Protokoll in `…/hand/` |
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

Der Kasten: `.fu-kerbsatz`, `fuhre-zusatz.css:173–181` (`line-clamp` an Zeile 178) — `-webkit-line-clamp: 2`
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
1366×768, auf jedem Bildschirm mit sichtbarer Rollleiste.** Auflage 1.

**Und ein Befund über die Messgeräte dieses Laufs**, der über die FUHRE
hinausgeht: **jede Lesbarkeitszahl, die hier bisher gemessen wurde, ist ohne
Rollleiste gemessen.** Für ein Spiel, das `overflow: hidden` auf `html, body`
setzt (`grund.css:108`) und seine Kästen einzeln rollen lässt, ist das kein
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

**Eine Auflage folgt daraus trotzdem** (Auflage 4, unten): der Balken trägt
keine Zahl und keinen Maßstab. Wer bei 1366×768 nur klickt und nie hovert,
sieht drei verschieden hohe Striche ohne Bezugsgröße.

**Eine Zahl, die ich ausdrücklich NICHT als Vorwurf zähle.** Mein Gerät
findet in der FUHRE **81 / 102 / 130 / 103** `title`-Attribute, deren Text
nirgends sichtbar am Schirm steht. Das klingt schlimm und ist es nicht: ich
habe sie durchgesehen, und die große Mehrheit sind genau die Erklärsätze, die
`spiel/LIESMICH.md` für jeden Knopf **verlangt** („titel: 'Was passiert, wenn
ich das tue'") — „Wieder herunter vom Wagen.", „1 Fass für Gasthof Lindenhof
auf den Wagen. Gasthof Lindenhof zahlt 9 Pf je Fass." Ein `title`, der einen
sichtbaren Knopf erklärt, ist kein verstecktes Bild. **Verschwundener Inhalt
sind nur die 45 oben** — die, die vorher am Schirm standen.

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

Siehe Auflage 4.

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
Auflage 2.

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

**Vier Beobachtungen aus dem Protokoll:**

1. **Nach dem Erbfall waren alle vier Bretter der FUHRE zugeklappt**, und ich
   habe elf Wochen lang ins Leere geklickt, bevor ich es am Bild gesehen habe.
   Ursache ist die Platzordnung der STADT (das Erbeblatt schlägt auf und legt
   sich über die halbe Bühne), nicht die FUHRE — aber die FUHRE ist der
   Leidtragende: `fuhre:wie-vorige` und `fuhre:abschicken` melden dabei
   `disabled`, und `disabled` heißt hier zweierlei (LAUFENDER-AUFTRAG,
   „`disabled` misst zwei Dinge zugleich"). **Am Bildschirm ist „das Brett
   liegt unter dem Erbeblatt" nicht von „der Keller ist leer" zu
   unterscheiden.** Kein Auftrag an DIE FUHRE — an die Aufsicht.
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

**Dritte und vierte Partie: 1884 und 1600.** Beide gespielt, beide laufen.

| | 1884 | 1600 |
|---|---|---|
| gespielt | 1884/1 → **1886/18** | 1600/1 → **1602/18** |
| `BRAUHAUS.lage` · Seitenfehler | 0 · 0 | 0 · 0 |
| „erst gerollt" | 1× `fuhre:tafel-auf:export` | 2× `fuhre:tafel-auf:braun` **und** `:maerzen` |
| Erbfall im Lauf | ja — `Therese Bruckner scheidet aus der Firma` → `Ludwig Bruckner übernimmt das Haus in 1886` | ja — `Veit Bruckner wird zu Grabe getragen` → `Barbara Bruckner übernimmt das Haus in 1602` |
| epocheneigene Achse bedient | ja — `fuhre:fracht:halb`, „Halber Wagen · bis 60 hl −210 M" | nein — ich habe `fuhre:pfand:einziehen` geraten, der Schlüssel heißt schlicht **`fuhre:pfand`** (`fuhre.js:3042`). Mein Fehler, kein Fehler des Spiels |

In **1600 mussten zwei von drei Sorten** erst ins Bild gerollt werden — die
schlechteste Stelle der Tabelle in 1.4 (Braunbier 15 %) bestätigt sich damit
im Spiel.

**Damit sind alle vier Epochen gespielt**, mit der Maus, über zusammen
**gut zehn Braujahre und rund 900 Klicks**, ohne einen einzigen Seiten- oder
Konsolenfehler und mit `BRAUHAUS.lage` durchgehend auf 0.

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

Ohne den Boden stünden diese 30–77 Zeilen bei 0,70–0,82 × N px, also unter
12; mit ihm stehen sie auf 12,0. **Die Aufnahme, gegen die Latte 1
vergleicht, ist an dieser einen Stelle also nicht mehr streng proportional.**
(Ich kann das nicht am alten Baum gegenprüfen — siehe Abschnitt 9, Punkt 1 —,
aber die Rechnung ist eindeutig: `max(12px, …)` kann nur nach oben wirken.) Der Builder hat das Argument selbst gekannt und
für genau zwei Regeln gezogen — `.fu-fass em` steht mit der Begründung „auf
der Entwurfsleinwand wäre das ein sichtbarer Unterschied im Bild, gegen das
Latte 1 blind vergleicht" im Medienschalter (`fuhre-zusatz.css:857–860`). Für
die 46 Böden in `fuhre.css` gilt dasselbe Argument und ist nicht gezogen
worden.

**Ist das ein Riss von Latte 1?** Nein. Die Latte fragt, ob ein Fremder das
Zielbild wählt — und `zielbild/04-1970.jpg` enthält diese Adressliste
überhaupt nicht; sie ist eigene Erfindung des Bretts. Größere Schrift in
einem Brett macht das Bild nicht unähnlicher. **Es ist eine Auflage, keine
Latte** (Auflage 3).

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

## 6 — DIE SPERRLISTE

Durchgesehen: `stuecke/fuhre-daten.js` (1.039 Zeilen, alle vier Epochenblöcke,
alle Sorten, Käufe, Frachtstufen, Fristen, Ausgänge) und die am Schirm
gelesenen Zeichenketten aus vier gespielten Partien.

**Kein Fund auf der benannten Sperrliste.** Im Einzelnen geprüft:

| Falle | Befund an der FUHRE |
|---|---|
| Hektoliter vor 1872 | **sauber.** 1350 und 1600 zeigen am Schirm durchgehend „Fass" („will 4 Fass", „4 von 12 Fass"), 1884 und 1970 „hl". Läuft über `welt.menge`, wie vorgeschrieben |
| Währung | **sauber.** Pf · fl · M · DM am Schirm, alles über `welt.geld` |
| Kein Hopfen 1350 | **sauber und ausdrücklich.** `kaeufe` → „Grut vom Grutherrn"; `titel`: „Ohne Grut kein Bier. Hopfen kennt hier noch niemand."; Grutbier: „Grut aus Gagel, Porst und Schafgarbe — kein Hopfen" |
| Offene Pfanne | **sauber.** Durchgehend „Pfanne", „am Feuer", „der zweite Guss auf dieselben Treber". Keine Blase, kein Helm, kein Schwanenhals |
| Emailschild vor den 1890ern | **kommt in diesem Stück nicht vor** |
| Bahn nicht vor 1835 / nicht in 1600 | **sauber.** 1600 fährt „Pferdefuhrwerk", 1884 „Bahnfracht ab Rampe" |
| Marktanteil auf die eigene Menge | **sauber und ausdrücklich.** 1970 `abgabe.sagt`: „Werbung nach Marktanteil **am eigenen Ausstoß**" |

**Was mir an Sachlichem trotzdem aufgefallen ist — beides klein, keines ein
Veto:**

1. **1884 hat zugleich eine Kältemaschine und eine Natureisernte.**
   `frist.satz` behauptet „Die Kältemaschine läuft weiter", `sommerSatz` sagt
   „Die Kältemaschine könnte im Juli brauen" — während die ganze Mechanik des
   Eiskellers daran hängt, dass Eis aus dem Fluss geschnitten wird, „solange
   er trägt" (Woche 9–22), und dass ohne Eis nichts lagert. Ein Haus mit
   Linde-Maschine schneidet kein Flusseis mehr. Beides ist für 1884 einzeln
   richtig — 1884 ist genau das Übergangsjahrzehnt —, aber im selben Haus ist
   es ein Widerspruch. Zwei Wörter Arbeit: entweder die Maschine steht erst
   als Kauf am Ende der Epoche, oder die Prosa nennt sie als das, was der
   *Nachbar* hat.
2. **1350 hat ein Sommerbrauverbot, 1600 begründet es mit der Ordnung von
   1553.** Das ist kein Fehler — die FUHRE begründet 1350 mit dem Brandrisiko
   („die Stadt fürchtet den Brand") und 1600 mit der Ordnung, und beides ist
   belegbar. Ich nenne es nur, damit niemand es später für einen
   Selbstwiderspruch hält.

**Größenordnungen, stichprobenweise nachgerechnet:** 1884 „Ganzer Wagen ·
88 Fass" sind bei 1 Fass = 150 l **132 hl ≈ 13 t** — die Ladegrenze eines
gedeckten Güterwagens dieser Zeit lag bei 10–15 t. Passt. 1350 „Der Ochse
geht sieben Meilen am Tag" passt zum Ochsengespann. 1350 Bierpreis 5–19 Pf
je Fass gegen den Dossier-Anker 1 Pf ≈ 3 l: ein Fass zu 150 l wäre 50 Pf im
Ausschank, ab Brauerei 5–19 Pf — plausibel.

---

## 7 — LATTE 2: ρ über drei Schnitte

Gerät `rueckkopplung-r3/linie.mjs`, 400 Wochen, `saat=1350`, Hafen 8900,
jeder Lauf **einzeln** durch `messfenster.sh` und **hintereinander** — nie
zwei gleichzeitig. Die drei Schnitte kommen aus **derselben** Reihe
(`leiterRoh[].zugVerh`), nicht aus drei Läufen; gerechnet mit
`werkbank/schuss/fuhre-blind-w6/rho.py`.

**Gerätekontrolle vorweg:** mein Rechenweg reproduziert die Zahlen der
MESSLATTE für 1350 (**+0,762 / +0,692 / +0,591**) und für 1884
(**+0,168 / +0,346 / +0,393**) Ziffer für Ziffer. Das Gerät misst also
dasselbe wie DER PREIS und die Aufsicht.

**Und daraus folgt sofort der wichtigste Satz dieses Abschnitts:** in 1350
und 1884 steht ρ nach der Lesbarkeitsrunde **auf denselben Ziffern wie
vorher**. Die Runde hat die zweite Latte also **nicht bewegt** — weder
gebessert noch verdorben. Das ist keine Selbstverständlichkeit: eine
Lesbarkeitsarbeit, die die Kaufknöpfe aus dem rollenden Kasten drückt, hätte
1350 gerissen. Gemessen ist das Gegenteil — `sicht.mjs`, 1366×768, alle vier
Epochen: **Kaufknöpfe 4/4 · 4/4 · 5/5 · 4/4 im Bild**, ebenso **Zielkarten
3/3** und **Frachtstufen 4/4** (1884). Die klebende Knopfzeile
(`fuhre-zusatz.css`, `.fu-tafel .fu-kaeufe { position: sticky }`) tut, was sie
soll. **Was in dieser Runde aus dem Bild gefallen ist, ist die Sortenliste —
und die ist kein Kaufknopf, sondern der Plan** (Auflage 2).

### 7.1 Die Läufe — VOLLSTÄNDIG: 12 Läufe, 4 Epochen, je 3, sequenziell

Rohdaten: `werkbank/schuss/fuhre-blind-w6/rho/e<1-4>-<A|B|C>.json`.
Gelaufen 20:45 bis 23:38 UTC, jeder Lauf einzeln durch `messfenster.sh`; das
Fenster war zwischendurch **864 s, 299 s und 233 s von DER SUD belegt** und
hat mich sauber warten lassen, wie es soll.

| Epoche | **12 Braujahre** | 13 | 14 | **Spannweite** | Jahre <1× | Kennzahl min–max | Seitenfehler | Abbruch |
|---|---|---|---|---|---|---|---|---|
| **1350** | **+0,762** ×3 | +0,692 ×3 | +0,591 ×3 | **0,000** | 0/14 | 1,55–18,44× | 0 | nein |
| 1600 | +0,189 ×3 | −0,066 ×3 | −0,156 ×3 | **0,000** | 1/14 | 0,67–4,87× | 0 | nein |
| 1884 | +0,168 ×3 | +0,346 ×3 | +0,393 ×3 | **0,000** | 1/14 | 0,84–9,40× | 0 | nein |
| **1970** | **+0,699** ×3 | +0,637 ×3 | +0,653 ×3 | **0,000** | 1/14 | 0,79–11,60× | 0 | nein |

**Gerätekontrolle: Spannweite 0,000 in allen vier Epochen und allen drei
Schnitten, über je drei Läufe.** A, B und C sind Ziffer für Ziffer identisch,
bis in die Kassenspanne hinein (1350: 39–609 dreimal). Sequenziell gemessen
streut dieses Spiel nicht — die Regel aus `LAUFENDER-AUFTRAG.md` bestätigt
sich zum wiederholten Mal, und mein Gerät ist damit nicht kaputt.

**Die Latte:** sie reißt, sobald **einer** der drei Schnitte über 0,7 liegt.
**1350 liegt bei zwölf Braujahren auf +0,762 — in drei von drei Läufen.**
**Die Latte ist gerissen.** 1970 liegt mit +0,699 **ein Tausendstel**
darunter; 1600 und 1884 sind komfortabel darunter.

**Zwei Befunde, und der zweite ist der laute:**

1. **1350 reißt bei zwölf Braujahren: +0,762.** Das ist exakt die Zahl, die
   die MESSLATTE seit dem 4. August führt — die Latte war vor dieser Runde
   gerissen und ist es danach. **DIE FUHRE hat sie nicht gerissen und nicht
   geheilt.**
2. **1970 steht bei zwölf Braujahren auf +0,699 — ein Tausendstel unter der
   Latte.** Die MESSLATTE führt für 1970 **+0,427 / +0,154 / +0,275**; am
   eingefrorenen Stand `7440a09` messe ich **+0,699 / +0,637 / +0,653**. Auch
   1600 ist gewandert (Tabelle +0,371/+0,264/+0,231, gemessen
   +0,189/−0,066/−0,156), und zwar nach unten. **1350 und 1884 stehen dagegen
   auf denselben Ziffern wie in der Tabelle.**

**Ich kann nicht sagen, wer 1600 und 1970 bewegt hat, und behaupte es
deshalb nicht.** An diesem Baum arbeiten mehrere Builder; die Zahlen der
MESSLATTE stammen von einem früheren Commit. Was ich sagen kann: **die beiden
Epochen, deren Zahl sich nicht bewegt hat, sind genau die, in denen die
Messhand alle Sortenknöpfe erreicht** (siehe 7.2) — und die beiden, die sich
bewegt haben, sind es nicht. Das ist eine Spur, kein Beweis.

### 7.2 Ein Befund über die Messhand selbst, im Fenster der Messhand

`linie.mjs:61` misst bei **1920×1000** — also **unterhalb** der
Entwurfsleinwand, also **mit** allen Medienschaltern dieser Runde. Ich habe
in genau diesem Fenster und mit genau dem Verfahren der Messhand geprüft
(nicht getroffen → jeden Reiter anklicken → noch einmal hinsehen; die Hand
rollt nicht), welche Sudplanknöpfe sie erreicht:

| Epoche | erreichbar | nicht erreichbar |
|---|---|---|
| 1350 | dünn · grut · stark · kofent | — |
| **1600** | schank · braun · nachbier | **`fuhre:tafel-auf:maerzen`** |
| 1884 | schank · lager · export · einfach | — |
| 1970 | hell · pils · export · handel | — |

**In 1600 kann die Messhand den Märzen nicht anstellen** — die einzige Sorte
der Epoche, die den Sommer übersteht (`fuhre-daten.js`: „Dafür überlebt es
als einziges den Sommer"). Die Hand greift zwar nach Bauart nur den zweiten
Knopf der Liste und hätte den Märzen ohnehin nicht gewählt; **aber jede ρ-Zahl
für 1600 ist damit die Zahl eines Hauses, dem der dritte Sud nicht zur
Verfügung steht, und niemand hat das bisher aufgeschrieben.** Gehört zu
Auflage 2: was aus dem Sortenkasten rollt, rollt auch aus der Messung.

---

## 8 — DIE AUFLAGEN

Jede mit der Zahl, die sie belegt, und der Stelle im Quelltext.

**Auflage 1 — `.fu-kerbsatz` schneidet ab, sobald eine Rollleiste im Bild ist.**
`stil/fuhre-zusatz.css:173–181` (`-webkit-line-clamp: 2` in Zeile 178, dazu `overflow: hidden`). Dieselbe Klammer steht noch dreimal im Stück — `fuhre-zusatz.css:37`, `:289` und `fuhre.css:145` —, alle vier gehören nachgemessen.
Gemessen bei 1366×768 mit sichtbarer Rollleiste: Kasten **274 × 29 px**,
Inhalt **274 × 43 px** — die dritte Zeile fällt weg, in **1350** und **1884**.
Bei 1280×800 sind es **vier** Kästen (dazu `.fu-frachtbrief` in 1884, 331 × 32
gegen 331 × 48). Bei 1600×1000 null. **Das ist der einzige echte Riss der
vierten Latte an diesem Stück, und er ist die ganze Nacharbeit wert:** ohne
die Klammer bricht der Satz einfach um. Wer sie behält, weil der Kasten sonst
wächst, nimmt stattdessen `line-clamp: 3` und misst nach — der Platz ist da,
der Kasten der Kerbholzzeile ist nicht der enge.

**Auflage 2 — der Sudplan zeigt bei 1366×768 eine von drei Sorten.**
`stil/fuhre-zusatz.css` (`.fu-tafel .fu-sorten { min-height: max(60px, …) }`).
Gemessen in allen vier Epochen: Kasten **60 px**, Inhalt **118–175 px**;
sichtbarer Anteil der dritten Sorte **0 %**, der zweiten 15–83 %.
`griff.mjs` bestätigt unabhängig, dass `fuhre:tafel-auf:stark` (1350),
`fuhre:tafel-auf:maerzen` und `fuhre:tafel-ab/auf:braun` (1600) und
`fuhre:tafel-auf:export` (1884, 1970) die Maus nicht treffen; in drei
gespielten Partien musste meine Hand für genau diese Knöpfe erst rollen
(Protokolleintrag „geklickt (erst gerollt)"). Die dritte Sorte ist in jeder
Epoche das teure, lange, sommerfeste Bier und damit die Entscheidung, um die
das Stück gebaut ist. Der 60-px-Boden schützt „eine Zeile bleibt immer
stehen" — bei drei Sorten zu 32–70 px ist eine Zeile zu wenig.

**Auflage 3 — die 46 Schriftböden in `stil/fuhre.css` stehen hinter keinem
Medienschalter.** `grep -c "max(12px" stil/fuhre.css` → **46**,
`grep -n "@media" stil/fuhre.css` → **nichts**. Auf der Entwurfsleinwand
greifen sie innerhalb der Adressliste, weil die ein eigenes, kleineres
Bezugspixel hat (0,703–0,819): gemessen **55 / 30 / 30 / 77** Textknoten, die
bei 2752×1536 **genau** auf 12,0 px stehen, alle in `.fu-liste`. Das ist die
Aufnahme, gegen die Latte 1 blind vergleicht. Der Builder hat genau dieses
Argument für zwei Regeln gezogen (`.fu-fass em`, `fuhre-zusatz.css:857–860`)
und für die übrigen 46 nicht. Entweder alle hinter den Schalter — oder die
Begründung bei `.fu-fass em` streichen, weil sie dann nicht mehr trägt.

**Auflage 4 — der Balken hat keinen Maßstab, seit die Zahl weg ist.**
`stil/fuhre-zusatz.css:902` blendet `.fu-zahlen` aus; gezählt **41** Knoten
über vier Epochen (10/10/10/11), dazu **4×** `.fu-ziel-satz`. Beide stehen
noch im `title` (`fuhre.js:2741` bzw. `2575`). Für den Erklärsatz ist das in
Ordnung; für die Absatzreihe nicht ganz: `.fu-reihe` zeichnet drei Säulen in
Prozent des Jahresbedarfs, und der Bedarf steht nirgends am Balken. Billigste
Abhilfe ohne einen Pixel Höhe: eine waagerechte Marke bei einem Drittel — die
Schwelle, ab der die Adresse verlorengeht — direkt in den Balken. Dann sagt
die Zeichnung dasselbe wie der `title`.

**Nicht an DIE FUHRE, sondern an die Aufsicht** (steht in Abschnitt 4,
Punkt 3 und in 1.1a):

* **(a)** Latte 4 wurde in diesem Lauf bisher **ohne Rollleiste** gemessen —
  Playwrights `--hide-scrollbars`. Das kostet je rollendem Kasten 15–17 px
  Breite und hat an diesem Stück genau zwei Risse verdeckt.
  `aufsicht/lesbarkeit.mjs` gehört auf `ignoreDefaultArgs:
  ['--hide-scrollbars']`, oder die Zahl bekommt den Vorbehalt danebengeschrieben.
* **(b)** `aufsicht/lesbarkeit.mjs:26–32` zählt rollende Kästen als
  abgeschnitten. Achsenweise prüfen (`overflowY` gegen senkrechten Überlauf,
  `overflowX` gegen waagerechten), sonst meldet das Gerät Risse, die keine
  sind — und übersieht die, die welche sind.
* **(c)** Beim Laden sind alle vier FUHRE-Bretter zugeklappt und **20–24
  Züge je Epoche melden `disabled = false`, während 0 von ihnen mit der Maus
  erreichbar sind** — bei jeder Fenstergröße. Der vorgeschlagene KERN-Fix
  `data-soll-aus` schließt diese Hälfte des Befundes nicht.

---

## 9 — WAS ICH NICHT PRÜFEN KONNTE, UND WARUM

1. **Ich habe keinen Vorher-Stand.** Der Messstand ist auf `7440a09`
   eingefroren, und das ist der Stand **nach** der Runde. Alles, was ich über
   „vorher" sage, stammt aus den Zahlen der MESSLATTE (1884: kleinste Schrift
   5,0 px, 64 von 87 Knöpfen unter 24 px bei 1366×768) und aus dem Quelltext,
   nicht aus einer eigenen Messung am alten Baum. Ich kann deshalb **nicht**
   sagen, wieviel von den 0 · 0 · 0 dieser Runde gehört und wieviel dem
   Skelettboden in `grund.css`, den ein anderer Bauer gesetzt hat.
2. **Latte 3, der Ton, ist nicht geprüft.** Nicht mein Auftrag, und
   `werkbank/hoerer.py` hat nach `LAUFENDER-AUFTRAG.md` einen offenen Befund
   an Zeile 181. Ich habe ihn nicht angefasst.
3. **Latte 1 im eigentlichen Verfahren — ein Fremder wählt blind zwischen
   Aufnahme und Zielbild — konnte ich nicht durchführen**, weil ich beide
   Bilder kenne. Was ich statt dessen gemessen habe, steht in Abschnitt 5:
   ob die Lesbarkeitsarbeit die Aufnahme auf der Entwurfsleinwand verändert
   hat. Das ist eine notwendige, keine hinreichende Prüfung.
4. **Die Rollleisten-Messung ist Chromium unter Linux.** Auf macOS zeichnet
   der Browser Überlagerungs-Rollleisten mit 0 px Breite; dort tritt Auflage 1
   nicht auf. Auf Windows und Linux tritt sie auf. Ich habe nur letzteres
   messen können.
5. **Vier gespielte Partien sind kein zwanzigminütiger Prüfstand je Epoche.**
   Ich habe 1350 vier Braujahre, 1884 zweieinhalb, 1600 zweieinhalb und 1970
   anderthalb gespielt. Für die Frage „kann man es bedienen" reicht das; für
   eine Aussage über die Kurve über zwanzig Minuten reicht es nicht — dafür
   steht Abschnitt 7.
6. **Ich habe nichts über die anderen Stücke geurteilt.** Die 277–284
   Textknoten unter 12 px, die 8–10 abgeschnittenen Kästen und die 16–18
   Ellipsen je Epoche gehören anderen Buildern. Ich nenne sie nur als Zähler,
   nicht als Urteil.

---

## 10 — DAS URTEIL

**LATTE 1 — DAS BILD: BESTEHT MIT AUFLAGE.**
Auf der Entwurfsleinwand, gegen die diese Latte vergleicht, ist von der
Lesbarkeitsarbeit **nichts** wirksam, was etwas verschwinden lässt:
`display:none`-mit-Text **0**, über den Rand **0**, sichtbare Adressen
**10/10 · 10/10 · 10/10 · 11/11**. Alle Verschwinderegeln und der
24-px-Knopfboden stehen hinter dem Medienschalter. Ich habe die Aufnahmen
angesehen: dasselbe Bild, derselbe Ort, dieselbe Kopfleiste, dieselbe
WEITER-Tafel. **Die eine Ausnahme ist gemessen und benannt** — 30 bis 77
Textknoten je Epoche stehen auf der Leinwand jetzt auf dem 12-px-Boden statt
proportional, alle in der Adressliste, weil die 46 Böden in `stil/fuhre.css`
hinter keinem Schalter stehen (Auflage 3).

**LATTE 2 — DAS SPIEL: FÄLLT DURCH.**
Nicht wegen dieses Stücks, aber sie fällt. **1350 steht bei zwölf Braujahren
auf +0,762** — in **drei von drei** Läufen, Spannweite 0,000. Die Latte
reißt, sobald einer der drei Schnitte über 0,7 liegt, und dieser liegt
darüber. **Und 1970 steht auf +0,699, ein Tausendstel darunter** (ebenfalls
dreimal identisch). Das Wellenziel ist damit nicht erreicht, und es ist nicht
nur eine Epoche davon entfernt. Zwölf Läufe, 4.800 gemessene Wochen, null
Seitenfehler, null Abbrüche, Spannweite 0,000 in allen zwölf.
Was DIE FUHRE beigetragen hat, ist **nichts** — 1350 und 1884 stehen Ziffer
für Ziffer auf den Zahlen der MESSLATTE. Die Runde hat die Kaufknöpfe im
Bild gehalten (4/4 · 4/4 · 5/5 · 4/4) und damit den Fehler vermieden, den
das Stück in seiner eigenen Arbeit hätte machen können.
Zur Verbliste: **1 von 12 Verben ist je Epoche eigen**, elf sind geteilt.
Das ist keine Tapete, aber es ist auch keine eigene Verbliste.

**LATTE 3 — DER TON: NICHT GEPRÜFT.** Nicht mein Auftrag (Abschnitt 9).

**LATTE 4 — DIE LESBARKEIT: BESTEHT MIT AUFLAGE.**
Die drei Zahlen der Latte, am Stück und bei 1366×768: **Schrift unter 12 px
0 · Knöpfe unter 24×24 px 0 von 20–24 aktiven · abgeschnittener Text 0** —
in allen vier Epochen. Das ist, gemessen an dem, was die MESSLATTE für
diesen Bildschirm verzeichnet (kleinste Schrift 5,0 px, 64 von 87 Knöpfen zu
klein), eine vollständige Arbeit.
**Sie besteht nicht ohne Auflage, und zwar aus zwei gemessenen Gründen:**
mit sichtbarer Rollleiste — also in jedem Desktop-Browser unter Windows und
Linux — schneidet `.fu-kerbsatz` bei 1366×768 in **zwei von vier** Epochen
seine dritte Zeile ab (Auflage 1); und der Sudplan, die Hauptentscheidung
des Stücks, zeigt bei 1366×768 in **allen vier** Epochen **eine von drei**
Sorten vollständig und die dritte zu **0 %** (Auflage 2).
Ein strenger Leser darf hier **FÄLLT DURCH** sagen: „kein abgeschnittener
Text" ist verletzt. Ich sage es nicht, und ich sage warum: der Riss ist
**ein** Kasten, in **zwei** Epochen, ausgelöst von 15 Pixeln Rollleiste, die
**kein einziges Messgerät dieses Laufs bisher gezeichnet hat** — und er
kostet eine Zahl (`line-clamp: 2` → `3`). Wer die Auflagen nicht abarbeitet,
soll beim nächsten Mal durchfallen.

**SPERRLISTE — KEIN FUND.** Kein Veto. Zwei kleine Sachbefunde stehen in
Abschnitt 6, beide unter der Schwelle. **Das Gewichtsveto (8 MB) ist mit
23,2–24,3 MB weiterhin gerissen — aber 93 % davon sind `bild/**`, und das
gehört DER STADT.** DIE FUHRE trägt 0,330 MB, also 1,4 %.

**KANN MAN ES SPIELEN? JA.** Vier Epochen, gut zehn Braujahre, rund 900
eigene Mausklicks, `BRAUHAUS.lage` durchgehend 0, kein einziger Seiten- oder
Konsolenfehler. Es ist auch verlierbar, und es sagt warum: „Der Rat entzieht
dem Haus zum Anker das Braurecht: seit zwölf Wochen hat keine Schenke der
Stadt ein Fass genommen." Der Gegner zieht ohne mich, die drei Zielkarten
schließen einander aus und binden ein Jahr lang, jede Epoche hat ihre eigene
Knappheit. **Das größte Ärgernis beim Spielen war nicht die Schriftgröße,
sondern dass ich zweimal die teure Sorte erst ins Bild rollen musste, um sie
anzustellen** — genau der Punkt, den Auflage 2 benennt.

---

# **ALS GANZES: BESTEHT MIT AUFLAGE**

Die Lesbarkeitsarbeit an DIE FUHRE ist **echt und gemessen**: bei 1366×768
trägt dieses Stück **0** Textknoten unter 12 px, **0** Knöpfe unter 24×24 px
und **0** abgeschnittene Kästen, während im selben Bild 277–284 zu kleine
Knoten anderer Stücke stehen. Auf der Entwurfsleinwand ist **nichts**
verschwunden (0 `display:none`-mit-Text, 11 von 11 Adressen), und in **1350
und 1884** steht ρ Ziffer für Ziffer auf den Zahlen der MESSLATTE — die
Runde hat die zweite Latte dort nicht um ein Tausendstel bewegt, obwohl
genau das der naheliegende Kollateralschaden gewesen wäre. (Für 1600 und
1970 kann ich das nicht sagen; ihre Zahlen sind gewandert, und wer sie
bewegt hat, weiß ich nicht — Abschnitt 7.1.) Das ist das Schwierige an
dieser Aufgabe, und es ist zum größten Teil gelungen.

**Vier Auflagen (Abschnitt 8), die zwei ersten sind die wichtigen:**
1. `.fu-kerbsatz` — `line-clamp: 2` schneidet ab, sobald eine Rollleiste im
   Bild ist. 2 Kästen bei 1366×768, 4 bei 1280×800.
2. Der Sudplan zeigt eine von drei Sorten. Die dritte: **0 %**, in allen vier
   Epochen.
3. Die 46 Schriftböden in `stil/fuhre.css` gehören hinter denselben
   Medienschalter wie die zwei, die schon dort stehen. 30–77 Knoten auf der
   Leinwand betroffen.
4. Der Absatzbalken braucht einen Maßstab, seit die Zahlenkette im `title`
   steht. 41 Knoten.

**Und drei Sätze an die Aufsicht, die nicht dem Builder gehören:** Latte 4
wird in diesem Lauf ohne Rollleiste gemessen und übersieht deshalb Risse ·
`aufsicht/lesbarkeit.mjs` zählt rollende Kästen als abgeschnittene ·
20–24 Züge je Epoche melden `disabled = false`, während null von ihnen
anzufassen sind.
