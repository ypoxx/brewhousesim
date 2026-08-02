# Welle 3 — Wie eine Partie ausgeht

Aufgestellt von der Aufsicht am 2. August 2026, während Welle 2b noch in der
Nacharbeit steht. **Nicht starten, bevor die Runde-2-Urteile von Welle 2b da
sind** — DIE EICHUNG und DER GEGNER fassen gerade Dateien an, die hier wieder
vorkommen.

Grundlage sind eigene Messungen, nicht Zusagen: `spiel/BEFUND-ENDE.md`,
gemessen am eingefrorenen Stand `c6daa5a` mit
`werkbank/schuss/aufsicht/{messstand.sh,nenner.mjs,gebraut.mjs,auswerten.py}`.

---

## Der Befund, aus dem diese Welle folgt

Welle 2b hat die Bretter freigeräumt (0 unerreichbare Züge von 80/90/93/84
statt 3/2/2/5), den Jahreswechsel auf einen Klick gebracht und der Partie
**überhaupt erst ein Ende gegeben** — vorher lief sie nach dem Bankrott noch
sechzehn Jahre weiter.

Genau dieses neue Ende ist jetzt der Befund:

| Epoche | endet | Grund | Kasse am Ende | Keller |
|---|---|---|---|---|
| 1350 | 1353/13 | `keine-abnehmer` | **−14 Pf** | 3 Kofent |
| 1600 | 1603/13 | `keine-abnehmer` | 0 | 5 Nachbier |
| 1884 | 1887/11 | `keine-abnehmer` | **7.312 M** | 48 Einfachbier |
| 1970 | 1973/9 | `keine-abnehmer` | 339 DM | 30 Handelsmarke |

**Sechshundert Jahre Brauereigeschichte enden viermal identisch, nach gut drei
Braujahren, weil der letzte Abnehmer geht — und der Bildschirm sagt es nicht.**
WEITER wird grau, sonst nichts. 1884 hört mit vollem Keller und 7.312 M in der
Kasse auf; das ist kein Untergang, das ist ein Abbruch. Und 1350 schließt bei
−14 Pf: die Kasse hat unter null immer noch keinen Boden.

Dazu die zweite Latte: die Kopfzeile behauptet das **Zehn- bis
Fünfundvierzigfache** des ehrlichen Werts (1884: 199,54× gegen 4,42× am
billigsten umkämpften Zug).

**Und die Latte selbst ist gerissen — nicht am Nenner.** Beide Extremstile
wurden gemessen, „nur WEITER" und „jede Woche der billigste umkämpfte Zug":

| Epoche | rho · WEITER | rho · kaufend | Jahre unter 1× · WEITER | · kaufend |
|---|---|---|---|---|
| 1350 | −1,000 | −1,000 | 3 von 4 | 3 von 3 |
| 1600 | −1,000 | −1,000 | 2 von 4 | 4 von 4 |
| 1884 | −1,000 | −0,949 | 0 von 4 | 4 von 4 |
| 1970 | −0,800 | −0,800 | 1 von 4 | 4 von 4 |

Ziel: |rho| < 0,7. Wer nichts tut, verhungert langsam; wer jeden umkämpften Zug
nimmt, sobald die Kasse ihn trägt, verhungert schnell — 1884 hält sich passiv
bei einem Median von 4,42× und null schlechten Jahren und fällt kaufend in allen
vier Jahren unter 1×.

Beide Stile sind aber entartet, und deshalb zählt die **sorgfältig gespielte
Linie** des EICHUNG-Builders mehr (vier Läufe zu je 400 Wochen, Rücklagen,
Michaeli-Umstellung, jede Woche gefahren). Die Aufsicht hat 1350 mit seinem
eigenen Skript nachgefahren — es reproduziert. Auf seine vier Dateien die Latte
angewandt:

| Epoche | Start → Ende | rho | Jahre unter 1× | Latte |
|---|---|---|---|---|
| 1350 | 3,39 → **0,16** | **−0,795** | **6 von 12** | reißt beide |
| 1600 | 3,56 → 2,69 | **+0,165** | **0 von 14** | **besteht** |
| 1884 | 5,09 → 1,40 | −0,367 | 2 von 14 | besteht |
| 1970 | 3,44 → **0,06** | −0,572 | **9 von 11** | reißt das zweite |

