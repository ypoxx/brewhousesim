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
      wagen: { name: 'Ochsenkarren', fass: 4, halte: 4, schritt: 1,
               grund: 2, jeKm: 2.5, haltPreis: 1, umlauf: 2, bruch: 0.03,
               satz: 'Vier Plätze. Der Ochse geht sieben Meilen am Tag und keine mehr.' },
      faesser: 22,
      planStart: 1,
      unterhalt: 2,
      mengenfaktor: 1,
      winteranteil: 0.68,
      sommerSatz: 'Sommerbrauverbot. Zwischen Georgi und Michaeli brennt kein Feuer '
                + 'unter der Pfanne — die Stadt fürchtet den Brand.',
      monate: ['Wonnemond', 'Brachet', 'Heuert', 'Ernting', 'Scheiding'],
      abgabe: { satz: 0.12, name: 'Ungeld',
                sagt: 'Der Rat nimmt vom Bier, das ausgeschenkt wurde. Wer mehr verkauft, zahlt mehr.' },
      bannmeile: 1,
      bann: { name: 'Bannbrief', basis: 60, staffel: 1.55,
              satz: 'Der Rat erlaubt die Ausfuhr an ein Haus. Für immer. Unwiderruflich.' },
      kaeufe: [
        { k: 'budget',   text: 'Brautage vom Rat · +6', basis: 90, staffel: 1.6, menge: 6,
          titel: 'Sechs zusätzliche Brautage in diesem Braujahr. Der Rat verkauft sie ungern und teuer.' },
        { k: 'rohstoff', text: 'Grut vom Grutherrn · +40', basis: 46, staffel: 1.0, menge: 40,
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
          tage: 2, fass: 4, reife: 0, haltbar: 6, preis: 9, kosten: 8, rohstoff: 3,
          sommer: false,
          satz: 'Das Bier des Hauses. Grut aus Gagel, Porst und Schafgarbe — kein Hopfen.' },
        { k: 'stark', name: 'Starkbier', zeichen: 'S', stufe: 3,
          tage: 3, fass: 3, reife: 2, haltbar: 16, preis: 19, kosten: 15, rohstoff: 6,
          sommer: true,
          satz: 'Drei Tage für drei Fass. Dafür hält es bis in den Sommer, und das Kloster zahlt.' }
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
      wagen: { name: 'Pferdefuhrwerk', fass: 8, halte: 5, schritt: 1,
               grund: 6, jeKm: 3.5, haltPreis: 2.5, umlauf: 3, bruch: 0.04,
               satz: 'Acht Plätze, fünf Halte, zwei Pferde. Die Fässer kommen erst nach Wochen zurück.' },
      faesser: 38,
      planStart: 1,
      unterhalt: 4,
      mengenfaktor: 1,
      winteranteil: 0.68,
      sommerSatz: 'Das Sommerbrauverbot steht seit 1553 in der Ordnung: von Georgi bis '
                + 'Michaeli wird nicht gebraut. Was im April im Keller liegt, ist der ganze Sommer.',
      monate: ['Wonnemond', 'Brachet', 'Heuert', 'Ernting', 'Scheiding'],
      abgabe: { satz: 0.13, name: 'Ungeld und Zunftbeitrag',
                sagt: 'Der Stadt das Ungeld, der Zunft den Beitrag. Beides nach Ausstoß.' },
      bannmeile: 0,
      kaeufe: [
        { k: 'budget',   text: 'Reihe vom Nachbarn · +4 Sude', basis: 300, staffel: 1.7, menge: 4,
          titel: 'Ein Zunftgenosse tritt vier Sude seiner Reihe ab. Gilt nur für dieses Braujahr.' },
        { k: 'fass',     text: 'Fässer vom Böttcher · +4', basis: 92, staffel: 1.07, menge: 4,
          titel: 'Vier Fässer mehr im Umlauf. Das ist in dieser Epoche die eigentliche Währung.' },
        { k: 'rohstoff', text: 'Hopfen vom Markt · +60', basis: 200, staffel: 1.0, menge: 60,
          titel: 'Reinheitsgebot: Gerste, Hopfen, Wasser. Grut ist verboten.' }
      ],
      sorten: [
        { k: 'schank', name: 'Schankbier', zeichen: 'S', stufe: 1,
          sude: 1, fass: 8, reife: 0, haltbar: 4, preis: 13, kosten: 20, rohstoff: 5,
          sommer: false,
          satz: 'Dünn, schnell, acht Fass aus einem Sud. Füllt den Wagen, füllt nicht die Kasse.' },
        { k: 'braun', name: 'Braunbier', zeichen: 'B', stufe: 2,
          sude: 1, fass: 6, reife: 1, haltbar: 10, preis: 22, kosten: 28, rohstoff: 8,
          sommer: false,
          satz: 'Das Bier der Zunft. Sechs Fass, eine Woche Lager, jeder Wirt nimmt es.' },
        { k: 'maerzen', name: 'Märzenbier', zeichen: 'M', stufe: 3,
          sude: 1, fass: 4, reife: 10, haltbar: 34, preis: 40, kosten: 40, rohstoff: 11,
          sommer: true,
          satz: 'Zehn Wochen im Fass, ehe es taugt — zehn Wochen belegter Platz. '
              + 'Dafür überlebt es als einziges den Sommer.' }
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
      planStart: 2,
      unterhalt: 110,
      tafel: { name: 'Sudplan', unter: 'am schwarzen Brett der Mälzerei',
               preis: 260, freiBis: 3 },
      keller: { name: 'Der Eiskeller', bettFass: 2, bett: 'Lagerfass', spalten: 9,
                satz: 'Ein Lagerfass zu drei Hektoliter. Ohne Eis wird alles darin sauer.' },
      wagen: { name: 'Bahnfracht ab Rampe', fass: 12, halte: 6, schritt: 4,
               grund: 0, jeKm: 0, haltPreis: 0, umlauf: 2, bruch: 0.02,
               satz: 'Die Rampe geht an den Bahnhof. Was sie kostet, entscheidet die Stufe.' },
      fracht: [
        { k: 'stueck', name: 'Stückgut',      fass: 12, pauschale: 70,  jeFass: 16, jeKm: 7,
          satz: 'Jede Menge, jede Woche — und je Fass am teuersten.' },
        { k: 'halb',   name: 'Halber Wagen',   fass: 40, pauschale: 460, jeFass: 0,  jeKm: 12,
          satz: 'Pauschale. Vierzig Fass passen hinein; bezahlt wird der Wagen, nicht die Ladung.' },
        { k: 'ganz',   name: 'Ganzer Wagen',   fass: 88, pauschale: 700, jeFass: 0,  jeKm: 16,
          satz: 'Achtundachtzig Fass. Halb gefüllt ist er das teuerste Geschäft des Hauses.' }
      ],
      eis: { start: 60, keller: 90, jeFuder: 16, menge: 16, frostVon: 9, frostBis: 22,
             satz: 'Eis wird aus dem Fluss geschnitten, solange er trägt. Danach nicht mehr.' },
      faesser: 260,
      mengenfaktor: 3,
      winteranteil: 0.68,
      sommerSatz: 'Die Kältemaschine koennte im Juli brauen. Der Sommerabsatz kommt '
                + 'trotzdem aus dem Lagerkeller — was im April eingelagert ist, ist der Sommer.',
      monate: ['Mai', 'Juni', 'Juli', 'August', 'September'],
      abgabe: { satz: 0.11, name: 'Biersteuer und Malzaufschlag',
                sagt: 'Seit 1879 wird das Malz besteuert. Wer mehr einbraut, zahlt mehr.' },
      bannmeile: 0,
      kaeufe: [
        { k: 'eis',      text: 'Eis schneiden · +16 Fuder', basis: 190, staffel: 1.0, menge: 16,
          titel: 'Nur solange der Fluss trägt. Im Maerz ist damit Schluss, egal wie voll die Kasse ist.' },
        { k: 'eiskeller',text: 'Eiskeller vergrößern · +20', basis: 1800, staffel: 1.6, menge: 20,
          titel: 'Mehr Fuder Fassungsraum. Unwiderruflich gebaut.' },
        { k: 'sudwerk',  text: 'Dampfsudwerk · +1 Sud je Woche', basis: 4200, staffel: 1.9, menge: 1,
          titel: 'Eine zweite Pfanne unter Dampf. Unwiderruflich.' },
        { k: 'rohstoff', text: 'Hopfen aus der Hallertau · +300', basis: 1500, staffel: 1.0, menge: 300,
          titel: 'Waggonweise, ab Bahnhof.' }
      ],
      sorten: [
        { k: 'schank', name: 'Schankbier', zeichen: 'S', stufe: 1,
          fass: 34, reife: 0, haltbar: 3, preis: 44, kosten: 620, rohstoff: 26, eis: 1,
          sommer: false,
          satz: 'Vierunddreißig Fass aus einem Sud, sofort lieferbar, drei Wochen haltbar. '
              + 'Füllt den halben Wagen im Alleingang.' },
        { k: 'lager', name: 'Lagerbier', zeichen: 'L', stufe: 2,
          fass: 28, reife: 4, haltbar: 24, preis: 72, kosten: 750, rohstoff: 34, eis: 2,
          sommer: false,
          satz: 'Vier Wochen auf Eis. Das Bier, an dem die Kältemaschine haengt.' },
        { k: 'export', name: 'Exportbier', zeichen: 'E', stufe: 3,
          fass: 22, reife: 10, haltbar: 46, preis: 108, kosten: 880, rohstoff: 42, eis: 3,
          sommer: true,
          satz: 'Zehn Wochen Eis und Platz. Es fährt weit, es hält lang, es frisst den Eiskeller.' }
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
      planStart: 2,
      unterhalt: 1200,
      tafel: { name: 'Sudplan', unter: 'im Schaltraum, auf Formica',
               preis: 2400, freiBis: 3 },
      keller: { name: 'Die Tanks', bettFass: 20, bett: 'Drucktank', spalten: 5,
                satz: 'Ein Drucktank zu dreißig Hektoliter. Der Keller ist kein Keller mehr.' },
      wagen: { name: 'Lastzug', fass: 300, halte: 3, schritt: 20,
               grund: 400, jeKm: 30, haltPreis: 900, umlauf: 1, bruch: 0.01,
               satz: 'Drei Halte je Tour. Die Menge ist kein Problem mehr — der Plan schon.' },
      faesser: 1400,
      mengenfaktor: 10,
      winteranteil: 0.68,
      sommerSatz: 'Die Sudpfanne steht im Sommer für die Wartung still. Der Sommerabsatz '
                + 'kommt aus den Tanks — und in den Tanks ist, was im April drin war.',
      monate: ['Mai', 'Juni', 'Juli', 'August', 'September'],
      bannmeile: 0,
      abgabe: { satz: 0.13, name: 'Biersteuer und Werbeetat',
                sagt: 'Steuer nach Ausstoß, Werbung nach Marktanteil am eigenen Ausstoß. '
                    + 'Beides wächst mit dem Haus.' },
      listung: { name: 'Listung', basis: 4200, staffel: 1.3,
                 satz: 'Werbekostenzuschuss. Ein Regalmeter für eine Sorte, ein Jahr lang. '
                     + 'Zu Georgi fällt sie, wenn nichts geliefert wurde.' },
      kaeufe: [
        { k: 'lastzug',  text: 'Zweiter Lastzug · +1 Halt', basis: 128000, staffel: 1.8, menge: 1,
          titel: 'Ein Halt mehr je Woche. Das ist in dieser Epoche die einzige echte Vergrößerung.' },
        { k: 'sudwerk',  text: 'Sudhaus erweitern · +1 Sud je Woche', basis: 56000, staffel: 1.7, menge: 1,
          titel: 'Mehr Sude je Woche. Unwiderruflich.' },
        { k: 'rohstoff', text: 'Hopfen im Kontrakt · +1200', basis: 14400, staffel: 1.0, menge: 1200,
          titel: 'Jahreskontrakt mit der Hallertau.' }
      ],
      sorten: [
        { k: 'hell', name: 'Vollbier Hell', zeichen: 'H', stufe: 1,
          fass: 60, reife: 1, haltbar: 18, preis: 150, kosten: 3900, rohstoff: 55,
          sommer: false,
          satz: 'Die Menge. Sechzig Fass je Sud, eine Woche Reife, jedes Regal nimmt es.' },
        { k: 'pils', name: 'Pilsner', zeichen: 'P', stufe: 2,
          fass: 50, reife: 3, haltbar: 26, preis: 195, kosten: 4200, rohstoff: 62,
          sommer: true,
          satz: 'Die Marke. Drei Wochen Reife, und der Meter im Regal kostet extra.' },
        { k: 'export', name: 'Exportbier', zeichen: 'E', stufe: 3,
          fass: 40, reife: 5, haltbar: 40, preis: 245, kosten: 4600, rohstoff: 70,
          sommer: true,
          satz: 'Fünf Wochen Reife, vierzig Fass. Die Gaststätte zahlt es, der Markt nicht.' }
      ]
    }
  }
};
