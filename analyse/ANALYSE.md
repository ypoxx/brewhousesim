# Analyse: Vom Sechs-Tage-Lauf zum vollwertigen Spiel

*Geschrieben am 8. August 2026. Untersuchungsgegenstand ist der Branch
`claude/brauhaus-imperium-sim-163s85` am Stand `b24ee0b` (Welle 13, alle vier
Builder abgegeben, Abnahme der Aufsicht läuft am eingefrorenen Stand `b098fc6`).
Grundlage: zehn unabhängige Untersuchungen — sieben Leser über Kern, Stücke,
Loop-Verfahren, offene Befunde und Inhalte, eine echte Laufprobe per Playwright,
danach Gap-Analyse, Prozessanalyse und ein Vollständigkeitskritiker. Die
vollständigen Einzelberichte liegen in [`berichte/`](berichte/).*

**Zweck dieses Papiers:** die belastbare Grundlage für das Feinkonzept und den
hochdetaillierten Umsetzungsplan, den Agenten kostengünstig und mit
automatischen Qualitätschecks abarbeiten sollen. Es sagt, was da ist, was fehlt,
was kaputtgehen kann und welche Entscheidungen nur der Auftraggeber treffen
kann.

---

## 1 · Der Stand in fünf Sätzen

1. **Das Spiel läuft und ist substanziell spielbar.** Die Laufprobe vom 8.8.
   maß in allen vier Epochen 0 JS-Fehler, ein volles Braujahr inklusive
   selbst aufliegender Michaelitafel, 57–76 echte Handlungsverben pro Woche und
   funktionierendes Speichern/Fortsetzen ([`berichte/07-laufprobe.md`](berichte/07-laufprobe.md)).
2. **Das Fundament ist ungewöhnlich hart erarbeitet:** deterministische Partien
   („dieselbe Saat, dieselbe Partie", sechs Läufe à 400 Wochen mit einer
   Prüfsumme), ein Regelwerk (`ZUSTAENDIGKEIT.md`, `LIESMICH.md`), Datei-Eigentum
   je Stück und ein fast vollständig in Skripte gegossener Messapparat.
3. **Der zentrale Spielmangel ist bekannt und unbehoben:** *„ein interessantes
   Spiel, das man nicht spielen darf, weil das Geld fehlt"* — Deckung im Median
   0,08–0,62×, Festlegungen in 1350/1970 nie bezahlbar, genau ein geldbringender
   Knopf im ganzen Spiel. Welle 13 hat bewusst keine Wirtschaftszahl angefasst.
