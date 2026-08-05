# Die Messlatte

Gewählt nach Shumers Meta-Prompt-Verfahren: Ziel und mögliche Referenzen wurden einem
frischen Modell vorgelegt, das die Latte selbst wählen und in je einem Satz begründen musste.
Der Artikel steht daneben unter
[`artikel-somethingbig-gauntlet-loop.txt`](artikel-somethingbig-gauntlet-loop.txt), der
Original-Prompt unter [`claude-of-duty-prompt.md`](claude-of-duty-prompt.md).

**Eine Latte reicht nicht, und zwar nachweislich nicht.** Dieses Projekt hat bereits
achtundvierzig sehr gute Bilder und zwei durchgefallene Prototypen hervorgebracht. Der
Spielekritiker hat den Befund in einem Satz festgehalten: *„Die Bildsprache ist dreimal
entschieden, das Spiel einmal noch nicht."* Wer jetzt nur gegen Pixel misst, bekommt genau
das noch einmal, nur diesmal in Bewegung.

Also drei Latten und eine Sperrliste. Alle vier sind Dinge, die ein Agent tatsächlich in die
Hand nehmen kann.

---

## 1 — Das Bild: die vier Blätter in `zielbild/`

> Ein Playwright-Bildschirmfoto des laufenden Spiels wird **blind** neben das Zielbild
> derselben Epoche gelegt, und solange ein Fremder das Zielbild wählt, geht die Arbeit
> zurück an den Builder.

Das ist die exakte Stelle, an der bei *Claude of Duty* die Call-of-Duty-Screenshots standen:
das Bild eines Spiels, das es noch nicht gibt, gegen das Bild eines Spiels, das es gibt. Die
Latte ist abgenommen, sie ist vierfach, und sie trägt damit die härteste Einzelforderung des
Auftrags: **Die Stadt muss über 620 Jahre wachsen, ohne den Ort zu wechseln.**

Die in [`../zielbild/README.md`](../zielbild/README.md) verzeichneten Textzerfälle gehören
nicht zur Latte — im gebauten Spiel ist Text echter Text.

## 2 — Das Spiel: der zwanzigminütige Prüfstand, mit *einer* Kurve

> Ein frischer Kritiker spielt den laufenden Build je Epoche zwanzig Minuten mit der Maus
> und zählt **am Bildschirm, nicht im Quelltext**: Entscheidungen mit Preisschild
> nebeneinander, unwiderrufliche Festlegungen, und Züge des Gegners, die ohne ihn geschehen
> sind. Dazu trägt er die Barschaft gegen den Preis des nächsten sinnvollen Zuges auf.

Das ist die Latte, gegen die ein schönes, langweiliges Spiel verliert — und sie ist keine
Stimmung, sondern eine Zählung. Sie kommt vollständig aus dem eigenen Aktenbestand und
benennt vier Vorgänger, gegen die man **verlieren** kann:

| Was gezählt wird | Wogegen man verliert | Quelle |
|---|---|---|
| Barschaft ÷ Preis des nächsten sinnvollen Zuges, über die Partie aufgetragen | **Patrizier IV · Die Fugger** — die Wohlstandssingularität | `../design/jury/votum-kritiker.md` §2.2: *„die einzige Zahl, auf die es ankommt … steht in keinem der achtundvierzig Bilder"* |
| Zustände, die sich geändert haben, während der Spieler woanders hinsah | **Victoria 3 · Rise of Industry** — der Gegner, der nur ankündigt | ebd. §2.4; der Anstoss-Test des Veteranen |
| Optionen mit Preisschild nebeneinander, die einander ausschließen | **alle sechs eigenen Entwürfe**, die davon null hatten | `../design/feedback/persona-brettspieler.md` §1 |
| Verbliste je Epoche | **Civilization · Anno** — die Epoche als Kostüm | `votum-kritiker.md` §2.3 |

