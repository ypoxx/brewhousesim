# Welle 11 — DIE FUHRE. Arbeitsstand (laufend geschrieben)

*Auftrag: `gauntlet/WELLE-11.md`, Abschnitt DIE FUHRE. Vorzustand `7896ee6`.
Gemessen wird einzeln, jeder Browser durch `aufsicht/messfenster.sh`.*

> ### NEUANLAUF nach Container-Reset, 6.8. ~21:2x UTC
>
> Der Behaelter ist waehrend des letzten Laufs weggefallen. **Verloren ist
> nichts, was zaehlt** — die Aufsicht hatte alles committet (`ff9bd4a`), der
> Arbeitsbaum ist sauber. Was der Reset genommen hat:
>
> | | Zustand |
> |---|---|
> | `spiel/stuecke/fuhre.js`, `spiel/stil/fuhre.css` | **da**, committet |
> | dieser Ordner samt `messungen/` | **da**, committet |
> | `messungen/rho-vorher/e4-a.json` | **fehlte** — der Lauf war um 19:53:41 gestartet und nie fertig geworden. **Nachgeholt, siehe §3.7** |
> | `bilder/` (Aufnahmen) | fort, und das ist **so vorgesehen**: `.gitignore:67` haelt `**/schuss/**/*.png` aus der Historie. Bilder wandern in diesem Lauf grundsaetzlich nicht mit; ihre Aussagen stehen als Zahl oder als Quelltextstelle daneben |
> | `/tmp/messstand/…`, `/tmp/fuhrestand/…` | fort, aus den Skripten in Sekunden wieder aufgesetzt |
>
> Neu aufgesetzt: `aufsicht/messstand.sh 7896ee6 8951` und
> `fuhre-w11/nachstand.sh 8952`. **Die Fassungsprobe aus §3.8 ist dabei von
> `/tmp` auf `git` umgestellt worden und damit zum ersten Mal
> nachstellbar** — siehe dort.

> ### NEUANLAUF 3 nach Sitzungsende, 6.8. ~23:2x UTC
>
> Der zweite Anlauf ist am Sitzungslimit gestorben, mitten in der Nacharbeit
> an §3.1. **Wieder ist nichts verloren**, was zaehlt. Was ich beim Antritt
> vorgefunden habe, und was daraus folgt:
>
> | | Stand beim Antritt |
> |---|---|
> | **Die Berichtigung §3.1** (das Letzte, was mein Vorgaenger anfing) | **war zu Ende gebracht.** Nachgeprueft: die vier Nachher-Zeilen der Tabelle stimmen jetzt Ziffer fuer Ziffer mit `messungen/nachher-sonde-w30.txt`. Die Folgestelle in §3.2 (`195.456` → `189.696`) ist ebenfalls berichtigt (Commit `397aac1`), und die falschen Masse im Quelltext-Erklaerkopf auch (`fuhre.js:3697`). **Die alten Zahlen stehen nur noch dort, wo sie hingehoeren: im Berichtigungskasten selbst.** Nachgezaehlt mit `grep` ueber alle sechs falschen Werte |
> | `abnahme.sh` | **war fertig durchgelaufen** (`abnahme-fortschritt.txt`: FERTIG 22:49:49) — aber **die letzten fuenf Ergebnisse standen in keinem Abschnitt**, weil die Sitzung um 21:53 endete und der Lauf erst um 22:49 fertig war. Nachgetragen in §3.5b, §3.9. Darunter die wichtigste Zahl des ganzen Auftrags (siehe unten) |
> | Arbeitsbaum gegen gemessenen Stand | **auseinander**: gemessen wurde `3082041165`, im Baum steht `3bdb5bb282`. Der Unterschied ist **ein Kommentarblock** — nachgerechnet, §3.9 |
>
> **Die Latte „Gesamtdeckung unter 20 %" ist genommen, und es stand
> nirgends.** `messungen/deckung-gemeinsam-w30.txt`, 30 × WEITER ohne
> Escape, alle drei Stuecke zusammen: **14,5 / 15,0 / 14,8 / 13,8 %**.
> §3.3 sagt noch „NICHT genommen" — das war zur Zeit des Schreibens richtig
> und ist es seit 22:49 nicht mehr. Berichtigt in §3.3b.

| Stand auf Hafen | was |
|---|---|
| 8951 | VORZUSTAND `7896ee6` (`aufsicht/messstand.sh 7896ee6 8951`) |
| 8952 | NACHSTAND = `7896ee6` **plus ausschliesslich** `stuecke/fuhre*.js` und `stil/fuhre*.css` (`fuhre-w11/nachstand.sh 8952`) |

Der Nachstand ist bewusst **nicht** der Arbeitsbaum: in dieser Welle bauen
drei Builder gleichzeitig darin. Ein Nachstand aus dem Arbeitsbaum wuerde
die Arbeit DES ERBEN und DES GEGNERS mitmessen, und die Gesamtdeckung
stuende dann fuer alle drei zusammen. Alle „nachher"-Zahlen unten sind
deshalb **allein die Wirkung DER FUHRE**.

---

## 1 — Was vor der ersten Zeile Code gemessen wurde

### 1.1 Die eine Zahl, um die es geht

`messungen/vorher-sonde-w30.txt`, 30 × WEITER **ohne** Escape, 2752×1536:

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| `.fu-sommerblatt` | 1596×847 | 1596×847 | 1596×718 | 1596×943 |
| in px² | 1.351.246 | 1.351.246 | 1.145.541 | **1.504.427** |
| DIE FUHRE gesamt (Huellen) | 1.375.264 | 1.356.800 | 1.152.000 | 1.515.184 |
| alle neun Stuecke (Huellen) | 44,1 % | 44,7 % | 41,3 % | 50,9 % |
| `haushalt.tafeln()` | 1 | 1 | 1 | 1 |

Photographisch (`bild-w9/deckung.mjs`, `messungen/deckung-vorher-w30.txt`):
**48,8 / 48,1 / 44,8 / 53,3 %** — die Zahl aus dem Auftrag.

Ein einziges Blatt, bis zum **Achtfachen** der Schwelle von 200.000 px², ab
der `haushalt.tafeln()` von einer ganzseitigen Tafel spricht.

### 1.2 Ein Befund, der gegen den Auftrag spricht, und er gehoert zuerst hierher

**Der Ladezustand DER FUHRE war schon vorher innerhalb ihrer Grenze.**
Der Auftrag nennt 169.305 Bildpunkte gegen eine Grenze von 34.000. Diese
Zahl stammt aus `rahmen-w10/messen.mjs`, das photographisch je Stueck misst.
Das Spiel selbst sagt etwas anderes — `messungen/vorher-sonde-laden.txt`,
`BRAUHAUS.haushalt.miss().je.fuhre`, Vorzustand, Ladezustand:

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| Huellen, im Spiel gemessen | **0 px** | **0 px** | **0 px** | **2.288 px** |
| Kaesten | 0 | 0 | 0 | 2 |
| `haushalt.pruefe()` nennt `fuhre` | nein | nein | nein | nein |

Im Ladezustand traegt DIE FUHRE **nichts** im Bild: die vier Bretter
(`fu-haeuser`, `fu-tafel`, `fu-keller`, `fu-wagen`) sind von der
Platzordnung der STADT weggeschnitten, und die Ortsmarken (`.fu-marke`)
stehen auf `stadt-marke-ruht` mit `opacity: 0` — die STADT haelt sie
zurueck, solange ORTSMARKEN aus ist.

