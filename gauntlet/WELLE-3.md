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

Ziel: |rho| < 0,7. **Spielen macht es schlimmer.** 1884 hält sich passiv bei
einem Median von 4,42× und null Jahren unter 1×; wer dort kauft, steht in allen
vier Jahren unter 1×. Wer nichts tut, verhungert langsam; wer jeden umkämpften
Zug nimmt, verhungert schnell. **Der Wirtschaft fehlt die Rückkopplung, nicht
der Kopfzeile die Beschriftung.**

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

### 2 · DER BODEN — was passiert, wenn das Geld alle ist

Dateien: `stuecke/preis*.js` (DER PREIS besitzt die Kasse)

Die Kasse geht unter null und niemand merkt es. −14 Pf ist keine Zahl, das ist
ein fehlender Fall.

* Ein Boden mit **Folge**: Schulden, Zins, ein Gläubiger, Pfand auf den Hof,
  das verkaufte Fuhrwerk. Nicht eine negative Zahl in der Kopfzeile.
* Der Weg nach unten muss **spürbar** sein, bevor er zu Ende ist — eine Warnung,
  eine Frist, eine letzte Gelegenheit.

**Der Kritiker zählt:** Fährt er ein Haus absichtlich an die Wand — bekommt er
unterwegs eine Wahl, oder nur eine kleinere Zahl?

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
* **Drei Braujahre sind zu kurz.** Die Amtszeit in 1350 läuft bis 1386, die
  Partie endet 1353. Ob das am Ende oder an der Wirtschaft liegt, entscheidet
  Stück 1 und 2 gemeinsam.
