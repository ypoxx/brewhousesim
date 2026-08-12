# Welle 17 · DIE SICHT und TS1 · DER SUD — Abnahme der Aufsicht

*9. August 2026. Alle Zahlen von der Aufsicht selbst erhoben.*

## 1 · DIE SICHT — und warum die Zahl im Baubericht nicht die Zahl ist

Der Builder meldet **226 → 61 · 343 → 39 · 673 → 303**. Die Zahlen stimmen; ich
habe sie unabhängig reproduziert. **Sie taugen trotzdem nicht als Vorher/Nachher**,
und der Grund ist einer, den ich selbst verschuldet habe.

Der Builder hat **zwei Fehler in meinem Messgerät** gefunden und gemeldet:

- **`clip-path` war ihm unbekannt.** Ein zugeklapptes Brett trägt
  `clip-path: inset(50%)` — unsichtbar, aber im Baum und mit Fläche. Das Gerät
  hat seinen Text mitgezählt: von 1 635 „sichtbaren" Textknoten des
  Ausgangsstands waren **über tausend nirgends zu sehen**. `kern/haushalt.js`
  umgeht dieselbe Falle ausdrücklich; ich habe dort nicht nachgesehen, bevor
  ich maß.
- **`text-shadow` war ihm unbekannt.** Die Welle 11 hat für GEGNER und ERBE
  bewusst einen Lichthof aus Schatten statt eines Kastens gebaut, weil ein
  Kasten den Flächenhaushalt um das Sechs- bis Neunfache gesprengt hätte.
  Solcher Text ist lesbar und galt trotzdem als zu blass.

Beide Fehler wiesen **zu hoch** aus — das Gerät schlug Alarm, wo keiner nötig
war. Beide sind behoben.

**Und dann nicht der Fehler gemacht, den ich schon zweimal gemacht habe:** eine
alte Zahl gegen ein neues Gerät zu halten. Beide Stände mit **demselben
korrigierten Gerät** gemessen, bei 1366×768:

| | Vorzustand `0d6e0db` | mit der SICHT | |
|---|---|---|---|
| **verdeckt** | 48 | **20** | −58 % |
| **durchscheinend** | 78 | **23** | −71 % |
| **zu blass** | 178 | **96** | −46 % |
| sichtbare Textknoten | 532 | 480 | |

Weniger spektakulär als 226 → 61, und wahr. **ABGENOMMEN.**

**Was daneben unangetastet blieb** — und das ist bei Layoutarbeit die eigentliche
Leistung: **0 von 400 Wochen abweichend**, vier Epochen zu je 100 Wochen,
vorher gegen nachher. Der Builder hat nur `background-color`, `color` und
`visibility` angefasst, keine Geometrie. Der Knopfboden hat ρ einmal um 0,811
verschoben, ohne eine Zahl anzurühren; hier bewegt sich nichts. Dazu:
`lesbarkeit.mjs` unverändert, Tor 4/4, Kontrakte 14/16, Flächenhaushalt
zeichengleich.

## 2 · Was offen bleibt, und wem es gehört

Die verbliebenen **96 blassen Stellen** liegen fast vollständig **außerhalb
seines Dateibesitzes** — in `fuhre*`/`preis*` (dort bauen gerade zwei andere),
in `sud*` und in `kern/grund.css`. Er hat sie gemeldet statt sie anzufassen,
und eine davon ist eine Empfehlung an mich:

> **`kern/grund.css:266`, die `.knopf`-Basis, trägt denselben Fehler und
> vererbt ihn spielweit:** ein Farbverlauf ohne `background-color` darunter.
> Wer den Kern dort ergänzt, senkt die Zahl in allen Stücken auf einmal.

Das gehört der Aufsicht und ist als Ticket notiert — **aber erst, wenn die
Wirtschaft steht**: eine Kernänderung an der Knopfbasis bewegt jede Epoche
gleichzeitig, und zwei Builder messen gerade an derselben Kennzahl.

Zweiter Fund in fremdem Gebiet: eine **Ebenen-Kollision** zwischen dem
Hausschild der STADT und einer Ortsmarke des SUD (`bau` gegen `marken`,
`kern/buehne.js`). Notiert für die Welle 20.

## 3 · TS1 · DER SUD — 10 von 10, nachdem 11 von 22 gelogen hatten

Erster Anlauf: 22 Felder angemeldet, **17/22 · 11/22 · 11/22 · 11/22**. Der
Builder hatte sein Prüfskript geschrieben und **nicht ausgeführt**.

Die Ursache stand in den Rohdaten: in 1884 waren die Bottiche *vorher* leer und
*nach* dem Neuladen gefüllt — nach dem Laden war **mehr** da als vorher. Ein
Ladefehler nimmt weg; hier kam etwas hinzu. `setzeEpoche()` setzte die Felder
zurück, **nachdem** der geladene Stand eingesetzt war.

Zweiter Anlauf, nach der Vorgabe *„eine ehrliche Liste von achtzehn Feldern,
die alle halten, ist mehr wert als zweiundzwanzig, von denen elf lügen"*:

> **10 Felder, 10 von 10 gleich, in allen vier Epochen.**

Gesichert werden nur noch **Entscheidungen** — Verfahren, Festlegungen,
Gärraumkäufe, Freigaben, Abstufungen, Jahre ohne Sud. Nicht gesichert werden
Zähler und Chronik, die sich beim Spielen neu ergeben, und **`brettZu` ist
draußen**: ob ein Brett zugeklappt ist, ist ein Bedienzustand, kein Zustand des
Hauses. **ABGENOMMEN.**

## 4 · Der Satz, den diese Abnahme hinterlässt

Zwei Builder haben an einem Tag Fehler **in meinen eigenen Vorgaben und
Geräten** gefunden: eine Schwelle, die an einer fremden Hand hing, und ein
Messgerät, das zwei CSS-Techniken nicht kannte, mit denen dieses Spiel gebaut
ist.

> **Ein Messgerät, das die Technik nicht kennt, mit der gebaut wurde, misst den
> Bauplan und nicht das Bild.**

Wer Zahlen dieses Geräts von vor dem 9. August zitiert, nennt die zwei Fehler
dazu.
