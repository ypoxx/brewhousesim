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

## 8 — Wer eine Bindung löst, muss sie besitzen

**Vorgetragen von:** dem Builder von DER GEGNER, in Runde 1.
**Entschieden:** Kern geändert, von der Aufsicht.

> DIE FUHRE löst nach drei mageren Jahren die Bindung einer Adresse per
> `welt.binde(k, null)` — auch dann, wenn die Bindung dem Adler gehört. Der Gegner
> verliert dadurch Besitz, den nicht der Spieler ihm genommen hat.

Die Regel der FUHRE ist inhaltlich richtig: Ein Wirt, der drei Jahre lang nicht beliefert
wird, sieht sich anderswo um. Falsch ist nur, dass sie **für alle** gilt. Ein Haus, das der
Adler beliefert, hat keine mageren Jahre — und wenn doch, dann sind sie seine Sache, nicht
die der FUHRE.

Das ist kein Streit zwischen zwei Stücken, sondern eine fehlende Sicherung im Kern: Wenn
jede Partei jede Bindung löschen darf, gibt es keinen Besitz. Also gehört die Sicherung
dorthin, wo sie niemand umgehen kann.

> **Geändert in `spiel/kern/welt.js`:** `binde(schluessel, wem, womit, bisJahr, wer)` — eine
> bestehende Bindung zu **lösen** gelingt nur dem, dem sie gehört. Fehlt `wer`, gilt `haus`.
> Ein Fehlversuch gibt `false` zurück und ändert nichts. Dazu neu:
> `welt.gebunden(schluessel)` gibt zurück, wem die Adresse gerade gehört — damit ein Stück
> fragen kann, statt zu raten.

Für DIE FUHRE heißt das: Ihre Drei-Jahre-Regel wirkt weiter, aber nur auf eigene Adressen.
Will sie eine Adresse des Adlers, muss sie sie gewinnen — nicht löschen. Das ist die
interessantere Mechanik, und sie war ohnehin gemeint.

## 9 — Die Umlaute im Kern, behoben

**Vorgetragen von:** dem Builder von DER GEGNER.
**Entschieden:** von der Aufsicht behoben, weil kein Stück in `spiel/kern/` schreiben darf.

> `welt.js` schreibt Adressnamen ohne Umlaute — „Faehrhaus am Fluss", „Brueckenwirt",
> „Muehlschenke", „Bahnhofsgaststaette", „Adler-Braeu AG". Sie stehen in jedem Stück im Bild;
> nur der Kern kann sie richtigstellen.

Es waren mehr als die gemeldeten fünf: Auch die Epochensätze und die Charakterzüge der
Generationen waren betroffen — „Vom Paechter zum Eigentuemer", „Kaeltemaschine", „Haelt das
Geld zusammen, versaeumt die Gelegenheit". Zwölf Anzeigetexte insgesamt.

**Angefasst wurden ausschließlich Anzeigetexte** (`name:` und `sagt:`). Bezeichner —
`schluessel`, `art`, `ort` — bleiben umlautfrei, weil sie keine Sprache sind, sondern
Schlüssel; ein Umlaut darin würde jeden Vergleich in jedem Stück brechen. Danach geprüft:
Syntax gültig, alle vier Epochen laden ohne einen Fehler auf der Seite.

Der Grund, warum das überhaupt so war, steht in `design/PRUEFUNG.md` §4.2: Umlautvermeidung
war die sichere Strategie beim Erzeugen von *Bildern*. Für Text, den ein Programm setzt, gilt
sie nicht — dort ist sie nur falsch geschrieben.

## 10 — Die Ortsmarken: DIE STADT hält die Pflöcke, jeder meldet sich selbst ab

**Vorgetragen von:** dem Builder von DER GEGNER.
**Entschieden:** So bleibt es; die Abmeldung wird vollständig.

> DIE STADT legt fremde Ortsmarken auf Pflöcke und lässt sie beim Laden ruhen; DER GEGNER hat
> sich mit dem vorgesehenen `data-frei` nur für Sitz, Hof, Band und Zeiger abgemeldet, die
> Giebelschilder bleiben im Pflock-System.

Kein Fehler, sondern eine unvollständige Abmeldung. Das Pflock-System der STADT ist richtig —
es verhindert, dass Marken über der Platte flattern. Wer eigene Marken selbst setzt, meldet
sie ab.

> **Auflage an DER GEGNER:** auch die Giebelschilder mit `data-frei` kennzeichnen, oder sie
> bewusst im Pflock-System lassen und das hier vermerken. Nicht halb.

## 11 — `kern/ton.js` gehört für Welle 2 DEM KLANG

