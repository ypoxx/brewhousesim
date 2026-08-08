# Gameplay-Analyse: DIE FUHRE · DAS ERBE · DER NAME · DER KLANG

---

## 1. DIE FUHRE (`stuecke/fuhre.js`, 5.464 Z. / 256 KB · `fuhre-daten.js` 1.039 Z. · `fuhre-zusatz.js` leerer Stummel, 9 Z.)

### 1.1 Spielmechanik
Kernschleife der Woche (Kopfkommentar fuhre.js:6–15): Der Sud fällt **von selbst** nach der Anschlagtafel (Kreideplan je Sorte, `braue()` fuhre.js:1924); Fässer landen abzählbar im Keller (Sorte, Braudatum, Reife, Haltbarkeit); der Wagen hat wenige Plätze und Halte; **„Fuhre abschicken" = Woche vorbei** (`schicke()` fuhre.js:1800–1893, endet mit `B.uhr.naechsteWoche()`). Wer 3 Jahre in Folge unter 30 % des Jahresbedarfs liefert, verliert die Adresse (`mahnenUndVerlieren()` fuhre.js:2421). Zu Georgi wird die Tafel gewischt, der Sommer läuft ohne Hand ab (`sommerLaeuft()` fuhre.js:2215, Sommerbrauverbot, 8 % Schwund/Monat, Kellerräumung).

Zentrale Design-These (fuhre.js:21–38): **„Die Kasse ist nie die Wand"** — drei geldlose Auswege: **Notsud** (zweiter Guss auf dieselben Treber, 0 Kosten, begrenzt durch `notsud.jeSud * Z.sudeWoche + mindest`, fuhre.js:2023–2062), **Kerbholz** (`zahleOderKerbe()` fuhre.js:302, einziger Zahlweg des Stücks; offene Kerben nimmt der Gläubiger zu Georgi in der knappen Sache: Brautage/Sude/Eis/Regalmeter, max. die Hälfte, fuhre.js:2295–2377), **Rückverkauf** von Rohstoff (fuhre.js:346). Ende ist nie die leere Kasse, sondern das **leere Auftragsbuch** (`pruefeAuftragsbuch()` fuhre.js:818). Weg zurück: **Probefass** (kostenlos, 4 überzeugende Proben, 6 wenn gegnerisch gebunden, `PROBE_ZIEL` fuhre.js:183–184; Frist steht still in Probe-Wochen), plus „neuer Wirt fragt an" (25 %-Chance je Georgi, fuhre.js:793).

