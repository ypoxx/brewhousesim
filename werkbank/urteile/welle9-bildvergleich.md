# Welle 9 — Bildvergleich, blind

*Erste Latte. Ein fremdes Auge hält den gebauten Bildschirm gegen die vier Zielblätter
und beantwortet je Epoche eine einzige Frage: **Gewinnt das Zielbild noch?***

---

## 1 — Wie gemessen wurde

**Messstand.** `curl -s http://127.0.0.1:8907/.messstand-marke` → `37f4b44`, geprüft vor der
ersten und nach der letzten Aufnahme. Jeder Browser lief durch
`werkbank/schuss/aufsicht/messfenster.sh` mit `HAFEN=8907 MESSFENSTER_WARTE=7200`; das Fenster
war beim ersten Aufruf 557 s belegt, danach 108 s und 120 s. Nie zwei Browser nebeneinander.

**Fläche.** 2752×1536, dieselbe Fläche wie die Zielblätter. Kein Skalieren, kein Zuschneiden.

**Was gefahren wurde.** `werkbank/schuss/bild-w9/aufnehmen.mjs` (eigenes Gerät, nicht geerbt),
je Epoche `?epoche=N&saat=1350`:

* **Zustand A** — Aufnahme 1,8 s nach `networkidle`, ohne einen einzigen Klick.
* **Zustand B** — danach 34 Runden: je Runde `stadt:bauhof` aufklappen, alle freigegebenen
  `stadt:bau:*` der Reihe nach klicken (max. 5), Bauhof zuklappen, `weiter` klicken.
  Aufnahme nach 0,9 s Ruhe.
* **Zustand C** — Zustand B nach einem `Escape`.

**Klickprotokolle** liegen als `werkbank/schuss/bild-w9/bilder/e*-protokoll.txt` daneben.
Zusammengefasst:

| Epoche | Klicks | davon Bauklicks | gebaut | Endstand | `BRAUHAUS.lage` | Seitenfehler |
|---|---|---|---|---|---|---|
| 1350 | 73 | 5 | Grutkammer · Gärbottiche · Ochsenstall · Gewölbekeller · Küferei | 1351/5, Kasse 36 Pf | 0 | keine |
| 1600 | 74 | 6 | Gärbottiche · Waschhaus · Kontor · Rossmühle · Hopfenlager · Pferdestall | 1601/5, Kasse 85 fl | 0 | keine |
| 1884 | 73 | 5 | Kontor · Hopfenlager · Pferdestall · Mälzereiturm · Flaschenhalle | 1885/5, Kasse 3.214 M | 0 | keine |
| 1970 | 72 | 4 | Fahrzeugwaage · Mälzereiturm · Verwaltungsbau · Neues Sudhaus | 1971/5, Kasse 52.661 DM | 0 | keine |

**md5 jeder Aufnahme** (`bilder/`):

```
0e3b300a24645e057009577a1fdbe6bb  e1-a-laden.png
dbf8ed95778fb036276d1505bf59953e  e1-b-gespielt.png
dbf8ed95778fb036276d1505bf59953e  e1-c-gespielt-esc.png
32197bc02d43ba0241735faa41d11d56  e2-a-laden.png
f7c1cc0c2f140285b477ba29d99d5c67  e2-b-gespielt.png
f7c1cc0c2f140285b477ba29d99d5c67  e2-c-gespielt-esc.png
814c93059eb3b6f8cd5acbea85e7353e  e3-a-laden.png
392e87bc50f151f85f4558af4c9b00f2  e3-b-gespielt.png
8cfb96ee26ed8b4c8d12a0f69e61329f  e3-c-gespielt-esc.png
9c3872d6070918fa9001c3d1c0d4b1c4  e4-a-laden.png
d8af8997b1a7f0c944ef4e41b2ab4af7  e4-b-gespielt.png
734c47ce9b2ce54c0544262f658fee15  e4-c-gespielt-esc.png
```

In 1350 und 1600 sind B und C **byteweise identisch** — `Escape` ändert dort nichts; es gab
keine offene Tafel zum Schließen. In 1884 und 1970 unterscheiden sie sich.

**Was ich gelesen habe:** `gauntlet/MESSLATTE.md`, `zielbild/README.md`, `zielbild/prompts/*`,
`spiel/LIESMICH.md`, `spiel/index.html`, Teile von `stuecke/stadt.js` (nur um den Bauhof
bedienen zu können), `werkbank/schuss/aufsicht/messfenster.sh`,
`werkbank/schuss/aufsicht/deckung-je-stueck.mjs` und `werkbank/schuss/bild-w8/deckung.mjs`
— beide nur als Messgerät, und **beide habe ich verworfen**, siehe §2.

**Was ich nicht gelesen habe:** nichts unter `werkbank/urteile/`, nicht
`werkbank/LAUFENDER-AUFTRAG.md`, keine `gauntlet/WELLE-*.md` (auch nicht
`gauntlet/EPOCHENBOGEN.md`, das nicht auf meiner Leseliste stand), nichts unter
`werkbank/schuss/stadt-w9/`, keine `berichte/`- oder `bogen/`-Ordner, keine `BEFUND-*.md`
in `spiel/`, kein `stand.json`, kein `git log`. **Ich bin nicht befangen.**

---

*(Befund und Urteil folgen, laufend geschrieben.)*
