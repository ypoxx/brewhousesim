# Welle 8 · Der Bildvergleich — Urteil eines blinden Kritikers

**Eine Frage je Epoche: Gewinnt das Zielbild noch?**

| Epoche | Urteil |
|---|---|
| I · 1350 | **Zielbild gewinnt** — knapp, und aus einem Grund, der nicht am Gemalten liegt |
| II · 1600 | **Zielbild gewinnt** |
| III · 1884 | **unentschieden** — die gemalte Welt schlägt das Zielblatt, der Bildschirm gibt es wieder her |
| IV · 1970 | **Zielbild gewinnt** |

**Der eine Satz:** *Das Spiel hat das Zielbild beim Malen eingeholt und verliert es unter
seiner eigenen Oberfläche wieder — 29 % des Rahmens liegen unter Bedienkästen, gegen unter
4 % im Zielblatt.*

---

## 1 · Wie gemessen wurde

**Fassung.** `curl -s http://127.0.0.1:8906/.messstand-marke` → `8b81250`, geprüft vor der
ersten und nach der letzten Aufnahme. Alle Zahlen unten stehen auf dieser einen Fassung.

**Sequenziell.** Jeder Browser lief einzeln durch
`werkbank/schuss/aufsicht/messfenster.sh` (`HAFEN=8906`, `MESSFENSTER_WARTE=7200`), vier
Epochen hintereinander, nie zwei gleichzeitig. Die Aufsicht fuhr währenddessen
400-Wochen-Läufe; die Wartezeiten lagen zwischen 4 und über 20 Minuten je Aufruf. Ein
verwaister Wartevorgang aus meinem eigenen ersten Anlauf hat sich dabei selbst blockiert
(sein Kommandozeilentext traf sein eigenes `pgrep`-Muster) — behoben, verzeichnet, damit es
niemand wiederholt.

**Fläche.** Alle Aufnahmen 2752 × 1536, `deviceScaleFactor: 1` — dieselbe Fläche wie die
Zielblätter, die ebenfalls 2752 × 1536 messen (`file` auf alle vier).

**Geräte** (neu geschrieben, in `werkbank/schuss/bild-w8/`):

| Datei | was sie tut |
|---|---|
| `aufnehmen.mjs` | lädt eine Epoche, schießt, spielt 30 Wochen mit echten Mausklicks und Käufen, schießt wieder — je mit und ohne die oberen vier Ebenen |
| `nachtrag.mjs` | dasselbe für `?bau=alle` (die Obergrenze des Gemalten) und für „gespielt, aber das aufliegende Blatt weggelegt" |
| `bauorte.mjs` | Chrom-Trennung (siehe §2) und die Bildschirmrechtecke aller Aufbauten |
| `deckung.mjs` | Deckung in **Bildpunkten** zwischen zwei fertigen Aufnahmen, getrennt nach oberem Sechstel / Mittelband / unterem Sechstel |
| `schnitt.mjs` | schneidet Ausschnitte in voller Auflösung aus den PNG (eigener PNG-Kodierer — im Container gibt es weder PIL noch numpy) |
| `gegenueber.mjs` | legt Zielblatt und Spielaufnahme im selben Rechteck übereinander |
| `lauf.sh` · `lauf2.sh` · `kette.sh` | die Reihenfolge, jede Messung einzeln durchs Fenster |

**Geklickt wurde wirklich.** Kein `element.click()` auf unsichtbare Knöpfe: jeder Klick ist
`mouse.move` → `mouse.down` → `mouse.up` auf die Mitte einer echten Trefferfläche. Die
Hofbauten wurden über `button[data-zug^="stadt:bau:"]` angesteuert, nicht über eine
y-Spanne. Protokolle vollständig in `werkbank/schuss/bild-w8/berichte/e1..e4.txt`.

| Epoche | Klicks | davon Käufe | Stand vorher → nachher | Seitenfehler |
|---|---|---|---|---|
| 1350 | 35 | 5 | 1350/W1, Kasse 112 Pf, 24 Stück in `ebene-bau` → 1351/W1, 27 Pf, 28 Stück | 0 |
| 1600 | 36 | 6 | 1600/W1, 640 fl, 25 → 1601/W1, 160 fl, 31 | 0 |
| 1884 | 35 | 5 | 1884/W1, 14.250 M, 29 → 1885/W1, 4.200 M, 33 | 0 |
| 1970 | 34 | 4 | 1970/W1, 86.000 DM, 25 → 1971/W1, 30.829 DM, 28 | 0 |

**In allen vier Epochen: „keine Fehler auf der Seite", `BRAUHAUS.lage` leer.**

**Prüfsummen der sechzehn Grundaufnahmen** (`md5`):

```
1daf328a035a0333146f41093cdcb804  e1-00-roh.png
51639bc9f3dece2f420937316e6cb9ea  e1-01-roh-nackt.png
1c7a9d4dabb1d5f99506bd69f35a8950  e1-10-gespielt.png
e1502cd221b7bc9ec93e2cc359dbe239  e1-11-gespielt-nackt.png
12c0a55321b13cdf883eaed5ac90809a  e2-00-roh.png
cce005b4cc4b7330e6f7091ea646b352  e2-01-roh-nackt.png
c8b92307eba4fcebcb86080c88a14477  e2-10-gespielt.png
4580c1a89de745d9633a647cab60c765  e2-11-gespielt-nackt.png
c151102aec2378d6d5c5956b0eb7827d  e3-00-roh.png
6b0962f514260003fce1e36bfcce778b  e3-01-roh-nackt.png
f6a54ccd75563d2f5b798e842266a252  e3-10-gespielt.png
099c75d3cd3314e3d0b608f2abd03a0b  e3-11-gespielt-nackt.png
2f354921f8465ff3f08a0036a61da86b  e4-00-roh.png
9be290c3e6014597c977fd95fdc876f4  e4-01-roh-nackt.png
9e11f9b76801cda8458c4bc516307c52  e4-10-gespielt.png
9efce90571884667db6f68c856812168  e4-11-gespielt-nackt.png
```

