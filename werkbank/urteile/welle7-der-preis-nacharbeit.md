# DER PREIS — Nacharbeit zur Welle 7

*Laufend geschrieben. Container-Reset stündlich.*

**Urteil des blinden Kritikers:** ALS GANZES FÄLLT DURCH — **allein an der
Sperrliste**. Latte 2 und Latte 4 bestehen mit Auflage. Zehn Auflagen,
`werkbank/urteile/welle7-der-preis-urteil.md`.

**Ausgangszahlen, die nicht kaputtgehen dürfen** (Aufsicht, Schlussstand
Welle 7, `werkbank/schuss/preis-w7/rho/schluss/`):

| Epoche | 12 J | 13 J | 14 J |
|---|---|---|---|
| 1350 | −0,259 | −0,236 | −0,380 |
| 1600 | +0,189 | −0,066 | −0,156 |
| 1884 | +0,168 | +0,346 | +0,393 |
| 1970 | **+0,699** | +0,637 | +0,653 |

---

## Reihenfolge der Arbeit

1. **Auflage 1 + 2** — Sperrliste, blockierend, reine Aufschriften.
2. **Auflage 3 + 4** — zwei Zahlen auf dem Schild, die nicht stimmen.
3. **Auflage 6 + 5** — der Unterhalt zahlt dreimal; die Vorschau liegt 4× daneben.
4. **Auflage 7** — die FOLGE-Zeile aus dem Rollfenster holen.
5. **Auflage 9** — `nachZeit` in die anderen drei Epochen.
6. Messung aller vier Epochen, vorher/nachher.

(wird laufend nachgetragen)

---

## 1 · AUFLAGE 1 (Sperrliste, blockierend) — die feudale Aufschrift · ERLEDIGT

`preis.js:1019` schrieb in **allen vier** Epochen
`'Handlohn beim Erbfall an den Grundherrn'`. Gemessen vom Kritiker:
**−12.100 M** in 1884, **−13.000 DM** in 1970, davon **−8.300 DM** in einer
Rechnung von 1973 neben „Körperschaft- und Gewerbeertragsteuer".

Die Aufschrift kommt jetzt je Epoche aus `preis-daten.js`
(`handlohnName` · `handlohnKurz` · `handlohnFrei`), gelesen über drei
Funktionen in `preis.js`:

| Epoche | `rechtSatz` der Epoche | neue Aufschrift |
|---|---|---|
| 1350 | vom Rat verliehen | **Handlohn beim Erbfall an den Grundherrn** *(unverändert — hier gibt es ihn wirklich, und `realrecht` kauft ihn ab)* |
| 1600 | vom Kloster gepachtet | **Laudemium an das Kloster beim Handwechsel** |
| 1884 | eigen, im Grundbuch | **Erbschaftsteuer und Umschreibung im Grundbuch** |
| 1970 | eigen · Konzession | **Erbschaftsteuer und Übertragungskosten** |

Auch die Vorschauzeile in `kommendeLasten()` und die Chronik lesen jetzt
denselben Namen. **`handlohnAnteil` ist in keiner Epoche angefasst** — beim
Übergang eines Familienbetriebs wird auch 1884 und 1970 gezahlt, nur heißt es
dann anders. An der Wirtschaft darf sich damit nichts bewegen; genau das wird
unten gemessen.

## 2 · AUFLAGE 2 (Sperrliste, blockierend) — der Rat, der 1970 den Bierpreis setzt · ERLEDIGT

`preis.js:1805`/`:1817` schrieben unbedingt „vom Rat gesetzt <Jahr>" und
„Zwischen den Stufen setzt der Rat nach dem Korn nach" — auch 1970, drei
Zeilen unter dem eigenen Epochensatz *„Der Handel diktiert die Aktionspreise.
Der Listenpreis ist Zierde."*

