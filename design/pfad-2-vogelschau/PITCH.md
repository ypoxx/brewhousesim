# Pfad 2 — Die Vogelschau

**Die Oberfläche ist ein Druckblatt. Oben eine gestochene Vogelschau, unten eine gesetzte
Kartusche. Die Epoche wechselt nicht die Bilder, sondern die Stichtechnik.**

---

## 1. Die Idee in fünf Sätzen

Jede Epoche dieses Spiels hat eine eigene Drucktechnik, mit der man damals Städte von oben
gezeigt hat: **Holzschnitt** um 1350, **Kupferstich** um 1600, **Stahlstich** um 1880,
**technische Axonometrie** um 1970. Alle vier zeigen dieselbe Stelle im selben Rahmen —
denselben Fluss, dieselben drei Hügel, dieselbe Stadt, denselben Hof unten links.

Der Clou ist, dass das keine vier Bildbestände sind, sondern **eine Geometrie und vier
Zeichenroutinen**. Der Rechner hält eine Liste von Körpern mit Grundfläche, Höhe und
Dachform; die Stichroutine der laufenden Epoche entscheidet, ob eine Fläche als schwerer
Holzschnittumriss, als Kreuzschraffur, als Tonwertschraffur oder als flache Grautönung
herauskommt. Die Brauerei wächst über 700 Jahre, weil Zahlen in dieser Liste wachsen —
nicht, weil jemand 360 Gebäude gezeichnet hat.

Und die Zahlen stehen nicht im Bild. Sie stehen **darunter**, in gesetzter Type auf blankem
Papier.

---

## 2. Woher das kommt

