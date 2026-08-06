# Welle 10 — DER RAHMEN. Arbeitsstand (laufend geschrieben)

Zweiter Anlauf. Der erste ist am 6.8. um 12:31 UTC an einem Container-Reset
gestorben; seine Messung (`rho-vorher.txt`, `messungen/vorher-*`) und seine
Geräte (`messen.mjs`, `sonde.mjs`) sind erhalten und werden benutzt, nicht
wiederholt.

## Was vor der ersten Zeile Code festgestellt wurde

**1 — `spiel/` ist zwischen `37f4b44` und `HEAD` (36c7739) byteweise gleich.**
`git diff --stat 37f4b44 HEAD -- spiel/` ist leer. Der Vorzustand des Auftrags
und der Arbeitsbaum waren beim Beginn dieselbe Fassung.

**2 — DIE STADT gestaltet die Kopfleiste des Rahmens mit.** `stil/stadt.css`
669–770 überschreibt `.kopfleiste`, `.kopfleiste .tafel`, `.marke`, `.wert`,
`::before/::after`, `.hauszeile`, `.knopf.gross[data-zug="weiter"]` und
`.deckung` (zweimal mit `!important`). Wer die Kopfleiste vom Rahmen aus
kleiner machen will, muss die Klassenregeln eines fremden Stücks überbieten.
Der Weg dafür steht schon in `grund.css` (Knopfboden, Zeile 268): **ID im
Selektor** — `#buehne .kopfleiste …`. Kein fremdes Stück wird angefasst.

**3 — Hülle ≈ gemessene Bildpunkte.** Kern, Ladezustand E1:
`.kopfleiste` 1569×67 = 105.123 px, `.hauszeile` 847×39 = 33.033 px,
zusammen 138.156 px. `messen.mjs` misst für `kern` im obersten Sechstel
19,6 % = 138.084 px. Abweichung 0,05 %. Daraus folgt: ein Haushalt, der
Hüllen vereinigt und rastert, ist eine brauchbare Innensicht des
photographischen Verfahrens.

**4 — Ein Fehler im geerbten Messgerät, der die VORHER-Koordinaten verdirbt
(nicht die Prozente).** `messen.mjs:maske()` hat in der Fassung, mit der
gemessen wurde, die Einträge der Kastenliste selbst verschoben (−30/+60 je
Aufruf, drei bis vier Aufrufe je Kasten). Belegbar in
`messungen/vorher-w30-esc1.json`: `erb-buch` steht dort mit `b=1396, h=1315`,
aber `flaeche=1242732` — und 1156×1075 = 1.242.700. Die wahre Hülle ist
1156×1075, `x/y/b/h` sind um 120 px je Seite aufgeblasen.
*Folgen:* `flaeche`, `raus` und alle Prozentzahlen sind vor der Verschiebung
berechnet und gültig; `x/y/b/h` in den `vorher-*`-Dateien sind es nicht.
Die Fassung auf der Platte ist bereits berichtigt (sie baut `q` neu).
**Deshalb wird der Vorzustand mit dem berichtigten Gerät neu gemessen** —
auf dem eingefrorenen Messstand `37f4b44`, nicht im Arbeitsbaum.

**5 — Escape TAUSCHT nicht, Escape ÖFFNET.** Mit `sonde.mjs` nachgestellt
(30× WEITER, Hafen 8920):
* ohne Escape: genau **ein** Blatt über 200.000 px² offen —
  `fuhre .fu-sommerblatt` 1596×847 (E1) / 1596×943 (E4). `erb-buch` ist **zu**.
* nach **einem** Escape: `fu-sommerblatt` ist fort, und `erb-buch`
  1156×1075 @55,207 ist **auf**.
Damit ist der Zweifel (6) des blinden Kritikers entschieden: die Erbe-Tafel
lag nicht darunter, sie geht auf, wenn die obere geschlossen wird. Der
Rahmen der STADT klappt sie auf, sobald der Deckel darüber fällt.