Jedes PNG ist **wirklich angesehen** worden, als Bild, dazu zwölf Ausschnitte in voller
Auflösung (`schnitte/`). Aus dem Quelltext ist kein einziges Urteil abgeleitet; er wurde nur
benutzt, um einen Befund zu benennen (welcher Bau heißt wie) und um eine eigene Fehlmessung
zu berichtigen (§2, Ende).

### Was ich gelesen habe — und was mich befangen macht

Nicht gelesen: `werkbank/urteile/**`, `werkbank/LAUFENDER-AUFTRAG.md`, `gauntlet/WELLE-*.md`,
`werkbank/stand.json`, die Fortschrittsseite, `git log/show/diff`, kein Builder-Bericht.
`gauntlet/EPOCHENBOGEN.md` habe ich vorsichtshalber ebenfalls nicht geöffnet, weil es nicht
auf der Erlaubnisliste stand.

**Drei Stellen, an denen erlaubtes Material fremde Befunde mitführt — offengelegt, damit
mein Urteil nachprüfbar bleibt:**

1. `spiel/bild/LIESMICH.md` (erlaubt: Quelltext unter `spiel/`) zitiert wörtlich frühere
   blinde Kritiker: *„Die vordere Hälfte des ummauerten Hofes bleibt leer"*, *„der Hof 1884
   menschenleer"*, *„DER ZIEHBRUNNEN IST FÜNF METER BREIT"*. Ich habe das **nach** den
   ersten beiden Aufnahmen gelesen und **keinen** dieser Punkte übernommen: der Hof ist
   1884 nicht menschenleer, der Brunnenkranz ist nicht mehr fünf Meter, und der leere
   vordere Hof taucht in meinen Auflagen nicht auf, weil ich ihn an den Bildpunkten nicht
   als das entscheidende Problem wiederfinde.
2. Der Kopf von `werkbank/schuss/aufsicht/deckung-je-stueck.mjs` (ausdrücklich zur Benutzung
   angeboten) nennt die Zahl eines Vorgängers: *„27–28 % der Fläche, 60 % des untersten
   Sechstels"*. Ich habe das Gerät **nicht** benutzt, sondern mit `deckung.mjs` selbst
   gemessen. Meine Zahl für die Gesamtfläche liegt in derselben Größenordnung (29,1–30,3 %),
   **die für das unterste Sechstel weicht stark ab** (11,9–13,4 % statt 60 %) — was für eine
   unabhängige Messung spricht und nicht für Nachschreiben.
3. `gauntlet/MESSLATTE.md` (erlaubt) ist voll von ρ-Zahlen früherer Wellen. Sie berühren die
   Bildlatte nicht.

**Und eine vierte Sache, die auffiel und gemeldet gehört:** `git status --porcelain` führt
genau diese Datei als ` M` — es gibt zu diesem Pfad also eine Fassung im Bestand. Ich habe
sie **nicht angesehen** (`werkbank/urteile/**` ist für mich gesperrt, und Verlauf ebenso).
Auf der Platte lag nichts Beschriebenes: das Schreibwerkzeug verweigert das Überschreiben
einer vorhandenen, ungelesenen Datei, und es hat nicht verweigert. Zerstört ist damit
nichts — wer den Verlauf sehen darf, möge trotzdem nachsehen. `git add`, `git commit` und
`git push` sind in diesem Lauf nicht ausgeführt worden.

---

## 2 · Die eine Trennung, an der frühere Kritiker gescheitert sind

Die Bühne stapelt `platte < bau < marken < hand < kopf < blatt`. **Die Grenze zwischen
„gemalter Welt" und „Bedienoberfläche" verläuft nicht entlang dieser Ebenen**, und wer sie
dort zieht, misst falsch:

* `marken` trägt **den Hof des Gegners** — ein gemaltes Gebäude jenseits des Flusses — *und*
  seine Karteikarten.
* `hand` trägt **Fuhrwerke und Fässer** *und* die großen Bretter der Fuhre.

Ich bin in genau diese Falle gelaufen: meine erste „nackte" Aufnahme blendete alle vier
oberen Ebenen aus und **löschte damit den Gegnerhof aus der Welt**. Erst der Blick in die
volle Aufnahme zeigte ihn wieder. Alle Aussagen über *„steht im Bild / steht nicht im Bild"*
unten sind deshalb an der **vollen** Aufnahme geprüft, nie an der nackten.

**Deckung, in Bildpunkten gemessen** (`deckung.mjs`, Schwelle 8 Stufen in einem Kanal),
volle Aufnahme gegen `platte+bau`:

| Epoche | Zustand | gesamt | oberstes 1/6 | Mittelband | unterstes 1/6 |
|---|---|---|---|---|---|
| 1350 | gleich nach dem Laden | **29,6 %** | 51,7 % | 28,1 % | 13,4 % |
| 1600 | " | **30,3 %** | 52,2 % | 29,4 % | 11,9 % |
| 1884 | " | **29,1 %** | 53,1 % | 27,3 % | 12,5 % |
| 1970 | " | **29,8 %** | 54,0 % | 28,3 % | 11,9 % |
| 1350 | nach 30 Wochen, Jahrestafel liegt auf | **56,3 %** | 68,5 % | 64,2 % | 12,4 % |
| 1600 | " | **58,5 %** | 69,5 % | 67,3 % | 12,4 % |
| 1884 | " | **54,7 %** | 69,9 % | 61,5 % | 12,5 % |
| 1970 | " | **57,5 %** | 70,1 % | 65,6 % | 12,4 % |

Die Zielblätter tragen dagegen genau zwei Dinge: die Kopfleiste (rund 1610 × 90 Bildpunkte)
und die WEITER-Tafel (rund 235 × 60) — zusammen **unter 4 %** der Fläche. *(Am Zielblatt
abgemessen, nicht aus einer Datei gelesen; die Größenordnung trägt, die zweite Stelle nicht.)*

