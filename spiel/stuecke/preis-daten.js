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
      sagt: 'Der Rat setzt den Bierpfennig. Wer darueber geht, wird gestraft.',

      stil: 'pergament',
      tag: 'Michaeli',
      tagSatz: 'Am Michaelistag, dem 29. September, wird faellig, was das Jahr ueber gestundet war. '
             + 'Danach steht die Pfanne wieder kalt, bis der Zins bezahlt ist.',
      anschlagSatz: 'Der Anschlag ist die Schaetzung des Rats: was durch das Haus geht und was im Haus liegt. '
                  + 'Boettcher, Maurer und Grutherr rechnen mit derselben Zahl.',

      grund: 470,
      teuerungJahr: 1.075,
      teuerungKauf: 1.10,
      pflichtAnteil: 0.22,
      umlageAnteil: 0.55,
      handlohnAnteil: 0.85,
      abstaende: [3, 7, 6, 8, 7, 9],

      /* Die Bierordnung. Steigt in Jahrzehnten, nicht in Jahren. */
      ordnung: [
        { ab: 1350, preis: 9,  sagt: 'Der Rat setzt den Bierpfennig auf neun je Fass.' },
        { ab: 1391, preis: 10, sagt: 'Nach der Teuerung erlaubt der Rat einen Pfennig mehr.' },
        { ab: 1444, preis: 11, sagt: 'Die Bierordnung wird erneuert: elf Pfennige je Fass.' },
        { ab: 1490, preis: 12, sagt: 'Zwoelf Pfennige, und der Rat laesst nachmessen.' }
      ],

      pflichten: [
        { k: 'grutgeld',  name: 'Grutgeld an den Grutherrn', anteil: 0.075,
          sagt: 'Wer Grut braucht, kauft sie vom Grutherrn. Es gibt keinen zweiten.' },
        { k: 'erbzins',   name: 'Erbzins an den Grundherrn', anteil: 0.070,
          sagt: 'Das Anwesen gehoert nicht dem Haus. Der Zins laeuft, ob gebraut wird oder nicht.' },
        { k: 'wasserzins', name: 'Wasserzins an die Stadt', anteil: 0.035,
          sagt: 'Der Brunnen auf dem Markt ist der Stadt ihrer.' },
        { k: 'mahlgeld',  name: 'Mahlgeld an die Muehle', anteil: 0.040,
          sagt: 'Das Malz muss zur Muehle. Der Mueller nimmt den Metzen.' }
      ],

      umlagen: [
        { name: 'Umlage fuer den Mauerbau',   sagt: 'Die Stadt schliesst den Ring nach Sueden.' },
        { name: 'Landfriedensgeld',           sagt: 'Der Bund der Staedte haelt Reisige. Bezahlt wird von den Haeusern.' },
        { name: 'Brandschatzung',             sagt: 'Ein Heerhaufe steht vor dem Tor und zieht gegen Geld weiter.' },
        { name: 'Zehnt auf das Braugeraet',   sagt: 'Der Rat besteuert Pfanne, Bottich und Fass nach Schaetzung.' },
        { name: 'Umlage fuer die Bruecke',    sagt: 'Das Hochwasser hat den Steg genommen.' }
      ],
      pfand: 'Wer den Anschlag nicht abtraegt, dem nimmt der Rat ein Pfand: eine Wirtschaft wird '
           + 'auf fuenf Jahre dem Adler zugesprochen.',

      angebote: [
        { k: 'dach', name: 'Das Dach ueber der Pfanne', anteil: 0.07, bauzeit: 0,
          was: 'Ein Schindeldach auf vier Staendern, ueber der offenen Pfanne.',
          satz: 'Regen loescht das Feuer nicht mehr, und der Sud faellt nicht aus.',
          wirkung: { ertrag: 16 } },

        { k: 'grutkasten', name: 'Der Grutkasten unter Schloss', anteil: 0.12, bauzeit: 0,
          was: 'Eine verschlossene Truhe fuer die Grut, mit dem Mass daneben.',
          satz: 'Gewogen ausgegeben, gewogen abgerechnet.',
          wirkung: { rohstoff: 14 } },

        { k: 'schild', name: 'Das Hausschild ueberm Tor', anteil: 0.10, bauzeit: 0,
          was: 'Ein geschmiedeter Anker an einem Ausleger, weithin sichtbar.',
          satz: 'Wer vorbeikommt, weiss von nun an, wo er ist.',
          wirkung: { ansehen: 8, preis: 0.03 } },

        { k: 'bottich', name: 'Ein zweiter Bottich aus Eichenholz', anteil: 0.20, bauzeit: 1,
          was: 'Ein Gaerbottich vom Kuefer, mit Weidenreifen gebunden.',
          satz: 'Zwei Bottiche heissen: der zweite Sud muss nicht warten.',
          wirkung: { plaetze: 3 } },

        { k: 'ochsenstall', name: 'Der Ochsenstall am Tor', anteil: 0.24, bauzeit: 0,
          was: 'Ein eigener Stall statt des geliehenen Gespanns.',
          satz: 'Der Ochse steht im Haus und wartet nicht auf den Nachbarn.',
          sperrt: ['karrengaul'],
          wirkung: { ertrag: 34 } },

        { k: 'karrengaul', name: 'Ein Karrengaul statt des Ochsen', anteil: 0.42, bauzeit: 0,
          was: 'Ein kaltbluetiges Pferd, Geschirr, Hufbeschlag.',
          satz: 'Doppelt so schnell wie der Ochse und dreimal so teuer im Futter.',
          sperrt: ['ochsenstall'],
          wirkung: { ertrag: 62 } },

        { k: 'boettcher', name: 'Der Boettcher im Haus', anteil: 0.34, bauzeit: 1,
          was: 'Eine Werkstatt im Hof, Daubenholz unterm Vordach.',
          satz: 'Faesser werden nicht mehr gekauft, sondern gebunden.',
          wirkung: { plaetze: 4, ertrag: 26 } },

        { k: 'brunnen', name: 'Der Ziehbrunnen im Hof', anteil: 0.55, bauzeit: 1,
          was: 'Achtzehn Klafter durch den Lehm bis auf den Kies.',
          satz: 'Eigenes Wasser. Der Weg zum Marktbrunnen entfaellt.',
          wirkung: { pflichtWeg: 'wasserzins', ertrag: 12 } },

        { k: 'pfanne', name: 'Die kupferne Pfanne', anteil: 0.80, bauzeit: 2,
          was: 'Eine offene Pfanne aus getriebenem Kupfer ueber offenem Feuer — kein Helm, kein Rohr.',
          satz: 'Kupfer haelt die Hitze gleich. Das Bier wird sauberer und faengt einen besseren Preis.',
          wirkung: { preis: 0.06, ertrag: 30 } },

        { k: 'muehlanteil', name: 'Ein Achtel an der Stadtmuehle', anteil: 1.05, bauzeit: 0,
          was: 'Ein Anteilbrief, im Ratsbuch eingetragen.',
          satz: 'Wer Anteil hat, mahlt zuerst und zahlt den Metzen an sich selbst.',
          wirkung: { pflichtWeg: 'mahlgeld', ertrag: 40 } },

        { k: 'gewoelbe', name: 'Der gewoelbte Keller unterm Hof', anteil: 1.90, bauzeit: 3,
          was: 'Ein Tonnengewoelbe aus Bruchstein, drei Klafter unter dem Hof.',
          satz: 'Kuehl und dunkel. Das Bier haelt laenger, und mehr Faesser haben Platz.',
          wirkung: { plaetze: 9, ertrag: 55 } },

        { k: 'bannmeile', name: 'Die Bannmeile auf zehn Jahre', anteil: 2.60, bauzeit: 0,
          was: 'Ein Ratsbrief: kein fremdes Bier innerhalb einer Meile.',
          satz: 'Drei Haeuser duerfen zehn Jahre lang nichts anderes ausschenken.',
          wirkung: { bindung: { n: 3, jahre: 10 } } }
      ],

      festlegungen: [
        { k: 'freikauf', name: 'Der Freikauf vom Grundherrn', anteil: 2.20,
          was: 'Eine Ablosesumme, ein Siegel, ein Eintrag im Salbuch.',
          regel: 'Der Erbzins endet. Fuer immer. Das Haus gehoert von heute an dem Haus.',
          wirkung: { pflichtWeg: 'erbzins' } },

        { k: 'realrecht', name: 'Das Braurecht ans Haus', anteil: 1.70,
          was: 'Das Recht wird vom Menschen geloest und auf die Hofstatt geschrieben.',
          regel: 'Kein Handlohn mehr bei jedem Erbfall. Wer erbt, erbt auch die Pfanne.',
          wirkung: { handlohnWeg: true } },

        { k: 'hopfen', name: 'Hopfen statt Grut', anteil: 1.40, ab: 1380,
          was: 'Der Grutzwang wird abgeloest, Hopfen aus Boehmen kommt auf den Wagen.',
          regel: 'Das Grutgeld entfaellt. Das Bier haelt laenger, reist weiter und faengt mehr.',
          wirkung: { pflichtWeg: 'grutgeld', rohstoff: 26, preis: 0.09 } },

        { k: 'vertrag', name: 'Vertrag statt Gunst', anteil: 0.90,
          was: 'Vier Wirte setzen ihr Zeichen unter einen Brief auf fuenfundzwanzig Jahre.',
          regel: 'Vier Haeuser nehmen nur noch Bier dieses Hauses. Die uebrigen merken sich, dass sie nicht gefragt wurden.',
          wirkung: { bindung: { n: 4, jahre: 25 }, ansehen: -6 } }
      ]
    },

    /* ==================================================================
       II — 1517 bis 1799.  DIE ORDNUNG.
       Stein statt Holz, Besitz statt Pacht, Zunft statt Zufall.
       ================================================================== */
    2: {
      einheit: 'Fass', mitte: 22, spanne: 7,
      sagt: 'Die Zunft haelt den Preis. Ausbrechen kostet den Ruf.',

      stil: 'kanzlei',
      tag: 'Michaeli',
      tagSatz: 'Michaeli ist Zinstag und Rechnungstag. Der Zunftschreiber liest vor, '
             + 'was jedes Haus im vergangenen Jahr gesotten hat.',
      anschlagSatz: 'Der Anschlag steht im Steuerbuch der Stadt: Vermoegen und Gewerb, '
                  + 'geschaetzt von zwei Ratsherren und einem Zunftmeister.',

      grund: 2800,
      teuerungJahr: 1.070,
      teuerungKauf: 1.11,
      pflichtAnteil: 0.21,
      umlageAnteil: 0.60,
      handlohnAnteil: 0.90,
      abstaende: [4, 6, 9, 7, 6, 8],

      ordnung: [
        { ab: 1517, preis: 22, sagt: 'Die Bierordnung nach dem Reinheitsgebot: zweiundzwanzig Gulden je Fass Braunbier.' },
        { ab: 1622, preis: 27, sagt: 'Kipper- und Wipperzeit. Die Muenze ist schlecht, der Satz steigt.' },
        { ab: 1650, preis: 25, sagt: 'Nach dem Krieg setzt der Rat den Satz herunter — es ist niemand mehr da, der zahlt.' },
        { ab: 1710, preis: 28, sagt: 'Die Bierordnung wird erneuert, das Ungeld gleich mit.' },
        { ab: 1770, preis: 31, sagt: 'Der Kurfuerst genehmigt einen Aufschlag von drei Gulden.' }
      ],

      pflichten: [
        { k: 'pachtzins', name: 'Pachtzins ans Kloster', anteil: 0.080,
          sagt: 'Die Hofstatt ist Klosterlehen. Der Zins geht nach Obernberg.' },
        { k: 'zunftumlage', name: 'Zunftumlage und Meisterbuechse', anteil: 0.045,
          sagt: 'Lade, Trunk, Begraebnis, Witwenkasse. Wer nicht zahlt, braut nicht.' },
        { k: 'ungeld', name: 'Ungeld auf den Ausschank', anteil: 0.055,
          sagt: 'Vom ausgeschenkten Bier nimmt der Rat den zwanzigsten Pfennig.' },
        { k: 'malzaufschlag', name: 'Malzaufschlag des Kurfuersten', anteil: 0.030,
          sagt: 'Seit 1543 auf jeden Scheffel Malz. Er ist nie wieder abgeschafft worden.' }
      ],

      umlagen: [
        { name: 'Tuerkensteuer',        sagt: 'Der Reichstag hat sie bewilligt. Die Stadt legt sie um.' },
        { name: 'Kriegskontribution',   sagt: 'Einquartierung oder Geld. Das Haus waehlt das Geld.' },
        { name: 'Quartierlast',         sagt: 'Vierzig Reiter, sechs Wochen, Hafer inbegriffen.' },
        { name: 'Bauumlage fuer das Rathaus', sagt: 'Der Rat baut sich einen Giebel mit Uhr.' },
        { name: 'Brandsteuer nach dem Stadtbrand', sagt: 'Die halbe Gasse hinter der Kirche ist abgebrannt.' }
      ],
      pfand: 'Wer den Anschlag nicht abtraegt, dem legt die Zunft die Braugerechtigkeit still: '
           + 'eine Wirtschaft geht auf fuenf Jahre an den Adler.',

      angebote: [
        { k: 'darre', name: 'Die Darre ueberm Malzboden', anteil: 0.065, bauzeit: 0,
          was: 'Ein Rauchabzug und ein Lattenrost ueber der Feuerstelle.',
          satz: 'Gedarrtes Malz laesst sich lagern. Das Braujahr wird planbar.',
          wirkung: { rohstoff: 20, ertrag: 60 } },

        { k: 'probe', name: 'Die Bierprobe des Rats bestehen', anteil: 0.09, bauzeit: 0,
          was: 'Drei Ratsherren, eine Lederhose und eine Bank aus Eichenholz.',
          satz: 'Wessen Bier die Bank haelt, dessen Fass gilt als recht gesotten.',
          wirkung: { preis: 0.05, ansehen: 5 } },

        { k: 'wappenbrief', name: 'Der Wappenbrief', anteil: 0.15, bauzeit: 0,
          was: 'Ein kaiserlicher Brief mit Anker und Helmzier, gerahmt in der Stube.',
          satz: 'Kein Recht, nur Rang. Rang laesst sich in Gulden umrechnen.',
          wirkung: { ansehen: 12, preis: 0.04 } },

        { k: 'schrotmuehle', name: 'Die Schrotmuehle im Haus', anteil: 0.26, bauzeit: 1,
          was: 'Ein Handgang mit zwei Steinen, spaeter ein Rosswerk.',
          satz: 'Das Malz verlaesst den Hof nicht mehr.',
          wirkung: { pflichtWeg: 'mahlgeld', ertrag: 120 } },

        { k: 'fasslager', name: 'Das Fasslager unter der Kirche', anteil: 0.30, bauzeit: 1,
          was: 'Zwei Gewoelbe im Berg, von St. Michael gepachtet.',
          satz: 'Kuehl im Sommer. Was dort liegt, ueberlebt den Juli.',
          wirkung: { plaetze: 14 } },

        { k: 'planwagen', name: 'Zwei Roesser und ein Planwagen', anteil: 0.38, bauzeit: 0,
          was: 'Ein gedeckter Wagen mit Bremse, fuer die Strassen ueber Land.',
          satz: 'Neun Meilen am Tag statt sieben, und das Fass kommt trocken an.',
          wirkung: { ertrag: 210 } },

        { k: 'hopfengarten', name: 'Der Hopfengarten am Suedhang', anteil: 0.55, bauzeit: 3,
          was: 'Vierhundert Stangen, drei Jahre bis zum ersten vollen Ertrag.',
          satz: 'Eigener Hopfen. Der Haendler auf dem Markt verliert seine Macht ueber das Haus.',
          wirkung: { rohstoff: 55, ertrag: 90 } },

        { k: 'zunftrecht', name: 'Das Zunftrecht fuer den Sohn', anteil: 0.62, bauzeit: 0,
          was: 'Meisterstueck, Mutgeld, Einschreibung in die Lade — im Voraus bezahlt.',
          satz: 'Der Erbe ist Meister, bevor er erbt. Der Handlohn faellt halb so hoch aus.',
          wirkung: { handlohnHalb: true, ertrag: 40 } },

        { k: 'eiskeller', name: 'Der Eiskeller im Berg', anteil: 0.85, bauzeit: 2,
          was: 'Eine Grube mit Strohdecke, im Winter aus dem Fluss gefuellt.',
          satz: 'Untergaerig gebraut, kalt gelagert. Das Bier haelt bis in den Herbst.',
          wirkung: { plaetze: 22, preis: 0.05 } },

        { k: 'nachbarhaus', name: 'Der Kauf des Nachbarhauses', anteil: 1.30, bauzeit: 0,
          was: 'Die Hofstatt links vom Tor, samt Scheune und Braurecht des verstorbenen Nachbarn.',
          satz: 'Der Hof wird doppelt so gross, und ein Braurecht weniger ist in der Stadt.',
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
          was: 'Die Hofstatt wird aus dem Klosterlehen geloest und ins Grundbuch geschrieben.',
          regel: 'Der Pachtzins endet. Fuer immer. Aus dem Paechter wird der Eigentuemer.',
          wirkung: { pflichtWeg: 'pachtzins' } },

        { k: 'reinheit', name: 'Das Reinheitsgebot annehmen', anteil: 1.10,
          was: 'Gerste, Hopfen, Wasser — und der Schwur darauf vor dem Rat.',
          regel: 'Kein billiges Beibier mehr. Jedes Fass faengt mehr, und die Zunft steht hinter dem Haus.',
          wirkung: { preis: 0.16, ansehen: 10 } },

        { k: 'ratssitz', name: 'Der Zunftbrief mit dem Ratssitz', anteil: 1.90,
          was: 'Das Haus stellt einen der zwoelf Ratsherren.',
          regel: 'Ausserordentliche Umlagen treffen das Haus nur noch zur Haelfte. Der Anschlag wird am Tisch gemacht, an dem das Haus sitzt.',
          wirkung: { umlageHalb: true } },

        { k: 'bierbann', name: 'Der Bierbann ueber vier Doerfer', anteil: 2.80,
          was: 'Ein landesherrliches Privileg: in vier Doerfern darf nur dieses Haus liefern.',
          regel: 'Vier Haeuser bleiben dem Haus, solange das Haus steht. Der Landesherr nimmt dafuer jaehrlich seinen Teil.',
          wirkung: { bindung: { n: 4, jahre: 200 }, pflichtNeu: { k: 'bannzins', name: 'Bannzins an den Landesherrn', anteil: 0.045,
            sagt: 'Der Preis des Privilegs, jaehrlich, ohne Ende.' } } }
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
                  + 'Wer waechst, wird teurer bedient — die Bank rechnet mit.',

      grund: 42000,
      teuerungJahr: 1.085,
      teuerungKauf: 1.12,
      pflichtAnteil: 0.20,
      umlageAnteil: 0.50,
      handlohnAnteil: 0.70,
      abstaende: [3, 6, 5, 7, 6, 8],

      ordnung: [
        { ab: 1800, preis: 44, sagt: 'Der Landesherr setzt den Bierpreis noch, aber nur noch dem Namen nach.' },
        { ab: 1871, preis: 48, sagt: 'Reichsgruendung. Die Malzsteuer wird vereinheitlicht, der Preis zieht nach.' },
        { ab: 1890, preis: 51, sagt: 'Die Brauereien der Stadt einigen sich auf einen Satz. Man nennt es Konvention.' },
        { ab: 1902, preis: 54, sagt: 'Gerstenmissernte. Der Satz steigt und faellt danach nicht mehr.' }
      ],

      pflichten: [
        { k: 'biersteuer', name: 'Biersteuer nach Malzgewicht', anteil: 0.075,
          sagt: 'Gewogen wird das Malz, nicht das Bier. Wer staerker braut, zahlt mehr.' },
        { k: 'hypothek', name: 'Zins auf die Hypothek', anteil: 0.060,
          sagt: 'Der Fabrikbau ist auf Kredit gebaut. Der Zins laeuft, auch wenn nicht gebraut wird.' },
        { k: 'gewerbesteuer', name: 'Gewerbesteuer der Gemeinde', anteil: 0.035,
          sagt: 'Nach Ertrag und Betriebskapital, veranlagt vom Steuerausschuss.' },
        { k: 'kessel', name: 'Kesselrevision und Feuerversicherung', anteil: 0.030,
          sagt: 'Ein Dampfkessel ist versicherungspflichtig und wird jaehrlich abgedrueckt.' }
      ],

      umlagen: [
        { name: 'Kesselschaden und Neuabnahme', sagt: 'Ein Rohrriss im Dampfkessel. Der Sachverstaendige laesst nicht mit sich reden.' },
        { name: 'Kanal- und Wasseranschluss',   sagt: 'Die Stadt legt Roehren und legt die Kosten um.' },
        { name: 'Nachzahlung Biersteuer',       sagt: 'Die Revision hat drei Jahre nachgerechnet.' },
        { name: 'Gruenderkrach — Wechsel faellig', sagt: 'Die Bank verlaengert nicht. Der Wechsel wird glatt bezahlt.' },
        { name: 'Neubau der Zufahrt',           sagt: 'Der Lastwagenverkehr hat die Rampenstrasse zerfahren.' }
      ],
      pfand: 'Wer nicht bezahlt, dessen Wechsel geht an die Bank, und die Bank verkauft ihn weiter: '
           + 'eine Gaststaette wird auf fuenf Jahre dem Adler verschrieben.',

      angebote: [
        { k: 'braumeister', name: 'Ein Braumeister aus Weihenstephan', anteil: 0.055, bauzeit: 0,
          was: 'Ein gelernter Mann mit Thermometer, Saccharometer und Zeugnis.',
          satz: 'Er misst, was bisher geschmeckt wurde. Der Ausschlag wird gleichmaessig.',
          wirkung: { preis: 0.07, ertrag: 900 } },

        { k: 'krone', name: 'Das Dach der Krone', anteil: 0.071, bauzeit: 1,
          was: 'Das Gasthaus zur Krone bekommt ein neues Dach — bezahlt von der Brauerei.',
          satz: 'Wer das Dach zahlt, bestimmt, was unter dem Dach ausgeschenkt wird.',
          wirkung: { bindung: { n: 1, jahre: 30 }, ertrag: 620 } },

        { k: 'darre', name: 'Die Darre mit Warmluft', anteil: 0.105, bauzeit: 1,
          was: 'Kein Rauch mehr im Malz — heisse Luft durch einen Kanal.',
          satz: 'Helles Malz. Damit laesst sich helles Bier brauen, und helles Bier ist gerade Mode.',
          wirkung: { preis: 0.06, ertrag: 1100 } },

        { k: 'gleis', name: 'Das Gleis bis an die Rampe', anteil: 0.19, bauzeit: 2,
          was: 'Vierhundert Meter Anschlussgleis, Weiche und Prellbock.',
          satz: 'Der Waggon faehrt in den Hof. Die Fuhre endet nicht mehr am Bahnhof.',
          wirkung: { ertrag: 2600 } },

        { k: 'maelzerei', name: 'Die Maelzerei mit Weichstock', anteil: 0.24, bauzeit: 2,
          was: 'Weiche, Tenne, Darre in einem Bau aus Backstein.',
          satz: 'Das Haus macht sein Malz selbst und verkauft, was uebrig ist.',
          wirkung: { rohstoff: 260, ertrag: 1900 } },

        { k: 'dampf', name: 'Die Dampfmaschine', anteil: 0.30, bauzeit: 2,
          was: 'Eine liegende Einzylindermaschine, achtzehn Pferdestaerken, mit Schwungrad und Transmission.',
          satz: 'Sie ruehrt, pumpt, schrotet und laeuft, solange Kohle da ist.',
          wirkung: { ertrag: 3400, preis: 0.03 } },

        { k: 'flaschen', name: 'Die Flaschenfuellerei', anteil: 0.33, bauzeit: 1, ab: 1880,
          was: 'Zwoelf Fuellhaehne, Buegelverschluss, ein Spuelbottich.',
          satz: 'Bier verlaesst das Haus zum ersten Mal ohne Fass.',
          wirkung: { preis: 0.08, ertrag: 2200 } },

        { k: 'email', name: 'Emailschilder an fuenfzehn Haeusern', anteil: 0.16, bauzeit: 0, ab: 1893,
          was: 'Kobaltblaues Email, weisse Kontur, gewoelbte Ecken — die neue Reklame.',
          satz: 'Der Name steht jetzt an fremden Waenden und bleibt dort dreissig Jahre haengen.',
          wirkung: { preis: 0.05, ansehen: 14, ertrag: 800 } },

        { k: 'kaelte', name: 'Die Kaeltemaschine nach Linde', anteil: 0.52, bauzeit: 2, ab: 1876,
          was: 'Ammoniak-Kompressor, Solekreis, ein Maschinenhaus mit hohem Fenster.',
          satz: 'Das Sommerbrauverbot ist damit eine Gewohnheit statt eines Gesetzes.',
          wirkung: { plaetze: 180, ertrag: 4200 } },

        { k: 'sudhelm', name: 'Das Sudhaus mit Kupferhelm', anteil: 0.66, bauzeit: 3,
          was: 'Zwei Pfannen, Laeuterbottich, Kupferhauben, ein Fenster in ganzer Hoehe.',
          satz: 'Das Haus sieht zum ersten Mal aus wie das Bild, das man von einer Brauerei hat.',
          wirkung: { plaetze: 90, ertrag: 5200, preis: 0.04 } },

        { k: 'felsenkeller', name: 'Der Felsenkeller', anteil: 0.38, bauzeit: 3,
          was: 'Achthundert Quadratmeter in den Berg getrieben, Lagerfaesser in zwei Etagen.',
          satz: 'Wer lagern kann, muss nicht verkaufen. Das ist die ganze Macht dieses Jahrhunderts.',
          wirkung: { plaetze: 320, ertrag: 3800 } },

        { k: 'niederlage', name: 'Eine Niederlage in der Kreisstadt', anteil: 0.95, bauzeit: 1,
          was: 'Lagerkeller, Kontor und zwei Fuhrwerke, achtzehn Kilometer flussabwaerts.',
          satz: 'Zum ersten Mal steht Bier des Hauses, wo das Haus nicht ist.',
          wirkung: { bindung: { n: 2, jahre: 25 }, ertrag: 7000 } }
      ],

      festlegungen: [
        { k: 'aktien', name: 'Die Umwandlung in eine Aktiengesellschaft', anteil: 0.0,
          was: 'Fremdes Geld baut mit. Das Haus behaelt den Namen und die Mehrheit.',
          regel: 'Sofort viel Geld in der Kasse. Dafuer geht in jedem Michaeli eine Dividende aus dem Haus — solange es das Haus gibt.',
          wirkung: { einmal: 2.60, pflichtNeu: { k: 'dividende', name: 'Dividende an die Aktionaere', anteil: 0.075,
            sagt: 'Sieben und ein halbes Hundertstel des Anschlags, jaehrlich, unkuendbar.' } } },

        { k: 'bahnvertrag', name: 'Der Frachtvertrag mit der Staatsbahn', anteil: 1.10,
          was: 'Ein Ausnahmetarif fuer Bier in Kuehlwagen, auf Dauer geschlossen.',
          regel: 'Die Fracht kostet das Haus fuer den Rest der Partie weniger als jeden Wettbewerber.',
          wirkung: { ertrag: 5200, umlageHalb: false } },

        { k: 'marke', name: 'Die eingetragene Handelsmarke', anteil: 0.85, ab: 1894,
          was: 'Anker und Schriftzug, eingetragen beim Patentamt nach dem Gesetz von 1894.',
          regel: 'Der Name gehoert dem Haus. Jedes Fass faengt von nun an mehr, weil auf ihm etwas steht.',
          wirkung: { preis: 0.13, ansehen: 18 } },

        { k: 'konvention', name: 'Der Beitritt zur Brauereikonvention', anteil: 0.45,
          was: 'Acht Brauereien setzen einen gemeinsamen Preis und teilen die Stadt in Bezirke.',
          regel: 'Ein sicherer Preis und ein fester Bezirk. Dafuer waechst das Haus nie wieder ueber seinen Bezirk hinaus.',
          wirkung: { preis: 0.09, wachstumsdeckel: true, ertrag: 1600 } }
      ]
    },

    /* ==================================================================
       IV — 1914 bis heute.  DIE MARKE.
       Menge zaehlt weniger als Bedeutung. Das Regal gehoert einem anderen.
       ================================================================== */
    4: {
      einheit: 'hl', mitte: 130, spanne: 55,
      sagt: 'Der Preis steht im Regal, und das Regal gehoert nicht dir.',

      stil: 'offset',
      tag: 'Geschäftsjahr',
      tagSatz: 'Der Michaelitag heisst jetzt Bilanzstichtag und liegt trotzdem im September. '
             + 'Was frueher der Zunftschreiber vorlas, liegt heute als Umlaufbeschluss auf dem Tisch.',
      anschlagSatz: 'Der Anschlag heisst jetzt Bewertung: Umsatz, Anlagevermoegen, Marktzugang. '
                  + 'Wer waechst, zahlt hoehere Listungsgebuehren — der Handel rechnet mit.',

      grund: 620000,
      teuerungJahr: 1.080,
      teuerungKauf: 1.13,
      pflichtAnteil: 0.19,
      umlageAnteil: 0.45,
      handlohnAnteil: 0.60,
      abstaende: [4, 5, 7, 6, 5, 8],

      ordnung: [
        { ab: 1914, preis: 118, sagt: 'Kriegsbier. Die Stammwuerze wird herabgesetzt, der Preis behoerdlich festgelegt.' },
        { ab: 1950, preis: 126, sagt: 'Nach der Waehrungsreform rechnet alles neu. Der Satz ist wieder frei — auf dem Papier.' },
        { ab: 1970, preis: 130, sagt: 'Der Handel diktiert die Aktionspreise. Der Listenpreis ist Zierde.' },
        { ab: 1985, preis: 142, sagt: 'Kastenpreis 14,99 im Angebot. Was daraus beim Haus ankommt, steht hier.' },
        { ab: 2002, preis: 155, sagt: 'Umstellung auf Euro. Die Kette rundet ab, die Brauerei rundet nicht auf.' },
        { ab: 2015, preis: 172, sagt: 'Der Absatz sinkt seit Jahren, der Preis steigt langsamer als die Kosten.' }
      ],

      pflichten: [
        { k: 'biersteuer', name: 'Biersteuer und Umsatzsteuer', anteil: 0.070,
          sagt: 'Nach Stammwuerze gestaffelt. Der Mengenstaffelsatz begruenstigt gerade noch dieses Haus.' },
        { k: 'loehne', name: 'Tarif, Sozialabgaben, Altersversorgung', anteil: 0.055,
          sagt: 'Der Tarifvertrag gilt fuer das ganze Braugewerbe. Verhandelt wird anderswo.' },
        { k: 'listung', name: 'Listungsgebuehr und Werbekostenzuschuss', anteil: 0.040,
          sagt: 'Wer im Regal stehen will, zahlt fuer den Platz. Frueher hiess das Bannmeile, heute WKZ.' },
        { k: 'zinsen', name: 'Zins und Tilgung', anteil: 0.030,
          sagt: 'Die Abfuellanlage ist finanziert. Zwoelf Jahre laeuft die Rate.' }
      ],

      umlagen: [
        { name: 'Waehrungsreform — Umstellung 10:1', sagt: 'Aus zehn Reichsmark wird eine D-Mark. Die Kasse schmilzt, die Schulden auch.' },
        { name: 'Tarifabschluss mit Nachzahlung',   sagt: 'Sieben Prozent rueckwirkend zum Januar.' },
        { name: 'Pfand- und Ruecknahmepflicht',     sagt: 'Kaesten, Kisten, Automaten. Das Haus zahlt die Umstellung.' },
        { name: 'Energiepreissprung',               sagt: 'Der Sudkessel laeuft mit Gas, und Gas hat sich verdoppelt.' },
        { name: 'Umbau der Klaeranlage',            sagt: 'Die Abwasserverordnung gilt auch fuer Brauereien.' }
      ],
      pfand: 'Wer nicht zahlt, verliert die Listung: eine Gaststaette wird auf fuenf Jahre '
           + 'von der Nordstern-Gruppe beliefert.',

      angebote: [
        { k: 'kasten', name: 'Der eigene Mehrwegkasten', anteil: 0.040, bauzeit: 0,
          was: 'Zwanzig Flaschen, Kunststoff, Name in den Griff gepraegt.',
          satz: 'Der Kasten steht in fremden Kellern und wirbt dort, ohne dass jemand ihn ansieht.',
          wirkung: { preis: 0.04, ansehen: 8, ertrag: 24000 } },

        { k: 'zelt', name: 'Das Bierzelt auf dem Volksfest', anteil: 0.075, bauzeit: 0,
          was: 'Ein Zelt mit dreitausend Plaetzen, neun Tage im Jahr.',
          satz: 'Neun Tage, an denen die Stadt das Bier des Hauses trinkt und sonst nichts.',
          wirkung: { ertrag: 62000, ansehen: 10 } },

        { k: 'grosshandel', name: 'Der Getraenkefachgrosshandel als Partner', anteil: 0.115, bauzeit: 0,
          was: 'Ein Vertrag mit dem groessten Zwischenhaendler des Kreises.',
          satz: 'Er nimmt Menge ab und bringt sie in Gaststaetten, die das Haus nie besucht.',
          wirkung: { bindung: { n: 2, jahre: 20 }, ertrag: 96000 } },

        { k: 'lastzug', name: 'Zwei Lastzuege mit Anhaenger', anteil: 0.15, bauzeit: 0,
          was: 'Zwei Siebeneinhalbtonner mit Planenaufbau und Ladebordwand.',
          satz: 'Die Auslieferung wird ein Fahrplan statt einer Fuhre.',
          wirkung: { ertrag: 120000 } },

        { k: 'werbefilm', name: 'Der Werbefilm im Vorabendprogramm', anteil: 0.21, bauzeit: 0, ab: 1958,
          was: 'Dreissig Sekunden, ein Fluss, ein Chor, ein Schriftzug am Ende.',
          satz: 'Zum ersten Mal kennt jemand das Bier, der nie in der Stadt war.',
          wirkung: { preis: 0.09, ansehen: 20, ertrag: 60000 } },

        { k: 'dosenlinie', name: 'Die Dosenlinie', anteil: 0.26, bauzeit: 1, ab: 1965,
          was: 'Weissblech, Aufreissdeckel, achtzehntausend Dosen in der Stunde.',
          satz: 'Der Handel will sie. Was der Handel will, kommt ins Regal.',
          wirkung: { ertrag: 180000, preis: -0.03 } },

        { k: 'trikot', name: 'Die Trikotwerbung beim Landesligisten', anteil: 0.13, bauzeit: 0, ab: 1973,
          was: 'Der Schriftzug auf der Brust, zweiundzwanzig Spieltage im Jahr.',
          satz: 'Ein Verein, eine Stadt, ein Name. Billiger als Fernsehen und haelt laenger.',
          wirkung: { ansehen: 16, preis: 0.05, ertrag: 40000 } },

        { k: 'abfuellung', name: 'Die Abfuellanlage, 24.000 Flaschen je Stunde', anteil: 0.45, bauzeit: 2,
          was: 'Reinigung, Fueller, Etikettierer, Packer — eine Halle voll.',
          satz: 'Sie rechnet sich erst ab einer Menge, die das Haus noch nicht hat.',
          wirkung: { ertrag: 340000, plaetze: 900 } },

        { k: 'gaertanks', name: 'Zylindrokonische Gaertanks im Freien', anteil: 0.34, bauzeit: 2,
          was: 'Acht Edelstahltanks, sechzehn Meter hoch, hinter dem alten Sudhaus.',
          satz: 'Gaerung und Lagerung im selben Tank. Der Felsenkeller wird zum Museum.',
          wirkung: { plaetze: 1400, ertrag: 210000 } },

        { k: 'spezialitaet', name: 'Das Kellerbier in der Buegelflasche', anteil: 0.09, bauzeit: 1, ab: 1985,
          was: 'Naturtrueb, ungefiltert, Buegelverschluss, ein Etikett wie 1900.',
          satz: 'Kleine Menge, grosser Preis. Es verkauft die Geschichte des Hauses mit.',
          wirkung: { preis: 0.11, ansehen: 14, ertrag: 30000 } },

        { k: 'logistik', name: 'Das Logistikzentrum an der Bundesstrasse', anteil: 0.80, bauzeit: 3,
          was: 'Hochregal, Rampen fuer zwoelf Lastzuege, ein Verwaltungsriegel aus Glas.',
          satz: 'Der Hof in der Stadt wird zur Adresse, die Ware kommt woanders her.',
          wirkung: { ertrag: 620000, plaetze: 2200 } },

        { k: 'brauhaus', name: 'Das Gasthausbrauerei im alten Sudhaus', anteil: 0.16, bauzeit: 2, ab: 1990,
          was: 'Kupfer, lange Tische, ein Sudwerk hinter Glas — im Bau von 1884.',
          satz: 'Das Haus verkauft zum ersten Mal wieder Bier an dem Ort, an dem es gebraut wird.',
          wirkung: { preis: 0.07, ansehen: 22, ertrag: 90000 } }
      ],

      festlegungen: [
        { k: 'handelsmarke', name: 'Die Handelsmarke', anteil: 0.55,
          was: 'Wort und Bild, geschuetzt in allen Klassen, mit Etat fuer die naechsten Jahre.',
          regel: 'Der Name traegt den Preis. Jedes Hektoliter faengt fuer den Rest der Partie mehr, weil ein Name darauf steht.',
          wirkung: { preis: 0.18, ansehen: 25 } },

        { k: 'konzern', name: 'Der Liefervertrag mit der Nordstern-Gruppe', anteil: 0.0,
          was: 'Der Konzern nimmt die Menge ab, stellt die Kaesten und zahlt puenktlich.',
          regel: 'Sofort viel Geld und ein sicherer Absatz. Dafuer bestimmt der Konzern den Preis — das Haus kann ihn nie wieder heben.',
          wirkung: { einmal: 1.40, preisDeckel: true, ertrag: 240000 } },

        { k: 'genossenschaft', name: 'Die Genossenschaft der Gastwirte', anteil: 0.30,
          was: 'Vierzig Wirte zeichnen Anteile und binden sich auf zwanzig Jahre.',
          regel: 'Vier Haeuser bleiben dem Haus. Dafuer geht in jedem Michaeli eine Rueckverguetung an die Wirte.',
          wirkung: { bindung: { n: 4, jahre: 60 }, pflichtNeu: { k: 'rueckverguetung', name: 'Rueckverguetung an die Genossen', anteil: 0.040,
            sagt: 'Vier Hundertstel des Anschlags, jaehrlich, satzungsgemaess.' } } },

        { k: 'privat', name: 'Der Rueckzug auf die eigene Braustaette', anteil: 0.20,
          was: 'Kein Handel mehr, kein Regal, keine Aktion. Nur noch Gastronomie und Werksverkauf.',
          regel: 'Die Listungsgebuehr entfaellt fuer immer, und jedes Hektoliter faengt deutlich mehr. Die grossen Mengen sind damit vorbei.',
          wirkung: { pflichtWeg: 'listung', preis: 0.30, wachstumsdeckel: true } }
      ]
    }
  }
};
