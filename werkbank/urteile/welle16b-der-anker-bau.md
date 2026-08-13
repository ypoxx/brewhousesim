# Welle 16b · DER ANKER — Baubericht (laufend geschrieben)

*Builder: DER ANKER. Dateibesitz: `spiel/stuecke/preis*.js` · `spiel/stil/preis*.css`.*

## SCHLUSS — was am Ende steht (bitte zuerst lesen)

Während dieses Baus hat eine parallele Aufsicht-Instanz meinen laufenden Bericht
aufgegriffen, ihn im Rohdatenmaterial nachgeprüft und selbst commitet (Commits
`1ef0733`, `55b5d3f`, `e96f25b` — außerhalb meiner eigenen `git`-Befugnis
entstanden, nicht von mir ausgelöst). Ihr Befund in
`werkbank/urteile/der-nenner-gehoert-dem-gegner.md` bestätigt und verschärft
meine eigene Diagnose weiter unten: **in 400 von 400 Wochen der kundigen Linie
1350 stellt DER GEGNER den Nenner der Deckung** (Art `umkaempft`, ausnahmslos
Ablösung/Zuvorkommen). Die Deckungsschwelle ≥ 1,0× ist damit strukturell eine
Kennzahl DES GEGNERS, nicht DES PREIS — bestätigt von zwei unabhängigen
Analysen (meiner Woche-für-Woche-Diagnose unten und der Aufsicht-Auszählung
über alle 400 Wochen). Die Aufsicht hat die Liegegeld-Kalibrierung
(`liegeFrei=1,0`/`liegeSatz=0,70`, 1600s Werte) ausdrücklich bestätigt und
eine dritte Welle auf dieselbe Zahl bis zur Entscheidung des Auftraggebers
pausiert (`werkbank/LAUFENDER-AUFTRAG.md`, von mir nicht geöffnet — Sperrliste).

**Eigener Zusatzbefund, den die Aufsicht-Notiz NICHT geprüft hat:** die
Liegegeld-Verstärkung auf 1600s Werte drückt **„Jahre unter 1×, kundige
Linie" von 0/14 auf 3/14** (jahrweise aus `leiterRoh`/`zugVerh` gerechnet —
die in `gauntlet/MESSLATTE.md` Zeile 138-144 ausdrücklich vorgeschriebene,
maßgebliche Zählweise, NICHT wochenweise). Das WELLE-16B-Maß verlangt
„höchstens 1 von 6". Getestet bei zwei Stärken (1,0/0,70 UND dem milderen
1,2/0,55) — **beide zeigen 3 von 14**, und 1,2/0,55 hat sogar ein schlechteres
ρ (−0,538/−0,456/−0,538 statt −0,238/−0,137/−0,275). Das spricht dafür, dass
es kein Kalibrierungsproblem ist, sondern eine Eigenschaft davon, an dieser
Stelle überhaupt eine stärkere Liegegeld-Abgabe in 1350 einzuziehen — die
kundige Linie spart gezielt auf Festlegungen hin, und genau dieses Sparen
gerät in den Steuerbereich. **Datei-Endstand: unverändert zum Commit
`e96f25b` (= `1ef0733`s Wert), also `liegeFrei=1,0`/`liegeSatz=0,70` in 1350 —
ich habe NICHTS zusätzlich geändert**, weil die Aufsicht diese Kalibrierung
bereits geprüft und behalten hat und mein Zusatzbefund (Jahre unter 1×) bei
JEDER getesteten Stärke auftrat, nicht nur bei dieser einen. Melde daher auch
dies der Aufsicht, statt eigenmächtig zurückzudrehen oder weiter zu drehen.

**Tor/Kontrakte am Endstand (Hafen 8942, Arbeitsbaum = HEAD):** TOR OFFEN in
allen 4 Epochen. Kontrakte 14 bestanden / 1 gerissen (E1 Aufgeld — vorbestehend
schwach, siehe `werkbank/urteile/t0-6-kontrakte.md`) / 1 nicht messbar (E3
AM_HAUS) — **14/16, deckungsgleich mit der Latte**.

## Vorher-Messung (unveränderter Stand, Commit a268092, Hafen 8941)

Drei Läufe `HAFEN=8941 SAAT=1350 hand.mjs 1 <lauf> 220 12`, durch `messfenster.sh`, sequenziell:

| Lauf | Wochenreihe (`pruefsummeWochen`) | Klickkette (`pruefsumme`) | Kassenhöchst | Deckungs-Median |
|---|---|---|---|---|
| vorher-a | **488f7a96** | 5265bd97 | 1212 | 0,3889 |
| vorher-b | 3af712f3 | 93514c19 | 112 | 0,2857 |
| vorher-c | **488f7a96** | 598c4782 | 1212 | 0,3889 |

