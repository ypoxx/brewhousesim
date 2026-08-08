# Prozessanalyse und Empfehlung für den nächsten Loop

## 1. Was der bisherige Loop richtig gemacht hat — beizubehaltende Prinzipien

1. **Blinde Kritiker mit frischem Kontext und kodifizierter Leseliste** (WELLE-13-KRITIK): Der Kritiker sieht das laufende Spiel, nie die Begründung des Builders. Das hat mehrfach echte Fehler gefunden, die der Builder nicht sehen konnte. Beibehalten — inklusive Pflichtabschnitt „Was an meiner Prüfung schwach ist".
2. **Eingefrorene Messstände mit Gegenprüfung** (`messstand.sh`, `.messstand-marke` per curl verifiziert): Die zentrale Sicherung gegen wandernde Ziele. Die Hafen-Verwechslungen (48/48 Scheinabweichungen) zeigen, dass die Gewohnheit „vor der ersten Zahl prüfen, was der Hafen ausliefert" nicht verhandelbar ist.
3. **Vordatierte Maße**: Lesart und Gerät vor Kenntnis der Zahlen festlegen (`probe13.mjs`, „Ein Maß, das erst gebaut wird, nachdem man das Ergebnis kennt, misst nicht"). Das hat zwei falsche Kritiker-Auflagen (A5) widerlegt, bevor sie Bauarbeit gekostet hätten.
4. **Wiederholbarkeitsdisziplin**: sequenziell statt parallel messen (parallel verdirbt die Partie), `messfenster.sh` als Sperre statt Regel, 3 Läufe/eine Prüfsumme mit Eskalation auf 6.
5. **Builder melden Verschlechterungen gegen sich selbst** — hat zweimal Wellen gespart und dabei Fehler der Aufsicht gefunden.
6. **Urteile und Berichte als Repo-Dateien, alles Wiederherstellbare als Skript** („Zweimal von Hand ist einmal zu oft") — die einzige Verteidigung gegen Container-Resets.
7. **„Was nicht kaputtgehen darf"-Listen als Ratchet** je Abnahme; enge Lesart als Grundregel („Kann man eine Abnahme bestehen, indem man nichts tut?").
8. **Datei-Eigentum statt Modulsystem**: 4–8 parallele Builder ohne Merge-Konflikte; Kernwünsche als „KERN:"-Befund an die Aufsicht. Das ist die Voraussetzung für billige Builder (siehe 4).
9. **Messgeräte, die laut scheitern**: getrennte Exit-Codes für „durchgefallen" und „keine Messung" — fünfmal bezahlt, nie wieder hergeben.
10. **Sperrliste als Veto getrennt von Latten** und **Trennproben aus Mischständen** zur Verursacherklärung.
11. **Selbstmessbarkeit des Spiels** (`B.lage`, `data-zug`, `data-bereit`, `haushalt.pruefe`, `runde.nachwehen`): Das Spiel als Messobjekt mit maschinenlesbaren Attributen ist die Basis dafür, dass Checks überhaupt agentenlos werden können.

## 2. Kostentreiber und je eine konkrete Senkung

**a) 400-Wochen-Playwright-Läufe (~272 s) × 4 Epochen × 3–6 Wiederholungen, sequenziell erzwungen.** Der teuerste Messposten, und ein Agent sitzt daneben.
→ *Senkung in drei Stufen:* (1) **Messläufe als CI-/Cron-Skript ohne Agent** — die gesamte Kette (`linie.mjs` → `nenner.mjs` → `auswerten.py`) ist bereits skriptfähig; ein Runner außerhalb des Containers (GitHub Actions o. ä.) fährt sie nachts und legt JSON ab, der Agent liest nur das Ergebnis. (2) **Kurzlauf-Proxy**: 60–100 Wochen mit Prüfsumme als Frühwarnung je Ticket (Faktor 4–6 billiger); der volle 400er nur an Wellengrenzen. Wichtig: Der Proxy muss **einmalig gegen die teure Metrik kalibriert** werden (Korrelation Kurz-ρ vs. Voll-ρ über die vorhandenen Läufe), sonst verstößt er gegen die eigene Messdisziplin. (3) **Langfristig: Sim-Kern headless.** Die Wurzel der Browser-Pflicht ist bekannt und klein: `welt.zugBedienbar()` liest `getBoundingClientRect`, `meldeZug` prüft am DOM. Ein Kernauftrag „Ökonomie-Schnitt: `welt`/`uhr`/`runde` laufen unter Node mit DOM-Stub, Bedienbarkeitsprüfung wird injizierbar" würde ρ-Rechnung in Sekunden statt Minuten erlauben — und parallelisierbar, weil kein Browser-Timing mehr die Partie verzweigt. Achtung: Das ersetzt die Latte 2 **nicht** (sie misst absichtlich die klickende Hand am Bildschirm), es ergänzt sie um eine billige Rechenlatte; die teure bleibt als Eichinstanz an Wellengrenzen. Diese Investition ist die größte Einzelmaßnahme und gehört als eigenes, voll abgenommenes Kern-Projekt geplant, nicht nebenbei — sie berührt die empirisch erkämpfte Determinismus-Doktrin (Vorziehregel, rAF-Messstellen).

