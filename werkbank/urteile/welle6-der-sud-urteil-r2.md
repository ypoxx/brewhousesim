# DER SUD — blindes Urteil, zweite Runde (Nacharbeit)

**Kritiker:** blind. Gesehen wurde ausschliesslich das laufende Spiel und der
Quelltext. **Nicht geoeffnet:** `welle6-der-sud-nacharbeit.md`,
`welle6-der-sud-urteil.md`, keine git-Historie des Builders.

**Messstand, eingefroren:** `http://127.0.0.1:8901/spiel/?epoche=<1..4>&saat=1350`
Marke geprueft: `curl -s http://127.0.0.1:8901/.messstand-marke` → `517ca3f`
(vor Beginn des Laufs, 5. August 2026, ~00:30 UTC).

**Messwerte** unter `werkbank/schuss/sud-blind-r2/`.

*Diese Datei wird laufend fortgeschrieben, nicht erst am Ende.*

---

## Stand der Arbeit

| Frage | Stand |
|---|---|
| 1 — DIE KLEMME | offen |
| 2 — Entscheidung ueber das Bier je Epoche | offen |
| 3 — DAS SIEGEL | offen |
| 4 — LATTE 4 (Lesbarkeit, 1366x768) | **gemessen — REISST** |
| 5 — LATTE 2 (rho, 4 Epochen x 3 Laeufe x 3 Schnitte) | laeuft |
| 6 — Sperrliste | offen |
| 7 — Kann man es spielen? | offen |

**Messgeraet, selbst gebaut:** `werkbank/schuss/sud-blind-r2/sudlage.mjs`.
Liest je Woche das Sudbrett (Klasse `stadt-zugeklappt`, `clip-path`,
Maustreffer), jeden seiner Knoepfe (`disabled`, `data-soll-aus`,
`data-verdeckt`, `data-aus-grund`, Maustreffer) und **alle**
`button[data-zug^="sud:"][data-preis]` am ganzen Schirm. Klickapparat wortgleich
aus `rueckkopplung-r3/linie.mjs` (BEHARR=6, RUHE), gemessen bei **1366x768**.
Alle Laeufe einzeln durchs Messfenster, Reihenfolge in
`werkbank/schuss/sud-blind-r2/satz.sh`.

**Offengelegt:** ein 25-Wochen-Probelauf des eigenen Geraets lief um 00:4x UTC
**ohne** Messfenster, waehrend die Aufsicht mass. Er dauerte ~40 s. Keine Zahl
dieses Urteils stammt daraus; er ist geloescht. Wenn die Aufsicht in ihrem
1350/1970-Satz einen Ausreisser sieht, kommt er moeglicherweise daher.

---

## 4 — LATTE 4: LESBARKEIT bei 1366x768

**Gesamtstand des Spiels**, mit `werkbank/schuss/aufsicht/lesbarkeit.mjs`,
Vorgabe (Rollleiste **gezeichnet**), Hafen 8901, Stand `517ca3f`:

| | E1 | E2 | E3 | E4 | Summe |
|---|---|---|---|---|---|
| abgeschnittene Kaesten | 25 | 24 | 25 | 20 | **94** |
| Textknoten < 12 px | 279 | 283 | 280 | 286 | **1128** |
| aktive Knoepfe < 24 px | 0/82 | 0/83 | 0/87 | 0/82 | **0 von 334** |

Ziffer fuer Ziffer die Zahlen, die die Aufsicht im MESSLATTE-Nachtrag nennt
(94 / 1128 / 0). Das Geraet ist also am selben Stand und liefert dasselbe.

**Aufgeschluesselt nach Stueck** — eigenes Geraet
`werkbank/schuss/sud-blind-r2/lesbar-je-stueck.mjs`, Zuordnung ueber
`data-stueck` am Fach (dasselbe Attribut, das `stadt.js:481` liest), Rohdaten
`werkbank/schuss/sud-blind-r2/lesbar-1366.json`:

| Stueck | Ueberlaeufe | Text < 12 px | davon < 10 px | Knoepfe < 24 px | aktive Knoepfe | kleinste Schrift |
|---|---|---|---|---|---|---|
| stadt | 53 | 191 | 175 | 0 | 88 | 5,5 px |
| **sud** | **28** | **356** | **328** | **0** | 16 | **6,5 px** |
| gegner | 4 | 172 | 167 | 0 | 49 | 6,5 px |
| name | 6 | 149 | 141 | 0 | 34 | 6,5 px |
| erbe | 1 | 164 | 160 | 0 | 32 | 6,9 px |
| preis | 0 | 48 | 48 | 0 | 8 | 6,5 px |
| kern | 0 | 36 | 32 | 0 | 12 | 9,4 px |
| **fuhre** | **2** | **0** | **0** | **0** | 87 | — |
| klang | 0 | 4 | 0 | 0 | 4 | 10,9 px |
| (ohne) | 0 | 8 | 0 | 0 | 0 | 11,9 px |
| **Summe** | **94** | **1128** | | **0** | **330** | |

**DER SUD traegt 356 von 1128 Textknoten unter 12 px (31,6 %) und 28 von 94
abgeschnittenen Kaesten (29,8 %) — die groesste Schriftlast aller neun
Stuecke.** Seine kleinste Schrift ist 6,5 px, also **knapp die Haelfte** der
Latte. DIE FUHRE steht im selben Bild bei **0**; es ist also gemacht worden und
es ist machbar.

**Wo es sitzt**, aus den Belegen (gleiche Klassen in allen vier Epochen):
`.sud-kartensatz` — der Erklaersatz unter jeder Verfahrenskarte, in **jeder**
Epoche 4 bis 6 Stueck abgeschnitten; dazu `.sud-zverfahren` (die Zeile
„Grut vom Grutamt · Wasser aus dem Stadtbach" auf dem Kesselzettel) und in
1884 `.sud-zettel` selbst. Das sind genau die Saetze, aus denen der Spieler
lernen soll, was eine Karte tut.

**Latte 4 an diesem Stueck: FAELLT DURCH.** Nicht knapp: 356 Knoten, davon 328
unter 10 px, kleinste 6,5 px. Die Knopfflaeche ist dagegen sauber — 0 von 16.

### Die Ursache, benannt

`stil/grund.css` sagt es selbst und misst es vor (Zeile 20–58): der Weg fuer
ein Stueck ist **`font-size: max(12px, calc(var(--s) * N))`** je Schriftregel;
der zentrale Boden von `--s` steht mit Messbegruendung auf **null**, hebt also
nichts.

* **`stil/sud.css` · `stil/sud-zusatz.css`: 41 `font-size`-Regeln, davon
  0 mit `max(12px, …)`.** Die Faktoren laufen von `var(--s) * 13` bis
  `var(--s) * 30`. Bei 1366x768 ist `--s ≈ 0,496 px` — **erst ab N = 25 wird
  eine Regel 12 px.** Genau eine der 41 (N = 30, `sud.css:57`) erreicht das.
  `sud.css:515` (N = 13) ist die gemessene 6,5 px.
* **`stil/fuhre-zusatz.css`: jede Schriftregel traegt `max(12px, …)`** — und
  DIE FUHRE steht deshalb bei 0. Derselbe Bildschirm, dasselbe `--s`.

**Das Stueck sagt in seiner eigenen Datei, dass es das nicht tut**
(`stil/sud-zusatz.css:227–232`): *„NICHT ANGEFASST sind die Schriftgroessen
dieses Stuecks … sie hier einzeln auf `max(12px, …)` zu setzen hiesse, dem
Stueck DIE LESBARKEIT ins Handwerk zu pfuschen"*. Die eigene Zahl in demselben
Absatz — „kleinste 6,5 px, 87 bis 93 Textknoten unter 12 px" — deckt sich mit
meiner Messung (356 / 4 Epochen = 89).

**Das ist eine Zustaendigkeitsfrage, die nur die Aufsicht entscheiden kann,
und ich melde sie als solche.** Was ich messe, ist der Zustand: bei 1366x768
ist ein Drittel aller zu kleinen Schrift des Spiels die von DER SUD, und sie
steht dort, wo der Spieler lesen muss, was eine Karte tut. Ob DER SUD oder DIE
LESBARKEIT sie hebt, ist keine Frage an mich; **dass sie ungehoben ist, ist
Tatsache.**

---

## 6 — SPERRLISTE (Veto, keine Latte) — Zwischenstand aus dem Quelltext

**Kein Veto gefunden.** Im einzelnen geprueft:

| Fund der Sperrliste | Befund an DER SUD |
|---|---|
| offene Braupfanne statt Destillierblase | **sauber, und zwar ausdruecklich.** `sud-daten.js:85` „Die offene Pfanne über offenem Feuer" (1350), `:228` „Die offene Pfanne unter dem Kamin" (1600), `:367` „Die Sudpfanne unter dem Kupferhelm" (1884 — ein Dunsthelm ueber einer Sudpfanne, kein Helm mit Schwanenhals), `:458` „Das Sudwerk im Schaltraum" (1970). Nirgends Blase, Helmrohr oder Kuehler. |
| Emailschilder erst ab den 1890ern | kommt in diesem Stueck nicht vor. |
| Marktanteil auf die eigene Gesamtmenge | dieses Stueck rechnet keinen Marktanteil. |
| Hektoliter erst ab 1872 | **sauber.** 42 Aufrufe von `B.welt.menge()`/`B.welt.geld()`; keine harte Einheit im Bild. „Hektoliter" steht als Wort nur in den 1970er-Texten (`:574`, `:584`). |
| Waehrung selbst geschrieben | **sauber im engen Sinn.** „Pfennig" steht viermal als Redewendung ohne Zahl („kostet keinen Pfennig"); der Pfennig ist in **allen vier** Epochen eine gueltige Einheit (Pfennig · Pfennig · Mark/Pfennig · DM/Pfennig), also kein Anachronismus. Jede *Zahl* geht durch `B.welt.geld()`. |
| Scheinpreis (ein Preis, der nie abgebucht wird) | **im Quelltext sauber**, am Schirm noch zu pruefen: alle vier Muenz-Preisschilder des Stuecks (`sud.js:1201` Achsenkarte, `:1363` Gaerraum am Brett, `:1845` Kesselzettel-Umstellung, `:1892` Kesselzettel-Gaerraum) tragen denselben Betrag, den `waehle()` (`:1007–1011`) bzw. `kaufeGaerraum()` (`:1069–1070`) wirklich abbucht. Was in **Bier** kostet, traegt bewusst `data-preis` 0 und stattdessen `data-preis-art="fass"` — das ist die richtige Seite des Verbots. |
| Gewicht (8 MB) | **nicht dieses Stueck.** Die direkt eingehaengten Dateien wiegen zusammen 1,64 MB; `sud*.js` und `sud*.css` sind davon 0,13 MB. Die 27 MB unter `bild/` gehoeren DER STADT. |

