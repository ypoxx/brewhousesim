# Welle 7 — Latte 1, der Blindvergleich

**Fremdes Auge, Bildvergleich. Messstand `08baf32`, Hafen 8905, Saat 1350.**
Gegenprobe `/.messstand-marke` → `08baf32`. Aufnahmen 2752×1536, dieselbe Fläche wie
die Zielbilder.

Gelesen wurden: `gauntlet/MESSLATTE.md`, `zielbild/README.md`, der Quelltext des Spiels.
**Nicht** gelesen: irgendetwas unter `werkbank/urteile/`, `werkbank/LAUFENDER-AUFTRAG.md`,
keine git-Historie. Das Urteil steht auf Pixeln, nicht auf Berichten.

## Die Aufnahmen

Je Epoche zwei Zustände: gleich nach dem Laden, und nach ~20 gespielten Wochen mit
echten Mausklicks (`p.mouse.down/up` auf die tatsächliche Knopffläche), damit gekaufte
Hofbauten im Bild stehen. Skript: `werkbank/schuss/bild-w7/spielen.mjs`.
Bilder liegen in `werkbank/schuss/bild-w7/` und sind nicht versioniert.

| Datei | md5 |
|---|---|
| `spiel-e1-laden.png` | `b07ea3e0544238503ff33a7ff555ab78` |
| `spiel-e1-gespielt.png` | `cf3cfabdea0450d6ddd72704d3589c66` |
| `spiel-e2-laden.png` | `db4f249dd285b95ec7853c0ab6f35269` |
| `spiel-e3-laden.png` | `421bd897d306cc044e8b6f43fb538b2a` |
| `spiel-e4-laden.png` | `343784f62b86559b78dcbcf342fbd9c0` |
| `zielbild/01-1350.jpg` | `f56bd4c1b96dfce34ea7a4db11c55653` |
| `zielbild/02-1600.jpg` | `f40f7f4fd5635e4ab677b271e0718611` |
| `zielbild/03-1884.jpg` | `136c44b4480190e2d326af05b934ddcd` |
| `zielbild/04-1970.jpg` | `0ae9bc55768f9536d1c3c08da7c9d276` |

Klickprotokoll 1350 (33 Klicks, keine Seitenfehler): Grutkammer −13 Pf, Gärbottiche
−15 Pf, Gewölbekeller −21 Pf, Ochsenstall −18 Pf gekauft; Rest WEITER bis Woche 30/30.
Küferei blieb ungekauft — die Kasse trug sie nicht.

| `spiel-e2-gespielt.png` | `4ab0b6ad3288856365c0e42f1b95b64e` |
| `spiel-e3-gespielt.png` | `c65a5f5208153afd8d325befffba9edd` |
| `spiel-e4-gespielt.png` | `e0a460490bd14c04a70bf4a2f152cd79` |

Klickprotokolle der übrigen drei, alle ohne Seitenfehler, alle bis Woche 21/30:
1600 — Waschhaus 96 fl, Pferdestall 132 fl, Kontor 114 fl, Hopfenlager 120 fl (25 Klicks);
1884 — Flaschenhalle 3.700 M, Mälzereiturm 3.145 M, Pferdestall 1.628 M, Kontor 1.406 M,
Hopfenlager 1.480 M, danach meldet die Lade „Der Hof ist für diese Zeit fertig gebaut"
(25 Klicks); 1970 — Fahrzeugwaage 9.570 DM, Mälzereiturm 14.790 DM, Verwaltungsbau
15.660 DM (23 Klicks). Zur Gegenprobe habe ich jede Epoche zusätzlich mit `bau=alle`
gerendert, damit kein Fund an meiner Kaufreihenfolge hängt.

Die Aufnahmen der Epochen 2–4 liefen sequenziell durch
`werkbank/schuss/aufsicht/messfenster.sh` und haben hinter den 400-Wochen-Läufen der
Aufsicht gewartet; parallel gemessen wurde nicht. Die Marke `/.messstand-marke` sagte vor
und nach allen Aufnahmen `08baf32`.

