# Votum — Der Spieldesigner, über die gebaute Demo

> **Stand beim Schreiben.** Dieses Votum beurteilt `prototyp/demo/index.html` — den
> Fuhre-Prototyp vom 27. Juli, der nie abgenommen wurde. Es schließt damit eine offene
> Schleife, ist aber **keine Anweisung an den laufenden Build**: die Werkbank hat seither
> `spiel/` gebaut, vier Epochen, und mehrere der hier gemessenen Befunde sind dort
> konstruktiv erledigt (der Durst ist keine ±1-Schaukel mehr, sondern eine wachsende
> Größe; das Jahr endet, wenn kein Haus mehr übrig ist). Wo Auflagen unten den laufenden
> Build betreffen könnten, ist das eigens vermerkt. Der aktuelle Stand steht in
> `spiel/STAND.md`.


Grundlage: `prototyp/demo/index.html`, gespielt statt gelesen. Ein volles Braujahr sauber
durch (zwölf Wochen, jede Woche der naheliegende Zug: wer am längsten wartet und in
Reichweite liegt, bekommt), dazu vier gezielte Sonden — die Absagen, die Vernachlässigung,
das Horten, die Tastatur. Danach der Quelltext auf das geprüft, was das Spielen nahegelegt
hat. Zahlen in diesem Votum sind gemessen, nicht geschätzt.

**Mein Maßstab, unverändert aus dem Votum zum Klickdummy**, damit man mich gegen mich selbst
prüfen kann:

1. **Kostet die Bedienung etwas?**
2. **Läuft eine Uhr?**
3. **Kann ich verlieren, während ich nichts falsch mache?**

---

## 1. Das Urteil, vorweg

| Prüfung | Klickdummy | Demo |
|---|---|---|
| 1 · Kostet die Bedienung etwas? | durchgefallen | **besteht** |
| 2 · Läuft eine Uhr? | durchgefallen | **besteht** |
| 3 · Kann ich verlieren, ohne Fehler? | durchgefallen | **durchgefallen** |

Zwei von drei, aus null. Das ist der größte Sprung, den dieses Projekt bisher gemacht hat,
und ich sage das ohne Einschränkung: **der Wagen mit drei Plätzen gegen vier verlangte Fässer
ist die erste echte Entscheidung in acht Monaten Entwurfsarbeit.** Sie kostet, sie ist
wöchentlich, sie lässt sich nicht zurücknehmen. Der Vorschlag hatte recht, und die Demo
beweist ihn.

Und dann macht sie den Beweis in derselben Datei wieder zunichte:

> **Die Klemme ist auf genau ein Fass die Woche eingestellt, und die Vergebung ebenfalls auf
> genau ein Fass die Woche. Damit hebt sich die Klemme selbst auf. Zwölf Wochen kompetenten
> Spiels sind zwölf identische Wochen.**

Gemessen, über ein volles Jahr (`pruefen.mjs`, Protokoll in `PRUEFLAUF.md`): die Kasse steigt
jede Woche um **exakt 264 M** — über zwölf Wochen ein einziger Differenzwert, ohne eine
Abweichung. Der Keller steht in jeder Woche, auf die noch ein Sud folgt, auf **exakt 6 Fass**.
Der höchste Durst, den irgendein Haus im ganzen Jahr erreicht, ist **1** — die Schwelle liegt
bei 3. Woche 11 ist Woche 1 mit einer anderen Zahl in der Ecke.

---

## 2. Warum sich die Klemme selbst aufhebt

Die Rechnung steht vollständig in vier Zeilen des Quelltextes und ist in einer Minute
nachzurechnen:

| Größe | Wert | Fundstelle |
|---|---|---|
| Wochenbedarf | 4 Fass (Krone 1 · Ochsen 2 · Löwen 1) | `HAEUSER[].will` |
| Wagenplätze | 3 | `WAGEN_PLAETZE` |
| Wochensud | 3 Fass | `ANSCHLAEGE[0].sud` |
| Durst je unbeliefertes Haus | +1 | `wocheAbschliessen` |
| Nachlass je beliefertes Haus | −1, nicht unter 0 | `wocheAbschliessen` |

