# WELLE 7 — DIE STADT, Nacharbeit nach dem blinden Urteil

*Laufend geschrieben. Urteil: BESTEHT MIT AUFLAGE, sechs Auflagen
(`werkbank/urteile/welle7-die-stadt-urteil.md`).*

## Was ich zuerst richtigstelle — zwei Fehler in MEINEM Bericht

Der Kritiker hat zwei Zahlen von mir berichtigt, beide folgenlos, beide
zutreffend:

1. **Die vier Epochenplatten waren nie PNG und sind keine WebP.** Sie sind
   JPEG und seit dem 3. August unverändert. Umgestellt habe ich **nur die
   32 Hofbilder**. Mein Baubericht listet unter „Verworfen" zwar richtig, dass
   ich die Platten *nicht* umgepackt habe — die Überschrift „PNG/JPG nach WebP"
   des Werkzeugs und die Nennung beider Blöcke nebeneinander lesen sich aber
   so, als wäre beides angefasst worden. Es war nur eines.
2. **Mein PSNR von 52–57 dB ist über den ganzen Schirm gemittelt**, also
   großzügig über die durchsichtige Fläche mit. Der Kritiker hat über die
   **sichtbaren** Punkte gerechnet: min **29,0**, Median **36,3** dB, und in
   30 von 32 Dateien liegt die sichtbare Fläche unter 40 dB. Folgenlos, weil
   der Randfehler mit dem Alphawert multipliziert wird und das Bild im Median
   auf 45 % Kantenlänge herunterkommt — **aber eine Kennzahl, die über
   Leerraum mittelt, schmeichelt, und ich habe sie so genannt.** Für die
   nächste Runde gilt: PSNR nur über Alpha > 0, und der Puffer ist klein —
   `schornstein` kommt mit Faktor 0,947 fast in Originalgröße auf den Schirm.

*(Fortschritt wird darunter geschrieben.)*

---

## AUFLAGE 1 und 6 — erledigt, und was dabei über den Hof gelernt wurde

### Der Befund, der beide Auflagen verbindet: DER HOF IST EINE RAUTE

Auflage 6 sagt „der Hof reicht bis 85 %". Beim Nachmessen mit dem eigenen
Bodenwerk (`K.boden`, Runde 6, an allen vier leeren Höfen nachgemessen) steht
etwas anderes: die Hofmauer hat ihren **Scheitel bei (29,9 | 78,5)** und fällt
nach beiden Seiten mit 0,49 bzw. 0,45 px je px ab, gültig von x 16,0 bis 48,3.

| x | wie tief der Hof dort reicht |
|---|---|
| 20 | 69,8 % |
| 26 | 75,1 % |
| **29,9** | **78,5 % (Scheitel)** |
| 36 | 73,6 % |
| 44 | 67,1 % |

**Vorn ist also nur in einem Keil zwischen x 26 und 34 überhaupt Platz, und
dort passt genau ein Ding.** Mein erstes Messgerät zählte über ein Rechteck
(x 8–62, y 55–85) und meldete deshalb „vorderes Drittel leer" auch für Fläche,
auf der gar kein Hof ist. Das Gerät rechnet jetzt zeilenweise nur zwischen den
beiden Mauerkanten (`werkbank/schuss/stadt-r8/hofdecke.mjs`).

### Der erste Versuch war falsch, und DAS LOT hat ihn widerlegt

Ich habe zuerst sechs Bauten weit nach vorn gestellt (Fuß 77–79) und die
Breiten nach der Perspektive hochskaliert. `stadt-r7/pruefe.mjs` — das Gerät
aus Runde 7 — hat das in einem Lauf zerlegt:

* **8 Bodenfehler**: sechs Bauten standen *auf der Mauer*, `eiskeller` 148 px
  darunter, `kastenlager` 169 px. Im Bild saß der Kellerhügel auf den Dächern
  der Nachbarn.