**Woher die 169.305 px dann kommen, ist nachgestellt** (`warum.mjs`,
Vorzustand, Epoche 1): der photographische Durchgang blendet alle Kaesten
DER FUHRE aus und vergleicht zwei Aufnahmen. Der Unterschied liegt
**vollstaendig** in `x 37..873 × y 127..248`, in zwei Zeilenbloecken
127–179 und 193–248 — **das ist die Reiterzeile der STADT**
(der blinde Kritiker: „Reiterzeile oben links, x 35–890, y 120–235").
Der Grund: `beschriftung()` der STADT liest den Text der fremden Bretter,
um ihre Reiter zu beschriften; nimmt man der FUHRE die Schrift weg
(`visibility: hidden`), stehen die Reiter anders da, und der Vergleich
schreibt diese Aenderung der FUHRE zu. In meinem Nachbau sind das
28.813 px; der Rest der 169.305 entsteht, weil `messen.mjs` vor dem
Stueck-Durchgang einmal ALLE Kaesten ausblendet und wieder einschaltet —
die Reiterzeile kommt aus diesem Durchgang veraendert zurueck, verglichen
wird aber gegen die Aufnahme davor.

**Das betrifft nicht nur mich.** Jedes Stueck, dessen Bretter die STADT
zuklappt, bekommt denselben Aufschlag zugerechnet. Wer die Tabelle in
`gauntlet/WELLE-11.md` liest, sollte die Zahlen des Ladezustands mit
`BRAUHAUS.haushalt.miss()` gegenlesen, bevor er danach baut.

#### 1.2b Beim Neuanlauf zu Ende verfolgt: WEM die 169.305 px gehoeren

Der erste Anlauf konnte zeigen, dass die Zahl nicht DIE FUHRE ist. Jetzt
steht auch da, **wem sie gehoert**, und beide Geraete sind damit erklaert:

1. **Der Haushalt teilt DER FUHRE etwas zu, was ihr im DOM nicht gehoert.**
   `kern/haushalt.js:97` schreibt zur Grenze von 34.000 px:
   „`fuhre` — vier Reiter und die Hofanzeige". **Diese vier Reiter baut aber
   die STADT**, nicht DIE FUHRE: `stadt.js:742 zeichneReiter()` erzeugt sie
   als `.stadt-reiter` und haengt sie in `.stadt-reiterzeile`, die im Fach
   DER STADT liegt. `haushalt.miss()` ordnet ueber
   `el.closest('.fach').getAttribute('data-stueck')` zu (`haushalt.js:186`)
   — also zaehlen die Reiter DER FUHRE auf das Konto DER STADT. Daher
   `fuhre 0 px` und gleichzeitig `stadt: 152.688/40.000 px` im Ladezustand.
   Die Grenze von 34.000 px steht damit fuer Kaesten, die ein anderes
   Stueck baut und die kein Bau DER FUHRE verkleinern kann.

2. **Das photographische Geraet ordnet dieselben Bildpunkte umgekehrt zu.**
   `stadt.js:610 beschriftung(el)` liest den **Text des fremden Bretts**,
   um dessen Reiter zu beschriften (`kopf.innerText`, erste `b/strong/h*`).
   `messen.mjs` blendet fuer den Stueck-Durchgang die Kaesten DER FUHRE mit
   `visibility: hidden` aus — damit liest `beschriftung()` etwas anderes,
   die Reiterzeile wird neu gesetzt, und der Unterschied faellt DER FUHRE
   zu. Genau dort liegt er auch: `warum.mjs` findet ihn **vollstaendig** in
   `x 37..873 × y 127..248`, den Zeilenbloecken 127–179 und 193–248 — die
   Reiterzeile, die der blinde Kritiker mit „x 35–890, y 120–235" beschreibt.

**Beide Geraete haben recht, und sie widersprechen sich trotzdem**, weil
sie dieselben Bildpunkte verschieden verbuchen. Die 169.305 px sind die
**Reiterzeile DER STADT**, einmal unter dem Namen DER FUHRE.

**Warum das dem Rahmen nicht auffallen konnte:** er hat seine Huellenzahl
gegen die photographische geprueft und 0,05 % Unterschied gefunden
(`haushalt.js:44` — 138.156 gegen 138.084 px) — **aber an sich selbst**.
Die Kaesten des Rahmens sind alle sichtbar und stehen im eigenen Fach; dort
stimmen beide Geraete notwendig ueberein. Fuer ein Stueck, dessen Bretter
die STADT wegschneidet und dessen Reiter im fremden Fach stehen, traegt
diese Probe nicht. Es ist eine gute Probe am falschen Stueck.

*Was daraus folgt und nicht mir gehoert:* solange „vier Reiter" auf dem
Konto DER FUHRE stehen und im Fach DER STADT haengen, kann keiner von
beiden seine Grenze sauber treffen. Entweder bekommt die Reiterzeile ein
eigenes Konto, oder `haushalt.miss()` ordnet einen Reiter dem Stueck zu,
dessen Brett er aufklappt (`b.schluessel` weiss es bereits). Das ist eine
Aenderung am Skelett und gehoert dem Rahmen, nicht mir.

**Die Gegenprobe ist inzwischen gefahren und sie ist eindeutig.**
`messungen/nachher-laden.log`, derselbe Ladezustand auf dem Nachstand:

| Ladezustand, photographisch | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| `fuhre` vorher | 169.303 px | 151.951 | 125.997 | 105.811 |
| `fuhre` **nachher** | **169.305 px** | **151.951** | **125.997** | **105.953** |
| Deckung gesamt vorher → nachher | 18,4 → 18,4 % | 19,3 → 19,3 | 18,7 → 18,7 | 19,3 → 19,3 |

Ziffer fuer Ziffer dieselbe Zahl — **169.305 px**, genau die Zahl aus dem
Auftrag — waehrend das Spiel selbst fuer denselben Zustand **0 px** und
**0 Kaesten** meldet. Damit ist belegt: die 169.305 sind nicht DIE FUHRE,
und kein Bau der FUHRE kann sie bewegen.

*(Was davon unberuehrt bleibt: die Zahl fuer den GESPIELTEN Zustand. Dort
deckt die Sommertafel wirklich, und Huellen wie Kamera sagen dasselbe —
1.476.519 px photographisch gegen 1.375.264 px Huelle in 1350.)*

### 1.3 Auflage 7 des blinden Kritikers gehoert der FUHRE — und sie war falsch verortet

Der Kritiker sah in 1970 „ein Kästchen ‚FAE' … trägt darunter **zwei leere
Rechtecke in Rot** — die klassische Ersatzdarstellung für ein Zeichen, das
keine geladene Schrift zeichnen kann", und dasselbe unter „BRU". Der Rahmen
hat in Welle 10 daraufhin jedes Nicht-ASCII-Zeichen des Spiels gegen jede
Schriftkette geprueft, **kein einziges fehlendes gefunden** und die Ketten
trotzdem vorsorglich in Unifont enden lassen.

Es war nie ein Zeichen. Es sind die **Durstbetten der Ortsmarke DER FUHRE**:
`.fu-marke .fu-mbetten i`, 8×11 px, nur ein Rand in `--fu-warn`, ohne
Fuellung — ein Bett je Wagenschritt, den die Adresse gerade will. Zu sehen
in `bilder/blick-e4-bericht.png` unter „FAE" und „BRU", genau den zwei
Kuerzeln, die der Kritiker nennt (`stuecke/fuhre-daten.js`, `D.kurz`).
Behoben: gefuellte Striche statt leerer Kaesten, dieselbe Zahl an derselben
Stelle.

---

## 2 — Was gebaut wurde

| Datei | Aenderung | wofuer |
|---|---|---|
| `stuecke/fuhre.js` | `tastenSperre`: `stopImmediatePropagation()` → `stopPropagation()` (3 Stellen) | Auflage des Rahmens, `fuhre.js:3517` |
| `stuecke/fuhre.js` | `zeichneSommer` zerlegt: **Anschlag** (liegt) und **Bericht** (klappt auf), `Z.berichtOffen`, neuer Zug `fuhre:sommer-bericht` | A16 · Auftrag DIE FUHRE |
| `stil/fuhre.css` | `.fu-sommerblatt` gedeckelt auf `max(26%,700px)` × `max(17%,265px)`; Kopf/Fuss neu; `.fu-weit` fuer den aufgeschlagenen Bericht | dito |
| `stil/fuhre.css` | `.fu-marke .fu-mbetten i` gefuellt statt umrandet | Auflage 7 |

### Die ZWEITE Stelle mit `stopImmediatePropagation()` — stehengelassen, mit Grund

Der Vorzustand hatte **vier** solcher Aufrufe in `fuhre.js`, nicht drei:
`3523`, `3529`, `3541` in `tastenSperre` — und `3897` in `endeHorcher`.
Die Auflage nennt `fuhre.js:3517`, und das ist der Erklaerkopf ueber
`tastenSperre`; diese drei sind umgestellt (heute `3549/3555/3567`).

**Der vierte steht noch da** (heute `fuhre.js:4089`), und das ist Absicht:
`endeHorcher` ist „Schloss 2" des Hofschlusses. Er haengt in der Fangphase
auf `document` und hat die eine Aufgabe, nach dem Ende der Partie jeden
Zug abzufangen, **auch solche, die an rohen Knoepfen anderer Stuecke
haengen** (der Quelltext nennt DEN GEGNER beim Namen). Genau dafuer
braucht er `stopImmediatePropagation()`: `stopPropagation()` liesse einen
Horcher am selben Knoten weiterlaufen, und der duerfte dann nach dem Ende
noch ziehen. Hier ist das Zuvielnehmen der Zweck, nicht ein Versehen.

Wer die Auflage weiterdenkt, sollte diese Stelle trotzdem kennen. Sie
liegt in derselben Datei, sie tut dasselbe, und sie ist aus einem anderen
Grund richtig. Angefasst habe ich sie nicht — eine Aenderung daran haette
das Ende der Partie beruehrt und mit ihm die ρ-Messung dieser Welle.

**Was ausdruecklich NICHT angefasst wurde**, weil die zweite Messlatte
daran haengt: die Klasse `.fu-sommerblatt`, die Zugschluessel
`fuhre:jahresplan:*` und `fuhre:sommer-zu`, die Reihenfolge der Sorten und
die Wirkung jedes Knopfes. Die messende Hand (`rueckkopplung-r3/linie.mjs`,
Woche 1 jedes Braujahres) sucht genau diese drei Dinge.

**Nichts ist fort** — der Sommer Monat fuer Monat, der Umgang vor
Michaeli, die Abgabe, das Kerbholz, die Notsude, die verlorenen Adressen,
der Weg zum guten Ende stehen im Bericht, hinter einem Knopf, der ihn
aufschlaegt und wieder zuklappt. Auf dem Anschlag steht zusaetzlich der
Sommer in einer Zeile: ausgeliefert, gekippt, uebrig, in die Lade, Abgabe.

**BERICHTIGUNG (Neuanlauf): „steht unveraendert" war zu stark gesagt.**
Nachgezaehlt mit den Zeichenketten beider Fassungen (`zeichneSommer` des
Vorzustands, Zeilen 3587–3857, gegen `sommerBericht` + `zeichneSommer`
heute, 3669–4049): 97 Literale vorher, 121 nachher, und **sieben** stehen
nur in der alten Fassung. Keines davon ist eine verlorene Auskunft, aber
drei sind **umformuliert**, und das gehoert benannt:

| alt | heute | wo |
|---|---|---|
| Ueberschrift „Was steht 1351/52 an der Tafel?" **plus** Zeile „An der Tafel steht: 2× Dünnbier · 1× Grutbier — der Braumeister hat angeschrieben, was voriges Jahr dort stand." | **eine** Zeile: „Was steht 1351/52 an der Tafel? Angeschrieben: 2× Dünnbier · 1× Grutbier — wie voriges Jahr." Der volle Satz ueber den Braumeister steht im `title` | `fuhre.js:3912` |
| Knopf „Tafel schließen — Michaeli, das Jahr beginnt" | Knopf „Tafel schließen — Michaeli"; „das Jahr beginnt" steht im `title` | `fuhre.js:3954` |
| „Solange die Tafel auf dem Tisch liegt, ruht die Woche. WEITER und die Taste Escape legen sie ebenfalls beiseite." | Hinweiszeile „Die Woche ruht, solange die Tafel liegt · WEITER und Escape legen sie beiseite" — der volle Wortlaut im `title` desselben Knopfes | `fuhre.js:3968` |

Zwei Zeilen fuer eine Sache kosten auf einem Anschlag von 265 px Hoehe ein
Zehntel der Tafel; deshalb zusammengezogen. **Gesagt wird dasselbe, und
jede Auskunft ist ohne Klick lesbar oder steht im `title` desselben
Elements.** Aber es ist eine Umformulierung, keine reine Verschiebung, und
wer die alte Zeile sucht, findet sie so nicht wieder. Die uebrigen vier
Abweichungen sind Zerlegungen derselben Saetze in andere Zeichenketten.

**Und der Quelltext hat es selbst falsch behauptet — behoben.** Im
Erklaerkopf ueber der Georgi-Tafel stand „Nichts ist fort, nichts ist
gekuerzt, **nichts steht nur noch im Titelfeld**". Der letzte Halbsatz war
nach dieser Zaehlung nicht wahr. Er ist durch die drei Stellen oben ersetzt,
mit Grund je Stelle (`fuhre.js:3642`). Eine Datei, deren Kommentar mehr
verspricht als der Code haelt, ist schlimmer als eine ohne Kommentar — und
es ist eine reine Kommentaraenderung, also ohne Wirkung auf ρ oder Layout.

### Zwei eigene Fehler beim Bauen, gefunden und behoben

**F1 — Der Kopf klebte, und deckte die halbe Entscheidung zu.**
Erste Fassung: Kopf `sticky top`, Fuss `sticky bottom`. Ist der Inhalt
hoeher als der Deckel — und in 1350 war er es um 84 px —, kleben beide und
liegen uebereinander. `messungen/probe1.txt`: `fuhre:jahresplan:duenn` und
`:grut` meldeten **VERDECKT**, `:stark` und `:kofent` „trifft". Die halbe
Jahresentscheidung war nicht anzufassen. Jetzt klebt nur der Fuss, an dem
die Entscheidung haengt; was ueberlaeuft, ist der Kopf.

**F2 — `BRAUHAUS.blatt.melde()` hat die Tafel bei 1366×768 geschlossen.**
Der Rahmen bietet den Stuecken an, ihr Blatt anzumelden. Diese Tafel hat es
getan. Gemessen bei 1366×768, 30 Wochen ohne Escape
(`messungen/klein1.txt` gegen `messungen/vorher-klein1.txt`):

| | Sommerblatt | erb-buch |
|---|---|---|
| Vorzustand | 792×492 offen | zu |
| mit `melde()` | **fort** | **308.428 px² offen** |
| ohne `melde()` | 700×162 offen | zu |

Die Kette: (1) der kleine Anschlag deckt das Erbe-Buch nicht mehr ueber
`DECKGRENZE` — also klappt die Platzordnung der STADT es nicht mehr zu;
(2) unterhalb der Entwurfsleinwand skaliert die Blattgrenze mit der
Flaeche, bei 1366×768 sind 200.000 px² nur noch 49.632 px², der Anschlag
ist dort ein ganzseitiges Blatt; (3) `raeumeAuf(false)` behaelt das
**zuletzt** ins DOM gehaengte Blatt, und das Fach DES ERBEN steht hinter
dem der FUHRE. Also blieb das Buch liegen und die Jahresentscheidung ging
zu. Dazu kaeme ein zweiter Preis: `melde()` laeuft bei jedem Zeichnen und
erzwingt ein Layout ueber die ganze Buehne — genau die Arbeit je
Bildaufbau, die der Rahmen in Welle 10 wieder ausgebaut hat, weil sie
1350 zwischen zwei Laeufen derselben Saat auseinandergehen liess.
`melde()` ist deshalb wieder heraus; die Begruendung steht im Quelltext.

---

## 3 — Die Zahlen

### 3.1 Nach 30 × WEITER, OHNE Escape — die Abnahme des Auftrags

Huellen, im Spiel gemessen (`sonde.mjs`), 2752×1536:

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| `.fu-sommerblatt` vorher | 1.351.246 | 1.351.246 | 1.145.541 | 1.504.427 px² |
| `.fu-sommerblatt` **nachher** | **181.909** | **181.909** | **171.288** | **171.288 px²** |
| `haushalt.tafeln()` vorher | 1 | 1 | 1 | 1 |
| `haushalt.tafeln()` **nachher** | **0** | **0** | **0** | **0** |
| DIE FUHRE vorher | 1.375.264 | 1.356.800 | 1.152.000 | 1.515.184 px |
| DIE FUHRE **nachher** | **189.696** | **190.464** | **175.680** | **180.880 px** |
| oberstes ⅙ DER FUHRE vorher → nachher | 140.800 → **0** | 140.800 → **0** | 140.800 → **0** | 140.800 → **0** |
| alle neun (Huellen) vorher | 44,1 % | 44,7 % | 41,3 % | 50,9 % |
| alle neun (Huellen) **nachher** | **21,7 %** | **22,2 %** | **21,4 %** | **26,4 %** |
| `ueberRand()` / `geklemmt()` nachher | 0 / leer | 0 / leer | 0 / leer | 0 / leer |
| `verdeckt()` / `lage` / Seitenfehler | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 |
| alle vier Planknoepfe „trifft" | ja | ja | ja | ja |

> **BERICHTIGUNG (Neuanlauf) — diese Tabelle stand mit falschen
> Nachher-Zahlen da, und der Fehler ist meiner.** Vier Zeilen waren nicht
> aus dem Schlusslauf `messungen/nachher-sonde-w30.txt` abgeschrieben,
> sondern aus `messungen/probe2.txt` — einem Zwischenstand von der
> Bauprobe, ein Bauschritt vor dem gemessenen Stand:
>
> | Zeile | stand da (aus `probe2.txt`) | richtig (aus `nachher-sonde-w30.txt`) |
> |---|---|---|
> | `.fu-sommerblatt` | 189.612 / 189.612 / 182.803 / 182.803 px² (716×265, 716×255) | **181.909 / 181.909 / 171.288 / 171.288 px²** (716×254, 716×239) |
> | DIE FUHRE | 195.456 / 196.480 / 187.200 / 191.984 px | **189.696 / 190.464 / 175.680 / 180.880 px** |
> | alle neun | 21,8 / 22,4 / 21,7 / 26,5 % | **21,7 / 22,2 / 21,4 / 26,4 %** |
>
> Die richtigen Zahlen sind durchweg **kleiner** — die Berichtigung faellt
> also zu meinen Gunsten aus, und genau deshalb gehoert sie erst recht
> hierher: eine Tabelle, in der Zeilen aus zwei Staenden nebeneinander
> stehen, ist keine Messung, auch wenn sie guenstig ausgeht. Die
> Vorher-Zeilen und `tafeln()` waren richtig. Nachgeprueft auf dem
> ausgelieferten Stand `3082041165` (§3.9), wo dieselben Zahlen noch einmal
> herauskommen.

### 3.2 Dieselbe Lage photographisch — das Geraet des blinden Kritikers

`fuhre-w11/messen.mjs` (= `rahmen-w10/messen.mjs`, nur der Zielordner ist
geaendert), Bildpunkte durch Differenz zweier Aufnahmen, 2752×1536,
30 × WEITER **ohne** Escape:

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| Deckung gesamt **vorher** | 48,3 % | 47,9 % | 44,8 % | 53,3 % |
| Deckung gesamt **nachher** | **22,0 %** | **22,7 %** | **21,9 %** | **26,7 %** |
| oberstes ⅙ vorher → nachher | 55,8 → **30,5** | 56,4 → **31,1** | 56,3 → **31,1** | 58,8 → **36,9 %** |
| Mittelband vorher → nachher | 56,8 → **23,6** | 56,1 → **24,5** | 51,4 → **23,4** | 63,5 → **29,1 %** |
| unterstes ⅙ | 7,0 → 7,0 | 6,7 → 6,7 | 6,6 → 6,6 | 7,2 → 7,2 % |
| **fuhre** vorher | 1.476.519 | 1.528.368 | 1.398.569 | 1.658.986 px |
| **fuhre** nachher | **342.331** | **342.202** | **328.844** | **275.433 px** |
| fuhre, oberstes ⅙ | 25,3 → **0,0** | 25,9 → **0,0** | 25,5 → **0,0** | 23,0 → **0,0 %** |
| über dem Rand | 0 → 0 | 0 → 0 | 0 → 0 | 0 → 0 |
| Währungsbruch | 0 → 0 | 0 → 0 | 0 → 0 | 0 → 0 |
| fehlende Zeichen | 0 → 0 | 0 → 0 | 0 → 0 | 0 → 0 |
| `lage` / Seitenfehler / `verdeckt()` | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 |

Das Blatt selbst, photographisch als groesster Kasten der FUHRE gemessen:
**716×254 = 181.909 px²** (1350) und **716×239 = 171.288 px²** (1970) —
gegen 1.351.246 bzw. 1.504.427 px² vorher.

**Zwei Dinge, die gegen die schoene Zahl sprechen, und sie stehen hier:**

**Erstens: photographisch deckt DIE FUHRE 342.331 px, die Huelle nur
189.696.** Der Unterschied sind Schlagschatten und der Aufschlag aus §1.2 —
die Reiterzeile der STADT aendert sich, wenn man der FUHRE die Schrift
wegnimmt. Der Anteil DER FUHRE ist damit weiter zu hoch angesetzt, und zwar
in beiden Spalten gleichermassen; das Verhaeltnis 1.476.519 → 342.331
(−77 %) traegt trotzdem.

**Zweitens: ein Teil des Gewinns ist an andere Stuecke weitergegeben, nicht
eingespart.** Die grosse Tafel hat fremde Kaesten verdeckt und die
Platzordnung der STADT dazu gebracht, fremde Bretter zuzuklappen. Der kleine
Anschlag tut das nicht mehr. Gemessen auf demselben Stand, 1970:

| | vorher | nachher |
|---|---|---|
| gegner | 319.548 px | **554.170 px** |
| erbe (1350) | 142.518 px | **208.703 px** |

Diese Zunahme ist **nicht** die Arbeit DES GEGNERS oder DES ERBEN — beide
sind auf diesem Stand unveraendert. Sie ist meine: was vorher unter meiner
Tafel lag, liegt jetzt frei. Beide Stuecke raeumen in derselben Welle in
ihre Grenzen (28.000 px); danach faellt die Summe entsprechend. Die Zahl
„Gesamtdeckung unter 20 %" ist deshalb ein gemeinsames Ergebnis der drei
und nicht meines allein: allein DIE FUHRE bringt sie auf **21,9 bis
26,7 %**.

### 3.3 Dieselbe Zahl mit dem Geraet des blinden Kritikers

`fuhre-w11/deckung.mjs` (= `bild-w9/deckung.mjs`, nur der Zielordner ist
geaendert), 30 × WEITER **ohne** Escape:

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| **vorher** | 48,8 % | 48,1 % | 44,8 % | 53,3 % |
| **nachher** | **22,1 %** | **22,7 %** | **21,9 %** | **26,7 %** |

Zwei unabhaengig gefahrene Geraete, dieselbe Zahl auf die Zehntelstelle
(`messen.mjs` sagt 22,0 / 22,7 / 21,9 / 26,7).

**Die Latte „unter 20 %" ist damit NICHT genommen** — allein DIE FUHRE
bringt sie auf 21,9 bis 26,7 %. Was fehlt, ist der Ruhezustand der anderen
Stuecke; in 1970 traegt allein DER GEGNER 13,1 % (554.170 px, Grenze
28.000). Beide Nachbarn raeumen in derselben Welle.

### 3.4 Ladezustand — unveraendert, und das ist die Absicht

`deckung.mjs` ohne `WOCHEN`, Nachstand:

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| gesamt vorher (Welle 10) | 18,1–19,3 % | | | |
| gesamt **nachher** | **18,4 %** | **19,3 %** | **18,7 %** | **19,2 %** |
| oberstes ⅙ nachher | 35,6 % | 36,0 % | 36,3 % | 37,7 % |

Ziffer fuer Ziffer der Vorzustand. Die Georgi-Tafel liegt im Ladezustand
nicht, also kann sich dort nichts bewegen.

**Eine Ausnahme, und sie geht gegen mich: in 1970 ist der Ladezustand DER
FUHRE groesser geworden.** `haushalt.miss().je.fuhre`, Huellen, im Spiel
gemessen (`vorher-sonde-laden.txt` gegen `nachher-sonde-laden.txt`):

| Ladezustand, Huellen | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| vorher | 0 px | 0 px | 0 px | **2.288 px** (2 Kaesten) |
| **nachher** | 0 px | 0 px | 0 px | **2.704 px** (2 Kaesten) |

**+416 px**, und die Ursache ist die Auflage 7 aus §1.3: die Durstbetten
`.fu-marke .fu-mbetten i` sind von `8×11` mit Rand auf `max(3px,5·s) ×
max(7px,13·s)` gefuellt umgestellt worden; die neue Form ist schmaler und
hoeher, und die Huelle faellt um 416 px groesser aus. Das sind **8 % der
Grenze von 34.000 px**, und `haushalt.pruefe()` nennt `fuhre` im
Ladezustand in keiner Epoche. Es ist trotzdem eine Zunahme, sie gehoert
mir, und sie steht hier statt in einer Fussnote.

### 3.5 Escape — die Abnahme der Auflage des Rahmens

`escapeprobe.mjs`, 30 × WEITER, dann Escape, dann Chronik auf, dann Escape:

| Epoche | Sommertafel vor → nach Escape | Chronik offen → nach Escape | `tafeln()` | `spur()` des Rahmens |
|---|---|---|---|---|
| alle vier | **true → false** | **true → zu** | **0** | nicht leer (`erb-buch -> klemme+reiter`) |

Dazu in allen vier: `lage` 0 · Seitenfehler 0 · `verdeckt()` 0.

Das ist genau der Wortlaut der Auflage: *„mit aufliegender Sommertafel
schliesst Escape sie UND der Chronikgriff des Rahmens (`kern:chronik`)
laesst sich weiter mit Escape schliessen."* Dass `spur()` nicht leer ist,
ist der zweite Teil: die Blattaufsicht des Rahmens **sieht** den Anschlag
jetzt, weil `stopPropagation()` ihr die Taste nicht mehr abnimmt.

*(Beim ersten Anlauf war der Chronik-Teil dieser Probe falsch gemessen:
ich habe die Chronik 600 ms nach Escape aufgeschlagen und damit mitten in
das Nachfassen des Rahmens hinein, das ueber 2,6 s laeuft — `spur()` zeigte
„760ms: kern .blatt rolle -> klemme+knopf:kern:blatt-zu". Die Probe wartet
jetzt 3,2 s. Der Fehler lag in meinem Messgeraet, nicht im Spiel.)*

### 3.6 Die vierte Latte und das Tor

`aufsicht/lesbarkeit.mjs` bei **1366×768**, Nachstand:

| | vorher (Welle 10) | nachher |
|---|---|---|
| Ueberlaeufe | 14 | **14** |
| Textknoten unter 12 px | 497 | **497** |
| Knoepfe unter 24 px | 0 von 307 | **0 von 307** |
| abgeschnittene Kaesten je Epoche | 3/4/3/4 | **3/4/3/4** |

Nichts ist schlechter geworden, nichts besser — die Georgi-Tafel liegt im
Ladezustand nicht, und `lesbarkeit.mjs` misst nur den Ladezustand. **Der
Anschlag selbst ist deshalb gesondert bei 1366×768 geprueft** (`sonde.mjs`,
`messungen/klein2.txt`, 30 Wochen): 700×162, alle vier Sudknoepfe 342×24 —
genau auf dem Knopfboden — und alle vier „trifft".

**Und was bei 1366×768 NICHT genommen ist, samt Zahl.** Unterhalb der
Entwurfsleinwand skaliert die Blattgrenze mit der Flaeche: aus 200.000 px²
werden 49.632 px². Gemessen nach 30 Wochen ohne Escape
(`messungen/vorher-klein1.txt` gegen `messungen/klein2.txt`):

| 1366×768, 30 Wochen, E1 | vorher | nachher |
|---|---|---|
| `.fu-sommerblatt` | 792×492 = **390.129 px²** | 700×162 = **113.542 px²** (−70,9 %) |
| `haushalt.tafeln()` | **2** | **2** |
| DIE FUHRE (Huellen) | 1.594.887 px | **469.847 px** (−70,5 %) |
| oberstes ⅙ DER FUHRE | 141.122 px | **0 px** |
| Planknoepfe | 234/229/311/177 × 26, alle „trifft" | 342×24, alle „trifft" |

**`tafeln()` ist dort vorher wie nachher 2 und wird von meiner Arbeit nicht
leer.** Die Abnahme des Auftrags nennt die Schwelle ausdruecklich fuer
2752×1536 (`haushalt.js:74`, Auflage A16), und dort ist sie genommen; bei
1366×768 ist sie es nicht, sie war es vorher aber auch nicht, und die Zahl
darunter ist auf ein Drittel gefallen. Wer „hoechstens ein ganzseitiges
Blatt" auch auf kleinen Schirmen will, braucht entweder eine Grenze, die
nicht mitskaliert, oder eine Tafel, die unterhalb der Leinwand ihre
absoluten Boeden aufgibt — und das kostet die vierte Latte.

`aufsicht/tor.mjs`: **TOR OFFEN**, E1–E4 je `lage=0 fehler=0`,
99/107/110/102 Zuege.
`aufsicht/spielprobe.mjs`: **BESTANDEN**, 60 Wochen je Epoche, `lage 0`,
`Fehler 0`.

### 3.6b Das Gewichtsveto — nachgerechnet, ohne Browser

Punkt 4 unter „Was nicht kaputtgehen darf": 8 MB je Epoche, heute
6,33/7,70/6,65/4,71. Die knappste Epoche (1600) hat 0,30 MB Luft. Was DIE
FUHRE dazulegt, ist reiner Text und laesst sich abzaehlen:

| Datei | `7896ee6` | heute | Zuwachs |
|---|---|---|---|
| `spiel/stuecke/fuhre.js` | 208.833 B | 219.484 B | +10.651 B |
| `spiel/stil/fuhre.css` | 26.781 B | 34.806 B | +8.025 B |
| `spiel/bild/fuhre/**`, `spiel/ton/fuhre/**` | — | — | **0 B, keine Datei angefasst** |

**+18.676 B = 0,018 MB**, also 6 % der Luft der knappsten Epoche, und der
groessere Teil davon ist Kommentar. Kein Bild und kein Ton ist dazugekommen
oder ausgetauscht (`git diff 7896ee6 HEAD -- spiel/bild/fuhre spiel/ton/fuhre`
ist leer). Das Veto ist damit ohne Browser entschieden; ein Messlauf dafuer
waere Messzeit, die ein anderes Stueck braucht.

### 3.7 ρ — die zweite Messlatte

`rueckkopplung-r3/linie.mjs` unveraendert, 400 Wochen je Epoche, Saat 1350,
je Epoche EIN Lauf, jeder einzeln durchs Messfenster. Ausgewertet mit
`fuhre-w6/schnitte.py` (drei Schnitte) und `rueckkopplung-r3/auswerten.py`
(Jahre unter 1×).

**NACHHER** (Nachstand 8952, `messungen/rho-nachher/`):

| Epoche | 12 J | 13 J | 14 J | Jahre < 1× | Kasse | Fehler |
|---|---|---|---|---|---|---|
| 1350 | +0,252 | +0,181 | **+0,191** | **0/14** | 8–514 | 0 |
| 1600 | −0,189 | +0,049 | **−0,116** | **0/14** | 291–2851 | 0 |
| 1884 | +0,168 | +0,346 | **+0,393** | **1/14** | 1757–23789 | 0 |
| 1970 | −0,112 | −0,236 | **−0,304** | **1/14** | 320–95857 | 0 |

**Die Latte haelt in allen vier Epochen** (groesster Wert 0,393, Latte
0,700), und die Jahre unter 1× liegen mit 0/0/1/1 von 14 unter der
Erlaubnis (ein Jahr von sechs = 2,33 von 14).

**VORHER** — beim Neuanlauf vervollstaendigt. `messungen/rho-vorher/`,
Vorzustand `7896ee6` auf Hafen 8951, dieselbe Maschine, dieselbe Saat.
1970 fehlte, weil der Container-Reset genau diesen Lauf getroffen hat; er
ist nachgeholt (21:29–21:45 UTC):

| Epoche | 12 J | 13 J | 14 J | Jahre < 1× | Kasse | Fehler |
|---|---|---|---|---|---|---|
| 1350 (a) | −0,245 | −0,170 | **−0,336** | **2/14** | 28–524 | 0 |
| 1350 (b) | −0,245 | −0,170 | **−0,336** | **2/14** | 28–524 | 0 |
| 1600 | −0,189 | +0,049 | **−0,116** | **0/14** | 291–2851 | 0 |
| 1884 | +0,168 | +0,346 | **+0,393** | **1/14** | 1757–23789 | 0 |
| 1970 | −0,112 | −0,236 | **−0,304** | **1/14** | 320–95857 | 0 |

#### Und dann ist die Probe schaerfer gemacht worden, als „Ziffer fuer Ziffer"

Der erste Anlauf hatte die abgeleiteten Kennzahlen verglichen. Jetzt sind
die **Rohdaten** verglichen, Feld fuer Feld, mit `json.load` und `!=`:

| | Felder, die sich unterscheiden |
|---|---|
| **1600** | `hafen: 8951` gegen `8952` — **sonst keines** |
| **1884** | `hafen: 8951` gegen `8952` — **sonst keines** |
| **1970** | `hafen: 8951` gegen `8952` — **sonst keines** |
| 1350 | `reihe` (339 von 400 Wochen, erste Abweichung Woche 61), `jahre` (12/14), `leiter`, `leiterRoh`, `kasseMin` 28→8, `kasseMax` 524→514, `schluss.kasse` 117→98 |

**In drei von vier Epochen ist der einzige Unterschied zwischen Vorzustand
und Nachstand die Hafennummer im Messprotokoll.** Alle 400 Wochen, jede
Kennzahl, jeder Kassenstand, jeder Zug: dieselbe Partie, Feld fuer Feld.
Das ist mehr, als „dieselben drei Schnitte" sagt — dieselben drei Schnitte
koennten aus verschiedenen Partien kommen. Diese hier sind es nicht.

Nachzustellen mit

```
python3 - <<'EOF'
import json
for e in (1,2,3,4):
    a=json.load(open(f'…/rho-vorher/e{e}-a.json'))
    b=json.load(open(f'…/rho-nachher/e{e}-a.json'))
    print(e, [k for k in a if a[k]!=b[k]])
EOF
```

**1350 ist es nicht, und das steht hier, weil es gegen die einfache
Erzaehlung spricht.** Der Rahmen hat fuer 1350 auf demselben Stand ZWEI
verschiedene Reihen gemessen — Satz A und C −0,336 (Kasse 28–524, 2/14
Jahre unter 1×), Satz B +0,270 (Kasse 34–583, 0/14) — und das ausdruecklich
als **Geraetebefund** vermerkt: „elf Laeufe sind Ziffer fuer Ziffer der
Vorzustand und einer ist es nicht, und bei gesaetem Wuerfel ist das kein
Streuungsmass". Mein Lauf liefert eine dritte Zahl (+0,191, Kasse 8–514,
0/14) und liegt damit auf dem Ast von Satz B (positives ρ, 0 Jahre unter
1×). Beide Aeste bestehen die Latte deutlich.

