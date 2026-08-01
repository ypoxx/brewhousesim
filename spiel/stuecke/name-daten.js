/* ===========================================================================
   stuecke/name-daten.js — DER NAME.  Die Tafeln.

   BESITZSTAND DER NAME: stuecke/name*.js · stil/name*.css · bild/name/**
                         · ton/name/**   (Zustaendigkeit §14)

   Hier steht KEINE Mechanik, nur was in jeder Epoche anders ist. Das ist die
   Stelle, an der die Latte "Verbliste je Epoche" gewonnen oder verloren wird:
   vier Epochen, vier TRAEGER-MEDIEN, vier VERBEN und vier INSTANZEN, die
   ueber das Haus urteilen.

     1350  Bierzeiger und Zunftzeichen   AUSHAENGEN      Der Rat (Bierkieser)
     1600  Wirtshausschild und Krug      ANSCHLAGEN      Die Zunft und die Wirte
     1884  Etikett, Plakat, Saeule       AUFLEGEN        Presse und Ausstellung
     1970  Kronkorken, Bande, Spot       ETAT SETZEN     Die Leute (Verbrauchertest)

   SPERRLISTE, hier eingebaut statt versprochen:
   · Emailschilder erst ab den 1890ern — 'email' traegt ab:1894 und erscheint
     vorher als gesperrter Knopf MIT dem Grund darauf.
   · Das eingetragene Warenzeichen ebenfalls ab 1894 (Warenzeichengesetz 1894).
   · Kein Preis und keine Menge steht hier als Text — beides kommt zur Laufzeit
     aus welt.geld() und welt.menge().
   =========================================================================== */

