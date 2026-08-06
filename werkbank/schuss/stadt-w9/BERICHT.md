# Welle 9 · DIE STADT — Bericht des Builders

*Alles unten ist gemessen. Wo eine Zahl fehlt, steht, dass sie fehlt.*

**Gemessen wurde nie im Arbeitsbaum.** `messstand.sh` friert einen *Commit*
ein, und ein Builder darf in diesem Lauf nicht committen — deshalb steht
daneben `stadt-w9/eigenstand.sh`: es kopiert den Arbeitsbaum, bildet eine
Marke aus der Prüfsumme aller ausgelieferten Dateien unter `spiel/` und lässt
sich vom Server die Marke zurückgeben, bevor gemessen wird. Vorzustand:
Hafen **8912** (`welle8-trennprobe/aufsetzen.sh`, Marke
`ohneStadt:8b81250-mit-b6b06bb`) und Hafen **8921** (`messstand.sh HEAD`,
Marke `ab6067b`). Jeder Browser einzeln durch `aufsicht/messfenster.sh`.

---

## 1 · Die Rückverschlechterung von 1350 — Ursache gefunden und behoben

**Es ist ein einziger Klick, und er fällt aus, weil die BAUHOF-Lade darauf
liegt.**

Sechzehn Wochen 1350, gleiche Saat, gleiche Hand (`linie.mjs`, `LAUT=1`),
Vorzustand :8912 gegen Welle-8-Stand :8921 — der Unterschied im
Klickprotokoll ist eine einzige Zeile:

```
4d3
<    klick fuhre:ziel:bar
```

| 1350, erste 16 Wochen | Vorzustand :8912 | Welle 8 :8921 |
|---|---|---|
| Kasse | **80 – 238** | 58 – 112 |
| `Ziel` gesetzt | **1×** | **0×** |
| Seitenfehler | 0 | 0 |

Alles Weitere folgt daraus: sieben ausgefallene `fuhre:tafel-ab:grut`, ein
ausgefallener Rohstoffkauf, und ab Woche 2 die Kasse 62 statt 80.

**Der Deckel hat einen Namen.** `stadt-w9/zielknopf.mjs` fragt den Knopf an
derselben Stelle, an der `linie.mjs:klick()` ihn fragt, bei **1920×1000** —
der Fenstergröße der messenden Hand:

```
:8912 (Vorzustand)  fuhre:ziel:bar  x39..183 y324..348
                    ZUGEDECKT von DIV.        in #buehne         0,0,1920,1000
:8921 (Welle 8)     fuhre:ziel:bar  x39..183 y324..348
                    ZUGEDECKT von DIV.nutzen  in #fach-blatt-stadt 31,334,316,349
```

Im Vorzustand liegt dort nur die Bühne; die Hand räumt so einen Deckel mit
einem Reiterklick weg. Im Welle-8-Stand liegt dort die **aufgeklappte
BAUHOF-Lade**, und die klappt nie zu — die Hand kann sie nicht wegräumen.

**Der Ausschluss „nicht verdeckte Knöpfe" im Auftrag ist richtig gemessen
und trotzdem nicht die ganze Geschichte.** Am Ladepunkt ist `fuhre:ziel:bar`
in *beiden* Ständen verdeckt; unterschiedlich ist nur, ob die Hand den Deckel
wegbekommt. Der Zähler, der das gezeigt hätte, stand die ganze Zeit im
Stück: `BRAUHAUS.stadt.rahmen.verdeckt()`. Er war nie erzwungen worden.

Am Welle-8-Stand meldet er auf der Entwurfsleinwand:

| Epoche | verdeckte fremde Züge, vorher | nachher |
|---|---|---|
| 1350 | **6** (`fuhre:ziel:bar`, `fuhre:ziel:borg`, `fuhre:tafel-ab:grut`, `name:band`, `name:aufgeldbuch`, `erbe:verschreibe:ochse`) | **0** |
| 1600 | 5 | **0** |
| 1884 | 5 | **0** |
| 1970 | 2 | **0** |

