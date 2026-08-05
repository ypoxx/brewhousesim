# DIE STADT · Welle 7 — Urteil des blinden Kritikers

**Gemessen am eingefrorenen Stand `b6b06bb`, Hafen 8903.** Marke vor dem Lauf
geprüft (`curl -s http://127.0.0.1:8903/.messstand-marke` → `b6b06bb`), und
zusätzlich fünf Dateien byteweise gegen den Arbeitsbaum verglichen
(`stadt.js`, `stadt.css`, `index.html`, ein Hofbild, eine Platte) — alle gleich.

**Blind.** `werkbank/urteile/welle7-die-stadt-bau.md` ist nicht geöffnet, kein
`git log`, kein `git show`. Gelesen wurden `gauntlet/MESSLATTE.md`,
`design/PRUEFUNG.md`, `spiel/LIESMICH.md`, `werkbank/LAUFENDER-AUFTRAG.md` und
der Quelltext des Spiels.

Messwerte als `.json` neben dieser Datei unter
`werkbank/schuss/stadt-blind-w7/`.

*Diese Datei wird laufend geschrieben, nicht erst am Ende.*

---

## 1 — DIE ERSTE LATTE: die WebP-Umstellung

### 1.1 Was tatsächlich umgestellt wurde — und was nicht

Die Ansage lautete „alle 32 Hofbilder **und die vier Epochenplatten** von PNG in
WebP". Am laufenden Stand stimmt nur die erste Hälfte:

| | Format am Stand `b6b06bb` | Größe |
|---|---|---|
| 32 Hofbilder `spiel/bild/hof/*` | **WebP**, lossy VP8 + eigener ALPH-Block | 4.557 kB |
| 4 Epochenplatten `spiel/bild/platte-*.jpg` | **JPEG**, unverändert seit 3. August | 4.190 kB |

Die Platten waren nie PNG und sind keine WebP. Das ist kein Fehler — es ist nur
nicht das, was gemeldet wurde. Für die Latte zählt: **die Platte, also 100 % der
Bildfläche, ist von der Umstellung gar nicht betroffen.** Untersucht werden
konnten nur die 32 Hofbilder.

### 1.2 Der A/B, den ich selbst gebaut habe

Eine PSNR-Zahl über die Quelldateien beantwortet die Frage nicht, weil die Bilder
verkleinert, freigestellt und über eine Platte gelegt auf den Schirm kommen. Ich
habe deshalb einen **zweiten Messstand** gebaut: derselbe Baum wie 8903, nur mit
den 32 alten PNG statt der WebP, auf Hafen 8907
(`werkbank/schuss/stadt-blind-w7/ab-webp-aufsetzen.sh`, wiederaufnehmbar).

Dass die PNG wirklich die Quelle der WebP sind, ist belegt und nicht angenommen:
**der Alphakanal ist in 32 von 32 Dateien byteweise identisch** (maxdiff 0,
0 abweichende Punkte), bei exakt gleichen Pixelmaßen.

Dann je vier Bildschirmfotos derselben Woche, 2752×1536, und Punkt für Punkt
verglichen — **das ist der Unterschied, den ein Spieler sehen könnte, und sonst
nichts:**

| Epoche | PSNR ganzer Schirm | Punkte bitgleich | Δ>8 | Δ>16 | Δ>32 | maxdiff |
|---|---|---|---|---|---|---|
| 1350 | 56,52 dB | 96,59 % | 1.117 | 3 | **0** | 17 |
| 1600 | 56,74 dB | 96,84 % | 1.872 | 37 | **0** | 22 |
| 1884 | **52,61 dB** | 92,70 % | 4.896 | 54 | **0** | 21 |
| 1970 | 53,58 dB | 93,68 % | 3.387 | 33 | **0** | 21 |

Von 4,2 Mio Bildpunkten je Schirm liegen **drei bis vierundfünfzig** über einem
Sechzehntel Tonwert Unterschied, und **kein einziger** über einem Achtel.
Rohdaten `ab-schirm-png-gegen-webp.json`.

### 1.3 Was ich sehe, nicht was die Zahl sagt

Ich habe die dichteste Fehlerkachel jeder Epoche gesucht und beide Fassungen
dort **dreifach vergrößert nebeneinandergelegt** (`ab-schirm-e3-zoom.png`,
`ab-schirm-e4-zoom.png`). Die dichteste Stelle ist in 1884 und 1970 dieselbe:
der Schornsteinkopf, weil `schornstein.webp` als einziges Hofbild fast in
Originalgröße auf den Schirm kommt (Faktor 0,947; alle anderen 0,08–0,60,
Median 0,45 — gemessen mit `bildmasse.mjs`, Rohdaten `bildmasse-2752.json`).

Dort sehe ich: **keinen Farbsaum, kein Banding, keine aufgelöste Beschriftungs-
kante, keinen Halo an der Halbtransparenz.** Ziegelfugen, der weiche Schatten
hinter dem Schornstein, die Leitersprossen und die halbdurchsichtige Rauchfahne
(`rauch.webp`, `opacity 0,82`) sind in beiden Fassungen dieselben. Ich kann die
beiden Bilder bei dreifacher Vergrößerung nicht auseinanderhalten.

### 1.4 Wo die Umstellung wirklich Substanz verliert — und warum es folgenlos ist

Ehrlichkeitshalber, weil es die Stelle ist, an der ein Fund zu erwarten war:
in den **Quelldateien** ist der Verlust deutlich größer, als eine Gesamt-PSNR
vermuten lässt.

| gemessen über | PSNR |
|---|---|
| ganze Datei inkl. der großen leeren Fläche *(so entsteht die 52–57-dB-Lesart)* | hoch |
| **nur die sichtbaren Punkte** (Alpha > 0) | min **29,03** · Median **36,32** · max 42,34 |
| **nur der Freistellrand** (0 < Alpha < 255) | min **19,57** (`keller_gewoelbe`) |

**In 30 von 32 Dateien liegt die sichtbare Fläche unter der 40-dB-Marke**, die
gemeinhin als „unsichtbar" gilt. Wer eine Datei-PSNR über den ganzen Rahmen
rechnet, misst zum größten Teil die vollständig durchsichtige Ecke.

Folgenlos ist es aus zwei Gründen, die beide gemessen sind: der Randfehler wird
beim Zusammensetzen **mit dem Alphawert multipliziert** (Δ 255 bei Alpha 3 sind
3 auf dem Schirm; komponiert bleiben nativ höchstens 52 von 255, bei `pfanne`),
und danach kommt das Bild auf **im Median 45 % seiner Kantenlänge**
herunter. Beides zusammen ergibt die Tabelle in 1.2.

