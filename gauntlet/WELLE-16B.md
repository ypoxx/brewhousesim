# WELLE 16b — DER ANKER. Der Preis wächst schneller als die Kasse.

*Angesetzt am 9. August 2026, **bevor ein Builder etwas anfasst**, auf den
Zahlen der abgenommenen Welle 16.*

## Die Zahl, die diese Welle ansetzt

Der zweite Erlösweg wirkt. Die suchende Hand in 1350:

| | vorher | nachher |
|---|---|---|
| Kassenhöchststand | 126 | **1 212** |
| Deckungs-Median | 0,186 | **0,389** |

**Der Zähler ist um das Neunfache gewachsen, das Verhältnis nur um das
Doppelte.** Also ist der Nenner mitgewachsen: wer mehr verdient, steht vor
teureren nächsten Zügen. Die eingebaute Rückkopplung des Spiels arbeitet zum
ersten Mal auf der suchenden Linie — **und frisst den Erlös schneller auf, als
er entsteht.**

Damit ist genau die Arbeit fällig, die der Umsetzungsplan für W15 vorsah und
die ich mit dieser Begründung vertagt habe: *„Ein Anker unter einer Kasse, die
nie wächst, verschiebt nichts."* Die Kasse wächst jetzt.

## R16b — was hergestellt wird

**Der Preisanker folgt der gespielten Leistung, nicht der Fahrt und nicht dem
Kalender.** Das Muster steht im eigenen Haus: **1600 ist die einzige Epoche,
die Sorgfalt belohnt und Erfolg bestraft** — dort wachsen die Preise mit dem,
was das Haus tatsächlich leistet, und ρ bleibt trotzdem im Band. 1350 zieht
nach.

**Was ausdrücklich nicht gebaut wird:** Preise pauschal senken. Ein billigeres
Spiel ist kein besseres — die kundige Linie steht in derselben Epoche bei 1,09×
bis 7,43× und darf dort bleiben. Gesucht ist, dass der Nenner **dem Erlös
folgt**, statt ihm davonzulaufen.

## Das Maß — vordatiert, und an der Hand verankert, die es messen wird

| Maß | Schwelle | Vorher-Zahl (dieselbe Hand) |
|---|---|---|
| Deckungs-Median, **suchende** Linie 1350 | **≥ 1,0×** | **0,389** |
| Kassenhöchststand, suchende Linie | **≥ 800** (nicht fallen lassen) | 1 212 |
| Wiederholbarkeit | 3 Läufe, **eine Wochenreihe** | `488f7a96` |
| \|ρ\| kundige Linie, 12/13/14 J | **< 0,700**, alle vier Epochen | 1350 −0,389 · **1600 +0,538** · 1884 +0,411 · 1970 −0,304 |
| Jahre unter 1×, kundige Linie | höchstens 1 von 6 | |

Gemessen wird mit **`werkbank/schuss/welle16-kaeufer/hand.mjs`** — derselben
Hand, die die 0,389 erzeugt hat. **Nicht die Klickkette vergleichen, sondern
die Wochenreihe:** eine erkundende Hand tastet Bretter auf und zu, und diese
Klicks ändern den Spielzustand nicht.

> **1600 WIRD ZUERST GEMESSEN.** Es steht unverändert bei +0,538, Reserve
> **0,162**, und ein Preisanker greift genau dort an. Reißt es, gehört die
> Nacheichung in diese Welle, nicht in eine neue (Entscheidung F3).
> 1884 hat nach Welle 16 wieder 0,289 Reserve — mehr als vorher, aber immer
> noch die zweitknappste.

## Was nicht kaputtgehen darf

1. **Der zweite Erlösweg bleibt** (Welle 16): Kassenhöchststand der suchenden
   Linie ≥ 800.
2. **Die Wiederholbarkeit der kundigen Linie** — `bb96459e` in 1350.
3. **Der Spielstand** — Neuladen ziffernweise, 24 von 24 Feldern; der SUD
   hält 10 von 10.
4. **Die Kontrakttests** nicht schlechter als 14/16.
5. **Der Konzernvertrag bleibt erreichbar** (≥ 2 von 3, Welle 15).
6. **Die Anschlagtafel bleibt auffindbar** (Welle 15).
7. **Das Ende bleibt das beste Blatt**, die Deckungszeile die beste Zeile.
8. Keine Wanduhrfrist im Zeichenweg, kein `Math.random()`, `?neu=1` in jeder
   Messadresse, `lage` 0.

## Wie gemessen wird

**Jede Messung durch `werkbank/schuss/aufsicht/messfenster.sh`** — und danach
**mit `ps` nachsehen, ob wirklich nichts mehr läuft.** Das Werkzeug gibt seine
Sperre frei, wenn sein Wrapper stirbt, und lässt das Kind weiterlaufen; das ist
am 9. August zweimal passiert. **Eine freie Sperre ist kein Beweis für eine
freie Maschine.**
