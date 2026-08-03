# DER KLANG — Urteil des blinden Kritikers (Welle 4)

**URTEIL: BESTEHT MIT AUFLAGE.**

Gemessen am 3. August, blind. Der Prüfer hat den Bericht des Builders
(`werkbank/urteile/welle4-der-klang-bau.md`) nicht gelesen und nicht gesucht; Quelltext nur
für Zugschlüssel, Klassennamen und Dateinamen. Alle Zahlen unten stammen aus eigenen
Aufnahmen aus dem laufenden Spiel, nicht aus abgelegten Dateien.

Belege: `werkbank/schuss/klang-kritik/` (Aufnahmen, Messwerte, drei Ohren, Schlüssel).
Die `.wav` hält die `.gitignore` aus der Historie; `.json`, `.txt` und `.py` bleiben.

---

## Die Latte im Wortlaut

> DREISSIG SEKUNDEN OHNE BILD, EIN FREMDES OHR NENNT EPOCHE UND VORGANG.
> Es muss in jeder der vier Epochen etwas zu hören geben, und es muss sich zwischen ihnen
> hörbar unterscheiden. Was klingt, soll das Spiel sein, nicht Kulisse: die Fuhre, der Sud,
> der Michaelitag, der Gegenzug.

**Epoche: bestanden, 8 von 8.** **Vorgang: teilweise — der Michaelitag ja, der Gegenzug
nein.** **Kulisse: die Epoche wird auch ohne jeden Spielklang erkannt, 3 von 3.**

---

## 1 — Eigene Aufnahme. Entsteht überhaupt Schall?

Abgegriffen wurde am **lebenden Ausgangsknoten** `BRAUHAUS.ton.ausgang()` (in
`spiel/kern/ton.js:830`, = der Kompressor vor `ctx.destination`, angelegt in Zeile 495) mit
einem `ScriptProcessorNode`. **Nicht** über `B.ton.rendere()` / `B.ton.wav()`
(`ton.js:858` / `ton.js:909`) — der Offline-Renderer wurde bewusst gemieden, weil er
beweisen würde, dass sich ein Graph rendern lässt, nicht dass das Spiel klingt.
Aufnahmeskript: `werkbank/schuss/klang-kritik/aufnehmen.mjs`, Klickprotokoll in jeder Messdatei.

Acht eigene Aufnahmen, je **30,00 s**, 44 100 Hz, mono, 16 bit:

| | Epoche 1 | Epoche 2 | Epoche 3 | Epoche 4 |
|---|---|---|---|---|
| `ctx.state` während der Aufnahme | running | running | running | running |
| Pegelproben à 100 ms | 303 | 298 | 294 | 298 |
| davon mit rms = 0 | **0** | **0** | **0** | **0** |
| rms min / median / max (Spur) | 0,0132 / 0,0598 / 0,2624 | 0,0032 / 0,0609 / 0,1976 | 0,0307 / 0,0860 / 0,3428 | 0,0467 / 0,0740 / 0,2382 |
| rms der Datei | 0,0769 | 0,0760 | 0,1097 | 0,0916 |
| Spitze | 0,9893 | 0,6322 | **1,0000** | 0,8056 |
| stille 250-ms-Fenster (von 120) | **0** | **0** | **0** | **0** |
| geklickte Züge in den 30 s | 44 | 45 | 45 | 45 |

Nachgemessen an der Datei mit eigenem Werkzeug
(`werkbank/schuss/klang-kritik/hoere-nach.mjs`, Goertzel über acht Oktavbänder).
**Es klingt, und zwar durchgehend, in allen vier Epochen.**

Hörbarer Unterschied, objektiv: L1-Abstand der Bandprofile
E1↔E2 0,204 · E1↔E3 0,372 · E1↔E4 0,230 · E2↔E3 0,392 · E2↔E4 0,210 · E3↔E4 0,300.
Der Fuhrklang ist je Epoche ein anderer: `fuhre:abfahrt:ochse` (E1), `:pferd` (E2),
`:waggon` (E3), `:lastzug` (E4) — abgelesen an `BRAUHAUS.ton.mitschnitt()`.

**Ein Klipper**: `epoche3.wav` erreicht Vollaussteuerung (1 Probe von 1 323 000).

## 2 — Das fremde Ohr

### Erst das Messgerät prüfen

`werkbank/hoerer.py` wurde **nicht angefasst** (ZUSTÄNDIGKEIT 16). Geprüft wurde es mit
sechs Eingaben gegen `deute()`:

