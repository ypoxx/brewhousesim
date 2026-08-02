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

## Wo der Lauf steht (Stand 2. August 2026, 17:30 UTC)

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

**Die Kennzahl, drei Nenner nebeneinander** (c6daa5a, nur WEITER, bis zum Ende):

| Epoche | Wochen | Kopfzeile behauptet | gegen umkämpft | Faktor | verschiedene Nenner |
|---|---|---|---|---|---|
| 1350 | 104 | 0,00× (max 23,25) | 0,00× (max 5,89) | — | 3 |
| 1600 | 104 | 19,21× | **1,67×** | 11,5 | 3 |
| 1884 | 102 | 199,54× | **4,42×** | 45,1 | 2 |

Der Nenner wechselt inzwischen (2–3 statt 1) — der EICHUNG-Builder hat daran
gearbeitet, und am Schirm steht unten rechts schon eine Zeile „UMKÄMPFT Ablösung
… · Kasse reicht −0,3×". **Aber die Kopfzeile behauptet weiter das Zehn- bis
Fünfundvierzigfache** des ehrlichen Werts. Solange beide Zahlen nebeneinander
stehen, ist die Latte nicht erfüllt, sondern nur besser dokumentiert.

**Noch offen, keinem laufenden Builder zugewiesen** (Aufgaben #2–#4 der Liste):
Boden und Ende der Wirtschaft · Entwicklernotiz in `name.js:1135` steht in allen
vier Epochen am Schirm („den schreibt DER PREIS, und er liest
welt.haus.rufAufschlag noch nicht") · fünftes Spielerverb (1350/1600/1884 haben
dieselben drei, 1970 hat nur zwei — eines **weniger**, nicht eines mehr).

**Sachfund erledigt:** „1980 Pfand- und Rücknahmepflicht" ist raus,
`preis-daten.js:642` nennt jetzt Verpackungsverordnung 1991 / Zwangspfand 2003.

**Zwei Fallstricke, die je eine halbe Stunde gekostet haben:**
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
