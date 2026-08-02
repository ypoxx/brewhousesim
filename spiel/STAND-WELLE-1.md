# STAND — was am Ende von Welle 1 wirklich da ist

Geschrieben vom **Glättungslauf** am 1. August 2026, nach Welle 1. Der Glättungslauf entwirft
nichts. Er hat den laufenden Build in allen vier Epochen fotografiert, durchgeklickt und
zusammengesetzt, was vier getrennt gebaute Stücke aneinander vorbei gemacht haben.

**Wie hier gemessen wurde.** Playwright, Chromium, `?epoche=1..4`, Auflösungen 2752×1536,
1920×1000 und 1366×768. Alles Gezählte stammt vom Bildschirm — `elementFromPoint`,
`innerText`, echte Mausklicks, die abgelesenen Zahlen des Spiels selbst. Rund 1.600 gespielte
Wochen, dazu ein Dutzend Sonderprüfungen. **Kein Seitenfehler, kein Konsolenfehler, kein
404 in keinem Lauf; `BRAUHAUS.lage` blieb in allen vier Epochen leer.**

Wo eine Zahl von jemand anderem stammt, steht das dabei.

---

> **Nachtrag vom 2. August 2026 — vor der ersten Arbeit der Welle 2 lesen.**
> Die Zahlen in §2 und §5 sind auf einem verklemmten Bildschirm entstanden: `messe.mjs`
> klappt alle Bretter auf, dabei legt sich das Brett von DER SUD über das von DIE FUHRE, und
> `fuhre:kauf:rohstoff` ist dann für die Maus nicht zu treffen. Der gemessene Betrieb konnte
> keinen Rohstoff kaufen und schrieb neunzig Wochen lang „Kein Sud: kein Hopfen" an seine
> eigene Tafel. Ein Drittel aller Bedienelemente ist in jeder Epoche so zugedeckt.
> Belege, Gegenprobe und die Reihenfolge der Nacharbeit: **`spiel/BEFUND-BRETTER.md`**.
> Kurz: die Aufgabe der Welle 2 ist zuerst die Platzordnung der Bretter, dann eine neue
> Eichung — und erst danach die Frage, ob die Wirtschaft überhaupt eine Nacharbeit braucht.
> Der Satz in §2 zu §13 ist überdies überholt: die jüngste Eichung zeigt in allen vier
> Epochen eine anklickbare Festlegung innerhalb der ersten drei Braujahre.
>
> **Nachtrag 2, gleicher Tag:** Die Eichung ist auf dem freien Bildschirm neu gefahren.
> Die Kennzahltabelle in §5 ist damit ersetzt — **alle vier** Epochen kippen jetzt
> messbar, zwei nach unten (1600, 1884: vier von sechs Jahren unter 1×) und zwei nach
> oben (1350, 1970). Zahlen, Ursachenkette und die Richtung der Nacharbeit stehen in
> **`spiel/BEFUND-WIRTSCHAFT.md`**.

## 1 — Was jetzt wirklich läuft

* **Vier Epochen laden fehlerfrei und zeigen denselben Ort.** St. Michael, die Flussbiegung,
  der Brückenstandort, Gasthof Lindenhof und die Mühlenstelle liegen in allen vier Platten an
  derselben Stelle (gemessen vom Kritiker der STADT, Runde 2).
* **Der Hof wächst sichtbar.** Einzeln nachweisbare Hofbauten je Epoche: **9 / 12 / 12 / 12**
  (Latte war sechs; Verfahren: „alle gegen alle-ohne-genau-diesen-einen", nur im Stadtfenster
  gezählt — Kritiker der STADT, Runde 2, in Runde 3 auf den Maßstab hin nachgebessert).
* **Die Woche ist bedienbar und kostet etwas.** Sud einstellen, Rohstoff kaufen, Wagen laden,
  Fuhre abschicken, Jahr schließen — 200 Wochen am Stück in jeder Epoche ohne Sackgasse.
