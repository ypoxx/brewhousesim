# T0.6 — Kontrakttests gegen die vier stillen Kopplungen

Geschrieben waehrend der Arbeit, nicht danach. Werkzeug:
[`werkbank/schuss/aufsicht/kontrakte.mjs`](../schuss/aufsicht/kontrakte.mjs).
Vorbild: [`tor.mjs`](../schuss/aufsicht/tor.mjs) daneben.

Messung auf einem eigenen Server: `python3 -m http.server 8951 --bind 127.0.0.1`
aus der Repo-Wurzel, `HAFEN=8951`. Vor Beginn mit
`pgrep -af "linie.mjs|hand3|probe13|kritik-w13"` geprueft, ob eine fremde
Messung laeuft — es lief keine (der einzige Treffer war der eigene
`pgrep`-Aufruf selbst). Waehrend der Arbeit stand fest, dass eine ANDERE
Aufsicht denselben Arbeitsbaum parallel committet (siehe Abschnitt 5) — das
ist die im Auftrag angekuendigte Instanz, keine fremde Messung.

---

## 1 — Feldforschung: wo die vier Kopplungen wirklich stehen

Gesucht mit `grep` nach `AM_HAUS`, `pr-griff`, `aufgeld` (`-i`), und nach
Regexen ueber Protokoll-/Chroniktexte. Alle vier waren auffindbar, plus eine
fuenfte Fundstelle, die zur selben Kopplung wie #4 gehoert (kein eigener
Fall, siehe unten).

### 1. Aufgeld nach Lieferung (NAME erkennt FUHRE per Regex im Protokoll)

- **Schreibt** `spiel/stuecke/fuhre.js:1848-1852` — die gewoehnliche
  Lieferzeile: `B.welt.protokolliere({ wer:'spieler', was: 'geliefert an ' + a.name + ... })`.
  Die Rechnung selbst (der Text, den `istRechnung()` unten erkennt) entsteht
  eine Zeile vorher ueber `einnahme()` → `B.welt.nimm()` in
  `spiel/stuecke/fuhre.js:1844`, geschrieben von `kern/welt.js:274-278`
  (`nimm()` ruft `W.protokolliere({wer, was, preis: betrag})` selbst auf).
  Der Sommerabsatz kommt ueber denselben Weg aus `spiel/stuecke/fuhre.js:2279`
  (`einnahme(..., 'Sommerabsatz aus dem Aprilbestand')`).
- **Liest** `spiel/stuecke/name.js:529-559` (`kassiereAufgeld()`), zwei
  Regeln:
  - `spiel/stuecke/name.js:500-503` — `istRechnung(p)`:
    `/^[\d.,]+ (Fass|hl) an ./.test(p.was)`, matcht den Rechnungstext von
    `nimm()`.
  - `spiel/stuecke/name.js:538` — `p.was.indexOf('geliefert an ') === 0`,
    matcht den Lieferzeilentext von `fuhre.js:1849`.
  - `spiel/stuecke/name.js:551` — `p.was.indexOf('Sommerabsatz') === 0`.
  Kein Aufruf, kein Feld, kein Ereignis zwischen den Stuecken — nur Text.

### 2. ERBE-`AM_HAUS`-Wortliste

- **Schreibt** `spiel/stuecke/gegner-daten.js` (die `womit:`-Felder der
  Bindungsmittel, z. B. `'Konzession des Rats'`, `'Bannrecht'`,
  `'Pachtvertrag'`, `'Jahresvereinbarung'`, `'Listung'` — aber auch
  `'Gevatterschaft'`, `'Heirat'`, `'Amtsgewalt'`, `'Ratsspruch'`, die
  **keins** der AM_HAUS-Woerter tragen). Uebergeben an
  `B.welt.binde(schluessel, 'haus', m.womit, ...)` an mehreren Stellen in
  `spiel/stuecke/gegner.js` (u. a. Zeilen 971, 1677, 1700, 1797, 1844 —
  `zuvorkommen()`, `abwehren()`, `loeseAb()`, `mitbieten()`). `binde()`
  selbst legt den Text in `a.bindung.womit` ab: `kern/welt.js:342-347`.
