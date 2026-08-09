# Welle 15 · Stück 1 · DER GRIFF — Baubericht

Builder: DER GRIFF (Welle 15). Dateibesitz: `spiel/stuecke/preis*.js`,
`spiel/stil/preis*.css`. Läuft, nicht erst am Ende geschrieben.

## Befund, gegen den gebaut wird

Der Konzernvertrag (`preis:festlege:konzern`, 1970) kostet nichts, ist in
allen sechs Braujahren `hit:true`/`aus:false`, bringt +100 094 DM über sechs
Braujahre — und wurde in drei Läufen über 400 echte Wochen kein einziges Mal
genommen. Ursache (Analyst, WELLE-15.md): der Tafel-Griff (`data-zug`
`preis:tafel`) ist ein Auf-Zu-Schalter unter EINEM `data-zug` — er öffnet UND
schließt. Eine Hand, die alle greifbaren Knöpfe der Reihe nach anfasst,
öffnet die Tafel mit dem einen Klick und klappt sie mit dem nächsten Griff
wieder zu, bevor die Festlegung an der Reihe war.

## R15.1 — was gebaut wurde

Datei: `spiel/stuecke/preis.js`.

1. Neue Funktion `festlegungWartet()` (nach `festPreis`, ca. Zeile 1832):
   `true`, wenn die laufende Amtszeit noch keine Festlegung getroffen hat
   (`festlegungOffen()`), heute Michaeli ist (`woche===1`) und mindestens
   eine der bis zu vier auf der Tafel gezeigten Festlegungen bezahlbar ist
   (`preis===0 || B.welt.kann(preis)`) — dieselbe Prüfung, die
   `spalteAngebote()` für den Satz „heute N zu haben" schon rechnet.

2. `zeichneGriff()`: wenn die Tafel offen ist UND `festlegungWartet()` wahr
   ist (`haeltFest`), tut der Griff-Klick nichts mehr — kein `Z.offen=false`,
   kein Zeichnen. Der Knopf bleibt anklickbar (kein `aus:true`, damit ein
   Klick weiterhin `hit:true` bleibt und keine Sackgasse aussieht), trägt
   aber eigenen Text/Titel/CSS-Klasse (`pr-griff-haelt`, grüner Rahmen statt
   Signalrot), die erklären, dass geschlossen werden muss über die
   bestehenden, **eigenen** Knöpfe im Tafel-Fuß: `preis:nichts` („Nichts
   nehmen") oder `preis:tafel-zu` („Das Jahr beginnen") — beide unverändert,
   beide schließen weiterhin bedingungslos (das sind erklärte
   Spielerentscheidungen, kein Danebengreifen). Genau das Muster aus Welle 13
   für den fremden Reiterklick: Schließen bekommt einen eigenen, benannten
   Zug statt am Toggle mitzuhängen.

   `.pr-griff` (die Klasse, an der DER GEGNER seine Ausweichzonen misst,
   Kontrakt 4) ist unverändert — nur der innere Knopf bekommt die neue
   Modifikator-Klasse.

Datei: `spiel/stil/preis-zusatz.css` — `.knopf.pr-griff-haelt` ergänzt
(grüner Rahmen analog zu `.pr-griff-wartet`/`.pr-griff-heute`, keine
Kollision mit bestehenden Klassen).

## Abnahme 1 — die Zahl

Werkzeug: `werkbank/schuss/welle15-griff/hand-griff.mjs`, neu gebaut im
selben Geist wie `werkbank/schuss/welle14/hand-suchend.mjs` (Nav-Knöpfe ohne
Preisschild zuerst, wiederholt bis nichts Neues mehr auftaucht; dann
Preisschild-Knöpfe größter Wert zuerst, bis zu drei je Runde; dann
`weiter`) — wählt ausschließlich aus `BRAUHAUS.zuege()`, kennt keinen
Zugnamen vorher. Liest zur Erfolgsmessung `BRAUHAUS.preis.lage().festGenommen`
(Grundwahrheit, kein Text-Raten). Epoche 4 (1970), 6 Braujahre (180 Wochen),
drei Läufe mit verschiedener Saat (4001/4002/4003) gegen den Messstand mit
dem Fix (Hafen 8942).

