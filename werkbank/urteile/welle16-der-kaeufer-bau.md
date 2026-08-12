# Welle 16, Stück 1 · DER KÄUFER — Baubericht (laufend geschrieben)

*Builder: DER KÄUFER, Welle 16. Start 12. August 2026.*

## Vorgänger-Übernahme

- `werkbank/schuss/welle16-kaeufer/hand.mjs` geprüft: neu für diese Welle
  geschrieben (generische [data-zug]-Erkundung, keine hartkodierten
  Zugnamen), strukturell wie die abgenommene Hand aus Welle 15
  (`welle15-pfennig/hand-such.mjs`), aber eigenständig geschrieben, nicht
  kopiert. Wirkt brauchbar — wird übernommen statt neu gebaut.
- `protokoll/e1-vorher-1.jsonl` geprüft: nur 63 Zeilen, endet in Woche 3
  (1350, mitten in "erkunden"), kein `-ergebnis.json` geschrieben. Unvollständig
  wie angekündigt — wird NICHT verwendet, neu gemessen.

## Fortschritt

**Vorher-Messung (eigene Hand, HEAD 346c2fe, Messstand Hafen 8941, Sud 1350, `?neu=1`, 222 echte Wochen, `hand.mjs`):**

| Zahl | Wert |
|---|---|
| Deckungs-Median | **0,1863** |
| Kassenhöchststand | **126** |
| Wochen mit leerer Kasse | 36,5 % (81/222) |
| Prüfsumme | `75efa958` |
| Seitenfehler | 0 |

Deckt sich fast exakt mit der Hand-der-Welle-15-Referenz aus dem Brief
(0,186 / 126) — die eigene Messung bestätigt die Zahl, keine Abweichung, die
eine Rückmeldung an die Aufsicht nötig macht. **Die Schwelle ist vor dem
ersten Handgriff NICHT erfüllt** (0,186 ≪ 1,0 · 126 ≪ 300) → weiterbauen.

## Gebaut: LOHNBRAUEN FÜR DEN FRONHOF (R16.1)

Zweiter Erlösweg in 1350, in `spiel/stuecke/fuhre-daten.js` (Datenblock
`epochen[1].lohnbrau`) und `spiel/stuecke/fuhre.js` (Funktionen
`lohnbrauDef/lohnbrauLohn/lohnbrauVerfuegbar/lohnbraue`, Zeichnen in
`zeichneTafel`), Stil in `spiel/stil/fuhre-zusatz.css` (`.fu-lohnbrau*`).

**Was es ist:** ein Fronhof vor den Toren bringt eigenes Malz, kauft dem Haus
nicht das Bier ab, sondern die Pfanne und den Braumeister für einen Tag.
Bar auf die Hand, kein Ungeld (kein Ausschank des Hauses), kein Keller, kein
Wagen, kein Bannbrief — und damit außerhalb der einzigen Lieferkette, die
laut Befund den Engpass bildet. Kostet 1 Brautag aus **demselben**
`Z.budget`-Topf, den auch die eigene Tafel braucht (echte Abwägung, kein
Geldhahn), höchstens 2×/Woche (Fronhof holt selbst ab). Lohn zieht mit
`laufPreis()` wie jeder andere laufende Posten mit der Zeit mit.

**Wo:** eigener Absatz *innerhalb* der Anschlagtafel (`fu-tafel`) — exakt der
Reiter, den Welle 15 als auffindbar nachgewiesen hat (0-mal → alle 8
Braujahre) — kein neuer, unbekannter Ort.

`node --check` auf beiden JS-Dateien fehlerfrei; `FUHRE_DATEN.epochen[1].lohnbrau`
lädt sauber.

**Messstände:**
- Hafen 8941 — `messstand.sh HEAD 8941` (346c2fe), eingefroren, für die
  Vorher-Zahlen oben.
- Hafen 8942 — eigener, unversiegelter Arbeitsbaum-Stand (`python3 -m
  http.server 8942`), da Builder nicht committen dürfen (dieselbe Lösung wie
  Welle 15, `welle15-pfennig-bau.md`); vor jeder Messung per `curl` geprüft,
  dass er wirklich `fuhre-daten.js` mit "Lohnbrauen für den Fronhof" ausliefert.

