# LAUFENDER AUFTRAG — was dieser Lauf tut, falls der Kontext weg ist

## DIE WERKSTATTSEITE — wo sie steht, und wie sie am 3. August still starb

```
https://claude-brauhaus-imperium-sim-163s85--brewhousesim.netlify.app
```

**Das ist die Adresse dieses Zweigs.** Sie stand bis zum 3. August 2026 nirgends
im Repo, und genau deshalb war der Ausfall so mühsam zu finden.

**Was passiert war:** Die Seite hing an der **Deploy-Vorschau von PR #2**. Der
PR wurde am 3.8. um 10:46 UTC geschlossen, ohne Merge — damit baute Netlify
keine Vorschau mehr. Gleichzeitig war zwischen 05:50 und 10:47 UTC nichts
gepusht worden (der Container-Ausfall weiter unten). Der Auftraggeber sah also
stundenlang einen Stand von **05:50 UTC = 07:50 deutscher Zeit** und hielt ihn
für aktuell. Eine Seite, die stehenbleibt, ohne es zu sagen, ist schlimmer als
gar keine.

**Die Lösung, vom Auftraggeber am 3.8. eingeschaltet:** ein **Branch-Deploy**
auf `claude/brauhaus-imperium-sim-163s85`. Er baut bei **jedem Push** neu,
unabhängig von Pull Requests, und lässt die Produktionsseite in Ruhe.

| | |
|---|---|
| Werkstatt dieses Zweigs | `claude-brauhaus-imperium-sim-163s85--brewhousesim.netlify.app` |
| Produktionsseite (Basiszweig, **alt**) | `brewhousesim.netlify.app` — Stand 27. Juli, Commit `a2dc97a` |
| Netlify-Projekt | `app.netlify.com/projects/brewhousesim`, Site-ID `cbf1ad15-7f0e-4649-a009-448faad7d1b2` |

**Zwei Dinge, die die Aufsicht hier NICHT kann** — nicht vergessen und nicht
erneut Stunden hineinstecken:
1. **`*.netlify.app` und `api.netlify.com` sind durch die Egress-Policy dieser
   Umgebung gesperrt.** Die Seite lässt sich von hier aus nicht abrufen und
   nicht prüfen. Ob sie lebt, weiß nur, wer sie im Browser öffnet.
2. Das Netlify-MCP bietet als Schreiboperation nur `deploy-site`, und das ginge
   **auf die Produktion**. Branch-Deploys sind über die Werkzeuge hier nicht
   einstellbar — das geht nur in der Netlify-Oberfläche.

**Prüfen, ob die Seite frisch ist:** `werkbank/stand.json` trägt oben ein Feld
`stand` mit dem Zeitstempel. Steht dort etwas Altes, während gearbeitet wird,
zeigt die Seite eine Lüge — `./werkbank/stand.py phase "..."` nachziehen.

**Diese Datei ist das Gedächtnis des Laufs.** Der Container wird zurückgesetzt, Kontexte
werden zusammengefasst, Sitzungen enden. Was nur im Kopf der Aufsicht steht, ist beim
nächsten Reset weg — am 2. August hat genau das vier Stunden gekostet: die
Fortschrittsseite stand auf einem widerlegten Befund, und der Veröffentlicher lief nicht,
während vier Builder arbeiteten, die selbst kein `git` dürfen.

## DIE FUHRE IST DURCH, BLIND GEPRÜFT — 4. August, 23:5x UTC

**Urteil: BESTEHT MIT AUFLAGE**, vier Auflagen, in
`werkbank/urteile/welle6-die-fuhre-urteil.md` (45 KB). Gemessen durchgehend am
eingefrorenen Stand `7440a09`, Marke vor und nach dem Lauf geprüft, Messwerte als
`.json` unter `werkbank/schuss/fuhre-blind-w6/` — nicht in `/tmp`.

**Was das Stück erreicht hat**, vom Kritiker am Stück getrennt gezählt: **0
Textknoten unter 12 px · 0 von 20–24 aktiven Knöpfen unter der Zielfläche · 0
abgeschnittene Kästen**, in allen vier Epochen, während im selben Bild 277–284 zu
kleine Knoten fremder Stücke stehen. Die Aufsicht hat die Gesamtzahlen
unabhängig nachgemessen: **92 / 1128 / 0** bei 1366×768, Ziffer für Ziffer wie
gemeldet, und `fu:` taucht in der Aufschlüsselung nirgends mehr auf.

**ZWEI BEFUNDE ÜBER DIE MESSGERÄTE DER AUFSICHT SELBST — der wichtigere Teil.**
Beide stehen im Wortlaut in `gauntlet/MESSLATTE.md` bei Latte 4:

1. **`--hide-scrollbars` ist Playwrights Startvorgabe**
   (`chromium.js:284`), von der Aufsicht im Quelltext bestätigt. **Jede
   Lesbarkeitszahl dieses Laufs ist ohne Rollleiste entstanden** — die des
   Builders, die der Latte und die Gegenmessung der Aufsicht gleichermaßen. Mit
   gezeichneter Rollleiste schneidet `.fu-kerbsatz` bei 1366×768 in 1350 und 1884
   ab. **Jede Zahl dieser Latte ist damit eine Untergrenze, kein Ergebnis.**
2. `lesbarkeit.mjs:26–32` zählt einen Kasten mit `overflow-y: hidden` und
   `overflow-x: auto` als abgeschnitten, obwohl er rollt.

> **Repariert wird beides erst, wenn kein Agent daran misst.** DER SUD läuft
> noch. Wer das Maß ändert, während gemessen wird, entwertet beide Messungen.

**LATTE 2 — der Kritiker sagt FÄLLT DURCH, und er widerspricht der eingetragenen
Tabelle.** Zwölf Läufe, sequenziell durchs Messfenster, Spannweite 0,000:

| Epoche | 12 Braujahre | 13 | 14 | in MESSLATTE eingetragen |
|---|---|---|---|---|
| **1350** | **+0,762** | +0,692 | +0,591 | gleich |
| 1600 | +0,189 | −0,066 | −0,156 | **gewandert** |
| 1884 | +0,168 | +0,346 | +0,393 | gleich |
| **1970** | **+0,699** | +0,637 | +0,653 | **+0,427 / +0,154 / +0,275** |

1350 reißt bei zwölf Braujahren, 1970 steht **ein Tausendstel** unter der Latte.
Zwei Epochen sind gewandert, und **wer sie bewegt hat, ist nicht feststellbar** —
genau der schon dokumentierte Fall „zwei Stücke füttern dieselbe Kennzahl".
**Die Aufsicht misst 1350 und 1970 gerade selbst nach**, drei Läufe je Epoche,
sequenziell durchs Fenster, am selben eingefrorenen Stand; Rohdaten nach
`werkbank/schuss/aufsicht/welle6-fuhre-nach/rho/`.

