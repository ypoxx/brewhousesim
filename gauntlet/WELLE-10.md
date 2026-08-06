# WELLE 10 — DER RAHMEN. Zum ersten Mal ist das Skelett selbst der Builder.

*Angesetzt am 6. August 2026, nachdem Welle 9 durch war: das Wellenziel der
zweiten Latte ist erreicht — mit Abstand —, und die erste Latte ist so scharf
vermessen wie nie.*

## Warum diese Welle kein Stück bekommt

Der blinde Kritiker der Welle 9 misst in Bildpunkten, nach Eigenschaft getrennt
(`werkbank/schuss/bild-w9/deckung.mjs`):

| | Zielblatt | Spiel, Ladezustand | Spiel, nach 30 Wochen |
|---|---|---|---|
| Deckung der Fläche | **3,1 %** | 22,0 – 22,8 % | **47,0 – 55,7 %** |
| Kästen auf dem Schirm | **2** | **mindestens 15** | mehr |

**Und diese Latte kann kein Stück allein nehmen.** DIE STADT hat ihren Anteil in
Welle 9 von 10,6 % auf **2,9 %** gedrückt und die Auflage bleibt gerissen: im
obersten Sechstel liegen **Kopfleiste des Skeletts 26,0 %** und **Chronikgriff
DES PREISES 11,7 %**. Bei STADT = 0 blieben oben rund 37 % und gesamt 19 %.
Als `KERN:`-Befund gemeldet, hier ist die Antwort darauf.

**Dir gehören** `spiel/kern/**`, `spiel/index.html` und `spiel/stil/grund.css` —
in diesem Lauf zum ersten Mal seit dem Einfrieren. **Dir gehören NICHT** die
Dateien der acht Stücke (`stuecke/<name>*.js`, `stil/<name>*.css`). Wo ein Stück
sich anpassen muss, **erzwingt der Rahmen es oder du benennst es** — beides ist
richtig, Fremdcode ändern ist es nicht. Was du für Welle 11 benennst, gehört mit
Datei, Zeile und Abnahme in deinen Bericht.

## Deine sechs Auflagen — alle aus `werkbank/urteile/welle9-bildvergleich.md`

**R1 · Die Kopfleiste schrumpfen.** Sie deckt allein **26,0 %** des obersten
Sechstels und trägt sieben Felder (x 570–2185, y 50–110). Das Zielblatt trägt
dort eine Leiste von 1610 × 72 px und sonst nichts. Ziel: **die Kopfleiste
allein unter 12 % des obersten Sechstels**, ohne dass eine Angabe verschwindet —
*weniger anzeigen* ist keine Lösung, *anders anzeigen* schon.

**R2 · A16: Escape muss aufräumen, nicht tauschen.** Nach 30 Wochen liegen zwei
ganzseitige Tafeln übereinander (`fu-sommerblatt` 1596 × 943 und `erb-buch`
1156 × 1075); drei Escape-Anschläge schließen die obere und legen die untere
frei, die **die ganze linke Bildhälfte samt Brauhof** deckt. Die Deckung sinkt
nicht, sie wandert. **Abnahme:** nach 30 × WEITER und **einem** Escape ist in
allen vier Epochen keine Tafel über 200 000 px² offen und die Gesamtdeckung
liegt unter **12 %**. Der Rahmen erzwingt das — höchstens ein ganzseitiges Blatt
gleichzeitig, und Escape schließt alle.

**R3 · A8: kein Kasten ragt über den Bildrand.** In 1970 hängt ein Kasten mit rot
gestricheltem Rahmen ab x ≈ 2725 aus dem Bild, sichtbar bleibt nur „Wo".
**Abnahme:** bei 2752 × 1536 liegt jedes Element mit deckendem Grund vollständig
in der Fläche, im Lade- und im 30-Wochen-Zustand aller vier Epochen.

**R4 · A10: Preis und Währung nie trennen.** „−9 / Pf", „−240 / M", „−1.800 / DM"
brechen zwischen Zahl und Einheit um. Das Preisschild kommt aus `BRAUHAUS.knopf`
und gehört damit dir. **Abnahme:** in keiner Epoche steht eine Währungseinheit
allein auf einer Zeile.