**Entschieden von der Aufsicht, unaufgefordert, vor dem Start des Stücks.**

Der Skelett-Bauer hat `kern/ton.js` bewusst als Nichtstuer gebaut, der das Protokoll schon
mitschreibt, und in den Kopf geschrieben: *„In Welle 2 wird hier die echte Wiedergabe
eingehängt — ohne dass eine einzige Stück-Datei angefasst werden muss."* Genau so wird es
gemacht. Die Regel „`kern/**` ist schreibgeschützt" wird für **diese eine Datei** und **nur
für DEN KLANG** aufgehoben.

> **Auflage:** Die vorhandene API bleibt Zeichen für Zeichen, wie sie ist —
> `melde · spiele · schleife · halt · bett · setzeStumm · setzeLaut`, und `spiele` gibt
> weiterhin einen Wahrheitswert zurück. Vier Stücke rufen sie bereits. Wer sie ändert,
> bricht Welle 1 rückwirkend.

Alle anderen Kerndateien bleiben gesperrt.

### Zwei Befunde aus der Vorprüfung der Aufsicht, damit sie niemand zweimal macht

**Die Tonlatte ist echt und sie ist scharf.** `werkbank/hoerer.py` ist gebaut und an zwei
absichtlich extremen Betten geprüft: 1350 und 1970 wurden blind mit 95 % Sicherheit richtig
erkannt. Wichtiger ist, was das Ohr **ungefragt** dazu gesagt hat — es hat den Synthwave im
1970er-Bett als „für 1970 etwas anachronistisch" gerügt und den Kathedralenhall in einer
Hofszene als unpassend. Dieses Ohr wird nicht wohlwollend sein.

**ElevenLabs `/v1/music` singt.** Das 1350er-Bett kam als lateinischer Mönchsgesang zurück,
mit verständlichen Worten, obwohl der Prompt nur Instrumente nannte. Für ein Bett unter einem
Spielhof ist Gesang mit Text fast immer falsch — er zieht die Aufmerksamkeit. Wer Instrumental
will, muss es ausdrücklich verlangen.

## 12 — Ein Haus darf fallen, und dann muss die Uhr stehenbleiben

**Vorgetragen von:** dem Kritiker von DER FUHRE, Runde 3.
**Entschieden:** Der Kern bekommt `B.uhr.beende(grund, text)`. Sofort eingebaut.

Der Befund ist der bisher schwerste des Laufs, und er ist belegt, nicht behauptet: In
Epoche 4 erreicht ganz gewöhnliches Spiel in Woche 135 den Satz *„KEIN HAUS DER STADT FÜHRT
MEHR BIER DES ANKER — Das ist das Ende, nicht die leere Kasse."* Danach wurden **120 weitere
Wochen mit 960 Klicks** gespielt, in E1 und E4 unabhängig: `wollen` steht in jeder dieser
120 Wochen auf 0, keine einzige Adresse kommt je zurück. Auf dem Bildbeleg vom Februar 1978
sind alle zehn Häuser AUFGEGEBEN — und daneben laufen 6 Sude die Woche, 525 von 600 hl
liegen im Tank, und unten rechts steht *„nächster Zug: Bau Hopfenlager — 6.960 DM"*.

Das Spiel schlägt einem Haus, das es selbst für tot erklärt hat, den nächsten Zug vor.

Das ist derselbe Satz wie in §4, nur eine Ebene höher: **Es darf kein WEITER geben, das ewig
weiterläuft und nichts ändert.** Ein Konkurs braucht ein Ende und ein Nachspiel.

### Warum das in den Kern gehört und nicht in `fuhre.js`

Die Uhr kannte genau ein Ende — die Gegenwart ist erreicht, das Haus steht noch. Ein Stück
kann sich nicht selbst zum Ende der Welt erklären: hielte `fuhre.js` den Wochentakt allein
an, malten STADT, PREIS und GEGNER weiter, als sei nichts. Dieselbe Erwägung wie bei der
Sperre in §2. Also sagt das Stück der Uhr den **Grund**, die Uhr hält an und sagt es
**allen**:

```js
B.uhr.beende('keine-abnehmer', 'Kein Haus der Stadt führt mehr Bier des Anker.');
```

`naechsteWoche()` verweigert danach den Dienst (`z.ende` wurde schon vorher geprüft), das
Ereignis `ende` trägt `grund`, `jahr`, `woche` und `epoche`, und ein `zeichne` folgt.
Zweimal rufen schadet nicht; das erste Ende gilt.

> **Auflage an DIE FUHRE:** Den Zustand erkennen und `beende` rufen — oder einen Weg zurück
> bauen (eine Adresse, die wieder anfragt; ein Wirt, der ein Fass auf Probe nimmt). Beides
> ist eine gültige Antwort, **keines von beidem ist es nicht.**

