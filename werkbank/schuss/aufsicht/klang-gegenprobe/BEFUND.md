# Gegenprobe der Aufsicht zu DER KLANG, Nacharbeit — 3. August 2026

Dasselbe Gerät (`bett2.mjs`) auf beiden Ständen, je 30 Sekunden, Analyser am
lebenden `BRAUHAUS.ton.ausgang()`, `saat=1350`.

- **vorher**: Commit `379231f`, eingefroren auf Hafen 8900 (`messstand.sh`).
  Bestätigt: 476 Zeilen `ton.js` Unterschied zu HEAD, keine Änderung zum Commit
  davor — der Stand liegt also wirklich vor der Nacharbeit.
- **nachher**: Arbeitsbaum auf 8899.

| Epoche | still/gespielt vorher | nachher |
|---|---|---|
| 1350 | 101 % | **58 %** |
| 1600 | 97 % | **73 %** |
| 1884 | 99 % | **41 %** |
| 1970 | 96 % | **44 %** |

*Je niedriger, desto mehr trägt der Vorgang statt der Kulisse.*

**Befund: die Nacharbeit trägt.** Vorher war Nichtstun ununterscheidbar von
Spielen; jetzt nicht mehr.

**Einschränkung, offen gesagt.** Der Builder meldet 31/34/15/19 %. Meine Zahlen
liegen darüber, und der Grund steht im Gerät: mein Automat klickt reihum die
nicht gesperrten Züge, und der mitlaufende Zähler zeigt, dass davon nur 0 bis 2
von 16 bis 24 Woche oder Kasse bewegen. Er löst Klänge aus — der Pegel
verdoppelt sich —, aber er *spielt* nicht so wie der Automat des Builders, der
44 bis 45 echte Züge in dreißig Sekunden setzt. **Die Richtung ist damit
unabhängig belegt, die Höhe nicht.** Wer die Höhe braucht, misst mit einem
Automaten, der wirklich spielt — oder lässt es einen blinden Kritiker tun.

**Erster Anlauf, verworfen und hier vermerkt, damit ihn niemand wiederholt:**
`bett.mjs` klickte alle 430 ms auf *dasselbe* Element (`z[länge/3]`) und maß
damit großenteils Leerklicks. Ergebnis 82/97/97/95 % — es sah nach kaum einer
Verbesserung aus. Ein Messgerät, das nicht spielt, misst die Kulisse zweimal.
