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
(~4 Wochen/Minute statt ~17) — reine Laufzeitfrage, kein Fehlverhalten. Ein
Lauf über 180 Wochen braucht dadurch bis zu ~60–75 Minuten; `MAXMIN=90`
gesetzt, damit kein Lauf am Zeitlimit statt am Wocheninhalt abbricht.

*(Ergebnis der drei Läufe wird ergänzt, sobald sie durchgelaufen sind.)*

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

## Schwellen zurück an die Aufsicht

*(bisher keine)*
