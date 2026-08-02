# BEFUND: Die Partie endet nach gut drei Braujahren — und sagt es nicht

Gemessen von der Aufsicht am **eingefrorenen Stand `c6daa5a`** (nicht am
Arbeitsbaum — dort schrieben zur selben Zeit zwei Builder; siehe
`werkbank/schuss/aufsicht/messstand.sh`). Werkzeug:
`werkbank/schuss/aufsicht/gebraut.mjs` und `nenner.mjs`, beide lesen am
Bildschirm, nicht im Quelltext.

## 1 · Vier Epochen, ein Ende, immer nach gut drei Jahren

Nur WEITER gedrückt, sonst nichts. 110 Klicks angesetzt, so weit gekommen:

| Epoche | endet | Grund | Kasse am Ende | Keller | Plätze | einzige Sorte |
|---|---|---|---|---|---|---|
| 1350 | 1353/13 | `keine-abnehmer` | **−14 Pf** | 3 | 12 | Kofent |
| 1600 | 1603/13 | `keine-abnehmer` | 0 | 5 | 24 | Nachbier |
| 1884 | 1887/11 | `keine-abnehmer` | **7.312 M** | 48 | 90 | Einfachbier |
| 1970 | 1973/9 | `keine-abnehmer` | 339 DM | 30 | 400 | Handelsmarke |

**Das Ende gibt es — das ist neu und gut.** `welt.zeit.ende` wird gesetzt,
`B.uhr.beende` aus `fuhre.js:806`, wenn `Z.frist` abgelaufen ist. Die Auflage
„die Partie hat kein Ende" ist damit zur Hälfte erledigt: vorher lief sie nach
dem Bankrott noch sechzehn Jahre weiter.

Was daran jetzt nicht stimmt, ist dreierlei:

**(a) Das Ende ist stumm.** WEITER wird grau, und das ist alles. Kein
Schlussbild, keine Zeile, warum die Partie vorbei ist, keine Bilanz. Was am
Schirm liegt, ist DAS SUDBUCH WIRD GESCHLOSSEN — das eigene Blatt eines Stücks,
das über sich selbst Rechenschaft ablegt, kein Urteil über die Partie. Ein
Spieler, der zum ersten Mal spielt, sieht einen toten Knopf und weiß nicht, ob
er verloren hat oder etwas klemmt. (Genau diese Verwechslung hat die Aufsicht
selbst gemacht: der Messlauf schrieb „WEITER nicht bedienbar" als **Abbruch**
auf, nicht als Ende.)

**(b) Es ist viermal dasselbe Ende.** Vier Epochen, vier Mal `keine-abnehmer`,
vier Mal nach 3,2 bis 3,5 Braujahren. Sechshundert Jahre Brauereigeschichte
enden immer daran, dass der letzte Abnehmer geht.

**(c) Es ist nicht einmal ein Ende aus Armut.** 1884 schließt mit **7.312 M in
der Kasse** und 48 Fass im Keller. Das Haus ist zahlungsfähig und voll — und
hört auf. Umgekehrt hat 1350 **−14 Pf**: die Kasse hat unter null immer noch
keinen Boden.

**Der Keller hält in jeder Epoche nur die geringste Sorte** — Kofent,
Nachbier, Einfachbier, Handelsmarke. Wer nichts tut, sinkt auf das dünnste
Bier. Das ist ein gutes Zeichen: die Wirtschaft spricht, wenn man sie misst.

## 2 · Die Kennzahl der zweiten Latte, drei Nenner nebeneinander

`nenner.mjs` liest Woche für Woche Brett für Brett **alle** Preisschilder selbst
und rechnet drei Nenner statt einem, damit der Streit um den Nenner sichtbar
bleibt statt in einer Zahl zu verschwinden:

* **kopf** — was das Spiel in der Kopfzeile selbst behauptet
* **alles** — billigstes erreichbares und aktives Preisschild
* **umkämpft** — billigstes Schild an einer Adresse, um die der Gegner mitspielt
  (`data-adr`). **Nur dieser steht in der Messlatte.**

Stil „nur WEITER", bis zum Ende der Partie:

| Epoche | Jahre | Kopfzeile behauptet | gegen umkämpft | Faktor | rho umkämpft | Jahre unter 1× |
|---|---|---|---|---|---|---|
| 1350 | 4 | 0,00× (max 23,25) | **0,00×** (max 5,89) | — | **−1,000** | 3 von 4 |
| 1600 | 4 | 19,21× | **1,67×** | 11,5 | **−1,000** | 2 von 4 |
| 1884 | 4 | 199,54× | **4,42×** | 45,1 | **−1,000** | 0 von 4 |
| 1970 | 4 | 27,30× | **2,84×** | 9,6 | **−0,800** | 1 von 4 |

Ziel dieser Welle: |rho| < 0,7 in allen vier Epochen, höchstens ein Jahr von
sechs unter 1×.

**Zwei Dinge sind hier zu trennen, und die Aufsicht trennt sie ausdrücklich:**

**Erstens, was gesichert ist: die Kopfzeile lügt um das Zehn- bis
Fünfundvierzigfache.** In 1884 behauptet sie 199,54×, während der billigste
umkämpfte Zug 4,42× kostet. Der Nenner wechselt inzwischen zwei- bis dreimal
statt gar nicht — der EICHUNG-Builder hat daran gearbeitet, und unten rechts
steht bereits eine ehrliche Zeile „UMKÄMPFT Ablösung … · Kasse reicht −0,3×".
**Aber solange beide Zahlen nebeneinander am Schirm stehen und die große die
falsche ist, ist die Auflage nicht erfüllt, sondern nur besser belegt.**

Nebenbefund, der beim Messen aufgefallen ist: `data-deckung` gibt es **zweimal
mit verschiedener Bedeutung** — `kern/kopf.js` die Kennzahl, `stuecke/name.js`
das Deckungsband des Rufs. Nur die Kopfzeile trägt die Klasse `.deckung`. Wer
ohne sie misst, misst den Ruf und merkt es nicht.

**Zweitens, was NICHT gesichert ist: rho = −1,000 ist noch kein Urteil über das
Spiel.** Diese Zahl steht für einen Stil, der nichts tut. Ein Haus, das nie
etwas kauft und nie braut, *muss* fallen — dass die Kennzahl dann monoton fällt,
ist richtig und kein Fehler. Die Latte zielt auf den Spieler, der spielt. Die
Gegenprobe im Stil „kaufend" (jede Woche der billigste umkämpfte Zug, sobald die
Kasse ihn trägt) läuft; **erst mit ihr darf man sagen, ob die Latte gerissen
ist.** Bis dahin gilt aus dieser Messung nur der Satz über die Kopfzeile.

## 3 · Was daraus für die nächste Welle folgt

1. **Das Ende muss sprechen.** Ein Schlussbild, das sagt, was aus dem Haus
   geworden ist, und warum jetzt Schluss ist.
2. **Das Ende darf nicht viermal dasselbe sein.** `keine-abnehmer` ist ein
   Ausgang; ein Haus kann auch verkauft, geschluckt, verstaatlicht, in die
   Familie weitergegeben werden. Jede Epoche hat ihren eigenen Untergang.
3. **Die Kasse braucht einen Boden**, und der Boden braucht eine Folge —
   Schulden, Pfand, ein Gläubiger, nicht eine negative Zahl in der Kopfzeile.
4. **Drei Jahre sind zu kurz.** Die Amtszeit in 1350 läuft bis 1386; die Partie
   endet 1353.
5. **Die Kopfzeile muss den umkämpften Zug nennen**, nicht den billigsten Knopf
   — und dann darf die ehrliche Zeile unten rechts wieder verschwinden.