**Das ist der Befund, aus dem Stück 2 folgt — und er ist gutartiger, als er
aussieht.** Der Builder schließt aus denselben Läufen „elf Läufe und kein
Kippen"; das prüft nur die Richtung nach oben. Die Latte ist zweiseitig. 1350
fällt um den Faktor 21, 1970 um den Faktor 57.

**Aber 1600 besteht sauber**: Vermögen mal acht, Kennzahl im Band 1,44–3,17,
weil die Preise 1,32× schneller wachsen als die Barschaft. Die Wirtschaft *kann*
also. Die Aufgabe heißt darum nicht „die Wirtschaft reparieren", sondern
**1350 und 1970 nach dem Muster von 1600 bauen.**

---

## Die Stücke

Regeln unverändert (`spiel/LIESMICH.md`): `index.html` eingefroren, `kern/**`
nur über die Aufsicht als „KERN: …", **kein `git`** — die Aufsicht committet.
Je Stück **ein Builder und ein getrennter blinder Kritiker**, der nur das
laufende Spiel sieht, nie die Begründung des Builders.

### 1 · DAS ENDE — vier Epochen, vier Ausgänge

Dateien: neues Stück, `stuecke/ende*.js` · `stil/ende*.css`

Eine Partie muss **aufhören und dabei etwas sagen**. Heute wird ein Knopf grau.

* Ein Schlussbild, das die Partie zusammenfasst: was das Haus war, was aus ihm
  wurde, woran es lag. Nicht das Blatt eines Stücks über sich selbst — ein
  Urteil über die Partie.
* **Jede Epoche ihren eigenen Untergang.** `keine-abnehmer` ist einer von
  mehreren: verkauft, geschluckt, verstaatlicht, an die Tochter übergeben, vom
  Reinheitsgebot erwischt, vom Brauereisterben. Ein Ausgang für vier Epochen
  ist derselbe Fehler wie ein Nenner für vierhundert Wochen.
* Auch ein **gutes** Ende muss es geben. Heute kann man nur aufhören zu
  existieren.

**Der Kritiker zählt:** Spielt er vier Epochen zu Ende — sieht er vier
verschiedene Ausgänge, und weiß er nach jedem in einem Satz, warum? Erkennt er
am Bildschirm den Unterschied zwischen „verloren" und „das Spiel klemmt"?

### 2 · DIE RÜCKKOPPLUNG — warum jeder Weg nach unten führt

Dateien: `stuecke/preis*.js` (DER PREIS besitzt die Kasse) · `stuecke/fuhre*.js`

**Das schwerste Stück der Welle.** Beide Extremstile enden bei null: rho
zwischen −0,8 und −1,0, in allen vier Epochen, ob man spielt oder nicht. Der
Grund steht schon in `spiel/BEFUND-WIRTSCHAFT.md` und hat sich nicht geändert:
*Kosten hängen an der Fahrt und am Kalender, Ertrag hängt an der Ladung, und
nichts koppelt das Ergebnis auf die Schwierigkeit zurück.*

* Ein Haus, das gut spielt, muss **spürbar** besser dastehen — und ein Haus, das
  gut dasteht, muss es **schwerer** haben. Ohne diese zweite Hälfte wächst die
  Kennzahl davon, sobald die erste da ist; das ist der Patrizier-IV-Fall aus der
  Latte.
* Ein Boden mit **Folge**: Schulden, Zins, ein Gläubiger, Pfand auf den Hof, das
  verkaufte Fuhrwerk. Nicht eine negative Zahl in der Kopfzeile (1350 endet bei
  −14 Pf).
* Der Weg nach unten muss **spürbar** sein, bevor er zu Ende ist — eine Warnung,
  eine Frist, eine letzte Gelegenheit.

