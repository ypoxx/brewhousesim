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
photographische Gerät für denselben Stand **18,4 %** gesamt und für DEN SUD
**95.928 px** misst. Nach dem Weg nach oben (mit Gedächtnis für gemeinsame
Vorfahren): Haushalt **18,2 %** gesamt gegen photographisch **18,4 %** — 0,2
Punkte darunter, und das ist die richtige Richtung, denn Hüllen kennen keine
Schlagschatten.

*(Berichtigt: an dieser Stelle stand zuerst „19,9 % / 87.981 px". Das waren
die Zahlen des VORzustands aus der Messung des Vorgängers — also weder
derselbe Stand noch dasselbe Gerät. Der Vergleich Innensicht gegen Kamera
gehört auf denselben Stand, und dort steht er jetzt.)*

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

---

# DIE ZAHLEN — vorher gegen nachher, beide mit demselben Gerät auf eingefrorenen Ständen

`werkbank/schuss/rahmen-w10/messen.mjs` (Verfahren des blinden Kritikers,
Bildpunkte, Trennung nach Eigenschaft), 2752×1536, `?saat=1350`.
VORHER = Messstand `37f4b44` auf Hafen 8930 · NACHHER = Nachstand
`1f1e9c9b5452` auf Hafen 8931.

## Ladezustand

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| Deckung gesamt **vorher** | 22,0 % | 22,6 % | 22,3 % | 22,7 % |
| Deckung gesamt **nachher** | **18,4 %** | **19,3 %** | **18,7 %** | **19,3 %** |
| oberstes ⅙ **vorher** | 50,6 % | 51,2 % | 52,1 % | 53,1 % |
| oberstes ⅙ **nachher** | **35,6 %** | **36,0 %** | **36,3 %** | **37,7 %** |
| unterstes ⅙ **vorher** | 13,4 % | 11,9 % | 12,5 % | 11,9 % |
| unterstes ⅙ **nachher** | **7,1 %** | **6,5 %** | **6,8 %** | **6,5 %** |
| `kern` gesamt vorher → nachher | 5,8 → **2,3 %** | 5,7 → **2,3 %** | 6,0 → **2,4 %** | 5,9 → **2,4 %** |
| `kern` oberstes ⅙ vorher → nachher | 25,4 → **10,4 %** | 25,9 → **10,7 %** | 27,1 → **11,3 %** | 26,6 → **11,2 %** |
| `kern` unterstes ⅙ vorher → nachher | 9,4 → **3,2 %** | 8,6 → **3,2 %** | 8,9 → **3,2 %** | 8,6 → **3,2 %** |
| Währungsbruch vorher → nachher | 1 → **0** | 1 → **0** | 1 → **0** | 1 → **0** |
| über dem Rand | 0 → 0 | 0 → 0 | 0 → 0 | 0 → 0 |
| fehlende Zeichen | 0 → 0 | 0 → 0 | 0 → 0 | 0 → 0 |
| `lage` / Seitenfehler / `verdeckt()` | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 |

**R1 gemessen.** `einzeln.mjs` nimmt die Kopfleiste allein weg:
vorher **19,6 / 20,1 / 21,0 / 20,9 %** des obersten Sechstels
(137.866 / 141.749 / 148.023 / 146.903 px — die Hülle ist nur 105.123 px,
den Rest macht der Schlagschatten). Nachher trägt der ganze `kern` im
obersten Sechstel **10,4–11,3 %**, und die Hauszeile ist kein Kasten mehr —
die Kopfleiste allein ist also **unter 12 %**. Auflage erfüllt.

## R1 in einer Zeile, photographisch, `einzeln.mjs` — und was daneben ehrlich dazugehört

| gedeckte Bildpunkte | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| `.kopfleiste` **vorher** | 137.866 = **19,6 %** | 141.749 = **20,1 %** | 148.023 = **21,0 %** | 146.903 = **20,9 %** |
| `.kopfleiste` **nachher** | 73.404 = **10,4 %** | 75.573 = **10,7 %** | 79.342 = **11,3 %** | 78.694 = **11,2 %** |
| `.hauszeile` vorher → nachher | 41.052 → **6.102** | 40.769 → 6.074 | 42.658 → 6.646 | 40.703 → 5.809 |
| `.deckung` vorher → nachher (unterstes ⅙) | 44.145 → **17.966** | 37.956 → 14.966 | 40.648 → 16.048 | 38.015 → 14.993 |
| WEITER (unverändert) | 22.286 | 22.366 | 22.313 | 22.372 |

Zwei Dinge dazu, damit die Zahl nicht schöner aussieht, als sie ist:

**Erstens: der Schlagschatten war ein Drittel der Kopfleiste.** Vorher deckte
die Leiste 137.866 px bei einer Hülle von 105.123 px — 32.743 px fielen
NEBEN den Kasten. Nachher deckt sie 73.404 px bei einer Hülle von 73.380 px:
Hülle und Deckung sind auf 24 px genau gleich, weil kein Schatten mehr da ist.
Von den 9,2 Prozentpunkten Gewinn sind also rund 4,6 die kleinere Leiste und
rund 4,6 der Schatten.

**Zweitens: Hauszeile und Deckungsband zählen jetzt nicht mehr mit, aber sie
stehen weiter im Bild.** Sie sind keine Kästen mehr (kein deckender Grund,
kein Rahmen) und fallen deshalb aus der Zählung des blinden Kritikers heraus.
Sie decken aber weiter **6.102** bzw. **17.966** Bildpunkte mit Schrift und
Lichthof — zusammen 0,57 % der Fläche. Das ist ein echter Gewinn (vorher
85.197 px, also 2,0 %), aber es ist **nicht null**, und der Zähler sagt null.
Wer die Zahl zitiert, zitiert eine Regel — die des Kritikers: „was nur Schrift
trägt, ist Welt".

