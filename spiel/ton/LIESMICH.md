# Der Ton — wie der Hof klingt, und wie man ihn misst

Stück **DER KLANG** (Welle 2). Latte: [`../../gauntlet/MESSLATTE.md`](../../gauntlet/MESSLATTE.md) §3 —
*dreißig Sekunden ohne Bild, ein fremdes Ohr nennt Epoche und Vorgang.*

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
| **Bett** | `klang/bett1..4.mp3` | die **Zeit** — Schalmei · Cembalo · Blaskapelle · E-Bass |
| **Hof** | `klang/hof1..4.mp3` | den **Ort** — Ochse und Gänse · Eisenreifen und Markt · Dampfmaschine · Diesel und Flaschenband |
| **Werk** | die übrigen ~30 Proben | den **Vorgang** — was der Spieler gerade getan hat |

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

Jeder Name, den die vier Stücke der Welle 1 heute rufen, wird bedient. Unbekannte
Namen fangen `NOTFALL` und die Ersatzklänge ab — einen Ruf ins Leere gibt es nicht.

## Zwei Regeln, die aus Rügen des prüfenden Ohres entstanden sind

1. **Kein einziger Oszillator.** Ein Sinus oder ein Rechteck klingt in *jeder* der
   vier Epochen nach 1980. Das Ohr hat die erste Fassung ungefragt als „moderne
   UI-Piepstöne" (1350), „Klicken eines Fotoapparats" (1350), „Reißverschluss"
   (1350) und „Fahrradklingel" (1600) gerügt. Alle Ersatzklänge sind heute
   gefiltertes Rauschen, und die häufigen Zeichen haben eine wirkliche Probe.
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
node werkbank/ohrprobe.mjs                       # vier WAV in werkbank/ohr/
./werkbank/hoerer.py werkbank/ohr/epoche1.wav werkbank/ohr/epoche2.wav \
                     werkbank/ohr/epoche3.wav werkbank/ohr/epoche4.wav --blind
```

`ohrprobe.mjs` **spielt das Spiel**: es klickt dreißig Sekunden lang echte
`<button data-zug>` — WEITER und abwechselnd einen anderen Zug — und ruft danach
`BRAUHAUS.ton.wav(30)`. Der Mitschnitt hält fest, *wann* jeder Ruf kam; daraus
entsteht die Zeitachse der Datei. Er läuft immer mit, auch bei `?stumm=1` und
auch dann, wenn der Browser die Wiedergabe noch nicht freigegeben hat.

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

Alle Proben stammen aus `design/tools/gen_audio.py`. Die Prompts stehen
vollständig in [`../../werkbank/klang-erzeuge.py`](../../werkbank/klang-erzeuge.py);
vorhandene Dateien werden übersprungen.

```bash
./werkbank/klang-erzeuge.py            # was fehlt
./werkbank/klang-erzeuge.py hof3       # nur diese eine
```

Drei Fallen, die dabei schon zugeschnappt sind: `/v1/music` **singt**, wenn man
nicht ausdrücklich instrumental verlangt; `/v1/sound-generation` nimmt höchstens
**450 Zeichen**; und `/v1/music` nimmt für 1350 lange Prompts übel — die erste
Fassung von `bett1` kam als Chiptune zurück, die zweite als Industrielärm. Kurz
und mit Instrumentennamen war die Lösung.
