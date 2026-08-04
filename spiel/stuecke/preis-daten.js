/* ===========================================================================
   stuecke/preis-daten.js — DER PREIS.  Die Michaelitafel.
   Besitzstand DER PREIS: stuecke/preis*.js · stil/preis*.css · bild/preis/**

   Hier steht, WAS zu Michaeli auf dem Tisch liegt. Wie es gerechnet wird,
   steht in preis.js.

   DREI REGELN, DIE DIESE DATEI TRAEGT
   1. Die Listen der vier Epochen haben KEINEN gemeinsamen Eintrag. Ein
      Felsenkeller ist kein Gewoelbekeller mit anderem Namen; eine Dosenlinie
      ist kein Ochsenstall in Blech. Wer 1350 und 1970 nebeneinanderlegt, darf
      nichts wiedererkennen ausser dem Ort.
   2. Die Groessen sind absichtlich ungleich. 'anteil' ist der Preis als
      Vielfaches des Anschlags — 0,07 neben 1,9 ergibt Buendel, nicht ein
      Kreuzchen mit drei Feldern.
   3. Die Bierordnung steigt in JAHRZEHNTEN um ein Zehntel (rund ein
      Hundertstel im Jahr), der Anschlag um vier Hundertstel im JAHR. Die
      Schere geht also mit rund drei Hundertsteln im Jahr auseinander und ist
      nach vierzig Jahren gedeckelt — dann ist alles gut dreimal so teuer,
      waehrend das Fass um die Haelfte mehr faengt. Das ist die eine Zahl, an
      der ein Wirtschaftsspiel gegen Patrizier IV verliert. Sie muss FALLEN,
      und sie darf nicht auf null fallen: eine Tafel, auf der jahrzehntelang
      nichts mehr erreichbar ist, ist so tot wie eine, auf der alles geht.

   SPERRLISTE beachtet: offene Pfanne, kein Helm, kein Rohr (1350/1600) ·
   Hopfen erst ab 1380 als Entscheidung, nie 1350 gesetzt · Emailschild erst
   ab 1893 · keine Bahn vor 1835 · Anteile immer auf die EIGENE Menge.
   =========================================================================== */

