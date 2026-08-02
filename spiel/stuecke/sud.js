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
    gestuft: 0,           /* wie oft dieses Jahr zurueckgestuft wurde         */
    buch: [],             /* die letzten Zeilen des Sudbuchs                  */
    jahrSude: 0, jahrFass: 0, jahrFehl: 0, jahrAnzeige: 0,
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

  /* Eine Option ist gesperrt, wenn eine bezahlte Festlegung sie verdraengt
     hat — die Kaeltemaschine baut den Eiskeller um, und der Eiskeller kommt
     nicht wieder. */
  function verdraengt(a, o) {
    for (var i = 0; i < a.optionen.length; i++) {
      var x = a.optionen[i];
      if (x === o || !x.sperrt || !bezahlt(a, x)) continue;
      if (x.sperrt.indexOf(o.k) >= 0) return true;
    }
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
      if (a && Z.verfahren[b.achse] !== b.option) return b.zu;
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
      Z.gestuft++;
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
  function fuelle(vorlage, x) {
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
        buch(fuelle(r.durch, x));
        continue;
      }
      x.weg = Math.max(1, Math.round(x.menge * 0.5));
      var raus = B.sud.nimmHeraus(x.weg, { aeltestes: true });
      x.weg = raus.length || x.weg;
      Z.guete = B.grenze(Z.guete - 8, 0, 100);
      buch(r.wer + ': Charge ' + x.nr + ' zurück — ' + B.welt.menge(x.weg) + ' aus dem Lager');
      B.welt.schreibe(fuelle(r.zurueck, x), 'sud');
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
    zustand: function () { return Z; }
  };

  /* ======================================================================
     BEDIENUNG
     ====================================================================== */

  function waehle(a, o) {
    if (verdraengt(a, o)) return;
    if (o.preis && !bezahlt(a, o)) {
      if (!B.welt.kann(o.preis)) return;
      if (!B.welt.zahle(o.preis, 'DER SUD: ' + o.name, 'spieler')) return;
      Z.fest[a.schluessel + ':' + o.k] = true;
      B.ton.spiele(o.fest ? 'sud:siegel' : 'sud:kauf', { ort: 'sudhaus' });
      B.welt.schreibe((o.fest ? 'Unwiderruflich festgelegt: ' : 'Angeschafft: ')
        + o.name + '. ' + o.satz, 'sud');
    } else {
      B.ton.spiele('sud:umstellen', { ort: 'sudhaus' });
    }
    Z.verfahren[a.schluessel] = o.k;
    buch(a.name + ': ' + o.name);
    B.sende('zeichne', { grund: 'sud:verfahren' });
  }

  function kaufeGaerraum() {
    var p = kaufPreis();
    if (!B.welt.zahle(p, 'DER SUD: ' + gk().kauf.text, 'spieler')) return;
    Z.zusatz += gk().kauf.menge;
    Z.kaufNr++;
    B.ton.spiele('sud:bau', { ort: 'sudhaus' });
    buch(gk().kauf.text + ' — jetzt ' + B.welt.menge(plaetze()) + ' Gärraum');
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

  function knopf(opt) {
    var k = B.knopf(opt);
    k.setAttribute('data-soll-aus', opt.aus ? '1' : '0');
    return k;
  }

  function zeile(klasse, text) { return B.el('div', klasse, text); }

  function zeichneAchse(fach, a) {
    var kasten = B.el('div', 'sud-achse');
    var kopf = B.el('div', 'sud-achskopf');
    kopf.appendChild(B.el('b', 'sud-achsname', a.name));
    kopf.appendChild(B.el('span', 'sud-frage', a.frage));
    kasten.appendChild(kopf);
    kasten.appendChild(zeile('sud-achssatz', a.satz));

    var reihe = B.el('div', 'sud-optionen');
    a.optionen.forEach(function (o) {
      var ist = gewaehlt(a) === o;
      var weg = verdraengt(a, o);
      var offenPreis = (o.preis && !bezahlt(a, o)) ? o.preis : 0;
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
      if (weg) marke.appendChild(B.el('span', 'sud-schild weg', 'nicht mehr zu haben'));
      else if (ist) marke.appendChild(B.el('span', 'sud-schild ist', 'läuft'));
      else if (o.fest && bezahlt(a, o)) marke.appendChild(B.el('span', 'sud-schild siegel', o.siegel || 'gesiegelt'));
      else if (o.fest) marke.appendChild(B.el('span', 'sud-schild fest', 'unwiderruflich'));
      else if (o.einmal && !bezahlt(a, o)) marke.appendChild(B.el('span', 'sud-schild', 'einmal zu zahlen'));
      else if (o.schild) marke.appendChild(B.el('span', 'sud-schild', o.schild));

      /* Das Preisschild dieses Stuecks: was fuer ein Bier dabei herauskommt.
         Es steht vor der Haltbarkeit, weil man es beim Wirt wiedersieht und
         die Haltbarkeit nur im Keller. */
      if (o.hoechst !== undefined) {
        var zs = sorteAufStufe(o.hoechst);
        if (zs) {
          var traegtAlles = o.hoechst >= obersteStufe();
          marke.appendChild(B.el('span', 'sud-rang' + (traegtAlles ? ' hoch' : ' tief'),
            (traegtAlles ? 'trägt ' : 'höchstens ') + zs.name));
        }
      }

      var wk = o.wirkung || {};
      var wirk = [];
      if (wk.haltbar && wk.haltbar !== 1) wirk.push('Haltbarkeit ×' + String(wk.haltbar).replace('.', ','));
      if (wk.gaer) wirk.push((wk.gaer > 0 ? '+' : '−') + Math.abs(wk.gaer) + ' Wo. Gärung');
      if (wk.roh) wirk.push((wk.roh > 0 ? '+' : '−') + Math.abs(wk.roh) + ' ' + B.sud.rohstoff.name() + ' je Sud');
      if (wk.mehr) wirk.push((wk.mehr > 0 ? '+' : '−') + Math.abs(wk.mehr) + ' Fass je Sud');
      if (wk.streuung !== undefined && ep().charge) wirk.push('Streuung ±' + wk.streuung + ' %');
      if (wk.anzeige) wirk.push('Anzeige ' + Math.round(wk.anzeige * 100) + ' % je Woche');
      if (wk.warmDrossel) wirk.push('warme Wochen: halber Gärraum');
      if (wirk.length) marke.appendChild(B.el('span', 'sud-wirkung', wirk.join(' · ')));
      karte.appendChild(marke);

      karte.appendChild(zeile('sud-kartensatz', o.satz));
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

    var reihe = B.el('div', 'sud-werkzeug');
    var p = kaufPreis();
    reihe.appendChild(knopf({
      text: g.kauf.text + ' · +' + B.welt.menge(g.kauf.menge),
      zug: 'sud:gaerraum',
      preis: -p,
      klasse: 'sud-tat',
      titel: g.kauf.titel,
      aus: !B.welt.kann(p),
      tu: kaufeGaerraum
    }));
    kasten.appendChild(reihe);

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

    var frei = anstichFrei();
    var lager = B.welt.vorrat.faesser.length;
    var f = ep().fuehren;
    var reihe = B.el('div', 'sud-werkzeug');

    reihe.appendChild(knopf({
      text: f.text + ' · +' + (D.guete.fuehren || 8),
      zug: 'sud:hefe-fuehren', klasse: 'sud-tat',
      titel: f.titel + ' Kostet kein Fass.',
      aus: !frei || !Z.bottiche.length,
      tu: fuehreHefe
    }));
    reihe.appendChild(knopf({
      text: 'Jüngstes Fass anbrechen · +' + (D.guete.anstichJung || 14),
      zug: 'sud:anstich-jung', klasse: 'sud-tat',
      titel: a.titel + ' Das jüngste Fass gibt das kräftigste Zeug — und es wäre noch '
           + 'lange zu verkaufen gewesen. Kostet ' + B.welt.menge(1) + '.',
      aus: !frei || !lager,
      tu: function () { anstich(true); }
    }));
    reihe.appendChild(knopf({
      text: 'Ältestes Fass anbrechen · +' + (D.guete.anstichAlt || 6),
      zug: 'sud:anstich-alt', klasse: 'sud-tat',
      titel: a.titel + ' Das älteste Fass wäre ohnehin bald verdorben — dafür gibt es nur '
           + 'die Hälfte her. Kostet ' + B.welt.menge(1) + '.',
      aus: !frei || !lager,
      tu: function () { anstich(false); }
    }));
    kasten.appendChild(reihe);
    kasten.appendChild(zeile('sud-fussnote', frei
      ? (Z.bottiche.length ? 'Einmal die Woche. Solange etwas gärt, kostet die Hefe kein Fass.'
          : (lager ? 'Einmal die Woche. Es gärt nichts — die Hefe kostet jetzt ein Fass.'
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
     Er bleibt unter der Ortsmarken-Schwelle der STADT (2,4 % der Buehne) und
     meldet sich mit data-frei von der Kartenschicht ab (ZUSTAENDIGKEIT §10).
     Er traegt die zwei Zuege, die IMMER gehen — auch bei leerer Kasse.
     ---------------------------------------------------------------------- */
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
    l.appendChild(B.el('span', an.gut ? 'gut' : 'schlecht',
      e.guete.kurz + ' ' + an.text));
    z.appendChild(l);

    /* Der immer bezahlbare Zug: die Hefe. Solange etwas gaert, kostet sie
       kein Fass; sonst wird ein Fass angebrochen. Der Zettel nimmt den
       billigeren Weg, das Brett laesst die Wahl. */
    var frei = anstichFrei(), lager = B.welt.vorrat.faesser.length;
    var ausBottich = Z.bottiche.length > 0;
    z.appendChild(knopf({
      text: ausBottich ? e.fuehren.text : e.anstich.text,
      zug: 'sud:zettel-anstich',
      klasse: 'sud-tat klein voll',
      titel: ausBottich ? e.fuehren.titel : (e.anstich.titel + ' Kostet ' + B.welt.menge(1) + '.'),
      aus: !frei || (!ausBottich && !lager),
      tu: function () { if (ausBottich) fuehreHefe(); else anstich(true); }
    }));

    /* Zwei Umstellungen, die einander ausschliessen, mit ihrem Preis daneben:
       die naechste, die NICHTS kostet, und die naechste, die etwas kostet.
       Genau das ist die zweite Latte, und sie muss im VORGABESTAND stehen —
       ein Brett, das erst aufgeschlagen werden muss, zaehlt dort nicht. */
    var ohne = null, mit = null;
    achsen().forEach(function (a) {
      a.optionen.forEach(function (o) {
        if (gewaehlt(a) === o || verdraengt(a, o)) return;
        var p = (o.preis && !bezahlt(a, o)) ? o.preis : 0;
        if (p === 0) { if (!ohne) ohne = { o: o, a: a, p: 0 }; }
        else if (!mit || p < mit.p) mit = { o: o, a: a, p: p };
      });
    });
    [ohne, mit].forEach(function (kand, i) {
      if (!kand) return;
      z.appendChild(knopf({
        text: kand.o.name,
        zug: 'sud:zettel-wechsel-' + (i ? 'kauf' : 'frei'),
        preis: kand.p ? -kand.p : 0,
        klasse: 'sud-tat klein voll' + (kand.o.fest ? ' siegel' : ''),
        titel: kand.o.satz,
        aus: !!(kand.p && !B.welt.kann(kand.p)),
        tu: function () { waehle(kand.a, kand.o); }
      }));
    });

    B.orte.setze(z, 'sudhaus', { anker: 'mitte', dy: 0 });
    fach.appendChild(z);
    return z;
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

  function schalte(wurzel, tot) {
    if (!wurzel) return;
    var kn = wurzel.querySelectorAll('button[data-zug]');
    for (var i = 0; i < kn.length; i++) {
      var soll = kn[i].getAttribute('data-soll-aus') === '1';
      var neu = tot || soll || !imBild(kn[i]);
      if (kn[i].disabled !== neu) {
        kn[i].disabled = neu;
        if (neu) kn[i].setAttribute('aria-disabled', 'true');
        else kn[i].removeAttribute('aria-disabled');
      }
    }
  }

  function taktZugeklappt() {
    B.wage('sud.takt', function () {
      var fach = document.getElementById('fach-hand-sud');
      var brett = fach ? fach.firstElementChild : null;
      var zettel = document.querySelector('.sud-zettel');
      if (brett) {
        Z.brettZu = brett.classList.contains('stadt-zugeklappt');
        schalte(brett, Z.brettZu);
      }
      /* DER SUD zeigt genau EINE Flaeche. Der Kesselzettel haengt am
         Sudhaus, und das Sudhaus liegt unter dem eigenen Brett — steht
         beides zugleich im Bild, verdeckt dieses Stueck seine eigenen drei
         Knoepfe, und ein Zaehler findet sie aktiv und untreffbar. Also
         tritt der Zettel zurueck, solange das Brett offen liegt, und mit
         ihm seine Knoepfe. Genau der Fehler, den BEFUND-BRETTER.md misst,
         nur diesmal im eigenen Haus. */
      if (zettel) {
        var weg = !Z.brettZu || fremdVerdeckt(zettel);
        if (zettel.classList.contains('beiseite') !== weg) zettel.classList.toggle('beiseite', weg);
        schalte(zettel, weg);
      }
    });
  }

  /* ----------------------------------------------------------------------
     Liegt ein FREMDES Brett ueber dem Kesselzettel?

     Der Zettel haengt am Sudhaus, und ueber dem Sudhaus liegen in 1350 und
     1600 die Anschlagtafel der FUHRE (x 27,4–50,6 %) und ihre Haeusertafel
     (1,1–26,7 %). Die Platzordnung der STADT loest Brett gegen Brett auf;
     eine Ortsmarke nimmt daran nicht teil und kann deshalb begraben werden
     (BEFUND-BRETTER.md §5, "die Reste sind ein anderer, kleinerer Fall").
     Verschieben hilft nicht: die linke Bildhaelfte ist in jeder Epoche
     vergeben, und der Zettel gehoert an das Sudhaus, nicht daneben.

     Also prueft er sich selbst und tritt zurueck, wenn er begraben ist —
     lieber gar kein Zettel als drei Knoepfe, die aussehen wie Knoepfe und
     keine sind. Solange er weg ist, wird derselbe Punkt weiter befragt; er
     kommt von selbst wieder, sobald das fremde Brett zuklappt.
     ---------------------------------------------------------------------- */
  function fremdVerdeckt(zettel) {
    var q = zettel.getBoundingClientRect();
    if (q.width > 2 && q.height > 2) {
      Z.zettelPunkt = { x: q.left + q.width / 2, y: q.top + q.height / 2 };
    }
    var p = Z.zettelPunkt;
    if (!p) return false;
    var t = document.elementFromPoint(p.x, p.y);
    if (!t) return false;
    if (zettel.contains(t) || t === zettel) return false;
    /* Ein fremdes Fach ist ein fremdes Brett. Platte, Bau und der nackte
       Koerper sind keines — darauf darf der Zettel liegen. */
    for (var e = t; e; e = e.parentElement) {
      if (!e.id || e.id.indexOf('fach-') !== 0) continue;
      return e.id !== 'fach-marken-sud';
    }
    return false;
  }

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
  function meldeZug() {
    var bester = null;
    achsen().forEach(function (a) {
      a.optionen.forEach(function (o) {
        if (!o.preis || bezahlt(a, o) || verdraengt(a, o)) return;
        if (!bester || o.preis < bester.preis) bester = { was: o.name, preis: o.preis };
      });
    });
    var p = kaufPreis();
    if (!bester || p < bester.preis) bester = { was: gk().kauf.text, preis: p };
    if (bester) B.welt.meldeZug(bester.was, bester.preis);
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
        B.wage('sud.protokoll', saugeUndSchlage);
      });

      B.auf('ende', function () {
        buch('Das Sudbuch wird geschlossen: ' + Z.gesamtSude + ' Sude, '
          + B.welt.menge(Z.gesamtFass) + ' angestellt.');
      });

      window.setInterval(taktZugeklappt, 320);

      B.welt.schreibe('Im Sudhaus hängt ein neuer Zettel: ' + ep().frage + ' '
        + ep().historie, 'sud');
    },

    woche: function () {
      B.wage('sud.woche', function () {
        setzeEpoche();
        sauge();
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
        buch('Braujahr geschlossen: ' + Z.jahrSude + ' Sude, ' + B.welt.menge(Z.jahrFass)
          + ', ' + Z.jahrFehl + ' verloren'
          + (Z.gestuft ? ', ' + Z.gestuft + ' zurückgestuft.' : '.'));
        Z.jahrSude = 0; Z.jahrFass = 0; Z.jahrFehl = 0; Z.jahrAnzeige = 0; Z.gestuft = 0;
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
        setzeEpoche();
        buch('Neue Zeit, neues Verfahren: ' + ep().frage);
      });
    },

    zeichne: function () {
      setzeEpoche();
      saugeUndSchlage();
      meldeZug();
      zeichneBrett();
      zeichneZettel();
      taktZugeklappt();
      taktGleich();
    }
  });

})(BRAUHAUS);
