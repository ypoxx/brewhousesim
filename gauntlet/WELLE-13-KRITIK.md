# WELLE 13 — was die vier blinden Kritiker prüfen

*Geschrieben von der Aufsicht am 8. August 2026, **während die Builder noch
bauen** und bevor ein Ergebnis vorliegt. Wer das Maß erst schreibt, nachdem er
das Ergebnis kennt, misst nicht — er begründet.*

## Was „blind" hier heißt, wörtlich

Ein Kritiker dieser Welle **darf lesen**: `gauntlet/MESSLATTE.md`,
`spiel/LIESMICH.md`, dieses Blatt, und so viel Quelltext unter `spiel/`, wie er
braucht, um Knopfnamen zum **Bedienen** zu finden.

Ein Kritiker dieser Welle **darf nicht öffnen**: `werkbank/urteile/**` (also
kein Baubericht und kein fremdes Urteil), `werkbank/LAUFENDER-AUFTRAG.md`,
`gauntlet/WELLE-*.md` außer diesem, `werkbank/stand.json`,
`werkbank/schuss/aufsicht/welle13-gegen/**`, irgendeine git-Historie. Auch
`spiel/BEFUND-*.md` und `spiel/STAND.md` bleiben zu — es sind Befunde, kein
Quelltext.

**Der Grund ist nicht Förmlichkeit.** Der Spielkritiker der Welle 12 hat vier
Auflagen auf einer Zahl gebaut, die seine eigene Hand erzeugt hatte; die
Aufsicht hat es nur gefunden, weil sie unabhängig nachgemessen hat. Ein
Kritiker, der vorher liest, was der Builder gemessen hat, misst dessen Zahl
nach — und nicht das Spiel.

**Gespielt wird am eingefrorenen Stand**, den die Aufsicht nennt, nicht am
Arbeitsbaum. Fenster **1600×900** (der Notebook-Schirm, an dem die
Ausgangszahlen erhoben wurden), zusätzlich ein Blick bei **1366×768**. Echte
Mausereignisse auf echte Knopfflächen, mit `elementFromPoint`-Prüfung vor jedem
Klick — was nicht unter dem Zeiger lag, gilt als **nicht gegriffen**.

Teilergebnisse **laufend** in die eigene Urteilsdatei schreiben, nicht erst am
Ende. Agenten sterben mitten im Lauf; gesichert wird nur, was auf der Platte
liegt.

---

## Die Ausgangszahlen, gegen die gemessen wird

Alle am Vorzustand `7e21973` erhoben, 1600×900, Saat 1350. Die ersten fünf sind
von der Aufsicht mit eigenem Gerät **ziffernweise reproduziert** worden.

| | Vorzustand |
|---|---|
| Textzeilen auf dem ersten Schirm | **613** |
| davon mit *Ziel · gewinnen · überleben* | **0** |
| `localStorage` / `sessionStorage` / `cookie` | **leer**, auch nach 100 Wochen |
| Neuladen nach 12 Wochen | zurück auf 1350/1, Kasse 112 |
| `preis:tafel` trägt „Michaelitafel schließen" | **100 von 100** Wochen, davon **97** ohne liegende Tafel |
| Michaelitafel liegt am Jahreswechsel von selbst | **3 von 3** — aber **nicht am Spielanfang**, und mit **einem** Angebot statt fünf |
| fremde Reiter unter liegender Tafel | 4 Klicks, greifbare Züge 25→26→26→26→26 — **nichts geschieht** |
| Wochen ohne bezahlbaren Gegenzug (Preisschild ≤ Kasse) | **68 von 100** |
| häufigster Knopf, Anteil aller Klicks | **71 %** (zwei Knöpfe), 78 % (drei) |
| Reiter „DIE ÜBERGABE VOR DEM RAT" | 15 von 284 Wochen da, **0-mal bemerkt** |
| `BRAUHAUS.lage` · Seitenfehler | 0 · 0 |

---

## Die vier Prüfungen

### K1 · DER SPIELSTAND
1. Zwölf Wochen spielen, `location.reload()`. Stimmen Jahr, Woche, Kasse,
   Fässer, Chronik und Buch **Ziffer für Ziffer**? Zähle die Felder, die
   abweichen, und nenne sie einzeln.
2. Gibt es einen Knopf, der eine Partie verwirft — und **fragt er nach**?
   Was passiert bei *Nein*?