## Was zuerst auffällt, in allen vier Epochen gleich

**Die Bühne ist gut. Was darüber liegt, ist das Problem.**

Wenn man die drei Ebenen `ebene-marken`, `ebene-kopf`, `ebene-blatt` unsichtbar
schaltet und sonst nichts ändert, steht ein Bild da, das dem Zielbild in Kamera, Ort,
Farbe und Strich sehr nahe kommt — in 1970 stellenweise besser (die Mauerruine liegt
dort in einer Grünanlage mit Bänken, der Schornstein raucht nicht mehr, die Straße hat
Mittelstreifen und Autos). Das ist gemessen, nicht geschätzt:

| | UI deckt die Fläche | unteres Drittel | unteres Sechstel |
|---|---|---|---|
| 1350 | **28,0 %** | 41,4 % | **61,0 %** |
| 1600 | 28,4 % | 40,9 % | 59,8 % |
| 1884 | 27,2 % | 41,7 % | 60,2 % |
| 1970 | 28,0 % | 43,0 % | **59,9 %** |

*(Bildpunktvergleich derselben Seite mit und ohne die drei Ebenen, Schwelle 18.)*

**Das untere Sechstel ist die teuerste Stelle.** Genau dort trägt jedes Zielblatt seinen
Vordergrund: 1350 der Marktstand mit gelber Plane, der Pferdefuhrwerk mit Fässern, die
Gasse; 1970 die **Asphaltstraße mit Mittelstreifen, Käfer, Limousinen, Laterne** — das,
was die Epoche IV im README ausmacht („Autos auf Asphalt"). Im Spiel liegen dort zwei
durchgehende braune Bänder (Reiterzeile + BAUHOF-Lade), die 60 % dieses Streifens
zudecken. Die Autos sind auf der Platte gemalt und im Spiel teilweise zu sehen — der
Straßenrand davor ist es nicht.

## Der Ort über 620 Jahre — das hält

Die härteste Einzelforderung ist **erfüllt**. Flussbogen, Steinbrücke unten rechts,
Mühlensteg oben rechts, `ST. MICHAEL`, `GASTHOF LINDENHOF`, die Hügelkette und die
Kameraposition stehen in allen vier Epochen an derselben Stelle und wachsen richtig mit:
Holzsteg 1350 → Steinbogen ab 1600 an derselben Stelle, Mühle 1350/1600 → Brauerei Adler
1884 → Adler-Bräu mit Stahltanks 1970, Bahn und Bahnhof ab 1884, Fahrleitung 1970,
Stadtmauer geschlossen 1350 → Ruine/Fragment in der Grünanlage 1970. Das ist eine echte
Leistung und wird von keinem der Funde unten in Frage gestellt.

Nachgemessen, weil der erste Eindruck etwas anderes sagte: **Kamera und Ort stimmen
bildpunktgenau.** Der Kirchturm St. Michael liegt in `03-1884.jpg` und im laufenden Spiel
im selben Kasten (1450,80–1850,800) an derselben Stelle und in derselben Höhe; der
Scheitel der Hofmauer liegt im Zielbild bei (838|1242), im Spiel bei (838|1231). Ein
Verdacht auf verschobene Kamera hat sich damit **nicht** bestätigt.

Ebenfalls geprüft und **nicht** bestätigt: „etwas steht auf der Mauer". Ich habe die
Mauerlinie aus `stadt-daten.js:168` genommen (Scheitel 823|1205, links −0,49, rechts
−0,45) und je Spalte die unterste veränderte Zeile zwischen `bau=keine` und `bau=alle`
dagegen gerechnet. Die Unterschreitungen liegen nur dort, wo der Quelltext sie selbst als
gewollt verzeichnet (Kontor vor dem Tor, Hopfenlager in der Häuserzeile, Stall/Dock in
der Tordurchfahrt). Kein Hofbau steht auf dem Mauerkopf.

## Was der Hof NICHT trägt — der teuerste Fund, in allen vier Epochen

Ich habe je Epoche mit `bau=alle` gerendert, also mit dem **vollen** Hof, damit es
kein Vorwurf gegen mein Spielprotokoll ist. Ergebnis, in allen vier Epochen dasselbe:

**Die vordere Hälfte des ummauerten Hofes bleibt leer.** Zwischen der Bauzeile
(Fußpunkte in 60–73,5 % der Bühnenhöhe) und der Mauerkante (Scheitel 78,5 %) liegt ein
Streifen blanker Boden über die ganze Hofbreite. Genau dort trägt **jedes** Zielblatt
seine Fracht:

| | Zielbild trägt dort | Spiel trägt dort |
|---|---|---|
| 1350 | 14 liegende Fässer in zwei Reihen, Bank, Trog | Gras, Pfütze, sonst nichts |
| 1600 | zwei Fassreihen à 6, Handkarre mit Fass, **vier Männer, die Fässer rollen** | leerer Pflasterhof |
| 1884 | ~20 Lagerfässer in zwei Stapeln, Handkarre, **drei Arbeiter** | leerer Vorplatz, ein Schlitten mit zwei Eisblöcken |
| 1970 | Kastenstapel bis an die Mauer, PKW am Bordstein | leerer Beton |

**Und der Torwagen fehlt.** In 1350, 1600 und 1884 zieht im Zielbild ein zweispänniger
Fuhrwagen mit Fässern aus dem Hoftor — dasselbe Gespann an derselben Stelle, das dritte
Zeichen des durchlaufenden Ortes neben Fluss und Kirche. Im Spiel steht in 1350 ein
Ochsenkarren vor dem Tor; in **1600 und 1884 ist das Tor leer**, in 1970 fährt nichts
aus. Was das kostet: der Hof sieht in drei von vier Epochen aus, als arbeite dort
niemand. Im Zielbild arbeiten in jedem Blatt drei bis fünf Leute im Hof, im Spiel sind
es zwei (die Brauerinnen bzw. die Magd am Brunnen) — der Rest der Fläche ist Kulisse.

## Ein leeres Schild mitten im Bild

`BRAUEREI ADLER` steht im Zielbild 1600, 1884 und 1970 **auf dem Haus** des Gegners.
Im Spiel trägt dieses Haus in 1884 eine **große, leere cremefarbene Tafel**
(um 2 080|900, gut sichtbar), in 1600 und 1970 gar keine; der Name des Gegners steht
nur in einer schwebenden weißen Auskunftskarte darunter. Eine leere Tafel in der
Bildmitte liest sich als nicht fertiges Bildteil — und ausgerechnet dort, wo das
Zielbild den Gegner benennt.

## Das Hausschild — nur in 1350, und dort schwer

Das Schild `BRAUHAUS ZUM ANKER · GEGR. 1350` ist der Gegenstand des ganzen Bildes. Ich
habe seinen Kasten aus dem DOM geholt und in Bildpunkten nachgemessen, wieviel davon
die UI zudeckt (Vergleich der laufenden Seite mit derselben Seite ohne die drei Ebenen):

| Epoche | Schild bei | nach dem Laden | nach ~20 Wochen |
|---|---|---|---|
| **1350** | (1330\|957) 175×99 | **65,7 %** | **75,6 %** |
| 1600 | (1132\|888) 217×116 | 0,0 % | 8,1 % |
| 1884 | (1258\|957) 228×117 | 0,0 % | 0,0 % |
| 1970 | (470\|904) 207×117 | 0,0 % | 0,8 % |

In 1350 liegt der Kasten `DER SUD · 1350` darauf. Sichtbar bleibt der untere Rand mit
`GEGR. 1350`; die beiden Zeilen mit dem Namen und der Anker sind weg. Das ist kein
Randfall: es ist der Startzustand.

## Textkästen, die einander zerschneiden

Der DOM meldet null abgeschnittene Knoten und fast keine überlappenden Kästen — die
Überlappungen entstehen erst beim Zeichnen, zwischen Geschwistern und zwischen UI und
Kulisse, und sind deshalb nur im Bild zu sehen. Gefunden habe ich sie in drei von vier
Epochen, und immer erst im **bespielten** Zustand:

**1600, Woche 21, Kasten `DER SUD · 1600` bei (1355\|780)–(1725\|1040).** Der Kasten trägt
eine Zeile mehr, als er hoch ist. Vier Reihen liegen übereinander:
- Unterzeile „Rein nach dem Gebot · Obergärig, warm geführt" — Unterlängen abgeschnitten
  von „höchstens Braunbier";
- grüne Marke „lässt Märzenbier zu" — **mittig durchschnitten** vom Knopf „Mit Hafer und
  Wicke gestreckt";
- Marke „nur Schankbier" — **mittig durchschnitten** vom Satz „Weizen aus dem Kornhaus,
  mit Brief 180 fl";
- derselbe Satz läuft hinter der Marke durch, „Weizen aus dem Kornhaus" ist halb verdeckt.

Nach dem Laden ist der Kasten sauber. Es ist also nichts, was ein Bau-Bericht zeigen
würde — nur ein bespieltes Bild.

**1970, Woche 21, rechts, Fläche (1950\|700)–(2752\|1230).** Fünf Textstellen zerschneiden
einander auf 800×530 Bildpunkten:
- im Kasten `NORDSTERN-GRUPPE` liegt das Wappen auf der eigenen Kennzahl, „20 / ZÜGE"
  ist halb hinter dem Schild;
- ein grauer LKW-Bildstempel schwebt frei über der Flussböschung, sein Merkzettel
  „Adler → Brückenwirt" wird vom Kartenrand abgeschnitten;
- „frei geworden" ist von der Marke `FAE` in der Mitte durchtrennt („frei gewor" + Marke);
- die Zeile „50.000 DM für ein Viertel des Hauses · Antwort binnen 7 Wochen, dann nimmt
  sie" ist von der Marke `BRU` durchschlagen und unten vom Band `DAS ERBE` abgeschnitten;
