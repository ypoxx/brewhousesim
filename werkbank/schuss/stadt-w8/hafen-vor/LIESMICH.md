# hafen-vor — der Vorher-Hafen 8908

Ein Symlinkwald auf den Arbeitsbaum, in dem **nur die fünf STADT-Dateien**
aus `../vor/` (Stand `76f3ca4`) alt sind. Alles übrige — Kern, die anderen
drei Stücke, `spiel/bild/`, `spiel/ton/`, `index.html` — ist **dieselbe
Datei** wie im Arbeitsbaum.

Wieder aufsetzen nach einem Container-Reset:

    werkbank/schuss/stadt-w8/hafen-vor-aufsetzen.sh 8908

Das Skript prüft am Ende selbst, ob der Hafen wirklich `bottom: 0.7%`
ausliefert — steht dort `top: 7.8%`, liefert er den Arbeitsbaum, und jede
Messung daran wäre wertlos. Kein Skript meldet Erfolg, ohne das Ergebnis
anzusehen.

`spiel/` selbst steht nicht in der Versionsverwaltung (es sind nur Symlinks
mit absoluten Pfaden); diese Datei hält den Ordner über den nächsten Reset.
