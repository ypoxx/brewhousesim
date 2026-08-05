# WELLE 7 — zwei Stücke, gemessen begründet

*Angesetzt am 5. August 2026, nachdem Welle 6 durch war: DIE FUHRE und DER SUD
gebaut, blind geprüft, nachgearbeitet, von der Aufsicht unabhängig nachgemessen.*

## Warum diese zwei

Zwei Latten sind offen, und beide haben einen benannten Eigentümer.

**LATTE 2 ist gerissen, seit die Zählweise verschärft wurde.** 1350 steht bei
zwölf Braujahren auf **+0,762**. Dreifach unabhängig bestätigt — blinder Kritiker
DIE FUHRE, blinder Kritiker DER SUD, und die Aufsicht mit je drei byteweise
identischen Läufen. Das ist **das Wellenziel**, und es ist seit dem 4. August
nicht erreicht.

**LATTE 4 ist gerissen und hat sich halbiert.** 1.899 → 1.128 → **772** zu kleine
Textknoten bei 1366×768, gemessen mit dem seit dem 5. August reparierten Gerät
(es zeichnet jetzt eine Rollleiste, wie sie jeder echte Browser hat). Zwei Stücke
haben ihre Schriftregeln erledigt und stehen auf **0**; fünf nicht:

| Stück | Textknoten < 12 px |
|---|---|
| **DIE STADT** | **172** |
| **DER GEGNER** | 172 |
| DER NAME | 135 |
| DAS ERBE | 132 |
| **DER PREIS** | 113 |
| (ohne Stück) | 44 |
| DER KLANG | 4 |

**DIE STADT trägt zusätzlich das Gewichtsveto**: `spiel/bild/` allein ist 27 MB,
die Sperrliste erlaubt 8 MB je Aufruf.

## Die zwei Aufträge

| Stück | Auftrag in einem Satz |
|---|---|
| **DER PREIS** | 1350 reißt die zweite Latte mit +0,762 bei zwölf Braujahren — und trägt dazu 113 zu kleine Textknoten. |
| **DIE STADT** | 172 zu kleine Textknoten und 27 MB Bilder gegen ein Veto von 8 MB. |

**Nur DER PREIS fasst die Wirtschaft an.** Das ist Absicht und folgt der Regel aus
Welle 4: *zwei Stücke, die dieselbe Kennzahl füttern, nicht gleichzeitig
nacharbeiten lassen* — sonst ist am Ende nicht feststellbar, wer die Zahl bewegt
hat. Genau dieser Fall ist in Welle 6 eingetreten und hat zwei Tabellenzeilen
unbrauchbar gemacht.

## Was beide wissen müssen, bevor sie anfangen

**Der Weg durch Latte 4 ist zweimal unabhängig gegangen worden**, von DIE FUHRE
und von DER SUD, und beide berichten dasselbe:

1. Alle eigenen `font-size`-Regeln auf `max(12px, calc(var(--s) * N))`.
2. Regeln mit **N < 12** gehören hinter `@media (max-width: 2751px),
   (max-height: 1535px)` — sonst bewegt sich Latte 1 auf der Entwurfsleinwand.
3. **Danach die überlaufenden Kästen aufräumen. Das ist die eigentliche Arbeit,
   nicht das Setzen des Bodens.** DIE FUHRE: der Boden allein hätte die Kästen
   von 97 auf 117 getrieben.
4. `-webkit-line-clamp` ist kein Schriftproblem, sondern verschwiegener Inhalt —
   DER SUD hat es durch `max-height` + `overflow-y: auto` ersetzt, in **Zeilen**
   gedeckelt, damit es mit dem Boden mitwächst.

**Der Knopfboden bewegt die Wirtschaft.** A/B der Aufsicht am selben Commit:
1970 steht **mit** Boden auf +0,699, **ohne** auf −0,112 — Unterschied 0,811, bei
null Fehlern in beiden Läufen. Die Messhand spielt bei 1920×1000, also unterhalb
der Entwurfsleinwand, wo der Boden greift; größere Knöpfe lassen die Bretter
umfließen, und damit ändert sich, welcher Zug der nächste sinnvolle ist. **Wer an
Größen dreht, dreht an ρ.** Vorher und nachher messen, beides berichten.

## Abnahme

Beide Stücke: `node werkbank/schuss/aufsicht/tor.mjs` (vier Epochen, `lage` 0,
keine Konsolenfehler) und `spielprobe.mjs`. Jede 400-Wochen-Messung durch
`werkbank/schuss/aufsicht/messfenster.sh`. Berichte laufend nach
`werkbank/urteile/` schreiben — der Container wird stündlich zurückgesetzt, und
nur Committetes überlebt.

Danach je ein **blinder Kritiker** gegen einen eingefrorenen Messstand.
