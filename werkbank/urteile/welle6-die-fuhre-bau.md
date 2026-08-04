# DIE FUHRE — Bau, Welle 6

*Builder-Bericht, laufend geschrieben. Auftrag: die vierte Latte
(`gauntlet/MESSLATTE.md` §4, Lesbarkeit bei 1366×768) so weit schliessen, wie
sie in meinen Dateien liegt — und die drei anderen Latten dabei nicht reissen.*

**Meine Dateien:** `spiel/stuecke/fuhre*.js`, `spiel/stil/fuhre*.css`.
`spiel/index.html` und `spiel/kern/**` sind unberührt. Kein `git`.

---

## Das Ergebnis in einer Tabelle

Alle vier Epochen, 1366×768, `werkbank/schuss/aufsicht/lesbarkeit.mjs` der
Aufsicht (unangetastet benutzt), gemessen auf zwei eingefrorenen Ständen
desselben Commits — und am Ende noch einmal am laufenden Arbeitsbaum auf 8899,
Ziffer für Ziffer dasselbe:

| Kriterium der vierten Latte | vorher | **nachher** |
|---|---|---|
| Textknoten unter 12 px, ganzes Spiel | 1.899 | **1.128** |
| davon in **DIE FUHRE** | **771** | **0** |
| kleinste Schrift in DIE FUHRE | **4,3 px** | **12,0 px** |
| abgeschnittene Kästen, ganzes Spiel | 97 | **92** |
| davon in **DIE FUHRE** | **5** | **0** |
| aktive Knöpfe unter 24×24 px | 0 / 334 | 0 / 334 |

**Beide Zahlen sind gefallen** — die zu kleinen Textknoten *und* die
abgeschnittenen Kästen. Das war der ausdrückliche Auftrag und nicht
selbstverständlich: die mechanische Umstellung allein hätte die Kästen von 97
auf 117 getrieben (§4).

Die übrigen 1.128 Knoten liegen in DER SUD (356), DIE STADT (191), DER GEGNER
(172), DAS ERBE (164), DER NAME (149), Kern (48) und DER PREIS (48) — nicht in
meinen Dateien.

Die anderen drei Latten:

| | Stand |
|---|---|
| **Latte 1, das Bild** | unberührt — E1/E2/E3 Byte für Byte identisch, E4 nachweislich Eigenrauschen (§5) |
| **Latte 2, die Kennzahl** | einmal von mir gerissen, gefunden, repariert, nachgemessen — kein Schnitt über 0,700, aber 1970 steht auf **+0,699** (§6) |
| **Latte 3, der Ton** | nicht berührt, keine Datei des KLANG angefasst |
| Sperrliste, Gewicht | +11 KB CSS-Text, keine neuen Anfragen |

**Abnahme am laufenden Arbeitsbaum (Hafen 8899), jede Messung einzeln durch
`werkbank/schuss/aufsicht/messfenster.sh`:**

```
node --check   fuhre.js · fuhre-daten.js · fuhre-zusatz.js     OK
tor.mjs        E1–E4 OK, lage=0, 105–116 Zuege, 0 Fehler       TOR OFFEN
spielprobe.mjs E1–E4 OK, je 60 Wochen, 60 Zuege, 0 Fehler      BESTANDEN
lesbarkeit.mjs 92 Ueberlaeufe · 1128 <12px · 0/334 Knoepfe     (1366x768)
```

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

## 6 — Latte 2, die Kennzahl: der teuerste Befund dieses Baus

**Ich habe Latte 2 einmal gerissen und es an der Messung gemerkt.** Das gehört
an den Anfang dieses Abschnitts, weil es die Lehre des ganzen Auftrags ist:
*wer nur die eigene Latte misst, tauscht sie gegen eine andere.*

### 6.1 Der Riss — und woran er lag

Erster Anlauf beim Aufräumen: die Anschlagtafel bekam `overflow-y: auto`, damit
nichts mehr abgeschnitten wird. Bei 1366×768 war das richtig. Bei **1920×1000**
— dem Fenster, in dem die Kennzahl gemessen wird — wuchs die Tafel im Lauf der
Partie auf 444…486 px in einem 426-px-Kasten, und was unten hinausrollte, waren
die **Kaufknöpfe**: `fuhre:kauf:rohstoff` und `fuhre:tafel-auf:*`, also
Rohstoff und Sudplan.

Eine Hand, die einen Knopf nicht trifft, klickt ihn nicht — `linie.mjs` prüft
vor jedem Klick mit `elementFromPoint`, genau wie ein Mensch, der nur sieht,
was im Bild ist. Ergebnis, Epoche 1350, dieselbe Saat, dieselbe Hand:

| | Kennzahl 1350 → 1363 | Spitze | ρ über 14 Braujahre |
|---|---|---|---|
| vorher | 5,89 → 8,20 | 18,4 | **+0,591** |
| erster Anlauf | 5,89 → 0,89 | 5,9 | **−0,724** |

