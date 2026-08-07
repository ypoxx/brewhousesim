# Urteil Welle 12 — DIE SPIELPROBE

*Frischer Kritiker, zweite Messlatte (`gauntlet/MESSLATTE.md` §2). Gespielt, nicht gelesen.
Messstand `3d9f5c2` auf Hafen 8911, Saat 1350, jede Sitzung einzeln durch
`werkbank/schuss/aufsicht/messfenster.sh`.*

**Was ich gelesen habe:** `gauntlet/MESSLATTE.md`, `spiel/LIESMICH.md`, Teile des
Quelltextes unter `spiel/` (nur so weit, wie ich die Knopfnamen zum Bedienen brauchte),
`werkbank/schuss/aufsicht/messfenster.sh`, `messstand.sh`,
`werkbank/schuss/rueckkopplung-r3/linie.mjs`.
**Was ich nicht geöffnet habe:** `werkbank/urteile/**`, `werkbank/LAUFENDER-AUFTRAG.md`,
`gauntlet/WELLE-*.md`, `werkbank/stand.json`, irgendeinen Builder-Bericht, irgendeine
git-Historie. `spiel/BEFUND-BRETTER.md`, `spiel/BEFUND-ENDE.md` und
`spiel/BEFUND-WIRTSCHAFT.md` habe ich **bewusst nicht** geöffnet, obwohl sie unter `spiel/`
liegen — es sind Befunde, kein Quelltext.

---

## 0 · In Arbeit

Dieses Papier wird **während** der Prüfung geschrieben, nicht danach. Was hier steht, ist
gemessen; was fehlt, ist noch nicht gespielt.

| Sitzung | Stand |
|---|---|
| Gerät gebaut, Rauchprobe 1350 (3 min, 150 Klicks) | fertig |
| Wiederkehr-Probe (Neuladen) | fertig |
| 1350 · 20 Minuten, erste Hand (verhungert) | fertig |
| 1350 · 20 Minuten, zweite Hand | offen |
| 1600 · 20 Minuten | offen |
| 1884 · 20 Minuten | offen |
| 1970 · 20 Minuten | offen |

---

## 1 · Wie ich gespielt habe

**Nicht** `el.click()`. Jeder einzelne Zug ist `mouse.move` auf die Mitte der wirklichen
Knopffläche, `mouse.down`, 65 ms halten, `mouse.up` — und vorher wird mit
`document.elementFromPoint` geprüft, dass unter dem Zeiger auch wirklich dieser Knopf liegt
und nicht ein Brett darüber. Was nicht unter dem Zeiger lag, gilt als **nicht gegriffen** und
steht so im Protokoll (`nicht-zu-greifen`).

Fenster **1600×900** — ein gewöhnlicher Notebook-Schirm, nicht die Entwurfsleinwand
(2752×1536) und nicht die 1920×1000 der Messhand. Zusätzlich ein Blick bei 1366×768.

Gerät: `werkbank/schuss/spiel-w12/hand2.mjs`, Protokolle als JSONL unter
`werkbank/schuss/spiel-w12/protokoll/`, Bildschirmfotos unter `…/schuesse/`.

**Eine Panne, die ich selbst verursacht habe und die hier steht, damit niemand die Zahlen
falsch liest:** Bei einem Syntaxtest habe ich die Spielhand versehentlich importiert und
damit ausgeführt. Sie hat für rund vier Minuten einen **zweiten Browser neben dem
Messfenster** gestartet und dabei das Protokoll der ersten 1350-Sitzung überschrieben. Die
erste 1350-Sitzung ist damit **verworfen**; 1350 wurde vollständig neu gespielt. Die
Beobachtungen aus der verworfenen Sitzung, die nicht an Zahlen hängen (verhungertes Haus,
tote Reiter unter der Michaelitafel), führe ich als *Beobachtung*, nicht als *Messwert*.

### Klickprotokoll · Sitzung 1350 (20,1 Minuten)

| | |
|---|---|
| gespielte Wochen | **284** (1350/1 bis 1359/15, zehn Braujahre) |
| echte Mausklicks | **1.494** |
| Klicks, die ins Leere gingen | **0** |
| Klicks, die nur ein Brett aufschlagen sollten | 74 |
| verschiedene Züge, die je greifbar waren | **152** |
| Seitenfehler · `BRAUHAUS.lage` | **0 · 0** |
| Kasse Anfang → Ende | 112 → 17 Pf |

Die zehn häufigsten Klicks dieser Sitzung sind vier Knöpfe: `fuhre:tafel-auf:grut` (178×),
`fuhre:wie-vorige` (86×), `fuhre:abschicken` (84×), `weiter` (9×). **Das ist die Partie:
zwei Knöpfe, die Woche für Woche dasselbe tun.** Alles andere kam zusammen auf unter
30 Klicks in zehn Spieljahren.

---

## 2 · Die Zählung je Epoche

Alles gezählt **am Bildschirm**: „greifbar" heißt, der Knopf hat eine Fläche, liegt im
Sichtfeld, ist nicht abgeschaltet, und `elementFromPoint` auf seiner Mitte trifft ihn —
also: ich hätte hinklicken können. „bezahlbar" heißt zusätzlich: der Preis am Knopf ist
nicht größer als die Kasse in derselben Woche.

