# DER EPOCHENBOGEN — was von einer Zeit in die nächste geht, und was fällt

*Richtungsentscheidung des Auftraggebers vom 3. August 2026, mit Civilization VII
als ausdrücklichem Vorbild. Dieses Papier ist ein **Auftrag für den Loop**, kein
Entwurf der Aufsicht. Was hier steht: die recherchierte Vorlage, der gemessene
Ist-Zustand, und die Fragen, die ein Builder und ein blinder Kritiker
beantworten müssen. Die Antworten stehen hier NICHT — wer sie hier hineinschreibt,
hat den blinden Kritiker abgeschafft.*

---

## 1 — Der Anlass: der Bogen ist gebaut, aber unerreichbar

Am 3. August gemessen: die vier Epochen decken 1350–2025 lückenlos ab, und der
Epochenwechsel **existiert** — `kern/uhr.js:173` schaltet beim Jahreswechsel um
und meldet „Eine neue Zeit: Die Ordnung. Es geht ums Besitzen."

| Nr | Name | Jahre | Kernverb | Länge |
|---|---|---|---|---|
| I | Das Recht | 1350–1516 | überleben | 166 Jahre |
| II | Die Ordnung | 1517–1799 | besitzen | 283 Jahre |
| III | Die Maschine | 1800–1913 | skalieren | 114 Jahre |
| IV | Die Marke | 1914–2025 | bedeuten | 112 Jahre |

**Erreicht wird der Wechsel nie.** Gemessen: eine Partie endet nach **3 Jahren**
(nur WEITER gedrückt, ~100 Klicks, `keine-abnehmer`), sorgfältig gespielt nach
**14 Jahren**. Die kürzeste Epoche ist 112 Jahre lang. Der Bogen ist Mechanik,
keine Erfahrung. `?epoche=1..4` ist ein Einstiegspunkt zum Anschauen.

**Die Entscheidung des Auftraggebers:** das Spiel soll *nicht* über Jahrhunderte
laufen. Stattdessen Epochen nach Civ-7-Art — jede mit eigenen Eigenschaften,
mit einer Übergabe, die Motivation trägt, und einem Zurücksetzen, das Raum
schafft.

---

## 2 — Die Vorlage: wie Civilization VII es macht

Recherchiert am 3. August 2026. Civ VII hat **drei Zeitalter** (Antiquity,
Exploration, Modern). Am Ende jedes Zeitalters steht eine **Krise** mit einem
gescripteten Ereignis, dann der **Age Transition**.

**Was bleibt:**
- **Der Ort.** Wo Städte gegründet wurden, bleibt. Flusslage, Küste, Berg,
  Naturwunder — die Wahl des Platzes ist das Dauerhafteste im Spiel.
- **Zeitlose Bauten**: Wunder, einzigartige Viertel, einzigartige Verbesserungen.
  Sie sind vom Übergang ausgenommen.
- **Kommandanten** behalten Erfahrung und Beförderungen.
- **Traditionen**, über den Zivilbaum freigeschaltet, bleiben als Politikkarten
  verfügbar.
- Die Hauptstadt bleibt Stadt.
- Gebäude und Verbesserungen gehen nicht verloren.

**Was zurückgesetzt wird:**
- **Alle Städte außer der Hauptstadt werden wieder Ortschaften.** Man kann sie
  mit Gold zurückverwandeln — oder man hat das Wirtschafts-Goldenes-Zeitalter,
  dann bleiben sie Städte.
- **Gewöhnliche Gebäude veralten** und verlieren ihre Nachbarschaftsboni.
- **Fast alle Einheiten** werden aufgelöst und durch ein Grundheer von etwa
  sechs Einheiten des neuen Zeitalters ersetzt. Kommandanten überleben.
- **Technologie- und Zivilbaum sind je Zeitalter eigen** und werden nicht
  übernommen. Sozialpolitiken und Kodizes sind weg.
- Stadtstaaten und Unabhängige verschwinden, samt Schutzherrschaft.
- Kriege enden, Heere kehren heim.

**Wie die Übergabe verdient wird — Legacy Paths.** Je Zeitalter gibt es vier
Pfade (Wirtschaft, Kultur, Militär, Wissenschaft), jeder misst eine konkrete
Größe (gebaute Wunder, Städte im Reich, …). Fortschritt schaltet bis zu drei
**Meilensteine** frei; jeder gibt **Legacy-Punkte** und eine **Legacy**. Beim
Übergang wählt man daraus bis zu drei **Widmungen**.

