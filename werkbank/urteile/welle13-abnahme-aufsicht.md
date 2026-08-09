# Die Abnahme der Welle 13 — das Urteil der Aufsicht

*8./9. August 2026. Alles am eingefrorenen Stand `b098fc6`, Hafen 8933.
Rohdaten: `schuss/aufsicht/welle13-gegen/`. Vorgaben: `gauntlet/WELLE-13.md`,
`gauntlet/WELLE-13-KRITIK.md`, `gauntlet/MESSLATTE.md`.*

---

## 1 · Die Voraussetzung: die Wiederholbarkeit steht

**Fünfzehn Läufe zu 400 Wochen, einzeln nacheinander, je Epoche genau eine
Prüfsumme.**

| Epoche | Läufe | Prüfsumme | ρ 12 / 13 / 14 Braujahre | Jahre < 1× | Festlegungen |
|---|---|---|---|---|---|
| 1350 | **6** | `bb96459e6ac5` | −0,259 / −0,236 / −0,389 | 0/14 | 1 |
| 1600 | 3 | `334efdb16e63` | +0,406 / +0,489 / **+0,538** | 1/14 | 1 |
| 1884 | 3 | `9e68e398d6f9` | +0,343 / +0,484 / +0,495 | 2/14 | 1 |
| 1970 | 3 | `174ab985e4e9` | −0,112 / −0,236 / −0,304 | 1/14 | **0** |

**0 von 15 Läufen über 0,700**, null Seitenfehler, kein Abbruch. Sechs in 1350,
weil dort die Abweichung schon einmal aufgetreten ist. **Latte 2 hält, und der
Spielstand des RAHMENS hat die Wiederholbarkeit nicht angefasst.**

**1884 ist gewandert** — von +0,161/+0,330/+0,169 auf +0,343/+0,484/+0,495, die
Jahre unter 1× von 0 auf 2. Weil dasselbe Gerät die anderen drei Epochen
ziffernweise unverändert wiedergibt, liegt das an der Welle, nicht am Gerät.
Beide Bedingungen halten, aber die Reserve ist von 0,531 auf **0,205**
geschrumpft. **Zwei Epochen haben jetzt halbe Reserve, nicht mehr eine:** 1600
(0,162) und 1884 (0,205).

---

## 2 · Was die Welle geliefert hat — nachgemessen, nicht geglaubt

| Auflage | Vorzustand | jetzt | Quelle |
|---|---|---|---|
| **A1 · Speichern und fortsetzen** | Neuladen setzt auf den Anfang zurück | **24 von 24 Feldern ziffernweise gleich**, alle vier Epochen | Aufsicht |
| **A2 · Zielsatz** | 0 Zielworte bei 613 Textzeilen | 4 / 10 / 6 / 7 Treffer; Zielzeile in jeder normalen Woche | Aufsicht + K2 |
| **A4 · der lügende Knopf** | 97 von 100 Wochen | **0 · 0 · 0 · 0** | Aufsicht |
| **A5 · die Tafel liegt auf** | 1 Angebot, nicht am Spielanfang | **5 Angebote**, 4 von 5 Jahresanfängen | Aufsicht |
| **A6 · tote Reiter** | 4 Klicks, nichts geschieht | Reiterform Woche 15 = Woche 45 | K4 |
| **A8/A9 · bezahlbarer Gegenzug** | **68 von 100** Wochen ohne | **0 / 0 / 1 / 0** von 100 | K4 |
| **Gegner bleibt Gegner** | 27 Züge in 50 Wochen | 7–10 greifbare Gegenzüge je Woche, „Ohne dich geschehen" 34 statt 27 | K4 |
| `BRAUHAUS.lage` · Seitenfehler | 0 · 0 | **0 · 0**, vier Epochen, beide Kritiker, nach 65 bzw. 100 echten Wochen | K2 + K4 |

Das ist eine gute Welle. Der Gegenzug von 68 auf 0 und der Spielstand von
„Falle" auf „ziffernweise" sind die zwei Zeilen, an denen sie gemessen werden
wollte, und sie hält sie beide.

---

## 3 · R13 — die Entscheidung der Aufsicht

**Die Auflage lautete: häufigster Knopf ≤ 35 %, drei häufigste zusammen ≤ 60 %,
gegen einen Vorzustand von 71 % / 78 %.**

### Was drei Geräte sagen — und warum nur eines zählt

