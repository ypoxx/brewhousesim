# DER KLANG — Welle 6, Belege zur Auflage 4 (DER GEGENZUG)

Bericht: [`../../urteile/welle6-der-klang-bau.md`](../../urteile/welle6-der-klang-bau.md)
Auflage: [`../../urteile/welle5-der-klang-urteil.md`](../../urteile/welle5-der-klang-urteil.md), AUFLAGE 4

## Messstand

Commit **`0058dd1`**, eingefroren nach `/tmp/messstand/0058dd1`, **Hafen 8941**,
gesetzt mit `werkbank/schuss/aufsicht/messstand.sh 0058dd1 8941`. Das Skript
prueft am Ende selbst, ob der Hafen den verlangten Stand ausliefert
(`.messstand-marke`) — es hat `0058dd1` bestaetigt.

In den Stand wird waehrend der Arbeit **nur** gespiegelt, was DEM KLANG gehoert
(`spiegle.sh`: `kern/ton.js`, `stuecke/klang.js`, `ton/**`). Alles andere bleibt
auf dem Commit, obwohl am Arbeitsbaum gleichzeitig gemessen wird.

## Fremde Werkzeuge, unveraendert benutzt

| | |
|---|---|
| `werkbank/hoerer.py` | das Ohr des Hauses. Nur `hoere()` gerufen, nie `--erwartet`. Zeichen fuer Zeichen unangetastet (ZUSTAENDIGKEIT 16) |
| `../klang-blind-w5/aufnahme.mjs` | Mitschnitt am **lebenden** Ausgang, eigener WAV-Schreiber. `RUHE=8`, `VORLAUF=26`, Zugplan des Kritikers, `saat=1350` |
| `../klang-blind-w5/frage-vorgang.py` | die Abnahmefrage der Auflage 4: acht Punkte, vier davon **Blender**, die es im KATALOG nirgends gibt |
| `../klang-blind-w5/mische.py` | mischt auf `probe-NN` und versiegelt den Schluessel |
| `../klang-w5-nach/frage.py` | ruft `hoerer.hoere()` und faengt HTTP 429 ab (eine Sperre ist kein Urteil ueber das Spiel) |
| `../klang/beschreibe.py` | legt EINE Probe vor, ohne Dateinamen, ohne Absicht — das Werkzeug, mit dem die falschen Proben gefunden werden |

## Eigene Werkzeuge (hier)

| | |
|---|---|
| `erzeuge.py` | die neuen Proben; jede Zeile traegt den Satz des Ohres, der die alte verurteilt hat. Hebt **jeden** Anlauf einzeln nach `alt/<name>.NN.mp3` |
| `nachbarzahl.py` | zaehlt am Mitschnitt, wie oft das NACHBARHOF-Zeichen wirklich anschlaegt. Liest die `nachbar: true`-Namen und `NACHBAR_PAUSE` aus `kern/ton.js` selbst |
| `zeichenhub.py` | wie hoch das Zeichen in der **Wellenform** steht: Effektivwert in den Sekunden des Zeichens gegen die Sekunden davor, dazu der Anteil unter 900 Hz |
| `nimm.sh` | acht Aufnahmen (vier gespielt, vier still) am Messstand |
| `spiegle.sh` | spiegelt nur die eigenen Dateien in den Messstand |
| `gegenzug.sh` + `vorgang-lies.py` | die Abnahme der Auflage 4, ausgezaehlt |
| `epoche.sh` + `epoche-lies.py` | die dritte Latte nach dem Verfahren des Kritikers: mischen, drei Durchgaenge, auszaehlen |
| `alt/` | jede ersetzte und jede verworfene Probe, **ausserhalb** von `spiel/`, damit keine tote Datei mitfaehrt |
| `antworten/` | alle Rohantworten und alle Schluessel |

Die `.wav` liegen nicht im Baum (`.gitignore`). Sie sind aus dem Messstand und
den hier abgelegten Zugplaenen nachstellbar; jedes `<name>.json` neben einer
Aufnahme haelt Klickprotokoll, Pegelverlauf, `geraten()`, `lage` und
Konsolenfehler fest.
