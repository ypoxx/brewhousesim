/* ===========================================================================
   stuecke/fuhre-daten.js — DIE FUHRE, Zahlenwerk.
   Besitzstand DIE FUHRE: stuecke/fuhre*.js · stil/fuhre*.css · bild/fuhre/**

   HIER STEHT DIE KNAPPHEIT, UND SIE IST NIE GELD.
   Jede Epoche hat eine ANDERE knappe Sache, und die Sorten kosten sie:

     1350  Brautage und Bannmeile   — der Rat verleiht Tage, nicht Geld.
     1600  Fassplätze und Zunftquote — Reihebrauen; ein Fass ist Kapital.
     1884  Frachtstufen und Eis     — die Bahn rechnet in Stufen, nicht linear.
     1970  Regalmeter und Tourenplan— drei Halte je Woche, gelistet oder nicht.

   Eine Sorte hat deshalb NIE nur eine Reichweite. Sie kostet
     · Brautage/Sude   (das Jahresbudget der Epoche)
     · Fassplätze     (über Reife: wie lange sie ein Fass blockiert)
     · Eis             (1884)
   und bringt unterschiedlich viel Fass je Sud. Genau daran haengt der Satz,
   den ein Spieler im dritten Jahr sagen soll: "Ich zahle mit Brautagen, nicht
   mit Geld — Dünnbier gibt fuenf Fass für einen Tag, Grutbier zwei."

   DREI ANTWORTEN AUF DIE LEERE KASSE — und keine davon ist Geld
   Ein Brauhaus ohne Bargeld hoert nicht auf zu brauen. Es tut, was es seit
   je getan hat, und alle drei stehen hier als Zahl:

   1. DER NOTSUD (`not: true`).  Der zweite Guss auf dieselben Treber. Er
      kostet keinen Pfennig, kein Korn und keinen Tag der Jahresverleihung —
      nur die Pfanne, die denselben Tag am Feuer steht. Wenig Fass, kurz
      haltbar, die schlechteste Stufe: der Gasthof und das Kloster nehmen ihn
      nicht. Er ist nie die beste Antwort und immer eine.
        1350 Kofent · 1600 Nachbier · 1884 Einfachbier · 1970 Handelsmarke

   2. DAS KERBHOLZ (`kerbholz`).  Anschreiben lassen. Der Glaeubiger schneidet
      ganze Kerben ins Holz und zahlt sie aus; zu Georgi wird geloescht. Was
      dann offen bleibt, nimmt er sich NICHT in Geld, sondern in der knappen
      Sache dieser Zeit — Brautage, Sude der Reihe, Eis, Regalmeter. Damit
      wird die leere Kasse nie zur Wand, sondern zu einem Preis in der
      Waehrung der Epoche.

   3. DER RUECKVERKAUF (`rueck`).  Rohstoff geht zum Bruchteil des Einkaufs
      an den Haendler zurueck. Bar auf die Hand — und die Kammer ist leer,
      was naechste Woche die Pfanne kostet.

   UND DIE ANTWORT AUF DAS LEERE AUFTRAGSBUCH — auch die ist kein Geld
   Das Ende dieses Hauses ist nicht die leere Kasse, sondern der leere
   Wagen. Auch dagegen gibt es einen historischen Handgriff, und er kostet
   keinen Pfennig:

   4. DAS PROBEFASS (`probe`).  Ein Fass ohne Rechnung an einen Wirt, der
      das Haus aufgegeben hat. Es kostet kein Geld — es kostet ein reifes
      Fass aus dem Keller, einen Platz auf dem Wagen und einen der wenigen
      Halte der Woche, also genau die knappe Sache dieser Epoche. Schmeckt
      es, kommt die Adresse zurueck; schmeckt es halb, dauert es laenger.
        1350 Fass auf Probe · 1600 Freifass an den Wirt
        1884 Probefass ab Rampe · 1970 Aktionspalette ohne Berechnung

   5. DIE FRIST (`frist`).  Und wenn niemand mehr abnimmt und niemand
      zurueckgeholt wird, dann endet das Haus — mit einem Datum, nicht mit
      einem WEITER, das ewig weiterlaeuft. Jede Epoche hat eine andere
      Instanz, die dem Haus die Grundlage entzieht: der Rat, die Zunft, der
      Malzhaendler, der Handel.

   SPERRLISTE beachtet: kein Hopfen 1350 (Grut), offene Pfanne, Hektoliter
   erst ab 1872 (das macht welt.menge), keine Emailschilder vor den 1890ern.
   =========================================================================== */