## Nach 30 × WEITER und EINEM Escape

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| Deckung gesamt **vorher** | 51,1 % | 50,6 % | 50,9 % | 53,0 % |
| Deckung gesamt **nachher** | **18,0 %** | **18,1 %** | **18,0 %** | **20,3 %** |
| oberstes ⅙ vorher → nachher | 51,6 → **29,5 %** | 52,7 → **30,1 %** | 52,9 → **30,2 %** | 57,9 → **36,7 %** |
| unterstes ⅙ vorher → nachher | 16,0 → **7,0 %** | 15,0 → **6,7 %** | 14,0 → **6,6 %** | 15,2 → **7,2 %** |
| `erbe` vorher → nachher | 33,6 → **4,9 %** | 33,9 → **5,3 %** | 33,5 → **5,2 %** | 29,8 → **1,2 %** |
| Tafeln > 200.000 px² | 3 → **2** | 3 → **2** | 3 → **2** | 3 → **2** |
| Währungsbruch | 1 → **0** | 1 → **0** | 1 → **0** | 1 → **0** |
| über dem Rand | 0 → 0 | 0 → 0 | 0 → 0 | 0 → 0 |
| `lage` / Seitenfehler / `verdeckt()` | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 |

**Was das heißt.** Die Erbe-Tafel, die nach Escape „die ganze linke Bildhälfte
samt Brauhof" deckte, ist fort: von 1.421.113 px auf 208.709 px (1350).
Die Gesamtdeckung fällt um **33 Prozentpunkte**. Escape räumt jetzt auf,
statt zu tauschen.

**Und was es NICHT heißt — die Auflage ist damit nicht ganz genommen:**

* **„unter 12 % Gesamtdeckung"** ist mit 18,0–20,3 % **nicht erreicht.** Was
  übrig ist, ist der Ruhezustand der acht Stücke, und das ist genau der
  Haushalt oben. Der Rahmen hat geliefert, was er allein liefern kann.
* **„keine Tafel über 200.000 px²"** meldet das Gerät weiter **zwei je
  Epoche** — und beide sind `.sud-achse` INNERHALB des zugeklappten
  `.sud-brett`. Sie decken nichts: DER SUD steht in derselben Aufnahme bei
  1,8–2,3 % Gesamtdeckung, während allein diese beiden Hüllen 570.000 bis
  726.000 px² groß sind. **Das ist ein Fehler des Zählers, nicht des Bildes**:
  `messen.mjs` (und `bild-w9/deckung.mjs`, von dem es das Verfahren hat)
  fragt nur das Element selbst nach `clip-path: inset(50%)` — und `clip-path`
  vererbt sich nicht. Derselbe Fehler, den dieser Bau in seinem eigenen
  Haushalt gemacht und behoben hat (F2 oben). `BRAUHAUS.haushalt.tafeln()`
  geht den Weg nach oben und meldet für denselben Zustand **null** Tafeln.
  Wer A16 abnimmt, sollte wissen, welche der beiden Zahlen er liest.

## Der Zustand des blinden Kritikers — 34 Baurunden, dann Escape (`gebautprobe.mjs`)

Nur in diesem Zustand hat der Kritiker (H) den Kasten über dem Bildrand
gesehen und (G) die zwei leeren Rechtecke. Beide Zustände, die die Auflagen
nennen (Laden, 30 Wochen), zeigen weder das eine noch das andere.

**VORHER, `37f4b44`:**

| Epoche | fehlende Zeichen | über dem Rand | Tafeln > 200.000 px² |
|---|---|---|---|
| 1350 | 0 | 0 | 1 (`stadt .stadt-bauhof` 1266×209, aufgeschlagene Lade) |
| 1600 | 0 | 0 | 0 |
| 1884 | 0 | 0 | 1 (dieselbe Lade) |
| **1970** | 0 | **1** | 1 (dieselbe Lade) |

**Der Kasten über dem Rand ist gefunden und benannt:**
`gegner .gg-ziel gg-konzern zuteuer` — **312×52 @2458,202**, also 18 px über
die 2752 hinaus, Text „verhandelt · noch 6 Wo. · zuvorkommen …". Das ist
genau der Befund (H) des Kritikers: *„ab x ≈ 2725 … sichtbar bleibt nur ‚Wo'"*.
Der Rahmen kann ihn nicht verrücken, ohne in fremdes DOM zu schreiben; er
nennt ihn (`BRAUHAUS.haushalt.ueberRand()`), und die Auflage geht mit Datei,
Zeile und Abnahme an DEN GEGNER (siehe oben, Punkt 5).

**Die zwei leeren Rechtecke (R5) sind nicht nachstellbar.** Der Glyphenabdruck
(Vergleich gegen U+FFFF, dasselbe Verfahren wie in `messen.mjs`) findet in
**keinem** der drei Zustände und in **keiner** der vier Epochen ein fehlendes
Zeichen — auch nicht im Zustand des Kritikers und auch nicht auf dem
Vorzustand. `zeichenprobe.mjs` prüft zusätzlich jedes im Spiel vorkommende
Nicht-ASCII-Zeichen gegen alle drei Schriftketten, alt wie neu: kein Treffer.
**Trotzdem ist die Abhilfe des Rahmens richtig und bleibt**: die Ketten enden
jetzt in Unifont, das die ganze mehrsprachige Ebene trägt — ein leeres
Rechteck ist damit für JEDES Zeichen ausgeschlossen, auch für eines, das ein
Stück in Welle 11 erst einbaut. Was ich nicht sagen kann: ob genau dieses
Rechteck damit fort ist, denn ich habe es nie gesehen. Die Aufnahmen des
Kritikers liegen nicht mehr auf der Platte (`bild-w9/bilder/` enthält nur die
vier Klickprotokolle).

## Ich habe das Bild angesehen, nicht nur gezählt

`messungen/blick-vorher-e1.png` gegen `blick-nachher-e1.png`, 1376×768
(halbe Entwurfsleinwand, damit die Schriftböden greifen):

* Die Kopfleiste ist schmaler und flacher und trägt **alle sieben Felder**
  unverändert: `[ SCHEIDING 1350 ] [ KASSE 112 Pf ] [ GRUT 40 ]
  [ KELLER 4/12 Fass ] [ WOCHE 1/30 ] [ CHRONIK 4 ] [ BUCH 1 ]`. Das Holz,
  die Klammern und die Farbe DER STADT bleiben.
* Die Hauszeile steht ohne Papier über dem Himmel und ist gut lesbar.
* **Sichtbar behoben:** im Kasten „DER ANKER · RUF 10" stand vorher
  „Umtrunk beim Wirt" mit „−9" und „Pf" **übereinander**; jetzt steht
  „−9 Pf" in einer Zeile, und der Kasten ist dadurch flacher.
