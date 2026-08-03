# Nachmessung der Aufsicht zum Abschluss von Welle 4 — 3. August 2026

Zwölf Läufe à 400 Wochen auf dem **eingefrorenen HEAD `1b5ab7a`** (eigener Hafen
8930, inhaltsgleich mit dem Arbeitsbaum geprüft), je drei pro Epoche, mit dem
**neuen Gerät** `rueckkopplung-r3/linie.mjs`. Dazu zwei Läufe auf dem alten
Stand `da7d690` (Hafen 8940) zum Vergleich.

| Epoche | ρ (drei Läufe) | Spannweite | Start → Ende | max | Jahre < 1× | Seitenfehler |
|---|---|---|---|---|---|---|
| 1350 | +0,591 / +0,591 / +0,591 | **0,000** | 5,89 → 8,20 | 18,44 | 0/14 | 0 |
| 1600 | +0,231 ×3 | **0,000** | 3,76 → 3,22 | 15,11 | 0/14 | 0 |
| 1884 | +0,393 ×3 | **0,000** | 8,35 → 5,18 | 9,40 | 1/14 | 0 |
| 1970 | +0,108 ×3 | **0,000** | 2,25 → 4,26 | 9,14 | 0/14 | 0 |

**Wellenziel — |ρ| < 0,7 in allen vier und höchstens ein Jahr von sechs unter
1× — ERREICHT.**

---

## Zwei Berichtigungen an der Aufsicht selbst

**(1) „ρ streut zwischen identischen Läufen um 0,54" war falsch.** Diese Zahl
hatte die Aufsicht heute Nachmittag gemessen und als *bindende Messregel* in den
Auftrag geschrieben. **Es streute nicht das Spiel, sondern die Messhand.**
`eichung/preis-linie.mjs:80` sah nach jedem Klick genau einmal hin, mit fester
Wartezeit; unter Last war der Knopf noch nicht neu gezeichnet, der Klick fiel
ersatzlos aus, und die Partie lief anders. Das neue Gerät sieht bis zu sechsmal
hin und wartet auf einen echten Bildaufbau — **Spannweite 0,000 über zwölf
Läufe.** Gefunden hat das der Builder, nicht die Aufsicht.

Die Regel „mindestens drei Läufe je Epoche" bleibt richtig — aber als *Kontrolle
des Geräts*, nicht weil das Spiel würfelt. Wer jetzt Streuung misst, hat ein
kaputtes Messgerät und soll es suchen, statt sie hinzunehmen.

**(2) „Der Fehler ist umgezogen — 1350 ist durch diese Runde gerissen" war
falsch.** Gegenprobe mit dem neuen Gerät auf dem **alten** Stand `da7d690`:
**+0,701, zweimal identisch.** 1350 riss also schon vorher; die alte Hand hat es
nur verdeckt. Die Runde hat es nicht gebrochen, sondern von +0,701 auf +0,591
verbessert.

---

## Ein Befund über die Methode: parallele Nacharbeiten setzen sich nicht zusammen

Der Builder meldet für 1350 **+0,288**, die Aufsicht misst **+0,591**. Beide
Zahlen stimmen — sie stehen auf verschiedenen Bäumen.

- Letzter `preis.js`-Commit der RÜCKKOPPLUNG: **15:36**.
- `sud-daten.js` mit der neuen Achse **DAS BRAUWASSER** (darunter `roehre`,
  30 Pf, `fest: true`): **15:55**.
- Und `sud.js:2179` ruft `B.welt.meldeZug(...)` — DER SUD speist Preise in
  **genau die Kennzahl**, an der DIE RÜCKKOPPLUNG gemessen wird.

Der Builder hat also ohne die neue Achse gemessen, die Aufsicht mit ihr.

> **Regel für die nächste Welle:** Zwei Stücke, die dieselbe Kennzahl füttern,
> dürfen nicht gleichzeitig nachgearbeitet werden — oder ihre Zahlen sind nur
> auf einem gemeinsamen, eingefrorenen Stand vergleichbar. Die Zahl, die zählt,
> ist die des **zusammengeführten** Baums, denn den spielt man.
