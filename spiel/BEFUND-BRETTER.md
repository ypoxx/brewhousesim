# BEFUND — Die Eichung hat einen verklemmten Bildschirm gemessen, nicht die Wirtschaft

Geschrieben am 2. August 2026, vor der ersten Arbeit der Welle 2. Anlass war der Auftrag aus
`STAND.md` §2 — *„der Michaelitag ist in allen vier Epochen praktisch unbezahlbar"* — und die
Auflage aus `ZUSTAENDIGKEIT.md` §13. Beim Nachmessen ist etwas anderes herausgekommen.

**Wie hier gemessen wurde.** Playwright, Chromium, 1920 × 1000 (dazu 2752 × 1536 und
1366 × 768 für die Deckungsprobe), `?epoche=1..4&saat=1350`. Alles Gezählte stammt vom
Bildschirm: `elementFromPoint`, `elementsFromPoint`, echte Mausklicks, `getComputedStyle`,
und die Sätze, die das Spiel selbst an seine Tafel schreibt. Werkzeuge liegen daneben und
sind einzeln nachfahrbar: `werkbank/schuss/eichung/decke.mjs`, `wohin.mjs`, `gegenprobe.mjs`.

---

## 1 — Der Befund in einem Satz

> **Ein Drittel aller Bedienelemente ist in jeder Epoche für die Maus nicht da, sobald mehrere
> Bretter offen liegen — und genau in diesem Zustand hat die Eichung gemessen.** In Epoche 1
> und 2 trifft es `fuhre:kauf:rohstoff`, den Einkauf, von dem das ganze Jahr abhängt.

Gemessen mit `decke.mjs`, alle Bretter aufgeklappt, je Epoche:

| Epoche | Züge im DOM | davon für die Maus nicht erreichbar |
|---|---|---|
| 1 · 1350 | 83 | **29** |
| 2 · 1600 | 91 | **30** |
| 3 · 1884 | 94 | **30** |
| 4 · 1970 | 88 | **30** |

Die Decke ist fast immer DER SUD über DIE FUHRE. Betroffen sind nicht Randdinge, sondern die
Verben der Woche: `fuhre:laden:*` und `fuhre:abladen:*` für zwei bis vier Häuser in jeder
Epoche, `fuhre:ziel:bar` / `:borg` / `:ziel`, `fuhre:tafel-ab:*`, und die Einkäufe —
`fuhre:kauf:rohstoff` (E1, E2), `fuhre:kauf:eis` und `:sudwerk` (E3), `fuhre:kauf:lastzug`
(E4).

## 2 — Warum: zwei Bretter auf demselben Fleck

Kein Zufall und kein Zeichenfehler, sondern zwei Zeilen CSS, die dieselbe Fläche vergeben.

| | links | oben | Breite | x-Bereich |
|---|---|---|---|---|
| `.sud-brett` (`stil/sud.css`) | 1,2 % | 12,4 % | **47 %** | **1,2 – 48,2 %** |
| `.fu-haeuser` (`stil/fuhre.css`) | 1,1 % | 12,6 % | 25,6 % | 1,1 – 26,7 % |
| `.fu-tafel` | 27,4 % | 12,6 % | 23,2 % | 27,4 – 50,6 % |
| `.fu-keller` | 27,4 % | 56,2 % | 23,2 % | 27,4 – 50,6 % |

DIE FUHRE kachelt ihre vier Bretter überschneidungsfrei. **DER SUD legt sich mit voller Breite
über drei davon.** Wer zuletzt aufklappt, liegt oben.

Nachgefahren, Schritt für Schritt, an `fuhre:kauf:rohstoff` in Epoche 2:

| Zustand | Ergebnis |
|---|---|
| Vorgabestand (alles zugeklappt) | verdeckt — das eigene Brett ist zu (so gewollt) |
| nur das FUHRE-Brett aufgeklappt | **erreichbar** |
| SUD zusätzlich aufgeklappt | **verdeckt von `div.sud-leer`** |
| SUD wieder zugeklappt | **erreichbar** |

Der Knopf ist dabei durchgehend `disabled = false` und liegt im Bild. Er sieht in jedem dieser
Zustände gleich aus. Nur trifft der Klick ihn nicht.

