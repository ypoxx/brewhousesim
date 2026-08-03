# DER SUD — Urteil des blinden Kritikers, Welle 4

**Stand: IN ARBEIT.** Diese Datei wird laufend fortgeschrieben. Was hier steht,
ist gemessen; was noch fehlt, ist als OFFEN markiert.

## Messbedingungen

| | |
|---|---|
| Gemessener Commit | **2953242** (`git archive` nach `/tmp/sudstand/2953242`) |
| Hafen | 127.0.0.1:**8911** (eigener Messstand, nicht 8899, nicht 8900) |
| Saat | 1350 |
| Schirm | 1920 × 1080 |
| Werkzeug | Playwright/Chromium, echte Mausklicks (`page.mouse.click`) |
| Belege | `werkbank/schuss/sud-blind4/` |

Warum ein eigener Hafen: an `preis*.js` und `ton.js` schrieben waehrend der
Messung zwei andere Builder, und 8900 trug bereits den eingefrorenen Stand
`da7d690` eines anderen Kritikers. Gepruet: zwischen `2953242` und dem
spaeteren HEAD `6391f3b` aenderten sich nur `spiel/kern/ton.js` und zwei
`ton/klang/*.mp3` — **keine Datei des SUD**. Die Zahlen gelten also fuer den
SUD-Stand, der auch jetzt im Baum liegt.

---

## 5. IST ES HEIL? — gemessen, alle vier Epochen

Beleg: `werkbank/schuss/sud-blind4/erkundung.mjs`

| Epoche | Jahr | `BRAUHAUS.lage.length` | Konsolenfehler | Knoepfe gesamt | aktiv | aktiv **und** treffbar |
|---|---|---|---|---|---|---|
| 1 | 1350 | **0** | **0** | 102 | 82 | 46 |
| 2 | 1600 | **0** | **0** | 112 | 83 | 48 |
| 3 | 1884 | **0** | **0** | 116 | 87 | 47 |
| 4 | 1970 | **0** | **0** | 107 | 82 | 44 |

Alle vier Epochen laden sauber. Kein `pageerror`, kein `console.error`.

---

## Vorgabestand Woche 1 — was ohne einen einzigen Klick dasteht

Der Kesselzettel (`.sud-zettel`) haengt am Sudhaus und traegt vier Knoepfe.
Alle vier sind in Woche 1 in allen vier Epochen **aktiv und von
`elementFromPoint` getroffen** (einzeln geprueft, nicht der Mittelpunkt des
Bretts):

| Epoche | `sud:zettel-wechsel-frei` | `sud:zettel-wechsel-kauf` | Preis |
|---|---|---|---|
| 1 (1350) | Hopfen im Sack, heimlich — *traegt Starkbier* | Offen gehopft, mit Hopfenbrief — *traegt Starkbier* | **78 Pf** |
| 2 (1600) | Mit Weizen gestreckt — *traegt Maerzenbier* | Kellergaerung im Felsenkeller — *traegt Maerzenbier* | **260 fl** |
| 3 (1884) | Ohne Kuehlung durchgaeren — *nur Schankbier* | Reinzuchthefe nach Hansen — *traegt Exportbier* | **3.400 M** |
| 4 (1970) | Schoenen mit Kieselsol — *nur Pilsner* | Kieselgurfilter — *traegt Exportbier* | **26.000 DM** |

Das Brett `DAS SUDHAUS` liegt im Vorgabestand zugeklappt (`Z.brettZu = true`,
`spiel/stuecke/sud.js:93`); seine Optionsknoepfe (`sud:wuerze:*` usw.) sind
dann abgeschaltet und verdeckt. Der Zettel ist also **das ganze Stueck im
Vorgabestand** — was nicht auf ihm steht, ist ohne Reiterklick nicht zu haben.

**Latte 2 (a), Woche 1: erfuellt.** Zwei Entscheidungen mit Preisschild
nebeneinander (0 und der Kaufpreis), beide erreichbar und aktiv.

**Latte 2 (d), 1350 — noch OFFEN, aber die Zahl steht:** Startkasse 112 Pf,
`sud:zettel-wechsel-kauf` = Hopfenbrief = **78 Pf = 69,6 % der Startkasse**,
und der Knopf ist in Woche 1 aktiv. Was danach noch geht, wird gemessen.

---

## Bedienbarkeit der Bretter — erste Messung

Jeder der acht `stadt:reiter:*` wurde einzeln aufgeschlagen und danach jeder
Knopf im Bild mit `elementFromPoint` geprueft
(`werkbank/schuss/sud-blind4/` Tastlauf, Epoche 1):

* `stadt:reiter:sud-sud-brett` schlaegt DAS SUDHAUS auf. Danach sind
  `sud:wuerze:sack`, `sud:wuerze:brief`, `sud:gaerraum` aktiv **und getroffen**
  — das Brett ist bedienbar.
* **Solange DAS SUDHAUS offen ist, ist der Kesselzettel abgeschaltet**
  (`sud:zettel-*` alle `disabled`). Umgekehrt: solange das Brett zu ist, sind
  die Brettknoepfe abgeschaltet. Die Bierentscheidung steht also nie doppelt.
* `fuhre:fuellen` / `fuhre:abschicken` haengen an
  `stadt:reiter:fuhre-fu-brett-fu-wagen`, **nicht** am Haeuserbrett.
  `fuhre:kauf:rohstoff` haengt an `stadt:reiter:fuhre-fu-brett-fu-schiefer-fu-tafel`.
  Ein sorgfaeltiger Spieler klappt diese Bretter also jede Woche auf und zu.

---

## OFFEN — wird noch gemessen

1. Vierzehn Jahre je Epoche, sorgfaeltig gespielt: wie oft steht die
   Bierentscheidung bedienbar da, was kostet sie, was aendert sich messbar.
2. Haelt das Siegel? Kauf mit der Maus, Wochen weiterspielen, dann **jeder**
   Rueckweg — Brettknopf, Zettelknopf, Zugschluessel-Versand, Notsud,
   Epochenwechsel.
3. Traegt die Partie ein eigenes Bier? Dieselbe Epoche zweimal verschieden.
4. Latte 2 (d) vollstaendig: Barschaft nach der Festlegung.
