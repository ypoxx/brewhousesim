# Kritik K2 · DER ERSTE SCHIRM — Welle 13

*Blind gemessen am eingefrorenen Stand `http://127.0.0.1:8933/spiel/` (Marke
`b098fc6`), Fenster 1600×900 und zusätzlich 1366×768. Diese Datei wird laufend
geschrieben, nicht erst am Ende.*

Gelesen habe ich: `gauntlet/MESSLATTE.md`, `spiel/LIESMICH.md`,
`gauntlet/WELLE-13-KRITIK.md`, sowie aus `spiel/` die Dateien `kern/start.js`,
`kern/kopf.js`, `kern/welt.js`, `kern/buehne.js`, `kern/basis.js`,
`spiel/index.html` und Ausschnitte aus `stuecke/fuhre.js` (dort, wo
`meldeZiel()` steht) — nur so weit, wie nötig war, um Knopfnamen und die
Selektoren des neuen Anschlags zu finden. Nicht gelesen: alles unter der
Sperrliste des Auftrags (`werkbank/urteile/**` außer dieser eigenen Datei,
`werkbank/LAUFENDER-AUFTRAG.md`, `werkbank/stand.json`, andere
`gauntlet/WELLE-*.md`, `werkbank/schuss/aufsicht/welle13-gegen/**`,
`analyse/**`, `feinkonzept/**`, `spiel/BEFUND-*.md`, `spiel/STAND.md`,
`spiel/FUHRE-STAND.md`, keine Git-Historie).

Status: **Abgeschlossen.**

---

## Hafen-Probe

`curl -s http://127.0.0.1:8933/.messstand-marke` → `b098fc6`. Der Hafen lebt.

---

## Geräte

Eigene Skripte unter `werkbank/schuss/kritik-w13-k2/` (Playwright, absoluter
Import von `/opt/node22/lib/node_modules/playwright/index.mjs`, wie
vorgeschrieben). `lib.mjs` bündelt die Fahrhilfen: echte Mausereignisse
(`mouse.move`/`down`/`up`) auf die tatsächliche Mitte der Knopffläche, mit
`elementFromPoint`-Prüfung **vor** jedem Klick — trifft der Zeiger nicht auf
den Knopf oder einen Nachfahren, gilt der Zug als **nicht gegriffen** und wird
nie geklickt. Adressen durchweg mit `&neu=1` (frische Partie) außer dort, wo
die Frage selbst den Spielstand betrifft (Frage 3b).

**Saatwahl:** `saat` = Startjahr der Epoche (1350/1600/1884/1970), wie es die
Beispieladresse des Auftrags nahelegt.

---

## Frage 1 — Textzeilen des ersten Schirms

