# Belege zur Nacharbeit DER PREIS, Welle 5

Der Bericht steht in `werkbank/urteile/welle5-der-preis-nacharbeit.md`, das
Urteil, das hier abgearbeitet wird, in `welle5-der-preis-urteil.md`.

**Gemessen wird SEQUENZIELL**, ein Browser nach dem anderen. Der Kritiker hat
nachgewiesen, dass dieses Spiel sequenziell gar nicht streut (Spannweite
0,000); wer Streuung misst, misst seinen Browser.

**Vorher-Stand:** `werkbank/schuss/aufsicht/messstand.sh 6b59a18 8906` — die
reparierte Fassung prueft selbst, ob der Hafen den verlangten Commit
ausliefert, und meldet `(Fassung geprueft)`.
**Nachher-Stand:** der Arbeitsbaum auf Hafen 8899.

## Geraete

| Datei | was sie tut |
|---|---|
| `linie.mjs` | Byte fuer Byte die Vorbild-Hand (`preis-kritik-w5/linie-vorbild.mjs` = `rueckkopplung-r3/linie.mjs`), plus zweierlei, das das SPIEL nicht aendert: (1) je Michaeli wird `BRAUHAUS.preis.taxe()` und die Sichtlage jedes `preis:festlege:*`-Knopfes mitgeschrieben, (2) `WILL=1` tauscht die Festlegungsregel gegen „nimm die teuerste zulaessige, lass die Angebote stehen" — die Hand des Kritikers (`festhand.mjs`). Ohne `WILL` ist sie das Vorbild. |
| `auswerten.py` | zaehlt, was Auflage 4 zaehlt: Festlegungen je Partie, Michaelitage ohne bezahlbare Festlegung, Michaelitage mit leerer Reihe, und je Karte die Jahre, in denen sie zu haben war. |
| `bild/` | die zwoelf Seiten von `ueberlauf.mjs` (vier Epochen mal drei Aufloesungen) und sechs Michaelitafeln aus einzelnen Jahren. |

Die rho-Zahlen dieses Berichts kommen **nicht** von `linie.mjs`, sondern vom
**unveraenderten** `preis-kritik-w5/linie-vorbild.mjs` (ZUSTAENDIGKEIT 16: am
fremden Messgeraet wird nicht gedreht).

## Nachstellen

```bash
werkbank/schuss/aufsicht/messstand.sh 6b59a18 8906     # Vorher-Stand

# Die Wellenzahl, drei Laeufe je Epoche, SEQUENZIELL, 400 Wochen = 14 Michaelitage
for L in A B C; do for e in 1 2 3 4; do
  HAFEN=8899 node werkbank/schuss/preis-kritik-w5/linie-vorbild.mjs $e 400 /tmp/pn5/nach-e$e-$L.json
done; done
python3 werkbank/schuss/rueckkopplung-r3/auswerten.py /tmp/pn5/nach-e?-?.json

# Auflage 4: die Hand, die Festlegungen WILL
for e in 1 2 3 4; do
  WILL=1 HAFEN=8899 node werkbank/schuss/preis-w5b/linie.mjs $e 400 /tmp/pn5/nachher-will-e$e.json
done
python3 werkbank/schuss/preis-w5b/auswerten.py /tmp/pn5

# Auflage 3: laeuft Text ueber seinen Kasten?
HAFEN=8899 ORT=$PWD/werkbank/schuss/preis-w5b/bild \
  node werkbank/schuss/preis-kritik-w5/ueberlauf.mjs

# Eine einzelne Michaelitafel fotografieren
HAFEN=8899 node werkbank/schuss/preis-w5/tafel-schuss.mjs 2 /tmp/t.png 1610
```

**Die Zahl `rho` haengt daran, ueber wie viele Michaelitage gezaehlt wird.**
400 Wochen = vierzehn Michaelitage; das ist die Zaehlweise, aus der der
eingetragene Stand +0,591 / +0,231 / +0,393 / +0,275 stammt, und jede Zahl in
diesem Verzeichnis ist so gemessen.
