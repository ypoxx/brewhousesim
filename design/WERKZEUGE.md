# Werkzeugkasten für die Designer

Alles hier ist **an der echten API getestet**, nicht aus der Dokumentation abgeschrieben
(`ai.google.dev` ist aus dieser Umgebung gesperrt). Stand 26.07.2026.

---

## 1. Bilder erzeugen

```bash
python3 design/tools/gen_image.py --prompt-file prompt.txt --out design/pfad-1-braubuch/01-epoche1.jpg
```

Wichtige Schalter:

| Schalter | Bedeutung |
|---|---|
| `--prompt-file` | **Immer benutzen.** Lange Prompts über `--prompt` in der Shell zu quoten geht schief. |
| `--out` | Zielpfad. Die Endung wird automatisch korrigiert — die Modelle liefern JPEG. |
| `--model` | Standard `gemini-3-pro-image` (Nano Banana Pro, beste Qualität). `gemini-3.1-flash-image` ist schneller und billiger für Zwischenschritte. |
| `--aspect` | `16:9` für Mockups. **Es gibt kein 16:10.** Erlaubt: 1:1, 1:4, 1:8, 2:3, 3:2, 3:4, 4:1, 4:3, 4:5, 5:4, 8:1, 9:16, 16:9, 21:9 |
| `--resolution` | `2K` für Mockups, `4K` nur fürs Signaturbild. |
| `--ref` | Referenzbild, wiederholbar. **Das ist euer wichtigstes Werkzeug** — siehe Abschnitt 3. |

Der Schlüssel liegt außerhalb des Repos und wird automatisch gefunden. Schreibt ihn
**niemals** in eine Datei im Projektverzeichnis.

Bei 429 wiederholt das Skript selbstständig mit wachsender Wartezeit. Sechs Designer
arbeiten parallel — wenn es hakt, ist das der Grund, nicht euer Prompt.

---

## 2. Die Anti-Schlonz-Technik

Zwei echte Durchläufe zeigen den Unterschied. Erster Versuch, normal formulierter Prompt:
ein erfundener Browser-Fensterrahmen mit URL-Zeile, die Wörter „HISTERWIRES LEDGER" und
„Germache Brewhouse", doppelte Schaltflächen außerhalb des Panels, Fantasy-Anmutung.

Zweiter Versuch, gleiche Bildidee, mit den vier Regeln unten: sauber, lesbar, exakt ein
Rechtschreibfehler im gesamten Bild.

### Regel 1 — Fensterrahmen ausdrücklich verbieten

> Full-bleed in-game screenshot, edge to edge. NO browser window, NO title bar, NO URL bar,
> NO operating system chrome of any kind. The image is only the game itself.

Ohne diesen Satz malt das Modell zuverlässig einen Chrome-Rahmen drumherum.

### Regel 2 — Jede Zeichenkette wörtlich vorgeben

Das ist der große Hebel. Nicht „a table showing production figures", sondern:

```
Render ONLY these German strings, spelled EXACTLY as written, and no other words anywhere:

Title:        BRAUBUCH
Below title:  Anno 1350
Column heads: MONAT | SUD | PREIS | MALZ
Rows:         September  2  14 Pf.  40 Schffl.
Footer left:  Hopfen verboten

Every other area must be blank. No invented words, no lorem ipsum, no repeated buttons.
```

**Umlaute bleiben unzuverlässig.** Im Test wurde aus „SUD" ein „SÜD". Prüft jede
Zeichenkette im fertigen Bild nach und korrigiert per `--ref` (Abschnitt 3). Wenn ein Wort
sich hartnäckig wehrt, wählt ein anderes — das ist ein Mockup, kein Textsatz.

### Regel 3 — Negativliste gegen den KI-Look

> NOT a fantasy painting. No glow, no drop shadows, no bevels, no vignette, no lens flare,
> no depth-of-field blur, no symmetrical ornamental filigree.

Fallstrick 6 aus dem Briefing wird hier gelöst, nicht im Pitch-Text.

### Regel 4 — Palette hart begrenzen

> Palette: parchment cream, iron-gall brown-black, one accent of vermilion. Nothing else.

Drei Farben benennen wirkt stärker als jedes Stilwort. Es erzwingt Grafik statt Malerei —
und es ist zugleich die Antwort auf Fallstrick 2, den durchgehaltenen Stil.

---

## 3. Konsistenz über eine Bildserie — der eigentliche Trick

Eure drei Pflichtbilder müssen wie **ein** Spiel aussehen. Erzeugt sie nicht unabhängig
voneinander.

```bash
# 1. Ankerbild, an dem der Stil festgelegt wird
python3 design/tools/gen_image.py --prompt-file p1.txt --out 01-epoche1.jpg

# 2. und 3. bauen darauf auf
python3 design/tools/gen_image.py --prompt-file p2.txt --ref 01-epoche1.jpg --out 02-epoche4.jpg
python3 design/tools/gen_image.py --prompt-file p3.txt --ref 01-epoche1.jpg --out 03-zahlen.jpg
```

Im Prompt der Folgebilder ausdrücklich sagen, was übernommen wird und was sich ändert:

> Keep the exact visual language of the reference image: same palette, same paper texture,
> same typographic system, same grid, same line weights. Change only the epoch: this is now
> 1970, the operation has forty sites, and the density of information is far higher.

### Was `--ref` kann und was nicht

*Nachträglich korrigiert. Die ursprüngliche Fassung riet pauschal zum Nachbessern — das ist
falsch. Alle sechs Designer haben unabhängig voneinander Erfahrungen damit gemacht, die
sich zunächst widersprachen; aufgelöst sind es vier verschiedene Vorgänge unter einem Namen.*