Gezählt wird jede gerenderte **Textzeile** (`Range.getClientRects()` je
sichtbarem Textknoten, jedes Rechteck im Viewport zählt einzeln — ein
umgebrochener Absatz aus drei Zeilen zählt dreifach, wie „Zeilen" es nahelegt),
nur was den Viewport wirklich schneidet, nur bei `display`/`visibility`/
`opacity` sichtbar. Treffer auf */Ziel|gewinnen|überleb|Übergabe/i*.

**Eigener Meßfehler zuerst, weil er die erste Zahl verändert hat:** mit nur
120 ms Wartezeit nach dem Laden ergab derselbe Aufruf (1366×768, Epoche 1600)
zweimal **590** und einmal **598** Zeilen — nicht wiederholbar. Sechs
Wiederholungen mit 400 ms Wartezeit ergaben sechsmal exakt denselben Wert.
Mit der reparierten Wartezeit verschoben sich **auch die 1600×900-Zahlen**
leicht (z. B. Epoche 1350 von 548 auf 540) — 120 ms reichten also generell
nicht, nicht nur beim kleineren Fenster. Alle folgenden Zahlen sind mit 400 ms
Wartezeit erhoben und **dreimal** hintereinander byteidentisch reproduziert.

| Epoche (Jahr) | 1600×900: Zeilen / Treffer | 1366×768: Zeilen / Treffer |
|---|---|---|
| 1 (1350) | 540 / 4 | 532 / 6 |
| 2 (1600) | 593 / 10 | 590 / 13 |
| 3 (1884) | 555 / 6 | 570 / 9 |
| 4 (1970) | 589 / 7 | 570 / 10 |

Reproduzierbarkeit: **drei Läufe je Fenstergröße, alle drei byteidentisch**
(Skript `frage1-textzeilen.mjs`, Rohdaten `frage1-ergebnis.json`).

**Gegenüber dem Vorzustand (613 Zeilen, 0 Treffer, Saat 1350, vermutlich
1600×900):** die Gesamtzahl der Zeilen ist ähnlich geblieben (540 statt 613,
leicht weniger), aber **die Trefferzahl ist von 0 auf 4–13 gestiegen**, ganz
überwiegend durch zwei neue Textquellen: den „Anschlag am Anfang"
(`kern/start.js`, vier Sätze inkl. „DAS ZIEL —", „Gewinnen heißt …") und die
neue Zielzeile am unteren Rand (`kern/kopf.js` + `stuecke/fuhre.js`,
„Ziel: das Haus weitergeben, solange es steht…"). In Epoche 1600 kommen
zusätzliche Treffer aus echten Spielangeboten, die zufällig das Wort „Ziel"
im Namen tragen („Auf Ziel bis Michaeli" — ein Zahlungsziel, kein Spielziel;
das ist ein falscher Treffer meines Musters, kein Fund über das Spiel).

`BRAUHAUS.lage.length` und Seitenfehler: **0 und 0 in allen vier Epochen**,
in beiden Fenstergrößen, in allen drei Läufen.

---

## Frage 3 — Verdeckt der neue Anfang etwas?

Zwei neue Kästen aus Welle 13 kommen infrage: **(a)** der „Anschlag am
Anfang" (`startzettel`, `kern/start.js`, Auflage-Text mit „DAS ZIEL —" usw.,
liegt auf jedem frischen Schirm) und **(b)** die **Rückfrage** beim Knopf
„Neue Partie" (`kern-neu-frage`, `kern/kopf.js`, erscheint nur, wenn ein
Spielstand vorliegt).

### (a) Der Anschlag — deckt nichts zu

Direkter Test **ohne** Vorher/Nachher-Vergleich (der verfälscht sich, siehe
Kasten unten): für jeden gerade offenen, flächentragenden Knopf auf dem
Schirm, während der Anschlag liegt, wird geprüft, ob `elementFromPoint` an
seiner Mitte wirklich auf ihn trifft.

| Epoche | offene Knöpfe mit Fläche | davon nicht getroffen | davon **unter dem Anschlag UND** nicht getroffen |
|---|---|---|---|
| 1 (1350) | 75 | 31 | 4 |
| 2 (1600) | 80 | 32 | 3 |
| 3 (1884) | 81 | 35 | 4 |
| 4 (1970) | 76 | 33 | 5 |

Auf den ersten Blick sieht das nach einem Fund aus. Ist es nicht: für **alle**
Knöpfe in der letzten Spalte zeigt `elementFromPoint` nicht auf den Anschlag
(`.startzettel`), sondern auf ein `DIV` der STADT-Beschriftungen, und ihr
eigener Vorfahre trägt fünf Ebenen höher die Klasse **`stadt-zugeklappt`**
(z. B. `DIV.fu-brett fu-haeuser stadt-zugeklappt`) — sie liegen in einem
**zugeklappten Brett** und sind unabhängig vom Anschlag nicht anklickbar; das
ist dieselbe Regel, unter der laut Vorzustand-Tabelle schon vor Welle 13
„zehn zugeklappte Bretter" standen. Stichprobe direkt geprüft
(`diagnose-unterzettel.mjs`): bei allen acht geprüften Knöpfen (vier in Epoche
1350, fünf in Epoche 1970, teils überschneidend) war `istZettel: false`.

