# Feinkonzept: Brauhaus-Imperium — die Vollversion

*Stand 8. August 2026. Baut auf [`../analyse/ANALYSE.md`](../analyse/ANALYSE.md)
und den zehn Berichten in `../analyse/berichte/` auf. Grundlage sind die vier
Entscheidungen des Auftraggebers vom 8.8.: **Bogen light** (F1), **Wirtschaft
heilen mit Schutzprotokoll** (F3), **Desktop-Browser, Deutsch** (F5/F6),
**Release-Schnitt** (F7). Umsetzung: [`UMSETZUNGSPLAN.md`](UMSETZUNGSPLAN.md).*

---

## 1 · Produktdefinition

**Brauhaus-Imperium** ist eine deutschsprachige Browser-Wirtschaftssimulation
für Desktop/Laptop (Querformat, Referenz 1366×768): Man führt nicht eine
Person, sondern **ein Brauhaus über Generationen** durch fünf ungleiche
Epochen von 1350 **bis heute** — 1350 (überleben), 1600 (besitzen), 1884
(skalieren), 1970 (bestehen), Gegenwart (bedeuten). Jede Epoche ist eine
eigenständige, in sich abgeschlossene Partie von ca. 20–45 Minuten; der
**Bogen** verbindet sie: Wer eine Epoche gut abschließt, trägt benannte
**Erbstücke** in die nächste. Gewinnen heißt nicht groß werden,
sondern **übergeben können** — das Haus besteht vor dem Rat, der nächsten Hand,
der nächsten Zeit.

### Festlegungen (F1–F8)

| # | Entscheidung | Status |
|---|---|---|
| F1 | **Bogen light**: eigenständige Szenarien + Abschlussbilanz + Erbstück-Mitnahmen + Abspann; keine durchlaufende Uhr, kein Live-Epochenwechsel | **entschieden** (Auftraggeber, 8.8.) |
| F2 | **Fünfte spielbare Epoche „Die Gegenwart"** (bis heute): Epoche IV wird geteilt — 1970 bekommt das Kernverb *bestehen* (Brauereisterben), *bedeuten* wandert in die Gegenwart. Reihenfolge nach `EPOCHENBOGEN.md`: **erst der Bogen, dann die Gegenwart** | **entschieden** (Auftraggeber, 8.8.) |
| F3 | **Wirtschaft wird geheilt**, jeder Eingriff unter Schutzprotokoll (ρ vorher/nachher, 1600 zuerst); reißt die Latte, wird nachgeeicht, nicht zurückgebaut | **entschieden** (Auftraggeber, 8.8.) |
| F4 | Latte 3 neu: Auflage „Gegenzug hörbar" **entfällt** (ersetzt durch „Michaeli hörbar"); Vorgangsfrage mit **Mehrheitsregel aus drei Durchgängen**; 1884 gilt als messbar, wenn 2 von 3 Durchgängen die Epoche treffen | Vorentscheidung¹ |
| F5 | **Desktop/Laptop-Browser, Querformat**; Tablet/Phone sind Nicht-Ziele | **entschieden** (Auftraggeber, 8.8.) |
| F6 | **Deutsch-only**; Veröffentlichung zunächst als eigene Spiel-URL (Netlify), itch.io/Domain optional später | **entschieden** (Desktop DE); Reichweite: Vorentscheidung¹ „erst privat/Link" |
| F7 | **Release-Schnitt**: Weiterbau auf dem sim-Branch, Deploy nur noch Spiel + Startseite; Werkbank/Design/Zielbilder bleiben intern | **entschieden** (Auftraggeber, 8.8.) |
| F8 | Herkunftswahl, drei Bedientiefen, voller Sortenbaum: **gestrichen** (kein Release-Bestandteil); Spielstand-Migration ab FASSUNG=2: **ja**; Startmenü statt URL-Parameter: **ja** | Vorentscheidung¹ |

¹ *Vorentscheidungen sind vom Auftraggeber per kurzem Veto änderbar; der Plan
behandelt sie als gesetzt, damit nichts blockiert.*

### Nicht-Ziele (bewusst gestrichen)

Mobile/Hochformat, i18n, Steam/Wrapper, Multiplayer,
Herkunftswahl (KONZEPT §5), drei Bedientiefen (§8), voller Sortenbaum (§9),
vollständige Screenreader-Tauglichkeit (stattdessen ehrliche Deklaration +
Basis-Rollen), Live-Epochenwechsel mit durchlaufender Uhr (das war Option
F1a — durch Bogen light ersetzt; der `EPOCHENBOGEN.md`-Gedanke lebt in den
Übergangs-Auflagen weiter, siehe §3).

