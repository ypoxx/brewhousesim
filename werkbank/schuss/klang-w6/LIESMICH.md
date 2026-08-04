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
| `lautheit.mjs` | **wie laut eine Probe wirklich aus dem Erzeuger kam** — im Browser decodiert, nicht geschaetzt. Das Werkzeug, das gefunden hat, dass `angleich()` bei Faktor 6 kappt und `drueben1` deshalb nie seinen Zielpegel erreicht hat |
| `nimm.sh` | acht Aufnahmen (vier gespielt, vier still) am Messstand |
| `spiegle.sh` | spiegelt nur die eigenen Dateien in den Messstand |
| `gegenzug.sh` + `vorgang-lies.py` | die Abnahme der Auflage 4, ausgezaehlt |
| `gegenzug-wieder.sh` + `mehrheit.py` | dieselbe Abnahme in **drei Durchgaengen** mit Mehrheitsentscheid — Sperrliste 5 des Kritikers, auf seine Vorgangsfrage angewandt. In dieser Runde gebaut, aber nicht mehr zu Ende gemessen (siehe Bericht, Abschnitt 14) |
| `epoche.sh` + `epoche-lies.py` | die dritte Latte nach dem Verfahren des Kritikers: mischen, drei Durchgaenge, auszaehlen |
| `alt/` | jede ersetzte und jede verworfene Probe, **ausserhalb** von `spiel/`, damit keine tote Datei mitfaehrt |
| `antworten/` | alle Rohantworten und alle Schluessel |

Die `.wav` liegen nicht im Baum (`.gitignore`). Sie sind aus dem Messstand und
den hier abgelegten Zugplaenen nachstellbar; jedes `<name>.json` neben einer
Aufnahme haelt Klickprotokoll, Pegelverlauf, `geraten()`, `lage` und
Konsolenfehler fest.

## Die sechs Staende

| | was ihn ausmacht | Aufnahmen | GEGENZUG gespielt / still |
|---|---|---|---|
| `vorher` | Ausgangsstand `0058dd1` | `/tmp/klang6/vorher` | (Vorrunde: 1 / 0) |
| A | eigene Zeichendatei, Wand 900 Hz, Pegel 0,27 | `/tmp/klang6/a` | 1 / 0 |
| B | Pegel 0,55 (kam nicht an), Wand 1100 Hz, Dauer 4,2 s | `/tmp/klang6/b` | 1 / 0 |
| C | `hebe()`, Vorhalt 0,35 s, kurze tiefe Senke | `/tmp/klang6/c` | 1 / 0 — **Anachronismus** |
| D | Wand 600 Hz + Ausgleich 1,9x | `/tmp/klang6/d` | 2 / 0 — **Anachronismus** |
| E | stimmloses `drueben1` | `/tmp/klang6/e` | 0 / 0 |
| **F** | dazu `bus.fern` zurueck auf 2000 Hz — **ausgeliefert** | `/tmp/klang6/f` | **0 / 0** |
