# GAP-ANALYSE „BRAUHAUS-IMPERIUM": IST-STAND → VOLLWERTIGES SPIEL

Stand: 8.8.2026, Welle 13 in Abnahme (eingefrorener Stand `b098fc6`). Grundlage: 7 Befundberichte inkl. eigener Laufprobe.

---

## 1. WAS SCHON TRAEGT

1. **Das Spiel läuft fehlerfrei und ist substanziell spielbar.** Laufprobe: 0 JS-Fehler in allen Läufen aller 4 Epochen, volles Braujahr inkl. automatisch aufliegender Michaelitafel gespielt, 57–76 echte Handlungsverben pro Woche, „nur WEITER möglich" kam in 0 von 15 Wochen vor. Speichern/Fortsetzen des Kernzustands funktioniert (15/15 Felder nach Reload, `?neu=1` räumt sauber).

2. **Wiederholbarkeit als erkämpftes Fundament.** Dieselbe Saat = dieselbe Partie, belegt mit 6 Läufen à 400 Wochen und einer Prüfsumme (`bb96459e6ac5`, 1350). Gesäter Würfel inkl. Zählerstand im Spielstand, Rundenschluss (runde.js) gegen Timing-Rennen, klick-synchrones Sichern. Das ist die Voraussetzung jeder automatischen Abnahme — und sie steht.

3. **Ein einzigartiger, einsatzbereiter Qualitäts-Werkzeugkasten.** `tor.mjs` (Commit-Gate), `spielprobe.mjs`, `linie.mjs`+`nenner.mjs`+`auswerten.py` (ρ-Latte), `lesbarkeit.mjs`, `auge.py`/`hoerer.py`+`ohrprobe.mjs` (blinde Fremdsinne), `gewicht-gegenprobe.mjs`, `messstand.sh`/`messfenster.sh` (Messdisziplin), `veroeffentlichen.sh`/`wiederaufnahme.sh`/`stand.py` (Betrieb). Dazu maschinenlesbare Spiel-Attribute (`data-zug`, `data-soll-aus`, `data-bereit`, `B.lage`, `B.zuege()`). Genau das braucht der Auftrag „Agenten arbeiten kostengünstig mit automatischen Qualitätschecks ab" — es muss nicht gebaut, nur weitergenutzt werden.

4. **Das Ende ist stark.** Zitat Spielprobe: „Dieses Spiel wird an seinem Ende gut" — der Kritiker wollte sofort neu anfangen. 3 gute + 4+ schlechte Ausgänge je Epoche, zentralisierte Ende-Architektur (`B.uhr.beende`), ehrliches Schlussblatt mit These, Zahlen, Generationenzeile, Wiederanfang.

5. **Historisch-inhaltliche Dichte mit Faktensicherung.** 4 Epochen mit disjunkten Datenlisten (0 gemeinsame Preis-Einträge, 24 epochendisjunkte SUD-Verfahren), Sperrliste `design/PRUEFUNG.md` als Faktenveto, REFERENZEN-Dossier. Ereignisse wie Kipper-und-Wipper, Linde 1873, Hansen 1883 sind eingebaut, nicht Deko.

6. **Klar geregelte, agententaugliche Architektur.** Datei-Eigentum je Stück, Ereignisbus, Welt-API, ZUSTAENDIGKEIT.md als Verfassung, Flächenhaushalt als Gerät. 8 parallele Builder haben darauf 13 Wellen ohne Merge-Konflikte gearbeitet. Erweiterung im Rahmen (neue Inhalte, neue Stücke) ist mechanisch billig.

7. **Audio vollständig und blind-geprüft.** 49/49 Dateien referenziert, ~70 Katalog-Einträge, Epoche im Blindtest 10/12 erkannt, Loudness-Normalisierung, Offline-WAV-Render fürs Messgerät. `?stumm=1` lädt 0 Byte.

8. **Onboarding-Grundstein aus Welle 13** (gebaut, Abnahme läuft): Zielsatz ab Woche 1, Startanschlag mit Gewinnen/Verlieren, Zielzeile mit Nähe-%, Übergabe an 4 Orten sichtbar, Wochenkarte mit Fuhrplänen (häufigster Knopf von 71–94 % auf 17–37 % gesenkt), lügender Tafel-Knopf 0/1512.

---

## 2. LUECKENREGISTER

Schweregrade: **BLOCK** = blockiert Veröffentlichung als vollwertiges Spiel · **QUAL** = mindert Qualität · **NTH** = nice-to-have. Umfang S/M/L/XL.

### (a) Onboarding / Zielverständnis / Tutorial

