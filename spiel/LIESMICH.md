# Das Skelett — was fest ist und was dir gehört

Gebaut vom Skelett-Bauer, **eingefroren**, bevor die vier Stück-Builder starten.
Wer das hier liest, baut eines der vier Stücke: **DIE STADT · DIE FUHRE · DER PREIS ·
DER GEGNER**.

## Die drei Regeln, die euch kollisionsfrei machen

**1. `spiel/index.html` ist fertig und wird nie wieder angefasst.** Alle Dateien aller vier
Stücke sind darin bereits eingehängt, jede liegt als lauffähiger Stummel vor. Du musst kein
`<script>`- und kein `<link>`-Tag ergänzen. Brauchst du eine zweite Datei, benutze den
schon eingehängten freien Platz `stuecke/<name>-zusatz.js` bzw. `stil/<name>-zusatz.css`.
Die `index.html` in der **Repo-Wurzel** ist die Fortschrittsseite und für alle tabu.

**2. Namenspräfix statt gemeinsamer Dateien.** Dir gehören ausschließlich:

| Stück | Dateien |
|---|---|
| stadt | `stuecke/stadt*.js` · `stil/stadt*.css` · `bild/**` (ganz) · `ton/stadt/**` |
| fuhre | `stuecke/fuhre*.js` · `stil/fuhre*.css` · `bild/fuhre/**` · `ton/fuhre/**` |
| preis | `stuecke/preis*.js` · `stil/preis*.css` · `bild/preis/**` · `ton/preis/**` |
| gegner | `stuecke/gegner*.js` · `stil/gegner*.css` · `bild/gegner/**` · `ton/gegner/**` |

`bild/` gehört DER STADT als Ganzes, weil dort die vier Epochenplatten liegen.

**3. Geteilter Zustand gehört dem Skelett.** `kern/basis.js`, `orte.js`, `uhr.js`,
`welt.js`, `ton.js`, `buehne.js`, `kopf.js`, `start.js` und `stil/grund.css` sind
**schreibgeschützt**. Lies den Weltzustand, ändere ihn nur über die API. Brauchst du
nachweislich eine Kernänderung, melde sie mit `./werkbank/stand.py chronik "KERN: …"` —
gesammelt wird zwischen den Wellen eingearbeitet.

Und für alle: **niemals `git add`, `git commit`, `git push`.** Nur Dateien schreiben.

---

## Dein Stück anmelden

```js
BRAUHAUS.stueck('gegner', {
  aufbau:  function () { },              // einmal nach dem Laden
  zeichne: function () { },              // bei jedem 'zeichne' — hier alles neu malen
  woche:   function (d) { },             // d = {jahr, woche, epoche}
  jahr:    function (d) { },
  epoche:  function (d) { },             // d = {epoche, vorher}
  erbfall: function (d) { }              // d = {amtszeit}
});
```

Jeder Aufruf ist eingepackt. Ein Stück, das wirft, erzeugt **keinen Konsolenfehler** und
reißt die anderen drei nicht mit; der Fehler landet in `BRAUHAUS.lage` und ist mit
`?pruefe=1` sichtbar. Verlass dich nicht darauf — `BRAUHAUS.lage.length` muss 0 sein.

## Ebenen — male nur in dein Fach

```js
var fach = BRAUHAUS.ebene('marken');     // in aufbau/zeichne reicht ein Argument
BRAUHAUS.leere(fach);                    // vor dem Neuzeichnen
fach.appendChild(dingsda);
```

z-Ordnung: `platte` < `bau` < `marken` < `hand` < `kopf` < `blatt`.
Gedachte Verteilung: platte+bau = DIE STADT, marken = DER GEGNER, hand = DIE FUHRE,
blatt = DER PREIS, kopf = das Skelett. Du darfst mehrere Ebenen benutzen — jedes Fach ist
deins allein. **Schreibe nie in fremdes DOM.**

## Orte — der Grund, warum alle vier Epochen denselben Ort zeigen

`kern/orte.js` hat 28 benannte Orte mit x/y in Prozent, die in **allen vier Epochen**
gelten. Ein Ort darf erscheinen und verschwinden (`ab`/`bis` in Epochennummern), aber er
bewegt sich nie.