3. **Die Frage, an der diese Welle scheitern kann:** ergibt `?saat=1350`
   dreimal hintereinander **im selben Browserkontext** dieselbe Partie? Miss
   mit und ohne den Schalter, den das Spiel dafür anbietet, und sag, ob der
   Schalter nötig ist oder ob es auch ohne ihn hält.
4. Steht im Kopf sichtbar, dass fortgesetzt wurde?

### K2 · DER ERSTE SCHIRM
1. Zähle die sichtbaren Textzeilen des ersten Schirms und darunter die, die
   *Ziel*, *gewinnen*, *überleben* oder *Übergabe* enthalten. Vorher: 613 und 0.
2. **Verstehst du nach fünf Minuten, was Gewinnen heißt?** Schreib die Antwort
   als Satz, nicht als Zahl.
3. Verdeckt der neue Anfang etwas? Prüfe, ob unter jedem neuen Kasten Knöpfe
   liegen, die vorher greifbar waren.
4. Kommt der Zielsatz in **jeder** Woche, oder nur in manchen?

### K3 · DIE TAFEL UND DIE TOTEN REITER
1. Spiele zehn Braujahre **ohne einen einzigen Reiter anzufassen**. Wie oft lag
   die Michaelitafel von selbst da — am Spielanfang und an jedem Jahreswechsel?
   Wie viele Angebote standen dabei wirklich auf dem Tisch?
2. Lies in **jeder** Woche die Aufschrift von `preis:tafel` und halte sie gegen
   die Frage, ob wirklich etwas liegt. Zähle beide Richtungen der Lüge.
3. Klicke bei liegendem Blatt vier fremde Reiter und zähle die greifbaren Züge
   davor und danach. Vorher: 25→26→26→26→26.
4. Wenn nichts bezahlbar ist — sagt die Tafel, **woher das Geld kommen soll**,
   und ist der genannte Weg in derselben Woche wirklich greifbar?
5. Bei 1600×900 **mit** gezeichneter Rollleiste und bei 1366×768: schneidet ein
   Kasten der Tafel Text ab?

### K4 · DIE WOCHE UND DER GEGENZUG
1. Spiele 100 Wochen je Epoche und führe ein Klickprotokoll. Welchen Anteil hat
   der häufigste Knopf, welchen die drei häufigsten zusammen? Vorher: 71 % / 78 %.
   Wenn das Spiel Wochen zusammenfasst statt sie klicken zu lassen, zähl die
   übersprungenen **nicht** mit und sag, wie viele es waren.
2. Zähle je Woche die Züge gegen den Gegner, die **greifbar, nicht abgeschaltet
   und bezahlbar** sind — Preisschild nicht größer als die Kasse. Ein Zug ohne
   Preisschild zählt nur mit, wenn er **wirklich ausführbar** ist. In wie vielen
   von 100 Wochen gibt es keinen? Vorher: 68.
3. Trägt der Reiter *OHNE DICH GESCHEHEN* in Woche 45 dieselbe Form wie in
   Woche 15?
4. Spiele 1350 bis 1355, **ohne einen Reiter anzufassen** — fällt dir das
   Übergabeangebot auf? Antworte als Spieler, nicht als Zähler.
5. **Bleibt der Gegner ein Gegner?** Er hat die Latte im Vorzustand klar
   bestanden: 27 Züge in 50 Wochen, in 23 von 25 Wochen mit neuem Text auf der
   Karte, ohne dass ein Brett aufgeklappt wird. Wenn er jetzt leichter zu
   schlagen ist, ist das ein Verlust und gehört benannt.

---

## Was jeder Kritiker außerdem mitmisst, ohne Ausnahme

* `BRAUHAUS.lage.length` und Seitenfehler in **allen vier Epochen** — 0 und 0.
* Ob eine Zahl, die er nennt, **wiederholbar** ist. Wo er nur einen Lauf hat,
  schreibt er das hin. Der Kritiker der Welle 12 hat das vorbildlich getan, und
  genau dieser Satz hat der Aufsicht später geholfen.
* **Ein eigener Abschnitt „Was an meiner Prüfung schwach ist", vor den
  Auflagen.** Er ist Pflicht. Die Schwäche, die den letzten Kritiker vier
  Auflagen gekostet hat, stand in seinem eigenen Abschnitt X — er hatte sie
  gesehen und trotzdem gemessen, als wäre sie nicht da: *„sie fasst nichts an,
  wonach sie nicht ausdrücklich sucht."*
