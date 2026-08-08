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
    umsatzReihe: [],       /* Ausstoss der Vorjahre — fuer die Veranlagung  */
    ertragReihe: [],       /* Nahrung der Vorjahre  — fuer die Veranlagung  */
    hoehe: 0,
    anschlag: 0,
    kaeufe: 0,

    ertrag: 0,             /* Was das Braujahr uebrig liess (Nahrung)     */
    kasseMichaeli: null,   /* Stand am vorigen Michaeli — nur zum Messen  */
    nachlass: false,       /* Nach einem Verlustjahr laesst der Rat nach  */
    nachlassBetrag: 0,

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
    gestundet: 0,          /* was dieses Michaeli am Notpfennig hängenblieb */
    vorgriff: 0,           /* was der Rat dieses Michaeli auf den Notpfennig vorschoss */

    handlohnWeg: false,
    handlohnHalb: false,
    umlageHalb: false,
    preisDeckel: false,
    wachstumsdeckel: false,

    festGenommen: {},      /* k -> {jahr, amtszeit, name}                 */
    festAmtszeit: {},      /* Amtszeit-Nr -> Schluessel                   */
    amtszeiten: [],        /* [{nr, seit, name}] — gemessene Amtsantritte */

    rechnung: [],          /* was dieses Michaeli gebucht wurde           */
    chronik: [],           /* eigene, unabaenderliche Chronik             */
    leiter: [],            /* {jahr, kasse, billigst, verhaeltnis}        */
    ersteTafel: true,
    erzwungen: false,
    /* WELLE 13. `geklemmt` haelt fest, ob DIE STADT die Tafel in ihren
       Reiter geklappt hat — gelesen einmal je Runde, vor dem Leeren des
       Fachs, ohne jede Wanduhr (siehe `klemmeLesen`). `gesehen` haelt je
       Braujahr fest, ob die Tafel wirklich vor dem Spieler lag; daran haengt
       die Abnahme von R7 und die Frage, ob sie sich den Tisch zurueckholt. */
    geklemmt: false,
    gesehen: {},
    meldung: null
  };

  /* ----------------------------------------------------------------------
     KLEINES HANDWERK
     ---------------------------------------------------------------------- */
  function ep() { return D.epochen[B.welt.zeit.epoche] || D.epochen[1]; }
  function jahr() { return B.welt.zeit.jahr; }
  function amtszeit() { return B.welt.zeit.amtszeit || { nr: 1, name: 'Unbekannt' }; }
  function geld(n) { return B.welt.geld(n); }

  /* ----------------------------------------------------------------------
     WIE LANG EINE AMTSZEIT WIRKLICH DAUERT — GEMESSEN, NICHT BEHAUPTET.

     Auf jeder Karte der unwiderruflichen Wahl stand bis zum 3. August 2026:
     „Barbara Bruckner fuehrt das Haus bis 1636." Die Zahl kommt aus
     `welt.js:379` (`bis: jahr + wuerfel.ganz(21, 37)`). Sie stimmt nicht:
     die Amtszeit wechselt in Wirklichkeit alle zwei Braujahre
     (`erbe-daten.js:315 STUNDE_ABSTAND = 2` -> `erbe.js stundeSchlaegt()` ->
     `welt.erbe()`). Am Bildschirm gezaehlt, alle vier Epochen, zwoelf
     Laeufe: `zeit.amtszeit.nr` laeuft in 400 Wochen von 1 auf 8. Barbara
     Bruckner war 1602 abgeloest, nicht 1636 — die Karte nannte einen
     Horizont, der zehn- bis achtzehnmal zu lang war. Wer nach diesem Satz
     kaufte, kaufte 36 Jahre und bekam 2.

     Der Wuerfel gehoert dem Kern, der Abstand dem ERBE — beide sind fuer
     dieses Stueck gesperrt. Was dieses Stueck darf, ist: die Zahl nicht mehr
     abschreiben, sondern NACHZAEHLEN. `Z.amtszeiten` haelt fest, in welchem
     Braujahr jede Amtszeitnummer zum ersten Mal am Werk war; der Abstand
     zwischen zwei Antritten ist die Frist, die dieses Haus wirklich erlebt
     hat. Solange erst eine Hand am Werk war, gibt es keine gemessene Frist —
     dann steht auch keine Zahl da, und die Karte sagt statt dessen das, was
     ohne jede Messung wahr ist: die Festlegung ueberdauert die Amtszeit.

     Der Satz auf der Karte ist der einzige, der einer UNWIDERRUFLICHEN
     Entscheidung ihren Zeitraum angibt. Er darf nicht raten. */
  function merkeAmtszeit() {
    var a = amtszeit();
    if (!a || !a.nr) return;
    for (var i = 0; i < Z.amtszeiten.length; i++) if (Z.amtszeiten[i].nr === a.nr) return;
    Z.amtszeiten.push({ nr: a.nr, seit: jahr(), name: a.name });
    /* Wie DIE LEITER: die Liste laeuft mit, sie waechst nicht ueber die
       Partie hinaus. Gemessen wird der Abstand der letzten Antritte, nicht
       der von vor sechs Jahrhunderten. */
    if (Z.amtszeiten.length > 24) Z.amtszeiten.shift();
  }

  /* Der mittlere Abstand zweier Amtsantritte, in Braujahren. 0 = noch nichts
     gemessen. */
  function amtszeitFrist() {
    var l = Z.amtszeiten;
    if (l.length < 2) return 0;
    var s = 0;
    for (var i = 1; i < l.length; i++) s += (l[i].seit - l[i - 1].seit);
    return Math.max(1, Math.round(s / (l.length - 1)));
  }

  /* Wann die Frist das naechste Mal ablaeuft. Ohne gemessene Frist keine
     Zahl — und dann steht der Handlohn auch nicht im Kalender. Lieber eine
     Zeile weniger als eine Jahreszahl, die um 34 Jahre danebenliegt. */
  function naechsterErbfall() {
    var f = amtszeitFrist();
    if (!f || !Z.amtszeiten.length) return 0;
    var j = Z.amtszeiten[Z.amtszeiten.length - 1].seit + f;
    while (j <= jahr()) j += f;
    return j;
  }

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

  /* DER MINDESTANSATZ IST EIN ANSATZ, KEINE SCHULD, DIE MIT DER ZEIT WAECHST.

     Bis zum 2. August 2026 stand hier
       basis = max(grund, wert);  anschlag = basis * teuerung^jahre * ...
     Der Boden `grund` wurde also mit der Teuerung mitgehoben. Fuer ein
     wachsendes Haus ist das gleichgueltig — `wert` liegt ohnehin darueber.
     Fuer ein schrumpfendes ist es toedlich, und zwar gemessen: in 1970 steht
     der Anschlag 1971 bis 1983 in JEDEM Jahr auf dem Boden, waehrend der
     eigene Wert des Hauses (Barschaft plus Umsatz) von 425.711 auf 258.216 DM
     faellt. Der Anschlag steigt in denselben Jahren von 556.462 auf
     943.694 DM. Das billigste Angebot kostet damit 1983 mehr als das
     Doppelte von 1971, obwohl das Haus auf ein Drittel geschrumpft ist —
     genau der Fehler, den `lastenGrund` bei den Pflichten hatte und der dort
     schon entfernt wurde (siehe oben, DREI WURZELN).

     Jetzt gilt die Teuerung fuer den eigenen Wert des Hauses und nicht fuer
     den Mindestansatz: der Boden ist die Zahl, unter die in dieser Zeit
     niemand einen Bau anschlaegt, und die aendert sich nicht dadurch, dass
     ein Haus verarmt. Wer waechst, merkt von der Aenderung nichts. */
  function rechneAnschlag() {
    var e = ep();
    var wert = umsatzGewicht() * Z.umsatz + ausBarschaft();
    var jahre = B.grenze(jahr() - Z.startjahr, 0, 40);
    var zeit = Math.pow(e.teuerungJahr, jahre) * Math.pow(e.teuerungKauf, Z.kaeufe);
    Z.anschlag = Math.max(e.grund, wert * zeit);
    return Z.anschlag;
  }

  /* Steht der Anschlag auf dem Mindestansatz? Nur dann steht die Zeile
     dazu auf der Tafel. */
  function amBoden() {
    var e = ep();
    var jahre = B.grenze(jahr() - Z.startjahr, 0, 40);
    var zeit = Math.pow(e.teuerungJahr, jahre) * Math.pow(e.teuerungKauf, Z.kaeufe);
    return (umsatzGewicht() * Z.umsatz + ausBarschaft()) * zeit < e.grund;
  }

  function messeUmsatz(j) {
    var summe = 0;
    B.protokoll.forEach(function (p) {
      if (p.jahr === j && p.wer === 'spieler' && p.preis > 0) summe += p.preis;
    });
    return summe;
  }

  /* ======================================================================
     PREIS EINES ANGEBOTS — UND WARUM ES SEIT WELLE 7 ZWEI ANSCHLAEGE GIBT.

     GEMESSEN, nicht vermutet. Die vierzehn Michaelitage der sorgfaeltig
     gespielten Linie in 1350, Stand `e117042`
     (`werkbank/schuss/preis-w7/rho/vorher/e1-A.json`, Spalten `kasse`,
     `billigst`, `name`):

       Jahr  Lade  billigste Sprosse            was sie kostet   Lade/Preis
       1350   112  Das Dach ueber der Pfanne          36           3,11x
       1351    65  Ein zweiter Bottich                45           1,44x
       1352   197  Der feste Fasskauf bei der Zunft   89           2,21x
       1353   246  Der feste Fasskauf                110           2,24x
       1354   393  Der feste Fasskauf                130           3,02x
       …      …    Der feste Fasskauf                 …            …
       1363   246  Der feste Fasskauf                140           1,76x

     ZWEI BEFUNDE IN EINER TABELLE.

     (1) ZWOELF MICHAELITAGE HINTEREINANDER STEHT DIESELBE ZEILE OBEN, und
         sie wird nie genommen. Die Einstiegssprosse dieser Epoche ist ab dem
         dritten Braujahr eine Tafel an der Wand.

     (2) DAS VERHAELTNIS Lade zu billigster Sprosse steht ueber vierzehn
         Jahre bei 1,44 bis 3,11 — OHNE RICHTUNG. Das klingt nach einer gut
         gestellten Leiter und ist der Fehler: `preisVon` haengt jeden Preis
         an `Z.anschlag`, und `Z.anschlag` haengt ueber `ausBarschaft()` an
         der Lade. Die Leiter geht also mit dem Haus mit. Ein Haus kann die
         unterste Sprosse nie hinter sich lassen — sie kostet immer rund ein
         Drittel des Kastens, in Jahr 1 wie in Jahr 14. Wer nichts hinter
         sich lassen kann, kauft nichts; wer nichts kauft, sammelt.

     UND GENAU DARAN HAENGT DIE ZWEITE LATTE. Die Lade laeuft von 112 auf
     498 Pf, weil sie keine Verwendung findet: rho(Kennzahl) = +0,762 und
     rho(Kasse) = +0,741 sind bei zwoelf Braujahren dieselbe Zahl.

     WAS SICH AENDERT, UND ES IST KEINE VERBILLIGUNG. Es gibt zwei Sorten
     Sachen, und sie werden von zwei verschiedenen Leuten angeschlagen:

       nach der TAXE  Ein Boettcher rechnet fuer den Bottich, ein Schmied
                      fuer das Hausschild, ein Zimmermann fuer das Dach. Sie
                      nehmen den Preis der Sache, nicht den Preis des
                      Kunden. Er steigt mit der Teuerung und mit nichts
                      sonst — dieselbe Grundlage wie die Taxe der
                      Festlegung (`festBasis`).
       nach der       Ein Ratsbrief ueber die Bannmeile, ein Achtel an der
       SCHAETZUNG     Stadtmuehle, ein gewoelbter Keller unter dem ganzen
                      Hof: was der Rat verleiht und was nach Mass gebaut
                      wird, wird nach dem angeschlagen, was das Haus wert
                      ist. Das bleibt, wie es war.

     Damit laesst ein wachsendes Haus die unteren Sprossen tatsaechlich
     hinter sich, kauft sie — und der Kasten leert sich in den Hof statt in
     die Kennzahl. Die grossen Sprossen bleiben, wo sie sind: sie sind das
     Ziel, auf das man spart, und sie werden mit jedem Kauf teurer
     (`teuerungKauf^kaeufe`, unveraendert).

     Ohne `nachZeit` in den Daten ist diese Funktion Zeile fuer Zeile die
     alte. In 1600, 1884 und 1970 steht das Merkmal nirgends — dort ist
     nichts geaendert, weil dort nichts gerissen ist (Regel aus Welle 4:
     nicht zwei Sachen zugleich an derselben Kennzahl drehen). */
  function preisVon(a) {
    return rundePreis(a.anteil * (a.nachZeit ? festBasis() : Z.anschlag));
  }

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
  /* DREI WURZELN, NICHT EINE.

     Bis zum 2. August 2026 stand hier eine einzige Formel:
       (pflichtUmsatz * max(umsatz, lastenGrund) + pflichtHoehe * hoehe)
       * teuerungJahr^jahre
     Sie hatte zwei Fehler, und beide sind gemessen (spiel/BEFUND-WIRTSCHAFT.md).
     Erstens hing sie an der BARSCHAFT (`pflichtHoehe * hoehe`) — eine Abgabe,
     die genau das Geld aufsaugt, das fuer den Michaelitag hingelegt wurde
     (ZUSTAENDIGKEIT 21). Zweitens hatte sie einen BODEN (`lastenGrund`), der
     jedes Jahr weiter mit der Teuerung multipliziert wurde: die Last stieg,
     waehrend das Einkommen fiel. 1600 und 1884 sind daran gestorben, vier von
     sechs Braujahren unter 1x.

     An ihre Stelle tritt, was historisch immer schon zwei — und seit dem
     19. Jahrhundert drei — verschiedene Dinge waren:

       FEST    Zins, Pacht, Versicherung, Kesselrevision. Sie laufen weiter,
               wenn die Pfanne kalt bleibt. Das steht in den Daten sogar
               woertlich: „Der Zins laeuft, ob gebraut wird oder nicht."
       MENGE   Grutgeld, Mahlgeld, Malzaufschlag, Biersteuer nach Malzgewicht,
               Ungeld auf den Ausschank, Listungsgebuehr. Gewogen wird das
               Malz, nicht das Haus. Wer nichts absetzt, zahlt nichts — kein
               Boden.
       ERTRAG  Schoss nach der Nahrung, Anlage nach der Nahrung, Gewerbesteuer
               nach Ertrag, Koerperschaftsteuer. Sie nehmen einen Teil dessen,
               was das Braujahr UEBRIG liess. Ein Verlustjahr wird nicht
               angeschlagen.

     Damit gibt es die Rueckkopplung, die gefehlt hat: wer waechst, wird
     teurer; wer schrumpft, zahlt weniger. Und der Weg zurueck ist der
     Nachlass — nach einem Verlustjahr setzt der Rat die feste Last herunter.
     Stundung und Erlass bei Missjahr, Brand oder Einquartierung sind kein
     Entgegenkommen, sondern die Regel: ein Haus, das eingeht, zahlt gar
     nichts mehr. */
  function teuerung() {
    return Math.pow(ep().teuerungJahr, B.grenze(jahr() - Z.startjahr, 0, 40));
  }

  /* Was weiterlaeuft, wenn die Pfanne kalt bleibt. */
  function lastFest() {
    var e = ep();
    var f = e.lastenFest * teuerung();
    if (Z.nachlass) f *= (1 - (e.nachlass || 0));
    return f;
  }
  /* DIE VERANLAGUNG NACH DREI JAHREN.

     Der Boettcher rechnet mit dem, was er heute sieht — deshalb steht im
     ANSCHLAG weiter der Ausstoss des Vorjahrs. Ein Steuerausschuss rechnet
     anders: er veranlagt nach dem Durchschnitt der letzten drei Jahre, und
     zwar seit es Veranlagungen gibt. Das ist nicht Milde, sondern
     Verwaltung — eine Behoerde, die einem Haus jedes Jahr eine neue Zahl
     zumutet, bekommt jedes Jahr einen Einspruch.

     Warum es hier steht: am Bildschirm gemessen schwankt der Ausstoss in
     1970 zwischen 24.054 und 309.087 DM von einem Jahr auf das andere —
     das Dreizehnfache. Die Last des Jahres hing an der EINEN Vorjahreszahl,
     die ausserordentliche Umlage haengt an der Last, und so stand die
     Rechnung 1973 bei 125.500 DM gegen eine Kasse von 57.297. Ein Zug hat
     die Partie beendet; von 1974 bis 1983 stand die Kasse auf 3.000 DM.

     Mit dem Dreijahresschnitt bleibt beides erhalten und wird tragbar: ein
     gutes Jahr wird noch angeschlagen, aber nicht sofort ganz, und ein
     schlechtes entlastet noch, aber nicht sofort ganz. Wer waechst, zahlt
     mit zwei Jahren Verzug mehr; wer schrumpft, zahlt mit zwei Jahren
     Verzug weniger. Das ist die Rueckkopplung, nur mit Traegheit. */
  var VERANLAGUNG_GEWICHT = [0.5, 0.3, 0.2];   /* juengstes zuerst */

  function schnitt(reihe, jetzt) {
    var r = (reihe || []).concat([jetzt]);
    var s = 0, w = 0;
    for (var i = 0; i < VERANLAGUNG_GEWICHT.length && i < r.length; i++) {
      var wert = r[r.length - 1 - i];
      if (typeof wert !== 'number' || !isFinite(wert)) continue;
      s += VERANLAGUNG_GEWICHT[i] * Math.max(0, wert);
      w += VERANLAGUNG_GEWICHT[i];
    }
    return w ? s / w : 0;
  }

  function umsatzVeranlagt() { return schnitt(Z.umsatzReihe, Math.max(0, Z.umsatz)); }
  function ertragVeranlagt() { return schnitt(Z.ertragReihe, Math.max(0, Z.ertrag)); }

  /* Was an der Menge haengt — ohne Boden. */
  function lastMenge() {
    return ep().pflichtUmsatz * umsatzVeranlagt();
  }
  /* Was der Rat nach der Nahrung des vergangenen Jahres veranlagt. */
  function lastErtrag() {
    return (ep().pflichtErtrag || 0) * ertragVeranlagt();
  }
  function lastenBasis(art) {
    if (art === 'fest') return lastFest();
    if (art === 'ertrag') return lastErtrag();
    return lastMenge();
  }

  function pflichtZeile(p) {
    return { k: p.k, name: p.name, sagt: p.sagt, art: p.art || 'menge',
             betrag: rundePreis(p.teil * lastenBasis(p.art || 'menge')) };
  }

  function pflichtenJetzt() {
    var e = ep();
    var l = [];
    e.pflichten.forEach(function (p) {
      if (Z.pflichtWeg[p.k]) return;
      var z = pflichtZeile(p);
      if (z.betrag > 0) l.push(z);
    });
    Z.pflichtNeu.forEach(function (p) {
      if (Z.pflichtWeg[p.k]) return;
      var z = pflichtZeile(p);
      if (z.betrag > 0) l.push(z);
    });
    return l;
  }

  /* Woran diese Zeile haengt — steht am Bildschirm, nicht im Quelltext. */
  var WURZEL = {
    fest:   'läuft weiter, auch wenn nicht gebraut wird',
    menge:  'nach dem Ausstoß im Schnitt der letzten drei Jahre',
    ertrag: 'nach dem, was die letzten drei Jahre übrig ließen',
    hoehe:  'auf das, was nach dem Zahltag bar liegen bleibt'
  };

  function pflichtSumme() {
    var s = 0;
    pflichtenJetzt().forEach(function (p) { s += p.betrag; });
    return s;
  }

  /* ======================================================================
     WORAUF DER RAT SEINE AUSSERORDENTLICHEN FORDERUNGEN BEMISST.

     AUFLAGE 6 des blinden Kritikers, und sie ist die teuerste der Runde.
     Bis heute hingen `umlageBetrag()` und `handlohnBetrag()` an
     `pflichtSumme()` — und `pflichtSumme()` traegt seit Welle 7 auch den
     UNTERHALT der eigenen Bauten. Am Bildschirm nachgerechnet, Michaelitag
     1363 der Kritikerpartie:

       Jahreslast gesamt        214 Pf
         davon Basispflichten    88 Pf
         davon Unterhalt        126 Pf  (59 %)
       Handlohn desselben Tages 240 Pf = 1,10 x 214
         davon aus dem Unterhalt 139 Pf

     Die Karte verspricht „−26 Pf in jedem Michaeli" fuer den Ochsenstall.
     Wirklich gekostet hat er 26 x (1 + 1,10/2 + 0,35 x 1,11/3,2) = 26 x 1,67
     ≈ 44 Pf. **Ein angeschriebener Pfennig kostete 1,67 Pfennig**, und der
     Aufschlag stand auf keiner Karte, in keiner Spalte und in keinem Satz.

     Das ist nicht bloss eine falsche Zahl, es ist die falsche BEMESSUNG.
     Eine Brandschatzung, ein Landfriedensgeld, ein Laudemium bemessen sich
     nach dem, was der Rat oder der Grundherr am Haus anschlaegt — nach dem
     Steuerbuch. Sie bemessen sich NICHT nach dem, was das Haus seinem
     Boettcher an Lohn und seinem Ochsen an Futter zahlt. Wer sich einen
     Knecht haelt, wird davon nicht brandschatzungspflichtiger.

     `pflichtBasis()` ist deshalb die Jahreslast OHNE alles, was das Haus
     sich selbst aufgeladen hat (`Z.pflichtNeu` — Unterhalt der Bauten und
     die dauerhaften Lasten der Festlegungen). Die Rechnungsspalte zeigt
     weiter die volle Jahreslast; sie ist auch weiter voll zu zahlen. Nur
     die beiden Zahlen, die ein VIELFACHES davon nehmen, nehmen es jetzt vom
     Anschlag des Rats.

     WAS DAS AN DER WIRTSCHAFT AENDERT, und es ist nicht nichts: die Last
     faellt. Gemessen wird vorher und nachher, alle vier Epochen — der
     Bericht nennt beide Zahlen. */
  function pflichtBasis() {
    var e = ep(), s = 0;
    e.pflichten.forEach(function (p) {
      if (Z.pflichtWeg[p.k]) return;
      var z = pflichtZeile(p);
      if (z.betrag > 0) s += z.betrag;
    });
    return s;
  }

  /* Was das Haus sich selbst aufgeladen hat — fuer die Anzeige. */
  function eigenLast() { return pflichtSumme() - pflichtBasis(); }

  /* Jede Umlage hat ihr eigenes Gewicht. Eine Brandschatzung ist keine
     Brueckenumlage — stuenden fuenf gleiche Zahlen untereinander, waere die
     Spalte offensichtlich eine Formel und kein Kalender. */
  /* Die ausserordentliche Umlage folgt der Jahreslast und damit allen drei
     Wurzeln: sie faellt mit dem Ausstoss und mit der Nahrung des Hauses.
     Einen eigenen Nachlass bekommt sie NICHT — eine Brandschatzung fragt
     nicht nach der Bilanz, und genau deshalb ist sie die Zacke im Verlauf
     und nicht bloss eine weitere Abgabe. Gegengeprueft: mit einem Nachlass
     auch auf die Umlage verliert die Kennzahl in drei von vier Epochen ihre
     Gegenbewegung (gemessen: 1350 rho +0,94 statt +0,66). */
  function umlageBetrag(u) {
    var teil = (u && u.teil) ? u.teil : 1;
    return rundePreis(ep().umlageAnteil * teil * pflichtBasis() * (Z.umlageHalb ? 0.5 : 1));
  }

  function handlohnBetrag() {
    return rundePreis(ep().handlohnAnteil * pflichtBasis() * (Z.handlohnHalb ? 0.5 : 1));
  }

  /* ======================================================================
     WIE DIE ABGABE BEIM ERBFALL HEISST — je Epoche aus den Daten.

     AUFLAGE 1 des blinden Kritikers, und sie ist ein SPERRLISTEN-Fund.
     Hier stand bis heute in allen vier Epochen dieselbe Zeichenkette:
     `'Handlohn beim Erbfall an den Grundherrn'`. Handlohn (Laudemium) und
     Grundherr sind Grundherrschaft; in Bayern ist sie mit der
     Grundlastenabloesung ab 1848 abgeloest und in den 1870er Jahren
     erledigt. Am Bildschirm gemessen hat der Kritiker deshalb

       1884  −12.100 M  „Handlohn beim Erbfall an den Grundherrn"
       1970   −8.300 DM dieselbe Zeile, in einer Rechnung, deren uebrige
                        Posten „Biersteuer und Umsatzsteuer" und
                        „Koerperschaft- und Gewerbeertragsteuer" heissen.

     Dass es nicht bloss eine Aufschrift war, sagt das Stueck selbst:
     `realrecht` (`handlohnWeg`) steht NUR in 1350 auf der Tafel — in 1884
     und 1970 konnte der Spieler die feudale Abgabe nicht einmal loswerden.

     Die BETRAEGE bleiben, wo sie waren (`handlohnAnteil` unveraendert in
     allen vier Epochen): beim Uebergang eines Familienbetriebs wird auch
     1884 und 1970 gezahlt, nur heisst es dann Erbschaftsteuer und
     Umschreibung. Geaendert ist die Aufschrift, nicht die Wirtschaft —
     deshalb darf sich an rho nichts bewegen, und genau das wird gemessen. */
  function handlohnName() {
    return ep().handlohnName || 'Abgabe beim Übergang des Hauses';
  }
  function handlohnKurz() {
    return ep().handlohnKurz || handlohnName();
  }
  function handlohnFreiName() {
    return ep().handlohnFrei || (handlohnKurz() + ' — entfällt');
  }

  /* ----------------------------------------------------------------------
     DIE VIERTE WURZEL — WAS BAR LIEGEN BLEIBT.
     Und sie hat nicht jede Epoche, weil sie nicht jede Epoche braucht.

     DER BEFUND, an dem sie haengt (Welle 4, gemessen mit
     werkbank/schuss/eichung/preis-linie.mjs, vier Laeufe, je 400 Wochen,
     sorgfaeltig gespielte Linie, saat=1350):

       Epoche  Kasse Michaeli    Ausstoss          Preis des naechsten
                                                   umkaempften Zuges
       1350     112 ->   113     150 ->   547 Pf     19 ->  42 Pf
       1600     430 ->  4.637  1.900 -> 1.634 fl    170 -> 151 fl
       1884  11.150 -> 24.704 17.000 ->20.493 M   1.706 ->12.000 M
       1970  86.000 -> 50.000       —              38.221 ->19.683 DM

     1600 ist die einzige Epoche, in der die Barschaft um das Elffache
     waechst, waehrend der Ausstoss STEHT. Das Haus waechst nicht, es HORTET:
     zuletzt liegen 4.637 fl bar in der Lade gegen einen Ausstoss von 1.634 fl
     — das Anderthalbfache eines Jahresumsatzes, in bar, ohne Verwendung. In
     1350 sind es 0,21 Jahresumsaetze, in 1884 1,2 bei dreifachem Anschlag.

     Und daran zerbricht die zweite Messlatte: der Preis des naechsten
     umkaempften Zuges kommt in dieser Epoche aus einer festen Tafel des
     GEGNERS (Menge der Adresse x Satz des Mittels) und bewegt sich in
     vierzehn Jahren nicht. Barschaft geteilt durch diesen Preis geht damit
     von 3,76x auf 27,81x, in der Spitze auf 67,33x — der Patrizier-IV-Fall.
     Alles, was DIESES Stueck anschlaegt, waechst dagegen sauber mit: die
     eigene Preisleiter steht in 1600 ueber vierzehn Jahre bei 2,38x bis
     3,37x, dem engsten Band aller vier Epochen.

     WARUM DIE DREI WURZELN DAS NICHT FASSEN. Sie haengen an FLUESSEN: was
     durch das Haus ging (menge), was das Jahr uebrig liess (ertrag), was
     ohnehin laeuft (fest). Ein Haus, dessen Ausstoss steht und dessen Lade
     sich trotzdem fuellt, wird von allen dreien nicht erfasst — der BESTAND
     kommt in keiner vor. Das war eine bewusste Entscheidung (ZUSTAENDIGKEIT
     21: eine Abgabe auf die Barschaft frisst genau das Geld, das fuer den
     Michaelitag hingelegt wurde), und sie war richtig fuer eine Abgabe OHNE
     Freibetrag.

     MIT FREIBETRAG ist es keine Abgabe auf das Sparen mehr, sondern eine auf
     das Liegenlassen: frei bleibt eine Jahreslast — genug fuer die naechste
     Umlage —, mindestens aber der Preis der billigsten Festlegung dieser Zeit
     (siehe `liegeFreibetrag`), und angeschlagen wird nur, was darueber hinaus
     Jahr fuer Jahr unberuehrt liegt. Wer spart und dann kauft, zahlt nichts.
     Wer sitzt, zahlt.

     WAS DAS NICHT REPARIERT, und es gehoert in denselben Absatz: die
     eigentliche Unwucht sitzt nicht in diesem Stueck. Der Nenner der Kennzahl
     ist der billigste Zug der Art `umkaempft`, und den meldet DER GEGNER aus
     `grundwert = menge(adresse) x satz(mittel)`. Beide Faktoren stehen in
     seinen Daten fest; in 1600 benutzt er ueber vierzehn Jahre die billigen
     Mittel (Zunftbrief 9, Heirat 7), und ein Zuvorkommen kostet 45 im Hundert
     davon — 66 bis 336 fl, ohne jede Richtung. In 1884 eskaliert er dagegen
     (Vertrag 45 -> Depot 70 -> Hypothek 110), und genau deshalb waechst dort
     der Nenner mit. Dieses Stueck kann den Nenner nicht anfassen; es kann nur
     den Zaehler daran hindern, davonzulaufen. Der Absatz „KERN/GEGNER" im
     Bericht sagt, was die andere Haelfte waere.

     Historisch ist das keine Erfindung, sondern der Normalfall dieser
     Epoche. Der Anschlag steht laut den Daten dieser Epoche selbst „im
     Steuerbuch der Stadt: VERMOEGEN und Gewerb, geschaetzt von zwei
     Ratsherren und einem Zunftmeister" — und zwischen 1618 und 1648 wurde
     genau dieses geschaetzte Vermoegen jedes Jahr aufs Neue angeschlagen:
     Tuerkensteuer, Kontribution, Quartiergeld, Salvaguardia. Ein Buerger,
     der bares Geld sichtbar in der Lade liegen hatte, hat es nicht behalten.

     Warum sie NUR in 1600 steht: in den anderen drei Epochen greift sie
     nicht, weil die Barschaft dort nie ueber den Freibetrag hinauswaechst.
     Eine Regel, die in drei von vier Epochen nichts tut, gehoert nicht in
     alle vier — dort waere sie totes Gewicht in der Rechnungsspalte. Fehlen
     `liegeSatz` und `liegeFrei` in den Daten einer Epoche, ist diese Funktion
     ein Nichtstuer, und die Rechnung dieser Epoche ist Zeile fuer Zeile
     dieselbe wie vorher. Nachgemessen: sie IST es (siehe Bericht).
     ---------------------------------------------------------------------- */
  /* DER FREIBETRAG HAT EINEN BODEN, UND ER IST NICHT VERHANDELBAR.

     Die Jahreslast allein reicht nicht. Gemessen mit `liegeFrei` 1,5 und
     `liegeSatz` 0,55 und ohne Boden: die Kennzahl steht dann in 1600 ueber
     vierzehn Jahre bei 0,94x bis 3,93x (rho −0,25) — und der Automat nimmt in
     derselben Partie KEINE EINZIGE FESTLEGUNG mehr, weil die billigste dieser
     Zeit damals 0,15 x Taxe = 420 fl kostete und die Lade nie mehr so viel
     trug. Eine Kennzahl im Band um den Preis der unwiderruflichen Wahl ist
     kein Fortschritt, sondern ein Tausch: die zweite Messlatte zaehlt beides.

     Der Boden steht deshalb auf dem Preis der BILLIGSTEN FESTLEGUNG DIESER
     ZEIT. Sachlich ist das dieselbe Regel wie oben, nur zu Ende gedacht:
     angeschlagen wird, was NICHT gebraucht wird — und das Geld fuer den
     Schritt, den der Rat selbst vom Haus verlangt, wird gebraucht. Jede
     Amtszeit hat wieder eine Festlegung; der Bedarf kehrt wieder.

     ZWEI FALLEN, BEIDE GEMESSEN, BEIDE UMGANGEN:

     1. Der Boden zaehlt ALLE Festlegungen der Epoche, nicht nur die noch
        offenen. Mit den offenen sprang er in dem Augenblick, in dem die
        billigste genommen war, auf die naechste — in 1600 von 280 fl auf
        1,90 x 4.527 = 8.601 fl. Der Freibetrag lag damit hoeher als jede
        Lade, die diese Epoche je sieht, und der Anschlag feuerte nie wieder:
        gemessen 2,59x -> 63,91x, rho +0,947, also SCHLECHTER als ohne alles.
        Ein Boden, der mit dem eigenen Greifen wegspringt, ist kein Boden.

     2. Er haengt an `festBasis()` und damit an der ZEIT, nicht am Vermoegen
        (Begruendung dort). Damit ist er frei von Rueckkopplung: er waechst
        mit der Teuerung und nicht mit der Kasse. Haenge ihn an den Anschlag,
        und der Freibetrag waechst mit genau dem, was er begrenzen soll. */
  function liegeFreibetrag() {
    var e = ep();
    if (!e.liegeSatz) return 0;
    var frei = Math.round((e.liegeFrei || 0) * pflichtSumme());
    var boden = 0;
    (e.festlegungen || []).forEach(function (f) {
      var p = festPreis(f);
      if (p > 0 && (!boden || p < boden)) boden = p;
    });
    return Math.max(frei, boden);
  }

  function liegegeld() {
    var e = ep();
    if (!e.liegeSatz) return 0;
    /* Ohne Jahreslast kein Freibetrag — und ohne Freibetrag kein Anschlag.
       Der erste Michaeli einer Partie hat keine Rechnung; er bekommt auch
       diese nicht. */
    if (pflichtSumme() <= 0) return 0;
    var bar = Math.max(0, Math.floor(B.welt.haus.kasse));
    var frei = liegeFreibetrag();
    if (bar <= frei) return 0;
    return rundePreis(e.liegeSatz * (bar - frei));
  }

  function liegeName() {
    return ep().liegeName || 'Anschlag auf das bare Vermögen';
  }

  /* ----------------------------------------------------------------------
     DIE BIERORDNUNG — das Einkommen je Fass.
     ---------------------------------------------------------------------- */
  function ordnung() {
    var l = ep().ordnung, treffer = l[0];
    for (var i = 0; i < l.length; i++) if (jahr() >= l[i].ab) treffer = l[i];
    return treffer;
  }

  /* DIE NACHFUEHRUNG — die eine Zahl, an der die zweite Messlatte hing.

     Bis zum 2. August 2026 war das Einkommen je Fass in einer Partie
     NOMINAL FEST. Die Bierordnung hat benannte Stufen (1350, 1391, 1444,
     1490 — 1517, 1622, 1650 …), und die liegen vierzig bis hundert Jahre
     auseinander; eine Partie ueber vierzehn Braujahre erlebt in drei von
     vier Epochen keine einzige davon. Gleichzeitig steigt ALLES andere mit
     `teuerungJahr`: der Anschlag, die feste Last, die Taxe der Festlegung.
     Am Bildschirm gemessen (die Rechnungsspalte der Michaelitafel, vierzehn
     Michaelitage je Epoche, sorgfaeltig gespielte Linie):

       Epoche   Satz je Fass    Ausstoss          Barschaft      Latte
       1350      9 -> 9    (0%)   789 -> 151 Pf     112 -> 12     reisst
       1600     22 -> 26,6 (+21%) 2109 -> 2580 fl   640 -> 5391   besteht
       1884   51,4 -> 57,6 (+12%) 20800 -> 15824 M  11450->17740  besteht
       1970    135 -> 135  (+0%)  249765 -> 56070   61000 -> 3000 reisst

     Die beiden, die bestehen, sind genau die beiden, deren Einkommen je
     Fass in der Partie gewachsen ist — 1600 ueber die Festlegung
     `reinheit` (+16 %), 1884 ueber `konvention`/`marke` und die
     Ordnungsstufe von 1890. Die beiden, die reissen, sind die, in denen
     der Satz vierzehn Jahre lang auf derselben Zahl stand.

     Ein Rat, der den Bierpfennig vierzig Jahre nicht anruehrt, waehrend
     Korn, Zins und Lohn um vier Hundertstel im Jahr steigen, ist auch
     historisch die falsche Stadt. Der Biersatz WAR an den Kornpreis
     gebunden und wurde zwischen den grossen Erneuerungen nachgesetzt; die
     Daten sagen es selbst („Nach der Teuerung erlaubt der Rat einen
     Pfennig mehr"). Also fuehrt er nach — aber nicht ganz, und wie weit,
     ist der Charakter der Epoche:

       satzFolgt = 1   der Satz haelt Schritt; die Zeit kostet nichts
       satzFolgt = 0   der Satz steht; die Zeit frisst das Haus (bisher)

     Was NICHT nachgefuehrt wird, ist die Luecke, die der Spieler selbst
     schliessen muss — mit dem AUFSCHLAG, und der ist nur zu bauen. Das ist
     die Rueckkopplung nach oben; die nach unten steht in `rechneAnschlag`
     und in den drei Wurzeln der Pflichten. */
  function satzFolgt() {
    var f = ep().satzFolgt;
    return (typeof f === 'number') ? B.grenze(f, 0, 1) : 0;
  }

  /* ======================================================================
     WER DEN SATZ SETZT — je Epoche aus den Daten.

     AUFLAGE 2 des blinden Kritikers, ebenfalls SPERRLISTE. Hier stand
     unbedingt „vom Rat gesetzt <Jahr>" und „Zwischen den Stufen setzt der
     Rat nach dem Korn nach". `satzFolgt` ist in allen vier Epochen groesser
     als null (0,60 · 0,25 · 0,50 · 0,60), die Saetze standen also ueberall.

     Am Bildschirm, Michaelitafel 1970, in DEMSELBEN Kasten, drei Zeilen
     auseinander:

       DIE BIERORDNUNG · Satz je hl 130 DM
       „Der Handel diktiert die Aktionspreise. Der Listenpreis ist Zierde."
       vom Rat gesetzt 1970 · 130 DM
       … Zwischen den Stufen setzt der Rat nach dem Korn nach, aber nicht ganz.

     Das Stueck widerspricht sich auf demselben Schirm, und ein Rat, der 1970
     den Bierpreis nach dem Kornpreis nachsetzt, ist derselbe Fehlertyp wie
     eine Bahnlinie in 1600. Die Mechanik (`satzFolgt`, `nachfuehrung`)
     bleibt Zeichen fuer Zeichen; nur wer es tut, kommt jetzt aus der
     Epoche. */
  function satzSetzer() { return ep().satzSetzer || 'gesetzt'; }
  function satzNachSatz() {
    return ep().satzNachSatz || 'Zwischen den Stufen wird nachgesetzt, aber nicht ganz.';
  }
  function satzHaeltSatz() {
    return ep().satzHaeltSatz || 'Zwischen den Stufen rührt hier niemand den Satz an.';
  }

  /* Der Faktor, um den der Rat den Satz seit dem Antritt dieses Hauses
     nachgesetzt hat. Gemessen ab Z.startjahr, nicht ab dem Jahr der
     Ordnung: eine Erneuerung von 1517 ist 1600 keine Neuigkeit mehr. */
  function nachfuehrung() {
    return 1 + satzFolgt() * (teuerung() - 1);
  }

  /* Was das Haus heute je Fass loest: der Satz des Rats, nachgefuehrt, mal
     dem, was das Haus sich selbst erarbeitet hat. */
  function satzJetzt() {
    return ordnung().preis * nachfuehrung() * (1 + Z.aufschlag);
  }

  function setzeBierpreis() {
    B.welt.haus.preis = satzJetzt();
    return B.welt.haus.preis;
  }

  /* ----------------------------------------------------------------------
     BUCHEN. Was nicht bezahlt werden kann, wird angeschrieben — als Zahl,
     nicht als Drohung.
     ---------------------------------------------------------------------- */
  /* DIE STUNDUNG — was der Rat stehen laesst.

     Bis zum 2. August 2026 nahm dieser Buchungsweg alles, was in der Lade
     lag: `kasse >= betrag ? zahle(betrag) : zahle(kasse)`. Ein Haus, dessen
     Rechnung groesser ist als seine Barschaft, stand danach auf NULL — und
     genau das ist am Bildschirm der haeufigste Zustand der beiden Epochen,
     die die zweite Messlatte reissen. Gemessen an der sorgfaeltig gespielten
     Linie, Michaelitafel 1970: 1976 bis 1981 steht die Kasse an fuenf von
     sechs Michaelitagen auf 3.000 DM oder darunter, und der Rueckstand laeuft
     mit einem Zehntel Aufschlag weiter. Die Kennzahl „Barschaft geteilt durch
     den Preis des naechsten Zuges" ist dann nicht klein, sondern NULL, und
     kein Zug aendert daran etwas — der Zustand, den ZUSTAENDIGKEIT 4 als
     einzige harte Regel verbietet.

     Ein Glaeubiger, der das letzte Geld nimmt, bekommt im naechsten Jahr gar
     nichts mehr. Deshalb hat keine Stadt so gepfaendet: dem Handwerker blieb
     sein Werkzeug und der Vorrat, den er zum Weiterarbeiten brauchte, und was
     darueber hinaus faellig war, wurde gestundet — angeschrieben, mit
     Aufschlag, wiedervorgelegt. Der Rat nimmt bis zum Notpfennig und keinen
     Pfennig weiter.

     Das ist keine Milde und keine Abgabe, die an der Barschaft haengt: der
     Notpfennig ist eine feste Zahl der Epoche (`notpfennig` in den Daten),
     unabhaengig davon, wie es dem Haus geht. Was er stehen laesst, ist nicht
     erlassen, sondern gestundet — es steht naechstes Michaeli mit Aufschlag
     wieder da, und waechst der Rueckstand ueber eine Jahreslast, nimmt der
     Rat ein Pfand (Schritt 2 in `michaeli`). Die Strafe bleibt; sie
     versteinert das Haus nur nicht mehr. */
  function notpfennig() {
    var n = ep().notpfennig;
    return (typeof n === 'number' && n > 0) ? Math.round(n) : 0;
  }

  function buche(betrag, name, art, wurzel) {
    betrag = Math.round(betrag);
    if (betrag <= 0) return true;
    var kasse = Math.max(0, Math.floor(B.welt.haus.kasse));
    var frei = Math.max(0, kasse - notpfennig());
    if (frei >= betrag) {
      B.welt.zahle(betrag, name, 'spieler');
      Z.rechnung.push({ name: name, betrag: -betrag, art: art || 'pflicht', wurzel: wurzel });
      return true;
    }
    if (frei > 0) B.welt.zahle(frei, name + ' (Teilzahlung)', 'spieler');
    var rest = betrag - frei;
    Z.rueckstand += rest;
    Z.gestundet += rest;
    Z.rechnung.push({ name: name, betrag: -betrag, art: art || 'pflicht', wurzel: wurzel, offen: rest });
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
    /* Die Jahreslast, BEVOR diese Wirkung sie veraendert — das Schild hat mit
       ihr gerechnet (Auflage 3, Begruendung unten beim Zufluss). */
    var lastVorher = pflichtSumme();
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
       sonst schwemmt eine einzige Festlegung die ganze Partie weg.

       AUFLAGE 3: er wird jetzt aus `vorher` gerechnet und nicht neu.
       Gemessen hat der Kritiker `preis:festlege:aktien` in 1884: Schild
       +11.000 M, gebucht +13.000 M — 18,2 im Hundert daneben. Die Ursache
       ist die Reihenfolge in dieser Funktion: `Z.pflichtNeu.push(...)` steht
       oben, `pflichtSumme()` unten — der Zufluss wurde also mit der neuen
       Pflicht schon in der Summe gerechnet, waehrend das Schild
       (`festKarte`) sie noch nicht kannte. Betroffen war genau eine Karte im
       ganzen Spiel: `aktien` ist die einzige mit `einmal` UND `pflichtNeu`.
       Der Quelltext hat an dieser Stelle immer schon gesagt, was er will —
       „damit auf dem Schild dieselbe Zahl steht, die gleich in der Kasse
       landet". Jetzt tut er es. */
    if (w.einmal) loese(rundePreis(w.einmal * lastVorher), quelle.name + ' — Zufluss', 'zufluss');
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
    Z.gestundet = 0;
    Z.tafelJahr = jahr();
    merkeAmtszeit();

    /* 1. Was durch das Haus ging, was es uebrig liess, und was im Haus liegt. */
    if (!erste) {
      /* Der Umsatz faellt mit dem Betrieb — ohne Boden. Ein Haus, das ein
         mageres Jahr hatte, wird im naechsten niedriger veranlagt. Genau das
         hat der Boden `lastenGrund` verhindert. */
      Z.umsatz = messeUmsatz(jahr() - 1);
    }
    /* DIE NAHRUNG DES JAHRES — was ueber den Aufwand hinaus geblieben ist.
       Gemessen wird die VERAENDERUNG von Michaeli zu Michaeli, nicht der
       Stand: ein Haus wird nach dem angeschlagen, was es erwirtschaftet hat,
       nicht danach, was in der Lade liegt (ZUSTAENDIGKEIT 21). Wer im
       vorigen Jahr gebaut hat, hat weniger Nahrung — das ist keine Luecke,
       sondern der Grund, warum ein Haus ueberhaupt baut. */
    /* GELIEHENES IST KEINE NAHRUNG. `Z.vorgriff` haelt an dieser Stelle noch
       den Betrag, den der Rat am VORIGEN Michaeli auf den Notpfennig
       vorgeschossen hat (Schritt 7d setzt ihn erst weiter unten neu). Er lag
       das ganze Jahr in der Lade und stuende ohne diesen Abzug als Zuwachs
       des Hauses da — der Schoss wuerde auf ein Darlehen erhoben, und der
       Nachlass fuer ein Fehljahr (`Z.ertrag <= 0`) bliebe genau dem Haus
       versagt, fuer das er gemacht ist. Beides waere aus dem Boden eine
       zweite Strafe. Der Vorgriff kommt zu Michaeli ohnehin mit Aufschlag
       zurueck; die Rechnung dafuer steht in Schritt 2, nicht hier. */
    var kasseJetzt = Math.round(B.welt.haus.kasse);
    Z.ertrag = (erste || Z.kasseMichaeli === null)
      ? 0 : (kasseJetzt - Z.kasseMichaeli - (Z.vorgriff || 0));
    Z.kasseMichaeli = kasseJetzt;
    /* DER NACHLASS — der Weg zurueck. Ein Verlustjahr wird nicht nur nicht
       veranlagt; der Rat, das Kloster, der Steuerausschuss, die Bank setzen
       auch das Feste herunter. Stundung und Erlass nach Missjahr, Brand oder
       Einquartierung sind aktenkundig genug, um hier zu stehen.

       Er hing an `Z.ertrag < 0` und griff darum genau bei dem Haus nicht,
       fuer das er gemacht ist: eine Kasse, die auf null steht, aendert sich
       von Michaeli zu Michaeli um NULL, nicht um weniger als null. Am
       Bildschirm nachgesehen — Michaelitafel 1350, Jahre 1359 bis 1363 —
       stand dort fuenfmal „davon übrig geblieben 0 Pf" und keine einzige
       Nachlasszeile, waehrend Erbzins und Wasserzins mit der Teuerung
       weiterstiegen: 89 Pf feste Last gegen 187 Pf Ausstoss. Ein Jahr, das
       nichts uebrig laesst, ist genau der Fall. */
    Z.nachlass = !erste && Z.ertrag <= 0;
    Z.nachlassBetrag = Z.nachlass
      ? Math.round(ep().lastenFest * teuerung() * (ep().nachlass || 0)) : 0;
    /* Die Schaetzung folgt der Kasse nach oben sofort und nach unten langsam:
       wer einmal gross war, wird nicht im naechsten Jahr wieder billig bedient.
       Aber sie gibt nach, sonst kaeme ein verarmtes Haus nie zurueck.
       Sie traegt nur noch den ANSCHLAG (den Preis der Angebote), keine
       einzige Abgabe mehr.

       Der Nachgeber stand auf 0,78 im Jahr. Gemessen (Michaelitafel 1350,
       sorgfaeltig gespielte Linie): die Kasse faellt 1356 bis 1358 von 573
       auf 18 Pf, der Anschlag von 2.547 auf 1.912 — nach zwei Jahren steht
       das Haus bei drei Hundertsteln seiner alten Barschaft und wird noch mit
       drei Vierteln des alten Ansatzes bedient. Nach neun Jahren waere er erst
       auf ein Zehntel.

       Zweite Messung, und sie hat die Begruendung umgedreht. Der Nachgeber
       war als Strafe fuer den Erfolgreichen gedacht. Gemessen bestraft er den
       Gescheiterten, und zwar doppelt: in 1350 schwankt der Ausstoss von Jahr
       zu Jahr zwischen 150 und 863 Pf — der Faktor Sechs, und keine einzige
       Sprosse dazwischen gekauft. Faellt er, faellt die Kasse mit; die
       Schaetzung aber steht noch zwei Jahre auf dem alten Stand, und die
       Kennzahl kippt von 2,68 auf 0,63, ohne dass irgendetwas geschehen waere
       ausser einem mageren Braujahr. Der Boettcher haette in so einem Jahr
       laengst billiger angeschlagen: er sieht den Hof, nicht das Archiv.

       Mit 0,45 haelt die Schaetzung nach einem Jahr noch knapp die Haelfte
       und ist nach dreien bei einem Zehntel. Der Ruf eines grossen Hauses
       traegt damit ueber ein mageres Jahr — nicht ueber ein mageres
       Jahrzehnt.

       DIE SCHAETZUNG WIRD ERST GEMACHT, WENN DIE RECHNUNG BEZAHLT IST.

       Bis zum 3. August 2026 standen die beiden Zeilen `Z.hoehe = …` und
       `rechneAnschlag()` GENAU HIER, also vor Schritt 2 bis 7 — vor
       Rueckstand, Pflichten, Raten, Handlohn und Umlage. Der Schaetzer sah
       damit die Lade, wie sie beim Aufschliessen aussah, und der Spieler
       kaufte aus der Lade, wie sie nach dem Zahltag aussah. Am Bildschirm
       nachgesehen, Michaelitafel 1351 der sorgfaeltig gespielten Linie:
       Kopfzeile „Kasse 48 Pf", Rechnung „Zusammen −191 Pf", und im Kasten DER
       ANSCHLAG „aus der Barschaft 632 Pf" — angeschlagen wurde ein Haus mit
       239 Pf, zahlen musste eines mit 48. Das billigste Angebot desselben
       Tages kostete darum 77 Pf; nachher, mit derselben Saat und derselben
       gespielten Linie, kostet es 43 Pf, und DIE LEITER liest 1,12x statt
       0,62x. In 1350 faellt es nicht auf, weil der erste Michaeli keine
       Rechnung hat — deshalb steht dort 3,11x und danach die mageren Jahre.

       Ein Boettcher, ein Maurer und ein Grutherr schlagen an, was sie sehen,
       und sie sehen den Hof am Nachmittag des Michaelistags, nicht am
       Vormittag. Die beiden Zeilen stehen jetzt hinter Schritt 7. Der
       Nachgeber 0,45 bleibt: er traegt den Ruf des grossen Hauses ueber ein
       mageres Jahr, und er traegt ihn jetzt ueber die Rechnung desselben
       Tages. Nichts zwischen hier und Schritt 8 liest `Z.anschlag` —
       Pflichten, Umlage und Handlohn haengen an den drei Wurzeln, die
       Festlegung an `festBasis()`, und beide sind von der Schaetzung
       unabhaengig. */

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
      if (Z.nachlass && Z.nachlassBetrag > 0) {
        Z.rechnung.push({ name: (e.nachlassName || 'Nachlass auf die feste Last')
          + ' — das vorige Jahr trug nichts', betrag: 0, art: 'frei' });
        chronik('pflicht', (e.nachlassName || 'Nachlass auf die feste Last') + ': '
          + geld(Z.nachlassBetrag) + ' werden nicht angeschlagen. '
          + 'Das Braujahr hat ' + geld(-Z.ertrag) + ' gekostet und nichts übrig gelassen.');
      }
      pflichtenJetzt().forEach(function (p) { buche(p.betrag, p.name, 'pflicht', p.art); });
    }

    /* 4. Was gebaut ist, traegt — und zwar in dem Geld, in dem das Jahr
          rechnet.

          Bis zum 2. August 2026 stand hier der nominale Betrag, mit der
          Begruendung, ein fester Zins werde mit den Jahren weniger wert. Das
          ist fuer eine Rente richtig und fuer einen Bau falsch: ein zweiter
          Bottich bringt keine Rente, er bringt Bier, und das Bier wird zum
          Satz DIESES Jahres verkauft. Die Kostenseite derselben Rechnung wird
          seit jeher mit `teuerung()` multipliziert (`lastFest`) — die
          Ertragsseite stand still. Das ist keine Alterung, das ist eine
          Unwucht, und sie waechst mit genau dem Faktor, ueber den die zweite
          Messlatte misst.

          Gemessen, was sie anrichtet: in 1350 kostet die zweite Sprosse im
          fuenften Braujahr rund hundert Pfennig und traegt neun im Jahr. Zwei
          Laeufe derselben Fassung, nebeneinander (mess/g1, mess/g2): der
          Lauf, der sie NICHT nimmt, steht ueber vierzehn Jahre bei 0 Jahren
          unter 1x; der Lauf, der sie nimmt, bei 5 von 14 und faellt im Jahr
          nach dem Kauf von 3,18 auf 0,79. Ein Angebot, dessen Annahme das
          Haus schlechter stellt als seine Ablehnung, ist keine Entscheidung.

          Der Preis eines Baus steigt mit der Zeit, sein Ertrag jetzt auch.
          Was NICHT mitwaechst, bleibt der Anteil am Satz je Fass — der ist
          und bleibt das, was nur gebaut werden kann. */
    Z.ertraege.forEach(function (t) {
      loese(Math.round(t.betrag * teuerung()), t.name, 'ertrag');
    });
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
        buche(h, handlohnName(), 'umlage');
        chronik('pflicht', handlohnKurz() + ': ' + geld(h) + '.');
      } else {
        Z.rechnung.push({ name: handlohnFreiName(), betrag: 0, art: 'frei' });
      }
    }

    /* 7. Die ausserordentliche Umlage, wenn sie faellig ist. */
    var u = umlageDesJahres();
    if (u && !u.bezahlt) {
      u.bezahlt = true;
      var betrag = umlageBetrag(u);
      u.betrag = betrag;
      /* DER RUECKSTAND STATT DES SOFORTIGEN PFANDS.

         Bis hierher kostete eine Umlage, die nicht zu bezahlen war, noch
         am selben Michaeli eine Adresse: `nimmPfand()` gleich hier, ohne
         Frist. Das ist die Rueckkopplung nach unten in ihrer haertesten
         Form — und sie schliesst sich selbst: die gepfaendete Wirtschaft
         nimmt fuenf Jahre lang das Bier des Adlers, der Ausstoss faellt,
         die naechste Umlage ist erst recht nicht zu bezahlen. Am
         Bildschirm nachgelesen (Chronik 1970, sorgfaeltig gespielte
         Linie): 1977 Tarifabschluss 13.000 DM offen -> Gasthof Lindenhof
         an den Adler; 1980 Einheitskasten 26.000 DM offen -> derselbe
         Gasthof noch einmal. Dazwischen faellt der Ausstoss von 108.966
         auf 29.274 DM.

         Fuer die Pflichten galt schon immer etwas anderes: was nicht
         bezahlt werden kann, wird angeschrieben, und erst wenn der
         Rueckstand ueber eine ganze Jahreslast waechst, holt sich der Rat
         ein Pfand (Schritt 2). Die Umlage folgt jetzt derselben Regel.
         Gemahnt wird zuerst, gepfaendet danach — so hat es jede Stadt
         gehalten, die ihr Geld wiedersehen wollte. Das Pfand bleibt, es
         kommt nur nicht mehr am selben Tag. */
      if (!buche(betrag, u.name, 'umlage')) {
        chronik('umlage', u.name + ': ' + geld(betrag) + ' angeschlagen, '
          + geld(Z.rueckstand) + ' bleiben stehen. Zu Michaeli ' + (jahr() + 1)
          + ' kommen sie mit Aufschlag wieder; wächst der Rückstand über eine '
          + 'Jahreslast, nimmt der Rat ein Pfand.');
        B.welt.schreibe(u.name + ': ' + geld(betrag) + ' angeschlagen. '
          + geld(Z.rueckstand) + ' bleiben als Rückstand stehen.', 'preis');
      } else {
        chronik('umlage', u.name + ': ' + geld(betrag) + ' bezahlt.');
      }
    }

    /* 7a. WAS BAR LIEGEN BLEIBT — die vierte Wurzel, und nur dort, wo eine
           Epoche sie in den Daten stehen hat. Sie steht HIER und nicht bei
           den Pflichten (Schritt 3), weil sie den Stand NACH dem Zahltag
           meint: was Pflicht, Rate, Handlohn und Umlage uebriggelassen
           haben und was das Haus danach noch immer nicht braucht.

           Sie geht ausdruecklich NICHT in `pflichtSumme()` ein. Die
           Jahreslast traegt die Umlage und den Handlohn; haenge die vierte
           Wurzel dort hinein, schlaegt die Barschaft ueber drei Ecken auf
           sich selbst durch, und aus einer Rueckkopplung wird eine Spirale.
           Die Begruendung im ganzen steht oben bei `liegegeld`. */
    var barVorher = Math.max(0, Math.floor(B.welt.haus.kasse));
    var liegeFrei = liegeFreibetrag();
    /* Der erste Michaeli einer Partie hat keine Rechnung (Schritt 3) — dann
       hat er auch diese nicht. Am Bildschirm nachgesehen: ohne diese Zeile
       stand in 1600 im Eroeffnungsjahr `Anschlag auf das bare Vermoegen
       −200 fl` in einer Spalte, die sonst leer ist, und die Lade begann mit
       440 statt 640 fl. Das Haus zahlt fuer ein Jahr, das es nicht gespielt
       hat. */
    var liege = erste ? 0 : liegegeld();
    if (liege > 0) {
      buche(liege, liegeName(), 'pflicht', 'hoehe');
      chronik('pflicht', liegeName() + ': von ' + geld(barVorher) + ' bar bleiben '
        + geld(liegeFrei) + ' frei — ' + B.zahl(e.liegeFrei || 0, 1)
        + ' Jahreslasten, mindestens aber der Preis der nächsten Festlegung. '
        + 'Auf die ' + geld(barVorher - liegeFrei) + ', die darüber '
        + 'liegen blieben, schlägt der Rat ' + geld(liege) + ' an. '
        + 'Was im Haus verbaut ist, wird nicht angeschlagen.');
    }

    /* 7b. Was am Notpfennig hängengeblieben ist, steht als eigene Zeile da —
           sonst sieht der Spieler eine Rechnung, die nicht aufgeht, und keinen
           Grund dafür. */
    if (Z.gestundet > 0 && notpfennig() > 0) {
      Z.rechnung.push({ name: 'Gestundet — der Notpfennig bleibt im Haus ('
        + geld(notpfennig()) + ')', betrag: 0, art: 'frei' });
      chronik('pflicht', geld(Z.gestundet) + ' konnten nicht abgetragen werden. '
        + 'Der Rat lässt dem Haus den Notpfennig von ' + geld(notpfennig())
        + ' stehen; der Rest ist gestundet und kommt zu Michaeli ' + (jahr() + 1)
        + ' mit Aufschlag wieder.');
    }

    /* 7c. JETZT erst die Schaetzung — die Lade steht offen, die Rechnung ist
           abgetragen, und was uebrig ist, ist die Barschaft, aus der heute
           gekauft wird. Die lange Begruendung steht oben bei Schritt 1. */
    Z.hoehe = Math.max(B.welt.haus.kasse, Z.hoehe * 0.45);
    rechneAnschlag();

    /* 7d. DER VORGRIFF AUF DEN NOTPFENNIG — der Boden unter der Lade.

       Der Notpfennig war bis heute nur eine SCHONUNG: `buche()` nimmt nie
       unter ihn. Kommt das Haus aber schon mit weniger an Michaeli an, gibt
       ihm der Notpfennig nichts.

       MIT WELCHER HAND DAS GEMESSEN IST, GEHOERT IN DEN SATZ — Auflage 5
       der Welle 5, und der Kritiker hat recht: der Satz unten stand hier
       ohne seine Hand, und ohne die Hand ist er nicht nachstellbar.

       GEMESSEN MIT DER GROBEN HAND (`werkbank/schuss/aufsicht/spielprobe.mjs`
       bzw. `werkbank/schuss/preis-w5/boden.mjs`: WEITER druecken, jede Woche
       irgendeinen bedienbaren Knopf, nie verkaufen), am eingefrorenen Stand
       `3e6d08c`, Buchung fuer Buchung, Epoche 1350: das Haus geht mit 5 Pf
       in das Braujahr 1351, steht in Woche 16 auf null und bleibt dort bis
       Woche 30 — fuenfzehn Wochen, in denen KEIN Zug etwas veraendert, weil
       jeder Zug etwas kostet. Die Kennzahl der zweiten Messlatte ist dann
       nicht klein, sondern NULL. Ein Zustand, aus dem heraus es keinen Zug
       gibt, ist kein Spielzustand.

       MIT SORGFAELTIGER HAND GREIFT ER NICHT, und auch das gehoert dazu.
       Der blinde Kritiker hat mit der Vorbild-Hand nachgezaehlt: `vorgriff`
       ist in 60 von 60 Michaelitagen 0, und die Kasse beruehrt in 0 von
       1.680 Wochen die Null. Der Boden ist damit kein Beweis gegen eine
       kompetent gespielte Partie — er ist die Zusage, dass auch die andere
       weiterspielen kann. Unter der faulen Hand greift er und tut, was auf
       ihm steht (E1 1351/52/53: 49 / 46 / 35 Pf, Kasse danach genau 48;
       E2 1602/03: 71 / 81 fl auf 280; E4 1973: 20.197 DM auf 50.000).

       WAS ER GEKOSTET HAT, STEHT DANEBEN UND WIRD NICHT KLEINGEREDET:
       in 1970 hebt er die Kasse in 1978 und 1979 auf genau den Notpfennig
       (41.240 -> 50.000 und 44.598 -> 50.000) und in 1980 auf 69.983. Damit
       steigt der kleinste Wert der Kennzahlreihe von 1,955x auf 2,124x —
       und die WELLENZAHL von E4 wandert von +0,108 auf +0,275, also um
       +0,167 (vierzehn Michaelitage, Vorbild-Hand, zweimal Ziffer fuer
       Ziffer nachgemessen). Die Latte |rho| < 0,700 haelt weit; die Zahl
       der Welle 4 ist in dieser einen Epoche trotzdem schlechter geworden.
       Wer sie zurueckhaben will, muss den Notpfennig von 1970 verschieben —
       nicht den Boden entfernen: 1,955x war die Stelle, an der die Epoche
       dem Stillstand am naechsten stand.

       Der Satz, der daneben schon im Quelltext steht, verspricht das
       Gegenteil: „dem Handwerker blieb sein Werkzeug und der Vorrat, den er
       zum Weiterarbeiten brauchte". Ein Rat, der einem Haus nicht so viel
       laesst, dass es das naechste Jahr brauen kann, sieht dieses Haus nie
       wieder zahlen. Also schiesst er vor, was zum Notpfennig fehlt — nicht
       aus Milde: der Vorgriff ist GESCHENKT NICHTS. Er geht auf denselben
       Rueckstand wie eine nicht bezahlte Pflicht, kommt naechsten Michaeli
       mit demselben Zehntel Aufschlag wieder (Schritt 2), und waechst der
       Rueckstand ueber eine Jahreslast, holt sich der Rat dafuer dasselbe
       Pfand wie sonst auch. Die Strafe bleibt vollstaendig; sie versteinert
       das Haus nur nicht mehr mitten im Braujahr.

       WARUM HIER UND NICHT VOR 7c: der Schaetzer soll den Hof sehen, wie er
       ist. Stuende der Vorgriff vor der Schaetzung, schlueg er ueber
       `Z.hoehe` auf den ANSCHLAG durch, der Anschlag auf die Angebotspreise
       und damit auf den Nenner der Kennzahl — der Boden haette sich seinen
       eigenen Nenner mit angehoben und waere keiner. Er steht deshalb hinter
       der Schaetzung: er hebt den Zaehler, nicht den Nenner.

       WARUM NICHT IM ERSTEN MICHAELI: der erste Michaeli einer Partie hat
       keine Rechnung (Schritt 3), damit das Spiel nicht mit einer Schuld
       beginnt. Dann hat er auch keinen Vorgriff. Er greift dort ohnehin nie
       — die vier Anfangsladen (112 / 640 / 14.250 / 86.000) liegen alle
       ueber ihrem Notpfennig (48 / 280 / 4.200 / 50.000). */
    var boden = notpfennig();
    if (!erste && boden > 0) {
      var fehlt = boden - Math.floor(B.welt.haus.kasse);
      if (fehlt > 0) {
        B.welt.nimm(fehlt, 'Vorgriff auf den Notpfennig', 'spieler');
        Z.rueckstand += fehlt;
        Z.vorgriff = fehlt;
        Z.rechnung.push({ name: 'Vorgriff auf den Notpfennig — angeschrieben',
          betrag: fehlt, art: 'zufluss-geborgt' });
        chronik('pflicht', 'Die Lade reichte nicht bis zum Notpfennig. Der Rat schießt '
          + geld(fehlt) + ' vor, damit das Haus das Braujahr brauen kann; '
          + geld(boden) + ' stehen wieder im Kasten. Angeschrieben, nicht geschenkt: '
          + 'zu Michaeli ' + (jahr() + 1) + ' kommt der Betrag mit Aufschlag wieder.');
        B.welt.schreibe('Der Rat schießt dem Haus ' + geld(fehlt)
          + ' auf den Notpfennig vor — angeschrieben, nicht geschenkt.', 'preis');
      } else {
        Z.vorgriff = 0;
      }
    } else {
      Z.vorgriff = 0;
    }

    /* 8. Die Bierordnung des Jahres. */
    setzeBierpreis();

    /* 9. Die Angebote dieses Michaeli. */
    waehleAngebote();

    /* 10. Die eine Zahl, aufgeschrieben, damit man sie nebeneinanderlegen kann.

           ZWEI SPALTEN, ZWEI BEDEUTUNGEN, BEIDE BESCHRIFTET.
           `billigst`/`verhaeltnis` ist die eigene Preisleiter: die Barschaft
           gegen das billigste Angebot DIESER Tafel. Das ist eine Aussage
           ueber die Sprossen, die dieses Stueck anbietet, und keine
           Kennzahl — die Tafel liegt an 29 von 30 Wochen zu.
           `zugPreis`/`zugVerh` ist die Kennzahl der Latte und kommt aus
           derselben Quelle wie die Zahl unten rechts am Bildschirm
           (`welt.zugDeckung()`); sie wird erst beim ersten Bildaufbau
           gefuellt, weil die Stuecke ihren naechsten Zug erst dann melden.
           Vorher stand hier nur die linke Spalte, und sie hiess DIE LEITER —
           daher zwei Zahlen fuer dieselbe Lage (1350/W1: Kopfzeile 5,89x,
           Leiter 3,11x). */
    var billig = billigstesAngebot();
    Z.leiter.push({
      jahr: jahr(),
      kasse: Math.round(B.welt.haus.kasse),
      billigst: billig ? billig.preis : 0,
      name: billig ? billig.a.name : '—',
      verhaeltnis: billig && billig.preis ? B.welt.haus.kasse / billig.preis : 0,
      /* Was der Rat dieses Jahr auf den Notpfennig vorschiessen musste, und
         was danach als Rueckstand offen steht — beides gehoert in die Reihe,
         mit der nachgemessen wird, sonst laesst sich ein Boden, der greift,
         nicht von einem Haus unterscheiden, das ihn nie gebraucht hat. */
      vorgriff: Z.vorgriff || 0,
      rueckstand: Math.round(Z.rueckstand),
      zugWas: null, zugPreis: 0, zugArt: null, zugVerh: 0, zugFest: false
    });
    if (Z.leiter.length > 24) Z.leiter.shift();

    /* 11. Erst jetzt wandern Ausstoss und Nahrung dieses Michaeli in die
           Reihe, aus der der Steuerausschuss im naechsten Jahr seinen
           Dreijahresschnitt zieht. Vorher waere dieses Jahr doppelt
           gezaehlt: `schnitt()` legt den laufenden Wert selbst obenauf.
           Der erste Michaeli einer Partie geht NICHT in die Reihe: was dort
           steht, ist der Ansatz des vorigen Hauses (`umsatzAnfang`), und
           veranlagt wird die Hand, die jetzt braut. */
    if (!erste) {
      Z.umsatzReihe.push(Math.max(0, Math.round(Z.umsatz)));
      Z.ertragReihe.push(Math.max(0, Math.round(Z.ertrag)));
      if (Z.umsatzReihe.length > 6) Z.umsatzReihe.shift();
      if (Z.ertragReihe.length > 6) Z.ertragReihe.shift();
    }

    /* AUFLAGE R7 — DIE TAFEL LIEGT ZU MICHAELI VON SELBST AUF.
       `Z.offen` stand hier schon; was fehlte, war das Zuruecksetzen der
       Merkmarken. `Z.geklemmt` haelt sonst das Urteil der STADT ueber die
       Tafel des VORIGEN Jahres fest, und `Z.gesehen` entscheidet, ob die
       Tafel sich den Tisch zurueckholen darf (siehe `handHorcher`). */
    Z.offen = (B.arg.roh.tafel !== 'zu') || !erste;
    Z.erzwungen = false;
    Z.geklemmt = false;
    Z.gesehen[Z.tafelJahr] = false;
    Z.rueckholung = 0;
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
    /* Der Erbfall steht im Kalender: die Amtszeit hat ein Ende. Welches,
       steht NICHT in `amtszeit().bis` — die Zahl dort ist gewuerfelt
       (`welt.js:379`, 21 bis 37 Jahre) und wird von der Stunde des ERBEN
       laengst ueberholt, die alle zwei Braujahre schlaegt. Angekuendigt wird
       deshalb der Abstand, den dieses Haus wirklich erlebt hat
       (`naechsterErbfall`); solange keiner gemessen ist, steht die Zeile
       nicht da. Sie war die zweite Stelle mit derselben falschen Zahl: der
       Handlohn ist in 1350 mehr als eine ganze Jahreslast und faellt alle
       zwei Jahre — angekuendigt war er auf 1386. */
    var erb = naechsterErbfall();
    if (!Z.handlohnWeg && erb) {
      l.push({
        jahr: erb, name: handlohnKurz(),
        sagt: amtszeit().name + ' führt das Haus seit ' + (amtszeit().seit || Z.startjahr)
            + '; die bisherigen Amtszeiten hielten je ' + amtszeitFrist()
            + (amtszeitFrist() === 1 ? ' Braujahr.' : ' Braujahre.'),
        betrag: handlohnBetrag(),
        art: 'erbfall'
      });
    }
    /* Die Raten laufender Bauten. */
    Z.raten.forEach(function (r) {
      l.push({ jahr: r.faellig, name: 'Rate: ' + r.name, sagt: r.offen + ' Raten offen',
        betrag: r.rate, art: 'rate' });
    });
    /* Was der Rat auf das ansetzt, was bar liegen bleibt — mit dem Stand von
       HEUTE, nicht mit dem vom letzten Michaeli. Die Zahl faellt, sobald das
       Geld im Haus verbaut ist, und steigt, solange es liegt. Genau das soll
       sie: eine angekuendigte Zahl, die sich durch einen Zug bewegen laesst,
       ist eine Entscheidung; eine, die erst am Zahltag auftaucht, ist eine
       Strafe. Sie steht nur da, wo die Epoche sie kennt und wo sie greift. */
    var lg = liegegeld();
    if (lg > 0) {
      l.push({ jahr: jahr() + 1, name: liegeName(),
        sagt: (ep().liegeSagt || '') + ' Frei bleiben ' + geld(liegeFreibetrag())
            + ' — heute liegen ' + geld(Math.max(0, Math.floor(B.welt.haus.kasse)))
            + ' bar im Haus.',
        betrag: lg, art: 'umlage' });
    }
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

  /* ======================================================================
     AUFLAGE R8 — WENN NICHTS BEZAHLBAR IST, SAGT DIE TAFEL, WOHER DAS GELD
     KOMMT.  ALS BENANNTER ZUG, NICHT ALS RATSCHLAG.

     Gemessen im Urteil der Welle 12: in der 1350-Sitzung war in **127 von
     284 Wochen** ueberhaupt nichts mit Preisschild bezahlbar; in vier
     Sitzungen und 1.030 Wochen hat der Kritiker ZWEI unwiderrufliche
     Festlegungen getroffen, in 1350 null von drei. Sein Satz: „Eine
     unwiderrufliche Festlegung, die man nie bezahlen kann, ist trotzdem
     keine Festlegung, sondern eine Vitrine."

     Der vorhandene Satz „HEUTE NICHT · … es fehlen 12 Pf" nennt die Luecke.
     Was fehlte, ist der Satz danach. Er wird NICHT erfunden, sondern
     ABGELESEN: das Spiel schreibt jede Einnahme als Preisschild mit
     POSITIVER Zahl an ihren Knopf (`kern/buehne.js` B.knopf: `einnahme =
     opt.preis > 0`). Was hier steht, ist also immer ein Knopf, den es in
     dieser Woche wirklich gibt — mit seinem eigenen Wortlaut und seiner
     eigenen Zahl.

     WARUM DAS EIN ZUG IST UND KEIN RATSCHLAG: die Tafel geht mit dem Griff
     oben rechts zu und wieder auf, ohne dass die Woche laeuft, und `nimm()`
     fragt nur nach der WOCHE, nicht nach der Reihenfolge. Zettel schliessen,
     Grut verkaufen, Tafel wieder aufschlagen, nehmen — alles am selben
     Michaelistag. Genau das steht im Satz.

     GEMESSEN, BEVOR DIESER SATZ GESCHRIEBEN WURDE: es gibt im ganzen Spiel
     GENAU EINEN Knopf mit positivem Preisschild, in allen vier Epochen
     denselben — `fuhre:rueckkauf:rohstoff` (+19 Pf / +66 fl / +633 M /
     +7.200 DM). In 1884 und 1970 ist er im Ladezustand abgeschaltet. Das ist
     ein Befund ueber das Spiel und keiner ueber diese Tafel; er gehoert DER
     FUHRE und dem GEGENZUG (Auflage A9) und steht deshalb im Bericht, nicht
     hier im Knopf. Diese Tafel sagt, was da ist — und wenn nichts da ist,
     sagt sie auch das, statt einen Weg zu erfinden.

     Fremdes DOM wird hier nur GELESEN. `stuecke/fuhre.js` zeichnet vor
     diesem Stueck (Reihenfolge in `spiel/index.html`), der Knopf ist also
     aus derselben Runde.
     ====================================================================== */
  function einnahmeZuege() {
    if (typeof document === 'undefined') return [];
    var raus = [];
    var alle = document.querySelectorAll('[data-preis]');
    for (var i = 0; i < alle.length; i++) {
      var el = alle[i];
      var zug = el.getAttribute('data-zug') || '';
      if (zug.indexOf('preis:') === 0) continue;        /* das eigene Blatt */
      var p = parseFloat(el.getAttribute('data-preis'));
      if (!(p > 0)) continue;
      if (el.disabled) continue;
      var r = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
      if (r && (r.width < 4 || r.height < 4)) continue;
      var wort = el.querySelector ? el.querySelector('.wort') : null;
      raus.push({
        zug: zug, betrag: Math.round(p),
        name: ((wort ? wort.textContent : el.textContent) || zug).trim().replace(/\s+/g, ' ')
      });
    }
    return raus;
  }

  /* Der Zug, der die Luecke schliesst: der KLEINSTE, der reicht — und wenn
     keiner reicht, der groesste, den es gibt. Ein Haus verkauft nicht mehr,
     als es muss. */
  function geldZug(fehlt) {
    var l = einnahmeZuege();
    if (!l.length) return null;
    var reicht = l.filter(function (z) { return z.betrag >= fehlt; });
    if (reicht.length) {
      return reicht.reduce(function (a, z) { return z.betrag < a.betrag ? z : a; });
    }
    return l.reduce(function (a, z) { return z.betrag > a.betrag ? z : a; });
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

  /* ======================================================================
     WAS DIESES STUECK AN DEN STREIFEN MELDET.

     Die Zahl unten rechts heisst "Kasse geteilt durch den Preis des
     naechsten sinnvollen Zuges". Bis hierher hat dieses Stueck in jeder der
     52 Wochen das billigste Angebot der Michaelitafel gemeldet — auch in
     den 51 Wochen, in denen es nicht zu nehmen ist. nimm() beginnt mit
     `if (B.welt.zeit.woche !== 1) return;`, und der Knopf traegt in genau
     diesen Wochen die Aufschrift 'Michaeli ist vorüber' und ist aus. Ein
     Preis, den man ein Jahr lang nicht zahlen kann, ist kein Nenner.

     Gemeldet wird jetzt nur, was heute zu haben ist: Michaeli, das Angebot
     nicht genommen, nicht ausgeschlossen, und die Kasse reicht fuer die
     erste Zahlung — dieselben vier Bedingungen, unter denen der Knopf
     'Nehmen' bedienbar ist. Sonst schweigt dieses Stueck, und der Nenner
     gehoert dem, der wirklich einen Zug anzubieten hat.

     Was dabei NICHT verlorengeht: die Spalte "eigene Tafel" auf der LEITER
     und die Zeile "Kasse : dieses Angebot" am Griff rechnen weiter jede
     Woche mit dem billigsten Angebot. Das ist eine Aussage ueber die
     Preisleiter dieses Hauses — und ausdruecklich NICHT die Kennzahl der
     Latte. Die steht daneben und kommt aus `welt.zugDeckung()`.
     ====================================================================== */
  function meldeZug() {
    if (B.welt.zeit.woche !== 1) return;
    var best = null;
    lebendeAngebote().forEach(function (k) {
      var a = angebotVon(k);
      if (!a || Z.genommen[k] || Z.gesperrt[k]) return;
      var p = zahlplan(a).jetzt;
      if (!B.welt.kann(p)) return;
      if (!best || p < best.preis) best = { a: a, preis: p };
    });
    /* Vier Argumente, nicht drei (ZUSTAENDIGKEIT 24). Die Art ist `bau` und
       nicht `lage`: was hier gemeldet wird, ist ein Bottich, ein Brunnen, ein
       Keller — es aendert die Lage des Hauses und ist kein Beiwerk. Der
       vierte, der Zugschluessel, ist keine Zier: `zugDeckung()` gibt `null`,
       wenn zu dieser Zahl kein bedienbarer Knopf am Bildschirm steht. Genau
       das ist hier moeglich — der Griff kann zugeklappt sein —, und dann soll
       die Kopfzeile diese Zahl auch nicht nennen. */
    if (best) B.welt.meldeZug(best.a.name, best.preis, 'bau', 'preis:nimm:' + best.a.k);
  }

  /* ======================================================================
     DIE KENNZAHL IN DIE LEITER SCHREIBEN — EINMAL IM JAHR, AUS DER QUELLE,
     AUS DER SIE AUCH UNTEN RECHTS KOMMT.

     Zwei Zahlen fuer dieselbe Lage waren der schwerste Einwand gegen dieses
     Stueck: am 1350/W1 sagte die Kopfzeile „Kasse reicht 5,9x" und DIE
     LEITER „3,11x". Beide hatten recht — sie massen Verschiedenes, und
     keine sagte, was sie mass. Solange das so ist, ist die Kennzahl des
     Stuecks nicht falsifizierbar: wer sie widerlegen will, weiss nicht, an
     welcher Zahl.

     Jetzt fuehrt DIE LEITER die Kennzahl selbst — nicht nachgerechnet,
     sondern abgelesen: `B.welt.zugDeckung()` ist dieselbe Funktion, aus der
     `kern/kopf.js` seine Zahl nimmt. Steht sie im Bild, steht sie in der
     Leiter, Ziffer fuer Ziffer.

     Warum nicht sofort in `michaeli()`: `buehne.js` loescht `naechsterZug`
     zu Beginn jedes Bildaufbaus, und die Stuecke melden ihn im selben
     Durchgang neu. In `michaeli()` — das aus der Uhr kommt, nicht aus dem
     Zeichnen — steht dort noch nichts oder etwas von voriger Woche. Also
     dasselbe Verfahren wie in `kern/kopf.js`: ein Bildaufbau spaeter.
     `zugDeckung()` gibt `null`, solange zu der Zahl kein bedienbarer Knopf
     am Bildschirm steht; dann wird es in derselben Woche 1 einfach noch
     einmal versucht. Was einmal steht, wird nicht mehr angefasst — sonst
     wanderte eine Jahreszahl, weil jemand ein Brett aufklappt.
     ====================================================================== */
  function fuelleKennzahl() {
    if (B.welt.zeit.woche !== 1) return;
    var l = Z.leiter[Z.leiter.length - 1];
    if (!l || l.jahr !== jahr() || l.zugFest) return;
    var d = B.welt.zugDeckung();
    var n = B.welt.naechsterZug;
    if (d === null || !n || !n.preis) return;
    l.zugWas = n.was;
    l.zugPreis = n.preis;
    l.zugArt = n.art || null;
    l.zugVerh = d;
    l.zugFest = true;
    B.sende('zeichne', { grund: 'preis-kennzahl' });
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

  /* WIE VIELE SIEGELKARTEN NEBENEINANDER LIEGEN — und warum nicht alle.

     Mit den Sprossen aus Auflage 4 haelt eine Epoche sechs bis sieben
     Festlegungen; nebeneinander in eine Reihe gelegt, die 35 im Hundert
     der Spalte hoch ist, waere jede einzelne so schmal, dass ihr Text
     wieder abgeschnitten wuerde — genau der Fehler aus Auflage 3, nur mit
     mehr Karten. Die Angebotsseite loest dasselbe seit jeher mit
     `angeboteJeJahr: 4`.

     Gezeigt werden deshalb VIER: die drei billigsten offenen — das ist die
     Wahl, die heute wirklich zu treffen ist — und dazu die TEUERSTE, denn
     sie ist das Ziel, auf das gespart wird, und ein Ziel, das man nicht
     mehr sieht, ist keines. Der ganze Katalog mit Taxe steht weiterhin auf
     der Chronikseite unter WAS DIESE ZEIT NOCH ANBIETET; dort wird nichts
     weggelassen. */
  var FEST_JE_TAFEL = 4;
  function festlegungenTafel() {
    var l = festlegungen().slice();
    if (l.length <= FEST_JE_TAFEL) return l;
    l.sort(function (a, b) { return festPreis(a) - festPreis(b); });
    var zeig = l.slice(0, FEST_JE_TAFEL - 1);
    zeig.push(l[l.length - 1]);
    return zeig;
  }

  /* Eine Festlegung ist ein Rechtsakt, kein Kostenvoranschlag. Ihre Taxe haengt
     an der Zeit, nicht am Vermoegen des Hauses — sonst waere sie fuer ein
     wachsendes Haus nie erreichbar, weil sie mit der Kasse mitwuechse. */
  function festBasis() {
    var e = ep();
    return e.grund * Math.pow(e.teuerungJahr, B.grenze(jahr() - Z.startjahr, 0, 40));
  }

  function festPreis(f) { return f.anteil ? rundePreis(f.anteil * festBasis()) : 0; }

  /* Alles, was in der Chronik des Hauses unabaenderlich steht — gleich,
     welches Stueck es hineingeschrieben hat. DER GEGNER, DIE FUHRE und DAS
     ERBE schreiben mit `art='festlegung'`; dieses Stueck ebenfalls. Die
     eigene Zahl bleibt als Untergrenze stehen, falls ein Stueck seine Zeile
     einmal anders benennt. */
  function festlegungenGesamt() {
    var n = 0;
    (B.welt.chronik || []).forEach(function (c) { if (c && c.art === 'festlegung') n++; });
    return Math.max(n, Object.keys(Z.festGenommen).length);
  }

  /* Und die Zahl daneben: wie viele davon von DIESER Tafel kamen.
     AUFLAGE 1 DER WELLE 5. Danebengestanden hat bis heute
     `Object.keys(Z.fertig).length` — das sind FERTIGE ANGEBOTE, Bottiche
     und Keller, und sie standen in einem Satz, der von Festlegungen
     handelt. Gemessen hat der Kritiker: „2 Festlegungen · 0 von dieser
     Tafel gebaut", obwohl beide von dieser Tafel kamen. Eine Zahl, die im
     Satz ueber A steht und B zaehlt, ist keine Auskunft.
     Die Bautenzahl ist damit nicht verschwunden — sie steht weiter da, nur
     in ihrem eigenen Satzglied und mit ihrem eigenen Wort. */
  function festlegungenEigen() { return Object.keys(Z.festGenommen).length; }
  function bautenFertig() { return Object.keys(Z.fertig).length; }

  /* Der Satz, der ueber jeder Chronikaufschrift steht — an einer Stelle
     geschrieben, damit der Griff (Tafel zu) und der Reiter (Tafel offen)
     nie zwei verschiedene Dinge behaupten koennen. AUFLAGE 2: bis heute
     trug NUR der Griff die Zahlen, und der Griff wird nur gezeichnet,
     wenn die Tafel ZU ist — am Michaelitag, im Augenblick der
     unwiderruflichen Wahl, stand nirgends, wie viele Festlegungen das
     Haus hat. */
  function chronikAufschrift(mitBauten) {
    var g = festlegungenGesamt(), e = festlegungenEigen();
    return 'Chronik des Hauses · ' + g + (g === 1 ? ' Festlegung' : ' Festlegungen')
      + ' · ' + e + ' von dieser Tafel'
      + (mitBauten ? ' · ' + bautenFertig() + ' Bauten stehen' : '');
  }

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
    /* AUFLAGE 4: MIT der Teuerung, weil Schritt 4 der Michaeli-Abrechnung
       sie mitbucht (`loese(Math.round(t.betrag * teuerung()))`). Der Ertrag
       stand hier nominal, die Last darunter mit Teuerung — auf DERSELBEN
       Zeile. Gemessen: die Karte „Das Dach ueber der Pfanne" versprach zu
       Michaeli 1362 „+16 Pf in jedem Michaeli", die Rechnung 1363 buchte
       +27 Pf. 69 im Hundert daneben, zugunsten des Spielers, und damit
       genau die Sorte Zahl, die eine Kaufentscheidung unbrauchbar macht. */
    if (w.ertrag) t.push('+' + geld(Math.round(w.ertrag * teuerung())) + ' in jedem Michaeli');
    if (w.rohstoff) t.push('+' + B.zahl(w.rohstoff) + ' ' + B.welt.epoche().rohstoff + ' im Jahr');
    if (w.plaetze) t.push('+' + B.welt.menge(w.plaetze) + ' Lagerplatz');
    if (w.preis) t.push((w.preis > 0 ? '+' : '') + B.zahl(w.preis * 100, 0) + ' im Hundert je '
      + ep().einheit);
    if (w.ansehen) t.push((w.ansehen > 0 ? '+' : '') + w.ansehen + ' Ansehen');
    if (w.pflichtWeg) t.push('kein ' + pflichtName(w.pflichtWeg) + ' mehr');
    if (w.bindung) t.push(w.bindung.n + ' Häuser gebunden, ' + w.bindung.jahre + ' Jahre');
    /* WAS ES FUER IMMER KOSTET, GEHOERT AUF DIESELBE ZEILE WIE DAS, WAS ES
       BRINGT. Seit Welle 7 traegt auch ein ANGEBOT eine neue Pflicht (der
       Unterhalt, siehe preis-daten.js). Stuende nur der Ertrag da, waere das
       Preisschild unvollstaendig: die Karte verspraeche „+16 Pf in jedem
       Michaeli" und verschwiege „−9 Pf in jedem Michaeli". Genau diese Zeile
       gab es fuer die Festlegungen schon (`festKarte`: „Dafuer neu und fuer
       immer"); die Angebote hatten sie nicht, weil sie bis heute keine
       dauerhafte Last hatten. */
    if (w.pflichtNeu) {
      var p = pflichtZeile(w.pflichtNeu);
      t.push('−' + geld(p.betrag) + ' in jedem Michaeli: ' + w.pflichtNeu.name);
    }
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
        var z = zeile(p.name, geld(-p.betrag), 'pr-pflicht pr-wurzel-' + p.art);
        z.appendChild(B.el('span', 'pr-wurzel', WURZEL[p.art] || WURZEL.menge));
        kasten.appendChild(z);
      });
      kasten.appendChild(zeile('Zusammen im Jahr', geld(-pflichtSumme()), 'pr-summe'));
      kasten.appendChild(B.el('div', 'pr-satz pr-klein',
        'Drei Wurzeln: was weiterläuft, wenn die Pfanne kalt bleibt · was am Ausstoß hängt · '
        + 'was der Rat nach der Nahrung des Jahres veranlagt. '
        + (e.liegeSatz
            ? 'Und in dieser Zeit eine vierte: was bar liegen bleibt.'
            : 'Keine hängt an der Kasse.')));
    } else {
      /* Ein Plus vor dem Zufluss. Ohne es steht der Ertrag eines Baus in
         derselben Spalte wie eine Abgabe und liest sich wie eine. */
      var summe = 0;
      Z.rechnung.forEach(function (r) {
        var wert = r.betrag
          ? (r.betrag > 0 ? '+' + geld(r.betrag) : geld(r.betrag))
          : (r.menge ? '+' + B.zahl(r.menge) + ' ' + B.welt.epoche().rohstoff : '—');
        var z = zeile(r.name, wert, 'pr-' + r.art + (r.offen ? ' pr-offen' : '')
          + (r.wurzel ? ' pr-wurzel-' + r.wurzel : ''));
        /* Woran diese Zeile haengt, steht an der Zeile — nicht in einer
           Legende und nicht im Quelltext. */
        if (r.wurzel && WURZEL[r.wurzel]) z.appendChild(B.el('span', 'pr-wurzel', WURZEL[r.wurzel]));
        if (r.offen) z.appendChild(B.el('span', 'pr-marke', 'offen ' + geld(r.offen)));
        kasten.appendChild(z);
        summe += r.betrag;
      });
      kasten.appendChild(zeile('Zusammen', (summe > 0 ? '+' : '') + geld(summe), 'pr-summe'));
    }
    /* Die vierte Wurzel steht als REGEL da, nicht erst als Rechnungszeile —
       sonst liest der Spieler sie zum ersten Mal an dem Tag, an dem sie ihn
       trifft. Sie steht nur, wo die Epoche sie kennt.

       KURZ, und das ist gemessen: mit dem vollen Satz aus den Daten
       (`liegeSagt`) hinten dran lief der Absatz am 3. August in 1600 unten aus
       dem Kasten heraus und brach mitten im Wort ab. Der lange Satz steht in
       WAS FAELLIG WIRD, wo die Spalte ihn traegt; hier steht die Regel. */
    if (e.liegeSatz) {
      kasten.appendChild(B.el('div', 'pr-satz pr-klein pr-liege',
        liegeName() + ': frei bleiben ' + B.zahl(e.liegeFrei || 0, 1) + ' Jahreslasten, '
        + 'mindestens der Preis der nächsten Festlegung — ' + geld(liegeFreibetrag())
        + '. Auf alles, was zu Michaeli darüber hinaus bar liegt, schlägt der Rat '
        + B.zahl((e.liegeSatz || 0) * 100, 0) + ' im Hundert an. '
        + 'Was verbaut, gebunden oder festgelegt ist, zählt nicht mit.'));
    }
    /* Woran das Haus dieses Jahr gemessen wird — beide Zahlen stehen da,
       damit niemand die Rechnung fuer eine Laune halten muss. */
    var nah = B.el('div', 'pr-nahrung');
    nah.appendChild(zeile('Ausstoß des vergangenen Jahres', geld(Math.round(Z.umsatz))));
    nah.appendChild(zeile('davon übrig geblieben',
      (Z.ertrag > 0 ? '+' : '') + geld(Math.round(Z.ertrag)),
      Z.ertrag < 0 ? 'pr-mager' : ''));
    /* Was der Ausschuss zugrunde legt, ist nicht dieselbe Zahl — und der
       Unterschied ist in den Zackenjahren der ganze Unterschied. */
    if (Z.umsatzReihe.length) {
      nah.appendChild(zeile('veranlagt wird der Schnitt aus '
        + Math.min(3, Z.umsatzReihe.length + 1) + ' Jahren',
        geld(Math.round(umsatzVeranlagt())), 'pr-veranlagt'));
    }
    if (Z.nachlass && Z.nachlassBetrag > 0) {
      nah.appendChild(zeile(e.nachlassName || 'Nachlass auf die feste Last',
        '−' + geld(Z.nachlassBetrag), 'pr-frei'));
    }
    kasten.appendChild(nah);
    sp.appendChild(kasten);

    /* DIE BIERORDNUNG, in drei Zeilen statt einer: was der Rat gesetzt hat,
       was er seither nachgesetzt hat, und was das Haus sich selbst dazu
       erarbeitet hat. Die dritte Zeile ist die einzige, die der Spieler
       bewegen kann — deshalb steht sie mit ihrer Zahl da und nicht in
       einem Nebensatz. */
    var ord = B.el('div', 'pr-feld pr-ordnung');
    ord.appendChild(B.el('h3', null, 'DIE BIERORDNUNG'));
    var o = ordnung();
    ord.appendChild(zeile('Satz je ' + e.einheit, geld(Math.round(satzJetzt())), 'pr-gross'));
    ord.appendChild(B.el('div', 'pr-satz', o.sagt));
    var nf = nachfuehrung();
    ord.appendChild(zeile(satzSetzer() + ' ' + o.ab, geld(o.preis), 'pr-satzteil'));
    ord.appendChild(zeile(satzFolgt()
        ? 'seither nachgesetzt (' + B.zahl(satzFolgt() * 100, 0) + ' im Hundert der Teuerung)'
        : 'seither nachgesetzt — in dieser Zeit nie',
      (nf > 1 ? '+' : '') + B.zahl((nf - 1) * 100, 0) + '%', 'pr-satzteil'));
    ord.appendChild(zeile('Aufschlag des Hauses — selbst gebaut',
      (Z.aufschlag > 0 ? '+' : '') + B.zahl(Z.aufschlag * 100, 0) + '%',
      'pr-satzteil pr-satz-aufschlag'));
    ord.appendChild(B.el('div', 'pr-satz pr-klein',
      (jahr() - o.ab <= 0 ? 'In diesem Jahr gesetzt. '
        : 'Gesetzt ' + o.ab + ' — die Stufe steht seit ' + (jahr() - o.ab) + ' Jahren. ')
      + (satzFolgt() ? satzNachSatz() + ' ' : satzHaeltSatz() + ' ')
      + 'Was zur Teuerung fehlt, ist der Teil, den nur das Haus selbst zubauen kann.'));
    sp.appendChild(ord);

    var an = B.el('div', 'pr-feld pr-anschlag');
    an.appendChild(B.el('h3', null, 'DER ANSCHLAG'));
    an.appendChild(zeile('Für ' + jahr(), geld(Math.round(Z.anschlag)), 'pr-gross'));
    var ausUmsatz = umsatzGewicht() * Z.umsatz;
    var ausKasse = ausBarschaft();
    an.appendChild(zeile('aus dem Umsatz des Vorjahrs', geld(Math.round(ausUmsatz))));
    an.appendChild(zeile('aus der Barschaft', geld(Math.round(ausKasse))));
    if (amBoden()) {
      /* Eine Zeile, keine zusaetzliche. Der Kasten DER ANSCHLAG steht neben
         WAS SCHON STEHT; ein Absatz mehr schiebt dessen Fuss aus dem Rahmen —
         am Bildschirm nachgesehen, Michaelitafel 1970. */
      var bz = zeile('Mindestansatz dieser Zeit', geld(e.grund), 'pr-umlage');
      bz.title = 'Unter diese Zahl schlägt in dieser Zeit niemand einen Bau an. '
        + 'Sie ist der Ansatz der Zeit und nicht das Haus: ein Haus, das schrumpft, '
        + 'wird nach ihr bedient, aber sie wächst nicht mit den Jahren.';
      an.appendChild(bz);
    }
    if (Z.kaeufe) an.appendChild(zeile('Aufschlag für ' + Z.kaeufe + ' gebaute Sachen',
      '+' + B.zahl((Math.pow(ep().teuerungKauf, Z.kaeufe) - 1) * 100, 0) + '%'));
    an.appendChild(zeile('Teuerung seit ' + Z.startjahr
        + (amBoden() ? ' — nicht auf den Mindestansatz' : ''),
      '+' + B.zahl((Math.pow(ep().teuerungJahr, B.grenze(jahr() - Z.startjahr, 0, 40)) - 1) * 100, 0) + '%'));
    /* Der Anschlag gilt nicht fuer alles, was heute auf dem Tisch liegt —
       und wenn nicht, gehoert das hierher und nicht in den Quelltext. */
    var nachTaxe = lebendeAngebote().filter(function (k) {
      var o = angebotVon(k); return o && o.nachZeit;
    }).length;
    if (nachTaxe) {
      var tz = zeile(nachTaxe + ' von ' + lebendeAngebote().length
        + ' Sachen nach der Taxe', geld(Math.round(festBasis())));
      tz.title = 'Was ein Handwerker nach Mass und Gewicht liefert, kostet, was es kostet: '
        + 'die Taxe steigt mit der Teuerung und nicht mit dem Haus. '
        + 'Was der Rat verleiht und was nach Mass gebaut wird, wird nach dem Anschlag bedient.';
      an.appendChild(tz);
    }
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
      if (ertragSumme) st.appendChild(zeile('trägt im Jahr',
        geld(Math.round(ertragSumme * teuerung())), 'pr-ertrag pr-summe'));
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

    /* Auch hier traegt die Karte ihren Text selbst (Auflage 3, Begruendung
       bei `karteText`): dieselben Kinder waren auf der Angebotsseite mit
       `pr-folge-text` 16-, `pr-satz-klein` 9- und `pr-was-text` 8-mal
       abgeschnitten. Das Preisschild bleibt darueber und schrumpft nie. */
    var kt = karteText(karte);

    var kopf = B.el('div', 'pr-karte-kopf');
    kopf.appendChild(B.el('b', null, a.name));
    kt.appendChild(kopf);

    if (schon) kt.appendChild(B.el('div', 'pr-karte-stempel', 'GENOMMEN'));
    else if (zu) kt.appendChild(B.el('div', 'pr-karte-stempel pr-stempel-zu', 'AUSGESCHLOSSEN'));

    var schild = B.el('div', 'pr-schild');
    schild.appendChild(B.el('span', 'pr-schild-zahl', geld(plan.jetzt)));
    if (plan.raten) {
      schild.appendChild(B.el('span', 'pr-schild-rest',
        'von ' + geld(plan.ganz) + ' · dann ' + plan.raten + ' × ' + geld(plan.rate)));
    } else {
      schild.appendChild(B.el('span', 'pr-schild-rest', 'ganz, sofort'));
    }
    kt.appendChild(schild);

    /* Woran der Preis haengt, steht an der Karte — sonst ist die Zahl eine
       Behauptung. Die lange Begruendung steht bei `preisVon`. */
    kt.appendChild(B.el('div', 'pr-hinweis', a.nachZeit
      ? 'Nach der Taxe des Jahres — der Handwerker rechnet für die Sache, nicht für die Lade.'
      : 'Nach dem Anschlag von ' + jahr() + ' — was das Haus wert ist, wird mit angeschlagen.'));

    kt.appendChild(B.el('div', 'pr-bauzeit', a.bauzeit
      ? 'Bauzeit ' + a.bauzeit + ' Jahr' + (a.bauzeit > 1 ? 'e' : '') + ' · fertig ' + (jahr() + a.bauzeit)
      : 'Ohne Bauzeit · wirkt ab heute'));

    kt.appendChild(B.el('div', 'pr-was-text', a.was));
    var f = B.el('div', 'pr-folge');
    f.appendChild(B.el('span', 'pr-folge-marke', 'Folge'));
    f.appendChild(B.el('span', 'pr-folge-text', folgeText(a) || a.satz));
    kt.appendChild(f);
    kt.appendChild(B.el('div', 'pr-satz-klein', a.satz));

    if (a.sperrt && a.sperrt.length) {
      var namen = a.sperrt.map(function (k) {
        var o = angebotVon(k); return o ? o.name : k;
      }).join(', ');
      kt.appendChild(B.el('div', 'pr-sperrt', 'Schließt aus: ' + namen));
    }
    dauerZeile(karte, a.wirkung);

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

  /* ----------------------------------------------------------------------
     AUFLAGE 3 DER WELLE 5 — EINE KARTE, DIE IHREN TEXT NICHT TRAEGT, IST
     KEIN PREISSCHILD.

     `preis.css:224` gibt `.pr-fest` ein `overflow: hidden`, und die
     Zusatzlage setzt seit Runde 1 `flex: 0 1 auto; min-height: 0` auf alle
     Kinder: die Kaesten schrumpfen unter ihren Inhalt, und was darunter
     liegt, wird WEGGESCHNITTEN. Gemessen hat der Kritiker 47 Sichtungen
     ueber zwoelf Bildschirme; am Bildschirm zu sehen war es an der Stelle,
     die am meisten weh tut — auf dem Zunftbrief mit dem Ratssitz endete die
     Regel mitten in „Der Landesherr nimmt dafür jährlich seinen Teil", auf
     dem Bierbann brach „Dafür neu und für immer: Bannzins an den
     Landesherrn" ab. Das ist der Satz, der sagt, was die unwiderrufliche
     Entscheidung fuer den Rest der Partie KOSTET.

     Der Text wandert deshalb in einen eigenen Kasten. Er bekommt den
     ganzen uebrigen Platz der Karte und traegt seinen Ueberschuss selbst
     (`overflow-y: auto`, stil/preis-zusatz.css); seine Kinder schrumpfen
     nicht mehr und schneiden darum auch nichts mehr ab. Der Knopf und der
     Hinweis darueber bleiben, wo sie waren — direkte Kinder der Karte,
     `flex: 0 0 auto`: die Handlung wird nie aus der Karte gedrueckt und
     scrollt auch nicht weg. Beides ist am Bildschirm nachgemessen
     (`ueberlauf.mjs`, vier Epochen mal drei Aufloesungen). */
  function karteText(karte) {
    var t = B.el('div', 'pr-karte-text');
    karte.appendChild(t);
    return t;
  }

  /* ======================================================================
     DIE ANDERE HAELFTE DES PREISSCHILDS — und sie steht jetzt AUF der Karte.

     AUFLAGE 7 des blinden Kritikers, gemessen bei 1366x768: **30 von 30**
     FOLGE-Zeilen liegen ausserhalb ihres Kastens, in allen vier Epochen. Die
     Karte „Das Dach ueber der Pfanne" endet bei y ≈ 400 px, ihre FOLGE-Zeile
     steht bei y = 493 px — 93 px unter dem Kartenrand, in einem 150 px hohen
     Rollfenster, dessen Inhalt das Vierfache braucht. Am Bildschirmfoto endet
     der sichtbare Kartentext mitten durch die Buchstaben von „Ohne Bauzeit ·".

     Die vierte Latte zaehlt das NICHT als abgeschnitten, und mit gutem Grund:
     `.pr-karte-text` rollt, verbirgt also nichts. Der Kritiker hat trotzdem
     recht — „das ist der Unterschied zwischen benannt und am Schirm", und was
     dort unten liegt, ist das, was ein Kauf FUER IMMER kostet.

     Der ganze Text bleibt, wo er ist (er ist zu lang fuer eine Karte, die
     einen Knopf tragen muss). Was hier dazukommt, ist die kurze Zeile mit den
     beiden Zahlen, direkt unter dem Preisschild und AUSSERHALB des
     Rollfensters — dort, wo Preisschild und Knopf schon stehen. Ein
     Preisschild, das nur die Anzahlung nennt, ist ein halbes Preisschild. */
  function dauerZeile(karte, w) {
    if (!w) return;
    var traegt = w.ertrag ? Math.round(w.ertrag * teuerung()) : 0;
    var kostet = w.pflichtNeu ? pflichtZeile(w.pflichtNeu).betrag : 0;
    if (!traegt && !kostet) return;
    var d = B.el('div', 'pr-dauer');
    d.appendChild(B.el('span', 'pr-dauer-marke', 'in jedem Michaeli'));
    if (traegt) d.appendChild(B.el('span', 'pr-dauer-plus', '+' + geld(traegt)));
    if (kostet) d.appendChild(B.el('span', 'pr-dauer-minus', '−' + geld(kostet)));
    if (traegt && kostet) {
      d.appendChild(B.el('span', 'pr-dauer-netto',
        '= ' + (traegt - kostet >= 0 ? '+' : '') + geld(traegt - kostet)));
    }
    d.title = (traegt ? 'Trägt ' + geld(traegt) + ' in jedem Michaeli. ' : '')
      + (kostet ? w.pflichtNeu.name + ': ' + geld(kostet) + ' in jedem Michaeli, für immer.' : '');
    karte.appendChild(d);
  }

  function festKarte(f) {
    var preis = festPreis(f);
    /* Was sie hereinbringt, mit derselben Rechnung wie beim Klick
       (`wende`: einmal × Jahreslast) — damit auf dem Schild dieselbe Zahl
       steht, die gleich in der Kasse landet. */
    var zufluss = (f.wirkung && f.wirkung.einmal)
      ? rundePreis(f.wirkung.einmal * pflichtSumme()) : 0;
    var offen = festlegungOffen();
    var kann = preis === 0 || B.welt.kann(preis);
    var jetztTag = B.welt.zeit.woche === 1;

    var karte = B.el('div', 'pr-fest' + (offen ? '' : ' pr-fest-zu'));
    karte.setAttribute('data-festlegung', f.k);
    var kt = karteText(karte);
    kt.appendChild(B.el('b', 'pr-fest-name', f.name));
    kt.appendChild(B.el('div', 'pr-was-text', f.was));
    var r = B.el('div', 'pr-regel');
    r.appendChild(B.el('span', 'pr-folge-marke', 'Regel'));
    r.appendChild(B.el('span', 'pr-folge-text', f.regel));
    kt.appendChild(r);

    /* Was sie in Zahlen tut — dieselbe Zeile wie bei einem Angebot, damit
       sich beides nebeneinanderlegen laesst. */
    var fz = folgeText(f);
    if (fz) {
      var ff = B.el('div', 'pr-folge');
      ff.appendChild(B.el('span', 'pr-folge-marke', 'Folge'));
      ff.appendChild(B.el('span', 'pr-folge-text', fz));
      kt.appendChild(ff);
    }
    if (f.wirkung && f.wirkung.pflichtNeu) {
      kt.appendChild(B.el('div', 'pr-sperrt',
        'Dafür neu und für immer: ' + f.wirkung.pflichtNeu.name + '.'));
    }
    /* Der Zeitraum auf der Karte — gemessen, nicht gewuerfelt. Begruendung
       oben bei `merkeAmtszeit`. Was hier stand („fuehrt das Haus bis 1636"),
       war der einzige Satz, der einer unwiderruflichen Entscheidung ihre
       Frist angab, und er lag um den Faktor zehn bis achtzehn daneben. */
    var frist = amtszeitFrist();
    kt.appendChild(B.el('div', 'pr-satz-klein',
      'Preis dieser Amtszeit: '
      + (preis ? geld(preis) : (zufluss ? geld(zufluss) + ' kommen herein' : 'keine Ausgabe'))
      + ' · ' + amtszeit().name + ' führt das Haus seit '
      + (amtszeit().seit || Z.startjahr) + '. '
      + (frist
          ? 'Die bisherigen Amtszeiten dieses Hauses hielten je ' + frist
            + (frist === 1 ? ' Braujahr' : ' Braujahre') + ' — die Festlegung hält länger: '
            + 'sie gilt für den Rest der Partie.'
          : 'Die Festlegung überdauert die Amtszeit: sie gilt für den Rest der Partie, '
            + 'auch wenn das Haus die Hand wechselt.')));

    dauerZeile(karte, f.wirkung);

    if (!offen) karte.appendChild(B.el('div', 'pr-hinweis pr-hinweis-oben',
      'Diese Amtszeit hat sich bereits festgelegt. Die nächste hat wieder eine Wahl.'));
    else if (!kann) karte.appendChild(B.el('div', 'pr-hinweis pr-hinweis-oben',
      'Über der Kasse: es fehlen ' + geld(preis - B.welt.haus.kasse) + '.'));
    /* Auflage aus ZUSTAENDIGKEIT 13: die staerkste unwiderrufliche Wahl des
       Blattes war die einzige ohne Zahl auf dem Schild — sie trug „ohne
       Ausgabe" und zahlte beim Klick 89.000 DM AUS. Kostet eine Festlegung
       nichts, weil sie Geld hereinbringt, steht jetzt dieses Geld auf dem
       Schild, mit Vorzeichen. Ein Schild ohne Zahl ist kein Preisschild. */
    karte.appendChild(B.knopf({
      text: preis ? 'Festlegen' : (zufluss ? 'Festlegen — Geld herein' : 'Festlegen — ohne Ausgabe'),
      zug: 'preis:festlege:' + f.k,
      preis: preis ? -preis : (zufluss || 0),
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
    var kt = karteText(karte);
    kt.appendChild(B.el('div', 'pr-fest-stempel', 'UNABÄNDERLICH'));
    kt.appendChild(B.el('b', 'pr-fest-name', f.name));
    kt.appendChild(B.el('div', 'pr-regel', f.regel));
    kt.appendChild(B.el('div', 'pr-satz-klein',
      'Festgelegt zu Michaeli ' + g.jahr + ' von ' + g.amtszeit
      + (g.preis ? ' für ' + geld(g.preis) : '') + '. Steht in der Chronik.'));
    karte.appendChild(B.knopf({
      text: 'Steht in der Chronik', zug: 'preis:fest-steht', aus: true,
      titel: 'Eine Festlegung wird nicht zurückgenommen.'
    }));
    return karte;
  }

  /* Der Satz, der die Luecke schliesst — oder ehrlich sagt, dass sie heute
     nicht zu schliessen ist. Er nennt IMMER einen Knopf mit Wortlaut und
     Zahl, nie eine Empfehlung. Was hier nicht steht: „du solltest". Diese
     Tafel bewertet nicht an Stelle des Spielers (siehe Kopf der Datei). */
  function woherSatz(fehlt) {
    var kasten = B.el('div', 'pr-woher');
    var zug = geldZug(fehlt);
    if (zug) {
      kasten.appendChild(B.el('span', 'pr-woher-marke', 'DAS GELD LIEGT AM HOF'));
      var reicht = zug.betrag >= fehlt;
      kasten.appendChild(B.el('span', 'pr-woher-text',
        '„' + zug.name + '" bringt ' + geld(zug.betrag) + ' in die Lade — '
        + (reicht
            ? 'genug für die ' + geld(fehlt) + ', die fehlen.'
            : geld(fehlt - zug.betrag) + ' bleiben dann noch offen.')
        + ' Der Knopf steht auf dem Hof, nicht auf dieser Tafel: '
        + 'oben rechts „Michaelitafel schließen", den Zug tun, Tafel wieder aufschlagen. '
        + 'Michaeli bleibt diese ganze Woche — genommen wird bis zum Wochenwechsel.'));
      return kasten;
    }
    /* Kein Knopf am Schirm bringt heute Geld. Dann steht genau das da. Eine
       erfundene Auskunft waere schlimmer als keine. */
    var rate = null;
    lebendeAngebote().forEach(function (k) {
      var a = angebotVon(k);
      if (!a) return;
      var pl = zahlplan(a);
      if (!pl.raten) return;
      if (!rate || pl.jetzt < rate.jetzt) rate = { a: a, jetzt: pl.jetzt, ganz: pl.ganz, n: pl.raten, rate: pl.rate };
    });
    kasten.appendChild(B.el('span', 'pr-woher-marke', 'HEUTE BRINGT KEIN KNOPF GELD'));
    kasten.appendChild(B.el('span', 'pr-woher-text',
      'Auf diesem Schirm steht kein Zug, der etwas in die Lade legt. '
      + (rate
          ? 'Das billigste, was in Raten geht, ist „' + rate.a.name + '": '
            + geld(rate.jetzt) + ' heute, dann ' + rate.n + ' × ' + geld(rate.rate)
            + ' — auch das ist heute zu teuer. '
          : '')
      + 'Was hier fehlt, kommt aus den Fuhren dieses Braujahres; die Tafel von '
      + (Z.tafelJahr + 1) + ' steht am selben Ort, und was heute nicht genommen wird, '
      + 'bleibt in der Kasse.'));
    return kasten;
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
      var fehlt = billig.preis - Math.max(0, B.welt.haus.kasse);
      var not = B.el('div', 'pr-knapp');
      not.appendChild(B.el('span', 'pr-knapp-marke', 'HEUTE NICHT'));
      not.appendChild(B.el('span', 'pr-knapp-text',
        'Die Kasse reicht für keines dieser Angebote. Das billigste — ' + billig.a.name
        + ' — kostet ' + geld(billig.preis) + ', es fehlen ' + geld(fehlt) + '. '
        + 'Wer nichts nimmt, behält die Kasse für Michaeli ' + (Z.tafelJahr + 1) + '; '
        + 'der Anschlag steigt bis dahin um ' + B.zahl((ep().teuerungJahr - 1) * 100, 1) + ' im Hundert.'));
      /* AUFLAGE R8 — der Satz danach: woher das Geld kommt. Begruendung und
         Messung bei `einnahmeZuege`. */
      not.appendChild(woherSatz(fehlt));
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
    /* AUFLAGE 2 DER WELLE 5 — DIE ZAHL STEHT DORT, WO ENTSCHIEDEN WIRD.
       Sie stand bisher nur auf dem GRIFF, und den zeichnet `zeichneGriff`
       ausschliesslich, wenn die Tafel ZU ist. Am Michaelitag, im Augenblick
       der unwiderruflichen Wahl, war sie nirgends zu lesen. Jetzt steht sie
       ueber der Reihe der Siegelkarten — zwei Handbreit ueber dem Knopf,
       der sie um eins erhoeht. */
    var gz = festlegungenGesamt(), ez = festlegungenEigen();
    var offenJetzt = festlegungenTafel().filter(function (f) {
      var p = festPreis(f); return p === 0 || B.welt.kann(p);
    }).length;
    fkopf.appendChild(B.el('span', 'pr-abschnitt-satz',
      'Eine je Amtszeit. Sie ändert eine Regel für den Rest der Partie und wird nicht zurückgenommen. · '
      + 'Das Haus hat ' + gz + (gz === 1 ? ' Festlegung' : ' Festlegungen')
      + ', ' + ez + ' davon von dieser Tafel · '
      + (!festlegungOffen()
          ? amtszeit().name + ' hat sich festgelegt'
          : (offenJetzt
              ? 'heute ' + offenJetzt + ' zu haben'
              : 'heute reicht die Kasse für keine'))));
    /* AUFLAGE R8, zweiter Ort. Der Kritiker hat in vier Sitzungen und 1.030
       Wochen ZWEI unwiderrufliche Festlegungen getroffen — in 1350 null von
       drei, „weil die billigste 85 Pf kostete bei einer Kasse von 112". Ist
       also das billigste ANGEBOT bezahlbar (dann steht oben kein HEUTE
       NICHT), aber keine FESTLEGUNG, dann fehlt der Satz genau hier. */
    if (reicht && festlegungOffen() && !offenJetzt) {
      var billigFest = null;
      festlegungenTafel().forEach(function (f) {
        var p = festPreis(f);
        if (p > 0 && (!billigFest || p < billigFest.preis)) billigFest = { f: f, preis: p };
      });
      if (billigFest) {
        var luecke = billigFest.preis - Math.max(0, B.welt.haus.kasse);
        var kf = B.el('div', 'pr-knapp pr-knapp-fest');
        kf.appendChild(B.el('span', 'pr-knapp-marke', 'HEUTE KEINE'));
        kf.appendChild(B.el('span', 'pr-knapp-text',
          'Für keine dieser Festlegungen reicht die Kasse. Die billigste — ' + billigFest.f.name
          + ' — kostet ' + geld(billigFest.preis) + ', es fehlen ' + geld(luecke)
          + '. Eine Festlegung, die man nie bezahlen kann, ist keine Festlegung.'));
        kf.appendChild(woherSatz(luecke));
        fkopf.appendChild(kf);
      }
    }
    sp.appendChild(fkopf);

    var freihe = B.el('div', 'pr-reihe pr-reihe-fest');
    if (!festlegungOffen()) {
      freihe.appendChild(festGetroffenKarte());
      /* Was diese Amtszeit nicht mehr waehlen kann, bleibt sichtbar. */
      festlegungenTafel().slice(0, 2).forEach(function (f) { freihe.appendChild(festKarte(f)); });
    } else {
      var l = festlegungenTafel();
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
    /* AUFLAGE 5 — DER VORBEHALT, DEN DIESE SPALTE BRAUCHT.

       Gemessen hat der blinde Kritiker: Mauerbau 1352 angekuendigt 9 Pf,
       gebucht 32 Pf · Landfriedensgeld 1355 angekuendigt 7, gebucht 31 ·
       Zehnt 1361 angekuendigt 13, gebucht 52. Das Drei- bis Vierfache, und
       „eine Vorschau, die um das Vierfache danebenliegt, ist schlimmer als
       keine".

       Die Ursache war zur Haelfte die Bemessung (siehe `pflichtBasis`, jetzt
       behoben — die Umlage folgt nicht mehr dem Unterhalt der eigenen
       Bauten). Die andere Haelfte bleibt und ist nicht wegzurechnen: Umlage
       und Erbfall sind ein Vielfaches der Jahreslast, und die Jahreslast
       eines wachsenden Hauses ist im Jahr der Faelligkeit eine andere als
       heute. Was NICHT bleiben darf, ist eine Zahl ohne Vorbehalt in
       derselben Schrift wie die Rechnung, die wirklich abgebucht wird.
       In der zugeklappten Tafel ist sie 29 von 30 Wochen die einzige Zahl
       ueber kommende Lasten, die der Spieler zu sehen bekommt. */
    if (lasten.some(function (l) { return l.art === 'umlage' || l.art === 'erbfall'; })) {
      f.appendChild(B.el('div', 'pr-satz pr-klein pr-vorbehalt',
        'Umlage und Erbfall sind ein Vielfaches der Jahreslast — hier steht die '
        + 'von heute (' + geld(pflichtBasis()) + ' Anschlag des Rats). Wächst das Haus '
        + 'bis zur Fälligkeit, wächst der Betrag mit.'));
    }
    f.appendChild(B.el('div', 'pr-satz pr-klein', ep().pfand));
    /* DER NOTPFENNIG — die einzige Zahl des Blattes, die nach UNTEN begrenzt,
       und bis heute die einzige, die nirgends am Bildschirm stand: der Spieler
       erfuhr von ihr erst an dem Michaeli, an dem sie griff, und dann als
       Nebensatz in der Chronik.

       WARUM SIE HIER STEHT UND NICHT IN DER RECHNUNGSSPALTE, wo sie
       inhaltlich hingehoerte: die linke Spalte ist voll. Am Bildschirm
       nachgesehen (1600, Tafel aufgeschlagen, 2752x1536) laeuft dort schon
       heute WAS SCHON STEHT unten aus dem Feld, und die vierte Wurzel bricht
       mitten im Wort ab — derselbe Ueberlauf, der am 3. August schon einmal
       gemeldet wurde. Ein zweiter Kasten hat sie vollends ueberlaufen lassen.
       Rechts steht, was faellig wird; der Notpfennig ist, was NICHT faellig
       wird, und er steht als letzte Zeile derselben Liste. Nachgesehen: in
       1600 traegt die Spalte ihn ohne Abschnitt. */
    if (notpfennig() > 0) {
      var bod = B.el('div', 'pr-last pr-last-boden');
      var bkopf = B.el('div', 'pr-last-kopf');
      bkopf.appendChild(B.el('span', 'pr-last-jahr', 'immer'));
      bkopf.appendChild(B.el('span', 'pr-last-name', 'Der Notpfennig — was NICHT genommen wird'));
      bkopf.appendChild(B.el('span', 'pr-zahl', geld(notpfennig())));
      bod.appendChild(bkopf);
      bod.appendChild(B.el('div', 'pr-satz pr-klein',
        'So weit und nicht weiter nimmt der Rat. Liegt zu Michaeli weniger im '
        + 'Kasten, schießt er auf diese Zahl vor — angeschrieben, nicht geschenkt.'));
      f.appendChild(bod);
    }
    sp.appendChild(f);

    sp.appendChild(leiterFeld(Z.leiter.slice(-8), false));

    return sp;
  }

  /* --- DIE LEITER, an zwei Stellen dasselbe --------------------------------
     Eine Zahl ist die Kennzahl der Latte, die andere die eigene Preisleiter.
     Sie standen bis zum 3. August 2026 als EINE Spalte unter EINER
     Ueberschrift da, und die Kopfzeile unten rechts sagte in derselben
     Sekunde etwas anderes. Jetzt stehen beide nebeneinander, jede mit ihrem
     Satz darueber, und die linke ist Ziffer fuer Ziffer die der Kopfzeile.
     ---------------------------------------------------------------------- */
  function leiterFeld(reihen, rolle) {
    var lf = B.el('div', 'pr-feld pr-leiter' + (rolle ? ' pr-leiter-breit' : ''));
    lf.appendChild(B.el(rolle ? 'div' : 'h3', rolle ? 'pr-chronik-kopf' : null,
      'DIE LEITER' + (rolle ? ' — ALLE JAHRE' : '')));
    lf.appendChild(B.el('div', 'pr-satz pr-klein',
      'Links die Kennzahl: Barschaft zu Michaeli gegen den Preis des nächsten '
      + 'sinnvollen Zuges — dieselbe Zahl, die unten rechts am Bildschirm steht, '
      + 'aus derselben Quelle abgelesen. Rechts die eigene Preisleiter: was das '
      + 'billigste Angebot DIESER Tafel am selben Tag kostete. '
      + 'Die rechte Spalte ist keine Kennzahl — diese Tafel liegt an '
      + (B.uhr.WOCHEN_IM_JAHR - 1) + ' von ' + B.uhr.WOCHEN_IM_JAHR + ' Wochen zu, '
      + 'und sie fällt, sobald die billigen Sprossen genommen sind. Das ist keine '
      + 'Verschlechterung, sondern der Grund, warum es Sprossen gibt.'
      + (rolle ? ' Wächst die Kasse schneller als der nächste Zug, ist das Haus fertig.' : '')));

    var kopfz = B.el('div', 'pr-leiter-zeile pr-leiter-kopf');
    ['Jahr', 'Kasse', 'nächster Zug', 'reicht', 'eigene Tafel', 'reicht'].forEach(function (t) {
      kopfz.appendChild(B.el('span', null, t));
    });
    lf.appendChild(kopfz);

    var ziel = lf;
    if (rolle) { ziel = B.el('div', 'pr-leiter-rolle rolle'); lf.appendChild(ziel); }

    reihen.forEach(function (r) {
      var z = B.el('div', 'pr-leiter-zeile');
      z.appendChild(B.el('span', null, r.jahr));
      z.appendChild(B.el('span', null, B.welt.geld(r.kasse, true)));
      var kz = B.el('span', null, r.zugPreis ? B.welt.geld(r.zugPreis, true) : '—');
      if (r.zugWas) kz.title = r.zugWas + (r.zugArt ? ' · ' + r.zugArt : '');
      z.appendChild(kz);
      z.appendChild(B.el('span', 'pr-verh pr-verh-kennzahl',
        r.zugVerh ? B.zahl(r.zugVerh, 2) + '×' : '—'));
      z.appendChild(B.el('span', 'pr-leiter-eigen', B.welt.geld(r.billigst, true)));
      z.appendChild(B.el('span', 'pr-verh pr-leiter-eigen',
        r.verhaeltnis ? B.zahl(r.verhaeltnis, 2) + '×' : '—'));
      ziel.appendChild(z);
    });
    return lf;
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
    /* Wie oft die Wahl wiederkommt, steht als gemessene Zahl da und nicht
       als Versprechen — dieselbe Frist wie auf der Karte. Der blinde
       Kritiker hat gezaehlt, dass eine sorgfaeltig gespielte Partie in
       vierzehn Jahren nur eine oder gar keine Festlegung nimmt, obwohl acht
       Amtszeiten vorbeigehen. Wer nicht weiss, dass die naechste Wahl in
       zwei Jahren wiederkommt, spart auf die falsche. */
    var fristC = amtszeitFrist();
    links.appendChild(B.el('div', 'pr-satz pr-klein',
      (festlegungOffen()
        ? amtszeit().name + ' hat die Festlegung dieser Amtszeit noch vor sich.'
        : amtszeit().name + ' hat sich festgelegt. Die nächste Amtszeit wählt wieder — einmal.')
      + (fristC
          ? ' Bisher wechselte die Hand alle ' + fristC
            + (fristC === 1 ? ' Braujahr' : ' Braujahre') + '; '
            + Z.amtszeiten.length + ' Amtszeiten seit ' + Z.amtszeiten[0].seit + '.'
          : '')));
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
    rechts.appendChild(leiterFeld(Z.leiter.slice().reverse(), true));
    drei.appendChild(rechts);

    w.appendChild(drei);
    return w;
  }

  /* --- Die Tafel -------------------------------------------------------- */
  function zeichneTafel(fach) {
    var e = ep();
    var tafel = B.el('div', 'pr-tafel pr-stil-' + e.stil + (Z.imDom ? '' : ' pr-frisch'));
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

    /* AUFLAGE 2 — auch dieser Knopf traegt die Zahlen. Er ist der einzige
       Chronikknopf, den man am MICHAELITAG sieht: `zeichneGriff` kehrt bei
       aufgeschlagener Tafel vorher zurueck, der Griff mit den Zahlen wird
       dann gar nicht gezeichnet. Bis heute stand hier der blanke Text. */
    kopf.appendChild(B.knopf({
      text: Z.seite === 'chronik' ? 'Zurück zur Tafel' : chronikAufschrift(false),
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

  /* ======================================================================
     AUFLAGE R6 — DIE AUFSCHRIFT WIRD AUS DEM ZUSTAND GERECHNET, IN DEM DER
     KNOPF GEZEICHNET WIRD.  UND DIE 420-MS-FRIST IST FORT.

     Gemessen am Stand vor dieser Welle (`werkbank/schuss/tafel-w13/
     protokoll/vorher-e1.json`, 1350, 308 abgelesene Zustaende, kein einziger
     Reiterklick): der Knopf `preis:tafel` trug in **33 Zustaenden**
     „Michaelitafel schliessen", waehrend keine Tafel auf dem Tisch lag — alle
     30 Wochen des Ladejahres und dazu jeder Jahreswechsel.

     DIE KETTE, UND SIE HAT ZWEI GLIEDER, NICHT EINES:

     (a) `tafelWeggeklappt()` fragte `document.querySelector('.pr-tafel')` —
         IM SELBEN ZEICHENWEG, in dem `B.leere(fach)` genau dieses Element
         eine Zeile vorher entfernt hatte. Die Abfrage konnte nichts finden
         und antwortete darum immer „nicht weggeklappt". Der Griff schrieb
         „schliessen", die Tafel wurde gezeichnet, DIE STADT schnitt sie
         240 ms spaeter wieder weg (`stadt-zugeklappt`, `clip-path:
         inset(50%)`, stil/stadt.css). Stabiler Endzustand: Knopf luegt.

     (b) Die Notbremse dagegen war eine WANDUHRFRIST von 420 ms — genau die
         Stelle, die `spiel/LIESMICH.md` als Verursacher der Bistabilitaet
         vom 7. August benennt. Sie hat nie gegriffen, weil ihre erste Zeile
         `clearTimeout` war: jeder Bildaufbau setzte sie zurueck, und dieses
         Spiel zeichnet oefter als alle 420 ms. Der Wecker, der die Luege
         haette finden sollen, hat kein einziges Mal geklingelt.

     WAS AN IHRE STELLE TRITT, OHNE JEDE UHR: die Klemmenlage wird EINMAL
     JE RUNDE gelesen — VOR `B.leere`, also an dem Element, das die vorige
     Runde hinterlassen hat und das DIE STADT seither beurteilt hat. Danach
     steht `Z.geklemmt` fest, und `zeichne` faellt genau EINE Entscheidung,
     die Griff und Tafel gemeinsam tragen. Ein Knopf und ein Blatt, die aus
     demselben Wert gezeichnet werden, koennen einander nicht widersprechen.

     Warum das ohne Frist reicht: `kern/runde.js` zeichnet nach, sobald sich
     die KLEMMENLAGE geaendert hat („Klemmenwache", `KLEMMEN`-Abdruck) — der
     Rundenschluss zieht also von sich aus genau das nach, wofuer die
     420-ms-Frist gebaut war. Gemessen wird das in `blick.mjs`.
     ====================================================================== */
  function klemmeLesen() {
    var t = document.querySelector('.pr-tafel');
    /* GEFUNDEN BEIM MESSEN VON R7, und es ist ein Fehler fuer sich:
       `.pr-tafel` trug in stil/preis.css ein `animation: pr-auf 220ms` mit
       `from { opacity: 0 }`. Das Fach wird bei JEDEM Bildaufbau geleert und
       neu gefuellt — die Tafel ist also ein NEUES Element je Runde, und die
       Aufblende lief jedes Mal von vorn. Gemessen mit `blick.mjs`: am
       Jahreswechsel 1351/1 stand die Tafel im DOM, war nicht weggeklappt,
       ihr Ausgangsknopf war mit `elementFromPoint` zu treffen — und
       `getComputedStyle(...).opacity` las **0**. Eine Hand, die nach ihrem
       Klick hinsieht, sieht dann ein durchsichtiges Blatt und zaehlt es
       nicht. Die Aufblende laeuft seit dieser Welle nur noch beim ERSTEN
       Bildaufbau nach dem Aufschlagen (Klasse `pr-frisch`), und `Z.imDom`
       ist die Antwort auf die Frage „lag sie in der vorigen Runde schon?".  */
    Z.imDom = !!t;
    /* Steht keine Tafel im DOM, hat diese Runde nichts Neues zu sagen: die
       vorige Entscheidung gilt weiter. Sonst zeichnete jede beliebige Runde
       die Tafel wieder auf, DIE STADT schnitte sie wieder weg, und das Bild
       flackerte im Takt des Rahmens. */
    if (!t) return;
    var weg = t.classList.contains('stadt-zugeklappt')
           || t.classList.contains('stadt-verdeckt');
    Z.geklemmt = weg;
    /* Sie lag wirklich vor dem Spieler. Das ist die Zahl, die R7 abnimmt —
       und der Grund, aus dem die Tafel danach nicht mehr von selbst
       wiederkommt (siehe `michaeliHolen`). */
    if (!weg) Z.gesehen[Z.tafelJahr] = true;
  }

  /* Was WIRKLICH auf dem Tisch liegt — nicht, was Z.offen sich wuenscht.
     Drei Gruende, aus denen die Tafel nicht liegt, und jeder hat seinen
     eigenen Satz am Griff:
       Z.offen        — sie ist weggelegt worden ("Das Jahr beginnen")
       sommerLaeuft() — der Sommerzettel der FUHRE liegt oben und geht vor
       Z.geklemmt     — DIE STADT hat sie in ihren Reiter geklappt          */
  function tafelSichtbar() {
    return !!Z.offen && (!sommerLaeuft() || Z.erzwungen) && !Z.geklemmt;
  }

  /* ======================================================================
     DIE HAND AM SPIEL — EIN HORCHER, ZWEI AUFLAGEN.

     Er liest `ereignis.target` und sonst nichts. Er ruft kein
     `preventDefault`, kein `stopPropagation`, er fasst keinen fremden Knopf
     an und schreibt in kein fremdes DOM. Dasselbe Verfahren benutzt DIE
     FUHRE seit Welle 6 fuer ihren Georgi-Halt (`fuhre.js` weiterHorcher).

     R10 (Entscheidung ③ der Aufsicht) — WER EINEN FREMDEN REITER ANFASST,
     BEKOMMT SEINEN TISCH ZURUECK.
     Gemessen am Jahreswechsel 1601: acht Reiterklicks unter liegendem Blatt,
     achtmal identisch 30 greifbare Zuege — erst der neunte brachte 53. Die
     Reiterleiste gehoert DER STADT und diese Welle oeffnet DIE STADT nicht;
     abgeschaltet werden duerfen die Reiter darum nicht. Also nimmt DIE
     JAHRESTAFEL ihr EIGENES Blatt weg. Der Klick laeuft unveraendert weiter
     an den Reiter, der ihn bekommen soll — er kostet den Spieler nichts und
     tut jetzt, was draufsteht.

     R7, Rueckholung — MICHAELI LAESST SICH NICHT UEBERGEHEN.
     DIE STADT klappt beim Laden JEDES fremde Brett in einen Reiter
     (`stadt.js`: `jetzt - startZeit < LADEZEIT` -> 'zu'); das ist ihre Regel
     und sie ist gut, denn beim Laden will man sein Haus sehen. Fuer die
     Michaelitafel des LADEJAHRES heisst das aber: sie liegt nie, und
     genommen wird nur in Woche 1. Diese Tafel holt sich den Tisch deshalb
     bei der naechsten Handlung des Spielers zurueck — solange Michaeli ist,
     solange sie nicht weggelegt wurde und solange sie in diesem Braujahr
     noch kein einziges Mal wirklich dagelegen hat.

     Das ist keine Gegenwehr gegen den Rahmen, sondern sein eigener Weg: ein
     Brett, das UNMITTELBAR NACH EINEM KLICK neu erscheint, gilt DER STADT
     als vom Spieler geholt und bleibt aufgeschlagen (`handZeit`, HANDFRIST).
     Kein Zeitgeber, keine Frist, keine Klasse an fremdem DOM.

     DER EINE HALT — und warum er genau EINEN Klick im ganzen Spiel kostet.
     WEITER ist der Klick, mit dem der Spieler den Michaelistag verlaesst.
     Solange die Tafel nur deshalb nicht liegt, weil der Rahmen sie beim
     Laden weggeklappt hat, geht dieser eine Druck nicht in die naechste
     Woche, sondern legt die Tafel auf den Tisch — genau wie DIE FUHRE es zu
     Georgi haelt (`fuhre.js` weiterHorcher, ZUSTAENDIGKEIT 23). Er ist auf
     EINMAL JE BRAUJAHR verriegelt (`Z.gehalten`): schlaegt die Tafel danach
     immer noch nicht auf, laeuft der naechste Druck durch. Eine Sackgasse
     kann daraus nicht werden, und sie ist die teuerste Sorte Fehler
     (`fuhre.js`: „ein schwarzes Fenster ohne Knopf darin").

     Warum der Halt ueberhaupt noetig ist: genommen wird nur in Woche 1
     (`nimm()` beginnt mit `if (B.welt.zeit.woche !== 1) return;`). Eine
     Tafel, die erst in Woche 2 kaeme, waere die Vitrine, die das Urteil
     zu Recht verwirft.

     `stopPropagation` haelt hier nur den Knopf des Kerns auf, NICHT den
     Horcher DER STADT: der haengt am selben Knoten (`#buehne`), und
     `stopPropagation` beruehrt Horcher desselben Knotens nicht. Genau das
     ist der Grund, aus dem dieser Horcher an `#buehne` haengt und nicht an
     `document` — DIE STADT muss ihr `handZeit` bekommen, sonst klappt sie
     die eben geholte Tafel sofort wieder weg.
     ====================================================================== */
  var REITER = ['stadt:reiter:', 'stadt:bauhof', 'stadt:ortsmarken', 'stadt:alles-zuklappen'];
  var VERSUCHE = 3;            /* Rueckholungen je Braujahr, Riegel gegen Flackern */

  function istReiter(zug) {
    for (var i = 0; i < REITER.length; i++) if (zug.indexOf(REITER[i]) === 0) return true;
    return false;
  }

  /* Darf sich die Tafel den Tisch zurueckholen? Genau dann, wenn heute
     Michaeli ist, sie nicht weggelegt wurde, kein Sommerzettel oben liegt
     und der Rahmen sie weggeklappt hat. */
  function darfZurueck() {
    if (B.welt.zeit.ende) return false;
    if (B.welt.zeit.woche !== 1) return false;
    if (!Z.offen || !Z.geklemmt || sommerLaeuft()) return false;
    /* `Z.gesehen` steht hier absichtlich NICHT als Bedingung. Es wird aus
       Klassennamen gelesen und kann in der Runde unmittelbar nach dem
       Aufschlagen schon `true` sein, bevor DIE STADT im 240-ms-Takt
       ueberhaupt geurteilt hat — als Riegel waere es ein Rennen. Der Riegel
       ist `Z.offen` (der Spieler hat die Tafel selbst weggelegt) und die
       Zahl der Versuche. */
    return (Z.rueckholung || 0) < VERSUCHE;
  }

  function holeZurueck() {
    Z.rueckholung = (Z.rueckholung || 0) + 1;
    Z.geklemmt = false;
    Z.seite = 'tafel';
    B.sende('zeichne', { grund: 'preis-michaeli-zurueck' });
  }

  function handHorcher(ereignis) {
    var ziel = ereignis && ereignis.target && ereignis.target.closest
      ? ereignis.target.closest('[data-zug]') : null;
    if (!ziel) return;
    var zug = ziel.getAttribute('data-zug') || '';
    if (zug.indexOf('preis:') === 0) return;            /* das eigene Blatt */

    if (istReiter(zug)) {
      if (!tafelSichtbar()) return;
      Z.offen = false;
      Z.erzwungen = false;
      B.ton.spiele('preis:blatt');
      B.sende('zeichne', { grund: 'preis-reiter-fremd' });
      return;
    }

    if (zug === 'weiter') {
      if (ziel.disabled) return;
      if (Z.gehalten === Z.tafelJahr) return;           /* einmal je Braujahr */
      if (!darfZurueck()) return;
      Z.gehalten = Z.tafelJahr;
      ereignis.preventDefault();
      ereignis.stopPropagation();
      B.ton.spiele('preis:blatt');
      holeZurueck();
      return;
    }

    if (darfZurueck()) holeZurueck();
  }

  var horchtSchon = false;
  function horcheAufDieHand() {
    if (horchtSchon || typeof document === 'undefined') return;
    var buehne = document.getElementById('buehne');
    if (!buehne) return;
    horchtSchon = true;
    buehne.addEventListener('click', function (e) {
      B.wage('preis.hand', function () { handHorcher(e); });
    }, true);
  }

  /* --- Der Griff, wenn die Tafel zu ist ---------------------------------

     `sichtbar` wird NICHT hier ausgerechnet, sondern kommt aus derselben
     Entscheidung, aus der `zeichne` gerade die Tafel zeichnet oder nicht
     (R6). Zwei getrennte Aufrufe von `tafelSichtbar()` in einer Runde waeren
     zwei Messungen — und genau daran hing die Luege. */
  function zeichneGriff(fach, sichtbar) {
    var offenZahl = lebendeAngebote().length;
    var michaeliHeute = B.welt.zeit.woche === 1 && Z.offen;
    var wartet = !sichtbar && Z.offen && sommerLaeuft();
    var griff = B.el('div', 'pr-griff');

    griff.appendChild(B.knopf({
      /* Die Aufschrift beschreibt, was in DIESER Runde gezeichnet wird, und
         nichts sonst. Liegt keine Tafel, steht immer Jahr und Zahl da. */
      text: sichtbar
        ? 'Michaelitafel schließen'
        : 'Michaelitafel ' + Z.tafelJahr + ' · ' + offenZahl + ' Angebote'
          + (wartet ? ' — liegt bereit' : (michaeliHeute ? ' — heute ist Michaeli' : '')),
      zug: 'preis:tafel',
      klasse: 'pr-griff-knopf' + (wartet ? ' pr-griff-wartet' : '')
        + (!sichtbar && michaeliHeute ? ' pr-griff-heute' : ''),
      titel: wartet
        ? 'Der Sommerzettel liegt oben. Die Michaelitafel wartet darunter und schlägt auf, sobald er weg ist — oder sofort, auf diesen Klick.'
        : (B.welt.zeit.woche === 1
            ? 'Heute ist Michaeli. Was hier genommen wird, wird heute genommen.'
            : 'Michaeli ist vorüber. Genommen wird zu Michaeli ' + (Z.tafelJahr + 1) + '.'),
      tu: function () {
        if (sichtbar) { Z.offen = false; Z.erzwungen = false; }
        /* Ein Klick ist eine Hand am Brett: DIE STADT laesst aufgeschlagen,
           was der Spieler selbst geholt hat. Also die Merkmarke loeschen. */
        else { Z.offen = true; Z.erzwungen = true; Z.geklemmt = false; }
        Z.seite = 'tafel';
        B.ton.spiele('preis:blatt');
        B.sende('zeichne', { grund: 'preis-griff' });
      }
    }));

    if (sichtbar) { fach.appendChild(griff); return; }

    var stand = B.el('div', 'pr-griff-stand');
    var billig = billigstesAngebot();
    stand.appendChild(zeile('Bierordnung je ' + ep().einheit,
      geld(Math.round(satzJetzt()))));
    stand.appendChild(zeile('Anschlag ' + jahr(), geld(Math.round(Z.anschlag))));
    if (billig) {
      stand.appendChild(zeile('billigstes Angebot dieser Tafel', geld(billig.preis)));
      /* Es steht auch unten rechts am Bildschirm eine Zahl mit einem „×"
         dahinter, und sie meint etwas anderes: dort die Kennzahl der Latte
         (der naechste sinnvolle Zug des ganzen Spiels), hier die eigene
         Preisleiter. Zwei Zahlen, die dasselbe zu sein scheinen und es nicht
         sind, waren der schwerste Einwand gegen dieses Stueck. Also traegt
         diese hier ihren Bezug im Namen und nicht bloss im Satz daneben. */
      var vz = zeile('Kasse : dieses Angebot',
        billig.preis ? B.zahl(B.welt.haus.kasse / billig.preis, 2) + '×' : '—', 'pr-verh');
      vz.title = 'Nur diese Tafel. Die Kennzahl unten rechts misst den nächsten '
        + 'sinnvollen Zug des ganzen Spiels und ist meist eine andere Zahl; '
        + 'beide stehen Jahr für Jahr nebeneinander auf der LEITER.';
      stand.appendChild(vz);
    }
    var naechste = kommendeLasten()[0];
    if (naechste) {
      stand.appendChild(zeile(naechste.jahr + ' · ' + naechste.name, geld(naechste.betrag), 'pr-last-zeile'));
    }
    griff.appendChild(stand);

    griff.appendChild(B.knopf({
      /* DREI ZAHLEN, DREI DINGE, UND JEDE HEISST JETZT, WAS SIE ZAEHLT.

         Der Zaehler las einmal `Object.keys(Z.festGenommen)` — also nur die
         Festlegungen DIESER Tafel — und hiess trotzdem „Chronik des
         Hauses". Nach einem Gegenzug in 1970 steht in `welt.chronik` ein
         Eintrag mit `art='festlegung'`, und der Zaehler daneben blieb auf
         0 (WELLE-3, Kleinkram). Er zaehlt seither die Chronik des ganzen
         Hauses, so wie er heisst.

         DANN ABER STAND DIE ZWEITE ZAHL FALSCH DA, und das ist Auflage 1
         der Welle 5: „N Festlegungen · M von dieser Tafel gebaut", wobei M
         `Object.keys(Z.fertig).length` war — FERTIGE ANGEBOTE. Gemessen:
         „2 Festlegungen · 0 von dieser Tafel gebaut", obwohl beide von
         dieser Tafel kamen. Jetzt zaehlt die zweite Zahl die Festlegungen
         dieser Tafel (`festlegungenEigen`), und die Bauten stehen als
         eigenes Satzglied mit eigenem Wort daneben. */
      text: chronikAufschrift(true),
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
      horcheAufDieHand();
    },

    jahr: function () {
      michaeli(false);
    },

    /* ======================================================================
       AUFLAGE R7, zweiter Teil — EINE TAFEL AUSSERHALB VON MICHAELI IST EINE
       VITRINE UND WIRD WEGGELEGT.

       `nimm()` beginnt mit `if (B.welt.zeit.woche !== 1) return;`, und
       `angebotKarte` schaltet den Knopf dann auf „Michaeli ist vorüber" und
       `aus`. Bis zu dieser Welle blieb `Z.offen` trotzdem das ganze Braujahr
       stehen: wer die Tafel in Woche 1 nicht weglegte, sah bis Woche 30 ein
       formatfuellendes Blatt mit fuenf abgeschalteten Knoepfen. Genau das
       nennt das Urteil eine Vitrine. Michaeli ist ein TAG, nicht ein Jahr —
       also geht die Tafel mit dem Tag.
       ====================================================================== */
    woche: function (d) {
      if (d && d.woche !== 1 && Z.offen) {
        Z.offen = false;
        Z.erzwungen = false;
      }
    },

    epoche: function () {
      richteEin(false);
    },

    erbfall: function () {
      Z.handlohnFaellig = true;
      merkeAmtszeit();
      chronik('erbfall', amtszeit().name + ' übernimmt das Haus'
        + (amtszeitFrist() ? ' — die vorige hielt ' + amtszeitFrist()
            + (amtszeitFrist() === 1 ? ' Braujahr.' : ' Braujahre.') : '.'));
    },

    zeichne: function () {
      /* ZUERST LESEN, DANN LEEREN, DANN EINMAL ENTSCHEIDEN.
         Die Reihenfolge dieser drei Zeilen ist der ganze Inhalt von R6:
         `klemmeLesen` sieht das Element der VORIGEN Runde, ueber das DIE
         STADT inzwischen befunden hat; `B.leere` raeumt es weg; `sichtbar`
         faellt einmal und traegt Griff und Tafel gemeinsam. */
      klemmeLesen();
      var fach = B.ebene('blatt', 'preis');
      B.leere(fach);

      var sichtbar = tafelSichtbar();
      zeichneGriff(fach, sichtbar);
      if (sichtbar) zeichneTafel(fach);

      meldeZug();

      /* Einen Bildaufbau spaeter steht der naechste Zug fest — dann, und nur
         dann, traegt DIE LEITER die Kennzahl des Jahres ein. Begruendung bei
         `fuelleKennzahl`. */
      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(function () { B.wage('preis.kennzahl', fuelleKennzahl); });
      }
    }
  });

  /* Fuer die Konsole des Kritikers: BRAUHAUS.preis.lage() — nur lesen.
     Ohne diesen Griff laesst sich am Bildschirm nicht nachpruefen, WORAUS
     ein Anschlag entstanden ist; DER GEGNER hat denselben unter
     BRAUHAUS.gegner.lage(). Er aendert nichts und wird von nichts benutzt. */
  B.preis = {
    lage: function () { return Z; },
    anschlag: function () { return Z.anschlag; },
    leiter: function () { return Z.leiter.slice(); },
    /* DIE TAXE, aufgeschluesselt — der Griff, der beim Urteil der Welle 5
       gefehlt hat. Der Kritiker konnte „jede Festlegungskarte ist disabled"
       am Bildschirm zaehlen, aber nicht sagen, WIE WEIT sie danebenliegt;
       dafuer musste er die Taxe von Hand nachrechnen. Sie steht jetzt da:
       je Karte die Taxe, die Kasse, der Abstand und die Latte, an der
       `festKarte` entscheidet. Nur gelesen, von nichts benutzt. */
    taxe: function () {
      return {
        jahr: jahr(),
        kasse: Math.round(B.welt.haus.kasse),
        jahreslast: Math.round(pflichtSumme()),
        basis: Math.round(festBasis()),
        offen: festlegungOffen(),
        karten: (ep().festlegungen || []).map(function (f) {
          var p = festPreis(f);
          return {
            k: f.k, anteil: f.anteil || 0, ab: f.ab || null,
            preis: p,
            zufluss: (f.wirkung && f.wirkung.einmal)
              ? rundePreis(f.wirkung.einmal * pflichtSumme()) : 0,
            genommen: !!Z.festGenommen[f.k],
            aufTafel: !(f.ab && jahr() < f.ab) && !Z.festGenommen[f.k],
            bezahlbar: p === 0 || B.welt.kann(p)
          };
        })
      };
    }
  };

  /* ----------------------------------------------------------------------
     EPOCHENWECHSEL — neue Listen, neuer Anschlag, dieselbe Chronik.
     ---------------------------------------------------------------------- */
  function richteEin(erste) {
    var e = ep();
    Z.epoche = B.welt.zeit.epoche;
    Z.startjahr = jahr();
    Z.kaeufe = 0;
    merkeAmtszeit();
    Z.hoehe = Math.max(B.welt.haus.kasse, 1);
    /* DAS HAUS HAT NICHT HEUTE ANGEFANGEN.

       Bis zum 2. August 2026 stand der Ausstoss des ersten Jahres auf NULL,
       weil noch kein Braujahr protokolliert war. Der Anschlag des ersten
       Michaeli bestand damit allein aus der Barschaft und lag in jeder Epoche
       am Mindestansatz — und genau deshalb ist die Kennzahl der zweiten Latte
       in JEDER Epoche im ersten Jahr am hoechsten und faellt danach: gemessen
       3,39 / 3,56 / 5,09 / 4,30 im Eroeffnungsjahr gegen ein Band von 1,8 bis
       2,9 in allen folgenden. Ein Drittel des gemessenen Gefaelles ist dieser
       eine Punkt, und er ist ein Rechenartefakt, kein Zug.

       Er ist auch sachlich falsch. Das Haus zum Anker steht seit
       Generationen; der Boettcher, der Grutherr und der Rat kennen seinen
       Ausstoss. `umsatzAnfang` ist, was das Haus unter der vorigen Hand
       durchgesetzt hat — die Zahl, mit der es angeschlagen wird, bevor es
       selbst ein Jahr gebraut hat. In die Reihe des Steuerausschusses geht
       sie nicht ein (siehe `michaeli`, Schritt 11): veranlagt wird die Hand,
       die jetzt braut. */
    Z.umsatz = erste ? (ep().umsatzAnfang || 0) : messeUmsatz(jahr() - 1);
    /* Eine neue Zeit rechnet neu: die Nahrung der vorigen Epoche steht in
       einer anderen Waehrung und darf nicht angeschlagen werden. Das gilt
       auch fuer die Reihe, aus der der Dreijahresschnitt kommt — Gulden
       gehen nicht in einen Durchschnitt mit Mark. */
    Z.ertrag = 0;
    Z.umsatzReihe = [];
    Z.ertragReihe = [];
    Z.kasseMichaeli = null;
    Z.nachlass = false;
    Z.nachlassBetrag = 0;
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