Zwei aus dem Quelltextkommentar bekannte frühere Bruchstellen gezielt
nachgestellt: `sud:gaerung:keller` (1600) — existiert in Woche 1 nicht auf dem
Brett, keine Prüfung möglich; `fuhre:listen:neustadt` (1970) — **existiert,
ist offen, `trifft: false`, aber `unterZettel: false`** — auch dieser Knopf
liegt an einer Stelle, die der Anschlag gar nicht berührt, blockiert also von
etwas anderem (vermutlich wieder ein zugeklapptes Brett).

**Befund zu (a): Der Anschlag deckt keinen einzigen zuvor greifbaren Knopf
zu.** `pointer-events:none` auf dem Behälter hält, was der Quelltextkommentar
verspricht.

> **Ein eigener Meßfehler auf dem Weg dahin, der hier stehen bleibt, weil er
> lehrreich ist:** ein erster Versuch verglich `BRAUHAUS.zuege()` **vor** und
> **nach** einem echten Klick auf „Anfangen" und fand netto 11 zusätzliche
> Züge (13 neu, 2 weg) — u. a. eine ganze Reihe `preis:nimm:*`- und
> `preis:festlege:*`-Knöpfe. Das sah nach Verdeckung aus, war es nicht: ich
> habe denselben Effekt (`diagnose-weiter.mjs`) auch beim allerersten Klick
> auf **WEITER** statt „Anfangen" gefunden, und **gar nicht** bei einem Klick
> auf eine leere Stelle oder bei bloßer Mausbewegung ohne Klick
> (`diagnose-klick-ueberall.mjs`). Es ist der **erste echte Spielzug
> überhaupt**, der die Michaelitafel öffnet (`preis:chronik-auf` →
> `preis:chronik`) — ein normaler Spielmechanismus, der mit dem neuen
> Anschlag nichts zu tun hat. Der direkte Test oben umgeht das, indem er gar
> nicht erst vergleicht, sondern den Ist-Zustand mit liegendem Anschlag für
> sich prüft.

### (b) Die Rückfrage — deckt einen Knopf zu, in Epoche 1350

Um den Knopf „Neue Partie" überhaupt zu bekommen, braucht es einen
gespeicherten Stand — **und der wird nur ohne `&neu=1` geschrieben** (eigener
Fehlversuch: mit `&neu=1` gespielt, dann in einem **neuen** Browserkontext
neu geladen → kein Stand, kein Knopf, weil weder derselbe Kontext benutzt noch
je geschrieben wurde). Repariert: derselbe Kontext, ohne `neu=1`, sechs Wochen
gespielt, dieselbe Adresse neu geladen.

| Epoche | „Neue Partie" da? | greifbar vor Rückfrage | greifbar mit Rückfrage | verdeckt (vorher greifbar, jetzt nicht) |
|---|---|---|---|---|
| 1 (1350) | ja | 48 | 49 | **`name:anschlag:umtrunk`** — „Umtrunk beim Wirt −9 Pf −1 Fass" |
| 4 (1970) | ja | 52 | 54 | keiner |

Für Epoche 1350 direkt nachgeprüft (`diagnose-rueckfrage.mjs`): der Knopf
„Umtrunk beim Wirt" liegt bei (846–1010, 350–381) px, die Rückfrage-Box bei
(537–1062, 306–383) px — er liegt vollständig **innerhalb** ihrer Fläche.
`elementFromPoint` an seiner eigenen Mitte trifft mit liegender Rückfrage auf
`BUTTON.knopf` **innerhalb** von `.neu-frage` — also auf einen der beiden
Knöpfe „Ja"/„Nein" selbst, nicht auf den Umtrunk-Knopf. Screenshot
`werkbank/schuss/kritik-w13-k2/zoom-rueckfrage-verdeckt.png`: die Wörter
„Umtrunk" und „weiterspielen" stehen sichtbar übereinandergedruckt.

