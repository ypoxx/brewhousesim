### 3.9 ALLE VIER EPOCHEN, gemessen am Schlussstand

| Epoche | 12 J | 13 J | 14 J | in `MESSLATTE.md` | Fehler |
|---|---|---|---|---|---|
| **1350** | **−0,259** | **−0,236** | **−0,380** | war +0,762 / +0,692 / +0,591 — **GERISSEN** | 0 |
| 1600 | +0,189 | −0,066 | −0,156 | **gleich** | 0 |
| 1884 | +0,168 | +0,346 | +0,393 | **gleich** | 0 |
| 1970 | +0,699 | +0,637 | +0,653 | **gleich** | 0 |

**LATTE HÄLT, 0 von 4 Läufen über 0,700.** Zum ersten Mal seit der Verschärfung
vom 4. August besteht die zweite Latte in allen vier Epochen über alle drei
Schnitte.

**Die drei nicht angefassten Epochen liefern Ziffer für Ziffer dieselben Zahlen
wie in `MESSLATTE.md`** — auch 1970, das dort auf +0,699 steht. Damit ist
zweierlei belegt: die neue Zeile auf der Festlegungskarte bewegt die Wirtschaft
nicht, und das Messgerät liefert an einem anderen Tag, bei anderer
Maschinenlast, dieselben Ziffern (**Spannweite 0,000 über sechs Läufe**:
1350 dreimal identisch vor der Nacharbeit, 1600 / 1884 / 1970 je gleich der
eingetragenen Zahl).

> **Ausdrücklich stehen bleibt:** 1970 steht weiter **ein Tausendstel** unter
> dem Riss. Daran hat diese Welle nichts geändert und sollte es auch nicht —
> das ist DER SUDs und des GEGNERs Epoche. Wer sie anfasst, misst vorher und
> nachher.

# DER PREIS — Bau der Welle 7

*Laufend geschrieben, nicht am Ende. Der Container wird stündlich zurückgesetzt.*

**Auftrag:** (A) Latte 2 in 1350 — +0,762 / +0,692 / +0,591 über die drei
Schnitte, gerissen bei zwölf Braujahren. (B) 113 Textknoten unter 12 px bei
1366×768.

**Besitzstand:** `spiel/stuecke/preis*.js` · `spiel/stil/preis*.css`. Sonst nichts.

---

## 1. Was vor dem ersten Handgriff feststand (aus den Akten, nicht neu gemessen)

Aus `werkbank/schuss/aufsicht/welle6-fuhre-nach/rho/e1-A.json`, dem Lauf, auf
dem die dreifach bestätigte Zahl beruht — nachgerechnet, nicht nachgemessen:

| Schnitt | ρ(Kennzahl) | ρ(Kasse) | ρ(Nennerpreis) |
|---|---|---|---|
| 12 Jahre | **+0,762** | **+0,741** | −0,218 |
| 13 Jahre | +0,692 | +0,709 | −0,196 |
| 14 Jahre | +0,591 | +0,548 | −0,219 |

**Die Kennzahl ist in 1350 die Kasse mit anderer Beschriftung.** Der Nenner läuft
sogar leicht gegen die Zeit; er trägt nichts zum Riss bei.

Und wichtiger noch — **wer den Nenner stellt:**

| Jahr | 1350–1357 | 1358–1363 |
|---|---|---|
| Art des Nennerzugs | `umkaempft` (Rang 3) | `bindung` (Rang 2) |
| Wer meldet ihn | **DER GEGNER** | **DER GEGNER / DIE FUHRE** |

**In keinem der vierzehn Braujahre stellt DER PREIS den Nenner.** Rang 3
(`umkaempft`) schlägt `bau` (Rang 2) immer, und ab 1358 unterbietet die
`bindung` mit 24–35 Pf jedes Angebot der Michaelitafel. Das heißt: dieses Stück
kann den Nenner nicht anfassen — nicht aus Zuständigkeit, sondern weil er
strukturell nie ihm gehört. **Es bleibt der Zähler.**

Die Kasse zu Michaeli, vierzehn Jahre:
`112 · 65 · 197 · 246 · 393 · 293 · 397 · 333 · 379 · 363 · 498 · 371 · 381 · 246`

Der Verlauf ist kein Davonlaufen, sondern eine **Rampe in den ersten fünf Jahren
und danach ein Hochplateau**: 112 → 393 in fünf Jahren (Faktor 3,5), danach
300–500 ohne Richtung. Genau deshalb reißt der **12-Jahres-Schnitt** am
stärksten und der 14er am schwächsten — der Schnitt, der das Plateau am
kürzesten sieht, sieht am meisten Rampe.

---

## 2. TEIL B — die vierte Latte. ERLEDIGT, und die 113 sind zu 65 fremd.

### 2.1 Die 113 sind zwei Zahlen, nicht eine

`WELLE-7.md` nennt für DER PREIS **113 von 772** Textknoten unter 12 px. Ich
habe die 772 nach `data-stueck` aufgeschlüsselt (dasselbe Verfahren wie
`werkbank/schuss/sud-blind-r2/lesbar-je-stueck.mjs`, Zeile für Zeile dieselben
Zählregeln wie `aufsicht/lesbarkeit.mjs`), Gerät:
`werkbank/schuss/preis-w7/lesbar-preis.mjs`, 1366×768, **mit** Rollleiste.

