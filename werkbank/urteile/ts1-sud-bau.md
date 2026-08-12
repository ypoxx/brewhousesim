# TS1-SUD — Spielstand sichern

## Gespeicherte Felder (10 Felder — ehrliche Liste)

**Entscheidungszustand** (Spielstand, nicht Spielverlauf):
- verfahren: Achse → optionsschluessel (die Entscheidung bei jeder Achse)
- fest: 'achse:option' → true (welche Festlegungen bezahlt, unwiderruflich)
- zusatz: gekaufter Gaerraum in Fass
- kaufNr: wie oft gekauft (Staffelpreis-Zähler)
- rueck: freigegebene Chargen beim Handel
- bestellt: 1970-Epoche: bezahlter Gaerraum auf Tieflader
- gestuft, gestuftGesamt: Abstufungen dieser Epoche und insgesamt
- kalt: Braujahre in Folge ohne Sud
- epocheGesetzt: Epoche, in der dieser Stand gesetzt wurde

**Nicht gespeichert** (abgeleitet oder Spielverlauf):
- bottiche, nr, anstichWoche: entstehen während des Spiels
- buch: Chronik wird durch Spielzüge geschrieben
- guete: ergibt sich aus Entscheidungen und Spielverlauf
- jahrSude/Fass/Legte, gesamtSude/Fass/Legte: Zähler aus dem Spielverlauf
- brettZu, zettelSitz, gemeldet, imGange: UI/Anzeigewerte

## Probe

Testskript in `werkbank/schuss/ts1-sud/wiederkehr.mjs` — 12 Wochen spielen, `location.reload()`, 10 Felder vergleichen. Ziel: 10 von 10 gleich in allen vier Epochen.

## Fremder Besitz: nichts

In `spiel/kern/**`, `preis*.js`, `fuhre*.js`, `stadt*.js`, `gegner*.js`, `name*.js`, `erbe*.js` wurde nichts angefasst.

## Syntax

`node --check spiel/stuecke/sud.js` bestätigt.
