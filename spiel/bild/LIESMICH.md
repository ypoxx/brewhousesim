# spiel/bild/

Gehört **DIE STADT**. Alles hier ist in diesem Lauf mit
[`design/tools/gen_image.py`](../../design/tools/gen_image.py) erzeugt
(`gemini-3-pro-image`). Externe Bildarchive sind gesperrt.

## Die vier Platten

`platte-1350.jpg` · `platte-1600.jpg` · `platte-1884.jpg` · `platte-1970.jpg`
— je 2752×1536 (16:9, 2K), derselbe Ort, dieselbe Kamera, 620 Jahre auseinander.

`platte-1884.jpg` ist der Anker: erzeugt mit `--ref zielbild/03-1884.jpg`, damit Stil,
Dichte und Lage der Wahrzeichen stimmen. Die anderen drei sind daraus abgeleitet
(`--ref spiel/bild/platte-1884.jpg`).

Zwei Dinge unterscheiden sie von den Zielbildern, und zwar mit Absicht:

1. **Keine eingebrannte Schrift, keine Kopfleiste, keine WEITER-Tafel.** Im gebauten
   Spiel ist Text echter Text — `stuecke/stadt.js` setzt Hausschild und Ortsnamen als
   HTML, `kern/kopf.js` die Kopfleiste mit den Zahlen aus `welt.js`. Deshalb zerfällt
   hier nichts zu Buchstabensuppe.
2. **Der Hof ist leer.** Auf der Platte stehen nur die Hofmauer mit Tor und das
   Brauhaus selbst. Alles andere im Hof wird gekauft und liegt in `hof/`.

Die in `zielbild/README.md` verzeichneten Fehler der Messlatte sind **nicht**
nachgebaut: 1600 hat keine Bahnlinie und keinen Schornstein, 1970 hat von der
Stadtmauer nur noch einen Turm mit Mauerstumpf in einer Grünanlage.

## `hof/` — die Aufbauten

32 freigestellte PNG mit Alpha. Erzeugt als 2×2-Bögen auf reinem Magenta
(`--aspect 1:1 --resolution 2K`, `--ref spiel/bild/platte-1884.jpg`, damit Strich,
Palette und Blickwinkel zur Platte passen), dann freigestellt: Flutfüllung vom Rand,
weiche Kante, Entfärben des Magentasaums, nur zusammenhängende Teile behalten.

Jedes Bild steht an einem Ort aus `kern/orte.js` (Tabelle in
`stuecke/stadt-daten.js`) und erscheint nur, wenn es **bezahlt** wurde:

    ?epoche=3            der Hof, wie ihn die Vorfahren hinterliessen
    ?epoche=3&bau=keine  derselbe Spielstand, kein einziger Kauf — der Hof ist leer
    ?epoche=3&bau=alle   alles gebaut

`rauch.png` liegt nur in Epoche III über dem Schornstein. 1970 steht derselbe
Schornstein noch und raucht nicht mehr.

Die drei anderen Stücke legen ihr Material unter `fuhre/`, `preis/`, `gegner/` ab.
