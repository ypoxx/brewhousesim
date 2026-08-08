# Welle 13 · Stück 3 · DIE WOCHE — Baubericht

*Laufend geschrieben. Builder DIE WOCHE. Geändert wurden ausschließlich
`spiel/stuecke/fuhre.js` und `spiel/stil/fuhre-zusatz.css`; dazu neue
Messgeräte unter `werkbank/schuss/woche-w13/`. Nichts unter `spiel/kern/`,
nichts aus einem fremden Stück, kein fremdes DOM.*

---

## 0 · Was ich gelesen habe, bevor ich etwas angefasst habe

* `gauntlet/WELLE-13.md` — ganz, besonders die drei Entscheidungen der Aufsicht.
* `spiel/LIESMICH.md` — ganz, besonders den Kasten „KEIN WÜRFEL, ABER TROTZDEM
  ZUFALL" und (später im Lauf, weil der Rahmen-Builder ihn erst schrieb) den
  Kasten zu `springe()`.
* `werkbank/urteile/welle12-spielprobe.md` — ganz; §7, §8 und die Auflagen
  A2, A3, A6, A7 sind meine.
* Dazu, weil ich sonst nicht wüsste, wogegen ich baue: `spiel/kern/uhr.js`,
  `welt.js`, `kopf.js`, `start.js`, `basis.js` · `spiel/stuecke/stadt.js` (die
  Platzordnung, die meine Bretter in Reiter klappt) ·
  `werkbank/schuss/spiel-w12/hand3.mjs`, `gegnerblick.mjs`, `bericht.py` ·
  `werkbank/schuss/rueckkopplung-r3/linie.mjs`.

---

## 1 · DER BEFUND, DEN ICH NICHT ERWARTET HATTE

**Die Woche war nicht zu spielen, ohne einen Reiter anzufassen. Überhaupt nicht.**

Bevor ich eine Zeile geändert habe, habe ich mit einer eigenen Hand gemessen
(`werkbank/schuss/woche-w13/hand-w13.mjs`, echte Mausereignisse, Fenster
1600×900, Epoche 1, Saat 1350, 100 Wochen, **kein einziger Reiterklick**):

| | |
|---|---|
| gespielte Wochen | 100 |
| echte Mausklicks | **106** |
| davon `weiter` | **100 (94,3 %)** |
| Klicks auf `fuhre:wie-vorige` / `fuhre:abschicken` | **0 / 0** |
| `fuhre:abschicken` abgeschaltet vorgefunden | **100 ×** |
| Seitenfehler · `BRAUHAUS.lage` | 0 · 0 |

Der Grund steht in `spiel/stuecke/stadt.js`: *„Was beim Laden schon dalag,
liegt als Reiter."* **Alle vier Bretter der FUHRE** — DIE HÄUSER (18,8 % der
Bühne), ANSCHLAGTAFEL (9,9 %), DER KELLER (7,0 %), OCHSENKARREN (8,1 %) —
tragen beim Laden `stadt-zugeklappt`. Wer keinen Reiter anfasst, sieht keinen
Wagen, kann nichts laden, und `FUHRE ABSCHICKEN` bleibt „Erst beladen".

Die 71 % des Kritikers sind deshalb **eine Untergrenze mit Vorgeschichte**:
seine Hand (`hand3.mjs`) hat vor jedem Griff eine Reitersuche gefahren
(`reiterAuf()`). Ohne diese Suche entfallen 94 % der Klicks auf **einen**
Knopf, der nicht einmal meiner ist.

