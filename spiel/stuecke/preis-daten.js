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
   3. Die Bierordnung steigt in Jahrzehnten um ein Zehntel, der Anschlag um
      sieben Hundertstel im JAHR. Das ist die eine Zahl, an der ein
      Wirtschaftsspiel gegen Patrizier IV verliert, und sie steht hier.

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
      teuerungJahr: 1.075,
      teuerungKauf: 1.045,
      pflichtUmsatz: 0.100,
      pflichtHoehe: 0.20,
      umlageAnteil: 0.80,
      handlohnAnteil: 1.10,
      abstaende: [3, 7, 6, 8, 7, 9],

      /* Die Bierordnung. Steigt in Jahrzehnten, nicht in Jahren. */
      ordnung: [
        { ab: 1350, preis: 9,  sagt: 'Der Rat setzt den Bierpfennig auf neun je Fass.' },
        { ab: 1391, preis: 10, sagt: 'Nach der Teuerung erlaubt der Rat einen Pfennig mehr.' },
        { ab: 1444, preis: 11, sagt: 'Die Bierordnung wird erneuert: elf Pfennige je Fass.' },
        { ab: 1490, preis: 12, sagt: 'Zwölf Pfennige, und der Rat lässt nachmessen.' }
      ],

      pflichten: [
        { k: 'grutgeld',  name: 'Grutgeld an den Grutherrn', teil: 0.34,
          sagt: 'Wer Grut braucht, kauft sie vom Grutherrn. Es gibt keinen zweiten.' },
        { k: 'erbzins',   name: 'Erbzins an den Grundherrn', teil: 0.32,
          sagt: 'Das Anwesen gehört nicht dem Haus. Der Zins läuft, ob gebraut wird oder nicht.' },
        { k: 'wasserzins', name: 'Wasserzins an die Stadt', teil: 0.15,
          sagt: 'Der Brunnen auf dem Markt ist der Stadt ihrer.' },
        { k: 'mahlgeld',  name: 'Mahlgeld an die Mühle', teil: 0.19,
          sagt: 'Das Malz muss zur Mühle. Der Müller nimmt den Metzen.' }
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
          satz: 'Wer vorbeikommt, weiß von nun an, wo er ist.',
          wirkung: { ansehen: 8, preis: 0.03 } },

        { k: 'bottich', name: 'Ein zweiter Bottich aus Eichenholz', anteil: 0.20, bauzeit: 1,
          was: 'Ein Gärbottich vom Küfer, mit Weidenreifen gebunden.',
          satz: 'Zwei Bottiche heißen: der zweite Sud muss nicht warten.',
          wirkung: { plaetze: 3 } },

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
          satz: 'Fässer werden nicht mehr gekauft, sondern gebunden.',
          sperrt: ['fasskauf'],
          wirkung: { plaetze: 4, ertrag: 26 } },

        { k: 'brunnen', name: 'Der Ziehbrunnen im Hof', anteil: 0.55, bauzeit: 1,
          was: 'Achtzehn Klafter durch den Lehm bis auf den Kies.',
          satz: 'Eigenes Wasser. Der Weg zum Marktbrunnen entfällt.',
          wirkung: { pflichtWeg: 'wasserzins', ertrag: 12 } },

        { k: 'pfanne', name: 'Die kupferne Pfanne', anteil: 0.80, bauzeit: 2,
          was: 'Eine offene Pfanne aus getriebenem Kupfer über offenem Feuer — kein Helm, kein Rohr.',
          satz: 'Kupfer hält die Hitze gleich. Das Bier wird sauberer und fängt einen besseren Preis.',
          wirkung: { preis: 0.06, ertrag: 30 } },

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
          satz: 'Kühl und dunkel. Das Bier hält länger, und mehr Fässer haben Platz.',
          wirkung: { plaetze: 9, ertrag: 55 } },

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

        { k: 'vertrag', name: 'Vertrag statt Gunst', anteil: 0.32,
          was: 'Vier Wirte setzen ihr Zeichen unter einen Brief auf fünfundzwanzig Jahre.',
          regel: 'Vier Häuser nehmen nur noch Bier dieses Hauses. Die übrigen merken sich, dass sie nicht gefragt wurden.',
          wirkung: { bindung: { n: 4, jahre: 25 }, ansehen: -6 } }
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
      teuerungJahr: 1.070,
      teuerungKauf: 1.055,
      pflichtUmsatz: 0.085,
      pflichtHoehe: 0.155,
      umlageAnteil: 0.85,
      handlohnAnteil: 1.15,
      abstaende: [4, 6, 9, 7, 6, 8],

      ordnung: [
        { ab: 1517, preis: 22, sagt: 'Die Bierordnung nach dem Reinheitsgebot: zweiundzwanzig Gulden je Fass Braunbier.' },
        { ab: 1622, preis: 27, sagt: 'Kipper- und Wipperzeit. Die Münze ist schlecht, der Satz steigt.' },
        { ab: 1650, preis: 25, sagt: 'Nach dem Krieg setzt der Rat den Satz herunter — es ist niemand mehr da, der zahlt.' },
        { ab: 1710, preis: 28, sagt: 'Die Bierordnung wird erneuert, das Ungeld gleich mit.' },
        { ab: 1770, preis: 31, sagt: 'Der Kurfürst genehmigt einen Aufschlag von drei Gulden.' }
      ],

      pflichten: [
        { k: 'pachtzins', name: 'Pachtzins ans Kloster', teil: 0.38,
          sagt: 'Die Hofstatt ist Klosterlehen. Der Zins geht nach Obernberg.' },
        { k: 'zunftumlage', name: 'Zunftumlage und Meisterbüchse', teil: 0.21,
          sagt: 'Lade, Trunk, Begräbnis, Witwenkasse. Wer nicht zahlt, braut nicht.' },
        { k: 'ungeld', name: 'Ungeld auf den Ausschank', teil: 0.26,
          sagt: 'Vom ausgeschenkten Bier nimmt der Rat den zwanzigsten Pfennig.' },
        { k: 'malzaufschlag', name: 'Malzaufschlag des Kurfürsten', teil: 0.15,
          sagt: 'Seit 1543 auf jeden Scheffel Malz. Er ist nie wieder abgeschafft worden.' }
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

        { k: 'reinheit', name: 'Das Reinheitsgebot annehmen', anteil: 0.28,
          was: 'Gerste, Hopfen, Wasser — und der Schwur darauf vor dem Rat.',
          regel: 'Kein billiges Beibier mehr. Jedes Fass fängt mehr, und die Zunft steht hinter dem Haus.',
          wirkung: { preis: 0.16, ansehen: 10 } },

        { k: 'ratssitz', name: 'Der Zunftbrief mit dem Ratssitz', anteil: 1.90,
          was: 'Das Haus stellt einen der zwölf Ratsherren.',
          regel: 'Außerordentliche Umlagen treffen das Haus nur noch zur Hälfte. Der Anschlag wird am Tisch gemacht, an dem das Haus sitzt.',
          wirkung: { umlageHalb: true } },

        { k: 'bierbann', name: 'Der Bierbann über vier Dörfer', anteil: 2.80,
          was: 'Ein landesherrliches Privileg: in vier Dörfern darf nur dieses Haus liefern.',
          regel: 'Vier Häuser bleiben dem Haus, solange das Haus steht. Der Landesherr nimmt dafür jährlich seinen Teil.',
          wirkung: { bindung: { n: 4, jahre: 200 }, pflichtNeu: { k: 'bannzins', name: 'Bannzins an den Landesherrn', teil: 0.16,
            sagt: 'Der Preis des Privilegs, jährlich, ohne Ende.' } } }
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
      teuerungJahr: 1.085,
      teuerungKauf: 1.060,
      pflichtUmsatz: 0.085,
      pflichtHoehe: 0.175,
      umlageAnteil: 0.90,
      handlohnAnteil: 1.10,
      abstaende: [3, 6, 5, 7, 6, 8],

      ordnung: [
        { ab: 1800, preis: 44, sagt: 'Der Landesherr setzt den Bierpreis noch, aber nur noch dem Namen nach.' },
        { ab: 1871, preis: 48, sagt: 'Reichsgründung. Die Malzsteuer wird vereinheitlicht, der Preis zieht nach.' },
        { ab: 1890, preis: 51, sagt: 'Die Brauereien der Stadt einigen sich auf einen Satz. Man nennt es Konvention.' },
        { ab: 1902, preis: 54, sagt: 'Gerstenmissernte. Der Satz steigt und fällt danach nicht mehr.' }
      ],

      pflichten: [
        { k: 'biersteuer', name: 'Biersteuer nach Malzgewicht', teil: 0.375,
          sagt: 'Gewogen wird das Malz, nicht das Bier. Wer stärker braut, zahlt mehr.' },
        { k: 'hypothek', name: 'Zins auf die Hypothek', teil: 0.30,
          sagt: 'Der Fabrikbau ist auf Kredit gebaut. Der Zins läuft, auch wenn nicht gebraut wird.' },
        { k: 'gewerbesteuer', name: 'Gewerbesteuer der Gemeinde', teil: 0.175,
          sagt: 'Nach Ertrag und Betriebskapital, veranlagt vom Steuerausschuss.' },
        { k: 'kessel', name: 'Kesselrevision und Feuerversicherung', teil: 0.15,
          sagt: 'Ein Dampfkessel ist versicherungspflichtig und wird jährlich abgedrückt.' }
      ],

      umlagen: [
        { teil: 0.65, name: 'Kesselschaden und Neuabnahme', sagt: 'Ein Rohrriss im Dampfkessel. Der Sachverständige lässt nicht mit sich reden.' },
        { teil: 1.15, name: 'Kanal- und Wasseranschluss',   sagt: 'Die Stadt legt Röhren und legt die Kosten um.' },
        { teil: 0.85, name: 'Nachzahlung Biersteuer',       sagt: 'Die Revision hat drei Jahre nachgerechnet.' },
        { teil: 2.30, name: 'Gründerkrach — Wechsel fällig', sagt: 'Die Bank verlängert nicht. Der Wechsel wird glatt bezahlt.' },
        { teil: 1.00, name: 'Neubau der Zufahrt',           sagt: 'Der Lastwagenverkehr hat die Rampenstraße zerfahren.' },
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
          wirkung: { preis: 0.09, wachstumsdeckel: true, ertrag: 900 } }
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
      grund: 620000,
      lastenGrund: 32000,
      teuerungJahr: 1.080,
      teuerungKauf: 1.065,
      pflichtUmsatz: 0.078,
      pflichtHoehe: 0.145,
      umlageAnteil: 0.95,
      handlohnAnteil: 1.05,
      abstaende: [4, 5, 7, 6, 5, 8],

      ordnung: [
        { ab: 1914, preis: 118, sagt: 'Kriegsbier. Die Stammwürze wird herabgesetzt, der Preis behördlich festgelegt.' },
        { ab: 1950, preis: 126, sagt: 'Nach der Währungsreform rechnet alles neu. Der Satz ist wieder frei — auf dem Papier.' },
        { ab: 1970, preis: 130, sagt: 'Der Handel diktiert die Aktionspreise. Der Listenpreis ist Zierde.' },
        { ab: 1985, preis: 142, sagt: 'Kastenpreis 14,99 im Angebot. Was daraus beim Haus ankommt, steht hier.' },
        { ab: 2002, preis: 155, sagt: 'Umstellung auf Euro. Die Kette rundet ab, die Brauerei rundet nicht auf.' },
        { ab: 2015, preis: 172, sagt: 'Der Absatz sinkt seit Jahren, der Preis steigt langsamer als die Kosten.' }
      ],

      pflichten: [
        { k: 'biersteuer', name: 'Biersteuer und Umsatzsteuer', teil: 0.36,
          sagt: 'Nach Stammwürze gestaffelt. Der Mengenstaffelsatz begünstigt gerade noch dieses Haus.' },
        { k: 'loehne', name: 'Tarif, Sozialabgaben, Altersversorgung', teil: 0.29,
          sagt: 'Der Tarifvertrag gilt für das ganze Braugewerbe. Verhandelt wird anderswo.' },
        { k: 'listung', name: 'Listungsgebühr und Werbekostenzuschuss', teil: 0.20,
          sagt: 'Wer im Regal stehen will, zahlt für den Platz. Früher hieß das Bannmeile, heute WKZ.' },
        { k: 'zinsen', name: 'Zins und Tilgung', teil: 0.15,
          sagt: 'Die Abfüllanlage ist finanziert. Zwölf Jahre läuft die Rate.' }
      ],

      umlagen: [
        { teil: 1.30, name: 'Ölpreiskrise — Energie und Frachten', sagt: 'Das Sudhaus heizt mit Öl, und der Fuhrpark fährt damit.' },
        { teil: 0.80, name: 'Tarifabschluss mit Nachzahlung',   sagt: 'Sieben Prozent rückwirkend zum Januar.' },
        { teil: 1.25, name: 'Pfand- und Rücknahmepflicht',     sagt: 'Kästen, Kisten, Automaten. Das Haus zahlt die Umstellung.' },
        { teil: 0.95, name: 'Energiepreissprung',               sagt: 'Der Sudkessel läuft mit Gas, und Gas hat sich verdoppelt.' },
        { teil: 1.55, name: 'Umbau der Kläranlage',            sagt: 'Die Abwasserverordnung gilt auch für Brauereien.' },
        { teil: 1.75, name: 'Zwangspfand auf Einwegdosen',      sagt: 'Der Handel räumt die Dose aus dem Regal. Was abgefüllt ist, steht.' }
      ],
      pfand: 'Wer nicht zahlt, verliert die Listung: eine Gaststätte wird auf fünf Jahre '
           + 'von der Nordstern-Gruppe beliefert.',

      angebote: [
        { k: 'kasten', name: 'Der eigene Mehrwegkasten', anteil: 0.040, bauzeit: 0,
          was: 'Zwanzig Flaschen, Kunststoff, Name in den Griff geprägt.',
          satz: 'Der Kasten steht in fremden Kellern und wirbt dort, ohne dass jemand ihn ansieht.',
          wirkung: { preis: 0.04, ansehen: 8, ertrag: 3000 } },

        { k: 'zelt', name: 'Das Bierzelt auf dem Volksfest', anteil: 0.075, bauzeit: 0,
          was: 'Ein Zelt mit dreitausend Plätzen, neun Tage im Jahr.',
          satz: 'Neun Tage, an denen die Stadt das Bier des Hauses trinkt und sonst nichts.',
          wirkung: { ertrag: 6000, ansehen: 10 } },

        /* Die Strecke gehört einem: entweder dem Großhändler oder dem Haus.
           Er billiger und ohne Fahrer, dafür kennt er den Wirt und das Haus
           nicht mehr. Kein Großhändler nimmt ein Haus, das ihm dieselben
           Gaststätten selbst anfährt. */
        { k: 'grosshandel', name: 'Der Getränkefachgroßhandel als Partner', anteil: 0.115, bauzeit: 0,
          was: 'Ein Vertrag mit dem größten Zwischenhändler des Kreises.',
          satz: 'Er nimmt Menge ab und bringt sie in Gaststätten, die das Haus nie besucht.',
          sperrt: ['lastzug'],
          wirkung: { bindung: { n: 2, jahre: 20 }, ertrag: 9000 } },

        { k: 'lastzug', name: 'Zwei Lastzüge mit Anhänger', anteil: 0.15, bauzeit: 0,
          was: 'Zwei Siebeneinhalbtonner mit Planenaufbau und Ladebordwand.',
          satz: 'Die Auslieferung wird ein Fahrplan statt einer Fuhre.',
          sperrt: ['grosshandel'],
          wirkung: { ertrag: 12000 } },

        /* Der Werbeetat wird einmal ausgegeben. Fernsehen kostet das Doppelte
           und reicht über den Kreis hinaus; das Trikot kostet die Hälfte und
           wirkt genau da, wo das Haus ohnehin steht. */
        { k: 'werbefilm', name: 'Der Werbefilm im Vorabendprogramm', anteil: 0.21, bauzeit: 0, ab: 1958,
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

        { k: 'abfuellung', name: 'Die Abfüllanlage, 24.000 Flaschen je Stunde', anteil: 0.45, bauzeit: 2,
          was: 'Reinigung, Füller, Etikettierer, Packer — eine Halle voll.',
          satz: 'Sie rechnet sich erst ab einer Menge, die das Haus noch nicht hat.',
          wirkung: { ertrag: 34000, plaetze: 900 } },

        { k: 'gaertanks', name: 'Zylindrokonische Gärtanks im Freien', anteil: 0.34, bauzeit: 2,
          was: 'Acht Edelstahltanks, sechzehn Meter hoch, hinter dem alten Sudhaus.',
          satz: 'Gärung und Lagerung im selben Tank. Der Felsenkeller wird zum Museum.',
          wirkung: { plaetze: 1400, ertrag: 26000 } },

        { k: 'spezialitaet', name: 'Das Kellerbier in der Bügelflasche', anteil: 0.09, bauzeit: 1, ab: 1985,
          was: 'Naturtrüb, ungefiltert, Bügelverschluss, ein Etikett wie 1900.',
          satz: 'Kleine Menge, großer Preis. Es verkauft die Geschichte des Hauses mit.',
          sperrt: ['dosenlinie'],
          wirkung: { preis: 0.11, ansehen: 14, ertrag: 7000 } },

        /* Das alte Sudhaus ist einmal da. Entweder es wird zur Gastwirtschaft,
           dann bleibt das Haus klein und teuer je Hektoliter — oder es wird
           geräumt und das Haus zieht an die Bundesstraße. */
        { k: 'logistik', name: 'Das Logistikzentrum an der Bundesstraße', anteil: 0.80, bauzeit: 3,
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
        { k: 'handelsmarke', name: 'Die Handelsmarke', anteil: 0.28,
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

        { k: 'privat', name: 'Der Rückzug auf die eigene Braustätte', anteil: 0.13,
          was: 'Kein Handel mehr, kein Regal, keine Aktion. Nur noch Gastronomie und Werksverkauf.',
          regel: 'Die Listungsgebühr entfällt für immer, und jedes Hektoliter fängt deutlich mehr. Die großen Mengen sind damit vorbei.',
          wirkung: { pflichtWeg: 'listung', preis: 0.30, wachstumsdeckel: true } }
      ]
    }
  }
};