**6 — Die Erbe-Tafel hat keinen eigenen Schließknopf.** `blattprobe.mjs`:
`erb-buch` enthält **null** Elemente mit `data-zug`. Der einzige Griff ist
der Reiter der STADT, `stadt:reiter:erbe-blatt-erb-buch`. Eine Blattaufsicht
des Rahmens muss deshalb eine Kette haben und darf sich nicht auf einen
Schließknopf verlassen.

**7 — Der Währungsbruch (R4) sitzt in `name:anschlag:*`.** `blattprobe.mjs`
meldet je Epoche genau einen: E1 „−45 Pf" an `name:anschlag:zunftzeichen`,
E4 „−1.800 DM" an `name:anschlag:bierdeckel`. Das Preisschild hat dort
`white-space: normal` — sowohl am `.preis` als auch am `<button>`. Eine
CSS-Regel des Rahmens könnte das überbieten; **das geschützte Leerzeichen im
Preisschild selbst** (`B.knopf`, `kern/buehne.js`) wirkt unabhängig davon und
ist deshalb der Weg. Das Schild kommt aus `BRAUHAUS.knopf` und gehört dem
Rahmen — kein fremdes Stück wird angefasst.

**8 — Schriften im Behälter.** 59 Familien, darunter DejaVu (Serif/Sans/Mono),
Liberation, FreeSerif/FreeSans/FreeMono, **Unifont** (deckt die ganze BMP).
Die Schriftketten in `grund.css` enden heute bei `serif` / `sans-serif` /
`monospace`. `fc-list :charset=…` zeigt: **U+25B8 ▸, U+25BE ▾ (name.js) und
U+2726 ✦ (stadt.css) fehlen in Liberation**, auf das „Times New Roman"
abgebildet wird. Das ist der Kandidat für die zwei leeren Rechtecke (R5); die
Abhilfe des Rahmens ist ein Netz am Ende jeder Kette.

## Was geändert wird, und warum

| Datei | Änderung | Auflage |
|---|---|---|
| `stil/grund.css` | Schriftketten mit Unicode-Netz | R5 |
| `stil/grund.css` | `#buehne .kopfleiste …` — Maße des Rahmens, Schlagschatten weg | R1 |
| `stil/grund.css` | `#buehne .hauszeile` — Papier weg, Text mit Lichthof | R1/R6 |
| `stil/grund.css` | `#buehne .deckung` — Papier weg | R6 |
| `stil/grund.css` | `.kern-blatt-zu` — Klemme der Blattaufsicht | R2 |
| `kern/buehne.js` | Preisschild mit geschütztem Leerzeichen | R4 |
| `kern/kopf.js` | Schriftboden der Hauszeile, Deckungsband ohne Papier | R1/R6 |
| `kern/haushalt.js` (neu) | Flächenhaushalt + Blattaufsicht + Randwache | R2/R3/R6 |
| `index.html` | **eine** `<script>`-Zeile für `kern/haushalt.js` | R2/R3/R6 |

---

# Was gebaut wurde, und was beim Bauen gemessen wurde

## Drei Fehler des eigenen Baus, gefunden und behoben — sie stehen hier, weil sie die teuersten Stellen sind

**F1 — Die Blattaufsicht hat dem Spieler die Bedienung abgeräumt.**
Erste Fassung: „ganzseitiges Blatt" = jeder Kasten über 200.000 px². Gemessen
im **Ladezustand** (`rahmenprobe.mjs`, E1 und E4) hat sie daraufhin **vier
`.sud-achse`** — die Entscheidungsspalten DES SUD, 677×503 px — und ein
`.pr-feld` DES PREISES weggeklemmt. `BRAUHAUS.lage` blieb leer, `verdeckt()`
blieb 0; der Schaden war **nur im Bild** zu sehen. Ein Blatt ist jetzt, was
die Rahmenklasse `blatt` trägt (`fu-sommerblatt` und `erb-buch` tragen sie
beide) — Bretter bleiben unberührt und stehen nur in der Liste
`haushalt.tafeln()`.