Der vierte Punkt ist der teuerste und deshalb der wichtigste: **Kommt in 1350, 1600, 1884 und
1970 dieselbe Verbliste heraus, ist das Spiel viermal dasselbe Spiel mit anderer
Typografie** — genau der Vorwurf, an dem hier schon drei Entwurfswellen gescheitert sind.

### Die Laufzeit gehört in die Zahl — nachgetragen am 4. August 2026

Die Kurve wird als ρ (Spearman) über die Braujahre gerechnet, und **ρ hängt
daran, wie viele Braujahre man zählt**. Vom blinden Kritiker DER PREIS gemessen
und von der Aufsicht unabhängig nachgestellt, dieselbe Reihe, nur anders
geschnitten:

| Epoche | 12 Braujahre | 13 | 14 |
|---|---|---|---|
| **1350** | **+0,762** | **+0,692** | +0,591 |
| 1600 | +0,371 | +0,264 | +0,231 |
| 1884 | +0,168 | +0,346 | +0,393 |
| 1970 | +0,427 | +0,154 | +0,275 |

**Bei zwölf Braujahren reißt 1350.** Und 1884 läuft in die *andere* Richtung —
es gibt also keine Laufzeit, die für alle vier die freundlichste wäre; wer eine
kürt, kürt sie für eine Epoche.

> **Ab jetzt bindend:** Wer ρ nennt, nennt die Laufzeit dazu, und misst über
> **alle drei Schnitte** (12, 13, 14 Braujahre). Die Latte ist gerissen, sobald
> **einer** davon über 0,7 liegt. Die 400 Wochen des ersten Messgeräts sind eine
> Konvention, kein Argument.
>
> **Nach dieser Regel ist das Ziel derzeit NICHT erreicht** — 1350 steht bei
> zwölf Jahren auf +0,762. Das ist strenger als die Meldung „Wellenziel
> erreicht" vom 3. August, und die Verschärfung ist beabsichtigt.

## 3 — Der Ton: dreißig Sekunden ohne Bild

> Ein fremdes Ohr — Gemini nimmt Audio entgegen — hört dreißig Sekunden Spielton **ohne
> jedes Bild** und soll Epoche und Vorgang benennen. Rät es falsch, geht die Arbeit zurück.

Billig, blind, falsifizierbar. Sie misst genau das, was Musik und Effekte hier leisten
müssen: dass 1350 nicht klingt wie 1970, obwohl es derselbe Hof ist.

## 4 — Die Lesbarkeit: auf dem Bildschirm, den die Leute wirklich haben

*Aufgenommen am 4. August 2026 auf Nachfrage des Auftraggebers. Bis dahin prüfte
keine der drei Latten, ob man das Spiel überhaupt lesen und treffen kann —
„Typografie" kam in diesem Papier genau einmal vor, und zwar als Spott.*

> Gemessen wird bei **1366×768**, nicht auf der Entwurfsleinwand. Keine Schrift
> unter **12 px**, kein aktiver Knopf unter **24×24 px**, kein abgeschnittener
> Text. Ein Riss geht zurück an den Builder.

**Warum 1366×768 und nicht die Referenz:** das Spiel ist auf eine Leinwand von
2752×1536 entworfen, und `--s` in `stil/grund.css:12` skaliert jede Schrift
proportional dazu herunter. Was im Entwurf 15 px ist, ist auf einem gewöhnlichen
Notebook 7 px. **Eine Latte, die auf der Entwurfsgröße misst, misst nichts.**

Erste Messung, `werkbank/schuss/aufsicht/lesbarkeit.mjs`, Epoche 1884:

| Fenster | kleinste Schrift | Knöpfe unter 24 px |
|---|---|---|
| 2752×1536 *(Entwurf)* | 10,0 px | **1** von 87 |
| 1920×1080 | 7,0 px | 40 von 87 |
| 1600×1000 | 5,8 px | 48 von 87 |
| **1366×768** | **5,0 px** | **64** von 87 |
| 1280×800 | 4,7 px | 65 von 87 |

