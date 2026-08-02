# Votum — Der Blattgestalter, über die gebaute Demo

> **Stand beim Schreiben.** Dieses Votum beurteilt `prototyp/demo/index.html` — den
> Fuhre-Prototyp vom 27. Juli, der nie abgenommen wurde. Es schließt damit eine offene
> Schleife, ist aber **keine Anweisung an den laufenden Build**: die Werkbank hat seither
> `spiel/` gebaut, vier Epochen, und mehrere der hier gemessenen Befunde sind dort
> konstruktiv erledigt (der Durst ist keine ±1-Schaukel mehr, sondern eine wachsende
> Größe; das Jahr endet, wenn kein Haus mehr übrig ist). Wo Auflagen unten den laufenden
> Build betreffen könnten, ist das eigens vermerkt. Der aktuelle Stand steht in
> `spiel/STAND.md`.


Grundlage: `prototyp/demo/index.html`, gerendert in 1600 × 950 und in allen Zuständen
angesehen, die ein Braujahr hergibt — Titel, Woche 1, beladener Wagen, Fahrt, ein umworbenes
Haus, ein verlorenes Haus, ein überfüllter Keller, das Michaeli-Blatt, der Ausblick.
Beurteilt wird, was im Bild steht, nicht was im Quelltext gemeint war. Das Votum des
Spieldesigners kenne ich; er beurteilt die Regel, ich das Bild. Wir treffen uns diesmal an
einer Stelle, und ich sage dazu, wo.

**Mein Maßstab, unverändert**, damit man mich gegen mein eigenes Votum zum Klickdummy prüfen
kann:

1. **Trägt die Zeichnung den Zustand?** Alle Schrift abdecken — weiß man dann noch, wie es
   steht?
2. **Ist die Entscheidung vor der Schrift lesbar?** Silhouette, Lage, Farbe in den ersten
   300 ms.
3. **Hält das Blatt seine eigenen Regeln?** Ein Raster, eine Bedeutung je Farbe, eine Physik.

---

## 1. Das Urteil, vorweg

| Prüfung | Urteil |
|---|---|
| 1 · Trägt die Zeichnung den Zustand? | **besteht für den Vorrat, fällt durch für die Gefahr.** |
| 2 · Ist die Entscheidung vor der Schrift lesbar? | **besteht** — und die Bühne glaubt es selbst nicht. |
| 3 · Hält das Blatt seine eigenen Regeln? | **fällt durch.** Rot bedeutet an einer Stelle das Gegenteil von überall sonst. |

Und der Satz, der über allem steht: **Die Bühne hat die Aufgabe gelöst, an der das Blatt
gescheitert ist — sie zeigt Knappheit als Ding und nicht als Zahl —, und verliert dann genau
die eine Auskunft, für die sie gebaut wurde: dass etwas auf dem Spiel steht.**

Das ist der bemerkenswerte Befund an diesem Stück. Der Klickdummy hatte ein Blatt, das
bestand, und eines, das durchfiel. Hier besteht und fällt **dasselbe Bild**, je nachdem,
welche Auskunft man von ihm verlangt.

---

## 2. Prüfung 1 — was die Zeichnung trägt

Ich decke alle Schrift ab. Was bleibt in Woche 1?

**Es bleibt erstaunlich viel.** Sechs gezeichnete Fässer liegen in gezeichneten Betten im
Keller, mit Kreidebuchstaben. Über dem Wagen liegen **drei** gestrichelte Betten. Unter den
Häusern liegen **vier** gestrichelte Betten — eines, zwei, eines. Drei gegen vier, in einer
Bildsprache, ohne ein Wort. Das ist die Rechnung der ganzen Woche, und sie steht als Form da.

Der Vorschlag hatte *„eine Grammatik, zwei Orte"* versprochen. Gebaut sind **drei** Orte —
Keller, Wagen, Haus — und das ist besser als versprochen. Das gestrichelte Bett ist das
tragfähigste Bauteil, das dieses Projekt hervorgebracht hat.

Ebenso stark, und technisch das Sauberste in der Datei: **Häuser und Reichweitenlinien teilen
sich eine einzige Achse** (`xKm`, eine Zeile, zwei Verwender). Deshalb ist die Aussage „der
Löwen liegt links der Märzen-Linie" nicht behauptet, sondern **gezeichnet**. Wo eine
Zeichnung ihre Regel geometrisch statt textlich führt, kann sie nicht lügen. Das ist der
Grund, warum die rote Linie hier funktioniert und in jedem Mockup vorher nur dekorativ war.

**Und dann kommt die Gefahr, und die Zeichnung verstummt.**

Woche 5 der Vernachlässigungs-Sonde: Ochsen und Löwen stehen bei Durst 4, eine Woche vor dem
Verlust. Das ist der dramatischste Zustand, den die Demo kennt. Was ändert sich im Bild?

| Träger | Was er sagt | Ohne Schrift? |
|---|---|---|
| „der Adler wirbt" in Rot | alles | **verschwindet** |
| vier rote Striche unter dem Haus | Durstmarken | bleiben — aber sie sind Notation, nicht Bild |
| ein zweiter, grauer Ausleger rechts am Haus | der Adler hängt an | **18 × 14 Punkte, grau auf Papier** |