| Eingabe | Ergebnis | richtig? |
|---|---|---|
| abgeschnittenes JSON | Epoche 3 geborgen | ja |
| leere Antwort | `abbruch` → KEINE MESSUNG | ja |
| reine Prosa | `abbruch` → KEINE MESSUNG | ja |
| Liste statt Objekt | Epoche 2 | ja |
| sauberes JSON | Epoche 1 | ja |
| JSON in ```-Rahmen | Epoche 4 | ja |

**Eine fehlgeschlagene Übertragung wird nicht als „durchgefallen" verbucht.** Damit sind die
Zahlen daraus brauchbar. Zwei Restfehler, gemessen, nicht vermutet:

1. **Der Ausstiegscode verwischt beides.** `sys.exit(0 if treffer == gesamt and not unlesbar
   else 3)` — eine unlesbare Antwort liefert 3, denselben Code wie DURCHGEFALLEN. Der Text
   auf dem Schirm ist ehrlich, der Code ist es nicht. Wer nur den Code liest, misst falsch.
2. **Eine Verweigerung wird zur Zahl.** Bei `blind-still/ruhe-drei.wav` antwortete das Modell
   *„Als KI-Sprachmodell kann ich keine Audiodateien hören"* — und `hoerer.py` barg daraus
   **Epoche 1 (sicher 0)**. Mit `--erwartet 2` hätte dort DURCHGEFALLEN gestanden, obwohl
   nichts gemessen wurde. Der Verräter ist `sicher: 0`. Das ist derselbe Fehlerklasse wie das
   abgeschnittene JSON, nur an einer anderen Stelle.
   *Nicht selbst repariert (ZUSTÄNDIGKEIT 16); von Hand aus dem Bildschirmtext gewertet, die
   Antwort mit `sicher 0` als KEINE MESSUNG behandelt.*

### Die Messung selbst

Zwei Durchgänge, zwei unabhängige Mischungen, neutrale Dateinamen, der Schlüssel versiegelt
in `blind/SCHLUESSEL.json` bzw. `blind2/SCHLUESSEL.json` und **erst nach den Antworten
gelesen**. Das Ohr bekommt nur die Tonbytes — `hoerer.py` sendet den Dateinamen nicht mit.

| Durchgang 1 | gehört | wahr | sicher | | Durchgang 2 | gehört | wahr | sicher |
|---|---|---|---|---|---|---|---|---|
| probe-alpha | 4 | 4 ✓ | 100 | | stueck-i | 3 | 3 ✓ | 85 |
| probe-beta | 3 | 3 ✓ | 85 | | stueck-ii | 4 | 4 ✓ | 100 |
| probe-gamma | 1 | 1 ✓ | 85 | | stueck-iii | 1 | 1 ✓ | 95 |
| probe-delta | 2 | 2 ✓ | 95 | | stueck-iv | 2 | 2 ✓ | 95 |

**8 von 8 richtig.** Zufallswahrscheinlichkeit (1/4)⁸ ≈ 1 : 65 500.

Genannter Vorgang (Wortlaut gekürzt): E1 *„Bier über offenem Feuer, Kessel brodelt, Flöte"* ·
E2 *„handwerklich: Holz sägen, Holzkarren, Umfüllen; Cembalo"* · E3 *„dampfbetriebene
Maschinen, Fässer und Flaschen verladen"* · E4 *„LKW/Gabelstapler wird beladen, Radio,
Telefon klingelt"*. Das Ohr benennt **das Gewerbe**, nie den Michaelitag und nie den
Gegenzug beim Namen.

## 3 — Ist es das Spiel oder Kulisse?

### Das eigene zweite Ohr, mit Nullprobe

Neben `hoerer.py` gebaut, nicht hinein: `werkbank/schuss/klang-kritik/ohr-zwei.py`. Menü aus
acht Punkten — vier echte Vorgänge, **vier Blender** (Regen, Hund, Chor, Schiffshorn), die im
Spiel nicht vorkommen. Damit hat die Messung eine eigene Nullprobe.

> Anmerkung zur eigenen Ehrlichkeit: Im ersten Anlauf riss `maxOutputTokens: 4096` genau die
> Nullprobe ab — derselbe Fehler, vor dem `hoerer.py` im Kommentar warnt. Er wurde als
> „KEINE MESSUNG" ausgegeben, nicht als Ergebnis, dann auf 24576 gehoben und die Bergung
> Schlüssel für Schlüssel nachgerüstet. Beide Durchgänge liegen in
> `blind/ohr-zwei-durchgang.txt` und `-durchgang2.txt`.

**Blenderrate: 1 JA in 32 Urteilen** (`blender_hund`, probe-alpha = E4, sek 2) = 3 %.
Das JA dieses Ohrs trägt also Auskunft.

Gespielte Aufnahmen (Wahrheit aus `BRAUHAUS.ton.mitschnitt()`, Sekunde der Aufnahme):

| Vorgang | gehört in | Sekunde des Ohrs | Wahrheit im Mitschnitt |
|---|---|---|---|
| **Michaelitag** | **4 von 4** | 16 / 17 / 16 / 17 | `preis:michaeli` + `preis:muenzen` bei **17,0 s** in allen vier |
| Sud | 4 von 4 | 11 / 15 / 0 / 14 | `sud:anstellen`, `sud:anstich`, `sud:ausschlagen` 11–18 s |
| Fuhre | 2 von 4 (E1, E2) | 6 / 5 | `fuhre:abfahrt:*` bei 7,8 / 8,1 / 8,2 / 8,3 s |
| **Gegenzug** | **0 von 4** | — | E1 `gegner:werben` 26,0 s · E3 `gegner:werben` 26,0 s · E4 `gegner:entreissen` 8,3 s, `gegner:abloesen` 23,3 s, `gegner:binden`/`:unglueck`/`:uebernahme` 26,0 s · E2 in diesen 30 s **gar keiner** |

### Die Gegenprobe, die die Frage entscheidet

Vier weitere Aufnahmen à 30 s, in denen **nichts gespielt wurde** — Ton geweckt, dann Hand
still (`still-epoche1..4.wav`). `BRAUHAUS.ton.mitschnitt()` ist danach **leer**: null
Spielklänge in dreißig Sekunden.

| | E1 | E2 | E3 | E4 |
|---|---|---|---|---|
| rms mit stiller Hand | 0,0719 | 0,0735 | 0,0644 | 0,0684 |
| Anteil am gespielten Lauf | **94 %** | **97 %** | 59 % | 75 % |
| Schwankung rms max/min | ×14,6 | ×6,7 | ×2,9 | **×2,3** |
| `hoerer.py`, blind, auf das Bett allein | **1 ✓** (90) | *Verweigerung, keine Messung* | **3 ✓** (85) | **4 ✓** (100) |
| `ohr-zwei`, Falschtreffer bei stiller Hand | sud (sek 0) | fuhre 3 s, zahltag 8 s, gegner 18 s | keiner | keiner |

**Drei von drei messbaren Betten nennen die Epoche richtig, ohne dass ein einziger
Spielklang darin vorkommt.** Die Epochenunterscheidung, die die Latte fordert, wird also von
der **Kulisse** getragen, nicht von den Vorgängen. In E1 und E2 ist der gespielte Lauf nur
6 % bzw. 3 % lauter als der ungespielte. Vier von sechzehn Vorgangsurteilen am Bett sind
Falschtreffer — der Sud steckt in E1 schon im Bett (Blubbern), Fuhre/Zahltag/Gegner in E2
(Karrenquietschen, Glocke, Hämmern).

### Antwortet der Klang auf den Zug?

`werkbank/schuss/klang-kritik/antwort-epoche*.json`: je Zug Spitzenpegel 400 ms davor gegen
900 ms danach (Hub), dazu der geschriebene Klangname.

| | E1 | E2 | E3 | E4 |
|---|---|---|---|---|
| Züge mit eigenem Klang | 13 | 13 | 13 | 13 |
| Hub-Median | 1,17 | 1,11 | 1,23 | **1,00** |
| Züge mit Hub ≥ 1,2 | 6 | 6 | 8 | **3** |
| Züge mit Hub < 1,0 (kein Ausschlag) | 5 | 4 | 3 | **6** |
| Bett-Schwankung in 8 s Nichtstun | ×8,4 | ×4,5 | ×1,8 | **×1,4** |
| Michaelitag, Hub | 1,62 | 2,32 | 1,23 | **0,87** |

**Epoche 4 ist der Dauerteppich.** Ihr Bett schwankt in acht Sekunden Nichtstun nur um den
Faktor 1,4, der Hub-Median liegt bei 1,00, und sie verschluckt ihren **eigenen Michaelitag**
(Hub 0,87 — der Zahltag ist leiser als das, was ohnehin läuft).

Stumme Züge, gemessen: `stadt:bau:seite` (E2, E3, E4 — kein Klangname), `name:band`
(unklickbar in E2–E4), `gegner:abloesen:lindenhof` (E3) und `gegner:abloesen:hirsch` (E4)
klicken ohne Klang, wenn die Lade nicht trägt.

**Fehler in der eigenen Buchführung des Spiels:** `BRAUHAUS.ton.geraten()` gab in Epoche 4
`{"gegner:uebernahme": 6}` zurück — sechsmal griff der Notfallkasten, weil der Name
`gegner:uebernahme` in den 81 Einträgen von `BRAUHAUS.ton.katalog()` fehlt. Der Name wird in
`spiel/stuecke/gegner.js:417` gebildet: `B.ton.spiele('gegner:' + art, …)`. In E1–E3 war
`geraten()` leer.

## 4 — Stimmt die Epoche?

Drittes eigenes Ohr, `werkbank/schuss/klang-kritik/ohr-drei.py`: das Jahr wird genannt (anders
ist Anachronismus nicht prüfbar), dafür muss das Ohr für **jeden** Klang das früheste
mögliche Jahr angeben — es muss sich festlegen statt zu nicken. Protokoll:
`anachronismen.txt`, `a1.txt`, `a2.txt`.

| Epoche | Sekunde | Klang | frühestens | Befund |
|---|---|---|---|---|
| **3 · 1884** | **0 s, durchgehend (Bett)** | **Ragtime-Klaviermusik** | **1893** | **Anachronismus.** Dreimal unabhängig als „Ragtime" benannt (`ohr-zwei` Durchgang 1 und 2, `ohr-drei`). 1884 liegt vor dem Ragtime. |
| **4 · 1970** | **16 s** | **„digitaler Handy-Klingelton"** | **1990** | **Anachronismus.** Sekunde 16–17 ist im Mitschnitt exakt `preis:michaeli` + `preis:muenzen`. Der Zahltagsklang von 1970 wird als Handyklingeln gehört. |
| 4 · 1970 | 0 s (Bett) | Synth-Pop / Synthwave | 1980 | **strittig.** Zwei andere Durchgänge nannten dieselbe Musik „Pop/Funk" bzw. „jazzig" — das passt in 1970. Nicht als Fund gewertet, aber zu prüfen. |
| 1 · 1350 | 1 s | „Sägen — moderner Stahl-Fuchsschwanz" | 1700 | **Klangfarbe, kein falscher Gegenstand.** Sekunde 2,4/2,8 ist `fuhre:fass-rollen`; das Ohr liest das Fassrollen als Säge. |
| 1 · 1350 | 4 s | „MIDI-Flöte, wohltemperiert" | 1970/1983 | **kein Fund.** Ein Urteil über Syntheseart, nicht über einen Gegenstand — hier ist jeder Klang synthetisch bzw. mp3. |
| 4 · 1970 | 7 s | Rückfahrwarner | 1963 | passt. |
| 2 · 1600 | — | — | — | **sauber.** Kein Klang später als 1600 datiert. |

**Sperrliste: kein Fund.** Das Gefäß von 1350 wurde in allen Durchgängen als offenes Feuer
mit offenem Gefäß gehört („Kessel brodelt über offenem Feuer", „knisterndes Holzfeuer"), nie
als Destillierblase. Kein Emailschild-Klang, kein Marktanteil im Ton.

## 5 — Ist es sonst heil?

- Alle vier Epochen laden: `http://127.0.0.1:8899/spiel/?epoche=1..4&saat=1350` → HTTP 200.
- `BRAUHAUS.lage.length === 0` — **in allen vier Epochen, in 16 Browsersitzungen** (4 Sonden,
  4 gespielte Aufnahmen, 4 stille Aufnahmen, 4 Antwortmessungen).
