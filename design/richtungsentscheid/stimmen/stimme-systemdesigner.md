# Stimme — Der Systemdesigner: Architekturen statt Prototypen

Grundlage: `KONZEPT.md`, der Fuhre-Vorschlag (`design/vorschlag-fuhre/VORSCHLAG.md`) und
mein eigenes Votum über den Klickdummy (`prototyp/VOTUM-SPIELDESIGNER.md`). Der
Auftraggeber hat zwei Prototypen für nicht gelungen erklärt und den Eishockeymanager als
Leitbild genannt — Saison, Spieltag, Tabelle, Kader, Transfermarkt, Nachrichten,
WEITER-Knopf. Ich prüfe das nicht als Geschmacksfrage, sondern als Architektur.

**Mein Maßstab, damit man mich nachprüfen kann.** Vier Fragen, sonst nichts:

1. **Läuft eine Uhr, die ohne mich weiterläuft?** Nicht: Ist ein Zeitband gezeichnet.
   Sondern: Bewegt sich die Welt schon dann, wenn ich nur bestätige?
2. **Kostet die Bedienung etwas?** Ein Zug, der nichts verbraucht und sich zurücknehmen
   lässt, ist eine Ansicht.
3. **Kann ich verlieren, ohne Fehler zu machen — und wo kommt der Gegner her, der das
   erzwingt?** Aus der Struktur des Formats, oder aus einem Skript, das jemand schreiben
   und für immer füttern muss?
4. **Wo kommt die Geschichte her?** Aus Zahlen, die steigen und fallen — oder aus Text,
   der irgendwann alle ist?

---

## 1. Der verdrängte Widerspruch: „Kein Excel" war ein richtiger Befund mit falscher Therapie

KONZEPT §3 verbietet: „Kein Excel. […] Kein Reiter heißt ‚Produktion'." Zwei Absätze
davor, in §2, steht als erstes Vorbild der **Eishockey Manager**, und der Satz, mit dem
das Konzept ihn preist, ist selbst eine Tabellen-Hymne: „Niemand erzählt dir, dass dein
Torwart schlecht ist — du siehst es an der Tabelle." Das Konzept hat also von Anfang an
ein Tabellenspiel zum Vorbild erklärt und Tabellen verboten. Dieser Widerspruch wurde nie
aufgelöst, sondern ästhetisch übertüncht — Braubuch statt Reiter, Bierdeckel statt
Absatzspalte — und hat zwei Prototypen lang Arbeit dorthin gelenkt, wo das Problem nicht lag.

Denn was war am Klickdummy tot? Nicht die Tabelle. Die beste Zahl des ganzen Verfahrens
stand in einer: **210 · 180 · 140** bei der Krone, drei Jahre fallender Absatz (mein
Votum, 3.6). Tot war, dass die Reihe stand statt fiel — „Der Dummy zeichnet die Uhr und
lässt sie stehen" (3.2). Im Eishockeymanager ist exakt dieselbe Zeile lebendig, aus zwei
Gründen, die beide nichts mit Optik zu tun haben: Es gibt einen Spieltag, nach dem sie
sich ändert, und es gibt siebzehn andere Zeilen, die dasselbe wollen wie ich.
**Managerspiele sind Tabellen, die man lesen will, weil jede Zeile eine Drohung oder ein
Versprechen ist.** Man liest sie nicht trotz der Zahlen, sondern ihretwegen. Das Problem
war nie die Tabelle. Das Problem war die Tabelle ohne Uhr und ohne Gegner.

War „Kein Excel" also je richtig? Als Befund ja: Ein Reiter, der einen Zustand ohne
Folgen zeigt, ist wirklich tot. Als Therapie nein. Die Diagnose hätte lauten müssen
„keine Zahl ohne Uhr und Gegner"; sie lautete „keine Zahl ohne Kostüm". Das ist die
Fehldiagnose hinter der Kunstblatt-Sackgasse — der Fuhre-Vorschlag benennt ihre Folge
selbst: „Das gesamte Entwurfsfeld hat Bedienung planmäßig aus dem Bild verbannt" (§1),
und der Auftraggeber „saß davor und fand keinen ersten Zug". Wer jetzt den
Eishockeymanager verlangt, widerruft nicht das Konzept. Er widerruft dessen §3 mit
dessen §2.

## 2. Drei Architekturen, vier Fragen

**(a) Bühne/Blatt — die Fuhre.** An meinen ersten beiden Fragen besteht sie: Die
Wagenplätze sind knapp, das Fass auf dem Wagen ist die Entscheidung selbst, und der
Moment „Abschicken" ist bereits ein
WEITER-Knopf: „die Woche endet, wenn der Wagen abgeschickt wird" (§4), und
„währenddessen fährt der graue Wagen". Die Fuhre **ist** ein Managerspiel, das sich
nicht traut. Sie hat den Spieltag (Wagen los), die Nachrichten (Zettel), den
Saisonabschluss (Michaeli-Blatt). Ihr fehlen die Liga und die Tabelle: Der Adler ist ein
einzelner, halb geskripteter Gegner, keine Struktur — und die Geschichte ist ein
vorgebauter Fünfakter, also Text mit Verfallsdatum. Frage 3 und 4 bestehen hier nur,
solange jemand von Hand nachfüllt.

