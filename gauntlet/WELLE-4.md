# Welle 4 — die Kennzahl von oben, und eine Latte, die nie gemessen wurde

Aufgestellt von der Aufsicht am 3. August 2026, nach der eigenen Nachmessung von
Welle 3 am Stand `ee1715b`. Jede Zahl hier ist am Bildschirm gezählt.

---

## Der Befund, aus dem diese Welle folgt

**Welle 3 hat drei von vier Epochen in das Band gebracht — und die vierte oben
herausgedrückt.** Vier Läufe des sorgfältig spielenden Automaten
(`werkbank/schuss/eichung/preis-linie.mjs`, je 400 Wochen, 14 Jahre, 0 Fehler):

| Epoche | Start → Ende | min–max | rho | Jahre unter 1× | Latte |
|---|---|---|---|---|---|
| 1350 | 5,89 → 2,69 | 0,75–7,88 | **−0,152** | 1 von 14 | **besteht** |
| 1600 | 3,76 → **27,81** | 2,27–**67,33** | **+0,873** | 0 von 14 | **reißt** |
| 1884 | 8,35 → 2,06 | 0,63–10,18 | **+0,143** | 1 von 14 | **besteht** |
| 1970 | 2,25 → 2,54 | 0,81–6,53 | **−0,112** | 1 von 14 | **besteht** |

Vor Welle 3: 1350 −0,795 mit 6 von 12 Jahren unter 1×, 1884 −0,367, 1970 −0,572
mit 9 von 11. **Keine Epoche hat jetzt mehr als ein Jahr von vierzehn unter 1×.**

Und 1600, das in Welle 2b als einziges sauber bestand (+0,165), läuft jetzt
davon: die Leiter geht von 3,76 auf 27,81 und in der Spitze auf **67,33×**. Die
Barschaft wächst schneller als die Preise — **der Patrizier-IV-Fall, gegen den
die Messlatte geschrieben wurde**, jetzt in einer Epoche statt in keiner.

Ebenfalls erledigt und nachgeprüft (Welle 3): das Urteil über die Partie ist in
allen vier Epochen sichtbar, jede Epoche hat ihren eigenen Ausgang, die Kasse
hat einen Boden, und die Entwicklernotiz aus `name.js` ist weg.

---

## Die Stücke

Regeln wie immer (`spiel/LIESMICH.md`): `index.html` eingefroren, `kern/**` nur
über die Aufsicht als „KERN: …", **kein `git`**. Je Stück ein Builder und ein
getrennter **blinder** Kritiker mit frischem Kontext.

**Neu und verbindlich:** Jeder Kritiker schreibt sein Urteil nach
`werkbank/urteile/welle4-<stueck>.md`, **bevor** er zurückgibt. Am 3. August hat
ein Reset elf von zwölf Urteilen vernichtet, weil sie nur im Journal standen.
Begründung und Wortlaut: `werkbank/wellen/LIESMICH.md`.

### 1 · DIE RÜCKKOPPLUNG, Runde 2 — 1600 läuft davon

Dateien: `stuecke/preis*.js`, `stil/preis*.css`

Das schwerste Stück. **1600 ist das einzige, das reißt, und es reißt nach oben.**
rho +0,873, Leiter 3,76 → 27,81, Spitze 67,33×, Kasse 310 → 5.217 fl.

* Finde zuerst heraus, **was 1600 anders macht als 1350, 1884 und 1970** — die
  drei liegen zwischen −0,152 und +0,143. Miss es, rate nicht: dieselbe Linie,
  vier Epochen, die Zahlen liegen in `werkbank/urteile/e1..e4.json`.
* Die Preise in 1600 müssen mit dem Erfolg mitwachsen. In 1884 tun sie es
  (8,35 → 2,06 bei wachsendem Vermögen) — dort liegt vermutlich das Muster.