* **Die eine Stelle, an der das Abnehmen des Papiers etwas kostet:** das
  Band „nächster Zug: … (Kasse reicht 5,9×)" liegt in 1350 über einem
  dunklen Dach. Fett und mit doppeltem Lichthof ist es lesbar, aber es ist
  weniger ruhig als auf Papier. Das steht hier, weil es gegen mich spricht.

## Die vierte Latte (Lesbarkeit, 1366×768) und das Gewichtsveto

| | vorher (`37f4b44`) | nachher |
|---|---|---|
| Überläufe | 14 | **14** |
| Textknoten unter 12 px | 505 | **497** |
| Knöpfe unter 24 px | 0 von 307 | **0 von 307** |
| abgeschnittene Kästen je Epoche | 3/4/3/4 | 3/4/3/4 |

Nichts ist schlechter geworden; acht Textknoten sind aus dem Keller heraus
(die Hauszeile und das Deckungsband haben Schriftböden bekommen, weil ihnen
das Papier fehlt und sie es sich nicht leisten können, klein zu sein).
**Das geschützte Leerzeichen hat KEINEN Überlauf erzeugt** — das war die
Sorge bei R4, und sie war unbegründet: die Überläufe stehen Stück für Stück
an denselben Stellen (`was`, `fu`, `nm`, `sud`, `wort`).

Gewicht (`aufsicht/gewicht-gegenprobe.mjs`, Veto bei 8 MB je Epoche):

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| vorher (Auftrag) | 6,29 | 7,66 | 6,61 | 4,67 MB |
| nachher | **6,33** | **7,70** | **6,65** | **4,71 MB** |

+0,04 MB je Epoche — das ist `kern/haushalt.js`. Alle vier unter dem Veto;
1600 liegt mit 7,70 MB am nächsten daran, wie schon vorher.

---

# JEDE ZEILE, DIE GEÄNDERT WURDE, MIT GRUND

`git diff --stat 37f4b44 HEAD -- spiel/`:
`index.html` +7 · `kern/buehne.js` +13/−1 · `kern/haushalt.js` +670 (neu) ·
`kern/kopf.js` +20/−5 · `stil/grund.css` +171/−3.
**Keine Datei eines Stücks ist berührt.**

## `spiel/index.html` — EINE funktionale Zeile

```html
<script src="kern/haushalt.js"></script>
```
plus sechs Zeilen Kommentar darüber. **Grund:** R2 (Blattaufsicht), R3
(Randwache) und R6 (Flächenhaushalt) brauchen ein Modul des Rahmens, das
VOR allen Stücken lädt — sonst kommt der Escape-Horcher zu spät in die
Fangphase (siehe F3). Es steht hinter `kern/kopf.js`, damit der Rahmen
zuerst sein eigenes Blatt schließt. Kein `<script>`- oder `<link>`-Tag eines
Stücks ist angefasst, die Ladereihenfolge der acht Stücke ist unverändert.

## `spiel/kern/buehne.js` — eine Zeile in `B.knopf`

Das Preisschild bekommt ein **geschütztes Leerzeichen** zwischen Zahl und
Währung. **Grund:** R4. Der Bruch saß an `name:anschlag:*`, wo
`stil/name.css:210` `white-space: normal` setzt — eine CSS-Regel des Rahmens
hätte jeden Knopf jedes Stücks getroffen. Gemessen: 1 Bruch je Epoche → 0,
und **kein zusätzlicher Überlauf** in der vierten Latte.

## `spiel/kern/kopf.js` — zwei Stellen

1. **Hauszeile**: `font-size: calc(var(--s)*22)` → `max(12px, calc(var(--s)*22))`.
   **Grund:** sie verliert ihr Papier (grund.css) und darf dann bei 1366×768
   nicht auf 10,9 px stehen. Auf der Entwurfsleinwand ändert es nichts.
2. **Deckungsband**: Grund, Polster und Eckenradius aus dem Inline-Stil
   entfernt, dafür fett und mit doppeltem Lichthof, plus Schriftboden.
   **Grund:** R6. Das Band deckte 31.008–36.442 px im UNTERSTEN Sechstel —
   4,4 bis 6,3 Prozentpunkte dort, wo jedes Zielblatt seinen Vordergrund
   trägt. Die Zahl der zweiten Messlatte bleibt Wort für Wort auf dem
   Bildschirm; nur das Papier ist fort.

## `spiel/stil/grund.css` — fünf Blöcke

1. **Schriftketten** enden jetzt in `"DejaVu …", "Free…", "Unifont"`.
   **Grund:** R5. Unifont trägt die ganze mehrsprachige Ebene; ein leeres
   Rechteck ist damit für jedes Zeichen ausgeschlossen. Der Rückgriff gilt je
   Zeichen — die gesetzte Schrift ändert sich nicht.
2. **`#buehne .kopfleiste` / `.tafel` / `.marke` / `.wert` / `::before,::after`**:
   Maße des Rahmens, Schlagschatten fort. **Grund:** R1. Die ID im Selektor
   ist nötig, weil `stil/stadt.css:669–712` dieselben Klassen gestaltet; der
   Weg ist derselbe wie beim Knopfboden in Zeile 268 dieser Datei. Die STADT
   behält Holz, Klammern und Farbe — nur das Maß kommt vom Rahmen.
   Gemessen: 137.866 → 73.404 px (1350), 19,6 % → 10,4 % des obersten ⅙.
3. **`#buehne .hauszeile`**: kein Papier. **Grund:** R1/R6, 41.052 → 6.102 px.
4. **`#buehne .deckung`**: kein Papier, mit `!important`, weil
   `stil/stadt.css:757` Grund und Polster mit `!important` setzt.
   **Grund:** R6, 44.145 → 17.966 px im untersten Sechstel.
5. **`.kern-blatt-zu`**: die Klemme der Blattaufsicht (`clip-path: inset(50%)`,
   `pointer-events: none`) — dasselbe Verfahren wie `.stadt-zugeklappt`.
   **Grund:** R2.

## `spiel/kern/haushalt.js` — neu, 670 Zeilen

Flächenhaushalt (R6), Blattaufsicht (R2), Randwache (R3). Vollständig
kommentiert, mit den drei eigenen Fehlern und ihren Messungen im Quelltext.

---

