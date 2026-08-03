# DER SUD — Welle 4, Bericht des Builders

*Alles hier ist am Bildschirm gezählt — Playwright, Chromium, 1920×1000,
`?epoche=1..4&saat=1350`, echte Mausklicks, `elementFromPoint`. Kein Satz
dieses Berichts stammt aus dem Quelltext allein.*

Die Frage der Welle lautete: **wird gebraut, und entscheidet man dabei etwas?**
Die kurze Antwort nach der Messung: gebraut wird, entschieden wurde **nichts** —
nicht weil es keine Entscheidung gäbe, sondern weil sie in einer sorgfältig
gespielten Partie fast nie bedienbar am Bildschirm stand, und weil das Siegel,
das sie unwiderruflich machen sollte, in **keiner** der vier Epochen hielt.

---

## 0 · Wie gemessen wurde, und wogegen

`werkbank/schuss/sud-w4/linie.mjs` ist die sorgfältige Linie aus
`werkbank/schuss/eichung/preis-linie.mjs` — dieselbe Hand, dieselben Griffe,
dieselben 400 Wochen (vierzehn Braujahre) — mit **einer** Ergänzung: sie zählt
jede Woche, welche `sud:`-Knöpfe am Bildschirm stehen, welche davon **aktiv**
sind und welche die Maus **trifft**, und schreibt daneben, was aus dem Bier
geworden ist (Verfahren, Güte, Bottiche, Sude, Fass, zurückgestufte Bottiche,
höchste Sorte).

Zwei Spielstile werden hier berichtet:

| Stil | was die Hand tut |
|---|---|
| `blind` | genau die Linie der EICHUNG — sie fasst das Sudhaus **nie** an |
| `braut` | dieselbe Hand, die zusätzlich die Hefe führt und Gärraum kauft |

**Der Nullpunkt ist `blind`**, und er ist der wichtige: er misst, wie oft das
Spiel den Spieler beim Bier *fragt*, ohne dass der Spieler danach sucht.

Für die Frage des Kritikers — *„zwei Partien derselben Epoche mit verschiedenem
Bier"* — ist ein eigenes Gerät zuständig, `sud-w4/zweipartien.mjs`: es spielt
dieselbe Saat zweimal, schlägt das Sudbrett ausdrücklich auf und nimmt einmal
die **teure Festlegung**, einmal die **kostenlose Abkürzung**. `linie.mjs` kann
das nicht zuverlässig, weil es seine Knöpfe unter den *nicht abgeschalteten*
sucht und das Sudbrett im Vorgabestand zugeklappt und damit abgeschaltet ist —
genau der Befund aus 1.2.

**Die „Vorher"-Zahlen sind gegen einen eingefrorenen Stand auf Hafen 8901
gemessen** (Kopie des Arbeitsbaums von 11:12 UTC), die „Nachher"-Zahlen gegen
den Arbeitsbaum auf 8899. Das war nötig, weil ich in denselben Dateien baue,
die ich messe. **Einschränkung, die dazugehört:** in denselben Stunden bauen
DIE RÜCKKOPPLUNG (`preis*`) und DER KLANG (`klang*`/`ton`) am selben
Arbeitsbaum. Die Startkasse von 1600 hat sich zwischen zwei meiner Messungen
von 640 fl auf 490 fl bewegt, ohne dass ich sie angefasst hätte. Wo Zahlen
dieses Berichts davon wandern könnten, steht es dabei.

---

## 1 · VORHER — was gemessen wurde

### 1.1 Das Siegel hielt in **null** von vier Epochen

Der Befund des Kritikers der Runde 1 lautete: „unwiderruflich" hält in drei von
vier Epochen nicht, nur 1884 hält Wort. **Nachgemessen mit
`werkbank/schuss/sud-w4/siegel.mjs`: es hält in keiner.** Sechs bezahlte
Festlegungen, sechsmal derselbe Ablauf — kaufen, sofort auf die Vorgabe
zurückklicken, wieder hin, sechs Wochen spielen, nochmals zurück:

