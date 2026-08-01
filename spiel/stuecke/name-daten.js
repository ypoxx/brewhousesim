/* ===========================================================================
   stuecke/name-daten.js — DER NAME.  Die Tafeln.

   BESITZSTAND DER NAME: stuecke/name*.js · stil/name*.css · bild/name/**
                         · ton/name/**   (Zustaendigkeit §14)

   Hier steht KEINE Mechanik, nur was in jeder Epoche anders ist. Das ist die
   Stelle, an der die Latte "Verbliste je Epoche" gewonnen oder verloren wird:
   vier Epochen, vier TRAEGER-MEDIEN, vier VERBEN und vier INSTANZEN, die
   ueber das Haus urteilen.

     1350  Bierzeiger und Zunftzeichen   AUSHÄNGEN       Der Rat (Bierkieser)
     1600  Wirtshausschild und Krug      ANSCHLAGEN      Die Zunft und die Wirte
     1884  Etikett, Plakat, Säule        AUFLEGEN        Presse und Ausstellung
     1970  Kronkorken, Bande, Spot       ETAT SETZEN     Die Leute (Verbrauchertest)

   Und vier verschiedene KNAPPHEITEN, damit es nicht viermal dieselbe Liste in
   anderer Schrift ist:
     1350  drei Umtrunke je Amtszeit — Zeit, nicht Geld
     1600  sechs fremde Tueren, und jede kann das Schild wieder hergeben
     1884  jede Auflage verfaellt am Jahresende und muss neu bezahlt werden
     1970  DER ETAT traegt nur DREI Posten gleichzeitig — wer den Spot will,
           muss etwas einstellen. Das ist die Ausschliessung, die 1884 nicht hat.

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
       Epoche zur Epoche und nicht zur Tapete.

       'aufschlag' ist der SATZ, den ein voller Ruf auf die Rechnung legt —
       DAS AUFGELD. Es wird beim Ausliefern faellig und von DEM NAMEN selbst
       gebucht, Zeile fuer Zeile. */
    epochen: {
      1: {
        jahr: 1350,
        medium: 'Bierzeiger und Zunftzeichen',
        verb: 'AUSHÄNGEN',
        deckel: 55,                 /* hoechste erreichbare Bekanntheit */
        aufschlag: 0.08,            /* was ein voller Ruf am Preis wert ist */
        aufgeldWort: 'Aufgeld auf den Zeiger',
        aufgeldSatz: 'Wer den Zeiger kennt, feilscht weniger. Der Wirt zahlt den '
          + 'Aufschlag am Fass, nicht in einem Vertrag.',
        urteiler: 'Der Bierkieser des Rats',
        urteilerSagt: 'Zweimal im Jahr kommt er unangemeldet, setzt sich in den Hof '
          + 'und trinkt. Was er sagt, sagt er vor Zeugen.',
        satz: 'Wer den Zeiger aushängt, hat gesagt, dass Bier da ist. Das ist ein '
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
        aufgeldWort: 'Aufgeld auf den Anker',
        aufgeldSatz: 'Der Wirt, an dessen Tür das Ankerschild hängt, zahlt mehr für '
          + 'dasselbe Fass — er verkauft es auch teurer weiter.',
        urteiler: 'Die Zunft und die Wirte',
        urteilerSagt: 'Die Zunftschau tagt einmal im Jahr. Die Wirte reden das ganze Jahr.',
        satz: 'Der Name wohnt jetzt in fremden Häusern. Jedes Schild ist ein Versprechen '
          + 'an einen Wirt, dem man nichts befehlen kann.',
        ort: 'lindenhof',
        bild: 'schild2.png',
        bildWenn: 'schild',
        breite: 2.4,
        versatz: { dx: -5, dy: 12.5 }
      },
      3: {
        jahr: 1884,
        medium: 'Etikett, Plakat, Litfaßsäule',
        verb: 'AUFLEGEN',
        deckel: 86,
        aufschlag: 0.21,
        aufgeldWort: 'Aufgeld auf die Marke',
        aufgeldSatz: 'Der Händler zahlt für das Etikett mit, weil er es weiterverkauft. '
          + 'Zum ersten Mal steht der Aufschlag auf einer Rechnung.',
        urteiler: 'Das Wochenblatt und die Ausstellung',
        urteilerSagt: 'Gedruckt wird, was auffällt. Eine Medaille hängt vierzig Jahre '
          + 'im Kontor; eine Notiz über verdorbenes Bier hängt länger.',
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
        etat: 3,                    /* nur so viele Jahresposten gleichzeitig */
        aufgeldWort: 'Aufgeld auf den Namen',
        aufgeldSatz: 'Der Einkäufer der Handelskette rechnet mit spitzem Bleistift und '
          + 'zahlt trotzdem mehr — weil das Regal sich sonst nicht leert.',
        urteiler: 'Die Leute',
        urteilerSagt: 'Einmal im Jahr kauft eine Zeitschrift zwölf Biere und schreibt auf, '
          + 'welches schmeckt. Niemand im Haus kann daran etwas drehen.',
        satz: 'Der Etat läuft jedes Jahr neu ab und trägt nur drei Posten. Und was der '
          + 'Spot verspricht, muss im Kasten sein — sonst hat man teuer dafür bezahlt, '
          + 'dass es alle merken.',
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
        { k: 'zeiger', art: 'schalter', name: 'Den Bierzeiger aushängen',
          aus: 'Den Bierzeiger einziehen', preis: 0, reichweite: 24,
          sagt: 'Die Stange mit dem Strohkranz über dem Sudhaus. Kostet kein Geld — sie '
            + 'sagt nur der ganzen Gasse, dass Bier da ist.',
          warnt: 'Solange sie hängt, wird das Haus daran gemessen, was ausgeschenkt wird.' },
        { k: 'zunftzeichen', art: 'fest', name: 'Um das Zunftzeichen bitten',
          preis: 45, reichweite: 18, schuetzt: true,
          sagt: 'Das geschmiedete Zeichen der Brauerzunft neben dem Zeiger. Unwiderruflich.',
          warnt: 'Wer es führt, wird an ihm gemessen: jeder Rufbruch zählt danach doppelt. '
            + 'Dafür darf niemand sonst den Zeiger des Hauses führen.' },
        { k: 'umtrunk', art: 'adresse', name: 'Umtrunk beim Wirt',
          preis: 9, reichweite: 6, hoechstens: 3,
          sagt: 'Man setzt sich hin und lässt anschreiben. Der Wirt redet danach anders '
            + 'über das Haus.',
          warnt: 'Drei Wirte sind das Äußerste, was eine Amtszeit schafft.' }
      ],
      2: [
        { k: 'schild', art: 'adresse', name: 'Wirtshausschild anschlagen',
          preis: 70, reichweite: 10, hoechstens: 6,
          sagt: 'Der geschmiedete Ausleger mit dem Anker hängt am Haus des Wirts, nicht am '
            + 'eigenen. Das Urteil dieses Wirts zählt danach doppelt.',
          warnt: 'Ein Schild über einer Tür, hinter der kein Bier des Hauses steht, ist die '
            + 'teuerste Art, einen Namen zu verlieren.' },
        { k: 'krug', art: 'fest', name: 'Den gemarkten Krug einführen',
          preis: 260, reichweite: 14, langsam: true,
          sagt: 'Steinzeug mit eingedrücktem Anker, in jeder belieferten Schenke. Der Gast '
            + 'hält die Marke in der Hand, während er trinkt.',
          warnt: 'Teuer und langsam: er wirkt erst unter dem nächsten Wirt des Hauses. '
            + 'Dafür hält er alles, was einmal aufgebaut ist, doppelt so lange.' },
        { k: 'zunftspruch', art: 'schutz', name: 'Zunftspruch gegen den Nachahmer',
          preis: 40, jahre: 8,
          sagt: 'Die Zunft verbietet dem Adler das Zeichen — für acht Jahre.' }
      ],
      3: [
        { k: 'etikett', art: 'jahr', name: 'Etiketten auflegen',
          preis: 900, reichweite: 19,
          sagt: 'Der lithografierte Bogen auf jeder Flasche und jedem Fassdeckel. Die '
            + 'Auflage reicht ein Braujahr.',
          warnt: 'Ein Etikett ist das erste am Haus, was ein anderer nachdrucken kann.' },
        { k: 'plakat', art: 'jahr', name: 'Plakate anschlagen lassen',
          preis: 1600, reichweite: 21,
          sagt: 'Steindruck in drei Farben an den Bauzäunen der Vorstadt.' },
        { k: 'saeule', art: 'jahr', name: 'Litfaßsäule mieten',
          preis: 2400, reichweite: 24,
          sagt: 'Die Säule am Marktplatz, ein Jahr lang. Wer sie hat, hat sie allein.' },
        { k: 'email', art: 'jahr', name: 'Emailschilder ausgeben', ab: 1894,
          preis: 3500, reichweite: 17,
          sagt: 'Gebranntes Blech, wetterfest, an jeder Wirtshauswand.',
          sperr: 'Emailschilder gibt es erst ab den 1890ern — vorher gibt es das Verfahren nicht.' },
        { k: 'ausstellung', art: 'wette', name: 'Die Ausstellung beschicken',
          preis: 3000, reichweite: 12,
          sagt: 'Zwei Fass gehen an die Gewerbeausstellung. Die Jury urteilt ohne das Haus.',
          warnt: 'Eine Medaille hängt vierzig Jahre im Kontor. Ein leeres Händeschütteln '
            + 'kostet dasselbe Geld.' },
        { k: 'warenzeichen', art: 'fest', name: 'Das Warenzeichen eintragen', ab: 1894,
          preis: 4200, schuetzt: true,
          sagt: 'Der Anker wird als Warenzeichen eingetragen. Unwiderruflich, und er gilt '
            + 'auch noch, wenn das Papier längst vergilbt ist.',
          sperr: 'Ein Warenzeichen lässt sich erst ab 1894 eintragen.' }
      ],
      4: [
        /* Fuenf Jahresposten, drei Plaetze im Etat. Die Leiter ist mit Absicht
           dicht: unter jeder Barschaft ueber rund 2.000 stehen mindestens zwei
           bezahlbare Karten nebeneinander, und sie schliessen einander aus. */
        { k: 'bierdeckel', art: 'jahr', name: 'Bierdeckel drucken lassen',
          preis: 1800, reichweite: 5,
          sagt: 'Der Anker auf dem Pappdeckel unter jedem Glas. Der billigste Posten im '
            + 'Etat — und der einzige, den jeder Gast anfasst.' },
        { k: 'kronkorken', art: 'jahr', name: 'Kronkorken bedrucken',
          preis: 5000, reichweite: 13,
          sagt: 'Der Anker auf jedem Deckel. Billig, klein — und er liegt hinterher in '
            + 'jeder Küche.' },
        { k: 'anzeige', art: 'jahr', name: 'Anzeige im Anzeigenblatt',
          preis: 9000, reichweite: 16,
          sagt: 'Eine Viertelseite, jeden Donnerstag, im Blatt für den Kreis. Sie kostet '
            + 'weniger als die Bande und wird schneller vergessen.' },
        { k: 'bande', art: 'jahr', name: 'Bandenwerbung mieten',
          preis: 14000, reichweite: 23,
          sagt: 'Die Tafel am Sportplatz und an der Ausfallstraße. Regional, aber jede Woche.' },
        { k: 'spot', art: 'jahr', name: 'Fernsehspot senden', laut: true,
          preis: 48000, reichweite: 46,
          sagt: 'Dreißig Sekunden vor der Tagesschau. Danach kennt den Namen jeder.',
          warnt: 'Ein Spot macht das Versprechen bundesweit. Wer laut wirbt und dünn liefert, '
            + 'fällt doppelt so tief — der Test misst genau das.' },
        { k: 'rueckruf', art: 'notbremse', name: 'Rückruf anordnen',
          preis: 30000,
          sagt: 'Alles zurückholen, was draußen ist, und es selbst sagen, bevor es ein '
            + 'anderer sagt.',
          warnt: 'Kostet bar. Rettet den Namen. Beides sofort.' },
        { k: 'unterlassung', art: 'schutz', name: 'Unterlassung erwirken', jahre: 12,
          preis: 22000,
          sagt: 'Der Anwalt schreibt der Adler-Bräu AG.' }
      ]
    },

    /* Das Wort, mit dem ein Urteil im Register steht. Kurz, datiert, und es
       bleibt stehen — auch wenn es erloschen ist. */
    urteile: {
      lob: {
        1: 'Der Bierkieser des Rats lobt den Sud vor Zeugen.',
        2: 'Die Zunftschau nennt das Haus unter den ordentlichen.',
        3: 'Das Wochenblatt schreibt gut über den Anker.',
        4: 'Der Verbrauchertest setzt den Anker nach vorn.'
      },
      tadel: {
        1: 'Der Bierkieser findet den Sud dünn — und der Zeiger hängt.',
        2: 'Die Wirte reden: unter dem Schild kam schlechtes Bier.',
        3: 'Das Wochenblatt meldet verdorbenes Bier unter dem Anker.',
        4: 'Der Verbrauchertest setzt den Anker auf den letzten Platz.'
      },
      medaille: {
        3: 'Silbermedaille der Gewerbeausstellung.',
        4: 'Preis der Fachjury.'
      },
      bruch: {
        1: 'In der Gasse spricht es sich herum: unter dem Zeiger kam dünnes Bier.',
        2: 'Zwei Wirte schicken das Fass zurück — unter dem Anker war es nicht dasselbe.',
        3: 'Die Händler melden Reklamationen auf Ware mit dem Etikett des Ankers.',
        4: 'In den Gaststätten redet man: der Anker ist nicht mehr das, was der Spot sagt.'
      },
      leer: {
        1: 'Der Zeiger hing, und es war kein Bier im Haus.',
        2: 'Ein Schild über einer Tür, hinter der kein Anker mehr ausgeschenkt wird.',
        3: 'Die Plakate hingen, das Lager war leer.',
        4: 'Der Spot lief, und im Regal stand nichts.'
      }
    },

    /* Wie DER GEGNER nachahmt — und was in dieser Epoche dagegen hilft.
       Nachahmen ist billiger als besser brauen; das ist der ganze Punkt. */
    nachahmung: {
      1: { was: 'hängt denselben Strohkranz aus',
           gegen: 'Klage vor dem Rat', preis: 7, sicher: 0.55, schluessel: 'klage' },
      2: { was: 'lässt dasselbe Ankerschild schmieden',
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
