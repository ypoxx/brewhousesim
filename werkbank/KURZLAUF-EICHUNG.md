# Das Kalibrierblatt des Kurzlaufs — was 100 Wochen sehen und was nicht

*T0.7 des Umsetzungsplans, gemessen von der Aufsicht am 8. August 2026 auf
vorhandenen Läufen. Gerät:
[`schuss/aufsicht/kurzlauf-eichung.py`](schuss/aufsicht/kurzlauf-eichung.py),
jederzeit nachstellbar, alle Eingangsdateien liegen im Repo.*

Die Prüfpyramide will auf **Stufe 1** (je Ticket) einen Kurzlauf über 100
Wochen mit Prüfsummenvergleich statt der vollen 400-Wochen-Latte. Das ist eine
Wette, und dieses Blatt löst sie ein: **wenn der Kurzlauf die Änderung nicht
sieht, ist sie partieneutral.** Damit der Satz gilt, muss der Kurzlauf jede
Änderung sehen, die später ρ bewegt.

## Wie gemessen wurde, und warum nicht als Korrelation

Nicht als Korrelation zweier ρ-Werte. **100 Wochen sind drei Braujahre, und ein
ρ über drei Jahre ist keine Zahl, sondern eine Laune** — die Latte selbst
verlangt seit dem 4. August drei Schnitte über 12, 13 und 14 Braujahre, gerade
weil ρ an der Laufzeit hängt.

Gemessen wird stattdessen die **Erstabweichungswoche**: in welcher Woche laufen
zwei Partien zum ersten Mal auseinander? Liegt sie in jedem bekannten Fall unter
100, sieht ein 100-Wochen-Lauf alles, was zählt.

**Zwei Klassen von Feldern, und sie müssen getrennt bleiben.** Die erste Fassung
dieses Geräts warf sie zusammen und meldete darauf ein falsches Urteil
(„1884 weicht ab Woche 312 ab, 100 Wochen genügen nicht"):

| Klasse | Felder | was sie ist |
|---|---|---|
| **Partie** | `jahr` `woche` `kasse` `rohstoff` `faesser` `plaetze` `amtszeit` | der Zustand des Hauses |
| **Nenner** | `deckung` `nennerPreis` | welchen Zug die *Messung* gerade für den nächsten umkämpften hält |

In 1884 vorher/nachher ist die **Partie über alle 400 Wochen ziffernweise
gleich**, bis auf den letzten Pfennig (18 974 in beiden Läufen); abgewichen ist
in 2 von 400 Wochen allein der Nenner — und genau daran hat die Rückkopplung r3
gearbeitet. Wer beides in eine Prüfsumme wirft, bekommt bei jeder Preisarbeit
einen Fehlalarm und hält danach keinen mehr für echt.

## Die Zahlen

**Gegenprobe — derselbe Stand, dieselbe Saat. Hier darf nichts abweichen.**
9 Paare aus den Wiederholbarkeitsläufen der Welle 13 (1350 sechsfach, 1600 und
1884 je dreifach): **0 Abweichungen der Partie, 0 des Nenners.** Das Gerät misst
kein Rauschen.

**Die Änderungen, gegen die geeicht wird:**

| Paar | Partie weicht ab | ρ (12/13/14 J) vorher → nachher | ρ bewegt |
|---|---|---|---|
| **Knopfboden 1970, mit ↔ ohne** | **Woche 32** | +0,699/+0,637/+0,653 → −0,112/−0,236/−0,304 | **ja, Δ 0,811** |
| **Rückkopplung r3, 1350** | **Woche 61** | +0,741/+0,742/+0,701 → +0,238/+0,363/+0,288 | **ja, Δ 0,503** |
| Rückkopplung r3, 1600 | nie | +0,371/+0,264/+0,231 unverändert | nein |
| Rückkopplung r3, 1884 | nie *(Nenner: Woche 312)* | +0,161/+0,330/+0,169 unverändert | nein |
| Rückkopplung r3, 1970 | nie | +0,133/−0,055/+0,108 unverändert | nein |

Der Knopfboden ist der härteste bekannte Fall des ganzen Laufs: derselbe
Commit, dieselbe Saat, ein Knopfboden Unterschied, ρ springt um 0,811. **Er läuft
in Woche 32 aus dem Ruder** — ein 30-Wochen-Lauf hätte ihn noch durchgewinkt,
ein 60er hätte ihn.

## Die Schwelle für Stufe 1 — festgeschrieben

> **Kurzlauf = 100 Wochen, ein Lauf, Prüfsumme über die Felder der Klasse
> *Partie*, verglichen gegen den letzten grünen Stand.**

Begründet: beide bekannten Änderungen, die ρ bewegt haben, liefen spätestens in
**Woche 61** auseinander. 100 Wochen lassen **39 Wochen Reserve** — und sie sind
ein Viertel der Rechenzeit eines 400ers.

**Und die Einschränkung, die genauso bindend ist wie die Schwelle:**

> **Der Kurzlauf ist ein Veto, kein Freispruch.** Eine *abweichende* Prüfsumme
> heißt sicher „nicht partieneutral" — dann volle Abnahme. Eine *gleiche*
> Prüfsumme heißt nur „kein Gegenbeweis gefunden". Der Beweis bleibt die
> Wellengrenze.

Die Beweislage sind **zwei Fälle**. Zwei Fälle sind kein Gesetz. Wer aus
„zweimal unter 61" ein „immer unter 100" macht, tut genau das, wovor dieses
Projekt sich seit dem 5. August schriftlich warnt: er wählt eine Lesart, nachdem
er die Zahlen kennt. Die Schwelle ist gesetzt, weil sie **Rechenzeit spart**,
nicht weil sie etwas beweist.

**Jeder neue Fall gehört ins Gerät.** Wer künftig eine Änderung misst, die ρ
bewegt, trägt das Paar in `kurzlauf-eichung.py` nach. Fällt eine
Erstabweichung über Woche 100, wird die Schwelle noch am selben Tag angehoben —
die Zeile im Skript sagt es dann von selbst.
