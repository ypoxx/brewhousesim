# WELLE 15 — DER ERSTE PFENNIG. Wer sucht, soll nicht verhungern.

*Angesetzt am 9. August 2026 von der Aufsicht auf den Zahlen der Welle 14,
**bevor ein Builder etwas anfasst**. Das Maß steht unten, datiert, bevor es
jemanden treffen kann.*

## Die eine Zahl, die diese Welle ansetzt

Eine Hand, die ihre Knöpfe am Bildschirm sucht statt sie zu kennen, spielt
1350 so:

> **Kasse am Anfang 112. Höchststand über 421 Wochen: 112. Am Ende: 0.
> In 279 von 421 Wochen ist die Kasse leer.**
> Deckungs-Median **0,00**, sechs von acht Braujahren unter 1×.
> Dreimal gemessen, dieselbe Prüfsumme.

Dieselbe Epoche, von der kundigen Messhand gespielt: Kasse 60 bis 312,
Deckung 1,09× bis 7,43×, **kein einziges Jahr unter 1×**, 400 Wochen ohne
Ausgang. 1884 zeigt dasselbe Bild schwächer (0,15 gegen 5,43×), 1600 und 1970
halten auf beiden Linien.

**Wer suchen muss, verdient in 1350 keinen einzigen Pfennig.** Nicht wenig —
keinen. Das ist keine Balancefrage; das ist die Frage, ob es das Spiel für
jemanden gibt, der es nicht schon kann.

---

## Was diese Welle NICHT tut

**Sie koppelt keinen Preisanker.** Der Umsetzungsplan sah für W15 vor, 1350
und 1970 nach dem Muster von 1600 an die gespielte Leistung zu koppeln. Die
Messung sagt, dass das die falsche Schraube wäre: 1970 hält auf beiden Linien
(1,43), und in 1350 ist nicht der Preis zu hoch, sondern **der Erlös null**.
Ein Anker unter einer Kasse, die nie wächst, verschiebt nichts.

Die Preisarbeit wandert nach W16, wo sie mit dem zweiten Geldweg zusammen
gemessen wird. **1600 und 1884 werden in dieser Welle nicht angefasst** — sie
haben 0,162 und 0,205 ρ-Reserve, und wer sie ohne Not bewegt, riskiert die
Latte für nichts.

---

## Stück 1 · DER GRIFF — die teuerste Zeile des Spiels wird nie angefasst

*Dateien: `stuecke/preis*.js`, `stil/preis*.css`.*

Der Analyst hat den Konzernvertrag in 1970 isoliert gemessen: **er kostet
nichts, liegt einen Klick weit über der Faltkante, `hit:true`, `aus:false` in
allen sechs Braujahren — und bringt über sechs Braujahre 100 094 DM.** In drei
unabhängigen Läufen über 400 echte Wochen wurde er **kein einziges Mal**
genommen.

Der Grund ist keine Preisfrage und keine Sichtbarkeitsfrage. **Der Tafel-Griff
ist ein Auf-Zu-Schalter, den die Erkundung selbst wieder zuklappt**, bevor die
Kaufentscheidung an der Reihe ist: wer alle Knöpfe der Reihe nach anfasst,
öffnet die Tafel und schließt sie mit dem nächsten Griff.

**R15.1 — Ein Blatt, das etwas kostet, schließt sich nicht durch Danebengreifen.**
Solange auf der Michaelitafel eine ungenommene Festlegung liegt, darf ein
erneuter Klick auf den Griff sie nicht wegräumen. Wer sie schließen will, tut
es über einen eigenen, benannten Knopf — genauso, wie Welle 13 es für den
fremden Reiterklick entschieden hat.

**Abnahme (Zahl, nicht Meinung):** eine generische Hand, die alle greifbaren
Knöpfe der Reihe nach anfasst, nimmt den Konzernvertrag in 1970 in **mindestens
2 von 3 Läufen** innerhalb von sechs Braujahren. Heute: 0 von 3.

## Stück 2 · DER ERSTE PFENNIG — 1350 muss einen Erlös hergeben, den man findet

*Dateien: `stuecke/fuhre*.js`, `stil/fuhre*.css`.*

**R15.2 — Die suchende Linie verdient.** In 1350 muss eine Hand, die nur am
Bildschirm wählt, ihre Startkasse übertreffen. Nicht üppig — **einmal**.

**Abnahme:** Kassenhöchststand der suchenden Linie in 1350 **> 112** (heute:
genau 112, also nie), und **Wochen mit leerer Kasse < 40 %** (heute 66 %).
Gemessen über mindestens 200 Wochen, drei Läufe, eine Prüfsumme.

**Was der Builder dafür NICHT tun darf:** die Startkasse erhöhen, Preise
senken oder Erlöse verschenken. Der Weg ist, dass der vorhandene Erlösweg
**auffindbar** wird — die kundige Hand verdient in derselben Epoche das
Dreifache mit denselben Knöpfen. Die Frage ist nicht, ob Geld im Spiel ist,
sondern ob man es findet.

---

## Das Maß der ganzen Welle — vordatiert

| Maß | Schwelle | gemessen an |
|---|---|---|
| Konzernvertrag genommen (1970) | **≥ 2 von 3 Läufen** in 6 Braujahren | suchender Linie |
| Kassenhöchststand 1350 | **> 112** | suchender Linie |
| Wochen mit leerer Kasse 1350 | **< 40 %** | suchender Linie |
| Deckung Median, alle vier Epochen | **nicht schlechter als heute** (0,00 / 1,51 / 0,15 / 1,43) | suchender Linie |
| \|ρ\| über 12/13/14 Braujahre | **< 0,700**, alle vier Epochen | kundiger Linie |
| Wiederholbarkeit | 3 Läufe, 1 Prüfsumme (6 in 1350 und 1884) | beiden Linien |

**Reißt 1600 oder 1884, gehört die Nacheichung in diese Welle**, nicht in eine
neue. Beide haben halbe Reserve.

---

## Was nicht kaputtgehen darf

1. **Die Wiederholbarkeit** — `bb96459e` · `334efdb1` · `9e68e398` · `174ab985`
   (400 Wochen, kundige Linie). Sie ist die Voraussetzung aller anderen Zahlen.
2. **Der Spielstand** — Neuladen stimmt in 24 von 24 Feldern.
3. **Die vier Kontrakttests** (`aufsicht/kontrakte.mjs`) bleiben grün.
4. **Das Ende bleibt das beste Blatt des Spiels**, die Zeile *„nächster Zug …
   (Kasse reicht 5,9×)"* die beste Zeile.
5. **Der Gegner zieht weiter**, ohne dass ein Brett aufgeklappt werden muss:
   0/0/1/0 von 100 Wochen ohne bezahlbaren Gegenzug.
6. **Keine Wanduhrfrist im Zeichenweg**, kein `Math.random()`.
7. **`?neu=1` in jeder Messadresse**, `lage` 0, null Seitenfehler.
8. **Kein Verb verschwindet.**

## Wie gebaut und gemessen wird

**Nacheinander, nie gleichzeitig an derselben Kennzahl.** Erst DER GRIFF, dann
DER ERSTE PFENNIG; beide melden Ermessensfragen als Schwelle zurück an die
Aufsicht, statt sie selbst zu entscheiden.

Jede Messung einzeln durchs Messfenster
(`werkbank/schuss/aufsicht/messfenster.sh`). **Eine Zahl, die unter Nebenlast
entstand, ist keine Zahl** — das hat diesen Lauf am 9. August beinahe neun
unschuldige Bilder gekostet.