**Befund zu (b): Die Rückfrage-Box (`kern-neu-frage`) — anders als der
Anschlag — hat kein `pointer-events:none` und keine Kollisionsprüfung gegen
das Brett darunter. Sie deckte in meinem Lauf einen zuvor greifbaren,
bezahlbaren Zug zu.** Das ist kein Konstruktionsfehler des Anschlags (Frage
3 fragt nach „dem neuen Anfang" — ich zähle beide Kästen aus Welle 13 dazu,
da nur einer sauber gebaut ist, gehört das gesagt). Nur **ein** Lauf je
Epoche; keine Wiederholung gemessen (Zeitbudget). Der Fund selbst ist aber
mit fester Geometrie reproduzierbar nachvollziehbar: beide Rechtecke
überschneiden sich unabhängig vom Zufall, solange „Umtrunk beim Wirt" an
dieser Bildschirmstelle steht.

---

## Frage 2 — Verstehst du nach fünf Minuten, was Gewinnen heißt?

**Ja, und zwar sofort, nicht erst nach fünf Minuten:** der Anschlag steht
lesbar auf dem allerersten Bild, bevor überhaupt ein Klick nötig ist, und
sagt in einem Satz „das Haus übergeben können, an die nächste Hand, vor dem
Rat — Gewinnen heißt hier nicht groß werden, sondern übergeben können", dazu
in einem zweiten Satz das schlechte Ende („wenn niemand in der Stadt mehr
abnimmt, ist das Haus zu"); die Zielzeile am unteren Rand trägt densel­ben
Gedanken danach **jede Woche** mit weiter (siehe Frage 4), inklusive einer
Prozentzahl, wie weit man ist. Ich habe über 65 Wochen in allen vier Epochen
zugesehen, wie diese Zahl von 33 % auf 47 % wächst — das Ziel bleibt nicht
nur lesbar, es bewegt sich sichtbar auf mich zu.

Zwei Einschränkungen gehören dazu, weil sie mein Verständnis nach fünf
Minuten tatsächlich getrübt hätten, wäre ich ein neuer Spieler gewesen, statt
Testskripte zu fahren: Erstens ist der Weg dorthin abstrakt — „übergeben
können" sagt nicht, WAS ich dafür konkret tun muss (welcher Knopf, welche
Bedingung), nur DASS es das Ziel ist; das lernt man laut Quelltext erst über
das aufgeklappte „ÜBERGABE VOR DEM RAT"-Brett, das im Vorzustand 15 von 284
Wochen offenstand und **0-mal bemerkt wurde** — diese Latte hat K2 hier nicht
selbst nachgemessen (das ist K4/K3-Gebiet), aber die neue Zielzeile allein
löst das Problem nicht: sie NENNT das Ziel, sie ZEIGT den Weg dorthin nicht.
Zweitens: in keiner meiner 65-Wochen-Partien ist innerhalb der gemessenen
Zeit ein echtes Übergabeangebot „auf den Tisch" gekommen (dafür bräuchte es
nach der Formel mehrere Braujahre mehr) — ich weiß aus dem Anschlag und der
Zielzeile, WAS das gute Ende ist, habe es in meiner Spielzeit aber nicht
gesehen.

---

## Frage 4 — Kommt der Zielsatz in jeder Woche?

Gemessen: **65 Wochen** je Epoche (mehr als die geforderten 60), echte
Mausklicks auf WEITER, `.zielzeile` nach jedem Klick gelesen.

