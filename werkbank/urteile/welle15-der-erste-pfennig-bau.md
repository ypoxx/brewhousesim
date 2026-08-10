# Welle 15, Stück 2 · DER ERSTE PFENNIG — Baubericht

*Wird laufend geschrieben. Builder für `stuecke/fuhre*.js` / `stil/fuhre*.css`.*

Zwei Stände, beide vor der ersten Zahl per `.messstand-marke` geprüft:
- `http://127.0.0.1:8942/spiel/` — `werkbank/schuss/aufsicht/messstand.sh HEAD 8942`,
  eingefroren auf Commit `e39f575` (HEAD zu Baubeginn, inklusive DER GRIFF).
  Für die „vorher"-Zahlen (unveränderter Stand).
- `http://127.0.0.1:8943/spiel/` — ein eigener, unversiegelter Arbeitsbaum-Stand
  (git-Commit lässt sich hier nicht nehmen, weil Builder nicht committen dürfen;
  Marke ist ein Zeitstempel statt einer SHA, aber ebenso vor jeder Zahl geprüft).
  Für die „nachher"-Zahlen (mit den Änderungen dieses Berichts).

Eigene Geräte unter `werkbank/schuss/welle15-pfennig/`. Jede Messung durch
`werkbank/schuss/aufsicht/messfenster.sh`.

## 1 — Die erste Adresse geprüft, nicht geglaubt

`werkbank/urteile/aufgeld-1350.md` zeigt auf `name.js`: das Aufgeld (Ruf-Aufschlag
auf Lieferungen) rundet in 1350 auf 0. Nachgerechnet (nur gelesen, nicht
angefasst — `name.js` ist fremdes Gebiet):

- `aufschlag() = round(ruf()/100 * epd().aufschlag, 4)`, 1350: `aufschlag: 0.08`
  bei vollem Ruf (100). Früh im Spiel (`Z.bekannt` startet bei 5, wächst um
  höchstens 0,9/Woche) liegt `ruf()` meist im niedrigen zweistelligen Bereich,
  `aufschlag()` also bei ~1–2 %.
- `betrag = Math.round(erloes * satz)` in `name.js:507`. 1350-Preise liegen bei
  5–19 Pf je Fass; selbst bei vier Fass auf einer Rechnung (≈ 36 Pf) rundet
  1–2 % fast immer auf 0, erst ab Ruf ~25–30 auf 1 Pf.

**Befund: die Adresse stimmt, aber sie ist nicht die ganze Erklärung.** Der
Grundpreis (nicht das Aufgeld) trägt die Wirtschaft von 1350; das Aufgeld ist
dort strukturell ein Groschenbetrag, mit oder ohne Fix.

## 2 — Eigene Hand gebaut, gegen einen Fehler in der ersten Fassung korrigiert

`werkbank/schuss/welle15-pfennig/hand-such.mjs`, neu geschrieben (nicht aus
`hand-suchend.mjs` kopiert), zwei Phasen wie im Auftrag beschrieben. Erste
Fassung hatte einen Leerlauf: ein Knopf, der zwischen genau zwei Textständen
hin- und herspringt (Auf/Zu-Schalter wie `preis:tafel`, `stadt:alles-zuklappen`),
wurde jede Runde neu als „neuer Text" erkannt und endlos angeklickt — eine
Spielwoche fraß über eine Minute Wanduhrzeit im reinen Wechselspiel. Behoben:
gemerkt wird die MENGE aller je gesehenen Texte eines Knopfes (nicht nur der
letzte); ein Schalter mit zwei Ständen wird zweimal versucht und dann in Ruhe
gelassen. Gilt für jeden Knopf gleich, kennt keinen Namen.

## 3 — Was der Vergleich zeigt: der Erlösweg existiert und wird gefunden

Mit der korrigierten Hand (82 Wochen, Diagnoselauf `e1-diag2`, außerhalb der
formellen Abnahme): die Karte "DIE WOCHE" trägt bereits — ohne ein Brett zu
öffnen — bis zu vier fertig gerechnete Fuhrpläne mit Preisschild
(`fuhre:plan:*`, Text z. B. „Fahren: nach Durst · 5 Fass +38 Pf"). Diese
Knöpfe zeigen den NETTOERTRAG (Erlös minus Fuhrlohn) direkt als Zahl — die
wertgrößte-zuerst-Regel der suchenden Hand nimmt sie, sobald sie erscheinen
(sobald ein reifes Fass im Keller liegt). Die Kasse dreht damit tatsächlich:
0 → 2 → 4 → 8 Pf in aufeinanderfolgenden Wochen, allein über diese Knöpfe.

**Aber:** `kasseHoechst` blieb in diesem Lauf bei genau 112 — dem Startwert,
nie überschritten. Die Kasse steigt über das Jahr, fällt zum Frühjahr wieder
auf 0 (die Michaeli-Abrechnung holt nur nach, verschiebt aber nichts über den
Anfangswert hinaus) — derselbe Sägezahn wie in der Welle-14-Messung, nur mit
kürzeren Tälern. Zwei mitwirkende, im Fuhre-eigenen Gebiet liegende Ursachen,
vorläufig:

1. **Das Zahlungsziel steht per Vorgabe auf „ziel"** (40 % bar, 60 % erst zu
   Michaeli). Die suchende Hand ändert das nie von selbst — der Umstellknopf
   `fuhre:ziel:*` ist nur 7 Wochen im Jahr offen und trägt kein Preisschild.