| # | Lücke | Schwere | Umfang | Abhängigkeiten |
|---|---|---|---|---|
| a1 | **Keine geführte erste Partie / kein Tutorial.** 75–81 aktive Knöpfe in Woche 1, reine Textanschläge; KONZEPT-§8 „drei Bedientiefen" nie gebaut. Erste-Session-Überforderung ist real (Spielprobe: „Was tun?" erst nach 2 Min. via Kennzahlzeile klar). | QUAL (an der Grenze zu BLOCK für Neuspieler) | L | Flächenhaushalt, Wiederholbarkeit (Tutorial-Skript darf keine Wanduhrfristen einführen); am besten als eigenes Stück im UNBEKANNT-Budget |
| a2 | **Zielzeile kontrastarm** (halbtransparente Monospace über Illustration, Laufprobe). | QUAL | S | Kern-UI kastenfrei (nur 1.664 px Vorrat) |
| a3 | **Startanschlag-Rahmentexte in allen Epochen wörtlich identisch**; Epochenidentität nur im Epochensatz. | NTH | S | — |
| a4 | Herkunftswahl (Kloster/Hof/Stadt, KONZEPT §5) fehlt komplett. | NTH | L | Balance je Startlage, ρ-Messung ×3 |
| a5 | Erklärung der Spezialbegriffe (Kerbholz, Angeld, Liegegeld, Bannmeile) nur implizit; kein nachschlagbares Glossar/„Braubuch". | QUAL | M | Blattaufsicht (höchstens ein Vollblatt) |

### (b) Kernschleife Minuten 4–20

| # | Lücke | Schwere | Umfang | Abhängigkeiten |
|---|---|---|---|---|
| b1 | **Das Geld-Problem** — der zentrale Spielprobenbefund „interessantes Spiel, das man nicht spielen darf": Deckung Median 0,08–0,62×, 742/1030 Wochen < 1×, Festlegungen in 1350/1970 nie bezahlbar („Vitrine"), genau **ein** geldbringender Knopf im ganzen Spiel; Laufprobe bestätigt: E1-Kasse halbiert sich trotz aktiven Spiels bis Michaeli, keine Festlegung erreichbar. W13 hat bewusst keine Wirtschaftszahl bewegt. | **BLOCK** | XL | ρ-Latte (1600 +0,538, Reserve 0,162!), §4-Abgabendeckel, §17/§18-Eichregeln, R13-Rest; jede Änderung braucht Vorher/Nachher-ρ an eingefrorenem Stand |
| b2 | **Keine Rückkopplung Ergebnis→Schwierigkeit** (BEFUND-WIRTSCHAFT §5: „Kosten hängen an Fahrt und Kalender, Ertrag an der Ladung"; nur 1600 „belohnt Sorgfalt und bestraft Erfolg"). Drei skizzierte Ansätze, Nacharbeit nie gemacht. | **BLOCK** (Teil von b1) | L | b1; 1600 zuerst messen |
| b3 | **„Handlungsunfähig, aber nicht tot"**: Kasse klebt bei 0, nichts endet, kein eigener Text (Spielprobe §7) — von keiner Auflage adressiert. | QUAL | M | §4 („ruinieren ja, einfrieren nie"), §3 FUHRE-Todzustand |
| b4 | R13-Rest: häufigster Knopf 1600 36,8 %, drei häufigste 1350/1600 über 60 % — laut Builder nur über Sudmenge/Wagengröße/Fassplätze lösbar. Schwellenentscheidung liegt bei der Aufsicht. | QUAL | M | b1 (ist Wirtschaft, nicht UI) |
| b5 | Welle-7-Auflagen 8/9: obere Leiterhälfte 1350 nie bezahlbar; tote Leitersprossen 1600/1970 (14× bestätigt). Bewusst vertagt, weil ρ-wirksam. | QUAL | M | b1, ρ-Schutzprotokoll |
| b6 | Ein Braujahr = 30× WEITER + Michaeli; zwischen den Jahren wenig mittelfristige Bögen (Amtszeit real ~2 Braujahre statt gewürfelter 21–37 — Kernfehler welt.js:379, nur umgangen). | QUAL | M | Kern (Aufsicht), ERBE-Stunde hängt daran |
| b7 | SUD-Bug: doppelte Funktionsdeklaration `fuelle` (sud.js:756 vs. 1173) — 1970er Rückläufertexte zeigen rohe `{nr}`/`{ab}`-Platzhalter bzw. falsche Menge. | QUAL | S | keine |

### (c) Partie-Ende und Wiederspielreiz