- **Mindestens ein Pfad ganz abgeschlossen → Goldenes Zeitalter**: mehr und
  bessere Optionen für den Übergang.
- **Auf keinem Pfad Fortschritt → Dunkles Zeitalter**: starke Boni, aber mit
  Nachteilen verkoppelt.

Der Kern der Vorlage in einem Satz: **man verdient sich, was man mitnimmt, und
der Rest fällt — damit die nächste Zeit wieder eine Zeit mit Entscheidungen ist
und nicht die Fortsetzung einer gewonnenen.**

---

## 2b — Was an Civ 7 zerrissen wurde, und was davon uns betrifft

*Einwand des Auftraggebers: Civ 7 hat für dieses System viel Kritik bekommen —
teils vielleicht aus Gewohnheit an die Vorgänger. Wir bauen ein neues Spiel ohne
diese Vorgeschichte. Also getrennt betrachtet.*

**Die Kritik, in der Reihenfolge ihrer Lautstärke:**
1. Die Übergänge seien **abrupt und bestrafend** — „es fühlt sich an, als finge
   ich ohne jeden Übergang von vorn an".
2. **Verlorene Arbeit.** Ein Spieler baut eine große Flotte, und beim Übergang
   bleibt ein Schiff übrig. Übergänge kommen zum ungünstigen Moment und brechen
   laufende Vorhaben ab.
3. **Der Fluss des Aufbaus bricht.** Das Gefühl, eine Zivilisation durch die
   Zeiten zu führen, gehe verloren.
4. **Erzwungener Identitätswechsel.** Man muss beim Übergang eine neue
   Zivilisation wählen. „Nicht dieselbe Zivilisation über das ganze Spiel zu
   führen, ist ein absolutes Ausschlusskriterium."
5. **Gutes frühes Spiel wird bestraft**, und das erzwingt Meta-Spiel: manche
   spielen absichtlich schlecht auf den Übergang zu.

**Was Firaxis daraufhin selbst geändert hat** — das ist das belastbarste Signal,
weil es zeigt, welche Kritik die Entwickler anerkannt haben. Mit dem
**„Test of Time"-Update vom 19. Mai 2026**: der **Zivilisationswechsel wird
optional**, man kann eine Zivilisation durch das ganze Spiel führen; dazu
*Syncretism* und *Affirmation*, um beim Bleiben trotzdem etwas zu gewinnen.
Siege und Legacy Paths wurden überarbeitet.

> **Sie haben Punkt 4 kassiert — und die Zeitalter behalten.** Das System als
> solches wurde nicht zurückgenommen, nur der erzwungene Identitätswechsel.

**Was davon auf das Brauhaus zutrifft — und was nicht:**

| Kritik | Trifft uns? |
|---|---|
| **4. Erzwungener Identitätswechsel** | **Nein, strukturell nicht.** Es ist immer dasselbe Haus, an demselben Ort, in derselben Familie — `kern/orte.js` schreibt das fest. Die lauteste Beschwerde von Civ 7, und die einzige, die Firaxis zurückgenommen hat, kann hier gar nicht entstehen. |
| **3. Der Fluss bricht** | **Teils Gewohnheit.** Wer 30 Jahre eine Zivilisation durch alle Zeitalter geführt hat, erlebt einen Schnitt als Verlust. Neue Spieler eines neuen Spiels haben diese Erwartung nicht. **Aber** der Wunsch, dass Aufbau sich lohnt, ist keine Gewohnheit, sondern der Grund, warum man spielt. |
| **2. Verlorene Arbeit** | **Ja, voll.** Das ist unabhängig von jeder Vorgeschichte. Wer einen Keller füllt und ihn beim Übergang verliert, ohne es kommen zu sehen, hört auf. |
| **1. Abrupt und bestrafend** | **Ja, voll.** Ein Übergang, der nicht angekündigt ist und auf den man sich nicht vorbereiten kann, ist kein Übergang, sondern ein Unfall. |
| **5. Gutes Spiel wird bestraft** | **Ja, und hier besonders gefährlich.** Dieser Lauf misst seine Wirtschaft an einer **zweiseitigen** Latte, die weder Davonlaufen noch Zusammenbrechen erlaubt. Ein Zurücksetzen, das gerade den Erfolgreichen trifft, ist genau der Hebel, mit dem man ρ künstlich schön macht, ohne dass das Spiel besser wird. |

