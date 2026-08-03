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

## Vier Schichten, und nur drei davon laufen ohne Zutun nicht

| Schicht | Dateien | Was sie sagt | läuft |
|---|---|---|---|
| **Grund** | `klang/grund.mp3` — **eine Datei für alle vier Epochen** | daß hier ein Hof ist, und sonst **nichts** | immer |
| **Bett** | `klang/bett1..4.mp3` | die **Zeit** — Blockflöte · Laute · Blaskapelle · Funk | nur bei Arbeit |
| **Hof** | `klang/hof1..4.mp3` | den **Ort** — Feuer unter der Pfanne · Küferei und Stall · Dampfmaschine · Diesel | nur bei Arbeit |
| **Fremd** | `klang/nachbar1,4.mp3` + Wand | den **Gegenzug** — was drüben geschieht, hinter der Mauer | bei Arbeit |
| **Werk** | die übrigen ~40 Proben | den **Vorgang** — was der Spieler gerade getan hat | bei Arbeit |

**Das ist seit Welle 5 umgebaut, und zwar gemessen.** Bis dahin trug das Bett
die Epoche — und lief ohne jedes Zutun, während `ducke()` es unter jeden
Vorgang wegzog. Das Ergebnis war die Latte auf dem Kopf: dreißig Sekunden
**Nichtstun** wurden vom fremden Ohr in **12 von 12** Durchgängen der richtigen
Epoche zugeordnet, dreißig Sekunden **Spielen** nur in **3 von 12** — dem
Zufall gleich. Zwölfmal von zwölf begründete das Ohr die stille Aufnahme mit
dem Instrument der Musik.

Heute holt jeder Vorgang Bett und Hof binnen 0,7 s herauf (`belebe()`) und hält
sie 3,2 s; danach sinken sie in 2,6 s auf **null**. Übrig bleibt `grund.mp3` —
Wind im Torbogen, in allen vier Epochen dasselbe Band, mit epochenunabhängiger
Atemtiefe, weil auch eine Modulationstiefe eine Auskunft wäre.

> **Ein Hof, in dem niemand arbeitet, klingt in jedem Jahrhundert gleich.
> Die Zeit hört man erst, wenn jemand etwas tut.**

Danach: still **17 %**, gespielt **58 %** (drei Durchgänge über acht
Aufnahmen). Der volle Befund steht in
[`../../werkbank/urteile/welle5-der-klang-nacharbeit.md`](../../werkbank/urteile/welle5-der-klang-nacharbeit.md).

`LEBEN_TIEF` ist **null** und nicht 0,05: bei 0,05 — 26 dB unter dem Grund und
im Pegelverlauf nicht mehr auffindbar — hat das Ohr die stille Aufnahme von
1350 immer noch mit Sicherheit 90 richtig genannt, *„an der einfachen
Holzflöte"*. Eine Melodie ist noch weit unter dem Rauschen eine Melodie.

Zwei Epochen mit einem Leitinstrument bleiben für ein blindes Ohr eine Epoche —
die Regel gilt weiter, sie gilt jetzt nur für die **gespielte** halbe Minute.

Dasselbe Ereignis klingt in jeder Epoche anders — das ist der ganze Punkt:

| Ruf aus einem Stück | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| `sud:pfanne` | Holzfeuer unter der offenen Pfanne | dito, Rührrechen | Dampfventil, Rührwerk | Kreiselpumpe, Relais |
| `fuhre:kauf`, `preis:muenzen` | Münzen auf Holz | Münzen | Münzen | Registrierkasse |
| `fuhre:fass-rollen` | Eichenfass auf Pflaster | dito | dito | Stahlfass auf Beton |
| `tafel:kreide`, `gegner:preis` | Kreide auf Schiefer | Kreide | Kreide | Schreibmaschine |
| `preis:michaeli` | Kirchenglocke | Glocke | Werkspfeife | **Werksglocke** |
| `uhr:woche` (WEITER) | Holzklapper | Turmuhr | **Schichtglocke** | Stechuhr |
| `fuhre:abfahrt:*` | Ochse vor dem Karren | Pferdefuhrwerk | Rangieren am Waggon | Lastzug |
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
[`../../werkbank/schuss/klang/erzeuge.py`](../../werkbank/schuss/klang/erzeuge.py),
die der Welle 5 in
[`../../werkbank/schuss/klang-w5-nach/erzeuge.py`](../../werkbank/schuss/klang-w5-nach/erzeuge.py) —
dort trägt **jede** Zeile den Satz des Ohres, der die alte Probe verurteilt hat.
Die ersetzten Proben liegen als `<name>.alt.mp3` in
`werkbank/schuss/klang-w5-nach/alt/` — **außerhalb** von `spiel/`, damit sie
nicht als tote Datei mitfahren.

### Eine Probe kann jahrelang das Falsche enthalten, ohne daß es auffällt