var PREIS_DATEN = {

  /* Wie viele Angebote je Michaeli nebeneinander liegen. Nie weniger als drei,
     sonst ist es keine Wahl. */
  angeboteJeJahr: 4,

  epochen: {

    /* ==================================================================
       I — 1350 bis 1516.  DAS RECHT.
       Klein, koerperlich, rechtlich. Alles kostet Pfennige, und der Rat
       hat die Hand auf dem Preis.
       ================================================================== */
    1: {
      einheit: 'Fass', mitte: 9, spanne: 3,
      sagt: 'Der Rat setzt den Bierpfennig. Wer darüber geht, wird gestraft.',

      stil: 'pergament',
      tag: 'Michaeli',
      tagSatz: 'Am Michaelistag, dem 29. September, wird fällig, was das Jahr über gestundet war. '
             + 'Danach steht die Pfanne wieder kalt, bis der Zins bezahlt ist.',
      anschlagSatz: 'Der Anschlag ist die Schätzung des Rats: was durch das Haus geht und was im Haus liegt. '
                  + 'Böttcher, Maurer und Grutherr rechnen mit derselben Zahl.',

      rechtSatz: 'vom Rat verliehen',
      grund: 470,
      lastenGrund: 500,
      teuerungJahr: 1.040,
      teuerungKauf: 1.045,
      /* DREI WURZELN (siehe preis.js, `lastenBasis`).
         lastenFest  — Erbzins und Wasserzins, in Pfennig, laufen immer.
         pflichtUmsatz — Grutgeld und Mahlgeld je Fass durch das Haus.
         pflichtErtrag — der Schoss, den der Rat nach der Nahrung veranlagt.
         nachlass     — was der Rat nach einem Fehljahr vom Festen erlaesst. */
      /* lastenFest war 62 Pf gegen eine Michaeli-Kasse von 112 Pf: die
         feste Last allein nahm 55 im Hundert der ganzen Barschaft, jedes
         Jahr, steigend. In 1600 sind es 16, in 1884 sechs. Am Bildschirm
         gemessen (Rechnungsspalte 1359): Erbzins 55 und Wasserzins 34
         gegen 187 Pf Ausstoss. Ein Erbzins auf ein Braugerechtsame war
         ein fester kleiner Betrag, kein halbes Jahreseinkommen. */
      lastenFest: 26,
      pflichtUmsatz: 0.052,
      /* Der Schoss stand auf 0,55 — von allem, was ein Braujahr uebrig liess,
         nahm der Rat mehr als die Haelfte, und zwar in der aermsten Epoche.
         Gemessen ueber die sorgfaeltig gespielte Linie nimmt DER PREIS in
         1350 zusammen 15,9 im Hundert des Ausstosses; der Schoss ist davon
         der groesste einzelne Posten und der einzige, der genau das
         abschoepft, woraus ein Haus waechst. Ein Vermoegensschoss lag bei
         einem halben bis einem Hundertstel des geschaetzten Vermoegens im
         Jahr, nicht bei der Haelfte des Zuwachses. */
      pflichtErtrag: 0.32,
      nachlass: 0.55,
      nachlassName: 'Nachlass des Rats auf Zins und Wasser',
      /* DER NOTPFENNIG (siehe preis.js, `buche`). Was der Rat stehen laesst,
         wenn die Rechnung groesser ist als die Lade. Bemessen an dem, was ein
         Sud an Barauslage kostet: Grut, Malz, Holz und der Fuhrlohn fuer
         einen Kessel. Wer das nicht mehr hat, braut nicht mehr, und dann
         bekommt der Rat im naechsten Jahr gar nichts. */
      notpfennig: 48,
      /* Was das Haus unter der vorigen Hand durchgesetzt hat — der Anschlag
         des ersten Michaeli rechnet damit, nicht mit null (siehe preis.js,
         `richteEin`). Rund fuenfzig Fass Grutbier zu neun Pfennig. */
      umsatzAnfang: 150,
      /* DIE NACHFUEHRUNG DES SATZES (siehe preis.js, `nachfuehrung`).
         Wie viel von der Teuerung beim Haus ankommt, ohne dass es etwas
         dafuer baut. Der Biersatz des 14. Jahrhunderts war an den
         Kornpreis gebunden und wurde zwischen den grossen Erneuerungen
         nachgesetzt — aber der Rat setzte ihn spaeter nach, als das Korn
         stieg, und nie ganz: die Buerger sollten billig trinken. */
      satzFolgt: 0.82,
      pflichtHoehe: 0.20,
      /* Die Umlage lag bei 0,80 der Jahreslast und mit `teil` bis 1,85 bei
         dem Anderthalbfachen davon — in der aermsten der vier Epochen die
         hoechste der vier Quoten. Sie hat die Partie 1352, 1355 und 1359
         jedesmal auf null gesetzt. Sie bleibt die Zacke im Verlauf, nur
         nicht mehr das Ende. */
      umlageAnteil: 0.35,
      handlohnAnteil: 1.10,

      /* DIE VIERTE WURZEL, ZUM ZWEITEN MAL — UND SIE STEHT JETZT AUCH HIER.

         WAS GEMESSEN WURDE (Welle 4, Nacharbeit, am eingefrorenen Stand
         da7d690 auf Hafen 8900, 400 Wochen, saat=1350, jeder Klick der Hand
         landet — siehe unten, warum das der schwerere und der richtige Fall
         ist). Die Kennzahl der zweiten Latte, Jahr fuer Jahr:

           5,89 · 1,55 · 4,27 · 2,79 · 5,90 · 4,74 · 10,52 · 41,67 · 26,39
                · 7,05 · 6,88 · 19,27 · 13,67 · 9,20      Spearman +0,701

         Die Barschaft zu Michaeli laeuft dabei von 112 auf 871 Pf, der Preis
         des naechsten umkaempften Zuges nur von 19 auf 56. Der Kritiker hat
         die Ursache mitgemessen: Spearman der Kennzahl gegen die KASSE
         +0,947, gegen den NENNER −0,202. Die Zahl folgt der Kasse, nicht dem
         Preis — es ist derselbe Patrizier-IV-Fall, den 1600 vor der letzten
         Runde hatte, nur eine Epoche frueher.

         WARUM DIESELBE WURZEL WIE IN 1600 UND NICHT ETWAS ANDERES. Die drei
         Wurzeln der Pflichten haengen an FLUESSEN (fest · menge · ertrag).
         Ein Haus, dessen Braujahr mehr abwirft, als es ausgeben kann, wird
         von keiner erfasst: der BESTAND kommt in keiner vor. Genau das ist
         1350 ab Jahr 6 — die fuenf Angebote dieser Zeit sind dann gebaut,
         und was hereinkommt, bleibt liegen. Den NENNER darf dieses Stueck
         nicht anfassen (er gehoert DEM GEGNER), und er soll auch nicht
         angefasst werden: wer die Ablosesummen anhebt, damit die Kennzahl
         flacher laeuft, entwertet die Latte genauso wie das Herunterpreisen
         der Angebote.

         HISTORISCH STEHT DER SATZ SCHON OBEN IN DIESER EPOCHE, woertlich:
         „Der Anschlag ist die Schaetzung des Rats: was durch das Haus geht
         UND WAS IM HAUS LIEGT." Der Schoss des 14. Jahrhunderts war ein
         Vermoegensschoss — zwei Ratsherren gingen durch die Haeuser und
         schaetzten Haus, Gerät und bares Geld. Was hier dazukommt, ist keine
         neue Abgabe, sondern die zweite Haelfte einer Zahl, die diese Epoche
         von Anfang an nennt.

         DER FREIBETRAG IST HOEHER ALS IN 1600, UND DIE ZAHL IST ABGELESEN.
         In 1600 bleibt EINE Jahreslast frei. Hier sind es ZWEI, weil hier
         zwei Dinge nebeneinander faellig werden: die Rechnungsspalte
         derselben vierzehn Michaelitage zeigt neben der Jahreslast (61 bis
         134 Pf) in JEDEM ZWEITEN Jahr den Handlohn beim Erbfall (1,10
         Jahreslasten — die Hand wechselt in dieser Partie alle zwei
         Braujahre) und dazwischen die ausserordentliche Umlage:

           1351  Pflicht  87 + Handlohn  96      1358  Pflicht 132 + —
           1352  Pflicht  90 + Umlage    24      1359  Pflicht  77 + Handlohn 135
           1353  Pflicht  98 + Handlohn 110      1360  Pflicht  61 + —
           1355  Pflicht  77 + Umlage   100      1361  Pflicht 109 + Handlohn 162
           1357  Pflicht 126 + Handlohn 140      1363  Pflicht  64 + Handlohn  70

         Ein schweres Jahr kostet also 1,8 bis 2,3 Jahreslasten. Wer weniger
         als zwei bar haelt, ist im naechsten Erbfall zahlungsunfaehig — und
         genau so viel bleibt frei. Darunter liegt weiter der Boden auf dem
         Preis der billigsten Festlegung dieser Zeit (85 bis 140 Pf, siehe
         preis.js `liegeFreibetrag`): wer auf die unwiderrufliche Wahl
         spart, wird nicht angeschlagen.

         `liegeSatz` ist 0,30 und nicht 0,70 wie in 1600. DAS MASS DAFUER IST
         NICHT rho, SONDERN DIE LADE SELBST: gesucht ist die Zahl, bei der die
         Barschaft ueber vierzehn Jahre weder davonlaeuft noch eingeht. Vier
         Laeufe derselben Linie am Probestand, je 400 Wochen, nur diese eine
         Zahl veraendert:

           liegeSatz   Lade Jahresmedian   Kennzahl       rho      Jahre <1x   Festlegung
           — (ohne)      234 -> 538  x2,30   1,55–41,67   +0,701      0/14         1x
           0,55          234 ->  89  x0,38   1,48–11,31   −0,473      0/14         1x
           0,40          234 -> 131  x0,56   1,55–15,67   +0,569      0/14         1x
           0,30          234 -> 258  x1,10   1,55–15,14   +0,288      0/14         1x

         Bei 0,55 laeuft die Epoche in die andere Richtung davon — die Lade
         schrumpft auf ein Drittel, und die woechentliche Gegenprobe steht bei
         −0,763. Das ist derselbe Fehler wie vorher, nur mit umgekehrtem
         Vorzeichen, und er wuerde beim naechsten Urteil genauso auffallen.
         Bei 0,30 steht die Lade am Ende, wo sie angefangen hat (Faktor 1,10),
         die Kennzahl bleibt im Band 1,55 bis 15,14 statt 1,55 bis 41,67, und
         kein Jahr steht unter 1x.

         Ein hoeherer Satz waere in dieser Epoche auch sachlich falsch: die
         Lade ist die duennste der vier, der Notpfennig steht bei 48 Pf, und
         eine Abgabe, die ein Haus auf den Notpfennig drueckt, ist keine
         Rueckkopplung, sondern ein Ende. In 1600 darf 0,70 stehen, weil dort
         das Anderthalbfache eines Jahresumsatzes bar in der Lade lag; hier
         liegt ein Fuenftel. Die Laeufe stehen im Bericht der Nacharbeit
         (werkbank/urteile/welle4-rueckkopplung-nacharbeit.md). */
      liegeName: 'Anschlag auf das Geld in der Lade',
      liegeSagt: 'Zu Michaeli gehen zwei Ratsherren durch die Häuser und schätzen, '
               + 'was einer bar liegen hat. Was durch das Haus geht und was im Haus '
               + 'liegt, steht beim Rat in derselben Zahl.',
      liegeFrei: 2.0,
      liegeSatz: 0.30,

      /* Ausserordentliche Umlagen kamen haeufiger als alle sieben Jahre:
         Mauerbau, Landfriedensgeld, Brandschatzung, Siechenhaus — eine
         Stadt des 14. Jahrhunderts legte fast in jedem zweiten Jahr etwas
         um. Sie sind der Grund, warum die Kasse eines Brauhauses in
         Zacken laeuft und nicht in einer Geraden. */
      abstaende: [2, 3, 4, 2, 3, 5, 3, 4, 3],

      /* Die Bierordnung. Steigt in Jahrzehnten, nicht in Jahren. */
      ordnung: [
        { ab: 1350, preis: 9,  sagt: 'Der Rat setzt den Bierpfennig auf neun je Fass.' },
        { ab: 1391, preis: 10, sagt: 'Nach der Teuerung erlaubt der Rat einen Pfennig mehr.' },
        { ab: 1444, preis: 11, sagt: 'Die Bierordnung wird erneuert: elf Pfennige je Fass.' },
        { ab: 1490, preis: 12, sagt: 'Zwölf Pfennige, und der Rat lässt nachmessen.' }
      ],

      pflichten: [
        { k: 'grutgeld',  name: 'Grutgeld an den Grutherrn', art: 'menge', teil: 0.64,
          sagt: 'Wer Grut braucht, kauft sie vom Grutherrn. Es gibt keinen zweiten — '
              + 'und gezahlt wird nach dem, was durch die Pfanne ging.' },
        { k: 'mahlgeld',  name: 'Mahlgeld an die Mühle', art: 'menge', teil: 0.36,
          sagt: 'Das Malz muss zur Mühle. Der Müller nimmt den Metzen vom Scheffel; '
              + 'wer nichts mahlen lässt, schuldet nichts.' },
        { k: 'erbzins',   name: 'Erbzins an den Grundherrn', art: 'fest', teil: 0.62,
          sagt: 'Das Anwesen gehört nicht dem Haus. Der Zins läuft, ob gebraut wird oder nicht.' },
        { k: 'wasserzins', name: 'Wasserzins an die Stadt', art: 'fest', teil: 0.38,
          sagt: 'Der Brunnen auf dem Markt ist der Stadt ihrer. Bezahlt wird die Röhre, nicht der Eimer.' },
        { k: 'schoss',    name: 'Schoss nach der Nahrung', art: 'ertrag', teil: 1,
          sagt: 'Zwei Ratsherren schätzen, was das Haus im vergangenen Jahr über den Aufwand '
              + 'hinaus behalten hat. Ein Jahr ohne Überschuss wird nicht angeschlagen.' }
      ],

      umlagen: [
        { teil: 0.75, name: 'Umlage für den Mauerbau',   sagt: 'Die Stadt schließt den Ring nach Süden.' },
        { teil: 0.55, name: 'Landfriedensgeld',           sagt: 'Der Bund der Städte hält Reisige. Bezahlt wird von den Häusern.' },
        { teil: 1.85, name: 'Brandschatzung',             sagt: 'Ein Heerhaufe steht vor dem Tor und zieht gegen Geld weiter.' },
        { teil: 1.10, name: 'Zehnt auf das Braugerät',   sagt: 'Der Rat besteuert Pfanne, Bottich und Fass nach Schätzung.' },
        { teil: 0.90, name: 'Umlage für die Brücke',    sagt: 'Das Hochwasser hat den Steg genommen.' },
        { teil: 1.50, name: 'Umlage für die Siechenhäuser', sagt: 'Die Stadt begräbt und pflegt. Bezahlt wird von denen, die noch da sind.' }
      ],
      pfand: 'Wer den Anschlag nicht abträgt, dem nimmt der Rat ein Pfand: eine Wirtschaft wird '
           + 'auf fünf Jahre dem Adler zugesprochen.',

      angebote: [
        { k: 'dach', name: 'Das Dach über der Pfanne', anteil: 0.07, bauzeit: 0,
          was: 'Ein Schindeldach auf vier Ständern, über der offenen Pfanne.',
          satz: 'Regen löscht das Feuer nicht mehr, und der Sud fällt nicht aus.',
          wirkung: { ertrag: 16 } },

        { k: 'grutkasten', name: 'Der Grutkasten unter Schloss', anteil: 0.12, bauzeit: 0,
          was: 'Eine verschlossene Truhe für die Grut, mit dem Maß daneben.',
          satz: 'Gewogen ausgegeben, gewogen abgerechnet.',
          wirkung: { rohstoff: 14 } },

        { k: 'schild', name: 'Das Hausschild überm Tor', anteil: 0.10, bauzeit: 0,
          was: 'Ein geschmiedeter Anker an einem Ausleger, weithin sichtbar.',
          satz: 'Wer vorbeikommt, weiß von nun an, wo er ist — und fragt nach dem Haus, nicht nach dem Bier.',
          wirkung: { ansehen: 8, preis: 0.05 } },

        { k: 'bottich', name: 'Ein zweiter Bottich aus Eichenholz', anteil: 0.20, bauzeit: 1,
          was: 'Ein Gärbottich vom Küfer, mit Weidenreifen gebunden.',
          satz: 'Zwei Bottiche heißen: der zweite Sud muss nicht warten — und der erste '
              + 'darf ausgären, statt jung aus dem Haus zu gehen.',
          wirkung: { plaetze: 3, preis: 0.04 } },

        { k: 'ochsenstall', name: 'Der Ochsenstall am Tor', anteil: 0.24, bauzeit: 0,
          was: 'Ein eigener Stall statt des geliehenen Gespanns.',
          satz: 'Der Ochse steht im Haus und wartet nicht auf den Nachbarn.',
          sperrt: ['karrengaul'],
          wirkung: { ertrag: 34 } },

        { k: 'karrengaul', name: 'Ein Karrengaul statt des Ochsen', anteil: 0.42, bauzeit: 0,
          was: 'Ein kaltblütiges Pferd, Geschirr, Hufbeschlag.',
          satz: 'Doppelt so schnell wie der Ochse und dreimal so teuer im Futter.',
          sperrt: ['ochsenstall'],
          wirkung: { ertrag: 62 } },

        /* Klein und sicher gegen groß und langsam: der Kauf beim Zunftbüttner
           wirkt heute und kostet ein Achtel; die eigene Werkstatt braucht ein
           Jahr und trägt danach dreifach. Beides zugleich duldet die Zunft
           nicht — wer bindet, kauft nicht, und wer kauft, bindet nicht. */
        { k: 'fasskauf', name: 'Der feste Fasskauf bei der Zunft', anteil: 0.09, bauzeit: 0,
          was: 'Ein Brief über zwölf Fässer im Jahr, zum Zunftpreis, gegen Vorauszahlung.',
          satz: 'Heute unterschrieben, morgen stehen die Fässer im Hof. Gebunden ist gebunden.',
          sperrt: ['boettcher'],
          wirkung: { plaetze: 2, ertrag: 9 } },

        { k: 'boettcher', name: 'Der Böttcher im Haus', anteil: 0.34, bauzeit: 1,
          was: 'Eine Werkstatt im Hof, Daubenholz unterm Vordach.',
          satz: 'Fässer werden nicht mehr gekauft, sondern gebunden. Ein dichtes Fass '
              + 'kommt voll beim Wirt an, und der Wirt rechnet danach.',
          sperrt: ['fasskauf'],
          wirkung: { plaetze: 4, ertrag: 26, preis: 0.03 } },

        { k: 'brunnen', name: 'Der Ziehbrunnen im Hof', anteil: 0.55, bauzeit: 1,
          was: 'Achtzehn Klafter durch den Lehm bis auf den Kies.',
          satz: 'Eigenes Wasser. Der Weg zum Marktbrunnen entfällt.',
          wirkung: { pflichtWeg: 'wasserzins', ertrag: 12 } },

        { k: 'pfanne', name: 'Die kupferne Pfanne', anteil: 0.66, bauzeit: 2,
          was: 'Eine offene Pfanne aus getriebenem Kupfer über offenem Feuer — kein Helm, kein Rohr.',
          satz: 'Kupfer hält die Hitze gleich. Das Bier wird sauberer und fängt einen besseren Preis.',
          wirkung: { preis: 0.07, ertrag: 30 } },

        /* Dasselbe Übel, zwei Wege: die Handmühle drückt das Mahlgeld heute
           für ein Sechstel des Preises, das Achtel an der Stadtmühle nimmt es
           ganz weg. Wer selbst mahlt, bekommt vom Müller keinen Anteilbrief. */
        { k: 'handmuehle', name: 'Die Handmühle im Hof', anteil: 0.17, bauzeit: 0,
          was: 'Zwei Steine unter einem Schutzdach, von zwei Knechten getreten.',
          satz: 'Der Müller merkt es und rechnet weniger. Ganz los wird man ihn damit nicht.',
          sperrt: ['muehlanteil'],
          wirkung: { ertrag: 18, rohstoff: 6 } },

        { k: 'muehlanteil', name: 'Ein Achtel an der Stadtmühle', anteil: 1.05, bauzeit: 0,
          was: 'Ein Anteilbrief, im Ratsbuch eingetragen.',
          satz: 'Wer Anteil hat, mahlt zuerst und zahlt den Metzen an sich selbst.',
          sperrt: ['handmuehle'],
          wirkung: { pflichtWeg: 'mahlgeld', ertrag: 40 } },

        { k: 'gewoelbe', name: 'Der gewölbte Keller unterm Hof', anteil: 1.90, bauzeit: 3,
          was: 'Ein Tonnengewölbe aus Bruchstein, drei Klafter unter dem Hof.',
          satz: 'Kühl und dunkel. Das Bier hält länger, mehr Fässer haben Platz, und was '
              + 'über den Sommer kommt, wird im Herbst teurer verkauft.',
          wirkung: { plaetze: 9, ertrag: 55, preis: 0.05 } },

        { k: 'bannmeile', name: 'Die Bannmeile auf zehn Jahre', anteil: 2.60, bauzeit: 0,
          was: 'Ein Ratsbrief: kein fremdes Bier innerhalb einer Meile.',
          satz: 'Drei Häuser dürfen zehn Jahre lang nichts anderes ausschenken.',
          wirkung: { bindung: { n: 3, jahre: 10 } } }
      ],

      festlegungen: [
        { k: 'freikauf', name: 'Der Freikauf vom Grundherrn', anteil: 2.20,
          was: 'Eine Ablosesumme, ein Siegel, ein Eintrag im Salbuch.',
          regel: 'Der Erbzins endet. Für immer. Das Haus gehört von heute an dem Haus.',
          wirkung: { pflichtWeg: 'erbzins' } },

        { k: 'realrecht', name: 'Das Braurecht ans Haus', anteil: 1.70,
          was: 'Das Recht wird vom Menschen gelöst und auf die Hofstatt geschrieben.',
          regel: 'Kein Handlohn mehr bei jedem Erbfall. Wer erbt, erbt auch die Pfanne.',
          wirkung: { handlohnWeg: true } },

        { k: 'hopfen', name: 'Hopfen statt Grut', anteil: 1.40, ab: 1380,
          was: 'Der Grutzwang wird abgelöst, Hopfen aus Böhmen kommt auf den Wagen.',
          regel: 'Das Grutgeld entfällt. Das Bier hält länger, reist weiter und fängt mehr.',
          wirkung: { pflichtWeg: 'grutgeld', rohstoff: 26, preis: 0.09 } },

        /* DIE KLEINSTE UNABAENDERLICHE ENTSCHEIDUNG MUSS ERREICHBAR SEIN.

           Am Bildschirm nachgezaehlt, sorgfaeltig gespielte Linie ueber 190
           Wochen: der Chronikknopf las in Epoche I und II nach sechs Michaeli
           unveraendert „0 Festlegungen". Das lag nicht am Spieler. Die
           billigste Festlegung dieser Zeit kostete 0,32 x 470 = 150 Pf, und
           die Lade steht an einem Michaelitag dieser Epoche zwischen 29 und
           112 Pf — die Festlegung war nie zu haben, in keinem Jahr, in keinem
           Lauf. Eine Entscheidung, die in sechs Braujahren kein einziges Mal
           zu treffen ist, steht auf der Tafel wie ein Bild an der Wand.

           0,18 x 470 = 85 Pf. Das ist der Preis von rund neun Fass Bier —
           Schreiberlohn, Wachs, und was vier Wirte kosten, die unterschreiben
           sollen. Es ist erreichbar fuer ein Haus, das ein Jahr lang
           zurueckgelegt hat, und unerreichbar fuer eines, das jedes Michaeli
           leerkauft. Genau das soll eine Festlegung sein. Die drei grossen
           dieser Zeit (658 / 799 / 1.034 Pf) bleiben, wo sie sind: sie sind
           das Ziel, auf das man ueber Generationen spart. */
        { k: 'vertrag', name: 'Vertrag statt Gunst', anteil: 0.18,
          was: 'Vier Wirte setzen ihr Zeichen unter einen Brief auf fünfundzwanzig Jahre.',
          regel: 'Vier Häuser nehmen nur noch Bier dieses Hauses. Die übrigen merken sich, dass sie nicht gefragt wurden.',
          wirkung: { bindung: { n: 4, jahre: 25 }, ansehen: -6 } },

        /* DIE ZWEITE SPROSSE — UND WARUM SIE ERST 1355 KOMMT.

           Nachgemessen am eingefrorenen Stand 3e6d08c, sorgfaeltig gespielte
           Linie ueber 400 Wochen = vierzehn Braujahre und ACHT Amtszeiten,
           die Sichtlage jedes Siegelknopfes in Woche 1 mitgeschrieben
           (`werkbank/schuss/preis-w5/hand.mjs`):

             1350  Lade 112   vertrag −85 AN    | freikauf/realrecht AUS
             1354  Lade 393   vertrag −99 AN    | genommen
             1355  Lade 293   —                 | freikauf −1300 AUS, realrecht −970 AUS
             …     …                            | …
             1363  Lade 246   —                 | freikauf −1700 AUS, realrecht −1300 AUS

           Ab 1355 stand NEUN JAHRE LANG keine einzige bedienbare Festlegung
           auf der Tafel. Das Haus hat acht Amtszeiten und genau eine
           unwiderrufliche Entscheidung; die anderen sieben sehen ein Bild an
           der Wand. Der Grund ist arithmetisch: die Taxe waechst mit
           `teuerungJahr` (1,040), die Lade waechst nicht mit — der Abstand
           zum Freikauf ist ueber die vierzehn Jahre um 757 Pf GEWACHSEN.
           „Das Ziel, auf das man ueber Generationen spart" ist damit kein
           weiter Weg, sondern ein Weg, der sich beim Gehen verlaengert.

           Die drei grossen bleiben trotzdem, wo sie sind — sie sind das
           Ziel, und wer es verschiebt, nimmt der Epoche ihre Spitze. Was
           fehlt, ist die Sprosse DAZWISCHEN, und sie muss klein genug sein,
           dass ein Haus sie erreicht, ohne aufzuhoeren zu kaufen: 0,34 x 470
           = 160 Pf in 1350 und 277 Pf in 1364, gegen eine Michaeli-Lade, die
           in denselben Jahren zwischen 246 und 498 Pf steht. Erreichbar in
           etwa jedem zweiten Jahr, nie geschenkt. `ab: 1355` haelt sie aus
           den ersten Amtszeiten heraus, in denen `vertrag` die Wahl ist —
           erst wenn die billigste weg ist, kommt die zweite.

           Der Gegenstand ist der billigste dauerhafte Rechtsakt, den ein
           Brauhaus dieser Zeit ueberhaupt tun konnte: den Stadtbrunnen
           verlassen. Ein Schacht im eigenen Hof kostete einmal und beendete
           den Wasserzins fuer immer. */
        { k: 'brunnen', name: 'Der eigene Brunnen im Hof', anteil: 0.34, ab: 1355,
          was: 'Ein Schacht durch den Lehm bis auf den Kies, ausgemauert, mit Rad und Eimer.',
          /* Der laengere Satz („…und hängt nicht mehr an der Röhre, die der Rat
             sperren kann") brach in 1356 in der letzten Kartenzeile ab, weil
             `.pr-fest` alles wegschnitt, was nicht in die Karte passte. Der
             Schnitt ist seit Welle 5 (Auflage 3) weg — die Karte traegt ihren
             Text jetzt selbst. Der kurze Satz bleibt trotzdem: er ist der
             bessere. */
          regel: 'Der Wasserzins an die Stadt endet. Für immer. Das Haus schöpft aus eigenem Grund.',
          wirkung: { pflichtWeg: 'wasserzins' } },

        /* ==================================================================
           DIE LUECKE IN DER LEITER — Auflage 4 der Welle 5.

           GEZAEHLT hat der blinde Kritiker: acht Amtszeiten in vierzehn
           Braujahren, jede mit Anspruch auf genau eine unwiderrufliche Wahl
           (`preis.js`, `festlegungOffen`) — und eine Hand, die Festlegungen
           ausdruecklich WILL, bekommt in dieser Epoche ZWEI. Ab dem siebten
           Braujahr traegt jede Karte `disabled` mit `data-soll-aus="1"`.
           Nachgemessen am eingefrorenen Arbeitsbaum, 400 Wochen: an
           ELF VON VIERZEHN Michaelitagen ist keine Festlegung bezahlbar.

           SEINE URSACHE HAELT IN DIESER EPOCHE NICHT, und die Zahl steht
           daneben. Er nennt die Teuerung: „die Taxe waechst mit der Zeit, die
           Kasse nicht". In 1350 waechst die Taxe ueber vierzehn Jahre um das
           1,67fache (470 -> 783) und die Michaeli-Lade um das 3,4fache
           (112 -> 498); der Abstand zum `realrecht` FAELLT von 8,9 auf 3,0
           Laden. Und die Gegenrechnung ist entscheidbar, ohne dass man sie
           spielen muss: friert man die Taxe auf das Eroeffnungsjahr ein — die
           schaerfste Fassung von „haeng sie an etwas, das nicht davonlaeuft" —,
           kostet das `realrecht` 800 Pf gegen eine hoechste Lade von 498. Es
           waere keine einzige Festlegung mehr erreichbar als heute. Dasselbe
           gilt in allen vier Epochen (5.300 > 997 · 31.500 > 23.761 ·
           110.000 > 86.000).

           DIE URSACHE IST DIE LUECKE. Die Anteile springen von 0,18 und 0,34
           unmittelbar auf 1,70 — dazwischen liegt nichts. Deshalb kommen hier
           zwei Sprossen dazu, und die Steigung bleibt, wie sie ist: jede
           Verbilligung der BESTEHENDEN Karten haette die Vorbild-Hand (sie
           greift bei „hoechstens 45 im Hundert der Lade") zugreifen lassen
           und damit die Wellenzahl bewegt.

           BEIDE NEUEN SPROSSEN LIEGEN IM BAND ZWISCHEN 45 UND 100 IM HUNDERT
           DER GEMESSENEN LADE: teuer genug, dass eine Faustregel sie ablehnt,
           billig genug, dass ein Spieler sie treffen kann. Und beide kosten
           nicht einmal, sondern fuer immer — was sie eintragen, traegt das
           Haus an jedem Michaelistag mit.
           ================================================================== */

        /* 0,42 x Taxe = 213 Pf in 1353 und 325 Pf in 1362, gegen eine
           Michaeli-Lade von 246 bis 498. Der Ertrag ist FEST, das Standgeld
           waechst mit der Teuerung: die Bank traegt sich in den ersten Jahren
           und wird danach zur Last. Genau das soll eine Festlegung sein — im
           Jahr des Kaufs ein gutes Geschaeft und nicht zurueckzunehmen.
           Der Gegenstand ist gewoehnlich: Baenke und Staende im Kaufhaus
           waren erbliches Gut, wurden gekauft, vererbt und mit Standgeld
           belegt. */
        { k: 'marktbank', name: 'Die Marktbank auf ewig', anteil: 0.42, ab: 1352,
          was: 'Eine Bank im Kaufhaus, erblich gekauft, mit Brief und Siegel des Rats.',
          regel: 'Das Haus schenkt von heute an am Markt selbst aus. Der Rat nimmt dafür an jedem Michaelistag sein Standgeld — ohne Ende.',
          wirkung: { ertrag: 26, ansehen: 3,
            pflichtNeu: { k: 'standgeld', name: 'Standgeld für die Bank im Kaufhaus', art: 'fest', teil: 0.62,
              sagt: 'Der Preis des Platzes am Markt, jährlich, ohne Ende.' } } },

        /* 0,50 x Taxe = 310 Pf in 1357 und 391 Pf in 1363, gegen eine Lade von
           246 bis 498. `ab: 1357` haelt sie aus den ersten vier Amtszeiten
           heraus, in denen `vertrag`, `brunnen` und die Marktbank die Wahl
           sind: eine Leiter wird von unten gestiegen.
           Der Gegenstand ist der haeufigste unwiderrufliche Rechtsakt eines
           Buergerhauses dieser Zeit. Eine Jahrtagsstiftung wurde einmal
           gestiftet, fuer ewige Zeiten gelesen — und fuer ewige Zeiten
           bezahlt. */
        { k: 'jahrtag', name: 'Der Jahrtag in der Pfarrkirche', anteil: 0.50, ab: 1357,
          was: 'Ein Altar, eine Kerze, ein Eintrag ins Seelbuch: für ewige Zeiten wird für dieses Haus gelesen.',
          regel: 'Das Haus steht von heute an im Seelbuch und im Ansehen der Stadt. Dafür geht an jedem Michaelistag der Jahrtag an die Pfarre.',
          wirkung: { ansehen: 14,
            pflichtNeu: { k: 'jahrtagzins', name: 'Jahrtag und Seelgerät an die Pfarre', art: 'fest', teil: 0.50,
              sagt: 'Für ewige Zeiten gestiftet — der Pfarrer liest, das Haus zahlt.' } } }
      ]
    },

    /* ==================================================================
       II — 1517 bis 1799.  DIE ORDNUNG.
       Stein statt Holz, Besitz statt Pacht, Zunft statt Zufall.
       ================================================================== */
    2: {
      einheit: 'Fass', mitte: 22, spanne: 7,
      sagt: 'Die Zunft hält den Preis. Ausbrechen kostet den Ruf.',

      stil: 'kanzlei',
      tag: 'Michaeli',
      tagSatz: 'Michaeli ist Zinstag und Rechnungstag. Der Zunftschreiber liest vor, '
             + 'was jedes Haus im vergangenen Jahr gesotten hat.',
      anschlagSatz: 'Der Anschlag steht im Steuerbuch der Stadt: Vermögen und Gewerb, '
                  + 'geschätzt von zwei Ratsherren und einem Zunftmeister.',

      rechtSatz: 'vom Kloster gepachtet',
      grund: 2800,
      lastenGrund: 2500,
      teuerungJahr: 1.038,
      teuerungKauf: 1.055,
      lastenFest: 75,
      pflichtUmsatz: 0.040,
      pflichtErtrag: 0.28,
      nachlass: 0.55,
      nachlassName: 'Stundung des Klosters auf den Pachtzins',
      /* DER NOTPFENNIG. Das Braugeld fuer einen Sud Braunbier — Malz, Hopfen,
         Holz, Fuhrlohn. Das Kloster als Grundherr nimmt es nicht: ein Pachthof,
         der nicht mehr braut, traegt keinen Pachtzins mehr. */
      notpfennig: 280,
      umsatzAnfang: 1900,
      /* Der Kurfuerst haelt den Satz kurz: an ihm haengt sein
         Malzaufschlag, und ein hoher Satz macht Unruhe in der Stadt.
         Diese Epoche besteht die zweite Messlatte auch ohne — was hier
         ankommt, ist bewusst der kleinste der vier Saetze. */
      satzFolgt: 0.25,
      pflichtHoehe: 0.155,
      umlageAnteil: 0.52,
      handlohnAnteil: 1.15,

      /* DIE VIERTE WURZEL — UND SIE STEHT NUR HIER.

         Gemessen (Welle 4, preis-linie.mjs, vier Laeufe zu 400 Wochen,
         saat=1350): 1600 ist die einzige der vier Epochen, in der die
         Barschaft um das Elffache waechst — 430 auf 4.637 fl —, waehrend der
         Ausstoss STEHT (1.900 auf 1.634 fl). Das Haus waechst nicht, es
         hortet. Die drei Wurzeln der Pflichten haengen alle an Fluessen und
         fassen einen Bestand nicht; deshalb kommt die vierte dazu, und
         deshalb kommt sie nur hier: in 1350, 1884 und 1970 kaeme sie nie
         ueber den Freibetrag und waere eine tote Zeile.

         `liegeFrei` in JAHRESLASTEN, und der Freibetrag hat zusaetzlich einen
         Boden auf dem Preis der billigsten Festlegung dieser Zeit (siehe
         preis.js, `liegeFreibetrag`). Wer eine Jahreslast bar haelt, kann die
         naechste Umlage tragen; wer auf die unwiderrufliche Wahl spart, wird
         gar nicht angeschlagen. Angeschlagen wird nur, was Jahr fuer Jahr
         unberuehrt darueber liegen bleibt.

         BEIDE ZAHLEN SIND GEMESSEN UND NICHT GERATEN. Vier Laeufe derselben
         Linie, je 400 Wochen, nur diese beiden Zahlen veraendert
         (rho = Spearman der Kennzahl gegen das Jahr, wie die Aufsicht rechnet):

           liegeFrei / liegeSatz   rho      Band          Festlegung
           — (ohne alles)        +0,873   2,27–67,33x        1x
           2,0 / 0,45            +0,644   2,02–13,02x        1x
           1,5 / 0,55            +0,723   1,96– 8,07x        1x
           1,0 / 0,70            −0,182   1,49– 5,90x        1x
           1,0 / 0,70 (2. Lauf)  +0,191   1,61– 6,63x        1x
           1,0 / 0,70 (3. Lauf)  +0,121   1,75–10,11x        1x

         Die letzten drei Zeilen sind DERSELBE Stand, dreimal gefahren — das
         Pruefskript ist unter Last nicht bitgenau (feste Wartezeiten, nicht
         der Wuerfel; der ist gesaet). Groesstes |rho| der drei: 0,191, und
         keiner der drei hat ein Jahr unter 1x.

         Die Lade steht damit ueber vierzehn Jahre bei 377 bis 809 fl statt bei
         430 bis 4.637, und die Kennzahl geht von 3,76x auf 1,61 bis 4,85x
         statt auf 27,81x. Weiter herunter darf der Freibetrag nicht: bei 1,5/0,55 ohne
         den Boden auf der Festlegung nimmt der Automat in vierzehn Jahren
         KEINE einzige Festlegung mehr — die zweite Messlatte zaehlt beides.

         `liegeSatz` ist hoch, und das ist diese Epoche. Der Anschlag steht
         nach dem Satz weiter oben „im Steuerbuch der Stadt: Vermoegen und
         Gewerb" — und zwischen 1618 und 1648 wurde dieses geschaetzte
         Vermoegen jedes Jahr aufs Neue angeschlagen: Tuerkensteuer,
         Kontribution, Quartiergeld, Salvaguardia, Brandsteuer. Sie stehen
         alle fuenf schon in der Umlagenliste dieser Epoche. Ein Buerger, der
         in diesen Jahrzehnten bares Geld sichtbar in der Lade liegen hatte,
         hat es nicht behalten — genau darum ist der Abstand der Umlagen hier
         zwei bis vier Jahre und nicht sechs. */
      liegeName: 'Anschlag auf das bare Vermögen',
      liegeSagt: 'Zu Michaeli liest der Zunftschreiber, was bar in der Lade liegt, '
               + 'und der Rat schreibt es ins Steuerbuch: Vermögen und Gewerb. '
               + 'In diesen Jahrzehnten wird das Vermögen jedes Jahr aufs Neue angeschlagen.',
      liegeFrei: 1.0,
      liegeSatz: 0.70,
      /* 1600 bis 1650 ist die dichteste Umlagenzeit der ganzen Partie:
         Tuerkensteuer, Kontribution, Quartierlast, Brandsteuer,
         Salvaguardia. Der Abstand ist zwei bis vier Jahre, nicht sechs. */
      abstaende: [1, 2, 3, 2, 4, 3, 2, 3, 4],

      ordnung: [
        { ab: 1517, preis: 22, sagt: 'Die Bierordnung nach dem Reinheitsgebot: zweiundzwanzig Gulden je Fass Braunbier.' },
        { ab: 1622, preis: 27, sagt: 'Kipper- und Wipperzeit. Die Münze ist schlecht, der Satz steigt.' },
        { ab: 1650, preis: 25, sagt: 'Nach dem Krieg setzt der Rat den Satz herunter — es ist niemand mehr da, der zahlt.' },
        { ab: 1710, preis: 28, sagt: 'Die Bierordnung wird erneuert, das Ungeld gleich mit.' },
        { ab: 1770, preis: 31, sagt: 'Der Kurfürst genehmigt einen Aufschlag von drei Gulden.' }
      ],

      pflichten: [
        { k: 'ungeld', name: 'Ungeld auf den Ausschank', art: 'menge', teil: 0.63,
          sagt: 'Vom ausgeschenkten Bier nimmt der Rat den zwanzigsten Pfennig. '
              + 'Was nicht ausgeschenkt wird, trägt auch kein Ungeld.' },
        { k: 'malzaufschlag', name: 'Malzaufschlag des Kurfürsten', art: 'menge', teil: 0.37,
          sagt: 'Seit 1543 auf jeden Scheffel Malz. Er ist nie wieder abgeschafft worden — '
              + 'aber er kennt nur den Scheffel, der wirklich vermälzt wurde.' },
        { k: 'pachtzins', name: 'Pachtzins ans Kloster', art: 'fest', teil: 0.64,
          sagt: 'Die Hofstatt ist Klosterlehen. Der Zins geht nach Obernberg, '
              + 'auch in einem Jahr, in dem die Pfanne nicht warm wird.' },
        { k: 'zunftumlage', name: 'Zunftumlage und Meisterbüchse', art: 'fest', teil: 0.36,
          sagt: 'Lade, Trunk, Begräbnis, Witwenkasse. Es ist eine Abgabe auf den Meister, '
              + 'nicht auf das Bier. Wer nicht zahlt, braut nicht.' },
        { k: 'anlage', name: 'Stadtanlage nach der Nahrung', art: 'ertrag', teil: 1,
          sagt: 'Der Zunftschreiber liest vor, was jedes Haus im vergangenen Jahr gesotten '
              + 'und was es davon behalten hat. Angelegt wird auf das Behaltene.' }
      ],

      umlagen: [
        { teil: 0.70, name: 'Türkensteuer',        sagt: 'Der Reichstag hat sie bewilligt. Die Stadt legt sie um.' },
        { teil: 2.10, name: 'Kriegskontribution',   sagt: 'Einquartierung oder Geld. Das Haus wählt das Geld.' },
        { teil: 0.95, name: 'Quartierlast',         sagt: 'Vierzig Reiter, sechs Wochen, Hafer inbegriffen.' },
        { teil: 0.60, name: 'Bauumlage für das Rathaus', sagt: 'Der Rat baut sich einen Giebel mit Uhr.' },
        { teil: 1.40, name: 'Brandsteuer nach dem Stadtbrand', sagt: 'Die halbe Gasse hinter der Kirche ist abgebrannt.' },
        { teil: 1.30, name: 'Salvaguardia für das Haus',        sagt: 'Ein Schutzbrief des Obristen, gegen Bargeld, für ein halbes Jahr.' }
      ],
      pfand: 'Wer den Anschlag nicht abträgt, dem legt die Zunft die Braugerechtigkeit still: '
           + 'eine Wirtschaft geht auf fünf Jahre an den Adler.',

      angebote: [
        { k: 'darre', name: 'Die Darre überm Malzboden', anteil: 0.065, bauzeit: 0,
          was: 'Ein Rauchabzug und ein Lattenrost über der Feuerstelle.',
          satz: 'Gedarrtes Malz lässt sich lagern. Das Braujahr wird planbar.',
          wirkung: { rohstoff: 20, ertrag: 60 } },

        { k: 'probe', name: 'Die Bierprobe des Rats bestehen', anteil: 0.09, bauzeit: 0,
          was: 'Drei Ratsherren, eine Lederhose und eine Bank aus Eichenholz.',
          satz: 'Wessen Bier die Bank hält, dessen Fass gilt als recht gesotten.',
          wirkung: { preis: 0.05, ansehen: 5 } },

        { k: 'wappenbrief', name: 'Der Wappenbrief', anteil: 0.15, bauzeit: 0,
          was: 'Ein kaiserlicher Brief mit Anker und Helmzier, gerahmt in der Stube.',
          satz: 'Kein Recht, nur Rang. Rang lässt sich in Gulden umrechnen.',
          wirkung: { ansehen: 12, preis: 0.04 } },

        { k: 'schrotmuehle', name: 'Die Schrotmühle im Haus', anteil: 0.26, bauzeit: 1,
          was: 'Ein Handgang mit zwei Steinen, später ein Rosswerk.',
          satz: 'Das Malz verlässt den Hof nicht mehr.',
          wirkung: { pflichtWeg: 'mahlgeld', ertrag: 120 } },

        { k: 'fasslager', name: 'Das Fasslager unter der Kirche', anteil: 0.30, bauzeit: 1,
          was: 'Zwei Gewölbe im Berg, von St. Michael gepachtet.',
          satz: 'Kühl im Sommer. Was dort liegt, überlebt den Juli.',
          wirkung: { plaetze: 14 } },

        /* Fahren oder fahren lassen. Der Bote nimmt heute Geld und kein Risiko
           ab; die eigenen Rösser kosten fünfmal so viel und tragen fünfmal so
           viel. Wer den Boten hat, braucht den Wagen nicht — und der Bote fährt
           für kein Haus, das selbst fährt. */
        { k: 'botenfuhr', name: 'Die Fuhr beim Landboten', anteil: 0.11, bauzeit: 0,
          was: 'Ein Jahresvertrag mit dem Boten, der ohnehin jeden Dienstag über Land fährt.',
          satz: 'Er nimmt vier Fass mit. Wann er zurückkommt, entscheidet nicht das Haus.',
          sperrt: ['planwagen'],
          wirkung: { ertrag: 55 } },

        { k: 'planwagen', name: 'Zwei Rösser und ein Planwagen', anteil: 0.38, bauzeit: 0,
          was: 'Ein gedeckter Wagen mit Bremse, für die Straßen über Land.',
          satz: 'Neun Meilen am Tag statt sieben, und das Fass kommt trocken an.',
          sperrt: ['botenfuhr'],
          wirkung: { ertrag: 210 } },

        /* Der Hopfen: kaufen oder ziehen. Der Kontrakt bringt heute Ware und
           bindet an einen Preis; der Garten braucht drei Jahre und macht das
           Haus vom Markt unabhängig. Der Händler liefert keinem Haus, das ihm
           mit eigenen Stangen die Preise verdirbt. */
        { k: 'hopfenkontrakt', name: 'Der Hopfenkontrakt mit dem Händler', anteil: 0.14, bauzeit: 0,
          was: 'Fünf Jahre feste Menge zum festen Preis, aus Böhmen über Eger.',
          satz: 'Der Preis steht, auch wenn die Ernte gut ist. Das ist der Preis dafür, dass er steht.',
          sperrt: ['hopfengarten'],
          wirkung: { rohstoff: 30, ertrag: 25 } },

        { k: 'hopfengarten', name: 'Der Hopfengarten am Südhang', anteil: 0.55, bauzeit: 3,
          was: 'Vierhundert Stangen, drei Jahre bis zum ersten vollen Ertrag.',
          satz: 'Eigener Hopfen. Der Händler auf dem Markt verliert seine Macht über das Haus.',
          sperrt: ['hopfenkontrakt'],
          wirkung: { rohstoff: 55, ertrag: 90 } },

        /* Ein Meister im Haus, und nur einer. Entweder wird der Sohn
           eingeschrieben oder ein fremder Geselle wird gedungen. */
        { k: 'auswaertiger', name: 'Der auswärtige Braumeister', anteil: 0.19, bauzeit: 0,
          was: 'Ein Geselle aus Einbeck, auf drei Jahre gedungen, mit Kost und Lohn.',
          satz: 'Er kann mehr als das Haus. Er geht auch wieder, und nimmt es mit.',
          sperrt: ['zunftrecht'],
          wirkung: { preis: 0.05, ertrag: 45 } },

        { k: 'zunftrecht', name: 'Das Zunftrecht für den Sohn', anteil: 0.62, bauzeit: 0,
          was: 'Meisterstück, Mutgeld, Einschreibung in die Lade — im Voraus bezahlt.',
          satz: 'Der Erbe ist Meister, bevor er erbt. Der Handlohn fällt halb so hoch aus.',
          sperrt: ['auswaertiger'],
          wirkung: { handlohnHalb: true, ertrag: 40 } },

        { k: 'eiskeller', name: 'Der Eiskeller im Berg', anteil: 0.85, bauzeit: 2,
          was: 'Eine Grube mit Strohdecke, im Winter aus dem Fluss gefüllt.',
          satz: 'Untergärig gebraut, kalt gelagert. Das Bier hält bis in den Herbst.',
          wirkung: { plaetze: 22, preis: 0.05 } },

        { k: 'nachbarhaus', name: 'Der Kauf des Nachbarhauses', anteil: 1.30, bauzeit: 0,
          was: 'Die Hofstatt links vom Tor, samt Scheune und Braurecht des verstorbenen Nachbarn.',
          satz: 'Der Hof wird doppelt so groß, und ein Braurecht weniger ist in der Stadt.',
          wirkung: { plaetze: 12, ertrag: 260 } },

        { k: 'sudhaus', name: 'Das steinerne Sudhaus', anteil: 2.10, bauzeit: 4,
          was: 'Bruchstein statt Fachwerk, zwei offene Pfannen nebeneinander, ein Kamin aus Backstein.',
          satz: 'Es brennt nicht mehr ab. Das ist in diesem Jahrhundert kein kleines Versprechen.',
          wirkung: { plaetze: 18, ertrag: 320, preis: 0.04 } },

        { k: 'klosterrecht', name: 'Das Braurecht des Klosters Obernberg', anteil: 3.20, bauzeit: 0,
          was: 'Das Kloster braut nicht mehr selbst und verkauft sein Recht samt Schenke.',
          satz: 'Ein Recht, eine Schenke, ein Konkurrent weniger. Der Abt bleibt Nachbar.',
          wirkung: { bindung: { n: 2, jahre: 40 }, ertrag: 380 } }
      ],

      festlegungen: [
        { k: 'eigentum', name: 'Der Kauf des Anwesens', anteil: 2.40,
          was: 'Die Hofstatt wird aus dem Klosterlehen gelöst und ins Grundbuch geschrieben.',
          regel: 'Der Pachtzins endet. Für immer. Aus dem Pächter wird der Eigentümer.',
          wirkung: { pflichtWeg: 'pachtzins' } },

        /* Dasselbe in Epoche II, dieselbe Messung: billigste Festlegung
           0,28 x 2.800 = 784 fl gegen eine Michaelilade von 280 bis 640 fl.
           Nach sechs Michaeli stand auch hier „0 Festlegungen". 0,15 x 2.800
           = 420 fl — der Schwur vor dem Rat kostet die Gebuehr und das
           teurere Malz des ersten Jahres, nicht ein ganzes Vermoegen. Die
           drei grossen (5.320 / 6.720 / 7.840 fl) bleiben unberuehrt.

           NACHGEZOGEN IN WELLE 4, und zwar gemessen. Mit dem Anschlag auf das
           bare Vermoegen (siehe `liegeSatz`) haelt die Lade dieser Epoche
           ueber vierzehn Jahre 308 bis 1.695 fl statt 310 bis 5.217. Der
           Automat nimmt eine Festlegung erst, wenn sie hoechstens 45 im
           Hundert der Michaelilade kostet — bei 0,15 x 2.800 = 420 fl (mit
           der Teuerung bis 525) waeren dafuer 1.167 fl noetig, und die
           Michaelilade steht in der Spitze bei 957. Gemessen: `Festlegung 0x`
           ueber die ganze Partie, wo vorher 1x stand. Eine Kennzahl im Band,
           die die unwiderrufliche Wahl unerreichbar macht, ist ein Tausch und
           kein Fortschritt — die zweite Messlatte zaehlt beides.
           0,10 x 2.800 = 280 fl: die Gebuehr fuer den Schwur und das teurere
           Malz des ersten Jahres, erreichbar aus einer Lade von 622 fl. */
        { k: 'reinheit', name: 'Das Reinheitsgebot annehmen', anteil: 0.10,
          was: 'Gerste, Hopfen, Wasser — und der Schwur darauf vor dem Rat.',
          regel: 'Kein billiges Beibier mehr. Jedes Fass fängt mehr, und die Zunft steht hinter dem Haus.',
          /* Halber Preis, halbe Wirkung — sonst waere aus der Verbilligung
             oben ein Geschenk geworden. Gemessen mit 0,10 x Taxe und
             unveraenderter Wirkung (+16 % je Fass, +10 Ansehen): die Lade
             steigt in denselben vierzehn Jahren von 440 auf 1.027 fl statt
             auf 820, und der Adler wirbt haeufiger, weil das Haus mehr
             Ansehen hat — die billigste Antwort auf eine Werbung faellt damit
             auf 73 bis 104 fl, und die Kennzahl steht bei rho +0,807 statt
             +0,16. Eine Festlegung, die halb so viel kostet, darf nicht
             dasselbe tragen. */
          wirkung: { preis: 0.09, ansehen: 5 } },

        { k: 'ratssitz', name: 'Der Zunftbrief mit dem Ratssitz', anteil: 1.90,
          was: 'Das Haus stellt einen der zwölf Ratsherren.',
          regel: 'Außerordentliche Umlagen treffen das Haus nur noch zur Hälfte. Der Anschlag wird am Tisch gemacht, an dem das Haus sitzt.',
          wirkung: { umlageHalb: true } },

        { k: 'bierbann', name: 'Der Bierbann über vier Dörfer', anteil: 2.80,
          was: 'Ein landesherrliches Privileg: in vier Dörfern darf nur dieses Haus liefern.',
          regel: 'Vier Häuser bleiben dem Haus, solange das Haus steht. Der Landesherr nimmt dafür jährlich seinen Teil.',
          wirkung: { bindung: { n: 4, jahre: 200 }, pflichtNeu: { k: 'bannzins', name: 'Bannzins an den Landesherrn', teil: 0.16,
            sagt: 'Der Preis des Privilegs, jährlich, ohne Ende.' } } },

        /* DIE ZWEITE SPROSSE DIESER ZEIT — dieselbe Messung, schaerferer Fall.

           Nachgemessen am eingefrorenen Stand 3e6d08c, vierzehn Braujahre,
           acht Amtszeiten, Sichtlage jedes Siegelknopfes in Woche 1:

             1600  Lade 640   reinheit −280 AN   | eigentum/ratssitz/bierbann AUS
             1601  Lade 377   —                  | −7.000 / −5.500 / −8.100  AUS
             …     …                             | …
             1613  Lade 669   —                  | −11.000 / −8.600 / −13.000 AUS

           DREIZEHN JAHRE, null bedienbare Festlegungen. Das ist der haerteste
           der vier Faelle: nach dem Reinheitsgebot im Eroeffnungsjahr ist die
           unwiderrufliche Entscheidung dieser Epoche fuer den Rest der
           gemessenen Partie kein Zug mehr. Die drei grossen bleiben unberuehrt
           — sie sind das Ziel. Die neue Sprosse liegt bei 0,20 x 2.800 = 560 fl
           in 1600 und 944 fl in 1613, gegen eine Michaeli-Lade von 377 bis
           997 fl: erreichbar in den guten Jahren, unerreichbar in den mageren.
           `ab: 1604` haelt sie aus den ersten drei Amtszeiten heraus.

           Der Gegenstand ist die eine dauerhafte Loesung, die einem Haus
           dieser Ordnung offenstand, ohne dass es reich sein musste: die
           Hofbefreiung. Ein Patent aus der Residenz nahm ein Gewerbe aus der
           Zunft heraus — und die Zunft vergass es nicht. Deshalb der Ansehen. */
        { k: 'hofbefreiung', name: 'Der Hofbefreiungsbrief', anteil: 0.20, ab: 1604,
          was: 'Ein Patent aus der Residenz: das Haus liefert an den Hof und steht nicht mehr unter der Zunft.',
          regel: 'Zunftumlage und Meisterbüchse entfallen für immer. Die Meister der Stadt vergessen es nicht — sie gehen an diesem Haus vorbei.',
          wirkung: { pflichtWeg: 'zunftumlage', ansehen: -5 } },

        /* DIE LUECKE IN DER LEITER — 1600 ist der schaerfste der vier Faelle.
           Gemessen ueber 400 Wochen mit der Hand, die Festlegungen WILL: an
           ZWOELF VON VIERZEHN Michaelitagen ist keine bezahlbar. Nach
           `reinheit` (0,10) und dem Hofbefreiungsbrief (0,20) springt die
           Leiter auf 1,90 / 2,40 / 2,80 — 5.300 bis 13.000 fl gegen eine
           Michaeli-Lade, die in vierzehn Jahren nie ueber 997 fl kommt. Die
           drei grossen bleiben unberuehrt: sie sind das Ziel, und eingefroren
           waeren sie genauso unerreichbar (5.300 > 997). Was fehlt, ist die
           Sprosse dazwischen — und der Weg, ueberhaupt an Geld zu kommen.
           0,15 x Taxe = 440 fl in 1601 und 680 fl in 1613; die Vorbild-Hand
           greift bei hoechstens 45 im Hundert der Lade und kaeme in ihrem
           besten Jahr auf 449 fl — der Abstand ist gemessen und gewollt.

           BEIDE SEITEN DESSELBEN BRIEFES, und das ist der Gegenstand dieser
           Ordnung: der Rentenkauf. Wer Geld hatte, kaufte eine ewige Guelt und
           lebte vom Zins; wer keines hatte, verkaufte eine auf sein eigenes
           Haus. Zins nehmen war verboten, eine Guelt kaufen nicht — deshalb
           lief der ganze Kredit dieser Jahrhunderte ueber diesen einen Brief.
           Beides war unwiderruflich: eine EWIGE Guelt war nicht ablösbar, und
           genau deshalb gehoert sie auf diese Tafel und nicht unter die
           Angebote. */
        { k: 'stadtguelt', name: 'Die ewige Gült auf die Stadt', anteil: 0.15, ab: 1601,
          was: 'Das Haus kauft dem Rat eine Gült ab: eine Summe hin, ein fester Zins zurück, Jahr für Jahr.',
          regel: 'An jedem Michaelistag zahlt die Stadt an das Haus. Das Geld dafür ist aus dem Haus und kommt nie zurück.',
          wirkung: { ertrag: 150, ansehen: 4 } },

        /* Die andere Seite desselben Briefes: das Geld ist heute da, die Guelt
           laeuft ewig. Der Zufluss haengt an der JAHRESLAST (`wirkung.einmal`,
           siehe `wende` in preis.js) und ist damit ein Vielfaches dessen, was
           das Haus im Jahr traegt; er liegt in jedem gemessenen Jahr weit ueber
           45 im Hundert der Lade und wird von der Vorbild-Hand deshalb nie
           genommen. Er ist die eine Karte, die in dieser armen Epoche
           ueberhaupt Luft schafft — dieselbe Rolle, die `aktien` in 1884 und
           `konzern` in 1970 spielen und die in 1600 bisher gefehlt hat. Der
           Kritiker hat genau das an 1970 gezeigt: „moeglich nur, weil sie mit
           konzern anfaengt." */
        { k: 'gueltbrief', name: 'Der Gültbrief auf das Anwesen', anteil: 0.0, ab: 1603,
          was: 'Ein Bürger legt eine Summe auf den Tisch und bekommt dafür eine ewige Gült auf Haus und Hof verschrieben.',
          regel: 'Das Geld ist heute in der Lade. Die Gült darauf läuft an jedem Michaelistag, solange das Haus steht — sie ist nicht ablösbar.',
          wirkung: { einmal: 5,
            pflichtNeu: { k: 'gueltzins', name: 'Ewige Gült an den Briefinhaber', art: 'fest', teil: 0.85,
              sagt: 'Der Preis des Geldes von heute, jährlich, ohne Ende.' } } }
      ]
    },

    /* ==================================================================
       III — 1800 bis 1913.  DIE MASCHINE.
       Dampf, Eis, Gleis, Kapital. Zum ersten Mal kosten Dinge mehr, als
       ein Haus je bar besitzt.
       ================================================================== */
    3: {
      einheit: 'hl', mitte: 48, spanne: 18,
      sagt: 'Jetzt entscheidet die Menge, nicht der Rat.',

      stil: 'kontor',
      tag: 'Michaeli',
      tagSatz: 'Michaeli ist Bilanztag geblieben, auch als die Bahn schon fuhr. '
             + 'Der Buchhalter legt die Bogen auf, der Bankier sitzt daneben.',
      anschlagSatz: 'Der Anschlag ist jetzt eine Bewertung: Umsatz, Anlagen, Kredit. '
                  + 'Wer wächst, wird teurer bedient — die Bank rechnet mit.',

      rechtSatz: 'eigen, im Grundbuch',
      grund: 42000,
      lastenGrund: 11000,
      teuerungJahr: 1.048,
      teuerungKauf: 1.060,
      lastenFest: 620,
      pflichtUmsatz: 0.055,
      pflichtErtrag: 0.32,
      nachlass: 0.55,
      nachlassName: 'Der Steuerausschuss setzt die Veranlagung herab',
      /* DER NOTPFENNIG. Betriebsmittel eines Gewerbes sind der Vollstreckung
         entzogen, seit es eine Zivilprozessordnung gibt; der Steuerausschuss
         stundet den Rest und schreibt ihn fort. */
      notpfennig: 4200,
      umsatzAnfang: 17000,
      /* Der Landesherr setzt den Preis „nur noch dem Namen nach"; was
         wirklich zaehlt, ist die Konvention der Brauereien am Ort, und
         die zieht mit den Kosten mit. Der hoechste der vier Saetze. */
      satzFolgt: 0.50,
      pflichtHoehe: 0.175,
      umlageAnteil: 0.62,
      handlohnAnteil: 1.10,
      abstaende: [2, 4, 3, 5, 4, 3, 4],

      ordnung: [
        { ab: 1800, preis: 44, sagt: 'Der Landesherr setzt den Bierpreis noch, aber nur noch dem Namen nach.' },
        { ab: 1871, preis: 48, sagt: 'Reichsgründung. Die Malzsteuer wird vereinheitlicht, der Preis zieht nach.' },
        { ab: 1890, preis: 51, sagt: 'Die Brauereien der Stadt einigen sich auf einen Satz. Man nennt es Konvention.' },
        { ab: 1902, preis: 54, sagt: 'Gerstenmissernte. Der Satz steigt und fällt danach nicht mehr.' }
      ],

      pflichten: [
        { k: 'biersteuer', name: 'Biersteuer nach Malzgewicht', art: 'menge', teil: 1,
          sagt: 'Gewogen wird das Malz, nicht das Bier. Wer stärker braut, zahlt mehr — '
              + 'und wer die Darre kalt lässt, zahlt nichts.' },
        { k: 'hypothek', name: 'Zins auf die Hypothek', art: 'fest', teil: 0.65,
          sagt: 'Der Fabrikbau ist auf Kredit gebaut. Der Zins läuft, auch wenn nicht gebraut wird.' },
        { k: 'kessel', name: 'Kesselrevision und Feuerversicherung', art: 'fest', teil: 0.35,
          sagt: 'Ein Dampfkessel ist versicherungspflichtig und wird jährlich abgedrückt, '
              + 'ob er unter Dampf stand oder nicht.' },
        { k: 'gewerbesteuer', name: 'Gewerbesteuer der Gemeinde', art: 'ertrag', teil: 1,
          sagt: 'Nach Ertrag und Betriebskapital, veranlagt vom Steuerausschuss. '
              + 'Ein Jahr mit Verlust wird nicht veranlagt.' }
      ],

      umlagen: [
        { teil: 0.65, name: 'Kesselschaden und Neuabnahme', sagt: 'Ein Rohrriss im Dampfkessel. Der Sachverständige lässt nicht mit sich reden.' },
        { teil: 1.15, name: 'Kanal- und Wasseranschluss',   sagt: 'Die Stadt legt Röhren und legt die Kosten um.' },
        { teil: 0.85, name: 'Nachzahlung Biersteuer',       sagt: 'Die Revision hat drei Jahre nachgerechnet.' },
        { teil: 2.30, name: 'Bankenkrach — der Wechsel wird fällig', sagt: 'Die Bank verlängert nicht. Der Wechsel wird glatt bezahlt.' },
        { teil: 1.00, name: 'Neubau der Zufahrt',           sagt: 'Der schwere Fuhrverkehr hat die Rampenstraße zerfahren.' },
        { teil: 1.30, name: 'Anschluss an das Elektrizitätswerk', sagt: 'Die Stadt elektrifiziert. Wer Licht will, zahlt den Hausanschluss.' }
      ],
      pfand: 'Wer nicht bezahlt, dessen Wechsel geht an die Bank, und die Bank verkauft ihn weiter: '
           + 'eine Gaststätte wird auf fünf Jahre dem Adler verschrieben.',

      angebote: [
        { k: 'braumeister', name: 'Ein Braumeister aus Weihenstephan', anteil: 0.055, bauzeit: 0,
          was: 'Ein gelernter Mann mit Thermometer, Saccharometer und Zeugnis.',
          satz: 'Er misst, was bisher geschmeckt wurde. Der Ausschlag wird gleichmäßig.',
          wirkung: { preis: 0.07, ertrag: 400 } },

        { k: 'krone', name: 'Das Dach der Krone', anteil: 0.071, bauzeit: 1,
          was: 'Das Gasthaus zur Krone bekommt ein neues Dach — bezahlt von der Brauerei.',
          satz: 'Wer das Dach zahlt, bestimmt, was unter dem Dach ausgeschenkt wird.',
          wirkung: { bindung: { n: 1, jahre: 30 }, ertrag: 450 } },

        { k: 'warmluftdarre', name: 'Die Darre mit Warmluft', anteil: 0.105, bauzeit: 1,
          was: 'Kein Rauch mehr im Malz — heiße Luft durch einen Kanal.',
          satz: 'Helles Malz. Damit lässt sich helles Bier brauen, und helles Bier ist gerade Mode.',
          wirkung: { preis: 0.06, ertrag: 700 } },

        /* Zur Bahn kommt man auf zwei Weisen. Der Fuhrpark steht in vier
           Wochen im Hof; das Gleis braucht zwei Jahre und macht danach jede
           Fuhre billiger. Die Bahn legt keine Weiche für ein Haus, das seine
           Ladung ohnehin mit eigenen Pferden an die Rampe bringt. */
        { k: 'fuhrpark', name: 'Zwölf Kaltblüter und der eigene Fuhrpark', anteil: 0.105, bauzeit: 0,
          was: 'Stallung, Geschirrkammer, Schmiede und ein Fuhrmeister.',
          satz: 'Jeden Morgen um vier. Jeden Winter dieselben Hufe und dasselbe Futter.',
          sperrt: ['gleis'],
          wirkung: { ertrag: 900 } },

        { k: 'gleis', name: 'Das Gleis bis an die Rampe', anteil: 0.19, bauzeit: 2,
          was: 'Vierhundert Meter Anschlussgleis, Weiche und Prellbock.',
          satz: 'Der Waggon fährt in den Hof. Die Fuhre endet nicht mehr am Bahnhof.',
          sperrt: ['fuhrpark'],
          wirkung: { ertrag: 1200 } },

        /* Malz kaufen oder Malz machen. Der Kontrakt kostet ein Drittel und
           wirkt sofort; die eigene Mälzerei braucht zwei Jahre und verkauft
           danach an die Nachbarn. Die Handelsmälzerei liefert keinem
           Wettbewerber. */
        { k: 'malzkontrakt', name: 'Der Kontrakt mit der Handelsmälzerei', anteil: 0.075, bauzeit: 0,
          was: 'Waggonweise Sommergerstenmalz, gleichbleibend, mit Analysenschein.',
          satz: 'Immer dieselbe Ware. Der Preis dafür wird anderswo gemacht.',
          sperrt: ['maelzerei'],
          wirkung: { rohstoff: 180, ertrag: 500 } },

        { k: 'maelzerei', name: 'Die Mälzerei mit Weichstock', anteil: 0.24, bauzeit: 2,
          was: 'Weiche, Tenne, Darre in einem Bau aus Backstein.',
          satz: 'Das Haus macht sein Malz selbst und verkauft, was übrig ist.',
          sperrt: ['malzkontrakt'],
          wirkung: { rohstoff: 260, ertrag: 1500 } },

        { k: 'dampf', name: 'Die Dampfmaschine', anteil: 0.30, bauzeit: 2,
          was: 'Eine liegende Einzylindermaschine, achtzehn Pferdestärken, mit Schwungrad und Transmission.',
          satz: 'Sie rührt, pumpt, schrotet und läuft, solange Kohle da ist.',
          wirkung: { ertrag: 1900, preis: 0.03 } },

        { k: 'flaschen', name: 'Die Flaschenfüllerei', anteil: 0.33, bauzeit: 1, ab: 1880,
          was: 'Zwölf Füllhähne, Bügelverschluss, ein Spülbottich.',
          satz: 'Bier verlässt das Haus zum ersten Mal ohne Fass.',
          wirkung: { preis: 0.08, ertrag: 1800 } },

        { k: 'email', name: 'Emailschilder an fünfzehn Häusern', anteil: 0.16, bauzeit: 0, ab: 1893,
          was: 'Kobaltblaues Email, weiße Kontur, gewölbte Ecken — die neue Reklame.',
          satz: 'Der Name steht jetzt an fremden Wänden und bleibt dort dreißig Jahre hängen.',
          wirkung: { preis: 0.05, ansehen: 14, ertrag: 800 } },

        /* Kälte aus dem Berg oder Kälte aus der Maschine. Das Haus baut das
           eine oder das andere; für beides reicht weder der Hof noch der
           Kessel. Der Keller ist billiger und braucht ein Jahr länger, die
           Maschine läuft auch im warmen Winter. */
        { k: 'kaelte', name: 'Die Kältemaschine nach Linde', anteil: 0.52, bauzeit: 2, ab: 1876,
          was: 'Ammoniak-Kompressor, Solekreis, ein Maschinenhaus mit hohem Fenster.',
          satz: 'Das Sommerbrauverbot ist damit eine Gewohnheit statt eines Gesetzes.',
          sperrt: ['felsenkeller'],
          wirkung: { plaetze: 180, ertrag: 3000 } },

        { k: 'sudhelm', name: 'Das Sudhaus mit Kupferhelm', anteil: 0.66, bauzeit: 3,
          was: 'Zwei Pfannen, Läuterbottich, Kupferhauben, ein Fenster in ganzer Höhe.',
          satz: 'Das Haus sieht zum ersten Mal aus wie das Bild, das man von einer Brauerei hat.',
          wirkung: { plaetze: 90, ertrag: 3600, preis: 0.04 } },

        { k: 'felsenkeller', name: 'Der Felsenkeller', anteil: 0.38, bauzeit: 3,
          was: 'Achthundert Quadratmeter in den Berg getrieben, Lagerfässer in zwei Etagen.',
          satz: 'Wer lagern kann, muss nicht verkaufen. Das ist die ganze Macht dieses Jahrhunderts.',
          sperrt: ['kaelte'],
          wirkung: { plaetze: 320, ertrag: 2200 } },

        { k: 'niederlage', name: 'Eine Niederlage in der Kreisstadt', anteil: 0.95, bauzeit: 1,
          was: 'Lagerkeller, Kontor und zwei Fuhrwerke, achtzehn Kilometer flussabwärts.',
          satz: 'Zum ersten Mal steht Bier des Hauses, wo das Haus nicht ist.',
          wirkung: { bindung: { n: 2, jahre: 25 }, ertrag: 5200 } }
      ],

      festlegungen: [
        { k: 'aktien', name: 'Die Umwandlung in eine Aktiengesellschaft', anteil: 0.0,
          was: 'Fremdes Geld baut mit. Das Haus behält den Namen und die Mehrheit.',
          regel: 'Sofort viel Geld in der Kasse. Dafür geht in jedem Michaeli eine Dividende aus dem Haus — solange es das Haus gibt.',
          wirkung: { einmal: 7, pflichtNeu: { k: 'dividende', name: 'Dividende an die Aktionäre', teil: 0.34,
            sagt: 'Ein gutes Drittel der jährlichen Lasten, oben drauf, unkündbar.' } } },

        { k: 'bahnvertrag', name: 'Der Frachtvertrag mit der Staatsbahn', anteil: 0.75,
          was: 'Ein Ausnahmetarif für Bier in Kühlwagen, auf Dauer geschlossen.',
          regel: 'Die Fracht kostet das Haus für den Rest der Partie weniger als jeden Wettbewerber.',
          wirkung: { ertrag: 2400, umlageHalb: false } },

        { k: 'marke', name: 'Die eingetragene Handelsmarke', anteil: 0.62, ab: 1894,
          was: 'Anker und Schriftzug, eingetragen beim Patentamt nach dem Gesetz von 1894.',
          regel: 'Der Name gehört dem Haus. Jedes Fass fängt von nun an mehr, weil auf ihm etwas steht.',
          wirkung: { preis: 0.13, ansehen: 18 } },

        { k: 'konvention', name: 'Der Beitritt zur Brauereikonvention', anteil: 0.22,
          was: 'Acht Brauereien setzen einen gemeinsamen Preis und teilen die Stadt in Bezirke.',
          regel: 'Ein sicherer Preis und ein fester Bezirk. Dafür wächst das Haus nie wieder über seinen Bezirk hinaus.',
          wirkung: { preis: 0.09, wachstumsdeckel: true, ertrag: 900 } },

        /* Auch hier die Luecke, und hier ist sie eine Stufe: 0,22 und dann
           0,62 / 0,75 — 42.000 bis 58.000 M gegen eine Michaeli-Lade von
           4.562 bis 23.761. Gemessen: an ELF VON VIERZEHN Michaelitagen ist
           keine Festlegung bezahlbar. Der Kopf dieser Epoche sagt selbst:
           „Zum ersten Mal kosten Dinge mehr, als ein Haus je bar besitzt."
           Das soll so bleiben — was fehlt, ist die Sprosse UNTER der
           Konvention, damit die Amtszeiten fuenf bis acht nicht vor einer
           Wand stehen. 0,17 x Taxe = 7.500 M in 1885 und 13.100 M in 1897,
           im Band zwischen 45 und 100 im Hundert der gemessenen Lade.

           Der Gegenstand ist der eine unwiderrufliche Schritt, den die
           Gesetze dieser Jahre einem Werk dieser Groesse abverlangten: eine
           eigene Kasse nach dem Krankenversicherungsgesetz von 1883. Einmal
           errichtet, mit Statut und Vorstand — und die Beitraege laufen. */
        { k: 'krankenkasse', name: 'Die Betriebskrankenkasse für die Mannschaft', anteil: 0.17, ab: 1885,
          was: 'Eine eigene Kasse nach dem Gesetz von 1883: Statut, Beiträge, ein Vorstand aus Meistern und Mannschaft.',
          regel: 'Die Mannschaft bleibt im Haus, und die Stadt weiß es. Die Beiträge laufen von nun an in jedem Michaeli mit.',
          wirkung: { ansehen: 14, ertrag: 900,
            pflichtNeu: { k: 'kassenbeitrag', name: 'Beiträge zur Betriebskrankenkasse', art: 'fest', teil: 0.34,
              sagt: 'Zwei Drittel trägt das Haus, ein Drittel die Mannschaft — in jedem Jahr.' } } }
      ]
    },

    /* ==================================================================
       IV — 1914 bis heute.  DIE MARKE.
       Menge zaehlt weniger als Bedeutung. Das Regal gehoert einem anderen.
       ================================================================== */
    4: {
      einheit: 'hl', mitte: 130, spanne: 55,
      sagt: 'Der Preis steht im Regal, und das Regal gehört nicht dir.',

      stil: 'offset',
      tag: 'Geschäftsjahr',
      tagSatz: 'Der Michaelitag heißt jetzt Bilanzstichtag und liegt trotzdem im September. '
             + 'Was früher der Zunftschreiber vorlas, liegt heute als Umlaufbeschluss auf dem Tisch.',
      anschlagSatz: 'Der Anschlag heißt jetzt Bewertung: Umsatz, Anlagevermögen, Marktzugang. '
                  + 'Wer wächst, zahlt höhere Listungsgebühren — der Handel rechnet mit.',

      rechtSatz: 'eigen · Konzession',
      /* 620.000 gegen eine Michaeli-Kasse von 86.000 war das siebenfache
         Verhaeltnis der Epoche; in 1350, 1600 und 1884 liegt es bei drei
         bis vier. Am Bildschirm hiess das: die zweite Sprosse der Leiter
         kostete 52.000 DM, als das Haus 61.000 hatte, und ist in vierzehn
         Braujahren kein einziges Mal genommen worden. */
      grund: 500000,
      lastenGrund: 32000,
      teuerungJahr: 1.045,
      teuerungKauf: 1.065,
      /* 16.000 DM feste Last gegen eine Michaeli-Kasse von 61.000: 26 im
         Hundert der Barschaft, jedes Jahr, steigend — und der Ausstoss
         faellt in dieser Epoche von 250.000 auf 56.000. Gemessen stand die
         Rechnung 1979 bei 16.012 DM gegen 56.070 DM Ausstoss. Loehne und
         Zins eines Hauses dieser Groesse sind eine schwere Last, aber
         nicht ein Viertel der Kasse im Jahr. */
      /* Zweite Senkung, und diesmal mit der Zahl daneben, um die es geht:
         ueber vierzehn Michaelitage nimmt DER PREIS in dieser Epoche 32,0 im
         Hundert des Ausstosses — das Sechsfache dessen, was ZUSTAENDIGKEIT 4
         diesem Stueck zugesteht, und mehr als in jeder anderen Epoche. Die
         feste Last allein stand 1981 bei 17.500 DM gegen 75.732 DM Ausstoss.
         Ein Landbrauhaus mit dreissig Leuten hat schwere Fixkosten; es hat
         nicht ein Viertel seines Umsatzes an Lohn und Zins, sonst gaebe es
         die Brauerei nicht mehr. */
      lastenFest: 4500,
      pflichtUmsatz: 0.042,
      pflichtErtrag: 0.30,
      nachlass: 0.50,
      nachlassName: 'Tilgungsaussetzung der Hausbank',
      /* DER NOTPFENNIG. Was die Hausbank auf dem Konto stehen laesst, damit
         Sudhaus, Abfuellung und Fuhrpark im naechsten Jahr laufen. Eine Bank
         vollstreckt nicht in den Betrieb, der ihre Tilgung verdient. */
      notpfennig: 50000,
      umsatzAnfang: 150000,
      /* Der Handel diktiert den Aktionspreis, der Listenpreis ist Zierde —
         aber auch der Handel gibt die Kostensteigerung weiter, nur spaet
         und nie ganz. Zwischen 1350 und 1884. */
      satzFolgt: 0.60,
      pflichtHoehe: 0.145,
      /* Die hoechste Umlagequote der vier Epochen traf das Haus mit dem
         duennsten Polster. Gemessen: die Rechnung 1973 stand bei 78.600 DM
         und hat die Kasse von 45.000 auf null gesetzt; von dort ist sie in
         zehn Jahren nicht zurueckgekommen. */
      umlageAnteil: 0.36,
      handlohnAnteil: 1.05,
      abstaende: [3, 4, 3, 5, 4, 3, 5, 4],

      ordnung: [
        { ab: 1914, preis: 118, sagt: 'Kriegsbier. Die Stammwürze wird herabgesetzt, der Preis behördlich festgelegt.' },
        { ab: 1950, preis: 126, sagt: 'Nach der Währungsreform rechnet alles neu. Der Satz ist wieder frei — auf dem Papier.' },
        { ab: 1970, preis: 130, sagt: 'Der Handel diktiert die Aktionspreise. Der Listenpreis ist Zierde.' },
        { ab: 1985, preis: 142, sagt: 'Kastenpreis 14,99 im Angebot. Was daraus beim Haus ankommt, steht hier.' },
        { ab: 2002, preis: 155, sagt: 'Umstellung auf Euro. Die Kette rundet ab, die Brauerei rundet nicht auf.' },
        { ab: 2015, preis: 172, sagt: 'Der Absatz sinkt seit Jahren, der Preis steigt langsamer als die Kosten.' }
      ],

      pflichten: [
        { k: 'biersteuer', name: 'Biersteuer und Umsatzsteuer', art: 'menge', teil: 0.64,
          sagt: 'Nach Stammwürze gestaffelt. Der Mengenstaffelsatz begünstigt gerade noch dieses Haus — '
              + 'und er kennt nur den Hektoliter, der wirklich abgefüllt wurde.' },
        { k: 'listung', name: 'Listungsgebühr und Werbekostenzuschuss', art: 'menge', teil: 0.36,
          sagt: 'Wer im Regal stehen will, zahlt für den Platz, und der Zuschuss rechnet sich '
              + 'nach dem Absatz. Früher hieß das Bannmeile, heute WKZ.' },
        { k: 'loehne', name: 'Tarif, Sozialabgaben, Altersversorgung', art: 'fest', teil: 0.58,
          sagt: 'Der Tarifvertrag gilt für das ganze Braugewerbe, und die Stammbelegschaft steht '
              + 'auch in einem Jahr auf der Lohnliste, in dem wenig abgefüllt wird.' },
        { k: 'zinsen', name: 'Zins und Tilgung', art: 'fest', teil: 0.42,
          sagt: 'Die Abfüllanlage ist finanziert. Zwölf Jahre läuft die Rate.' },
        { k: 'ertragsteuer', name: 'Körperschaft- und Gewerbeertragsteuer', art: 'ertrag', teil: 1,
          sagt: 'Veranlagt wird der Gewinn des abgelaufenen Geschäftsjahres. '
              + 'Ein Verlustjahr trägt keine Ertragsteuer und wird vorgetragen.' }
      ],

      umlagen: [
        { teil: 1.30, name: 'Energie- und Frachtenkrise',       sagt: 'Das Sudhaus heizt nicht umsonst, und der Fuhrpark fährt nicht umsonst.' },
        { teil: 0.80, name: 'Tarifabschluss mit Nachzahlung',   sagt: 'Sieben Prozent rückwirkend zum Januar.' },
        /* Hier stand 'Pfand- und Rücknahmepflicht'. Eine solche Pflicht gab
           es 1980 nicht: die Verpackungsverordnung ist von 1991, das
           Zwangspfand auf Einweg von 2003. Was es gab, war das Gegenteil
           einer Pflicht — eine Verabredung der Brauereien untereinander auf
           Einheitsflasche und genormten Kasten, dem Vorbild der
           Getränkegenossenschaften nach. Wer mitmachte, kaufte seinen
           ganzen Flaschen- und Kastenbestand neu. Das kostet dasselbe Geld
           und behauptet kein Gesetz, das es nicht gab. */
        { teil: 1.25, name: 'Umstellung auf den Einheitskasten', sagt: 'Der Verband einigt sich auf Normflasche und genormten Kasten. Wer mithält, kauft den ganzen Bestand neu.' },
        { teil: 0.95, name: 'Energiepreissprung',               sagt: 'Der Sudkessel läuft mit Gas, und Gas hat sich verdoppelt.' },
        { teil: 1.55, name: 'Umbau der Kläranlage',            sagt: 'Die Abwasserverordnung gilt auch für Brauereien.' },
        { teil: 1.75, name: 'Missernte bei der Braugerste',      sagt: 'Der Malzpreis zieht an, und der Kontrakt für das nächste Jahr steht noch nicht.' }
      ],
      pfand: 'Wer nicht zahlt, verliert die Listung: eine Gaststätte wird auf fünf Jahre '
           + 'von der Nordstern-Gruppe beliefert.',

      angebote: [
        /* 0,040 war die billigste Sprosse aller vier Epochen und hat das
           Eroeffnungsjahr dieser Epoche auf 4,30 gehoben, waehrend das Band
           danach bei 2,1 bis 2,9 liegt. Zwanzigtausend Kaesten und die
           Flaschen dazu sind fuer ein Haus dieser Groesse keine Kleinigkeit. */
        { k: 'kasten', name: 'Der eigene Mehrwegkasten', anteil: 0.052, bauzeit: 0, ab: 1955,
          was: 'Zwanzig Flaschen, Kunststoff, Name in den Griff geprägt.',
          satz: 'Der Kasten steht in fremden Kellern und wirbt dort, ohne dass jemand ihn ansieht.',
          wirkung: { preis: 0.04, ansehen: 8, ertrag: 3000 } },

        /* Die erste Haelfte dieser Epoche — Krieg, Inflation, Wiederaufbau —
           braucht eigene Sprossen, sonst steht die Tafel bis 1950 halb leer. */
        { k: 'kronkorken', name: 'Die Kronkorken-Füllerei', anteil: 0.055, bauzeit: 0, bis: 1969,
          was: 'Verschließer, Spülmaschine, ein Band aus Rollen — statt des Bügels ein Blechdeckel.',
          satz: 'Schneller, dichter, billiger. Der Bügel bleibt für das Sonntagsbier.',
          wirkung: { preis: 0.05, ertrag: 4000 } },

        { k: 'holzgas', name: 'Der Holzgasgenerator am Lastwagen', anteil: 0.085, bauzeit: 0, bis: 1955,
          was: 'Ein Kessel hinter dem Führerhaus, Holzkohle statt Benzin, für die Jahre ohne Sprit.',
          satz: 'Er fährt. Langsam, russig, und er fährt.',
          wirkung: { ertrag: 5500 } },

        /* DIE ZWEITE UND DRITTE SPROSSE. Die Leiter dieser Epoche sprang von
           0,040 (Kasten) auf 0,115 (Grosshandel) — das Dreifache in einem
           Schritt, weil Kronkorken (bis 1969) und Holzgas (bis 1955) beide
           vor dem Schaujahr 1970 enden und im Spiel nie auf der Tafel
           liegen. In 1600 steht die zweite Sprosse beim 1,3fachen der
           ersten, in 1884 beim 1,2fachen. Beide neuen sind das, was ein
           Landbrauhaus der siebziger Jahre wirklich als erstes kaufte. */
        { k: 'schankanlage', name: 'Die Schankanlagen in den Wirtschaften', anteil: 0.050, bauzeit: 0, ab: 1955,
          was: 'Kompressor, Leitung, Zapfhahn mit dem Namen des Hauses — gestellt, nicht verkauft.',
          satz: 'Wer die Anlage des Hauses im Keller hat, zapft daraus, was das Haus liefert, '
              + 'und rechnet nach der Liste statt nach dem Angebot.',
          wirkung: { preis: 0.04, ertrag: 4500 } },

        { k: 'getraenkemarkt', name: 'Der Getränkemarkt am Brauereitor', anteil: 0.065, bauzeit: 0, ab: 1965,
          was: 'Eine Halle neben der Rampe, Kasten auf Palette, samstags bis zwölf.',
          satz: 'Was hier über den Tresen geht, geht ohne Handel dazwischen. '
              + 'Je Kasten bleibt dem Haus, was sonst der Zwischenhandel nimmt.',
          wirkung: { preis: 0.06, ertrag: 8000 } },

        { k: 'zelt', name: 'Das Bierzelt auf dem Volksfest', anteil: 0.070, bauzeit: 0,
          was: 'Ein Zelt mit dreitausend Plätzen, neun Tage im Jahr.',
          satz: 'Neun Tage, an denen die Stadt das Bier des Hauses trinkt und sonst nichts. '
              + 'Ausgeschenkt wird ohne Handel dazwischen, und das steht in der Abrechnung.',
          wirkung: { ertrag: 6000, ansehen: 10, preis: 0.05 } },

        /* Die Strecke gehört einem: entweder dem Großhändler oder dem Haus.
           Er billiger und ohne Fahrer, dafür kennt er den Wirt und das Haus
           nicht mehr. Kein Großhändler nimmt ein Haus, das ihm dieselben
           Gaststätten selbst anfährt. */
        { k: 'grosshandel', name: 'Der Getränkefachgroßhandel als Partner', anteil: 0.095, bauzeit: 0, ab: 1950,
          was: 'Ein Vertrag mit dem größten Zwischenhändler des Kreises.',
          satz: 'Er nimmt Menge ab und bringt sie in Gaststätten, die das Haus nie besucht.',
          sperrt: ['lastzug'],
          wirkung: { bindung: { n: 2, jahre: 20 }, ertrag: 9000 } },

        { k: 'lastzug', name: 'Zwei Lastzüge mit Anhänger', anteil: 0.15, bauzeit: 0, ab: 1950,
          was: 'Zwei Siebeneinhalbtonner mit Planenaufbau und Ladebordwand.',
          satz: 'Die Auslieferung wird ein Fahrplan statt einer Fuhre.',
          sperrt: ['grosshandel'],
          wirkung: { ertrag: 12000 } },

        /* Der Werbeetat wird einmal ausgegeben. Fernsehen kostet das Doppelte
           und reicht über den Kreis hinaus; das Trikot kostet die Hälfte und
           wirkt genau da, wo das Haus ohnehin steht. */
        { k: 'werbefilm', name: 'Der Werbefilm im Vorabendprogramm', anteil: 0.17, bauzeit: 0, ab: 1958,
          was: 'Dreißig Sekunden, ein Fluss, ein Chor, ein Schriftzug am Ende.',
          satz: 'Zum ersten Mal kennt jemand das Bier, der nie in der Stadt war.',
          sperrt: ['trikot'],
          wirkung: { preis: 0.09, ansehen: 20, ertrag: 16000 } },

        /* Eine Halle, eine Linie. Dose heißt Menge und weniger je Hektoliter,
           Bügelflasche heißt wenig Menge und viel je Hektoliter. Das Haus baut
           die eine oder die andere und weiß danach, welches Haus es ist. */
        { k: 'dosenlinie', name: 'Die Dosenlinie', anteil: 0.26, bauzeit: 1, ab: 1965,
          was: 'Weißblech, Aufreißdeckel, achtzehntausend Dosen in der Stunde.',
          satz: 'Der Handel will sie. Was der Handel will, kommt ins Regal.',
          sperrt: ['spezialitaet'],
          wirkung: { ertrag: 20000, preis: -0.03 } },

        { k: 'trikot', name: 'Die Trikotwerbung beim Landesligisten', anteil: 0.13, bauzeit: 0, ab: 1973,
          was: 'Der Schriftzug auf der Brust, zweiundzwanzig Spieltage im Jahr.',
          satz: 'Ein Verein, eine Stadt, ein Name. Billiger als Fernsehen und hält länger.',
          sperrt: ['werbefilm'],
          wirkung: { ansehen: 16, preis: 0.05, ertrag: 10000 } },

        { k: 'abfuellung', name: 'Die Abfüllanlage, 24.000 Flaschen je Stunde', anteil: 0.45, bauzeit: 2, ab: 1955,
          was: 'Reinigung, Füller, Etikettierer, Packer — eine Halle voll.',
          satz: 'Sie rechnet sich erst ab einer Menge, die das Haus noch nicht hat.',
          wirkung: { ertrag: 34000, plaetze: 900 } },

        { k: 'gaertanks', name: 'Zylindrokonische Gärtanks im Freien', anteil: 0.34, bauzeit: 2, ab: 1965,
          was: 'Acht Edelstahltanks, sechzehn Meter hoch, hinter dem alten Sudhaus.',
          satz: 'Gärung und Lagerung im selben Tank. Der Felsenkeller wird zum Museum.',
          wirkung: { plaetze: 1400, ertrag: 26000 } },

        { k: 'spezialitaet', name: 'Das Kellerbier in der Bügelflasche', anteil: 0.09, bauzeit: 1, ab: 1975,
          was: 'Naturtrüb, ungefiltert, Bügelverschluss, ein Etikett wie 1900.',
          satz: 'Kleine Menge, großer Preis. Es verkauft die Geschichte des Hauses mit.',
          sperrt: ['dosenlinie'],
          wirkung: { preis: 0.11, ansehen: 14, ertrag: 7000 } },

        /* Das alte Sudhaus ist einmal da. Entweder es wird zur Gastwirtschaft,
           dann bleibt das Haus klein und teuer je Hektoliter — oder es wird
           geräumt und das Haus zieht an die Bundesstraße. */
        { k: 'logistik', name: 'Das Logistikzentrum an der Bundesstraße', anteil: 0.80, bauzeit: 3, ab: 1960,
          was: 'Hochregal, Rampen für zwölf Lastzüge, ein Verwaltungsriegel aus Glas.',
          satz: 'Der Hof in der Stadt wird zur Adresse, die Ware kommt woanders her.',
          sperrt: ['brauhaus'],
          wirkung: { ertrag: 60000, plaetze: 2200 } },

        { k: 'brauhaus', name: 'Die Gasthausbrauerei im alten Sudhaus', anteil: 0.16, bauzeit: 2, ab: 1990,
          was: 'Kupfer, lange Tische, ein Sudwerk hinter Glas — im Bau von 1884.',
          satz: 'Das Haus verkauft zum ersten Mal wieder Bier an dem Ort, an dem es gebraut wird.',
          sperrt: ['logistik'],
          wirkung: { preis: 0.07, ansehen: 22, ertrag: 12000 } }
      ],

      festlegungen: [
        { k: 'handelsmarke', name: 'Die Handelsmarke', anteil: 0.22,
          was: 'Wort und Bild, geschützt in allen Klassen, mit Etat für die nächsten Jahre.',
          regel: 'Der Name trägt den Preis. Jedes Hektoliter fängt für den Rest der Partie mehr, weil ein Name darauf steht.',
          wirkung: { preis: 0.18, ansehen: 25 } },

        { k: 'konzern', name: 'Der Liefervertrag mit der Nordstern-Gruppe', anteil: 0.0,
          was: 'Der Konzern nimmt die Menge ab, stellt die Kästen und zahlt pünktlich.',
          regel: 'Sofort viel Geld und ein sicherer Absatz. Dafür bestimmt der Konzern den Preis — das Haus kann ihn nie wieder heben.',
          wirkung: { einmal: 6, preisDeckel: true, ertrag: 28000 } },

        { k: 'genossenschaft', name: 'Die Genossenschaft der Gastwirte', anteil: 0.22,
          was: 'Vierzig Wirte zeichnen Anteile und binden sich auf zwanzig Jahre.',
          regel: 'Vier Häuser bleiben dem Haus. Dafür geht in jedem Michaeli eine Rückvergütung an die Wirte.',
          wirkung: { bindung: { n: 4, jahre: 60 }, pflichtNeu: { k: 'rueckverguetung', name: 'Rückvergütung an die Genossen', teil: 0.19,
            sagt: 'Ein Fünftel der jährlichen Lasten, oben drauf, satzungsgemäß.' } } },

        { k: 'privat', name: 'Der Rückzug auf die eigene Braustätte', anteil: 0.11,
          was: 'Kein Handel mehr, kein Regal, keine Aktion. Nur noch Gastronomie und Werksverkauf.',
          regel: 'Die Listungsgebühr entfällt für immer, und jedes Hektoliter fängt deutlich mehr. Die großen Mengen sind damit vorbei.',
          wirkung: { pflichtWeg: 'listung', preis: 0.30, wachstumsdeckel: true } },

        /* Diese Epoche ist der Fall, der zeigt, DASS ES GEHT: hier raeumt
           eine Hand, die Festlegungen will, alle vier ab — weil `konzern`
           ohne Ausgabe zu haben ist und Geld hereinbringt. Gezaehlt wurden
           trotzdem acht von vierzehn Michaelitagen ohne bezahlbare Karte,
           und die letzten fuenf Braujahre stehen mit einer LEEREN
           Festlegungsreihe da: der Katalog ist aufgebraucht. Was fehlt, ist
           die Sprosse zwischen 0,11 und 0,22 — 0,085 x Taxe = 49.000 DM in
           1973 und 76.000 DM in 1983, gegen eine Michaeli-Lade von 50.000
           bis 70.000.

           Der Gegenstand: die Denkmalschutzgesetze der Laender kommen in
           genau diesen Jahren (Bayern 1973). Wer sein Sudhaus eintragen
           laesst, bekommt Zuschuss und Ansehen — und kann es nie wieder
           abreissen, aufstocken oder durchbrechen. Die Anlage ist von da an,
           was sie ist; deshalb der Wachstumsdeckel. */
        { k: 'denkmal', name: 'Der Eintrag des Sudhauses in die Denkmalliste', anteil: 0.085, ab: 1973,
          was: 'Kupferhelm, Klinkerfassade, Schornstein: das Sudhaus kommt unter Schutz — mit Zuschuss und mit Auflagen.',
          regel: 'Das Sudhaus wird nie wieder abgerissen und nie wieder umgebaut. Der Unterhalt nach Auflage läuft in jedem Jahr mit.',
          wirkung: { ansehen: 20, preis: 0.06, wachstumsdeckel: true,
            pflichtNeu: { k: 'denkmalauflage', name: 'Unterhalt nach Denkmalauflage', art: 'fest', teil: 0.26,
              sagt: 'Was unter Schutz steht, wird nach Auflage unterhalten — jedes Jahr, ohne Ende.' } } }
      ]
    }
  }
};
