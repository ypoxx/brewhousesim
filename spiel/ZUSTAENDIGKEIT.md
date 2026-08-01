# Zuständigkeit — Entscheidungen der Aufsicht

Die Stücke arbeiten parallel und dürfen nur ihre eigenen Dateien anfassen. Das ist die
Parallelsicherung, und sie funktioniert — aber sie erzeugt Fälle, in denen ein Fehler beim
einen Stück gefunden und beim anderen behoben werden muss. Diese Fälle entscheidet die
Aufsicht, nicht das Stück. Hier stehen die Entscheidungen.

---

## 1 — Der überdeckte Schließknopf gehört DEM GEGNER

**Vorgetragen von:** dem Builder der FUHRE, in Runde 2.
**Entschieden:** stattgegeben.

Der Kritiker hatte den Fehler unter DIE FUHRE gemeldet: ein Panel, das sich nicht mehr
schließen lässt, weil eine Überschrift den Knopf überdeckt. Der Fuhre-Builder hat
nachgemessen, wem die Stelle gehört:

> Der deckende H2 ist `fach-blatt-gegner > div.blatt.gg-blatt > div.gg-bkopf > div > h2`,
> der gedeckte Knopf ist `div.gg-bkopf > div.gg-reiter > button` — beide in
> `spiel/stuecke/gegner.js` und `spiel/stil/gegner.css`.

Regel 3 verbietet der FUHRE diese Dateien. Sie hat sie korrekt nicht angefasst und stattdessen
die Aufsicht gerufen. **Das ist das richtige Verhalten** und soll so bleiben: lieber ein
gemeldeter Fremdfehler als ein heimlicher Übergriff in fremde Dateien.

Zwei Befunde gehen damit an den Builder von DER GEGNER:

- **Der Fehler reproduziert im heutigen Stand nicht mehr.** Vierzehn Fälle geprüft — vier
  Epochen × drei Auflösungen, dazu beide Häuser in 1970. Der Schließknopf wurde in allen
  vierzehn von `elementFromPoint` getroffen und per Klick geschlossen. Behoben hat ihn
  niemand absichtlich; die Runde-2-Arbeit der STADT hat die Kopfzeile mitverschoben.
- **Die Anfälligkeit steht aber noch im Blatt.** `.gg-bkopf` ist ein Flex-Streifen, der
  Textblock daneben hat `min-width: auto`, `.gg-reiter` hat `flex: none`. Wird der Erbspruch
  in `.gg-unter` einmal länger als der Platz, schiebt sich der Textblock über die
  Reiterknöpfe, statt zu schrumpfen.

> **Auflage an DER GEGNER:** `min-width: 0` auf den Textblock in `.gg-bkopf`. Das macht den
> Fehler dauerhaft unmöglich, statt darauf zu hoffen, dass der Text kurz bleibt.

Ein Fehler, der nur deshalb verschwunden ist, weil ein anderes Stück etwas verschoben hat,
ist nicht behoben. Er wartet.

## 2 — Eine Sperre über alle Stücke ist Sache des Kerns

**Vorgetragen von:** dem Builder der FUHRE, zur Kenntnis.
**Entschieden:** anerkannt. Kein Stück baut das; es wird eine Kernaufgabe.

Die FUHRE hat ihre Georgi-Tafel korrekt gesperrt — der WEITER-Knopf des Kerns ist darunter
nicht mehr erreichbar. Sie kann aber konstruktionsbedingt nicht alles decken:

> Sie kann nicht decken: `fach-blatt-stadt` (z-index 80, also Reiterleiste und BAUHOF) und
> die Fächer von PREIS und GEGNER, die als spätere Geschwister derselben Ebene über ihr
> liegen. Während die Georgi-Tafel oben liegt, bleiben also Bauhof-Käufe und der
> Michaeli-Griff bedienbar.

Und sie hat den naheliegenden Ausweg geprüft und verworfen, mit dem besseren Argument:

> Würde sie ihr Fach hochziehen, geriete ein bereits offenes Gegner-Blatt unter ihren Deckel
> und wäre dann selbst nicht mehr schließbar — genau die Falle, die Fehler 1 beschreibt.

Das ist richtig. **Ein einzelnes Stück kann keine Sperre über alle Stücke bauen, ohne das
Problem nur zu verschieben.** Wer sie will, braucht eine Ebene im Kern, oberhalb aller Fächer,
mit genau einer Stelle, die entscheidet, welches Blatt gerade oben liegt.

> **Auftrag für Welle 2, im Kern:** eine Sperr-Ebene über allen Fächern, plus ein Register,
> das weiß, welches Blatt offen ist. Solange eines offen ist, ist alles darunter tot — und
> jedes Blatt ist per Klick **und** per Escape schließbar.