**Erster Meßfehler, korrigiert:** mit der ursprünglichen Klick-Wartezeit von
40 ms fehlte die Zielzeile **systematisch** in der Woche direkt nach dem
allerersten Klick, in allen vier Epochen — reproduzierbar 3 von 3 Mal
(`diagnose-zielsatz-luecke.mjs`, Variante A). Mit 300 ms Wartezeit verschwand
dieser Fehler vollständig (3 von 3 Wiederholungen sauber). Grund vermutlich:
`kern/kopf.js` zeichnet `zeichneZiel()` einmal synchron und einmal über
`requestAnimationFrame` nach — beim allerersten Zug ist der erste Durchgang
oft vor dem `meldeZiel()`-Aufruf von DIE FUHRE fertig, der Nachtrag kam bei
40 ms Wartezeit manchmal zu spät für meine Messung.

**Zweiter, nicht restlos aufgeklärter Befund, der stehen bleibt, weil er
real ist:** auch mit 300 ms Wartezeit fehlte die Zielzeile vereinzelt genau
in der **ersten Woche eines neuen Braujahrs** (nie mitten im Jahr):

| Lauf | Wartezeit/Klick | Epoche 1350 | Epoche 1600 | Epoche 1884 | Epoche 1970 |
|---|---|---|---|---|---|
| Hauptlauf (65 Wo.) | 300 ms | 0 Lücken | 0 Lücken | 1 Lücke (1886/1) | 2 Lücken (1971/1, 1972/1) |
| Wiederholung 1 | 300 ms | — | — | 1 Lücke (1885/1) | 0 Lücken |
| Wiederholung 2 | 300 ms | — | — | 0 Lücken | 0 Lücken |
| Wiederholung 1 | 700 ms | — | — | 0 Lücken | 0 Lücken |
| Wiederholung 2 | 700 ms | — | — | 0 Lücken | 1 Lücke (1972/1) |

**Nicht reproduzierbar bei fester Saat:** dieselbe Partie (Epoche 1970, Saat
1970) zeigt je nach Lauf 0, 1 oder 2 Lücken an unterschiedlichen
Jahresgrenzen — auch bei 700 ms Wartezeit noch. Epoche 1350 und 1600 zeigten
in keinem der fünf Läufe (10 geprüfte Jahresübergänge) eine Lücke. Über alle
Läufe und beide betroffenen Epochen: **5 von 20 geprüften
Jahresersten-Wochen ohne Zielzeile**, ausschließlich in Epoche 1884 und 1970,
ausschließlich in der ersten Wochen eines neuen Jahres. Das ist dieselbe
Fehlerklasse, vor der `spiel/LIESMICH.md` unter „KEIN WÜRFEL, ABER TROTZDEM
ZUFALL" warnt (eine Wanduhrfrist im Zeichenweg, hier vermutlich in der
Reihenfolge von Jahreswechsel-Nacharbeit und dem `requestAnimationFrame`-
Nachtrag von `zeichneZiel()`) — ich kann sie mit meinem Gerät nicht
vollständig von einer Maschinenlast-Schwankung in der Meßumgebung selbst
trennen, halte die Jahresgrenzen-Häufung (**nie** mitten im Jahr) aber für zu
regelmäßig, um reines Rauschen zu sein.

**Antwort auf die Frage:** In allen normalen Spielwochen (Woche 2 bis 30
jedes Jahres) kam der Zielsatz **in jeder** der weit über 500 gemessenen
Einzelwochen. In der ersten Woche eines neuen Braujahrs kam er **fast immer**,
aber nicht sicher — mit einer geschätzten Lückenrate um 25 % in Epoche 1884
und 1970 (Epoche 1350/1600 unauffällig, aber mit weniger Läufen geprüft).

---

## Mitmessen — über alle vier Epochen, ohne Ausnahme

* **`BRAUHAUS.lage.length` und Seitenfehler:** beim frischen Laden **0 und 0**
  in allen vier Epochen (dreifach reproduziert, `frage1-ergebnis.json`);
  **auch nach 65 echten Spielwochen** (real geklickt, nicht gesprungen) **0
  und 0** in allen vier Epochen (`mitmessen-tief-ergebnis.json`).