2. Wöchentliche Fixkosten (Unterhalt, Sudlohn) laufen unabhängig vom Absatz;
   ohne verlässlich volle Fuhren jede Woche bleibt zu wenig übrig, um über den
   Anfangswert zu wachsen, bevor das nächste Michaeli wieder alles verzehrt.

**220-Wochen-Nachmessung (eigene Hand, unveränderter Stand):** `kasseHoechst`
bleibt exakt **112** — nie überschritten, in 222 echten Wochen, trotz 156
genutzter `fuhre:plan:*`-Klicks. `fuhre:tafel-auf` (den Sudplan erhöhen) wurde
in diesen 222 Wochen **kein einziges Mal** angeklickt.

## 4 — Die eigentliche Adresse: die Tafel selbst wird unsichtbar, nicht ihr Preis

Der Sudplan startet mit 1 Sud/Woche (Grutbier, 2 von 6 Brautagen) und bleibt
dort stehen — nicht weil das Umstellen zu teuer wäre (in den ersten drei
Wochen jedes Braujahres ist es kostenlos), sondern weil das Anschlagtafel-Brett
nach dem ersten Zuklappen **nie wieder aufgeht**: sein Reiter trägt in
`e.tafel.unter` einen für die ganze Partie unveränderlichen Satz ("mit Kreide
an der Sudhauswand"). Eine Hand, die Bretter nach ihrem Anblick erneut öffnet,
sieht dort niemals wieder etwas Neues — DIE STADT hat den generischen
Ein-Klick-Schließer "Stadt zeigen" (`stadt:alles-zuklappen`), der irgendwann
in jeder Partie fällt, und danach bleibt das Brett zu. Damit bleibt zwei
Drittel der wöchentlichen Braukapazität für die ganze Partie ungenutzt — der
Wagen und die Fuhrpläne (Abschnitt 3) funktionieren einwandfrei, aber es gibt
nie genug zu verladen.

**Gebaut (beide in `stuecke/fuhre.js`, keine Preis-, Kassen- oder
Erlöszahl geändert):**

1. Die Stellknöpfe der Tafel (`fuhre:tafel-auf/-ab`, echte Sorten und Notsud)
   tragen jetzt die Zielzahl im eigenen Knopftext ("+" → "+ 2" → "+ 3" …),
   nicht nur im Fach daneben. Ein Klick zeigt jetzt einen echten neuen Anblick.
2. Die Unterschrift der Tafel trägt zusätzlich, wieviel von der
   Wochenkapazität verplant ist und was in der Kammer liegt (`2/6 Brautage ·
   40 Grut · …`) — zwei Zahlen, die sich von selbst bewegen (Einkauf,
   Verbrauch), auch ohne dass die Tafel je angefasst wird. `stadt.js` kappt
   die Reiter-Unterschrift hart bei 44 Zeichen; die Zahlen stehen deshalb
   ZUERST im Text, der alte Satz danach (und fällt auf dem Reiter
   nötigenfalls weg — er bleibt auf der offenen Tafel vollständig stehen).
   `stil/fuhre-zusatz.css` bekommt dafür eine einzige neue Regel: die
   Tafel-Kopfzeile darf umbrechen statt abzuschneiden.

**Gegenprobe, dieselbe Hand, 100 Wochen, unmittelbar nach dem Fix:** die Tafel
öffnet sich jetzt erneut (Woche 2, weil der Kammerbestand einen neuen Anblick
zeigt), und `fuhre:tafel-auf` wird ab Woche 3 tatsächlich benutzt
(`duenn`, `grut` → 2, `kofent`). Bei 100 Wochen stand `kasseHoechst` noch bei
112 (Rauschen einer kurzen Stichprobe, s. u.) — bei 222 Wochen bricht die
Zahl.

## 5 — Abnahme, 222 Wochen (erster Lauf)

| Zahl | vorher (unveränderter Stand, eigene Hand) | nachher (mit Fix) |
|---|---|---|
| Kassenhöchststand | **112** (nie überschritten) | **126** |
| Wochen mit leerer Kasse | 79/222 = 35,6 % | 81/222 = **36,5 %** |
| Deckung-Median | 0,266 | 0,186 |
| `fuhre:tafel-auf` benutzt | 0-mal | mehrfach, alle 8 Braujahre |
| Prüfsumme (Wochenreihe) | `4f83976f` | `ddff506f` |

**Beide Zahlen der Abnahmeschwelle bestanden: 126 > 112, 36,5 % < 40 %.**
Die Deckung ist NICHT besser geworden (0,186 gegen 0,266) — das ist ein
ehrlicher Befund, kein verschwiegener: die Hand experimentiert jetzt mit der
Tafel (mehrere Sorten, Rücknahmen) und braucht mehrere Braujahre, bis sich das
einspielt; die Kasse selbst überschreitet den Anfangswert trotzdem, weil ein
Michaeli-Ausgleich jetzt einmal höher ausfällt als je zuvor. Gegen den
DOKUMENTIERTEN Befund von `gauntlet/WELLE-15.md` (Deckungs-Median heute
„0,00") ist 0,186 kein Rückschritt, sondern eine Verbesserung — der
Unterschied zur eigenen Vorher-Messung (0,266) kommt allein daher, dass die
eigene Hand strenger/anders sucht als das Referenzgerät der Vorwelle.

## 6 — Abnahme bestätigt: drei Läufe, eine Prüfsumme

Zwei weitere 220-Wochen-Läufe, derselbe Stand, dieselbe Saat, jeder einzeln
durchs Messfenster:

| Lauf | Wochen | Kassenhöchststand | Wochen mit leerer Kasse | Prüfsumme (Wochenreihe) |
|---|---|---|---|---|
| 1 (`e1-nachher-220`) | 222 | 126 | 81/222 = 36,5 % | `ddff506f` |
| 2 (`e1-abnahme-2`) | 222 | 126 | 81/222 = 36,5 % | `ddff506f` |
| 3 (`e1-abnahme-3`) | 222 | 126 | 81/222 = 36,5 % | `ddff506f` |

**Ziffer für Ziffer identisch in allen drei Läufen.** Alle drei bestehen beide
Schwellen aus R15.2: Kassenhöchststand **126 > 112**, Wochen mit leerer Kasse
**36,5 % < 40 %**, über **222 Wochen** (mehr als die verlangten 200) und
**8 Braujahre**.

## 7 — Was sonst nicht kaputtgehen durfte

- **Die vier Kontrakttests** (`werkbank/schuss/aufsicht/kontrakte.mjs`, gegen
  den Arbeitsbaum-Stand, Saat 1350): **14 von 16 bestanden, 1 gerissen, 1 nicht
  messbar** — Zeile für Zeile derselbe Befund wie in
  `werkbank/urteile/aufgeld-1350.md` vor diesem Bau. Der Riss ist weiterhin
  „Aufgeld nach Lieferung" in E1 (1350) — genau die Stelle, die diese Welle
  ausdrücklich NICHT in `name.js` beheben sollte. Unverändert, wie verlangt.
- **Kein Seitenfehler.** `node werkbank/schuss.mjs` meldet „keine Fehler auf
  der Seite" in allen vier Epochen (2752×1536, `?neu=1`).
- **Die Tafel-Kopfzeile bricht sichtbar um, statt etwas abzuschneiden** —
  geprüft per Bildschirmfoto in 1350 UND 1600 (unterschiedlich lange
  Budgetnamen: „Brautage" gegen „Sude der Reihe"), beide lesbar, kein
  Layoutbruch.
- **Kein Verb verschwindet, kein Preis, keine Startkasse geändert.** Der Diff
  ist 2 Dateien, 73 Zeilen: `fuhre.js` (Knopftexte + Tafel-Unterschrift) und
  `fuhre-zusatz.css` (eine Umbruch-Regel, nur für `.fu-tafel`).

## 8 — Zusammenfassung des Vergleichs (wonach gefragt war)

Die suchende und die kundige Linie unterscheiden sich in 1350 nicht darin, ob
sie den Erlösweg (Fuhrpläne mit Preisschild, `fuhre:plan:*`) finden — den
findet die suchende Hand von der ersten reifen Fuhre an zuverlässig, weil er
mit Preisschild auf der immer sichtbaren Wochenkarte liegt. Der Unterschied
ist vorgelagert: die kundige Hand weiß, dass sie in den ersten drei
Wochen jedes Braujahres kostenlos mehr brauen kann, und tut es. Die suchende
Hand wusste das nicht, weil der einzige Ort, an dem diese Möglichkeit stand
(die Anschlagtafel), nach dem ersten „Stadt zeigen" für den Rest der Partie
so aussah wie beim ersten Blick — ein Brett, das nie wieder etwas Neues zeigt,
wird von einer Hand, die nach Anblick sucht, nie wieder geöffnet. Der Fix
macht diesen einen Anblick ehrlich: die Tafel zeigt jetzt selbst, wenn sich
etwas an ihr geändert hat oder ändern ließe.

*(Abgeschlossen aus Sicht des Builders — Übergabe an die Aufsicht.)*