| Epoche | Festlegung | bezahlt | sofort zurück | wieder hin | nach 6 Wochen zurück |
|---|---|---|---|---|---|
| 1350 | Hopfenbrief 78 Pf | ✓ | **ging** | **gratis** | **ging** |
| 1600 | Felsenkeller 260 fl | ✓ | **ging** | **gratis** | **ging** |
| 1884 | Kältemaschine 9.800 M | ✓ | **ging** (über `warm`) | **gratis** | **ging** |
| 1884 | Reinzuchthefe 3.400 M | ✓ | **ging** | **gratis** | **ging** |
| 1970 | Betriebslabor 42.000 DM | ✓ | **ging** | **gratis** | **ging** |
| 1970 | Tunnelpasteur 74.000 DM | ✓ | **ging** | **gratis** | **ging** |

Warum 1884 dem Kritiker heil vorkam: dort steht `sperrt: ['natureis']` an der
Kältemaschine. Wer von der Maschine auf **Natureis** zurückklickt, wird
abgewiesen — wer auf **„Ohne Kühlung durchgären lassen"** klickt, nicht. Und
die zweite Achse derselben Epoche (Betriebshefe ↔ Reinzucht) hatte gar keine
Sperre. Der Fund war also nicht drei von vier, sondern **sechs von sechs**.

Die Ursache steht in einer Zeile: `Z.fest` merkte sich, dass **bezahlt** wurde,
und `bezahlt()` machte die Option danach zur *kostenlos umschaltbaren*. Bezahlt
ist aber nicht festgelegt. Ein Siegel, das man abziehen kann, ist ein Aufkleber.

### 1.2 In vierzehn Jahren wurde beim Bier **nichts** entschieden

Vier Läufe `blind`, je 400 Wochen, vierzehn Braujahre, 0 Seitenfehler:

| Epoche | Wochen mit **≥ 2** aktiven, treffbaren Bierknöpfen | verschiedene Bierzüge in 400 Wochen | Verfahren am Ende | bezahlte Festlegungen | zurückgestufte Bottiche |
|---|---|---|---|---|---|
| 1350 | **89** von 400 | **2** | Vorgabe (Grut) | **0** | **0** |
| 1600 | **28** von 400 | **2** | Vorgabe (rein · obergärig) | **0** | **0** |
| 1884 | **71** von 400 | **2** | Vorgabe (Natureis · Betriebshefe) | **0** | **0** |
| 1970 | **196** von 400 | **2** | Vorgabe (Erfahrung · naturtrüb) | **0** | **0** |

Die beiden „verschiedenen Bierzüge" sind in allen vier Epochen **dieselben zwei
Knöpfe des Kesselzettels** — `sud:zettel-wechsel-frei` und
`sud:zettel-wechsel-kauf`. Das Sudbrett mit den eigentlichen Achsen liegt im
Vorgabestand zugeklappt, und ein zugeklapptes Brett schaltet seine Knöpfe ab:
**in 400 von 400 Wochen war kein einziger Achsknopf (`sud:wuerze:*`,
`sud:gaerung:*`, `sud:kaelte:*`, `sud:fuehrung:*` …) aktiv.**

### 1.3 Der Kesselzettel stand im Bild und konnte nichts

Das ist der schwerste Fund, und er erklärt die Zahlen aus 1.2:

| Epoche | Kesselzettel im Bild | davon: **kein** Wechselknopf bedienbar |
|---|---|---|
| 1350 | 400 von 400 | **305** |
| 1600 | 393 von 400 | **365** |
| 1884 | 349 von 400 | **275** |
| 1970 | 240 von 400 | **43** |

Der Zettel stand also da, sichtbar (`.sud-zettel` ohne die Klasse `beiseite`),
und man konnte nichts an ihm tun.

Der Zettel hängt am Sudhaus; über dem Sudhaus liegen die Anschlagtafel und die
Häusertafel DER FUHRE. Sie decken seine **untere** Hälfte, also genau die
Knöpfe. Die Selbstprüfung des Stücks (`fremdVerdeckt`) fragte aber nur **einen
Punkt** ab — den Mittelpunkt des Zettels — und meldete „frei", während jeder
einzelne Knopf darunter von `elementFromPoint` nicht mehr getroffen und von
`schalte()` abgeschaltet wurde. Ein Zettel, der dasteht und nichts kann.

Zum Vergleich, dieselbe Epoche, dieselbe Saat, **erste 60 Wochen**:

| 1350, erste 60 Wochen | Wochen mit ≥ 2 aktiven Bierknöpfen |
|---|---|
| sorgfältige Linie (schlägt fremde Bretter auf) | **3** von 60 |
| nur WEITER (schlägt nichts auf) | **60** von 60 |