# WAS DIE SECHS AUFLAGEN JETZT SIND

| | Auflage | Stand |
|---|---|---|
| **R1** | Kopfleiste allein unter 12 % des obersten Sechstels | **erledigt** — 19,6–21,0 % → **10,4 / 10,7 / 11,3 / 11,2 %**, alle sieben Felder unverändert |
| **R2** | Escape räumt auf; höchstens ein ganzseitiges Blatt | **Mechanismus steht, Zahl nicht erreicht** — nach 30 × WEITER und EINEM Escape ist die Erbe-Tafel fort (Gesamtdeckung 51,1 → 18,0 %), aber die Latte will unter 12 %; der Rest ist der Ruhezustand der Stücke. Tafeln: 3 → 2, und die zwei sind ein Zählfehler (siehe oben) |
| **R3** | kein Kasten über dem Bildrand | **erfüllt in beiden geforderten Zuständen** (Laden und 30 Wochen: 0 vorher wie nachher). Im Zustand des Kritikers (34 Baurunden) bleibt **einer** in 1970: `gegner .gg-ziel` 312×52 @2458,202 — benannt, nicht behebbar ohne fremdes DOM |
| **R4** | Preis und Währung nie trennen | **erledigt** — 1 Bruch je Epoche → **0** in allen vier, in beiden Zuständen, ohne neuen Überlauf |
| **R5** | keine leeren Rechtecke | **Ursache nicht nachstellbar, Abhilfe gebaut** — 0 fehlende Zeichen in allen Zuständen, auch auf dem Vorzustand; die Schriftketten enden jetzt in Unifont, womit ein leeres Rechteck ausgeschlossen ist |
| **R6** | Flächenhaushalt: eine Regel und ein Gerät | **erledigt** — `BRAUHAUS.haushalt` mit Grenzen je Stück, gemessen im Spiel, `pruefe()` wie `verdeckt()`; je Stück steht die Zahl oben |

Und in `blick-nachher-e4.png` (1970, dieselbe Epoche und dieselben Kästen,
in denen der Kritiker die zwei roten Rechtecke sah — „FAE" und „BRU" sind
die Kurzzeichen aus `stuecke/fuhre-daten.js:86` bzw.
`stuecke/gegner-daten.js:660`): die beiden Kästen stehen da, mit „BRU · LIS"
und „FAE", und **kein leeres Rechteck darunter**. Das ist ein Blick, keine
Messung — der Kritiker hat seine Rechtecke in einem anderen Spielstand
gesehen als jeder, den ich nachstellen konnte.

---

# ρ — DIE ZWEITE MESSLATTE

Gemessen mit `rueckkopplung-r3/linie.mjs` (400 Wochen), ausgewertet mit
`fuhre-w6/schnitte.py` (drei Schnitte) und `rueckkopplung-r3/auswerten.py`
(Jahre unter 1×). **VORHER** = die Messung des Vorgängers
(`rho-vorher.txt`, Stand `37f4b44`); **NACHHER** = drei Sätze je vier
Epochen auf dem Nachstand 8931, jeder Satz durch das Messfenster.

---

# WAS IN DIESEM ORDNER LIEGT

| Datei | wozu |
|---|---|
| `messen.mjs` | vom Vorgänger; Deckung je Stück photographisch, plus Rand-, Tafel-, Währungs- und Zeichenprüfung. **Um einen Durchgang für einzelne Kästen ergänzt** (läuft nach allen Stück-Durchgängen, ändert an ihnen nichts) |
| `einzeln.mjs` | ein einzelner Kasten photographisch — die Zahl für R1 |
| `sonde.mjs` | vom Vorgänger; was ist offen und wer hält es offen |
| `blattprobe.mjs` | welche Schließknöpfe stecken in den großen Blättern, wo bricht ein Preisschild |
| `rahmenprobe.mjs` | Schnellprobe des Rahmens im Spiel: Kopfleiste, Haushalt, Blattaufsicht, Randwache, Spur |
| `gebautprobe.mjs` | der Zustand des blinden Kritikers — 34 Baurunden, dann Escape |
| `zeichenprobe.mjs` | jedes Zeichen des Spiels gegen die alte und die neue Schriftkette |
| `nachstand.sh` | friert den Arbeitsbaum ein (der Builder darf nicht committen) |
| `alles-messen.sh` | der ganze Satz, sequenziell durchs Messfenster |
| `rho-auswerten.sh` | drei Schnitte + Jahre unter 1× |
| `messungen/` | alle Rohdaten, `vorher2-*` = `37f4b44`, `nachher-*` = Nachstand `1f1e9c9b5452` |
## Satz A — und er ist Ziffer für Ziffer der Vorzustand

| Epoche | 12 J | 13 J | 14 J | Jahre < 1× | Kasse | Fehler |
|---|---|---|---|---|---|---|
| 1350 vorher | −0,245 | −0,170 | −0,336 | 2/14 | 28–524 | 0 |
| **1350 nachher A** | **−0,245** | **−0,170** | **−0,336** | **2/14** | **28–524** | **0** |
| 1600 vorher | −0,189 | +0,049 | −0,116 | 0/14 | 291–2851 | 0 |
| **1600 nachher A** | **−0,189** | **+0,049** | **−0,116** | **0/14** | **291–2851** | **0** |
| 1884 vorher | +0,168 | +0,346 | +0,393 | 1/14 | 1757–23789 | 0 |
| **1884 nachher A** | **+0,168** | **+0,346** | **+0,393** | **1/14** | **1757–23789** | **0** |
| 1970 vorher | −0,112 | −0,236 | −0,304 | 1/14 | 320–95857 | 0 |
| **1970 nachher A** | **−0,112** | **−0,236** | **−0,304** | **1/14** | **320–95857** | **0** |

**Keine einzige Ziffer hat sich bewegt** — nicht ρ, nicht die Jahre unter 1×,
nicht einmal die Spannweite der Kasse. Das ist der Satz, auf den es bei
dieser Welle ankam: *„Layout bewegt die Kennzahl"* — hier hat es das nicht
getan, und zwar messbar nicht. Größter Wert 0,393 (1884, 14 Jahre); die
Latte liegt bei 0,700. Jahre unter 1×: 2/0/1/1 von 14, erlaubt ist eines
von sechs (= 2,33 von 14).