| Stück | nach `data-stueck` | in WELLE-7.md | Unterschied |
|---|---|---|---|
| stadt | 191 | 172 | **−19** |
| gegner | 172 | 172 | 0 |
| erbe | 164 | 132 | **−32** |
| name | 149 | 135 | **−14** |
| **preis** | **48** | **113** | **+65** |
| kern 36 + (ohne) 8 | 44 | 44 *(„ohne Stück")* | 0 |
| klang | 4 | 4 | 0 |
| fuhre / sud | 0 / 0 | — | 0 |
| **Summe** | **772** | **772** | 0 |

**Die 65 sind auf ein Zeichen genau die Summe der drei Abzüge** (19+32+14=65),
und sie tragen alle dieselbe Klasse: **`preis`** — der Preiszettel, den
`BRAUHAUS.knopf()` an jeden Knopf hängt und den `grund.css:294` ohne Boden auf
`calc(var(--s) * 20)` setzt, also **9,9 px** bei 1366×768. Gezählt:

| wo der Zettel steht | Knoten |
|---|---|
| in den Kästen von **DAS ERBE** | 32 |
| in den Kästen von **DIE STADT** | 19 |
| in den Kästen von **DER NAME** | 14 |
| in den Kästen von **DER PREIS** | **0** |

**Die Tabelle in WELLE-7.md ordnet nach dem Klassennamen zu, nicht nach dem
Fach.** Deshalb steht die Zahl bei mir. Ich kann sie nicht beheben, ohne
`grund.css` zu ändern oder in fremdes DOM zu schreiben — beides ist mir
verboten. **Der KERN-Absatz unten sagt, was die Zeile wäre.** Dass DIE FUHRE
und DER SUD hier auf 0 stehen, ist kein Widerspruch: beide haben den Boden auf
ihre **eigenen** Kästen eingegrenzt (`fuhre.css:479`, `fuhre-zusatz.css:74`,
`sud.css:204/210/366/469`) — genau das habe ich auch getan.

### 2.2 Zugeklappt misst man von diesem Stück fast nichts

`aufsicht/lesbarkeit.mjs` klickt nicht. Beim Laden ist die Michaelitafel zu,
und dann sind von DER PREIS **8 Knöpfe in vier Epochen** auf dem Schirm — der
Griff, sonst nichts. Die Rechnungsspalte, DIE LEITER, die Angebotskarten,
die Festlegungstafel: alles ungemessen. **Aufgeschlagen sieht die Zahl anders
aus.** `TAFEL=auf` in meinem Gerät schlägt sie auf:

| Stand | Knoten < 12 px | abgeschnittene Kästen | Knöpfe < 24 px |
|---|---|---|---|
| **vorher**, Tafel zu | 48 | 0 | 0 von 8 |
| **vorher**, Tafel auf | **765** | **17** | 0 von 34 |
| nur Schriftboden, Tafel auf | 0 | **50** | 0 von 34 |
| **nachher**, Tafel auf | **0** | **0** | 0 von 34 |
| **nachher**, Tafel zu | **0** | **0** | 0 von 8 |

**Der mittlere Schritt ist der Befund, den DIE FUHRE angekündigt hat:** der
Boden allein treibt die abgeschnittenen Kästen von 17 auf 50. Das Aufräumen
danach ist die Arbeit, nicht das Setzen des Bodens. Ursachen einzeln gemessen
(`scrollWidth`/`clientWidth` je Kasten): `.pr-feld` klippt senkrecht (DIE
RECHNUNG 1350 braucht 539 px in 219 px), `.pr-karte-text` waagerecht an langen
Komposita, `.pr-karte`/`.pr-fest` waagerecht am `white-space: nowrap` des
Skelettknopfs, `.pr-last-name` an `text-overflow: ellipsis`.

Über vier Fenstergrößen, Tafel auf, DER PREIS je **0 / 0 / 0**:
1366×768 · 1280×800 · 1600×1000 · 1920×1000.

Gesamtsumme bei 1366×768, Tafel zu: **772 → 724**.

### 2.3 Die Entwurfsleinwand ist unberührt — und das war beim ersten Anlauf falsch

`werkbank/schuss/preis-w7/leinwand-gleich.mjs` legt für **jeden** Knoten unter
`.fach-preis` bei 2752×1536 Schriftgröße, Überlauf, Umbruch und Kastenmaß ab
(301/316/294/321 Knoten je Epoche) und vergleicht zwei Fassungen mit `diff`.

**Der erste Anlauf hat die Leinwand verändert, und ich hätte es ohne dieses
Gerät nicht bemerkt.** `.fach-preis .knopf .preis` stand außerhalb des
Medienschalters und schlug wegen der späteren Quellzeile die Kartenregel
`.pr-karte .knopf .preis` (preis.css:300): der Preiszettel wuchs auf der
Leinwand von 16 auf 20 px, der Knopf von 40 auf 43 px, `pr-karte-text` von
472,5 auf 469,5 px. Das ist genau die Aufnahme, gegen die die **erste** Latte
blind vergleicht. Nach dem Verschieben in den Medienschalter:
**`leinwand-vorher.json` und `leinwand-nachher.json` sind identisch.**

### 2.4 Bewegt Teil B die Wirtschaft? NEIN — und das ist gemessen

Der Auftrag warnt ausdrücklich: *„Wer an Größen dreht, dreht an ρ."* Der A/B der
Aufsicht am Knopfboden hatte 0,811 Unterschied. Also vorher und nachher
gemessen, beide Male durch das Messfenster, Epoche 1, 400 Wochen:

| Stand | 12 J | 13 J | 14 J | Kasse | Fehler |
|---|---|---|---|---|---|
| vor Teil B | +0,762 | +0,692 | +0,591 | 39–609 | 0 |
| **nach Teil B** | **+0,762** | **+0,692** | **+0,591** | 39–609 | 0 |

**Die beiden Ergebnisdateien sind byteweise identisch** (md5
`a6b44d616796a8d01b8d9d7a4c8f97f2` beide) — und dieselbe Prüfsumme trägt auch
der Lauf der Aufsicht aus `welle6-fuhre-nach/rho/e1-A.json`, bis auf das Feld
`hafen`. Das ist zugleich die Gerätekontrolle: **drei Läufe, dieselben Ziffern,
Spannweite 0,000.**

**Warum der Knopfboden ρ bewegt hat und mein Schriftboden nicht:** der
Knopfboden greift auf JEDEN Knopf des Spiels und ließ die Bretter aller Stücke
umfließen. Mein Boden greift auf `.fach-preis` — und die Michaelitafel ist bei
1920×1000 (der Fenstergröße der Messhand) in Woche 1 zu, wenn die Hand ihre
Züge zählt. Es fließt nichts um, was sie sieht.

---

## 3. TEIL A — die zweite Latte in 1350

### 3.1 Was DER PREIS an dieser Zahl überhaupt anfassen kann

Aus dem Messstand `vorher/e1-A.json`, Spalten `zugArt` und `zugWas`:

| Braujahr | wer stellt den Nenner | Art | Preis |
|---|---|---|---|
| 1350–1357 | **DER GEGNER** (Ablösung/Zuvorkommen) | `umkaempft`, Rang 3 | 19–56 Pf |
| 1358–1363 | **fremd** (Verschreiben einer Adresse) | `bindung`, Rang 2 | 24–35 Pf |

`welt.js:526` (`besterZug`) sortiert **Rang vor Preis** und nimmt dann den
**billigsten**. `umkaempft` hat Rang 3, `bau` — die Art, unter der DER PREIS
seine Angebote meldet — hat Rang 2. In den Jahren ab 1358, in denen der Rang
gleich ist, unterbietet das Verschreiben mit 24–35 Pf jedes Angebot der
Michaelitafel (89–190 Pf).

**In keinem der vierzehn Braujahre kann DER PREIS den Nenner stellen**, und er
könnte es nur, indem er billiger würde als 19 Pf — was die Zahl größer machte,
nicht kleiner. Der Nenner ist damit für dieses Stück unerreichbar, und zwar
nicht aus Zuständigkeit, sondern aus der Sortierregel des Kerns. **Es bleibt
der Zähler.** (Derselbe Schluss steht seit Welle 4 im Quelltext,
`preis.js` bei `liegegeld`: *„Dieses Stück kann den Nenner nicht anfassen; es
kann nur den Zähler daran hindern, davonzulaufen."*)

### 3.2 Der eigentliche Befund: die Leiter geht mit dem Haus mit

Aus derselben Datei, Spalten `kasse`, `billigst`, `name`:

| Jahr | Lade | billigste Sprosse | kostet | Lade ÷ Preis |
|---|---|---|---|---|
| 1350 | 112 | Das Dach über der Pfanne | 36 | 3,11× |
| 1351 | 65 | Ein zweiter Bottich | 45 | 1,44× |
| 1352 | 197 | **Der feste Fasskauf bei der Zunft** | 89 | 2,21× |
| 1353 | 246 | Der feste Fasskauf | 110 | 2,24× |
| 1354 | 393 | Der feste Fasskauf | 130 | 3,02× |
| … | … | Der feste Fasskauf | … | … |
| 1363 | 246 | Der feste Fasskauf | 140 | 1,76× |

**Zwölf Michaelitage hintereinander steht dieselbe Zeile oben, und sie wird nie
genommen.** Und das Verhältnis Lade zu billigster Sprosse steht über vierzehn
Jahre bei **1,44 bis 3,11 ohne jede Richtung**.

Das sieht nach einer gut gestellten Leiter aus und ist der Fehler:
`preisVon()` hängt jeden Angebotspreis an `Z.anschlag`, und `Z.anschlag` hängt
über `ausBarschaft()` an der Lade. **Die Leiter geht also mit dem Haus mit.**
Ein Haus kann die unterste Sprosse nie hinter sich lassen — sie kostet immer
rund ein Drittel des Kastens, im ersten Braujahr wie im vierzehnten. Wer nichts
hinter sich lassen kann, kauft nichts; wer nichts kauft, sammelt. Genau daher
kommt ρ(Kasse) = +0,741 neben ρ(Kennzahl) = +0,762.

### 3.3 Was gebaut wurde — zwei Änderungen, beide in `stuecke/preis*.js`

**(A1) Zwei Anschläge statt einem** (`preis.js`, `preisVon`). Es gibt zwei
Sorten Sachen, und sie werden von zwei verschiedenen Leuten angeschlagen:

* **nach der TAXE** — ein Böttcher rechnet für den Bottich, ein Schmied für das
  Hausschild, ein Zimmermann für das Dach. Sie nehmen den Preis der **Sache**,
  nicht den Preis des **Kunden**. Der Preis steigt mit der Teuerung und mit
  nichts sonst — dieselbe Grundlage wie die Taxe der Festlegung
  (`festBasis()`), die es seit Welle 5 gibt.
* **nach der SCHÄTZUNG** — ein Ratsbrief über die Bannmeile, ein Achtel an der
  Stadtmühle, ein gewölbter Keller unter dem ganzen Hof. Was der Rat verleiht
  und was nach Maß gebaut wird, wird nach dem angeschlagen, was das Haus wert
  ist. **Unverändert.**

Das Merkmal heißt `nachZeit` und steht ausschließlich an den gewöhnlichen
Sprossen von 1350 (Dach · Grutkasten · Hausschild · Fasskauf · Bottich ·
Handmühle · Ochsenstall · Karrengaul · Böttcher). Fehlt es, ist `preisVon`
Zeile für Zeile die alte Funktion — **1600, 1884 und 1970 sind unberührt**,
nach der Regel aus Welle 4, nicht zwei Sachen zugleich an derselben Kennzahl zu
drehen. An der Karte steht, woran der Preis hängt; im Kasten DER ANSCHLAG
steht, wie viele Sachen des Tages nach der Taxe gehen.

**(A2) Der Unterhalt — was gebaut ist, will erhalten sein.** Bisher war jeder
Bau eine **ewige Rente ohne Gegenrechnung**: `wirkung.ertrag` trägt in jedem
Michaeli, für immer, und kostet nach dem Kauftag nichts mehr. Das ist die
Maschine hinter der Wohlstandssingularität, gegen die diese Latte gebaut ist.

Die Machinerie dafür war schon da und wurde nur nicht benutzt: `pflichtNeu`
hängt einer Festlegung eine dauerhafte Pflicht an (`marktbank` → Standgeld,
`jahrtag` → Jahrtagszins, `pfruende` → Kost und Pflege). **Die Angebote hatten
keine.** Jetzt hat jede gewöhnliche Sprosse von 1350 ihre eigene, benannte,
mit Wurzel `fest` — sie läuft weiter, auch wenn nicht gebraut wird, und wird
nach einem Fehljahr mit erlassen:

| Sprosse | neue Pflicht | Anteil an der festen Last |
|---|---|---|
| Dach über der Pfanne | Schindeln und Lattung | 0,22 |
| Grutkasten | Eichung des Maßes | 0,10 |
| Hausschild | Der Schmied richtet Anker und Ausleger | 0,14 |
| Zweiter Bottich | Weidenreifen und Dauben | 0,30 |
| Fester Fasskauf | Vorauszahlung für zwölf Fässer | 0,38 |
| Ochsenstall | Futter und Streu für den Ochsen | 0,60 |
| **Karrengaul** | **Hafer, Beschlag und Geschirr** | **1,80** |
| Handmühle | Zwei Knechte an der Handmühle | 0,75 |
| Böttcher im Haus | Lohn des Böttchers und Daubenholz | 0,80 |

**Der Karrengaul ist ein Sperrlisten-Fund an der eigenen Datei.** Auf seiner
Karte steht seit Welle 1: *„Doppelt so schnell wie der Ochse und dreimal so
teuer im Futter."* Abgebucht wurde davon **nie etwas** — ein Preis, den der
Text verspricht und die Rechnung nicht kennt, ist ein Scheinpreis. Er steht
jetzt in der Rechnungsspalte, und zwar dreimal so hoch wie das Futter des
Ochsen (1,80 gegen 0,60), wie der Satz es sagt.

**Was ausdrücklich NICHT angefasst wurde, und warum:**

* **Der Nenner.** Er gehört DEM GEGNER, und `besterZug` würde DER PREIS nur
  dann nehmen, wenn dieses Stück billiger würde als 19 Pf. Das machte die
  Kennzahl größer.
* **`liegeSatz` / `liegeFrei`.** Der naheliegende Knopf, und ich habe ihn
  liegen lassen. Die Begründung für 0,30 und 2,0 steht in `preis-daten.js` mit
  vier gemessenen Läufen daneben (*„Ein schweres Jahr kostet 1,8 bis 2,3
  Jahreslasten. Wer weniger als zwei bar hält, ist im nächsten Erbfall
  zahlungsunfähig"*), und dieselbe Tabelle zeigt, dass die Zahl **nicht
  monoton** wirkt: 0,30 → +0,288, **0,40 → +0,569**, 0,55 → −0,473. Wer daran
  dreht, dreht an einer Zahl, deren Richtung er nicht kennt — und bei 0,55
  schrumpft die Lade über die Partie auf ein Drittel, also von einer
  Rückkopplung zu einem Ende.
* **Die Preise der großen Sprossen.** Sie sind das Ziel, auf das man über
  Generationen spart. Wer sie verbilligt, entwertet die Latte genauso wie wer
  den Nenner anhebt.
* **1600, 1884, 1970.** Kein Zeichen geändert. Regel aus Welle 4.

### 3.4 Der erste Messsatz nach A1+A2 — Latte hält, aber zu knapp

| Stand | 12 J | 13 J | 14 J | Kennzahlband | Jahre < 1× | Festlegungen | Fehler |
|---|---|---|---|---|---|---|---|
| vorher | +0,762 | +0,692 | +0,591 | 1,55–18,44× | 0/14 | 1 | 0 |
| **nach A1+A2** | **+0,490** | **+0,599** | **+0,679** | **1,36–11,59×** | 0/14 | **2** | 0 |

**Die Latte hält — mit 0,021 Abstand am 14er-Schnitt. Das ist zu wenig.** Die
Akten dieses Laufs sagen selbst, was von so einem Abstand zu halten ist: *„1970
steht ein Tausendstel unter dem Riss. Wer sich darauf verlässt, verlässt sich
auf 0,001."*

Was die beiden Änderungen bewirkt haben, in Zahlen:

| | vorher | nach A1+A2 |
|---|---|---|
| billigste Sprosse, 14 Jahre | 36 · 45 · **89 · 110 · 130 · 120 · 140 · 130 · 140 · 160 · 190 · 160 · 170 · 140** | 33 · 44 · 45 · 48 · 49 · 57 · 59 · 74 · 77 · 110 · 120 · 170 · 180 · 190 |
| dieselbe Zeile oben | **12 Jahre lang** | höchstens 2 |
| unwiderrufliche Festlegungen | 1 | **2** |
| ρ(Nennerpreis), 12 J | −0,218 | +0,098 |
| ρ(Kasse), 12/13/14 | +0,741 / +0,709 / +0,548 | **+0,713 / +0,709 / +0,697** |

**Die Leiter wird jetzt gestiegen** — die billigste Sprosse klettert sauber von
33 auf 190 Pf, statt zwölf Jahre auf derselben Zeile stehen zu bleiben. Der
Gewinn beim 12-Jahres-Schnitt kommt allerdings **vom Nenner**, nicht vom
Zähler: ρ(Kasse) steht praktisch unverändert bei +0,70. Die Lade läuft weiter
davon, nur langsamer.

**Und die Ursache dafür ist eine Rückwirkung, die ich selbst gebaut habe:** der
Unterhalt steht in `pflichtSumme()`, und der Freibetrag der vierten Wurzel ist
`liegeFrei × pflichtSumme` = **zwei Jahreslasten**. Mit dem Unterhalt hat sich
die Jahreslast rund verdoppelt — **also hat sich der Freibetrag verdoppelt, und
der Anschlag auf das bare Vermögen hat aufgehört zu greifen.** Das ist genau
der Fehler, gegen den `preis.js` bei `liegeFreibetrag` selbst argumentiert:
*„Hänge ihn an den Anschlag, und der Freibetrag wächst mit genau dem, was er
begrenzen soll."*

**Nachgeführt:** `liegeFrei` 2,0 → **1,3** und `liegeSatz` 0,30 → **0,45**,
beide mit ihrer Begründung in `preis-daten.js`. Der Boden auf dem Preis der
billigsten Festlegung bleibt unangetastet.

---

## 4. KERN — was ein Stück-Builder nicht selbst beheben darf

**KERN: `stil/grund.css:294` — der Preiszettel am Knopf hat keinen Schriftboden.**
`.knopf .preis { font-size: calc(var(--s) * 20) }` ergibt bei 1366×768 **9,9 px**.
Gezählt mit `werkbank/schuss/preis-w7/lesbar-preis.mjs`: **65 von 772** zu
kleinen Textknoten der vierten Latte sind dieser eine Zettel — 32 in den Kästen
von DAS ERBE, 19 in DIE STADT, 14 in DER NAME. In der Tabelle von `WELLE-7.md`
stehen sie unter DER PREIS, weil dort nach dem Klassennamen zugeordnet wird;
im DOM stehen sie in fremden Fächern, und dorthin darf ich nicht schreiben.
DIE FUHRE und DER SUD haben den Zettel je nur in ihren eigenen Kästen
angehoben (`fuhre.css:479`, `sud.css:210` u. a.), ich ebenso
(`preis-zusatz.css`, auf `.fach-preis` eingegrenzt) — die drei anderen Stücke
haben ihn nicht. Die Zeile, die es für alle erledigt, gehört ins Skelett und
gehört **hinter den Medienschalter**, den `grund.css:268` für den Knopfboden
schon aufmacht, sonst wächst der Zettel auf der Entwurfsleinwand von 16 auf
20 px und die erste Latte vergleicht ein anderes Bild (bei mir gemessen und
korrigiert, §2.3):

```css
@media (max-width: 2751px), (max-height: 1535px) {
  .knopf .preis { font-size: max(12px, calc(var(--s) * 20)); }
}
```

**Achtung, und das ist der teure Teil:** diese Zeile vergrößert Knöpfe in DREI
Stücken zugleich und lässt deren Bretter umfließen. Nach dem A/B der Aufsicht
zum Knopfboden (1970 mit +0,699, ohne −0,112, Unterschied 0,811) ist damit zu
rechnen, dass sie ρ bewegt. **Sie gehört zwischen zwei Wellen eingearbeitet,
mit einer Messung vorher und nachher — nicht während gemessen wird.**

**KERN (kleiner): `kern/welt.js:526`, `besterZug` — Rang vor Preis, dann der
billigste.** Damit ist der „nächste sinnvolle Zug" strukturell immer der
*billigste* hochrangige Zug. Ein Stück, dessen Züge teuer sind, kann den Nenner
nie stellen, egal wie sinnvoll sie sind; in 1350 stellt DER GEGNER ihn in
14 von 14 Braujahren. Das ist keine Fehlfunktion, aber es heißt: **die zweite
Latte misst in dieser Epoche die Kasse gegen den Gegner, und die anderen sechs
Stücke können nur am Zähler arbeiten.** Wer die Latte einmal ohne diese
Verengung sehen will, müsste den Nenner über die Meldungen mitteln oder den
Median nehmen statt das Minimum. Das ist eine Entscheidung über die Messlatte
und keine für einen Builder.

**Beobachtung, keine Forderung:** `richteEin()` setzt beim Epochenwechsel
`Z.raten`, `Z.umsatzReihe`, `Z.ertragReihe` zurück, aber **nicht** `Z.genommen`,
`Z.fertig` und `Z.pflichtNeu`. Ein Ochsenstall von 1355 trägt seinen Unterhalt
damit bis 1970 weiter. Für die Festlegungen ist das gewollt („für ewige Zeiten
gestiftet"), für einen Schindeldach-Flick über 600 Jahre eher nicht. In den
gemessenen 400 Wochen wechselt die Epoche nie, deshalb ist es hier folgenlos —
aber es gehört auf die Liste für den Epochenbogen.

---

## 5. Was verworfen wurde, und warum

| verworfen | warum |
|---|---|
| **Am Nenner drehen** | `besterZug` nimmt Rang vor Preis und dann den billigsten. DER PREIS könnte den Nenner nur stellen, indem er unter 19 Pf ginge — das machte die Kennzahl **größer**. Zweimal an den Messdaten nachgeprüft (§3.1). |
| **Die Angebote verbilligen** | Der naheliegende Weg zu einer kleineren Zahl und der falsche: er entwertet die Latte genauso wie das Anheben des Nenners. Was stattdessen geschah, ist keine Verbilligung, sondern ein **anderer Anschlag** für Handwerksarbeit — die großen Sprossen kosten unverändert das, was sie kosteten, und werden mit jedem Kauf teurer. |
| **`liegeSatz` auf 0,55** | Die gemessene Tabelle in `preis-daten.js` zeigt dort eine Lade, die über die Partie auf **ein Drittel** schrumpft. Das ist kein Gegengewicht, das ist ein Ende — und in der ärmsten der vier Epochen. |
| **`satzFolgt` senken** (0,82, der höchste der vier Epochen) | Der Gedanke war gut und historisch stützbar: die Bierordnung von 1350 hat 41 bis 53 Jahre zwischen ihren Stufen, also den **trägsten** Rat der vier — er müsste den niedrigsten Wert haben, nicht den höchsten. Nicht gemacht, weil genau diese Zahl 1350 aus dem Sterben geholt hat (`112 → 12` vor Welle 4) und ihre Wirkung über die Partie **wächst**: eine Fehleinschätzung sieht man erst im zwölften Braujahr. Gehört gemessen, nicht nebenbei mitgeändert. |
| **`pflichtErtrag` anheben** (der Schoss auf die Nahrung) | Nachgerechnet statt gemessen: die Nahrung eines Jahres ist die Veränderung der Lade, im Schnitt rund 22 Pf. Zwölf Hundertstel mehr davon sind ~3 Pf im Jahr. Ein Hebel, der nichts hebt, aber eine Begründungszeile kostet. |
| **Den Unterhalt als eigene Rechenmaschine** (`unterhalt`-Bruchteil des gezahlten Preises, eigene Buchungsschleife) | Zuerst so entworfen und dann weggeworfen: `pflichtNeu` gab es schon, es wird von den Festlegungen seit Welle 5 benutzt, es rendert eine benannte Zeile mit Wurzel und bekommt den Nachlass des Fehljahrs geschenkt. Eine zweite Maschine für dieselbe Sache wäre eine zweite Stelle zum Kaputtgehen. **Die Änderung an `preis.js` ist dadurch drei Zeilen statt sechzig.** |
| **`.knopf .preis` global anheben** | Hätte 65 Textknoten auf einen Schlag erledigt — in den Kästen von DAS ERBE, DIE STADT und DER NAME. Fremdes DOM, fremde Bretter, und nach dem Knopfboden-A/B mit hoher Wahrscheinlichkeit eine ρ-Bewegung in drei Stücken zugleich. Als KERN-Absatz gemeldet (§4). |
| **`aufsicht/lesbarkeit.mjs` reparieren**, damit es die Michaelitafel aufschlägt | Am fremden Messgerät wird nicht gedreht. Stattdessen ein eigenes daneben (`preis-w7/lesbar-preis.mjs`, `TAFEL=auf`), das die Zählregeln Zeile für Zeile übernimmt. |

### 3.5 Zweiter Messsatz — der Freibetrag nachgeführt

`liegeFrei` 2,0 → 1,3 · `liegeSatz` 0,30 → 0,45. Dazu die Karte, die sagt, was
ein Angebot **für immer** kostet (`folgeText` nennt jetzt auch `pflichtNeu` —
vorher versprach die Karte „+16 Pf in jedem Michaeli" und verschwieg das
Gegenstück; für die Festlegungen gab es diese Zeile längst).

| Stand | 12 J | 13 J | 14 J | Kennzahlband | Jahre < 1× | ρ(Kasse) 14 J |
|---|---|---|---|---|---|---|
| vorher | +0,762 | +0,692 | +0,591 | 1,55–18,44× | 0/14 | +0,548 |
| nach A1+A2 | +0,490 | +0,599 | +0,679 | 1,36–11,59× | 0/14 | +0,697 |
| **+ Freibetrag** | **+0,462** | **+0,560** | **+0,648** | **1,36–8,58×** | 0/14 | +0,704 |

Das Band ist von **1:12 auf 1:6,3** zusammengegangen, und der höchste Wert der
Partie ist von 18,44× auf 8,58× gefallen. Aber ρ(Kasse) steht unverändert bei
**+0,70**: die Lade läuft weiter, nur auf niedrigerem Niveau. Und genau das ist
der Grund, warum der 14-Jahres-Schnitt der schlechteste bleibt — die letzten
vier Braujahre liegen mit 7,93 · 7,97 · 7,78 · 8,58 auf einem engen hohen
Plateau, und ein Plateau am Ende einer Reihe ist für Spearman eine Steigung.

**Was hier gelernt wurde, und es gilt über dieses Stück hinaus:** eine Abgabe
auf den BESTAND verschiebt das Niveau der Lade, aber nicht ihre Steigung.
Spearman zählt Ränge, nicht Beträge. Wer eine Rangfolge brechen will, braucht
eine Größe, deren Wirkung **mit der Laufzeit zunimmt** — und davon gibt es in
diesem Stück genau eine.

### 3.6 Dritter Messsatz — die eine Größe, die mit der Laufzeit wächst

`satzFolgt` 0,82 → **0,45**. Das ist der Anteil der Teuerung, den der Rat beim
Bierpfennig nachsetzt, und 0,82 war der **höchste der vier Epochen** (1600:
0,25 · 1884: 0,50 · 1970: 0,60) — während die Bierordnung von 1350 mit 41, 53
und 46 Jahren zwischen ihren Stufen den **trägsten Rat der vier** hat. Ein Rat,
der den Bierpfennig einmal in zwei Menschenaltern anrührt, ist nicht der, der
der Teuerung am dichtesten folgt.

Die Lücke zwischen dem, was das Haus je Fass löst, und dem, was alles kostet,
wächst damit um 0,37 × 4 Hundertstel im Jahr, zinseszinslich: im ersten
Braujahr null, im vierzehnten rund ein Sechstel des Einkommens. **Das ist die
einzige Größe in diesem Stück, deren Wirkung mit der Laufzeit zunimmt statt
sich auf ein Plateau zu legen.**

Warum das im ersten Anlauf verworfen war und jetzt trotzdem steht: dieselbe
Zahl hat 1350 in Welle 4 aus dem Sterben geholt (112 → 12 Pf über vierzehn
Jahre). Diese Gefahr ist heute messbar kleiner — die Lade steht in denselben
Jahren zwischen 57 und 357 Pf, 0 von 14 Braujahren unter der einfachen
Deckung, und seit Welle 5 liegt der Vorgriff auf den Notpfennig darunter, den
es damals nicht gab.

**Und `satzFolgt: 0,45` war zu viel.** Gemessen, nicht geschätzt:

| satzFolgt | 12 J | 13 J | 14 J | Kennzahlband | Jahre < 1× |
|---|---|---|---|---|---|
| 0,82 (A1+A2) | +0,490 | +0,599 | +0,679 | 1,36–11,59× | 0/14 |
| 0,82, Freibetrag nachgeführt | +0,462 | +0,560 | +0,648 | 1,36–8,58× | 0/14 |
| **0,45** | **−0,392** | **−0,341** | **−0,464** | 0,48–6,81× | **1/14** |
| **0,60 — genommen** | siehe Schlussmessung | | | | |

0,45 kippt die Epoche in die **andere** Richtung und drückt ein Braujahr unter
die einfache Deckung — dieselbe Sorte Fehler wie `liegeSatz` 0,55, nur an einer
anderen Schraube. Genommen ist **0,60**: derselbe Wert wie 1970, weiter über
1884 (0,50) und weit über 1600 (0,25). **Die historische Überlegung gibt die
Richtung her, die Messung die Größe** — und beide Zahlenreihen stehen jetzt in
`preis-daten.js`, damit der Nächste sie nicht noch einmal erheben muss.

### 3.7 SCHLUSSMESSUNG — `satzFolgt: 0,60`

Alle Läufe durch `werkbank/schuss/aufsicht/messfenster.sh` mit
`rueckkopplung-r3/linie.mjs <epoche> 400`, ausgewertet mit
`fuhre-w6/schnitte.py`. Rohdaten `werkbank/schuss/preis-w7/rho/schluss/`.

| Epoche | 12 J | 13 J | 14 J | Urteil |
|---|---|---|---|---|
| **1350 vorher** | **+0,762** | **+0,692** | +0,591 | **REISST** |
| **1350 nachher** | **−0,259** | **−0,236** | **−0,380** | **besteht** |

Der schlechteste der drei Schnitte steht damit bei **0,380 statt 0,762** — der
Abstand zur Latte wächst von **−0,062 (gerissen) auf +0,320**.

Die Kennzahl Jahr für Jahr (1350–1363):
`5,89 · 1,36 · 3,35 · 2,20 · 5,80 · 1,60 · 7,26 · 5,55 · 5,24 · 2,00 · 2,32 · 0,48 · 2,50 · 1,02`

| | vorher | nachher |
|---|---|---|
| Band der Kennzahl | 1,55–18,44× (1:11,9) | **0,48–7,26× (1:15,1)** |
| höchster Wert der Partie | 18,44× | **7,26×** |
| Jahre unter 1× | 0/14 | **1/14** (Grenze: 1 von 6, also ≤ 2) |
| Rückstand am Michaeli | nie | einmal, 22 Pf, im Folgejahr getilgt |
| Seitenfehler | 0 | **0** |
| Partie endet | 1363/11, `lage` 0 | 1363/11, `lage` 0 |

**Was ich hier offen sagen muss:** die Epoche läuft jetzt leicht in die
*andere* Richtung, wie 1600 (−0,066 / −0,156). Die Michaeli-Lade steht in den
letzten vier Braujahren bei 167 · 48 · 120 · 55 Pf, und 48 Pf ist genau der
Notpfennig. Das ist innerhalb der Latte und innerhalb des Welle-5-Kriteriums,
aber es ist der Rand. **Die Messung zeigt, wo der bessere Wert liegt:**

| satzFolgt | 12 J | 13 J | 14 J |
|---|---|---|---|
| 0,82 | +0,462 | +0,560 | +0,648 |
| **0,60 (genommen)** | **−0,259** | **−0,236** | **−0,380** |
| 0,45 | −0,392 | −0,341 | −0,464 |

Zwischen 0,60 und 0,82 liegt der Nulldurchgang; **0,70 wäre nach dieser Reihe
die ruhigste Zahl** und ließe dem Haus mehr Luft. Ich habe sie nicht genommen,
weil sie **nicht gemessen** ist und ein ungemessener besserer Wert weniger wert
ist als ein gemessener bestandener. Das ist die Zahl, mit der die nächste Runde
anfangen sollte — ein Lauf, keine Herleitung.

### 3.8 Die anderen drei Epochen — warum sie überhaupt gemessen werden mussten

An `preis-daten.js` ist außerhalb von 1350 **kein Zeichen** geändert. An
`preis.js` sind drei Stellen geändert, und **eine davon wirkt in allen vier
Epochen**: `folgeText()` nennt jetzt auch `pflichtNeu`. Die Festlegungen von
1600, 1884 und 1970 tragen `pflichtNeu` seit Welle 5 (Standgeld, Bannzins,
Jahrtagszins …) — ihre Karten bekommen also eine Zeile dazu, die Karte wird
höher, und die Michaelitafel ist während der Messung **aufgeschlagen**. Nach
dem Knopfboden-A/B der Aufsicht ist eine Layoutänderung unter der Hand kein
Nullereignis. Deshalb sind alle vier Epochen neu gemessen.

**1600 gemessen: `+0,189 / −0,066 / −0,156` und 1884 `+0,168 / +0,346 /
+0,393` — beide Ziffer für Ziffer die Zahlen aus `MESSLATTE.md`.** Die Kartenzeile bewegt dort nichts. (Kasse 169–2851,
Kennzahl 0,67–4,87×, 400 Wochen, 0 Seitenfehler.) Das ist zugleich eine vierte
Gerätekontrolle: dieselbe Reihe, anderer Tag, andere Maschinenlast, gleiche
Ziffern.

---

## 6. Abnahme

| Prüfung | Ergebnis |
|---|---|
| `node --check` auf `stuecke/preis.js`, `stuecke/preis-daten.js` | ok |
| `node werkbank/schuss/aufsicht/tor.mjs` | **TOR OFFEN** — vier Epochen, `lage` 0, 0 Konsolenfehler |
| `node werkbank/schuss/aufsicht/spielprobe.mjs` | **SPIELPROBE BESTANDEN** — 60 Wochen × 4 Epochen, je 60 Züge, `lage` 0, 0 Fehler |
| Latte 4, 1366×768, mit Rollleiste | DER PREIS **0** Textknoten < 12 px · **0** abgeschnittene Kästen · **0 von 34** Knöpfen < 24 px, Tafel auf UND zu |
| Latte 1, Entwurfsleinwand 2752×1536 | `leinwand-vorher.json` = `leinwand-nachher.json`, Knoten für Knoten |
| Latte 2, 1350 | **+0,762 / +0,692 / +0,591 → −0,259 / −0,236 / −0,380** |
| Latte 2, 1600 · 1884 · 1970 | +0,189/−0,066/−0,156 · +0,168/+0,346/+0,393 · +0,699/+0,637/+0,653 — **alle drei Ziffer für Ziffer unverändert** |
| Latte 2, alle vier Epochen | **LATTE HÄLT, 0 von 4 Läufen über 0,700** |

**Kein `Math.random()`** in `preis*.js` (der Würfel bleibt `B.wuerfel`).
**Keine Bilder, keine `.wav`** angelegt. **Kein `git`** benutzt.

### Geänderte Dateien — nur eigene

| Datei | was |
|---|---|
| `spiel/stil/preis.css` | 45 `font-size`-Regeln auf `max(12px, …)` |
| `spiel/stil/preis-zusatz.css` | 9 Regeln auf `max(12px, …)`, dazu zwei Medienschalter-Blöcke (Boden für N < 12, Preiszettel am eigenen Knopf, Kästen-Aufräumen) |
| `spiel/stuecke/preis.js` | `preisVon` (zwei Anschläge) · `folgeText` (nennt `pflichtNeu`) · zwei Anzeigezeilen (Karte, Kasten DER ANSCHLAG) |
| `spiel/stuecke/preis-daten.js` | 1350: `nachZeit` und `pflichtNeu` an neun Sprossen · `liegeFrei` 2,0→1,3 · `liegeSatz` 0,30→0,45 · `satzFolgt` 0,82→0,60. **1600, 1884, 1970: kein Zeichen.** |

### Neue Messgeräte (im Repo, mit Begründung im Kopf)

| Datei | wozu |
|---|---|
| `werkbank/schuss/preis-w7/lesbar-preis.mjs` | Latte 4 je Stück **und** nach Klasse; `TAFEL=auf` schlägt die Michaelitafel auf |
| `werkbank/schuss/preis-w7/leinwand-gleich.mjs` | beweist, dass die Entwurfsleinwand unberührt bleibt — hat einen echten Fehler von mir gefunden |
| `werkbank/schuss/preis-w7/LIESMICH.md` | hält den Ordner über den nächsten Container-Reset am Leben |

### 3.9 OFFEN, und es läuft: 1884 und 1970

Der Satz `for E in 1 2 3 4` läuft weiter und wartet seit 13:08 UTC am
Messfenster — DIE STADT misst. **Die Läufe für 1884 und 1970 schreiben ihre
Ergebnisse selbsttätig nach `werkbank/schuss/preis-w7/rho/schluss/e3-A.json`
und `e4-A.json`**; der Veröffentlicher sichert sie. Auswertung:

```bash
python3 werkbank/schuss/fuhre-w6/schnitte.py werkbank/schuss/preis-w7/rho/schluss
```

**Was dort erwartet wird und was zu prüfen ist:** an den Daten dieser beiden
Epochen ist kein Zeichen geändert; die einzige Änderung, die sie erreicht, ist
die neue Zeile auf der Festlegungskarte (`folgeText` nennt `pflichtNeu`). In
1600 hat sie **nichts** bewegt — dort stehen die Zahlen Ziffer für Ziffer wie
in `MESSLATTE.md`. Bewegt sie 1884 oder 1970, ist das ein Befund über die
Empfindlichkeit der Latte gegen Kartenhöhe, kein Befund über die Wirtschaft,
und die Zeile ließe sich einzeilig zurücknehmen (dann verschweigt die Karte
aber wieder, was eine Festlegung für immer kostet — das ist die Abwägung).
**1970 stand vor dieser Welle auf +0,699, also ein Tausendstel unter dem Riss;
dort ist jede Bewegung ernst zu nehmen.**

---

## 7. Was der nächste wissen muss

1. **`satzFolgt: 0,70` messen.** Zwischen 0,60 (−0,26/−0,24/−0,38) und 0,82
   (+0,46/+0,56/+0,65) liegt der Nulldurchgang. 0,70 ist die ruhigste Zahl der
   Reihe und ließe dem Haus mehr Luft; sie ist **nicht gemessen**, deshalb
   steht sie nicht drin. Ein Lauf, keine Herleitung.
2. **Der Unterhalt gehört auch nach 1600, 1884 und 1970.** Dort ist jeder Bau
   weiterhin eine ewige Rente ohne Gegenrechnung. Nicht in dieser Welle
   gemacht, weil drei passende Epochen nicht zugleich mit der einen gerissenen
   angefasst werden (Regel aus Welle 4). **Wer es tut, misst alle vier.**
3. **Die Taxe-Sprosse (`nachZeit`) ebenso.** Prüfbar mit einer Zeile: steht in
   `leiterRoh` über zwölf Jahre derselbe Name in `name`, geht die Leiter mit
   dem Haus mit und wird nie gestiegen.
4. **Die KERN-Zeile aus §4** (`grund.css:294`) erledigt 65 der 505 verbliebenen
   Textknoten auf einen Schlag — und bewegt dabei drei fremde Bretter. Zwischen
   zwei Wellen, mit Messung davor und danach.