**Merian, Topographia Germaniae (1642–1654).** Über 2000 Ansichten, viele davon
Vogelschauen. Was ich daraus genommen habe, ist nicht der Look, sondern die *Bauform des
Blattes*: gestochene Ansicht, wichtige Gebäude mit Nummern oder Buchstaben markiert, und
eine **Legende in einer Kartusche**, die die Nummern auflöst. Das ist eine mittelalterlich
alte Lösung für genau mein Problem — ein Bild, das gleichzeitig eine Datentabelle sein
muss. Ich habe sie unverändert übernommen.
([Merian-Ausstellung der DDB](https://ausstellungen.deutsche-digitale-bibliothek.de/merian))

**Braun & Hogenberg, Civitates Orbis Terrarum (1572–1617).** 363 Tafeln, sechs Bände. Der
Beweis, dass sich ein einziges Bildschema über Jahrzehnte und über hunderte Orte durchhalten
lässt, wenn das *Blatt* strenger ist als das Motiv. Genau das brauche ich für 700 Jahre.
([historic-cities.huji.ac.il](http://historic-cities.huji.ac.il/mapmakers/braun_hogenberg.html))

**Schedelsche Weltchronik, Nürnberg 1493.** Über 1800 Holzschnitte, Wolgemut und
Pleydenwurff. Die Stadtansichten sind grob, schief und großartig — dicke gleichmäßige
Konturen, kaum Schraffur, viel blankes Papier. Das ist meine Epoche I. Wichtig war mir das
*Ungeschickte* daran: Es sieht nach früh aus, nicht nach billig.
([Historisches Lexikon Bayerns](https://www.historisches-lexikon-bayerns.de/Lexikon/Schedelsche_Weltchronik))

**Die amerikanischen „bird's eye views" des 19. Jahrhunderts.** Über 2500 Orte wurden
zwischen 1830 und 1900 so gezeichnet — halb Karte, halb Adressbuch, halb Reklame. Fabriken
ließen ihre eigene Anlage als Luftansicht stechen, um im Geschäftsleben etwas darzustellen.
Das ist buchstäblich Epoche III meines Spiels: In dem Moment, in dem aus dem Betrieb ein
Unternehmen wird, will es sich von oben sehen. Bild 04 ist dieses Genre.
([Origins of the Historic Bird's Eye View Map](https://snapshotsofthepast.com/origins-of-the-historic-birds-eye-view-map/))

**Auguste Choisy, Histoire de l'architecture (1899), und sein Wiederaufleben in den 1960er
und 1970er Jahren.** Parallelprojektion statt Perspektive, Schnitt und Grundriss in einem
Bild, keine Schraffur, nur Linie und flacher Ton. Das ist Epoche IV. Die Axonometrie ist
historisch der Punkt, an dem die Stichtechnik stirbt und die Zeichnung technisch wird — und
sie ist zufällig auch die Bildsprache, die vierzig Standorte ohne Matsch verträgt.
([Architizer, Parallel Projections](https://architizer.com/blog/inspiration/collections/axonometric/))

**Pizza Connection** liefert das Erbe, das im Auftrag steht: Man will hinsehen, ohne
hinsehen zu müssen. Aber ich nehme davon nur den *Blick*, nicht die Bedienung — siehe
Fallstrick 7.

---

## 3. Die drei Gesetze der Platte

Alles Weitere folgt aus diesen drei Sätzen.

### Gesetz 1 — Bild ist gestochen, Zahlen sind gesetzt

Auf einem echten Merian-Blatt ist die Ansicht in Kupfer gestochen und der Text **im
Bleisatz gedruckt**. Zwei Verfahren, zwei Durchgänge durch die Presse, zwei völlig
verschiedene Oberflächen. Ich mache daraus eine harte Regel:

> Über der Trennlinie wird gestochen. Darunter wird gesetzt.
> Über der Linie steht nie eine Zahl, die man lesen muss. Unter der Linie ist nie eine
> Schraffur.

Damit ist Fallstrick 4 nicht gemildert, sondern strukturell erledigt. Das Historische darf
so schwer sein, wie es will, weil es keine Information trägt. Die Kartusche darf so nüchtern
sein wie ein Kursbuch, weil sie kein Bild sein muss.

### Gesetz 2 — Der Kartuschenanteil ist die Epochenuhr

Das Blatt hat immer denselben Aufbau: Kopfleiste, Ansicht, Kartusche, Chronikleiste. Was
sich über 700 Jahre verändert, ist **nur das Verhältnis von Ansicht zu Kartusche.**

| Epoche | Ansicht | Kartusche | Maßstab der Platte |
|---|---|---|---|
| I — Das Recht, 1350 | 90 % | 10 % | der Hof |
| II — Die Ordnung, 1600 | 75 % | 25 % | Hof und Stadt |
| III — Die Maschine, 1880 | 60 % | 40 % | Stadt und Land, Inset-Karte kommt dazu |
| IV — Die Marke, 1970 | 25 % | 75 % | das Land, die Anlage wird Miniatur |

Ein einziger Regler trägt den ganzen Epochenwechsel der Oberfläche. In Epoche I sieht man
fast nur den Kessel, weil es fast nur den Kessel gibt. In Epoche IV ist die Ansicht auf
Daumennagelgröße geschrumpft (Bild 03, Feld oben rechts), weil man dann nicht mehr auf
Gebäude schaut, sondern auf elf Zeilen. Der Weg dahin ist stetig, nicht sprunghaft.

### Gesetz 3 — Die Platte vergisst nicht

Eine Kupferplatte, die man nach dreißig Jahren überarbeitet, zeigt die alten Schnitte noch.
Abgerissene Gebäude bleiben als **Geisterriss** stehen: dieselbe Kontur, 15 % Deckkraft.
Nach 700 Jahren liegt unter deiner Abfüllhalle noch schwach der Grundriss des Malzbodens von
1350. Kostet nichts — es ist derselbe Polygonzug mit anderer Deckkraft — und ist das
billigste Stück Melancholie, das ich in ein Wirtschaftsspiel einbauen kann.

---

## 4. Die sieben Fallstricke, einzeln

### 1. Die Epochen verändern die Oberfläche

Über Gesetz 2 (Kartuschenanteil, Maßstab) **und** über die Stichroutine. Vier Routinen,
technisch je eine Funktion `flaeche(polygon, tonwert, epoche)`:

| Epoche | Routine | Umsetzung |
|---|---|---|
| I | Holzschnitt | eine Strichstärke, Kontur geschlossen, Schraffur nur als grobe Parallelen im 45°-Raster, sonst blankes Papier |
| II | Kupferstich | zwei Strichstärken, Kreuzschraffur aus SVG-Pattern, vier Tonwertstufen, Linien mit Schwellung |
| III | Stahlstich | sechs Tonwertstufen, dichtere Schraffur, Punktierung im Himmel, graue Tonplatte kommt hinzu |
| IV | Axonometrie | eine dünne Strichstärke, keine Schraffur, flache Grautönung je Flächennormale |

Dazu kippen Nebendinge mit: Der **Braujahr-Ring** (Michaeli bis Georgi) sitzt in Epoche I
und II als kleine Uhr in der Kopfleiste — und stirbt in den 1870ern mit der Kühlmaschine,
worauf die Chronikleiste durchläuft. Die Schrift altert: Textura, Fraktur, Didot-Antiqua,
Grotesk.

### 2. Trotzdem ein durchgehaltener Stil

Fünf Dinge sind in Bild 01, 02, 03 und 04 buchstäblich identisch:

1. **Das Blatt.** Papiercreme, Plattenrand, vier Zonen, dieselben Höhen auf den Prozentpunkt.
2. **Die rote Ziffer im Kreis.** Von 1350 bis 1970 dieselbe Marke, auf der Platte und als
   Zeilennummer in der Tabelle. Sie ist das Scharnier zwischen Bild und Zahl.
3. **Die Ziffernantiqua.** Die *Wörter* altern mit der Epoche, die **Ziffern nie**. Über 700
   Jahre dieselbe Antiqua mit Tabellenziffern, rechtsbündig, ein Schmalraum als
   Tausendertrenner. Das ist der Punkt, an dem ich zugunsten der Lesbarkeit bewusst
   unhistorisch bin — und der einzige.
4. **Drei Farben.** Papiercreme, Eisengallusschwarz, Zinnoberrot. Ab Epoche III kommt eine
   flache graue Tonplatte dazu, weil die Lithografie sie historisch mitbringt. Sonst nichts.
5. **Die vier Zeilen der Tafel DIESES JAHR.** Sie heißen 1350 und 1970 gleich:

   | | 1350 | 1600 | 1880 | 1970 |
   |---|---|---|---|---|
   | Sude | 6 | 42 | 340 | 2 480 |
   | Preis | 14 | 8 | 0,22 | 1,48 |
   | Malz | 40 | 620 | 4 200 | 96 000 |
   | Geld | 112 Silber | 3 400 Gulden | 61 400 Mark | 1 240 000 Mark |

   Dieselben vier Fragen, 620 Jahre lang, dieselbe Stelle auf dem Blatt. Nur die
   Größenordnungen explodieren und die Währung wechselt. Das ist gleichzeitig Fallstrick 2
   und die Zusatzaufgabe.

   (Die Preiszeile wechselt mit der Währung auch die Bezugsgröße — Pfennig je Eimer,
   Kreuzer je Maß, Mark je Liter. Die Zeile heißt trotzdem in allen vier Epochen `Preis`.
   Der Spieler vergleicht sie nie über Jahrhunderte hinweg, sondern mit dem Vorjahr.)

### 3. Es muss von einer Person mit KI gebaut werden können

Das ist der Fallstrick, an dem dieser Pfad stirbt oder nicht. Die Rechnung steht in
Abschnitt 5. Kurzfassung: **111 Dateien, keine davon mal vier.**

Der Trick ist, dass Epoche und Zustand **keine Dateien** sind. Ein Gebäude ist ein Datensatz
(Grundfläche, Höhe, Dachform, Anbauten), eine Epoche ist eine Zeichenroutine, ein Zustand
ist ein Tonwert plus gegebenenfalls ein rotes Überdruckzeichen. Die klassische Todesformel
30 × 4 × 3 = 360 wird zu 14 × 1 × 1 = 14.

### 4. Der Lesbarkeitskonflikt

Gesetz 1. Bild 03 ist der Beweis: Elf Standorte, vier Zahlenspalten, 44 Werte, eine
Summenzeile — und nichts davon liegt auf Schraffur. Der Zeilenverlierer (Rosenheim) ist
mit einem blassen Zinnoberband unterlegt und seine Kostenzahl steht in Rot. Ein einziges
Signal, das für die ganze Tabelle reicht.

Wichtig ist auch, was in Bild 03 *fehlt*: keine Zellrahmen, keine Streifentapete, keine
Symbole, keine Reiter. Die Tabelle ist gut gesetzt, nicht dekoriert. Eine gut gesetzte
Tabelle sieht nie nach Excel aus.

### 5. Der Maßstabssprung

Die Platte hat drei Maßstäbe — **Hof, Stadt, Land** — und der Maßstab wandert mit der Epoche
(Gesetz 2). Vierzig Standorte werden nie als vierzig Gebäude gezeichnet. Sie sind vierzig
Punkte auf der Inset-Karte im Kartuschenwinkel (Bild 02, oben rechts) und vierzig Zeilen in
der Tabelle (Bild 03). Was in Nahaufnahme gezeichnet wird, ist immer nur **eine** Anlage:
die, deren Zeile gerade markiert ist.

Damit ist der Maßstabssprung keine Zeichenaufgabe, sondern eine Auswahlaufgabe.

### 6. Der KI-Look

**Weg 1: grafisch, flach, typografisch.** Im fertigen Spiel läuft zur Laufzeit *keine*
Bilderzeugung. Die Platte ist Vektorgeometrie plus prozedurale Schraffur, einmal auf ein
Canvas gerendert und zwischengespeichert. Ein Renderer, der nur Linien in vier Stärken und
Schraffuren in sechs Dichten kennt, kann gar keinen Weichzeichner, kein Fantasy-Licht und
keine matschigen Details erzeugen. Er kann nur steif sein — und steif ist bei Stichtechnik
kein Fehler, sondern das Verfahren.

Einzige Ausnahme: die 30 Ereignis- und Porträtillustrationen. Feste Obergrenze, dieselbe
Palette, dieselbe Strichlogik, einmal erzeugt und von Hand kuratiert.

*Ehrlich dazu, siehe auch Abschnitt 6:* Die vier Mockups hier sind erzeugt. Ein Renderer
zeichnet steifer als sie.

### 7. Die Pantomime-Falle

**Die Platte ist Ansicht, nie Bedienung.** Man klickt nie auf ein Fass, um Bier zu
verkaufen. Es gibt keinen Schreibtisch, keine Schublade, kein Umblättern, keine Hand im
Bild, keinen Klick durch Requisiten.

Die Ansicht hat genau **eine** Interaktion: Zeigt man auf eine rote Ziffer, leuchtet die
zugehörige Zeile in der Kartusche auf, und umgekehrt. Sonst nichts. Jede Entscheidung, jeder
Befehl, jede Zahl liegt in der Kartusche, ist gesetzter Text, und ist einen Klick weit weg.

Der Punkt, an dem dieser Pfad aufhört gegenständlich zu sein, ist also scharf und leicht zu
merken: **an der Trennlinie unter dem Bild.**

### Zusatzaufgabe — Zeit sichtbar machen

Vier Antworten, drei davon kostenlos.

1. **Die Chronikleiste** am unteren Blattrand. Ein Zeitstrahl von 1300 bis heute. Der
   gelebte Teil ist zinnoberrot, der ungelebte dünn und schwarz. Ein rotes Karo steht auf
   dem laufenden Jahr. Man sieht in jeder Sekunde, wie viel Haus schon hinter einem liegt.
   Kleine Punkte auf dem roten Teil sind Chronikeinträge — Brände, Erbfälle, das Jahr, in
   dem der Hopfen erlaubt wurde. In der Animation wächst dieser rote Strich sichtbar.
2. **Der Zeitschieber.** Weil jeder Zustand nur ein Parametersatz ist und kein Bild, kostet
   es nichts, ihn aufzuheben. Man zieht das rote Karo nach links und die Platte zeichnet
   sich neu — **die eigene Brauerei, im eigenen Ausbaustand, in der Stichtechnik des
   gewählten Jahres.** Kein Wirtschaftsspiel, das ich kenne, kann das, und dieser Pfad kann
   es geschenkt. Das ist das eigentliche Argument für die Vogelschau.
3. **Der Geisterriss** (Gesetz 3).
4. **Die vier Zeilen**, die 620 Jahre lang gleich heißen (Fallstrick 2, Punkt 5).

---

## 5. Die Asset-Rechnung

Was tatsächlich als Datei existieren muss. Alles SVG, sofern nicht anders vermerkt.

| Gruppe | Was | Stück |
|---|---|---|
| Baukörper | parametrische Körper: Satteldachhaus, Walmdachhaus, Steildachhalle, Sheddachhalle, eckiger Turm, Rundturm, Zylinder (Silo/Tank), Schornstein, Mauerabschnitt, Torbau, Pultdachschuppen, Flachbau, Gewölbekeller, Gerüstwerk (Hopfengarten/Rohrbrücke) | **14** |
| Gelände | Flussabschnitt, Ufer, Brücke, Straße, Bahngleis, Feldstück, drei Baumtypen, Hügelzug | **10** |
| Kleinteile | Fass, Karren, Pferd, Figur, Lastwagen, Güterwagen, Lokomotive, Kran, Brunnen, Feuerstelle, Rauchfahne, Zaun | **12** |
| Markenbaukasten | Schildformen, Hopfendolde, Ährengarbe, Schlüssel, Stern, Krone, Bänder, Rahmen — für den Etikettenentwurf, epochenübergreifend umfärbbar | **20** |
| Legendensymbole | Bedienzeichen der Kartusche | **16** |
| Papierfaser | eine Kachel je Epoche, wird eingefärbt | **4** |
| Schriften | Textura, Fraktur, Didot-Antiqua, Grotesk + eine durchgehende Ziffernantiqua | **5** |
| Illustrationen | Ereignisbilder und Porträts, **harte Obergrenze für das ganze Spiel**, nicht pro Epoche | **30** |
| **Summe** | | **111** |

**Was in dieser Rechnung nicht vorkommt, weil es Code ist und keine Datei:**

- die vier Stichroutinen (Schraffurdichte, Strichstärke, Tonplatte)
- alle Ausbaustufen jedes Gebäudes (Höhe, Breite, Anbauten sind Zahlen)
- alle Zustände (Tonwert, Geisterriss, rotes Überdruckzeichen)
- alle Maßstäbe (Hof/Stadt/Land ist eine Projektionsmatrix)
- jeder einzelne Jahrgang der 700 Jahre

Zum Vergleich die Todesformel aus dem Briefing: 30 Gebäude × 4 Epochen × 3 Zustände = 360.
Hier: 14 Baukörper × 4 Epochen × 3 Zustände = **14 Dateien.**

**Laufzeit.** Eine Stadtansicht mit voller Kreuzschraffur sind schnell 20 000 Pfade — als
lebendes SVG im DOM zu viel. Deshalb: einmal auf ein Offscreen-Canvas rendern, als Bitmap
halten, nur bei Zustandsänderung neu zeichnen. Die Kartusche bleibt HTML und CSS und ist
jederzeit live. Das ist die „eine Hauptansicht in Canvas", die WERKZEUGE Abschnitt 5 als
machbar einstuft — und ich brauche genau eine.

**Was mich das an Programmierarbeit kostet, ehrlich:** die Schraffurmaschine ist das Herz
und muss von Hand stimmen. Ich schätze zwei bis vier Wochen, bis der erste Kupferstich nicht
mehr nach Filter aussieht.

---

## 6. Wo dieser Pfad bricht

**Erstens, und das ist der eigentliche Einwand: Die schönste Fläche des Bildschirms trägt
die wenigsten Informationen.** Aus Gesetz 1 folgt zwangsläufig, dass die Vogelschau keine
Zahl zeigt. Ein Spieler, der optimieren will, schaut nach zwanzig Stunden nur noch in die
Kartusche. Dann habe ich 60 % des Bildschirms an einen Bildschirmschoner verloren. Ich habe
drei Gegenmittel — der Zeitschieber, der Geisterriss, und dass man den Unterschied zwischen
zwei Strategien *sieht* (ein Hof voller Pferde gegen eine Reihe Gärtanks) — aber ich behaupte
nicht, dass sie reichen. Pfad 3, „Das Schild", hat dieses Problem nicht, weil dort das
Schöne und das Informative dasselbe Objekt sind.

**Zweitens: Strichzeichnung hat fast kein Kontrastbudget für Zustände.** Ein Farbspiel
signalisiert „Kessel steht still" mit einem roten Leuchten. Ich habe nur Zinnober, und
Zinnober ist schon durch die Ziffern belegt. Wenn das Marktmodell am Ende zwölf gleichzeitig
sichtbare Zustände braucht, kann die Platte sie nicht tragen und die Kartusche muss sie alle
übernehmen — dann wird Bild 03 zur eigentlichen Hauptansicht, und der Pfad hat sich selbst
widerlegt. **Der Marktmodell-Entscheid aus KONZEPT 13 entscheidet diesen Pfad mit.**

**Drittens: 1970 ist eine Stillüge.** Niemand hat 1970 gestochen. Die Axonometrie rettet es
formal — sie ist die legitime Erbin der Stichtechnik im technischen Bild —, aber sie ist
kalt. Ausgerechnet Epoche IV, die vom *Bedeuten* handelt, verliert die Wärme der drei
vorigen. Man sieht es in Bild 02: Es ist präzise und leer. Vielleicht ist das richtig für
1970. Vielleicht ist es einfach ein Bruch, den ich schönrede.

**Viertens, zu den Mockups selbst:** Die vier Bilder hier sind erzeugt, das fertige Spiel
wäre gerechnet. Ein Renderer zeichnet steifer, ärmer und regelmäßiger als diese Bilder. Das
Sudhaus in Bild 04 hat Backsteinstruktur, Bogenfenster und acht individuell beladene
Pferdefuhrwerke — das bekomme ich aus 14 Baukörpern nicht heraus. **Man sollte diese Bilder
als Zielton lesen, nicht als Zielqualität.** Wer nach dem Anblick von Bild 04 das Spiel
bauen will, sollte wissen, dass die erste spielbare Fassung deutlich karger aussieht.

---

## 7. Die Bilder

| Datei | Was |
|---|---|
| `01-epoche1.jpg` | Epoche I, 1350. Holzschnitt. Der Hof, ein Kessel, acht Legendenzeilen, vier Zahlen. Der Anker, an dem der Stil festgelegt wurde. |
| `02-epoche4.jpg` | Epoche IV, 1970. Technische Axonometrie. Dieselbe Stelle, dasselbe Blatt, elf Standorte in der Inset-Karte. |
| `03-zahlen.jpg` | Der Zahlenmoment. Kartuschenanteil 75 %, die Ansicht auf Daumennagelgröße geschrumpft. 44 Werte, kein Strich Schraffur darunter. |
| `04-signatur.jpg` | Epoche III, 1880. Stahlstich im Genre der Fabrikansicht. Das Plakat. |
| `animation.gif` | Vier Epochen auf demselben Blatt, in Folge. Der rote Strich der Chronikleiste wächst mit. Das ist der Zeitschieber. |

Alle Bilder wurden nach der Erzeugung einzeln geprüft und per `--ref` nachgebessert:
doppelte Legendenziffern entfernt, quadratische Marken in Kreise umgesetzt, die
Zeitleistenmarke von 1900 auf 1970 verschoben. Alle deutschen Zeichenketten wurden im
vollen Auflösungsgrad gegengelesen.

*Handwerkliche Randnotiz für die anderen Pfade:* Die Umlaut-Unzuverlässigkeit aus WERKZEUGE
Abschnitt 2 lässt sich vollständig umgehen, wenn man den Wortschatz umlautfrei wählt —
`AUSSTOSS` statt `Ausstoß` (in Versalien ohnehin korrekt), `Malzboden` statt `Mälzerei`,
`Flaschenhalle` statt `Abfüllung`, und Ortsnamen ohne Umlaut (Freising, Landshut,
Regensburg …). In allen vier Bildern steht kein einziger Umlaut, und es fällt niemandem auf.
