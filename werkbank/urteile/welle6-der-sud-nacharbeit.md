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

**Fremdlast, gemeldet von der Aufsicht während des Laufs.** Ein erster
vollständiger Satz der acht Partien lief, während DIE FUHRE auf derselben
Maschine `linie.mjs 4 400` fuhr (Lastmittel 4,08, vierzehn Browserprozesse).
Das ist genau die Bedingung, unter der dieser Lauf schon zweimal falsche Zahlen
bekommen hat. **Dieser Satz ist deshalb nicht die Belegzahl.** Er steht unten
als Vorprobe, weil er trotzdem etwas zeigt (alle vier Auflagen bereits erfüllt),
und der gewertete Satz wurde auf der freien Maschine wiederholt. Meine
Kampagne wartet seither vor jedem Start selbst darauf, dass keine fremde
Messung mehr läuft (`scratchpad`-Gerät `frei.sh`, prüft `ps` und `loadavg`).

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

# DIE FÜNFTE AUFLAGE — der Knopfboden der vierten Latte

*Kam von der Aufsicht, während ich arbeitete, und ist eine Zeile.*

Das Stück DIE LESBARKEIT hat in `stil/grund.css` einen Boden eingezogen —
`#buehne .knopf, #buehne [data-zug] { min-width: 24px; min-height: 24px }`,
mediengeschaltet unterhalb der Entwurfsleinwand — und die aktiven Knöpfe unter
der Zielfläche von 246 auf 14 von 334 gesenkt. **DER SUD hat ihn als einziges
Stück unterboten:** `sud.css:526` trug eine eigene ID-Regel
(`#buehne .sud-zettel .knopf.sud-tat.klein.voll { min-height: calc(var(--s) * 24) }`),
und eine ID sticht jede Klassenregel. `--s * 24` sind bei 1366×768 rund 13 px.
Die Aufsicht hat richtig gemessen: die Hälfte der verbliebenen 14 waren meine.

**Behoben, an genau der Stelle, an der es entstanden ist:**

    #buehne .sud-zettel .knopf.sud-tat.klein.voll {
      min-height: max(calc(var(--s) * 24), 24px);
    }

`max()` und nicht Löschen, weil die Regel einen eigenen Zweck hat (der Zettel
trägt vier Knöpfe statt drei und darf nicht mehr Luft nehmen als vorher): auf
der Entwurfsleinwand gewinnt weiter die eigene Rechnung — dort sind `--s * 24`
rund 47 px —, unterhalb davon gewinnt der fremde Boden. `stil/grund.css` habe
ich nicht angefasst.

Nachgemessen mit dem verlangten Aufruf, Hafen 8951, alle vier Epochen:

    BREITE=1366 HOEHE=768 node werkbank/schuss/aufsicht/lesbarkeit.mjs

| | vorher | nachher |
|---|---|---|
| aktive Knöpfe unter 24 px | **14 von 334** | **0 von 334** |
| abgeschnittene Kästen | 93 | 97 |
| Textknoten unter 12 px | 1.899 | 1.899 |

Je Epoche nachher: **0 von 82 · 0 von 83 · 0 von 87 · 0 von 82.**

## Was es kostet, gemessen und nicht verschwiegen

Die vier Überläufe mehr sind meine, und sie gehören zur Sache. Der Kesselzettel
ist ein **Flexkasten mit fester Höhe** (`max-height: 16.5 %`,
`overflow: hidden`), gedeckelt auf 2,145 % der Bühne, damit er unter der
Ortsmarken-Schwelle der STADT (2,4 %) bleibt. Bei 1366×768 sind das 178 × 127 px
für vier Knöpfe und vier Zeilen — der Kasten ist dort immer schon überfüllt, und
jeder Pixel, den ein Knopf gewinnt, wird einem anderen Kind genommen:

| Kind | Entwurf 2752×1536 | 1366×768 vorher | 1366×768 jetzt |
|---|---|---|---|
| `sud-zkopf` | 24 px | 13 px | 13 px |
| `sud-zverfahren` | 16–32 px | 8 px | **0 px** |
| `sud-zrang` | 19 px | 9 px | 9 px |
| `sud-zzahlen` | 38 px | 19 px | 19 px |
| die vier Knöpfe | 25–56 px | **13–23 px** | **24–28 px** |

Es fällt also die Zeile mit den laufenden Verfahren heraus — die Zeile, an der
ein Fremder das Bier dieses Hauses abliest. Sie war bei 1366×768 vorher 8 px
hoch und damit selbst weit unter der Latte; **was hier verloren geht, war dort
nie zu lesen.** Auf der Entwurfsleinwand ändert sich nichts: Zettel 358 × 253 px,
alle Kinder Pixel für Pixel wie vorher, `scroll == client`. **Latte 1 bleibt
unberührt.** Sobald `--s` steigt, kommt die Zeile von selbst zurück.

Zwei Wege, sie trotzdem zu retten, habe ich gebaut und gemessen und wieder
ausgebaut, weil beide schlechter sind als das, was jetzt dasteht:

* `sud-zverfahren` gegen das Schrumpfen schützen (`flex-shrink: 0`) → der
  **letzte Knopf wird abgeschnitten** (1884 und 1970). Ein abgeschnittener
  Knopf ist schlechter als eine fehlende Zeile.
* `sud-zzahlen` auf eine Zeile zwingen → holt die 11 px zurück, schneidet
  ebenfalls den letzten Knopf ab (1884, 1970) **und** ändert die
  Entwurfsleinwand (Zettel 247 → 237 px hoch). Damit rührte es an Latte 1.

