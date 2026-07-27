# Votum des technischen Gutachters

*Geprüft: `KONZEPT.md`, `PRUEFUNG.md`, `WERKZEUGE.md`, die fünf W3-Pitches, die Asset-Tabellen
aller Wellen, die sechs Testpersonen — und die dreißig Bilder der dritten Welle einzeln
geöffnet, dazu sieben davon in voller Vorschauauflösung nachgesehen. Ich kenne die anderen
drei Voten nicht.*

Ich beurteile eine Sache: Was kann **eine Person mit KI-Werkzeugen** hiervon in vertretbarer
Zeit wirklich bauen, ohne dass das Projekt vorher an seinem eigenen Umfang stirbt. Ich bin
nicht der Richter über den schönsten Entwurf. Ich bin der, der nachrechnet.

---

## 1. Die Asset-Rechnungen, nachgerechnet

Alle fünf Tabellen addieren korrekt. Das ist nicht die Frage. Die Frage ist, **wo ein
Multiplikator aus der Tabelle in eine Textzeile gewandert ist** — und wo eine Zahl wächst,
wenn das Spiel wächst.

| Pfad | Genannt | Tabelle stimmt | Der Multiplikator, der nicht in der Tabelle steht | Realistisch |
|---|---:|:--:|---|---:|
| **Erdlinie** (welle2-synthese) | 65 → **69** | ✓ | Drei Gruppen fehlen ganz, keine multipliziert: **Weg- und Geländeteile** (Furt, Brücke, Böschung, Gleis, Straßenprofil) kommen in den Bildern vor und in keiner Zeile; **B Einbauten 22** deckt vier Epochen ab und ist etwa eine Epoche zu knapp (Epoche III allein braucht ~10); **C Hausteile 8→9** ist zu niedrig, weil ein Fachwerkgiebel von 1350 nicht dasselbe Profil ist wie ein Traufenhaus von 1884. Dazu der Strichcharakter: `w3-06` ist zittrige Feder, `w3-01` ist Reißschiene — das ist **keine** der fünf genannten CSS-Variablen, sondern ein SVG-Filterstapel. Alles zusammen: additiv, nicht multiplikativ | **≈ 95–110** |
| **Das Gegenüber** (welle2-gegenueber) | 60 → **62** | ✓ | **Keiner, den ich finde** — und das ist hier fast trivial, weil der Pfad im Kern gar keine Grafik hat. 8 der 60 Teile sind Illustrationen (4 Schankstuben, 4 Kopfvignetten), **deklariert**. Der Rest ist Papier, Schrift, Signet. `w3-03` zeigt fünf gestochene Stationssymbole, die als „bereits gezählt, 0" geführt werden — sie sind aus der 12er-Zeile, das ist sauber | **≈ 70–80** |
| **Das Schild** (Pfad 3) | 142 → **163** (145 mit Rabatt) | ✓ | **Einer, neu in Welle 3, und er steht wörtlich im Text:** „61 Häuser × 4 Epochen × 4 Zustände = 976 Wandplätze aus **12 Signeten**". Zwölf Signete auf einundsechzig benannte Adressen heißt fünf „Zur Krone" in derselben Stadt. Der Pfad hatte in Welle 1 aus genau diesem Grund 36 Wappentiere budgetiert. Ehrlich sind ~50–60 Signete, also **+40 SVG** — die billigste Assetklasse, die es gibt, und sie wächst mit der Adresszahl **einmal**, nicht je Epoche | **≈ 200**, davon ~170 Vektor |
| **Die Karte** (Pfad 4) | 107 → **112** | ✓ | **Der schwerste Fund dieser Prüfung.** Die 107 hingen an genau einem Satz: *„Ein Grundriss braucht keine Ausbaustufen. Ein größeres Sudhaus ist dasselbe Rechteck mit einer größeren Zahl."* In Welle 3 ist der Grundriss durch `w3-01` ersetzt worden — eine schräge Schnittzeichnung mit Innenräumen, Figuren, Bäumen, Rauch und Lichtführung. **Der Satz, der die Zahl gerechtfertigt hat, gilt für das Bild nicht mehr, und der Autor hat die Zahl angepasst (107→112) statt den Satz.** Wenn der Hof die Hauptansicht der Epoche I ist, braucht er Ausbaustufen: allein `w3-01` zeigt acht eigens gezeichnete Baukörper. 8 × 4 Epochen × 3 Stufen = 96 Schnittzeichnungen, die zueinander passen müssen — wörtlich `WERKZEUGE` §5, „der klassische Projektfriedhof", nur eine Nummer kleiner. Der Autor benennt die Richtung selbst (*„Die Wärme ist gekauft, und zwar mit Illustration"*) und zieht die Folgerung nicht | **112 deklariert, ≈ 180–220 gebaut** + erhebliche Kartografie-Codearbeit |
| **Das Modell** (Pfad 5) | **161** | ✓ | **Die Einheit ist weiterhin falsch, und Welle 3 hat es bestätigt statt entkräftet.** Der Pitch liefert die Kennzahl selbst: neun Läufe für sechs Bilder. Die Prüfungsrechnung — ~350 Erzeugungsläufe mit je einem Sichtprüfschritt — steht unverändert, und der Autor schreibt das wörtlich hin. Dazu: 68 tragende Kacheln müssen in Lichtwinkel, Filzton, Schattenlänge und Werkstoffglanz **zueinander** passen; man kann kein einzelnes Bauteil nachbessern, ohne alle anderen neu zu prüfen | **161 Dateien, ≈ 350 Läufe, nicht regenerierbar** |

**Die drei Sätze, die aus dieser Tabelle folgen:**

1. **Die Größe der Zahl sagt weiterhin nichts.** Das Schild nennt mit ~200 die höchste Zahl im
   Feld und ist das billigste Bausystem, weil jedes Teil ein flaches einfarbiges SVG ist.
   Die Karte nennt 112 und ist das dritt- oder zweitteuerste, weil 34 davon Illustrationen
   sind.
2. **Es zählt nur, ob die Zahl mit dem Spiel wächst.** Bei Erdlinie, Gegenüber und Schild
   wächst sie nicht: eine neue Adresse ist eine Datenzeile. Bei der Karte wächst sie mit den
   Ausbaustufen des Hofes. Beim Modell wächst sie mit jeder Qualitätsanforderung — und das
   ist die schlimmste Sorte, weil man sie vorher nicht beziffern kann.
3. **Nur ein Pfad hat den Posten „erzeugte Bilder" als gedeckelte Zeile in seiner Tabelle:**
   das Schild („Erzeugte Bilder in eng gerahmten Rollen, harte Obergrenze fürs ganze Spiel:
   24"). Das ist genau die Obergrenze, die `WERKZEUGE` §5 nennt (20–40 fürs ganze Spiel), und
   es ist die einzige Stelle im Feld, an der jemand das Bildbudget wie ein Budget behandelt hat.

---

## 2. Der Prüfungsmaßstab — die wichtigste Frage

> *„Bei allen anderen sind die Mockups schöner, als das gebaute Spiel je werden kann."*

Ich habe die dreißig Bilder mit genau einer Frage angesehen: **Kann ich für jedes Bild die
Primitive benennen, aus denen ein Codegenerator es zusammensetzen würde?** Wenn ja, besteht
der Pfad. Wenn ich stattdessen ein Kunstwerk sehe, besteht er nicht.

| Pfad | Besteht? | Der Befund am Bild |
|---|:--:|---|
| **Erdlinie** | **ja, mit Abstand am deutlichsten** | `w3-01` ist eine Erdlinie, eine Gabelung, sechs Hauspolygone mit Fensterraster, ein Schraffurmuster, **ein** Grauton, **ein** Rotton, Textkästen. Ich kann jedes Primitiv benennen. Die abgeblassten Häuser bei Altenau sind buchstäblich `opacity: 0.15`. `w3-06` (1350) ist dieselbe Zeichnung mit einem anderen Papier, einer anderen Feder und einer anderen Schrift. Das gebaute Spiel sieht **genauso** aus |
| **Das Schild** | **ja — und es wird gebaut besser aussehen als im Mockup** | `w3-05` ist der Beweis: sieben identische Fassadenspalten, getauscht wird ein Signet und ein Zustand. Das ist kein Bild, das ist ein Komponentenbaum mit sichtbaren Fugen. Und der Autor benennt die einzige Richtung, in der es abweicht, korrekt: die Grotesk statt der Egyptienne ist *„im gebauten Spiel ein Webfont-Tausch"* — der Webfont ist besser als das, was das Modell liefern wollte |
| **Das Gegenüber** | **ja an der Oberfläche, und genau deshalb ein Problem** | Jedes der sechs Blätter ist HTML: eine Tabelle, ein Papierhintergrund, eine rote Handschriftnotiz. Das ist in zwei Abenden gebaut. Aber `w3-03` ist ein Gantt-Diagramm mit Papiertextur, und `w3-05` ist eine Tabellenkalkulation, die zugibt, eine zu sein. **Der Pfad besteht den technischen Test und fällt am eigenen Versprechen durch:** das gebaute Spiel sieht exakt so aus wie das Mockup, und das ist hier die schlechte Nachricht, nicht die gute. Der Autor sagt es selbst: *„Wer zwanzig Stunden spielt, sieht sehr viele Zeilen"* |
| **Die Karte** | **gespalten — vier von sechs bestehen, das entscheidende fällt durch** | `w3-05`, `w3-06`, `w3-02`, `w3-04` bestehen glatt: eine Choroplethenkarte mit gedrucktem Nenner, eine Frachttreppe, Minard-Bänder und ein Wochenband sind exakt das, was Code produziert — teilweise **billiger** als das Mockup, weil sie aus Daten fallen. `w3-01` „Der Hof" fällt durch: aufgeschnittene Gebäude in Schrägansicht, Figuren, Laub, Rauch, Lichtführung. Und ausgerechnet dieses Blatt hat Welle 3 zur **Hauptansicht der Epoche I** befördert — also zu dem, was ein Spieler in den ersten zwei Stunden ansieht |
| **Das Modell** | **nein, vollständig und wissentlich** | Kein einziges der sechs Blätter ist von einem Bausystem herstellbar. Es sind sechs Fotografien. Der Autor formuliert die Sache schärfer, als ich es könnte: *„Bei einem fotografischen Pfad heißt ‚ja' 350 Prüfläufe … Diese Asymmetrie geht nicht weg, indem der Entwurf besser wird."* **Genau eine Baugruppe besteht: der Setzkasten** — 26 kleine Objektbilder in einem festen Rahmen, keine Perspektive, kein Lichtabgleich mit irgendetwas anderem |

**Zwei Nebenbefunde, die dazugehören.**

Erstens, weil ein Gutachter, der nur bestätigt, nichts wert ist: Auf `welle2-synthese/w3-06`
trägt das Wirtshausschild bei Lindenau die Aufschrift **„FILLED SOLID"** — ein englisches
Prompt-Hilfswort, das ins Bild durchgeschlagen ist. Das ist wortwörtlich die Falle, vor der
derselbe Pitch in seinem Abschnitt 9b Nummer 2 warnt (*„Kein englisches Hilfswort in
Versalien"*), und sie steht **nicht** in seiner Mängelliste 9a. Der Fehler ist harmlos. Was
er zeigt, ist es nicht: Auch der sorgfältigste Pfad des Feldes hat sein eigenes Bild nicht
zu Ende gelesen. Das ist die Fehlerklasse, die bei 350 Läufen nicht mehr beherrschbar ist.

Zweitens, zugunsten der Karte: Die Deutschlandkarte in `w3-06` ist geografisch erkennbar
falsch (die Ostgrenze, die Küste, die Lage Hohenaus). Das ist **kein** Einwand gegen den
Pfad, sondern das Gegenteil eines Einwands — im gebauten Spiel kommt diese Fläche aus einer
Topologiedatei und ist dann richtig, ohne dass jemand sie zeichnet. Die Karte ist an ihren
großen Maßstäben *billiger*, als ihre Mockups aussehen. Ihr Problem sitzt am kleinen.

---

## 3. Machbarkeit im Browser

Bewertet nach den vier Achsen, an denen Browserspiele wirklich teuer werden.

| | Perspektive | Elemente je Bildschirm | Animation | Datenmenge |
|---|---|---|---|---|
| **Erdlinie** | keine — Orthogonalschnitt. Der billigste Fall, den es gibt | `w3-03` deckelt sich selbst: 5 gezeichnete Profile + 44 Teilstriche. Nie mehr als ~200 SVG-Knoten | Eine Fuhre auf einem Pfad = `offset-path`, vier Zeilen CSS. Sonst nichts | unkritisch |
| **Gegenüber** | keine | Tabellen, 5–60 Zeilen. Reines DOM | keine nötig | unkritisch |
| **Schild** | keine — flache Farbe, ein Schlagschatten | Register mit 60 Wänden = 60 identische Komponenten. Trivial | Kreidestrich wegwischen = `opacity`. Der wandernde Stern = eine Positionsänderung | unkritisch |
| **Karte** | Grundriss **plus** eine Schrägprojektion im Hofblatt — zwei Systeme auf einem Blatt, vom Autor als Bruch benannt | Nationale Ansicht: ~15 Polygone + 10 Ströme + 40 Werke + Beschriftungen. **Hier sitzt der einzige wirklich schwere Algorithmus des ganzen Feldes: kollisionsfreie Beschriftungsplatzierung über drei Maßstäbe.** Das ist kartografisches Kernhandwerk, nicht Layout | Bandbreiten interpolieren, harmlos | Topologie generalisiert für drei Maßstäbe: ein echter, aber einmaliger Posten |
| **Modell** | volle 3D-Fotoanmutung. Im Browser **nicht baubar**, nur vorgerendert auslieferbar | 68 Kacheln als Rasterbilder, jede ~200–500 KB. Ein Bildschirm zieht mehrere MB | keine — und das ist auch sein inhaltliches Problem | **Der einzige Pfad mit einem Ladezeitproblem** |

**Und die Datenmenge, die kein Pitch beziffert hat, weil sie in keinem Bild vorkommt.**
61 bis 480 benannte Adressen, jede mit Vertrag, Restschuld, Vorleistung, Laufzeit und
Wechselgrund, dazu Konkurrenzhäuser, die nach denselben Regeln erben und untergehen — über
25 Generationen. Wenn die Chronik als Jahresschnappschuss gespeichert wird, ist der
Spielstand nach Epoche III größer als alle Grafiken zusammen und sprengt `localStorage`
(5–10 MB). Die Regel, die vom ersten Tag an gelten muss: **Ereignisse speichern, keine
Zustände.** Das ist billig, wenn man es am Anfang entscheidet, und ein Rewrite, wenn nicht.

---

## 4. Die Erzeugungsasymmetrie

Die belegten Zahlen: Pfad 3 brauchte **elf Läufe für sechs Bilder** (1,83×), Pfad 5 **neun
für sechs** (1,50×), vorher **elf für fünf** (2,20×). Der Korridor ist also **1,5 bis 2,2
Läufe je brauchbarem Bild.** Das ist erstaunlich stabil über zwei sehr verschiedene Pfade.

Der Multiplikator ist aber nicht die eigentliche Nachricht. **Jeder Lauf trägt einen
Sichtprüfschritt, der sich nicht automatisieren lässt** — Vorschau bauen, Bild öffnen, jede
Zeichenkette lesen, jede Zahl gegenrechnen. Realistisch fünf Minuten je Lauf, und die
Zeit sinkt mit Übung nicht, weil jedes Bild neuen Text enthält. Hochgerechnet:

| Bildbedarf | Läufe (1,5–2,2×) | Reine Bildarbeit | Urteil |
|---:|---:|---:|---|
| **12** (Erdlinie: Ereignisvignetten) | 18–26 | 1,5–2 h | vernachlässigbar |
| **24** (Schild: deklarierte Obergrenze) | 36–53 | 3–4,5 h | ein Wochenende, einmal |
| **34** (Karte: Illustrationen) | 51–75 | 4–6 h **wenn** es bei 34 bleibt |  |
| **~96** (Karte: Hof mit Ausbaustufen) | 144–211 | 12–18 h, **und sie müssen zueinander passen** | gefährlich |
| **161** (Modell) | 242–354 | **20–30 h vor der ersten Zeile Spiellogik** — und jedes neue Bauteil öffnet die Schlange wieder | tödlich |

Der harte Teil ist die Nichtwiederholbarkeit. Ein einzelnes Bauteil des Modells lässt sich
nicht nachbessern, ohne Lichtwinkel und Filzton gegen die anderen 67 zu prüfen. Ein SVG
ändert man in dreißig Sekunden.

**Welche Pfade sind davon unabhängig, weil sie zur Laufzeit gar keine erzeugten Bilder
benutzen?**

- **Erdlinie: praktisch vollständig unabhängig.** Ihre Assettabelle enthält keine einzige
  Zeile „erzeugtes Bild" außer den 12 gedeckelten Ereignisvignetten. Papier ist eine
  kachelbare Textur, alles andere ist Geometrie, Schraffurmuster und Webfont. Die Bilder der
  dritten Welle waren **Entwurfsmittel und werden nicht ausgeliefert.** Das ist die stärkste
  einzelne technische Eigenschaft im ganzen Feld.
- **Schild: unabhängig, mit deklarierter Obergrenze** (135 von 163 Teilen sind Vektor, 24
  erzeugte Bilder als harte Deckelung fürs ganze Spiel).
- **Gegenüber: unabhängig bis auf 8 deklarierte Illustrationen.**
- **Karte: nicht unabhängig.** Die 34 Illustrationen sind genau die Klasse, die je Zustand
  neu gebraucht wird.
- **Modell: die Laufzeitoberfläche *ist* die Generatorausgabe.** Keine Trennung, keine
  Rückfallebene.

---

## 5. Der erste spielbare Ausschnitt

Konkret, wie verlangt. Kein Vertikalschnitt durch alles, sondern ein Schnitt, der eine These
beweist oder widerlegt.

**Die These, die geprüft werden muss, ist nicht „sieht gut aus" und nicht „vier Epochen
funktionieren". Sie ist:**

> **Haltbarkeit ist Reichweite, und Reichweite entscheidet, welche benannten Adressen man
> halten kann.**

Das ist die eine Behauptung, an der das ganze Projekt hängt, die kein vergleichbarer Titel
hat und die keine Grafik retten kann, wenn sie langweilig ist.

**Epoche III, Jahr 1884. Ein Bildschirm: die Erdlinie.** Nicht Epoche I.

Epoche I ist die romantische Wahl und die falsche. Sie hat einen Kessel, keinen benannten
Gegner mit eigener Uhr, keine Bahn, keinen Vertrag — also keines der Systeme, um die es
geht. Sie beweist nur, dass man einen Schnitt zeichnen kann. **1884 ist das einzige Jahr, in
dem alle vier strittigen Systeme gleichzeitig leben:** Haltbarkeit (Eismaschine ja/nein),
Reichweite (Straße gegen Schiene), Adressen (Ablösung, Vertragsende) und ein Gegner, der
dasselbe tut. Wenn es 1884 nicht trägt, trägt es nirgends.

**Was gebaut wird** (eine Person, Abende, sieben bis zwölf Tage):

1. Eine HTML-Seite, ein SVG. Erdlinie, eine Gabelung, ein Knoten, das eigene Haus als
   statischer Schnitt, **acht** benannte Adressen als Hausprofil mit Schild in vier
   Zuständen.
2. Ein Wochentakt von Michaeli bis Georgi — rund dreißig Runden. Keine Epochenumschaltung.
3. **Genau vier Zahlen, die dem Spieler gehören:** Barschaft, Absatz, Haltbarkeit in Tagen,
   Reichweite in km. Reichweite = f(Haltbarkeit, Weg). Diese Formel *ist* das Experiment.
4. **Genau drei Verben:** Fuhre disponieren (wer bekommt diese Woche wie viele Fass),
   Adresse ablösen, Keller/Eismaschine bauen.
5. **Ein Gegner**, die Adlerbrauerei, auf einer dummen Regel: wirb um die Adresse mit dem
   höchsten Ausstoß und dem nächstliegenden Vertragsende. Dreißig Zeilen, keine KI.
6. **Ein Verlust, der kein Geldverlust ist:** eine verpasste Lieferung zur Unzeit kostet die
   Adresse. Das ist der Befund der Wirt-Testperson und er muss im Ausschnitt sein, sonst
   prüft man nur eine Einkaufsliste.
7. **Null erzeugte Bilder.** SVG, drei Webfonts, eine Papiertextur.

**Was ausdrücklich wegbleibt:** alle vier Epochen, der Erbfall, der Sortenbaum, die drei
Bedientiefen, die Chronik, der Setzkasten, die Karte, der Kieser, Epoche IV, Speichern, Ton,
Tutorial, Menü, Startbildschirm.

**Das Abnahmekriterium, in Zahlen, sonst ist es ein Wunsch:** Eine Testperson muss in
zwanzig Minuten den Reichweiten-Kompromiss **mindestens zweimal von sich aus** eingegangen
sein und ungefragt sagen können, **warum Altenau nicht erreichbar ist.** Kann sie das nicht,
ist die tragende Idee widerlegt, und man hat eine Woche verloren statt eines Jahres.

**Und davor, einen Nachmittag lang, das billigste Experiment des ganzen Verfahrens:**
Pfad 3s Vorschlag, den die Prüfung zu Recht *„der beste im Feld"* nennt — zwei Wände und ein
Erdlinienblatt als statisches HTML, vier Epochenumschalter, echte Webfonts, echter Text,
keine Logik. Zwanzig Minuten hinsehen. Das beantwortet die Zwanzig-Stunden-Frage für **beide**
Kandidaten gleichzeitig und kostet nichts.

---

## 6. Woran das Projekt realistisch stirbt

In der Reihenfolge der Wahrscheinlichkeit.

**1. Es stirbt am zweiten Epochenaufguss, nicht am Anfang.**
Der erste Bau ist eine Epoche. Sie wird gut. Dann steht da die Aufgabe, Epoche II
(1500–1800) aus dem Nichts zu bauen — und Epoche II ist die, zu der jede Testperson und
jeder Entwerfer am wenigsten zu sagen hat. Der Brettspieler benennt es: sie *„lebt nur von
der Chronik, und Chronik ist Text, nicht Spiel."* Ein Einzelprojekt mit einem funktionierenden,
schönen 1884 und einem leeren 1604 vor sich hört genau dort auf. Das ist der Steam-
Wirtschaftssim-Tod: der erste Akt erscheint, der zweite wird angekündigt.
*Gegenmittel, strukturell und ab Tag eins:* **Epoche III und Epoche I zuerst, Epoche II
bleibt eine Chronikstrecke.** Nicht als Notlösung, sondern als Entwurfsentscheidung —
Uhr 1 aus `KONZEPT` §7 gibt sie ausdrücklich her: *die Chronik schreibt die ruhigen Jahre.*
Zwei gebaute Epochen mit einer erzählten Brücke sind ein fertiges Spiel. Vier halbgebaute
sind keines.

**2. Es stirbt an der Bildbeschaffung — aber nur, wenn ein Pfad gewählt wird, der zur
Laufzeit erzeugte Bilder braucht.**
1,5 bis 2,2 Läufe je Bild, jeder mit einem unautomatisierbaren Sichtprüfschritt, und die
Schlange öffnet sich bei jeder Änderung neu. Bei Pfad 5 ist das der sichere Tod: zwanzig bis
dreißig Stunden reine Bildarbeit, bevor die erste Zeile Spiellogik existiert, und danach
kein einziges Bauteil isoliert korrigierbar. Bei Pfad 4 ist es ein Risiko mit hoher
Wahrscheinlichkeit, und es sitzt punktgenau am Hofblatt der Epoche I.
*Gegenmittel:* das Bildbudget wie ein Budget behandeln — eine gedeckelte Zeile in der
Tabelle, so wie es genau ein Pfad im Feld getan hat.

**3. Es stirbt am Umfang der Marktsimulation, nicht an der Oberfläche.**
Einundsechzig bis vierhundertachtzig benannte Adressen, jede mit Vertrag, Restschuld,
Vorleistung, Ablösepreis und sechs Wechselauslösern; dazu Konkurrenzhäuser, die nach
denselben Regeln erben, wachsen und untergehen — über siebenhundert Jahre. Das ist eine
Simulation mit mehr beweglichen Teilen als das gesamte Grafiksystem, sie kommt in **keinem
einzigen Mockup vor**, keine Assetrechnung erfasst sie, und sie muss *ausbalanciert* werden.
Balancieren ist die eine Tätigkeit in diesem Projekt, die KI-Unterstützung nicht verkürzt.
*Gegenmittel:* die Adresszahl hart deckeln — **rund sechzig, für immer**, und über die
Epochen den *Typ* der Adresse wechseln lassen (Schankrecht → Wirtshausvertrag → Depot →
Listung), nicht die Anzahl. `KONZEPT` §13 verlangt das ohnehin. Und: Ereignisse speichern,
keine Zustände.

*Ein vierter Tod, den ich als Fußnote nenne, weil er unhöflich ist:* **Das Projekt kann daran
sterben, dass die Entwurfsphase zu gut ist.** Dreißig Bilder dieser Güte und fünf Pitches
dieser Sorgfalt sind bereits ein vorzeigbares Werk. Der Reiz, weiter zu entwerfen statt
anzufangen, ist real und wächst mit jeder Runde. Die nächste Handlung sollte Code sein, egal
welcher.

---

## 7. Meine Empfehlung

### Gebaut werden soll: **die Erdlinie** (`welle2-synthese`) — mit zwei Aufpfropfungen und einer Auslassung.

Die Begründung in einem Satz: **Sie ist der einzige Pfad, dessen Bilder ich Primitiv für
Primitiv zurückrechnen kann, und der einzige, dessen ausgelieferte Oberfläche kein einziges
erzeugtes Bild enthält.** Sie besteht den Prüfungsmaßstab nicht knapp, sondern deutlich; sie
hat die niedrigste und am wenigsten wachstumsanfällige Assetrechnung; sie legt Handwerk und
Vertrieb auf **eine** Achse und braucht dafür keine zweite Grafikpipeline; und sie ist der
einzige Entwurf, der aus `KONZEPT` §2 das Merkmal einlöst, an dem vier von sechs Testpersonen
angeschlagen haben — *es gibt einen Raum.*

**Aufpfropfung 1, kostet null Assets:** die Bauregel aus `welle2-gegenueber` — *jede Zahl auf
dem Schirm ist eine Zahl, die jemand anders über dein Haus führt.* Als **Regel**, nicht als
Bildschirm. Beide Autoren haben unabhängig voneinander genau diese Kombination
vorgeschlagen; ich kann technisch keinen Grund finden, sie nicht zu nehmen, weil sie in
Datenhaltung und Layout nichts kostet und die einzige Antwort auf `KONZEPT` §13 ist, die
ohne ein erfundenes Feld „Markenbekanntheit" auskommt.

**Aufpfropfung 2, kostet ~20 SVG:** Pfad 3s Schild mit **vier** Zuständen (eigenes Zeichen ·
fremdes Zeichen · zur Wand gedreht · Schattenriss) als Adress-Bauteil, dazu der Emailbrand
als Statusschwelle um 1900 und der Stern, der weiterwandert. Der beste Beleg dafür ist kein
Argument, sondern ein Vorgang: **beide Pfade der zweiten Welle haben sich dieses Bauteil
unabhängig voneinander selbst genommen.** Die Erdlinie hat es mit zwei Zuständen eingebaut;
vier sind richtig.

**Auslassung:** Pfad 5s Vitrine nicht nehmen. **Den Setzkasten schon** — er ist als einziger
seiner Baugruppen vom Rest ablösbar (26 kleine Objektbilder, fester Rahmen, keine
Perspektive, kein Lichtabgleich; ~40 Läufe, ein Nachmittag). Drei Testpersonen haben ihn als
das Einzige benannt, was sie zurückkommen lässt, und er ist das einzige Element im ganzen
Feld, das ohne eine einzige Zahl funktioniert. Der Autor empfiehlt genau diesen Zuschnitt
selbst; ich schließe mich technisch an.

**Was ich nicht bauen würde:** Pfad 5 als Oberfläche — nicht wegen der Qualität, sondern weil
der Autor die Rechnung selbst aufgemacht und nicht widerlegt hat. Und Pfad 4s Hofblatt als
Hauptansicht der Epoche I. Pfad 4s **Land- und Reichblätter** dagegen sind das billigste
Informationsangebot des ganzen Feldes und sollten kommen, sobald das Spiel läuft — sie sind
Code auf Daten, nicht Zeichnung.

---

## 8. Ausdrücklich getrennt: was am schnellsten zu etwas Spielbarem führt

**Das ist nicht dieselbe Antwort, und die Trennung ist wichtiger als die Empfehlung.**

**Schnellstens *falsifizierbar* (ein Nachmittag): Pfad 3 — Das Schild.** Zwei Wände, vier
Epochenumschalter, echte Schriften, zwanzig Minuten hinsehen. Fällt es durch, hat man einen
Nachmittag verloren und einen Signet-Baukasten gewonnen, den der Gewinnerpfad ohnehin
einbaut. Das ist eine Wette ohne Verlustseite.

**Schnellstens *spielbar* (vier bis sechs Abende): `welle2-gegenueber` — Das Gegenüber.**
Und zwar aus einem Grund, den sein eigener Pitch nicht ausspricht: **dieser Pfad hat gar
keine Grafik.** Sechs Bildschirme aus Tabellen, Papiertextur und einer roten Handschrift.
Man kann die gesamte Mechanik von 1884 — Reifeplan, Anstichbuch, Haltbarkeit, Ablösung, die
Wahl — in Rohtabellen laufen lassen, bevor eine einzige Linie gezeichnet ist.

Und daraus folgt die Empfehlung, die ich für die technisch nützlichste dieses Votums halte:

> **Die beiden Pfade sind keine konkurrierenden Oberflächen. `welle2-gegenueber` ist die
> Entwicklersicht der Erdlinie.** Dasselbe Datenmodell, einmal als Tabelle, einmal als
> Zeichnung. Man baut die Tabellen zuerst, weil sie sofort laufen und weil man an ihnen
> balanciert; die Erdlinie ist danach eine zweite Ansicht auf dieselben Objekte und kein
> zweites Projekt. Die Tabellenansicht bleibt im Spiel — sie ist die Liste, die die Wirt-
> Testperson ausdrücklich verlangt hat, und sie ist der Debug-Bildschirm, den man in einem
> Einzelprojekt sowieso baut. **Man bekommt hier zwei Dinge zum Preis von einem, wenn man
> in dieser Reihenfolge vorgeht — und nur in dieser.**

Also, als Reihenfolge, ohne Umschweife:
1. Ein Nachmittag: Pfad 3s Wandtest, für beide Kandidaten gleichzeitig.
2. Vier bis sechs Abende: die 1884er Mechanik als Rohtabellen (`gegenueber`).
3. Sieben bis zwölf Tage: die Erdlinie als Ansicht darüber. **Erst hier ist es das Spiel.**
4. Danach erst: zweite Epoche, Setzkasten, Kartenblätter.

---

## 9. Der Preis meiner Empfehlung

Er ist real und ich rechne ihn vor, damit niemand ihn später findet.

**1. Man kauft Kälte, und zwar dauerhaft.** Die Erdlinie hat keine Gesichter und wird nie
welche haben; ihr Autor sagt es selbst und nennt die Hälfte, die er nicht gelöst hat. Vier
von sechs Testpersonen haben ausdrücklich einen Menschen verlangt. Eine Maßstabsfigur mit
Namensschild ist nicht das, was sie gemeint haben. **Die ersten fünfzehn Minuten werden die
schwächste Viertelstunde des Spiels sein** — und das ist genau die Viertelstunde, in der man
Spieler verliert. Ich nehme das in Kauf, weil ein Projekt, das im vierten Monat stirbt,
überhaupt keine erste Viertelstunde bekommt. Das ist eine Abwägung, keine Lösung.

**2. Man kauft eine Fläche weniger.** Pfad 4 hat recht: eine Linie kann nicht *zwischen*
sagen. Eine Gabelung sagt es einmal; ein nationaler Markt der Epoche IV mit neun Richtungen
ist so nicht zeichenbar, und der Autor räumt es ein. **Die räumliche Ansicht der Epoche IV
ist in meiner Empfehlung ungebaut** und wird eine Liste oder muss später mit der Karte
nachgekauft werden — dann zahlt man Pfad 4s Kartografierechnung eben doch, nur später und
mit einem laufenden Spiel darunter. Das halte ich für die richtige Reihenfolge, aber es ist
eine Verschiebung, keine Ersparnis.

**3. Man kauft ein Genre-Risiko.** Flache technische Zeichnung muss man lesen *lernen*. Das
ist das Gegenteil dessen, wovon PC-Wirtschaftssimulationen in den ersten dreißig Sekunden
leben. Vier Schildzustände und ein Setzkasten sind das gesamte Wärmebudget dieser
Empfehlung, und es kann zu wenig sein.

**4. Und der Preis, den man am schwersten sieht:** Ich empfehle den Entwurf, der am billigsten
zu bauen ist. Damit optimiere ich darauf, dass dieses Spiel **existiert** — nicht darauf, dass
es das beste der fünf ist. Das sind zwei verschiedene Ziele, und der Auftraggeber soll
wissen, welches ich verfolgt habe. Wer bereit ist, ein Jahr statt eines halben einzusetzen
und das Risiko des Abbruchs mitzukaufen, hat mit Pfad 4 die reichere Oberfläche. Wer ein
fertiges Spiel will, nimmt die Erdlinie.

---

## 10. Die Schlussfrage

> **Was würdest du dem Auftraggeber sagen, wenn du nur einen Satz hättest?**

**Bauen Sie die Erdlinie für ein einziges Jahr — 1884 — und wenn nach zwanzig Minuten niemand
von selbst fragt, warum sein Bier Altenau nicht mehr erreicht, dann haben Sie eine Woche
verloren statt eines Jahres.**
