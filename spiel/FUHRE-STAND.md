# DIE FUHRE — Stand nach dem Tiefenlauf

*Zwei Runden gefahren (3 und 4), am 1. August 2026 unabhängig nachgespielt: 5 Langläufe über
je 200 Wochen, 4 gut geführte Läufe über je 130 Wochen, 3 Läufe bis zum Tod des Hauses, alle
vier Epochen, 1600×1000 und 2752×1536, echte Mausklicks auf mit `elementFromPoint` geprüften
Koordinaten. Keine Zeile aus dem Quelltext, außer wo eine Zeilennummer genannt ist.
Bilder: [`werkbank/schuss/fuhre-stand-e3.png`](../werkbank/schuss/fuhre-stand-e3.png) (1887,
laufende Partie), [`fuhre-stand-e1-ende.png`](../werkbank/schuss/fuhre-stand-e1-ende.png)
(Schlussblatt). Keine Konsolenfehler in irgendeinem Lauf.*

## 1 — Was am Ende steht

Ein Wochentakt für vier Epochen mit je eigener Verbliste (16/16/19/16 Verben, vier davon in
allen vier Epochen gleich): Sudplan ansetzen, Keller füllen, Wagen laden, **FUHRE ABSCHICKEN**.
Die Fuhre heißt 1350 Ochsenkarren, 1600 Pferdefuhrwerk, 1884 Halber Wagen, 1970 Lastzug; das
Lager heißt Keller · Gewölbe · Eiskeller · Tanks. Der Rohstoff ist 1350 Grut, danach Hopfen.
Vier Bretter je Epoche, über die Reiterleiste der STADT einzeln aufklappbar.

Was es nachweislich **kann**:

- **Es hält an, wenn das Haus stirbt.** Passiv gespielt (die fünf Bauhof-Knöpfe, die das Spiel
  selbst empfiehlt, danach nur WEITER) endet E1 in 1353/13 mit `zeit.ende = true`, Schlussblatt,
  Generationenzeile und der Liste *„Wie das Auftragsbuch leer wurde"*. WEITER steht danach auf
  ENDE und ist aus. Ich habe auf dem Schlussbildschirm alle 13 übrigen bedienbaren Knöpfe
  gedrückt: Zustand vorher und nachher Zeichen für Zeichen gleich (1353/13, −20 Pf). Der
  absorbierende Zustand aus Runde 3 ist tot.
- **Der Wiederanfang funktioniert.** „Von vorn anfangen — dieselbe Stadt, andere Würfel" lädt
  `?epoche=1&saat=2721`, 1350/1, 112 Pf, WEITER läuft wieder. Einmal sauber nachgemessen.
- **Die geldfreien Wege sind gebaut und wirken.** Notsud (Kofent/Nachbier/Einfachbier/
  Handelsmarke, 0 in allen vier Epochen), Kerbholz, Rückverkauf. Bei Kasse 0 in E1 ließ sich
  von Hand wieder Geld erzeugen.
- **Der Gegner zieht ohne den Spieler.** 21 Züge des Adlers bis 1351/1, 43 bis 1353 in einer
  Partie, in der ich nichts getan habe außer WEITER.

## 2 — Die Kennzahl: Barschaft ÷ Preis des billigsten anklickbaren Zuges

Am Bildschirm abgelesen, alle vier Bretter je Messpunkt einmal aufgeklappt. **A** = liefernder
Spieler (laden, fahren, sonst nichts). **G** = gut geführtes Haus (Rohstoff nachkaufen,
Sudplan setzen, laden, fahren). Runde 3 und 4 sind die Zahlen der damaligen Prüfer.

