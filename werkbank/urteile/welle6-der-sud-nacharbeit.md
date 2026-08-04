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

# DIE NACHMESSUNG

## Wie gemessen wurde, und was dabei schiefging

Alle Zahlen von meinem eigenen eingefrorenen Hafen 8951, Marke geprüft, alle
Läufe sequenziell. Gemessen wurde mit **den Geräten des Kritikers, unverändert**
(`sud-w6/sudhand.mjs`, `klemme.mjs`, `siegel.mjs`) und mit dem Vorbild der
zweiten Latte (`rueckkopplung-r3/linie.mjs`, md5 `374727fc…`). Nachgerechnet
habe ich mit eigenen Geräten daneben (Sperrliste 7):

* `werkbank/schuss/sud-w6-nach/nachpruefung.mjs` — die vier Auflagen an seinen
  Ausgabedateien. `sud:gaerraum` zählt bei Auflage 2 **nicht** mit
  (Sperrliste 3); seine Zählung mit Gärraum steht zum Vergleich daneben.
* `werkbank/schuss/sud-w6-nach/schnitte.py` — ρ über 12, 13 und 14 Braujahre.
  **Gegen die vorhandenen Zahlen geeicht:** an den Belegen des Kritikers
  liefert es +0,762 / +0,692 / +0,591 für 1350 und reproduziert damit die
  Tabelle in `gauntlet/MESSLATTE.md` Ziffer für Ziffer.
* `werkbank/schuss/sud-w6-nach/lesbar-sud.mjs` — die vierte Latte, nur `.sud-*`.

**Drei Sätze, und nur der dritte zählt.** Der erste lief unter der Last einer
fremden 400-Wochen-Messung (DIE FUHRE, `linie.mjs 4 400`, Lastmittel 4,08,
vierzehn Browser). Der zweite lief nach einer Absprache — und überlappte
erneut, weil beide Builder gleichzeitig wiederholten. Seit dem dritten geht
**jede** 400-Wochen-Messung durch die Sperre der Aufsicht,
`werkbank/schuss/aufsicht/messfenster.sh`, ein Aufruf je Messung,
hintereinander in der Schleife. Die ersten beiden Sätze stehen unten als
**Vorprobe** und sind ausdrücklich keine Belegzahlen.

## Die Wellenzahl, in drei Schnitten

Drei Läufe je Epoche, 400 Wochen = 14 Braujahre, `linie.mjs` unverändert,
ausgewertet mit `schnitte.py`.

**1350, fünf unabhängige Läufe (drei vor der Sperre, zwei durch sie):**

| Schnitt | Spearman | Spannweite |
|---|---|---|
| 12 Braujahre | **+0,762** | 0,000 |
| 13 Braujahre | **+0,692** | 0,000 |
| 14 Braujahre | **+0,591** | 0,000 |

Ziffer für Ziffer der Stand aus `MESSLATTE.md` und aus dem Urteil des
Kritikers. **DER SUD hat die Wellenzahl von 1350 nicht angefasst.** Dass 1350
bei zwölf Braujahren mit +0,762 reißt, stand schon vor dieser Nacharbeit da und
ist ausdrücklich nicht meine Baustelle — aber es steht hier mit seiner
Laufzeit, wie die neue Regel es verlangt.

**1600, zwei Läufe durch die Sperre:**

| Schnitt | Spearman | Spannweite | Stand vorher |
|---|---|---|---|
| 12 Braujahre | **+0,189** | 0,000 | +0,371 |
| 13 Braujahre | **−0,066** | 0,000 | +0,264 |
| 14 Braujahre | **−0,156** | 0,000 | +0,231 |

**Hier hat sich die Zahl gegenüber dem Urteil bewegt** (+0,371 / +0,264 /
+0,231 → +0,189 / −0,066 / −0,156). Sie bleibt in allen drei Schnitten weit
innerhalb der Latte und weiter von 0,7 entfernt als vorher — aber sie ist nicht
mehr dieselbe, und eine Bewegung will zugeordnet werden.

**Meine erste Erklärung war falsch, und die Gegenprobe hat sie widerlegt.** Ich
hatte vermutet, das Sudbrett von 1600 sei mit seiner vierten Karte höher
geworden, das ändere die Platzordnung der STADT und damit die Klickfolge der
Messhand. Das klang gut und war falsch: gemessen mit demselben Baum, in dem
**nur meine fünf Dateien** auf `05af148` zurückgesetzt sind, kommt

    1600 ohne meine Nacharbeit:  +0,189 / -0,066 / -0,156
    1600 mit  meiner Nacharbeit:  +0,189 / -0,066 / -0,156

