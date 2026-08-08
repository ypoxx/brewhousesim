# Die Gegenmessung der Aufsicht zur Welle 13 — nachher

*8. August 2026, am eingefrorenen Stand `b098fc6`, Hafen 8933, Saat 1350.
Geräte unverändert: `probe13.mjs` (geschrieben am 8.8. um 08:30 UTC, bevor ein
Ergebnis vorlag), `spiel-w12/wiederkehr.mjs`, `spiel-w12/hand3.mjs`,
`spiel-w12/zaehle.mjs`. Vergleichsgrundlage:
[`BEFUND-VORHER.md`](BEFUND-VORHER.md), erhoben am Vorzustand `7e21973`.*

---

## 1 · Was gehalten hat

| | vorher (7e21973) | nachher (b098fc6) |
|---|---|---|
| Textzeilen auf dem ersten Schirm | 613 | **419 / 434 / 436 / 445** |
| davon mit *Ziel · gewinnen · überleben · Übergabe* | **0** | **2 / 5 / 3 / 3** |
| Wochen mit Zielsatz (von 100) | — | **99 / 100 / 100 / 100** |
| `preis:tafel` lügt („schließen", nichts liegt) | **97 von 100** | **0 · 0 · 0 · 0** |
| Michaelitafel liegt am Jahreswechsel von selbst | 3 von 3, **nicht am Spielanfang** | **4 von 5 Jahresanfängen**, je Epoche |
| Angebote auf der Tafel | **eines** | **5** (Aufschrift „· 5 Angebote", alle vier Epochen) |
| Wochen ohne bezahlbaren Gegenzug, **enge** Lesart | **68 von 100** | **9 / 0 / 1 / 4** |
| Wochen ohne eine bezahlbare Preisoption | 68 von 100 (E1) | **2 / 0 / 0 / 1** |
| Deckung unter 1× (von 100 Wochen) | 57 (E1) | **57 / 38 / 0 / 1** |
| `BRAUHAUS.lage` · Seitenfehler | 0 · 0 | **0 · 0**, alle vier Epochen |

**Das Neuladen — A1/R1, die Probe, die im Urteil der Welle 12 riss:**

| Epoche | nach 12 Wochen | nach `location.reload()` | fortgesetzt |
|---|---|---|---|
| 1350 | 1350/12 · Kasse 1 · 12 Fass · Chronik 9 · Protokoll 41 | **ziffernweise gleich** | ja |
| 1600 | 1600/12 · Kasse 558 · 24 Fass · Chronik 7 · Protokoll 35 | **ziffernweise gleich** | ja |
| 1884 | 1884/12 · Kasse 2 994 · 79 Fass · Chronik 11 · Protokoll 40 | **ziffernweise gleich** | ja |
| 1970 | 1970/12 · Kasse 340 · 200 Fass · Chronik 15 · Protokoll 57 | **ziffernweise gleich** | ja |

**24 von 24 Feldern**, mit eigenem Gerät der Aufsicht. Der Spielstand steht.

Und er fasst die Wiederholbarkeit nicht an: die Messadressen von `probe13`
tragen `&neu=1`, `speicherSchluesselEnde` ist in allen vier Epochen **0**.

**Der eine offene Punkt in dieser Reihe:** die Tafel liegt an **4 von 5**
Jahresanfängen von selbst auf. Der fehlende ist der **Spielanfang** — genau
der Fall, den `BEFUND-VORHER.md` als das eigentliche Loch benannt hat. Der
Knopf lügt dort nicht (er sagt „heute ist Michaeli", und sie liegt wirklich
nicht), aber sie liegt auch nicht. Ob das ein Mangel ist oder die richtige
Rücksicht auf den Startanschlag, der dort steht, **entscheidet kein Zähler** —
das ist eine Frage an den blinden Kritiker K3.

---

## 2 · Der Klickanteil: eine Zahl, die an der Hand hängt — und diesmal so stark, dass sie nichts mehr misst

Die Auflage R13 lautet: *häufigster Knopf ≤ 35 %, drei häufigste zusammen
≤ 60 %.* Sie ist gegen die 71 %/78 % der Spielprobe geschrieben.

Gemessen mit `hand3.mjs`, über die **ersten 100 Wochen** beider Stände
(dieselbe Lesart für beide, sonst vergleicht man Tempo statt Vielfalt):

| Epoche | häufigster Knopf, vorher | nachher | drei zusammen, vorher | nachher |
|---|---|---|---|---|
| 1350 | 45,8 % | **34,6 %** | 89,5 % | 78,6 % |
| 1600 | 40,9 % | 42,7 % | 84,8 % | 87,5 % |
| 1884 | 38,8 % | 39,1 % | 80,2 % | 82,0 % |
| 1970 | 25,2 % | 37,7 % | 67,9 % | 81,6 % |

Gelesen wie sie dasteht, sagt diese Tabelle: eine Epoche besser, drei nicht,
1970 deutlich schlechter. **Sie sagt es zu Unrecht, und der Grund steht eine
Zeile tiefer.**

> ### DAS GERÄT IST FÜR DIE ARBEIT DIESER WELLE BLIND — der wichtigste Befund dieser Gegenmessung
>
> In **3 879 Klicks** über alle vier Epochen fällt **kein einziger** auf
> `plan:*` — die Wochenplan-Knöpfe, die DIE WOCHE gebaut hat und die in ihrer
> eigenen Messung die drei häufigsten sind (`plan:mager`, `plan:umkaempft`,
> `plan:rechnung`).
>
> **Das ist kein Befund über das Spiel, sondern über die Hand.**
> `hand3.mjs` greift nach **fest eingebauten Zugnamen**: `fuhre:wie-vorige`,
> `fuhre:abschicken`, `fuhre:fuellen`, `weiter`, dazu die Familien
> `fuhre:tafel-auf:`, `fuhre:jahresplan:`, `name:jetzt|anschlag`,
> `gegner:abloesen|zuvorkommen`, `preis:nimm|festlege`, `stadt:reiter:`. Es
> gibt in ihr **keinen Zweig, der `plan:*` je greifen könnte.** Ein Verb, das
> nach ihr erfunden wurde, existiert für sie nicht.
>
> Damit misst der Vorher/Nachher-Vergleich nicht, wie vielfältig die Woche
> geworden ist, sondern **wie oft das eigene Drehbuch der Hand durchkommt**.
> Und weil die Welle die Woche schneller und erreichbarer gemacht hat, kommt
> es öfter durch: dieselbe Hand spielt in denselben 20 Minuten in 1970 **326
> statt 128 Wochen**. Der Anstieg von 25,2 auf 37,7 % ist die Signatur des
> Geräts, **kein Rückschritt des Spiels**.
>
> **DIE WOCHE hat nicht geschönt.** Sie hat mit eigener Hand
> (`woche-w13/hand-w13.mjs`, „kein einziger Reiterklick") gemessen und das im
> Bericht offengelegt; ihre Zahlen 32,5 / 36,8 / 26,8 / 17,0 % gelten für
> diese Hand. Meine gelten für jene. **Beide sind wahr und keine ist die
> Antwort auf R13.**
>
> **Die Anweisung, an der ich mich fast selbst verrechnet hätte,** steht in
> `LAUFENDER-AUFTRAG.md` Schritt 4: `hand3.mjs`/`zaehle.mjs` seien
> *„unverändert"* zu fahren, *„weil sie die Ausgangszahlen erzeugt haben"*.
> Das ist für Zahlen richtig, deren Verben es damals schon gab — und falsch
> für jede Welle, die neue Verben baut. **Ein unverändertes Gerät misst
> unveränderte Verben.**

### Was daraus für R13 folgt

**Die Schwelle wird an dieser Messung nicht entschieden.** Kein Zählgerät
dieses Repos kann sie beantworten: `hand3.mjs` ist blind für die neuen Knöpfe,
und `hand-w13.mjs` ist die Hand dessen, der sie gebaut hat. Die Frage *„drückt
ein Mensch immer noch denselben Knopf"* gehört an das einzige Gerät, das
weder das eine noch das andere ist — **den blinden Kritiker K4**, der die
Knöpfe am Bildschirm sucht wie ein Spieler und nicht wie ein Drehbuch.

Bis dahin gilt R13 als **nicht entschieden**, nicht als bestanden und nicht
als gerissen. Wer sie jetzt für bestanden erklärte, zitierte die Hand des
Builders; wer sie für gerissen erklärte, zitierte eine Hand, die den
Gegenstand der Welle nicht anfassen kann.

---

## 3 · Was diese Reihe nebenbei für die Welle 14 mitgebracht hat

- **In 400 Wochen 1970 wird null unwiderrufliche Festlegung getroffen**, in
  den anderen drei je eine. Die EPOCHENBOGEN-Frage (F) hat damit ihre erste
  belastbare Zahl — und sie ist schlechter als die Spielprobe vermutete.
- **1970 verliert in zwölf Wochen 86 000 von 86 340**: die Startkasse ist in
  einem Vierteljahr weg. Für die Deckung heißt das nicht „arm", sondern
  „falsch skaliert" — eine andere Krankheit als in 1350.
- **Die Deckung unter 1× ist in 1884 auf 0 von 100 und in 1970 auf 1 von 100
  gefallen** (vorher 57 von 100 in 1350). Der Befund „man darf nicht spielen"
  gilt nach dieser Messung **nur noch für 1350** (57 von 100) und abgeschwächt
  für 1600 (38 von 100).
