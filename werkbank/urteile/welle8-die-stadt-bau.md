# Welle 8 — DIE STADT, Baubericht

*Laufend geschrieben. Stand des Baumes beim Start: `76f3ca4`.*

## Auftrag

- **Teil A** — die Reiterzeile deckt 47 % des untersten Sechstels bei 8 % der
  Gesamtfläche. Nicht weniger anzeigen, sondern woanders anzeigen. Die
  Welle-7-Arbeit (zehn Reiter mit Namen UND lebender Kennzahl, 0 abgeschnittene
  Kästen) darf nicht zurückgenommen werden.
- **Teil B** — der vordere Hof ist leer, auch voll ausgebaut, in allen vier
  Epochen; in dreien ist das Tor leer. Was fehlt, sind flache Dinge auf dem
  Hofboden, keine weiteren Bauten.

## Messstand

| | |
|---|---|
| Hafen | 8907 (Arbeitsbaum) |
| Vorher-Sicherung | `werkbank/schuss/stadt-w8/vor/` — die fünf STADT-Dateien im Stand `76f3ca4` |
| Geräte | `stadt-w8/deckkarte.mjs` (Pixeldeckung je Rasterzelle), `stadt-w8/freiflaeche.mjs` (Kastenhüllen), dazu die Geräte der Aufsicht |

---

## BEFUND 1 — die 47 % sind nicht die Reiterzeile, sie sind die ganze Werkbank

Die Aufsicht schreibt „DIE STADT deckt allein 47 % des untersten Sechstels …
Es ist ihre Reiterzeile". Nachgemessen mit `aufsicht/deckung-je-stueck.mjs`
und mit den Kastenmaßen aus dem DOM:

| | Maß auf 2752×1536 | Fläche | des untersten Sechstels |
|---|---|---|---|
| `.stadt-werkbank` gesamt | x 33 · y 1331 · **1723 × 194** | **7,85 %** | **47,1 %** |
| davon Reiterzeile | 1723 × 56 | 1,94 % | **11,6 %** |
| davon Bauhof-Lade | 1723 × 132 | 5,91 % | **35,5 %** |

*(Pixelvergleich je Kasten, `stadt-w8/deckkarte.mjs`, alle vier Epochen
gleich auf zwei Stellen. Ein erster Anlauf des Geräts lieferte für alle drei
Zeilen dieselbe Zahl: er schaltete die Kette nach oben sichtbar und damit die
Geschwister mit. Verzeichnet, damit es niemand wiederholt.)*

Die von `deckung-je-stueck.mjs` gemessenen 8,0 % / 47,1 % sind **Ziffer für
Ziffer die Werkbank** — DIE STADT deckt außerhalb dieses einen Kastens nichts
(die Ortsmarken sind 26×26 px). **Drei Viertel des Problems sind die
Bauhof-Lade, nicht die Reiterzeile.** Wer nur die Reiterzeile verschiebt,
kommt von 47,1 % auf 35,5 % und nicht auf 0.

Daraus folgt für Teil A: es muss die **ganze Werkbank** umziehen.

## BEFUND 2 — der Stand der Reiter war NICHT „alles steht"

Auf der Entwurfsleinwand 2752×1536 zeigen zwei der zehn Reiter als Namen nur
„…" (im Bildschirmfoto `stadt-w8/vor-e1.png` der dritte und der fünfte).
`setzeAufschrift()` (stadt.js:640) kürzt sauber statt abzuschneiden — die
vierte Latte zählt deshalb null Überläufe —, aber **auf dem Schirm steht
weniger als der volle Name.** Zehn Reiter brauchen rund 2.300 Bezugspixel und
haben in der Zeile 1.688.

Das ist die eigentliche Chance von Teil A: eine Werkbank, die **umbricht**,
hat mehr Zeilenlänge als eine, die in einer Zeile bleibt.

---

## Zahlen VORHER — `aufsicht/deckung-je-stueck.mjs`, Hafen 8907, 2752×1536

| Epoche | Oberfläche gesamt | unterstes Sechstel | DIE STADT gesamt | DIE STADT unten |
|---|---|---|---|---|
| 1350 | 27,8 % | 60,7 % | 8,0 % | **47,1 %** |
| 1600 | 28,2 % | 59,6 % | 8,0 % | **47,3 %** |
| 1884 | 27,1 % | 60,1 % | 8,0 % | **47,2 %** |
| 1970 | 27,7 % | 59,5 % | 8,0 % | **47,1 %** |

Roh: `werkbank/schuss/stadt-w8/deckung-vorher.txt`,
`werkbank/schuss/stadt-w8/deckkarte-vorher.json`.

*(wird fortgeschrieben)*
