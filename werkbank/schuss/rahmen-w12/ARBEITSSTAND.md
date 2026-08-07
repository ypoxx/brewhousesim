# Welle 12 — DER RAHMEN. Arbeitsstand (laufend geschrieben)

Auftrag: `gauntlet/WELLE-12.md`. R7 das Rennen finden und benennen, R8 abstellen
ohne fremde Stueckdatei, R9 ein Geraet, das die Frage in Minuten beantwortet.

## Erster Befund aus den Rohdaten — noch ohne eine Zeile Code

`werkbank/schuss/aufsicht/welle11-saat/rho/e1-{A,B,C}.json` und
`welle11-trennprobe/rho/*.json`, mit `python3` verglichen (nicht neu gemessen —
die Daten liegen im Repo).

**Die zwei Partien sind bis Woche 60 Ziffer fuer Ziffer gleich und gehen in
Woche 61 auseinander — das ist 1352, Woche 1 (Michaeli).**

| | n=60 (1352 W1) | n=61 (1352 W2) |
|---|---|---|
| A | Kasse 164, Deckung 3,4167 | Kasse **135** |
| B | Kasse 164, Deckung 3,4167 | Kasse **90** |

Und der Grund steht im selben Datensatz, in `jahre[]`:

| Jahr | A `kasseMichaeli` / Zeilen der LEITER | B |
|---|---|---|
| 1350 | 79 / 1 | 79 / 1 |
| 1351 | 60 / 2 | 60 / 2 |
| **1352** | **164 / 0** | **119 / 3** |

`linie.mjs:168` liest die LEITER aus `.pr-leiter .pr-leiter-zeile`. **Null
Zeilen heisst: die Michaelitafel DES PREISES stand in diesem Augenblick nicht
offen.** In A ist sie 1352 zu, in B ist sie auf; in B wird deshalb ein Angebot
fuer 45 Pf genommen, in A nicht. Von da an laufen die Partien auseinander.

Dieselbe Null steht in **beiden** Partien auch in anderen Jahren:

| Stand | Jahre mit leerer LEITER | Kasse | = welcher volle Lauf |
|---|---|---|---|
| ohneFuhre (Vorzustand) | 1357 | 28–524 | — |
| **ohneErbe** (GEGNER+FUHRE) | **1352, 1354, 1356** | **8–514** | **A und C** |
| **ohneGegner** (ERBE+FUHRE) | **1354, 1356, 1358** | **30–558** | **B** |

Damit ist die Zuordnung dicht: der volle Stand spielt in A/C exakt die Partie
`ohneErbe` und in B exakt die Partie `ohneGegner` — Kassenspanne, Schlussstand
und die Liste der leeren LEITER-Jahre stimmen jeweils vollstaendig ueberein.

**Die umkaempfte Stelle ist also nicht die Kennzahl, sondern EIN KLICK:
`preis:tafel` in Michaeli 1352.** Er landet mal und mal nicht.

## Was `linie.mjs` an dieser Stelle tut (Messgeraet, wird nicht angefasst)

```js
const griff = await lage('preis:tafel');
if (griff && !/schließen/.test(griff.text || '')) await klick('preis:tafel', 220);
```
`lage()` liest `getBoundingClientRect()`, `el.disabled`, `el.innerText` und
`document.elementFromPoint(cx, cy)` (Feld `hit`). `klick()` versucht bis zu
`BEHARR=6`-mal, dazwischen `ruhe(60)` = zwei Bildaufbauten plus eine Runde der
Aufgabenschlange. **Wer nach diesen zwei Bildaufbauten noch etwas fertigstellt,
entscheidet ueber `hit` — und damit ueber die Partie.**

Das ist genau die Sorte Rennen, die der Auftrag beschreibt. Was jetzt gemessen
wird: WER stellt nach dem Bildaufbau noch etwas fertig.
