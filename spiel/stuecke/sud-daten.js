/* ===========================================================================
   stuecke/sud-daten.js — DER SUD, Zahlenwerk.
   Besitzstand DER SUD: stuecke/sud*.js · stil/sud*.css · bild/sud/** · ton/sud/**

   DIE FRAGE DIESES STUECKS: WORAUS BESTEHT DIE ENTSCHEIDUNG DES BRAUERS?

   Nicht aus Geschmack. Bier war bis ins 19. Jahrhundert vor allem ein
   HALTBARKEITSPROBLEM, und Haltbarkeit ist eine Handelsfrage: Wer sein Bier
   haltbar macht, darf es fortfahren; wer es nicht kann, verkauft in der
   eigenen Gasse. Deshalb ist die Verfahrensentscheidung in jeder Epoche eine
   andere — und deshalb liest sich diese Datei wie vier verschiedene Spiele.

     1350  GRUT ODER HOPFEN. Die Grut — Gagel, Porst, Schafgarbe — ist ein
           herrschaftliches Recht: der Grutherr verkauft sie, und nur er.
           Hopfen faellt nicht unter dieses Recht, haelt das Bier laenger und
           macht es reisefaehig (Hamburg fuehrt gehopftes Bier seit dem
           13. Jh. aus). Wer hopft, kann verkaufen, wo er nicht wohnt — und
           legt sich mit dem Grutrecht an. Hopfen waechst hier noch nicht;
           er kommt teuer von auswaerts (kein Hopfengarten vor 1600).
     1600  REIN ODER GESTRECKT, und obergaerig gegen die neue Kellergaerung.
           Das Gebot von 1516 ist Rohstoffpolitik: Weizen und Roggen gehoeren
           dem Baecker, Gerste dem Brauer. "Rein" ist eine Zuteilung, kein
           Guetesiegel. Die kalte Kellergaerung dauert Wochen statt Tagen und
           macht das Bier sommerfest — das ist der Grund fuer das
           Sommerbrauverbot von 1553 und fuer den Felsenkeller.
     1884  EIS ODER MASCHINE. Untergaeriges Lagerbier braucht Kaelte. Kaelte
           kam bis eben aus dem Fluss und dem Eiskeller; seit Linde (1873)
           kommt sie aus der Maschine. Wer die Maschine hat, gaert im Sommer.
           Dazu Hansens Reinzuchthefe (1883): der Sud wird berechenbar.
     1970  GLEICHMASS. Der Sud muss nicht mehr gut sein, er muss jedes Mal
           GLEICH sein. Das ist eine andere und teurere Aufgabe: Labor,
           Filter, Pasteur, Prozessrechner. Was hier gezaehlt wird, ist die
           Abweichung.

   WAS "hoechst" IST — DIE FOLGE, DIE MAN BEIM WIRT WIEDERSIEHT
   Runde 1 hat die Entscheidung gebaut, aber ihre Folge blieb im Keller:
   Haltbarkeit, Gaerwochen, Bottiche. Beim Wirt war nichts davon zu sehen.
   Deshalb traegt jede Option jetzt ein `hoechst` — die HOECHSTE STUFE, die
   dieses Verfahren ueberhaupt hergibt.

     Die FUHRE bestellt die Sorte (Duennbier · Grutbier · Starkbier), DER SUD
     sagt, was die Pfanne davon halten kann. Wer Starkbier ansetzt und mit
     Grut wuerzt, schlaegt Grutbier aus — drei Brautage fuer den Preis von
     zweien. Und die Klosterschenke, die nur Stufe 3 fuehrt, steht dann vor
     einem Fass, das sie nicht nimmt.

   Die Zahl geht NIE nach oben: das Verfahren hebt kein Bier, es DECKELT es.
   Der Vorgabestand jeder Epoche deckelt auf 2 — genau das Haus-Bier. Wer das
   Brett nie aufschlaegt, verliert dadurch nichts. Nach unten deckeln nur die
   billigen Abkuerzungen (Hafer 1600, ohne Kuehlung 1884); die oberste Stufe
   ist die Belohnung fuer die unwiderrufliche Festlegung.

   WAS DIESES STUECK NICHT TUT
   · Es nimmt kein neues Geld aus der Kasse (WELLE-2 §1, Abgabendeckel §4).
     Jede Strafe dieses Stuecks wird in ROHSTOFF, BOTTICH oder GUETE bezahlt,
     nie in Muenze. Geld kostet nur, was der Spieler ausdruecklich kauft.
   · Es schreibt keinen Preis je Fass (das ist DER PREIS) und keine
     Verbliste der Fuhre (das ist DIE FUHRE). Auch `hoechst` schreibt keinen
     Preis: es entscheidet, WELCHE Sorte im Fass liegt — den Preis dieser
     Sorte setzen wie bisher DIE FUHRE und DER PREIS.

   SPERRLISTE: Der Braukessel ist eine OFFENE PFANNE, keine Destillierblase —
   das Wort "Blase" kommt in diesem Stueck nicht vor. Emailschilder erst ab
   den 1890ern: der Kesselzettel ist 1350 Kreide auf Holz, 1600 Tafel,
   1884 Papier hinter Glas, 1970 Formica. Kein Hopfengarten vor 1600.
   =========================================================================== */

