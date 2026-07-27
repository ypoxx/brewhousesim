# Votum — Der Spieldesigner, über den gebauten Dummy

Grundlage: `prototyp/klickdummy.html`, gespielt statt gelesen — jeder erreichbare Zustand
angeklickt, danach der Quelltext auf das geprüft, was das Klicken nahegelegt hat. Das Votum
des Gestalters kenne ich; es beurteilt das Bild, ich beurteile das Werk dahinter. Wir
widersprechen einander an genau einer Stelle, und ich sage dazu, wo.

**Mein Maßstab, damit man mich nachprüfen kann.** Ich prüfe drei Dinge und sonst nichts:

1. **Kostet die Bedienung etwas?** Ein Schalter, der nichts verbraucht und sich zurücknehmen
   lässt, ist eine Ansicht, keine Entscheidung — egal wie schön er aussieht.
2. **Läuft eine Uhr?** Ohne Zeit gibt es keine Reihenfolge, ohne Reihenfolge keine
   Verpflichtung, ohne Verpflichtung kein Spiel. Nur einen Konfigurator.
3. **Kann ich verlieren, während ich nichts falsch mache?** Ein System ohne Verfall ist ein
   Katalog. Verfall ist der billigste Motor, den es gibt, und der einzige, der ohne neuen
   Inhalt weiterläuft.

---

## 1. Das Urteil, vorweg

**Der Dummy beweist, was er beweisen sollte, und widerlegt dabei versehentlich das, worauf
der ganze Entwurf steht.** Er besteht Prüfung 1 nicht, Prüfung 2 nicht, Prüfung 3 nicht — und
das ist in Ordnung, denn er ist ein Klickdummy und behauptet nichts anderes. Nicht in Ordnung
ist, **was** er dabei über die Systeme verrät:

> **Die gefeierte Sekunde — Sorte klicken, rote Linie springt, zwei Häuser verlöschen — ist
> mechanisch ein Schwierigkeitsregler. Und zwar genau der, gegen den mein Votum zum Konzept
> geschrieben wurde.**

Drei Sorten stehen nebeneinander. Exportbier hält 90 Tage und trägt 60 km. Landbier hält 10
Tage und trägt 6 km. Und in der ganzen Datenstruktur steht **kein einziger Grund**, jemals
etwas anderes als Exportbier zu wählen: kein Preis, kein Brautag, kein Fassplatz, kein
Malzkontrakt, keine Reifezeit. Der Schalter ist gratis und beliebig oft umlegbar.

Damit ist die schönste Bewegung des Prototyps zugleich die dominanteste Strategie des Spiels:
*ganz nach unten klicken und nie wieder anfassen.* Der Gestalter hat diese Sekunde zu Recht
gelobt — sie ist ein hervorragendes **Bild**. Sie ist eine miserable **Regel**. Das ist unser
einziger Dissens, und er ist kein Widerspruch: derselbe Klick, zwei Prüfungen, zwei Ergebnisse.

---

## 2. Was der Dummy tatsächlich bewiesen hat

Ehrlichkeit zuerst, sonst zählt die Härte nicht.

- **Die Zeichnung kann Zustand tragen.** Rote Linie und Geisterhäuser sind der Beleg. Der
  Entwurf braucht keine Zahlenleiste, um eine Grenze zu zeigen. Das ist die teuerste offene
  Frage des Verfahrens gewesen und sie ist beantwortet.
- **Die Bauteilrechnung trägt.** Fass, Figur, Ausleger, Kessel, Haus — fünf Teile, aus denen
  sich zwei Brauereien, fünf Wirtshäuser und drei Erklärbilder zusammensetzen.
- **Eine Wahl kann auf ein anderes Blatt durchschlagen.** Keller gewählt, Linie verschiebt
  sich, Altenau erwacht. Der Mechanismus dafür steht und ist elf Zeilen lang.

Das ist ein voller Erfolg für einen Nachmittag Arbeit. Es ist nur eben ein Erfolg über
**Darstellung**. Über das Spiel weiß ich nach dem Dummy exakt so viel wie vorher.

---

## 3. Sieben Befunde, jeder am Werk nachweisbar