Der teuerste Fund der Welle 5 war keine Mischung, sondern eine Datei. In Welle 5
ist **jede** epochentragende Probe einzeln vorgelegt worden — und sieben von
ihnen enthielten nicht, was ihr Name verspricht:

| Probe | hieß | war in Wahrheit |
|---|---|---|
| `abfahrt1` | Ochsenfuhre 1350 | *„Plätschern von Wasser · Gluckern · Tropfen"* |
| `abfahrt2` | Pferdefuhre 1600 | *„metallisches Kurbeln und Ratschen einer Mechanik"* |
| `abfahrt3` | Rangieren 1884 | *„menschliches Pfeifen einer Melodie"* |
| `abfahrt4` | Lastzug 1970 | Motor **plus** langes Druckluftzischen → Dampf |
| `sud1` | offenes Feuer 1350 | Wassergluckern, kein Feuer |
| `sud3` | Dampfventil 1884 | *„Sprühdose / Aerosolspray, erst ab 1927"* |
| `fassstahl` | Stahlfass 1970 | *„Gongschlag"* |
| `werksglocke` | Werksglocke 1970 | *„hoher, schriller elektronischer Pfeifton"* |
| `glocke` | Kirchenglocke | *„Röhrenglocken"* — Orchesterinstrument |

**Die FUHRE, der Hauptvorgang des Spiels, hatte in drei von vier Epochen gar
keinen Abfahrtsklang.** Das ist der Grund, aus dem die *gespielte* halbe Minute
die Epoche schlechter trug als die stille — nicht die Mischung, sondern der
Inhalt. Wer eine Probe erzeugt und nicht einzeln vorlegt, hat sie nicht erzeugt,
sondern nur heruntergeladen.

Und die Gegenstelle liefert nicht, was man bestellt: sieben Versuche auf eine
Ochsenfuhre ergaben fünfmal Wasser, einen Würfelbecher und eine Türklinke; vier
Versuche auf ein rollendes Stahlfass einen bellenden Hund, ein Klopfen auf Holz
und zwei Triangeln. Beide Dateien sind deshalb **gelöscht**: 1350 trägt seine
Zeit jetzt über das Tier (`ochse.mp3`, geprüft *„Kuhblöken, zeitlos"*), und das
Faß rollt in allen vier Epochen als `fassholz`. Eine Probe, die das Falsche
sagt, ist schlechter als keine.

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

## Runde 3 der Welle 4 — was der blinde Kritiker geändert hat

Sein tragender Befund: **die Epoche kam aus der Kulisse, nicht aus dem Vorgang.**
Dreißig Sekunden ohne einen einzigen Klick klangen zu 94 / 97 / 59 / 75 Prozent so
laut wie der gespielte Lauf, und drei von drei messbaren Betten nannten die Epoche
allein richtig. „4 von 4 richtig" war wahr und belegte das Falsche.

Heute: **31 / 34 / 15 / 19 Prozent.** Drei Eingriffe, keiner davon ein einzelner
Klang — Bett und Hof auf gut die Hälfte, das Werk auf knapp das Doppelte, und jede
Werkprobe auf 2,6 s geschnitten statt fünf bis acht Sekunden auslaufen zu lassen.
Im Spiel fällt alle halbe Sekunde ein Klick; vorher lagen an jeder Stelle ein
Dutzend Klänge übereinander. **Wer schneidet, hört mehr.** Die Epoche kommt
trotzdem an: 4 von 4 beim blinden Ohr, mit einem Bett bei 45 % seines alten Pegels.

Drei Regeln sind dabei neu dazugekommen, alle drei aus einer Messung:

3. **Ein Zeichen darf sich keine Probe mit einem anderen Vorgang teilen.** Der
   Gegenzug bekam als Zeichen `bau1` — dieselbe Probe, mit der DIE STADT das eigene
   Bauen klingen lässt. Das Ohr meldete ihn daraufhin in 1884 bei Sekunde 12, wo
   `sud:bau` steht, statt bei 26. Es hörte „eine Handsäge" und hatte recht.
4. **Ein Pegel ist kein Klang, aber er macht einen.** Dasselbe Papier, doppelt so
   laut, wurde vom Ohr zum „Reißverschluss" in 1600.
5. **Eine Decke ist kein Kompressor.** `epoche3.wav` berührte die
   Vollaussteuerung. Jetzt sitzt hinter dem Kompressor ein WaveShaper mit
   `1,2·tanh(x/1,2)`; am Ausgang kann nie mehr als 0,818 stehen. Mit
   `oversample: '4x'` stand dort wieder 1,0000 — die Filter der Überabtastung
   schwingen an der Kante über. Deshalb ist die Überabtastung aus.

Der volle Befund und die offenen Punkte — Auflage 1 ist **nicht** abgenommen —
stehen in
[`../../werkbank/urteile/welle4-der-klang-nacharbeit.md`](../../werkbank/urteile/welle4-der-klang-nacharbeit.md).
