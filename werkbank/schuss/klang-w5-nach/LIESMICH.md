# DER KLANG — Nacharbeit Welle 5, Belege

Bericht: [`../../urteile/welle5-der-klang-nacharbeit.md`](../../urteile/welle5-der-klang-nacharbeit.md)
Urteil, gegen das gearbeitet wurde: [`../../urteile/welle5-der-klang-urteil.md`](../../urteile/welle5-der-klang-urteil.md)

## Messstand

Ein eingefrorener Abzug des Arbeitsbaums unter `/tmp/klangbau/stand/`, Hafen
8931, in den waehrend der Arbeit **nur** meine Dateien nachkopiert wurden
(`kern/ton.js`, `stuecke/klang.js`, `ton/**`). Damit unterscheiden sich
Vorher- und Nachher-Messung nur in dem, was ich geaendert habe, obwohl am
selben Arbeitsbaum gleichzeitig DER PREIS gebaut hat.

## Fremde Werkzeuge, unveraendert benutzt

* `werkbank/hoerer.py` — das Ohr des Hauses. Nur `hoere()` gerufen, nie
  `--erwartet`. Zeichen fuer Zeichen unangetastet (ZUSTAENDIGKEIT 16).
* `werkbank/schuss/klang-blind-w5/aufnahme.mjs` — der Mitschnitt des Kritikers
  am **lebenden** Ausgang. `RUHE=8`, `VORLAUF=26`, sein Zugplan, `saat=1350`.
* `.../mische.py`, `.../pegel.py`, `.../antwortzeit.py`, `.../frage-vorgang.py`
  — ebenfalls unveraendert.
* `werkbank/schuss/klang/beschreibe.py` — legt EINE Probe vor, ohne
  Dateinamen und ohne Absicht. Das Werkzeug, mit dem die sieben falschen
  Proben gefunden wurden.

## Eigene Werkzeuge (hier)

| | |
|---|---|
| `erzeuge.py` | die neuen Proben; jede Zeile traegt den Satz des Ohres, der die alte verurteilt hat |
| `dateien.mjs` | Katalog gegen Verzeichnis, im laufenden Spiel, in beide Richtungen: fehlende **und** tote Proben |
| `kamm.py` | Auflage 3 an der **Wellenform**: Autokorrelation im Fenster von `fuhre:fuellen`. Zwoelf Kopien mit 40 ms Versatz stehen als Spitze bei 40 ms; nach der Grenze ist sie weg |
| `frage.py` | legt gemischte Proben `hoerer.hoere()` vor, faengt HTTP 429 ab (eine Sperre ist kein Urteil ueber das Spiel) und wartet zwischen den Fragen |
| `alt/` | die ersetzten Proben, **ausserhalb** von `spiel/`, damit keine tote Datei mitfaehrt |
| `antworten/` | alle Rohantworten und alle Schluessel |

## Was in `antworten/` liegt

| Datei | was |
|---|---|
| `vorher-antworten.json` | vorgefundener Stand `36f81c6`: still 12/12, gespielt 3/12 |
| `final-antworten.json` | Zwischenstand A: still 0/12, gespielt 10/12 |
| `final2-antworten.json` | Zwischenstand B: still 2/12, gespielt 8/12 |
| `schluss-antworten.json` | **ausgeliefert**: still 2/12, gespielt 7/12 |
| `*-schluessel.json` | die Zuordnung `probe-NN.wav` → Quelle, je Satz unter eigener Saat |
| `vorgang.json` | Vorgangs- und Blenderprobe ueber alle acht Aufnahmen des ausgelieferten Standes — **einschliesslich der stillen Gegenprobe**, die dem Kritiker am Kontingent gescheitert war (0 von 32 Vorgangsfragen bejaht) |
| `pegel-vorher.json`, `pegel-schluss.json` | Effektivwerte, Huellkurven, Hub |

Die WAV liegen nicht im Baum. Sie sind aus dem Messstand und den hier
abgelegten Zugplaenen nachstellbar; jedes `<name>.json` neben einer Aufnahme
haelt Klickprotokoll, Pegelverlauf, `geraten()`, `lage` und Konsolenfehler
fest.

## Warum drei neue Staende gemessen sind und nicht einer

Zwischenstand A hat die besten Epochenzahlen und faellt trotzdem durch
Auflage 2 (1350 wird zweimal von drei als 1884 gehoert). Ausgeliefert wird der
Stand, der die Auflage erfuellt, nicht der mit der schoensten Zahl. Alle drei
Messungen stehen im Bericht nebeneinander; der Unterschied zwischen ihnen
(83/67/58 % bei je zwoelf Messungen) ist ein bis drei Treffer und wird als
Rauschen behandelt.