Der Fehler traf also genau den Spieler, der das Spiel benutzt.

### 1.4 Die Güte war eine Zahl ohne Folge

In **allen vier** Epochen fällt die Güte im ersten Braujahr von 70 auf ihren
Boden **25** und bleibt dort vierzehn Jahre. Am Bildschirm ändert sich dadurch
nichts: die Güte hing nur am Fehlsud (der einen Bottich braucht) und an der
Streuung (die es nur 1970 gibt).

Und in **1350 läuft über 400 Wochen kein einziger Sud durch den Gärkeller** —
`gesamtSude: 0`, `gesamtFass: 0` —, weil Grutbier keine Gärwochen hat und das
Vorgabeverfahren keine hinzufügt. Dort war der ganze Apparat des Stücks tot:
kein Bottich, kein Fehlsud, keine Erntehefe, kein Grund, Gärraum zu kaufen. Die
wöchentliche Hefeentscheidung kostete ein Fass von zwölfen und kaufte damit
**nichts**.

Der Beleg dafür ist der Stil `braut` gegen den Stil `blind`, dieselbe Epoche,
dieselbe Saat, 400 Wochen — der einzige Unterschied ist, dass die Hand die Hefe
jede Woche führt:

| 1350 | Güte am Ende | Sude | Fass | Kasse am Ende |
|---|---|---|---|---|
| `blind` — Hefe nie angefasst | 25 | 0 | 0 | **136 Pf** |
| `braut` — Hefe jede Woche geführt | **98** | 0 | 0 | **79 Pf** |

Die Pflege kostete 57 Pf in Bier und **änderte sonst nichts**: derselbe Rang,
derselbe leere Gärkeller, dieselbe Sorte im Keller. Dasselbe in 1600: Güte 25 →
98, Fass 1.278 → 980, Kasse 5.264 → 2.967 fl. **Die einzige wöchentlich
wiederkehrende Entscheidung des Stücks war streng schlecht.**

### 1.5 Die epocheneigene Entscheidung von 1970 war unerreichbar

`sud:charge-frei:*` / `sud:charge-schnitt:*` — zwei Antworten, zwei Preise, eine
Frist von vier Wochen. Gemessen mit `werkbank/schuss/sud-w4/charge.mjs`, 1970,
200 Wochen mit nichts als WEITER: **8 Wochen mit gesperrter Charge, davon 0 mit
beiden Antworten bedienbar.** Sie hängen allein am zugeklappten Brett; nach vier
Wochen gibt der Braumeister von selbst frei. Die Entscheidung, die 1970 von
allen anderen Epochen unterscheidet, fiel ohne den Spieler.

### 1.6 Ein Verstoß gegen ZUSTAENDIGKEIT §24

`meldeZug()` rief `B.welt.meldeZug(was, preis)` mit **zwei** Argumenten — ohne
`art` und ohne `zug`. Damit meldete DER SUD in jeder Woche einen Preis für den
„nächsten sinnvollen Zug", auch dann, wenn sein Brett zugeklappt und jeder
seiner Knöpfe abgeschaltet war: eine Zahl, zu der am Bildschirm kein bedienbarer
Knopf gehört — nach §24 wörtlich „keine Kennzahl, sondern eine Behauptung".

---

## 2 · GEBAUT

Alles in `spiel/stuecke/sud.js` und `spiel/stil/sud.css`. Keine fremde Datei
angefasst, kein `git`, `index.html` und `kern/**` unberührt.

### 2.1 Das Siegel hält — als Ratsche, nicht als Wand

`gesiegelt(a)` liefert die **teuerste bezahlte** Festlegung einer Achse.
`verdraengt(a, o)` sperrt daraufhin alles, was nicht sie selbst und nicht
*teurer und ebenfalls unwiderruflich* ist. Nach unten geht es nie mehr zurück;
nach oben bleibt der Weg offen, damit 1970 die Leiter *Erfahrung → Labor →
Prozessrechner* eine Leiter bleibt und keine Sackgasse.