### Sachliches — nachgeprueft, nichts falsch gefunden

1350 Grutrecht und Hopfenbrief, die Deichel aus gebohrten Erlenstaemmen ·
1516/1600 das Gebot („Gerste, Hopfen, Wasser") als Kornpolitik, nicht als
Guetesiegel · 1884 Linde 1873 (Ammoniak-Kompression, Antrieb von der
Dampfmaschine) und Hansen 1883 · 1970 Saccharometer, Kieselgurfilter,
Tunnelpasteur, Prozessrechner. Alles im belegten Fenster.

### EIN WIDERSPRUCH IN DEN VORGABEN, an die Aufsicht, nicht an den Builder

`spiel/LIESMICH.md:119` fasst die Sperrliste so zusammen: *„… kein Hopfen in
1350"*. **Das steht so nicht in `design/PRUEFUNG.md`**, und dort steht sogar das
Gegenteil (§1.2 A12: *„Hopfendolde zwischen 1300 und 1420 (richtig — Hopfenbier
verdrängt Grut im 14. Jh.)"*), ebenso in der Sperrliste der MESSLATTE, die
Hopfen gar nicht nennt.

**Die ganze erste Achse von 1350 in diesem Stueck ist „Grut oder Hopfen".**
Nach `PRUEFUNG.md` — der Datei, auf die mein Auftrag mich als Sperrliste
verweist — ist das richtig und sogar der beste Griff der Epoche. Nach
`LIESMICH.md` waere es ein Veto. **Ich werte es NICHT als Veto** und melde den
Widerspruch: eine der beiden Dateien muss geaendert werden, sonst faellt der
naechste Kritiker darueber, und zwar in beide Richtungen.

### Der abgeschnittene Text ist kein Skalierungsfehler, sondern eine Regel

`stil/sud.css:95–100` — `.sud-kartensatz { -webkit-line-clamp: 3; overflow: hidden }`.
Gemessen (eigenes Geraet, Brett **aufgeschlagen**, `overflow` in beide
Richtungen `hidden`, also **nicht rollbar**):

| Epoche | beschnittene Erklaerkaesten | schlimmster Fall |
|---|---|---|
| 1350 | 6 von 14 | Röhrenrecht: **3 von 12 Zeilen** sichtbar |
| 1600 | 5 von 14 | Weizenbrief: **3 von 21 Zeilen** sichtbar (86 % verdeckt) |
| 1884 | 5 von 12 | Ohne Kühlung: 3 von 11 |
| 1970 | 7 von 12 | Kieselsol: 3 von 11 · Prozessrechner: 3 von 10 |

**Auf der Entwurfsleinwand 2752x1536 sind es dieselben Zahlen** (3 von 9 / 3
von 22 …), nur bei 16 px statt 7,9 px. Das ist also **keine Folge von `--s`**,
sondern eine gesetzte Regel, und sie trifft bei jeder Fenstergroesse zu.

**Was dabei verdeckt wird, ist genau das Entscheidende.** Bei allen acht
unwiderruflichen Karten steht der Satz „Unwiderruflich — …" **am Ende** des
Erklaertextes und liegt damit unter dem Schnitt. Ein Spieler, der nur den
Bildschirm liest, kauft in 1600 fuer 180 Gulden eine Karte, deren Begruendung
er zu 14 % sieht. Der volle Text steht am `title` des Knopfes — das ist ein
Mauszeiger-Hinweis, kein sichtbarer Text, und Latte 4 verlangt sichtbaren.

**Fairerweise dazu, und es zaehlt:** die Warnung geht dabei *nicht* ganz
verloren. Neben jeder solchen Karte steht ein eigenes Schild
„**unwiderruflich**" (`sud.js:1219`), und sobald gesiegelt ist, traegt die
Achse darueber eine Siegelzeile (`sud.js:1179`). Beide sind sichtbar — beide
aber bei 7,4 px. Die *Tatsache* kommt an, die *Begruendung* nicht.

---

## 1 — DIE KLEMME (a) am einzelnen Bildschirm

`werkbank/schuss/sud-blind-r2/reiterprobe.mjs` → `reiterprobe.json`, 1366x768,
vier Epochen, je hoechstens drei Reiterklicks, **sofort** nach dem Klick
abgelesen (0 ms, also im selben Ereignis, noch vor jedem Zeitgeber), dann bei
+120 ms, +620 ms und +2,6 s.

| Epoche | nach dem Laden | **ein** Reiterklick, bei 0 ms |
|---|---|---|
| 1350 | zu · Maus trifft **nicht** · 0/10 bedienbar · alle `brett-zugeklappt` | **auf · Maus trifft · 7/10 bedienbar** · `soll-aus=0 und aus` = **0** |
| 1600 | zu · trifft nicht · 0/10 | **auf · trifft · 7/10** · 0 |
| 1884 | zu · trifft nicht · 0/9 | **auf · trifft · 7/9** · 0 |
| 1970 | zu · trifft nicht · 0/11 | **auf · trifft · 7/11** · 0 |

**Die Klemme ist an dieser Stelle weg, und zwar sauber:**

1. **Ein Klick genuegt.** Frueher brauchte es zwei („erst der erste bringt die
   Klasse zurueck"). Jetzt ist das Brett schon **bei 0 ms** offen UND bedienbar
   — nicht erst nach dem naechsten 320-ms-Takt. Wer ein zweites Mal klickt,
   klappt bewusst zu; niemand wird mehr zum Pendeln verleitet.
2. **Kein „offen im Bild und trotzdem tot".** Im zugeklappten Zustand ist das
   Brett per `clip-path: inset(50%)` wirklich unsichtbar und
   `elementFromPoint` trifft es **nicht**. Die 7 bis 9 abgeschalteten Knoepfe
   sind also nicht verschwiegen, sondern nicht da.
3. **Die Auskunft stimmt.** Zugeklappt tragen alle Knoepfe
   `data-aus-grund="brett-zugeklappt"`; offen tragen die verbliebenen 2 bis 4
   `data-aus-grund="spiel"` — das Spiel sagt nein, und es sagt warum. Die Zahl
   „gesperrt, obwohl das Spiel es erlaubt" ist im offenen Brett **0 von 9–11**
   in allen vier Epochen (frueher bis zu 192 Ablesungen).

*(b) Ob sie ueber viele Wochen wiederkommt, misst der 400-Wochen-Lauf — steht
weiter unten, sobald er durch ist.*

---

## 2 — GIBT ES IN JEDER EPOCHE EINE ECHTE ENTSCHEIDUNG UEBER DAS BIER?

### (a) Woche 1, alle vier Epochen, am Bildschirm gezaehlt

Gezaehlt wurde, was **zugleich sichtbar, aktiv (`disabled=false`) und von der
Maus erreichbar** (`elementFromPoint`) ist. Getrennt nach **Muenze**
(`data-preis`) und **Bier** (`data-preis-art="fass"`), weil beides ein Preis
ist, aber nur eines in der Kasse steht.

| Epoche | Kasse | Brett **zu** (Vorgabestand) | Brett **auf** (ein Reiterklick) |
|---|---|---|---|
| 1350 | 112 Pf | 1 Muenze + 2 Bier | **3 Muenze** (78 · 30 · 26) + 2 Bier |
| **1600** | 640 fl | 1 Muenze + 2 Bier | **3 Muenze** (180 · 260 · 78) + 2 Bier |
| 1884 | 14.250 M | 1 Muenze + 1 Bier | **3 Muenze** (9.800 · 3.400 · 1.900) + 2 Bier |
| 1970 | 86.000 DM | 1 Muenze + 2 Bier | **4 Muenze** (42.000 · 26.000 · 74.000 · 24.000) + 2 Bier |

**1600 ist nicht mehr leer.** Es steht mit 1350 und 1884 gleichauf: zwei
unwiderrufliche Karten aus **zwei verschiedenen Fragen** (`schuettung` und
`gaerung`), die einander nicht ausschliessen, dazu der Gaerbottich. Der
`weizenbrief` (180 fl) ist die Karte, die die Luecke schliesst — die Epoche
hatte vorher zu Weizen nur den heimlichen, kostenlosen Weg.

**Auch im Vorgabestand — Brett zugeklappt, kein Reiterklick — stehen zwei
einander ausschliessende Optionen mit Preisschild nebeneinander:** die beiden
Anstich-Knoepfe auf dem Kesselzettel („Junges Fass anbrechen · +14 · 1 Fass"
gegen „Altes Fass anbrechen · +6 · 1 Fass"). Sie schliessen einander aus (die
Hefe wird einmal in der Woche gezogen), ihr Preis steht sichtbar im Wort, und
er wird in Bier wirklich abgebucht. Nach Muenze allein waere der Vorgabestand
dagegen in allen vier Epochen **eine** Karte.

Vier verschiedene Verbfolgen dahinter: 1350 wuerzen/schoepfen · 1600
schuetten/gaeren · 1884 kuehlen/anstellen · 1970 fuehren/behandeln. **Keine
Epoche traegt die Karten einer anderen** — das ist die Kostuemprobe, und sie
haelt.

*(b) Ueber 400 Wochen gezaehlt: weiter unten, sobald der Lauf durch ist.*

---

## 3 — DAS SIEGEL *(Messung laeuft — `siegel.mjs` wartet am Messfenster)*

Geprueft werden je Achse und Epoche acht Fluchtwege, alle NACH einer bezahlten,
mit „unwiderruflich" beschrifteten Festlegung:
Mausklick auf die Geschwisterkarte · `disabled`/`aria-disabled` entfernt und
dann **mit der Maus** geklickt · `el.click()` · `dispatchEvent(MouseEvent)` ·
Tastatur (`focus` + Enter + Leertaste) · Reiter zu und wieder auf, also ein
**frisch gezeichnetes** Brett · der Kesselzettel bei zugeklapptem Brett ·
`pointer-events` freigeraeumt und auf die Karte statt den Knopf geklickt.

**Nicht als Fluchtweg gewertet**, weil kein Spielzug: `Z.fest` aus der Konsole
umschreiben. **Als Geruest offengelegt**: die Kasse wird ueber `welt.nimm()`
gefuellt, um eine 118.000-DM-Karte ueberhaupt zu erreichen — gewertet wird
ausschliesslich, was *nach* dem Siegel noch geht.

*Was der Quelltext dazu sagt (nachzupruefen, nicht zu glauben):*
`sud.js:194–218`. `gesiegelt(a)` sucht die **teuerste bezahlte** Option mit
`fest`; `verdraengt(a,o)` sperrt danach **alles ausser der besiegelten selbst
und dem, was `fest` UND teurer ist**. Gerechnet wird mit dem **Listenpreis**,
nicht mit dem angerechneten (`sud.js:146–153`) — sonst waere der
Prozessrechner nach Anrechnung „billiger" als das Labor und die Ratsche liesse
sich rueckwaerts gehen. Der Riegel steht in `waehle()` **vor** der Zahlung
(`sud.js:1002`).

---

## Latte 2, dritte Spalte: Zuege, die ohne den Spieler geschehen

Aus dem Quelltext, am Schirm in den Klickprotokollen nachzusehen. DER SUD hat
drei Sorten davon, alle mit Eintrag in Chronik **und** Protokoll:

| Was | wo | wie es sich meldet |
|---|---|---|
| Ein Bottich schlaegt um / verdirbt / infiziert / kippt | `sud.js:692` `fehlsud()` | `wer: 'verfall'`, Chronikzeile, eigener Ton, hoechstens einer je Woche |
| Die Anzeige-Instanz der Epoche holt Rohstoff und Bottiche (Grutherr · Bierschau · Untersuchungsanstalt) | `sud.js:718` `anzeigePruefen()` | `wer: 'gegner'`, Chronikzeile; **kostet kein Geld**, sondern Rohstoff und Bier |
| Der Einkauf der Handelskette misst eine freigegebene Charge nach und schickt sie zurueck (1970) | `sud.js:762` `rueckPruefen()` | `wer: 'gegner'`, faellig 2–5 Wochen spaeter, Wahrscheinlichkeit haengt an der Abweichung, die der Spieler selbst durchgewinkt hat |

Der dritte ist der beste: er macht aus „freigeben oder verschneiden" erst eine
Wahl, weil die Rechnung **spaeter und ohne den Spieler** kommt. Und er zahlt
in Bier, nicht in Muenze — die Kasse bleibt unberuehrt, das Lager nicht.

---

## Was ich NICHT pruefen konnte, und warum

1. **Latte 1 (das Bild) und Latte 3 (der Ton).** Standen nicht in meinem
   Auftrag, und beide brauchen ein fremdes Auge bzw. ein fremdes Ohr, das ich
   nicht bin. Zu Latte 3 nur die Beobachtung, dass DER SUD **vierzehn**
   Tonmeldungen sauber ueber `B.ton.melde` anmeldet (`sud-zusatz.js:24–57`),
   je mit einer epochenweisen Beschreibung — ob sie klingen, hat ein Ohr zu
   sagen.
2. **Ob die Nacharbeit etwas verbessert hat.** Ich sehe nur den Stand
   `517ca3f`. Wo ich frueher gemessene Zahlen nenne, stammen sie aus
   **Kommentaren im Quelltext des Stuecks** — das ist die Selbstauskunft des
   Gemessenen und kein Beleg. Ich habe sie als *Hinweis, wo zu suchen ist*
   benutzt, nie als Befund.
3. **Das Verhalten ueber einen Epochenwechsel hinweg.** Eine Partie traegt
   3–14 Braujahre und erreicht die naechste Epoche nie; `setzeEpoche()`
   (`sud.js:2411`) leert `Z.fest` beim Wechsel. Ob das Siegel einen
   Epochenschnitt ueberlebt, ist am laufenden Spiel nicht herstellbar und
   gehoert ohnehin DAS ERBE.
4. **Das Gewicht als Gesamtbefund.** Ich habe nur die eingehaengten Dateien
   gewogen (1,64 MB), nicht den vollstaendigen Aufruf mit allem, was DIE STADT
   nachlaedt. Fuer DER SUD reicht das: seine fuenf Dateien sind 0,13 MB.
5. **Die Frage, ob DER SUD oder DIE LESBARKEIT die Schriftgroessen zu heben
   hat.** Das ist eine Zustaendigkeitsfrage der Aufsicht. Ich melde nur den
   gemessenen Zustand.

---

## Was am Quelltext auffaellt, ohne dass es eine Latte waere

**Der Rueckfall statt der Wand.** `sauge()` (`sud.js:496–499`): reicht der
Rohstoff fuer das gewaehlte Verfahren nicht, wird der Sud **nach der Vorgabe
gefuehrt** und heisst dann „Notdurft" — er scheitert nicht. Dasselbe Muster
bei der Guete (`gueteWoche()`, `sud.js:797`): sie faellt auf einen **Boden**
von 25 und nicht auf null, mit der Begruendung, ein Haus, das nichts tut,
braue schlecht und hoere nicht auf zu brauen. Das ist genau die Sorte
Entscheidung, an der ein Wirtschaftsspiel sonst kippt.

**Die Deckelung sitzt an der Pfanne, nicht am Fasshahn** (`sud.js:539–543`):
`hoechst` wandert mit dem Bottich. Wer ohne Hopfen kocht, macht sein Bier
durch einen spaeteren Hopfenbrief nicht rueckwirkend haltbar. Sachlich richtig
und mechanisch sauber.

**Vier verschiedene Nebenbedingungen am Gaerraum**, eine je Epoche
(`sud-daten.js:100 · 242 · 386 · 473`) — GRENZE (die Reihe duldet keinen, der
doppelt so viel ansetzt: hoechstens zwei Bottiche) · KOPPLUNG (die Zunftlade
nimmt keinen Bau ab, solange heimlich gestreckt wird) · BEDINGTE WIRKSAMKEIT
(zugekaufter Gaerraum traegt nur, solange es kalt ist) · LIEFERZEIT (bezahlt
bei Bestellung, gestellt nach drei Wochen). **Dieselbe Taste, viermal eine
andere Frage** — das ist die beste Antwort auf den Kostuem-Vorwurf, die ich in
diesem Stueck finde.

### Das Ergebnis: acht Siegel, 96 Fluchtversuche, **null** Rueckwege

`werkbank/schuss/sud-blind-r2/siegel.json`, 1366x768, alle vier Epochen,
0 Seitenfehler.

| Epoche · Achse | Festlegung | Preis | wirklich abgebucht | Versuche | nach unten entkommen |
|---|---|---|---|---|---|
| 1350 wuerze | Hopfenbrief | 78 Pf | **78** | 14 | **0** |
| 1350 wasser | Roehrenrecht | 30 Pf | **30** | 12 | **0** |
| 1600 schuettung | Weizenbrief | 180 fl | **180** | 18 | **0** |
| 1600 gaerung | Felsenkeller | 260 fl | **260** | 7 | **0** |
| 1884 kaelte | Kaeltemaschine | 9.800 M | **9.800** | 13 | **0** |
| 1884 hefe | Reinzuchthefe | 3.400 M | **3.400** | 7 | **0** |
| 1970 fuehrung | Betriebslabor | 42.000 DM | **42.000** | 14 | **0** |
| 1970 behandlung | Tunnelpasteur | 74.000 DM | **74.000** | 17 | **0** |

**Der wichtigste Einzelbefund: der Riegel sitzt in der Logik, nicht am
Attribut.** Bei jeder der acht Festlegungen wurde die Vorgabekarte mit
`el.disabled = false` und `removeAttribute('disabled')` freigeschaltet, ihr
`pointer-events` auf `auto` gesetzt, die Klasse `weg` von der Karte genommen —
und dann mit der **echten Maus** darauf geklickt, danach mit `el.click()`, mit
`dispatchEvent(new MouseEvent('click'))` und mit Enter und Leertaste auf der
Tastatur. **In keinem einzigen Fall hat sich das Verfahren geaendert.** Der
Grund steht in `sud.js:1002`: `waehle()` prueft `verdraengt()` als erste Zeile
und **vor** der Zahlung. Wer nur `disabled` setzt, haette hier verloren.

Ebenfalls gehalten: Reiter zu und wieder auf (ein **frisch gezeichnetes**
Brett), und der Weg ueber den Kesselzettel bei zugeklapptem Brett — der Zettel
bietet die verdraengten Optionen gar nicht erst an.

**Ein Fall braucht eine Erklaerung, und er entlastet das Stueck.** Bei
1970 `fuehrung` meldete mein Zaehler zunaechst „entkommen". Nachgesehen: das
Verfahren ging von `labor` auf `rechner` — also **hinauf**, auf die teurere,
ebenfalls unwiderrufliche Karte. Genau das ist die angeschriebene Ratsche
(„Zurück geht es nicht — nur noch weiter hinauf"). Alle fuenf Versuche, von
`labor` auf die kostenlose Vorgabe `erfahrung` zurueckzukommen, sind
**gescheitert**, und nach dem Aufstieg auf `rechner` blieb auch `labor` zu
(`sud-karte weg`). **Der Fehler lag in meinem Zaehler, nicht im Siegel.**

**DAS SIEGEL: BESTEHT.** Das ist die Latte-2-Spalte „unwiderrufliche
Festlegungen", und sie ist an diesem Stueck erfuellt — acht Stueck, zwei je
Epoche, jede bezahlt, jede beschriftet, jede haelt.


---

## 1 — DIE KLEMME (b) ueber viele Wochen · 1350

`werkbank/schuss/sud-blind-r2/lage/auf-e1.json`, 1366x768, Sudbrett
aufgeschlagen und offen gehalten, sonst nur WEITER. 0 Seitenfehler,
`BRAUHAUS.lage` durchgehend 0.

| | |
|---|---|
| Wochen bis zum Partieende | 103 (4 Braujahre — der sparsame Stil endet frueh, das ist bekannt und nicht dieses Stueck) |
| Wochen mit dem Brett **im Bild** (Klasse weg, Maus trifft) | **98** |
| davon **KLEMME** (im Bild und **kein** Knopf bedienbar) | **0** |
| Ablesungen „gesperrt, obwohl das Spiel es erlaubt" (`soll-aus=0` und `aus`) waehrend der Klemme | **0** |
| Wie oft fiel das Brett zu | 5-mal (Wochen 0, 30, 60, 90, 96) |
| Reiterklicks bis offen **und bedienbar** | **1 · 1 · 1 · 1 · 1** |

**Zum Vergleich der Zustand, den fruehere Runden beschrieben haben** (er steht
als gemessene Zahl im Quelltext des Stuecks, `sud.js:2191–2197`): *„in 20 bis
53 von je 400 Wochen stand das Sudbrett offen … und alle seine Knoepfe
abgeschaltet, bis zu 192 Ablesungen davon mit `data-soll-aus=\"0\"` … Es loeste
sich in 8 Sekunden ohne Eingabe nicht und auch nach einem Reiterklick nicht,
erst nach zweien."*

**Gemessen am laufenden Spiel ist davon nichts mehr da: 0 Klemmwochen von 98,
0 Ablesungen gegen den Willen des Spiels, und ein Klick reicht — fuenfmal von
fuenfmal.** Die uebrigen abgeschalteten Knoepfe tragen einen Grund, der
zutrifft: `spiel` 475-mal (die Kasse traegt es nicht, oder das Siegel liegt
darauf), `brett-offen` 392-mal (der Kesselzettel tritt hinter das eigene
aufgeschlagene Brett zurueck — richtig, sonst verdeckte sich das Stueck
selbst), `brett-zugeklappt` 50-mal (die fuenf Wochen, in denen das Brett
wirklich zu war, 10 Knoepfe je Woche), `verdeckt` 4-mal.


---

## Die Auflagen — Stand vor Abschluss der Wochenlaeufe

**AUFLAGE 1 (Latte 4, hart).** Jede Schriftregel des Stuecks bekommt einen
Boden: `font-size: max(12px, calc(var(--s) * N))`.
*Zahl:* **356 Textknoten unter 12 px** (davon 328 unter 10 px), kleinste
**6,5 px**, gemessen bei 1366x768 mit gezeichneter Rollleiste — 31,6 % der
Gesamtlast des Spiels, mehr als jedes andere Stueck.
*Stelle:* `spiel/stil/sud.css` (35 `font-size`-Regeln) und
`spiel/stil/sud-zusatz.css` (6). **0 von 41 tragen heute einen Boden.**
`spiel/stil/fuhre-zusatz.css` zeigt dieselbe Zeile in gemachter Form und steht
bei 0.
*Anmerkung an die Aufsicht:* das Stueck begruendet in
`stil/sud-zusatz.css:227–232`, warum es das absichtlich **nicht** tut (DIE
LESBARKEIT soll es tun). Diese Zustaendigkeit gehoert entschieden, ehe die
Auflage vergeben wird.

**AUFLAGE 2 (Latte 4, und sie kostet nichts).** `.sud-kartensatz` darf den
Erklaersatz nicht mehr auf drei Zeilen kappen, ohne einen zweiten Weg zum
vollen Text anzubieten.
*Zahl:* **23 von 52 Erklaerkaesten** ueber vier Epochen beschnitten,
schlimmster Fall **3 von 21 Zeilen sichtbar** (Weizenbrief, 1600 — 86 %
verdeckt). `overflow` ist in **beiden** Richtungen `hidden`, es rollt also
nichts. Bei allen acht unwiderruflichen Karten liegt der Satz
„Unwiderruflich — …" **unter** dem Schnitt.
*Stelle:* `spiel/stil/sud.css:95–100` (`-webkit-line-clamp: 3`).
*Wichtig:* das ist **kein** `--s`-Problem — auf der Entwurfsleinwand
2752x1536 sind es dieselben 3 von 21 Zeilen, nur bei 16 px. Es wird also von
keiner Lesbarkeitsrunde nebenbei mitgeheilt.