**BEFUND AUSDRÜCKLICH AN DIE AUFSICHT, nicht an einen Builder:** beim Laden sind
alle vier FUHRE-Bretter zugeklappt, und dabei melden **20–24 Züge je Epoche
`disabled = false`, während 0 davon mit der Maus erreichbar sind** — bei jeder
Fenstergröße. **Die geplante `data-soll-aus`-Kernänderung schließt diese Hälfte
nicht:** sie trennt „das Spiel sagt nein" von „verdeckt", aber nicht „bedienbar"
von „nur im DOM". Wer Spalte (a) der zweiten Latte zählt, zählt weiter zu viel.

---

## SECHSTER CONTAINER-RESET, 4. August 20:21 UTC — und der grüne Haken dazu

**Der Reset hat eine ALTE PLATTE zurückgespielt.** Der Arbeitsbaum stand danach
auf `78c79bb` vom **3. August 23:16**; origin lag auf `8ded043` von 19:2x des
4. August. Weg im Baum waren: die ganze Welle 6, das fünfte Zielbild, Frage (G),
das Messfenster, sämtliche Gedächtniseinträge des Tages. **Verloren war nichts** —
alles lag auf origin, weil die Aufsicht stündlich committet.

> **Und `wiederaufnahme.sh` hat dazu „✓ origin ist auf Stand" gemeldet.**
> Ursache: `git fetch … 2>/dev/null || true` verschluckte den **gescheiterten**
> Fetch — zwei Minuten nach dem Boot gab es noch kein Netz. Der Vergleich lief
> danach gegen die **mitrestaurierte, genauso alte** Referenz `origin/<zweig>`:
> 0 voraus, 0 zurück, grüner Haken. Das ist derselbe Fehler wie in der Nacht zum
> 4.8., nur eine Ebene tiefer — damals holte es gar nicht, jetzt holte es
> vergeblich und schwieg darüber.
>
> **Behoben und gegen BEIDE Fälle geprüft:** mit Netz grüner Haken, ohne Netz
> „origin NICHT erreichbar — dreimal versucht. Der Vergleich unten ist WERTLOS."
> Geprüft wurde mit einer vorübergehend verbogenen Remote-URL, danach die echte
> nachweislich zurückgesetzt.

**`/tmp` ÜBERLEBT DEN RESET NICHT.** Sämtliche Messergebnisse beider Builder
unter `/tmp/sudnach/` und `/tmp/fuhre-rho/` waren weg — Stunden an ρ-Läufen. Die
**Berichte** unter `werkbank/urteile/` überlebten, weil sie committet waren.
Das ist der ganze Grund für die Regel „Teilergebnisse laufend hineinschreiben":
von beiden Buildern war je **eine Stunde** verloren statt eines ganzen Tages.

**Beide Builder waren tot und wurden per `SendMessage` an dieselbe
Agenten-Kennung wieder aufgenommen** — mit vollem Kontext, samt der Ansage, was
im Baum steht, was unter `/tmp` weg ist und dass das Messfenster weiter gilt.

**Wer hier ankommt, tut zuerst dies:**

```
werkbank/wiederaufnahme.sh        # Baum, Server, Veröffentlicher, offene Arbeit
```

Danach diese Datei zu Ende lesen. Sie wird bei jeder Zustandsänderung nachgeschrieben —
wer sie nicht nachschreibt, nimmt dem Nächsten die Grundlage.

---

## DIE MESSLATTE HAT SEIT DEM 4. AUGUST VIER PUNKTE — und Latte 2 ist verschärft

*Vom Auftraggeber freigegeben, nachdem er gefragt hatte, ob jemand auf
Lesbarkeit, Usability und technische Effizienz achtet. Die ehrliche Antwort war
**nein**. Der Wortlaut steht in [`../gauntlet/MESSLATTE.md`](../gauntlet/MESSLATTE.md).*

**LATTE 4 — LESBARKEIT.** Gemessen bei **1366×768**, nicht auf der
Entwurfsleinwand: keine Schrift unter 12 px, kein aktiver Knopf unter 24×24 px,
kein abgeschnittener Text.

Der Befund dahinter ist **eine Zeile**, `stil/grund.css:12`:
`--s: min(calc(100vw / 2752), calc(100vh / 1536))`. Jede Schriftgröße steht als
`calc(var(--s) * N)` — das Spiel ist auf 2752×1536 entworfen und skaliert alles
proportional herunter. **Kein einziges CSS schreibt eine Größe unter 12 px;** sie
entstehen erst beim Zeichnen.

| Fenster | kleinste Schrift | Knöpfe unter 24 px |
|---|---|---|
| 2752×1536 *(Entwurf)* | 10,0 px | 1 von 87 |
| 1920×1080 | 7,0 px | 40 von 87 |
| **1366×768** | **5,0 px** | **64** von 87 |

**SPERRLISTE, neu: DAS GEWICHT.** 23 MB in 85 Anfragen je Aufruf, Obergrenze
**8 MB**. Veto, keine Latte — sonst würde es nach unten optimiert. Das **Tempo**
ist ausdrücklich *nicht* betroffen: 16,7 ms Bildzeit im Median in allen vier
Epochen, p95 unter 22 ms.

**LATTE 2 VERSCHÄRFT — die Laufzeit gehört in die Zahl.** ρ hängt daran, wie
viele Braujahre gezählt werden:

| Epoche | 12 Jahre | 13 | 14 |
|---|---|---|---|
| **1350** | **+0,762** | **+0,692** | +0,591 |
| 1884 | +0,168 | +0,346 | +0,393 |

1884 läuft in die *andere* Richtung — es gibt keine freundlichste Laufzeit.
**Ab jetzt wird über alle drei Schnitte gemessen, und die Latte reißt, sobald
einer über 0,7 liegt.**

> **Folge, die ausdrücklich gegen die eigene Erfolgsmeldung geht: das am
> 3. August gemeldete „Wellenziel erreicht" gilt nach dieser Regel NICHT mehr.**
> 1350 steht bei zwölf Jahren auf +0,762. Die Verschärfung ist beabsichtigt —
> eine Zahl, die von der Wahl der Laufzeit lebt, ist keine bestandene Latte.

**Zwei neue Messgeräte der Aufsicht**, beide im Repo:
`werkbank/schuss/aufsicht/lesbarkeit.mjs` (statisch, ohne Klicks und ohne
Zeitmessung, damit es neben einem laufenden Kritiker ehrlich bleibt) und
`tempo.mjs` (**nur auf leerer Maschine** — ein fremder Browser verschiebt jede
Zahl).

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

## WIEDERHERSTELLUNG — erledigt am 3. August 2026. Die Ursache ist weg.