**F2 — Der Haushalt hat um das Zweieinhalbfache danebengelegen, weil
`clip-path` sich nicht vererbt.** Erste Fassung fragte nur das Element
selbst nach `clip-path: inset(50%)`. Für jedes **Kind** eines zugeklappten
Bretts meldet `getComputedStyle` aber brav `none`. Ergebnis im Ladezustand
E1: Haushalt **54,4 %** gesamt und **1.442.176 px** für DEN SUD, während das
photographische Gerät **19,9 %** und **87.981 px** misst. Nach dem Weg nach
oben (mit Gedächtnis für gemeinsame Vorfahren): **18,2 %** gesamt — 1,7
Punkte unter dem photographischen Wert, und das ist die richtige Richtung,
denn Hüllen kennen keine Schlagschatten.

**F3 — Escape kam beim Rahmen nie an.** Erste Fassung: gewöhnlicher Horcher
in der Blasenphase. `spur()` und `geklemmt()` blieben leer, das Erbe-Buch
stand nach Escape unverändert da. Grund: `stuecke/fuhre.js:3517`
(`tastenSperre`) hängt in der **Fangphase** an `document` und ruft
`stopImmediatePropagation()`, solange ihre Tafel obenauf liegt — das nimmt
jedem späteren Horcher die Taste ab, auch dem des Rahmens in `kern/kopf.js`.
Der Rahmen hängt jetzt selbst in der Fangphase und ist dort der erste, weil
`kern/haushalt.js` vor jedem Stück geladen wird. Er hält die Taste nicht auf.

## Ein vierter Befund, der kein Fehler von mir ist, sondern der Grund für R2

`stadt.js:1408` — *„Ein formatfüllendes Blatt zum Jahreswechsel ist eine
Entscheidung"*: `if (jetzt - jahrZeit < 1800 && anteil > 0.25) lage[s] = 'auf'`.
Der Abnahmefall der Auflage A16 fällt genau damit zusammen: der dreißigste
WEITER schließt das Braujahr, Escape kommt Sekundenbruchteile später, und
während der ganzen Aufräumzeit schlägt die STADT das Erbe-Buch (28 % der
Fläche) wieder auf. Der Reiterklick des Rahmens war **erfolgreich und
wirkungslos**. Deshalb legt Escape zuerst die Klemme an (wirkt im selben
Bildaufbau) und sucht **danach** den Griff des Stücks; und deshalb fasst er
über 2,6 s nach, was JAHRESFRIST (1800 ms) und HANDFRIST (1400 ms) überspannt.

## Gemessen am Arbeitsbaum, 2752×1536, Hüllen (Innensicht des Haushalts)

| | E1 laden | E4 laden | E1 w30+esc1 | E4 w30+esc1 |
|---|---|---|---|---|
| `.kopfleiste` | 1223×60 = 73.390 px = **10,4 %** des obersten ⅙ | 1311×60 = 78.672 = **11,2 %** | 73.463 = 10,4 % | 79.637 = 11,3 % |
| `.hauszeile` | kein Kasten mehr | kein Kasten mehr | — | — |
| `.deckung` | kein Kasten mehr | kein Kasten mehr | — | — |
| `[data-zug=weiter]` | 257×75 = 19.134 px | dito | dito | dito |
| Tafeln > 200.000 px² | **0** | **0** | **0** | **0** |
| über dem Rand | **0** | **0** | **0** | **0** |
| Währungsbruch | **0** | **0** | **0** | **0** |
| `lage` / Seitenfehler / `verdeckt()` | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 |

Vorher (Gerät des Vorgängers, dieselbe Fläche): `.kopfleiste` 1569×67 =
105.123 px und `.hauszeile` 847×39 = 33.033 px, zusammen 19,6 % des obersten
Sechstels; `.deckung` 959×38 = 36.442 px im untersten Sechstel; nach 30
Wochen + einem Escape **drei** Tafeln über 200.000 px².
