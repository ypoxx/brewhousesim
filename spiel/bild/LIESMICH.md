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

### `hof/fracht_*` und `hof/tor_*` — die Hoffracht (Welle 8)

> **Ein Hof ohne Fracht sieht aus, als arbeite dort niemand.**

Der Blindvergleich vom 5. August fand in **allen vier** Epochen dasselbe, auch
bei voll ausgebautem Hof: *„Die vordere Hälfte des ummauerten Hofes bleibt
leer … Im Zielbild arbeiten in jedem Blatt drei bis fünf Leute im Hof, im
Spiel sind es zwei."* Und er sagte gleich dazu, was **nicht** hilft: weitere
Bauten. Der Hof ist eine Raute mit Scheitel (29,9|78,5) und trägt vorn nur
zwischen x 26 und x 34 — dort passt kein Haus mehr, aber flache Dinge auf dem
Boden schon.

Zwölf neue Dateien, aus **drei 2×2-Bögen** erzeugt (`--aspect 1:1
--resolution 2K`, `--ref` auf die eigene Platte der passenden Epoche), Grund
**reines Magenta** statt Weiß:

| Bogen | Referenz | woraus geschnitten |
|---|---|---|
| `alt` | `platte-1600.jpg` | `fracht_faesser_alt` · `fracht_leute_alt` · `fracht_karre_alt` · `fracht_bank` |
| `neu` | `platte-1884.jpg` | `fracht_faesser_neu` · `fracht_leute_neu` · `fracht_karre_neu` · `fracht_kasten` |
| `tor` | `platte-1600.jpg` | `tor_gespann_alt` · `tor_gespann_neu` · `tor_ochse` · `tor_lkw` |

**Warum Magenta und nicht Weiß:** im Hof kommen brauner Holzton *und weiße
Leinenhemden* vor. Der Weiß-Schlüssel von `stadt-r6/freistellen.py` hätte die
Hemden aufgefressen. Das Maß ist `m = min(r,b) − g` — für reines Magenta 255,
für Braun −40, für Haut −30, für Grau 0.

**Warum ein neues Werkzeug:** `freistellen.py` läuft auf dieser Maschine nicht
mehr, weder `numpy` noch `PIL` noch `scipy` sind installiert (geprüft). Das
Schneiden, Freistellen, Beschneiden und WebP-Schreiben macht deshalb
`werkbank/schuss/stadt-w8/schneiden.mjs` im Canvas von Chromium — derselbe
Weg, den `stadt-gewicht/umpacken.mjs` seit Welle 7 geht.

**Die Fugennaht-Regel gilt weiter:** äußerste zwei Reihen ganz leer, die
nächsten acht weich anlaufend, Kante nachweislich Alpha 0.

**Kein Eintrag in `K.fuesse` und `K.bildmass`.** Die beiden Tabellen gehören
den *Aufbauten* und dem LOT. Die Frachtbilder sind auf den Kasten ihrer
deckenden Pixel beschnitten, ihr Fuß liegt bis auf den Fugenrand auf der
Unterkante — `stadt.js:frachtbild()` rechnet den z-Index deshalb direkt aus
der Stelle. Wer ein Frachtbild austauscht, muss also **weder `fuesse.py` noch
`profile.py`** laufen lassen; wer ein *Aufbau*-Bild austauscht, weiter beide.

**Das Gewicht:** zwölf Dateien, zusammen 640 KB (Güte 0,78). In der schwersten
Epoche (1600) laden davon vier mit 203 KB; sie steht damit bei 7,63 MB gegen
eine Obergrenze von 8. `fracht_bank` liegt nur in 1350, weil das Zielblatt
1600 vorn keine Bank trägt und 1600 die Epoche am Veto ist.

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

### Die Tiefe, der Schatten und zwei neue Bilder (Runde 7)

> **Ein Bild traegt nicht nur, was darauf ist, sondern auch, wo sein Fuss
> liegt — und wie gross ein Bierkasten darin ist.**

Runde 6 ging mit zwei Saetzen zurueck, beide nachmessbar.

**1 — `pferdestall.png` hatte 17,1 % leeren Rand unten**, jede andere der 32
Dateien hoechstens 2,1. Der Stall malte deshalb bei 64,1 % Buehnenhoehe und
trug den z-Index seiner Rahmenunterkante (68,0 %) — in 1884 lagen dadurch
47 % der Gaertanks unter einem Stall, der zwei Meter hinter ihnen steht.

Die Ursache war kein Zeichenfehler, sondern **ein Staubkorn**: einzelne Pixel
mit Alpha 1..12 bei y = 748..768, unsichtbar, aber gross genug, dass die
Freistellung den Rahmen bis zum unteren Bildrand aufgezogen hat. Geschnitten
mit `werkbank/schuss/stadt-r7/staub.py`: **772x779 -> 790x669**, kein
einziges deckendes Pixel verloren (337.158 vorher wie nachher).

Und damit derselbe Fall nicht wiederkommt, kommt der z-Index jetzt aus dem
**Fussprofil** statt aus dem Ort (`stuecke/stadt.js`, DIE TIEFE). Dafuer
steht neben `K.fuesse` neu `K.bildmass` in `stuecke/stadt-daten.js` — die
natuerliche Groesse jeder Hofdatei. **Wer ein Bild austauscht, laesst
`werkbank/schuss/stadt-r7/profile.py` laufen; es schreibt beide Bloecke.**