**R5 · A7: keine leeren Rechtecke.** In 1970 stehen bei (2235, 990) und
(2405, 1055) je zwei leere Rechtecke — ein Zeichen, das keine geladene Schrift
zeichnen kann. Kein Netzzugriff, keine Web-Fonts: die Lösung liegt in der
Schriftkette in `grund.css` oder im Zeichen selbst. **Abnahme:** in keiner
Aufnahme irgendeiner Epoche steht ein leeres Rechteck.

**R6 · Der Flächenhaushalt, und er ist das Bleibende.** A15 verlangt **unter 8 %
Deckung im Ladezustand und unter 25 % im obersten Sechstel**. Das erreicht keine
einzelne Änderung. Verlangt ist deshalb **eine Regel und ein Gerät**: ein
Haushalt, der jedem Stück eine Obergrenze in Bildpunkten gibt, vom Rahmen
gemessen und im Spiel selbst abfragbar (wie `stadt.rahmen.verdeckt()` es für
Verdeckung schon kann). Der Rahmen sagt, wie viel jedes Stück decken darf; die
Stücke räumen in Welle 11. **Deine Abnahme ist nicht 8 % — deine Abnahme ist:
der Haushalt steht, ist gemessen, und dein Bericht nennt je Stück die Zahl, die
es einhalten muss, damit 8 % herauskommen.** Was du selbst schon einsparen
kannst (R1, R2), zählt sofort.

## Was dabei nicht kaputtgehen darf

1. **Das Wellenziel der zweiten Latte — es ist gerade erst erreicht.**
   |ρ| < 0,700 über alle drei Schnitte in allen vier Epochen (größter Wert
   heute 0,393) **und höchstens ein Braujahr von sechs unter 1×** (heute 2/0/1/1
   von 14). **Layout bewegt ρ** — das ist in diesem Lauf zweimal gemessen, und
   in Welle 8 hat eine verschobene Lade 1350 in den Ruin geführt, weil sie einen
   fremden Knopf zudeckte. Vorher und nachher messen, **drei Läufe je Epoche**,
   durch `werkbank/schuss/aufsicht/messfenster.sh`.
2. **Kein fremder Zug darf verdeckt sein.** `BRAUHAUS.stadt.rahmen.verdeckt()`
   steht heute auf 0/0/0/0. Es bleibt 0.
3. **Latte 4** bei 1366×768: 14 Überläufe · 505 Textknoten · 0 von 307 Knöpfen.
   Und: **ein Zähler, der Überlauf misst, misst nicht Vollständigkeit** — wer
   sauber kürzt, besteht ihn und zeigt trotzdem nicht alles.
4. **Das Gewichtsveto**, 8 MB je Epoche. Heute 6,29 / 7,66 / 6,61 / 4,67 MB.
5. **`spiel/index.html` war eingefroren, damit acht Stücke kollisionsfrei
   bleiben.** Du darfst sie anfassen — aber jede Zeile, die du dort änderst,
   trifft alle acht. Ändere so wenig wie möglich und schreibe jede Änderung mit
   Grund in den Bericht.

## Abnahme

`tor.mjs` in allen vier Epochen (`lage` 0, null Konsolenfehler) ·
`spielprobe.mjs` · `lesbarkeit.mjs` bei 1366×768 · `bild-w9/deckung.mjs` im
Lade- und im 30-Wochen-Zustand · ρ dreifach je Epoche plus Jahre unter 1× ·
`verdeckt()` = 0. Danach wieder ein **blinder Kritiker** mit derselben Frage:
**gewinnt das Zielbild noch?**

**Melde selbst, was du bewegt hast, auch wenn es gegen dich spricht.** In diesem
Lauf haben zwei Builder hintereinander ihre eigene Verschlechterung gemeldet und
dabei je einen Fehler der Aufsicht gefunden. Beide Male hat es eine Welle
gespart.