**Der Kritiker zählt:** Spielt er zweimal dieselbe Epoche, einmal sorgfältig und
einmal blind drauflos — sieht er nach vier Jahren einen Unterschied am
Bildschirm? Und fährt er ein Haus absichtlich an die Wand: bekommt er unterwegs
eine Wahl, oder nur eine kleinere Zahl?

### 3 · DIE KOPFZEILE — die eine Zahl muss ehrlich sein

Dateien: `stuecke/eichung*` und die betroffenen `meldeZug`-Aufrufer

Die Kopfzeile nennt den billigsten **Knopf**, die Latte meint den billigsten
**umkämpften Zug**. Faktor 10 bis 45.

* `meldeZug(was, preis, art)` wird von den Stücken bereits mit `art` gerufen
  (`beiwerk|adresse|umkaempft|lage`), aber `kern/welt.js` ignoriert das dritte
  Argument und nimmt stur das Minimum. **Das ist eine KERN-Änderung und gehört
  der Aufsicht** — sie liegt als Bitte von DIE FUHRE seit Welle 2 vor.
* Danach darf die ehrliche Ersatzzeile unten rechts („UMKÄMPFT Ablösung … ·
  Kasse reicht −0,3×") wieder verschwinden. Zwei Kennzahlen nebeneinander sind
  eine Kennzahl zu viel.
* Vorsicht beim Messen: `data-deckung` gibt es **zweimal mit verschiedener
  Bedeutung** — `kern/kopf.js` die Kennzahl, `stuecke/name.js` das Deckungsband
  des Rufs. Nur die Kopfzeile trägt die Klasse `.deckung`.

**Der Kritiker zählt:** Über eine ganze Partie — wie oft wechselt der Nenner,
und nennt er je etwas, das der Gegner ihm wegnehmen kann?

### 4 · DAS FÜNFTE VERB — eine Epoche, die anders gespielt wird

Dateien: `stuecke/gegner*.js`

Nachgezählt am Stand `c6daa5a`, alle Bretter aufgeschlagen: 1350, 1600 und 1884
haben dieselben drei Verben gegen den Gegner (ablösen, hinhalten, zuvorkommen).
**1970 hat mit ablösen und hinhalten sogar eines weniger.** Vier Epochen, ein
Handgriff.

* Mindestens **eine** Epoche bekommt ein Verb, das es nur dort gibt und das aus
  ihrer Zeit kommt.
* 1970 bekommt sein drittes zurück.

**Der Kritiker zählt:** Kann er in einer Epoche etwas tun, das in den anderen
dreien gar nicht auf dem Schirm steht?

---

## Kleinkram, der ohne eigenes Stück mitläuft

* **`stuecke/name.js:1135`** — der Spieler liest in allen vier Epochen eine
  Übergabenotiz zwischen zwei Buildern: „— den schreibt DER PREIS, und er liest
  `welt.haus.rufAufschlag` noch nicht. Solange bucht DER NAME das Aufgeld
  selbst, Zeile für Zeile." Das gehört nicht auf den Bildschirm.
* **Der Zähler „Chronik des Hauses · N Festlegungen" steht in allen vier Epochen
  auf 0**, auch nach bezahlter Festlegung. DER GEGNER hat die Ursache gefunden
  und nachgemessen: der Knopf steht in `stuecke/preis.js:1525` und zählt
  `Object.keys(Z.festGenommen)` — also nur die Festlegungen von DER PREIS. Nach
  einem Gegenzug in 1970 steht in `welt.chronik` ein Eintrag mit
  `art='festlegung'`, und der Zähler daneben bleibt auf 0. *Die Zahl ist da, der
  Zähler liest sie nicht.* Umstellen auf
  `chronik.filter(c => c.art === 'festlegung').length` fasst alle vier Stücke auf
  einmal. Gehört DEM PREIS.
* **Drei Braujahre sind zu kurz.** Die Amtszeit in 1350 läuft bis 1386, die
  Partie endet 1353. Ob das am Ende oder an der Wirtschaft liegt, entscheidet
  Stück 1 und 2 gemeinsam. Auf sorgfältig gespielter Linie trägt dieselbe Partie
  vierzehn Jahre — der Abbruch trifft den, der nichts tut.