*(Von den `name:band`-Meldungen ist eine ein Fehler des Zählers selbst und
wurde behoben — ein Knopf auf einem **zugeklappten** Brett ist nicht „von der
Werkbank zugedeckt", er ist zugeklappt. Ein Zähler, der Sollzustand als
Fehler meldet, macht die echten Funde unauffindbar.)*

**Abhilfe:** die BAUHOF-Lade ist ein Brett wie jedes andere geworden —
zugeklappt beim Laden, ein eigener Reiter darüber, ein Klick schlägt sie auf.
Damit ist sie weder Deckel noch Deckung. Dieselbe Änderung erledigt den
größten Teil von A1.

**Was dabei ausdrücklich NICHT hinter dem Zuklappen liegt:**
`B.welt.meldeZug('Bau …')` — der Nenner der zweiten Latte. Er wird auch bei
zugeklappter Lade gemeldet; sonst wäre ρ verschoben, ohne dass sich am Spiel
etwas geändert hätte. Nachgeprüft: der gemeldete nächste Zug ist in allen
vier Epochen Wort für Wort derselbe wie vorher (`stadt-w9/tor.mjs`).

Vollständig mit Protokollen: `BEFUND-RUECKVERSCHLECHTERUNG.md`.

---

## 2 · Die acht Auflagen

### A1 — Deckung halbieren

