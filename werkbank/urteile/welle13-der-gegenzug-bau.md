# Welle 13 · Stück 4 — DER GEGENZUG · Baubericht

*Laufend geschrieben. Wer hier liest, bevor die Schlusszeile steht, liest einen
halben Bericht — das ist Absicht: Agenten sterben mitten im Lauf.*

Dateien, die mir gehören und die ich angefasst habe:
`spiel/stuecke/gegner.js` · `spiel/stil/gegner-zusatz.css`.
Messgeräte, die ich gebaut habe: `werkbank/schuss/gegenzug-w13/**`.
**Nichts unter `spiel/kern/`, nichts von fremden Stücken, kein fremdes DOM.**

---

## 0 · Was ich NICHT angefasst habe

§4b des Urteils ist bestanden, und zwar ausdrücklich: *„Von allem, was ich in
vier Sitzungen geprüft habe, ist das der Teil, der am wenigsten Arbeit
braucht."* Deshalb ist **am Verhalten des Gegners keine Zeile geändert**:

* keine Zugliste, kein Gewicht, keine Frist, kein Preis einer Bindung,
* kein Text auf der Karte, keine Ankündigung (*„baut W30 · pachtet W36"*),
  kein eigenes Pech, kein Reicher- und Ärmerwerden,
* kein `merkeZug`, kein `waehle`, kein `fuehreAus`, kein `zugUnglueck`,
* **und vor allem kein `meldeZug()`.**

Der letzte Punkt ist der wichtigste und der am leichtesten zu übersehende.
`kern/welt.js:505` gibt der Art `umkaempft` den höchsten Rang (3); die Meldung
dieses Stücks schlägt damit jede andere und ist in fast jeder Woche **der
Nenner der zweiten Messlatte**. Wer dort einen billigeren Zug einträgt,
verschiebt ρ, ohne dass sich am Spiel etwas geändert hätte. Gemeldet wird
weiterhin Wort für Wort dasselbe: der billigste Zug, der den Streit
**beendet** (ablösen · zuvorkommen · mitbieten) — nicht der billigste Zug, den
es gibt. Genau so stand es schon vor dieser Welle im Zeiger der Kennzahl:
*„Das ist der billigste Zug, um den gegenüber jemand mitbietet — nicht der
billigste Posten auf dem Brett."*

---

## 1 · R16 — der Zähler wandert nicht mitten in der Partie

### Der Befund, nachgemessen

`werkbank/schuss/spiel-w12/gegnerblick.mjs` (spielt 50 Wochen, ohne einen
Reiter anzufassen), Epoche 1, Saat 1350, Fenster 1600×900 — **vorher**:

| Wochen | Aufschrift des Reiters |
|---|---|
| 1350/1 – 1350/30 (30 Wochen) | `OHNE DICH GESCHEHEN 1 Zug` … `OHNE DICH GESCHEHEN 19 Züge` |
| 1351/1 – 1351/20 (20 Wochen) | `OHNE DICH GESCHEHEN` — **20 × ohne Zahl** |

`wochenMitZahlAmReiter: 30 von 50`. Der Kritiker hatte recht, und zwar auf die
Woche genau.

### Die Ursache — gemessen, nicht geraten

Der Verdacht des Kritikers (*„die Zahl ist auf das aufgeklappte Brett
gewandert"*) trifft die Wirkung, nicht den Grund. Mit
`gegenzug-w13/diagnose-reiter.mjs` abgelesen, 1351/3:

```
kopfInner : "OHNE DICH GESCHEHEN\n20 Züge\ndiese Woche 1\nDas Haus gegenüber"
reiterHtml: <span class="wort" title="OHNE DICH GESCHEHEN">OHNE DICH GESCHEHEN</span>
            <span class="zahl" title="20 Züge">20 Züge</span>
reiterText: "OHNE DICH GESCHEHEN"
```

**Die Zahl stand die ganze Zeit im DOM.** Sie war nur nicht gemalt: DIE STADT
baut die Aufschrift aus `.wort` (erste Zeile des Brettkopfs) und `.zahl`
(zweite Zeile), und `stil/stadt.css:349` blendet `.zahl` aus, sobald die
Reiterzeile schmal wird:

```css
.stadt-werkbank.schmal .knopf.stadt-reiter .zahl { display: none; }
```

Schmal wird sie ab dem zweiten Braujahr, weil dann mehr Bretter da sind. Das
ist eine **richtige** Entscheidung DER STADT — zehn Reiter in einer Zeile von
1.093 px können nicht alle zwei Zeilen tragen — und `stil/stadt.css` gehört
mir nicht.

### Die Abhilfe

Was mir gehört, ist die Aufschrift meines eigenen Bretts. DIE STADT hat dafür
eine Tür: `stadt.js:611` liest `data-reiter`, wenn es dasteht, und nimmt es
als Titel — **ungekürzt** und ohne die 30-Zeichen-Grenze der abgeleiteten
Fassung. Also steht die Zahl jetzt im Titel, in `.wort`, das nie ausgeblendet
wird, **und zusätzlich weiter im Kopf des Bretts**, wo sie immer stand. Beide
Orte, wie die Auflage es verlangt.

```js
band.setAttribute('data-reiter', 'Ohne dich geschehen · ' + zaehlerWort());
```

Der Schlüssel des Reiters hängt an der Klassenliste (`stadt.js:572`), nicht am
Titel — `stadt:reiter:gegner-amort-gg-band` bleibt also Buchstabe für
Buchstabe derselbe, und jedes vorhandene Messgerät findet ihn weiter.

### Die Abnahme

`gegnerblick.mjs 1 50`, **nachher**:

| | vorher | nachher |
|---|---|---|
| Wochen mit Zahl am Reiter | **30 / 50** | **50 / 50** |
| Woche 15 (1350/15 bzw. 1350/14) | `OHNE DICH GESCHEHEN 12 Züge` | `OHNE DICH GESCHEHEN · 12 ZÜGE zugeklappt` |
| Woche 45 (1351/14) | `OHNE DICH GESCHEHEN` | `OHNE DICH GESCHEHEN · 25 ZÜGE zugeklappt` |
| Form Woche 45 = Form Woche 15 | **nein** | **ja** |

*(Die zweite Zeile trägt jetzt statt der Zahl den Zustand — `zugeklappt` bzw.
`liegt auf` —, weil `data-reiter` die abgeleitete Kennzahl ersetzt. Im schmalen
Zustand wird sie weiter ausgeblendet; die Zahl steht dann im Titel und bleibt
sichtbar. Das ist genau die Vertauschung, die die Auflage verlangt.)*

---

*(Abschnitt 2 — R15 — und Abschnitt 3 — die zweite Messlatte — folgen, sobald
die Läufe durch sind.)*