| Epoche | `satzSetzer` | `satzNachSatz` |
|---|---|---|
| 1350 | vom Rat gesetzt | Zwischen den Stufen setzt der Rat nach dem Korn nach, aber nicht ganz. |
| 1600 | von der Landesordnung gesetzt | Zwischen den Stufen setzt der Kurfürst nach dem Korn nach, aber nicht ganz. |
| 1884 | vom Brauerbund vereinbart | Zwischen den Stufen zieht der Bund nach den Gerstenpreisen nach, aber nicht ganz. |
| 1970 | Listenpreis, verbandsweit empfohlen | Zwischen den Stufen zieht der Verband die Liste nach, der Handel nur zum Teil. |

Die Mechanik (`satzFolgt`, `nachfuehrung`) ist Zeichen für Zeichen unverändert
— nur **wer** es tut, kommt jetzt aus der Epoche.

## 3 · AUFLAGE 3 — das Preisschild, das um 2.000 M danebenlag · ERLEDIGT

`wende()` merkt sich die Jahreslast **vor** der Wirkung und rechnet den
Zufluss daraus. Betroffen war genau eine Karte im ganzen Spiel:
`preis:festlege:aktien` in 1884 (die einzige mit `einmal` **und**
`pflichtNeu`), Schild +11.000 M, gebucht +13.000 M, +18,2 %.

## 4 · AUFLAGE 4 — der Ertrag auf der FOLGE-Zeile war nominal · ERLEDIGT

`folgeText()` rechnet den Ertrag jetzt mit `teuerung()`, so wie Schritt 4 der
Michaeli-Abrechnung ihn bucht. Gemessen war: Karte verspricht **+16 Pf**,
Rechnung bucht **+27 Pf** — 69 % daneben, zugunsten des Spielers.

## 5 · AUFLAGE 6 — der Unterhalt zahlte dreimal · ERLEDIGT (und das ist die Änderung mit Folgen)

Der Befund des Kritikers, nachgerechnet am Michaelitag 1363 seiner Partie:

| | |
|---|---|
| Jahreslast gesamt | 214 Pf |
| davon Basispflichten | 88 Pf |
| davon **Unterhalt der sieben Bauten** | **126 Pf (59 %)** |
| Handlohn desselben Tages | 240 Pf = 1,10 × 214 |
| **davon aus dem Unterhalt** | **139 Pf** |

**Ein angeschriebener Pfennig kostete 1,67 Pfennig**, und der Aufschlag stand
auf keiner Karte.

Das ist nicht bloß eine falsche Zahl, es ist die falsche **Bemessung**: eine
Brandschatzung, ein Landfriedensgeld, ein Laudemium bemessen sich nach dem,
was der Rat am Haus anschlägt — nicht nach dem, was das Haus seinem Böttcher
an Lohn und seinem Ochsen an Futter zahlt. **Wer sich einen Knecht hält, wird
davon nicht brandschatzungspflichtiger.**

Neu: `pflichtBasis()` — die Jahreslast **ohne** alles, was das Haus sich
selbst aufgeladen hat (`Z.pflichtNeu`). `umlageBetrag()` und
`handlohnBetrag()` nehmen ihr Vielfaches jetzt von dort. Die Rechnungsspalte
zeigt weiter die volle Jahreslast, und sie ist weiter voll zu zahlen — nur die
zwei Zahlen, die ein Vielfaches davon nehmen, nehmen es vom Anschlag des Rats.

**Das senkt die Last und bewegt damit ρ.** Gemessen wird unten.

## 6 · AUFLAGE 5 — die Vorschau lag 3,6- bis 4,4-fach daneben · ERLEDIGT, halb rechnerisch, halb durch einen Vorbehalt