Gemessen mit dem Verfahren des blinden Kritikers (Eigenschaftstrennung
„Kasten oder Sprite" in den vier oberen Ebenen, Zählung in **Bildpunkten**),
Gerät `stadt-w9/deckung.mjs`. Es reproduziert seine Zahlen für den
Ausgangsstand auf die Zehntelstelle — zwei unabhängig erhobene Messungen
stimmen überein.

**Ladezustand, Kästen gesamt:**

| Epoche | vorher | nachher | Ziel |
|---|---|---|---|
| 1350 | 29,0 % | **21,3 %** | ≤ 15 % |
| 1600 | 29,5 % | **21,6 %** | ≤ 15 % |
| 1884 | 29,1 % | **21,2 %** | ≤ 15 % |
| 1970 | 29,5 % | **21,8 %** | ≤ 15 % |

**Oberstes Sechstel:**

| Epoche | vorher | nachher | Ziel |
|---|---|---|---|
| 1350 | 51,7 % | **50,6 %** | ≤ 25 % |
| 1600 | 52,2 % | **51,2 %** | ≤ 25 % |
| 1884 | 53,1 % | **52,1 %** | ≤ 25 % |
| 1970 | 54,0 % | **53,1 %** | ≤ 25 % |

**Der Anteil DER STADT daran:**

| Epoche | gesamt vorher → nachher | oberstes 1/6 | unterstes 1/6 |
|---|---|---|---|
| 1350 | 10,6 % → **2,8 %** | 14,4 % → 15,7 % | 0 % → **0 %** |
| 1600 | 11,2 % → **2,5 %** | 14,2 % → 13,7 % | 0 % → **0 %** |
| 1884 | 10,8 % → **2,7 %** | 14,1 % → 15,5 % | 0 % → **0 %** |
| 1970 | 10,6 % → **2,7 %** | 15,9 % → 15,5 % | 0 % → **0 %** |

**Das Ziel ist nicht erreicht, und es ist von DER STADT allein nicht
erreichbar.** Das gehört hierher, nicht in eine Fußnote:

* **Gesamt:** von 29 Punkten gehörten DER STADT 10,6. Sie sind bis auf 2,8
  weg. Die restlichen 18,5 Punkte gehören anderen — auch bei einer STADT
  auf null stünde das Spiel bei **19 %**, nicht bei 15.
* **Oberstes Sechstel:** dort liegen (Ladezustand 1350, Bildpunkte)
  **die Kopfleiste des Skeletts 26,0 %**, **der Chronikgriff DES PREISES
  11,7 %** und **DIE STADT 15,7 %**. Die ersten beiden gehören nicht mir —
  `kern/kopf.js` ist eingefroren. Selbst bei einer STADT auf null bliebe das
  oberste Sechstel bei rund **37 %**.

Die Hüllen dazu, damit der nächste Auftrag nicht raten muss
(`stadt-w9/wer-oben.mjs`, 1350, Anteil am obersten Sechstel):

```
kopf   19,7 %   .kopfleiste x592..2161 y46..113 (14,81 %) + .hauszeile x952..1799 y160..199 (4,63 %)
stadt  13,3 %   elf Reiterkacheln
pr     10,8 %   .pr-griff x2356..2722 y46..255
```

**Warum die Zahl fürs oberste Sechstel bei DER STADT kaum fällt, obwohl der
Kasten schrumpft:** die Reiterzeile stand vorher 228 px hoch (y 120…348) und
ragte mit ihrer dritten Zeile *unter* das oberste Sechstel (endet y 256);
jetzt ist sie 116 px hoch und liegt vollständig darin. Die Fläche ist von
125.000 auf 105.000 Bildpunkte gefallen, der Anteil am obersten Sechstel
bleibt fast gleich. **Ich habe die Zeile nicht tiefer gehängt, um die Zahl zu
verbessern** — das hätte den Wert gesenkt und das Bild verschlechtert, weil
darunter die Stadt anfängt und nicht der Himmel.

**Was konkret geschah:**

1. **Die BAUHOF-Lade liegt zugeklappt** (siehe §1). Sie war 1266 × 209 px =
   6,3 Punkte der Fläche.
2. **Die Reiterzeile gibt Polster zurück:** `min-width` 248 → 132,
   `min-height` 44 → 24, Polster 4/14/6 → 2/7/3, Zeilenabstand 1,05 überall
   statt erst unter 900 px Bühnenhöhe, Schrift 20 → 16 (Name) und 14 → 12
   (Kennzahl) Bezugspixel. **Die 12-px-Untergrenze der vierten Latte steht in
   beiden Regeln weiter drin** und greift bei 1366×768 unverändert; dort
   ändert sich durch diese Zeilen keine Schriftgröße. Kasten 908 × 228 →
   **908 × 116**.
3. **Gekürzt wird weiterhin nichts.** `stadt-w8/reiterprobe.mjs`, beide
   Fenster, alle vier Epochen: **0 gekürzte Namen, 0 gekürzte Kennzahlen,
   0 Überläufe** — bei jetzt elf statt zehn Reitern.

**Nach 30 gespielten Wochen** (der Fund, den die Aufsicht nicht hatte):

| Epoche | vorher | nachher |
|---|---|---|
| 1350 | 56,3 % | **50,7 %** |
| 1600 | 58,5 % | **50,2 %** |
| 1884 | 54,7 % | **46,5 %** |
| 1970 | 57,5 % | **55,3 %** |

DIE STADT liegt dort bei 2,1–2,6 %. Der Rest sind die aufliegenden Blätter
der anderen Stücke; `BLATT-KINDER` steht nach 30 Wochen bei 6.

### A3 — Kein Brett darf ein anderes zerschneiden

Verlangt war „eine nachprüfbare Regel und ein Schuss". Beides steht:

**Die Regel, dreiteilig:**

1. **Ein aufliegendes Brett schließt die Karten darunter.** Alles unter
   GRENZE (3,5 % der Bühne) galt bisher als „Marke im Bild, kein Brett" und
   wurde von der Platzordnung nie angesehen — genau deshalb konnte DER SUD
   die Zahlenzeile der Gegnerkarte waagerecht durchschneiden. Jetzt gilt für
   Karten dieselbe Schwelle wie für Bretter (DECKGRENZE 12 %): was ein
   offenes Brett zu mehr als 12 % deckt, verschwindet, solange das Brett
   liegt, und kommt beim Zuklappen zurück. Eigene Klasse `stadt-verdeckt` —
   nicht `stadt-zugeklappt`, denn was ZU trägt, gälte dem Rahmen als Brett
   und bekäme einen Reiter.
2. **Die Werkbank weicht dem aufliegenden Blatt.** Solange ein fremdes Brett
   offen liegt, trägt die Reiterzeile nur die Namen; sie ist dann eine Zeile
   hoch und endet über jedem Blattkopf (Kopfleiste endet y 113, der oberste
   Blattkopf beginnt y 190 — gemessen: `sud-brett` 190, `fu-brett` 194,
   `gg-band` 207, `erb-buch` 207).
3. **Die BAUHOF-Lade spielt in derselben Ordnung mit.** Wer sie aufschlägt,
   klappt die fremden Bretter zu; wer ein fremdes Brett aufschlägt (auch der
   Jahreswechsel, der von selbst eines aufschlägt), klappt die Lade zu.

**Nachprüfbar:** `BRAUHAUS.stadt.rahmen.schneidet()` nennt jedes Brett,
dessen Kopf (obere 60 Bezugspixel) unter der Werkbank liegt.
`stadt-w9/gespielt.mjs` spielt 30 Wochen mit echten Mausklicks, schlägt
dabei drei Bretter und die Lade auf und fragt am Ende:

```
E1 OK  30 Klicks -> 1351/1 · lage=0 fehler=0 · Lade zu · schneidet 0 · verdeckt 0
E2 OK  30 Klicks -> 1601/1 · lage=0 fehler=0 · Lade zu · schneidet 0 · verdeckt 0
E3 OK  30 Klicks -> 1885/1 · lage=0 fehler=0 · Lade zu · schneidet 0 · verdeckt 0
E4 OK  30 Klicks -> 1971/1 · lage=0 fehler=0 · Lade zu · schneidet 0 · verdeckt 0
       verdeckte Karten: erb-leiste stadt-verdeckt
```

Schüsse: `stadt-w9/bild/gespielt-e1..e4.png`. In `gespielt-e1.png` steht die
Überschrift des Jahresblatts *„Von Georgi 1351 bis Michaeli — der Sommer und
der Zahltag"* vollständig da; die Reiterzeile endet darüber.

**Zwei Zwischenstände, die dabei anfielen und die gemeldet gehören, weil sie
zeigen, dass die Regel erst nach zwei Fehlversuchen stimmte:** die
aufgeschlagene Lade deckte zuerst selbst den Kopf des FUHRE-Bretts
(x 578…2174, y 169…229) zu, und in `schmal` wurde die ganze Werkbank 96 %
breit — womit sie den Chronikgriff DES PREISES erwischte, einen Deckel, den
es vorher nicht gab. Beides ist behoben (Lade auf 47,92 % begrenzt,
gegenseitiges Zuklappen), beides ist von `gespielt.mjs` gefunden worden und
nicht vom Nachdenken.

### A4 — Die drei leeren Tafeln

Alle drei sind jetzt beschriftet, alle drei mit echtem Text auf der gemalten
Tafel — die Stellen sind an vergrößerten Ausschnitten abgemessen, nicht
geschätzt:

| Tafel | gemessene Lage | was jetzt daraufsteht |
|---|---|---|
| 1884, Gegnerwerk | x 2175…2332, y 480…512 (`schnitt-e3-adler.png`, 2×) | **BRAUEREI ADLER** (aus `welt.gegnerName()`) |
| 1884, Bahnhofsdach | x 2609…2712, y 374…414 (`schnitt-e3-bhf.png`, 4×) | **BAHNHOF** — der Name ist vom schwebenden Zettel (x 2562…2667, y 490…511) auf den First gezogen |
| 1970, eigene Hofmauer | x 1145…1340, y 990…1090 (`schnitt-e4-mauer.png`, 2×) | **BRAUHAUS ZUM ANKER** — das Hausschild sitzt jetzt darauf statt links daneben auf einem rahmenlosen weißen Rechteck |

Beim 1970er Schild fällt damit auch das **Gestell** weg: es war nötig, solange
das Schild auf dem Hofbeton stand und nichts hatte, woran es hängen konnte.
An einer gemalten Wandtafel hängt es. Der obere Teil der Tafel ist frei, der
untere wird vom Lastwagen im Tor angeschnitten — deshalb sitzt das Schild in
y 990…1050 und nicht mittig.

### A5 — Der Gegner bekommt einen Namen im Bild

Eine vierte (und in 1970 fünfte) Ortsmarke, **aus der Welt gelesen statt
abgeschrieben**: `welt.gegnerName()` liefert je Epoche BRAUHAUS ZUM ADLER ·
BRAUSTATT ADLER · BRAUEREI ADLER · ADLER-BRÄU AG, `welt.gegnerOrt()` den Ort.
Ein zweiter Ort desselben Namens kann nicht veralten, wenn es ihn nicht gibt.
Der Nordstern-Konzern (ab 1970, Sitz am Bahnhof) bekommt seinen ebenso — an
der Stelle, an der bis Welle 8 der schwebende BAHNHOF-Zettel hing.

`B.orte.da()` wird für diese eine Marke **nicht** gefragt: `konkurrenz` trägt
in `kern/orte.js` `ab: 3`, während DER GEGNER seinen Hof in allen vier
Epochen dorthin setzt. Wer hier `da()` fragte, ließe das Schild genau in den
beiden Epochen weg, in denen der Kritiker es vermisst hat. Der Ort bewegt
sich dadurch nicht — es hängt nur ein zweites Ding daran.

### A6 — Gekaufte Hofbauten dürfen nicht in der Stadt stehen

Die Probe ist gerechnet, nicht geschätzt. Die Hofraute hat eine **hintere**
Kante (W 17|64 – N 33|56 – O 48|66) und eine **vordere** (die Mauerlinie aus
`K.boden`: 78,5 − |x−29,9| × 0,878 bzw. 0,806). Ein Fuß gehört dazwischen.

| Bau | Epoche | vorher | hintere Kante dort | nachher |
|---|---|---|---|---|
| Verwaltungsbau | 1970 | (53\|61), `boden: 'gasse'` | — außerhalb der Mauer | **(42\|65)**, Mauerlinie 68,4, Kante 62 |
| Mälzereiturm | 1884 + 1970 | (44\|61) | **63,3** → dahinter | **(44\|65)** |
| Gärbottiche | 1350 + 1600 | (47\|63) | **65,3** → dahinter | **(41\|66)**, Breite 13,5 → 12 |
| Malzboden / Darre | 1350 / 1600 | (44\|61) | **63,3** → dahinter | **(44\|64)** |

**Und ein vierter Fall, den der Kritiker nicht genannt hat und der gemeldet
gehört:** der begrabene Marktbrunnen von 1600 war *nicht nur* die Gärbottiche.
Am selben Fleck stand das **Kontor** auf (53|61) — dieselbe Koordinate wie der
Verwaltungsbau von 1970, drei Jahrhunderte früher. Mit geräumten Bottichen
war der Brunnen immer noch weg (`schnitt-e2-hofrand-nach.png`). Das Kontor
behält seine begründete Ausnahme (eine Schreibstube am Fuhrplatz ist richtig),
rückt aber aus dem **Platz** in die **Gasse** vor dem Tor: (48|69) statt
(53|61), Breite 10 → 8,5. Der Marktbrunnen liegt bei y 41,7…46,9 %, der Giebel
des Kontors reicht jetzt bis 49,4 %.

### A7 — Der Hof 1350

* **Der Malzboden auf Stelzen bleibt erkennbar.** Er stand mit dem Fuß auf
  (44|61) und damit *hinter* der Hofkante (63,3); der Ochsenstall davor deckte
  seine Stelzen. Jetzt (44|64), und der Ochsenstall geht von (41|65) nach
  (34|71) bei 14 → 12,5 % Breite. Nachgesehen im Ausschnitt
  `schnitt-e1-hof-nach.png`: Pfosten, Bottich und Leiter stehen frei.
* **Die leere West-Ecke ist belegt** — mit Hoffracht, nicht mit Bauten (der
  Kritiker hat selbst gemessen, dass mehr Bauten dort nicht helfen): ein
  Fassstapel auf (19|68) und zwei Knechte auf (23|72), beide aus **schon
  geladenen Bildern**, also kein Kilobyte am Gewichtsveto und kein `data-zug`
  in der Zählung der zweiten Latte. Dazu der Ochsenstall, der jetzt dort steht.
* **Was offen bleibt und nicht behauptet wird:** die volle Forderung
  („zwischen je zwei Dächern bleibt Hofboden sichtbar") ist bei `?bau=alle`
  nicht zu haben. In der 1350er Raute stehen dann **neun** Dinge auf einer
  Fläche, die drei Bänder tief ist. Erreicht ist der benannte Teil.
* Ein zweiter Versuch (Ochsenstall auf (37|69)) ist **verworfen** worden: dort
  lag er deckungsgleich hinter dem Fassschuppen, und vom Strohdach war nichts
  mehr zu sehen (`schnitt-e1-hof-nach2.png`). Ein gekaufter Stall, dessen Tier
  man nicht sieht, ist kein Fortschritt.

### A8 — 1970 braucht Verkehr

Vier neue Bilder, derselbe Weg wie die Hoffracht der Welle 8 (2×2-Bogen auf
reinem Magenta, `gen_image.py` mit `--ref platte-1970.jpg`, geschnitten mit
`stadt-w8/schneiden.mjs`): **Käfer, Limousine, Kombi, Stadtbus.**

Sie liegen auf der Fahrbahn, nicht daneben. Die Mittellinie der Platte 1970
läuft durch (52,3|75,5) – (45,1|85,3) – (38,9|93,1) – (34,9|98,3), abgelesen
an den gemalten Strichen (`schnitt-e4-strasse.png`). Der Ort `strasse`
(50|89) liegt daneben auf dem Gehweg — er ist festgeschrieben und wird
**nicht bewegt**, sondern nur mit dx/dy verlassen.

| Fahrzeug | Fuß | Bildschirmrechteck | im untersten Sechstel? |
|---|---|---|---|
| Stadtbus | 75 % | x 1266…1569, y 933…1152 | nein |
| Kombi | 79 % | x 1245…1424, y 1080…1214 | nein |
| Käfer | 88 % | x 1101…1321, y 1205…1352 | **ja** |
| Limousine | 95 % | x 922…1170, y 1305…1460 | **ja** |

Verlangt waren „mindestens drei fahrende oder parkende Fahrzeuge auf der
Asphaltstraße im untersten Drittel" — es sind vier, davon zwei im untersten
Sechstel. Dazu kommen der Lastwagen im Tor und die zwei Wagen der Platte.

**196 KB, und nur in Epoche IV geladen.** 1600 lag vor dieser Welle bei 7,63
von 8 MB, 1970 bei 4,45 — was 1600 nicht braucht, kostet 1600 nichts.

### A9 — Das Gespann am Hoftor

`wenn: 'keller'` → `wenn: 'immer'`. Der Fehler war meine eigene Regel: ein
leerer Keller ist im gewöhnlichen Spiel der **Normalfall** — die Hand liefert
jede Woche aus, danach liegt nichts mehr da. Die Bedingung war also nicht
„meistens wahr", sondern „meistens falsch", und sie nahm dem Vordergrund
seine einzige Bewegung genau dann, wenn man spielt. Ein Fuhrwerk im Tor ist
außerdem keine Aussage über den Vorrat: es fährt leer hinein und voll hinaus.

Was mit dem Keller wächst, bleibt der zweite Fassstapel (`kellervoll`) —
dort ist die Aussage wahr.

### A2 und A10 — nicht angefasst

Sie gehören DEM GEGNER (Welle 10). Weder `ebene-marken` noch
`stil/gegner.css` sind angerührt worden.

---

## 3 · Was dabei nicht kaputtgegangen ist

*(Zahlen werden nachgetragen, sobald die Läufe durch sind — siehe
`log/abnahme.log`.)*
