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

## 3 — Der Ton: dreißig Sekunden ohne Bild

> Ein fremdes Ohr — Gemini nimmt Audio entgegen — hört dreißig Sekunden Spielton **ohne
> jedes Bild** und soll Epoche und Vorgang benennen. Rät es falsch, geht die Arbeit zurück.

Billig, blind, falsifizierbar. Sie misst genau das, was Musik und Effekte hier leisten
müssen: dass 1350 nicht klingt wie 1970, obwohl es derselbe Hof ist.

## Sperrliste — keine Latte

> Der Braukessel ist eine **offene Pfanne** und keine Destillierblase. Emailschilder gibt es
> erst ab den 1890ern. Ein Marktanteil wird auf die **eigene** Gesamtmenge bezogen.
> Ein Fund dieser Art **disqualifiziert** einen Durchgang, gewinnt ihn aber nie.

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
