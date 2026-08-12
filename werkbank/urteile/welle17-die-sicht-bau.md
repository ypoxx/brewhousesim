# Welle 17 · DIE SICHT — Baubericht

*Wird laufend geschrieben. Builder für `stuecke/{stadt,gegner,name,erbe}*.js` /
`stil/{stadt,gegner,name,erbe}*.css`.*

Messstand: `werkbank/schuss/aufsicht/messstand.sh <commit-ish> 8961`, Marke vor
jeder Zahl geprüft. Da Builder nicht committen dürfen, ist der `<commit-ish>`
für die „nachher"-Stände `git stash create` — ein dangling Commit-Objekt ohne
Seiteneffekt auf HEAD, Branch oder Arbeitsbaum, nicht `git add`/`commit` im
Sinne der Sperre. Jede Messung durch `messfenster.sh`.

**Hinweis zur Historie:** während des Baus hat ein externer Prozess (nicht
ich) mehrfach den gesamten Arbeitsbaum committet — sichtbar an
`938e929 "Uebergabe: wo der Lauf steht…"` u.a., die auch fremde Dateien
(`spiel/stuecke/sud.js`, `werkbank/schuss/ts1-sud/…`) enthalten. Ich selbst
habe kein `git add`/`commit`/`push` ausgeführt; die Commits sind nicht von
mir, haben aber meine Arbeitsbaum-Änderungen mit eingesammelt. Alle vier
Dateien meines Besitzes stehen unverändert so, wie ich sie zuletzt bearbeitet
habe (`git diff HEAD` dagegen ist leer — geprüft).

## 1 — Der größte Hebel: eine Messlücke, keine Gestaltungsfrage

Vor jeder Farb- oder Kontraständerung ein Befund: `sicht.mjs` (wie sein
Nachbar `haushalt.js`) kennt `clip-path` nicht. `.stadt-zugeklappt` /
`.stadt-verdeckt` (stadt.css) schneiden ein geschlossenes Brett mit
`clip-path: inset(50%)` weg — für das Auge nichts, `aria-hidden="true"` steht
schon daneben —, aber die Textknoten bleiben mit realer `getBoundingClientRect()`
im DOM und wurden mitgezählt. Das traf **jedes** Stück, dessen Brett die
STADT beim Laden als Reiter zuklappt (eigenes und fremdes), am stärksten
aber `name.js`: sein „Rufband" (`nm-band`, Ebene `kopf`) liegt beim Laden
positionsgleich unter der STADT-Reiterzeile (Ebene `blatt`, architektonisch
immer oben) und lag darum in jeder Epoche vollständig „verdeckt" da.

**Fix:** `.stadt-zugeklappt { visibility: hidden !important; }` zusätzlich
zu `clip-path`. Erster Anlauf hat damit `beschriftung()` (stadt.js:610)
zerschossen — sie liest `kopf.innerText`, das bei `visibility:hidden` leer
zurückkommt und auf `kopf.textContent` zurückfällt, der aber keine
Zeilenumbrüche kennt: die Reiterbeschriftung „DIE HÄUSER" + „wollen 15…"
lief zu „DIE / HÄUSERwollen 15…" zusammen, am „RUF DES HAUSES"-Reiter sogar
komplett großgeschrieben. Gesehen am Bild, nicht an einer Zahl. Zweiter
Anlauf: `.stadt-zugeklappt > :first-child { visibility: visible; }` — genau
der Teil, den `beschriftung()` liest, bekommt seine Sichtbarkeit zurück,
bleibt aber durch `clip-path` weiterhin vollständig unsichtbar. Reiterschrift
seither bildgleich mit vorher (Screenshot-Vergleich, alle vier Epochen),
Kontrakt 3 (STADT-Rahmenschlüssel) bestanden.

Wirkung allein daraus (1366×768, Summe über 4 Epochen):
**verdeckt 226→89 · durchscheinend 343→94 · zu blass 673→395.**

## 2 — Die drei blinden Flecken des Kontrastprüfers