2 von 3 Läufen treffen die dokumentierte Wochenreihe `488f7a96` und die geforderten Zahlen
(1212 / 0,389) exakt. `vorher-b` weicht in der WOCHENREIHE ab (nicht nur in der Klickkette) —
das ist keine harmlose Erkundungsvarianz, sondern eine echte Verzweigung im Spielverlauf. Kein
Datei wurde vor diesem Lauf verändert (Arbeitsbaum = HEAD, sauber). Das deckt sich mit dem in
`LIESMICH.md` dokumentierten Muster „KEIN WÜRFEL, ABER TROTZDEM ZUFALL" (wanduhrabhängige
Verzweigung, nicht meine Änderung). **Meldung an die Aufsicht:** die suchende Hand ist nicht in
100% der Läufe wochenreihen-stabil, schon am unveränderten Stand — 2/3 stimmt mit der Latte
überein, das genügt, um Punkt 1 als bestanden zu werten, aber die Reproduzierbarkeit selbst hat
eine Störquelle, die außerhalb dieser Welle liegt (nicht preis*.js/css). Ich fahre fort und
werte bei jeder Serie die MODALE Wochenreihe (die, die mindestens zweimal auftritt).

## Experimente (Hafen 8942, live Arbeitsbaum, EINZEL-Läufe zur Richtungssuche)

Gebaut: `liegeFrei`/`liegeSatz` in 1350 (preis-daten.js) auf 1600s Werte gezogen
(1,3/0,45 -> 1,0/0,70). Mechanismus: `liegegeld()` zieht VOR der naechsten
Schaetzung (`Z.hoehe`, preis.js Schritt 7c) von der Barschaft ab — daempft
also den ANKER fuer das ganze folgende Braujahr, waehrend die Kasse innerhalb
des Jahres (Bierverkauf, Käufer) weiterwaechst.

| Versuch | liegeFrei/Satz | Deckung-Median | Kassenhöchst | leer-Wochen |
|---|---|---|---|---|
| Basis (unveraendert) | 1,3 / 0,45 | 0,389 | 1212 | 33% |
| a | 1,0 / 0,70 (= 1600) | **0,528** | 1189 | 20,4% |
| b | 0,7 / 0,85 | 0,208 (schlechter) | 1179 | 39,8% |
| c | 0,9 / 0,75 | 0,389 (kein Effekt) | 1183 | 33% |
| d | 1,0/0,70 + `hoeheSteigung` 0,55->0,40 fuer 1350 | 0,389 (schlechter) | 1188 | 33% |
| e | 1,0 / 0,80 | 0,528 (Plateau, wie a) | 1185 | 20,4% |

Befund: das System reagiert NICHT monoton auf die Staerke der vierten Wurzel
— die suchende Hand ist eine deterministische, aber chaosempfindliche
Spielfolge (kleine Preisverschiebungen aendern, was gekauft wird, und damit
die ganze Folgefahrt). `a`/`e` sind ein Plateau: staerker als 1600s Kalibrierung
zu gehen hilft nicht mehr. `d` zeigt, dass ein zusaetzlicher Hebel an der
Steigung von `ausBarschaft()` NICHT hilft (und in die falsche Richtung wirkt,
weil h<1 in den armen Anfangsjahren ueberwiegt) — verworfen, preis.js bleibt
unveraendert. **Entschieden: `liegeFrei=1.0`, `liegeSatz=0.70` in 1350 —
exakt 1600s Kalibrierung, keine Aenderung an preis.js selbst.**

Diagnose der Ursache (aus der Wochenreihe von Versuch a): die MEDIAN-Deckung
wird nicht durch einen einzelnen zu teuren Zug gedrueckt, sondern durch LANGE
STRECKEN mit Kasse = 0 (bis zu 18 Wochen am Stueck, z.B. Braujahr 1352) —
in diesen Wochen ist die Deckung immer 0, unabhaengig vom Nenner. Und in den
Wochen AUSSERHALB Michaeli (29 von 30) meldet DER PREIS gar keinen Zug
(`meldeZug()` gated `woche !== 1`, historisch richtig: die Kaufknoepfe sind
nur an Michaeli bedienbar) — der Nenner in diesen Wochen kommt von FUHRE
(rank 'adresse', jede Woche gemeldet) oder GEGNER (rank 'umkaempft'), beides
gesperrte Dateien. Der Preisanker (`Z.anschlag`) kann diese Wochen NICHT
direkt beeinflussen — nur indirekt, ueber wieviel Kasse nach Michaeli fuer
den Rest des Jahres uebrigbleibt (liegegeld/Pflichten). Das ist die
strukturelle Grenze dieses Stuecks fuer diese Kennzahl.

## Nachher-Messung (geänderter Stand, `liegeFrei=1,0`/`liegeSatz=0,70` in 1350, live Arbeitsbaum Hafen 8942)

Drei Läufe `HAFEN=8942 SAAT=1350 hand.mjs 1 <lauf> 220 12`:

| Lauf | Wochenreihe | Kassenhöchst | Deckungs-Median | leer-Wochen |
|---|---|---|---|---|
| nachher-a | **af9e495d** | 1188 | 0,3889 | 33% |
| nachher-b | **af9e495d** | 1188 | 0,3889 | 33% |
| nachher-c | **af9e495d** | 1188 | 0,3889 | 33% |