- **Liest** `spiel/stuecke/erbe-daten.js:55` — `D.AM_HAUS` (eine
  Wortliste als Regex) — und `spiel/stuecke/erbe.js:204`
  (`function amHaus(womit) { return D.AM_HAUS.test(...); }`), benutzt in
  `amHausListe()`/`personListe()` (`erbe.js:211-216`) und an mehreren
  weiteren Stellen (`erbe.js:350, 421, 465, 668, 908, 1229`). Kein
  gemeinsamer Katalog, keine geteilte Konstante — GEGNER erfindet Prosa,
  ERBE rät an Substrings.

### 3. STADT-Rahmenschlüssel

- **Schreibt/baut** `spiel/stuecke/stadt.js:572-579` (`schluesselVon(b)`):
  `b.wer + '|' + (Klassenliste sortiert, ohne die ZU-Klasse)`. `b.wer` kommt
  aus `data-stueck` (vom Rahmen selbst beim Anlegen des Fachs vergeben,
  `kern/buehne.js:42-53`), die Klassenliste ist die CSS-Klasse, die **das
  fremde Stück sich selbst gibt** — fuer DEN SUD z. B. `sud-brett`
  (`spiel/stuecke/sud.js:1594`: `B.el('div', 'sud-brett')`). Der fertige
  Schluessel-Katalog haengt an `lage` und wird oeffentlich herausgegeben
  ueber `spiel/stuecke/stadt.js:2246` (`B.stadt.rahmen.lage()`).
- **Liest zurück, hartkodiert** `spiel/stuecke/sud.js:2271-2282`
  (`rahmenWill()`): sucht in `B.stadt.rahmen.lage()` nach einem Schluessel,
  der `.indexOf('sud|') === 0` UND `.indexOf('sud-brett') > 0` erfuellt —
  zwei String-Literale, keine Konstante, kein gemeinsamer Bezug zur
  Formel in `schluesselVon()`. Der Code kommentiert das selbst
  unmissverstaendlich (`sud.js:2260-2266`): *"Der Schluessel ist
  `wer|Klassen ohne stadt-zugeklappt`, fuer dieses Brett `sud|sud-brett`."*
  Beide Seiten — der Trenner `'|'` UND der Klassenname `'sud-brett'` —
  koennen unabhaengig voneinander brechen.

### 4. GEGNER liest `.pr-griff`

- **Schreibt** `spiel/stuecke/preis.js:3103` — `var griff = B.el('div', 'pr-griff');`
  (der Chronikgriff DES PREISES, sichtbar sobald die Michaelitafel zu ist —
  das ist der Normalfall).
- **Liest** `spiel/stuecke/gegner.js:339-363` (`messeGriffe()`):
  `document.querySelectorAll('#ebene-blatt .pr-griff')`, misst die
  Bildschirmrechtecke und legt sie in `GRIFFE[epoche]` ab, um beim
  Platzieren seiner eigenen Karten auszuweichen. Herausgegeben ueber
  `spiel/stuecke/gegner.js:3705-3706` (`B.gegner.zonen().griffe`). Der Code
  benennt die eigene Zerbrechlichkeit selbst, wortwoertlich
  (`gegner.js:307`): *"WENN DER PREIS SEINEN GRIFF UMBENENNT, greift das
  lautlos nicht mehr."*
  Eine **dritte, rein dokumentarische** Fundstelle derselben Klasse steht in
  `spiel/stuecke/stadt.js:1053` (ein Kommentar, der den Selektor
  `.fach-blatt-preis > .pr-griff > button[...]` als Beispiel nennt) — dort
  wird nichts gelesen, das ist kein eigener fuenfter Fall, nur ein Beleg,
  wie verbreitet die Kenntnis dieser Klasse im Projekt ist.

**Keine fünfte Kopplung gefunden**, die eine eigene Nennung verdient hätte.

---

## 2 — Das Prüfgerät

`werkbank/schuss/aufsicht/kontrakte.mjs`. Playwright wie in `tor.mjs`
absolut aus `/opt/node22/lib/node_modules/playwright/index.mjs` importiert.
`npx playwright install` wurde **nicht** ausgeführt (nicht nötig — Playwright
lag bereits unter `/opt/node22` bereit, Version 1.56.1, per
`node -e "require(...).version"` geprüft).