| | **1350** | **1600** | **1884** | **1970** |
|---|---|---|---|---|
| Minuten gespielt | 20,1 | 20,1 | 20,0 | 10,6 *(das Spiel endete)* |
| Wochen · Braujahre | 284 · 1350–1359 | 310 · 1600–1610 | 308 · 1884–1894 | 128 · 1970–1974 |
| echte Mausklicks | 1.494 | 838 | 821 | 343 |
| Klicks, die ins Leere gingen | 0 | 93 | 106 | 61 |
| zusätzliche Klicks, nur um ein Brett zu suchen | 74 | 1.089 | 1.062 | 709 |
| **greifbare Züge, Median je Woche** | **48** | **54** | **50** | **48** |
| **davon mit Preisschild, Median** | **7** | **10** | **11** | **7** |
| **davon bezahlbar, Median** | **2** | **3** | **7** | **0** |
| Wochen ohne *eine* bezahlbare Preisoption | **127 von 284** | 20 von 310 | 7 von 308 | **70 von 128** |
| Wochen mit ≥ 2 bezahlbaren | 153 | 271 | 300 | 51 |
| Michaelitafeln, die ich zu sehen bekam | 4 | 22 | 22 | 10 |
| davon **nur nach Suche** | **3** | **21** | **21** | **9** |
| größte bewiesen einander ausschließende Gruppe | **4** | **4** | **6** | **5** |
| Deckung (Kasse ÷ nächster sinnvoller Zug), Median | **0,16×** | **0,61×** | **0,62×** | **0,08×** |
| Wochen mit Deckung unter 1× | **250 von 284** | 212 von 310 | 178 von 308 | **102 von 128** |
| Kasse Anfang → Ende | 112 → 17 Pf | 640 → 179 fl | 14.250 → 5.028 M | 86.000 → 17.435 DM |
| Gegnerzüge, die ohne mich geschahen | **140** | **151** | **96** | **70** |
| Wochen, in denen der Gegner zog | 125 | 138 | 92 | 61 |
| Züge, die ich gegen ihn getan habe | **0** | **4** | **1** | **0** |
| unwiderrufliche Festlegungen getroffen | **0** | 1 | 1 | **0** |
| `BRAUHAUS.lage` · Seitenfehler | 0 · 0 | 0 · 0 | 0 · 0 | 0 · 0 |

**Die Kasse fällt in allen vier Epochen.** Nicht einmal ist sie am Ende der Sitzung höher
als am Anfang. Das ist bemerkenswert, weil die Latte ausdrücklich gegen die
*Wohlstandssingularität* von Patrizier gebaut ist — dieses Spiel hat die entgegengesetzte
Kurve, und sie ist nicht besser: die Deckung, also genau die Zahl, um die es der Latte
geht, liegt im Median zwischen **0,08×** und **0,62×** und in **742 von 1.030 gespielten
Wochen unter 1×**. In sieben von zehn Wochen konnte ich den Zug, den das Spiel selbst
unten am Rand als den nächsten sinnvollen ausweist, **nicht bezahlen**.

### Punkt 1 der Latte — Entscheidungen mit Preisschild nebeneinander, die einander ausschließen

**Es gibt sie, und sie sind echt — aber sie liegen alle auf einem einzigen Brett, das
einmal im Jahr auftaucht und das man suchen muss.**

Der Ausschluss ist nicht behauptet, sondern **gemessen**: ich habe auf der Michaelitafel
zugegriffen und danach denselben Schirm noch einmal abgelesen.

| Epoche · genommen | danach noch offen | danach abgeschaltet |
|---|---|---|
| 1350 · `preis:nimm:dach` | 1 Angebot | **3 Angebote, 3 Festlegungen** |
| 1600 · `preis:nimm:darre` | 1 Festlegung | **4 Angebote, 3 Festlegungen** |
| 1600 · `preis:festlege:reinheit` | nichts | **5 Angebote, 2 Festlegungen** |
| 1600 · `preis:nimm:probe` | nichts | **4 Angebote, 2 Festlegungen** |

Das Brett sagt es auch selbst, und zwar gut: *„5 nebeneinander, 5 heute noch zu haben ·
Kasse 112 Pf · was hier weggeht, kommt in diesem Jahr nicht wieder"* und *„Eine je
Amtszeit. Sie ändert eine Regel für den Rest der Partie und wird nicht zurückgenommen."*
Das ist genau die Sorte Entscheidung, die die Latte verlangt.

**Der Haken ist die Häufigkeit.** Diese Tafel liegt einmal im Braujahr. In 284 gespielten
Wochen war sie in 1350 **viermal** auf dem Tisch, und **dreimal davon nur, weil ich sie
gesucht habe**; in 1600 zweiundzwanzigmal, davon **einundzwanzigmal nur nach Suche**. Von
selbst kam sie beim Laden der ersten Partie — und danach nie wieder.

