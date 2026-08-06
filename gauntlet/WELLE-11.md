# WELLE 11 — die Stücke räumen in ihre Grenzen

*Angesetzt am 6. August 2026, nachdem der Rahmen in Welle 10 den Flächenhaushalt
gebaut hat.*

## Die Lage in einer Tabelle

Gemessen mit `bild-w9/deckung.mjs` (Bildpunkte, nach Eigenschaft getrennt), von
der Aufsicht am eingefrorenen Stand `7896ee6` nachgeprüft:

| Zustand | Zielblatt | Welle 9 | **Welle 10** | Auflage A15 |
|---|---|---|---|---|
| Ladezustand gesamt | **3,1 %** | 22,0 – 22,8 % | 18,1 – 19,3 % | **< 8 %** |
| oberstes ⅙ | — | 50,6 – 53,1 % | 35,6 – 37,7 % | **< 25 %** |
| 30 Wochen, **ohne** Escape | — | 47,0 – 55,7 % | **44,8 – 53,3 %** | — |
| 30 Wochen **+ Escape** | — | Escape half nicht | 17,9 – 20,2 % | — |

Der Rahmen ist von 253.642 auf **95.690** Bildpunkte herunter und als einziges
Stück innerhalb seiner Grenze. **Die restlichen 1,19 Mio Bildpunkte gehören
euch.**

## Der Haushalt — er steht im Spiel, nicht in diesem Papier

```js
BRAUHAUS.haushalt.GRENZEN      // Obergrenze je Stück, gesamt und oberstes Sechstel
BRAUHAUS.haushalt.pruefe()     // wer hält sie ein, wer nicht — wie verdeckt()
BRAUHAUS.haushalt.tafeln()     // was gerade über 200.000 px² offen liegt
BRAUHAUS.haushalt.ueberRand()  // was über den Bildrand hängt
BRAUHAUS.haushalt.geklemmt()   // was die Blattaufsicht festhalten musste
```

| Stück | heute | Grenze gesamt | oberstes ⅙ |
|---|---|---|---|
| **DAS ERBE** | 239.643 | **28.000** | 6.000 |
| **DER GEGNER** | 214.788 | **28.000** | 8.000 |
| **DIE FUHRE** | 169.305 | **34.000** | 10.000 |
| DIE STADT | 166.263 | 40.000 | 26.000 |
| DER SUD | 98.202 | 34.000 | 6.000 |
| DER PREIS | 88.377 | 24.000 | 20.000 |
| DER NAME | 50.079 | 20.000 | 12.000 |

**Diese Welle nimmt sich die drei größten vor: DAS ERBE, DER GEGNER, DIE FUHRE.**
Zusammen 623.736 Bildpunkte, knapp die Hälfte des Überhangs. Die übrigen folgen.

## Wie in dieser Welle gerechnet wird — und was NICHT gemeint ist

**„Weniger anzeigen" ist keine Lösung.** Das steht seit Welle 8 fest und ist
teuer gelernt: ein Zähler, der Überlauf misst, misst nicht Vollständigkeit —
wer sauber kürzt, besteht ihn und zeigt trotzdem nicht alles. **Was heute am
Schirm steht, muss weiter erreichbar sein.** Gemeint ist: *anders* anzeigen —
zusammenklappen, hinter einen Reiter legen, in ein Blatt, das sich öffnet und
wieder schließt.

**Die vierte Latte bleibt, wo sie ist:** kein Text unter 12 px, kein aktiver
Knopf unter 24×24 px, bei 1366×768. Heute 14 Überläufe · 497 Textknoten · 0 von
307 Knöpfen. Wer Kästen kleiner macht, prüft das mit `aufsicht/lesbarkeit.mjs`.

## Je Stück, was der blinde Kritiker zusätzlich verlangt