- Hafen aus `HAFEN` (Vorgabe `8899`), Saat aus `SAAT` (Vorgabe `1350`, wie
  `tor.mjs`).
- Jede Adresse trägt `&neu=1`.
- Jeder Kontrakt läuft **einmal je Epoche** (1–4), macht mit echten Klicks
  (`node.click()` auf dem gefundenen Element — Begründung unten in Abschnitt
  4) einen Spielzustand, in dem die Kopplung greifen müsste, und liest dann
  eine öffentliche, vom Spiel selbst herausgegebene Zahl oder einen
  Protokolleintrag.
- Drei Ausgänge je Kontrakt/Epoche: **bestanden**, **gerissen**,
  **nicht messbar** — als eigener String, nie als Fallback von „gerissen".
- Exit 0 nur, wenn **alle** 16 Zellen (4 Kontrakte × 4 Epochen) `bestanden`
  sind.
- Ausgabe ist eine kurze deutsche Tabelle, kein JSON.

---

## 3 — Ergebnis am unveränderten Arbeitsbaum (Baseline, mehrfach reproduziert)

```
KONTRAKTE DER AUFSICHT — Hafen 8951, Saat 1350

Aufgeld nach Lieferung  E1:GERISSEN     E2:bestanden    E3:bestanden    E4:bestanden
ERBE AM_HAUS-Wortliste  E1:bestanden    E2:bestanden    E3:nicht messb. E4:bestanden
STADT-Rahmenschluessel  E1:bestanden    E2:bestanden    E3:bestanden    E4:bestanden
GEGNER liest .pr-griff  E1:bestanden    E2:bestanden    E3:bestanden    E4:bestanden

14 bestanden, 1 gerissen, 1 nicht messbar (von 16).
NICHT ALLE KONTRAKTE BESTANDEN — kein Exit 0.
```

Zwei Zellen sind auf dem unveränderten Baum **nicht** grün, und beides sind
Befunde über das SPIEL, nicht über das Prüfgerät oder einen echten Bruch:

- **Aufgeld/E1 (GERISSEN):** Bei `saat=1350` startet Epoche 1 mit Ruf 10 von
  100 und einem Höchstsatz von 8 % (`epd().aufschlag`), macht also
  `aufschlag() ≈ 0,8 %`. Der Ochsenkarren fasst wenige Fässer; selbst eine
  volle Fuhre bringt ~30–40 Pf Rechnung. `0,8 % von 36 Pf = 0,29`, `Math.round`
  rundet das auf **0**. Nachgeprüft über 25 Wochen mit zusätzlicher
  Werbeinvestition (`name:jetzt:kirchweih`): Ruf stieg auf 18, fiel durch
  einen Handwechsel wieder auf 0–13, Aufgeld blieb die ganze Zeit 0. Das ist
  eine Rundungs-/Anfangswirtschaft-Grenze dieser Saat, kein Hinweis auf
  einen kaputten Regex — E2–E4 zeigen dieselbe Kopplung mit größeren
  Rechnungen sofort grün (siehe unten, Wortlaut der echten Protokollzeile).