**b) Sechsfach-Wiederholungen.** Die Eskalationslogik (3 → 6 nur bei Abweichung) ist schon richtig.
→ *Senkung:* davor noch eine Stufe: **1 Lauf mit Prüfsummenvergleich gegen den letzten grünen Stand**; nur bei Prüfsummenänderung überhaupt 3 Läufe. Für beweisbar partieneutrale Arbeit (Muster GEGENZUG: byteweise gleiche ρ-Aufzeichnung) genügt der Byte-Vergleich vollständig.

**c) Container-Resets (≥23).** Kosten = verlorene Arbeit + Stunden Wiederaufsetzen + zwei fast verlorene Messkampagnen.
→ *Senkung:* Messungen und Veröffentlichung **aus dem Container heraus in CI verlagern** (überlebt Resets per Definition); Agentensitzungen kürzer schneiden (Ticket statt Dauerwelle = weniger Verlustmasse je Reset); `wiederaufnahme.sh` und `aufsetzen.sh`-Disziplin beibehalten.

**d) Große Kontexte.** `LAUFENDER-AUFTRAG.md` 2.537 Z., `fuhre.js` 5.464 Z., Wellenbriefe, Historie — jeder Builder-Start auf starkem Modell mit Volllektüre ist teuer.
→ *Senkung:* Das Repo ist diszipliniert dokumentiert — **das ausnutzen**: je Ticket ein destilliertes Kontextpaket (eigener Brief + `LIESMICH.md`-Bauordnung + die 2–3 einschlägigen §§ aus `ZUSTAENDIGKEIT.md` + nur die eigenen Dateien). Die Historie (`LAUFENDER-AUFTRAG`, alte Wellenbriefe) liest nur die Aufsicht. Für Stücke > 3.000 Zeilen: eine 1-seitige „Stückkarte" (Zustand `Z`, öffentliche API, bekannte Kopplungen) einmalig von einem billigen Modell erzeugen lassen und pflegen.

**e) Repo-Ballast: werkbank ~145 MB Screenshots, design 186 MB, zielbild 18 MB; `netlify.toml` deployt die gesamte Wurzel; Push-413-Fehler.**
→ *Senkung (rein mechanisch, Haiku/Skript):* Belegbilder in einen Artefakt-Speicher oder eigenen Beleg-Branch (bzw. LFS), Netlify-`publish` auf `spiel/` + Fortschrittsseite + `stand.json` einschränken, tote Dateien löschen (`gegner/hof3.png`/`hof4.png`, 675 KB), PNG→WebP für `bild/name|gegner` (4,4 MB; löst nebenbei die 0,2-MB-Luft von 1600 unterm 8-MB-Veto). Einmalige Arbeit, dauerhaft kleinere Klone, Pushes, Deploys, schnellere Resets.

**f) Vier parallele Builder + Aufsicht auf teurem Modell.** → Modellmix, siehe 4.

**g) Gemini-Richter (Auge/Ohr) mit Quoten, Retries, Verweigerungen.** Nicht der große Kostenposten (Einzel-API-Aufrufe), aber Zeitfresser bei Fehlläufen.
→ *Senkung:* Takt auf Wellengrenzen begrenzen und **billige korrelierte Proxys dazwischen**: Die Bild-Latte scheitert nachweislich an der Deckung (11–15 % vs. 3,1 % Ziel) — also ist `deckung-je-stueck.mjs` (Pixel-Deckung, Skript, Sekunden) der Proxy für Latte 1; erst wenn Deckung < 8 % steht, lohnt der nächste Blindvergleich. Analog: `dichte()`/`gestundet()`/Katalog-Deckung als Ton-Proxy vor jedem Ohr-Lauf.

## 3. Qualitätssicherung neu: die Prüfpyramide