Rohdaten `webp-gegen-png.json`.

**Für die Akte, weil es die nächste Runde betrifft:** der Puffer ist nicht groß.
`schornstein` steht schon bei 0,947 und ist der schlechteste Wert der Tabelle.
Wer ein Hofbild künftig größer als etwa 60 % zeigt oder eines mit weicher
Fläche in der Nähe von 1,0 bringt, hat diesen Schutz nicht mehr.

### 1.5 Keine Farbverschiebung — eigens nachgesehen, weil es hier eine geben könnte

Die alten PNG tragen **kein** Farbprofil, die neuen WebP tragen **eines**
(`ICCP`, 456 Byte). Wäre es nicht sRGB, würde Chromium umrechnen und die
Hofbilder stünden in einer anderen Farbe als die Platte daneben. Nachgeschlagen:
das Profil **ist** sRGB, also die Kennabbildung. Und am Bildschirm gemessen ist
die **mittlere vorzeichenbehaftete** Abweichung PNG − WebP über den ganzen
Schirm

| | R | G | B |
|---|---|---|---|
| 1350 | +0,0035 | +0,0049 | +0,0024 |
| 1884 | +0,0082 | +0,0189 | +0,0186 |
| 1970 | +0,0030 | +0,0020 | +0,0035 |

— Hundertstel eines Tonwerts. **Kein Farbstich, in keine Richtung.**

### 1.6 Nebenbefund am Gewicht der Umstellung

Jede der 32 Dateien trägt einen **ICCP-Block von 456 Byte** mit sich. Das sind
14,6 kB je Aufruf für ein Farbprofil, das bei sRGB-Bildern nichts ändert.
Gemessen an 4,5 MB ist das nichts; genannt sei es, weil es der einzige Rest ist,
der ohne Bildverlust wegfällt.

---

## 2 — DAS GEWICHT (Sperrliste, Veto)

Eigenes Gerät, eigener Weg: `gewicht.mjs` zählt die **Antworten**, die
Playwright selbst empfängt, mit der Länge des Körpers auf der Leitung —
kein Resource-Timing, keine Angabe der Seite über sich selbst. Kalter Zwischen-
speicher, ein frischer Kontext je Epoche, Fenster 1366×768. Dreistufig, weil das
Spiel zweistufig nachlädt.

| Epoche | bis `load` | + Ruhe, **ohne einen Klick** | nach dem ersten Wochenklick |
|---|---|---|---|
| 1350 | 3,93 MB / 56 | **6,00 MB** / 62 | 9,38 MB / 90 |
| **1600** | 5,49 MB / 62 | **7,38 MB** / 69 | 10,78 MB / 97 |
| 1884 | 4,02 MB / 56 | **6,33 MB** / 67 | 9,85 MB / 97 |
| 1970 | 1,96 MB / 51 | **4,28 MB** / 59 | 7,56 MB / 85 |

**Alle vier Epochen unter 8 MB, bevor der Spieler etwas tut.** Die schwerste
ist 1600 mit **7,381 MB** — das ist Ziffer für Ziffer die 7,38 MB der Aufsicht,
auf einem anderen Weg erhoben. Ein zweiter Lauf mit 15 s Ruhe statt 6 s ergab
dieselben Zahlen (5,997 / 7,381 / 6,327 / 4,280), einmal mit und einmal ohne
`&stumm=1` — **die Nachladestufe ist abgeschlossen, nicht bloß angeschnitten.**

**Was nach dem Klick dazukommt, ist fast vollständig Ton:** 26–30 `.mp3` mit
3,28–3,53 MB, und ohne Klick lädt **keine einzige** davon (nachgemessen: 0,000 MB
mp3 nach 15 s Ruhe). Das ist genau das, was die Sperrliste zulässt — „was darüber
hinaus nötig ist, wird nachgeladen". Es gehört außerdem DEM KLANG, nicht DER
STADT.

**Kein Fehlstatus, keine gescheiterte Anfrage** in allen vier Epochen.
Rohdaten `gewicht.json`.

### Zwei Beobachtungen zum Gewicht, die DER STADT gehören

1. **Es werden immer ZWEI Platten geladen, nicht eine.** 1350 holt
   `platte-1350.jpg` *und* `platte-1600.jpg`, 1600 holt 1600 + 1884, 1884 holt
   1884 + 1970, 1970 holt nur 1970. Das erklärt, warum 1970 mit 4,28 MB die
   leichteste Epoche ist und 1600 mit 7,38 MB die schwerste. Der Vorgriff auf
   die nächste Epoche ist zu rechtfertigen; er kostet aber **1,9–2,3 MB von den
   8**, und er ist der Grund, warum der Abstand zur Obergrenze in 1600 nur noch
   **0,62 MB** beträgt.
2. **`bild/name/` und `bild/gegner/` sind nicht umgestellt** — 11 PNG mit
   **4,4 MB auf der Platte**, davon holt 1600 allein 1,14 MB
   (`name/schild2.png` 683 kB, `gegner/hof2.png` 489 kB). Nach
   `spiel/LIESMICH.md` gehört *„`bild/**` (ganz)"* DER STADT. Dieselbe Umstellung
   auf diese elf Dateien angewandt hätte den Abstand zur Obergrenze etwa
   verdoppelt.

**URTEIL LATTE „GEWICHT": BESTEHT.** Das Veto ist nicht ausgelöst.

---

## 3 — LATTE 4, AN SEINEM STÜCK

Gemessen mit `werkbank/schuss/aufsicht/lesbarkeit.mjs` bei **1366×768**, mit
gezeichneter Rollleiste (das reparierte Gerät). Gesamtstand am Hafen 8903:

> **51 Überläufe · 505 Textknoten unter 12 px · 0 von 334 aktiven Knöpfen
> unter 24 px** — Ziffer für Ziffer wie von der Aufsicht eingetragen.

Weil die übliche Aufschlüsselung nach dem ersten Wort des Klassennamens sortiert
und dabei fremde Kästen zurechnet (von DER PREIS gemeldet), habe ich mit einem
eigenen Gerät (`latte4-stadt.mjs`) **nach Eigentum** gezählt: welcher Vorfahr
trägt eine Stück-Klasse.

| Epoche | STADT: Knoten <12 px | STADT: abgeschnittene Kästen | STADT: Knöpfe <24 px | aktiv, aber nicht treffbar |
|---|---|---|---|---|
| 1350 | 1 | 9 | 0 von 24 | 1 |
| 1600 | 1 | 10 | 0 von 24 | 1 |
| 1884 | 0 | 9 | 0 von 23 | 2 |
| 1970 | 0 | 9 | 0 von 21 | 2 |

