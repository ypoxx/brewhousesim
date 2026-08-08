# Konsolidierter Befundstand „Brauhaus-Imperium" — Stand 8.8.2026, nach Abgabe aller vier Welle-13-Builder

*Alle Pfade relativ zur Wurzel `«sim-branch»/`. Hauptquellen: `werkbank/LAUFENDER-AUFTRAG.md` (2537 Z.), `werkbank/urteile/welle12-spielprobe.md` (581 Z., A1–A13), `gauntlet/WELLE-13.md` (R1–R16 + 3 Entscheidungen), die vier `werkbank/urteile/welle13-*-bau.md`, `werkbank/urteile/welle9-bildvergleich.md` (17 Auflagen), `spiel/BEFUND-*.md`, `werkbank/stand.json`.*

---

## 1 · AUFLAGENREGISTER

**Statusskala:** offen · **W13-gebaut** (= in Welle 13 gebaut, Abnahme durch Aufsicht + blinde Kritiker steht aus) · erledigt · zurückgestellt · widerlegt · unklar.

### 1a · Die 13 Auflagen der Spielprobe (Welle 12) — `werkbank/urteile/welle12-spielprobe.md` §9

| ID | Beschreibung | Stand | Beleg |
|---|---|---|---|
| **A1** | Spielstand speichern/fortsetzen (`localStorage`-Schlüssel `brauhaus:<epoche>:<saat>`, Knopf „Neue Partie" mit Rückfrage) | **W13-gebaut** (R1/R2, DER RAHMEN): 15/15 Felder nach Neuladen in 4 Epochen ziffernweise gleich; `?neu=1` hält Messungen frei. **Restloch offen:** Eigenzustand `Z` der acht Stücke wird nicht mitgesichert — nur DER GEGNER hat `B.stand.melde('gegner',…)` nachgerüstet; fuhre (u. a. **Übergabefrist**!), preis, sud, erbe, name, stadt fehlen | `welle13-der-rahmen-bau.md` R1 + „Was offen bleibt" #1 (`gegner.js:517/:567`); `welle13-der-gegenzug-bau.md` §3 |
| **A2** | Zielsatz von Woche 1 an sichtbar („was ist das gute Ende, wie weit bin ich") | **W13-gebaut** (R3 Rahmen: `meldeZiel(satz,naehe)`, Zielzeile; R11 WOCHE: `fuhre.js:2760` liefert Satz + Nähe; R4: Startanschlag mit ZIEL/Gewinnen/Überleben). Zielworte auf erstem Schirm: 0 → 2–5/1/1 je Epoche | `welle13-der-rahmen-bau.md` R3/R4; `welle13-die-woche-bau.md` §2 |
| **A3** | Reiter „DIE ÜBERGABE VOR DEM RAT" darf sich nicht verstecken (15/284 Wochen da, 0× bemerkt) | **W13-gebaut** (R12, WOCHE): 4 Orte (Wochenkarten-Chip, Georgi-Blatt, `data-reiter` mit Frist, Zielsatz); Abnahmemessung ohne Reiterklick: sichtbar 12–13 von 13 Wochen (1350), 9/9 (1600) | `welle13-die-woche-bau.md` R12 |
| **A4** | Knopf `preis:tafel` lügt („Michaelitafel schließen" ohne liegende Tafel) | **W13-gebaut** (R6, JAHRESTAFEL): 33 Lügen/308 → **0/1512** abgelesene Zustände; 420-ms-Frist `preis.js:2737` ersatzlos entfernt. Von der Aufsicht vorab bestätigt (100/100 „schließen", 97 ohne Tafel) | `welle13-die-jahrestafel-bau.md` §1/§7; `LAUFENDER-AUFTRAG.md:154` |
| **A5** | Michaelitafel muss zu Michaeli von selbst aufliegen („0 von 10 Jahren") | **Teilweise WIDERLEGT + Rest W13-gebaut.** Gegenmessung der Aufsicht (`aufsicht/welle13-gegen/BEFUND-VORHER.md`): Tafel lag am Vorzustand an **3/3 Jahreswechseln** von selbst und blieb liegen; die „0 von 10" stammt aus der Reitersuche der Kritikerhand. Wirklich fehlend: **Spielanfang** (0/30 Wochen des Ladejahres) und **nur 1 statt 5 Angebote** am Jahreswechsel. R7 gebaut: 10 von 11 Michaelitagen von selbst liegend, Ladetag über „erste Handlung holt die Tafel" (auch erster WEITER-Druck, einmal je Braujahr) | `LAUFENDER-AUFTRAG.md:134–169`; `gauntlet/WELLE-13.md` R7-Berichtigung; `welle13-die-jahrestafel-bau.md` §2/§7 |
| **A6** | Reiter unter liegendem Blatt tot (4 Klicks, Züge 25→26→26→26→26) | Bestätigt (Aufsicht, ziffernweise); **W13-gebaut**: R10 (JAHRESTAFEL, 16/16 Blatt weg, Züge +15…+31) + R14 (WOCHE, Georgi-/Übergabeblatt; Schlussblatt bleibt bewusst liegen). Entscheidung ③: Schließen statt Reiter-Abschalten | `welle13-die-jahrestafel-bau.md` §3/§7; `welle13-die-woche-bau.md` §2 |
| **A7** | „Die Woche braucht mehr als zwei Knöpfe, oder sie braucht keine Woche" (71 % auf 2 Knöpfe; `springe()` von niemandem gerufen) | **W13-gebaut, TEILBESTANDEN** (R13, WOCHE): Wochenkarte mit bis zu 4 sich ausschließenden Fuhrplänen + Sprung; häufigster Knopf ≤ 35 %: **3 von 4** (1350 32,5 / **1600 36,8 ✗** / 1884 26,8 / 1970 17,0); drei häufigste ≤ 60 %: **2 von 4** (**1350 82,5 ✗ · 1600 72,8 ✗** / 1884 56,7 / 1970 43,7). **Offene Schwelle liegt bei der Aufsicht** — Begründung des Builders: in 1350 stehen in 3/100 Wochen ≥3 Ladungen zur Wahl, „die Latte misst die Fässer, nicht die Knöpfe" | `welle13-die-woche-bau.md` §3/§6; `LAUFENDER-AUFTRAG.md:216–235` |
| **A8** | Zähler „OHNE DICH GESCHEHEN" wandert ab Jahr 2 vom Reiter | **W13-gebaut** (R16, GEGENZUG): Ursache `stil/stadt.css:349` (`.schmal … .zahl {display:none}`), Abhilfe via `data-reiter` (gelesen von `stadt.js:611`); 50/50 Wochen mit Zahl in allen 4 Epochen; Geometrie: 0/48 Abweichungen außer eigener Reiterbreite | `welle13-der-gegenzug-bau.md` §2 |
| **A9** | Spieler muss sich Gegenzug leisten können (457 Gegnerzüge : 5 eigene) | **W13-gebaut** (R15, GEGENZUG): dritter Knopf `gegner:zukaufen:*` (zweite Währung, 12 Pf/29 fl/192 M/780 DM); Wochen ohne bezahlbaren Gegenzug (enge Lesart) 55/60/0/19 → **9/0/0/1** (Latte ≤ 10); ρ-Aufzeichnung byteweise unverändert (8×400 Wochen, gleiche SHA-256). Gegner nicht abräumbar (wächst trotz 31 Kontern von 3 auf 5 Adressen). Rest-9-Wochen 1350 = Kasse 3–11 Pf, Arithmetik, gehört zu A10 | `welle13-der-gegenzug-bau.md` §1/§4.2/§4.3 |
| **A10** | „Wenn nichts bezahlbar ist, muss das Spiel einen Weg zeigen" | **W13-gebaut, strukturell nur halb**: R8 (JAHRESTAFEL) nennt den Geldzug bzw. sagt ehrlich „HEUTE BRINGT KEIN KNOPF GELD". **Befund dahinter offen:** im ganzen Spiel trägt **genau ein** Knopf ein positives Preisschild (`fuhre:rueckkauf:rohstoff`), in 1884/1970 beim Laden abgeschaltet. Das Geldproblem selbst (Deckung in 742/1030 Wochen < 1×) ist **nicht angefasst** — bewusst, wegen 1600 ρ +0,538 | `welle13-die-jahrestafel-bau.md` §4/§8; `welle12-spielprobe.md` §2 |
| **A11** | Verbliste je Epoche (37 von 43–46 Verben viermal gleich, Jaccard 0,70–0,81; verlangt ≥3 eigene Verben je Epoche, Jaccard < 0,6) | **ZURÜCKGESTELLT** (eigene Welle; Arbeit für DEN SUD und DIE STADT) | `gauntlet/WELLE-13.md` „Was diese Welle NICHT anfasst"; `LAUFENDER-AUFTRAG.md:282` |
| **A12** | Epochenversprechen nie eingelöst (6 h bis Epochenende, 24 h bis 2025; vier `?epoche=`-Eingänge statt Strecke) | **ZURÜCKGESTELLT** (Entscheidung ①: eigene Welle, sobald Spielstand steht). Der „ehrliche" Zweig von A12 ist gebaut: R4-Startanschlag sagt „JEDE EPOCHE IST EIN EIGENES SZENARIO" | `gauntlet/WELLE-13.md` Entscheidung ①; `welle13-der-rahmen-bau.md` R4 |
| **A13** | Textüberläufe/Wortbrüche auf der Michaelitafel bei 1600×900 („Nehme n −110 P f") | **W13-gebaut** (R9, JAHRESTAFEL, mit Rollleiste, 2 Fenster, arme-Michaeli-Durchgang): Wortbrüche 51 → **0**, abgeschnittene Kästen 0. **Neuer Nebenbefund:** `lesbarkeit.mjs` bei 1366×768 zählt 17 Überläufe, davon **4 aus `zielzeile:`** (neues RAHMEN-Element) — niemandem als Auflage zugewiesen | `welle13-die-jahrestafel-bau.md` §5/§7 |

### 1b · Auflagen des Bildvergleichs Welle 9 (17 Stück, `werkbank/urteile/welle9-bildvergleich.md` §5) — Latte 1 steht bei „Zielbild gewinnt 3:0 bei 1 Unentschieden"

Kein späteres Urteil hat die 17 einzeln quittiert; belegter Stand:

| ID | Kurzform | Stand |
|---|---|---|
| B1–B5 | Hoftorschild 1350 frei · „ST. MICHAEL" 1884 · Gegnerkarte schneidet „GASTHOF LINDENHOF" · **Darre+Rauch 1600** · Braupfanne 1350 | **offen/unbelegt** — keine dokumentierte Einzelabnahme; B4 vom Kritiker als einziges echtes Weltdefizit benannt („vier Tapeten in Bildpunkten") |
| B6 | Fernschreiber-Bänder aus unterstem Sechstel (< 6 %) | teilerledigt über Welle 10/11 (unterstes ⅙ 6,5–7,1 % im Ladezustand nach W10) — 6-%-Abnahme knapp verfehlt, nicht neu gemessen |
| B7–B11 | leere Rechtecke 1970 · Kasten über Bildrand · gekürzte Kaufknöpfe · Preis/Währung getrennt · Sud-Tabelle | Welle 10 misst „kein Kasten über Rand, kein fehlendes Zeichen, Währungsbruch 1→0" → **B7/B8/B10 erledigt**; B9/B11 unbelegt |
| B12 | Reiterzeile begrenzen | unklar; GEGENZUG-Messung zeigt Reiterzeile stabil in 48 Lagen, aber keine Abnahme gegen „einzeilig, <50 % Breite" |
| B13, B14, B17 | Ortsmarken-Scheiben · Leuchtschrift 1970 · Bauten verdecken einander | **offen/unbelegt** |
| **B15** | Deckung Ladezustand **< 8 %** gesamt, < 25 % oberstes ⅙ | **OFFEN, gerissen:** aktueller Stand 11,0–11,8 % (`werkbank/stand.json` „Deckung im Ladezustand"); nach W10 oberstes ⅙ 35,6–37,7 %. Zusatzbefund `LAUFENDER-AUFTRAG.md:752–760`: von einem Stück allein nicht erreichbar (Kopfleiste Skelett 26 %, Chronikgriff PREIS 11,7 %) — Aufgabe des Skeletts |
| **B16** | Nach 30 Wochen + 1 Escape keine Tafel > 200 000 px², gesamt < 12 % | **OFFEN:** ohne Escape 13,9–15,0 % (knapp über 12), **nach einem Escape 41,6–44,3 %** (`stand.json`) — Escape **öffnet** `erb-buch` (Berichtigung Welle 10: „Escape tauscht nicht, Escape öffnet", von der Aufsicht nicht nachgemessen); `erb-buch` hat keinen eigenen Schließknopf (0 Elemente mit `data-zug`) |

### 1c · Sonstige offene Befunde/Auflagen (Kern, Latten, Geräte, Auftraggeber)

| ID/Ort | Beschreibung | Stand |
|---|---|---|
| **Latte 4** (Lesbarkeit 1366×768) | Ziel: 0 Schrift < 12 px, 0 Knöpfe < 24 px, 0 Abschnitte. Stand: **257 Textknoten < 12 px, 9 abgeschnittene Kästen, 0/292 Knöpfe** (`stand.json`) — von 1.899 gefallen, aber **weiter gerissen**; Schriftregeln erledigt nur bei FUHRE, SUD, PREIS, STADT; **GEGNER, NAME, ERBE offen** | offen |
| KERN `stil/grund.css:294` | `.knopf .preis` ohne Boden, 9,9 px bei 1366×768; Fix bewegt drei fremde Bretter | offen (seit Welle 7, „zwischen zwei Wellen mit Messung") |
| KERN: 37 Reiter-Kästen | 10 Reiter auf 1.093 px brauchen ~2.300 px — Arithmetik, berührt mehrere Stücke | offen (Welle 7) |
| KERN: `data-soll-aus` | `disabled` misst „Spiel sagt nein" und „verdeckt" in einer Zahl; Attribut existiert nur bei SUD; jede „aktive Züge"-Zahl des Laufs ist Untergrenze | offen (`LAUFENDER-AUFTRAG.md:1744–1780`) |
| KERN `welt.js` `zugDeckung()` | soll `null` statt Rückfall liefern (18/4800 Wochen betroffen); Welle-4-Vorschlag | unklar, keine dokumentierte Einarbeitung |
| Welle-7-PREIS-Auflagen 8/9 | obere Leiterhälfte 1350 nie bezahlbar; tote Leitersprosse 1600 (14× hart bestätigt) und 1970 | offen (bewusst in eigene Runde verschoben, nie gefahren); Auflage 10 (`festGesetzt`=0) **teilwiderlegt** (Welle 8: 1600=1, 1970=3; Spielprobe traf 0/1/1/0) |
| `preis.js:1525` | Zähler „Chronik des Hauses · N Festlegungen" zählt falsche Quelle | unklar (benannt in `spiel/STAND.md` §4, keine dokumentierte Behebung) |
| `werkbank/hoerer.py:181` | „keine Audiodatei übertragen" + `sicher:0` wird als DURCHGEFALLEN gewertet statt „keine Messung" | offen mit Absicht (nicht reparieren, solange ein Kritiker misst) |
| **Latte 3 an den Auftraggeber** | Gegenzug hörbar: 0/4 in sechs Ständen; 1884 mit diesem Ohr nicht messbar (bejaht 2/4 Blender); Vorgangsfrage braucht Mehrheitsregel (17 % vs 33 % am selben Ton) | **offen, Entscheidung des Auftraggebers** (`LAUFENDER-AUFTRAG.md:1784–1823`); KLANG-Auflage 4 ungelöst |
| Latte 1 | Kein Blindbildvergleich seit Welle 9 (Stand `37f4b44`) — nach zwei großen Flächenwellen (10/11) nie neu geurteilt | offen |
| PR zum Basiszweig | „no history in common" — nur mit `--allow-unrelated-histories`/Rebase reparierbar, nicht Entscheidung der Aufsicht | offen, beim Auftraggeber gemeldet |
| RAHMEN offen #2 | Alle Messgeräte laden ohne `?neu=1` (`rueckkopplung-r3/linie.mjs:66`, `spiel-w12/hand3.mjs`, `gegnerblick.mjs`, `messfenster.sh`, `schuss.mjs`) — nur der frische Playwright-Kontext schützt | offen |
| RAHMEN offen #3 | `kern/haushalt.js:186` (`RASTER=4`) misst bei kleinen Fenstern die Rasterweite mit (84.541 vs. 78.336 px für dieselben 9 Kästen) — Haushaltabnahme nur auf 2752×1536 | offen |
| WOCHE-Meldung 1 | Vier FUHRE-Bretter liegen beim Laden als Reiter → gleiche Unbedienbarkeit gilt **unverändert für SUD, NAME, ERBE** | offen (STADT in W13 zu) |
| WOCHE-Meldung 2 | `B.uhr.springe()` lässt den Wagen stehen: 1 gesprungenes Braujahr kostet 1350 eine Adresse, Keller 4→0, Rohstoff 40→7 | dokumentierte Eigenschaft, kein Fix geplant |
| GEGENZUG §3-Warnung | E3-Wiederkehr zeigte zweimal reproduzierbar Abweichungen (kasse/protokoll/letztesBuch, +18–20 Bucheinträge), dann weg; Verdacht: doppelt gebuchte Lieferung beim Fortsetzen | offen als Warnzettel |
| JAHRESTAFEL §8 | Tafel am Ladetag ganz ohne Klick = Änderung an `stadt.js` (Kalenderblatt ≠ Ladeblatt) — Entscheidung der Aufsicht | offen/vertagt |
| Wirtschaft strukturell | „Kosten hängen an Fahrt und Kalender, Ertrag an der Ladung" (`spiel/BEFUND-WIRTSCHAFT.md` §5, drei Ansätze); 1884-Fixkosten 8.205 M; FUHRE-These „Knappheit ohne Geld" in E1–E3 widerlegt (`spiel/FUHRE-STAND.md` §3) | strukturell offen — W13 hat bewusst **keine Wirtschaftszahl** angefasst |
| 1600 | ρ +0,538, Reserve 0,162 zur 0,700-Latte — „die Zahl, die diese Welle am ehesten zerbricht" | Risikoposten, Messung Schritt 3 der Abnahme |

---

## 2 · WELLE-13-STAND

**Brief:** `gauntlet/WELLE-13.md` — 4 Stücke, R1–R16, 3 Entscheidungen der Aufsicht (① kein Epochenwechsel, ② Spielstand darf Wiederholbarkeit nicht anfassen → `?neu=1` Teil der Abnahme, ③ Blatt schließt sich bei fremdem Reiterklick). Alle vier Builder haben abgegeben (09:0x–11:0x UTC).

**DER RAHMEN** (Hafen 8921, `kern/**` + 1 Zeile `index.html:85`): `kern/stand.js` neu (454 Z.), Sicherung synchron je Wochenwechsel inkl. Würfelzählerstand, Zwei-Zug-Einsetzen; `?neu=1`/`aufnahme`-Modi (3 Läufe = 1 Prüfsumme je Epoche, Speicher leer); `meldeZiel(satz,naehe)` + Zielzeile; Startanschlag R4 (0 px Flächenkosten, `pointer-events:none`, verdeckt 0 Züge); **`B.uhr.springe()` war kaputt** (übersprungene Wochen fanden nicht statt) — neu gebaut, Sprung == Klicken in 11/11 Feldern. Offen gemeldet: Stück-Eigenzustände, `?neu=1` in Messgeräten, Haushalts-Raster, Epochenwechsel.

**DIE JAHRESTAFEL** (8922, `preis*`): R6 Lügenknopf 0/1512; Ursachenkette dokumentiert (**`tafelWeggeklappt()` fragte nach einem Element, das `B.leere(fach)` eine Zeile vorher entfernt hatte**; 420-ms-Frist feuerte nie und ist entfernt — das Spiel hat nur noch eine gefangene Frist, `name.js:2272`); R7 10/11 Michaelitage von selbst; R10 16/16; R9 51→0 Wortbrüche; R8 Geldweg-Sätze; Wiederholbarkeit 3 Läufe/1 Prüfsumme je Epoche; keine Wirtschaftszahl angefasst.

**DIE WOCHE** (8923, `fuhre*`): Vorbefund — **Woche ohne Reiterklick gar nicht spielbar** (94,3 % der Klicks WEITER, `fuhre:abschicken` 100× abgeschaltet; die 71 % waren Untergrenze). Wochenkarte (3,21 % der Bühne, kein Kasten) mit bis zu 4 Fuhrplänen + Sprung; R11 Zielsatz; R12 Übergabe an 4 Orten; R14 Horcher. R13: 3/4 bzw. 2/4 (s. A7) — **eine Schwelle zurück an die Aufsicht**. Wochen mit ≥2 einander ausschließenden Preisoptionen außerhalb der Michaelitafel: 0 → **70/92/81/56 von 100**. ρ 1600 mit `linie.mjs` nachgemessen: **+0,538 ziffernweise unverändert**.

**DER GEGENZUG** (8924, `gegner*`): R15 9/0/0/1 (eng; Isolation über zwei `git archive 1bb28ce`-Bäume, Differenz = exakt seine zwei Dateien); bewusst **kein** `data-preis="0"` am Fassknopf („hätte die Messung bewegt, nicht das Spiel"); ρ-Aufzeichnung **byteweise gleich** in allen 4 Epochen (8×400 Wochen, gleiche SHA-256); R16 50/50; Griff-Ausweiche für verdeckten Bahnhofswirt-Knopf; Spielstand-Anmeldung des Gegners nachgerüstet (`abweichung []` in 4 Epochen); Lehrstück „Ein Hafen ist kein Baum" (falscher Messhafen → 48/48 Scheinabweichungen).

**Abnahme der Aufsicht (läuft):** eingefrorener Stand **`b098fc6` auf Hafen 8933** (nach Resets Nr. 22/23 zweimal neu eingefroren, `spiel/` byteweise gleich, nichts verloren). Erste Zahl: **1350 wiederholbar — 6 Läufe à 400 Wochen, eine Prüfsumme `bb96459e6ac5`**, 272 s/Lauf; 14 Braujahre, Kasse 34–524, Kennzahl roh 1,09–7,43× (**kein Jahr < 1×**), 1 unwiderrufliche Festlegung, 0 Seitenfehler. 1600/1884/1970 laufen.

**„7/15 bestanden":** Das ist **nicht** die Welle-13-Abnahme, sondern der langlaufende Stück-Zähler der Fortschrittsseite (`werkbank/stand.json` → `stuecke`, 15 Einträge), der automatisch an jede Commit-Botschaft gehängt wird. Die 15: Skelett ✅ · DIE STADT (Platzordnung) ↩ zurück · DIE FUHRE (Woche/Knappheit) ✅ · DER PREIS (Michaeli) ✅ · DER GEGNER ↩ · DER KLANG ✅ · DER NAME (Welle 3) ⏳ läuft · DER NAME (früher) ✅ · DIE FUHRE ⏳ · DER SUD ⏳ · DIE EICHUNG ↩ · DER SUD (Bier) ↩ · DIE RÜCKKOPPLUNG ✅ · DER PREIS (2. Eintrag) ✅ · DIE LESBARKEIT ↩. Also: 7 bestanden, 5 zurück, 3 laufend.

**Ausstehende Abnahmeschritte** (`LAUFENDER-AUFTRAG.md:237–265`): (2) Wiederholbarkeit 1600/1884/1970 je 3 Läufe [läuft] → (3) Latte 2 `auswerten.py`, |ρ|<0,700, **1600 zuerst** → (4) Gegenmessung `probe13.mjs` nachher-eN gegen `BEFUND-VORHER.md`, dazu `wiederkehr.mjs` + `hand3.mjs`/`zaehle.mjs` unverändert → (5) **vier blinde Kritiker** K1–K4 nach `gauntlet/WELLE-13-KRITIK.md` (Spielstand · erster Schirm · Tafel/tote Reiter · Woche/Gegenzug, inkl. „Bleibt der Gegner ein Gegner?") → (6) R13-Schwelle entscheiden + Messfrage: hält die Wiederholbarkeit **auch ohne** die Vorziehregel des Rundenschlusses?

---

## 3 · ZURÜCKGESTELLT (explizit vertagt, mit Begründung)

1. **A11 Verblisten** — eigene Welle; „macht das Spiel reicher, nicht spielbar"; gehört SUD/STADT (`gauntlet/WELLE-13.md`).
2. **A12 Epochenwechsel** — Entscheidung ①; eigene Welle, sobald der Spielstand steht; Startschirm deklariert die Szenarien ehrlich.
3. **Fünf Stücke zu:** DIE STADT, DAS ERBE, DER NAME, DER SUD, DER KLANG — „vier gleichzeitige Schreiber sind das Maß, das getragen hat" (`LAUFENDER-AUFTRAG.md:284`).
4. **Eigenzustand der Stücke im Spielstand** — „gehört in die Nacharbeit dieser Welle oder in die nächste" (`welle13-der-rahmen-bau.md`); nur GEGNER erledigt.
5. **Welle-7-Auflagen 8/9/10** — bewusst in eigene, nie gefahrene Runde verschoben („Veto muss messbar folgenlos behoben werden; 40 Karten in 3 Epochen zugleich machen das unmöglich"); alle drei bewegen ρ.
6. **`hoerer.py:181`** — nicht reparieren, solange ein Kritiker am Gerät misst.
7. **Latte-3-Umbau (Gegenzug hörbar/1884/Mehrheitsregel)** — Entscheidung des Auftraggebers, nicht eines Builders.
8. **Tafel am Ladetag ganz ohne Klick** — wäre STADT-Änderung; W13 öffnet die STADT nicht (`welle13-die-jahrestafel-bau.md` §8).
9. **R13-Restlatte 1350/1600** — nur über Sudmenge/Wagengröße/Fassplätze erreichbar; Entscheidung der Aufsicht, erst nach eigener Messung und nach GEGENZUG-Abgabe.
10. **Vorziehregel-Frage (Welle-12-Begründung)** — Messung erst nach Abschluss der W13-Abnahme; „eine Regel, die trägt, wird nicht auf einen unbelegten Verdacht hin entfernt."
11. **PR-Reparatur** (unrelated histories) — beim Auftraggeber, unangetastet.

**Zwei vom Aufgabensteller genannte Kandidaten sind KEINE offenen Rückstellungen mehr:** (a) **„DIE VERWERTUNG wird nicht erreicht"** (`spiel/BEFUND-ENDE.md` Nachtrag) wurde in **Welle 3** weitgehend geschlossen — Tiefststand nur-WEITER: 1350 **−1 Pf/1 Woche** (statt −14/44 Wochen), 1600 +112, 1884 +7.041, 1970 +25.197; Rest: 1350 berührt eine Woche die −1 (`LAUFENDER-AUFTRAG.md:2174–2177`). (b) **„Schlussblatt zugeklappt bei 1920×1000"** (Welle-2b-Befund) wurde in **Welle 3** behoben und von der Aufsicht nachgemessen: Urteil in allen 4 Epochen sichtbar, 1075×746–800 px, `elementFromPoint` trifft es; vier Epochen, vier verschiedene Ausgänge (`braurecht-entzogen`/`reihe-gestrichen`/`bank-verwertet`/`brauereisterben`). Die Spielprobe bestätigt beides implizit (das Ende ist „das beste Blatt des Spiels").

---

## 4 · WIDERSPRÜCHE — was jeweils gilt

| Widerspruch | Auflösung / was gilt |
|---|---|
| `spiel/STAND.md` + `spiel/STAND-WELLE-1.md` (2.8./1.8.) vs. heutiger Stand | Beide tragen seit 7.8. Warnkästen: **alte Schnappschüsse**, fast jede Zahl überholt (teils im Vorzeichen). Es gilt `werkbank/LAUFENDER-AUFTRAG.md`. Bewusst nicht gelöscht (Beweissicherung). |
| A5: Spielprobe „Tafel lag 0 von 10 Jahren von selbst" vs. Aufsicht „3 von 3 Jahreswechseln liegend" | **Aufsicht gilt** (Zeitreihe 12 Ablesungen 60–8000 ms, zwölfmal liegend; Kritikerprotokoll trägt `michaeli-fehlt` nach eigener Reitersuche). Realer Kern: Ladetag + Angebotszahl (1 statt 5). Vom JAHRESTAFEL-Builder unabhängig bestätigt. Wellenbrief R7 vor jeder Messung berichtigt. |
| Spielprobe „einmal im Jahr fünf Angebote, keines bezahlbar" vs. Gegenmessung „am Jahreswechsel liegt **eines**" | Gegenmessung gilt für das, was **von selbst** liegt; die fünf sah nur, wer in Woche 2 selbst aufschlug. Nach R7: fünf Karten, **eine** bedienbar (Kasse 48 Pf). |
| 71 % Zwei-Knöpfe-Anteil (Spielprobe) vs. 94,3 % WEITER (WOCHE-Vorbefund) | Kein Widerspruch, zwei Hände: 71 % **mit** Reitersuche (1.089/1.062/709 Suchklicks), 94 % ohne. Die 71 % waren eine **Untergrenze**; ohne Reiterklick war die Woche gar nicht spielbar. |
| Welle-12-Begründung „420-ms-Frist `preis.js:2737` ist **der** Verursacher der Bistabilität" (`spiel/LIESMICH.md`) vs. JAHRESTAFEL „die Frist hat nie gefeuert; wahre Ursache: Abfrage nach gelöschtem Element" | **Ungeklärt, beides kann zugleich wahr sein** (die Vorziehregel von `kern/runde.js` ließe eine vorher stets gelöschte Frist erstmals feuern). Satz in LIESMICH bleibt stehen; Entscheidung per Messung „Wiederholbarkeit ohne Vorziehregel" (Abnahmeschritt 6). |
| R15-Baseline: Aufsicht **68**/100 (Stand `7e21973`) vs. GEGENZUG **55**/100 (Stand `1bb28ce`) | Zwei verschiedene eingefrorene Vorzustände, andere Partie, gleiche Rechnung; „beide liegen weit über 10, beide gehören zum Vorzustand" — gemessen wird paarweise (55→9, 19→1). |
| R15-Lesart: „weit" wäre heute schon erfüllt (0/100) | **Enge Lesart gilt** — Regel: „Kann man eine Abnahme bestehen, indem man nichts tut?" (`LAUFENDER-AUFTRAG.md:163–166`). |
| BEFUND-ENDE (a) ursprünglich „es gibt kein Schlussbild" | **Berichtigt im Dokument selbst:** Schlussblatt existierte, lag `stadt-zugeklappt` unter dem Sudbuch; Behebung Welle 3 (s. o.). |
| Welle-9-Kritiker „Escape **tauscht** Tafeln" vs. Welle-10-Builder „Escape **öffnet** `erb-buch`" | Builder-Fassung mit `rahmen-w10/sonde.mjs` belegt, von der Aufsicht **nicht nachgemessen** — als Berichtigung mit Vorbehalt geführt. |
| WELLE-13 weiche Abnahme „`haushalt.pruefe()` ohne Beanstandung" (Stand Welle 12) vs. WOCHE: „sechs von sieben Stücken über Budget" am laufenden Baum (`stadt 247.002/40.000` …) | Momentaufnahme des gemeinsamen Baums während vier gleichzeitiger Builder + von-selbst-liegender R7-Tafel; **muss die Abnahme am eingefrorenen Stand klären**. Zudem: Haushaltszahlen sind nur auf 2752×1536 vergleichbar (Raster-Befund des RAHMENS). |
| Prüfsummen 1350: Welle 12 `3e87b7a47385` vs. W13-Abnahme `bb96459e6ac5` | Kein Widerspruch: `linie.mjs` schreibt Knopftexte mit — Prüfsummen sind **zwischen Ständen prinzipiell unvergleichbar** („wer sie über Fassungsgrenzen zählt, zählt Bau und Partie in einer Zahl", `LAUFENDER-AUFTRAG.md:405–423`). |
| Alte ρ-Zahlen (BEFUND-WIRTSCHAFT ±0,714/0,829; Welle 5 +0,591; FUHRE-STAND „Latte 2 bestanden") | Alle überholt bzw. auf kaputten Geräten/Nullkasse gemessen. **Gültig ist Welle 12** (−0,259/−0,236/−0,389 · +0,406/+0,489/+0,538 · +0,161/+0,330/+0,169 · −0,112/−0,236/−0,304; Jahre <1×: 0/1/0/1). `welle.sh`-Nebeneinander-Zahlen (Wellen 4/5) sind nicht als reproduziert zitierbar. |
| Zielbild-HUD-Zahlen vs. `kern/welt.js:140` | Stimmen nur bei 2 von 4 (1350, 1884). Zielbilder sind **Anschauung, keine Spezifikation**. |
| „0 unerreichbare Züge von 80/90/93/84" | Von der Aufsicht selbst eingeschränkt: Nenner zu klein (`erreichbar.mjs` schlug nur `stadt:reiter:*` auf); `stand.json` führt den Zähler als „zu schmal". |

---

## 5 · SPIELKRITIK-KERN — und was Welle 13 davon trägt

**Der Satz:** *„Dieses Spiel wird an seinem Ende gut, und man kommt zu selten dorthin. Die zwanzig Minuten dazwischen verkaufen es nicht."* Präzisierung des Kritikers: *„Das ist kein langweiliges Spiel — es ist ein **interessantes Spiel, das man nicht spielen darf**, weil das Geld fehlt."* Vier Kernbefunde: (1) Was tun? — nach 2 Min. klar (die Zeile „nächster Zug: … (Kasse reicht 5,9×)" = beste Zeile des Spiels). (2) Was ist Gewinnen? — nach 20 Min. unklar, 0 Zielworte auf 613 Zeilen. (3) Unterbrechen? — nein, F5 löscht alles. (4) Weiterspielen-Wollen: ja Minute 1, **nein Minuten 4–20**, ja sofort am Ende („Der Rat entzieht das Braurecht · 1353" — er wollte sofort neu anfangen und die Wirte halten).

**Durch Welle 13 adressiert (gebaut, nicht abgenommen):**
- (3) vollständig: Spielstand + „fortgesetzt · JJJJ/WW" + „Neue Partie" (R1/R2).
- (2) direkt: Startanschlag mit Ziel/Gewinnen/Überleben + Zielzeile mit Nähe-% in jeder Woche (R3/R4/R11).
- „Man kommt zu selten dorthin": Übergabe an vier Orten sichtbar statt 15/284 Wochen unbemerkt (R12); das gute Ende ist erstmals ohne Reiterklick auffindbar (13 von 13 bzw. 12/13 Wochen sichtbar).
- Minuten 4–20 mechanisch: Fuhrpläne + Sprung senken den häufigsten Knopf von 71–94 % auf 17–37 %; erstmals stehen in 56–92 von 100 Wochen sich ausschließende Preisoptionen **in der Woche selbst** (vorher: 0, alles lag auf der Jahrestafel); tote Reiter und der lügende Knopf sind weg; Gegenzug in ≤ 9 von 100 Wochen unbezahlbar statt 55–68.

**Strukturell offen:**
1. **Das Geld-Problem selbst.** W13 hat per Auftrag keine Wirtschaftszahl bewegt (GEGENZUG: byteweise identische ρ-Aufzeichnung; JAHRESTAFEL: „keine Preissenkung"). Deckung im Median 0,08×–0,62×, 742/1030 Wochen < 1×, Festlegungen in 1350/1970 nie bezahlbar („Vitrine"), genau **ein** geldbringender Knopf im ganzen Spiel — der Befund „interessantes Spiel, das man nicht spielen darf" ist gemildert (billige Gegenzüge, Geldweg-Sätze), aber nicht behoben. Dahinter der alte Strukturbefund aus `spiel/BEFUND-WIRTSCHAFT.md`: keine Rückkopplung vom Ergebnis auf die Schwierigkeit; nur 1600 „belohnt Sorgfalt und bestraft Erfolg". Und jede Korrektur kollidiert mit 1600 ρ +0,538 (Reserve 0,162).
2. **Knappheit als Latten-Grenze:** R13-Rest (1350/1600) misst laut Builder Fässer statt Knöpfe — lösbar nur über Sudmenge/Wagengröße/Fassplätze, also über die Wirtschaft.
3. **A12/A11:** Epochenbogen (620 Jahre als Spiel statt als Bild) und epocheneigene Verben — die „vier Tapeten"-Hälfte des Urteils — bewusst auf spätere Wellen.
4. **„Handlungsunfähig, aber nicht tot":** Kasse klebt bei 0, nichts endet, kein eigener Text (Spielprobe §7) — von keiner R-Auflage adressiert.
5. **Ob die 20 Minuten jetzt „verkaufen",** entscheidet erst die ausstehende Abnahme: Aufsichts-Gegenmessung am `b098fc6` + vier blinde Kritiker (K1–K4), die ausdrücklich auch prüfen, ob der Gegner ein Gegner geblieben ist.