Grundsatz: **Alles, was zählt, misst ein Skript; ein Modell urteilt nur dort, wo geurteilt statt gezählt wird.** Alle Schwellen als Ratchet („nie schlechter als der eingefrorene Stand"), alle Geräte mit getrennten Exit-Codes für Durchfall vs. Nichtmessung.

**Stufe 0 — je Commit, Sekunden, reines Skript (Kosten: ~null):**
- `tor.mjs`: 4 Epochen laden, `B.lage` = 0, 0 Konsolenfehler, Züge vorhanden.
- `gewicht-gegenprobe.mjs`: < 8 MB je Epoche.
- Statische Wächter (neu, trivial zu bauen): kein `Math.random()`, keine neuen `setTimeout` im Zeichenweg ohne Freigabevermerk, kein Schreibzugriff außerhalb des Datei-Eigentums (git-diff-Pfadprüfung gegen die Eigentumstabelle), `?neu=1` in jeder Messadresse.

**Stufe 1 — je Ticket-Abschluss, Minuten, reines Skript (Kosten: Rechenzeit):**
- `spielprobe.mjs` (60 Wochen je Epoche echt spielbar).
- `lesbarkeit.mjs` 1366×768 (Ratchet: 257 → nur abwärts).
- `deckung`-Messung Ladezustand + nach 30 Wochen (Proxy Latte 1).
- Kurz-ρ/Prüfsummen-Kurzlauf (100 Wochen, 1 Lauf) — Partieneutralitätsnachweis für mechanische Tickets per Byte-Vergleich.
- `haushalt.pruefe()` auf 2752×1536 (Raster-Befund beachten).

**Stufe 2 — nächtlich bzw. je Wellengrenze, Stunden, Skript ohne Agent (Kosten: Rechenzeit nachts):**
- Volle Latte 2: `linie.mjs` 400 Wochen × 4 Epochen sequenziell, 3 Läufe (6 bei Abweichung), `nenner.mjs` + `auswerten.py`, |ρ| < 0,7 über 12/13/14 Schnitte, 1600 zuerst (Reserve nur 0,162).
- Wiederholbarkeits-Vollprobe, `tempo.mjs`, Haushalts-Vollmessung.
- Ergebnis als JSON/`stand.json`-Eintrag; die Aufsicht liest morgens Zahlen, statt abends zuzusehen.

**Stufe 3 — Modell nötig, nur an Wellengrenzen oder auf Zuruf (Kosten: die einzigen Modellkosten der QS):**
- **Blinder Spielkritiker** (starkes/mittleres Modell, frischer Kontext): das Einzige, was „verkaufen die 20 Minuten?" beantworten kann. 1× je Welle, nie je Nacharbeit. Vorher laufen Stufen 0–2, damit der Kritiker keine Zeit auf Zählbares verschwendet.
- **`auge.py`** Blindbildvergleich: erst wieder, wenn der Deckungs-Proxy < 8 % meldet (seit Welle 9 ohnehin überfällig).
- **`hoerer.py`** Ohr: nur nach Katalogänderungen; die offenen Messlattenfragen (Mehrheitsregel, 1884-Messbarkeit, Gegenzug-Hörbarkeit) vorher vom Auftraggeber entscheiden lassen — sonst misst man Ungeklärtes teuer nach.
- **Sperrlisten-/Faktencheck** neuer Inhalte (nur bei neuen historischen Behauptungen).

## 4. Arbeitsteilung und Modellmix

- **Aufsicht/Planer: 1 Instanz, starkes Modell.** Schreibt Wellenbriefe mit vordatiertem Maß, entscheidet Schwellen (offene R13-Schwelle!), besitzt `kern/**` und git, klärt Widersprüche, interpretiert Stufe-2-Ergebnisse. Sitzt **nicht** mehr neben laufenden Messungen.
- **Builder für regelwirksame Stückarbeit: Sonnet-Klasse.** Das Repo ist dafür ungewöhnlich gut vorbereitet: Datei-Eigentum, `LIESMICH`-Bauordnung, §§-Regelwerk, messbare Abnahmeformeln. Ein Ticket muss enthalten: eigenes Stück + destilliertes Kontextpaket (2d) + Auflagen mit Zahl + Abnahme = benannter Skriptaufruf mit Exit-Code + Verbotsliste. Kein Ermessen über Schwellen beim Builder — Ermessensfragen gehen als Meldung zurück (das Muster „Schwelle zurück an die Aufsicht" aus W13 ist genau richtig).
- **Mechanische Tickets: Haiku-Klasse oder reines Skript.** Kandidaten liegen fertig geschnitten in den Befunden: `B.stand.melde` für fuhre/preis/sud/erbe/name/stadt **nach dem GEGNER-Vorbild** (kopierbare Vorlage, 27 Felder, Abnahme = Feldervergleich nach Reload); PNG→WebP + tote Dateien; `?neu=1` in die fünf Messgeräte; Lesbarkeits-Rest bei GEGNER/NAME/ERBE; dokumentierte Kleinfehler (`fuelle`-Doppeldeklaration in sud.js, totes Ternary, `meldeZug`-3-Argumente in stadt.js); Netlify-Publish-Einschränkung. Merkmale eines Haiku-tauglichen Tickets: eine Datei, existierendes Vorbild im Repo, Abnahme binär per Skript, beweisbar partieneutral (Byte-Vergleich Stufe 1).
- **Kritiker: unverändert Modellarbeit** mit frischem Kontext (Stufe 3); mittleres Modell genügt für Zähl-Kritik, starkes für das Spielurteil.
- **Wellen- vs. Ticket-Betrieb: Hybrid.** *Wellen* (max. 4 parallele Builder — „das Maß, das getragen hat") nur für Arbeit, die ρ bewegen kann: Wirtschaft/Geldproblem (A10, strukturell offen), Verblisten (A11), Epochenbogen (A12), Kernumbauten. Dort gelten volle Stufe-2/3-Abnahmen und die Regel „zwei Stücke, die dieselbe Kennzahl füttern, nie gleichzeitig". *Ticket-Betrieb* (fortlaufend, billige Modelle) für alles Partieneutrale — jede Erledigung dort **ohne** 400-Wochen-Vollabnahme, nur Stufe 0/1 plus Byte-Vergleich.

## 5. Grobe Kostenlogik (qualitativ, je Maßnahme)

| Maßnahme | Einsparung | Begründung |
|---|---|---|
| Messläufe agentenlos (CI/cron statt Aufsicht daneben) | **sehr groß** | Eliminiert den teuersten Posten überhaupt: starkes Modell × Stunden Wartezeit auf 272-s-Läufe; die Skripte existieren bereits, Umstellungsaufwand klein |
| Modellmix (Builder Sonnet, Mechanik Haiku/Skript) | **groß** | Wirkt multiplikativ auf 4 parallele Builder; der disziplinierte Doku-Stand macht billige Modelle erst tragfähig |
| Ticketisierung partieneutraler Arbeit (Byte-Vergleich statt Vollabnahme) | **groß** | Jede vermiedene 400-Wochen-×-4-Epochen-×-3-Läufe-Abnahme spart Stunden Rechen- und Agentenzeit; GEGENZUG hat das Nachweismuster geliefert |
| Kurzlauf-/Proxy-Metriken (100 Wochen, Deckungs-% statt Auge, dichte() statt Ohr) | **mittel–groß** | Faktor 4–6 je Messung; erfordert einmalige Kalibrierung gegen die teure Metrik — sonst Scheinersparnis |
| Repo-Hygiene (145 MB Belege raus, Netlify-Scope, WebP) | **mittel, dauerhaft** | Einmalkosten klein (Haiku); senkt jede künftige Clone-/Push-/Reset-/Deploy-Operation und beseitigt die 413-Fehlerklasse |
| Kontextpakete/Stückkarten statt Volllektüre | **mittel** | Senkt Token je Builder-Start erheblich; Nebeneffekt: weniger Halluzinationsrisiko bei billigen Modellen |
| CI außerhalb des Containers | **mittel** | Macht die Reset-Kostenklasse (23×) für Messungen irrelevant |
| Headless-Sim-Kern (Ökonomie ohne DOM) | **langfristig am größten, kurzfristig Investition** | ρ in Sekunden, parallelisierbar; aber eigenes Kern-Projekt mit voller Abnahme — nicht in einer Nebenwelle versuchen, die Determinismus-Doktrin (Vorziehregel, rAF-Messstellen) ist empirisch erkämpft |
| Takt der Modell-Richter senken | **klein** | Auge/Ohr sind Einzel-API-Aufrufe; hier zählt Verlässlichkeit (Retry, Quoten, laute Fehler) mehr als Frequenz |

**Kernsatz:** Der Loop hat seine Qualitätssicherung bereits fast vollständig in Skripte gegossen — bezahlt wird heute vor allem dafür, dass teure Modelle Skripten beim Laufen zusehen und dass jede Arbeit die volle Abnahme durchläuft. Die nächste Phase trennt deshalb drei Klassen: **zählen (Skript, immer), rechnen (Skript, nachts), urteilen (Modell, an Wellengrenzen)** — und schneidet Aufträge so, dass die Partieneutralität billig beweisbar ist und billige Modelle gegen kopierbare Vorbilder mit binärer Skript-Abnahme bauen.