* **Der Michaelitag liegt als eigenes Blatt oben**: fünf Angebote nebeneinander mit
  Preisschild in der Währung des Jahres, darunter drei bis vier unwiderrufliche Festlegungen
  mit Siegel, dazu DIE RECHNUNG, DER ANSCHLAG und DIE LEITER (die Kennzahl der zweiten Latte
  schreibt das Spiel selbst auf sein Blatt).
* **Der Gegner zieht ohne den Spieler.** 38 / 43 / 38 / 91 Züge in je 92 Wochen, mit Folgen im
  Bild statt Ankündigungen (Kritiker DER GEGNER, Runde 1).
* **Seine Preisschilder sind seit dieser Glättung mit der Maus zu drücken** — siehe §4.
* **Das Haus kann fallen, und dann steht die Uhr.** Nachgestellt: E1 endet im Januar 1354,
  E4 im Februar 1974, beide mit Grund `keine-abnehmer`; danach verweigert `naechsteWoche()`
  den Dienst. Das ewig weiterlaufende WEITER aus Runde 3 ist weg.
* **Der Ton ist gemessen und bestanden** (Latte 3, Welle 2, Stück DER KLANG): ein fremdes Ohr
  nennt blind 1350 / 1600 / 1884 / 1970 mit 95 / 95 / 95 / 100 Prozent richtig.
* **Entscheidungen mit Preisschild nebeneinander, ohne dass man erst etwas aufschlagen muss**
  (erreichbar *und* aktiv, `elementFromPoint`, Vorgabestand): **8 / 9 / 8 / 7.**
  Mit allen Brettern aufgeschlagen: 13 / 9 / 8 / 12.

## 2 — Was nur scheinbar läuft

Dies ist der wichtigere Abschnitt.