**Das Verhältnis ist rund 1 : 7,5 im ruhigen Zustand und 1 : 14, sobald ein Blatt aufliegt.**

### Die saubere Trennung: es sind die Kästen, nicht die Bilder

Weil die Ebenentrennung nicht trägt, habe ich sie durch eine **Eigenschaftstrennung** ersetzt
(`bauorte.mjs`): in den vier oberen Ebenen wird jedes Element ausgeblendet, das einen
deckenden Grund oder einen sichtbaren Rahmen hat — ein Kasten. Was nur ein freigestelltes
Bild trägt (Gegnerhof, Fuhrwerke), bleibt stehen. Dieselbe Seite dreimal aufgenommen:

| Epoche | alles über `platte+bau` | davon **Kästen** | davon **gemalte Sprites** |
|---|---|---|---|
| 1350 | 29,6 % | **29,0 %** | 0,7 % |
| 1600 | 30,3 % | **29,5 %** | 0,7 % |
| 1884 | 29,1 % | **29,1 %** | 0,0 % |
| 1970 | 29,8 % | **29,5 %** | 0,3 % |

**Die Verdeckung ist fast vollständig Bedienoberfläche.** Was auf den oberen Ebenen gemalt
ist, kostet zusammen höchstens sieben Zehntel eines Prozents. Damit ist der Einwand
„ihr habt ja die Welt mitgemessen" erledigt, und zwar mit Bildpunkten.

*Gerätekontrolle:* diese drei Aufnahmen entstanden in einer **anderen Browsersitzung** als
die Tabelle darüber. Die Spalte „alles über `platte+bau`" reproduziert die dort gemessenen
Werte 29,6 / 30,3 / 29,1 / 29,8 **auf die Zehntelstelle** — zwei unabhängig erhobene
Messungen stimmen überein.

### Und die Oberfläche wächst, während man spielt

Nach 30 gespielten Wochen in 1350, **nachdem** das aufliegende Blatt mit dem eigenen
Schließen-Knopf und viermal Escape weggelegt wurde, deckt sie **51,0 %** (Mittelband
58,9 %). Der Grund steht in `e1-30-gespielt-frei.png`: das Spiel legt nach dem Jahreswechsel
**mehrere Blätter hintereinander** auf; Escape blättert nur weiter. `BLATT-KINDER` steht
danach immer noch bei 7.

> **Eine eigene Fehlmessung, sofort berichtigt.** Mein Beschriftungszähler meldete in 1350
> neun gekürzte Textknoten. Sechs davon sind `.sud-kartensatz` — und `stil/sud.css:121–126`
> gibt ihnen `overflow-y: auto`. **Das sind Rollkästen, keine Schnitte.** Genau der
> Fehlalarm, vor dem die Messlatte warnt. Die Zahlen unten sind um diese sechs bereinigt.

---

## 3 · Befund je Epoche

*Koordinaten immer im Rahmen 2752 × 1536, Ursprung oben links.*

### I · 1350 — `01-1350.jpg` gegen `e1-*`

**Wo das Spiel das Zielblatt schlägt, und zwar deutlich:**

* **Die Braustelle.** Das Zielblatt zeigt eine offene Kupferpfanne über offenem Feuer und
  zwei Frauen mit Holzpaddeln — mehr nicht. Das Spiel zeigt an derselben Stelle
  (x 750…1020, y 1000…1130) eine vollständige Braustelle: Maischbottich, offene Pfanne auf
  einem kniehohen Steinring über offenem Feuer, Kühlschiff, Holzstoß, **fünf** arbeitende
  Figuren. Sperrlistenfest: kein Deckel, kein Helm, kein Schwanenhals.
* **Der Ziehbrunnen** (x 495…590, y 830…915) hat im Spiel **zwei Frauen** — eine am Kranz,
  eine mit Schulterjoch. Im Zielblatt steht der Brunnen leer.
* **Die Schrift.** „BRAUHAUS ⚓ ZUM ANKER / GEGR. 1350" steht im Spiel als scharfer, echter
  Text auf dem Torschild. Im Zielblatt ist die zweite Zeile zu unlesbarem Grau zerfallen.

**Wo das Zielblatt gewinnt:**

1. **Der Hof stapelt sich, statt sich zu verteilen.** Nach fünf Käufen liegen im Spiel vier
   Dächer ineinander: das strohgedeckte Dach des **Ochsenstalls** (x 1040…1250, y 680…820;
   der Ochse steht daneben) schneidet quer über das Schindeldach des Brauhauses und über den
   **Malzboden auf Stelzen**, der in der Aufnahme vor den Käufen (`e1-01-roh-nackt`,
   x 1055…1390, y 570…880) noch frei auf seinen Steinpfeilern steht und danach nicht mehr zu
   erkennen ist. Im Zielblatt steht jedes Hofstück für sich, mit sichtbarem Hofboden
   dazwischen — und der Malzboden auf Stelzen ist dort eines der drei Motive, die der
   1350er Prompt ausdrücklich verlangt.
2. **Die linke Hälfte des ummauerten Hofes bleibt leer.** x 320…700, y 780…1120 ist im
   Spiel unbespielte Wiese und Erde. Im Zielblatt liegt dort ein Stapel von rund zehn
   Fässern und ein Bohlentisch.

   > **Das ist kein Tempoproblem, sondern ein Zeichenproblem.** Der Bauhof meldete nach
   > 30 Wochen *„Der Hof ist für diese Zeit fertig gebaut"*, und die Aufnahme mit
   > `?bau=alle` (`e1-20-baualle-nackt.png`) zeigt **dasselbe Bild**: leere linke Hälfte,
   > dieselbe Dachüberlagerung. 1350 steht bereits an seiner Obergrenze. Mehr Bauten kaufen
   > zu können, hilft hier nichts.
