/* ===========================================================================
   stuecke/name.js — DER NAME.  Warum jemand mehr zahlt, als das Bier wert ist.

   BESITZSTAND: stuecke/name*.js · stil/name*.css · bild/name/** · ton/name/**
                (spiel/LIESMICH.md Regel 2, Zustaendigkeit §14)

   DIE THESE, in einem Satz:
     Ein Ruf ist langsam zu bauen und schnell zu verlieren, und solange man ihn
     hat, darf man teurer sein als der Nachbar bei gleichem Bier.

   VIER ENTSCHEIDUNGEN, DIE DIESES STUECK TRAEGT
   ---------------------------------------------------------------------------
   1 · DER RUF IST KEINE ZAHL, DIE MIR GEHOERT.
       "Marke ist eine Zahl, die jemand anders haelt — und wieder einziehen
       kann" (design/feedback/persona-markenstrategin.md). Deshalb steht der
       Ruf hier NICHT als Punktekonto, das man auflaedt, sondern als REGISTER
       fremder Urteile: datiert, nur wachsend, nichts loeschbar. Ein neues
       schweres Urteil KNIPST AELTERE GUTE AUS — sie bleiben durchgestrichen
       stehen. Das ist die Asymmetrie, die eine Zahl nicht abbilden kann.

   2 · DER NAME SCHREIBT KEINEN PREIS (WELLE-2.md, Zustaendigkeit §14) —
       ABER ER BUCHT SEIN EIGENES AUFGELD.
       Er legt vier NEUE Felder an, die sonst niemand beschreibt, und zwar dort,
       wo DER PREIS sie ohne Umweg lesen kann:

           B.welt.haus.ruf           0..100
           B.welt.haus.rufBekannt    0..100   wie weit der Name reicht
           B.welt.haus.rufDeckung    0..100   ob er gedeckt ist
           B.welt.haus.rufAufschlag  0..0,32  was er am Preis wert ist

       welt.haus.preis gehoert DEM PREIS und wird hier NICHT angefasst. In
       Runde 1 hiess das: der Ruf kostete Geld und bewegte keines, weil die
       eine Zeile in preis.js fehlt. Behoben ohne fremde Datei — DAS AUFGELD:

         Sobald DIE FUHRE eine Lieferung verbucht (Protokoll, fremde Zeile,
         nur gelesen), legt DER NAME das Aufgeld darauf und nimmt es SELBST
         ueber die oeffentliche API ein:  B.welt.nimm(betrag, 'Aufgeld …').
         Das ist Geld herein, keine Abgabe; der Deckel aus §4 bleibt unberuehrt.
         Es ist eine eigene, benannte Buchung — kein Schreiben in ein fremdes
         Zahlenfeld. Jede steht im Reiter DAS AUFGELD mit Datum, Adresse,
         Rechnung, Satz und Betrag.

       Bekommt preis.js eines Tages doch seine Zeile, setzt es
       `welt.haus.rufAufschlagGelesen = true` — dann hoert DER NAME sofort auf
       zu buchen, und nichts steht zweimal in der Kasse.

   3 · KEIN NEUES GELD AUS DER KASSE (Zustaendigkeit §4, Deckel 18 %).
       Dieses Stueck hat KEINE Abgabe und KEINEN automatischen Abzug. Jeder
       Pfennig, den es kostet, haengt an einem angeklickten Knopf. Ein Name
       kostet hier Zeit (Bekanntheit waechst hoechstens 0,9 in der Woche),
       Aufmerksamkeit und Gelegenheit — nicht eine neue Abgabe.

   4 · ES DARF KEINEN ZUSTAND GEBEN, AUS DEM HERAUS KEIN ZUG MEHR ETWAS
       AENDERT.  In jeder Epoche gibt es mindestens einen Zug, der KEIN GELD
       KOSTET und den Zustand aendert (Zeiger aus- und einziehen, Schild
       abnehmen, Auflage einstellen, Etat streichen). Bei leerer Kasse ist
       DER NAME also immer noch bedienbar. `pruefeLebendig()` unten misst das
       zur Laufzeit und schreibt es in BRAUHAUS.ruf.lebendig().

   ORTSMARKEN: alles, was dieses Stueck auf die Platte setzt, traegt
   data-frei="name" (Zustaendigkeit §10) — vollstaendig, nicht halb.
   =========================================================================== */

