# DER SUD — Urteil des blinden Kritikers, Welle 4

## URTEIL: **BESTEHT MIT AUFLAGE**

Das Stueck hat, was der Auftrag verlangt: eine Entscheidung ueber das Bier, die
Geld kostet, die unwiderruflich ist und die messbar etwas aendert. Das Siegel
haelt — **106 Rueckwege probiert, 58 davon wirklich ausgeloest, 0 fuehrten
zurueck**, darunter jeder Weg, an dem eine milde Pruefung vorbeigeht
(zwangsweise aktivierter Knopf, synthetisches Klickereignis). Es faellt nicht
durch.

Es besteht aber nicht ohne Auflage. Zwei Zahlen tragen das:

* **1350, Kesselzettel allein gespielt (Vorgabestand, Brett nie
  aufgeschlagen):** das Haus hatte in **34 von 286 Wochen** die 78 Pf fuer den
  Hopfenbrief. Bedienbar war der Knopf in **5** davon. In den uebrigen **29**
  stand `data-soll-aus="0"` — das Spiel haette den Kauf erlaubt — und der
  Zettel war trotzdem nicht auf dem Bildschirm: `display: none`, Rechteck
  `0 × 0`. Nicht abgeschaltet, nicht von einem fremden Brett verdeckt: **weg.**
* **1350, beide Wege zusammen (Zettel *und* jede Woche das Brett
  aufgeschlagen):** eine Bierentscheidung mit **mehr als einem Knopf** stand in
  **5 von 256 Wochen (2,0 %)** — alle fuenf im Jahr 1350. In den 250 uebrigen
  Wochen hatte der Spieler auf die Bierfrage genau **einen** druckbaren Knopf.

Die epocheneigene Festlegung von 1350 ist damit eine Entscheidung der ersten
Woche oder gar keine. Zum Vergleich, dieselbe Messung in den anderen Epochen:
**1600 100 %**, **1884 40,5 %**, **1970 22,0 %** der Wochen mit mehr als einem
druckbaren Knopf. Das Stueck kann es also — in 1350 tut es das nicht.

---

## Messbedingungen

| | |
|---|---|
| Gemessener Commit | **2953242** |
| Hafen | 127.0.0.1:**8911** (eigener Messstand aus `git archive 2953242`) |
| Saat | 1350 · Schirm 1920 × 1080 |
| Werkzeug | Playwright/Chromium, echte Mausklicks (`page.mouse.click`) |
| Belege | `werkbank/schuss/sud-blind4/` (`erkundung`, `partie`, `auswertung`, `siegel`, `siegel2`, `ratsche`, `rettung`, `zweipartien`) |

Zwischen `2953242` und dem spaeteren HEAD `6391f3b` aenderten sich nur
`spiel/kern/ton.js` und zwei `ton/klang/*.mp3` — **keine Datei des SUD**. Die
Zahlen gelten fuer den SUD-Stand, der auch jetzt im Baum liegt. 8899 und 8900
wurden nicht benutzt (dort schrieben andere Builder bzw. lag der eingefrorene
Stand eines anderen Kritikers).

---

## 5. IST ES HEIL? — ja

| Epoche | Jahr | `BRAUHAUS.lage.length` | Konsolenfehler | Knoepfe | aktiv | aktiv+treffbar |
|---|---|---|---|---|---|---|
| 1 | 1350 | **0** | **0** | 102 | 82 | 46 |
| 2 | 1600 | **0** | **0** | 112 | 83 | 48 |
| 3 | 1884 | **0** | **0** | 116 | 87 | 47 |
| 4 | 1970 | **0** | **0** | 107 | 82 | 44 |

Ueber alle Partien zusammen (4 × 14 Jahre sorgfaeltig, 4 × Siegelpruefung,
4 × Ratsche, 4 × Rettung, 12 Vergleichspartien): **0 `pageerror`, 0
`console.error`**, `lage` durchgehend 0.

---

## 2. HAELT DAS SIEGEL? — ja, auf jedem geprueften Weg

Drei unabhaengige Messreihen, zusammen **106 Rueckwege, davon 0 erfolgreich.**
Belege `siegel.mjs`, `siegel2.mjs`, `ratsche.mjs`.

Damit niemand die Zahl fuer groesser haelt, als sie ist — was aus den 106
wirklich geschah:

| | Anzahl | fuehrten zurueck |
|---|---|---|
| **wirklich ausgeloest** (echter Mausklick oder synthetisches Ereignis ging durch) | **58** | **0** |
| vom Spiel abgeschaltet (`disabled`, gar nicht erst gedrueckt) | 25 | 0 |
| Knopf nicht getroffen (Brett war zu) | 17 | 0 |
| Knopf gar nicht vorhanden | 6 | 0 |

Die 58 wirklich ausgeloesten sind der Kern: darunter jeder Versuch mit
zwangsweise aktiviertem Knopf und jedes synthetische `MouseEvent`.

Je Festlegung geprueft:

1. Brettknopf der Vorgabe, **echter Mausklick** → `abgeschaltet`
2. derselbe Knopf **zwangsweise aktiviert** (`disabled = false`), echter Mausklick → **wirkungslos**
3. derselbe Knopf, **synthetisches `MouseEvent('click')`** → **wirkungslos**
4. **jede andere Option derselben Achse**, zwangsweise aktiviert → wirkungslos
5. Zettelknopf `sud:zettel-wechsel-frei` → betrifft nach dem Siegel nur noch die *andere* Achse
6. Zettelknopf `sud:zettel-wechsel-kauf` → dito
7. nach **sechs Wochen** Weiterspielen → haelt
8. nach **zwoelf weiteren Jahren** (Erbfall faellt hinein) → haelt
9. nach **Rohstoffmangel** (`rohstoff = 0`, Notsud faehrt nach Vorgabe) → haelt

Der Riegel sitzt nicht nur in der Oberflaeche, sondern im Zug selbst:
`spiel/stuecke/sud.js:937` — `waehle()` beginnt mit
`if (verdraengt(a, o)) return;`. Deshalb bleiben auch der zwangsweise
aktivierte Knopf und das synthetische Ereignis folgenlos. **Das ist der zweite
Weg, an dem eine zu milde Pruefung vorbeigeht — er ist zu.**

### Die Ratsche, bei voller Kasse gemessen (`ratsche.mjs`, Kasse 5.000.000)