Damit stand fest, dass R12 („1350 bis 1355 spielen, ohne einen einzigen Reiter
anzufassen") ohne einen Umbau der Woche gar nicht abnehmbar ist: ein Haus, das
nie liefert, erreicht die Bedingungen des Übergabeangebots nie.

---

## 2 · Was gebaut wurde

### DIE WOCHENKARTE (`.fu-woche`) — der Ort, an dem die Woche liegt

Eine Karte unten links, **ohne Kasten**: Schrift im Lichthof, Knöpfe als
Chips. Sie trägt

* eine Kopfzeile: `DIE WOCHE 12/30` und **was diese Woche ansteht**
  (`wochenLage()`),
* bis zu vier **Fuhrpläne** nebeneinander, jeder mit Preisschild, jeder
  schließt die anderen aus,
* den **Sprung** („Weiter wie zuletzt · bis zu N Wochen"),
* und, solange es liegt, das **Übergabeangebot** in eigener Farbe.

**Warum sie so klein ist (31,5 × 10,2 % = 3,21 % der Bühne):** `stadt.js`
behandelt jedes Kind eines fremden Fachs über `GRENZE` (3,5 %) als *Brett* und
klappt es beim Laden in einen Reiter; darunter ist es eine *Karte im Bild* und
bleibt liegen. Die Karte beansprucht **keine Ausnahme** — sie trägt weder
`.amort` noch `data-frei`, fällt also unter die Regel und nicht unter deren
Ausnahme. Nachgemessen mit `werkbank/schuss/woche-w13/freiflaeche.mjs`:
`3,4 % · x 1,2–34,2 · y 85,6–95,8 · fuhre fu-woche` und **kein**
`stadt-zugeklappt`.

**Warum sie keinen Kasten hat:** Welle 10 hat dieselbe Rechnung schon einmal
aufgemacht — *„die ZAHL bleibt, das PAPIER geht"*. Ein Papier von 3,2 % im
untersten Sechstel wäre ein Fünftel des Streifens, in dem jedes Zielbild
seinen Vordergrund trägt. Gedeckt werden nur die Chips selbst.

**Warum sie zurücktritt, solange der Anschlag des Rahmens liegt:**
`kern/start.js` legt seinen Startzettel (R4) auf denselben Streifen
(x 2,4–49,4 / y 74,4–95,3). Zwei Schriften im selben Lichthof übereinander
sind beide unlesbar, und sein Knopf „Anfangen" läge auf meinen Chips. Die
Karte prüft deshalb **lesend** (`document.getElementById('fach-kopf-kern-start')`),
ob das Fach da ist, und zeichnet sich erst danach. Sie ändert an fremdem DOM
nichts.

### DIE FUHRPLÄNE — die Woche trägt eine Wahl mit Preisschild

Sechs Regeln, in fester Reihenfolge geprüft, **entdoppelt**: zwei Regeln, die
dieselbe Ladung ergeben, erscheinen als *ein* Knopf. Was gleich ist, ist keine
Wahl.

| Zug | Regel |
|---|---|
| `fuhre:plan:probe` | ein reifes Fass ohne Rechnung an einen Wirt, der nichts mehr nimmt |
| `fuhre:plan:mager` | die Häuser zuerst, die magere Jahre auf dem Buckel haben |
| `fuhre:plan:umkaempft` | zuerst die Adressen, um die ein anderer wirbt |
| `fuhre:plan:durst` | die Faustregel des Fuhrmanns — wer am längsten wartet |
| `fuhre:plan:rechnung` | wo das Fass am meisten bringt |
| `fuhre:plan:nah` | nur die kurzen Wege, wenig Fuhrlohn |

Jeder Knopf trägt als Preisschild **den Nettoertrag dieser Fuhre**
(Erlös − Fuhrlohn) und fährt sie gleich ab — wer fährt, hat die Woche
gefahren. **Kein Zugschlüssel ist umbenannt oder weggefallen:**
`fuhre:wie-vorige`, `fuhre:fuellen`, `fuhre:leeren` und `fuhre:abschicken`
stehen unverändert auf dem Brett DER WAGEN, für den, der von Hand lädt — und
für `linie.mjs`, das Messgerät der zweiten Latte, das genau diese Schlüssel
namentlich klickt.

**Was NICHT auf der Karte steht: „Wie vorige Woche".** Das ist kein Fuhrplan,
sondern die Abwesenheit eines Plans. Gemessen, warum das wichtig ist: mit
`vorige` in der Liste fielen **65 bzw. 72 von 110 Klicks (59 bzw. 66 %)** auf
diesen einen Knopf — die Wiederholung der zuletzt gewählten Ladung ist fast
immer wieder die einträglichste, und ein Knopf, der sich selbst verstärkt, ist
keine Wahl, sondern eine Rille. Die Wiederholung hat statt dessen den
richtigen Ort bekommen: den Sprung.

### DER SPRUNG — ruhige Wochen werden erzählt

`fuhre:sprung` fährt dieselbe Runde weiter, bis etwas geschieht. Angeboten
wird er, wenn kein **Ereignis** ansteht (Übergabeangebot, Antrag, laufende
Frist, wartendes Probefass, voller Keller, Georgi- oder Schlussblatt) und
entweder die vorige Fuhre noch fahrbar ist **oder** überhaupt nichts zu laden
ist. Angehalten wird nach derselben Regel, spätestens zu Michaeli.

**`B.uhr.springe()` wird benutzt — aber nicht für jede Woche, und der Grund
ist gemessen.** Der Rahmen-Builder hat `springe()` in dieser Welle umgebaut;
seit dem 8. August läuft jede übersprungene Woche wirklich. Genau das ist für
DIE FUHRE der Haken: wer WEITER drückt, ohne hinzusehen, **schickt keine Fuhre
hinaus**. Gemessen mit `werkbank/schuss/woche-w13/springeprobe.mjs`, Epoche 1,
Saat 1350, **ein** gesprungenes Braujahr:

| | vorher | nachher |
|---|---|---|
| Häuser, die Bier des Hauses führen | 10 | **9** |
| Fässer im Keller | 4 | **0** |
| Rohstoff | 40 | **7** |
| Kasse | 112 Pf | 48 Pf |
| Fuhren | 0 | **0** |
| `woche`- / `jahr`-Ereignisse | — | 29 / 1 |

Ein Jahr ohne Fuhre kostet eine Adresse und den ganzen Keller. Deshalb:
**Woche mit reifem Fass** → der Fuhrmann fährt weiter (laden, `schicke()`);
**Woche ohne reifes Fass** → `B.uhr.springeWochen(1)`, denn da ist wirklich
nichts zu tun, und die Uhr macht es billiger und hält bei `zeit.ende` von
selbst an.

### R11 — der Zielsatz

`meldeZiel()` läuft in **jedem** Zeichendurchgang, abgesichert
(`if (!B.welt.meldeZiel) return;` — der Rahmen war zum Zeitpunkt des Einbaus
schon da, R3 ist gebaut). Drei Fälle:

* Angebot liegt → *„Die Übergabe vor dem Rat liegt auf dem Tisch — noch
  3 Wochen. Das ist das gute Ende."*, Nähe 1,0
* Haus steht gut, Michaeli kommt → Nähe 0,95
* sonst der Klartext aus `uebergabeFehlt()`, Nähe = Mittel aus Braujahren,
  führenden Häusern und Ausstoß gegen das Maß der Epoche.

Nach dem Ende wird **nichts** gemeldet — die Zeile bleibt leer statt zu lügen.
Am Bildschirm abgelesen, Epoche 1, Woche 1:

> `Ziel: das Haus weitergeben, solange es steht. Noch 5 Braujahre, dann ist das Haus alt genug für eine Übergabe.  (33 % des Wegs)`

Sie steht **neben** der Zeile „nächster Zug: …", nicht an ihrer Stelle (der
Rahmen zeichnet sie eine Zeile höher, `kern/kopf.js`). Damit die beste Zeile
des Spiels nicht von der Wochenkarte gekapert wird, nimmt `billigsterKnopf()`
alles innerhalb `.fu-woche` ausdrücklich aus.

### R12 — das Übergabeangebot versteckt sich nicht mehr

Vier Orte statt einem Reiter:

1. **Die Wochenkarte** trägt, solange das Angebot liegt, einen Chip in eigener
   Farbe: `DIE ÜBERGABE VOR DEM RAT · noch 3 Wochen` (grün, `--fu-gut`).
2. **Das Georgi-Blatt** — das eine Blatt, das in jedem Braujahr von selbst
   aufliegt — nennt das Angebot mit Zahlen und Frist und trägt den Knopf
   „Die Übergabe vor dem Rat ansehen". Das schließt genau die Lücke, die der
   Kritiker gemessen hat: `pruefeUebergabe()` setzt das Angebot zu Michaeli,
   gezeichnet wurde das Blatt aber erst ab Woche 2 — *„Woche 2, 3 und 4 jedes
   Jahres, 15 von 284 Wochen, null Mal bemerkt."*
3. **Das Blatt selbst** trägt jetzt `data-reiter` mit der Frist: klappt die
   Platzordnung es doch weg, steht auf dem Reiter
   `DIE ÜBERGABE VOR DEM RAT · noch 3 Wochen` statt eines braunen Rechtecks
   unter zehn braunen Rechtecken.
4. **Der Zielsatz** am unteren Rand nennt es (siehe R11).

Dazu: „Beiseitelegen — das Angebot bleibt liegen" auf dem Blatt. Weglegen ist
keine Antwort; `Z.uebergabeZu` versteckt nur das Blatt.

### R14 — die Blätter schließen sich beim Klick auf einen fremden Reiter

`reiterHorcher` hängt in der **Fangphase** an `document` und schließt beim
Klick auf `stadt:reiter:*` das Georgi-Blatt und das Übergabeblatt; danach
`B.sende('zeichne')` — die erste der beiden Regeln aus dem Kasten der
Welle 12. Kein `setTimeout`, kein fremdes DOM.

Zwei Feinheiten, beide Absicht:

* Das **Übergabeblatt** wird weggelegt, das **Angebot** nicht. Die Karte trägt
  es weiter samt Frist und einem Knopf, der es zurückholt.
* Das **Schlussblatt** bleibt liegen. Es ist nach dem Urteil des Kritikers das
  beste Blatt des Spiels, und hinter ihm ist die Partie zu Ende; ein Reiter
  darf es nicht wegwischen. Sein Weg bleibt die Escape-Taste.

---

## 3 · Die Abnahme, selbst gemessen

*(wird unten laufend ergänzt)*

### R13 — der Klickanteil, die Zahl, an der ich gemessen werde

Gerät: `werkbank/schuss/woche-w13/hand-w13.mjs` (dieselbe Mausmechanik wie
`spiel-w12/hand3.mjs` — `mouse.move`/`down`/65 ms/`up`, vorher
`elementFromPoint` auf der Knopfmitte), Fenster **1600×900**, Saat 1350,
je **100 gespielte Wochen**, **kein Reiterklick**. Ausgewertet mit
`werkbank/schuss/woche-w13/klickanteil.py`.

**Die Regeln der Hand, vollständig** — sie gelten unverändert vor und nach dem
Umbau, damit „vorher" und „nachher" dasselbe messen:

1. Georgi-Blatt: einen Jahresplan nehmen, Blatt schließen.
2. Michaelitafel, **wenn sie von selbst daliegt**: das billigste bezahlbare
   Angebot nehmen, „Das Jahr beginnen".
3. Rohstoff unter 45 und bezahlbar: kaufen.
4. Alle drei Wochen ein bezahlbarer Zug gegen den Gegner, alle zehn Wochen
   einer für den Namen (wörtlich aus `hand3.mjs`).
5. **Einen Fuhrplan nehmen: den mit dem besten Preisschild.** Hat keiner
   eines, „Wie vorige Woche", sonst den ersten.
6. **Wäre das derselbe Plan wie vorige Woche und steht ein Sprung da: den
   Sprung nehmen.** Das ist keine Regel des Messgeräts, sondern die, zu der
   die Karte selbst auffordert.
7. `weiter`, wenn die Woche danach noch dieselbe ist.

| | **vorher** (E1) | **E1** | **E2** | **E3** | **E4** |
|---|---|---|---|---|---|
| gespielte Wochen | 100 | 100 | 100 | 100 | 100 |
| zusätzlich **erzählte** Wochen | 0 | **108** | 42 | 61 | 61 |
| echte Klicks | 106 | 114 | 114 | 127 | 135 |
| **häufigster Knopf** (Latte ≤ 35 %) | **94,3 %** `weiter` | **32,5 %** ✓ | 36,8 % ✗ | **26,8 %** ✓ | **17,0 %** ✓ |
| **drei häufigste** (Latte ≤ 60 %) | 98,1 % | 82,5 % ✗ | 72,8 % ✗ | **56,7 %** ✓ | **43,7 %** ✓ |
| Klicks ins Leere | 3 | 6 | 4 | 4 | 4 |
| `BRAUHAUS.lage` · Seitenfehler | 0 · 0 | 0 · 0 | 0 · 0 | 0 · 0 | 0 · 0 |

**Die Rangliste je Epoche** (nachher):

| E1 | E2 | E3 | E4 |
|---|---|---|---|
| `plan:mager` 32,5 % | `plan:mager` 36,8 % | `plan:rechnung` 26,8 % | `plan:umkaempft` 17,0 % |
| `plan:umkaempft` 32,5 % | `plan:umkaempft` 28,9 % | `plan:mager` 15,7 % | `weiter` 15,6 % |
| `sprung` 17,5 % | `plan:durst` 7,0 % | `sprung` 14,2 % | `plan:durst` 11,1 % |
| `preis:tafel-zu` 6,1 % | `sprung` 6,1 % | `plan:umkaempft` 14,2 % | `sprung` 8,1 % |
| `weiter` 5,3 % | `plan:rechnung` 5,3 % | `plan:durst` 4,7 % | `plan:probe` 7,4 % |

**Zwei von vier Epochen bestehen beide Latten, drei von vier die erste.**
1350 und 1600 reißen die Zweite. Ich schreibe die Ursache hin, statt sie
wegzurunden, weil sie ein Befund ist und kein Versehen:

> **Wo wenig Bier ist, gibt es wenig zu verteilen.** Ein Fuhrplan
> unterscheidet sich vom nächsten nur, wenn der Wagen mehr Fässer tragen kann,
> als der Keller hergibt, oder mehr Adressen anfahren kann, als er beladen
> kann. In 1350 fährt der Ochsenkarren **5 Fass an 4 Halte**, und im Keller
> liegen im Median **4 reife Fass** — sechs Regeln erzeugen dann zwei bis drei
> verschiedene Ladungen, und die Entdopplung fasst den Rest zusammen (was
> gleich ist, ist keine Wahl). Gemessen über 100 Wochen in 1350:
> **2 Ladungen in 50 Wochen, 3 in 39, 4 in 8, keine in 3.**
> Damit können höchstens drei Knöpfe den Verkehr tragen — und drei Knöpfe, die
> allen Verkehr tragen, sind per Definition 100 % der drei häufigsten.
>
> Gemessen, wie viele Fuhrpläne **mit Preisschild** in einer Woche
> nebeneinanderstehen (je 100 Wochen, aus `wahl-der-woche` im Protokoll):
>
> | Zahl der Pläne | 0 | 1 | 2 | 3 | 4 |
> |---|---|---|---|---|---|
> | **1350** | 7 | 23 | **67** | 2 | 1 |
> | **1600** | 4 | 4 | 46 | 31 | 15 |
> | **1884** | 19 | 0 | 10 | 18 | **53** |
> | **1970** | 34 | 10 | 1 | 8 | **47** |
>
> In 1350 stehen in **3 von 100** Wochen drei oder mehr Ladungen zur Wahl, in
> 1884 in **71**, in 1970 in **55**. Genau in dieser Reihenfolge fallen auch
> die Klickanteile — **die Latte misst hier die Fässer im Keller, nicht die
> Knöpfe auf der Karte.**
>
> Die Latte misst an dieser Stelle also nicht mehr die Woche, sondern die
> Knappheit — dieselbe, die der Kritiker als *„ein interessantes Spiel, das
> man nicht spielen darf"* beschrieben hat, nur in Fässern statt in Pfennigen.
> Wer sie in 1350 und 1600 reißen will, muss an Sudmenge, Wagengröße oder
> Fassplätzen drehen. **Das habe ich nicht getan**, weil 1600 bei ρ +0,538
> gegen eine Grenze von 0,700 keine Reserve hat und die Aufsicht verlangt, dass
> jede Änderung an Erträgen 1600 zuerst misst.

**Was sich unabhängig von jeder Hand geändert hat** — die Zahl, die der
Kritiker als Punkt 1 der zweiten Messlatte zählt:

| | vorher | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|---|
| Wochen mit **zwei oder mehr Optionen mit Preisschild nebeneinander, die einander ausschließen**, außerhalb der Michaelitafel | **0 von 100** | **70** | **92** | **81** | **56** |
| davon mit drei oder mehr | 0 | 3 | 46 | 71 | 55 |
| Züge der FUHRE, die **ohne einen Reiterklick** greifbar sind | **0** | 2–4 Fuhrpläne + Sprung + Übergabe | | | |

Das ist der Punkt 1 der zweiten Messlatte, und er stand bisher **allein auf
der Michaelitafel**, die einmal im Braujahr aufliegt. Er steht jetzt in 56 bis
92 von 100 Wochen auch in der Woche selbst.


### R12 — „DIE ÜBERGABE VOR DEM RAT" darf sich nicht verstecken

Abnahme wörtlich nach dem Auftrag: **1350 spielen, ohne einen einzigen Reiter
anzufassen.** Gerät `werkbank/schuss/woche-w13/uebergabe.mjs` — es kennt nur
die Wochenkarte, `fuhre:sommer-zu` und WEITER; `stadt:reiter:*` steht auf
keiner seiner Listen.

| | Kritiker Welle 12 | **jetzt** |
|---|---|---|
| gespielte Wochen · Jahre | 284 · 1350–1359 | 78 · **1350–1358** |
| **Reiterklicks** | (Reitersuche vor jedem Griff) | **0** |
| Wochen, in denen das Angebot lag | 15 | **13** |
| davon mit **sichtbarem Text** im Fenster | — | **13 von 13** bzw. **12 von 13** (zwei Läufe) |
| davon mit **greifbarem Knopf** dazu | — | 9 von 13 (beide Läufe) |
| **bemerkt** | **0 von 15** | **13 bzw. 12 von 13** |

Wo die Knöpfe standen: **Wochenkarte 9 ×, aufgeschlagenes Übergabeblatt 8–9 ×**
— kein einziges Mal nur im Reiter. In 1600 dieselbe Probe: **9 von 9 Wochen
sichtbar, 0 Reiterklicks, zuerst 1605/1.** Die erste Berührung, Wort für Wort vom
Bildschirm, Braujahr **1355, Woche 1**:

> `Ziel: Die Übergabe vor dem Rat liegt auf dem Tisch — noch 4 Wochen. Das ist das gute Ende. (100 % des Wegs)`
> `DIE ÜBERGABE VOR DEM RAT · 1355`
> `Die Übergabe vor dem Rat ansehen`

Das ist die **Georgi-Tafel** in Woche 1 — genau die Woche, in der das Angebot
bisher gesetzt, aber nicht gezeichnet wurde.

### R14 — die Blätter schließen sich beim Klick auf einen fremden Reiter

Gebaut wie unter §2 beschrieben; der Horcher hängt in der Fangphase und
schließt Georgi- und Übergabeblatt. Das Übergabeblatt wird dabei **weggelegt,
nicht beantwortet** — `Z.uebergabeZu`; die Wochenkarte trägt das Angebot
weiter samt Frist und einem Knopf, der es zurückholt. Das Schlussblatt bleibt
liegen (Begründung im Quelltext).

---

## 4 · Was ich nicht kaputtgemacht habe — nachgemessen

| | Ergebnis |
|---|---|
| „keine Fehler auf der Seite" · `werkbank/schuss.mjs`, alle vier Epochen | **4 von 4** (`werkbank/schuss/welle13-woche-e1..e4.png`) |
| `BRAUHAUS.lage.length` | **0** in allen vier Epochen, im Ladezustand und nach 14 gespielten Wochen |
| Seitenfehler in allen Messläufen (8 × 100 Wochen, 78 Wochen Übergabeprobe) | **0** |
| `BRAUHAUS.haushalt.ueberRand()` | leer in 1350, 1884, 1970; in 1600 vier Einträge, **alle von DER SUD**, keiner von mir |
| Wochenkarte im Kasten | **3,21 % der Bühne** in allen vier Epochen (Grenze der Platzordnung 3,5 %) |
| Wochenkarte **gemalt** (nur die Chips, kein Papier) | **0,74 % (1350) bis 1,57 % (1970)** der Bühne |
| Wochenkarte je `stadt-zugeklappt` oder `stadt-verdeckt` | **nie**, in keiner Epoche |
| abgeschnittener Text auf der Wochenkarte (je 24 Wochen, alle vier Epochen, 1366×768 · 1600×900 · 2752×1536) | **kein einziger** |
| Chip, der über die eigene Kastenkante ragt | keiner — bei 1366×768 trug die Karte anfangs vier Chips und der oberste stand 24 px darüber; sie trägt dort jetzt drei (`B.buehne.masse().hoehe < 820`) |
| Schlussblatt, „nächster Zug"-Zeile, `fuhre:wie-vorige`, `fuhre:fuellen`, `fuhre:leeren`, `fuhre:abschicken` | unverändert, kein Schlüssel umbenannt |
| `Math.random()` in `fuhre*.js` | **1 Treffer, unverändert und vor dieser Welle da** — `neuesSpiel()`, der Knopf „Von vorn anfangen — dieselbe Stadt, andere Würfel". Er würfelt die **neue** Saat für die **nächste** Partie und wechselt dabei die Adresse; er kann keine laufende Messung stören. Von mir kam kein einziger Zufallsaufruf dazu. |
| Wanduhrfristen (`setTimeout`) neu eingebaut | **0** — der Reiterhorcher und der Anschlaghorcher senden `zeichne` in derselben Runde |

### Die zweite Messlatte in 1600 — nachgemessen, nicht behauptet

**1600 hat keine Reserve** (ρ +0,538 gegen eine Grenze von 0,700, Abstand
0,162), und die Aufsicht verlangt, dass jede Änderung an Preisen, Erträgen
oder Fristen 1600 zuerst misst. Ich habe an **Preisen, Erträgen, Fristen,
Sudmengen, Wagengrößen und Fassplätzen nichts geändert** — die Fuhrpläne
verteilen nur anders, was ohnehin auf den Wagen passt. Gemessen mit dem
vorhandenen Gerät, 400 Wochen, Saat 1350:

```
werkbank/schuss/rueckkopplung-r3/linie.mjs 2 400
→ E2: 400 Wochen (1600–1613), Kasse 302–2851, KENNZAHL roh 0,93–7,68×,
     Ziel 1× / Festlegung 1×, Seitenfehler 0
werkbank/schuss/rueckkopplung-r3/auswerten.py
→ EPOCHE 1600 · 14 J · Spearman +0,538 · Pearson +0,491 · <1× 1/14
→ LATTE |rho| < 0,700 nach Spearman: BESTEHT
```

**+0,538 und 1 von 14 Jahren unter 1× — Ziffer für Ziffer der Stand nach
Welle 12.** Das ist kein Zufall, sondern Bauart: `linie.mjs` klickt
`fuhre:wie-vorige` und `fuhre:abschicken` **namentlich** und fasst weder
`fuhre:plan:*` noch `fuhre:sprung` an; beide Schlüssel stehen unverändert an
unveränderter Stelle auf dem Brett DER WAGEN. Die Partie, die dieses Gerät
spielt, ist Zug für Zug dieselbe wie vorher.

**Der Flächenhaushalt (`haushalt.pruefe()`) ist heute für sechs von sieben
Stücken über dem Budget** — 1350 nach 14 Wochen: `stadt 247.002/40.000`,
`preis 126.812/24.000`, `sud 73.269/34.000`, `fuhre 61.105/34.000`,
`erbe 39.124/28.000`, `name 28.932/20.000`. Das ist ein Zustand des
gemeinsamen Baums an diesem Tag (vier Builder schreiben gleichzeitig, und die
Michaelitafel liegt seit R7 von selbst auf), kein Befund über ein einzelnes
Stück. Mein Anteil daran ist die Wochenkarte mit **10.596 bis 22.656 gemalten
Bildpunkten** — das ist die Zahl, die zu Lasten der FUHRE geht, und ich nenne
sie, damit die Aufsicht sie abziehen kann.

---

## 5 · Was ich der Aufsicht melde

1. **Die vier Bretter der FUHRE liegen beim Laden als Reiter, und damit ist die
   Woche ohne Reiterklick nicht spielbar** (§1). Ich habe das nicht in
   `stadt.js` geheilt — DIE STADT ist in dieser Welle zu —, sondern die Woche
   an einen Ort gelegt, den die Platzordnung nicht anfasst. Die Bretter selbst
   liegen weiter als Reiter da; wer sie aufschlägt, findet alles wie bisher.
   **Für DEN SUD, DEN NAMEN und DAS ERBE gilt dasselbe Problem unverändert.**
2. **`B.uhr.springe()` lässt den Wagen stehen** (§2, gemessen: ein
   gesprungenes Braujahr kostet 1350 eine Adresse, den ganzen Keller und
   33 von 40 Rohstoff). Wer es benutzt, muss wissen, dass die Uhr die Woche
   laufen lässt, aber niemand für ihn liefert.
3. **Die Latte „drei häufigste ≤ 60 %" misst in 1350 und 1600 die Knappheit,
   nicht die Bedienung** (§3). Sie ist dort nur zu erreichen, indem man an
   Sudmenge, Wagengröße oder Fassplätzen dreht — und 1600 hat bei ρ +0,538
   keine Reserve. Das ist eine Entscheidung der Aufsicht, keine eines
   Stück-Builders.
4. **Der Startzettel des Rahmens (R4) und die Wochenkarte teilen sich den
   unteren linken Streifen.** Ich weiche aus, solange er liegt. Wenn der
   Rahmen ihn später verschiebt, kann diese Ausnahme wieder heraus —
   `zeichneWoche()`, eine Zeile.

---

## 6 · Die Abnahme in einer Tabelle

| Auftrag | verlangt | gemessen | |
|---|---|---|---|
| **R11** Zielsatz in jeder Woche | mindestens einmal auf dem ersten Schirm, ohne ein Brett aufzuschlagen | `B.welt.meldeZiel()` in jedem Zeichendurchgang; im Ladeschirm aller vier Epochen abgelesen | **bestanden** |
| **R12** Übergabe fällt auf | 1350–1355 ohne einen Reiterklick | 78 Wochen, 1350–1358, **0 Reiterklicks**; Angebot lag 13 Wochen, sichtbar in 12–13 davon, mit Knopf in 9. 1600: 9 von 9 | **bestanden** |
| **R13** häufigster Knopf ≤ 35 % | ≤ 35 % | 1350 **32,5 %** · 1600 36,8 % · 1884 **26,8 %** · 1970 **17,0 %** (vorher 71 %, ohne Reitersuche 94 %) | **3 von 4** |
| **R13** drei häufigste ≤ 60 % | ≤ 60 % | 1350 82,5 % · 1600 72,8 % · 1884 **56,7 %** · 1970 **43,7 %** (vorher 78 %) | **2 von 4** |
| **R14** Blatt schließt bei fremdem Reiter | Georgi- und Übergabeblatt | gebaut, Fangphase, mit `zeichne`; Angebot bleibt liegen | **bestanden** |
| keine Fehler auf der Seite · `lage` 0 | alle vier Epochen | 4 von 4 · 0 in allen Läufen | **bestanden** |
| ρ in 1600 | \|ρ\| < 0,700 | **+0,538**, Ziffer für Ziffer der Stand nach Welle 12 | **bestanden** |

**Nicht bestanden: „drei häufigste ≤ 60 %" in 1350 und 1600.** Die Ursache
steht in §3 und ist gemessen: in 1350 stehen in 3 von 100 Wochen drei oder
mehr verschiedene Ladungen zur Wahl — es ist zu wenig Bier im Keller, als dass
sich mehr als drei Knöpfe die Arbeit teilen könnten. Wer diese Latte dort
reißen will, dreht an Sudmenge, Wagengröße oder Fassplätzen, und das misst
1600 zuerst. Das ist eine Entscheidung der Aufsicht.

---

## 7 · Was ich angefasst habe

| Datei | was |
|---|---|
| `spiel/stuecke/fuhre.js` | Fuhrpläne · Wochenkarte · Sprung · Zielsatz · Übergabe an vier Orten · Reiterhorcher · Anschlaghorcher |
| `spiel/stil/fuhre-zusatz.css` | `.fu-woche` und ihre Chips · `.fu-sommer-uebergabe` · der kleine Knopf auf dem Übergabeblatt |
| `werkbank/schuss/woche-w13/hand-w13.mjs` | die Hand, die die Woche liest statt sie auswendig zu kennen |
| `werkbank/schuss/woche-w13/klickanteil.py` | die Auswertung, an der R13 hängt |
| `werkbank/schuss/woche-w13/uebergabe.mjs` | die Abnahme zu R12 — ohne einen Reiterklick |
| `werkbank/schuss/woche-w13/springeprobe.mjs` | was `B.uhr.springe()` mit der FUHRE macht |
| `werkbank/schuss/woche-w13/freiflaeche.mjs` | wo im Bild Platz ist und wie groß ein Brett sein darf |
| `werkbank/schuss/woche-w13/haushalt.mjs` · `lage.mjs` | Flächenhaushalt, `ueberRand`, Lage der Bretter |
| `werkbank/schuss/welle13-woche-e1..e4.png` | die vier Aufnahmen |

**Nicht angefasst:** `spiel/kern/**`, jedes fremde Stück, jedes fremde DOM,
`spiel/index.html`, `spiel/LIESMICH.md`. Kein `git add`, kein `commit`,
kein `push`.
