/* ===========================================================================
   stuecke/preis.js — DER PREIS.  Die Michaelitafel.

   DER ZEITPUNKT, NICHT DAS BLATT
   Zu Michaeli — Woche 1, dem 29. September — klappt die Buehne um. Wo im
   Braujahr die Haeuser, die Anschlagtafel, der Keller und der Wagen liegen,
   liegt an diesem einen Tag die Optionsflaeche: drei bis fuenf benannte
   Angebote NEBENEINANDER, jedes mit Preisschild, Bauzeit und der Folge, die
   es spaeter hat. Die Kasse reicht nie fuer alles, und die Groessen sind
   ungleich — 3.000 fuer das Dach der Krone neben 16.000 fuer den
   Felsenkeller. Deshalb entstehen Buendel und kein Kreuzchen mit drei
   Feldern.

   GENAU EINE FESTLEGUNG JE AMTSZEIT
   Eine Zeile tiefer steht, was nicht zurueckgenommen werden kann. Je Amtszeit
   eine. Sie aendert eine REGEL fuer den Rest der Partie — Hopfen statt Grut,
   der Freikauf vom Grundherrn, Vertrag statt Gunst, die Handelsmarke — und
   steht danach unabaenderlich in der Chronik, die dieses Stueck mitbaut.
   Der zweite Klick nimmt sie nicht zurueck; es gibt keinen zweiten Klick.

   DIE EINE ZAHL
   Dieses Stueck verantwortet das Verhaeltnis Barschaft : Preis des naechsten
   sinnvollen Zuges. Es faellt, weil die Bierordnung in JAHRZEHNTEN um ein
   Zehntel steigt und der Anschlag in JAHREN um sieben Hundertstel — und weil
   die billigen Verbesserungen einmalig sind und ausgehen. Beides steht auf
   der Tafel, in Zahlen, nicht im Quelltext.

   WAS HIER NIE PASSIERT
   Das Blatt bewertet nicht an Stelle des Spielers. Keine Empfehlung, keine
   Warnung, keine Schlusszeile, die droht. Es stehen Zahlen da und die Regel,
   nach der sie zustande kommen. Wer nichts nimmt, bekommt dafuer keinen
   Tadel — in manchen Jahren ist Nichtnehmen die richtige Antwort, und die
   Tafel sagt auch das nicht, sie zeigt nur, was faellig wird.

   ?tafel=zu  laesst die Tafel beim Laden geschlossen (fuer Bildaufnahmen).

   BESITZSTAND: stuecke/preis*.js · stil/preis*.css · bild/preis/** · ton/preis/**
   =========================================================================== */

