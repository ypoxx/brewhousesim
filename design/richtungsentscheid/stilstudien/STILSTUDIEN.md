# Stilstudien — dieselbe Brauerei, sechs grafische Manager-Schulen

Sechs Bilder, ein Inhalt: die Brauerei von 1884 mit Stadt, Fuhre und WEITER-Knopf —
jeweils durch eine andere grafische Tradition des Managerspiels gedreht. Erzeugt mit
`gemini-3.1-flash-image` bei 1K (Entwurfsqualität, Texte teils fehlerhaft — das ist
die bekannte Schwäche des Modells, nicht die Absicht des Stils). Die Prompts liegen
als `.txt` daneben; für Abnahme-Fassungen: Pro-Modell, 2K, `--ref` auf den Entwurf.

| Datei | Schule | Vorbild | Was sie fürs Projekt bedeutet |
|---|---|---|---|
| `s1-anstoss.jpg` | Karikatur-Szene | Anstoss 3 | Wärme und Witz; Szenen als Unikat-Bilder für Ereignisse und Besuche. Beißt sich als Dauerton mit dem Kontorbuch-Ernst. |
| `s2-stadtkarte.jpg` | Bewohnte Stadtkarte | Pizza Connection | **Die beste Passung zum Marktmodell**: Absatzorte sind Orte — Wimpel an Häusern sind die Schilderwand, die Fuhre fährt sichtbar, die Reichweitenlinie hätte hier wieder ein Zuhause. Ein großes Bild plus Overlays, produktionsgünstig. |
| `s3-gemaelde.jpg` | Gemälde im Rahmen | Der Patrizier / Hanse | Würde und Erwachsenenton, nahe an der Materialität des Repos (Holz, Siegel, Pergament). Wenige große Kulissen, statisch — trägt Stimmung, keine Systeme. |
| `s4-vga.jpg` | VGA-Pixel-Raum | Eishockey Manager (Software 2000) | Die ehrlichste Verbeugung vor dem Ur-Vorbild von 1993. Steam-Nische liebt das; Pixel-Assets konsistent zu halten ist Handarbeit. |
| `s5-spielzeug.jpg` | Spielzeug-3D | Two Point Hospital | Charmant und poliert — aber Mobile-Game-Nähe und der offenste Widerspruch zu KONZEPT §11 („handwerklich, nicht cartoonhaft"). Am weitesten vom Repo entfernt. |
| `s6-flat-live.jpg` | Flat-UI mit Live-Spieltag | Motorsport Manager / modernes FM | Die Fuhre als beobachtbarer Live-Spieltag im nüchternen Gewand. Systemisch stark, emotional am kühlsten — genau die Wärme fehlt, die vier von sechs Testpersonen verlangten. |

Die Studien beantworten die Frage aus dem Richtungsentscheid, wie „Manager-Format"
aussehen kann, ohne „Excel mit Serifen" zu werden: Das Skelett (Saison, Tabelle,
Gegner, WEITER) ist in allen sechs dasselbe — verhandelt wird nur die Haut.

Ein plausibles Zielbild aus der Serie: **S2 als Heimatbildschirm** (die Stadt, in der
das Marktmodell wohnt), **die Kontorbuch-Masken des Mockups für Tabelle, Kader und
Michaeli**, und **S1/S3-artige Szenen als Ereignis- und Besuchsbilder**. Das wäre die
„Haut Bühne" der Mehrheitsstimmen, mit Bildern statt Behauptungen.

## Rückmeldung des Auftraggebers (nach Sichtung)