Weitere Systeme: **Zahlungsziel** (bar/Kerbholz/Borg, `zielStufen` — bar 100 %/Durst 66 % vs. Borg 12 % bar/Durst 132 %/Ausfall 15 %, fuhre-daten.js:217–227; Zahltag = Michaeli-Umgang mit Ausfallquoten je Mahnstand, `zahltag()` fuhre.js:486; **Angeld** = Vorschuss, der abgetrunken wird), **Schere** (`laufTeuerung()` fuhre.js:216: +2,8 %/J 1350, +1,2 % 1600, **−0,6 % 1884**, +2,0 % 1970, Deckel 30 Jahre), **Ungeld 8 % auf jede Einnahme** statt Jahressumme (`einnahme()` fuhre.js:443), **Wochenkarte mit Fuhrplänen** (Welle 13: 6 Pläne `probe/mager/umkaempft/durst/rechnung/nah`, gleiche Ladung dedupliziert, `planListe()` fuhre.js:1619; Plan fährt die Fuhre sofort ab) und **Sprung** („Weiter wie zuletzt · bis zu 6 Wochen", fährt jede Woche real den letzten Plan, `springeWochen()` fuhre.js:1763).

**Spielerverben je Epoche** (fuhre-daten.js:164–693): überall laden/abladen (`fuhre:laden/abladen:<adr>`), Tafel ±, Fuhrpläne, Käufe, Probefass, Ziel wählen (bis Woche 7), Kerbe löschen. Epocheneigen:
- **1350** „Brautage · Bannmeile": Budget 44 Brautage/Jahr, Bannbrief (60 Pf, Staffel 1,55) für Adressen außerhalb 1 Meile, Ochsenkarren 5 Fass/4 Halte, Kerbholz beim Grutherrn (Pfand: 3 Brautage je Kerbe), Notsud = Kofent.
- **1600** „Fassplätze · Zunftquote": 40 Sude der Reihe, Fasspfand beim Wirt einziehen (`ziehePfand()` fuhre.js:2134), Notsud = Nachbier.
- **1884** „Frachtstufen · Eis": Bahn-Frachtstufen (Wagenstellung wird zu Michaeli **automatisch neu nach Vorjahresaufkommen bestellt**, fuhre.js:1184–1201, 5280–5291), Eiswirtschaft (Eisernte bei Frost frei, Eishändler kostet; ohne Eis −2 Wo. Haltbarkeit je Fass, fuhre.js:2151), Notsud = Einfachbier.
- **1970** „Regalmeter · Tourenplan": Listung je Adresse+Sorte (Basis 2.600, Staffel 1,22; fällt nach 2 Leerjahren, fuhre.js:5318–5331), nur 3 Halte, Notsud = Handelsmarke (braucht **keinen** Regalmeter — Etikett des Händlers, fuhre.js:604–626).

### 1.2 Daten/Inhalt
`fuhre-daten.js`: 4 komplette Epochenblöcke mit je 4 Sorten (inkl. Not-Sorte), Käufe-Listen, 3 Zielstufen, Kerbholz-, Probe-, Frist-, Abgabe-Definitionen; **Zettel-Texte 4×4** (fuhre-daten.js:109–134), **neuerWirt 4×2** (143–160), Monatsnamen je Epoche (1350: „Wonnemond … Scheiding"). **Ausgänge** (734–1038): je Epoche `antrag`/`angenommen`/`fall` mit Voll-Texten, `uebergabe` 4× mit epochenspezifischem **Maß** (`mass`: 5 J/3 Häuser (E1/E2), 5/2 (E3), **4/1 (E4)** — begründet mit dem Brauereisterben, 972–1037), `fremd` mit 7 Gründen anderer Stücke.

### 1.3 UI und Integration
6 Bretter/Karten in Ebene `hand`: **DIE HÄUSER** (Adresskarten mit 3-Jahres-Reihe, Mahn-Pips, Bannbrief/Regalmeter-Knopf, Probefass-Knopf, self-scaling Liste via eigenem `--s`-Bezugspixel, `passeListe()` fuhre.js:3024, Untergrenze 0,34), **ANSCHLAGTAFEL** (Sudplan, Notsudzeile immer sichtbar, Kerbholz, Schere-Zeile), **KELLER** (Fassgitter, Eis, Pfand), **WAGEN** (Frachtbrief, „FUHRE ABSCHICKEN"), **WOCHENKARTE** (`.fu-woche`, bewusst < 3,5 % Bühne, damit die Platzordnung der STADT sie nicht zum Brett macht, fuhre.js:3697–3808), **Ortsmarken** je Adresse. In Ebene `blatt`: Schlussblatt, Antragsblatt, Übergabeblatt, Georgi-Tafel. Meldet `meldeZug` aus dem **eigenen DOM** (billigster bedienbarer Knopf mit `data-preis`, fuhre.js:2664) und `meldeZiel` (Übergabe-Nähe, fuhre.js:2797). Hört auf `ende`, `vorwoche`, `jahresende`, `erbfall`; installiert 5 document-Listener (weiterHorcher, reiterHorcher, anfangHorcher, tastenSperre, endeHorcher) und **umwickelt `B.knopf`** (Versiegelung, s.u.).

### 1.4 Qualität
- Sehr hoher, messungsgetriebener Reifegrad (fast jede Konstante mit Messprotokoll begründet), aber **massive Datei** und viele Querkopplungen: liest `document.getElementById('fach-kopf-kern-start')` (fuhre.js:3726), reagiert auf `stadt:reiter:*`-Klicks (4141), kennt `stadt.js GRENZE=3,5 %` als Magic-Zahl.
- **Versiegelung ist zugestandene Kern-Schuld**: Monkey-Patch der Knopffabrik + Capture-Listener + `html[data-hof-zu]` (fuhre.js:4731–4843); Kommentar selbst: „DAS GEHOERT IN DEN KERN … dann kann das hier ersatzlos weg" (4776–4781).
- `kaufe('lastzug')` **mutiert die Datentabelle** `ep().wagen.halte` (fuhre.js:2576) — schreibt in globales `FUHRE_DATEN`; nur durch Seiten-Reload beim Wiederanfang unschädlich.
- Totes Ternary in `kannLaden`: `(frachtstufe() ? ep().wagen.halte : ep().wagen.halte)` (fuhre.js:1270).
- `Z.uebergabe.frist` wird lazily initialisiert (`=== undefined ? UEBERGABE_WOCHEN`) an 5 Stellen — funktioniert, aber fragil verteilt.
- Lücken: keine — alle 4 Epochen voll ausgebaut; das Stück ist das vollständigste des Spiels.

### 1.5 Ende der Partie
DIE FUHRE ist **die Endinstanz des Spiels**. Ablauf: letzte Adresse weg → Frist läuft (**12/12/10/8 Wochen** je E1–E4, Gegner: Rat/Zunft/Malzhändler/Handel, fuhre-daten.js:238/362/528/643) → ab halber Frist liegt **DER ANTRAG** (2 unwiderrufliche Knöpfe, Preisschild `basis + jePlatz·Gärraum`, `legeAntragVor()` fuhre.js:901) → Frist 0: `vollzieheFall()` (962). Ausgänge je Epoche (fuhre-daten.js:734–906):

| Epoche | Antrag angenommen (voller Preis) | Frist abgelaufen (Anteil des Antrags) |
|---|---|---|
| 1350 | `pfanne-zurueckgegeben` (Abstand 40+4/Platz) | `braurecht-entzogen` — **0 %** |
| 1600 | `gerechtigkeit-verkauft` (260+14/Platz) | `reihe-gestrichen` — 35 % |
| 1884 | `an-aktienbrauerei-verkauft` (6.000+95/Platz) | `bank-verwertet` — 0 % |
| 1970 | `marke-verkauft` (90.000+130/Platz) | `brauereisterben` — 12 % |

Dazu **DIE ÜBERGABE** (`uebergeben`), das einzige gute Ende aus diesem Stück: zu Michaeli angeboten, wenn `uebergabeFehlt()==null` (Jahre/Häuser/Ausstoß/Kasse ≥ Maß der Epoche, fuhre.js:1026), liegt 4 Wochen, ruft `B.welt.erbe()` und dann `B.uhr.beende('uebergeben')` (fuhre.js:1081–1107). Ausgeschlagener Antrag kommt **nie wieder** (`Z.antragErledigt`); zurückgewonnene Adresse nimmt den Antrag vom Tisch, ohne ihn zu verbrauchen (fuhre.js:829–835). Angehalten wird ausschließlich über `B.uhr.beende(grund)`; das **eine Urteil** malt `zeichneSchluss()` (fuhre.js:4958–5116, `data-urteil`) für **jeden** Grund — auch fremde: `reihe-verloren`/`lade-zieht-ein`/`braustaette-still`/`anlage-still` (DER SUD, kalte Pfanne je Epoche), `haus-verloren` (STADT, ausgepfändet), `keine-abnehmer` (Fallback), `gegenwart` (**gut**: Kern erreicht die Gegenwart, fuhre-daten.js:964–969). Schlussblatt: Urteil+Folge+Auszahlung, These „das Geld war nie das Problem" mit Zahlen des letzten Tages, Generationenzeile, Verlust-/Rückkehr-Chronik, **Wiederanfang** (neue Saat via URL, fuhre.js:4946) und Versiegelung des Hofes (nur Lesen bleibt; Whitelist `NACH_ENDE_GENAU` fuhre.js:4788).

---

## 2. DAS ERBE (`erbe.js` 1.475 Z. · `erbe-daten.js` 392 Z. · `erbe-zusatz.js` leer, 6 Z.)

### 2.1 Spielmechanik
Entstanden aus dem Befund, dass `welt.erbe()` in **0 von 4 gemessenen Partien** je lief (Amtszeit 21–37 Jahre vs. ~3 Braujahre Partie, erbe.js:5–23). Regel: **„Was am Haus haftet, geht über. Was an der Person haftet, fällt mit ihr."** Klassifikation über Regex `D.AM_HAUS` gegen `bindung.womit` (erbe-daten.js:55). Die **Stunde** schlägt bereits in Woche 12–18 des **ersten** Braujahres (`STUNDE_NACH_JAHREN=0`, Streuung deterministisch aus `amtszeit.bis`, kein Würfelzug — erbe.js:315–325, erbe-daten.js:272–328) und **kehrt alle 2 Braujahre wieder** (`STUNDE_ABSTAND=2`; mit 1 gemessen „vier Erbfälle in 103 Wochen — eine Seuche", erbe-daten.js:321).

Spielerverben (in allen Epochen gleich, nur umbenannt): **Verschreiben/Verbriefen/Eintragen/Festschreiben** (persönliche Bindung aufs Haus, Preis `bedarf·satz·eich·feder`, unwiderruflich, erbe.js:348), **Fortschreiben** (Bindungen laufen bis Datum, 0,6× Preis, 641), **Nachschrift** (Gefallenes zurückkaufen, 1,4×, 612), **Widerspruch** (Auflage 1: bezahlte, aber erloschene Verschreibungen — dritte Lade ERLOSCHEN, gezahlter Betrag wird angerechnet, 427–501) und die **drei Übergabewege**: LEIBGEDING (jährlich `0,20·Erbmasse` je Michaeli, kumulativ über Hände; unbezahlbar → verfällt, Personen fallen doch, erbe.js:736–747), ABFINDUNG (einmalig, fällt mit Rest-Amtszeit von 1,0 auf 0,45 der Erbmasse, +1 Jahr Gnadenfrist), OHNE (0, alles Persönliche fällt sofort + **Erbteil aus dem Keller**: 1/3 der Fässer, je Hand weniger [3,4,5,6], erbe.js:582). Wer nichts wählt, bekommt bei der Stunde „OHNE". **Eigenschaft der Hand** setzt die Feder (0,70 sparsam … 1,30 bequem) und den fünften Zug: `borg` (wagemutig, doppelt zu Michaeli), `seelgeraet` (fromm, bindet Kloster+Pfarrhof), `anfechten` (streitbar, fremde Personen-Bindungen für 2,2× gewinnen), `zahlen` (gelehrt, zeigt Jahreswerte) (erbe-daten.js:63–76). Dazu **Antrittsgeld** (+25 % Feder bis erstes Michaeli) und **Erbfolgenachweis** (+8 % je Handnummer) — damit ist die Feder nach jedem Erbfall nachweislich eine andere (Auflage 2, erbe-daten.js:330–355).

**Epocheneigen ist hier nur die Wortwelt** (bewusst): Stadtbuch/Briefbuch/Hypothekenbuch/Vertragsakte, Sätze 0,9/3,0/40/130, Laufzeiten 12/14/15/10 Jahre, je eigene Formen-/Stunde-/Widerspruchs-Texte (erbe-daten.js:94–230); optisch Pergament/Bütten/Vordruck/Maschinenschrift (Auflage 4, erbe.js:88–92).

### 2.2 Daten/Inhalt
`erbe-daten.js`: 1 Regex, 6 Eigenschaften, 4 Epochenblöcke (je ~12 Textbausteine: verb/wo/womit/erklaerung/3 formen/stunde/seelgeraet/anfechten/erloschen/widerspruch), ~15 ausführlich begründete Konstanten (u.a. `ZIEL_ANTEIL=0.38` — Eichung der Gesamtkosten an der Startkasse, `UEBERGABE_MINDEST=6` — gegen den 1-Pfennig-Knopf, der die rho-Kennzahl verfälschte, erbe-daten.js:357–388).

### 2.3 UI und Integration
Dauerleiste `.erb-leiste` unten quer (2,99 % Bühne, **bewusst ohne `data-frei`**, um die Ortsmarken-Regel der STADT nicht zu verwirken, erbe.js:945–951): Band (Hand-Nr. röm., Eigenschaft, Feder-Faktor, „am Haus n · an der Person m", „nimmt …", Erloschen-Summe, Leibgeding-Last) + 4 Knöpfe (dringendste Tat aus `taten()` erbe.js:839 + drei Übergabewege; der Null-Weg trägt sein „0"-Preisschild selbst, 1032–1036). **Buch** (`.erb-buch`) nur im DOM, wenn offen (Welle 11), eigener Schließknopf `erbe:buch:zu`, `BRAUHAUS.blatt.melde()`; Laden: AM HAUS / AN DER PERSON / ERLOSCHEN / GEFALLEN / GESCHRIEBEN / DIE HÄNDE. Integration: konsumiert `welt.binde`-Vokabular aller Stücke (Regex!), löst `welt.erbe()` aus — dessen `erbfall`-Ereignis bedienen FUHRE (Geschlechterzeile), NAME (Bekanntheit −5), GEGNER, PREIS. Jede Tat meldet `meldeZug` (erbe.js:938). Töne über `klang(eigen, ersatz)`-Fallback (erbe.js:337).

### 2.4 Qualität
- **Fragilste Stelle: der Wörter-Regex** `AM_HAUS` — schon einmal daran gescheitert (die eigenen Gerichtsurteile fielen als „persönlich", erbe-daten.js:41–53); jedes neue `womit`-Wort eines anderen Stücks kann Bindungen still falsch klassifizieren.
- Eichung `Z.eich` wird **einmal im aufbau** mit dem Satz der Startepoche gerechnet (erbe.js:1341–1349); nach einem Epochenwechsel mischt `wert()` neuen `ep().satz` mit altem Eichfaktor.
- `loesePersoenliche()` bei verfallenem Leibgeding löst **alle** persönlichen Bindungen, nicht nur die der betroffenen Alt-Hand (erbe.js:745) — vertretbar, aber ungenau.
- Begriffs-Kollision: „Übergabe" existiert doppelt — ERBEs Amtsübergabe (Partie läuft weiter) vs. FUHREs Übergabe (Partie endet, ruft ebenfalls `welt.erbe()`, fuhre.js:1088; ERBEs erbfall-Handler stellt danach noch eine tote nächste Stunde).
- Sonst sauber: kein `ende`-bezogener Zustand nötig, `uebergib` prüft `zeit().ende`, Züge nach dem Ende sperrt FUHREs Versiegelung.

### 2.5 Ende der Partie
DAS ERBE **beendet die Partie nie** und zeichnet **kein eigenes Schlussblatt/Beiblatt** — obwohl fuhre.js:75 und fuhre.js:4854 „Das Nachspiel gehört später DEM ERBE (ZUSTÄNDIGKEIT 12)" ankündigen: dieses Nachspiel existiert noch nicht (Lücke/offenes Versprechen). Sein Beitrag zum Ende ist indirekt: die Generationenzeile des Schlussblatts speist sich aus den von ihm ausgelösten `erbfall`-Ereignissen; „DIE HÄNDE"-Lade dokumentiert die Hausgeschichte.

---

## 3. DER NAME (`name.js` 2.401 Z. · `name-daten.js` 452 Z. · `name-zusatz.js` leer, 6 Z.)

### 3.1 Spielmechanik
These: „Ein Ruf ist langsam zu bauen und schnell zu verlieren, und solange man ihn hat, darf man teurer sein als der Nachbar bei gleichem Bier" (name.js:7–9). Ruf = `bekannt × einloesung / 100` (name.js:457); **kein Punktekonto, sondern REGISTER** fremder, datierter, nie löschbarer Urteile — ein schweres schlechtes Urteil „knipst" 1–2 ältere gute aus (durchgestrichen, name.js:567–594). Bekanntheit wächst max. **0,9/Woche** bis zum Träger-Ziel `zielBekannt()` (Deckel 55/68/86/92 je Epoche), fällt schneller (1,6; mit Krug 0,8). **Einlösung** heilt nur bei Güte ≥62 des Kellers (`guete()` name.js:423: Frische × Sortenfaktor, Notsud zählt 0,3). Bruchmechanik: Zeichen hängt + Güte <40 → nach 5 Wochen Register-Zeile „Bruch"; **3 schwere Zeilen binnen 6 Jahren → ENTZUG** durch die Instanz der Epoche (Rat nimmt Zeiger+Zunftzeichen / Zunft streicht+Schilder ab / Amtsgericht druckt Urteil ab, Auflagen wertlos / Handel listet aus **und nimmt eine Adresse**; auch „Unwiderrufliches" fällt, `vollzieheEntzug()` name.js:621, Daten name-daten.js:391–450). Rückweg kostet Geld + Fässer + Keller-Güte ≥55/58 (`loeseEntzug()` name.js:693). Ökonomische Wirkung = **DAS AUFGELD**: das Stück liest die Rechnungen der FUHRE aus dem Protokoll (Regex `^[\d.,]+ (Fass|hl) an .`, name.js:498–501) und bucht selbst `erloes × satzFuer(adr)` als Einnahme (Aufschlag-Deckel 8/13/21/32 % je Epoche; je Wirt moduliert durch dessen Urteil ±, Schild ×1,15, Nachahmung ×0,75; **0 solange das Zeichen verdeckt ist**, name.js:486–559). Doppelbuchungs-Sicherung: `welt.haus.rufAufschlagGelesen` (name.js:476–480). Gegner „Adler" **ahmt nach** (billiger als besser brauen), sein Ruf wächst dann, er wirbt Adressen ab (`gegnerzug()` name.js:873–912); Gegenmittel je Epoche (Ratsklage 55 % / Zunftspruch 85 % / Warenzeichen ab 1894 sicher / Unterlassung sicher, name-daten.js:365–378).

**Spielerverben je Epoche** (Träger `art`-Bauarten: schalter/fest/adresse/jahr/wette/schutz/notbremse; vier verschiedene **Riegel**): 
- **1350** (AUSHÄNGEN, 3 Träger): Bierzeiger (kostenlos, an/aus), Zunftzeichen (fest, 45), Umtrunk (9 + **1 Fass**, max. **3 je Amtszeit** — Riegel Zeit).
- **1600** (ANSCHLAGEN, 4): Wirtshausschild je Adresse (70, max. **6 fremde Türen**, Urteil zählt doppelt), gemarkter Krug (fest, wirkt erst nach +12 Jahren), Freitrunk Kirchweih (jahr, 1 Fass), Zunftspruch (schutz).
- **1884** (AUFLEGEN, 7): Etikett/Annonce/Plakat/Litfaßsäule/Emailschild(ab 1894) — Riegel **DIE DRUCKEREI: 40 Bogen Gewicht** (Säule 22, Annonce 5; sperrt, tauscht nicht), Ausstellung (wette, 3.000 + 2 Fass, Jury-Würfel → Medaille), Warenzeichen (fest, ab 1894).
- **1970** (ETAT SETZEN, 9): Riegel **Etat = 3 Jahresposten, tauscht statt sperrt** (schwächster fliegt, angesagt): Bierdeckel/Kronkorken/Kastenaktion(2.600 + **8 Fass**)/Anzeige/Bande/Fernsehspot (48.000, `laut` → Urteile doppelt so tief), Rückruf (notbremse 30.000), Unterlassung, **Flaschenform** (fest 32.000 — die einzige unwiderrufliche Festlegung von 1970); dazu **Namensverkauf** an Nordstern (120.000 + Ruf·4.200, Register über dem Strich erlischt, Ruf auf 40 gedeckelt, name.js:1264–1283).
Immer frei (harte Regel „kein Zustand ohne wirksamen Zug", per DOM gemessen in `pruefeLebendig()` name.js:2197): **Zeichen verdecken/zeigen** (umkehrbar, rettet Einlösung, kostet Reichweite und das gesamte Aufgeld) und **Herumgehen** (1×/Braujahr). Urteils-Instanzen je Epoche: Bierkieser (2×/Jahr, unangemeldet), Zunftschau/Wirte, Wochenblatt, Verbrauchertest (misst Lautstärke gegen Ware, name.js:799–839).

### 3.2 Daten/Inhalt
`name-daten.js`: 4 Epochenblöcke (Medium, Verb, Deckel, Aufschlag, Aufgeld-Wortwelt, Urteiler, Bildplatzierung), **23 Träger** (3/4/7/9), Urteilstexte lob/tadel/bruch/leer je 4 + medaille 2 (nur E3/E4, Fallback vorhanden), Nachahmung 4×, Entzug 4× (mit sperrt/nimmtFest/nimmtAdresse/Rückweg). Bilder: `bild/name/zeiger1.png · schild2.png · saeule3.png · tafel4.png` — alle 4 Epochen abgedeckt.

### 3.3 UI und Integration
Drei Flächen: **Rufband** links oben (immer da, einklappbar; Ruf groß, Balken Bekanntheit mit Zielmarke/Einlösung, „Gleiches Bier, 100 Einheiten, zwei Preise", Aufgeld-Kasten mit 3 nachprüfbaren Zahlen, Entzugs-/Klemmen-Kasten, „WAS DER NAME JETZT KOSTET" = 3 billigste kaufbare Posten, 2 Freizüge, Griff zum Blatt — name.js:1468–1701), **Platte** (Zeichen-PNG am epochenspezifischen Ort, Schilder an fremden Häusern 1600, Nachahmer-Zeichen „nachgemacht" beim Adler, **Anschlag** = 1 Preisschild ohne Klick <2,4 % Bühne, name.js:1362–1440), **Blatt** mit 3 Reitern (DAS ZEICHEN / DAS REGISTER / DAS AUFGELD, Escape-fähig). Doppel-Preisschild Geld+Fässer via `data-fasspreis` (bewusst nicht `data-fass` — Kollision mit GEGNER, name.js:1723–1727). Abbestellen fragt zweistufig nach (`frageNach`, name.js:1071). Integration: publiziert `welt.haus.ruf*`-Felder (name.js:724–742) + Lese-API `B.ruf` (2357–2399); liest FUHRE-Protokoll (Aufgeld) und Weltzustand des GEGNERS, fasst keine fremden Dateien an. `meldeZug` bewusst **ohne Rang** („hat 400 Wochen die Kopfzeile mit einem Bierdeckel gewonnen", name.js:2247–2253) und nur, wenn der Knopf wirklich unverdeckt im DOM steht.

### 3.4 Qualität
- **Fragilste Stelle:** Aufgeld hängt an der exakten Buchungs-Textform der FUHRE (`istRechnung`-Regex + „geliefert an "-Präfix + Rechnung max. 3 Zeilen davor, name.js:529–555). Ändert DIE FUHRE ihre Protokolltexte, versiegt das Aufgeld **still**.
- `nachahmung[1].schluessel='klage'` referenziert einen nicht existierenden Träger — läuft nur wegen `(traeger(...)||{}).jahre || 8` als Default (name.js:1252).
- Sehr sorgfältige Attribut-Hygiene (`data-fasspreis` vs `data-fass`, `data-einloesung` vs `data-deckung`), zweistufige Rückfragen, Sperrgründe am Knopf.
- Kein `ende`-Handler: nach Partieende schaltet nur FUHREs Versiegelung die `name:*`-Knöpfe tot (Whitelist enthält sie nicht) — gewollt, aber der Ruf taucht im Urteil nicht auf (kleine Lücke: das Register wäre Schlussblatt-Material).
- `ton/name/LIESMICH.md` ist **veraltet**: bittet DEN KLANG, 15 `name:*`-Rufe in den KATALOG aufzunehmen — das ist längst geschehen (kern/ton.js:471–490, alle 16 gerufenen Namen abgedeckt).

### 3.5 Ende der Partie
Kein Partie-Ende aus diesem Stück. Der **Entzug** ist ein reversibler Tiefpunkt (Sperre 2–4 Jahre, Rückweg teuer), der **Namensverkauf** (1970) ein unwiderruflicher Selbstverstümmelungszug, aber die Uhr läuft weiter. Beiträge zum Ende nur indirekt (Adressverlust durch Abwerbung/Entzug kann das leere Auftragsbuch der FUHRE beschleunigen).

---

## 4. DER KLANG (`klang.js` 91 Z. + **`kern/ton.js` 2.013 Z.** + `ton/`)

### 4.1 Spielmechanik
`stuecke/klang.js` ist nur der sichtbare Teil: ein Ton-Schalter links unten (♪/—, mit `?stumm=1` unsichtbar; wird vom Tonbus **selbst nachgeladen**, weil index.html eingefroren ist — kern/ton.js:2000–2011; fällt das aus, klingt das Spiel trotzdem) plus Prüfer-API `BRAUHAUS.klang.probe(sek)` → Base64-WAV und `.was()` → Ereignisplan (klang.js:85–89). Die eigentliche Arbeit ist kern/ton.js (per Zuständigkeit §11 für Welle 2 an DEN KLANG übergeben). Architektur gegen die **Latte 3** („fremdes Ohr hört 30 s ohne Bild und nennt Epoche+Vorgang"):
- Vier Dauerschichten: **GRUND** (`grund.mp3`, Wind — in allen Epochen gleich, sagt nur „ein Hof"), **BETT** (Epochenmusik bett1–4) und **HOF** (hof1–4) laufen **nur, solange gespielt wird** („DER RUHENDE HOF", `belebe()`/`LEBEN_TIEF=0`, ton.js:100–149 — gemessen: stille Aufnahmen trugen die Epoche 12/12, gespielte 3/12; also darf Nichtstun nichts mehr verraten), **WERK** = Ereignisse.
- **KATALOG** (~70 Einträge, ton.js:255–556) bedient jeden gerufenen Namen aus FUHRE/PREIS/STADT/GEGNER/SUD/NAME/ERBE/UHR; Epochenwahl via `je(a,b,c,d)` (4-stufig: bett/hof/woche/sud/abfahrt/michaeli) oder `altNeu(alt,neu)` (**nur E4 klingt anders**: Münzen→Kasse, Siegel→Maschine, Kreide→Maschine …). `NOTFALL` je Präfix + `GERATEN`-Zähler, `dichte()`/`gestundet()` als nachzählbare Auflagen-Belege.
- Gegnerklänge auf eigenem **fern-Bus durch eine Wand** (Tiefpass 2000 Hz + Echo); jeder echte Nachbarzug zieht das **NACHBARHOF-Zeichen** nach sich (`drueben1/4`, eigene 600-Hz-Wand mit 1,9× Ausgleich, Vorhalt 0,35 s, Dauer 4,2 s, Sperre 3,4 s, `nachbarhof()` ton.js:1297–1382 — dreimal umgebaut, jede Iteration mit Messbegründung inkl. „wer Stimmen in einer Probe hat, muss die Probe austauschen und nicht den Filter", 993–1002).
- Ducking (`ducke`), **Zäsur** für den Michaelitag (Zeichenbus läuft an der eigenen Absenkung vorbei), **Anti-Kammfilter-Stapelgrenze** (max. 2 Kopien je Datei/0,5 s, Stundung bis 1,1 s — gegen die 12 Fasskopien = „8-Bit-Soundeffekt", ton.js:1138–1194), Loudness-Normalisierung (`angleich`/`hebe`/`mindest`), **Bremse** (tanh-WaveShaper, Deckel 0,818, oversample bewusst aus, 802–828), Kompressor.
- **Mitschnitt läuft immer** (auch stumm); `rendere()` baut denselben Graphen offline und liefert WAV ohne ffmpeg (1835–1904); `pegel()` misst am realen Ausgang hinter der Bremse (1738–1772). Ersatzklänge sind **gesätes** gefiltertes Rauschen, kein Oszillator (Anachronismus-Regel, 674–794; der Keller-Tropfen wurde extra vom Sinus auf Resonanz-Rauschen umgebaut).

### 4.2 Daten/Inhalt
`spiel/ton/`: 6 Unterordner. **Nur `ton/klang/` enthält Audio: 49 MP3, ~7,8 MB** — je 4× bett/hof/woche/sud, abfahrt2–4 (**abfahrt1 gelöscht**: die „Ochsenfuhre" war Wassergeplätscher; 1350 fährt jetzt Pferdefuhre + `ochse.mp3` als `dazu`-Schicht, ton.js:283–315), drueben1/4, nachbar1/4, bau1/4, grund, glocke/fabrikpfeife/werksglocke/schicht, muenzen/kasse, siegel/maschine, kreide/feder/papier, anstich/flaschen/fassholz/hefe, karren/telefon, handschlag/unruhe/horchen/brand/kerbe. `ton/fuhre|preis|stadt|gegner|name/` sind **absichtlich leer** (nur LIESMICH; ton/name/LIESMICH.md erklärt: kern/ton.js lädt ausschließlich aus `ton/klang/`). **Alle vier Epochen sind abgedeckt** — die Epochen-Unterscheidung ist bei den tragenden Vorgängen 4-stufig, bei vielen Nebenvorgängen nur 2-stufig (`altNeu`, d.h. 1600 und 1884 klingen dort wie 1350).

### 4.3 UI und Integration
Ein einziges DOM-Element (Schalter in Ebene `kopf`), aria-Label, hängt sich nach `buehne.starte()` notfalls direkt an `zeichne` (klang.js:63–76). Alle 9 Stücke rufen `B.ton.spiele('<stueck>:<vorgang>')`; die API ist zeichengleich zum Skelett (melde/spiele/schleife/halt/bett/setzeStumm/setzeLaut). Ton wird erst nach der ersten Nutzerhandlung geweckt (Autoplay-Policy, ton.js:1984–1998); `?stumm=1` lädt **kein einziges Byte** Audio.

### 4.4 Qualität
- Höchste dokumentierte Messdichte des Projekts (jede Pegelzahl mit Blindtest-Befund). Schulden: **`altNeu`-Grobauflösung** — 1600/1884 tragen ihre Zeit fast nur über Bett/Hof/Woche/Sud/Abfahrt/Michaeli; ein `fuhre:kauf` klingt 1884 wie 1350 (bekannter, bewusster Kompromiss).
- klang.js:36 totes Ternary (`an ? (laeuft ? '♪' : '♪') : '—'` — beide Zweige „♪", Zustand „wartet" unterscheidet nur die CSS-Klasse).
- `bett:epocheN`-Sonderfall im Katalog per Regex abgefangen (ton.js:1412–1418) — dokumentierte Landmine bei Epochenwechseln.
- `ton/name/LIESMICH.md` veraltet (Bitte längst erfüllt, s.o.); Latte-3-Wunsch dort (`name:druck`/`name:siegel` je Epoche verschieden) ist teilweise umgesetzt (`name:druck` = je(feder,feder,maschine,maschine), `name:siegel` nur altNeu).
- Alle Rufe aller vier untersuchten Stücke sind katalogisiert (auch die 4 vorsorglichen ERBE-Züge `anfechten/nachschrift/seelgeraet/verlaengern`, ton.js:507–513); ERBE nutzt zusätzlich eigene Fallbacks (`klang('erbe:x','preis:siegel')`, erbe.js:337–340) — doppelte Absicherung.

### 4.5 Ende der Partie
Kein eigener Beitrag; nach dem Ende bleibt der Schalter (`klang:ton`) ausdrücklich in FUHREs Nach-Ende-Whitelist bedienbar (fuhre.js:4788–4790). Es gibt keinen dedizierten End-/Urteilsklang — das Urteil erklingt nur indirekt (`fuhre:siegel` beim Antrag, `erbe:uebergabe`-Handschlag bei der Übergabe); ein eigenes Schlusszeichen („die Pfanne verstummt") fehlt als hörbare Lücke.

---

## Querbefunde
1. **Ende-Architektur ist zentralisiert und konsistent**: nur `B.uhr.beende(grund)` hält an; FUHRE trägt das eine Urteil für alle Gründe inkl. Fallback für unbekannte (`urteilZu` fuhre.js:4866–4884: „Der Grund heißt ‚X' und ist auf diesem Blatt nicht beschrieben" — ehrlich statt leer). 3 gute Ausgänge (übergeben, gegenwart, Antrag-annehmen mit Geld), 4+ schlechte je Epoche.
2. **Offene Versprechen:** ERBE-Nachspiel nach Partieende (mehrfach angekündigt, nicht gebaut); Versiegelung gehört in den Kern (4-Zeilen-Kernbitte offen); ton/name-LIESMICH stale.
3. **Kopplungsrisiken** (alle bewusst, aber fragil): NAME→FUHRE-Protokolltexte (Regex), ERBE→`bindung.womit`-Wortliste (Regex), FUHRE→STADT-Platzordnungs-Konstanten (3,5 %/2,4 %), FUHRE-Monkey-Patch auf `B.knopf`.
4. Zusatz-Dateien (`*-zusatz.js`) sind bei allen drei Stücken leere Parallelsicherungs-Stummel (nur FUHRE/…-Kommentar, kein Code).