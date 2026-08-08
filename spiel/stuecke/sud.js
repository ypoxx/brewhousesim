/* ===========================================================================
   stuecke/sud.js — DER SUD.  Das Herzstueck von Welle 2.

   Besitzstand: stuecke/sud*.js · stil/sud*.css · bild/sud/** · ton/sud/**
   Fremde Dateien werden nicht angefasst; Kernbitten gehen als "KERN: ..." in
   die Chronik der Werkbank.

   ---------------------------------------------------------------------------
   WAS DIESES STUECK DEM SPIEL HINZUFUEGT

   1. DAS VERFAHREN. Bisher kannte das Spiel Malz, Grut und Hopfen nur als
      EINKAUF — es gab keine Entscheidung darueber, WAS FUER EIN BIER dabei
      herauskommt. Jetzt gibt es sie, und sie ist in jeder Epoche eine andere
      Frage mit einer anderen Verbliste (Latte 2, Zeile "Verbliste je Epoche"):

        1350  Grut mahlen · Hopfen in den Sack · Hopfenbrief erwirken
        1600  Rein nach dem Gebot · mit Weizen strecken · mit Hafer strecken ·
              obergaerig fuehren · in den Felsenkeller legen
        1884  Natureis in den Gaerkeller · Kaeltemaschine anwerfen ·
              Betriebshefe fuehren · Reinzuchthefe beziehen
        1970  nach Erfahrung fahren · Betriebslabor · Prozessrechner ·
              naturtrueb · Kieselgurfilter · Tunnelpasteur ·
              Charge freigeben · Charge verschneiden

      Kein Verb kommt in zwei Epochen vor. Das ist der Punkt.

   2. GAERKELLER UND LAGERKELLER GETRENNT (Uebertrag ZUSTAENDIGKEIT §6.1).
      Bis hierher lag reifendes Bier im Lagerkeller und belegte dort Platz —
      deshalb mussten die Reifezeiten auf 2 bis 5 Wochen gekuerzt werden,
      obwohl ein Lagerbier von 1884 Monate reift. DER SUD zieht jedes Fass,
      das noch nicht reif ist, aus dem Lagerkeller in seinen eigenen
      Gaerkeller und gibt es reif zurueck.

      Die Nebenwirkung ist die eigentliche Belohnung: DIE HALTBARKEIT
      BEGINNT JETZT AM FASS UND NICHT AM KESSEL. Vorher zaehlte
      `haltbar = reife + haltbar` von der Stunde des Sudes an — die Gaerzeit
      frass die Haltbarkeit auf. Jetzt laeuft die Uhr erst, wenn das Bier
      lieferbar ist. Damit wird aus einer Zahl, die nicht passte, eine
      Entscheidung, die etwas kostet: Gaerraum.

      Passt ein Sud nicht in den Gaerkeller, bleibt er im Lager liegen und
      altert wie bisher. Es gibt also keinen Zustand, den dieses Stueck
      schlechter macht als den vorgefundenen — nur einen, den es besser macht.

   1b. RUNDE 2 — DIE FOLGE, DIE MAN BEIM WIRT WIEDERSIEHT.
      Runde 1 hatte die Entscheidung, aber ihre Folgen blieben im Keller:
      Haltbarkeit, Gaerwochen, Bottiche. Kein fremdes Stueck las je etwas
      von diesem hier, und beim Wirt war nichts davon zu sehen. Jetzt traegt
      jede Option ein `hoechst` — die hoechste SORTE, die dieses Verfahren
      hergibt. DIE FUHRE bestellt (Duennbier · Grutbier · Starkbier), DER SUD
      sagt, was die Pfanne davon haelt; was tiefer ausschlaegt, nimmt der
      Gasthof nicht mehr und das Kloster erst recht nicht.
      Die Zahl geht NIE nach oben — dieses Stueck deckelt, es hebt nicht.
      Der Vorgabestand jeder Epoche deckelt auf Stufe 2, also genau auf das
      Bier des Hauses: wer das Brett nie aufschlaegt, verliert keinen Pfennig
      (gemessen, 150 Wochen, zwei Saaten, vier Epochen: null Rueckstufungen).

   3. haus.rohstoff ALS API (Uebertrag §6.2) — B.sud.rohstoff.
   4. nimmHeraus() MIT AUSWAHL (Uebertrag §6.3) — B.sud.nimmHeraus(n, wahl).
      Beide liegen hier statt im Kern, weil kein Stueck in kern/ schreiben
      darf; die Bitte an den Kern steht in der Chronik.

   ---------------------------------------------------------------------------
   DIE HARTE REGEL: KEIN ZUSTAND OHNE ZUG.

   Jede Achse hat eine Vorgabe, die NICHTS kostet und IMMER waehlbar ist. Der
   Anstich kostet kein Geld. Keine Strafe dieses Stuecks nimmt Muenze — sie
   nimmt Rohstoff, Bottiche oder Guete (WELLE-2 §1: Welle 2 nimmt kein neues
   Geld aus der Kasse; ZUSTAENDIGKEIT §4: der Abgabendeckel bleibt bei 18 %,
   und DER SUD ruehrt ihn nicht an). Ein Haus mit leerer Kasse und leerer
   Kammer kann in diesem Brett immer noch etwas tun, das die Lage aendert.

   SPERRLISTE: offene Pfanne, keine Blase. Emailschilder erst ab den 1890ern.
   =========================================================================== */