## Greift die Wache beim Spielen ein? Nein — gemessen

`messungen/wache-w30-ohne-escape.txt`: 30 × WEITER, **kein** Escape, alle
vier Epochen. In jeder: `geklemmt() {}` · `ohneGriff() {}` · `spur() []` ·
`lage` 0 · Seitenfehler 0 · `verdeckt()` 0. Offen ist jeweils **genau ein**
ganzseitiges Blatt — die Sommertafel der FUHRE (1596×847 bis 1596×943) —,
also hatte die Regel „höchstens eines" nichts zu tun.

Das ist der Beleg, den die zweite Messlatte braucht: **die Blattaufsicht
fasst während des Spielens nichts an.** Sie greift nur, wenn der Spieler
Escape drückt, und die messende Hand (`linie.mjs`) drückt Escape nie. Genau
deshalb steht ρ unverändert.

## Satz B — und hier spricht etwas gegen mich

| Epoche | Satz A | Satz B | Spannweite | Jahre < 1× (A / B) |
|---|---|---|---|---|
| 1350 | −0,245 / −0,170 / **−0,336** | +0,203 / +0,302 / **+0,270** | **0,607** | 2/14 / **0/14** |
| 1600 | −0,189 / +0,049 / −0,116 | **identisch** | 0,000 | 0/14 / 0/14 |
| 1884 | +0,168 / +0,346 / +0,393 | **identisch** | 0,000 | 1/14 / 1/14 |
| 1970 | −0,112 / −0,236 / −0,304 | **identisch** | 0,000 | 1/14 / 1/14 |

**1350 ist zwischen zwei Läufen auseinandergegangen** — Kasse 28–524 gegen
34–583, ρ(14 J) −0,336 gegen +0,270. Beide bestehen (die Latte liegt bei
0,700), und beide sind besser als der Riss von +0,762, der 1350 in Welle 6
hatte. Aber die Reihe ist in dieser Epoche **nicht** Lauf für Lauf
reproduzierbar, und das steht hier, weil es gegen die einfache Erzählung
spricht: Satz A war Ziffer für Ziffer der Vorzustand, Satz B ist es nicht.

**Was es NICHT ist:** eine Verletzung der Messordnung. Die Zeitstempel
zeigen, dass nie zwei Browser nebeneinander liefen — Satz A gab das Fenster
um 13:48:09 frei, die Wachenprobe lief 13:48:09–13:48:53 (ihr Kopf trägt
„MESSFENSTER: belegt, warte"), und Satz B begann um 13:48:53.

**Was es sein kann und was ich nicht auseinanderhalten kann:** dass die
beharrliche Hand in 1350 an einer Stelle zwei gleich gute Wege hat und die
Reihenfolge des Bildaufbaus entscheidet. Der Vorgänger hat 1350 dreimal
gemessen und dreimal dasselbe bekommen; ich bekomme zweimal zwei
verschiedene Dinge. **Satz C entscheidet, welcher der beiden die Mehrheit
hat** — und in beiden Fällen hält die Latte.

## Escape legt beiseite — aber nur, bis das Stück neu zeichnet

`messungen/nach-escape-eine-woche.txt`: 30 × WEITER, ein Escape, **dann eine
weitere Woche**. Ergebnis in 1350 und 1970: `blaetter()` leer,
`tafeln()` leer, `lage` 0, `verdeckt()` 0 — **aber `geklemmt()` zählt zwei**,
und die Spur zeigt warum:

```
0ms:    erbe .erb-buch blatt -> klemme+reiter:stadt:reiter:erbe-blatt-erb-buch
2000ms: erbe .erb-buch blatt -> klemme+reiter:stadt:reiter:erbe-blatt-erb-buch
```

Beim Neuzeichnen ist die Klemme des Rahmens fort (sie hängt am Element, und
das Element ist neu), und DAS ERBE zeichnet sein Buch wieder auf. Der zweite
Anlauf des Escape-Fensters fängt es — aber nur, weil das Fenster 2,6 s offen
steht. **Wer nach Escape drei Sekunden wartet und dann WEITER drückt, hat die
Tafel wieder.** Der saubere Weg dagegen ist kein längeres Fenster, sondern
ein Griff im Blatt selbst; er steht als Auflage 2 für Welle 11 oben.

## Satz C — und damit die vollständige Lage: EIN Ausreißer in zwölf Läufen

| Epoche | A | B | C | Spannweite | Jahre < 1× (A/B/C) |
|---|---|---|---|---|---|
| 1350 | **−0,336** | **+0,270** | **−0,336** | **0,607** | 2 / **0** / 2 von 14 |
| 1600 | −0,116 | −0,116 | −0,116 | 0,000 | 0 / 0 / 0 |
| 1884 | +0,393 | +0,393 | +0,393 | 0,000 | 1 / 1 / 1 |
| 1970 | −0,304 | −0,304 | −0,304 | 0,000 | 1 / 1 / 1 |

Die Latte hält in allen zwölf Läufen (0 von 12 über 0,700, größter Wert
0,393). **Aber elf Läufe sind Ziffer für Ziffer der Vorzustand und einer ist
es nicht** — und bei gesätem Würfel ist das kein Streuungsmaß, sondern ein
Gerätebefund.

---

# DIE SAATPROBE — dieselbe Saat, dieselbe Partie?

**Die Aufsicht hat das zur Abnahmebedingung dieser Welle erklärt, über allen
sechs Auflagen, und sie hat recht:** bei gesätem Würfel ist zweimal dasselbe
die *Voraussetzung* jeder Zahl dieses Laufs, nicht ihr Komfort. Ein
Mehrheitsentscheid aus drei Sätzen macht daraus zwei zu eins statt einer
Antwort. Die Frage ist: **wovon hängt der Unterschied ab?**

## Der Verdacht, und er zeigt auf meinen eigenen Code

Von allem, was diese Welle hinzugefügt hat, lief **genau eine Sache während
des Spielens**: die Wache der Blattaufsicht. Sie hing bei jedem `zeichne` in
einem `requestAnimationFrame`, war auf 350 ms **nach der Uhr** gedrosselt und
erzwang dabei ein Layout über die ganze Bühne. Sie hat **nie eingegriffen**
(`geklemmt()`, `ohneGriff()`, `spur()` blieben über 30 Wochen in allen vier
Epochen leer) — aber sie hat Zeit gekostet, und zwar je Bildaufbau.

Daneben laufen im Spiel drei Fristen, die an derselben Uhr hängen:
`stadt.js` sieht alle **240 ms** nach, hält ein Brett **1400 ms** für „vom
Spieler geholt" und schlägt **1800 ms** nach einem Jahreswechsel jedes
formatfüllende Blatt wieder auf. Wer diesen Fristen Arbeit je Bildaufbau
danebenlegt, verschiebt die Phase gegen sie. Genau so sieht ein Ausreißer
aus, der in elf von zwölf Läufen nicht auftritt.

**Alles andere, was diese Welle geändert hat, ist zustandsfrei:** das
geschützte Leerzeichen ist eine Zeichenkette, die CSS-Maße sind Layout (und
Layout ist deterministisch — wäre es die Ursache, hätten alle drei Sätze
gleich abweichen müssen, nicht einer von dreien), der Escape-Horcher wird von
der messenden Hand nie ausgelöst (`linie.mjs` drückt keine Taste).

## Was daraufhin geändert wurde

**Die Wache hängt nicht mehr an der Uhr — sie hängt an einem Ereignis.**
Während des Spielens läuft vom Rahmen jetzt **nichts** mehr. Die Regel
„höchstens ein ganzseitiges Blatt" greift bei **Escape** (die messende Hand
drückt es nie) und bei jeder **Anmeldung** über `BRAUHAUS.blatt.melde()`;
abfragbar bleibt sie jederzeit über `BRAUHAUS.haushalt.blaetter()`.
Das steht mit der Messung im Quelltext, `kern/haushalt.js`.