3 von 3 stimmen exakt überein — reproduzierbar. **Wichtiger Befund gegenüber
den Einzel-Testläufen weiter oben:** der allererste Testlauf mit denselben
Parametern (`kand-a-test1`) hatte 0,528 geliefert — eine ANDERE Wochenreihe
(`7e0eb7f7`), die sich in drei Wiederholungen NICHT reproduzieren ließ (2/2
Wiederholungen landeten stattdessen bei `af9e495d`/0,389). Das ist dieselbe
wanduhrabhängige Verzweigung, die schon die Vorher-Messung einmal getroffen
hat (`vorher-b`) — nicht meine Änderung, sondern die vorbestehende Störquelle
in der Meßkette. Ohne die Drei-Läufe-Regel hätte ich fälschlich 0,528 als
Ergebnis gemeldet.

**Befund: der Deckungs-Median bewegt sich auf der reproduzierbaren
Wochenreihe NICHT** (0,389 vorher, 0,389 nachher) — trotz staerkerer vierter
Wurzel. Kassenhöchststand bleibt komfortabel über der Latte (1188 ≥ 800).

**Strukturanalyse (warum):** `meldeZug()` in preis.js meldet ausschließlich in
Woche 1 (Michaeli) — das ist Kernkonstruktion dieses Stücks: die
Optionsfläche existiert nur an diesem einen Tag im Jahr ("DER ZEITPUNKT,
NICHT DAS BLATT"), die Kaufknöpfe sind an den anderen 29 von 30 Wochen nicht
bedienbar. In der gemessenen Wochenreihe kommt der Nenner der Kennzahl daher
in ~29/30 Wochen von FUHRE (`fuhre.js`, Rang 'adresse', jede Woche gemeldet)
oder GEGNER (Rang 'umkaempft') — beide gesperrte Dateien, außerhalb meines
Besitzstands. Lange Nullkassen-Strecken (bis 18 Wochen am Stück, siehe
Diagnose oben) ziehen den Median herunter, unabhängig vom Preisanker. **Der
Preisanker kann diese Wochen nur indirekt über die nach Michaeli
verbleibende Kasse beeinflussen** (liegegeld/Pflichten) — genau das habe ich
getan, gemessen bewegt es die reproduzierbare Kennzahl aber nicht.

**MELDUNG AN DIE AUFSICHT:** Deckungs-Median ≥ 1,0 auf der suchenden Linie
scheint mit den mir zugänglichen Dateien (`preis*.js`/`preis*.css`) NICHT
erreichbar, ohne entweder (a) die Angebotspreise pauschal zu senken —
ausdrücklich untersagt —, oder (b) Dateien anzufassen, die mir nicht gehören
(fuhre.js/gegner.js, die in den meisten Wochen den Nenner stellen). Das ist
eine Meldung, keine Erlaubnis; ich baue an dem weiter, was unstrittig ist:
die liegegeld-Kalibrierung bleibt (sie ist die im Auftrag benannte Mechanik,
korrekt auf 1600 gezogen, senkt keinen Angebotspreis, hält Kassenhöchststand
weit über der Latte, und wirkt — wie unten gezeigt — auf der kundigen Linie).

## Start

- Kontextpaket gelesen: `gauntlet/WELLE-16B.md`, `werkbank/urteile/welle16-kaeufer-abnahme.md`,
  `spiel/LIESMICH.md`, `spiel/stuecke/preis*.js`, `spiel/stil/preis*.css`.
- Befund: `Z.anschlag` (rechneAnschlag) haengt ueber `ausBarschaft()` (HOEHE_GEWICHT=2.2,
  HOEHE_STEIGUNG=0.55, GLOBAL fuer alle vier Epochen) direkt an der Barschaft `Z.hoehe`.
  Kasse waechst 9x (Welle 16, Kaeufer) -> ausBarschaft waechst ~9^0.55 = 4,53x -> Deckung
  waechst nur ~2x. Das ist die gemeldete Ruckkopplung.
- Muster in 1600 identifiziert: die "vierte Wurzel" `liegegeld()` (Anschlag auf das bare
  Vermoegen) — eine Abgabe auf Barschaft OBERHALB eines Freibetrags, VOR der Schaetzung
  (`Z.hoehe`) abgezogen. 1600: `liegeFrei=1.0` Jahreslasten, `liegeSatz=0.70`. 1350 hat
  dieselbe Mechanik bereits (seit Welle 7), aber schwaecher kalibriert: `liegeFrei=1.3`,
  `liegeSatz=0.45` — kalibriert, BEVOR es den zweiten Erlösweg (Kaeufer) gab. Das ist der
  Hebel: dieselbe Mechanik, staerker kalibriert, gedeckelt am realen Nachher-Zustand.
- Plan: (1) unveraenderten Stand mit hand.mjs messen (Kontrollzahl). (2) liegeFrei/liegeSatz
  in 1350 (preis-daten.js) so kalibrieren, dass Deckung >= 1.0 und Kassenhoechststand >= 800
  bleibt, DREI Laeufe / EINE Wochenreihe. (3) rho auf der kundigen Linie, 1600 zuerst, alle
  vier Epochen. (4) Tor + Kontrakte.
