# WELLE 14 — DIE MESSUNG. Warum zwei Leute dasselbe Spiel spielen und nur einer verhungert.

*Angesetzt am 8. August 2026 von der Aufsicht, **bevor ein Builder etwas
anfasst** und bevor eine Zahl dieser Welle vorliegt. Wer das Maß erst schreibt,
nachdem er das Ergebnis kennt, misst nicht — er begründet.*

Diese Welle **baut nichts**. Sie beantwortet die zwei Fragen, an denen die
Wellen 15 und 16 sonst raten müssten, und sie schreibt deren Abnahmeformeln
fest. Ein Analyst, Sonnet-Klasse, auf vorhandenen Daten plus gezielten
agentenlosen Läufen.

---

## Der Befund, der diese Welle nötig gemacht hat

Zwei Messungen derselben Epoche 1970, am selben Spiel:

| | die Messhand (`linie.mjs`) | der blinde Spielkritiker (Welle 12) |
|---|---|---|
| gespielte Wochen | **400**, kein Ausgang erreicht | **128**, dann war die Partie zu Ende |
| Deckung | 1,54× bis 3,94× | Median **0,08×** |
| Kasse nach 14 Braujahren | 50 000 | — |
| unwiderrufliche Festlegungen | **0** | 0 |

**Beide Zahlen sind richtig.** Die eine Hand stockt den Brauplan auf, tut alle
drei Wochen etwas gegen den Gegner und schickt jede Woche die Fuhre ab; sie
gerät nie in Not. Die andere sucht die Knöpfe erst — und ist nach dreieinhalb
Braujahren ruiniert.

> **Die Wirtschaft ist nicht zu arm. Sie ist unverzeihlich.**
> Wer die richtige Schleife kennt, hat immer genug. Wer sie nicht kennt,
> verliert, bevor er sie lernen kann. Das erklärt beide Zahlenreihen mit einer
> einzigen Ursache — und es heißt, dass „mehr Geld ins Spiel" die falsche
> Therapie wäre. Geheilt wird der **Abstand zwischen der kundigen und der
> unkundigen Linie**.

---

## Was der Analyst beantwortet

### Frage A — Wie lange trägt eine Partie? *(teilweise beantwortet)*

Für die Messhand steht die Antwort schon:
[`werkbank/urteile/w14-vorbefund-aus-der-abnahme.md`](../werkbank/urteile/w14-vorbefund-aus-der-abnahme.md)
— alle vier Epochen laufen 400 Wochen durch, kein Ausgang.

**Offen ist die andere Linie.** Der Analyst misst die **suchende Linie**: eine
Hand, die ihre Knöpfe aus dem nimmt, was am Bildschirm steht, statt aus einer
Liste, die sie vorher kennt. Je Epoche drei Läufe, gleiche Saat, Prüfsumme
mitschreiben.

**Zu liefern:** je Epoche Braujahre bis zum Ende, die **Verteilung der
Endgründe** (welcher Ausgang, wie oft), und die Woche, in der die Kasse zum
ersten Mal unter den Preis des nächsten umkämpften Zuges fällt und dort bleibt.

### Frage F — Warum werden Festlegungen nur 0–1× genommen?

`festGesetzt` = **1 / 1 / 1 / 0** in 400 Wochen. In 1970 legt eine Hand mit
50 000 in der Kasse in vierzehn Braujahren **nichts** fest. **Damit scheidet
„zu teuer" als alleinige Erklärung aus.** Drei Kandidaten bleiben, und der
Analyst trennt sie mit Zahlen, nicht mit Vermutung:

1. **Preislage** — was kostet die billigste Festlegung je Michaelitafel,
   gemessen gegen die Kasse in genau dieser Woche? (Je Epoche über alle
   Tafeln der Partie.)
2. **Sichtbarkeit** — wie viele Klicks/Reiterschritte liegen zwischen der
   Wochenansicht und der Tafel, auf der die Festlegung steht? Steht sie über
   oder unter der Faltkante?
3. **Nutzen** — was bringt eine genommene Festlegung über die Restpartie, in
   Münze? Wenn die Antwort „weniger als ihr Preis" lautet, ist die
   Nichtnahme **richtiges Spiel**, und die Auflage gehört umgeschrieben statt
   das Spiel.