```js
BRAUHAUS.orte.setze(el, 'sudhaus', {anker:'mitte', dx:0, dy:6});
BRAUHAUS.orte.da('bahnhof')            // gibt es den Ort in dieser Epoche?
BRAUHAUS.orte.liste(3)                 // alle Orte der Epoche 3
BRAUHAUS.orte.punkt('tor')             // {x,y} in Pixeln, für Wege und Linien
BRAUHAUS.orte.zwischen('tor','strasse', 0.4)   // Punkt auf der Strecke, in Prozent
BRAUHAUS.orte.abstand('tor','muehle')
```

Feste Pixel sind verboten, eigene Koordinaten auch. Alles in Prozent, `--s` ist ein
Bezugspixel (`calc(var(--s) * 24)`), Bezugsformat 2752×1536.

**Achtung:** Ein Element mit `.amort` hängt über `transform` an seinem Ort. Wer `transform`
für eine Bewegung überschreibt, reißt es weg — benutze die eigene Eigenschaft `translate`.
Genau daran ist der WEITER-Knopf beim ersten Playwright-Lauf gescheitert.

`?orte=1` blendet das Ortsverzeichnis als beschriftete Punkte ein.

## Welt — lesen frei, ändern nur über die API

```js
BRAUHAUS.welt.haus            // {name, familie, gegruendet, kasse, rohstoff, ansehen, ...}
BRAUHAUS.welt.zeit            // {jahr, woche, epoche, amtszeit:{nr,name,eigenschaft,...}}
BRAUHAUS.welt.vorrat          // {plaetze, faesser:[{sorte, jahr, woche, haltbar}]}
BRAUHAUS.welt.adressen        // 12 benannte Häuser, jedes mit ort-Schlüssel
BRAUHAUS.welt.gegner          // Adler (ab I) und Konzern (ab IV)
BRAUHAUS.welt.chronik         // append-only
BRAUHAUS.protokoll            // append-only Buchführung

BRAUHAUS.welt.zahle(40, 'Neuer Kessel')       // false, wenn die Kasse nicht reicht
BRAUHAUS.welt.nimm(90, '6 Fass an den Ochsen')
BRAUHAUS.welt.legeEin(sorte, n) / nimmHeraus(n)
BRAUHAUS.welt.binde('lindenhof', 'haus', 'Vertrag', 1358)
BRAUHAUS.welt.schreibe('…', 'art')            // Chronik
BRAUHAUS.welt.protokolliere({wer, was, preis, menge, adresse})
BRAUHAUS.welt.meldeZug('Sud', 30)             // Preis deines nächsten sinnvollen Zuges
```

**Zwei Sperrlisten-Sicherungen — benutze sie, dann kannst du hier nicht durchfallen:**

* `BRAUHAUS.welt.geld(n)` → Währung **des Jahres** (Pfennig · Gulden · Mark ab 1873 ·
  Reichsmark · D-Mark · Euro). Schreibe nie selbst eine Währung ins Bild.
* `BRAUHAUS.welt.menge(fass)` → **Hektoliter erst ab 1872**, vorher Fass. Rechne intern in
  Fass (1 Fass = 150 l).

Weiteres aus `design/PRUEFUNG.md`: offene Braupfanne statt Destillierblase · Emailschilder
erst ab den 1890ern · keine Bahn vor 1835/nicht in 1600 · ein
Marktanteil wird auf die **eigene** Gesamtmenge bezogen.

> **BERICHTIGT am 5. August 2026 — hier stand „kein Hopfen in 1350", und das war
> falsch.** Gemeldet vom blinden Kritiker DER SUD als Widerspruch zwischen zwei
> Vorgabedateien, von der Aufsicht nachgeschlagen und entschieden: **`PRUEFUNG.md`
> verbietet Hopfen in 1350 nirgends.** §1.2 A12 bescheinigt die Hopfendolde für
> **1300–1420** ausdrücklich als richtig — *„Hopfenbier verdrängt Grut im
> 14. Jh."* Diese Zeile hatte eine Regel erfunden und sie der Prüfung in den Mund
> gelegt.
>
> **Was auf dem Spiel stand:** die erste Achse von 1350 heißt *Grut oder Hopfen*.
> Ein Builder, der dieser Zeile gefolgt wäre, hätte eine historisch richtige und
> spielerisch interessante Entscheidung entfernt — und wäre dafür auch noch von
> der Sperrliste gedeckt gewesen.
>
> **Die Lehre gilt über diesen Fall hinaus:** wer hier eine Regel aus
> `PRUEFUNG.md` zitiert, zitiert sie **wörtlich und mit Stelle**. Eine
> zusammengefasste Sperrliste, die nachdichtet, ist gefährlicher als keine.

