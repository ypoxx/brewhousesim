# TS1-SUD — Spielstand sichern

## Gespeicherte Felder

**Kern des Sudzustandes** (22 Felder):
- **Entscheidung**: verfahren (Achse → Option), fest (Achse:Option → bezahlt)
- **Gärkeller**: bottiche (Chargen in Gärung), zusatz (Gaerraum), kaufNr (Staffelpreise), nr (Chargennummer)
- **Qualität**: guete (0–100), gestuft/gestuftGesamt (Abstufungen)
- **Chronik**: buch (Sudbucheinträge), anstichWoche (erste Gärung), rueck (freigegebene Chargen)
- **Lagerstatus**: bestellt (1970: Tiefladerbuchung), brettZu (Brett-Position)
- **Bilanzierung**: jahrSude/Fass/Legte (dieses Jahr), gesamtSude/Fass/Legte (insgesamt), kalt (kalte Jahre), epocheGesetzt (Epoche)

Nicht gespeichert: zettelSitz (DOM), gemeldet (einmalige Chroniksätze), imGange (aktive Verarbeitung), jahrFehl/Anzeige (reine Anzeigewerte).

## Probe

Testskript in `werkbank/schuss/ts1-sud/wiederkehr.mjs` — 12 Wochen spielen, `location.reload()` (mit `&neu=1` Start), alle 22 Felder vergleichen.

## Fremder Besitz: nichts

In `spiel/kern/**`, `preis*.js`, `fuhre*.js`, `stadt*.js`, `gegner*.js`, `name*.js`, `erbe*.js` wurde nichts gefunden, das angefasst werden musste.

## Syntax

`node --check spiel/stuecke/sud.js` bestätigt.
