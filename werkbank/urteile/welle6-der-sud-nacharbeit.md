# DER SUD — Nacharbeit zum blinden Urteil, Welle 6

*Laufend geschrieben.*

Gemessenes Urteil: `werkbank/urteile/welle6-der-sud-urteil.md`, Commit `05af148`,
**BESTEHT MIT AUFLAGE**. Vier Auflagen, achtteilige Sperrliste.

## Was ich annehme, bevor ich etwas anfasse

Der Kritiker bestätigt den Kern des Stücks, und das ist das Einzige, was ich
nicht anfassen darf: **das Siegel hält**. Vier `fest`-Karten mit der Maus
gekauft, sechs Rückwege versucht — keiner kommt zurück, weil der Riegel in
`waehle()` (`sud.js:939`) liegt und nicht im `disabled`. Sperrliste 1 gilt Wort
für Wort. `verdraengt()` ist unberührt; der Riegel steht unverändert als erste
Zeile von `waehle()`, vor allem, was ich dort geändert habe.

Alle vier Auflagen nehme ich an. Keine halte ich für falsch gemessen.

## Mein Messstand

`messstand.sh` kann nur **Commits** ausliefern (`git archive`). Ein Builder misst
seinen Arbeitsbaum und darf git nicht anfassen — also steht mein eigenes Gerät
daneben (Sperrliste 7), nicht statt seinem:

    scratchpad/sudstand.sh 8951

Es friert `spiel/` als Kopie ein, legt dieselbe Marke `.messstand-marke` (md5
über meine fünf Dateien **plus** `stil/grund.css`, an der ein anderer Builder
arbeitet) und **prüft am Ende, ob der Hafen sie wirklich ausliefert**. Alle
Läufe sequenziell, nie zwei Browser zugleich.

*Nebenbei, weil es genau der Fehler ist, den `messstand.sh` in seinem Kopf
beschreibt: Ich habe mir beim Aufräumen zweimal mit `pkill -f` die eigene Shell
erschlagen (Exit 144) — das Muster trifft die Shell, deren Kommandozeile die
Zeichenkette enthält. Und ich hatte einmal für vier Minuten ZWEI Läufe
gleichzeitig, weil ein `nohup … &` einen abgebrochenen Lauf überlebt hatte.
Beide Läufe sind verworfen und neu gemacht worden; keine Zahl dieses Berichts
stammt aus dieser Zeit.*

---

# AUFLAGE 1 — DIE KLEMME

## Vorher reproduziert, mit seinem Gerät

`werkbank/schuss/sud-w6/klemme.mjs`, Hafen 8951, Arbeitsbaum vor der Änderung:

    E1  Klemme in Woche 61: tot 10 Knoepfe (davon soll-aus=0: 6),
        Brett 23,124,902,645, Maus trifft true,
        loest sich NICHT in 8 s; nach Reiterklick 10/0

Ziffer für Ziffer sein Befund. **Der Kritiker hat recht, und er hat die Ursache
richtig benannt.**

## Was wirklich passiert

`klappeAuf()` der STADT (`stadt.js:526`) nimmt die Klasse `stadt-zugeklappt`
**nur ab, wenn sie da ist**:

```js
function klappeAuf(el) {
  if (!el.classList.contains(ZU)) return;
  el.classList.remove(ZU);
  el.removeAttribute('aria-hidden');
}
```

An einem frisch gezeichneten Sudbrett war sie nie da — die STADT räumt dort
also nichts ab und stempelt auch nichts. Der Merker `data-sud-gesehen` kommt
damit **nie** an den neuen Knoten, und der `else`-Zweig in `sud.js:2078`
schreibt ein `true` von einem längst weggeklappten Vorgänger endlos fort.
Deshalb lösen erst **zwei** Reiterklicks: der erste bringt die Klasse zurück,
erst dann kann der zweite sie abnehmen.

Der Fehler war nicht der Merker, sondern **dass geraten wurde**.

