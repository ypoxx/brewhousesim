# Welle 13 · Stück 4 — DER GEGENZUG · Baubericht

*Laufend geschrieben. Wer hier liest, bevor die Schlusszeile steht, liest einen
halben Bericht — das ist Absicht: Agenten sterben mitten im Lauf.*

Dateien, die mir gehören und die ich angefasst habe:
`spiel/stuecke/gegner.js` · `spiel/stil/gegner-zusatz.css`.
Messgeräte: `werkbank/schuss/gegenzug-w13/**`.
**Nichts unter `spiel/kern/`, nichts von fremden Stücken, kein fremdes DOM.**

---

## 0 · Was ich NICHT angefasst habe

§4b des Urteils ist bestanden, und zwar ausdrücklich: *„Von allem, was ich in
vier Sitzungen geprüft habe, ist das der Teil, der am wenigsten Arbeit
braucht."* Deshalb ist **am Verhalten des Gegners keine Zeile geändert**:

* keine Zugliste, kein Gewicht, keine Frist, kein Preis einer Bindung,
* kein Text auf der Karte, keine Ankündigung (*„baut W30 · pachtet W36"*),
* kein `merkeZug`, kein `waehle`, kein `fuehreAus`, kein `zugUnglueck`,
* **und vor allem kein `meldeZug()`.** Das ist der Nenner der zweiten
  Messlatte (`welt.ZUGRANG.umkaempft = 3` schlägt jede andere Meldung). Wer
  dort einen billigeren Zug einträgt, verschiebt ρ, ohne dass sich am Spiel
  etwas geändert hätte. Der gemeldete Zug bleibt Wort für Wort derselbe: der
  billigste Zug, der den Streit **beendet** (ablösen · zuvorkommen ·
  mitbieten) — nicht der billigste Zug, den es gibt.

---

*(weiter unten, laufend ergänzt)*