* **Der Michaelitag ist in allen vier Epochen praktisch unbezahlbar.** Gespielt mit der
  Handlung, die das Spiel selbst vorschlägt (liefern, Rohstoff nachkaufen), steht die Kasse
  *am Michaelitag* in E1 bei −7 / −14 / −21 Pf und in E2 bei 0 / −14 / −28 fl. Ergebnis in den
  ersten drei Braujahren: **0 von 5 Angeboten und 0 von 3 bzw. 4 Festlegungen aktiv.** In E3
  und E4 ist im ersten Jahr ein Teil erreichbar (3/5 bzw. 2/5 Angebote), danach nichts mehr —
  und **die einzige je aktive Festlegung ist in beiden Epochen die mit dem Preisschild „ohne
  Ausgabe"**. Das Herzstück von DER PREIS ist also sichtbar, beschriftet, gesiegelt — und in
  keiner Epoche zu haben. Die Auflage aus `ZUSTAENDIGKEIT.md` §13 („in jeder der vier Epochen
  muss innerhalb der ersten drei Braujahre mindestens eine unwiderrufliche Festlegung
  tatsächlich anklickbar werden") ist **nicht erfüllt**, gemessen am Bildschirm.
* **Das Geld ist da — nur nie an dem Tag, an dem es gebraucht wird.** Im Jahresverlauf steigt
  die Kasse in E1 auf das Vierfache der Startbarschaft; Michaeli nimmt sie vollständig. Das
  ist kein Zahlenfehler in einem Stück, sondern die Summe aus vier Stücken (§5).
* **Nach dem dritten Braujahr passiert in E1–E3 wirtschaftlich nichts mehr.** Die Kasse
  pendelt zehn Jahre lang um null, ohne dass das Spiel endet oder etwas sagt. Kein
  Todzustand im Sinne der harten Regel — es ändert sich in jeder Woche etwas —, aber ein
  Spiel, in dem zehn Jahre lang kein Zug bezahlbar ist, ist praktisch stehengeblieben.
* **Die Bretter der Werkbank liegen im Vorgabestand zugeklappt**, und die Knöpfe darin bleiben
  im DOM aktiv, obwohl sie weggeschnitten sind. Ein Klick dorthin geht ins Leere. Für die Maus
  harmlos, für jede automatische Prüfung eine Fehlerquelle.
* **Welle 2 läuft bereits mit** (`index.html` wurde von der Aufsicht nachgetragen). DER NAME
  ist eingehängt und schreibt schon in `welt.meldeZug` — in E1, E2 und E3 ist *sein* Posten
  inzwischen der billigste nächste Zug („Umtrunk beim Wirt 9 Pf", „Wirtshausschild anschlagen
  70 fl", „Etiketten auflegen 900 M"). **Der Nenner der zweiten Latte gehört damit einem
  unfertigen Stück.** Das ist keine Kritik an DEM NAMEN, sondern eine Zuständigkeitsfrage, die
  jemand entscheiden muss.

## 3 — Die vier Stücke: erreicht, gemessen woran, offen

| Stück | Stand | Woran gemessen | Was offen ist |
|---|---|---|---|
| **Skelett** | bestanden | Vier Epochen laden, Ebenenstapel, Knopf-Fabrik | — |
| **DIE STADT** | Runde 3 gebaut, **noch nicht beurteilt** | Bildlatte + Auszählung sichtbarer Bauten (9/12/12/12), Tafelanteil 9–10 % des Stadtfensters | Runde 3 (Maßstab der Pfanne, Staffelung je Epoche, Ortsmarken auf Pflöcken) hat noch kein Kritiker gesehen |
| **DIE FUHRE** | zurück (Runde 3), Reparatur ist eingebaut | 260+ Wochen je Epoche, Kennzahl, Verbliste, Sperrliste | Das Ende zündet (nachgestellt), aber das Jahrzehnt bei Kasse ≈ 0 davor ist neu und ungeprüft |
| **DER PREIS** | bestanden (Runde 1) | 20 Michaeli-Blätter durchgeklickt, Ausschluss und Siegel geklickt | §13: die Eichung — hier gemessen als 0 von 5 / 0 von 3 in E1 und E2 |
| **DER GEGNER** | zurück (Runde 1) | 368 gespielte Wochen, Zensus über 1.161 Preisschilder | Der Grund der Rückweisung ist in dieser Glättung behoben; er braucht eine neue Runde |
| **DER KLANG** (Welle 2) | Latte 3 bestanden | Fremdes Ohr, blind, 4 von 4 | Klangdichte im laufenden Spiel ungeprüft |

## 4 — Was diese Glättung angefasst hat

Nur Nähte, nichts Neues. Elf Eingriffe, alle klein, jeder mit einem Satz im Quelltext daneben.

**Eine Sprache statt zwei.** DIE STADT schrieb ihren gesamten Anzeigetext ohne Umlaute
(„Gaerbottiche", „Gewoelbekeller", „Kueferei", „Rossmuehle", „Maelzereiturm", „Abfuellhalle",
„faehrt, wann das Haus will", „es steht auch fuer die Enkel"), während FUHRE, PREIS und GEGNER
daneben „Kältemaschine", „Pächter" und „fällig" schrieben — auf demselben Bildschirm zwei
Rechtschreibungen. Dazu die Kopfleiste („naechster Zug"), die Monatsnamen des Kerns
(„Jaenner", „Maerz") und fünf Ortsnamen („Untere Bruecke", „Die Muehle", „Landstrasse",
„Gaertanks"). Alles auf Anzeigetexte beschränkt; kein `schluessel`, kein Klassenname, kein
Bildpfad wurde angefasst. Gegenprobe: der komplette Bildschirmtext aller Bretter in allen vier
Epochen enthält jetzt kein einziges falsch geschriebenes Wort mehr.

**Eine Zahl statt zweier.** Die Kopfleiste zählte den Vorrat in Fass, das Brett desselben
Vorrats ab 1872 in Hektoliter: oben „KELLER 140/400", unten „DIE TANKS 210 von 600 hl". Beides
kommt jetzt aus `B.welt.menge()`, dem einen Formatierer des Kerns, und der Name des Lagers
wechselt mit der Epoche wie der Rohstoff daneben: **Keller · Gewölbe · Eiskeller · Tanks** —
genau die vier Wörter, die DIE FUHRE auf ihr Brett schreibt. (Kernänderung, Aufsichtsakt, in
`welt.js` als `lager:` eingetragen.)

**Ein Knopf, der die Wahrheit sagt.** In allen vier Epochen stand beim Laden oben rechts
**„Michaelitafel schließen"** — auf einem Bildschirm, auf dem keine Tafel lag. Ursache: DER
PREIS hielt die Tafel für offen, DIE STADT hatte sie als „lag beim Laden schon da" in ihren
Rahmen geklappt (`clip-path: inset(50%)`). Zwei Stücke, zwei Meinungen über denselben
Zustand, und der erste Klick des Spielers tat scheinbar nichts. DER PREIS liest jetzt den
sichtbaren Zustand (wie er es beim Sommerzettel der FUHRE schon tat) und beschriftet danach.
**Nebenwirkung, die mehr wert ist als die Reparatur selbst:** die unsichtbare Tafel hatte den
Prüfausdruck `[data-zug="preis:tafel-zu"]` im DOM gelassen — DER GEGNER schloss daraus, die
Michaelitafel liege oben, und **verweigerte sein Dossier**. Das ist der vom Kritiker als „toter
Knopf" gemeldete Befund („`.fach-blatt-gegner` mit 0 Kindern"). Er ist damit erledigt: „Das
Haus gegenüber" öffnet in allen vier Epochen ein volles Blatt.

**Preisschilder, die man drücken kann.** Die Schilder des Adlers an den eigenen Adressen lagen
im Pflocksystem der STADT und rechneten dort `pointer-events: none`; daneben trug der Pflock
dieselbe Aufschrift samt Preis und tat nichts. Von zwei Dingen mit demselben Preisschild war
das wirksame nicht anklickbar und das anklickbare wirkungslos. DER GEGNER meldet seine
Preisschilder jetzt mit `data-frei` ab — der Weg, den `ZUSTAENDIGKEIT.md` §10 vorsieht.

Zensus danach, je 40 Wochen: gezählt 106 / 190 / 117 / 162 Preisschilder, davon von
`elementFromPoint` getroffen **98 / 146 / 70 / 64**. Echte Mausklicks: 2 / 1 / 3 / 2, **alle mit
Wirkung auf die Kasse** — 112 → 56 Pf, 640 → 52 fl, 14.250 → 9.057 M, 86.000 → 41.450 DM. Zum
Vergleich der Befund, der das Stück zurückschickte: in 1350 gab es in 62 Wochen **keinen
einzigen** Augenblick, in dem eine bezahlte Antwort auf den Adler zugleich bezahlbar und
anklickbar war. Der Preis dafür: die Schilder stehen jetzt dauernd im Bild statt auf Pflöcken
zu ruhen — dabei deckten sich zwei in 1600 zur Hälfte, also wurde ihr Stapelabstand von
3,6 auf 5,6 Prozent gesetzt. Nachgemessen: **keine Überlappung in keiner Epoche.**

**Eine Taste, die überall gilt.** Escape schloss die Chronik, das Buch und die Georgi-Tafel,
aber nicht das Haus gegenüber. Jetzt auch das. (Die gemeinsame Sperrschicht bleibt
Kernaufgabe — §5.)

**Vier kleine Namensdinge.** „Wagen leeren" hieß auch 1970 so, wo das Fahrzeug daneben LASTZUG
heißt, und 1884, wo gar kein Wagen im Hof steht, sondern eine Bahnrampe: jetzt *Karren leeren ·
Wagen leeren · Rampe räumen · Lastzug leeren*. „Fassplätze: 22 eigene" stand zwei Zeilen unter
„4 von 12 Fass" — zwei Zahlen unter demselben Wort; die untere heißt jetzt „Fässer des
Hauses". „Kasse reicht" stand gleichzeitig an zwei Stellen mit verschiedener Bedeutung; auf
dem Michaeli-Griff heißt es jetzt „Kasse reicht dafür".

## 5 — Die Kennzahl der zweiten Latte

> Barschaft ÷ Preis des nächsten sinnvollen Zuges. Wächst sie über die Partie, ist es
> Patrizier IV, und der Lauf ist verloren.

Das Spiel trägt die Zahl selbst unten rechts auf („Kasse reicht N×"). Abgelesen, nicht
gerechnet; 200 Wochen je Epoche, ein fester, bescheidener Spielstil (jede Woche nach Durst
laden, Fuhre abschicken, Rohstoff nachkaufen, wenn er knapp wird — **nicht bauen**):

| Epoche | Start | Höchstwert | nach 3 Jahren | Ende (Jahr 13) | Form |
|---|---|---|---|---|---|
| 1350 | 14,9× | **46,9×** (Jahr 1) | 0,8× | 0,9× (1363) | steiler Aufstieg, dann zehn Jahre zwischen 0,0 und 2,8 |
| 1600 | 10,6× | 20,2× | 0,5× | 0,01× (1612) | dasselbe, tiefer |
| 1884 | 10,8× | 13,7× | 0,03× | 0,13× (1897) | fällt am schnellsten, zwölf Jahre bei 0,0–0,35 |
| 1970 | 14,6× | **45,5×** | 22,7× | 27,1× (1983) | **steigt** — sägend, aber im Trend aufwärts |

Zum Vergleich Welle 1: **22× in 1350, 594× in 1884, 1323× in 1970.**

**Die Antwort auf die Frage der Aufsicht: Nein, so steht sie nicht mehr.** Die Zahlen sind um
ein bis zwei Größenordnungen gefallen, und die Reihenfolge über die Epochen ist weg — 1884 ist
heute die *ärmste* Epoche, nicht die reichste. Der Befund, der 594× und 1323× hervorbrachte,
ist damit erledigt.

**Aber die Latte ist deshalb nicht bestanden**, und zwar aus zwei Gründen:

1. **1970 wächst weiterhin**, wenn man nicht ausgibt. Gegenprobe mit einem Spielstil, der
   zusätzlich alles kauft, was die Kasse dreifach trägt: dann pendelt E4 über dreizehn Jahre
   zwischen 0,3× und 11,1× ohne Trend. Die Kurve hängt also nicht am Spiel, sondern daran, ob
   der Spieler etwas zu kaufen findet — genau das ist die Wohlstandssingularität in ihrer
   milden Form: das Geld hat kein Ziel.
2. **1350 bis 1884 fallen unter eins und bleiben dort.** Eine Kennzahl, die zehn Jahre lang
   „0,0×" sagt, misst nichts mehr. Der Spieler ist nicht reich geworden — er ist arm geworden
   und kann nichts mehr tun. Das ist das andere Ende derselben kaputten Kurve.

Die Latte will eine Zahl, die *interessant bleibt*: mal knapp, mal luftig, nie beides für zehn
Jahre am Stück. Keine der vier Epochen tut das heute.

## 6 — Offene Kritiken

**Zugewiesen und noch offen:**

1. **§13 — Eichung des Michaelitags** (DER PREIS, DIE FUHRE, Aufsicht gemeinsam). Gemessen
   nicht erfüllt, Zahlen in §2. Das ist der teuerste offene Punkt.
2. **§2 — Sperrschicht im Kern mit einem Register offener Blätter.** Jedes Stück baut heute
   seine eigene Tür; ich habe dem GEGNER seine Escape-Taste nachgerüstet, damit sich die drei
   gleich verhalten. Das ist ein Pflaster.
3. **§6 — Gärkeller und Lagerkeller trennen**, `haus.rohstoff` als API, `nimmHeraus()` mit
   Auswahl. Übertrag an DER SUD.
4. **DIE STADT, Runde 3** braucht einen Kritiker. Der Maßstab der Pfanne ist nachgemessen
   (Brauerin 78 px gegen Magd 72 px), aber niemand von außen hat es gesehen.
5. **DER GEGNER** braucht eine neue Runde, nachdem seine Preisschilder jetzt erreichbar sind.
6. **Die Verben der Kernwoche sind in 620 Jahren dieselben.** „Nach Durst füllen", „Wie vorige
   Woche", „FUHRE ABSCHICKEN" stehen 1350 wie 1970 wortgleich da. Die Wirtschaftsverben sind
   vier verschiedene Listen — der Wochenzug ist eine einzige. Ich habe nur das Leeren
   auseinandergezogen; der Rest ist Entwurfsarbeit und gehört der FUHRE oder DEM SUD.

**Neu und noch niemandem zugewiesen:**

7. **„Deckung" heißt jetzt zweierlei.** Der Kern nennt die Kennzahl der zweiten Latte so
   (`.deckung`), DER NAME nennt seinen zweiten Balken so („Deckung 60"). Zwei Bedeutungen,
   ein Wort, ein Bildschirm.
8. **DER NAME schreibt ohne Umlaute** („Litfasssaeule") — dasselbe, was die STADT gerade
   abgelegt hat. Wer in Welle 2 baut, schreibt Deutsch mit Umlauten.
9. **Bretter im Vorgabestand klappen zu, ihre Knöpfe bleiben aktiv.** Gehört dem Rahmen der
   STADT oder der Sperrschicht des Kerns aus §2.

## 7 — Was die nächste Welle als ERSTES angehen muss

**Den Michaelitag bezahlbar machen — und zwar zusammen, nicht je Stück.**

Das ist nicht die eleganteste Baustelle, aber die einzige, deren Fehlen alles andere entwertet.
Alles, was Welle 1 gebaut hat, läuft auf diesen einen Tag zu: die Fuhre erwirtschaftet für ihn,
der Gegner erhöht den Einsatz für ihn, die Stadt zeigt, was er bezahlt hat. Und an diesem Tag
steht die Kasse bei −7 Pf, und der Spieler darf nichts.

Die Zahl, an der es sich messen lässt, ist schon geschrieben (`ZUSTAENDIGKEIT.md` §13): **in
jeder Epoche muss in den ersten drei Braujahren mindestens eine unwiderrufliche Festlegung
wirklich anklickbar werden, nachgewiesen am Bildschirm.** Heute: null, in allen vieren.

Drei Dinge gehören dazu, und alle drei müssen an einem Tisch entschieden werden:

* **Die Rechnung darf den Tag nicht auffressen.** Der Abgabendeckel von 18 % gilt je Stück und
  wird eingehalten — die Summe trifft aber alle an *einem* Datum. Entweder der Michaelitag
  wird gestaffelt, oder die Angebote bekommen eine unterste Sprosse, die an der tatsächlichen
  Barschaft hängt. Die Ratenzahlung („von 94 Pf · dann 1 × 52 Pf") gibt es bereits und
  erscheint in E1/E2 nie am unteren Ende.
* **„Ohne Ausgabe" darf nicht die einzige erreichbare Festlegung sein.** In 1884 und 1970 ist
  sie es. Eine unwiderrufliche Wahl, die nichts kostet, ist keine Wahl.
* **Wer eicht, meldet die neue Zahl.** Sonst verschiebt der eine, was der andere festzurrt —
  das ist genau der Weg, auf dem der Deckel aus §4 überhaupt nötig wurde.

**Danach, in dieser Reihenfolge:** die Sperrschicht im Kern (§2, sie blockiert drei Stücke
gleichzeitig), dann DAS ERBE — denn der Epochenschnitt ist die einzige Stelle, an der die
Kurve aus §5 sauber neu bepreist werden darf, und ohne ihn sind es vier Spiele hintereinander
und kein Haus über 675 Jahre.

**Und eine Warnung an die Aufsicht:** Welle 2 läuft bereits, während dieser Text entsteht.
DER NAME hängt im Spiel und besetzt schon den Nenner der zweiten Latte. Wer die Eichung des
Michaelitags aufschiebt, eicht später gegen ein bewegliches Ziel.