Das Defizit beträgt jede Woche **genau eins**. Die Vergebung beträgt **genau eins je Haus**.
Wer das Darben reihum verteilt — der einzige Zug, der sich aufdrängt —, führt jedem Haus
jede zweite Woche seinen eigenen Rückstand wieder ab. Der Durst kann nicht wachsen. Die
Schwelle bei 3 ist unter kompetentem Spiel **nicht erreichbar**, nicht schwer erreichbar.

Das ist kein Balancing-Fehler, den man mit einer Zahl heilt. Es ist ein Bauprinzip: **ein
Verfall, dessen Heilungsrate so hoch ist wie seine Verfallsrate, ist kein Verfall, sondern
ein Pendel.** Und ein Pendel erzeugt Beschäftigung, keine Verpflichtung.

Die Probe aufs Exempel liefert die Demo selbst. Ich habe absichtlich schlecht gespielt — nur
die Krone beliefert, Ochsen und Löwen nie:

| Woche | Ochsen | Löwen |
|---|---|---|
| 2 | Durst 1 | Durst 1 |
| 3 | Durst 2 | Durst 2 |
| 4 | Durst 3 · **umworben** | Durst 3 · **umworben** |
| 5 | Durst 4 | Durst 4 |
| 6 | **an den Adler verloren** | **an den Adler verloren** |

Die Kette funktioniert tadellos: sie steigt, sie warnt zwei Wochen vorher, sie vollstreckt.
Sie ist sauber gebaut und gut lesbar. **Sie feuert nur, wenn man ihr beim Feuern hilft.** Ein
Verfall, den man von Hand auslösen muss, ist eine Vorführung.

---

## 3. Der Reichweiten-Kompromiss findet nicht statt

Das ist der schwerere Befund, denn er trifft die Abnahme.

§8 des Vorschlags verlangt: *„Eine Testperson geht in zwanzig Minuten den
Reichweiten-Kompromiss mindestens zweimal von sich aus ein."* In zwölf gespielten Wochen ist
er **null mal** vorgekommen. Nicht selten — nie. Der Grund ist wieder Arithmetik:

- Der Anschlag liefert wöchentlich **II Landbier · I Märzen**.
- Landbier trägt 8 km und erreicht damit Krone (1 km) und Ochsen (6 km) — die zusammen
  **3 Fass** verlangen, wovon zwei Land sind.
- Märzen trägt 32 km und erreicht als einziges den Löwen (24 km), der **1 Fass** verlangt.

Angebot und Bedarf sind **deckungsgleich nach Sorte**. Es gibt keine Woche, in der ein Fass
in der Hand liegt, das dorthin will, wo es nicht hinkommt. Die rote Linie steht schön im
Bild, aber sie schneidet nichts. Der Kompromiss, um dessentwillen die ganze Bühne gebaut
wurde, ist wegkonstruiert worden — nicht aus Nachlässigkeit, sondern weil der Anschlag genau
auf die Adressen gepasst wurde.

**Abnahme nach §8: nicht bestanden.** Das Kriterium ist am gebauten Stück nicht prüfbar,
weil die geprüfte Lage nicht vorkommt.

Die zweite Hälfte des Kriteriums — *„kann ungefragt sagen, warum Altenau nicht erreichbar
ist"* — fällt aus einem anderen Grund. Die Demo gibt zwei verschiedene Antworten auf diese
eine Frage:

| Ort der Auskunft | Auskunft |
|---|---|
| Beschriftung unter dem Haus | „kein Fass reicht so weit" — eine **Reichweiten**-Aussage |
| Absage beim Landbier-Fass | „Sonne zapft nicht unser Bier." — eine **Besitz**-Aussage |
| Absage beim Märzen-Fass | „Sonne zapft nicht unser Bier." — dieselbe |