### 3.1 Der Zustand ist vier Variablen groß, und zwei davon sind Navigation

`blatt`, `sorte`, `wirt`, `wahl`. Das ist die ganze Welt. Zwei sagen, wo ich hinsehe. Zwei
sagen, was ich getan habe. Nichts davon summiert sich, nichts erinnert sich, nichts verbraucht
sich.

### 3.2 Es gibt keine Uhr, aber ein Uhrband auf jedem Blatt

Das Braujahrband ist das **einzige Bauteil, das auf allen drei Blättern steht** — und es ist
das einzige, das nichts tut. Ein roter Winkel auf einem festen Monat, dreimal verschieden
gesetzt, nie bewegt.

Der ganze Entwurf ruht darauf, dass Zeit die Knappheit ist, die sich mit Reichtum nicht
auflöst: Brautage, Reifezeit, zwei Winter Bauzeit, Vertragsfenster, Erbfall. **Der Dummy
zeichnet die Uhr und lässt sie stehen.** Das ist nicht nur eine fehlende Funktion, es ist die
fehlende Funktion — alles, was mein Konzeptvotum vorgeschlagen hat, hängt daran.

### 3.3 Die einzige echte Entscheidung löst sich selbst — im eigenen Kleingedruckten

Blatt 8 stellt drei Wege gegen 16 400 M. Es kostet: 16 000 / 15 200 / 9 400. Jede Wahl frisst
57 bis 98 Prozent der Kasse, deshalb schließt jede die anderen beiden aus. Das ist keine
Ökonomie, das ist ein Kreuzchen mit drei Feldern — und der Zustand „noch eines möglich", den
der Balken kennt, kann rechnerisch nie eintreten.

Schlimmer ist die Schlusszeile jeder Spalte. Sie enthält kein Faktum, sondern ein Urteil:

| Weg | Schlusszeile | Was sie tut |
|---|---|---|
| Keller | *„Der Keller zahlt erst nach 1890."* | schreckt ab |
| Häuser | *„Nimmst du sie nicht, nimmt sie der Adler."* | droht |
| Depot | *„Leer, solange das Bier nur 24 km weit kommt."* | schließt aus, solange kein Keller |

Zwei von drei Wegen werden dem Spieler als schlecht angesagt, und der dritte wird an den
ersten gebunden. Damit ist die Reihenfolge vorgegeben: Keller, dann Depot. **Das Blatt
bewertet an Stelle des Spielers.** Eine Entscheidung, deren Bewertung mitgeliefert wird, ist
eine Anleitung.

### 3.4 Der einzige Mensch mit einem Wunsch und einem Preis kommt auf dem Entscheidungsblatt nicht vor

Auf Blatt 6 sagt Michael Berger: *„Das Dach muss neu. 3 000 Mark. Wer es zahlt, bekommt den
Hahn."* Ein Name, ein Bedürfnis, ein Preis, eine Gegenleistung — das ist eine vollständige
Spielhandlung, aufgeschrieben und angeheftet.

Darunter sitzt ein Knopf: **WAS DARAUS FOLGT → Blatt 8.** Man klickt, und auf Blatt 8 stehen
drei Wege zu 16 000, 15 200 und 9 400 Mark. **Das Dach für 3 000 ist nicht dabei.**

Der Dummy führt den Spieler von der konkretesten Bitte des ganzen Materials direkt auf ein
Blatt, das sie ignoriert. Das ist die schärfste Auskunft, die dieser Prototyp gibt: die
**Größenordnung der Entscheidungen passt nicht zur Größenordnung der Welt.** Alle Züge sind
Jahrhundertinvestitionen; die Welt spricht in Dreitausendern.

### 3.5 Der Gegner ist eine Behauptung

