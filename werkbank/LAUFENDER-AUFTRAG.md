# LAUFENDER AUFTRAG — was dieser Lauf tut, falls der Kontext weg ist

**Diese Datei ist das Gedächtnis des Laufs.** Der Container wird zurückgesetzt, Kontexte
werden zusammengefasst, Sitzungen enden. Was nur im Kopf der Aufsicht steht, ist beim
nächsten Reset weg — am 2. August hat genau das vier Stunden gekostet: die
Fortschrittsseite stand auf einem widerlegten Befund, und der Veröffentlicher lief nicht,
während vier Builder arbeiteten, die selbst kein `git` dürfen.

**Wer hier ankommt, tut zuerst dies:**

```
werkbank/wiederaufnahme.sh        # Baum, Server, Veröffentlicher, offene Arbeit
```

Danach diese Datei zu Ende lesen. Sie wird bei jeder Zustandsänderung nachgeschrieben —
wer sie nicht nachschreibt, nimmt dem Nächsten die Grundlage.

---

## Die Grundaufgabe, unverändert

`gauntlet/PROMPT.md` ist der Text, der den Lauf gestartet hat. Kern:

> Bau ein Browserspiel auf Deutsch: eine Wirtschaftssimulation um ein Brauhaus von 1350 bis
> heute. […] Zerlege das Ziel selbst in die kleinsten Stücke, die sich einzeln verbessern
> und beurteilen lassen. **Je Stück ein Builder und ein getrennter Kritiker mit frischem
> Kontext, der nur das laufende Spiel sieht, nie die Begründung des Builders.** Schleife,
> bis wir gewinnen oder ich abbreche.

Drei Messlatten (`gauntlet/MESSLATTE.md`): **Bild** (Blindvergleich gegen `zielbild/`),
**Spiel** (Kritiker zählt am Bildschirm), **Ton** (fremdes Ohr nennt die Epoche).
`design/PRUEFUNG.md` ist Sperrliste, keine Latte.

**Die Versuchung, gegen die dieser Absatz geschrieben ist:** selbst am Spiel zu drehen,
statt den Loop zu fahren. Die Aufsicht misst, benennt und gibt den Befund als Eingang in
den Loop. Sie baut nicht. Wer selbst baut, hat keinen blinden Kritiker mehr — und dann ist
die Methode weg, die das Ganze trägt.

## Welle 3 (2./3. August 2026) — gebaut, geurteilt, teils nachgemessen

**Der Workflow ist weg, die Arbeit nicht.** Am 3.8. gegen 04:20 UTC hat ein zweiter
Container-Reset den Arbeitsbaum auf den Basis-Commit zurückgesetzt UND das
Transkriptverzeichnis von `wf_eccf90fc-7a6` gelöscht. Damit ist das `journal.jsonl`
weg: **kein `resumeFromRunId` mehr möglich, die Urteilstexte der vier blinden
Kritiker sind nicht mehr nachlesbar.** Wiederhergestellt mit
`git fetch origin … && git reset --hard origin/…` — das dauert hier **über zwei
Minuten und muss im Hintergrund laufen**, das Repo ist 2,2 GiB gepackt.

**Was das gerettet hat:** dass die Aufsicht die Arbeit der Builder laufend
committet hat, nicht am Ende. Alles bis `aa650f5` war auf origin. Stand jetzt
`79e629e`, 698 Commits.

**Wo Welle 3 stand, als das Journal starb:** 11 von 12 Ergebnissen. Alle vier
Stücke gebaut, alle vier blinden Kritiker „besteht mit Auflage", drei von vier
Nacharbeiten zurück; DAS ERBE arbeitete noch, seine Dateien sind aber committet.

**Von der Aufsicht am Stand `79e629e` selbst nachgemessen — zwei Auflagen aus
`spiel/BEFUND-ENDE.md` sind erledigt:**

1. **Das Urteil über die Partie ist sichtbar**, in allen vier Epochen, 1075×746
   bis 1075×800 px, `elementFromPoint` trifft es selbst. Vorher lag es
   `stadt-zugeklappt` unter dem Sudbuch.