---

## 2 · Das Spielerlebnis der Vollversion (Soll-Zustand)

**Einstieg.** Eine schlanke Startseite (außerhalb der eingefrorenen
`spiel/index.html`) ersetzt die URL-Parameter: Titel, ein Satz zum Ziel,
**„Den Bogen beginnen"** (startet 1350 mit Tagessaat), darunter „Freies
Spiel" (Epoche + Saat wählbar, inkl. **Tagespartie** — dieselbe Saat für alle,
aus dem Datum abgeleitet), „Fortsetzen", Impressum/Datenschutz im Fuß.

**Die erste Viertelstunde.** Der Startanschlag (W13, R4) bleibt; dazu kommt
eine **geführte erste Spanne** von fünf Wochen: die vorhandene beste Zeile des
Spiels („nächster Zug … Kasse reicht N×") wird zum roten Faden — drei knappe,
abschaltbare Hinweiszettel (Sud ansetzen → Fuhre packen → Michaeli lesen),
gezeichnet im Rahmen-Budget, ohne neue Wanduhrfristen. Ein **Glossar-Blatt**
(Kerbholz, Angeld, Bannmeile …) hängt als Reiter am Buch.

**Die Woche (Minuten 4–20) — geheilt.** Zielbild je Epoche, messbar:
Deckung (Barschaft ÷ Preis des nächsten umkämpften Zuges) im **Median ≥ 1×**
über die sorgfältig gespielte Linie; **mindestens zwei Wege, Geld
hereinzuholen** (heute: genau einer im ganzen Spiel); auf jeder Michaelitafel
ist in der sorgfältigen Linie **mindestens eine Festlegung bezahlbar**; die
Rückkopplung Ergebnis→Schwierigkeit folgt dem Muster von 1600 („belohnt
Sorgfalt und bestraft Erfolg" — Preise wachsen schneller als die Barschaft,
ρ bleibt im Band); wer zahlungsunfähig wird, ist **ruiniert statt
eingefroren** — der Zustand „handlungsunfähig, aber nicht tot" bekommt Text
und Ausgang. Die ρ-Latte (|ρ| < 0,7, alle drei Schnitte, höchstens ein Jahr
von sechs unter 1×) bleibt in Kraft; wo die Heilung sie reißt, wird die
Eichung nachgezogen (Entscheidung F3).

**Epochenidentität.** Auflage A11 wird eingelöst: je Epoche **mindestens drei
mechanisch eigene Verben** außerhalb des SUD (der sie schon hat), Jaccard der
Verblisten **< 0,6** (heute 0,70–0,81). Kandidaten aus dem Bestand: STADT
(Verwertung je Epoche zu echten, sichtbaren Sonderzügen ausbauen), FUHRE
(epocheneigene Logistikzüge: Flößerei/Eiskeller-Touren/Rampenvertrag), GEGNER
(das 1970er MITBIETEN-Muster in die anderen Epochen mit je eigenem
Mechanismus spiegeln, nicht kopieren).

**Das Ende — vom besten Blatt zum Wiederspielgrund.** Das Schlussblatt bleibt;
dazu kommen: das **ERBE-Nachspiel** (die angekündigte, nie gebaute
Generationen-Schlussszene), eine **Partie-Bilanz** (Kennzahlen-Verlauf, die
zwei, drei Wendepunkte der Partie aus dem Protokoll, ohne Belehrung), der
**Schlussklang** („die Pfanne verstummt"), und zwei Knöpfe: „Dieselbe Saat
noch einmal" / „Neue Saat". Die **Tagespartie** macht aus dem Determinismus
ein Feature: alle spielen dieselbe Partie, vergleichbar per geteilter Bilanz.

**Der Bogen (F1, Bogen light).** Nach einem *guten* Ende einer Epoche zeigt
die Bilanz den **Übergang**: „Das Haus besteht. 250 Jahre später …" — und
welche **Erbstücke** mitgehen. Erbstücke sind benannte, epochengerecht
übersetzte Startvorteile in engen Bändern (§3). Danach startet das nächste
Szenario mit diesen Startlagen-Anpassungen. Ein schlechtes Ende beendet den
Bogen ehrlich (mit „Freies Spiel"-Angebot der nächsten Epoche). Der Bogen
läuft **bis heute**: nach 1970 folgt die fünfte Epoche „Die Gegenwart" (§2a),
und nach ihr ein Abspannblatt mit der Chronik des Hauses über alle gespielten
Epochen.

### 2a · Die fünfte Epoche: „Die Gegenwart" (bis heute)

Die geplante, nie angefasste Epoche wird gebaut — als vollwertiges fünftes
Szenario und Schlussstein des Bogens. Rahmen (aus `zielbild/05-2025.jpg`,
`zielbild/prompts/`, `gauntlet/EPOCHENBOGEN.md`, `design/REFERENZEN.md`):

- **Schnitt der Zeiten:** Epoche IV wird geteilt. 1970 spielt fortan das
  **Bestehen** im Brauereisterben (Konzentration, Handel, Pfand); die
  Gegenwart (Schaujahr ~2025, Währung Euro) übernimmt das **Bedeuten** — die
  vom Konzept selbst notierte Korrektur. Epochengrenzen und Texte werden
  nachgezogen.
- **Derselbe Ort, 675 Jahre später:** Sudhaus hinter Glas, Solardach,
  Verbrauchermarkt, der alte Schornstein als Denkmal, die Stadtmauer bis auf
  ein Fragment verschwunden, das Adler-Werk **größer** als das eigene Haus —
  die Kontinuitätsregeln stehen fertig im 2025-Prompt.
- **Eigene Verbliste** (A11 gilt dann für fünf Epochen): Kandidaten —
  Sortenprogramm/Saisonales, Direktvertrieb und Erlebnis (Schankraum,
  Führung), Regionalität/Herkunft als Rufwährung, Listung vs. Eigenweg gegen
  den Konzern-Adler. **Kein `|| [4]`-Rückfall:** eine Gegenwart ohne eigenes
  Material wäre „dieselbe Epoche mit anderer Typografie" — genau davor warnt
  der EPOCHENBOGEN.
- **Voller Materialsatz:** ~25 Datentabellen in 8 Stück-Dateien (im
  EPOCHENBOGEN gezählt), eigene Platte + Hof-Aufbauten, `bett5`/`hof5`/
  Kleinklänge, GRENZEN-Budget, HUD-Werte, Startzettel; ~6–8 hartkodierte
  „4"-Stellen im Kern werden zu „Anzahl Epochen".
- **Volle Abnahme wie jede Epoche:** Wiederholbarkeit, ρ-Latte, Lesbarkeit,
  Gewichtsveto (< 8 MB gilt je Epoche), Ohr nach F4-Regel, Sperrlisten-/
  Faktencheck gegen `REFERENZEN.md` (die Gegenwart ist faktenreich: Pfand,
  Craft, Energie — die Sperrliste disqualifiziert, gewinnt nie).
- **Reihenfolge bindend:** erst Wirtschafts-Heilung und Bogen an vier Epochen
  abgenommen, **dann** die Gegenwart („Erst der Bogen, dann die Gegenwart").

**Präsentation.** Lesbarkeit: **0 Textknoten unter 12 px** bei 1366×768
(heute 257); UI-Deckung im Ladezustand **< 8 %** (heute 11–15 %), die
Escape-Kette repariert (`erb-buch` bekommt einen eigenen Schließknopf mit
`data-zug`); danach ein neuer Blindbildvergleich als Abnahme der Latte 1.
Audio: Epoche 1600 bekommt eigene Kleinklänge (unter dem knappsten
Gewichtsbudget), ein Schlussklang kommt dazu; Latte 3 nach F4-Definition
abgenommen. Gewicht: **jede Epoche < 8 MB Erstaufruf** (PNG→WebP löst das).

**Technik.** Spielstand sichert **alle acht Stücke** (heute 1 von 8) und
übersteht Updates ab FASSUNG=2 per Migration statt Verwerfen; `?neu=1` bleibt
Teil jeder Abnahme; die Determinismus-Doktrin (Vorziehregel, rAF-Messstellen,
keine Wanduhrfristen im Zeichenweg) ist unantastbar; einmalige
Cross-Browser-Probe (Firefox/WebKit) vor dem Release.

---

## 3 · Das Erbstück-System (Kern des Bogen light)

Die drei Übergangs-Auflagen aus `gauntlet/EPOCHENBOGEN.md` gelten wörtlich —
sie sind der Grund, warum Bogen light funktioniert, ohne die Balance zu
zerstören:

1. **Nichts fällt unangekündigt.** Die Bilanz zeigt vor dem Übergang, was
   mitgeht und was zurückbleibt — mit Begründung in der Sprache der Epoche.
2. **Kein Abbruch ohne Ausweg.** Der Übergang geschieht am Partie-Ende, nie
   mitten in laufenden Vorhaben.
3. **Der Schnitt trifft Erfolgreiche nicht härter.** Erbstücke sind
   **gedeckelt** (enge Bänder), damit ein überragendes 1350 nicht 1600
   trivialisiert — sonst wäre Latte 2 „betrogen".

**Mechanik (bewusst schmal, alles Daten, kein neuer Kern):** Am guten Ende
werden aus der Partie **höchstens drei Erbstücke** abgeleitet, je eines aus
drei Klassen; jede Klasse übersetzt sich in genau eine Startlagen-Änderung
des Folge-Szenarios:

| Klasse | woraus sie entsteht | was sie im Folge-Szenario ändert (Band) |
|---|---|---|
| **Der Name** | Rufstand/Register des NAME | Startruf +1 Stufe; eine Adresse beginnt gewogen (max. eine) |
| **Das Werk** | bester Bau/Verfahren (STADT/SUD) | ein benanntes Startgebäude bzw. ein freigeschaltetes Verfahren, epochengerecht übersetzt („Der alte Gärkeller" → „Das Kellergewölbe") |
| **Der Grund** | Kassenlage/Bindungen am Ende | Startkasse +5–15 % des epochalen Startwerts, hart gedeckelt |

Übersetzungstabellen je Übergang (1350→1600→1884→1970) sind **Dateninhalt**
(je Stück eine kleine Tabelle), kein Code-Sonderfall. Der Bogen-Zustand lebt
in einem eigenen localStorage-Schlüssel (`brauhaus:bogen`), getrennt vom
Partien-Spielstand; `?neu=1` räumt beides. **Abnahme:** Startlagen mit
Erbstücken bleiben innerhalb der ρ-Latte (Messlauf je Übergang mit maximal
bestücktem Erbe), und ein Bogen ohne Erbstücke ist ziffernweise das heutige
Szenario.

---

## 4 · Die Wirtschafts-Heilung im Detail (F3)

Der teuerste und wichtigste Posten. Reihenfolge und Maße (Belege:
`analyse/berichte/05-befunde-offen.md`, `BEFUND-WIRTSCHAFT.md`):

1. **Erst messen, dann bauen** (die zwei offenen Messfragen des
   EPOCHENBOGEN): **(A)** Wie lange trägt eine gut geführte Partie je Epoche
   wirklich? **(F)** Warum werden Festlegungen in 14 Jahren nur 0–1× genommen?
   Datenbasis liegt bereit (`werkbank/urteile/e1–e4.json`, 400-Wochen-Leitern).
2. **1350 und 1970 nach dem Muster von 1600** (der einzigen Epoche, die
   „Sorgfalt belohnt und Erfolg bestraft"): Preisanker an die gespielte
   Leistung koppeln, nicht an Fahrt und Kalender.
3. **Zweiter Geldweg je Epoche**, epochengerecht benannt (z. B. 1350
   Lohnbrauen für einen Hof; 1600 Vorverkauf unter Siegel; 1884
   Liefervertrag/Flaschenpfand; 1970 Lizenz/Festlieferung) — als Verben mit
   Preisschild, die A11 gleich mitbezahlen.
4. **Festlegungen erreichbar machen** (Leiter-Auflagen 8/9 aus Welle 7: obere
   Leiterhälfte 1350, tote Sprossen 1600/1970).
5. **Ruin statt Einfrieren:** unter einem Kassenboden über mehrere Wochen
   endet die Partie mit eigenem Text und Ausgang.

**Schutzprotokoll je Eingriff (nicht verhandelbar):** eingefrorener Messstand
→ ρ vorher/nachher, alle drei Schnitte, **1600 zuerst** → sequenziell unter
Messfenster-Sperre → Lesart vor der Messung festgeschrieben → nie zwei
Stücke derselben Kennzahl gleichzeitig → §4-Abgabendeckel und §17/§18 der
`ZUSTAENDIGKEIT.md` als Prüfpunkte. Ziel-Schwellen der Heilung stehen im
Plan als Abnahmeformeln (W14/W15).

---

## 5 · Was ausdrücklich bleibt wie es ist

Der Kern (Bus, Uhr, Würfel, Rundenschluss, Flächenhaushalt) und seine
Doktrin; das Datei-Eigentum je Stück; die eingefrorene `spiel/index.html`
(Startseite entsteht daneben); die vier Messlatten samt Sperrliste (Latte 3
in F4-Fassung); das Braujahr Michaeli–Georgi; die illustrierten Platten und
der eine Ort über 620 Jahre; die deutsche Sprache als Vertragsbestandteil;
`werkbank/`-Verfahren und -Geräte (sie werden Betriebsmittel des neuen Loops,
nur agentenloser betrieben).