* **Und brich die anderen drei nicht.** Deine Nachmessung muss alle vier zeigen,
  nicht nur 1600. Genau dieser Fehler ist in Welle 3 passiert: 1600 bestand
  vorher und wurde beim Reparieren der anderen kaputtgemacht.

**Der Kritiker zählt:** Spielt er eine Epoche vierzehn Jahre sorgfältig — bleibt
Barschaft ÷ Preis des nächsten umkämpften Zuges in einem Band, oder läuft eine
Seite davon?

### 2 · DER PREIS — der Zähler, der nie zählt

Dateien: `stuecke/preis*.js`

**„Chronik des Hauses · 0 Festlegungen" steht in allen vier Epochen auf 0**, auch
nach bezahlter Festlegung. Am Stand `ee1715b` nachgezählt, unverändert seit
Welle 2b. DER GEGNER hat die Ursache damals gefunden und gemessen:
`preis.js:1525` zählt `Object.keys(Z.festGenommen)` — also nur die Festlegungen
von DER PREIS —, während in `welt.chronik` sehr wohl Einträge mit
`art='festlegung'` von anderen Stücken stehen. *Die Zahl ist da, der Zähler liest
sie nicht.* `chronik.filter(c => c.art === 'festlegung').length` fasst alle vier
Stücke auf einmal.

* Dazu der Rest des Bodens: in 1350 berührt die Kasse im sparsamen Lauf für
  **eine Woche −1 Pf**. 44 Wochen unter null sind es nicht mehr, aber null ist
  null.

**Der Kritiker zählt:** Nimmt er eine Festlegung — springt der Zähler? Und fährt
er ein Haus an die Wand: steht die Kasse je unter null?

### 3 · DER KLANG — die dritte Latte, die noch nie gemessen wurde

Dateien: `stuecke/klang*.js` · `ton/**` · `kern/ton.js` gehört diesem Stück
(ZUSTAENDIGKEIT 11)

`gauntlet/MESSLATTE.md` nennt **drei** Latten. Zwei werden seit Welle 1 gemessen.
**Die dritte ist in drei Wellen kein einziges Mal geprüft worden** — und eine
Latte ohne Stück ist der zuverlässigste Weg, sie am Ende stillschweigend fallen
zu lassen. Das steht so schon in `gauntlet/WELLE-2.md` und ist seitdem wahr
geblieben.

Die Latte im Wortlaut: **dreißig Sekunden ohne Bild, ein fremdes Ohr nennt
Epoche und Vorgang.**

* Es muss überhaupt etwas zu hören geben, in jeder der vier Epochen, und es muss
  sich zwischen ihnen hörbar unterscheiden.
* Was klingt, soll das Spiel sein, nicht Kulisse: die Fuhre, der Sud, der
  Michaelitag, der Gegenzug.

**Der Kritiker prüft blind:** Er bekommt vier Aufnahmen zu je dreißig Sekunden
ohne Bild und ordnet sie den Epochen zu. Trifft er nicht besser als geraten, ist
die Latte gerissen.

### 4 · DER SUD — wird gebraut, und entscheidet man dabei etwas?

Dateien: `stuecke/sud*.js` · `stil/sud*.css`

In Welle 2b lautete der Auftrag „Gebraut wird bisher nicht — eine echte
Entscheidung über das Bier", und es wurde gebaut. **Seitdem hat niemand
nachgemessen, ob eine sorgfältig gespielte Partie beim Bier je eine Wahl
trifft**, die etwas kostet und etwas ändert.

* Miss es zuerst am Bildschirm: über vierzehn Jahre — wie oft steht eine
  Entscheidung über das Bier an, die mehr als einen Knopf hat, und was ändert
  sich danach messbar?
* Wo die Antwort „nie" oder „nichts" lautet, ist das dein Auftrag.

**Der Kritiker zählt:** Kann er zwei Partien derselben Epoche mit verschiedenem
Bier spielen und den Unterschied am Bildschirm benennen?