var NAME_DATEN = (function () {
  'use strict';

  return {

    /* Wie weit ein Name in dieser Epoche ueberhaupt reichen KANN. 1350 kennen
       ihn drei Gassen weit; 1970 kennt ihn die Republik. Genau daran wird die
       Epoche zur Epoche und nicht zur Tapete. */
    epochen: {
      1: {
        jahr: 1350,
        medium: 'Bierzeiger und Zunftzeichen',
        verb: 'AUSHAENGEN',
        deckel: 55,                 /* hoechste erreichbare Bekanntheit */
        aufschlag: 0.08,            /* was ein voller Ruf am Preis wert ist */
        urteiler: 'Der Bierkieser des Rats',
        urteilerSagt: 'Zweimal im Jahr kommt er unangemeldet, setzt sich in den Hof '
          + 'und trinkt. Was er sagt, sagt er vor Zeugen.',
        satz: 'Wer den Zeiger aushaengt, hat gesagt, dass Bier da ist. Das ist ein '
          + 'Versprechen vor der ganzen Gasse — und es kostet nichts, es zu brechen. Einmal.',
        ort: 'sudhaus',
        bild: 'zeiger1.png',
        bildWenn: 'zeiger',
        breite: 5.5,
        versatz: { dx: 2, dy: -6 }
      },
      2: {
        jahr: 1600,
        medium: 'Wirtshausschild und gemarkter Krug',
        verb: 'ANSCHLAGEN',
        deckel: 68,
        aufschlag: 0.13,
        urteiler: 'Die Zunft und die Wirte',
        urteilerSagt: 'Die Zunftschau tagt einmal im Jahr. Die Wirte reden das ganze Jahr.',
        satz: 'Der Name wohnt jetzt in fremden Haeusern. Jedes Schild ist ein Versprechen '
          + 'an einen Wirt, dem man nichts befehlen kann.',
        ort: 'lindenhof',
        bild: 'schild2.png',
        bildWenn: 'schild',
        breite: 2.4,
        versatz: { dx: -5, dy: 12.5 }
      },
      3: {
        jahr: 1884,
        medium: 'Etikett, Plakat, Litfasssaeule',
        verb: 'AUFLEGEN',
        deckel: 86,
        aufschlag: 0.21,
        urteiler: 'Das Wochenblatt und die Ausstellung',
        urteilerSagt: 'Gedruckt wird, was auffaellt. Eine Medaille haengt vierzig Jahre '
          + 'im Kontor; eine Notiz ueber verdorbenes Bier haengt laenger.',
        satz: 'Zum ersten Mal reist der Name ohne das Fass. Und zum ersten Mal kann ihn '
          + 'jemand nachdrucken.',
        ort: 'marktplatz',
        bild: 'saeule3.png',
        bildWenn: 'saeule',
        breite: 1.4,
        versatz: { dx: 2.6, dy: 9.5 }
      },
      4: {
        jahr: 1970,
        medium: 'Kronkorken, Bandenwerbung, Fernsehspot',
        verb: 'ETAT SETZEN',
        deckel: 92,
        aufschlag: 0.32,
        urteiler: 'Die Leute',
        urteilerSagt: 'Einmal im Jahr kauft eine Zeitschrift zwoelf Biere und schreibt auf, '
          + 'welches schmeckt. Niemand im Haus kann daran etwas drehen.',
        satz: 'Der Etat laeuft jedes Jahr neu ab. Und was der Spot verspricht, muss im '
          + 'Kasten sein — sonst hat man teuer dafuer bezahlt, dass es alle merken.',
        ort: 'strasse',
        bild: 'tafel4.png',
        bildWenn: 'bande',
        breite: 4.6,
        versatz: { dx: -2, dy: -8 }
      }
    },

    /* ------------------------------------------------------------------
       DIE TRAEGER. Vier Listen, vier Bauarten — nicht eine Liste in vier
       Farben. 'art' entscheidet, wie der Knopf sich benimmt:

         schalter   an und aus, kostet kein Geld, aber es sieht jeder
         fest       einmal und nie wieder (unwiderruflich)
         adresse    einer je Wirtshaus; das Urteil dieses Wirts zaehlt doppelt
         jahr       laeuft ein Braujahr und muss neu bezahlt werden
         wette      man zahlt, und eine fremde Jury entscheidet
         schutz     wirkt nur gegen den Nachahmer, eine Anzahl Jahre lang
         notbremse  kostet bar und rettet den Ruf, beides sofort
       ------------------------------------------------------------------ */
    traeger: {
      1: [
        { k: 'zeiger', art: 'schalter', name: 'Den Bierzeiger aushaengen',
          aus: 'Den Bierzeiger einziehen', preis: 0, reichweite: 24,
          sagt: 'Die Stange mit dem Strohkranz ueber dem Sudhaus. Kostet kein Geld — sie '
            + 'sagt nur der ganzen Gasse, dass Bier da ist.',
          warnt: 'Solange sie haengt, wird das Haus daran gemessen, was ausgeschenkt wird.' },
        { k: 'zunftzeichen', art: 'fest', name: 'Um das Zunftzeichen bitten',
          preis: 45, reichweite: 18, schuetzt: true,
          sagt: 'Das geschmiedete Zeichen der Brauerzunft neben dem Zeiger. Unwiderruflich.',
          warnt: 'Wer es fuehrt, wird an ihm gemessen: jeder Rufbruch zaehlt danach doppelt. '
            + 'Dafuer darf niemand sonst den Zeiger des Hauses fuehren.' },
        { k: 'umtrunk', art: 'adresse', name: 'Umtrunk beim Wirt',
          preis: 9, reichweite: 6, hoechstens: 3,
          sagt: 'Man setzt sich hin und laesst anschreiben. Der Wirt redet danach anders '
            + 'ueber das Haus.',
          warnt: 'Drei Wirte sind das Aeusserste, was eine Amtszeit schafft.' }
      ],
      2: [
        { k: 'schild', art: 'adresse', name: 'Wirtshausschild anschlagen',
          preis: 70, reichweite: 10, hoechstens: 6,
          sagt: 'Der geschmiedete Ausleger mit dem Anker haengt am Haus des Wirts, nicht am '
            + 'eigenen. Das Urteil dieses Wirts zaehlt danach doppelt.',
          warnt: 'Ein Schild ueber einer Tuer, hinter der kein Bier des Hauses steht, ist die '
            + 'teuerste Art, einen Namen zu verlieren.' },
        { k: 'krug', art: 'fest', name: 'Den gemarkten Krug einfuehren',
          preis: 260, reichweite: 14, langsam: true,
          sagt: 'Steinzeug mit eingedruecktem Anker, in jeder belieferten Schenke. Der Gast '
            + 'haelt die Marke in der Hand, waehrend er trinkt.',
          warnt: 'Teuer und langsam: er wirkt erst unter dem naechsten Wirt des Hauses. '
            + 'Dafuer haelt er alles, was einmal aufgebaut ist, doppelt so lange.' },
        { k: 'zunftspruch', art: 'schutz', name: 'Zunftspruch gegen den Nachahmer',
          preis: 40, jahre: 8,
          sagt: 'Die Zunft verbietet dem Adler das Zeichen — fuer acht Jahre.' }
      ],
      3: [
        { k: 'etikett', art: 'jahr', name: 'Etiketten auflegen',
          preis: 900, reichweite: 19,
          sagt: 'Der lithografierte Bogen auf jeder Flasche und jedem Fassdeckel. Die '
            + 'Auflage reicht ein Braujahr.',
          warnt: 'Ein Etikett ist das erste am Haus, was ein anderer nachdrucken kann.' },
        { k: 'plakat', art: 'jahr', name: 'Plakate anschlagen lassen',
          preis: 1600, reichweite: 21,
          sagt: 'Steindruck in drei Farben an den Bauzaeunen der Vorstadt.' },
        { k: 'saeule', art: 'jahr', name: 'Litfasssaeule mieten',
          preis: 2400, reichweite: 24,
          sagt: 'Die Saeule am Marktplatz, ein Jahr lang. Wer sie hat, hat sie allein.' },
        { k: 'email', art: 'jahr', name: 'Emailschilder ausgeben', ab: 1894,
          preis: 3500, reichweite: 17,
          sagt: 'Gebranntes Blech, wetterfest, an jeder Wirtshauswand.',
          sperr: 'Emailschilder gibt es erst ab den 1890ern — vorher gibt es das Verfahren nicht.' },
        { k: 'ausstellung', art: 'wette', name: 'Die Ausstellung beschicken',
          preis: 3000, reichweite: 12,
          sagt: 'Zwei Fass gehen an die Gewerbeausstellung. Die Jury urteilt ohne das Haus.',
          warnt: 'Eine Medaille haengt vierzig Jahre im Kontor. Ein leeres Haendeschuetteln '
            + 'kostet dasselbe Geld.' },
        { k: 'warenzeichen', art: 'fest', name: 'Das Warenzeichen eintragen', ab: 1894,
          preis: 4200, schuetzt: true,
          sagt: 'Der Anker wird als Warenzeichen eingetragen. Unwiderruflich, und er gilt '
            + 'auch noch, wenn das Papier laengst vergilbt ist.',
          sperr: 'Ein Warenzeichen laesst sich erst ab 1894 eintragen.' }
      ],
      4: [
        { k: 'kronkorken', art: 'jahr', name: 'Kronkorken bedrucken',
          preis: 6000, reichweite: 13,
          sagt: 'Der Anker auf jedem Deckel. Billig, klein — und er liegt hinterher in '
            + 'jeder Kueche.' },
        { k: 'bande', art: 'jahr', name: 'Bandenwerbung mieten',
          preis: 14000, reichweite: 23,
          sagt: 'Die Tafel am Sportplatz und an der Ausfallstrasse. Regional, aber jede Woche.' },
        { k: 'spot', art: 'jahr', name: 'Fernsehspot senden', laut: true,
          preis: 48000, reichweite: 46,
          sagt: 'Dreissig Sekunden vor der Tagesschau. Danach kennt den Namen jeder.',
          warnt: 'Ein Spot macht das Versprechen bundesweit. Wer laut wirbt und duenn liefert, '
            + 'faellt doppelt so tief — der Test misst genau das.' },
        { k: 'rueckruf', art: 'notbremse', name: 'Rueckruf anordnen',
          preis: 30000,
          sagt: 'Alles zurueckholen, was draussen ist, und es selbst sagen, bevor es ein '
            + 'anderer sagt.',
          warnt: 'Kostet bar. Rettet den Namen. Beides sofort.' },
        { k: 'unterlassung', art: 'schutz', name: 'Unterlassung erwirken', jahre: 12,
          preis: 22000,
          sagt: 'Der Anwalt schreibt der Adler-Braeu AG.' }
      ]
    },

    /* Das Wort, mit dem ein Urteil im Register steht. Kurz, datiert, und es
       bleibt stehen — auch wenn es erloschen ist. */
    urteile: {
      lob: {
        1: 'Der Bierkieser des Rats lobt den Sud vor Zeugen.',
        2: 'Die Zunftschau nennt das Haus unter den ordentlichen.',
        3: 'Das Wochenblatt schreibt gut ueber den Anker.',
        4: 'Der Verbrauchertest setzt den Anker nach vorn.'
      },
      tadel: {
        1: 'Der Bierkieser findet den Sud duenn — und der Zeiger haengt.',
        2: 'Die Wirte reden: unter dem Schild kam schlechtes Bier.',
        3: 'Das Wochenblatt meldet verdorbenes Bier unter dem Anker.',
        4: 'Der Verbrauchertest setzt den Anker auf den letzten Platz.'
      },
      medaille: {
        3: 'Silbermedaille der Gewerbeausstellung.',
        4: 'Preis der Fachjury.'
      },
      bruch: {
        1: 'In der Gasse spricht es sich herum: unter dem Zeiger kam duennes Bier.',
        2: 'Zwei Wirte schicken das Fass zurueck — unter dem Anker war es nicht dasselbe.',
        3: 'Die Haendler melden Reklamationen auf Ware mit dem Etikett des Ankers.',
        4: 'In den Gaststaetten redet man: der Anker ist nicht mehr das, was der Spot sagt.'
      },
      leer: {
        1: 'Der Zeiger hing, und es war kein Bier im Haus.',
        2: 'Ein Schild ueber einer Tuer, hinter der kein Anker mehr ausgeschenkt wird.',
        3: 'Die Plakate hingen, das Lager war leer.',
        4: 'Der Spot lief, und im Regal stand nichts.'
      }
    },

    /* Wie DER GEGNER nachahmt — und was in dieser Epoche dagegen hilft.
       Nachahmen ist billiger als besser brauen; das ist der ganze Punkt. */
    nachahmung: {
      1: { was: 'haengt denselben Strohkranz aus',
           gegen: 'Klage vor dem Rat', preis: 7, sicher: 0.55, schluessel: 'klage' },
      2: { was: 'laesst dasselbe Ankerschild schmieden',
           gegen: 'Zunftspruch erwirken', preis: 40, sicher: 0.85, schluessel: 'zunftspruch' },
      3: { was: 'druckt ein Etikett, das dem eigenen bis auf die Farbe gleicht',
           gegen: 'Das Warenzeichen eintragen', preis: 4200, sicher: 1,
           schluessel: 'warenzeichen', ab: 1894,
           ohne: 'Vor 1894 gibt es kein Warenzeichen. Was hilft, ist ein Etikett, das '
             + 'niemand nachdrucken WILL — also eines mit einer Medaille darauf.' },
      4: { was: 'schaltet einen Spot mit einem Anker im Kreis',
           gegen: 'Unterlassung erwirken', preis: 22000, sicher: 1,
           schluessel: 'unterlassung' }
    }
  };
}());
