# Gameplay-Analyse DER SUD · DER PREIS · DIE STADT · DER GEGNER

Basis: vollständige Lektüre von `spiel/stuecke/{sud,preis,stadt,gegner}{,-daten,-zusatz}.js` (16.956 Zeilen; `preis-zusatz.js` und `gegner-zusatz.js` sind leere Platzhalter mit je 9 Zeilen, „Freier Platz … damit der Bauer seinen Code auf mehrere Dateien verteilen kann, OHNE index.html anzufassen").

---

## 1. DER SUD (sud.js 2606 Z, sud-daten.js 714 Z, sud-zusatz.js 299 Z)

### Spielmechanik
Simuliert die **Verfahrensentscheidung des Brauers** als Haltbarkeits-/Handelsproblem („Bier war bis ins 19. Jh. vor allem ein HALTBARKEITSPROBLEM", sud-daten.js:7–11), plus **Gärkeller getrennt vom Lagerkeller** (sud.js:27–43: reifende Fässer werden aus dem Lager „angesaugt" und reif zurückgegeben; **Haltbarkeit beginnt erst am Fass**, nicht am Kessel), plus **Gütezeiger** (Hefe, 0–100, Start 70, Zerfall 2/Woche, Boden 25).

Kernmaschinerie:
- **Achsen/Optionen** je Epoche mit `wirkung` (haltbar ×, gaer ±Wochen, roh ±Rohstoff, mehr ±Fass, risiko, anzeige, guetefall/guetepin, streuung, warmDrossel). `wirkung()` sud.js:222–239: Haltbarkeit multiplikativ, Rest additiv, guetepin = Maximum.
- **`hoechst`-Deckelung**: jede Option deckelt die Sortenstufe (Minimum über Achsen, sud.js:322–329); DIE FUHRE bestellt die Sorte, DER SUD „sagt, was die Pfanne davon hält" — deckelt nur, hebt nie; Vorgabestand deckelt auf Stufe 2 = Hausbier (sud.js:45–56). Liest dafür FUHRE_DATEN nur lesend, fällt still aus (sud.js:279–283).
- **Siegel/Ratsche**: bezahlte `fest:true`-Optionen sind unwiderruflich; Achse geht nur noch aufwärts (`gesiegelt`/`verdraengt`, sud.js:170–218). **Anrechnung**: Prozessrechner 78.000 DM Liste, 36.000 nach Labor (`offenerPreis`, sud.js:155–168; Begründung sud-daten.js:534–582).
- **Gärraum-Kauf** mit Staffelpreis (basis·staffel^n) und je Epoche **anderer Nebenbedingung** (sud.js:369–397): 1350 GRENZE (max. 2 Bottiche vom Küfer), 1600 KOPPLUNG (Zunftlade nimmt Bau nur bei `rein` oder `weizenbrief` ab), 1884 BEDINGTE WIRKUNG (Zukauf trägt in warmen Wochen nur mit Kältemaschine), 1970 LIEFERZEIT (3 Wochen, bezahlt bei Bestellung).
- **Risiko ohne Geldstrafe** (Kopfsatz „KEIN ZUSTAND OHNE ZUG", sud.js:64–71): Fehlsud (p = risiko + max(0,60−Güte)/100·0,14, max 1 Bottich/Woche, sud.js:692–716), Anzeige-Instanz nimmt Rohstoff+Bottich+Güte (Grutherr/Bierschau/Untersuchungsanstalt, sud-daten.js:623–639; **1970 hat keine**), 1970 Chargensperre (Streuung = (100−Güte)/4+w.streuung) mit Rückläufer des Handels (bezahlt in Bier, sud.js:746–786).
- **Hefepflege**: führen +8 (kostet nichts, nur solange etwas gärt), Anstich jung +14 / alt +6 (kostet 1 Fass); `hefeFaktor` = 1+max(0,Güte−60)/100·0,5 stempelt Haltbarkeit ×1,00–×1,20 auf neu eingelegte Fässer (sud.js:834–851).
- **Kalte Pfanne**: 3 Braujahre ohne Sud → Spielende via `B.uhr.beende`, je Epoche anderer Rechtsgrund (Reihe verloren / Lade zieht ein / Hypothek / Anlage verkauft; sud-daten.js:665–695).
- Epochenwechsel setzt Verfahren, Festlegungen, Güte, Zusatzraum zurück (sud.js:2468–2484: „ein Hopfenbrief des Rats von 1350 ist 1600 kein Felsenkeller").

### Verben je Epoche
Programmatischer Anspruch sud.js:16–25: „Kein Verb kommt in zwei Epochen vor. Das ist der Punkt." — gilt für die **Achsenoptionen** (24 Stück, strikt disjunkt):
- **1350 (6)**: Grut vom Grutamt · Hopfen im Sack (heimlich) · Hopfenbrief (78 Pf, fest) ‖ Wasser: Stadtbach · Ziehbrunnen · Röhrenrecht (30 Pf, fest)
- **1600 (6)**: Rein nach dem Gebot · mit Weizen gestreckt · mit Hafer/Wicke gestreckt · Weizenbrief (180 fl, fest) ‖ obergärig · Felsenkeller (260 fl, fest)
- **1884 (5)**: Natureis · ohne Kühlung warm · Lindesche Kältemaschine (9.800 M, fest, sperrt natureis) ‖ Betriebshefe · Reinzuchthefe (3.400 M, fest)
- **1970 (7)**: nach Erfahrung · Betriebslabor (42.000, fest) · Prozessrechner (78.000, fest, Anrechnung) ‖ naturtrüb · Kieselsol-Schönen · Kieselgurfilter (26.000, `einmal`) · Tunnelpasteur (74.000, fest)
- **Nur 1970**: Charge freigeben / Charge verschneiden (+ Rückläufer-Mechanik).

**In allen vier Epochen mechanisch identisch (4 Zugfamilien)**: `sud:gaerraum`, `sud:hefe-fuehren`, `sud:anstich-jung`, `sud:anstich-alt` (+ deren Zettel-Pendants `sud:zettel-*`). Nur der Wortlaut ist Kostüm („Hefezeug heben"/„Stellhefe nehmen"/„Hefe abernten"/„Hefe ziehen"); Datenkommentar sud-daten.js:70–75 sagt es explizit: „die Zahl ist die Zahl, die EPOCHE ist der Unterschied."
**Zählung**: 1350: 10 · 1600: 10 · 1884: 9 · 1970: 13 Spielverben.

### Daten (sud-daten.js)
714 Zeilen: `guete` (globale Kurve), 4 Epochenblöcke (Achsen mit Preisen/Wirkungen, Gärkeller 10/16/48/200 Plätze, Kauf 26 Pf/78 fl/1.900 M/24.000 DM mit Staffel 1,25–1,3, epochale Wortfelder für Hefe/Anstich/Fehlsud, 1970-Chargenblock inkl. Rückläufer-Vorlagen), `anzeige` (3 Epochen), `kalt` (Warnung/Ende/Pfanne je Epoche), `schluss` (Schlussblatt-Sätze). Sehr viel Messprosa (Kritiker-Auflagen Wellen 4–7 mit konkreten Zahlen, z. B. Rechner „in 800 gemessenen Wochen NIE zugleich aktiv und erreichbar"). Historische Substanz: Grutrecht, Reinheitsgebot als Rohstoffpolitik, Linde 1873, Hansen 1883, Nahrungsmittelgesetz 1879, Sommerbrauverbot 1553.

### UI
Drei Flächen: (1) **Brett** „DAS SUDHAUS" (`B.ebene('hand','sud')`, `data-reiter`, zweispaltig: links Achsen, rechts Wirte-Leiter/Hefe/Gärkeller/Sudbuch, max. 8 Bottiche im Band, Sudbuch 3 Zeilen); (2) **Kesselzettel** (`ebene marken`, `data-frei`, muss < 2,4 %-MARKE der STADT bleiben, 178×126 px bei 1366×768; trägt im Vorgabestand 4 Züge, Stempel-Kurzworte unterhalb der Entwurfsleinwand); (3) **Sudbuch-Klappe/Schlussblatt** (`ebene blatt`, sud-zusatz.js, weicht Zügen aus, öffnet sich nur, wenn kein fremdes Schlussblatt existiert). STADT-Integration ist aufwendigste Stelle des Stücks: fragt `B.stadt.rahmen.lage()` mit Schlüssel `'sud|sud-brett'` (sud.js:2267–2278), MutationObserver auf `class` des Bretts, 320-ms-Intervall, Gnadenfrist 700 ms, Knopfzustände `data-soll-aus`/`data-verdeckt`/`data-aus-grund`; Zettel sucht Sitz über 8 Nahstellen + entfernungssortiertes Buhnenraster (max. 20/28 elementFromPoint-Proben), Notlage `gedraengt`.

### Qualität
- **Echter Bug — doppelte Funktionsdeklaration `fuelle`**: sud.js:756 `function fuelle(vorlage, x)` (ersetzt `{nr}`,`{ab}`,`{menge}` für Rückläufertexte) wird durch sud.js:1173 `function fuelle(text)` (ersetzt nur `{menge}` durch die **Gärraum-Kaufmenge**) per Hoisting überschrieben. Folge: `rueckPruefen()` (sud.js:773, 780) gibt 1970 die Vorlagen `'Charge {nr} ist durchgegangen…'` / `'…{ab} %…{menge}'` mit rohen Platzhaltern aus bzw. ersetzt `{menge}` mit „180 hl" statt der Chargenmenge.
- Vier offen dokumentierte **Kernbitten/Architekturschulden** (sud-zusatz.js:268–296): nimmHeraus(wahl), Rohstoff-API, Sortenleiter im Kern, Gärkeller als Kernbehälter („legeEin kennt k/stufe/zeichen/reife/haltbar nicht" → händisches Nachstempeln in `gibZurueck`, sud.js:614–621).
- `B.sud.preise()` liest **den Bildschirm** (`document.querySelectorAll('button[data-zug^="sud:"]')`) als öffentliche API (sud.js:977–993) — bewusst („Gelesen wird der Bildschirm, nicht der Quelltext"), aber DOM-gekoppelt.
- Timing-Choreografie gegen STADT (320 ms vs. 240 ms Takt, Doppel-rAF, GNADE=700) — reich kommentierte Fragilität (sud.js:2280–2410); Vorgänger `fremdVerdeckt()` ersatzlos gestrichen (Grabstein-Kommentar sud.js:2395–2400).
- Hartkodierte Bildschirmannahmen: Media-Query `(max-width:2751px),(max-height:1535px)` (sud.js:1707), Stellenraster in Buhnenprozent, SICHTBAR=8.
- Kein `B.stand`-Sicherung von `Z` (im Gegensatz zu GEGNER): Verfahren/Siegel/Gärkeller gehen bei Reload verloren.

---

## 2. DER PREIS (preis.js 3358 Z, preis-daten.js 1543 Z, preis-zusatz.js leer)

### Spielmechanik
Simuliert **Preisbildung und Fiskus** als Jahres-Ereignis: **Michaeli = Woche 1** eines Braujahres, ein formatfüllendes Blatt („Die Kasse reicht nie für alles", preis.js:4–13). Die Michaeli-Abrechnung (`michaeli()`, preis.js:961–1399) läuft in 11 Schritten: Rückstand+10 % (über einer Jahreslast → Pfand: Wirtschaft 5 Jahre an den Adler) → Pflichten → Bau-Erträge (×Teuerung!) → Raten → Handlohn beim Erbfall → außerordentliche Umlage → Liegegeld (4. Wurzel) → Notpfennig-Zeile → **erst dann** Schätzung (`Z.hoehe`, Nachgeber 0,45) → Vorgriff auf den Notpfennig (geliehen, nicht geschenkt) → Bierordnung → Angebotsauswahl → Leiter-Zeile.

Kernformeln:
- **Anschlag** = max(grund, (0,30·Umsatz + grund·2,2·(hoehe/grund)^0,55) · teuerungJahr^Jahre · teuerungKauf^Käufe) (preis.js:203–248); Mindestansatz wird **nicht** mitverteuert (behobener Fehler, langer Kommentar 222–240). Zwei Preisregime: **Schätzung** (Anschlag) vs. **Taxe** (`nachZeit` → `festBasis()` = grund·teuerung^Jahre) — nur in 1350 gesetzt (preis.js:267–330).
- **Pflichten mit drei Wurzeln** fest/menge/ertrag (preis.js:345–469), Veranlagung als gewichteter Dreijahresschnitt [0,5/0,3/0,2]; **vierte Wurzel** Liegegeld auf Barbestand über Freibetrag — **nur in Epoche 1 (liegeSatz 0,45, frei 1,3 Jahreslasten) und 2 (0,70 / 1,0)**, Freibetrag mit Boden auf dem Preis der billigsten Festlegung (preis.js:580–711).
- Umlage/Handlohn bemessen auf `pflichtBasis()` **ohne selbst aufgeladene Lasten** (Auflage 6, preis.js:477–544); Handlohn heißt je Epoche anders (Handlohn/Laudemium/Erbschaftsteuer — Sperrlistenfund, preis.js:546–578).
- **Notpfennig** (48 Pf/280 fl/4.200 M/50.000 DM): `buche()` nimmt nie darunter, Rest wird gestundet; Vorgriff füllt bis zum Notpfennig auf (preis.js:816–866, 1248–1333).
- **Bierordnung**: benannte Stufen (z. B. 1350/1391/1444/1490; 1970er Liste bis 2015 „Kastenpreis 14,99") + Nachführung `satzFolgt` (0,60/0,25/0,50/0,60) + spielergebauter `aufschlag` → `haus.preis` (preis.js:713–810).
- **Angebote**: 4 je Jahr (billigstes + größtes + mind. eine Sperr-Gabelung + Würfel), Bauzeit → 45 % Anzahlung + Raten; `sperrt` beidseitig (Ochse/Gaul etc.). **Festlegungen**: genau **eine je Amtszeit**, unwiderruflich, eigene append-only-Chronik; Taxe zeitgebunden. Amtszeitfrist wird **gemessen statt geglaubt** (kern-`amtszeit.bis` ist gewürfelt 21–37 Jahre, real wechselt die Hand alle ~2 Braujahre — preis.js:118–173).
- Nicht-Bewerten als Prinzip: „Das Blatt bewertet nicht an Stelle des Spielers" (preis.js:28–33); bei leerer Kasse aber R8: „DAS GELD LIEGT AM HOF" nennt den konkreten Einnahmeknopf (`einnahmeZuege()` scannt fremdes DOM nach positiven `data-preis`; im ganzen Spiel existiert genau einer: `fuhre:rueckkauf:rohstoff`, preis.js:1579–1650).

### Verben je Epoche
**Strukturell in allen vier Epochen identisch (6)**: Nehmen (`preis:nimm:k`) · Festlegen (`preis:festlege:k`) · Nichts nehmen (`preis:nichts`) · Das Jahr beginnen (`preis:tafel-zu`) · Tafel öffnen/schließen (`preis:tafel`) · Chronik (`preis:chronik`, `preis:chronik-auf`). **Die Epochendifferenz liegt zu 100 % in den Daten** (Regel 1, preis-daten.js:9–12: „Die Listen der vier Epochen haben KEINEN gemeinsamen Eintrag"):
- Angebote: **1350: 14 · 1600: 15 · 1884: 14 · 1970: 16** (mit `ab`/`bis`-Fenstern, z. B. Flaschen ab 1880, Email ab 1893, Kronkorken bis 1969, Gasthausbrauerei ab 1990)
- Festlegungen: **1350: 8 · 1600: 7 · 1884: 5 · 1970: 5**, je Epoche eine „Geld-herein"-Karte (Pfründe `einmal:8` / Gültbrief `einmal:5` / Aktien `einmal:7` / Konzern `einmal:6`).

### Daten (preis-daten.js)
1543 Zeilen, das umfangreichste Balancing-Dokument: je Epoche grund/teuerungJahr/teuerungKauf/lastenFest/pflichtUmsatz/pflichtErtrag/nachlass/notpfennig/umsatzAnfang/satzFolgt/umlageAnteil/handlohnAnteil, Umlagen-Rhythmen (`abstaende`, 1600 am dichtesten: [1,2,3,2,4,3,2,3,4] — Dreißigjähriger Krieg), Ordnungstabellen, 5 Pflichten je Epoche mit `sagt`-Sätzen, 6 Umlagen je Epoche (Brandschatzung 1,85 · Kontribution 2,10 · Bankenkrach 2,30 …). Historisch dicht: Grutgeld, Ungeld, Malzaufschlag 1543, Kipper-und-Wipper 1622, Krankenversicherungsgesetz 1883, Markenschutz 1894, Denkmalschutz Bayern 1973, Einheitskasten-Korrektur (kein Zwangspfand 1980, preis-daten.js:1362–1370). Viele Messtabellen als Kommentar (rho/Bänder je Parameterwert, z. B. liegeSatz-Tabelle Z. 244–256).

### UI
Ein Blatt (`ebene blatt`): Tafel mit 3 Spalten (Rechnung/Bierordnung/Anschlag/Bestand ‖ Angebote+Festlegungen ‖ Was fällig wird+Leiter) + Chronikseite (Festlegungen/Jahr-für-Jahr/Leiter komplett); zu: **Griff** mit Standzeilen und Chronikknopf. STADT-Integration (Welle 13, R6/R7/R10): `klemmeLesen()` liest `stadt-zugeklappt`/`stadt-verdeckt` **vor** dem Leeren am Element der Vorrunde, eine Entscheidung trägt Griff+Tafel (preis.js:2924–2962); `handHorcher` an `#buehne` (Capture): fremder Reiterklick legt die Tafel weg (Klick läuft weiter), **WEITER wird einmal je Braujahr abgefangen** (preventDefault) um die vom Laderahmen weggeklappte Tafel zurückzuholen, max. 3 Rückholungen (preis.js:3020–3091). Tafel schließt sich ab Woche 2 selbst („Vitrine"-Regel R7, preis.js:3226–3231). Sommerzettel der FUHRE hat Vorrang (`sommerLaeuft()` per DOM-Query).

### Qualität
- Kopplung an STADT-Klassennamen und an FUHRE-DOM (`.fu-sommerblatt`) und an eigene Klassenliste als Rahmen-Schlüssel; REITER-Präfixliste hartkodiert (preis.js:3020).
- Grabstein-Dokumentation entfernter Fehler: 420-ms-Wanduhrfrist (R6, „Der Wecker … hat kein einziges Mal geklingelt"), `pr-auf`-Animation die bei jedem Neuzeichnen opacity 0 lieferte (preis.js:2926–2937).
- Kern-Fehler bleibt bestehen und wird nur umgangen: `welt.js:379 amtszeit.bis` gewürfelt 21–37 Jahre vs. real 2 (preis.js:118–142).
- `einnahmeZuege()`-Befund: das ganze Spiel hat **einen** Geld-hereinknopf; in 1884/1970 im Ladezustand abgeschaltet (preis.js:1604–1611) — an FUHRE/GEGNER delegiert.
- Keine Spielstand-Sicherung von `Z` (Chronik, Leiter, genommen).
- Extremes Kommentar-zu-Code-Verhältnis; Balancing-Konstanten inline (0,45 Nachgeber, 0,45 Anzahlung, 1,1 Rückstandsaufschlag, HOEHE_GEWICHT 2,2 …).

---

## 3. DIE STADT (stadt.js 2275 Z, stadt-daten.js 1263 Z, stadt-zusatz.js 493 Z)

### Spielmechanik
Simuliert **Stadtbild + Hofausbau + UI-Rahmen**: vier Epochenplatten (gleicher Ort, gleiche Kamera, 620 Jahre), ein Hof, der **nur durch Käufe** wächst („Es steht dort, WEIL Geld ausgegeben wurde, nicht weil die Epoche gewechselt hat", stadt.js:8–10). `gebaut` überlebt Epochenwechsel; Bauten mit `bis < neu` verschwinden mit Chronikzeile (stadt.js:2207–2215).
- **Bauen**: Katalog je Epoche, Preis = grund·teuerung[e] (teuerung {1:0,63, 2:3, 3:37, 4:174}, stadt-daten.js:324), `nutzen` schreibt direkt in Weltzustand (platz/sud/rohstoff). Balancing-Regel: „Barschaft trägt am Anfang jeder Epoche etwa fünf der offenen Bauten, der sechste bleibt liegen" (stadt-daten.js:320–323).
- **Verwertung** (Runde 7, „Stein zurück zu Münze"): je Epoche ein eigenes Verb mit eigenen Regeln (stadt-daten.js:347–379): 1350 **Versatz** (45 %/Zwang 34 %), 1600 **Wiederkauf** (55/41), 1884 **Hypothek** (70/52, **Gebäude bleibt**, 5,5 % Zins jeden Michaeli), 1970 **Abbruch** (85/63, endgültig). Michaeli: `zinsLaeuft()` dann `ratGreiftZu()` — bei Minus-Kasse Zwangsverwertung **einmal je Jahr** (kleinstes deckendes Stück), ist nichts mehr da → `B.uhr.beende('haus-verloren')` (stadt.js:304–343).
- **Der Rahmen** (Reiterleiste): Buhnenordnung Kopf 0–11,2 % / Stadtfenster 11,2–87,5 % / Werkbank; jedes fremde Brett > GRENZE 3,5 % wird per `clip-path` zugeklappt und bekommt einen Reiter mit **lebenden Zahlen**; Ausnahmen `.amort`/`data-frei` nur unter MARKE 2,4 % (stadt.js:378–470). **Platzordnung**: wer zuletzt aufschlägt liegt oben, Streit = Deckung > 12 % des kleineren (stadt.js:1230–1302). Bauhof-Lade ist seit Welle 9 selbst ein Brett (zugeklappt beim Laden; öffnen schließt fremde Bretter und umgekehrt). **Kartenschicht**: fremde Ortsmarken bekommen Pflöcke, ruhen beim Laden, weichen Deckeln aus (`pfloeckeFreiRuecken`, translate statt transform).
- **Lot/Tiefe** (stadt-zusatz.js): prüft bei jedem Zeichnen per Fußprofilen (24 Spalten je Bild aus dem Alphakanal, K.fuesse) gegen die vermessene **Mauerlinie** (Scheitel 29,9|78,5, Steigungen 0,49/0,45) + Torfeld; `boden:'gasse'` verlangt `warum`. Vierter Satz: Tiefen-/Deckungsprüfung per Canvas-Pixelzählung (`messeDeckung`, BEGRABEN 55 %).
- **Fracht**: kostenlose Kulisse (Fässer, Leute, Karren, 1970 vier Autos + Bus), an Spielstand gebunden (`wenn: keller/kellervoll/immer`).
- **Vorladen** in 3 Stufen gegen das 8-MB-Gewichtsveto (stadt.js:2071–2166; WebP statt PNG 17,5→4,5 MB).

### Verben je Epoche
- **Bauen** (`stadt:bau:<k>`): 1350: **9** Aufbauten · 1600: **12** · 1884: **12** · 1970: **10** (aus von/bis in stadt-daten.js:699–1262; insgesamt 32 Hofbilder).
- **Verwertung**: je Epoche 1 Verb, vier disjunkte Zugschlüssel (`stadt:versatz|wiederkauf|hypothek|abbruch:<k>`) — „ein 'stadt:versatz' gibt es in 1600 überhaupt nicht" (stadt-daten.js:336–339). Mechanik gleich, Parameter und Folge (bleibt/Zins/endgültig) epochal echt verschieden.
- **Rahmenverben, alle Epochen identisch (5–6)**: `stadt:bauhof`, `stadt:bau:seite`, `stadt:reiter:<s>`, `stadt:alles-zuklappen` („Stadt zeigen"), `stadt:ortsmarken`, `stadt:marke:<s>`.

### Daten (stadt-daten.js)
1263 Zeilen: 4 Platten mit `stand`-Erbe und Hausschild-Position je Epoche (inkl. langer Korrektur-Historie Runden 5–9); `namen` (ST. MICHAEL, GASTHOF LINDENHOF, BAHNHOF ab E3); `gegnername`-Schilder (Text zur Laufzeit aus `welt.gegnerName()`); Standplatz-Raute mit 12 Plätzen und Maßstabslehre („Ein Sudkessel von 1350 … rund drei Viertel einer Körperlänge breit"); `teuerung`, `verwertung`, `boden` (Mauerlinie), `fracht` (14 Einträge), **`fuesse`** (32×24 Zahlen) und `bildmass` (32 Maße), 33 Aufbauten mit teils epochengestaffelter Breite/Versatz.

### UI
DIE STADT **ist** die Reiterleiste: Werkbank (`ebene blatt`) mit Reiterzeile + Bauhof-Lade (2 Seiten BAUHOF/Verwertung, max. 5 Zeilen, Vorschau-Geist unter der Maus), Platte (`ebene platte`), Hof/Fracht/Namen/Hausschild (`ebene bau`), Pflöcke (`ebene marken`, z-index −1), Gegnernamen (`ebene hand`, z 962). Reiter-Aufschriften werden wortweise selbst gekürzt (`setzeAufschrift`, nie mitten in Zahl — Auflage 2 Welle 7, stadt.js:672–740); `schmal`-Modus blendet `.zahl` aus, sobald ein Brett aufliegt. Lesbare API für die anderen Stücke: `B.stadt.rahmen.lage()/verdeckt()/schneidet()/bauhof()`, `B.stadt.hofwert()`, `B.stadt.mass.*`, `B.stadt.boden/tiefe` (+ `?boden=1`-Overlay).

### Qualität
- **Rahmen-Schlüssel = `wer|sortierte Klassenliste`** (stadt.js:572–579): fremde Stücke (SUD) hängen wörtlich an `'sud|sud-brett'` — Klassenumbenennung bricht Lagen still.
- Wanduhr-Konstanten TAKT 240 / VERGESSEN 900 / HANDFRIST 1400 / JAHRESFRIST 1800 / LADEZEIT 2500 ms — Quelle mehrerer dokumentierter Race-Fixes in SUD (Welle 6) und PREIS (R6/R7).
- **Dokumentierter Datenwiderspruch** (stadt-daten.js:160–183): kern/welt.js + kern/orte.js setzen den Adler in E1/E2 auf `marktplatz`, GEGNER zeichnet in allen vier Epochen `konkurrenz`; STADT folgt dem Gemalten, „Der Widerspruch selbst gehört nicht mir und wird nur gemeldet."
- **Bekannter, absichtlich nicht geheilter Fehler**: FUHRE-Züge unter der Werkbank in 1970 — nur gezählt via `rahmen.verdeckt()` (stadt.js:1304–1358).
- `zinsLaeuft()` zahlt per `B.welt.nimm(-zins, …)` — negative Einnahme statt `zahle` (stadt.js:359).
- `zeichneBauhof` meldet den Nenner mit **3 Argumenten** `meldeZug(...,'lage')` ohne Zugschlüssel (stadt.js:1934) — inkonsistent zu SUD/PREIS, die nach ZUSTÄNDIGKEIT §24 den 4. Parameter mitgeben.
- `teuerung[1]=0,63` (Preise in E1 unter Grundpreis) — semantisch überraschend. Kein `B.stand` für `gebaut`/`belastet`.

---

## 4. DER GEGNER (gegner.js 3716 Z, gegner-daten.js 671 Z, gegner-zusatz.js leer)

### Spielmechanik (Gegner-KI)
Zwei Parteien: **Adler** (Familie Feist, alle Epochen, gleicher Sitz `konkurrenz` über 620 Jahre) und **Nordstern-Gruppe** ab E4 („sie braut nicht, sie kauft"). Kein Skript-Gegner, sondern Zustandsmaschine mit Kasse, Hofbauten, benannten Erben (Wechsel alle 22–36 Jahre) und **6 Wesenszügen**, die Zuggewichte multiplizieren (streitbar ×2,2 entreissen … träge ×0,5 fast alles; gegner-daten.js:114–127).
- **Zugmaschine**: jede Woche würfelt jedes Haus gegen `wagemut` (klamm halbiert); die **ersten 10 Adler-Züge folgen einer Pflichtliste** (Repertoire-Rundgang: werben, bauen, fuhre, entreissen, preis, werben, macht, verlieren, aufstocken, entreissen; gegner.js:1288–1349). 12 Zugarten (werben/entreissen[über zielen]/aufstocken/bauen/preis/fuhre/rohstoff/macht/verlieren/unglueck/uebernahme/angebot).
- **Bindung in der Währung der Epoche** (gegner-daten.js Kopf): I Recht und Gunst (Konzession/Bannmeile/Gevatterschaft/Ratsspruch[fest]), II Zunft und Pacht (Zunftbrief/Pacht/Heirat/Bürgermeisteramt[fest]), III Vertrag (Liefervertrag/Depot/Hypothek, **Tilgung 8 %/Jahr + 12 % Aufschlag** auf die Ablösesumme), IV Listung (Listung/Jahresvereinbarung/Exklusiv). Ablöse = grund+zusatz, modifiziert durch Gegenzüge/Nachlass; `fest`-Mittel unlösbar solange Amt (gegner.js:507–528).
- **Telegrafierte Aggression**: Werbung (2–8 Wochen Uhr, Zuvorkommen 45 % Grundwert) und **Absicht/Zielen** (2–7 Wochen, Abwehr 62 %) — beide sichtbar mit Preisschild, erst danach wechselt das Zeichen (Runde 2, gegner.js:985–1069). Sein **Vorsprung** (Bauten mit `spiegel` im eigenen Hof; was das Haus nicht hat, kürzt seine Werbung um je 1 Woche, Kappe 3).
- **Ökonomischer Druck**: Abschlag je Lieferung an gebundene Adressen (m.abschlag 10–32 % × Preisdruck bis 1,5 wenn er unterbietet), **hart gedeckelt auf 3 % des Jahresumsatzes** (ZUSTÄNDIGKEIT §4; `hoereBuch`, gegner.js:1485–1524). Er verdient an nicht gelieferter Menge (jahrLaeuft).
- **Grenzen**: hoechstzahl je Haus (50/50/45/30 % der Adressen), Gesamtgrenze aller Gegner 45/52 % — `machePlatz` gibt wirklich frei (Runde-3-Fix mit 5. `welt.binde`-Argument, gegner.js:869–890).
- **Untergang in 3 Stufen** (klamm → verpfändet → am Ende); in E4 schluckt Nordstern den gefallenen Adler samt Adressen bis zur Gesamtgrenze (gegner.js:1589–1661).
- **Spielerverben**: zuvorkommen/abwehren/ablösen; **Hinhalten in zwei Währungen** (Welle 13 R15: 1 Fass aus dem Keller ODER Zukauf zu 4/3 Satz — „Keine der beiden schlägt die andere in jeder Lage", gegner.js:587–656); **Beschwerde** einmal je Braujahr (kostet 4 Ansehen, kein Geld; 50 %+20 % Erfolg; macht ihn 3 Wochen „zornig" = zieht sicher); **Gegenzug** eine je Amtszeit (Ratsstuhl 900 Pf / Zunftlade 4.200 fl / Bankhaus 26.000 M / Marke 62.000 DM — jeweils dauerhafte Regeländerung); nur E4: **Notargebot** (3 Stufen ×1,12/1,45/1,9 mit 34/62/88 % Glück, 12 % Notarkosten bei Misserfolg) und **Viertel-Angebot** der Gruppe (annehmen = Geld + 5 % Gewinnabführung jährlich; ablehnen = sofort 2 Adressen weg; ignorieren = nach 8 Wochen nimmt sie sich eine Adresse — alle drei endgültig).

### Verben je Epoche
**In allen vier Epochen identisch (7 Spielverbfamilien)**: `gegner:zuvorkommen:*`, `gegner:abwehren:*`, `gegner:abloesen:*`, `gegner:hinhalten:*`, `gegner:zukaufen:*`, `gegner:beschwerde`, `gegner:gegenzug` (+ UI: oeffnen/blatt/seite/zeige). Kostüm je Epoche über drei Verblisten-Ebenen: `ep().verben` (Bild-Verben: „erwirkt Recht und Gunst" → „listet das Haus aus"), `D.verbenMittel` (14 mittelgenaue Verben, „steht Gevatter" statt Epochenverb), Beschwerde-/Hinhalte-/Absicht-Namen (Klage vor dem Stadtgericht / Anzeige bei der Zunftlade / Restschuld nachrechnen / Anzeige beim Bundeskartellamt; Fass an den Wirt / Fass an die Bruderschaft / Freibier / WKZ in Bier).
**Nur 1970 (+3)**: `gegner:mitbieten:0..2`, `gegner:angebot-ja`, `gegner:angebot-nein`. KI-Zuglisten: 9 Arten je Epoche (E2 mit doppeltem entreissen-Eintrag), Konzern eigene 6er-Liste; „Die Zugliste ist in keinen zwei Epochen dieselbe — geprüft, indem jede Epoche eigene Zugschlüssel hat" (gegner-daten.js:14–15).

### Daten (gegner-daten.js)
671 Zeilen: 2 Häuser (Kassen 320/2.200/62.000/1,2 Mio; Nordstern 4,2 Mio), Vornamen/Titel je Epoche, 6 Wesen, je Epoche: Währungs-/Ablösesätze, 3–4 Mittel (satz/jahre/abschlag/fest), Gegenzug, Beschwerde, Hinhalten, Absicht, 6–7 Gegner-Bauten mit `spiegel` auf STADT-Aufbauten, Zuglisten mit Gewichten und `abJahr` (Gleis ab 1839, Email ab 1890, Linde ab 1876), E4 zusätzlich `gebot` (6 Brauereinamen, 3 Stufen) und `angebot`; global `abschlagKappe` 0,03, `vorsprungKappe` 3, `sichtbar`-Ortsliste, `kurz`-Kürzel, `untergang`-Stufen.

### UI
Alles in `ebene marken` (mit `data-frei` von der STADT-Kartenschicht abgemeldet): Namensschild+gemalte Zahlenzeile+Wochenzettel je Haus (Welle 11: eine Karteikarte → gemalte Schrift), Hofbild nur E1/E2 (E3/E4: auf der Platte gemalt — „Attrappe über dem Bild" vermeiden, gegner.js:2236–2242), an jedem umkämpften Giebel ein **Knopfstapel** (zielt/hält/wirbt + 2 Hinhalte-Knöpfe + Kennzahlzeile „umkämpft · Kasse reicht n×"), Zugspuren (3 Wochen), grauer Wagen, Klage-Knopf am Markt, Angebots-/Notarzettel, Band **„OHNE DICH GESCHEHEN · n Züge"** (mit `data-reiter`, damit die Zahl den `schmal`-Modus der STADT-Reiterzeile überlebt — R16, gegner.js:2920–2945); Vollblatt „Das Haus gegenüber" in `ebene blatt` (gesperrt solange Michaelitafel offen: `tafelOben()` prüft `[data-zug="preis:tafel-zu"]`). **Ausweichsystem**: Sperrzonen aus gemessenen STADT-Beschriftungen (einmal je Epoche) und wachsenden PREIS-Griff-Rechtecken (je Woche + max. 12 Bildaufbauten je Epoche), waagerechte + senkrechte Ausweiche + Randwache `randDx` (gegner.js:127–450).

### Qualität
- **Cross-DOM-Kopplungen**, selbst als Risiko benannt: `.pr-griff`-Selector („WENN DER PREIS SEINEN GRIFF UMBENENNT, greift das lautlos nicht mehr", gegner.js:307), `#ebene-bau .stadt-name…`, `preis:tafel-zu`; `bierpreis()` liest PREIS_DATEN mit hartem Fallback `[9,26,48,130]` (gegner.js:458–463); Einheitenwechsel hart an `jahr() >= 1872` (gegner.js:465–472).
- Zwei ausführlich dokumentierte **Eigenfehler-Grabsteine** (Zonen-Merker der ersten Anläufe, Anlaufzähler der „nach dreien für immer auf", gegner.js:204–221, 312–338, 376–383).
- `messeGriffe()`-„nur wachsen"-Vereinigung paart alte/neue Rechtecke **per Index** (gegner.js:354–363) — bei wechselnder Griffanzahl/-reihenfolge werden fremde Rechtecke vereinigt (mild, monoton, aber unscharf).
- **Einziges der vier Stücke mit Spielstand-Sicherung** (`B.stand.melde('gegner', …)`, 27 Felder, Welle 13, gegner.js:3524–3569) — Asymmetrie: SUD/PREIS/STADT verlieren ihren Eigenzustand beim Fortsetzen.
- Magic Numbers dicht gestreut: Werbepreis 0,45/Abwehr 0,62, Bau-Selbstkosten 18 % des Grundwerts, Erholung 0,35, Unglück 8–22 % Kasse, Schutz 2–4 Jahre, Zorn 3, Zuege-Ringpuffer 140, Wagen-Sperre 6 Wochen.
- Globaler Escape-Handler auf `document` (gegner.js:3690–3695).

---

## 5. Verbliste / Kostüm-Frage (Zusammenfassung)

**Spielverben je Epoche (mechanische Zugfamilien, dedupliziert Brett/Zettel/Blatt):**

| Stück | 1350 | 1600 | 1884 | 1970 | davon in allen 4 identisch |
|---|---|---|---|---|---|
| DER SUD | 10 | 10 | 9 | 13 | **4** (Gärraum, Hefe führen, Anstich jung/alt) — 24 Achsenoptionen strikt epochendisjunkt, +2 nur 1970 (Charge frei/verschneiden) |
| DER PREIS | 6 | 6 | 6 | 6 | **6** (nimm, festlege, nichts, tafel-zu, tafel, chronik) — Epochendifferenz vollständig in Daten (14/15/14/16 Angebote, 8/7/5/5 Festlegungen, 0 gemeinsame Einträge) |
| DIE STADT | 7 | 7 | 7 | 7 | **6** (bau + 5 Rahmenverben); Verwertung: 1 Verb mit 4 disjunkten Schlüsseln und echten Regelunterschieden (E3 bleibt+Zins, E4 endgültig) |
| DER GEGNER | 7 | 7 | 7 | 10 | **7** (zuvorkommen, abwehren, ablösen, hinhalten, zukaufen, Beschwerde, Gegenzug); +3 nur 1970 (mitbieten, Angebot ja/nein) |
| **Summe** | **30** | **30** | **29** | **36** | **≈ 22–23** |

**Antwort auf die Kostüm-Frage:** Von rund 30 Spielverben je Epoche sind **~22–23 in allen vier Epochen mechanisch identisch** und nur sprachlich/parametrisch kostümiert (epochale Namen, Preise, Fristen, Nebenbedingungen). Echt epochenexklusiv sind: die **24 SUD-Verfahrensoptionen** (das einzige Stück, das „Kein Verb kommt in zwei Epochen vor" als Bauprinzip trägt, sud.js:25), die **2 SUD-Chargenverben** und **3 GEGNER-Verben** (nur 1970), sowie die **4 STADT-Verwertungsverben** (Kostüm mit echten Regelvarianten). Das Kostüm ist allerdings mehrschichtig und teils regelwirksam: die vier SUD-Gärraum-Nebenbedingungen (Grenze/Kopplung/bedingte Wirkung/Lieferzeit) und die vier GEGNER-Bindungswährungen (inkl. E3-Tilgungsmathematik, E4-Listung) ändern die Entscheidungsstruktur, nicht nur die Wörter; bei PREIS und beim STADT-Bauen dagegen ist die Epoche zu 100 % Dateninhalt bei identischem Verbgerüst.