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

## Gerätekontrolle, und sie ist besser ausgefallen als erhofft

Der Vorzustand `37f4b44`, neu gemessen mit dem **berichtigten** `messen.mjs`
(nicht-verändernde Maske), Ladezustand:

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| gesamt, neu gemessen | 22,0 % | 22,6 % | 22,3 % | 22,7 % |
| **blinder Kritiker, `bild-w9/deckung.mjs`** | **22,0 %** | **22,6 %** | **22,3 %** | **22,8 %** |
| oberstes ⅙, neu gemessen | 50,6 % | 51,2 % | 52,1 % | 53,1 % |
| **blinder Kritiker** | **50,6 %** | **51,2 %** | **52,1 %** | **53,1 %** |
| `kern` im obersten ⅙ | 25,4 % | 25,9 % | 27,1 % | 26,6 % |
| Auftrag: „Kopfleiste des Skeletts" | — | — | — | **26,0 %** |

**Zwei unabhängig gebaute Geräte, Ziffer für Ziffer dieselbe Zahl.** Damit ist
zugleich belegt, dass die Zahlen des Vorgängers (19,9–20,6 % gesamt,
44,4–46,6 % oben) durch den Maskenfehler nach UNTEN verzerrt waren — die
zu weit gewachsene Maske hat die Zonen-Nenner nicht verändert, aber die
Reihenfolge der Aufrufe hat den Zähler je Durchgang anders beschnitten.
**Für vorher/nachher wird ausschließlich der neu gemessene Satz benutzt.**

---

# R6 — DER FLÄCHENHAUSHALT: die Regel, das Gerät und die Zahlen für Welle 11

## Die Regel, in einem Satz

**Die Summe der Anteile ist immer größer oder gleich dem Ganzen** — Kästen
überlappen, und keine Überlappung macht die Summe kleiner. Wer also die
**Summe der Obergrenzen** unter die Latte legt, hat die Latte sicher genommen,
gleichgültig wie die acht Stücke sich überlagern.

* A15 verlangt **unter 8 %** im Ladezustand = **338.166 px** auf 2752×1536.
* A15 verlangt **unter 25 %** im obersten Sechstel = **176.128 px**.
* Der Rahmen bekommt, was das **Zielblatt** dem Rahmen gibt, und knapp
  darunter: Kopfleiste 1610×72 + WEITER-Tafel 262×62 = 132.164 px → **120.000**.
* Die übrigen 218.166 px teilen sich die acht Stücke.

## Die Tafel — `BRAUHAUS.haushalt.GRENZEN`

| Stück | gesamt (px) | oberstes ⅙ (px) | wofür |
|---|---|---|---|
| kern | 120.000 | 80.000 | Kopfleiste + WEITER, knapp unter dem Zielblatt |
| stadt | 40.000 | 26.000 | Reiterzeile + die vier gemalten Ortsschilder (≈28.000 px, vom Kritiker selbst als Welt herausgerechnet) |
| sud | 34.000 | 6.000 | ein Reiter, das Brett zugeklappt |
| fuhre | 34.000 | 10.000 | vier Reiter, die Hofanzeige |
| gegner | 28.000 | 8.000 | die Gegnerkarte |
| erbe | 28.000 | 6.000 | die Erbe-Leiste |
| preis | 24.000 | 20.000 | Michaelitafel + Chronikgriff |
| name | 20.000 | 12.000 | das Band |
| klang | 4.000 | 3.000 | der Notenknopf, 50×50 |
| **Summe** | **332.000 = 7,86 %** | **171.000 = 24,3 %** | Rest ist Vorrat |

## Das Gerät — im Spiel abfragbar, wie `verdeckt()`

```js
BRAUHAUS.haushalt.pruefe()     // [] heisst: alle im Rahmen
BRAUHAUS.haushalt.tafel()      // eine Zeile je Stueck, fuer die Konsole
BRAUHAUS.haushalt.miss()       // Zahlen je Stueck, gesamt und oberstes Sechstel
BRAUHAUS.haushalt.tafeln()     // jeder Kasten ueber 200.000 px^2  (A16)
BRAUHAUS.haushalt.ueberRand()  // was aus der Flaeche haengt        (A8)
BRAUHAUS.haushalt.blaetter()   // offene ganzseitige Blaetter       (A16)
BRAUHAUS.blatt.melde(el, fn)   // ein Stueck meldet seinen Schliessgriff an
```

**Was das Gerät kann und was nicht.** Es vereinigt Hüllen auf einem Raster von
4 px; der blinde Kritiker misst photographisch. Nachgerechnet im Ladezustand:
Rahmen-Hüllen 138.156 px gegen photographisch 138.084 px (0,05 % Unterschied),
Gesamtdeckung Hüllen 18,2 % gegen photographisch 19,9 % (nachher-Stand
gegen vorher-Stand allerdings — die Innensicht liegt strukturell etwas
niedriger, weil Hüllen keine Schlagschatten kennen). **Wer eine Zahl vor den
blinden Kritiker trägt, misst mit `werkbank/schuss/rahmen-w10/messen.mjs`.**

## Je Stück: die Zahl, die es einhalten muss — mit Datei und Abnahme

Gemessen am Vorzustand `37f4b44`, Ladezustand, `messen.mjs`, größter Wert der
vier Epochen. Die Abnahme läuft in allen Fällen über das Gerät im Spiel:
`BRAUHAUS.haushalt.miss().je.<stueck>` bzw. `BRAUHAUS.haushalt.pruefe()`.

