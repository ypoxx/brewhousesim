# DER SUD — Nacharbeit zum blinden Urteil, Welle 6

*Laufend geschrieben.*

Gemessenes Urteil: `werkbank/urteile/welle6-der-sud-urteil.md`, Commit `05af148`,
**BESTEHT MIT AUFLAGE**. Vier Auflagen, achtteilige Sperrliste.

## Was ich annehme, bevor ich etwas anfasse

Der Kritiker bestätigt den Kern des Stücks, und das ist das Einzige, was ich
nicht anfassen darf: **das Siegel hält**. Vier `fest`-Karten mit der Maus
gekauft, sechs Rückwege versucht — keiner kommt zurück, weil der Riegel in
`waehle()` (`sud.js:939`) liegt und nicht im `disabled`. Sperrliste 1 gilt
Wort für Wort; `verdraengt()` und der Riegel sind unberührt geblieben, und die
Anrechnung von Auflage 3 rechnet ausdrücklich **nicht** mit ihnen (unten).

Alle vier Auflagen nehme ich an. Keine halte ich für falsch gemessen. Wo ich
eine Zahl anders lese, steht es unter „Wo ich den Kritiker ergänze".

## Mein Messstand

`messstand.sh` kann nur **Commits** ausliefern (`git archive`). Ein Builder
misst seinen Arbeitsbaum und darf git nicht anfassen — also steht mein eigenes
Gerät daneben (Sperrliste 7), nicht statt seinem:

    scratchpad/sudstand.sh 8951

Es friert `spiel/` als Kopie ein, legt dieselbe Marke `.messstand-marke` (md5
über meine fünf Dateien plus `stil/grund.css`) und **prüft am Ende, ob der
Hafen sie ausliefert**. Damit messe ich nicht gegen einen wandernden Baum,
während zwei andere Builder an `stil/grund.css` und `kern/ton.js` schreiben.
Alle Läufe sequenziell, nie zwei Browser zugleich.

---

## Die Klemme, vorher reproduziert

Bevor ich etwas ändere, habe ich seinen Fund mit **seinem** Gerät nachgestellt
(`werkbank/schuss/sud-w6/klemme.mjs`, Hafen 8951, Arbeitsbaum vor der Änderung):

    E1  Klemme in Woche 61: tot 10 Knoepfe (davon soll-aus=0: 6),
        Brett 23,124,902,645, Maus trifft true,
        loest sich NICHT in 8 s; nach Reiterklick 10/0

Ziffer für Ziffer sein Befund, bis auf die Bildmaße. **Der Kritiker hat recht,
und er hat die Ursache richtig benannt.**

### Was wirklich passiert

`klappeAuf()` der STADT (`stadt.js:526`) nimmt die Klasse `stadt-zugeklappt`
**nur ab, wenn sie da ist**. An einem frisch gezeichneten Sudbrett war sie nie
da — also räumt die STADT dort nichts ab und stempelt auch nichts. Der Merker
`data-sud-gesehen` kommt damit nie an den neuen Knoten, und der `else`-Zweig in
`sud.js:2078` schreibt ein `true` von einem längst weggeklappten Vorgänger
endlos fort. Deshalb lösen erst **zwei** Reiterklicks: der erste bringt die
Klasse zurück, erst dann kann der zweite sie abnehmen.

Der Fehler war nicht der Merker, sondern **dass geraten wurde**.

### Was ich geändert habe

DIE STADT führt selbst Buch und gibt es ausdrücklich heraus:

    BRAUHAUS.stadt.rahmen.lage()  ->  { …, "sud|sud-brett": "auf" | "zu", … }

(`stadt.js:1576`: „Kleiner Lesezugriff für die anderen drei Stücke: steht das
schon? Niemand muss dafür in fremdes DOM sehen.") Nachgeprüft am laufenden
Spiel: der Schlüssel steht in allen vier Epochen und wechselt mit dem Reiter.

Also wird gefragt statt geraten (`sud.js`, `rahmenWill()`), und der Gnadenschluss
für den Fall, dass die STADT schweigt, läuft nach **700 ms** ab — zwei Takte
der STADT plus Rest. Ein Zustand kann sich damit nicht mehr endlos
fortschreiben, auch wenn die STADT einmal ausbleibt.

**Sperrliste 2 ist eingehalten:** `data-soll-aus`, `data-aus-grund` und
`data-verdeckt` stehen unverändert an jedem Knopf, `schalte()` meldet
unverändert. Richtig geworden ist der Zustand, nicht die Auskunft.

---

## Arbeitsstand

- [x] Auflage 1 — Klemme: Ursache behoben, Sofortprobe 0 Klemmen in E1 und E4
- [x] Auflage 2 — 1600 bekommt eine Bierentscheidung mit Preisschild
- [x] Auflage 3 — `sud:fuehrung:rechner` wird anfassbar
- [x] Auflage 4 — der Anstich sagt, was er kostet
- [ ] Nachmessung über 400 Wochen, alle vier Epochen, beide Hände
- [ ] Wellenzahl in drei Schnitten (12/13/14 Braujahre)
- [ ] Lesbarkeit bei 1366×768
- [ ] `tor.mjs`, `spielprobe.mjs`
