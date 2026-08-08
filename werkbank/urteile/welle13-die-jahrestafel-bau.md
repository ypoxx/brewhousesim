# Welle 13 · Stück 2 — DIE JAHRESTAFEL. Baubericht.

*Laufend geschrieben, während gebaut wird. Besitzstand: `spiel/stuecke/preis*.js` ·
`spiel/stil/preis*.css`. Kein `git add`, kein Commit, kein fremdes DOM geschrieben.*

---

## 0 · Was vor dem ersten Handgriff gemessen wurde

Gerät: `werkbank/schuss/tafel-w13/blick.mjs` — spielt 1350 (Saat 1350, Fenster
1600×900) **ohne einen einzigen Reiter anzufassen**; erlaubt sind nur „Wie vorige
Woche"/„Nach Durst füllen", „FUHRE ABSCHICKEN", „WEITER" und, wenn die Tafel
wirklich vor dem Spieler liegt, ihr eigener Knopf „Das Jahr beginnen".
Protokoll: `werkbank/schuss/tafel-w13/protokoll/vorher-e1.json`.

| Stand VORHER (1350) | |
|---|---|
| abgelesene Zustände | 308 |
| Braujahre erreicht | 4 (1350–1353, dann endete das Spiel) |
| **Knopf `preis:tafel` log** (Aufschrift „schließen", keine Tafel da) | **33 von 308** |
| davon: alle 30 Wochen des Ladejahres 1350 | 30 |
| dazu je Jahreswechsel 1351/1, 1352/1, 1353/1 | 3 |
| Tafel lag von selbst da | 3 (1351, 1352, 1353 — je in Woche 2) |
| **Ladejahr 1350: Tafel lag von selbst da** | **0 von 1** |
| `BRAUHAUS.lage` · Seitenfehler | 0 · 0 |

Das reproduziert den Befund des Kritikers und benennt die Ursache genauer, als
sie bisher stand.

### Warum der Knopf log — die Kette, Zeile für Zeile

1. `michaeli()` setzt `Z.offen = true`. Der erste Bildaufbau zeichnet die Tafel.
2. DIE STADT sieht in ihrem 240-ms-Takt nach (`stadt.js` `nachsehen()`), findet
   ein fremdes Brett, das **beim Laden schon dalag** (`jetzt - startZeit <
   LADEZEIT = 2500`) und klappt es weg: `stadt-zugeklappt`, `clip-path:
   inset(50%)`. Gemessen: in allen 30 Wochen des Jahres 1350 trug `.pr-tafel`
   diese Klasse.
3. `tafelSichtbar()` fragte `document.querySelector('.pr-tafel')` — **im selben
   Zeichenweg, nachdem `B.leere(fach)` genau dieses Element gerade entfernt
   hatte.** Die Abfrage konnte also gar nichts finden und gab immer „nicht
   weggeklappt" zurück. Der Knopf schrieb „schließen", die Tafel wurde neu
   gezeichnet, DIE STADT klappte sie 240 ms später wieder weg. Stabiler
   Endzustand: Knopf lügt, Tafel unsichtbar.
4. Die Notbremse dagegen war `seheNachRahmen()` — eine **Wanduhrfrist von
   420 ms** (`preis.js:2737`), genau die Stelle, die `spiel/LIESMICH.md` als
   Verursacher der Bistabilität vom 7. August benennt. Sie hat nie gegriffen,
   weil ihre erste Zeile `clearTimeout(rahmenBlick)` ist: jeder neue Bildaufbau
   setzt die Frist zurück, und das Spiel zeichnet häufiger als alle 420 ms neu.
   **Welle 12 hat das Rennen abgestellt, die Lüge blieb — und der Wecker, der
   sie hätte finden sollen, ist nie geklingelt.**

---

*(Fortsetzung während des Baus.)*