**Ziffer für Ziffer dasselbe.** Die Bewegung stammt nicht aus diesem Stück. Wo
sie herkommt, steht unten bei 1970 — dort ist derselbe Nachweis noch schärfer.

**1884, ein Lauf durch die Sperre:** **+0,168 / +0,346 / +0,393** — Ziffer für
Ziffer der Stand aus `MESSLATTE.md`. Unverändert.

**1970, ein Lauf durch die Sperre:**

| Schnitt | Spearman | Stand vorher |
|---|---|---|
| 12 Braujahre | **+0,699** | +0,427 |
| 13 Braujahre | +0,637 | +0,154 |
| 14 Braujahre | +0,653 | +0,275 |

**+0,699 ist ein Tausendstel unter der Latte.** Eine solche Zahl darf niemand
mit „hält" abhaken, und ich habe sie deshalb nicht abgehakt, sondern
zugeordnet.

## Die Gegenprobe: wessen Zahl ist das?

Ich habe einen Hafen gebaut, der den **heutigen** Arbeitsbaum ausliefert —
mit `stil/grund.css` in seinem neuen Stand, mit `kern/ton.js`, mit allem —,
und in dem **nur meine fünf Dateien** auf `05af148` zurückgesetzt sind, den
Stand, an dem der blinde Kritiker gemessen hat
(`scratchpad/sudohne.sh`, Marke geprüft, Dateien per md5 gegen
`/tmp/messstand/05af148/` bestätigt). Damit ist genau eine Sache verschieden:
meine Nacharbeit.

| 1970, 400 Wochen, durch die Sperre | 12 J | 13 J | 14 J |
|---|---|---|---|
| heutiger Baum **mit** meiner Nacharbeit | +0,699 | +0,637 | +0,653 |
| heutiger Baum **ohne** meine Nacharbeit (SUD auf `05af148`) | **+0,699** | **+0,637** | **+0,653** |
| Stand des Kritikers am Commit `05af148` | +0,427 | +0,154 | +0,275 |

**Ziffer für Ziffer identisch. DER SUD hat an dieser Zahl keinen Anteil.** Die
Verschiebung von +0,427 auf +0,699 ist zwischen `05af148` und heute in einer
anderen Datei entstanden. Der wahrscheinlichste Kandidat steht in
`gauntlet/MESSLATTE.md` selbst: der Knopfboden
`#buehne .knopf { min-width: 24px; min-height: 24px }`, der seit heute
unterhalb der Entwurfsleinwand **jeden Knopf des Spiels** vergrößert und damit
jedes Brett, jede Platzordnung der STADT und damit jede Klickfolge der
Messhand. Ich behaupte es nicht — ich habe nur ausgeschlossen, dass es an mir
liegt, und lege die Zahl daneben.

**Für die Aufsicht, weil es dringend ist:** nach der neuen Drei-Schnitte-Regel
steht 1970 bei zwölf Braujahren auf **+0,699**, ein Tausendstel unter dem Riss,
und 1350 auf **+0,762**, also gerissen. Zwei von vier Epochen stehen damit an
oder über der Latte, und beide Male nicht wegen dieses Stücks.

## Die vier Auflagen — Vorprobe unter Fremdlast

*Diese Tabelle stammt aus dem ersten Satz (Last 4,08). Sie ist keine Belegzahl.
Sie steht hier, weil sie das Vorzeichen zeigt und weil ein Bericht, der eine
Messung verwirft, sagen soll, was in ihr stand.*

| Epoche · Hand | Auflage 1: Ablesungen `soll-aus=0` + `disabled` + Maustreffer | ≥2 Preisschilder DES SUD (ohne Gärraum) | Fehler | Abbruch |
|---|---|---|---|---|
| 1350 reich | **0** | 0/400 | 0 | nein |
| 1350 arm | **0** | 117/400 | 0 | nein |
| 1600 reich | **0** | 1/400 | 0 | nein |
| 1600 arm | **0** | **354/400** | 0 | nein |
| 1884 reich | **0** | 1/400 | 0 | nein |
| 1884 arm | **0** | 2/400 | 0 | nein |
| 1970 reich | **0** | **339/400** | 0 | nein |
| 1970 arm | **0** | 65+/400 | 0 | nein |

**Auflage 1: 0 Ablesungen über alle acht Partien** — gegen 24/38, 53/47, 46/39,
20/21 Wochen im Urteil.
**Auflage 2: 354 von 400 Wochen** in 1600 mit zwei Preisschilder DES SUD
zugleich aktiv und von der Maus erreichbar, Gärraum ausdrücklich nicht
mitgezählt. Die Latte war 60. Vorher: 0 Schilder in 364 von 400 Wochen.
**Auflage 3: `sud:fuehrung:rechner` in 7 von 400 Wochen aktiv UND erreichbar**
(vorher 0 von 800). Zum Vergleich `behandlung:pasteur` 85 Wochen.
**Auflage 4:** an allen vier Epochen am Knopf abgelesen, siehe oben.

