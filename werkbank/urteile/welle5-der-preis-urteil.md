# DER PREIS — Urteil des blinden Kritikers, Welle 5

**Gemessener Commit: `6b59a18`** ("DER PREIS, Welle 5: Kassenboden gebaut,
Zaehler-Verdacht widerlegt"), eingefroren auf **eigenem Hafen 8906** ueber
`werkbank/schuss/preis-kritik-w5/hafen.sh 6b59a18 8906`.
Alle Zahlen dieses Urteils stammen von diesem Stand, nicht aus dem Arbeitsbaum
(an `kern/ton.js` und `spiel/ton/**` schrieb waehrenddessen ein anderer Builder).
Der einzige spaetere Commit `e372d8b` beruehrt keine Spieldatei
(`werkbank/LAUFENDER-AUFTRAG.md`, `werkbank/stand.json`).

> ## ⚠ ZUERST EIN BEFUND AM MESSSTAND DER AUFSICHT, weil er jede Zahl dieser Welle betrifft
>
> **`werkbank/schuss/aufsicht/messstand.sh` stellt den Hafen in diesem
> Container NICHT um und meldet den Fehlschlag nur ueber den Exit-Code.**
>
> Zeile 32 des Skripts:
> ```bash
> PID=$(ss -lptn "sport = :$HAFEN" 2>/dev/null | grep -o 'pid=[0-9]*' | head -1 | cut -d= -f2)
> ```
> `ss` ist hier **nicht installiert** (`command -v ss` → leer; `lsof` und
> `fuser` sind da). Unter `set -euo pipefail` reisst diese Zeile das Skript ab,
> **bevor** es den Server auf den verlangten Commit umsetzt. `messstand.sh
> 6b59a18` endet mit **Exit 1 und ohne jede Ausgabe** — und auf Hafen 8900
> laeuft unveraendert weiter, was vorher dort lief.
>
> Was vorher dort lief, war `/tmp/messstand/3e6d08c` (PID 26500, `CWD=/tmp/messstand/3e6d08c`)
> — **der Stand von VOR dem Bau dieser Welle**, genau der Commit, den
> `preis.js:1057` als Vorher-Messung zitiert. Der erste Satz Messungen dieses
> Urteils lief eine Stunde lang gegen diesen falschen Stand, und der einzige
> Grund, warum es auffiel, war eine Feldpruefung: `BRAUHAUS.preis.leiter()`
> lieferte keine Schluessel `vorgriff`/`rueckstand`, obwohl `preis.js:1141-1142`
> sie schreibt. Die ausgelieferte `preis.js` war 115.079 Byte gross, die des
> Commits 121.237.
>
> **Auflage an die Aufsicht (ZUSTAENDIGKEIT-Vorlage, siehe unten):** ein
> Messstand muss die AUSGELIEFERTE Datei gegen den Commit pruefen, nicht nur
> `HTTP 200` sehen. `hafen.sh` daneben tut das (drei Dateien, `sha1sum` gegen
> `git show`) und ist elf Zeilen lang.
>
> Der Nachweis, im Wortlaut:
> ```
> $ command -v ss                                   → (leer)
> $ bash werkbank/schuss/aufsicht/messstand.sh 6b59a18; echo EXIT=$?
> EXIT=1                                            (keine Zeile Ausgabe)
> $ curl -s http://127.0.0.1:8900/spiel/stuecke/preis.js | sha1sum
> 3ce38cf47886ac333be0e0e2fd6851fe755ef2c4
> $ git show 3e6d08c:spiel/stuecke/preis.js | sha1sum
> 3ce38cf47886ac333be0e0e2fd6851fe755ef2c4        ← Hafen 8900 trug 3e6d08c
> $ git show 6b59a18:spiel/stuecke/preis.js | sha1sum
> 844e2bd9a31290b3930cda5bc42f4e09c4b43fcd        ← verlangt war das
> ```
> Dazu aus `/proc`: `PID 26500  CWD=/tmp/messstand/3e6d08c  CMD=python3 -m http.server 8900`.
>
> Die verworfenen Zahlen liegen unter `/tmp/pk5-3e6d08c-falsch/` und werden in
> diesem Urteil **nirgends** verwendet — ausser als Gegenprobe an einer Stelle,
> wo sie ausdruecklich als solche benannt ist.
>
> **Nebenbefund, der die Sache erst gefaehrlich macht:** die Falle greift
> lautlos. `tor.mjs` gab auf dem falschen Stand „TOR OFFEN" fuer alle vier
> Epochen, das Spiel lief, die Zahlen sahen plausibel aus. Nur ein Feld, das
> der Builder DIESER Welle neu geschrieben hat (`preis.js:1141` `vorgriff`),
> fehlte im Ergebnis — daran ist es aufgefallen. Ohne diesen Zufall waere ein
> vollstaendiges Urteil ueber den falschen Commit entstanden.

Belege und Messgeraete: `werkbank/schuss/preis-kritik-w5/`
(`hand.mjs`, `decke.mjs`, `boden.mjs`, `auswerten.py`, `welle-seq.sh`,
`linie-vorbild.mjs` = unveraenderte Kopie des Vorbilds).

*(LAUFEND MITGESCHRIEBEN — der Stand am Ende der Datei sagt, was fertig ist.)*

---

## 0. Heil? — Das Abnahmetor

`HAFEN=8906 node werkbank/schuss/aufsicht/tor.mjs` auf `6b59a18`:

```
E1: OK   jahr=1350 zuege=105 lage=0 fehler=0
E2: OK   jahr=1600 zuege=112 lage=0 fehler=0
E3: OK   jahr=1884 zuege=116 lage=0 fehler=0
E4: OK   jahr=1970 zuege=107 lage=0 fehler=0
TOR OFFEN
```

Alle vier Epochen laden, `BRAUHAUS.lage.length === 0`, keine Konsolenfehler.

---

## 1. Das Messgeraet, bevor die Zahlen kommen

Gemessen wird SEQUENZIELL, ein Browser nach dem anderen
(`werkbank/schuss/preis-kritik-w5/welle-seq.sh`). Das Vorbild
`werkbank/schuss/rueckkopplung-r3/welle.sh` startet vier Epochen nebeneinander;
die Aufsicht hat gemessen, dass genau das die Zahlen auseinanderzieht.

Die Hand ist `hand.mjs`. Sie ist Zeile fuer Zeile die des Vorbilds
`werkbank/schuss/rueckkopplung-r3/linie.mjs` (ZUSTAENDIGKEIT 16: am fremden
Messgeraet wird nicht gedreht — das Vorbild liegt unangetastet daneben als
`linie-vorbild.mjs`), mit genau drei Aenderungen:

1. **Die Plus-Falle ist raus.** `kern/buehne.js:166` schreibt `data-preis` mit
   Vorzeichen; `spiel/stuecke/preis.js:1901` setzt fuer eine Festlegung, die
   Geld hereinbringt, `preis: (zufluss || 0)` — also POSITIV. Das Vorbild
   rechnet an drei Stellen `Math.abs(z.preis)` und macht daraus eine Ausgabe.
   `hand.mjs` rechnet `kosten(p) = Math.max(0, -p)`. Mit `ABS=1` ist die Falle
   wieder da, damit sie messbar bleibt statt behauptet.
2. 420 Wochen = **vierzehn Braujahre** (`kern/uhr.js:18`, `WOCHEN_IM_JAHR = 30`).
3. Mehr wird mitgeschrieben, gespielt wird nicht anders.

### Das Geraet ist reproduzierbar — die gemeldete Streuung war es nicht

Zwei voneinander unabhaengige, NACHEINANDER gelaufene Messungen derselben
Epoche 1 (zwei Prozesse, vier Minuten auseinander, `/tmp/pk5/e1-erst.json`
gegen `/tmp/pk5/e1-A.json`):

* Kassenreihe ueber 420 Wochen **Ziffer fuer Ziffer identisch**
* Kennzahlreihe ueber 15 Michaelitage **Ziffer fuer Ziffer identisch**
  (`5,895 · 1,548 · 4,104 · 4,393 · 13,100 · 6,104 · 9,452 · 15,136 · 15,792 ·
  11,000 · 18,444 · 10,600 · 10,886 · 8,200 · 4,840`)

Sequenziell gemessen streut dieses Spiel **gar nicht**. Wer Streuung meldet,
misst seinen Browser.

### UND EIN BEFUND AM MASSSTAB SELBST, bevor die Zahlen kommen

`rho` haengt daran, WIE VIELE MICHAELITAGE man zaehlt. Dieselbe Reihe, Epoche 1,
`6b59a18`:

| Michaelitage | 12 | 13 | 14 | 15 |
|---|---|---|---|---|
| Spearman | — | **+0,692** | **+0,591** | **+0,421** |

Der eingetragene Stand **+0,591** ist der Wert bei **vierzehn** Michaelitagen —
das sind die 400 Wochen des Vorbilds. Bei dreizehn steht dieselbe Partie auf
+0,692 und damit **acht Tausendstel unter der Latte**. Die Latte |rho| < 0,700
wird in E1 nicht mit Abstand bestanden, sondern mit der Wahl der Laufzeit.
Das gehoert neben jede Zahl geschrieben, die diese Latte nennt.

### Der Kassenboden laesst sich BUCHUNG FUER BUCHUNG messen, nicht nur wochenweise

`kern/uhr.js:170` (`schliesseJahr` → `welt.rechneJahrAb`) und der Michaeli des
Stuecks laufen INNERHALB eines einzigen WEITER-Klicks ab. Wer nur am
Wochenanfang hinsieht, sieht die Kasse erst wieder, NACHDEM der Vorgriff sie
gehoben hat — der Boden waere per Bauart unsichtbar.

`B.protokoll` ist aber vollstaendig: Anfangslade plus Summe aller Buchungen
trifft die Endkasse auf den Pfennig (E1: 112 + Σ3.696 Buchungen = 242, gemessen
242). Der Boden wird deshalb hier **Buchung fuer Buchung** gezaehlt.

### Zwischenbefund am Zaehler selbst (Quelltext, gegengelesen am Bildschirm)

`spiel/stuecke/preis.js:2393` setzt den Griff-Text zusammen:

```js
text: 'Chronik des Hauses · ' + festlegungenGesamt() + ' Festlegungen · '
      + Object.keys(Z.fertig).length + ' von dieser Tafel gebaut',
```

`festlegungenGesamt()` (Zeile 1502) zaehlt richtig — alle Chronikeintraege mit
`art === 'festlegung'`, aus allen vier Stuecken. Die ZWEITE Zahl aber ist
`Z.fertig` — das sind FERTIGE ANGEBOTE (Zeile 1177 `Z.fertig[k] = jahr()` in
`fertigstellen`), nicht Festlegungen. Sie steht in einem Satz, der von
Festlegungen handelt.

Gemessen, Epoche 1600: das Haus nimmt **genau eine** Festlegung, und zwar
`preis:festlege:reinheit` — von genau dieser Tafel. Der Griff sagt dazu:

> `Chronik des Hauses · 1 Festlegungen · 0 von dieser Tafel gebaut`

Wer das liest, schliesst: die eine Festlegung kam von woanders. Sie kam von hier.

---

## LAUFENDE ROHBEFUNDE (werden unten zum Urteil zusammengezogen)

> **Die Tabellen dieses Abschnitts stammen noch vom falschen Stand `3e6d08c`
> und werden ersetzt, sobald die Welle auf `6b59a18` durch ist. Sie stehen hier
> nur, damit nachvollziehbar bleibt, was der Fehlmessung auffiel.**
>
> Erste Gegenprobe auf dem RICHTIGEN Stand, Epoche 1350, Lauf A: **Ziffer fuer
> Ziffer dieselbe Partie** (Kasse 39–609, Kennzahl 1,55–18,44×, Fest 1×,
> Nimm 1×, Gegner 285). Der gebaute Kassenboden aendert in E1 mit sorgfaeltiger
> Hand nichts, weil er nie greift: `preis.leiter().vorgriff` ist in **allen
> fuenfzehn** Michaelijahren 0, `rueckstand` ebenfalls.

### DIE MICHAELITAFEL IST AN JEDEM ZWEITEN MICHAELI NICHT ANZUFASSEN (Stand 3e6d08c, wird ersetzt)

Je Michaelitag gezaehlt, nachdem die Hand die Tafel aufgeschlagen hat: wie
viele Karten sind AKTIV (nicht `disabled`) und wie viele davon werden von
`elementFromPoint` GETROFFEN.

| Michaeli E1 | 1350 | 1351 | 1352 | 1353 | 1354 | 1355 | 1356 | 1357 | 1358 | 1359 | 1360 | 1361 | 1362 | 1363 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Karten ueberhaupt getroffen | 8/8 | **0/8** | 3/8 | **0/8** | 3/8 | **0/7** | 7/7 | **0/7** | 7/7 | **0/7** | 7/7 | **0/7** | 7/7 | **0/7** |
| aktiv **und** erreichbar | 3 | **0** | 1 | **0** | 1 | **0** | 3 | **0** | 2 | **0** | 3 | **0** | 3 | **0** |

| Michaeli E2 | 1600 | 1601 | 1602 | 1603 | 1604 | 1605 | 1606 | 1607 | 1608 | 1609 | 1610 | 1611 | 1612 | 1613 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Karten ueberhaupt getroffen | 9/9 | **0/8** | 3/8 | **0/8** | 3/8 | **0/8** | 8/8 | **0/8** | 8/8 | **0/8** | 8/8 | **0/8** | 8/8 | **0/8** |
| aktiv **und** erreichbar | 4 | **0** | 0 | **0** | 0 | **0** | 3 | **0** | 2 | **0** | 2 | **0** | 1 | **0** |

**An sieben von vierzehn Michaelitagen ist keine einzige Karte der Tafel mit
der Maus zu treffen** — in beiden Epochen, in denselben (ungeraden) Jahren.
Die Karten sind gezeichnet, haben Flaeche, sind teils nicht `disabled` — und
liegen unter etwas. Wer verdeckt, wird mit `decke.mjs` nachgesehen.

### (c) DER GEGNER VERSTUMMT IN E1 NACH 1358

Gegnerzuege je Braujahr (`B.protokoll`, `wer === 'gegner'`), E1:

```
1350:31  1351:34  1352:42  1353:37  1354:40  1355:36  1356:41  1357:23
1358: 1  1359: 0  1360: 0  1361: 0  1362: 0  1363: 0  1364: 0
```

Der letzte Eintrag lautet *„Brauhaus zum Adler gibt auf. Der Hof gegenüber
steht leer."* (1358/1). Danach **sieben Braujahre ohne einen einzigen Zug des
Gegners** — die Haelfte der Partie. In E2 laeuft der Gegner alle vierzehn
Jahre durch (36–84 Zuege je Jahr, 813 gesamt).

*(weitere Zahlen folgen)*

---

## SPERRLISTE `design/PRUEFUNG.md` — nichts gefunden

Die fuenf Standardfallen aus `design/PRUEFUNG.md` §1.1, gegen die Daten und
Texte dieses Stuecks gehalten (`spiel/stuecke/preis-daten.js`, vier
Epochenbloecke getrennt durchsucht):

| Falle | Befund bei DER PREIS |
|---|---|
| Hektoliter vor 1872 | **kein Verstoss.** `hl`/`Hektoliter` kommt nur in den Bloecken der Epochen 3 (ab 1884) und 4 (ab 1970) vor, in 1350 und 1600 kein einziges Mal. Der Kern schaltet die Einheit ohnehin bei 1872 um (`kern/welt.js:254`). |
| Emailschild vor den 1890ern | **kein Verstoss.** `preis-daten.js:857` — `{ k: 'email', name: 'Emailschilder an fünfzehn Häusern', … ab: 1893 }`. Das Angebot ist vor 1893 nicht auf der Tafel. Die Regel steht ausserdem als Kommentar in `preis-daten.js:26`. |
| Strichcode / Taschenrechner 1970 | **kein Verstoss.** Kein `Strichcode`, `EAN`, `Rechner` in irgendeinem Epochenblock. |
| Untergaeriges Lager 1350 | **kein Verstoss.** `Lager`/`Lagerbier` kommt im Block der Epoche 1 nicht vor. |
| Klares goldenes Bier vor 1878 | **kein Verstoss.** `golden`/`klar` als Biereigenschaft in keinem Epochenblock. |
