/* ===========================================================================
   stuecke/gegner-daten.js — DER GEGNER.  Die Tafeln.

   Hier steht, WOMIT in einer Epoche gebunden wird. Das ist der eigentliche
   Inhalt dieses Stuecks: die Waehrung der Bindung wechselt mit der Zeit.

     I  1350–1516  Recht und Gunst   Konzession · Bannmeile · Ratssitz · Gevatterschaft
     II 1517–1799  Recht und Gunst,  Zunftbrief · Pacht · Heirat · Buergermeisteramt
                   aber durch Zunft
     III 1800–1913 Der Vertrag       Bierlieferungsvertrag mit Darlehen und Abloesesumme
     IV 1914–2025  Die Listung       Listungsgebuehr · Konditionen · Auslistung

   Wer eine Adresse will, muss die fremde Bindung in der Waehrung DIESER Epoche
   abloesen. Die Zugliste ist in keinen zwei Epochen dieselbe — das ist geprueft,
   indem jede Epoche eigene Zugschluessel hat.

   DREI DINGE, DIE MAN AM EIGENEN GESCHAEFT MERKT
     1 Verlorene Haeuser — sein Zeichen haengt am Giebel, die Abloesung steht daran.
     2 Unterbotene Preise — solange sein Preis unter dem Satz steht, zahlt der
       Wirt dem Haus weniger je Fass. Das steht als Zeile im Buch, mit seinem
       Namen davor. Gedeckelt auf DREI vom Hundert des Jahresumsatzes
       (spiel/ZUSTAENDIGKEIT.md §4) — mehr presst er dem Haus nicht ab.
     3 Technik, die er frueher hat — jeder Bau auf seinem Hof hat einen
       'spiegel': den gleichwertigen Aufbau im eigenen Hof. Was er hat und das
       Haus nicht, ist sein Vorsprung, und der Vorsprung verkuerzt seine
       Werbung um je eine Woche. Man sieht die Liste und man sieht die Folge.

   UND EINEN ZUG, DER KEIN GELD KOSTET
   'beschwerde' — je Braujahr einmal, kostet Ansehen statt Bargeld. Damit gibt
   es gegen ihn auch dann noch einen Zug, wenn die Kasse leer ist.

   BESITZSTAND: stuecke/gegner*.js · stil/gegner*.css · bild/gegner/**
   =========================================================================== */

