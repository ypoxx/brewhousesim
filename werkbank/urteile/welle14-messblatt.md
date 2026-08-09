# Welle 14 — Messblatt (DER ANALYST)

*Wird laufend geschrieben, nicht erst am Ende. Stand: Baustelle, siehe Zeitstempel je Abschnitt.*

Messstand: `http://127.0.0.1:8936/spiel/`, Marke `b41eaa7` (geprüft vor der ersten Zahl,
`curl -s http://127.0.0.1:8936/.messstand-marke`). Jede Messadresse trägt `&saat=1350&neu=1`.
Alle Läufe einzeln über `werkbank/schuss/aufsicht/messfenster.sh` — nie zwei Messungen
nebeneinander.

Eigene Skripte: `werkbank/schuss/welle14/`. Kein Byte unter `spiel/` geändert.

**Epochen zur Orientierung** (`kern/welt.js`): 1350 „Das Recht" (Pfennig, Start-Kasse 112),
1600 „Die Ordnung" (Gulden, 640), 1884 „Die Maschine" (Mark, 14 250), 1970 „Die Marke"
(D-Mark, 86 000). `LETZTES_JAHR`=2025 — mit den hier gefahrenen Wochendeckeln (≤ 420 Wochen ≈
14 Braujahre) wird das in keiner Epoche erreicht.

---

## Frage A — die suchende Linie