**Fünf Container-Resets in vier Stunden**, dreimal genau beim Start eines
Workflows. Jedes Mal stand der Arbeitsbaum wieder auf dem Basis-Commit, und der
Weg zurück war versperrt: der volle `git fetch` riss mit `early EOF` nach 3,3 GB,
`--filter=blob:none` zerlegte den Objektspeicher, `--refetch` riss ebenso.

**Die Ursache war gemessen, nicht geraten:**

| | |
|---|---|
| Belegbilder unter `werkbank/schuss/` | 1217 Dateien, 3,1 GB, Median 3,1 MB je PNG |
| davon in irgendeinem Dokument eingebettet | **2** |
| Blob-Gewicht `schuss` in der Historie | **2,94 GB** |
| Blob-Gewicht alles Übrige | **0,36 GB** |
| Standardzweig `project-setup-apis-p51a0f` | **0** Belegbilder |

Die 2,94 GB lagen also vollständig auf diesem Zweig. **Komprimieren hätte nichts
geholfen** — Git behält jeden alten Blob für immer; nur ein Umschreiben der
Historie kommt an sie heran.

**Was getan wurde** (nach Rückfrage beim Auftraggeber, der die Bereinigung
freigegeben hat, falls die Bilder für den weiteren Verlauf entbehrlich sind —
sie sind es, Begründung unten):

```
git fetch --depth=1 origin <zweig>          # kam durch, 2,37 GB
git fetch --unshallow origin <zweig>        # kam ebenfalls durch → 752 Commits
pip install git-filter-repo
git filter-repo --path werkbank/schuss --invert-paths --refs <zweig> --force
```

752 → 640 Commits (112 waren reine Bild-Commits und wurden leer). Danach die
**243 Nicht-Bild-Dateien** aus `werkbank/schuss/` aus dem alten Commit
zurückgeholt: 105 Skripte (`.mjs`/`.py`/`.sh`) und 138 Messwertdateien (`.json`).

> **Das war der gefährliche Teil.** Unter `werkbank/schuss/` lagen nicht nur
> Bilder, sondern die **Messgeräte** — `eichung/preis-linie.mjs` (die Linie des
> sorgfältigen Spiels, aus der die Wellenzahlen kommen), `aufsicht/messstand.sh`,
> `aufsicht/nenner.mjs`, `stadt-r6/lot.mjs`, die neun Skripte des SUD-Kritikers.
> Wer hier noch einmal aufräumt, filtert **nach Endung, nicht nach Ordner**.

**Ergebnis:** Arbeitsbaum 3,4 GB → **263 MB**. Abnahmetor danach gefahren:
vier von vier Epochen laden, `BRAUHAUS.lage` 0, keine Konsolenfehler.

**Warum die Bilder entbehrlich sind — das ist die Methode, nicht Bequemlichkeit:**
Der blinde Kritiker sieht **das laufende Spiel**, nie ein altes Bild; täte er es,
wäre die Blindheit hin. Die Messlatte BILD vergleicht die *laufende* Aufnahme
gegen `zielbild/` (9 Dateien, 15 MB — die bleiben). Die Zahlen kommen aus
`preis-linie.mjs`, nicht aus Bildern. Das Ergebnis eines Urteils ist der **Text**
in `werkbank/urteile/` und die **Zahl** in der `.json` neben dem Skript. Beides
ist versioniert. Das Bild ist Arbeitsmaterial.

**Ab jetzt greift `.gitignore`:** weiter nach `werkbank/schuss/` schießen, die
Messstände lesen von dort — aber `*.png|jpg|jpeg|webp|gif` wandern nicht mehr
mit. Skripte und Messwerte schon.

**Nachtrag vom selben Tag, 11:24 UTC — dieselbe Falle in Ton.** DER KLANG hatte
nach keiner halben Stunde **12 `.wav`-Blobs mit 20,2 MB** in der Historie: je
Durchgang eine neue Fassung, jede 1,9 MB. Die `.webm` daneben trägt dieselbe
Aufnahme mit 236 KB — einem Achtel — und ist das, was der blinde Kritiker
abspielt. `.wav` ist jetzt ebenfalls in der `.gitignore`; die Dateien bleiben auf
der Platte und sind aus der `.webm` wiederherzustellen.

> **Die Regel dahinter, allgemein:** was **Arbeitsmaterial einer Messung** ist,
> gehört nicht in die Historie — Bild, Ton, Zwischenrender. Was **Ergebnis** ist,
> gehört hinein: das Urteil in Worten und die Zahl daneben. Wer ein neues
> Aufnahmeformat einführt, prüft es gegen diese Regel, **bevor** der erste
> Durchgang läuft. Zweimal an einem Tag ist genug.

**OFFENER BEFUND AM MESSGERÄT — `werkbank/hoerer.py`, Zeile 181.** Echte
Abbrüche behandelt es korrekt: dreimal fragen, dann „KEINE MESSUNG — nicht als
Durchfallen werten“ (Zeile 157–170). Die Lücke liegt eine Stufe feiner: wenn das
Ohr **antwortet**, die Antwort aber sinngemäß „keine Audiodatei übertragen“
lautet und `sicher: 0` trägt, ist das kein Abbruch — `deute()` liest eine Ziffer
heraus, und Zeile 181 wertet sie als geratene Epoche, also als
**DURCHGEFALLEN**. Ein Übertragungsfehler wird damit zu einem schlechten Urteil
über das Spiel. Der Builder von DER KLANG hat das an einer nachweislich intakten
Datei erlebt und korrekt gemeldet, ohne selbst am Gerät zu drehen (§16).
**Noch nicht behoben, mit Absicht:** der blinde Kritiker prüft das Gerät gerade
selbst. Wer es repariert, wartet, bis kein Kritiker mehr daran misst — sonst
ändert die Aufsicht das Maß, während gemessen wird. Richtig ist: `sicher == 0`
zusammen mit einem Text, der fehlende Audiodaten nennt, zählt als **keine
Messung**, nicht als Durchfallen.

**Der Veröffentlicher sichert die Builder von selbst.** `werkbank/veroeffentlichen.sh`
nimmt alle 180 s unter derselben Sperre `werkbank/stand.json spiel gauntlet
werkbank/schuss werkbank/urteile werkbank/*.py|mjs|sh` und pusht. Schritt (a) des
Selbst-Checks läuft also fortlaufend — aber **ungeprüft**: der Veröffentlicher
fährt kein Abnahmetor. Die Aufsicht fährt es trotzdem, und zwar bevor sie selbst
committet.

