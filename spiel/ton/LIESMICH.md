# Der Ton — wie der Hof klingt, und wie man ihn misst

Stück **DER KLANG** (Welle 2, Runde 2 in Welle 4). Latte:
[`../../gauntlet/MESSLATTE.md`](../../gauntlet/MESSLATTE.md) §3 —
*dreißig Sekunden ohne Bild, ein fremdes Ohr nennt Epoche und Vorgang.*

**Stand Welle 4, gemessen:** vier Aufnahmen zu je dreißig Sekunden,
`werkbank/schuss/klang/epoche1..4.wav`, dem blinden Ohr in vier Durchgängen
vorgelegt (drei davon in gemischter Reihenfolge): **4 von 4 richtig**, Sicherheit
95–100 %, und im letzten Durchgang zum ersten Mal in allen vieren *„STÖRT:
nichts"*. Der volle Befund steht in
[`../../werkbank/urteile/welle4-der-klang-bau.md`](../../werkbank/urteile/welle4-der-klang-bau.md).

Die Wiedergabe steht in [`../kern/ton.js`](../kern/ton.js), das der Aufsicht nach
[`../ZUSTAENDIGKEIT.md`](../ZUSTAENDIGKEIT.md) §11 für diese Welle diesem Stück gehört. Die API ist
Zeichen für Zeichen dieselbe geblieben: `melde · spiele · schleife · halt · bett ·
setzeStumm · setzeLaut`. Keine Stück-Datei musste angefasst werden. Neu ist nur,
dass `spiele()` jetzt `true` zurückgibt, wenn wirklich etwas erklungen ist.

Alle Proben liegen in `klang/`. Die vier alten, leeren Stück-Verzeichnisse
(`stadt/`, `fuhre/`, `preis/`, `gegner/`) bleiben frei: der Katalog sitzt an
einer Stelle, weil dieselbe Probe von mehreren Stücken gerufen wird.

## Drei Schichten, und erst zusammen ergeben sie eine Jahreszahl

| Schicht | Dateien | Was sie sagt |
|---|---|---|
| **Bett** | `klang/bett1..4.mp3` | die **Zeit** — Holzflöte · Cembalo · Blaskapelle · Funk |
| **Hof** | `klang/hof1..4.mp3` | den **Ort** — Feuer unter der Pfanne · Küferei und Stall · Dampfmaschine · Diesel |
| **Werk** | die übrigen ~35 Proben | den **Vorgang** — was der Spieler gerade getan hat |