* Danach, im zweiten Versuch mit korrigierten Tiefen: **die Braupfanne war zu
  82 % (1350) und zu 100 % (1600) zugedeckt.** Das ist der Gegenstand, an dem
  die Sperrliste hängt („offene Pfanne statt Destillierblase", vom Kritiker
  eigens geprüft) und der Blickpunkt, den das Zielbild im Vordergrund trägt.

**Daraus die Lösung, die steht:** in den Keil gehört nicht das Fasslager,
sondern **die Braupfanne selbst** — sie ist Gerät und darf rücken (anders als
der Brunnen), sie ist mit 900×428 das flachste Bild im Katalog und deckt
deshalb nichts zu, und sie ist im Zielbild genau dort. In 1884 übernimmt der
**Eiskeller** dieselbe Rolle (Erdhügel mit Grasnarbe, ebenfalls flach, und ab
Woche 1 im `stand`), in 1970 **Kastenlager und Verladedock**.

### Das Ergebnis — A/B im selben Augenblick

Damit „vorher/nachher" nicht wieder eine halbe Stunde fremder Bauarbeit
mitmisst (der Fehler aus B.5 des Bauberichts), läuft der Vergleich über zwei
Häfen mit **genau einer unterschiedlichen Datei**:
`werkbank/schuss/stadt-r8/daten-alt-aufsetzen.sh` baut Hafen 8896 aus einem
Symlink-Wald, in dem nur `stadt-daten.js` im Stand vor dieser Nacharbeit liegt
(`daten-alt-bauen.mjs` nimmt die elf Zeilen mechanisch zurück und **bricht ab**,
wenn ein Muster fehlt). Gegenprobe über die Leitung:
`stadt-daten` 8896 `6e6281b5` gegen 8899 `f141459a`, `stadt.js` **beidseitig
`fea961ad`**.

**Füllung des Hofes, nur innerhalb der Mauerraute gezählt, `bau=alle`:**

| Epoche | vorderes Drittel vorher | nachher | mittleres vorher → nachher |
|---|---|---|---|
| **1350** | **4,8 %** | **35,0 %** | 70,3 → 75,1 |
| **1600** | **3,7 %** | **42,2 %** | 87,9 → 76,0 |
| **1884** | **16,4 %** | **29,2 %** | 86,5 → 69,4 |
| **1970** | **42,2 %** | **54,5 %** | 79,3 → 71,7 |

Das vordere Drittel füllt sich in 1350 um das **Siebenfache**, in 1600 um das
**Elffache**. Das mittlere Drittel gibt dabei ab — das ist kein Verlust,
sondern dasselbe Material besser verteilt: der Hof war hinten gesättigt und
vorn leer.

### Auflage 1 — der Brunnen steht, und er ist zu sehen

`versatz: { 2: { dx: 4, dy: 9 } }` ist ersatzlos gestrichen. Der Ziehbrunnen
steht in 1350, 1600 und 1884 auf **demselben Punkt (21 | 62)**. Gerückt ist,
was davorstand — und zwar gemessen mit `BRAUHAUS.stadt.tiefe.deckung()`:

| Epoche | Brunnen zugedeckt, vorher | nachher |
|---|---|---|
| 1350 | — | 37 % |
| **1600** | **91 %** *(824 von 9.200 px, die Zahl des alten Datenkommentars)* | **3 %** |
| 1884 | — | **0 %** |

Dazu: `keller_gewoelbe` verliert seinen epochenweisen Versatz ebenfalls und
steht jetzt in 1350 und 1600 am selben Platz, `fasslager_stein` desgleichen.
**Von den drei Wanderern, die der Kritiker gefunden hat, sind zwei stehen
geblieben; der dritte ist die Braupfanne, und die ist Gerät.**

### Die Gegenprobe, die den ganzen Umbau trägt

`node werkbank/schuss/stadt-r7/pruefe.mjs alle` — DAS LOT und DIE TIEFE aus
dem laufenden Spiel gelesen, alle vier Epochen:

```
BODEN:        0 Fehler   (kein Bau auf der Mauer, keiner im Torfeld)
REIHENFOLGE:  0 Fehler   (nichts liegt vor dem, hinter dem es steht)
Braupfanne:   0 % zugedeckt in 1350 und 1600
Summe aller Beanstandungen: 0
```

---

## AUFLAGE 2 — der Reiter schneidet keine Zahl mehr an

**Der Kern des Befundes, und er ist der wichtigste des ganzen Urteils:**
auf dem Reiter DIE HÄUSER stand `wollen 14…`, während der Wert
`wollen 146 · im Keller liegen 11 hl` ist. *„Eine gekürzte Zahl liest sich wie
eine vollständige"* — der Nachfragewert erschien um eine Zehnerpotenz zu
niedrig. Das ist keine Kürzung, das ist eine falsche Ablesung.

**Jetzt schneidet nicht mehr der Browser, sondern das Stück — und nur an einer
Grenze, die einen wahren Satz übriglässt** (`stadt.js`, `setzeAufschrift()`):

1. der ganze Text, wenn er passt;
2. sonst so viele vollständige Abschnitte (` · `), wie hineingehen, mit
   nachgestelltem Auslassungszeichen;
3. sonst so viele vollständige Wörter;
4. sonst nur das Auslassungszeichen.

Gemessen wird mit `scrollWidth`, also an dem, was der Browser wirklich malt,
und gemerkt wird Text **und Breite nach dem Einpassen** — sonst rechnete jeder
Takt neu, weil ein gekürztes Wort schmaler ist als das ungekürzte.

| Reiter, 1884 | vorher | nachher |
|---|---|---|
| DIE HÄUSER | `wollen 14…` | **`wollen 146 …`** |
| DER EISKELLER | `11 von 135 h…` | **`11 von 135 hl …`** |
| HALBER WAGEN | `0,0 von 60 hl…` | **`0,0 von 60 hl …`** |

**`wollen 146 …` ist wahr. `wollen 14…` war es nicht.**

Dazu hat der Reiter Polster abgegeben, weil der Kritiker nachgewiesen hat, dass
es **auf der Entwurfsleinwand am schlimmsten** ist (48 Kästen dort gegen 37 bei
1366×768): Polster 20 → 8 Bezugspixel, Sperrung 14 → 6, Abstand 5 → 3. Das
sind rund 240 px zurück von 1.654 — und die Werkbank wird davon **nicht höher**.

### Das Ergebnis, mit dem Gerät des Kritikers gezählt

| Fenster | abgeschnittene Kästen DER STADT vorher | nachher | alle Stücke |
|---|---|---|---|
| **2752×1536** | **48** | **0** | 15 |
| **1920×1080** | **53** | **0** | 11 |
| **1366×768** | **37** | **0** | 14 |

**Null auf jeder gemessenen Fenstergröße.** Von den 51 abgeschnittenen Kästen
des ganzen Spiels bleiben 14, und keiner davon gehört DER STADT.

**Verworfen, weil gemessen:** `flex: 1 1 0` (alle Reiter gleich breit) macht es
auf der Entwurfsleinwand **schlechter** — vier ganze Überschriften statt sechs.
Gleiche Breite hilft dem kurzen Namen und nimmt dem langen mehr weg, als der
kurze gewinnt. Ebenfalls verworfen: die Reiterzeile rollbar machen (der zweite
Vorschlag des Kritikers) — das ändert, wo die Reiter stehen und ob Playwright
vor dem Klick scrollen muss, und damit die Geometrie, an der ρ hängt.

## AUFLAGE 5 — „STADT ZEIGEN" sagt jetzt selbst, dass es nichts zu tun gibt

Ausgeblendet war der Knopf schon (`.frei.aus { display: none }`) — deshalb lief
der echte Klick des Kritikers in den Zeitablauf. **Er stand aber weiter als
AKTIVER Zug im DOM** und wurde von jedem Zähler mitgezählt, der `disabled`
liest. Das ist genau der Befund über `disabled`, den DER SUD am 3. August
gemeldet hat, nur diesmal in meinem Stück.