**Der eigene Vorher-Lauf ist gefahren, und er spricht gegen mich.**
`messungen/rho-vorher/e1-a.json`, `7896ee6`, heute, dieselbe Maschine:

| 1350 | 12 J | 13 J | 14 J | Jahre < 1× | Kasse |
|---|---|---|---|---|---|
| **vorher** (7896ee6) | −0,245 | −0,170 | **−0,336** | **2/14** | 237→66, 28–524 |
| **nachher** | +0,252 | +0,181 | **+0,191** | **0/14** | 237→110, 8–514 |

Der Vorzustand liefert heute Ziffer fuer Ziffer den Satz A des Rahmens.
**Meine Fassung liefert etwas anderes.** Die Kennzahlreihe laeuft in den
ersten drei Braujahren gleich (5,89 · 1,43 · 3,42) und geht im **vierten**
auseinander (2,41 gegen 3,32). Auf die Woche genau, aus dem Feldvergleich
der Rohdaten: **die erste abweichende Woche ist Woche 61**; von den 400
Wochen sind danach 339 verschieden.

**Der Vorher-Satz reproduziert die Grundlinie des Auftrags punktgenau**,
und das ist die Probe darauf, dass die Maschine heute misst wie am
6. August: `gauntlet/WELLE-11.md` nennt als „heute" **2/0/1/1 von 14**
Braujahre unter 1× — meine vier Vorher-Laeufe liefern 2 (1350), 0 (1600),
1 (1884), 1 (1970). Dieselbe Reihe. Der groesste Vorher-Wert ist 0,393
(1884), auch das die Zahl aus dem Auftrag.