In den übrigen 27 bis 29 Wochen des Jahres bleibt: die **Adressen des Gegners**. Dort
stehen tatsächlich zwei Wege nebeneinander, die einander ausschließen — *„ablösen 66 Pf"*
gegen *„Fass an den Wirt · 1 Fass statt Geld"*, in 490 von 500 abgelesenen Adressfällen
der ersten 120 Wochen. Das ist eine echte Wahl mit Preis, und sie ist gut gebaut. Sie ist
aber immer **dieselbe** Wahl, an einer anderen Adresse.

### Punkt 4 der Latte — die Verbliste je Epoche · **der teuerste Punkt**

Ich habe zwei Listen gebildet, beide aus dem, was während des Spielens wirklich **greifbar
auf dem Schirm** stand: die **Verben** (welche Art Handlung war je anfassbar — `data-zug`
ohne den Gegenstand, Rahmenknöpfe wie Reiter, Chronik, WEITER herausgerechnet) und die
**Knopfaufschriften** (welche deutschen Wörter standen darauf, Zahlen getilgt).

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| Verben erreichbar | 43 | 42 | 46 | 46 |
| Knopfaufschriften | 116 | 119 | 118 | 120 |

| Paar | Verben gemeinsam | Jaccard | Aufschriften gemeinsam | Jaccard |
|---|---|---|---|---|
| 1350 ↔ 1600 | 38 | **0,81** | 44 | 0,23 |
| 1350 ↔ 1884 | 38 | **0,75** | 39 | 0,20 |
| 1350 ↔ 1970 | 37 | **0,71** | 38 | 0,19 |
| 1600 ↔ 1884 | 39 | **0,80** | 41 | 0,21 |
| 1600 ↔ 1970 | 37 | **0,73** | 38 | 0,19 |
| 1884 ↔ 1970 | 38 | **0,70** | 41 | 0,21 |

**In allen vier Epochen greifbar: 37 Verben.** Nur in einer einzigen Epoche:

* **nur 1350 (4):** `erbe:anfechten` · `fuhre:bann` · `sud:wasser` · `sud:wuerze`
* **nur 1600 (2):** `fuhre:pfand` · `sud:schuettung`
* **nur 1884 (5):** `fuhre:fracht` · `name:entzug-loesen` · `sud:hefe` · `sud:hefe-fuehren` · `sud:kaelte`
* **nur 1970 (8):** `fuhre:ausgang` · `fuhre:listen` · `gegner:angebot-ja` · `gegner:angebot-nein` · `sud:behandlung` · `sud:fuehrung` · `sud:zettel-charge-frei` · `sud:zettel-charge-schnitt`

**Das Urteil dazu ist geteilt, und beide Hälften gehören hingeschrieben.**

*Vier Tapeten sind es nicht.* Die Wörter sind zu 80 % verschieden (Jaccard 0,19–0,23), und
zwar nicht kosmetisch: 1600 verhandelt Reinheitsgebot, Zunftbrief, Bierbann über vier
Dörfer und den Kauf des Anwesens; 1884 Warmluftdarre, Malzkontrakt und Braumeister; 1970
Kieselgurfilter, Bierdeckel, Listung im Regal. Die **Enden unterscheiden sich nach
Ursache** (§7): 1350 endet mit „Der Rat entzieht das Braurecht", 1970 mit „Das Brauhaus
wird stillgelegt — der Handel nimmt es aus dem Sortiment". 1970 hat als einzige Epoche
einen zweiten Gegner (die Nordstern-Gruppe) und mit `gegner:angebot-ja/nein` eine
Übernahmefrage, die es sonst nirgends gibt. Das ist echte Arbeit und keine Typografie.

*Vier Mal dasselbe Spiel ist es trotzdem.* **37 von 43 bis 46 Verben sind in allen vier
Epochen dieselben**, und die Woche fühlt sich in allen vier gleich an, weil sie es ist:
Karren füllen, abschicken, weiter. Die Reiterleiste hat in allen vier Epochen **dieselben
zehn Fächer in derselben Reihenfolge** — nur heißt Fach 5 einmal DER KELLER, einmal DAS
GEWÖLBE, einmal DER EISKELLER, einmal DIE TANKS, und Fach 6 einmal OCHSENKARREN, einmal
PFERDEFUHRWERK, einmal HALBER WAGEN, einmal LASTZUG. Was sich zwischen 1350 und 1970
wirklich ändert, ist die **Ausstattung der immer gleichen Handlung**, nicht die Handlung.

