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
    ertrag: 'nach dem, was die letzten drei Jahre übrig ließen'
  };

  function pflichtSumme() {
    var s = 0;
    pflichtenJetzt().forEach(function (p) { s += p.betrag; });
    return s;
  }

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
    return rundePreis(ep().umlageAnteil * teil * pflichtSumme() * (Z.umlageHalb ? 0.5 : 1));
  }

  function handlohnBetrag() {
    return rundePreis(ep().handlohnAnteil * pflichtSumme() * (Z.handlohnHalb ? 0.5 : 1));
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
    Z.gestundet = 0;
    Z.tafelJahr = jahr();

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
    var kasseJetzt = Math.round(B.welt.haus.kasse);
    Z.ertrag = (erste || Z.kasseMichaeli === null) ? 0 : (kasseJetzt - Z.kasseMichaeli);
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
        var z = zeile(p.name, geld(-p.betrag), 'pr-pflicht pr-wurzel-' + p.art);
        z.appendChild(B.el('span', 'pr-wurzel', WURZEL[p.art] || WURZEL.menge));
        kasten.appendChild(z);
      });
      kasten.appendChild(zeile('Zusammen im Jahr', geld(-pflichtSumme()), 'pr-summe'));
      kasten.appendChild(B.el('div', 'pr-satz pr-klein',
        'Drei Wurzeln: was weiterläuft, wenn die Pfanne kalt bleibt · was am Ausstoß hängt · '
        + 'was der Rat nach der Nahrung des Jahres veranlagt. Keine hängt an der Kasse.'));
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
    ord.appendChild(zeile('vom Rat gesetzt ' + o.ab, geld(o.preis), 'pr-satzteil'));
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
      + (satzFolgt()
          ? 'Zwischen den Stufen setzt der Rat nach dem Korn nach, aber nicht ganz. '
          : 'Zwischen den Stufen rührt hier niemand den Satz an. ')
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
      'Preis dieser Amtszeit: '
      + (preis ? geld(preis) : (zufluss ? geld(zufluss) + ' kommen herein' : 'keine Ausgabe'))
      + (amtszeit().bis ? ' · ' + amtszeit().name + ' führt das Haus bis ' + amtszeit().bis + '.'
                        : '')));

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
    rechts.appendChild(leiterFeld(Z.leiter.slice().reverse(), true));
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
      /* ZWEI ZAHLEN, DIE VERSCHIEDENES ZAEHLEN, UND DAS STEHT JETZT DRAN.

         Der Zaehler las `Object.keys(Z.festGenommen)` — also nur die
         Festlegungen DIESER Tafel — und hiess trotzdem „Chronik des
         Hauses". Nach einem Gegenzug in 1970 steht in `welt.chronik` ein
         Eintrag mit `art='festlegung'`, und der Zaehler daneben blieb auf
         0: die Zahl war da, der Zaehler las sie nicht (WELLE-3,
         Kleinkram). Er zaehlt jetzt die Chronik des Hauses, so wie er
         heisst — alle vier Stuecke.

         Die zweite Zahl bleibt bewusst eng und heisst jetzt auch so: „von
         dieser Tafel gebaut". Sie ist der Beleg dafuer, ob DER PREIS
         ueberhaupt stattgefunden hat, und den darf ein weiter gefasster
         Zaehler nicht zudecken. */
      text: 'Chronik des Hauses · ' + festlegungenGesamt() + ' Festlegungen · '
            + Object.keys(Z.fertig).length + ' von dieser Tafel gebaut',
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

      meldeZug();

      /* Einen Bildaufbau spaeter steht der naechste Zug fest — dann, und nur
         dann, traegt DIE LEITER die Kennzahl des Jahres ein. Begruendung bei
         `fuelleKennzahl`. */
      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(function () { B.wage('preis.kennzahl', fuelleKennzahl); });
      }
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
