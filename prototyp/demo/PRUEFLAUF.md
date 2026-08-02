# Prüflauf — die gemessenen Zahlen zur Demo

Beide Voten in diesem Ordner berufen sich auf Messwerte, nicht auf Eindrücke. Hier stehen
sie, mitsamt dem Werkzeug, das sie erzeugt: `pruefen.mjs` fährt die Demo in Chromium und
spielt sie durch.

```
npm i playwright
node pruefen.mjs          # PLAYWRIGHT_BROWSERS_PATH wird beachtet
```

Die Demo bleibt unberührt. Für den Lauf wird eine Kopie mit einer einzigen zusätzlichen
Zeile angelegt (`window.__Z = Z`), damit der Spielzustand von außen lesbar ist; die Kopie
liegt im Temp-Verzeichnis und wird danach gelöscht. Alle Klicks sind echte Mausklicks auf
die Mitte des jeweiligen Bauteils, keine synthetischen Ereignisse.

Stand: `index.html` mit 1 472 Zeilen, Fenster 1600 × 950, vier Läufe, **keine
Konsolenfehler**.

---

## 1 · Ein sauber gespieltes Jahr

Strategie: wer am längsten wartet und mit einer vorhandenen Sorte erreichbar ist, bekommt.
Also der naheliegende Zug, zwölf Wochen lang, ohne Kunstgriff.

| Befund | Messwert |
|---|---|
| Kassenzuwachs je Woche | **264 M** — ein einziger Differenzwert über zwölf Wochen |
| Kellerstand | **6 Fass**, jede Woche; **3** nur in Woche 12, weil danach kein Sud mehr folgt |
| Höchster Durst irgendeines Hauses im ganzen Jahr | **1** (die Schwelle des Adlers liegt bei 3) |
| Häuser verloren | **0** |
| Fässer, die mangels Reichweite nicht abgegeben werden konnten | **0** |
| Saure Fässer | **0** |

Zwölf Wochen, ein Zustand. Die Auswertung dazu steht in
`VOTUM-SPIELDESIGNER.md` §2 und §3.

## 2 · Die Absagen

| Versuch | Antwort der Bühne |
|---|---|
| Landbier → Löwen (24 km) | „Landbier hält 10 Tage — Griesbach liegt 24 km weit. Zu weit." |
| Landbier → Sonne (38 km) | „Sonne zapft nicht unser Bier." |
| Märzen → Sonne (38 km) | „Sonne zapft nicht unser Bier." |
| Beschriftung unter der Sonne | „kein Fass reicht so weit" |

Die Sonne trägt eine Reichweiten-Beschriftung und gibt eine Besitz-Absage. `beladen()` prüft
`!h.unser` vor der Reichweite. Altenau ist genau die Adresse, nach der das Abnahmekriterium
in §8 des Vorschlags fragt.

## 3 · Vernachlässigung — greift der Verfall?

Nur die Krone wird beliefert, Ochsen und Löwen nie.

| Woche | Ochsen | Löwen | Keller |
|---|---|---|---|
| 2 | 1 | 1 | 8 |
| 3 | 2 | 2 | 10 |
| 4 | 3 · umworben | 3 · umworben | 12 |
| 5 | 4 | 4 | 12 |
| 6 | **verloren** | **verloren** | 12 |
| 7–10 | verloren | verloren | 12 |

Die Kette steigt, warnt zwei Wochen vorher und vollstreckt — sauber gebaut. Ab Woche 7 ist
jede Woche mit der vorigen identisch: es gibt keinen Zustand „verloren", nur einen mit
weniger zu tun.

## 4 · Die Tastatur

| Frage | Antwort |
|---|---|
| Tab-Folge | Anschlag → die sechs Fässer → Tonschalter → Umbruch |
| Fass per Enter aufnehmbar? | **ja** (`Z.gewaehlt` wird gesetzt) |
| Haus fokussierbar? | **nein** — kein `tabindex` |
| Ladung nach Enter auf dem Haus | **0** |

Man kann ein Fass in die Hand nehmen und hat nichts, worauf man es legen könnte.
§7.2 des Vorschlags verlangt den zweiten Bedienweg *„von Anfang an gleichberechtigt"*.
