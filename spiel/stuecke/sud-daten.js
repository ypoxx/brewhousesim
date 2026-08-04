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
        satz: 'Offene Bottiche im Erdkeller. Die Haltbarkeit beginnt erst am Fass.',
        kauf: { text: 'Bottich beim Küfer bestellen', menge: 6, basis: 26, staffel: 1.25,
                titel: '{menge} mehr Gärraum. Was nicht in den Gärkeller passt, reift im '
                     + 'Lager mit und altert dabei.',
                /* Die Nebenbedingung der Epoche — eine GRENZE. Wo reihum
                   gebraut wird, ist Gaerraum kein Handel, sondern Zuteilung:
                   der Kuefer der Stadt arbeitet fuer alle Haeuser der Reihe. */
                bedingung: { art: 'grenze', wert: 2,
                             satz: 'Die Reihe duldet keinen, der doppelt so viel ansetzt wie '
                                 + 'die anderen: der Küfer der Stadt setzt keinem Haus mehr '
                                 + 'als zwei neue Bottiche.',
                             zu: 'Der Küfer hat für dieses Haus zwei Bottiche gesetzt. Mehr '
                               + 'gibt die Reihe nicht her.' } }
      },
      guete: { name: 'Das Hefezeug', kurz: 'Zeug', invers: false,
               satz: 'Hefe vom vorigen Sud. Ohne Pflege schlägt der Sud um.' },
      fuehren: { text: 'Hefezeug aus dem Bottich heben',
                 titel: 'Solange ein Bottich gärt, hebt der Brauer die Hefe von oben ab. '
                      + 'Das kostet kein Fass — es geht nur, solange etwas gärt.' },
      anstich: { text: 'Hefezeug vom Fass abnehmen', zug: 'sud:anstich',
                 jung: 'Junges Fass anbrechen', alt: 'Altes Fass anbrechen',
                 titel: 'Ein Fass wird angebrochen und die Hefe abgeschöpft. Ein junges Fass '
                      + 'gibt kräftiges Zeug, ein altes müdes.',
                 satz: 'Der Brauer bricht ein Fass an und schöpft die Hefe ab.' },
      fehlsud: { name: 'Der Sud schlägt um', kurz: 'umgeschlagen',
                 satz: 'Ein Bottich sauer. Der Braumeister lässt ihn in den Hof laufen.' },
      wirte: { name: 'WAS BEIM WIRT ANKOMMT',
               satz: 'Welches Haus ein Fass nimmt, entscheidet die Pfanne.' },
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
          ] },

        /* ==============================================================
           DIE ZWEITE FRAGE VON 1350 — Auflage 2 des blinden Kritikers.

           Gemessen (`werkbank/schuss/sud-w4b/vorher-e1.txt`, 301 Wochen,
           sorgfaeltig gespielt, beide Wege zusammen): eine Bierentscheidung
           mit mehr als einem Knopf stand in 8 von 301 Wochen = 2,7 %. In
           1600 stand sie in 99,7 %.

           Der Unterschied ist NICHT der Preis, sondern die Bauart. 1350 hatte
           EINE Frage mit drei Antworten: die laufende (gesperrt, richtig so),
           eine kostenlose und eine fuer 78 Pf bei einer Kasse mit Median
           14 Pf. Damit hatte der Spieler an der Bierfrage in 292 von 295
           gepruefen Wochen genau EINEN druckbaren Knopf. 1600 hat ZWEI
           Fragen, und beide haben eine Antwort, die nichts kostet.

           Also bekommt 1350 seine zweite Frage. Sie kostet in ihrer
           kostenlosen Antwort keinen Pfennig — sie kostet AUSBEUTE, und das
           ist der Preis, den dieses Stueck nehmen darf (WELLE-2 §1: Welle 2
           nimmt kein neues Geld aus der Kasse).

           WARUM DAS WASSER. Es ist die Frage, die im 14. Jahrhundert wirklich
           entschieden wurde, und sie ist in keiner anderen Epoche dieses
           Spiels gestellt: Brauwasser aus dem Stadtbach ist gratis und laeuft
           unterhalb der Lohgerber; der Ziehbrunnen im Hof gibt besseres und
           kostet den halben Sudtag am Seil; das Roehrenrecht an der Quelle
           vor dem Tor ist ein verbrieftes Recht des Rats, so wie der
           Hopfenbrief eines ist — und wird so wenig zurueckgegeben wie er.
           Der Ort steht schon im Verzeichnis (`kern/orte.js`: 'brunnen',
           1350 bis 1884), das Stueck erfindet ihn nicht.

           DER DECKEL BLEIBT, WO ER WAR. Alle drei Antworten tragen
           `hoechst: 3`, decken also NICHTS. Sonst haette diese Achse dem
           `sack` und dem `brief` ihre Wirkung genommen — `hoechsteStufe()`
           nimmt das Minimum ueber alle Achsen, und eine neue Achse mit
           `hoechst: 2` haette 1350 auf Grutbier festgenagelt, auch mit
           Hopfenbrief. Der Vorgabestand deckelt weiter auf Stufe 2, und zwar
           genau dort, wo er es vorher tat: an der Grut.

           UND DIE VORGABE IST NEUTRAL. `bach` hat haltbar 1,0, gaer 0, roh 0,
           risiko 0 — die gemessene Vorgabepartie von 1350 bleibt Zahl fuer
           Zahl dieselbe, einschliesslich der null Sude durch den Gaerkeller,
           die der Kritiker als schaerfsten Beleg dafuer zitiert, dass hier
           ueberhaupt etwas entschieden wird.
           ============================================================== */
        { schluessel: 'wasser', name: 'DAS BRAUWASSER', frage: 'Woher kommt das Wasser?',
          satz: 'Vier Fuenftel des Fasses sind Wasser. Wo es geschöpft wird, ist keine '
              + 'Kleinigkeit — es ist die zweite Frage, die dieses Haus zu beantworten hat, '
              + 'und sie kostet keinen Pfennig.',
          optionen: [
            /* Die Namen tragen eigene Verben — „schöpfen" gehört in 1600 zur
               Stellhefe und kommt hier deshalb nicht auf einen Knopf. */
            { k: 'bach', name: 'Wasser aus dem Stadtbach', preis: 0, schild: 'wie immer',
              hoechst: 3,
              satz: 'Geschöpft, wo der Bach durch die Gasse läuft. Es kostet nichts, es fragt '
                  + 'niemand, und die Lohgerber sitzen weiter oben am selben Wasser. So braut '
                  + 'die ganze Reihe, und so hält das Bier, was es hält.',
              wirkung: { haltbar: 1.0, gaer: 0, roh: 0, mehr: 0, risiko: 0 } },
            { k: 'brunnen', name: 'Wasser aus dem Ziehbrunnen', preis: 0, schild: 'ohne Ausgabe',
              hoechst: 3,
              satz: 'Eimer für Eimer aus dem eigenen Brunnen, den halben Sudtag lang. Das '
                  + 'bessere Wasser hält das Bier ein Stück länger — und der halbe Sudtag '
                  + 'fehlt hinten: ein Fass weniger geht aus jeder Pfanne in den Gärkeller.',
              warnung: 'Der Brunnen im Hof gibt nicht jede Woche her, was die Pfanne braucht.',
              wirkung: { haltbar: 1.15, gaer: 0, roh: 0, mehr: -1, risiko: 0 } },
            { k: 'roehre', name: 'Röhrenrecht an der Quelle', preis: 30, fest: true, hoechst: 3,
              satz: 'Der Rat verbrieft dem Haus eine Deichel von der Quelle vor dem Tor bis in '
                  + 'den Hof: gebohrte Erlenstämme unter der Gasse durch. Das Wasser steht dann '
                  + 'jeden Tag im Hof, ohne einen Gang und ohne den Bach. Unwiderruflich — die '
                  + 'Röhre liegt unter der Stadtmauer, und was einmal gegraben ist, gräbt '
                  + 'niemand zurück.',
              siegel: 'Röhrenrecht, verbrieft',
              wirkung: { haltbar: 1.35, gaer: 0, roh: 0, mehr: 0, risiko: 0, guetepin: 78 } }
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
        satz: 'Gärbottiche im Gewölbe: was gärt, belegt keinen Fassplatz mehr.',
        kauf: { text: 'Gärbottich setzen lassen', menge: 10, basis: 78, staffel: 1.25,
                titel: '{menge} mehr Gärraum. Der Küfer setzt ihn im Gewölbe auf.',
                /* Die Nebenbedingung der Epoche — eine KOPPLUNG an die eigene
                   Achse. Die Bauabnahme liegt bei derselben Lade, die auch
                   die Schuettung beschaut; wer streckt, bekommt sie nicht. */
                bedingung: { art: 'kopplung', achse: 'schuettung',
                             /* Zwei Antworten genuegen der Lade, nicht eine: sie
                                sieht in den Kessel und nimmt Anstoss am HEIMLICH
                                Gestreckten. Was im Kornbuch steht, hat sie selbst
                                mitgesiegelt — dagegen kann sie schlecht sein.
                                (Auflage 2, Welle 6: ohne diese zweite Antwort
                                haette der Weizenbrief dem Haus den Gaerbottich
                                fuer immer genommen, und eine Karte, die eine
                                andere Kaufentscheidung stilllegt, ist keine
                                Wahl, sondern eine Falle.) */
                             option: ['rein', 'weizenbrief'],
                             satz: 'Die Bauabnahme liegt bei der Zunftlade — derselben, die '
                                 + 'auch in den Kessel sieht.',
                             zu: 'Die Zunftlade nimmt keinen Bau ab, solange in diesem Haus '
                               + 'heimlich gestreckt gebraut wird. Erst rein nach dem Gebot '
                               + 'oder mit dem Brief, dann der Gärbottich.' } }
      },
      guete: { name: 'Die Stellhefe', kurz: 'Stellhefe', invers: false,
               satz: 'Wer die Stellhefe nicht schöpft, braut nach Glück.' },
      fuehren: { text: 'Stellhefe aus dem Gärbottich nehmen',
                 titel: 'Aus dem gärenden Bottich geschöpft, wie es die Ordnung vorsieht. '
                      + 'Kostet kein Fass — geht nur, solange ein Bottich steht.' },
      anstich: { text: 'Stellhefe vom Fass schöpfen', zug: 'sud:anstich',
                 jung: 'Junges Fass anstechen', alt: 'Altes Fass anstechen',
                 titel: 'Ein Fass wird angebrochen und die Hefe geschöpft. Ein junges Fass '
                      + 'gibt kräftige Stellhefe, ein altes müde.',
                 satz: 'Der Braumeister bricht ein Fass an und schöpft die Stellhefe.' },
      fehlsud: { name: 'Der Sud ist verdorben', kurz: 'verdorben',
                 satz: 'Ein Bottich verdorben. Die Ordnung verlangt, ihn auszugießen.' },
      wirte: { name: 'WAS BEIM WIRT ANKOMMT',
               satz: 'Gestrecktes Bier führt kein Gasthof, und er merkt es.' },
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
        satz: 'Erst der eigene Gärkeller erlaubt Lagerzeiten in Monaten.',
        kauf: { text: 'Gärbottich aufstellen', menge: 40, basis: 1900, staffel: 1.3,
                titel: '{menge} mehr Gärraum, ausgeschlagenes Holz auf Eisengestell.',
                /* Die Nebenbedingung der Epoche — eine BEDINGTE WIRKSAMKEIT.
                   Der Bottich steht sofort; ob er traegt, entscheidet die
                   Kaelte. Natureis ist im September alle, und was dann in
                   den neuen Bottichen liegt, gaert warm. */
                bedingung: { art: 'kalt', achse: 'kaelte', option: 'maschine',
                             satz: 'Gekaufter Gärraum trägt nur, solange es kalt ist.',
                             zu: 'Solange die Kälte aus dem Fluss kommt, steht der zugekaufte '
                               + 'Gärraum in den warmen Wochen leer — das Natureis reicht für '
                               + 'den alten Keller und nicht für den neuen Bottich.' } }
      },
      guete: { name: 'Die Hefeführung', kurz: 'Führung', invers: false,
               satz: 'Jede Ernte trägt mit, was im Bottich sonst noch lebte.' },
      fuehren: { text: 'Hefe im Gärbottich abernten',
                 titel: 'Erntehefe von der Decke des Gärbottichs, wie in jedem Betrieb dieser '
                      + 'Zeit. Kostet kein Bier — geht nur, solange ein Bottich gärt.' },
      anstich: { text: 'Hefe aus dem Fass abernten', zug: 'sud:anstich',
                 jung: 'Junges Lagerfass anstechen', alt: 'Altes Lagerfass anstechen',
                 titel: 'Ein Fass wird angestochen und die Hefe geerntet. Junges Fass, '
                      + 'kräftige Hefe.',
                 satz: 'Der Braumeister sticht ein Fass an und erntet die Hefe.' },
      fehlsud: { name: 'Die Hefe ist infiziert', kurz: 'infiziert',
                 satz: 'Ein Bottich mit Fremdhefe. Er geht in den Ausguss.' },
      wirte: { name: 'WAS BEIM WIRT ANKOMMT',
               satz: 'Ohne Kälte bleibt Schankbier — kein Gasthof nimmt es.' },
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
        satz: 'Gärtanks im Freien: die Reifung läuft im Tank, nicht im Lager.',
        kauf: { text: 'Gärtank bestellen', menge: 180, basis: 24000, staffel: 1.3,
                titel: '{menge} mehr Gärraum. Bestellt, geschweißt, gefahren, gestellt.',
                /* Die Nebenbedingung der Epoche — eine LIEFERZEIT. Ein Tank
                   von 1970 wird nicht gekauft, er wird bestellt: der
                   Kesselbauer schweisst ihn, der Tieflader bringt ihn, der
                   Kran setzt ihn. Bezahlt wird bei Bestellung. */
                bedingung: { art: 'lieferzeit', wochen: 3,
                             satz: 'Bezahlt wird bei Bestellung, gestellt wird nach drei Wochen.',
                             zu: 'Der Tank ist bestellt und bezahlt. Der Kesselbauer schweißt, '
                               + 'der Tieflader fährt — vorher trägt er nichts.' } }
      },
      guete: { name: 'Die Streuung', kurz: 'Streuung', invers: true,
               satz: 'Wie weit eine Charge von der vorigen abweicht. Der Handel misst nach.' },
      fuehren: { text: 'Hefe aus dem Gärtank ziehen',
                 titel: 'Erntehefe aus dem Konus, gekühlt gelagert, neu angestellt. '
                      + 'Kostet kein Bier — geht nur, solange ein Tank gärt.' },
      anstich: { text: 'Hefe aus dem Tank zusetzen', zug: 'sud:anstich',
                 jung: 'Frisches Fass anzapfen', alt: 'Ältestes Fass anzapfen',
                 titel: 'Hefe wird aus einem Tank gezogen und neu angestellt.',
                 satz: 'Der Braumeister zieht Hefe und stellt neu an.' },
      fehlsud: { name: 'Der Tank ist umgeschlagen', kurz: 'umgeschlagen',
                 satz: 'Ein Gärtank mit Fremdkeimen. Er wird abgelassen und gereinigt.' },
      wirte: { name: 'WAS BEIM WIRT ANKOMMT',
               satz: 'Was im Kasten steht, entscheidet das Sudhaus.' },
      charge: {
        name: 'GESPERRTE CHARGEN',
        satz: 'Nichts geht ins Regal, ehe jemand unterschreibt. Beides kostet.',
        frei: { text: 'Freigeben', titel: 'Sie geht so hinaus. Wenn der Einkauf der Handelskette '
                     + 'nachmisst, kommt sie zurück und der Ersatz geht aus dem Lager.' },
        schnitt: { text: 'Verschneiden', titel: 'Mit einer sauberen Charge verschnitten. '
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
                 + 'Vereinbarung. Er nimmt sie aus dem Regal und holt sich den Ersatz aus dem '
                 + 'Lager des Hauses — {menge}. Kein Pfennig wechselt die Hand, und das Bier '
                 + 'ist trotzdem weg.',
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
                  + 'Kostet nichts als anderthalb Hektoliter Verlust je Sud und bringt fünfzehn '
                  + 'Prozent Haltbarkeit. Der billigste Griff, den dieses Jahrzehnt kennt.',
              wirkung: { haltbar: 1.15, gaer: 0, roh: 0, mehr: -1, risiko: 0 } },
            { k: 'filter', name: 'Kieselgurfilter', preis: 26000, einmal: true, hoechst: 3,
              satz: 'Blank filtriert. Vierzig Prozent mehr Haltbarkeit, und im Regal sieht man es. '
                  + 'Erst blank filtriertes Bier geht als Export hinaus. '
                  + 'Einmal bezahlt, danach jederzeit abzustellen.',
              wirkung: { haltbar: 1.4, gaer: 0, roh: 0, mehr: 0, risiko: 0 } },
            { k: 'pasteur', name: 'Tunnelpasteur', preis: 74000, fest: true, hoechst: 3,
              satz: 'Die Flasche läuft durch heißes Wasser. Das Bier hält doppelt so lang, und '
                  + 'drei Hektoliter je Sud gehen dabei verloren. Unwiderruflich — der Tunnel steht, '
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
         nimmtRohstoff: 0.20, nimmtBottiche: 1, gueteAb: 10 },
    /* Das Reichsgesetz betreffend den Verkehr mit Nahrungsmitteln, Genussmitteln
       und Gebrauchsgegenstaenden vom 14. Mai 1879 hat die oeffentlichen
       Untersuchungsanstalten geschaffen; sie ziehen Proben, wo sie wollen.
       Warm durchgegorenes Bier ist der Fall, auf den sie warten. */
    3: { wer: 'Die Untersuchungsanstalt',
         satz: 'Der Beamte hat im Gärkeller Proben gezogen. Warm durchgegoren, sagt sein '
             + 'Befund, und das Gesetz von 1879 gibt ihm den Bottich.',
         nimmtRohstoff: 0.15, nimmtBottiche: 1, gueteAb: 8 }
  },

  /* =======================================================================
     DIE KALTE PFANNE — der Ausgang, den DIESES Stueck zu verantworten hat.

     Gemessen am Stand vor dieser Runde: in 1600 schliessen die Braujahre
     1602 und 1603 mit "0 Sude", in 1970 die Jahre 1972 und 1973, und das
     Sudbuch schrieb es dreimal hintereinander auf, ohne dass es etwas
     bedeutet haette. Ein Brauhaus, das drei Jahre nicht anstellt, ist kein
     Brauhaus mehr — und in jeder der vier Rechtslagen hoert es aus einem
     ANDEREN Grund auf, es zu sein:

       1350  Wo reihum gebraut wird, haengt das Braurecht am Sudtag. Wer
             seinen Tag dreimal verstreichen laesst, steht nicht mehr in der
             Reihe; der Rat gibt ihn weiter.
       1600  Die Zunftlade fuehrt die Braugerechtigkeit als Realrecht am
             Haus, mit der Pflicht, es auszuueben.
       1884  Eine Braustaette, die nicht arbeitet, ist Masse: der
             Malzhaendler laesst sie schaetzen, die Bank ruft die Hypothek.
       1970  Eine stillstehende Anlage hat einen Wert und einen Kaeufer.
             Die Nordstern-Gruppe hat ihr Angebot laengst im Protokoll.

     Die Warnung steht zwei Jahre vorher am Brett und im Sudbuch. Das ist
     die "sichtbare Verlustlage", die vorher fehlte.
     ======================================================================= */
  kalt: {
    frist: 3,
    1: { warnung: 'Der Sudtag ist verstrichen: {n} Braujahr{e} ohne Sud. Wer dreimal nicht '
                + 'anstellt, steht nicht mehr in der Reihe.',
         grund: 'reihe-verloren',
         ende: 'Drei Braujahre ohne einen einzigen Sud. Der Rat gibt den Sudtag des Hauses '
             + 'an die Reihe zurück — das Braurecht hängt am Brauen, nicht am Namen.',
         pfanne: 'Die Pfanne bleibt stehen, sie gehört zum Haus. Wer nach dieser Familie '
               + 'einzieht, feuert unter demselben Stein.' },
    2: { warnung: 'Die Lade hat es angeschrieben: {n} Braujahr{e} ohne Sud. Beim dritten zieht '
                + 'sie die Gerechtigkeit ein.',
         grund: 'lade-zieht-ein',
         ende: 'Drei Braujahre ohne einen einzigen Sud. Die Zunftlade zieht die '
             + 'Braugerechtigkeit ein und verteilt die Sudtage auf die übrigen Häuser.',
         pfanne: 'Pfanne, Gärbottiche und der Schlüssel zum Felsenkeller gehen an die Lade. '
               + 'Verkauft wird nichts — verteilt wird alles.' },
    3: { warnung: 'Der Schornstein raucht nicht: {n} Braujahr{e} ohne Sud. Der Malzhändler '
                + 'lässt die Braustätte bereits schätzen.',
         grund: 'braustaette-still',
         ende: 'Drei Braujahre ohne einen einzigen Sud. Die Bank ruft die Hypothek auf die '
             + 'stillstehende Braustätte; das Amtsgericht setzt den Versteigerungstermin an.',
         pfanne: 'Der Kupferhelm kommt unter den Hammer, die Kältemaschine wird ausgebaut und '
               + 'in eine fremde Halle gestellt. Das Sudhaus bleibt leer stehen.' },
    4: { warnung: 'Das Sudwerk steht: {n} Braujahr{e} ohne Charge. Eine stillstehende Anlage '
                + 'hat einen Wert und einen Käufer.',
         grund: 'anlage-still',
         ende: 'Drei Braujahre ohne eine einzige Charge. Eine Brauerei, die nicht fährt, ist '
             + 'kein Betrieb mehr, sondern ein Grundstück mit Anlagen darauf.',
         pfanne: 'Die Tanks werden leergefahren und gespült, das Sudwerk stillgelegt. Was '
               + 'bleibt, ist die Marke — und für die steht ein Angebot im Protokoll.' }
  },

  /* Was aus der Pfanne wird, wenn die Uhr aus einem FREMDEN Grund steht.
     ZUSTAENDIGKEIT §12: jedes Stueck malt sein eigenes Schlussblatt; dieses
     hier spricht nur ueber das, was ihm gehoert — das Sudhaus. Das Urteil
     ueber die Partie steht auf dem Blatt dessen, der das Ende ausgeloest hat,
     und dieses Blatt legt sich nicht darueber. */
  schluss: {
    1: { steht: 'Die Pfanne bleibt an. Was an Feuer, Wasser und Malz durch dieses Haus '
              + 'gegangen ist, steht im Sudbuch — der Rest ist Sache derer, die nach uns '
              + 'kommen.',
         faellt: 'Das Feuer unter der Pfanne wird nicht wieder angezündet.' },
    2: { steht: 'Die Pfanne bleibt an, und der Felsenkeller bleibt kalt.',
         faellt: 'Die Pfanne wird ausgeschöpft und der Kessel abgeschlagen.' },
    3: { steht: 'Das Sudwerk läuft weiter; der Kupferhelm bleibt, wo er steht.',
         faellt: 'Das Sudwerk wird abgestellt und der Kupferhelm gewogen.' },
    4: { steht: 'Das Sudwerk fährt weiter, Charge um Charge, wie es das Protokoll verlangt.',
         faellt: 'Das Sudwerk wird abgefahren und der letzte Tank gespült.' }
  }
};