| Epoche | R3 (Spitze → Plateau) | R4 A (Anfang → 6. Jahr) | R4 B (gierig) | **heute A** (13 Braujahre) | **heute G** (8 Braujahre) |
|---|---|---|---|---|---|
| E1 1350 | 91,3× → 1,5–3,5× | 8,62× → 0,18× | 8,62× → 0,21× | 10,3× → **0,0× oder darunter an zwölf Messpunkten in Folge, 1351/30 bis 1362/30** | 10,3× · 33,8× · 7,0× · −0,2× · 2,5× · 7,0× · 0,0× · 16,3× · 3,8× · −1,2× · 3,3× · 11,8× · 0,0× |
| E2 1600 | 92,7× → 0,9–9,6× | 8,89× → 3,97× | → −0,15× | 19,6× → 0,0× → 5,9–9,9× → 1,2× | 19,6× · 46,6× · 23,9× · 1,5× · 6,1× · 9,4× · 0,0× · 4,9× · 2,6× · 0,0× · 4,2× · 8,1× · 0,0× |
| E3 1884 | 180,0× → 1–3× | 28,05× → 0,12× | → 0,0× | 156,3× → **0,0× an dreizehn Messpunkten in Folge, 1884/30 bis 1896/30** | 156,3× · 118,3× · 52,4× · 0,0× · 1,5× · 4,2× · −0,1× · 6,9× · 1,6× · 0,0× · 1,6× · 5,9× · 0,0× |
| E4 1970 | 66,1× → 6–23× | 12,36× → 7,99× | → 0,0× | 15,0× · 32,0× · 23,8× · 17,7× · 2,9× · 11,2× · … · 23,7× | 12,1× · 81,8× · 74,2× · 50,0× · 70,6× · 56,4× · 37,2× · 69,9× · 70,3× · 56,4× · 80,6× · 60,7× · 64,3× |

**Befund, dreimal unabhängig bestätigt:** Die Wohlstandssingularität aus Patrizier IV gibt es
nicht. Die Kurve steigt in keiner Epoche über die Partie; sie fällt in E1–E3 in den ersten zwei
bis drei Braujahren um ein bis zwei Größenordnungen und bleibt dann liegen. Latte 2 ist an
dieser Stelle bestanden — **und der Grund dafür ist ein Fehler, kein Verdienst.** Sie fällt
nicht auf ein arbeitendes Maß, sondern auf **null**: in E1 elf, in E3 zwölf Braujahre am
Stück mit Kasse 0 und Q = 0,0× an jedem Messpunkt. Das eigene Nebenmaß bestätigt es wörtlich — auf dem Bild von
1887 steht unten rechts *„nächster Zug: Annonce im Wochenblatt — 240 M (Kasse reicht 0,3×)"*
und auf der Michaelitafel daneben *„Kasse reicht dafür 0,03×"*.

E4 ist die Ausnahme in beide Richtungen: dort steigt die Kennzahl von 12× auf 50–80× und bleibt
oben. 1970 ist die einzige Epoche, in der das Haus wohlhabend ist — und die einzige, in der ein
gieriger Spieler in Runde 4 acht Braujahre auf 0 saß. Die vier Epochen sind wirtschaftlich
nicht dasselbe Spiel; sie sind auch nicht gegeneinander geeicht.

## 3 — Hält die These, „die Knappheit, die kein Geld ist"?

**In 1970 ja. In 1350, 1600 und 1884 nein — und zwar messbar nein.**

Das Stück behauptet, das Haus sterbe an der Adresse, nicht am Geld. Für den Tod stimmt das:
in allen Läufen, die endeten, entzog der Rat das Braurecht, weil zwölf Wochen lang keine
Schenke ein Fass genommen hatte — bei −20 Pf, −48 Pf, −28 fl, −16 M, 0 DM in der Lade. Der
Kern hält die Uhr an (§12), das Blatt liegt, das Haus fängt von vorn an. Das ist erledigt.

Für das **Spiel davor** stimmt es nicht. Ein liefernder Wirt in 1884 hat in Woche 20 des
zweiten Braujahres 0 M, danach zwölf Braujahre lang 0 M. Der Keller steht auf 80 von 90,
das Bier ist da, die Häuser wollen 116 hl — und der einzige Zug, der die Fuhre größer machen
würde (Halber Wagen 508 M, Ganzer Wagen 764 M), ist nie bezahlbar, weil die Fuhre, die man
hat, 70–250 M die Woche einbringt. Das ist keine Knappheit, die kein Geld ist. **Das ist eine
Geldschranke vor der Tür, hinter der die eigentliche Knappheit läge.** Die drei geldfreien
Antworten sind gebaut, aber sie führen aus der Subsistenz nicht heraus: der Notsud bringt die
schlechteste Stufe, die der Gasthof nicht nimmt, das Kerbholz hat sechs Kerben, der Rückverkauf
gibt weniger, als er nahm. Zwölf Braujahre lang wird jede Woche derselbe Zug gespielt und
nichts wächst.