| Gerät | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| `hand-w13.mjs` (Hand des Builders, „kein Reiterklick") | 32,5 % | 36,8 % | 26,8 % | 17,0 % |
| `hand3.mjs` (Hand des Spielkritikers der W12) | 34,6 % | 42,7 % | 39,1 % | 37,7 % |
| **K4, frisch gebaut, liest `BRAUHAUS.zuege()`** | **64,1 / 63,4 %** | **61,5 / 38,0 %** | **47,1 / 23,5 %** | **54,0 / 21,2 %** |

`hand3.mjs` **kann die Welle nicht messen**: sie greift nach fest eingebauten
Zugnamen, und in 3 879 Klicks fällt kein einziger auf `plan:*`. Ein
unverändertes Gerät misst unveränderte Verben. `hand-w13.mjs` ist die Hand
dessen, der die Knöpfe gebaut hat. **Bleibt K4**, der seine Hand aus dem nimmt,
was am Bildschirm steht.

### Das Urteil

> **R13 ist GERISSEN.** In 7 von 8 Messungen des einzigen tauglichen Geräts
> liegt der häufigste Knopf über 35 %; in 1350 liegt er in **beiden**
> Spielweisen über 60 % — höher als der Vorzustand für seinen häufigsten
> ausgewiesen hat.

Ich lese die Zahl nicht weich. Die Versuchung wäre da: der Builder hat gute
Zahlen, meine eigene Zwischenmessung war es beinahe auch, und eine dritte
Lesart hätte sich finden lassen. **Wer eine Lesart wählt, nachdem er die Zahlen
kennt, misst sich selbst.**

### Der Mechanismus dahinter — und warum er wichtiger ist als das Urteil

**Ein Klick auf den Fuhrplan schließt die Woche selbst.** Deshalb fällt
`weiter` auf 3–14 %, und deshalb spielt K4 hundert Wochen mit **131 Klicks**.
Wer nur einen Knopf je Woche drückt, drückt zwangsläufig überwiegend denselben.

**Die Krankheit ist nicht geheilt, sie ist umbenannt.** Der Vorwurf der
Spielprobe lautete: *der Spieler schaltet überwiegend nur weiter.* Vorher hieß
der Knopf `weiter` und `fuhre:abschicken`, jetzt heißt er `fuhre:plan:mager` —
und er schaltet weiter. In 1350 kommt die Not aus dem Material und nicht aus
dem Brett: DIE WOCHE hat selbst gemessen, dass dort in nur 3 von 100 Wochen
drei oder mehr verschiedene Ladungen zur Wahl stehen. *„Die Latte misst dort
die Fässer, nicht die Knöpfe"* — der Satz stimmt, und er ist der Grund, warum
diese Auflage nicht durch mehr Knöpfe zu erfüllen ist.

### Was ich daraus mache, und was ausdrücklich nicht

**Keine Nacharbeit an Welle 13.** Der Bau war richtig, die Auflage war es
nicht: sie zählt Klicks und meint Entscheidungen. Ein Maß, das sich dadurch
erfüllen lässt, dass man den Wochenschluss auf zwei Knöpfe verteilt, misst
nichts.

**Ab Welle 16 gilt stattdessen dieses Maß — datiert heute, gültig nach vorn,
nicht rückwirkend:**

> **Die Wahlquote.** In wie vielen von 100 Wochen nimmt der Spieler eine von
> **mindestens zwei einander ausschließenden Optionen mit Preisschild**, die
> beide **bezahlbar** sind? Ziel: **≥ 60 von 100 Wochen in jeder Epoche**,
> gemessen an der **suchenden** Linie.
>
> Dazu, unverändert als Deckel gegen Monotonie: **kein einzelner Knopf über
> 50 % der Klicks** — nicht 35 %, weil ein wochenschließender Knopf strukturell
> häufig ist, und das ist kein Mangel, sondern ein Bedienweg.

Die Ausgangszahl dafür steht bereits: Wochen mit zwei einander ausschließenden
Preisoptionen **70 / 92 / 81 / 56 von 100** (DIE WOCHE, vorher 0). Gemessen
wird künftig nicht, ob sie *dastehen*, sondern ob eine davon **genommen** wird.

---

## 4 · Die Auflagen, die offen bleiben

| # | Befund | wohin |
|---|---|---|
| **A1-neu** | Die Rückfrage-Box „Neue Partie beginnen?" deckt in 1350 einen greifbaren Knopf zu (`name:anschlag:umtrunk`) | W17 (Lesbarkeit/Fläche) |
| **A2-neu** | Zielzeile fehlt in der ersten Woche eines neuen Braujahrs in 5 von 20 Fällen (nur 1884/1970), bei fester Saat **nicht** reproduzierbar | W17 · **kein Determinismus-Problem**: 15 Läufe geben je Epoche eine Prüfsumme, es flackert die gezeichnete Zeile, nicht der Zustand |
| **A5-Rest** | Die Tafel liegt am **Spielanfang** nicht von selbst auf | W18 (Empfang) — dort gehört die Entscheidung hin, weil der Startanschlag dort steht |
| **K2-Fund** | Zugeklappte Bretter blockieren rund 40 % aller offenen Knöpfe | W18 · das ist derselbe Befund, den DIE WOCHE für die FUHRE gefunden hat, nur allgemein |
| **K4-Vorbehalt** | Text-Neuheit auf der Gegnerkarte 10/49 statt 23/25 — womöglich andere Messmethode | W20, mit einer Messmethode, auf die sich beide Seiten vorher einigen |
| **R13** | **gerissen**, ersetzt durch die Wahlquote ab W16 | siehe oben |

---

## 5 · Der Satz, mit dem diese Abnahme endet

Die Welle 13 wollte *„ein Spiel, das man spielen darf"*. Sie hat den Zugang
geöffnet — der Spielstand trägt, die Tafel liegt, der Gegenzug ist bezahlbar,
das Ziel steht auf dem ersten Schirm. **Was sie nicht geliefert hat, ist ein
Grund, mehr als einen Knopf je Woche zu drücken.**

Und daneben, aus derselben Messreihe, der Satz, der die nächste Phase trägt:
K4s erster naiver Durchlauf — ohne jede Aktion — **endete 1353 im Verlust des
Braurechts, bevor das Übergabeangebot je erschien.** Die Messhand spielt
dieselbe Epoche 400 Wochen lang, ohne je in Not zu geraten.

> **Die Wirtschaft ist nicht zu arm. Sie ist unverzeihlich.**

Das ist der Auftrag der Wellen 14 bis 16, und er steht mit vordatiertem Maß in
[`../../gauntlet/WELLE-14.md`](../../gauntlet/WELLE-14.md).