Der Nebenbefund des Kritikers gehört hierher: Die Georgi-Tafel behauptet *„Solange diese
Tafel oben liegt, ruht der Hof"*, und daneben bleiben neun Knöpfe des Stadt-Fachs anklickbar.
Das Blatt sagt die Unwahrheit, und zwar nicht aus Nachlässigkeit eines Stücks, sondern weil
die Sperre auf dieser Ebene gar nicht möglich ist.

## 3 — Der Todzustand bleibt bei der FUHRE

Kein Zuständigkeitsstreit; der Builder sagt selbst, er sei in den eigenen Dateien behebbar.
Er steht hier trotzdem, weil er der schwerste Fund der Welle ist und weil er die **These des
Stücks widerlegt**:

> Kasse 0 + leerer Keller ist absorbierend. Aus frischem Spiel mit fünf Klicks reproduziert —
> nämlich genau den fünf Bauhof-Knöpfen, die das Spiel selbst als „nächster Zug" empfiehlt.
> Danach 36 Wochen völlig unverändert. Auf der Anschlagtafel liegen dabei 54 Grut und
> 44 Brautage, und sie sagt selbst „Kein Sud: die Kasse". Kein Konkurs, keine Meldung,
> kein Ende, WEITER läuft ewig weiter.

Und der Satz, der zählt:

> Damit kippt die These des Stücks — *„die Knappheit, die kein Geld ist"* — ins Gegenteil:
> am Ende ist Geld die einzige Schranke.

Dazu der Widerspruch, den er mitliefert: Durch die Michaeli-Abgaben fällt die Kasse sehr wohl
auf −17 Pf. **Das Haus darf Schulden haben, der Spieler darf keine machen.**

Das ist kein Fehler im Code, das ist ein Fehler im Entwurf. Er wird nicht mit einer
Fallunterscheidung geheilt, sondern mit einer Antwort auf die Frage, was ein Brauhaus tut,
wenn kein Geld da ist: anschreiben lassen, Grut zurückverkaufen, einen Dünnsud ohne
Barauslage. Alle drei sind historisch und alle drei liegen in den eigenen Dateien.

---

## 4 — Die Abgabenlast: eine Obergrenze, und sie gilt für alle

**Vorgetragen von:** dem Builder der FUHRE.
**Entschieden:** Obergrenze gesetzt. Dies ist die wichtigste Entscheidung dieser Welle.

> Vier Stücke ziehen inzwischen gleichzeitig Abgaben aus derselben Kasse — DIE FUHRE
> „Ungeld" (nach Ausstoß), dazu Grutgeld, Erbzins, Mahlgeld, Wasserzins aus einem anderen
> Stück. In 1350 sind das zusammen rund 35 Prozent des Umsatzes; **das Haus geht im dritten
> Braujahr auf null.**

Das ist keine Meinungsverschiedenheit, das ist ein Systemfehler, den kein Stück sehen kann.
Jedes hat für sich eine maßvolle Abgabe gebaut; die Summe ruiniert das Haus. Und mit hoher
Wahrscheinlichkeit ist genau das die Ursache des Todzustands, den der Kritiker unabhängig
davon gefunden hat: Kasse null, Keller leer, und ab da bewegt sich nichts mehr.

Die FUHRE hat von sich aus reagiert — ihre Abgabe auf 8 % gesenkt, einen Notgroschen von vier
Suden und einen Deckel bei 55 % des freien Geldes eingezogen. Richtig gehandelt, aber es
reicht nicht: Wenn vier Stücke unabhängig „maßvoll" sind, ist die Summe es nicht.

### Die Regel

> **Alle Abgaben zusammen dürfen im Mittel eines Braujahres 18 % des Umsatzes nicht
> übersteigen.** Jedes Stück bekommt einen festen Anteil daran und darf ihn allein
> unterschreiten, nie überschreiten:
>
> | Stück | Anteil am Gesamtdeckel |
> |---|---|
> | DIE FUHRE (Ungeld, nach Ausstoß) | 8 % |
> | DER PREIS (Erbzins und Michaeli-Abgaben) | 5 % |
> | DER GEGNER (was er dem Haus abpresst) | 3 % |
> | DIE STADT (Wasserzins, Mahlgeld, Bauabgaben) | 2 % |
>
> Wer mehr will, muss es sich von einem anderen Stück abtreten lassen und die Abtretung hier
> eintragen. Niemand erhöht still.