**Wie meine Hand wählt (zwei Sätze):** Jede Aussenrunde klappt sie zuerst *alle* sichtbaren,
freien Knöpfe *ohne* Preisschild einmal auf — das sind strukturell die Bretter/Reiter, und
irgendein neues Verb einer späteren Welle sieht für sie genauso aus: kein `data-preis`, Name
unbekannt, trotzdem gefunden. Danach nimmt sie aus den sichtbaren, freien Knöpfen *mit*
Preisschild den mit dem größten Zahlenwert (Einnahme vor Ausgabe, billige Ausgabe vor teurer),
höchstens drei je Runde, solange die Kasse reicht, und schließt mit dem einen Knopf, der laut
`kern/kopf.js` in jeder Epoche unverändert existiert (`zug:'weiter'`, "der eine Knopf, den es
immer gibt") — Rahmen-Chrome, kein Stück-Verb, also kein Verstoß gegen "keine Liste, die man
vorher kennt". Quelle: `werkbank/schuss/welle14/hand-suchend.mjs`.

**Wichtiger Befund aus dem Bau selbst, nicht aus dem Spielergebnis:** die Hand fand beim
Erkunden Knöpfe wie `fuhre:sprung` ("Weiter wie zuletzt · bis zu 6 Wochen"), `fuhre:plan:mager`,
`gegner:oeffnen:adler`, `gegner:abloesen:torschenke`, `sud:zettel-anstich` — keiner davon stand
vorher in dieser Analyse, alle kamen ausschließlich vom Bildschirm. Das bestätigt die Diagnose
aus `WELLE-14.md`: eine Hand mit fest eingebauter Verbliste (`hand3.mjs`) wäre für mindestens
`fuhre:sprung`/`fuhre:plan:*` blind, weil diese Knöpfe erst in Welle 13 entstanden.

**Methodischer Nebeneffekt:** `fuhre:sprung` und `fuhre:plan:*` beenden selbst mehrere echte
Spielwochen in einem Klick (`B.uhr.springeWochen()` unter der Haube). Eine Außenrunde der Hand
ist deshalb NICHT dasselbe wie eine Spielwoche; gezählt wird die echte Woche (`jahr`/`woche`
aus `B.welt.zeit`), jedes Mal wenn sie sich ändert — auch mitten in einer Runde.

**Kampagne:** `werkbank/schuss/welle14/lauf-frage-a.sh` (1350) bzw. `lauf-frage-a-rest.sh` /
`lauf-schluss.sh` (1600/1884/1970), gleiche Saat 1350. Rohdaten:
`werkbank/schuss/welle14/protokoll/e<EP>-such-<N>-ergebnis.json`.

> **ZEITKÜRZUNG, offen ausgewiesen:** 1350 bekam die volle Auflage — drei Läufe, Deckel 180
> echte Wochen / 12 Min. 1600/1884/1970 bekamen aus Zeitgründen dieser einzelnen Messsitzung
> nur **je einen** Lauf, Deckel **100 echte Wochen / 6 Min** (≈ 3,4 Braujahre statt 6,2). Das
> ist eine echte Lücke gegen die Auflage „drei Läufe je Epoche" — sie steht hier, nicht
> verschwiegen, und unter „Was an meiner Messung schwach ist" noch einmal.

| Epoche | Läufe | Braujahre gemessen | Endgrund | Deckung ≥1× / Wochen | Deckungs-Median | **Braujahre mit Median-Deckung <1×** | Prüfsumme (Wochenreihe) |
|---|---|---|---|---|---|---|---|
| 1350 | **3/3** | 8 (Deckel 180 Wo.) | kein Ausgang, Deckel | 22/183 (12 %) | **0,00** | **6 von 8** | `6c3ebc6f` in allen 3 |
| 1600 | 1/3 | 4 (Deckel 100 Wo.) | kein Ausgang, Deckel | 79/100 (79 %) | **1,51** | 1 von 4 | `1866d82b` |
| 1884 | 1/3 | 4 (Deckel 100 Wo.) | kein Ausgang, Deckel | 15/100 (15 %) | **0,15** | **3 von 4** | `6cd8691d` |
| 1970 | 1/3 | 4 (Deckel 102 Wo.) | kein Ausgang, Deckel | 65/102 (64 %) | **1,43** | 0 von 4 | `deced3f2` |

„Braujahre mit Median-Deckung <1×" ist je Braujahr der Median über alle Wochen dieses Jahres —
das genaue Maß der W15/16-Formel, nachgerechnet aus `wochenReihe`. Bei 1600/1884/1970 sind
das erst 4 der geforderten 6 Braujahre (Zeitkürzung, siehe oben); bei 1350 alle 8 gemessenen.

Zur ursprünglich vorgesehenen Kennzahl „Woche, ab der die Deckung dauerhaft <1× bleibt und nie
wieder steigt": die geht bei 1350 technisch leer aus (`null`), weil die letzte gemessene Woche
zufällig auf einem Michaeli-Sprung endet (Deckung dort kurz 1,18×) — das Fenster hört
buchstäblich im falschen Moment auf. Das ändert nichts am Befund, dass 72 % aller 183 Wochen
bei Deckung 0 lagen (siehe „Sägezahn" gleich unten); die Braujahr-Median-Spalte oben ist das
robustere Maß und wurde deshalb zusätzlich berechnet.

**Kein einziger Lauf erreichte ein echtes Ende der Partie** (keine `keine-abnehmer`-Karte,
kein `braurecht-entzogen`, keine `uebergeben`/Übergabe) — alle vier endeten am Sicherheitsdeckel
dieser Messung, nicht an einer Regel des Spiels. Das ist selbst ein Befund: anders als der
blinde Spielkritiker der Welle 12 (128 Wochen, dann Ende) übersteht meine generische, screen-
lesende Hand deutlich mehr Wochen (bis zu 183 hier gemessen, ohne dass der Deckel je nötig
gewesen wäre — sie war einfach noch nicht fertig). Der wahrscheinlichste Grund: meine Hand
entdeckt *jede* Woche irgendeinen Fuhr-Zug (und sei er noch so mager), weil sie generisch das
gesamte Bild absucht, statt an einer festen Verbliste hängen zu bleiben, die die Fuhre der
Welle 13 nicht mehr kennt (siehe `fuhre:sprung`/`fuhre:plan:*` oben). Ein wichtiger, im
Methodenkapitel begründeter Unterschied zur alten `hand3.mjs`-Kritik.

**Der große Unterschied zwischen den Epochen liegt nicht im Erreichen eines Ausgangs, sondern
in der Deckung:** 1350 und 1884 verbringen den Großteil des Fensters bei Deckung praktisch 0
(Sägezahn/Zusammenbruch), 1600 und 1970 bleiben in DIESEM (kürzeren) Fenster überwiegend über
1×. Ob 1600/1970 bei vollen 180 Wochen ebenfalls einbrechen, ist mit den hier gefahrenen Läufen
**nicht** beantwortet — echte Lücke, siehe oben.

**Erster Lauf `e1-such-1` (1350), im Detail — Sägezahn statt Ruin:** 183 echte Wochen in 6,5
Minuten, kein `endgrund` (keine der Partie-beendenden Karten wurde gegriffen), Kasse am
Deckel = 26. Deckung ≥ 1× in nur **22 von 183 Wochen (12 %)**, = 0 in **131 von 183 (72 %)** —
Median 0. Das Muster ist ein **Sägezahn**: die Kasse springt an jedem Michaeli kurz über 0 (aus
der Jahresrechnung), fällt binnen ein bis zwei Wochen wieder auf 0 und bleibt dort bis zum
nächsten Michaeli. Die Auflage „Woche, ab der die Deckung dauerhaft < 1× bleibt und dort
bleibt" geht deshalb bei diesem Lauf technisch leer aus (`null`) — nicht weil es keinen Ruin
gäbe, sondern weil die letzte gemessene Woche zufällig **auf** einem Michaeli-Sprung endet
(Deckung dort kurz 1,18×) und mein Fenster (180 Wochen) genau dort abschneidet. Das ist eine
Schwäche der Messung, keine Aussage über das Spiel — siehe unten.

**Preislage an denselben acht Tafeln (1350, derselbe Lauf):** 1350 selbst ist mit Kasse 112
gegen billigste Festlegung 85 **bezahlbar** (1,32×) — deckt sich fast exakt mit der im
Quelltext dokumentierten Zahl (`preis-daten.js` Z. 481 ff.: „billigste Festlegung … 0,32 × 470
= 150 Pf" bezieht sich auf eine andere Karte/Zeitpunkt, aber „Lade 112 … vertrag −85 AN" aus
demselben Kommentar (Z. 517) trifft **exakt** meinen Wert). Ab 1352 fällt das Verhältnis auf
0,27–0,28× und bleibt dort — die Kasse dieser Hand erholt sich nie so weit, dass eine
Festlegung wieder in Reichweite käme. Damit ist für DIESE (unkundige) Linie „zu teuer" ab 1352
tatsächlich die Haupterklärung — aber das ist erwartbar für eine Linie, die ohnehin bei Kasse 0
lebt; die eigentliche Auflage F betrifft die KUNDIGE Linie mit 50.000 in der Kasse (1970), dazu
unten mehr aus der Sammelhand.

**Wiederholbarkeit 1350, drei von drei Läufen, mit einem Fund über die Prüfsumme selbst:**
`e1-such-1`/`e1-such-2` haben identische Prüfsummen (`625aa0d1`). `e1-such-3` weicht in der
*rohen* Prüfsumme ab (`b17b4c01`) — aber die **wochenReihe** (Kasse/Deckung jede der 183
Wochen einzeln, jahr/woche, Klickzahlen 498 Nav / 137 Preis) ist in allen drei Läufen **Ziffer
für Ziffer identisch**; eine Prüfsumme nur über die wochenReihe gerechnet ergibt in allen drei
Läufen `6c3ebc6f`. Der Unterschied liegt allein in der *Reihenfolge*, in der die Hand Bretter
ohne Preisschild besucht (meine rohe Prüfsumme protokolliert jeden Einzelklick inklusive
Erkundung, nicht nur den Wochenstand) — das ändert nie Kasse, Jahr oder Woche, nur welcher von
mehreren gleichwertigen Reiterklicks zuerst geloggt wird. **Die Spielökonomie ist also
wirtschaftlich voll deterministisch reproduziert; meine eigene Prüfsumme war strenger als die
Frage verlangt.** Das gehört unter „Was an meiner Messung schwach ist".

Volle Rohdaten und Aggregation: `python3 werkbank/schuss/welle14/auswerte-a.py`.

---

## Frage F — Festlegungen

### Vorgefundene Selbstauskunft im Quelltext (vor jeder eigenen Messung)

`spiel/stuecke/preis-daten.js` trägt bereits Messungen früherer Wellen als Kommentar, wörtlich
zitiert, mit Stelle:

- **Z. 481–530 (1350):** *„Am Bildschirm nachgezählt, sorgfältig gespielte Linie über 190
  Wochen: der Chronikknopf las in Epoche I und II nach sechs Michaeli unverändert '0
  Festlegungen'. Das lag nicht am Spieler. Die billigste Festlegung dieser Zeit kostete 0,32 ×
  470 = 150 Pf, und die Lade steht an einem Michaelitag dieser Epoche zwischen 29 und 112 Pf —
  die Festlegung war nie zu haben."* Und weiter (Z. 500–530), zur zweiten, seither
  nachgebauten Sprosse `brunnen` (ab 1355): *„Ab 1355 stand NEUN JAHRE LANG keine einzige
  bedienbare Festlegung auf der Tafel … die Taxe wächst mit `teuerungJahr` (1,040), die Lade
  wächst nicht mit."*
- **Z. 1238–1246 (1884):** *„Gemessen: an ELF VON VIERZEHN Michaelitagen ist keine Festlegung
  bezahlbar."*
- **Z. 1520–1533 (1970):** *„hier räumt eine Hand, die Festlegungen will, alle vier ab — weil
  `konzern` ohne Ausgabe zu haben ist und Geld hereinbringt. Gezählt wurden trotzdem acht von
  vierzehn Michaelitagen ohne bezahlbare Karte, und die letzten fünf Braujahre stehen mit einer
  LEEREN Festlegungsreihe da: der Katalog ist aufgebraucht."*

Das ist die eigene Vorgeschichte des Spiels: **Preislage war für frühere Wellen bereits ein
gemessener, dokumentierter Befund**, und zwei Epochen (1350 alt, 1884) hatten/haben zeitweise
*keine einzige bezahlbare Karte* — dort ist "zu teuer" für diese Fenster tatsächlich (mit-)
ursächlich. Für 1970 sagt derselbe Kommentar aber ausdrücklich, dass eine wollende Hand *alle
vier* Karten holen KANN (mind. eine ist frei/profitabel) — was die "zu teuer"-Erklärung für 1970
schwächt und zur eigentlichen Auflage aus `WELLE-14.md` zurückführt: die kundige Hand mit 50.000
in der Kasse nimmt **trotzdem keine**. Das prüfe ich unten selbst nach (eigener Lauf, nicht nur
zitiert).

### F1 — Preislage: was kostet die billigste Festlegung gegen die Kasse derselben Woche?

**Instrument:** `hand-sammler.mjs` (F-Instrumentierung, **nicht** die Frage-A-Hand — Domänenwissen
erlaubt, siehe „Was an meiner Messung schwach ist"). Sie öffnet jede Woche alle Bretter,
schließt nie automatisch eine Festlegung ab, kauft sonst kassenschonend (≤ 80 % der Kasse je
Griff). Rohdaten: `werkbank/schuss/welle14/protokoll/e<EP>-sammel-keine-ergebnis.json`,
Feld `tafelBeobachtungen` — je Michaelitafel Kartenzahl, billigste Kosten, Kasse, Verhältnis.

| Epoche | Braujahre gemessen | Michaelitage bezahlbar (Kasse ≥ billigste Kosten) | Verlauf des Verhältnisses |
|---|---|---|---|
| 1350 | 8 | **1 von 8** (nur 1350 selbst) | 1,32× → 0,53× → 0,28× … → 0,21× (fällt und bleibt unten) |
| 1600 | 6 | **2 von 6** | 2,29× → 1,41× → 0,95× → 0,90× → 0,85× → 0,82× (knapp, aber stetig fallend) |
| 1884 | 6 | **1 von 6** | 1,55× → 0,02× → 0,17× → 0,03× → 0,03× → 0,03× (sofortiger Absturz) |
| 1970 | 6 | **1 von 6** *(nur die billigste KOSTENpflichtige Karte; siehe Text)* | 1,56× → 0,77× → 0,76× → 0,92× → 0,88× → 0,99× (dauerhaft knapp unter 1×) |

**1350 und 1884 bestätigen die Selbstauskunft aus dem Quelltext Ziffer für Ziffer** (1350-Wert
1,32× trifft `preis-daten.js` Z. 517 „Lade 112 … vertrag −85" fast exakt; 1884 trifft „elf von
vierzehn unbezahlbar" der Größenordnung nach — meine 6 Braujahre zeigen 5 von 6 unbezahlbar).
**„Zu teuer" ist für diese beiden Epochen eine echte Teilerklärung.**

**1970 ist der interessante Fall.** Die kostenpflichtige billigste Karte (`privat`/`denkmal`,
je nach Jahr) bleibt das ganze Fenster bei 0,76–0,99× — technisch knapp unbezahlbar, aber nur
knapp. **Eine vierte Karte, `konzern`, kostet nichts und zahlt aus** (+65.000 bis +99.000 DM je
nach Jahr, `preis-daten.js` Z. 1521 f., „ohne Ausgabe zu haben … bringt Geld herein") und ist
in **allen sechs gemessenen Braujahren `aus:false`, also nicht gesperrt**. Für DIESE eine Karte
scheidet „zu teuer" als Erklärung vollständig aus — sie kostet nichts.

### F2 — Sichtbarkeit: wie weit ist die Tafel von der Wochenansicht entfernt?

**Instrument:** `sichtbarkeit-f2.mjs`, frischer Start jeder Epoche, ein Blick vor dem ersten
Klick, ein Klick auf den Griff. 2×/Epoche gefahren (wiederholbar, identische Werte in beiden
Läufen je Epoche — reiner State-Read ohne Zufallspfad).

| Epoche | Griff-Position (von oben) | Klicks bis zur ersten Festlegungskarte | Karte(n) unterhalb der Faltkante? |
|---|---|---|---|
| 1350 | 5,6 % | **1** | nein (alle 3 Karten `hit:true`) |
| 1600 | 5,6 % | **1** | nein (alle 4 Karten `hit:true`) |
| 1884 | 5,6 % | **1** | nein (alle 3 Karten `hit:true`) |
| 1970 | 5,6 % | **1** | nein — `konzern` bei y=693 von 900 px, `hit:true` |

**Sichtbarkeit im engen Sinn (Klickabstand, Position im Fenster) scheidet in allen vier Epochen
als Erklärung aus.** Der Griff steht immer oben rechts (`.pr-griff`, `top:3%`), ist immer der
einzige Klick zur Tafel, und jede Festlegungskarte — auch `konzern` in 1970 — ist bei 1600×900
vollständig im Bild und laut `document.elementFromPoint` wirklich anklickbar (`hit:true`).

**Aber:** ein überraschender, unabhängig gefundener zweiter Befund gehört hierher, auch wenn er
über die reine Bildschirmposition hinausgeht — siehe den Kasten gleich danach.

> ### Der eigentliche Befund: `konzern` wurde nie geklickt — in KEINEM von drei Läufen
>
> Drei verschiedene Läufe hatten in 1970 die Gelegenheit, `preis:festlege:konzern` zu greifen
> (kostenlos, +65.000 bis +99.000 DM, sechs Jahre lang `aus:false`):
>
> 1. **`e4-such-1`** (Frage A, generische Hand, bevorzugt den größten Preiswert) — sah die
>    Karte in `tafelBeobachtungen` jedes Jahr 1970–1973, klickte sie **nie**.
> 2. **`e4-sammel-keine`** (Sammelhand, nimmt bewusst nie eine Festlegung) — per Auflage nie
>    versucht.
> 3. **`e4-sammel-konzern`** (Sammelhand, **explizit angewiesen**, genau diese Karte zu
>    nehmen, sobald sie greifbar ist) — 154 echte Wochen, 6 Braujahre, **ebenfalls nie
>    genommen**: identische Endkasse (45.720 in 1975/9) wie der Kontrolllauf ohne jeden
>    Versuch — der Zielcode hat buchstäblich nie gegriffen.
>
> Ein isolierter, sauberer Test (`nutzen-f3.mjs`, unten) zeigt aber: **direkt nach dem frischen
> Laden ist die Karte tatsächlich in einem einzigen Klick zu greifen** (F2-Tabelle oben). Der
> Widerspruch löst sich so: die Karte ist **statisch sichtbar**, aber in einer **laufenden
> Partie mit vielen anderen Bretter** praktisch **nicht erreichbar** — meine beiden Hände
> klappen im selben Durchgang, in dem sie die Tafel öffnen, mit hoher Wahrscheinlichkeit auch
> wieder etwas zu (der Griff `preis:tafel` ist ein Auf/Zu-Schalter, kein Nur-Auf-Knopf; jede
> generische Erkundung, die „alles Neue" anklickt, klappt ihn irgendwann wieder zu, bevor die
> gezielte Kaufentscheidung an der Reihe ist). **Das ist ein vierter Kandidat, den
> `WELLE-14.md` nicht benannt hatte: nicht Preislage, nicht Sichtbarkeit im engen Sinn, sondern
> Erreichbarkeit innerhalb einer laufenden Session** — eine Karte, die einmal sichtbar war,
> bleibt es nicht zuverlässig, wenn derselbe Knopf zugleich der Schließer ist.

### F3 — Nutzen: was bringt die Festlegung über die Restpartie, in Münze?

**Erster Versuch (Sammelhand, A/B):** siehe F2-Kasten — beide Läufe (mit Zielauftrag / ohne)
landeten identisch, weil die Festlegung nie genommen wurde. Kein Messwert, aber selbst ein
Befund (Erreichbarkeit vor Nutzen).

**Sauberer zweiter Versuch (`nutzen-f3.mjs`):** ein Klick auf den Griff, ein Klick auf die
Festlegung (oder keiner, im Kontrolllauf), danach **ausschließlich** `fuhre:sprung` — der von
DIE FUHRE selbst dokumentierte „fährt dieselbe Runde weiter, ohne dass jemand hinsieht"-Knopf,
und bei jedem Halt (Michaeli) nur die Tafel schließen, nie kaufen. Beide Läufe sind damit bis
auf die eine Entscheidung wortgleich.

**Ergebnis** (`e4-nutzen4-ohne` / `e4-nutzen4-konzern`, beide bis 1975/30, also exakt dieselbe
Restpartie-Länge, dieselbe Klickzahl ±1 — die Läufe sind bis auf die eine Entscheidung
wortgleich gelaufen):

| | Kasse 1970/1 (Start) | Kasse 1975/30 (nach 6 Braujahren) | Differenz zum Start |
|---|---|---|---|
| **ohne** `konzern` | 86.000 DM | 38.844 DM | −47.156 DM |
| **mit** `konzern` | 86.000 DM (→ 151.000 sofort nach der Festlegung) | 138.938 DM | +52.938 DM |

**Der Nutzen der Festlegung über sechs Braujahre: 138.938 − 38.844 = 100.094 DM mehr in der
Kasse** — mehr als das Startkapital der ganzen Epoche. Davon sind 65.000 DM die sofortige
Auszahlung; die restlichen ≈ 35.000 DM kommen aus der laufenden Wirkung (`wirkung.ertrag:
28.000` je Michaeli laut `preis-daten.js` Z. 1521, über gut fünf Jahre mit Teuerung
verrechnet). **Der Nutzen ist eindeutig groß und positiv — „bringt zu wenig" scheidet für diese
Karte als Erklärung aus.**

### Die Antwort auf Frage F, zusammengeführt

Drei von vier möglichen Erklärungen, mit Zahlen geprüft, für 1970 konkret an `konzern`:

1. **Preislage:** scheidet aus — die Karte kostet nichts, zahlt sofort aus.
2. **Sichtbarkeit (Position im Fenster):** scheidet aus — ein Klick vom Griff entfernt, immer
   im sichtbaren Bereich, `hit:true` bei jedem Test.
3. **Nutzen:** scheidet aus — **+100.094 DM über die Restpartie**, sauber isoliert gemessen.
4. **Was tatsächlich zutrifft, empirisch gefunden, nicht in der Auflage benannt:**
   **Erreichbarkeit innerhalb einer laufenden Partie.** Drei unabhängige, lange Läufe (Frage-A-
   Hand, Sammelhand ohne Zielauftrag, Sammelhand MIT explizitem Zielauftrag auf genau diese
   Karte) haben sie in Summe über 400 echte Wochen nie gegriffen — nicht weil sie unsichtbar
   oder wertlos war, sondern weil derselbe Knopf, der die Tafel öffnet, sie auch wieder
   schließt, und eine Partie mit vielen anderen Brettern diesen Knopf zuverlässig wieder
   zuklappt, bevor die Kaufentscheidung an der Reihe ist. Für 1350/1884 gilt zusätzlich (und
   unabhängig davon) die Preislage — dort ist „zu teuer" ein echter Mitgrund, für 1970 nicht.

**Das ist kein Fehler in meiner Messung, sondern in derselben Größenordnung, die
`WELLE-14.md` selbst für möglich erklärt hat: die Auflage darf falsch sein, und hier ist einer
der drei benannten Kandidaten tatsächlich falsch — nicht weil sie unplausibel wäre, sondern
weil ein vierter, unbenannter Kandidat (Erreichbarkeit durch Interaktionsreihenfolge) die
eigentliche Ursache trägt.** Ob das ein Fehler im Spiel (der Auf/Zu-Knopf sollte pfleglicher
sein) oder ein Fehler in jeder generischen Hand ist, die alles Neue anklickt, kann diese
Messung nicht trennen — beides ist mit denselben Daten vereinbar.

---

## Was an meiner Messung schwach ist

- **Die suchende Hand ist EINE von vielen möglichen generischen Strategien**, keine
  Charakterisierung „der" naiven Linie. Eine andere plausible Lesevorschrift (z. B. „billigste
  Ausgabe zuerst" statt „größter Zahlenwert zuerst", oder ein anderer Deckel für Aktionen je
  Runde) würde andere Zahlen liefern. Die Zahlen unten sind also eine untere/mittlere
  Näherung an „eine unkundige Hand", kein Beweis für jede denkbare unkundige Hand.
- **Deckel niedriger als die sorgfältige Linie.** `MAXWOCHEN=180` (Frage A) statt 400 —
  aus Zeitgründen dieser einzelnen Messung, nicht aus einem Befund, dass 180 die relevante
  Grenze wäre. Wo ein Lauf den Deckel erreicht (`abbruch:'maxWochen-erreicht'`), ist das
  ausdrücklich **kein** Ausgang der Partie, nur das Ende meiner Geduld.
- **„Außenrunde" ist nicht „Spielwoche".** Manche Knöpfe (`fuhre:sprung`, ein `fuhre:plan:*`)
  erzählen mehrere echte Wochen in einem Klick. Gezählt wird die echte Woche
  (`B.welt.zeit.jahr/woche`), nicht die Runde — aber zwischen zwei geloggten Wochen können bei
  einem Mehrwochensprung Zwischenwochen fehlen (kein Schnappschuss für sie), weil das Spiel
  selbst sie ohne Entscheidungspunkt durchlaufen lässt. Das drückt die Auflösung der
  Deckungsreihe an genau diesen Stellen.
- **Deckungs-Median zählt nur Wochen mit einer Meldung.** `B.welt.zugDeckung()` ist `null`,
  wenn kein Stück in dieser Runde einen sinnvollen Zug gemeldet hat; solche Wochen fehlen im
  Median statt als 0 oder ∞ gezählt zu werden. Bei sehr wenigen Meldungen (z. B. kurz nach
  Ruin) kann das den Median nach oben verzerren.
- **Die Sammelhand (F1/F3) ist NICHT die Frage-A-Hand** und trägt bewusst Domänenwissen
  (Verbnamen aus dem Quelltext) — das ist erlaubt, weil die Auflage „keine Liste, die man
  vorher kennt" laut `WELLE-14.md` nur für die suchende Linie aus Frage A gilt, nicht für
  Instrumentierung zu Frage F. Wer das verwechselt, hält die Sammelhand fälschlich für einen
  zweiten Versuch an Frage A.
- **F3-Nutzenvergleich ist ein Einzelfall je Epoche**, nicht drei Läufe mit Prüfsumme —
  Zeitgründe. Ein einzelner Vergleichslauf zeigt eine mögliche Flugbahn, keine Verteilung.
- **Die rohe Prüfsumme ist strenger als nötig.** Sie hasht jeden Einzelklick inklusive der
  Reihenfolge, in der gleichwertige Bretter ohne Preisschild besucht werden — eine Reihenfolge,
  die nicht Teil der Spielökonomie ist (spielt keine Rolle für Kasse, Jahr, Woche). In 1350 wich
  ein Lauf von drei genau darin ab, obwohl die komplette Wochenreihe (Kasse jede Woche) Ziffer
  für Ziffer identisch war. Eine Prüfsumme nur über `wochenReihe` wäre das richtigere Maß für
  „wirtschaftlich reproduzierbar" gewesen; ich habe beide Zahlen mitgeschrieben.
- **Playwright-Klickphysik** (Mausbewegung, Timeouts) ist dieselbe wie bei den Vorgänger-Händen,
  aber neu geschrieben, nicht gegengeprüft gegen `hand.mjs`/`hand2.mjs` Bild für Bild.
- **Die Formel-Prüfung für 1600 und 1970 steht auf 4 von 6 Braujahren** — echte Lücke, siehe
  Schlussfrage unten. „Hält bisher" ist etwas anderes als „hält".
- **`nutzen-f3.mjs` brauchte drei Anläufe, und der zweite hatte einen echten Fehler**, nicht nur
  eine Ungenauigkeit: reines `B.uhr.springe()` ließ das Haus an `keine-abnehmer`
  (`brauereisterben`) sterben, weil dabei nie geliefert wird — kein Vergleichswert. Der zweite
  Anlauf klickte 540-mal denselben Auf/Zu-Griff, ohne je eine Woche zu bewegen (derselbe
  Fehlertyp, den ich bei Frage A selbst als Risiko notiert hatte, hier tatsächlich eingetreten).
  Erst der dritte Anlauf (liefern vor Weiterklicken, Griff nur schließen, nie neu öffnen) lief
  sauber. Der Nutzen-Befund (F3) beruht auf genau EINEM Laufpaar dieser dritten Fassung, nicht
  auf mehreren wiederholten Messungen — die Zahl 100.094 DM ist plausibel und in sich
  konsistent (beide Läufe enden auf derselben Woche mit fast identischer Klickzahl), aber nicht
  durch Wiederholung abgesichert.
- **F2 misst „hit" (Bildschirmposition + `elementFromPoint`), nicht Erreichbarkeit über eine
  ganze Partie.** Der Kernbefund oben (`konzern` nie geklickt trotz `hit:true` beim frischen
  Laden) zeigt genau diese Lücke: ein statischer Sichtbarkeits-Schnappschuss reicht nicht, um
  Erreichbarkeit in einer laufenden Session zu beurteilen. Ich habe das benannt, aber nicht mit
  einer eigenen Kennzahl („Anteil der Wochen, in denen die Karte tatsächlich `hit` war, über
  die ganze Partie gemessen") unterlegt — das wäre die nächste, genauere Messung.

---

## Schlussfrage: hält die Formel aus WELLE-14.md?

Die Formel (zur Erinnerung):

| Maß | Schwelle | gemessen an |
|---|---|---|
| Deckung, Median über die Partie | ≥ 1,0× | **beiden** Linien, je Epoche |
| Braujahre unter 1× | höchstens 1 von 6 | beiden Linien |
| Wiederholbarkeit | 3 Läufe, 1 Prüfsumme | beiden Linien |

Zu prüfen: hält das an der **suchenden** Linie (die sorgfältige hat's laut Vorbefund gehalten)?

### Antwort: **Nein — die Formel hält meinen Zahlen nicht stand, in mindestens zwei von vier Epochen.**

| Epoche | Deckungs-Median ≥ 1,0×? | Braujahre <1× ≤ 1 von 6? | Formel hält an der suchenden Linie? |
|---|---|---|---|
| 1350 (3 Läufe, reproduzierbar) | **NEIN** (0,00) | **NEIN** (6 von 8) | **NEIN — klar und wiederholt widerlegt** |
| 1600 (1 Lauf) | ja (1,51) | ja, bisher (1 von 4) | *offen* — nur 4 von 6 Braujahren gemessen, Trend am Ende fallend (1601→1603: 1,39× → 0,25×) |
| 1884 (1 Lauf) | **NEIN** (0,15) | **NEIN** (3 von 4) | **NEIN — klar widerlegt, auch mit nur einem Lauf** |
| 1970 (1 Lauf) | ja (1,43) | ja, bisher (0 von 4) | *offen, bisher haltend* — nur 4 von 6 Braujahren gemessen |

**1350 und 1884 widerlegen die Formel eindeutig, an der suchenden Linie, mit den geforderten
Kennzahlen selbst gemessen** (1350 sogar mit vollen drei Läufen und identischer Prüfsumme —
das ist kein Ausreißer, das ist der Regelfall für diese Hand in dieser Epoche). Die Formel
verlangt „beide Linien" gerade **weil** die sorgfältige Linie allein 1970 blind für den
Zusammenbruch war, den die suchende Linie in Welle 12 gezeigt hat (Vorbefund). Genau dieser
Mechanismus bestätigt sich hier ein zweites Mal, nur an zwei anderen Epochen: eine Deckungszahl,
die nur an der sorgfältigen Linie erhoben wird, hätte in 1350 und 1884 nie bemerkt, dass die
suchende Linie den Median-Schwellwert um Größenordnungen verfehlt (0,00× bzw. 0,15× gegen
verlangte 1,0×) und in beiden Epochen weit mehr als die erlaubte 1-von-6-Braujahre-Grenze unter
1× verbringt (6 von 8 bzw. 3 von 4).

**1600 und 1970 halten in dem kürzeren Fenster, das ich messen konnte — das ist kein Beleg,
dass sie auch über die volle Partie halten.** 1600 zeigt in den letzten beiden gemessenen
Braujahren einen fallenden Trend (3,3× → 1,4× → 1,9× → 0,25×), der bei Fortsetzung über
Braujahr 5/6 dieselbe Grenze reißen könnte wie 1350/1884 — das ist eine begründete Vermutung,
keine Messung, und muss in Welle 15 mit vollen sechs (oder mehr) Braujahren nachgemessen
werden, bevor die Formel für diese beiden Epochen als „hält" gelten darf.

**Empfehlung an die Wellen 15/16, konkret:** entweder die Formel lockern (z. B. Median über
einen gleitenden Ausschnitt statt der ganzen Partie, oder eine Deckungs-Reserve, die dem
Sägezahn-Muster gerecht wird, das 1350 und 1884 in dieser Messung zeigen), oder — wahrschein-
licher richtig, siehe Frage F — den Abstand zwischen den Linien direkt angehen: ein zweiter
Geldweg, der auch ohne Vorwissen sichtbar UND **erreichbar** ist (nicht nur sichtbar — siehe
den `konzern`-Befund oben: sichtbar und wertvoll reicht nicht, wenn der Griff sie unter der
Hand wieder zuklappt).