### Was der erste Anlauf noch offen ließ — und was ihn geschlossen hat

Die erste Fassung der Behebung (nur `rahmenWill()`) ließ **46 bzw. 69**
Ablesungen übrig. Sie kamen nicht mehr aus dem alten Fehler, sondern aus dem
**Takt**: `stadt.js:557 schalte()` dreht die Lage im Klickzuge um und nimmt die
Klasse sofort ab, ohne ein `zeichne` zu schicken — DER SUD sah erst in seinem
eigenen 320-ms-Takt nach. In diesem Fenster stand das Brett offen im Bild, die
Maus traf seine Knöpfe, und sie waren noch alle abgeschaltet. Schlimmer: wer
daraufhin ein zweites Mal auf den Reiter klickt, klappt das Brett wieder zu —
genau dieses Pendeln stand in den Belegen (`aufOk: 0` nach fünf Klicks).

Behoben mit einem Beobachter am Brett, der nur auf `class` hört und den Takt in
denselben Mikrotask holt. Nachgemessen sofort danach, 120 Wochen:
**0 Klemmen, Brett in 120 von 120 Wochen aufbekommen** (vorher: 0 von den
betroffenen).

## Was die Behebung nebenbei kostet und einbringt

Der Klemmenfix gibt dem Spieler Züge zurück, die er vorher verloren hat, und
das ist an den Partien abzulesen. 1350 `arm` (kauft nie) endete beim Kritiker
mit `guete 90` und **zwei Anzeigen**; jetzt mit `guete 98` und **null**
Anzeigen, bei 996 statt 945 Fass. Das ist kein Geschenk, sondern die Hefe, die
der Spieler vorher nicht pflegen konnte, weil sein Brett tot dastand.

In 1600 löst sich zugleich der „harte Befund" des Kritikers: beide Hände endeten
vorher bei `höchstens Schankbier`, die 260 fl der Kellergärung waren am Deckel
wertlos. Jetzt:

| 1600 | Verfahren am Ende | Deckel | Stellhefe | Fassfaktor |
|---|---|---|---|---|
| reich | `weizenbrief` · `keller` | **Märzenbier** | 98 % | ×1,19 |
| arm | `hafer` · `ober` | Schankbier | 92 % | ×1,16 |

Zwei verschieden gespielte Partien derselben Epoche enden mit verschiedenem
Bier, und es steht am Kesselzettel.

## Eine Beobachtung, die nicht mir gehört

In 1884 `reich` sprang die Kennzahl im Braujahr 1896 auf **234,06×**. Der
Nenner war dort `Stückgut · bis 18 hl` für 52 M, Art `lage` — ein Zug DER
FUHRE, nicht meiner. In diesem Jahr meldete kein Stück einen umkämpften Zug,
und die Kennzahl misst dann den billigsten Zug, den es findet. Ich nenne es,
weil es in meiner Ausgabedatei steht; beheben kann es dieses Stück nicht.

---

## Container-Reset um 20:21 UTC — und was er über die Zahlen sagt

Der Container wurde zurückgesetzt, `/tmp` ist dabei verschwunden, und mit ihm
alle Ausgabedateien dieses Laufs. Der Arbeitsbaum wurde aus `origin`
wiederhergestellt.

**Die Marke sagt, dass es dieselbe Fassung ist.** Mein Hafen bildet einen md5
über `sud.js`, `sud-daten.js`, `sud.css`, `sud-zusatz.css` und `grund.css`. Vor
dem Reset lieferte er `582fdd6209cd`, nach dem Reset liefert er
`582fdd6209cd`. Der Baum ist Byte für Byte derselbe, an dem oben gemessen
wurde — die Zahlen in diesem Bericht sind Zahlen dieses Standes. Was fehlt,
sind die Rohdateien, nicht die Messung.

Neu gemessen nach dem Reset ist alles, was noch offen war; es steht unten.

## DAS SIEGEL — neu geprüft, weil ich `waehle()` angefasst habe

Das ist die Probe, die mir am wichtigsten war: Sperrliste 1 sagt, der Riegel
bleibt, wo er ist, und ich habe in derselben Funktion die Anrechnung
eingebaut. Also derselbe Angriff wie beim Kritiker, mit **seinem** Gerät
(`werkbank/schuss/sud-w6/siegel.mjs`, unverändert): die Festlegung wird in der
laufenden Partie **mit der Maus** gekauft, danach sechs Wege zurück.