var SUD_DATEN = {

  /* Wie schnell die Guete faellt, wenn niemand die Hefe pflegt, und was ein
     Anstich einbringt. In allen vier Epochen dieselbe Kurve — nur ihr Name,
     ihr Verb und ihre Folgen wechseln. Das ist Absicht: die Zahl ist die
     Zahl, die EPOCHE ist der Unterschied. */
  guete: { start: 70, zerfall: 2, boden: 25, anstichJung: 14, anstichAlt: 6,
           fuehren: 8, hoechst: 100 },

  epochen: {

    /* ==================================================================
       1350 — GRUT ODER HOPFEN
       ================================================================== */
    1: {
      jahr: 1350,
      titel: 'Das Sudhaus',
      kessel: 'Die offene Pfanne über offenem Feuer',
      frage: 'Grut oder Hopfen?',
      historie: 'Die Grut gehört dem Grutherrn, nicht dem Brauer: ein Recht, kein Kraut. '
              + 'Hopfen fällt nicht darunter, hält das Bier doppelt so lang und macht es '
              + 'reisefähig — er wächst hier aber nicht und kommt teuer von auswärts.',
      gaerkeller: {
        name: 'Der Gärkeller', gefaess: 'Bottich', gefaesse: 'Bottiche',
        plaetze: 10,
        satz: 'Offene Bottiche im Erdkeller. Was hier steht, ist noch kein Bier und '
            + 'verdirbt auch noch nicht — die Haltbarkeit beginnt erst am Fass.',
        kauf: { text: 'Bottich beim Küfer bestellen', menge: 6, basis: 26, staffel: 1.25,
                titel: 'Sechs Fass mehr Gärraum. Was nicht in den Gärkeller passt, reift im '
                     + 'Lager mit und altert dabei.' }
      },
      guete: { name: 'Das Hefezeug', kurz: 'Zeug', invers: false,
               satz: 'Der Brauer hebt Hefe vom vorigen Sud auf. Wird sie nicht nachgeführt, '
                   + 'schlägt der Sud um.' },
      fuehren: { text: 'Hefezeug aus dem Bottich heben',
                 titel: 'Solange ein Bottich gärt, hebt der Brauer die Hefe von oben ab. '
                      + 'Das kostet kein Fass — es geht nur, solange etwas gärt.' },
      anstich: { text: 'Hefezeug vom Fass abnehmen', zug: 'sud:anstich',
                 titel: 'Ein Fass wird angebrochen und die Hefe abgeschöpft. Ein junges Fass '
                      + 'gibt kräftiges Zeug, ein altes müdes.',
                 satz: 'Der Brauer bricht ein Fass an und schöpft die Hefe ab.' },
      fehlsud: { name: 'Der Sud schlägt um', kurz: 'umgeschlagen',
                 satz: 'Ein Bottich sauer. Der Braumeister lässt ihn in den Hof laufen.' },
      wirte: { name: 'WAS BEIM WIRT ANKOMMT',
               satz: 'Der Rat schreibt vor, was ein Fass kosten darf; welches Haus es nimmt, '
                   + 'entscheidet die Pfanne. Ein Bier ohne Hopfen fährt nicht bis zum Kloster.' },
      achsen: [
        { schluessel: 'wuerze', name: 'DIE WÜRZE', frage: 'Womit wird gewürzt?',
          satz: 'Es ist keine Geschmacksfrage. Es ist die Frage, wie weit ein Fass fahren darf.',
          optionen: [
            { k: 'grut', name: 'Grut vom Grutamt', preis: 0, schild: 'wie immer', hoechst: 2,
              satz: 'Gagel, Porst, Schafgarbe — gekauft beim Grutherrn, der allein sie verkaufen '
                  + 'darf. Das Bier hält, was es hält: wenige Wochen. Ein Starkbier, das den '
                  + 'Sommer übersteht, ist mit Grut allein nicht zu brauen — es schlägt als '
                  + 'Bier des Hauses aus.',
              wirkung: { haltbar: 1.0, gaer: 0, roh: 0, mehr: 0, risiko: 0.02 } },
            { k: 'sack', name: 'Hopfen im Sack, heimlich', preis: 0, schild: 'ohne Ausgabe', hoechst: 3,
              satz: 'Hopfen vom Fernhändler, unter der Grut versteckt. Das Bier hält fast doppelt '
                  + 'so lang, muss dafür eine Woche länger im Bottich liegen — und es trägt '
                  + 'jetzt auch ein Starkbier, das bis zum Kloster fährt.',
              warnung: 'Der Grutknecht sieht in die Pfanne, wann er will.',
              wirkung: { haltbar: 1.7, gaer: 1, roh: 2, mehr: 0, risiko: 0.02, anzeige: 0.11 } },
            { k: 'brief', name: 'Offen gehopft, mit Hopfenbrief', preis: 78, fest: true, hoechst: 3,
              satz: 'Der Rat erlaubt dem Haus, gehopftes Bier zu brauen und auszuführen. '
                  + 'Der Grutherr klagt und verliert. Doppelte Haltbarkeit, eine Woche mehr '
                  + 'im Bottich, und kein Grutknecht mehr in der Pfanne. Unwiderruflich — der '
                  + 'Brief wird nie zurückgegeben, und das Grutgeld ist danach nicht mehr zu haben.',
              siegel: 'Ratsbrief, gesiegelt',
              wirkung: { haltbar: 2.0, gaer: 1, roh: 2, mehr: 0, risiko: 0.02 } }
          ] }
      ]
    },

    /* ==================================================================
       1600 — REIN ODER GESTRECKT · OBERGAERIG ODER KELLERGAERUNG
       ================================================================== */
    2: {
      jahr: 1600,
      titel: 'Das Sudhaus',
      kessel: 'Die offene Pfanne unter dem Kamin',
      frage: 'Rein oder gestreckt — und warm oder kalt?',
      historie: 'Das Gebot von 1516 nimmt dem Brauer den Weizen und gibt ihn dem Bäcker. '
              + 'Es ist Rohstoffpolitik, kein Gütesiegel. Und die kalte Kellergärung dauert '
              + 'Wochen statt Tage — dafür übersteht ihr Bier als einziges den Sommer.',
      gaerkeller: {
        name: 'Der Gärkeller', gefaess: 'Gärbottich', gefaesse: 'Gärbottiche',
        plaetze: 16,
        satz: 'Gärbottiche im Gewölbe, getrennt vom Lager. Was gärt, belegt keinen Fassplatz '
            + 'mehr — das ist der ganze Unterschied zum vorigen Jahrhundert.',
        kauf: { text: 'Gärbottich setzen lassen', menge: 10, basis: 78, staffel: 1.25,
                titel: 'Zehn Fass mehr Gärraum. Der Küfer setzt ihn im Gewölbe auf.' }
      },
      guete: { name: 'Die Stellhefe', kurz: 'Stellhefe', invers: false,
               satz: 'Die Zunft hält auf gute Stellhefe. Wer sie nicht schöpft, braut nach Glück.' },
      fuehren: { text: 'Stellhefe aus dem Gärbottich nehmen',
                 titel: 'Aus dem gärenden Bottich geschöpft, wie es die Ordnung vorsieht. '
                      + 'Kostet kein Fass — geht nur, solange ein Bottich steht.' },
      anstich: { text: 'Stellhefe vom Fass schöpfen', zug: 'sud:anstich',
                 titel: 'Ein Fass wird angebrochen und die Hefe geschöpft. Ein junges Fass '
                      + 'gibt kräftige Stellhefe, ein altes müde.',
                 satz: 'Der Braumeister bricht ein Fass an und schöpft die Stellhefe.' },
      fehlsud: { name: 'Der Sud ist verdorben', kurz: 'verdorben',
                 satz: 'Ein Bottich verdorben. Die Ordnung verlangt, ihn auszugießen.' },
      wirte: { name: 'WAS BEIM WIRT ANKOMMT',
               satz: 'Die Zunft schaut auf die Reihe, der Wirt auf das Fass. Gestrecktes Bier '
                   + 'führt kein Gasthof, und ein Märzen ist ohne kalten Keller nicht zu machen.' },
      achsen: [
        { schluessel: 'schuettung', name: 'DIE SCHÜTTUNG', frage: 'Was kommt in den Sud?',
          satz: 'Gerste ist teuer, Weizen ist verboten, Hafer ist billig und schlecht.',
          optionen: [
            { k: 'rein', name: 'Rein nach dem Gebot', preis: 0, schild: 'wie immer', hoechst: 3,
              satz: 'Gerste, Hopfen, Wasser. Die Zunft sieht nichts, der Bäcker schweigt.',
              wirkung: { haltbar: 1.0, gaer: 0, roh: 0, mehr: 0, risiko: 0.02 } },
            { k: 'weizen', name: 'Mit Weizen gestreckt', preis: 0, schild: 'ohne Ausgabe', hoechst: 3,
              satz: 'Weizen gibt mehr Fass aus derselben Pfanne und ein Bier, das länger hält. '
                  + 'Er gehört dem Bäcker — das Gebot von 1516 sagt es ausdrücklich.',
              warnung: 'Die Bäckerzunft zeigt an, wenn Brotkorn im Kessel steht.',
              wirkung: { haltbar: 1.15, gaer: 0, roh: -2, mehr: 1, risiko: 0.03, anzeige: 0.10 } },
            { k: 'hafer', name: 'Mit Hafer und Wicke gestreckt', preis: 0, schild: 'ohne Ausgabe', hoechst: 1,
              satz: 'Zwei Fass mehr aus jedem Sud, und ein Bier, das in Wochen kippt. Was so '
                  + 'gebraut wird, ist Gesindebier — es schlägt als dünnste Sorte aus, und der '
                  + 'Gasthof führt es nicht. In einem schlechten Jahr hat das jedes Haus getan.',
              warnung: 'Die Bierschau kostet das Haus mehr als den Hafer.',
              wirkung: { haltbar: 0.75, gaer: 0, roh: -4, mehr: 2, risiko: 0.05, anzeige: 0.13 } }
          ] },
        { schluessel: 'gaerung', name: 'DIE GÄRUNG', frage: 'Warm oder kalt?',
          satz: 'Warm ist schnell und braucht keinen Bau. Kalt braucht Wochen, Fels und Eis — '
              + 'und übersteht als einziges den Sommer.',
          optionen: [
            { k: 'ober', name: 'Obergärig, warm geführt', preis: 0, schild: 'wie immer', hoechst: 2,
              satz: 'Vier Tage im Bottich, dann aufs Fass. Das Bier der Stadt seit je — und ein '
                  + 'Märzenbier, das den Sommer übersteht, wird daraus nicht.',
              wirkung: { haltbar: 1.0, gaer: 0, roh: 0, mehr: 0, risiko: 0 } },
            { k: 'keller', name: 'Kellergärung im Felsenkeller', preis: 260, fest: true, hoechst: 3,
              satz: 'Ein Keller in den Fels gebrochen, mit Eis beschickt. Die kalte Gärung '
                  + 'dauert zwei Wochen länger, macht das Bier sommerfest — und erst sie trägt '
                  + 'das Märzenbier, das der Gasthof und die Klosterschenke zahlen. '
                  + 'Unwiderruflich — ein Felsenkeller wird nicht zurückgebaut.',
              siegel: 'Bauabnahme der Zunft',
              wirkung: { haltbar: 1.6, gaer: 2, roh: 0, mehr: 0, risiko: 0 } }
          ] }
      ]
    },

    /* ==================================================================
       1884 — EIS ODER MASCHINE · BETRIEBSHEFE ODER REINZUCHT
       ================================================================== */
    3: {
      jahr: 1884,
      titel: 'Das Sudwerk',
      kessel: 'Die Sudpfanne unter dem Kupferhelm',
      frage: 'Eis oder Maschine?',
      historie: 'Untergäriges Lagerbier braucht Kälte, und Kälte kam bis eben aus dem Fluss. '
              + 'Seit Linde 1873 kommt sie aus der Maschine — wer sie hat, gärt auch im '
              + 'Sommer. Und seit Hansen 1883 ist Hefe kein Glücksfall mehr.',
      gaerkeller: {
        name: 'Der Gärkeller', gefaess: 'Gärbottich', gefaesse: 'Gärbottiche',
        /* 48 und nicht 80: gemessen hob ein Gaerkeller von 80 Fass den Ausstoss
           von 1884 in 58 Wochen von 288 auf 560 Fass — fast das Doppelte, ohne
           dass jemand etwas dafuer getan haette. Der Gaerraum soll eine
           KAUFENTSCHEIDUNG sein und kein Geschenk an eine fremde Bilanz. */
        plaetze: 48,
        satz: 'Der Gärkeller liegt unter dem Sudwerk und ist nicht der Lagerkeller. '
            + 'Erst diese Trennung erlaubt Lagerzeiten in Monaten statt in Wochen.',
        kauf: { text: 'Gärbottich aufstellen', menge: 40, basis: 1900, staffel: 1.3,
                titel: 'Vierzig Fass mehr Gärraum, ausgeschlagenes Holz auf Eisengestell.' }
      },
      guete: { name: 'Die Hefeführung', kurz: 'Führung', invers: false,
               satz: 'Die Hefe wird geerntet und wieder angestellt. Jede Ernte trägt mit, '
                   + 'was im Bottich sonst noch lebte.' },
      fuehren: { text: 'Hefe im Gärbottich abernten',
                 titel: 'Erntehefe von der Decke des Gärbottichs, wie in jedem Betrieb dieser '
                      + 'Zeit. Kostet kein Fass — geht nur, solange ein Bottich gärt.' },
      anstich: { text: 'Hefe aus dem Fass abernten', zug: 'sud:anstich',
                 titel: 'Ein Fass wird angestochen und die Hefe geerntet. Junges Fass, '
                      + 'kräftige Hefe.',
                 satz: 'Der Braumeister sticht ein Fass an und erntet die Hefe.' },
      fehlsud: { name: 'Die Hefe ist infiziert', kurz: 'infiziert',
                 satz: 'Ein Bottich mit Fremdhefe. Er geht in den Ausguss.' },
      wirte: { name: 'WAS BEIM WIRT ANKOMMT',
               satz: 'Der Bahnhofswirt und der Landgasthof führen Lagerbier und Export. '
                   + 'Wer ohne Kälte braut, hat nur noch Schankbier anzubieten.' },
      achsen: [
        { schluessel: 'kaelte', name: 'DIE KÄLTE', frage: 'Woher kommt die Kälte?',
          satz: 'Das Natureis kommt aus dem Winter und ist im September alle. '
              + 'Die Maschine kommt aus der Kasse und läuft im Juli.',
          optionen: [
            { k: 'natureis', name: 'Natureis aus dem Fluss', preis: 0, schild: 'wie immer', hoechst: 3,
              satz: 'Im Winter geschnitten, im Keller gestapelt. Wer so lagert, lagert '
                  + 'richtig: zwei Wochen länger im Bottich, ein Drittel mehr Haltbarkeit. '
                  + 'In den warmen Wochen trägt der Gärkeller nur die Hälfte.',
              wirkung: { haltbar: 1.35, gaer: 2, roh: 0, mehr: 0, risiko: 0.02, warmDrossel: 0.5 } },
            { k: 'warm', name: 'Ohne Kühlung durchgären lassen', preis: 0, schild: 'ohne Ausgabe', hoechst: 1,
              satz: 'Der Bottich läuft warm durch. Eine Woche schneller fertig, das Bier hält '
                  + 'kaum mehr als ein Drittel — und ohne Kälte gibt es kein Lagerbier: was '
                  + 'herauskommt, ist Schankbier, und der Gasthof nimmt es nicht. In einem '
                  + 'Betrieb ohne Eis und ohne Geld ist das der Weg, auf dem trotzdem gebraut wird.',
              warnung: 'Warm geführt kippt etwa jeder fünfzehnte Bottich in der Woche — und die '
                     + 'Untersuchungsanstalt zieht Proben.',
              wirkung: { haltbar: 0.6, gaer: 0, roh: 0, mehr: 0, risiko: 0.07, anzeige: 0.08 } },
            { k: 'maschine', name: 'Lindesche Kältemaschine', preis: 9800, fest: true, hoechst: 3,
              satz: 'Ammoniak-Kompression, Antrieb von der Dampfmaschine. Der Gärkeller hält '
                  + 'das ganze Jahr dieselbe Temperatur, die Gärung wird eine Woche kürzer '
                  + 'als mit Eis, und das Bier hält länger. '
                  + 'Unwiderruflich — der Eiskeller wird zum Maschinenhaus umgebaut.',
              siegel: 'Aufstellung abgenommen',
              sperrt: ['natureis'],
              wirkung: { haltbar: 1.6, gaer: 1, roh: 0, mehr: 0, risiko: 0.01 } }
          ] },
        { schluessel: 'hefe', name: 'DIE HEFE', frage: 'Woher kommt die Hefe?',
          satz: 'Aus dem eigenen Bottich ist sie umsonst und bringt mit, was sonst noch drin war.',
          optionen: [
            { k: 'betrieb', name: 'Betriebshefe aus dem Bottich', preis: 0, schild: 'wie immer', hoechst: 2,
              satz: 'Geerntet und wieder angestellt, Sud um Sud. Kostet nichts, wird jedes Mal '
                  + 'etwas unsauberer — und ein Exportbier, das wochenlang fährt, ist damit '
                  + 'nicht zu verbürgen: es schlägt als Lagerbier aus.',
              wirkung: { haltbar: 1.0, gaer: 0, roh: 0, mehr: 0, risiko: 0.05, guetefall: 2 } },
            { k: 'reinzucht', name: 'Reinzuchthefe nach Hansen', preis: 3400, fest: true, hoechst: 3,
              satz: 'Ein einziger Hefestamm, im Laboratorium vermehrt, jedes Jahr neu bezogen. '
                  + 'Der Sud wird berechenbar, und erst damit steht ein Exportbier im Fass. '
                  + 'Unwiderruflich — die alte Betriebshefe wird verworfen und ist nicht '
                  + 'wiederzubeschaffen.',
              siegel: 'Reinzucht angestellt',
              wirkung: { haltbar: 1.1, gaer: 0, roh: 0, mehr: 0, risiko: 0.01, guetepin: 94 } }
          ] }
      ]
    },

    /* ==================================================================
       1970 — GLEICHMASS
       ================================================================== */
    4: {
      jahr: 1970,
      titel: 'Das Sudhaus',
      kessel: 'Das Sudwerk im Schaltraum',
      frage: 'Wie gleich ist gleich genug?',
      historie: 'Der Sud muss nicht mehr gut sein, er muss jedes Mal gleich sein. '
              + 'Das ist eine andere Aufgabe: Stammwürze messen, filtrieren, pasteurisieren, '
              + 'rechnen. Was hier zählt, ist nicht der beste Sud, sondern der schlechteste.',
      gaerkeller: {
        name: 'Der Gärkeller', gefaess: 'Gärtank', gefaesse: 'Gärtanks',
        plaetze: 200,
        satz: 'Gärtanks im Freien, isoliert. Getrennt vom Lagerkeller — die Reifung läuft '
            + 'im Tank, nicht im verkaufsfertigen Bestand.',
        kauf: { text: 'Gärtank stellen', menge: 180, basis: 24000, staffel: 1.3,
                titel: 'Hundertachtzig Fass mehr Gärraum. Ein Tank, ein Kran, ein Tag.' }
      },
      guete: { name: 'Die Streuung', kurz: 'Streuung', invers: true,
               satz: 'Wie weit eine Charge von der vorigen abweicht. Der Handel misst nach, '
                   + 'und er misst genauer als der Gast.' },
      fuehren: { text: 'Hefe aus dem Gärtank ziehen',
                 titel: 'Erntehefe aus dem Konus, gekühlt gelagert, neu angestellt. '
                      + 'Kostet kein Fass — geht nur, solange ein Tank gärt.' },
      anstich: { text: 'Hefe aus dem Tank zusetzen', zug: 'sud:anstich',
                 titel: 'Hefe wird aus einem Tank gezogen und neu angestellt.',
                 satz: 'Der Braumeister zieht Hefe und stellt neu an.' },
      fehlsud: { name: 'Der Tank ist umgeschlagen', kurz: 'umgeschlagen',
                 satz: 'Ein Gärtank mit Fremdkeimen. Er wird abgelassen und gereinigt.' },
      wirte: { name: 'WAS BEIM WIRT ANKOMMT',
               satz: 'Die Gaststätte führt alles, der Markt nur das Hellste, der Landgasthof '
                   + 'kein Schankbier. Was im Kasten steht, entscheidet das Sudhaus.' },
      charge: {
        name: 'GESPERRTE CHARGEN',
        satz: 'Eine Charge außerhalb der Grenzwerte geht nicht ins Regal, ehe jemand '
            + 'unterschreibt. Beides ist eine Entscheidung, und beide kosten.',
        frei: { text: 'Charge freigeben', titel: 'Sie geht so hinaus. Wenn der Handel nachmisst, '
                     + 'kommt sie zurück — und die nächsten Chargen stehen unter Beobachtung.' },
        schnitt: { text: 'Charge verschneiden', titel: 'Mit einer sauberen Charge verschnitten. '
                       + 'Ein Drittel der Menge geht dabei verloren, die Abweichung ist weg.' },
        frist: 4,
        fristSatz: 'Der Braumeister gibt von sich aus frei, was vier Wochen steht.',
        /* Der Rueckstand einer freigegebenen Charge. Ohne ihn ist "freigeben"
           streng besser als "verschneiden" — eine Wahl mit nur einer richtigen
           Antwort ist keine. Der Handel misst spaeter nach, und er misst ohne
           den Spieler; bezahlt wird in BIER, nicht in Geld. */
        rueck: {
          name: 'DRAUSSEN, NOCH NICHT NACHGEMESSEN',
          satz: 'Freigegebene Chargen stehen beim Handel im Regal. Der Einkauf misst nach, '
              + 'wann er will — und schickt zurück, was ihm nicht passt.',
          frist: [2, 5],
          wer: 'Der Einkauf der Handelskette',
          zurueck: 'Der Einkauf hat Charge {nr} nachgemessen: ±{ab} % und damit außerhalb der '
                 + 'Vereinbarung. {menge} kommen zurück ins Haus und aus dem Regal.',
          durch: 'Charge {nr} ist durchgegangen — nachgemessen hat niemand.'
        }
      },
      achsen: [
        { schluessel: 'fuehrung', name: 'DIE FÜHRUNG', frage: 'Wonach wird gefahren?',
          satz: 'Erfahrung ist umsonst und schwankt. Messen kostet und schwankt weniger.',
          optionen: [
            { k: 'erfahrung', name: 'Nach Erfahrung des Braumeisters', preis: 0, schild: 'wie immer', hoechst: 2,
              satz: 'Er riecht, er schmeckt, er trifft es meistens. Meistens reicht dem Handel '
                  + 'nicht — ein Exportbier will eine Zahl auf dem Protokoll, kein Urteil.',
              wirkung: { haltbar: 1.0, gaer: 0, roh: 0, mehr: 0, risiko: 0.02, streuung: 6 } },
            { k: 'labor', name: 'Betriebslabor, Stammwürze und Bittereinheiten', preis: 42000, fest: true, hoechst: 3,
              satz: 'Zwei Chemikerinnen, ein Saccharometer, ein Protokoll je Sud. '
                  + 'Unwiderruflich — ein Labor wird eingerichtet, nicht gemietet.',
              siegel: 'Labor eingerichtet',
              wirkung: { haltbar: 1.0, gaer: 0, roh: 0, mehr: 0, risiko: 0.01, streuung: 2, guetepin: 84 } },
            { k: 'rechner', name: 'Prozessrechner am Sudwerk', preis: 118000, fest: true, hoechst: 3,
              satz: 'Ein Rechner fährt das Maischprogramm und schreibt jede Rast mit. '
                  + '1970 ist das neu, und es kostet, was ein Sudhaus kostet. Unwiderruflich.',
              siegel: 'Anlage abgenommen',
              wirkung: { haltbar: 1.05, gaer: -1, roh: 0, mehr: 0, risiko: 0.005, streuung: 0, guetepin: 96 } }
          ] },
        { schluessel: 'behandlung', name: 'DIE BEHANDLUNG', frage: 'Was geschieht vor der Abfüllung?',
          satz: 'Jede Stufe kauft Haltbarkeit — und keine ist umsonst.',
          optionen: [
            { k: 'natur', name: 'Naturtrüb, unfiltriert', preis: 0, schild: 'wie immer', hoechst: 2,
              satz: 'Wie im Keller, so ins Fass. Hält, was es hält, und geht nicht als Export '
                  + 'auf die Reise.',
              wirkung: { haltbar: 1.0, gaer: 0, roh: 0, mehr: 0, risiko: 0 } },
            { k: 'schoenen', name: 'Schönen mit Kieselsol', preis: 0, schild: 'ohne Ausgabe', hoechst: 2,
              satz: 'Ein Klärmittel in den Lagertank, absetzen lassen, abziehen. '
                  + 'Kostet nichts als ein Fass Verlust je Sud und bringt fünfzehn Prozent '
                  + 'Haltbarkeit. Der billigste Griff, den dieses Jahrzehnt kennt.',
              wirkung: { haltbar: 1.15, gaer: 0, roh: 0, mehr: -1, risiko: 0 } },
            { k: 'filter', name: 'Kieselgurfilter', preis: 26000, einmal: true, hoechst: 3,
              satz: 'Blank filtriert. Vierzig Prozent mehr Haltbarkeit, und im Regal sieht man es. '
                  + 'Erst blank filtriertes Bier geht als Export hinaus. '
                  + 'Einmal bezahlt, danach jederzeit abzustellen.',
              wirkung: { haltbar: 1.4, gaer: 0, roh: 0, mehr: 0, risiko: 0 } },
            { k: 'pasteur', name: 'Tunnelpasteur', preis: 74000, fest: true, hoechst: 3,
              satz: 'Die Flasche läuft durch heißes Wasser. Das Bier hält doppelt so lang, und '
                  + 'zwei Fass je Sud gehen dabei verloren. Unwiderruflich — der Tunnel steht, '
                  + 'wo vorher die Abfüllung stand.',
              siegel: 'Anlage abgenommen',
              wirkung: { haltbar: 2.0, gaer: 0, roh: 0, mehr: -2, risiko: 0 } }
          ] }
      ]
    }
  },

  /* Was die Anzeige-Instanz je Epoche tut, wenn sie das Haus erwischt.
     KEINE dieser Strafen ist Geld — der Abgabendeckel aus ZUSTAENDIGKEIT §4
     bleibt unberuehrt, und ein Haus ohne Kasse bleibt handlungsfaehig. */
  anzeige: {
    1: { wer: 'Der Grutherr',
         satz: 'Der Grutknecht hat den Hopfen unter der Grut gefunden. Der Grutherr lässt '
             + 'die Kammer räumen und einen Bottich ausgießen.',
         nimmtRohstoff: 0.30, nimmtBottiche: 1, gueteAb: 6 },
    2: { wer: 'Die Bierschau',
         satz: 'Die Schau war im Sudhaus. Brotkorn im Kessel — sie lässt den Bottich in den '
             + 'Bach laufen und schreibt es der Zunft.',
         nimmtRohstoff: 0.20, nimmtBottiche: 1, gueteAb: 10 }
  }
};