Achtzehn Prozent sind kein Kompromiss zwischen vier Wünschen, sondern eine Zahl mit einem
Grund: Sie liegt hoch genug, dass Abgaben in jeder Epoche spürbar sind, und niedrig genug,
dass ein gut geführtes Haus daran nicht stirbt. Wer sie ändern will, ändert sie hier, mit
einer Messung daneben.

### Und die härtere Regel dahinter

> **Es darf keinen Zustand geben, aus dem heraus kein Zug mehr etwas verändert.**

Das gilt unabhängig von der Abgabenhöhe und für jedes Stück. Ein Wirtschaftsspiel darf den
Spieler ruinieren — es darf ihn nicht einfrieren. Wenn kein Geld da ist, muss es einen Weg
geben, der kein Geld kostet: anschreiben lassen, Vorrat zurückverkaufen, ein Dünnsud ohne
Barauslage, im Zweifel der Konkurs mit Ende und Nachspiel. Was es nicht geben darf, ist
WEITER, das ewig weiterläuft und nichts tut.

## 5 — Das Preisblatt steht nicht dauerhaft offen

**Vorgetragen von:** dem Builder der FUHRE.
**Entschieden:** stattgegeben, mit dem Vorschlag des Antragstellers.

> Das Stück DER PREIS legt ein Brett `.pr-tafel` über x 1–85 %, y 12–87 % auf die Ebene
> „blatt" (z=60). Es verdeckt alle vier Bretter DER FUHRE auf Ebene „hand" (z=40)
> vollständig; Playwright meldet an jedem Knopf „intercepts pointer events".
> **Ein Kritiker kommt derzeit an DIE FUHRE nicht heran.**

Ein Stück, das ein anderes unbedienbar macht, macht auch dessen Prüfung unmöglich — und damit
die Messlatte wertlos. Der Vorschlag des Antragstellers ist der richtige:

> **Auflage an DER PREIS:** Das Michaeli-Blatt wird über seinen Griff geöffnet und geschlossen,
> statt dauerhaft offen zu stehen. Geschlossen gibt es die Fläche frei. Das passt ohnehin zum
> Entwurf: Michaeli ist ein Moment im Jahr, kein Dauerzustand.

## 6 — Drei Bitten an den Kern, angenommen

Der Fuhre-Builder hat drei Dinge gemeldet, die im Kern liegen und die kein Stück ändern darf.
Alle drei sind berechtigt und gehen in die Zwischenwelle:

1. **`vorrat.plaetze` ist mit 90/400 Fass in 1884/1970 zu klein** — Sudgröße mal Lagerzeit
   passt nicht hinein, weshalb die Reifezeiten auf 2–5 Wochen gekürzt werden mussten. Das ist
   sachlich falsch: Ein Lagerbier von 1884 reift Monate, nicht Wochen. **Lösung: getrennter
   Gärkeller (reifendes Bier) neben dem Lagerkeller (lieferbares Bier).** Damit wird aus einer
   Zahl, die nicht passt, eine Entscheidung, die etwas kostet.
2. **Es fehlt eine API für `haus.rohstoff`** — die FUHRE zieht ihn beim Sud direkt ab. Solange
   das so bleibt, kann kein zweites Stück Rohstoff verbrauchen, ohne zu kollidieren.
3. **`nimmHeraus()` nimmt immer das älteste Fass** — die FUHRE sortiert deshalb vorher um.
   Der Kern soll die Auswahl entgegennehmen, statt sie zu erraten.

## 7 — Die graue Attrappe über der Adlerbrauerei gehört DEM GEGNER

**Vorgetragen von:** dem Kritiker der STADT, in Runde 2.
**Entschieden:** stattgegeben, zur Behebung durch DER GEGNER.

> `spiel/bild/gegner/hof3.png` liegt in 1884 als graue, entsättigte Attrappe genau über der
> Brauerei Adler der eigenen Platte, deren Backsteinfassade und zwei Schornsteine darunter
> hervorschauen.

Der Kritiker hat den Fund korrekt als fremd gekennzeichnet, statt ihn der STADT anzulasten
oder selbst einzugreifen. Die Sache ist inhaltlich eindeutig: **Die Adlerbrauerei steht
bereits auf der Platte.** Der GEGNER braucht dort kein zweites Gebäude, sondern höchstens
etwas, das den Zustand des Nachbarn anzeigt — Rauch, ein Schild, ein Fuhrwerk.

> **Auflage an DER GEGNER:** Entweder `hof3.png` in 1884 weglassen und die Platte zeigen
> lassen, oder es passgenau und farbrichtig über die dortige Brauerei legen. Eine graue
> Attrappe über einem gezeichneten Gebäude ist beides nicht.