(function (B) {
  'use strict';

  var D = window.PREIS_DATEN;

  /* ----------------------------------------------------------------------
     ZUSTAND. Alles, was welt.js nicht kennt, wohnt hier.
     ---------------------------------------------------------------------- */
  var Z = {
    epoche: 0,
    startjahr: 0,
    tafelJahr: 0,
    offen: false,
    seite: 'tafel',

    umsatz: 0,
    hoehe: 0,
    anschlag: 0,
    kaeufe: 0,

    angebote: [],          /* Schluessel der diesjaehrigen Auswahl        */
    genommen: {},          /* k -> {jahr, preis, fertig}                  */
    fertig: {},            /* k -> Jahr der Fertigstellung                */
    gesperrt: {},          /* k -> Schluessel, der ihn ausgeschlossen hat */
    raten: [],             /* [{k, name, rate, offen, faellig}]           */

    pflichtWeg: {},
    pflichtNeu: [],
    ertraege: [],          /* [{k, name, betrag}] jaehrlich               */
    rohstoffe: [],         /* [{k, name, menge}] jaehrlich                */
    aufschlag: 0,

    umlagen: [],           /* [{jahr, name, sagt, bezahlt}]               */
    handlohnFaellig: false,
    rueckstand: 0,

    handlohnWeg: false,
    handlohnHalb: false,
    umlageHalb: false,
    preisDeckel: false,
    wachstumsdeckel: false,

    festGenommen: {},      /* k -> {jahr, amtszeit, name}                 */
    festAmtszeit: {},      /* Amtszeit-Nr -> Schluessel                   */

    rechnung: [],          /* was dieses Michaeli gebucht wurde           */
    chronik: [],           /* eigene, unabaenderliche Chronik             */
    leiter: [],            /* {jahr, kasse, billigst, verhaeltnis}        */
    ersteTafel: true,
    erzwungen: false,
    meldung: null
  };

  /* ----------------------------------------------------------------------
     KLEINES HANDWERK
     ---------------------------------------------------------------------- */
  function ep() { return D.epochen[B.welt.zeit.epoche] || D.epochen[1]; }
  function jahr() { return B.welt.zeit.jahr; }
  function amtszeit() { return B.welt.zeit.amtszeit || { nr: 1, name: 'Unbekannt' }; }
  function geld(n) { return B.welt.geld(n); }

  /* Zwei bedeutende Stellen — damit ein Anschlag wie ein Anschlag aussieht
     und nicht wie ein Rechenergebnis. */
  function rundePreis(p) {
    p = Math.max(1, p);
    var stufe = Math.floor(Math.log(p) / Math.LN10) - 1;
    var g = Math.pow(10, Math.max(0, stufe));
    return Math.max(1, Math.round(p / g) * g);
  }

  function angebotVon(k) {
    var l = ep().angebote;
    for (var i = 0; i < l.length; i++) if (l[i].k === k) return l[i];
    return null;
  }

  function festlegungVon(k) {
    var l = ep().festlegungen;
    for (var i = 0; i < l.length; i++) if (l[i].k === k) return l[i];
    return null;
  }

  /* ----------------------------------------------------------------------
     DER ANSCHLAG — die Zahl, aus der alle Preise dieses Jahres folgen.
     Sie steht auf der Tafel, mit ihren beiden Bestandteilen: was durch das
     Haus geht (Umsatz) und was im Haus liegt (Hoehe). Das ist keine
     Gummiwand, sondern die Regel, nach der ein Rat, ein Boettcher und eine
     Bank tatsaechlich rechnen: wer mehr hat, wird teurer bedient.
     ---------------------------------------------------------------------- */
  function umsatzGewicht() { return Z.wachstumsdeckel ? 0.18 : 0.30; }

  /* Was die Barschaft zum Anschlag beitraegt — und zwar UNTERPROPORTIONAL.
     Wuerde der Schaetzer die Kasse eins zu eins bewerten, waere der Preis ein
     festes Vielfaches der Kasse, und Sparen brächte nie etwas: was man
     zurueckgelegt hat, machte genau das teurer, wofuer man es zurueckgelegt
     hat. Mit dem Exponenten wird das Doppelte an Barschaft nur rund die
     Haelfte teurer bedient, und eine gesparte Kasse holt einen grossen Bau
     tatsaechlich ein. Der Satz auf der Tafel bleibt derselbe: wer mehr hat,
     wird teurer bedient — nur nicht in derselben Steigung. */
  var HOEHE_GEWICHT = 2.2;
  var HOEHE_STEIGUNG = 0.55;

  function ausBarschaft() {
    var e = ep();
    var h = Math.max(0, Z.hoehe) / e.grund;
    return e.grund * HOEHE_GEWICHT * Math.pow(h, HOEHE_STEIGUNG);
  }

  function rechneAnschlag() {
    var e = ep();
    var wert = umsatzGewicht() * Z.umsatz + ausBarschaft();
    var basis = Math.max(e.grund, wert);
    var jahre = B.grenze(jahr() - Z.startjahr, 0, 40);
    Z.anschlag = basis * Math.pow(e.teuerungJahr, jahre) * Math.pow(e.teuerungKauf, Z.kaeufe);
    return Z.anschlag;
  }

  function messeUmsatz(j) {
    var summe = 0;
    B.protokoll.forEach(function (p) {
      if (p.jahr === j && p.wer === 'spieler' && p.preis > 0) summe += p.preis;
    });
    return summe;
  }

  /* Preis eines Angebots in diesem Jahr. */
  function preisVon(a) { return rundePreis(a.anteil * Z.anschlag); }

  /* Was jetzt zu zahlen ist, wenn gebaut wird (Anzahlung), und die Raten. */
  function zahlplan(a) {
    var ganz = preisVon(a);
    if (!a.bauzeit) return { ganz: ganz, jetzt: ganz, rate: 0, raten: 0 };
    var jetzt = rundePreis(ganz * 0.45);
    var rest = Math.max(0, ganz - jetzt);
    var rate = rundePreis(rest / a.bauzeit);
    return { ganz: ganz, jetzt: jetzt, rate: rate, raten: a.bauzeit };
  }

  /* ----------------------------------------------------------------------
     PFLICHTEN — was jedes Jahr faellig ist, mit Namen.
     ---------------------------------------------------------------------- */
  /* Die Lasten haengen an dem, was messbar ist: am Umsatz des Vorjahres und an
     der Barschaft. Nicht am Preis eines Kellers. Deshalb kann eine Epoche das
     Haus nicht ueber Nacht zerreiben, und deshalb frisst Liegenlassen sich
     selbst auf: wer hortet, wird hoeher veranlagt. */
  function lastenBasis() {
    var e = ep();
    var jahre = B.grenze(jahr() - Z.startjahr, 0, 40);
    var roh = e.pflichtUmsatz * Math.max(Z.umsatz, e.lastenGrund)
            + e.pflichtHoehe * Z.hoehe;
    return roh * Math.pow(e.teuerungJahr, jahre);
  }

  function pflichtenJetzt() {
    var e = ep();
    var basis = lastenBasis();
    var l = [];
    e.pflichten.forEach(function (p) {
      if (Z.pflichtWeg[p.k]) return;
      l.push({ k: p.k, name: p.name, sagt: p.sagt, betrag: rundePreis(p.teil * basis) });
    });
    Z.pflichtNeu.forEach(function (p) {
      if (Z.pflichtWeg[p.k]) return;
      l.push({ k: p.k, name: p.name, sagt: p.sagt, betrag: rundePreis(p.teil * basis) });
    });
    return l;
  }

  function pflichtSumme() {
    var s = 0;
    pflichtenJetzt().forEach(function (p) { s += p.betrag; });
    return s;
  }

  /* Jede Umlage hat ihr eigenes Gewicht. Eine Brandschatzung ist keine
     Brueckenumlage — stuenden fuenf gleiche Zahlen untereinander, waere die
     Spalte offensichtlich eine Formel und kein Kalender. */
  function umlageBetrag(u) {
    var teil = (u && u.teil) ? u.teil : 1;
    return rundePreis(ep().umlageAnteil * teil * pflichtSumme() * (Z.umlageHalb ? 0.5 : 1));
  }

  function handlohnBetrag() {
    return rundePreis(ep().handlohnAnteil * pflichtSumme() * (Z.handlohnHalb ? 0.5 : 1));
  }

  /* ----------------------------------------------------------------------
     DIE BIERORDNUNG — das Einkommen je Fass. Sie steigt in Jahrzehnten.
     Der Aufschlag ist alles, was das Haus selbst dazugebaut hat.
     ---------------------------------------------------------------------- */
  function ordnung() {
    var l = ep().ordnung, treffer = l[0];
    for (var i = 0; i < l.length; i++) if (jahr() >= l[i].ab) treffer = l[i];
    return treffer;
  }

  function setzeBierpreis() {
    var o = ordnung();
    B.welt.haus.preis = o.preis * (1 + Z.aufschlag);
    return B.welt.haus.preis;
  }

  /* ----------------------------------------------------------------------
     BUCHEN. Was nicht bezahlt werden kann, wird angeschrieben — als Zahl,
     nicht als Drohung.
     ---------------------------------------------------------------------- */
  /* Was die Kasse traegt, wird bezahlt; der Rest wird angeschrieben. Kein
     Alles-oder-nichts — sonst wuerde ein einziges mageres Jahr das Haus in
     eine Schuldenspirale kippen, aus der es nicht zurueckfindet. */
  function buche(betrag, name, art) {
    betrag = Math.round(betrag);
    if (betrag <= 0) return true;
    var kasse = Math.max(0, Math.floor(B.welt.haus.kasse));
    if (kasse >= betrag) {
      B.welt.zahle(betrag, name, 'spieler');
      Z.rechnung.push({ name: name, betrag: -betrag, art: art || 'pflicht' });
      return true;
    }
    if (kasse > 0) B.welt.zahle(kasse, name + ' (Teilzahlung)', 'spieler');
    var rest = betrag - kasse;
    Z.rueckstand += rest;
    Z.rechnung.push({ name: name, betrag: -betrag, art: art || 'pflicht', offen: rest });
    return false;
  }

  function loese(betrag, name, art) {
    betrag = Math.round(betrag);
    if (betrag <= 0) return;
    B.welt.nimm(betrag, name, 'spieler');
    Z.rechnung.push({ name: name, betrag: betrag, art: art || 'ertrag' });
  }

  /* ----------------------------------------------------------------------
     BINDUNGEN — der Vertrag, der aus Gunst Recht macht.
     ---------------------------------------------------------------------- */
  function bindeHaeuser(n, jahre) {
    var frei = B.welt.adressenJetzt().filter(function (a) {
      return !a.bindung || a.bindung.wem !== 'haus';
    }).sort(function (a, b) { return b.bedarf - a.bedarf; });
    var namen = [];
    for (var i = 0; i < n && i < frei.length; i++) {
      B.welt.binde(frei[i].schluessel, 'haus', 'Vertrag', jahr() + jahre);
      namen.push(frei[i].name);
    }
    return namen;
  }

  function nimmPfand() {
    var meine = B.welt.adressenJetzt().filter(function (a) {
      return a.bindung && a.bindung.wem === 'haus';
    });
    var a = meine.length ? meine[meine.length - 1] : B.welt.adressenJetzt()[0];
    if (!a) return null;
    B.welt.binde(a.schluessel, 'adler', 'Pfand', jahr() + 5);
    B.welt.protokolliere({ wer: 'gegner', was: a.name + ' als Pfand für den Anschlag — fünf Jahre beim Adler',
      preis: 0, adresse: a.schluessel });
    return a.name;
  }

  /* ----------------------------------------------------------------------
     WIRKUNG EINES BAUS ODER EINER FESTLEGUNG
     ---------------------------------------------------------------------- */
  function wende(quelle, w) {
    if (!w) return;
    if (w.ertrag) Z.ertraege.push({ k: quelle.k, name: quelle.name, betrag: w.ertrag });
    if (w.rohstoff) Z.rohstoffe.push({ k: quelle.k, name: quelle.name, menge: w.rohstoff });
    if (w.plaetze) B.welt.vorrat.plaetze += w.plaetze;
    if (w.ansehen) B.welt.haus.ansehen += w.ansehen;
    if (w.preis) {
      if (!(Z.preisDeckel && w.preis > 0)) Z.aufschlag = B.rund(Z.aufschlag + w.preis, 4);
    }
    if (w.pflichtWeg) Z.pflichtWeg[w.pflichtWeg] = true;
    if (w.pflichtNeu) Z.pflichtNeu.push(w.pflichtNeu);
    if (w.handlohnWeg) Z.handlohnWeg = true;
    if (w.handlohnHalb) Z.handlohnHalb = true;
    if (w.umlageHalb) Z.umlageHalb = true;
    if (w.preisDeckel) Z.preisDeckel = true;
    if (w.wachstumsdeckel) Z.wachstumsdeckel = true;
    if (w.bindung) {
      var namen = bindeHaeuser(w.bindung.n, w.bindung.jahre);
      if (namen.length) {
        B.welt.schreibe(quelle.name + ': ' + namen.join(', ') + ' nehmen bis '
          + (jahr() + w.bindung.jahre) + ' nur Bier dieses Hauses.', 'preis');
      }
    }
    /* Der Zufluss ist ein Vielfaches der JAHRESLAST, nicht des Anschlags —
       sonst schwemmt eine einzige Festlegung die ganze Partie weg. */
    if (w.einmal) loese(rundePreis(w.einmal * pflichtSumme()), quelle.name + ' — Zufluss', 'zufluss');
    setzeBierpreis();
  }

  /* ----------------------------------------------------------------------
     DIE EIGENE CHRONIK — append only. Nichts wird je entfernt.
     ---------------------------------------------------------------------- */
  function chronik(art, text, dick) {
    Z.chronik.push({
      jahr: jahr(), art: art, text: text, dick: !!dick,
      amtszeit: amtszeit().name, nr: amtszeit().nr
    });
  }

  /* ======================================================================
     MICHAELI — der Zeitpunkt.
     ====================================================================== */
  function michaeli(erste) {
    var e = ep();
    Z.rechnung = [];
    Z.tafelJahr = jahr();

    /* 1. Was durch das Haus ging, und was im Haus liegt. */
    if (!erste) {
      var gemessen = messeUmsatz(jahr() - 1);
      if (gemessen > 0) Z.umsatz = gemessen;
    }
    /* Die Schaetzung folgt der Kasse nach oben sofort und nach unten langsam:
       wer einmal gross war, wird nicht im naechsten Jahr wieder billig bedient.
       Aber sie gibt nach, sonst kaeme ein verarmtes Haus nie zurueck. */
    Z.hoehe = Math.max(B.welt.haus.kasse, Z.hoehe * 0.78);
    rechneAnschlag();

    /* 2. Der Rueckstand des Vorjahres steht vorn, mit Aufschlag. Er kann sich
          nicht ins Bodenlose schrauben: was ueber eine Jahreslast hinauswaechst,
          holt sich der Rat als Pfand — dann ist die Schuld getilgt. */
    if (Z.rueckstand > 0) {
      var alt = Math.round(Z.rueckstand * 1.1);
      Z.rueckstand = 0;
      if (alt > pflichtSumme()) {
        var pfand = nimmPfand();
        Z.rechnung.push({ name: 'Rückstand getilgt durch Pfand'
          + (pfand ? ': ' + pfand : ''), betrag: 0, art: 'umlage' });
        chronik('umlage', 'Der Rückstand von ' + geld(alt) + ' ist durch ein Pfand getilgt'
          + (pfand ? ': ' + pfand + ' geht auf fünf Jahre an den Adler.' : '.'));
      } else {
        buche(alt, 'Rückstand aus dem Vorjahr, mit Aufschlag', 'rueckstand');
      }
    }

    /* 3. Die Pflichten des Jahres. Im ersten Michaeli einer Partie sind sie
          abgetragen — sonst begaenne das Spiel mit einer Schuld. */
    if (!erste) {
      pflichtenJetzt().forEach(function (p) { buche(p.betrag, p.name, 'pflicht'); });
    }

    /* 4. Was gebaut ist, traegt. Nominal — ein fester Zins wird mit den
          Jahren weniger wert, und genau das ist der Punkt. */
    Z.ertraege.forEach(function (t) { loese(t.betrag, t.name, 'ertrag'); });
    Z.rohstoffe.forEach(function (t) {
      B.welt.haus.rohstoff += t.menge;
      Z.rechnung.push({ name: t.name, betrag: 0, art: 'rohstoff', menge: t.menge });
    });

    /* 5. Die Raten der laufenden Bauten. */
    var nochOffen = [];
    Z.raten.forEach(function (r) {
      if (r.faellig > jahr()) { nochOffen.push(r); return; }
      if (buche(r.rate, 'Rate: ' + r.name, 'rate')) {
        r.offen -= 1;
        r.faellig = jahr() + 1;
        if (r.offen > 0) nochOffen.push(r);
        else fertigstellen(r.k);
      } else {
        r.faellig = jahr() + 1;
        nochOffen.push(r);
        chronik('bau', r.name + ' ruht: die Rate blieb offen. Noch ' + r.offen
          + (r.offen === 1 ? ' Rate zu ' : ' Raten zu ') + geld(r.rate) + '.');
      }
    });
    Z.raten = nochOffen;
    /* Bauten ohne Rate werden nach ihrer Bauzeit fertig. */
    Object.keys(Z.genommen).forEach(function (k) {
      var g = Z.genommen[k];
      if (!Z.fertig[k] && g.fertig <= jahr() && !hatRate(k)) fertigstellen(k);
    });

    /* 6. Der Handlohn beim Erbfall. */
    if (Z.handlohnFaellig) {
      Z.handlohnFaellig = false;
      if (!Z.handlohnWeg) {
        var h = handlohnBetrag();
        buche(h, 'Handlohn beim Erbfall an den Grundherrn', 'umlage');
        chronik('pflicht', 'Handlohn beim Erbfall: ' + geld(h) + '.');
      } else {
        Z.rechnung.push({ name: 'Handlohn beim Erbfall — entfällt (Braurecht am Haus)', betrag: 0, art: 'frei' });
      }
    }

    /* 7. Die ausserordentliche Umlage, wenn sie faellig ist. */
    var u = umlageDesJahres();
    if (u && !u.bezahlt) {
      u.bezahlt = true;
      var betrag = umlageBetrag(u);
      u.betrag = betrag;
      if (!buche(betrag, u.name, 'umlage')) {
        var weg = nimmPfand();
        chronik('umlage', u.name + ' (' + geld(betrag) + ') blieb offen. '
          + (weg ? 'Pfand: ' + weg + '.' : ''));
        B.welt.schreibe(u.name + ': ' + geld(betrag) + ' blieb offen. '
          + (weg ? weg + ' geht auf fünf Jahre an den Adler.' : ''), 'preis');
      } else {
        chronik('umlage', u.name + ': ' + geld(betrag) + ' bezahlt.');
      }
    }

    /* 8. Die Bierordnung des Jahres. */
    setzeBierpreis();

    /* 9. Die Angebote dieses Michaeli. */
    waehleAngebote();

    /* 10. Die eine Zahl, aufgeschrieben, damit man sie nebeneinanderlegen kann. */
    var billig = billigstesAngebot();
    Z.leiter.push({
      jahr: jahr(),
      kasse: Math.round(B.welt.haus.kasse),
      billigst: billig ? billig.preis : 0,
      name: billig ? billig.a.name : '—',
      verhaeltnis: billig && billig.preis ? B.welt.haus.kasse / billig.preis : 0
    });
    if (Z.leiter.length > 24) Z.leiter.shift();

    Z.offen = (B.arg.roh.tafel !== 'zu') || !erste;
    Z.erzwungen = false;
    Z.seite = 'tafel';
    B.ton.spiele('preis:michaeli', { art: 'geraeusch' });
    if (!erste) B.ton.spiele('preis:muenzen', { art: 'geraeusch' });
  }

  function hatRate(k) {
    for (var i = 0; i < Z.raten.length; i++) if (Z.raten[i].k === k) return true;
    return false;
  }

  function fertigstellen(k) {
    if (Z.fertig[k]) return;
    var a = angebotVon(k);
    if (!a) { Z.fertig[k] = jahr(); return; }
    Z.fertig[k] = jahr();
    wende(a, a.wirkung);
    Z.rechnung.push({ name: a.name + ' — fertig', betrag: 0, art: 'fertig' });
    chronik('bau', a.name + ' steht. ' + a.satz);
    B.welt.schreibe(a.name + ' ist fertig. ' + a.satz, 'preis');
    B.ton.spiele('preis:fertig', { art: 'geraeusch' });
  }

  /* ----------------------------------------------------------------------
     DIE UMLAGEN — ausserordentlich, angekuendigt, unausweichlich.
     Sie sind der Grund, warum es Jahre gibt, in denen Nichtnehmen die
     richtige Antwort ist. Die Tafel sagt das nicht; sie zeigt nur das Datum.
     ---------------------------------------------------------------------- */
  function planeUmlagen() {
    var e = ep();
    Z.umlagen = [];
    var j = Z.startjahr;
    for (var i = 0; i < e.abstaende.length; i++) {
      j += e.abstaende[i];
      var vorlage = e.umlagen[i % e.umlagen.length];
      Z.umlagen.push({ jahr: j, name: vorlage.name, sagt: vorlage.sagt,
        teil: vorlage.teil || 1, bezahlt: false, betrag: 0 });
    }
  }

  function umlageDesJahres() {
    for (var i = 0; i < Z.umlagen.length; i++) if (Z.umlagen[i].jahr === jahr()) return Z.umlagen[i];
    return null;
  }

  function kommendeLasten() {
    var l = [];
    Z.umlagen.forEach(function (u) {
      if (u.jahr < jahr() || u.bezahlt) return;
      l.push({ jahr: u.jahr, name: u.name, sagt: u.sagt, betrag: umlageBetrag(u), art: 'umlage' });
    });
    /* Der Erbfall steht im Kalender: die Amtszeit hat ein Ende. */
    if (!Z.handlohnWeg && amtszeit().bis && amtszeit().bis > jahr()) {
      l.push({
        jahr: amtszeit().bis, name: 'Handlohn beim Erbfall',
        sagt: amtszeit().name + ' führt das Haus seit ' + amtszeit().seit + '.',
        betrag: handlohnBetrag(),
        art: 'erbfall'
      });
    }
    /* Die Raten laufender Bauten. */
    Z.raten.forEach(function (r) {
      l.push({ jahr: r.faellig, name: 'Rate: ' + r.name, sagt: r.offen + ' Raten offen',
        betrag: r.rate, art: 'rate' });
    });
    l.sort(function (a, b) { return a.jahr - b.jahr; });
    return l.slice(0, 6);
  }

  /* ----------------------------------------------------------------------
     DIE AUSWAHL DES JAHRES
     ---------------------------------------------------------------------- */
  function offeneAngebote() {
    return ep().angebote.filter(function (a) {
      if (Z.genommen[a.k] || Z.gesperrt[a.k]) return false;
      if (a.ab && jahr() < a.ab) return false;
      if (a.bis && jahr() > a.bis) return false;
      return true;
    }).sort(function (x, y) { return x.anteil - y.anteil; });
  }

  /* Wer schliesst wen aus — in BEIDEN Richtungen. Ein Paar darf nie halb auf
     dem Tisch liegen, sonst sieht man den Preis, aber nicht die Gabelung. */
  function partnerVon(k) {
    var l = [];
    var a = angebotVon(k);
    if (a && a.sperrt) a.sperrt.forEach(function (s) { if (l.indexOf(s) < 0) l.push(s); });
    ep().angebote.forEach(function (o) {
      if (o.sperrt && o.sperrt.indexOf(k) >= 0 && l.indexOf(o.k) < 0) l.push(o.k);
    });
    return l;
  }

  function waehleAngebote() {
    var offen = offeneAngebote();
    var wieViele = D.angeboteJeJahr || 4;
    if (offen.length <= wieViele + 1) {
      Z.angebote = offen.map(function (a) { return a.k; });
      return;
    }
    var frei = {};
    offen.forEach(function (a) { frei[a.k] = true; });

    /* Immer das billigste (die Einstiegssprosse) und das groesste (das Ziel,
       auf das man spart). Dazwischen entscheidet der gesaete Wuerfel — mit
       derselben Saat dieselbe Tafel. */
    var wahl = [offen[0].k, offen[offen.length - 1].k];
    function drin(k) { return wahl.indexOf(k) >= 0; }

    /* Und immer wenigstens EINE Gabelung: zwei Angebote, die einander
       ausschliessen, nebeneinander. Ohne sie waere die Reihe eine Preisliste
       und keine Entscheidung. */
    var mitte = B.wuerfel.misch(offen.slice(1, offen.length - 1));
    var paar = null, i, g;
    for (i = 0; i < mitte.length && !paar; i++) {
      g = partnerVon(mitte[i].k).filter(function (k) { return frei[k]; });
      if (g.length) paar = [mitte[i].k, g[0]];
    }
    if (!paar) {
      for (i = 0; i < wahl.length && !paar; i++) {
        g = partnerVon(wahl[i]).filter(function (k) { return frei[k]; });
        if (g.length) paar = [wahl[i], g[0]];
      }
    }
    if (paar) paar.forEach(function (k) { if (!drin(k)) wahl.push(k); });

    for (i = 0; i < mitte.length && wahl.length < wieViele + 1; i++) {
      if (!drin(mitte[i].k)) wahl.push(mitte[i].k);
    }
    /* nach Preis sortiert nebeneinanderlegen */
    wahl.sort(function (x, y) {
      return angebotVon(x).anteil - angebotVon(y).anteil;
    });
    Z.angebote = wahl;
  }

  /* Was heute noch zu haben ist: nicht genommen, nicht durch eine andere
     Entscheidung desselben Tages ausgeschlossen. */
  function lebendeAngebote() {
    return Z.angebote.filter(function (k) { return !Z.genommen[k] && !Z.gesperrt[k]; });
  }

  /* Wer heute etwas genommen hat, soll nicht auf eine leere Reihe sehen. Es
     rueckt nach — aber nur bis zur Zahl des Tages, und nie mehr als sieben
     Karten nebeneinander. Nachgerueckt wird die naechste Sprosse nach oben,
     nicht ein Geschenk: das Nachgerueckte kostet ebenfalls. */
  function nachruecken() {
    var wieViele = D.angeboteJeJahr || 4;
    for (var runde = 0; runde < 3; runde++) {
      if (lebendeAngebote().length >= wieViele) return;
      if (Z.angebote.length >= 7) return;
      var haben = {};
      Z.angebote.forEach(function (k) { haben[k] = true; });
      var frei = offeneAngebote().filter(function (a) { return !haben[a.k]; });
      if (!frei.length) return;
      Z.angebote.push(frei[0].k);
    }
  }

  function billigstesAngebot() {
    var best = null;
    lebendeAngebote().forEach(function (k) {
      var a = angebotVon(k);
      if (!a) return;
      var p = zahlplan(a).jetzt;
      if (!best || p < best.preis) best = { a: a, preis: p };
    });
    return best;
  }

  /* ----------------------------------------------------------------------
     NEHMEN
     ---------------------------------------------------------------------- */
  function nimm(a) {
    if (B.welt.zeit.woche !== 1) return;
    /* Zweimal dasselbe gibt es nicht, und was heute ausgeschlossen wurde,
       ist heute ausgeschlossen — sonst waeren Ochse und Gaul beide zu haben. */
    if (Z.genommen[a.k] || Z.gesperrt[a.k]) return;
    var plan = zahlplan(a);
    if (!B.welt.zahle(plan.jetzt, a.name + (a.bauzeit ? ' — Anzahlung' : ''), 'spieler')) return;

    Z.genommen[a.k] = { jahr: jahr(), name: a.name, preis: plan.ganz,
                        fertig: jahr() + (a.bauzeit || 0) };
    Z.kaeufe += 1;
    if (a.sperrt) {
      a.sperrt.forEach(function (k) { Z.gesperrt[k] = a.k; });
    }
    if (a.bauzeit && plan.rate > 0) {
      Z.raten.push({ k: a.k, name: a.name, rate: plan.rate, offen: plan.raten, faellig: jahr() + 1 });
      chronik('bau', a.name + ' begonnen für ' + geld(plan.ganz)
        + ' — ' + geld(plan.jetzt) + ' angezahlt, ' + plan.raten
        + (plan.raten === 1 ? ' Rate zu ' : ' Raten zu ') + geld(plan.rate)
        + ', fertig ' + (jahr() + a.bauzeit) + '.');
      B.welt.schreibe(a.name + ' wird gebaut. Fertig zu Michaeli ' + (jahr() + a.bauzeit) + '.', 'preis');
    } else {
      chronik('bau', a.name + ' genommen für ' + geld(plan.ganz) + '.');
      fertigstellen(a.k);
    }
    Z.meldung = a.name + ' — ' + geld(plan.jetzt) + ' aus der Kasse.';
    nachruecken();
    B.ton.spiele('preis:handschlag', { art: 'geraeusch' });
    B.sende('zeichne', { grund: 'preis-genommen' });
  }

  /* ----------------------------------------------------------------------
     DIE FESTLEGUNG. Eine je Amtszeit. Danach steht sie in der Chronik und
     laesst sich mit keinem Klick zurueckholen.
     ---------------------------------------------------------------------- */
  function festlegungOffen() {
    return !Z.festAmtszeit[amtszeit().nr];
  }

  function festlegungen() {
    return ep().festlegungen.filter(function (f) {
      if (Z.festGenommen[f.k]) return false;
      if (f.ab && jahr() < f.ab) return false;
      return true;
    });
  }

  /* Eine Festlegung ist ein Rechtsakt, kein Kostenvoranschlag. Ihre Taxe haengt
     an der Zeit, nicht am Vermoegen des Hauses — sonst waere sie fuer ein
     wachsendes Haus nie erreichbar, weil sie mit der Kasse mitwuechse. */
  function festBasis() {
    var e = ep();
    return e.grund * Math.pow(e.teuerungJahr, B.grenze(jahr() - Z.startjahr, 0, 40));
  }

  function festPreis(f) { return f.anteil ? rundePreis(f.anteil * festBasis()) : 0; }

  function festlege(f) {
    if (B.welt.zeit.woche !== 1) return;
    if (!festlegungOffen() || Z.festGenommen[f.k]) return;
    var preis = festPreis(f);
    if (preis > 0 && !B.welt.zahle(preis, 'Festlegung: ' + f.name, 'spieler')) return;

    Z.festGenommen[f.k] = { jahr: jahr(), amtszeit: amtszeit().name, nr: amtszeit().nr, preis: preis };
    Z.festAmtszeit[amtszeit().nr] = f.k;
    wende(f, f.wirkung);

    chronik('festlegung', f.name + ' — ' + f.regel, true);
    B.welt.schreibe('FESTLEGUNG ' + jahr() + ', ' + amtszeit().name + ': ' + f.name
      + '. ' + f.regel + ' Das ist nicht zurückzunehmen.', 'festlegung');
    B.welt.protokolliere({ wer: 'spieler', was: 'Festlegung: ' + f.name + ' (unabänderlich)', preis: 0 });
    Z.meldung = 'Festgelegt: ' + f.name + '. Es steht in der Chronik.';
    B.ton.spiele('preis:siegel', { art: 'geraeusch' });
    B.sende('zeichne', { grund: 'preis-festlegung' });
  }

  /* ======================================================================
     ZEICHNEN
     ====================================================================== */

  function zeile(mark, wert, klasse) {
    var z = B.el('div', 'pr-zeile' + (klasse ? ' ' + klasse : ''));
    z.appendChild(B.el('span', 'pr-was', mark));
    z.appendChild(B.el('span', 'pr-zahl', wert));
    return z;
  }

  function folgeText(a) {
    var w = a.wirkung || {};
    var t = [];
    if (w.ertrag) t.push('+' + geld(w.ertrag) + ' in jedem Michaeli');
    if (w.rohstoff) t.push('+' + B.zahl(w.rohstoff) + ' ' + B.welt.epoche().rohstoff + ' im Jahr');
    if (w.plaetze) t.push('+' + B.welt.menge(w.plaetze) + ' Lagerplatz');
    if (w.preis) t.push((w.preis > 0 ? '+' : '') + B.zahl(w.preis * 100, 0) + ' im Hundert je '
      + ep().einheit);
    if (w.ansehen) t.push((w.ansehen > 0 ? '+' : '') + w.ansehen + ' Ansehen');
    if (w.pflichtWeg) t.push('kein ' + pflichtName(w.pflichtWeg) + ' mehr');
    if (w.bindung) t.push(w.bindung.n + ' Häuser gebunden, ' + w.bindung.jahre + ' Jahre');
    return t.join(' · ');
  }

  function pflichtName(k) {
    var l = ep().pflichten;
    for (var i = 0; i < l.length; i++) if (l[i].k === k) return l[i].name;
    for (var j = 0; j < Z.pflichtNeu.length; j++) if (Z.pflichtNeu[j].k === k) return Z.pflichtNeu[j].name;
    return k;
  }

  /* --- Spalte 1: die Rechnung des Jahres ------------------------------- */
  function spalteRechnung() {
    var e = ep();
    var sp = B.el('div', 'pr-spalte pr-links');

    var kasten = B.el('div', 'pr-feld');
    kasten.appendChild(B.el('h3', null, 'DIE RECHNUNG ' + jahr()));
    if (!Z.rechnung.length) {
      kasten.appendChild(B.el('div', 'pr-satz',
        'Zu diesem Michaeli war nichts abzutragen. Ab Michaeli ' + (jahr() + 1) + ' laufen:'));
      pflichtenJetzt().forEach(function (p) {
        kasten.appendChild(zeile(p.name, geld(-p.betrag), 'pr-pflicht'));
      });
      kasten.appendChild(zeile('Zusammen im Jahr', geld(-pflichtSumme()), 'pr-summe'));
      kasten.appendChild(B.el('div', 'pr-satz pr-klein',
        'Sie richten sich nach dem Umsatz des Vorjahres und nach dem, was in der Kasse liegt.'));
    } else {
      /* Ein Plus vor dem Zufluss. Ohne es steht der Ertrag eines Baus in
         derselben Spalte wie eine Abgabe und liest sich wie eine. */
      var summe = 0;
      Z.rechnung.forEach(function (r) {
        var wert = r.betrag
          ? (r.betrag > 0 ? '+' + geld(r.betrag) : geld(r.betrag))
          : (r.menge ? '+' + B.zahl(r.menge) + ' ' + B.welt.epoche().rohstoff : '—');
        var z = zeile(r.name, wert, 'pr-' + r.art + (r.offen ? ' pr-offen' : ''));
        if (r.offen) z.appendChild(B.el('span', 'pr-marke', 'offen ' + geld(r.offen)));
        kasten.appendChild(z);
        summe += r.betrag;
      });
      kasten.appendChild(zeile('Zusammen', (summe > 0 ? '+' : '') + geld(summe), 'pr-summe'));
    }
    sp.appendChild(kasten);

    var ord = B.el('div', 'pr-feld pr-ordnung');
    ord.appendChild(B.el('h3', null, 'DIE BIERORDNUNG'));
    var o = ordnung();
    ord.appendChild(zeile('Satz je ' + e.einheit, geld(Math.round(o.preis * (1 + Z.aufschlag))), 'pr-gross'));
    ord.appendChild(B.el('div', 'pr-satz', o.sagt));
    ord.appendChild(B.el('div', 'pr-satz pr-klein',
      (jahr() - o.ab <= 0 ? 'In diesem Jahr gesetzt. '
        : 'Gesetzt ' + o.ab + ' — seit ' + (jahr() - o.ab) + ' Jahren unverändert. ')
      + (Z.aufschlag ? 'Aufschlag des Hauses: ' + B.zahl(Z.aufschlag * 100, 0) + ' im Hundert.'
                     : 'Das Haus hat noch keinen Aufschlag erarbeitet.')));
    sp.appendChild(ord);

    var an = B.el('div', 'pr-feld pr-anschlag');
    an.appendChild(B.el('h3', null, 'DER ANSCHLAG'));
    an.appendChild(zeile('Für ' + jahr(), geld(Math.round(Z.anschlag)), 'pr-gross'));
    var ausUmsatz = umsatzGewicht() * Z.umsatz;
    var ausKasse = ausBarschaft();
    an.appendChild(zeile('aus dem Umsatz des Vorjahrs', geld(Math.round(ausUmsatz))));
    an.appendChild(zeile('aus der Barschaft', geld(Math.round(ausKasse))));
    if (ausUmsatz + ausKasse < e.grund) {
      an.appendChild(zeile('Mindestansatz dieser Zeit', geld(e.grund), 'pr-umlage'));
    }
    if (Z.kaeufe) an.appendChild(zeile('Aufschlag für ' + Z.kaeufe + ' gebaute Sachen',
      '+' + B.zahl((Math.pow(ep().teuerungKauf, Z.kaeufe) - 1) * 100, 0) + '%'));
    an.appendChild(zeile('Teuerung seit ' + Z.startjahr,
      '+' + B.zahl((Math.pow(ep().teuerungJahr, B.grenze(jahr() - Z.startjahr, 0, 40)) - 1) * 100, 0) + '%'));
    an.appendChild(B.el('div', 'pr-satz pr-klein', e.anschlagSatz));
    sp.appendChild(an);

    /* Was schon steht — die Entscheidungen frueherer Michaelitage, in Zahlen. */
    var st = B.el('div', 'pr-feld pr-bestand');
    st.appendChild(B.el('h3', null, 'WAS SCHON STEHT'));
    var etwas = false;
    Object.keys(Z.fertig).forEach(function (k) {
      var a = angebotVon(k);
      var name = a ? a.name : (Z.genommen[k] ? Z.genommen[k].name : null);
      if (!name) return;
      etwas = true;
      var z = B.el('div', 'pr-bestand-zeile');
      z.appendChild(B.el('span', 'pr-bestand-jahr', Z.fertig[k]));
      z.appendChild(B.el('span', 'pr-bestand-name', name));
      st.appendChild(z);
    });
    Z.raten.forEach(function (r) {
      etwas = true;
      var z = B.el('div', 'pr-bestand-zeile pr-imbau');
      z.appendChild(B.el('span', 'pr-bestand-jahr', 'im Bau'));
      z.appendChild(B.el('span', 'pr-bestand-name',
        r.name + ' — noch ' + r.offen + ' × ' + geld(r.rate)));
      st.appendChild(z);
    });
    if (!etwas) {
      /* Auch das Erbe ist eine Bilanz, keine leere Fläche: was die Vorfahren
         hinterlassen haben, steht in denselben Zahlen wie alles Spätere. */
      st.appendChild(B.el('div', 'pr-satz', 'Von heute an nichts. Was die Vorfahren hinterlassen haben:'));
      st.appendChild(zeile('Lagerplatz im Keller', B.welt.menge(B.welt.vorrat.plaetze)));
      st.appendChild(zeile('Sud in der Woche', B.zahl(B.welt.haus.sudJeWoche)));
      st.appendChild(zeile('Braurecht', e.rechtSatz));
      st.appendChild(zeile('Ansehen in der Stadt', B.zahl(B.welt.haus.ansehen)));
      st.appendChild(B.el('div', 'pr-satz pr-klein',
        'Was von heute an dazukommt, steht hier und trägt in jedem Michaeli.'));
    } else {
      var ertragSumme = 0;
      Z.ertraege.forEach(function (t) { ertragSumme += t.betrag; });
      if (ertragSumme) st.appendChild(zeile('trägt im Jahr', geld(ertragSumme), 'pr-ertrag pr-summe'));
      st.appendChild(B.el('div', 'pr-satz pr-klein',
        Object.keys(Z.fertig).length + ' fertig · ' + Z.raten.length + ' im Bau · '
        + Object.keys(Z.gesperrt).length + ' durch eine Wahl für immer ausgeschlossen'));
    }
    sp.appendChild(st);

    return sp;
  }

  /* --- Spalte 2: die Angebote ------------------------------------------ */
  /* Eine Karte hat drei Zustaende, und alle drei stehen am Bildschirm:
     zu haben · heute genommen · durch eine andere Entscheidung ausgeschlossen.
     Kein Knopf bleibt anklickbar, der nichts mehr tut. */
  function angebotKarte(a) {
    var plan = zahlplan(a);
    var schon = Z.genommen[a.k];
    var zu = Z.gesperrt[a.k];
    var kann = B.welt.kann(plan.jetzt);
    var jetztTag = B.welt.zeit.woche === 1;

    var karte = B.el('div', 'pr-karte'
      + (schon ? ' pr-genommen' : '')
      + (zu ? ' pr-ausgeschlossen' : '')
      + (!schon && !zu && !kann ? ' pr-zuteuer' : ''));
    karte.setAttribute('data-angebot', a.k);
    if (schon) karte.setAttribute('data-genommen', schon.jahr);
    if (zu) karte.setAttribute('data-ausgeschlossen', zu);

    var kopf = B.el('div', 'pr-karte-kopf');
    kopf.appendChild(B.el('b', null, a.name));
    karte.appendChild(kopf);

    if (schon) karte.appendChild(B.el('div', 'pr-karte-stempel', 'GENOMMEN'));
    else if (zu) karte.appendChild(B.el('div', 'pr-karte-stempel pr-stempel-zu', 'AUSGESCHLOSSEN'));

    var schild = B.el('div', 'pr-schild');
    schild.appendChild(B.el('span', 'pr-schild-zahl', geld(plan.jetzt)));
    if (plan.raten) {
      schild.appendChild(B.el('span', 'pr-schild-rest',
        'von ' + geld(plan.ganz) + ' · dann ' + plan.raten + ' × ' + geld(plan.rate)));
    } else {
      schild.appendChild(B.el('span', 'pr-schild-rest', 'ganz, sofort'));
    }
    karte.appendChild(schild);

    karte.appendChild(B.el('div', 'pr-bauzeit', a.bauzeit
      ? 'Bauzeit ' + a.bauzeit + ' Jahr' + (a.bauzeit > 1 ? 'e' : '') + ' · fertig ' + (jahr() + a.bauzeit)
      : 'Ohne Bauzeit · wirkt ab heute'));

    karte.appendChild(B.el('div', 'pr-was-text', a.was));
    var f = B.el('div', 'pr-folge');
    f.appendChild(B.el('span', 'pr-folge-marke', 'Folge'));
    f.appendChild(B.el('span', 'pr-folge-text', folgeText(a) || a.satz));
    karte.appendChild(f);
    karte.appendChild(B.el('div', 'pr-satz-klein', a.satz));

    if (a.sperrt && a.sperrt.length) {
      var namen = a.sperrt.map(function (k) {
        var o = angebotVon(k); return o ? o.name : k;
      }).join(', ');
      karte.appendChild(B.el('div', 'pr-sperrt', 'Schließt aus: ' + namen));
    }

    if (schon) {
      karte.appendChild(B.el('div', 'pr-hinweis pr-hinweis-oben',
        (a.bauzeit && !Z.fertig[a.k])
          ? 'Angezahlt zu Michaeli ' + schon.jahr + '. Im Bau bis ' + schon.fertig + '.'
          : 'Genommen zu Michaeli ' + schon.jahr + ' für ' + geld(schon.preis) + '.'));
      karte.appendChild(B.knopf({
        text: (a.bauzeit && !Z.fertig[a.k]) ? 'Im Bau' : 'Steht am Hof',
        zug: 'preis:steht:' + a.k,
        aus: true,
        klasse: 'pr-nehmen',
        titel: 'Genommen ist genommen. Es gibt keinen zweiten Klick.'
      }));
      return karte;
    }

    if (zu) {
      var durch = angebotVon(zu);
      karte.appendChild(B.el('div', 'pr-hinweis pr-hinweis-oben',
        'Ausgeschlossen durch: ' + (durch ? durch.name : zu) + '.'));
      karte.appendChild(B.knopf({
        text: 'Ausgeschlossen',
        zug: 'preis:zu:' + a.k,
        aus: true,
        klasse: 'pr-nehmen',
        titel: 'Das eine schließt das andere aus. Diese Zeit bietet es nicht noch einmal an.'
      }));
      return karte;
    }

    if (!kann) karte.appendChild(B.el('div', 'pr-hinweis pr-hinweis-oben',
      'Über der Kasse: es fehlen ' + geld(plan.jetzt - B.welt.haus.kasse) + '.'));

    karte.appendChild(B.knopf({
      text: jetztTag ? 'Nehmen' : 'Michaeli ist vorüber',
      zug: 'preis:nimm:' + a.k,
      preis: -plan.jetzt,
      klasse: 'pr-nehmen',
      aus: !kann || !jetztTag,
      titel: a.name + ' — ' + a.was + '  ' + (folgeText(a) || ''),
      tu: function () { nimm(a); }
    }));

    return karte;
  }

  function festKarte(f) {
    var preis = festPreis(f);
    var offen = festlegungOffen();
    var kann = preis === 0 || B.welt.kann(preis);
    var jetztTag = B.welt.zeit.woche === 1;

    var karte = B.el('div', 'pr-fest' + (offen ? '' : ' pr-fest-zu'));
    karte.setAttribute('data-festlegung', f.k);
    karte.appendChild(B.el('b', 'pr-fest-name', f.name));
    karte.appendChild(B.el('div', 'pr-was-text', f.was));
    var r = B.el('div', 'pr-regel');
    r.appendChild(B.el('span', 'pr-folge-marke', 'Regel'));
    r.appendChild(B.el('span', 'pr-folge-text', f.regel));
    karte.appendChild(r);

    /* Was sie in Zahlen tut — dieselbe Zeile wie bei einem Angebot, damit
       sich beides nebeneinanderlegen laesst. */
    var fz = folgeText(f);
    if (fz) {
      var ff = B.el('div', 'pr-folge');
      ff.appendChild(B.el('span', 'pr-folge-marke', 'Folge'));
      ff.appendChild(B.el('span', 'pr-folge-text', fz));
      karte.appendChild(ff);
    }
    if (f.wirkung && f.wirkung.pflichtNeu) {
      karte.appendChild(B.el('div', 'pr-sperrt',
        'Dafür neu und für immer: ' + f.wirkung.pflichtNeu.name + '.'));
    }
    karte.appendChild(B.el('div', 'pr-satz-klein',
      'Preis dieser Amtszeit: ' + (preis ? geld(preis) : 'keine Ausgabe')
      + (amtszeit().bis ? ' · ' + amtszeit().name + ' führt das Haus bis ' + amtszeit().bis + '.'
                        : '')));

    if (!offen) karte.appendChild(B.el('div', 'pr-hinweis pr-hinweis-oben',
      'Diese Amtszeit hat sich bereits festgelegt. Die nächste hat wieder eine Wahl.'));
    else if (!kann) karte.appendChild(B.el('div', 'pr-hinweis pr-hinweis-oben',
      'Über der Kasse: es fehlen ' + geld(preis - B.welt.haus.kasse) + '.'));
    karte.appendChild(B.knopf({
      text: preis ? 'Festlegen' : 'Festlegen — ohne Ausgabe',
      zug: 'preis:festlege:' + f.k,
      preis: preis ? -preis : 0,
      klasse: 'pr-siegel',
      aus: !offen || !kann || !jetztTag,
      titel: 'Unabänderlich. ' + f.regel,
      tu: function () { festlege(f); }
    }));
    return karte;
  }

  function festGetroffenKarte() {
    var k = Z.festAmtszeit[amtszeit().nr];
    var g = Z.festGenommen[k];
    var f = festlegungVon(k) || { name: k, regel: '' };
    var karte = B.el('div', 'pr-fest pr-fest-getroffen');
    karte.setAttribute('data-festlegung-getroffen', k);
    karte.appendChild(B.el('div', 'pr-fest-stempel', 'UNABÄNDERLICH'));
    karte.appendChild(B.el('b', 'pr-fest-name', f.name));
    karte.appendChild(B.el('div', 'pr-regel', f.regel));
    karte.appendChild(B.el('div', 'pr-satz-klein',
      'Festgelegt zu Michaeli ' + g.jahr + ' von ' + g.amtszeit
      + (g.preis ? ' für ' + geld(g.preis) : '') + '. Steht in der Chronik.'));
    karte.appendChild(B.knopf({
      text: 'Steht in der Chronik', zug: 'preis:fest-steht', aus: true,
      titel: 'Eine Festlegung wird nicht zurückgenommen.'
    }));
    return karte;
  }

  function spalteAngebote() {
    var sp = B.el('div', 'pr-spalte pr-mitte');

    var kopf = B.el('div', 'pr-abschnitt');
    kopf.appendChild(B.el('h3', null, 'DIE ANGEBOTE ZU MICHAELI ' + Z.tafelJahr));
    var lebt = lebendeAngebote().length;
    var billig = billigstesAngebot();
    var reicht = billig && B.welt.kann(billig.preis);
    kopf.appendChild(B.el('span', 'pr-abschnitt-satz',
      Z.angebote.length + ' nebeneinander, ' + lebt + ' heute noch zu haben · Kasse '
      + geld(B.welt.haus.kasse) + ' · was hier weggeht, kommt in diesem Jahr nicht wieder'));
    sp.appendChild(kopf);

    /* Ein Michaeli, an dem die Kasse fuer nichts reicht, ist ein moeglicher
       Ausgang und kein Fehler — aber er muss dastehen, mit der Zahl daneben.
       Sonst sieht der Spieler fuenf graue Karten und liest darin nichts. */
    if (billig && !reicht) {
      var not = B.el('div', 'pr-knapp');
      not.appendChild(B.el('span', 'pr-knapp-marke', 'HEUTE NICHT'));
      not.appendChild(B.el('span', 'pr-knapp-text',
        'Die Kasse reicht für keines dieser Angebote. Das billigste — ' + billig.a.name
        + ' — kostet ' + geld(billig.preis) + ', es fehlen '
        + geld(billig.preis - Math.max(0, B.welt.haus.kasse)) + '. '
        + 'Wer nichts nimmt, behält die Kasse für Michaeli ' + (Z.tafelJahr + 1) + '; '
        + 'der Anschlag steigt bis dahin um ' + B.zahl((ep().teuerungJahr - 1) * 100, 1) + ' im Hundert.'));
      sp.appendChild(not);
    }

    var reihe = B.el('div', 'pr-reihe');
    if (!Z.angebote.length) {
      reihe.appendChild(B.el('div', 'pr-leer',
        'Für diese Zeit ist am Hof gebaut, was zu bauen war. Die nächste Zeit bringt anderes.'));
    }
    Z.angebote.forEach(function (k) {
      var a = angebotVon(k);
      if (a) reihe.appendChild(angebotKarte(a));
    });
    sp.appendChild(reihe);

    var fkopf = B.el('div', 'pr-abschnitt pr-abschnitt-fest');
    fkopf.appendChild(B.el('h3', null, 'DIE FESTLEGUNG'));
    fkopf.appendChild(B.el('span', 'pr-abschnitt-satz',
      'Eine je Amtszeit. Sie ändert eine Regel für den Rest der Partie und wird nicht zurückgenommen.'));
    sp.appendChild(fkopf);

    var freihe = B.el('div', 'pr-reihe pr-reihe-fest');
    if (!festlegungOffen()) {
      freihe.appendChild(festGetroffenKarte());
      /* Was diese Amtszeit nicht mehr waehlen kann, bleibt sichtbar. */
      festlegungen().slice(0, 2).forEach(function (f) { freihe.appendChild(festKarte(f)); });
    } else {
      var l = festlegungen();
      if (!l.length) {
        freihe.appendChild(B.el('div', 'pr-leer', 'Alle Festlegungen dieser Zeit sind getroffen.'));
      }
      l.forEach(function (f) { freihe.appendChild(festKarte(f)); });
    }
    sp.appendChild(freihe);

    return sp;
  }

  /* --- Spalte 3: was faellig wird, und die Leiter ----------------------- */
  function spalteLasten() {
    var sp = B.el('div', 'pr-spalte pr-rechts');

    var f = B.el('div', 'pr-feld');
    f.appendChild(B.el('h3', null, 'WAS FÄLLIG WIRD'));
    var lasten = kommendeLasten();
    if (!lasten.length) f.appendChild(B.el('div', 'pr-satz', 'Nichts Angekündigtes.'));
    lasten.forEach(function (l) {
      var z = B.el('div', 'pr-last pr-last-' + l.art);
      var kopf = B.el('div', 'pr-last-kopf');
      kopf.appendChild(B.el('span', 'pr-last-jahr', l.jahr === jahr() ? 'jetzt' : l.jahr));
      kopf.appendChild(B.el('span', 'pr-last-name', l.name));
      kopf.appendChild(B.el('span', 'pr-zahl', geld(l.betrag)));
      z.appendChild(kopf);
      z.appendChild(B.el('div', 'pr-satz pr-klein', l.sagt));
      f.appendChild(z);
    });
    f.appendChild(B.el('div', 'pr-satz pr-klein', ep().pfand));
    sp.appendChild(f);

    var lf = B.el('div', 'pr-feld pr-leiter');
    lf.appendChild(B.el('h3', null, 'DIE LEITER'));
    lf.appendChild(B.el('div', 'pr-satz pr-klein',
      'Barschaft zu Michaeli gegen das billigste Angebot desselben Tages.'));
    var kopfz = B.el('div', 'pr-leiter-zeile pr-leiter-kopf');
    ['Jahr', 'Kasse', 'billigstes', 'reicht'].forEach(function (t) {
      kopfz.appendChild(B.el('span', null, t));
    });
    lf.appendChild(kopfz);
    Z.leiter.slice(-9).forEach(function (r) {
      var z = B.el('div', 'pr-leiter-zeile');
      z.appendChild(B.el('span', null, r.jahr));
      z.appendChild(B.el('span', null, B.welt.geld(r.kasse, true)));
      z.appendChild(B.el('span', null, B.welt.geld(r.billigst, true)));
      z.appendChild(B.el('span', 'pr-verh', r.verhaeltnis ? B.zahl(r.verhaeltnis, 2) + '×' : '—'));
      lf.appendChild(z);
    });
    sp.appendChild(lf);

    return sp;
  }

  /* --- Die Chronik ------------------------------------------------------
     Drei Spalten, damit dieselbe Flaeche drei Fragen beantwortet:
     was ist unabaenderlich · was ist verbaut · und wie steht die Barschaft
     zum Preis des naechsten sinnvollen Zuges, ueber alle Jahre.
     ---------------------------------------------------------------------- */
  function seiteChronik() {
    var w = B.el('div', 'pr-chronik');
    w.appendChild(B.el('h3', null, 'DIE CHRONIK DES HAUSES — was nicht mehr zu ändern ist'));

    var drei = B.el('div', 'pr-chronik-drei');

    /* 1 — die Siegel und das, was sie verbaut haben */
    var links = B.el('div', 'pr-chronik-spalte');
    links.appendChild(B.el('div', 'pr-chronik-kopf', 'DIE FESTLEGUNGEN'));
    var fest = B.el('div', 'pr-chronik-fest');
    var keys = Object.keys(Z.festGenommen);
    if (!keys.length) {
      fest.appendChild(B.el('div', 'pr-satz',
        'Noch hat sich keine Amtszeit festgelegt. Jede Amtszeit hat genau eine Festlegung, '
        + 'und sie wird nicht zurückgenommen.'));
    }
    keys.sort(function (a, b) { return Z.festGenommen[a].jahr - Z.festGenommen[b].jahr; });
    keys.forEach(function (k) {
      var g = Z.festGenommen[k];
      var f = festlegungVon(k) || { name: k, regel: '' };
      var z = B.el('div', 'pr-chronik-siegel');
      z.appendChild(B.el('span', 'pr-chronik-jahr', g.jahr));
      var t = B.el('div', 'pr-chronik-text');
      t.appendChild(B.el('b', null, f.name));
      t.appendChild(B.el('div', null, f.regel));
      t.appendChild(B.el('div', 'pr-satz-klein', g.amtszeit + ', ' + g.nr + '. Amtszeit'
        + (g.preis ? ' · ' + geld(g.preis) : '') + ' · unabänderlich'));
      z.appendChild(t);
      fest.appendChild(z);
    });
    links.appendChild(fest);

    links.appendChild(B.el('div', 'pr-chronik-kopf', 'WAS DAMIT VERBAUT IST'));
    var verbaut = Object.keys(Z.gesperrt);
    if (!verbaut.length) {
      links.appendChild(B.el('div', 'pr-satz',
        'Noch ist keine Wahl getroffen, die eine andere ausschließt.'));
    }
    verbaut.forEach(function (k) {
      var weg = angebotVon(k), durch = angebotVon(Z.gesperrt[k]);
      var z = B.el('div', 'pr-chronik-verbaut');
      z.appendChild(B.el('span', 'pr-chronik-was', (weg ? weg.name : k)));
      z.appendChild(B.el('span', 'pr-satz-klein', 'weil: ' + (durch ? durch.name : Z.gesperrt[k])));
      links.appendChild(z);
    });

    /* Was noch zu haben ist — mit Taxe. Auch das gehoert in die Chronik:
       eine Festlegung ist erst dann eine Entscheidung, wenn daneben steht,
       was man statt ihrer haette nehmen koennen. */
    links.appendChild(B.el('div', 'pr-chronik-kopf', 'WAS DIESE ZEIT NOCH ANBIETET'));
    var rest = festlegungen();
    if (!rest.length) {
      links.appendChild(B.el('div', 'pr-satz', 'Alle Festlegungen dieser Zeit sind getroffen.'));
    }
    rest.forEach(function (f) {
      var z = B.el('div', 'pr-chronik-offen');
      var k1 = B.el('div', 'pr-chronik-offen-kopf');
      k1.appendChild(B.el('b', null, f.name));
      k1.appendChild(B.el('span', 'pr-zahl', festPreis(f) ? geld(festPreis(f)) : 'ohne Ausgabe'));
      z.appendChild(k1);
      z.appendChild(B.el('div', 'pr-satz-klein', f.regel));
      links.appendChild(z);
    });
    links.appendChild(B.el('div', 'pr-satz pr-klein',
      festlegungOffen()
        ? amtszeit().name + ' hat die Festlegung dieser Amtszeit noch vor sich.'
        : amtszeit().name + ' hat sich festgelegt. Die nächste Amtszeit wählt wieder — einmal.'));
    drei.appendChild(links);

    /* 2 — die laufende Rolle */
    var mitte = B.el('div', 'pr-chronik-spalte');
    mitte.appendChild(B.el('div', 'pr-chronik-kopf', 'JAHR FÜR JAHR'));
    var rolle = B.el('div', 'pr-chronik-rolle rolle');
    Z.chronik.slice().reverse().forEach(function (c) {
      var z = B.el('div', 'pr-chronik-zeile' + (c.dick ? ' dick' : ''));
      z.appendChild(B.el('span', 'pr-chronik-jahr', c.jahr));
      z.appendChild(B.el('span', 'pr-chronik-was', c.text));
      rolle.appendChild(z);
    });
    if (!Z.chronik.length) rolle.appendChild(B.el('div', 'pr-satz', 'Noch ist nichts eingetragen.'));
    mitte.appendChild(rolle);
    drei.appendChild(mitte);

    /* 3 — die eine Zahl, ueber alle Jahre */
    var rechts = B.el('div', 'pr-chronik-spalte pr-chronik-leiter');
    rechts.appendChild(B.el('div', 'pr-chronik-kopf', 'DIE LEITER — ALLE JAHRE'));
    rechts.appendChild(B.el('div', 'pr-satz pr-klein',
      'Barschaft zu Michaeli gegen das billigste Angebot desselben Tages. '
      + 'Wächst die linke Spalte schneller als die mittlere, ist das Haus fertig.'));
    var kopfz = B.el('div', 'pr-leiter-zeile pr-leiter-kopf');
    ['Jahr', 'Kasse', 'billigstes', 'reicht'].forEach(function (t) {
      kopfz.appendChild(B.el('span', null, t));
    });
    rechts.appendChild(kopfz);
    var rolle2 = B.el('div', 'pr-leiter-rolle rolle');
    Z.leiter.slice().reverse().forEach(function (r) {
      var z = B.el('div', 'pr-leiter-zeile');
      z.appendChild(B.el('span', null, r.jahr));
      z.appendChild(B.el('span', null, B.welt.geld(r.kasse, true)));
      z.appendChild(B.el('span', null, B.welt.geld(r.billigst, true)));
      z.appendChild(B.el('span', 'pr-verh', r.verhaeltnis ? B.zahl(r.verhaeltnis, 2) + '×' : '—'));
      rolle2.appendChild(z);
    });
    rechts.appendChild(rolle2);
    drei.appendChild(rechts);

    w.appendChild(drei);
    return w;
  }

  /* --- Die Tafel -------------------------------------------------------- */
  function zeichneTafel(fach) {
    var e = ep();
    var tafel = B.el('div', 'pr-tafel pr-stil-' + e.stil);
    tafel.setAttribute('data-blatt', 'michaeli');
    tafel.setAttribute('data-jahr', Z.tafelJahr);

    var kopf = B.el('div', 'pr-kopf');
    var links = B.el('div', 'pr-kopf-links');
    links.appendChild(B.el('span', 'pr-kopf-tag', 'MICHAELI ' + Z.tafelJahr));
    links.appendChild(B.el('span', 'pr-kopf-epoche', e.sagt));
    kopf.appendChild(links);

    var rechts = B.el('div', 'pr-kopf-rechts');
    rechts.appendChild(B.el('span', 'pr-kopf-kasse', 'Kasse ' + geld(B.welt.haus.kasse)));
    rechts.appendChild(B.el('span', 'pr-kopf-klein',
      amtszeit().name + ', ' + amtszeit().nr + '. Amtszeit · Anschlag ' + geld(Math.round(Z.anschlag))));
    kopf.appendChild(rechts);

    kopf.appendChild(B.knopf({
      text: Z.seite === 'chronik' ? 'Zurück zur Tafel' : 'Chronik des Hauses',
      zug: 'preis:chronik',
      klasse: 'pr-reiter',
      titel: 'Was festgelegt wurde, steht dort unabänderlich.',
      tu: function () {
        Z.seite = Z.seite === 'chronik' ? 'tafel' : 'chronik';
        B.ton.spiele('preis:blatt');
        B.sende('zeichne', { grund: 'preis-seite' });
      }
    }));
    tafel.appendChild(kopf);

    if (Z.seite === 'chronik') {
      tafel.appendChild(seiteChronik());
    } else {
      var leib = B.el('div', 'pr-leib');
      leib.appendChild(spalteRechnung());
      leib.appendChild(spalteAngebote());
      leib.appendChild(spalteLasten());
      tafel.appendChild(leib);
    }

    var fuss = B.el('div', 'pr-fuss');
    fuss.appendChild(B.el('div', 'pr-fuss-satz', e.tagSatz));
    if (Z.meldung) fuss.appendChild(B.el('div', 'pr-meldung', Z.meldung));
    fuss.appendChild(B.knopf({
      text: 'Nichts nehmen · das Geld bleibt liegen',
      zug: 'preis:nichts',
      klasse: 'pr-nichts',
      titel: 'Die Tafel geht zu, die Kasse bleibt voll. Was fällig wird, steht rechts.',
      tu: function () {
        Z.meldung = null;
        chronik('nichts', 'Zu Michaeli ' + Z.tafelJahr + ' wurde nichts genommen. Kasse: '
          + geld(B.welt.haus.kasse) + '.');
        schliesse();
      }
    }));
    fuss.appendChild(B.knopf({
      text: 'Das Jahr beginnen',
      zug: 'preis:tafel-zu',
      klasse: 'gross pr-weiter',
      titel: 'Zurück auf den Hof. Die Tafel öffnet zu Michaeli ' + (Z.tafelJahr + 1) + ' wieder.',
      tu: function () { schliesse(); }
    }));
    tafel.appendChild(fuss);

    fach.appendChild(tafel);
  }

  function schliesse() {
    Z.offen = false;
    Z.erzwungen = false;
    B.ton.spiele('preis:blatt');
    B.sende('zeichne', { grund: 'preis-zu' });
  }

  /* Der Sommerzettel der FUHRE liegt zu Michaeli oben und hat Vorrang: erst
     die Abrechnung des Sommers, dann der Tag, an dem entschieden wird. Nur
     GELESEN wird fremdes DOM, geschrieben nie. */
  function sommerLaeuft() { return !!document.querySelector('.fu-sommerblatt'); }

  /* DIE STADT haelt den Rahmen: was beim Laden schon dalag, klappt sie in
     einen Reiter der Werkbank und schneidet es mit .stadt-zugeklappt weg
     (stil/stadt.css). Fuer DEN PREIS heisst das: die Tafel steht im DOM und
     ist trotzdem nicht auf dem Tisch. Auch das nur GELESEN, nie geschrieben.
     GLAETTUNG WELLE 1: ohne diese Zeile stand beim Laden aller vier Epochen
     "Michaelitafel schließen" an einem Bildschirm, auf dem keine Tafel lag —
     der erste Klick des Spielers tat dann scheinbar nichts. */
  function tafelWeggeklappt() {
    var t = document.querySelector('.pr-tafel');
    return !!(t && t.classList.contains('stadt-zugeklappt'));
  }

  /* Was WIRKLICH auf dem Tisch liegt — nicht, was Z.offen sich wuenscht.
     Der Griff muss den sichtbaren Zustand beschriften, sonst steht dort
     "schließen", waehrend nichts zu sehen ist, und der erste Klick tut
     scheinbar nichts. */
  function tafelSichtbar() {
    return Z.offen && (!sommerLaeuft() || Z.erzwungen)
      && !Z.weggeklappt && !tafelWeggeklappt();
  }

  /* DIE STADT klappt erst einen Wimpernschlag nach dem Zeichnen zu (ihr
     Rahmen sieht im Takt nach). Wer den Griff im selben Zug beschriftet,
     schreibt deshalb immer noch "schließen". Also einmal nachsehen, nachdem
     der Rahmen dran war — und nur dann neu zeichnen, wenn sich der SICHTBARE
     Zustand wirklich geaendert hat. Das laeuft genau einmal je Aufschlag. */
  var rahmenBlick = null;
  function seheNachRahmen() {
    if (rahmenBlick) clearTimeout(rahmenBlick);
    rahmenBlick = setTimeout(function () {
      rahmenBlick = null;
      var weg = tafelWeggeklappt();
      if (weg !== !!Z.weggeklappt) {
        Z.weggeklappt = weg;
        B.sende('zeichne', { grund: 'preis-rahmen' });
      }
    }, 420);
  }

  /* --- Der Griff, wenn die Tafel zu ist --------------------------------- */
  function zeichneGriff(fach) {
    var offenZahl = lebendeAngebote().length;
    var sichtbar = tafelSichtbar();
    var wartet = !sichtbar && Z.offen && sommerLaeuft();
    var griff = B.el('div', 'pr-griff');

    griff.appendChild(B.knopf({
      text: sichtbar
        ? 'Michaelitafel schließen'
        : 'Michaelitafel ' + Z.tafelJahr + ' · ' + offenZahl + ' Angebote'
          + (wartet ? ' — liegt bereit' : ''),
      zug: 'preis:tafel',
      klasse: 'pr-griff-knopf' + (wartet ? ' pr-griff-wartet' : ''),
      titel: wartet
        ? 'Der Sommerzettel liegt oben. Die Michaelitafel wartet darunter und schlägt auf, sobald er weg ist — oder sofort, auf diesen Klick.'
        : (B.welt.zeit.woche === 1
            ? 'Heute ist Michaeli. Was hier genommen wird, wird heute genommen.'
            : 'Michaeli ist vorüber. Genommen wird zu Michaeli ' + (Z.tafelJahr + 1) + '.'),
      tu: function () {
        if (tafelSichtbar()) { Z.offen = false; Z.erzwungen = false; }
        /* Ein Klick ist eine Hand am Brett: DIE STADT laesst aufgeschlagen,
           was der Spieler selbst geholt hat. Also die Merkmarke loeschen. */
        else { Z.offen = true; Z.erzwungen = true; Z.weggeklappt = false; }
        Z.seite = 'tafel';
        B.ton.spiele('preis:blatt');
        B.sende('zeichne', { grund: 'preis-griff' });
      }
    }));

    if (sichtbar) { fach.appendChild(griff); return; }

    var stand = B.el('div', 'pr-griff-stand');
    var billig = billigstesAngebot();
    stand.appendChild(zeile('Bierordnung je ' + ep().einheit,
      geld(Math.round(ordnung().preis * (1 + Z.aufschlag)))));
    stand.appendChild(zeile('Anschlag ' + jahr(), geld(Math.round(Z.anschlag))));
    if (billig) {
      stand.appendChild(zeile('billigstes Angebot', geld(billig.preis)));
      /* "Kasse reicht" steht auch unten rechts am Zug des Kerns und meint
         dort etwas anderes. Also hier dazusagen, wofuer. Glaettung Welle 1. */
      stand.appendChild(zeile('Kasse reicht dafür',
        billig.preis ? B.zahl(B.welt.haus.kasse / billig.preis, 2) + '×' : '—', 'pr-verh'));
    }
    var naechste = kommendeLasten()[0];
    if (naechste) {
      stand.appendChild(zeile(naechste.jahr + ' · ' + naechste.name, geld(naechste.betrag), 'pr-last-zeile'));
    }
    griff.appendChild(stand);

    griff.appendChild(B.knopf({
      text: 'Chronik des Hauses · ' + Object.keys(Z.festGenommen).length + ' Festlegungen',
      zug: 'preis:chronik-auf',
      klasse: 'pr-griff-chronik',
      titel: 'Was festgelegt wurde, steht dort unabänderlich.',
      tu: function () {
        Z.offen = true;
        Z.erzwungen = true;
        Z.seite = 'chronik';
        B.ton.spiele('preis:blatt');
        B.sende('zeichne', { grund: 'preis-chronik' });
      }
    }));

    fach.appendChild(griff);
  }

  /* ======================================================================
     ANMELDUNG
     ====================================================================== */
  BRAUHAUS.stueck('preis', {

    aufbau: function () {
      B.ton.melde('preis:michaeli', { art: 'geraeusch', sagt: 'Eine einzelne Glocke, Michaelistag, Schritte auf Holz.' });
      B.ton.melde('preis:muenzen', { art: 'geraeusch', sagt: 'Münzen werden auf einen Tisch gezählt.' });
      B.ton.melde('preis:siegel', { art: 'geraeusch', sagt: 'Siegelwachs, Petschaft, Papier — die Festlegung.' });
      B.ton.melde('preis:handschlag', { art: 'geraeusch', sagt: 'Handschlag, ein Stuhl rückt, Zustimmung.' });
      B.ton.melde('preis:fertig', { art: 'geraeusch', sagt: 'Ein Bau ist fertig: Kelle, Balken, Zuruf.' });
      B.ton.melde('preis:blatt', { art: 'geraeusch', sagt: 'Ein großer Bogen Papier wird umgeschlagen.' });

      richteEin(true);
      michaeli(true);
    },

    jahr: function () {
      michaeli(false);
    },

    epoche: function () {
      richteEin(false);
    },

    erbfall: function () {
      Z.handlohnFaellig = true;
      chronik('erbfall', amtszeit().name + ' übernimmt das Haus.');
    },

    zeichne: function () {
      var fach = B.ebene('blatt', 'preis');
      B.leere(fach);

      zeichneGriff(fach);
      if (tafelSichtbar()) { zeichneTafel(fach); seheNachRahmen(); }

      /* Die eine Zahl: der naechste sinnvolle Zug dieses Stuecks. */
      var billig = billigstesAngebot();
      if (billig) B.welt.meldeZug(billig.a.name, billig.preis);
    }
  });

  /* ----------------------------------------------------------------------
     EPOCHENWECHSEL — neue Listen, neuer Anschlag, dieselbe Chronik.
     ---------------------------------------------------------------------- */
  function richteEin(erste) {
    var e = ep();
    Z.epoche = B.welt.zeit.epoche;
    Z.startjahr = jahr();
    Z.kaeufe = 0;
    Z.hoehe = Math.max(B.welt.haus.kasse, 1);
    Z.umsatz = erste ? 0 : messeUmsatz(jahr() - 1);
    Z.raten = [];
    Z.angebote = [];
    Z.meldung = null;
    rechneAnschlag();
    planeUmlagen();
    setzeBierpreis();
    if (!erste) {
      chronik('epoche', 'Eine neue Zeit: ' + B.welt.epoche().name
        + '. Die Michaelitafel trägt andere Angebote.');
    }
  }

})(BRAUHAUS);
