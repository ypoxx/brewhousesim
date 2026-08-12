# DAS INTRO — Baubericht

*Laufend geschrieben, nicht am Ende.*

Auftrag: das Intro (drei bis vier Bilder, Erzählerstimme, Text immer geschrieben,
Ton aus per Vorgabe, unter 90 Sekunden, überspringbar) und die Anleitung (fünf
Minuten Vorwissen: Braujahr, Zeile unten, Michaelitafel, Verlieren, Glossar) —
beides **außerhalb** von `spiel/` (gesperrt für mich), in `start/`. Dazu die
Auslieferung nachziehen.

## Gelesen, bevor gebaut wurde

`feinkonzept/FEINKONZEPT.md` (§1 Bogen light, §2 Einstieg) ·
`feinkonzept/UMSETZUNGSPLAN.md` (W18 „Der Empfang" ist **Onboarding im Spiel**
und eine andere Welle — Glossar-Blatt dort ist nicht dieses Glossar) ·
`spiel/LIESMICH.md` (komplett) · `zielbild/README.md` + `zielbild/prompts/*`
(Kontinuitätsregeln des Ortes) · `design/PRUEFUNG.md` (komplett, für die
Sperrliste) · `design/REFERENZEN.md` (Emailschild, Bahn, Kessel-Abschnitte) ·
`design/WERKZEUGE.md` (Anti-Schlonz-Technik, `--ref`-Regeln) ·
`design/tools/gen_image.py`, `gen_audio.py` · `KONZEPT.md` §4, §7 ·
`spiel/kern/uhr.js`, `kern/kopf.js`, `kern/welt.js` (§ meldeZug/meldeZiel) ·
`spiel/stuecke/preis.js` (Michaelitafel/Festlegung) ·
`spiel/stuecke/fuhre.js`, `fuhre-daten.js` (Kerbholz, Angeld, Bannmeile,
die Ausgänge/`keine-abnehmer`, `uebergabeFehlt()`) · `spiel/stuecke/name.js`
(Aufgeld) · `start/index.html`, `werkbank/auslieferung.sh`, `netlify.toml`.

## Gebaut

- `start/intro/index.html` — die Bildfolge. Ein `<img>`, ein `<audio>`,
  Quellen werden per JS umgehängt statt vier feste Tags zu laden (progressives
  Laden). Auto-Vorlauf je Bild (15/16/12/15 s, Summe 58 s), `Weiter`/`Zurück`/
  Bildpunkte als echte `<button>`, `Überspringen` als echter `<a>`, Escape
  verlässt sofort nach `../index.html`. Ton-Knopf **Vorgabe aus**;
  `<audio preload="none">` ohne `src`, bis der Knopf gedrückt wird — es wird
  kein Ton-Byte geladen, solange niemand ihn anschaltet.
- `start/intro/01-1350.webp` · `02-1884.webp` · `03-heute.webp` ·
  `04-uebergabe.webp` — vier Bilder, 1600×893, WebP q80.
- `start/intro/01-1350.mp3` … `04-uebergabe.mp3` — vier Sprachclips.
- `start/anleitung.html` — Braujahr (Michaeli–Georgi) · was pro Woche trägt ·
  die Zeile unten (`nächster Zug`/`Ziel`) · Michaelitafel & Festlegung ·
  Wie man verliert / die Übergabe · Glossar (die acht verlangten Begriffe).
  Reiner Text, kein Skript.
- `start/index.html` — zwei neue, rein optionale Links („Das Intro ansehen“,
  „Anleitung lesen“) unter dem Zielsatz plus in der Fußzeile; kein Preload,
  keine neue Netzabfrage.
- `werkbank/auslieferung.sh` — `start/anleitung.html` → `anleitung.html`,
  `start/intro/` → `intro/` (ganzer Ordner) kopiert; Positiv-Selbstprüfung
  um `anleitung.html` und alle acht `intro/*`-Dateien erweitert. Negativliste
  unverändert (kein neuer interner Pfad). **Nicht ausgeführt** — nur
  `bash -n werkbank/auslieferung.sh` (Syntax ok) und Handnachsehen, dass jede
  kopierte Quelle existiert. Dieselbe Zurückhaltung wie im T2-Bericht: das
  Skript räumt `auslieferung/` weg und baut neu, und drei andere Builder
  arbeiten parallel — ich wollte dieses geteilte Verzeichnis nicht unter der
  Hand verändern, ohne dass es verlangt war.

## Bilder — Prompts und Werkzeug