Die Hälfte der Ursache war die Bemessung (§5, behoben). Die andere Hälfte ist
nicht wegzurechnen: Umlage und Erbfall sind ein Vielfaches der Jahreslast, und
die eines wachsenden Hauses ist im Jahr der Fälligkeit eine andere als heute.
**Was nicht bleiben darf, ist eine Zahl ohne Vorbehalt** — in der zugeklappten
Tafel ist sie 29 von 30 Wochen die einzige Zahl über kommende Lasten, die der
Spieler zu sehen bekommt. `WAS FÄLLIG WIRD` trägt jetzt, sobald eine Umlage
oder ein Erbfall darin steht:

> *Umlage und Erbfall sind ein Vielfaches der Jahreslast — hier steht die von
> heute (88 Pf Anschlag des Rats). Wächst das Haus bis zur Fälligkeit, wächst
> der Betrag mit.*

## 7 · AUFLAGE 7 — 30 von 30 FOLGE-Zeilen standen außerhalb ihrer Karte · ERLEDIGT

Die kurze **Dauerzeile** ist jetzt ein direktes Kind der Karte, außerhalb des
Rollfensters, direkt über Hinweis und Knopf:

> IN JEDEM MICHAELI · **+27 Pf** · **−10 Pf** · = +17 Pf

Der lange FOLGE-Satz bleibt im Rollbereich (er ist zu lang für eine Karte, die
einen Knopf tragen muss); die beiden **Zahlen** stehen jetzt dort, wo
Preisschild und Knopf stehen. *„Ein Preisschild, das nur die Anzahlung nennt,
ist ein halbes Preisschild."*

Gemessen nach dem Einbau, 1366×768, mit Rollleiste, **Michaelitafel
aufgeschlagen**: DER PREIS **0** Textknoten < 12 px · **0** abgeschnittene
Kästen · **0 von 35** aktiven Knöpfen < 24 px.

**Entwurfsleinwand 2752×1536, Knoten für Knoten verglichen
(`leinwand-gleich.mjs`): 0 Schriftgrößenänderungen.** Der Unterschied besteht
ausschließlich aus **neuem Inhalt** (Dauerzeile, Vorbehalt) — keine Skalierung,
keine verschobene Größe. Das gehört gesagt, weil die erste Latte
Bildschirmfotos vergleicht: die Karte trägt zwei Zeilen mehr als vorher, und
das ist Absicht.

## 8 · AUFLAGE 8, teilweise — die Karte, die nie erscheint · ERLEDIGT