2. **Vier Epochen, vier verschiedene Ausgänge** statt viermal `keine-abnehmer`:
   `braurecht-entzogen` (1350, „Der Rat entzieht das Braurecht") ·
   `reihe-gestrichen` (1600, „Die Zunft streicht das Haus aus der Reihe") ·
   `bank-verwertet` (1884, „Die Bank verwertet die Braustätte") ·
   `brauereisterben` (1970, „Das Brauhaus wird stillgelegt").
3. **Der Boden hält fast**: Tiefststand der Kasse nur WEITER gedrückt —
   1350 **−1 Pf** (1 Woche unter null statt 44), 1600 **+112**, 1884 **+7.041**,
   1970 **+25.197** (vorher 339). Bleibt: 1350 berührt für eine Woche die −1.

**Die Latte, sparsamer Stil, am Stand `79e629e` nachgemessen:**

| Epoche | rho umkämpft | Jahre unter 1× | Median | verschiedene Nenner |
|---|---|---|---|---|
| 1350 | −0,775 | 3 von 4 | 0,00× | **5** |
| 1600 | −1,000 | 2 von 4 | 1,34× | **9** |
| 1884 | −0,800 | **0 von 4** | 2,67× | **9** |
| 1970 | −0,800 | **0 von 4** | 2,20× | **11** |

**Der große Fortschritt steht in der letzten Spalte.** Vor der Kernänderung nannte
die Kopfzeile in 400 Wochen **einen einzigen** Nenner je Epoche — „Umtrunk beim
Wirt" 9 Pf und seinesgleichen. Jetzt wechselt sie 5- bis 11-mal und nennt jedes
Mal einen umkämpften Zug mit Adresse: Zuvorkommen Klosterschenke Obernberg,
Ablösung Pfarrschenke St. Michael, Zuvorkommen Brückenwirt. Die Kennzahl misst
sich nicht mehr gegen einen Bierdeckel.

**1884 und 1970 haben kein Jahr mehr unter 1×** (vorher 0 und 1 von 4).

**Was NICHT erreicht ist: |rho| < 0,7.** Alle vier liegen zwischen 0,775 und
1,000. Aber Vorsicht mit dieser Zahl — sie stammt aus dem **sparsamen** Stil, und
ein Haus, das nichts tut, muss fallen. Das Urteil gehört auf die sorgfältig
gespielte Linie; deren Skript für Welle 3 (`werkbank/schuss/erbe3/klug.mjs`) ist
committet und noch nicht von der Aufsicht nachgefahren. **Das ist der nächste
Schritt.**

**Offen und ungeprüft:** die Auflagen der vier Kritiker im Einzelnen — ihr
Wortlaut ist mit dem Journal verloren. Was noch messbar ist, misst die Aufsicht
am Bildschirm nach; was nur im Urteilstext stand, ist nicht wiederherstellbar.

**Regel, die dieser Reset erzwingt:** Der Workflow-Zustand liegt NICHT im Repo und
überlebt keinen Reset. Wer eine Welle fährt, schreibt die Urteile der Kritiker
in eine Datei UNTER `werkbank/`, sobald sie da sind — nicht erst am Ende der Welle.

---

## Welle 3 läuft (seit 2. August 2026, 18:45 UTC)

Workflow **`wf_eccf90fc-7a6`**, vier Stücke, je Builder → blinder Kritiker →
Nacharbeit. Plan in `gauntlet/WELLE-3.md`.

| Stück | Auftrag in einem Satz |
|---|---|
| DAS ENDE | Das Urteil über die Partie liegt zugeklappt unter dem Sudbuch, und es ist viermal dasselbe Ende. |
| DIE RÜCKKOPPLUNG | 1350 und 1970 nach dem Muster von 1600 — und der gebaute Boden, der nie erreicht wird. |
| DER NAME | Eine Notiz zwischen zwei Buildern steht in allen vier Epochen am Schirm; `data-deckung` bedeutet zweierlei. |
| DAS ERBE | Das einzige Stück ohne Runde. `welt.erbe()` tritt in keiner gemessenen Partie je ein. |

Skript: `~/.claude/projects/-home-user-brewhousesim/*/workflows/scripts/gauntlet-welle-3-wf_eccf90fc-7a6.js`
Fortsetzen nach Abbruch: `Workflow({scriptPath: "…", resumeFromRunId: "wf_eccf90fc-7a6"})` —
vorher `journal.jsonl` im Transcript-Verzeichnis lesen.

**Wer im Journal wissen will, wer ein Agent ist, liest seine erste Nutzerzeile,
nicht seine Position.** Diese Verwechslung hat in Welle 2b eine Stunde gekostet.

**Am 2.8. um 19:58 UTC hat ein Container-Neustart die Welle mitten im Bauen
erschlagen** — beide Builder hörten in derselben Sekunde auf zu schreiben, das
Journal blieb auf zwei `started` ohne ein einziges `result`. So sieht ein Tod
aus, nicht so sieht Arbeit aus: **hören zwei Agenten in DERSELBEN Sekunde auf,
war es kein Zufall.** Wieder angeworfen mit
`Workflow({scriptPath: …, resumeFromRunId: "wf_eccf90fc-7a6"})`. Weil kein Agent
fertig war, gab es nichts aus dem Zwischenspeicher — die Builder fangen neu an,
aber auf ihren eigenen, schon committeten Dateien. **Deshalb sichert die
Aufsicht die Arbeit der Builder laufend und nicht am Ende:** genau diese
Commits waren nach dem Neustart alles, was von zwei Stunden Bauen übrig war.

---

## Welle 2b (abgeschlossen, 2. August 2026, 18:35 UTC)

Workflow `wf_94fe188f-ca8` beendet: **zwölf Agenten, vier Stücke, je Builder →
blinder Kritiker → Nacharbeit, kein Fehler, kein Abbruch.** Der volle Stand steht
in **`spiel/STAND.md`** (der Welle-1-Stand liegt als `spiel/STAND-WELLE-1.md`
daneben), der nächste Plan in **`gauntlet/WELLE-3.md`**.

**Geschlossen und nachgemessen:** die Kopfzeile nennt den umkämpften Zug
(5,89× / 3,76× / 8,35× / 3,54× statt 12,4× / 35,6× / 274× / 47,8×) · die zwölf
unerreichbaren Züge sind frei · der Jahreswechsel kostet einen Klick · 1970 hat
ein eigenes fünftes Verb (MITBIETEN) · der Sachfehler „1980 Pfandpflicht" ist raus.

**Die KERN-Änderung ist eingearbeitet** (Commit `c882fd7`, ZUSTAENDIGKEIT §24):
`meldeZug(was, preis, art, zug)` rangiert nach Art vor Preis. Von allen vier
Stücken unabhängig verlangt. **Regel für den nächsten Lauf: gesammelte
KERN-Bitten arbeitet die Aufsicht ein, wenn KEIN Agent mehr läuft — nicht
zwischendurch.**

**Zwei Sachen sind gebaut und kommen nicht an** (beide in `spiel/BEFUND-ENDE.md`):
1. Das Urteil über die Partie (`fu-schlussblatt`, 1075×628, mit Klartext) liegt
   in allen vier Epochen `stadt-zugeklappt` unter dem Sudbuch. Bei 1440×900,
   1600×1000 und 2752×1536 geht es auf, **bei 1920×1000 nicht.**
2. Der Boden der Wirtschaft (DIE VERWERTUNG) wird in 1350 nie erreicht:
   Michaelitage 112 / −6 / −7 / −14, 44 von 103 Wochen unter null, keine
   Pfändungszeile in der Chronik.

**Die Latte, sorgfältig gespielt:** 1600 besteht sauber (rho +0,165, 0 von 14
Jahren unter 1×), 1884 besteht, **1350 (rho −0,795, 6 von 12) und 1970 (9 von 11)
kippen nach unten.** Die Aufgabe heißt: 1350 und 1970 nach dem Muster von 1600.

---

## Früherer Stand (2. August 2026, 17:30 UTC)

**Werkzeug der Aufsicht, neu — `werkbank/schuss/aufsicht/`:**

| Datei | wofür |
|---|---|
| `messstand.sh` | friert einen Commit ein und serviert ihn auf **:8900**. Der Arbeitsbaum auf :8899 gehört den Buildern; wer dort misst, misst ein wanderndes Ziel. `messstand.sh HEAD` |
| `nenner.mjs` | liest Woche für Woche Brett für Brett **alle** Preisschilder selbst vom Schirm und rechnet drei Nenner: `kopf` (was das Spiel behauptet), `alles`, `umkaempft` (nur der zählt nach der Latte). `HAFEN=8900 node … <epoche> <wochen> <ziel.json>` |
| `auswerten.py` | rho je Nenner, Jahre unter 1×, Zahl der verschiedenen Nenner |
| `gebraut.mjs` | wird überhaupt gebraut? Stile `weiter` und `brauend` |

**Erledigt und nachgemessen: die zwölf unerreichbaren Züge sind frei** —
`erreichbar.mjs` brettweise: **0 von 80/90/93/84** statt 3/2/2/5. Ursache war DER
GRIFF bei `top: 12,4 %`, der das Paar des GEGNERS am Bahnhof zudeckte.

**Der schwerste Befund dieses Nachmittags, am eingefrorenen Stand c6daa5a:**
**Die Partie endet in allen vier Epochen nach gut drei Braujahren, immer aus
demselben Grund, und sie sagt es nicht.** Nur WEITER gedrückt, sonst nichts:

| Epoche | endet | Grund | Kasse | Keller | Plätze | Sorte |
|---|---|---|---|---|---|---|
| 1350 | 1353/13 | `keine-abnehmer` | **−14 Pf** | 3 | 12 | Kofent |
| 1600 | 1603/13 | `keine-abnehmer` | 0 | 5 | 24 | Nachbier |
| 1884 | 1887/11 | `keine-abnehmer` | 7.312 M | 48 | 90 | Einfachbier |
| 1970 | 1973/9 | `keine-abnehmer` | 339 DM | 30 | 400 | Handelsmarke |

Ein Ende **gibt** es also inzwischen (`welt.zeit.ende`, gesetzt von
`B.uhr.beende` aus `fuhre.js:806`, wenn `Z.frist` abläuft) — das war Auflage 2
und ist zur Hälfte erledigt. Was fehlt, ist dreierlei:

1. **Es sagt nichts.** WEITER wird grau, und das ist alles. Kein Schlussbild,
   keine Zeile, warum die Partie vorbei ist. Was am Schirm steht, ist DAS
   SUDBUCH WIRD GESCHLOSSEN — das eigene Blatt eines Stücks, kein Urteil über
   die Partie.
2. **Es ist immer dasselbe Ende.** Vier Epochen, vier Mal `keine-abnehmer`, vier
   Mal nach 3,2 bis 3,5 Braujahren. 1884 endet mit **7.312 M in der Kasse** —
   das ist kein Ende aus Armut, sondern der letzte Abnehmer, der geht.
3. **Die Kasse hat weiter keinen Boden**: in 1350 steht sie am Ende bei −14 Pf.

Das Sudbuch schreibt dazu selbst hin: „Angestellt hat dieses Haus 0 Sude — 0
Fass Bier", dreimal „Braujahr geschlossen: 0 Sude, 0 Fass, 0 verloren". Im
Keller liegt in jeder Epoche nur die **geringste** Sorte. (Der Keller ist nicht
leer — ein erster Messversuch behauptete das, weil er `f.n` über
`vorrat.faesser` summierte; die Liste führt aber **einzelne Fässer ohne
Stückzahlfeld**. Richtig ist `faesser.length`.)

**Die Latte, auf die SORGFÄLTIG gespielte Linie gerechnet** — das ist die Zahl,
auf die es ankommt. Grundlage sind die vier 400-Wochen-Läufe des
EICHUNG-Builders (`werkbank/schuss/eichung/preis-linie-e*.json`); die Aufsicht
hat 1350 mit seinem eigenen Skript am Stand `7913ba8` nachgefahren und es
**reproduziert** (3,39 → 0,16 bei ihm wie bei mir):

| Epoche | Start → Ende | rho | Jahre unter 1× | Latte |
|---|---|---|---|---|
| 1350 | 3,39 → **0,16** | **−0,795** | **6 von 12** | reißt beide |
| 1600 | 3,56 → 2,69 | **+0,165** | **0 von 14** | **besteht** |
| 1884 | 5,09 → 1,40 | −0,367 | 2 von 14 | besteht |
| 1970 | 3,44 → **0,06** | −0,572 | **9 von 11** | reißt das zweite |

**Der Builder schließt „elf Läufe und kein Kippen" — das prüft nur die Richtung
nach oben.** Die Latte ist zweiseitig. 1350 fällt um Faktor 21, 1970 um Faktor
57. **Aber 1600 besteht sauber**, und das ist der Beleg, der bisher fehlte: das
Vermögen verachtfacht sich, die Kennzahl bleibt im Band 1,44–3,17, weil die
Preise 1,32× schneller wachsen als die Barschaft. **Die Aufgabe heißt deshalb
nicht „die Wirtschaft reparieren", sondern 1350 und 1970 nach dem Muster von
1600 bauen.**

Die Kopfzeile behauptet daneben weiter das 2,1- bis 32,8-fache des ehrlichen
Werts (von beiden Buildern unabhängig gemessen). Das ist eine **KERN**-Sache,
Aufgabe #5, und liegt bei der Aufsicht.

**Noch offen, keinem laufenden Builder zugewiesen** (Aufgaben #2–#4 der Liste):
Boden und Ende der Wirtschaft · Entwicklernotiz in `name.js:1135` steht in allen
vier Epochen am Schirm („den schreibt DER PREIS, und er liest
welt.haus.rufAufschlag noch nicht") · fünftes Spielerverb (1350/1600/1884 haben
dieselben drei, 1970 hat nur zwei — eines **weniger**, nicht eines mehr).

**Sachfund erledigt:** „1980 Pfand- und Rücknahmepflicht" ist raus,
`preis-daten.js:642` nennt jetzt Verpackungsverordnung 1991 / Zwangspfand 2003.

**Wo Welle 2b genau steht (17:50 UTC):** Runde 1 ist für alle vier Stücke durch,
alle vier „besteht mit Auflage". Die **Nacharbeitsrunde** läuft: DIE EICHUNG
fertig, DER GEGNER fertig, **DIE STADT und DER SUD schreiben noch**
(`a723e696`, `afbfb7a2`). Beides sind **Builder, keine Kritiker** — die Aufsicht
hat sie eine Stunde lang für Kritiker gehalten, weil sie in der Reihenfolge des
Journals nach den Builder-Ergebnissen starteten. Wer im Journal wissen will, wer
ein Agent ist, liest seine **erste Nutzerzeile**, nicht seine Position.

Folge für die KERN-Änderung (Aufgabe #5): sie wartet, aber nicht weil ein
Kritiker misst — sondern weil zwei Builder gerade in ihren Dateien schreiben.

**Drei Fallstricke, die je eine halbe Stunde gekostet haben:**

0. **`pkill -f "<muster>"` erschlägt die eigene Shell**, wenn das Muster in ihrer
   Kommandozeile steht — `pkill -f "http.server 8900"` aus einem Befehl heraus,
   der genau diese Zeichenkette enthält, beendet den Aufrufer (Exit 144). Am
   2. August zweimal passiert, das zweite Mal eine Minute nachdem ich es
   aufgeschrieben hatte. Den Prozess über den Hafen finden:
   `ss -lptn "sport = :8900"`.
1. `BRAUHAUS.uhr.jahr` **gibt es nicht** — die Zeit steht in `welt.zeit`.
   `JSON.stringify` wirft `undefined` lautlos weg, also schrieb ein erster Lauf
   240 Wochen ohne Jahreszahl auf, und die Auswertung meldete „keine umkämpften
   Angebote", obwohl 60 von 60 Wochen welche hatten.
2. `data-deckung` gibt es **zweimal mit verschiedener Bedeutung**: `kern/kopf.js`
   die Kennzahl, `stuecke/name.js` das Deckungsband des Rufs. Nur die Kopfzeile
   trägt die Klasse `.deckung`. Wer ohne sie sucht, misst den Ruf.

---

## Früherer Stand (2. August 2026, 15:55 UTC)

**Zwei blinde Kritiker haben geurteilt, beide „besteht mit Auflage":**
DIE EICHUNG und DER GEGNER. Kein Fund auf der Sperrliste.

**Die Kennzahl kippt nicht** — der Kritiker hat sie in **7 Läufen zu je 400 Wochen** in
beiden Extremstilen gemessen (nie kaufen = Obergrenze der Barschaft; jede Woche das
Billigste kaufen). Höchster Wert von Barschaft ÷ billigstes erreichbares Angebot in
irgendeiner Epoche, irgendeinem Jahr, irgendeinem Stil: **5,09×**, und das ist der
Startwert von 1884. In 1970 steigen die Preise um 76 %, während die Kasse auf null fällt.

**Warum meine eigene Messung (rho +0,886 in 1600) davon abweicht — und wer recht hat:**
Wir messen verschiedene Nenner. `auswerten.py` nimmt den billigsten *lageändernden* Zug am
Schirm, der Kritiker das billigste *erreichbare Angebot*, und er lief 400 statt 160 Wochen
in sieben statt einem Lauf. Seine Zahl liegt näher am Wortlaut der Latte. **Die Auflage 1
des Kritikers sagt genau das:** der Nenner der Kopfzeilen-Kennzahl wechselt in 400 Wochen
kein einziges Mal — 1350 „Umtrunk beim Wirt" 9 Pf, 1600 „Freitrunk zur Kirchweih" 18 fl,
1884 „Annonce im Wochenblatt" 240 M, 1970 „Bierdeckel drucken lassen" 1.800 DM. Das Spiel
misst sich selbst gegen einen Bierdeckel. **Solange das so ist, ist jede rho-Zahl ein
Streit über den Nenner. Erst den Nenner ehrlich machen, dann neu messen — beide Wege.**

**Die zehn Auflagen** stehen in `journal.jsonl` des Workflows. Die schwersten:
1. Nenner der Kennzahl gegen den *umkämpften* Zug rechnen (E4 zeigt 47,8×, das billigste
   Ablösen kostet aber 24.300 DM = 3,54×; Faktor 13).
2. **Der Jahreswechsel kostet anderthalb Klicks**: WEITER ist aktiv, sichtbar, trifft sich
   selbst — der Klick landet, die Woche bleibt stehen, erst der zweite löst sie.
3. Die zwölf unerreichbaren Züge freilegen (3/2/2/5 von 80/90/93/84; in 1970 sind drei der
   fünf `fuhre:listen:*`, die epocheneigene Achse).
4. DER GEGNER: „Chronik des Hauses · N Festlegungen" steht in allen vier Epochen auf 0,
   auch nach bezahlter Festlegung. Und der bezahlte Einwegzug gibt seine Geschwisterknöpfe
   wieder frei.
5. Mindestens eine Epoche braucht ein fünftes Spielerverb — das Gerüst ablösen/zuvorkommen/
   hinhalten/Beschwerde ist viermal dasselbe.

**Sachfund ohne Sperrlistenwirkung:** „1980 Pfand- und Rücknahmepflicht" in E4 — eine
bundesweite Rücknahmepflicht gab es 1980 nicht.

---

## Frühere Stände

### Stand 14:25 UTC

**Erledigt und von der Aufsicht nachgemessen:** Auflage 23 (`ZUSTAENDIGKEIT.md` §23) — der
Deckel über WEITER ist weg, `nurweiter.mjs` schafft **drei Braujahre in allen vier Epochen**
mit nichts als WEITER; vorher war nach einem Braujahr Schluss. Der Halt zu Georgi bleibt, sein
Ausgang trägt jetzt das Wort darauf.

**Die Kennzahl hat sich halb bewegt.** Eigene Messung (sequenziell! siehe Fallstrick unten):

| Epoche | vor der Welle | jetzt gemessen | Ziel \|rho\| < 0,7 |
|---|---|---|---|
| 1350 | +0,714 | **+0,429** | erreicht |
| 1600 | −0,714 | **+0,886** | verfehlt |
| 1884 | −0,771 | **−0,771** | verfehlt |
| 1970 | +0,829 | **−0,429** | erreicht |

Jahre unter 1×: **0/0/1/0** statt vorher 0/4/4/0 — die Armutsfalle ist weg, das zweite
Kriterium ist erfüllt. Der EICHUNG-Builder hatte für 1600 und 1884 bessere Zahlen gemeldet;
zwischen seiner Messung und meiner sind die anderen Stücke eingeschlagen. **Deshalb misst die
Aufsicht selbst.** Nächster Schritt: sein Urteil vom blinden Kritiker abwarten, dann Runde 2
mit meinen Zahlen.

**FALLSTRICK, der eine Stunde gekostet hat:** `messe.mjs` NIE vier Epochen parallel fahren.
Auf vier Kernen brechen alle vier reproduzierbar in Woche 31 ab — und das sieht genau aus wie
der Defekt aus Auflage 23. Sequenziell laufen sie durch:
`for e in 1 2 3 4; do node werkbank/schuss/eichung/messe.mjs $e 160 sparsam /tmp/eichung/e$e-sparsam.json; done`

---

## Der ursprüngliche Wellenplan (Stand 13:30 UTC)

**Welle 2b läuft** als Workflow `wf_94fe188f-ca8`, vier Stücke, je Builder → blinder
Kritiker → Nacharbeit:

| Stück | Auftrag |
|---|---|
| DIE EICHUNG | Die Kennzahl der zweiten Latte kippt in **allen vier** Epochen. Ziel: \|rho\| < 0,7 überall, höchstens ein Jahr von sechs unter 1×. |
| DER GEGNER | Runde 2. Sieht man seine Züge im Bild, ohne ein Blatt aufzuschlagen? |
| DIE STADT | Runde 6. Die neue Platzordnung darf verbessert, nicht entfernt werden. |
| DER SUD | „Gebraut wird bisher nicht" — eine echte Entscheidung über das Bier. |

Skript: `~/.claude/projects/-home-user-brewhousesim/*/workflows/scripts/gauntlet-welle-2b-wf_94fe188f-ca8.js`
Fortsetzen nach Abbruch: `Workflow({scriptPath: "…", resumeFromRunId: "wf_94fe188f-ca8"})` —
vorher `journal.jsonl` im Transcript-Verzeichnis lesen, dort stehen die echten Rückgaben.

**Die Zahl, an der dieser Lauf hängt** (`spiel/BEFUND-WIRTSCHAFT.md`), Stand vor der Welle:

| Epoche | rho | Jahre unter 1× |
|---|---|---|
| 1350 | +0,714 | 0 von 6 |
| 1600 | −0,714 | 4 von 6 |
| 1884 | −0,771 | 4 von 6 |
| 1970 | +0,829 | 0 von 6 |

Nachmessen: `node werkbank/schuss/eichung/messe.mjs <epoche> 160 sparsam /tmp/eichung/e<n>-sparsam.json`
für alle vier, dann `cd werkbank/schuss/eichung && python3 auswerten.py sparsam`.

## Zwei Befunde vom 2. August, die die Aufgabe neu gestellt haben

1. **`spiel/BEFUND-BRETTER.md`** — Die Eichung hatte einen verklemmten Bildschirm gemessen,
   nicht die Wirtschaft. Ein Drittel aller Bedienelemente war zugedeckt, darunter der
   Rohstoffeinkauf. Die STADT hat dafür eine **Platzordnung** bekommen (`platzordnung()` in
   `stadt.js`): wer zuletzt aufschlägt liegt oben, was er zudecken würde klappt zu.
2. **`spiel/BEFUND-WIRTSCHAFT.md`** — Die ehrlichen Zahlen danach. Alle vier Epochen kippen.
   Ursache in einem Satz: *Kosten hängen an der Fahrt und am Kalender, Ertrag hängt an der
   Ladung, und nichts koppelt das Ergebnis auf die Schwierigkeit zurück.*

## Die vier Regeln, an denen dieser Lauf schon einmal gescheitert ist

1. **Die Builder dürfen kein `git`.** Also committet und pusht die Aufsicht — oft, nicht am
   Ende. Uncommittete Arbeit ist einen Reset vom Nichts entfernt. Unter der Sperre:
   `flock werkbank/.gitsperre bash -c '…'` (`flock -c` gibt es nicht).
2. **Vor jedem Commit prüfen, nicht danach:** alle vier Epochen laden, `BRAUHAUS.lage`
   ist 0, keine Konsolenfehler. Ein Zwischenstand darf unfertig sein — er darf nicht kaputt
   sein, und er wird als Zwischenstand benannt.
3. **Die Fortschrittsseite ist Teil des Auftrags**, nicht Kosmetik. Steht `stand.json`
   Stunden still, während gearbeitet wird, zeigt sie eine Lüge:
   `./werkbank/stand.py phase "…"` · `zahl <name> <wert>` · `chronik "…"` · `stueck --name …`
4. **`spiel/index.html` ist eingefroren, `kern/**` schreibgeschützt.** Nötige Kernänderungen
   gehen als Absatz „KERN: …" in den Bericht, nicht in die Datei. Datei-Eigentum je Stück
   steht in `spiel/LIESMICH.md`.

## Wenn eine Runde durch ist

1. Urteile der blinden Kritiker lesen (Rückgabe des Workflows oder `journal.jsonl`).
2. Selbst nachmessen — dem Builder wie dem Kritiker wird nicht auf Zusage geglaubt.
3. `spiel/STAND.md` und `stand.json` nachschreiben, diese Datei ebenfalls.
4. Was durchfiel, geht mit dem Urteil zurück an den Builder. Was bestand, bleibt liegen.
5. Nächste Welle aus `gauntlet/WELLE-2.md` — offen ist zuletzt **DAS ERBE**, das in alle
   anderen Stücke hineinliest.