Das ist derselbe Fehlertyp wie in `STAND.md` §4 („zwei Stücke, zwei Meinungen über denselben
Zustand") — nur größer, weil er nicht einen Knopf trifft, sondern eine Fläche.

## 3 — Was das mit der Eichung gemacht hat

`messe.mjs` ruft `klappeAuf()` und klappt **alle sieben Bretter** auf, bevor es zu spielen
beginnt. Damit liegt DER SUD von der ersten Woche an über DIE FUHRE, und der sparsame Stil —
*„Rohstoff nachkaufen, wenn er knapp wird"* — kauft nie etwas, weil sein Knopf nicht zu
treffen ist. Die Folge steht in `wohin.mjs`, Epoche 2:

* Ab Woche 10 des ersten Jahres steht der Rohstoff auf **1** und bleibt dort — 90 Wochen lang.
* Das Spiel schreibt es selbst an die Tafel, jede zweite Woche: **„Kein Sud: kein Hopfen."**
* Ohne Sud kein Bier: Die Einnahmen fallen von 1.464 fl (1600) auf 368 fl (1601) auf 55 fl
  (1602), während die festen Lasten — Fuhrlohn, Löhne, Pachtzins, Ungeld, Zunftumlage — mit
  rund 950 fl im Jahr weiterlaufen. Ab 1604 steht die Kasse auf 0 und bleibt dort.

**Die Gegenprobe** (`gegenprobe.mjs`) spielt denselben Stil, räumt aber vor jedem Klick das
Brett weg, das darüber liegt — wie ein Mensch es täte. Epoche 2, 100 Wochen, sonst identisch:

| | Rohstoffkäufe | Rohstoff | Keller | Kasse 1603 |
|---|---|---|---|---|
| wie die Eichung (alles offen) | **0** | 1 … 1 | fällt auf 10 | 0 → 0 |
| wie ein Spieler (Bretter freiräumen) | **5** | 1 … 89 | hält 16 – 24 | 0 → **93** |

Derselbe Code, dieselbe Saat, derselbe Stil. Der einzige Unterschied ist, ob der Einkaufsknopf
zu treffen war.

## 4 — Was daraus folgt, und was ausdrücklich nicht

**Es folgt:** Die Zahlenreihen der Eichung messen nicht die Wirtschaft des Spiels, sondern
einen Betrieb, dem der Einkauf gesperrt war. Das betrifft die Kennzahltabelle in `STAND.md` §5
(*„1350 bis 1884 fallen unter eins und bleiben dort"*) und den Satz in §2, der Welle 2 ihre
erste Aufgabe gegeben hat. **Beides muss neu gemessen werden, bevor irgendjemand eine Zahl an
Preisen, Löhnen oder Angeboten verstellt.** Wer jetzt die Wirtschaft nachzieht, eicht sie auf
eine Klemme.

**Es folgt nicht,** dass die Wirtschaft in Ordnung ist. Auch im freigeräumten Lauf steht die
Kasse in Epoche 2 im Jahr 1602 auf null. Der Unterschied ist, dass sie sich danach wieder
erholt (93 fl im Jahr 1603) und der Keller Bier behält, statt auf zehn Fass abzusinken.
**Knapp statt tot.** Ob „knapp" die Latte trifft, sagt erst die neue Messung.

**Und ein Nebenbefund zu §13, der die Auflage entlastet:** Nach der jüngsten eingecheckten
Eichung — nach der letzten Codeänderung entstanden, also gültig für den heutigen Stand — wird
in **allen vier Epochen innerhalb der ersten drei Braujahre mindestens eine unwiderrufliche
Festlegung anklickbar**: E1 im Jahr 1351 (`vertrag`, 160 Pf), E2 im Jahr 1601 (`reinheit`,
810 fl), E3 schon 1884 (`konvention`, 9.200 M), E4 schon 1970 (`privat`, 81.000 DM). Der Satz
in §2 — *„0 von 5 Angeboten und 0 von 3 bzw. 4 Festlegungen"* — stammt aus einem Stand von
16:33 Uhr; die Eichung von 21:36 Uhr widerspricht ihm. Da diese Zahlen aus den verklemmten
Läufen stammen, also aus einem Betrieb mit **zu wenig** Geld, kann die Lage mit freiem Einkauf
nur besser sein. **§13 gilt nach heutigem Stand als erfüllt** — mit Ausnahme des dort
genannten Nebenbefunds, dass in E3 und E4 ab dem zweiten Jahr die einzige noch erreichbare
Festlegung die mit dem Preisschild „ohne Ausgabe" ist (`aktien`, `konzern`). Das steht.

## 5 — Was zu tun ist, in dieser Reihenfolge

1. **Die Bretter dürfen einander nicht zudecken — und zwar über die Reiter, nicht über die
   Platzordnung.** Zwei Wege standen offen; einer ist inzwischen ausprobiert und gemessen.

   *Weg 1, das Brett verschieben, ist widerlegt.* `.sud-brett` versuchsweise nach
   `left: 51.3%; max-height: 43%` gelegt — in den Streifen rechts oben, den DIE FUHRE frei
   lässt — und `decke.mjs` erneut gefahren:

   | Epoche | vorher | nach dem Umzug |
   |---|---|---|
   | 1 · 1350 | 29 | **20** |
   | 2 · 1600 | 30 | **21** |
   | 3 · 1884 | 30 | **20** |
   | 4 · 1970 | 30 | **24** |

   Besser, und `fuhre:kauf:rohstoff` ist damit in E1 und E2 frei — der Befund aus §3 wäre
   erledigt. Aber es bleibt ein Drittel-minus, und die neue Liste zeigt, warum das kein Weg
   ist: **DER SUD deckt jetzt DER GEGNER zu** (`gegner:beschwerde`, `gegner:blatt`,
   `gegner:abloesen:*`, `gegner:zuvorkommen:*`) und dazu die Marken der STADT
   (`stadt:marke:*`) — und der Höhendeckel von 43 % schneidet **DEM SUD seine eigenen
   Knöpfe** ab (`sud:zettel-wechsel-frei`, `sud:gaerung:ober`, `sud:gaerraum`). Ein
   Rechteck weiterzuschieben verschiebt nur, wer zugedeckt wird. Der Versuch ist wieder
   zurückgenommen; `sud.css` steht unverändert.

   *Der Grund ist grundsätzlich:* Die Bühne ist voll. DIE FUHRE allein belegt 1,1 – 78,2 %
   über die ganze Höhe. Für ein zweites 47 % breites Brett ist kein Platz, an keiner Stelle —
   auch nicht rechts, weil dort DER GEGNER und die Marken liegen.

   *Weg 2 ist gebaut:* **Wer zuletzt aufschlägt, liegt oben; was er zudecken würde, klappt
   zu und behält seinen Reiter.** Umgesetzt in `stadt.js` als `platzordnung()` — die STADT
   geht in `nachsehen()` ohnehin alle Bretter mit ihren Rechtecken durch; die Auflösung
   hängt sich dort an. Zwei Bretter gelten als im Streit, wenn sie sich zu mehr als 12 %
   des kleineren decken (`DECKGRENZE`); formatfüllende Blätter über 60 % nehmen nicht teil,
   die dürfen decken. Die Zeit kommt aus dem Reiterklick.

### Was die Platzordnung gebracht hat — und was nicht

**Sie behebt nicht die Zahl, die man erwarten würde**, und das gehört hierhin: Wer ohnehin
ein Brett nach dem anderen aufschlägt, hatte nie ein Problem. `erreichbar.mjs` — je Brett
dessen Reiter aufschlagen, dann alle Züge darin anfassen — misst mit und ohne Eingriff
**dasselbe**: 3 / 2 / 3 / 4 unerreichbare Züge von 76 / 84 / 87 / 81. (Die Reste sind ein
anderer, kleinerer Fall: Knöpfe, die einander innerhalb eines Bretts decken, und die
Kopfleiste — `fuhre:laden:markt`, `fuhre:listen:neustadt`, `gegner:abloesen:markt`.)

**Sie behebt den Zustand, in dem der Bildschirm gelogen hat.** Genau der Vorgang, gemessen
in Epoche 2 an `fuhre:kauf:rohstoff`:

| Schritt | ohne Platzordnung | mit Platzordnung |
|---|---|---|
| 1. FUHRE aufgeschlagen | erreichbar | erreichbar |
| 2. SUD danach aufgeschlagen | **tot: offen, aktiv, verdeckt** | zugeklappt, Reiter sichtbar |
| 3. FUHRE-Reiter noch einmal | klappt zu — es wird schlimmer | **wieder erreichbar** |

Zeile 3 ist der eigentliche Gewinn. Vorher tat der naheliegende Griff — noch einmal auf den
Reiter des Bretts, das man bedienen will — das Gegenteil dessen, wonach er aussah.

**Im Spiellauf** (Epoche 2, 100 Wochen, sparsam) hält der Rohstoff mit Platzordnung in jedem
Jahr mindestens 21 (25 / 25 / 25 / 21) statt in zwei Jahren auf 1 abzusinken; 11 Käufe statt
9. Die Kasse steht mit und ohne in einzelnen Jahren auf null — **die wirtschaftliche Frage
aus §4 bleibt unverändert offen.**

`BRAUHAUS.lage` ist in allen vier Epochen 0, keine Seiten- oder Konsolenfehler; nach sieben
Reiterklicks bleiben zwei verträgliche Bretter offen statt sich zu begraben.
2. **`decke.mjs` wird eine Latte.** Ein Stück, dessen Brett fremde Schaltflächen zudeckt, ist
   nicht fertig — gleichgültig, wie gut es aussieht. Die Zahl gehört neben `BRAUHAUS.lage`
   in jeden Lauf: **erreichbar muss jeder aktive Zug sein, in jeder Epoche, in jeder
   Auflösung.**
3. **`messe.mjs` bekommt das Freiräumen aus `gegenprobe.mjs`.** Solange `klappeAuf()` alle
   Bretter offen lässt, misst die Eichung weiter den verklemmten Bildschirm — auch nachdem
   Punkt 1 erledigt ist, denn dann liegt eben ein anderes Brett oben.
4. **Danach erst** die Eichung neu fahren, `STAND.md` §2 und §5 nachschreiben und entscheiden,
   ob die Wirtschaft wirklich eine Nacharbeit braucht.

## 6 — Der eine Satz

Die Werkbank hat sauber gemessen und richtig gerechnet. Sie hat nur nicht geprüft, ob der
Spieler, den sie simuliert, seine Knöpfe erreicht — und deshalb elf Monate Spielzeit lang
einem Brauhaus zugesehen, dem jemand die Tür zum Hopfenhändler zugestellt hatte.
