# Inventur Brauhaus-Imperium (Branch `claude/brauhaus-imperium-sim-163s85`)

## a) Assets: `spiel/bild/` (13,6 MB) und `spiel/ton/` (7,6 MB)

### spiel/bild/ — 14.303.192 B gesamt

| Pfad | Dateien | Format | Größe | Status |
|---|---|---|---|---|
| `bild/` (Wurzel) | 4 + LIESMICH.md (17,6 KB) | jpg | platte-1350 990 KB · platte-1600 1005 KB · platte-1884 1001 KB · platte-1970 1295 KB | **alle 4 referenziert** (`stuecke/stadt-daten.js:25,33,42,56`) — die vier Epochenplatten |
| `bild/hof/` | 48 | webp | 5,4 MB | **alle 48 referenziert** — per Node gegen `stadt-daten.js` (aufbauten+fracht+rauch) geprüft: 0 Waisen, 0 fehlende. Pfadbau `stadt.js:47` (`'bild/hof/'+name+'.webp'`) |
| `bild/gegner/` | 7 png + LIESMICH | png | 2,6 MB | **hof3.png (425 KB) und hof4.png (250 KB) TOT** — `gegner-daten.js:436` „KEIN hofbild: 1884 steht seine Brauerei auf der Platte selbst", ebenso :603 für 1970. Genutzt: hof1, hof2, wagen1 (Ep. I+II), wagen3, wagen4. wagen2 fehlt planmäßig |
| `bild/name/` | 4 png + LIESMICH | png | 1,8 MB | alle 4 referenziert (`name-daten.js:82,112,144,175`: zeiger1/schild2/saeule3/tafel4, je Epoche eines, nur sichtbar wenn Träger läuft, `bildWenn`) |
| `bild/fuhre/`, `bild/preis/` | je nur LIESMICH.md | — | 8 KB | **leer by design** — FUHRE und PREIS zeichnen rein per CSS/DOM/SVG |

### spiel/ton/ — 7.928.305 B gesamt

| Pfad | Dateien | Format | Größe | Status |
|---|---|---|---|---|
| `ton/klang/` | 49 | mp3 | 7,7 MB | **exakt 49 von 49 referenziert** — Klangtabelle in `kern/ton.js` (je/stets/altNeu-Aufrufe) gegen Dateiliste per `comm` geprüft: 0 fehlend, 0 Waisen |
| `ton/{fuhre,gegner,name,preis,stadt}/` | je nur LIESMICH.md | — | — | leer by design — alle Klänge zentral über `BRAUHAUS.ton.spiele('stueck:zeichen')`, `ORDNER='ton/klang/'` (`ton.js:55`) |

Klang-Deckung je Epoche: bett1–4, hof1–4, woche1–4, sud1–4, abfahrt2–4 komplett; kleine Zeichen decken 4 Epochen per `altNeu(alt,neu)` (bau1/bau4, drueben1/4, nachbar1/4, siegel/maschine, muenzen/kasse, karren/telefon) — **Epoche II (1600) borgt fast überall den 1350er-Klang**, eigene E2-Varianten existieren nicht.

### Erstaufruf-Gewicht (Sperrlisten-Veto 8 MB)

