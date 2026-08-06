# Die Rückverschlechterung von 1350 — Ursache gefunden, mit Koordinaten

*Welle 9, DIE STADT. Alles unten ist gemessen, nichts geschlossen.*

## Der eine Klick

Die ersten sechzehn Wochen von 1350, gleiche Saat (1350), gleiche Hand
(`rueckkopplung-r3/linie.mjs`, `LAUT=1`), sequenziell durchs Messfenster,
Vorzustand auf Hafen **8912** (`welle8-trennprobe/aufsetzen.sh`, Marke
`ohneStadt:8b81250-mit-b6b06bb`) gegen den Welle-9-Ausgangsstand auf Hafen
**8921** (`messstand.sh HEAD 8921`, Marke `ab6067b`):

| | Vorzustand :8912 | Welle 8 :8921 |
|---|---|---|
| Kasse in 16 Wochen | **80 – 238** | **58 – 112** |
| `Ziel` gesetzt | **1×** | **0×** |
| Festlegung | 0× | 0× |
| Seitenfehler | 0 | 0 |

Der Unterschied im Klickprotokoll ist **ein einziger Klick**, und er steht
ganz am Anfang:

```
4d3
<    klick fuhre:ziel:bar
```

Alles Weitere folgt daraus: sieben `fuhre:tafel-ab:grut`, die im neuen Stand
ausbleiben, ein ausgefallener `fuhre:kauf:rohstoff`, und ab Woche 2 die
Kasse 62 statt 80. Der Absatz stockt nicht, weil ein Fass nicht wegkommt,
sondern weil **das Ziel der Fuhre nie gesetzt wird**.

Protokolle: `werkbank/schuss/stadt-w9/log/vor-16.txt`, `nach-16.txt`.
Reihen: `rho/vor-16.json`, `rho/nach-16.json`.

## Warum der Klick ausfällt — der Deckel hat einen Namen

`linie.mjs:klick()` fragt den Knopf an seiner Mitte mit
`document.elementFromPoint` und gibt auf, wenn dort etwas Fremdes liegt (es
versucht vorher, mit den Reitern der STADT freizuräumen — das hilft hier
nicht, weil der Deckel selbst zur Werkbank gehört und nie zuklappt).

`werkbank/schuss/stadt-w9/zielknopf.mjs`, beide Stände bei **1920×1000**
(die Fenstergröße der messenden Hand, `linie.mjs:61`):

```
Hafen 8912 (Vorzustand)
  fuhre:ziel:bar   x39..183 y324..348   ZUGEDECKT von DIV. in #buehne 0,0,1920,1000
Hafen 8921 (Welle 8)
  fuhre:ziel:bar   x39..183 y324..348   ZUGEDECKT von DIV.nutzen in #fach-blatt-stadt 31,334,316,349
```

Im Vorzustand liegt dort nur die Bühne selbst — ein Klick kommt durch,
sobald ein Reiter geklickt wurde. Im Welle-8-Stand liegt dort die
**aufgeklappte BAUHOF-Lade der STADT**: seit Welle 8 hängt die Werkbank
oben (`stil/stadt.css`, `.stadt-werkbank { top: 7.8 % }`) statt unten, und
ihre zweite Zeile — `.stadt-bauhof .bauzeile .nutzen` — liegt bei
1920×1000 genau auf der Zielzeile der FUHRE.

**Es ist also DIE STADT, und es ist die Werkbank, und es ist derselbe
Kasten, den Auflage A1 abbauen will.** Der Ausschluss „nicht verdeckte
Knöpfe" im Auftrag stimmt für den Ladepunkt (dort ist `fuhre:ziel:bar`
in beiden Ständen gleich verdeckt) und trifft trotzdem nicht: die
messende Hand räumt Deckel mit den Reitern weg, und der einzige Deckel,
den sie damit **nicht** wegräumen kann, ist die Werkbank selbst.

## Die Abhilfe

Die BAUHOF-Lade wird ein Brett wie jedes andere: sie liegt beim Laden
zugeklappt und hat einen eigenen Reiter. Damit ist sie im Ladezustand
weder ein Deckel noch Deckung — dieselbe Änderung erledigt die
Rückverschlechterung und den größeren Teil von A1.

Zusätzlich prüft der Rahmen jetzt selbst, ob die Werkbank einen fremden
Zug zudeckt (`BRAUHAUS.stadt.rahmen.verdeckt()` gab es schon, es wurde nur
nie erzwungen).