- **Null** `console.error` und **null** `pageerror` in denselben 16 Sitzungen.
- 43 mp3 unter `spiel/ton/klang/`, alle 43 byteverschieden (md5). Je Epoche werden 22–25
  geholt, alle mit 200/206, **kein einziger fehlgeschlagener Request**.
- **Tote Datei:** `spiel/ton/klang/fabrikpfeife.mp3` wird nirgends in `spiel/` genannt
  (grep über *.js und *.html). 43 Dateien, 42 erreichbar.
- `preis*.js` und `sud*.js` waren während der Messung in fremder Hand; von dort kam kein
  Fehler. `preis:michaeli` und `preis:muenzen` haben in allen vier Epochen ausgelöst.

---

## Auflagen

1. **Der Gegenzug muss hörbar werden.** 0 von 4 — das fremde Ohr hört ihn nicht, obwohl er
   auf drei der vier Bänder steht. Abnahme: `ohr-zwei.py` meldet `gegner` in ≥ 3 von 4
   Aufnahmen mit JA und trifft die Sekunde auf ±2 s, bei unveränderter Blenderrate ≤ 1/16.
2. **Epoche 4 ist ein Dauerteppich.** Bett-Schwankung ×1,4 in acht Sekunden Nichtstun,
   Hub-Median 1,00, der eigene Michaelitag hat Hub 0,87. Abnahme: Bett-Schwankung ≥ ×2,5,
   Michaelitag-Hub ≥ 1,4. (Ansatzpunkt: `hof4.mp3` / `bett4.mp3` senken oder unter Ereignissen
   ducken.)