Deckt man die Schrift ab, sieht ein Haus in Todesgefahr aus wie ein zufriedenes Haus mit
einem Fleck daneben. Die Fassbetten unter dem Ochsen sind in Woche 5 **exakt dieselben** wie
in Woche 1: grau gestrichelt. Der Zustand „hier fehlt seit fünf Wochen etwas" hat im Bild
keine Form.

Das ist die Prüfung, an der Blatt 6 des Klickdummys gescheitert ist, und sie ist an derselben
Stelle wieder gescheitert: **die Zeichnung ändert sich nicht mit dem, was sie zeigt.** Nur
diesmal ist es teurer, weil es nicht mehr um ein fremdes Haus geht, sondern um den einzigen
Einsatz, den das Spiel hat.

---

## 3. Prüfung 2 — die erste Sekunde, und warum die Bühne sie sich selbst verdirbt

Die Entscheidung der ersten Woche ist vor der Schrift lesbar: drei Wagenbetten, vier
Hausbetten, sechs Fässer im Keller. Wer zählen kann, sieht die Klemme, bevor er liest.
**Prüfung 2: bestanden.**

Nur glaubt die Bühne das selbst nicht. Gezählt, was in Woche 1 gleichzeitig oder binnen
sieben Sekunden an Anleitungstext auf dem Schirm steht:

1. „anklicken: der Braumeister setzt anders an"
2. „Fässer aus dem Keller auf ein Haus ziehen — oder anklicken, dann das Haus anklicken."
3. „Diese Woche verlangen deine Häuser 4 Fass. Du hast 6 im Keller und 3 Plätze auf dem Wagen."
4. „Zieh ein Fass aus dem Keller auf ein Wirtshaus." (nach 0,5 s)
5. „Der Ochsen will zwei, die Krone eines, der Löwen eines. Du hast drei Plätze." (nach 6,5 s)
6. „Gut. Lade so viel du willst — dann schick den Wagen los." (nach dem ersten Fass)

Sechs Sätze. §8 des Vorschlags: *„Braucht es einen Satz Anleitung, ist die Bühne
durchgefallen."* Nach dem eigenen Maßstab ist das ein Durchfall, und ich schreibe das nicht,
um zu punkten — Nummer 3 und Nummer 5 sagen **dasselbe** wie die Betten, die daneben liegen.
Die Bühne verdoppelt ihre eigene beste Leistung in Prosa und entwertet sie damit.

**Die Diagnose ist aber nicht „zu viel Text", sondern eine Lücke im Bild.** Die Betten sagen
*wie viel fehlt*. Nichts sagt, dass ein Fass **in die Hand genommen** werden kann. Der
`cursor: grab` steht in der CSS und ist der einzige Hinweis — er erscheint erst, wenn die
Maus schon dort ist, also nach der Frage, die er beantworten soll. Ein Fass, das aufnehmbar
ist, muss anders liegen als eines, das eingelagert ist: leicht heraus­gezogen, mit einem
Schlagschatten, mit einem Griff. Ein einziges Bauteil, und die Sätze 2, 4 und 6 fallen weg.

---

## 4. Prüfung 3 — die Farbgrammatik, und hier fällt es durch

Rot leistet in dieser Datei sechs verschiedene Dienste:

| Rot an | bedeutet |
|---|---|
| Braujahrband, laufende Woche | *hier stehst du* |
| Reichweitenlinie | *bis hierhin und nicht weiter* |
| Durststriche | *so lange schon* |
| „der Adler wirbt" | *Gefahr* |
| Startknopf am Titel | *fang an* |
| **gestricheltes Fassbett unter dem Haus** | **„ein Fass für dieses Haus liegt auf dem Wagen"** |

Die letzte Zeile ist der Fehler, und er ist kein Geschmacksfehler, sondern eine Umkehrung.
Der Vorschlag hat die Grammatik selbst festgelegt (§3):

> „Gefüllt heißt geliefert, gestrichelt heißt: hier fehlt eines. **Rot gestrichelt heißt: hier
> fehlt eines, und der Adler weiß es.**"

Gebaut ist das Gegenteil: `fassbett(..., "rot")` wird gesetzt, wenn das Fass **unterwegs**
ist. Rot ist an genau dieser Stelle die **gute** Nachricht — an demselben Gegenstand, an dem
Rot laut eigener Festlegung die schlechteste sein sollte, und drei Zentimeter neben roten
Durststrichen, die wieder Gefahr bedeuten.

Damit fällt Prüfung 3, und zwar strenger als beim Klickdummy: dort widersprach sich die
Farbe innerhalb einer Zeile, hier widerspricht sie sich **innerhalb eines Bauteils**.

Die Reparatur ist billig und macht die Bühne zugleich in Prüfung 1 stark: **rot gestrichelt
für das fehlende Fass bei einem umworbenen Haus** — dann trägt die Zeichnung die Gefahr, das
Bett wird zum Alarm, „der Adler wirbt" darf verschwinden, und Rot bedeutet überall dasselbe.
Für „unterwegs" genügt ein halbtransparentes Fass im Bett oder ein Bett mit dünnem Rand; das
ist ohnehin nur ein Zwischenzustand von zwei Sekunden.