- das Band `DAS ERBE` ist am linken Rand angeschnitten („ge ·… −3.269 DM").

**1970, am Hoftor bei (1150\|1030).** Die rote Ankertafel des Hauses ist **über** zwei UI-
Karten gezeichnet und schneidet deren Text: aus `HIR · EXK / ablösen 70.200 DM` bleibt
„…EXK / …70.200 DM", aus `Zuschuss in Bier` bleibt „s in Bier". Kulisse und Schrift liegen
in derselben Ebene und hacken einander ab.

**1970, Kasten auf Kasten, bei (1470\|980).** Die Karte `DER ANKER · RUF 32` liegt auf der
untersten Zeile des Kastens `DER SUD · 1970` und schneidet sie waagerecht mitten durch die
Buchstaben: von „Kieselgurfilter … 26.000 DM / lässt Exportbier zu" bleiben nur die oberen
Hälften der Zeichen stehen.

**1350, unten rechts.** Der **Holzsteg** — im README eine der Konstanten des Ortes — wird
von drei waagerechten Bändern (`DAS ERBE`, `UMKÄMPFT …`, `nächster Zug: …`) in drei
Stücke geschnitten. Der Steg ist da und steht richtig; man sieht ihn nur nicht mehr am
Stück.

**1884** ist die einzige Epoche, in der ich nichts dieser Art gefunden habe: der Kasten
`DER SUD · 1884` sitzt sauber, die Karten am Bahnhof überlappen einander nur an den Rändern.

## Ein Bau steckt in einem anderen — 1970, Fahrzeugwaage

Der schwerste Einzelfund der Sorte „etwas mitten in etwas anderem", und er trifft den
**billigsten Bau der Epoche** (Fahrzeugwaage 9.570 DM gegen 86.000 DM Barschaft — fast
jede Partie kauft ihn in den ersten Wochen; meine hat es in Woche 1 getan).

Bei (560\|930)–(1120\|1180):
- die obere Kante des Waagedecks **schneidet einen Palettenstapel roter Kästen** in der
  Mitte durch; die Kästen dahinter verschwinden unter dem Deck, obwohl sie in der
  Bodenebene davor liegen;
- die linke Auffahrt beginnt **über** einer Palette, deren vordere Hälfte unter dem
  Rampenblech verschwindet;
- **das Waagehäuschen steht im Lastwagen**: seine rechte Wand geht durch das
  Führerhaus, Windschutzscheibe und Tür des Wagens treten genau an der Häuschenecke
  wieder hervor, und das Vorderrad liegt hinter der Rampenkante.

Das ist im bespielten Bild zu sehen (`spiel-e4-gespielt.png`) und ebenso mit `bau=alle`
(`w-alle-4.png`) — also kein Zufall meiner Klickfolge.

---

# DIE URTEILE

## Epoche I — 1350

Der Hof trägt nach 30 Wochen mehr als das Zielblatt: Grutkammer, Gärbottiche,
Gewölbekeller, Ochsenstall mit Karren, Ziehbrunnen, Fassschuppen, offene Pfanne über
offenem Feuer, zwei Brauerinnen. Der Ort stimmt. Und trotzdem: **das Haus, um das es
geht, hat keinen Namen mehr** — 76 % des Schildes liegen unter dem Sud-Kasten, der Steg
ist dreigeteilt, 61 % des unteren Sechstels (Marktplane, Fuhrwerk, Gasse) liegen unter
zwei braunen Balken. Nebenbei: die Braupfanne steht mit dem Feuerring **in der
Hofpfütze** der Platte — ein offenes Feuer im Wasser.

> ### DAS ZIELBILD GEWINNT
> **Damit es kippt:** den Kasten `DER SUD` in 1350 vom Hausschild wegrücken (er darf
> überall hin, nur nicht auf (1330\|957)–(1505\|1056)), die drei Bänder unten rechts vom
> Holzsteg wegnehmen, und die Braupfanne einen Schritt aus der Pfütze setzen.

## Epoche II — 1600

Die schwächste der vier. Der Kasten `DER SUD · 1600` zeichnet nach 21 Wochen vier
Textreihen durcheinander. Und der Hof: selbst mit `bau=alle` bleibt seine **ganze vordere
Hälfte blanker Pflasterhof**, während das Zielblatt dort zwei Fassreihen à sechs, eine
Handkarre mit Fass und **vier Männer, die Fässer rollen** trägt; das Tor ist leer, wo im
Zielbild das Zweigespann mit der Fassladung herausfährt. Der Marktplatz der Platte ist
dagegen ausgezeichnet — Brunnen, Stände, Volk, Hunde — das Können ist da, es ist nur
nicht im Hof.

> ### DAS ZIELBILD GEWINNT
> **Damit es kippt:** den Sud-Kasten so hoch machen, wie sein Inhalt ist, und in die
> vordere Hofhälfte legen, was das Zielbild dort hat — liegende Fassreihen, zwei bis drei
> arbeitende Leute und ein Gespann im Tor, das mit der Menge im Keller wächst.

## Epoche III — 1884

Hier ist es eng. Der Hof ist dicht und schön: Schornstein mit Rauch, Kesselhaus mit
Dampftrommel, Flaschenhalle mit Oberlicht, Mälzereiturm, Gärtanks, Eiskeller mit zwei
Eisblöcken auf dem Schlitten, Brunnen mit Magd, Fassstapel, Schild frei und lesbar. Kein
zerschnittener Text. Gegen den Sieg stehen drei Dinge: der **leere Vorplatz** (im
Zielbild ~20 Lagerfässer, eine Handkarre und drei Arbeiter), das **leere Tor** (im
Zielbild fährt das Gespann heraus), und die **große leere Tafel** am Haus des Gegners bei
(2080\|900), wo das Zielbild `BRAUEREI ADLER` schreibt.

> ### UNENTSCHIEDEN
> **Damit es kippt:** `BRAUEREI ADLER` auf die leere Tafel schreiben und den Vorplatz mit
> dem füllen, was ohnehin schon gebraut ist — Lagerfässer, die mit dem Keller wachsen,
> und ein Gespann im Tor.

## Epoche IV — 1970

Die Platte ist die beste der vier und stellenweise besser als das Zielblatt: die
Mauerruine liegt in einer Grünanlage mit Bänken, der Schornstein raucht nicht mehr,
die Straße hat Mittelstreifen, Bus, Tankstelle, Laternen. Dagegen steht der schwerste
Bau-Fehler des Laufs — die **Fahrzeugwaage schneidet durch den Kastenstapel und ihr
Häuschen steht im Lastwagen** — und rechts ein Feld von fünf einander zerschneidenden
Textstellen, dazu die Ankertafel, die zwei Karten den Anfang abhackt.

> ### DAS ZIELBILD GEWINNT
> **Damit es kippt:** die Fahrzeugwaage aus dem Kastenlager und aus dem Lastwagen
> herausrücken (sie braucht einen eigenen freien Platz an der Ausfahrt), und rechts die
> Marken (`FAE`, `BRU`) und Bänder so stapeln, dass keine über fremdem Text liegt.

---

# ALS GANZES: DAS ZIELBILD GEWINNT

Drei zu null bei einem Unentschieden. **Aber der Abstand ist nicht mehr der von Runde 1.**

Der Ort steht: derselbe Flussbogen, dieselbe Brücke, dieselbe Kirche, dieselbe Kamera,
620 Jahre lang, und die Stadt wächst richtig darüber. Das ist die härteste
Einzelforderung des Auftrags, und sie ist erfüllt. Die Bühne verliert **nicht** gegen die
Zielbilder — in 1884 und 1970 verliert sie gar nicht.

**Was verliert, ist alles, was über der Bühne liegt.** 28 % der Fläche, 60 % des unteren
Sechstels, und drei Sorten Fehler, die alle dasselbe sagen: es gibt keine Ordnung, die
festlegt, was über was liegen darf. Deshalb liegt ein Kasten auf dem Hausschild, eine
Kulissentafel auf zwei Karten, eine Marke auf einer Zeile, ein Band auf einem Steg. Ein
einziger Rangplan für die Ebenen plus zwei verbotene Rechtecke (Hausschild, Hoftor)
räumt die Hälfte dieser Liste ab.

**Und was fehlt, ist Arbeit im Hof.** In jedem Zielblatt rollen Leute Fässer, ein Gespann
fährt aus dem Tor, die vordere Hofhälfte ist voll. Im Spiel steht dort in drei von vier
Epochen nichts. Der Hof hat Gebäude bekommen und keine Fracht.

---

## Was ausdrücklich NICHT gegen das Spiel gezählt wurde

- Die zerfallenen Beschriftungen der Zielbilder (`CU NEHKER`, `GEGR. 1356`) — im Spiel
  ist Text echter Text, und er ist es tatsächlich; `ST. MICHAEL`, `GASTHOF LINDENHOF`,
  `BAHNHOF`, `BRAUHAUS ZUM ANKER` stehen korrekt.
- Die Kopfleistenzahlen der Zielbilder.
- Dass das Spiel eine Bedienoberfläche hat und das Zielbild keine. Gemessen wurde nicht
  „viel UI", sondern **wo** sie liegt und **ob sie sich selbst zerschneidet**.
- „Etwas steht auf der Hofmauer" — geprüft, widerlegt (siehe oben).
- Die Kameraentfernung — geprüft, sie stimmt bildpunktgenau.

## Aufnahmen zum Nachsehen

Alle in `werkbank/schuss/bild-w7/`, nicht versioniert:

| Datei | md5 | was sie zeigt |
|---|---|---|
| `spiel-e3-gespielt.png` | `c65a5f5208153afd8d325befffba9edd` | 1884, Woche 21, Hof fertig gebaut |
| `spiel-e4-gespielt.png` | `e0a460490bd14c04a70bf4a2f152cd79` | 1970, Woche 21, Fahrzeugwaage im LKW |
| `d-ohne-1..4.png` | — | dieselbe Seite ohne die drei UI-Ebenen |
| `w-alle-1..4.png` / `w-keine-1..4.png` | — | Hof voll / Hof leer, für die Mauerprobe |
| `p-1350/1600/1884/1970.png` | — | die Blindpaare, oben Spiel, unten Zielbild |