Das Haus konnte den Sudplan nicht mehr aufstocken und keinen Rohstoff mehr
kaufen. **Latte 4 gewonnen, Latte 2 dafür gerissen.** Gefunden wurde es nur,
weil die Vorher/Nachher-Reihe Woche für Woche verglichen wurde: die erste
Abweichung stand in Woche 4 des ersten Jahres — Rohstoff 62 gegen 22, Kasse 97
gegen 131, also ein ausgefallener Rohstoffkauf.

### 6.2 Die Reparatur: die Knöpfe rollen nicht mit

`position: sticky; bottom: …` auf `.fu-tafel .fu-kaeufe`. Die Knopfzeile bleibt
am unteren Rand des rollenden Kastens stehen, während alles darüber
durchläuft — keine Zeile Javascript, und die Züge bleiben im Bild. Dazu ein
Boden von 60 px für die Sortenliste (damit sie nicht mehr auf null
zusammengeschoben wird) und eine zweispaltige statt zweizeilige Sortenzeile
(die Stellknöpfe stehen rechts neben beiden Textzeilen statt unter der ersten:
30 px statt 39 px je Sorte).

Nachgemessen, 1920×1000, je 40 Wochen mit `WEITER` durchgespielt, alle vier
Epochen — **160 Wochen je Epoche geprüft**:

| | Tafel rollt | Kaufknopf unter der Kante |
|---|---|---|
| vorher | 0 von 160 Wochen | 0 |
| erster Anlauf | 66 von 160 Wochen | **16** |
| **jetzt** | 56 von 160 Wochen | **0** |

Die Tafel rollt weiterhin — das lässt sich bei 12 px nicht vermeiden —, aber
kein Zug verschwindet mehr aus dem Bild.

### 6.3 Was am Ende herauskam

Vier Epochen, drei Schnitte (12, 13, 14 Braujahre), Spearman über
(Jahresnummer, Kennzahl) aus `BRAUHAUS.preis.leiter()`, Hand
`werkbank/schuss/rueckkopplung-r3/linie.mjs` (kopiert benutzt, nicht
angefasst), 400 Wochen je Lauf, Saat 1350, **sequenziell**:

| Epoche | | 12 J | 13 J | 14 J | |
|---|---|---|---|---|---|
| **1350** | vorher | +0,762 | +0,692 | +0,591 | *reißt schon vorher* |
| | nachher | **+0,762** | **+0,692** | **+0,591** | **Ziffer für Ziffer identisch** |
| **1600** | vorher | +0,371 | +0,264 | +0,231 | |
| | nachher | +0,189 | −0,066 | −0,156 | näher an null |
| **1884** | vorher | +0,168 | +0,346 | +0,393 | |
| | nachher | **+0,168** | **+0,346** | **+0,393** | **Ziffer für Ziffer identisch** |
| **1970** | vorher | +0,427 | +0,379 | +0,455 | |
| | nachher | +0,699 | +0,637 | +0,653 | unter 0,700, aber knapp |

**1350 und 1884 sind Ziffer für Ziffer dieselbe Partie wie vorher** — dieselbe
Kasse (39–609 bzw. 1757–23789), dieselbe Kennzahlreihe. Das ist der stärkste
mögliche Beleg dafür, dass die Hand dieselben Züge gefunden hat.

Der Riss bei **1350 / 12 Braujahre (+0,762) bestand schon vorher** und steht so
auch in `MESSLATTE.md`; er ist nicht meiner und meine Arbeit verschiebt ihn um
keine Stelle.

### 6.4 Der Satz ist wiederholt — durch die Sperre, und er reproduziert sich

Der erste Satz ist unter **Fremdlast** entstanden (DER SUD fuhr daneben
`sudhand.mjs 4 400`, Load average 3,7 bis 4,3). Die Aufsicht hat das gemeldet
und dafür `werkbank/schuss/aufsicht/messfenster.sh` eingeführt — eine echte
Sperre, die immer nur eine Messung auf der Maschine zulässt.

Der Satz ist damit wiederholt worden, **jede Messung ein eigener Aufruf durch
die Sperre**, hintereinander, in der Reihenfolge der Dringlichkeit
(1970 zuerst — die einzige Zahl nahe der Latte):

| Epoche | | erster Satz (Fremdlast) | Wiederholung (durch die Sperre) |
|---|---|---|---|
| **1970** | vorher | +0,427 / +0,379 / +0,455 | **+0,427 / +0,379 / +0,455** |
| | nachher | +0,699 / +0,637 / +0,653 | **+0,699 / +0,637 / +0,653** |
| **1600** | vorher | +0,371 / +0,264 / +0,231 | **+0,371 / +0,264 / +0,231** |
| | nachher | +0,189 / −0,066 / −0,156 | **+0,189 / −0,066 / −0,156** |
| **1350** | vorher | +0,762 / +0,692 / +0,591 | **+0,762 / +0,692 / +0,591** |
| | nachher | +0,762 / +0,692 / +0,591 | **+0,762 / +0,692 / +0,591** |