| Epoche | gekauft | danach gesperrt (*„das Siegel liegt darauf"*) | danach noch offen | Rueckwege / zurueck |
|---|---|---|---|---|
| 1350 | `sud:wuerze:brief` 78 Pf | `grut`, `sack` | — | 6 / **0** |
| 1600 | `sud:gaerung:keller` 260 fl | `ober` | — | 3 / **0** |
| 1884 | `sud:kaelte:maschine` 9.800 M | `natureis`, `warm` | — | 6 / **0** |
| 1884 | `sud:hefe:reinzucht` 3.400 M | `betrieb` | — | 3 / **0** |
| 1970 | `sud:fuehrung:labor` 42.000 DM | `erfahrung` | **`rechner` bleibt OFFEN** | 3 / **0** |
| 1970 | `sud:fuehrung:rechner` 118.000 DM | `erfahrung`, `labor` | — | 6 / **0** |
| 1970 | `sud:behandlung:pasteur` 74.000 DM | `natur`, `schoenen`, `filter` | — | 9 / **0** |

Die Ratsche tut genau, was am Brett steht: nach `labor` ist die Vorgabe zu und
`rechner` offen; nach `rechner` ist auch `labor` zu. `schuettung` (1600) hat
keine unwiderrufliche Option — und behauptet es auch nicht.

**Latte 2 (b) teilweise erfuellt** — die Festlegungen gibt es und sie halten.
Dass eine gute Hand sie *nimmt*, ist fuer 1350 und 1884 belegt (Punkt 4:
1350 Partie B braut 919 statt 0 Fass, 1884 Partie B endet mit `lager` Stufe 2
und ohne eine einzige Rueckstufung). Fuer **1600 ist es nicht belegt**: dort
endete die Partie mit dem Felsenkeller drei Jahre frueher und mit 40 % weniger
Fass als die kostenlose Abkuerzung.

---

## 1. + 3. WIRD ETWAS ENTSCHIEDEN, UND IST ES BEDIENBAR?

Sorgfaeltig gespielt heisst hier: jede Woche Fuhre laden und abschicken
(`fuhre:fuellen`, `fuhre:abschicken` am Wagenbrett), Rohstoff nachkaufen
(`fuhre:kauf:rohstoff` an der Anschlagtafel), Hefe fuehren
(`sud:zettel-anstich`), gesperrte Charge freigeben. Gemessen zu Wochenbeginn,
**jeder Knopf einzeln mit `elementFromPoint`** — nie der Mittelpunkt eines
Bretts.

### a) Am Kesselzettel, im Vorgabestand (`partie.mjs`, `lauf/s2-e*.json`)

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| gemessene Wochen | 286 | 256 | 148 | 125 |
| gespielte Jahre | 1350–**1364** (14) | 1600–**1614** (14) | 1884–1890 (6) | 1970–1975 (5) |
| Partie endete durch | — | — | `bank-verwertet` | `brauereisterben` |
| `sud:zettel-wechsel-frei` bedienbar | 179 (62,6 %) | 164 (64,1 %) | 107 (72,3 %) | 52 (41,6 %) |
| `sud:zettel-wechsel-kauf` bedienbar | **5 (1,7 %)** | 118 (46,1 %) | 61 (41,2 %) | **15 (12,0 %)** |
| **Latte 2 (a): beide zugleich bedienbar** | **5/286 = 1,7 %** | 118/256 = **46,1 %** | 61/148 = **41,2 %** | 7/125 = **5,6 %** |
| Wochen ohne jede bedienbare Bierwahl | 107 | 92 | 41 | 65 |

Die Epochen 3 und 4 erreichen die vierzehn Jahre in meiner Partie nicht: das
Haus faellt vorher, aus Gruenden ausserhalb dieses Stuecks. Die Prozentzahlen
beziehen sich auf die tatsaechlich gespielten Wochen.

### b) Warum die Knoepfe fehlen — und es ist NICHT ein fremdes Brett

`aktiv` und `treffbar` sind in allen Zaehlungen **gleich gross**. Das ist
Absicht des Stuecks: `schalte()` (`spiel/stuecke/sud.js:1791`) schaltet jeden
eigenen Knopf ab, den `elementFromPoint` nicht trifft. Verdeckung wird also in
`disabled` umgemuenzt. Erst `data-soll-aus` trennt „das Spiel sagt nein" von
„da ist nichts":

| Knopf | Epoche | bedienbar | Spiel sagt nein | **fremdes Brett darauf** | **Zettel gar nicht im Bild** |
|---|---|---|---|---|---|
| `sud:zettel-wechsel-frei` | 1350 | 179 | 0 | **0** | **107 / 286 = 37,4 %** |
| `sud:zettel-wechsel-frei` | 1600 | 164 | 0 | **0** | **92 / 256 = 35,9 %** |
| `sud:zettel-wechsel-frei` | 1884 | 107 | 0 | **0** | **41 / 148 = 27,7 %** |
| `sud:zettel-anstich` | 1970 | 69 | 3 | **0** | **53 / 125 = 42,4 %** |
| `sud:zettel-charge-frei` | 1970 | 17 | 0 | **0** | **17 / 34 = 50,0 %** |
| `sud:zettel-charge-schnitt` | 1970 | 17 | 0 | **0** | **17 / 34 = 50,0 %** |

**In keinem einzigen Fall lag ein fremdes Brett darauf.** Der Zettel ist selbst
nicht da: Klasse `sud-zettel amort beiseite`, `display: none`, Rechteck
`0 × 0` — direkt gemessen (`sb/zettelort.mjs`), in 1350 ab 1351/1 ueber viele
Wochen am Stueck, bei `Z.brettZu === true`, also im Vorgabestand.

Die Ursache ist die eigene Selbstsicherung: `taktZugeklappt()`
(`spiel/stuecke/sud.js:1817–1831`) laesst den Zettel acht Stellen am Sudhaus
durchgehen; findet `stelleZettel()` keine, an der **alle** eigenen Knoepfe
getroffen werden und **kein** fremder Zug begraben wird, geht der Zettel
`beiseite` — `.sud-zettel.beiseite { display: none; }`
(`spiel/stil/sud-zusatz.css:95`). Die Regel ist ehrlich („lieber kein Zettel
als drei Knoepfe, die keine sind"), die gemessene Folge ist, dass das Stueck im
Vorgabestand in **28–42 %** der Wochen vom Schirm verschwindet.

Wie oft das passiert, haengt davon ab, was der Spieler sonst tut: wird jede
Woche zusaetzlich DAS SUDHAUS auf- und zugeklappt, sinkt es in 1350 auf
**18/256 = 7,0 %** (`rettung.mjs`). Der Zettel setzt sich dann neu.

### c) Faengt das Brett auf, was der Zettel liegen laesst? — 1350 nein

`rettung.mjs` spielt sorgfaeltig und schlaegt in **jeder** Woche, in der der
Zettel nicht beide Wahlen hergibt, DAS SUDHAUS auf — mit dem Reiter, mit der
Maus, und wartet, bis der Rahmen der STADT es wirklich aufgeklappt hat.

Das ist die sauberste Zahl dieses Urteils, weil sie beide Wege zusammenfasst
und den Reiterklick wirklich abwartet:

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| gemessene Wochen | 256 | **271** | 116 | 123 |
| gespielte Jahre | 1350–1360 | 1600–**1614** (14) | 1884–1888 | 1970–1974 |
| Partie endete | `haus-verloren` | — | `bank-verwertet` | `brauereisterben` |
| Zettel `display:none` | 18 (7,0 %) | 21 (7,7 %) | 8 (6,9 %) | 7 (5,7 %) |
| beide Wahlen **am Zettel** | **5 (2,0 %)** | 130 (48,0 %) | 43 (37,1 %) | 21 (17,1 %) |
| Reiter brachte das Brett nicht auf | 1 von 251 | **0 von 141** | 2 von 73 | 1 von 102 |
| danach ≥ 2 Optionen **am Brett** | **0** | **141 (alle)** | 4 | 6 |
| danach genau **eine** Option | 250 | 0 | 67 | 95 |
| **ZUSAMMEN: mehr als ein Knopf erreichbar** | **5/256 = 2,0 %** | **271/271 = 100 %** | **47/116 = 40,5 %** | **27/123 = 22,0 %** |

* Der Reiter `stadt:reiter:sud-sud-brett` **funktioniert zuverlaessig** — er
  brachte das Brett in 250/251, 141/141, 71/73 bzw. 101/102 Versuchen auf.
  (Die frueheren 33–41 % in `lauf/br-e*.json` waren ein Fehler meiner
  Messung: 70 ms Wartezeit reichen nicht, der Rahmen der STADT entscheidet
  erst im naechsten Bild und `taktZugeklappt` laeuft alle 320 ms.)
* **1600 ist vorbildlich: in 271 von 271 Wochen stand eine Bierentscheidung
  mit mehr als einem Knopf bereit** — am Zettel in der Haelfte, ueber das
  Brett in der anderen Haelfte, und dort ausnahmslos.
* **1350 ist der harte Fall: fuenf Wochen in elf Jahren, alle fuenf im Jahr
  1350.** In den 250 uebrigen Wochen hatte der Spieler auf die Bierfrage genau
  einen druckbaren Knopf, weil `sud:wuerze:grut` laeuft (also abgeschaltet ist)
  und `sud:wuerze:brief` unbezahlbar bleibt.
* 1970 liegt bei 22 %, und das trotz zweier Achsen mit zusammen sieben
  Optionen — die Preise (26.000 bis 118.000 DM) stehen bei einer Kasse mit
  Median 4.037 DM meistens ausser Reichweite.

Am Brett gezaehlt (nur Wochen, in denen es offen lag; `lauf/br-e*.json`):

| Epoche | offene Brettwochen | ≥ 2 Optionen bedienbar |
|---|---|---|
| 1350 | 48 | **2 (4 %)** |
| 1600 | 108 | **101 (94 %)** |
| 1884 | 63 | **41 (65 %)** |
| 1970 | 47 | **10 (21 %)** |

Die laufende Option ist immer abgeschaltet (`sud:wuerze:grut` 48/48
`soll-aus`, `sud:schuettung:rein` 108/108, `sud:fuehrung:erfahrung` 47/47) —
das ist richtig so, aber es heisst, dass eine Achse mit zwei Optionen im
laufenden Spiel nur einen druckbaren Knopf hat.

### d) Was die Wahl kostet und was sie messbar aendert

| Epoche | Vorgabe | teure Festlegung | Preis | Unterschied am Schild |
|---|---|---|---|---|
| 1350 | Grut vom Grutamt — *hoechstens Grutbier* | Hopfenbrief | 78 Pf | *traegt Starkbier*, Haltbarkeit **×2**, +1 Wo. Gaerung, +2 Grut je Sud |
| 1600 | Obergaerig — *hoechstens Braunbier* | Felsenkeller | 260 fl | *traegt Maerzenbier*, Haltbarkeit ×1,6, +2 Wo. Gaerung |
| 1884 | Natureis — *traegt Exportbier* | Kaeltemaschine | 9.800 M | Haltbarkeit ×1,35 → **×1,6**, Gaerung +2 → +1 Wo., kein halber Gaerraum in warmen Wochen |
| 1884 | Betriebshefe — *hoechstens Lagerbier* | Reinzuchthefe | 3.400 M | *traegt Exportbier*, Haltbarkeit ×1,1 |
| 1970 | Nach Erfahrung — *hoechstens Pilsner*, Streuung ±6 % | Prozessrechner | 118.000 DM | *traegt Exportbier*, −1 Wo. Gaerung, **Streuung ±0 %** |
| 1970 | Naturtrueb — *hoechstens Pilsner* | Tunnelpasteur | 74.000 DM | *traegt Exportbier*, Haltbarkeit **×2**, −3,0 hl je Sud |

Preis in Muenze, Preis in Gaerzeit oder Ausbeute, Folge bis zum Wirt. Das ist
eine echte Entscheidung — **wenn** man an sie herankommt.

---

## Latte 2 (d) — Barschaft und Preis des naechsten sinnvollen Zuges

| Epoche | Startkasse | Preis am Zettel | Anteil | Kasse Median | Kaufknopf bedienbar |
|---|---|---|---|---|---|
| **1350** | **112 Pf** | **78 Pf** | **69,6 %** | **14 Pf** | **5 / 286 Wochen** |
| 1600 | 640 fl | 260 fl | 40,6 % | 312 fl | 118 / 256 |
| 1884 | 14.250 M | 3.400 M | 23,9 % | 4.843 M | 61 / 148 |
| 1970 | 86.000 DM | 26.000 DM | 30,2 % | 4.037 DM | 15 / 125 |

Die zu pruefende Zahl in 1350 bestaetigt sich, aber anders als vermutet:

* Der Kauf leert die Kasse **nicht** so, dass nichts mehr ginge — nach dem
  Siegel steht der Gaerraum zu 26 Pf am Zettel (gemessen: nach dem Hopfenbrief
  verschwinden `sud:zettel-wechsel-frei` und `-kauf` ganz, `sud:zettel-gaerraum`
  tritt an ihre Stelle). Das Brett raeumt sich nach der Festlegung nicht leer.
* Das Problem ist die **Gelegenheit**: das Haus hatte in **34 von 286 Wochen**
  die 78 Pf. Bedienbar war der Knopf in **5** davon — alle im Jahr 1350. In den
  uebrigen **29** Wochen war `data-soll-aus` = 0 (das Spiel haette den Kauf
  erlaubt) und der Zettel war trotzdem nicht im Bild. Nach Jahren aufgeteilt:
  1352 (3 Wochen), 1353 (6), 1354 (19), 1358 (1) — **jedes Mal Geld genug,
  jedes Mal kein Knopf.**

---

## 4. TRAEGT DIE PARTIE EIN EIGENES BIER? — ja, aber nur nach unten sichtbar

Dieselbe Epoche, dieselbe Saat 1350, dreimal gespielt, sonst identisch
(`zweipartien.mjs`): **V** = nichts angefasst, **A** = die kostenlose
Abkuerzung, **B** = die teuren Festlegungen.

### 1350

| | V (0 Pf) | A `wuerze:sack` (0 Pf) | B `wuerze:brief` (**78 Pf**) |
|---|---|---|---|
| Partie endete | **1353/13 `braurecht-entzogen`** | 1364 (14 Jahre) | 1364 (14 Jahre) |
| Sude **durch den Gaerkeller** | **0** | 221 | **270** |
| Fass gesamt gebraut | **0** | 781 | **919** |
| Haltbarkeit im Schnitt | 7 | — (Keller leer) | **14** |
| Guete | 86 | 100 | 100 |

Der schaerfste Einzelbefund fuer „aendert sich etwas": **im Vorgabestand geht
in 1350 kein einziger Sud durch den Gaerkeller** (`durch den Gaerkeller 0`,
`gesamtFass 0`). Grutbier hat keine Gaerwochen, also greift `sauge()` nicht.
Erst eine Entscheidung — auch die kostenlose — schaltet den halben Apparat des
Stuecks ueberhaupt ein. Und die Partie, die nichts entschied, verlor 1353 das
Braurecht, waehrend beide entscheidenden Partien vierzehn Jahre standen.

### 1600

| | V (0 fl) | A `schuettung:weizen` (0 fl) | B `gaerung:keller` (**260 fl**) |
|---|---|---|---|
| Partie endete | **1604/13 `reihe-gestrichen`** | 1614 (14 Jahre) | **1611/13 `reihe-gestrichen`** |
| Fass gesamt gebraut | 294 | **1.676** | 1.018 |
| Haltbarkeit im Schnitt | 12 | 14 | **19,75** |
| Guete | 76 | **98** | 60 |

Hier faellt die teure Festlegung gegen die kostenlose ab: der Felsenkeller
bringt die laengste Haltbarkeit (19,75), kostet aber +2 Wochen Gaerung und
damit Durchsatz — die Partie endete drei Jahre frueher und mit 40 % weniger
Fass als die kostenlose Abkuerzung. Das ist ein legitimer Zielkonflikt, aber
fuer **Latte 2 (b)** („Festlegungen, die eine gute Hand wirklich nimmt") heisst
es: in 1600 ist bei dieser Saat und dieser Spielweise **nicht** belegt, dass
eine gute Hand die 260 fl nimmt. Eine Saat, eine Spielweise — kein Beweis, aber
ein Grund nachzumessen.

### 1884

| | V (0 M) | A `kaelte:warm` (0 M) | B `maschine` + `reinzucht` (**13.200 M**) |
|---|---|---|---|
| Haltbarkeit im Schnitt | 17 | **1** | **29,78** |
| Sorten im Keller | `einfach` 16 + `lager` 24 | **`einfach` 16** | **`lager` 27** |
| Stufen | 1 und 2 | **nur 1** | **nur 2** |
| zurueckgestuft insgesamt | 0 | **112** | **0** |
| Guete | 76 | 96 | 98 |
| Fass gesamt | 767 | 4.700 | 1.855 |

### 1970

| | V (0 DM) | A `behandlung:schoenen` (0 DM) | B `rechner` + `pasteur` (**192.000 DM**) |
|---|---|---|---|
| Haltbarkeit im Schnitt | 24,23 | 33,32 | **66,22** |
| Faesser durch den Gaerkeller | 200 | 239 | 299 |
| Guete | 68 | 66 | **98** |
| Fass gesamt | 2.520 | 3.420 | **4.139** |
| **Sorte / Stufe im Keller** | `pils` / 2 | `pils` / 2 | **`pils` / 2** |

**Befund:** Am Ende steht ein anderes Bier — in Haltbarkeit, Guete, Ausbeute
und Rueckstufungen, und in 1884 auch in der **Sorte** (`einfach` Stufe 1 gegen
`lager` Stufe 2). Aber die Richtung ist einseitig: die **billige Abkuerzung
aendert das Bier sichtbar nach unten** (1884 Partie A: 112 Rueckstufungen,
Haltbarkeit 1), die **teure Festlegung hebt die Sorte nicht**. In 1970 enden
alle drei Partien mit Pilsner auf Stufe 2, obwohl auf beiden gekauften Knoepfen
*„traegt Exportbier"* steht — `hoechst` deckelt nur und hebt nie, die Sorte
bestellt DIE FUHRE. Wer 192.000 DM ausgibt, bekommt doppelte Haltbarkeit und
+30 Guete, aber kein anderes Bier im Fass. **Das Schild verspricht mehr, als
der Zug allein einloest.**

---

## AUFLAGEN

1. **Der Zettel darf nicht verschwinden, wenn Geld und Entscheidung da sind.**
   Gemessen 1350 im Vorgabestand (`lauf/s2-e1.json`): **29 Wochen** mit Kasse
   ≥ 78 Pf **und** `data-soll-aus="0"`, in denen `.sud-zettel` `display:none`
   trug — 1352 (3), 1353 (6), 1354 (19), 1358 (1). Wenn `stelleZettel()` keine
   Stelle findet, ist Beiseitetreten die falsche Antwort: dann muss der
   Kaufknopf woanders stehen, oder der Zettel braucht eine Stelle, die immer
   traegt. Zielzahl: **in keiner Woche, in der eine Bierwahl bezahlbar und vom
   Spiel erlaubt ist, darf das Stueck ohne Knopf am Schirm stehen.**
   *Fairnesshalber dazu:* der Reiter `stadt:reiter:sud-sud-brett` ist ein
   funktionierender Ausweg (250 von 251 Versuchen erfolgreich). Er verlangt
   aber, dass der Spieler weiss, dass sein Zettel verschwunden ist — und genau
   das sieht er nicht.
2. **1350 braucht mehr als eine Gelegenheit.** Beide Wege zusammengenommen
   (`rettung.mjs`): **5 von 256 Wochen = 2,0 %** mit mehr als einem druckbaren
   Knopf, alle fuenf im Jahr 1350. Am Zettel allein 1,7 %, am offenen Brett
   4 %. Zum Vergleich derselbe Lauf in 1600: **100 %**. Entweder muss der
   Hopfenbrief spaeter noch erreichbar sein (Ratenzahlung, Ansparen, ein
   zweiter Anlass), oder 1350 braucht eine zweite Bierfrage, die nicht 70 %
   der Startkasse kostet. Zielzahl fuer die Nacharbeit: **mindestens 25 %**,
   wie es 1884 schon schafft.
3. **`traegt Exportbier` darf nicht auf einem Knopf stehen, der kein
   Exportbier macht.** 1970, drei Partien, 0 / 0 / 192.000 DM: alle enden mit
   `pils` Stufe 2. Entweder das Schild sagt, dass es eine OBERGRENZE ist
   („laesst Exportbier zu" statt „traegt Exportbier"), oder der Zug hebt
   wirklich.
4. **Die 1970er Charge mit Frist muss bedienbar sein.** Gemessen im
   Vorgabestand (`lauf/s2-e4.json`, Zettel allein gespielt):
   `sud:zettel-charge-frei` und `-charge-schnitt` standen in 34 Wochen am
   Schirm und waren in **17 davon (50 %)** nicht zu druecken, weil der Zettel
   `display:none` trug — `data-soll-aus` war in allen 17 Faellen 0. Eine Entscheidung mit Frist, die in der Haelfte ihrer Wochen keinen
   Knopf hat, faellt weiterhin ohne den Spieler.
5. **`schalte()` soll Verdeckung nicht in `disabled` umschreiben.** Wer
   `disabled` zaehlt, kann „das Spiel sagt nein" nicht von „da liegt etwas
   darueber" unterscheiden; nur `data-soll-aus` hat den Unterschied gerettet.
   Das Attribut ist gut und soll bleiben — aber jeder kuenftige Zaehler muss es
   benutzen, sonst misst er das Falsche.

---

## SPERRLISTE (im Wortlaut, fuer die Nacharbeit)

* **Nicht zaehlen, was nur `disabled` ist.** `sud.js:1791 schalte()` setzt
  `disabled = tot || soll || !imBild(...)`. `aktiv` und `treffbar` sind deshalb
  in jeder Messung identisch. Wer damit „bedienbar" ausrechnet, misst nichts.
  Zu zaehlen ist `data-soll-aus` gegen `elementFromPoint` getrennt.
* **Nicht den Mittelpunkt des Bretts pruefen.** Jeder Knopf einzeln mit
  `elementFromPoint`. Der Vorgaenger `fremdVerdeckt()` ist genau daran
  gescheitert.
* **Nicht nur den naechstliegenden Rueckweg probieren.** Der Brettknopf ist
  abgeschaltet; das sagt nichts. Erst der zwangsweise aktivierte Knopf und das
  synthetische `MouseEvent` zeigen, ob `waehle()` selbst sperrt.
* **`vorrat.faesser` hat kein Stueckzahlfeld** — `faesser.length`, nicht
  `f.n` summieren.
* **`BRAUHAUS.uhr.jahr` gibt es nicht** — `BRAUHAUS.welt.zeit.jahr`.
* **`data-deckung` gibt es zweimal**; nur die Kopfzeile traegt `.deckung`.
* **Wer alle Bretter aufschlaegt, misst seinen eigenen Rundgang.** Belegt: in
  `partie.mjs … sorgfaeltig` lag der Zettel in 1350 in 37,4 % der Wochen
  beiseite, in `rettung.mjs` (das jede Woche das Sudbrett auf- und zuklappt)
  nur in 7,0 %. Die Zahl haengt am eigenen Verhalten und muss immer mit der
  Spielweise genannt werden.
* **`pkill -f "<muster>"` erschlaegt die eigene Shell.**
* Nicht auf 8899 messen, solange andere Builder darin schreiben; nicht 8900
  belegen, wenn dort schon ein fremder Messstand haengt. Eigener Hafen,
  eigener Commit, Commit im Urteil nennen.
* `design/PRUEFUNG.md` ist Sperrliste, keine Latte.

---

## Was NICHT beanstandet wird

* Das Siegel. 106 Wege, 58 davon wirklich ausgeloest, 0 zurueck. Der Riegel
  sitzt im Zug (`sud.js:937`), nicht nur in der Oberflaeche.
* Die Ratsche. `labor` → `rechner` bleibt offen, `rechner` → `labor` ist zu.
  Genau was am Brett steht.
* Dass der Zettel zuruecktritt, wenn das eigene Brett offen liegt. Das ist
  richtig und wurde gemessen: nie stehen beide zugleich bedienbar da.
* Dass die Vorgabe abgeschaltet ist, solange sie laeuft.
* Dass 1600 `schuettung` keine unwiderrufliche Option hat und das auch nicht
  behauptet.
* Die Verbliste je Epoche: kein Verb kommt zweimal vor (geprueft an den
  Zugschluesseln `wuerze` · `schuettung`/`gaerung` · `kaelte`/`hefe` ·
  `fuehrung`/`behandlung`).
* Dass die Partien in 1884 und 1970 vor dem vierzehnten Jahr enden
  (`bank-verwertet`, `brauereisterben`, `braurecht-entzogen`, `haus-verloren`).
  Das sind Enden anderer Stuecke; DER SUD hat sie nicht verursacht.

---

## Belege

Alle Skripte und Rohdaten liegen unter `werkbank/schuss/sud-blind4/`:

| Datei | was sie misst |
|---|---|
| `erkundung.mjs` | Vorgabestand aller vier Epochen, jeder Knopf mit `elementFromPoint` |
| `partie.mjs` | vierzehn Jahre sorgfaeltig, Stil `faul` / `sorgfaeltig` / `siegel` / `brett` |
| `auswertung.mjs` | zaehlt aus den Aufnahmen: bedienbar / Spiel sagt nein / fremdes Brett / gar nicht im Bild |
| `siegel.mjs` | neun Rueckwege je Festlegung, inkl. Erbfall und Notsud |
| `siegel2.mjs` | dasselbe je Achse auf frischer Seite |
| `ratsche.mjs` | die Ratsche bei Kasse 5.000.000 — kein Preis faelscht die Antwort |
| `rettung.mjs` | faengt das Brett auf, was der Zettel liegen laesst |
| `zweipartien.mjs` | dieselbe Epoche dreimal: Vorgabe, Abkuerzung, Festlegung |

Mit abgelegt sind die Rohdaten, aus denen jede Zahl dieses Urteils
nachgerechnet werden kann:

* `siegel-e*.json`, `siegel2-e*.json`, `ratsche-e*.json` — alle 106 Rueckwege
  einzeln, mit Ergebnis und Zustand vorher/nachher
* `rettung-e*-zusammenfassung.json` und `rettung-ergebnis.txt` — die
  Erreichbarkeitszahlen je Epoche
* `zwei-e*.json` — die zwoelf Vergleichspartien mit Endzustand und dem, was
  dabei am Schirm stand
* `partie-sorgfaeltig-auswertung.txt` — die Wochenzaehlung aller vier Epochen

Die vollen Wochenaufnahmen (`s2-e*.json`, je 0,5–2 MB) blieben im
Arbeitsverzeichnis; ihre Auswertung steht in
`partie-sorgfaeltig-auswertung.txt`.
