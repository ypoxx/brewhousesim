# Die Zielbilder

Vier erzeugte Screens, die als **Messlatte** für den Gauntlet Loop dienen sollen — nicht als
Konzeptkunst, sondern als Bildschirmfotos eines Spiels, das es noch nicht gibt.

Sie stehen an derselben Stelle im Verfahren, an der bei Shumers *Claude of Duty* echte
Call-of-Duty-Screenshots standen: Der gebaute Renderer wird gegen sie gehalten, blind und
nebeneinander, und solange das Zielbild gewinnt, geht die Arbeit zurück an den Builder.

## Herkunft

Der Auftraggeber hatte eine farbige, illustrierte Stadtansicht mit HUD-Leiste vor Augen —
nicht den gestochenen Pfad 2 aus `../design/pfad-2-vogelschau/`. Diese vier Bilder
rekonstruieren dieses Zielbild und dehnen es über alle vier Epochen.

`03-1884.jpg` entstand zuerst und frei; die drei anderen wurden per `--ref` daraus
abgeleitet, damit Kamera, Stil und **Ort** identisch bleiben.

## Die vier Blätter

| Datei | Epoche | Was sich gegenüber dem Vorgänger geändert hat |
|---|---|---|
| `01-1350.jpg` | I — 1350 | Ein Haus, offener Braukessel über offenem Feuer, zwei Brauerinnen, Malzboden auf Stelzen, Ziehbrunnen, Ochsenkarren. Stadtmauer **neu und geschlossen**, **Holzsteg** über den Fluss, kein Schornstein, kein Hopfen. Kasse in Pfennig, Rohstoffzeile heißt **GRUT** |
| `02-1600.jpg` | II — 1600 | Steinbrauhaus mit Darre, Fasslager, Küferei. Stadt füllt die Mauer und wächst hinaus, Kirche bekommt den Spitzhelm, Marktbrunnen, **Steinbogenbrücke** statt Holzsteg, erste Hopfenstangen. Gulden |
| `03-1884.jpg` | III — 1884 | Fabrik: Schornstein, Gärtanks, Eiskeller, Laderampe. Mauer ist Ruine, Stadt darüber hinausgewachsen, **Bahn** ist da, Konkurrenz jenseits des Flusses. Mark |
| `04-1970.jpg` | IV — 1970 | Abfüllhalle, Lastwagen, Gabelstapler, Kastenlager. Wohnblocks, Autos auf Asphalt, Fahrleitung über den Gleisen. **Der Schornstein von 1884 steht noch und raucht nicht mehr.** D-Mark |

Durchlaufend in allen vier Bildern: der Fluss von rechts, die Brücke an derselben Stelle,
die Kirche, die Hügelkette, die Kameraposition, die Kopfleiste, die WEITER-Tafel.

## Bekannte Fehler

Sie sind hier verzeichnet, damit niemand sie für Absicht hält.

| Bild | Fund |
|---|---|
| `02-1600.jpg` | „ST. MICHAEL" ist zu **„KT MONMEE"** zerfallen, „GASTHOF LINDENHOF" zu **„CASTUNE LINDKNHOF"**. Zusätzlich hat der Lauf die **Bahnlinie** aus dem Ankerbild mitgeschleppt — 1600 ein klarer Anachronismus |
| `04-1970.jpg` | Dieselben zwei Beschriftungen, hier **„TE JASMHCI"** und **„GASTONE LINDKNHOF"**. Die Stadtmauer im Hintergrund ist noch vollständig, statt Fragment zu sein |
| `03-1884.jpg` | „GEGR. 1356" statt 1350 |
| `02-1600.jpg` | „GCNG. 1385" statt „GEGR. 1350" |

Alle Textfunde haben dieselbe Ursache, und sie steht bereits in
[`../design/PRUEFUNG.md`](../design/PRUEFUNG.md) §4.1: **`--ref` sieht Kleinschrift nur als
Textur und würfelt sie neu**, auch die Buchstaben, die vorher richtig waren. Wer das
reparieren will, erzeugt frisch mit korrigiertem Prompt statt nachzubessern.

**Für die Messlatte sind diese Fehler unerheblich.** Im gebauten Spiel ist Text echter Text,
vom Programm gesetzt. Gemessen werden Stil, Dichte, Stimmung und Aufbau — nicht die
gezeichneten Buchstaben.

## Reproduzieren

Die vollständigen Prompts liegen in [`prompts/`](prompts/). Erzeugt mit
[`../design/tools/gen_image.py`](../design/tools/gen_image.py), Modell `gemini-3-pro-image`,
16:9, 2K. Das Ankerbild ohne `--ref`, die drei anderen mit `--ref 03-1884.jpg`.
