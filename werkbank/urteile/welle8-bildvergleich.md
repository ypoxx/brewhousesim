# Welle 8 · Der Bildvergleich — Urteil eines blinden Kritikers

**Eine Frage je Epoche: Gewinnt das Zielbild noch?**

| Epoche | Urteil |
|---|---|
| I · 1350 | **Zielbild gewinnt** — knapp, und aus einem Grund, der nicht am Gemalten liegt |
| II · 1600 | **Zielbild gewinnt** |
| III · 1884 | **unentschieden** — die gemalte Welt schlägt das Zielblatt, der Bildschirm gibt es wieder her |
| IV · 1970 | **Zielbild gewinnt** |

*(wird nach der letzten Messung bestätigt oder berichtigt)*

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
  (x 780…1010, y 1030…1180) eine vollständige Braustelle: Maischbottich, offene Pfanne auf
  einem kniehohen Steinring über offenem Feuer, Kühlschiff, Holzstoß, **fünf** arbeitende
  Figuren. Sperrlistenfest: kein Deckel, kein Helm, kein Schwanenhals.
* **Der Ziehbrunnen** (x 480…640, y 830…960) hat im Spiel **zwei Frauen** — eine am Kranz,
  eine mit Schulterjoch. Im Zielblatt steht der Brunnen leer.
* **Die Schrift.** „BRAUHAUS ⚓ ZUM ANKER / GEGR. 1350" steht im Spiel als scharfer, echter
  Text auf dem Torschild. Im Zielblatt ist die zweite Zeile zu unlesbarem Grau zerfallen.

**Wo das Zielblatt gewinnt:**

1. **Der Hof stapelt sich, statt sich zu verteilen.** Nach fünf Käufen liegen im Spiel vier
   Dächer ineinander: ein strohgelbes Dach (x 880…1240, y 690…830) schneidet quer über das
   Schindeldach des Brauhauses und über den **Malzboden auf Stelzen**, der in der Aufnahme
   vor den Käufen (`e1-01`) noch frei und lesbar stand und danach nicht mehr zu erkennen ist.
   Im Zielblatt steht jedes Hofstück für sich, mit sichtbarem Hofboden dazwischen.
2. **Die linke Hälfte des ummauerten Hofes bleibt leer.** x 320…700, y 780…1120 ist im
   Spiel unbespielte Wiese und Erde. Im Zielblatt liegt dort ein Stapel von rund zehn
   Fässern und ein Bohlentisch.
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
   (`e2-01-roh-nackt`, Ausschnitt `schnitte/e2-hofrand-roh.png`) liegt bei x 1330…1500,
   y 640…790 der **Marktbrunnen** mit Wasserschale, daneben ein Hund, ein Pferdefuhrwerk und
   drei Marktleute — alle **außerhalb** der Hofmauer, auf dem Platz der Stadt. Nach den
   Käufen (`schnitte/e2-hofrand.png`) steht dort eine offene Fachwerkhalle mit großem
   Holzbottich und Leiter (x 1130…1510, y 650…910) und **nichts davon ist mehr zu sehen**.
   Gekauft wurden in dieser Partie: Gärbottiche, Kontor, Hopfenlager, Waschhaus,
   Pferdestall, Rossmühle. Im Zielblatt bleibt der Marktbrunnen frei und der Hof bleibt
   hinter seiner Mauer.
2. **„BRAUEREI ADLER" fehlt als Schild im Bild.** Das Zielblatt trägt jenseits des Flusses
   ein großes ockerfarbenes Brauhaus mit gemaltem Schild „BRAUEREI ADLER". Das Spiel zeichnet
   dort zwar einen Gegnerhof (x 2090…2220, y 390…540, in `ebene-marken`, in der vollen
   Aufnahme `schnitte/e2-adler-voll.png` sichtbar), aber **ohne jede Beschriftung**. Der Name
   „BRAUSTATT ADLER" steht ausschließlich auf einer schwebenden Karteikarte der
   Bedienoberfläche. Die Ortsmarken des Spiels sind genau drei — ST. MICHAEL, GASTHOF
   LINDENHOF, BAHNHOF (ab Epoche III); der Gegner hat keine.
3. **Zwei graue Schaltflächen mitten in der Landschaft.** Unter dem Gegnerhof, bei
   x 2110…2185, y 545…585, sitzen zwei schlichte hellgraue Quadrate mit Haus- und
   Sternsymbol. Sie sind nicht gezeichnet, sie sind Bedienfläche, und sie liegen auf dem
   Weinberg.

### III · 1884 — `03-1884.jpg` gegen `e3-*`

**Hier schlägt die gemalte Welt das Zielblatt, und das gehört ausdrücklich gesagt:**

* **Der Schornstein** (x 500…620, y 175…870) ist höher, hat ein gemauertes Kranzgesims und
  eine eiserne Steigleiter; die Rauchfahne steht. Das Zielblatt hat einen glatten Rohrstumpf.
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

Dazu kommen die **schwebenden Marken**: in 1600 zähle ich elf, in 1884 zwölf, in 1970 zehn
kleine helle Rechtecke („Fass in die Lade", „OCH · PAC · ablösen 588 fl", „wirbt · noch 6
Wo.", „Zuschuss in Bier", „BHF · LIS", …), verteilt über Felder, Fluss und Weinberg. Sie
sitzen im Mittelband, also mitten im Bild, und keine trägt eine Kontur.

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

---

## 5 · Urteil

*(§5 und §6 folgen nach der letzten Messung)*