**2 — `kastenlager.png` war eine Riesen-Kistenwand.** Der Kritiker hat es
neben dem Arbeiter (55 px = 1,70 m) nachgemessen: ein Bierkasten mass
0,78 x 2,08 m, der Fuenferstapel las sich als 3,90 m hohe Wand. Ein Bierkasten
ist 0,40 x 0,30 x 0,30 m. Das alte Bild hatte keinen Menschen darin, also auch
kein Mass — dieselbe Ursache wie beim Ziehbrunnen der Runde 6.

Das neue Bild (790x449) zeigt **neun Palettenstapel und zwei Arbeiter**, einer
traegt einen Kasten, einer setzt einen ab. Jeder Stapel ist fuenf Kaesten hoch
und reicht dem Mann an die Schulter — die Probe, die man mit blossem Auge
machen kann. Bei `breite` 8,3 misst der Mann 55 px.

**`verladedock.png` ist aus demselben Grund neu** (700x427). Das fremde Auge
sagte "schwebende LKW", "der LKW steckt in der Rampe", "in der Luft haengende
Laderampe" — alle drei zeigen auf dieselbe Ursache: **das Bild trug seinen
eigenen Boden mit**, eine Betonplatte mit sichtbarer Kante, und der vordere
Wagen ragte darueber hinaus. Zwei Bodenflaechen uebereinander ergeben genau
den Eindruck einer Platte, die in der Luft haengt. Das neue Bild hat keinen
Boden: zwei Lastwagen, alle Raeder auf **einer** Bodenlinie, zwei Arbeiter,
einer mit der Sackkarre. Der Boden darunter ist der Hof. `breite` 15,5 -> 8,8;
das waren 13 Meter Bildbreite fuer zwei Sechsmeterwagen.

> **Regel fuer jedes neue Hofbild: kein eigener Boden, kein Sockel, keine
> Schattenplatte. Der Boden gehoert der Platte.**

**3 — `platte-1970.jpg` ist neu**, mit `--ref` auf sich selbst und der
Auflage, jedes Gebaeude auf den Pixel stehen zu lassen. Behoben sind die vier
Stellen, die das fremde Auge in vier Blindlaeufen benannt hat: die weissen
**Parkplatzmarkierungen im Fabrikhof** (ein Brauereihof ist kein Parkplatz),
die **Bruecke unten rechts**, ueber die der Fluss zu laufen schien, die
**Bahn**, die in der Landschaft verschmolz, und die **verschmolzenen
Hintergrundhaeuser**. Die Ortstreue ist danach nachgemessen, nicht geglaubt
(`werkbank/schuss/stadt-r7/ortstreue.py`): der Turm von St. Michael hat in
Zeile y=470 dieselben dunklen Kanten wie vorher (1488, 1491, 1497, 1511,
1522, 1525, 1533, 1536, 1543, 1546, 1554, 1561, 1578, ... 1696, 1700, 1705),
die Mauerkrone bei x=830 liegt weiter auf y=1197/1201/1224, und die
Flussbiegung ist Kante fuer Kante dieselbe. Die Gegenprobe im Spiel: mit
`?boden=1` liegt die gezeichnete Mauerlinie auch auf der neuen Platte auf der
Mauerkrone und der Torkasten auf der Einfahrt.

**4 — Der Schatten lag auf der falschen Seite.** Er war da (`stil/stadt.css`),
aber er fiel 3 nach **rechts** und 6 nach unten. Auf allen vier Platten steht
die Sonne rechts — nachgemessen an Dingen, die niemand gebaut hat: der
Mauerturm im Park von 1970 wirft nach links, die Baeume daneben werfen nach
links, die Bank unter dem Baum wirft nach links. Jetzt zwei Schatten nach
links unten: ein kurzer, dunkler bindet den Fuss an den Boden, ein langer,
weicher setzt das Gebaeude in dieselbe Sonne wie die Platte.

### Das Werkzeug dazu (Runde 7)

| Datei | was sie tut |
|---|---|
| `werkbank/schuss/stadt-r7/weissen.py` | JPEG-Weiss auf reines Weiss schnappen, **vor** dem Freistellen — sonst haelt `freistellen.py` das ganze Blatt fuer Objekt |
| `werkbank/schuss/stadt-r7/staub.py` | Alphakoerner entfernen und neu auf die Umrandung schneiden |
| `werkbank/schuss/stadt-r7/profile.py` | `fuesse` **und** `bildmass` fuer `stadt-daten.js` |
| `werkbank/schuss/stadt-r7/pruefe.mjs` | Boden, Reihenfolge und pixelgenaue Deckung je Epoche, aus dem laufenden Spiel |
| `werkbank/schuss/stadt-r7/ortstreue.py` | bleibt der Ort derselbe, wenn eine Platte neu gezeichnet wird |
| `werkbank/schuss/stadt-r7/abnahme.mjs` | 36 Ladefaelle, 19 Bauhof-Kaeufe mit echten Mausklicks, 320 gespielte Wochen |