**Der Analyst darf zu dem Schluss kommen, dass die Auflage falsch ist.** Das
wäre ein gutes Ergebnis, kein schlechtes.

---

## Das vordatierte Maß für die Wellen 15 und 16

Damit niemand später eine Lesart wählt, nachdem er die Zahlen kennt, steht die
Formel hier — **vor** der Messung:

> **ZWEI LINIEN, NICHT EINE.** Jede Deckungsschwelle der Wellen 15 und 16 wird
> an **beiden** Linien gemessen: der **sorgfältigen** (die kundige Messhand)
> und der **suchenden** (eine Hand, die die Knöpfe am Bildschirm findet). Die
> Latte gilt erst, wenn **beide** sie halten.
>
> Der Grund steht oben in der Tabelle: eine Deckungszahl, die nur an der
> Messhand erhoben ist, hat in 1970 dreieinhalb Braujahre lang nicht bemerkt,
> dass die Partie unspielbar ist.

Konkret, und ab W15 bindend:

| Maß | Schwelle | gemessen an |
|---|---|---|
| Deckung, Median über die Partie | **≥ 1,0×** | **beiden** Linien, je Epoche |
| Braujahre unter 1× | höchstens **1 von 6** | beiden Linien |
| \|ρ\| über 12/13/14 Braujahre | **< 0,700** | der sorgfältigen Linie (die Latte-2-Konvention bleibt) |
| Wiederholbarkeit | 3 Läufe, 1 Prüfsumme (6 in 1350) | beiden Linien |
| Verben je Epoche | **keines verschwindet** | Zählgerät |

**Reißt 1600, gehört die Nacheichung in dieselbe Welle**, nicht in eine neue —
Entscheidung F3 des Auftraggebers. 1600 steht bei ρ +0,538 (Reserve 0,162) und
**1884 seit dieser Abnahme bei +0,495 (Reserve 0,205)**. Zwei Epochen mit
halber Reserve, nicht mehr eine.

---

## Was nicht kaputtgehen darf

Diese Liste ist bindend; wer eine Zeile davon bewegt, meldet es, bevor er
weitermacht.

1. **Die Wiederholbarkeit.** Fünfzehn Läufe, je Epoche eine Prüfsumme
   (`bb96459e` · `334efdb1` · `9e68e398` · `174ab985`). Sie ist die
   Voraussetzung jeder anderen Zahl, keine eigene Latte.
2. **Der Spielstand.** Neuladen nach zwölf Wochen stimmt in 24 von 24 Feldern.
3. **Die ρ-Latte in allen vier Epochen**, alle drei Schnitte.
4. **Das Ende bleibt das beste Blatt des Spiels** (Urteil des Spielkritikers).
   Wer es anfasst, nimmt dem Spiel seinen besten Augenblick.
5. **Die Zeile „nächster Zug … (Kasse reicht 5,9×)"** — nach demselben Urteil
   die beste Zeile des Spiels.
6. **Der Gegner zieht weiter**, ohne dass ein Brett aufgeklappt werden muss.
7. **Keine Wanduhrfrist im Zeichenweg**, kein `Math.random()`, kein
   `Date.now()` in `kern/stand.js`.
8. **`?neu=1` in jeder Messadresse.**

---

## Wie gemessen wird

Agentenlos, nacheinander, an einem eingefrorenen Stand
(`werkbank/schuss/aufsicht/messstand.sh`). Der Analyst **liest Ergebnisdateien
und sitzt keinem Skript beim Laufen zu**. Er baut seine suchende Hand selbst
und **kopiert keine vorhandene**: `hand3.mjs` greift nach fest eingebauten
Zugnamen und ist für jedes Verb blind, das nach ihr erfunden wurde — in 3 879
Klicks fällt kein einziger auf die Wochenplan-Knöpfe der Welle 13. Wer sie
kopiert, erbt diese Blindheit.

**Abnahme dieser Welle:** ein Messblatt mit Zahlen je Epoche für A und F, und
die Feststellung, ob die Formel oben so bleiben kann oder ob die Zahlen sie
widerlegen. Erst danach beginnt Welle 15.