3. **`gegner:uebernahme` fehlt im Katalog** und fiel sechsmal in den Notfallkasten.
   Abnahme: `BRAUHAUS.ton.geraten()` ist nach zwanzig Wochen in **jeder** Epoche `{}`.
   Die übrigen aus `'gegner:' + art` gebildeten Namen mitprüfen.
4. **Ragtime raus aus 1884** (`bett3.mp3`, durchgehend ab Sekunde 0). Der Stil ist rund neun
   Jahre zu jung; dreimal unabhängig so benannt.
5. **Der Michaeliklang von 1970 wird als Handy-Klingelton gehört** (Sekunde 16/17).
   Ersetzen — der Zahltag ist der einzige Vorgang, der die Latte heute trägt, und
   ausgerechnet er ist in E4 zugleich leiser als das Bett und falsch datiert.
6. **Kopfraum:** `epoche3.wav` erreicht Spitze 1,0000. Der Grenzwert ist einmal berührt.
7. **`spiel/ton/klang/fabrikpfeife.mp3`** anschließen oder löschen.
8. **Nicht die Baustelle des Klangs, aber aktenkundig:** `werkbank/hoerer.py` macht aus einer
   Modell-Verweigerung eine Zahl (Epoche 1, `sicher 0`) und gibt bei „keine Messung"
   denselben Ausstiegscode 3 wie bei „durchgefallen". Beides gehört repariert, **bevor**
   die nächste Runde damit misst — aber nicht mitten im Lauf (ZUSTÄNDIGKEIT 16).