> **An alle vier Stücke:** Wer auf `ende` hört, malt sein eigenes Schlussblatt. Niemand muss
> dafür wissen, was die anderen tun.

**Für Welle 2 vorgemerkt:** Das Nachspiel — Chronik des Hauses, Generationenzeile,
Neuanfang — gehört **DAS ERBE**, nicht der FUHRE. Die FUHRE baut jetzt nur das Anhalten und
ein schlichtes Schlussblatt; DAS ERBE übernimmt es später.

## 13 — Die frühen Epochen sind nicht geeicht, und das gehört nicht einem Stück allein

**Vorgetragen von:** dem Kritiker von DER PREIS, Runde 1 — im selben Atemzug, in dem er das
Stück **bestehen** ließ.
**Entschieden:** Das Bestehen bleibt. Die Lücke wandert in die Glättung, mit einer Zahl daran.

Der Befund, gemessen und nicht behauptet: In **13 von 20** durchgeklickten Michaeli-Blättern
stand *„HEUTE NICHT — Die Kasse reicht für keines dieser Angebote"*. In Epoche I und II war
über dreizehn Blätter hinweg **kein einziger der 49 Festlegungs-Knöpfe je aktiv** (E1: Kasse
112 Pf gegen die billigste Festlegung 150 Pf; E2: 640 fl gegen 780 fl), während dieselbe
Wahl in E3 und E4 schon im ersten Klick zu haben ist. Die gemessene Leiter in E1 lautet
3,39× / −0,18× / −0,36× / −0,54× / −0,68× / −0,80× / −0,90×; in E4 dagegen
3,44× / 5,30× / 4,41× / 3,20× / 1,48×.

Das heißt im Klartext: **Die unwiderrufliche Entscheidung — das Herzstück dieses Stücks —
existiert in 1350 und 1600 nur als graue Fläche.** Latte 2 ist damit dem Buchstaben nach
erfüllt (Angebote nebeneinander, mit Preisschild, einander ausschließend) und dem Sinn nach
in zwei von vier Epochen nicht.

### Warum ich es trotzdem bestehen lasse

Weil der Fehler nicht in DEM PREIS sitzt. Die Preise der Sprossen macht DER PREIS; das
Einkommen der frühen Jahre macht DIE FUHRE; und DIE RECHNUNG frisst in E1 mit −73 Pf im Jahr
die Startkasse von 112 Pf, bevor das billigste eigene Angebot (33 Pf) überhaupt erreichbar
ist. Wer das einem Builder allein aufträgt, bekommt die Zahlen des anderen gegen sich —
dieselbe Konstellation wie beim Abgabendeckel in §4.

### Die Auflage an die Glättung, mit einer Zahl

> **In jeder der vier Epochen muss innerhalb der ersten drei Braujahre mindestens eine
> unwiderrufliche Festlegung tatsächlich anklickbar werden** — nachgewiesen am Bildschirm,
> nicht im Datenblatt. Und die Leiter darf in keiner Epoche negativ werden: Wo E1
> −0,18× bis −0,90× steht, ist die Kasse leer und bleibt es.

Zwei Wege stehen offen, beide zulässig: eine unterste Sprosse je Jahr, die an der
tatsächlichen Barschaft hängt (die Ratenzahlung *„von 94 Pf — dann 1 × 52 Pf"* gibt es
bereits, sie erscheint in E1/E2 nur nie am unteren Ende), oder die Jahresrechnung der
Frühepochen gegen die Startkasse eichen. **Wer eicht, meldet die neue Zahl** — sonst
verschiebt der eine, was der andere gerade festgezurrt hat.

### Nebenbefund, klein und schnell behoben

Die einzige in 1970 sofort erreichbare Festlegung — *„Liefervertrag mit der
Nordstern-Gruppe"* — trägt als Preisschild **„ohne Ausgabe"** und zahlte beim Klick
86.000 → 175.000 DM **aus**. Die stärkste unwiderrufliche Wahl des Blattes ist damit die
einzige ohne Zahl auf dem Schild. Gehört DEM PREIS, in `preis-daten.js`.

## 14 — `bild/name/**` gehört DEM NAMEN, der Rest von `bild/` bleibt DER STADT

**Entschieden von der Aufsicht vorab, damit DER NAME ohne Rückfrage starten kann.**

`spiel/LIESMICH.md` sagt: *„`bild/` gehört DER STADT als Ganzes, weil dort die vier
Epochenplatten liegen."* Der Grund ist richtig und bleibt richtig — er trägt aber nur so
weit, wie es um die Platten geht.