**(b) Der Bier-Manager.** Die Übersetzung kostet fast nichts, weil das Material sie
bereits enthält:

| Manager-Baustein | Liegt im Material bereit |
|---|---|
| Saison | Das Braujahr Michaeli–Georgi (KONZEPT §7, Uhr 2) — historisch gratis |
| Spieltag | Die Fuhrwoche, ~30 pro Saison (Fuhre-Vorschlag §4) |
| Tabelle | „Absatzorte sind endlich, benannt und belegbar. Wer dort ausschenkt, schenkt woanders nicht aus" (§13) — ein Nullsummenraum, also eine Rangfolge |
| Transfermarkt | „Der Wechsel heißt Ablösung […] jeder hat einen Preis, der mit den Vorleistungen des Wettbewerbers steigt" (§13) — das ist eine Ablösesumme; das Konzept hat einen Transfermarkt erfunden, ohne es zu merken |
| Kader | Erbfall, Braumeister, Fuhrmann (§4, §14) |
| Nachrichten | Die Zettel der Wirte (Fuhre-Vorschlag §3) |

Entscheidend ist Frage 1: **Diese Architektur erzwingt die Uhr von selbst.** Ein Blatt
konnte zweimal ohne Uhr gebaut werden — es sah trotzdem fertig aus. Ein Managerspiel ohne
Spieltag ist kein unfertiges Managerspiel, es ist gar keines; man kann den ersten
Bildschirm nicht bauen, ohne dass WEITER etwas tut. Ebenso Frage 3: Die Tabelle
existiert nicht mit einer Zeile, also erzwingt das Format mehrere Konkurrenten nach
denselben Regeln — genau die „Häuser wie deines" aus §13. Und Frage 4 beantwortet das
Konzept selbst: „Die Geschichte entsteht aus Zahlen, nicht aus Text" (§2) — der
Saisonverlauf schreibt die Chronik, niemand muss sie dichten.

**(c) Der PR-Manager.** Strukturell denkbar: Etats statt Zapfhähne, Pitches statt
Spieltage, ein Agenturranking statt der Tabelle. Er scheitert an zwei Stellen. Erstens am
Punktestand: Eishockey zählt Tore, Bier zählt Hektoliter und belegte Hähne — beides
zählbar ohne Meinung. Der Punktestand einer PR-Agentur ist Wahrnehmung; das Spiel müsste
die öffentliche Meinung simulieren, um den eigenen Score auszurechnen, und damit fällt
die Zahl vom Himmel — Verstoß gegen den ersten Leitsatz („Keine Zahl fällt vom Himmel",
§3). Die Markenstrategin sagt in §13: „Bedeutung ist keine Eigenschaft, sondern eine
Zuschreibung, die ausschließlich in fremden Köpfen existiert." Beim Bier ist das *eine*
Größe unter mehreren; bei PR ist es das gesamte Produkt. Zweitens der Materialverlust:
Saison von 1553, Ablösemarkt von etwa 1860, benannte Konkurrenten, die Ankerliste in §12
— alles wäre neu zu erfinden, ohne historisches Geländer. PR ist kein schlechteres
Thema. Es ist ein unbezahltes, während Bier ein bezahltes ist.

## 3. Die Epochenfrage, mechanisch

Epochen sind im Konzept die Antwort auf das Endgame-Problem: „Regeln kippen. […] Das ist
der Motor gegen das Endgame-Problem" (§3). Das Managerformat hat für dasselbe Problem
drei billigere Motoren: die **Saison** (jedes Jahr null Punkte — Vorsprung verfällt), den
**alternden Kader** (Bestände verfallen — meine dritte Prüffrage, serienmäßig eingebaut)
und den **Auf-/Abstieg** (man kann immer noch fallen). Alle drei liegen im Brauhaus schon
herum: Die Saison ist das Braujahr; der alternde Kader ist der Erbfall und der sterbende
Braumeister; die Ligen sind die Reichweitenringe — 6, 24, 60 Kilometer, und Aufstieg
heißt, dass das eigene Bier den nächsten Ring erreicht. Das Brauereisterben, in §13
korrigiert zum „Verdrängungskampf um Zapfhähne", ist wörtlich ein Abstiegskampf.

