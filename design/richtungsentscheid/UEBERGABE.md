# Übergabe — Stand nach dem Richtungsentscheid

Geschrieben zum Sessionende am 29. Juli 2026, damit die nächste Session ohne
Rekonstruktion weiterarbeiten kann. Alles hier Genannte liegt im Branch
`claude/wirtschaftssimulation-konzept-zwk0j5` (PR #1, Draft).

---

## 1. Was entschieden ist

| Frage | Entscheid | Herkunft |
|---|---|---|
| **Thema** | **Bier. Die PR-Agentur ist verworfen** — ausdrücklicher Auftraggeber-Entscheid nach Sichtung aller Stimmen, Mockups und Stilstudien. | Verfahren 6:1, dann Auftraggeber |
| **Format** | **Manager-Skelett** (Saison, Spieltag, Tabelle, Kader, Gegnerzug, WEITER-Knopf) statt des reinen Bühne/Blatt-Wegs. | Verfahren 7:0 |
| **Epochen** | **Eine feste Zeit zuerst: die 1880er**, andockfähig gebaut (Ereignisse speichern, keine Zustände). Epochen sind Ausbaustufen, keine Durchfahrt. | Verfahren 7:0 |

Der Kern der Diagnose, damit er nicht verloren geht: Beide gebauten Prototypen
scheiterten an fehlender Uhr, fehlendem Gegner und fehlendem öffentlichem Urteil —
nie am Thema. Das Manager-Skelett erzwingt alle drei. „Kein Excel" (KONZEPT §3) war
ein richtiger Befund mit falscher Therapie: tot ist nicht die Tabelle, sondern die
Tabelle ohne Uhr und Gegner.

## 2. Die gewählte Gestalt (aus dem Stilstudien-Feedback des Auftraggebers)

Die Kombination, die sich herausgeschält hat — noch nicht klickbar gebaut, aber
bildlich belegt:

1. **Die Stadtkarte als Heimatbildschirm** — isometrisch, bewohnt, „süß und lebendig"
   (Favorit S2). Absatzorte sind sichtbare Häuser mit Wimpeln (= Schilderwand),
   die Fuhre und der graue Adler-Wagen fahren sichtbar.
2. **Kontorbuch-Masken als Spielfeld** — Tabelle, Kader, Michaeli-Abschluss in der
   Materialität des Repos (Papier, Tinte, Zinnober). Beste Vorlage:
   `stilstudien/pfade/masken-1884.jpg` (sauberes Deutsch, Zettel, invertierte Zeile).
3. **Der Bühnen-Schnitt als Spieltagsbildschirm** — das Brauhaus im Querschnitt mit
   Straße und Wirtshäusern (`stilstudien/pfade/buehne-1884.jpg`); löst den einen
   offenen Sachstreit der Stimmen zugunsten von „Skelett Manager, Haut Bühne".
4. **Das Interface altert mit den Epochen** (Idee aus S3, gefällt dem Auftraggeber):
   Pergament → Kupferstich/Holzschnitt → Lithografie/Kontorbuch → Gegenwart. Belegt
   durch die Epochen-Serien.
5. **S6 (Flat mit Live-Karte) nicht als Hauptakt**, aber als **Zwischenkarte der
   Expansion** — man will die Ausbreitung der Brauerei sehen.
6. **Verworfen:** Spielzeug-3D (S5, „zu kindlich, KI-seitig zu aufwendig") und die
   PR-Agentur als Thema.

## 3. Inventar — was liegt wo

Alles unter `design/richtungsentscheid/`:

- **`GEGENUEBERSTELLUNG.md`** — das Hauptdokument: drei Fragen entkoppelt, sieben
  Stimmen, vier Pfade (A Bühne / B Braumeister / C Agentur / D Testwoche), Matrix,
  Empfehlung Pfad B mit Testwoche als Woche 1. C ist durch den Auftraggeber-Entscheid
  erledigt; die Bier-Hälfte der Testwoche bleibt als erster Bauschritt sinnvoll.
- **`stimmen/`** — sieben unabhängige Gutachten. Für den Weiterbau am wichtigsten:
  `stimme-gestalter.md` §6 (**verbindliche Formatvorgabe**: Zonen, Raster, Hexwerte,
  Schriften, Pflichtmaske „Platz 3, Woche 7"), `stimme-manager-veteran.md`
  (Abbildung Saison=Braujahr, Spieltag=Fuhre, Transfermarkt=Ablösung, Sommer=Endrunde),
  `stimme-systemdesigner.md` (erste Mechanik: „die Tabelle, die sich gegen mich
  bewegt", Prüfstein „zehnmal WEITER → Platz 3 wird Platz 6, und die Zeilen sagen warum").
- **`mockup-braumeister.html`** — klickbarer Manager-Mockup im Kontorbuch-Kleid,
  drei Ansichten (Lage/Kader/Woche), Zahlen quer-konsistent. Basis für den Ausbau.
- **`mockup-agentur.html`** — Gegenstück PR (erledigt, bleibt als Beleg).
- **`stimmung/`** — sechs Stimmungsbilder (Flash-Entwürfe); `a3-portraet.jpg`
  („G. Kraus", Lithografie) ist die Vorlage für Kader-Porträts.
- **`stilstudien/`** — sechs Grafik-Schulen (`s1`–`s6`) + `STILSTUDIEN.md` mit dem
  dokumentierten Auftraggeber-Feedback; `epochen/` (Stadtkarte 1350/1650/1884/heute);
  `pfade/` (Bühne und Masken je 1350/1884/heute; Agentur 1965/1995 — erledigt).
  Alle Prompts liegen als `.txt` daneben.
- **`gemini-prompts.md`** — sechs kompakte Prompts + Sparhinweise.
- **`design/tools/gen_image.py`** — Bildwerkzeug; Schlüssel-Fallback liest jetzt
  `~/.gemini_key`.

Außerhalb: `KONZEPT.md` (Marktmodell §13 bleibt die Systemgrundlage),
`design/vorschlag-fuhre/VORSCHLAG.md` (die Bühne im Detail),
`prototyp/VOTUM-SPIELDESIGNER.md` (Prüfsteine, als Abnahmekriterien weiterverwenden).

## 4. Offene Fragen (mit billigem Test, aus GEGENUEBERSTELLUNG §7)

1. **Saisonrahmen:** Kampagne ab ~1878 mit Kühlmaschine als Finale, oder 1880er mit
   der Maschine mittendrin? → Papier-Skript, ein Abend.
2. **Tragen die Gegner?** Der teuerste Posten. → Prüfstein des Systemdesigners zuerst
   bauen: acht Brauereien, ein WEITER-Knopf, zehn Wochen ohne Spielerzutun müssen
   eine lesbare Geschichte ergeben.
3. **Screenshot-Probe des Kontorbuchs:** erst nach gebauter Pflichtmaske beantwortbar.
4. **Wie viel Bühne im Spieltag:** Standbild mit Zustandswechseln (billig) oder
   animierte Fuhre (teuer)? Erst nach Prüfstein 2 entscheiden.

## 5. Empfohlener Einstieg der nächsten Session

1. **Die Tabelle, die sich gegen den Spieler bewegt** — Saisonschleife auf den echten
   1884er-Zahlen aus dem Mockup: 14 Häuser, 3 Gegner (Adler, Hansa, +1), Wochentakt,
   Verfall (hl-Reihen fallen bei Nichtlieferung), Gegnerzug zu Michaeli angekündigt.
   Kein neues Design nötig: Formatvorgabe + Mockup existieren.
2. Danach die **Stadtkarten-Heimat** an den Mockup andocken (klickbare Häuser statt
   Navigations-Reiter; die Karte kann zunächst ein Standbild mit Overlays sein —
   `stilstudien/s2-stadtkarte.jpg` als Vorlage).
3. Parallel, falls Bilder gewünscht: **2K-Abnahme-Renders** der Favoriten mit
   Pro-Modell, `--ref` auf die Flash-Fassung und ausdrücklich deutschen
   Beschriftungen (bekannte Flash-Fehler: Kauderwelsch-Text, `--ref`-Erbfehler wie
   1884er-Kopfzeilen in anderen Epochen, „Tavern" statt „Wirtshaus").

## 5b. Nachtrag: iOS-Studie

Auf Nachfrage des Auftraggebers entstand `mockup-braumeister-ios.html` — dieselbe
Spielwelt im iPhone-Hochformat (390×844), Kontorbuch-Kleid, vier Reiter (Lage / Woche /
Post / Karte). Bewertung in Kürze: Der WEITER-Takt ist eine ideale Mobile-Schleife
(eine Woche = eine Sitzung), Fuhre-Packen per Stepper ist auf Touch natürlicher als
mit der Maus, die Zettel-Post passt zur Telefon-Grammatik. Preis: Die 14-Spalten-
Tabelle wird zur Liste mit Balken-Trend, Stadtkarte/Bühne brauchen Vereinfachung oder
Querformat. Technisch ist der geplante Stack (statisches HTML/SVG) direkt
PWA-fähig (kein Store nötig) oder per Capacitor in den App Store bringbar
(99 $/Jahr). **Empfehlung: Browser/Steam bleibt primär; Masken von Anfang an in zwei
Breiten denken, dann ist iOS Verpackung, kein Rewrite.**

## 6. Betriebsnotizen

- **Gemini-Schlüssel:** lag nur unter `~/.gemini_key` im Session-Container und ist
  mit dessen Ende weg — in der neuen Session neu hinterlegen. Der Schlüssel wurde
  im Chat übermittelt; **Rotation in der Google-Konsole ist empfohlen.**
- **PR #1** bleibt als Draft mit der gesamten Richtungsentscheid-Arbeit; Basis ist
  `claude/project-setup-apis-p51a0f`. Mergen oder offen lassen ist Auftraggeber-Entscheid.
- Netlify baut jeden Push als Deploy-Preview; die Mockups sind dort direkt aufrufbar.