Jetzt: `zk.disabled = !offenDa`, dazu `data-soll-aus` und ein Titel, der den
Grund nennt. **Gemessen mit `gestalt.mjs`: die Zahl der aktiven Züge sinkt in
jeder Epoche um genau eins** (82→81, 83→82, 87→86, 82→81) — der eine Zug, der
keiner war.

## AUFLAGE 3 — die Ortsmarke weicht aus, statt unerreichbar zu bleiben

Nachgemessen ist der Deckel **der Chronikgriff DES PREISES**: 182×237 px auf
(1169|23), der Pflock sitzt auf (1286|195) mitten darin. Er liegt in
`ebene-blatt`, also über `ebene-marken` — von meinem Stück aus mit keinem
z-index einzuholen.

Der vorhandene Abräumer („KEIN TOTER KNOPF IM BILD", Runde 5) kannte nur drei
Deckel — `data-frei`, eigener Hof, eigenes Blatt — und ließ diesen deshalb
stehen. Jetzt wird **zuerst ausgewichen**: der Schritt wird aus dem Rechteck
des Deckels gerechnet, knapp an seiner nächsten Kante vorbei, mit `translate`
und nie mit `transform` (der Pflock hängt über `transform` an seinem Ort).
Erst wenn nichts hilft, wird abgeräumt.

**Zwei Fehlversuche, beide gemessen und beide lehrreich:** feste Schritte von
30 px reichen nicht gegen einen Deckel von 237 px, und der Ausweichschritt
lief zuerst in `zeichnePfloecke` — die baut nur neu, wenn sich die Markenliste
ändert, und beim ersten Bau gab es den fremden Griff noch gar nicht.

| | vorher | nachher |
|---|---|---|
| nicht treffbare STADT-Züge, 1366×768 | 1884: 1 · 1970: 1 | **0 · 0 · 0 · 0** |
| dito 2752×1536 | 0 | **0** |

---

## AUFLAGE 4 — `bild/name/` und `bild/gegner/`: gemeldet, nicht angefasst

Der Kritiker hat recht mit der Zahl: **11 PNG mit 4,4 MB**, davon holt 1600
allein 1,14 MB (`name/schild2.png` 683 kB, `gegner/hof2.png` 489 kB). Dieselbe
WebP-Umstellung darauf angewandt hätte den Abstand zur Obergrenze etwa
verdoppelt.

**Die Aufsicht hat entschieden, dass sie mir nicht gehören** — `spiel/LIESMICH.md`
regelt `bild/<stück>/` nach Vorsilbe, und `bild/name/**` steht dort in der
Zeile von DER NAME, `bild/gegner/**` in der von DER GEGNER. Ich habe sie nicht
angefasst. **Als Befund weitergereicht:**

| Ordner | Dateien | auf der Platte | was eine Umstellung brächte |
|---|---|---|---|
| `bild/name/` | 4 PNG | 1,8 MB | rund −75 %, gemessen am eigenen Ergebnis (17,49 → 4,45 MB) |
| `bild/gegner/` | 7 PNG | 2,6 MB | dito |

Das Werkzeug dafür liegt fertig da und ist für jeden Ordner brauchbar:
`WAS=… node werkbank/schuss/stadt-gewicht/umpacken.mjs schreibe` bei Güte 0,92,
gleiche Pixelmaße. Wer es fährt, misst danach mit `fuesse-pruefen.mjs`, ob seine
eigenen Alphatabellen noch stimmen — bei mir war der größte Abstand 0,0001.

## Der Vorgriff auf die nächste Platte — die Frage der Aufsicht

**Ja, es werden immer zwei Platten geladen, und nein, der Vorgriff ist nicht
nötig — er ist aber billiger als das, was er verhindert.**

Was er kostet, hat der Kritiker beziffert: 1,9–2,3 MB von 8, und er ist der
Grund, warum 1600 nur noch 0,62 MB Luft hat. Was er verhindert: beim
Epochenwechsel wechselt die Platte — 100 % der Bildfläche — und ohne Vorgriff
steht dort für die Dauer eines Netzabrufs **nichts**. Das ist der eine
Augenblick im Spiel, in dem ein Flackern das ganze Bild trifft.

**Meine Empfehlung, und ich melde sie als Frage und nicht als Tat:** der
Vorgriff bleibt, solange das Veto mit 0,62 MB Luft gehalten ist. Fällt es enger
aus — etwa weil ein anderes Stück Gewicht dazulegt —, ist er die erste Stelle,
an der gespart wird, und er ist mit einer Zeile abzuschalten (`vorladen()`,
Stufe 1 in `stadt.js`). **Besser wäre, `bild/name/` und `bild/gegner/`
umzustellen: das bringt rund 3,3 MB und kostet gar nichts.**

---

## EIN NEBENSCHADEN, den erst der Augenschein gezeigt hat

Nachdem Kastenlager und Verladedock in 1970 nach vorn gerückt waren, stand die
**Reklametafel „BRAUHAUS ZUM ANKER" mitten in den Bierkästen und über dem
Lastwagen** — kein Messgerät hat das gemeldet, weder DAS LOT (sie ist kein Bau)
noch die Hofdecke (sie zählt nur, ob sich etwas geändert hat, nicht ob es sich
sinnvoll überlagert). **Nur das Hinsehen hat es gefunden.**

Sie steht jetzt links im Hof und ein Band zurück (`schild: dx −15 → −24,
dy 8 → 2`), wo 1970 Platz ist; die Kästen stehen davor statt dahinter. Das ist
die Sorte Fehler, gegen die keine Zahl schützt — und der Grund, warum in dieser
Nacharbeit **jede Epoche einzeln angesehen** wurde, nicht nur gemessen.

## ABNAHME DER NACHARBEIT

```
node --check spiel/stuecke/stadt.js · stadt-zusatz.js · stadt-daten.js  → OK
node werkbank/schuss/aufsicht/tor.mjs         → TOR OFFEN (4/4, lage 0, Fehler 0)
node werkbank/schuss/aufsicht/spielprobe.mjs  → SPIELPROBE BESTANDEN
node werkbank/schuss/stadt-r7/pruefe.mjs alle → BODEN 0 · REIHENFOLGE 0 · Summe 0
```

| | vor der Nacharbeit | nach der Nacharbeit |
|---|---|---|
| abgeschnittene Kästen DER STADT, 2752×1536 | 48 | **0** |
| dito 1920×1080 | 53 | **0** |
| dito 1366×768 | 37 | **0** |
| abgeschnittene Kästen, alle Stücke, 1366×768 | 51 | **14** |
| Textknoten < 12 px, alle Stücke | 505 | **505** |
| Knöpfe unter 24 px | 0 von 334 | **0 von 330** |
| nicht treffbare STADT-Züge | 1 (1884) + 1 (1970) | **0** |
| Bodenfehler / Reihenfolgefehler | 0 / 0 | **0 / 0** |
| Ziehbrunnen zugedeckt, 1600 | **91 %** | **3 %** |
| Braupfanne zugedeckt, 1350 / 1600 | — | **0 % / 0 %** |
| vorderes Hofdrittel gefüllt (1350/1600/1884/1970) | 4,8 / 3,7 / 16,4 / 42,2 % | **35,0 / 42,2 / 29,2 / 54,5 %** |
| Gewicht, schwerste Epoche bis `load` | 5,49 MB | **5,52 MB** |
| Gewicht, schwerste Epoche gesamt | 7,38 MB | **7,41 MB** |

Die 0,03 MB mehr sind der gewachsene Quelltext von `stadt.js` und
`stadt-daten.js`. Das Veto bleibt mit **0,59 MB Luft** gehalten.