Über alle vier Epochen bei 1600×1000: **1.800 Textknoten unter 12 px** (davon
1.427 unter 10 px), **77 abgeschnittene Kästen**, **189 von 334 aktiven Knöpfen**
unter der Zielfläche.

**Das ist ein Befund über EINE Zeile, nicht über 349 Regeln.** Kein einziges CSS
schreibt eine Größe unter 12 px; sie entstehen alle erst beim Zeichnen. Wer hier
baut, fasst zuerst `--s` an — und misst danach nach, ob die Bilder noch zu ihrer
Fläche passen.

> ### DIESE LATTE MISST OHNE ROLLLEISTE — ein Befund über sie selbst
>
> *Gemeldet vom blinden Kritiker DIE FUHRE am 4. August, von der Aufsicht im
> Quelltext nachgeprüft und bestätigt.*
>
> **`--hide-scrollbars` ist Playwrights eigene Startvorgabe**
> (`playwright-core/lib/server/chromium/chromium.js:284`) — niemand hat sie
> gesetzt, und niemand hat sie bemerkt. Damit ist **jede Zahl dieser Latte in
> einem Browser entstanden, der keine Rollleiste zeichnet**: die Erstmessung
> oben, die Zahlen der Builder und die Gegenmessung der Aufsicht gleichermaßen.
>
> Ein echter Browser nimmt rund 15 px Breite weg. Der Kritiker hat mit
> gezeichneter Rollleiste gemessen: `.fu-kerbsatz` (`fuhre-zusatz.css:178`,
> `line-clamp: 2`) schneidet bei **1366×768** in **1350 und 1884** seine dritte
> Zeile ab, bei 1280×800 sind es vier Kästen — alles Kästen, die ohne Rollleiste
> als passend gelten.
>
> **Folge, bis das Gerät repariert ist:** jede Zahl dieser Latte ist eine
> **Untergrenze**, kein Ergebnis. Wer sie zitiert, schreibt „ohne Rollleiste
> gemessen" dazu. Ein bestandener Wert beweist nichts.
>
> **Zweiter Fund am selben Gerät:** `lesbarkeit.mjs:26–32` prüft
> `overflow === 'hidden' || overflowY === 'hidden'`. Ein Kasten mit
> `overflow-y: hidden` und `overflow-x: auto` **rollt** und wird trotzdem als
> abgeschnitten gezählt. Die Überlaufzahlen sind dadurch nach oben verfälscht,
> während die Schriftzahlen nach unten verfälscht sind.
>
> **BEIDES REPARIERT am 5. August**, in dem Fenster, in dem kein Agent maß —
> und die Wirkung gemessen, nicht behauptet, am selben Baum und derselben
> Fenstergröße:
>
> | | Überläufe | Schrift < 12 px | Knöpfe < 24 px |
> |---|---|---|---|
> | ohne Rollleiste *(alt, `OHNE_LEISTE=1`)* | 92 | 1128 | 0 von 334 |
> | **mit Rollleiste** *(jetzt Vorgabe)* | **94** | 1128 | 0 von 334 |
>
> Die zwei zusätzlichen Kästen liegen in **1350 und 1884** — genau die beiden
> Epochen, die der Kritiker benannt hatte. Schrift- und Knopfzahlen bleiben
> gleich, wie sie müssen: eine Rollleiste ändert keine Schriftgröße.
>
> **Der Riss ist real, aber klein** — zwei Kästen, nicht zwei Dutzend. Beides
> gehört gesagt: dass das Gerät falsch maß, und wie viel es ausmachte.
> `OHNE_LEISTE=1` stellt das alte Verhalten her, nur um alte Zahlen
> nachzustellen, nie um neue zu erheben.

## Sperrliste — keine Latte