**Die Lehre für den Auftrag, in einem Satz:** Das Zeitalter-System ist nicht das
Problem — der *unangekündigte, unvorbereitbare, den Erfolg bestrafende* Schnitt
ist es. Wer hier baut, baut die **Ankündigung und die Vorbereitung** zuerst und
den Schnitt danach.

**Drei harte Auflagen, die aus dieser Kritik folgen und für den Kritiker gelten:**
1. **Nichts fällt unangekündigt.** Der Spieler muss vorher am Schirm sehen
   können, was die nächste Zeit nicht mitnimmt — früh genug, um zu handeln.
   Abnahme: die Ankündigung ist messbar N Züge vor dem Schnitt sichtbar.
2. **Kein Übergang bricht ein laufendes Vorhaben ohne Ausweg ab.** Wer einen Bau
   oder einen Sud angefangen hat, muss ihn abschließen oder auslösen können.
3. **Der Schnitt darf den Erfolgreichen nicht härter treffen als den
   Erfolglosen.** Zu messen an derselben Kennzahl wie Latte 2 — Barschaft gegen
   Preis des nächsten Zuges, über den Übergang hinweg, in beiden Fällen.
   Wird die Kennzahl *durch das Zurücksetzen* geglättet statt durch besseres
   Spiel, ist die Latte betrogen und das Stück fällt durch.

---

## 3 — Was das Brauhaus dafür schon hat (gemessen, 3. August, Stand `da7d690`)

Nichts hiervon ist Vorschlag; es ist Inventur.

**Kandidaten für „bleibt":**

| Vorhanden | Wo | Entspricht bei Civ 7 |
|---|---|---|
| **Alle vier Epochen zeigen DENSELBEN ORT** — strukturell festgeschrieben | `kern/orte.js:5` | der Städteplatz, das Dauerhafteste |
| **Bauten im Hof: „gebaut wird einmal, es steht auch für die Enkel"**, 4–7 je Epoche am Schirm | `stadt:bau*`, am Schirm gezählt | zeitlose Bauten |
| **DAS REGISTER**: datierte Urteile Fremder, nur wachsend, nichts löschbar | `stuecke/name.js` | Ruf, der nicht zurückgesetzt wird |
| **DAS ERBE** samt Erbfall | `stuecke/erbe.js` | die Übergabe selbst |
| **Die Amtszeit**: benannte Person, Jahre, eine von sechs Eigenschaften (sparsam, wagemutig, fromm, streitbar, gelehrt, bequem) | `welt.zeit.amtszeit` | der Kommandant, der Erfahrung behält |

**Kandidaten für „fällt":**

| Vorhanden | Wo |
|---|---|
| Kasse, Rohstoff, Fässer, Plätze — je Epoche eigene Startwerte (112 / 640 / 14.250 / 86.000) | `kern/welt.js:140` |
| Sorte und Haltbarkeit wechseln hart: Grutbier 5 → Braunbier 9 → Lagerbier 22 → Pilsner 40 | `kern/welt.js` EPOCHEN |
| Lagername wechselt: Keller → Gewölbe → Eiskeller → Tanks | dito |
| Die Adressen der Stadt, die Gegner | `welt.adressen`, `welt.gegner` |

**Der Ansatz eines Technologiebaums ist da, wird aber kaum benutzt.**
Es gibt zwei einbahnige Systeme: **unwiderrufliche Festlegungen** (die
Lindesche Kältemaschine tötet „Natureis aus dem Fluss" dauerhaft; Betriebslabor,
Kieselgurfilter, Reinheit) und **Bauten, die für die Enkel stehen**. Aber der
blinde Kritiker hat am 3. August gemessen: **in 14 Jahren werden nur 1 / 1 / 0 / 0
Festlegungen wirklich genommen, obwohl acht möglich wären.** Ein Baum, in den
niemand klettert.

**Und ein Widerspruch, der genau hier sitzt:** die Amtszeit wechselt alle zwei
Jahre (`erbe-daten.js:315`), während eine Karte verspricht, die Person „führt das
Haus bis 1636" (`preis.js:1729`). Die Generationenebene ist gebaut und stimmt
nicht mit sich selbst überein.

---

## 4 — Die Fragen an den Loop. Die Antworten gehören NICHT in dieses Papier.