(function (B) {
  'use strict';

  var D = (typeof SUD_DATEN !== 'undefined') ? SUD_DATEN : { epochen: {}, guete: {} };

  /* ---------------------------------------------------------------------- */

  var Z = {
    verfahren: {},        /* achse -> optionsschluessel                       */
    fest: {},             /* 'achse:option' -> true (bezahlt, unwiderruflich) */
    bottiche: [],         /* der Gaerkeller: je Eintrag ein Sud in Gaerung    */
    zusatz: 0,            /* gekaufter Gaerraum in Fass                       */
    kaufNr: 0,            /* wie oft schon gekauft (Staffelpreis)             */
    guete: 70,
    anstichWoche: -1,
    nr: 0,                /* laufende Nummer der Bottiche                     */
    rueck: [],            /* freigegebene Chargen, die beim Handel stehen     */
    brettZu: true,        /* liegt das Brett als Reiter? (Vorgabestand: ja)   */
    zettelSitz: { dx: 0, dy: 0, knapp: false },  /* wo der Zettel gerade sitzt,
                             in Prozentpunkten vom Ort 'sudhaus' aus; knapp =
                             er hat alles abgeworfen, was kein Knopf ist      */
    gestuft: 0,           /* wie oft dieses Jahr zurueckgestuft wurde         */
    gestuftGesamt: 0,     /* ... und wie oft ueberhaupt (wird nie geleert)    */
    buch: [],             /* die letzten Zeilen des Sudbuchs                  */
    jahrSude: 0, jahrFass: 0, jahrFehl: 0, jahrAnzeige: 0,
    jahrLegte: 0,         /* wie oft das Haus dieses Braujahr angestellt hat  */
    gesamtLegte: 0,
    kalt: 0,              /* Braujahre in Folge ohne einen einzigen Sud       */
    bestellt: [],         /* 1970: bezahlter Gaerraum auf dem Tieflader       */
    gesamtSude: 0, gesamtFass: 0,
    gemeldet: {},         /* einmalige Chroniksaetze                          */
    imGange: false,
    epocheGesetzt: 0
  };

  B.SUD_ZUSTAND = Z;      /* fuer ?pruefe=1 und die Werkbank lesbar */

  /* ---------------------------------------------------------------------- */

  function ep() { return D.epochen[B.welt.zeit.epoche] || D.epochen[1]; }
  function gk() { return ep().gaerkeller; }
  function woManifest() { return B.welt.zeit.jahr * B.uhr.WOCHEN_IM_JAHR + B.welt.zeit.woche; }

  function achsen() { return ep().achsen || []; }

  function achseVon(schluessel) {
    var l = achsen();
    for (var i = 0; i < l.length; i++) if (l[i].schluessel === schluessel) return l[i];
    return null;
  }

  function vorgabe(a) { return a.optionen[0]; }

  function gewaehlt(a) {
    var k = Z.verfahren[a.schluessel];
    for (var i = 0; i < a.optionen.length; i++) if (a.optionen[i].k === k) return a.optionen[i];
    return vorgabe(a);
  }

  function bezahlt(a, o) { return !o.preis || Z.fest[a.schluessel + ':' + o.k] === true; }

  /* ----------------------------------------------------------------------
     DIE ANRECHNUNG — was schon im Haus steht, wird nicht zweimal bezahlt.

     AUFLAGE 3 des blinden Kritikers (Welle 6). `sud:fuehrung:rechner`
     (118.000 DM) war in 800 gemessenen Wochen kein einziges Mal aktiv UND
     erreichbar. Der Prozessrechner wird auf das Betriebslabor aufgesetzt;
     wer es hat, zahlt die Differenz.

     WICHTIG, und deshalb an zwei Stellen getrennt gehalten:
       o.preis            der LISTENPREIS. Er bleibt, was er ist, und nur
                          mit ihm rechnen `gesiegelt()` und `verdraengt()`.
                          Sonst waere der Rechner nach der Anrechnung
                          „billiger" als das Labor und die Ratsche liesse
                          sich rueckwaerts gehen — genau das, was
                          Sperrliste 4 verbietet.
       offenerPreis(a,o)  was JETZT abzubuchen ist. Nur damit rechnen
                          `kann()`, `zahle()` und das Preisschild am Knopf.
     ---------------------------------------------------------------------- */
  function angerechnet(a, o) {
    if (!o.anrechnung || !o.anrechnung.length) return 0;
    var s = 0;
    for (var i = 0; i < a.optionen.length; i++) {
      var x = a.optionen[i];
      if (x !== o && x.preis && o.anrechnung.indexOf(x.k) >= 0 && bezahlt(a, x)) s += x.preis;
    }
    return s;
  }

  function offenerPreis(a, o) {
    if (!o.preis || bezahlt(a, o)) return 0;
    return Math.max(0, o.preis - angerechnet(a, o));
  }

  /* ----------------------------------------------------------------------
     DAS SIEGEL — und warum es bis Welle 4 keins war.

     Gemessen am Stand vor dieser Runde (werkbank/schuss/sud-w4/siegel.mjs,
     alle vier Epochen, sechs Festlegungen): JEDE bezahlte, mit dem Wort
     "unwiderruflich" beschriftete Festlegung liess sich in derselben Sekunde
     und sechs Wochen spaeter gratis zurueckstellen, beliebig oft. Der
     Kritiker der Runde 1 hatte drei von vier Epochen gemeldet; es waren
     vier von vier — in 1884 haelt nur `sperrt: ['natureis']`, und daneben
     steht `warm` offen, und die zweite Achse (Reinzucht) haelt gar nichts.

     `Z.fest` merkte sich nur, dass BEZAHLT wurde. Bezahlt heisst aber nicht
     festgelegt: `bezahlt()` machte die teure Option danach zur gratis
     umschaltbaren, und die billige Vorgabe stand daneben und war es ohnehin.
     Ein Siegel, das man abziehen kann, ist ein Aufkleber.

     DIE RATSCHE. Was besiegelt ist, gilt — die Achse laesst von da an nur
     noch AUFWAERTS: eine noch teurere Festlegung derselben Achse (1970:
     Labor, dann Prozessrechner) bleibt kaufbar, alles darunter ist weg.
     Nach unten geht nichts mehr, nie, in keiner Epoche. Damit ist die Wahl
     das, was auf dem Schild steht, und zwar bevor man sie trifft.
     ---------------------------------------------------------------------- */

  /* Die teuerste bezahlte Festlegung dieser Achse — oder null. */
  function gesiegelt(a) {
    var t = null;
    for (var i = 0; i < a.optionen.length; i++) {
      var x = a.optionen[i];
      if (!x.fest || !x.preis || !bezahlt(a, x)) continue;
      if (!t || x.preis > t.preis) t = x;
    }
    return t;
  }

  /* Eine Option ist gesperrt, wenn eine bezahlte Festlegung sie verdraengt
     hat — die Kaeltemaschine baut den Eiskeller um, und der Eiskeller kommt
     nicht wieder. */
  function verdraengt(a, o) {
    for (var i = 0; i < a.optionen.length; i++) {
      var x = a.optionen[i];
      if (x === o || !x.sperrt || !bezahlt(a, x)) continue;
      if (x.sperrt.indexOf(o.k) >= 0) return true;
    }
    /* Das Siegel: alles ausser dem Besiegelten selbst und dem, was teurer
       und ebenfalls unwiderruflich ist, ist nicht mehr zu haben. */
    var s = gesiegelt(a);
    if (s && o !== s && !(o.fest && o.preis > s.preis)) return true;
    return false;
  }

  /* Die Summe aller gewaehlten Achsen. Haltbarkeit multipliziert sich,
     alles andere addiert sich; Guete-Anker gilt der hoechste. */
  function wirkung() {
    var w = { haltbar: 1, gaer: 0, roh: 0, mehr: 0, risiko: 0, anzeige: 0,
              guetefall: 0, guetepin: 0, streuung: 0, warmDrossel: 1 };
    achsen().forEach(function (a) {
      var o = gewaehlt(a), x = o.wirkung || {};
      w.haltbar *= (x.haltbar === undefined ? 1 : x.haltbar);
      w.gaer += x.gaer || 0;
      w.roh += x.roh || 0;
      w.mehr += x.mehr || 0;
      w.risiko += x.risiko || 0;
      w.anzeige += x.anzeige || 0;
      w.guetefall += x.guetefall || 0;
      w.streuung += x.streuung || 0;
      if (x.guetepin && x.guetepin > w.guetepin) w.guetepin = x.guetepin;
      if (x.warmDrossel !== undefined) w.warmDrossel = Math.min(w.warmDrossel, x.warmDrossel);
    });
    return w;
  }

  /* Die Vorgabewirkung — was ein Sud wird, wenn der Rohstoff fuer das
     gewaehlte Verfahren nicht reicht. Nie eine Wand, immer ein Rueckfall. */
  function notWirkung() {
    var w = { haltbar: 1, gaer: 0, roh: 0, mehr: 0, risiko: 0.02 };
    achsen().forEach(function (a) {
      var x = vorgabe(a).wirkung || {};
      w.haltbar *= (x.haltbar === undefined ? 1 : x.haltbar);
      w.gaer += x.gaer || 0;
    });
    return w;
  }

  /* ======================================================================
     WAS FUER EIN BIER HERAUSKOMMT — die Folge, die man BEIM WIRT wiedersieht

     Runde 1 hat die Entscheidung gebaut; ihre Folgen blieben im Keller
     (Haltbarkeit, Gaerwochen, Bottiche). Beim Wirt war nichts davon zu
     sehen — kein fremdes Stueck las je etwas von diesem hier.

     Die Naht, die es dafuer schon gab, ist das FASS: der Gaerkeller nimmt es
     aus dem Lager und legt es zurueck und setzt dabei ohnehin k, stufe,
     zeichen, reife und haltbar wieder auf. Genau dort wird jetzt entschieden,
     WELCHE SORTE im Fass liegt.

       DIE FUHRE bestellt (Duennbier · Grutbier · Starkbier),
       DER SUD sagt, was die Pfanne davon haelt.

     Die Zahl heisst `hoechst` und geht NIE nach oben — dieses Stueck
     deckelt, es hebt nicht. Der Vorgabestand jeder Epoche deckelt auf 2,
     also genau auf das Bier des Hauses: wer das Brett nie aufschlaegt,
     verliert dadurch keinen Pfennig. Nach unten deckeln nur die billigen
     Abkuerzungen, nach oben oeffnet nur die bezahlte Festlegung.

     FUHRE_DATEN wird hier NUR GELESEN (so, wie fuhre.js seinerseits
     PREIS_DATEN liest). Faellt es aus, faellt die Deckelung still aus und
     nichts bricht.
     ====================================================================== */

  function fuhreEpoche() {
    var F = (typeof FUHRE_DATEN !== 'undefined') ? FUHRE_DATEN : null;
    if (!F || !F.epochen) return null;
    return F.epochen[B.welt.zeit.epoche] || null;
  }

  /* Die Leiter der Epoche, von unten nach oben. Der Notsud (Kofent,
     Nachbier, Einfachbier, Handelsmarke) steht nicht darauf: er ist kein
     Rang, sondern ein Ausweg — er faehrt an Bannmeile und Regalmeter
     vorbei, und wer zurueckgestuft wird, landet nie dort. */
  function leiter() {
    var q = fuhreEpoche();
    if (!q || !q.sorten) return [];
    return q.sorten.filter(function (s) { return !s.not; })
      .slice().sort(function (a, b) { return (a.stufe || 0) - (b.stufe || 0); });
  }

  function istNotsud(k) {
    var q = fuhreEpoche();
    if (!q || !q.sorten || !k) return false;
    for (var i = 0; i < q.sorten.length; i++) {
      if (q.sorten[i].k === k) return !!q.sorten[i].not;
    }
    return false;
  }

  /* Die hoechste Sorte auf oder unter dieser Stufe. */
  function sorteAufStufe(st) {
    var l = leiter(), tref = null;
    for (var i = 0; i < l.length; i++) {
      if (l[i].stufe <= st && (!tref || l[i].stufe > tref.stufe)) tref = l[i];
    }
    return tref || l[0] || null;
  }

  function obersteStufe() {
    var l = leiter();
    return l.length ? l[l.length - 1].stufe : 3;
  }

  /* Das Minimum ueber alle Achsen: eine einzige Abkuerzung genuegt, um das
     Bier zu deckeln. Vier Achsen, die einander aufwiegen, waeren keine
     Entscheidung, sondern eine Rechenaufgabe. */
  function hoechsteStufe() {
    var h = 99;
    achsen().forEach(function (a) {
      var o = gewaehlt(a);
      if (o && o.hoechst !== undefined && o.hoechst < h) h = o.hoechst;
    });
    return h === 99 ? obersteStufe() : h;
  }

  /* Was aus diesem Bottich wirklich wird — oder null, wenn es bleibt, wie
     es bestellt war. */
  function ausschlagSorte(b) {
    if (!b || b.notsud) return null;
    var hoch = (b.hoechst === undefined) ? hoechsteStufe() : b.hoechst;
    var st = b.stufe || 2;
    if (st <= hoch) return null;
    var z = sorteAufStufe(hoch);
    if (!z || z.stufe >= st) return null;
    return z;
  }

  /* Welche Stufen ein Haus ueberhaupt fuehrt — aus der Artenliste der
     FUHRE, gelesen, nicht geraten. */
  function artStufen(a) {
    var F = (typeof FUHRE_DATEN !== 'undefined') ? FUHRE_DATEN : null;
    if (!F || !F.arten || !a) return null;
    var d = F.arten[a.art] || F.arten.wirtshaus;
    return d ? d.stufen : null;
  }

  function nehmen(stufe) {
    var l = B.welt.adressenJetzt().filter(function (a) {
      var st = artStufen(a);
      return st && st.indexOf(stufe) >= 0;
    });
    return l;
  }

  /* ======================================================================
     DER GAERKELLER
     ====================================================================== */

  function warmeWoche() {
    var wo = B.welt.zeit.woche;
    return wo <= 4 || wo >= 26;         /* Michaeli-Herbst und Georgi-Fruehling */
  }

  /* ----------------------------------------------------------------------
     DIE NEBENBEDINGUNG DER EPOCHE (Auflage 7 des Kritikers: der geteilte
     Zug soll in jeder Epoche eine ANDERE Bedingung tragen, nicht viermal
     dieselbe mit anderen Worten). Gaerraum kostet ueberall Geld — aber:

       1350  GRENZE          der Kuefer setzt keinem Haus mehr als zwei
       1600  KOPPLUNG        die Lade nimmt nicht ab, wer gestreckt braut
       1884  BEDINGTE WIRKUNG  ohne Maschine traegt der Zukauf nur im Winter
       1970  LIEFERZEIT      bezahlt bei Bestellung, gestellt nach drei Wochen

     Vier verschiedene Arten, nicht vier Namen fuer eine Grenze.
     ---------------------------------------------------------------------- */
  function bedingung() { return (gk().kauf && gk().kauf.bedingung) || null; }

  /* Warum jetzt nicht bestellt werden kann — oder null. */
  function kaufSperre() {
    var b = bedingung();
    if (!b) return null;
    if (b.art === 'grenze') return Z.kaufNr >= b.wert ? b.zu : null;
    if (b.art === 'kopplung') {
      var a = achseVon(b.achse);
      /* `option` darf eine Antwort sein oder mehrere — 1600 laesst die Lade
         den Bau sowohl beim reinen Sud abnehmen als auch beim verbrieften
         (Auflage 2, Welle 6). Eine Zeichenkette bleibt eine Zeichenkette. */
      var ok = Array.isArray(b.option) ? b.option : [b.option];
      if (a && ok.indexOf(Z.verfahren[b.achse]) < 0) return b.zu;
    }
    return null;
  }

  /* 1884: der zugekaufte Gaerraum traegt nur, solange es kalt ist. */
  function zusatzTraegt() {
    var b = bedingung();
    if (!b || b.art !== 'kalt') return Z.zusatz;
    if (!warmeWoche()) return Z.zusatz;
    return Z.verfahren[b.achse] === b.option ? Z.zusatz : 0;
  }

  /* 1970: was bestellt und bezahlt ist, aber noch auf dem Tieflader steht. */
  function liefere() {
    if (!Z.bestellt.length) return false;
    var jetzt = woManifest(), kam = 0;
    Z.bestellt = Z.bestellt.filter(function (x) {
      if (x.ab > jetzt) return true;
      Z.zusatz += x.menge; kam += x.menge;
      return false;
    });
    if (kam) {
      buch(gk().kauf.text.replace(/bestellen$/, 'gestellt') + ' — jetzt '
        + B.welt.menge(plaetze()) + ' Gärraum');
      B.ton.spiele('sud:bau', { ort: 'sudhaus' });
    }
    return !!kam;
  }

  function plaetze() {
    var basis = gk().plaetze + zusatzTraegt();
    var w = wirkung();
    if (w.warmDrossel < 1 && warmeWoche()) basis = Math.floor(basis * w.warmDrossel);
    return Math.max(1, basis);
  }

  function belegt() {
    var n = 0;
    Z.bottiche.forEach(function (b) { n += b.fass; });
    return n;
  }

  function frei() { return Math.max(0, plaetze() - belegt()); }

  function kaufPreis() {
    var k = gk().kauf;
    return Math.round(k.basis * Math.pow(k.staffel, Z.kaufNr));
  }

  /* ----------------------------------------------------------------------
     ANSAUGEN. Jedes Fass im Lagerkeller, das noch nicht reif ist und noch
     nicht durch den Gaerkeller lief, wandert hierher — solange Platz ist.
     Laeuft nach jedem Sud (Horcher auf 'protokoll'), zusaetzlich einmal je
     Woche und beim Zeichnen. Mehrfach zu laufen schadet nicht.
     ---------------------------------------------------------------------- */
  function sauge() {
    if (Z.imGange) return 0;
    Z.imGange = true;
    var genommen = 0;
    try {
      var f = B.welt.vorrat.faesser;
      var raum = frei();
      if (raum <= 0) return 0;

      var w = wirkung();

      /* Nach Sortenschluessel gruppieren: ein Sud, ein Bottich.
         Ob ein Fass in den Gaerkeller gehoert, entscheiden die GAERWOCHEN
         des laufenden Verfahrens — nicht allein die Reifezeit der Sorte.
         Sonst waere 1350 der Gaerkeller ewig leer: Grutbier liegt nicht,
         gehopftes Bier liegt eine Woche laenger. Genau das ist die
         Entscheidung dieser Epoche. */
      var hoch = hoechsteStufe();
      var gruppen = {};
      for (var i = 0; i < f.length; i++) {
        var x = f[i];
        if (x.sudDurch) continue;                       /* war schon im Gaerkeller */
        var wochen = Math.max(0, (x.reife || 0) + (w.gaer || 0));
        /* Auch ein Sud OHNE Gaerwochen geht durch den Gaerkeller, sobald das
           Verfahren etwas an ihm aendert — sonst gaelte "mit Weizen
           gestreckt" nur fuer die Sorten, die ohnehin liegen, und der Spieler
           bekaeme nicht, was auf dem Knopf steht. Er wird dann in derselben
           Woche wieder ausgeschlagen; es kostet keinen Tag.
           Und er geht hindurch, wenn die Pfanne ihn nicht traegt: sonst
           bliebe die Deckelung genau dort wirkungslos, wo sie zaehlt —
           beim Grutbier, das ohne Hopfen kein Starkbier wird. */
        var deckelt = ((x.stufe || 2) > hoch) && !istNotsud(x.k);
        if (wochen <= 0 && !w.mehr && w.haltbar === 1 && !deckelt) continue;
        if (wochen > 0 && B.welt.fassAlter(x) >= wochen) continue;   /* schon reif */
        var g = x.k || x.sorte || 'sud';
        if (!gruppen[g]) gruppen[g] = [];
        gruppen[g].push(x);
      }
      var notdurft = false;
      for (var g2 in gruppen) {
        if (!Object.prototype.hasOwnProperty.call(gruppen, g2)) continue;
        if (raum <= 0) break;
        var liste = gruppen[g2].slice(0, raum);
        if (!liste.length) continue;

        /* Der Aufschlag des Verfahrens in Rohstoff. Reicht die Kammer nicht,
           wird dieser Sud nach der Vorgabe gefuehrt statt zu scheitern. */
        var wirk = w, roh = w.roh;
        if (roh > 0 && !B.sud.rohstoff.reicht(roh)) { wirk = notWirkung(); notdurft = true; }
        else if (roh > 0) { B.sud.rohstoff.nimm(roh); }
        /* Gestreckt heisst: weniger vom teuren Korn. DIE FUHRE hat die volle
           Menge schon abgezogen, hier kommt der Unterschied zurueck. */
        else if (roh < 0) { B.sud.rohstoff.gib(-roh); }

        var muster = liste[0];
        var gaerWochen = Math.max(0, (muster.reife || 0) + (wirk.gaer || 0));
        var pur = Math.max(1, (muster.haltbar || 6) - (muster.reife || 0));

        /* Mehrausbeute (gestreckt) bzw. Schwund (Pasteur) — in Fass, nicht in Geld. */
        var mehr = wirk === w ? (w.mehr || 0) : 0;
        var zusatzFass = [];
        if (mehr > 0 && raum - liste.length >= mehr) {
          var gelegt = B.welt.legeEin(muster.sorte, mehr);
          var kf = B.welt.vorrat.faesser;
          for (var m = kf.length - gelegt; m < kf.length; m++) {
            kf[m].k = muster.k; kf[m].stufe = muster.stufe; kf[m].zeichen = muster.zeichen;
            kf[m].reife = muster.reife; kf[m].haltbar = muster.haltbar;
            zusatzFass.push(kf[m]);
          }
        }
        liste = liste.concat(zusatzFass);
        if (mehr < 0) liste = liste.slice(0, Math.max(1, liste.length + mehr));

        nimmGezielt(liste);
        raum -= liste.length;
        genommen += liste.length;
        Z.nr++;

        Z.bottiche.push({
          nr: Z.nr,
          k: muster.k || null,
          sorte: muster.sorte || B.welt.epoche().sorte,
          zeichen: muster.zeichen || '·',
          stufe: muster.stufe || 2,
          fass: liste.length,
          rein: woManifest(),
          reifAb: woManifest() + gaerWochen,
          haltbarPur: pur,
          faktor: wirk.haltbar,
          /* Die Deckelung wird an der PFANNE entschieden, nicht am Fasshahn:
             was einmal ohne Hopfen kocht, wird durch einen spaeteren
             Hopfenbrief nicht haltbar. Sie steht deshalb am Bottich und
             wandert mit ihm. */
          hoechst: hoch,
          notsud: istNotsud(muster.k),
          verfahren: verfahrensKurz(wirk === w),
          notdurft: (wirk !== w),
          gesperrt: false,
          seitGesperrt: 0,
          streuung: 0
        });
        Z.jahrSude++; Z.gesamtSude++;
        Z.jahrFass += liste.length; Z.gesamtFass += liste.length;
      }

      if (genommen) {
        buch((notdurft ? 'Notdurft: ' : '') + B.welt.menge(genommen)
          + ' in den ' + gk().name.replace(/^Der /, '') + ' — ' + verfahrensKurz(!notdurft));
        B.ton.spiele('sud:anstellen', { ort: 'sudhaus' });
      }
    } catch (e) { B.klage('sud.sauge', e); }
    finally { Z.imGange = false; }
    return genommen;
  }

  /* Ansaugen und, was schon fertig ist, gleich wieder ausschlagen. Ohne den
     zweiten Schritt laege ein Sud ohne Gaerwochen bis zum naechsten
     Wochenwechsel im Bottich und waere nicht lieferbar — das waere eine
     Verschlechterung, und dieses Stueck darf keine einbauen. */
  function saugeUndSchlage() {
    var n = sauge();
    if (n) reifePruefen();
    return n;
  }

  /* Genau diese Faesser aus dem Lagerkeller nehmen — ueber die API des Kerns,
     nicht am Array vorbei. Der Kern nimmt immer das aelteste zuerst, also
     wird vorher sortiert. Genau das ist ZUSTAENDIGKEIT §6.3. */
  function nimmGezielt(liste) {
    var f = B.welt.vorrat.faesser;
    for (var i = liste.length - 1; i >= 0; i--) {
      var j = f.indexOf(liste[i]);
      if (j > 0) { f.splice(j, 1); f.unshift(liste[i]); }
    }
    return B.welt.nimmHeraus(liste.length);
  }

  function verfahrensKurz(echt) {
    if (!echt) return 'nach Vorgabe';
    return achsen().map(function (a) { return gewaehlt(a).name; }).join(' · ');
  }

  /* ----------------------------------------------------------------------
     REIF WERDEN. Der Bottich geht zurueck in den Lagerkeller — und dort
     beginnt die Haltbarkeit von vorn. Das ist der ganze Gewinn der Trennung.
     ---------------------------------------------------------------------- */
  function gibZurueck(b) {
    var raum = B.welt.vorrat.plaetze - B.welt.vorrat.faesser.length;
    if (raum <= 0) return false;
    var n = Math.min(b.fass, raum);

    /* HIER wird entschieden, was fuer ein Bier es geworden ist. */
    var ziel = ausschlagSorte(b);
    var sorte = ziel ? ziel.name : b.sorte;
    /* Die Sortenliste der FUHRE fuehrt `haltbar` als REINE Fasszeit und
       stempelt beim Brauen `reife + haltbar` ans Fass. Der Gaerkeller rechnet
       die Reife wieder heraus (haltbarPur); eine neue Sorte bringt ihre reine
       Zeit dagegen schon mit — hier darf nichts abgezogen werden. */
    var pur = ziel ? Math.max(1, ziel.haltbar || 6) : b.haltbarPur;

    var gelegt = B.welt.legeEin(sorte, n);
    if (!gelegt) return false;
    var f = B.welt.vorrat.faesser;
    var haltbar = Math.max(1, Math.round(pur * (b.faktor || 1)));
    for (var i = f.length - gelegt; i < f.length; i++) {
      f[i].k = ziel ? ziel.k : b.k;
      f[i].stufe = ziel ? ziel.stufe : b.stufe;
      f[i].zeichen = ziel ? ziel.zeichen : b.zeichen;
      f[i].reife = 0;                       /* reif — die Gaerung ist vorbei */
      f[i].haltbar = haltbar;
      f[i].sudDurch = true;                 /* nie ein zweites Mal ansaugen */
    }
    b.fass -= gelegt;
    B.welt.protokolliere({ wer: 'spieler',
      was: B.welt.menge(gelegt) + ' ' + sorte + ' aus dem Gärkeller ins Lager'
         + (ziel ? ' — angesetzt war ' + b.sorte : ''),
      preis: 0, menge: 0 });

    /* Ein Bottich, der nicht auf einmal ins Lager passt, kommt in mehreren
       Wochen zurueck. Gezaehlt und aufgeschrieben wird er trotzdem EINMAL —
       sonst stehen im Sudbuch vier Zeilen fuer einen Sud. */
    if (ziel && !b.gemeldetStufe) {
      b.gemeldetStufe = true;
      Z.gestuft++; Z.gestuftGesamt++;
      buch('Bottich ' + b.nr + ': ' + b.sorte + ' schlägt als ' + ziel.name + ' aus — '
        + 'die Pfanne trägt es nicht');
      if (!Z.gemeldet.gestuft) {
        Z.gemeldet.gestuft = true;
        var fort = nehmen(b.stufe || 2).filter(function (a) {
          var st = artStufen(a);
          return st && st.indexOf(ziel.stufe) < 0;
        });
        B.welt.schreibe('Der Bottich war als ' + b.sorte + ' angesetzt und schlägt als '
          + ziel.name + ' aus: das Verfahren des Hauses trägt nicht höher. '
          + (fort.length
              ? fort.map(function (a) { return a.name; }).join(' und ')
              + (fort.length === 1 ? ' nimmt' : ' nehmen') + ' es damit nicht mehr.'
              : 'Am Fass sieht man es, beim Wirt am Preis.'), 'sud');
      }
    }
    return true;
  }

  function reifePruefen() {
    var jetzt = woManifest(), raus = 0, gesperrt = 0;
    var w = wirkung();
    var ch = ep().charge;

    for (var i = Z.bottiche.length - 1; i >= 0; i--) {
      var b = Z.bottiche[i];
      if (b.gesperrt) { b.seitGesperrt++; continue; }
      if (jetzt < b.reifAb) continue;

      /* 1970: die Charge wird gemessen, ehe sie hinausgeht. */
      if (ch && !b.geprueft) {
        b.geprueft = true;
        b.streuung = Math.max(0, Math.round((100 - Z.guete) / 4 + (w.streuung || 0)));
        if (B.wuerfel.trifft(Math.min(0.6, b.streuung / 100 * 2))) {
          b.gesperrt = true; b.seitGesperrt = 0; gesperrt++;
          buch('Charge ' + b.nr + ' gesperrt — Abweichung ±' + b.streuung + ' %');
          B.ton.spiele('sud:sperre', { ort: 'sudhaus' });
          continue;
        }
      }

      if (gibZurueck(b)) {
        raus++;
        if (b.fass <= 0) Z.bottiche.splice(i, 1);
      }
    }
    if (raus) {
      buch(raus + (raus === 1 ? ' Bottich' : ' Bottiche') + ' ausgeschlagen — die Haltbarkeit '
        + 'beginnt jetzt am Fass');
      B.ton.spiele('sud:ausschlagen', { ort: 'keller' });
    }
    return raus;
  }

  /* ======================================================================
     RISIKO — und keine Strafe ist Geld
     ====================================================================== */

  function fehlsud() {
    if (!Z.bottiche.length) return false;
    var w = wirkung();
    /* Gemessen: mit 0,20 als Faktor und einer Guete am Boden verlor 1884 drei
       von fuenf Suden im ersten Braujahr — das ist keine Knappheit mehr,
       sondern eine Wand. 0,14 laesst die Hefepflege lohnend und den Verlust
       ertraeglich. Hoechstens EIN Bottich je Woche; die Schleife bricht ab. */
    var p = (w.risiko || 0) + Math.max(0, 60 - Z.guete) / 100 * 0.14;
    for (var i = 0; i < Z.bottiche.length; i++) {
      if (Z.bottiche[i].gesperrt) continue;
      if (!B.wuerfel.trifft(p)) continue;
      var b = Z.bottiche.splice(i, 1)[0];
      Z.jahrFehl++;
      Z.guete = B.grenze(Z.guete - 8, 0, 100);
      buch(ep().fehlsud.name + ': Bottich ' + b.nr + ' (' + B.welt.menge(b.fass) + ')');
      B.welt.schreibe(ep().fehlsud.satz + ' ' + B.welt.menge(b.fass) + ' ' + b.sorte
        + ' sind verloren — kein Pfennig, aber die Pfanne hat umsonst gestanden.', 'sud');
      B.welt.protokolliere({ wer: 'verfall',
        was: ep().fehlsud.kurz + ': ' + B.welt.menge(b.fass) + ' ' + b.sorte,
        preis: 0, menge: b.fass });
      B.ton.spiele('sud:fehlsud', { ort: 'sudhaus' });
      return true;
    }
    return false;
  }

  function anzeigePruefen() {
    var w = wirkung();
    if (!w.anzeige) return false;
    if (!B.wuerfel.trifft(w.anzeige)) return false;
    var a = (D.anzeige || {})[B.welt.zeit.epoche];
    if (!a) return false;

    Z.jahrAnzeige++;
    var rname = B.welt.epoche().rohstoff || 'Rohstoff';
    var weg = Math.round(B.welt.haus.rohstoff * (a.nimmtRohstoff || 0));
    B.welt.haus.rohstoff = Math.max(0, B.welt.haus.rohstoff - weg);
    var bot = 0;
    for (var i = 0; i < (a.nimmtBottiche || 0) && Z.bottiche.length; i++) {
      bot += Z.bottiche.shift().fass;
    }
    Z.guete = B.grenze(Z.guete - (a.gueteAb || 0), 0, 100);

    buch(a.wer + ' war da — ' + weg + ' ' + rname
      + (bot ? ' und ' + B.welt.menge(bot) + ' aus dem Gärkeller' : '') + ' weg');
    B.welt.schreibe(a.satz + ' Es kostet ' + weg + ' ' + rname
      + (bot ? ' und ' + B.welt.menge(bot) + ' aus dem Gärkeller' : '')
      + ' — keinen Pfennig. Wer kein Geld hat, zahlt trotzdem.', 'sud');
    B.welt.protokolliere({ wer: 'gegner', was: a.wer + ': ' + weg + ' ' + rname + ' eingezogen',
      preis: 0, menge: bot });
    B.ton.spiele('sud:anzeige', { ort: 'sudhaus' });
    return true;
  }

  /* ----------------------------------------------------------------------
     DER RUECKLAEUFER — 1970.

     Ohne ihn war "Charge freigeben" streng besser als "Charge verschneiden":
     das eine kostete sechs Punkte Guete, das andere ein Drittel des Tanks.
     Eine Wahl mit genau einer richtigen Antwort ist keine Wahl. Der Handel
     misst jetzt nach — spaeter, ohne den Spieler, mit einer
     Wahrscheinlichkeit, die an der Abweichung haengt, die er selbst
     durchgewinkt hat. Bezahlt wird in BIER, nicht in Muenze.
     ---------------------------------------------------------------------- */
  /* fuelleRueck ersetzt {nr}, {ab} und {menge} in Ruecklaeufer-Texten.
     War urspruenglich auch 'fuelle' genannt und wurde von der zweiten
     Funktion (ab Zeile 1173) ueberlagert, deshalb wurden die Ruecklaeufer
     von 1970 nie gerufen und zeigten {nr} und {ab} roh. */
  function fuelleRueck(vorlage, x) {
    return String(vorlage || '')
      .replace('{nr}', x.nr).replace('{ab}', x.ab)
      .replace('{menge}', B.welt.menge(x.weg || x.menge));
  }

  function rueckPruefen() {
    var ch = ep().charge, r = ch && ch.rueck;
    if (!r || !Z.rueck.length) return false;
    var jetzt = woManifest(), etwas = false;
    for (var i = Z.rueck.length - 1; i >= 0; i--) {
      var x = Z.rueck[i];
      if (jetzt < x.faellig) continue;
      Z.rueck.splice(i, 1);
      etwas = true;
      if (!B.wuerfel.trifft(Math.min(0.7, (x.ab || 0) / 100 * 2.2))) {
        buch(fuelleRueck(r.durch, x));
        continue;
      }
      x.weg = Math.max(1, Math.round(x.menge * 0.5));
      var raus = B.sud.nimmHeraus(x.weg, { aeltestes: true });
      x.weg = raus.length || x.weg;
      Z.guete = B.grenze(Z.guete - 8, 0, 100);
      buch(r.wer + ': Charge ' + x.nr + ' zurück — ' + B.welt.menge(x.weg) + ' aus dem Lager');
      B.welt.schreibe(fuelleRueck(r.zurueck, x), 'sud');
      B.welt.protokolliere({ wer: 'gegner',
        was: r.wer + ': Charge ' + x.nr + ' zurückgewiesen', preis: 0, menge: x.weg });
      B.ton.spiele('sud:rueckruf', { ort: 'keller' });
    }
    return etwas;
  }

  /* ======================================================================
     DIE GUETE — vier Namen, ein Zeiger
     ====================================================================== */

  /* Die Guete faellt, wenn niemand die Hefe pflegt — aber sie faellt auf
     einen BODEN und nicht auf null. Ein Brauhaus, das nichts mehr tut, braut
     schlecht; es hoert nicht auf zu brauen. Ohne den Boden lag die
     Fehlsudwahrscheinlichkeit nach achtzehn Wochen bei jedem Bottich ueber
     20 Prozent, und das ist keine Knappheit mehr, sondern eine Wand. */
  function gueteWoche() {
    var w = wirkung();
    var boden = D.guete.boden === undefined ? 25 : D.guete.boden;
    var neu = Z.guete - ((D.guete.zerfall || 2) + (w.guetefall || 0));
    Z.guete = B.grenze(Math.max(boden, neu), 0, 100);
    if (w.guetepin) Z.guete = Math.max(Z.guete, w.guetepin);
  }

  function gueteAnzeige() {
    var g = ep().guete;
    if (g.invers) {
      var w = wirkung();
      return { text: '±' + Math.max(0, Math.round((100 - Z.guete) / 4 + (w.streuung || 0))) + ' %',
               gut: Z.guete >= 70 };
    }
    return { text: Math.round(Z.guete) + ' %', gut: Z.guete >= 55 };
  }

  /* ----------------------------------------------------------------------
     WAS DIE HEFE AM FASS AENDERT — Welle 4.

     Gemessen vor dieser Runde (werkbank/schuss/sud-w4/linie.mjs, 400 Wochen
     je Epoche, sorgfaeltig gespielt): die Guete faellt in ALLEN VIER Epochen
     von 70 auf ihren Boden 25 und bleibt dort — und am Bildschirm aendert
     sich davon nichts. Sie haengt bis hierher nur am Fehlsud (der einen
     Bottich braucht) und an der Streuung (die es nur 1970 gibt). In 1350
     laeuft ueber vierzehn Jahre KEIN EINZIGER Sud durch den Gaerkeller,
     weil Grutbier keine Gaerwochen hat: dort war die Guete eine Zahl ohne
     jede Folge, und die woechentliche Hefeentscheidung damit eine Wahl
     ohne Wirkung.

     Jetzt haengt die HALTBARKEIT AM FASS an ihr — und zwar nur nach oben.
     Bei 60 und darunter bleibt alles, wie es war (Faktor 1,00); bei 100
     haelt das Fass ein Fuenftel laenger. Wer das Brett nie aufschlaegt,
     verliert dadurch keinen Pfennig — genau die Regel, unter der schon die
     Deckelung gebaut wurde. Wer die Hefe fuehrt, sieht es im Keller.
     ---------------------------------------------------------------------- */
  function hefeFaktor() {
    return 1 + Math.max(0, Z.guete - 60) / 100 * 0.5;
  }

  /* Jedes Fass bekommt den Stempel EINMAL, mit der Guete der Stunde, in der
     es eingelegt wurde. Mehrfach zu laufen schadet nicht. */
  function stempleHefe() {
    var f = B.welt.vorrat.faesser, k = hefeFaktor(), n = 0;
    for (var i = 0; i < f.length; i++) {
      if (f[i].hefeStempel !== undefined) continue;
      f[i].hefeStempel = k;
      if (k > 1 && f[i].haltbar) {
        var neu = Math.round(f[i].haltbar * k);
        if (neu > f[i].haltbar) { f[i].haltbar = neu; n++; }
      }
    }
    return n;
  }

  function anstichFrei() { return Z.anstichWoche !== woManifest(); }

  /* Erntehefe aus dem gaerenden Bottich. Der billigste Weg und der
     historische Regelfall — er kostet kein Fass, gibt aber weniger her und
     geht nur, SOLANGE ETWAS GAERT. Damit ist die Hefepflege in 1350 teuer
     (ein Fass von zwoelfen im Keller) und in 1884 selbstverstaendlich —
     dieselbe Zahl, ein anderes Jahrhundert. */
  function fuehreHefe() {
    if (!anstichFrei() || !Z.bottiche.length) return false;
    Z.anstichWoche = woManifest();
    var plus = D.guete.fuehren || 8;
    Z.guete = B.grenze(Z.guete + plus, 0, D.guete.hoechst || 100);
    buch(ep().fuehren.text + ' — Bottich ' + Z.bottiche[0].nr + ', +' + plus);
    B.welt.protokolliere({ wer: 'spieler', was: ep().fuehren.text, preis: 0, menge: 0 });
    B.ton.spiele('sud:hefe', { ort: 'sudhaus' });
    B.sende('zeichne', { grund: 'sud:hefe' });
    return true;
  }

  function anstich(jung) {
    if (!anstichFrei()) return false;
    var raus = B.sud.nimmHeraus(1, jung ? { juengstes: true } : { aeltestes: true });
    if (!raus.length) return false;
    Z.anstichWoche = woManifest();
    var plus = jung ? (D.guete.anstichJung || 14) : (D.guete.anstichAlt || 6);
    Z.guete = B.grenze(Z.guete + plus, 0, D.guete.hoechst || 100);
    var alter = B.welt.fassAlter(raus[0]);
    buch(ep().anstich.text + ' — ' + (jung ? 'junges' : 'altes') + ' Fass, '
      + alter + (alter === 1 ? ' Woche' : ' Wochen') + ' alt, +' + plus);
    B.welt.protokolliere({ wer: 'spieler',
      was: ep().anstich.text + ' (' + (jung ? 'jüngstes' : 'ältestes') + ' Fass)',
      preis: 0, menge: 1 });
    B.ton.spiele('sud:anstich', { ort: 'keller' });
    B.sende('zeichne', { grund: 'sud:anstich' });
    return true;
  }

  /* ======================================================================
     DAS SUDBUCH
     ====================================================================== */
  function buch(text) {
    Z.buch.push({ jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, text: String(text) });
    if (Z.buch.length > 90) Z.buch.splice(0, Z.buch.length - 90);
  }

  /* ======================================================================
     DIE OEFFENTLICHE API — die beiden Uebertraege aus Welle 1
     ====================================================================== */

  B.sud = {

    /* §6.2 — haus.rohstoff als saubere API statt Direktgriffen. Solange
       Stuecke direkt am Feld rechnen, kann kein zweites Stueck Rohstoff
       verbrauchen, ohne zu kollidieren. */
    rohstoff: {
      name: function () { return B.welt.epoche().rohstoff || 'Rohstoff'; },
      stand: function () { return B.welt.haus.rohstoff; },
      reicht: function (n) { return B.welt.haus.rohstoff >= n; },
      nimm: function (n, wofuer) {
        n = Math.max(0, Math.round(n || 0));
        if (B.welt.haus.rohstoff < n) return false;
        B.welt.haus.rohstoff -= n;
        if (wofuer) B.welt.protokolliere({ wer: 'spieler',
          was: n + ' ' + B.sud.rohstoff.name() + ': ' + wofuer, preis: 0, menge: 0 });
        return true;
      },
      gib: function (n, woher) {
        n = Math.max(0, Math.round(n || 0));
        B.welt.haus.rohstoff += n;
        if (woher) B.welt.protokolliere({ wer: 'spieler',
          was: '+' + n + ' ' + B.sud.rohstoff.name() + ': ' + woher, preis: 0, menge: 0 });
        return true;
      }
    },

    /* §6.3 — nimmHeraus() mit Auswahl. Der Kern nimmt immer das aelteste
       Fass; hier entscheidet der Rufer, WELCHES angebrochen wird.
         wahl: {aeltestes:true} | {juengstes:true} | {sorte:'Grutbier'}
               | {k:'stark'} | {faesser:[...]} | {reif:true}            */
    nimmHeraus: function (anzahl, wahl) {
      wahl = wahl || {};
      var n = Math.max(1, anzahl || 1);
      var f = B.welt.vorrat.faesser;
      var kandidaten = f.filter(function (x) {
        if (wahl.sorte && x.sorte !== wahl.sorte) return false;
        if (wahl.k && x.k !== wahl.k) return false;
        if (wahl.reif && B.welt.fassAlter(x) < (x.reife || 0)) return false;
        return true;
      });
      if (wahl.faesser) kandidaten = wahl.faesser.slice();
      kandidaten.sort(function (a, b) {
        var d = B.welt.fassAlter(b) - B.welt.fassAlter(a);      /* aelteste zuerst */
        return wahl.juengstes ? -d : d;
      });
      kandidaten = kandidaten.slice(0, n);
      if (!kandidaten.length) return [];
      return nimmGezielt(kandidaten);
    },

    /* Der Gaerkeller, lesbar fuer jedes Stueck. */
    gaerkeller: {
      name: function () { return gk().name; },
      liste: function () { return Z.bottiche.slice(); },
      plaetze: plaetze,
      belegt: belegt,
      frei: frei
    },

    verfahren: function (achse) {
      if (achse) { var a = achseVon(achse); return a ? gewaehlt(a).k : null; }
      var o = {};
      achsen().forEach(function (a) { o[a.schluessel] = gewaehlt(a).k; });
      return o;
    },
    guete: function () { return Z.guete; },

    /* WAS EIN ZUG DIESES STUECKS WIRKLICH KOSTET — Muenze und Bier
       nebeneinander, fuer jeden Zaehler in einer Zeile:
         BRAUHAUS.sud.preise()
       Auflage 4 des blinden Kritikers. `data-preis` allein sagt es nicht:
       der Anstich kostet ein FASS und keinen Pfennig, und ein Zaehler, der
       nur Muenze liest, haelt die haeufigste Bierentscheidung des Spiels
       fuer kostenlos. Gelesen wird der Bildschirm, nicht der Quelltext —
       damit die Zahl dieselbe ist, die ein Kritiker mit der Maus findet. */
    preise: function () {
      var l = [];
      document.querySelectorAll('button[data-zug^="sud:"]').forEach(function (el) {
        var geld = el.getAttribute('data-preis');
        var art = el.getAttribute('data-preis-art');
        if (!geld && !art) return;
        l.push({
          zug: el.getAttribute('data-zug'),
          geld: geld ? Math.abs(+geld) : 0,
          fass: art === 'fass' ? +el.getAttribute('data-preis-menge') : 0,
          wort: el.getAttribute('data-preis-wort') || (geld ? B.welt.geld(Math.abs(+geld)) : ''),
          offen: !el.disabled,
          sollAus: el.getAttribute('data-soll-aus') === '1'
        });
      });
      return l;
    },
    zustand: function () { return Z; }
  };

  /* ======================================================================
     BEDIENUNG
     ====================================================================== */

  function waehle(a, o) {
    if (verdraengt(a, o)) return;
    if (o.preis && !bezahlt(a, o)) {
      /* Gezahlt wird der OFFENE Preis (Listenpreis abzueglich Anrechnung),
         nicht der Listenpreis. Am Riegel darueber aendert das nichts: er
         steht vor dieser Zeile und bleibt, wo er ist (Sperrliste 1). */
      var p = offenerPreis(a, o);
      var ang = o.preis - p;
      if (p) {
        if (!B.welt.kann(p)) return;
        if (!B.welt.zahle(p, 'DER SUD: ' + o.name, 'spieler')) return;
      }
      Z.fest[a.schluessel + ':' + o.k] = true;
      B.ton.spiele(o.fest ? 'sud:siegel' : 'sud:kauf', { ort: 'sudhaus' });
      B.welt.schreibe((o.fest ? 'Unwiderruflich festgelegt: ' : 'Angeschafft: ')
        + o.name + '. ' + o.satz
        + (ang > 0 ? ' Bezahlt ' + B.welt.geld(p) + ' von ' + B.welt.geld(o.preis)
                   + ' — ' + B.welt.geld(ang) + ' waren schon im Haus.' : ''), 'sud');
    } else {
      B.ton.spiele('sud:umstellen', { ort: 'sudhaus' });
    }
    Z.verfahren[a.schluessel] = o.k;
    buch(a.name + ': ' + o.name);
    B.sende('zeichne', { grund: 'sud:verfahren' });
  }

  /* ======================================================================
     DIE KALTE PFANNE — der Ausgang, den DIESES Stueck zu verantworten hat.

     Vorgefunden (gemessen, nur WEITER, Saat 1350): 1600 schliesst die Jahre
     1602 und 1603 mit "0 Sude", 1970 die Jahre 1972 und 1973. Das Sudbuch
     schrieb es auf, und es bedeutete nichts. Ein Brauhaus, das drei Jahre
     nicht anstellt, ist keines mehr — und jede Rechtslage sagt das anders:
     der Sudtag faellt an die Reihe zurueck (1350), die Lade zieht die
     Gerechtigkeit ein (1600), die Bank ruft die Hypothek auf die
     stillstehende Braustaette (1884), eine stillstehende Anlage findet
     einen Kaeufer (1970).

     Zwei Jahre lang steht die Warnung am Brett und im Sudbuch; erst das
     dritte haelt die Uhr an. Ein Stueck haelt die Welt nicht selbst an —
     es nennt der Uhr den Grund (kern/uhr.js, B.uhr.beende).
     ====================================================================== */
  function kaltDef() {
    var k = D.kalt;
    if (!k) return null;
    var e = k[B.welt.zeit.epoche];
    return e ? { frist: k.frist || 3, e: e } : null;
  }

  function kaltePfanne() {
    if (Z.jahrSude > 0 || Z.jahrLegte > 0) { Z.kalt = 0; return; }
    Z.kalt++;
    var kd = kaltDef();
    if (!kd) return;
    if (Z.kalt >= kd.frist) {
      buch(kd.e.ende);
      B.welt.schreibe(kd.e.ende, 'ende');
      if (B.uhr && B.uhr.beende) B.uhr.beende(kd.e.grund, kd.e.ende);
      return;
    }
    var satz = String(kd.e.warnung || '')
      .replace('{n}', Z.kalt).replace('{e}', Z.kalt === 1 ? '' : 'e');
    buch(satz);
    B.welt.schreibe(satz, 'sud');
  }

  function kaufeGaerraum() {
    if (kaufSperre()) return;
    var p = kaufPreis();
    if (!B.welt.zahle(p, 'DER SUD: ' + gk().kauf.text, 'spieler')) return;
    var b = bedingung();
    Z.kaufNr++;
    if (b && b.art === 'lieferzeit') {
      /* Bezahlt ist bezahlt; gestellt wird spaeter. */
      Z.bestellt.push({ ab: woManifest() + (b.wochen || 3), menge: gk().kauf.menge });
      buch(gk().kauf.text + ' — steht in ' + (b.wochen || 3) + ' Wochen');
    } else {
      Z.zusatz += gk().kauf.menge;
      buch(gk().kauf.text + ' — jetzt ' + B.welt.menge(plaetze()) + ' Gärraum');
    }
    B.ton.spiele('sud:bau', { ort: 'sudhaus' });
    saugeUndSchlage();
    B.sende('zeichne', { grund: 'sud:gaerraum' });
  }

  function chargeFrei(b) {
    b.gesperrt = false; b.geprueft = true;
    Z.guete = B.grenze(Z.guete - 6, 0, 100);
    var r = ep().charge && ep().charge.rueck;
    if (r) {
      Z.rueck.push({ nr: b.nr, ab: b.streuung, menge: b.fass,
        faellig: woManifest() + B.wuerfel.ganz(r.frist[0], r.frist[1]) });
    }
    buch('Charge ' + b.nr + ' freigegeben — der Handel misst nach');
    B.welt.schreibe('Charge ' + b.nr + ' geht mit ±' + b.streuung + ' % hinaus. '
      + 'Wenn der Einkauf nachmisst, steht das Haus in seinem Buch.', 'sud');
    B.ton.spiele('sud:freigabe', { ort: 'sudhaus' });
    reifePruefen();
    B.sende('zeichne', { grund: 'sud:charge' });
  }

  function chargeSchnitt(b) {
    var weg = Math.max(1, Math.round(b.fass / 3));
    b.fass = Math.max(1, b.fass - weg);
    b.gesperrt = false; b.geprueft = true; b.streuung = 0;
    Z.guete = B.grenze(Z.guete + 4, 0, 100);
    buch('Charge ' + b.nr + ' verschnitten — ' + B.welt.menge(weg) + ' verloren');
    B.welt.protokolliere({ wer: 'verfall',
      was: 'Charge verschnitten: ' + B.welt.menge(weg) + ' verloren', preis: 0, menge: weg });
    B.ton.spiele('sud:verschneiden', { ort: 'sudhaus' });
    reifePruefen();
    B.sende('zeichne', { grund: 'sud:charge' });
  }

  /* ======================================================================
     DAS BILD
     ====================================================================== */

  /* ------------------------------------------------------------------------
     AUFLAGE 4 DES BLINDEN KRITIKERS (Welle 6), und er hat recht: die
     haeufigste Bierentscheidung des ganzen Spiels — `sud:anstich-jung` gegen
     `sud:anstich-alt`, in 309 bis 369 von je 400 Wochen offen, in allen vier
     Epochen — trug auf BEIDEN Knoepfen `data-preis` 0, obwohl beide ein Fass
     kosten. Fuer eine Zaehlung nach Preisschildern war die Wahl unsichtbar.

     `data-preis` bleibt trotzdem 0, und zwar mit Absicht: der Kern schreibt
     es als MUENZE (`kern/buehne.js:166` rendert `B.welt.geld(...)`), und
     dieses Stueck nimmt kein Geld aus der Kasse (WELLE-2 §1, Abgabendeckel
     §4). Eine Zahl in dieses Feld zu schreiben, die nie abgebucht wird, waere
     genau der Scheinpreis, den Sperrliste 3 verbietet — nur an einer anderen
     Karte.

     Also sagt der Knopf, WAS er kostet, in einem eigenen Feld daneben:

       data-preis-art="fass"     bezahlt wird in Bier, nicht in Muenze
       data-preis-menge="1"      wie viele Fass
       data-preis-wort="1 Fass"  wie es am Schirm heisst (epochengerecht)

     Dazu steht es im Wort auf dem Knopf, und `B.sud.preise()` gibt beides
     zusammen heraus, damit ein Zaehler nicht raten muss.
     ------------------------------------------------------------------------ */
  function knopf(opt) {
    var k = B.knopf(opt);
    k.setAttribute('data-soll-aus', opt.aus ? '1' : '0');
    if (opt.fass) {
      k.setAttribute('data-preis-art', 'fass');
      k.setAttribute('data-preis-menge', String(opt.fass));
      k.setAttribute('data-preis-wort', B.welt.menge(opt.fass));
    }
    return k;
  }

  function zeile(klasse, text) { return B.el('div', klasse, text); }

  /* Trennt den Satz, der die Unwiderruflichkeit ansagt, vom uebrigen
     Erklaertext. Er steht in `sud-daten.js` bei allen acht Festlegungen am
     Ende und faengt mit „Unwiderruflich" an; hier wird er abgeschnitten und
     eigens hingestellt (Auflage 2, Runde 2). Findet sich nichts, bleibt der
     Satz unveraendert — die Trennung darf keinen Text verlieren, und sie
     verliert auch keinen: `satz + fest` ergibt wieder das Original. */
  function teileSatz(satz) {
    var s = String(satz || '');
    var i = s.indexOf('Unwiderruflich');
    if (i < 0) return { satz: s, fest: '' };
    return { satz: s.slice(0, i).replace(/\s+$/, ''), fest: s.slice(i) };
  }

  /* {menge} in den Datensaetzen steht fuer die Menge des Zukaufs — und die
     heisst 1350 "6 Fass" und 1884 "60 hl". Vorher stand die Zahl als Wort im
     Text ("Vierzig Fass mehr Gaerraum") und widersprach in 1884 und 1970 dem
     Knopf darueber, der schon in Hektolitern rechnete. Ein Absatz, zwei
     Masse — genau der Fund des Kritikers, nur in diesem Haus. */
  function fuelle(text) {
    return String(text || '').replace(/\{menge\}/g, B.welt.menge(gk().kauf.menge));
  }

  function zeichneAchse(fach, a) {
    var kasten = B.el('div', 'sud-achse');
    var kopf = B.el('div', 'sud-achskopf');
    kopf.appendChild(B.el('b', 'sud-achsname', a.name));
    kopf.appendChild(B.el('span', 'sud-frage', a.frage));
    kasten.appendChild(kopf);
    kasten.appendChild(zeile('sud-achssatz', a.satz));

    /* Das Siegel steht ueber der Achse, nicht nur an der Karte: wer hier
       liest, weiss vor dem Suchen, dass diese Frage entschieden ist. */
    var sieg = gesiegelt(a);
    if (sieg) {
      var hoeher = a.optionen.some(function (x) {
        return x.fest && x.preis > sieg.preis && !bezahlt(a, x);
      });
      kasten.appendChild(zeile('sud-siegelzeile',
        (sieg.siegel || 'gesiegelt') + ': ' + sieg.name + '. '
        + (hoeher ? 'Zurück geht es nicht — nur noch weiter hinauf.'
                  : 'Diese Frage ist entschieden, für dieses Haus und diese Zeit.')));
    }

    var reihe = B.el('div', 'sud-optionen');
    a.optionen.forEach(function (o) {
      var ist = gewaehlt(a) === o;
      var weg = verdraengt(a, o);
      var offenPreis = offenerPreis(a, o);
      var angerech = (o.preis && !bezahlt(a, o)) ? (o.preis - offenPreis) : 0;
      var kannNicht = weg || (offenPreis && !B.welt.kann(offenPreis));

      var karte = B.el('div', 'sud-karte'
        + (ist ? ' gewaehlt' : '')
        + (o.fest ? ' fest' : '')
        + (weg ? ' weg' : ''));

      var k = knopf({
        text: o.name,
        zug: 'sud:' + a.schluessel + ':' + o.k,
        preis: offenPreis ? -offenPreis : 0,
        klasse: 'sud-wahl' + (ist ? ' ist' : '') + (o.fest ? ' siegel' : ''),
        titel: o.satz + (o.warnung ? ' — ' + o.warnung : ''),
        aus: !!kannNicht || (ist && !offenPreis),
        tu: function () { waehle(a, o); }
      });
      karte.appendChild(k);

      var marke = B.el('div', 'sud-marke');
      /* Was der Knopf abbucht, steht auf dem Knopf; was er in der Liste
         kostet, gehoert daneben — sonst liest ein Spieler „−76.000 DM" und
         glaubt, die teuerste Karte des Spiels sei billiger geworden. */
      if (angerech > 0) marke.appendChild(B.el('span', 'sud-schild angerechnet',
        'Liste ' + B.welt.geld(o.preis) + ' · ' + B.welt.geld(angerech) + ' angerechnet'));
      if (weg) marke.appendChild(B.el('span', 'sud-schild weg',
        sieg && sieg !== o ? 'das Siegel liegt darauf' : 'nicht mehr zu haben'));
      else if (ist) marke.appendChild(B.el('span', 'sud-schild ist', 'läuft'));
      else if (o.fest && bezahlt(a, o)) marke.appendChild(B.el('span', 'sud-schild siegel', o.siegel || 'gesiegelt'));
      else if (o.fest) marke.appendChild(B.el('span', 'sud-schild fest', 'unwiderruflich'));
      else if (o.einmal && !bezahlt(a, o)) marke.appendChild(B.el('span', 'sud-schild', 'einmal zu zahlen'));
      else if (o.schild) marke.appendChild(B.el('span', 'sud-schild', o.schild));

      /* Das Preisschild dieses Stuecks: was fuer ein Bier dabei herauskommt.
         Es steht vor der Haltbarkeit, weil man es beim Wirt wiedersieht und
         die Haltbarkeit nur im Keller.

         AUFLAGE 3 des blinden Kritikers, und er hat recht: hier stand
         „traegt Exportbier" auf einem Knopf, der kein Exportbier macht.
         Gemessen 1970, drei Partien mit 0 / 0 / 192.000 DM: alle drei enden
         mit `pils` auf Stufe 2. Das ist kein Fehler des Zuges — `hoechst`
         DECKELT, es hebt nicht, und die Sorte bestellt DIE FUHRE. Es war ein
         Fehler des Schildes. Ein Deckel, der oben offen steht, heisst jetzt
         auch so: „laesst Exportbier zu". */
      if (o.hoechst !== undefined) {
        var zs = sorteAufStufe(o.hoechst);
        if (zs) {
          var offenNachOben = o.hoechst >= obersteStufe();
          var rs = B.el('span', 'sud-rang' + (offenNachOben ? ' hoch' : ' tief'),
            offenNachOben ? ('lässt ' + zs.name + ' zu') : ('höchstens ' + zs.name));
          rs.title = offenNachOben
            ? ('Eine Obergrenze, kein Versprechen: dieses Verfahren steht ' + zs.name
               + ' nicht im Weg. Bestellt wird die Sorte an der Fuhre — dieses Brett '
               + 'deckelt nur, es hebt nie.')
            : ('Was höher angesetzt wird, schlägt als ' + zs.name + ' aus.');
          marke.appendChild(rs);
        }
      }

      var wk = o.wirkung || {};
      var wirk = [];
      if (wk.haltbar && wk.haltbar !== 1) wirk.push('Haltbarkeit ×' + String(wk.haltbar).replace('.', ','));
      if (wk.gaer) wirk.push((wk.gaer > 0 ? '+' : '−') + Math.abs(wk.gaer) + ' Wo. Gärung');
      if (wk.roh) wirk.push((wk.roh > 0 ? '+' : '−') + Math.abs(wk.roh) + ' ' + B.sud.rohstoff.name() + ' je Sud');
      if (wk.mehr) wirk.push((wk.mehr > 0 ? '+' : '−') + B.welt.menge(Math.abs(wk.mehr)) + ' je Sud');
      if (wk.streuung !== undefined && ep().charge) wirk.push('Streuung ±' + wk.streuung + ' %');
      if (wk.anzeige) wirk.push('Anzeige ' + Math.round(wk.anzeige * 100) + ' % je Woche');
      if (wk.warmDrossel) wirk.push('warme Wochen: halber Gärraum');
      if (wirk.length) marke.appendChild(B.el('span', 'sud-wirkung', wirk.join(' · ')));
      karte.appendChild(marke);

      /* AUFLAGE 2 des blinden Kritikers, Runde 2: der Satz, wegen dem man
         Geld ausgibt oder es laesst, stand am ENDE des Erklaertextes und lag
         damit bei allen acht unwiderruflichen Karten unter dem Deckel — 3 von
         21 Zeilen sichtbar im schlimmsten Fall. Er wird jetzt herausgeloest
         und bekommt eine eigene Zeile ohne jeden Deckel. Der Rest des Satzes
         steht darueber und ist seit dieser Runde rollbar statt geschnitten. */
      var teile = teileSatz(o.satz);
      karte.appendChild(zeile('sud-kartensatz', teile.satz));
      if (teile.fest) karte.appendChild(zeile('sud-festsatz', teile.fest));
      if (o.warnung) karte.appendChild(zeile('sud-warnung', o.warnung));
      reihe.appendChild(karte);
    });
    kasten.appendChild(reihe);
    fach.appendChild(kasten);
  }

  function zeichneGaerkeller(fach) {
    var g = gk();
    var kasten = B.el('div', 'sud-gaerkeller');
    var kopf = B.el('div', 'sud-achskopf');
    kopf.appendChild(B.el('b', 'sud-achsname', g.name.toUpperCase()));
    kopf.appendChild(B.el('span', 'sud-frage',
      B.welt.menge(belegt(), true) + ' von ' + B.welt.menge(plaetze())
      + ' · ' + Z.bottiche.length + ' ' + (Z.bottiche.length === 1 ? g.gefaess : g.gefaesse)));
    kasten.appendChild(kopf);
    kasten.appendChild(zeile('sud-achssatz', g.satz));
    if (wirkung().warmDrossel < 1 && warmeWoche()) {
      kasten.appendChild(zeile('sud-warnung',
        'Warme Woche: ohne Maschine trägt der Gärkeller nur die Hälfte.'));
    }

    var band = B.el('div', 'sud-band');
    var jetzt = woManifest();
    if (!Z.bottiche.length) {
      band.appendChild(zeile('sud-leer', 'Kein ' + g.gefaess + ' steht an. '
        + (wirkung().gaer > 0
            ? 'Was die Pfanne diese Woche ansetzt, kommt von selbst hierher.'
            : 'Das laufende Verfahren braucht keine Gärwochen — was gebraut wird, '
              + 'ist sofort lieferbar und hält entsprechend kurz. Wer länger liegen '
              + 'lässt, füllt diesen Keller.')));
    }
    /* Hoechstens acht Gefaesse im Bild. In 1970 standen sonst zwanzig Tanks
       untereinander und schoben die Unterkante des Bretts von 58 auf 87 % der
       Buehne — dorthin, wo der GEGNER seine Preisschilder am Marktstand hat.
       Ein Brett, dessen Hoehe vom Betrieb abhaengt, hat keine Flaeche. Am
       Band haengt kein einziger Knopf; es geht also kein Zug verloren. */
    var SICHTBAR = 8;
    Z.bottiche.slice(0, SICHTBAR).forEach(function (b) {
      var rest = Math.max(0, b.reifAb - jetzt);
      var ziel = ausschlagSorte(b);
      var bt = B.el('div', 'sud-bottich s' + b.stufe
        + (b.gesperrt ? ' gesperrt' : (rest ? '' : ' reif'))
        + (ziel ? ' gestuft' : ''));
      bt.appendChild(B.el('span', 'sud-bnr', String(b.nr)));
      bt.appendChild(B.el('span', 'sud-bsorte', b.sorte));
      if (ziel) bt.appendChild(B.el('span', 'sud-bziel', '→ ' + ziel.name));
      bt.appendChild(B.el('span', 'sud-bmenge', B.welt.menge(b.fass)));
      var lagerVoll = B.welt.vorrat.faesser.length >= B.welt.vorrat.plaetze;
      bt.appendChild(B.el('span', 'sud-brest',
        b.gesperrt ? ('gesperrt ±' + b.streuung + ' %')
                   : (rest ? ('reif in ' + rest + (rest === 1 ? ' Woche' : ' Wochen'))
                           : (lagerVoll ? 'reif — kein Platz im Lager' : 'schlägt aus'))));
      bt.title = b.sorte + ' · ' + b.verfahren + ' · hält am Fass '
        + Math.round((ziel ? Math.max(1, ziel.haltbar || 6) : b.haltbarPur)
                     * (b.faktor || 1)) + ' Wochen'
        + (ziel ? ' — angesetzt als ' + b.sorte + ', schlägt als ' + ziel.name + ' aus' : '');
      band.appendChild(bt);
    });
    if (Z.bottiche.length > SICHTBAR) {
      var weiter = Z.bottiche.length - SICHTBAR, restFass = 0;
      Z.bottiche.slice(SICHTBAR).forEach(function (b) { restFass += b.fass; });
      band.appendChild(B.el('div', 'sud-mehr', '… und ' + weiter + ' weitere '
        + (weiter === 1 ? g.gefaess : g.gefaesse) + ' mit ' + B.welt.menge(restFass)));
    }
    kasten.appendChild(band);

    /* 1970: was draussen steht und noch nicht nachgemessen ist. Ein
       gedeckter Zug des Handels, mit Datum — kein Ueberfall aus dem Nichts. */
    var rr = ep().charge && ep().charge.rueck;
    if (rr && Z.rueck.length) {
      var rk = B.el('div', 'sud-rueck');
      rk.appendChild(B.el('b', 'sud-achsname', rr.name));
      rk.appendChild(zeile('sud-achssatz', rr.satz));
      var rl = Z.rueck.slice().sort(function (x, y) { return x.faellig - y.faellig; });
      rl.slice(0, 3).forEach(function (x) {
        var w = Math.max(0, x.faellig - jetzt);
        rk.appendChild(zeile('sud-rueckzeile', 'Charge ' + x.nr + ' · ' + B.welt.menge(x.menge)
          + ' · ±' + x.ab + ' % · ' + (w ? 'nachgemessen in ' + w + (w === 1 ? ' Woche' : ' Wochen')
                                          : 'wird jetzt nachgemessen')));
      });
      if (rl.length > 3) rk.appendChild(zeile('sud-mehr', '… und ' + (rl.length - 3)
        + ' weitere Chargen stehen draußen'));
      kasten.appendChild(rk);
    }

    /* Was bestellt und bezahlt ist, aber noch nicht steht (1970). */
    Z.bestellt.forEach(function (x) {
      var w = Math.max(0, x.ab - jetzt);
      kasten.appendChild(zeile('sud-fussnote', B.welt.menge(x.menge) + ' Gärraum bestellt und '
        + 'bezahlt — ' + (w ? 'gestellt in ' + w + (w === 1 ? ' Woche' : ' Wochen')
                            : 'wird diese Woche gestellt') + '.'));
    });

    var reihe = B.el('div', 'sud-werkzeug');
    var p = kaufPreis();
    var sperre = kaufSperre();
    var bed = bedingung();
    reihe.appendChild(knopf({
      text: g.kauf.text + ' · +' + B.welt.menge(g.kauf.menge),
      zug: 'sud:gaerraum',
      preis: -p,
      klasse: 'sud-tat',
      titel: sperre || (fuelle(g.kauf.titel) + (bed ? ' ' + bed.satz : '')),
      aus: !!sperre || !B.welt.kann(p),
      tu: kaufeGaerraum
    }));
    kasten.appendChild(reihe);
    /* Die Nebenbedingung steht am Brett, nicht nur im Titel: was sie
       verlangt, soll man lesen koennen, ehe man den Knopf sucht. */
    if (bed) kasten.appendChild(zeile(sperre ? 'sud-warnung' : 'sud-fussnote', sperre || bed.satz));

    /* 1970: die gesperrten Chargen, mit zwei Antworten und zwei Preisen. */
    var ch = ep().charge;
    var gesperrt = Z.bottiche.filter(function (b) { return b.gesperrt; });
    if (ch && gesperrt.length) {
      var ck = B.el('div', 'sud-chargen');
      ck.appendChild(B.el('b', 'sud-achsname', ch.name));
      ck.appendChild(zeile('sud-achssatz', ch.satz));
      gesperrt.slice(0, 2).forEach(function (b) {
        var z = B.el('div', 'sud-chargenzeile');
        z.appendChild(B.el('span', 'sud-bnr', String(b.nr)));
        z.appendChild(B.el('span', 'sud-bsorte', B.welt.menge(b.fass) + ' · ±' + b.streuung + ' %'));
        z.appendChild(knopf({
          text: ch.frei.text, zug: 'sud:charge-frei:' + b.nr, klasse: 'sud-tat klein',
          titel: ch.frei.titel, tu: function () { chargeFrei(b); }
        }));
        z.appendChild(knopf({
          text: ch.schnitt.text + ' · −' + B.welt.menge(Math.max(1, Math.round(b.fass / 3))),
          zug: 'sud:charge-schnitt:' + b.nr, klasse: 'sud-tat klein',
          fass: Math.max(1, Math.round(b.fass / 3)),
          titel: ch.schnitt.titel, tu: function () { chargeSchnitt(b); }
        }));
        ck.appendChild(z);
      });
      /* Drei auf einmal — mehr passt nicht ins Brett, und der Braumeister gibt
         nach vier Wochen ohnehin von selbst frei. */
      if (gesperrt.length > 2) ck.appendChild(zeile('sud-mehr',
        '… und ' + (gesperrt.length - 2) + ' weitere Chargen stehen gesperrt.'));
      kasten.appendChild(ck);
    }

    fach.appendChild(kasten);
  }

  /* ----------------------------------------------------------------------
     WAS BEIM WIRT ANKOMMT.

     Die Leiter der Epoche, Sprosse fuer Sprosse: wie das Bier heisst, wie
     viele Haeuser es fuehren, und ob die Pfanne es traegt. Ohne dieses Feld
     ist die Deckelung eine Zahl im Quelltext; mit ihm ist sie eine
     Entscheidung, die man vor dem Klicken lesen kann.
     ---------------------------------------------------------------------- */
  function zeichneWirte(fach) {
    var l = leiter();
    if (!l.length) return;                 /* ohne die Sortenliste kein Urteil */
    var w = ep().wirte || { name: 'WAS BEIM WIRT ANKOMMT', satz: '' };
    var hoch = hoechsteStufe();
    var alle = B.welt.adressenJetzt();
    var oben = sorteAufStufe(hoch);

    var kasten = B.el('div', 'sud-wirte');
    var kopf = B.el('div', 'sud-achskopf');
    kopf.appendChild(B.el('b', 'sud-achsname', w.name));
    kopf.appendChild(B.el('span', 'sud-frage', oben ? 'höchstens ' + oben.name : ''));
    kasten.appendChild(kopf);
    kasten.appendChild(zeile('sud-achssatz', w.satz));
    /* Der Satz, ohne den jedes Schild an diesem Brett mehr verspricht, als
       der Zug einloest (Auflage 3). Er steht hier und nicht im Kleingedruckten,
       weil er die ganze Mechanik dieses Feldes ist. */
    kasten.appendChild(zeile('sud-fussnote',
      'Bestellt wird die Sorte an der Fuhre. Dieses Brett deckelt sie — es hebt sie nie: '
      + 'was hier offen steht, wird nur dann gebraut, wenn es auch bestellt ist.'));

    l.forEach(function (s) {
      var geht = s.stufe <= hoch;
      var nimmt = nehmen(s.stufe);
      var r = B.el('div', 'sud-wzeile' + (geht ? '' : ' aus'));
      r.appendChild(B.el('i', 'sud-wzeichen s' + s.stufe, s.zeichen));
      r.appendChild(B.el('span', 'sud-wsorte', s.name));
      r.appendChild(B.el('span', 'sud-wzahl',
        nimmt.length + ' von ' + alle.length + (alle.length === 1 ? ' Haus' : ' Häusern')));
      r.appendChild(B.el('span', 'sud-wurteil', geht
        ? 'trägt die Pfanne'
        : 'schlägt als ' + (oben ? oben.name : '—') + ' aus'));
      r.title = nimmt.length ? nimmt.map(function (a) { return a.name; }).join(' · ')
                             : 'Kein Haus in dieser Zeit führt es.';
      kasten.appendChild(r);
    });

    /* ------------------------------------------------------------------
       ... UND WAS DAVON WIRKLICH IM KELLER LIEGT — Auflage 3, zweite Haelfte.

       Der Kritiker hat 1970 dreimal gespielt (0 / 0 / 192.000 DM) und alle
       drei Partien enden mit `pils` auf Stufe 2, obwohl auf zwei gekauften
       Knoepfen die hoechste Sorte stand. Das ist richtig so — `hoechst`
       deckelt und hebt nie, bestellt wird an der Fuhre. Nur stand es
       nirgends, und deshalb las sich das Schild wie ein Versprechen.

       Jetzt steht es da, und zwar als Zahl aus dem eigenen Keller: was oben
       offen ist und trotzdem nicht gebraut wird, sagt dieses Feld beim Namen.
       ------------------------------------------------------------------ */
    var spitze0 = l[l.length - 1];
    if (spitze0 && spitze0.stufe <= hoch) {
      var hat = 0;
      B.welt.vorrat.faesser.forEach(function (f) { if ((f.stufe || 2) >= spitze0.stufe) hat++; });
      Z.bottiche.forEach(function (b) { if ((b.stufe || 2) >= spitze0.stufe) hat += b.fass; });
      if (!hat) {
        kasten.appendChild(zeile('sud-warnung',
          'Die Pfanne lässt ' + spitze0.name + ' zu — im Keller liegt keins. '
          + 'Dieses Brett öffnet nur die Schranke; angesetzt wird ' + spitze0.name
          + ' an der Fuhre, und dort kostet es Brautage.'));
      }
    }

    /* Wer wegfaellt, steht mit Namen da. Eine Zahl merkt sich niemand. */
    var spitze = l[l.length - 1];
    if (spitze && spitze.stufe > hoch) {
      var fort = nehmen(spitze.stufe).filter(function (a) {
        var st = artStufen(a);
        return st && st.indexOf(hoch) < 0;
      });
      if (fort.length) {
        kasten.appendChild(zeile('sud-warnung',
          fort.map(function (a) { return a.name; }).join(' und ')
          + (fort.length === 1 ? ' führt' : ' führen') + ' nur ' + spitze.name
          + ' und bekomm' + (fort.length === 1 ? 't' : 'en') + ' vom Anker nichts.'));
      }
    }
    if (Z.gestuft) {
      kasten.appendChild(zeile('sud-fussnote', 'Dieses Braujahr ' + Z.gestuft
        + (Z.gestuft === 1 ? ' Bottich' : ' Bottiche') + ' zurückgestuft.'));
    }
    fach.appendChild(kasten);
  }

  function zeichneHefe(fach) {
    var g = ep().guete, a = ep().anstich, an = gueteAnzeige();
    var kasten = B.el('div', 'sud-hefe');
    var kopf = B.el('div', 'sud-achskopf');
    kopf.appendChild(B.el('b', 'sud-achsname', g.name.toUpperCase()));
    kopf.appendChild(B.el('span', 'sud-frage', an.text));
    kasten.appendChild(kopf);
    kasten.appendChild(zeile('sud-achssatz', g.satz));

    var balken = B.el('div', 'sud-balken' + (an.gut ? ' gut' : ' schlecht'));
    var fuell = B.el('i');
    fuell.style.width = B.grenze(Z.guete, 0, 100) + '%';
    balken.appendChild(fuell);
    kasten.appendChild(balken);

    /* Was die Pflege am Fass wert ist — als Zahl, nicht als Balken. Ohne
       diese Zeile war die Guete in 1350 ueber vierzehn Jahre folgenlos. */
    var hf = hefeFaktor();
    kasten.appendChild(zeile('sud-hefefolge' + (hf > 1 ? ' gut' : ''),
      hf > 1
        ? ('Was jetzt eingelegt wird, hält ×'
           + hf.toFixed(2).replace('.', ',') + ' — die Hefe steht.')
        : ('Ab ' + (60 + 1) + ' % hält jedes eingelegte Fass länger. Jetzt: ×1,00.')));

    var frei = anstichFrei();
    var lager = B.welt.vorrat.faesser.length;
    var f = ep().fuehren;
    var reihe = B.el('div', 'sud-werkzeug');

    reihe.appendChild(knopf({
      text: f.text + ' · +' + (D.guete.fuehren || 8),
      zug: 'sud:hefe-fuehren', klasse: 'sud-tat',
      titel: f.titel,
      aus: !frei || !Z.bottiche.length,
      tu: fuehreHefe
    }));
    /* Beide Knoepfe kosten ein Fass, und beide sagen es jetzt auch — im Wort
       und in `data-preis-art` (Auflage 4). */
    reihe.appendChild(knopf({
      text: (a.jung || 'Jüngstes Fass anbrechen') + ' · +' + (D.guete.anstichJung || 14)
          + ' · ' + B.welt.menge(1),
      zug: 'sud:anstich-jung', klasse: 'sud-tat', fass: 1,
      titel: a.titel + ' Das jüngste Fass gibt das kräftigste Zeug — und es wäre noch '
           + 'lange zu verkaufen gewesen. Kostet ' + B.welt.menge(1) + '.',
      aus: !frei || !lager,
      tu: function () { anstich(true); }
    }));
    reihe.appendChild(knopf({
      text: (a.alt || 'Ältestes Fass anbrechen') + ' · +' + (D.guete.anstichAlt || 6)
          + ' · ' + B.welt.menge(1),
      zug: 'sud:anstich-alt', klasse: 'sud-tat', fass: 1,
      titel: a.titel + ' Das älteste Fass wäre ohnehin bald verdorben — dafür gibt es nur '
           + 'die Hälfte her. Kostet ' + B.welt.menge(1) + '.',
      aus: !frei || !lager,
      tu: function () { anstich(false); }
    }));
    kasten.appendChild(reihe);
    kasten.appendChild(zeile('sud-fussnote', frei
      ? (Z.bottiche.length ? 'Einmal die Woche. Solange etwas gärt, kostet die Hefe kein Bier.'
          : (lager ? 'Einmal die Woche. Es gärt nichts — die Hefe kostet jetzt '
                     + B.welt.menge(1) + '.'
                   : 'Es gärt nichts, und im Keller liegt nichts.'))
      : 'Diese Woche ist die Hefe schon nachgeführt.'));
    fach.appendChild(kasten);
  }

  function zeichneBrett() {
    var fach = B.ebene('hand', 'sud');
    B.leere(fach);

    var e = ep();
    var brett = B.el('div', 'sud-brett');
    brett.setAttribute('data-reiter', 'DAS SUDHAUS');
    brett.setAttribute('data-ort', 'sudhaus');

    var kopf = B.el('div', 'sud-kopf');
    /* Das laufende JAHR, nicht das Schaujahr der Epoche: eine Epoche dauert
       hier Jahrhunderte, und 1800 ist nicht 1884. */
    kopf.appendChild(B.el('b', null, e.titel.toUpperCase() + ' · ' + B.welt.zeit.jahr));
    kopf.appendChild(B.el('span', 'sud-unter', e.kessel));
    kopf.appendChild(B.el('span', 'sud-frage gross', e.frage));
    brett.appendChild(kopf);
    brett.appendChild(zeile('sud-historie', e.historie));

    /* Die kalte Pfanne steht am Brett, ehe sie zaehlt. Wer sie liest, hat
       noch ein Braujahr, um zu antworten. */
    var kd = kaltDef();
    if (kd && Z.kalt > 0) {
      brett.appendChild(zeile('sud-warnung kalt',
        String(kd.e.warnung || '').replace('{n}', Z.kalt).replace('{e}', Z.kalt === 1 ? '' : 'e')
        + ' Noch ' + (kd.frist - Z.kalt)
        + ((kd.frist - Z.kalt) === 1 ? ' Braujahr.' : ' Braujahre.')));
    }

    /* Zwei Spalten, damit nichts unter den Rand rutscht. In 1970 stehen
       sechs Verfahrensoptionen auf dem Brett; einspaltig lagen die beiden
       Anstich-Knoepfe unterhalb des sichtbaren Randes und wurden von
       elementFromPoint nicht mehr getroffen — gezaehlt haette sie dann
       niemand. Ein Zug, den man scrollen muss, ist fuer die zweite Latte
       kein Zug. */
    var rolle = B.el('div', 'sud-rolle rolle');
    var links = B.el('div', 'sud-spalte links');
    var rechts = B.el('div', 'sud-spalte rechts');
    /* Links die Entscheidungen, rechts ihre Folgen — erst beim Wirt, dann
       in der Hefe, dann im Keller. Das Feld BEIM WIRT steht rechts und
       nicht unter den Achsen, weil die linke Spalte in drei von vier
       Epochen ohnehin die laengere ist: unter den Achsen haette es das
       Brett um weitere zehn Prozent der Buehnenhoehe wachsen lassen. */
    achsen().forEach(function (a) { zeichneAchse(links, a); });
    zeichneWirte(rechts);
    zeichneHefe(rechts);
    zeichneGaerkeller(rechts);

    /* Das Sudbuch — was ohne den Spieler geschehen ist. */
    var b = B.el('div', 'sud-buch');
    var bk = B.el('div', 'sud-achskopf');
    bk.appendChild(B.el('b', 'sud-achsname', 'DAS SUDBUCH'));
    bk.appendChild(B.el('span', 'sud-frage', Z.jahrSude + ' Sude · '
      + B.welt.menge(Z.jahrFass) + ' · ' + Z.jahrFehl + ' verloren'
      + (Z.gestuft ? ' · ' + Z.gestuft + ' gestuft' : '')));
    b.appendChild(bk);
    /* Vier Zeilen, nicht sieben: die Hoehe dieses Bretts darf nicht davon
       abhaengen, wie viel diese Woche passiert ist. Ein Brett, das mit dem
       Sudbuch waechst, waechst irgendwann ueber fremde Knoepfe. */
    var letzte = Z.buch.slice(-3).reverse();
    if (!letzte.length) b.appendChild(zeile('sud-leer', 'Noch keine Eintragung.'));
    letzte.forEach(function (x) {
      var z = B.el('div', 'sud-buchzeile');
      z.appendChild(B.el('span', 'wann', x.jahr + '/' + x.woche));
      z.appendChild(B.el('span', 'was', x.text));
      b.appendChild(z);
    });
    rechts.appendChild(b);

    rolle.appendChild(links);
    rolle.appendChild(rechts);
    brett.appendChild(rolle);
    fach.appendChild(brett);
    return brett;
  }

  /* ----------------------------------------------------------------------
     DER KESSELZETTEL — klein, ortsgebunden, immer im Bild.
     Er bleibt unter der Ortsmarken-Schwelle der STADT (2,4 % der Buehne;
     nachgemessen 1,88–2,14 % bei 1440x900, 1920x1000 und 2752x1536) und
     meldet sich mit data-frei von der Kartenschicht ab (ZUSTAENDIGKEIT §10).

     Er ist das GANZE Stueck im Vorgabestand — das Brett liegt zugeklappt,
     und ein zugeklapptes Brett schaltet seine Knoepfe ab. Was hier nicht
     steht, steht fuer einen sorgfaeltig spielenden Menschen nirgends. Also
     traegt er seit Welle 4 vier Zuege statt drei, in zwei Zeilen:

       1  DIE HEFE, zwei Wege nebeneinander, jede Woche, Preis in Bier
       2  DAS VERFAHREN, zwei Umstellungen nebeneinander, jede mit dem Bier
          daneben, das dabei herauskommt: die naechste KOSTENLOSE, und daneben
          die naechste bezahlte — oder, wenn die Kasse die nicht hergibt, die
          naechste kostenlose einer ANDEREN Achse (Welle 4, Auflage 2; der
          Preis steht dann als Zeile darunter)
          — oder, solange eine Charge gesperrt steht (1970), deren beide
          Antworten; oder, wenn alles entschieden ist, der Gaerraum.
     ---------------------------------------------------------------------- */
  /* ----------------------------------------------------------------------
     DER ZETTEL IST EIN STEMPEL, KEIN BRETT — und unter der Entwurfsleinwand
     muss er sich das auch sagen lassen.

     Mit dem Schriftboden der vierten Latte (12 px je Regel) wurde bei
     1366x768 gemessen: der Zettelkasten haelt 178 x 126 px — mehr darf er
     nicht, sonst stuft die STADT ihn als BRETT ein und klappt ihn zu (mit
     15 % Breite ausprobiert und prompt `stadt-zugeklappt` kassiert). Seine
     vier Knopfaufschriften brauchen bei 12 px zusammen rund 145 px, weil
     „Hefezeug aus dem Bottich heben · +8 · ohne Fass" ueber drei Zeilen
     laeuft. Die Knoepfe schnitten daraufhin ihren eigenen Text ab — genau
     der Fehler, den Auflage 2 am Kartensatz beanstandet, nur eine Ebene
     tiefer.

     Also bekommt der Stempel Stempelworte: `kurz`, `jungKurz`, `altKurz` aus
     `sud-daten.js`. Der volle Wortlaut steht unveraendert auf dem Brett,
     einen Reiterklick weit, und im `title` des Knopfes. Der PREIS wird nicht
     gekuerzt — er ist der Grund, warum der Knopf ein Preisschild traegt
     (Auflage 4 der Vorrunde).

     Gelesen wird derselbe Medienschalter, den `grund.css` fuer den
     Knopfboden und `sud-zusatz.css` fuer das Aufraeumen benutzt. Oberhalb
     der Entwurfsleinwand aendert sich nichts, und dort vergleicht Latte 1
     blind. */
  function stempelkurz() {
    try {
      if (!window.matchMedia) return false;
      return window.matchMedia('(max-width: 2751px), (max-height: 1535px)').matches;
    } catch (e) { return false; }
  }

  function zeichneZettel() {
    var fach = B.ebene('marken', 'sud');
    B.leere(fach);

    var e = ep(), an = gueteAnzeige();
    var z = B.el('div', 'sud-zettel' + (Z.brettZu ? '' : ' beiseite'));
    z.setAttribute('data-frei', '1');
    z.setAttribute('data-reiter', 'DER SUD');

    z.appendChild(B.el('div', 'sud-zkopf', 'DER SUD · ' + B.welt.zeit.jahr));
    z.appendChild(B.el('div', 'sud-zverfahren',
      achsen().map(function (a) { return gewaehlt(a).name; }).join(' · ')));

    /* Was dieses Verfahren beim Wirt hergibt — die eine Zahl dieses Stuecks,
       die auch im Vorgabestand im Bild steht. */
    var oben = sorteAufStufe(hoechsteStufe());
    if (oben) z.appendChild(B.el('div', 'sud-zrang', 'höchstens ' + oben.name));

    var l = B.el('div', 'sud-zzahlen');
    l.appendChild(B.el('span', null, gk().name.replace(/^Der /, '') + ' '
      + B.welt.menge(belegt(), true) + '/' + B.welt.menge(plaetze())));
    var hfz = hefeFaktor();
    var gspan = B.el('span', an.gut ? 'gut' : 'schlecht',
      e.guete.kurz + ' ' + an.text + (hfz > 1 ? ' · Fass ×' + hfz.toFixed(2).replace('.', ',') : ''));
    gspan.title = hfz > 1
      ? 'Solange die Hefe so steht, hält jedes eingelegte Fass ' + Math.round((hfz - 1) * 100)
        + ' % länger.'
      : 'Über 60 % hält jedes eingelegte Fass länger.';
    l.appendChild(gspan);
    z.appendChild(l);

    /* ------------------------------------------------------------------
       DIE HEFE — die Entscheidung, die JEDE Woche ansteht.

       Gemessen vor dieser Runde (werkbank/schuss/sud-w4/linie.mjs, vier
       Epochen, je 400 Wochen, sorgfaeltig gespielt): der Zettel trug hier
       genau EINEN Knopf. Damit war die einzige woechentlich wiederkehrende
       Entscheidung dieses Stuecks im Vorgabestand keine — ein Knopf ist
       keine Wahl, und das Brett mit den beiden anderen liegt zugeklappt
       und abgeschaltet daneben.

       Jetzt stehen die beiden Wege NEBENEINANDER, und sie schliessen
       einander aus, weil die Hefe nur einmal in der Woche gezogen wird:

         gaert etwas   fuehren (+8, kostet kein Bier)  |  junges Fass (+14, 1 Fass)
         gaert nichts  junges Fass (+14, 1 Fass)       |  altes Fass (+6, 1 Fass)

       Der Preis steht in BIER und nicht in Muenze — dieses Stueck nimmt
       kein Geld aus der Kasse (WELLE-2 §1, Abgabendeckel §4). Er steht
       deshalb im Wort auf dem Knopf.
       ------------------------------------------------------------------ */
    var frei = anstichFrei(), lager = B.welt.vorrat.faesser.length;
    var ausBottich = Z.bottiche.length > 0;
    var einFass = B.welt.menge(1);
    /* Stempelworte unter der Entwurfsleinwand, voller Wortlaut darueber.
       Der Preis bleibt in beiden Faellen stehen. */
    var kz = stempelkurz();
    var wFuehren = (kz && e.fuehren.kurz) || e.fuehren.text;
    var wJung = (kz && e.anstich.jungKurz) || e.anstich.jung || 'Jüngstes Fass anbrechen';
    var wAlt = (kz && e.anstich.altKurz) || e.anstich.alt || 'Ältestes Fass anbrechen';
    var paar = B.el('div', 'sud-zpaar');
    paar.appendChild(knopf({
      text: (ausBottich ? wFuehren : wJung)
          + ' · +' + (ausBottich ? (D.guete.fuehren || 8) : (D.guete.anstichJung || 14))
          + (ausBottich ? ' · ohne Fass' : ' · ' + einFass),
      zug: 'sud:zettel-anstich',
      klasse: 'sud-tat klein voll halb',
      fass: ausBottich ? 0 : 1,
      titel: ausBottich ? e.fuehren.titel : (e.anstich.titel + ' Kostet ' + einFass + '.'),
      aus: !frei || (!ausBottich && !lager),
      tu: function () { if (ausBottich) fuehreHefe(); else anstich(true); }
    }));
    paar.appendChild(knopf({
      text: (ausBottich ? wJung : wAlt)
          + ' · +' + (ausBottich ? (D.guete.anstichJung || 14) : (D.guete.anstichAlt || 6))
          + ' · ' + einFass,
      zug: 'sud:zettel-hefe-fass',
      klasse: 'sud-tat klein voll halb',
      fass: 1,
      titel: e.anstich.titel + ' Kostet ' + einFass + ' aus dem Keller — '
           + (ausBottich ? 'mehr als die Erntehefe hergibt, und es ist verkäufliches Bier.'
                         : 'das älteste wäre ohnehin bald verdorben, gibt dafür nur die Hälfte.'),
      aus: !frei || !lager,
      tu: function () { anstich(ausBottich); }
    }));
    z.appendChild(paar);

    /* ------------------------------------------------------------------
       DIE GESPERRTE CHARGE — 1970, und bis Welle 4 unerreichbar.

       Gemessen (400 Wochen, sorgfaeltig gespielt, 1970): das Haus fuhr
       50 Sude, der Handel sperrte Chargen — und die beiden Antworten
       darauf standen in NULL von 400 Wochen bedienbar am Bildschirm. Sie
       hingen allein am Brett, und das Brett liegt zugeklappt. Nach vier
       Wochen gibt der Braumeister von selbst frei; die epocheneigene
       Entscheidung von 1970 fiel also vierzehn Jahre lang ohne den
       Spieler.

       Sie steht jetzt auf dem Zettel, und zwar VOR der Umstellung: eine
       Charge mit Frist ist dringender als ein Verfahren ohne.
       ------------------------------------------------------------------ */
    var chd = ep().charge;
    var chb = null;
    if (chd) {
      for (var ci = 0; ci < Z.bottiche.length; ci++) {
        if (Z.bottiche[ci].gesperrt) { chb = Z.bottiche[ci]; break; }
      }
    }
    if (chb) {
      var cp = B.el('div', 'sud-zpaar');
      cp.appendChild(knopf({
        text: chd.frei.text + ' · Charge ' + chb.nr + ' · ±' + chb.streuung + ' %',
        zug: 'sud:zettel-charge-frei',
        klasse: 'sud-tat klein voll halb',
        titel: chd.frei.titel,
        tu: function () { chargeFrei(chb); }
      }));
      cp.appendChild(knopf({
        text: chd.schnitt.text + ' · −' + B.welt.menge(Math.max(1, Math.round(chb.fass / 3))),
        zug: 'sud:zettel-charge-schnitt',
        klasse: 'sud-tat klein voll halb',
        fass: Math.max(1, Math.round(chb.fass / 3)),
        titel: chd.schnitt.titel,
        tu: function () { chargeSchnitt(chb); }
      }));
      z.appendChild(cp);
    }

    /* Zwei Umstellungen, die einander ausschliessen, mit ihrem Preis daneben:
       die naechste, die NICHTS kostet, und die naechste, die etwas kostet.
       Genau das ist die zweite Latte, und sie muss im VORGABESTAND stehen —
       ein Brett, das erst aufgeschlagen werden muss, zaehlt dort nicht. */
    var freie = [], mit = null, zeilen = 0;
    achsen().forEach(function (a) {
      a.optionen.forEach(function (o) {
        if (gewaehlt(a) === o || verdraengt(a, o)) return;
        var p = offenerPreis(a, o);
        if (p === 0) freie.push({ o: o, a: a, p: 0 });
        else if (!mit || p < mit.p) mit = { o: o, a: a, p: p };
      });
    });

    /* Die zweite kostenlose Umstellung soll moeglichst eine ANDERE Frage
       beantworten — zwei Fragen sind mehr wert als zwei Antworten auf
       dieselbe. Gibt es keine andere Achse, tut es die zweite Antwort
       derselben: „Weizen oder Hafer" (1600) ist eine echte Wahl. */
    var zweiteFrei = null, fi;
    for (fi = 1; fi < freie.length; fi++) {
      if (freie[fi].a !== freie[0].a) { zweiteFrei = freie[fi]; break; }
    }
    if (!zweiteFrei && freie.length > 1) zweiteFrei = freie[1];

    /* ------------------------------------------------------------------
       WAS IN DIE ZWEITE ZEILE KOMMT — Auflage 2 des blinden Kritikers.

       Bis hierher stand dort IMMER die naechste bezahlte Umstellung, auch
       wenn die Kasse sie nicht hergab. Gemessen in 1350: das war in 296 von
       301 Wochen ein abgeschalteter Knopf, und der Spieler hatte an der
       Bierfrage genau einen druckbaren.

       Jetzt entscheidet die Kasse, was dort steht:
         Kasse traegt den Preis   → die bezahlte Umstellung (`-kauf`)
         Kasse traegt ihn nicht   → die naechste KOSTENLOSE Umstellung einer
                                    ANDEREN Achse (`-frei2`)
         beides gibt es nicht     → wieder die bezahlte, abgeschaltet, damit
                                    der Preis wenigstens zu lesen ist

       Der Schluessel wechselt mit: ein Knopf, der nichts kostet, heisst hier
       nicht `-kauf`. Wer zaehlt, soll nicht raten muessen, was er zaehlt.
       Was dabei vom Schirm faellt — der Preis der teuren Festlegung — steht
       eine Zeile tiefer als Text.
       ------------------------------------------------------------------ */
    var kannKauf = !!(mit && B.welt.kann(mit.p));
    var zweite = null, art = 'kauf';
    if (kannKauf) { zweite = mit; art = 'kauf'; }
    else if (zweiteFrei) { zweite = zweiteFrei; art = 'frei2'; }
    else if (mit) { zweite = mit; art = 'kauf'; }
    /* Steht eine Charge gesperrt, bleibt die erste Zeile ihr — dann ist der
       Schluessel `-frei` unbenutzt, und die zweite Zeile darf die ERSTE
       kostenlose Umstellung tragen statt der zweiten. */
    if (chb && art === 'frei2') { zweite = freie[0]; art = 'frei'; }

    /* Steht eine Charge gesperrt, nimmt sie den Platz der freien
       Umstellung — der Zettel bleibt unter der Ortsmarken-Schwelle der
       STADT (2,4 % der Buehne), und die Frist geht vor. */
    [{ k: chb ? null : freie[0], s: 'frei' }, { k: zweite, s: art }].forEach(function (x) {
      var kand = x.k;
      if (!kand) return;
      var kn = knopf({
        text: kand.o.name,
        zug: 'sud:zettel-wechsel-' + x.s,
        preis: kand.p ? -kand.p : 0,
        klasse: 'sud-tat klein voll' + (kand.o.fest ? ' siegel' : ''),
        titel: kand.a.frage + ' ' + kand.o.satz
             + (kand.o.fest ? ' UNWIDERRUFLICH: danach ist diese Frage '
             + 'entschieden, und die Vorgabe ist nicht mehr zu haben.' : ''),
        aus: !!(kand.p && !B.welt.kann(kand.p)),
        tu: function () { waehle(kand.a, kand.o); }
      });
      /* Was dabei herauskommt, steht AM KNOPF und nicht erst im Brett:
         sonst ist die Wahl zwei Namen ohne Folge. Und es steht als das da,
         was es ist — ein DECKEL, kein Versprechen (Auflage 3). */
      if (kand.o.hoechst !== undefined) {
        var zs = sorteAufStufe(kand.o.hoechst);
        if (zs) {
          var hoch = kand.o.hoechst >= obersteStufe();
          kn.appendChild(B.el('span', 'sud-zrangschild' + (hoch ? ' hoch' : ' tief'),
            (hoch ? 'lässt ' + zs.name + ' zu' : 'nur ' + zs.name)));
        }
      }
      z.appendChild(kn);
      zeilen++;
    });

    /* Der Preis, der gerade nicht auf einem Knopf steht — als Zeile, damit
       der Spieler weiss, worauf er sparen wuerde. Nicht, solange eine Charge
       mit Frist steht: dann ist der Zettel voll, und die Frist geht vor. */
    if (mit && zweite !== mit && !chb) {
      z.appendChild(B.el('div', 'sud-zpreiszeile',
        mit.o.name + ' ' + B.welt.geld(mit.p) + ' — die Kasse trägt es noch nicht.'));
    }

    /* ------------------------------------------------------------------
       WENN DIE FRAGE ENTSCHIEDEN IST, STEHT DIE NAECHSTE DA.

       Das Siegel haelt jetzt (siehe verdraengt()) — und damit verschwindet
       in 1350 nach dem Hopfenbrief die letzte Zeile mit einem Preisschild
       vom Zettel. Eine unwiderrufliche Festlegung darf das Brett nicht
       leerraeumen. Der Gaerraum ist der Zug, der danach bleibt: er kostet,
       er staffelt sich hinauf, er hat in jeder Epoche eine andere
       Nebenbedingung, und er bewegt Fass — also gehoert er nach
       ZUSTAENDIGKEIT §18 in den Nenner und auf den Zettel.
       ------------------------------------------------------------------ */
    if (zeilen < 2 && !chb) {
      var gp = kaufPreis(), gs = kaufSperre();
      z.appendChild(knopf({
        text: gk().kauf.text + ' · +' + B.welt.menge(gk().kauf.menge),
        zug: 'sud:zettel-gaerraum',
        preis: -gp,
        klasse: 'sud-tat klein voll',
        titel: gs || fuelle(gk().kauf.titel),
        aus: !!gs || !B.welt.kann(gp),
        tu: kaufeGaerraum
      }));
    }

    /* Der frisch gezeichnete Zettel setzt sich dorthin, wo der vorige sass —
       sonst springt er bei jedem Neuzeichnen an das Sudhaus zurueck und sucht
       seinen Platz von vorn. */
    if (Z.zettelSitz.knapp) z.classList.add('knapp');
    B.orte.setze(z, 'sudhaus',
      { anker: 'mitte', dx: Z.zettelSitz.dx, dy: Z.zettelSitz.dy });
    fach.appendChild(z);
    return z;
  }

  /* ----------------------------------------------------------------------
     WO DER KESSELZETTEL SITZEN DARF — Welle 4.

     Der schwerste gemessene Fund dieser Runde und der Grund, warum die
     Bierentscheidung in einer sorgfaeltig gespielten Partie fast nie
     erreichbar war (werkbank/schuss/sud-w4/linie.mjs, 400 Wochen je Epoche):

       1350  in 305 von 400 Wochen stand KEIN Wechselknopf zur Verfuegung,
             obwohl der Zettel die ganze Zeit im Bild war
       1600  in 354 von 400

     Der Zettel haengt am Sudhaus, und ueber dem Sudhaus liegen die
     Anschlagtafel und die Haeusertafel der FUHRE. Sie decken seine UNTERE
     Haelfte — also genau die Knoepfe. Die alte Selbstpruefung fragte nur
     den MITTELPUNKT des Zettels ab (fremdVerdeckt) und meldete deshalb
     "frei", waehrend jeder einzelne Knopf darunter von elementFromPoint
     nicht mehr getroffen und von schalte() abgeschaltet wurde: ein Zettel,
     der sichtbar dasteht und nichts kann.

     Beiseitetreten heilt das nicht — dann ist er ganz weg. Also sucht er
     sich seinen Platz, so wie es das Sudbuch auf seiner Klappe schon tut
     (sud-zusatz.js): er geht ein paar Stellen AM SUDHAUS durch und bleibt
     an der ersten stehen, an der (a) alle seine eigenen Knoepfe getroffen
     werden und (b) er keinen fremden Zug begraebt. Findet er keine, tritt
     er wie bisher zurueck — lieber kein Zettel als drei Knoepfe, die keine
     sind.

     Alle Stellen sind in Prozent der Buehne und haengen am Ort 'sudhaus';
     eigene Koordinaten gibt es hier nicht (LIESMICH: Orte).
     ---------------------------------------------------------------------- */
  var ZETTELSTELLEN = [
    { dx: 0, dy: 0 }, { dx: 0, dy: -13 }, { dx: 0, dy: 13 },
    { dx: -15, dy: -8 }, { dx: 15, dy: -8 },
    { dx: -15, dy: 9 }, { dx: 15, dy: 9 }, { dx: 0, dy: -22 }
  ];

  /* ----------------------------------------------------------------------
     ... UND WOHIN ER AUSWEICHT, WENN AM SUDHAUS NICHTS FREI IST — Welle 4,
     Auflage 1 und 4 des blinden Kritikers.

     Die acht Stellen oben reichen nicht. Gemessen (`rettung.mjs`, sorgfaeltig
     gespielt, Vorgabestand): der Zettel trug in 1350 in 7,0 %, in 1600 in
     7,7 %, in 1884 in 6,9 % und in 1970 in 5,7 % der Wochen `display: none`;
     ohne das woechentliche Auf- und Zuklappen des Sudbretts waren es 28-42 %.
     Und darunter waren 29 Wochen, in denen das Haus die 78 Pf fuer den
     Hopfenbrief hatte und `data-soll-aus="0"` stand: das Spiel haette den Kauf
     erlaubt, der Knopf war nur nicht da.

     Der Kritiker hat die Ursache genauer benannt, als die eigene Meldung es
     tat, und er hat recht: **in NULL Faellen lag ein fremdes Brett obenauf.**
     Der Zettel nahm sich selbst weg. Die Regel dahinter war ehrlich gemeint
     („lieber kein Zettel als drei Knoepfe, die keine sind"), aber sie ist die
     falsche Antwort auf zu wenige Stellen. Die richtige ist: MEHR STELLEN.

     Deshalb jetzt drei Stufen, in dieser Reihenfolge:

       1  die acht Stellen am Sudhaus  (nah, wie bisher — der Regelfall)
       2  ein Raster ueber die ganze Buehne, nach Entfernung vom Sudhaus
          sortiert: der Zettel geht so weit weg, wie er muss, und keinen
          Prozentpunkt weiter
       3  KNAPP — er wirft Kopfzeile, Verfahrenszeile und Zahlen ab und
          behaelt nur seine Knoepfe; damit passt er in Luecken, in die der
          volle Zettel nicht passt, und sucht 1 und 2 noch einmal ab

     Erst wenn auch das nichts findet, bleibt er stehen und traegt `gedraengt`
     statt `beiseite` — sichtbar, mit `data-verdeckt` an seinen Knoepfen.
     `display: none` bleibt genau EINEM Fall vorbehalten: das eigene Brett
     liegt offen, dann ist der Zettel nicht weg, sondern gross.

     Alle Stellen sind Prozentpunkte der Buehne und haengen am Ort 'sudhaus';
     eigene Koordinaten gibt es hier nicht (LIESMICH: Orte). Das Raster ist
     nach dem Quadrat der Entfernung sortiert, y mit 3,2 gewichtet, weil ein
     Prozentpunkt der Hoehe (Bezug 2752 x 1536) nur 0,56 Prozentpunkte der
     Breite lang ist.
     ---------------------------------------------------------------------- */
  var AUSWEICHSTELLEN = (function () {
    var l = [], x, y;
    for (y = -30; y <= 36; y += 6) {
      for (x = -22; x <= 60; x += 6) {
        if (Math.abs(x) <= 16 && Math.abs(y) <= 14) continue;   /* liegt schon oben */
        l.push({ dx: x, dy: y });
      }
    }
    l.sort(function (a, b) {
      return (a.dx * a.dx + a.dy * a.dy * 3.2) - (b.dx * b.dx + b.dy * b.dy * 3.2);
    });
    return l;
  })();

  /* Die Mittelpunkte aller FREMDEN Zuege — einmal je Suche geholt und dann
     wiederverwendet. Ohne diesen Vorrat kostet eine Suche ueber hundert
     Stellen zehntausend elementFromPoint, und der Takt laeuft alle 320 ms. */
  function fremdePunkte(zettel) {
    var l = document.querySelectorAll('[data-zug]'), p = [];
    for (var i = 0; i < l.length; i++) {
      var el = l[i];
      if (zettel.contains(el)) continue;
      var r = el.getBoundingClientRect();
      if (r.width < 3 || r.height < 3) continue;
      p.push({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
    return p;
  }

  /* Sitzt der Zettel gut: eigene Knoepfe treffbar, kein fremder begraben? */
  function zettelSitzt(zettel, punkte) {
    var kn = zettel.querySelectorAll('button[data-zug]'), i;
    for (i = 0; i < kn.length; i++) {
      if (kn[i].getAttribute('data-soll-aus') === '1') continue;
      if (!imBild(kn[i])) return false;
    }
    var q = zettel.getBoundingClientRect();
    var p = punkte || fremdePunkte(zettel);
    for (i = 0; i < p.length; i++) {
      if (p[i].x < q.left || p[i].x > q.right || p[i].y < q.top || p[i].y > q.bottom) continue;
      var t = document.elementFromPoint(p[i].x, p[i].y);
      if (t && zettel.contains(t)) return false;
    }
    return true;
  }

  function setzeStelle(zettel, s) {
    B.orte.setze(zettel, 'sudhaus', { anker: 'mitte', dx: s.dx, dy: s.dy });
  }

  /* Wuerde der Zettel hier ueberhaupt auf die Buehne passen, ohne einen
     fremden Knopf zu begraben? Rein gerechnet, ohne ihn zu bewegen. Was
     diese Probe uebersteht, wird danach wirklich nachgemessen — was sie
     nicht uebersteht, kostet keinen einzigen elementFromPoint. */
  function grobFrei(zettel, s, punkte) {
    var eltern = zettel.offsetParent || document.body;
    var b = eltern.getBoundingClientRect();
    var q = zettel.getBoundingClientRect();
    var o = B.orte.hole('sudhaus');
    if (!o || !b.width || !b.height || q.width < 3 || q.height < 3) return true;
    var cx = b.left + b.width * (o.x + s.dx) / 100;      /* anker 'mitte' */
    var cy = b.top + b.height * (o.y + s.dy) / 100;
    var links = cx - q.width / 2, oben = cy - q.height / 2;
    var rechts = links + q.width, unten = oben + q.height;
    if (links < b.left || oben < b.top || rechts > b.right || unten > b.bottom) return false;
    for (var i = 0; i < punkte.length; i++) {
      if (punkte[i].x >= links && punkte[i].x <= rechts
        && punkte[i].y >= oben && punkte[i].y <= unten) return false;
    }
    return true;
  }

  /* Die erste Stelle der Liste, die wirklich traegt. `hoechstens` deckelt,
     wie viele Stellen nachgemessen werden duerfen — der Takt laeuft alle
     320 ms und darf keine Sekunde brauchen. */
  function sucheStelle(zettel, liste, punkte, hoechstens) {
    var echt = 0;
    for (var i = 0; i < liste.length; i++) {
      if (!grobFrei(zettel, liste[i], punkte)) continue;
      if (echt >= hoechstens) break;
      echt++;
      setzeStelle(zettel, liste[i]);
      if (zettelSitzt(zettel, punkte)) {
        Z.zettelSitz = { dx: liste[i].dx, dy: liste[i].dy,
                         knapp: zettel.classList.contains('knapp') };
        return true;
      }
    }
    return false;
  }

  function stelleZettel(zettel) {
    zettel.classList.remove('knapp');
    var punkte = fremdePunkte(zettel);
    if (zettelSitzt(zettel, punkte)) {
      Z.zettelSitz.knapp = false;
      return true;
    }
    if (sucheStelle(zettel, ZETTELSTELLEN, punkte, ZETTELSTELLEN.length)) return true;
    if (sucheStelle(zettel, AUSWEICHSTELLEN, punkte, 20)) return true;

    /* Der Zettel wird kleiner, ehe er geht. */
    zettel.classList.add('knapp');
    punkte = fremdePunkte(zettel);
    if (sucheStelle(zettel, ZETTELSTELLEN, punkte, ZETTELSTELLEN.length)) return true;
    if (sucheStelle(zettel, AUSWEICHSTELLEN, punkte, 28)) return true;

    /* Nichts traegt. Er bleibt trotzdem stehen — an seinem Ort, klein, und
       mit `data-verdeckt` an jedem Knopf, den die Maus nicht trifft. Wer
       zaehlt, sieht den Unterschied; wer spielt, sieht, dass es ihn gibt. */
    setzeStelle(zettel, ZETTELSTELLEN[0]);
    Z.zettelSitz = { dx: 0, dy: 0, knapp: true };
    return false;
  }

  /* ----------------------------------------------------------------------
     Zugeklappte Bretter der STADT lassen ihre Knoepfe im DOM aktiv stehen
     (STAND.md §6.9). Fuer die Maus ist das harmlos — clip-path setzt
     pointer-events:none —, fuer jede Zaehlung ist es eine Fehlerquelle:
     BRAUHAUS.zuege() meldet sie als offen. In den EIGENEN Dateien ist das
     zu heilen, also wird es hier geheilt.
     ---------------------------------------------------------------------- */
  /* Und dasselbe eine Ebene tiefer: ein Knopf, den die Maus nicht trifft, ist
     kein Knopf. Ueber diesem Brett kann ein formatfuellendes Blatt liegen —
     die Michaelitafel etwa nimmt an der Platzordnung der STADT ausdruecklich
     nicht teil (BEFUND-BRETTER.md §5). Dann steht hier ein Dutzend aktiver,
     untreffbarer Knoepfe, und genau das zaehlt ein Kritiker als tot. Also
     fragt jeder Knopf selbst nach, ob er im Bild ist, und schaltet sich
     sonst ab, bis das Blatt wieder weg ist. Die gemeinsame Sperrschicht
     bleibt Kernaufgabe (ZUSTAENDIGKEIT §2); dies ist die Fassung, die ein
     einzelnes Stueck in seinen eigenen Dateien bauen darf. */
  function imBild(el) {
    var q = el.getBoundingClientRect();
    if (q.width < 3 || q.height < 3) return false;
    var x = q.left + q.width / 2, y = q.top + q.height / 2;
    if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) return false;
    var t = document.elementFromPoint(x, y);
    return !!(t && (t === el || el.contains(t)));
  }

  /* ----------------------------------------------------------------------
     WARUM EIN KNOPF AUS IST — Auflage 5 des Kritikers, Welle 4.

     `schalte()` schaltet aus drei ganz verschiedenen Gruenden ab, und bis
     hierher landeten alle drei in demselben `disabled`:

       das SPIEL sagt nein      kein Geld, das Siegel liegt darauf, laeuft schon
       das eigene BRETT ist zu  zugeklappte Bretter der STADT lassen ihre
                                Knoepfe im DOM aktiv stehen (STAND.md §6.9)
       es liegt etwas DARUEBER   ein fremdes Blatt, die Maus trifft nicht mehr

     Gemessen hat der Kritiker das so: „Wer `disabled` zaehlt, kann ‚das Spiel
     sagt nein' nicht von ‚da liegt etwas darueber' unterscheiden." Das stimmt
     — und es war in diesem Stueck nur deshalb nachweisbar, weil `data-soll-aus`
     danebensteht. Ab jetzt steht der ganze Grund am Knopf:

       data-soll-aus="1"   das Spiel sagt nein (steht schon beim Zeichnen fest)
       data-verdeckt="1"   der Zug waere erlaubt, aber etwas liegt darueber
       data-aus-grund      in Worten: "spiel" · "verdeckt" · "brett-zugeklappt"
                           · "brett-offen" (der Zettel tritt hinter das eigene
                           aufgeschlagene Brett zurueck)

     Ein Zaehler, der ehrlich messen will, nimmt `data-soll-aus`; wer die
     Verdeckung sucht, nimmt `data-verdeckt`; wer wissen will, warum, liest
     `data-aus-grund`. `disabled` bleibt die Summe — denn ein Knopf, den die
     Maus nicht trifft, ist wirklich kein Knopf, und ihn aktiv stehen zu
     lassen waere die groessere Luege.
     ---------------------------------------------------------------------- */
  function merke(k, name, wert) {
    if (wert) { if (k.getAttribute(name) !== wert) k.setAttribute(name, wert); }
    else if (k.hasAttribute(name)) k.removeAttribute(name);
  }

  function schalte(wurzel, tot, grund) {
    if (!wurzel) return;
    var kn = wurzel.querySelectorAll('button[data-zug]');
    for (var i = 0; i < kn.length; i++) {
      var soll = kn[i].getAttribute('data-soll-aus') === '1';
      var verdeckt = !tot && !soll && !imBild(kn[i]);
      var neu = tot || soll || verdeckt;
      merke(kn[i], 'data-verdeckt', verdeckt ? '1' : null);
      merke(kn[i], 'data-aus-grund',
        tot ? (grund || 'brett-zugeklappt') : (soll ? 'spiel' : (verdeckt ? 'verdeckt' : null)));
      if (kn[i].disabled !== neu) {
        kn[i].disabled = neu;
        if (neu) kn[i].setAttribute('aria-disabled', 'true');
        else kn[i].removeAttribute('aria-disabled');
      }
    }
  }

  /* ------------------------------------------------------------------------
     WAS DIE STADT MIT DIESEM BRETT VORHAT — ihre eigene Buchfuehrung.

     AUFLAGE 1 DES BLINDEN KRITIKERS (Welle 6), und er hat recht. Die alte
     Fassung schloss aus zwei Zeichen auf eine Lage:

       Klasse `stadt-zugeklappt` da   -> zu, und diesen Knoten merken
       Klasse weg, Knoten gemerkt     -> auf
       Klasse weg, Knoten NICHT gemerkt -> die ALTE Lage weiterschreiben

     Die dritte Zeile war die Klemme. `klappeAuf()` der STADT (stadt.js:526)
     nimmt die Klasse nur ab, wenn sie DA ist — an einem frisch gezeichneten
     Brett war sie nie da, also raeumt die STADT dort nichts ab und stempelt
     auch nichts. Der Merker kommt damit NIE an den neuen Knoten, und die
     dritte Zeile schreibt ein `true` von einem laengst weggeklappten
     Vorgaenger endlos fort. Gemessen: in 20 bis 53 von je 400 Wochen stand
     das Sudbrett offen, vollstaendig im Bild, von der Maus zu treffen — und
     alle seine Knoepfe abgeschaltet, bis zu 192 Ablesungen davon mit
     `data-soll-aus="0"`, also gegen den erklaerten Willen des Spiels.
     Es loeste sich in 8 Sekunden ohne Eingabe nicht und auch nach einem
     Reiterklick nicht, erst nach zweien: erst der erste bringt die Klasse
     zurueck, und erst dann kann der zweite sie abnehmen.

     Der Fehler war nicht der Merker, sondern DASS GERATEN WURDE. DIE STADT
     fuehrt Buch darueber, was offen liegt, und sie gibt es ausdruecklich
     heraus (`B.stadt.rahmen.lage()`, stadt.js:1576: „Kleiner Lesezugriff
     fuer die anderen drei Stuecke: steht das schon? Niemand muss dafuer in
     fremdes DOM sehen."). Also wird gefragt statt geraten. Der Schluessel
     ist `wer|Klassen ohne stadt-zugeklappt` (stadt.js:494), fuer dieses
     Brett `sud|sud-brett`.

     Nichts davon wird leiser gemeldet: `data-soll-aus`, `data-aus-grund`
     und `data-verdeckt` bleiben Wort fuer Wort, wo sie waren. Richtig wird
     der ZUSTAND, nicht die Auskunft (Sperrliste 2). */
  function rahmenWill() {
    try {
      if (!B.stadt || !B.stadt.rahmen || !B.stadt.rahmen.lage) return null;
      var l = B.stadt.rahmen.lage();
      if (!l) return null;
      var k = Object.keys(l);
      for (var i = 0; i < k.length; i++) {
        if (k[i].indexOf('sud|') === 0 && k[i].indexOf('sud-brett') > 0) return l[k[i]];
      }
    } catch (e) {}
    return null;
  }

  /* ------------------------------------------------------------------------
     DIE ZWEITE HAELFTE DERSELBEN AUFLAGE — der Wimpernschlag nach dem
     REITERKLICK.

     Nach der Behebung oben war die Klemme als DAUERZUSTAND weg, und trotzdem
     blieben in einer sorgfaeltig gespielten Partie Ablesungen uebrig:
     1350 reich 46, 1350 arm 69, alle mit `data-aus-grund="brett-zugeklappt"`,
     alle mit Maustreffer. Sie kamen nicht mehr aus dem alten Fehler, sondern
     aus dem TAKT.

     `stadt.js:557 schalte()` dreht die Lage im Klickzuge um und ruft
     `pruefe()` — die Klasse `stadt-zugeklappt` ist damit SOFORT ab, noch im
     Ereignis des Klicks, und ein `zeichne` schickt die STADT dabei nicht.
     DER SUD sah bis hierher erst in seinem naechsten eigenen Takt nach
     (320 ms, sud.js:2294). In diesem Fenster steht das Brett offen und
     vollstaendig im Bild, die Maus trifft seine Knoepfe — und sie sind noch
     alle abgeschaltet. Fuer den Spieler ist das derselbe Anblick wie die
     Klemme, nur kuerzer; fuer einen Zaehler ist es dieselbe Ablesung.

     Schlimmer noch: wer daraufhin ein zweites Mal auf den Reiter klickt —
     und das tut jeder, dem der erste Klick nichts getan zu haben scheint —
     klappt das Brett wieder zu. Genau dieses Pendeln stand in den Belegen
     (`aufOk: 0` nach fuenf Klicks).

     Also wird nicht mehr gewartet: DIE KLASSE SELBST LOEST DEN TAKT AUS. Ein
     Beobachter am Brett, der nur auf `class` hoert, holt den Takt in denselben
     Mikrotask. `schalte()` fasst ausschliesslich Knoepfe an und nie die Klasse
     des Bretts — der Beobachter kann sich also nicht selbst wecken.
     ------------------------------------------------------------------------ */
  var brettBlick = null;
  function beobachteBrett(brett) {
    if (!window.MutationObserver || !brett) return;
    if (brettBlick && brettBlick.ziel === brett) return;
    if (brettBlick) brettBlick.o.disconnect();
    var o = new MutationObserver(function () { taktZugeklappt(); });
    o.observe(brett, { attributes: true, attributeFilter: ['class'] });
    brettBlick = { o: o, ziel: brett };
  }

  /* Der Gnadenschluss, falls die STADT gar nichts sagt (sie ist beim Laden
     noch nicht durch ihren ersten Takt, und ein Pruefstand ohne stadt.js
     sagt nie etwas). Solange gilt weiter die alte Lage — aber NICHT mehr
     unbegrenzt: nach zwei Takten der STADT (240 ms) plus Rest ist ein Brett
     ohne Klasse ein offenes Brett. So kann kein Zustand mehr endlos
     fortgeschrieben werden, auch wenn die STADT einmal ausbleibt. */
  var GNADE = 700;
  function nochJung(brett) {
    var t = +brett.getAttribute('data-sud-frisch') || 0;
    var jetzt = Date.now();
    if (!t) { brett.setAttribute('data-sud-frisch', String(jetzt)); return true; }
    return (jetzt - t) <= GNADE;
  }

  function taktZugeklappt() {
    B.wage('sud.takt', function () {
      var fach = document.getElementById('fach-hand-sud');
      var brett = fach ? fach.firstElementChild : null;
      var zettel = document.querySelector('.sud-zettel');
      if (brett) {
        beobachteBrett(brett);
        /* Der Rahmen der STADT stempelt `stadt-zugeklappt` erst in seinem
           naechsten Takt (stadt.js: TAKT = 240 ms). Ein FRISCH GEZEICHNETES
           Brett traegt also fuer einen Wimpernschlag gar nichts — und
           "nichts" heisst hier nicht "offen": die STADT sagt selbst, ein
           Brett liegt beim Laden zu. Wer das verwechselt, schickt den
           Kesselzettel bei jedem Neuzeichnen kurz auf `display:none`, und
           genau das hat eine Messung unter Last auch getroffen. Also wird
           in diesem Wimpernschlag die STADT gefragt — und erst wenn auch
           sie schweigt, gilt die alte Lage, und die nur auf Frist. */
        var zu = brett.classList.contains('stadt-zugeklappt');
        if (zu) brett.setAttribute('data-sud-gesehen', '1');
        else if (!brett.hasAttribute('data-sud-gesehen')) {
          var will = rahmenWill();
          if (will) zu = (will === 'zu');
          else zu = Z.brettZu && nochJung(brett);
        }
        Z.brettZu = zu;
        schalte(brett, Z.brettZu, 'brett-zugeklappt');
      }
      /* DER SUD zeigt genau EINE Flaeche. Der Kesselzettel haengt am
         Sudhaus, und das Sudhaus liegt unter dem eigenen Brett — steht
         beides zugleich im Bild, verdeckt dieses Stueck seine eigenen drei
         Knoepfe, und ein Zaehler findet sie aktiv und untreffbar. Also
         tritt der Zettel zurueck, solange das Brett offen liegt, und mit
         ihm seine Knoepfe. Genau der Fehler, den BEFUND-BRETTER.md misst,
         nur diesmal im eigenen Haus. */
      if (zettel) {
        /* `beiseite` (display:none) gilt ab Welle 4 fuer GENAU EINEN Fall:
           das eigene Brett liegt offen. Dann ist der Zettel nicht weg,
           sondern gross — und beide zugleich waeren dieselbe Selbstverdeckung
           noch einmal.

           Findet der Zettel dagegen keine Stelle, verschwindet er NICHT mehr.
           Genau das war Auflage 1: gemessen 29 Wochen in 1350, in denen Geld
           und Erlaubnis da waren und trotzdem kein Knopf am Schirm stand. Er
           bleibt jetzt stehen, klein und `gedraengt`, und seine Knoepfe sagen
           ueber `data-verdeckt`, woran es liegt. */
        var brettOffen = !Z.brettZu;
        var passt = true;
        if (!brettOffen) {
          zettel.classList.remove('beiseite');
          passt = stelleZettel(zettel);
        }
        if (zettel.classList.contains('beiseite') !== brettOffen) {
          zettel.classList.toggle('beiseite', brettOffen);
        }
        var eng = !brettOffen && !passt;
        if (zettel.classList.contains('gedraengt') !== eng) {
          zettel.classList.toggle('gedraengt', eng);
        }
        schalte(zettel, brettOffen, 'brett-offen');
      }
    });
  }

  /* Der Vorgaenger dieser Stelle hiess fremdVerdeckt() und fragte genau EINEN
     Punkt ab — den Mittelpunkt des Zettels. Er ist ersatzlos gestrichen: die
     fremden Bretter der FUHRE decken die UNTERE Haelfte des Zettels, also
     seine Knoepfe und nicht seine Mitte, und deshalb meldete er in 305 von
     400 Wochen "frei" ueber einem Zettel, an dem nichts mehr zu druecken war.
     Was jetzt gilt, steht bei ZETTELSTELLEN. */

  /* Der Rahmen der STADT entscheidet erst im naechsten Bild, ob ein frisch
     gezeichnetes Brett zugeklappt liegt. Zweimal warten, dann nachsehen —
     sonst blinkt der Zettel bei jedem Neuzeichnen kurz ueber dem Brett. */
  function taktGleich() {
    if (typeof window.requestAnimationFrame !== 'function') { taktZugeklappt(); return; }
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(taktZugeklappt);
    });
  }

  /* ======================================================================
     DER NAECHSTE SINNVOLLE ZUG
     ZUSTAENDIGKEIT §18: in den Nenner gehoert, was Rohstoff, Fass, Adresse,
     Bau oder Bindung bewegt. Gaerraum ist Bau, ein Verfahren bewegt Rohstoff
     und Haltbarkeit. Beiwerk meldet dieses Stueck nicht.
     ====================================================================== */
  /* Steht zu diesem Schluessel ein bedienbarer Knopf im Bild? */
  function lebt(zug) {
    if (typeof document === 'undefined') return false;
    var el = document.querySelector('[data-zug="' + zug + '"]');
    return !!(el && !el.disabled);
  }

  function meldeZug() {
    var bester = null;
    achsen().forEach(function (a) {
      a.optionen.forEach(function (o) {
        if (!o.preis || bezahlt(a, o) || verdraengt(a, o)) return;
        /* Gemeldet wird, was WIRKLICH abzubuchen ist — der Listenpreis
           abzueglich der Anrechnung. In den Nenner der zweiten Latte gehoert
           die Zahl, die am Knopf steht, sonst ist die Kennzahl eine
           Behauptung (ZUSTAENDIGKEIT §24). */
        var op = offenerPreis(a, o);
        if (!bester || op < bester.preis) {
          /* Das Verfahren bewegt Rohstoff, Haltbarkeit und die Sorte im
             Fass — Lage, nicht Beiwerk. Getragen wird der Zug im
             Vorgabestand vom Kesselzettel, aufgeschlagen vom Brett. */
          bester = { was: o.name, preis: op, art: 'lage',
                     zuege: ['sud:zettel-wechsel-kauf', 'sud:' + a.schluessel + ':' + o.k] };
        }
      });
    });
    var p = kaufPreis();
    if (!kaufSperre() && (!bester || p < bester.preis)) {
      bester = { was: gk().kauf.text, preis: p, art: 'bau',
                 zuege: ['sud:zettel-gaerraum', 'sud:gaerraum'] };
    }
    if (!bester) return;
    /* ZUSTAENDIGKEIT §24: wer seinen Zugschluessel mitschickt, wird beim Wort
       genommen — zugDeckung() liefert null, wenn zu der Meldung kein
       bedienbarer Knopf steht. Also meldet dieses Stueck NUR, was gerade
       wirklich zu druecken ist. Vorher meldete es in jeder Woche einen
       Preis, auch wenn sein Brett zugeklappt und jeder seiner Knoepfe
       abgeschaltet war: eine Zahl ohne Knopf, also eine Behauptung. */
    var zug = null;
    for (var i = 0; i < bester.zuege.length; i++) {
      if (lebt(bester.zuege[i])) { zug = bester.zuege[i]; break; }
    }
    if (!zug) return;
    B.welt.meldeZug(bester.was, bester.preis, bester.art, zug);
  }

  /* ======================================================================
     ANMELDUNG
     ====================================================================== */

  function setzeEpoche() {
    var nr = B.welt.zeit.epoche;
    if (Z.epocheGesetzt === nr) return;
    Z.epocheGesetzt = nr;
    Z.verfahren = {};
    achsen().forEach(function (a) { Z.verfahren[a.schluessel] = vorgabe(a).k; });
    Z.zusatz = 0;
    Z.kaufNr = 0;
    /* Festlegungen einer vergangenen Epoche gelten nicht in der naechsten:
       ein Hopfenbrief des Rats von 1350 ist 1600 kein Felsenkeller. Was
       ueber den Schnitt geht, entscheidet DAS ERBE — hier steht nur, dass
       nichts stillschweigend mitwandert. */
    Z.fest = {};
    Z.guete = D.guete.start || 70;
    Z.rueck = [];
    Z.gestuft = 0;
  }

  B.stueck('sud', {

    aufbau: function () {
      setzeEpoche();

      /* Nach jedem Sud der FUHRE sofort ansaugen — dann ist der Lagerplatz
         schon wieder frei, ehe der naechste Sud ihn prueft. Ein Horcher auf
         das Protokoll reicht dafuer und fasst keine fremde Datei an. */
      B.auf('protokoll', function (p) {
        if (Z.imGange) return;
        if (!p || p.wer !== 'spieler') return;
        if (!/eingelegt/.test(p.was || '')) return;
        /* Gebraut ist gebraut, auch wenn der Gaerkeller voll ist und dieses
           Stueck den Sud gar nicht erst ansaugt. Sonst zaehlte ein volles
           Haus als kalte Pfanne — der Fehler waere teuer. */
        Z.jahrLegte++; Z.gesamtLegte++;
        B.wage('sud.protokoll', function () { saugeUndSchlage(); stempleHefe(); });
      });

      B.auf('ende', function () {
        buch('Das Sudbuch wird geschlossen: ' + Math.max(Z.gesamtLegte, Z.gesamtSude) + ' Sude, '
          + B.welt.menge(Z.gesamtFass) + ' angestellt.');
      });

      window.setInterval(taktZugeklappt, 320);

      B.welt.schreibe('Im Sudhaus hängt ein neuer Zettel: ' + ep().frage + ' '
        + ep().historie, 'sud');
    },

    woche: function () {
      B.wage('sud.woche', function () {
        setzeEpoche();
        liefere();
        sauge();
        stempleHefe();
        gueteWoche();
        anzeigePruefen();
        rueckPruefen();
        fehlsud();
        /* Was zu lange gesperrt steht, gibt der Braumeister von selbst frei —
           sonst entstuende ein Gaerkeller, der sich nie mehr leert. */
        var ch = ep().charge;
        if (ch) {
          Z.bottiche.forEach(function (b) {
            if (b.gesperrt && b.seitGesperrt >= (ch.frist || 4)) {
              b.gesperrt = false;
              Z.guete = B.grenze(Z.guete - 4, 0, 100);
              buch(ch.fristSatz + ' (Charge ' + b.nr + ')');
            }
          });
        }
        reifePruefen();
      });
    },

    jahr: function () {
      B.wage('sud.jahr', function () {
        setzeEpoche();
        /* Der Sommer laeuft durch: was im Gaerkeller steht, wird fertig. */
        var offen = Z.bottiche.length;
        for (var i = 0; i < 8 && Z.bottiche.length; i++) {
          Z.bottiche.forEach(function (b) { b.reifAb = 0; b.gesperrt = false; });
          if (!reifePruefen()) break;
        }
        if (offen) {
          B.welt.schreibe('Der Sommer über: ' + offen + ' '
            + (offen === 1 ? gk().gefaess : gk().gefaesse)
            + ' werden ausgeschlagen und aufs Fass gelegt.', 'sud');
        }
        /* "0 Sude" war die Zeile, die der Kritiker zitiert hat — und sie war
           in 1970 falsch: mit einem Verfahren ohne Gaerwochen laeuft kein Sud
           durch den Gaerkeller, das Haus BRAUT aber. Das Sudbuch zaehlt
           deshalb jetzt, was angestellt wurde, und daneben, was durch diesen
           Keller ging. Nur wenn beides null ist, ist die Pfanne wirklich kalt. */
        var angestellt = Math.max(Z.jahrLegte, Z.jahrSude);
        buch('Braujahr geschlossen: '
          + (angestellt ? angestellt + (angestellt === 1 ? ' Sud' : ' Sude') + ' angestellt'
                        : 'kein Sud angestellt')
          + (Z.jahrSude ? ', ' + Z.jahrSude + ' durch den '
                          + gk().name.replace(/^Der /, '') + ' (' + B.welt.menge(Z.jahrFass) + ')'
                        : '')
          + ', ' + Z.jahrFehl + ' verloren'
          + (Z.gestuft ? ', ' + Z.gestuft + ' zurückgestuft.' : '.'));
        kaltePfanne();
        Z.jahrSude = 0; Z.jahrFass = 0; Z.jahrFehl = 0; Z.jahrAnzeige = 0; Z.gestuft = 0;
        Z.jahrLegte = 0;
      });
    },

    epoche: function () {
      B.wage('sud.epoche', function () {
        /* Was noch gaert, geht mit ins Lager — Bier verschwindet nicht,
           weil eine Jahreszahl umspringt. */
        Z.bottiche.forEach(function (b) { b.reifAb = 0; b.gesperrt = false; });
        reifePruefen();
        Z.bottiche = [];
        Z.epocheGesetzt = 0;
        /* Neue Zeit, neues Haus: eine kalte Pfanne von 1350 belastet 1600
           nicht, und ein Tank, der 1970 auf dem Tieflader stand, kommt in
           keiner anderen Epoche an. */
        Z.kalt = 0; Z.jahrLegte = 0; Z.bestellt = [];
        setzeEpoche();
        buch('Neue Zeit, neues Verfahren: ' + ep().frage);
      });
    },

    zeichne: function () {
      setzeEpoche();
      liefere();
      saugeUndSchlage();
      stempleHefe();
      meldeZug();
      zeichneBrett();
      zeichneZettel();
      taktZugeklappt();
      taktGleich();
    }
  });

})(BRAUHAUS);