**Ziffer für Ziffer identisch, in jeder einzelnen Zelle** — dazu dieselbe Kasse
(1998–86000 bzw. 1030–114537, 251–2525 bzw. 169–2851, 39–609 bzw. 39–609) und
dieselbe Kennzahlreihe. Die Hand `linie.mjs` mit `RUHE=1` hat unter beiden
Bedingungen dieselbe Partie gespielt; das ist genau das, was ihr Bau verspricht
(*„RUHE=1 liefert unter schwerer Last dieselbe Reihe wie WARTE=3 auf der
ruhigen Maschine"*), und hier steht es nachgemessen. **Der erste Satz war also
nicht verdorben** — aber das wusste vorher niemand, und deshalb war die
Wiederholung richtig.

Bei **1350** ist zusätzlich vorher gleich nachher: dieselbe Partie, dieselbe
Kasse, dieselbe Reihe. Dasselbe galt im ersten Satz für **1884**.

*(1884 lief zum Zeitpunkt dieses Eintrags noch in der Warteschlange der Sperre;
im ersten Satz war es vorher wie nachher +0,168 / +0,346 / +0,393, also
identisch.)*

Beide Sätze liegen unter `/tmp/fuhre-rho/` (`last-*` erster Satz,
`w2-*` Wiederholung durch die Sperre).

### 6.5 Die eine Zahl, die ich hervorheben muss

**1970 steht bei zwölf Braujahren auf +0,699.** Die Latte reißt bei 0,700. Das
ist ein Tausendstel Abstand, und vorher war dieselbe Zahl +0,427. Sie besteht,
aber sie besteht knapp, und sie ist durch meine Arbeit dorthin gewandert.

Woher sie kommt, ist gemessen und nicht geraten: bei 1920×1000 zeigt die
Anschlagtafel mit 12 px Mindestschrift nur noch etwa drei ihrer vier Sorten —
eine Sortenzeile ist dort 30 px hoch statt 28, und der Kasten dafür ist von
114 px auf ~100 px geschrumpft, weil Kerbholz, Knappheit und Notsud darüber
alle gewachsen sind. Die Hand greift dadurch seltener zum letzten Sud
(`fuhre:tafel-ab:` wählt den letzten der Liste), und das Haus wird am Ende
reicher (114.537 statt 86.000) statt gleichmäßig.

**Das ist kein Rest, den man wegdiskutieren kann.** Wenn die Aufsicht
nachmisst, ist das die Zahl, auf die sie sehen sollte.

---

## 7 — Was in fremden Dateien liegen bliebe (KERN und Nachbarn)

**KERN:** keiner. `spiel/index.html` und `spiel/kern/**` sind unberührt, und es
gab keinen Anlass, sie anzufassen. Der Knopfboden, den DIE FUHRE gebraucht
hätte, steht bereits in `grund.css` (DIE LESBARKEIT, Welle 6) und wirkt; in
allen vier Epochen sind **0 von 334** aktiven Knöpfen unter 24×24 px.

**Was in `grund.css` auffiel, aber nicht meine Datei ist** (kein Auftrag, nur
zur Kenntnis der Aufsicht): `.knopf` selbst trägt dort noch
`font-size: calc(var(--s) * 24)` und `.knopf .preis`
`font-size: calc(var(--s) * 20)` ohne Boden. Bei 1366×768 sind das 11,9 px
bzw. 9,9 px. Sie sind Teil der 48 Kern-Textknoten unter 12 px, die in meiner
Aufschlüsselung unter „Kern" stehen. Auflage 2 der LESBARKEIT nennt für
`grund.css` zwölf Regeln; diese beiden gehören dazu.

---

## 8 — Geänderte Dateien

| Datei | Art der Änderung |
|---|---|
| `spiel/stuecke/fuhre.js` | `BEZUG = 'var(--s0)'`; Untergrenze der Adressliste 0,62 → 0,34 mit drei statt zwei Anläufen; zwei `title`-Texte (Zielblock, Balkenreihe), die den ausgeblendeten Inhalt tragen |
| `spiel/stil/fuhre.css` | 48 Schriftregeln auf `max(12px, …)`; die zwei Regeln mit N < 12 bleiben hier ohne Boden |
| `spiel/stil/fuhre-zusatz.css` | 52 Schriftregeln auf `max(12px, …)`; zwei neue Blöcke am Ende, beide hinter `@media (max-width: 2751px), (max-height: 1535px)` |

`spiel/stuecke/fuhre-daten.js` und `spiel/stuecke/fuhre-zusatz.js` sind
unverändert. `node --check` läuft auf allen drei `.js` sauber durch.

Aufnahmen und Messreihen:
`werkbank/schuss/fuhre-w6/{vorher,vorher-b,nachher,nachher-b}/E{1..4}-2752.png`.

---

*(Latte 2 wird durch `werkbank/schuss/aufsicht/messfenster.sh` wiederholt —
Belegzahlen folgen)*
