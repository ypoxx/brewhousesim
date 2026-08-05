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

## 2. Messungen

(wird laufend nachgetragen)

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