21 400 hl gegen unsere 13 750. 74 Häuser gegen 49. Drei Kessel gegen zwei — der Dummy hat ihn
sogar größer gezeichnet als uns, das ist gut gesehen. Und er tut nichts. Er wirbt in Prosa
(*„Adler, dreimal seit Ostern"*, *„Adler, 14 000 M geboten"*), er droht in Prosa (*„Nimmst du
sie nicht…"*), und keine dieser Drohungen kann je eingelöst werden, weil es kein Nachher gibt.

Ohne Gegenbewegung ist jede Ausgabe ein Einkauf, keine Verteidigung. Und Einkäufe kann man
aufschieben.

### 3.6 Die beste Zahl des ganzen Verfahrens steht als Text da

`hl 82 . 83 . 84` — **210 . 180 . 140** bei der Krone. Fallend, drei Jahre lang, ohne dass
jemand angegriffen hätte. Mein Konzeptvotum nennt genau diese Reihe das Wetter, das dieses
Marktmodell braucht: *man kann verlieren, ohne angegriffen worden zu sein, und man sieht es
drei Jahre vorher.*

Im Dummy ist es eine Zeichenkette in einer Tabelle. Sie fällt nicht, sie steht. Die Ochsen
stehen bei 260 · 255 · 251, die Post steigt bei 310 · 318 · 331 — drei Kurven, die eine
Geschichte erzählen und nie ausgewertet werden.

### 3.7 Nichts ist unwiderruflich, und die meistbenutzte Bedienung ist gratis

Ein zweiter Klick auf einen Weg nimmt ihn zurück. Die Sorte lässt sich beliebig wechseln. Kein
Zustand rastet ein.

Und: **die Reiterleiste ist der am häufigsten benutzte Schalter des Dummys und der einzige,
der im fertigen Spiel Geld kosten müsste.** Zum Wirt zu fahren ist im Jahr 1884 eine Reise,
eine Anwesenheit, eine Woche, in der man nicht beim Fass steht. Im Dummy ist es ein Reiter,
oder die Taste 2. Der Prototyp verschenkt seine knappste Ressource als Navigation.

---

## 4. Die nächste Stufe — fünf Braujahre auf einem Blatt

Der Vorschlag ist absichtlich klein und absichtlich unbequem: **kein neues Blatt, keine neue
Zeichnung, keine vierte Epoche. Blatt 5 existiert — lasst es fünfmal laufen.**

Die Begründung in einem Satz: *Wenn fünf Braujahre nicht tragen, tragen siebenhundert Jahre
auch nicht — sie sind dann dieselben fünf, hundertvierzigmal.*

Sechs Eingriffe, in der Reihenfolge, in der ich sie bauen würde.

### Eingriff 1 — Die Sorte kostet Platz und Zeit *(der zwingende)*

Der Sortenschalter hört auf, eine Ansicht zu sein, und wird eine **Belegung**. Das Blatt hat
den Zähler schon gezeichnet und nie verdrahtet: **fünfzehn Fassplätze liegen im Keller,
sichtbar, abzählbar.** Dazu die Brautage des Jahres.

| Sorte | Brautage | Fassplätze | Belegt bis | Trägt |
|---|---|---|---|---|
| Landbier | 1 | 1 | vier Wochen | 6 km |
| Märzen | 2 | 2 | in den Sommer | 24 km |
| Exportbier | 3 | 3 | ein halbes Jahr | 60 km |

Damit ist die Frage nicht mehr *„welches Bier ist das beste"* — sie hat keine Antwort mehr,
weil sie falsch gestellt war. Die Frage wird: **wie viel von meinem Keller lege ich für ein
halbes Jahr fest, um drei Adressen zu erreichen, die ich vielleicht verliere, bevor das Bier
fertig ist?**

Und die rote Linie wird zu etwas Besserem als einer Linie: **nicht mehr *so weit hält das
Bier*, sondern *so weit reicht der Teil meines Kellers, den ich dafür geopfert habe.*** Drei
Linien statt einer, verschieden dick, je nachdem wie viele Plätze dahinterstehen. Kein neues
Bauteil — dieselbe Linie, dreimal, mit einer Stärke.

Ohne diesen Eingriff ist jeder weitere sinnlos.

### Eingriff 2 — Michaeli schließt das Jahr, und Blatt 8 ist kein Blatt

Ein einziger Schalter: **das Jahr schließen.** Das Band rückt, die Fässer leeren sich, die
Verträge altern um eins.

Und damit die Struktur-Korrektur: **Blatt 8 ist kein Blatt, sondern ein Zeitpunkt.** Solange
man es jederzeit über einen Reiter besuchen kann, hat die Entscheidung kein Gewicht — man kann
sie ansehen, ohne sie zu treffen. Sie darf nur zu Michaeli erscheinen, sie muss beantwortet
werden, und sie ist danach zu. Dasselbe gilt in Klein: **Blatt 6 ist kein Blatt, sondern ein
Besuch** — drei Besuche im Jahr, und wer bei der Krone steht, steht nicht bei der Post.

Damit sind zwei Reiter aus der Navigation entfernt und in die Ökonomie überführt, und die
Aufmerksamkeitsknappheit aus meinem Konzeptvotum ist gebaut, ohne dass ein Punktekonto
erfunden werden musste.

### Eingriff 3 — Adressen verlangen, und wer nicht liefert, verliert Absatz

Jedes Haus bekommt zwei Zahlen, die es beide schon hat: einen Jahresbedarf in hl und ein
Fenster, in dem er anfällt (der Löwen will am Freitag, die Post im Sommer).

Eine Regel: **Wer nicht liefert — falsches Bier, zu weit, Keller leer im Juli —, dessen hl-Reihe
fällt, sichtbar, in der Tabelle, die schon existiert.** 210 · 180 · 140 wird von einer
Zeichenkette zu einem Verlauf.

Das ist der billigste Motor im ganzen Entwurf: Verlust ohne Gegner, Frühwarnung ohne Kennzahl,
Qualitätsrückkopplung ohne Sternebewertung. Und er kostet null Zeichnung.

### Eingriff 4 — Der Adler zieht einmal im Jahr, ein Jahr vorher angekündigt

Zu Michaeli setzt der Adler ein kleines graues Schild an ein Haus. Zu Michaeli des Folgejahres
kippt dieses Haus, **wenn nichts geschieht.** Ein Zug, ein Jahr Vorwarnung, sichtbar.

Auch hier: kein neues Bauteil. Der kleine graue Ausleger für `umworben` ist gezeichnet und
hängt bereits an der Krone und am Löwen. Er muss nur wandern dürfen.

Erst damit werden die Ausgaben aus Blatt 8 zu **Verteidigungen** statt zu Einkäufen — und erst
damit hat Aufschieben einen Preis.

### Eingriff 5 — Die Kasse wird teilbar, die Welt spricht in Dreitausendern

Die heutige Skala erlaubt genau einen Zug im Jahr. Richtig wäre: **zwei bis drei bedeutende
Züge**, mit ungleichen Größen — damit es Portfolios gibt und nicht nur Kreuzchen.

Und das Dach der Krone für 3 000 M steht auf demselben Zettel wie der Keller für 16 000. Ein
kleiner sicherer Zug neben einem großen langsamen ist die älteste funktionierende
Entscheidungsform, die es gibt, und der Dummy hat beide Hälften schon geschrieben — nur auf
zwei Blättern, die einander nicht kennen.

### Eingriff 6 — Zwei Winter sind zwei Winter

Der Keller bindet zwei Jahre, und in einem davon wird nicht gebraut — das steht bereits als
Faktenzeile auf Blatt 8 (*„Ein Winter Stillstand, 3 200 hl weniger"*) und ist die einzige
Zeile im Dummy, die von sich aus eine Uhr braucht. Sobald das Jahr läuft, ist sie umsonst
gebaut: zwei Runden gebunden, eine Runde leerer Keller, und alle Adressen jenseits von 6 km
werden in diesem Winter von jemand anderem beliefert.

**Wer den Keller wählt, bezahlt ihn mit Adressen, nicht mit Geld.** Das ist die Sorte
Verpflichtung, um derentwillen man ein Spiel und keinen Konfigurator baut.

---

## 5. Was ausdrücklich *nicht* gebaut wird

- **Keine vierte Epoche, kein Reich, keine Karte.** Nichts davon lässt sich prüfen, bevor ein
  einzelnes Jahr trägt.
- **Kein neues Blatt.** Der Dummy hat drei; nach Eingriff 2 hat er eines und zwei Zeitpunkte.
  Das ist weniger, und es ist mehr.
- **Kein Erbfall.** Er ist der stärkste Vorschlag meines Konzeptvotums und er ist hier
  verfrüht: Ein Erbfall entbindet Verträge, und Verträge müssen erst etwas wert sein.
- **Keine Personen mit Lohn und Lebensdauer.** Ebenfalls richtig, ebenfalls später. Eingriff 2
  liefert die Aufmerksamkeitsknappheit vorerst räumlich, und das genügt für fünf Jahre.
- **Keine zweite Grafikrunde.** Die Befunde des Gestalters sind zu beheben — sie kosten
  zusammen einen Tag —, aber kein einziger neuer Baustein wird gezeichnet, bevor das Jahr läuft.

---

## 6. Drei Prüfsteine, an denen die nächste Stufe abzunehmen ist

Ich nenne sie vorher, damit sie nicht nachträglich passend gemacht werden.

1. **Ein Spieler braut im dritten Braujahr freiwillig Landbier und kann sagen, warum.**
   Heute ist Landbier strikt dominiert. Wenn die kurze, billige, schnell frei werdende Sorte
   nie richtig ist, ist der Sortenschalter immer noch ein Regler, egal wie viele Zähler
   danebenstehen.

2. **Es gibt ein Jahr, in dem „nichts kaufen" die richtige Antwort ist.**
   Ein Entscheidungsblatt, auf dem Nichtstun nie stimmt, ist ein Bezahlvorgang.

3. **Ein Spieler verliert eine Adresse, ohne dass der Adler sie genommen hat** — und sieht in
   der hl-Reihe, dass es zwei Jahre vorher angefangen hat.
   Bis das passiert, ist das Marktmodell eine Einkaufsliste.

Ein vierter, den ich nicht zum Prüfstein mache, weil er zu leicht zu erfüllen ist, aber
notieren will: **es muss mindestens eine Lage geben, in der es richtig ist, einen Wirt nicht
zu besuchen.** Sonst ist der Besuch keine Ressource, sondern eine Pflicht.

---

## 7. Der Preis meines Vorschlags

**1. Es sieht nach Rückschritt aus.** Drei Blätter werden zu einem Blatt und zwei Zeitpunkten.
Wer den Dummy heute zeigt, zeigt mehr Fläche als nach Eingriff 2. Das ist der Preis dafür, aus
einer Mappe ein Spiel zu machen, und man wird ihn erklären müssen.

**2. Die schönste Sekunde wird unbequemer.** Nach Eingriff 1 springt die rote Linie nicht mehr
frei, sondern gegen einen Widerstand. Der erste Eindruck des Prototyps wird dadurch schwächer
und sein dritter Eindruck stärker. Ich empfehle das im vollen Bewusstsein, dass die
Vorführbarkeit leidet.

**3. Fünf Jahre können langweilig sein und trotzdem richtig gebaut.** Der Bogen dieses
Entwurfs lebt von Epochenbrüchen; fünf Jahre in einer Epoche zeigen davon nichts. Wer nach
fünf Jahren urteilt, urteilt über die Schleife, nicht über das Spiel. Das muss vorher gesagt
sein, sonst wird das Ergebnis falsch gelesen.

**4. Und der Preis, der nicht mir gehört:** Diese Stufe kostet ungefähr so viel Arbeit wie der
gesamte bisherige Dummy — und sie erzeugt kein einziges neues Bild. Nichts davon lässt sich
vorzeigen, außer als gespielte Minute. Wer sichtbaren Fortschritt braucht, wird diese Stufe
hassen.

---

## 8. Die Schlussfrage — ein Satz

> **Baut die Uhr, bevor ihr noch ein Blatt baut — und verdrahtet zuerst die fünfzehn
> Fassplätze, die ihr längst gezeichnet habt: solange die Sorte nichts belegt, ist eure beste
> Sekunde ein Schieberegler mit einer sehr guten Zeichnung darauf.**

*Gezeichnet: der Spieldesigner. Beurteilt wurde, was das Werk tut, nicht was auf ihm steht.*
