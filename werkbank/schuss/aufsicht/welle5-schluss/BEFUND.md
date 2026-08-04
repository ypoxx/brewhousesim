# Nachmessung der Aufsicht zum Abschluss von Welle 5 — 4. August 2026

Zwölf Läufe à 400 Wochen, **sequenziell**, auf dem eingefrorenen Stand `916004d`
(Hafen 8980, Fassung vom Messstand selbst geprüft), je drei pro Epoche, mit
`rueckkopplung-r3/linie.mjs`.

| Epoche | ρ (drei Läufe) | Spannweite | Jahre < 1× | Seitenfehler |
|---|---|---|---|---|
| 1350 | +0,591 ×3 | **0,000** | 0/14 | 0 |
| 1600 | +0,231 ×3 | **0,000** | 0/14 | 0 |
| 1884 | +0,393 ×3 | **0,000** | 1/14 | 0 |
| 1970 | +0,275 ×3 | **0,000** | 0/14 | 0 |

**Wellenziel — |ρ| < 0,7 in allen vier und höchstens ein Jahr von sechs unter
1× — bei vierzehn Braujahren ERREICHT.** Die Zahlen decken sich Ziffer für
Ziffer mit denen des Builders und des blinden Kritikers; drei Messungen, eine
Zahl.

---

## Der Einwand des Kritikers, unabhängig bestätigt und ausgeweitet

Dieselbe Reihe, nur anders geschnitten:

| Epoche | 12 Braujahre | 13 | 14 |
|---|---|---|---|
| **1350** | **+0,762** | **+0,692** | +0,591 |
| 1600 | +0,371 | +0,264 | +0,231 |
| 1884 | +0,168 | +0,346 | +0,393 |
| 1970 | +0,427 | +0,154 | +0,275 |

> **Bei zwölf Braujahren reißt 1350 die Latte** (+0,762 > 0,700). Bei dreizehn
> liegt es acht Tausendstel darunter. Erst bei vierzehn steht der gemeldete
> Wert.

**Die Latte ist damit nicht falsch, aber unvollständig.** „|ρ| < 0,7" ist ohne
Angabe der Laufzeit keine Aussage. Das gilt für jede Zahl dieses Laufs, auch
rückwirkend: die 400 Wochen stammen aus dem ersten Messgerät
(`eichung/preis-linie.mjs`) und sind eine Konvention, kein Argument.

**Was 1884 zeigt, und warum das gegen ein bloßes „länger messen" spricht:** dort
läuft die Zahl in die *andere* Richtung (+0,168 → +0,346 → +0,393). Es gibt also
keine Laufzeit, die für alle vier Epochen die freundlichste wäre — wer eine
aussucht, sucht sie für eine Epoche aus.

**Vorschlag der Aufsicht, zu entscheiden vom Auftraggeber:** die Latte über
**alle drei Schnitte** messen und die **Spannweite** mitnennen, statt eine
Laufzeit zu küren. Dann heißt die Aussage nicht „ρ ist +0,591", sondern
„ρ liegt zwischen +0,591 und +0,762, und bei zwölf Jahren reißt es" — was
strenger ist und nichts verschweigt.

**Nicht die Aufgabe eines Builders.** Das ändert die Messlatte, nicht das Spiel.