**Die Regel: `--ref` erhält, was es sieht.**

| Vorgang | Taugt `--ref`? |
|---|---|
| Stil über eine Bildserie halten | **Ja, dafür ist es da.** Der eigentliche Zweck. |
| Flächen, Farben, einzelne Gegenstände ändern | Ja, zuverlässig. |
| Typografie umstellen, Raster umbauen | **Nein.** Das Referenzbild konserviert die Schrift. Neu erzeugen. |
| Kleinschrift korrigieren | **Gefährlich.** Buchstaben werden als Textur gesehen und beim Lauf neu gewürfelt — aus korrekten Spalten wurden „Feisenkeller", „Süllstand", „Sodhaus". |

Daraus folgt auch die Auflösung der Umlautfrage: Umlaute **gelingen bei frischer Erzeugung**
(ein Designer hat ein korrektes „GÄRKELLER" belegt) und sterben im Nachbesserungslauf. Bei
textdichten Bildern also: Prompt korrigieren und neu erzeugen, nicht nachbessern.

Wenn ein Wort sich trotzdem hartnäckig wehrt, wechselt das Wort. Bewährt hat sich, anderes
Deutsch zu wählen statt ASCII-Ersatz — „Rechnungsjahr" statt „Geschäftsjahr", „Eismaschine"
statt „Kühlmaschine".

### Und eine Falle, die keine Prompt-Technik löst

Prüft eure Zahlen **gegeneinander**, nicht nur einzeln. In der Nachprüfung lagen drei von
vier Pfaden, die einen Marktanteil ins Bild schrieben, daneben — weil niemand den
Gesamtmarkt nachgeschlagen hatte. Ein Bild kann in sich stimmig aussehen und trotzdem um
Faktor 4 falsch sein. Wer einen Anteil zeigt, muss das Ganze kennen, auf das er sich
bezieht.

---

## 4. Ergebnisse prüfen

Betrachtet jedes Bild selbst, bevor ihr es abliefert. Pillow ist installiert:

```python
from PIL import Image
im = Image.open("01-epoche1.jpg"); im.thumbnail((1200, 1200)); im.save("_vorschau.jpg")
```

Dann die Vorschau mit dem Read-Werkzeug öffnen und **wirklich hinsehen**. Checkliste:

- [ ] Kein Fensterrahmen, kein Betriebssystem-Zierrat
- [ ] Jede Zeichenkette richtig geschrieben (Umlaute!)
- [ ] Keine erfundenen Wörter, keine doppelten Bedienelemente
- [ ] Zahlen lesbar und plausibel für die Epoche
- [ ] Palette eingehalten
- [ ] Sieht aus wie dasselbe Spiel wie die anderen Bilder des Pfades

Vorschaudateien (`_vorschau*.jpg`) nicht mit abliefern.

---

## 5. Was im Browser wirklich machbar ist

Für eure Asset-Rechnung. Das Spiel baut **eine Person mit KI-Werkzeugen**, kein Studio.

**Billig und dauerhaft wartbar**

- Typografie, Farbflächen, Linien, Raster, CSS-Layout — beliebig viele Zustände, null Assets
- SVG: skaliert verlustfrei, per Code umfärbbar, winzig. Ideal für Karten, Wappen,
  Etiketten, Diagramme, Symbole
- Eine Textur, die gekachelt und eingefärbt wird, statt hundert gemalter Varianten
- CSS-Übergänge und -Animationen; Parallaxe aus zwei bis drei Ebenen
- Prozedural erzeugte Muster (Papierfaser, Rauschen, Kartenschraffur)

**Teuer, aber machbar in Maßen**

- Ein fester Satz gezeichneter Illustrationen mit klarer Obergrenze — etwa 20 bis 40 Stück
  für das ganze Spiel, nicht pro Epoche
- Canvas- oder WebGL-Ansicht für *eine* Hauptansicht, nicht für alle
- Sprite-Atlas mit wenigen, stark wiederverwendeten Teilen

**Projektgefährdend**

- Alles, was sich multipliziert: Objekt × Epoche × Zustand × Blickrichtung
- Isometrische Gebäudesätze mit Ausbaustufen. 30 Gebäude × 4 Epochen × 3 Stufen = 360
  Grafiken, die alle zueinander passen müssen. Das ist der klassische Projektfriedhof.
- Figurenanimation
- Alles, was pro Bild neu von einer KI erzeugt werden muss statt einmalig — zur Laufzeit
  ist das langsam, teuer und sieht bei jedem Aufruf anders aus

**Die entscheidende Frage an euren Pfad:** Erzeugt er viele Zustände aus wenigen Teilen?
Oder braucht er für jeden Zustand ein eigenes Bild? Antwortet im Pitch mit einer Zahl.

---

## 6. Animationen

Nur wenn eure Idee ohne Bewegung nicht zu beurteilen ist.

Praktikabel: drei bis fünf Einzelbilder per `--ref` in Serie erzeugen (Zustand vorher →
nachher) und zu einem GIF zusammensetzen.

```python
from PIL import Image
frames = [Image.open(f"anim-{i}.jpg").convert("P", palette=Image.ADAPTIVE) for i in range(5)]
frames[0].save("animation.gif", save_all=True, append_images=frames[1:],
               duration=500, loop=0)
```

Bedenkt dabei Abschnitt 5: Was ihr zeigt, muss jemand später auch bauen können.
