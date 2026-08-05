# Messstand DER PREIS, Welle 7

Rohdaten der rho-Messungen dieses Builders. Ein Ordner je Satz:

| Ordner | Was |
|---|---|
| `rho/vorher-*` | Stand vor der Nacharbeit (Ausgangsmessung) |
| `rho/nachher-*` | Stand nach der Nacharbeit |

Gemessen ausschliesslich durch `werkbank/schuss/aufsicht/messfenster.sh` mit
`werkbank/schuss/rueckkopplung-r3/linie.mjs <epoche> 400 <ziel.json>`,
ausgewertet mit `werkbank/schuss/fuhre-w6/schnitte.py`.

Diese Datei haelt den Ordner ueber den naechsten Container-Reset am Leben —
Git kennt keine leeren Ordner.
