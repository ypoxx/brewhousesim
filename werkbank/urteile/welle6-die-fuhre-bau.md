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

*(wird während der Arbeit fortgeschrieben)*
