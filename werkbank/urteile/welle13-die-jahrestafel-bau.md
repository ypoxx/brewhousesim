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

*(Fortsetzung: Abnahme über zehn Braujahre, vier Epochen, Wiederholbarkeit.)*
