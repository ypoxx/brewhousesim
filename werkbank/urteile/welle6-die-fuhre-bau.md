# DIE FUHRE — Bau, Welle 6

*Builder-Bericht, laufend geschrieben. Auftrag: die vierte Latte
(`gauntlet/MESSLATTE.md` §4, Lesbarkeit bei 1366×768) so weit schliessen, wie
sie in meinen Dateien liegt — und die drei anderen Latten dabei nicht reissen.*

**Meine Dateien:** `spiel/stuecke/fuhre*.js`, `spiel/stil/fuhre*.css`.
`spiel/index.html` und `spiel/kern/**` sind unberührt. Kein `git`.

---

## Der Messstand — zuerst, weil ohne ihn keine Zahl trägt

Drei Builder schreiben gleichzeitig. Das ist keine Vermutung: zwischen meinem
ersten und meinem zweiten Kommando ist der Arbeitsbaum von `456a229` auf
`3465eb3` gesprungen (DER SUD, „Zwischenstand gesichert"). Auf einem
wandernden Baum gemessene Zahlen sind wertlos.

Deshalb **zwei eingefrorene Stände aus demselben Commit `3465eb3`**:

| Stand | Hafen | Inhalt |
|---|---|---|
| `vorher` | **8961** | `git archive 3465eb3`, unangetastet |
| `nachher` | **8952** | derselbe Archivstand, in den **nur meine Dateien** kopiert werden |

Zwischen zwei Messungen bewegt sich damit genau das, was ich bewege — nichts
sonst. Gemessen wird **sequenziell**, nie zwei Browser gleichzeitig.

---

## 1 — Der Stand vor der Arbeit

`werkbank/schuss/aufsicht/lesbarkeit.mjs`, alle vier Epochen, 1366×768,
Hafen 8961:

| | E1 | E2 | E3 | E4 | **Summe** |
|---|---|---|---|---|---|
| abgeschnittene Kästen | 25 | 26 | 25 | 21 | **97** |
| Textknoten unter 12 px | 462 | 477 | 476 | 484 | **1.899** |
| davon unter 10 px | 440 | 453 | 452 | 461 | **1.806** |
| Knöpfe unter 24×24 px | 0/82 | 0/83 | 0/87 | 0/82 | **0/334** |

Die Knopfspalte ist bereits geschlossen — das ist die Arbeit von DIE
LESBARKEIT (`grund.css`, Knopfboden) und DER SUD (Auflage 4). Offen sind
**Schriftgrösse** und **abgeschnittener Text**.

Aufgeschlüsselt nach Stück (eigenes Messgerät, gleiche Zählregel wie die
Aufsicht, zusätzlich nach nächstem Brett-Vorfahren sortiert):

| Stück | Textknoten <12 px | | Stück | abgeschnittene Kästen |
|---|---|---|---|---|
| **DIE FUHRE** | **771** | | DIE STADT | 53 |
| DER SUD | 356 | | DER SUD | 28 |
| DIE STADT | 191 | | DER NAME | 6 |
| DER GEGNER | 172 | | **DIE FUHRE** | **5** |
| DAS ERBE | 164 | | DER GEGNER | 4 |
| DER NAME | 149 | | DAS ERBE | 1 |
| Kern | 48 | | | |
| DER PREIS | 48 | | | |

**771 von 1.899 — 40,6 % des gesamten Befundes liegen in DIE FUHRE.** Das
deckt sich Ziffer für Ziffer mit der Zählung von DIE LESBARKEIT und ist damit
unabhängig zweimal gemessen.

---

## 2 — Auflage 1: die eine Zeile, und der Beweis, dass sie etwas bewegt

`spiel/stuecke/fuhre.js:2460` (alt) → jetzt `:2479`:

```js
var BEZUG = 'min(calc(100vw / 2752), calc(100vh / 1536))';   // ALT
var BEZUG = 'var(--s0)';                                     // NEU
```

**Der Name ist im Quelltext nachgeprüft**, nicht aus dem Auftrag übernommen:
`spiel/stil/grund.css:63` — `--s0: min(calc(100vw / 2752), calc(100vh / 1536));`,
daneben `:81` — `--s: max(var(--s-boden), var(--s0));` und `:184` —
`#ebene-platte, #ebene-bau { --s: var(--s0); }`.

### Bewegt sich unter `.fu-liste` wirklich etwas?

Die Probe dreht **zur Laufzeit** am Bühnenpixel `--s0` — sie ändert keine
Datei, schon gar nicht `grund.css` — und sieht nach, ob die Adressliste folgt.
Epoche 1884, 1366×768, alle 80 Textknoten unter `.fu-liste`:

| | wie geladen | `--s0` verdoppelt | Faktor |
|---|---|---|---|
| **alt** (Formel abgeschrieben) | 4,31 px | **4,31 px** | **1,00×** |
| **neu** (`var(--s0)`) | 4,31 px | **8,62 px** | **2,00×** |

Das ist der ganze Befund in einer Tabelle. Mit der abgeschriebenen Formel ist
das Brett **taub** — was `grund.css` am Bezugspixel tut, kommt unter
`.fu-liste` nicht an; genau deshalb blieben bei DIE LESBARKEIT auf Weg A auch
bei Faktor 2,42 noch 80 Knoten unter 10 px stehen. Mit `var(--s0)` folgt es
auf die zweite Stelle genau.

Und: **wie geladen ist beides identisch** (4,31 px, 80 Knoten). Die Zeile
ändert heute nichts am Bild — sie stellt nur die Verbindung her. Das ist die
Voraussetzung dafür, dass Latte 1 unberührt bleibt (§5).

### Was die Zeile NICHT tut — und das gehört in den Bericht

`--s0` ist das Bühnenpixel **ohne** Boden. `--s-boden` aus `grund.css` wirkt
also auch nach dieser Änderung nicht unter `.fu-liste` — das ist kein Versehen,
sondern die ausdrückliche Bauanweisung in `grund.css:48`
(*„schreibt `calc(<faktor> * var(--s0))`"*), und sie ist richtig: ein Boden,
den ein Faktor von 0,34 anschließend wieder wegmultipliziert, wäre keiner.
**Den Boden für die Schrift setzt Auflage 2, absolut, in Pixeln** — und das ist
auch der einzige Weg, der laut Messung von DIE LESBARKEIT unter `.fu-liste`
überhaupt greift.

---

## 3 — Auflage 2: der Schriftboden, mechanisch

100 Regeln, `font-size: calc(var(--s) * N)` → `font-size: max(12px, calc(var(--s) * N))`:

| Datei | Regeln | N-Bereich |
|---|---|---|
| `spiel/stil/fuhre.css` | 48 | 10 … 26 |
| `spiel/stil/fuhre-zusatz.css` | 52 | 13 … 26 |

*(DIE LESBARKEIT hatte 48 + 52 = 100 gezählt; die Zählung stimmt Regel für
Regel überein. Inline gesetzte Schriftgrößen im Javascript hat DIE FUHRE
keine — `grep fontSize stuecke/fuhre*.js` ist leer.)*

**Zwei Regeln bekommen den Boden nur unterhalb der Entwurfsleinwand**, und das
ist der einzige Punkt, an dem die mechanische Umstellung nicht mechanisch ist:
`.fu-fass em` (N = 11) und `.fu-fass.klein em` (N = 10) sind die einzigen
Regeln des Stücks mit N < 12. Auf 2752×1536 ist `--s` = 1 px, dort würde der
Boden sie von 11 px bzw. 10 px auf 12 px **anheben** — und genau dort
vergleicht Latte 1 blind. Ihr Boden steht deshalb hinter demselben
Medienschalter, den `grund.css` für den Knopfboden benutzt
(`@media (max-width: 2751px), (max-height: 1535px)`). Für alle anderen 98
Regeln ist die Umstellung auf der Entwurfsleinwand wirkungslos, weil
`max(12px, calc(1px * N))` für N ≥ 12 wieder N px ergibt.

---

## 4 — Das Aufräumen: was der Boden aufgerissen hat und was ihn wieder zumacht

**Das ist die eigentliche Arbeit gewesen, nicht die Umstellung.** Rein
mechanisch angewandt kostet der Schriftboden mehr, als er einbringt — hier die
Zwischenmessung, alle vier Epochen, 1366×768, nur `max(12px, …)` und sonst
nichts:

| | vorher | nur Auflage 1 + 2 |
|---|---|---|
| Textknoten unter 12 px | 1.899 | 1.128 |
| davon in DIE FUHRE | 771 | **0** |
| abgeschnittene Kästen | 97 | **117** |
| davon in DIE FUHRE | 5 | **25** |

Zwanzig neue abgeschnittene Kästen — und die 771 gewonnenen Textknoten wären
mit ihnen bezahlt worden. Was danach folgte, sind zwei Blöcke am Ende von
`spiel/stil/fuhre-zusatz.css`, beide hinter
`@media (max-width: 2751px), (max-height: 1535px)`, damit oberhalb der
Entwurfsleinwand nichts davon gilt.

### 4.1 Woher der Platz kommt — die Rechnung, die nicht aufgeht

Gemessen bei 1366×768, Epoche 1970 (elf Adressen, der schlimmste Fall):

| Brett DIE HÄUSER, 565 px hoch | vorher | nach dem Boden |
|---|---|---|
| Kopfzeile | 18 px | 34 px |
| Zettel | 38 px | 38 px |
| DAS ZIEL | 167 px | **300 px** |
| eine Adresskarte | 39 px | **56 px** |
| Liste: frei / nötig | 332 / 445 | 190 / 623 |

**Die Rechnung geht nicht auf, und das ist keine Umsetzungsfrage.** Eine
Adresskarte besteht aus einer Textzeile (12 px → 15 px) und einer Knopfzeile
(24 px, der Knopfboden aus `grund.css`, ein absolutes Maß). Elf davon sind
429 px, bevor irgendetwas anderes auf dem Brett steht. Das Brett hat 565 px
und ist in der Platzordnung festgenagelt: links 1,1 %, 25,6 % breit — rechts
daneben beginnt DIE ANSCHLAGTAFEL bei 27,4 %, unten die Werkbank der STADT.
**Die Adressliste rollt also.** Das tut sie bei 1366×768 heute schon
(332 frei gegen 445 nötig), und sie ist dafür gebaut (`overflow-y: auto`);
Rollen schneidet keinen Text ab, es legt ihn tiefer, und es ist kein Rissgrund
der Latte.

### 4.2 Wo Inhalt weichen musste — WAS und WARUM

Zwei Stellen, beide nur unterhalb der Entwurfsleinwand, beide mit dem Inhalt
im `title` statt im Nichts:

**(a) Der Erklärsatz über den drei Zielkarten** (`.fu-ziel-satz`, 44 px).
Er beschreibt die Zahlungsweise im Allgemeinen. Was die drei Karten
*voneinander* unterscheidet — Beschreibung, drei Prozentzahlen, Preis am
Knopf — steht in den Karten selbst und bleibt vollständig stehen. **Die drei
Karten bleiben nebeneinander**; das ist keine Gestaltungsfrage, sondern
Latte 2 (*„Optionen mit Preisschild nebeneinander, die einander
ausschließen"*), und untereinander gestapelt wären es drei Angebote
hintereinander und keine Wahl mehr. Der Satz steht jetzt im `title` des
Blocks (`fuhre.js`, `zeichneZiel`).

**(b) Die Zahlenkette in der dritten Zeile jeder Adresskarte**
(`.fu-z3 .fu-zahlen`, „12·9·7 von 30 hl", 9 px je Karte). Sie trägt dieselbe
Auskunft wie die Balkenreihe daneben, nur als Text. Bei 1366×768 stand sie
bisher in **4,3 px** — sie war nicht Inhalt, sie war Muster. Auf 12 px
gehoben kostet sie bei elf Adressen rund **zwei ganze Adresskarten** aus der
sichtbaren Liste. Die Balken bleiben (mit eigener Untergrenze, damit sie nicht
verschwinden), und die drei Zahlen wandern **vollständig** in den `title` der
Balkenreihe — der sie vorher nicht enthielt, jetzt schon (`fuhre.js`,
`hausKarte`).

Beides ist ein Tausch, kein Gewinn, und beides ist so gewählt, dass die
Auskunft eine Mausbewegung entfernt bleibt statt verloren zu sein.

### 4.3 Was nur umbricht statt abzuschneiden

Sechs Kästen liefen über, weil bei 12 px in einer 315 px breiten Spalte nicht
mehr nebeneinander passt, was bei 7 px passte. Keiner davon verliert Inhalt:

| Kasten | gemessen (Kasten → Inhalt) | was getan wurde |
|---|---|---|
| `.fu-kopf` (alle vier Bretter) | 348 → 353…360 breit | Stand darf unter den Namen umbrechen |
| `.fu-notsud-zeile` | 225 → 376…527 breit | umbrechen statt abschneiden |
| `.fu-kerbzeile b` | 57…86 → 178…255 breit | umbrechen statt abschneiden |
| `.fu-knappheit` | 303×3 → 303×19 | war *zerdrückt*: `flex: 0 1 auto` → `0 0 auto` |
| `.knopf .preis` (Tafel, Wagen) | +4 … +68 px über die Kante | Preis rutscht unter die Beschriftung |
| `.fu-wagen .knopf .wort` | 117 → 132 breit | „Halber Wagen · bis 60 hl" darf umbrechen |

### 4.4 Die Anschlagtafel bekommt EINEN Roller statt eines zerdrückten

Der teuerste Einzelbefund. Was die Tafel bei 12 px braucht, ohne dass etwas
abgeschnitten wird (1366×768, Epoche 1350, Kasten 327 px):

```
Kopf 34 · Budget 48 · Rohstoff 30 · Sorten 136 · Notsud 63 ·
Kerbholz 65 · Knappheit 51 · Kaufknöpfe 98            = 525 px
```

198 px mehr, als die Platzordnung hergibt. Bisher rollte **nur** die
Sortenliste, alles andere stand auf `flex: 0 0 auto`. Bei 198 px Fehlbetrag
heißt das: die Sortenliste wird auf **null** zusammengeschoben — die drei
Biere des Hauses, das Herzstück des Bretts, waren nicht mehr zu sehen — und
der Rest lief unten aus dem Brett heraus, **mitsamt den Kaufknöpfen**. Das
sind Züge mit Preisschild, also genau das, was Latte 2 zählt.

Jetzt rollt die Tafel und nicht mehr die Liste darin: ein Roller statt zweier
ineinander. Alles bleibt vollständig lesbar und mit dem Rad erreichbar, nichts
wird abgeschnitten, und die Sortenliste steht wieder mit ihren 136 px da.
Oberhalb der Entwurfsleinwand passt die Tafel und rollt nicht.

### 4.5 Die Untergrenze der Adressliste: 0,62 → 0,34

`fuhre.js`, `passeListe`. Die Grenze stand auf 0,62, und der Grund stand
daneben: *„darunter wäre die Zeile nicht mehr zu lesen"*. Das war richtig,
solange jede Schrift ein Vielfaches des Bezugspixels war. **Seit dem
Schriftboden kann die Schrift nicht mehr unter 12 px fallen, egal wie klein
das Bezugspixel dieser Liste wird** — was der Faktor noch schrumpft, ist
ausschließlich Weißraum. Eine Untergrenze, die Lesbarkeit schützen sollte,
schützte nur noch Luft.

Gemessen bei 1920×1000, Epoche 1970, elf Adressen:

| Grenze | Karte | Liste nötig | von 11 Adressen sichtbar |
|---|---|---|---|
| 0,62 | 56 px | 623 px | 7 |
| **0,34** | **44 px** | **520 px** | **9,8** |

Dazu drei Anläufe statt zweier: mit dem Boden trifft der erste Schätzwert
schlechter, weil ein Teil der Höhe (Schrift, Knopf) gar nicht mehr
mitschrumpft.

---

## 5 — Latte 1, das Bild: unberührt, und zwar nachgerechnet

Je zwei Aufnahmen aller vier Epochen auf **2752×1536**, mit `werkbank/schuss.mjs`
im Format der Zielbilder, vorher und nachher, jede Fassung **zweimal**:

```
werkbank/schuss/fuhre-w6/vorher/E{1..4}-2752.png     alte Datei, Durchgang A
werkbank/schuss/fuhre-w6/vorher-b/E{1..4}-2752.png   alte Datei, Durchgang B
werkbank/schuss/fuhre-w6/nachher/E{1..4}-2752.png    neue Datei, Durchgang A
werkbank/schuss/fuhre-w6/nachher-b/E{1..4}-2752.png  neue Datei, Durchgang B
```

| Vergleich | E1 | E2 | E3 | E4 |
|---|---|---|---|---|
| **alt gegen neu** (A/A) | identisch | identisch | identisch | 4.873 px, max 11 |
| alt gegen neu (B/B) | identisch | identisch | identisch | 6.692 px, max 19 |
| **alte Datei gegen sich selbst** (A/B) | identisch | identisch | identisch | **6.728 px, max 39** |
| **neue Datei gegen sich selbst** (A/B) | identisch | identisch | identisch | **5.263 px, max 12** |

**E1, E2 und E3 sind Byte für Byte identisch** — in allen vier Vergleichen.

**E4 weicht ab, aber nicht von mir.** Die letzten beiden Zeilen sind der
Beweis: dieselbe Datei zweimal hintereinander aufgenommen weicht *genauso* ab,
mit der alten wie mit der neuen Fassung, und zwar in demselben Kasten:

```
alte Datei gegen sich selbst : x 2087–2296  y 900–994   (210×95)
neue Datei gegen sich selbst : x 2090–2293  y 904–994   (204×91)
alte gegen neue Fassung      : x 2091–2296  y 906–992   (206×87)
```

Der Kasten liegt in DER GEGNER (0,12 % der Bildfläche); dort wird etwas von
Lauf zu Lauf anders gezeichnet. Die Abweichung zwischen alt und neu ist
**kleiner** als das Rauschen der alten Datei mit sich selbst. Denselben Kasten
hat DIE LESBARKEIT unabhängig gefunden (x 2128–2264, y 911–970).

→ **Latte 1 ist unberührt.** Der Grund steht im Bau und nicht im Zufall: alles,
was ich an Platz und Umbruch geändert habe, steht hinter
`@media (max-width: 2751px), (max-height: 1535px)`, und der Schriftboden
`max(12px, calc(1px * N))` ist auf der Entwurfsleinwand für N ≥ 12 wirkungslos.
Die zwei Regeln mit N < 12 stehen deshalb ebenfalls hinter dem Medienschalter
(§3).

---

*(Latte 2 wird gerade gemessen — acht Läufe zu 400 Wochen, sequenziell)*
