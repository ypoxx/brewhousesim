# WELLE 9 — DIE STADT, und diesmal steht eine Rückverschlechterung obenan

*Angesetzt am 6. August 2026, nachdem Welle 8 gemessen und blind geprüft war.*

## Was Welle 8 gebracht hat, damit es nicht zurückgenommen wird

Der Streifen ist frei, und das ist erkämpft: das unterste Sechstel des Bildes
war zu **59,5–60,7 %** von der Bedienoberfläche gedeckt und ist jetzt zu
**11,9–13,4 %** gedeckt; der Anteil der STADT dort fiel von **47 % auf 0**, das
Hausschild in 1350 von **66,9 % auf 0**. Von zwei Seiten unabhängig gemessen.
**Nichts davon darf zurück.**

## 1 · Der harte Befund: 1350 ist verarmt — und das ist eure Arbeit

Am eingefrorenen Stand `8b81250` gegen `b6b06bb` gemessen, gleiche Saat, gleiche
messende Hand:

| 1350 | vorher | nachher |
|---|---|---|
| **Wochen mit Kasse genau 0** | **0** von 400 | **70** von 400, über 8 Braujahre |
| Kasse min – max | 26 – 517 | **0 – 143** |
| Kennzahl wöchentlich, Median | 5,74 | **0,85** |
| **Braujahre unter 1×** | 1 von 14 | **3 von 14** — erlaubt sind zwei |
| Ziel gesetzt · Festlegung | 1× · 1× | 0× · 0× |

**Das Wellenziel ist damit gerissen**, und zwar an der Nebenbedingung, nicht an
ρ — ρ hat sich sogar „verbessert" (−0,380 → −0,007). **Weil der Spieler pleite
ist.** Eine flache Elendskurve hat keine Steigung. Wer diese Zahl allein liest,
hält den Rückschritt für Fortschritt.

**Es ist belegt, dass es DIE STADT ist, nicht DER PREIS.** Zwei Mischstände aus
committeten Dateien (`werkbank/schuss/aufsicht/welle8-trennprobe/`): mit eurer
Welle-8-Arbeit *heraus* steht die Kasse sofort wieder gesund (Median 5,79, null
pleite Wochen); mit der Nacharbeit von DER PREIS heraus ändert sich nichts.

**Zwei Erklärungen sind schon ausgeschlossen, damit ihr nicht dort sucht:**

1. **Nicht verdeckte Knöpfe.** Am Ladepunkt und nach neun gespielten Wochen sind
   beide Stände Zug für Zug gleich — dieselben 104 bzw. 109 Züge, dieselbe Zahl
   offener und verdeckter, dieselbe Kasse, und die Menge der klickbaren Züge ist
   **identisch**.
2. **Nicht die DOM-Reihenfolge.** Sie ist zwar verschieden, aber die vier
   Teilfolgen, an denen die messende Hand wörtlich hängt
   (`fuhre:tafel-auf:`, `fuhre:tafel-ab:`, `preis:festlege:`, `preis:nimm:`),
   stehen in derselben Reihenfolge.

**Was zu sehen ist:** Die Reihen laufen ab **Woche 2** auseinander (Kasse 80
gegen 62). Im alten Stand gibt die Hand ab **Woche 9** Fässer ab — 12 → 8 → 4 →
3 → 1 — und die Kasse steigt auf 232. Im neuen liegen die zwölf Fässer bis
**Woche 13**. **Der Absatz stockt, nicht der Zugriff.** Suchfenster: Woche 1
bis 9 in 1350.

Gerät: `werkbank/schuss/rueckkopplung-r3/linie.mjs 1 400 <datei>`, auswerten mit
`auswerten.py` und `fuhre-w6/schnitte.py`. **Die Mischstände stehen** —
`welle8-trennprobe/aufsetzen.sh` stellt sie mit einem Aufruf wieder her
(8911 ohnePreis, 8912 ohneStadt), und ein Lauf gegen 8912 zeigt euch euren
eigenen Vorzustand.

## 2 · Die erste Latte: das Zielbild gewinnt weiter, 3 : 0 bei einem Unentschieden

Das vollständige Urteil steht in `werkbank/urteile/welle8-bildvergleich.md` —
**lest es ganz**, es hat zu jeder Auflage Koordinaten im 2752×1536-Rahmen und
Ausschnitte in `werkbank/schuss/bild-w8/schnitte/`.

