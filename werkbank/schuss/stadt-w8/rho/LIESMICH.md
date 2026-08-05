# stadt-w8/rho — die ρ-Messung der Welle 8

`lauf.sh` misst **vorher und nachher im selben Augenblick**: Hafen 8908 trägt
den Stand vor Welle 8 (Symlinkwald `stadt-w8/hafen-vor/`, in dem nur die fünf
STADT-Dateien aus `stadt-w8/vor/` alt sind), Hafen 8907 den Arbeitsbaum.

**Warum A/B statt nacheinander:** Layout bewegt ρ — das ist seit dem 5. August
gemessen (Knopfboden, 0,811 in 1970). Wer vorher und nachher zu verschiedenen
Zeiten misst, kann nicht mehr sagen, was die Zahl bewegt hat. Zwei Häfen aus
demselben Baum, die sich in genau fünf Dateien unterscheiden, können es.

Der Ordner braucht diese versionierte Datei, sonst ist er nach dem nächsten
Container-Reset weg (Git kennt keine leeren Ordner) — die Lehre der Aufsicht
vom 5. August.

`auswerten.py` der Aufsicht rechnet ρ über 12 / 13 / 14 Braujahre aus
`leiterRoh`. Ergebnis: `stadt-w8/rho-ergebnis.md` und der Baubericht.
