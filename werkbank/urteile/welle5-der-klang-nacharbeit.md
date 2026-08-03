# DER KLANG — Nacharbeit zu Welle 5

**Urteil, gegen das gearbeitet wird:** `welle5-der-klang-urteil.md`,
BESTEHT MIT AUFLAGE, gemessen an `2f0e4b4`.
**Ausgangsstand dieser Nacharbeit:** `36f81c6`. Zwischen `2f0e4b4` und `36f81c6`
haben sich an `spiel/` nur `preis*.js` und `preis-zusatz.css` bewegt (anderer
Builder); `kern/ton.js`, `stuecke/klang.js` und `ton/**` sind Zeichen fuer
Zeichen unveraendert. Der Ton, den der Kritiker gemessen hat, ist also der Ton,
den ich vorgefunden habe.

Dieser Bericht wird LAUFEND geschrieben. Was hier steht, ist gemessen, sobald
eine Zahl danebensteht; was noch offen ist, steht als OFFEN.

---

## 0 — Der Messstand (eingefroren, damit Zahlen nicht wandern)

Am Arbeitsbaum baut gleichzeitig DER PREIS. Eine Zahl auf einem wandernden Ziel
ist keine Zahl. Deshalb:

* `/tmp/klangbau/stand/` — vollstaendige Kopie des Arbeitsbaums zum Zeitpunkt
  des Beginns, eigener Hafen **8931**.
* In diesen Stand wird waehrend der Arbeit **nur** kopiert, was mir gehoert:
  `spiel/kern/ton.js`, `spiel/stuecke/klang*.js`, `spiel/ton/**`,
  `spiel/stil/klang.css`. Alles andere — auch `preis*.js` — bleibt auf dem
  Stand des Beginns. Vorher-Messung und Nachher-Messung unterscheiden sich
  damit **nur** in meinen Dateien.
* Aufgenommen wird mit dem Geraet des Kritikers,
  `werkbank/schuss/klang-blind-w5/aufnahme.mjs`, **Zeichen fuer Zeichen
  unveraendert** (Mitschnitt am lebenden Ausgang, eigener WAV-Schreiber, kein
  Gebrauch von `ton.wav()`/`ton.rendere()` — Sperrliste 4). Gleiche
  Umgebung wie er: `RUHE=8`, `VORLAUF=26`, derselbe Zugplan, `saat=1350`.
* Gehoert wird mit `werkbank/hoerer.py`, ebenfalls unveraendert (ZUSTAENDIGKEIT
  16); gerufen wird nur `hoere()`, ohne `--erwartet`, damit nichts durchsickert.

---

## 1 — Was ich vorgefunden habe

OFFEN — wird eingetragen, sobald die Vorher-Messung steht.