`hopfen` („Hopfen statt Grut") trug `ab: 1380`. Eine Partie in 1350 endet
1363 — **diese Festlegung war in keinem Spielstand je zu sehen.** Jetzt
`ab: 1356`. Historisch gedeckt: `design/PRUEFUNG.md` §1.2 A12 bescheinigt die
Hopfendolde ausdrücklich für **1300–1420**, *„Hopfenbier verdrängt Grut im
14. Jh."*

**Der Rest von Auflage 8 ist NICHT behoben** — siehe §10.

---

## 9 · DIE MESSUNG — bewegt die Nacharbeit ρ?

Alle Läufe durch `werkbank/schuss/aufsicht/messfenster.sh` mit
`rueckkopplung-r3/linie.mjs <epoche> 400`, ausgewertet mit
`fuhre-w6/schnitte.py`. Rohdaten `werkbank/schuss/preis-w7/rho/nacharbeit/`,
Vergleichsstand `../schluss/`.

| Epoche | | 12 J | 13 J | 14 J | Kasse | Fehler |
|---|---|---|---|---|---|---|
| **1350** | vorher | −0,259 | −0,236 | −0,380 | 26–517 | 0 |
| | **nachher** | **−0,245** | **−0,170** | **−0,336** | 28–524 | 0 |

**1350 bewegt sich, und zwar in die erwartete Richtung.** `pflichtBasis()`
nimmt Handlohn und Umlage vom Anschlag des Rats statt von der vollen
Jahreslast; die Last fällt damit, das Haus behält mehr, und ρ rückt um
**+0,014 / +0,066 / +0,044** näher an null. Der Abstand zur Latte bleibt
**0,336** am schlechtesten Schnitt (vorher 0,320 — der Abstand ist also sogar
*gewachsen*, weil der schlechteste Schnitt näher an null liegt).

| **1600** | vorher | +0,189 | −0,066 | −0,156 | 169–2851 | 0 |
| | **nachher** | **+0,189** | **−0,066** | **−0,156** | 169–2851 | 0 |

**1600 ist Ziffer für Ziffer unverändert** — und das ist genau die Gegenprobe,
die die Änderung braucht: dort gibt es keinen Unterhalt an den Angeboten, also
ist `pflichtBasis()` dort gleich `pflichtSumme()`, und die neuen Aufschriften
(Laudemium, Landesordnung) sind reiner Text. Die Wirtschaft hat sich nicht
bewegt, obwohl acht Zeichenketten und eine Rechenfunktion anders sind.

| **1884** | vorher | +0,168 | +0,346 | +0,393 | 1757–23789 | 0 |
| | **nachher** | **+0,168** | **+0,346** | **+0,393** | 1757–23789 | 0 |

**1884 ebenfalls Ziffer für Ziffer unverändert** — und diese Epoche trägt die
Karte, an der Auflage 3 gemessen wurde (`aktien`, Schild +11.000 M gegen
gebuchte +13.000 M). Die Behebung ändert die **Buchung** um 2.000 M, sobald
die Karte genommen wird; die Messhand nimmt sie in diesem Lauf nicht
(`festGesetzt` = 0, siehe Auflage 10), deshalb steht die Reihe still. Das ist
kein Beweis, dass die Behebung wirkt — der Beweis dafür ist der Quelltext und
die Rechnung des Kritikers —, sondern der Beweis, dass sie **nichts anderes**
bewegt hat.

| **1970** | vorher | +0,699 | +0,637 | +0,653 | 1030–114537 | 0 |
| | **nachher** | **+0,699** | **+0,637** | **+0,653** | 1030–114537 | 0 |

**1970 ebenfalls Ziffer für Ziffer unverändert** — und das war die Zahl, um die
es ging: sie steht **ein Tausendstel** unter dem Riss. Die feudale Aufschrift,
die dort −13.000 DM „an den Grundherrn" schrieb, heißt jetzt
„Erbschaftsteuer und Übertragungskosten", der Betrag ist derselbe, und die
Reihe steht still.

### Das Ergebnis in einem Satz

**LATTE HÄLT, 0 von 4 Läufen über 0,700 — in beiden Ständen.** Drei von vier
Epochen sind Ziffer für Ziffer unverändert; nur 1350 bewegt sich, dort und nur
dort greift `pflichtBasis()`. **Die zwei Sperrlisten-Funde sind weg, ohne dass
eine einzige ρ-Zahl gekippt ist.**

> **Gerätekontrolle:** Für 1600, 1884 und 1970 liegen damit **je zwei Läufe an
> zwei verschiedenen Tagen mit identischen Ziffern** vor (Spannweite 0,000).
> Für 1350 gibt es **einen** Lauf am neuen Stand — hier ist n = 1, und das
> gehört gesagt: die Aufsicht hat drei byteweise identische Läufe am
> *vorherigen* Stand, nicht an diesem. Der Abstand zur Latte ist mit **0,336**
> so groß, dass eine Wiederholung die Aussage nicht kippen kann; sie steht
> trotzdem aus.

---

## 10 · WAS ICH NICHT BEHOBEN HABE, und warum

**AUFLAGE 9 — `nachZeit` fehlt in 1600, 1884 und 1970.** Der Kritiker nennt
es den stärksten Einzelbefund, und er hat recht: in 1600 heißt die unterste
Sprosse **vierzehnmal** hintereinander „Die Darre überm Malzboden" und wird nie
genommen, in 1970 **zehnmal von vierzehn** „Der eigene Mehrwegkasten". Das ist
Ziffer für Ziffer das Bild, das für 1350 als Fehler erkannt und behoben wurde.

**Nicht gemacht, und es ist eine Abwägung, keine Bequemlichkeit.** Der Umbau
ist nicht `nachZeit` allein — er ist `nachZeit` **plus** ein Unterhalt je
Sprosse, sonst bekommen drei Epochen billige Sprossen ohne Gegenrechnung und
die Lade läuft davon. Das sind rund 40 Karten in drei Epochen, und **jede
einzelne davon speist Latte 2**. In dieser Runde stand die Sperrliste, und
zwei Sperrlisten-Funde sind ein Veto, keine Latte — sie mussten zuerst weg und
sie mussten **messbar folgenlos** bleiben. Genau das ist jetzt belegt
(1600 unverändert, Ziffer für Ziffer).

Wer es angeht, geht es als **eigene Runde** an, mit drei Läufen je Epoche
vorher und nachher. **1970 steht bei +0,699** — ein Tausendstel unter dem
Riss. Eine Epoche, deren Leiter man plötzlich steigen kann, ändert dort jede
Zahl, und ich lasse diese Zahl nicht nebenbei kippen.

**AUFLAGE 8, der große Teil — die obere Hälfte der Leiter.** Nie bezahlbar in
1350: `freikauf` 1.000→1.700 · `realrecht` 800→930 · `marktbank` 220→330 und
alle fünf nach der Schätzung bepreisten Angebote bis `bannmeile`
1.300→**3.400**, gegen eine höchste Lade von 384 (Kritikerhand) bzw. 517 Pf
(Aufsichtshand). Behoben ist nur die Karte, die **gar nie erschien** (`hopfen`,
§8). Der Rest ist eine Entwurfsfrage: entweder eine Zwischensprosse zwischen
0,50 und 1,70 × Taxe, oder Raten für die großen Angebote (die Mechanik ist da:
`zahlplan` kann 45 % Anzahlung + Raten, `bannmeile` hat nur `bauzeit: 0`), oder
die ehrliche Ansage auf der Karte, für welches Jahrhundert sie gedacht ist.
**Alle drei bewegen ρ.**

**AUFLAGE 10 — null Festlegungen in 1884 und 1970.** Derselbe Befund eine
Etage höher und dieselbe Antwort: `handelsmarke` und `genossenschaft` kosten
110.000→140.000 DM gegen eine höchste Lade von 114.537. Gehört in dieselbe
Runde wie Auflage 8.

**Nebenbefund 5.2 des Kritikers — „Nehmen" bricht mitten im Wort.** Ursache
ist `overflow-wrap: anywhere` auf `.pr-tafel .pr-karte`, das ich in Welle 7
für lange Komposita gesetzt habe und das auch ein Wort mit sechs Buchstaben
trifft. Nicht behoben: die Regel steht dort, weil ohne sie
„Getränkefachgroßhandel" die Karte sprengt und die vierte Latte reißt. Die
saubere Fassung wäre `overflow-wrap: anywhere` nur auf `.pr-karte-text` und
`hyphens: auto` auf dem Knopf — eine Zeile, aber sie ändert die Kartenhöhe
und damit wieder ρ. Gehört in dieselbe Runde.

---

## 11 · Abnahme

| Prüfung | Ergebnis |
|---|---|
| `node --check` auf `preis.js`, `preis-daten.js` | ok |
| `node werkbank/schuss/aufsicht/tor.mjs` | **TOR OFFEN** — vier Epochen, `lage` 0, 0 Konsolenfehler |
| Latte 4, 1366×768, Rollleiste, **Tafel auf** | DER PREIS **0** Textknoten < 12 px · **0** abgeschnittene Kästen · **0 von 35** Knöpfen < 24 px |
| Entwurfsleinwand 2752×1536 | **0 Schriftgrößenänderungen**; Unterschied ist ausschließlich neuer Inhalt |
| Sperrliste 6.1 (Grundherr) | **behoben** — je Epoche aus den Daten |
| Sperrliste 6.2 (Rat setzt 1970 den Bierpreis) | **behoben** — je Epoche aus den Daten |

Geändert nur `spiel/stuecke/preis.js`, `spiel/stuecke/preis-daten.js`,
`spiel/stil/preis-zusatz.css`. Kein `Math.random()`, keine Bilder, kein `git`.

---

## 12 · Nachtrag der Aufsicht, und was daraus ins Repo gehört

**Der Veröffentlicher ist an der Wurzel geheilt** — nicht am Skript, sondern an
der Reihenfolge: `wiederaufnahme.sh` startete ihn, *bevor* der Baum aus origin
zurückgeholt war, also las er nach jedem Reset die alte Fassung seiner selbst.
Er lädt sich jetzt am Ende jedes Takts selbst neu (`exec`, verbleibende
Laufzeit weitergereicht). Gegengeprüft an Commit `8442f0d`. **Der Befund des
blinden Kritikers in seinem §11 ist damit erledigt; wer ihn dort liest, muss
nicht noch einmal nachsehen.**

**Die Nacharbeit ist angenommen**, mit der Einschränkung, die ich selbst
genannt habe (1350 am neuen Stand n = 1). Die Aufsicht misst am eingefrorenen
Stand `54517b9` nach: 1350 dreimal, die anderen drei je einmal.

**Auflage 9 bleibt offen und bekommt eine eigene Runde**, zusammen mit
Auflage 8 und 10.

### DIE ZAHL, GEGEN DIE AUFLAGE 9 GEBAUT WIRD — und es ist nicht ρ

Ansage der Aufsicht, wörtlich: *„Wenn du an Auflage 9 gehst, ist das die Zahl,
gegen die du baust — nicht ρ. ρ liegt dort ohnehin unter der Latte und würde
dir nichts sagen."*

Gemeint ist die Wiederholung der **untersten Leitersprosse**. Damit die nächste
Runde sie nicht von Hand nachbauen muss — *zweimal von Hand ist einmal zu oft* —
steht sie jetzt als Gerät im Repo:

```
python3 werkbank/schuss/preis-w7/sprossen.py <ordner mit e*-A.json>
```

Es liest `leiterRoh[].name` jedes 400-Wochen-Laufs und zählt: verschiedene
Namen · **längste ununterbrochene Reihe** · Wechsel. Am Schlussstand dieser
Nacharbeit:

| Epoche | Jahre | Namen | **längste Reihe** | Wechsel | |
|---|---:|---:|---:|---:|---|
| **1350** | 14 | 5 | 7 | 5 | *(geheilt in Welle 7)* |
| **1600** | 14 | **1** | **14** | **0** | **TOTE LEITER** |
| 1884 | 14 | 4 | 3 | 8 | |
| **1970** | 14 | 3 | 4 | 5 | |

**Und hier steht ein Befund über die Messgröße selbst, den ich melde, bevor
jemand die Zahlen nebeneinanderlegt und sich wundert:**

| | Hand des Kritikers (`GIER=1`, teuerstes bezahlbare) | Hand der Aufsicht (`linie.mjs`, billigstes mit doppelter Rücklage) |
|---|---|---|
| **1600** | 14× dieselbe Sprosse | **14× dieselbe Sprosse** |
| **1970** | 10 von 14 | **4** |
| 1350 | sechs verschiedene Namen | fünf |

**1600 stimmt exakt — eine tote Leiter ist unter jeder Hand tot, und das ist
der harte Teil des Befunds.** 1970 nicht: dort hängt die Zahl an der Kaufregel.
Wer Auflage 9 misst, **nennt seine Hand dazu**, so wie der Kritiker es getan
hat, und misst am besten mit beiden. Sonst wiederholt sich der Fall aus
Welle 6, in dem zwei Tabellenzeilen unbrauchbar wurden, weil niemand sagen
konnte, wer sie bewegt hat.