**Was es kosten würde.** Nichts an der Ereignislogik, alles an drei Zahlen in `fuhre-daten.js`,
und zwar zusammen, nicht einzeln:
1. Der Ertrag je Fuhre muss in E1–E3 die laufenden Kosten um genug übersteigen, dass die
   nächste Stufe der Fuhre (Halber Wagen, Ochsenstall, Fass vom Böttcher) in drei bis fünf
   Braujahren erreichbar wird — heute ist sie es nie.
2. Der Notsud darf nicht die einzige Antwort bei Kasse 0 bleiben, und die Antworten müssen
   **auf dem Schirm stehen**: bei Kasse 0 sind in E3 noch drei Preisschilder gleichzeitig
   sichtbar, und keines sagt „jetzt auf Kerbe kaufen" oder „Vorrat zurückverkaufen".
3. Der Deckel gegen E4: dort steigt die Kennzahl auf 80×, während E3 auf 0 liegt. Beides ist
   dieselbe Zahl, verschieden geeicht.

Das ist eine Runde Arbeit, keine Woche — aber es ist Entwurfsarbeit an der eigenen These und
nicht an einem Textbaustein.

## 4 — Was offen geblieben ist

**Meins, unbehoben, wörtlich reproduziert:** Der Satz auf dem Schlussblatt, der die These
trägt, ist unverändert `fuhre.js` Z. 2482–2489 und hängt allein an `s.kasse <= 0`. Heute,
frisch gefahren, steht in E1 1353/13 auf dem Blatt (zweiter Lauf derselben Spielweise, andere
Würfel als der oben genannte mit −20 Pf): *„Die Lade war leer — −48 Pf — und das war
nie der Grund. Mit leerer Lade hat dieses Haus jahrelang weitergebraut: auf Kerbe, auf den
zweiten Guss, auf zurückverkaufte Vorräte."* — und vier Zeilen darunter, auf demselben Blatt:
*„Fuhren hinausgeschickt 0 · Ausgeliefert 0 Fass · Ohne Rechnung hergegeben 0 Fass · Adressen
zurückgeholt 0."* Der Beweis widerlegt den Satz auf demselben Blatt, und genau dieser Fall
kommt bei dem Lauf heraus, den ein Prüfer als ersten fährt. Der Fund ist aus Runde 4, er ist
seither nicht angefasst worden, und er ist in einer halben Stunde behoben: den Satz an
`s.fuhren`, `Z.kerben` und `s.verschenkt` binden und die tatsächlichen Zahlen nennen.

**Meins, neu:** die Nullkasse als Dauerzustand (§3 oben). Der schwerste offene Punkt.

**Nicht meins** — gehört nach [`ZUSTAENDIGKEIT.md`](ZUSTAENDIGKEIT.md), nicht hierher; hier
steht nur, dass es heute noch reproduziert:
- Unter der Georgi-Sperre der FUHRE sind in 1351/1 noch **18 Knöpfe** bedienbar, darunter
  `preis:tafel` und `preis:chronik-auf`. Das Blatt sagt *„der Hof ruht"*. Kernaufgabe §2,
  unverändert offen.
- Nach dem Ende des Hauses (`zeit.ende = true`) bietet DER PREIS weiter *„Michaelitafel 1353 ·
  5 Angebote"*; öffnet man sie, sind 23 Knöpfe bedienbar, darunter DES GEGNERS *„ablösen
  124 Pf"* und acht Ortsmarken der STADT. Bewegt hat sich nichts — die Uhr steht korrekt —
  aber einem Haus ohne Braurecht wird noch ein Jahr angeboten.
- Die vier Bretter der FUHRE tragen `stadt-zugeklappt` und `pointer-events: none`, solange sie
  nicht ihr Reiter aufklappt. Das ist der Rahmen der STADT und richtig so; es heißt aber, dass
  Latte 2 („Optionen mit Preisschild **nebeneinander**") nie mehr als ein FUHRE-Brett auf
  einmal zu sehen bekommt: gemessen 3 bis 20 gleichzeitig anklickbare Preisschilder, bei
  Kasse 0 nur noch 3.

## 5 — Der eine Satz für die nächste Welle

> **Die FUHRE hat das Sterben gelernt und das Wachsen nicht: in 1350, 1600 und 1884 steht die
> Kasse ab dem zweiten Braujahr elf bis dreizehn Jahre lang auf null, und solange das so ist,
> ist die Knappheit dieses Spiels doch wieder Geld — wer es anfasst, eicht die Erträge der
> Fuhre gegen die Preise der nächsten Fuhre, nicht die Sätze auf dem Schlussblatt.**
