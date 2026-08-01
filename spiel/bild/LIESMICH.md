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

### Der Boden und der Maßstab (Runde 6)

> **Ein Bild, das keinen Menschen zeigt, hat keinen Maßstab — und wird deshalb
> zu groß.**

Runde 5 ging unter anderem mit diesem Satz zurück: *„DER ZIEHBRUNNEN IST FÜNF
METER BREIT."* Nachgemessen am Bildschirm hatte der Kritiker recht: der Kranz maß
2,4 / 2,9 / 2,5 Körperlängen, und `brunnen` war der einzige Aufbau über drei
Epochen **ohne** `breiten`-Staffelung. Beide Ursachen sind behoben, und zwar in
dieser Reihenfolge:

**`brunnen.png` ist neu** (1928×2041). Im Bild stehen jetzt **zwei Frauen** — eine
am Kranz, eine mit Schulterjoch und zwei Eimern. Sie sind der Maßstab, den man
nicht wegdiskutieren kann: wer nachmessen will, legt das Lineal an die Frau. Dazu
`breiten: {1: 6.5, 2: 5.4, 3: 6.2}`, gestaffelt an den Leuten, die der Kritiker
auf der Bildtiefe des Brunnens gezählt hat (1350: 61 px, 1600: 51, 1884: 58).

Am Bildschirm gemessen, 1350, `?epoche=1`:

| | gemessen | vorher |
|---|---|---|
| Frau am Brunnen | **60 px** | — (es war keine im Bild) |
| Mensch der Platte auf derselben Tiefe | 61 px | 61 px |
| Kranz außen | **105 px = 1,7 Körperlängen ≈ 2,9 m** | 147 px = 2,4 Kl ≈ 4,1 m |

Die Figuren sitzen damit auf dem Pixel; der Kranz ist von 4,1 m auf 2,9 m
gefallen und bleibt **das eine Maß, das noch nicht stimmt** — das Zielbild zeigt
0,9 Körperlängen. Fünf Anläufe mit `gen_image.py` haben den Kranz nicht weiter
verkleinert; wer es besser kann, zeichnet dieses eine Bild neu, ohne sonst etwas
anzufassen.

**`laderampe.png` ist neu** (2076×2076) und aus demselben Grund. Sie war leer, und
der Kritiker hat 1884 blind gegen das Zielbild verloren, weil *„der Hof 1884
menschenleer"* ist, während im Zielbild 03 zwei Männer Fässer rollen. Jetzt rollen
zwei Männer ein Faß auf der Kante über die Bohlen und ein dritter schiebt die
Sackkarre die Treppe herauf. Und weil damit zum ersten Mal ein Maßstab **im** Bild
steht, fällt auf, daß die Rampe fast doppelt zu groß war: bei `breite` 14 wäre der
Mann 87 px hoch geworden, neben Leuten der Platte 1884 von 58. Also **9,4 statt
14** — gemessen 58 px, Rampe rund 7 m lang, was für eine Bahnrampe mit einem Gleis
stimmt.

Damit stehen in **jeder** der vier Epochen Menschen im Hof: 1350 und 1600 die zwei
Brauerinnen, der Küfer und die zwei Frauen am Brunnen; 1884 die zwei Frauen und
die drei Männer an der Rampe; 1970 der Mann mit der Sackkarre am Verladedock und
der Fahrer auf dem Gabelstapler.

### Das Werkzeug dazu

`werkbank/schuss/stadt-r6/freistellen.py` schneidet ein erzeugtes Bild frei —
Weiß raus, eingeschlossene Lücken (zwischen Seil, Schwengel und Pfosten) bleiben
durchsichtig, Rand zwei Reihen leer und acht weich, Kante nachweislich Alpha 0.
`werkbank/schuss/stadt-r6/fuesse.py` mißt danach die 24 Fußpunkte je Bild neu.
**Wer ein Hofbild austauscht, läßt beide laufen** — sonst mißt DAS LOT
(`stuecke/stadt-zusatz.js`) das alte Bild.
