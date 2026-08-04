# Die Zielbilder

Fünf erzeugte Screens, die als **Messlatte** für den Gauntlet Loop dienen sollen — nicht als
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

## Die fünf Blätter

| Datei | Epoche | Was sich gegenüber dem Vorgänger geändert hat |
|---|---|---|
| `01-1350.jpg` | I — 1350 | Ein Haus, offener Braukessel über offenem Feuer, zwei Brauerinnen, Malzboden auf Stelzen, Ziehbrunnen, Ochsenkarren. Stadtmauer **neu und geschlossen**, **Holzsteg** über den Fluss, kein Schornstein, kein Hopfen. Kasse in Pfennig, Rohstoffzeile heißt **GRUT** |
| `02-1600.jpg` | II — 1600 | Steinbrauhaus mit Darre, Fasslager, Küferei. Stadt füllt die Mauer und wächst hinaus, Kirche bekommt den Spitzhelm, Marktbrunnen, **Steinbogenbrücke** statt Holzsteg, erste Hopfenstangen. Gulden |
| `03-1884.jpg` | III — 1884 | Fabrik: Schornstein, Gärtanks, Eiskeller, Laderampe. Mauer ist Ruine, Stadt darüber hinausgewachsen, **Bahn** ist da, Konkurrenz jenseits des Flusses. Mark |
| `04-1970.jpg` | IV — 1970 | Abfüllhalle, Lastwagen, Gabelstapler, Kastenlager. Wohnblocks, Autos auf Asphalt, Fahrleitung über den Gleisen. **Der Schornstein von 1884 steht noch und raucht nicht mehr.** D-Mark |
| `05-2025.jpg` | die Gegenwart | Sudhaus hinter Glas, Solar auf jedem Dach, Planensattelzüge, Mehrwegkästen, Ladesäulen, Brauereigasthof. Im Ort: Fußgängerzone, Kreisverkehr, Radweg, Mülltonnen — und am Rand der **Verbrauchermarkt mit Parkplatz**. Die Adler-Anlage jenseits des Flusses ist jetzt **größer als unsere**, mit Verteilzentrum und Glasbau. Windräder und Solarfeld auf dem Kamm. Euro |

Durchlaufend in allen fünf Bildern: der Fluss von rechts, die Brücke an derselben Stelle,
die Kirche, die Hügelkette, die Kameraposition, die Kopfleiste, die WEITER-Tafel.

## Das fünfte Blatt entscheidet nichts

`05-2025.jpg` ist **keine beschlossene fünfte Epoche.** Es gehört zu Frage (G) in
[`../gauntlet/EPOCHENBOGEN.md`](../gauntlet/EPOCHENBOGEN.md) und macht sie prüfbar: Epoche IV
beansprucht 1914–2025, hat aber das Schaujahr 1970, und eine Partie trägt 3–14 Braujahre —
**kein Spielstand erreicht je ein Jahr nach ~1984.** Ob daraus eine eigene Zeit wird, ob
Epoche IV geteilt wird oder ob es beim Bestehenden bleibt, entscheidet der Auftraggeber, und
gebaut wird es von einem Builder mit blindem Kritiker. Das Blatt zeigt nur, wogegen dann
gemessen würde.

### Abweichung vom Verfahren, mit Absicht

Die drei anderen Blätter wurden per `--ref 03-1884.jpg` vom Stilanker abgeleitet. `05-2025.jpg`
ist **von `04-1970.jpg` abgeleitet**, denn die Gegenwart schreibt 1970 fort und nicht 1884:
Mauerfragment, Betonbrücke und Wohnblocks stehen dort bereits, und der erste Wurf gegen den
1884er Anker hat sie prompt verloren — er baute die **Stadtmauer wieder geschlossen auf**.
Genau der Anachronismus, der schon das erste 1600er Blatt unbrauchbar machte, nur rückwärts.

Drei Durchgänge, verzeichnet, damit niemand sie wiederholt:

| Wurf | Referenz | Was fehlte |
|---|---|---|
| 1 | `03-1884.jpg` | Stadtmauer wieder geschlossen; kein Verbrauchermarkt; keine Autos, kein Asphalt; „GEGR. **3285**" auf dem Brauereischild |
| 2 | `04-1970.jpg` | Mauer, Asphalt, Autos, Kreisverkehr richtig — aber der Verbrauchermarkt fehlte weiter, und die Autos waren Käfer und Achtzigerjahre-Limousinen |
| 3 | Wurf 2 selbst, gezielte Nachbesserung | angenommen |

### Zwei Beschriftungen, die der dritte Wurf gekostet hat

Der Nachbesserungsschritt hat zwei Schilder zerwürfelt — der `--ref`-Effekt aus
[`../design/PRUEFUNG.md`](../design/PRUEFUNG.md) §4.1, derselbe wie beim ersten Satz:

- Auf der Kirche steht **„CU NEHKER" statt „ST. MICHAEL"**.
- **„BRAUEREI ADLER" ist ganz verschwunden**, als die Anlage vergrößert wurde.

Beide bleiben stehen. Ein vierter Wurf würde sie treffen können — aber er setzt auch alles
aufs Spiel, was korrekt ist: die ganze Kopfleiste, `GASTHOF LINDENHOF`, `BAHNHOF`, `MARKT`,
`BRAUHAUS ZUM ANKER` und die WEITER-Tafel. Dieselbe Abwägung steht oben schon bei
„GEGR. 1356" im 1884er Blatt, und dieselbe Begründung trägt: im gebauten Spiel ist Text
echter, vom Programm gesetzter Text. Ein Sachfehler in der Latte kostet mehr als ein
Buchstabenfehler — deshalb wurde gegen den Sachfehler dreimal gewürfelt und gegen den
Buchstabenfehler gar nicht.

### Die Zahlen in der Kopfleiste sind Anschauung, nicht Spezifikation

Beim Anlegen des fünften Blatts nachgeprüft und hier festgehalten, weil es sonst jemand für
eine Vorgabe hält: die HUD-Zahlen der Zielbilder stimmen **nur bei zwei von vier** mit den
Startwerten in `kern/welt.js:140` überein.

| Blatt | im Bild | im Spiel |
|---|---|---|
| 1350 | 112 Pf · Grut 40 | 112 · 40 ✓ |
| 1600 | 3.400 fl · Hopfen 620 | 640 · 65 ✗ |
| 1884 | 14.250 M · Hopfen 120 | 14.250 · 120 ✓ |
| 1970 | 1.240.000 DM · Hopfen 96.000 | 86.000 · 340 ✗ |
| 2025 | 480.000 EUR · Hopfen 12.400 | — es gibt keine fünfte Epoche |

Die beiden abweichenden sind genau die zwei, die neu erzeugt wurden. Die Zahlen im 2025er
Blatt sind entsprechend frei gewählt und plausibel für eine Regionalbrauerei — sie sind
**kein** Vorschlag für Startwerte.

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
16:9, 2K. Das Ankerbild ohne `--ref`, die drei anderen mit `--ref 03-1884.jpg`, das 2025er
mit `--ref 04-1970.jpg` und einem dritten, gezielten Nachbesserungsschritt gegen sich selbst
(Begründung oben). In `prompts/2025.txt` liegt der Prompt des **zweiten** Wurfs; der
Nachbesserungsschritt bestand aus drei nummerierten Änderungen und einem „Change nothing
else", die im Abschnitt darüber wörtlich benannt sind.