Erste Beobachtung beim Bau: die suchende Hand ist in Epoche IV (viele
Knöpfe über alle vier Stücke) deutlich langsamer als in Welle 14 gemessen
(~4–7 Wochen/Minute statt ~17) — reine Laufzeitfrage, kein Fehlverhalten.

**`nachher-lauf1` (Saat 4001, 6 Braujahre) verworfen — Nebenlast der
Aufsicht.** Die Aufsicht hatte parallel eigene Läufe auf Hafen 8951
gestartet, ohne `messfenster.sh` zu benutzen; rund 12 der 18 gemessenen
Minuten liefen unter dieser Last. Auf eigenen Hinweis der Aufsicht getötet
und **nicht** als einer der drei Läufe gewertet, obwohl er `konzern` bereits
in der ersten Woche (Braujahr 1970, Amtszeit 1) genommen hatte — das ist
ein Datenpunkt, aber keiner, der unter Nebenlast entstand, zählt nicht.

**Fensterlänge ab jetzt: 4 Braujahre (120 Wochen) statt 6**, auf Rat der
Aufsicht, um drei saubere Läufe statt eines einzigen zu erhalten. Der
Konzernvertrag ist laut Befund in ALLEN sechs Braujahren `hit:true`/
`aus:false` — wird er in 4 genommen, ist die Frage „findet die Hand ihn
überhaupt" beantwortet; ein längeres Fenster verschiebt die Antwort nicht,
nur die Wartezeit.

**Lauf 1 (Saat 4001, 4 Braujahre, 123 echte Wochen):** `konzern` NICHT
genommen. `festGenommenGesamt: []`.