## Uhr, Würfel, Ereignisse

```js
BRAUHAUS.uhr.naechsteWoche()   // Wochen 1..30, der 30. Klick schließt das Braujahr
BRAUHAUS.uhr.schliesseJahr()   // Michaeli 29.9. bis Georgi 23.4.; der Sommer läuft durch
BRAUHAUS.uhr.datum()           // {tag, monat, jahr, kurz, lang} — alte Monatsnamen in I/II
BRAUHAUS.uhr.springe(12)       // ruhige Jahre werden erzählt, nicht geklickt
BRAUHAUS.auf('woche', fn) / BRAUHAUS.sende('zeichne', {grund:'…'})
BRAUHAUS.wuerfel.zahl() / .ganz(1,6) / .aus(liste) / .trifft(0.3) / .misch(liste)
```

Der Würfel ist **gesät**: `?saat=1350` ergibt dieselbe Partie. Benutze nie `Math.random()` —
sonst kann der Kritiker seine Zählung nicht wiederholen.

Nach jeder Änderung `BRAUHAUS.sende('zeichne', {grund:'…'})`.

## Bedienregel — daran hängt die ganze Spiellatte

Jede Handlung ist über ein echtes `<button>` mit sichtbarem deutschem Text und stabilem
`data-zug` erreichbar. Ziehen mit der Maus darf es zusätzlich geben, **nie als einzigen
Weg**. Sobald Playwright an der Bedienung scheitert, liest der Kritiker Quelltext — und
dann misst der Lauf nur noch Pixel.

```js
fach.appendChild(BRAUHAUS.knopf({
  text: 'Fuhre zum Lindenhof · 0,2 km',   // deutsch, sichtbar
  zug:  'fuhre:fahre:lindenhof',          // stabil, nie umbenennen
  preis: -40,                             // erscheint als Preisschild am Knopf
  ort:  'tor', anker: 'mitte', dy: 6,
  titel: 'Was passiert, wenn ich das tue',
  aus:  false,
  tu:   function () { … }
}));
```

`BRAUHAUS.zuege()` listet in der Konsole alles Bedienbare auf dem Schirm — so zählt der
Kritiker. Was der Kritiker sucht: **Optionen mit Preisschild nebeneinander, die einander
ausschließen · unwiderrufliche Festlegungen · Züge des Gegners, die ohne ihn geschahen ·
je Epoche eine andere Verbliste.** Vier Epochen mit derselben Verbliste sind vier Tapeten.

## Ton

`BRAUHAUS.ton.spiele('sud:kochen', {ort:'kesselstelle'})` — im Skelett ein Nichtstuer, der
nichts lädt. Rufe von Anfang an; die Wiedergabe wird in Welle 2 in `kern/ton.js`
eingehängt, ohne dass eine Stück-Datei angefasst wird.

## URL-Parameter

`?epoche=1..4` · `&jahr=` · `&woche=` · `&saat=` · `&orte=1` · `&blatt=chronik` ·
`&pruefe=1` · `&stumm=1`

## Bevor du fertig meldest

```bash
npx --yes http-server -p 8899 -s . >/dev/null 2>&1 &
node werkbank/schuss.mjs "http://127.0.0.1:8899/spiel/?epoche=3" werkbank/schuss/mein.png 2752 1536
```

Die Ausgabe **muss** „keine Fehler auf der Seite" enthalten — in allen vier Epochen. Kein
Netzzugriff, keine Web-Fonts, keine ES-Module, kein Build-Schritt. Dann das PNG wirklich
ansehen und mit `./werkbank/stand.py` melden.