(function (B) {
  'use strict';

  if (!B) return;

  var ICH = 'name';
  var D = (typeof NAME_DATEN !== 'undefined') ? NAME_DATEN : null;

  /* ======================================================================
     0 — ZUSTAND.  Gehoert allein diesem Stueck.
     ====================================================================== */

  var Z = {
    bekannt: 5,            /* wie weit der Name reicht        0..deckel */
    deckung: 55,           /* ob er gedeckt ist               0..100    */
    register: [],          /* fremde Urteile, datiert, nur wachsend      */

    zeiger: false,         /* 1350: haengt der Bierzeiger?               */
    fest: {},              /* unwiderruflich: zunftzeichen krug warenzeichen medaille verkauft */
    krugAb: 0,             /* der Krug wirkt erst ab diesem Jahr         */
    schilder: {},          /* 1600: adresse -> true                      */
    umtrunk: {},           /* 1350: adresse -> jahr                      */
    lauf: {},              /* 1884/1970: traeger -> bis einschliesslich Jahr */
    schutzBis: 0,          /* Zunftspruch / Unterlassung laufen aus      */

    nachahmung: null,      /* {seit, epoche} — der Adler fuehrt das Zeichen */
    adlerRuf: 8,
    abwerbJahr: 0,
    gewinnJahr: 0,

    bruchWochen: 0,        /* wie lange schon unter dem Zeichen duennes Bier */
    letzteWahl: null,
    wahlWoche: -1,
    ruhe: false,           /* das Zeichen ist verdeckt — kostet Reichweite, rettet Deckung */
    rundeJahr: 0,          /* der freie Zug: einmal im Braujahr herumgehen */

    urteil: {},            /* adresse -> -20..20, was DIESER Wirt sagt   */
    kieserWoche: 0,
    schauJahr: 0,

    meldung: 'Das Haus hat einen Namen. Noch weiß ihn niemand.',
    blatt: null,           /* null | 'zeichen' | 'register' | 'aufgeld'  */
    zu: false,             /* das Rufband eingeklappt (nur Anzeige)      */
    lebendig: true,

    /* DAS AUFGELD — was der Ruf wirklich einbringt, von diesem Stueck
       selbst vereinnahmt. Kein fremdes Zahlenfeld, eine eigene Buchung. */
    buch: [],              /* {jahr, woche, wohin, rechnung, satz, betrag} */
    jeWirt: {},            /* Wirtsname -> {menge, rechnung, aufgeld}      */
    buchStand: 0,          /* Lesezeiger ins fremde Protokoll             */
    letzteRechnung: 0,     /* nr der zuletzt verbrauchten Rechnung        */
    aufgeldWoche: 0,
    aufgeldJahr: 0,
    aufgeldEpoche: 0,
    aufgeldGesamt: 0,
    aufgeldZuletzt: null
  };

  /* ======================================================================
     1 — KLEINKRAM
     ====================================================================== */

  function jahr() { return B.welt.zeit.jahr; }
  function woche() { return B.welt.zeit.woche; }
  function ep() { return B.welt.zeit.epoche; }
  function epd() { return (D && D.epochen[ep()]) || D.epochen[1]; }
  function geld(n) { return B.welt.geld(n); }
  function wjahr() { return B.uhr.WOCHEN_IM_JAHR || 30; }
  function stempel() { return jahr() * wjahr() + woche(); }

  function traegerListe() { return (D && D.traeger[ep()]) || []; }

  function traeger(k) {
    var l = traegerListe();
    for (var i = 0; i < l.length; i++) if (l[i].k === k) return l[i];
    return null;
  }

  function zaehle(fach) {
    var n = 0, k;
    for (k in fach) if (Object.prototype.hasOwnProperty.call(fach, k) && fach[k]) n++;
    return n;
  }

  /* Traegt dieser Traeger gerade? */
  function laeuft(t) {
    if (!t) return false;
    switch (t.art) {
      case 'schalter':  return !!Z.zeiger;
      case 'fest':      return !!Z.fest[t.k];
      case 'adresse':   return zaehle(t.k === 'schild' ? Z.schilder : Z.umtrunk) > 0;
      case 'jahr':      return (Z.lauf[t.k] || 0) >= jahr();
      case 'wette':     return !!Z.fest.medaille;
      case 'schutz':    return Z.schutzBis >= jahr();
      default:          return false;
    }
  }

  /* Wieviel Bekanntheit dieser Traeger beitraegt. */
  function beitrag(t) {
    if (!laeuft(t)) return 0;
    if (t.art === 'adresse') {
      var n = zaehle(t.k === 'schild' ? Z.schilder : Z.umtrunk);
      return Math.min(n, t.hoechstens || 99) * (t.reichweite || 0);
    }
    if (t.k === 'krug' && jahr() < Z.krugAb) return 0;   /* wirkt erst spaeter */
    return t.reichweite || 0;
  }

  /* ------------------------------------------------------------------
     DER ETAT — die Knappheit von 1970, und nur von 1970.
     1350 ist die Zeit knapp (drei Umtrunke je Amtszeit), 1600 die fremde
     Tuer, 1884 das Jahresende. 1970 ist es der Etat: er traegt DREI Posten.
     Wer den vierten will, stellt einen ein — der Knopf bleibt bezahlbar und
     sagt vorher, welcher es waere. So stehen die Preisschilder nebeneinander
     UND schliessen einander aus, statt grau zu werden.
     ------------------------------------------------------------------ */
  function etatPlaetze() { return epd().etat || 0; }

  function etatBelegt() {
    var n = 0;
    traegerListe().forEach(function (t) {
      if (t.art === 'jahr' && (Z.lauf[t.k] || 0) >= jahr()) n++;
    });
    return n;
  }

  function etatVoll() { return etatPlaetze() > 0 && etatBelegt() >= etatPlaetze(); }

  /* Der Posten, der bei einem vollen Etat weichen wuerde: der schwaechste. */
  function schwaechsterPosten() {
    var k = null;
    traegerListe().forEach(function (t) {
      if (t.art !== 'jahr' || (Z.lauf[t.k] || 0) < jahr()) return;
      if (!k || (t.reichweite || 0) < (k.reichweite || 0)) k = t;
    });
    return k;
  }

  function zielBekannt() {
    var s = 0;
    traegerListe().forEach(function (t) { s += beitrag(t); });
    if (Z.fest.krug && jahr() >= Z.krugAb) s += 6;        /* wirkt auch spaeter noch */
    if (Z.fest.warenzeichen && ep() >= 3) s += 5;
    if (Z.fest.medaille && ep() >= 3) s += 8;
    if (Z.nachahmung) s = s * 0.72;                      /* der Nachahmer nimmt Luft weg */
    if (Z.ruhe) s = s * 0.5;                             /* verdeckt reicht der Name halb */
    if (Z.fest.verkauft) s = Math.min(s, 40);            /* der Name gehoert nicht mehr dem Haus */
    return B.grenze(Math.round(s), 0, epd().deckel);
  }

  /* Haengt gerade irgendein Zeichen des Hauses draussen?  Das ist das
     Versprechen: erst wenn es haengt, kann es gebrochen werden. */
  function versprechen() {
    if (Z.ruhe) return false;          /* verdeckt wird nichts versprochen */
    var l = traegerListe();
    for (var i = 0; i < l.length; i++) {
      var t = l[i];
      if ((t.art === 'schalter' || t.art === 'adresse' || t.art === 'jahr') && laeuft(t)) return true;
    }
    return false;
  }

  /* Wie laut das Versprechen ist. Ein Fernsehspot ist lauter als ein
     Strohkranz — und faellt entsprechend tiefer. */
  function lautstaerke() {
    var f = 1, l = traegerListe();
    l.forEach(function (t) { if (t.laut && laeuft(t)) f = 2; });
    /* Das Zunftzeichen bindet nur, solange es eine Zunft gibt. In 1884 und
       1970 macht nicht mehr die Zunft das Versprechen laut, sondern der Druck. */
    if (ep() <= 2 && Z.fest.zunftzeichen) f = Math.max(f, 2);
    return f;
  }

  /* ------------------------------------------------------------------
     DIE GUETE DES KELLERS — was das Haus gerade WIRKLICH ausliefert.
     Frisch und von der Sorte der Epoche = gut; alt oder Notsud = duenn.
     Ein leerer Keller ist die schaerfste Form von duenn: unter einem
     ausgehaengten Zeiger heisst er, dass jemand umsonst gekommen ist.
     ------------------------------------------------------------------ */
  function guete() {
    var f = B.welt.vorrat.faesser;
    if (!f || !f.length) return 0;
    var gut = 0;
    for (var i = 0; i < f.length; i++) {
      var x = f[i];
      var h = x.haltbar || B.welt.epoche().haltbar || 8;
      var frisch = B.grenze(1 - B.welt.fassAlter(x) / h, 0, 1);
      var duenn = /kofent|nachbier|d(?:ue|ü)nn|einfach|halb|not|handelsmarke/i.test(String(x.sorte || ''))
        ? 0.3 : 1;
      gut += (0.35 + 0.65 * frisch) * duenn;
    }
    return Math.round(100 * gut / f.length);
  }

  /* Ein Versprechen bricht nur, wenn jemand es erlebt. Duennes Bier, das
     hinausgeht, bricht es immer. Ein leerer Keller bricht es nur, wenn ein
     gebundenes Haus vergeblich gewartet hat — sonst wuerde ein Haus ohne
     Kundschaft fuer etwas bestraft, das niemand gemerkt hat. */
  function enttaeuscht() {
    var l = meineAdressen();
    for (var i = 0; i < l.length; i++) {
      if (!beliefert(l[i].schluessel, 10)) return true;
    }
    return false;
  }

  function bruchGefahr() {
    if (!versprechen()) return false;
    if (guete() >= 40) return false;
    if (!B.welt.vorrat.faesser.length) return enttaeuscht();
    return true;
  }

  function ruf() { return Math.round(Z.bekannt * Z.deckung / 100); }

  function aufschlag() { return B.rund(ruf() / 100 * epd().aufschlag, 4); }

  /* ======================================================================
     1b — DAS AUFGELD.  Die Wirkung, die dieses Stueck SELBST besitzt.

     Der Satz des Stuecks heisst: solange man den Namen hat, darf man teurer
     sein als der Nachbar bei gleichem Bier. In Runde 1 stand dieser Satz als
     Zahl auf dem Band und bewegte keinen Pfennig, weil der Grundpreis DEM
     PREIS gehoert. Er gehoert ihm weiterhin — DER NAME schreibt ihn nicht.

     Stattdessen legt DER NAME das Aufgeld auf die Rechnung, die DIE FUHRE
     gerade geschrieben hat, und nimmt es als EIGENE, benannte Buchung ein.
     Gelesen wird dabei nur das Protokoll; geschrieben wird nur ueber
     B.welt.nimm(). Kein fremdes Feld, keine Abgabe, kein Automatismus, der
     dem Haus etwas wegnimmt: das Aufgeld ist nie negativ.
     ====================================================================== */

  /* Liest DER PREIS den Ruf eines Tages selbst, hoert DER NAME sofort auf zu
     buchen — sonst stuende derselbe Aufschlag zweimal in der Kasse. */
  function preisLiestSelbst() {
    return !!(B.welt.haus && B.welt.haus.rufAufschlagGelesen);
  }

  /* Der Satz, den GENAU DIESER Wirt auf die Rechnung legt. Er haengt am Ruf,
     am Urteil dieses Wirts, am eigenen Zeichen an seiner Tuer — und er ist
     null, solange das Zeichen verdeckt ist. Verdecken kostet also wirklich
     Geld, und man sieht, wieviel. */
  function satzFuer(schluessel) {
    if (preisLiestSelbst()) return 0;
    if (Z.ruhe || !versprechen()) return 0;
    var s = aufschlag();
    if (schluessel) {
      s = s * B.grenze(1 + (Z.urteil[schluessel] || 0) / 40, 0.4, 1.5);
      if (Z.schilder[schluessel] || Z.umtrunk[schluessel]) s = s * 1.15;
    }
    if (Z.nachahmung) s = s * 0.75;     /* wer dasselbe Zeichen daneben sieht, feilscht */
    return B.grenze(B.rund(s, 4), 0, epd().aufschlag);
  }

  /* Eine Rechnung der FUHRE erkennt man an ihrer eigenen Schreibweise:
     welt.menge() + ' an ' + Name des Hauses. */
  function istRechnung(p) {
    return p && p.wer === 'spieler' && p.preis > 0 && !p.misslungen
      && /^[\d.,]+ (Fass|hl) an ./.test(p.was);
  }

  function buche(wohin, adr, erloes, menge) {
    var satz = satzFuer(adr);
    var betrag = Math.round(erloes * satz);
    if (betrag <= 0) return 0;
    B.welt.nimm(betrag, epd().aufgeldWort + ' · ' + wohin + ' · '
      + B.zahl(satz * 100, 1) + ' im Hundert auf ' + geld(erloes), 'spieler');
    var e = { jahr: jahr(), woche: woche(), wohin: wohin, adr: adr || null,
      rechnung: erloes, satz: satz, betrag: betrag, ruf: ruf(), menge: menge || 0 };
    /* Was dieser Wirt insgesamt gezahlt hat — das ist die Zeile, mit der man
       "gleiches Bier, zwei Preise" nachrechnet, ohne den Quelltext zu lesen. */
    var w = Z.jeWirt[wohin] || (Z.jeWirt[wohin] = { menge: 0, rechnung: 0, aufgeld: 0 });
    w.menge += (menge || 0); w.rechnung += erloes; w.aufgeld += betrag;
    Z.buch.push(e);
    if (Z.buch.length > 120) Z.buch.shift();
    Z.aufgeldWoche += betrag;
    Z.aufgeldJahr += betrag;
    Z.aufgeldEpoche += betrag;
    Z.aufgeldGesamt += betrag;
    Z.aufgeldZuletzt = e;
    return betrag;
  }

  /* Laeuft das Protokoll von der letzten gelesenen Zeile an durch. Jede
     Rechnung wird hoechstens EINMAL verwendet (Z.letzteRechnung). */
  function kassiereAufgeld() {
    if (!B.protokoll) return 0;
    var l = B.protokoll, ende = l.length, summe = 0, i, j;
    for (i = Z.buchStand; i < ende; i++) {
      var p = l[i];
      if (!p || p.wer !== 'spieler') continue;

      /* 1 — eine gewoehnliche Fuhre: 'geliefert an X' mit Menge und Adresse.
         Die Rechnung steht unmittelbar davor. */
      if (p.menge > 0 && p.adresse && p.was.indexOf('geliefert an ') === 0) {
        var erloes = 0;
        for (j = i - 1; j >= 0 && j >= i - 3; j--) {
          if (!l[j] || l[j].nr <= Z.letzteRechnung) break;
          if (istRechnung(l[j])) { erloes = l[j].preis; Z.letzteRechnung = l[j].nr; break; }
        }
        if (erloes > 0) {
          summe += buche(p.was.replace('geliefert an ', ''), p.adresse, erloes, p.menge);
        }
        continue;
      }

      /* 2 — der Sommerabsatz der FUHRE kommt als eine Summe ohne Adresse. */
      if (p.preis > 0 && p.was.indexOf('Sommerabsatz') === 0 && p.nr > Z.letzteRechnung) {
        Z.letzteRechnung = p.nr;
        summe += buche('Sommerabsatz', null, p.preis);
      }
    }
    Z.buchStand = B.protokoll.length;
    if (summe > 0) B.ton.spiele('name:aufgeld');
    return summe;
  }

  /* ======================================================================
     2 — DAS REGISTER.  Fremde Urteile, datiert, nur wachsend.
     Ein schweres schlechtes Urteil knipst aeltere gute aus; sie bleiben
     durchgestrichen stehen. Nichts wird je entfernt.
     ====================================================================== */

  function eintrag(text, gewicht, wer, art) {
    var e = {
      jahr: jahr(), woche: woche(), wer: wer || epd().urteiler,
      text: String(text), gewicht: Math.round(gewicht), art: art || '',
      erloschen: false, erloschDurch: 0, loeschte: 0
    };

    if (gewicht < -7) {
      var wieviel = gewicht <= -18 ? 2 : 1, ausgeknipst = 0;
      for (var i = Z.register.length - 1; i >= 0 && ausgeknipst < wieviel; i--) {
        var a = Z.register[i];
        if (!a.erloschen && a.gewicht > 0) {
          a.erloschen = true;
          a.erloschDurch = Z.register.length + 1;
          Z.deckung -= a.gewicht;              /* die alte Zeile zaehlt nicht mehr */
          ausgeknipst++;
        }
      }
      e.loeschte = ausgeknipst;
    }

    Z.register.push(e);
    Z.deckung = B.grenze(Z.deckung + e.gewicht, 0, 100);
    B.welt.schreibe('Der Name des Hauses: ' + e.text, 'ruf');
    B.ton.spiele(gewicht >= 0 ? 'name:urteil-gut' : 'name:urteil-schlecht');
    return e;
  }

  function aktiveZeilen() {
    return Z.register.filter(function (e) { return !e.erloschen; });
  }

  /* ======================================================================
     3 — VEROEFFENTLICHEN.  Vier neue Felder auf welt.haus, die sonst
     niemand beschreibt. Hier steht der Ruf so, dass DER PREIS ihn liest.
     ====================================================================== */

  function veroeffentliche() {
    var h = B.welt.haus;
    if (!h) return;
    h.ruf = ruf();
    h.rufBekannt = Math.round(Z.bekannt);
    h.rufDeckung = Math.round(Z.deckung);
    h.rufAufschlag = aufschlag();
    h.rufNachbar = Math.round(Z.adlerRuf);
    h.rufMedium = epd().medium;
    /* Was der Ruf bis jetzt WIRKLICH eingebracht hat. Auch das schreibt
       sonst niemand — es ist die Gegenprobe zum Satz auf dem Band. */
    h.rufAufgeldJahr = Z.aufgeldJahr;
    h.rufAufgeldGesamt = Z.aufgeldGesamt;
  }

  /* Der Satz, den die Latte messbar macht: dasselbe Fass, zwei Preise. */
  function preisVergleich() {
    var grund = B.welt.haus.preis;
    if (!grund || !isFinite(grund)) return null;
    var einheit = (typeof PREIS_DATEN !== 'undefined' && PREIS_DATEN.epochen
      && PREIS_DATEN.epochen[ep()] && PREIS_DATEN.epochen[ep()].einheit)
      || B.welt.mengeEinheit();
    /* Auf EINE Einheit ist der Aufschlag in 1350 kleiner als ein Pfennig und
       damit unlesbar. Gezeigt wird er deshalb auf hundert Einheiten — das ist
       die Menge, in der ein Wirt bestellt, und die Zahl wird lesbar. */
    return {
      ohne: Math.round(grund * 100),
      mit: Math.round(grund * 100 * (1 + aufschlag())),
      je: Math.round(grund),
      einheit: einheit
    };
  }

  /* ======================================================================
     4 — WAS OHNE DEN SPIELER GESCHIEHT
     ====================================================================== */

  /* Hat diese Adresse in den letzten n Wochen Bier des Hauses bekommen? */
  function beliefert(schluessel, wochen) {
    var l = B.protokoll, n = l.length, jetzt = stempel();
    for (var i = n - 1; i >= 0 && i > n - 500; i--) {
      var p = l[i];
      if (p.adresse === schluessel && p.menge > 0 && p.wer === 'spieler') {
        if (jetzt - (p.jahr * wjahr() + p.woche) <= wochen) return true;
      }
    }
    return false;
  }

  function meineAdressen() {
    return B.welt.adressenJetzt().filter(function (a) {
      return a.bindung && a.bindung.wem === 'haus';
    });
  }

  /* Die Wirte reden. Wer ein Schild traegt, redet doppelt so laut. */
  function wirteReden() {
    var g = guete();
    meineAdressen().forEach(function (a) {
      if (!B.wuerfel.trifft(0.18)) return;
      var doppelt = Z.schilder[a.schluessel] ? 2 : 1;
      var alt = Z.urteil[a.schluessel] || 0;
      var neu = alt;
      if (beliefert(a.schluessel, 8) && g >= 60) neu = Math.min(20, alt + 1 * doppelt);
      else if (!beliefert(a.schluessel, 12) && versprechen()) neu = Math.max(-20, alt - 1 * doppelt);
      else if (g < 40) neu = Math.max(-20, alt - 1 * doppelt);
      Z.urteil[a.schluessel] = neu;
    });
  }

  /* Der Bierkieser des Rats — nur 1350, zweimal im Jahr, unangemeldet. */
  function bierkieser() {
    if (ep() !== 1) return;
    if (woche() !== Z.kieserWoche) return;
    Z.kieserWoche = B.wuerfel.ganz(woche() + 6, wjahr());
    var g = guete();
    if (g >= 62) eintrag(D.urteile.lob[1], 7, 'Der Rat', 'lob');
    else if (Z.zeiger) eintrag(D.urteile.tadel[1], -8 * lautstaerke(), 'Der Rat', 'tadel');
    else eintrag('Der Bierkieser war da. Der Zeiger hing nicht — er hat nichts aufgeschrieben.',
      0, 'Der Rat', 'still');
  }

  /* Das Jahresurteil der Epoche. Vier Instanzen, vier Zeitpunkte, vier
     Rechnungen — das ist die Latte "Verbliste je Epoche" auf der
     Urteilsseite. */
  function jahresurteil() {
    var g = guete(), e = ep();
    if (e === 1) return;                     /* 1350 urteilt der Kieser, nicht das Jahr */

    if (e === 2) {
      if (!versprechen()) return;
      if (g >= 58) eintrag(D.urteile.lob[2], 6, 'Die Zunftschau', 'lob');
      else eintrag(D.urteile.tadel[2], -7 * lautstaerke(), 'Die Wirte', 'tadel');
      return;
    }

    if (e === 3) {
      if (!versprechen()) return;
      if (g >= 55) eintrag(D.urteile.lob[3], 7, 'Das Wochenblatt', 'lob');
      else eintrag(D.urteile.tadel[3], -8 * lautstaerke(), 'Das Wochenblatt', 'tadel');
      return;
    }

    /* 1970: der Verbrauchertest. Er misst genau das Verhaeltnis von
       Lautstaerke zu Ware — wer laut wirbt und duenn liefert, faellt tief. */
    var laut = lautstaerke() > 1;
    if (g >= 60) eintrag(D.urteile.lob[4], laut ? 14 : 5, 'Die Leute', 'lob');
    else if (g >= 40) eintrag('Der Verbrauchertest nennt den Anker "durchschnittlich".',
      laut ? -4 : -1, 'Die Leute', 'still');
    else eintrag(D.urteile.tadel[4], laut ? -22 : -9, 'Die Leute', 'tadel');
  }

  /* Der Ruf zahlt in Adressen: ein Wirt fragt von selbst an. Einmal im
     Braujahr, und nur wenn der Name wirklich etwas wert ist. */
  function wirtFragtAn() {
    if (ruf() < 45 || Z.gewinnJahr === jahr()) return;
    var frei = B.welt.adressenJetzt().filter(function (a) { return !a.bindung; });
    if (!frei.length) return;
    var a = B.wuerfel.aus(frei);
    if (!B.welt.binde(a.schluessel, 'haus', 'Der Ruf des Hauses', jahr() + 4)) return;
    Z.gewinnJahr = jahr();
    B.welt.protokolliere({ wer: 'spieler', was: a.name + ' fragt von selbst an — der Name reicht bis dorthin',
      preis: 0, adresse: a.schluessel });
    Z.meldung = a.name + ' hat von selbst angefragt. Dafür wurde nichts bezahlt.';
    B.ton.spiele('name:zulauf');
  }

  /* ------------------------------------------------------------------
     DER GEGNER.  Er ahmt nach, und das ist billiger als besser brauen.
     Angefasst wird dabei KEINE Datei von DER GEGNER — nur der vorhandene
     Weltzustand (welt.gegner, welt.binde, welt.protokolliere).
     ------------------------------------------------------------------ */
  function adler() {
    var l = B.welt.gegnerJetzt();
    for (var i = 0; i < l.length; i++) if (l[i].schluessel === 'adler') return l[i];
    return null;
  }

  function geschuetzt() {
    if (Z.fest.warenzeichen) return true;
    if (ep() === 1 && Z.fest.zunftzeichen) return true;
    return Z.schutzBis >= jahr();
  }

  function gegnerzug() {
    var g = adler();
    if (!g) return;
    var n = D.nachahmung[ep()];

    /* 1 — nachahmen */
    if (!Z.nachahmung && !geschuetzt() && ruf() >= 18 && versprechen()) {
      if (B.wuerfel.trifft(0.03 + 0.05 * (g.wagemut || 0.4))) {
        Z.nachahmung = { seit: jahr(), epoche: ep() };
        B.welt.protokolliere({ wer: 'gegner',
          was: B.welt.gegnerName(g) + ' ' + n.was + ' — nachgemacht ist billiger als besser gebraut',
          preis: 0 });
        B.welt.schreibe(B.welt.gegnerName(g) + ' ' + n.was + '.', 'gegner');
        Z.meldung = 'Das Haus gegenüber führt jetzt dasselbe Zeichen.';
        B.ton.spiele('name:nachahmung');
        return;
      }
    }

    /* 2 — der nachgeahmte Ruf waechst dem Nachbarn zu */
    if (Z.nachahmung) Z.adlerRuf = Math.min(90, Z.adlerRuf + 0.35);
    else Z.adlerRuf = Math.max(6, Z.adlerRuf - 0.08);

    /* 3 — abwerben: sein Ruf zieht eine gebundene Adresse zu ihm hinueber.
       Hoechstens eine im Braujahr, und sie ist zurueckzugewinnen. */
    if (Z.adlerRuf > ruf() + 8 && Z.abwerbJahr !== jahr() && B.wuerfel.trifft(0.06)) {
      var meine = meineAdressen();
      if (!meine.length) return;
      var a = meine[meine.length - 1];
      if (!B.welt.binde(a.schluessel, 'adler', 'Der bessere Name', jahr() + 3, 'haus')) return;
      Z.abwerbJahr = jahr();
      Z.urteil[a.schluessel] = -6;
      B.welt.protokolliere({ wer: 'gegner',
        was: a.name + ' nimmt jetzt das Bier des Adler — sein Name steht besser da',
        preis: 0, adresse: a.schluessel });
      B.welt.schreibe(a.name + ' wechselt zum Adler. Nicht wegen des Preises.', 'gegner');
      Z.meldung = a.name + ' ist weg. Der Name des Nachbarn stand besser da.';
      B.ton.spiele('name:verlust');
    }
  }

  /* ======================================================================
     5 — DIE WOCHE
     ====================================================================== */

  function wochenlauf() {
    /* Was in der abgelaufenen Woche noch offen war, wird jetzt kassiert;
       danach faengt die Wochenzahl bei null an. */
    B.wage('name.aufgeld', kassiereAufgeld);
    Z.aufgeldWoche = 0;

    var ziel = zielBekannt();

    /* Langsam zu bauen: hoechstens 0,9 in der Woche.  Ein Braujahr hat 30. */
    if (Z.bekannt < ziel) Z.bekannt = Math.min(ziel, Z.bekannt + 0.9);
    else if (Z.bekannt > ziel) {
      var runter = (Z.fest.krug && jahr() >= Z.krugAb) ? 0.8 : 1.6;
      Z.bekannt = Math.max(ziel, Z.bekannt - runter);
    }

    /* Deckung heilt langsam, wenn wirklich gutes Bier hinausgeht. */
    var g = guete();
    var heilung = 0.22 + (100 - Z.deckung) * 0.012;
    if (versprechen() && g >= 62) Z.deckung = Math.min(100, Z.deckung + heilung);
    else if (!versprechen()) Z.deckung = Math.min(100, Z.deckung + heilung * 0.3);

    /* Schnell zu verlieren: drei Wochen duennes Bier unter dem Zeichen, und
       es steht im Register. Der Spieler sieht die Uhr laufen und hat in
       jeder dieser Wochen einen freien Zug dagegen. */
    if (bruchGefahr()) {
      Z.bruchWochen++;
      if (Z.bruchWochen >= 5) {
        Z.bruchWochen = 0;
        var leer = B.welt.vorrat.faesser.length === 0;
        eintrag(leer ? D.urteile.leer[ep()] : D.urteile.bruch[ep()],
          (leer ? -7 : -6) * lautstaerke(), 'Die Gasse', 'bruch');
      }
    } else if (Z.bruchWochen > 0) {
      Z.bruchWochen = 0;
    }

    B.wage('name.wirte', wirteReden);
    B.wage('name.kieser', bierkieser);
    B.wage('name.gegner', gegnerzug);

    /* Was die Wirte sagen, schlaegt langsam auf die Deckung durch. */
    var summe = 0, wieviele = 0;
    meineAdressen().forEach(function (a) {
      summe += (Z.urteil[a.schluessel] || 0); wieviele++;
    });
    if (wieviele) Z.deckung = B.grenze(Z.deckung + (summe / wieviele) * 0.03, 0, 100);

    veroeffentliche();
  }

  function jahreslauf() {
    B.wage('name.aufgeld', kassiereAufgeld);
    Z.aufgeldJahrVorher = Z.aufgeldJahr;
    Z.aufgeldJahr = 0;

    /* Was ein Jahr lief, laeuft aus. Nichts wird still verlaengert. */
    var abgelaufen = [];
    Object.keys(Z.lauf).forEach(function (k) {
      if (Z.lauf[k] < jahr()) { abgelaufen.push(k); delete Z.lauf[k]; }
    });
    if (abgelaufen.length) {
      Z.meldung = 'Ausgelaufen: ' + abgelaufen.map(function (k) {
        var t = traeger(k); return t ? t.name.replace(/^Die |^Den |^Das /, '') : k;
      }).join(' · ') + '. Ein Etat verlängert sich nicht von selbst.';
    }
    if (Z.schutzBis && Z.schutzBis < jahr()) Z.schutzBis = 0;

    B.wage('name.urteil', jahresurteil);
    B.wage('name.zulauf', wirtFragtAn);
    Z.kieserWoche = B.wuerfel.ganz(4, 14);
    veroeffentliche();
  }

  function epochenlauf(d) {
    /* Das Medium wechselt — und mit ihm faellt die Bekanntheit zusammen.
       Das REGISTER bleibt: es ist das Gedaechtnis des Hauses. */
    var vorher = Math.round(Z.bekannt);
    B.wage('name.aufgeld', kassiereAufgeld);
    /* Neue Epoche, neue Waehrung: das Buch faengt von vorn an, sonst stuenden
       Pfennig und D-Mark in derselben Spalte. */
    Z.aufgeldEpoche = 0;
    Z.aufgeldWoche = 0;
    Z.aufgeldJahr = 0;
    Z.buch = [];
    Z.jeWirt = {};
    Z.aufgeldZuletzt = null;
    Z.bekannt = Math.round(Z.bekannt * 0.45);
    Z.zeiger = false;
    Z.schilder = {};
    Z.umtrunk = {};
    Z.lauf = {};
    Z.nachahmung = null;
    Z.bruchWochen = 0;
    Z.register.push({
      jahr: jahr(), woche: woche(), wer: 'Der Schnitt', art: 'schnitt', gewicht: 0,
      erloschen: false, erloschDurch: 0, loeschte: 0,
      text: 'Das Träger-Medium wechselt auf ' + epd().medium.toLowerCase()
        + '. Was in ' + (d && d.vorher ? D.epochen[d.vorher].medium.toLowerCase() : 'der alten Form')
        + ' aufgebaut war, muss neu gesagt werden: Bekanntheit ' + vorher
        + ' wird ' + Math.round(Z.bekannt) + '.'
    });
    Z.meldung = 'Neues Medium: ' + epd().medium + '. Der Ruf bleibt, die Reichweite nicht.';
    veroeffentliche();
  }

  /* ======================================================================
     6 — DIE ZUEGE DES SPIELERS
     ====================================================================== */

  function nachZug(grund) {
    veroeffentliche();
    B.sende('zeichne', { grund: 'name-' + (grund || 'zug') });
  }

  function zahlt(preis, was) {
    if (!preis) return true;
    return B.welt.zahle(preis, was, 'spieler');
  }

  function schalteZeiger() {
    Z.zeiger = !Z.zeiger;
    Z.ruhe = !Z.zeiger;
    Z.bruchWochen = 0;
    if (Z.zeiger) {
      Z.meldung = 'Der Bierzeiger hängt. Von jetzt an misst die Gasse das Haus daran.';
      B.ton.spiele('name:aushaengen', { ort: 'sudhaus' });
    } else {
      /* Einziehen kostet Bekanntheit, aber es rettet die Deckung. */
      Z.bekannt = Math.max(0, Z.bekannt - 4);
      Z.meldung = 'Der Zeiger ist eingezogen. Wer nichts verspricht, bricht nichts.';
      B.ton.spiele('name:einziehen', { ort: 'sudhaus' });
    }
    nachZug('zeiger');
  }

  function kaufeFest(t) {
    if (Z.fest[t.k]) return;
    if (!zahlt(t.preis, t.name)) { Z.meldung = 'Die Kasse reicht nicht.'; return nachZug('leer'); }
    Z.fest[t.k] = jahr();
    if (t.k === 'krug') Z.krugAb = jahr() + 12;
    if (t.k === 'warenzeichen' || t.k === 'zunftzeichen') Z.nachahmung = null;
    eintrag(t.k === 'krug'
      ? 'Der gemarkte Krug ist eingeführt. Er wirkt ab ' + Z.krugAb + '.'
      : t.name + ' — unwiderruflich.', t.k === 'krug' ? 4 : 6, 'Das Haus', 'fest');
    B.ton.spiele('name:siegel');
    nachZug('fest');
  }

  function kaufeJahr(t) {
    if ((Z.lauf[t.k] || 0) >= jahr()) {      /* laeuft schon: einstellen ist frei */
      delete Z.lauf[t.k];
      Z.meldung = t.name + ' eingestellt. Das kostet Reichweite und kein Geld.';
      B.ton.spiele('name:einziehen');
      return nachZug('jahr-aus');
    }
    /* Voller Etat: es wird nicht gesperrt, es wird getauscht. Der Zug bleibt
       bezahlbar und schliesst genau einen anderen aus. */
    var weicht = etatVoll() ? schwaechsterPosten() : null;
    if (!zahlt(t.preis, t.name)) { Z.meldung = 'Die Kasse reicht nicht.'; return nachZug('leer'); }
    if (weicht && weicht.k !== t.k) delete Z.lauf[weicht.k];
    Z.lauf[t.k] = jahr();
    Z.meldung = t.name + ' läuft bis Ende des Braujahres ' + jahr() + '.'
      + (weicht ? ' Der Etat trägt nur ' + etatPlaetze() + ' Posten — dafür ist '
        + weicht.name.replace(/^(Den|Die|Das) /, '') + ' eingestellt.' : '');
    B.ton.spiele(t.laut ? 'name:spot' : 'name:druck');
    nachZug('jahr');
  }

  function schildBei(a) {
    var t = traeger(ep() === 1 ? 'umtrunk' : 'schild');
    var fach = ep() === 1 ? Z.umtrunk : Z.schilder;
    if (fach[a.schluessel]) {
      if (ep() === 1) return;
      delete fach[a.schluessel];
      eintrag('Das Schild bei ' + a.name + ' ist abgenommen worden. Die Gasse hat es gesehen.',
        -4, 'Die Wirte', 'ab');
      Z.meldung = 'Schild abgenommen. Kostet kein Geld — und trotzdem etwas.';
      return nachZug('schild-ab');
    }
    if (zaehle(fach) >= (t.hoechstens || 6)) {
      Z.meldung = 'Mehr trägt das Haus in dieser Epoche nicht.';
      return nachZug('grenze');
    }
    if (!zahlt(t.preis, t.name + ' · ' + a.name)) {
      Z.meldung = 'Die Kasse reicht nicht.'; return nachZug('leer');
    }
    fach[a.schluessel] = jahr();
    Z.urteil[a.schluessel] = (Z.urteil[a.schluessel] || 0) + 2;
    Z.meldung = ep() === 1
      ? 'Umtrunk bei ' + a.name + '. Der Wirt redet ab jetzt anders.'
      : 'Das Ankerschild hängt bei ' + a.name + '. Sein Urteil zählt jetzt doppelt.';
    B.ton.spiele('name:anschlagen');
    nachZug('schild');
  }

  /* Der Knopf auf der Karte nimmt den groessten Wirt, der noch keines hat —
     die Reihe darunter laesst jeden einzeln waehlen. Kein toter Knopf. */
  function schildBeimGroessten(t) {
    var fach = t.k === 'schild' ? Z.schilder : Z.umtrunk;
    var frei = B.welt.adressenJetzt().filter(function (a) { return !fach[a.schluessel]; })
      .sort(function (a, b) { return b.bedarf - a.bedarf; });
    if (!frei.length) { Z.meldung = 'Überall, wo es geht, hängt schon eines.'; return nachZug('voll'); }
    schildBei(frei[0]);
  }

  function beschickeAusstellung(t) {
    if (!zahlt(t.preis, t.name)) { Z.meldung = 'Die Kasse reicht nicht.'; return nachZug('leer'); }
    var g = guete();
    /* Die Jury urteilt ohne das Haus — aber nicht ohne die Ware. */
    if (B.wuerfel.trifft(B.grenze(0.18 + g / 180, 0.1, 0.8))) {
      Z.fest.medaille = jahr();
      eintrag(D.urteile.medaille[ep()] || 'Auszeichnung.', 12, 'Die Jury', 'medaille');
      Z.meldung = 'Eine Medaille. Sie hängt vierzig Jahre im Kontor.';
    } else {
      eintrag('Beschickt, nicht ausgezeichnet. Das Geld ist trotzdem weg.', -2, 'Die Jury', 'still');
      Z.meldung = 'Kein Preis. Die Ausstellung hat trotzdem gekostet.';
    }
    nachZug('ausstellung');
  }

  function rueckruf(t) {
    if (!zahlt(t.preis, t.name)) { Z.meldung = 'Die Kasse reicht nicht.'; return nachZug('leer'); }
    /* Wer selbst zurueckruft, verliert Geld und behaelt den Namen. */
    var weg = B.welt.vorrat.faesser.length;
    B.welt.nimmHeraus(weg);
    Z.bruchWochen = 0;
    eintrag('Das Haus ruft selbst zurück, bevor es jemand anders sagt.', 9, 'Die Leute', 'lob');
    Z.meldung = 'Zurückgerufen. ' + B.welt.menge(weg) + ' aus dem Lager, bar bezahlt — '
      + 'und der Name steht.';
    B.ton.spiele('name:rueckruf');
    nachZug('rueckruf');
  }

  function gegenNachahmung() {
    var n = D.nachahmung[ep()];
    if (!Z.nachahmung) return;
    if (n.ab && jahr() < n.ab) return;
    if (n.schluessel === 'warenzeichen') {
      return kaufeFest(traeger('warenzeichen'));
    }
    if (!zahlt(n.preis, n.gegen)) { Z.meldung = 'Die Kasse reicht nicht.'; return nachZug('leer'); }
    if (B.wuerfel.trifft(n.sicher)) {
      Z.nachahmung = null;
      Z.schutzBis = jahr() + ((traeger(n.schluessel) || {}).jahre || 8);
      Z.adlerRuf = Math.max(6, Z.adlerRuf - 10);
      eintrag(n.gegen + ' — der Nachbar muss das Zeichen abnehmen.', 5, 'Das Recht', 'schutz');
      Z.meldung = 'Durchgesetzt. Bis ' + Z.schutzBis + ' führt es niemand sonst.';
    } else {
      eintrag(n.gegen + ' — abgewiesen. Das Zeichen bleibt beim Nachbarn.', -3, 'Das Recht', 'still');
      Z.meldung = 'Abgewiesen. Das Geld ist weg, das Zeichen bleibt beim Nachbarn.';
    }
    B.ton.spiele('name:siegel');
    nachZug('recht');
  }

  function verkaufeNamen() {
    var summe = 120000 + ruf() * 4200;
    Z.fest.verkauft = jahr();
    B.welt.nimm(summe, 'Die Nordstern-Gruppe kauft den Namen "Zum Anker"', 'spieler');
    Z.register.push({
      jahr: jahr(), woche: woche(), wer: 'Die Nordstern-Gruppe', art: 'verkauft', gewicht: 0,
      erloschen: false, erloschDurch: 0, loeschte: 0,
      text: 'Der Name gehört nicht mehr dem Haus. Gebraut wird weiter; wofür der Anker '
        + 'steht, entscheidet jetzt jemand anders.'
    });
    /* Alles darueber wird entwertet — das ist der Sinn der Zeile. */
    Z.register.forEach(function (e) {
      if (e.gewicht > 0 && !e.erloschen) { e.erloschen = true; Z.deckung -= e.gewicht; }
    });
    Z.deckung = B.grenze(Z.deckung, 0, 100);
    B.welt.schreibe('Der Name "Zum Anker" ist verkauft. Das Haus braut weiter.', 'verkauf');
    Z.meldung = 'Verkauft. Das Geld ist da, der Name nicht mehr.';
    B.ton.spiele('name:verkauf');
    nachZug('verkauf');
  }

  /* Die Klemme, als Knopfpaar: kurz mehr verdienen oder lang etwas behalten. */
  function waehleLiefern() {
    Z.letzteWahl = 'liefern';
    Z.wahlWoche = stempel();
    Z.bruchWochen = Math.max(Z.bruchWochen, 3);
    Z.deckung = Math.max(0, Z.deckung - 2);
    Z.meldung = 'Es geht hinaus, wie es ist. Das Zeichen hängt weiter — '
      + 'die Rechnung kommt später.';
    nachZug('wahl');
  }

  /* Das Zeichen verdecken. Es wird NICHTS zerstoert und nichts bezahlt —
     der Preis ist Reichweite, und der Zug ist umkehrbar. Genau deshalb kann
     dieses Stueck den Spieler nie einfrieren. */
  function schalteRuhe(an) {
    Z.ruhe = !!an;
    Z.bruchWochen = 0;
    if (ep() === 1) Z.zeiger = !Z.ruhe;      /* 1350 IST das Verb der Epoche */
    if (Z.ruhe) {
      Z.letzteWahl = 'halten';
      Z.wahlWoche = stempel();
      Z.deckung = Math.min(100, Z.deckung + 1);
      Z.meldung = 'Das Zeichen ist verdeckt, bis der Sud wieder taugt. '
        + 'Kostet Reichweite, kostet kein Geld, und es ist umkehrbar.';
      B.ton.spiele('name:einziehen');
    } else {
      Z.meldung = 'Das Zeichen ist wieder zu sehen. Ab jetzt gilt es wieder.';
      B.ton.spiele('name:aushaengen');
    }
    nachZug('ruhe');
  }

  function waehleZurueckhalten() { schalteRuhe(true); }

  /* Der Zug, den es immer gibt: herumgehen und den Namen sagen. Kostet kein
     Geld, sondern eine Gelegenheit — einmal im Braujahr. */
  function geheHerum() {
    if (Z.rundeJahr === jahr()) return;
    Z.rundeJahr = jahr();
    Z.bekannt = B.grenze(Z.bekannt + 2.5, 0, epd().deckel);
    var meine = meineAdressen();
    if (meine.length) {
      var a = B.wuerfel.aus(meine);
      Z.urteil[a.schluessel] = (Z.urteil[a.schluessel] || 0) + 1;
      Z.meldung = 'Beim ' + a.name + ' vorbeigegangen und den Namen gesagt. '
        + 'Das kostet kein Geld, nur den Nachmittag.';
    } else {
      Z.meldung = 'Herumgegangen und den Namen gesagt. Mehr geht in diesem Braujahr nicht.';
    }
    B.ton.spiele('name:mundpropaganda');
    nachZug('runde');
  }

  /* ======================================================================
     7 — DAS BILD
     ====================================================================== */

  function bildpfad(datei) { return 'bild/name/' + datei; }

  function setzeMarke(el, ort, opt) {
    B.orte.setze(el, ort, opt || {});
    /* Zustaendigkeit §10: wer eigene Marken selbst setzt, meldet sie ab —
       vollstaendig, nicht halb. */
    el.setAttribute('data-frei', ICH);
    return el;
  }

  function zeichenBild(klasse, breite) {
    var b = document.createElement('img');
    b.className = 'nm-zeichen ' + (klasse || '');
    b.src = bildpfad(epd().bild);
    b.alt = '';
    b.setAttribute('aria-hidden', 'true');
    b.style.width = breite + '%';
    return b;
  }

  function zeichnePlatte() {
    var f = B.ebene('marken', ICH);
    B.leere(f);
    var e = epd();

    /* Das Zeichen des Hauses sitzt auf der Platte, nicht daneben.
       Gezeigt wird GENAU der Traeger, den das Bild darstellt (e.bildWenn) —
       ein Etikett klebt am Fass und steht nicht in der Stadt. */
    if (!Z.ruhe && laeuft(traeger(e.bildWenn))) {
      var haupt = zeichenBild('nm-haupt', e.breite);
      setzeMarke(haupt, e.ort, { anker: 'unten', dx: e.versatz.dx, dy: e.versatz.dy });
      haupt.title = e.medium + ' — das Zeichen des Hauses, Ruf ' + ruf() + ' von 100.';
      f.appendChild(haupt);

      /* 1600: der Name wohnt in fremden Haeusern. Jedes Schild steht dort,
         wo der Wirt steht. */
      if (ep() === 2) {
        B.welt.adressenJetzt().forEach(function (a) {
          if (!Z.schilder[a.schluessel] || a.ort === e.ort) return;
          if (!B.orte.da(a.ort)) return;
          var s = zeichenBild('nm-neben', e.breite * 0.85);
          setzeMarke(s, a.ort, { anker: 'unten', dy: -5 });
          s.title = 'Ankerschild bei ' + a.name + '.';
          f.appendChild(s);
        });
      }
    }

    /* Der Nachahmer haengt dasselbe Zeichen aus — blass, drueben. */
    if (Z.nachahmung) {
      var g = adler();
      if (g) {
        var ort = B.welt.gegnerOrt(g);
        if (B.orte.da(ort)) {
          var n = zeichenBild('nm-nachgeahmt', e.breite * 0.8);
          setzeMarke(n, ort, { anker: 'unten', dy: -6, dx: 2 });
          n.title = B.welt.gegnerName(g) + ' ' + D.nachahmung[ep()].was + '.';
          f.appendChild(n);
          var z = B.el('div', 'nm-nachschild', 'nachgemacht');
          setzeMarke(z, ort, { anker: 'mitte', dy: -1, dx: 2 });
          f.appendChild(z);
        }
      }
    }
  }

  /* ------------------------------------------------------------------
     DAS RUFBAND — steht immer da, klein, links oben. Es traegt die eine
     Behauptung des Stuecks als Zahl: dasselbe Fass, zwei Preise.
     ------------------------------------------------------------------ */
  function balken(name, wert, hoechstens, klasse, ziel) {
    var z = B.el('div', 'nm-balken ' + (klasse || ''));
    z.appendChild(B.el('span', 'nm-bname', name));
    var schiene = B.el('div', 'nm-schiene');
    var voll = B.el('i');
    voll.style.width = B.grenze(wert / (hoechstens || 100) * 100, 0, 100) + '%';
    schiene.appendChild(voll);
    /* Die Zielmarke macht sichtbar, dass Bekanntheit LANGSAM waechst: der
       Strich steht schon da, der Balken braucht Wochen bis dorthin. */
    if (ziel !== undefined && ziel !== null) {
      var m = B.el('u', 'nm-ziel');
      m.style.left = B.grenze(ziel / (hoechstens || 100) * 100, 0, 100) + '%';
      m.title = 'Ziel dieser Träger: ' + Math.round(ziel);
      schiene.appendChild(m);
    }
    z.appendChild(schiene);
    z.appendChild(B.el('span', 'nm-bwert', B.zahl(Math.round(wert))
      + (ziel !== undefined && Math.round(ziel) !== Math.round(wert)
        ? (ziel > wert ? ' \u2197' : ' \u2198') : '')));
    return z;
  }

  function zeichneBand() {
    var f = B.ebene('kopf', ICH);
    B.leere(f);
    var e = epd();

    var band = B.el('div', 'nm-band' + (Z.zu ? ' zu' : ''));
    band.setAttribute('data-ruf', ruf());
    band.setAttribute('data-deckung', Math.round(Z.deckung));
    band.setAttribute('data-bekannt', Math.round(Z.bekannt));
    band.setAttribute('data-aufschlag', aufschlag());

    var kopf = B.el('div', 'nm-kopf');
    kopf.appendChild(B.el('span', 'nm-titel', 'DER NAME'));
    if (!Z.zu) kopf.appendChild(B.el('span', 'nm-medium', e.medium));
    /* Das Band gibt die Platte auf Klick frei — DIE STADT misst die Deckung
       ihres Fensters, und ein Brett, das man nicht wegbekommt, ist ein Brett
       zuviel. Kein Zug des Hauses: nur Anzeige. */
    kopf.appendChild(B.knopf({
      text: Z.zu ? '▸' : '▾', zug: 'name:band', klasse: 'nm-knopf nm-bandgriff',
      titel: Z.zu ? 'Das Rufband wieder aufklappen.'
        : 'Das Rufband einklappen und die Stadt freigeben.',
      tu: function () { Z.zu = !Z.zu; B.sende('zeichne', { grund: 'name-band' }); }
    }));
    band.appendChild(kopf);

    var gross = B.el('div', 'nm-gross');
    gross.appendChild(B.el('b', null, B.zahl(ruf())));
    gross.appendChild(B.el('span', 'nm-von', 'Ruf von 100'));
    if (Z.nachahmung) gross.appendChild(B.el('span', 'nm-warn', 'nachgemacht'));
    if (Z.fest.verkauft) gross.appendChild(B.el('span', 'nm-warn', 'verkauft'));
    band.appendChild(gross);

    if (Z.zu) { f.appendChild(band); return; }

    band.appendChild(balken('Bekanntheit', Z.bekannt, e.deckel, 'nm-bekannt', zielBekannt()));
    band.appendChild(balken('Deckung', Z.deckung, 100, 'nm-deckung'));

    /* ----------------------------------------------------------------
       DIE BEHAUPTUNG DES STUECKS — und daneben, was sie eingebracht hat.
       In Runde 1 stand hier nur die Behauptung. Sie stimmt jetzt, weil
       DER NAME das Aufgeld selbst einnimmt; und was er NICHT kann — den
       Grundpreis je Fass heben —, steht durchgestrichen daneben.
       ---------------------------------------------------------------- */
    var v = preisVergleich();
    var satz = B.el('div', 'nm-satz');
    satz.setAttribute('data-aufgeld-jahr', Z.aufgeldJahr);
    satz.setAttribute('data-aufgeld-gesamt', Z.aufgeldGesamt);
    if (v) {
      satz.appendChild(B.el('span', 'nm-satzkopf',
        'Gleiches Bier, 100 ' + v.einheit + ', zwei Preise'));
      var zeile = B.el('div', 'nm-preise');
      zeile.appendChild(B.el('span', 'nm-ohne', 'Rechnung der Fuhre ' + geld(v.ohne)));
      zeile.appendChild(B.el('span', 'nm-mit', 'mit dem Aufgeld ' + geld(v.mit)));
      satz.appendChild(zeile);
      satz.appendChild(B.el('span', 'nm-klein', '+ ' + B.zahl(aufschlag() * 100, 1)
        + ' im Hundert · ' + geld(v.mit - v.ohne) + ' mehr für dasselbe Fass Bier'
        + (Z.ruhe || !versprechen()
          ? ' — aber nur, solange das Zeichen zu sehen ist. Es ist es gerade nicht.'
          : '')));
    }

    /* Was WIRKLICH eingegangen ist. Drei Zahlen, die ein Fremder gegen den
       Kassenstand halten kann. */
    var kasten = B.el('div', 'nm-aufgeld');
    kasten.appendChild(B.el('span', 'nm-satzkopf', epd().aufgeldWort.toUpperCase()
      + ' — was der Ruf wirklich eingebracht hat'));
    var reiheG = B.el('div', 'nm-geldreihe');
    [['diese Woche', Z.aufgeldWoche], ['Braujahr', Z.aufgeldJahr],
     ['seit ' + epd().jahr, Z.aufgeldEpoche]].forEach(function (p) {
      var s = B.el('span', 'nm-geldpost' + (p[1] > 0 ? ' an' : ''));
      s.appendChild(B.el('i', null, p[0]));
      s.appendChild(B.el('b', null, (p[1] > 0 ? '+' : '') + geld(p[1])));
      reiheG.appendChild(s);
    });
    kasten.appendChild(reiheG);
    if (Z.aufgeldZuletzt) {
      var l = Z.aufgeldZuletzt;
      kasten.appendChild(B.el('span', 'nm-klein', 'zuletzt ' + l.jahr + ', W' + l.woche
        + ': ' + geld(l.betrag) + ' auf ' + geld(l.rechnung) + ' an ' + l.wohin
        + ' · ' + B.zahl(l.satz * 100, 1) + ' im Hundert bei Ruf ' + l.ruf));
    } else {
      kasten.appendChild(B.el('span', 'nm-klein',
        'Noch nichts. Das Aufgeld fällt beim Ausliefern an — eine Fuhre, und es steht hier.'));
    }
    /* Ehrlich ausgewiesen, was dieses Stueck NICHT kann. */
    var offen = B.el('div', 'nm-klein nm-offen');
    var durch = B.el('s', null, 'und einen höheren Grundpreis je Fass');
    offen.appendChild(durch);
    offen.appendChild(document.createTextNode(preisLiestSelbst()
      ? ' — DER PREIS liest welt.haus.rufAufschlag jetzt selbst; DER NAME bucht nicht mehr.'
      : ' — den schreibt DER PREIS, und er liest welt.haus.rufAufschlag noch nicht.'
        + ' Solange bucht DER NAME das Aufgeld selbst, Zeile für Zeile.'));
    kasten.appendChild(offen);
    kasten.appendChild(B.knopf({
      text: 'Das Aufgeld nachrechnen', zug: 'name:aufgeldbuch', klasse: 'nm-knopf nm-klein-knopf',
      titel: 'Jede einzelne Buchung mit Datum, Adresse, Rechnung und Satz.',
      tu: function () { zeigeBlatt('aufgeld'); }
    }));
    satz.appendChild(kasten);
    band.appendChild(satz);

    /* DIE KLEMME. Nur wenn sie wirklich zubeisst — sonst nagt sie nicht. */
    if (bruchGefahr()) {
      var kl = B.el('div', 'nm-klemme');
      kl.appendChild(B.el('div', 'nm-klemmkopf',
        'Das Zeichen hängt, und der Keller taugt nicht — Güte ' + guete() + ' von 100.'
        + ' Seit ' + (Z.bruchWochen + 1) + ' von 5 Wochen; danach steht es im Register.'));
      kl.appendChild(B.knopf({
        text: 'Unter dem Zeichen ausliefern', zug: 'name:liefern', klasse: 'nm-knopf nm-rot',
        titel: 'Es geht hinaus, wie es ist. Kostet heute nichts und später den Namen.',
        tu: waehleLiefern
      }));
      kl.appendChild(B.knopf({
        text: 'Das Zeichen einziehen', zug: 'name:zurueckhalten', klasse: 'nm-knopf',
        titel: 'Kostet Reichweite, rettet die Deckung. Kostet kein Geld und ist umkehrbar.',
        tu: waehleZurueckhalten
      }));
      band.appendChild(kl);
    }

    /* Die zwei Zuege, die IMMER da sind und nie Geld kosten. Daran haengt
       die harte Regel: kein Zustand ohne wirksamen Zug. */
    var frei = B.el('div', 'nm-frei');
    if (versprechen() || Z.ruhe) {
      frei.appendChild(B.knopf({
        text: Z.ruhe ? 'Das Zeichen wieder zeigen' : 'Das Zeichen verdecken',
        zug: 'name:ruhe', klasse: 'nm-knopf' + (Z.ruhe ? ' nm-an' : ''),
        titel: Z.ruhe
          ? 'Verdeckt reicht der Name kaum. Zeigen heißt wieder versprechen.'
          : 'Kostet kein Geld, nur Reichweite — und rettet die Deckung. Umkehrbar.',
        tu: function () { schalteRuhe(!Z.ruhe); }
      }));
    }
    frei.appendChild(B.knopf({
      text: 'Herumgehen und den Namen sagen',
      zug: 'name:herumgehen', klasse: 'nm-knopf',
      aus: Z.rundeJahr === jahr(),
      titel: Z.rundeJahr === jahr()
        ? 'In diesem Braujahr schon getan. Aufmerksamkeit ist die knappe Ware.'
        : 'Kostet kein Geld, sondern einen Nachmittag. Einmal im Braujahr.',
      tu: geheHerum
    }));
    band.appendChild(frei);

    if (Z.meldung) band.appendChild(B.el('div', 'nm-meldung', Z.meldung));

    band.appendChild(B.knopf({
      text: Z.blatt ? 'Das Zeichen schließen' : 'Das Zeichen und das Register',
      zug: 'name:blatt', klasse: 'nm-knopf nm-griff',
      titel: 'Träger dieser Epoche, der Nachahmer, und das Register der Urteile.',
      tu: function () { zeigeBlatt(Z.blatt ? null : 'zeichen'); }
    }));

    f.appendChild(band);
  }

  /* ------------------------------------------------------------------
     DAS BLATT.  Zwei Reiter: die Traeger dieser Epoche und das Register.
     Es steht NICHT dauerhaft offen (Zustaendigkeit §5) und ist per Klick
     und per Escape zu schliessen.
     ------------------------------------------------------------------ */
  function zeigeBlatt(welches) {
    Z.blatt = welches || null;
    B.sende('zeichne', { grund: 'name-blatt' });
  }

  function knopfFuer(t) {
    var jetzt = jahr();
    var gesperrt = false, warum = '';

    if (t.ab && jetzt < t.ab) {
      gesperrt = true;
      warum = t.sperr || ('Gibt es erst ab ' + t.ab + '.');
    }
    if (t.art === 'fest' && Z.fest[t.k]) {
      gesperrt = true; warum = 'Steht seit ' + Z.fest[t.k] + '. Unwiderruflich.';
    }
    if (t.art === 'schutz' && !Z.nachahmung) {
      gesperrt = true; warum = 'Es ahmt gerade niemand nach.';
    }
    if (t.art === 'notbremse' && !bruchGefahr() && guete() >= 40) {
      gesperrt = true; warum = 'Es ist nichts zurückzurufen.';
    }

    var an = laeuft(t);
    var text = t.name;
    var preis = -t.preis;
    if (t.art === 'schalter' && Z.zeiger) { text = t.aus; preis = 0; }
    if (t.art === 'jahr' && an) {
      text = 'Einstellen: ' + t.name.replace(
        / (auflegen|anschlagen lassen|mieten|ausgeben|bedrucken|senden)$/, '');
      preis = 0;
    }

    /* Ein Zug, der Geld kostet, aber nicht bezahlbar ist, bleibt sichtbar
       und traegt seinen Preis — der Kritiker zaehlt Preisschilder. */
    if (!gesperrt && preis < 0 && !B.welt.kann(-preis)) {
      gesperrt = true; warum = 'Die Kasse reicht nicht: ' + geld(-preis) + '.';
    }

    /* Der Etat sperrt nicht, er tauscht — und sagt vorher, wen es trifft. */
    var tausch = '';
    if (t.art === 'jahr' && !an && etatVoll()) {
      var w = schwaechsterPosten();
      if (w) tausch = ' Der Etat trägt nur ' + etatPlaetze() + ' Posten: dafür wird '
        + w.name.replace(/^(Den|Die|Das) /, '') + ' eingestellt.';
    }

    var k = B.knopf({
      text: text,
      zug: 'name:' + t.k,
      preis: preis,
      klasse: 'nm-knopf' + (an ? ' nm-an' : ''),
      aus: gesperrt,
      titel: (t.sagt || '') + (t.warnt ? ' — ' + t.warnt : '') + tausch
        + (warum ? ' [' + warum + ']' : ''),
      tu: function () {
        if (t.art === 'schalter') return schalteZeiger();
        if (t.art === 'adresse') return schildBeimGroessten(t);
        if (t.art === 'fest') return kaufeFest(t);
        if (t.art === 'jahr') return kaufeJahr(t);
        if (t.art === 'wette') return beschickeAusstellung(t);
        if (t.art === 'notbremse') return rueckruf(t);
        if (t.art === 'schutz') return gegenNachahmung();
      }
    });
    return { knopf: k, gesperrt: gesperrt, warum: warum, traeger: t, an: an };
  }

  function reiterZeichen(blatt) {
    var e = epd();

    var kopf = B.el('div', 'nm-abschnitt');
    kopf.appendChild(B.el('h3', null, e.verb + ' — ' + e.medium));
    kopf.appendChild(B.el('p', 'nm-p', e.satz));
    /* Die Knappheit dieser Epoche, als Zeile. In 1970 ist es der Etat. */
    if (etatPlaetze()) {
      kopf.appendChild(B.el('div', 'nm-etat',
        'DER ETAT: ' + etatBelegt() + ' von ' + etatPlaetze() + ' Posten belegt'
        + (etatVoll() && schwaechsterPosten()
          ? ' — der nächste tauscht ' + schwaechsterPosten().name.replace(/^(Den|Die|Das) /, '')
            + ' heraus.'
          : ' — es ist noch Platz.')));
    }
    blatt.appendChild(kopf);

    /* Die Traeger, mit Preisschild nebeneinander. */
    var gitter = B.el('div', 'nm-gitter');
    traegerListe().forEach(function (t) {
      var kasten = B.el('div', 'nm-karte' + (laeuft(t) ? ' an' : ''));
      var z = knopfFuer(t);
      kasten.appendChild(z.knopf);
      var unter = B.el('div', 'nm-unter');
      if (t.reichweite) unter.appendChild(B.el('span', 'nm-marke', '+' + t.reichweite + ' Reichweite'));
      if (t.art === 'fest') unter.appendChild(B.el('span', 'nm-marke nm-fest', 'unwiderruflich'));
      if (t.art === 'jahr') unter.appendChild(B.el('span', 'nm-marke', 'ein Braujahr'));
      if (t.art === 'jahr' && !laeuft(t) && etatVoll() && schwaechsterPosten()) {
        unter.appendChild(B.el('span', 'nm-marke nm-tausch', 'tauscht '
          + schwaechsterPosten().name.replace(/^(Den|Die|Das) /, '') + ' heraus'));
      }
      if (t.art === 'wette') unter.appendChild(B.el('span', 'nm-marke', 'fremde Jury'));
      if (t.hoechstens) unter.appendChild(B.el('span', 'nm-marke',
        zaehle(t.k === 'schild' ? Z.schilder : Z.umtrunk) + ' von ' + t.hoechstens));
      kasten.appendChild(unter);
      kasten.appendChild(B.el('div', 'nm-sagt', (t.sagt || '')
        + (z.gesperrt && z.warum ? '  [' + z.warum + ']' : '')));
      if (t.warnt) kasten.appendChild(B.el('div', 'nm-warnt', t.warnt));
      gitter.appendChild(kasten);
    });
    blatt.appendChild(gitter);

    /* Die Adressen — in 1350 der Umtrunk, in 1600 das Schild. */
    var t = traeger(ep() === 1 ? 'umtrunk' : 'schild');
    if (t) {
      var ab = B.el('div', 'nm-abschnitt');
      ab.appendChild(B.el('h3', null, ep() === 1
        ? 'Bei welchem Wirt sitzt man sich hin?'
        : 'An welcher Tür hängt der Anker?'));
      var reihe = B.el('div', 'nm-reihe');
      var fach = ep() === 1 ? Z.umtrunk : Z.schilder;
      B.welt.adressenJetzt().forEach(function (a) {
        var drauf = !!fach[a.schluessel];
        var voll = zaehle(fach) >= (t.hoechstens || 6);
        var kannNicht = !drauf && (voll || !B.welt.kann(t.preis));
        reihe.appendChild(B.knopf({
          text: (drauf ? (ep() === 1 ? 'Sitzt: ' : 'Anker: ') : '') + a.name,
          zug: 'name:' + t.k + ':' + a.schluessel,
          preis: drauf ? 0 : -t.preis,
          klasse: 'nm-knopf nm-adresse' + (drauf ? ' nm-an' : ''),
          aus: kannNicht || (drauf && ep() === 1),
          titel: (B.welt.gebunden(a.schluessel) === 'haus'
            ? 'Gebunden ans Haus. ' : 'Nicht gebunden. ')
            + 'Was dieser Wirt sagt: ' + B.zahl(Z.urteil[a.schluessel] || 0)
            + ' · er zahlt derzeit ' + B.zahl(satzFuer(a.schluessel) * 100, 1)
            + ' im Hundert Aufgeld auf jede Rechnung'
            + (drauf && ep() === 2 ? ' — abnehmen kostet kein Geld und trotzdem etwas.' : ''),
          tu: function () { schildBei(a); }
        }));
      });
      ab.appendChild(reihe);
      blatt.appendChild(ab);
    }

    /* Der Nachahmer. */
    var n = D.nachahmung[ep()];
    var gg = adler();
    var nb = B.el('div', 'nm-abschnitt nm-gegner');
    nb.appendChild(B.el('h3', null, 'Das Haus gegenüber'));
    if (Z.nachahmung && gg) {
      nb.appendChild(B.el('p', 'nm-p', B.welt.gegnerName(gg) + ' ' + n.was
        + ' — seit ' + Z.nachahmung.seit + '. Sein Ruf: ' + Math.round(Z.adlerRuf)
        + '. Solange das läuft, kommt vom eigenen Zeichen weniger an.'));
      if (n.ab && jahr() < n.ab) {
        nb.appendChild(B.el('p', 'nm-warnt', n.ohne || ('Erst ab ' + n.ab + ' gibt es das Mittel dagegen.')));
      } else {
        nb.appendChild(B.knopf({
          text: n.gegen, zug: 'name:gegen', preis: -n.preis, klasse: 'nm-knopf',
          aus: !B.welt.kann(n.preis),
          titel: n.sicher >= 1 ? 'Wirkt sicher.' : 'Wirkt in ' + Math.round(n.sicher * 100) + ' von 100 Fällen.',
          tu: gegenNachahmung
        }));
      }
    } else {
      nb.appendChild(B.el('p', 'nm-p', gg
        ? B.welt.gegnerName(gg) + ' führt das eigene Zeichen (noch) nicht. Sein Ruf: '
          + Math.round(Z.adlerRuf) + ' gegen ' + ruf() + '.'
          + (geschuetzt() ? ' Das Zeichen ist geschützt.' : ' Es ist ungeschützt.')
        : 'Zurzeit ist niemand da, der nachahmen könnte.'));
    }
    blatt.appendChild(nb);

    /* 1970: das Angebot auf den Namen selbst. */
    if (ep() === 4 && !Z.fest.verkauft && ruf() >= 40) {
      var ang = B.el('div', 'nm-abschnitt nm-angebot');
      var summe = 120000 + ruf() * 4200;
      ang.appendChild(B.el('h3', null, 'Die Nordstern-Gruppe bietet auf den Namen'));
      ang.appendChild(B.el('p', 'nm-p', 'Gebraut wird weiter, im selben Haus, mit demselben '
        + 'Sud. Nur wofür der Anker steht, entscheidet danach jemand anders. '
        + 'Alles, was im Register über dem Strich steht, ist danach erloschen.'));
      ang.appendChild(B.knopf({
        text: 'Den Namen verkaufen', zug: 'name:verkaufen', preis: summe,
        klasse: 'nm-knopf nm-rot',
        titel: 'Unwiderruflich. Der Ruf ist danach auf 40 gedeckelt und das Register gestrichen.',
        tu: verkaufeNamen
      }));
      blatt.appendChild(ang);
    }
  }

  function reiterRegister(blatt) {
    var ab = B.el('div', 'nm-abschnitt');
    ab.appendChild(B.el('h3', null, 'Das Register — was andere über das Haus gesagt haben'));
    ab.appendChild(B.el('p', 'nm-p', epd().urteiler + '. ' + epd().urteilerSagt
      + ' Nichts hier lässt sich löschen. Eine neue schwere Zeile knipst ältere gute aus; '
      + 'sie bleibt durchgestrichen stehen.'));
    blatt.appendChild(ab);

    var liste = B.el('div', 'nm-register rolle');
    if (!Z.register.length) {
      liste.appendChild(B.el('div', 'zeile', 'Noch hat niemand etwas über dieses Haus gesagt.'));
    }
    Z.register.slice().reverse().forEach(function (e) {
      var z = B.el('div', 'zeile nm-zeile' + (e.erloschen ? ' erloschen' : '')
        + (e.gewicht < 0 ? ' schlecht' : (e.gewicht > 0 ? ' gut' : '')));
      z.appendChild(B.el('span', 'wann', e.jahr + ', W' + e.woche));
      var was = B.el('span', 'was');
      was.appendChild(B.el('i', 'nm-wer', e.wer));
      was.appendChild(document.createTextNode(' ' + e.text));
      if (e.loeschte) was.appendChild(B.el('span', 'nm-knips',
        ' — ' + e.loeschte + (e.loeschte === 1 ? ' ältere Zeile erloschen' : ' ältere Zeilen erloschen')));
      z.appendChild(was);
      z.appendChild(B.el('span', 'zahl', e.gewicht ? (e.gewicht > 0 ? '+' : '') + e.gewicht : '·'));
      liste.appendChild(z);
    });
    blatt.appendChild(liste);
  }

  /* ------------------------------------------------------------------
     DER REITER DAS AUFGELD — die Nachrechnung. Hier kann ein Fremder
     Zeile fuer Zeile pruefen, dass der Ruf Geld bewegt: Datum, Adresse,
     Rechnung der FUHRE, Satz, Betrag. Und die Summe daneben.
     ------------------------------------------------------------------ */
  function reiterAufgeld(blatt) {
    var ab = B.el('div', 'nm-abschnitt');
    ab.appendChild(B.el('h3', null, epd().aufgeldWort + ' — was der Ruf einbringt'));
    ab.appendChild(B.el('p', 'nm-p', epd().aufgeldSatz
      + ' Der Satz ist Ruf ÷ 100 mal ' + B.zahl(epd().aufschlag * 100, 0)
      + ' im Hundert, der Höchstsatz dieser Epoche. Wer ein Zeichen an seiner Tür '
      + 'hat, zahlt mehr; wer schlecht über das Haus redet, weniger; und solange '
      + 'das Zeichen verdeckt ist, zahlt niemand etwas.'));
    ab.appendChild(B.el('p', 'nm-p nm-offen',
      'DER NAME schreibt keinen Preis. Den Grundpreis je Fass setzt DER PREIS; '
      + 'das Aufgeld darauf bucht DER NAME hier selbst, mit welt.nimm(), unter '
      + 'eigenem Namen. Sobald DER PREIS welt.haus.rufAufschlag liest, hört das '
      + 'hier auf — damit nichts zweimal in der Kasse steht.'));
    blatt.appendChild(ab);

    var summe = B.el('div', 'nm-summen');
    [['diese Woche', Z.aufgeldWoche], ['dieses Braujahr', Z.aufgeldJahr],
     ['seit ' + epd().jahr, Z.aufgeldEpoche]]
      .forEach(function (p) {
        var s = B.el('div', 'nm-summe');
        s.appendChild(B.el('i', null, p[0]));
        s.appendChild(B.el('b', null, geld(p[1])));
        summe.appendChild(s);
      });
    blatt.appendChild(summe);

    /* GLEICHES BIER, ZWEI PREISE — je Wirt, aus den eigenen Buchungen
       gerechnet. Wer nachmisst, was ein Haus je Einheit zahlt, findet hier
       beide Zeilen nebeneinander statt nur die der FUHRE. */
    var wirte = Object.keys(Z.jeWirt);
    if (wirte.length) {
      var tab = B.el('div', 'nm-abschnitt');
      tab.appendChild(B.el('h3', null, 'Was jedes Haus für dieselbe Menge zahlt'));
      var kopfz = B.el('div', 'zeile nm-zeile nm-tabkopf');
      kopfz.appendChild(B.el('span', 'wann', 'Haus'));
      kopfz.appendChild(B.el('span', 'was', 'Menge · Rechnung der Fuhre · Aufgeld des Namen'));
      kopfz.appendChild(B.el('span', 'zahl', 'je ' + B.welt.mengeEinheit()));
      tab.appendChild(kopfz);
      wirte.sort(function (a2, b2) { return Z.jeWirt[b2].rechnung - Z.jeWirt[a2].rechnung; });
      wirte.forEach(function (n) {
        var w = Z.jeWirt[n];
        var einh = (B.welt.zeit.jahr >= 1872) ? w.menge * 1.5 : w.menge;   /* 1 Fass = 150 l */
        var ohne = einh > 0 ? w.rechnung / einh : 0;
        var mit = einh > 0 ? (w.rechnung + w.aufgeld) / einh : 0;
        var z = B.el('div', 'zeile nm-zeile gut');
        z.appendChild(B.el('span', 'wann', n));
        var was = B.el('span', 'was');
        was.appendChild(document.createTextNode(B.welt.menge(w.menge) + ' · '
          + geld(w.rechnung) + ' · '));
        was.appendChild(B.el('b', 'nm-mehr', '+' + geld(w.aufgeld)));
        z.appendChild(was);
        z.appendChild(B.el('span', 'zahl', B.zahl(ohne, 1) + ' → ' + B.zahl(mit, 1)));
        tab.appendChild(z);
      });
      blatt.appendChild(tab);
    }

    var liste = B.el('div', 'nm-register nm-buch rolle');
    if (!Z.buch.length) {
      liste.appendChild(B.el('div', 'zeile',
        'Noch keine Buchung. Es fällt an, sobald eine Fuhre ankommt und das Zeichen '
        + 'dabei zu sehen ist.'));
    }
    Z.buch.slice().reverse().forEach(function (e) {
      var z = B.el('div', 'zeile nm-zeile gut');
      z.appendChild(B.el('span', 'wann', e.jahr + ', W' + e.woche));
      var was = B.el('span', 'was');
      was.appendChild(B.el('i', 'nm-wer', e.wohin));
      was.appendChild(document.createTextNode(' — Rechnung ' + geld(e.rechnung)
        + ' · Satz ' + B.zahl(e.satz * 100, 1) + ' im Hundert · Ruf ' + e.ruf));
      z.appendChild(was);
      z.appendChild(B.el('span', 'zahl', '+' + B.zahl(e.betrag)));
      liste.appendChild(z);
    });
    blatt.appendChild(liste);
  }

  function zeichneBlatt() {
    var f = B.ebene('blatt', ICH);
    B.leere(f);
    if (!Z.blatt) return;

    var blatt = B.el('div', 'blatt nm-blatt');
    blatt.setAttribute('data-blatt', 'name');

    var kopf = B.el('div', 'nm-bkopf');
    var links = B.el('div', 'nm-bkopf-text');
    links.appendChild(B.el('h2', null, 'Das Zeichen des Hauses · ' + jahr()));
    links.appendChild(B.el('div', 'nm-unterzeile',
      'Ruf ' + ruf() + ' · Bekanntheit ' + Math.round(Z.bekannt) + ' von ' + epd().deckel
      + ' · Deckung ' + Math.round(Z.deckung) + ' · Keller-Güte ' + guete()
      + ' · Aufgeld dieses Braujahr ' + geld(Z.aufgeldJahr)));
    kopf.appendChild(links);

    var reiter = B.el('div', 'nm-reiter');
    [['zeichen', 'DAS ZEICHEN'], ['register', 'DAS REGISTER (' + Z.register.length + ')'],
     ['aufgeld', 'DAS AUFGELD (' + B.zahl(Z.aufgeldEpoche) + ')']]
      .forEach(function (r) {
        reiter.appendChild(B.knopf({
          text: r[1], zug: 'name:reiter:' + r[0],
          klasse: 'nm-knopf nm-reiterknopf' + (Z.blatt === r[0] ? ' nm-an' : ''),
          tu: function () { zeigeBlatt(r[0]); }
        }));
      });
    reiter.appendChild(B.knopf({
      text: 'Schließen', zug: 'name:blatt-zu', klasse: 'nm-knopf',
      tu: function () { zeigeBlatt(null); }
    }));
    kopf.appendChild(reiter);
    blatt.appendChild(kopf);

    var koerper = B.el('div', 'nm-koerper rolle');
    if (Z.blatt === 'register') reiterRegister(koerper);
    else if (Z.blatt === 'aufgeld') reiterAufgeld(koerper);
    else reiterZeichen(koerper);
    blatt.appendChild(koerper);

    f.appendChild(blatt);
  }

  /* ======================================================================
     8 — DIE HARTE REGEL: kein Zustand ohne wirksamen Zug
     ====================================================================== */

  function pruefeLebendig() {
    /* Ein Zug dieses Stuecks, der KEIN Geld kostet und den Zustand aendert,
       muss immer erreichbar sein. Gemessen wird am DOM, nicht behauptet. */
    var frei = 0;
    var f1 = document.getElementById('fach-kopf-' + ICH);
    var f2 = document.getElementById('fach-blatt-' + ICH);
    [f1, f2].forEach(function (fach) {
      if (!fach) return;
      fach.querySelectorAll('button[data-zug]').forEach(function (k) {
        if (k.disabled) return;
        var zug = k.getAttribute('data-zug') || '';
        /* Ein Blatt zu oeffnen ist kein Zug. Gezaehlt wird nur, was den
           Zustand des Hauses aendert und dabei kein Geld kostet. */
        if (zug === 'name:blatt' || zug === 'name:blatt-zu' || zug === 'name:band'
          || zug === 'name:aufgeldbuch' || zug.indexOf('name:reiter') === 0) return;
        var p = k.getAttribute('data-preis');
        if (!p || Number(p) >= 0) frei++;
      });
    });
    Z.lebendig = frei > 0;
    return Z.lebendig;
  }

  /* Der naechste sinnvolle Zug dieses Stuecks — aber NIE mit Preis 0,
     sonst zerlegt es die Deckungszahl des Kerns fuer alle vier Stuecke. */
  function meldeZug() {
    var billigster = null;
    traegerListe().forEach(function (t) {
      if (!t.preis || laeuft(t) || (t.ab && jahr() < t.ab)) return;
      if (t.art === 'fest' && Z.fest[t.k]) return;
      if (t.art === 'schutz' && !Z.nachahmung) return;
      if (t.art === 'notbremse') return;
      if (!billigster || t.preis < billigster.preis) billigster = t;
    });
    if (billigster) B.welt.meldeZug(billigster.name, billigster.preis);
  }

  /* ======================================================================
     9 — ANMELDUNG
     ====================================================================== */

  var nachtrag = false;

  function zeichne() {
    if (!D) return;
    /* Das Aufgeld wird faellig, sobald DIE FUHRE geliefert hat — also im
       selben Augenblick, in dem der Spieler den Knopf drueckt, nicht erst
       am Wochenende. Kommt dabei Geld herein, wird EINMAL nachgezeichnet,
       damit die Kopfleiste nicht eine Handlung hinterherhinkt. */
    var kam = 0;
    B.wage('name.aufgeld', function () { kam = kassiereAufgeld(); });
    if (kam > 0 && !nachtrag) {
      nachtrag = true;
      window.setTimeout(function () {
        nachtrag = false;
        B.sende('zeichne', { grund: 'name-aufgeld' });
      }, 0);
    }
    B.wage('name.platte', zeichnePlatte);
    B.wage('name.band', zeichneBand);
    B.wage('name.blatt', zeichneBlatt);
    B.wage('name.zug', meldeZug);
    B.wage('name.lebendig', pruefeLebendig);
  }

  B.stueck(ICH, {

    aufbau: function () {
      if (!D) { B.klage('name', 'name-daten.js fehlt'); return; }
      var e = ep();
      /* Ein Haus von 1350 hat schon einen Namen; ein Haus von 1970 hat einen
         Ruf, den seine Vorfahren gebaut haben. Das ist die Ausgangslage,
         nicht das Verdienst des Spielers — DAS ERBE nimmt sie spaeter. */
      Z.bekannt = [18, 27, 41, 53][e - 1];
      Z.deckung = [55, 58, 60, 62][e - 1];
      Z.adlerRuf = [7, 12, 22, 34][e - 1];
      Z.kieserWoche = B.wuerfel.ganz(4, 14);
      /* Was vor dem Start im Protokoll steht, gehoert nicht diesem Stueck. */
      Z.buchStand = B.protokoll ? B.protokoll.length : 0;

      /* Was die Vorfahren hinterlassen haben. Es traegt genau EIN Braujahr:
         Ende des Jahres laeuft es aus und muss entschieden werden. */
      if (e === 1) Z.zeiger = true;                     /* der Zeiger haengt */
      if (e === 2) Z.schilder.lindenhof = jahr();       /* ein geerbtes Schild */
      if (e >= 2) Z.fest.zunftzeichen = jahr() - 40;
      if (e >= 3) { Z.fest.krug = jahr() - 90; Z.krugAb = jahr() - 78; }
      if (e === 3) { Z.lauf.etikett = jahr(); Z.lauf.saeule = jahr(); }
      if (e === 4) { Z.lauf.kronkorken = jahr(); Z.lauf.bande = jahr(); }
      Z.register.push({
        jahr: jahr(), woche: woche(), wer: 'Das Haus', art: 'anfang', gewicht: 0,
        erloschen: false, erloschDurch: 0, loeschte: 0,
        text: 'Das Haus führt den Anker seit ' + B.welt.haus.gegruendet
          + '. Was er bedeutet, sagen andere.'
      });
      Z.meldung = epd().satz;
      veroeffentliche();
    },

    zeichne: zeichne,

    woche: function () { B.wage('name.woche', wochenlauf); },

    jahr: function () { B.wage('name.jahr', jahreslauf); },

    epoche: function (d) { B.wage('name.epoche', function () { epochenlauf(d); }); },

    erbfall: function (d) {
      /* Der Ruf geht mit, die Aufmerksamkeit nicht. Wer uebernimmt, muss
         den Namen neu vor die Leute tragen. */
      Z.bekannt = Math.max(0, Z.bekannt - 5);
      Z.register.push({
        jahr: jahr(), woche: woche(), wer: 'Das Haus', art: 'erbfall', gewicht: 0,
        erloschen: false, erloschDurch: 0, loeschte: 0,
        text: (d && d.amtszeit ? d.amtszeit.name : 'Der Nachfolger')
          + ' übernimmt den Namen. Das Register geht mit, die Aufmerksamkeit nicht.'
      });
      if (Z.fest.krug && jahr() >= Z.krugAb) {
        Z.register.push({
          jahr: jahr(), woche: woche(), wer: 'Das Haus', art: 'spaet', gewicht: 3,
          erloschen: false, erloschDurch: 0, loeschte: 0,
          text: 'Der gemarkte Krug, eingeführt vor dem Erbfall, trägt jetzt.'
        });
        Z.deckung = Math.min(100, Z.deckung + 3);
      }
      veroeffentliche();
    }
  });

  /* Escape schliesst auch dieses Blatt — Zustaendigkeit §2, bis der Kern
     die Sperrschicht bekommt, macht es jedes Blatt fuer sich. */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && Z.blatt) { zeigeBlatt(null); }
  });

  /* ======================================================================
     10 — WAS ANDERE STUECKE UND EIN PRUEFER LESEN DUERFEN
     Lesen frei, schreiben nur hier. DER PREIS braucht nur .aufschlag().
     ====================================================================== */
  B.ruf = {
    wert: function () { return ruf(); },
    bekannt: function () { return Math.round(Z.bekannt); },
    ziel: zielBekannt,
    ruhe: function () { return !!Z.ruhe; },
    deckung: function () { return Math.round(Z.deckung); },
    aufschlag: aufschlag,
    guete: guete,
    medium: function () { return epd().medium; },
    versprechen: versprechen,
    nachgeahmt: function () { return !!Z.nachahmung; },
    nachbar: function () { return Math.round(Z.adlerRuf); },
    register: function () { return Z.register.slice(); },
    /* Zum Nachmessen ohne Quelltext: was der Ruf eingebracht hat. */
    aufgeld: function () {
      return { woche: Z.aufgeldWoche, jahr: Z.aufgeldJahr, epoche: Z.aufgeldEpoche,
        gesamt: Z.aufgeldGesamt, buchungen: Z.buch.length };
    },
    jeWirt: function () {
      var o = {};
      Object.keys(Z.jeWirt).forEach(function (k) {
        var w = Z.jeWirt[k];
        var einh = (B.welt.zeit.jahr >= 1872) ? w.menge * 1.5 : w.menge;
        o[k] = { menge: w.menge, rechnung: w.rechnung, aufgeld: w.aufgeld,
          jeEinheitOhne: einh ? B.rund(w.rechnung / einh, 2) : 0,
          jeEinheitMit: einh ? B.rund((w.rechnung + w.aufgeld) / einh, 2) : 0 };
      });
      return o;
    },
    satz: satzFuer,
    etat: function () { return { plaetze: etatPlaetze(), belegt: etatBelegt() }; },
    aktiv: function () { return aktiveZeilen().length; },
    lebendig: pruefeLebendig,
    blatt: zeigeBlatt
  };

})(window.BRAUHAUS);