**Zweiter Fund, gemessen an diesem Fehlschlag:** der Griff ist nicht der
einzige Auf-Zu-Schalter der Tafel. `handHorcher()`'s `istReiter()`-Zweig
(Welle 13, „der fremde Reiterklick") räumt die Tafel bei JEDEM Klick auf
`stadt:reiter:*` / `stadt:ortsmarken` / `stadt:bauhof` /
`stadt:alles-zuklappen` ebenso unbedingt weg wie früher der Griff — und
zwar unabhängig davon, ob der Spieler die Tafel selbst berührt hat. Im
Protokoll von Lauf 1 erscheint `preis:festlege:konzern` **kein einziges
Mal** als Kandidat, obwohl der Griff 8-mal im gesperrten Zustand
(„bleibt offen …") gesehen wurde — die Tafel wurde jedes Mal von einem
fremden Reiterklick wieder zugeklappt, bevor Phase 2 der Hand (die
Preisschild-Knöpfe) an der Reihe war.

**Versuch, auch diesen Riegel zu setzen — GEMESSEN UND VERWORFEN.** Derselbe
`festlegungWartet()`-Riegel auch im `istReiter`-Zweig eingebaut, dann
`rueckkopplung-r3/linie.mjs` (die kundige Hand) noch einmal über alle vier
Epochen laufen lassen: **Epoche II blieb bei „kein Zug veraendert die
Woche" hängen**, `1601/1`, nach 31 von 100 verlangten Wochen. Ursache: hält
`Z.offen` über mehrere Wochen wahr, klemmt DIE STADT die lang offene Tafel
irgendwann von sich aus (`Z.geklemmt`) — und dafür gibt es seit Welle 13 die
Rückholung (`darfZurueck`/`holeZurueck`, `VERSUCHE=3`): sie fängt WEITER ab
und legt die Tafel bis zu dreimal zurück auf den Tisch, bevor ein
WEITER-Klick wirklich durchgeht. Die kundige Hand probiert WEITER an dieser
Stelle nur zweimal und blieb hängen — kein Absturz, aber genau das
**Einsperren**, das dieser Bau ausdrücklich nicht anrichten soll (siehe
Auftrag: „Was du nicht tust: … oder den Spieler einsperren"). Wieder
entfernt; der Kommentar an der Stelle (`preis.js`, `handHorcher`) hält beide
Zahlen fest, damit es niemand unbesehen noch einmal versucht.

**→ SCHWELLE ZURÜCK AN DIE AUFSICHT.** Der Griff-Riegel allein (R15.1 wörtlich
gelesen) genügt nicht immer für die verlangte Zahl aus Abnahme 1, weil eine
ZWEITE, von Welle 13 gebaute Schließroute (der fremde Reiterklick) auf
demselben Zustand (`Z.offen`) sitzt und vom Auftrag nicht benannt ist. Ein
Riegel dort kollidiert nachweislich mit der Rückholung derselben Welle 13.
Das ist keine Zahl, die ich verschieben darf — ob die Reiterroute in den
Geltungsbereich von R15.1 gehört und, wenn ja, wie sie mit der Rückholung
zusammengeführt wird, gehört der Aufsicht. Ich baue mit dem alleinigen
Griff-Riegel weiter und messe ehrlich, wie weit er reicht.

**Mit dem alleinigen Griff-Riegel (kein Reiter-Riegel), drei saubere Läufe,
je 4 Braujahre, sequenziell durch `messfenster.sh`, Hafen 8942:**

| Lauf | Saat | echte Wochen | `konzern` genommen | Braujahr | Seitenfehler |
|---|---|---|---|---|---|
| 1 | 4001 | 123 | **NEIN** | — | 0 |
| 2 | 4002 | 122 | **JA** | 1970 (Michaeli der ersten Woche) | 0 |
| 3 | 4003 | 123 | **JA** | 1970 (Michaeli der ersten Woche) | 0 |

**ERGEBNIS ABNAHME 1: 2 von 3 Läufen — die Latte (≥ 2 von 3) ist erreicht.**
Heute (vor diesem Bau): 0 von 3. In beiden erfolgreichen Läufen fiel die
Entscheidung bereits am allerersten Michaeli (1970, Woche 1) — sobald der
Griff die Tafel nicht mehr aus Versehen zuklappt, sieht die suchende Hand
den Konzernvertrag in Phase 2 (Preisschild-Knöpfe, größter Wert zuerst) und
nimmt ihn, weil er der größte Einzelwert auf dem Bildschirm ist. Lauf 1
verfehlt ihn dagegen vollständig (`festGenommenGesamt: []` über alle 123
Wochen) — nicht weil der Griff ihn zuklappt (der hält seit dem Fix stand,
8-mal im gesperrten Zustand gesehen), sondern weil der fremde Reiterklick
(siehe oben) ihn stattdessen zuklappt, bevor Phase 2 an der Reihe ist. Das
ist genau die verbliebene Lücke aus der zurückgestellten Schwelle: der
Griff-Riegel reicht für 2 von 3, nicht für 3 von 3.

Alle drei Läufe: 0 Seitenfehler, keine `fehler[]`-Einträge, sauber am
Zeitlimit (`maxWochen-erreicht`) beendet, kein `hand-festgefahren`.
Protokolle unter `werkbank/schuss/welle15-griff/protokoll/griff-lauf{1,2,3}(-ergebnis).json(l)`.

## Tor und Kontrakte

Gemessen gegen den Arbeitsbaum (Hafen 8942, Fix aktiv):

- `tor.mjs`: **TOR OFFEN** — E1..E4 je `lage=0`, `fehler=0`, `zuege>0`.
- `kontrakte.mjs`: 14 bestanden, 1 gerissen (`Aufgeld nach Lieferung`, E1),
  1 nicht messbar (`ERBE AM_HAUS-Wortliste`, E3) — **identisch** zum
  Messstand auf demselben Commit (Hafen 8941, HEAD `af3cce1`, vor dem Fix):
  derselbe Riss an derselben Stelle, nichts zusätzlich gerissen. Der
  gerissene Kontrakt liegt in DER FUHRE/DER NAME (`fuhre*.js`/`name.js`),
  nicht in meinem Dateibesitz — vorbestehend, nicht durch R15.1 verursacht.
  Kontrakt 4 (`GEGNER liest .pr-griff`) bestanden in allen vier Epochen:
  die Klasse `.pr-griff` selbst ist unverändert, nur der innere Knopf trägt
  jetzt zusätzlich `pr-griff-haelt`.

## R3 — Partieneutralität

Sorge vor der Messung: die bestehende „kundige Hand"
(`werkbank/schuss/rueckkopplung-r3/linie.mjs`) schließt den Griff nach der
Michaeli-Behandlung unbedingt per Klick — auch wenn sie selbst (wegen ihres
eigenen 45%-der-Kasse-Filters) eine bezahlbare, aber ihr zu teure Festlegung
liegen lässt. In diesem Fall bliebe die Tafel nach R15.1 offen, wo sie
vorher schloss, und der Rest der Woche könnte anders laufen.

**Gemessen statt vermutet**, alle vier Epochen, je 100 Wochen, vorher
(Hafen 8941, HEAD `af3cce1`) gegen nachher (Hafen 8942, Fix):

| Epoche | Kasse-Spanne | Kennzahl | Festlegung genommen | `reihe`/`jahre`/`leiterRoh`/`schluss` gleich | Seitenfehler |
|---|---|---|---|---|---|
| E1 (1350) | 34–469 | 1,43–5,89× | 0× / 0× | **ja, Zeichen für Zeichen** | 0 / 0 |
| E2 (1600) | 302–2851 | 2,98–3,91× | **1× / 1×** | **ja, Zeichen für Zeichen** | 0 / 0 |
| E3 (1884) | 2528–14250 | 1,46–8,35× | 0× / 0× | **ja, Zeichen für Zeichen** | 0 / 0 |
| E4 (1970) | 320–95857 | 0,79–3,94× | 0× / 0× | **ja, Zeichen für Zeichen** | 0 / 0 |

E2 ist der wichtige Fall: dort NIMMT die kundige Hand tatsächlich eine
Festlegung — und die Partie bleibt trotzdem Zeichen für Zeichen dieselbe
(sobald `festlegungOffen()` durch die Übernahme falsch wird, ist auch
`haeltFest` falsch, und der Griff schließt wieder wie vorher). Die befürchtete
Falle (bezahlbar laut Spiel, aber vom 45%-Filter der kundigen Hand
abgelehnt) ist in den gemessenen 400 Wochen (4 Epochen × 100) **kein einziges
Mal** aufgetreten — R15.1 ist für die kundige Linie in diesem Fenster
partieneutral, gemessen an vier Epochen. Ein längeres Fenster könnte den
Fall theoretisch noch zeigen; das wird hier ausdrücklich als Grenze der
Messung benannt, nicht verschwiegen.

Diese Tabelle stammt aus der Messung mit dem alleinigen Griff-Riegel
(nach dem Verwerfen des Reiter-Riegels, siehe oben). Zur Gegenprobe: mit dem
(inzwischen entfernten) Reiter-Riegel lief E2 nach nur 31 von 100 Wochen in
„kein Zug veraendert die Woche"; nach dem Entfernen lief E2 sofort wieder
sauber über die vollen 100 Wochen mit demselben Ergebnis wie in der Tabelle
(Kasse 302–2851, Festlegung 1×, 0 Fehler) — der Revert ist vollständig, es
blieb nichts von der zweiten Änderung im Code hängen außer dem erklärenden
Kommentar.

## Schwellen zurück an die Aufsicht

**Eine Schwelle**, ausführlich oben unter Abnahme 1 belegt, hier
zusammengefasst: Die Tafel hat neben dem Griff eine **zweite** unbedingte
Schließroute — der fremde Reiterklick (`handHorcher`/`istReiter`, Welle 13).
Ihn ebenfalls mit `festlegungWartet()` zu sperren wurde gebaut, gemessen und
wieder verworfen, weil es die kundige Hand in Epoche II in ein Zwei-Klick-
Einsperren lief (`kein Zug veraendert die Woche`, `1601/1`) — Kollision mit
der Rückholung derselben Welle 13 (`darfZurueck`/`holeZurueck`,
`VERSUCHE=3`). Mit dem alleinigen Griff-Riegel steht Abnahme 1 bei **2 von
3** — die Latte ist erreicht, aber nicht mit Rand: ein vierter oder fünfter
Lauf könnte unter die Latte fallen, wenn der Reiterklick öfter zuschlägt als
in diesen drei Läufen. Ob die Reiterroute in den Geltungsbereich von R15.1
gehört, und wenn ja, wie sie mit der Rückholung zusammengeführt wird, ohne
das Zwei-Klick-Einsperren zu wiederholen, ist eine Frage, die eine Zahl im
Brief (die 2-von-3) verschiebt — sie gehört der Aufsicht, nicht mir.
