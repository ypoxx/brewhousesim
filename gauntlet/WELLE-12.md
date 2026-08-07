# WELLE 12 — DER RAHMEN. Dieselbe Saat muss dieselbe Partie ergeben.

*Angesetzt am 7. August 2026. Welle 11 ist gebaut, gemessen und **nicht
abgenommen** — an einer einzigen Bedingung.*

## Der Befund, neunfach gemessen

Am Integrationsstand `7a1a942` spielt **1350 zwei verschiedene Partien**:
ρ +0,191 / −0,521 / +0,191 in drei einzeln gemessenen Läufen, Spannweite
**0,712**, null Seitenfehler in allen dreien. Der Vorzustand `7896ee6` war
dreimal byteweise gleich.

Die Trennprobe (`aufsicht/welle11-trennprobe/`, neun Läufe, je drei je Stand):

| Stand | was darin neu ist | 1350 | stabil? |
|---|---|---|---|
| Vorzustand | — | −0,336 | ja |
| **ohneFuhre** | ERBE + GEGNER | **−0,336** | ja, 1 md5 |
| **ohneErbe** | GEGNER + FUHRE | **+0,191** | ja, 1 md5 |
| **ohneGegner** | ERBE + FUHRE | **−0,521** | ja, 1 md5 |
| **voll** | alle drei | **+0,191 / −0,521** | **nein** |

**Die beiden Werte des vollen Standes sind exakt die Partien, die `ohneErbe` und
`ohneGegner` je für sich stabil spielen.** DIE FUHRE ist notwendig — ohne sie
bleibt alles auf dem Vorzustand. Sie allein genügt nicht: mit ihr zieht DER
GEGNER auf +0,191 und DAS ERBE auf −0,521, jeder für sich stabil und in
**entgegengesetzte** Richtung. Sind beide da, entscheidet ein Rennen.

**Es gibt keinen Schuldigen unter den drei Stücken.** Jedes Herausnehmen stellt
die Wiederholbarkeit her, und keines ist die Ursache. **Die Ursache ist, dass
die Reihenfolge, in der drei Stücke ihr Bild fertigstellen, nicht festgelegt
ist — und das ist deine Sache.**

## Warum das schwerer wiegt als jede einzelne Latte

Bei gesätem Würfel ist *zweimal dasselbe* die **Voraussetzung** jeder Zahl, die
dieser Lauf je erhoben hat. Jeder Beleg der Wellen 7 bis 11 steht auf „drei
Läufe, eine Prüfsumme"; die Verarmung von 1350 in Welle 8 war nur deshalb ein
Befund und keine Vermutung. `spiel/LIESMICH.md` sagt es wörtlich: *„Der Würfel
ist gesät … sonst kann der Kritiker seine Zählung nicht wiederholen."*

**Solange 1350 zwei Partien spielt, ist keine Messung dieses Laufs mehr wert als
eine Behauptung.**

## Dein Auftrag

**R7 — Finde das Rennen und benenne es, bevor du es abstellst.** Was wird mal
so und mal anders fertig? Kandidaten, die du messen (nicht raten) sollst: die
Reihenfolge, in der `BRAUHAUS.stueck(...)`-Anmeldungen ihr `zeichne` bekommen ·
alles, was auf `load`, `decode()`, `requestAnimationFrame` oder einen Zeitgeber
wartet · Element-Neuaufbau, der eine Klemme oder einen Horcher verliert (das
hattest du in Welle 10 schon einmal) · alles, was `document.elementFromPoint`
oder eine Messung des Layouts *während* des Zeichnens auswertet.

**R8 — Stelle es ab, ohne eine fremde Stückdatei anzufassen.** Der Rahmen legt
die Reihenfolge fest; die Stücke halten sich daran, weil sie gar nicht anders
können. Wo ein Stück sich ändern muss, **benennst du es** mit Datei, Zeile und
Abnahme — so wie du es in Welle 10 für `fuhre.js:3517` getan hast.

**R9 — Ein Gerät, das die Frage künftig in Minuten beantwortet.**
`BRAUHAUS.haushalt.pruefe()` und `verdeckt()` sind das Vorbild: eine Abfrage im
Spiel, die sagt, ob die Fertigstellung dieser Runde deterministisch war. Was
heute neun Läufe à vier Minuten kostet, soll ein Aufruf kosten.

## Abnahme

**Die harte:** `?saat=1350` liefert in **1350 sechsmal hintereinander dieselbe
Prüfsumme**, einzeln durch `aufsicht/messfenster.sh` am eingefrorenen Stand.
Sechs, nicht drei — bei einem Abweichungsverhältnis von 1:3 wäre ein Dreiersatz
zu rund 30 % Zufall, ein Sechsersatz zu unter 3 %. Dazu je drei Läufe in 1600,
1884 und 1970 mit je einer Prüfsumme.

**Die weiche:** nichts aus Welle 10 und 11 darf zurückgenommen werden —
Deckung nach 30 Wochen ohne Escape 13,8–15,0 %, `tafeln()` leer, Latte 4
10 Überläufe · 365 Textknoten · 0 von 308 Knöpfen, `verdeckt()` 0,
`haushalt.pruefe()` ohne Beanstandung, Gewicht unter 8 MB je Epoche.

**Und wenn die Partie sich ändert, ist das kein Fehler** — sie hat sich in
Welle 11 ohnehin geändert. Verlangt ist **eine** Partie, nicht die alte. Welche
der beiden es wird, sagst du mit der Zahl dazu.
