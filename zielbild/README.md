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

## Fehler und was daraus wurde

Der erste Satz hatte in 1600 und 1970 dieselben zerfallenen Beschriftungen — aus
„ST. MICHAEL" wurde „KT MONMEE" bzw. „TE JASMHCI", aus „GASTHOF LINDENHOF" wurde
„CASTUNE LINDKNHOF". Ursache steht in
[`../design/PRUEFUNG.md`](../design/PRUEFUNG.md) §4.1: **`--ref` sieht Kleinschrift nur als
Textur und würfelt sie neu**, auch die Buchstaben, die vorher richtig waren.

Textfehler allein hätten die Latte nicht beschädigt — im gebauten Spiel ist Text echter,
vom Programm gesetzter Text. **Ein Fund war aber gefährlich:** Das 1600er Blatt hatte die
**Bahnlinie** aus dem Ankerbild geerbt. Eine Latte, die selbst einen Anachronismus enthält,
verleitet den Builder dazu, ihn nachzubauen — und lässt ihn dann an der Sperrliste
scheitern. Ein Fehler in der Messlatte kostet mehr als einer im Gebauten.

Deshalb wurden `02-1600.jpg` und `04-1970.jpg` neu erzeugt, mit ausdrücklichem Verbot der
Bahn für 1600 und wörtlich vorgegebenen Beschriftungen. Beide sind jetzt sauber; 1970 zeigt
zusätzlich die Stadtmauer korrekt als **Fragment in einer kleinen Grünanlage** statt als
geschlossenen Ring.

Offen geblieben ist eine Kleinigkeit in `03-1884.jpg`: dort steht **„GEGR. 1356" statt
1350**. Das Bild ist der Stilanker, aus dem alle anderen abgeleitet wurden — es neu zu
würfeln hieße, den ganzen Satz neu zu würfeln. Die Jahreszahl trägt keine Spielinformation.
Sie bleibt stehen und ist hier verzeichnet, damit niemand sie für Absicht hält.

## Reproduzieren

Die vollständigen Prompts liegen in [`prompts/`](prompts/). Erzeugt mit
[`../design/tools/gen_image.py`](../design/tools/gen_image.py), Modell `gemini-3-pro-image`,
16:9, 2K. Das Ankerbild ohne `--ref`, die drei anderen mit `--ref 03-1884.jpg`.
