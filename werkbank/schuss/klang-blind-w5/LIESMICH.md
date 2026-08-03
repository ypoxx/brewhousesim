# Blinde Nachpruefung DER KLANG, Welle 5 — Belege

Gemessener Commit `2f0e4b4`, eingefroren nach /tmp/klangstand5/2f0e4b4,
eigener Hafen 8917. Urteil: ../../urteile/welle5-der-klang-urteil.md

## Geraete (alle selbst gebaut, hoerer.py blieb unveraendert)
- `aufnahme.mjs`  Mitschnitt am LEBENDEN Ausgang (BRAUHAUS.ton.ausgang()),
                  eigener ScriptProcessor, eigener WAV-Schreiber, kein
                  Gebrauch von ton.wav()/ton.rendere().
                  Env: DAUER, VORLAUF, RUHE, VORKLICKS, PLANJSON, HAFEN.
- `pegel.py`      Effektivwert, Spitze, Huellkurve, Hub — ohne numpy/ffmpeg.
- `antwortzeit.py` akustischer Einsatz nach einem Klick.
- `mische.py`     mischt auf probe-NN und versiegelt den Schluessel (Env SAAT).
- `frage-epoche.py`  ruft hoerer.hoere() OHNE --erwartet (nichts sickert durch).
- `frage-vorgang.py` eigenes Ohr: Vorgangsliste MIT BLENDERN + Anachronismen.

## Aufnahmen (.wav gitignoriert, .json versioniert)
- `roh/`   erster Satz, 8 Aufnahmen. ENTHAELT EINEN FEHLER MEINES PRUEFSTANDS:
           die ersten 2 s tragen den ausklingenden Vorlauf (4,5–7,9x Pegel).
- `rein/`  sauberer Satz, 8 Aufnahmen mit RUHE=8. HIERAUF STEHEN DIE ZAHLEN.
- `einzel/` 14 s, genau EIN Klick, fuer die Antwortzeit.

## Ergebnisse
- `pegel.json` / `pegel-rein.json`   Pegel und Huellkurven
- `blind-ergebnis.json`              Ohr 1 (gemini-3.1-pro-preview) auf roh/
- `durchgaenge-ohr2.json`            Ohr 2 (gemini-3.6-flash), 3 Durchgaenge
- `blind-rein-ergebnis.json`         Ohr 2 auf dem sauberen Satz
- `einzelschlag.json`                Klick -> Klang, Sekunden
- `vorgang/`                         Blenderprobe (nur 2 von 8, Kontingent)
- `vorgang-rein/`                    gestartet, am Kontingent gescheitert

Die .wav in blind/ und blind-rein/ sind geloescht; sie sind aus rein/ bzw.
roh/ mit mische.py und dem daneben liegenden schluessel.json wiederherstellbar.