Sichtbar gemacht: über der Achse steht eine Siegelzeile („*Anlage abgenommen:
Betriebslabor … Zurück geht es nicht — nur noch weiter hinauf.*"), die
verdrängten Karten tragen das Schild „**das Siegel liegt darauf**", und der
Kaufknopf sagt schon im Titel, dass die Vorgabe danach nicht mehr zu haben ist.

### 2.2 Der Kesselzettel sucht sich seinen Platz

`fremdVerdeckt()` (ein Punkt) ist ersatzlos gestrichen. An seiner Stelle stehen
`zettelSitzt()` und `stelleZettel()`: geprüft wird **jeder eigene Knopf**, und
zusätzlich, dass der Zettel **keinen fremden Zug begräbt** — dieselbe Regel, die
sich das Sudbuch auf seiner Klappe schon selbst auferlegt hat. Sitzt er
schlecht, geht er acht Stellen **am Sudhaus** durch (alle in Prozent, alle über
`B.orte.setze`) und bleibt an der ersten stehen, die trägt. Trägt keine, tritt
er wie bisher zurück.

### 2.3 Die Hefe ist eine Wahl mit zwei Knöpfen, jede Woche

Vorher trug der Zettel dafür **einen** Knopf, das Brett die anderen — und das
Brett ist zu. Jetzt stehen sie nebeneinander und schließen einander aus (die
Hefe wird einmal je Woche gezogen):

| | linker Knopf | rechter Knopf |
|---|---|---|
| es gärt etwas | führen · **+8** · ohne Fass | junges Fass · **+14** · 1 Fass |
| es gärt nichts | junges Fass · **+14** · 1 Fass | ältestes Fass · **+6** · 1 Fass |

Der Preis steht in **Bier**, nicht in Münze — DER SUD nimmt kein Geld aus der
Kasse (WELLE-2 §1, Abgabendeckel §4) — und deshalb im Wort auf dem Knopf.

### 2.4 Die Güte hat jetzt eine Folge, und sie steht am Bildschirm

`hefeFaktor()` = `1 + max(0, Güte − 60)/100 × 0,5`. Jedes Fass bekommt beim
Einlegen **einmal** den Stempel der Güte dieser Stunde; bei 100 hält es ein
Fünftel länger. **Nur nach oben:** bei 60 und darunter ist der Faktor 1,00, also
genau der vorgefundene Zustand — wer das Brett nie aufschlägt, verliert dadurch
keinen Pfennig. Am Zettel steht „`Zeug 78 % · Fass ×1,09`", am Brett die Zeile
„*Was jetzt eingelegt wird, hält ×1,09 — die Hefe steht.*"

### 2.5 Die gesperrte Charge steht auf dem Zettel (1970)

Solange eine Charge gesperrt ist, nimmt sie den Platz der kostenlosen
Umstellung: `sud:zettel-charge-frei` und `sud:zettel-charge-schnitt`,
nebeneinander, mit Nummer, Abweichung und Verlustmenge. Neue, eigene
Zugschlüssel — die Knöpfe des Bretts behalten ihre.

### 2.6 Wenn die Frage entschieden ist, steht die nächste da

Weil das Siegel jetzt hält, verschwindet nach der letzten Festlegung die letzte
Zeile mit einem Preisschild vom Zettel. Das darf eine unwiderrufliche
Entscheidung nicht: sie darf teuer sein, nicht leer. Also rückt der **Gärraum**
nach (`sud:zettel-gaerraum`) — er kostet, er staffelt sich hinauf, er hat in
jeder Epoche eine andere Nebenbedingung und er bewegt Fass, gehört nach §18 also
in den Nenner.

### 2.7 §24 erfüllt

`B.welt.meldeZug(was, preis, art, zug)` mit vier Argumenten: das Verfahren als
`lage`, der Gärraum als `bau`, und **beide nur dann**, wenn zu dem gemeldeten
Schlüssel gerade ein nicht abgeschalteter Knopf im Dokument steht. DER SUD
meldet jetzt nichts mehr, wenn er nichts anzubieten hat — das ist strenger als
vorher, nicht milder.

### 2.8 Die Fläche bleibt unter der Schwelle

Der Kesselzettel darf die Ortsmarken-Schwelle der STADT (2,4 % der Bühne) nicht
überschreiten. Nachgemessen bei 1920×1000, 1440×900 und 2752×1536, alle vier
Epochen: **1,88 % bis 2,14 %**, kein Knopf abgeschnitten, jeder von der Maus
getroffen.

---

## 3 · NACHHER — was gemessen wurde

### 3.1 Das Siegel hält in **vier** von vier Epochen

`werkbank/schuss/sud-w4/siegel.mjs`, dieselben sechs Fälle, derselbe Ablauf:

| Epoche | Festlegung | bezahlt | sofort zurück | wieder hin | nach 4 Wochen zurück |
|---|---|---|---|---|---|
| 1350 | Hopfenbrief | ✓ | **abgewiesen** | abgewiesen | **abgewiesen** |
| 1600 | Felsenkeller | ✓ | **abgewiesen** | abgewiesen | **abgewiesen** |
| 1884 | Kältemaschine (über `warm`) | ✓ | **abgewiesen** | abgewiesen | **abgewiesen** |
| 1884 | Reinzuchthefe | ✓ | **abgewiesen** | abgewiesen | **abgewiesen** |
| 1970 | Betriebslabor | ✓ | **abgewiesen** | abgewiesen | **abgewiesen** |
| 1970 | Tunnelpasteur | ✓ | **abgewiesen** | abgewiesen | **abgewiesen** |

(„wieder hin" ist nach dem Siegel gegenstandslos — die Achse steht bereits auf
der bezahlten Option, der Knopf ist deshalb `aus`, so wie jeder Knopf für einen
Zustand, in dem man schon ist.)

Die Knöpfe sind nicht versteckt, sie sind **abgeschaltet und beschriftet**:
„das Siegel liegt darauf", darüber die Zeile „*Anlage abgenommen:
Betriebslabor. Zurück geht es nicht — nur noch weiter hinauf.*" Die Ratsche
bleibt offen — nach dem Betriebslabor (42.000 DM) steht der Prozessrechner
(118.000 DM) weiter mit seinem Preisschild da und wartet auf Geld, nicht auf
Erlaubnis. `BRAUHAUS.lage` 0, keine Seitenfehler in allen sechs Läufen.

### 3.2 Die Entscheidung steht jetzt am Bildschirm

Dieselbe sorgfältige Linie, derselbe Stil `blind`, dieselben 400 Wochen —
**Wochen mit mindestens zwei aktiven, von der Maus treffbaren Bierknöpfen**:

| Epoche | vorher | nachher |
|---|---|---|
| 1350 | 89 von 400 | **394** von 400 |
| 1600 | 28 von 400 | **390** von 400 |
| 1884 | 71 von 400 | **364** von 400 |
| 1970 | 196 von 400 | **255** von 400 (mit mindestens *einem*: 197 → **373**) |

1970 steigt am wenigsten, und der Grund ist das Messgerät, nicht das Spiel:
`linie.mjs` zählt als „Bierknopf" nur die Achs- und Wechselschlüssel. In den
Wochen, in denen 1970 eine **gesperrte Charge** auf dem Zettel steht, nimmt
deren Paar (`sud:zettel-charge-frei` / `-schnitt`) den Platz der kostenlosen
Umstellung ein — die Wahl ist da, sie heißt nur anders und wird von diesem
Zähler nicht mitgezählt. Gemessen wird sie in 3.4.

Dazu, im Vorgabestand jeder Epoche (Woche 1, nichts angeklickt): **vier** aktive
und treffbare Züge des SUDES statt drei — `sud:zettel-anstich`,
`sud:zettel-hefe-fass`, `sud:zettel-wechsel-frei`, `sud:zettel-wechsel-kauf`.

Die Wirtschaft bleibt dabei stehen, wo sie stand: 1350 endet mit **138 Pf**
gegen vorher 136 Pf, bei denselben 0 Suden. (In 1600 hat sich die Kasse
zwischen den beiden Messungen deutlich bewegt — dort hat aber auch DIE
RÜCKKOPPLUNG die Startkasse gesenkt, 640 → 490 → 440 fl innerhalb derselben
zwei Stunden. Diese Zahl gehört nicht mir und ist nicht vergleichbar.)

### 3.3 Zwei Partien, verschiedenes Bier

PLATZ-ZWEIPARTIEN

### 3.4 Die gesperrte Charge von 1970

`werkbank/schuss/sud-w4/charge.mjs`, 200 Wochen mit nichts als WEITER:

| | Wochen mit gesperrter Charge | davon mit **beiden** Antworten bedienbar | vom Spieler entschieden |
|---|---|---|---|
| vorher | 8 | **0** | 0 |
| nachher | 3 | **3** | **3** |

Dass es nachher nur noch drei gesperrte Wochen sind, ist die Folge und nicht der
Zufall: der Spieler entscheidet jetzt in der Woche, in der gesperrt wird, statt
die Charge vier Wochen stehen zu lassen, bis der Braumeister sie von sich aus
freigibt.

---

## 4 · Was offen bleibt

**4.1 Das Sudbrett ist im Vorgabestand tot, und das bleibt so.**
In 400 von 400 Wochen war kein einziger Achsknopf des Bretts aktiv, in keiner
Epoche, weil das Brett zugeklappt liegt und ein zugeklapptes Brett seine Knöpfe
abschaltet. Der Kesselzettel trägt die Entscheidung jetzt vollständig — aber die
*Gegenüberstellung* von drei oder vier Optionen mit Preis, Wirkung, Warnung und
der Tafel WAS BEIM WIRT ANKOMMT sieht nur, wer den Reiter der STADT anklickt.
Das ist die Platzordnung der STADT und nicht meine Datei. **Wer die zweite Latte
am Brett zählt statt am Zettel, zählt in jeder Epoche null.**

**4.2 Die Deckelung `hoechst` feuert in einer sorgfältig gespielten Partie nie.**
Vierzehn Braujahre, vier Epochen, `blind` wie `braut`: **0 zurückgestufte
Bottiche.** Der Grund liegt nicht in diesem Stück: die sorgfältige Linie schlägt
über die Anschlagtafel DER FUHRE nie die oberste Sorte an (Starkbier, Märzen,
Export), und wo Stufe 2 bestellt wird, deckelt das Vorgabeverfahren auf Stufe 2.
Damit ist die Antwort der Runde 2 — *„die Folge, die man beim Wirt
wiedersieht"* — in der gemessenen Partie unsichtbar. **Das ist eine Naht
zwischen DEM SUD und DER FUHRE und gehört an einen Tisch, nicht in ein Stück:**
entweder die Anschlagtafel bietet die oberste Sorte von sich aus an, oder DER
SUD müsste den Spieler dazu drängen, sie zu bestellen — und das darf er nicht,
die Sorte gehört DER FUHRE.

**4.3 In 1350 bleibt der Gärkeller unter dem Vorgabeverfahren leer.**
Grutbier hat keine Gärwochen; erst der Hopfen (Sack oder Brief) schickt den Sud
durch den Gärkeller. Das ist inhaltlich richtig und jetzt auch spürbar — aber
wer in 1350 bei der Grut bleibt, sieht von Bottichen, Fehlsud und Gärraum
vierzehn Jahre lang nichts. Ob das ein Mangel ist oder die Epoche, entscheidet
nicht der Builder.

**4.4 Eine Nebenwirkung, die DIE RÜCKKOPPLUNG wissen muss.**
Durch 2.7 meldet DER SUD den Gärraum jetzt mit `art: 'bau'` (Rang 2) statt ohne
Art (Rang 0). In Wochen, in denen kein `umkaempft`-Zug gemeldet wird, kann damit
der Gärraum zum Nenner der zweiten Latte werden — in 1350 sind das 26 Pf,
gestaffelt ×1,25 je Kauf. Das ist nach ZUSTAENDIGKEIT §18 richtig (Bau bewegt
Fass), aber es ist eine Änderung am Nenner, und sie fällt in dieselben Stunden,
in denen DIE RÜCKKOPPLUNG rho misst. **Wer rho vergleicht, vergleiche Stände,
nicht Uhrzeiten.**

**4.5 Die Messung selbst stand auf wanderndem Grund.**
Vorher gegen einen eingefrorenen Stand (8901), nachher gegen den Arbeitsbaum
(8899), an dem zwei andere Builder gleichzeitig schrieben. Die Startkasse von
1600 hat sich dabei von 640 fl auf 490 fl bewegt. Die Zahlen zum Kesselzettel
(3 von 60 → 55 von 60 in denselben ersten 60 Wochen) sind so groß, dass dieses
Rauschen sie nicht erklärt; die Kassenstände am Ende der Läufe sollte man nicht
auf den Pfennig vergleichen.

---

## 5 · KERN

**KERN: Eine Sperr- und Vorrangebene über allen Fächern — ZUSTAENDIGKEIT §2,
seit Welle 1 offen, und sie ist die Ursache des schwersten Funds dieser Runde.**
Ein fremdes Brett (die Anschlagtafel DER FUHRE) deckt eine fremde Ortsmarke (den
Kesselzettel DES SUDES), und weil keine Stelle im Spiel weiß, was gerade oben
liegt, kann jedes Stück nur raten. DER SUD hat es sich in seinen eigenen Dateien
geflickt: der Zettel prüft jeden seiner Knöpfe einzeln und sucht sich einen
freien Platz. Das ist ein Pflaster, kein Schloss. **Jedes weitere Stück, das
eine Marke auf die Karte legt, wird denselben Flicken noch einmal bauen — bis
der Kern eine Stelle hat, die die Reihenfolge kennt.**

**KERN: `zugDeckung()` kann die ganze Kennzahl auf `null` setzen.** Der Kern
behält genau eine Meldung (`W.naechsterZug`). Ist deren Knopf abgeschaltet,
liefert `zugDeckung()` `null` — auch dann, wenn drei andere Stücke in derselben
Woche gedeckte Züge gemeldet haben. Ein Stück kann damit die Kopfzeile aller
anderen löschen. Vorschlag: der Kern hält die Meldungen als Liste und nimmt beim
Lesen die beste, **die gedeckt ist**. DER SUD hat sich einstweilen selbst
diszipliniert (er meldet nur noch, was gerade zu drücken ist), aber das ist
Selbstbeschränkung eines Einzelnen, keine Sicherung.

**KERN: die vier Bitten aus Welle 2 stehen unverändert** und liegen zur Laufzeit
unter `BRAUHAUS.sud.kernbitten` (`stuecke/sud-zusatz.js`):
`welt.nimmHeraus(n, wahl)` mit Auswahl · eine API für `haus.rohstoff` ·
`welt.sorten()` als Sortenleiter des Kerns (DER SUD liest dafür heute die fremde
Globale `FUHRE_DATEN`) · Gärkeller neben Lagerkeller in `welt.vorrat`.

---

## 6 · Geänderte Dateien

**Im Spiel — ausschließlich eigene Dateien:**

| Datei | was |
|---|---|
| `spiel/stuecke/sud.js` | Siegel als Ratsche (`gesiegelt`, `verdraengt`) · Sitzsuche des Kesselzettels (`ZETTELSTELLEN`, `zettelSitzt`, `stelleZettel`; `fremdVerdeckt` gestrichen) · Hefepaar, Chargenpaar und Gärraum auf dem Zettel · `hefeFaktor`/`stempleHefe` · `meldeZug` mit vier Argumenten und Knopfprüfung · `Z.gestuftGesamt` |
| `spiel/stil/sud.css` | `.sud-siegelzeile` · `.sud-zpaar` · `.knopf.sud-tat.voll.halb` · `.sud-zrangschild` · `.sud-hefefolge` · Zeilenhöhe des Zettels |
| `spiel/stuecke/sud-zusatz.js` | Schlussblatt nennt, wie oft die Pfanne nicht getragen hat, was bestellt war |

**In der Werkbank — neue Messgeräte, `werkbank/schuss/sud-w4/`:**

| Datei | wofür |
|---|---|
| `linie.mjs` | die sorgfältige Linie mit Zählung aller `sud:`-Knöpfe je Woche · `node linie.mjs <epoche> <wochen> <blind\|braut\|billig> <ziel.json>` |
| `siegel.mjs` | hält „unwiderruflich"? · `node siegel.mjs <epoche> <kaufZug> <zurueckZug> [wochen]` |
| `zweipartien.mjs` | zwei Partien derselben Epoche mit verschiedenem Bier, Unterschied am Bildschirm · `node zweipartien.mjs <epoche> [wochen]` |
| `charge.mjs` | 1970: standen beide Antworten auf eine gesperrte Charge je bedienbar da? |

Alle vier nehmen `HAFEN=` aus der Umgebung, damit sich ein eingefrorener Stand
gegen den Arbeitsbaum messen lässt.

**Nicht angefasst:** `spiel/index.html`, `spiel/kern/**`, jede Datei eines
anderen Stücks. Kein `git`.