- **AM_HAUS/E3 (nicht messbar):** In 50 gespielten Wochen (mit und ohne
  vorherige Lieferungen zum Kassenaufbau) blieb **jeder** Versuch,
  `gegner:abloesen:*` auszulösen, `(nicht bezahlbar)` — bei einer Kasse von
  über 12.000 M. Die Ablösesumme skaliert in 1884 offenbar schneller als das
  Testbudget an Wochen Kapital bilden kann. Das Prüfgerät konnte die
  Vorbedingung („eine echte Bindung ans Haus entsteht") in der gegebenen
  Zeit nicht herstellen — nach der Regel des Auftrags zählt das als
  **eigener Ausgang**, nicht als Bruch.

Belegzeile für den funktionierenden Regelfall (Epoche 4, ein einzelner
geladener und abgeschickter Wagen):

```
spieler: Aufgeld auf den Namen · Gasthof Lindenhof · 8.190 DM aufs
         Zahlungsziel · 10,6 im Hundert auf 19.110 DM   (preis=2018)
```

und für AM_HAUS (Epoche 2, ein einzelner erfolgreicher `gegner:abloesen:ochse`):

```
amHaus: ["Zum Goldenen Ochsen · Pachtvertrag"]
```

---

## 4 — Der Bruchbeweis: alle vier Kontrakte einzeln zerstört und wiederhergestellt

Für jeden Kontrakt: eine Zeile im Arbeitsbaum geändert, `kontrakte.mjs`
gegen alle vier Epochen laufen lassen, das Ergebnis notiert, die Zeile
**danach** wortwörtlich wiederhergestellt und mit `git diff` bestätigt.

### Kontrakt 1 — Aufgeld nach Lieferung

Geändert: `spiel/stuecke/name.js:538`
`p.was.indexOf('geliefert an ')` → `p.was.indexOf('XXBRUCH-T0.6geliefert an ')`.

```
Aufgeld nach Lieferung  E1:GERISSEN  E2:GERISSEN  E3:GERISSEN  E4:GERISSEN
```

E2, E3, E4 kippen von `bestanden` auf `GERISSEN` (E1 war schon vorher rot,
siehe Abschnitt 3 — bleibt rot, zeigt also keinen zusätzlichen Ausschlag,
das ist an dieser einen Zelle erwartbar). Wiederhergestellt;
`git diff spiel/stuecke/name.js` danach leer.

### Kontrakt 2 — ERBE-`AM_HAUS`-Wortliste

Geändert: `spiel/stuecke/erbe-daten.js:55`
`D.AM_HAUS = /vertrag|.../i;` → `D.AM_HAUS = /BRUCH-T0\.6-NIE-TREFFEN/i;`

```
ERBE AM_HAUS-Wortliste  E1:GERISSEN  E2:GERISSEN  E3:nicht messb.  E4:GERISSEN
```

E1, E2, E4 kippen von `bestanden` auf `GERISSEN`. E3 bleibt
`nicht messbar` — folgerichtig: wenn nie eine Bindung zustande kommt, kann
das Prüfgerät den Regex gar nicht befragen, egal ob er funktioniert oder
kaputt ist. Genau das ist der Unterschied, den der Auftrag verlangt: eine
Messlücke bleibt eine Messlücke, auch beim absichtlichen Bruch. Wiederhergestellt;
`git diff spiel/stuecke/erbe-daten.js` danach leer.

### Kontrakt 3 — STADT-Rahmenschlüssel

Geändert: `spiel/stuecke/stadt.js:578`
`return b.wer + '|' + (...)` → `return b.wer + '::BRUCH-T0.6::' + (...)`.

```
STADT-Rahmenschluessel  E1:GERISSEN  E2:GERISSEN  E3:GERISSEN  E4:GERISSEN
```

Alle vier Epochen kippen von `bestanden` auf `GERISSEN` — sauber, weil dieser
Kontrakt schon beim Laden entscheidbar ist (kein Spielzug nötig).
Wiederhergestellt; `git diff spiel/stuecke/stadt.js` danach leer.

### Kontrakt 4 — GEGNER liest `.pr-griff`

Geändert: `spiel/stuecke/gegner.js:344`
`'#ebene-blatt .pr-griff'` → `'#ebene-blatt .pr-griff-BRUCH-T0-6'`.

```
GEGNER liest .pr-griff  E1:GERISSEN  E2:GERISSEN  E3:GERISSEN  E4:GERISSEN
```

Alle vier Epochen kippen von `bestanden` auf `GERISSEN`, ebenfalls beim
Laden entscheidbar. Wiederhergestellt; `git diff spiel/stuecke/gegner.js`
danach leer.

### Abschluss-Check

Nach allen vier Wiederherstellungen:

```
$ git status --short spiel/
$ git diff spiel/
(beides leer)
```

Der letzte Baseline-Lauf (Abschnitt 3) wurde **nach** allen vier
Bruch/Wiederherstellungs-Zyklen erneut gefahren und ergab exakt dasselbe
Bild wie zuvor — die Wiederherstellung war vollständig.

*Hinweis zu `git status` im Ganzen:* Eine zweite, im Auftrag angekündigte
Aufsicht committet denselben Arbeitsbaum parallel (u. a.
`werkbank/schuss/aufsicht/p0-abschluss.sh` und
`werkbank/urteile/welle13-abnahme-aufsicht.md`, keine Dateien dieser
Untersuchung). Dadurch zeigte `git status` zwischenzeitlich bereits
committete Stände; das ändert nichts an der oben belegten Tatsache, dass
`spiel/` am Ende dieser Arbeit exakt dem Stand vor Beginn entspricht.

---

## 5 — Was an diesem Gerät schwach ist

- **`node.click()` statt Koordinatenklick.** Mehrere Bretter liegen beim
  Laden zugeklappt (`clip-path`) oder unter einem fremden Band — ein
  Playwright-Koordinatenklick trifft dort das Bild dahinter, nicht den
  Knopf (mit Diagnose über `elementFromPoint` nachgewiesen, bevor die
  Methode gewählt wurde). `kontrakte.mjs` ruft darum `node.click()`
  direkt am gefundenen Element auf — genau der Kniff, den
  `werkbank/schuss/aufsicht/mitbieten.mjs` an gleicher Stelle im Projekt
  schon benutzt. Für eine Aussage über die BEDIENBARKEIT eines Knopfes
  wäre das der falsche Weg (das prüfen `erreichbar.mjs`/`tor.mjs` & Co.
  bereits); für eine Aussage über die KOPPLUNG ist es die richtige, aber es
  bedeutet: dieses Gerät kann nicht gleichzeitig als Beleg dafür dienen,
  dass ein Spieler mit der Maus an dieselbe Stelle käme.
- **Kontrakt 1 (Aufgeld) ist auf Epoche 1 mit `saat=1350` strukturell
  schwach.** Die Grenze liegt in der Wirtschaft der ersten Wochen
  (Rundung), nicht im Prüfgerät — aber das Gerät kann diese beiden Fälle
  nicht auseinanderhalten. Ein echter Bruch UND eine zu kleine Zahl sehen
  von außen identisch aus: eine leere Aufgeld-Protokollzeile. Der einzige
  Beleg, der beides trennt, ist der Vorher/Nachher-Vergleich in Abschnitt 4
  — das Gerät selbst liefert für E1 kein zuverlässiges Alleinstellungsmerkmal.
- **Kontrakt 2 (AM_HAUS) braucht Kasse, die das Gerät nicht immer
  herbeispielen kann.** Für Epoche 3 (`1884`, `saat=1350`) reichte auch eine
  gute Kasse (12.000+ M) über 50–80 Wochen nicht, um eine einzige Ablösung
  bezahlbar zu machen. Ein anderer Saat oder ein längeres Zeitbudget hätte
  das vermutlich behoben, aber das Gerät bricht bewusst ab, statt beliebig
  lange zu laufen — die Alternative wäre ein sehr viel langsameres
  `kontrakte.mjs`.
- **Kein Bruchbeweis für die „nicht messbar"-Zelle selbst.** Für AM_HAUS/E3
  wurde gezeigt, dass sie bei absichtlichem Bruch `nicht messbar` bleibt
  (richtig) — aber es wurde NICHT unabhängig bewiesen, dass sie bei einer
  reparierten Wirtschaft tatsächlich `bestanden` würde. Das bleibt eine
  Lücke, keine Behauptung.
- **Wortmenge, nicht Grammatik.** Kontrakt 2 prüft nur, ob IRGENDeine
  erfolgreiche Bindung in `amHaus` auftaucht, nicht ob JEDES `womit`-Wort aus
  `gegner-daten.js` korrekt klassifiziert wird. Wörter wie „Gevatterschaft"
  oder „Ratsspruch" (die bewusst NICHT zu AM_HAUS gehören, siehe Abschnitt 1)
  werden vom Gerät nie einzeln nachgeprüft — nur, dass die Kopplung als
  Ganzes noch etwas durchlässt.
- **Kein Dauerbetrieb.** Das Gerät läuft einmalig, prüft nicht, ob die
  Kopplung nach vielen Spielstunden / vielen Erbfällen weiter trägt (siehe
  die Beobachtung in Abschnitt 3, dass `amHaus`-Einträge nach vielen Wochen
  in E1 wieder verschwanden — vermutlich durch einen Erbfall). Das ist
  außerhalb des Auftrags, aber ein blinder Fleck.
