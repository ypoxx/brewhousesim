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