## Sperrliste, im Wortlaut

> Der Braukessel ist eine **offene Pfanne** und keine Destillierblase. Emailschilder gibt es
> erst ab den 1890ern. Ein Marktanteil wird auf die **eigene** Gesamtmenge bezogen.
> Ein Fund dieser Art **disqualifiziert** einen Durchgang, gewinnt ihn aber nie.

**Kein Fund.** Der Durchgang ist nicht disqualifiziert.

---

## Wo man alles nachsieht

| Datei | was darin steht |
|---|---|
| `werkbank/schuss/klang-kritik/epoche{1..4}.wav` | die vier eigenen gespielten Aufnahmen (30 s, live abgegriffen) |
| `werkbank/schuss/klang-kritik/epoche{1..4}-messung.json` | Pegelspur à 100 ms, 250-ms-Fenster, Klickprotokoll, `mitschnitt()`, `geraten()`, `lage` |
| `werkbank/schuss/klang-kritik/still-epoche{1..4}.wav/.json` | die Gegenprobe: 30 s ohne einen einzigen Klick |
| `werkbank/schuss/klang-kritik/antwort-epoche{1..4}.json` | Hub je Zug, Bettspur, Michaelitag, zwanzig Wochen Gegenzug |
| `werkbank/schuss/klang-kritik/blind/`, `blind2/`, `blind-still/` | gemischte Proben, versiegelte Schlüssel, Antworten beider Ohren |
| `werkbank/schuss/klang-kritik/ohr-zwei.py`, `ohr-drei.py` | die beiden eigenen Messgeräte, neben `hoerer.py` gebaut |
| `werkbank/schuss/klang-kritik/anachronismen.txt`, `a1.txt`, `a2.txt` | Klang für Klang mit frühestem Jahr |
| `werkbank/schuss/klang-kritik/aufnehmen.mjs`, `aufnehmen-still.mjs` | Aufnahme am lebenden Ausgang, mit und ohne Spiel |
| `werkbank/schuss/klang-kritik/antwortet.mjs`, `hoere-nach.mjs`, `probe.mjs`, `netz.mjs` | Hub je Zug · Pegel/Spektrum an der Datei · Sonde (lage, Konsole) · mp3-Ladeprüfung |
