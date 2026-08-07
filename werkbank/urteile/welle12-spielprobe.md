# Urteil Welle 12 — DIE SPIELPROBE

*Frischer Kritiker, zweite Messlatte (`gauntlet/MESSLATTE.md` §2). Gespielt, nicht gelesen.
Messstand `3d9f5c2` auf Hafen 8911, Saat 1350, jede Sitzung einzeln durch
`werkbank/schuss/aufsicht/messfenster.sh`.*

**Was ich gelesen habe:** `gauntlet/MESSLATTE.md`, `spiel/LIESMICH.md`, Teile des
Quelltextes unter `spiel/` (nur so weit, wie ich die Knopfnamen zum Bedienen brauchte),
`werkbank/schuss/aufsicht/messfenster.sh`, `messstand.sh`,
`werkbank/schuss/rueckkopplung-r3/linie.mjs`.
**Was ich nicht geöffnet habe:** `werkbank/urteile/**`, `werkbank/LAUFENDER-AUFTRAG.md`,
`gauntlet/WELLE-*.md`, `werkbank/stand.json`, irgendeinen Builder-Bericht, irgendeine
git-Historie. `spiel/BEFUND-BRETTER.md`, `spiel/BEFUND-ENDE.md` und
`spiel/BEFUND-WIRTSCHAFT.md` habe ich **bewusst nicht** geöffnet, obwohl sie unter `spiel/`
liegen — es sind Befunde, kein Quelltext.

---

## 0 · In Arbeit

Dieses Papier wird **während** der Prüfung geschrieben, nicht danach. Was hier steht, ist
gemessen; was fehlt, ist noch nicht gespielt.

| Sitzung | Stand |
|---|---|
| Gerät gebaut, Rauchprobe 1350 (3 min, 150 Klicks) | fertig |
| Wiederkehr-Probe (Neuladen) | fertig |
| 1350 · 20 Minuten, erste Hand (verhungert) | fertig |
| 1350 · 20 Minuten, zweite Hand | offen |
| 1600 · 20 Minuten | offen |
| 1884 · 20 Minuten | offen |
| 1970 · 20 Minuten | offen |

---

## 1 · Wie ich gespielt habe

**Nicht** `el.click()`. Jeder einzelne Zug ist `mouse.move` auf die Mitte der wirklichen
Knopffläche, `mouse.down`, 65 ms halten, `mouse.up` — und vorher wird mit
`document.elementFromPoint` geprüft, dass unter dem Zeiger auch wirklich dieser Knopf liegt
und nicht ein Brett darüber. Was nicht unter dem Zeiger lag, gilt als **nicht gegriffen** und
steht so im Protokoll (`nicht-zu-greifen`).

Fenster **1600×900** — ein gewöhnlicher Notebook-Schirm, nicht die Entwurfsleinwand
(2752×1536) und nicht die 1920×1000 der Messhand. Zusätzlich ein Blick bei 1366×768.

Gerät: `werkbank/schuss/spiel-w12/hand2.mjs`, Protokolle als JSONL unter
`werkbank/schuss/spiel-w12/protokoll/`, Bildschirmfotos unter `…/schuesse/`.

*(Die Zählungen und die vier Menschenfragen folgen, sobald die Sitzungen gelaufen sind.)*

---

## 6 · Kann man eine Partie unterbrechen und fortsetzen?

**Nein. Ein Neuladen löscht die Partie ohne Warnung.**

Gemessen (`werkbank/schuss/spiel-w12/wiederkehr.mjs`, Epoche 1, Saat 1350): zwölf Wochen
gespielt, dann dieselbe URL neu geladen.

| | Jahr/Woche | Kasse | Fässer | Chronik | Buch |
|---|---|---|---|---|---|
| Anfang | 1350/1 | 112 | 4 | 4 | 1 |
| nach zwölf Wochen | 1350/13 | 60 | 12 | 8 | 42 |
| **nach dem Neuladen** | **1350/1** | **112** | **4** | **4** | **1** |

`localStorage` ist leer, `sessionStorage` ist leer, `document.cookie` ist leer. Es gibt
keinen Speicherstand, keine Wiederaufnahme, keine Rückfrage vor dem Verlassen und keinen
Hinweis darauf, dass es keinen gibt. Wer nach vierzig Minuten aus Versehen F5 drückt,
fängt bei 112 Pfennig wieder an.

Das trifft die zweite Latte unmittelbar: **eine Partie, die keine Unterbrechung überlebt,
kann nicht länger dauern als eine Sitzung.** Die Latte verlangt zwanzig Minuten je Epoche;
das Spiel ist auf genau eine ununterbrochene Sitzung gebaut.