**(A) Wie lang ist eine Epoche, damit man sie erlebt?**
Heute: Partie endet nach 3–14 Jahren, Epoche dauert 112–283 Jahre. Was ist die
Einheit — Amtszeiten? Braujahre? Ein Fortschrittsbalken wie in Civ 7, der die
Epoche beendet, wenn genug geschehen ist, statt nach Kalender? Miss, wie lange
eine gut geführte Partie *tatsächlich* trägt, bevor du eine Zahl setzt.

**(B) Was wird mitgenommen — und wie wird es VERDIENT?**
Civ 7 verschenkt nichts: die Übergabe hängt an Meilensteinen. Was sind die
Meilensteine des Brauhauses? Der Ort und das Register liegen nahe, weil sie
schon nicht löschbar sind. Aber: *wofür* entscheidet sich der Spieler beim
Übergang, und was kostet ihn diese Wahl?

**(C) Was fällt — und warum tut das nicht bloß weh?**
Ein Zurücksetzen, das nur ärgert, ist schlechtes Design. Bei Civ 7 fällt, was
sonst die nächste Zeit entwertet. Was entwertet im Brauhaus die nächste Epoche,
wenn es bleibt? Der Keller voll Grutbier in einer Zeit, die Pilsner trinkt?
Die Bindung an eine Adresse, die es nicht mehr gibt?

**(D) Was ist das Ziel je Epoche?**
Die Kernverben stehen schon da: **überleben · besitzen · skalieren · bedeuten.**
Das ist ein sehr guter Anfang und es steht bereits im Quelltext. Was fehlt, ist
die messbare Größe daneben — Civ 7 misst „gebaute Wunder", „Städte im Reich".
Was misst „überleben"? Was misst „bedeuten"? Und woran sieht der Spieler es *im
Spiel*, nicht im Handbuch?

**(E) Goldene und dunkle Zeit?**
Civ 7 belohnt einen abgeschlossenen Pfad und bestraft einen leeren mit starken,
aber verkoppelten Boni. Trägt das hier — ein Haus, das seine Zeit verpasst hat
und mit Schulden und einem harten Vorteil in die nächste geht?

**(F) Der Baum, in den niemand klettert.**
Bevor ein neuer Technologiebaum gebaut wird: warum werden die vorhandenen
Festlegungen in 14 Jahren nur ein- bis nullmal genommen? Das ist zuerst eine
Messfrage, keine Entwurfsfrage. Wer hier baut, ohne das gemessen zu haben,
baut ein zweites ungenutztes System neben das erste.

**(G) Fehlt eine fünfte Zeit — die Gegenwart?**
*Frage des Auftraggebers vom 4. August 2026: „Seit 1970 hat sich doch bestimmt
noch einiges verändert. Und es würde das Spiel auch in die heutige Zeit
transportieren."* Die Aufsicht hat dazu gemessen, nicht entworfen:

| Befund | Beleg |
|---|---|
| Epoche IV **beansprucht** 1914–2025 | `kern/welt.js:39` |
| Ihr Schaujahr ist **1970** | dito |
| Eine Partie trägt 3–14 Braujahre | Messung 3. 8., Frage (A) |
| ⇒ **Kein Spielstand erreicht je ein Jahr nach ~1984.** Die letzten vierzig Jahre sind beansprucht und unbetretbar. | Rechnung aus beidem |
| Die Währungstabelle hält D-Mark bis 2001 und Euro bis 9999 bereit — für Jahre, die niemand sieht | `kern/welt.js:51` |
| Der **Regalmeter** — Handelsmacht, Listung, Einkaufspreis — liegt heute in **1970** | `stuecke/fuhre.js:2072` |

