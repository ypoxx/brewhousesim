# Gemini-Prompts für die Mockup-Bilder — Richtungsentscheid

Sechs Prompts für `design/tools/gen_image.py`, je ≤ 80 Wörter, sofort nutzbar.
Sie setzen das Skelett aus `stimmen/stimme-gestalter.md` §6 voraus (Kopfleiste,
6er-Navigation links, Hauptfläche, rechte Spalte, Fußzeile mit WEITER/FREIGABE) und
verwenden dessen Hexwerte. Aufruf-Muster:

    ./design/tools/gen_image.py --prompt-file p1.txt --out mock-1884-tabelle.png

## Kleid A — Braumeister 1884

**A1 · Hauptbildschirm (die Tabelle, Pflicht-Maske aus §6.7):**

```
Game UI mockup, 16:9. German brewery-manager game "Braumeister 1884", 1880s ledger
aesthetic: aged paper #eeeae1, iron-gall ink #26221b, vermilion #a03a24 used only for
deficits. Top bar with date, cash, next event. Left nav, six entries. Main area:
ledger-style league table, twelve breweries, horizontal rules only, double-underlined
totals, serif tabular numerals, one row inverted black. Right column: pinned notes from
innkeepers. Black WEITER button bottom right. Flat printed look, no gloss, no photos.
```

**A2 · Spieltag (der Wochenschluss):**

```
Same game, week-closing screen. Ledger paper UI: #eeeae1 paper, #26221b ink, #a03a24
red for shortfalls only. Center: week 7 delivery report — eight taverns, barrels
delivered, money returned, two rows red where beer ran out, a double rule drawn under
the week. Right column: three innkeeper notes, one angry. Footer: WEITER button. Small
lithograph tavern signs beside each row. Flat 1880s print aesthetic, no gloss.
```

**A3 · Porträt (Lithografie):**

```
Portrait asset. Nineteenth-century lithograph bust of a Bavarian master brewer, 1884:
stern middle-aged man, mutton-chop whiskers, high collar, hint of an apron. Crosshatch
and stipple engraving, iron-gall ink #26221b on aged paper #eeeae1, one vermilion
#a03a24 stamp in the corner. Oval frame, name plate "G. KRAUS". Style of period
trade-journal portraits. No colors beyond these, no photorealism.
```

## Kleid B — Die Agentur

**B1 · Hauptbildschirm (das Ranking, Pflicht-Maske aus §6.7):**

```
Game UI mockup, 16:9. Present-day PR-agency manager game "Die Agentur". Cool dark
interface: background #15171b, panels #1d2026, text #e9ebee, one blue accent #5b9dff
for actions, red #ff5d45 reserved for crisis. Top bar: date, budget, next deadline.
Left nav, six entries. Main: agency ranking table, twelve rows, tabular numerals.
Right: news feed framed as a screen within the screen, monospace ticker. Client logos
as small flat color tiles, the only other color. FREIGABE button bottom right.
```

**B2 · Kampagnen-Moment (die Krise):**

```
Same game, crisis screen. Dark PR-manager UI: #15171b background, #1d2026 panels,
accent #5b9dff. A client shitstorm live: center panel shows a sentiment curve
collapsing, red #ff5d45 only in the curve and one KPI tile. Right feed: monospace
headlines with timestamps, scrolling. Left nav dimmed. Footer: FREIGABE button with
countdown "Antwortfenster 02:14". Controlled tension, flat design, no glow, no lens
flare.
```

**B3 · Porträt / Stimmung:**

```
Character asset. Flat, reduced-vector portrait of a PR-agency creative director,
present day: confident woman, mid-forties, dark blazer, phone in hand. Palette:
interface grays #15171b/#1d2026, one accent #5b9dff, muted skin tones. Clean geometric
shapes, subtle grain, no gradients. Square crop on #15171b. Must sit beside stat
numbers on a manager-game staff card.
```

## Sparhinweise

1. Iterieren mit `--model gemini-3.1-flash-image`; das teure `gemini-3-pro-image` (der
   Skript-Default) nur für die finale Fassung je Motiv.
2. Beim Iterieren `--resolution 1K`, erst der Abnahme-Render bekommt `2K`; `4K` nie für UI.
3. Stil einmal treffen, dann mit `--ref bestes-bild.png` weiterarbeiten statt den Stil neu
   zu beschreiben — hält die Serie konstant und spart Fehlversuche.