> **Ausgeschnitten:** `spiel/bild/name/**` gehört allein DEM NAMEN. Alles andere unter
> `spiel/bild/` bleibt unverändert DER STADT, einschließlich der vier Platten, des
> Hofbaukastens und der Ortsmarken.

**An DIE STADT:** In `bild/` liegen ab sofort fremde Dateien. Wer dort ein Verzeichnis
aufzählt, um daraus etwas abzuleiten, überspringt `name/`. Es ist kein Bauwerk, kein Hofteil
und keine Platte.

**An DEN NAMEN:** Das Zeichen des Hauses liegt auf der Platte der STADT, nicht daneben. Die
Ortsmarken der STADT sind ein Pflock-System (§10) — wer eigene Marken selbst setzt, meldet
sie mit `data-frei` ab, und zwar vollständig, nicht halb. Und **DER NAME schreibt keinen
Preis**: er setzt einen Ruf, DER PREIS liest ihn (WELLE-2.md).

## 15 — `index.html` bekommt die Plätze für Welle 2

**Vorgetragen von:** dem Bauer von DER NAME, als dringend.
**Entschieden:** Die Aufsicht trägt nach. Für die Builder bleibt die Datei eingefroren.

> `spiel/index.html` hängt `stuecke/name*.js` und `stil/name*.css` NICHT ein. Die Datei ist
> eingefroren und ich fasse sie nicht an.

Der Bauer hat richtig gehandelt: er hat die Regel nicht gebrochen, sondern gemeldet, und
stand dafür still. Die Datei kannte nur die vier Stücke der Welle 1 — das war zum Zeitpunkt
des Einfrierens vollständig und ist es jetzt nicht mehr.

Nachgetragen sind **alle drei** offenen Stücke der Welle 2 auf einmal — `sud`, `name`,
`erbe` —, damit DER SUD und DAS ERBE später nicht in dieselbe Wand laufen. Dazu liegen,
genau wie in Welle 1, **lauffähige Stummel** bereit (`<stueck>-daten.js`, `<stueck>.js`,
`<stueck>-zusatz.js`, `<stueck>.css`, `<stueck>-zusatz.css`). Ein Stummel statt eines
fehlenden Pfades ist kein Schönheitsfehler: ein 404 landet in der Konsole und kostet den
nächsten Kritiker eine falsche Rüge.

Geprüft: Epoche 1 und 4 laden nach der Änderung mit *„keine Fehler auf der Seite"*.

**Die Regel für die Builder ändert sich nicht.** `index.html` bleibt tabu. Wer einen Platz
braucht, den es nicht gibt, meldet es — so wie hier geschehen.

### Für die Glättung vorgemerkt: DER KLANG hängt sich selbst ein

`kern/ton.js` schreibt sich zur Laufzeit ein `<link>` auf `stil/klang.css` und ein
`<script>` auf `stuecke/klang.js` in die Seite. Das war die einzige Möglichkeit, die DER
KLANG hatte — ihm gehört eine Kerndatei, DEM NAMEN gehört keine. Es funktioniert und das
Stück hat damit bestanden; ich rühre es jetzt nicht an, weil man an einem Stück, das gerade
durch ist, nicht ohne Not dreht. **Die Glättung soll es auf feste Plätze umstellen** — und
dabei aufpassen, dass `klang.js` dann nicht zweimal geladen wird.

## 16 — Am Messgerät wird nicht gedreht, während die Latte läuft

**Vorgetragen von:** dem Prüfer von DER KLANG, als Randbefund. **Angenommen.**

> `werkbank/hoerer.py` wurde WÄHREND dieser Runde geändert (15:40, während ich las). Der
> Prompt ist Zeichen für Zeichen identisch mit HEAD (665 Zeichen, verglichen), die
> Urteilslogik unverändert. Die Messung ist damit nicht verfälscht — aber dass daran gedreht
> wird, während die Latte läuft, sollte die Aufsicht wissen.

Er hat recht, und er hat es auf die einzig brauchbare Art vorgetragen: nicht als Verdacht,
sondern mit dem Vergleich, der den Verdacht ausräumt. Die Änderung war die Reparatur des
Fehlurteils, das derselbe Bauer gemeldet hatte — sie musste sein, und sie machte die Latte
strenger statt milder (ein Abbruch gilt seither als *keine Messung* statt als Durchfallen).

**Trotzdem gilt ab jetzt:** Wer ein Messgerät ändert, während eine Runde damit misst,
schreibt es in die Chronik, **bevor** das Ergebnis eingetragen wird — nicht danach. Sonst
steht am Ende ein Urteil, dessen Zustandekommen niemand mehr nachvollziehen kann.