Alle vier mit `design/tools/gen_image.py`, Modell `gemini-3-pro-image`,
16:9, 2K, dann mit Pillow auf 1600×893 verkleinert und als WebP q80
gespeichert (Faktor der Originale: 2752×1536-JPEG von ca. 3,1–3,3 MB auf
86–240 KB WebP). Bild 1 ohne `--ref` (Anker), Bilder 2–4 jeweils mit `--ref`
auf das direkt vorherige Bild — dieselbe Kettenregel wie in
`design/WERKZEUGE.md` §3, nur mit eigenen, neu erzeugten Ankern statt der
`zielbild/`-Platten, weil ich für ein Intro (keine HUD-Leiste, andere
Kadrierung, keine Zahlen) eine andere Bildsprache brauchte als die
Gameplay-Mockups. Kontinuität des Ortes (Fluss von rechts, Brücke, Kirche auf
dem Hügel, Hügelkette) ist in jedem der vier Prompts wörtlich vorgegeben.

**Bewusste Entscheidung, die Fehlerfläche klein zu halten:** kein einziges
erzeugtes Bild trägt Schrift, Zahlen oder eine HUD-Leiste — jeder Prompt
verbietet das ausdrücklich. Das umgeht fast die gesamte Fehlerklasse aus
`design/PRUEFUNG.md` §4.1/§4.3 (falsch buchstabierte Wörter, „SUD" wird
„SÜD" …), weil es nichts zu lesen gibt, das falsch geschrieben sein könnte.
Bildunterschriften sind echter HTML-Text, von mir geschrieben, nicht vom
Modell gerendert.

**Sperrliste, wörtlich zitiert (nicht zusammengefasst), gegen die ich
geprüft habe:**

> `design/PRUEFUNG.md` §4.5: „Der Braukessel ist eine offene Pfanne. NO lid,
> NO dome, NO swan-neck pipe, NO condenser — that is a still, not a brewing
> kettle."

> `design/PRUEFUNG.md` §1.2, Fund A2: „Emailreklameschilder gibt es erst ab
> den 1890ern."

Für 1350 (Bild 1) galt die erste Zeile direkt: offener Kessel über offenem
Feuer, keine Kuppel, kein Rohr — im ersten Wurf sauber, von der Aufsicht
bestätigt.

**Für 1884 (Bild 2) hat es drei Würfe gebraucht, nicht zwei — und ich hatte
den zweiten fälschlich für erledigt erklärt.** Der erste Wurf zeigte genau
den in §4.5 benannten Modellreflex: ein kuppelförmiges Kupfergefäß mit Hals,
das in eine Haube mündet. Ich habe nachgebessert („breite, flache Pfanne,
KEIN Deckel auf der Pfanne selbst; die Haube hängt frei darüber, mit Luft
dazwischen") und den zweiten Wurf als sauber gemeldet — geprüft an einem
Ausschnitt, der genau an der Stelle endete, an der das Rohr der Dunsthaube
nach oben abknickte. **Die Aufsicht hat sich das Bild angesehen, nicht nur
meinen Bericht gelesen, und an einem weiter gezogenen Ausschnitt war die
Silhouette eindeutig eine Destillierblase: der Haubentrichter plus das
abknickende Rohr ergaben zusammen genau die verbotene Form — breit unten,
zum Hals verengt, seitlich abknickend.** Mein „Fix" hatte der Pfanne im
Türdurchgang eine offene Fläche gegeben, aber daneben eine neue Blase an die
Wand gehängt, statt die verbotene Form ganz zu entfernen. Dritter Wurf mit
einer Prompt-Fassung, die jede Haube, jedes Rohr und jede Verjüngung neben
der Pfanne ausdrücklich verbietet (`--ref` wieder auf `01-1350.webp`, wie
von der Aufsicht verlangt) — die Pfanne steht jetzt offen unter freiem
Himmel im Türdurchgang, Dampf steigt frei auf, nichts hängt darüber. **Diesen
dritten Wurf habe ich mit `Read` an der tatsächlich ausgelieferten
`start/intro/02-1884.webp` selbst angesehen, nicht nur am Rohbild im
Scratchpad**, bevor ich ihn hier vermelde. Kein Emailschild in Bild 2 (ich
habe ohnehin jede Beschriftung verboten). **Lehre für mich:** ein Ausschnitt,
der eine Form erst am Bildrand abschneidet, ist kein Beleg — die volle
Silhouette gehört ins Bild, bevor man „geprüft" schreibt.

**Zur Bahn vor 1835**, die im Auftrag als harte
Grenze genannt war: eine wörtliche Zeile mit dieser Zahl **habe ich in
`design/PRUEFUNG.md` nicht gefunden** — die 1835 steht als belegte
Jahreszahl in `design/REFERENZEN.md:679` („Erstes Frachtgut auf deutscher
Schiene … ist Bier"), das Verbot für 1600 wörtlich in `zielbild/README.md`
(„ausdrücklichem Verbot der Bahn für 1600"). Ich melde das hier, statt die
Sperrliste falsch zu zitieren. Betroffen war es ohnehin nicht: keines meiner
vier Bilder zeigt eine Eisenbahn.

Bild 3 (Kisten im Hof) zeigte im ersten Wurf kleine, nicht lesbare
Pseudo-Schrift auf den Getränkekisten (Toleranz von KI-Bildmodellen bei
Texturen, `design/PRUEFUNG.md` §4.1). Nachgebessert mit einer expliziten
„keine Zahlen, keine Prägeschrift"-Zeile; zweiter Wurf ist bei
Auslieferungsgröße nicht mehr lesbar, bei voller Auflösung noch schwach zu
ahnen — im Bericht vermerkt statt verschwiegen.

Volle Prompt-Texte lagen unter
`/tmp/.../scratchpad/intro/prompt-{a,b,c,d}-*.txt` (Sitzungs-Scratch, nicht
Teil des Repos). Kurzfassung je Bild:

1. **1350** — Hof vor geschlossener Stadtmauer, offener Kessel über
   offenem Feuer, Holzsteg statt Steinbrücke, keine Bahn, kein Schornstein.
2. **1884** — dieselbe Stelle, Backsteinbrauerei mit Schornstein, offene
   Pfanne unter freihängender Haube, Steinbogenbrücke, Mauer als Ruine.
3. **Heute** — derselbe Ort, moderner Betrieb mit Glasfront und Solardach,
   alter Schornstein als Storchennest-Denkmal, Mauerfragment im Grünstreifen,
   Windräder am Horizont.
4. **Die Übergabe** — Nahaufnahme am Hoftor im Abendlicht: eine ältere Hand
   übergibt einer jüngeren einen alten Schlüssel, im Hintergrund unscharf
   dieselbe moderne Brauerei.

## Ton — Werkzeugwechsel unterwegs

`$ELEVENLABS_API_KEY` ist zwar gesetzt, aber ungültig: `gen_audio.py stimme`
und ein direkter `curl` gegen `/v1/user` liefern beide
`api_key_id_used_as_api_key` — der hinterlegte Wert ist eine ElevenLabs-
**Schlüssel-ID**, kein echter Secret Key (der mit `sk_` beginnt). Das ist ein
Umgebungsproblem, keins, das sich im Prompt oder im Code lösen lässt; ich
habe es nicht verschwiegen, sondern auf den im selben Werkzeug eingebauten
Ausweg gewechselt: `gen_audio.py stimme --gemini --gstimme Charon`
(Gemini-TTS, `$GEMINI_API_KEY` funktioniert). Ausgabe ist WAV (24 kHz, mono);
mit `pip install lameenc` (einzige neue Abhängigkeit, nur zur Bauzeit,
nicht Teil der Seite) auf MP3 64 kbps herunterkodiert — 1,74 MB WAV wurden zu
285 KB MP3. **Stimme ist damit nicht die deutsche ElevenLabs-Stimme
„chronist", die ich eigentlich gewählt hätte** (sachlich, deutsch, aus der
`STIMMEN`-Tabelle), sondern die Gemini-Stimme „Charon" — das melde ich als
Abweichung vom Idealweg, nicht nur als Fußnote.

## Länge und Gewicht

Intro: 4 Bilder, Vorlaufzeit 15+16+12+15 = **58 s** (unter 90 s), reine
Sprechzeit der vier Clips zusammen **36,3 s**. Text steht in jedem Bild
vollständig und dauerhaft da, unabhängig vom Ton-Stand.

**Erster Aufruf der Startseite** (`start/index.html`): 13.937 B HTML +
1.271 B `favicon.png` = **≈ 14,9 KB**. `og.png` (37.311 B) zählt **nicht**
mit — es wird nur von Social-Media-Crawlern abgerufen (`<meta
property="og:image">`), nie vom Browser selbst beim normalen Seitenaufruf.
Kein neuer Request auf der Startseite durch diesen Auftrag.

**Das Intro, nur wenn „Ansehen" gedrückt wird:** `intro/index.html`
12.035 B + vier WebP progressiv nachgeladen (220+215+220+86 KB, Bild 2 nach
dem Neubau unten leicht kleiner) = bis zu **≈ 752 KB**, wenn man bis zum
Schluss schaut, weniger bei früherem Escape/Überspringen (nur das gerade
gezeigte Bild ist geladen). **Ton kommt nur oben drauf, wenn er
angeschaltet wird:** +285 KB für alle vier Clips (Vorgabe ist aus — 0 Byte
Ton, bis jemand den Knopf drückt).

## Wo ich eine Regel beschrieben habe, ohne sie wortwörtlich im Quelltext zu
## belegen — vollständige Liste

1. **„Drei Dinge tragen jede Woche"** (Sud ansetzen · Fuhre losschicken ·
   Zeile unten lesen) in `start/anleitung.html` ist **meine eigene
   Zusammenfassung**, keine wörtliche Spielregel. Jede einzelne Handlung ist
   belegt (Sud: `fuhre.js` `setzeAn()`; Fuhre: die Liefermechanik überhaupt;
   die Zeile: `kern/kopf.js`/`kern/welt.js`), aber die Bündelung zu „drei
   Dingen" stammt von mir. `feinkonzept/FEINKONZEPT.md` nennt eine ANDERE
   Dreiergruppe für die (noch nicht gebaute) geführte Erststunde **im
   Spiel** — „Sud ansetzen → Fuhre packen → **Michaeli lesen**". Ich habe
   „Michaeli lesen" bewusst nicht übernommen, weil Michaeli nur einmal im
   Braujahr vorkommt (Woche 1 von 30), nicht jede Woche — das stünde in
   meiner eigenen Anleitung im selben Absatz im Widerspruch zum Abschnitt
   „Das Braujahr". Ersetzt durch das Lesen der Zeile unten, die tatsächlich
   jede Woche neu geschrieben wird.
2. Die Fristlänge „acht bis zwölf Wochen, je nach Epoche" ist eine Spanne,
   keine einzelne Zahl — im Quelltext geprüft (`fuhre-daten.js`: 1350 und
   1600 je 12, 1884 zehn, 1970 acht Wochen); ich hatte zunächst pauschal
   „zwölf Wochen" geschrieben und beim Gegenlesen aller vier Epochenblöcke
   korrigiert, bevor es ausgeliefert wurde.
3. Die genauen Schwellen der Übergabe (`uebergabeFehlt()`: Mindestjahre,
   Mindestzahl belieferter Häuser, keine rote Kasse, Mindestausstoß im
   Vorjahr) nenne ich in der Anleitung **qualitativ, ohne Zahlen** — die
   Zahlen liegen in `MASS_VORGABE`/je Epoche in `fuhre-daten.js` und hätten
   das Dokument an vier weitere, driftanfällige Werte gebunden.
4. Die Bahn-vor-1835-Grenze aus dem Auftrag: siehe Abschnitt „Bilder" oben —
   nicht wörtlich in `design/PRUEFUNG.md` gefunden, sondern in
   `design/REFERENZEN.md` und `zielbild/README.md`.

## Nicht angesehen, nicht gemessen

Kein Browser für einen Messlauf gestartet (drei Builder messen parallel).
Ein einzelner Screenshot über `werkbank/schuss.mjs` gegen
`start/intro/index.html` (lokaler `http-server`, danach beendet) — zeigt
Bild 1, alle Bedienelemente, „keine Fehler auf der Seite". HTML-Tag-Balance
und das eingebettete JS (`node --check`) für `start/index.html`,
`start/intro/index.html` und `start/anleitung.html` geprüft, sonst nur
gelesen.

## Nachtrag — Gegenprobe der Aufsicht, 02-1884.webp neu erzeugt

Die Aufsicht hat die Bilder selbst angesehen (nicht nur diesen Bericht) und
in `02-1884.webp` die in §4.5 verbotene Destillierblasen-Silhouette
gefunden — mein zweiter Wurf hatte sie nicht entfernt, nur eine offene
Pfanne danebengestellt (Einzelheiten oben im Abschnitt „Bilder", jetzt
korrigiert statt stillschweigend überschrieben). Dritter Wurf erzeugt mit
einer Prompt-Fassung, die Haube, Rohr und jede Verjüngung neben der Pfanne
ausdrücklich verbietet, wieder mit `--ref 01-1350.webp` für die
Ortskontinuität. Das Ergebnis mit `Read` an der tatsächlich ausgelieferten
Datei geprüft (nicht nur am Scratchpad-Rohbild), an einem Bildausschnitt,
der die volle Form zeigt und nicht am Rand abschneidet — die Pfanne steht
jetzt offen unter freiem Himmel, nichts hängt darüber. `start/index.html`,
`start/anleitung.html` und `werkbank/auslieferung.sh` waren von dem Fund
nicht betroffen und blieben unverändert; die Tonspuren wurden angewiesen,
nicht angefasst zu werden, und wurden es auch nicht.
