# Stimme: Der Produktionsrealist

**Mein Maßstab, damit man mich nachprüfen kann.** Ich prüfe drei Fragen und sonst nichts:

1. **Wie viele Arbeitswochen bis zur ersten abnehmbaren Saison?** Abnehmbar nach den Kriterien, die im Repo bereits stehen — Technik-Votum §5 (zwanzig Minuten, der Reichweiten-Kompromiss zweimal freiwillig) und Fuhre-Vorschlag §8 (erste Fuhre in sechzig Sekunden ohne Erklärtext).
2. **Wie viel vorhandenes Kapital bleibt nutzbar?** Kapital heißt hier: die Recherche (`design/REFERENZEN.md`, über 10 000 Wörter), das Marktmodell (KONZEPT §13), zwei gebaute Prototypen samt ihrer *bezahlten Negativbefunde*.
3. **Wo landet das Polish-Budget, und welcher Weg sieht mit demselben Budget am fertigsten aus?**

Eine Arbeitswoche heißt bei mir: Abende plus ein Wochenendtag, rund zwölf konzentrierte Stunden, KI-Werkzeuge eingerechnet. Das ist derselbe Takt, in dem das Technik-Votum „vier bis sechs Abende" und „sieben bis zwölf Tage" gerechnet hat (§5, §8).

---

## 1. Die drei Wege, in Wochen

| Weg | Bis zur abnehmbaren Saison (eine Epoche) | Wiederverwendbar aus dem Repo |
|---|---|---|
| **(a) Fuhre-Bühne weiterbauen** | **10–14 Wochen** | fast alles |
| **(b) Bier-Manager** | **6–10 Wochen** | Modell, Recherche, Befunde — ca. 80 % |
| **(c) PR-Manager** | **14–20 Wochen** | Methode und Code-Skelette — unter 10 % |

**(a) Die Fuhre.** Ihr eigener Vorschlag rechnet die Posten in §7 selbst vor: „Die Bühne muss animiert sein, sonst ist sie eine Behauptung" (1–2 Wochen für Wagen, Rauch, Betten), und „Drag-and-Drop ist die teuerste Bedienform im Browser" — mit dem gleichberechtigten Klickweg, Touch und Tastatur ehrlich 2–3 Wochen. Danach kommen die Systeme trotzdem: Wochenschleife, Sommer-Zeitraffer, Michaeli-Blatt, Gegner, Balancing — der Spieldesigner hat für die reine Systemstufe notiert, sie koste „ungefähr so viel Arbeit wie der gesamte bisherige Dummy" und erzeuge „kein einziges neues Bild" (Votum §7). Zusammen 10–14 Wochen, und die Bühne ist dabei der Posten, der am wenigsten über das Spiel beweist.