## Was ich geändert habe

DIE STADT führt selbst Buch und gibt es ausdrücklich heraus
(`stadt.js:1555 ff.`: „Kleiner Lesezugriff für die anderen drei Stücke: steht
das schon? Niemand muss dafür in fremdes DOM sehen."). Am laufenden Spiel
nachgeprüft:

    BRAUHAUS.stadt.rahmen.lage()
      { …, "sud|sud-brett": "zu", … }     Brett als Reiter
      { …, "sud|sud-brett": "auf", … }    nach dem Reiterklick

Also wird gefragt statt geraten (`rahmenWill()` in `sud.js`), und für den Fall,
dass die STADT schweigt — beim Laden vor ihrem ersten Takt, oder auf einem
Prüfstand ohne `stadt.js` — läuft die alte Lage nach **700 ms** ab (zwei Takte
der STADT plus Rest). Ein Zustand kann sich damit nicht mehr endlos
fortschreiben.

**Sperrliste 2 ist eingehalten:** `data-soll-aus`, `data-aus-grund` und
`data-verdeckt` stehen unverändert an jedem Knopf, `schalte()` ist Zeile für
Zeile dieselbe. Richtig geworden ist der Zustand, nicht die Auskunft.

Sofortprobe mit demselben Gerät, 200 Wochen je Epoche:
**E1 0 Klemmen · E4 0 Klemmen** (vorher: gefunden in Woche 61, löst sich nicht).
Die volle Abnahme über 8 × 400 Wochen steht unten.

---

# AUFLAGE 4 — die häufigste Bierentscheidung trägt kein Preisschild

`sud:anstich-jung` gegen `sud:anstich-alt` steht in 309 bis 369 von je 400
Wochen offen und kostet auf beiden Knöpfen ein Fass — und trug auf beiden
`data-preis` 0.

**`data-preis` bleibt 0, und zwar mit Absicht.** Der Kern schreibt dieses Feld
als MÜNZE (`kern/buehne.js:166` rendert `B.welt.geld(...)`), und dieses Stück
nimmt kein Geld aus der Kasse (WELLE-2 §1). Eine Zahl hineinzuschreiben, die nie
abgebucht wird, wäre genau der Scheinpreis, den **Sperrliste 3** verbietet — nur
an einer anderen Karte. Der Kritiker lässt in seiner Abnahme ausdrücklich den
zweiten Weg zu, und den gehe ich:

    data-preis-art="fass"      bezahlt wird in Bier, nicht in Münze
    data-preis-menge="1"       wie viele Fass
    data-preis-wort="1 Fass"   wie es am Schirm heißt (1970: „1,5 hl")

Dazu steht es jetzt **im Wort auf dem Knopf** („Junges Fass anbrechen · +14 ·
1 Fass"), nicht mehr nur im `title`. Und für den, der zählt, gibt es eine
Stelle, die beides zusammen liefert:

    BRAUHAUS.sud.preise()
    → [{zug:"sud:anstich-jung", geld:0, fass:1, wort:"1 Fass", offen:true, sollAus:false}, …]

Getragen wird es von allen Zügen, die wirklich Bier kosten, nicht nur von den
beiden: `sud:zettel-anstich` (nur wenn kein Bottich gärt), `sud:zettel-hefe-fass`,
`sud:charge-schnitt:<nr>` und `sud:zettel-charge-schnitt` (ein Drittel der
Charge). `sud:hefe-fuehren` trägt es **nicht** — es kostet wirklich nichts.

Nachgemessen am laufenden Spiel, alle vier Epochen, 0 Konsolenfehler:

| Epoche | `sud:anstich-jung` | `sud:anstich-alt` |
|---|---|---|
| 1350 | `fass 1 · „1 Fass"` | `fass 1 · „1 Fass"` |
| 1600 | `fass 1 · „1 Fass"` | `fass 1 · „1 Fass"` |
| 1884 | `fass 1 · „1,5 hl"` | `fass 1 · „1,5 hl"` |
| 1970 | `fass 1 · „1,5 hl"` | `fass 1 · „1,5 hl"` |

---

# AUFLAGE 2 — 1600 hat keine Bierentscheidung mit Preisschild

Sein Befund: `sud:schuettung:*` hatte in **0 von 400** Wochen überhaupt ein
Preisschild (alle drei Karten kosten 0), `sud:gaerung:*` in **0 von 400** Wochen
zwei Karten zugleich aktiv. Preisschilder des SUD nebeneinander: **0 in 364 von
400 Wochen**, 2 in genau einer.

## Warum es so war

Nicht Sparsamkeit, sondern eine Lücke in der eigenen Grammatik. 1350 hat sie
richtig: eine kostenlose Vorgabe, eine kostenlose **heimliche** Abkürzung, und
daneben den BRIEF, der dieselbe Sache legal macht und deshalb Geld kostet
(`grut` · `sack` · `brief`). 1884 dasselbe (`natureis` · `warm` · `maschine`),
1970 dasselbe. **1600 hatte die ersten beiden und den dritten nicht — Weizen war
dort nur zu stehlen, nie zu kaufen.**

## Was ich geändert habe

`sud:schuettung:weizenbrief`, **180 fl**, `fest: true`, `hoechst: 3`, ans Ende
der Reihe wie in allen drei anderen Epochen (kostenlos zuerst, dann aufsteigend
nach Preis). Er wird bei der Wahl **wirklich abgebucht**, über denselben Pfad
wie jede andere Festlegung — kein Scheinpreis (Sperrliste 3), und
`sud:gaerraum` wird in meiner Zählung ausdrücklich nicht mitgezählt.

**Was er historisch ist, und was er ausdrücklich nicht ist.** Er ist keine
Aussage über ein landesherrliches Weißbierregal — das lag anderswo und stand
einem Bürgerhaus nicht offen. Er ist das, was das Brett dieser Epoche ohnehin
beschreibt: das Korn ist bewirtschaftet, es liegt im Kornhaus der Stadt, und der
Rat gibt daraus zu, was er zugeben will. Bezahlt wird die **Zuteilung** und das
Schweigen der Bäckerzunft, nicht das Recht eines Fürsten. Das Gegenüber ist
schon da und bleibt: die Bierschau, die anzeigt, wenn Brotkorn im Kessel steht.

**Eine Falle, die ich dabei vermeiden musste.** Die Bauabnahme des Gärbottichs
hing an `option: 'rein'` — ein Haus mit dem Weizenbrief hätte damit **für immer**
keinen Gärbottich mehr kaufen können, weil `fest` den Weg zurück versperrt. Eine
Karte, die eine andere Kaufentscheidung stilllegt, ist keine Wahl, sondern eine
Falle. Die Kopplung nimmt jetzt eine Liste (`['rein', 'weizenbrief']`), und die
Lade sagt, warum: sie nimmt Anstoß am **heimlich** Gestreckten, nicht an dem,
was sie selbst mitgesiegelt hat.

---

# AUFLAGE 3 — `sud:fuehrung:rechner` ist nicht anzufassen

118.000 DM, die teuerste unwiderrufliche Karte des Spiels, in **0 von 800**
gemessenen Wochen aktiv **und** erreichbar.

## Was ich geändert habe: die Anrechnung

Der Preis bleibt, wo er war. Was fehlte, war die **Anrechnung**. Ein
Prozessrechner von 1970 wird nicht neben ein Labor gestellt, er wird
**daraufgesetzt**: Fühler, Messumformer und Schreiber hängen schon und sind
bezahlt, der Rechner rechnet damit. Wer das Labor hat, zahlt die Differenz.

    sud:fuehrung:rechner   preis 118.000   anrechnung: ['labor']
    ohne Labor             −118.000 DM
    mit Labor (42.000)      −76.000 DM   + Schild „Liste 118.000 DM · 42.000 DM angerechnet"

Damit kostet der Weg über die Leiter (42.000 + 76.000) **genau so viel wie der
Sprung** (118.000), und die Ratsche („Zurück geht es nicht — nur noch weiter
hinauf") ist zum ersten Mal ein Angebot statt einer Drohung.

**Sperrliste 4 ist eingehalten.** `sud:fuehrung:labor` verschwindet nicht und
wird nicht abgeräumt; `o.preis` bleibt 118.000, und **nur mit dieser Zahl**
rechnen `gesiegelt()` und `verdraengt()` — sonst wäre der Rechner nach der
Anrechnung „billiger" als das Labor und die Ratsche ließe sich rückwärts gehen.
Getrennt gehalten sind:

    o.preis            der Listenpreis — Rangfolge des Siegels, unverändert
    offenerPreis(a,o)  was jetzt abzubuchen ist — nur `kann`, `zahle`, das
                       Preisschild am Knopf und die Zugmeldung (§24)

Am laufenden Spiel geprüft (1970, mit der Maus gekauft):

* vorher: `rechner` `−118.000 DM`, `disabled`, `data-soll-aus="1"` (Kasse 86.000)
* Labor gekauft → Kasse 44.000, Siegelzeile
  `Labor eingerichtet: … Zurück geht es nicht — nur noch weiter hinauf.`
* `rechner` steht jetzt bei `−76.000 DM` mit dem Schild
  `Liste 118.000 DM · 42.000 DM angerechnet` — ehrlich gesperrt, weil die
  Kasse 44.000 hat
* `erfahrung` trägt `das Siegel liegt darauf`, ein Klick darauf tut nichts;
  ein Klick zurück auf `labor` tut nichts. **Die Ratsche hält.**

---

# DIE VIERTE LATTE — Lesbarkeit bei 1366×768

*Gemessen, und absichtlich nicht hier behoben. Begründung unten.*

## Das gemeinsame Gerät, wie im Auftrag verlangt

    HAFEN=8951 BREITE=1366 HOEHE=768 node werkbank/schuss/aufsicht/lesbarkeit.mjs

| Epoche | abgeschnittene Kästen | Textknoten < 12 px | aktive Knöpfe < 24 px |
|---|---|---|---|
| 1350 | 24 (davon `sud` 6) | 462 (440 < 10 px) | 4 von 82 |
| 1600 | 25 (davon `sud` 5) | 477 (453 < 10 px) | 4 von 83 |
| 1884 | 24 (davon `sud` 6) | 476 (452 < 10 px) | 2 von 87 |
| 1970 | 20 (davon `sud` 7) | 484 (461 < 10 px) | 4 von 82 |
| **Summe** | **93** | **1.899** | **14 von 334** |

## Und was davon MIR gehört

`werkbank/schuss/sud-w6-nach/lesbar-sud.mjs` misst nur `.sud-*`, einmal mit
zugeklapptem Brett (Vorgabestand) und einmal aufgeschlagen:

| | Vorgabestand | Brett aufgeschlagen |
|---|---|---|
| kleinste Schrift | **6,5 px** | 6,5 px |
| Textknoten < 12 px | 87–93 | 87–93 |
| aktive `sud:*`-Knöpfe < 24 px | **4 von 4** | **0 von 7** |
| abgeschnittene Kästen | 5–7 | 5–7 |

Die vier zu kleinen Knöpfe sind **alle vier Knöpfe des Kesselzettels**, also
genau die, die im Vorgabestand dastehen:

    Kasten .sud-zettel        178 × 127 px   (13 % × 16,5 % der Bühne)
    sud:zettel-anstich         83 × 20 px
    sud:zettel-hefe-fass       83 × 20 px
    sud:zettel-wechsel-frei   168 × 13 px (1970) bis 168 × 22 px
    sud:zettel-wechsel-kauf   168 × 22 px bis 168 × 23 px

Auf der Entwurfsleinwand 2752×1536 sind dieselben Knöpfe 41 bis 47 px hoch. Es
ist kein Fehler einer Regel, sondern der Maßstab — `--s` in `stil/grund.css`.
**Die Datei habe ich nicht angefasst.**

Die abgeschnittenen Kästen sind ausnahmslos `.sud-kartensatz`, also das
`-webkit-line-clamp: 3` aus `sud.css:95`, das der Kritiker geprüft und stehen
gelassen hat (der volle Satz hängt am `title`). Bei 1366×768 sind 10 bis 186 px
Text hinter der Auslassung.

## Warum ich den Boden gebaut, gemessen und wieder ausgebaut habe

Ein `min-height: max(calc(var(--s) * 24), 24px)` an den Zettelknöpfen liegt
nahe: auf der Entwurfsleinwand gewinnt die alte Rechnung, auf dem Notebook der
Boden, und wer `--s` hebt, hebt beides mit. Ich habe ihn gebaut und in allen
vier Epochen bei 1366×768 **und** bei 2752×1536 gemessen. Er hilft nicht.

Der Zettel ist ein **Flexkasten mit fester Höhe** (`max-height: 16.5%`,
`overflow: hidden`), und diese Höhe ist gedeckelt, damit die Fläche 2,145 %
bleibt und unter der Ortsmarken-Schwelle der STADT (2,4 %). Bei 1366×768 ist der
Kasten immer schon überfüllt. Jeder Pixel, den ein Knopf gewinnt, wird einem
anderen Kind genommen — gemessen, nicht vermutet:

| Variante | anstich | hefe-fass | wechsel-frei | wechsel-kauf | Verfahrenzeile |
|---|---|---|---|---|---|
| Vorgabe | 20 | 20 | 22 | 22 | 8 px |
| Boden nur am Paar | **24** | **24** | 19 | 19 | 11 px |
| Boden an allen vieren | **24** | **24** | **24** | **24** | **0 px** |
| … dazu die Zeile geschützt | 24 | 24 | 24 | 24 **abgeschnitten** | 11 px |

Zwei Knöpfe zu retten, indem zwei andere kleiner werden, ist keine Behebung. Ein
**abgeschnittener** Knopf ist schlechter als ein kleiner. Und die Zeile, die in
der dritten Variante auf 0 px fällt, ist genau die, an der ein Fremder das Bier
dieses Hauses abliest (`Offen gehopft, mit Hopfenbrief · Röhrenrecht an der
Quelle`) — Latte 2, Frage 4.

**Der Zettel trägt bei 1366×768 keine vier Knöpfe zu 24 px.** Wer das ändern
will, hat genau zwei Hebel, und beide liegen außerhalb meiner Dateien: `--s`
heben, oder den Flächendeckel des Zettels neu verhandeln — und der hängt an
einer Zahl der STADT. Beide Zahlen und die vier gemessenen Varianten stehen
jetzt im Kopf von `stil/sud-zusatz.css`, damit sie niemand zweimal erheben muss.

---

## Arbeitsstand

- [x] Auflage 1 — Klemme: Ursache behoben, Sofortprobe 0 Klemmen in E1 und E4
- [x] Auflage 2 — 1600 bekommt eine Bierentscheidung mit Preisschild
- [x] Auflage 3 — `sud:fuehrung:rechner` wird anfassbar
- [x] Auflage 4 — der Anstich sagt, was er kostet
- [x] Lesbarkeit bei 1366×768 gemessen und berichtet
- [ ] Nachmessung über 8 × 400 Wochen (läuft)
- [ ] Wellenzahl in drei Schnitten (12/13/14 Braujahre) (läuft)
- [ ] Siegelangriff erneut, weil ich `waehle()` angefasst habe (läuft)
- [ ] `tor.mjs`, `spielprobe.mjs`