var GEGNER_DATEN = {

  /* ----------------------------------------------------------------------
     DIE HAEUSER GEGENUEBER
     ---------------------------------------------------------------------- */
  haeuser: {
    adler: {
      familie: 'Feist',
      kurz: 'ADLER',
      farbe: 'adler',
      kasse: { 1: 320, 2: 2200, 3: 62000, 4: 1200000 },
      /* Er sitzt in allen vier Epochen auf demselben Fleck jenseits des
         Flusses — und waechst dort. Derselbe Ort, sieben Jahrhunderte. */
      sitz: {
        1: { ort: 'konkurrenz', dx: -2, dy: 6, hofDy: 6,
             sagt: 'jenseits des Flusses, vor der Mauer, wo das Wasser kalt ist und kein Ratszins liegt' },
        2: { ort: 'konkurrenz', dx: -2, dy: 6, hofDy: 6,
             sagt: 'jenseits des Flusses, jetzt aus Stein, mit einer Eisgrube am Hang' },
        3: { ort: 'konkurrenz', dx: -2, dy: 6, hofDy: 6,
             sagt: 'jenseits des Flusses, am Gleis, mit einem Schornstein über dem Tal' },
        4: { ort: 'konkurrenz', dx: -2, dy: 6, hofDy: 6,
             sagt: 'jenseits des Flusses, Tanks im Freien, eigene Ausfahrt zur Bundesstraße' }
      },
      /* Sein Ausschank in der Stadt — vor der Industrie holt er die Kundschaft
         am Markt ab, danach braucht er ihn nicht mehr. */
      nebenzeichen: { bis: 2, ort: 'marktplatz', dx: 4, dy: 9,
                      text: 'Adler-Ausschank am Markt',
                      titel: 'Sein Ausschank in der Stadt. Der Hof liegt jenseits des Flusses.' },
      vornamen: {
        1: ['Cunz', 'Utz', 'Else', 'Hartmann'],
        2: ['Sebastian', 'Barbara', 'Kaspar', 'Apollonia'],
        3: ['Ludwig', 'Xaver', 'Therese', 'Alois'],
        4: ['Werner', 'Hedwig', 'Ottmar', 'Ingeborg']
      },
      titel: { 1: '', 2: '', 3: 'Kommerzienrat ', 4: 'Dr. ' },
      art: { 1: 'Brauhaus', 2: 'Braustatt', 3: 'Brauerei', 4: 'Aktiengesellschaft' }
    },
    konzern: {
      familie: 'Nordstern',
      kurz: 'NORD',
      farbe: 'konzern',
      kasse: { 4: 4200000 },
      sitz: { 4: { ort: 'bahnhof', dx: -3, dy: 23, hofDy: 23, sagt: 'ein Büro am Bahnhof, drei Zimmer, kein Kessel' } },
      vornamen: { 4: ['Reinhard', 'Ute', 'Klaus-Dieter', 'Renate'] },
      titel: { 4: '' },
      art: { 4: 'Gruppe' }
    }
  },

  /* ----------------------------------------------------------------------
     WAS IM BILD DARUEBERSTEHT, WENN ER EINE ADRESSE NIMMT

     RUNDE 2.  Ein Zug legt jetzt einen Zettel an seinen Ort, und darauf steht
     ein Verb. Ein Verb je Epoche waere gelogen: 1350 erwirkt er ein Recht,
     steht aber auch Gevatter, und das ist kein Recht, sondern Gunst. Also
     nennt der Zettel das MITTEL, nicht die Epoche — die Mittelschluessel sind
     ueber alle vier Epochen verschieden, damit sind die Verben es auch, und
     jedes einzelne ist wahr. Ein Zunftbrief von 1795 heisst 1802 noch
     Zunftbrief; deshalb steht die Liste hier oben und nicht in einer Epoche.
     ---------------------------------------------------------------------- */
  verbenMittel: {
    konzession:        'erwirkt die Konzession',
    bannmeile:         'erwirkt den Bann',
    gevatterschaft:    'steht Gevatter',
    ratssitz:          'lässt den Rat sprechen',
    zunftbrief:        'lässt die Zunft zuschreiben',
    pacht:             'pachtet',
    heirat:            'verheiratet die Tochter',
    buergermeister:    'lässt das Amt schreiben',
    vertrag:           'schließt den Liefervertrag',
    depot:             'setzt das Depot',
    hypothek:          'nimmt die Hypothek',
    listung:           'kauft sich ins Regal',
    jahresvereinbarung:'unterschreibt die Jahresvereinbarung',
    exklusiv:          'bindet exklusiv'
  },

  /* Wesenszuege der Erben gegenueber. Sie verschieben die Zuggewichte —
     ein wagemutiger Feist bindet, ein sparsamer baut. */
  wesen: [
    { k: 'streitbar', name: 'streitbar', sagt: 'Führt Prozesse und gewinnt die meisten.',
      mehr: { entreissen: 2.2, macht: 1.8 }, weniger: { bauen: 0.6 } },
    { k: 'sparsam', name: 'sparsam', sagt: 'Zählt jeden Pfennig zweimal.',
      mehr: { bauen: 1.6, preis: 0.6 }, weniger: { werben: 0.7, entreissen: 0.6 } },
    { k: 'grosszuegig', name: 'großzügig', sagt: 'Lässt dem Wirt umsonst liefern, was er braucht.',
      mehr: { werben: 2.0, preis: 1.6 }, weniger: { bauen: 0.7 } },
    { k: 'gelehrt', name: 'gelehrt', sagt: 'Liest, was neu ist, und kauft es zwei Jahre zu früh.',
      mehr: { bauen: 2.0 }, weniger: { entreissen: 0.7 } },
    { k: 'traege', name: 'träge', sagt: 'Lässt laufen. Das ist die einzige Verschnaufpause.',
      mehr: {}, weniger: { werben: 0.5, entreissen: 0.5, bauen: 0.5, macht: 0.4 } },
    { k: 'unnachgiebig', name: 'unnachgiebig', sagt: 'Vergisst nichts und löst nichts.',
      mehr: { entreissen: 1.6, aufstocken: 2.0 }, weniger: { verlieren: 0.5 } }
  ],

  /* ======================================================================
     DIE VIER EPOCHEN
     ====================================================================== */
  epochen: {

    /* ------------------------------------------------------------------
       I — 1350 bis 1516.  Gebunden wird mit Recht und Gunst.
       ------------------------------------------------------------------ */
    1: {
      waehrung: 'Recht und Gunst',
      mengenfaktor: 1,
      satz: 'Gebunden wird mit Recht und mit Gunst. Der Rat verleiht die Schankgerechtigkeit, '
          + 'die Bannmeile sperrt die Meile, ein Ratssitz entscheidet, eine Gevatterschaft hält länger als ein Brief. '
          + 'Geld allein bindet hier niemanden.',
      abloesesatz: 'Eine Ablösung ist ein Ratsentscheid: Schreibgeld an die Kanzlei, ein Gunstgeschenk an die Herren, '
          + 'und der Wirt muss zustimmen. Was der Rat einmal verliehen hat, nimmt er nur gegen Gebühr zurück.',
      werbesatz: 'Er stellt dem Wirt drei Fass umsonst vor die Tür und lässt sie stehen.',
      wochenWerbung: [3, 6],
      abschlagAnteil: 0.30,
      ertragJeFass: 3,
      /* Wie das BILD seine Zuege nennt. Jede Epoche hat andere Woerter — was
         1350 "der Rat spricht zu" heisst, heisst 1970 "wird eingelistet". */
      verben: {
        werben: 'wirbt', binden: 'bindet', zielen: 'spricht vor',
        entreissen: 'erwirkt Recht und Gunst', aufstocken: 'legt zu', bauen: 'baut',
        preis: 'ruft am Markt aus', fuhre: 'karrt', rohstoff: 'kauft die Grut weg',
        macht: 'kommt in den Rat', verlieren: 'verliert', unglueck: 'Unglück',
        not: 'ist klamm', laesstab: 'lässt ab'
      },
      /* DIE ABSICHT — er zielt, ehe er zuschlaegt. Ein Ratsspruch faellt nicht
         am Dienstag aus heiterem Himmel: erst sitzt einer beim Wirt. */
      absicht: {
        kurz: 'spricht vor',
        text: 'Ein Feist sitzt beim Wirt zum {haus} und lässt den Ratsschreiber warten.',
        wochen: [3, 6],
        abwehr: 'Dem Rat zuvorkommen',
        abwehrsatz: 'Das Haus geht selbst zur Kanzlei und lässt sich die Gerechtigkeit '
                  + 'verschreiben, ehe der Adler es tut.'
      },
      /* DIE ANTWORT OHNE BARGELD — sie kostet Bier statt Geld. Das Fass im
         Keller kann auf den Karren oder zum Wirt; beides geht nicht. */
      hinhalten: {
        name: 'Ein Fass an den Wirt', kurz: 'Fass an den Wirt', fass: 1, wochen: 3,
        satz: 'Ein Fass ohne Rechnung vor die Tür des Wirts. Er lässt den Adler warten.',
        marke: 'Fass steht beim Wirt'
      },
      mittel: [
        { k: 'konzession', name: 'Konzession', kurz: 'KON', womit: 'Konzession des Rats', satz: 4, jahre: 4, abschlag: 0.13,
          bindet: 'Der Rat verleiht dem Adler die Schankgerechtigkeit im {haus}.',
          loest: 'Der Rat schreibt die Konzession auf das Haus um. Schreibgeld und Gunstgeschenk.' },
        { k: 'bannmeile', name: 'Bannmeile', kurz: 'BAN', womit: 'Bannrecht', satz: 6, jahre: 6, abschlag: 0.19,
          bindet: 'Der Adler erwirkt den Bannbrief: in der Meile um {haus} schenkt nur sein Bier aus.',
          loest: 'Der Bann wird zerschnitten — das kostet den Rat ein Siegel und dich ein Vermögen.' },
        { k: 'gevatterschaft', name: 'Gevatterschaft', kurz: 'GEV', womit: 'Gevatterschaft', satz: 3, jahre: 8, abschlag: 0.1,
          bindet: 'Der Adler steht dem Wirt zum {haus} Gevatter. Das hält länger als ein Brief.',
          loest: 'Du wirst selber Pate. Ein Taufmahl, ein Löffel Silber, und der Wirt kommt herüber.' },
        { k: 'ratssitz', name: 'Ratsspruch', kurz: 'RAT', womit: 'Ratsspruch', satz: 12, jahre: 10, abschlag: 0.24, fest: true,
          bindet: 'Der Rat spricht {haus} dem Adler zu. Ein Feist sitzt selbst darin.',
          loest: 'Solange ein Feist im Rat sitzt, wird hier nichts umgeschrieben.' }
      ],
      gegenzug: {
        k: 'ratsstuhl', name: 'Den Ratsstuhl kaufen',
        preis: 900,
        sagt: 'Ein Stuhl im Rat der Stadt, auf Lebenszeit, mit Sitz und Stimme.',
        folge: 'Von heute an kann der Adler in dieser Stadt keine Konzession und keinen Ratsspruch mehr auf sich ziehen. '
             + 'Was er hält, hält er weiter.',
        chronik: '{name} kauft den Ratsstuhl. Das Haus sitzt fortan selbst im Rat.'
      },
      beschwerde: {
        k: 'klage', name: 'Klage vor dem Stadtgericht',
        sagt: 'Der Wirt hat unter Zwang gesiegelt, und drei Nachbarn sagen es aus. '
            + 'Ein Schreiber setzt es auf, das Haus trägt es selbst vor.',
        preis: 'Kein Pfennig — aber vier Ansehen, und der Adler weiß, von wem.',
        gelingt: 'Der Rat setzt die Bindung am {haus} um zwei Jahre herunter und schlägt '
               + 'ein Viertel von der Ablösung ab.',
        misslingt: 'Der Rat vertagt. Der Adler lässt am Markt erzählen, wer geklagt hat.'
      },
      bauten: [
        { k: 'bottich', name: 'Zweiter Bottich', preis: 30, glyph: 'bottich', spiegel: 'gaerbottiche',
          nutzen: 'Er sudet zweimal, wo das Haus einmal sudet.' },
        { k: 'grutkammer', name: 'Grutkammer', preis: 26, glyph: 'kammer', spiegel: 'grutkammer',
          nutzen: 'Seine Grut liegt trocken, wenn das Ried unter Wasser steht.' },
        { k: 'darre', name: 'Darrboden', preis: 44, glyph: 'darre', spiegel: 'malzboden',
          nutzen: 'Er darrt selbst und wartet auf keinen fremden Boden.' },
        { k: 'karren', name: 'Zweiter Karren', preis: 22, glyph: 'wagen', spiegel: 'ochsenstall',
          nutzen: 'Zwei Karren an einem Tag: er steht vor dem Haus am Tor.' },
        { k: 'brunnen', name: 'Eigener Brunnen', preis: 38, glyph: 'brunnen', spiegel: 'brunnen',
          nutzen: 'Eigenes Wasser. Er zahlt der Stadt keinen Wasserzins.' },
        { k: 'kufe', name: 'Große Kufe', preis: 34, glyph: 'bottich', spiegel: 'fasslager_holz',
          nutzen: 'Ein Sud von ihm reicht für zwei Wirtshäuser.' }
      ],
      wagenbild: 'wagen1',
      hofbild: 'hof1',
      hofsatz: 'Sein Hof, jenseits des Flusses. 1350 steht dort ein Fachwerkhaus.',
      zuege: [
        { k: 'i-werben', art: 'werben', gewicht: 30 },
        { k: 'i-ratsspruch', art: 'entreissen', gewicht: 20, mittel: 'ratssitz',
          text: 'Der Rat spricht {haus} dem Adler zu. Das Haus hatte dort nur die Gewohnheit.' },
        { k: 'i-bau', art: 'bauen', gewicht: 13 },
        { k: 'i-bierpfennig', art: 'preis', gewicht: 14, schritt: 1,
          text: 'Der Adler ruft am Markt aus: {geld} je {einheit}, einen Pfennig unter dem Satz.' },
        { k: 'i-karren', art: 'fuhre', gewicht: 7,
          text: 'Ein grauer Karren des Adlers fährt zum {haus}.' },
        { k: 'i-ratssitz', art: 'macht', gewicht: 6, marke: 'ratssitz', jahre: 12,
          text: 'Ein Feist wird in den Rat gewählt. Solange er darin sitzt, ist kein Ratsspruch ablösbar.' },
        { k: 'i-verliert', art: 'verlieren', gewicht: 7,
          text: 'Der Rat entzieht dem Adler die Konzession für {haus}. Der Wirt hat geklagt.' },
        { k: 'i-grut', art: 'rohstoff', gewicht: 6, ort: 'hopfengarten',
          text: 'Der Adler kauft die Grut auf dem Ried weg, ehe das Haus am Ried ist.' },
        { k: 'i-brand', art: 'unglueck', gewicht: 4,
          text: 'Dem Adler brennt der Darrboden. Zwei Wochen kein Sud.' }
      ]
    },

    /* ------------------------------------------------------------------
       II — 1517 bis 1799.  Dieselbe Waehrung, andere Instrumente:
       jetzt haelt die Zunft die Hand darauf, und man pachtet Wirtshaeuser.
       ------------------------------------------------------------------ */
    2: {
      waehrung: 'Recht und Gunst — durch Zunft und Pacht',
      mengenfaktor: 1,
      satz: 'Gebunden wird immer noch mit Recht und Gunst, aber die Instrumente sind andere. '
          + 'Die Zunft schreibt zu, wer wen beliefert. Ein Wirtshaus wird nicht überredet, es wird gepachtet. '
          + 'Und wer eine Tochter hat, verheiratet sie ins Haus, das er halten will.',
      abloesesatz: 'Eine Ablösung geht über die Zunftlade: Einlage, Strafgeld, ein Fass an die Bruderschaft. '
          + 'Eine Pacht muss abgekauft werden, eine Heirat kann man überhaupt nicht kaufen — nur überbieten.',
      werbesatz: 'Er lässt dem Wirt das Dach richten und schickt keine Rechnung.',
      wochenWerbung: [4, 8],
      abschlagAnteil: 0.30,
      ertragJeFass: 7,
      verben: {
        werben: 'wirbt', binden: 'bindet', zielen: 'die Lade ladet',
        entreissen: 'greift nach dem Haus', aufstocken: 'schlägt auf', bauen: 'baut',
        preis: 'setzt die Maß', fuhre: 'fährt', rohstoff: 'kauft den Hopfen weg',
        macht: 'wird Bürgermeister', verlieren: 'verliert', unglueck: 'Unglück',
        not: 'ist klamm', laesstab: 'lässt ab'
      },
      absicht: {
        kurz: 'die Lade ladet',
        text: 'Die Zunftlade ladet den Wirt zum {haus} vor. Der Adler sitzt mit am Tisch.',
        wochen: [4, 7],
        abwehr: 'Der Lade zuvorkommen',
        abwehrsatz: 'Das Haus legt der Lade zuerst ein und lässt den Brief auf sich '
                  + 'schreiben, ehe der Adler geladen hat.'
      },
      hinhalten: {
        name: 'Ein Fass an die Bruderschaft', kurz: 'Fass in die Lade', fass: 1, wochen: 3,
        satz: 'Ein Fass zur Bruderschaftszeche. Wer eingelegt hat, wird nicht als '
            + 'erster verhandelt.',
        marke: 'Fass in der Lade'
      },
      mittel: [
        { k: 'zunftbrief', name: 'Zunftbrief', kurz: 'ZUN', womit: 'Zunftbrief', satz: 9, jahre: 6, abschlag: 0.14,
          bindet: 'Die Zunft schreibt {haus} dem Adler zu, mit Brief und Siegel der Lade.',
          loest: 'Die Lade schreibt um: Einlage, Strafgeld und ein Fass an die Bruderschaft.' },
        { k: 'pacht', name: 'Pacht', kurz: 'PAC', womit: 'Pachtvertrag', satz: 14, jahre: 12, abschlag: 0.22,
          bindet: 'Der Adler pachtet {haus} auf zwölf Jahre. Der Wirt ist jetzt sein Wirt.',
          loest: 'Die Pacht wird abgekauft — der Rest der Jahre, in einer Summe, bar.' },
        { k: 'heirat', name: 'Heirat', kurz: 'HEI', womit: 'Heirat', satz: 7, jahre: 14, abschlag: 0.1,
          bindet: 'Der Adler verheiratet seine Tochter an den Wirt zum {haus}.',
          loest: 'Eine Mitgift gegen die andere. Man kauft keine Heirat — man überbietet sie.' },
        { k: 'buergermeister', name: 'Bürgermeisteramt', kurz: 'BGM', womit: 'Amtsgewalt', satz: 18, jahre: 8, abschlag: 0.26, fest: true,
          bindet: 'Der Bürgermeister schreibt {haus} dem Adler zu. Er heißt Feist.',
          loest: 'Solange ein Feist das Amt führt, wird hier nichts umgeschrieben.' }
      ],
      gegenzug: {
        k: 'zunftlade', name: 'Die Zunftlade übernehmen',
        preis: 4200,
        sagt: 'Das Amt des Zunftmeisters, der Schlüssel zur Lade, das Recht auf den Brief.',
        folge: 'Von heute an kostet jede Ablösung eines Zunftbriefs nur noch die Hälfte, und die Zunft '
             + 'schreibt dem Adler nichts mehr zu.',
        chronik: '{name} wird Zunftmeister. Der Schlüssel zur Lade liegt im Haus.'
      },
      beschwerde: {
        k: 'anzeige', name: 'Anzeige bei der Zunftlade',
        sagt: 'Das Haus lässt den Brief in der Lade öffnen und den Eintrag verlesen. '
            + 'Wer zweimal schreibt, hat einmal falsch geschrieben.',
        preis: 'Kein Gulden — aber vier Ansehen bei den Zunftbrüdern, die es nicht gern hören.',
        gelingt: 'Die Lade streicht zwei Jahre aus dem Eintrag am {haus} und lässt ein '
               + 'Viertel der Ablage nach.',
        misslingt: 'Die Lade lässt es auf sich beruhen. Der Zunftmeister isst beim Adler zu Abend.'
      },
      bauten: [
        { k: 'steinkeller', name: 'Gewölbekeller', preis: 260, glyph: 'keller', spiegel: 'keller_gewoelbe',
          nutzen: 'Sein Bier steht kühl bis Jakobi. Das des Hauses nicht.' },
        { k: 'eisgrube', name: 'Eisgrube', preis: 190, glyph: 'eis', spiegel: 'eiskeller',
          nutzen: 'Er schneidet im Jänner Eis und schenkt im August kaltes Bier aus.' },
        { k: 'hopfenboden', name: 'Hopfenboden', preis: 150, glyph: 'kammer', spiegel: 'hopfenlager',
          nutzen: 'Sein Hopfen ist im März noch grün, der zugekaufte ist braun.' },
        { k: 'rossmuehle', name: 'Rossmühle', preis: 220, glyph: 'muehle', spiegel: 'rossmuehle',
          nutzen: 'Er schrotet im Hof und wartet an keinem Mühlwehr.' },
        { k: 'kupferpfanne', name: 'Kupferne Pfanne', preis: 340, glyph: 'pfanne', spiegel: 'pfanne',
          nutzen: 'Kupfer statt Eisen. Sein Sud schmeckt nicht nach Kessel.' },
        { k: 'kueferei', name: 'Eigene Küferei', preis: 180, glyph: 'fass', spiegel: 'kueferei',
          nutzen: 'Er bindet seine Fässer selbst und zahlt keinem Küfer Lohn.' }
      ],
      wagenbild: 'wagen1',
      hofbild: 'hof2',
      hofsatz: 'Derselbe Fleck wie 1350 — nur jetzt aus Stein, mit einer Eisgrube am Hang.',
      zuege: [
        { k: 'ii-werben', art: 'werben', gewicht: 22 },
        { k: 'ii-zunftspruch', art: 'entreissen', gewicht: 15, mittel: 'zunftbrief',
          text: 'Die Zunft schreibt {haus} dem Adler zu. Das Haus war nicht in der Sitzung.' },
        { k: 'ii-pacht', art: 'entreissen', gewicht: 13, mittel: 'pacht',
          text: 'Der Adler pachtet {haus} über den Kopf des Hauses hinweg. Zwölf Jahre.' },
        { k: 'ii-bau', art: 'bauen', gewicht: 14 },
        { k: 'ii-mass', art: 'preis', gewicht: 11, schritt: 2,
          text: 'Der Adler schenkt aus zu {geld} je {einheit} und legt die Zeche drauf.' },
        { k: 'ii-fuhre', art: 'fuhre', gewicht: 7,
          text: 'Ein grauer Wagen des Adlers rollt zum {haus}.' },
        { k: 'ii-amt', art: 'macht', gewicht: 7, marke: 'buergermeister', jahre: 8,
          text: 'Ein Feist wird Bürgermeister. Solange er es ist, schreibt die Kanzlei für ihn.' },
        { k: 'ii-verliert', art: 'verlieren', gewicht: 7,
          text: 'Die Zunft rügt den Adler wegen schlechten Suds. {haus} wird frei.' },
        { k: 'ii-hopfen', art: 'rohstoff', gewicht: 6, ort: 'hopfengarten',
          text: 'Der Adler kauft den Hopfen des ganzen Gartens auf, ehe er reif ist.' },
        { k: 'ii-einquartierung', art: 'unglueck', gewicht: 5,
          text: 'Einquartierung beim Adler: eine Kompanie sauft den Keller leer.' }
      ]
    },

    /* ------------------------------------------------------------------
       III — 1800 bis 1913.  Jetzt bindet Geld, aber schriftlich:
       der Bierlieferungsvertrag mit Darlehen. Wer die Adresse will,
       zahlt die Abloesesumme — Restschuld plus Aufschlag.
       ------------------------------------------------------------------ */
    3: {
      waehrung: 'Der Vertrag — Darlehen und Ablösesumme',
      mengenfaktor: 1.6,
      satz: 'Seit etwa 1860 bindet kein Recht mehr, sondern ein Vertrag. Die Brauerei leiht dem Wirt Geld '
          + 'für Schankanlage, Dach und Schulden; dafür nimmt er zwanzig Jahre lang nur ihr Bier. '
          + 'Das Darlehen steht im Grundbuch, nicht im Ratsprotokoll.',
      abloesesatz: 'Eine Ablösung ist eine Zahl: die Restschuld des Darlehens plus zwölf Hundertstel Aufschlag. '
          + 'Sie sinkt mit jedem getilgten Jahr — und sie steigt, sooft der Adler dem Wirt neues Geld gibt.',
      werbesatz: 'Er bietet dem Wirt ein Darlehen und lässt den Vertrag schon aufsetzen.',
      wochenWerbung: [3, 6],
      abschlagAnteil: 0.30,
      ertragJeFass: 22,
      aufschlag: 0.12,
      tilgung: 0.08,
      verben: {
        werben: 'wirbt', binden: 'schließt ab', zielen: 'rechnet vor',
        entreissen: 'nimmt unter Vertrag', aufstocken: 'stockt das Darlehen auf',
        bauen: 'baut', preis: 'senkt den Preis', fuhre: 'verlädt',
        rohstoff: 'kauft die Ernte weg', macht: 'sitzt im Aufsichtsrat',
        verlieren: 'verliert', unglueck: 'Unglück', not: 'ist klamm',
        laesstab: 'zieht den Vertrag zurück'
      },
      absicht: {
        kurz: 'rechnet vor',
        text: 'Sein Prokurist sitzt beim Wirt zum {haus} und rechnet ihm das Darlehen vor. '
            + 'Der Vertrag liegt schon aufgesetzt daneben.',
        wochen: [3, 6],
        abwehr: 'Dem Vertrag zuvorkommen',
        abwehrsatz: 'Das Haus legt dem Wirt sein eigenes Darlehen hin, ehe der Prokurist '
                  + 'wiederkommt.'
      },
      hinhalten: {
        name: 'Freibier auf die Rechnung des Hauses', kurz: 'Freibier', fass: 2, wochen: 3,
        satz: 'Aus dem Eiskeller, ohne Rechnung. Der Wirt schiebt die Unterschrift auf.',
        marke: 'Freibier läuft'
      },
      mittel: [
        { k: 'vertrag', name: 'Bierlieferungsvertrag', kurz: 'VER', womit: 'Bierlieferungsvertrag', satz: 45, jahre: 10, abschlag: 0.15,
          bindet: 'Der Adler schließt mit {haus} einen Bierlieferungsvertrag: Darlehen {geld}, zehn Jahre.',
          loest: 'Restschuld plus Aufschlag, bar an den Adler, und der Vertrag geht auf das Haus über.' },
        { k: 'depot', name: 'Depotvertrag', kurz: 'DEP', womit: 'Depotvertrag', satz: 70, jahre: 12, abschlag: 0.22,
          bindet: 'Der Adler baut dem {haus} den Eiskeller und schreibt sich zwölf Jahre hinein.',
          loest: 'Der Keller gehört dem Adler. Man kauft ihn heraus oder man lässt es.' },
        { k: 'hypothek', name: 'Hypothek', kurz: 'HYP', womit: 'Hypothek', satz: 110, jahre: 20, abschlag: 0.3,
          bindet: 'Der Adler nimmt die erste Hypothek auf {haus}. Der Wirt schuldet ihm das Dach über dem Kopf.',
          loest: 'Die Hypothek wird abgelöst, in einer Summe, beim Notar.' }
      ],
      gegenzug: {
        k: 'bank', name: 'Das Bankhaus ins Boot holen',
        preis: 26000,
        sagt: 'Ein Kreditrahmen bei der Handelsbank, gegen erste Hypothek auf den eigenen Hof.',
        folge: 'Von heute an kostet jede Ablösung nur noch zwei Drittel — die Bank streckt vor. '
             + 'Der eigene Hof haftet dafür, für immer.',
        chronik: '{name} verpfändet den eigenen Hof an die Handelsbank und bekommt dafür die Vertragsmacht.'
      },
      beschwerde: {
        k: 'nachrechnen', name: 'Dem Wirt die Restschuld nachrechnen',
        sagt: 'Das Haus schickt seinen Buchhalter zum Wirt und rechnet ihm den Vertrag '
            + 'nach — Zins, Tilgung, was der Adler wirklich noch zu fordern hat.',
        preis: 'Keine Mark — aber vier Ansehen. Man rechnet einem Wirt nicht ungestraft nach.',
        gelingt: 'Zwei Jahre Tilgung waren falsch angeschrieben. Die Ablösung am {haus} '
               + 'fällt um ein Viertel.',
        misslingt: 'Der Notar bestätigt jede Zahl. Der Adler lässt es in der Zeitung stehen.'
      },
      bauten: [
        { k: 'eismaschine', name: 'Kältemaschine nach Linde', preis: 9000, glyph: 'maschine', abJahr: 1876,
          spiegel: 'eiskeller', nutzen: 'Kälte ohne Eis vom Weiher. Er braut den Sommer durch, wenn das Haus stillsteht.' },
        { k: 'dampfsud', name: 'Dampfsudwerk', preis: 7400, glyph: 'pfanne', spiegel: 'schornstein',
          nutzen: 'Dampf statt Feuer unter der Pfanne: vier Sude an einem Tag.' },
        { k: 'flaschen', name: 'Flaschenfüllerei', preis: 5200, glyph: 'flasche', abJahr: 1875,
          spiegel: 'flaschenhalle', nutzen: 'Er verkauft ins Wohnzimmer, nicht nur in die Wirtsstube.' },
        { k: 'gleis', name: 'Eigenes Anschlussgleis', preis: 11000, glyph: 'gleis', abJahr: 1839,
          spiegel: 'laderampe', nutzen: 'Sein Bier steht am Morgen in der Nachbarstadt.' },
        { k: 'depothalle', name: 'Depot in der Neustadt', preis: 6300, glyph: 'halle', spiegel: 'kontor',
          nutzen: 'Er hält Vorrat in der Stadt und liefert nach, ehe der Wirt gemerkt hat, dass es fehlt.' },
        { k: 'malzturm', name: 'Malzturm', preis: 8100, glyph: 'turm', spiegel: 'maelzerei',
          nutzen: 'Er mälzt selbst, das ganze Jahr, und kauft kein fremdes Malz.' },
        { k: 'schornstein', name: 'Zweiter Schornstein', preis: 4200, glyph: 'turm', spiegel: 'maschinenhaus',
          nutzen: 'Ein zweiter Kessel unter Dampf. Man sieht es von der Stadtmauer aus.' }
      ],
      wagenbild: 'wagen3',
      /* KEIN hofbild: 1884 steht seine Brauerei auf der Platte selbst. Ein
         zweites Gebaeude daruebergelegt waere eine Attrappe ueber dem Bild. */
      hofsatz: 'Derselbe Fleck wie 1350. Was dort heute steht, hat er in 534 Jahren '
             + 'hingebaut — Backstein, zwei Schornsteine, ein eigenes Gleis.',
      zuege: [
        { k: 'iii-werben', art: 'werben', gewicht: 22 },
        { k: 'iii-vertrag', art: 'entreissen', gewicht: 14, mittel: 'vertrag',
          text: 'Der Adler löst beim {haus} die alte Bindung ab und legt einen Vertrag auf den Tisch.' },
        { k: 'iii-aufstocken', art: 'aufstocken', gewicht: 22,
          text: 'Der Adler stockt das Darlehen beim {haus} um {geld} auf. Die Ablösesumme steigt.' },
        { k: 'iii-bau', art: 'bauen', gewicht: 16 },
        { k: 'iii-preis', art: 'preis', gewicht: 11, schritt: 3,
          text: 'Der Adler senkt den Preis auf {geld} je {einheit}.' },
        { k: 'iii-waggon', art: 'fuhre', gewicht: 6, abJahr: 1839,
          text: 'Zwei Bierwagen des Adlers gehen per Bahn zum {haus}.' },
        { k: 'iii-email', art: 'macht', gewicht: 8, marke: 'emailschild', jahre: 20, abJahr: 1890,
          text: 'Der Adler nagelt ein Emailschild an den Giebel. Es glänzt bis zur nächsten Generation.' },
        { k: 'iii-verliert', art: 'verlieren', gewicht: 6,
          text: 'Der Wirt zum {haus} löst sein Darlehen ab. Der Adler verliert die Adresse.' },
        { k: 'iii-kessel', art: 'unglueck', gewicht: 5,
          text: 'Kesselschaden beim Adler. Die Versicherung zahlt später als der Kesselschmied rechnet.' }
      ]
    },

    /* ------------------------------------------------------------------
       IV — 1914 bis heute.  Gebunden wird durch Listung: das Regal
       gehoert dem Handel, und der Handel verkauft Meter.
       ------------------------------------------------------------------ */
    4: {
      waehrung: 'Die Listung — Gebühr, Konditionen, Auslistung',
      mengenfaktor: 3,
      satz: 'Der Vertrag mit dem Wirt zählt noch, aber entschieden wird im Einkauf. Wer im Regal steht, '
          + 'ist gelistet: Listungsgebühr, Rabattstaffel, Werbekostenzuschuss, Jahresvereinbarung. '
          + 'Und wer nicht zahlt, wird ausgelistet — ohne Prozess, ohne Rat, per Telefon.',
      abloesesatz: 'Eine Ablösung heißt hier: die Konditionen des anderen überbieten. Listungsgebühr, '
          + 'ein Jahr Werbekostenzuschuss im Voraus, und der Einkauf verlangt beides vor der ersten Palette.',
      werbesatz: 'Er lädt den Einkäufer zur Jahresgespräch-Reise und legt die Konditionen daneben.',
      wochenWerbung: [4, 8],
      abschlagAnteil: 0.30,
      ertragJeFass: 55,
      verben: {
        werben: 'wirbt', binden: 'listet ein', zielen: 'verhandelt',
        entreissen: 'listet das Haus aus', aufstocken: 'erhöht die Gebühr',
        bauen: 'baut', preis: 'wirft den Preis', fuhre: 'fährt Lastzug',
        rohstoff: 'kontrahiert die Ernte', macht: 'kauft Anteile',
        verlieren: 'verliert', unglueck: 'Rückruf', not: 'ist klamm',
        laesstab: 'zieht das Angebot zurück'
      },
      absicht: {
        kurz: 'verhandelt',
        text: 'Sein Außendienst sitzt beim Einkauf des {haus} und verhandelt die '
            + 'Konditionen für das nächste Jahr.',
        wochen: [4, 7],
        abwehr: 'Der Listung zuvorkommen',
        abwehrsatz: 'Das Haus unterschreibt die Jahresvereinbarung zuerst — Gebühr und '
                  + 'Zuschuss im Voraus.'
      },
      hinhalten: {
        name: 'Werbekostenzuschuss in Bier', kurz: 'Zuschuss in Bier', fass: 3, wochen: 3,
        satz: 'Aufs Haus statt Geld auf die Rechnung. Der Einkauf vertagt das Gespräch.',
        marke: 'Zuschuss läuft'
      },
      mittel: [
        { k: 'listung', name: 'Listung', kurz: 'LIS', womit: 'Listung', satz: 90, jahre: 3, abschlag: 0.13,
          bindet: 'Der Adler kauft sich beim {haus} ins Regal: Listungsgebühr {geld}.',
          loest: 'Listungsgebühr und ein Jahr Werbekostenzuschuss, im Voraus, an den Einkauf.' },
        { k: 'jahresvereinbarung', name: 'Jahresvereinbarung', kurz: 'JVB', womit: 'Jahresvereinbarung', satz: 150, jahre: 5, abschlag: 0.2,
          bindet: 'Der Adler unterschreibt beim {haus} die Jahresvereinbarung mit voller Rabattstaffel.',
          loest: 'Die Vereinbarung läuft. Wer sie bricht, zahlt sie aus.' },
        { k: 'exklusiv', name: 'Exklusivvertrag', kurz: 'EXK', womit: 'Exklusivvertrag', satz: 260, jahre: 8, abschlag: 0.32,
          bindet: 'Der Adler bindet {haus} exklusiv — acht Jahre, kein fremdes Bier im Haus.',
          loest: 'Exklusiv heißt exklusiv. Auslösen kann man das nur mit sehr viel Geld.' }
      ],
      /* ------------------------------------------------------------------
         DIE FUENFTE HANDLUNG — und es gibt sie nur in dieser Zeit.
         1350 kauft niemand eine Brauerei; 1970 kauft die Gruppe nichts
         anderes. Zwischen Handschlag und Notartermin liegen Wochen, und in
         diesen Wochen zaehlt das hoehere Gebot. Der Betrieb im Nachbartal
         ist fuer ein Haus dieser Groesse unerreichbar — der Ausschank in
         DIESER Stadt, der mit ihm den Besitzer wechselt, ist es nicht.

         Das ist der eine Zug, der keinen festen Tarif hat: drei Gebote
         nebeneinander, jedes mit seinem Preis, keines sicher. Wer zu knapp
         bietet, bekommt die Bietungssicherheit zurueck — bis auf das, was
         beim Notar bleibt.
         ------------------------------------------------------------------ */
      gebot: {
        verb: 'Mitbieten', kurz: 'Notartermin',
        wochen: 5,
        notarteil: 0.12,
        brauereien: [
          'Brauerei Nachtigall im Nachbartal',
          'Klosterbräu Obernberg',
          'Felsenkeller Sankt Veit',
          'Bürgerbräu Neustadt',
          'Aktienbrauerei Waldeck',
          'Brauhaus Hirschau'
        ],
        sagt: 'Die Erben verkaufen. Der Betrieb geht an die Gruppe — der Ausschank in der '
            + 'Stadt geht an den, der beim Notar das höhere Gebot auf dem Tisch hat.',
        stufen: [
          { name: 'knapp darüber', faktor: 1.12, glueck: 0.34,
            sagt: 'Die Erben rechnen nach und rufen die Gruppe noch einmal an.' },
          { name: 'deutlich darüber', faktor: 1.45, glueck: 0.62,
            sagt: 'Genug, dass am Küchentisch darüber geredet wird.' },
          { name: 'so, dass niemand mehr überlegt', faktor: 1.9, glueck: 0.88,
            sagt: 'Der Notar liest vor, und es wird unterschrieben.' }
        ],
        gewonnen: 'Beim Notar unterschreiben die Erben an das Haus: der Ausschank in der Stadt '
                + '— {haus} — gehört ihm. Die Kessel im Tal gehen trotzdem an die Gruppe.',
        verloren: 'Die Erben unterschreiben an die Gruppe. Die Bietungssicherheit kommt zurück, '
                + 'bis auf die Notarkosten — {geld} sind weg, und {haus} ist es auch.',
        verpasst: 'Der Notartermin ist gehalten. Es hat kein zweites Gebot gegeben.'
      },

      /* Das Angebot der Gruppe steht nicht ewig. Wer nicht antwortet, hat
         nicht abgelehnt — er hat nur nicht geantwortet, und dafuer nimmt sie
         sich etwas und fragt spaeter wieder. */
      angebot: {
        wochen: 8,
        ja: 'Ein Viertel abtreten',
        nein: 'Ausschlagen',
        frage: 'Die Nordstern-Gruppe fragt an — beide Antworten sind endgültig',
        jasatz: 'Die Kasse springt, und die Gruppe redet von da an mit: jedes Jahr geht ihr '
              + 'ein Zwanzigstel des Bestands ab, und das Haus gehört nicht mehr ganz sich selbst.',
        neinsatz: 'Kein Geld. Die Gruppe listet das Haus noch am selben Tag bei zwei Adressen '
                + 'aus. Dafür bleibt es ganz.',
        verfallen: 'Die Gruppe zieht die Anfrage zurück. Wer acht Wochen nicht antwortet, '
                 + 'antwortet auch nicht mehr — sie nimmt sich stattdessen {haus} und fragt '
                 + 'in ein paar Jahren wieder.'
      },

      gegenzug: {
        k: 'marke', name: 'Die Marke eintragen lassen',
        preis: 62000,
        sagt: 'Wort- und Bildmarke beim Patentamt, ein eigener Ausschank mit dem Namen am Haus, '
            + 'und ein Anwalt, der beides verteidigt.',
        folge: 'Von heute an kostet jede Listung nur noch zwei Drittel, und wer das Haus auslistet, '
             + 'muss es dem Verbraucher erklären. Eingetragen ist eingetragen.',
        chronik: '{name} lässt die Marke eintragen. Der Name gehört dem Haus, nicht dem Regal.'
      },
      beschwerde: {
        k: 'kartellamt', name: 'Anzeige beim Bundeskartellamt',
        sagt: 'Das Haus schreibt nach Berlin: Exklusivbindung, Ausschluss vom Regal, '
            + 'Konditionen, die kein Kleiner zahlen kann. Aktenzeichen und Wartezeit.',
        preis: 'Keine Mark — aber vier Ansehen. Der Einkauf mag keine Lieferanten mit Anwalt.',
        gelingt: 'Die Beschlussabteilung beanstandet die Bindung am {haus}: zwei Jahre '
               + 'kürzer, ein Viertel billiger abzulösen.',
        misslingt: 'Das Verfahren wird eingestellt. Der Einkauf hat es erfahren, ehe das Haus es erfuhr.'
      },
      bauten: [
        { k: 'drucktanks', name: 'Drucktanks im Freien', preis: 320000, glyph: 'tank', spiegel: 'stahltanks',
          nutzen: 'Er gärt im Freien und braucht keinen Keller mehr dafür.' },
        { k: 'dosenlinie', name: 'Dosenlinie', preis: 480000, glyph: 'halle', spiegel: 'abfuellhalle',
          nutzen: 'Die Dose steht dort im Regal, wo das Fass nie hinkommt.' },
        { k: 'keg', name: 'KEG-Reinigung', preis: 210000, glyph: 'maschine', spiegel: 'kastenlager',
          nutzen: 'Sein Fass kommt sauber zurück und geht am selben Tag wieder raus.' },
        { k: 'fuhrpark', name: 'Eigener Fuhrpark', preis: 260000, glyph: 'wagen', spiegel: 'verladedock',
          nutzen: 'Er fährt selbst und ist nicht auf eine fremde Spedition angewiesen.' },
        { k: 'werbeabteilung', name: 'Werbeabteilung', preis: 140000, glyph: 'schild', spiegel: 'verwaltung',
          nutzen: 'Vier Leute, die den ganzen Tag nichts tun, als an seinen Namen zu denken.' },
        /* Ohne 'spiegel': eine Qualitaetsstelle gibt es im eigenen Hof nicht zu
           kaufen. Das ist keine Luecke in der Tabelle, das ist der Satz. */
        { k: 'labor', name: 'Labor und Qualitätsstelle', preis: 175000, glyph: 'turm',
          nutzen: 'Jede Charge geprüft. Der Einkauf verlangt das Protokoll, und er hat es.' }
      ],
      wagenbild: 'wagen4',
      /* KEIN hofbild: 1970 stehen seine Tanks auf der Platte selbst. */
      hofsatz: 'Derselbe Fleck wie 1350. Heute Drucktanks im Freien, eine eigene '
             + 'Ausfahrt zur Bundesstraße und ein Name, den man aus dem Fernsehen kennt.',
      zuege: [
        { k: 'iv-werben', art: 'werben', gewicht: 22 },
        { k: 'iv-auslisten', art: 'entreissen', gewicht: 20, mittel: 'listung',
          text: 'Der Einkauf des {haus} listet das Haus aus und nimmt den Adler ins Regal.' },
        { k: 'iv-wkz', art: 'aufstocken', gewicht: 14,
          text: 'Der Adler erhöht den Werbekostenzuschuss beim {haus} um {geld}.' },
        { k: 'iv-bau', art: 'bauen', gewicht: 13 },
        { k: 'iv-aktion', art: 'preis', gewicht: 16, schritt: 6,
          text: 'Aktionspreis beim Adler: {geld} je {einheit}, vier Wochen lang, in jedem Prospekt.' },
        { k: 'iv-lastzug', art: 'fuhre', gewicht: 6,
          text: 'Ein grauer Lastzug des Adlers fährt zum {haus}.' },
        { k: 'iv-werbung', art: 'macht', gewicht: 9, marke: 'fernsehen', jahre: 6,
          text: 'Der Adler schaltet einen Werbespot im Abendprogramm. Man kennt den Namen jetzt auch dort, wo er nicht liefert.' },
        { k: 'iv-verliert', art: 'verlieren', gewicht: 6,
          text: 'Der Einkauf des {haus} wirft den Adler aus dem Regal. Zu viele Sorten, zu wenig Umschlag.' },
        { k: 'iv-rueckruf', art: 'unglueck', gewicht: 6,
          text: 'Rückruf beim Adler: eine Charge Pilsner mit Trubstoff, zwei Tage in der Zeitung.' }
      ],
      /* Der Konzern hat eine eigene, kuerzere Liste. Er braut nicht. */
      konzernzuege: [
        { k: 'iv-k-listung', art: 'werben', gewicht: 20 },
        { k: 'iv-k-auslisten', art: 'entreissen', gewicht: 14, mittel: 'jahresvereinbarung',
          text: 'Die Nordstern-Gruppe kauft das Regal im {haus} im Ganzen. Das Haus fliegt raus.' },
        { k: 'iv-k-kondition', art: 'aufstocken', gewicht: 12,
          text: 'Die Gruppe legt beim {haus} {geld} auf die Jahreskonditionen.' },
        { k: 'iv-k-uebernahme', art: 'uebernahme', gewicht: 10,
          text: 'Die Nordstern-Gruppe übernimmt eine kleine Brauerei im Nachbartal.' },
        { k: 'iv-k-verliert', art: 'verlieren', gewicht: 5,
          text: 'Das Kartellamt untersagt der Gruppe eine Bindung. {haus} wird frei.' },
        { k: 'iv-k-angebot', art: 'angebot', gewicht: 7,
          text: 'Die Nordstern-Gruppe lässt anfragen, ob das Haus verkäuflich sei.' }
      ]
    }
  },

  /* Der Deckel aus spiel/ZUSTAENDIGKEIT.md §4: alles, was DER GEGNER dem Haus
     an BARGELD abpresst, bleibt im Braujahr unter drei vom Hundert des
     Umsatzes. Was er sonst nimmt — Adressen, Menge, Vorsprung — ist keine
     Abgabe, sondern verlorenes Geschaeft, und das ist der Sinn der Sache. */
  abschlagKappe: 0.03,

  /* Wieviele Wochen seine Werbung hoechstens kuerzer wird, wenn er Technik
     hat, die das Haus nicht hat. */
  vorsprungKappe: 3,

  /* Orte, an denen eine Marke wirklich im Bild steht und nicht hinter einer
     fremden Tafel verschwindet. Der Gegner sucht sich seine Haeuser lieber
     dort — was er tut, soll man sehen koennen. */
  sichtbar: ['lindenhof', 'marktplatz', 'kirche', 'muehle', 'bruecke_unten',
             'bruecke_oben', 'fluss', 'bahnhof', 'konkurrenz'],

  /* Kurzzeichen fuer das Schild am Giebel. */
  kurz: {
    lindenhof: 'LIN', ochse: 'OCH', torschenke: 'TOR', pfarrhof: 'PFA',
    muehlwirt: 'MUE', brueckenwirt: 'BRU', faehrhaus: 'FAE', hirsch: 'HIR',
    markt: 'MKT', obernberg: 'OBE', bahnhofswirt: 'BHF', neustadt: 'NEU'
  },

  /* Stufen des Untergangs. Auch das Haus gegenueber kann fallen. */
  untergang: [
    { k: 'gesund', name: 'steht gut' },
    { k: 'klamm', name: 'klamm', sagt: 'Die Kasse ist leer. Er verkauft eine Adresse.' },
    { k: 'verpfaendet', name: 'verpfändet', sagt: 'Er verpfändet, was auf dem Hof steht.' },
    { k: 'amende', name: 'am Ende', sagt: 'Er kann nicht mehr. Jetzt entscheidet ein anderer.' }
  ]
};