**Was ich dazu weiss, und was ich nicht weiss.** Der Nenner sagt, dass es
eine andere Partie ist, nicht eine andere Rechnung: vorher gewinnt die
Nennerzeile in 400 von 400 Wochen ohne Zugschluessel und mit der Art
`umkaempft` (das ist DER GEGNER), nachher in 242 von 400 — dazwischen
144 Wochen `bindung` und 14 `lage`, also Zuege DER FUHRE selbst.
**Der wahrscheinliche Weg dahin liegt in der messenden Hand und nicht im
Spiel:** `linie.mjs:klick()` klickt, wenn ein Knopf nicht getroffen wird,
DER REIHE NACH JEDEN Reiter der STADT, bis er trifft — und jeder dieser
Klicks ist ein Umschalter, der Bretter auf- und zuklappt. Wie oft dieser
Notweg gegangen wird, haengt daran, was gerade wie gross wo liegt. Eine
kleinere Georgi-Tafel deckt weniger zu, also faellt der Notweg oefter weg,
also bleiben andere Bretter offen, also findet die Hand in spaeteren Wochen
andere Knoepfe. Belegen kann ich diese Kette nicht — dazu muesste ich die
Hand mitschreiben lassen, und an fremden Messgeraeten wird nicht gedreht.

**Und dann habe ich 1350 auf BEIDEN Staenden ein zweites Mal gefahren,
weil eine Zahl aus einem Lauf bei dieser Epoche nichts wert ist:**

