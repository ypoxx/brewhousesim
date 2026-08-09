# K4 · DIE WOCHE UND DER GEGENZUG — Urteil

Blinder Kritiker der Welle 13. Gespielt am eingefrorenen Stand
`http://127.0.0.1:8933/spiel/`, Hafen lebt (`.messstand-marke` → `b098fc6`).
Gelesen wurden ausschließlich `gauntlet/MESSLATTE.md`, `spiel/LIESMICH.md`,
`gauntlet/WELLE-13-KRITIK.md` und so viel Quelltext unter `spiel/`, wie nötig war,
um Knopfnamen zu finden. `werkbank/urteile/**` außer dieser eigenen Datei,
`werkbank/schuss/spiel-w12/`, `werkbank/schuss/woche-w13/` und alle übrigen
gesperrten Pfade wurden nicht geöffnet. Fenster 1600×900, echte Mausereignisse,
`elementFromPoint`-Prüfung vor jedem Klick. Eigene Skripte liegen unter
`werkbank/schuss/kritik-w13-k4/`.

## Wie ich meine Hand gebaut habe

Kein Skript hat vorher bekannte Zugnamen bekommen. Die Hand liest bei jedem
Wochenschritt `BRAUHAUS.zuege()` neu aus und entscheidet danach. Drei feste,
im Quelltext begründete Schritte, in dieser Reihenfolge:

1. **Sud anzapfen** — `sud:zettel-anstich`, sonst `sud:zettel-hefe-fass`, wenn
   offen und ohne Preisschild. Der Quelltextkommentar nennt das selbst *„DIE
   HEFE — die Entscheidung, die JEDE Woche ansteht"* (`stuecke/sud.js:1747`).
2. **Der Gegenzug** — unter allen `gegner:*` (ohne die reinen Infoöffner
   `oeffnen`/`blatt`/`zeige`) der mit dem kleinsten „noch N Wo."-Wert, wenn
   bezahlbar. Das ist die einzige am Bildschirm erkennbare Dringlichkeit.
3. **Die Wochenkarte der FUHRE** — unter allen `fuhre:plan:*` der mit der
   CSS-Klasse `fu-rat` (die eigene Empfehlung des Spiels), sonst der erste in
   der vom Spiel gelieferten Reihenfolge (`probe, mager, umkaempft, durst,
   rechnung, nah` — laut Quelltextkommentar selbst *„die Dringenden zuerst"*,
   `stuecke/fuhre.js:1616`). Nur wenn **kein** Plan gegriffen wurde, wird
   `weiter` geklickt (Begründung s. u.).