**Und das Konzept hat den Befund selbst schon notiert**, im eigenen
Korrekturteil (`KONZEPT.md`, „Drei Korrekturen an früheren Abschnitten"):

> „Das Brauereisterben war ein Verdrängungskampf um Zapfhähne, nicht um
> Identität. *Bedeuten* ist das Kernverb der **Gegenwart**, nicht der 1970er —
> was zugleich erklärt, warum Epoche IV in allen sechs Entwürfen nur Epoche III
> mit anderer Typografie war."

Die Frage an den Loop ist deshalb **nicht** „hängen wir eine fünfte an", sondern:
**trägt Epoche IV zwei Verben, und ist sie deshalb zu groß?** Wer sie teilt,
muss beides beantworten — welches Verb 1970 bekommt, wenn *bedeuten* in die
Gegenwart wandert, und woran der Spieler den Unterschied **auf dem Schirm**
merkt, nicht im Handbuch.

**Was eine fünfte Zeit kostet, gemessen — damit niemand „ist ja nur eine Zeile"
sagt:** in `kern/welt.js` ist es wirklich eine Zeile. Aber **25 Datentabellen
in acht Dateien tragen einen Schlüssel `4:`** (NAME 9, FUHRE 5, GEGNER 3, SUD 3,
STADT 2, ERBE 1, PREIS 1, welt 1), dazu vier Stellen in `kern/ton.js`. Jede
dieser Tabellen fällt per `|| [4]` **still** auf Epoche IV zurück. Eine fünfte
Epoche ohne eigenes Material wäre also lautlos genau der Fehler, den das Konzept
schon benannt hat: dieselbe Epoche mit anderer Typografie. Dazu kommen ein
Zielbild (erste Messlatte) und ein Klangbild, das ein fremdes Ohr in 30 Sekunden
benennen kann (dritte Messlatte) — was heute nicht einmal für 1884 gelingt.

**Reihenfolge, die die Aufsicht daraus liest:** Frage (G) hängt an Frage (A).
Solange eine Partie 14 Jahre trägt und die kürzeste Epoche 112 Jahre dauert,
ändert eine fünfte Epoche am *Gespielten* nichts — sie fügt einen fünften
Einstiegspunkt zum Anschauen hinzu. Erst der Bogen, dann die Gegenwart.

---

## 5 — Warum das nicht nebenbei in Welle 4 passiert

Diese Änderung **stellt den Auftrag neu**, sie bessert ihn nicht aus. Sie
berührt `kern/uhr.js`, `kern/welt.js`, DAS ERBE, DIE STADT, DER PREIS und DER
NAME zugleich — also die Kerndateien und fünf Stücke. Welle 4 hat vier laufende
Stücke mit offenen Auflagen; die Wellenzahl (|rho| < 0,7 in allen vier Epochen)
ist noch nicht erreicht.

**Empfehlung der Aufsicht:** eigene Welle, ein Stück, ein Builder, ein blinder
Kritiker — und der erste Auftrag ist **messen, nicht bauen**: Frage (A) und
Frage (F). Erst wenn feststeht, wie lange eine Partie trägt und warum der
vorhandene Baum leer bleibt, hat ein Entwurf einen Boden.

---

## Quellen der Recherche

- [Civilization VII Ages — CivFanatics](https://civfanatics.com/civ7/civ-vii-gameplay-mechanics/civilization-vii-ages/)
- [Age (Civ7) — Civilization Wiki](https://civilization.fandom.com/wiki/Age_(Civ7))
- [Legacy Path (Civ7) — Civilization Wiki](https://civilization.fandom.com/wiki/Legacy_Path_(Civ7))
- [Everything that happens in a Civilization 7 age transition — PC Gamer](https://www.pcgamer.com/games/strategy/civilization-7-age-transition-effects/)
- [The unofficial Civilization 7 manual — PC Gamer](https://www.pcgamer.com/games/strategy/civilization-7-guide-to-unexplained-systems-faq/)
- [Civ 7 Legacy Paths Explained — Game8](https://game8.co/games/Civ-7/archives/497204)
- [How Does The Ages System Work In Civilization 7? — TheGamer](https://www.thegamer.com/civilization-7-guide-to-the-age-system/)
- [Civilization 7 Players Aren't Enjoying The New Age System — TheGamer](https://www.thegamer.com/civilization-7-players-not-enjoying-age-system-resets/)
- [New Civilization 7 update makes the controversial Ages system way better — PCGamesN](https://www.pcgamesn.com/civilization-vii/changes-ages-system)
- [Civ 7 ditches controversial age-switching in landmark update — GAMES.GG](https://games.gg/news/civ-7-test-of-time-update/)
- [Feedback on Civilization VII: Crises, Ages, and Strategic Freedom — CivFanatics Forums](https://forums.civfanatics.com/threads/feedback-on-civilization-vii-crises-ages-and-strategic-freedom.699591/)
- [I'm Already Playing Civ 7 In The Worst Way Possible — ScreenRant](https://screenrant.com/civ-7-age-transition-war-manipulation-bad-op-ed/)