| Epoche | mit der Maus gekauft | Versuche | zurückgekommen |
|---|---|---|---|
| 1350 | `wasser:roehre` · `wuerze:brief`, beide **[UNWIDERRUFLICH]** | 18 | **2 — beide Weg 6 (Konsole)** |

`roehre → bach` und `brief → grut` gelingen **nur** durch direktes Umschreiben
von `BRAUHAUS.sud.zustand().verfahren` aus der Konsole. Geschwisterkarte,
Kesselzettel, Tastatur, `disabled` entfernen plus `el.click()` plus
`dispatchEvent(MouseEvent)`, echte Maus auf den entsperrten Knopf — **keiner
kommt zurück.** Ziffer für Ziffer das Ergebnis des Kritikers.

Der Riegel liegt weiter in `waehle()` (`sud.js:939`, erste Zeile:
`if (verdraengt(a, o)) return;`) und damit **hinter** dem `disabled`, nicht
darin. Die Anrechnung steht drei Zeilen tiefer und rechnet ausdrücklich nicht
mit `o.preis`, sondern nur mit dem offenen Betrag — `gesiegelt()` und
`verdraengt()` sehen weiter den Listenpreis.

| Epoche | mit der Maus gekauft | Versuche | zurückgekommen |
|---|---|---|---|
| 1600 | `schuettung:weizenbrief` · `gaerung:keller`, beide **[UNWIDERRUFLICH]** | 18 | **2 — beide Weg 6 (Konsole)** |
| 1884 | `hefe:reinzucht` **[UNWIDERRUFLICH]** | 7 | **1 — Weg 6 (Konsole)** |
| 1970 | `fuehrung:labor` **[UNWIDERRUFLICH]**, `behandlung:filter` **[nur bezahlt]** | 20 | 5 |

**Die neue Karte hält wie die alten.** `schuettung:weizenbrief`, das Siegel, das
ich für Auflage 2 gebaut habe, kommt auf keinem Weg der Maus, der Tastatur oder
des synthetischen Klicks zurück — nur `weizenbrief → rein` aus der Konsole.
Dasselbe für `gaerung:keller` daneben, das ich nicht angefasst habe.

Die fünf Rückwege in 1970 sind **kein Siegelbruch**, und das ist derselbe Befund,
den der Kritiker schon gemacht hat: drei davon bewegen `sud:behandlung:*`, wo
`filter` `einmal: true` und **nicht** `fest: true` trägt — sein Schild heißt
darum „einmal zu zahlen" und nie „unwiderruflich". Wer einmal bezahlt hat, darf
danach wechseln; das ist die Ansage, und sie hält. Die beiden `fest`-Karten
`fuehrung:labor` und `behandlung:pasteur` kommen auch dort **nur** über die
Konsole zurück.

**Zusammengezogen: fünf Karten mit dem Wort „unwiderruflich" in vier Epochen,
63 Versuche, und kein einziger Weg der Maus führt zurück.** Der einzige Rückweg
ist `BRAUHAUS.sud.zustand().verfahren[achse] = …` aus der Konsole — kein Zug des
Spiels, und vom Kritiker ausdrücklich genannt und nicht beanstandet.

---

## Die beiden Pflichttore, nach dem Reset neu gefahren

    node werkbank/schuss/aufsicht/tor.mjs
      E1: OK   jahr=1350 zuege=105 lage=0 fehler=0
      E2: OK   jahr=1600 zuege=113 lage=0 fehler=0
      E3: OK   jahr=1884 zuege=116 lage=0 fehler=0
      E4: OK   jahr=1970 zuege=107 lage=0 fehler=0
      TOR OFFEN

    node werkbank/schuss/aufsicht/spielprobe.mjs
      E1: OK  60 Wochen, 60 Zuege, Jahr 1352, Kasse    48, lage 0, Fehler 0
      E2: OK  60 Wochen, 60 Zuege, Jahr 1602, Kasse   280, lage 0, Fehler 0
      E3: OK  60 Wochen, 60 Zuege, Jahr 1886, Kasse  4200, lage 0, Fehler 0
      E4: OK  60 Wochen, 60 Zuege, Jahr 1972, Kasse 50000, lage 0, Fehler 0
      SPIELPROBE BESTANDEN

`node --check` läuft auf allen drei geänderten `.js` sauber durch
(`sud.js`, `sud-daten.js`, `sud-zusatz.js`). **KERN:** `spiel/kern/**` und
`spiel/index.html` sind unberührt; die drei neuen Preisfelder
(`data-preis-art`, `-menge`, `-wort`) setzt DER SUD in seinem eigenen
`knopf()`-Mantel, `kern/buehne.js` musste dafür nichts tun.

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
