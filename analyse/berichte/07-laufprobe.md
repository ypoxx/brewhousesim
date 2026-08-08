# Laufprobe Brauhaus-Imperium — Befund (2026-08-08, Branch-Worktree simtree)

Server: `python3 -m http.server 8950` in simtree, `curl` lieferte 200/7046 B für `/spiel/`. **Server am Ende beendet (curl → 000, Port zu).** Alle Läufe: Chromium headless via Playwright, Viewport 1920×1000 (Lesbarkeit: 1366×768).

## 1. Ladeprobe je Epoche (`?epoche=N&saat=1350&neu=1`, 2 s Wartezeit)

| Epoche | Jahr | Ressourcen | Ladegewicht (transferSize inkl. Dokument) | JS-/Konsolen-/Request-Fehler | Startkasse |
|---|---|---|---|---|---|
| 1 (1350 · Das Recht) | 1350 | 69 | **6.907.119 B ≈ 6,9 MB** | **0** | 112 Pf |
| 2 (1600 · Die Ordnung) | 1600 | 75 | **8.348.865 B ≈ 8,3 MB** | **0** | 640 fl |
| 3 (1884 · Die Maschine) | 1884 | 73 | **7.244.052 B ≈ 7,2 MB** | **0** | 14.250 M |
| 4 (1970 · Die Marke) | 1970 | 67 | **5.213.894 B ≈ 5,2 MB** | **0** | 86.000 DM |