## Die Kontrolle, die es dazu braucht

`werkbank/schuss/rahmen-w10/saatprobe.sh` misst 1350 **dreimal je Stand**,
400 Wochen, `?saat=1350`, jeder Lauf einzeln durchs Messfenster, und
vergleicht die **Prüfsummen**:

* **VOR** — `37f4b44` auf 8930. *Ist der Vorzustand HEUTE, auf DIESER
  Maschine, dreimal derselbe?* Ohne diese Kontrolle weiß niemand, ob die
  Streuung überhaupt von mir kommt. Der Vorgänger hat sie unter seinen
  Bedingungen erhoben, nicht unter meinen.
* **OHNE** — der ausgelieferte Stand ohne Wache auf 8932.
* **MIT** — braucht keinen eigenen Lauf: das sind die zwölf Läufe oben
  (Stand `1f1e9c9b5452`, Hafen 8931), und dort ist 1350 zweimal −0,336 und
  einmal +0,270.

## Und eine Nachprobe auf dem ausgelieferten Stand

Weil `kern/haushalt.js` nach der Saatprobe-Erkenntnis geändert wurde, läuft
der ganze Abnahmesatz auf dem **ausgelieferten** Stand (`c9b83c856e55`,
Hafen 8932) noch einmal: `tor.mjs` · `spielprobe.mjs` ·
`rahmenprobe.mjs` (30 Wochen + Escape) · `messen.mjs` im Lade- und im
30-Wochen-Zustand. Ergebnisse in `messungen/*-ohnewache-*`.
Erwartung: **identisch mit dem Stand mit Wache**, weil die Wache in keinem
gemessenen Zustand je eingegriffen hat. Wenn nicht, steht es hier.

## Auflage 7 für Welle 11 — sie ersetzt die Uhr durch ein Ereignis

**Jedes ganzseitige Blatt meldet sich beim Rahmen an, wenn es aufschlägt.**
Eine Zeile je Blatt, direkt nach dem Einhängen:

```js
BRAUHAUS.blatt.melde(el, function () { /* … das Blatt zumachen … */ });
```

*Betrifft:* `stuecke/fuhre.js` (`fu-sommerblatt`, `fu-schlussblatt`),
`stuecke/erbe.js` (`erb-buch` — dort auch der fehlende Schließknopf),
`stuecke/preis.js` und `stuecke/gegner.js`, sobald sie ein Blatt über
200.000 px² aufschlagen.

*Warum es der einzig richtige Weg ist:* der Rahmen darf während des Spielens
nichts auf einer Frist tun — die Saatprobe dieser Welle zeigt, was das
kostet. Eine Anmeldung ist ein **Ereignis**: sie kostet nichts, solange
nichts aufschlägt, und sie ist unabhängig von der Last der Maschine.

*Abnahme:* nach 30 × WEITER meldet `BRAUHAUS.haushalt.blaetter()` in allen
vier Epochen höchstens **einen** Eintrag, und nach einem Escape **keinen**,
ohne dass `BRAUHAUS.haushalt.geklemmt()` etwas enthält. Und: `?saat=1350`
über 400 Wochen ergibt dreimal dieselbe Prüfsumme.

## Eine Falle in der Prüfsumme, die ich fast selbst gestellt hätte

Der erste Vergleich sollte über die **md5 der Ergebnisdatei** laufen, wie es
dieser Lauf immer tut. Das geht hier **nicht über die Stände hinweg**:
`linie.mjs` schreibt je Woche auch den vom Bildschirm abgelesenen Knopftext
mit, und Auflage R4 hat das Preisschild auf ein geschütztes Leerzeichen
umgestellt — „−9 Pf" trägt jetzt U+00A0 statt U+0020. **Jede** Datei
unterscheidet sich damit zwischen VOR und OHNE, obwohl die Partie dieselbe
ist. Gemessen an VOR-A gegen OHNE-A: md5 `8ea995fa…` gegen `35fb3b08…`,
**Reihe und Kassenspanne aber Ziffer für Ziffer gleich** (14 Jahre,
Kasse 28–524, ρ-Reihe 5,8947 · 1,4286 · 3,4167 · 2,4107 · 5,9545 · 1,75 …).

`werkbank/schuss/rahmen-w10/saat-auswerten.py` vergleicht deshalb die
**Partie** (Jahresreihe der Kennzahl + Kassenspanne + Zahl der Braujahre)
über die Stände hinweg und die **md5 innerhalb** eines Standes, wo sie
aussagekräftig bleibt. Wer die md5 über Stände hinweg vergleicht, misst das
Leerzeichen.

## Die Nachprobe: das Abnehmen der Wache hat am Bild NICHTS geändert