3. **Der Vordergrund fährt nicht.** Im untersten Sechstel (y 1280…1536) trägt das Zielblatt
   ein Zweigespann mit Karren und Fuhrmann, das die Straße heraufkommt. Im Spiel liegt dort
   leerer Sandweg mit drei Gänsen und einem Schwein; das einzige Gespann steht klein am Tor.

### II · 1600 — `02-1600.jpg` gegen `e2-*`

**Wo das Spiel schlägt:** das Zweigespann mit zwei schweren Braunen, beladenem Wagen und
Fuhrmann steht hier groß am Tor (x 950…1310, y 1000…1200) und ist besser gezeichnet als das
des Zielblatts. Weinbergterrassen, Steinbogenbrücken, Wegkreuz, Kirchturm mit Spitzhelm,
Reiter, Hund, Marktbuden: alle da. Die drei Ortsnamen stehen als echte, scharfe Schrift.

**Wo das Zielblatt gewinnt:**

1. **Ein gekaufter Hofbau steht auf dem Marktplatz und begräbt ihn.** Vor den Käufen
   (`e2-01-roh-nackt`, Ausschnitt `schnitte/e2-hofrand-roh.png`) liegt bei x 1340…1450,
   y 650…715 der **Marktbrunnen** mit Wasserschale, daneben ein Hund, ein Pferdefuhrwerk und
   drei Marktleute — alle **außerhalb** der Hofmauer, auf dem Platz der Stadt. Nach den
   Käufen (`schnitte/e2-hofrand.png`) steht dort eine offene Fachwerkhalle mit großem
   Holzbottich und Leiter (x 1130…1510, y 650…910) und **nichts davon ist mehr zu sehen**.
   Gekauft wurden in dieser Partie: Gärbottiche, Kontor, Hopfenlager, Waschhaus,
   Pferdestall, Rossmühle. Im Zielblatt bleibt der Marktbrunnen frei und der Hof bleibt
   hinter seiner Mauer.
2. **„BRAUEREI ADLER" fehlt als Schild im Bild.** Das Zielblatt trägt jenseits des Flusses
   ein großes ockerfarbenes Brauhaus mit gemaltem Schild „BRAUEREI ADLER". Das Spiel zeichnet
   dort zwar einen Gegnerhof (x 2060…2260, y 350…530, in `ebene-marken`, in der vollen
   Aufnahme `schnitte/e2-adler-voll.png` sichtbar), aber **ohne jede Beschriftung**. Der Name
   „BRAUSTATT ADLER" steht ausschließlich auf einer schwebenden Karteikarte der
   Bedienoberfläche. Die Ortsmarken des Spiels sind genau drei — ST. MICHAEL, GASTHOF
   LINDENHOF, BAHNHOF (ab Epoche III); der Gegner hat keine.
3. **Zwei graue Schaltflächen mitten in der Landschaft.** Unter dem Gegnerhof, bei
   x 2110…2180, y 525…560, sitzen zwei schlichte hellgraue Quadrate mit Haus- und
   Sternsymbol. Sie sind nicht gezeichnet, sie sind Bedienfläche, und sie liegen auf dem
   Weinberg.

### III · 1884 — `03-1884.jpg` gegen `e3-*`

**Hier schlägt die gemalte Welt das Zielblatt, und das gehört ausdrücklich gesagt:**

* **Der Schornstein** (x 500…620, y 175…870) hat ein gemauertes Kranzgesims und eine eiserne
  Steigleiter über die volle Höhe; die Rauchfahne steht. Der des Zielblatts ist an derselben
  Stelle schlanker und glatt — Kranz und Leiter fehlen ihm.
* **Die drei Gärtanks** (x 1130…1450, y 630…900) stehen auf einer Plattform mit Laufsteg,
  Geländer, Nietreihen und Mannlöchern. Im Zielblatt stehen drei glatte Zylinder ohne Podest.
* **Der Eiskeller** (x 700…900, y 930…1090) hat ein Ziegelgewölbe im Erdhügel und **zwei
  gestapelte Eisblöcke** davor — ein Sachdetail, das dem Zielblatt fehlt.
* **Mälzereiturm, Maschinenhaus mit liegendem Dampfkessel, Kupfer-Dampfhut** — alles
  vorhanden und sauber gezeichnet.
* **„GEGR. 1350" steht richtig.** Das Zielblatt schreibt an derselben Stelle **„GEGR. 1356"**
  — ein Fehler, den `zielbild/README.md` selbst verzeichnet. **In dieser einen Einzelheit
  schlägt das Spiel die Messlatte sachlich.**

**Wo das Zielblatt trotzdem nicht verliert:**

1. **Zwei leere Schilder stehen im Bild.** Auf dem Gegnerwerk jenseits des Flusses
   (x 2170…2320, y 480…525) und auf dem Bahnhofsdach (x 2610…2740, y 380…425) liegen zwei
   große cremefarbene Tafeln — **beide ohne einen einzigen Buchstaben**
   (`schnitte/e3-adler.png`). Im Zielblatt tragen sie „BRAUEREI ADLER" und „BAHNHOF". Eine
   leere helle Tafel liest sich nicht als Schild, sondern als unfertiges Bild. Der Name
   BAHNHOF hängt stattdessen als schwebender Zettel daneben in der Luft.
2. **Der Vordergrund verliert seinen Verkehr, sobald man spielt.** Beim Laden steht das
   Zweigespann mit zwei Braunen und Fuhrmann noch da (`e3-00-roh`, x 960…1250, y 960…1145).
   Nach 30 Wochen ist es weg (`e3-11`), weil der Keller leer ist. Das Zielblatt hat an
   dieser Stelle Gespann, Fuhrmann, Hund, eine Frau mit Korb und zwei Kinder — dauerhaft.
3. Die 29,1 % Deckung (§2).

### IV · 1970 — `04-1970.jpg` gegen `e4-*`