**Die Schrift ist erledigt.** Zwei Knoten in vier Epochen, und beide sind
Fremdtext in einem STADT-Kasten (`gg-stammhaus amort stadt-marke-ruht`,
6,9 px — der Kasten ist DER STADT, die Schrift dem GEGNER). Die restlichen
503 liegen bei GEGNER (39–46), NAME (37–38) und ERBE (41).

**Die 37 abgeschnittenen Kästen dagegen sind zu 100 % DIE STADT** — 9+10+9+9,
und die Gesamtzahl 51 minus diese 37 lässt 14 für alle anderen Stücke zusammen.

### 3.1 Wo Inhalt verschwunden ist, statt lesbar zu werden — der Reiterstreifen

**Alle 37 abgeschnittenen Kästen sind Reiter.** Die Ursache steht in einer
einzigen Regel, `spiel/stil/stadt.css:255–264`:

```
.knopf.stadt-reiter .zahl {
  white-space: nowrap;  overflow: hidden;  text-overflow: ellipsis;
  width: 0;  min-width: 100%;          /* zaehlt fuer die Breite NICHT mit */
}
```

Dazu `.knopf.stadt-reiter { max-width: calc(var(--s) * 420); overflow: hidden; }`
(Zeile 226/239). Der Reiter ist so breit wie seine **Überschrift**; die lebende
Kennzahl darunter bekommt keine Breite, sondern nur Auslassungspunkte. Der
Kommentar daneben nennt den Grund und er ist nachvollziehbar: *„sonst schöbe
eine lange Zahl den Namen des Bretts aus dem Reiter."*

**Der Preis dafür ist aber nicht ein abgeschnittenes Wort, sondern eine
abgeschnittene Zahl** — und eine abgeschnittene Zahl liest sich wie eine
vollständige. Bei 1366×768, 1884, steht auf dem Reiter DIE HÄUSER:

| was der Reiter zeigt | was wirklich dasteht | fehlt |
|---|---|---|
| `wollen 14…` | **wollen 146** · im Keller liegen 11 hl | 177 px |
| `11 von 135 h…` *(DER EISKELLER)* | 11 von 135 hl · **11 reif** | 66 px |
| `0,0 von 60 hl…` *(HALBER WAGEN)* | 0,0 von 60 hl · **0 von 10 Halten** | 123 px |
| `am schw…` *(SUDPLAN)* | am schwarzen Brett der Mälzerei | 166 px |
| `Etikett, Plakat…` *(DER RUF DES HA…)* | Etikett, Plakat, Litfaßsäule | 84 px |
| `6 auf dem Pf…` *(ORTSMARKEN)* | 6 auf dem Pflock | 15 px |

**„wollen 14…" statt „wollen 146" ist der schlimmste Fall**, weil die
Auslassungspunkte klein sind und die Zahl davor plausibel: der Nachfragewert
erscheint um eine Zehnerpotenz zu niedrig. Das ist keine gekürzte Beschriftung
mehr, das ist eine falsche Ablesung.

**Und ja: es steht jetzt nur noch im Zeigertitel.** Mein Gerät zählt je Epoche
**31–36 STADT-Elemente, deren `title` Text trägt, der nirgends sichtbar ist** —
darunter genau die vollständigen Kennzahlen oben. Ein Zeigertitel ist auf einem
Berührungsbildschirm gar nicht und mit der Maus erst nach einer Sekunde Stillstand
zu haben.

**Es ist kein Kleinbildschirm-Effekt.** Dasselbe Gerät zählt

| Fenster | abgeschnittene STADT-Kästen (Summe über vier Epochen) |
|---|---|
| 2752×1536 *(die Entwurfsleinwand)* | **48** |
| 1920×1080 | **53** |
| 1366×768 | **37** |

Der Reiter schneidet **auf jeder gemessenen Größe**, auch auf der, für die
entworfen wurde. Rohdaten `latte4-stadt-1366.json`, `-1920.json`, `-2752.json`.

### 3.2 Zwei Knöpfe, die aktiv sind und die man nicht anklicken kann

Mit einem echten `page.click` geprüft, nicht mit `el.click()`:

| Knopf | Epoche | Befund |
|---|---|---|
| `stadt:alles-zuklappen` („STADT ZEIGEN") | 1350 · 1884 | Klick läuft in den Zeitablauf, **solange kein Brett offen ist**. Ist eines offen, sitzt der Reiter bei x 1002 und der Klick greift (offene Reiter 1 → 0). Folgenlos in der Sache — wenn nichts offen ist, gibt es nichts zuzuklappen —, aber der Knopf steht sichtbar da und tut nichts. Höhe **exakt 24 px**, also auf der Latte, nicht darüber. |
| `stadt:marke:fuhre-bahnhof` | 1884, nur bei 1366×768 | 24×24 px, **Mitte von einem fremden `SPAN.wort` überdeckt**. Klick scheitert. Bei 2752×1536 nicht. |

Zum Vergleich, weil es die Größenordnung einordnet: **insgesamt** sind bei
1366×768 **35 (1350) bzw. 42 (1884) aktive Knöpfe nicht mit der Maus zu
treffen** — davon gehört DER STADT genau einer. Der Rest verteilt sich auf
`fuhre:`, `name:` und `erbe:` und ist der schon dokumentierte Befund über
zugeklappte fremde Bretter.

### URTEIL LATTE 4 an DIE STADT

**Schrift und Zielfläche: bestanden** — 2 Fremdknoten in vier Epochen,
0 von 92 eigenen Knöpfen unter 24 px.
**Abgeschnittener Text: gerissen** — 37 von 51 Kästen des ganzen Spiels sind
seine, sie sind es auf jeder Fenstergröße, und was fehlt, ist die lebende
Kennzahl jedes Bretts.

**LATTE 4: BESTEHT MIT AUFLAGE.**

> **Nachtrag zu 3.1, der die Begründung der Regel widerlegt:** auf der
> **Entwurfsleinwand 2752×1536** wird der Name des Bretts *ebenfalls*
> abgeschnitten — „DIE HÄUSER" fehlen 14 px, „DER EISKELLER" 24 px,
> „DER RUF DES HAUSES" 33 px, „OHNE DICH GESCHEHEN" 38 px. Von zwölf
> abgeschnittenen Kästen in 1884 sind dort **acht Überschriften und vier
> Kennzahlen**. Die Regel opfert also die Zahl, um den Namen zu retten, und
> verliert am Ende beides. Bei 1366×768 ist es besser, nicht schlechter:
> dort sind es zwei Namen und sieben Zahlen.

---

## 4 — SPERRLISTE UND DIE HÄRTESTE EINZELFORDERUNG

### 4.1 Sachfehler und Anachronismen — kein Fund, der disqualifiziert

Geprüft am Bildschirm und an den 32 Hofbildern einzeln, gegen die Punkte, die
`design/PRUEFUNG.md` und `spiel/LIESMICH.md` wörtlich nennen:

| Sperrpunkt | Befund |
|---|---|
| **offene Braupfanne statt Destillierblase** | `pfanne.webp` zeigt eine **offene Pfanne über offenem Feuer**, Maischbottich, Kühlschiff — kein Helm, kein Dom, kein Schwanenhals. Sauber. Und in 1884 ersetzt sie nichts Falsches: sie endet mit Epoche II (`von: 1, bis: 2`). |
| **Emailschilder erst ab den 1890ern** | In 1884 heißt das Werbebrett „Etikett, Plakat, **Litfaßsäule**" (Litfaß 1855, richtig). Kein Emailschild in Epoche III gefunden. |
| **keine Bahn vor 1835, nicht in 1600** | Gleis nur in `laderampe` (nur Epoche III) und auf den Platten 1884/1970. Die Platte 1600 hat keins. |
| **Hektoliter erst ab 1872** | Kopfzeile 1350 „KELLER 4/12 **Fass**", 1600 „GEWÖLBE 8/24 **Fass**", 1884 „EISKELLER 11/135 **hl**", 1970 „TANKS 210/600 hl". Richtig. |
| **Währung des Jahres** | Pf · fl · M · DM. Richtig, auch die Mark erst ab Epoche III. |
| **Marktanteil auf die eigene Menge** | Kein Anteilswert im Bild DER STADT gefunden. |
| **Hopfen in 1350** | Vorhanden („Hopfen im Sack, heimlich"), und das ist nach der Berichtigung vom 5. August **richtig**, nicht falsch. |

Zwei Stellen, die ich einzeln nachgesehen habe, weil sie kippen könnten, und die
halten:

* **`flaschenhalle` (1884).** Ich habe die Kisten vergrößert: die Flaschen haben
  **glatte, sich verjüngende Hälse ohne Kronkorkenrand** — der Kronkorken ist von
  1892 und wäre hier falsch. Holzkisten, kein Kasten aus Kunststoff. Sauber.
* **`gaertanks` (1884), „Genietetes Eisen statt Holz".** Das Bild zeigt
  tatsächlich Nietreihen, keine glatte Schweißnaht. Passt zur Beschriftung und
  zum Jahr.

Ein Randfall, den ich als **niedrig** einstufe und nicht als Fund:
`grutkammer` (1350) sagt *„Hopfen kommt später"*, während dasselbe Jahr im
SUD-Brett „Hopfen im Sack, heimlich" anbietet. Historisch ist beides richtig
(Grut und Hopfen liegen im 14. Jh. nebeneinander); im selben Bildschirm nebeneinander
liest es sich als Widerspruch mit sich selbst.

**KEIN VETO AUSGELÖST.**

### 4.2 „Wachsen, ohne den Ort zu wechseln" — hier ist ein Fund

Gemessen mit `ortstreue.mjs`: für jeden Bau der **Fußpunkt in Prozent der
Bühne**, für jeden Ort der Punkt aus `BRAUHAUS.orte`, für jede Marke die Mitte —
in allen vier Epochen, und dann alles verglichen, was in mehr als einer Epoche
vorkommt.

**Die 28 Orte selbst sind treu: 0 von 28 haben sich bewegt, und zwar exakt —
die größte Abweichung über alle vier Epochen ist 0,00 % der Bühne, bei
identischer Schlüsselmenge (28/28/28/28).** Auch die Marken
stehen (die einzige Abweichung, `fuhre-marktplatz`, sind 0,58 % und stammt aus
einer anderen Beschriftungsbreite). Das Fundament stimmt.

**Drei Bauten bewegen sich trotzdem**, weil `stadt-daten.js` ihnen einen
epochenweisen `versatz` gibt, der auf den festen Ort noch obendrauf kommt:

| Bau | 1350 | 1600 | 1884 | Verschiebung |
|---|---|---|---|---|
| **`brunnen` — Ziehbrunnen** | 21 \| 62 | **25 \| 71** | 21 \| 62 | **110 px rechts, 138 px tiefer — und wieder zurück** |
| `fasslager_stein` | — | 41 \| 70 | 32 \| 73,5 | 248 px |
| `pfanne` | 24 \| 69 | 31 \| 69,5 | — | 193 px |

Quelle im Quelltext: `spiel/stuecke/stadt-daten.js:479` (`versatz: {2:{dx:4,dy:9}}`),
`:592` (`versatz: {2:{dx:9,dy:-3.5}}`), `:444` (`versatz: {2:{dx:7,dy:0.5}}`).

**Der Ziehbrunnen ist der Fund, die anderen beiden sind es nicht.** Ein
Fasslager wird abgerissen und neu gestellt; eine Braupfanne ist Gerät und steht,
wo Platz ist. **Ein Brunnen ist ein Loch im Boden.** Er wandert in 1600 aus der
linken oberen Hofecke in die Hofmitte und steht 1884 wieder in der Ecke — im
Bild nachgesehen und nebeneinandergelegt (`brunnen-wanderung.png`, drei Epochen
im selben Ausschnitt): man sieht es sofort. Wer 1350 spielt und in 1600 kommt,
sieht seinen Brunnen umziehen und drei Jahrhunderte später zurückziehen.

Der Grund steht im Datenkommentar und ist ein guter Grund — in 1600 standen
Waschhaus und Hopfenlager davor, „von seinen 9.200 eigenen Pixeln waren noch 824
zu sehen". **Nur ist die Antwort auf „mein Kauf ist verdeckt" nicht, den Brunnen
zu verlegen, sondern das zu verlegen, was davorsteht.** Waschhaus und
Hopfenlager gibt es nur in Epoche II; sie sind die beweglichen Teile, nicht er.

Das ist ein **Riss an der härtesten Einzelforderung**, aber ein einzelner und ein
kleiner: 36 von 39 mehrfach vorkommenden Dingen stehen fest, die Stadt selbst
steht vollständig fest, und die zwei anderen Wanderer sind zu rechtfertigen.
Rohdaten `ortstreue.json`.

---

## 5 — KANN MAN ES SPIELEN?

Gespielt mit `spielen.mjs`: **jeder Zug ist ein echtes `page.click` auf den
sichtbaren Knopf**, kein `el.click()` und kein Aufruf ins Spiel hinein. Was
verdeckt liegt, scheitert hier genau so, wie es beim Menschen scheitert.
Fenster 1366×768, alle vier Epochen, je 120 Züge, alles durch das Messfenster.

| Epoche | Züge | gescheiterte Klicks | folgenlose Klicks | Bauten entstanden | verschiedene Zugschlüssel | Ende | Seitenfehler |
|---|---|---|---|---|---|---|---|
| 1350 | 120 | **0** | **0** | 6 | 166 | 1351/28 | 0 |
| 1600 | 120 | **0** | **0** | 4 | 147 | 1601/29 | 0 |
| 1884 | 120 | **0** | **0** | 4 | 150 | 1885/29 | 0 |
| 1970 | 120 | **0** | **0** | 3 | 217 | 1971/29 | 0 |

**480 Mausklicks, 0 gescheitert, 0 ohne Wirkung, 0 Konsolenfehler,
`BRAUHAUS.lage` durchgehend 0.** Jeder Klick hat Kasse, Woche, Bautenzahl oder
Chronik bewegt. Das ist die Bedingung, an der dieser Lauf laut `MESSLATTE.md`
am wahrscheinlichsten scheitert — hier scheitert er nicht.

**Der Bauhof ist echt bedienbar und tut, was er sagt.** In 1350 habe ich
Grutkammer, Gärbottiche, Ochsenstall, Gewölbekeller, Ziehbrunnen und
Fassschuppen gekauft und jeder erschien als Bild im Hof. Die Verbliste ist je
Epoche eine andere: 1350 Grut/Bottiche/Ochse, 1600 Waschhaus/Kontor/Rossmühle,
1884 Hopfenlager/Pferdestall/Mälzereiturm, 1970 Waage/Verwaltung. *(Die zweite
Latte war nicht mein Auftrag; ich habe nichts gesehen, was den eingetragenen
ρ-Zahlen widerspricht.)*

**Ein zweiter, gieriger Durchlauf** (alles kaufen, was zu kaufen ist, ohne auf
die Kasse zu sehen) hat in 1350 die Startkasse von 112 Pf in **Woche 1** auf
22 Pf gebracht und danach 41 von 95 Wochen auf null gehalten — ohne Absturz und
ohne Sperre. Dass man sich in der ersten Woche ruinieren kann, ist eine
Eigenschaft, keine Panne; ich nenne es, weil es zeigt, dass die Bauknöpfe
wirklich unwiderruflich sind.

**Ein Befund über die Bedienbarkeit, der nicht DER STADT gehört, aber beim
Spielen ständig auffällt:** von den 58–88 Knöpfen, die zu jedem Zeitpunkt als
aktiv im DOM stehen, sind nur **35–50 wirklich mit der Maus zu treffen** — rund
zwei Fünftel liegen in zugeklappten fremden Brettern. Das ist der schon
dokumentierte Befund über `disabled`; er trifft `fuhre:`, `name:` und `erbe:`,
und von den unerreichbaren gehört DER STADT genau einer.

> **Ein Fehler an meinem eigenen Gerät, den ich melde, weil er dieselbe Sorte
> ist, gegen die dieser Lauf sonst prüft:** mein erstes Aufbauskript nahm den
> ersten Knopf mit dem Präfix `stadt:bau:` — und das ist
> **`stadt:bau:seite`, der Seitenumschlag des Bauhofs, kein Bau**. Es hat
> zweihundertmal die Seite umgeblättert, dabei nie etwas gebaut und dabei nie
> gescheitert. Der Lauf wurde verworfen und das Skript trägt den Ausschluss
> jetzt im Quelltext. Wer `data-zug`-Präfixe filtert, prüft, ob ein
> Bedienknopf darunter liegt.

---

## 6 — LATTE 1: DER BLINDVERGLEICH GEGEN `zielbild/`

Aufgenommen mit `werkbank/schuss.mjs` bei **2752×1536**, dem Format der
Zielbilder — ein Blindvergleich taugt nur bei gleichem Format. Vier Epochen,
`?saat=1350`, **„keine Fehler auf der Seite" in allen vieren**. Dann jedes Paar
im Ganzen und im Hofausschnitt nebeneinandergelegt.

### 6.1 Was der laufende Bildschirm gewinnt

* **Der Ort hält.** Kirchturm, Stadtmauer, Gasthof Lindenhof, Brücke, Bach,
  Mühlrad, die Laterne an der Gasse, das Marktzelt unten links, sogar Schwein
  und Gänse stehen in allen vier Epochen an derselben Stelle wie im Zielbild.
  Die Platte ist erkennbar dieselbe Welt wie das Zielbild, nur mit
  **ausgeräumtem Hof** — die Pfütze und die Reifenspuren sind der leere
  Spielplatz, auf den gebaut wird. Das ist die richtige Zerlegung.
* **Der Hof füllt sich wirklich.** Nach drei Braujahren in 1350 stehen
  Grutkammer, Gärbottiche, Ochsenstall, Gewölbekeller und Küferei im Bild,
  in derselben Hand gezeichnet, mit derselben Palette, derselben Strichstärke,
  demselben isometrischen Raster.
* **Das Licht stimmt.** Der Schlagschatten der Hofbauten fällt nach links, und
  auf der Platte werfen Mauerturm, Bäume und Bank ebenfalls nach links. Kein
  Bau steht in einer zweiten Sonne.
* **Die Schrift ist echte Schrift.** Wo das Zielbild zerfallene Buchstaben hat
  („GEGR. 1356" in 1884 gegen „GEGR. 1350" in 1600 — das Zielbild widerspricht
  sich selbst), steht im Spiel durchgehend 1350, und zwar gesetzt.
* **1884 ist im Hof dichter als das Zielbild.** Eiskeller mit Grashügel,
  Laderampe, Waschhaus, Eisblöcke auf dem Schlitten, dazu Schornstein,
  Sudhaus und Gärtanks an genau den Stellen des Zielbilds.

### 6.2 Wo das Zielbild noch gewinnt — und warum es diese Runde nicht betrifft

Ehrlich und ohne Beschönigung: **in 1350 und 1600 wählt mein Auge das
Zielbild**, und zwar aus zwei Gründen, die beide nichts mit der Bildqualität
zu tun haben:

1. **Komposition.** Das Zielbild hat einen Blickpunkt — den Kessel mit den
   zwei Brauerinnen — und eine ruhige Fassreihe darum. Der gebaute Hof füllt
   die obere Hälfte und lässt die untere leer; das Wirtshausschild sitzt innen
   statt am Tor.
2. **Die Bretter.** Auch zugeklappt decken sie **19,6–20,4 % der Bühne** ab
   (Rasterprobe, 66.048 Punkte je Epoche). Ein Mockup ohne Bedienoberfläche
   gegen ein Spiel mit Bedienoberfläche gewinnt diesen Punkt immer.

**Beides ist nicht die Arbeit dieser Runde.** Die Frage, die diese Runde
gestellt hat, lautet: *hat die WebP-Umstellung dem Bild geschadet?* Darauf
antworte ich mit einem A/B am selben Baum, und die Antwort ist ein klares
**nein** — siehe Abschnitt 1. Ich kann die beiden Fassungen bei dreifacher
Vergrößerung der schlechtesten Kachel nicht auseinanderhalten, es gibt keinen
Farbsaum, kein Banding, keine zerfressene Kante, keinen Halo an der
Halbtransparenz und keinen Farbstich.

### 6.3 Der gebaute Hof, Epoche für Epoche

Weil das Zielbild einen **gehenden Betrieb** zeigt und die Platte einen leeren
Hof mit einer Pfütze, ist ein Vergleich in Woche 1 unfair. `aufbauen.mjs` hat
deshalb jede Epoche gespielt, bis nichts mehr zu bauen war, und dann
aufgenommen — mit der Maus, ohne Eingriff, alles durch das Messfenster:

| Epoche | gebaut | Ende | Bauten im Hof | `BRAUHAUS.lage` | Konsolenfehler |
|---|---|---|---|---|---|
| 1350 | 5 (Grutkammer, Gärbottiche, Ochsenstall, Gewölbekeller, Küferei) | 1353/13 | 9 | 0 | 0 |
| 1600 | 6 (Gärbottiche, Waschhaus, Kontor, Rossmühle, Hopfenlager, Pferdestall) | 1603/13 | 12 | 0 | 0 |
| 1884 | 5 (Kontor, Hopfenlager, Pferdestall, Mälzereiturm, Flaschenhalle) | 1887/11 | 12 | 0 | 0 |
| 1970 | 4 (Fahrzeugwaage, Mälzereiturm, Verwaltungsbau, Neues Sudhaus) | 1973/9 — **Partie zu Ende** | 10 | 0 | 0 |

**Die Partie endet, und sie endet gut.** In 1970 lief mein Aufbaulauf in das
Schlussblatt: *„DER HOF IST GESCHLOSSEN"*, darunter „DIE, DIE ES GEFÜHRT HABEN"
mit drei Namen und Amtszeiten und „WIE DAS AUFTRAGSBUCH LEER WURDE" mit elf
Zeilen — *„1972 Pfarrschenke St. Michael — niemand hat sie genommen"*,
*„1973 Schenke am Tor — der Gegner stand schon da"*. Und darunter: *„Von vorn
anfangen — dieselbe Stadt, andere Wirte."* Das ist ein Schluss, kein
Abbruch, und der Satz sagt genau das, worauf dieses ganze Stück gebaut ist.

**1884 hält dem Zielbild stand** und geht im Gesamtbild darüber hinaus: der
Schornstein, das Sudhaus mit Kupferhaube, die Gärtanks, der Eiskeller mit
Grashügel, der Mälzereiturm, dazu Bahnhof mit Zug, Brauerei Adler und die halbe
Stadt dahinter. Dort würde ich blind nicht mehr sicher das Zielbild wählen —
obwohl auch dort das vordere Hofdrittel zu **0,0 %** bebaut ist. Es gewinnt
also *trotz* Auflage 6, weil um den Hof herum so viel passiert.
**1350 und 1600 gewinnt das Zielbild** — und zwar an genau der Stelle, die
Auflage 6 benennt: im vorderen Drittel des Hofes, das leer bleibt.

---

## 7 — AUFLAGEN

Jede mit der Zahl, die sie belegt, und der Stelle im Quelltext.

### Auflage 1 — Der Ziehbrunnen muss stehen bleiben

**Zahl:** 110 px nach rechts und 138 px nach unten in 1600, und in 1884 wieder
zurück (Fußpunkt 21|62 → 25|71 → 21|62 in Prozent der Bühne; gemessen mit
`ortstreue.mjs`, Rohdaten `ortstreue.json`). Alle 28 Orte und 36 von 39
mehrfach vorkommenden Dingen stehen fest — dieses eine nicht.

**Stelle:** `spiel/stuecke/stadt-daten.js:479` — `versatz: { 2: { dx: 4, dy: 9 } }`
im Eintrag `brunnen`.

**Warum es zählt:** *„Die Stadt muss über 620 Jahre wachsen, ohne den Ort zu
wechseln"* ist nach `gauntlet/MESSLATTE.md` die härteste Einzelforderung des
Auftrags. Ein Fasslager wird abgerissen und neu gestellt, eine Braupfanne ist
Gerät — beide dürfen wandern. **Ein Brunnen ist ein Loch im Boden.**

**Der Grund für die Verschiebung ist gut und die Lösung trotzdem falsch herum:**
laut Datenkommentar waren in 1600 von 9.200 eigenen Bildpunkten des Brunnens nur
noch 824 zu sehen, weil Waschhaus und Hopfenlager davorstanden. Beide gibt es
**nur in Epoche II** (`von: 2, bis: 2` bzw. `bis: 3`) — sie sind die beweglichen
Teile. Zu verlegen ist, was davorsteht, nicht der Brunnen.

### Auflage 2 — Der Reiter darf die lebende Kennzahl nicht abschneiden

**Zahl:** **37 von 51** abgeschnittenen Kästen des ganzen Spiels sind Reiter DER
STADT (9/10/9/9 je Epoche bei 1366×768). Es fehlen bis zu **177 px** Text, und
er steht nur noch im `title` — je Epoche **31–36** STADT-Elemente mit unsichtbarem
Titeltext. Auf der Entwurfsleinwand 2752×1536 sind es **48** Kästen, bei
1920×1080 **53**; es ist also kein Kleinbildschirm-Effekt.

**Stelle:** `spiel/stil/stadt.css:255–264` (`.knopf.stadt-reiter .zahl`:
`width: 0; min-width: 100%; overflow: hidden; text-overflow: ellipsis`) in
Verbindung mit `:226` (`max-width: calc(var(--s) * 420)`) und `:239`
(`overflow: hidden` am Reiter).

**Der eine Fall, der aus einer Kürzung eine Falschangabe macht:** in 1884 steht
auf dem Reiter DIE HÄUSER **`wollen 14…`**, während der wirkliche Wert
**`wollen 146 · im Keller liegen 11 hl`** ist. Eine gekürzte Zahl liest sich wie
eine vollständige. Dasselbe bei `11 von 135 h…` (die Einheit *und* „11 reif"
fehlen) und `0,0 von 60 hl…` („0 von 10 Halten" fehlt).

**Und die Begründung der Regel trägt nicht:** sie opfert die Zahl, um den Namen
des Bretts zu retten — auf der Entwurfsleinwand werden aber **beide**
geschnitten (acht Überschriften und vier Kennzahlen in 1884). Wenn ohnehin
gekürzt wird, gehört die Zahl geschützt und nicht der Name: „DER EISKELLER"
lässt sich aus „DER EISKEL…" erraten, „146" nicht aus „14…".

*Vorschlag, der nichts anderes bewegt: die Kennzahl umbrechen statt kürzen
(zwei Zeilen), oder die Reiterzeile rollbar machen statt `overflow: hidden`.
Die Aufsicht führt diesen Punkt bereits als „37 Reiter-Kästen … berührt mehr
als ein Stück" — der Kasten ist DER STADT, der Inhalt kommt von den anderen.*

### Auflage 3 — Eine Ortsmarke DER STADT ist bei 1366×768 nicht anklickbar

**Zahl:** `stadt:marke:fuhre-bahnhof`, 1884, Fenster 1366×768: 24×24 px, Mitte
von einem fremden `SPAN.wort` überdeckt, echtes `page.click` läuft in den
Zeitablauf. Bei 2752×1536 nicht. Es ist der **einzige** der 35 (1350) bzw.
42 (1884) unerreichbaren aktiven Knöpfe, der DER STADT gehört.

**Stelle:** die Marken werden in `spiel/stuecke/stadt.js` gesetzt
(`stadt:marke:*`, Größe und Anker über `BRAUHAUS.orte.setze`); die Kollision
entsteht mit der Beschriftung eines Nachbarn im selben Bereich.

### Auflage 4 — `bild/name/` ist von der Umstellung nicht erfasst

**Zahl:** 11 PNG in `bild/name/` und `bild/gegner/` mit **4,4 MB** auf der
Platte; 1600 lädt davon 1,14 MB (`name/schild2.png` 683 kB,
`gegner/hof2.png` 489 kB). 1600 hat bis zur Obergrenze von 8 MB nur noch
**0,62 MB** Luft.

**Stelle:** die vier Dateien in `spiel/bild/name/`. Nach `spiel/LIESMICH.md`
gehört *„`bild/**` (ganz)"* DER STADT; `bild/gegner/` ist in derselben Tabelle
zusätzlich dem GEGNER zugeschrieben und daher strittig, `bild/name/` nicht.

**Warum es eine Auflage und kein Veto ist:** das Gewichtsveto ist bestanden.
Es geht um den Abstand: 0,62 MB Luft in der schwersten Epoche, und die zweite
Platte (Vorgriff auf die nächste Epoche) kostet allein 1,9–2,3 MB.

### Auflage 5 — „STADT ZEIGEN" tut nichts, solange nichts offen ist

**Zahl:** `stadt:alles-zuklappen`, Höhe **exakt 24 px** (auf der Latte, nicht
darüber). Bei frisch geladener Seite scheitert ein echter Klick in 1350 und
1884; ist ein Brett offen, greift er und schließt es (offene Reiter 1 → 0).

**Stelle:** derselbe Reiterstreifen, `spiel/stil/stadt.css:210–217`
(`.stadt-reiterzeile { overflow: hidden }`) — bei zugeklappten Brettern liegt
der Reiter außerhalb des sichtbaren Streifens.

**Gering, aber es ist ein sichtbarer Knopf, der nichts tut** — genau die Sorte,
die ein Spieler für kaputt hält.

### Auflage 6 — Das vordere Drittel des Hofes bleibt leer

**Das ist der Grund, aus dem das Zielbild den Blindvergleich noch gewinnt, und
er ist messbar, nicht Geschmack.**

**Zahl:** Alle Fußpunkte aller Hofbauten liegen in einem Band von **60,0 % bis
73,5 %** der Bühnenhöhe — in *jeder* der vier Epochen (`ortstreue.json`):

| Epoche | Fußpunkte y in % | Spanne |
|---|---|---|
| 1350 | 61 · 62 · 68,5 · 69 | 8 |
| 1600 | 61 · 69 · 69,5 · 70 · 70,5 · 71 | 10 |
| 1884 | 60 · 62 · 65 · 68 · 68,5 · 70 · 73,5 | 13,5 |
| 1970 | 60 · 63 · 65 · 68 · 68 · 70 | 10 |

Der Hof reicht aber bis an die vordere Mauer bei rund **85 %**. Nachgemessen im
gebauten Bild (was gegenüber der reinen Platte verändert ist, zeilenweise über
das Hoffeld gezählt):

| | hinteres Drittel | mittleres | **vorderes Drittel** |
|---|---|---|---|
| 1350, nach 3 Braujahren und 5 Bauten | 73,2 % | 30,3 % | **0,2 %** |
| 1600, nach 3 Braujahren und 6 Bauten | 82,8 % | 42,9 % | **3,6 %** |
| 1884, nach 4 Braujahren und 5 Bauten | 89,4 % | 49,6 % | **0,0 %** |
| 1970 | *nicht messbar* — die Partie war zu Ende und das Schlussblatt lag über dem Bild |

**Das vordere Drittel des Hofes ist unberührte Platte** — dieselbe Pfütze, mit
der die Partie anfängt, liegt nach dem sechsten Kauf noch da. Im Zielbild trägt
genau dieser Streifen die Fassreihen, die Bank und die abfahrende Fuhre; er ist
dort der belebteste Teil des Bildes.

**Stelle:** `spiel/stuecke/stadt-daten.js` — die `ort`/`dy`-Angaben aller
31 Einträge; `spiel/kern/orte.js` hat Orte bis y 96 %, aber kein Hofbau
benutzt einen unterhalb von 73,5 %.

**1970 konnte ich nicht messen**, weil der Aufbaulauf dort im Jahr 1973 endete
und das Schlussblatt („DER HOF IST GESCHLOSSEN") die Bühne bedeckte. Die
Fußpunkte der 1970er Bauten liegen aber im selben Band (60–70 %), es gibt also
keinen Grund, dort ein anderes Ergebnis zu erwarten.

**Warum es die erste Latte entscheidet:** ein Spiel, das nach sechs Käufen die
untere Hälfte seines Spielplatzes leer lässt, sieht neben einem Bild, in dem
sie voll ist, immer ärmer aus — unabhängig davon, wie gut die einzelnen Bauten
gezeichnet sind. Und sie **sind** gut gezeichnet; das ist ja der Punkt.

---

## 8 — WAS ICH NICHT PRÜFEN KONNTE, UND WARUM

1. **Die zweite Latte (ρ).** Ausdrücklich nicht mein Auftrag; die Aufsicht hat
   sie an diesem Commit selbst gemessen. Ich habe in 480 gespielten Zügen
   nichts gesehen, was den eingetragenen Zahlen widerspricht. *Eine
   Beobachtung, die ich melde, ohne sie zu einem Befund zu machen:* ein
   gieriger Spieler steht in 1350 nach der ersten Woche bei 22 Pf und danach
   41 von 95 Wochen auf null — die Kennzahl „Jahre unter 1×" hängt in dieser
   Epoche sehr stark an der Spielweise, nicht nur an der Laufzeit.
2. **Die dritte Latte (Ton).** Nicht beauftragt, kein fremdes Ohr zur Hand.
   Gemessen ist nur, **wann** der Ton lädt (nach dem ersten Klick, nie davor).
3. **Der Epochenwechsel im laufenden Spiel.** Epoche I reicht nach
   `spiel/kern/welt.js:30` von 1350 bis 1516; eine Partie trägt 3–14 Braujahre.
   **Ein Spieler erlebt den Wechsel also gar nicht** — die vier Epochen werden
   über `?epoche=` betreten. Die Brunnenwanderung aus Auflage 1 sieht deshalb
   nur, wer die Epochen nebeneinanderlegt — was Latte 1 genau tut.
4. **Ob die Umstellung dem PNG gegenüber wirklich nichts verloren hat, konnte
   ich nur prüfen, weil unter `/tmp/messstand/3e6d08c/` noch ein alter
   Messstand mit den 32 PNG lag.** Das ist Zufall und überlebt den nächsten
   Container-Reset nicht. Wer den A/B wiederholen will, braucht die PNG von
   irgendwoher — `ab-webp-aufsetzen.sh` sagt es und bricht sonst ab, statt
   still etwas anderes zu messen.
5. **Die Epochenplatten** waren nie PNG und sind keine WebP; an ihnen war
   nichts zu prüfen. Sie sind mit 4,19 MB fast so schwer wie alle 32 Hofbilder
   zusammen (4,56 MB) und der eigentliche Brocken des Gewichts.

---

## 9 — URTEIL

### Je Latte

| | Urteil | worauf es beruht |
|---|---|---|
| **Latte 1 — Das Bild** | **BESTEHT MIT AUFLAGE** | Die WebP-Umstellung, die diese Runde zu prüfen aufgab, kostet **nichts Sichtbares**: A/B am selben Baum, maxdiff **17–22 von 255** auf 3–54 Punkten von 4,2 Mio, **0 Punkte über 32**, kein Farbstich (mittlere Abweichung < 0,02 Tonwerte), Alpha in 32 von 32 Dateien byteweise gleich. Bei dreifacher Vergrößerung der schlechtesten Kachel nicht auseinanderzuhalten. — Der Ort hält: **0 von 28 Orten** bewegt. Offen bleiben **Auflage 1** (der Ziehbrunnen wandert und kommt zurück) und **Auflage 6** (das vordere Drittel des Hofes bleibt leer, 0,2 % bzw. 3,6 % verändert) — an letzterem hängt, dass das Zielbild in 1350 und 1600 noch gewinnt. |
| **Latte 2 — Das Spiel** | *nicht geprüft* | Ausdrücklich nicht mein Auftrag. Nichts gesehen, was den Zahlen der Aufsicht widerspricht. |
| **Latte 3 — Der Ton** | *nicht geprüft* | Nicht beauftragt. Gemessen ist nur, dass er erst nach dem ersten Klick lädt. |
| **Latte 4 — Die Lesbarkeit** | **BESTEHT MIT AUFLAGE** | Schrift und Zielfläche sind erledigt: **0–1 eigene Textknoten unter 12 px** je Epoche, **0 von 92 eigenen Knöpfen unter 24 px**. Gerissen ist der abgeschnittene Text: **37 von 51 Kästen des ganzen Spiels** sind seine Reiter, auf **jeder** gemessenen Fenstergröße, und was fehlt, ist die lebende Kennzahl (Auflage 2). Dazu ein unerreichbarer Knopf (Auflage 3) und einer, der nichts tut (Auflage 5). |
| **Sperrliste — Fakten** | **KEIN FUND** | Offene Pfanne statt Blase (mit zwei Brauerinnen, was zusätzlich `PRUEFUNG.md` §1.2 A11 beantwortet) · kein Emailschild vor 1890 · keine Bahn vor 1835 · Hektoliter erst ab 1872 · Währung nach Jahr · Flaschen von 1884 ohne Kronkorken · genietete Tanks, wie beschriftet. |
| **Sperrliste — Das Gewicht** | **BESTEHT** | **6,00 / 7,38 / 6,33 / 4,28 MB** je Epoche vor dem ersten Klick, alle vier unter 8 MB, mit eigenem Gerät und zweimal reproduziert. Der Nachschlag nach dem Klick ist zu 90 % Ton und gehört DEM KLANG. Auflage 4 betrifft nur den Abstand (0,62 MB in 1600). |
| **Spielbarkeit** | **BESTEHT** | **480 echte Mausklicks in vier Epochen: 0 gescheitert, 0 folgenlos, 0 Konsolenfehler, `BRAUHAUS.lage` durchgehend 0.** 17 Bauten wirklich gekauft und im Bild erschienen. |

### Als Ganzes

# BESTEHT MIT AUFLAGE

**Sechs Auflagen**, nummeriert in Abschnitt 7. Keine davon ist ein Veto, und
keine betrifft die Arbeit, die diese Runde gemessen hat: **die WebP-Umstellung
ist sauber, und das Gewichtsveto ist gefallen.** Beides habe ich mit eigenen
Geräten und auf eigenen Wegen nachgestellt und komme auf dieselben Ziffern wie
die Aufsicht (7,38 MB) — ohne ihre Zahl vorher zu kennen.

**Die zwei, an denen wirklich etwas hängt:**

* **Auflage 2** (der Reiter schneidet die Kennzahl ab) — weil `wollen 14…`
  statt `wollen 146` keine Kürzung mehr ist, sondern eine falsche Ablesung, und
  weil die Rettung nur noch im Zeigertitel steht.
* **Auflage 6** (das vordere Drittel des Hofes bleibt leer) — weil das die
  einzige gemessene Ursache dafür ist, dass das Zielbild in 1350 und 1600 noch
  gewinnt. In 1884 gewinnt es nicht mehr.

**Was ich ausdrücklich lobe, weil es selten ist:** in 480 gespielten Zügen ist
kein einziger Klick ins Leere gegangen, und die Stadt steht in allen vier
Epochen an derselben Stelle — 0 von 28 Orten haben sich bewegt. Der Auftrag
nennt das seine härteste Einzelforderung; sie ist im Fundament erfüllt und
scheitert nur an einem einzigen Brunnen.