**(b) Der Bier-Manager.** Hier ist die Nachricht, die dieses Verfahren noch niemand ausgesprochen hat: **Das Repo hat den Manager längst gebaut, nur ohne ihn so zu nennen.** `welle2-gegenueber` ist sechs Bildschirme aus Tabellen, Papier und einer roten Handschrift — das Technik-Votum nennt ihn den schnellsten Weg zu etwas Spielbarem („vier bis sechs Abende", §8), und seine sechs Blätter *sind* Manager-Bildschirme. Die Übersetzung kostet keine Erfindung: Spieltag = Fuhre, Tabelle = die hl-Reihen der Häuser (210 · 180 · 140 stehen im `klickdummy.html` schon als Daten), Kader = Adressen mit Verträgen, Transfermarkt = die **Ablösung** — KONZEPT §13 benutzt wörtlich das Vokabular des Transfermarkts samt Ablösesumme —, Nachrichten = die Zettel der Wirte, Saisonende = Michaeli, WEITER = Wagen abschicken. Sogar der Kader über Generationen steht schon da: „Das ist die Kaderlogik des Eishockey-Managers, gestreckt über Jahrhunderte" (KONZEPT §4). Neu zu bezahlen ist nur das UI-Design des Formats (Hauptblatt, Navigation, Saisonabschluss: 1–2 Wochen), die Saisonschleife auf dem vorhandenen 1884er-Modell (2–3), Gegner und Balancing (2–3), Polish (1–2). Wiederverwendbar: das komplette Zahlenmodell aus zwei Prototypen (`klickdummy.html`, 1 539 Zeilen; `demo/index.html`, 1 472 Zeilen), der im zweiten Prototyp bewiesene Fünfakter, das Marktmodell, die Referenzen, die Signete und Webfonts, die Prüfsteine des Spieldesigners (§6) als fertige Abnahmekriterien.

**(c) Der PR-Manager.** UI-Kosten wie (b) — aber davor liegt alles, was im `design/`-Ordner sichtbar Monate gekostet hat, noch einmal von null: drei Entwurfswellen, sechs Personas, vier Jury-Voten, ein Fachgutachten waren nötig, bis das Bier-Marktmodell den Befund „Es gibt kein Gegenüber" (KONZEPT §13) überstanden hatte. Für die PR-Agentur existiert nichts davon: kein Marktmodell, keine Recherche, keine belegten Zahlen, kein historischer Anker, keine getestete Persona. 6–10 Wochen Konzeptarbeit, nur um dort zu stehen, wo Bier heute steht — und die erste Fassung wird so falsch sein wie die erste Fassung des Biermodells, denn erste Fassungen sind das immer. Macht 14–20 Wochen, mit dem größten Unsicherheitsband der drei.

---

## 2. Die Epochenrechnung

Jede Epoche multipliziert alles, was teuer ist: Assets (das Technik-Votum rechnet vor, dass 22 Einbauten für vier Epochen „etwa eine Epoche zu knapp" sind und ein Giebel von 1350 nicht das Profil von 1884 hat, §1), Ereignisse, Text, und — am schlimmsten — Balancing, „die eine Tätigkeit in diesem Projekt, die KI-Unterstützung nicht verkürzt" (§6). Das ist kein Faktor vier, sondern mehr, weil die Epochen aneinander abgeglichen werden müssen.

Und die Entwürfe haben längst abgestimmt: **„19 von 30 Blättern spielen in den 1880ern, Epoche II bekam ein einziges"** (KONZEPT §6). Drei Wellen unabhängiger Entwerfer haben das Material dorthin getragen, wo es steht. Das Technik-Votum zieht die Konsequenz unter der Überschrift, woran das Projekt realistisch stirbt: „am zweiten Epochenaufguss, nicht am Anfang" — „Zwei gebaute Epochen mit einer erzählten Brücke sind ein fertiges Spiel. Vier halbgebaute sind keines" (§6). Ich gehe eine Stufe weiter: **Eine Epoche, richtig, ist ein fertiges Spiel** — zumal die 1880er als einziges Jahrzehnt eine eingebaute Saisonstruktur haben (das Braujahr Michaeli–Georgi, KONZEPT §7) und deren Sterben durch die Kühlmaschine gleich als Drama mitliefern. Kostenrechnung: eine Epoche richtig ≈ die 6–10 Wochen aus Weg (b); vier Epochen ≈ 35–50 Wochen, von denen die letzten zwanzig in Inhalten liegen, zu denen drei Wellen Entwerfer nichts zu sagen hatten.

---

## 3. Der Neustart-Fluch — und der Ein-Wochen-Test

Hobbyprojekte sterben bei Themenwechseln an einem präzisen Muster: Jeder Neustart kauft den angenehmen Teil zurück (Konzept, erste Bildschirme, das Gefühl von Bewegung) und verschiebt den unangenehmen (Balancing, Inhalt, Fertigmachen) erneut nach hinten. Nach dem dritten Durchlauf der ersten zwanzig Prozent ist die Energie verbraucht, und es existiert dreimal nichts. Das Technik-Votum hat die mildere Form davon schon als Fußnote notiert: Das Projekt kann daran sterben, „dass die Entwurfsphase zu gut ist" (§6).

Wann ist ein Wechsel trotzdem billiger? **Wenn das Entwertete der teure Teil war.** Genau deshalb sind die beiden anstehenden Wechsel nicht gleich: Die zwei Prototypen haben die *Oberfläche* widerlegt — „Das technische Blatt ist ein Berichtsformat, kein Bedienformat" (Fuhre §1) —, aber das Modell und das Thema ausdrücklich bestätigt: „Der Fünfakter trägt", „Die Bauteilrechnung stimmt" (ebd.). Der **Formatwechsel** zum Manager wirft also das Widerlegte weg und behält das Bewiesene: billig, angezeigt. Der **Themenwechsel** zu PR wirft das Bewiesene weg und behält nichts: teuer, unbegründet — „spannender" ist das Wort, mit dem sich das Ungebaute immer anfühlt.

Der Test, der die Themenfrage in einer Woche statt in einem Jahr beantwortet, nach dem Vorbild des Wandtests (Technik-Votum §5, „kostet nichts"): **Montag bis Mittwoch** ein einziger Manager-Hauptbildschirm Bier als statisches HTML — Tabelle der acht Adressen mit den echten hl-Reihen aus dem Klickdummy, ein Zettel, ein WEITER-Knopf, drei Spieltage verdrahtet. **Donnerstag und Freitag** derselbe Bildschirm für die PR-Agentur, so weit man kommt. Die Messgröße ist keine Meinung, sondern zählbar: **Jede Zahl, die man für den PR-Bildschirm erfinden muss, während sie für Bier im Repo steht, ist ein Punkt gegen PR.** Samstag zwanzig Minuten spielen. Welcher Bildschirm erzeugt von selbst den Wunsch nach einer zweiten Saison?

---

## 4. Was „AAA, fünf Sterne" produktionsseitig heißt

Polish ist kein Zustand, sondern ein Budget, und es wirkt pro Bildschirm. Fünf Sterne auf Steam bekommen kleine fertige Spiele, nicht große halbe — die Rezension schreibt der Eindruck von *Vollständigkeit*, nicht der von Größe. Daraus folgt: Das Budget gehört (1) in die erste Minute — der Fuhre-Vorschlag hat den Maßstab geliefert: „Dreißig Sekunden bis zum ersten verstandenen Erfolg" (§4), der übernommen wird, egal welches Format; (2) in die Standardansicht, die der Spieler neunzig Prozent der Zeit sieht; (3) in die Schrift — das Technik-Votum hat vorgeführt, dass „der Webfont besser ist als das, was das Modell liefern wollte" (§2); (4) in die zweihundert Millisekunden nach WEITER: was sich sichtbar und hörbar bewegt, während die Woche verrechnet wird. Das ist der ganze Herzschlag eines Managerspiels.

Das Manager-Format erreicht mit demselben Budget den höchsten wahrgenommenen Fertigstellungsgrad, weil es die wenigsten Bildschirme hat und jeder davon aus den billigsten Zutaten besteht, die es gibt: Typografie, Abstand, Zahl. Die eine Gefahr des Formats hat das Technik-Votum am Gegenüber-Pfad benannt: „Wer zwanzig Stunden spielt, sieht sehr viele Zeilen" (§2). Das Gegenmittel ist bereits bezahlt — die Gegenstände der Fuhre (Zettel mit Absender, Signete, Fässer als Zählzeichen) werden die Haut der Manager-Blätter, nicht deren Ersatz.

---

## 5. Die drei Antworten

**Thema: Bier.** Achtzig Prozent Wiederverwendung gegen unter zehn; ein Marktmodell, das sechs Personas überlebt hat, gegen keines; und ein Produkt, das in Hektolitern zählbar ist, gegen eines, dessen Kern — Bedeutung in fremden Köpfen — genau die Größe ist, an der schon das Biermodell fast gescheitert wäre. Wer PR trotzdem will, soll es den Ein-Wochen-Test gewinnen lassen.

**Format: Manager.** Der Instinkt des Auftraggebers ist richtig, und er ist keine Kehrtwende: Eishockey Manager steht im KONZEPT als erstes Vorbild (§2), die Kaderlogik steht in §4, der Transfermarkt heißt in §13 Ablösung. Das Format war immer da; nur die Oberfläche hat es zwei Prototypen lang verfehlt. Die Bühne wird nicht gebaut; ihre Gegenstände ziehen als Ausstattung in die Blätter um.

**Epochen: eine, fest — die 1880er.** Gebaut so, dass eine zweite später andocken kann (Ereignisse speichern, keine Zustände — Technik-Votum §3), aber versprochen wird nur eine. Vier Epochen sind der dokumentierte Projekttod.

---

## Der Preis meines Urteils

**Erstens:** Ich opfere die Bühne — den einzigen Entwurf, der „es gibt einen Raum" einlöst — und damit Wärme, die vier von sechs Testpersonen verlangt haben. Zettel, Signet und Schrift sind das gesamte verbleibende Wärmebudget; das kann zu wenig sein. **Zweitens:** Eine Epoche heißt, die Sieben-Jahrhunderte-Idee, das eigentliche Alleinstellungsmerkmal dieses Konzepts, auf unbestimmte Zeit stillzulegen — möglicherweise für immer, denn ausgelieferte Spiele werden selten verlängert. **Drittens:** Ich optimiere, wie das Technik-Votum vor mir, darauf, dass dieses Spiel existiert, nicht darauf, dass es das größte denkbare ist. Wenn die Motivation des Auftraggebers an der großen Vision hängt und nicht am Fertigwerden, dann tötet mein sicherer Weg das Projekt genauso — nur leiser.

---

## Die Schlussfrage — ein Satz

> **Baue in einer Woche den einen Manager-Bildschirm mit den Zahlen, die du schon hast — und wenn du für die PR-Agentur jede dieser Zahlen erfinden musst, weißt du, welches Thema dein Spiel ist und welches nur deine nächste Flucht nach vorn.**

*Gezeichnet: der Produktionsrealist. Gerechnet wurde in Arbeitswochen, nicht in Wünschen.*