* **Wiederholbarkeit im Überblick:**
  - Frage 1 (Textzeilen): **3 von 3 Läufen byteidentisch**, in beiden
    Fenstergrößen — aber nur, nachdem ein eigener Meßfehler (zu kurze
    Wartezeit) behoben war.
  - Frage 3a (Anschlag deckt nichts zu): an vier Epochen einzeln geprüft,
    **ein Lauf je Epoche**, dafür mit einer direkten (nicht
    differenzbildenden) Methode, die selbst keine Zeitkomponente hat — hier
    ist Wiederholung weniger nötig, weil das Ergebnis (kein Treffer) nicht
    von einer Meßschwelle abhängt.
  - Frage 3b (Rückfrage deckt einen Knopf zu): **nur ein Lauf je Epoche**
    (1350, 1970) — nicht wiederholt, Zeitbudget. Die Geometrie der beiden
    überlappenden Rechtecke ist aber nicht zufallsabhängig; ich halte den
    Fund für stabil, auch ohne zweiten Lauf.
  - Frage 4 (Zielzeile jede Woche): **nicht durchgehend reproduzierbar** —
    das ist selbst der Befund, siehe oben.

---

## Was an meiner Prüfung schwach ist

1. **Ich habe zuerst zwei eigene Meßfehler gemessen, bevor ich das Spiel
   gemessen habe.** Die 40-ms- und 120-ms-Wartezeiten nach einem Klick waren
   zu kurz für diese Bühne (viele Stücke, `requestAnimationFrame`-Nachträge,
   ein eigener Rundenschluss in `kern/runde.js`). Jede Zahl dieses Papiers,
   die ich nicht ausdrücklich als „mit 300/400 ms erhoben" kennzeichne, kann
   an dieser Schwäche hängen — ich habe versucht, das durchgehend zu tun,
   kann aber nicht ausschließen, dass eine der kleineren Diagnose-Zahlen
   (z. B. die 75/80/81/76 „offenen Knöpfe mit Fläche" aus Frage 3a) noch von
   einer zu kurzen Wartezeit an irgendeiner Stelle betroffen ist, die ich
   nicht einzeln nachgeprüft habe.
2. **Meine „greifbar"-Prüfung testet nur die geometrische Mitte eines
   Knopfes.** Ein Knopf, der zu 80 % von etwas anderem verdeckt ist, aber an
   seiner exakten Mitte frei liegt, zählt bei mir als „getroffen" — ein
   echter Zeiger, der nicht exakt die Mitte trifft, könnte trotzdem
   danebengehen. Meine Zahlen sind damit eher zu freundlich als zu streng.
3. **Frage 3b habe ich nur in zwei von vier Epochen geprüft** (1350, 1970),
   mit je einem Lauf, ohne Wiederholung. Der Fund (verdeckter Umtrunk-Knopf)
   ist geometrisch plausibel und mit Screenshot belegt, aber ob er in 1600
   und 1884 genauso auftritt, weiß ich nicht — ich habe nicht in jeder
   Epoche geprüft, obwohl der Auftrag „unter jedem neuen Kasten" nahelegt,
   dass ich das hätte tun sollen.
4. **Ich habe 1366×768 nur für Frage 1 vollständig gemessen**, für Fragen 3
   und 4 gar nicht — der Auftrag verlangt dort nur „einen Blick", aber ein
   Blick ist weniger, als ich für die anderen drei Fragen geboten habe. Es
   ist möglich, dass die Rückfrage-Überdeckung bei 1366×768 anders (größer
   oder kleiner) ausfällt, weil sich die Kartenlayout-Positionen mit `--s`
   verschieben.
5. **Ich habe nicht geprüft, ob der Jahresgrenzen-Befund aus Frage 4 auch
   bei 40 echten Menschen-Sekunden zwischen zwei Klicks auftritt** (also bei
   einem Tempo, das eher einem echten Spieler entspricht als meinem Skript,
   das in Sekundenbruchteilen klickt). Es ist denkbar, dass ein echter
   Spieler die Lücke nie sieht, weil sie sich in der Zeit, die er zum
   nächsten Klick braucht, längst gefüllt hat — oder genau umgekehrt, dass
   ein anderer Zeitabstand die Lücke verlässlicher auslöst. Meine Zahl
   beschreibt mein Klicktempo, nicht zwingend das eines Menschen.
6. Wie schon der Kritiker der Welle 12 in seinem eigenen Abschnitt X
   festgehalten hat und wie es die Aufsicht ihm nachträglich bestätigt hat:
   diese Prüfung faßt nur an, wonach sie ausdrücklich sucht. Ich habe gezielt
   nach Verdeckung durch die zwei neuen Kästen aus Welle 13 gesucht und dabei
   ein allgemeines, vom Anschlag unabhängiges Phänomen gefunden (die
   „zugeklappten Bretter" blockieren ~40 % aller offenen Knöpfe) — das habe
   ich benannt, aber nicht selbst tiefer vermessen, weil es außerhalb meines
   Auftrags K2 liegt. Ein Kritiker, der gezielter danach gesucht hätte, hätte
   es zur eigenen Latte machen können.

---

## Auflagen (aus den eigenen Funden dieser Kritik)

**A1 — Die Rückfrage „Neue Partie beginnen?" braucht dieselbe Sorgfalt wie
der Anschlag.** Sie deckt in Epoche 1350 den Knopf `name:anschlag:umtrunk`
zu (Screenshot `zoom-rueckfrage-verdeckt.png`). Entweder Kollisionsprüfung
gegen das Brett darunter, oder — einfacher, wie beim Anschlag bereits gelöst
— das Baubrett selbst kurz sperren (`pointer-events:none` mit Ausnahme der
beiden Rückfrage-Knöpfe), solange die Rückfrage offen ist.

**A2 — Die Zielzeile sollte bei Jahreswechseln denselben Schutz bekommen wie
beim allerersten Zug.** In meinen Läufen fehlte sie in 5 von 20 geprüften
ersten Jahreswochen (nur Epoche 1884/1970 betroffen). Zu prüfen, ob
`zeichneZiel()`/`meldeZug()` und die Jahresabrechnung
(`rechneJahrAb()`/`erbfall`) in derselben Weise reihenfolgesicher
zusammenspielen wie es `kern/runde.js` für den Rundenschluss bereits
verspricht.

---

## Kurzfassung der Kernzahlen

* Textzeilen erster Schirm (1600×900): **540 / 593 / 555 / 589** (Epoche
  1–4), Treffer auf Ziel/gewinnen/überleben/Übergabe: **4 / 10 / 6 / 7**
  (Vorzustand: 613 Zeilen, 0 Treffer). Dreifach reproduziert.
* Frage 2: **ja**, sofort verständlich durch den Anschlag und die
  wöchentliche Zielzeile — mit der Einschränkung, dass der KONKRETE Weg zur
  Übergabe weiterhin nur über ein selten bemerktes Brett zugänglich ist.
* Frage 3: Anschlag deckt **nichts** zu (vier Epochen geprüft); Rückfrage
  deckt **einen** Knopf zu (in 1 von 2 geprüften Epochen).
* Frage 4: Zielzeile in **jeder** normalen Wochen da; in der ersten Woche
  eines neuen Jahres in **5 von 20** geprüften Fällen **nicht**, nur in
  Epoche 1884/1970, nicht reproduzierbar bei fester Saat.
* `BRAUHAUS.lage`/Seitenfehler: **0/0** in allen vier Epochen, auch nach 65
  echten Spielwochen.

**Ende der Prüfung K2.**
