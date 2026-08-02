# BEFUND — Die Wirtschaft, zum ersten Mal auf einem freien Bildschirm gemessen

Geschrieben am 2. August 2026, unmittelbar nach `BEFUND-BRETTER.md` und der Platzordnung.
Jener Befund endete mit dem Satz, die Eichung müsse neu gefahren werden, bevor jemand eine
Zahl an Preisen oder Löhnen verstellt. Das ist jetzt geschehen. Hier stehen die Zahlen und
die Diagnose; die Nacharbeit selbst ist **nicht** gemacht — warum, steht in §5.

**Wie gemessen wurde.** Playwright, Chromium, 1920 × 1000, `?epoche=1..4&saat=1350`, 160
Wochen je Epoche im sparsamen Stil (liefern, Rohstoff nachkaufen, nicht bauen). Vier Läufe,
**keine Seitenfehler, kein Abbruch**. Alle drei Prüfstände mussten dafür erst umgestellt
werden (§1). Werkzeuge: `werkbank/schuss/eichung/messe.mjs`, `wohin.mjs`, `bilanz` per Hand.

---

## 1 — Die Prüfstände messen jetzt einen bedienbaren Bildschirm

`messe.mjs`, `wohin.mjs` und `gegenprobe.mjs` riefen alle drei zu Beginn `klappeAuf()` und
klappten sämtliche Bretter auf. Seit die STADT eine Platzordnung hat, ist das nicht nur
nutzlos, sondern schädlich: jedes Aufschlagen klappt zu, was es zudecken würde, also endete
die Runde in einem zufälligen Stapel. An seine Stelle tritt in allen dreien dieselbe Regel,
die ein Mensch anwendet: **wer einen Zug nicht trifft, schlägt dessen Brett auf und greift
noch einmal zu.** `klappeAuf()` ist entkernt.

Damit misst die Eichung erstmals einen Betrieb, der einkaufen kann.

## 2 — Alle vier Epochen kippen, zwei nach unten, zwei nach oben

Die Kennzahl der zweiten Latte — Barschaft ÷ Preis des nächsten sinnvollen Zuges, am
Bildschirm abgelesen —, als Jahresmedian:

| Epoche | Jahresmediane (6 Braujahre) | Spearman | Jahre unter 1× |
|---|---|---|---|
| 1 · 1350 | 5,6 · 11,0 · 15,9 · 9,5 · 14,1 · 18,9 | **+0,714** | 0 von 6 |
| 2 · 1600 | 5,0 · 1,3 · 0,4 · 0,6 · 0,1 · 0,5 | **−0,714** | **4 von 6** |
| 3 · 1884 | 11,8 · 5,2 · 0,03 · 0,0 · 0,0 · 0,0 | **−0,771** | **4 von 6** |
| 4 · 1970 | 4,6 · 6,2 · 7,9 · 10,1 · 7,2 · 10,2 | **+0,829** | 0 von 6 |

Die Latte will eine Zahl, die interessant bleibt — mal knapp, mal luftig, nie beides für zehn
Jahre. **Keine der vier tut das, und keine ist unentschieden:** jede hat einen Trend über der
Grenze von 0,7. Zwei Häuser verarmen und bleiben arm, zwei werden reich und bleiben es.

Das ist ein anderes Bild als das der verklemmten Läufe — dort sah 1350 mit ρ = +0,115 noch
gesund aus. Der gesperrte Einkauf hatte den Aufwärtstrend maskiert.

## 3 — Woran 1884 stirbt: die Fuhre frisst den Rohertrag, die Feste erledigt den Rest

`wohin.mjs`, Epoche 3, erstes Braujahr. Einnahmen 14.860 M, Ausgaben 22.790 M,
**netto −7.930 M im ersten Jahr.**

| Posten | M | Art |
|---|---|---|
| Fuhrlohn Halber Wagen · 29 Fahrten | **6.235** | mit der Fahrt, nicht mit der Ladung |
| 16 × Ein Sud Lagerbier | 5.760 | mit der Menge |
| Löhne, Futter, Instandhaltung · 29 × | 3.190 | fest |
| Biersteuer nach Malzgewicht + Malzaufschlag | 2.465 | mit der Menge |
| Hopfen aus der Hallertau · 2 × | 2.300 | mit der Menge |
| Zins auf die Hypothek | 1.000 | fest |
| Gewerbesteuer · Kesselrevision · Sommerunterhalt | 1.550 | fest |

**Die feste Last beträgt 8.205 M im Jahr.** Der Rohertrag je Hektoliter ist dabei groß —
Lagerbier kostet 15 M und bringt 72 M —, aber er kommt nicht an: Von den 29 Fuhren gingen
Lieferungen an **zwei** Adressen (Gasthof Lindenhof, Bahnhofsgaststätte), zusammen 9.298 M.
Je Fahrt sind das rund 320 M Erlös gegen 215 M Fuhrlohn: **105 M Deckungsbeitrag je Fahrt,
3.045 M im Jahr, gegen 8.205 M feste Last.** Das Haus kann nicht gewinnen.