- `spiel/index.html` (7 KB) lädt **eingefroren** 16 CSS (374 KB) + 33 JS (kern 282 KB + stuecke 1.420 KB) = **~2,08 MB Code**, keine Module, keine Web-Fonts, kein Netz (`spiel/index.html:19`).
- Bilder Stufe 0 (Platte + kompletter Epochenkatalog + Fracht, `stadt.js:2151ff` `vorladen()`), selbst nachgerechnet: **1350: 15 Dateien/2,65 MB · 1600: 17/2,92 · 1884: 18/3,13 · 1970: 17/2,57**. Stufe 1 (idle, `stadt.js:2159`): nächste Platte + deren Erbe-Bestand.
- Ton lädt **nichts vor der ersten Geste** (`ton.js:606` „Es wird NICHTS geladen, bevor Ton wirklich gebraucht wird", XHR ab :623; `klang.js`/`klang.css` werden von ton.js:2006ff nachinjiziert).
- Offiziell zuletzt gemessen (`werkbank/schuss/rahmen-w12/ARBEITSSTAND.md:497`): **6,43 / 7,80 / 6,75 / 4,81 MB je Epoche** — alle unter dem Veto, **1600 mit nur 0,20 MB Luft am knappsten**.
- Das Veto selbst: `gauntlet/MESSLATTE.md:322` „Sperrliste — keine Latte … Neu am 4. August 2026: das Gewicht. Ein Aufruf lädt derzeit 23 MB in 85 Anfragen … **Obergrenze 8 MB** für den ersten Aufruf … ein Veto, keine Latte".
- Bekannte Reserve: **1,17 MB „unumgestellte fremde PNG" in der schwersten Epoche** (`werkbank/LAUFENDER-AUFTRAG.md:~1030`): `name/schild2.png` 683 KB + gegner-PNG; `bild/name/` (1,8 MB) und `bild/gegner/` (2,6 MB) sind noch PNG statt WebP.

## b) zielbild/ — 18 MB

5 JPGs (01-1350 3,50 MB · 02-1600 3,64 · 03-1884 4,05 · 04-1970 3,57 · **05-2025 3,50**), README.md (8 KB), `prompts/` mit 5 Prompt-Texten (2,5–4,9 KB).

**Verfahren** (README.md:3–8): Zielbilder = **Messlatte für den Gauntlet Loop** nach Shumers „Claude of Duty" — der gebaute Renderer wird blind daneben gehalten; solange das Zielbild gewinnt, zurück an den Builder. Erzeugt mit `design/tools/gen_image.py`, `gemini-3-pro-image`, 16:9/2K; `03-1884.jpg` frei als Stilanker, die anderen per `--ref` abgeleitet; 05-2025 von 04-1970 abgeleitet (3 Würfe, dokumentiert README:50–56).

**Ja, es gibt ein 2025-Zielbild trotz nur 4 Epochen** — README:32–40 stellt klar: „`05-2025.jpg` ist **keine beschlossene fünfte Epoche**", es macht Frage (G) aus `gauntlet/EPOCHENBOGEN.md` prüfbar (Epoche IV beansprucht 1914–2025, Schaujahr 1970, aber „kein Spielstand erreicht je ein Jahr nach ~1984"). Inhalt: Sudhaus hinter Glas, Solar, Verbrauchermarkt, Adler-Anlage größer als die eigene, Euro. Dokumentierte Restfehler: „GEGR. 1356" (1884), „CU NEHKER" statt ST. MICHAEL und verschwundenes „BRAUEREI ADLER" (2025). HUD-Zahlen stimmen nur bei 2 von 4 Blättern mit `kern/welt.js:140` überein (README:74–90) — Anschauung, keine Spezifikation.

## c) KONZEPT.md (441 Zeilen) — Kernideen vs. heutiges Spiel

Kernideen: Haus statt Person über 700 Jahre (§4); 3 wählbare Herkünfte (§5); 4 ungleiche Epochen mit Kernverben überleben/besitzen/skalieren/bedeuten (§6); drei Uhren — Amtszeit/Braujahr Michaeli–Georgi/Sud (§7); drei Bedientiefen (§8); Sorten als Strategien mit Haltbarkeit=Reichweite (§9); Tycoon-Verben, Transport als Mittel (§10); „Zahlen leben in Gegenständen", kein Excel (§11); historischer Anker-Katalog (§12); Marktmodell „Orte statt Prozente", Bindung/Ablösung, epochenabhängige Währung der Bindung, Abgabe auf Stärke, benannte Biere, Gegner als Häuser, Qualität als Größe (§13).