Sein Satz: *„Das Spiel hat das Zielbild beim Malen eingeholt und verliert es
unter seiner eigenen Oberfläche wieder."* Von 29,1–30,3 % Verdeckung sind
**29 % Bedienkästen und höchstens 0,7 % gemalte Welt** — sauber getrennt nach
Eigenschaften, nicht nach Ebenen, weil dieselbe Ebene den Gegnerhof *und* seine
Karteikarten trägt. Das Zielblatt kommt mit **unter 4 %** aus.

**Und der Fund, den die Aufsicht nicht hatte:** nach 30 gespielten Wochen deckt
die Oberfläche **54,7–58,5 %** des Rahmens, weil nach dem Jahreswechsel mehrere
Blätter hintereinander aufliegen — weggeklickt bleiben **51,0 %**.

**Euch gehören A1, A3, A4, A5, A6, A7, A8, A9.** A2 (schwebende Marken) und A10
(zwei Schnitte) gehören DEM GEGNER und kommen in Welle 10 — **fasst sie nicht
an.**

Die schwerste ist **A1: Deckung ≤ 15 % gesamt und ≤ 25 % im obersten Sechstel,
in allen vier Epochen, gleich nach dem Laden.** Der Kritiker nennt den billigsten
Weg selbst: acht Reiterkacheln plus `stadt:ortsmarken` liegen als geschlossener
brauner Block bei x 37…810, y 120…350, darunter die aufgeklappte BAUHOF-Lade bei
x 20…1300, y 355…560 — zusammen rund 0,44 Mio Bildpunkte, knapp das Dreifache
der **gesamten** Oberfläche eines Zielblatts.

**Und was in Welle 8 erkämpft wurde, bleibt:** 0 gekürzte Namen, 0 gekürzte
Kennzahlen (`stadt-w8/reiterprobe.mjs`). *Weniger anzeigen* ist keine Lösung,
*woanders anzeigen* schon.

## 3 · Was dabei nicht kaputtgehen darf

1. **ρ in allen vier Epochen und die Nebenbedingung.** Vorher und nachher, drei
   Läufe je Epoche, durch `werkbank/schuss/aufsicht/messfenster.sh`. Ziel:
   |ρ| < 0,700 über alle drei Schnitte **und höchstens ein Braujahr von sechs
   unter 1×**. Stand heute: 1350 **3/14 ✗**, 1600 1/14, 1884 **2/14** (Grenze),
   1970 0/14.
2. **Latte 4.** 14 Überläufe · 505 Textknoten · 0 von 329 Knöpfen.
   Und: **ein Zähler, der Überlauf misst, misst nicht Vollständigkeit** — wer
   sauber kürzt, besteht ihn und zeigt trotzdem nicht alles.
3. **Das Gewichtsveto.** Welle 8 hat 614 KB hinzugefügt, sauber nach Epochen
   getrennt (höchstens +214 KB in einer). 1600 liegt jetzt bei rund 7,61 von
   8 MB — **die Luft ist von 0,59 auf 0,39 MB geschrumpft.** Wer mehr braucht,
   meldet es als Befund; `bild/name/` und `bild/gegner/` liegen mit 1,17 MB
   unumgestellten fremden PNG da und gehören *nicht* euch.
4. **Was gegraben wird, bleibt** — Brunnen, Keller, Grube. Was gebaut wird, darf
   umziehen (`spiel/LIESMICH.md`). A6 lebt genau von diesem Satz.

## 4 · Abnahme

`tor.mjs` · `spielprobe.mjs` · `lesbarkeit.mjs` bei 1366×768 · Deckung vorher/
nachher **im Ladezustand und nach 30 gespielten Wochen** · ρ dreifach je Epoche
plus Jahre unter 1×. Danach wieder ein **blinder Kritiker** mit derselben Frage:
**gewinnt das Zielbild noch?**

**Meldet selbst, was ihr bewegt habt, auch wenn es gegen euch spricht.** Der
Builder der Welle 8 hat die Verschlechterung von 1600 von sich aus gemeldet und
zwei Fehler der Aufsicht gefunden — deshalb war sie in einer Stunde geklärt statt
in einer Welle.
