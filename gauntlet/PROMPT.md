# Der Prompt

Der eine Text, der den Lauf startet. Geschrieben nach Shumers Meta-Prompt-Verfahren;
die Wahl und Begründung der Messlatten steht in [`MESSLATTE.md`](MESSLATTE.md).

Kurz gehalten mit Absicht — Shumers eigener Prompt für *Claude of Duty* war drei Absätze,
und der Artikel sagt, warum: *„When you prescribe the architecture, the workstreams, and
every step, you replace the model's judgment with your own. Give it the destination. Let it
choose the route."*

---

> Bau ein Browserspiel auf Deutsch: eine Wirtschaftssimulation um ein Brauhaus von 1350 bis
> heute. Man spielt keine Person, sondern das Haus — Generationen erben. Es soll das Brauen
> und das Vermarkten von Bier als Reich großartig einfangen: klug, spannend, fast lehrreich,
> in der Nachbarschaft von Pizza Connection, Patrizier, Die Fugger, Anstoss, Transport
> Tycoon, Anno. Das Material im Repo ist Referenz, kein Bauplan — alles darf neu entschieden
> werden.
>
> Drei Messlatten, gegen die du verlieren kannst. **Bild:** Fotografiere den laufenden Build
> mit Playwright und lege ihn blind neben das Blatt derselben Epoche aus `zielbild/`; solange
> das Blatt gewinnt, geht die Arbeit zurück — und alle vier Epochen zeigen denselben Ort.
> **Spiel:** Ein frischer Kritiker spielt jede Epoche zwanzig Minuten und zählt am Bildschirm
> die Entscheidungen mit Preis nebeneinander, die unwiderruflichen Festlegungen und die Züge
> des Gegners, die ohne ihn geschahen; dazu trägt er die Barschaft gegen den Preis des
> nächsten sinnvollen Zuges auf. Wächst die Barschaft schneller, ist es Patrizier IV. Kommt
> viermal dieselbe Verbliste heraus, ist die Epoche ein Kostüm. **Ton:** dreißig Sekunden
> ohne Bild, ein fremdes Ohr (Gemini) nennt Epoche und Vorgang; rät es falsch, geht es
> zurück. `design/PRUEFUNG.md` ist Sperrliste, keine Messlatte: Ein Fund dort disqualifiziert,
> gewinnt aber nie.
>
> Zerlege das Ziel selbst in die kleinsten Stücke, die sich einzeln verbessern und beurteilen
> lassen. Je Stück ein Builder und ein getrennter Kritiker mit frischem Kontext, der nur das
> laufende Spiel sieht, nie die Begründung des Builders. Schleife, bis wir gewinnen oder ich
> abbreche.
>
> Halte eine einfache Fortschrittsseite im Repo aktuell; Netlify deployt sie. Bilder und Ton
> erzeugst du selbst (`$GEMINI_API_KEY`, `$ELEVENLABS_API_KEY`) — externe Bildarchive sind
> gesperrt, Chromium und Playwright sind da. Fächere Subagenten auf und ultracode.

---

## Werkzeuge, die schon da sind

Damit der Lauf sie nicht sucht:

| Werkzeug | Wofür |
|---|---|
| `design/tools/gen_image.py` | Bild über Gemini, mit `--ref` als Stilanker |
| `design/tools/gen_audio.py` | Musik, Geräusch, Stimme über ElevenLabs; Gemini als Rückfall |
| `werkbank/schuss.mjs` | Playwright-Aufnahme der laufenden Seite, im Format der Zielbilder |
| `werkbank/stand.py` | schreibt die Fortschrittsseite, gesperrt gegen parallele Schreiber |
