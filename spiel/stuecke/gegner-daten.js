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
      kasse: { 1: 150, 2: 900, 3: 21000, 4: 260000 },
      /* Er sitzt in allen vier Epochen auf demselben Fleck jenseits des
         Flusses — und waechst dort. Derselbe Ort, sieben Jahrhunderte. */
      sitz: {
        1: { ort: 'konkurrenz', dx: -4, dy: 4, hofDy: 4,
             sagt: 'jenseits des Flusses, vor der Mauer, wo das Wasser kalt ist und kein Ratszins liegt' },
        2: { ort: 'konkurrenz', dx: -4, dy: 4, hofDy: 4,
             sagt: 'jenseits des Flusses, jetzt aus Stein, mit einer Eisgrube am Hang' },
        3: { ort: 'konkurrenz', dx: -4, dy: 4, hofDy: 4,
             sagt: 'jenseits des Flusses, am Gleis, mit einem Schornstein ueber dem Tal' },
        4: { ort: 'konkurrenz', dx: -4, dy: 4, hofDy: 4,
             sagt: 'jenseits des Flusses, Tanks im Freien, eigene Ausfahrt zur Bundesstrasse' }
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
      sitz: { 4: { ort: 'bahnhof', dx: -3, dy: 6, hofDy: 6, sagt: 'ein Buero am Bahnhof, drei Zimmer, kein Kessel' } },
      vornamen: { 4: ['Reinhard', 'Ute', 'Klaus-Dieter', 'Renate'] },
      titel: { 4: '' },
      art: { 4: 'Gruppe' }
    }
  },

  /* Wesenszuege der Erben gegenueber. Sie verschieben die Zuggewichte —
     ein wagemutiger Feist bindet, ein sparsamer baut. */
  wesen: [
    { k: 'streitbar', name: 'streitbar', sagt: 'Fuehrt Prozesse und gewinnt die meisten.',
      mehr: { entreissen: 2.2, macht: 1.8 }, weniger: { bauen: 0.6 } },
    { k: 'sparsam', name: 'sparsam', sagt: 'Zaehlt jeden Pfennig zweimal.',
      mehr: { bauen: 1.6, preis: 0.6 }, weniger: { werben: 0.7, entreissen: 0.6 } },
    { k: 'grosszuegig', name: 'grosszuegig', sagt: 'Setzt dem Wirt drei Fass umsonst vor die Tuer.',
      mehr: { werben: 2.0, preis: 1.6 }, weniger: { bauen: 0.7 } },
    { k: 'gelehrt', name: 'gelehrt', sagt: 'Liest, was neu ist, und kauft es zwei Jahre zu frueh.',
      mehr: { bauen: 2.0 }, weniger: { entreissen: 0.7 } },
    { k: 'traege', name: 'traege', sagt: 'Laesst laufen. Das ist die einzige Verschnaufpause.',
      mehr: {}, weniger: { werben: 0.5, entreissen: 0.5, bauen: 0.5, macht: 0.4 } },
    { k: 'unnachgiebig', name: 'unnachgiebig', sagt: 'Vergisst nichts und loest nichts.',
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
          + 'die Bannmeile sperrt die Meile, ein Ratssitz entscheidet, eine Gevatterschaft haelt laenger als ein Brief. '
          + 'Geld allein bindet hier niemanden.',
      abloesesatz: 'Eine Abloesung ist ein Ratsentscheid: Schreibgeld an die Kanzlei, ein Gunstgeschenk an die Herren, '
          + 'und der Wirt muss zustimmen. Was der Rat einmal verliehen hat, nimmt er nur gegen Gebuehr zurueck.',
      werbesatz: 'Er stellt dem Wirt drei Fass umsonst vor die Tuer und laesst sie stehen.',
      wochenWerbung: [3, 6],
      abschlagAnteil: 0.30,
      ertragJeFass: 3,
      mittel: [
        { k: 'konzession', name: 'Konzession', kurz: 'KON', womit: 'Konzession des Rats', satz: 4, jahre: 4,
          bindet: 'Der Rat verleiht dem Adler die Schankgerechtigkeit im {haus}.',
          loest: 'Der Rat schreibt die Konzession auf das Haus um. Schreibgeld und Gunstgeschenk.' },
        { k: 'bannmeile', name: 'Bannmeile', kurz: 'BAN', womit: 'Bannrecht', satz: 6, jahre: 6,
          bindet: 'Der Adler erwirkt den Bannbrief: in der Meile um {haus} schenkt nur sein Bier aus.',
          loest: 'Der Bann wird zerschnitten — das kostet den Rat ein Siegel und dich ein Vermoegen.' },
        { k: 'gevatterschaft', name: 'Gevatterschaft', kurz: 'GEV', womit: 'Gevatterschaft', satz: 3, jahre: 8,
          bindet: 'Der Adler steht dem Wirt zum {haus} Gevatter. Das haelt laenger als ein Brief.',
          loest: 'Du wirst selber Pate. Ein Taufmahl, ein Loeffel Silber, und der Wirt kommt herueber.' },
        { k: 'ratssitz', name: 'Ratsspruch', kurz: 'RAT', womit: 'Ratsspruch', satz: 12, jahre: 10, fest: true,
          bindet: 'Der Rat spricht {haus} dem Adler zu. Ein Feist sitzt selbst darin.',
          loest: 'Solange ein Feist im Rat sitzt, wird hier nichts umgeschrieben.' }
      ],
      gegenzug: {
        k: 'ratsstuhl', name: 'Den Ratsstuhl kaufen',
        preis: 900,
        sagt: 'Ein Stuhl im Rat der Stadt, auf Lebenszeit, mit Sitz und Stimme.',
        folge: 'Von heute an kann der Adler in dieser Stadt keine Konzession und keinen Ratsspruch mehr auf sich ziehen. '
             + 'Was er haelt, haelt er weiter.',
        chronik: '{name} kauft den Ratsstuhl. Das Haus sitzt fortan selbst im Rat.'
      },
      bauten: [
        { k: 'bottich', name: 'Zweiter Bottich', preis: 30, glyph: 'bottich' },
        { k: 'grutkammer', name: 'Grutkammer', preis: 26, glyph: 'kammer' },
        { k: 'darre', name: 'Darrboden', preis: 44, glyph: 'darre' },
        { k: 'karren', name: 'Zweiter Karren', preis: 22, glyph: 'wagen' },
        { k: 'brunnen', name: 'Eigener Brunnen', preis: 38, glyph: 'brunnen' },
        { k: 'kufe', name: 'Grosse Kufe', preis: 34, glyph: 'bottich' }
      ],
      wagenbild: 'wagen1',
      hofbild: 'hof1',
      zuege: [
        { k: 'i-werben', art: 'werben', gewicht: 26 },
        { k: 'i-ratsspruch', art: 'entreissen', gewicht: 10, mittel: 'ratssitz',
          text: 'Der Rat spricht {haus} dem Adler zu. Das Haus hatte dort nur die Gewohnheit.' },
        { k: 'i-bau', art: 'bauen', gewicht: 14 },
        { k: 'i-bierpfennig', art: 'preis', gewicht: 12, schritt: 1,
          text: 'Der Adler ruft am Markt aus: {geld} je Fass, einen Pfennig unter dem Satz.' },
        { k: 'i-karren', art: 'fuhre', gewicht: 16,
          text: 'Ein grauer Karren des Adlers faehrt zum {haus}.' },
        { k: 'i-ratssitz', art: 'macht', gewicht: 6, marke: 'ratssitz', jahre: 12,
          text: 'Ein Feist wird in den Rat gewaehlt. Solange er darin sitzt, ist kein Ratsspruch abloesbar.' },
        { k: 'i-verliert', art: 'verlieren', gewicht: 7,
          text: 'Der Rat entzieht dem Adler die Konzession fuer {haus}. Der Wirt hat geklagt.' },
        { k: 'i-grut', art: 'rohstoff', gewicht: 8, ort: 'hopfengarten',
          text: 'Der Adler kauft die Grut auf dem Ried weg, ehe das Haus am Ried ist.' },
        { k: 'i-brand', art: 'unglueck', gewicht: 5,
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
          + 'Die Zunft schreibt zu, wer wen beliefert. Ein Wirtshaus wird nicht ueberredet, es wird gepachtet. '
          + 'Und wer eine Tochter hat, verheiratet sie ins Haus, das er halten will.',
      abloesesatz: 'Eine Abloesung geht ueber die Zunftlade: Einlage, Strafgeld, ein Fass an die Bruderschaft. '
          + 'Eine Pacht muss abgekauft werden, eine Heirat kann man ueberhaupt nicht kaufen — nur ueberbieten.',
      werbesatz: 'Er laesst dem Wirt das Dach richten und schickt keine Rechnung.',
      wochenWerbung: [4, 8],
      abschlagAnteil: 0.30,
      ertragJeFass: 7,
      mittel: [
        { k: 'zunftbrief', name: 'Zunftbrief', kurz: 'ZUN', womit: 'Zunftbrief', satz: 9, jahre: 6,
          bindet: 'Die Zunft schreibt {haus} dem Adler zu, mit Brief und Siegel der Lade.',
          loest: 'Die Lade schreibt um: Einlage, Strafgeld und ein Fass an die Bruderschaft.' },
        { k: 'pacht', name: 'Pacht', kurz: 'PAC', womit: 'Pachtvertrag', satz: 14, jahre: 12,
          bindet: 'Der Adler pachtet {haus} auf zwoelf Jahre. Der Wirt ist jetzt sein Wirt.',
          loest: 'Die Pacht wird abgekauft — der Rest der Jahre, in einer Summe, bar.' },
        { k: 'heirat', name: 'Heirat', kurz: 'HEI', womit: 'Heirat', satz: 7, jahre: 14,
          bindet: 'Der Adler verheiratet seine Tochter an den Wirt zum {haus}.',
          loest: 'Eine Mitgift gegen die andere. Man kauft keine Heirat — man ueberbietet sie.' },
        { k: 'buergermeister', name: 'Buergermeisteramt', kurz: 'BGM', womit: 'Amtsgewalt', satz: 18, jahre: 8, fest: true,
          bindet: 'Der Buergermeister schreibt {haus} dem Adler zu. Er heisst Feist.',
          loest: 'Solange ein Feist das Amt fuehrt, wird hier nichts umgeschrieben.' }
      ],
      gegenzug: {
        k: 'zunftlade', name: 'Die Zunftlade uebernehmen',
        preis: 4200,
        sagt: 'Das Amt des Zunftmeisters, der Schluessel zur Lade, das Recht auf den Brief.',
        folge: 'Von heute an kostet jede Abloesung eines Zunftbriefs nur noch die Haelfte, und die Zunft '
             + 'schreibt dem Adler nichts mehr zu.',
        chronik: '{name} wird Zunftmeister. Der Schluessel zur Lade liegt im Haus.'
      },
      bauten: [
        { k: 'steinkeller', name: 'Gewoelbekeller', preis: 260, glyph: 'keller' },
        { k: 'eisgrube', name: 'Eisgrube', preis: 190, glyph: 'eis' },
        { k: 'hopfenboden', name: 'Hopfenboden', preis: 150, glyph: 'kammer' },
        { k: 'rossmuehle', name: 'Rossmuehle', preis: 220, glyph: 'muehle' },
        { k: 'kupferpfanne', name: 'Kupferne Pfanne', preis: 340, glyph: 'pfanne' },
        { k: 'kueferei', name: 'Eigene Kueferei', preis: 180, glyph: 'fass' }
      ],
      wagenbild: 'wagen1',
      hofbild: 'hof2',
      zuege: [
        { k: 'ii-werben', art: 'werben', gewicht: 24 },
        { k: 'ii-zunftspruch', art: 'entreissen', gewicht: 11, mittel: 'zunftbrief',
          text: 'Die Zunft schreibt {haus} dem Adler zu. Das Haus war nicht in der Sitzung.' },
        { k: 'ii-bau', art: 'bauen', gewicht: 15 },
        { k: 'ii-mass', art: 'preis', gewicht: 10, schritt: 2,
          text: 'Der Adler schenkt die Mass zu {geld} je Fass aus und legt die Zeche drauf.' },
        { k: 'ii-fuhre', art: 'fuhre', gewicht: 15,
          text: 'Ein grauer Wagen des Adlers rollt zum {haus}.' },
        { k: 'ii-amt', art: 'macht', gewicht: 7, marke: 'buergermeister', jahre: 8,
          text: 'Ein Feist wird Buergermeister. Solange er es ist, schreibt die Kanzlei fuer ihn.' },
        { k: 'ii-verliert', art: 'verlieren', gewicht: 7,
          text: 'Die Zunft ruegt den Adler wegen schlechten Suds. {haus} wird frei.' },
        { k: 'ii-hopfen', art: 'rohstoff', gewicht: 8, ort: 'hopfengarten',
          text: 'Der Adler kauft den Hopfen des ganzen Gartens auf, ehe er reif ist.' },
        { k: 'ii-einquartierung', art: 'unglueck', gewicht: 6,
          text: 'Einquartierung beim Adler: eine Kompanie sauft den Keller leer.' }
      ]
    },

    /* ------------------------------------------------------------------
       III — 1800 bis 1913.  Jetzt bindet Geld, aber schriftlich:
       der Bierlieferungsvertrag mit Darlehen. Wer die Adresse will,
       zahlt die Abloesesumme — Restschuld plus Aufschlag.
       ------------------------------------------------------------------ */
    3: {
      waehrung: 'Der Vertrag — Darlehen und Abloesesumme',
      mengenfaktor: 1.6,
      satz: 'Seit etwa 1860 bindet kein Recht mehr, sondern ein Vertrag. Die Brauerei leiht dem Wirt Geld '
          + 'fuer Schankanlage, Dach und Schulden; dafuer nimmt er zwanzig Jahre lang nur ihr Bier. '
          + 'Das Darlehen steht im Grundbuch, nicht im Ratsprotokoll.',
      abloesesatz: 'Eine Abloesung ist eine Zahl: die Restschuld des Darlehens plus zwoelf Hundertstel Aufschlag. '
          + 'Sie sinkt mit jedem getilgten Jahr — und sie steigt, sooft der Adler dem Wirt neues Geld gibt.',
      werbesatz: 'Er bietet dem Wirt ein Darlehen und laesst den Vertrag schon aufsetzen.',
      wochenWerbung: [3, 6],
      abschlagAnteil: 0.30,
      ertragJeFass: 22,
      aufschlag: 0.12,
      tilgung: 0.08,
      mittel: [
        { k: 'vertrag', name: 'Bierlieferungsvertrag', kurz: 'VER', womit: 'Bierlieferungsvertrag', satz: 75, jahre: 10,
          bindet: 'Der Adler schliesst mit {haus} einen Bierlieferungsvertrag: Darlehen {geld}, zehn Jahre.',
          loest: 'Restschuld plus Aufschlag, bar an den Adler, und der Vertrag geht auf das Haus ueber.' },
        { k: 'depot', name: 'Depotvertrag', kurz: 'DEP', womit: 'Depotvertrag', satz: 130, jahre: 12,
          bindet: 'Der Adler baut dem {haus} den Eiskeller und schreibt sich zwoelf Jahre hinein.',
          loest: 'Der Keller gehoert dem Adler. Man kauft ihn heraus oder man laesst es.' },
        { k: 'hypothek', name: 'Hypothek', kurz: 'HYP', womit: 'Hypothek', satz: 200, jahre: 20,
          bindet: 'Der Adler nimmt die erste Hypothek auf {haus}. Der Wirt schuldet ihm das Dach ueber dem Kopf.',
          loest: 'Die Hypothek wird abgeloest, in einer Summe, beim Notar.' }
      ],
      gegenzug: {
        k: 'bank', name: 'Das Bankhaus ins Boot holen',
        preis: 26000,
        sagt: 'Ein Kreditrahmen bei der Handelsbank, gegen erste Hypothek auf den eigenen Hof.',
        folge: 'Von heute an kostet jede Abloesung nur noch zwei Drittel — die Bank streckt vor. '
             + 'Der eigene Hof haftet dafuer, fuer immer.',
        chronik: '{name} verpfaendet den eigenen Hof an die Handelsbank und bekommt dafuer die Vertragsmacht.'
      },
      bauten: [
        { k: 'eismaschine', name: 'Kaeltemaschine nach Linde', preis: 9000, glyph: 'maschine' },
        { k: 'dampfsud', name: 'Dampfsudwerk', preis: 7400, glyph: 'pfanne' },
        { k: 'flaschen', name: 'Flaschenfuellerei', preis: 5200, glyph: 'flasche' },
        { k: 'gleis', name: 'Eigenes Anschlussgleis', preis: 11000, glyph: 'gleis' },
        { k: 'depothalle', name: 'Depot in der Neustadt', preis: 6300, glyph: 'halle' },
        { k: 'malzturm', name: 'Malzturm', preis: 8100, glyph: 'turm' },
        { k: 'schornstein', name: 'Zweiter Schornstein', preis: 4200, glyph: 'turm' }
      ],
      wagenbild: 'wagen3',
      hofbild: 'hof3',
      zuege: [
        { k: 'iii-werben', art: 'werben', gewicht: 24 },
        { k: 'iii-vertrag', art: 'entreissen', gewicht: 10, mittel: 'vertrag',
          text: 'Der Adler loest beim {haus} die alte Bindung ab und legt einen Vertrag auf den Tisch.' },
        { k: 'iii-aufstocken', art: 'aufstocken', gewicht: 12,
          text: 'Der Adler stockt das Darlehen beim {haus} um {geld} auf. Die Abloesesumme steigt.' },
        { k: 'iii-bau', art: 'bauen', gewicht: 16 },
        { k: 'iii-preis', art: 'preis', gewicht: 10, schritt: 3,
          text: 'Der Adler senkt den Preis je Hektoliter auf {geld}.' },
        { k: 'iii-waggon', art: 'fuhre', gewicht: 14,
          text: 'Zwei Bierwagen des Adlers gehen per Bahn zum {haus}.' },
        { k: 'iii-email', art: 'macht', gewicht: 8, marke: 'emailschild', jahre: 20, abJahr: 1890,
          text: 'Der Adler nagelt ein Emailschild an den Giebel. Es glaenzt bis zur naechsten Generation.' },
        { k: 'iii-verliert', art: 'verlieren', gewicht: 7,
          text: 'Der Wirt zum {haus} loest sein Darlehen ab. Der Adler verliert die Adresse.' },
        { k: 'iii-kessel', art: 'unglueck', gewicht: 6,
          text: 'Kesselschaden beim Adler. Die Versicherung zahlt spaeter als der Kesselschmied rechnet.' }
      ]
    },

    /* ------------------------------------------------------------------
       IV — 1914 bis heute.  Gebunden wird durch Listung: das Regal
       gehoert dem Handel, und der Handel verkauft Meter.
       ------------------------------------------------------------------ */
    4: {
      waehrung: 'Die Listung — Gebuehr, Konditionen, Auslistung',
      mengenfaktor: 3,
      satz: 'Der Vertrag mit dem Wirt zaehlt noch, aber entschieden wird im Einkauf. Wer im Regal steht, '
          + 'ist gelistet: Listungsgebuehr, Rabattstaffel, Werbekostenzuschuss, Jahresvereinbarung. '
          + 'Und wer nicht zahlt, wird ausgelistet — ohne Prozess, ohne Rat, per Telefon.',
      abloesesatz: 'Eine Abloesung heisst hier: die Konditionen des anderen ueberbieten. Listungsgebuehr, '
          + 'ein Jahr Werbekostenzuschuss im Voraus, und der Einkauf verlangt beides vor der ersten Palette.',
      werbesatz: 'Er laedt den Einkaeufer zur Jahresgespraech-Reise und legt die Konditionen daneben.',
      wochenWerbung: [2, 5],
      abschlagAnteil: 0.30,
      ertragJeFass: 55,
      mittel: [
        { k: 'listung', name: 'Listung', kurz: 'LIS', womit: 'Listung', satz: 90, jahre: 3,
          bindet: 'Der Adler kauft sich beim {haus} ins Regal: Listungsgebuehr {geld}.',
          loest: 'Listungsgebuehr und ein Jahr Werbekostenzuschuss, im Voraus, an den Einkauf.' },
        { k: 'jahresvereinbarung', name: 'Jahresvereinbarung', kurz: 'JVB', womit: 'Jahresvereinbarung', satz: 150, jahre: 5,
          bindet: 'Der Adler unterschreibt beim {haus} die Jahresvereinbarung mit voller Rabattstaffel.',
          loest: 'Die Vereinbarung laeuft. Wer sie bricht, zahlt sie aus.' },
        { k: 'exklusiv', name: 'Exklusivvertrag', kurz: 'EXK', womit: 'Exklusivvertrag', satz: 260, jahre: 8,
          bindet: 'Der Adler bindet {haus} exklusiv — acht Jahre, kein fremdes Fass im Haus.',
          loest: 'Exklusiv heisst exklusiv. Ausloesen kann man das nur mit sehr viel Geld.' }
      ],
      gegenzug: {
        k: 'marke', name: 'Die Marke eintragen lassen',
        preis: 62000,
        sagt: 'Wort- und Bildmarke beim Patentamt, ein eigener Ausschank mit dem Namen am Haus, '
            + 'und ein Anwalt, der beides verteidigt.',
        folge: 'Von heute an kostet jede Listung nur noch zwei Drittel, und wer das Haus auslistet, '
             + 'muss es dem Verbraucher erklaeren. Eingetragen ist eingetragen.',
        chronik: '{name} laesst die Marke eintragen. Der Name gehoert dem Haus, nicht dem Regal.'
      },
      bauten: [
        { k: 'drucktanks', name: 'Drucktanks im Freien', preis: 320000, glyph: 'tank' },
        { k: 'dosenlinie', name: 'Dosenlinie', preis: 480000, glyph: 'halle' },
        { k: 'keg', name: 'KEG-Reinigung', preis: 210000, glyph: 'maschine' },
        { k: 'fuhrpark', name: 'Eigener Fuhrpark', preis: 260000, glyph: 'wagen' },
        { k: 'werbeabteilung', name: 'Werbeabteilung', preis: 140000, glyph: 'schild' },
        { k: 'labor', name: 'Labor und Qualitaetsstelle', preis: 175000, glyph: 'turm' }
      ],
      wagenbild: 'wagen4',
      hofbild: 'hof4',
      zuege: [
        { k: 'iv-werben', art: 'werben', gewicht: 22 },
        { k: 'iv-auslisten', art: 'entreissen', gewicht: 12, mittel: 'listung',
          text: 'Der Einkauf des {haus} listet das Haus aus und nimmt den Adler ins Regal.' },
        { k: 'iv-wkz', art: 'aufstocken', gewicht: 12,
          text: 'Der Adler erhoeht den Werbekostenzuschuss beim {haus} um {geld}.' },
        { k: 'iv-bau', art: 'bauen', gewicht: 14 },
        { k: 'iv-aktion', art: 'preis', gewicht: 12, schritt: 6,
          text: 'Aktionspreis beim Adler: der Kasten zu {geld} je Hektoliter, vier Wochen lang.' },
        { k: 'iv-lastzug', art: 'fuhre', gewicht: 13,
          text: 'Ein grauer Lastzug des Adlers faehrt zum {haus}.' },
        { k: 'iv-werbung', art: 'macht', gewicht: 9, marke: 'fernsehen', jahre: 6,
          text: 'Der Adler schaltet einen Werbespot im Abendprogramm. Man kennt den Namen jetzt auch dort, wo er nicht liefert.' },
        { k: 'iv-verliert', art: 'verlieren', gewicht: 6,
          text: 'Der Einkauf des {haus} wirft den Adler aus dem Regal. Zu viele Sorten, zu wenig Umschlag.' },
        { k: 'iv-rueckruf', art: 'unglueck', gewicht: 6,
          text: 'Rueckruf beim Adler: eine Charge Pilsner mit Trubstoff, zwei Tage in der Zeitung.' }
      ],
      /* Der Konzern hat eine eigene, kuerzere Liste. Er braut nicht. */
      konzernzuege: [
        { k: 'iv-k-listung', art: 'werben', gewicht: 20 },
        { k: 'iv-k-auslisten', art: 'entreissen', gewicht: 14, mittel: 'jahresvereinbarung',
          text: 'Die Nordstern-Gruppe kauft das Regal im {haus} im Ganzen. Das Haus fliegt raus.' },
        { k: 'iv-k-kondition', art: 'aufstocken', gewicht: 12,
          text: 'Die Gruppe legt beim {haus} {geld} auf die Jahreskonditionen.' },
        { k: 'iv-k-uebernahme', art: 'uebernahme', gewicht: 10,
          text: 'Die Nordstern-Gruppe uebernimmt eine kleine Brauerei im Nachbartal.' },
        { k: 'iv-k-verliert', art: 'verlieren', gewicht: 5,
          text: 'Das Kartellamt untersagt der Gruppe eine Bindung. {haus} wird frei.' },
        { k: 'iv-k-angebot', art: 'angebot', gewicht: 7,
          text: 'Die Nordstern-Gruppe laesst anfragen, ob das Haus verkaeuflich sei.' }
      ]
    }
  },

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
    { k: 'verpfaendet', name: 'verpfaendet', sagt: 'Er verpfaendet, was auf dem Hof steht.' },
    { k: 'amende', name: 'am Ende', sagt: 'Er kann nicht mehr. Jetzt entscheidet ein anderer.' }
  ]
};