Beide Messreihen stehen im Kopf von `stil/sud-zusatz.css`, damit sie niemand
zweimal erheben muss.

# DIE VIERTE LATTE — was meine Bretter sonst zeigen

`werkbank/schuss/sud-w6-nach/lesbar-sud.mjs` misst nur `.sud-*`, einmal mit
zugeklapptem Brett (Vorgabestand) und einmal aufgeschlagen, 1366×768:

| | Vorgabestand | Brett aufgeschlagen |
|---|---|---|
| kleinste Schrift | **6,5 px** | 6,5 px |
| Textknoten < 12 px | 87–93 | 87–93 |
| aktive `sud:*`-Knöpfe < 24 px | 0 von 4 *(nach der Behebung)* | 0 von 7 |
| abgeschnittene Kästen | 5–8 | 5–7 |

**Die Schriften habe ich nicht angefasst**, und zwar mit Absicht. Sie rechnen
ausnahmslos in `calc(var(--s) * n)` und heben sich mit `--s`; sie hier einzeln
auf `max(12px, …)` zu setzen hieße, dem Stück DIE LESBARKEIT ins Handwerk zu
pfuschen und dieselbe Zahl zweimal zu heben — und es kostet Überläufe, wie die
Aufsicht selbst schreibt. Die Hauptursache liegt ohnehin woanders
(`stuecke/fuhre.js:2460` schreibt die `--s`-Formel ab, statt sie zu lesen).

Die abgeschnittenen Kästen sind ausnahmslos `.sud-kartensatz`, also das
`-webkit-line-clamp: 3` aus `sud.css:95`, das der blinde Kritiker geprüft und
stehen gelassen hat (der volle Satz hängt am `title`). Bei 1366×768 sind 10 bis
186 px Text hinter der Auslassung. Das bleibt ein offener Punkt der vierten
Latte, und er gehört mit dem `--s`-Umbau zusammen: ein größeres `--s` macht ihn
größer, nicht kleiner.

---

# Wo ich den Kritiker ergänze — und wo ich ihm widerspreche

**Ich widerspreche ihm in keinem seiner vier Befunde.** Ich habe jeden davon
mit seinem eigenen Gerät nachgestellt, bevor ich etwas angefasst habe, und die
Klemme kam Ziffer für Ziffer wieder (E1, Woche 61, 10 tote Knöpfe, davon 6 mit
`data-soll-aus="0"`, löst sich in 8 s nicht, erst nach zwei Reiterklicks). Das
ist selten genug, dass es dasteht.

Drei Ergänzungen, die seine Zahlen nicht ändern, aber ihre Lesart:

**1. Sein Nebenbefund „drei von acht Achsen sind nie eine Wahl zwischen zwei
Knöpfen" ist jetzt zwei von neun.** Er hat ihn ausdrücklich *nicht* beanstandet
und richtig hergeleitet (`sud.js:1094`: die laufende kostenlose Karte ist
abgeschaltet, und wo nur zwei Karten stehen, bleibt eine druckbar). In 1600 hat
`schuettung` jetzt vier Karten statt drei — die Achse bleibt eine echte Wahl,
auch nachdem eine Karte läuft. `gaerung` (1600), `hefe` (1884) und `fuehrung`
(1970) haben weiter zwei bzw. drei Karten, von denen eine läuft; daran ändert
diese Nacharbeit nichts, und sie soll es auch nicht.

**2. Sein „harter Befund an 1600" löst sich mit auf.** Er schreibt: die 260 fl
der Kellergärung haben am Bier nichts geändert, weil `schuettung:hafer`
(kostenlos, `hoechst 1`) den Deckel setzt und der Deckel das Minimum ist — „wer
in 1600 auf einer Achse die schlechte KOSTENLOSE Karte nimmt, macht die
teuerste Festlegung der Epoche wertlos". Das stimmt und war das eigentliche
Problem hinter Auflage 2. Der Weizenbrief gibt der Achse zum ersten Mal eine
Karte, die man KAUFT und die `hoechst 3` trägt; die 260 fl der Kellergärung
haben damit ein Gegenüber, mit dem sie zusammen etwas bewirken.

**3. `data-preis` ist kein vollständiger Zähler, und das ist keine Schwäche des
Zählers.** Der Kritiker zählt Preisschilder als `data-preis`, und das ist die
richtige Zählung für Münze. Dieses Stück bezahlt drei seiner häufigsten Züge
aber in BIER (WELLE-2 §1 verbietet ihm die Kasse). Wer diese Zählung ehrlich
führen will, braucht beide Spalten — `data-preis` **und** `data-preis-art`. Die
zweite gibt es seit dieser Nacharbeit; `BRAUHAUS.sud.preise()` liefert sie
zusammen. Das ist keine Korrektur an ihm, sondern die Zeile, die ihm gefehlt
hat und die er in seiner Abnahme selbst verlangt.

Und eine Sache, in der ich ihm ausdrücklich zustimme, obwohl sie unbequem ist:
`B.sud.zustand()` gibt `Z` als Referenz heraus (`sud.js:931`), also lässt sich
aus der Konsole jedes Siegel umschreiben. Er nennt es und beanstandet es nicht.
Ich habe es ebenfalls nicht angefasst — ein Riegel gegen die Konsole wäre eine
Kulisse, und `zustand()` ist der Weg, auf dem jeder Prüfer dieses Stück
nachrechnet.

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
