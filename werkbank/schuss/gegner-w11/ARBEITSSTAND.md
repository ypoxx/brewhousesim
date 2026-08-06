# Welle 11 — DER GEGNER. Arbeitsstand (laufend geschrieben)

*Angefangen am 6. August 2026. Vorzustand `7896ee6`, Messstand auf Hafen 8961.
Geschrieben wird laufend, weil ein Builder dieser Welle schon an einem
Container-Reset gestorben ist und nur seine geschriebenen Zahlen überlebt haben.*

## Der Auftrag in vier Zeilen

| | Auflage | Abnahme |
|---|---|---|
| **A3** | Die Gegnerkarte schneidet keine gemalte Beschriftung an | vier Ortsschilder frei, alle vier Epochen, Lade- wie Spielzustand |
| **A6** | Das Band „UMKÄMPFT …" raus aus dem untersten Sechstel | dort trägt jedes Zielblatt seinen Vordergrund |
| **A10** | `.gg-bandzeile .was` kürzt 1810 px Text in 731 px; die Kassenspalte schneidet Ziffern ab | kein gekürzter Satz, keine gekürzte Zahl |
| **Haushalt** | 28.000 px gesamt · 8.000 px oberstes ⅙ · `ueberRand()` leer, auch gebaut | `BRAUHAUS.haushalt.pruefe()` |

---

## 1 — Was vor der ersten Zeile Code gemessen wurde

**`spiel/` ist zwischen `7896ee6` und `HEAD` (dbd3a18) byteweise gleich.**
`git diff --stat 7896ee6 HEAD -- spiel/` ist leer.

### 1.1 Der Vorzustand, photographisch (`rahmen-w10/messen.mjs`, Hafen 8961, Ladezustand)

| | 1350 | 1600 | 1884 | 1970 |
|---|---|---|---|---|
| **gegner gesamt** | 195.127 px | 200.464 px | 187.855 px | **215.077 px** |
| gegner oberstes ⅙ | 0 | 0 | 0 | 0 |
| gegner Mittelband | 5,9 % | 6,3 % | 5,8 % | 6,8 % |
| gegner unterstes ⅙ | 4,0 % | 3,3 % | 3,6 % | 3,3 % |
| gegner Kästen | 21 | 23 | 22 | 22 |
| Deckung gesamt (alle Stücke) | 18,4 % | 19,3 % | 18,7 % | 19,3 % |
| Ruheprobe | 0,0 % | 0,0 % | 0,0 % | 0,0 % |
| über dem Rand · Währungsbruch · fehlende Zeichen | 0·0·0 | 0·0·0 | 0·0·0 | 0·0·0 |

Der Auftrag nennt **214.788**; gemessen auf `7896ee6` sind es **215.077** in 1970.
Die Zahl des Auftrags stammt vom Stand `37f4b44` — der Unterschied von 289 px
(0,13 %) ist die Arbeit des Rahmens an der Kopfleiste, die unter dem Band
hindurchreicht. **Die Grenze ist 28.000: der Schnitt ist auf ein Siebtel.**

Das oberste Sechstel steht schon auf **0** — DER GEGNER stellt im Ladezustand
nichts über y = 256. Die 8.000 px dort sind eine Grenze für den Spielzustand.

### 1.2 Wo die Fläche steckt (Hüllen, `gegner-w11/sonde.mjs`, Ladezustand)

Innensicht des Haushalts: gegner **189.632 / 193.840 / 177.216 / 209.664 px**
(E1–E4), also 6 bis 9 Prozent unter der photographischen Zahl — Hüllen kennen
keinen Schlagschatten. Die größten Kästen, Epoche 1350:

```
  62426 px²   366×171 @1964,584   .gg-sitz gg-adler      seine Karte
  26953 px²   849× 32 @1710,1282  .gg-kennzahl           „umkämpft …"  ← A6
  19472 px²   285× 68 @1096,676   .gg-amt                die Klage
  14128 px²   336× 42 @1979,671   .gg-zahlen             Züge/Kasse/Preis  ← A10
  11660 px²   224× 52 @2365,595   .gg-wimpel             „wirbt · noch 4 Wo."
   9729 px²   414× 24 @1940,560   .gg-vorschild
   9126 px²   192× 48 (×3)        .gg-fass               „Fass an den Wirt"
   8067 px²   155× 52 (×2)        .gg-schild             „TOR · KON  ablösen 56 Pf"
```

Die vier gemalten Ortsschilder DER STADT (dieselben Koordinaten in allen vier
Epochen, weil `kern/orte.js` sie festhält):

```
  ST. MICHAEL        146×23 @1550,527
  GASTHOF LINDENHOF  269×28 @1737,787
  BRAUEREI ADLER     ~150×17 @~2100,~460    (Name je Epoche verschieden)
  Hoftorschild       ~200×100 @~1150-1340,~900-1040
```

`.gg-sitz` steht in allen vier Epochen bei **@1964,584**, ist 145 bis 171 px
hoch, und wächst nach unten (Anker `oben`). Unterkante heute 729 bis 755;
GASTHOF LINDENHOF beginnt bei y = 787. **Im Ladezustand sind das 32 bis 58 px
Luft — im Spielzustand wächst die Karte um Marken, Wochenzettel und
Wochenzugzeile und frisst sie auf. Genau das hat der Kritiker gesehen.**

### 1.3 Der abgeschnittene Satz (A10), gemessen

`.gg-bandzeile .was`, Ladezustand: **1772 px in 731 px** (1350) ·
1588 in 731 (1600) · 1092 in 731 (1884) · 850 in 731 (1970).
Der Auftrag nennt 1810 px für 1970 — das ist ein anderer Spielstand, aber
dasselbe Verhältnis: mehr als die Hälfte des Satzes fehlt.

---

*(Fortsetzung wird während der Arbeit geschrieben.)*