Wer die Latte streng liest („kommt dieselbe Verbliste heraus?"), muss sagen: **zu etwa
achtzig Prozent ja.**

## 3 · Unwiderrufliche Festlegungen

**Sie gibt es, sie sind sauber beschriftet, und ich habe in 20 Minuten 1350 keine einzige
davon treffen können.**

Die Tafel führt sie unter *DIE FESTLEGUNG* mit dem Satz: *„Eine je Amtszeit. Sie ändert
eine Regel für den Rest der Partie und wird nicht zurückgenommen."* Weitere Sätze, die ich
auf dem Schirm gelesen habe:

* „Der Erbzins endet. **Für immer.** Das Haus gehört von heute an dem Haus."
* „Der Wasserzins an die Stadt endet. Für immer. Das Haus schöpft aus eigenem Grund."
* „**Unwiderruflich** — der Brief wird nie zurückgegeben, und das Grutgeld ist danach nicht
  mehr zu haben."
* „1 fertig · 0 im Bau · **0 durch eine Wahl für immer ausgeschlossen**"
* „Dafür neu und für immer: Kost und Pflege des Pfründners."

Gezählt, wie oft ich eine getroffen habe:

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| Festlegungen gleichzeitig auf der Tafel | 3 | 4 | 4 | 4 |
| **von mir getroffen** | **0** | **1** | **1** | **0** |
| Angebote getroffen (jahresweise weg, nicht für immer) | 1 | 2 | 5 | 4 |

**Zusammen in vier Sitzungen und 1.030 Wochen: zwei unwiderrufliche Festlegungen.** In
1350 null von drei, weil keine bezahlbar war — die billigste kostete 85 Pf bei einer Kasse
von 112, und ab dem zweiten Jahr stand die Kasse dauerhaft unter 70. In 1970 null von vier
bei einer Anfangskasse von 86.000 DM, weil die billigste 48.000 DM kostete und die Kasse
danach fiel.

Die Tafel schreibt das selbst hin, und das ist gut: *„HEUTE NICHT · Die Kasse reicht für
keines dieser Angebote. Das billigste — Der Wappenbrief — kostet 500 fl, es fehlen 24 fl."*
Eine unwiderrufliche Festlegung, die man nie bezahlen kann, ist trotzdem keine Festlegung,
sondern eine Vitrine.

## 4 · Der Gegner

**Er zieht wirklich, oft, und ohne mich — und er ist auf der Karte zu sehen, ohne dass man
ein Brett aufschlägt.** Das ist die Latte, an der dieses Spiel am klarsten besteht.

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| Züge des Gegners in meiner Sitzung | 140 | 151 | 96 | 70 |
| Wochen, in denen er zog | 125 von 284 | 138 von 310 | 92 von 308 | 61 von 128 |
| Züge, die **ich** gegen ihn getan habe | 0 | 4 | 1 | 0 |

Das Verhältnis ist der eigentliche Befund: **457 Züge des Gegners gegen 5 Züge von mir.**
Nicht weil ich nicht wollte — meine Hand hat es jede dritte Woche versucht —, sondern weil
„ablösen 76 Pf" bei einer Kasse von 14 Pf kein Zug ist. Der Gegner spielt, ich sehe zu.

Auf der Karte stand dabei durchgehend, ohne Klick: *„Vorsprung: 3 Dinge · wirbt 3 Wo.
kürzer"*, *„Sebastian Feist · streitbar · 5 Häuser · 24 Züge · **2 diese Woche** · Kasse
1.290 fl · sein Preis 14 fl · baut W30 · pachtet W36 · BÜRGERMEISTER"*, dazu an den
Wirtshäusern *UMKÄMPFT*, *frei geworden*, *ablösen 42 Pf*. Er kündigt an (*baut W30*) und
er tut es dann auch.

### 4b · Die saubere Gegenprobe: 50 Wochen, ohne ein einziges Brett aufzuklappen

`werkbank/schuss/spiel-w12/gegnerblick.mjs` spielt 1350 fünfzig Wochen lang **nur** mit
drei Knöpfen — „Wie vorige Woche", „FUHRE ABSCHICKEN", „WEITER" — und rührt keinen Reiter
an. Gemessen wird je Woche, welche Textzeilen **neu** auf dem Schirm stehen, die in der
Vorwoche nicht dastanden.

| | |
|---|---|
| gespielte Wochen | 50 (1350/1 – 1351/20) |
| Züge des Gegners | 27 |
| Wochen mit einem neuen Gegnerzug | 25 |
| **davon mit neuem, den Gegner betreffendem Text auf dem Schirm** | **23 von 25** |

Und der Text ist nicht Buchhaltung, sondern Erzählung:

> „Ein grauer Karren des Adlers fährt zum Schenke am Tor."
> „Dem Adler brennt der Darrboden. Zwei Wochen kein Sud. Es kostet ihn 26 Pf."
> „Brauhaus zum Adler baut auf dem eigenen Hof: Darrboden für 44 Pf."
> „28 Züge, **1 diese Woche**" · „kommt in den Rat" · „erwirkt den Bann" · „frei geworden"

**Das ist bestanden, und zwar deutlich.** Ein Gegner, der nur im Protokoll zieht, zieht
nicht — dieser hier zieht auf der Karte, kündigt an (*„baut W30 · pachtet W36"*), hat
eigenes Pech und wird sichtbar reicher und ärmer. Von allem, was ich in vier Sitzungen
geprüft habe, ist das der Teil, der am wenigsten Arbeit braucht.

**Ein Schönheitsfehler mit Ansage:** der Reiter *OHNE DICH GESCHEHEN* trägt die Zahl nur
im **ersten** Braujahr („OHNE DICH GESCHEHEN 19 Züge", Woche 1–30). Ab 1351/1 steht dort
in **allen 20 weiteren geprüften Wochen** nur noch der nackte Titel — die Zahl ist dann
auf das aufgeklappte Brett gewandert. Das ist kein Verlust an Information, aber ein
Wechsel des Orts mitten in der Partie.

---

## 5 · Verstehe ich in den ersten fünf Minuten, was ich tun soll und was Gewinnen heißt?

**Was ich tun soll: nach etwa zwei Minuten ja. Was Gewinnen heißt: nein, und zwar auch
nach zwanzig Minuten nicht.**

Der erste Schirm (1350, 1600×900) trägt **613 sichtbare Textzeilen**, rund 40 anfassbare
Knöpfe und zehn zugeklappte Bretter. Gut daran ist die untere Zeile:

> `nächster Zug: Zuvorkommen Klosterschenke Obernberg — 19 Pf (Kasse reicht 5,9×)`

Das ist die beste Zeile des Spiels. Sie sagt mir, was als Nächstes sinnvoll ist, was es
kostet und ob ich es mir leisten kann — und sie steht in jeder Woche da. Dazu der große
WEITER-Knopf unten rechts. Damit war ich nach zwei Minuten handlungsfähig.

**Aber:** die Wörter **Ziel**, **gewinnen**, **überleben** kommen auf dem ersten Schirm
**null Mal** vor (gezählt über alle 613 Zeilen). Die Epoche trägt im Quelltext das Verb
*„überleben"*; auf dem Schirm steht davon nichts. Es gibt keine Anleitung, keinen ersten
Satz, keinen Hinweis, worauf die Partie hinausläuft.

**Und die Stelle, an der ich es wirklich nicht verstanden habe, ist benennbar:** oben rechts
steht beim Laden der Knopf **„Michaelitafel schließen"** — während die Michaelitafel gar
nicht auf dem Tisch liegt. Ich habe eine Weile gesucht, was ich da schließen soll. Die
Michaelitafel ist das Brett, auf dem die *einzigen* Entscheidungen mit Preisschild
nebeneinander stehen; sie ist beim Start unsichtbar, und der einzige Knopf, der sie holt,
behauptet, sie liege schon da. In 1600 ist derselbe Knopf zeitweise ehrlich
(„Michaelitafel 1600 · 4 Angebote"), unmittelbar nach dem Jahreswechsel aber wieder
falsch beschriftet („schließen", während nichts liegt) — gemessen an zwei Jahreswechseln.

Dass es ein **gutes Ende** gibt (die Übergabe des Hauses, siehe §7), erfährt man auf dem
ersten Schirm nicht und in zwanzig Minuten Spiel überhaupt nicht.

## 6 · Kann man eine Partie unterbrechen und fortsetzen?

**Nein. Ein Neuladen löscht die Partie ohne Warnung.**

Gemessen (`werkbank/schuss/spiel-w12/wiederkehr.mjs`, Epoche 1, Saat 1350): zwölf Wochen
gespielt, dann dieselbe URL neu geladen.

| | Jahr/Woche | Kasse | Fässer | Chronik | Buch |
|---|---|---|---|---|---|
| Anfang | 1350/1 | 112 | 4 | 4 | 1 |
| nach zwölf Wochen | 1350/13 | 60 | 12 | 8 | 42 |
| **nach dem Neuladen** | **1350/1** | **112** | **4** | **4** | **1** |

`localStorage` ist leer, `sessionStorage` ist leer, `document.cookie` ist leer. Es gibt
keinen Speicherstand, keine Wiederaufnahme, keine Rückfrage vor dem Verlassen und keinen
Hinweis darauf, dass es keinen gibt. Wer nach vierzig Minuten aus Versehen F5 drückt,
fängt bei 112 Pfennig wieder an.

Das trifft die zweite Latte unmittelbar: **eine Partie, die keine Unterbrechung überlebt,
kann nicht länger dauern als eine Sitzung.** Die Latte verlangt zwanzig Minuten je Epoche;
das Spiel ist auf genau eine ununterbrochene Sitzung gebaut.

## 7 · Gibt es ein Ende?

**Ja — und es ist das beste Blatt des ganzen Spiels.** In einer eigenen Probe
(`gutesende.mjs`, 1350, echte Maus, 102 Wochen, 213 Klicks, sieben Minuten) endete die
Partie von selbst:

> ### Der Rat entzieht das Braurecht · 1353
> *„Der Rat entzieht dem Haus zum Anker das Braurecht: seit 12 Wochen hat keine Schenke
> der Stadt ein Fass genommen. Ein Braurecht wird für die Stadt verliehen; wer die Stadt
> nicht mehr versorgt, hat es verwirkt."*
>
> **„Nicht die leere Kasse hat das Haus zugemacht. Am letzten Tag lagen 36 Pf in der Lade,
> 3 Fass von 14 Fass lagen im Keller, 1 Grut in der Kammer. Was fehlte, war die Adresse,
> die das Fass abnimmt."**

Darunter, ohne dass man etwas anklicken muss: *Gegründet 1350 · Gespielt 1350 bis 1353 ·
4 Braujahre · Fuhren hinausgeschickt 0 · Ausgeliefert 0 Fass · Adressen zurückgeholt 0*,
die Liste der drei Generationen, die es geführt haben, und **WIE DAS AUFTRAGSBUCH LEER
WURDE** mit neun datierten Zeilen („1352 Fährhaus am Fluss — niemand hat sie genommen").
Dann ein Knopf **„Von vorn anfangen — dieselbe Stadt, andere Würfel"**, und der
WEITER-Knopf heißt jetzt **ENDE**. Der Satz darunter: *„DER HOF IST GESCHLOSSEN. Von hier
an bucht kein Knopf mehr — kein Bau, keine Ablösung, kein Versatz. Was offen bleibt, ist
zum Lesen: die Reiter der Bretter, die Chronik und das Buch."*

Das ist erwachsene Arbeit: eine Niederlage, die ihre Ursache benennt und die häufigste
Fehldiagnose („du warst pleite") ausdrücklich zurückweist. **Ich hätte danach sofort noch
einmal angefangen** — siehe §8.

**Das gute Ende dagegen habe ich nie gesehen**, obwohl es fünfzehn Wochen lang offenstand.

Was ich am Bildschirm gefunden habe: ab dem Braujahr **1355** erschien in der Reiterleiste
oben ein neuer Reiter mit der Aufschrift **„DIE ÜBERGABE VOR DEM RAT"**. Er stand in
**Woche 2, 3 und 4 jedes Jahres** — 1355, 1356, 1357, 1358, 1359, zusammen **15 von 284
gespielten Wochen** — und war ansonsten weg. Ich habe ihn in der Sitzung **nie geöffnet**,
weil ich keinen Anlass hatte: er ist ein braunes Rechteck unter zehn anderen braunen
Rechtecken, deren Aufschriften sich ohnehin jedes Jahr ändern (`MICHAELI 1355`,
`GEORGI 1355`), und er verschwindet wieder, bevor man das nächste Mal hinsieht.

Drei Enden sind gebaut; ich habe eines erreicht, eines nur als Reiter gesehen und das
dritte ist rechnerisch unerreichbar:

* Die Uhr endet bei **2025**. Epoche I läuft von 1350 bis 1516. Ich habe in zwanzig
  Minuten **zehn** Braujahre gespielt (14,2 Wochen je Minute); bis zum Ende der Epoche
  wären es 167 Jahre — **rund sechs Stunden** —, bis 2025 rund 675 Jahre, also **rund
  vierundzwanzig Stunden ununterbrochenes Spielen** — bei einem Spiel, das kein Neuladen
  überlebt (§6).
* **Man wechselt die Epoche nicht durch Spielen.** In zwanzig Minuten kommt man 10 von
  167 Jahren weit. Die vier Epochen sind vier getrennte Eingänge über `?epoche=`, keine
  Strecke. Die härteste Einzelforderung des Auftrags — *die Stadt wächst über 620 Jahre,
  ohne den Ort zu wechseln* — ist als **Bild** erfüllt und als **Spiel** nicht: man sieht
  die vier Zustände nie nacheinander.
* **Verarmen allein reicht nicht.** Meine 1350-Sitzung stand ab dem dritten Jahr bei
  Kasse 0, Rohstoff 1, Keller 0 von 12, mit offenen Posten in jeder Zeile der Rechnung —
  284 Wochen lang, ohne dass irgendetwas endete. Beendet wird nur, wer **nicht mehr
  liefert** (Braurecht entzogen, gemessen) oder wer **negative** Kasse *und* leeren Hof
  hat. Eine Kasse, die bei 0 klebt, ist nicht negativ. Das heißt: der Zustand
  „handlungsunfähig, aber nicht tot" ist der stabilste Zustand des Spiels, und er hat
  keinen eigenen Text.

## 8 · Wollte ich weiterspielen?

**Zweimal ja und einmal nein, und der Unterschied ist die ganze Kritik.**

**Nein** in den Minuten 4 bis 20 jeder Sitzung. Die Woche besteht aus zwei Knöpfen — „Wie
vorige Woche", „FUHRE ABSCHICKEN" —, und ich habe sie in vier Sitzungen zusammen
**1.166-mal** gedrückt. Dazwischen läuft ein Gegner herum, den ich mir nicht leisten kann,
und einmal im Jahr liegt eine prachtvolle Tafel mit fünf Angeboten, von denen keines
bezahlbar ist. Das ist kein langweiliges Spiel — es ist ein **interessantes Spiel, das man
nicht spielen darf**, weil das Geld fehlt.

**Ja** in der ersten Minute. Der Hof ist schön, die Kopfzeile sagt Jahr, Kasse, Rohstoff,
Lager, Woche, und unten steht in einer einzigen Zeile, was als Nächstes sinnvoll wäre und
ob es reicht. Ich wusste sofort, wo ich bin.

**Ja, sofort und ernsthaft**, in der Sekunde, in der das Spiel zu Ende ging. Als „Der Rat
entzieht das Braurecht · 1353" aufschlug und darunter stand *„Nicht die leere Kasse hat
das Haus zugemacht … Was fehlte, war die Adresse, die das Fass abnimmt"* — mit der Liste
der neun Wirtshäuser und dem Jahr, in dem jedes verlorenging —, **wollte ich es sofort
noch einmal versuchen und diesmal die Wirte halten.** Genau dafür steht der Knopf „Von
vorn anfangen — dieselbe Stadt, andere Würfel" schon da.

**Der Satz, der es trifft:** Dieses Spiel wird an seinem Ende gut, und man kommt zu selten
dorthin. Die zwanzig Minuten dazwischen verkaufen es nicht.

---

## 9 · Auflagen

*Durchnummeriert, jede so, dass ein Builder sie ohne Rückfrage abarbeiten kann. Die
Reihenfolge ist die Reihenfolge, in der ich sie beim Spielen vermisst habe.*

### A1 — Spielstand speichern und fortsetzen
`kern/welt.js` (oder ein neues `kern/stand.js` als Kernänderung melden) schreibt nach jedem
Wochenwechsel den vollständigen Weltzustand nach `localStorage` unter einem Schlüssel, der
Epoche **und** Saat enthält (`brauhaus:1:1350`). Beim Laden derselben URL wird er
gefunden und die Partie fortgesetzt; im Kopf steht dann sichtbar
„fortgesetzt · 1354/12". Ein Knopf **„Neue Partie"** verwirft ihn nach Rückfrage. Prüfung:
zwölf Wochen spielen, `location.reload()`, Jahr/Woche/Kasse/Fässer/Chronik müssen Ziffer
für Ziffer stimmen — das ist genau die Probe aus §6, die heute reißt.

### A2 — Ein Satz, der sagt, wohin das führt
Von Woche 1 an sichtbar, ohne dass ein Brett aufgeschlagen werden muss: **was das gute Ende
ist und wie weit das Haus davon entfernt ist.** Die Zahlen liegen bereits vor
(`uebergabeFehlt()` in `stuecke/fuhre.js` liefert den Klartextsatz — „Noch 3 Braujahre,
dann ist das Haus alt genug für eine Übergabe" / „Es führen 1 von 3 Häusern Bier des
Anker"). Dieser Satz gehört neben die schon vorhandene Zeile *„nächster Zug: …"* am unteren
Rand. Heute erfährt ihn nur, wer ein zugeklapptes Brett aufschlägt, das drei Wochen im Jahr
existiert.

### A3 — Der Reiter „DIE ÜBERGABE VOR DEM RAT" darf sich nicht verstecken
Solange das Übergabeangebot liegt, wird es **nicht** als einer von elf gleich aussehenden
Reitern gezeigt, sondern als aufgeschlagenes Blatt (wie die Michaelitafel) oder mindestens
als Reiter mit eigener Farbe und einer Frist („noch 3 Wochen"). Prüfung: eine Partie 1350
bis 1355 spielen, ohne einen einzigen Reiter anzufassen — das Angebot muss auffallen.
Gemessen heute: 15 von 284 Wochen vorhanden, 0-mal bemerkt.

### A4 — Der Knopf `preis:tafel` darf nicht lügen
Er trägt in 1350 über 71 abgelesene Zustände hinweg immer „Michaelitafel schließen" —
auch wenn keine Tafel liegt. In 1600 wechselt er korrekt auf „Michaelitafel 1600 ·
4 Angebote", fällt aber unmittelbar nach dem Jahreswechsel wieder auf „schließen" zurück,
während nichts auf dem Tisch liegt (gemessen an zwei Jahreswechseln). Regel: **die
Aufschrift wird aus dem Zustand gerechnet, in dem der Knopf gerade gezeichnet wird**, und
sie lautet beim Zeichnen ohne liegende Tafel immer „Michaelitafel `<jahr>` · `<n>`
Angebote". Das ist dieselbe Klasse Fehler, die `spiel/LIESMICH.md` als Ursache der
Bistabilität vom 7. August benennt.

### A5 — Die Michaelitafel muss zu Michaeli von selbst aufliegen
Sie ist das einzige Brett des Spiels, auf dem Entscheidungen mit Preisschild nebeneinander
stehen. In der 1350-Sitzung lag sie in zehn Braujahren **nicht ein einziges Mal** von selbst
auf; in 1600 fehlte sie an jedem geprüften Jahreswechsel und musste gesucht werden. Regel:
in Woche 1 jedes Braujahres wird sie aufgeschlagen, so wie das Sommerblatt zu Georgi
aufgeschlagen wird — und erst „Das Jahr beginnen" legt sie weg.

### A6 — Reiter, die nichts bewirken, müssen abgeschaltet sein
Solange ein großes Blatt oben liegt (Georgi, Michaeli, Übergabe), ändert ein Klick auf die
acht darunterliegenden Reiter **nichts Sichtbares**: gemessen in 1350 und 1600, je acht
Klicks, je identische Zahl greifbarer Züge davor und danach (E2, Jahreswechsel 1601:
30/30/30/30/30/30/30/30 — erst der neunte Reiter, MICHAELI, brachte 53). Entweder das Blatt
schließt sich beim Klick auf einen Reiter, oder die Reiter tragen `disabled`. Ein Knopf, der
sich anfassen lässt und nichts tut, ist die teuerste Sorte Lüge in einem Spiel, das nach
Klicks bewertet wird.

### A7 — Die Woche braucht mehr als zwei Knöpfe, oder sie braucht keine Woche
*(Anteil der drei Wiederholungsknöpfe an allen Klicks — Zahl aus §2.)* `kern/uhr.js` hat
mit `B.uhr.springe()` bereits das Werkzeug
dafür („ruhige Jahre werden erzählt, nicht geklickt") — **es wird von keinem Stück je
aufgerufen** (geprüft: kein Treffer außerhalb von `uhr.js` selbst). Entweder jede Woche
trägt eine Entscheidung, oder Wochen ohne Entscheidung werden zusammengefasst.

### A8 — Der Gegner muss ohne aufgeklapptes Brett zu bemerken sein
*(Zahlen aus §4 — Auflage steht, sobald die Zählung dort steht.)*

### A9 — Wenn nichts bezahlbar ist, muss das Spiel einen Weg zeigen
Die Tafel sagt vorbildlich „HEUTE NICHT · Die Kasse reicht für keines dieser Angebote. Das
billigste — Der feste Fasskauf bei der Zunft — kostet 60 Pf, es fehlen 12 Pf." Das ist
gute Arbeit. Was fehlt, ist der Satz danach: **woher die 12 Pfennig kommen sollen.** In
meiner 1350-Sitzung lag die Deckung in **250 von 284 Wochen unter 1×**, im Median bei
**0,17×**, und in 127 Wochen war überhaupt nichts mit Preisschild bezahlbar. Ein Spiel, das
in neun von zehn Wochen alle seine Entscheidungen anzeigt und keine davon zulässt, hat
keine Entscheidungen.

### A10 — Textüberläufe auf der Michaelitafel bei 1600×900
Auf demselben Blatt gleichzeitig abgeschnitten (1350, Michaeli 1359): „Zusammen im Jahr"
in *DIE RECHNUNG*, „Der Anschlag steht im Steuerbuch der Stadt" in *DER ANSCHLAG*,
„1 fertig · 0 im Bau · 0 durch eine Wahl für immer" in *WAS SCHON STEHT*, und die
Knopfaufschrift „Nehmen −110 Pf" bricht mitten im Wort („Nehme n −110 P f"). Prüfung bei
1600×900 **mit** gezeichneter Rollleiste; kein Kasten der Tafel darf Text abschneiden.

---

## X · Was an meiner Prüfung schwach ist

*Steht bewusst vor den Auflagen, nicht dahinter.*

1. **Meine Hand ist ein Skript, kein Mensch.** Sie klickt mit echten Mausereignissen auf
   echte Knopfflächen und wartet nach jedem Klick, bis das Bild steht — aber sie liest
   nicht, sie erkennt keine Absicht, und sie fasst nichts an, wonach sie nicht ausdrücklich
   sucht. Genau daran ist mir das gute Ende durchgerutscht (§7). Ein Mensch hätte den
   neuen Reiter „DIE ÜBERGABE VOR DEM RAT" vielleicht gesehen. Was ich messe, ist deshalb
   **eine Untergrenze für das, was auffällt**, keine Obergrenze.
2. **Die Spielstärke meiner Hand ist mittelmäßig, und das verzerrt die Wirtschaftszahlen.**
   Die Deckung (Kasse ÷ Preis des nächsten sinnvollen Zuges) hängt daran, wie gut gespielt
   wird. Meine Zahlen sagen: *diese* Spielweise verarmt. Sie sagen nicht: jede Spielweise
   verarmt. Ein besserer Spieler hätte eine andere Kurve.
3. **Eine Sitzung je Epoche, eine Saat.** Die Messlatte selbst verlangt „drei Läufe, eine
   Prüfsumme"; ich habe je Epoche **einen** Lauf mit `saat=1350`. Wo ich eine Zahl nenne,
   ist sie **nicht** auf Wiederholbarkeit geprüft. Was ich dazu sagen kann: `lage` war in
   allen Sitzungen 0 und es gab null Seitenfehler — das Spiel läuft stabil, aber ob es
   dieselbe Partie zweimal spielt, habe ich nicht gemessen.
4. **Ich habe ohne Rollleiste gemessen.** Playwright startet Chromium mit
   `--hide-scrollbars`; ich habe das nicht abgestellt. Wo ich von abgeschnittenem Text
   spreche, ist das im echten Browser eher mehr, nie weniger.
5. **Ein Fenster, 1600×900.** Nicht die Entwurfsleinwand und nicht 1366×768. Ein einzelner
   Blick bei 1366×768 zeigte dieselben Bretter deutlich schlechter (überlappende Kästen
   oben links); geprüft habe ich dort nicht.
6. **Die Panne mit dem zweiten Browser** (siehe §1) — vier Minuten lang lief eine zweite
   Chromium-Instanz neben dem Messfenster. Die betroffene Sitzung ist verworfen, aber ich
   kann nicht ausschließen, dass die Zahlen der ersten 1350-Sitzung, die ich als
   *Beobachtung* zitiere, davon berührt sind.
7. **„Ausschluss" habe ich nur dort bewiesen, wo ich zugegriffen habe.** Dass die
   Michaeli-Angebote einander ausschließen, ist gemessen (die Geschwister waren danach
   abgeschaltet). Für andere Brettpaare habe ich es nicht geprüft, sondern nur gelesen,
   was das Spiel selbst darüberschreibt.