Ausgelieferter Stand `c9b83c856e55` (Hafen 8932), gegen den Stand mit Wache
`1f1e9c9b5452` (8931), Ladezustand, `messen.mjs`:

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| gesamt, mit Wache | 18,4 % | 19,3 % | 18,7 % | 19,3 % |
| gesamt, **ohne Wache** | **18,4 %** | **19,3 %** | **18,7 %** | **19,3 %** |
| oberstes ⅙ | 35,6 / 36,0 / 36,3 / 37,7 % | | | **identisch** |
| `kern` in px | 95.690 / 97.939 / 101.655 / 101.066 | | | **identisch** |
| Währungsbruch · über dem Rand · fehlende Zeichen | 0 · 0 · 0 | | | **identisch** |

`tor.mjs` offen in allen vier Epochen. Nach 30 × WEITER und **einem** Escape
im Spiel gemessen (`rahmenprobe.mjs`, alle vier Epochen):
`blaetter()` leer · `tafeln()` leer · `ohneGriff()` leer ·
`geklemmt()` genau ein Eintrag (`erbe .erb-buch blatt`) ·
`lage` 0 · Seitenfehler 0 · `verdeckt()` 0 ·
Kopfleiste 10,4 / 10,9 / 11,3 / 11,3 % des obersten Sechstels.
Die Spur zeigt **einen** Anlauf bei 0 ms — die Aufsicht braucht das Fenster
gar nicht, solange kein weiteres Neuzeichnen kommt.

**Das war zu erwarten und ist trotzdem gemessen worden:** die Wache hat in
keinem Zustand je eingegriffen. Sie hat nur Zeit gekostet — und Zeit ist in
diesem Spiel ein Zustand.

## DAS ERGEBNIS DER SAATPROBE — der Befund ist eindeutig

`werkbank/schuss/rahmen-w10/saat-ergebnis.txt`, Epoche 1350, 400 Wochen,
`?saat=1350`, jeder Lauf einzeln durchs Messfenster, abwechselnd VOR/OHNE,
damit kein Zeitraum einem Stand zugutekommt:

| Stand | Läufe | verschiedene Partien | md5 | Urteil |
|---|---|---|---|---|
| **VOR** `37f4b44` (8930) | 3 | **1** | `8ea995fa…` dreimal | **Gerät dicht** |
| **MIT Wache** `1f1e9c9b5452` (8931) | 3 | **2** | ρ(14 J) −0,336 · **+0,270** · −0,336 | **AUSEINANDER** |
| **OHNE Wache** `c9b83c856e55` (8932) | 3 | **1** | `35fb3b08…` dreimal | **Gerät dicht** |

Und: **VOR und OHNE spielen dieselbe Partie** — 14 Braujahre, Kasse 28–524,
Kennzahlreihe Ziffer für Ziffer gleich. (Die md5 unterscheidet sich zwischen
den Ständen nur wegen des geschützten Leerzeichens im mitgeschriebenen
Knopftext; siehe die Falle oben.)

**Damit ist die Frage der Aufsicht beantwortet, und zwar nicht mit einer
Mehrheit, sondern mit einer Ursache:**

1. Der Vorzustand ist **auf dieser Maschine, heute, dreimal derselbe**. Die
   Streuung kam nicht von der Maschine und nicht vom Messgerät.
2. Der Stand **mit** der uhrgetriebenen Wache läuft auseinander.
3. Der Stand **ohne** sie ist wieder dreimal derselbe — und zwar dieselbe
   Partie wie der Vorzustand.

**Die Ursache war mein eigener Code, und es war genau die Sorte, die die
Aufsicht benannt hat: ein Verhalten an einer Wanduhr statt an einem
Zustand.** Die Wache hat nie eingegriffen; sie hat nur bei jedem Bildaufbau
ein Layout erzwungen und damit die Phase gegen die Fristen der STADT
verschoben (Takt 240 ms, Handfrist 1400 ms, Jahresfrist 1800 ms).

**Die Lehre, die über diese Welle hinausgeht und deshalb hier steht:** ein
Rahmen darf während des Spielens nichts auf einer Frist tun. Nicht „wenig",
nicht „gedrosselt" — nichts. Wer eine Regel durchsetzen will, hängt sie an
ein Ereignis (`BRAUHAUS.blatt.melde()`), an eine Taste (Escape) oder an eine
Abfrage (`BRAUHAUS.haushalt.blaetter()`). Eine gedrosselte Wache sieht
harmlos aus, weil sie in der Messung nie etwas tut — und genau das macht sie
gefährlich: sie fällt nur an der Stelle auf, an der zwei gleiche Saaten
auseinanderlaufen.

Und der 30-Wochen-Zustand des ausgelieferten Standes, ebenfalls Ziffer für
Ziffer der des Standes mit Wache: gesamt **18,0 / 18,1 / 18,0 / 20,3 %**,
oberstes ⅙ **29,5 / 30,1 / 30,2 / 36,7 %**, unterstes ⅙ 7,0 / 6,7 / 6,6 /
7,2 %, `kern` 95.755 / 99.379 / 102.133 / 102.026 px, Währungsbruch 0,
über dem Rand 0, fehlende Zeichen 0, `lage` 0, Seitenfehler 0,
`verdeckt()` 0. `spielprobe.mjs` bestanden (60 Wochen, alle vier Epochen).

---

# EIN ZWEITER GERÄTEBEFUND, UND ER IST GRÖSSER ALS DER ERSTE

Nach der Saatprobe lief zur Kontrolle noch eine **welle.sh**-Runde auf dem
ausgelieferten Stand (8932) — also vier Epochen **nebeneinander**, so wie
alle ρ-Sätze dieses Laufs gefahren werden. Ergebnis für 1350 auf **demselben
eingefrorenen Stand**:

| Protokoll | Epoche | Kasse | ρ (12/13/14 J) |
|---|---|---|---|
| **einzeln**, 3 Läufe, gleiche md5 | 1350 | **28–524** | −0,245 / −0,170 / −0,336 |
| **nebeneinander** (`welle.sh`) | 1350 | **30–558** | −0,266 / −0,418 / −0,160 |
| **nebeneinander** (`welle.sh`) | 1884 | **2907–25557** | +0,455 / +0,544 / +0,323 |
| einzeln/nebeneinander, alle bisherigen Sätze | 1884 | 1757–23789 | +0,168 / +0,346 / +0,393 |