> **DER VERÖFFENTLICHER STIRBT NACH VIER STUNDEN, planmäßig und stumm.**
> `wiederaufnahme.sh:105` startet ihn mit `180 14400` — Takt 180 s, **Laufzeit
> 14400 s = 4 h**. Danach beendet er sich ohne Meldung, und von da an sichert
> **nur noch der Selbst-Check**. Am 4. August lag dazwischen ein Loch von 17:28
> bis 18:21, in dem der Baubericht der FUHRE uncommittet dastand.
>
> **Folge, die man wissen muss:** der Selbst-Check ist nicht bloß Kontrolle, er
> ist in diesen Lücken die *einzige* Sicherung. Wer ihn seltener als stündlich
> fährt, verlässt sich auf einen Prozess, der schon abgelaufen sein kann.
> `wiederaufnahme.sh` erkennt und startet ihn neu — das ist der Grund, warum es
> **immer zuerst** läuft.

> **`werkbank/urteile` stand bis zum 4. August NICHT in dieser Liste** — als
> einziges Verzeichnis unter `werkbank/`. Das ist genau die Stelle, an die die
> Laufregel oben Builder und Kritiker schickt („Teilergebnisse **laufend** in die
> Urteils- oder Berichtsdatei schreiben"). Ein Kritiker, der zwei Stunden misst
> und brav laufend schreibt, hätte bei einem Container-Reset alles verloren,
> während die Regel ihm sagte, er sei gesichert. Der Aufsicht fiel es beim
> Selbst-Check auf, weil `welle6-die-fuhre-bau.md` nach einer Stunde immer noch
> uncommittet dastand. Geschlossen. **Wer die Pfadliste ändert, prüft sie gegen
> die Frage: schreibt hier jemand etwas hinein, das nur einmal entsteht?**

**Eine Falle bleibt:** `pgrep -f "git fetch"` trifft die **eigene Warte-Shell**,
deren Kommandozeile die Zeichenkette enthält. Ein toter Fetch sieht dann aus wie
ein laufender. Am Logfile prüfen, nicht an `pgrep`.

**Agenten sterben mitten im Lauf.** Am 3. August ist der blinde Kritiker für DER
SUD nach fünf Minuten an einem API-Fehler abgebrochen, mitten beim Bau seines
Messstands. **Er war nicht verloren:** seine Dateien lagen auf der Platte, und
ein `SendMessage` an dieselbe Agenten-Kennung nimmt den Lauf mit vollem Kontext
wieder auf — für einen *blinden* Kritiker ist das sogar besser als ein Neustart,
weil sein unverdorbener Kontext erhalten bleibt. Neu starten heißt: alles noch
einmal messen.

> **Regel für jeden Auftrag ab jetzt:** Teilergebnisse **laufend** in die
> Urteils- oder Berichtsdatei schreiben, nicht erst am Ende. Ein unfertiges
> Urteil mit den bis dahin gemessenen Zahlen ist mehr wert als ein verlorenes
> vollständiges. Die Aufsicht sichert die Dateien ohnehin alle paar Minuten —
> aber nur, was geschrieben ist.

**Zwei Zugschlüssel, an denen sich hier schon Skripte die Zähne ausgebissen
haben** (sie klicken dann still ins Leere und melden 0 Klicks, ohne zu scheitern):
- Der Wochenknopf heißt schlicht **`[data-zug="weiter"]`** — nicht `fuhre:weiter`,
  nicht `welt:weiter`.
- Die Brett-Reiter heißen **`stadt:reiter:*`**, acht Stück, in allen vier Epochen
  dieselben Schlüssel (`…:sud-sud-brett`, `…:gegner-amort-gg-band`,
  `…:name-nm-band`, `…:erbe-blatt-erb-buch`, vier für DIE FUHRE).

---

## BEFUND ÜBER DIE MESSLATTE SELBST — `disabled` misst zwei Dinge zugleich

**Gemeldet vom blinden Kritiker DER SUD am 3. August, von der Aufsicht
nachgemessen und bestätigt.** Das ist kein Stück-Befund, das ist ein Befund
über das Messen in diesem ganzen Lauf.

`schalte()` verwandelt **Verdeckung** in `disabled`. Damit misst jeder Zähler,
der `disabled` liest, zwei völlig verschiedene Dinge in einer Zahl: *„das Spiel
sagt nein"* und *„es ist gar nichts da"*. Genau diese Zahl ist **Spalte (a) der
zweiten Messlatte** — „Entscheidungen mit Preisschild, erreichbar UND aktiv".

Nachmessung der Aufsicht, Woche 1 je Epoche, am Arbeitsbaum:

| Epoche | Züge | aktiv | gesperrt | davon `data-soll-aus="0"` | **ohne das Attribut** |
|---|---|---|---|---|---|
| 1350 | 102 | 82 | 20 | 5 | **13** |
| 1600 | 112 | 83 | 29 | 6 | **20** |
| 1884 | 116 | 87 | 29 | 7 | **20** |
| 1970 | 107 | 82 | 25 | 7 | **14** |

Die fünf bis sieben mit `soll-aus="0"` sind gesperrt, **obwohl das Spiel sie
erlaubt**. Sämtliche Beispiele sind `sud:*` — das Attribut gibt es also
offenbar **nur bei DER SUD**, weil dessen Builder es eingeführt hat. Für die
**13 bis 20 anderen** gesperrten Züge je Epoche kann niemand die beiden Fälle
trennen.

> **Was das für alle bisherigen Zahlen dieses Laufs heißt:** jede gezählte
> „aktive" Zugzahl ist eine **Untergrenze**, und um wie viel sie danebenliegt,
> weiß man je Stück nicht. Wer künftig Spalte (a) zählt, sagt dazu, ob er
> `disabled` oder `data-soll-aus` gelesen hat. **Das Abnahmetor der Aufsicht
> ist davon nicht betroffen** — es zählt alle `[data-zug]` und behauptet nicht,
> sie seien aktiv.

**Offen, gehört in eine KERN-Änderung zwischen den Wellen:** `data-soll-aus`
einheitlich für alle Stücke setzen, damit „das Spiel sagt nein" von „es ist
verdeckt" überall unterscheidbar wird. Der SUD-Builder ist aufgefordert, dafür
einen Vorschlag als `KERN:`-Absatz zu liefern, ohne fremde Dateien anzufassen.

---

## OFFEN AN DEN AUFTRAGGEBER — die dritte Latte stösst an eine Grenze

**DER KLANG hat Auflage 4 nicht erfüllt, und der Grund ist gemessen, nicht
vermutet.** Sechs Stände gebaut, 48 Aufnahmen, 56 stille Vorgangsfragen:
**Gegenzug 0 von 4 gespielt, 0 von 4 still.**

Die einzigen Stände, in denen das Ohr den fremden Hof öfter bejahte, trugen
eine erkennbare **englische Stimme** im Zeichen — dasselbe Ohr meldete sie als
*„Radio-/Fernsehübertragung"*, mit wörtlichem Zitat aus dem Erzeugungsprompt.
Zwei Tiefpässe tilgten die Sprache nicht; stimmlos: 0 von 4.

> **Der Kern der Sache:** Was ein Ohr an einem fremden Hof erkennt, sind fremde
> **Leute** — und die bringen eine Sprache mit. Eine Sprache, die in 1350
> erkennbar ist, ist ein Anachronismus; eine, die es nicht ist, hört das Ohr
> nicht als Nachbarn. Die Auflage könnte in dieser Form unerfüllbar sein.

**Zwei weitere Befunde, die die Latte selbst betreffen:**

1. **1884 ist mit diesem Ohr nicht messbar.** In *allen* Messungen — Vorrunde
   und vier Stände — bejaht es dort **zwei von vier Blendern**. Nach der Regel
   des Kritikers zählt dort damit auch sein *Nein* nicht. Eine Epoche, in der
   das Messgerät rät, kann die dritte Latte weder bestehen noch reißen.
2. **Derselbe Ton ergab an zwei Tagen 17 % und 33 %** stille Trefferquote. Die
   Vorgangsfrage braucht dieselbe Mehrheitsregel aus drei Durchgängen, die für
   die Epochenfrage schon gilt (Sperrliste 5) — sonst ist eine Einzelmessung
   Zufall.

**Zu entscheiden, weil es die Messlatte ändert und nicht das Spiel:** ob der
Gegenzug als hörbarer Vorgang fallen gelassen wird, ob die Latte ihn anders
prüft (etwa an einer Veränderung im Klangbild statt an einem benannten
Ereignis), oder ob ein anderes Ohr gesucht wird. **Nicht die Aufgabe eines
Builders.**

*Was in derselben Runde gelang:* die gespielte Trefferquote stieg auf **10 von
12** — der beste je gemessene Wert. Und wieder lagen **vier Proben falsch**:
`nachbar1` war eine **Tröte** aus dem 20./21. Jahrhundert und lief seit Welle 5
in drei Epochen mit. Dazu ein stiller Fehler im Tonbus — `angleich()` kappte
bei Faktor 6, `drueben1` brauchte 76, und das Nachbarzeichen stand in 1970
**dreizehnmal lauter** als in 1350.

---

## WELLE 5 IST DURCH — 4. August 2026

Zwei Stücke, je Builder → blinder Kritiker → Nacharbeit. Beide Nacharbeiten
liegen vor, beide Kritiker haben **besteht mit Auflage** gesprochen.

**Von der Aufsicht selbst nachgemessen**, zwölf Läufe à 400 Wochen, sequenziell,
eingefrorener Stand `916004d`, je drei pro Epoche. Rohdaten in
`werkbank/schuss/aufsicht/welle5-schluss/`.

| Epoche | ρ | Spannweite | Jahre < 1× |
|---|---|---|---|
| 1350 | +0,591 | 0,000 | 0/14 |
| 1600 | +0,231 | 0,000 | 0/14 |
| 1884 | +0,393 | 0,000 | 1/14 |
| 1970 | +0,275 | 0,000 | 0/14 |

**Wellenziel bei vierzehn Braujahren erreicht.** Drei Messungen — Builder,
blinder Kritiker, Aufsicht — kommen auf dieselben Ziffern.

**DER KLANG:** die dritte Latte trägt zum ersten Mal den *Vorgang* statt der
Kulisse (still 12/12 → 2/12, gespielt 3/12 → 7/12). Ursache war, dass **sieben
Tonproben nicht enthielten, was ihr Name verspricht** — `abfahrt1`, die
Ochsenfuhre von 1350, war Wasserplätschern; DIE FUHRE hatte in drei von vier
Epochen gar keinen Abfahrtsklang. Offen: Auflage 4, der Gegenzug ist nur in
1350 hörbar.

**DER PREIS:** beide Auftragsfragen fielen zugunsten des Baus — der Zähler war
nie blind, der Kassenboden liegt in 0 von 1.680 Wochen auf null. Sieben neue
Sprossen gegen die leere Festlegungstafel: Michaelitage ohne bezahlbare
Festlegung 11/12/11/8 → **7/8/9/7**. Offen: KERN `welt.js:412`.

**Was in dieser Welle über das MESSEN gelernt wurde** — vier Werkzeuge waren
kaputt, alle vier haben *geschwiegen statt zu scheitern*:
1. `hoerer.py --blind` mischte nicht, sondern unterstellte 1,2,3,4.
2. `messstand.sh` wechselte den Hafen nie (`ss` fehlt, `set -e` bricht still ab).
3. `wiederaufnahme.sh` meldete „origin ist auf Stand", ohne zu holen.
4. Der Lebenszeichen-Test der Aufsicht lag dreimal daneben — erst sortierte er
   Zeichenketten, dann glaubte er Dateizeiten, dann kürzte er die Prozessliste.

> **Ein Messgerät, das im Fehlerfall nichts sagt, ist gefährlicher als keins.**
> Alle vier sind repariert und mit einer Gegenprobe belegt.

Dazu: **sequenziell messen, nie parallel** — vier gleichzeitige Browser lieferten
ρ +0,354 statt +0,393. Sequenziell streut dieses Spiel **gar nicht**.

---

## OFFENER BEFUND AM MASSSTAB SELBST — die Wellenzahl hängt an der Laufzeit

**Gemeldet vom blinden Kritiker DER PREIS in der Nacht zum 4. August**, gemessen
an `6b59a18`, dieselbe Reihe, Epoche 1:

| Michaelitage | 13 | 14 | 15 |
|---|---|---|---|
| ρ Spearman | **+0,692** | **+0,591** | **+0,421** |

Der von der Aufsicht als erreicht gemeldete Stand **+0,591 ist der Wert bei
vierzehn Michaelitagen** — das sind die 400 Wochen des Vorbilds
`preis-linie.mjs`. Bei dreizehn steht dieselbe Partie auf **+0,692**, also
**acht Tausendstel unter der Latte**.

> **|ρ| < 0,7 wird in 1350 nicht mit Abstand bestanden, sondern mit der Wahl der
> Laufzeit.** Das gehört ab jetzt neben jede Zahl geschrieben, die diese Latte
> nennt — auch neben die Meldung „Wellenziel erreicht".

**Was daraus folgt und noch nicht entschieden ist:** die Latte braucht eine
festgelegte Zählweise, sonst misst jeder Lauf etwas anderes. 400 Wochen sind
eine Konvention aus dem ersten Messgerät, kein Argument. Wer sie festschreibt,
begründet sie — oder die Latte wird über mehrere Laufzeiten gemittelt und die
Spannweite mitgenannt. **Das ist keine Aufgabe für einen Builder, sondern für
die Aufsicht und den Auftraggeber**, weil es die Messlatte ändert und nicht das
Spiel.

Der Kritiker hat im selben Abschnitt außerdem bestätigt: **sequenziell gemessen
streut dieses Spiel gar nicht.** Wer Streuung meldet, misst seinen Browser.

---

## RICHTUNGSENTSCHEIDUNG DES AUFTRAGGEBERS, 3. August 2026 — DER EPOCHENBOGEN

**Das Spiel soll nicht über Jahrhunderte laufen.** Stattdessen Epochen nach Art
von **Civilization VII**: jede mit eigenen Eigenschaften, mit einer Übergabe, die
Motivation trägt (man fängt nicht bei 0 an), und einem Zurücksetzen, das Raum
schafft. Dazu die Fragen: was wird übernommen, was zurückgesetzt, was sind gute
Ziele je Epoche, gibt es Technologiebäume oder Errungenschaften.

Der Auftraggeber hat ausdrücklich ergänzt: **die Kritik an Civ 7 ist zu
berücksichtigen** — teils sei sie Gewohnheit aus den Vorgängern, und wir bauen
ein neues Spiel ohne diese Vorgeschichte.

**Alles Recherchierte, Gemessene und die offenen Fragen stehen in
[`gauntlet/EPOCHENBOGEN.md`](../gauntlet/EPOCHENBOGEN.md).** Dort auch: was Civ 7
behält und was es fallen lässt, die fünf lautesten Kritikpunkte, was Firaxis
davon mit dem „Test of Time"-Update vom 19. Mai 2026 selbst kassiert hat (den
erzwungenen Identitätswechsel — die Zeitalter blieben), und welche Kritik uns
strukturell trifft und welche nicht.