**DAS ERBE** — Auflage 9 des Urteils: „Nachschrift · 2 Hä…" und
„Versorgungszusage · j…" tragen ein Auslassungszeichen, keinen Rollkasten.
Dazu die Auflage des Rahmens: **`erb-buch` hat null Elemente mit `data-zug`**,
also gar keinen eigenen Schließknopf; der einzige Griff ist ein fremder Reiter.
*Abnahme:* `haushalt.geklemmt()` bleibt nach Escape leer, und das Buch lässt
sich schließen, ohne ein anderes Stück anzufassen. Das untere Drittel des
Buches trägt nichts — es darf entsprechend kürzer sein.

**DER GEGNER** — Auflagen 3, 6 und 10 des Urteils: die Gegnerkarte darf **keine
gemalte Beschriftung anschneiden** (sie schneidet in 1884 „GASTHOF LINDENHOF"
oben ab); das Band „UMKÄMPFT …" gehört aus dem untersten Sechstel; und
`.gg-bandzeile .was` kürzt in 1970 **1810 px Text in einem 731 px breiten
Kasten** — 60 % des Satzes fehlen, ausgerechnet im Band OHNE DICH GESCHEHEN.
Dazu: `haushalt.ueberRand()` muss auch im **gebauten** Zustand leer bleiben
(`gegner .gg-ziel` hing dort).

**DIE FUHRE** — das ganzseitige Sommerblatt ist der Grund, warum der gespielte
Zustand nach 30 Wochen **45–53 %** deckt, solange niemand Escape drückt.
*Abnahme:* nach 30 × WEITER, **ohne** Escape, liegt in allen vier Epochen keine
Tafel über 200.000 px² mehr, und die Gesamtdeckung liegt unter **20 %**. Dazu
`stuecke/fuhre.js:3517`: `stopImmediatePropagation()` → `stopPropagation()`,
damit die Blattaufsicht des Rahmens Escape überhaupt sieht.

## Was nicht kaputtgehen darf

1. **Das Wellenziel der zweiten Latte.** |ρ| < 0,700 über alle drei Schnitte in
   allen vier Epochen (heute größter Wert 0,393) **und höchstens ein Braujahr
   von sechs unter 1×** (heute 2/0/1/1 von 14).
2. **`BRAUHAUS.stadt.rahmen.verdeckt()` bleibt 0.** In Welle 8 hat eine
   verschobene Lade 1350 in den Ruin geführt, weil sie einen fremden Knopf
   zudeckte, den die messende Hand nicht wegräumen konnte. **Ein Kasten, der
   einen fremden Zug deckt, ist kein Layoutfehler, sondern ein Spielfehler.**
3. **Dieselbe Saat, dieselbe Partie.** Miss **einzeln**, nie vier Epochen
   nebeneinander — `welle.sh` hat am 6. August bewiesen, dass gleichzeitige
   Läufe die Partie verändern können.
4. Gewichtsveto 8 MB je Epoche (heute 6,33/7,70/6,65/4,71).

## Messordnung dieser Welle — sie ist bewusst schlanker

**Je Epoche ein Lauf vorher und ein Lauf nachher genügt.** Die Dreifachprobe
macht die Aufsicht am Ende, an einem eingefrorenen Stand. Ihr messt einzeln
durch `aufsicht/messfenster.sh`, gegen den Vorzustand **`7896ee6`**.

Weil drei Stücke gleichzeitig arbeiten, gilt: **wer eine Zahl bewegt, meldet
es.** Die Zuordnung ist notfalls nachträglich herstellbar — die Dateimengen der
drei sind zusammenhanglos, und `aufsicht/welle8-trennprobe/aufsetzen.sh` zeigt,
wie man ein einzelnes Stück aus einem Stand herausnimmt (`.js` **und** `.css`,
das war der Fehler beim ersten Anlauf).

## Abnahme

`tor.mjs` · `spielprobe.mjs` · `lesbarkeit.mjs` bei 1366×768 ·
`bild-w9/deckung.mjs` im Ladezustand **und nach 30 Wochen ohne Escape** ·
`haushalt.pruefe()` · `verdeckt()` = 0 · ρ je Epoche. Danach ein **blinder
Kritiker** mit derselben Frage: **gewinnt das Zielbild noch?**
