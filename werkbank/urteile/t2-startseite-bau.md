# T2.1 / T2.2 / T2.3 / T2.6 — Die Startseite, Baubericht

*Laufend geschrieben, nicht am Ende.*

Auftrag: die Startseite außerhalb der eingefrorenen `spiel/index.html` bauen
— „Den Bogen beginnen“, „Freies Spiel“, „Fortsetzen“, Fußzeile mit
Impressum/Datenschutz/Browser-Deklaration —, dazu Meta/OG/Favicon und die
Auslieferung nachziehen. **Kein Browser gestartet, keine Messung gelaufen**
(ein Builder misst parallel auf derselben Maschine); geprüft wurde durch
Lesen, plus zwei harmlose Offline-Syntaxproben (`bash -n`, `node --check`,
Python-`html.parser` auf Tag-Balance) — keins davon öffnet einen Browser.

## Gelesen

`feinkonzept/FEINKONZEPT.md` §1 (F5/F6/F8) und §2 (Einstieg) ·
`feinkonzept/UMSETZUNGSPLAN.md` Tickets T2.1–T2.6 · `spiel/LIESMICH.md`
(„URL-Parameter“, „Spielstand“) · `spiel/kern/stand.js` (Schlüsselformat,
Feldnamen) · `spiel/kern/uhr.js`/`start.js` (Saat-Parsing, `?epoche=1..4`) ·
`spiel/kern/welt.js` (Epochennamen/-verben, Schaujahre) · `index.html`
(Repo-Wurzel, Stilvorbild) · `werkbank/auslieferung.sh` · `netlify.toml`.

## Gebaut

- `start/index.html` — die Startseite. Einzelne Datei, Inline-CSS/JS, keine
  Web-Fonts, keine ES-Module, kein `onclick=`-Attribut (nur
  `addEventListener`), keine Netzabrufe.
- `start/impressum.html`, `start/datenschutz.html` — Unterseiten, gleicher
  Stil, je eigenständige Datei.
- `start/favicon.png` (64×64, 1,3 KB), `start/og.png` (1200×630, 36 KB) —
  mit Pillow aus Systemfonts gerendert (Liberation Serif), Papier/Tinte-Stil
  des Stilvorbilds, als Dateien unter `start/` (nicht Data-URI, damit
  Social-Crawler das OG-Bild wirklich abrufen können).
- `werkbank/auslieferung.sh` geändert (Details unten).

## „Fortsetzen“ — wie die Stände gelesen werden

Reines Client-JS, kein Zugriff auf Spiel-Interna: iteriert alle
`localStorage`-Schlüssel, behält nur Treffer auf
`^brauhaus:([0-9]+):([0-9]+)$` (schließt `brauhaus:bogen` aus, den
Bogen-Schlüssel aus FEINKONZEPT §3 — der ist kein Partienstand). Pro Treffer
wird der Wert mit `JSON.parse` versucht; liefert er `zeit.jahr`/`zeit.woche`
als Zahlen, zeigt der Knopftext „Jahr … · Woche …“, sonst nur „Saat …“ —
genau das „falls ablesbar“ aus dem Auftrag. Kein Treffer ⇒ der ganze
Abschnitt bleibt `hidden` (kein toter Knopf, keine tote Überschrift). Jeder
Fund verlinkt direkt auf `spiel/?epoche=<n>&saat=<saat>` — ohne `&jahr=`
oder `&woche=`, weil `kern/stand.js` nur dann automatisch lädt (mit
`jahr`/`woche` in der Adresse schaltet das Spiel in den „Aufnahme“-Modus und
lädt nichts).

## `werkbank/auslieferung.sh`

Die alte Wurzel-`index.html` (Werkstatt-/Fortschrittsseite) zieht auf
`/werkstatt.html` um, weil `/index.html` jetzt der neuen Startseite gehört.
Neu kopiert: `start/index.html`→`/index.html`,
`start/impressum.html`, `start/datenschutz.html`, `start/favicon.png`,
`start/og.png`. `spiel/**` unverändert. Die Selbstprüfung am Ende (Positiv-
und Negativliste) ist um die neuen Ziele erweitert — bricht weiterhin laut
ab, wenn eine Datei fehlt oder etwas Internes mitrutscht. Das Skript selbst
wurde **nicht ausgeführt**, nur mit `bash -n` auf Syntax geprüft.

## Wo geraten statt gewusst wurde

- **Tagessaat-Formel.** Nirgends im Konzept steht eine Formel, nur dass sie
  „aus dem Datum abgeleitet“ sein soll. Gewählt: `JJJJMMTT` als Zahl (z. B.
  20260810), aus dem **lokalen** Gerätedatum (nicht UTC) — einfach,
  eindeutig pro Kalendertag, passt in die 32-Bit-Saat
  (`(saat >>> 0) || 1350` in `kern/uhr.js`). Lokal statt UTC ist meine
  Wahl, nicht belegt; Spieler in sehr unterschiedlichen Zeitzonen bekämen
  damit an Tagesgrenzen unterschiedliche Tagessaaten.
- **Epochen-Verben in der Freien-Spiel-Auswahl.** Ich habe die *aktuell
  im Code stehenden* Verben aus `spiel/kern/welt.js` benutzt (1970 =
  „bedeuten“), nicht die in FEINKONZEPT §1/F2 für die Zukunft angekündigte
  Verschiebung (1970 → „bestehen“, „bedeuten“ wandert in die noch nicht
  gebaute fünfte Epoche) — die Startseite verlinkt schließlich auf das
  Spiel, wie es heute ist.
- **`og:image` als relativer Pfad** (`og.png`), nicht als absolute URL,
  weil die endgültige Domain nicht feststeht. Funktioniert nach dem Deploy
  korrekt (löst zu `https://…/og.png` auf), aber ungetestet mit einem
  echten Social-Crawler.
- **Browser-Deklaration ohne Versionsnummer.** Ich schreibe „aktuelle
  Chromium-Browser“, ohne eine Mindestversion zu nennen — dafür habe ich
  keine Grundlage gefunden und wollte keine Zahl erfinden.
- **„Fortsetzen“-Gültigkeitsprüfung ist bewusst locker.** Ich prüfe nur
  „JSON parsebar“, nicht `fassung === 1` oder die volle `taugt()`-Logik aus
  `kern/stand.js` (Feld für Feld) — das Spiel selbst prüft beim Laden ohnehin
  streng nach und verwirft im Zweifel still auf eine frische Partie. Eine
  doppelte, driftanfällige Kopie dieser Prüfung auf der Startseite schien mir
  das größere Risiko.
- **Impressum-Rechtsverweis** `§ 18 Abs. 2 MStV` (aktuelle Fassung,
  löste 2020 den älteren `§ 55 Abs. 2 RStV` ab) — Standardformulierung,
  nicht anwaltlich geprüft.

## Harte Grenzen eingehalten

`spiel/` nicht angefasst (nur gelesen). Kein `git add`/`commit`/`push`.
Kein Framework, kein CDN, keine Web-Fonts, kein Netzabruf. Alle Aktionen
echte `<button>`/`<a>`-Elemente mit sichtbarem `:focus-visible`-Rahmen.
Impressum-Personalien als `[Name]`/`[Anschrift]`/`[E-Mail]` belassen, nicht
erfunden.

## Offen (nicht Teil dieses Auftrags)

T2.4 (Spielstand-Migration), T2.5 (Cross-Browser-Probe Firefox/WebKit) —
beide separate Tickets. Die Impressum-Platzhalter muss der Auftraggeber
selbst füllen, bevor die Seite öffentlich geht.