## 16 — Die Glättung hat elf Nähte geschlossen, drei davon im Kern

**Entschieden vom Glättungslauf am Ende von Welle 1.** Der vollständige Befund steht in
[`STAND.md`](STAND.md); hier stehen nur die Eingriffe, damit niemand sie doppelt macht.

**Im Kern, als Aufsichtsakt** (dieselbe Begründung wie §8, §9 und §12: es ist genau eine
Stelle, und kein Stück darf sie anfassen):

- `kern/welt.js` — neu `lager:` je Epoche (**Keller · Gewölbe · Eiskeller · Tanks**). Die
  Kopfleiste nannte den Vorrat in allen vier Epochen „Keller" und zählte ihn in Fass, während
  DIE FUHRE dasselbe Fass ab 1872 in Hektoliter zeigt: oben „KELLER 140/400", unten „DIE TANKS
  210 von 600 hl". Dieselbe Menge, zwei Einheiten, zwei Namen.
- `kern/kopf.js` — Vorrat jetzt über `B.welt.menge()`, den einen Formatierer des Kerns; dazu
  „nächster Zug", „Schließen".
- `kern/uhr.js`, `kern/orte.js` — Monatsnamen und fünf Ortsnamen mit Umlauten
  („Jänner", „März", „Untere Brücke", „Die Mühle", „Landstraße", „Gärtanks").

**In den Stücken** (jeweils in deren eigenen Dateien):

- **DIE STADT** — ihr gesamter Anzeigetext war umlautfrei geschrieben, während die drei
  anderen Stücke daneben korrektes Deutsch setzen. 48 Stellen in `stadt-daten.js` und
  `stadt.js`; ausschließlich Anzeigetexte, kein `schluessel`, kein Bildpfad.
- **DER PREIS** — `tafelSichtbar()` liest jetzt auch, ob DIE STADT die Tafel in ihren Rahmen
  geklappt hat. Vorher stand beim Laden aller vier Epochen „Michaelitafel schließen" über
  einem Bildschirm ohne Tafel. **Nebenwirkung:** die unsichtbar im DOM stehende Tafel hatte
  `[data-zug="preis:tafel-zu"]` hinterlassen — DER GEGNER schloss daraus auf eine offene
  Michaelitafel und hielt sein Dossier zu. Der als „toter Knopf" gemeldete Befund ist damit
  erledigt, ohne dass jemand in `gegner.js` danach gesucht hätte.
- **DER GEGNER** — Auflage aus §10 erfüllt: die Preisschilder melden sich mit `data-frei` von
  der Kartenschicht ab und sind seither mit der Maus zu drücken (vorher in 1350 in 62 Wochen
  kein einziges Mal). Stapelabstand 3,6 → 5,6 %, weil die Schilder jetzt dauernd stehen.
  Dazu Escape schließt das Haus gegenüber — Pflaster bis zur Sperrschicht aus §2.
- **DIE FUHRE** — „Wagen leeren" heißt jetzt je Epoche *Karren leeren · Wagen leeren · Rampe
  räumen · Lastzug leeren*; „Fassplätze: 22 eigene" heißt „Fässer des Hauses", weil zwei
  Zeilen darüber „4 von 12 Fass" steht.

**Was die Glättung ausdrücklich NICHT getan hat:** die Eichung des Michaelitags (§13). Sie ist
gemessen und sie ist nicht erfüllt — in E1 und E2 ist in den ersten drei Braujahren **kein
einziges** der fünf Angebote und keine der Festlegungen je aktiv, in E3 und E4 nur die
Festlegung mit dem Preisschild „ohne Ausgabe". Das ist kein Naht-, sondern ein Entwurfsfehler
über drei Stücke hinweg und gehört an einen Tisch, nicht in eine Glättung.

## 17 — Die Eichung des Michaelitags: eine Zahl, und sie gilt für alle

**Der teuerste offene Punkt aus `spiel/STAND.md` §2 und §6.** Gemessen, nicht behauptet: am
Michaelitag stehen in E1 −7 / −14 / −21 Pf und in E2 0 / −14 / −28 fl in der Kasse. **0 von 5
Angeboten und 0 von 3 bzw. 4 Festlegungen aktiv**, in den ersten drei Braujahren, in beiden
Epochen. Das Herzstück von DER PREIS ist sichtbar, beschriftet, gesiegelt — und unbezahlbar.

Das ist kein Fehler in einem Stück. Es ist wieder die Summe aus vieren, genau wie der
Abgabenfall aus §4 — nur diesmal andersherum: damals nahmen vier Stücke gleichzeitig, heute
räumt das Braujahr die Kasse *genau bis* zu dem Tag leer, an dem etwas gekauft werden soll.