4. **Das Epochenversprechen („1350 bis heute") ist nicht eingelöst:** geliefert
   sind vier getrennte Szenarien; die bindende Richtungsvorgabe des
   Auftraggebers vom 3.8. (`gauntlet/EPOCHENBOGEN.md`: Epochenwechsel nach
   Civ-7-Art, „Erst der Bogen, dann die Gegenwart") ist unbearbeitet.
5. **Die Welle-13-Abnahme ist nicht abgeschlossen** (Wiederholbarkeit 1600/1884/
   1970, Latte-2-Messung, Gegenmessung, vier blinde Kritiker stehen aus) — auf
   einem nicht abgenommenen Stand weiterzubauen war im Lauf bisher immer der
   teuerste Fehler.

---

## 2 · Was da ist und trägt

### 2.1 Das Spiel

~44.000 Zeilen framework-loses JS/CSS/HTML ohne Build-Schritt, ein globaler
Namensraum `BRAUHAUS`, Ereignisbus, Immediate-Mode-Zeichnen, deterministischer
Rundenschluss (Details: [`berichte/01-kern-architektur.md`](berichte/01-kern-architektur.md)):

| Baustein | Inhalt |
|---|---|
| **Kern** (11 Dateien, ~5,6k Z.) | Uhr/Bus/Würfel, Weltzustand + Ökonomie-API, Rundenschluss gegen Timing-Rennen, Spielstand (localStorage, `?neu=1`), Bühne/Fächer, HUD, Flächenhaushalt |
| **8 Stücke** (22 Dateien, ~28k Z.) | SUD (Brauen; einziges Stück mit „kein Verb in zwei Epochen"), PREIS (Michaelitafel, Anschläge), STADT (Platte, Bauten, Reiter, Verwertung), GEGNER (2 Gegnerhäuser, 6 Wesenszüge), FUHRE (Wochenkern: Fässer verteilen; trägt auch das Partie-Ende), ERBE (Generationen), NAME (Ruf/Marke), KLANG (49 Klangdateien, lazy, 3 Schichten) |
| **Inhalt** | 4 Epochen mit disjunkten Datenlisten (0 gemeinsame Preis-Einträge), 4 illustrierte Epochenplatten + 48 Hof-Aufbauten (alle referenziert), 49/49 Töne genutzt, Faktendossier + Sperrliste |
| **Ende** | 3 gute + 4+ schlechte Ausgänge je Epoche, zentral über `B.uhr.beende()`; die Spielprobe nennt das Ende das beste Blatt des Spiels |

Verbliste (Kostüm-Frage, [`berichte/02-stuecke-wirtschaft.md`](berichte/02-stuecke-wirtschaft.md)):
~30 Verben je Epoche, davon **~22–23 in allen vier Epochen mechanisch identisch**
(Jaccard 0,70–0,81). Echt epocheneigen: 24 SUD-Verfahrensoptionen, 2
SUD-Chargenverben und 3 GEGNER-Verben (nur 1970), 4 STADT-Verwertungsschlüssel.
Das ist die offene Auflage A11 („vier Tapeten").

### 2.2 Der Messapparat (der eigentliche Schatz für die nächste Phase)

Vier Latten + Sperrliste, fast vollständig als Skripte ausführbar
([`berichte/04-loop-verfahren.md`](berichte/04-loop-verfahren.md), §3):

| Prüfung | Gerät | Stand |
|---|---|---|
| Latte 1 · Bild (blinder A/B gegen `zielbild/`) | `auge.py` | **nicht bestanden** (3:0 für das Zielbild, W9; seither nie neu geurteilt). Ursache: UI-Deckung 11–15 % vs. 3,1 % Ziel; nach einem Escape 41–44 % |
| Latte 2 · Spiel (ρ Barschaft÷nächster umkämpfter Zug) | `linie.mjs` + `nenner.mjs` + `auswerten.py` | **numerisch bestanden** (W12: max. +0,538), aber 1600 hat nur 0,162 Reserve |
| Latte 3 · Ton (fremdes Ohr nennt Epoche/Vorgang) | `ohrprobe.mjs` + `hoerer.py` | Epoche 10/12; drei Messlattenfragen liegen ausdrücklich beim Auftraggeber |
| Latte 4 · Lesbarkeit (1366×768) | `lesbarkeit.mjs` | **gerissen**: 257 Textknoten < 12 px (von 1.899 kommend), 0/292 Knöpfe zu klein |
| Sperrliste + Gewichtsveto 8 MB | `design/PRUEFUNG.md`, `gewicht-gegenprobe.mjs` | Gewicht: 1600 am/über dem Limit (offiziell 7,80 MB; Laufprobe maß 8,35 MB — Messweise klären) |
| Voraussetzung: Wiederholbarkeit | `messstand.sh`, `messfenster.sh`, 3 Läufe/1 Prüfsumme | **steht** (1350 sechsfach belegt); Frage „hält sie ohne Vorziehregel?" offen |

Dazu: `tor.mjs` (Commit-Gate), `spielprobe.mjs` (60 Wochen echt spielbar),
`tempo.mjs`, Deckungsmesser, Betriebsskripte (`veroeffentlichen.sh`,
`wiederaufnahme.sh`, `stand.py`) und maschinenlesbare Spiel-Attribute
(`data-zug`, `data-bereit`, `B.lage`, `B.zuege()`).

### 2.3 Der Loop und seine Lehren

13 Wellen Gauntlet-Loop (Builder je Stück + blinde Kritiker mit frischem
Kontext + Aufsicht mit vordatierten Maßen an eingefrorenen Ständen). Die teuer
bezahlten Lehren sind dokumentiert und gehören in jede Folgephase: eingefrorene
Messstände, sequenzielle Messungen, enge Lesarten („kann man die Abnahme
bestehen, indem man nichts tut?"), getrennte Exit-Codes für „durchgefallen" und
„keine Messung", Urteile als Repo-Dateien, ≥23 Container-Resets überlebt.
Wellengeschichte und vollständige Lehrenliste: [`berichte/04-loop-verfahren.md`](berichte/04-loop-verfahren.md).

---

## 3 · Die Lücken zum vollwertigen Spiel

Vollständiges Register mit Schweregrad und Umfang je Lücke:
[`berichte/08-gap-analyse.md`](berichte/08-gap-analyse.md). Die Blocker in Kurzform:

| # | Blocker | Kern des Problems |
|---|---|---|
| B-1 | **Wirtschaft der Minuten 4–20** (b1/b2/c1) | Deckung < 1× in 742/1030 Wochen; keine Rückkopplung Ergebnis→Schwierigkeit (nur 1600 „belohnt Sorgfalt und bestraft Erfolg"); Partien enden faktisch nach ~3 Braujahren, das gute Ende bleibt unerreichbar |
| B-2 | **Spielstand unvollständig** (h1) | Eigenzustand `Z` von 7 der 8 Stücke wird nicht gesichert (nur GEGNER nachgerüstet): Reload verliert Bauten, Siegel, Übergabefrist, Register — „Fortsetzen" ist derzeit eine Falle |
| B-3 | **Epochenversprechen** (d1) | Auftraggeber-Vorgabe Epochenbogen (EPOCHENBOGEN.md) vs. gebaute vier Szenarien; Entscheidung F1 nötig |
| B-4 | **Lesbarkeit** (g1) | 257 Knoten < 12 px; GEGNER/NAME/ERBE-Schriftarbeit fehlt; Vorsicht: Knopfboden-Lehre (Layout verschob ρ um 0,811) |
| B-5 | **Distribution** (i1/i2, j1) | Netlify deployt die gesamte Repo-Wurzel (186 MB design/, 145 MB werkbank/ samt interner Urteile öffentlich); kein Startmenü, keine Meta-Tags, kein Impressum/Datenschutz (DE-Pflicht) |
| B-6 | **Gewichtsveto** (h2) | 1600 am/über 8 MB; bekannte Reserve: 4,4 MB PNG→WebP, 675 KB tote Dateien |
| B-7 | **Spielstand-Politik** (h3) | `FASSUNG=1` verwirft bei jedem Update alle laufenden Partien — ab dem ersten Post-Launch-Update ein Blocker |

Qualitätslücken (Auswahl; vollständig im Register): kein Tutorial/geführte
erste Partie (75–81 Knöpfe in Woche 1), A11-Verblisten, ERBE-Nachspiel und
Partie-Bilanz fehlen (Daily-Seed/Challenge wäre mit dem Determinismus fast
geschenkt), „handlungsunfähig, aber nicht tot"-Zustand, 1600 borgt fast alle
Kleinklänge von 1350, Escape-Regression (öffnet `erb-buch` ohne Schließknopf),
Mobile/Touch ungelöst, Barrierefreiheit undeklariert, Cross-Browser nie
getestet (jede Messung lief in Chromium), Rechtekette der KI-Assets
undokumentiert.

**Konsolidiertes Auflagenregister** (A1–A13 der Spielprobe, B1–B17 des
Bildvergleichs, Kern-/Geräte-Auflagen, Zurückgestelltes, aufgelöste
Widersprüche): [`berichte/05-befunde-offen.md`](berichte/05-befunde-offen.md).

---

## 4 · Die zehn stärksten Hebel (priorisiert)

Aus [`berichte/08-gap-analyse.md`](berichte/08-gap-analyse.md) §3:

1. **Wirtschaft der Minuten 4–20 heilen** — der Spielprobenbefund ist eindeutig; alles andere poliert ein Spiel, das man „nicht spielen darf".
2. **Spielstand vervollständigen** (Stück-Zustände sichern, nach GEGNER-Vorbild).
3. **Veröffentlichungsfähig machen**: Deploy trennen, Gewicht unters Veto, Impressum/Meta — billig, sofort wirksam.
4. **Lesbarkeit zu Ende führen** (mit ρ-Begleitmessung).
5. **Ende und Wiederspielreiz ausbauen** (ERBE-Nachspiel, Partie-Bilanz, Saat-Neustart/Daily-Seed).
6. **Epochenversprechen entscheiden und einlösen** (F1).
7. **A11 Verblisten** (gegen das „vier Tapeten"-Urteil).
8. **Onboarding-Schicht** (erst nach der Wirtschaft — ein Tutorial in ein unbezahlbares Spiel führt in die Irre).
9. **Flächen-/Escape-Regression und Latte 1** (danach neuer Blindvergleich).
10. **Audio-Feinschliff** (E2-Eigenklänge unter dem knappsten Gewichtsbudget; Latte-3-Entscheidungen).

---

## 5 · Was beim Ausbau kaputtgehen kann (Schutzregeln)

Acht Risikofelder mit Schutzmaßnahmen je Eingriff stehen in
[`berichte/08-gap-analyse.md`](berichte/08-gap-analyse.md) §4. Die Querschnittsregel:

> Jeder Arbeitspaket-Typ bekommt sein festes Gate-Bündel — Wirtschaft: ρ-Latte
> + Wiederholbarkeit; UI/Layout: zusätzlich Flächenhaushalt; Assets:
> Gewichtsveto; Spielstand: Wiederkehr-Abnahme „ziffernweise gleich" + `?neu=1`;
> Kampagne: alles, hinter Feature-Schalter; Texte/Protokolle: Kontrakttests
> gegen die stillen Regex-Kopplungen.

Die drei kritischsten Zahlen: **1600 bei ρ +0,538** (Reserve 0,162 — jede
Preis-/Layoutänderung misst 1600 zuerst), **Δρ 0,811 durch eine reine
Layoutänderung** (Knopfboden-Lehre), **6 Läufe = 1 Prüfsumme** als Bedingung
jeder Zahl.

---

## 6 · Empfehlung für den Umsetzungs-Loop (kostengünstig, automatisch geprüft)

Vollständig in [`berichte/09-prozess-kosten.md`](berichte/09-prozess-kosten.md). Kernsatz:

> Der Loop hat seine Qualitätssicherung bereits fast vollständig in Skripte
> gegossen — bezahlt wird heute vor allem dafür, dass teure Modelle Skripten
> beim Laufen zusehen und dass jede Arbeit die volle Abnahme durchläuft.

**Prüfpyramide** (alles Ratchet, laute Fehler):

| Stufe | Wann | Was | Kosten |
|---|---|---|---|
| 0 | je Commit | `tor.mjs`, Gewicht, statische Wächter (kein `Math.random`, kein fremdes Datei-Eigentum, `?neu=1` in Messadressen) | ~null |
| 1 | je Ticket | `spielprobe.mjs`, `lesbarkeit.mjs`, Deckungs-Proxy, Kurzlauf-Prüfsumme (100 Wochen; Partieneutralität per Byte-Vergleich) | Minuten, Skript |
| 2 | nächtlich/Wellengrenze | volle Latte 2 (400 Wochen × 4 Epochen, sequenziell), Wiederholbarkeits-Vollprobe, Haushalt | Rechenzeit, agentenlos (CI) |
| 3 | Wellengrenze | blinder Spielkritiker, `auge.py` (erst wenn Deckungs-Proxy < 8 %), `hoerer.py`, Faktencheck | die einzigen Modellkosten der QS |

**Arbeitsteilung:** Aufsicht/Planer auf starkem Modell (Wellenbriefe mit
vordatiertem Maß, Schwellen, `kern/**`, git); Builder für regelwirksame Arbeit
auf Sonnet-Klasse (je Ticket ein destilliertes Kontextpaket statt Volllektüre);
mechanische Tickets auf Haiku-Klasse oder reines Skript (fertig geschnittene
Kandidaten: Stück-Spielstände nach GEGNER-Vorbild, PNG→WebP, `?neu=1` in fünf
Messgeräte, Lesbarkeits-Rest, dokumentierte Kleinfehler, Netlify-Scope).
**Hybrid-Betrieb:** Wellen (max. 4 parallele Builder) nur für ρ-wirksame
Arbeit; Ticket-Betrieb ohne Vollabnahme für beweisbar Partieneutrales.

**Größte Kostenhebel:** Messläufe agentenlos in CI (sehr groß) · Modellmix
(groß) · Ticketisierung mit Byte-Vergleich statt Vollabnahme (groß) ·
Kurzlauf-/Proxy-Metriken nach einmaliger Kalibrierung (mittel–groß) ·
Repo-Hygiene: 145 MB Belege/186 MB Design aus dem Deploy- und Arbeitspfad
(mittel, dauerhaft) · langfristig: headless Sim-Kern (Ökonomie ohne DOM) als
eigenes, voll abgenommenes Kern-Projekt.

---

## 7 · Entscheidungen des Auftraggebers (F1–F8)

> **Nachtrag vom 8.8., nach Vorlage dieser Analyse:** Der Auftraggeber hat
> entschieden — F1 Bogen light, F2 **fünfte spielbare Epoche „Die Gegenwart"**,
> F3 Wirtschaft heilen mit Schutzprotokoll, F5/F6 Desktop-Browser/Deutsch,
> F7 Release-Schnitt. Die Festlegungen samt Vorentscheidungen zu F4/F8 stehen
> in [`../feinkonzept/FEINKONZEPT.md`](../feinkonzept/FEINKONZEPT.md), der Plan in
> [`../feinkonzept/UMSETZUNGSPLAN.md`](../feinkonzept/UMSETZUNGSPLAN.md). Die
> Tabelle unten bleibt als Entscheidungsgrundlage stehen.

Vollständig begründet in [`berichte/10-vollstaendigkeitskritik.md`](berichte/10-vollstaendigkeitskritik.md) §4:

| # | Frage | Optionen (Kurzform) |
|---|---|---|
| **F1** | Was ist die Vollversion? | (a) **Epochenbogen** (Civ-7-Art — die eigene Vorgabe vom 3.8.; XL, dominiert die Phase) · (b) **vier Szenarien vollausbauen** (billiger; widerruft die Vorgabe — dann explizit) · (c) **„Bogen light"**: Epochen-Abschlussbilanz + verdiente Mitnahmen ins Folge-Szenario, ohne durchlaufende Uhr |
| **F2** | Fünfte Zeit (2025)? | (a) nein · (b) Epoche IV teilen („bedeuten" wandert in die Gegenwart) · (c) nur Epilog/Abspannbild. Reihenfolge laut EPOCHENBOGEN: erst F1, dann F2 |
| **F3** | Wirtschaft anfassen trotz Latte-2-Risiko? | (a) neu eichen mit Schutzprotokoll · (b) Latte-2-Definition ändern (Auftraggeber-Hoheit) · (c) einfrieren (dann bleibt Kernbefund 1 bestehen) |
| **F4** | Latte 3 (Ton), drei eskalierte Punkte | „Gegenzug hörbar" streichen/ersetzen? 1884-Messbarkeit? Mehrheitsregel? |
| **F5** | Zielplattform | (a) Desktop/Laptop-Browser quer (heutige Architektur) · (b) + Tablet · (c) + Phone (XL) |
| **F6** | Sprache/Reichweite | Deutsch-only vs. i18n; privater Link vs. itch.io/Domain vs. breite Öffentlichkeit (hängt mit Rechtekette der KI-Assets zusammen) |
| **F7** | Repo-/Deploy-Schnitt | (a) weiter auf sim-Branch · (b) **Release-Schnitt**: nur `spiel/` deployen, Werkbank intern · (c) neues Repo/flache Historie. Dazu: PR „no history in common" reparieren oder sim-Branch zum Hauptzweig erklären |
| **F8** | Konzept-Schnitt & Politik | Herkunftswahl/Bedientiefen/Sortenbaum endgültig streichen oder Release-Bedingung? Spielstand-Migration ab FASSUNG=2? Startmenü statt URL-Parameter? |

---

## 8 · Vorgeschlagener Phasenschnitt (Skelett für den Feinplan)

Der detaillierte Umsetzungsplan folgt nach den F1–F8-Antworten als eigenes
Dokument. Das belastbare Skelett:

- **Phase 0 — Abschluss und Hygiene (unabhängig von allen Entscheidungen):**
  Welle-13-Abnahme zu Ende führen (Schritte 2–6 aus `werkbank/LAUFENDER-AUFTRAG.md`,
  inkl. der offenen R13-Schwelle und der Vorziehregel-Messfrage); Repo-Hygiene
  (Deploy-Scope, PNG→WebP, tote Dateien, Belegbilder aus dem Arbeitspfad);
  Prüfpyramide Stufe 0–2 als CI aufsetzen; Messdifferenz beim Gewicht klären.
- **Phase 1 — Spielbar machen:** Wirtschaft der Minuten 4–20 (F3) als
  Wellenbetrieb mit vollem Schutzprotokoll; Spielstand der Stücke (h1) als
  Ticketserie nach GEGNER-Vorbild; „handlungsunfähig, aber nicht tot".
- **Phase 2 — Veröffentlichungsfähig:** Lesbarkeit, Startmenü/Landing,
  Impressum/Datenschutz, Meta/Domain, Cross-Browser-Probe, Spielstand-Migration.
- **Phase 3 — Das Versprechen einlösen:** je F1 Epochenbogen oder
  Szenarien-Vertiefung; A11-Verblisten; Ende/Wiederspielreiz (ERBE-Nachspiel,
  Bilanz, Daily-Seed); je F2 die Gegenwart.
- **Phase 4 — Feinschliff:** Latte 1 (Deckung, dann Blindvergleich), Audio,
  Onboarding-Vertiefung, Barrierefreiheit-Deklaration.

---

## 9 · Anhang: die zehn Einzelberichte

*Pfadkonvention in den Berichten: `«sim-branch»/…` meint die Wurzel des
Branches `claude/brauhaus-imperium-sim-163s85`; `«probe-ordner»/…` meint die
temporären Messdaten/Screenshots der Laufprobe (nicht eingecheckt).*

| Datei | Inhalt |
|---|---|
| [`berichte/01-kern-architektur.md`](berichte/01-kern-architektur.md) | Architekturkarte, Zustandsmodell, Regelwerk, Technikbewertung, Erweiterbarkeit |
| [`berichte/02-stuecke-wirtschaft.md`](berichte/02-stuecke-wirtschaft.md) | SUD, PREIS, STADT, GEGNER — Mechanik, Daten, Verblisten, Schulden |
| [`berichte/03-stuecke-haus.md`](berichte/03-stuecke-haus.md) | FUHRE, ERBE, NAME, KLANG — Mechanik, Inhalte, Partie-Ende, Querbefunde |
| [`berichte/04-loop-verfahren.md`](berichte/04-loop-verfahren.md) | Gauntlet-Verfahren, Messlatten, Werkzeugkasten, Prozesslehren, Wellen 1–13 |
| [`berichte/05-befunde-offen.md`](berichte/05-befunde-offen.md) | Konsolidiertes Auflagenregister, Welle-13-Stand, Zurückgestelltes, Widersprüche |
| [`berichte/06-inhalt-assets.md`](berichte/06-inhalt-assets.md) | Asset-Inventur, Zielbilder, KONZEPT-Abgleich, Design-Vorarbeit |
| [`berichte/07-laufprobe.md`](berichte/07-laufprobe.md) | Ist-Zustand beim echten Spielen (8.8.), Messdaten, Screenshots |
| [`berichte/08-gap-analyse.md`](berichte/08-gap-analyse.md) | Lückenregister (a–k), Top-10-Hebel, Risiken/Schutzmaßnahmen |
| [`berichte/09-prozess-kosten.md`](berichte/09-prozess-kosten.md) | Loop-Bewertung, Kostentreiber, Prüfpyramide, Modellmix |
| [`berichte/10-vollstaendigkeitskritik.md`](berichte/10-vollstaendigkeitskritik.md) | Lücken/Widersprüche der Analyse selbst, übersehene Dateien, F1–F8 |

**Zwei Berichtigungen aus der Vollständigkeitskritik, die beim Lesen der
anderen Berichte gelten:** (1) Die Aussage „jede Epoche ist ein eigenes
Szenario" in `start.js` ist der ehrliche *Zwischenstand* der vertagten A12,
nicht die Ziellage — die Ziellage steht in `gauntlet/EPOCHENBOGEN.md`.
(2) Die Laufprobe spielte mit `fuhre:abschicken`, das die Woche selbst
weiterschaltet — ihre „15 Runden" waren 30 Wochen; Klickanteils-Zahlen der
Laufprobe sind daher nicht mit den A7-Messungen vergleichbar.