`erbe:uebergabe:*` und `fuhre:uebergabe-auf` habe ich **nie** automatisch
geklickt — beide können die Epoche vorzeitig beenden, und das wäre eine
Entscheidung meines Skripts, keine Beobachtung des Spiels. `fuhre:sprung`
(„Weiter wie zuletzt · bis zu N Wochen") habe ich in der Hauptmessung ebenfalls
nie geklickt, damit alle Wochen einzeln zu beobachten sind (Frage 2 braucht
das). Nachgeprüft: in Epoche 1 wurde er in **83 von 100 Wochen** angeboten,
aber nie benutzt — insofern wurden **0 Wochen** über diesen Mechanismus
zusammengefasst.

**Zweite, unabhängige Variante (B)** zur Gegenprobe: identisch, nur Schritt 3
wählt **gleichverteilt zufällig** (eigene gesäte PRNG aus Epoche+Woche) unter
den angebotenen Plänen statt nach fester Priorität. Beide Varianten, alle vier
Epochen, je 100 Wochen, liegen unter `werkbank/schuss/kritik-w13-k4/lauf-e*.json`
bzw. `lauf-b-e*.json`.

### Ein Messfehler, den ich selbst gefunden und korrigiert habe

Beim ersten Durchlauf lag die Wochenzahl der Chronik weit vor meiner eigenen
Zählung (bei 50 „Wochen" meiner Schleife stand die Chronik schon bei
1353/8 statt bei 1351/20). Ursache: ein Klick auf `fuhre:plan:*` ruft am Ende
von `schicke()` **selbst** `B.uhr.naechsteWoche()` auf
(`stuecke/fuhre.js:1892`, Kommentarüberschrift *„DIE FUHRE ABSCHICKEN — und
damit die Woche schließen"*). Mein ursprüngliches Skript klickte danach
**zusätzlich** `weiter` — und schob damit bei jedem Planklick eine zweite,
unbeobachtete Woche durch, ohne Gegner-Zensus, ohne Tafel-Ablesung, ohne
eigenen Zug. Das ist genau die Art Fehler, vor der die Messlatte warnt: nicht
das Spiel gemessen, sondern das eigene Skript. Ich habe die Reihenfolge
korrigiert (Sud, dann Gegenzug, dann **entweder** ein Planklick **oder**
`weiter` — nie beides) und **alle** Messungen dieses Urteils mit der
korrigierten Fassung neu erhoben. Die alten, fehlerhaften Rohdaten liegen
nicht mehr im Bericht; wo eine Zahl unten auf einem Lauf beruht, ist es der
korrigierte.

## Was an meiner Prüfung schwach ist

Das gehört hierher, vor die Auflagen — Pflichtabschnitt.

1. **Meine drei Schritte sind eine unter mehreren möglichen Spielweisen, und
   Frage 1 reagiert empfindlich darauf.** Ich habe das selbst gesehen: unter
   fester Priorität dominiert `fuhre:plan:mager` mit 47–64 %; unter zufälliger
   Wahl sinkt das in Epoche 4 auf 21 %. Beide Zahlen sind „richtig" für ihre
   jeweilige Spielweise, aber keine von beiden ist „die" Zahl des Spiels — ich
   zeige deshalb beide, statt eine zu wählen und die andere zu verschweigen.
2. **Ich habe die Sud-Pfanne nie wirklich bedient.** `sud:zettel-anstich` ist
   ein Schnellzugriff, keine Teilnahme an Wasser/Würze/Hefe/Gärkeller. Ein
   Bildschirmtext, den ich unterwegs sah (*„Gasthof Lindenhof: 2 magere
   Jahre, seit 87 Wochen kein Fass"*), spricht dafür, dass meine
   Unter-Versorgung mit Fässern den Dauerzustand „mager" selbst erzeugt oder
   zumindest verlängert hat — und damit auch die Dominanz von
   `fuhre:plan:mager` mitgebaut hat, statt sie nur zu beobachten. Ich kann das
   nicht sauber trennen: echtes Spielverhalten oder Artefakt meiner
   unvollständigen Sud-Bedienung.
3. **Frage 2 zählt, was `BRAUHAUS.zuege()` unter `gegner:*` ausgibt — das
   kann Duplikate enthalten** (`gegner:beschwerde` und `gegner:beschwerde-bild`
   scheinen dieselbe Handlung zweimal zu verdrahten, einmal als Text, einmal
   als Bildklick). Ich habe nicht geprüft, ob `tu()` beider Knöpfe wirklich
   dasselbe tut; die Zahl könnte dadurch leicht zu hoch liegen.
4. **Frage 5 vergleiche ich gegen eine Zahl, deren Erhebungsmethode ich nicht
   kenne.** „23 von 25 Wochen mit neuem Text auf der Karte" — ich weiß nicht,
   ob damit die Kartenmarken (`stadt:marke:gegner-*`), die Chronik oder etwas
   Drittes gemeint war. Ich berichte beide Metriken, die ich messen konnte,
   und sage ausdrücklich, dass ich nicht sicher bin, dieselbe zu messen.
5. **Ausfallquote der Klicks lag bei 6–11 %** (s. u.) — überwiegend, weil ein
   Planklick das Brett sofort neu zeichnet und der nächste Zielknopf (z. B.
   ein Gegner-Zug an derselben Stelle) im selben Sekundenbruchteil verschwand,
   bevor mein Skript zugriff. Das ist meine Ausführungsgeschwindigkeit, nicht
   zwingend ein Fehler des Spiels — aber es bedeutet, dass ein Teil der
   „gewollten" Klicks meiner Strategie nie stattfand und in den Zahlen fehlt.
6. **Ich habe nur EINEN Startpunkt (Saat 1350) und EINE Fensterspanne
   (Epoche×100 Wochen) gemessen.** Andere Saaten oder ein Start mitten in der
   Partie könnten andere Anteile ergeben.
7. **Wiederholbarkeit habe ich nur für Epoche 1, Variante A, geprüft** (zwei
   Läufe, siehe unten) — nicht für die Epochen 2–4 und nicht für Variante B.
   Wo ich das schreibe, gilt es als ein Lauf, keine bestätigte Zahl.

## Frage 1 — häufigster Knopf, drei häufigste zusammen

Alle vier Epochen, je 100 einzeln gespielte Wochen, `?saat=1350&neu=1`. Kein
Sprung benutzt (0 Wochen über `fuhre:sprung` zusammengefasst, siehe oben).

**Variante A — feste Priorität (probe/mager/umkaempft/durst/rechnung/nah):**

| Epoche | Klicks (erfolgreich) | Ausfall | häufigster Knopf | Anteil | drei häufigste |
|---|---|---|---|---|---|
| 1 (1350) | 131 | 9 (6,4 %) | `fuhre:plan:mager` | **64,1 %** | **98,5 %** |
| 2 (1600) | 135 | 16 (10,6 %) | `fuhre:plan:mager` | **61,5 %** | **92,6 %** |
| 3 (1884) | 138 | 9 (6,1 %) | `fuhre:plan:mager` | **47,1 %** | **83,3 %** |
| 4 (1970) | 139 | 14 (9,2 %) | `fuhre:plan:mager` | **54,0 %** | **89,2 %** |

(Ausfall = Klicks, die am `elementFromPoint`-Test scheiterten, „nicht
gegriffen"; nicht mitgezählt.)

**Variante B — Wochenkarte gleichverteilt zufällig gewählt:**

| Epoche | häufigster Knopf | Anteil | drei häufigste |
|---|---|---|---|
| 1 (1350) | `fuhre:plan:mager` | **63,4 %** | **96,2 %** |
| 2 (1600) | `fuhre:plan:mager` | **38,0 %** | **73,7 %** |
| 3 (1884) | `fuhre:plan:mager` | **23,5 %** | **68,4 %** |
| 4 (1970) | `sud:zettel-anstich` | **21,2 %** | **59,1 %** |

Zum Vergleich der Vorzustand: 71 % / 78 % (dort dominierten laut Messlatte
zwei bzw. drei Knöpfe zusammen in dieser Höhe; die Namen kannte ich nicht und
sollte sie nicht kennen). In **beiden** meiner Varianten liegt der häufigste
Knopf in Epoche 1 über 60 % — höher, als der Vorzustand für den häufigsten
allein auswies. Das Spiel hat also nicht einfach eine flachere Verteilung,
es hat eine **andere** Engstelle: nicht mehr `weiter` (das lag unter
Variante A nur noch bei 3–14 % der Klicks, weil ein Planklick die Woche
selbst schließt), sondern der Fuhrplan `mager`, wenn immer wieder dieselbe
Adresse hungert.

`weiter`-Anteile zur Einordnung (Variante A): Epoche 1 12,2 %, Epoche 2
3,0 %, Epoche 3 13,8 %, Epoche 4 3,6 % — `weiter` ist damit **nicht** der
häufigste Knopf, sobald man die Wochenkarte tatsächlich bedient.

## Frage 2 — Wochen ohne greifbaren, bezahlbaren Gegenzug

Gezählt wurde je Woche **vor** meiner eigenen Aktion: alle `gegner:*`-Einträge
aus `BRAUHAUS.zuege()`, offen, mit `elementFromPoint`-Treffer auf eine Fläche
>0, und bezahlbar (Preisschild ≤ Kasse; Einträge ohne Preisschild zählen, weil
offen+Fläche+Treffer bereits „wirklich ausführbar" belegen).

| Epoche | Wochen ohne Gegenzug | min/Ø/max greifbare Gegenzüge je Woche |
|---|---|---|
| 1 (1350) | **0 von 100** | 1 / 7,1 / 11 |
| 2 (1600) | **0 von 100** | 1 / 8,2 / 14 |
| 3 (1884) | **1 von 100** (kumulierte Woche 91) | 0 / 8,2 / 12 |
| 4 (1970) | **0 von 100** | 1 / 10,1 / 27 |

Vorzustand: 68 von 100. Das ist der klarste Einzelbefund dieser Prüfung: fast
immer ist etwas gegen den Gegner greifbar, meist mehrere Optionen gleichzeitig
(Ø 7–10 je Woche).

## Frage 3 — Reiter *OHNE DICH GESCHEHEN*, Woche 45 gegen Woche 15

Zug `stadt:reiter:gegner-amort-gg-band`, Text an genau diesen beiden
kumulierten Wochen des Hauptlaufs (Variante A):

| Epoche | Woche 15 | Woche 45 |
|---|---|---|
| 1 | „Ohne dich geschehen · 11 Zügezugeklappt" | „Ohne dich geschehen · 34 Zügezugeklappt" |
| 2 | „Ohne dich geschehen · 10 Zügezugeklappt" | „Ohne dich geschehen · 30 Zügezugeklappt" |
| 3 | „Ohne dich geschehen · 10 Zügezugeklappt" | „Ohne dich geschehen · 23 Zügezugeklappt" |
| 4 | „Ohne dich geschehen · 18 Zügezugeklappt" | „Ohne dich geschehen · 55 Zügezugeklappt" |

**Ja, dieselbe Form** — in allen vier Epochen exakt das Muster
„Ohne dich geschehen · N Zug/Züge zugeklappt", nur die Zahl wächst. Randnotiz,
nicht Teil der Frage: zwischen „Züge" und „zugeklappt" fehlt sichtbar ein
Trenner/Leerzeichen — ein kleiner Textfehler, der die Form selbst aber nicht
berührt.

## Frage 4 — 1350 bis 1355, kein Reiter angefasst

Erster Anlauf war ein Fehlversuch, den ich hier stehen lasse, weil er lehrt:
Wenn man **nur** `weiter` klickt und sonst nichts (auch keine Fuhre, kein
Sud), endet das Haus in **1353** — *„Der Rat entzieht das Braurecht"*, weil
12 Wochen kein Fass ausgeliefert wurde. Das Übergabeangebot kam in diesem
Lauf **nie**, weil das Spiel vorher regulär verloren war (die Anfangserklärung
sagt das selbst: *„das leere Auftragsbuch"* bzw. *„eine Pfanne, die drei Jahre
kalt bleibt"* beendet das Haus). Das beantwortet Frage 4 nicht — Nicht-Spielen
ist nicht dasselbe wie Nicht-Reiter-Anfassen.

Im zweiten, richtigen Anlauf: dieselbe Strategie wie die Hauptmessung
(Sud, Gegenzug, Wochenkarte) — die berührt nie einen `stadt:reiter:*`-Knopf.
Ergebnis, als Spieler beschrieben: **Ja, es fällt auf, deutlich.** Bei
1355/2 taucht `fuhre:uebergabe-auf` nicht als stiller Reiter auf, sondern das
Spiel öffnet von selbst ein volles Detailblatt „Die Übergabe vor dem Rat ·
1355" mitten auf dem Bildschirm, mit eigenem Absatz, Namensliste der
bisherigen Führung, „Was übergeben wird" und drei klaren Knöpfen. Zusätzlich
steht auf der Wochenkarte unten ein eigens eingefärbter Chip „DIE ÜBERGABE VOR
DEM RAT · noch 3 Wochen", der bei jedem weiteren Blick mitzählt (·noch 2·,
·noch 1·) und danach wieder verschwindet, bis zum nächsten Michaeli (1356,
gleiches Muster). Screenshots:
`werkbank/schuss/kritik-w13-k4/frage4/wechsel-w157.png` (1355/2) und
`…wechsel-w188.png` (1356/2). Das ist die genaue Umkehr des Vorzustands-Befunds
(„15 von 284 Wochen da, 0-mal bemerkt") — hier ist es unübersehbar, ohne dass
ich einen einzigen Reiter berührt habe.

## Frage 5 — bleibt der Gegner ein Gegner?

Drei unabhängige Indizien, alle aus Epoche 1 (Saat 1350):

1. **Greifbare Gegenzüge je Woche** (Frage 2): Ø 7,1 in Epoche 1, nie länger
   als eine Woche am Stück ohne Angebot. Das ist ein Gegner, der ständig
   etwas anbietet, das eine Reaktion verlangt.
2. **„Ohne dich geschehen"-Zähler über 50 exakt gemessene Wochen: 34 Züge.**
   Der Vorzustand nennt 27 Züge in 50 Wochen als bestandene Latte. 34 > 27 —
   nach dieser Zahl ist der Gegner nicht leiser geworden, eher lauter.
3. **Chronik-Einträge der Art `gegner`** in denselben 50 Wochen: 12 Einträge,
   verteilt auf 10 verschiedene Wochen, mit wechselndem Wortlaut (Adressen
   wechseln die Bindung, mal Gevatterschaft, mal Konzession des Rats, mal
   Bannrecht, mit je eigenem Ablösepreis). Kartenmarken
   (`stadt:marke:gegner-*`) ändern sich in 10 von 49 Wochenübergängen. **Das
   ist deutlich seltener** als der Vorzustandswert „23 von 25" — vorausgesetzt,
   ich messe dieselbe Größe, was ich nicht sicher weiß (siehe Schwäche 4 oben).

**Mein Urteil**: kein Verlust, eher im Gegenteil bei der Handlungsdichte —
aber mit einem echten Vorbehalt bei der Text-*Neuheit* auf der Karte, wo meine
Zahl niedriger liegt als der Vorzustandswert und ich die Meßmethode des
Vorzustands nicht kenne. Ich benenne das als offene Frage, nicht als
Entwarnung.

## Was ich außerdem gemessen habe

**`BRAUHAUS.lage.length` und Seitenfehler, alle vier Epochen, beide
Varianten:** durchgehend **0 und 0** (siehe `lageMax` und `seitenfehler` in
allen `lauf-e*.json`/`lauf-b-e*.json`). Erwartung erfüllt.

**Wiederholbarkeit:** Epoche 1, Variante A, zweimal identisch gespielt
(`lauf-e1.json` und `lauf-e1-wdh.json`) — **byteweise identisch** (gleiche
MD5-Summe, gleiches Klickprotokoll, gleiche Endkasse 28 Pf, gleiches
Enddatum 1353/11). Für die Epochen 2–4 und für Variante B liegt je **ein**
Lauf vor — nicht gegengeprüft, das steht hier ausdrücklich so.

## Die Schwelle — häufigster Knopf ≤ 35 %, drei häufigste ≤ 60 %

**Die Auflage reißt.** In beiden gespielten Varianten liegt der häufigste
Knopf in drei von vier Epochen klar über 35 %, und die drei häufigsten
zusammen liegen in sieben von acht Messungen (4 Epochen × 2 Varianten) über
60 %. Einzige Ausnahme: Epoche 4, Variante B, mit 21,2 % / 59,1 % — knapp
unter beiden Grenzen, aber eben nur unter einer von zwei Spielweisen und ohne
zweiten Lauf zur Bestätigung.

Zugleich: **das ist ein anderes Ergebnis als der Vorzustand**, nicht bloß eine
mildere Fassung desselben. Vorher hieß die Antwort „`weiter`, weil fast nichts
anderes greifbar oder lohnend war" (68 von 100 Wochen ohne Gegenzug, Reiter
0-mal bemerkt). Jetzt ist fast immer etwas greifbar (Frage 2), das
Übergabeangebot ist unübersehbar (Frage 4), und die Engstelle ist inhaltlich
eine andere geworden: ein einzelner Fuhrplan-Typ, der in einer wiederkehrenden
Notlage (eine „magere" Adresse) immer wieder der naheliegendste Klick ist —
und bei dem ich selbst nicht ausschließen kann, ob meine unvollständige
Sud-Bedienung diese Notlage mit erzeugt hat (siehe Schwäche 2). Die Schwelle
ist damit nicht erreicht, aber die Art des Scheiterns ist eine andere, und das
gehört in dieselbe Zeile wie die Zahl.