Das Bett trägt die Epoche, und zwar messbar: das blinde Ohr nennt in **jedem**
Durchgang zuerst das Instrument, wenn es 1350 und 1600 unterscheidet. Als `bett2`
einmal versehentlich mit einer Blockflöte zurückkam — demselben Leitinstrument
wie `bett1` —, fiel 1600 sofort durch (*„gehört: Epoche 3"*). **Zwei Epochen mit
einem Leitinstrument sind für ein blindes Ohr eine Epoche.**

Dasselbe Ereignis klingt in jeder Epoche anders — das ist der ganze Punkt:

| Ruf aus einem Stück | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| `sud:pfanne` | Holzfeuer unter der offenen Pfanne | dito, Rührrechen | Dampfventil, Rührwerk | Kreiselpumpe, Relais |
| `fuhre:kauf`, `preis:muenzen` | Münzen auf Holz | Münzen | Münzen | Registrierkasse |
| `fuhre:fass-rollen` | Eichenfass auf Pflaster | dito | dito | Stahlfass auf Beton |
| `tafel:kreide`, `gegner:preis` | Kreide auf Schiefer | Kreide | Kreide | Schreibmaschine |
| `preis:michaeli` | Kirchenglocke | Glocke | Glocke | Telefon |
| `uhr:woche` (WEITER) | Holzklapper | Turmuhr | Dampfpfiff | Stechuhr |
| `fuhre:abfahrt:*` | Ochsengespann | Pferdefuhrwerk | Rangieren am Waggon | Lastzug, Druckluft |
| `sud:anstellen` | Holzfeuer | Holzfeuer | Dampf | Motor |
| `sud:anstich` | Zapfen und Einschenken | dito | dito | Flaschenband |
| `erbe:erbteil` | Kiel im Hausbuch | dito | dito | Registrierkasse |

Jeder Name, den **alle sieben** Stücke rufen, wird bedient — seit Welle 4 auch
DER SUD, DER NAME und DAS ERBE, die nach dieser Datei gebaut wurden und deren
Rufe bis dahin sämtlich im Notfallkasten landeten (jeder Sud-Ruf klang nach der
kochenden Pfanne, jeder Name- und Erbe-Ruf nach Papier). Nachzählbar:

```js
BRAUHAUS.ton.geraten()      // {} heißt: kein Ruf ist im Notfallkasten gelandet
```

In allen vier Aufnahmen der Welle 4 ist diese Rückgabe leer.

## Zwei Regeln, die aus Rügen des prüfenden Ohres entstanden sind

1. **Kein einziger Oszillator.** Ein Sinus oder ein Rechteck klingt in *jeder* der
   vier Epochen nach 1980. Das Ohr hat die erste Fassung ungefragt als „moderne
   UI-Piepstöne" (1350), „Klicken eines Fotoapparats" (1350), „Reißverschluss"
   (1350) und „Fahrradklingel" (1600) gerügt. Alle Ersatzklänge sind heute
   gefiltertes Rauschen, und die häufigen Zeichen haben eine wirkliche Probe.

   **Diese Regel stand seit Welle 2 hier und stimmte bis Welle 4 nicht.** Der
   Tropfen im leeren Keller (`kellerBand()`) war ein von 900 auf 420 Hz
   abfallender Sinus, viermal in einer Sechs-Sekunden-Schleife — und diese
   Schleife läuft ab Michaeli bis zum Ende der Aufnahme, in **allen vier**
   Epochen. Das Ohr hat sie in 1350 *und* in 1884 unabhängig als „mehrfach
   elektronische Pieptöne, wie ein modernes digitales Gerät" gemeldet, in genau
   den beiden Epochen, deren Mischung dünn genug ist, dass man sie hört. Der
   Tropfen ist jetzt Rauschen durch ein zweipoliges Bandpassfilter (Güte 1,2).
   *Eine Regel im Kopf einer Datei ist keine Messung.*
2. **Jede Schleife wird beim Entschlüsseln auf einen festen Effektivwert
   gezogen** (`angleich()`). `hof1` kam mit dem dreifachen Pegel von `hof3` aus
   dem Erzeuger; das Ohr hörte daraufhin in 1350 einen Bauernhof („Flöte und
   Gänse") statt eines Brauhauses, weil die Gänse alles zudeckten.

## Wie man dreißig Sekunden als Datei herausbekommt — ohne ffmpeg

Es gibt hier kein ffmpeg und kein Mikrofon. Das Spiel rendert deshalb **seinen
eigenen Tongraphen** mit `OfflineAudioContext` und reicht fertige WAV-Bytes
heraus. Geprüft wird damit das Spiel und nicht die Dateiablage des Bauers.

```bash
npx --yes http-server -p 8899 -s . >/dev/null 2>&1 &
node werkbank/schuss/klang/aufnahme.mjs          # vier WAV + vier WEBM + pegel.json
./werkbank/hoerer.py werkbank/schuss/klang/epoche1.wav … --blind
```

`aufnahme.mjs` (Welle 4) löst den älteren `werkbank/ohrprobe.mjs` ab. Der Alte
klickte, was gerade dalag; der Neue arbeitet einen **Wunschzettel von Vorgängen**
ab — Fass auf den Wagen, die Fuhre fährt ab, ein Fass anstechen, Rohstoff kaufen,
die Michaelitafel, dem Nachbarn zuvorkommen — und nimmt in jeder Epoche den
Knopf, den diese Epoche dafür hat. Er startet außerdem in **Woche 26**, weil der
Michaelitag auf die 30. Woche fällt und aus Woche 1 in dreißig Sekunden nicht
erreichbar ist: vierzehn Handgriffe tragen fünf Wochen weit, nicht neunundzwanzig.

Er legt drei Dinge ab, und alle drei gehören in einen Bericht:

| | |
|---|---|
| `epocheN.wav` | 30 s, 32 kHz mono — das, was das fremde Ohr bekommt |
| `epocheN.webm` | Mitschnitt vom **lebenden** Ausgang (MediaRecorder, ~240 KB) |
| `pegel.json` | was am lebenden Ausgang wirklich gemessen wurde |

Der WEBM-Mitschnitt und `pegel.json` sind kein Beiwerk. Ein WAV aus dem
Offline-Renderer beweist **nicht**, dass der Browser klingt — er beweist nur,
dass der Renderer rechnet. Deshalb hängt seit Welle 4 ein Analyser am wirklichen
Ausgang (hinter dem Kompressor):

```js
BRAUHAUS.ton.pegel()     // {zustand:'running', rms, spitze, hoechste, lauteste}
BRAUHAUS.ton.ausgang()   // der lebende Knoten — zum Mitschneiden von außen
```

Beide Skripte **spielen das Spiel**: sie klicken echte `<button data-zug>` in
echten Sekundenabständen und rufen danach `BRAUHAUS.ton.wav(30)`. Der Mitschnitt
hält fest, *wann* jeder Ruf kam; daraus entsteht die Zeitachse der Datei. Er
läuft immer mit, auch bei `?stumm=1` und auch dann, wenn der Browser die
Wiedergabe noch nicht freigegeben hat.

Von Hand geht es genauso — in der Konsole des laufenden Spiels:

```js
BRAUHAUS.ton.beginneMitschnitt();     // Uhr auf null
// ... spielen ...
await BRAUHAUS.ton.wav(30);           // Base64 eines WAV, 32 kHz, mono
BRAUHAUS.ton.plan(30);                // was in diesen 30 s klang
```

## Was im Bild passiert

Genau ein Element: der Tonschalter oben links (`stuecke/klang.js`,
`stil/klang.css`), rund 40 von 2752 Bezugspixeln. Unten war kein Platz — dort
liegen in allen vier Epochen BAUHOF und die Reiterleiste, und ein Schalter unter
einem fremden Blatt ist kein Schalter. Mit `?stumm=1` verschwindet er ganz, und
dann wird auch **kein einziges Byte Ton geladen** — Bildschirmfoto-Läufe bleiben
unberührt.

`spiel/index.html` ist eingefroren und hängt `stuecke/klang.js` nicht ein; der
Tonbus hängt sie selbst nach. Fällt das aus, klingt das Spiel trotzdem — es fehlt
dann nur der Schalter.

## Die Proben neu erzeugen

Alle Proben stammen aus `design/tools/gen_audio.py`. Die Prompts der Welle 2
stehen in [`../../werkbank/klang-erzeuge.py`](../../werkbank/klang-erzeuge.py),
die der Welle 4 in
[`../../werkbank/schuss/klang/erzeuge.py`](../../werkbank/schuss/klang/erzeuge.py) —
dort trägt **jede** Zeile den Satz des Ohres, der die alte Probe verurteilt hat.

```bash
./werkbank/schuss/klang/erzeuge.py            # was fehlt
./werkbank/schuss/klang/erzeuge.py hof3       # nur diese eine
./werkbank/schuss/klang/beschreibe.py spiel/ton/klang/hof2.mp3 --jahr 1600
```

`beschreibe.py` ist das Werkzeug, ohne das die Welle-4-Runde nicht stattgefunden
hätte: es legt **eine einzelne Probe** einem fremden Ohr vor, ohne Dateinamen und
ohne Absicht, und fragt, was darin vorkommt, das es im Jahr der Epoche noch nicht
gab. So wurde die Autohupe in `karren.mp3` gefunden — eine Probe, die in 1350,
1600 *und* 1884 lief, jedes Mal wenn der Nachbar um ein Haus warb. Kein Mensch
hat danach gesucht.

**Und die zweite Hälfte davon:** eine Probe kann für sich tadellos sein und in
der Mischung kippen. Die Glocke war einzeln „Glockenschlag, zeitlos, nichts
falsch" — und in den fertigen dreißig Sekunden von 1600 „eine moderne Autohupe
bei 0:03 und 0:26". Deshalb wird beides gemessen: die Probe und die halbe Minute.

Drei Fallen, die dabei schon zugeschnappt sind: `/v1/music` **singt**, wenn man
nicht ausdrücklich instrumental verlangt; `/v1/sound-generation` nimmt höchstens
**450 Zeichen**; und `/v1/music` nimmt für 1350 lange Prompts übel — die erste
Fassung von `bett1` kam als Chiptune zurück, die zweite als Industrielärm. Kurz
und mit Instrumentennamen war die Lösung.