| Stück | heute gesamt | Grenze | heute oben ⅙ | Grenze oben | Datei, an der es hängt |
|---|---|---|---|---|---|
| kern | 253.642 px (6,0 %) | **120.000** | 190.922 px (27,1 %) | **80.000** | erledigt in dieser Welle |
| erbe | 239.643 px (5,7 %) | **28.000** | 0 | 6.000 | `stil/erbe.css:43` `.erb-leiste` (1211×104) · `.erb-lade` (≈1090×175) |
| gegner | 214.788 px (5,1 %) | **28.000** | 0 | 8.000 | `stil/gegner.css:181` `.gg-schild`, `:225` `.gg-wimpel`, `:328` `.gg-band` |
| fuhre | 169.305 px (4,0 %) | **34.000** | 22.544 px (3,2 %) | 10.000 | `stil/fuhre.css:74` `.fu-brett` (vier Reiter tragen ihre Bretter) |
| stadt | 166.263 px (3,9 %) | **40.000** | 102.859 px (14,6 %) | 26.000 | `stil/stadt.css:294` `.stadt-werkbank`, `:313` Reiterzeile `max-width: 71.7%` |
| sud | 98.202 px (2,3 %) | **34.000** | 0 | 6.000 | `stil/sud.css:142` `.sud-achse` — **zwei Spalten je Epoche über 200.000 px²** |
| preis | 88.377 px (2,1 %) | **24.000** | 83.132 px (11,8 %) | 20.000 | `stil/preis.css:454` `.pr-griff` (`left: 85.6%`, `width: 13.3%`) |
| name | 50.079 px (1,2 %) | **20.000** | 9.159 px (1,3 %) | 12.000 | `stil/name.css:58` `.nm-band`, `:161` `.nm-satz` |
| klang | 1.420 px (0,03 %) | 4.000 | 1.409 px (0,2 %) | 3.000 | **im Rahmen** |

**Summe heute 1.282.119 px = 30,3 %** gegen **332.000 px = 7,86 %** Haushalt.
Das ist ein Schnitt von drei Vierteln, und er ist kein Rechenfehler: A15 will
8 % gegen heute 22 %, und die Summe der Anteile liegt schon deshalb über dem
Ganzen, weil die Kästen sich überlagern. **Was der Haushalt in einem Satz
sagt: bis auf den Rahmen zeigt im Ruhezustand kein Stück mehr als einen
Reiter.** Die STADT hat den Mechanismus dafür gebaut (Reiter + zugeklapptes
Brett, `stadt-zugeklappt`); die übrigen sieben müssen ihn benutzen.

## Was für Welle 11 zusätzlich benannt ist, mit Datei, Zeile und Abnahme

1. **DIE FUHRE — `stuecke/fuhre.js:3517` `tastenSperre`.**
   `stopImmediatePropagation()` in der Fangphase an `document` nimmt jedem
   späteren Horcher die Taste ab, auch dem Rahmen. Besser:
   `stopPropagation()`, oder den Horcher am eigenen Blatt führen.
   *Abnahme:* mit aufliegender Sommertafel schließt Escape sie **und** der
   Chronikgriff des Rahmens (`kern:chronik`) lässt sich weiter mit Escape
   schließen.

2. **DAS ERBE — `erb-buch` hat keinen Schließknopf.** `blattprobe.mjs`
   findet **null** Elemente mit `data-zug` darin; der einzige Griff ist der
   Reiter der STADT. Der Rahmen muss es deshalb klemmen.
   *Abnahme:* `BRAUHAUS.haushalt.geklemmt()` bleibt nach 30 × WEITER und
   einem Escape in allen vier Epochen **leer** — entweder durch einen
   Schließknopf im Blatt oder durch `BRAUHAUS.blatt.melde(el, fn)`.
   Dazu die Auflage A16 des Kritikers: das untere Drittel der Tafel ist leer,
   sie darf entsprechend kürzer sein.

3. **DER SUD — `stil/sud.css:142` `.sud-achse`.** Zwei Spalten je Epoche
   liegen über der A16-Schwelle: 340.112 und 329.115 px² (1350), 455.929 und
   269.975 (1600), 333.175 und 248.552 (1884), 321.808 und 296.505 (1970) —
   und zwar **im Ladezustand**, nicht erst im Spiel.
   *Abnahme:* `BRAUHAUS.haushalt.tafeln()` ist im Ladezustand aller vier
   Epochen leer.

4. **DER NAME — `stil/name.css:210` `.nm-knopf { white-space: normal }`.**
   Das ist die Stelle, an der der Währungsbruch entstand. Das geschützte
   Leerzeichen des Rahmens fängt ihn jetzt ab; die Zeile sollte trotzdem
   wissen, dass ihre Knöpfe umbrechen dürfen und ihre Preisschilder nicht.
   *Abnahme:* bleibt 0 Währungsbrüche, auch wenn ein Stück den Preis selbst
   setzt statt `BRAUHAUS.knopf` zu benutzen.

5. **DER GEGNER — `stil/gegner.css:225` `.gg-wimpel`.** Der Kasten mit rot
   gestricheltem Rand am rechten Bildrand, von dem der Kritiker nur „Wo"
   sah, ist die Wimpelzeile „wirbt · noch N Wo." (`stuecke/gegner.js:1979`).
   Sie hängt an einer Adresse und kann nicht ausweichen; also muss sie sich
   selbst am Rand halten.
   *Abnahme:* `BRAUHAUS.haushalt.ueberRand()` ist leer — im Lade-, im
   30-Wochen- **und** im gebauten Zustand aller vier Epochen.

6. **DIE STADT — `stil/stadt.css:313`.** Die Reiterzeile darf 71,7 % der
   Werkbankbreite. A12 des Kritikers verlangt einzeilig und unter 50 % der
   BILDbreite, auch nach 30 Wochen.
   *Abnahme:* `BRAUHAUS.haushalt.miss().je.stadt.obenPx <= 26000`.