`sicht.mjs` liest nur `background-color`, nie `background-image`. Mehrere
eigene Plaketten (`.stadt-name`, `.stadt-hausschild.hell`, `.gg-sitz`,
`.gg-band`, alle fünf `.knopf.erb-*`-Varianten) setzen ihren Grund nur als
`linear-gradient(...)` — am Bild eine echte, deckende Fläche, für das
Werkzeug unsichtbar, das dann bis zum fast schwarzen Seitenhintergrund
(`#0d0b08`) durchfällt. **ST. MICHAEL / GASTHOF LINDENHOF stand deshalb bei
1,29:1 — nicht weil die Plakette schlecht ist, sondern weil sie für das
Messgerät nicht existierte.** Fix: `background-color` zusätzlich zum
Verlauf, überall exakt der Verlaufsfarbe entsprechend — am Bild kein Pixel
Unterschied (Screenshot verglichen), am Messwert ~9,7:1 statt 1,29:1.

Zweiter blinder Fleck: hover-only-Beschriftungen mit `opacity: 0` in Ruhelage
(`.knopf.stadt-pflock .wort`, `.stadt-marke-ruht`) — niemand sieht sie ohne
Zeiger/Fokus, aber `sicht.mjs` zählt sie als „durchscheinend" (Deckkraft
0,00). Fix: `visibility: hidden` zusätzlich, mit `transition-delay`, damit
die alte Überblendung erhalten bleibt.

Dritter, kleiner: zwei feste `opacity`-Werte auf eigenem, deckendem Grund
(`.gegr` auf dem Hausschild, `.gg-ohnegeld`/`.wann` im jetzt echten
Laufband) — Deckkraft vorab in die Farbe gemischt (z. B. `#2f1f0d` bei 0,8
auf `#f2e2bd` → `#564630`), gleiches Bild, volle Deckkraft.

## 3 — Was ich bewusst NICHT gemacht habe