| 1350, 400 Wochen, Saat 1350 | Lauf a | Lauf b | Spannweite | Jahre < 1× |
|---|---|---|---|---|
| **Vorzustand 7896ee6** | −0,336 | **−0,336** | **0,000** | 2/14 · 2/14 |
| **Nachstand** | +0,191 | **−0,160** | **0,352** | 0/14 · 2/14 |

**Das ist der Befund, und er spricht gegen mich:** der Vorzustand liefert
heute zweimal dieselbe Reihe, mein Stand zweimal verschiedene. Die
Epoche 1350 war schon beim Rahmen die eine, die auf dem UNVERAENDERTEN
Stand zwischen Laeufen umgesprungen ist (Satz A/C −0,336, Satz B +0,270) —
aber ich kann nicht behaupten, dass ich nur eine vorhandene Zweideutigkeit
sichtbar mache. Zwei Laeufe je Stand sind zu wenig fuer diese Aussage; was
sie zeigen, ist: **auf meinem Stand ist 1350 in zwei von zwei Laeufen nicht
dieselbe Partie, auf dem Vorzustand in zwei von zwei Laeufen schon.**

*Was das nicht ist:* eine gerissene Latte. Alle vier Werte fuer 1350
(−0,336, −0,336, +0,191, −0,160) liegen weit unter 0,700, und die Jahre
unter 1× bleiben in jedem Lauf bei hoechstens 2 von 14 (erlaubt 2,33).

