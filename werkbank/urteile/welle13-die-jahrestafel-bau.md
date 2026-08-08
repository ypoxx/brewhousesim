# Welle 13 · Stück 2 — DIE JAHRESTAFEL. Baubericht.

*Laufend geschrieben, während gebaut wird. Besitzstand: `spiel/stuecke/preis*.js` ·
`spiel/stil/preis*.css`. Kein `git add`, kein Commit, kein fremdes DOM geschrieben.*

---

## 0 · Was vor dem ersten Handgriff gemessen wurde

Gerät: `werkbank/schuss/tafel-w13/blick.mjs` — spielt 1350 (Saat 1350, Fenster
1600×900) **ohne einen einzigen Reiter anzufassen**; erlaubt sind nur „Wie vorige
Woche"/„Nach Durst füllen", „FUHRE ABSCHICKEN", „WEITER" und, wenn die Tafel
wirklich vor dem Spieler liegt, ihr eigener Knopf „Das Jahr beginnen".
Protokoll: `werkbank/schuss/tafel-w13/protokoll/vorher-e1.json`.

| Stand VORHER (1350) | |
|---|---|
| abgelesene Zustände | 308 |
| Braujahre erreicht | 4 (1350–1353, dann endete das Spiel) |
| **Knopf `preis:tafel` log** (Aufschrift „schließen", keine Tafel da) | **33 von 308** |
| davon: alle 30 Wochen des Ladejahres 1350 | 30 |
| dazu je Jahreswechsel 1351/1, 1352/1, 1353/1 | 3 |
| Tafel lag von selbst da | 3 — **1351, 1352, 1353**, also **jeder** erlebte Jahreswechsel |
| **Ladejahr 1350: Tafel lag von selbst da** | **0 von 1** |
| `BRAUHAUS.lage` · Seitenfehler | 0 · 0 |

### Und damit eine Berichtigung, die ich unabhängig bestätige

Der Wellenbrief schrieb zu R7: *„in zehn Braujahren 1350 lag sie kein einziges
Mal von selbst auf."* **Das ist am Vorzustand nicht wahr.** Meine erste Messung
— geschrieben, bevor ich eine Zeile angefasst hatte — fand die Tafel an
**jedem** Jahreswechsel liegend: 1351/1, 1352/1, 1353/1. Genau diese drei
Jahreszahlen, an genau diesem Stand, hat die Aufsicht mit eigenem Gerät
gemessen und den Wellenbrief daraufhin berichtigt
(`werkbank/schuss/aufsicht/welle13-gegen/BEFUND-VORHER.md`). Zwei Geräte, zwei
Hände, dieselbe Liste.

**Was am Vorzustand wirklich fehlte, ist enger und teurer:**

1. **Am Spielanfang (1350/1) liegt die Tafel nicht** — und genau dort behauptet
   der Knopf, sie läge. R6 und R7 treffen sich an dieser einen Stelle. In den
   30 Wochen des Ladejahres lag sie **null Mal**.
2. **Von fünf Angeboten ist am Jahreswechsel eines bezahlbar.** Gemessen
   1351/1, Kasse 48 Pf: fünf Karten mit Preisschild nebeneinander (33 · 59 ·
   120 · 210 · 1.200 Pf), davon **ein** „Nehmen" bedienbar, vier abgeschaltet
   mit *„Über der Kasse: es fehlen …"*. Das ist nicht die Sichtbarkeit,
   sondern der Preis — Auflage A10, und dafür ist R8 da.
3. **Die Reiter unter dem liegenden Blatt sind tot** (R10, von der Aufsicht
   ziffernweise bestätigt: vier Klicks, greifbare Züge 25 → 26 → 26 → 26 → 26).
   Deshalb bekommt ein sorgfältiger Spieler das beste Brett des Spiels nicht zu
   Gesicht: nicht weil es fehlt, sondern weil alles ringsum tot ist, während es
   liegt.

### Warum der Knopf log — die Kette, Zeile für Zeile

1. `michaeli()` setzt `Z.offen = true`. Der erste Bildaufbau zeichnet die Tafel.
2. DIE STADT sieht in ihrem 240-ms-Takt nach (`stadt.js` `nachsehen()`), findet
   ein fremdes Brett, das **beim Laden schon dalag** (`jetzt - startZeit <
   LADEZEIT = 2500`) und klappt es weg: `stadt-zugeklappt`, `clip-path:
   inset(50%)`. Gemessen: in allen 30 Wochen des Jahres 1350 trug `.pr-tafel`
   diese Klasse.
3. `tafelSichtbar()` fragte `document.querySelector('.pr-tafel')` — **im selben
   Zeichenweg, nachdem `B.leere(fach)` genau dieses Element gerade entfernt
   hatte.** Die Abfrage konnte also gar nichts finden und gab immer „nicht
   weggeklappt" zurück. Der Knopf schrieb „schließen", die Tafel wurde neu
   gezeichnet, DIE STADT klappte sie 240 ms später wieder weg. Stabiler
   Endzustand: Knopf lügt, Tafel unsichtbar.
4. Die Notbremse dagegen war `seheNachRahmen()` — eine **Wanduhrfrist von
   420 ms** (`preis.js:2737`), genau die Stelle, die `spiel/LIESMICH.md` als
   Verursacher der Bistabilität vom 7. August benennt. Sie hat nie gegriffen,
   weil ihre erste Zeile `clearTimeout(rahmenBlick)` ist: jeder neue Bildaufbau
   setzt die Frist zurück, und das Spiel zeichnet häufiger als alle 420 ms neu.
   **Welle 12 hat das Rennen abgestellt, die Lüge blieb — und der Wecker, der
   sie hätte finden sollen, ist nie geklingelt.**

---

## 1 · R6 — der Knopf `preis:tafel` lügt nicht mehr

**Was gebaut wurde, in drei Zeilen `zeichne`:**

```js
klemmeLesen();                    // liest die Tafel der VORIGEN Runde
var fach = B.ebene('blatt', 'preis'); B.leere(fach);
var sichtbar = tafelSichtbar();   // EINE Entscheidung
zeichneGriff(fach, sichtbar); if (sichtbar) zeichneTafel(fach);
```

* `klemmeLesen()` liest **vor** dem Leeren des Fachs, ob `.pr-tafel` die
  Klasse `stadt-zugeklappt` oder `stadt-verdeckt` trägt. Das ist das Element,
  über das DIE STADT seit dem letzten Bildaufbau geurteilt hat — die einzige
  Stelle, an der diese Auskunft überhaupt zu haben ist. Steht keine Tafel im
  DOM, gilt die vorige Entscheidung weiter (sonst flackerte das Blatt im
  240-ms-Takt des Rahmens).
* `sichtbar` wird **einmal** je Runde berechnet und an `zeichneGriff`
  *übergeben*. Ein Knopf und ein Blatt, die aus demselben Wert gezeichnet
  werden, können einander nicht widersprechen. Vorher rief `zeichneGriff`
  `tafelSichtbar()` selbst — zwei Messungen in einer Runde.
* **Die 420-ms-Frist ist ersatzlos fort**, ebenso `seheNachRahmen()` und
  `tafelWeggeklappt()`. Der Rundenschluss aus `kern/runde.js` zieht nach, was
  sie tun sollte: seine Klemmenwache zeichnet neu, sobald sich
  `.stadt-zugeklappt` ändert. `stuecke/preis.js:2737` — die Stelle, die
  `kern/runde.js` im Kopf als **den Verursacher** der Bistabilität vom
  7. August nennt — existiert nicht mehr. Damit hat das ganze Spiel nur noch
  **eine** gefangene Frist (`name.js:2272`, 0 ms).

**Nebenbefund, und er war die halbe Ursache dafür, dass R7 nicht messbar war:**
`.pr-tafel` trug in `stil/preis.css` ein `animation: pr-auf 220ms` mit
`from { opacity: 0 }`. Das Fach wird bei **jedem** Bildaufbau geleert und neu
gefüllt — die Tafel ist ein neues Element je Runde, die Aufblende lief also
jedes Mal von vorn. Gemessen am Jahreswechsel 1351/1: Tafel im DOM, nicht
weggeklappt, ihr Ausgangsknopf mit `elementFromPoint` zu treffen — und
`getComputedStyle(...).opacity` **= 0**. Eine Hand, die nach ihrem Klick
hinsieht, sieht ein durchsichtiges Blatt und zählt es nicht. Die Aufblende
läuft jetzt nur noch beim ersten Bildaufbau nach dem Aufschlagen (Klasse
`pr-frisch`, gesetzt aus `Z.imDom`).

### Gemessen (1350, Saat 1350, 1600×900, kein einziger Reiterklick)

| | vorher | nachher |
|---|---|---|
| abgelesene Zustände | 308 | 206 |
| **Aufschrift „schließen" ohne liegende Tafel** | **33** | **0** |
| Aufschrift „Michaelitafel …" bei liegender Tafel | 0 | 0 |
| **ehrliche Aufschriften** | 275 | **206 von 206** |
| Seitenfehler · `BRAUHAUS.lage` | 0 · 0 | 0 · 0 |

Protokolle: `…/tafel-w13/protokoll/vorher-e1.json` und `nach3-e1.json`.
Über alle vier Epochen (je 4 Braujahre, ohne Reiterklick): **0 Lügen in
206/206/202/198 abgelesenen Zuständen.**

---

## 2 · R7 — die Tafel liegt zu Michaeli von selbst auf

Drei Änderungen, und die dritte ist die, über die man streiten kann:

**(a) `michaeli()` setzt die Merkmarken zurück.** `Z.geklemmt` trug sonst das
Urteil der STADT über die Tafel des *vorigen* Jahres weiter.

**(b) Eine Tafel außerhalb von Michaeli wird weggelegt.** Neuer
`woche`-Horcher: `if (d.woche !== 1) Z.offen = false`. Grund: `nimm()`
beginnt mit `if (B.welt.zeit.woche !== 1) return;` und `angebotKarte`
beschriftet den Knopf dann mit „Michaeli ist vorüber" und schaltet ihn aus.
Bis zu dieser Welle blieb `Z.offen` das ganze Braujahr stehen — wer die Tafel
in Woche 1 nicht weglegte, sah bis Woche 30 ein formatfüllendes Blatt mit
fünf abgeschalteten Knöpfen. Das ist die Vitrine aus §3 des Urteils.

**(c) Michaeli lässt sich nicht übergehen.** DIE STADT klappt beim Laden
**jedes** fremde Brett in einen Reiter (`stadt.js`: `jetzt - startZeit <
LADEZEIT` → `'zu'`), und `lage[s]` behält dieses Urteil danach bei. Für die
Michaelitafel des **Ladejahres** heißt das: sie liegt nie, und genommen wird
nur in Woche 1. Gemessen am Stand vorher: 1350 lag sie in keiner der 30
Wochen des Ladejahres.

Die Regel ist deshalb: *solange Michaeli ist, die Tafel nicht weggelegt wurde
und nur der Rahmen sie weggeklappt hat, holt sie sich den Tisch bei der
nächsten Handlung des Spielers zurück.* Das ist **keine Gegenwehr gegen den
Rahmen, sondern sein eigener Weg**: ein Brett, das unmittelbar nach einem
Klick neu erscheint, gilt DER STADT als vom Spieler geholt und bleibt
aufgeschlagen (`handZeit`, `HANDFRIST = 1400`). Kein Zeitgeber, keine Frist,
keine Klasse an fremdem DOM. Verriegelt auf **drei** Versuche je Braujahr.

Für den einen Klick, mit dem man Michaeli sonst verlässt — WEITER —, gilt der
**Georgi-Halt** der FUHRE (`fuhre.js`, ZUSTÄNDIGKEIT 23): der erste Druck legt
die Tafel auf den Tisch, statt die Woche zu schalten, **einmal je Braujahr**
(`Z.gehalten`). Schlägt sie danach immer noch nicht auf, läuft der nächste
Druck durch — eine Sackgasse kann daraus nicht werden.

Der Horcher hängt an `#buehne`, nicht an `document`, und das ist Absicht:
`stopPropagation` hält dort den Knopf des Kerns auf, **nicht** den Horcher DER
STADT, der am selben Knoten hängt und `handZeit` setzt. Hinge er an
`document`, klappte DIE STADT die eben geholte Tafel sofort wieder weg.

---

## 3 · R10 — das eigene Blatt geht beim Klick auf einen fremden Reiter weg

Derselbe Horcher. Trifft ein Klick `stadt:reiter:*`, `stadt:bauhof`,
`stadt:ortsmarken` oder `stadt:alles-zuklappen`, während die Tafel liegt,
setzt DIE JAHRESTAFEL ihr **eigenes** `Z.offen` auf false und zeichnet neu.
Der Klick läuft unverändert an den Reiter weiter, der ihn bekommen soll — er
kostet den Spieler nichts und tut jetzt, was draufsteht. Kein Reiter wird
abgeschaltet, kein fremdes DOM angefasst (Entscheidung ③ der Aufsicht).

---

## 4 · R8 — woher das Geld kommt

Der Satz wird nicht erfunden, sondern **abgelesen**: das Spiel schreibt jede
Einnahme als Preisschild mit positiver Zahl an ihren Knopf
(`kern/buehne.js`: `einnahme = opt.preis > 0`). `einnahmeZuege()` sammelt alle
solchen Knöpfe, die nicht abgeschaltet sind und eine Fläche haben; `geldZug()`
nimmt den **kleinsten, der die Lücke schließt** — und wenn keiner reicht, den
größten. Fremdes DOM wird nur gelesen; `stuecke/fuhre.js` zeichnet laut
`spiel/index.html` vor diesem Stück, der Knopf ist also aus derselben Runde.

Der Satz steht an **zwei** Orten: unter „HEUTE NICHT" bei den Angeboten und —
neu — unter „HEUTE KEINE" bei den Festlegungen, wenn zwar ein Angebot, aber
keine Festlegung bezahlbar ist. Genau dieser Fall ist §3 des Urteils: *„in
1350 null von drei, weil die billigste 85 Pf kostete bei einer Kasse von 112"*.

Dass die Tafel dabei zugeht und wieder auf, ist kein Umweg, sondern der Zug:
der Griff oben rechts schaltet sie, ohne dass die Woche läuft, und `nimm()`
fragt nur nach der Woche. **Zettel schließen, Grut verkaufen, Tafel wieder
aufschlagen, nehmen — alles am selben Michaelistag.** Das steht im Satz.

**Ein Befund, der nicht dieser Tafel gehört, aber hierher, weil er den Satz
begrenzt:** im ganzen Spiel trägt **genau ein** Knopf ein positives
Preisschild, in allen vier Epochen derselbe — `fuhre:rueckkauf:rohstoff`
(+19 Pf / +66 fl / +633 M / +7.200 DM); in 1884 und 1970 ist er im
Ladezustand abgeschaltet. Gemessen an vier Ladeschirmen. Solange das so ist,
kann diese Tafel in vielen Wochen keinen Geldzug nennen, weil es keinen gibt.
Das ist Auflage A9 (Stück 4) und A7 (Stück 3), nicht R8.

Für diesen Fall erfindet die Tafel nichts, sondern sagt, was wahr ist — und
sie sagt es mit einer **gemessenen Zahl**: was das vorige Braujahr übrig
gelassen hat (`Z.ertrag`, die Veränderung der Lade von Michaeli zu Michaeli)
und in wie vielen Braujahren die Summe bei diesem Gang zusammenkäme. Ließ das
Jahr nichts übrig, steht der Satz da, der dann wahr ist: *„Solange das so
bleibt, kommt diese Summe nicht zusammen — sie kommt aus den Fuhren, nicht
aus der Zeit."*

Am Bildschirm abgelesen (1350, Michaeli 1351, Kasse 48 Pf):

> **HEUTE KEINE** Für keine dieser Festlegungen reicht die Kasse. Die
> billigste — Vertrag statt Gunst — kostet 88 Pf, es fehlen 40 Pf. Eine
> Festlegung, die man nie bezahlen kann, ist keine Festlegung.
> **HEUTE BRINGT KEIN KNOPF GELD** Auf diesem Schirm steht kein Zug mit
> Preisschild, der etwas in die Lade legt. Das vorige Braujahr hat nichts
> übrig gelassen. Solange das so bleibt, kommt diese Summe nicht zusammen —
> sie kommt aus den Fuhren, nicht aus der Zeit. Was heute nicht genommen
> wird, bleibt in der Kasse; die Tafel von 1352 steht am selben Ort.

---

## 5 · R9 — kein abgeschnittener Text

Gerät: `werkbank/schuss/tafel-w13/ueberlauf.mjs`. **Mit gezeichneter
Rollleiste** (`ignoreDefaultArgs: ['--hide-scrollbars']`), zwei Fenster
(1600×900 und 1366×768), vier Epochen, beide Seiten der Tafel (Angebote und
Chronik) = **16 Blätter**. Gemessen am neunten Braujahr jeder Epoche
(1359 / 1609 / 1893 / 1979), also an vollen Kästen.

Zwei Sorten werden gezählt:
1. **Abgeschnittene Kästen** — je Richtung getrennt: läuft in dieser Richtung
   über UND kann in dieser Richtung nicht rollen.
2. **Wortbrüche** — ein Knopfwort auf mehr Zeilen, als es Wörter hat. Die
   Zeilenzahl kommt aus `Range.getClientRects()`, nicht aus Höhe geteilt
   durch Zeilenhöhe; das ist der Unterschied zwischen „sieht so aus" und
   „ist so".

| | vorher | nachher |
|---|---|---|
| abgeschnittene Kästen (16 Blätter) | 0 | **0** |
| **Wortbrüche (16 Blätter)** | **51** | **0** |

Die vier Kästen aus A13 (*„Zusammen im Jahr"*, *„Der Anschlag steht im
Steuerbuch der Stadt"*, *„1 fertig · 0 im Bau · 0 durch eine Wahl für immer"*)
schneiden in **keinem** der 16 Blätter mehr ab — das hat die Nacharbeit der
Welle 7 erledigt (`@media`-Block in `stil/preis-zusatz.css`), und es hält auch
bei 1366×768 und mit Rollleiste.

**Der Wortbruch dagegen stand noch, und seine Ursache ist eine Kette aus drei
einzeln richtigen Regeln:**
`.pr-tafel .pr-karte { overflow-wrap: anywhere }` ist für lange Komposita im
Kartentext gedacht, wird aber auf das Wort im Knopf vererbt; der Knopf ist ein
`inline-flex` aus `.wort` und `.preis` (`kern/buehne.js`), und beide Kinder
schrumpfen bei knappem Platz unter ihre eigene Breite; mit `white-space:
normal` bricht das Wort dann an jeder Stelle. Ergebnis: *„Nehme n"*.

Abhilfe: `.wort` und `.preis` bekommen `flex: 0 1 auto` mit
**`min-width: min-content`** — das ist genau die Breite des längsten Wortes.
Damit schrumpft die Aufschrift bis an die Wortgrenze und keinen Buchstaben
weiter; der Knopf darf dafür **zwischen** Wort und Preisschild umbrechen
(`flex-wrap: wrap`). „Festlegen — Geld herein" bricht an seinen Leerzeichen
und passt in die 144 px breite Karte (vorher: 145 px auf einer Zeile, 11 px
über den Rand); „Nehmen" bricht nie. Der Kartentext behält `anywhere` — er
ist es, der es braucht.

---

## 6 · Ein Fehler, den ich selbst gebaut und selbst gefunden habe

Er steht hier vollständig, weil er die teuerste Sorte war: **er hat das Herz
des Bretts unbedienbar gemacht, und die erste Messung hat ihn nicht gesehen.**

Der Satz aus R8 stand zuerst **im** Abschnittskopf der Festlegungen. Dieser
Kopf ist eine **Zeile** (`.pr-abschnitt { display: flex; align-items:
baseline }`): ein Kasten mit vier Sätzen wird darin auf Wortbreite gequetscht
und dafür hoch. `.pr-mitte` ist eine Spalte, in der nur die Reihe der Angebote
biegsam war — jeder Pixel, den der Kopf dazugewann, ging von den Angeboten ab.

Gemessen, Michaeli 1351, drei Fenster:

| | 2752×1536 | 1600×900 | 1366×768 |
|---|---|---|---|
| Reihe der Angebote, vorher (Vorzustand `7e21973`) | 530 px | 286 px | 218 px |
| Reihe der Angebote, mit dem Fehler | **0 px** | **0 px** | **0 px** |
| Karten hoch | 22 px | 12 px | 11 px |
| Tafel läuft über | 0 px | **136 px** | **197 px** |
| „Nehmen" mit `elementFromPoint` zu treffen | **0 von 5** | **0 von 5** | **0 von 5** |
| Reihe der Angebote, nach der Abhilfe | 373 px | **215 px** | **184 px** |
| „Nehmen" zu treffen, nach der Abhilfe | 1 von 5 | **1 von 5** | 1 von 5 |

**Warum meine erste R9-Messung ihn nicht fand — zwei Lücken im eigenen Gerät,
beide behoben:**
1. Sie maß mit `?jahr=1359&woche=1`, also einer **frischen** Partie mit voller
   Kasse. Dann steht der Erklärkasten gar nicht da, und der Fehler auch nicht.
   `ueberlauf.mjs` hat seither einen **zweiten Durchgang**, der bis zu dem
   Michaeli spielt, an dem die Kasse für nichts reicht.
2. Sie sah nur `tafel.querySelectorAll('*')` an, nicht die **Tafel selbst**.
   Genau die trägt `overflow: hidden`; dass eine ganze Reihe 136 px unter
   ihrem Rand stand, war deshalb unsichtbar. Jetzt steht sie mit in der Liste.

Die Abhilfe: der Kasten ist eine eigene Zeile der Spalte (kein Kind des
Kopfes), beide Reihen sind biegsam und haben einen **gemessenen Boden**
(370 × `--s` für die Angebote — so viel brauchen Hinweis, Dauerzeile und Knopf
einer Karte, die nie schrumpfen dürfen; 270 × `--s` für die Festlegungen), und
die Erklärkästen sind gedeckelt und rollen.

**Die Lehre, und sie gilt über diesen Fall hinaus:** wer einem vollen Brett
einen Satz hinzufügt, ändert eine Höhenrechnung. Ein Blatt, das an einem Tag
im Jahr fünf Entscheidungen trägt, muss an **diesem Tag** gemessen werden —
nicht an dem Tag, an dem es leer ist.

---

## 7 · Die Abnahme, in Zahlen

Alles am laufenden Spiel gemessen, Saat 1350, Geräte unter
`werkbank/schuss/tafel-w13/`, Rohdaten unter `…/protokoll/`.

### R6 · Der Knopf lügt nicht

`blick.mjs` — spielt, **ohne einen einzigen Reiter anzufassen**, und liest nach
**jedem** Klick ab.

| Epoche | abgelesene Zustände | „schließen" ohne Tafel | „Michaelitafel …" bei liegender Tafel | Seitenfehler · `lage` |
|---|---|---|---|---|
| 1350 | 206 | **0** | 0 | 0 · 0 |
| 1600 | 206 | **0** | 0 | 0 · 0 |
| 1884 | 202 | **0** | 0 | 0 · 0 |
| 1970 | 198 | **0** | 0 | 0 · 0 |

Vorzustand derselben Probe in 1350: **33 Lügen in 308 Zuständen.**
Die Aufsicht hat am Vorzustand mit eigenem Gerät **100 von 100** Wochen mit
der Aufschrift „Michaelitafel schließen" gezählt, davon 97 ohne liegende
Tafel. Nachher gibt es diese Aufschrift nur noch dann, wenn die Tafel wirklich
liegt — geprüft über **1.512 abgelesene Zustände** in der Zehnjahresprobe:
**0 Lügen.**

Vier verschiedene Aufschriften stehen jetzt am Knopf, jede für eine Lage:
`Michaelitafel schließen` · `Michaelitafel 1350 · 5 Angebote` ·
`Michaelitafel 1350 · 5 Angebote — heute ist Michaeli` (Michaelitag, Tafel
weggelegt; roter Rahmen) · `… — liegt bereit` (der Sommerzettel liegt oben).

### R7 · Die Tafel liegt zu Michaeli von selbst auf

`jahrzehnt.mjs` — zehn Braujahre 1350, **in Woche 1 wird kein Reiter, kein
Griff und nichts angefasst**; gelesen wird nur, und weggelegt wird mit dem
eigenen Knopf der Tafel.

| | |
|---|---|
| gespielt | 1350/1 bis **1360/2**, 1.512 abgelesene Zustände, 1.370 echte Klicks |
| Michaelitage erlebt | **11** (1350 bis 1360) |
| **davon lag die Tafel von selbst da** | **10** |
| davon nicht | **1** — der **Ladetag 1350/1** |
| Reiterklicks in Woche 1 | 0 (außer den 10 Proben zu R10) |
| Seitenfehler · `lage` | 0 · 0 |

Der Ladetag ist der Tag, an dem DIE STADT jedes fremde Brett wegklappt. Dort
steht jetzt die ehrliche Aufschrift mit rotem Rahmen, und **die erste
Handlung des Spielers holt die Tafel auf den Tisch** — auch der erste Druck
auf WEITER, einmal je Braujahr. Gemessen: `blick.mjs`, das nach jedem Klick
abliest, findet die Tafel in **allen vier Epochen auch am Ladetag** liegend
(1350 · 1600 · 1884 · 1970, je 4 von 4 erlebten Michaelitagen), und
`reiterprobe.mjs` beginnt seine R10-Probe in allen vier Epochen an **1350/1,
1600/1, 1884/1, 1970/1** — sie kommt dort nur hin, weil die Tafel nach dem
ersten Klick liegt.

**Was am Michaelitag wirklich auf dem Tisch liegt** (1351/1, Kasse 48 Pf,
1600×900): fünf Karten mit Preisschild nebeneinander — 34 · 59 · 120 · 210 ·
1.200 Pf —, davon **ein** „Nehmen" bedienbar, vier abgeschaltet mit
*„Über der Kasse: es fehlen …"*; dazu drei Festlegungen, keine bezahlbar.
Das ist genau der Punkt 2 der Aufsicht, und dafür ist R8 gebaut.

### R10 · Der fremde Reiter nimmt das Blatt weg

`reiterprobe.mjs` — bis zu einem Michaeli mit liegender Tafel spielen, dann
vier fremde Reiter der Reihe nach mit **echter Maus** greifen; vorher mit
`elementFromPoint` geprüft, dass unter dem Zeiger auch wirklich dieser Reiter
liegt; zwischen zwei Klicks das Blatt wieder aufschlagen.

| Epoche | bei | Klicks | wirklich getroffen | **Blatt weg** | greifbare Züge vorher → nachher |
|---|---|---|---|---|---|
| 1350 | 1350/1 | 4 | 4 | **4** | 33 → 48 · 58 · 64 · 64 |
| 1600 | 1600/1 | 4 | 4 | **4** | 36 → 49 · 59 · 64 · 64 |
| 1884 | 1884/1 | 4 | 4 | **4** | 39 → 49 · 56 · 62 · 62 |
| 1970 | 1970/1 | 4 | 4 | **4** | 29 → 45 · 55 · 59 · 59 |

**16 von 16.** Vorzustand, von der Aufsicht gemessen: vier Klicks,
25 → 26 → 26 → 26 → 26, das Blatt blieb liegen. Vom Kritiker in 1601:
achtmal identisch 30.
Dazu in der Zehnjahresprobe zehn weitere Reiterklicks unter liegendem Blatt:
Blatt weg in 9 von 10, mehr greifbare Züge in **10 von 10** (24…32 → 31…53);
der eine Ausreißer (1354) ist ein Griff der Probe, der laut Protokoll unter
dem Zeiger einen anderen Knopf traf.

### R9 · Kein abgeschnittener Text

`ueberlauf.mjs`, **mit gezeichneter Rollleiste**, zwei Fenster × vier Epochen
× zwei Seiten = 16 Blätter, dazu ein zweiter Durchgang am **armen Michaeli**.

| | vorher | nachher |
|---|---|---|
| abgeschnittene Kästen, 16 Blätter | 0 | **0** |
| **Wortbrüche, 16 Blätter** | **51** | **0** |
| armes Michaeli 1600×900 (E1 1351/1 · E2 1602/1) | 0 · 0 | **0 · 0** |
| armes Michaeli 1366×768 (E1 1351/1 · E2 1602/1) | 3 · 3 | **0 · 0** |
| Tafel läuft über den eigenen Rand | 136 / 197 px | **0 px** |

`werkbank/schuss/aufsicht/lesbarkeit.mjs`, vier Epochen:
**1600×900 → 2 Überläufe, keiner aus `pr:`** (beide `nm:`);
**1366×768 → 17 Überläufe, keiner aus `pr:`** (`nm:` 4, `fu:` 2, `sud:` 1,
`zielzeile:` 4, ohne Klasse 4). Aus DER JAHRESTAFEL kommt in keinem der acht
Läufe ein einziger. 0 von 309 aktiven Knöpfen unter 24 px.

### R8 · Woher das Geld kommt

Am Bildschirm abgelesen, 1350, Michaeli 1351, Kasse 48 Pf (Bild:
`…/tafel-w13/schuesse/abnahme-arm-e1-1600.png`):

> **HEUTE KEINE** Für keine dieser Festlegungen reicht die Kasse. Die
> billigste — Vertrag statt Gunst — kostet 88 Pf, es fehlen 40 Pf. Eine
> Festlegung, die man nie bezahlen kann, ist keine Festlegung.
> **HEUTE BRINGT KEIN KNOPF GELD** Kein Zug auf diesem Schirm legt Geld in
> die Lade. Das vorige Braujahr ließ nichts übrig — diese Summe kommt aus den
> Fuhren, nicht aus der Zeit.

Steht ein Einnahmeknopf da, nennt der Satz ihn mit seinem eigenen Wortlaut,
seiner Zahl und dem Weg dorthin. Gemessen an vier Ladeschirmen ist das
**genau ein Knopf im ganzen Spiel** — `fuhre:rueckkauf:rohstoff`, +19 Pf /
+66 fl / +633 M / +7.200 DM, in 1884 und 1970 im Ladezustand abgeschaltet.
Das ist der Befund zu A9 und A7 und gehört den Stücken 3 und 4; diese Tafel
kann nur nennen, was es gibt.

### Was nicht zurückgenommen wurde

| | |
|---|---|
| **Wiederholbarkeit** | `wdh.mjs`: 45 Wochen, **drei Läufe je Epoche, je EINE Prüfsumme** — 1350 `0be47d8dd506` · 1600 `7610c22564ef` · 1884 `4fe03d5759b1` · 1970 `daba9fb71978`. Geprüft über Jahr, Woche, Kasse, Rohstoff, Ansehen, Fässer, Chronik, Buch, Gegnerzüge, Anschlag, genommene Angebote, Festlegungen und die ganze LEITER. |
| **`Math.random()`** | kein Vorkommen in `stuecke/preis*.js` |
| **Wanduhrfrist im Zeichenweg** | **keine mehr** — die 420-ms-Frist ist ersatzlos entfernt; das Stück hat kein `setTimeout` und kein `setInterval` mehr |
| Preise · Erträge · Fristen | **unverändert.** Keine Zahl der Wirtschaft angefasst: keine Änderung an `preisVon`, `zahlplan`, `festPreis`, `rechneAnschlag`, `teuerung`, `pflichtSumme`, `notpfennig` oder an `preis-daten.js`. 1600 ist damit nicht berührt. |
| Ausschluss zwischen den Angeboten | **unverändert** (`nimm` → `a.sperrt`, `partnerVon`, `waehleAngebote` — keine Zeile angefasst) |
| Seitenfehler · `BRAUHAUS.lage` | **0 · 0** in allen vier Epochen, in jeder Probe dieser Welle |
| fremdes DOM | nur gelesen (`.fu-sommerblatt`, `[data-preis]`, `.pr-tafel`-Klassen); **nichts geschrieben**, kein Reiter abgeschaltet |
| Dateien | nur `spiel/stuecke/preis.js` und `spiel/stil/preis.css` · `preis-zusatz.css` |

**Ein Nebeneffekt, der genannt gehört:** der eine gehaltene WEITER-Druck je
Braujahr (nur wenn der Rahmen die Tafel weggeklappt hat, praktisch also einmal
je Sitzung im Ladejahr) kostet einen Klick, ohne die Woche zu schalten. Eine
messende Hand, die Wochen an WEITER-Klicks zählt, kommt dadurch **eine Woche
kürzer** — nicht anders. Am Spielverlauf ändert er nichts: es ist derselbe
Halt, den DIE FUHRE zu Georgi seit Welle 6 hat.

---

## 8 · Was ich nicht gebaut habe, und warum

* **Die Tafel am Ladetag ohne jeden Klick.** DIE STADT klappt beim Laden jedes
  fremde Brett in einen Reiter (`stadt.js`: `jetzt - startZeit < LADEZEIT`),
  und ihr Gedächtnis `lage[s]` behält das Urteil. Dagegen anzuzeichnen hieße,
  im 240-ms-Takt des Rahmens zu flackern — genau das Rennen, das Welle 12 vier
  Tage gekostet hat. Der Weg des Rahmens ist der Klick (`handZeit`), und den
  gehe ich. **Wenn die Aufsicht das anders will, ist es eine Änderung an
  `stuecke/stadt.js`** — ein Brett, das der Kalender auflegt, ist etwas anderes
  als eines, das beim Laden zufällig dalag. Diese Welle öffnet DIE STADT nicht.
* **Mehr bezahlbare Angebote.** Der Preis der Angebote ist die zweite
  Messlatte, und 1600 steht bei ρ +0,538 gegen eine Latte von 0,700. R8
  verlangt einen Weg zum Geld, keine Preissenkung — und der Weg wird
  abgelesen, nicht erfunden.
* **Einen eigenen Einnahmeknopf auf der Tafel.** Das wäre eine neue Geldquelle
  und damit ein Eingriff in die Wirtschaft aller vier Epochen.

---

## 9 · Für den blinden Kritiker: was in einer Minute nachzuzählen ist

```
?epoche=1&saat=1350
  · oben rechts, Woche 1:  „Michaelitafel 1350 · 5 Angebote — heute ist Michaeli"
    (roter Rahmen).  Irgendeinen Knopf drücken — auch WEITER —: die Tafel liegt.
  · BRAUHAUS.preis.lage().gesehen   -> je Braujahr: lag die Tafel offen da?
  · BRAUHAUS.preis.lage().geklemmt  -> hat DIE STADT sie weggeklappt?
  · Bei liegender Tafel auf einen Reiter oben klicken: das Blatt geht weg,
    BRAUHAUS.zuege() zählt danach 15 bis 31 greifbare Züge mehr.
  · WEITER drücken, bis Woche 2: die Tafel ist weg (genommen wird nur zu
    Michaeli — `nimm()` prüft die Woche).
  · Jahreswechsel: die Tafel liegt von selbst, ohne einen Klick.
```

Geräte, jedes mit eigenem Protokoll unter `…/tafel-w13/protokoll/`:
`blick.mjs` (R6, ohne Reiter) · `jahrzehnt.mjs` (R7 und R10 über zehn
Braujahre) · `reiterprobe.mjs` (R10, vier Epochen) · `ueberlauf.mjs` (R9, mit
Rollleiste, zwei Fenster, dazu das arme Michaeli) · `wdh.mjs`
(Wiederholbarkeit, drei Läufe je Epoche).