S2 favorisiert („lebendiger durch die Isometrie"), an S3 gefällt das mitalternde
Epochen-Interface, S1 und S3 als verwandt empfunden. S5 zu kindlich und KI-seitig zu
aufwendig. S6 nicht als Hauptakt, aber interessant als **Zwischenkarte der Expansion** —
man will die Ausbreitung der Brauerei sehen.

## Die Epochen-Serie (`epochen/`)

Auftrag danach: dieselbe Stadt über die Epochen hinweg, in der S2-Optik, mit
mitalterndem Interface (KONZEPT §11: „Pergament, Kupferstich, Lithografie, Emailschild,
Gegenwart"). Alle drei neuen Bilder per `--ref` aus `s2-stadtkarte.jpg` (= Epoche III,
1884) erzeugt — die Stadt bleibt erkennbar dieselbe, und genau das ist die Pointe:
**„Du spielst ein Haus" als Bildfolge.**

| Datei | Epoche | Was sich wandelt |
|---|---|---|
| `epochen/e1-1350.jpg` | I · Das Recht | Klosterbrauerei mit Grutgarten, ein Kupferkessel, Lehmwege, Handkarren; UI als Pergament-Handschrift mit Rubrik-Initialen, WEITER als Siegelrolle. |
| `epochen/e2-1650.jpg` | II · Die Ordnung | Barockturm, Zunfthäuser, Hopfengärten, eine Brandruine als Kriegsnarbe; UI im Holzschnitt-Duktus, FORTFAHREN als gedrucktes Zunftsiegel. *Bekannte Schwäche: Straßenbild und Bahntrasse noch zu 1884-haft — Erbe des Referenzbilds.* |
| `s2-stadtkarte.jpg` | III · Die Maschine (1884) | Das Ausgangsbild: Backstein, Schornstein, Eisenbahn, Lithografie-UI. |
| `epochen/e4-gegenwart.jpg` | IV · Die Marke (heute) | Supermarkt mit Paletten, Lkw statt Fuhre, Taproom im alten Stall, S-Bahn, Solardächer; UI nüchtern-flach. |

Einordnung zur Empfehlung der Gegenüberstellung: Am Entscheid „eine feste Zeit zuerst,
Epochen als Ausbaustufen" ändert die Serie nichts — aber sie zeigt, was „andockfähig"
später visuell bedeuten würde, zum Preis von je einem Stadtbild und einem UI-Kleid pro
Epoche.

## Die Pfade-Matrix (`pfade/`) — drei weitere Ideenpfade, jeweils durch die Epochen

Auftrag: mehr Varianten für unterschiedliche Ideenpfade, jeweils über die Epochen.
Je Pfad ein 1884er-Anker (bzw. der Gegenwarts-Anker der Agentur), die übrigen Bilder
per `--ref` daraus.

**Pfad Bühne** (`buehne-1350 / -1884 / -heute`) — das Brauhaus im Schnitt, die Straße,
die Wirtshäuser: 1350 Kloster mit Grutgarten und Mönch am Handkarren, 1884 die bekannte
Fuhre-Bühne mit roter Reichweitenlinie, heute Edelstahltank, Kegs, Lkw, Taproom und
S-Bahn — der Querschnitt bleibt derselbe. *Schwächen: Wirtshausschilder teils englisch
(„Tavern"), das Heute-Bild erbt die 1884er-Kopfzeile.*

**Pfad Masken** (`masken-1350 / -1884 / -heute`) — dieselbe Tabellen-Maske, dreimal.
Das ist §13 „Die Währung wechselt" als Bildfolge: die Urkunde mit Siegeln und PROBATUM-
Vermerken, das Kontorbuch mit Zetteln und Zinnober-Notiz, die Vertriebsübersicht mit
Regalmetern und „Listingrisiko — ggf. Delisting". Das Emailschild oben links ist im
Gegenwartsbild das einzige historische Objekt. *Schwäche: die 1350er-Fassung trägt noch
die 1884er-Kopfzeile des Referenzbilds.*

**Pfad Agentur** (`agentur-1965 / -1995`, Anker: `../stimmung/b1-hauptbildschirm.jpg`) —
die Mad-Men-Versuchung der PR-Strategin, sichtbar gemacht: 1965 Schreibmaschinenliste,
Korkwand-Pressespiegel und Messingglocke als WEITER; 1995 Fensterrahmen-UI, Fax mit
Krisenmeldung, Pager; heute das kühle Dashboard. *Schwäche: die Meldungstexte bleiben
in allen Epochen die von 2024 — Erbe des Referenzbilds.* Auffällig: Die Agentur-Epochen
wechseln nur die Requisiten, nie den Mechanismus — was die These der Strategin stützt,
dass ihr Thema keine Epochen braucht.