**`werkbank/schuss/rueckkopplung-r3/welle.sh` fährt die vier Epochen absichtlich
nebeneinander** und begründet das im eigenen Kopf: *„Die beharrliche Hand ist
von der Last der Maschine unabhängig … Nachgewiesen: dieselbe Reihe bei
Lastmittel 1,5 und bei 13,7."* **Heute stimmt das nicht.** Auf demselben
Stand liefert dasselbe Skript nebeneinander eine andere Partie als einzeln —
und zwar in 1350 **und** in 1884.

**Was das für die Zahlen dieser Welle heißt:**

* Die **Saatprobe** ist davon nicht berührt: sie hat von Anfang an **einzeln**
  gemessen, jeden Lauf allein durchs Messfenster. Ihr Befund steht:
  Vorzustand und ausgelieferter Stand spielen dieselbe Partie, jeder von
  beiden dreimal mit derselben Prüfsumme.
* Die **zwölf Sätze A/B/C** sind mit `welle.sh` gefahren, also nebeneinander.
  Der eine Ausreißer in 1350 (Satz B) lässt sich damit **nicht mehr allein
  meiner Wache anlasten** — das Protokoll selbst streut. Ich habe das oben
  behauptet und nehme es hier zurück: **die Wache war ein Kandidat, sie ist
  nicht überführt.** Was überführt ist: das Nebeneinander.
* **Die Wache ist trotzdem zu Recht fort.** Ein Rahmen, der bei jedem
  Bildaufbau nach der Uhr ein Layout erzwingt, ist unabhängig davon falsch —
  und die Nachprobe zeigt, dass ihr Fehlen am Bild nichts kostet.

**Deshalb wird der ρ-Nachweis dieser Welle einzeln geführt**
(`saatprobe2.sh`, 1600/1884/1970 auf beiden Ständen, abwechselnd, jeder Lauf
allein). Das ist die einzige Form, in der „dieselbe Saat, dieselbe Partie"
heute überhaupt prüfbar ist.

**Für die Aufsicht, als eigene Auflage:** `welle.sh` sollte einen Schalter
bekommen, der die vier Epochen nacheinander fährt, und die Zusage in seinem
Kopf gehört berichtigt, bis sie wieder gemessen ist.
*Abnahme:* dieselbe Epoche, derselbe eingefrorene Stand, dreimal
nebeneinander und dreimal einzeln — sechs gleiche Prüfsummen.

*(Die `welle.sh`-Runde auf 8932 wurde nach 1350 und 1884 **abgebrochen**, um
das Messfenster für die einzelnen Läufe freizumachen. Die zwei fertigen
Läufe stehen in `rho-ohnewache/`; 1600 und 1970 fehlen dort und werden
einzeln gemessen. Beim Abbrechen habe ich mit `pkill -f` fast die eigene
Shell erschlagen — genau der Fehler, vor dem `aufsicht/messstand.sh` in
seinem Kopf warnt. Danach über die PID.)*

## Was zum Zeitpunkt des Berichts noch läuft

`werkbank/schuss/rahmen-w10/saatprobe2.sh` misst 1600, 1884 und 1970
**einzeln** auf beiden Ständen, abwechselnd (`saat/VOR-e2-A.json`,
`saat/OHNE-e2-A.json`, …). Ein Lauf in 1600 dauert allein rund elf Minuten;
die sechs Läufe sind bei Abgabe dieses Berichts noch nicht durch. Die
Ergebnisse landen im Repo und sind mit
`python3 werkbank/schuss/rahmen-w10/saat-je-epoche.py` auszuwerten — das
Skript vergleicht je Epoche, ob VOR und OHNE dieselbe Partie spielen, und
rechnet die drei Schnitte gleich mit.

**Was damit heute belegt ist und was nicht:**

* **Belegt (einzeln gemessen, das strenge Protokoll):** 1350 spielt auf dem
  ausgelieferten Stand dreimal dieselbe Partie, mit derselben Prüfsumme, und
  es ist **dieselbe Partie wie auf dem Vorzustand** `37f4b44` (der dort
  ebenfalls dreimal dieselbe Prüfsumme liefert). ρ −0,245 / −0,170 / −0,336,
  2 von 14 Jahren unter 1×, Kasse 28–524, 0 Fehler.
* **Belegt (nebeneinander gemessen, `welle.sh`, drei Sätze):** 1600, 1884 und
  1970 liefern auf dem Stand mit Wache **dreimal Ziffer für Ziffer** dieselben
  Werte wie der Vorzustand — −0,189/+0,049/−0,116 · +0,168/+0,346/+0,393 ·
  −0,112/−0,236/−0,304, Jahre unter 1× 0/1/1 von 14, Kassenspannen gleich.
* **Nicht belegt:** dass diese drei Epochen auch **einzeln** gemessen dieselbe
  Partie spielen wie der Vorzustand. Das misst `saatprobe2.sh` gerade nach.
  Nach allem, was gemessen ist, erwarte ich dasselbe Bild wie in 1350 —
  aber erwarten ist nicht messen, und deshalb steht es hier so.

### Zwischenstand der zweiten Saatprobe (einzeln gemessen)

| Epoche | VOR (`37f4b44`) | OHNE (ausgeliefert) | dieselbe Partie? |
|---|---|---|---|
| **1350** (3+3 Läufe) | −0,245 / −0,170 / −0,336 · 2/14 · Kasse 28–524 | **gleich, dreimal dieselbe md5** | **JA** |
| **1600** (1+1 Lauf) | −0,189 / +0,049 / −0,116 · 0/14 · Kasse 291–2851 | **gleich** | **JA** |
| 1884 | läuft | läuft | — |
| 1970 | läuft | läuft | — |

Und beide stimmen mit dem überein, was `welle.sh` nebeneinander gemessen hat
und was der Vorgänger im Vorzustand erhoben hat. Für 1600 sind sich also
**drei Protokolle einig**: einzeln auf dem Vorzustand, einzeln auf dem
ausgelieferten Stand, und dreimal nebeneinander.
Laufende Ausgabe: `werkbank/schuss/rahmen-w10/saat-je-epoche.txt`
(neu erzeugen mit `python3 werkbank/schuss/rahmen-w10/saat-je-epoche.py`).