Ersteindruck (aus den Start-Screenshots): jede Epoche hat eine **eigene, vollständige illustrierte Stadtansicht** (1350: Fachwerk/Stadtmauer/Ochsenkarren; 1600: Hopfengärten/Mühlrad; 1884: Schlot, Dampflok, Stahltanks; 1970: Plattenbauten, LKW, VW Käfer, Silos). Kopfleiste oben zeigt einheitlich: Monat+Jahr, KASSE, Rohstoff (GRUT 40 / HOPFEN 65 / HOPFEN 120 / HOPFEN 340), Lager (KELLER 4/12 Fass / GEWÖLBE 8/24 / EISKELLER 11/135 hl / TANKS 210/600 hl), WOCHE 1/30, CHRONIK, BUCH. Startanschlag unten links, wörtlich identische Rahmentexte plus Epochensatz, z. B. E1: „Du führst dieses Haus: brauen, ausliefern, die Abnehmer halten, die Abgaben zahlen. Ein Kessel, ein Braurecht, eine Stadt. Bier verdirbt in Tagen." — **Zielsatz:** „DAS ZIEL — das Haus übergeben können, an die nächste Hand, vor dem Rat. Gewinnen heißt hier nicht groß werden, sondern übergeben können…", dazu „SO ENDET ES SCHLECHT — wenn niemand in der Stadt mehr abnimmt, ist das Haus zu." und „JEDE EPOCHE IST EIN EIGENES SZENARIO — 1350, 1600, 1884, 1970 … keine wächst in die nächste hinüber." Rechts oben steht schon beim Start die Michaelitafel-Kurzbox (z. B. E1: „Anschlag 1350 515 Pf · billigstes Angebot 33 Pf · Kasse: dieses Angebot 3,39×"). Bereits in Woche 1 sind 75–81 aktive Knöpfe da.

Schönheitsfehler im Startbild: rechts überlagern sich Gegner-Beschriftungen teils gegenseitig bzw. mit der Michaelitafel-Box (E1: „Fass an den Wirt / lieber zukaufen / 1 Fass · 12 Pf" läuft in die Tafel; „Vorsprung: 2 Dinge · wirbt 2 Wo. kürzer" über dem Adler-Schild). Der Zielzeile unten („Ziel: das Haus weitergeben · solange es steht …") fehlt Kontrast — halbtransparente Monospace über der Illustration, schwer lesbar.

## 2. Spielbarkeitsbefund: 15 Runden gespielt (E1 und E4)

Spielweise je Runde: `sud:zettel-anstich`, 2–3× `fuhre:laden:*`, `fuhre:abschicken`, `fuhre:fuellen`, in W3 Stadt-Reiter (Brett) geöffnet, in W5 `preis:tafel`, dann WEITER. **Befund am Rande, verifiziert:** `fuhre:abschicken` mit beladenem Karren schaltet die Woche selbst weiter (Woche 1→2 ohne WEITER-Klick); jede Runde = 2 Spielwochen, die 15 Runden deckten also die vollen **30 Wochen bis Michaeli** ab, und in beiden Epochen öffnete sich zum Jahresschluss automatisch die **volle Michaelitafel** (Jahresrechnung, 5 Angebote, 3–4 Festlegungen, „Was fällig wird"-Vorschau bis ~20 Jahre, Leiter-Tabelle, „Das Jahr beginnen").

- **JS-Fehler in beiden 15-Runden-Läufen: 0.** WEITER war in allen 30 Klicks (15+15) klickbar, nie blockiert.
- **„Nur WEITER möglich": kam nie vor — 0 von 15 Wochen.** Je Woche standen 79–98 sichtbare aktive `data-zug`-Knöpfe bereit; nach Abzug reiner UI-Öffner (Reiter, Chronik, Ton, Blätter) blieben **57–76 echte Handlungsverben pro Woche** (E1: 57–65, E4: 61–76).
- Angebotene Verbfamilien (beobachtet): `sud:zettel-anstich/-hefe-fass/-wechsel-*`, `fuhre:laden:*/abschicken/fuellen/listen:*/tafel-auf|ab:*/kauf:lastzug|sudwerk|rohstoff/ziel:bar|borg`, `gegner:abloesen|hinhalten|zukaufen:*/beschwerde`, `name:jetzt:*/herumgehen/ruhe`, `erbe:tafel:verschreibe/uebergabe:leibgeding|abfindung|bruch`, `stadt:bauhof/reiter:*/ortsmarken`, `preis:tafel/chronik-auf`, dazu unten links wechselnde Wochen-Entscheidungskarten (z. B. E1 W6: „Mühlschenke: 2 magere Jahre, seit 9 Wochen kein Fass" mit drei Antwortknöpfen „Weiter wie zuletzt", „Fahren: die mageren Häuser · 5 Fass +37 Pf", „Fahren: nach Durst · 5 Fass +38 Pf").
- **Kassenverlauf E1** (aus der Kopfleiste, je Runde vor WEITER): 109→97→93→97→93→89→84→80→67→71→67→63→58→62→66 Pf, nach Michaeli-Abrechnung **56 Pf**. D. h. schleichender Verfall ~1–5 Pf/Woche trotz Ausliefern (Bar-Erlös steht „im Holz bis Michaeli" im Kerbholz, Brett W3: „DAS KERBHOLZ BEIM WIRT im Holz bis Michaeli: 30 Pf"). Auf der Michaelitafel 1351: Rechnung −145 Pf, Anschlag 470 Pf, billigstes Angebot 34 Pf ist nehmbar, aber **keine einzige Festlegung bezahlbar** („HEUTE KEINE … die billigste kostet 88 Pf, es fehlen 32 Pf").
- **Kassenverlauf E4**: 87.491→84.182→80.849→81.513→86.342→89.875→89.956→88.978→87.997→86.647→85.617→84.578→83.536→82.497→81.414 DM, nach Jahresschluss **74.844 DM**. Erst Investitionsdelle, dann Erholung, dann Zehren; auf der Michaelitafel 1971 sind 3 von 5 Angeboten bezahlbar und eine Festlegung bringt sogar Geld („Der Liefervertrag mit der Nordstern-Gruppe … Festlegen — Geld herein +77.000 DM").
- Bretter funktionieren: Reiter-Klick öffnete in W3 das Brett „OHNE DICH GESCHEHEN" (Gegnerzüge mit „zeigen"-Knöpfen, Ablösungsspannen); Text-Auszug E4: „DIE HÄUSER wollen 912 · im Keller liegen 0,0 hl ‚Gaststätte Neustadt, Bestellung offen: 330 hl. Bitte Tourenplan prüfen.'…". `preis:tafel` in W5 öffnete die Michaelitafel im Rückblick-Modus (Angebote ausgegraut „Michaeli ist vorüber").

## 3. Spielstand-Test

- **Achtung Semantik:** mit `?neu=1` in der URL wird grundsätzlich **nie gespeichert** (Modus 'neu', spiel/kern/stand.js:44). Ein erster Test „5 Wochen unter neu=1 spielen, dann ohne neu laden" ergibt darum scheinbar Verlust — das ist gewollt.
- Korrekt (Normalmodus `?epoche=1&saat=1350`): 5× WEITER → Stand 1350/W6, Kasse 91, `B.stand.zeile()`: „STAND spiel · brauhaus:1:1350 · liegt vor · 5× geschrieben, zuletzt 12457 Zeichen" (Sicherung synchron je Wochenwechsel). **Reload ohne `neu=1`: Stand bleibt** — 1350/W6, Kasse 91, „fortgesetzt 1350/6". **Reload mit `neu=1`: frisch** — 1350/W1, Kasse 112, Speicher geräumt. Keine Fehler.

## 4. Lesbarkeit 1366×768, Epoche 1 (`probe/e1-klein.png`)

- Sichtbare Textknoten: **390**, davon **64 mit computed font-size < 12 px (16 %)**. Verteilung: 6 px: 7 · 7 px: 21 · 8 px: 21 · 9 px: 11 · 10 px: 2 · 11 px: 2; Grundtext 12 px: 321. Die 6–8-px-Knoten (v. a. Gegner-/Karten-Beschriftungen wie „lieber zukaufen · 1 Fass · 12 Pf", Erbe-Leiste) sind auf 1366×768 faktisch unlesbar.
- Sichtbare Buttons: **94, davon 0 kleiner als 24×24 px** — Knopfgrößen sind in Ordnung.
- Optisch: Layout skaliert ohne Scrollbalken; oben rechts kollidieren Kartenbeschriftungen mit der Michaelitafel-Box stärker als bei 1920 px.

## 5. Ton

- Beim Laden: **0 Requests auf `/ton/`**, aber je Epoche wird **1 AudioContext** angelegt (gewrappter Konstruktor, `window.__acCount`=1; `B.ton` existiert).
- Beim Spielen laden die Dateien lazy: E1-Lauf **28** `/ton/`-Requests (u. a. `ton/klang/drueben1.mp3`, `bett1`, `hof1`, `grund`, `sud1`, `fassholz`, `abfahrt2`, `ochse`), E4-Lauf **26** (epochenspezifisch `drueben4`, `bett4`, `hof4`, `sud4` …). Ob hörbar abgespielt wird, ist headless nicht prüfbar — kein Fehlerbefund.

## 6. Gesamteindruck

Das Spiel ist heute in allen vier Epochen **lauffähig, fehlerfrei (0 JS-Fehler in allen Läufen), inhaltlich dicht und über ein volles Braujahr inklusive Jahresabschluss spielbar**; Speichern/Fortsetzen funktioniert. Schwächen: 6,9–8,3 MB Ladegewicht (E2 am schwersten), 16 % Kleinsttext unter 12 px auf Laptop-Auflösung, Beschriftungs-Überlappungen am rechten Kartenrand, und der E1-Einstieg ist ökonomisch hart (Kasse fällt auch bei aktivem Spiel bis Michaeli auf die Hälfte, keine Festlegung erreichbar).

## Screenshots (alle unter `«probe-ordner»/`)

- `e1-start.png`, `e2-start.png`, `e3-start.png`, `e4-start.png` — Startbilder 1920×1000
- `e1-w15.png`, `e4-w15.png` — nach 15 Runden (= Michaelitafel 1351 bzw. 1971 offen)
- `e1-brett.png`, `e4-brett.png` — Brett „OHNE DICH GESCHEHEN" in Woche 3
- `e1-michaelitafel.png`, `e4-michaelitafel.png` — `preis:tafel` in Woche 5 (Rückblick-Modus)
- `e1-klein.png` — Epoche 1 bei 1366×768

Messdaten: `start-probe.json`, `spiel-probe.json`; Skripte `start-probe.mjs`, `spiel-probe.mjs`, `stand-lesbar-probe.mjs`, `stand2-probe.mjs` im selben Ordner. Am Worktree wurde nichts verändert.