Braucht man die vier Epochen dann noch? Nicht als Bauauftrag. Das Konzept hat selbst
halb kapituliert: „Von vier Epochenbrüchen sind nur zwei echt" (§6), 19 von 30 Blättern
spielen in den 1880ern, Epoche II bekam ein einziges. Und §13 liefert das
Ausschlusskriterium: Der Ablösemarkt ist „eine Institution von etwa 1860"; in Epoche
I–II „kauft Geld keinen Zapfhahn direkt" — dort funktioniert die Manager-Ökonomie nicht,
weil die Währung nicht Geld ist. **Das Managerformat wählt seine Epoche selbst: Epoche
III, etwa 1860–1914** — die einzige, in der Saison, Transfermarkt und Tabelle
gleichzeitig historisch existieren. Sie enthält sogar ihren eigenen Regelbruch gratis:
Die Kühlmaschine tötet in den 1870ern das Braujahr (§7) — mitten in der Partie stirbt
die Saisonstruktur, ein Epochenbruch im Kleinen. Die übrigen Epochen
werden nicht gestrichen, sondern zurückgestuft: von der Weltarchitektur zur Ausbaustufe
nach bestandener Abnahme. Wenn zehn Saisons nicht tragen, hätten uns auch vier Epochen
nicht gerettet — es wären dieselben fünf Jahre in vier Kostümen gewesen.

## 4. Urteil — die drei Fragen, ausdrücklich

**Thema: Bier.** Der Punktestand ist zählbar ohne Meinung, die Saison ist historisch
belegt, der Transfermarkt ist im Marktmodell bereits erfunden, und zwei Jahre Recherche
(§12, §13, REFERENZEN) sind bezahltes Material. PR müsste all das erfinden und bekäme
dafür einen Score, der vom Himmel fällt. Wenn der Auftraggeber PR will, soll er es als
eigenes Projekt wollen — nicht als Umlackierung dieses.

**Format: Manager.** Saison, Spieltag, Tabelle, Ablösemarkt, Zettel-Nachrichten,
WEITER-Knopf als tragende Struktur. Die Fuhre wird dabei nicht verworfen, sondern
eingebaut: Sie ist der Spieltagsbildschirm — „Bericht und Handlung sind zwei Formate,
und sie wechseln sich ab" (Fuhre-Vorschlag §3) bleibt richtig, nur darf der Bericht
jetzt eine Tabelle sein, in der man fällt. Ob die Tabelle ein 1884er Kostüm trägt, ist
die Frage des Gestalters; meine Frage ist, ob sie sich bewegt.

**Epochen: eine feste Zeit, 1860–1914**, mit dem Kühlmaschinenbruch als eingebautem
Regelkipper; alles davor und danach als spätere Ausbaustufe.

**Die eine Mechanik, die ich zuerst baue — egal welches Thema gewinnt: die Tabelle, die
sich gegen mich bewegt.** Acht Häuser (Brauereien oder Agenturen), sechzig Adressen
(Zapfhähne oder Etats), ein WEITER-Knopf. Jede Woche verteilen alle acht nach denselben
Regeln, dann wird die Rangfolge neu gerechnet. Prüfstein, vorher benannt: Wer zehnmal
WEITER drückt, ohne sonst etwas zu tun, fällt von Platz drei auf Platz sechs — und kann
in den Zeilen ablesen, an welche zwei Konkurrenten er welche Adressen verloren hat. Erst
wenn das steht, lohnt jede Debatte über Kostüme.

## Der Preis meines Urteils

**Erstens:** Das Versprechen aus §1 — „ein Haus über sieben Jahrhunderte" — wird zur
Fernhoffnung. Klosterweg, Grutkonflikt, Säkularisation: vorerst gestrichen. Wer das
Projekt wegen des Bogens liebt, verliert ihn, und ich kann nicht garantieren, dass er je
zurückkommt.

**Zweitens:** Das Managerformat macht die Fünf-Sterne-Messlatte nicht niedriger, sondern
schärfer. Wer „Eishockeymanager" sagt, wird mit den besten des Genres verglichen. Eine
halbe Liga ist dort sofort als halbe Liga erkennbar; das Kunstblatt konnte Unfertigkeit
besser verstecken.

**Drittens:** Die Bühne wird zur Ansicht degradiert. Der Fuhre-Vorschlag wollte sie als
Hauptformat; bei mir ist sie ein Bildschirm unter mehreren, und ihre Animationsarbeit
konkurriert ab sofort mit dem WEITER-Takt ums Budget. Der Gestalter wird das als Verrat
lesen, und er hat halb recht.

**Viertens, ehrlich:** „Kein Excel war eine Fehldiagnose" ist ein Urteil, das meiner
eigenen Zunft nützt — es macht Systeme zur Hauptsache und das Bild zur Zutat. Man lese
es in diesem Wissen.

## Die Schlussfrage — ein Satz

> **Baut zuerst die Tabelle, in der man fallen kann, während man nichts falsch macht —
> wenn acht Brauereien und ein WEITER-Knopf das nicht hergeben, rettet euch kein Thema,
> kein Kostüm und keine Epoche.**

*Gezeichnet: der Systemdesigner. Beurteilt wurden Architekturen, nicht Vorlieben.*