**Was trotzdem feststeht:**
* Beide Reihen bestehen die Latte mit grossem Abstand (0,336 und 0,191
  gegen 0,700), und der groesste Wert aller vier Epochen ist unveraendert
  0,393 (1884).
* Die Jahre unter 1× sind **besser** geworden: 2/0/1/1 → **0/0/1/1** von
  14, erlaubt sind 2,33.
* **1600, 1884 und 1970 sind nicht nur „Ziffer fuer Ziffer" gleich, sondern
  im Rohdatenfeldvergleich bis auf die Hafennummer identisch** — 400 von
  400 Wochen dieselbe Partie. Die Aussage steht auf drei eigenen
  Vorher-Laeufen, nicht auf den Zahlen des Rahmens.
* 1350 ist die Epoche, die schon beim Rahmen auf dem UNVERAENDERTEN Stand
  zwischen zwei Laeufen umgesprungen ist (Satz B: +0,270, 0/14). Meine
  Abweichung beginnt dort in Woche 61.
* Der Vorher-Satz reproduziert die Grundlinie des Auftrags punktgenau:
  Jahre unter 1× **2/0/1/1 von 14**, groesster Wert **0,393** (1884) —
  beides die Zahlen aus `gauntlet/WELLE-11.md`.

**Damit ist die zweite Messlatte fuer DIE FUHRE so belegt, wie sie zu
belegen ist:** in drei Epochen durch Gleichheit der Partie, in der vierten
durch Abstand zur Latte (groesster Betrag 0,336 von 0,700) bei einer
Epoche, die auch unveraendert nicht stabil ist.