var FUHRE_DATEN = {

  /* ----------------------------------------------------------------------
     Was ein Haus annimmt. stufen: 1 = kurz und billig, 2 = das Bier des
     Hauses, 3 = lang, teuer, sommerfest.  Ein Marktstand nimmt kein
     Starkbier, ein Kloster kein Dünnbier — deshalb ist die Sortenwahl
     keine Reichweite, sondern eine Kundschaft.
     ---------------------------------------------------------------------- */
  arten: {
    gasthof:     { stufen: [2, 3],    faktor: 1.00, wort: 'Gasthof' },
    wirtshaus:   { stufen: [1, 2],    faktor: 0.95, wort: 'Wirtshaus' },
    schenke:     { stufen: [1, 2],    faktor: 0.88, wort: 'Schenke' },
    stand:       { stufen: [1],       faktor: 0.80, wort: 'Ausschank' },
    kloster:     { stufen: [3],       faktor: 1.30, wort: 'Klosterschenke' },
    gaststaette: { stufen: [1, 2, 3], faktor: 1.05, wort: 'Gaststätte' }
  },

  /* Drei Zeichen für das Fassbrett am Wagen. */
  kurz: {
    lindenhof: 'LIN', ochse: 'OCH', torschenke: 'TOR', pfarrhof: 'PFA',
    muehlwirt: 'MUE', brueckenwirt: 'BRU', faehrhaus: 'FAE', hirsch: 'HIR',
    markt: 'MKT', obernberg: 'OBE', bahnhofswirt: 'BHF', neustadt: 'NEU'
  },

  /* Wo eine Adresse ihr Zeichen auf dem Bild bekommt — nur dort, wo kein
     Brett davorsteht. Verschiebung in Prozentpunkten, damit eng benachbarte
     Orte (Muehle 85/38 und obere Bruecke 84/40) lesbar bleiben. */
  marken: {
    lindenhof:    { dy: 0 },
    ochse:        { dy: 6 },
    kirche:       { dy: 0 },
    muehlwirt:    { dy: 5 },
    obernberg:    { dy: -8 },
    faehrhaus:    { dy: 6 },
    brueckenwirt: { dy: 0 },
    bahnhofswirt: { dy: 0 }
  },

  /* ----------------------------------------------------------------------
     Der Zettel, der mit der Fuhre zurueckkommt. Kein Meldesystem — ein
     Absender. Die Stimme wechselt mit der Epoche; das ist billig und
     trägt die Tonlatte mit.
     ---------------------------------------------------------------------- */
  zettel: {
    1: [
      '{wirt} ist leer seit Dienstag. Kommt bis Freitag nichts, red ich mit dem Adler.',
      'Beim {wirt} sitzen die Fuhrleute und trinken Wasser. Das spricht sich herum.',
      '{wirt} lässt fragen, ob das Haus noch braut. Es fehlen {n}.',
      'Der Schankknecht vom {wirt} war am Tor. Er ist ohne Fass wieder gegangen.'
    ],
    2: [
      '{wirt} meldet der Zunft, dass fremdes Bier im Keller steht. Es fehlen {n}.',
      'Der Wirt zum {wirt} fragt nach dem Märzen. Er hat einen Gast aus Nürnberg.',
      '{wirt}: seit drei Wochen kein Fass. Die Ordnung nennt das Säumnis.',
      'Beim {wirt} liegt ein leeres Fass des Hauses. Pfand, ungefüllt, seit Wochen.'
    ],
    3: [
      '{wirt}: Der Adler hat gestern per Bahn geliefert. Wir warten. Es fehlen {n}.',
      'Bahnhofsgaststätte meldet: {wirt} hat umgestellt, wenn nicht bald etwas kommt.',
      '{wirt} bittet um {n}. Das Eis im eigenen Keller reicht noch zwei Wochen.',
      'Der Wirt vom {wirt} schreibt: "Ihr Lagerbier oder ein anderes. Mir gleich."'
    ],
    4: [
      'Einkauf {wirt}: Regal seit Montag leer. Nordstern hat angeboten. Es fehlen {n}.',
      '{wirt}, Bestellung offen: {n}. Bitte Tourenplan prüfen.',
      'Gebietsleiter meldet: Beim {wirt} steht fremdes Pils in unserem Fach.',
      '{wirt} fragt nach der Listung. Ohne Ware fällt sie zum Jahresende.'
    ]
  },

  /* ----------------------------------------------------------------------
     DER NEUE WIRT. Ein Zug, der ohne den Spieler geschieht: eine Adresse,
     die das Haus vor Jahren aufgegeben hat, fragt von selbst wieder an.
     Wirte sterben, Pachten wechseln, Erben haben keine Gewohnheit. Das
     passiert nur, solange das Haus ueberhaupt noch liefert — ein Brauhaus,
     von dem niemand mehr etwas hat, fragt auch niemand.
     ---------------------------------------------------------------------- */
  neuerWirt: {
    1: [
      'Der alte Wirt im {wirt} ist tot. Sein Eidam fragt am Tor, ob das Haus noch braut.',
      'Im {wirt} sitzt eine neue Wirtin. Sie hat mit dem Adler nichts abgemacht.'
    ],
    2: [
      'Die Pacht am {wirt} ist neu vergeben. Der Wirt fragt bei der Zunft nach dem Anker.',
      'Der {wirt} hat den Wirt gewechselt. Der neue kennt das Braunbier des Hauses von früher.'
    ],
    3: [
      '{wirt} hat einen neuen Pächter. Er schreibt: "Ihr Lagerbier, wenn es das noch gibt."',
      'Beim {wirt} ist der Vertrag mit dem Adler ausgelaufen. Der Wirt fragt nach Preisen.'
    ],
    4: [
      'Einkauf {wirt}: neue Leitung. Sie fragt an, ob der Anker noch liefern kann.',
      '{wirt} hat den Lieferanten gewechselt und fragt nach einem Angebot des Hauses.'
    ]
  },

  /* ====================================================================== */

  epochen: {

    /* ------------------------------------------------------------------
       1350 — BRAUTAGE UND BANNMEILE
       Der Rat verleiht das Braurecht auf TAGE. Wer den Tag verbraucht hat,
       braut nicht mehr, und kein Geld der Welt aendert das in diesem Jahr.
       Ausserhalb der Bannmeile faehrt kein Fass ohne Bannbrief.
       ------------------------------------------------------------------ */
    1: {
      jahr: 1350,
      knappheit: 'Brautage · Bannmeile',
      knappSatz: 'Der Rat verleiht Tage, nicht Geld. Und die Meile ist eine Mauer.',
      budget: { name: 'Brautage', feld: 'tage', start: 44, jeWoche: 6,
                satz: 'Braurecht auf Zeit. Zu Georgi verfällt, was übrig ist.' },
      tafel: { name: 'Anschlagtafel', unter: 'mit Kreide an der Sudhauswand',
               preis: 4, freiBis: 3 },
      keller: { name: 'Der Keller', bettFass: 1, bett: 'Fass', spalten: 6,
                satz: 'Kühl, feucht, klein. Was hier liegt, ist der ganze Handel.' },
      wagen: { name: 'Ochsenkarren', leeren: 'Karren leeren', fass: 5, halte: 4, schritt: 1,
               grund: 0.5, jeKm: 0.7, haltPreis: 0.3, jeFass: 0.55, umlauf: 2, bruch: 0.03,
               satz: 'Fünf Plätze, vier Halte. Der Ochse geht sieben Meilen am Tag und keine mehr.' },
      faesser: 22,
      planStart: 1,
      /* Der feste Kern: Dach, Geschirr, Wache. Die Braugesellen und das
         Futter des Ochsen kommen je Sudtag dazu (fuhre.js, `woche`). */
      unterhalt: 1,
      unterhaltName: 'Dach, Geschirr, Wache',
      /* 1350 ist das Jahr nach dem Grossen Sterben. Die Loehne der
         Handwerker und Knechte springen, weil Haende fehlen; der Rat
         antwortet mit Hoechstpreisen und laesst den Bierpfennig
         einundvierzig Jahre stehen. Das ist die schaerfste Schere der
         ganzen Partie, und sie ist die bestbezeugte. */
      teuerungLauf: 1.058,
      lohnSud: 1.3,
      lohnName: 'Brauknecht und Futter',
      notsud: { jeSud: 1, mindest: 1,
                grund: 'kein Treber mehr in der Pfanne' },
      mengenfaktor: 1,
      winteranteil: 0.68,
      sommerSatz: 'Sommerbrauverbot. Zwischen Georgi und Michaeli brennt kein Feuer '
                + 'unter der Pfanne — die Stadt fürchtet den Brand.',
      monate: ['Wonnemond', 'Brachet', 'Heuert', 'Ernting', 'Scheiding'],
      abgabe: { satz: 0.08, name: 'Ungeld',
                sagt: 'Der Rat nimmt vom Bier, das ausgeschenkt wurde. Wer mehr verkauft, zahlt mehr.' },
      ziel: {
        name: 'Das Kerbholz beim Wirt', kurz: 'Ziel', wort: 'Kerbe',
        satz: 'Der Wirt zahlt nicht am Tor. Er lässt anschreiben, und am Michaelistag '
            + 'geht der Knecht mit dem Holz die Runde. Deshalb liegt der Termin dort.',
        angeld: 0.30,
        angeldName: 'Angeld auf das kommende Braujahr',
        angeldSatz: 'Wer im Winter beliefert sein will, legt zu Michaeli etwas an. '
                  + 'Es wird abgetrunken, nicht geschenkt.',
        umgang: 'Der Umgang vor Michaeli',
        stufen: [
          { k: 'bar', name: 'Bar auf die Hand', bar: 1.00, durst: 0.66, ausfall: 0,
            was: 'Kein Fass verlässt den Hof ohne Münze.',
            sagt: 'Sicher und klein: wer bar zahlen muss, bestellt weniger.' },
          { k: 'ziel', name: 'Aufs Kerbholz, fällig zu Michaeli', bar: 0.40, durst: 1.00, ausfall: 0.05,
            was: 'Zwei Hölzer, ein Schnitt: eines beim Wirt, eines im Haus.',
            sagt: 'Das Übliche. Das meiste Geld kommt am Zahltag, ein Teil kommt nie.' },
          { k: 'borg', name: 'Auf Borg bis Michaeli', bar: 0.12, durst: 1.32, ausfall: 0.15,
            was: 'Der Wirt nimmt, so viel er ausschenken kann, und rechnet im Herbst.',
            sagt: 'Der Ausschank wächst, und das ganze Jahr hängt an einem Tag.' }
        ]
      },
      bannmeile: 1,
      bann: { name: 'Bannbrief', basis: 60, staffel: 1.55,
              satz: 'Der Rat erlaubt die Ausfuhr an ein Haus. Für immer. Unwiderruflich.' },
      probe: { name: 'Fass auf Probe', kurz: 'auf Probe',
               satz: 'Ein Fass ohne Rechnung an den Wirt, der das Haus aufgegeben hat. '
                   + 'Kein Pfennig, kein Ungeld, kein Eintrag beim Rat — verschenktes Bier '
                   + 'ist kein Verkauf. Es kostet ein reifes Fass und einen der vier Halte.',
               zurueck: '{wirt} zapft wieder Bier des Anker. Der Schankknecht war am Tor '
                      + 'und hat diesmal ein volles Fass mitgenommen.' },
      frist: { wochen: 12, wer: 'der Rat',
               satz: 'Ein Braurecht wird auf Zeit verliehen und für die Stadt verliehen. '
                   + 'Wessen Bier keine Schenke der Stadt mehr führt, dem nimmt der Rat '
                   + 'die Pfanne und gibt sie weiter.',
               ende: 'Der Rat entzieht dem Haus zum Anker das Braurecht: seit zwölf Wochen '
                   + 'hat keine Schenke der Stadt ein Fass genommen. Die Pfanne geht an '
                   + 'einen anderen.' },
      kerbholz: {
        name: 'Kerbholz beim Grutherrn', kurz: 'Kerbholz', zeichen: 'Kerbe',
        jeKerbe: 25, kerben: 6,
        satz: 'Der Grutherr schneidet die Kerbe ins Holz und zahlt aus. '
            + 'Zu Georgi wird gelöscht — in Geld, wenn welches da ist.',
        pfand: { was: 'budget', menge: 3,
                 sagt: 'Je offener Kerbe nimmt der Grutherr drei Brautage des neuen Jahres. '
                     + 'Er will kein Geld, er will die Pfanne.' }
      },
      kaeufe: [
        { k: 'budget',   text: 'Brautage vom Rat · +6', basis: 90, staffel: 1.6, menge: 6,
          titel: 'Sechs zusätzliche Brautage in diesem Braujahr. Der Rat verkauft sie ungern und teuer.' },
        { k: 'rohstoff', text: 'Grut vom Grutherrn · +40', basis: 34, staffel: 1.0, menge: 40,
          rueck: 0.55, rtext: 'Grut zurück an den Grutherrn · −40',
          rtitel: 'Vierzig Grut gehen zurück. Der Grutherr nimmt sie, aber nicht zum Einkaufspreis — '
                + 'und ohne Grut steht die Pfanne bald anders da.',
          titel: 'Ohne Grut kein Bier. Hopfen kennt hier noch niemand.' },
        { k: 'fass',     text: 'Fass vom Böttcher · +3', basis: 34, staffel: 1.06, menge: 3,
          titel: 'Drei Fässer mehr im Umlauf.' }
      ],
      sorten: [
        { k: 'duenn', name: 'Dünnbier', zeichen: 'D', stufe: 1,
          tage: 1, fass: 5, reife: 0, haltbar: 3, preis: 5, kosten: 6, rohstoff: 2,
          sommer: false,
          satz: 'Ein Tag am Kessel, fünf Fass. In drei Wochen ist es sauer. Der Gasthof nimmt es nicht.' },
        { k: 'grut', name: 'Grutbier', zeichen: 'G', stufe: 2,
          tage: 2, fass: 4, reife: 0, haltbar: 6, preis: 9, kosten: 7, rohstoff: 3,
          sommer: false,
          satz: 'Das Bier des Hauses. Grut aus Gagel, Porst und Schafgarbe — kein Hopfen.' },
        { k: 'stark', name: 'Starkbier', zeichen: 'S', stufe: 3,
          tage: 3, fass: 3, reife: 2, haltbar: 16, preis: 19, kosten: 15, rohstoff: 6,
          sommer: true,
          satz: 'Drei Tage für drei Fass. Dafür hält es bis in den Sommer, und das Kloster zahlt.' },
        { k: 'kofent', name: 'Kofent', zeichen: 'K', stufe: 1, not: true,
          tage: 1, fass: 3, reife: 0, haltbar: 2, preis: 3, kosten: 0, rohstoff: 0,
          sommer: false,
          satz: 'Der zweite Guss auf dieselben Treber. Kein Pfennig, kein Korn Grut, und der Rat '
              + 'zählt ihn nicht auf die Brautage — Nachbier ist in seinem Buch kein Bier. '
              + 'Er kostet nur die Pfanne. Drei Fass Dünnes, in zwei Wochen sauer, Gesindebier: '
              + 'der Gasthof und das Kloster nehmen es nicht. In einer schlechten Woche das '
              + 'einzige Bier des Hauses.' }
      ]
    },

    /* ------------------------------------------------------------------
       1600 — FASSPLAETZE UND ZUNFTQUOTE
       Die Zunft teilt die Reihe zu: so und so viele Sude im Jahr. Und ein
       Fass ist Kapital — was beim Wirt als Pfand steht, fehlt im Keller.
       Märzenbier belegt zehn Wochen lang einen Fassplatz, ehe es taugt.
       ------------------------------------------------------------------ */
    2: {
      jahr: 1600,
      knappheit: 'Fassplätze · Zunftquote',
      knappSatz: 'Die Reihe kommt von der Zunft. Die Fässer kommen vom Böttcher. '
               + 'Beides ist zählbar und keines ist Geld.',
      budget: { name: 'Sude der Reihe', feld: 'sude', start: 40, jeWoche: 3,
                satz: 'Reihebrauen: die Zunft teilt die Sude zu. Mehr gibt es nur von einem Nachbarn.' },
      tafel: { name: 'Sudordnung', unter: 'auf der Tafel im Sudhaus',
               preis: 14, freiBis: 3 },
      keller: { name: 'Das Gewölbe', bettFass: 1, bett: 'Fass', spalten: 8,
                satz: 'Vierundzwanzig Plätze im Stein. Märzen belegt sie den ganzen Winter.' },
      /* Ein Fass ist in dieser Zeit Kapital, und deshalb wird es geflickt und
         nicht weggeworfen: vier Prozent Bruch je Fuhre hiessen, dass das Haus
         binnen fuenf Braujahren die Haelfte seiner Faesser verliert und
         seinen Absatz mit ihnen (gemessen: 118 auf 84 Fass im Jahr). Die
         Knappheit bleibt der Fassplatz — der Boettcher steht mit Preisschild
         daneben, das Pfand wird eingezogen —, sie ist nur kein Leck mehr. */
      wagen: { name: 'Pferdefuhrwerk', leeren: 'Wagen leeren', fass: 8, halte: 5, schritt: 1,
               grund: 1.5, jeKm: 0.8, haltPreis: 0.6, jeFass: 1.9, umlauf: 3, bruch: 0.018,
               satz: 'Acht Plätze, fünf Halte, zwei Pferde. Die Fässer kommen erst nach Wochen zurück.' },
      faesser: 38,
      pfand: { name: 'Pfand einziehen', grund: 14, jeFass: 3,
               satz: 'Der Knecht fährt die Runde und holt die leeren Fässer zurück, '
                   + 'ehe sie fällig sind. Kostet einen Tag und ein paar Gulden — '
                   + 'und ist in dieser Zeit oft der einzige Weg, überhaupt brauen zu können.' },
      planStart: 1,
      unterhalt: 2,
      unterhaltName: 'Erhaltung des Braugeräts',
      teuerungLauf: 1.004,
      lohnSud: 2.2,
      lohnName: 'Gesellenlohn und Pferdefutter',
      notsud: { jeSud: 1, mindest: 1,
                grund: 'kein Treber mehr auf dem Läuterbottich' },
      mengenfaktor: 1,
      winteranteil: 0.68,
      sommerSatz: 'Das Sommerbrauverbot steht seit 1553 in der Ordnung: von Georgi bis '
                + 'Michaeli wird nicht gebraut. Was im April im Keller liegt, ist der ganze Sommer.',
      monate: ['Wonnemond', 'Brachet', 'Heuert', 'Ernting', 'Scheiding'],
      abgabe: { satz: 0.08, name: 'Ungeld und Zunftbeitrag',
                sagt: 'Der Stadt das Ungeld, der Zunft den Beitrag. Beides nach Ausstoß.' },
      ziel: {
        name: 'Das Schuldbuch der Wirte', kurz: 'Ziel', wort: 'Posten',
        satz: 'Die Ordnung kennt das Ziel: geliefert wird das Jahr über, gerechnet wird '
            + 'zu Michaeli. Wer vorher Geld sehen will, muss es sagen — und verkauft weniger.',
        angeld: 0.28,
        angeldName: 'Angeld auf das kommende Braujahr',
        angeldSatz: 'Der Wirt legt an, damit im Winter geliefert wird. Es wird abgetrunken.',
        umgang: 'Die Rechnung zu Michaeli',
        stufen: [
          { k: 'bar', name: 'Zug um Zug, bar', bar: 1.00, durst: 0.70, ausfall: 0,
            was: 'Fass gegen Gulden, an der Kellertür.',
            sagt: 'Der Zunft ist es recht. Dem Wirt nicht — er bestellt kleiner.' },
          { k: 'ziel', name: 'Auf Ziel bis Michaeli', bar: 0.60, durst: 1.00, ausfall: 0.05,
            was: 'Ein Posten im Schuldbuch, vom Wirt gegengezeichnet.',
            sagt: 'Das Übliche. Das Buch trägt das Jahr, der Zahltag trägt das Haus.' },
          { k: 'borg', name: 'Auf langes Ziel, mit Nachlass', bar: 0.15, durst: 1.30, ausfall: 0.14,
            was: 'Ein Jahr Ziel und ein Nachlass obendrauf, dafür nimmt er doppelt.',
            sagt: 'Der Absatz wächst schneller als die Kasse. Beides ist wahr.' }
        ]
      },
      bannmeile: 0,
      probe: { name: 'Freifass an den Wirt', kurz: 'Freifass',
               satz: 'Ein Fass ohne Rechnung, mit dem Zeichen der Zunft am Boden. '
                   + 'Die Ordnung erlaubt es als Probe und rechnet es nicht auf die Reihe an. '
                   + 'Es kostet keinen Gulden — es kostet den Fassplatz und den Halt.',
               zurueck: 'Beim {wirt} steht wieder ein Fass des Hauses im Keller. '
                      + 'Der Wirt hat es der Zunft angezeigt, wie es sich gehört.' },
      frist: { wochen: 12, wer: 'die Zunft',
               satz: 'Die Reihe wird unter denen geteilt, die liefern. Wer ein Jahr lang '
                   + 'keinen Abnehmer hat, wird aus der Reihe gestrichen.',
               ende: 'Die Zunft streicht das Haus zum Anker aus der Reihe: seit zwölf Wochen '
                   + 'hat kein Wirt der Stadt ein Fass genommen. Wer nicht liefert, braut nicht.' },
      kerbholz: {
        name: 'Anschrift bei Mälzer und Böttcher', kurz: 'Anschrift', zeichen: 'Kerbe',
        jeKerbe: 80, kerben: 6,
        satz: 'Die Zunft bürgt, der Mälzer schreibt an. Abgerechnet wird zu Georgi, '
            + 'wie es die Ordnung vorschreibt.',
        pfand: { was: 'budget', menge: 2,
                 sagt: 'Je offener Kerbe zieht die Zunft zwei Sude der Reihe ein. '
                     + 'Bezahlt wird mit dem Braurecht, nicht mit Gulden.' }
      },
      kaeufe: [
        { k: 'budget',   text: 'Reihe vom Nachbarn · +4 Sude', basis: 300, staffel: 1.7, menge: 4,
          titel: 'Ein Zunftgenosse tritt vier Sude seiner Reihe ab. Gilt nur für dieses Braujahr.' },
        { k: 'fass',     text: 'Fässer vom Böttcher · +4', basis: 92, staffel: 1.07, menge: 4,
          titel: 'Vier Fässer mehr im Umlauf. Das ist in dieser Epoche die eigentliche Währung.' },
        { k: 'rohstoff', text: 'Hopfen vom Markt · +60', basis: 120, staffel: 1.0, menge: 60,
          rueck: 0.55, rtext: 'Hopfen zurück auf den Markt · −60',
          rtitel: 'Sechzig Hopfen gehen zurück an den Markt. Der Händler zahlt bar und schlecht.',
          titel: 'Reinheitsgebot: Gerste, Hopfen, Wasser. Grut ist verboten.' }
      ],
      sorten: [
        { k: 'schank', name: 'Schankbier', zeichen: 'S', stufe: 1,
          sude: 1, fass: 8, reife: 0, haltbar: 4, preis: 13, kosten: 13, rohstoff: 5,
          sommer: false,
          satz: 'Dünn, schnell, acht Fass aus einem Sud. Füllt den Wagen, füllt nicht die Kasse.' },
        { k: 'braun', name: 'Braunbier', zeichen: 'B', stufe: 2,
          sude: 1, fass: 6, reife: 1, haltbar: 10, preis: 22, kosten: 18, rohstoff: 8,
          sommer: false,
          satz: 'Das Bier der Zunft. Sechs Fass, eine Woche Lager, jeder Wirt nimmt es.' },
        { k: 'maerzen', name: 'Märzenbier', zeichen: 'M', stufe: 3,
          sude: 1, fass: 4, reife: 5, haltbar: 34, preis: 40, kosten: 26, rohstoff: 11,
          sommer: true,
          satz: 'Fünf Wochen im Fass, ehe es taugt — fünf Wochen belegter Fassplatz. '
              + 'Dafür überlebt es als einziges den Sommer.' },
        { k: 'nachbier', name: 'Nachbier', zeichen: 'N', stufe: 1, not: true,
          sude: 1, fass: 5, reife: 0, haltbar: 3, preis: 7, kosten: 0, rohstoff: 0,
          sommer: false,
          satz: 'Konventbier vom zweiten Guss. Die Ordnung erlaubt es fürs Gesinde und rechnet es '
              + 'nicht auf die Reihe an — es kostet keinen Gulden, keinen Hopfen und keinen Sud '
              + 'der Zunftquote, nur die Pfanne. Fünf dünne Fass, drei Wochen haltbar. '
              + 'Der Gasthof führt es nicht.' }
      ]
    },

    /* ------------------------------------------------------------------
       1884 — FRACHTSTUFEN UND EIS
       Die Bahn rechnet nicht je Hektoliter, sondern in Stufen: Stückgut,
       halber Wagen, ganzer Wagen. Wer die Stufe nicht füllt, bezahlt Luft.
       Und das Eis wird im Winter geschnitten oder gar nicht.
       ------------------------------------------------------------------ */
    3: {
      jahr: 1884,
      knappheit: 'Frachtstufen · Eis',
      knappSatz: 'Die Bahn rechnet in Stufen. Das Eis kommt aus dem Winter und '
               + 'nicht aus der Kasse.',
      budget: null,
      sudeJeWoche: 2,
      planStart: 1,
      unterhalt: 24,
      unterhaltName: 'Braumeister, Kessel, Versicherung',
      teuerungLauf: 0.994,
      lohnSud: 88,
      lohnName: 'Schichtlohn und Kohle',
      notsud: { jeSud: 1, mindest: 1,
                grund: 'kein Treber mehr im Maischbottich' },
      tafel: { name: 'Sudplan', unter: 'am schwarzen Brett der Mälzerei',
               preis: 260, freiBis: 3 },
      keller: { name: 'Der Eiskeller', bettFass: 2, bett: 'Lagerfass', spalten: 9,
                satz: 'Ein Lagerfass zu drei Hektoliter. Ohne Eis wird alles darin sauer.' },
      /* Die Knappheit von 1884 ist die FRACHTSTUFE, nicht die Zahl der Halte:
         ein Wagen der Bahn geht an so viele Stationen, wie das Haus Kunden
         hat — was er kostet, entscheidet die Stufe. Vorher standen hier
         sechs Halte fuer zehn Adressen, und weil eine Fuhre zugleich die
         Woche ist, konnte das Haus nur ein Drittel seines Marktes beliefern:
         gemessen 180 Fass Absatz im Jahr bei einem Bedarf von 609, danach
         fuenf verlorene Adressen im zweiten Braujahr. Der Tourenplan mit
         wenigen Halten gehoert 1970 und steht dort. */
      wagen: { name: 'Bahnfracht ab Rampe', leeren: 'Rampe räumen', fass: 12, halte: 10, schritt: 4,
               grund: 0, jeKm: 0, haltPreis: 0, umlauf: 2, bruch: 0.02,
               satz: 'Die Rampe geht an den Bahnhof. Was sie kostet, entscheidet die Stufe.' },
      /* DER TARIF. Er stand so hoch, dass die Bahn ein Drittel bis die Haelfte
         des Bierwerts nahm — gemessen 7.292 Mark Fuhrlohn auf 14.875 Mark
         Umsatz. Damit war 1884 die Epoche, in der Fracht teurer ist als Bier,
         und genau das Gegenteil ist ihr historischer Sinn: die Bahn hat das
         Bier ueberhaupt erst weit gebracht, deshalb gibt es Exportbier. Die
         Stufung bleibt Wort fuer Wort — wer die Stufe nicht fuellt, bezahlt
         Luft —, sie kostet nur nicht mehr das Haus. */
      fracht: [
        /* DER EIGENE BIERWAGEN. Er hat gefehlt, und sein Fehlen war teuer:
           ohne ihn ging auch das Fass an den Gasthof zweihundert Schritt
           weiter ueber die Rampe und die Bahn — 40 Mark Pauschale fuer ein
           Fass zu 24 Mark. Jede Brauerei von 1884 hatte ihre Rollfuhre mit
           Kaltblut und Bierkutscher; die Bahn war fuer das Exportbier da,
           nicht fuer die Wirtschaft in der Gasse. Er traegt wenig, er kostet
           wenig, und ueber die Bannmeile hinaus kommt er nicht — deshalb der
           hohe Satz je Kilometer. */
        { k: 'rollfuhr', name: 'Eigene Rollfuhre', fass: 8, pauschale: 6, jeFass: 2, jeKm: 13,
          satz: 'Kaltblut und Bierkutscher, die Wirtschaften der Stadt. Weit kommt er nicht.' },
        { k: 'stueck', name: 'Stückgut',      fass: 12, pauschale: 40,  jeFass: 7, jeKm: 3,
          satz: 'Jede Menge, jede Woche — und je Fass am teuersten.' },
        { k: 'halb',   name: 'Halber Wagen',   fass: 40, pauschale: 190, jeFass: 0,  jeKm: 5,
          satz: 'Pauschale. Vierzig Fass passen hinein; bezahlt wird der Wagen, nicht die Ladung.' },
        { k: 'ganz',   name: 'Ganzer Wagen',   fass: 88, pauschale: 300, jeFass: 0,  jeKm: 7,
          satz: 'Achtundachtzig Fass. Halb gefüllt ist er das teuerste Geschäft des Hauses.' }
      ],
      /* Der Eiskeller einer Brauerei von 1884 wird im Winter fuer das GANZE
         Jahr gefuellt — er ist ein Vorratsbau, kein Wochenvorrat. Vorher
         standen hier 60 Fuder bei einem Verbrauch von sieben in der Woche:
         das reichte bis zur achten Woche, und die erste Woche, in der
         geschnitten werden durfte, war die neunte. Gemessen stand deshalb in
         neun von sechzehn Wochen „Kein Sud: kein Eis" an der Tafel, das Haus
         braute ein Fuenftel seiner Pfanne und verlor im zweiten Braujahr
         fuenf Adressen auf einmal. Die Knappheit bleibt (der Fluss traegt
         nur zwischen Woche 9 und 22); sie ist jetzt eine Entscheidung im
         Winter statt einer Wand im Herbst. */
      /* `frei` ist die Eisernte des eigenen Gesindes: solange der Fluss
         traegt, gehen die Knechte mit Saege und Schlitten hinunter und
         fuellen den Keller, so weit sie kommen. Das war die Regel und
         keine Ausgabe — bezahlt wurde es mit den Winterloehnen, die
         ohnehin laufen. Der Eishaendler (der Knopf daneben) liefert das
         Vielfache davon und kostet Geld; ohne ihn reicht die eigene Ernte
         fuer den Keller und ein paar Sude Lagerbier, nicht fuer den
         Export. Vorher gab es sie gar nicht: wer einmal kein Eis mehr
         hatte, bekam nie wieder welches, und die Epoche endete
         unwiderruflich beim Nachguss (BEFUND-WIRTSCHAFT). */
      eis: { start: 210, keller: 330, jeFuder: 16, menge: 42, frei: 4, frostVon: 9, frostBis: 22,
             satz: 'Eis wird aus dem Fluss geschnitten, solange er trägt. Danach nicht mehr.' },
      faesser: 260,
      mengenfaktor: 1.6,
      winteranteil: 0.68,
      sommerSatz: 'Die Kältemaschine könnte im Juli brauen. Der Sommerabsatz kommt '
                + 'trotzdem aus dem Lagerkeller — was im April eingelagert ist, ist der Sommer.',
      monate: ['Mai', 'Juni', 'Juli', 'August', 'September'],
      abgabe: { satz: 0.08, name: 'Biersteuer und Malzaufschlag',
                sagt: 'Seit 1879 wird das Malz besteuert. Wer mehr einbraut, zahlt mehr.' },
      ziel: {
        name: 'Das Kundenkonto', kurz: 'Zahlungsziel', wort: 'Rechnung',
        satz: 'Die Rechnung läuft, das Bier ist längst getrunken. Der Jahresabschluss '
            + 'der Wirtschaften fällt auf Michaeli, und danach richtet sich die Kasse.',
        angeld: 0.25,
        angeldName: 'Vorauszahlung auf die Winterlieferung',
        angeldSatz: 'Wer im Winter beliefert werden will, zahlt voraus. Es wird verrechnet.',
        umgang: 'Der Jahresabschluss der Kundschaft',
        stufen: [
          { k: 'bar', name: 'Kasse gegen Skonto', bar: 1.00, durst: 0.74, ausfall: 0,
            was: 'Bezahlt bei Übergabe, drei Prozent Nachlass.',
            sagt: 'Das Geld ist sofort da. Der Wirt bestellt dafür knapper.' },
          { k: 'ziel', name: 'Rechnung auf dreißig Tage', bar: 0.64, durst: 1.00, ausfall: 0.045,
            was: 'Fakturiert ab Rampe, zahlbar netto Kasse.',
            sagt: 'Das Übliche im Handel. Ein Rest bleibt immer bis zum Herbst stehen.' },
          { k: 'borg', name: 'Jahresrechnung zu Michaeli', bar: 0.18, durst: 1.26, ausfall: 0.12,
            was: 'Ein Konto je Wirtschaft, abgerechnet einmal im Jahr.',
            sagt: 'Bindet die Wirtschaft ans Haus — und das Haus an einen einzigen Tag.' }
        ]
      },
      bannmeile: 0,
      probe: { name: 'Probefass ab Rampe', kurz: 'Probefass',
               satz: 'Ein Muster geht als Frachtgut an den Wirt, unberechnet. '
                   + 'Die Bahn nimmt es wie jedes andere Fass — die Stufe zahlt das Haus, '
                   + 'das Bier verschenkt es.',
               zurueck: '{wirt} bestellt wieder beim Anker. Der Wirt schreibt: '
                      + '"Das Muster war in Ordnung. Schicken Sie wie früher."' },
      frist: { wochen: 10, wer: 'der Malzhändler',
               satz: 'Ein Betrieb ohne Absatz bekommt kein Malz mehr auf Wechsel. '
                   + 'Die Kältemaschine läuft weiter, der Keller füllt sich, und die '
                   + 'Rampe bleibt leer.',
               ende: 'Der Malzhändler kündigt die Wechsel, die Bank zieht die Linie ein: '
                   + 'seit zehn Wochen geht kein Fass über die Rampe. Ein Lager ist kein Absatz.' },
      kerbholz: {
        name: 'Wechsel beim Malzhändler', kurz: 'Wechsel', zeichen: 'Wechsel',
        jeKerbe: 900, kerben: 6,
        satz: 'Ein Wechsel auf drei Monate, akzeptiert vom Malzhändler. '
            + 'Fällig zu Georgi, wie jedes Papier dieses Hauses.',
        pfand: { was: 'eis', menge: 12,
                 sagt: 'Je offenem Wechsel holt sich der Eishändler zwölf Fuder aus dem Keller. '
                     + 'Er nimmt Eis, weil Eis im Sommer mehr wert ist als Mark.' }
      },
      kaeufe: [
        { k: 'eis',      text: 'Eis schneiden · +42 Fuder', basis: 420, staffel: 1.0, menge: 42,
          titel: 'Nur solange der Fluss trägt. Im März ist damit Schluss, egal wie voll die Kasse ist.' },
        { k: 'eiskeller',text: 'Eiskeller vergrößern · +20', basis: 1800, staffel: 1.6, menge: 20,
          titel: 'Mehr Fuder Fassungsraum. Unwiderruflich gebaut.' },
        { k: 'sudwerk',  text: 'Dampfsudwerk · +1 Sud je Woche', basis: 4200, staffel: 1.9, menge: 1,
          titel: 'Eine zweite Pfanne unter Dampf. Unwiderruflich.' },
        { k: 'rohstoff', text: 'Hopfen aus der Hallertau · +300', basis: 1150, staffel: 1.0, menge: 300,
          rueck: 0.55, rtext: 'Hopfen zurück an den Händler · −300',
          rtitel: 'Dreihundert Hopfen gehen zurück nach Nürnberg. Der Händler zahlt bar '
                + 'und behält die Hälfte der Spanne.',
          titel: 'Waggonweise, ab Bahnhof.' }
      ],
      sorten: [
        { k: 'schank', name: 'Schankbier', zeichen: 'S', stufe: 1,
          fass: 30, reife: 0, haltbar: 3, preis: 44, kosten: 320, rohstoff: 22, eis: 1,
          sommer: false,
          satz: 'Dreißig Fass aus einem Sud, sofort lieferbar, drei Wochen haltbar. '
              + 'Ein Fuder Eis, nicht zwei — dafür ist es in drei Wochen sauer. '
              + 'Füllt den halben Wagen im Alleingang.' },
        { k: 'lager', name: 'Lagerbier', zeichen: 'L', stufe: 2,
          fass: 24, reife: 2, haltbar: 24, preis: 72, kosten: 360, rohstoff: 30, eis: 2,
          sommer: false,
          satz: 'Zwei Wochen auf Eis. Das Bier, an dem die Kältemaschine hängt.' },
        { k: 'export', name: 'Exportbier', zeichen: 'E', stufe: 3,
          fass: 18, reife: 5, haltbar: 46, preis: 108, kosten: 470, rohstoff: 36, eis: 3,
          sommer: true,
          satz: 'Fünf Wochen Eis und Platz. Es fährt weit, es hält lang, es frisst den Eiskeller.' },
        { k: 'einfach', name: 'Einfachbier', zeichen: 'N', stufe: 1, not: true,
          fass: 16, reife: 0, haltbar: 2, preis: 24, kosten: 0, rohstoff: 0, eis: 0,
          sommer: false,
          satz: 'Der Nachguss auf den ausgelaugten Treber. Kein Hopfenzukauf, kein Fuder Eis, '
              + 'keine neue Rechnung beim Mälzer — nur die Pfanne. Der Malzaufschlag kennt es '
              + 'als Einfachbier und nimmt fast nichts. Ohne Eis ist es in zwei Wochen sauer.' }
      ]
    },

    /* ------------------------------------------------------------------
       1970 — REGALMETER UND TOURENPLAN
       Der Lastzug faehrt drei Halte. Nicht drei Fass — drei ADRESSEN.
       Und geliefert wird nur, was im Regal gelistet ist; die Meter gehören
       dem Händler, und der Konzern zahlt mehr dafür.
       ------------------------------------------------------------------ */
    4: {
      jahr: 1970,
      knappheit: 'Regalmeter · Tourenplan',
      knappSatz: 'Drei Halte in der Woche. Und das Regal gehört nicht dir.',
      budget: null,
      sudeJeWoche: 5,
      planStart: 1,
      unterhalt: 620,
      unterhaltName: 'Anlagen, Wartung, Verwaltung',
      teuerungLauf: 1.020,
      lohnSud: 780,
      lohnName: 'Schichtzuschlag und Energie',
      notsud: { jeSud: 1, mindest: 1,
                grund: 'das Handelshaus nimmt einen Sud die Woche und keinen mehr' },
      tafel: { name: 'Sudplan', unter: 'im Schaltraum, auf Formica',
               preis: 2400, freiBis: 3 },
      keller: { name: 'Die Tanks', bettFass: 20, bett: 'Drucktank', spalten: 5,
                satz: 'Ein Drucktank zu dreißig Hektoliter. Der Keller ist kein Keller mehr.' },
      wagen: { name: 'Lastzug', leeren: 'Lastzug leeren', fass: 300, halte: 3, schritt: 20,
               grund: 150, jeKm: 20, haltPreis: 700, jeFass: 1.2, umlauf: 1, bruch: 0.01,
               satz: 'Drei Halte je Tour. Die Menge ist kein Problem mehr — der Plan schon.' },
      faesser: 1400,
      mengenfaktor: 3,
      winteranteil: 0.68,
      sommerSatz: 'Die Sudpfanne steht im Sommer für die Wartung still. Der Sommerabsatz '
                + 'kommt aus den Tanks — und in den Tanks ist, was im April drin war.',
      monate: ['Mai', 'Juni', 'Juli', 'August', 'September'],
      bannmeile: 0,
      abgabe: { satz: 0.08, name: 'Biersteuer und Werbeetat',
                sagt: 'Steuer nach Ausstoß, Werbung nach Marktanteil am eigenen Ausstoß. '
                    + 'Beides wächst mit dem Haus.' },
      ziel: {
        name: 'Die Debitoren', kurz: 'Zahlungsziel', wort: 'Rechnung',
        satz: 'Zahlungsziel, Bonus, Jahresgespräch: der Handel zahlt schnell und nimmt '
            + 'sich den Rest am Jahresende zurück. Der Stichtag ist geblieben.',
        angeld: 0.20,
        angeldName: 'Vorauszahlung des Handels auf das Winterhalbjahr',
        angeldSatz: 'Der Einkauf sichert die Menge und zahlt an. Wird verrechnet.',
        umgang: 'Das Jahresgespräch',
        stufen: [
          { k: 'bar', name: 'Bankeinzug bei Lieferung', bar: 1.00, durst: 0.80, ausfall: 0,
            was: 'Lastschrift mit dem Lieferschein, kein Ziel.',
            sagt: 'Liquide und unbeliebt: der Einkauf listet dafür weniger.' },
          { k: 'ziel', name: 'Rechnung, dreißig Tage netto', bar: 0.70, durst: 1.00, ausfall: 0.035,
            was: 'Zentralregulierung über den Verband.',
            sagt: 'Das Übliche. Der Bonus wird zum Jahresgespräch abgerechnet.' },
          { k: 'borg', name: 'Jahresbonus zum Geschäftsjahr', bar: 0.32, durst: 1.22, ausfall: 0.09,
            was: 'Niedriger Rechnungspreis, alles Weitere im Jahresgespräch.',
            sagt: 'Die Menge steigt sofort, das Geld kommt im Herbst — wenn es kommt.' }
        ]
      },
      probe: { name: 'Aktionspalette ohne Berechnung', kurz: 'Aktionsware',
               satz: 'Gratisware für den Einkauf: eine Palette ohne Rechnung, ohne Listung, '
                   + 'ohne Werbekostenzuschuss. Das Regal gehört immer noch dem Handel — '
                   + 'aber eine Palette, die schon im Lager steht, wird auch verkauft.',
               zurueck: 'Einkauf {wirt} listet den Anker wieder ein. Der Gebietsleiter meldet: '
                      + '"Die Aktionsware ist durchgelaufen. Sie nehmen uns wieder."' },
      frist: { wochen: 8, wer: 'der Handel',
               satz: 'Ohne einen einzigen Abnehmer fällt das Haus aus dem Sortiment, '
                   + 'aus dem Tourenplan und aus der Preisliste. Volle Tanks sind kein Markt.',
               ende: 'Der Handel nimmt das Brauhaus zum Anker aus dem Sortiment: seit acht '
                   + 'Wochen hat kein Einkauf mehr bestellt. Die Tanks sind voll und '
                   + 'niemand ruft an.' },
      listung: { name: 'Listung', basis: 2600, staffel: 1.22,
                 satz: 'Werbekostenzuschuss. Ein Regalmeter für eine Sorte, ein Jahr lang. '
                     + 'Zu Georgi fällt sie, wenn nichts geliefert wurde.' },
      kerbholz: {
        name: 'Kontokorrent bei der Hausbank', kurz: 'Kontokorrent', zeichen: 'Tranche',
        jeKerbe: 11000, kerben: 6,
        satz: 'Die Hausbank räumt eine Linie ein, in Tranchen. Zum Bilanzstichtag Georgi '
            + 'wird zurückgeführt.',
        pfand: { was: 'listung', menge: 1,
                 sagt: 'Je offener Tranche verlangt die Bank eine Sicherheit — und der Handel '
                     + 'streicht dafür einen Regalmeter. Geld hat die Bank selbst genug.' }
      },
      kaeufe: [
        { k: 'lastzug',  text: 'Zweiter Lastzug · +1 Halt', basis: 128000, staffel: 1.8, menge: 1,
          titel: 'Ein Halt mehr je Woche. Das ist in dieser Epoche die einzige echte Vergrößerung.' },
        { k: 'sudwerk',  text: 'Sudhaus erweitern · +1 Sud je Woche', basis: 56000, staffel: 1.7, menge: 1,
          titel: 'Mehr Sude je Woche. Unwiderruflich.' },
        { k: 'rohstoff', text: 'Hopfen im Kontrakt · +1200', basis: 14400, staffel: 1.0, menge: 1200,
          rueck: 0.5, rtext: 'Kontrakt abtreten · −1200',
          rtitel: 'Der Jahreskontrakt geht an eine andere Brauerei. Sofort Geld, '
                + 'und der Hopfen ist weg.',
          titel: 'Jahreskontrakt mit der Hallertau.' }
      ],
      sorten: [
        { k: 'hell', name: 'Vollbier Hell', zeichen: 'H', stufe: 1,
          fass: 50, reife: 1, haltbar: 18, preis: 150, kosten: 2700, rohstoff: 46,
          sommer: false,
          satz: 'Die Menge. Fünfzig Fass je Sud, eine Woche Reife, jedes Regal nimmt es.' },
        { k: 'pils', name: 'Pilsner', zeichen: 'P', stufe: 2,
          fass: 40, reife: 2, haltbar: 26, preis: 195, kosten: 3400, rohstoff: 52,
          sommer: true,
          satz: 'Die Marke. Zwei Wochen Reife, und der Meter im Regal kostet extra.' },
        { k: 'export', name: 'Exportbier', zeichen: 'E', stufe: 3,
          fass: 30, reife: 4, haltbar: 40, preis: 245, kosten: 3700, rohstoff: 58,
          sommer: true,
          satz: 'Vier Wochen Reife, dreißig Fass. Die Gaststätte zahlt es, der Markt nicht.' },
        { k: 'handel', name: 'Handelsmarke', zeichen: 'W', stufe: 1, not: true,
          fass: 30, reife: 0, haltbar: 10, preis: 62, kosten: 0, rohstoff: 0,
          sommer: false,
          satz: 'Weißes Etikett für das Handelshaus: der Kunde stellt Malz, Etikett und Kasten, '
              + 'das Haus stellt Sud und Pfanne. Keine eigene Auslage, kein eigener Regalmeter — '
              + 'und kein eigener Name. Der Gasthof führt es nicht, die Marke wächst nicht davon.' }
      ]
    }
  },

  /* =========================================================================
     DIE AUSGAENGE — vier Epochen, vier Untergaenge, und einer, der keiner ist.

     BEFUND-ENDE.md §1(b): "Es ist VIERMAL DASSELBE ENDE: endgrund
     'keine-abnehmer' in allen vier Epochen, nach 103/103/101/99 Wochen. 1884
     schliesst dabei mit 7.312 M in der Kasse und 48 Fass im Keller — das ist
     kein Untergang, das ist ein Abbruch." Und §1(c): "Es gibt kein GUTES
     Ende. Man kann nur aufhoeren zu existieren."

     Beides hat dieselbe Ursache: das leere Auftragsbuch war der einzige
     Ausgang, und was danach mit dem Haus geschah, stand nirgends. Ein
     Brauhaus, das keinen Abnehmer mehr hat, HOERT aber nicht einfach auf —
     es faellt jemandem zu, und wem es zufaellt, ist in jedem Jahrhundert ein
     anderer. Genau daran haengen die vier Ausgaenge:

       1350  Das Braurecht ist VERLIEHEN. Der Rat nimmt es zurueck, zahlt
             nichts, und gibt den Sudtag an das naechste Haus in der Reihe.
       1600  Die Braugerechtigkeit KLEBT AM HAUS und ist verkaeuflich. Die
             Zunftlade loest sie aus oder ein Zunftgenosse kauft sie.
       1884  Das Haus ist EIGENTUM und beleihbar. Entweder die
             Aktienbrauerei kauft es im Ganzen — oder die Bank verwertet.
       1970  Der Betrieb ist nichts mehr wert, die MARKE schon. Entweder
             sie wird verkauft, oder das Sudwerk geht zum Schrott.

     JEDER AUSGANG IST EINE ENTSCHEIDUNG, KEIN EREIGNIS. Solange die Frist
     laeuft, steht der Antrag mit seinem Preisschild im Bild; wer ihn
     annimmt, hoert an DIESEM Tag auf und hat das Geld. Wer ihn ausschlaegt,
     bekommt den Untergang der Epoche — und der zahlt weniger oder nichts.
     Das ist die unwiderrufliche Festlegung, die am Ende der Partie fehlte.

     Und der fuenfte Ausgang, der keiner ist: DIE UEBERGABE. Ein Haus, das
     steht, kann man weitergeben. Das ist das einzige Ende, bei dem am
     naechsten Morgen wieder Feuer unter der Pfanne brennt.

     Die Summen sind `basis + jePlatz * Gaerraum`: wer gebaut hat, bekommt
     mehr. Der Massstab ist die Startkasse der Epoche (112 Pf · 640 fl ·
     14.250 M · 86.000 DM, kern/welt.js) und der Startgaerraum
     (12 · 24 · 90 · 400 Fassplaetze).
     ========================================================================= */
  ausgaenge: {

    /* ------------------------------------------------------------------ */
    1: {
      antrag: {
        name: 'Der Rat bietet den Abstand',
        wer: 'der Rat',
        basis: 40, jePlatz: 4,
        satz: 'Der Stadtschreiber steht im Hof. Ein Braurecht ist geliehen, nicht gekauft: '
            + 'wessen Bier keine Schenke der Stadt mehr führt, dem nimmt der Rat die Pfanne '
            + 'ohnehin. Wer sie von sich aus zurückgibt, bekommt einen Abstand für Kessel, '
            + 'Bottiche und das Kupfer — wer wartet, bekommt nichts.',
        ja: 'Die Pfanne zurückgeben',
        jaTitel: 'Das Braurecht geht heute an die Reihe zurück. Der Hof bleibt der Familie, '
               + 'das Brauen hört auf. Unwiderruflich.',
        nein: 'Nicht zurückgeben — die Frist auslaufen lassen',
        neinTitel: 'Der Abstand verfällt. Läuft die Frist ab, zieht der Rat die Pfanne '
                 + 'ohne einen Pfennig ein.'
      },
      angenommen: {
        grund: 'pfanne-zurueckgegeben',
        kopf: 'Die Pfanne geht an die Reihe zurück · {jahr}',
        urteil: 'Das Haus zum Anker gibt sein Braurecht von sich aus zurück. Der Rat nimmt '
              + 'Pfanne, Bottiche und Kupfer auf, zahlt den Abstand aus und trägt den Sudtag '
              + 'auf das nächste Haus der Reihe um.',
        folge: 'Der Hof bleibt der Familie {familie}. Gebraut wird darin noch — Haustrunk für '
             + 'den eigenen Tisch, den kein Rat verbietet und den niemand kauft. '
             + 'Das Bier des Anker steht in keiner Schenke der Stadt mehr.',
        art: 'zurueckgegeben'
      },
      fall: {
        grund: 'braurecht-entzogen',
        anteil: 0,
        kopf: 'Der Rat entzieht das Braurecht · {jahr}',
        urteil: 'Der Rat entzieht dem Haus zum Anker das Braurecht: seit {wochen} Wochen hat '
              + 'keine Schenke der Stadt ein Fass genommen. Ein Braurecht wird für die Stadt '
              + 'verliehen; wer die Stadt nicht mehr versorgt, hat es verwirkt.',
        folge: 'Es wird nichts bezahlt und nichts abgelöst — was verliehen war, fällt heim. '
             + 'Zwei Ratsdiener holen die Pfanne noch am selben Tag ab. Der Sudtag des Anker '
             + 'steht ab Georgi beim Nachbarn in der Reihe.',
        art: 'entzogen'
      }
    },

    /* ------------------------------------------------------------------ */
    2: {
      antrag: {
        name: 'Der Mühlbräu bietet auf die Gerechtigkeit',
        wer: 'die Zunft',
        basis: 260, jePlatz: 14,
        satz: 'Die Braugerechtigkeit klebt am Haus und ist verkäuflich — das ist der ganze '
            + 'Unterschied zu 1350. Der Mühlbräu will sie: er hat Sudtage zu wenig und Absatz '
            + 'zu viel. Die Lade sähe es lieber, das Recht käme zurück in die Lade; dann rechnet '
            + 'sie die Rückstände dagegen und es bleibt ein Drittel.',
        ja: 'Die Gerechtigkeit an den Mühlbräu verkaufen',
        jaTitel: 'Der Mühlbräu übernimmt Gerechtigkeit und Sudtage, das Haus zum Anker wird '
               + 'sein Nebenhaus. Unwiderruflich.',
        nein: 'Nicht verkaufen — die Frist auslaufen lassen',
        neinTitel: 'Das Gebot verfällt. Läuft die Frist ab, zieht die Zunftlade die '
                 + 'Gerechtigkeit selbst ein und rechnet die Rückstände dagegen.'
      },
      angenommen: {
        grund: 'gerechtigkeit-verkauft',
        kopf: 'Die Gerechtigkeit geht an den Mühlbräu · {jahr}',
        urteil: 'Das Haus zum Anker verkauft seine Braugerechtigkeit mitsamt den Sudtagen an '
              + 'den Mühlbräu. Vor der Lade wird abgehandelt, das Siegel kommt darunter, und '
              + 'die Summe wird bar ausgezahlt.',
        folge: 'Der Anker bleibt ein Haus und hört auf, eine Brauerei zu sein: der Mühlbräu '
             + 'braut künftig auf Ankers Sudtage und schenkt sein Bier im Anker aus. '
             + 'Der Name über der Tür bleibt stehen. Das Bier darunter ist ein fremdes.',
        art: 'verkauft'
      },
      fall: {
        grund: 'reihe-gestrichen',
        anteil: 0.35,
        kopf: 'Die Zunft streicht das Haus aus der Reihe · {jahr}',
        urteil: 'Die Zunft streicht das Haus zum Anker aus der Reihe: seit {wochen} Wochen hat '
              + 'kein Wirt der Stadt ein Fass genommen. Die Reihe wird unter denen geteilt, '
              + 'die liefern — wer nicht liefert, braut nicht.',
        folge: 'Die Lade zieht die Gerechtigkeit selbst ein und rechnet die offenen Umlagen '
             + 'dagegen. Ausgezahlt wird, was übrigbleibt. Die Sudtage des Anker werden auf '
             + 'die übrigen Häuser verteilt; keines davon heißt Bruckner.',
        art: 'gestrichen'
      }
    },

    /* ------------------------------------------------------------------ */
    3: {
      antrag: {
        name: 'Die Aktienbrauerei legt ein Angebot vor',
        wer: 'die Aktienbrauerei',
        basis: 6000, jePlatz: 95,
        satz: 'Der Direktor der Aktienbrauerei kommt mit dem Notar. Er kauft nicht das Bier, '
            + 'er kauft die Straße: Grundstück, Sudhaus, Kühlmaschine, Fasspark und die '
            + 'Kundenliste. Das Haus wird Niederlage und Absatzlager. So sind zwischen 1870 '
            + 'und 1900 Tausende kleiner Häuser verschwunden — viele nicht im Konkurs, '
            + 'sondern im Kaufvertrag.',
        ja: 'An die Aktienbrauerei verkaufen',
        jaTitel: 'Gebäude, Sudhaus und Kundenliste gehen an die Aktienbrauerei. '
               + 'Unwiderruflich.',
        nein: 'Ablehnen — die Frist auslaufen lassen',
        neinTitel: 'Das Angebot verfällt. Läuft die Frist ab, kündigt der Malzhändler die '
                 + 'Wechsel, und die Bank verwertet, was das Angebot gekauft hätte.'
      },
      angenommen: {
        grund: 'an-aktienbrauerei-verkauft',
        kopf: 'Die Aktienbrauerei kauft das Haus · {jahr}',
        urteil: 'Das Brauhaus zum Anker wird im Ganzen an die Aktienbrauerei verkauft: '
              + 'Grundstück, Sudhaus, Kühlmaschine, Fasspark und Kundenliste, bar gegen '
              + 'Löschung der Wechsel.',
        folge: 'Der Schriftzug bleibt zehn Jahre am Giebel, weil er dem Käufer etwas wert ist. '
             + 'Gebraut wird ab dem nächsten Sud in der großen Anlage am Bahnhof; hier steht '
             + 'nur noch das Absatzlager mit zwei Mann und einem Rollwagen.',
        art: 'geschluckt'
      },
      fall: {
        grund: 'bank-verwertet',
        anteil: 0,
        kopf: 'Die Bank verwertet die Braustätte · {jahr}',
        urteil: 'Der Malzhändler kündigt die Wechsel, die Bank zieht die Linie ein: seit '
              + '{wochen} Wochen geht kein Fass über die Rampe. Ein volles Lager ist kein '
              + 'Absatz, und ein Fass im Keller tilgt keinen Wechsel.',
        folge: 'Das Amtsgericht setzt den Versteigerungstermin an. Grundstück, Sudhaus und '
             + 'Kühlmaschine decken die Wechsel — kein Überschuss, keine Ablösung. '
             + 'Was in der Lade liegt, bleibt der Familie; das Haus bleibt es nicht. '
             + 'Ersteigert hat es die Aktienbrauerei, für weniger, als sie geboten hatte.',
        art: 'verwertet'
      }
    },

    /* ------------------------------------------------------------------ */
    4: {
      antrag: {
        name: 'Die Nordstern-Gruppe bietet auf die Marke',
        wer: 'der Handel',
        basis: 90000, jePlatz: 130,
        satz: 'Die Nordstern-Gruppe schickt keinen Direktor mehr, sondern einen Justitiar. '
            + 'Der Betrieb interessiert sie nicht — 30-Hektoliter-Sude rechnen sich in keiner '
            + 'Kalkulation. Sie kauft den NAMEN: Wortmarke, Etikett, Rezeptur und das Recht, '
            + '"Brauhaus zum Anker" auf ein Etikett zu drucken, das anderswo gefüllt wird.',
        ja: 'Die Marke an die Nordstern-Gruppe verkaufen',
        jaTitel: 'Wortmarke, Etikett und Rezeptur gehen an die Gruppe. Der Betrieb wird '
               + 'stillgelegt. Unwiderruflich.',
        nein: 'Nicht verkaufen — die Frist auslaufen lassen',
        neinTitel: 'Das Gebot verfällt. Läuft die Frist ab, ist der Betrieb ein Grundstück '
                 + 'mit Altlasten, und das Sudwerk bringt Schrottpreis.'
      },
      angenommen: {
        grund: 'marke-verkauft',
        kopf: 'Die Marke geht an die Nordstern-Gruppe · {jahr}',
        urteil: 'Das Brauhaus zum Anker verkauft seine Marke an die Nordstern-Gruppe und '
              + 'stellt das Brauen ein. Bezahlt wird für Wortmarke, Etikett und Rezeptur — '
              + 'nicht für Kessel, Tanks und Halle.',
        folge: 'Anker Pilsner steht weiter im Regal, gebraut zweihundert Kilometer entfernt, '
             + 'in einer Anlage, die vierhundert Hektoliter im Sud fährt. Auf dem Etikett '
             + 'steht "gegründet 1350". Am Hof steht ein Bauzaun.',
        art: 'marke'
      },
      fall: {
        grund: 'brauereisterben',
        anteil: 0.12,
        kopf: 'Das Brauhaus wird stillgelegt · {jahr}',
        urteil: 'Der Handel nimmt das Brauhaus zum Anker aus dem Sortiment: seit {wochen} '
              + 'Wochen hat kein Einkauf mehr bestellt. Zwischen 1960 und 1990 hat sich die Zahl '
              + 'der Brauereien in der Bundesrepublik etwa halbiert — nicht ein Krach, sondern '
              + 'ein Regalmeter nach dem anderen.',
        folge: 'Für den Betrieb findet sich kein Käufer, für die Marke jetzt auch keiner mehr: '
             + 'eine Marke ohne Listung ist ein Wort. Sudwerk, Tanks und Flaschenkeller gehen '
             + 'zum Schrottpreis, der Rest wird ausgeräumt. Auf dem Gelände steht später ein '
             + 'Getränkemarkt, der Bier von acht Konzernen führt.',
        art: 'gestorben'
      }
    },

    /* =======================================================================
       DIE UEBERGABE — das Ende, das kein Untergang ist.

       Bedingungen stehen in stuecke/fuhre.js (uebergabeMoeglich): mindestens
       fuenf abgeschlossene Braujahre, mindestens drei Haeuser, die Bier des
       Anker fuehren, eine Kasse ohne Loch und ein Braujahr, in dem wirklich
       geliefert wurde. Wer das hat, darf aufhoeren, statt aufzuhoeren zu
       existieren — und das Haus brennt am naechsten Morgen weiter.
       ======================================================================= */
    /* =======================================================================
       DIE FREMDEN AUSGAENGE.

       welt.zeit.endgrund kennt Werte aus drei Stuecken: DER SUD haelt die
       Uhr an, wenn die Pfanne drei Braujahre kalt stand (vier Gruende, einer
       je Epoche); DIE STADT, wenn kein Pfand mehr da ist; der Kern, wenn die
       Gegenwart erreicht ist. Jedes dieser Stuecke schreibt sein eigenes
       Beiblatt ueber SEINE Sache — das Sudbuch ueber die Pfanne, der Bauhof
       ueber den Hof. Was keinem von ihnen gehoert, ist DAS URTEIL UEBER DIE
       PARTIE, und das steht auf genau einem Blatt (stuecke/fuhre.js,
       zeichneSchluss). Damit es fuer jeden Grund etwas zu sagen hat, stehen
       die fremden Gruende hier mit.
       ======================================================================= */
    fremd: {
      'reihe-verloren': {
        kopf: 'Der Sudtag fällt an die Reihe zurück · {jahr}',
        folge: 'Drei Braujahre ohne einen einzigen Sud. Ein Braurecht hängt am Brauen und '
             + 'nicht am Namen: der Rat trägt den Sudtag auf das nächste Haus um. '
             + 'Die Pfanne bleibt stehen, sie gehört zum Hof.',
        art: 'kalt' },
      'lade-zieht-ein': {
        kopf: 'Die Lade zieht die Gerechtigkeit ein · {jahr}',
        folge: 'Drei Braujahre ohne einen einzigen Sud. Die Zunftlade nimmt die '
             + 'Braugerechtigkeit an sich und verteilt die Sudtage auf die übrigen Häuser. '
             + 'Verkauft wird nichts — verteilt wird alles.',
        art: 'kalt' },
      'braustaette-still': {
        kopf: 'Die Hypothek wird aufgerufen · {jahr}',
        folge: 'Drei Braujahre ohne einen einzigen Sud. Die Bank ruft die Hypothek auf die '
             + 'stillstehende Braustätte; der Kupferhelm kommt unter den Hammer, die '
             + 'Kältemaschine wird ausgebaut und in eine fremde Halle gestellt.',
        art: 'kalt' },
      'anlage-still': {
        kopf: 'Die Anlage wird verkauft · {jahr}',
        folge: 'Drei Braujahre ohne eine einzige Charge. Eine Brauerei, die nicht fährt, ist '
             + 'kein Betrieb mehr, sondern ein Grundstück mit Anlagen darauf — und dafür '
             + 'findet sich immer ein Käufer.',
        art: 'kalt' },
      'haus-verloren': {
        kopf: 'Der Hof ist leer, die Lade auch · {jahr}',
        folge: 'Kein Bargeld, kein Hof, kein Pfand. Es ist nichts mehr da, was ein Gläubiger '
             + 'nehmen könnte, und darum ist auch nichts mehr da, womit weitergebraut würde.',
        art: 'ausgepfaendet' },
      'keine-abnehmer': {
        kopf: 'Das Brauhaus zum Anker hört auf · {jahr}',
        folge: 'Kein Haus der Stadt führt noch Bier des Anker.',
        art: 'entzogen' },
      'gegenwart': {
        kopf: 'Die Gegenwart ist erreicht — das Haus steht noch · {jahr}',
        folge: 'Sechshundert Jahre an demselben Hof, und die Pfanne brennt. Von den Brauereien, '
             + 'die 1350 in dieser Stadt Bier machten, ist das hier die einzige, die noch da ist.',
        gut: true,
        art: 'gegenwart' }
    },

    uebergabe: {
      1: { wort: 'Die Übergabe vor dem Rat',
           satz: 'Der Rat trägt den Sudtag auf den neuen Namen um, der Grutherr nimmt die '
               + 'Kerbe ab und schneidet sie neu. Zwei Zeugen, ein Eintrag, ein Krug.',
           folge: 'Die Pfanne bleibt in der Familie {familie}. {erbe} führt das Haus zum Anker '
                + 'weiter; für {alt} ist im Hinterhaus ein Ausgedinge ausgemacht — Brot, Holz '
                + 'und zwei Eimer Bier in der Woche, aufgeschrieben und siegelt.' },
      2: { wort: 'Die Übergabe vor der Lade',
           satz: 'Die Gerechtigkeit wird vor der Lade auf den neuen Namen geschrieben, das '
               + 'Meisterrecht bestätigt, die Umlage quittiert.',
           folge: 'Die Gerechtigkeit bleibt am Haus und in der Familie {familie}. {erbe} braut '
                + 'ab dem nächsten Sudtag auf eigene Rechnung; {alt} behält Stube, Kammer und '
                + 'das Leibgeding, wie es die Ordnung vorsieht.' },
      3: { wort: 'Die Übergabe beim Notar',
           satz: 'Der Übergabevertrag liegt beim Notar: Grundstück, Sudhaus, Kühlmaschine, '
               + 'Fasspark und Firma gehen über, die Wechsel laufen unverändert weiter.',
           folge: 'Das Haus bleibt eigen und bleibt bei der Familie {familie} — in einem '
                + 'Jahrzehnt, in dem die halbe Straße an die Aktienbrauereien verkauft hat. '
                + '{erbe} führt es weiter, {alt} bekommt eine Leibrente aus dem Betrieb.' },
      4: { wort: 'Die Übergabe im Handelsregister',
           satz: 'Der Eintrag wird geändert, die Bankvollmacht umgeschrieben, die '
               + 'Gebietsleiter des Handels bekommen ein Rundschreiben mit dem neuen Namen.',
           folge: 'Der Anker bleibt selbständig und bleibt bei der Familie {familie} — in dem '
                + 'Jahrzehnt, in dem in Deutschland jede zweite Brauerei zumacht. {erbe} führt '
                + 'ihn weiter, {alt} bleibt im Beirat und geht jeden Morgen durch den '
                + 'Flaschenkeller.' }
    }
  }
};