**Wo das Spiel schlägt:** das Mauerfragment mit **einem** Rundturm in einer Grünanlage mit
Bänken und Wegen (x 180…480, y 280…560) ist genauer und ruhiger gebaut als im Zielblatt.
Das gläserne Sudhaus mit sichtbaren Kupferkesseln (x 700…1010, y 700…900) ist ein Motiv, das
dem Zielblatt ganz fehlt. Der alte Ziegelschornstein steht und raucht nicht — richtig.
Fahrleitung auf Masten, Bahnsteig, Gegnerwerk mit Tanks: alle da.

**Wo das Zielblatt gewinnt, und hier am deutlichsten:**

1. **Auf der Asphaltstraße fährt niemand.** Im untersten Sechstel (y 1280…1536) trägt das
   Zielblatt drei Autos — einen cremefarbenen Käfer links, eine rote Limousine in der Mitte,
   eine helle rechts daneben. Im Spiel steht dort (`schnitte/e4-unten.png`) **kein einziges
   Fahrzeug**: leerer Asphalt mit Mittelstreifen, Fachwerkdächer, der Fluss. Auf dem ganzen
   Bildschirm zählt das Spiel **zwei** Personenwagen; das Zielblatt trägt sieben plus einen
   Stadtbus.
2. **Zwei gekaufte Hofbauten stehen in der Stadt und begraben sie.** In dieser Partie wurden
   nur vier Dinge gekauft — Fahrzeugwaage, **Verwaltungsbau**, **Mälzereiturm**, Neues
   Sudhaus — und zwei davon landen jenseits der Hofmauer:
   * Der **Verwaltungsbau** (blauer Glasbau, x 1420…1610, y 675…930) hängt am Ort `tor`
     (45 % / 64 %) mit `dx: 8` und steht damit acht Prozent **rechts vom eigenen Hoftor**,
     auf der Stadtstraße. Vor dem Kauf (`schnitte/e4-markt-roh.png`) liegen dort das
     Vordach und die Zapfsäule der **Tankstelle**; danach (`schnitte/e4-markt-spiel.png`)
     sind sie weg.
   * Der **Mälzereiturm** (roter Ziegelturm mit Schieferpyramide, x 1050…1340, y 600…745)
     hängt am Ort `malzboden` (44 % / 42 %) — tief in der Stadt, weit hinter der Hofmauer.
     Er begräbt eine Ladenzeile und einen dort geparkten roten Wagen.
   Im Zielblatt bleibt die Brauerei geschlossen im linken Drittel; die Stadt gehört der Stadt.
3. **Das dritte leere Schild.** Auf der Hofmauer rechts vom Tor (x 1145…1340, y 990…1090)
   liegt eine große cremefarbene Tafel, in 1884 mit „BRAUHAUS ZUM ANKER" beschriftet, in
   1970 **leer**. Der Hausname steht stattdessen weit links auf einem kleinen weißen
   Rechteck (x 475…675, y 915…965) in schwarzer Groteske, flach und ohne Rahmen. Das
   Zielblatt hat an der Dachkante ein großes Leuchtschild mit cremefarbenen Versalien.
4. **Die einzigen zwei Menschen im Vordergrund tragen Mittelalterkleidung.** Unter der gelben
   Marktplane links unten (x 240…600, y 1400…1536) stehen dieselben zwei Figuren in langen
   Gewändern wie 1350. — **Das ist kein Punkt gegen das Spiel: das Zielblatt hat dieselbe
   Plane und dieselben Figuren.** Beide sind hier gleich schwach, und deshalb entscheidet es
   nichts. Es steht hier, damit niemand es später für einen Fund hält.

---

## 4 · Zwei Befunde quer über alle vier Epochen

### 4.1 Die Oberfläche ist nicht in derselben Hand gezeichnet wie das Bild

Die Zielblätter sind durchgehend *„crisp dark-brown ink outlines of varying weight, warm flat
colour"*. Die Kopfleiste des Zielblatts folgt dem: ein geschnitztes Holzbrett mit
Tuschekontur und Maserung.

Die Kopfleiste des Spiels (`schnitte/e1-kopf-spiel.png`, x 560…2180, y 30…105) hat **keine
einzige Kontur**: ein flach verlaufender brauner Balken mit gleichmäßig gerundeten Ecken,
darin sieben Felder als abgerundete Rechtecke, Schrift eine gesperrte Serifenversalie. Sie
ist sauber und gut lesbar — und sie liest sich als Webleiste, nicht als gezeichneter Teil
des Bildes. Dasselbe gilt für alle Bretter, Karten und Zettel.

Dazu kommen die **schwebenden Marken**: kleine helle Rechtecke ohne jeden Umriss, verteilt
über Felder, Fluss und Weinberg. Gemessen mit `bauorte.mjs` liegen in `ebene-marken`
**62 / 67 / 63 / 66 Textknoten** (Epoche I–IV), und ein Teil davon sitzt frei in der
Landschaft, nicht in einem Brett. Drei mit exakter Lage:

| Marke | Epoche | Rechteck | worauf sie liegt |
|---|---|---|---|
| „OCH · PAC / ablösen 588 fl" | 1600 | x 1405…1506, y 463…503 | Dächer der Altstadt |
| „wirbt · noch 6 Wo." | 1600 | x 2376…2578, y 432…453 | Weinbergterrassen |
| „BHF · LIS / ablösen 58.320 DM" | 1970 | x 2561…2680, y 263…303 | Bahndamm und offenes Feld |

Sie sitzen im Mittelband, also mitten im Bild, und keine trägt eine Kontur.

### 4.2 Beschriftungen, die nicht ganz dastehen

Geprüft wurde nicht Überlauf, sondern **Vollständigkeit** — bereinigt um die Rollkästen aus
§2. Auf der Entwurfsleinwand 2752 × 1536, nicht auf einem kleinen Schirm:

| Epoche | echte Schnitte | schwerster Fall |
|---|---|---|
| 1350 | 2 | `.gg-bandzeile .was`: 1102 px Text in 731 px Kasten |
| 1600 | 2 | `.fu-notsud-zeile`: 571 in 482 |
| 1884 | 1 | `.gg-bandzeile .was`: 879 in 731 |
| 1970 | 5 | `.gg-bandzeile .was`: **1810 in 731 — 60 % des Satzes fehlt** |

`stil/gegner.css:414` gibt `.gg-bandzeile .was` `overflow:hidden; text-overflow:ellipsis;
white-space:nowrap`. Das ist das Band **OHNE DICH GESCHEHEN** — ausgerechnet der Ort, an dem
das Spiel erzählt, was der Gegner getan hat, während man woanders hinsah. Es läuft nirgends
über und fehlt trotzdem.

Zusätzlich in 1970: ein Geldbetrag **„2.642.560 DM"** in einem Kasten von 109 px bei 130 px
Textbreite, **ohne** Auslassungspunkte — hier werden Ziffern abgeschnitten, nicht Wörter.
Die Stelle ist eindeutig: `bauorte.mjs` misst die Kassenspalte der Gegnerkarte als
`«1.193.110 DM» x2092..2201 (109×20)`. **Ab acht Ziffern verliert die Kasse des Gegners
Stellen.** Eine falsch gelesene Zahl ist schlimmer als ein gekürzter Satz.

### 4.3 Bretter, die einander zerschneiden

In `e1-30-gespielt-frei.png` liegen zwei Bretter verschiedener Stücke übereinander und
kürzen sich gegenseitig:

* Die Überschrift des Standbuchs (x 40…1210, y 230…290) liest sich als **„…dtbuch · II.
  Hand"**, weil der Reiter DAS ERBE die ersten drei Buchstaben verdeckt. Darüber schneidet
  die BAUHOF-Leiste quer durch den Blattkopf.
* Die Karte BRAUHAUS ZUM ADLER (x 1965…2370, y 585…745) trägt drei Zahlen — Züge, Kasse,
  sein Preis. Das Brett DER SUD legt sich mit seiner Oberkante auf y ≈ 700 und **schneidet
  die Ziffernreihe waagerecht in der Mitte durch**; lesbar bleiben nur die oberen Hälften.

---

## 5 · Urteil je Epoche

### I · 1350 — **Zielbild gewinnt** (knapp)

Die gemalte Welt gewinnt: Braustelle, Ziehbrunnen mit zwei Frauen und die scharfe Schrift
auf dem Torschild sind besser als im Zielblatt. Der **Bildschirm** gibt es wieder her —
29,0 % Kästen, 51,7 % im obersten Sechstel, dazu ein Hof, der an seiner Obergrenze zur
Hälfte leer bleibt und dessen Dächer ineinanderlaufen. **Was hier entscheidet, ist nicht der
Zeichner, sondern der Setzer.**

### II · 1600 — **Zielbild gewinnt**

Dieselbe Deckung, und dazu zwei Dinge, die das Zielblatt richtig macht und das Spiel nicht:
Der Marktbrunnen samt Hund, Fuhrwerk und drei Marktleuten verschwindet unter einem gekauften
Hofbau, und der Gegner jenseits des Flusses hat im Bild **keinen Namen**. Das gute Zweigespann
am Tor wiegt das nicht auf.

### III · 1884 — **unentschieden**

**Die einzige Epoche, in der ich das Zielblatt nicht mehr wählen würde, wenn nur die Welt zu
sehen wäre.** Schornstein mit Kranzgesims und Steigleiter, drei genietete Gärtanks auf einem
Laufsteg, Eiskeller mit Eisblöcken, Mälzereiturm, Maschinenhaus — alles reicher als im
Zielblatt, und „GEGR. **1350**" steht richtig, wo das Zielblatt sich irrt.

Was es zurückholt: 29,1 % Kästen, **zwei leere cremefarbene Tafeln** im Bild, und ein
Vordergrund, der sein Gespann verliert, sobald man spielt. Keines von beiden dominiert.

*Was es kippen würde:* Werden die zwei Tafeln beschriftet und fällt die Deckung unter 15 %,
**gewinnt hier das Spiel.** Bleibt beides, wie es ist, kippt es beim nächsten Kritiker
ebenso gut zum Zielblatt.

### IV · 1970 — **Zielbild gewinnt**

Am deutlichsten von allen vieren, und aus dem Motiv der Epoche heraus: **auf der
Asphaltstraße mit Mittelstreifen fährt im Spiel niemand.** Dazu zwei gekaufte Hofbauten, die
in der Stadt stehen und die Tankstelle und eine Ladenzeile begraben, und ein drittes leeres
Schild auf der eigenen Hofmauer. Mauerfragment-Grünanlage und gläsernes Sudhaus sind besser
als im Zielblatt — sie stehen aber im oberen Bilddrittel, während das Zielblatt das untere
gewinnt.

### Wo das Spiel die Messlatte schlägt — zusammengezogen

*Ich kann nicht sagen, was „besser geworden" ist: ich habe kein früheres Urteil und keinen
früheren Stand gesehen, mit Absicht. Ich kann sagen, wo das Spiel heute vor dem Zielblatt
liegt.*

1. **Schrift.** Alle Beschriftungen im Bild sind echter, scharfer Text. Die Zielblätter
   tragen an denselben Stellen zerfallene Buchstabensuppe („GEGR. 1350" in 01, „CU NEHKER"
   in 05).
2. **Sachlich richtiger als die Latte.** „GEGR. 1350" gegen „GEGR. 1356" im 1884er Zielblatt.
3. **Industriedetail 1884.** Kranzgesims, Steigleiter, Nietreihen, Mannlöcher, Laufsteg,
   Eisblöcke, liegender Dampfkessel — nichts davon steht im Zielblatt.
