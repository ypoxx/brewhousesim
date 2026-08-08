/* ===========================================================================
   kern/welt.js — DER WELTZUSTAND.  GEHOERT DEM SKELETT-BAUER.

   Alle vier Stuecke LESEN hier und aendern ausschliesslich ueber die API.
   Die Wirtshaeuser, die Kasse, die Uhr und die Orte stehen deshalb genau
   einmal im Repo — das ist der Grund, warum DIE FUHRE, DER PREIS und DER
   GEGNER dieselben Adressen bespielen koennen, ohne je dieselbe Zeile zu
   beruehren.

   ZWEI SPERRLISTEN-SICHERUNGEN STECKEN IN DIESER DATEI:
   · welt.menge()   gibt vor 1872 NIE Hektoliter aus, sondern Fass.
   · welt.geld()    gibt die Waehrung des Jahres aus, nicht die der Epoche.
   Wer beide benutzt, kann an dieser Stelle nicht mehr disqualifiziert werden.
   =========================================================================== */

(function (B) {
  'use strict';

  var LITER_JE_FASS = 150;          /* ein Fass ~ 150 l ~ 1,5 hl */

  /* ----------------------------------------------------------------------
     Die vier Epochen. Jede hat ein eigenes Kernverb — das ist die Antwort
     auf den Vorwurf "vier Tapeten": in jeder Epoche tut man etwas anderes.
     ---------------------------------------------------------------------- */
  var EPOCHEN = [
    /* 'lager' ist der Name, unter dem der Vorrat in der Kopfleiste steht.
       Er muss zu dem Brett passen, das denselben Vorrat zeigt (DIE FUHRE:
       DER KELLER · DAS GEWÖLBE · DER EISKELLER · DIE TANKS) — sonst heisst
       dieselbe Sache oben anders als unten. Glaettung Welle 1. */
    { nr: 1, name: 'Das Recht',   verb: 'ueberleben', von: 1350, bis: 1516, schaujahr: 1350,
      rohstoff: 'Grut',   sorte: 'Grutbier',  haltbar: 5, lager: 'Keller',
      sagt: 'Ein Kessel, ein Braurecht, eine Stadt. Bier verdirbt in Tagen.' },
    { nr: 2, name: 'Die Ordnung', verb: 'besitzen',   von: 1517, bis: 1799, schaujahr: 1600,
      rohstoff: 'Hopfen', sorte: 'Braunbier', haltbar: 9, lager: 'Gewölbe',
      sagt: 'Reinheitsgebot, Zunft, Sommerbrauverbot. Vom Pächter zum Eigentümer.' },
    { nr: 3, name: 'Die Maschine', verb: 'skalieren', von: 1800, bis: 1913, schaujahr: 1884,
      rohstoff: 'Hopfen', sorte: 'Lagerbier', haltbar: 22, lager: 'Eiskeller',
      sagt: 'Dampf, Bahn, Kältemaschine. Aus dem Betrieb wird ein Unternehmen.' },
    { nr: 4, name: 'Die Marke',   verb: 'bedeuten',   von: 1914, bis: 2025, schaujahr: 1970,
      rohstoff: 'Hopfen', sorte: 'Pilsner',   haltbar: 40, lager: 'Tanks',
      sagt: 'Menge zählt weniger als Identität. Wer nur billig wurde, hat nichts in der Hand.' }
  ];

  /* Waehrung nach JAHR, nicht nach Epoche — sonst steht 1810 "Mark" im Bild,
     und die Mark gibt es erst ab 1873. */
  var WAEHRUNGEN = [
    { bis: 1499, name: 'Pfennig',    kurz: 'Pf', teiler: 1 },
    { bis: 1872, name: 'Gulden',     kurz: 'fl', teiler: 1 },
    { bis: 1923, name: 'Mark',       kurz: 'M',  teiler: 1 },
    { bis: 1948, name: 'Reichsmark', kurz: 'RM', teiler: 1 },
    { bis: 2001, name: 'D-Mark',     kurz: 'DM', teiler: 1 },
    { bis: 9999, name: 'Euro',       kurz: 'EUR', teiler: 1 }
  ];

  /* ----------------------------------------------------------------------
     Die Adressen. 12 benannte Haeuser, jedes an einem Ort aus orte.js.
     bedarf: Fass im Jahr.  reihe: Absatz der letzten drei Jahre in Fass.
     bindung: {wem:'haus'|'adler'|'konzern'|null, womit, bis}
     ---------------------------------------------------------------------- */
  var ADRESSEN = [
    { schluessel: 'lindenhof',  name: 'Gasthof Lindenhof',    ort: 'lindenhof',     km: 0.2, bedarf: 90, art: 'gasthof' },
    { schluessel: 'ochse',      name: 'Zum Goldenen Ochsen',  ort: 'marktplatz',    km: 0.6, bedarf: 70, art: 'wirtshaus' },
    { schluessel: 'torschenke', name: 'Schenke am Tor',       ort: 'tor',           km: 0.1, bedarf: 40, art: 'schenke' },
    { schluessel: 'pfarrhof',   name: 'Pfarrschenke St. Michael', ort: 'kirche',    km: 0.8, bedarf: 35, art: 'schenke' },
    { schluessel: 'muehlwirt',  name: 'Mühlschenke',         ort: 'muehle',        km: 3,   bedarf: 45, art: 'wirtshaus' },
    { schluessel: 'brueckenwirt', name: 'Brückenwirt',       ort: 'bruecke_unten', km: 2,   bedarf: 55, art: 'wirtshaus' },
    { schluessel: 'faehrhaus',  name: 'Fährhaus am Fluss',   ort: 'fluss',         km: 4,   bedarf: 30, art: 'wirtshaus' },
    { schluessel: 'hirsch',     name: 'Landgasthof Hirsch',   ort: 'strasse',       km: 7,   bedarf: 50, art: 'gasthof' },
    { schluessel: 'markt',      name: 'Ausschank am Markt',   ort: 'marktstand',    km: 0.5, bedarf: 25, art: 'stand' },
    { schluessel: 'obernberg',  name: 'Klosterschenke Obernberg', ort: 'bruecke_oben', km: 9, bedarf: 40, art: 'kloster', bis: 2 },
    { schluessel: 'bahnhofswirt', name: 'Bahnhofsgaststätte', ort: 'bahnhof',      km: 5,   bedarf: 120, art: 'gasthof', ab: 3 },
    { schluessel: 'neustadt',   name: 'Gaststätte Neustadt', ort: 'wohnblock',     km: 1.5, bedarf: 200, art: 'gaststaette', ab: 4 }
  ];

  /* ----------------------------------------------------------------------
     Gegner. Der Adler ist von Anfang an da und zieht mit dem Haus mit;
     ab 1970 kommt ein Konzern dazu, der nicht braut, sondern kauft.
     ---------------------------------------------------------------------- */
  var GEGNER = [
    { schluessel: 'adler', art: 'brauerei', ab: 1, bis: 4,
      namen: { 1: 'Brauhaus zum Adler', 2: 'Braustatt Adler', 3: 'Brauerei Adler', 4: 'Adler-Bräu AG' },
      orte: { 1: 'marktplatz', 2: 'marktplatz', 3: 'konkurrenz', 4: 'konkurrenz' },
      kasse: 140, wagemut: 0.45,
      sagt: 'Braut, was das Haus braut, und stellt sich immer eine Woche früher an die Tür.' },
    { schluessel: 'konzern', art: 'konzern', ab: 4, bis: 4,
      namen: { 4: 'Nordstern-Gruppe' },
      orte: { 4: 'bahnhof' },
      kasse: 900000, wagemut: 0.7,
      sagt: 'Braut nichts. Kauft Adressen, dann Brauereien, dann Namen.' }
  ];

  var VORNAMEN = {
    1: ['Kunigunde', 'Heinrich', 'Agnes', 'Cunz', 'Mechthild', 'Berthold'],
    2: ['Barbara', 'Sebastian', 'Ursula', 'Veit', 'Magdalena', 'Kaspar'],
    3: ['Wilhelmine', 'Ludwig', 'Therese', 'Anton', 'Karoline', 'Xaver'],
    4: ['Margarete', 'Franz', 'Hedwig', 'Werner', 'Sabine', 'Ottmar']
  };

  var EIGENSCHAFTEN = [
    { schluessel: 'sparsam',   name: 'sparsam',    sagt: 'Hält das Geld zusammen, versäumt die Gelegenheit.' },
    { schluessel: 'wagemutig', name: 'wagemutig',  sagt: 'Baut, bevor gerechnet ist.' },
    { schluessel: 'fromm',     name: 'fromm',      sagt: 'Hat die Kirche im Rücken und die Zunft im Nacken.' },
    { schluessel: 'streitbar', name: 'streitbar',  sagt: 'Gewinnt Prozesse und verliert Freunde.' },
    { schluessel: 'gelehrt',   name: 'gelehrt',    sagt: 'Liest, misst, probiert. Braucht länger.' },
    { schluessel: 'bequem',    name: 'bequem',     sagt: 'Lässt laufen. Manchmal ist das richtig.' }
  ];

  /* ====================================================================== */

  var W = {

    LITER_JE_FASS: LITER_JE_FASS,
    LETZTES_JAHR: 2025,
    EPOCHEN: EPOCHEN,
    EIGENSCHAFTEN: EIGENSCHAFTEN,

    /* --- Zustand. Wird von aufbau() gefuellt. --------------------------- */
    haus: null,
    zeit: null,
    vorrat: null,
    adressen: [],
    gegner: [],
    chronik: [],

    /* ------------------------------------------------------------------
       AUFBAU. Ruft start.js genau einmal.
       ------------------------------------------------------------------ */
    aufbau: function (opt) {
      opt = opt || {};
      var epoche = B.grenze(opt.epoche || 1, 1, 4);
      var jahr = opt.jahr || EPOCHEN[epoche - 1].schaujahr;
      epoche = W.epocheZuJahr(jahr);
      var woche = B.grenze(opt.woche || 1, 1, B.uhr.WOCHEN_IM_JAHR);
      var e = EPOCHEN[epoche - 1];

      W.haus = {
        name: 'Brauhaus zum Anker',
        familie: 'Bruckner',
        gegruendet: 1350,
        kasse: [112, 640, 14250, 86000][epoche - 1],
        rohstoff: [40, 65, 120, 340][epoche - 1],
        ansehen: 20 + epoche * 5,
        braurecht: epoche === 1 ? 'verliehen' : (epoche === 2 ? 'gepachtet' : 'eigen'),
        sudJeWoche: [1, 2, 6, 20][epoche - 1]
      };

      W.zeit = {
        jahr: jahr,
        woche: woche,
        epoche: epoche,
        ende: false,
        amtszeit: null
      };
      W.neueAmtszeit(jahr, true);

      W.vorrat = {
        plaetze: [12, 24, 90, 400][epoche - 1],
        faesser: []
      };
      var startfaesser = Math.round(W.vorrat.plaetze * 0.35);
      for (var i = 0; i < startfaesser; i++) {
        W.vorrat.faesser.push({
          sorte: e.sorte,
          jahr: jahr,
          woche: Math.max(1, woche - B.wuerfel.ganz(0, 3)),
          haltbar: e.haltbar
        });
      }

      W.adressen = ADRESSEN.map(function (a) {
        var d = {
          schluessel: a.schluessel, name: a.name, ort: a.ort, km: a.km,
          art: a.art, ab: a.ab || 1, bis: a.bis || 4,
          bedarf: Math.round(a.bedarf * [0.35, 0.6, 1, 1.8][epoche - 1]),
          bindung: null,
          reihe: [0, 0, 0],
          zufrieden: 55
        };
        /* Wer beliefert wen zu Beginn? Der Wuerfel, damit dieselbe Saat
           dieselbe Ausgangslage ergibt. */
        var r = B.wuerfel.zahl();
        if (r < 0.45) d.bindung = { wem: 'haus', womit: 'Gewohnheit', bis: jahr + B.wuerfel.ganz(1, 4) };
        else if (r < 0.72) d.bindung = { wem: 'adler', womit: 'Gewohnheit', bis: jahr + B.wuerfel.ganz(1, 4) };
        var anteil = d.bindung && d.bindung.wem === 'haus' ? 0.75 : 0.1;
        d.reihe = [2, 1, 0].map(function (k) {
          return Math.round(d.bedarf * anteil * (0.8 + B.wuerfel.zahl() * 0.4) * (1 - k * 0.06));
        });
        return d;
      });

      W.gegner = GEGNER.map(function (g) {
        return {
          schluessel: g.schluessel, art: g.art, ab: g.ab, bis: g.bis,
          namen: g.namen, orte: g.orte, sagt: g.sagt,
          kasse: g.kasse, wagemut: g.wagemut,
          zuege: 0
        };
      });

      W.chronik = [];
      B.protokoll.length = 0;

      W.schreibe('Das Haus ' + W.haus.name + ', gegründet ' + W.haus.gegruendet
        + '. ' + W.zeit.amtszeit.name + ' fuehrt es.', 'anfang');
      return W;
    },

    /* ------------------------------------------------------------------
       EPOCHE
       ------------------------------------------------------------------ */
    epocheZuJahr: function (jahr) {
      for (var i = 0; i < EPOCHEN.length; i++) {
        if (jahr <= EPOCHEN[i].bis) return EPOCHEN[i].nr;
      }
      return 4;
    },

    epoche: function (nr) {
      var n = nr || (W.zeit ? W.zeit.epoche : 1);
      return EPOCHEN[B.grenze(n, 1, 4) - 1];
    },

    /* ------------------------------------------------------------------
       GELD.  geld(112) -> "112 Pf"
       ------------------------------------------------------------------ */
    waehrung: function (jahr) {
      var j = (jahr === undefined) ? (W.zeit ? W.zeit.jahr : 1350) : jahr;
      for (var i = 0; i < WAEHRUNGEN.length; i++) {
        if (j <= WAEHRUNGEN[i].bis) return WAEHRUNGEN[i];
      }
      return WAEHRUNGEN[WAEHRUNGEN.length - 1];
    },

    geld: function (betrag, ohneEinheit) {
      var w = W.waehrung();
      var n = B.zahl(Math.round(betrag));
      return ohneEinheit ? n : n + ' ' + w.kurz;
    },

    /* ------------------------------------------------------------------
       MENGE.  SPERRLISTE: Hektoliter erst ab 1872.
       Vorher rechnet und schreibt das Spiel in Fass.
       ------------------------------------------------------------------ */
    menge: function (fass, ohneEinheit) {
      var j = W.zeit ? W.zeit.jahr : 1350;
      if (j >= 1872) {
        var hl = fass * LITER_JE_FASS / 100;
        return B.zahl(hl, hl < 10 ? 1 : 0) + (ohneEinheit ? '' : ' hl');
      }
      return B.zahl(Math.round(fass)) + (ohneEinheit ? '' : (Math.round(fass) === 1 ? ' Fass' : ' Fass'));
    },

    mengeEinheit: function () {
      return (W.zeit && W.zeit.jahr >= 1872) ? 'hl' : 'Fass';
    },

    /* ------------------------------------------------------------------
       KASSE.  Jede Bewegung wird protokolliert — daraus schreiben die
       Stuecke ihre zaehlbaren Dinge auf den Bildschirm.
       ------------------------------------------------------------------ */
    kann: function (betrag) { return W.haus.kasse >= betrag; },

    zahle: function (betrag, was, wer) {
      betrag = Math.round(betrag);
      if (betrag > 0 && W.haus.kasse < betrag) {
        W.protokolliere({ wer: wer || 'spieler', was: was + ' (nicht bezahlbar)', preis: -betrag, misslungen: true });
        return false;
      }
      W.haus.kasse -= betrag;
      W.protokolliere({ wer: wer || 'spieler', was: was, preis: -betrag });
      return true;
    },

    nimm: function (betrag, was, wer) {
      betrag = Math.round(betrag);
      W.haus.kasse += betrag;
      W.protokolliere({ wer: wer || 'spieler', was: was, preis: betrag });
      return true;
    },

    /* ------------------------------------------------------------------
       VORRAT.  Ein Eintrag = ein Fass.
       ------------------------------------------------------------------ */
    legeEin: function (sorte, anzahl) {
      var n = anzahl || 1, gelegt = 0;
      for (var i = 0; i < n; i++) {
        if (W.vorrat.faesser.length >= W.vorrat.plaetze) break;
        W.vorrat.faesser.push({
          sorte: sorte || W.epoche().sorte,
          jahr: W.zeit.jahr, woche: W.zeit.woche,
          haltbar: W.epoche().haltbar
        });
        gelegt++;
      }
      return gelegt;
    },

    nimmHeraus: function (anzahl) {
      var n = Math.min(anzahl || 1, W.vorrat.faesser.length);
      return W.vorrat.faesser.splice(0, n);           /* aeltestes zuerst */
    },

    fassAlter: function (fass) {
      return (W.zeit.jahr - fass.jahr) * B.uhr.WOCHEN_IM_JAHR + (W.zeit.woche - fass.woche);
    },

    /* Was ohne den Spieler geschieht. Ruft die Uhr jede Woche.
       Ein Protokolleintrag mit wer:'verfall' — das ist die dritte Partei
       neben Spieler und Gegner. */
    verfall: function () {
      var weg = 0;
      W.vorrat.faesser = W.vorrat.faesser.filter(function (f) {
        if (W.fassAlter(f) > f.haltbar) { weg++; return false; }
        return true;
      });
      if (weg) {
        W.protokolliere({ wer: 'verfall', was: weg + ' Fass verdorben', preis: 0, menge: weg });
      }
      return weg;
    },

    /* ------------------------------------------------------------------
       ADRESSEN
       ------------------------------------------------------------------ */
    adresse: function (schluessel) {
      for (var i = 0; i < W.adressen.length; i++) {
        if (W.adressen[i].schluessel === schluessel) return W.adressen[i];
      }
      return null;
    },

    adressenJetzt: function (epoche) {
      var e = epoche || W.zeit.epoche;
      return W.adressen.filter(function (a) { return a.ab <= e && a.bis >= e; });
    },

    /* Bindung setzen — der einzige erlaubte Weg.
       Eine bestehende Bindung zu LOESEN darf nur, wem sie gehoert. Sonst nimmt ein
       Stueck dem anderen Besitz weg, den der Spieler ihm nie abgenommen hat — genau
       das ist passiert (ZUSTAENDIGKEIT §8). `wer` ist der Loeschende; fehlt er, gilt
       'haus'. Ein Fehlversuch gibt false zurueck und aendert nichts. */
    binde: function (schluessel, wem, womit, bisJahr, wer) {
      var a = W.adresse(schluessel);
      if (!a) return false;
      if (!wem && a.bindung && a.bindung.wem !== (wer || 'haus')) return false;
      a.bindung = wem ? { wem: wem, womit: womit || 'Vertrag', bis: bisJahr || (W.zeit.jahr + 3) } : null;
      return true;
    },

    /* Wem gehoert diese Adresse gerade? Damit ein Stueck fragen kann, statt zu raten. */
    gebunden: function (schluessel) {
      var a = W.adresse(schluessel);
      return a && a.bindung ? a.bindung.wem : null;
    },

    /* ------------------------------------------------------------------
       GEGNER
       ------------------------------------------------------------------ */
    gegnerJetzt: function (epoche) {
      var e = epoche || W.zeit.epoche;
      return W.gegner.filter(function (g) { return g.ab <= e && g.bis >= e; });
    },

    gegnerName: function (g) { return g.namen[W.zeit.epoche] || g.namen[4] || g.schluessel; },
    gegnerOrt: function (g) { return g.orte[W.zeit.epoche] || g.orte[4] || 'konkurrenz'; },

    /* ------------------------------------------------------------------
       GENERATIONEN
       ------------------------------------------------------------------ */
    neueAmtszeit: function (jahr, erste) {
      var e = W.epocheZuJahr(jahr);
      var vorname = B.wuerfel.aus(VORNAMEN[e]);
      var eigen = B.wuerfel.aus(EIGENSCHAFTEN);
      var nr = (W.zeit && W.zeit.amtszeit) ? W.zeit.amtszeit.nr + 1 : 1;
      W.zeit.amtszeit = {
        nr: nr,
        name: vorname + ' ' + W.haus.familie,
        vorname: vorname,
        seit: jahr,
        bis: jahr + B.wuerfel.ganz(21, 37),
        eigenschaft: eigen.schluessel,
        eigenschaftName: eigen.name,
        sagt: eigen.sagt
      };
      if (!erste) {
        W.schreibe(W.zeit.amtszeit.name + ' übernimmt das Haus in ' + jahr
          + '. Man sagt: ' + eigen.sagt, 'erbfall');
        B.sende('erbfall', { amtszeit: W.zeit.amtszeit });
      }
      return W.zeit.amtszeit;
    },

    erbe: function () { return W.neueAmtszeit(W.zeit.jahr, false); },

    /* ------------------------------------------------------------------
       JAHRESABSCHLUSS. Der Sommer laeuft ohne Hand durch.
       ------------------------------------------------------------------ */
    rechneJahrAb: function () {
      /* Absatzreihe fortschreiben: was das Haus dieses Jahr geliefert hat. */
      var geliefert = {};
      B.protokoll.forEach(function (p) {
        if (p.jahr === W.zeit.jahr && p.adresse && p.menge) {
          geliefert[p.adresse] = (geliefert[p.adresse] || 0) + p.menge;
        }
      });
      W.adressen.forEach(function (a) {
        a.reihe.shift();
        a.reihe.push(geliefert[a.schluessel] || 0);
      });

      /* Der Sommer kostet: Unterhalt, Zins, Zehnt.
         DIE EINZIGE STELLE IM SPIEL, AN DER DIE KASSE NEGATIV WERDEN KONNTE.
         `W.zahle()` weiter oben prueft die Deckung und gibt `false` zurueck,
         wenn die Lade nicht reicht — diese Zeile zog ungeprueft ab. Gemessen am
         4. August 2026 (werkbank/schuss/aufsicht/kassenboden.mjs): in 1350
         faellt der Zwischenstand auf -7 Pf, gebucht genau bei "Sommer:
         Unterhalt und Abgaben". Wochenweise sieht man es NICHT, weil der
         Vorgriff von DER PREIS es im selben Wochenwechsel abfaengt
         (uhr.js:160 laesst rechneJahrAb() vor sende('jahr') laufen) — ein
         Stueck aber, das in diesem Augenblick welt.kann() fragt, bekam eine
         falsche Auskunft.
         Der Unterhalt wird weiter voll erhoben, solange die Lade ihn traegt;
         reicht sie nicht, nimmt er, was da ist, und die Kasse steht auf null
         statt darunter. Was fehlte, steht im Protokoll — verschwiegen wird
         nichts. Vorgeschlagen und gemessen begruendet von DER PREIS und
         unabhaengig von dessen blindem Kritiker gefunden (Welle 5);
         eingearbeitet von der Aufsicht, als kein Agent mehr lief. */
      var faellig = Math.round(W.haus.kasse * 0.04 + W.vorrat.plaetze * 0.6);
      var unterhalt = Math.min(Math.max(0, Math.floor(W.haus.kasse)), faellig);
      W.haus.kasse -= unterhalt;
      W.protokolliere({ wer: 'verfall', was: 'Sommer: Unterhalt und Abgaben', preis: -unterhalt });
      if (faellig > unterhalt) {
        W.protokolliere({ wer: 'verfall', misslungen: true, preis: 0,
          was: 'Sommer: ' + W.geld(faellig - unterhalt) + ' blieben unbezahlt' });
      }

      /* Bindungen laufen aus. */
      W.adressen.forEach(function (a) {
        if (a.bindung && a.bindung.bis <= W.zeit.jahr) {
          W.protokolliere({ wer: 'verfall', was: a.name + ': Bindung ausgelaufen', preis: 0, adresse: a.schluessel });
          a.bindung = null;
        }
      });
    },

    /* ------------------------------------------------------------------
       CHRONIK — append-only.
       ------------------------------------------------------------------ */
    schreibe: function (text, art) {
      var e = {
        jahr: W.zeit ? W.zeit.jahr : 1350,
        woche: W.zeit ? W.zeit.woche : 1,
        art: art || 'satz',
        text: String(text)
      };
      W.chronik.push(e);
      B.sende('chronik', e);
      return e;
    },

    /* ------------------------------------------------------------------
       PROTOKOLL — append-only Buchfuehrung.
       {woche, jahr, wer:'spieler'|'gegner'|'verfall', was, preis}
       Aus dieser Liste schreiben die Stuecke ihre zaehlbaren Dinge auf den
       Bildschirm; der Kritiker zaehlt genau das.
       ------------------------------------------------------------------ */
    protokolliere: function (eintrag) {
      var e = {
        nr: B.protokoll.length + 1,
        jahr: W.zeit ? W.zeit.jahr : 1350,
        woche: W.zeit ? W.zeit.woche : 1,
        wer: eintrag.wer || 'spieler',
        was: String(eintrag.was || ''),
        preis: eintrag.preis || 0,
        menge: eintrag.menge || 0,
        adresse: eintrag.adresse || null,
        misslungen: !!eintrag.misslungen
      };
      B.protokoll.push(e);
      B.sende('protokoll', e);
      return e;
    },

    /* Die letzten n Eintraege, ggf. gefiltert nach wer. */
    protokollLetzte: function (n, wer) {
      var l = wer ? B.protokoll.filter(function (p) { return p.wer === wer; }) : B.protokoll;
      return l.slice(Math.max(0, l.length - (n || 12)));
    },

    /* Barschaft gegen Preis des naechsten sinnvollen Zuges — die eine Zahl,
       auf die es nach der Messlatte ankommt.

       Bis zum 2.8.2026 hielt der Kern hier schlicht das MINIMUM ueber alle
       Meldungen. Damit gewann in jeder Epoche derselbe feste Jahresposten der
       Werbung, dessen Preis sich in 400 Wochen nicht bewegt — 9 Pf / 18 fl /
       240 M / 1.800 DM. Die Kopfzeile war die Kasse mit anderer Beschriftung:
       gemessen 2,1- bis 32,8-fach neben dem billigsten umkaempften Zug. Alle
       vier Stuecke der Welle 2b haben unabhaengig dieselbe Kernaenderung
       verlangt (DIE EICHUNG, DER GEGNER, DIE STADT, DER SUD), und DIE FUHRE
       schon in Welle 2.

       Jetzt entscheidet zuerst die ART des Zuges, dann sein Preis. Werbung
       ohne 'art' bekommt Rang 0 und verliert gegen alles, was die Lage des
       Hauses aendert. Die Stuecke schicken die Art laengst mit.  */
    ZUGRANG: { umkaempft: 3, bindung: 2, adresse: 2, bau: 2, lage: 1 },

    /* ALLE Meldungen dieses Durchgangs, nicht nur die beste.
       Vorher hielt der Kern EINE Meldung. Fiel die durch die Pruefung unten
       (kein Knopf da, gesperrt, verdeckt), gab es fuer diese Woche gar keine
       Kennzahl — `null` statt des naechstbesten Zuges. Gemessen am 3. August
       2026 von DIE RUECKKOPPLUNG: 18 von 4.800 Wochen, davon 6 von 400 allein
       in 1884. Eine Latte, die in einzelnen Wochen einfach nichts sagt, ist an
       genau diesen Wochen blind. */
    zugMeldungen: [],

    meldeZug: function (was, preis, art, zug) {
      if (!preis) return;
      W.zugMeldungen.push({ was: was, preis: preis, art: art || null,
                            zug: zug || null, rang: W.ZUGRANG[art] || 0 });
    },

    /* Der beste Zug, den man WIRKLICH DRUECKEN KANN. Rang vor Preis, und dann
       der Reihe nach, bis einer die Pruefung besteht — statt beim ersten
       Fehlschlag aufzugeben. Ueberschrift und Kennzahl lesen beide hier, damit
       die Zahl nie zu einem anderen Zug gehoert als der Text daneben. */
    besterZug: function () {
      var liste = W.zugMeldungen.slice().sort(function (a, b) {
        return b.rang - a.rang || a.preis - b.preis;
      });
      for (var i = 0; i < liste.length; i++) {
        if (W.zugBedienbar(liste[i])) return liste[i];
      }
      return null;
    },

    /* Bedienbar heisst: der Knopf steht da, ist nicht gesperrt UND hat eine
       Flaeche. Die Flaechenpruefung ist neu — `disabled` allein liess Knoepfe
       durch, die zwar frei waren, aber zusammengeklappt bei 0x0 lagen. */
    zugBedienbar: function (z) {
      if (!z || !z.preis) return false;
      if (!z.zug || typeof document === 'undefined') return true;
      var el = document.querySelector('[data-zug="' + z.zug + '"]');
      if (!el || el.disabled) return false;
      var r = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
      if (r && (!r.width || !r.height)) return false;
      return true;
    },

    zugDeckung: function () {
      var z = W.besterZug();
      return z ? W.haus.kasse / z.preis : null;
    },

    /* ------------------------------------------------------------------
       DER ZWEITE SATZ AM UNTEREN RAND.  Welle 13, R3 (Auflage A2).

       Die Zeile „naechster Zug: … (Kasse reicht 5,9x)" ist nach dem Urteil
       des blinden Spielkritikers DIE BESTE ZEILE DES SPIELS. Was daneben
       fehlt, ist die andere Haelfte: WAS DAS GUTE ENDE IST UND WIE WEIT DAS
       HAUS DAVON ENTFERNT IST. Der Kritiker hat das gute Ende in vier
       Sitzungen und 1.030 Wochen nie gesehen, obwohl es fuenfzehn Wochen
       lang offenstand — er hatte keinen Anlass, den Reiter aufzuschlagen,
       hinter dem es steht.

       DER KERN ERFINDET DIESEN SATZ NICHT. Er weiss nicht, was in dieser
       Epoche ein gutes Ende ist; das weiss das Stueck, das es baut (DIE
       FUHRE hat ihn in `uebergabeFehlt()` seit Welle 6 im Klartext). Der
       Kern haelt den Platz und die Regel:

           B.welt.meldeZiel(satz, naehe)

         satz   Klartext, ein Satz. Was das gute Ende ist und wie weit das
                Haus davon entfernt ist.
         naehe  0..1 — wie nah das Haus dran ist. null/undefined heisst
                „unbekannt"; dann steht kein Anteil in der Zeile.

       Gebaut wie meldeZug(): in JEDEM Zeichendurchgang neu melden, denn vor
       jedem Durchgang wird vergessen (kern/buehne.js). MELDET NIEMAND, IST
       DIE ZEILE LEER — sie luegt nicht und sie steht auch nicht mit einem
       alten Satz da. Melden mehrere, gewinnt die groesste `naehe`; bei
       Gleichstand die zuerst gemeldete.
       ------------------------------------------------------------------ */
    zielMeldungen: [],

    meldeZiel: function (satz, naehe) {
      if (!satz) return;
      var n = (naehe === undefined || naehe === null || isNaN(naehe))
        ? null : B.grenze(+naehe, 0, 1);
      W.zielMeldungen.push({ satz: String(satz), naehe: n });
    },

    /* Die Meldung, die gezeigt wird — oder null. */
    bestesZiel: function () {
      var b = null;
      for (var i = 0; i < W.zielMeldungen.length; i++) {
        var z = W.zielMeldungen[i];
        if (!b || (z.naehe !== null && (b.naehe === null || z.naehe > b.naehe))) b = z;
      }
      return b;
    }
  };

  /* `naechsterZug` bleibt nach aussen genau das, was es war — eine Eigenschaft,
     die man liest (kern/kopf.js) und vor jedem Zeichnen auf null setzt
     (kern/buehne.js). Nur steht jetzt der beste BEDIENBARE Zug darin, aus allen
     Meldungen des Durchgangs, statt der einen, die zufaellig zuerst gewann.
     Als Eigenschaft mit Zugriffsfunktionen, damit kein Stueck und keine andere
     Kerndatei angefasst werden muss. */
  Object.defineProperty(W, 'naechsterZug', {
    get: function () { return W.besterZug(); },
    set: function (v) { if (!v) W.zugMeldungen = []; },
    enumerable: true, configurable: true
  });

  B.welt = W;

  /* append-only. Nie leeren ausser beim Aufbau. */
  B.protokoll = [];

})(BRAUHAUS);