> Der Braukessel ist eine **offene Pfanne** und keine Destillierblase. Emailschilder gibt es
> erst ab den 1890ern. Ein Marktanteil wird auf die **eigene** Gesamtmenge bezogen.
> Ein Fund dieser Art **disqualifiziert** einen Durchgang, gewinnt ihn aber nie.
>
> **Neu am 4. August 2026: das Gewicht.** Ein Aufruf lädt derzeit **23 MB** in
> 85 Anfragen. Über Mobilfunk ist das eine halbe Minute Warten, bevor irgendetwas
> zu sehen ist. **Obergrenze 8 MB** für den ersten Aufruf; was darüber hinaus
> nötig ist, wird nachgeladen. Wie die Faktenfunde ist das ein **Veto**, keine
> Latte — es soll nicht nach unten optimiert werden, es soll nur die
> Peinlichkeit verhindern. *Nicht* betroffen ist das Tempo: gemessen 16,7 ms
> Bildzeit im Median in allen vier Epochen, p95 unter 22 ms, also volle sechzig
> Bilder je Sekunde (`werkbank/schuss/aufsicht/tempo.mjs`).

Bewusst Veto statt Latte: Der Auftraggeber will „fast lehrreich". Eine Faktenlatte würde
nach oben optimiert und machte aus dem Spiel ein Lehrmittel. Ein Veto verhindert nur die
Peinlichkeit. Die Fundliste steht in [`../design/PRUEFUNG.md`](../design/PRUEFUNG.md).

---

## Was bewusst nicht in den Prompt kam

**Die gesamte Jury-Empfehlung** — Erdlinie, Fuhre, Pfad 6 plus Pfad 4, die Abnahmekriterien
aus `VORSCHLAG.md` §8. Sie sind ausgezeichnet, und sie sind eine **Architekturvorgabe**.
Shumers Methode verbietet genau das, und der Auftraggeber hat das Material selbst zur
Referenz erklärt.

**Die Empfehlung, Epoche II als bloße Chronik zu behandeln.** Überstimmt: Der Auftraggeber
verlangt vier Epochen graphisch, und die Kostüm-Zählung aus Latte 2 ist das einzige Mittel,
das verhindert, dass daraus vier Tapeten werden.

**Jede Technik-, Umfangs- und Rundenzahl.**

## Wie dieser Lauf am wahrscheinlichsten scheitert

Die Bildlatte ist sofort messbar, die Spiellatte ist langsam — also wandert die Rechenzeit
ins Wimmelbild, und nach vielen Stunden steht ein prachtvoller, animierter Klickdummy da, in
dem nichts etwas kostet.

Der Mechanismus ist konkret: Der Spielkritiker muss ein reiches Zeigerspiel zwanzig Minuten
lang wirklich **bedienen**. Sobald Playwright daran scheitert, liest er stattdessen den
Quelltext oder die Zusammenfassung des Builders — und das ist die eine Sache, die Shumers
Verfahren ausdrücklich verbietet.

**Wer diesen Lauf beaufsichtigt, prüft zuerst, ob die Spielkritiken echte Klickprotokolle
enthalten.** Tun sie es nicht, misst der Lauf nur noch Pixel.

## Die Umgebung

- **Gesperrt:** Wikimedia, Library of Congress, Gallica, Europeana, David Rumsey, BSB, DDB,
  und `*.netlify.app`. Es lässt sich **kein einziger historischer Scan** holen; alles
  Bildmaterial entsteht im Lauf selbst.
- **Vorhanden:** Chromium und Playwright — ein Kritiker kann das laufende Spiel
  fotografieren, anklicken und echte Pixel prüfen
  ([`../werkbank/schuss.mjs`](../werkbank/schuss.mjs)).
- **Vorhanden:** `$GEMINI_API_KEY` und `$ELEVENLABS_API_KEY`, gekapselt in
  [`../design/tools/gen_image.py`](../design/tools/gen_image.py) und
  [`../design/tools/gen_audio.py`](../design/tools/gen_audio.py).
- **Vorhanden:** Netlify deployt den Branch automatisch — die eingecheckte Fortschrittsseite
  ist damit eine Live-URL.
