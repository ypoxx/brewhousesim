# Belege zum Urteil DER PREIS, Welle 5 (blinder Kritiker)

Gemessener Commit: **`6b59a18`**, eingefroren auf eigenem Hafen 8906 ueber
`hafen.sh 6b59a18 8906`. Einmal zum Vergleich der Vor-Stand **`3e6d08c`**
(Hafen 8900) — die Dateien tragen das im Namen.

Das Urteil steht in `werkbank/urteile/welle5-der-preis-urteil.md`.

## Messgeraete (alle `HAFEN=8906 node <datei> …`)

| Datei | was sie tut |
|---|---|
| `hafen.sh <commit> <hafen>` | friert einen Commit ein und **prueft die ausgelieferte Datei gegen den Commit** (drei Dateien, `sha1sum` gegen `git show`). Ersatz fuer `aufsicht/messstand.sh`, das in diesem Container ohne `ss` unter `set -e` abreisst und still den alten Stand weiterliefert. |
| `linie-vorbild.mjs` | **unveraenderte Kopie** von `rueckkopplung-r3/linie.mjs` (ZUSTAENDIGKEIT 16 — am fremden Geraet wird nicht gedreht). |
| `hand.mjs` | dieselbe Hand, drei Aenderungen: Preisschild mit **Vorzeichen** statt `Math.abs()`, 420 Wochen, mehr wird mitgeschrieben. `ABS=1` stellt die Falle wieder her. |
| `festhand.mjs` | wie `hand.mjs`, nimmt aber die **teuerste** zulaessige Festlegung und laesst die Angebote stehen. |
| `boden.mjs <ep> faul\|gierig` | der Kassenboden unter einer schlechten Hand. |
| `decke.mjs` | wer auf der Tafel liegt — Hand, die **nicht** spielt. |
| `decke2.mjs` | dasselbe, aber **spielend**, mit Elementpfad unter dem Mauspunkt. |
| `decke3.mjs` | dasselbe plus **Stilkette jedes Vorfahren** — damit wurde `stadt-zugeklappt` gefunden. |
| `frei.mjs` | spielende Hand, die erst die Blaetter der FUHRE und des ERBE wegraeumt. |
| `tafel.mjs` | spielende Hand, die die **eingeklappte Tafel ueber den Reiter der STADT aufschlaegt**, bevor sie zaehlt. Die berichtigten (a)-Zahlen kommen von hier. |
| `knoepfe.mjs` | ZUSTAENDIGKEIT 25, Knopf fuer Knopf, nach Zugschluessel aufgeschluesselt. |
| `ueberlauf.mjs` | laeuft Text ueber seinen Kasten — vier Epochen mal drei Aufloesungen, mit Bildern. |
| `auswerten.py` | rho (Spearman und Pearson), Jahre unter 1×, Kassenboden **Buchung fuer Buchung**, (a)/(b)/(c). |
| `welle-seq.sh`, `nachlauf.sh` | die Laeufe, **sequenziell** — nie parallel. |

## Ergebnisse (`.json.gz`, mit `zcat` zu lesen)

* `e{1..4}-{A,B,C}.json.gz` — die zwoelf Laeufe der Hauptwelle, 420 Wochen.
  Die drei Laeufe je Epoche sind **Ziffer fuer Ziffer identisch**; Spannweite 0,000.
* `e{3,4}-ABS.json.gz` — dieselbe Hand mit wiederhergestellter `Math.abs()`-Falle.
* `vorbild-e{1..4}.json.gz` — die **unveraenderte** Vorbild-Hand, 400 Wochen, `6b59a18`.
* `vorbild-e4-zweit.json.gz` — Wiederholung, Ziffer fuer Ziffer gleich.
* `vorbild-e{3,4}-alt3e6d08c.json.gz` — dieselbe Hand auf dem **Vor-Stand**;
  liefert +0,393 und +0,108, also genau den eingetragenen Stand.
* `boden-e{1..4}-faul.json.gz`, `fest-e{1..4}.json.gz`,
  `decke{,2,3}-e*.json.gz`, `frei-e{1,2}.json.gz`, `tafel-e{1..4}.json.gz`,
  `knoepfe.json.gz`, `ueberlauf.json.gz`.
* `bild/` — zwoelf Bildschirmfotos (PNG, per `.gitignore` nicht im Repo).

## Der Fehler, den ich selbst gemacht und selbst gefunden habe

Die erste Messreihe lief eine Stunde gegen **`3e6d08c`** statt `6b59a18`, weil
`aufsicht/messstand.sh` den Hafen nicht umstellte und den Fehlschlag nur ueber
den Exit-Code meldete. Verworfen, neu gemessen, im Urteil benannt.

Der zweite Fehler war die Zaehlhand: sie zaehlte die in die Reiterleiste der
STADT **eingeklappte** Michaelitafel (`clip-path: inset(50%)`) und meldete
daraufhin eine Verdeckung, die es nicht gibt. Widerlegt mit `decke3.mjs`,
`frei.mjs` und `tafel.mjs`; beides steht im Urteil, Abschnitt 3.3.