> **Die Regel: Am Michaelitag muss die Barschaft in jeder Epoche mindestens den Preis des
> zweitbilligsten Angebots decken, und zwar in jedem der ersten fünf Braujahre.**
> Nicht des billigsten — zwei bezahlbare Karten nebeneinander sind das Mindeste, was
> „Optionen mit Preisschild nebeneinander" bedeuten kann. Eine bezahlbare Karte ist keine
> Wahl, sondern ein Knopf.

**Wer es umsetzt:** DIE FUHRE hält die Woche zurück, nicht DER PREIS die Angebote billig.
Ein Angebot herunterzupreisen, bis es passt, entwertet die Latte; die Kasse muss den Tag
erreichen. Konkret: die Woche vor Michaeli darf nicht mehr fordern, als sie einbringt.

**Und die Gegenrichtung gilt weiter:** Nach dem Michaelitag darf nicht zehn Jahre lang alles
bezahlbar sein. `STAND.md` §5 zeigt beide Enden derselben kaputten Kurve — 46× im ersten Jahr,
dann zehn Jahre unter 1×. **Die Kennzahl soll schwanken, nicht kippen.**

## 18 — Der Nenner der zweiten Latte gehört keinem Stück

**Vom Glättungslauf ausdrücklich der Aufsicht vorgelegt.** DER NAME hängt seit Welle 2 mit
drin und stellt in E1–E3 inzwischen den billigsten nächsten Zug („Umtrunk beim Wirt 9 Pf",
„Wirtshausschild anschlagen 70 fl"). Damit misst die Kennzahl der zweiten Latte plötzlich
gegen ein unfertiges Stück.

> **Entschieden: Der Nenner ist der billigste Zug, der die Lage des Hauses ändert — nicht der
> billigste Knopf.** Ein Umtrunk beim Wirt für 9 Pf ist Beiwerk; er gehört nicht in den
> Nenner, egal wem er gehört. In den Nenner gehört, was Rohstoff, Fass, Adresse, Bau oder
> Bindung bewegt.

Das ist keine Rüge an DEN NAMEN — sein Aufgeld ist Geld herein und hält den Deckel aus §4
ein. Es ist die Feststellung, dass eine Messlatte, die jedes neue Stück verstellen kann,
keine Messlatte ist.

## 19 — „Deckung" heißt ab sofort nur noch eines

Der Kern nennt die Kennzahl der zweiten Latte `.deckung`; DER NAME nennt seinen zweiten Balken
„Deckung 60". Zwei Bedeutungen in einem Bild.

> **Der Kern behält das Wort.** DER NAME benennt seinen Balken um — „Bekanntheit" oder was
> ihm besser passt, nur nicht „Deckung".

## 20 — DER PREIS liest den Ruf

Von DEM NAMEN zweimal gemeldet: `welt.haus.rufAufschlag` wird nicht gelesen, der Grundpreis je
Fass bleibt vom Ruf unberührt. Das ist die eine Naht, an der DER NAME überhaupt erst zu einer
Wirtschaftsmechanik wird statt zu einer Anzeige.

> **Auflage an DER PREIS:** den Ruf lesen. **Auflage an DEN NAMEN:** ihn nur setzen, nie einen
> Preis schreiben (WELLE-2.md, unverändert). Der Aufschlag zählt gegen keinen Deckel, weil er
> Geld herein ist.

## 21 — Die Michaeli-Rechnung sprengt den Deckel, und sie hängt an der falschen Zahl

**Vorgetragen von DER FUHRE, mit Messung über fünf Braujahre, bescheidener Spielstil.**
**Entschieden: Der Vorwurf trifft zu. DER PREIS muss zurück.**

Gemessen wurde, was jedes Stück vom Umsatz nimmt:

| Stück | erlaubt (§4) | gemessen |
|---|---|---|
| DIE FUHRE | 8 % | **8 %** in allen vier Epochen |
| DER PREIS | 5 % | **22 / 27 / 44 / 26 / 29 %** in E1 · **22 / 24 / 24 / 22 / 23 %** in E3 |

Das ist das Vier- bis Neunfache. Der Gesamtdeckel von 18 % ist damit von einem einzigen
Stück allein gesprengt.

### Die Zahl ist das kleinere Problem

Der Antrag benennt den eigentlichen Fehler, und der steht in einem Halbsatz:

> „…die Rechnung wächst mit dem Umsatz **UND mit der Kasse** (`pflichtHoehe`), also frisst
> sie jedes Geld, das ein anderes Stück an diesen Tag trägt."

**Eine Abgabe, die an der Barschaft hängt, ist keine Abgabe, sondern ein Schwamm.** Sie macht
jede Eichung des Michaelitags unmöglich — nicht schwierig, unmöglich —, weil sie genau das
Geld aufsaugt, das ihretwegen hingelegt wurde. Sie erklärt auch rückwirkend den Befund aus
`STAND.md` §2: dass die Kasse im Jahr auf das Vierfache steigt und Michaeli sie *vollständig*
nimmt. Das war kein Zufall und keine schlechte Balance; das ist die Formel.

> **Auflage an DER PREIS, beide Teile:**
> 1. **Keine Abgabe hängt an der Barschaft.** `pflichtHoehe` und alles ihm Verwandte werden
>    vom Kassenstand gelöst. Bemessungsgrundlage ist, was das Haus *umgesetzt* oder
>    *besessen* hat — Fässer, Adressen, Ausstoß —, niemals, was gerade in der Kasse liegt.
> 2. **Fünf Prozent, gemessen wie in §4.** Über ein Braujahr gemittelt, in jeder Epoche.

### Und eine Auflage, die nicht DEM PREIS gilt

DIE FUHRE konnte in E2 und E4 nicht zuordnen, „weil ihre Namen mir nicht gehören". Das ist
kein Vorwurf, sondern eine Lücke im Verfahren: **Wer der Kasse etwas entnimmt, schreibt seinen
Stücknamen an den Posten.** Sonst kann niemand den Deckel aus §4 nachrechnen, und ein Deckel,
den nur sein Übertreter nachrechnen kann, ist keiner.

> **Auflage an alle vier Stücke:** jeder Posten, der Geld aus der Kasse nimmt, trägt das
> Stück im Namen oder in einem Feld daneben. Rückwirkend für die bestehenden Posten.

### Was das für die Eichung heißt

DIE FUHRE steht bei E1 5/5, E2 4/5, E3 5/5, E4 4/5 — zwei Fehljahre bei einer Rechnung, die
ihr das Vierfache des Erlaubten wegnimmt. **Die Eichung wartet nicht auf DIE FUHRE, sie
wartet auf DEN PREIS.** Ist die Rechnung von der Barschaft gelöst und auf 5 % zurück, wird
die Eichung neu gemessen, bevor jemand weiter an ihr baut.

---

## 23 — Ein Blatt darf das Spiel nicht anhalten

**Vorgetragen von:** dem Builder von DER GEGNER, Runde 2, als Kernmeldung — er konnte seine
eigene Latte nicht messen, weil in 63 von 92 Wochen nichts von seinem Stück im Bild war.
**Nachgemessen von der Aufsicht, in allen vier Epochen, und schärfer bestätigt.**
**Entschieden:** Auflage an DIE FUHRE, sofort, vor allem anderen.

Der Befund, gemessen mit einem Spieler, der **nur WEITER klickt** — die einfachste Schleife,
die das Spiel kennt:

| Epoche | Das Spiel bleibt stehen in | Anteil des Fensters, den `.fu-sperre` deckt |
|---|---|---|
| 1 · 1350 | **1351 / Woche 1** | 100 % |
| 2 · 1600 | **1601 / Woche 1** | 100 % |
| 3 · 1884 | **1885 / Woche 1** | 100 % |
| 4 · 1970 | **1971 / Woche 1** | 100 % |

Der Sommerzettel der FUHRE legt sich zu Georgi über den ganzen Hof und geht nicht wieder weg.
WEITER liegt darunter und ist nicht mehr zu treffen. Herauszukommen ist nur über zwei Knöpfe,
die man kennen muss: `fuhre:jahresplan:grut` (oder `:duenn`) und danach `fuhre:sommer-zu`.
Wer das nicht weiß, für den ist die Partie nach **einem** Braujahr zu Ende — in jeder Epoche.

Das ist genau der Fehler aus `spiel/BEFUND-BRETTER.md`, eine Ebene höher: dort deckte ein
Brett das andere zu, hier deckt ein Blatt alles. Und es hat dieselbe zweite Wirkung: **es
fälscht jede Messung.** Die Prüfstände der Werkbank drücken beide Knöpfe, weil sie es aus dem
Quelltext wissen; ein Kritiker, der spielt, tut es nicht. Zwei Wellen lang haben Kritiker
gegen einen Bildschirm gemessen, der für einen Spieler stillstand.

> **Auflage an DIE FUHRE, drei Teile:**
> 1. **Der Sommerzettel darf WEITER nie verdecken.** Entweder er lässt das Feld frei, oder
>    WEITER liegt über ihm. Der Zettel ist eine Entscheidung, kein Riegel.
> 2. **Er muss sich ohne Vorwissen schließen lassen** — ein sichtbarer Knopf mit dem Wort
>    darauf, das ihn schließt, nicht zwei, die man erraten muss. §2 der ZUSTAENDIGKEIT hat
>    ihn als gewollten Halt bestätigt; gewollt ist der Halt, nicht die Sackgasse.
> 3. **Nachgewiesen wird es mit einem Lauf, der nur WEITER klickt**, über drei Braujahre in
>    allen vier Epochen. Kommt er durch, ist die Auflage erfüllt. Das Prüfmuster liegt als
>    `werkbank/schuss/eichung/erreichbar.mjs` daneben.

**Und eine Regel, die daraus folgt, für alle Stücke:** Ein Blatt, das den Bildschirm
formatfüllend deckt, gehört in `BRAUHAUS.lage`, wenn es länger liegt, als eine Entscheidung
dauert. Wer eines legt, legt auch den Weg heraus — sichtbar, in derselben Fläche.

## 24 · Wer einen Zug meldet, nennt seine Art — und seinen Schlüssel

`welt.meldeZug(was, preis, art, zug)` nimmt seit dem 2. August vier Argumente.
Der Kern hält **nicht mehr das Minimum**, sondern zuerst den höheren Rang:

    umkaempft 3 · bindung/adresse/bau 2 · lage 1 · alles ohne Art 0

Werbung ohne `art` verliert damit gegen jeden Zug, der die Lage des Hauses
ändert. Das war nötig, weil die Kopfzeile vierhundert Wochen lang denselben
festen Jahresposten nannte — 9 Pf / 18 fl / 240 M / 1.800 DM — und die Kennzahl
der zweiten Latte damit die Kasse mit anderer Beschriftung war (gemessen 2,1-
bis 32,8-fach neben dem billigsten umkämpften Zug). Alle vier Stücke der
Welle 2b haben diese Änderung unabhängig verlangt, DIE FUHRE schon in Welle 2.

**Das vierte Argument ist keine Zier.** Wer seinen Zugschlüssel mitschickt, wird
beim Wort genommen: `zugDeckung()` liefert `null`, wenn zu der Meldung kein
`[data-zug]` ohne `disabled` im Dokument steht. Eine Zahl, zu der am Bildschirm
kein bedienbarer Knopf gehört, ist keine Kennzahl, sondern eine Behauptung.

Gemessen nach der Änderung, Woche 1: **5,89× · 3,76× · 8,35× · 3,54×** statt
12,4× / 35,6× / 274,0× / 47,8×, und alle vier nennen einen umkämpften Zug.

---

## 25 · Jeder Knopf sagt, ob das SPIEL nein sagt — nicht nur, dass er tot ist

`disabled` trägt zwei Dinge zugleich: die Regel des Spiels *und* jede Verdeckung,
die ein anderes Stück später darüberlegt. Wer aktive Züge zählt, zählt damit
etwas anderes, als er glaubt — und genau das ist **Spalte (a) der zweiten
Messlatte**.

Deshalb setzt `B.knopf()` in `kern/buehne.js` ab sofort an **jedem** Knopf:

```js
k.setAttribute('data-soll-aus', opt.aus ? '1' : '0');
```

- **`data-soll-aus="1"`** — das Spiel sagt nein. Zu teuer, falsche Zeit, schon
  festgelegt.
- **`data-soll-aus="0"` bei `disabled`** — das Spiel erlaubt es, aber der Knopf
  ist verdeckt oder weggeklappt. **Das ist ein Fehler**, kein Zustand.
- `disabled` bleibt die **Summe** aus beidem und wird nicht angetastet.

**Wer zählt, sagt dazu, was er gelesen hat.** Eine Zahl aus `disabled` ist eine
Untergrenze; eine Zahl aus `data-soll-aus` ist die Aussage über das Spiel.

**Gemessen am 3. August 2026**, vier Epochen, Woche 1:

| | vorher | nachher |
|---|---|---|
| Züge mit `data-soll-aus` | 55 von 440 (12,5 %) | **395 von 440 (89,8 %)** |
| gesperrt **ohne jede Auskunft** | 13 / 20 / 20 / 14 | **0 / 0 / 0 / 0** |

Die ungeklärten Fälle kamen ausnahmslos aus `fuhre:*`. Kein Stück musste dafür
etwas ändern — sie bauen alle über `B.knopf()`. Die verbleibenden gut zehn
Prozent sind Knöpfe, die nicht über `B.knopf()` entstehen; **keiner davon ist
gesperrt ohne Auskunft**.

Vorgeschlagen und gemessen begründet von **DER SUD** (Welle 4), eingearbeitet von
der Aufsicht zwischen den Wellen. Nachprüfbar mit
`werkbank/schuss/aufsicht/deckung.mjs`.