Dazu, aus der Mengenrechnung: **231 hl geliefert, 74 hl verdorben** — ein knappes Viertel der
Lieferung verdirbt im ersten Jahr, im zweiten noch 40 hl.

Im zweiten Braujahr bedient das Haus **sieben** Adressen statt zwei — und nimmt mit 11.961 M
**weniger** ein als im ersten. Dieselbe Fuhre, dünner verteilt, kostet dasselbe.

## 4 — Die Frachtwahl ist ein echter Hebel, aber nicht die Antwort

1884 kennt drei Frachtklassen, und das Datenblatt sagt selbst, worauf es hinausläuft
(*„Halb gefüllt ist er das teuerste Geschäft des Hauses"*):

| Klasse | Fass | Pauschale | je Fass | je km |
|---|---|---|---|---|
| Stückgut | 12 | 40 | 7 | 3 |
| **Halber Wagen** — die Vorgabe | 40 | 190 | 0 | 5 |
| Ganzer Wagen | 88 | 300 | 0 | 7 |

Der sparsame Stil wählt nie; er fährt das ganze Spiel im Halben Wagen. Gegenprobe, 110
Wochen, sonst identisch:

| Fracht | 1884 | 1885 | 1886 | 1887 |
|---|---|---|---|---|
| Vorgabe (Halber Wagen) | 14.250 → 5.333 | → 1.256 | → **0** | 0 |
| Stückgut | 14.250 → 8.260 | → 4.158 | → 453 | **0** |

Die richtige Wahl **verschiebt den Zusammenbruch um ein Jahr und verhindert ihn nicht.** Also
liegt es nicht am Spielstil: die Epoche ist defizitär gebaut.

## 5 — Warum hier Schluss ist, und was als Nächstes zu tun wäre

Ich habe die Nacharbeit **nicht** gemacht, und zwar aus einem Grund, der zum Verfahren
gehört: Die naheliegende Reparatur wäre, an den Tarifen der Fuhre oder an der festen Last zu
drehen. Beides sind Zahlen, die DIE FUHRE und der Kern gegeneinander geeicht haben; wer eine
davon anfasst, ohne die andere zu kennen, verschiebt nur, wo es klemmt — dieselbe Lehre wie
beim Verschieben des Sudbretts in `BEFUND-BRETTER.md` §5.

Was die Messung stattdessen ergibt, ist eine **Richtung**, und sie ist in allen vier Epochen
dieselbe: **Die Kosten hängen an der Fahrt und am Kalender, der Ertrag hängt an der Ladung.**
Wer wenig zu liefern hat, zahlt trotzdem voll. Deshalb verarmen 1600 und 1884, sobald die
Menge einmal einbricht, und deshalb laufen 1350 und 1970 davon, sobald sie einmal trägt: Es
gibt keine Rückkopplung vom Ergebnis auf die Schwierigkeit.

Drei Ansätze, in der Reihenfolge, in der ich sie prüfen würde:

1. **Der Fuhrlohn muss die halbleere Fahrt sichtbar machen.** Nicht billiger — sichtbar. Das
   Stück schreibt bereits „Kein Sud: kein Hopfen" an seine Tafel; es schreibt nichts, wenn
   190 M Pauschale acht Hektoliter durch die Gegend fahren. *„Ein Grund, den der Spieler
   nicht lesen kann, ist kein Grund"* steht als Kommentar im eigenen Quelltext.
2. **Der Gleisanschluss (6.300 M) ist die historische Antwort auf den Fuhrlohn von 1884** und
   steht als Angebot schon da. Damit er der Angelpunkt der Epoche wird, müssen die ersten
   zwei Jahre ihn erreichbar machen — heute verliert das Haus in Jahr eins mehr, als das
   Gleis kostet. Das ist der Fünfakter, den das Konzept ohnehin will: Mangel → Investition →
   Auszahlung.
3. **Die feste Last darf nicht in der Not gleich hoch bleiben.** Löhne, Zins, Steuern und
   Unterhalt summieren sich 1884 auf 8.205 M und rühren sich nicht, wenn der Betrieb
   schrumpft. Historisch stimmt das für den Zins und die Pacht, nicht für Löhne und
   Malzsteuer — die hängen an der Menge. Zwei der sieben Posten an die Menge zu binden, wäre
   der kleinste Eingriff mit der größten Wirkung auf beide Richtungen des Trends.

**Vor jedem dieser Schritte gilt weiter:** erst messen, dann drehen. Die vier JSON-Läufe
dieses Befunds liegen unter `werkbank/schuss/eichung/` und sind mit
`python3 auswerten.py sparsam` auszuwerten.