**Die Antworten stehen dort NICHT, mit Absicht.** Das Papier ist ein Auftrag für
den Loop. Wer die Antworten hineinschreibt, hat den blinden Kritiker abgeschafft.

**Empfehlung der Aufsicht, im Papier begründet:** eigene Welle, ein Stück, und
der erste Auftrag ist **messen, nicht bauen** — (A) wie lange trägt eine gut
geführte Partie wirklich, und (F) warum werden die vorhandenen unwiderruflichen
Festlegungen in 14 Jahren nur 1/1/0/0 mal genommen, obwohl acht möglich wären.
Ein zweiter ungenutzter Baum neben dem ersten hilft niemandem.

**Nicht in Welle 4 einbauen.** Die Änderung berührt `kern/uhr.js`, `kern/welt.js`
und fünf Stücke zugleich; Welle 4 hat vier offene Stücke und die Wellenzahl ist
nicht erreicht.

### NACHTRAG 4. August — Frage (G) und das fünfte Zielbild

Der Auftraggeber hat gefragt, ob eine weitere Epoche fehlt, weil sich seit 1970
viel geändert hat. Die Aufsicht hat gemessen statt entworfen, Befund in
`EPOCHENBOGEN.md` §4 (G):

| | |
|---|---|
| Epoche IV beansprucht **1914–2025** | `kern/welt.js:39` |
| ihr Schaujahr ist **1970** | dito |
| eine Partie trägt 3–14 Braujahre | Messung 3.8. |
| ⇒ **kein Spielstand erreicht je ein Jahr nach ~1984** | Rechnung aus beidem |