4. **Maßstab.** Wo Menschen im Hof stehen, stimmen sie mit den Leuten der Platte überein
   (Brauerin ≈ Magd am Tor). Im Zielblatt sind die zwei Brauerinnen neben der Pfanne
   erkennbar zu groß.
5. **1970 Mauerfragment.** Ein Rundturm mit Mauerstumpf in einer Grünanlage mit Bänken und
   Wegen — genauer gebaut als im Zielblatt.
6. **Ein Motiv, das im Zielblatt fehlt:** das gläserne Sudhaus mit sichtbaren Kupferkesseln
   (1970, x 700…1010, y 700…900).
7. **Null Seitenfehler** in allen vier Epochen über 140 echte Mausklicks.

---

## 6 · Auflagen

Jede folgt aus einem Bildpunkt-Befund, der oben mit Koordinaten steht.

**A1 — Die Deckung im ruhigen Zustand halbieren.**
Gemessen: 29,0 / 29,5 / 29,1 / 29,5 % Kästen, oberstes Sechstel 51,7 / 52,2 / 53,1 / 54,0 %.
Ziel: **≤ 15 % gesamt und ≤ 25 % im obersten Sechstel** in allen vier Epochen, gleich nach
dem Laden. Gemessen wird mit dem Verfahren aus §2 (dieselbe Seite mit und ohne Kästen,
Bildpunkte zählen) — `werkbank/schuss/bild-w8/bauorte.mjs` + `deckung.mjs` tun das bereits.
*Der billigste Weg steht im Bild:* in jeder Epoche liegen im obersten Sechstel **acht
Reiterkacheln** (`stadt:reiter:*`) plus die Kachel `stadt:ortsmarken` als geschlossener
brauner Block bei x 37…810, y 120…350, dazu darunter die aufgeklappte BAUHOF-Lade
(x 20…1300, y 355…560). Zusammen rund **0,44 Mio Bildpunkte** — knapp das Dreifache der
gesamten Oberfläche eines Zielblatts (Leiste + WEITER-Tafel ≈ 0,16 Mio).

**A2 — Die schwebenden Marken bekommen eine Kontur oder einen Platz.**
`ebene-marken` trägt 62 / 67 / 63 / 66 Textknoten je Epoche; ein Teil davon liegt frei in
der Landschaft als flaches helles Rechteck ohne Umriss. Drei nachgemessene Beispiele:
„OCH · PAC / ablösen 588 fl" (1600, x 1405…1506, y 463…503, auf den Altstadtdächern),
„wirbt · noch 6 Wo." (1600, x 2376…2578, y 432…453, auf den Weinbergterrassen),
„BHF · LIS / ablösen 58.320 DM" (1970, x 2561…2680, y 263…303, auf dem Bahndamm).
Entweder sie werden gezeichnet wie das Bild (dunkelbraune Tuschekontur wechselnder Stärke,
wie das Torschild sie schon hat), oder sie ziehen an einen Rand. Beides ist zulässig; der
jetzige Zustand — flache Webkästchen auf dem Weinberg — nicht.

**A3 — Kein Brett darf ein anderes zerschneiden.**
Zwei nachgewiesene Fälle in `e1-30-gespielt-frei.png`: die Standbuch-Überschrift wird vom
Reiter DAS ERBE zu „…dtbuch · II. Hand" verkürzt (x 40…1210, y 230…290); das Brett DER SUD
schneidet die Zahlenzeile der Gegnerkarte BRAUHAUS ZUM ADLER waagerecht durch (x 1965…2370,
y ≈ 700). Verlangt ist eine nachprüfbare Regel — z. B. dass ein aufliegendes Blatt alle
Bretter darunter schließt — und ein Schuss, der zeigt, dass keine Überschrift und keine Zahl
mehr angeschnitten ist.

**A4 — Die drei leeren Tafeln füllen oder entfernen.**
Alle drei liegen in der Platte und werden nie beschriftet:
* 1884, Gegnerwerk jenseits des Flusses: x 2170…2320, y 480…525 → gehört „BRAUEREI ADLER".
* 1884, Bahnhofsdach: x 2610…2740, y 380…425 → gehört „BAHNHOF" (der Name hängt derzeit als
  eigener Zettel daneben in der Luft, x 2562…2667, y 490…511).
* 1970, eigene Hofmauer rechts vom Tor: x 1145…1340, y 990…1090 → in 1884 trägt dieselbe
  Tafel „BRAUHAUS ZUM ANKER", in 1970 ist sie leer.
Eine leere helle Tafel liest sich als unfertiges Bild, nicht als Schild.

**A5 — Der Gegner bekommt einen Namen im Bild.**
Das Zielblatt trägt „BRAUEREI ADLER" in 1600, 1884 und 1970 als gemaltes Schild am Gebäude
jenseits des Flusses. Das Spiel hat drei Ortsmarken (`stadt-daten.js:100–102`: ST. MICHAEL,
GASTHOF LINDENHOF, BAHNHOF ab Epoche III) und für den Gegner keine; sein Name steht nur auf
einer Karteikarte. Verlangt ist eine vierte Ortsmarke am Gegnerhof, mit dem Namen der
jeweiligen Epoche (BRAUSTATT ADLER · BRAUEREI ADLER · ADLER-BRÄU AG).

**A6 — Gekaufte Hofbauten dürfen nicht in der Stadt stehen.**
Drei nachgewiesene Fälle, alle an Ankern, die außerhalb der Hofmauer liegen:
* **Verwaltungsbau** (1970, `ort: 'tor'`, `dx: 8` → x 1420…1610, y 675…930) begräbt Vordach
  und Zapfsäule der Tankstelle. Vergleich: `schnitte/e4-markt-roh.png` gegen
  `schnitte/e4-markt-spiel.png`.
* **Mälzereiturm** (1970 und 1884, `ort: 'malzboden'` = 44 % / 42 % → x 1050…1340,
  y 600…745) steht mitten in der Stadt und begräbt eine Ladenzeile samt geparktem rotem
  Wagen.