### 3.8 Welche Fassung gemessen wurde — jetzt in `git` nachstellbar

Der Nachstand, auf dem §3.1–3.7 gemessen wurden, trug die Marke
`7896ee6+118b191467`. Diese Marke ist die Pruefsumme der eingespielten
Stueckdateien (`nachstand.sh`), und sie laesst sich einem Commit zuordnen.
Beim Neuanlauf nachgerechnet, ueber alle Commits, die `fuhre.js` oder
`fuhre.css` in dieser Welle angefasst haben:

| Commit | Marke | Zeit |
|---|---|---|
| `8ccdc7a` | `cf76271455` | 17:52:23 ← **Arbeitsbaum heute** |
| `d1d758f` | `1d4855fe23` | 17:49:21 |
| **`91fb766`** | **`118b191467`** | **17:40:15 ← gemessen** |
| `ae2fb18` | `eb8799232a` | 17:34:11 |

Nachzurechnen mit

```
git archive <commit> spiel/stuecke spiel/stil | tar -x -C /tmp/x
( cd /tmp/x && LC_ALL=C ls spiel/stuecke/fuhre*.js spiel/stil/fuhre*.css \
  | LC_ALL=C sort | xargs md5sum | md5sum | cut -c1-10 )
```

**Der gemessene Stand ist `91fb766`. Was seither dazugekommen ist, sind
zwei Commits, und sie enthalten ausschliesslich Kommentar:**

```
git diff 91fb766 HEAD -- spiel/stuecke/fuhre.js spiel/stil/fuhre.css
```

Der Diff liegt **vollstaendig innerhalb von `/* … */`**: berichtigte Zahlen
in den Erklaerkoepfen (`20%/560px` → `26%/700px`, `4,2 %` → `4,5 %`, der
Hinweis auf F1, dass nur noch der Fuss klebt) und die Berichtigung aus §2.

**Und das ist nicht nach Augenschein gesagt, sondern ausgerechnet.** Ein
kleiner Schnitzer entfernt aus beiden Fassungen jeden Kommentar (`/*…*/`
und `//`, Zeichenketten dabei geschont) und presst den Rest auf einfache
Leerzeichen:

| ohne Kommentare, `91fb766` gegen Arbeitsbaum | |
|---|---|
| `spiel/stuecke/fuhre.js` | **IDENTISCH**, 110.490 gegen 110.490 Zeichen |
| `spiel/stil/fuhre.css` | **IDENTISCH**, 22.498 gegen 22.498 Zeichen |

Keine Regel, kein Selektor, keine Anweisung, kein Zeichen Code ist
verschieden. Die Zahlen aus §3.1–3.7 gelten damit unveraendert fuer den
Stand, der ausgeliefert wird. Die alte Fassung dieses Abschnitts verwies auf zwei Diffs
gegen `/tmp/fuhrestand/…`; die hat der Container-Reset genommen, und ein
Beleg, der einen Neustart nicht ueberlebt, ist kein Beleg. Der Weg ueber
`git` ist von jedem Behaelter aus derselbe.

**Beim Neuanlauf ist noch ein dritter Kommentar dazugekommen** — die
Berichtigung von „nichts steht nur noch im Titelfeld" (§2). Der Stand, auf
dem die Abnahme des Neuanlaufs (§3.9) laeuft, traegt deshalb die Marke
**`7896ee6+3082041165`** (`messungen/abn-marke.txt`). Die drei Marken
`118b191467` → `cf76271455` → `3082041165` unterscheiden sich untereinander
**ausschliesslich** im Text zwischen `/* … */`; nachzurechnen mit dem
`git diff` oben. Weil „sollte dasselbe messen" kein Messwert ist, ist auf
der letzten Marke noch einmal gemessen worden — §3.9.

---

### 3.9 Die Abnahme auf dem Stand, der ausgeliefert wird

`abnahme.sh`, Marke **`7896ee6+3082041165`** (`messungen/abn-marke.txt`),
jeder Lauf einzeln durchs Messfenster. Der Grund steht in §3.8: die Zahlen
aus §3.1–3.7 stehen auf `118b191467`, und „nur Kommentar geaendert" ist ein
Argument, kein Messwert.

**30 × WEITER, ohne Escape, 2752×1536** (`messungen/abn-sonde-w30.txt`):

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| `haushalt.tafeln()` | **0** | **0** | **0** | **0** |
| `.fu-sommerblatt` | 716×254 = **181.909** | 716×254 = **181.909** | 716×239 = **171.288** | 716×239 = **171.288 px²** |
| DIE FUHRE (Huellen) | 189.696 | 190.464 | 175.680 | 180.880 px |
| oberstes ⅙ DER FUHRE | **0** | **0** | **0** | **0 px** / 10.000 |
| alle neun (Huellen) | 21,7 % | 22,2 % | 21,4 % | 26,4 % |
| `ueberRand()` · `geklemmt()` | 0 · leer | 0 · leer | 0 · leer | 0 · leer |
| `lage` · Seitenfehler · `verdeckt()` | 0·0·0 | 0·0·0 | 0·0·0 | 0·0·0 |
| vier Planknoepfe | 340×31/46, alle **trifft** | dito | dito | dito |

**Bis auf 16 px in einer einzigen Zelle des 4-px-Rasters (1350: 917.760
gegen 917.744) ist das Ziffer fuer Ziffer der Lauf `nachher-sonde-w30.txt`
vom Stand `118b191467`.** Die drei Kommentar-Marken messen also wirklich
dasselbe, und jetzt steht es als Zahl da statt als Zusicherung.

**Der Arbeitsbaum ist waehrend dieser Abnahme noch zweimal angefasst
worden** — beide Male, um eine falsche Zahl in einem Kommentar zu
berichtigen (§2 und die Masse der Tafel). Dass auch das nichts am Code
aendert, ist mit demselben Schnitzer geprueft wie in §3.8:
`fuhre.js` 110.490 gegen 110.490 Zeichen, `fuhre.css` 22.498 gegen 22.498,
ohne Kommentare **identisch**.

---

## 4 — Was DIE FUHRE weiter offen laesst, mit Datei, Zahl und Abnahme

Damit es niemand suchen muss, und weil es gegen meine eigene Zahl spricht:
**der 30-Wochen-Zustand ist nicht der einzige, in dem dieses Stueck ein
formatfuellendes Blatt legt.** Zwei weitere kommen spaeter in der Partie und
sind von der Abnahme dieser Welle nicht erfasst:

| Blatt | Datei · Zeile | Mass (2752×1536) | wann |
|---|---|---|---|
| `.fu-ausgangblatt` (Antrag · Übergabe) | `stil/fuhre-zusatz.css:600` | 56 % × 46,5–70 % = **1.542×714 bis 1.075** = 1,10 bis 1,66 Mio px² | Michaeli, sobald ein Antrag vorliegt bzw. das Haus uebergeben werden darf |
| `.fu-schlussblatt` | `stil/fuhre-zusatz.css:357` | 56 % × bis 80 % = **1.542×1.229** = bis 1,89 Mio px² | am Ende der Partie |

Beide sind mit **Absicht** so gross: der Kopf von `fuhre-zusatz.css:580`
rechnet vor, dass die Platzordnung der STADT ein Blatt zum Jahreswechsel
erst ab 25 % der Buehne von selbst aufschlaegt (`stadt.js:1408`). Diese
Rechnung gilt fuer die Georgi-Tafel nicht mehr — sie schlaegt auch klein
auf, weil ein Brett, das WAEHREND des Spiels neu auftaucht, der Ordnung als
eben geholt gilt (nachgemessen, §3.1: `Sommerblatt true` in allen vier
Epochen). **Damit ist die Begruendung fuer die 26 % auch bei den
Ausgangblaettern hinfaellig**, und dieselbe Trennung — Anschlag liegt,
Bestand klappt auf — traegt dort ohne Aenderung am Spiel.
Ich habe es nicht mehr gemacht, weil jede weitere Aenderung an
`stuecke/fuhre*.js` die ρ-Messung dieser Welle ungueltig gemacht haette.
*Abnahme fuer den, der es aufnimmt:* `haushalt.tafeln()` bleibt auch dann
leer, wenn `BRAUHAUS.fuhre.stand().antrag` nicht null ist.