`gegner.css` und `erbe.css` tragen seit Welle 11 eine dokumentierte,
durchgerechnete Architektur: **kein Kasten, nur Schrift mit Lichthof**
(`-webkit-text-stroke` + mehrlagiger `text-shadow`), weil ein Kasten je
Zeichen den Flächenhaushalt um das 6- bis 9-Fache gesprengt hätte (eigene
Kommentare in beiden Dateien, mit Zahl). Diese Texte haben **keinen**
`background-color`-Grund — absichtlich —, und `sicht.mjs` fällt darum bis
zum Seitenhintergrund durch: derselbe Mechanismus wie oben, aber hier ist
die „Reparatur" (ein Kasten) genau das, was Welle 11 mit Begründung entfernt
hat und was diese Welle selbst verbietet („du legst keinen Nebel darüber, um
Kontrast zu gewinnen"). Das ist der Rest von `gegner`s 139 und `erbe`s 20
verbleibenden „zu blass"-Funden — ein diagnostizierter, nicht behebbarer
Messfehler, kein übersehener Befund. Ebenso nicht angefasst: `sud.css`
(fremd, unter derselben Vorsicht wie `preis`/`fuhre`, siehe unten) und
`spiel/kern/**`/`grund.css` (schreibgeschützt — siehe Meldung unten).

## 4 — Meldung an die Aufsicht (fremdes Gebiet gefunden, nicht angefasst)

- **`spiel/kern/grund.css:266`** — der Basisknopf `.knopf` hat dasselbe
  Muster (`background: linear-gradient(...)` ohne `background-color`) und
  vererbt die Messlücke an **jeden** Knopf im Spiel, der keine eigene
  Übersteuerung hat (u. a. `.knopf.erb-weit` — dort mit einer eigenen,
  spezifischeren Regel in `erbe.css` umgangen, ohne `grund.css` anzufassen).
  Ein `background-color` neben dem Verlauf dort würde die Lücke einmalig für
  alle Stücke schließen.
- **`preis.css`/`fuhre.css`** (gesperrt): tragen densel­ben
  Nur-Verlauf-ohne-`background-color`-Fehler an mehreren Stellen (u. a.
  `.pr-griff-stand`, diverse `fu-*`-Kästen) und denselben opacity-statt-Farbe-
  Fehler (`fu-*` „lieber zukaufen" 0,85 u. ä.) — größter Einzelblock der
  verbliebenen Funde (`fuhre` allein 16 verdeckt/16 durch/8 blass zuletzt
  gemessen, war 93/93/221 vor Fix 1). Nicht angefasst.
- **`sud.css`/`sud.js`** (nicht mein Besitz, nicht gesperrt, aber fremd):
  gleiches Muster, 12 verdeckt/0 durch/20 blass zuletzt. Der Rest der
  `verdeckt`-Fälle zwischen `stadt` und `sud` (STADT-Hausschild „BRAUHAUS /
  ZUM ANKER" unter einer ruhenden SUD-Ortsmarke) ist eine Ebenen-Kollision
  (`bau` vs. `marken`, Reihenfolge in `kern/buehne.js`, schreibgeschützt) —
  gemeldet, nicht repariert.

## 5 — Die Partie (Auflage: Layout ist Wirtschaft)

Alle Änderungen dieser Welle sind ausschließlich `background-color`,
`color`, `visibility` — keine Geometrie, kein `data-zug`, keine Fläche
verändert. Trotzdem gemessen, wie verlangt: `linie.mjs`, 4 Epochen, je 100
Wochen, vorher (Commit `0d6e0db`, Hafen 8962) gegen nachher (finaler Stand,
Hafen 8961), Felder `jahr/woche/kasse/rohstoff/faesser/plaetze/amtszeit`
Woche für Woche verglichen:

| Epoche | Wochen verglichen | Abweichungen | Schluss (jahr/woche/kasse) vorher = nachher |
|---|---|---|---|
| E1 (1350) | 100 | **0** | 1353/11, Kasse 295 |
| E2 (1600) | 100 | **0** | 1603/11, Kasse 1196 |
| E3 (1884) | 100 | **0** | 1887/11, Kasse 2222 |
| E4 (1970) | 100 | **0** | 1973/11, Kasse 49285 |

**0 von 400 Wochen bewegt.** ρ ist nicht gesondert berechnet, weil die
Voraussetzung dafür (eine Bewegung in der Zahlenreihe) nicht eingetreten
ist — die Reihen sind Ziffer für Ziffer identisch.

## 6 — Abnahme

- **`sicht.mjs`, 1366×768:** verdeckt **226 → 61** (−73 %) · durchscheinend
  **343 → 39** (−89 %) · zu blass **673 → 303** (−55 %). Ziel 0/0/0 nicht
  erreicht — Grund: siehe §3 (Welle-11-Architektur, ~159 der 303
  verbliebenen Blässe-Funde) und §4 (Fremdgebiet: fuhre/preis/sud/kern,
  ~184 der verbliebenen 403 Gesamtfunde).
- **`lesbarkeit.mjs`, 1600×1000:** 2 Überläufe · 241 Textknoten <12px · 0/310
  Knöpfe <24px — **exakt wie vorher**, nicht schlechter.
- **`tor.mjs`:** vier Epochen OK, `lage` 0, 0 Konsolenfehler.
- **`kontrakte.mjs`:** 14/16 bestanden — **identisch zur Basis** (E1 „Aufgeld
  nach Lieferung" GERISSEN und E3 „ERBE AM_HAUS" nicht messbar sind
  vorbestehende, nicht durch diese Welle verursachte Zustände).
- **`BRAUHAUS.haushalt.pruefe()`, 2752×1536:** Zahlen **zeichengleich** zur
  Basis in allen vier Epochen (`stadt`/`preis`/`sud`/`name`/`kern` bereits
  vor dieser Welle über ihrem Budget — vorbestehend, durch reine
  `background-color`/`color`/`visibility`-Änderungen nicht bewegt, da keine
  Geometrie verändert wurde). Kein neuer Verstoß.
- **Partie:** siehe §5 — 0/400 Wochen bewegt.

## Geänderte Dateien

`spiel/stil/stadt.css` · `spiel/stil/stadt-zusatz.css` ·
`spiel/stil/gegner.css` · `spiel/stil/erbe.css`. Keine `.js`-Datei
angefasst — keine Handlung, kein Verb, kein `data-zug` verändert.
