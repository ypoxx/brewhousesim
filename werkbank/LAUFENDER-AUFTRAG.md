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

## Wo der Lauf steht (Stand 2. August 2026, 14:25 UTC)

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