---

## 5 — Was in diesem Ordner liegt

| Datei | wozu |
|---|---|
| `sonde.mjs` | die Innensicht: `haushalt.miss()/tafeln()/pruefe()/ueberRand()`, dazu jeder SICHTBARE Kasten der FUHRE ueber 15.000 px² und ob die vier Planknoepfe sich selbst treffen. Schnell (20 s je Epoche), deshalb das Geraet zum Bauen. `BREITE`/`HOEHE` waehlbar |
| `messen.mjs` | = `rahmen-w10/messen.mjs`, nur Zielordner und `EPOCHEN` ergaenzt — photographisch, je Stueck |
| `deckung.mjs` | = `bild-w9/deckung.mjs` des blinden Kritikers, nur Zielordner und `EPOCHEN` ergaenzt |
| `warum.mjs` | die Gegenprobe zu den 169.305 px: stellt den Stueck-Durchgang nach und zeigt, WO der Unterschied liegt (§1.2) |
| `blick.mjs` | Aufnahmen von Anschlag und aufgeschlagenem Bericht, plus Masse und Trefferprobe |
| `escapeprobe.mjs` | die Abnahme der Rahmen-Auflage: Escape schliesst die Tafel UND die Chronik bleibt mit Escape schliessbar |
| `nachstand.sh` | friert `7896ee6` + **nur** die Dateien DER FUHRE ein (Builder duerfen nicht committen) |
| `vorher.sh` · `nachher.sh` · `rho.sh` · `rho1350.sh` | die Messsaetze, jeder Lauf einzeln durchs Messfenster |
| **`abnahme.sh`** | **neu beim Neuanlauf**: die Abnahme auf dem Stand, der wirklich ausgeliefert wird (`cf76271455`), dazu die drei Laeufe, die beim ersten Anlauf gefehlt haben — Escape-Probe auf dem VORZUSTAND, `warum.mjs` mit Ausgabe in eine Datei statt auf die Konsole, und die gemeinsame Deckung aller drei Stuecke |
| `messungen/` | alle Rohdaten. `vorher-*` = `7896ee6`, `nachher-*` = Nachstand `118b191467`, `abn-*` = Endstand `cf76271455`, `gemeinsam-*` = ganzer Arbeitsbaum |
| `bilder/` | **wandert nicht mit** (`.gitignore:67`, `**/schuss/**/*.png`). Wer die Aufnahmen braucht, stellt sie mit `blick.mjs`/`warum.mjs` in Minuten wieder her. Deshalb steht seit dem Neuanlauf jede Aussage, die vorher nur ein Bild trug, auch als Zahl in `messungen/` |


---

## 6 — Was diese Runde fuer ANDERE gefunden hat

1. **`gauntlet/WELLE-11.md`, Spalte „heute": die Zahlen des Ladezustands
   sind zu hoch, und zwar systematisch.** `rahmen-w10/messen.mjs` schreibt
   jedem Stueck die Aenderung zu, die das Ausblenden seiner Schrift in der
   **Reiterzeile der STADT** ausloest. Fuer DIE FUHRE sind das die vollen
   169.305 px (nachgewiesen: die Huelle ist 0 px, und die Zahl ist vorher
   wie nachher dieselbe). Jedes Stueck, dessen Bretter die STADT zuklappt,
   traegt denselben Aufschlag. Wer nach diesen Zahlen baut, jagt zum Teil
   ein Messgeraet. `BRAUHAUS.haushalt.miss()` ist die verlaessliche Zahl.

2. **Auflage 7 des blinden Kritikers ist kein Schriftproblem** (§1.3). Die
   „zwei leeren Rechtecke in Rot" unter „FAE" und „BRU" sind
   `.fu-marke .fu-mbetten i` DER FUHRE. Behoben. Der Rahmen hat in Welle 10
   richtig gemessen, dass kein Zeichen fehlt — es fehlte auch keines.

3. **DER GEGNER und DAS ERBE bekommen durch meine Arbeit mehr Flaeche, nicht
   weniger** (§3.2). Was unter der grossen Georgi-Tafel lag, liegt jetzt
   frei: in 1970 waechst DER GEGNER von 319.548 auf 554.170 px, in 1350 DAS
   ERBE von 142.518 auf 208.703 px — auf einem Stand, auf dem beide
   Stuecke unveraendert sind. Beide raeumen in derselben Welle; die Rechnung
   geht erst zusammen auf.

4. **`erb-buch` schlaegt bei 1366×768 nach 30 Wochen auf, sobald es nicht
   mehr zugedeckt wird** (§2, F2). Auf dem Vorzustand blieb es zu — aber
   nur, weil die grosse Sommertafel es ueber `DECKGRENZE` verdeckte und die
   Platzordnung es deshalb zuklappte. Das ist kein Verschluss, das ist ein
   Zufall. DAS ERBE sollte es wissen.

5. **`raeumeAuf(false)` des Rahmens entscheidet den Gleichstand nach der
   DOM-Reihenfolge der Faecher** und bevorzugt damit systematisch das Fach,
   das spaeter in `index.html` steht. Bei 1366×768 hat das die
   Jahresentscheidung DER FUHRE gegen ein Buch verloren, das keinen eigenen
   Schliessknopf hat (§2, F2). Wenn Welle 12 „hoechstens ein ganzseitiges
   Blatt" lueckenlos will, braucht der Tiebreak ein besseres Mass als die
   Ladereihenfolge — zum Beispiel „das juengste zuletzt aufgeschlagene",
   wie es die STADT mit `aufZeit` schon fuehrt.

6. **`linie.mjs` ist layoutempfindlich, und das ist die Erklaerung fuer
   1350** (§3.7). Ihr `klick()` klickt bei einem nicht getroffenen Knopf
   der Reihe nach JEDEN Reiter der STADT — jeder davon ein Umschalter. Wie
   oft dieser Notweg noetig ist, haengt daran, was gerade wie gross wo
   liegt. Eine Kennzahl, die davon abhaengt, misst das Spiel nur zum Teil.

7. **DEM RAHMEN: die Grenze `fuhre: 34.000 px` steht auf einem Konto, das
   DIE FUHRE nicht fuehrt** (§1.2b). `haushalt.js:97` begruendet sie mit
   „vier Reiter und die Hofanzeige"; die vier Reiter baut aber
   `stadt.js:742 zeichneReiter()` als `.stadt-reiter` in der
   `.stadt-reiterzeile` im Fach DER STADT, und `haushalt.js:186` ordnet
   nach `closest('.fach')` zu. Ergebnis: `fuhre` misst 0 px, `stadt` misst
   152.688 gegen 40.000 — und dieselben Bildpunkte heissen beim
   photographischen Geraet 169.305 px `fuhre`. **Beide Grenzen sind so
   nicht erreichbar**, weil keines der beiden Stuecke die Kaesten allein in
   der Hand hat. Der Reiter weiss ueber `b.schluessel` bereits, zu welchem
   Brett er gehoert; eine Zuordnung danach — oder ein eigenes Konto
   `reiterzeile` — wuerde beide Zahlen ehrlich machen. Das ist eine
   Aenderung am Skelett und gehoert nicht einem Stueck.

8. **DEM ERBEN, mit Zahl: nach 30 Wochen und Escape muss die Blattaufsicht
   `erb-buch` festhalten.** `messungen/nachher-escape.txt`, alle vier
   Epochen: `geklemmt {"erbe .erb-buch blatt":1}`, `spur` sagt
   `erbe .erb-buch blatt -> klemme+reiter:stadt:reiter:erbe-blatt-erb-buch`
   — der Rahmen findet keinen eigenen Griff und muss auf einen fremden
   Reiter ausweichen. Das ist woertlich die Auflage DES ERBEN
   („`haushalt.geklemmt()` bleibt nach Escape leer"). **Der Vergleichslauf
   auf dem Vorzustand steht in `messungen/vorher-escape.txt`** (beim
   Neuanlauf nachgeholt, weil die Nachher-Zeile ohne ihn nicht zu deuten
   ist): siehe §3.5b.