`beladen()` prüft `!h.unser` **vor** der Reichweite, also gewinnt der Besitz immer. Eine
Testperson, die es versucht, lernt den falschen Satz — und zwar den, den §8 ausdrücklich
abfragt. Selbst nach dem Felsenkeller (Export, 65 km) bliebe die Absage dieselbe. Altenau
ist im gebauten Ausschnitt **keine Reichweitenfrage, sondern Kulisse.**

---

## 4. Was die Demo richtig macht, und das ist viel

Damit das Urteil nicht als Verriss gelesen wird — was hier zum ersten Mal steht, steht:

1. **Der Wochentakt trägt.** Eine Runde ist ein Handgriff und eine Antwort. Kein Blatt, kein
   Reiter, keine Tabelle dazwischen. Die Fahrt dauert lang genug, um Folge zu sein, und kurz
   genug, um nicht zu stören.
2. **Der Anschlag ist die richtige Form für „du stellst es ein".** Der Braumeister braut ohne
   Rückfrage. Genau das verlangt KONZEPT §2, und es ist nirgends sonst je gebaut worden.
3. **Das Protokoll auf dem Michaeli-Blatt ist der beste Einzelfund des ganzen Projekts.**
   Zwölf Kästchen je Haus, gefüllt oder rot — *wen du wann hast warten lassen.* Das ist der
   Jahresbericht als Anklage statt als Bilanz, und er kostet keine einzige neue Mechanik.
4. **Die Absage beim Löwen ist mustergültig:** *„Landbier hält 10 Tage — Griesbach liegt 24 km
   weit. Zu weit."* Regel, Grund und Maß in einem Satz, am Gegenstand, im Moment des
   Versuchs. So muss Belehrung aussehen. Sie kommt nur nie von selbst vor (§3).
5. **Zwölf Wochen laufen ohne einen Konsolenfehler durch.** Das ist bei 1 472 Zeilen
   handgeschriebenem SVG keine Selbstverständlichkeit.

---

## 5. Vier weitere Befunde, kurz

**a) Der Totalverlust ist kein Verlust.** In der Vernachlässigungs-Sonde waren nach Woche 6
Ochsen und Löwen beim Adler. Die Wochen 7 bis 10 liefen danach Zeile für Zeile identisch
weiter: Keller eingefroren bei 12 Fass, die Krone will eins, sie bekommt eins, alles
zufrieden. Wer alles
verliert, spielt dieselbe Woche in ruhiger. Es gibt keinen Zustand „verloren", nur einen
Zustand „weniger zu tun".

**b) Das saure Fass feuert nur beim Horten — und dann für immer gleich.** Die Bedingung ist
`Keller > 6 && Alter > 3`. Im normalen Spiel steht der Keller auf exakt 6, also greift `>`
nie: **die Verderbnis, das historische Herz des ganzen Konzepts, kommt bei sauberem Spiel
kein einziges Mal vor.** Beim Horten meldet sie ab Woche 5 jede Woche „2 Fass ist im Keller
sauer geworden" und hält den Keller bei 12 — eine Gebühr, kein Ereignis.

**c) Die letzte Entscheidung fällt, wenn Geld aufhört zu existieren.** Die Michaeli-Angebote
sind gut geschrieben und richtig bepreist (2 500 / 4 000 / 6 000 gegen 7 168 M Kasse — man
kann eines, nicht zwei). Aber gekauft wird in der letzten Sekunde der Demo, und danach kommt
der Ausblick. `Z.keller_tief = true` wird gesetzt und nie wieder gelesen. Der Kauf ist eine
Behauptung über ein Jahr, das nicht kommt. Das ist dem Zuschnitt geschuldet und kein Fehler
— aber es heißt, dass **Prüfung 1 für die Jahresebene weiterhin unbewiesen** ist.