* **Eine Fachwerkhalle mit großem Holzbottich** (1600, x 1130…1510, y 650…910 — nach
  Kaufliste die Gärbottiche) begräbt den **Marktbrunnen**, einen Hund, ein Pferdefuhrwerk
  und drei Marktleute. Vergleich: `schnitte/e2-hofrand-roh.png` gegen
  `schnitte/e2-hofrand.png`.
Die Regel aus `spiel/LIESMICH.md` gilt hier wörtlich: *„Was gebaut wird, darf umziehen."*
Der Ziehbrunnen darf nicht wandern — ein Verwaltungsbau und ein Mälzereiturm schon.

**A7 — Der Hof 1350 darf sich nicht stapeln, und seine linke Hälfte darf nicht leer bleiben.**
Bei `?bau=alle` (also an der Obergrenze, nicht aus Geldmangel): das strohgedeckte Dach des
Ochsenstalls (x 1040…1250, y 680…820) läuft über das Brauhausdach und verdeckt die
Steinpfeiler des Malzbodens (vorher frei bei x 1055…1390, y 570…880). Gleichzeitig bleibt
x 320…700, y 780…1120 leerer Boden. Verlangt: die Aufbauten so verteilen, dass zwischen je
zwei Dächern Hofboden sichtbar bleibt und der Malzboden auf Stelzen als solcher erkennbar
bleibt — er ist eines der drei Motive, die `zielbild/prompts/1350.txt` namentlich verlangt.

**A8 — 1970 braucht Verkehr.**
Zielblatt, unterstes Sechstel (y 1280…1536): drei Autos — cremefarbener Käfer links, rote
Limousine Mitte, helle rechts. Spiel: **null** (`schnitte/e4-unten.png`). Auf dem ganzen
Rahmen: Zielblatt sieben Wagen plus Stadtbus, Spiel zwei Wagen. Verlangt: mindestens drei
fahrende oder parkende Fahrzeuge auf der Asphaltstraße im untersten Drittel, in der Epoche,
die ohne sie nicht 1970 ist. *(Nebenbefund, der nicht gegen das Spiel zählt: die zwei
Figuren unter der Marktplane links unten tragen in 1970 noch Gewänder von 1350 — im
Zielblatt allerdings auch.)*

**A9 — Das Gespann am Hoftor darf nicht verschwinden, sobald gespielt wird.**
1884: beim Laden steht das Zweigespann mit Fuhrmann (x 960…1250, y 960…1145,
`e3-00-roh.png`), nach 30 Wochen ist es weg (`e3-11`). Ursache ist die Bedingung
`wenn: 'keller'` an `torfuhre` (`stadt-daten.js:428–432`): ein leerer Keller nimmt dem
Vordergrund seine einzige Bewegung. Das Zielblatt hat dort dauerhaft Gespann, Fuhrmann,
Hund, Frau mit Korb und zwei Kinder. Verlangt: eine Bedingung, die im gewöhnlichen Spiel
meistens wahr ist — oder ein zweites, unbedingtes Fuhrwerk auf der Straße.

**A10 — Zwei Schnitte schließen, die Inhalt kosten.**
* `.gg-bandzeile .was` (`stil/gegner.css:414`, `text-overflow: ellipsis`): in 1970 stehen
  **1810 px Text in einem 731 px breiten Kasten** — 60 % des Satzes fehlen, und zwar
  ausgerechnet im Band **OHNE DICH GESCHEHEN**, das erzählt, was der Gegner getan hat,
  während man woanders hinsah. Gemessen auf der Entwurfsleinwand 2752 × 1536, nicht auf einem
  kleinen Schirm. Zählung der echten Schnitte je Epoche: 2 / 2 / 1 / 5.
* Die Kassenspalte der Gegnerkarte ist 109 px breit (`bauorte.mjs`:
  `«1.193.110 DM» x2092..2201`). Bei 130 px Textbreite — „2.642.560 DM" — werden **Ziffern**
  abgeschnitten, ohne Auslassungspunkte. Eine falsch gelesene Zahl ist schlimmer als ein
  gekürzter Satz.

---

## 7 · Was an dieser Messung schwach ist

Damit niemand sie stärker zitiert, als sie ist:

1. **Eine Partie je Epoche, eine Saat (1350).** Kein zweiter Lauf, keine Prüfsummenkontrolle
   der Bilder gegeneinander. Die *abgeleiteten* Deckungszahlen sind allerdings in zwei
   unabhängigen Browsersitzungen auf die Zehntelstelle gleich herausgekommen (§2).
2. **Die 4 % des Zielblatts sind abgeschätzt, nicht gemessen** — im Container gibt es keinen
   JPEG-Dekoder außerhalb des Browsers. Die Größenordnung trägt das Urteil, die zweite
   Stelle nicht.
3. **30 Wochen sind kurz.** In 1350 reichte es an die Obergrenze (nachgewiesen mit
   `?bau=alle`), in 1970 wurden nur vier von sechs Bauten gekauft. Die Aufnahmen mit
   `?bau=alle` für 1600, 1884 und 1970 standen beim Schreiben noch in der Messfenster-Schlange
   (`kette.sh`); sie können A6 und A7 nur **verschärfen**, nicht entkräften, weil mehr Bauten
   mehr Stadt verdecken.
4. **Ich bin durch erlaubtes Material vorbelastet** — die drei Stellen stehen offen in §1.
5. **Die Vergleichsbogen** (`gegenueber.mjs`, Zielblatt und Spiel im selben Rechteck
   übereinander) waren beim Schreiben ebenfalls noch in der Schlange. Alle Aussagen oben
   stehen deshalb auf getrennt angesehenen Bildern und auf Ausschnitten in voller Auflösung
   (`werkbank/schuss/bild-w8/schnitte/`), nicht auf einer Gegenüberstellung im selben Bild.
