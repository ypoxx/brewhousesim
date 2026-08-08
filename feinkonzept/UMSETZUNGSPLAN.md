# Umsetzungsplan: Brauhaus-Imperium — Vollversion

*Stand 8. August 2026. Setzt [`FEINKONZEPT.md`](FEINKONZEPT.md) um. Geschrieben
für den Betrieb mit **Opus 5 als Aufsicht** und einem tokensparsamen
Multiagenten-Loop. Arbeitsgrundlage ist der Branch
`claude/brauhaus-imperium-sim-163s85`; Wellen zählen ab **W14** weiter.
Referenzen: `analyse/ANALYSE.md` (Kurzlage), `analyse/berichte/05` (Auflagen),
`analyse/berichte/08` (Lücken/Risiken), `analyse/berichte/09` (Prozess).*

---

## 1 · Betriebsmodell (Rollen, Modelle, Tokendisziplin)

### Rollen und Modellklassen

| Rolle | Modell | Aufgabe |
|---|---|---|
| **Aufsicht** (1 Instanz) | **Opus 5** | Wellenbriefe mit vordatiertem Maß, Schwellenentscheidungen, `kern/**` und git, Abnahmen lesen (nicht daneben sitzen), Widersprüche klären |
| **Builder** (max. 4 parallel) | Sonnet-Klasse | regelwirksame Stückarbeit nach Ticket/Wellenbrief; kein Ermessen über Schwellen — Ermessensfragen als Meldung zurück („Schwelle zurück an die Aufsicht", W13-Muster) |
| **Mechanik** | Haiku-Klasse oder reines Skript | Tickets mit kopierbarem Vorbild und binärer Skript-Abnahme |
| **Blinde Kritiker** | Sonnet (Zählkritik) / Opus (Spielurteil) | nur an Wellengrenzen, frischer Kontext, Leseliste nach `gauntlet/WELLE-13-KRITIK.md`-Muster |
| **Fremde Sinne** | Gemini (Auge/Ohr) | nur wenn der jeweilige Proxy grün ist (§2) |

### Die zehn Tokenregeln der Aufsicht

1. **Kein Modell sieht Skripten beim Laufen zu.** Alle Messläufe (§2, Stufe
   1–2) laufen agentenlos (nachts/CI/nebenher); die Aufsicht liest Ergebnis-
   JSON.
2. **Kontextpaket statt Volllektüre:** je Ticket nur eigener Brief +
   `spiel/LIESMICH.md` + die 2–3 einschlägigen §§ aus `ZUSTAENDIGKEIT.md` +
   eigene Dateien. Historie (`LAUFENDER-AUFTRAG.md`, alte Wellen) liest nur
   die Aufsicht — und auch sie nur die Abschnitte, die das aktuelle Paket
   betreffen.
3. **Stückkarten pflegen:** je Stück eine 1-Seiten-Karte (Zustand `Z`,
   öffentliche API, bekannte Kopplungen), einmalig von Haiku erzeugt —
   Builder großer Stücke (fuhre.js 5.464 Z.!) lesen die Karte, nicht die
   Datei am Stück.
4. **Ticket vor Welle:** alles beweisbar Partieneutrale läuft als Ticket mit
   Byte-Vergleich (Kurzlauf-Prüfsumme) statt Vollabnahme. Wellen nur für
   ρ-wirksame Arbeit.
5. **Kurzlauf-Proxy zuerst:** 100-Wochen-Lauf (1×) je Ticketabschluss; der
   volle 400er-Satz (3×/6×, sequenziell) nur an Wellengrenzen. Vorher einmal
   Kurz-ρ gegen Voll-ρ kalibrieren (T0.7).
6. **Modell-Richter nur hinter Proxys:** `auge.py` erst bei Deckung < 8 %,
   `hoerer.py` nur nach Katalogänderung, Spielkritiker 1× je Welle, nie je
   Nacharbeit.
7. **Berichte sind Dateien, keine Chats.** Builder schreiben laufend in
   `werkbank/urteile/welle<N>-<stueck>-bau.md`; die Aufsicht antwortet im
   Wellenbrief. Kein Zwischenstand als Konversation.
8. **Vier Builder sind das Maß.** Nie mehr parallel; kleiner ist oft
   billiger (Reset-Verlustmasse).
9. **Nichts zweimal von Hand:** jede Wiederherstellung als Skript ins Repo;
   Wellenskripte nach `werkbank/wellen/welle-<N>.js` (die Regel wurde ab W5
   verletzt — wieder einhalten).
10. **Budget-Reihenfolge respektieren:** wird das Tokenbudget knapp, gilt
    die Streichreihenfolge in §10 — nie „überall ein bisschen".

---

## 2 · Prüfpyramide (Abnahme-Infrastruktur)

Alle Geräte existieren in `werkbank/` (Details: `analyse/berichte/04`, §3).
Schwellen sind **Ratchets**: nie schlechter als der letzte eingefrorene Stand.

| Stufe | Takt | Prüfungen (Gerät) | Läuft |
|---|---|---|---|
| **0** | je Commit | `aufsicht/tor.mjs` (4 Epochen laden, `lage` 0, 0 Konsolenfehler) · `gewicht-gegenprobe.mjs` < 8 MB · statische Wächter: kein `Math.random`, kein neues `setTimeout` im Zeichenweg ohne Freigabevermerk, git-diff nur im eigenen Datei-Eigentum, `?neu=1` in Messadressen | Skript, Sekunden |
| **1** | je Ticket | `aufsicht/spielprobe.mjs` (60 Wochen je Epoche spielbar) · `aufsicht/lesbarkeit.mjs` 1366×768 (Ratchet) · Deckungsmessung (Proxy Latte 1) · **Kurzlauf 100 Wochen, 1×, Prüfsummenvergleich** gegen letzten grünen Stand (Partieneutralitäts-Beweis) · `haushalt.pruefe()` auf 2752×1536 | Skript, Minuten |
| **2** | nächtlich / Wellengrenze | volle Latte 2: `messstand.sh` → `rueckkopplung-r3/linie.mjs` 400 Wo. × alle Epochen, **sequenziell** unter `messfenster.sh`, 3 Läufe (6 bei Abweichung) → `nenner.mjs` + `auswerten.py`, \|ρ\| < 0,7 über 12/13/14, **1600 zuerst** · Wiederholbarkeits-Vollprobe · `tempo.mjs` · Haushalts-Vollmessung → Ergebnis als JSON | Skript, agentenlos |
| **3** | Wellengrenze | blinder Spielkritiker (Opus, frischer Kontext) · `auge.py` (nur bei Deckung < 8 %) · `ohrprobe.mjs`+`hoerer.py` (nur nach Klangänderung, F4-Regeln) · Faktencheck neuer Inhalte gegen `design/PRUEFUNG.md`/`REFERENZEN.md` | Modell — die einzigen QS-Modellkosten |

**Gate-Bündel je Pakettyp** (aus `analyse/berichte/08` §4, bindend):

| Pakettyp | Pflicht-Gates |
|---|---|
| Wirtschaft/Preise | Stufe 2 vorher/nachher (1600 zuerst) + Wiederholbarkeit + §4-Abgabendeckel, §17/§18 |
| UI/Layout | wie Wirtschaft (Knopfboden-Lehre: Δρ 0,811 durch Layout!) + Flächenhaushalt + `B.zuege()`-Zählung vorher/nachher |
| Assets (bild/ton) | Gewichtsveto beidseitig gemessen; neue Fläche nur gegen abgebaute |
| Spielstand | Wiederkehr-Abnahme „ziffernweise gleich" (GEGNER-Vorbild `abweichung []`) + `?neu=1`-Probe + Kurzlauf-Prüfsumme |
| Bogen/Erbstücke | alles Obige + „Bogen ohne Erbstücke == heutiges Szenario" (Byte-Vergleich) |
| Texte/Protokolle | Kontrakttests (T0.6) — jede Protokoll-/Chronikzeile ist API |

---

## 3 · Phasenübersicht

| Phase | Inhalt | Wellen/Tickets | Meilenstein |
|---|---|---|---|
| **P0** | W13-Abnahme abschließen, Hygiene, CI, Release-Schnitt | T0.1–T0.10 | sauberer, gemessener Ausgangsstand |
| **P1** | Wirtschafts-Heilung + Spielstand komplett | W14, W15, W16 + TS1.1–TS1.6 | **„Man darf spielen"**: Deckung Median ≥ 1×, Fortsetzen verlustfrei |
| **P2** | Lesbarkeit, Onboarding, Startmenü, Recht, Migration | W17, W18 + T2.1–T2.6 | **Release-Kandidat 1** (4 Szenarien, öffentlich zeigbar) |
| **P3** | Bogen (Erbstücke), A11-Verben, Ende/Wiederspiel | W19, W20, W21 | **Release „Der Bogen"** (1350→1970) |
| **P4** | Fünfte Epoche „Die Gegenwart" | W22, W23, W24 | **Vollversion „bis heute"** |
| **P5** | Fläche/Latte 1, Audio, Deklarationen | W25 + T5.1–T5.4 | Feinschliff-Abnahme aller Latten |

Reihenfolge P3 vor P4 ist bindend („Erst der Bogen, dann die Gegenwart").
P1 vor P2: ein Tutorial in ein unbezahlbares Spiel führt in die Irre.

---

## 4 · Phase 0 — Abschluss und Hygiene

*Meist Skript/Haiku; W13-Abnahme ist Aufsichtsarbeit mit agentenlosen Läufen.*

| ID | Paket | Wer | Abnahme |
|---|---|---|---|
| T0.1 | **Konzeptmaterial auf den sim-Branch holen:** `analyse/` + `feinkonzept/` aus PR #3 (Branch `claude/brauhaus-imperium-game-concept-uz4xoi`) übernehmen; `werkbank/LAUFENDER-AUFTRAG.md` um einen Kopfverweis auf beide ergänzen | Aufsicht (S) | Dateien auf Branch, Verweis steht |
| T0.2 | **W13-Abnahme zu Ende führen** — exakt die Schritte 2–6 aus `werkbank/LAUFENDER-AUFTRAG.md:237–265`: Wiederholbarkeit 1600/1884/1970 (je 3×400 Wo., sequenziell) → Latte 2 (`auswerten.py`, 1600 zuerst) → Gegenmessung `probe13.mjs` nachher-e1..4 + `wiederkehr.mjs` + `hand3.mjs`/`zaehle.mjs` → **vier blinde Kritiker** nach `gauntlet/WELLE-13-KRITIK.md` → R13-Schwelle entscheiden → Messfrage „Wiederholbarkeit ohne Vorziehregel?" | Aufsicht + agentenlose Läufe; Kritiker Stufe 3 | alle Zahlen im Wellenbrief W13 quittiert; erst danach W14 |
| T0.3 | **Release-Schnitt (F7):** `netlify.toml` auf ein `publish`-Verzeichnis umstellen (Spiel + neue Startseite + `werkbank/stand.json`-Spiegel für die interne Seite); interne Werkbank/Design/Zielbilder verschwinden aus dem Deploy; Veröffentlicher-Pfadliste prüfen | Haiku (S) | Deploy enthält nur Spiel+Startseite; Werkstattseite intern weiter erreichbar |
| T0.4 | **Gewicht:** PNG→WebP für `bild/name/` + `bild/gegner/` (−4,4 MB Quelle, −1,17 MB in E2), tote `gegner/hof3.png`/`hof4.png` löschen; Messdifferenz klären (offiziell 7,80 vs. Laufprobe 8,35 MB in 1600 — `gewicht-gegenprobe.mjs` gegen transferSize, eine Lesart festschreiben) | Haiku (S) | alle Epochen < 8 MB in **beiden** Lesarten |
| T0.5 | **`?neu=1` in die fünf Messgeräte** (`linie.mjs`, `hand3.mjs`, `gegnerblick.mjs`, `messfenster.sh`, `schuss.mjs`) — offener RAHMEN-Punkt #2 | Haiku (S) | grep-Nachweis + ein Kurzlauf unverändert |
| T0.6 | **Kontrakttests** gegen die stillen Kopplungen (R5): Aufgeld > 0 nach Lieferung (NAME→FUHRE-Regex), ERBE-`AM_HAUS`-Wortliste, STADT-Rahmenschlüssel, GEGNER-`.pr-griff`; in `tor.mjs` einhängen | Sonnet (M) | Tests rot bei absichtlichem Bruch, grün am Stand |
| T0.7 | **Kurz-ρ kalibrieren:** aus vorhandenen 400-Wo.-Läufen (`werkbank/urteile/e1–e4.json` + W13-Abnahmeläufe) Korrelation 100-Wo.-Prüfsumme/ρ vs. Voll-ρ belegen; Schwelle für Stufe 1 festschreiben | Aufsicht (S) | Kalibrierblatt in `werkbank/` |
| T0.8 | **Nächtlichen Messlauf einrichten** (Stufe 2 als Cron/CI außerhalb des Agentencontainers, Ergebnis-JSON ins Repo) | Sonnet (M) | zwei Nächte, zwei JSONs, ohne Handgriff |
| T0.9 | **Repo-Ballast:** Belegbilder-Politik (keine neuen Screenshots ins Repo; Bestand darf bleiben), `werkbank/ohr/*.wav` aus dem Deploy | Haiku (S) | Deploy-Größe, Push-Zeit |
| T0.10 | **Dokumentierte Kleinfehler:** `sud.js` doppelte `fuelle`-Deklaration (rohe `{nr}`-Platzhalter in 1970er Rückläufertexten), `preis.js:1525` Festlegungszähler, totes Ternary | Haiku (S) | Stufe 0+1 grün, Byte-Vergleich der Partie |

---

## 5 · Phase 1 — Wirtschafts-Heilung + Spielstand

### W14 — DIE MESSUNG (messen, nicht bauen)

Die zwei EPOCHENBOGEN-Fragen als Auftrag an **einen** Analysten (Sonnet) auf
vorhandenen Daten + gezielten agentenlosen Läufen: **(A)** Wie lange trägt
eine gut geführte Partie je Epoche (Braujahre bis Ende, Verteilung der
Endgründe)? **(F)** Warum werden Festlegungen nur 0–1× je Partie genommen
(Preislage vs. Sichtbarkeit vs. Nutzen)? Dazu: Deckungs-Median je Epoche als
Ausgangszahl. **Abnahme:** Messblatt mit Zahlen je Epoche; die Zielwerte der
W15/W16-Abnahmen werden daraus von der Aufsicht **vor** W15 festgeschrieben.

### W15 — DIE RÜCKKOPPLUNG (1350 und 1970 nach dem Muster von 1600)

2 Builder (PREIS, FUHRE — **nacheinander**, nie gleichzeitig an derselben
Kennzahl; STADT/GEGNER zu). Preisanker an gespielte Leistung koppeln;
Leiter-Auflagen 8/9 (obere Hälfte 1350, tote Sprossen 1600/1970).
**Abnahme (Formel):** Deckung Median ≥ 1× in allen Epochen auf der
sorgfältigen Linie · \|ρ\| < 0,7 alle Schnitte, alle Epochen · Jahre < 1×
höchstens 1/6 · Wiederholbarkeit 3×/1 Prüfsumme · kein Verb verschwindet.
Reißt 1600: Nacheichung gehört zur Welle, nicht in eine neue.

### W16 — DER ZWEITE WEG

3 Builder: **zweiter Geldweg je Epoche** als epocheneigenes Verb mit
Preisschild (zahlt auf A11 ein; Kandidaten im Feinkonzept §4.3) ·
**Festlegungen erreichbar** (je Michaelitafel ≥ 1 bezahlbar auf sorgfältiger
Linie; „HEUTE BRINGT KEIN KNOPF GELD" wird zur Ausnahme < 10 % der Wochen) ·
**Ruin statt Einfrieren** (Kassenboden über N Wochen → eigener Ausgang mit
Text). **Abnahme:** W15-Formel bleibt grün + neue Zählungen (Geldwege ≥ 2,
Festlegungs-Quote, 0 eingefrorene Partien in 400 Wo. × 4).

### TS1 — Spielstand-Ticketserie (parallel zu W14–W16, Haiku-Klasse)

TS1.1–TS1.6: `B.stand.melde/geladen` für **fuhre** (inkl. Übergabefrist!),
**preis** (Chronik/Leiter/genommen), **sud** (Verfahren/Siegel/Gärkeller),
**erbe**, **name**, **stadt** (Bauten/Belastungen) — je Stück ein Ticket nach
dem GEGNER-Vorbild (`gegner.js:517/:567`, `abweichung []`). Vorher den
E3-Doppelbuchungs-Verdacht klären (GEGENZUG-Warnzettel §3). **Abnahme je
Ticket:** Wiederkehr ziffernweise gleich (15/15-Muster), `?neu=1` frisch,
Kurzlauf-Prüfsumme unverändert.

---

## 6 · Phase 2 — Release-Kandidat

### W17 — DIE LESBARKEIT (ρ-begleitet, da Layout = Wirtschaft)

3 Builder (GEGNER, NAME, ERBE — die drei ohne Schriftarbeit) + Aufsicht für
den Kern-Rest (`grund.css:294` `.knopf .preis` 9,9 px; bewegt drei fremde
Bretter → Messpflicht). **Abnahme:** `lesbarkeit.mjs` 1366×768: **0 Knoten
< 12 px** (heute 257), 0 abgeschnittene Kästen (inkl. der 4 aus `zielzeile`),
0 Knöpfe < 24 px; Stufe 2 vorher/nachher (Knopfboden-Lehre!).

### W18 — DER EMPFANG (Onboarding im Spiel)

1–2 Builder: geführte erste 5 Wochen (drei abschaltbare Hinweiszettel am
Faden der Deckungszeile; keine Wanduhrfristen, Budget aus UNBEKANNT-Reserve
des Flächenhaushalts) · Glossar-Blatt am Buch · Zielzeilen-Kontrast ·
Startanschlag-Epochensätze differenzieren. **Abnahme:** Erstspieler-Probe
(blinder Kritiker, 10 Minuten, Fragenkatalog der Spielprobe: „Was tun? Was
ist Gewinnen?") + Flächenhaushalt + Stufe 1–2.

### Tickets T2.x

| ID | Paket | Wer |
|---|---|---|
| T2.1 | **Startseite/Startmenü** außerhalb `spiel/index.html`: Bogen beginnen · Freies Spiel (Epoche+Saat) · Tagespartie (Datumssaat) · Fortsetzen · Fußzeile | Sonnet (M) |
| T2.2 | **Impressum + Datenschutzerklärung** (localStorage-only, kein Tracking, Netlify-Logs erwähnen) als Unterseite der Startseite | Haiku (S) |
| T2.3 | **Meta:** `<title>`, Favicon, OG-Card, Description auf der Startseite (spiel/index.html bleibt eingefroren) | Haiku (S) |
| T2.4 | **Spielstand-Migration:** FASSUNG=2-Gerüst — Migrationsfunktion statt Verwerfen; Test: F1-Stand → F2 geladen | Sonnet (M) |
| T2.5 | **Cross-Browser-Probe** (einmalig): Playwright firefox/webkit — laden, 30 Wochen, Spielstand, WebAudio; Befund, keine Blindreparatur | Sonnet (M) |
| T2.6 | **Browser-Deklaration** (unterstützte Versionen) auf der Startseite | Haiku (S) |

**Meilenstein-Abnahme RC1:** Stufen 0–2 grün, W13-Kritikerpunkte geschlossen
oder begründet offen, blinder Spielkritiker bestätigt: „die 20 Minuten
verkaufen".

---

## 7 · Phase 3 — Der Bogen

### W19 — DAS ERBSTÜCK (Bogen light)

2 Builder (FUHRE fürs Bilanz-/Übergangsblatt, ERBE für Erbstück-Ableitung)
+ Aufsicht (Bogen-Zustand `brauhaus:bogen`, Startlagen-Einsetzung in
`welt.aufbau()` als Datenpfad). Übersetzungstabellen je Übergang als Daten
(Feinkonzept §3). **Abnahme:** Bogen ohne Erbstücke == Szenario (Byte-
Vergleich) · je Übergang ein Messlauf mit Maximal-Erbe innerhalb der ρ-Latte ·
die drei Übergangs-Auflagen des EPOCHENBOGEN nachgewiesen (angekündigt, kein
Abbruch, Deckel).

### W20 — DIE VERBEN (A11)

3 Builder nacheinander/parallel je Kennzahl-Disziplin: STADT (Verwertung zu
sichtbaren epocheneigenen Sonderzügen), FUHRE (epocheneigene Logistikzüge),
GEGNER (MITBIETEN-Muster je Epoche eigen). SUD bleibt Referenz.
**Abnahme:** Verbliste je Epoche (Zählgerät vorhanden): **≥ 3 mechanisch
eigene Verben je Epoche außerhalb des SUD**, Jaccard < 0,6; Stufe 2 grün.

### W21 — DAS NACHSPIEL

2 Builder (ERBE: Generationen-Nachspiel nach Partieende — der angekündigte,
nie gebaute Handler; FUHRE/KLANG: Partie-Bilanz mit 2–3 Wendepunkten aus dem
Protokoll, Schlussklang, „Dieselbe Saat noch einmal"/„Neue Saat",
Tagespartie-Bilanzteilen). **Abnahme:** Ende-Probe (`boden-ende.mjs`-Muster)
in allen Ausgängen, Flächenhaushalt, Stufe 1–2; Kritiker-Frage: „Wollte ich
sofort noch einmal?"

---

## 8 · Phase 4 — Die Gegenwart (fünfte Epoche)

*Bindend nach P3. Der teuerste Content-Block — sauber in drei Wellen.*

### W22 — DIE ENTRIEGELUNG (Kern + Material)

Aufsicht: die ~6–8 „4"-Stellen im Kern zu „Anzahl Epochen" (`welt.js`
EPOCHEN+Währung Euro, `orte.js` ab/bis-Default, `uhr.js`, GRENZEN);
Epoche-IV-Texte auf *bestehen* nachgezogen. Parallel Asset-Erzeugung
(agentenlos + 1 Builder): Platte 2025 nach `zielbild/prompts/`-Regeln
(Kontinuität!), Hof-Aufbauten, `bett5`/`hof5`/Kleinklänge über
`klang-erzeuge.py`. **Abnahme:** vier Bestandsepochen ziffernweise unverändert
(Prüfsummen!); Platte besteht Sperrlisten-Sichtung; Gewicht E5 < 8 MB.

### W23 — DAS MATERIAL (Stück-Daten)

4 Builder (SUD, PREIS, STADT+GEGNER, FUHRE+NAME+ERBE-Daten): die ~25
Datentabellen mit Schlüssel `5:` — Verfahren, Anschläge/Festlegungen,
Bauten/Verwertung, Gegner-Züge (Konzern-Adler), Fuhrpläne, Rufwährung,
Erbe-Lagen; Verbliste nach Feinkonzept §2a. **Kein `|| [4]`-Rückfall bleibt
stehen** (grep-Gate). **Abnahme:** E5 lädt, `tor.mjs`+`spielprobe.mjs` 60 Wo.,
Verbliste ≥ 3 eigene Verben, Faktencheck gegen `REFERENZEN.md`.

### W24 — DIE EICHUNG

Wie jede Epoche zur Abnahme: Wiederholbarkeit (3×/6×), ρ-Latte alle Schnitte,
Jahre < 1×, Lesbarkeit, Deckung, Ohr (F4-Regeln, „bett5 hörbar eigen"),
Bogen-Übergang 1970→Gegenwart mit Erbstücken, Abspannblatt nach dem
Gegenwarts-Ende. **Abnahme:** volle Stufe 2+3 für E5; blinder Spielkritiker
(20 Minuten) bestätigt, dass die Gegenwart **kein Kostüm** ist.

---

## 9 · Phase 5 — Feinschliff

### W25 — DIE FLÄCHE (Latte 1)

Skelett-Deckung (Kopfleiste 26 % Anteil!), `erb-buch`-Schließknopf mit
`data-zug` (Escape-Kette: 41–44 % → Ziel < 12 % nach Escape), B15/B16,
Darre+Rauch 1600 (das einzige echte Weltdefizit laut Kritiker).
**Abnahme:** Deckung Ladezustand < 8 %, nach 30 Wo. < 12 %, Escape senkt
statt öffnet — **dann** `auge.py`-Blindvergleich über alle fünf Epochen.

### Tickets T5.x

T5.1 Audio E2-Eigenklänge (`bau2`/`drueben2`/`nachbar2`, Gewichtsbudget!) ·
T5.2 Lautstärkeregler (API `setzeLaut` liegt bereit) · T5.3 Barrierefreiheits-
Basis + ehrliche Deklaration · T5.4 Latte-3-Neuabnahme nach F4.

---

## 10 · Budget-Streichreihenfolge (wenn Tokens knapp werden)

Von zuerst streichbar zu unantastbar: T5.2/T5.3 → W25-Blindvergleich (Proxy
reicht vorerst) → Audio E2 (T5.1) → W21-Tagespartie-Teilen → W20 auf 2
Stücke kürzen → **P4 verschieben (die Gegenwart ist der größte Block — lieber
ganz verschieben als halb bauen)** → W18 auf Zielzeile+Glossar kürzen.
**Nie streichen:** P0, W14–W16, TS1, W17, T2.1–T2.4 — ohne sie gibt es kein
veröffentlichbares Spiel.

---

## 11 · Startauftrag für die Aufsicht (Opus 5) — zum Einfügen

> Du bist die Aufsicht des Brauhaus-Imperium-Laufs, Nachfolgerin der Aufsicht
> der Wellen 1–13. Arbeitszweig: `claude/brauhaus-imperium-sim-163s85`.
> Lies zuerst, in dieser Reihenfolge und nichts weiter:
> `feinkonzept/FEINKONZEPT.md`, `feinkonzept/UMSETZUNGSPLAN.md`,
> `analyse/ANALYSE.md`, `gauntlet/MESSLATTE.md`, `spiel/LIESMICH.md` — und aus
> `werkbank/LAUFENDER-AUFTRAG.md` nur den Kopf und den Abschnitt „WELLE 13".
> Die zehn Tokenregeln in UMSETZUNGSPLAN §1 sind bindend; die Detailberichte
> in `analyse/berichte/` liest du nur abschnittsweise bei Bedarf, Builder nie.
>
> Dein Auftrag: Führe den Plan phasenweise aus, beginnend mit Phase 0
> (T0.1–T0.10; T0.2 zuerst — keine neue Welle auf einem nicht abgenommenen
> Stand). Je Welle: Brief nach dem Muster `gauntlet/WELLE-13.md` mit
> vordatiertem Maß und „Was nicht kaputtgehen darf"-Liste; Builder auf
> Sonnet-Klasse mit Kontextpaket, Mechanik auf Haiku, blinde Kritiker nur an
> Wellengrenzen nach dem Muster `gauntlet/WELLE-13-KRITIK.md`. Alle Messläufe
> agentenlos; du liest Ergebnisdateien. Abnahmen nach den Gate-Bündeln in
> UMSETZUNGSPLAN §2. Führe `werkbank/LAUFENDER-AUFTRAG.md` und die
> Fortschrittsseite laufend nach. Ermessensfragen mit Zahlenlage an den
> Auftraggeber; Vorentscheidungen (FEINKONZEPT §1) gelten, bis er widerspricht.
> Wird das Tokenbudget knapp, gilt die Streichreihenfolge in §10 —
> berichte, was du zurückstellst.

---

## 12 · Offene Ermessenspunkte für den laufenden Betrieb

1. **R13-Restschwelle** (drei häufigste Knöpfe 1350/1600) — Entscheidung der
   Aufsicht nach eigener Messung in T0.2/6.
2. **Vorziehregel-Frage** (W12-Begründung) — Messung in T0.2/6; Regel bleibt
   bis dahin.
3. **F4-Details** (Ohr-Mehrheitsregel) — Vorentscheidung im Feinkonzept, bei
   W24/T5.4 anwenden; Veto des Auftraggebers jederzeit möglich.
4. **Reichweite** (itch.io/Domain) — nach RC1 erneut vorlegen.