| # | Lücke | Schwere | Umfang | Abhängigkeiten |
|---|---|---|---|---|
| c1 | **Das gute Ende bleibt selten**: Partien enden faktisch nach ~3 Braujahren (`keine-abnehmer` 1353/1603/1887/1973); W13-Sichtbarkeit (R12) ist gebaut, aber Erreichbarkeit der Übergabe hängt an b1. | **BLOCK** | (in b1 enthalten) | b1, FUHRE-Übergabemaß |
| c2 | **ERBE-Nachspiel nach Partieende**: mehrfach angekündigt (fuhre.js:75, ZUSTÄNDIGKEIT §12-Verweis), nie gebaut. | QUAL | M | Ende-Architektur (vorhanden), ERBE-Stück öffnen |
| c3 | **Kein Abspann/Partie-Bilanz über das Schlussblatt hinaus**: keine Partiestatistik, kein Vergleich zu früheren Partien, keine lokale Bestenliste, kein „Saat teilen"-Mechanismus (Determinismus prädestiniert das Spiel für Daily-Seed/Challenge-Modus!). | QUAL | M | Spielstand-Infrastruktur (da), localStorage |
| c4 | Wiederanfang nur als Link mit neuer Saat; keine Variation (Schwierigkeitsgrade, Herkünfte, Handicaps). | QUAL | M–L | a4, b1 |
| c5 | Rufregister (NAME) fehlt im Schlussblatt; kein Schlussklang („die Pfanne verstummt"). | NTH | S | FUHRE-Schlussblatt, KLANG-Katalog |
| c6 | Endscreens sagen nicht, was man hätte anders machen können (das Blatt „bewertet nicht" — als Prinzip ok, aber ein Hinweis auf den Kipppunkt der Partie fehlt als Lernschleife). | NTH | M | Protokoll (append-only, Daten liegen vor) |

### (d) Epochenversprechen

| # | Lücke | Schwere | Umfang | Abhängigkeiten |
|---|---|---|---|---|
| d1 | **A12 Kampagne/Epochenwechsel in einer Partie**: Der Titel verspricht „1350–heute", geliefert werden 4 getrennte Szenarien. Mechanik-Unterbau existiert vollständig (uhr, `epoche`-Ereignis, epochenstabiler Spielstand-Schlüssel, `springe(400)` rechnet 1350→2025 durch), aber: Startwerte/Vorrat/sudJeWoche/Gegnerkassen wachsen live nicht mit, Stücke resetten Verfahren beim Epochenwechsel, Balance je Übergang ungeeicht; und der Startschirm deklariert ehrlich das Gegenteil. Design-, nicht Architekturentscheidung. | **BLOCK** für das beworbene Produkt (als „4 Szenarien" ehrlich verkaufbar → dann QUAL) | XL | Spielstand inkl. Stück-Z (h1!), b1-Eichung je Epoche, 4 volle Abnahmeläufe, Ehrlichkeits-Texte R4 anpassen |
| d2 | **A11 Verblisten**: ~22–23 von ~30 Verben je Epoche mechanisch identisch (Jaccard 0,70–0,81; Latte verlangt ≥3 eigene Verben je Epoche, <0,6). Nur DER SUD trägt „Kein Verb in zwei Epochen" als Prinzip. Zugewiesen an SUD und STADT, eigene Welle. | QUAL (Kern des „vier Tapeten"-Urteils) | L | ρ-Schutz, Verbliste-Zählgerät vorhanden |
| d3 | **5. Epoche 2025**: existiert nur als Zielbild (05-2025.jpg, ausdrücklich „keine beschlossene Epoche"). Kern: ~6–8 hartkodierte „4"-Stellen; dazu Platte, bett5/hof5, ATEM, Stück-Daten je Epoche, GRENZEN, voller Abnahmelauf. | NTH (aber „bis heute" steht im Auftragstitel → Entscheidung des Auftraggebers) | XL | d1 (nur sinnvoll mit Kampagne oder als 5. Szenario), Gewichtsveto |
| d4 | Erbfall-/Generationenerzählung: erst seit W11 erreichbar, vier gebaute erbfall-Handler „keiner ist je gelaufen" im Alltag der kurzen Partien; Generationenfolge findet real kaum statt. | QUAL | M | b1 (längere Partien), b6 |

### (e) Inhaltstiefe (Ereignisse, Texte, Gegner)

| # | Lücke | Schwere | Umfang | Abhängigkeiten |
|---|---|---|---|---|
| e1 | Epochen-Großereignisse fehlen: Dreißigjähriger Krieg (nur als Umlagen-Rhythmus spürbar), Gruit-vs-Hopfen als politischer Konflikt, Abgabe auf Stärke (KONZEPT §12/§13). | QUAL | L | Sperrliste PRUEFUNG.md, ρ-Messung, §4-Deckel |
| e2 | **Sortenbaum degeneriert**: je Partie faktisch eine Sorte (BEFUND-ENDE-Tabelle); Sorten-als-Strategien (Haltbarkeit=Reichweite) nur halb wirksam. | QUAL | L | b1, SUD/FUHRE gemeinsam → Aufsichtstisch (§2-Regel) |
| e3 | Qualität als eigene verlierbare Größe (KONZEPT) nur als SUD-Güte teilweise da; Chronik als Braubuch-Artefakt (Ästhetik) fehlt — Chronik ist Textzeile. | NTH | M | Flächenhaushalt |
| e4 | Nur 2 Gegner (Adler, Nordstern ab E4); erste 10 Adler-Züge Pflichtliste (Repertoire-Rundgang) — beim Wiederspielen vorhersehbar; Wesenszüge (6) tragen Varianz, aber kein dritter Mitbewerber. | NTH | L | Bindungs-Gesamtgrenzen, ρ |
| e5 | Ereignis-/Textkorpus je Epoche gut, aber endlich; bei Kampagnenlänge (d1) würden Wiederholungen sichtbar. | QUAL (nur mit d1) | L | d1 |

### (f) Audio

| # | Lücke | Schwere | Umfang | Abhängigkeiten |
|---|---|---|---|---|
| f1 | **Epoche 1600 borgt fast alle Kleinklänge von 1350** (`altNeu`-Muster; bau2/drueben2/nachbar2 fehlen); 1884 vielfach ebenso. | QUAL | M | Gewichtsveto (E2 hat nur 0,2–0,3 MB Luft!), hoerer.py-Abnahme |
| f2 | Latte-3-Offene: Gegenzug hörbar 0/4 (womöglich unerfüllbar), 1884 mit diesem Ohr nicht messbar, Mehrheitsregel-Frage — Entscheidung des Auftraggebers. | QUAL | S (Entscheidung) + M (Umsetzung) | Auftraggeber |
| f3 | Kein dedizierter End-/Urteilsklang. | NTH | S | KLANG-Katalog |
| f4 | Nur An/Aus-Schalter, kein Lautstärkeregler in der UI (API `setzeLaut` existiert). | NTH | S | Flächenhaushalt (klang: 4.000 px Budget) |

### (g) Visuals / Lesbarkeit / Responsive / Mobile

| # | Lücke | Schwere | Umfang | Abhängigkeiten |
|---|---|---|---|---|
| g1 | **Latte 4 gerissen**: 257 Textknoten < 12 px (Laufprobe: 64 sichtbare in E1, davon 6–8-px-Knoten faktisch unlesbar auf Laptop); Schriftarbeit fehlt bei GEGNER, NAME, ERBE; Kern-Rest `.knopf .preis` 9,9 px (Fix bewegt 3 fremde Bretter → Messpflicht). | **BLOCK** (Laptop = Hauptplattform) | M | ρ-Vorher/Nachher (Knopfboden-Lehre: Δρ 0,811!), messfenster |
| g2 | **Latte 1 gerissen** (Zielbild gewinnt 3:0): Deckung Ladezustand 11,0–11,8 % (Ziel < 8 %), nach 30 Wochen 13,9–15 %, **nach einem Escape 41,6–44,3 %** (Escape öffnet `erb-buch`, das keinen Schließknopf mit `data-zug` hat); B15/B16 offen, Kopfleisten-Skelett allein 26 %. Kein Blindvergleich seit Welle 9. | QUAL (stark) | M–L | Flächenhaushalt, Aufsichtstisch (Skelett-Anteil), auge.py |
| g3 | Beschriftungs-Überlappungen rechts (Gegnerkarten vs. Michaelitafel-Box, Laufprobe) + 17 Überläufe bei 1366×768, davon 4 aus neuer `zielzeile` (niemandem zugewiesen). | QUAL | S–M | GEGNER-Ausweichsystem, RAHMEN |
| g4 | **Mobile**: Hochformat unbenutzbar, kein Rotate-Hinweis, kein Letterbox-Konzept; Touch ohne Tooltip-Ersatz; Flächenhaushalt auf Desktop geeicht. Landscape-Tablet ~ok. | QUAL (BLOCK, falls Mobile Zielplattform) | Rotate-Hinweis S; Tablet-Härtung M; Phone-Layout XL | eigenes Layoutkonzept, HUD-Schicht; %-Ortsarchitektur trüge es |
| g5 | Offene Bildvergleichs-Einzelauflagen B1–B5, B13/B14/B17 (Darre+Rauch 1600 = einziges echtes Weltdefizit laut Kritiker; Ortsmarken-Scheiben, Leuchtschrift 1970, Bautenverdeckung). | NTH–QUAL | M | STADT, Sperrliste |
| g6 | Vier FUHRE-Bretter (und SUD/NAME/ERBE-Bretter) liegen beim Laden als zugeklappte Reiter — Unbedienbarkeitsproblem in W13 nur für STADT gelöst. | QUAL | M | Platzordnung, Entscheidung ③ |

### (h) Technik (Spielstand, Performance, Gewicht, Browser)

| # | Lücke | Schwere | Umfang | Abhängigkeiten |
|---|---|---|---|---|
| h1 | **Stück-Eigenzustand `Z` wird nicht gesichert** (7 von 8 Stücken; nur GEGNER nachgerüstet): Reload verliert STADT-Bauten/-Belastungen, SUD-Verfahren/Siegel/Gärkeller, PREIS-Chronik/Leiter/genommen, FUHRE-**Übergabefrist**, NAME-Register, ERBE-Lagen. Für Spieler: gespeicherte Partie ≠ gespielte Partie. | **BLOCK** | L (8× M, je Stück `B.stand.melde/geladen`) | stand.js-API (fertig), je Stück Abnahme „Wiederkehr ziffernweise gleich"; E3-Wiederkehr-Warnzettel (Doppelbuchungs-Verdacht) vorher klären |
| h2 | **Gewichtsveto verletzt/knapp**: Laufprobe maß E2 mit 8,35 MB (> 8-MB-Veto; offiziell 7,80 — Messweise klären!). Bekannte Reserve: 4,4 MB PNG in `bild/name`+`bild/gegner` → WebP (~1,17 MB Ersparnis in E2), tote Dateien hof3/hof4.png (675 KB) löschen. | **BLOCK** (eigenes Veto) | S | gewicht-gegenprobe.mjs beidseitig |
| h3 | Spielstand-Versionierung: FASSUNG=1, fremde Fassung wird **verworfen** — jedes Update vernichtet laufende Partien. Migrationskonzept fehlt. | QUAL (BLOCK ab erstem Post-Launch-Update) | M | h1 |
| h4 | Determinismus ist empirisch, nicht strukturell: setTimeout-Monkey-Patch mit Heuristiken (FRISTGRENZE 1200 ms), 7 rAF-Stellen verhaltensrelevant, `nachwehen()` nur auf Zuruf; offene Messfrage „hält Wiederholbarkeit ohne Vorziehregel?" (Abnahmeschritt 6). | QUAL (Wartungsrisiko) | M | Abnahme W13 abwarten; CI-Gate mit Prüfsummenläufen |
| h5 | Kern-Schuldenliste: Rohstoff-API fehlt (Kollisionsrisiko 2. Verbraucher), `nimmHeraus` nur FIFO, Versiegelung gehört in Kern (FUHRE-Monkey-Patch auf `B.knopf`), ton.js-Selbstinjektion, `haushalt RASTER=4` bei kleinen Fenstern, `data-soll-aus` nur bei SUD, Messgeräte ohne `?neu=1`, `zinsLaeuft` bucht negativ via `nimm`. | QUAL | M (Sammelposten) | Aufsichtstisch, je Fix Nachmessung |
| h6 | Kopplungs-Regexe/Selektoren ohne Vertragstest: NAME liest FUHRE-Protokolltexte (Aufgeld versiegt still), ERBE-`AM_HAUS`-Regex, STADT-Rahmenschlüssel `'sud|sud-brett'`, GEGNER-`.pr-griff`. | QUAL (hohes Regressionsrisiko) | S–M (Kontrakttests schreiben) | tor.mjs erweitern |
| h7 | Performance: unkritisch (16,7 ms Median, p95 < 22 ms) — keine Lücke, festhalten als Ratchet. | — | — | tempo.mjs im Gate behalten |
| h8 | Browser: evergreen-only ist ok für Web-Release; dokumentieren (min. Chrome/Firefox/Safari-Versionen), Safari/WebAudio-Probe fehlt (bisher nur Chromium getestet!). | QUAL | S–M | einmalige Cross-Browser-Probe, ggf. Playwright webkit |

### (i) Distribution

| # | Lücke | Schwere | Umfang | Abhängigkeiten |
|---|---|---|---|---|
| i1 | **Netlify deployt die gesamte Repo-Wurzel** (186 MB design/, 145 MB werkbank/, 18 MB zielbild/), Startseite ist die Werkbank-Fortschrittsseite, das Spiel liegt unter `/spiel/`. Kein Spieler findet das Spiel; interne Urteile/Zielbilder sind öffentlich. | **BLOCK** | S | netlify.toml (publish-Verzeichnis oder Redirects), Werkbank-Flow nicht zerstören (Veröffentlicher-Pfadliste) |
| i2 | Keine eigene Domain, kein `<title>`-Feinschliff/Favicon/OG-Meta/Social-Card/SEO-Description; Branch-Deploy-URL als „Produkt-URL". | **BLOCK** (Minimalfassung) | S | i1; index.html-Einfrierung: Meta-Tags = Aufsichtsänderung |
| i3 | Kein Landing-/Einstiegskonzept: 4 Epochen-URLs mit Parametern statt einer Startseite mit Epochenwahl. | QUAL | M | darf `spiel/index.html` nicht anfassen → eigene Vorschaltseite |
| i4 | itch.io/Steam: nichts vorbereitet. itch (Web-Build hochladen) billig; Steam = Wrapper, Store-Assets, Achievements — eigenes Projekt. | NTH (itch: sinnvoller Erstkanal) | itch S–M, Steam XL | h2 (Paketgröße), j1 |
| i5 | PR zum Basiszweig „no history in common" — beim Auftraggeber; Release-Branch-Strategie ungeklärt. | QUAL | S | Auftraggeber |
| i6 | Kein Update-/Changelog-Kanal für Spieler; Fortschrittsseite ist intern. | NTH | S | i1 |

### (j) Rechtliches / Impressum / Datenschutz

| # | Lücke | Schwere | Umfang | Abhängigkeiten |
|---|---|---|---|---|
| j1 | **Kein Impressum, keine Datenschutzerklärung.** Deutschsprachiges, öffentlich erreichbares Angebot → §5 DDG/Impressumspflicht praktisch sicher einschlägig; DSGVO-Erklärung trivial (nur localStorage, kein Tracking, kein Netz zur Laufzeit — genau das dokumentieren; Netlify-Server-Logs erwähnen). | **BLOCK** (formal, DE) | S | i1 (Seite braucht Fußzeile/Unterseite außerhalb der eingefrorenen spiel/index.html) |
| j2 | Rechtekette der KI-Assets (Bilder gemini-3-pro-image, generierte Musikbetten) ungeklärt/undokumentiert; Nutzungsbedingungen der Generatoren prüfen, Herkunft im Repo festhalten. | QUAL (BLOCK bei kommerziellem Vertrieb) | S | Auftraggeber |
| j3 | Namens-/Markenprüfung (fiktive Brauereinamen, „Linde" historisch-beschreibend) — Kurzcheck genügt. | NTH | S | Sperrlisten-Prozess |

### (k) Barrierefreiheit

| # | Lücke | Schwere | Umfang | Abhängigkeiten |
|---|---|---|---|---|
| k1 | Screenreader: praktisch nur 1 aria-Label (Tonschalter); keine Landmark-/Rollenstruktur, Immediate-Mode-Neuzeichnen ohne aria-live — Spiel für Blinde unzugänglich (bei diesem Genre ggf. akzeptiert, aber undeklariert). | QUAL | L (voll) / S (ehrliche Deklaration + Basis-Rollen) | Zeichne-Zyklus |
| k2 | Tastaturbedienung nur WEITER/Escape; keine Fokusreihenfolge/kein Fokusring-Konzept durch die Bretter. | QUAL | M | Blattaufsicht, Kern |
| k3 | Kontraste nie gemessen (Zielzeile nachweislich schwach); kein Modus für reduzierte Transparenz/größere Schrift. | QUAL | S–M (Kontrast-Latte in lesbarkeit.mjs aufnehmen) | g1 |
| k4 | `title`-Tooltips als Informationsträger (touch- und screenreader-feindlich). | QUAL | M | g4 |

---

## 3. PRIORISIERUNG — die 10 stärksten Spielwert-Hebel (Reihenfolge)

1. **Wirtschaft der Minuten 4–20 heilen (b1+b2, inkl. c1).** Der Spielprobenbefund ist eindeutig: „ja Minute 1, nein Minuten 4–20, ja am Ende". Alles andere poliert ein Spiel, das man „nicht spielen darf". Zweiter Geld-herein-Weg je Epoche, Deckung im Median über 1×, Festlegungen in E1/E4 erreichbar (§17-Regel), Rückkopplung Ergebnis→Schwierigkeit. Größter Hebel, größtes Risiko → eigenes Messprotokoll (siehe 4).
2. **Spielstand vervollständigen (h1).** Ohne gesicherte Stück-Zustände ist „Fortsetzen" eine Falle (gebaute Häuser, Siegel, Übergabefrist weg). Die Spielprobe nannte Unterbrechbarkeit als Kernbedürfnis; W13 hat es nur zur Hälfte geliefert. Zudem Voraussetzung für d1.
3. **Veröffentlichungsfähig machen: Deploy trennen, Gewicht unters Veto, Impressum/Meta (i1, i2, h2, j1).** Billigste Posten mit unmittelbarer Wirkung: das Spiel wird auffindbar, legal und lädt regelkonform. Ohne dies gibt es schlicht kein Release — bei geringem Risiko fürs Erreichte.
4. **Lesbarkeit zu Ende führen (g1, g3).** 64 sichtbare Unlesbar-Knoten auf Laptop treffen jeden Spieler in jeder Minute; die Arbeit ist bei 4 Stücken vorgemacht (1.899→257), Werkzeug existiert. Achtung Knopfboden-Lehre: nur mit ρ-Begleitmessung.
5. **Ende und Wiederspielreiz ausbauen (c2, c3, c5).** Das Ende ist das beste Stück des Spiels — es verdient das ERBE-Nachspiel, eine Partie-Bilanz und den Saat-Neustart als Einladung („dieselbe Saat nochmal" / „neue Saat"). Determinismus macht Daily-Seed fast geschenkt — ein Alleinstellungsmerkmal aus vorhandener Technik.
6. **Epochenversprechen entscheiden und einlösen (d1).** Produktdefinition beim Auftraggeber: Kampagne (XL, das eigentliche Versprechen „1350–heute") oder ehrlich „4 Szenarien" (dann Texte/Marketing danach ausrichten). Für ein „vollwertiges Spiel" im Sinn des Konzepts ist die Kampagne der zweitgrößte Hebel nach der Wirtschaft — aber erst nach 1, 2 und der W13-Abnahme.
7. **A11 Verblisten (d2).** Gegen das „vier Tapeten"-Urteil: je Epoche ≥3 eigene Verben bei SUD-fremden Stücken (STADT, ggf. FUHRE-Kostüme vertiefen). Macht Wiederspielen über Epochen erst reizvoll — die Spielprobe zählte 37 von ~43 Verben viermal gleich.
8. **Onboarding-Schicht (a1, a2, a5).** Geführte erste 5 Wochen (die Kennzahlzeile „Kasse reicht N×" ist laut Kritiker die beste Zeile des Spiels — daran anknüpfen), Zielzeilen-Kontrast, Glossar. Erst nach der Wirtschaft sinnvoll, sonst führt das Tutorial in ein unbezahlbares Spiel.
9. **Flächen-/Escape-Regression und Latte 1 (g2).** Escape 41–44 % Deckung ist die sichtbarste Einzelregression; `erb-buch`-Schließknopf ist S. Danach neuer Blindbildvergleich — die 620-Jahre-Illustrationen sind ein Verkaufsargument, das die UI derzeit zudeckt.
10. **Audio-Feinschliff (f1, f3) + Latte-3-Entscheidungen (f2).** E2-Eigenklänge (unter Beachtung des knappsten Gewichtsbudgets!), Schlussklang; Auftraggeber entscheidet die drei offenen Messfragen.

---

## 4. RISIKEN — wo der Ausbau das Erreichte zerstören kann, und Schutzmaßnahmen je Eingriff

**R1 — Die ρ-Latte, speziell 1600 bei +0,538 (Reserve nur 0,162).**
Gefahr: Jede Wirtschafts-, Preis-, ja Layoutänderung (Knopfboden-Lehre: Δρ 0,811 bei null Fehlern; „Wer an Größen dreht, dreht an ρ") kann die Latte reißen — und b1 verlangt genau solche Eingriffe.
Schutz je Eingriff: (1) eingefrorener Messstand (`messstand.sh`, `.messstand-marke` gegenprüfen), (2) ρ vorher/nachher mit `linie.mjs`+`auswerten.py`, **1600 zuerst**, alle drei Schnitte 12/13/14, (3) sequenziell, nie Epochen parallel, unter `messfenster.sh`-Sperre, (4) Lesart und Schwellen **vor** der Messung festschreiben (vordatiertes Maß, probe13-Muster), (5) niemals zwei Stücke, die dieselbe Kennzahl füttern, gleichzeitig nacharbeiten, (6) §4-Abgabendeckel und §17/§18 als harte Prüfpunkte in jede Abnahme.

**R2 — Wiederholbarkeit (dieselbe Saat = dieselbe Partie).**
Gefahr: Jedes neue `setTimeout`/`requestAnimationFrame`/Intervall im Zeichenweg, jede Umsortierung von Stück-Aufrufen (Würfel-Konsumreihenfolge!), jede neue DOM-Abfrage nach gelöschten Elementen kann die Bistabilität zurückbringen (historisch: 420-ms-Frist → zwei Partien aus einer Saat). Tutorial-Animationen, Mobile-Layouts und Onboarding-Overlays sind typische Einfallstore; Animationen ≤ 1200 ms werden zudem vom Vorzieh-Patch stillschweigend zerdrückt.
Schutz je Eingriff: (1) LIESMICH-Regeln als Abnahmekriterium zitieren (fremder Brettzustand → `zeichne`; keine Wanduhrfrist im Zeichenweg), (2) 3 Läufe/eine Prüfsumme, 6 bei einer Abweichung, als **Commit-Gate** automatisieren (Kosten: ~272 s/Lauf), (3) `nachwehen()`/`runde.pruefe()` in jeden CI-Lauf, (4) `?neu=1` in **jede** Messadresse (offener RAHMEN-Punkt #2 zuerst schließen), (5) neue Fristen nur mit Nachmessung der FRISTGRENZE-Heuristik, (6) die offene Vorziehregel-Frage (Abnahmeschritt 6) **vor** großen Umbauten klären — nicht währenddessen.

**R3 — Flächenhaushalt und Platzordnung.**
Gefahr: Jede neue UI (Tutorial, Bilanz, Glossar, Kontrast-Kästen) frisst Budget; das Kern-Kopfband hat nur 1.664 px Vorrat; eine verschobene Lade hat schon einmal einen fremden Knopf verdeckt und 1350 in den Ruin geführt („ein Layoutfehler ist ein Spielfehler"). Latte 1 ist bereits gerissen — neue Flächen verschärfen das.
Schutz je Eingriff: (1) `haushalt.pruefe()` auf 2752×1536 (Raster-Befund!) vor/nach, GRENZEN-Budget vorab zuteilen (UNBEKANNT-Budget nutzen), (2) `B.zuege()`-Zählung und `welt.zugBedienbar` vorher/nachher (kein Zug darf verschwinden), (3) Blattaufsicht respektieren (höchstens ein Vollblatt; neue Blätter mit `B.blatt.melde` und eigenem Schließknopf mit `data-zug` — die `erb-buch`-Lücke nicht wiederholen), (4) Deckungsmessung (`deckung-je-stueck.mjs`) als Ratchet: neue Fläche nur gegen abgebaute.

**R4 — Gewichtsveto 8 MB, E2 mit ≤0,3 MB Luft.**
Gefahr: Jedes neue Bild/jeder neue Klang (f1! d3!) kippt E2 übers Veto; Laufprobe maß E2 bereits über 8 MB.
Schutz: Messdifferenz Laufprobe vs. offiziell zuerst klären (transferSize vs. Playwright-Responses); PNG→WebP-Umstellung **vor** jedem Asset-Zubau; `gewicht-gegenprobe.mjs` als Pflicht-Gate für jeden Commit, der `bild/` oder `ton/` berührt; tote Assets (hof3/4.png) entfernen.

**R5 — Stille Kopplungsbrüche.**
Gefahr: Die Regex-/Selektor-Kopplungen (NAME→FUHRE-Protokolltexte, ERBE-`AM_HAUS`, STADT-Rahmenschlüssel, GEGNER-`.pr-griff`, `data-fass`-Namensräume) brechen **lautlos** — das Aufgeld versiegt, Bindungen klassifizieren falsch, Lagen klemmen, und kein Fehler erscheint (`B.lage` bleibt 0).
Schutz: Vor der ersten Ausbauwelle Kontrakttests schreiben (Aufgeld > 0 nach Lieferung; ERBE klassifiziert Referenzliste aller `womit`-Wörter korrekt; Rahmen-Lage für `'sud|sud-brett'` existiert) und in `tor.mjs` einhängen; jede Textänderung an Protokoll-/Chronikzeilen gilt als API-Änderung → Aufsichtstisch.

**R6 — Spielstand als neues Zerstörungswerkzeug.**
Gefahr: h1 (Stück-Z sichern) kann selbst die Wiederholbarkeit brechen (die erste uhrgetriebene Blattwache tat genau das: ρ −0,336 vs. +0,270) und Dubletten buchen (E3-Wiederkehr-Warnzettel: +18–20 Bucheinträge). FASSUNG-Erhöhungen vernichten Spielerstände.
Schutz: Entscheidung ② beibehalten (`?neu=1` Teil jeder Abnahme, Sichern nur synchron an bestehenden Sicherpunkten, kein Date.now); Wiederkehr-Abnahme „ziffernweise gleich" je Stück (GEGNER-Muster mit `abweichung []`); E3-Doppelbuchungs-Verdacht vor dem Rollout klären; ab FASSUNG=2 Migrationsfunktion statt Verwerfen.

**R7 — Kampagne (d1) gegen die Verfassung des Spiels.**
Gefahr: Der Epochenwechsel widerspricht dem deklarierten Design („keine wächst in die nächste hinüber"), den Stück-Resets beim `epoche`-Ereignis, den Epochen-Startwert-Arrays und der Eichung, die schon je Einzelepoche der teuerste Posten war (§13/§17). Ein halber Umbau erzeugt vier kaputte Szenarien statt einer Kampagne.
Schutz: Als eigene Welle mit eigener Latte (z. B. „`springe(400)` 1350→2025 ohne Ruin und ohne Einfrieren, 3 Läufe eine Prüfsumme") **hinter** einem Feature-Schalter (`?kampagne=1`), die vier Szenarien bleiben unverändert die Abnahme-Referenz; Ehrlichkeitstexte (R4-Startanschlag) im selben Commit anpassen; Balance-Brücken (vorrat/sudJeWoche/Gegnerkasse wachsen mit) als Daten je Übergang, nicht als Code-Sonderfälle.

**R8 — Prozessrisiken des Agenten-Ausbaus selbst.**
Gefahr: Alle teuer bezahlten Lehren gelten weiter — wandernde Ziele, parallele Messungen (vier Browser verfälschen ρ), Messgeräte, die im Fehlerfall schweigen, Kritiker, deren eigene Hand den Befund erzeugt, Container-Resets.
Schutz: Das W13-Protokoll als Standard übernehmen: max. 4 parallele Builder, Datei-Eigentum strikt, Urteile laufend in Repo-Dateien, vordatierte Messgeräte der Aufsicht, Blind-Leselisten für Kritiker, „Was nicht kaputtgehen darf"-Liste in jedem Wellenbrief, Exit-Codes „durchgefallen" ≠ „keine Messung", kein Skript meldet Erfolg ohne Ergebnisansicht. Faktenneues nur gegen `design/PRUEFUNG.md` (Sperrliste disqualifiziert, gewinnt nie).

**Querschnittsregel für den Umsetzungsplan:** Jeder Arbeitspakete-Typ bekommt sein festes Gate-Bündel — Wirtschaft: R1+R2; UI/Layout: R1+R3+R2; Assets: R4; Spielstand: R6+R2; Kampagne: R7+alle; Texte/Protokolle: R5. Vor Welle 14 zuerst die W13-Abnahme (Schritte 2–6) abschließen — auf einem nicht abgenommenen Stand zu bauen war im Lauf bisher immer der teuerste Fehler.