`KONZEPT.md` trägt den Befund im eigenen Korrekturteil längst: *„Bedeuten ist das
Kernverb der Gegenwart, nicht der 1970er — was zugleich erklärt, warum Epoche IV
in allen sechs Entwürfen nur Epoche III mit anderer Typografie war."* Die Frage
ist deshalb nicht „hängen wir eine fünfte an", sondern ob Epoche IV **zwei Verben
trägt und darum zu groß ist**. Kosten gezählt, damit niemand „ist ja nur eine
Zeile" sagt: **25 Datentabellen in acht Dateien** tragen einen Schlüssel `4:` und
fallen per `|| [4]` **still** zurück; dazu vier Stellen in `kern/ton.js`.

**Gebaut wurde davon nichts.** Was es gibt, ist die Latte dafür:
**`zielbild/05-2025.jpg`** — derselbe Ort in der Gegenwart. Drei Würfe, alle drei
im `zielbild/README.md` verzeichnet; der erste ging gegen den Stilanker `03-1884`
und **baute die Stadtmauer wieder geschlossen auf**. Deshalb ist dieses eine
Blatt von `04-1970.jpg` abgeleitet: die Gegenwart schreibt 1970 fort.

Zwei Nebenbefunde aus derselben Arbeit, beide im `zielbild/README.md`:
1. Der Nachbesserungsschritt hat zwei Schilder zerwürfelt (Kirche → „CU NEHKER",
   „BRAUEREI ADLER" verschwunden). **Bewusst nicht nachgewürfelt** — ein vierter
   Wurf setzt die Kopfleiste und vier korrekte Schilder aufs Spiel. Dieselbe
   Abwägung wie bei „GEGR. 1356" im 1884er Blatt.
2. **Die HUD-Zahlen der Zielbilder stimmen nur bei zwei von vier** mit
   `kern/welt.js:140` überein — 1350 und 1884 ja, 1600 und 1970 nein. Genau die
   beiden, die damals neu erzeugt wurden. Sie sind Anschauung, keine
   Spezifikation; wer sie für Startwerte hält, irrt.

**Ein PR lässt sich für diesen Zweig nicht mehr anlegen.** GitHub lehnt ab:
*„has no history in common with `claude/project-setup-apis-p51a0f`"*. Die
Wurzel-Commits sind verschieden (`cf4a54e` gegen `1a3badd`); PR #2 war noch
möglich und wurde am 3.8. ohne Merge geschlossen. Reparieren ginge nur mit
`merge --allow-unrelated-histories` oder einem Rebase auf die fremde Wurzel —
beides schreibt die Laufgeschichte um und ist **nicht** die Entscheidung der
Aufsicht. Dem Auftraggeber gemeldet, unangetastet gelassen.

---

## WELLE 4 IST DURCH — DAS WELLENZIEL IST ERREICHT (3. August 2026, abends)

**Von der Aufsicht selbst nachgemessen**, zwölf Läufe à 400 Wochen auf dem
**eingefrorenen HEAD `1b5ab7a`**, je drei pro Epoche, mit dem load-festen Gerät
`werkbank/schuss/rueckkopplung-r3/linie.mjs`. Rohdaten und Befund in
`werkbank/schuss/aufsicht/welle4-schluss/`.

| Epoche | ρ (drei Läufe) | Spannweite | Start → Ende | Jahre < 1× | Seitenfehler |
|---|---|---|---|---|---|
| 1350 | +0,591 ×3 | **0,000** | 5,89 → 8,20 | 0/14 | 0 |
| 1600 | +0,231 ×3 | **0,000** | 3,76 → 3,22 | 0/14 | 0 |
| 1884 | +0,393 ×3 | **0,000** | 8,35 → 5,18 | 1/14 | 0 |
| 1970 | +0,108 ×3 | **0,000** | 2,25 → 4,26 | 0/14 | 0 |

**|ρ| < 0,7 in allen vier, höchstens ein Jahr von sechs unter 1× — erreicht.**

**Was damit NICHT erledigt ist**, damit niemand die Welle für geschlossen hält:
- **Keine der drei Nacharbeiten ist blind geprüft.** Builder haben ihre eigene
  Arbeit gemessen, die Aufsicht hat die Kernzahlen nachgemessen — ein blinder
  Kritiker hat die *nachgearbeiteten* Stücke noch nicht gespielt.
- **DER KLANG, Auflage 1 offen**: der Gegenzug ist hörbar, aber das Ohr trifft
  die Sekunde nur 1 von 4. Der Builder sagt das selbst.
- **DER PREIS ist in dieser Welle nie gelaufen** — `preis*.js` war durchgehend
  belegt. Der Festlegungszähler und der Kassenboden stehen weiter offen.
- **Zwei KERN-Änderungen liegen bereit** (unten), einzuarbeiten, wenn kein Agent
  mehr läuft.

**Befund über die Methode: parallele Nacharbeiten setzen sich nicht zusammen.**
Der Builder meldet für 1350 **+0,288**, die Aufsicht misst **+0,591**. Beide
stimmen — auf verschiedenen Bäumen. Letzter `preis.js`-Commit war 15:36;
`sud-daten.js` mit der neuen Achse DAS BRAUWASSER (30 Pf, unwiderruflich) kam
15:55, und `sud.js:2179` speist über `meldeZug` in genau dieselbe Kennzahl.

> **Regel:** Zwei Stücke, die dieselbe Kennzahl füttern, nicht gleichzeitig
> nacharbeiten lassen. Und die Zahl, die zählt, ist die des **zusammengeführten**
> Baums — den spielt man.

**Zwei KERN-Änderungen, gemessen begründet, warten auf die Aufsicht:**
1. **`kern/buehne.js`, eine Zeile**: `k.setAttribute('data-soll-aus', opt.aus ? '1' : '0')`
   in `B.knopf()`. Erreicht gemessen 94/102 · 102/112 · 106/116 · 98/107 aller
   Züge und **alle** heute ungeklärten — löst den Messlatten-Befund unten, ohne
   dass ein Stück etwas ändert. Vorgeschlagen von DER SUD.
2. **`kern/welt.js`**: `zugDeckung()` gibt `null`, wenn die eine gehaltene
   Meldung durch die Prüfung fällt, statt auf den nächstbesten Zug
   zurückzufallen — gemessen 18 von 4.800 Wochen. Dazu prüft `welt.js:503` nur
   `el.disabled`, nicht Sichtbarkeit. Vorgeschlagen von DIE RÜCKKOPPLUNG.

---

## WELLE 4, DIE RÜCKKOPPLUNG r2 — 1600 geheilt, 1350 dafür gerissen (BERICHTIGT)

**Die Überschrift dieses Abschnitts war falsch, und der Befund darin auch.**
Gegenprobe mit dem load-festen Gerät auf dem **alten** Stand `da7d690`:
**+0,701, zweimal identisch.** 1350 riss also **schon vorher**; die alte Messhand
hat es verdeckt. Die Runde hat 1350 nicht gebrochen, sondern von +0,701 auf
+0,591 gebessert. Der Abschnitt bleibt als Beleg stehen, wie eine Messung ohne
Gerätekontrolle in die Irre führt.

**Von der Aufsicht selbst nachgemessen**, am eingefrorenen Commit `da7d690`
(Hafen 8900, `werkbank/schuss/aufsicht/messstand.sh`), NICHT am Arbeitsbaum —
dort schrieben noch zwei Builder. Je 400 Wochen, `saat=1350`, 0 Seitenfehler in
allen Läufen. ρ ist Spearman.

| Epoche | vor der Runde | drei eigene Läufe danach | Urteil |
|---|---|---|---|
| **1350** | 5,89 → 2,69 · max 7,88 · **−0,152** | 5,89 → 9,20 / 27,64 / 12,94 · max **41,67** · **+0,701 / +0,785 / +0,789** | **REISST** |
| 1600 | 3,76 → **27,81** · max 67,33 · **+0,873** | 3,76 → 1,95 / 3,25 / 2,32 · max 12,67 · **−0,319 / +0,218 / +0,214** | geheilt |
| 1884 | 8,35 → 2,06 · **+0,143** | 8,35 → 5,18 · max 9,40 · **+0,393** · 1/14 unter 1× | besteht |

**Der Fehler ist umgezogen, nicht behoben.** Der Builder hat 1350 als
„identisch, Ziffer für Ziffer" gemeldet. Das ist widerlegt: drei unabhängige
Läufe, alle drei über der Latte. Der blinde Kritiker kam unabhängig zum selben
Schluss („1600 ist geheilt. 1350 ist dabei nach oben davongelaufen"), bevor die
Aufsicht ihre Zahlen hatte — zwei Wege, ein Befund.

> **MESSREGEL: EIN LAUF TRÄGT KEIN URTEIL.** Mindestens drei Läufe je Epoche,
> Spannweite mit angeben.
>
> **BERICHTIGT am 3.8. abends — die Begründung, die hier stand, war falsch.**
> Ursprünglich stand hier: „Drei Läufe desselben Standes streuen über 0,54 in ρ,
> das Spiel würfelt." **Es würfelte nicht das Spiel, sondern die Messhand.**
> `eichung/preis-linie.mjs:80` sah nach jedem Klick genau einmal hin, mit fester
> Wartezeit; unter Last war der Knopf noch nicht neu gezeichnet, der Klick fiel
> ersatzlos aus, das Haus braute ein Jahr weniger, und die ganze Partie lief
> anders. Mit `rueckkopplung-r3/linie.mjs`, das bis zu sechsmal hinsieht und auf
> einen echten Bildaufbau wartet: **Spannweite 0,000 über zwölf Läufe.**
> Gefunden hat das der Builder, nicht die Aufsicht.
>
> **Die Regel bleibt, ihr Zweck kehrt sich um:** drei Läufe sind eine
> **Kontrolle des Geräts**. Wer jetzt Streuung misst, hat ein kaputtes Messgerät
> und soll es suchen, statt die Streuung hinzunehmen.

> **ERWEITERUNG, 4. August 14:22 UTC — DIE REGEL BINDET AUCH DIE BUILDER
> UNTEREINANDER, und niemand erzwingt das.** Beim Selbst-Check gefunden: DIE
> FUHRE fuhr `linie.mjs 4 400` (13:20 min gelaufen) und DER SUD gleichzeitig
> `sudhand.mjs 4 400` (8:42 min), Load average 3,8. **Jeder für sich sequenziell
> — zueinander parallel.** Genau die Bedingung, die unten mit Zahlen belegt ist.
> Die Regel war bisher an die Aufsicht adressiert („nicht selbst messen, solange
> ein Kritiker misst"); dass **zwei Builder derselben Welle** einander die
> Messung verderben, stand nirgends, und der Wellenplan trennt sie nicht.
>
> **Was die Aufsicht getan hat:** beide Läufe *nicht* abgebrochen (das hätte 22
> Minuten Messung vernichtet), sondern beiden Buildern die Bedingung gemeldet
> mit drei Punkten — laufen lassen, die Zahlen aus diesem Satz **nicht** als
> Belegzahl nehmen, den Satz wiederholen, sobald der andere fertig ist. Dazu die
> Trennung, was überhaupt betroffen ist: **alles, was an einer Klickfolge über
> viele Wochen hängt** (ρ, Wochenzählungen, Trefferquoten über 400 Wochen) — und
> was nicht: statische Ablesungen, Knopf- und Schriftgrößen, ein einzelner
> Bildschirm in Woche 1, der Byte-für-Byte-Vergleich der ersten Latte.
>
> **Für den nächsten Wellenplan:** zwei Stücke, die beide eine
> 400-Wochen-Messung brauchen, gehören nicht gleichzeitig in die Welle — oder
> die Welle gibt ihnen getrennte Messfenster. Sonst ist die Zahl am Ende der
> Runde nicht die des Spiels, sondern die der Maschine.
>
> **NACHTRAG 15:22 UTC — die Meldung hat nicht gereicht, jetzt gibt es eine
> Sperre.** Beide Builder haben auf die Meldung richtig reagiert und ihren Satz
> wiederholt. Eine Stunde später überlappten die *Wiederholungen* erneut: DIE
> FUHRE fuhr `linie.mjs 4 400`, DER SUD `linie.mjs 2 400`. Das ist kein
> Ungehorsam, das ist die Lage — **jeder wartet auf den anderen, keiner hat den
> Vortritt, und eine Bitte ist kein Schiedsrichter.**
>
> Deshalb **`werkbank/schuss/aufsicht/messfenster.sh`**: führt den übergebenen
> Befehl unverändert aus, sobald das Fenster frei ist, und blockiert solange ein
> anderer misst (`flock` auf `werkbank/.messsperre`, in `.gitignore`).
>
> ```
> HAFEN=8961 werkbank/schuss/aufsicht/messfenster.sh \
>   node werkbank/schuss/rueckkopplung-r3/linie.mjs 4 400 /tmp/e4.json
> ```
>
> **Gegen beide Fälle geprüft, bevor es verteilt wurde** — die Regel aus Welle 5,
> dass ein Messgerät im Fehlerfall nicht schweigen darf, gilt auch für dieses:
> der zweite Aufruf wartet wirklich (belegt → frei nach 4 s), und bei Zeitablauf
> misst er **nicht**, sondern endet mit Code 75 und nennt per `fuser`, wer das
> Fenster hält. Voreingestellt sind 90 Minuten (`MESSFENSTER_WARTE`).
>
> **Kein Ersatz für sequenzielles Messen innerhalb eines Satzes.** Wer vier
> Epochen misst, ruft es viermal nacheinander auf — nicht viermal gleichzeitig
> und hofft auf die Sperre. Das liefe zwar, aber die Wartezeit stünde im falschen
> Prozess und niemand sähe mehr, wer worauf wartet.

> **ZWEITE MESSREGEL, 3. August spätabends: SEQUENZIELL MESSEN, NIE PARALLEL.**
> Gemeldet von DER PREIS und mit Zahlen belegt: dieselbe Hand lieferte bei
> **vier gleichzeitigen Browsern** ρ **+0,354 statt +0,393** und **+0,305 statt
> +0,108**. Vier Browser auf vier Kernen sind ein kaputtes Gerät — die Klicks
> fallen unter Last aus, und genau davon lebt die gemessene Partie.
>
> **Das bindet auch die Aufsicht, und zwar doppelt:** eigene Läufe immer in
> einer Schleife, nie im Hintergrund nebeneinander. **Und: nicht selbst messen,
> solange ein Kritiker oder Builder misst** — sonst verdirbt man beide
> Messungen zugleich und merkt es an keiner. Wer nachmessen will, wartet, bis
> der Agent fertig ist, und misst dann am eingefrorenen Stand.
>
> *(Die zwölf Läufe der Aufsicht vom 3.8. abends liefen in einer Schleife, also
> sequenziell — die Zahlen +0,591 / +0,231 / +0,393 / +0,108 stehen. Der erste
> Satz desselben Abends hatte zeitweise zwei Browser nebeneinander; alle drei
> 1350-Läufe ergaben dennoch exakt +0,591, auch die nach dem Ende der
> Parallelität.)*

---

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

**DIE ENTSCHEIDENDE ZAHL — die sorgfältig gespielte Linie**, von der Aufsicht am
Stand `ee1715b` selbst nachgefahren (`werkbank/schuss/eichung/preis-linie.mjs`,
vier Läufe zu je 400 Wochen, 14 Jahre, 0 Seitenfehler):

| Epoche | Start → Ende | min–max | rho | Jahre unter 1× | Latte |
|---|---|---|---|---|---|
| 1350 | 5,89 → 2,69 | 0,75–7,88 | **−0,152** | 1 von 14 | **besteht** |
| 1600 | 3,76 → **27,81** | 2,27–**67,33** | **+0,873** | 0 von 14 | **reißt** |
| 1884 | 8,35 → 2,06 | 0,63–10,18 | **+0,143** | 1 von 14 | **besteht** |
| 1970 | 2,25 → 2,54 | 0,81–6,53 | **−0,112** | 1 von 14 | **besteht** |

**Drei von vier bestehen jetzt beide Kriterien.** Vor Welle 3 stand 1350 bei
−0,795 (6 von 12 Jahren unter 1×), 1884 bei −0,367, 1970 bei −0,572 mit 9 von 11.
Jetzt hat **keine** Epoche mehr als ein Jahr von vierzehn unter 1×.

**Und 1600 ist gekippt — in die andere Richtung.** Es war das einzige, das in
Welle 2b sauber bestand (+0,165). Jetzt läuft die Leiter von 3,76 auf 27,81 und
in der Spitze auf **67,33×** davon: die Barschaft wächst schneller als die Preise.
Das ist wörtlich der Patrizier-IV-Fall aus der Messlatte, nur diesmal in 1600
statt überall. **Das ist der Befund für die nächste Welle:** die Rückkopplung
wirkt in drei Epochen und fehlt in der vierten nach oben.

(Der sparsame Stil sagt weiter −0,775 bis −1,000 — aber ein Haus, das nichts tut,
muss fallen; dieser Stil ist der Randfall, nicht das Urteil. `klug.mjs` in
`werkbank/schuss/erbe3/` ist NICHT diese Linie, sondern DAS ERBE's Skript für
Erbfälle.)

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