**Angekommen:**
- 4 Epochen/Kernverben → 4 Szenarien 1350/1600/1884/1970 (`uhr.js:224` „Es geht ums <verb>"); Braujahr-Wochentakt (`uhr.js:345`); Bühne=Platte+Gegenstände statt Menüs; benannte Absatzorte + Ablösung (DER PREIS/DER GEGNER); Gegner „Brauerei Adler" als Haus mit eigenem Hof und Wagen; Biernamen existieren (Kofent/Nachbier/Einfachbier/Handelsmarke, `spiel/BEFUND-ENDE.md`); Erbfall als Stück (DAS ERBE, nachträglich „in die erreichbare Zeit geholt", `erbe.js:1–30`); Marke/DER NAME (Bierzeiger→Werbetafel); Fuhre-Disposition als Kernverb (aus `design/vorschlag-fuhre/`).
- Epochenwechsel-Code existiert (`uhr.js:221–226`), Spielende existiert (`uhr.js:267`).

**Nicht angekommen:**
- **Keine durchgehende 700-Jahre-Partie**: Partie endet nach ~3 Braujahren (`BEFUND-ENDE.md`: alle 4 Epochen enden 1353/1603/1887/1973 mit Grund `keine-abnehmer`) — der Epochenübergang ist de facto unerreichbar, Generationenfolge findet nicht statt.
- Herkunftswahl (Kloster/Hof/Stadt) — fehlt komplett.
- Drei Bedientiefen — fehlen.
- Sortenbaum — degeneriert (je Partie eine Sorte, BEFUND-ENDE-Tabelle).
- Chronik als Braubuch-Ästhetik — Chronik ist nur Textzeile im HUD.
- Gruit-vs-Hopfen als politischer Konflikt, Dreißigjähriger Krieg (Ep. II), Abgabe auf Stärke, Qualität als eigene verlierbare Größe — nicht nachweisbar implementiert.
- Gegenwart/2025 — existiert nur als Zielbild.

## d) design/ — 186 MB, Struktur + Kernaussagen

Wurzel: BRIEFING.md, BRIEFING-WELLE-2/3, JURY.md, **PRUEFUNG.md** (33,6 KB, 366 Z.), **REFERENZEN.md** (91,6 KB Fakten-Dossier), WERKZEUGE.md, `tools/` (2 py, u. a. `gen_image.py`).

| Ordner | Dateien | Größe |
|---|---|---|
| pfad-1-braubuch | 4 jpg+gif+md | 11 MB |
| pfad-2-vogelschau | 4 jpg+gif+md | 13 MB |
| pfad-3-schild | 10 jpg+gif+2 md | 29 MB |
| pfad-4-karte | 10 jpg+2 md | 27 MB |
| pfad-5-modell | 10 jpg+gif+2 md | 29 MB |
| pfad-6-frei | 4 jpg+md | 14 MB |
| welle2-gegenueber | 13 jpg+2 md | 34 MB |
| welle2-synthese | 13 jpg+2 md | 30 MB |
| jury/ | 4 md | 140 KB |
| feedback/ | 6 md | 156 KB |
| vorschlag-fuhre/ | VORSCHLAG.md+bild.html+bild.png | 1,9 MB |

- **PRUEFUNG.md**: Faktencheck der 6 Pfade gegen das Dossier; Fundliste A1–A12 (Destillierblase statt offener Braupfanne als „Modellreflex" zweier Designer, Emailschild vor 1890, DDR-Standortpunkt, Marktanteilsfalle „3 von 4 falsch"; Pfad 5 „immun", weil Museumsmodell Darstellung, nicht Behauptung). Im Gauntlet ist sie **die Sperrliste** (`gauntlet/PROMPT.md:29`: „Ein Fund dort disqualifiziert", gewinnt nie); §4.1 dokumentiert den `--ref`-Effekt, der Kleinschrift neu würfelt. Das 8-MB-Gewichtsveto kam später dazu (MESSLATTE.md:322).
- **jury/** (4 Voten): Designer empfiehlt `welle2-synthese` („Erdlinie") als Gehäuse mit Zukäufen aus gegenueber/pfad-5/pfad-3/pfad-4 — einzige Kombination mit „vier Knappheiten gleichzeitig auf demselben Blatt"; Karte nie als Brett („Fläche lädt zum Ausmalen ein"). Fach: „Haltbarkeit als Reichweite" ist die stärkste Einzelentscheidung, aber Sommer vor Entfernung; Hefeführung als geschenkter Epochenbruch. Kritiker: Maßstab „will das Spiel in Stunde drei noch etwas von mir". Technik: rechnet nach, was **eine Person mit KI-Werkzeugen** bauen kann; lieferte die 3 Verben des ersten spielbaren Ausschnitts.
- **vorschlag-fuhre/VORSCHLAG.md**: nach beiden gescheiterten Prototypen der eigentliche Bauplan des Spiels — „Die Bühne zeigt einen Betrieb, der läuft; die Hand des Spielers … verteilt jede Woche die Fässer, die da sind, auf die Häuser, die mehr wollen, als da ist" (§2); Diagnose: alle 6 Pfade hatten „Bedienung planmäßig aus dem Bild verbannt".
- **feedback/**: 6 Personas (Braumeisterin, Brettspieler, Historikerin, Markenstrategin, Veteran, Wirt); der eine Befund, der KONZEPT §13 erzeugte: „**Es gibt kein Gegenüber**" — niemand trinkt das Bier, kein Wirtshaus in 18 Bildschirmen; Markenstrategin: „Eine Zahl, die mir gehört, ist keine Marke."

## e) Wurzel-index.html, netlify.toml, prototyp/

- **`index.html` (7,5 KB) = Fortschrittsseite „Brauhaus — Werkbank"**: rein statisch, lädt `werkbank/stand.json` alle 30 s (Z. 189, 225), zeigt Messlatte, Kennzahl-Kacheln, je Stück ein Bildpaar „Gebaut vs. Messlatte" plus „größte verbliebene Lücke", und die Chronik. Für alle Builder tabu (`spiel/LIESMICH.md` Regel 1).
- **`netlify.toml`**: `publish="."`, kein Build — **die gesamte Repo-Wurzel wird deployed** (inkl. 186 MB design/, 145 MB werkbank/, 18 MB zielbild/); `Cache-Control: no-store` nur für `werkbank/stand.json` und `werkbank/schuss/*`.
- **`prototyp/`** (1,1 MB + Voten): der Vor-Gauntlet-Stand. `klickdummy.html` (74 KB, „Brauhaus zum Anker — Fünf Braujahre": Blätter-Klickdummy) und `demo/index.html` (979 KB Eindatei-Demo „Die Fuhre") mit `demo/pruefen.mjs` (Playwright-Prüflauf) und PRUEFLAUF.md; je zwei Voten auf beiden Ebenen. Urteil VOTUM-GESTALTER: Blatt 5 besteht, Blatt 8 mit Auflage, Blatt 6 fällt durch; Kernerkenntnis (in VORSCHLAG.md §1): „Das technische Blatt ist ein Berichtsformat, kein Bedienformat … Der Auftraggeber saß davor und fand keinen ersten Zug."

## Was für ein volles Spiel FEHLT

**Bilder**
1. Keine Gegenwarts-Platte (2025) im Spiel — Zielbild existiert, Epoche nicht (Entscheidung G offen, `gauntlet/EPOCHENBOGEN.md`).
2. `bild/name/` und `bild/gegner/` unkomprimiert als PNG (4,4 MB) — bekannte, offene Umstellung; 1600 hat nur 0,20 MB Luft unterm 8-MB-Veto.
3. Tote Dateien: `bild/gegner/hof3.png` + `hof4.png` (675 KB).
4. `bild/fuhre/`, `bild/preis/` haben nie Bildmaterial bekommen (funktioniert per CSS, aber der Zielbild-Look von Fässern/Wagen der eigenen Fuhre bleibt Code-Grafik).

**Ton**
5. Epoche II hat kaum eigene Klänge — sie erbt per `altNeu`-Muster fast überall den 1350er-Klang (eigene bau2/drueben2/nachbar2 fehlen); ansonsten ist der Klang je Epoche vollständig (Bett/Hof/Woche/Sud je 4/4, 49/49 Dateien genutzt).

**Texte/Systeme (die großen Löcher)**
6. **Kein erreichbarer Epochenübergang, keine Generationen-Erzählung**: jede Partie endet nach ~3 Braujahren (`keine-abnehmer`), „und sagt es nicht" (`spiel/BEFUND-ENDE.md`) — Endscreen/Bilanz/Abspann fehlen.
7. Herkunftswahl, drei Bedientiefen, Sortenbaum (>1 Sorte pro Partie relevant), Chronik/Braubuch als Artefakt, Gruit-Konflikt, Ep.-II-Ereignis (Krieg), Abgabe auf Stärke, Qualität als verlierbare Größe — alles KONZEPT-Kernmaterial ohne Implementierung.
8. Wirtschafts-Eichung unfertig: `spiel/BEFUND-WIRTSCHAFT.md` §5 — „die Nacharbeit selbst ist **nicht** gemacht"; Erbfall-Inhalte erst seit Welle 11 überhaupt erreichbar (`erbe.js` Kopf: vier gebaute erbfall-Handler, „keiner ist je gelaufen").