Hier treffen der Spieldesigner und ich uns: er will, dass die Gefahr wächst; ich will, dass
sie sichtbar wird. Beides hängt an demselben Bett.

---

## 5. Was der Vorschlag versprochen und die Demo nicht gebaut hat

Nicht als Vorwurf — als Liste, was die Bühne noch schuldig ist:

| Versprochen (§3/§4) | Gebaut |
|---|---|
| „Der graue Wagen des Adlers fährt auch — auf derselben Straße, sichtbar" | **fehlt vollständig** (keine Fundstelle). Der Gegner ist ein grauer Fleck am Haus und ein Satz. |
| „an der Landbier-Linie liegt ein umgekipptes graues Fass" — der Beweis der Regel als Bild | **fehlt.** Die Verderbnis ist eine Einblendung, die nach 4,2 s weg ist und keine Spur hinterlässt. |
| „Der Schornstein raucht, wenn gebraut wird" | Der Rauch ist animiert (6 s, Opazität und Versatz) — aber **immer**. Eine Bewegung, die nichts bedeutet, ist Tapete. |
| „Der Zettel, der mit der Fuhre zurückkommt" — die Stimme des Wirtes | Gebaut, aber er kommt **nicht mit der Fuhre**: von selbst öffnet er sich genau einmal je Haus, in dem Augenblick, in dem der Adler wirbt; sonst nur auf Klick. Die Stimme, die die Historikerin verlangt hat, spricht fast nur, wenn man sie anspricht. |

Der erste Punkt wiegt am schwersten. *„Es gibt kein Gegenüber"* haben alle sechs Personas
gesagt; der Vorschlag hat den fahrenden grauen Wagen als Antwort gesetzt; die Bühne ist ohne
ihn gebaut. Der Adler ist wieder das, was er im ganzen Projekt war: eine Zustandsänderung an
fremdem Besitz.

---

## 6. Kleinigkeiten, in einer Zeile je Stück

1. **Die Einblendung liegt auf der Fußzeile.** Der dunkle Hinweiskasten deckt in 1600 × 950
   die Zeile „Fässer aus dem Keller auf ein Haus ziehen…" zur Hälfte ab. Zwei Texte, ein Ort.
2. **Der Keller zeichnet höchstens 16 Fässer** (`if (i >= 16) return;`), die Beschriftung
   zählt weiter. Bild und Zahl gehen genau dann auseinander, wenn das Horten interessant
   wird.
3. **„Der Wagen fasst 3" ist überflüssig** — die drei Betten stehen darüber. Siehe §3.
4. **Der Fuhrmann Brendel** ist eine schwarze Silhouette mit Hut und einem Namen darunter.
   Als Besetzung genügt das; als *„ein Gesicht im ganzen Spiel"* (Kritiker) noch nicht. Er
   steht in jeder Lage gleich da — auch wenn der Wagen leer zurückkommt.
5. **Das Michaeli-Blatt ist tadellos** und braucht von mir keine Auflage. Das Protokollraster
   — zwölf Kästchen je Haus, gefüllt oder rot umrandet — ist die beste Zeichnung, die dieses
   Projekt hat: eine Tabelle, die ohne Zahlen auskommt. Genau so war *„die Zahlen leben in
   Gegenständen"* gemeint.

---

## 7. Auflagen

1. **Das fehlende Fass beim umworbenen Haus wird rot gestrichelt; „unterwegs" bekommt eine
   andere Form.** Repariert Prüfung 3 und die Hälfte von Prüfung 1 in einem Zug.
2. **Ein Fass muss aussehen, als könne man es nehmen.** Ein Bauteil (Schatten, Versatz,
   Griff) — dafür fallen drei Anleitungssätze weg.
3. **Der graue Wagen fährt.** Er ist derselbe `offset-path` wie der eigene, in Grau, ohne
   Ladung. Ohne ihn hat die Bühne kein Gegenüber, sondern nur Nachrichten über eines.
4. **Das saure Fass wird gezeichnet und bleibt liegen** — umgekippt, grau, an der Linie. Eine
   Einblendung, die verschwindet, ist keine Belehrung.
5. **Der Rauch geht nur, wenn gebraut wird.** Sonst gehört er weg.
6. **Die Einblendung räumt der Fußzeile den Platz** oder ersetzt sie.

---

## 8. Der eine Satz

Der Klickdummy hat bewiesen, dass die Bauteile tragen. **Die Demo beweist, dass sie eine
Handlung tragen — und lässt genau die eine Sache ungezeichnet, die weh tun soll.** Ein Bild,
das den Vorrat zeigt und die Gefahr schreibt, ist noch ein halbes Blatt.

Mein Votum: **besteht mit Auflagen. Auflage 1 ist keine Verschönerung, sondern die Bedingung
dafür, dass die Bühne überhaupt behaupten darf, ohne Tabelle auszukommen.**