**d) Die Tastatur führt ins Leere.** Gemessen: Tab erreicht den Anschlag, die sechs Fässer
und den Tonschalter, dann bricht die Folge um. Die Häuser haben **kein `tabindex`**, und
`abwurfMachen` hängt nur an `click`. Man kann ein Fass per Enter aufnehmen — `Z.gewaehlt`
wird gesetzt — und hat dann nichts, worauf man es legen könnte; die Ladung bleibt bei 0.
§7.2 des Vorschlags verlangt den Klick-Klick-Weg *„von Anfang an gleichberechtigt"*. Er ist
für die Maus gebaut. Das ist der einzige Befund in diesem Votum, der in zwanzig Minuten zu
beheben ist.

---

## 6. Auflagen

Nach Wichtigkeit, nicht nach Aufwand. Die ersten beiden entscheiden, ob die Bühne trägt;
alles andere ist Handwerk.

1. **Die Klemme muss wachsen können.** Solange Defizit und Vergebung beide 1 sind, gibt es
   kein Spiel. Der billigste Eingriff, ohne neue Mechanik: **der Nachlass muss langsamer sein
   als der Verfall** — etwa −1 nur, wenn ein Haus zwei Wochen hintereinander voll beliefert
   wurde. Dann kostet jede Auslassung mehr, als eine Lieferung gutmacht, und die Reihum-
   Strategie läuft nach fünf, sechs Wochen sichtbar auf. Alternativ, historisch schöner:
   **der Bedarf wächst mit dem Erfolg** — ein Haus, das gut beliefert wird, verlangt ab der
   vierten Woche eines mehr. Beides ist eine Zeile.
2. **Der Anschlag darf nicht auf die Adressen passen.** Solange II Land · I Märzen genau die
   Sorten liefert, die die drei Häuser brauchen, gibt es keinen Reichweiten-Kompromiss und
   damit keine Abnahme. Es genügt, den Löwen **zwei** Fass verlangen zu lassen: dann steht
   wöchentlich ein Landbier in der Hand, das nach Griesbach will und nicht hinkommt — genau
   die Sekunde, um die es geht. §8 wird damit prüfbar, ohne dass eine Regel dazukommt.
3. **Die Sonne muss eine Antwort geben, nicht zwei.** Entweder Reichweite oder Besitz. Wenn
   Altenau die Reichweitenfrage des Ausschnitts sein soll — und §8 sagt das —, dann muss
   `beladen()` die Reichweite **vor** dem Besitz prüfen und sagen: *„Märzen hält 21 Tage —
   Altenau liegt 38 km weit. Zu weit."*
4. **Die Häuser brauchen `tabindex="0"`, `role="button"` und einen `keydown`-Zweig.** Sechs
   Zeilen, und der zweite Bedienweg existiert wirklich.
5. **Der Verlust braucht ein Ende.** Wenn kein eigenes Haus mehr übrig ist, gehört das Jahr
   geschlossen — mit demselben Michaeli-Blatt und einem anderen Urteil. Ein Spiel, das nach
   dem Totalverlust weiterläuft, nimmt den Verlust zurück.
6. **Die Verderbnis muss im sauberen Spiel vorkommen.** `>` gegen `>=` ist die halbe Miete;
   die andere Hälfte ist, den Sud nicht exakt auf den Verbrauch zu setzen.

---

## 7. Der eine Satz

Der Klickdummy hat bewiesen, dass die Bilder tragen, und dabei verraten, dass es keine Regeln
gab. **Die Demo hat die Regeln — und stellt sie so ein, dass sie einander aufheben.** Das ist
der bessere der beiden Fehler: eine Klemme, die zu weich sitzt, zieht man an. Eine Klemme,
die es nicht gibt, muss man erfinden.

Mein Votum: **kein Durchfall, keine Abnahme. Nacharbeit an zwei Zahlen, dann noch einmal
zwölf Wochen — diesmal mit einer Testperson, die nicht weiß, was sie beweisen soll.**
