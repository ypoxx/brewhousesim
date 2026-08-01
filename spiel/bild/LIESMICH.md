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

### Der Maßstab (Runde 3)

> **Wer Figuren zeigt, wird an den Figuren der Platte gemessen.**

`pfanne.png` ist in Runde 3 neu erzeugt worden, weil der Kritiker es
nachgemessen hat: die zwei Brauerinnen waren rund 300 px hoch neben einer Magd
von 73 px, und die Pfanne maß zweieinhalb Körperlängen — ein Sudkessel von fünf
Metern im Jahr 1350. Das neue Bild (900×428) zeigt die ganze **Braustelle**:
Maischbottich, offene Pfanne über offenem Feuer auf einem kniehohen Steinring,
Kühlschiff, Holzstoß, zwei Brauerinnen. Es ist so gezeichnet, dass die Pfanne
**drei Viertel einer Körperlänge** breit ist (rund 1,3 m), und es wird so
gestellt, dass die Brauerin genau so groß ist wie die Leute auf der Platte:

| | Brauerin im Bild | Mensch auf der Platte daneben |
|---|---|---|
| 1350, `breite` 8.9 | **78 px** | Magd am Tor 72 px · Mann im Hof 82 px |
| 1600, `breite` 7.0 | **62 px** | die zwei Geher im Hof 58 und 62 px |

Die 1600er Breite ist in Runde 4 von 6.6 auf 7.0 gewachsen, weil die Braustelle
dort einen Schritt nach vorn auf den freien Hofboden gerückt ist: sie stand unter
dem Dach der Roßmühle und war auf 4.410 Pixel zusammengeschrumpft. Wer 70 px
näher an die Kamera rückt, wird größer, sonst schrumpft er zweimal.

Gemessen wird an einem 2752×1536-Schuss, nicht geschätzt. Dieselbe Regel gilt
für `kueferei.png`: der Küfer maß bei `breite` 14 volle 113 px und mißt bei
9.9 / 8.2 jetzt 80 / 66 px. Alle übrigen dreißig Aufbauten zeigen keinen
Menschen und bleiben unverändert.

Weil die vier Platten nicht auf den Pixel gleich groß gezeichnet sind, dürfen
Breite und Versatz je Epoche gestaffelt werden — `breiten: {1:…, 2:…}` und
`versatz: {2:{dx,dy}}` in `stuecke/stadt-daten.js`.

### Der freigestellte Rand (Runde 4)

> **Kein Hofteil darf am Bildrand abgeschnitten sein.**

Der Kritiker hat die Ränder aller 32 Dateien vermessen. `keller_gewoelbe.png` war
die einzige mit einer **zu 97 % undurchsichtigen linken Randspalte** — der
Erdhügel lief am Rahmen glatt aus dem Bild, und im Schuss 1350 stand daneben eine
schnurgerade senkrechte Naht von 240 px: 224 von 241 Zeilen mit einem Farbsprung
über 30, links Hofboden, rechts Wiesengrün.

Das Bild ist deshalb **neu erzeugt** (`--ref spiel/bild/platte-1600.jpg`, Prompt:
freistehender Hügel, beide Grasflanken laufen *innerhalb* des Rahmens zu Boden,
kein Sockel, kein Schatten, reines Magenta ringsum), dann mit derselben
Freistellung wie die anderen 31 geschnitten. Ergebnis 780×462, und alle vier
Ränder messen **0,00** undurchsichtig.

Die Randwerte der übrigen Dateien bleiben, wie sie waren — `fasslager_stein`
links 0,46, `abfuellhalle` rechts 0,40, `hopfenlager` oben 0,35. Das sind
Flächen, die im Spiel hinter anderen Bauten oder unter der Werkbank liegen; sie
erzeugen keine Naht auf freiem Hofboden. Wer eine davon nach vorn stellt, stellt
sie vorher frei.

Die drei anderen Stücke legen ihr Material unter `fuhre/`, `preis/`, `gegner/` ab.
