# Welle 16, Stück 2 · DIE ZWEITE TÜR — Baubericht (laufend geschrieben)

*Builder: DIE ZWEITE TÜR, Welle 16. Start 12. August 2026. Fortsetzung eines
verlorengegangenen ersten Anlaufs — der hat keine Zeile am Spiel geändert.*

## Vorgänger-Übernahme

- `werkbank/schuss/welle16-tuer/hand-durchsuch.mjs` geprüft: eigens für diese
  Welle gebaut, keine Zeile von `welle15-griff/hand-griff.mjs` oder
  `spiel-w12/hand3.mjs` übernommen (beide gelesen, im Kopfkommentar
  vermerkt). Wählt ausschließlich aus `BRAUHAUS.zuege()` — kein Zugname ist
  hart kodiert. Wechselt wochenweise zwischen freien Knöpfen (deckt die
  offene Reiterroute DER STADT ab, ohne sie zu bevorzugen — genau die Route,
  die Welle 15 bewusst offengelassen hat) und bepreisten Knöpfen
  (günstigstes zuerst, gesäter Mischer je Lauf). Wirkt methodisch sauber und
  regelkonform — **wird übernommen statt neu gebaut.**
- `protokoll/` war leer (kein `.jsonl`, kein `-ergebnis.json`) — der
  Vorgänger ist vor dem ersten Lauf gestorben, nicht mitten in einem.

## Messstand

Port **8943** (8941 war schon von einem zweiten Builder belegt —
`welle16-der-kaeufer-bau.md` zeigt `346c2fe` dort). `npx http-server -p 8943
-s .`, `.messstand-marke` = `346c2fe` = HEAD beim Start, unverändert.

## Prozessnotiz

Habe zuerst versehentlich einen Refactor in `preis.js` geschrieben (reines
Umbauen von `festlegungWartet()`, verhaltensgleich, keine neue Zeile Wirkung)
**bevor** die Vorher-Messung lief — Verstoß gegen „miss zuerst, ändere
danach". Sofort mit `git checkout -- spiel/stuecke/preis.js` zurückgesetzt,
`git diff --stat` bestätigt leer. Ab hier: erst messen, dann bauen.

## Fortschritt

**Vorher-Messung, Lauf 1 (SAAT=4001), erster Versuch:** mit `MAXMIN=20`
(Vorgabe der Hand) hätte der Lauf bei ca. 9,7 s/Woche und 150 Wochen (5
Braujahre) das Wanduhrlimit gerissen (~24,3 min > 20 min) — abgebrochen bei
Woche 23, sauber gekillt (`kill -TERM`, `fuser` bestätigt danach frei),
Teildatei gelöscht, neu gestartet mit `MAXMIN=40`.

**Messstand-Konkurrenz:** DER KÄUFER (Hafen 8942) hält `werkbank/.messsperre`
mit `hand.mjs 1 e1-nachher-tune1 220 12` — mein Lauf wartet ordnungsgemäß in
der `flock`-Warteschlange (`fuser -v` zeigt beide Prozessgruppen). Kein
Parallellauf, wie vorgeschrieben.

**Vorher-Messung, Lauf 1 (SAAT=4001, MAXMIN=40) — fertig:** 152 echte
Wochen, 6 Braujahre erzählt (1970–1975/16), Abbruch `maxWochen-erreicht`
(sauber, kein Wanduhrlimit), 0 Seitenfehler. **Konzernvertrag: NICHT
genommen.** Prüfsumme `4e931e04`. Deckt sich mit Welle 15s eigenem Lauf 1
(Saat 4001 → „nein").

**STÖRUNG, gemeldet von der Aufsicht:** `vorher-4002` lief verwaist — der
`messfenster.sh`-Wrapper starb (vermutlich beim Pausieren der Sitzung
zwischen zwei Zügen), der `node`-Prozess überlebte elternlos (Parent PID 1)
und gab dabei die Sperre frei, ohne dass ich es sah. DER KÄUFER hat die freie
Sperre danach ordnungsgemäß genommen — zwei Messungen liefen nebeneinander.
Die Aufsicht hat den Waisen gekillt und das Teilprotokoll geräumt.
**`vorher-4001` bleibt gültig** (lief sauber und allein, vor der Störung
abgeschlossen). `vorher-4002` wird neu gefahren.

Ab jetzt: (a) vor jedem Start `ps -eo cmd | grep -E "[l]inie|[h]and.*mjs|
[k]ontrakte"` — eine freie Sperre ist kein Beweis für eine freie Maschine;
(b) ein Lauf zählt erst, wenn seine `*-ergebnis.json` vorliegt, nicht schon
bei einer wachsenden `.jsonl`; (c) lange Läufe über den nativen
`run_in_background`-Weg starten statt über `nohup … & disown` im
Skriptkörper, damit die Sitzung ihn korrekt weiterverfolgt.
