/* ===========================================================================
   stuecke/fuhre.js — DIE FUHRE.
   Die Woche, die man dreissigmal im Braujahr bedient, und die Knappheit,
   die nie Geld ist.

   DER TAKT
     1. Der Sud faellt von selbst, nach der Anschlagtafel. Man stellt ihn ein,
        man spielt ihn nicht.
     2. Die Faesser landen abzaehlbar im Keller, jedes mit Sorte und Braudatum.
     3. Der Wagen hat wenige Plaetze. Jedes Fass bekommt ein Haus.
     4. Fuhre abschicken = die Woche ist vorbei.
     5. Wer nicht beliefert wird, dessen Reihe faellt — drei Jahre lang, dann
        ist die Adresse weg, ohne dass jemand sie genommen hat.
     6. Zu Georgi wird die Tafel gewischt. Der Aprilbestand ist der ganze
        Sommer, und der laeuft ohne Hand ab.

   WAS HIER NIE PASSIERT
     Kein Schieberegler. Eine Sorte belegt Brautage und Fassplaetze, nicht
     bloss eine Reichweite — sonst waere Exportbier immer die Antwort.

   UND: DIE KASSE IST NIE DIE WAND
     Ein Brauhaus mit leerer Kasse hoert nicht auf zu brauen — es braut
     schlechter. Drei Wege stehen offen, alle drei historisch, keiner davon
     Geld:
       · DER NOTSUD. Der zweite Guss auf dieselben Treber: null Barauslage,
         null Rohstoff, kein Tag der Jahresverleihung — nur die Pfanne.
         Wenig Fass, zwei Wochen haltbar, unterste Stufe. Die Pfanne steht
         nie kalt, weil kein Geld da ist. Faellt der geplante Sud an der
         Kasse, setzt der Braumeister von selbst den Notsud an.
       · DAS KERBHOLZ. Der Spieler darf anschreiben lassen, in ganzen
         Kerben. Zu Georgi wird geloescht; was offen bleibt, nimmt sich der
         Glaeubiger in Brautagen, Suden der Reihe, Eis oder Regalmetern.
         Schulden kosten hier also die knappe Sache, nicht Zins.
       · DER RUECKVERKAUF. Grut, Hopfen, Kontrakt gehen zum Bruchteil an den
         Haendler zurueck. Bar auf die Hand, und die Kammer ist leer.
     Das Ende dieses Hauses ist deshalb nie die leere Kasse, sondern das
     leere Auftragsbuch: wenn keine Adresse der Stadt mehr Bier des Hauses
     fuehrt, ist es vorbei.

   UND DIESES ENDE WIRD VOLLZOGEN, NICHT BLOSS HINGESCHRIEBEN
     Ein Satz, der das Ende erklaert, waehrend WEITER ewig weiterlaeuft, ist
     kein Ende, sondern derselbe eingefrorene Zustand eine Ebene hoeher.
     Also gibt es beides — den Weg zurueck und die Frist:

       · DAS PROBEFASS. Jede aufgegebene Adresse behaelt einen Knopf. Ein
         Fass ohne Rechnung an den Wirt kostet keinen Pfennig; es kostet ein
         reifes Fass, einen Platz auf dem Wagen und einen der wenigen Halte
         der Woche — also genau die knappe Sache dieser Epoche. Vier
         ueberzeugende Faesser holen eine Adresse zurueck, sechs, wenn der
         Gegner sie schon gebunden hat. Ein Notsud ueberzeugt halb: er
         zaehlt einfach, nicht doppelt. Damit ist der Weg zurueck IMMER
         offen, auch mit leerer Kasse — die Pfanne steht ja nie kalt.
       · DER NEUE WIRT. Zu Georgi kann eine lange aufgegebene Adresse von
         selbst wieder anfragen. Das geschieht ohne den Spieler, und nur
         solange das Haus ueberhaupt noch liefert.
       · DIE FRIST. Nimmt keine einzige Adresse mehr ab, laeuft eine Uhr:
         zwoelf Wochen (1970: acht). Sie steht still in jeder Woche, in der
         ein Fass auf Probe hinausgeht — wer es versucht, verliert nicht.

   UND DAS ENDE IST VIERMAL EIN ANDERES (siehe DER AUSGANG)
     Ab der halben Frist steht DER ANTRAG der Epoche im Bild: zwei Knoepfe
     untereinander, einer mit Preisschild, beide unwiderruflich. Wer annimmt,
     hoert an diesem Tag auf und hat das Geld — die Pfanne zurueckgegeben
     (1350), die Gerechtigkeit verkauft (1600), an die Aktienbrauerei
     verkauft (1884), die Marke verkauft (1970). Wer ausschlaegt, bekommt den
     Untergang seiner Epoche, und der zahlt weniger oder nichts: Braurecht
     entzogen, aus der Reihe gestrichen, von der Bank verwertet, stillgelegt.
     Dazu DIE UEBERGABE — das einzige Ende, nach dem am naechsten Morgen
     wieder Feuer unter der Pfanne brennt. Sie wird angeboten, nicht
     verhaengt, und nur einem Haus, das steht.
     Angehalten wird die Uhr nie von diesem Stueck selbst, sondern mit
     `B.uhr.beende(grund)` (ZUSTAENDIGKEIT 12). Danach malt dieses Stueck
     DAS URTEIL — fuer jeden Grund, auch fuer die, die andere Stuecke
     ausloesen; die uebrigen Schlussblaetter sind Beiblaetter.
     Das Nachspiel gehoert spaeter DEM ERBE.

   BESITZSTAND: stuecke/fuhre*.js · stil/fuhre*.css · bild/fuhre/** · ton/fuhre/**
   =========================================================================== */

(function (B) {
  'use strict';

  var D = window.FUHRE_DATEN;

  /* ----------------------------------------------------------------------
     ZUSTAND DES STUECKS. Alles, was welt.js nicht kennt, wohnt hier.
     ---------------------------------------------------------------------- */
  var Z = {
    epoche: 0,
    plan: {},            /* sortenschluessel -> Sude je Woche               */
    budget: 0,           /* Brautage (1350) bzw. Sude der Reihe (1600)      */
    sudeJeWoche: 0,
    faesser: 0,          /* eigene Faesser insgesamt — die Fassplaetze      */
    umlauf: [],          /* [{faellig, n}] Faesser beim Wirt                */
    draussen: 0,
    eis: 0, eisKeller: 0,
    fracht: 'stueck',
    halte: 0,
    bann: {},            /* adr -> Jahr des Bannbriefs                      */
    listung: {},         /* adr -> {sorte: true}                            */
    listungLeer: {},     /* adr -> Jahre ohne Lieferung trotz Listung        */
    durst: {},           /* adr -> Fass, die das Haus jetzt will            */
    leer: {},            /* adr -> Wochen ohne Lieferung                    */
    mahnung: {},         /* adr -> 0..3 magere Jahre in Folge               */
    verloren: {},        /* adr -> {jahr, fremd}                            */
    fremdBeiMahnung: {}, /* stand der Gegner schon da, als es anfing?       */
    ladung: [],          /* [{adr, faesser:[]}] — der beladene Wagen        */
    vorige: null,        /* Verteilung der letzten Fuhre                    */
    zettel: null,
    sommer: null,
    sommerOffen: false,
    /* WELLE 11 — DIE TAFEL IST EIN ANSCHLAG, DER BERICHT LIEGT DAHINTER.
       Die Georgi-Tafel deckte 1596x847 bis 1596x943 Bildpunkte (1,35 bis
       1,50 Mio px^2) und war damit allein der Grund, warum das Spiel nach
       dreissig Wochen 45 bis 53 Prozent der Flaeche deckte. Sie traegt
       zweierlei: EINE Entscheidung (was wird gebraut) und einen
       Rechenschaftsbericht ueber den Sommer. Das Erste muss liegen, das
       Zweite muss erreichbar sein — und das ist nicht dasselbe.
       `berichtOffen` ist der Schalter dazwischen; er faellt bei jedem
       Georgi auf `false` zurueck, damit der Bericht eine Entscheidung des
       Spielers bleibt und keine Gewohnheit des Blatts. */
    berichtOffen: false,
    kaufNr: {},
    bannNr: 0,
    eisGemeldet: false,
    unterhaltExtra: 0,
    verladen: 0,         /* Fass, die dieses Braujahr wirklich hinausgingen */
    verladenVorjahr: 0,
    sudeWoche: 0,        /* bezahlte Sude dieser Woche — Treber und Lohn    */
    lohnWoche: 0,        /* was davon an die Saisonkraefte ging             */
    jahrUmsatz: 0,
    fuhren: 0,
    meldung: null,
    sudMeldung: null,
    tafelGewischt: false,
    kerben: 0,           /* offene Kerben auf dem Kerbholz                  */
    kerbAbzug: 0,        /* was der Glaeubiger dem neuen Jahr abgenommen hat */
    kerbGeorgi: null,    /* Abrechnung fuers Georgi-Blatt                    */
    notsud: 0,           /* Notsude DIESER Woche, vom Braumeister gesetzt    */
    notGesamt: 0,        /* Notsude im laufenden Braujahr                    */
    notGemeldet: false,

    /* DAS ZIEL — der Zahltag, und warum er auf Michaeli liegt              */
    ziel: 'ziel',        /* Schluessel der Zahlungsweise dieses Braujahres   */
    zielJahr: 0,         /* in welchem Braujahr sie verabredet wurde         */
    ausstand: {},        /* adr -> was der Wirt dem Haus schuldet            */
    vorschuss: {},       /* adr -> was das Haus dem Wirt in Bier schuldet    */
    zahltag: null,       /* Abrechnung des Umgangs, fuers Georgi-Blatt       */
    abgabeJahr: 0,       /* was der Rat in diesem Braujahr laufend nahm      */
    georgiEin: 0,        /* was die Woche vor Michaeli eingebracht hat       */
    georgiAus: 0,        /* und was sie gefordert hat — nie mehr als das     */
    planVorjahr: null,   /* was voriges Jahr an der Tafel stand              */

    /* DER WEG ZURUECK UND DAS ENDE */
    probe: {},           /* adr -> {zutrauen, jahr, gaben}                   */
    probeGesamt: 0,      /* verschenkte Faesser, ueber die ganze Partie      */
    probeDieseWoche: 0,  /* Faesser auf Probe, die DIESE Woche hinausgingen  */
    zurueckGeholt: [],   /* [{name, jahr, wie}] fuers Schlussblatt           */
    frist: null,         /* Wochen, die dem leeren Auftragsbuch bleiben      */
    geschlecht: [],      /* die Generationenzeile, fuers Schlussblatt        */
    startJahr: 0,
    epocheJahr: 0,       /* erstes Jahr dieser Epoche — fuer die Schere    */
    schluss: null,
    schlussOffen: false,

    /* DIE AUSGAENGE (siehe DER AUSGANG weiter unten)                       */
    antrag: null,        /* {summe, seit} — der Antrag steht im Bild        */
    antragErledigt: false, /* angenommen ODER ausgeschlagen: kommt nie wieder */
    ausgang: null,       /* {art, summe, wer, kopf, urteil, folge}          */
    uebergabe: null,     /* {jahr, erbe} — das Blatt liegt auf              */
    uebergabeNein: 0,    /* Braujahr, in dem sie zuletzt abgelehnt wurde    */
    uebergabeZu: false,  /* Blatt weggelegt — das ANGEBOT liegt weiter      */

    /* DIE WOCHE (Welle 13, R13). `letzterPlan` ist der Fuhrplan, den der
       Sprung weiterfaehrt; `sprungBericht` das, was er erzaehlt hat. */
    letzterPlan: 'durst',
    sprungBericht: null
  };

  /* Wie viele ueberzeugende Faesser eine Adresse zurueckholen. Ein Fass, das
     der Wirt gewoehnlich gar nicht fuehrt, zaehlt halb — deshalb steht hier
     eine gerade Zahl. */
  var PROBE_ZIEL = 4;
  var PROBE_ZIEL_FREMD = 6;   /* wenn der Gegner die Adresse schon hat */

  /* ----------------------------------------------------------------------
     KLEINES HANDWERK
     ---------------------------------------------------------------------- */
  function ep() { return D.epochen[B.welt.zeit.epoche] || D.epochen[1]; }

  /* ----------------------------------------------------------------------
     DIE SCHERE — laufende Kosten gegen einen Preis, den ein anderer setzt.

     `preis-daten.js` schreibt sie in seinen eigenen Kopf: „Die Bierordnung
     steigt in JAHRZEHNTEN um ein Zehntel, der Anschlag um vier Hundertstel
     im JAHR." Gerechnet wurde sie bisher nur auf der Michaelitafel — auf die
     Abgaben und auf die Preise der Angebote. Korn, Grut, Hopfen, Lohn und
     Fuhrlohn standen 1350 wie 1355 auf dem Pfennig gleich, waehrend der Rat
     den Bierpfennig einundvierzig Jahre lang nicht anruehrte. Damit war die
     einzige Bewegung im laufenden Betrieb der Gewinn, und er lief in eine
     Richtung davon (gemessen: rho +0,714 in 1350).

     Die Schere gehoert dorthin, wo sie historisch sass: zwischen die
     Einkaufsseite und einen festgesetzten Verkaufspreis. Jede Epoche hat
     ihre eigene Richtung, und eine davon zeigt nach unten:

       1350  +2,8 % im Jahr — Korn und Lohn steigen, der Bierpfennig steht.
       1600  +1,2 % im Jahr — die Bierordnung wird mehrmals erneuert.
       1884  −0,6 % im Jahr — von 1873 bis 1896 fallen die Preise; billige
             Ueberseegerste, Kohle und Fracht werden Jahr um Jahr wohlfeiler.
       1970  +2,0 % im Jahr — Tarif und Energie ziehen an, der Listenpreis
             folgt langsamer als die Kosten.

     Nach dreissig Jahren steht sie still: was danach kommt, ist eine neue
     Ordnung und keine Teuerung mehr. */
  function laufTeuerung() {
    var t = ep().teuerungLauf;
    if (!t || t === 1) return 1;
    return Math.pow(t, B.grenze(B.welt.zeit.jahr - (Z.epocheJahr || B.welt.zeit.jahr), 0, 30));
  }
  function laufPreis(n) { return Math.max(0, Math.round(n * laufTeuerung())); }
  function sorten() { return ep().sorten; }
  function art(a) { return D.arten[a.art] || D.arten.wirtshaus; }
  function kurz(a) { return D.kurz[a.schluessel] || a.schluessel.slice(0, 3).toUpperCase(); }

  function sorteVon(k) {
    var l = sorten();
    for (var i = 0; i < l.length; i++) if (l[i].k === k) return l[i];
    return null;
  }

  /* Ein Fass aus einer frueheren Epoche behaelt seine Stufe, nicht seinen
     Namen. So ueberlebt der Keller einen Epochenwechsel. */
  function sorteFass(f) {
    return sorteVon(f.k) || (function () {
      var l = sorten();
      for (var i = 0; i < l.length; i++) if (l[i].stufe === (f.stufe || 2)) return l[i];
      return l[1] || l[0];
    }());
  }

  function budgetFeld() { return ep().budget ? ep().budget.feld : null; }

  /* Was ein Sud der JAHRESVERLEIHUNG kostet — Brautage beim Rat, Sude bei der
     Zunft. Der Notsud kostet sie NICHT: Nachbier ist im Buch des Rats kein
     Bier. Genau daran haengt, dass eine leere Kasse die Pfanne nie kalt
     stellt. */
  function budgetKosten(s) {
    if (s && s.not) return 0;
    var f = budgetFeld();
    return f ? (s[f] || 1) : 0;
  }

  /* Was ein Sud DIE WOCHE kostet: die Pfanne steht denselben Tag am Feuer,
     ob Grutbier oder Kofent. Das ist die Schranke, die auch fuer den Notsud
     gilt — sonst waere er unbegrenzt und damit die Antwort auf alles. */
  function pfannenKosten(s) {
    var f = budgetFeld();
    return f ? (s[f] || 1) : 1;
  }

  /* Der Notsud dieser Epoche: Kofent · Nachbier · Einfachbier · Handelsmarke */
  function notSorte() {
    var l = sorten();
    for (var i = 0; i < l.length; i++) if (l[i].not) return l[i];
    return null;
  }
  function echteSorten() {
    return sorten().filter(function (s) { return !s.not; });
  }

  /* ----------------------------------------------------------------------
     DAS KERBHOLZ — anschreiben lassen
     Der Glaeubiger schneidet ganze Kerben und zahlt sie aus. Was zu Georgi
     offen bleibt, nimmt er sich in der knappen Sache dieser Zeit. Deshalb
     ist eine Schuld hier kein Geldproblem, sondern ein Verlust an Brautagen,
     Suden der Reihe, Eis oder Regalmetern.
     ---------------------------------------------------------------------- */
  function kerbholz() { return ep().kerbholz || null; }
  function kerbFrei() {
    var kh = kerbholz();
    return kh ? Math.max(0, kh.kerben - Z.kerben) : 0;
  }
  function kerbDeckung() {
    var kh = kerbholz();
    return kh ? kerbFrei() * kh.jeKerbe : 0;
  }
  /* Wie viele Kerben ein Betrag braucht, den die Kasse nicht traegt. */
  function kerbenFuer(betrag) {
    var kh = kerbholz();
    if (!kh || B.welt.kann(betrag)) return 0;
    var fehlt = betrag - Math.max(0, B.welt.haus.kasse);
    return Math.ceil(fehlt / kh.jeKerbe);
  }
  function kannBezahlen(betrag) {
    if (B.welt.kann(betrag)) return true;
    var n = kerbenFuer(betrag);
    return !!n && n <= kerbFrei();
  }
  /* Der einzige Weg, in diesem Stueck etwas zu bezahlen. Reicht die Kasse
     nicht, laesst das Haus anschreiben — solange Kerben frei sind. */
  function zahleOderKerbe(betrag, was) {
    if (B.welt.kann(betrag)) return B.welt.zahle(betrag, was, 'spieler');
    var kh = kerbholz();
    if (!kh) return false;
    var n = kerbenFuer(betrag);
    if (!n || n > kerbFrei()) return false;
    Z.kerben += n;
    B.welt.nimm(n * kh.jeKerbe,
      kh.kurz + ': ' + n + (n === 1 ? ' Kerbe' : ' Kerben') + ' geschnitten', 'spieler');
    B.ton.spiele('fuhre:kerbe', { ort: 'hof', laut: 0.5 });
    return B.welt.zahle(betrag, was, 'spieler');
  }
  /* Was am Knopf steht, wenn er auf Kerbe geht — der Preis bleibt sichtbar,
     die Waehrung wechselt. */
  function kerbZusatz(betrag) {
    var n = kerbenFuer(betrag);
    if (!n || n > kerbFrei()) return '';
    return ' · auf ' + n + (n === 1 ? ' Kerbe' : ' Kerben');
  }
  function kerbTitel(betrag) {
    var kh = kerbholz(), n = kerbenFuer(betrag);
    if (!kh || !n) return '';
    if (n > kerbFrei()) {
      return ' ' + kh.name + ': nur noch ' + kerbFrei() + ' von ' + kh.kerben
        + ' Kerben frei — das reicht nicht.';
    }
    return ' Die Kasse reicht nicht: das geht auf ' + n + (n === 1 ? ' Kerbe' : ' Kerben')
      + ' beim ' + kh.name + '. ' + kh.pfand.sagt;
  }
  function loeseKerbe() {
    var kh = kerbholz();
    if (!kh || !Z.kerben) return;
    if (!B.welt.zahle(kh.jeKerbe, 'Eine Kerbe gelöscht · ' + kh.name, 'spieler')) {
      Z.meldung = 'Eine Kerbe zu löschen kostet ' + B.welt.geld(kh.jeKerbe) + '.';
      B.sende('zeichne', { grund: 'fuhre-kerbe' });
      return;
    }
    Z.kerben -= 1;
    B.ton.spiele('fuhre:kerbe', { ort: 'hof', laut: 0.35 });
    B.sende('zeichne', { grund: 'fuhre-kerbe' });
  }

  /* Der dritte Weg: Rohstoff zurueck an den Haendler. Bar auf die Hand,
     zum Bruchteil des Einkaufs — und die Kammer ist danach leer. */
  function verkaufeRohstoff(def) {
    if (!def || !def.rueck) return;
    if (B.welt.haus.rohstoff < def.menge) return;
    var erloes = Math.max(1, Math.round(def.basis * def.rueck));
    B.welt.haus.rohstoff -= def.menge;
    B.welt.nimm(erloes, (def.rtext || 'Rohstoff zurück').split(' ·')[0]
      + ' · ' + def.menge + ' ' + (B.welt.epoche().rohstoff || 'Rohstoff'), 'spieler');
    Z.meldung = def.menge + ' ' + (B.welt.epoche().rohstoff || 'Rohstoff')
      + ' zurück an den Händler — ' + B.welt.geld(erloes) + ' bar, '
      + B.welt.geld(def.basis) + ' hat es gekostet.';
    B.ton.spiele('fuhre:kauf', { ort: 'hof' });
    B.sende('zeichne', { grund: 'fuhre-rueckverkauf' });
  }

  /* ======================================================================
     DAS ZIEL — WARUM DER ZAHLTAG AUF MICHAELI LIEGT
     (Auflage der Aufsicht, ZUSTAENDIGKEIT 17)

     Ein Wirt zahlt nicht am Tor. Er laesst anschreiben, und am Zinstag geht
     der Knecht mit dem Kerbholz die Runde. Michaeli IST dieser Tag — der
     Termin liegt nicht zufaellig dort, wo das Haus etwas kaufen soll,
     sondern weil an ihm gerechnet wird. Bisher zahlte in diesem Stueck
     jeder Wirt bar an der Kellertuer; damit stand das Geld immer im Januar
     und nie am 29. September, und die Michaelitafel war beschriftet,
     gesiegelt und unbezahlbar (STAND.md §2).

     Drei Groessen, und keine davon ist ein Regler:
       · bar     — was der Wirt bei der Lieferung hinlegt
       · Ziel    — was bis Michaeli im Holz steht und dort eingesammelt wird
       · Ausfall — was am Zahltag nicht mehr einzutreiben ist

     Und ein Gegengewicht, das die Wahl zu einer Wahl macht: wer bar zahlen
     muss, bestellt weniger (`durst`). Bar ist sicher und klein, Borg ist
     gross und haengt an einem einzigen Tag.

     Das Angeld ist die zweite Haelfte desselben Gedankens und der Grund,
     warum auch ein schlechtes Jahr am Michaelitag Geld in der Lade hat: wer
     im Winter beliefert werden will, legt im Herbst etwas an. Es ist kein
     Geschenk — es wird abgetrunken (Z.vorschuss) und mindert die Barzahlung
     der naechsten Lieferungen. Es schafft kein Geld, es verschiebt es
     dorthin, wo der Kalender es braucht.
     ====================================================================== */
  function zielDef() { return ep().ziel || null; }

  function zielStufen() {
    var z = zielDef();
    return z && z.stufen ? z.stufen : [];
  }

  function zielStufe() {
    var l = zielStufen();
    for (var i = 0; i < l.length; i++) if (l[i].k === Z.ziel) return l[i];
    return l[1] || l[0] || null;
  }

  /* Verabredet wird zu Michaeli und dann ein Jahr lang nicht mehr: eine
     Zahlungsweise ist ein Wort unter Kaufleuten, kein Schalter. Die Frist
     ist der Martinitag — sechs Wochen nach Michaeli. */
  var ZIEL_FRIST = 7;
  function zielOffen() {
    return B.welt.zeit.woche <= ZIEL_FRIST && !B.welt.zeit.ende;
  }

  function setzeZiel(k) {
    if (!zielOffen()) return;
    var l = zielStufen(), s = null;
    for (var i = 0; i < l.length; i++) if (l[i].k === k) s = l[i];
    if (!s || Z.ziel === k) return;
    Z.ziel = k;
    Z.zielJahr = B.welt.zeit.jahr;
    B.welt.schreibe('Für ' + B.uhr.braujahr() + ' gilt: ' + s.name + '. ' + s.sagt, 'fuhre');
    B.ton.spiele('fuhre:siegel', { ort: 'hof' });
    B.sende('zeichne', { grund: 'fuhre-ziel' });
  }

  function ausstandSumme() {
    var n = 0;
    for (var k in Z.ausstand) n += Z.ausstand[k];
    return n;
  }
  function vorschussSumme() {
    var n = 0;
    for (var k in Z.vorschuss) n += Z.vorschuss[k];
    return n;
  }

  /* JEDE EINNAHME DES HAUSES GEHT HIER DURCH — und der Rat nimmt sein Teil
     an derselben Stelle.

     Vorher wurde die Abgabe in einer Summe zu Georgi genommen, gedeckelt auf
     55 % des freien Geldes; das war ein Pflaster gegen eine Wand, die es
     nicht geben muss. Das Ungeld ist eine Abgabe auf den Ausschank und wird
     historisch genommen, wenn gezahlt wird. Genau so lauft sie jetzt: acht
     Prozent von jedem Betrag, der hereinkommt, in der Woche, in der er
     hereinkommt. Der Jahresbetrag bleibt derselbe (Abgabendeckel,
     ZUSTAENDIGKEIT 4: 8 % fuer DIE FUHRE) — er kann nur nicht mehr als Wand
     an einem einzigen Tag stehen. */
  function einnahme(brutto, was, adresse, menge) {
    brutto = Math.round(brutto);
    if (brutto <= 0) return 0;
    var e = ep();
    B.welt.nimm(brutto, was, 'spieler');
    if (adresse !== undefined) {
      B.welt.protokolliere({ wer: 'spieler', was: was, preis: 0,
        menge: menge || 0, adresse: adresse || null });
    }
    if (e.abgabe && e.abgabe.satz) {
      var abg = Math.round(brutto * e.abgabe.satz);
      if (abg > 0 && B.welt.zahle(abg, e.abgabe.name + ' auf ' + B.welt.geld(brutto), 'spieler')) {
        Z.abgabeJahr += abg;
      }
    }
    return brutto;
  }

  /* Was ein Wirt bei der Lieferung hinlegt und was stehen bleibt. Ein
     Vorschuss aus dem Herbst wird zuerst abgetrunken — er war schon
     bezahlt. */
  function buchLieferung(a, erloes) {
    var st = zielStufe();
    var rest = Math.round(erloes);
    var abgetrunken = 0;

    var v = Z.vorschuss[a.schluessel] || 0;
    if (v > 0 && rest > 0) {
      abgetrunken = Math.min(v, rest);
      Z.vorschuss[a.schluessel] = v - abgetrunken;
      rest -= abgetrunken;
    }

    var bar = st ? Math.round(rest * st.bar) : rest;
    var steht = rest - bar;
    if (steht > 0) Z.ausstand[a.schluessel] = (Z.ausstand[a.schluessel] || 0) + steht;
    return { bar: bar, steht: steht, abgetrunken: abgetrunken };
  }

  /* DER UMGANG VOR MICHAELI. Er laeuft am Georgi-Ende, also in der Woche vor
     Michaeli, und er FORDERT NICHTS — er bringt ein. Das ist die Auflage der
     Aufsicht woertlich: die Woche vor Michaeli darf nicht mehr fordern, als
     sie einbringt. */
  function zahltag() {
    var zd = zielDef();
    Z.zahltag = null;
    if (!zd) return;
    var st = zielStufe();
    var posten = [], eingenommen = 0, ausgefallen = 0;

    alleHaeuser().forEach(function (a) {
      var offen = Math.round(Z.ausstand[a.schluessel] || 0);
      if (offen <= 0) return;
      /* Wer mager belieferte, treibt schlechter ein: ein Wirt, dem das Haus
         drei Jahre lang nichts gebracht hat, sucht am Zahltag Gruende. Und
         wer schon beim Adler steht, zahlt nur die Haelfte. */
      var quote = (st ? st.ausfall : 0.05) * (1 + (Z.mahnung[a.schluessel] || 0) * 0.6);
      if (Z.verloren[a.schluessel]) quote = Math.max(quote, 0.5);
      else if (a.bindung && a.bindung.wem && a.bindung.wem !== 'haus') quote = Math.max(quote, 0.3);
      var aus = Math.round(offen * B.grenze(quote, 0, 0.85));
      var zahlt = offen - aus;
      eingenommen += zahlt;
      ausgefallen += aus;
      posten.push({ name: a.name, offen: offen, zahlt: zahlt, aus: aus });
      Z.ausstand[a.schluessel] = 0;
    });

    /* DAS ANGELD. Wer im Winter beliefert werden will, legt zu Michaeli an.
       Es wird abgetrunken, nicht geschenkt — deshalb steht es zugleich als
       Schuld des Hauses im Buch (Z.vorschuss). */
    var angeld = 0, angeldPosten = [];
    if (zd.angeld) {
      var hs = echteSorten();
      var haus = hs[Math.min(1, hs.length - 1)] || hs[0];
      var gel = jahresLieferung();
      haeuser().forEach(function (a) {
        if (!haus) return;
        if (!(a.bindung && a.bindung.wem === 'haus')) return;
        if (sperre(a, haus) && sperre(a, notSorte())) return;
        /* Angelegt wird auf das, was der Wirt WIRKLICH nimmt, nicht auf das,
           was er koennte: ein Anteil des vergangenen Braujahres. Wer nichts
           genommen hat, legt auch nichts an — dafuer legt jeder gebundene
           Wirt wenigstens auf die erste Fuhre des Winters an. So kann das
           Angeld nie groesser werden, als es im Jahr darauf abgetrunken
           wird; es schafft kein Geld, es verschiebt es auf den Zahltag. */
        var menge = Math.max(gel[a.schluessel] || 0, wochenbedarf(a) * 1.5);
        var n = Math.round(menge * preisJeFass(haus, a) * zd.angeld);
        if (n <= 0) return;
        angeld += n;
        Z.vorschuss[a.schluessel] = (Z.vorschuss[a.schluessel] || 0) + n;
        angeldPosten.push({ name: a.name, betrag: n });
      });
    }

    var gesamt = eingenommen + angeld;
    if (gesamt > 0) {
      einnahme(eingenommen, zd.umgang + ' — was die Wirte zu Michaeli zahlen');
      einnahme(angeld, zd.angeldName);
    }
    Z.georgiEin += gesamt;

    Z.zahltag = {
      name: zd.umgang, satz: zd.satz, stufe: st ? st.name : '',
      posten: posten, eingenommen: eingenommen, ausgefallen: ausgefallen,
      angeld: angeld, angeldName: zd.angeldName, angeldSatz: zd.angeldSatz,
      angeldPosten: angeldPosten, gesamt: gesamt
    };
    if (gesamt > 0) {
      B.welt.schreibe(zd.umgang + ': ' + B.welt.geld(gesamt) + ' kommen herein'
        + (ausgefallen ? ', ' + B.welt.geld(ausgefallen) + ' sind nicht einzutreiben' : '')
        + '. Damit steht das Haus vor der Michaelitafel.', 'fuhre');
    }
  }

  /* Preis je Fass — DER PREIS setzt den Multiplikator, DIE FUHRE die Sorte. */
  function preisMult() {
    var e = B.welt.zeit.epoche;
    var p = B.welt.haus.preis;
    var t = (typeof PREIS_DATEN !== 'undefined' && PREIS_DATEN.epochen) ? PREIS_DATEN.epochen[e] : null;
    if (!p || !t || !t.mitte) return 1;
    return B.grenze(p / t.mitte, 0.45, 2.2);
  }

  function preisJeFass(s, a) {
    return Math.max(1, Math.round(s.preis * preisMult() * (a ? art(a).faktor : 1)));
  }

  /* Anzeige je Hektoliter ab 1872, sonst je Fass — Sperrliste. */
  function preisJeEinheit(s, a) {
    var p = preisJeFass(s, a);
    if (B.welt.zeit.jahr >= 1872) p = p / (B.welt.LITER_JE_FASS / 100);
    return Math.max(1, Math.round(p));
  }

  function staffelPreis(k, basis, staffel) {
    return Math.max(1, Math.round(basis * Math.pow(staffel || 1, Z.kaufNr[k] || 0)));
  }

  /* ----------------------------------------------------------------------
     DIE HAEUSER
     ---------------------------------------------------------------------- */
  function haeuser() {
    return B.welt.adressenJetzt().filter(function (a) { return !Z.verloren[a.schluessel]; });
  }
  function alleHaeuser() { return B.welt.adressenJetzt(); }

  function jahresbedarf(a) { return Math.max(1, Math.round(a.bedarf * ep().mengenfaktor)); }
  function wochenbedarf(a) { return jahresbedarf(a) * ep().winteranteil / B.uhr.WOCHEN_IM_JAHR; }
  function durst(a) { return Z.durst[a.schluessel] || 0; }

  function nimmt(a, s) { return art(a).stufen.indexOf(s.stufe) >= 0; }

  /* Warum ein Haus diese Woche kein Fass bekommen kann. Der Grund steht am
     Knopf — er ist in jeder Epoche ein anderer, und genau das ist der Punkt. */
  function sperre(a, s) {
    var e = ep();
    if (Z.verloren[a.schluessel]) return 'Aufgegeben. Diese Adresse ist weg.';
    if (e.bannmeile && a.km > e.bannmeile && !Z.bann[a.schluessel]) {
      return 'Außerhalb der Bannmeile (' + e.bannmeile + ' Meile). Ohne Bannbrief des Rats fährt hier kein Fass.';
    }
    /* Der Regalmeter gilt fuer die MARKE. Der Notsud traegt das Etikett des
       Haendlers und braucht deshalb keinen — sonst waere 1970 der Verlust
       aller Regalmeter derselbe absorbierende Zustand wie eine leere Kasse. */
    if (e.listung && !gelistet(a) && !(s && s.not)) {
      return 'Nicht gelistet. Ohne Regalmeter nimmt der Einkauf keine Ware des Hauses an.';
    }
    return null;
  }

  function gelistet(a) {
    var l = Z.listung[a.schluessel];
    if (!l) return false;
    for (var k in l) if (l[k]) return true;
    return false;
  }

  function gelistetFuer(a, s) {
    if (!ep().listung) return true;
    /* Der Notsud laeuft unter dem Etikett des Haendlers und braucht deshalb
       keinen eigenen Regalmeter — er braucht nur ein Regal. Genau darum ist
       er in 1970 der Weg zurueck: kein Name, aber ein Absatz. */
    if (s && s.not) return true;
    var l = Z.listung[a.schluessel];
    return !!(l && l[s.k]);
  }

  /* ----------------------------------------------------------------------
     DAS PROBEFASS — der Weg zurueck, und er kostet kein Geld

     Ein Wirt, der abgesprungen ist, kommt nicht wieder, weil man ihn
     bezahlt. Er kommt wieder, weil in seinem Keller ein Fass steht, das
     seinen Gaesten schmeckt. Also gibt das Haus eines her: ohne Rechnung,
     ohne Ungeld, ohne Eintrag. Was es kostet, ist die knappe Sache dieser
     Epoche — ein reifes Fass, ein Platz auf dem Wagen, einer der wenigen
     Halte der Woche. Deshalb steht der Knopf auch bei leerer Kasse offen:
     der Notsud kostet nichts, und ein Notsud ist ein Fass.
     ---------------------------------------------------------------------- */
  function probeDef() { return ep().probe || null; }

  function probeStand(a) {
    return (Z.probe[a.schluessel] && Z.probe[a.schluessel].zutrauen) || 0;
  }

  /* Wem die Adresse gerade gehoert, entscheidet, wie schwer es wird. Genommen
     wird dem Gegner nichts (ZUSTAENDIGKEIT 8) — gewonnen schon. */
  function fremdGebunden(a) {
    var w = B.welt.gebunden(a.schluessel);
    return w && w !== 'haus' ? w : null;
  }

  function probeZiel(a) {
    return fremdGebunden(a) ? PROBE_ZIEL_FREMD : PROBE_ZIEL;
  }

  /* Fuer die Probe wird KEINE Sorte ausgeschlossen. Der Wirt bekommt, was da
     ist; ob es ihn ueberzeugt, entscheidet sich beim Trinken, nicht beim
     Beladen. Bevorzugt geht trotzdem das aelteste Fass, das er wirklich
     fuehrt — ein Haus verschenkt nicht seinen besten Sud, wenn ein
     passender daneben liegt. */
  function waehleProbeFass(a) {
    var frei = freieFaesser();
    var passend = null, passendAlter = -1;
    var irgend = null, irgendAlter = -1;
    for (var i = 0; i < frei.length; i++) {
      var f = frei[i], al = alter(f);
      if (nimmt(a, sorteFass(f))) {
        if (al > passendAlter) { passend = f; passendAlter = al; }
      } else if (al > irgendAlter) { irgend = f; irgendAlter = al; }
    }
    return passend || irgend;
  }

  function probeGeladen(a) {
    for (var i = 0; i < Z.ladung.length; i++) {
      if (Z.ladung[i].adr === a.schluessel && Z.ladung[i].probe) return Z.ladung[i];
    }
    return null;
  }

  /* Warum diese Woche kein Fass auf Probe hinausgeht. Der Grund ist nie
     Geld — er ist immer ein Fass, ein Platz oder ein Halt. */
  function kannProbe(a) {
    var e = ep();
    if (!probeDef()) return 'In dieser Zeit gibt es das nicht.';
    if (!Z.verloren[a.schluessel]) return 'Diese Adresse führt Bier des Hauses. Sie braucht keine Probe.';
    if (probeGeladen(a)) return null;
    /* Die Bannmeile gilt auch fuer ein verschenktes Fass: sie regelt die
       Ausfuhr, nicht den Verkauf. Der Regalmeter dagegen regelt die WARE im
       Regal — Gratisware steht nicht im Regal, sie steht im Lager. */
    if (e.bannmeile && a.km > e.bannmeile && !Z.bann[a.schluessel]) {
      return 'Außerhalb der Bannmeile. Auch ein verschenktes Fass fährt nicht ohne Bannbrief hinaus.';
    }
    if (geladen() >= wagenPlaetze()) {
      return 'Der Wagen ist voll. ' + B.welt.menge(wagenPlaetze()) + ' und kein Fass mehr.';
    }
    if (Z.ladung.length >= e.wagen.halte) {
      return 'Keine Halte frei. Diese Tour fährt ' + e.wagen.halte + ' Adressen an.';
    }
    if (!waehleProbeFass(a)) return 'Der Keller ist leer. Es liegt kein reifes Fass da, das man hergeben könnte.';
    return null;
  }

  /* Legt das Probefass auf den Wagen — oder nimmt es wieder herunter. Ein
     Knopf, zwei Richtungen: sonst steht bei einer aufgegebenen Adresse ein
     Ladeknopf ohne Gegenstueck. */
  function schalteProbe(a) {
    var da = probeGeladen(a);
    if (da) {
      Z.ladung.splice(Z.ladung.indexOf(da), 1);
      B.sende('zeichne', { grund: 'fuhre-probe-ab' });
      return;
    }
    var grund = kannProbe(a);
    if (grund) { Z.meldung = grund; B.sende('zeichne', { grund: 'fuhre-probe' }); return; }
    var eintrag = { adr: a.schluessel, faesser: [], probe: true };
    var schritt = ep().wagen.schritt;
    for (var n = 0; n < schritt; n++) {
      if (geladen() >= wagenPlaetze()) break;
      var f = waehleProbeFass(a);
      if (!f) break;
      if (!eintrag.faesser.length) Z.ladung.push(eintrag);
      eintrag.faesser.push(f);
    }
    if (!eintrag.faesser.length) return;
    B.ton.spiele('fuhre:probe', { ort: 'fasslager', laut: 0.45 });
    B.sende('zeichne', { grund: 'fuhre-probe' });
  }

  /* Das Fass ist angekommen. Was es beim Wirt bewirkt, haengt nicht am Preis,
     sondern daran, ob er dieses Bier ueberhaupt fuehrt. */
  function probeKommtAn(a, faesser) {
    var s = Z.probe[a.schluessel];
    if (!s) { s = Z.probe[a.schluessel] = { zutrauen: 0, jahr: 0, gaben: 0 }; }
    /* Ein Halt ist ein Versuch — ob ein Fass darin liegt oder eine Palette,
       aendert nichts daran, dass der Wirt EINMAL probiert. Was zaehlt, ist,
       ob er dieses Bier ueberhaupt fuehrt: dann zaehlt der Versuch doppelt,
       sonst einfach. Vier Punkte holen ihn zurueck, sechs beim Gegner. */
    var gut = 0;
    faesser.forEach(function (f) { if (nimmt(a, sorteFass(f))) gut++; });
    s.zutrauen += (gut * 2 >= faesser.length) ? 2 : 1;
    s.jahr = B.welt.zeit.jahr;
    s.gaben += 1;
    Z.probeGesamt += faesser.length;
    Z.probeDieseWoche += faesser.length;
    if (s.zutrauen >= probeZiel(a)) holeZurueck(a, gut ? 'probe' : 'probe-mager');
  }

  /* Die Adresse ist zurueck. Die Reihe faengt bei null an — gewonnen ist der
     Wirt, nicht das Jahr. */
  function holeZurueck(a, wie) {
    if (!Z.verloren[a.schluessel]) return;
    var vorher = fremdGebunden(a);
    delete Z.verloren[a.schluessel];
    delete Z.probe[a.schluessel];
    delete Z.fremdBeiMahnung[a.schluessel];
    Z.mahnung[a.schluessel] = 0;
    Z.leer[a.schluessel] = 0;
    Z.durst[a.schluessel] = wochenbedarf(a) * 2.5;
    B.welt.binde(a.schluessel, 'haus', wie === 'neuer' ? 'Anfrage' : (probeDef() ? probeDef().kurz : 'Probe'),
      B.welt.zeit.jahr + 2);
    Z.zurueckGeholt.push({ name: a.name, jahr: B.welt.zeit.jahr, wie: wie, vorher: vorher });
    Z.frist = null;
    B.welt.protokolliere({ wer: 'spieler', preis: 0, adresse: a.schluessel,
      was: a.name + ' führt wieder Bier des Hauses'
         + (vorher ? ' — abgenommen wurde die Adresse ' + vorher : '') });
    var satz = wie === 'neuer'
      ? B.wuerfel.aus(D.neuerWirt[B.welt.zeit.epoche] || D.neuerWirt[1]).replace('{wirt}', a.name)
      : (probeDef() ? probeDef().zurueck.replace('{wirt}', a.name) : a.name + ' nimmt wieder ab.');
    B.welt.schreibe(satz + (vorher
      ? ' Der Wirt hing an ' + vorher + '; das Probefass hat ihn zurückgeholt, nicht das Geld.'
      : ''), 'fuhre');
    B.ton.spiele('fuhre:siegel', { ort: 'tor', laut: 0.5 });
  }

  /* Zu Georgi: was in einem ganzen Braujahr kein Fass gesehen hat, vergisst
     der Wirt wieder. Sonst waere die Probe ein Sparbuch statt eines
     Versuchs. */
  function probeVerblasst() {
    for (var k in Z.probe) {
      if (!Object.prototype.hasOwnProperty.call(Z.probe, k)) continue;
      if (Z.probe[k].jahr >= B.welt.zeit.jahr) continue;
      Z.probe[k].zutrauen -= 1;
      if (Z.probe[k].zutrauen <= 0) delete Z.probe[k];
    }
  }

  /* Ein Zug, der ohne den Spieler geschieht: hoechstens EINE lange
     aufgegebene Adresse fragt zu Georgi von selbst wieder an — und nur,
     solange das Haus ueberhaupt noch liefert. Ein Brauhaus, von dem niemand
     mehr etwas hat, fragt auch niemand. */
  function neuerWirtFragt() {
    if (!haeuser().length) return;
    var alt = null;
    alleHaeuser().forEach(function (a) {
      var w = Z.verloren[a.schluessel];
      if (!w) return;
      if (B.welt.zeit.jahr - w.jahr < 3) return;
      if (!alt || w.jahr < Z.verloren[alt.schluessel].jahr) alt = a;
    });
    if (!alt) return;
    if (!B.wuerfel.trifft(0.25)) return;
    holeZurueck(alt, 'neuer');
  }

  /* ----------------------------------------------------------------------
     DAS LEERE AUFTRAGSBUCH UND DIE FRIST

     Solange eine Adresse Bier des Hauses fuehrt, geht es weiter — notfalls
     mit Kofent und auf Kerbe. Fuehrt keine mehr eines, laeuft die Frist der
     Epoche. Sie steht in jeder Woche still, in der ein Fass auf Probe
     hinausging: wer es versucht, verliert nicht am Kalender. Laeuft sie ab,
     haelt die Uhr an — der Kern, nicht dieses Stueck (ZUSTAENDIGKEIT 12).
     ---------------------------------------------------------------------- */
  function fristDef() { return ep().frist || { wochen: 12, wer: 'die Stadt', satz: '', ende: '' }; }

  function pruefeAuftragsbuch() {
    var lebt = haeuser().length > 0;
    var probiert = Z.probeDieseWoche > 0;
    Z.probeDieseWoche = 0;

    if (lebt) {
      if (Z.frist !== null) Z.frist = null;
      /* Ein Probefass hat gewirkt: es gibt wieder eine Adresse. Dann ist der
         Antrag gegenstandslos — der Kaeufer wollte ein Haus ohne Kundschaft.
         Er gilt aber NICHT als ausgeschlagen: geht das Auftragsbuch spaeter
         wieder leer, ist das eine neue Lage und ein neues Gebot. */
      if (Z.antrag) {
        Z.antrag = null;
        B.welt.schreibe('Es liefert wieder — und damit ist der Antrag vom Tisch: '
          + (ausgangDef() && ausgangDef().antrag ? ausgangDef().antrag.wer : 'der Käufer')
          + ' nimmt kein Haus, das Abnehmer hat.', 'fuhre');
      }
      return;
    }
    if (B.welt.zeit.ende) return;

    /* Ein Haus ohne einen einzigen Abnehmer wird nicht uebergeben, sondern
       hergegeben. Das Uebergabeblatt geht vom Tisch, sobald die Frist laeuft. */
    Z.uebergabe = null;

    var fd = fristDef();
    if (Z.frist === null) {
      Z.frist = fd.wochen;
      B.welt.schreibe('Die letzte Adresse ist weg. Das Brauhaus zum Anker braut noch, '
        + 'aber es liefert nirgendwohin mehr. Nicht das Geld ist ausgegangen — die Kundschaft. '
        + fd.satz + ' Es bleiben ' + fd.wochen + ' Wochen und '
        + (probeDef() ? probeDef().name.toLowerCase() : 'ein Fass auf Probe') + '.', 'fuhre');
      return;
    }
    if (probiert) return;          /* die Uhr steht still, solange es versucht wird */
    Z.frist -= 1;
    /* Ab der Haelfte der Frist steht der Antrag der Epoche im Bild. Wer ihn
       annimmt, hoert HEUTE auf und hat das Geld; wer ihn ausschlaegt, bekommt
       den Untergang der Epoche, und der zahlt weniger oder nichts. */
    if (Z.frist > 0 && Z.frist <= Math.ceil(fd.wochen / 2)) legeAntragVor();
    if (Z.frist <= 0) {
      Z.frist = 0;
      vollzieheFall();
    }
  }

  /* ======================================================================
     DER AUSGANG — vier Epochen, vier Untergaenge, und einer, der keiner ist.

     BEFUND-ENDE.md §1(b) und §1(c): das Ende war viermal dasselbe
     ('keine-abnehmer'), und es gab kein gutes. Beides hatte dieselbe
     Ursache: hier stand ein einziger Aufruf `B.uhr.beende('keine-abnehmer')`,
     und was danach mit dem Haus geschah, stand nirgends.

     Was mit einem Brauhaus geschieht, dem der letzte Abnehmer abgeht, ist
     aber in jedem Jahrhundert etwas anderes — weil in jedem Jahrhundert
     etwas anderes an dem Haus VERKAEUFLICH ist:

       1350  gar nichts. Das Braurecht ist verliehen und faellt heim.
       1600  die Gerechtigkeit. Sie klebt am Haus und hat einen Kaeufer.
       1884  das ganze Haus. Grundstueck, Sudhaus, Kundenliste.
       1970  nur noch der Name. Der Betrieb ist Schrott, die Marke nicht.

     Die Texte stehen in fuhre-daten.js unter `ausgaenge`. Hier steht nur,
     WANN welcher gilt, und dass jeder davon eine ENTSCHEIDUNG ist: der
     Antrag steht mit seinem Preisschild im Bild, solange die halbe Frist
     noch laeuft. Zwei Knoepfe, die einander ausschliessen, beide
     unwiderruflich — annehmen beendet die Partie an diesem Tag, ausschlagen
     laesst den Antrag verfallen und nimmt ihn nie wieder auf.
     ====================================================================== */
  function ausgangDef() {
    var a = D.ausgaenge || {};
    return a[B.welt.zeit.epoche] || a[1] || null;
  }

  /* Wer gebaut hat, bekommt mehr — der Gaerraum ist die Substanz, die ein
     Kaeufer sieht. basis und jePlatz stehen je Epoche in den Daten. */
  function antragSumme() {
    var g = ausgangDef();
    if (!g || !g.antrag) return 0;
    return Math.max(0, Math.round(g.antrag.basis + g.antrag.jePlatz * B.welt.vorrat.plaetze));
  }

  function legeAntragVor() {
    if (Z.antrag || Z.antragErledigt) return;
    var g = ausgangDef();
    if (!g || !g.antrag) return;
    Z.antrag = { summe: antragSumme(), jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche };
    B.welt.schreibe(g.antrag.name + '. ' + g.antrag.satz, 'fuhre');
    B.ton.spiele('fuhre:siegel');
  }

  /* Die Chronikzeile eines Ausgangs, mit den Luecken gefuellt. */
  function ausgangSatz(text, summe) {
    var fd = fristDef();
    return String(text || '')
      .replace('{jahr}', String(B.welt.zeit.jahr))
      .replace('{wochen}', String(fd.wochen))
      .replace('{familie}', B.welt.haus.familie)
      .replace('{geld}', B.welt.geld(summe || 0));
  }

  function schliesseAb(teil, summe, wortFuerDieKasse) {
    Z.ausgang = {
      art: teil.art,
      grund: teil.grund,
      summe: summe,
      kopf: ausgangSatz(teil.kopf, summe),
      urteil: ausgangSatz(teil.urteil, summe),
      folge: ausgangSatz(teil.folge, summe)
    };
    if (summe > 0) B.welt.nimm(summe, wortFuerDieKasse, 'spieler');
    /* Die Zeile wird HIER geschrieben und nicht der Uhr uebergeben: sonst
       stuende sie zweimal in der Chronik, einmal kurz und einmal ganz.
       B.uhr.beende schreibt nur, wenn man ihm einen Text mitgibt. */
    B.welt.schreibe(Z.ausgang.urteil + ' ' + Z.ausgang.folge
      + (summe > 0 ? ' Ausgezahlt: ' + B.welt.geld(summe) + '.' : ''), 'ende');
    B.uhr.beende(teil.grund);
  }

  function nimmAntrag() {
    if (!Z.antrag || B.welt.zeit.ende) return;
    var g = ausgangDef();
    if (!g) return;
    var summe = Z.antrag.summe;
    Z.antragErledigt = true;
    Z.antrag = null;
    B.ton.spiele('fuhre:siegel');
    schliesseAb(g.angenommen, summe, g.antrag.name + ' — angenommen');
    B.sende('zeichne', { grund: 'fuhre-antrag-ja' });
  }

  function schlageAntragAus() {
    if (!Z.antrag || B.welt.zeit.ende) return;
    var g = ausgangDef();
    Z.antragErledigt = true;
    Z.antrag = null;
    B.welt.schreibe('Das Haus schlägt den Antrag aus. ' + (g && g.antrag ? g.antrag.wer : 'Die Stadt')
      + ' nimmt das Gebot vom Tisch; es kommt nicht wieder. '
      + 'Was jetzt noch geht, geht über die Wirte.', 'festlegung');
    B.sende('zeichne', { grund: 'fuhre-antrag-nein' });
  }

  /* Die Frist ist abgelaufen. Jetzt entscheidet die Epoche, nicht der Spieler. */
  function vollzieheFall() {
    if (B.welt.zeit.ende) return;
    var g = ausgangDef();
    if (!g || !g.fall) { B.uhr.beende('keine-abnehmer', fristDef().ende); return; }
    Z.antrag = null;
    var summe = Math.round(antragSumme() * (g.fall.anteil || 0));
    /* ausgangSatz fuellt {jahr} — sonst steht die Lücke im Protokollbuch. */
    schliesseAb(g.fall, summe, ausgangSatz(g.fall.kopf, summe));
  }

  /* ----------------------------------------------------------------------
     DIE UEBERGABE — das einzige Ende, nach dem wieder Feuer unter der
     Pfanne brennt.

     Sie wird nicht verhaengt, sondern angeboten, und nur einem Haus, das
     steht. Wer weiterbraut, bekommt sie zum naechsten Michaeli wieder
     vorgelegt — sie ist ein Angebot, keine Falle.

     WAS "STEHT" HEISST, IST IN JEDEM JAHRHUNDERT ETWAS ANDERES, und das war
     der Fehler, den die Messung gefunden hat. Bis hierher stand fuer alle
     vier Epochen dieselbe Zahl: fuenf Braujahre und DREI Haeuser, die Bier
     des Anker fuehren. Gemessen auf der sorgfaeltig gespielten Linie
     (270 Wochen, 0 Seitenfehler, kein Abbruch):

       E1 1350   ab 1355 angeboten, 120 Wochen im Bild
       E2 1600   ab 1605 angeboten
       E3 1884   ab 1889 angeboten
       E4 1970   NIE — die Zahl der fuehrenden Haeuser steht 1972 auf 3,
                 1973 auf 2 und ab 1976 auf 1, waehrend die Uhr erst 1975
                 fuenf Braujahre voll hat. Kasse 62.606 bis 86.352 DM,
                 870 hl im letzten Braujahr hinausgegangen.

     Das Haus in 1970 war also zahlungsfaehig, hat geliefert und stand neun
     Jahre — und bekam das gute Ende trotzdem nie, weil an 1970 die Elle von
     1350 angelegt wurde. Genau darum geht es beim Brauereisterben: die Zahl
     der Abnehmer SINKT, das ist der Vorgang selbst. Wer 1978 noch eine
     Listung haelt, zahlt und ausliefert, steht besser als die Haelfte der
     Branche. Also steht die Elle jetzt je Epoche in fuhre-daten.js
     (`ausgaenge.uebergabe[n].mass`) — Jahre, Haeuser, Ausstoss und der Satz,
     der sagt, warum diese Zahl fuer diese Zeit die richtige ist.
     ---------------------------------------------------------------------- */
  var MASS_VORGABE = { jahre: 5, haeuser: 3, ausstoss: 1,
    satz: 'Ein Haus, das liefert und zahlt, kann man weitergeben.' };
  /* So viele Wochen liegt das Angebot, dann verfaellt es bis zum naechsten
     Michaeli. Vier, weil die Uebergabe im Herbst verhandelt wird und nicht
     das ganze Jahr — und weil ein Blatt dieser Groesse nicht laenger liegen
     darf (siehe woche:). */
  var UEBERGABE_WOCHEN = 4;

  function uebergabeMass() {
    var u = uebergabeDef();
    var m = u && u.mass;
    if (!m) return MASS_VORGABE;
    return {
      jahre:    m.jahre    === undefined ? MASS_VORGABE.jahre    : m.jahre,
      haeuser:  m.haeuser  === undefined ? MASS_VORGABE.haeuser  : m.haeuser,
      ausstoss: m.ausstoss === undefined ? MASS_VORGABE.ausstoss : m.ausstoss,
      satz:     m.satz     || MASS_VORGABE.satz
    };
  }

  /* Warum das Haus (noch) nicht uebergeben werden kann — in Klartext, damit
     das gute Ende nicht als unerklaerte Abwesenheit dasteht. Gibt null
     zurueck, wenn nichts fehlt. */
  function uebergabeFehlt() {
    if (B.welt.zeit.ende) return 'Die Uhr steht.';
    var m = uebergabeMass();
    var jahre = B.welt.zeit.jahr - Z.startJahr;
    if (jahre < m.jahre) {
      return 'Noch ' + (m.jahre - jahre) + (m.jahre - jahre === 1 ? ' Braujahr' : ' Braujahre')
        + ', dann ist das Haus alt genug für eine Übergabe.';
    }
    if (haeuser().length < m.haeuser) {
      return 'Es führen ' + haeuser().length + ' von ' + m.haeuser
        + (m.haeuser === 1 ? ' Haus' : ' Häusern') + ' Bier des Anker.';
    }
    if (B.welt.haus.kasse < 0) return 'Die Lade hat ein Loch — ' + B.welt.geld(B.welt.haus.kasse) + '.';
    if (Z.verladenVorjahr < m.ausstoss) {
      return 'Im letzten Braujahr ist ' + B.welt.menge(Z.verladenVorjahr) + ' hinausgegangen.';
    }
    return null;
  }

  function hausStehtGut() { return uebergabeFehlt() === null; }

  /* Zu Michaeli wird neu bewertet, nicht einmal entschieden: was voriges Jahr
     galt, gilt heute vielleicht nicht mehr. Deshalb wird das Blatt hier jedes
     Jahr neu gesetzt ODER weggenommen — mit den Zahlen des abgelaufenen
     Braujahres, nicht mit denen von vor drei Jahren. */
  function pruefeUebergabe() {
    if (!hausStehtGut() || Z.uebergabeNein === B.welt.zeit.jahr || Z.antrag) {
      Z.uebergabe = null;
      return;
    }
    Z.uebergabe = {
      jahr: B.welt.zeit.jahr,
      alt: B.welt.zeit.amtszeit.name,
      haeuser: haeuser().length,
      verladen: Z.verladenVorjahr,
      mass: uebergabeMass()
    };
    /* Ein neues Angebot liegt aufgeschlagen da, auch wenn das vorige
       weggeklappt war (R14). */
    Z.uebergabeZu = false;
    /* In die Chronik, damit das gute Ende nicht nur auf einem Blatt steht,
       das die Platzordnung eine Woche spaeter in einen Reiter klappen kann.
       Wer die Chronik liest, findet den Tag wieder. */
    B.welt.schreibe(uebergabeDef().wort + ': das Haus steht gut genug, um es weiterzugeben — '
      + (Z.uebergabe.haeuser === 1 ? 'ein Haus führt' : Z.uebergabe.haeuser + ' Häuser führen')
      + ' sein Bier, '
      + B.welt.menge(Z.uebergabe.verladen) + ' sind im Braujahr hinausgegangen. '
      + 'Das Angebot liegt ' + UEBERGABE_WOCHEN + ' Wochen.', 'fuhre');
  }

  function uebergabeDef() {
    var u = (D.ausgaenge && D.ausgaenge.uebergabe) || {};
    return u[B.welt.zeit.epoche] || u[1] || { wort: 'Die Übergabe', satz: '', folge: '' };
  }

  function nimmUebergabe() {
    if (!Z.uebergabe || B.welt.zeit.ende) return;
    var u = uebergabeDef();
    var alt = Z.uebergabe.alt;
    /* Das Haus bleibt, der Mensch nicht — und diesmal geht der Mensch von
       selbst. B.welt.erbe() setzt den naechsten Namen ein und meldet den
       Erbfall; die Generationenzeile des Schlussblatts schreibt ihn mit. */
    var neu = B.welt.erbe();
    var folge = String(u.folge || '')
      .replace('{familie}', B.welt.haus.familie)
      .replace('{erbe}', neu.name)
      .replace('{alt}', alt);
    Z.ausgang = {
      art: 'uebergeben',
      grund: 'uebergeben',
      summe: 0,
      kopf: 'Das Haus wird übergeben · ' + B.welt.zeit.jahr,
      urteil: alt + ' übergibt das Brauhaus zum Anker an ' + neu.name
            + '. ' + u.satz,
      folge: folge
    };
    Z.uebergabe = null;
    B.ton.spiele('fuhre:siegel');
    B.welt.schreibe(Z.ausgang.urteil + ' ' + Z.ausgang.folge, 'ende');
    B.uhr.beende('uebergeben');
    B.sende('zeichne', { grund: 'fuhre-uebergabe' });
  }

  function schlageUebergabeAus() {
    if (!Z.uebergabe) return;
    Z.uebergabeNein = Z.uebergabe.jahr;
    Z.uebergabe = null;
    B.sende('zeichne', { grund: 'fuhre-uebergabe-nein' });
  }

  /* ----------------------------------------------------------------------
     DER KELLER
     ---------------------------------------------------------------------- */
  function keller() { return B.welt.vorrat.faesser; }

  function alter(f) { return B.welt.fassAlter(f); }
  function reif(f) { return alter(f) >= (f.reife || 0); }

  function reserviert() {
    var s = [];
    Z.ladung.forEach(function (l) { l.faesser.forEach(function (f) { s.push(f); }); });
    return s;
  }

  function freieFaesser() {
    var res = reserviert();
    return keller().filter(function (f) { return reif(f) && res.indexOf(f) < 0; });
  }

  /* Aeltestes passendes Fass zuerst — wer hortet, verliert es an den Verfall. */
  function waehleFass(a) {
    var frei = freieFaesser();
    var beste = null, besteAlter = -1;
    for (var i = 0; i < frei.length; i++) {
      var f = frei[i], s = sorteFass(f);
      if (!nimmt(a, s)) continue;
      if (!gelistetFuer(a, s)) continue;
      var al = alter(f);
      if (al > besteAlter) { beste = f; besteAlter = al; }
    }
    return beste;
  }

  function fassplaetzeFrei() {
    return Math.max(0, Z.faesser - keller().length - Z.draussen);
  }

  /* ----------------------------------------------------------------------
     DER WAGEN
     ---------------------------------------------------------------------- */
  function frachtstufe() {
    var f = ep().fracht;
    if (!f) return null;
    for (var i = 0; i < f.length; i++) if (f[i].k === Z.fracht) return f[i];
    return f[0];
  }

  function wagenPlaetze() {
    var fr = frachtstufe();
    return fr ? fr.fass : ep().wagen.fass;
  }

  /* DIE WAGENSTELLUNG WIRD BESTELLT, NICHT GERATEN.

     Die Stufe war beim Laden fest auf „Halber Wagen" gesetzt — eine
     Pauschale fuer vierzig Fass, waehrend in der ersten Woche zwoelf auf der
     Rampe standen. Gemessen: 7.184 Mark Fuhrlohn im Jahr bei 21.000 Mark
     Umsatz. Ein Drittel des Hauses fuer Luft, und der Spieler hat nie
     erfahren, warum. Die kleinste Stufe als Vorgabe ist genauso falsch: dann
     traegt die Rampe nur zwoelf Fass, waehrend die Stadt zwanzig in der
     Woche will, und das Haus verliert im zweiten Braujahr fuenf Adressen.

     Also wird bestellt, was die Stadt in einer Woche trinkt: die kleinste
     Stufe, die den Wochenbedarf der belieferten Haeuser traegt. Das ist die
     Wagenstellung, wie sie mit der Bahn vereinbart wurde — einmal im Jahr,
     zu Michaeli. Waehrend des Jahres steht sie mit Preisschild am Wagen und
     der Spieler kann sie jede Woche aendern; „wer die Stufe nicht fuellt,
     bezahlt Luft" bleibt Wort fuer Wort die Mechanik dieser Epoche. */
  function passendeFracht() {
    var f = ep().fracht;
    if (!f || !f.length) return f && f.length ? f[0].k : 'stueck';
    var braucht = 0;
    haeuser().forEach(function (a) { braucht += wochenbedarf(a); });
    /* BESTELLT WIRD, WAS DAS HAUS VERLADEN KANN — NICHT, WAS DIE STADT WILL.
       Der Durst der Stadt ist nicht die Wagenstellung. Gemessen: 1886 wollten
       sieben Wirtschaften zusammen ueber vierzig Hektoliter die Woche, das
       Haus brachte vier auf die Rampe — und bestellte weiter den Halben
       Wagen zu 190 Mark Pauschale, weil die Stufe am Durst haengt. Eine
       Bahn vereinbart die Wagenstellung nach dem Aufkommen des vorigen
       Jahres; wer weniger aufgibt, bekommt kleinere Wagen. */
    if (Z.verladenVorjahr > 0) {
      braucht = Math.min(braucht, Z.verladenVorjahr / B.uhr.WOCHEN_IM_JAHR * 1.35);
    }
    for (var i = 0; i < f.length; i++) if (f[i].fass >= braucht) return f[i].k;
    return f[f.length - 1].k;
  }

  function geladen() {
    var n = 0;
    Z.ladung.forEach(function (l) { n += l.faesser.length; });
    return n;
  }

  function geladenFuer(k) {
    for (var i = 0; i < Z.ladung.length; i++) if (Z.ladung[i].adr === k) return Z.ladung[i].faesser.length;
    return 0;
  }

  function fuhrlohn() {
    var e = ep(), w = e.wagen;
    if (!Z.ladung.length) return 0;
    var maxKm = 0, summeKm = 0;
    Z.ladung.forEach(function (l) {
      var a = B.welt.adresse(l.adr);
      if (!a) return;
      if (a.km > maxKm) maxKm = a.km;
      summeKm += a.km;
    });
    var fr = frachtstufe();
    if (fr) {
      return laufPreis(fr.pauschale + fr.jeFass * geladen() + fr.jeKm * maxKm);
    }
    /* FUHRLOHN JE FASS UND MEILE — die Rechnung, die ein Fuhrmann wirklich
       aufmacht. Bis zum 2. August 2026 hing hier alles an der FAHRT: Grund,
       Halte, Weg. Was auf dem Karren lag, kam nicht vor. Gemessen war das der
       Posten, an dem 1600 und 1884 gestorben sind — 824 Gulden Fuhrlohn auf
       1.979 Gulden Einnahmen, weil der Karren dreissig Wochen lang halb leer
       dieselbe Runde fuhr (spiel/BEFUND-WIRTSCHAFT.md §5). Der Zentner und
       die Meile sind seit je die beiden Groessen des Fuhrlohns; die Fahrt
       allein ist der Tag des Knechts und kostet entsprechend wenig.
       Die volle Fuhre kostet damit so viel wie vorher — die halbleere nicht
       mehr. */
    var halt = (w.haltPreis || 0) * Math.max(0, Z.ladung.length - 1);
    return laufPreis(w.grund + halt + w.jeKm * maxKm + w.jeKm * 0.12 * (summeKm - maxKm)
      + (w.jeFass || 0) * geladen());
  }

  function fuhrerloes() {
    var summe = 0;
    Z.ladung.forEach(function (l) {
      if (l.probe) return;          /* ein Probefass geht ohne Rechnung */
      var a = B.welt.adresse(l.adr);
      l.faesser.forEach(function (f) { summe += preisJeFass(sorteFass(f), a); });
    });
    return Math.round(summe);
  }

  function probenAufDemWagen() {
    var n = 0;
    Z.ladung.forEach(function (l) { if (l.probe) n += l.faesser.length; });
    return n;
  }

  /* ----------------------------------------------------------------------
     LADEN UND ENTLADEN — der eine Handgriff der Woche
     ---------------------------------------------------------------------- */
  function kannLaden(a) {
    /* Die Sperre wird gegen das Fass geprueft, das wirklich aufgeladen
       wuerde — nur so kommt der Notsud auch dorthin, wo die Marke des
       Hauses nicht hindarf. */
    var f0 = waehleFass(a);
    var g = sperre(a, f0 ? sorteFass(f0) : null);
    if (g) return g;
    if (geladen() >= wagenPlaetze()) return 'Der Wagen ist voll. ' + B.welt.menge(wagenPlaetze()) + ' und kein Fass mehr.';
    if (geladenFuer(a.schluessel) === 0 && Z.ladung.length >= (frachtstufe() ? ep().wagen.halte : ep().wagen.halte)) {
      return 'Keine Halte frei. Diese Tour fährt ' + ep().wagen.halte + ' Adressen an.';
    }
    if (!waehleFass(a)) {
      var frei = freieFaesser().length;
      if (!frei) return 'Der Keller ist leer. Es liegt kein reifes Fass da.';
      return art(a).wort + ': nimmt keine der Sorten, die reif im Keller liegen.';
    }
    return null;
  }

  function lade(a) {
    var e = ep(), schritt = e.wagen.schritt, gelegt = 0;
    var eintrag = null;
    for (var i = 0; i < Z.ladung.length; i++) if (Z.ladung[i].adr === a.schluessel) eintrag = Z.ladung[i];
    for (var n = 0; n < schritt; n++) {
      if (geladen() >= wagenPlaetze()) break;
      var f = waehleFass(a);
      if (!f) break;
      if (!eintrag) { eintrag = { adr: a.schluessel, faesser: [] }; Z.ladung.push(eintrag); }
      eintrag.faesser.push(f);
      gelegt++;
    }
    if (gelegt) B.ton.spiele('fuhre:fass-rollen', { ort: 'fasslager', laut: 0.5 });
    B.sende('zeichne', { grund: 'fuhre-laden' });
  }

  function entlade(a) {
    for (var i = 0; i < Z.ladung.length; i++) {
      if (Z.ladung[i].adr !== a.schluessel) continue;
      var schritt = ep().wagen.schritt;
      Z.ladung[i].faesser.splice(Math.max(0, Z.ladung[i].faesser.length - schritt), schritt);
      if (!Z.ladung[i].faesser.length) Z.ladung.splice(i, 1);
      break;
    }
    B.sende('zeichne', { grund: 'fuhre-entladen' });
  }

  function leereWagen() {
    Z.ladung = [];
    B.sende('zeichne', { grund: 'fuhre-leer' });
  }

  /* Eine Faustregel des Fuhrmanns, kein Rat: die Durstigsten zuerst, und
     kein neuer Halt, dessen Weg mehr kostet, als er einbringt. Die teuren
     Entscheidungen — welche Sorte, wen man fallenlässt, wann der Bannbrief
     fällig ist — bleiben beim Spieler. */
  function fuelleNachDurst() {
    function rang(a) { return (durst(a) - geladenFuer(a.schluessel)) / (1 + a.km * 0.45); }
    var l = haeuser().slice().sort(function (x, y) { return rang(y) - rang(x); });
    var sicherung = 0;
    while (geladen() < wagenPlaetze() && sicherung++ < 600) {
      var gelegt = false;
      for (var i = 0; i < l.length; i++) {
        var a = l[i];
        if (durst(a) - geladenFuer(a.schluessel) < 1) continue;
        if (kannLaden(a)) continue;
        var neuerHalt = geladenFuer(a.schluessel) === 0 && Z.ladung.length > 0;
        var vorher = geladen(), vorherLohn = fuhrlohn(), vorherErloes = fuhrerloes();
        lade(a);
        if (geladen() === vorher) continue;
        /* Ein ZUSAETZLICHER Halt muss sich tragen. Die Grundfracht der ersten
           Ladung wird nicht gegen ein einzelnes Fass gerechnet — sonst fuehre
           der Wagen nie los. */
        if (neuerHalt && fuhrerloes() - vorherErloes < fuhrlohn() - vorherLohn) {
          entladeStill(a, geladen() - vorher);
          continue;
        }
        gelegt = true;
        if (geladen() >= wagenPlaetze()) break;
      }
      if (!gelegt) break;
    }
    B.sende('zeichne', { grund: 'fuhre-fuellen' });
  }

  function entladeStill(a, n) {
    for (var i = 0; i < Z.ladung.length; i++) {
      if (Z.ladung[i].adr !== a.schluessel) continue;
      Z.ladung[i].faesser.splice(Math.max(0, Z.ladung[i].faesser.length - n), n);
      if (!Z.ladung[i].faesser.length) Z.ladung.splice(i, 1);
      return;
    }
  }

  function wieVorigeWoche() {
    if (!Z.vorige) return;
    Z.ladung = [];
    for (var k in Z.vorige) {
      var a = B.welt.adresse(k);
      if (!a || Z.verloren[k]) continue;
      var soll = Z.vorige[k], sicherung = 0;
      while (geladenFuer(k) < soll && !kannLaden(a) && sicherung++ < 200) lade(a);
    }
    B.sende('zeichne', { grund: 'fuhre-wie-vorige' });
  }

  /* ======================================================================
     DIE FUHRPLAENE — WELLE 13, R13

     DER BEFUND, gegen den hier gebaut wird (Spielprobe Welle 12, §8):
     „Die Woche besteht aus zwei Knoepfen — Wie vorige Woche, FUHRE
     ABSCHICKEN. In den drei unversehrten Protokollen entfielen auf sie
     1.256 von 1.760 Klicks (71 %)." Und beim Nachmessen am 8. August kam
     noch etwas Schlimmeres heraus: eine Hand, die KEINEN Reiter anfasst,
     erreicht diese beiden Knoepfe ueberhaupt nicht — alle vier Bretter der
     FUHRE liegen beim Laden zugeklappt (Platzordnung der STADT: „was beim
     Laden schon dalag, liegt als Reiter"). Gemessen mit
     werkbank/schuss/woche-w13/hand-w13.mjs, Epoche 1, 100 Wochen:
     100 von 106 Klicks (94 %) auf WEITER, kein einziger auf die Fuhre,
     `fuhre:abschicken` 100-mal abgeschaltet, weil der Wagen leer blieb.

     ZWEI ANTWORTEN, und sie gehoeren zusammen:

     1. DIE WOCHENKARTE (`.fu-woche`, siehe zeichneWoche) liegt IM BILD und
        nicht in einem Reiter. Sie bleibt dafuer unter der Schwelle, ab der
        die Platzordnung ein Brett sieht (stadt.js GRENZE = 3,5 % der
        Buehne) — sie ist eine Karte im Bild, kein Brett, und sie
        beansprucht keine Ausnahme (kein .amort, kein data-frei). Sie traegt
        keinen Kasten, nur Schrift im Lichthof und die Knoepfe selbst; das
        ist dieselbe Loesung, mit der Welle 10 das Band der Kennzahl
        losgeworden ist („die ZAHL bleibt, das PAPIER geht").

     2. DIE WOCHE TRAEGT EINE ENTSCHEIDUNG. Ein Fuhrplan ist kein Knopf,
        sondern eine WAHL: drei bis vier Ladungen nebeneinander, jede mit
        eigenem Preisschild, jede schliesst die anderen aus — der Platz auf
        dem Wagen hat kein zweites Mal. Wer faehrt, hat die Woche gefahren;
        deshalb schickt der Plan die Fuhre gleich mit ab. Der Weg von Hand
        (Haus fuer Haus laden, dann FUHRE ABSCHICKEN) bleibt unveraendert
        auf dem Brett DER WAGEN — kein Zugschluessel ist umbenannt oder
        weggefallen.

     UND: EIN PLAN, DER IMMER DER BESTE IST, IST KEINE WAHL. Deshalb steht
     unten in `planListe` eine Entdopplung: zwei Plaene, die dieselbe Ladung
     ergeben, erscheinen als EIN Knopf. Was gleich ist, ist keine Wahl.
     ====================================================================== */

  /* Laedt still — ohne Ton, ohne `zeichne`. Der Unterschied zu lade() ist
     genau der: hier wird gerechnet, dort gespielt. */
  function ladeStill(a) {
    var schritt = ep().wagen.schritt, gelegt = 0, eintrag = null;
    for (var i = 0; i < Z.ladung.length; i++) {
      if (Z.ladung[i].adr === a.schluessel) eintrag = Z.ladung[i];
    }
    for (var n = 0; n < schritt; n++) {
      if (geladen() >= wagenPlaetze()) break;
      var f = waehleFass(a);
      if (!f) break;
      if (!eintrag) { eintrag = { adr: a.schluessel, faesser: [] }; Z.ladung.push(eintrag); }
      eintrag.faesser.push(f);
      gelegt++;
    }
    return gelegt;
  }

  /* Der gemeinsame Fuellvorgang aller Plaene. `rang` sagt, wer zuerst
     drankommt; die Regel „ein ZUSAETZLICHER Halt muss sich tragen" ist
     woertlich die des Fuhrmanns aus fuelleNachDurst und gilt fuer alle. */
  /* KEIN PLAN DARF MEHR LADEN ALS DIE ANDEREN. Beim zweiten Anlauf trug
     „die mageren Haeuser" als einziger Plan eine Ausnahme von der Durstregel
     — er durfte auch Haeuser beladen, die gar nichts wollten. Damit war er
     fast immer der vollste Wagen und damit der eintraeglichste: 52 von 109
     Klicks (48 %) fielen auf diesen einen Knopf. Ein Plan, der mehr darf,
     ist keine Wahl, sondern ein Vorteil. Alle fuellen jetzt nach derselben
     Regel und unterscheiden sich NUR in der Reihenfolge. */
  function fuelleNachRang(rang) {
    var l = haeuser().slice().sort(function (x, y) { return rang(y) - rang(x); });
    var sicherung = 0;
    while (geladen() < wagenPlaetze() && sicherung++ < 600) {
      var gelegt = false;
      for (var i = 0; i < l.length; i++) {
        var a = l[i];
        if (durst(a) - geladenFuer(a.schluessel) < 1) continue;
        if (rang(a) <= -9e8) continue;
        if (kannLaden(a)) continue;
        var neuerHalt = geladenFuer(a.schluessel) === 0 && Z.ladung.length > 0;
        var vorher = geladen(), vorherLohn = fuhrlohn(), vorherErloes = fuhrerloes();
        if (!ladeStill(a)) continue;
        if (neuerHalt && fuhrerloes() - vorherErloes < fuhrlohn() - vorherLohn) {
          entladeStill(a, geladen() - vorher);
          continue;
        }
        gelegt = true;
        if (geladen() >= wagenPlaetze()) break;
      }
      if (!gelegt) break;
    }
  }

  /* Wer diese Woche wirklich in Not ist: magere Jahre auf dem Buckel und
     lange kein Fass gesehen. Das ist die Zahl, an der eine Adresse in drei
     Jahren verlorengeht (mahnenUndVerlieren). */
  function inNot(a) {
    return (Z.mahnung[a.schluessel] || 0) * 10 + Math.min(9, Z.leer[a.schluessel] || 0);
  }

  /* Eine aufgegebene Adresse, die diese Woche ein Fass auf Probe bekommen
     koennte — der Weg zurueck, und er kostet kein Geld. */
  function probeKandidat() {
    var beste = null;
    alleHaeuser().forEach(function (a) {
      if (!Z.verloren[a.schluessel]) return;
      if (kannProbe(a)) return;
      var s = probeStand(a);
      if (!beste || s > probeStand(beste)) beste = a;
    });
    return beste;
  }

  function ladeProbeStill(a) {
    var eintrag = { adr: a.schluessel, faesser: [], probe: true };
    var schritt = ep().wagen.schritt;
    for (var n = 0; n < schritt; n++) {
      if (geladen() >= wagenPlaetze()) break;
      var f = waehleProbeFass(a);
      if (!f) break;
      if (!eintrag.faesser.length) Z.ladung.push(eintrag);
      eintrag.faesser.push(f);
    }
    return eintrag.faesser.length;
  }

  /* Die Plaene selbst. Jeder baut NUR `Z.ladung` — nichts sonst. */
  var PLAN = {
    vorige: {
      wort: 'wie zuletzt',
      satz: 'Dieselbe Verteilung wie bei der letzten Fuhre.',
      da: function () { return !!Z.vorige; },
      baue: function () {
        for (var k in Z.vorige) {
          var a = B.welt.adresse(k);
          if (!a || Z.verloren[k]) continue;
          var soll = Z.vorige[k], sicherung = 0;
          while (geladenFuer(k) < soll && !kannLaden(a) && sicherung++ < 200) ladeStill(a);
        }
      }
    },
    durst: {
      wort: 'nach Durst',
      satz: 'Die Faustregel des Fuhrmanns: wer am längsten wartet, wird zuerst beliefert.',
      da: function () { return true; },
      baue: function () {
        fuelleNachRang(function (a) {
          return (durst(a) - geladenFuer(a.schluessel)) / (1 + a.km * 0.45);
        });
      }
    },
    rechnung: {
      wort: 'nach Rechnung',
      satz: 'Der Wagen fährt dorthin, wo das Fass am meisten bringt — der Durst der anderen wächst weiter.',
      da: function () { return haeuser().length > 1; },
      baue: function () {
        fuelleNachRang(function (a) {
          var f = waehleFass(a);
          var p = f ? preisJeFass(sorteFass(f), a) : 0;
          return p - a.km * 0.8;
        });
      }
    },
    nah: {
      wort: 'kurze Wege',
      satz: 'Wenig Fuhrlohn, wenig Weg. Was weiter weg wohnt, wartet.',
      da: function () { return haeuser().length > 1; },
      baue: function () { fuelleNachRang(function (a) { return -a.km * 10 + Math.min(3, durst(a)); }); }
    },
    mager: {
      wort: 'die mageren Häuser',
      satz: 'Wer drei magere Jahre hat, ist weg. Diese Fuhre hält die Adresse — sie bringt dafür weniger.',
      da: function () {
        return haeuser().some(function (a) { return inNot(a) >= 10; });
      },
      baue: function () {
        fuelleNachRang(function (a) { return inNot(a) * 100 + durst(a) - a.km; });
      }
    },
    umkaempft: {
      wort: 'wo der Adler wirbt',
      satz: 'Zuerst die Adressen, um die ein anderer wirbt. Wer beliefert wird, bleibt gebunden — '
          + 'das ist der billigste Zug gegen den Gegner, den dieses Haus hat.',
      da: function () {
        return haeuser().some(function (a) { return !!fremdGebunden(a); });
      },
      baue: function () {
        fuelleNachRang(function (a) {
          return (fremdGebunden(a) ? 1000 : 0) + durst(a) - a.km;
        });
      }
    },
    probe: {
      wort: 'ohne Rechnung',
      satz: 'Ein reifes Fass an einen Wirt, der nichts mehr nimmt — kein Preis, kein Ungeld. '
          + 'Vier davon holen ihn zurück.',
      da: function () { return !!probeKandidat(); },
      baue: function () {
        var a = probeKandidat();
        if (a) ladeProbeStill(a);
        fuelleNachRang(function (x) {
          return (durst(x) - geladenFuer(x.schluessel)) / (1 + x.km * 0.45);
        });
      }
    }
  };

  /* Rechnet einen Plan durch, OHNE ihn zu fahren. Der Wagen wird dafuer
     geliehen und danach Fass fuer Fass zurueckgegeben. */
  function planRechne(k) {
    var def = PLAN[k];
    if (!def || !def.da()) return null;
    var sicher = Z.ladung;
    Z.ladung = [];
    var erg = null;
    try {
      def.baue();
      erg = {
        k: k, wort: def.wort, satz: def.satz,
        ladung: Z.ladung, fass: geladen(), halte: Z.ladung.length,
        erloes: fuhrerloes(), lohn: fuhrlohn(), probe: probenAufDemWagen(),
        haeuser: Z.ladung.map(function (l) { return l.adr + ':' + l.faesser.length + (l.probe ? 'p' : ''); })
                         .sort().join('|')
      };
      erg.netto = erg.erloes - erg.lohn;
    } finally {
      Z.ladung = sicher;
    }
    return (erg && erg.fass) ? erg : null;
  }

  /* Welche Plaene stehen diese Woche nebeneinander? Die Reihenfolge ist
     fest (sonst waere die Partie nicht wiederholbar), die Dringenden zuerst,
     und was dieselbe Ladung ergibt, erscheint nur einmal. */
  /* AUF DER WOCHENKARTE STEHEN NUR REGELN, KEINE GEWOHNHEIT.

     „Wie vorige Woche" ist kein Fuhrplan, sondern die Abwesenheit eines
     Plans — und genau deshalb steht es hier nicht mehr. Gemessen, warum:
     mit `vorige` in der Liste fielen 65 bzw. 72 von 110 Klicks (59 bzw.
     66 %) auf diesen einen Knopf, weil die Wiederholung der zuletzt
     gewaehlten Ladung fast immer wieder die eintraeglichste ist. Ein Knopf,
     der sich selbst verstaerkt, ist keine Wahl, sondern eine Rille.

     Die Wiederholung ist damit nicht weg — sie hat nur den richtigen Ort
     bekommen: den SPRUNG („Weiter wie zuletzt · bis zu N Wochen"), der sie
     nicht einmal, sondern so lange faehrt, bis sich etwas aendert. Das ist
     die zweite Haelfte von R13, woertlich: Wochen ohne Entscheidung werden
     zusammengefasst. Wer eine einzelne Woche genau wie die vorige fahren
     will, hat dafuer unveraendert `fuhre:wie-vorige` auf dem Brett DER
     WAGEN. */
  var PLAN_REIHE = ['probe', 'mager', 'umkaempft', 'durst', 'rechnung', 'nah'];
  var PLAN_HOECHSTENS = 4;

  function planListe() {
    var raus = [], gesehen = {};
    for (var i = 0; i < PLAN_REIHE.length && raus.length < PLAN_HOECHSTENS; i++) {
      var p = planRechne(PLAN_REIHE[i]);
      if (!p) continue;
      if (gesehen[p.haeuser]) continue;      /* gleiche Ladung ist keine Wahl */
      gesehen[p.haeuser] = true;
      raus.push(p);
    }
    return raus;
  }

  function fahrePlan(k) {
    var p = planRechne(k);
    if (!p) return false;
    Z.ladung = p.ladung;
    Z.letzterPlan = k;
    Z.sprungBericht = null;
    schicke();
    return true;
  }

  /* ----------------------------------------------------------------------
     DIE LAGE DER WOCHE — der Satz ueber den Plaenen.

     Er sagt, WARUM diese Woche eine Entscheidung traegt. Traegt sie keine,
     gibt er null zurueck — und genau dann bietet die Karte den Sprung an.
     ---------------------------------------------------------------------- */
  function wochenLage() {
    if (B.welt.zeit.ende) return null;
    if (Z.uebergabe) {
      var r = Z.uebergabe.frist === undefined ? UEBERGABE_WOCHEN : Z.uebergabe.frist;
      return { art: 'uebergabe', dringend: true,
        satz: uebergabeDef().wort.toUpperCase() + ' liegt — noch ' + Math.max(1, r)
            + (Math.max(1, r) === 1 ? ' Woche' : ' Wochen') + '. Das ist das gute Ende.' };
    }
    if (Z.antrag) {
      var ga = ausgangDef();
      return { art: 'antrag', dringend: true,
        satz: (ga && ga.antrag ? ga.antrag.name.toUpperCase() : 'DER ANTRAG') + ' liegt — noch '
            + Z.frist + (Z.frist === 1 ? ' Woche' : ' Wochen') + '.' };
    }
    if (Z.frist !== null && Z.frist !== undefined) {
      return { art: 'frist', dringend: true,
        satz: 'Kein Haus der Stadt nimmt mehr ab. ' + fristDef().wer + ' gibt noch '
            + Z.frist + (Z.frist === 1 ? ' Woche' : ' Wochen') + '.' };
    }
    var pk = probeKandidat();
    if (pk) {
      return { art: 'probe', dringend: true,
        satz: pk.name + ' führt kein Bier des Hauses mehr — ' + probeStand(pk) + ' von '
            + probeZiel(pk) + ' Proben überzeugt.' };
    }
    var not = null;
    haeuser().forEach(function (a) { if (!not || inNot(a) > inNot(not)) not = a; });
    /* MAGER HEISST NICHT „EIN MAGERES JAHR". In 1350 traegt vom ersten Tag
       an fast jedes Haus eine Mahnung — waere das schon die Frage der Woche,
       stuende sie in 100 von 100 Wochen da und saegte damit den Sprung ab.
       Gefragt wird, wenn es wirklich um die Adresse geht: zwei magere Jahre,
       oder eines und seit fuenf Wochen kein Fass. */
    if (not && (Z.mahnung[not.schluessel] || 0) >= 2
        || (not && (Z.mahnung[not.schluessel] || 0) >= 1 && (Z.leer[not.schluessel] || 0) >= 5)) {
      var m = Z.mahnung[not.schluessel] || 0;
      return { art: 'mager', dringend: true,
        satz: not.name + ': ' + m + (m === 1 ? ' mageres Jahr' : ' magere Jahre') + ', seit '
            + (Z.leer[not.schluessel] || 0)
            + ((Z.leer[not.schluessel] || 0) === 1 ? ' Woche' : ' Wochen')
            + ' kein Fass. Bei drei ist die Adresse weg.' };
    }
    if (keller().length && fassplaetzeFrei() <= 0) {
      return { art: 'voll', dringend: true,
        satz: 'Der Keller ist voll — ' + B.welt.menge(keller().length)
            + '. Was nicht hinausgeht, verdirbt.' };
    }
    return null;
  }

  /* ----------------------------------------------------------------------
     DER SPRUNG — ruhige Wochen werden erzaehlt, nicht geklickt.

     `B.uhr.springeWochen(n)` IST DAS WERKZEUG, UND ES WIRD BENUTZT — aber
     nicht fuer jede Woche, und der Grund steht in einer Messung.

     Der Rahmen-Builder hat `springe()` in dieser Welle umgebaut: seit dem
     8. August laeuft jede uebersprungene Woche wirklich (`vorwoche`,
     `verfall`, `woche` bzw. `jahresende`/`jahr`), und der Wuerfel dreht sich
     genau so oft wie beim Spielen (spiel/LIESMICH.md). Ein Sprung ist damit
     woertlich „n-mal WEITER druecken, ohne hinzusehen".

     Genau das ist fuer DIE FUHRE der Haken: wer WEITER drueckt, ohne
     hinzusehen, schickt keine Fuhre hinaus. Gemessen mit
     werkbank/schuss/woche-w13/springeprobe.mjs, Epoche 1, Saat 1350, EIN
     gesprungenes Braujahr:

         Haeuser 10 -> 9   ·  Keller 4 -> 0 Fass  ·  Rohstoff 40 -> 7
         Kasse 112 -> 48 Pf  ·  Fuhren 0  ·  29 woche- und 1 jahr-Ereignis

     Ein Jahr ohne Fuhre kostet eine Adresse und den ganzen Keller. Ein
     Werkzeug, das die Woche ueberspringt, darf deshalb den Wagen nicht
     stehenlassen.

     Also beides, und jedes an seiner Stelle:
       · Woche MIT reifem Fass — der Fuhrmann faehrt weiter wie zuletzt:
         laden nach `Z.letzterPlan`, `schicke()`. Das ist keine
         uebersprungene Woche, das ist eine gefahrene, die niemand klicken
         musste.
       · Woche OHNE reifes Fass — `B.uhr.springeWochen(1)`: da ist wirklich
         nichts zu tun, und die Uhr macht es billiger und sicherer, als
         dieses Stueck es koennte (sie haelt bei `zeit.ende` von selbst an).
     Angehalten wird, sobald es wieder etwas zu entscheiden gibt.
     ---------------------------------------------------------------------- */
  var SPRUNG_HOECHSTENS = 6;

  /* WANN DARF ERZAEHLT STATT GEKLICKT WERDEN?

     Wenn die Fuhre der vorigen Woche noch fahrbar ist — dann ist die
     Wiederholung eine Moeglichkeit, und eine Woche, deren Antwort „wie
     zuletzt" heisst, traegt keine Entscheidung.

     Vier Dinge halten immer auf, und jedes ist eine Entscheidung: ein
     liegendes Uebergabeangebot, ein liegender Antrag, die laufende Frist des
     leeren Auftragsbuchs und ein Wirt, der auf ein Probefass wartet. Dazu
     der Jahreswechsel — Michaeli wird nicht uebersprungen. */
  function sprungWeite() {
    if (B.welt.zeit.ende) return 0;
    if (sommerLiegtOben() || schlussLiegtOben() || Z.antrag || Z.uebergabe) return 0;
    if (Z.frist !== null && Z.frist !== undefined) return 0;
    /* Ein EREIGNIS haelt auf, ein Dauerzustand nicht. „Ein Haus ist mager"
       steht in 1350 fast jede Woche da; waere das ein Grund, nie zu
       erzaehlen, gaebe es den Sprung nie. Das Probefass, der volle Keller,
       die Frist und die beiden Angebote sind dagegen Dinge, die HEUTE
       geschehen — die werden nicht ueberfahren. */
    var lage = wochenLage();
    if (lage && lage.art !== 'mager') return 0;
    /* Zwei Wochen sind ruhig: die, in der die vorige Fuhre noch fahrbar ist,
       und die, in der ueberhaupt nichts zu laden ist (kein reifes Fass). Die
       zweite war vorher eine tote Woche, in der nur WEITER half — gemessen
       25 von 118 Klicks. Eine Woche ohne Zug ist keine Woche, die man
       klicken muss. */
    if (!planRechne('vorige') && planListe().length) return 0;
    var bisJahresende = B.uhr.WOCHEN_IM_JAHR - B.welt.zeit.woche;
    return B.grenze(Math.min(SPRUNG_HOECHSTENS, bisJahresende), 0, SPRUNG_HOECHSTENS);
  }

  function springeWochen(n) {
    var fass = 0, geld = 0, gefahren = 0, wochen = 0;
    var vonJahr = B.welt.zeit.jahr, vonWoche = B.welt.zeit.woche;
    for (var i = 0; i < n; i++) {
      if (B.welt.zeit.ende) break;
      var plan = planRechne('vorige') || planRechne(Z.letzterPlan) || planRechne('durst');
      var vorKasse = B.welt.haus.kasse;
      if (plan) {
        Z.ladung = plan.ladung;
        fass += plan.fass;
        gefahren++;
        schicke();
        geld += Math.max(0, B.welt.haus.kasse - vorKasse);
      } else if (B.uhr.springeWochen) {
        B.uhr.springeWochen(1);
      } else {
        B.uhr.naechsteWoche();
      }
      wochen++;
      /* Angehalten wird, sobald wieder etwas zu entscheiden ist — dieselbe
         Zaehlung wie in sprungWeite, damit Anfahren und Anhalten derselben
         Regel folgen. */
      if (B.welt.zeit.woche === 1 || !sprungWeite()) break;
    }
    if (wochen) {
      Z.sprungBericht = wochen + (wochen === 1 ? ' Woche' : ' Wochen') + ' ohne Frage: '
        + (gefahren ? gefahren + (gefahren === 1 ? ' Fuhre, ' : ' Fuhren, ')
            + B.welt.menge(fass) + ' hinaus, ' + B.welt.geld(Math.round(geld)) + ' eingenommen'
          : 'keine Fuhre — es lag kein reifes Fass im Keller');
      B.welt.schreibe('Vom ' + vonJahr + '/' + vonWoche + ' an ' + Z.sprungBericht + '.', 'fuhre');
    }
    B.sende('zeichne', { grund: 'fuhre-sprung' });
  }

  /* ----------------------------------------------------------------------
     DIE FUHRE ABSCHICKEN — und damit die Woche schliessen
     ---------------------------------------------------------------------- */
  function schicke() {
    if (!Z.ladung.length) return;
    var lohn = fuhrlohn();
    var e = ep();
    var gesamt = 0, erloesGesamt = 0;
    var verteilung = {};
    var angeschrieben = 0;

    var probeGesamt = 0;

    Z.ladung.forEach(function (l) {
      var a = B.welt.adresse(l.adr);
      if (!a) return;
      var n = l.faesser.length;
      var erloes = 0;
      if (!l.probe) l.faesser.forEach(function (f) { erloes += preisJeFass(sorteFass(f), a); });

      /* Die Faesser gehen ueber die Welt-API aus dem Keller: erst nach vorn
         sortieren, dann herausnehmen. So bleibt der Weltzustand die eine
         Wahrheit und die Kopfleiste stimmt. */
      nimmHerausGezielt(l.faesser);

      /* DAS PROBEFASS. Keine Rechnung, kein Erlös, kein Umsatz — und damit
         auch kein Ungeld darauf. Es zaehlt auch nicht in die Absatzreihe:
         verschenktes Bier ist kein Absatz. Was es bewirkt, steht beim
         Wirt, nicht in der Kasse. */
      if (l.probe) {
        B.welt.protokolliere({
          wer: 'spieler', preis: 0, menge: 0, adresse: a.schluessel,
          was: (probeDef() ? probeDef().name : 'Fass auf Probe') + ' an ' + a.name
             + ' · ' + B.welt.menge(n) + ' ohne Rechnung'
        });
        Z.umlauf.push({ faellig: woManifest() + (e.wagen.umlauf || 1), n: n });
        Z.draussen += n;
        probeGesamt += n;
        probeKommtAn(a, l.faesser);
        return;
      }

      /* DAS ZIEL. Was der Wirt hinlegt, kommt in die Lade; was er anschreiben
         laesst, steht bis Michaeli im Holz. Der Umsatz ist in beiden Faellen
         derselbe — geliefert ist geliefert, und der Rat rechnet nach
         Ausstoss, nicht nach Kassenstand. */
      var buch = buchLieferung(a, erloes);
      einnahme(buch.bar, B.welt.menge(n) + ' an ' + a.name
        + (buch.steht ? ' · ' + B.welt.geld(buch.steht) + ' angeschrieben' : '')
        + (buch.abgetrunken ? ' · ' + B.welt.geld(buch.abgetrunken) + ' vom Angeld abgetrunken' : ''));
      angeschrieben += buch.steht;
      B.welt.protokolliere({
        wer: 'spieler', was: 'geliefert an ' + a.name
          + (buch.steht ? ' · ' + B.welt.geld(buch.steht) + ' aufs ' + (zielDef() ? zielDef().kurz : 'Ziel') : ''),
        preis: 0, menge: n, adresse: a.schluessel
      });

      Z.durst[a.schluessel] = Math.max(0, durst(a) - n);
      Z.leer[a.schluessel] = 0;
      verteilung[a.schluessel] = n;
      gesamt += n;
      erloesGesamt += erloes;
      Z.jahrUmsatz += erloes;

      /* Geliefert heisst gebunden — bis der Naechste kommt. */
      if (!a.bindung || a.bindung.wem === 'haus') {
        B.welt.binde(a.schluessel, 'haus', 'Lieferung', B.welt.zeit.jahr + 1);
      }

      /* Die Faesser stehen jetzt beim Wirt und fehlen im eigenen Bestand. */
      Z.umlauf.push({ faellig: woManifest() + (e.wagen.umlauf || 1), n: n });
      Z.draussen += n;
    });

    /* Erst liefert der Wagen, dann wird der Fuhrmann bezahlt — aus dem, was
       er mitgebracht hat. Eine leere Kasse haelt die Woche deshalb nie an. */
    B.welt.zahle(Math.min(lohn, Math.max(0, B.welt.haus.kasse)),
      'Fuhrlohn ' + (frachtstufe() ? frachtstufe().name : e.wagen.name)
      + ' · ' + Z.ladung.length + (Z.ladung.length === 1 ? ' Halt' : ' Halte'), 'spieler');

    Z.vorige = Object.keys(verteilung).length ? verteilung : Z.vorige;
    Z.verladen += gesamt;
    Z.ladung = [];
    Z.fuhren += 1;
    Z.meldung = (gesamt
      ? B.welt.menge(gesamt) + ' ausgeliefert an ' + Object.keys(verteilung).length
        + (Object.keys(verteilung).length === 1 ? ' Haus' : ' Häuser')
        + ' · ' + B.welt.geld(Math.round(erloesGesamt)) + ' verdient, davon '
        + B.welt.geld(angeschrieben) + ' angeschrieben bis Michaeli'
      : 'Nichts verkauft, ' + B.welt.geld(lohn) + ' Fuhrlohn bezahlt.')
      + (probeGesamt ? ' · ' + B.welt.menge(probeGesamt) + ' ohne Rechnung hinausgegeben' : '');

    B.ton.spiele('fuhre:abfahrt:' + ['ochse', 'pferd', 'waggon', 'lastzug'][B.welt.zeit.epoche - 1],
      { ort: 'tor' });

    B.uhr.naechsteWoche();
  }

  /* Fortlaufende Wochennummer, damit der Umlauf ueber den Jahreswechsel traegt. */
  function woManifest() {
    return B.welt.zeit.jahr * B.uhr.WOCHEN_IM_JAHR + B.welt.zeit.woche;
  }

  /* Nimmt genau diese Faesser heraus — ueber die API, nicht am Array vorbei. */
  function nimmHerausGezielt(liste) {
    var f = keller();
    liste.forEach(function (fass) {
      var i = f.indexOf(fass);
      if (i > 0) { f.splice(i, 1); f.unshift(fass); }
    });
    B.welt.nimmHeraus(liste.length);
  }

  /* ----------------------------------------------------------------------
     DER SUD — faellt von selbst, nach der Anschlagtafel
     ---------------------------------------------------------------------- */
  function planSummeBudget() {
    var n = 0;
    sorten().forEach(function (s) { n += (Z.plan[s.k] || 0) * budgetKosten(s); });
    return n;
  }
  function planSummeSude() {
    var n = 0;
    sorten().forEach(function (s) { n += (Z.plan[s.k] || 0); });
    return n;
  }

  function braue() {
    var e = ep(), gruende = [], gebraut = 0;
    /* Die Pfanne dieser Woche. In 1350/1600 in Brautagen bzw. Suden der
       Reihe, sonst in Suden — sie begrenzt AUCH den Notsud. */
    var jeWoche = e.budget ? e.budget.jeWoche : (Z.sudeJeWoche || 1);
    var verbraucht = 0;
    var geldFehlt = false;
    Z.notsud = 0;
    Z.sudeWoche = 0;

    /* Einen Sud ansetzen. Gibt null zurueck, wenn er faellt, sonst den
       Grund, warum nicht — der steht danach an der Tafel. */
    function setzeAn(s) {
      var kost = pfannenKosten(s);
      if (verbraucht + kost > jeWoche) {
        return e.budget ? ('die Woche hat nur ' + jeWoche + ' ' + e.budget.name)
                        : ('nur ' + jeWoche + (jeWoche === 1 ? ' Sud' : ' Sude') + ' je Woche');
      }
      if (e.budget && Z.budget < budgetKosten(s)) return e.budget.name + ' verbraucht';
      if (B.welt.vorrat.plaetze - keller().length < s.fass) return 'kein Platz im Keller';
      if (fassplaetzeFrei() < s.fass) return 'keine leeren Fässer';
      if (B.welt.haus.rohstoff < s.rohstoff) return 'kein ' + (B.welt.epoche().rohstoff || 'Rohstoff');
      if (e.eis && Z.eis < (s.eis || 0)) return 'kein Eis';
      /* Die einzige Stelle, an der Geld einen Sud noch aufhalten kann — und
         der Notsud kommt hier nie an, weil er nichts kostet.

         DER SUD DARF ANSCHREIBEN LASSEN. Das Kerbholz gab es in diesem Stueck
         von Anfang an, aber ausgerechnet der Sud durfte es nicht benutzen: er
         prüfte bar. Damit stand im Winter regelmässig „Kein Sud: die Kasse"
         an der Tafel, obwohl vier Kerben frei waren — und genau das ist der
         Vorgang, den ein Brauhaus seit je auf Anschrift bestreitet. Malz und
         Hopfen nimmt der Brauer beim Händler auf Kerbe und löst sie ein, wenn
         die Wirte zu Michaeli zahlen. Das ist der Kreis, um den es hier
         geht: im Herbst anschreiben, im Winter brauen, zu Michaeli rechnen.
         Die Zahl der Kerben begrenzt ihn; wer sie voll hat, braut Notbier. */
      var barpreis = laufPreis(s.kosten);
      if (barpreis > 0 && !kannBezahlen(barpreis)) return 'die Kasse';

      if (barpreis > 0) zahleOderKerbe(barpreis, 'Ein Sud ' + s.name);
      if (s.rohstoff) B.welt.haus.rohstoff -= s.rohstoff;
      if (e.eis) Z.eis = Math.max(0, Z.eis - (s.eis || 0));
      if (e.budget) Z.budget -= budgetKosten(s);
      verbraucht += kost;

      var gelegt = B.welt.legeEin(s.name, s.fass);
      var f = keller();
      for (var i = f.length - gelegt; i < f.length; i++) {
        f[i].k = s.k;
        f[i].stufe = s.stufe;
        f[i].reife = s.reife;
        f[i].haltbar = s.reife + s.haltbar;
        f[i].zeichen = s.zeichen;
      }
      gebraut += gelegt;
      /* Ein bezahlter Sud ist ein Sudtag: er legt Treber an, auf denen der
         zweite Guss laufen kann, und er ruft die Saisonkraefte an die
         Pfanne. Der Notsud tut beides nicht — er sitzt auf dem Sudtag,
         den ein anderer bezahlt hat. */
      if (!s.not) Z.sudeWoche++;
      B.welt.protokolliere({ wer: 'spieler', was: gelegt + ' Fass ' + s.name + ' eingelegt',
        preis: 0, menge: 0 });
      return null;
    }

    /* 1. Was an der Tafel steht. */
    var planFiel = null, ersatz = null;
    for (var si = 0; si < sorten().length; si++) {
      var s = sorten()[si];
      var will = Z.plan[s.k] || 0;
      for (var n = 0; n < will; n++) {
        var grund = setzeAn(s);
        if (grund) {
          gruende.push(grund);
          if (!planFiel) planFiel = { sorte: s.name, grund: grund };
          if (grund === 'die Kasse') geldFehlt = true;
          /* DER BRAUMEISTER BRENNT KLEINER, EHE ER KALT LAESST.
             Woran das Lagerbier scheitert — Eis, Hopfen, ein Fassplatz —,
             daran scheitert das Schankbier oft nicht: es braucht ein Fuder
             statt zweier und die halbe Menge Hopfen. Ein Brauhaus, dem der
             Eiskeller leer wird, hoert nicht auf zu brauen; es braut das
             geringere Bier. Gemessen war das Gegenteil der Fall: ab 1886
             stand der Plan auf Lagerbier, fiel jede Woche am Eis, und das
             Haus ging vom besten Bier unmittelbar auf den Nachguss zum
             Drittel des Preises — die Zwischenstufe, die es gab, wurde nie
             angesetzt. Der Grund steht an der Tafel; die Wahl bleibt beim
             Spieler, der die Tafel jederzeit umschreiben kann. */
          var kleiner = echteSorten().filter(function (x) { return x.stufe < s.stufe; })
            .sort(function (a, b) { return b.stufe - a.stufe; });
          for (var ei = 0; ei < kleiner.length; ei++) {
            if (!setzeAn(kleiner[ei])) {
              if (!ersatz) ersatz = { statt: s.name, sorte: kleiner[ei].name, grund: grund };
              break;
            }
          }
          break;
        }
      }
    }

    /* 2. DER NOTSUD. Der Braumeister laesst die Pfanne nicht kalt, wenn
       nichts zu verkaufen im Keller liegt oder der Plan bloss am Geld
       gescheitert ist. Der zweite Guss kostet keinen Pfennig, kein Korn und
       keinen Tag der Verleihung — nur die Pfanne. Das ist die Antwort des
       Stuecks auf die leere Kasse, und sie steht an der Tafel, nicht im
       Handbuch. */
    var ns = notSorte();
    /* Nur wirklich in der Not: der Keller ist ganz leer, oder der Plan ist
       am Geld gescheitert und es liegt kein reifes Fass zum Verkauf da.
       Solange etwas im Keller reift, wartet die Pfanne. */
    var nichtsDa = keller().length === 0;
    var nurGeld = geldFehlt && !gebraut && freieFaesser().length === 0;
    var notGrund = null, trebergrenze = null;
    if (ns && (nichtsDa || nurGeld)) {
      var ziel = Math.max(1, Math.ceil(wagenPlaetze() / Math.max(1, ns.fass)));
      /* KEIN ERSTER SUD, KEIN ZWEITER GUSS.

         Bis zum 2. August 2026 stand hier nur die Wagenlast: der Notsud
         durfte die ganze Pfanne fuellen, kostenlos, jede Woche, ohne dass
         je ein bezahlter Sud gelaufen waere. Gemessen war das kein Notnagel
         mehr, sondern das Geschaeft: 1970 braute das Haus vom zweiten
         Braujahr an ausschliesslich Handelsmarke — 4.350 Fass im Jahr 1972,
         ohne einen Pfennig Einsatz — und lief der Kennzahl davon
         (rho +0,829). 1884 dasselbe eine Etage tiefer.

         Der zweite Guss geht auf die Treber des ersten. Wo keiner
         angesetzt wurde, gibt es keine Treber. Was bleibt, ist der eine
         duenne Sud, den ein Brauhaus immer ansetzt — das Gesindebier in
         I bis III, der Lohnbraukontrakt des Handelshauses in IV. Er haelt
         das Haus am Leben und macht es nicht reich. */
      var ng = e.notsud || { jeSud: 1, mindest: 1 };
      var erlaubt = Z.sudeWoche * (ng.jeSud || 0) + (ng.mindest || 0);
      if (ziel > erlaubt) trebergrenze = ng.grund || 'mehr Treber gibt die Pfanne nicht her';
      ziel = Math.min(ziel, erlaubt);
      while (Z.notsud < ziel) {
        notGrund = setzeAn(ns);
        if (notGrund) break;
        Z.notsud++;
      }
    }

    if (gebraut) B.ton.spiele('sud:pfanne', { ort: 'kesselstelle' });

    /* 3. Was an der Tafel darueber steht. */
    var teile = [];
    if (gebraut) teile.push(gebraut + ' Fass angesetzt');
    /* WARUM DER PLAN FIEL, STEHT AUCH DANN DA, WENN DIE PFANNE LIEF.
       Vorher verschluckte der Notsud die Begruendung: an der Tafel stand
       „32 Fass angesetzt · davon 2× Einfachbier — der Keller war leer", und
       dass das Lagerbier am fehlenden Eis gescheitert war, erfuhr niemand.
       Gemessen in 1884: das Haus braute vom zweiten Braujahr an ausschliesslich
       Notbier zum Drittel des Preises, und auf dem Bildschirm stand kein
       einziges Mal, was zu tun gewesen waere. Ein Grund, den der Spieler
       nicht lesen kann, ist kein Grund. */
    if (planFiel) teile.push('kein ' + planFiel.sorte + ': ' + planFiel.grund);
    if (ersatz) teile.push('statt dessen ' + ersatz.sorte + ' — das kommt ohne aus');
    if (Z.notsud && ns) {
      Z.notGesamt += Z.notsud;
      teile.push('davon ' + Z.notsud + '× ' + ns.name + ' ohne Barauslage'
        + (geldFehlt ? ' — für den Plan fehlte die Kasse' : ' — der Keller war leer'));
      if (!Z.notGemeldet) {
        Z.notGemeldet = true;
        B.welt.schreibe((geldFehlt
            ? 'Kein Geld in der Lade, und die Pfanne steht trotzdem am Feuer: '
            : 'Der Keller steht leer, und der Plan trägt nicht: ')
          + 'der Braumeister setzt ' + ns.name + ' an, den zweiten Guss auf dieselben Treber. '
          + 'Kein Pfennig, kein ' + (B.welt.epoche().rohstoff || 'Rohstoff')
          + ', kein Tag der Verleihung — nur die Pfanne. '
          + 'Es ist schlechtes Bier, und es ist Bier.', 'fuhre');
      }
    } else if (!gebraut) {
      teile.push(planSummeSude()
        ? 'Kein Sud: ' + (gruende[0] || notGrund || trebergrenze || 'die Tafel steht leer')
        : (notGrund || trebergrenze ? 'Kein Sud: ' + (notGrund || trebergrenze) : 'Die Tafel ist leer.'));
    } else if (gruende.length) {
      teile.push('dann: ' + gruende[0]);
    }
    /* Und wenn der zweite Guss nur deshalb kurz blieb, weil die Treber
       nicht reichten, steht auch das da. */
    if (trebergrenze && Z.notsud) teile.push('nicht mehr: ' + trebergrenze);
    /* Wenn Geld den Plan aufgehalten hat, steht der Ausweg daneben. Die
       Kasse ist in diesem Stueck nie eine Wand, und die Tafel sagt das
       selbst — sonst glaubt es niemand. */
    if (geldFehlt && ns && !Z.notsud) {
      teile.push(ns.name + ' kostet nichts und steht unter dem Strich der Tafel');
    }
    Z.sudMeldung = teile.join(' · ');
  }

  /* ----------------------------------------------------------------------
     DIE WOCHE, DIE OHNE DEN SPIELER LAEUFT
     ---------------------------------------------------------------------- */
  function umlaufZurueck() {
    var jetzt = woManifest(), zurueck = 0, bruch = 0;
    Z.umlauf = Z.umlauf.filter(function (u) {
      if (u.faellig > jetzt) return true;
      for (var i = 0; i < u.n; i++) {
        if (B.wuerfel.trifft(ep().wagen.bruch)) bruch++; else zurueck++;
      }
      return false;
    });
    Z.draussen = Math.max(0, Z.draussen - zurueck - bruch);
    if (bruch) {
      Z.faesser = Math.max(4, Z.faesser - bruch);
      B.welt.protokolliere({ wer: 'verfall',
        was: bruch + (bruch === 1 ? ' Fass ist' : ' Fässer sind') + ' beim Wirt zersprungen', preis: 0 });
    }
  }

  /* 1600: Fassplätze sind die Währung. Wer nicht warten will, bis das Pfand
     von selbst zurückkommt, schickt den Knecht — und bezahlt dafür. */
  function ziehePfand() {
    var e = ep();
    if (!e.pfand || !Z.draussen) return;
    var preis = Math.round(e.pfand.grund + e.pfand.jeFass * Z.draussen);
    if (!zahleOderKerbe(preis, 'Pfand eingezogen · ' + Z.draussen + ' Fässer')) {
      Z.meldung = 'Die Runde des Knechts kostet ' + B.welt.geld(preis) + '.' + kerbTitel(preis);
      B.sende('zeichne', { grund: 'fuhre-pfand' });
      return;
    }
    var zurueck = Z.draussen;
    Z.umlauf = [];
    Z.draussen = 0;
    Z.meldung = zurueck + ' Fässer sind zurück im Hof.';
    B.ton.spiele('fuhre:fass-rollen', { ort: 'fasslager' });
    B.sende('zeichne', { grund: 'fuhre-pfand' });
  }

  function eisZehrt() {
    var e = ep();
    if (!e.eis) return;
    var brauch = Math.ceil(keller().length / 25) + (keller().length ? 1 : 0);
    if (Z.eis >= brauch) { Z.eis -= brauch; return; }
    Z.eis = 0;
    /* Ohne Eis wird der Keller warm — jedes Fass verliert zwei Wochen. */
    var betroffen = 0;
    keller().forEach(function (f) {
      if (f.haltbar > 2) { f.haltbar -= 2; betroffen++; }
    });
    if (betroffen) {
      B.welt.protokolliere({ wer: 'verfall',
        was: 'Kein Eis: ' + betroffen + ' Fass verlieren zwei Wochen Haltbarkeit', preis: 0 });
    }
  }

  function durstWaechst() {
    var mult = preisMult();
    /* Das Zahlungsziel steht mit im Durst: wer bar zahlen muss, bestellt
       kleiner, und wer anschreiben darf, bestellt groesser. Das ist das
       Gegengewicht, das aus der Zahlungsweise eine Wahl macht statt einer
       Buchungsvorschrift. */
    var st = zielStufe();
    var faktor = B.grenze(1.3 - 0.3 * mult, 0.6, 1.6) * (st ? st.durst : 1);
    haeuser().forEach(function (a) {
      var w = wochenbedarf(a) * faktor * (0.72 + B.wuerfel.zahl() * 0.62);
      Z.durst[a.schluessel] = Math.min(wochenbedarf(a) * 9, durst(a) + w);
      Z.leer[a.schluessel] = (Z.leer[a.schluessel] || 0) + 1;
    });
    /* In JEDER Woche will mindestens ein Haus mehr, als im Keller liegt.
       Nachzaehlbar am Bildschirm: die Fassbetten unter dem Haus gegen die
       Faesser im Keller. */
    var liegt = Math.max(keller().length, freieFaesser().length);
    var l = haeuser().filter(function (a) { return !sperre(a, notSorte()); });
    if (!l.length) l = haeuser();
    if (l.length) {
      var groesster = l[0];
      l.forEach(function (a) { if (durst(a) > durst(groesster)) groesster = a; });
      if (durst(groesster) <= liegt) {
        Z.durst[groesster.schluessel] = liegt + 1 + Math.floor(wochenbedarf(groesster) * 0.5);
      }
    }
  }

  function schreibeZettel() {
    var l = haeuser().filter(function (a) { return durst(a) >= 1; });
    if (!l.length) { Z.zettel = null; return; }
    var wahl = l[0];
    l.forEach(function (a) {
      var p = durst(a) * (1 + (Z.leer[a.schluessel] || 0) * 0.25) * (1 + (Z.mahnung[a.schluessel] || 0));
      var q = durst(wahl) * (1 + (Z.leer[wahl.schluessel] || 0) * 0.25) * (1 + (Z.mahnung[wahl.schluessel] || 0));
      if (p > q) wahl = a;
    });
    var muster = D.zettel[B.welt.zeit.epoche] || D.zettel[1];
    var text = B.wuerfel.aus(muster)
      .replace('{wirt}', wahl.name)
      .replace('{n}', B.welt.menge(Math.round(durst(wahl))));
    Z.zettel = { adr: wahl.schluessel, text: text, fehlt: Math.round(durst(wahl)) };
  }

  /* ----------------------------------------------------------------------
     GEORGI — die Tafel wird gewischt, und der Sommer laeuft ohne Hand ab
     ---------------------------------------------------------------------- */
  function sommerLaeuft() {
    var e = ep(), monate = e.monate;
    var teile = [];
    var sommerAnteil = 1 - e.winteranteil;

    /* Die Hitze: was den Sommer nicht uebersteht, kippt sofort. */
    var gekippt = 0;
    var bleibt = [];
    keller().forEach(function (f) {
      var s = sorteFass(f);
      if (s.sommer) bleibt.push(f); else gekippt++;
    });
    if (gekippt) {
      B.welt.protokolliere({ wer: 'verfall',
        was: 'Georgi: ' + gekippt + ' Fass überstehen den Sommer nicht und kippen', preis: 0, menge: gekippt });
    }

    var vorrat = bleibt.slice();
    var reihenfolge = haeuser().slice().sort(function (x, y) {
      var bx = (x.bindung && x.bindung.wem === 'haus') ? 0 : 1;
      var by = (y.bindung && y.bindung.wem === 'haus') ? 0 : 1;
      if (bx !== by) return bx - by;
      return x.km - y.km;
    });

    var geldGesamt = 0, verkauftGesamt = 0;
    for (var m = 0; m < monate.length; m++) {
      var vorher = vorrat.length;
      var verkauft = 0, geld = 0;
      for (var i = 0; i < reihenfolge.length; i++) {
        var a = reihenfolge[i];
        /* Gegen den Notsud geprueft: welches Fass dann wirklich hingeht,
           entscheidet weiter unten nimmt()/gelistetFuer() je Fass. */
        if (sperre(a, notSorte())) continue;
        var will = Math.round(jahresbedarf(a) * sommerAnteil / monate.length);
        var gab = 0;
        while (gab < will && vorrat.length) {
          var idx = -1;
          for (var v = 0; v < vorrat.length; v++) {
            if (nimmt(a, sorteFass(vorrat[v])) && gelistetFuer(a, sorteFass(vorrat[v]))) { idx = v; break; }
          }
          if (idx < 0) break;
          var f = vorrat.splice(idx, 1)[0];
          geld += preisJeFass(sorteFass(f), a) * 0.86;
          gab++;
        }
        if (gab) {
          verkauft += gab;
          B.welt.protokolliere({ wer: 'spieler', was: 'Sommer: ' + B.welt.menge(gab) + ' an ' + a.name,
            preis: 0, menge: gab, adresse: a.schluessel });
          Z.durst[a.schluessel] = Math.max(0, durst(a) - gab);
        }
      }
      /* Was liegen bleibt, verliert im Sommer. */
      var schwund = Math.round(vorrat.length * 0.08);
      vorrat.splice(0, schwund);
      teile.push({ monat: monate[m], vorher: vorher, verkauft: verkauft,
        schwund: schwund, rest: vorrat.length, geld: Math.round(geld) });
      geldGesamt += geld;
      verkauftGesamt += verkauft;
    }

    /* Der Sommerabsatz geht durch dieselbe Kasse wie jede Lieferung: der Rat
       nimmt sein Teil sofort, nicht in einer Summe zu Georgi. */
    if (geldGesamt > 0) einnahme(Math.round(geldGesamt), 'Sommerabsatz aus dem Aprilbestand');
    Z.jahrUmsatz += geldGesamt;
    Z.georgiEin += Math.round(geldGesamt);

    /* DIE ABGABE. Sie wächst mit dem Ausstoß, nicht mit der Kasse — deshalb
       kann das Haus nicht in eine Wohlstandssingularität davonlaufen. Ungeld,
       Malzaufschlag, Biersteuer: das historische Gegenstück zum Erfolg.

       SIE STEHT HIER NUR NOCH ALS ZAHL. Genommen wurde sie das Jahr über,
       Woche für Woche, bei jeder Einnahme (siehe `einnahme`). Vorher lag sie
       als eine Summe auf dem Georgi-Tag, gedeckelt auf 55 % des freien
       Geldes — eine Wand mit einem Pflaster davor, unmittelbar vor dem
       Michaelitag, an dem das Haus etwas kaufen soll. Der Jahresbetrag ist
       derselbe geblieben (8 %, ZUSTAENDIGKEIT 4); nur der Termin ist weg. */
    var abgabe = Z.abgabeJahr, abgabeName = e.abgabe ? e.abgabe.name : '';

    /* DAS KERBHOLZ WIRD GELOESCHT. Erst in Geld, soweit welches da ist.
       Was offen bleibt, nimmt sich der Glaeubiger NICHT in Geld, sondern in
       der knappen Sache dieser Zeit: Brautage, Sude der Reihe, Eis,
       Regalmeter. Das ist der Preis der Schuld, und er ist nie Zins. */
    var kh = kerbholz();
    Z.kerbGeorgi = null;
    Z.kerbAbzug = 0;
    if (kh && Z.kerben > 0) {
      var hatte = Z.kerben, geloescht = 0;
      /* DIE WOCHE VOR MICHAELI FORDERT NIE MEHR, ALS SIE EINBRINGT
         (ZUSTAENDIGKEIT 17, woertlich). Der Glaeubiger nimmt aus dem, was der
         Umgang und der Sommer hereingebracht haben — nicht aus dem, was das
         Haus fuer den naechsten Tag braucht. Was er dann nicht in Geld
         bekommt, nimmt er wie bisher in der knappen Sache dieser Zeit; das
         ist der Preis der Schuld und er ist nie Zins. */
      /* Und nur die HAELFTE davon. Georgi und Michaeli sind die beiden
         Zinstage des Braujahres, und sie gehoeren verschiedenen Leuten: der
         Glaeubiger nimmt zu Georgi, der Kaufmann rechnet zu Michaeli. Ein
         Haus, das sein ganzes Holz aus dem Michaeligeld glattmacht, steht am
         naechsten Morgen vor der Tafel und kann nichts nehmen. Was offen
         bleibt, nimmt der Glaeubiger wie bisher in der knappen Sache dieser
         Zeit — Brautage, Sude der Reihe, Eis, Regalmeter. Das ist teurer als
         Geld und genau deshalb richtig. */
      var freiFuerKerben = Math.max(0, Math.round((Z.georgiEin - Z.georgiAus) * 0.5));
      while (Z.kerben > 0 && B.welt.haus.kasse >= kh.jeKerbe && freiFuerKerben >= kh.jeKerbe) {
        B.welt.zahle(kh.jeKerbe, kh.kurz + ': eine Kerbe gelöscht', 'spieler');
        Z.kerben -= 1;
        geloescht += 1;
        freiFuerKerben -= kh.jeKerbe;
        Z.georgiAus += kh.jeKerbe;
      }
      var offen = Z.kerben;
      var pf = kh.pfand, genommen = 0, wovon = '';
      /* WAS ZUM HANDWERK GEHOERT, BLEIBT STEHEN.

         Der Glaeubiger nahm bisher, was er wollte — und er nahm genau das,
         womit das Haus ihn haette bezahlen koennen. Gemessen: in 1600 zog
         die Zunft zwoelf von vierzig Suden der Reihe ein, in 1884 holte der
         Eishaendler sechsunddreissig Fuder aus einem Keller, in dem noch
         neunzig lagen — danach gab es kein Lagerbier mehr, also kein Geld,
         also im naechsten Jahr wieder Wechsel. Eine Schuldenspirale, aus der
         kein Zug mehr herausfuehrt (ZUSTAENDIGKEIT 4, die haertere Regel).

         Das Pfandrecht kennt diese Grenze seit je, und seit 1877 steht sie
         in der Zivilprozessordnung: was zur Fortsetzung der Erwerbstaetigkeit
         noetig ist, ist unpfaendbar. Der Glaeubiger nimmt die Haelfte und
         laesst die Haelfte — nicht aus Milde, sondern weil er im naechsten
         Jahr bezahlt werden will. */
      var laesst = (pf && pf.laesst !== undefined) ? pf.laesst : 0.5;
      if (offen > 0 && pf) {
        if (pf.was === 'budget') {
          var grenzeB = Math.floor((e.budget ? e.budget.start : 0) * (1 - laesst));
          genommen = Math.min(offen * pf.menge, Math.max(0, grenzeB));
          Z.kerbAbzug = genommen;
          wovon = genommen + ' ' + (e.budget ? e.budget.name : 'Sude');
        } else if (pf.was === 'eis') {
          genommen = Math.min(Z.eis, offen * pf.menge, Math.floor(Z.eis * (1 - laesst)));
          Z.eis = Math.max(0, Z.eis - genommen);
          wovon = genommen + ' Fuder Eis';
        } else if (pf.was === 'listung') {
          var offenL = offen * pf.menge, weg = [];
          for (var lk in Z.listung) {
            if (weg.length >= offenL) break;
            /* Zwei Regalmeter bleiben immer stehen — der Handel wirft ein
               Haus nicht ganz aus dem Markt, er nimmt ihm die Fläche. */
            if (Object.keys(Z.listung).length - weg.length <= 2) break;
            weg.push(lk);
          }
          weg.forEach(function (lk) { delete Z.listung[lk]; delete Z.listungLeer[lk]; });
          genommen = weg.length;
          wovon = genommen + (genommen === 1 ? ' Regalmeter' : ' Regalmeter');
        }
        B.welt.protokolliere({ wer: 'verfall', preis: 0,
          was: kh.name + ': ' + offen + (offen === 1 ? ' Kerbe' : ' Kerben')
             + ' offen — genommen wurden ' + wovon });
        B.welt.schreibe(kh.name + ': ' + offen + (offen === 1 ? ' Kerbe steht' : ' Kerben stehen')
          + ' noch im Holz. ' + pf.sagt + ' Genommen: ' + wovon + '.', 'fuhre');
      }
      Z.kerbGeorgi = { hatte: hatte, geloescht: geloescht, offen: offen,
        wovon: wovon, sagt: pf ? pf.sagt : '', name: kh.name };
      /* Genommen ist genommen: das Holz wird glattgehobelt. */
      Z.kerben = 0;
    }

    /* Der Keller wird geleert: der Rest ist im Herbst nichts mehr wert. */
    var uebrig = keller().length;
    if (uebrig) B.welt.nimmHeraus(uebrig);
    Z.draussen = 0;
    Z.umlauf = [];

    Z.sommer = {
      jahr: B.welt.zeit.jahr + 1,
      april: bleibt.length + gekippt,
      gekippt: gekippt,
      sommerfest: bleibt.length,
      teile: teile,
      verkauft: verkauftGesamt,
      geld: Math.round(geldGesamt),
      umsatz: Math.round(Z.jahrUmsatz),
      abgabe: abgabe, abgabeName: abgabeName,
      abgabeSatz: e.abgabe ? e.abgabe.sagt : '',
      zahltag: Z.zahltag,
      georgiEin: Z.georgiEin, georgiAus: Z.georgiAus,
      satz: e.sommerSatz,
      rest: vorrat.length,
      kerb: Z.kerbGeorgi,
      notsude: Z.notGesamt,
      verloren: []
    };
    B.ton.spiele('sommer:keller-leer', { ort: 'keller', art: 'schleife' });
  }

  /* Was dieses Braujahr an eine Adresse ging — dieselbe Rechnung, die
     welt.rechneJahrAb gleich in die Reihe schreibt. */
  function jahresLieferung() {
    var m = {};
    B.protokoll.forEach(function (p) {
      if (p.jahr === B.welt.zeit.jahr && p.adresse && p.menge) {
        m[p.adresse] = (m[p.adresse] || 0) + p.menge;
      }
    });
    return m;
  }

  var verlorenJetzt = [];

  function mahnenUndVerlieren() {
    verlorenJetzt = [];
    var geliefert = jahresLieferung();
    alleHaeuser().forEach(function (a) {
      if (Z.verloren[a.schluessel]) return;
      var soll = jahresbedarf(a) * 0.30;
      var ist = geliefert[a.schluessel] || 0;
      if (ist < soll) {
        if (!Z.mahnung[a.schluessel]) {
          /* Beim ERSTEN mageren Jahr wird festgehalten, ob der Gegner damals
             schon an der Tür stand. Nur so lässt sich später ehrlich sagen,
             ob die Adresse genommen oder liegengelassen wurde. */
          Z.fremdBeiMahnung[a.schluessel] = !!(a.bindung && a.bindung.wem && a.bindung.wem !== 'haus');
        }
        Z.mahnung[a.schluessel] = (Z.mahnung[a.schluessel] || 0) + 1;
      } else {
        Z.mahnung[a.schluessel] = Math.max(0, (Z.mahnung[a.schluessel] || 0) - 1);
      }
      if (Z.mahnung[a.schluessel] >= 3) {
        var fremd = Z.fremdBeiMahnung[a.schluessel] ? (a.bindung ? a.bindung.wem : 'gegner') : null;
        Z.verloren[a.schluessel] = { jahr: B.welt.zeit.jahr + 1, fremd: fremd };
        verlorenJetzt.push({ name: a.name, fremd: fremd, reihe: a.reihe.slice() });
        B.welt.binde(a.schluessel, null);
        B.welt.protokolliere({ wer: 'verfall',
          was: a.name + ' führt kein Bier des Hauses mehr', preis: 0, adresse: a.schluessel });
        B.welt.schreibe(a.name + ' nimmt nichts mehr. ' + (fremd
          ? 'Der Gegner stand schon vor der Tür, als es anfing.'
          : 'Niemand hat die Adresse genommen — wir haben sie drei Jahre lang liegen lassen.')
          + ' Die Reihe: ' + a.reihe.map(function (r) { return B.welt.menge(r, true); }).join(' · ')
          + ' von ' + B.welt.menge(jahresbedarf(a)) + '.', 'fuhre');
      }
    });
  }

  function wischeTafel() {
    /* Was voriges Jahr an der Wand stand, wird nicht vergessen — es wird
       gewischt. Zu Michaeli schreibt der Braumeister es wieder an (siehe
       `jahr:`). Vorher stand die Tafel ab dem zweiten Braujahr LEER, und wer
       das Georgi-Blatt zuklappte, ohne neu anzuschreiben, hatte ein
       Brauhaus, das ein Jahr lang nicht braute — ohne dass es irgendwo
       stand. Das war die Haelfte des Einbruchs aus STAND.md §5. */
    Z.planVorjahr = {};
    for (var pk in Z.plan) if (Z.plan[pk]) Z.planVorjahr[pk] = Z.plan[pk];
    Z.plan = {};
    Z.tafelGewischt = true;
    B.welt.schreibe('Georgi. Die Tafel am Sudhaus wird gewischt. ' + ep().sommerSatz, 'fuhre');
  }

  /* ----------------------------------------------------------------------
     EPOCHE EINRICHTEN
     ---------------------------------------------------------------------- */
  function richteEpocheEin(neu) {
    var e = ep();
    Z.epoche = B.welt.zeit.epoche;
    Z.epocheJahr = B.welt.zeit.jahr;
    Z.budget = e.budget ? e.budget.start : 0;
    Z.sudeJeWoche = e.sudeJeWoche || 0;
    Z.faesser = Math.max(Z.faesser, e.faesser);
    Z.fracht = e.fracht ? passendeFracht() : 'stueck';
    Z.halte = e.wagen.halte;
    Z.eisKeller = e.eis ? e.eis.keller : 0;
    Z.eis = e.eis ? e.eis.start : 0;
    Z.ladung = [];
    Z.vorige = null;
    Z.kaufNr = {};
    Z.bannNr = 0;
    Z.plan = {};
    Z.planVorjahr = null;
    /* Ein neuer Glaeubiger, ein neues Holz: ueber einen Epochensprung von
       zweihundert Jahren wird keine Kerbe mitgeschleppt. Und kein Wirt
       schuldet ueber zweihundert Jahre hinweg noch etwas — auch das Holz
       beim Wirt wird glatt. */
    Z.ausstand = {};
    Z.vorschuss = {};
    Z.zahltag = null;
    Z.abgabeJahr = 0;
    Z.ziel = 'ziel';
    Z.zielJahr = 0;
    Z.kerben = 0;
    Z.kerbAbzug = 0;
    Z.kerbGeorgi = null;
    Z.notGesamt = 0;
    Z.notGemeldet = false;
    /* Ein Zutrauen ueberlebt keinen Epochensprung von zweihundert Jahren:
       der Wirt, der das Probefass getrunken hat, ist lange tot. Die Frist
       faengt in der neuen Zeit ebenfalls von vorn an. */
    Z.probe = {};
    Z.probeDieseWoche = 0;
    Z.frist = null;
    /* Und der Antrag der neuen Zeit ist ein anderer: der Rat von 1350 hat
       kein Gebot in 1600 liegen. */
    Z.antrag = null;
    Z.antragErledigt = false;
    Z.ausgang = null;
    Z.uebergabe = null;
    Z.uebergabeNein = 0;
    /* Ein Vorschlag steht an der Tafel, damit die erste Woche laeuft.
       Kein Tutorial — eine Lage, die schon eingestellt ist. */
    var standard = sorten()[1] || sorten()[0];
    Z.plan[standard.k] = e.planStart || 1;

    /* In 1970 gehoeren die Regalmeter der Marke, nicht dem Haus: zwei
       Adressen sind schon gelistet, die anderen nicht. */
    if (e.listung) {
      Z.listung = {};
      var l = alleHaeuser();
      for (var i = 0; i < l.length && i < 6; i++) {
        var o = {}; o[standard.k] = true;
        Z.listung[l[i].schluessel] = o;
      }
    }
    if (neu) normalisiereKeller();
  }

  function normalisiereKeller() {
    var l = sorten();
    keller().forEach(function (f) {
      if (f.k && sorteVon(f.k)) return;
      var s = null;
      for (var i = 0; i < l.length; i++) if (l[i].name === f.sorte) s = l[i];
      if (!s) for (var j = 0; j < l.length; j++) if (l[j].stufe === (f.stufe || 2)) s = l[j];
      if (!s) s = l[1] || l[0];
      f.k = s.k; f.stufe = s.stufe; f.zeichen = s.zeichen;
      f.reife = 0;
      f.haltbar = Math.max(f.haltbar || 4, s.haltbar);
      f.sorte = s.name;
    });
  }

  /* ----------------------------------------------------------------------
     KAEUFE — die Knappheit loesen, nie mit einem Regler
     ---------------------------------------------------------------------- */
  function kaufe(k) {
    var e = ep(), def = null;
    (e.kaeufe || []).forEach(function (x) { if (x.k === k) def = x; });
    if (!def) return;
    if (k === 'eis' && !frostzeit()) return;
    if (k === 'eis' && Z.eis >= Z.eisKeller) return;
    var preis = laufPreis(staffelPreis(k, def.basis, def.staffel));
    if (!zahleOderKerbe(preis, def.text)) {
      Z.meldung = def.text + ' kostet ' + B.welt.geld(preis) + '.' + kerbTitel(preis);
      B.sende('zeichne', { grund: 'fuhre-kauf' });
      return;
    }
    Z.kaufNr[k] = (Z.kaufNr[k] || 0) + 1;
    if (def.staffel > 1) Z.unterhaltExtra += preis * 0.006;

    if (k === 'budget') Z.budget += def.menge;
    else if (k === 'rohstoff') B.welt.haus.rohstoff += def.menge;
    else if (k === 'fass') Z.faesser += def.menge;
    else if (k === 'eis') Z.eis = Math.min(Z.eisKeller, Z.eis + def.menge);
    else if (k === 'eiskeller') Z.eisKeller += def.menge;
    else if (k === 'sudwerk') Z.sudeJeWoche += def.menge;
    else if (k === 'lastzug') Z.halte += def.menge;

    if (k === 'lastzug') ep().wagen.halte = Z.halte;
    B.ton.spiele('fuhre:kauf', { ort: 'hof' });
    B.sende('zeichne', { grund: 'fuhre-kauf' });
  }

  /* DIE EISERNTE DES EIGENEN GESINDES. Solange der Fluss traegt, wird
     geschnitten — das ist Winterarbeit und keine Rechnung. Sie fuellt den
     Keller nicht, sie haelt ihn nur ueber Wasser: wer Lagerbier in Menge
     oder Exportbier will, kauft beim Eishaendler dazu. */
  function eisErnte() {
    var e = ep();
    if (!e.eis || !e.eis.frei || !frostzeit()) return;
    var vorher = Z.eis;
    Z.eis = Math.min(Z.eisKeller, Z.eis + e.eis.frei);
    if (Z.eis > vorher && !Z.eisGemeldet) {
      Z.eisGemeldet = true;
      B.welt.schreibe('Der Fluss trägt. Die Knechte schneiden Eis und fahren es in den Keller — '
        + e.eis.frei + ' Fuder in der Woche, solange der Frost hält. '
        + 'Mehr bringt nur der Eishändler, und der will Geld.', 'fuhre');
    }
  }

  function frostzeit() {
    var e = ep();
    if (!e.eis) return false;
    return B.welt.zeit.woche >= e.eis.frostVon && B.welt.zeit.woche <= e.eis.frostBis;
  }

  function loeseBann(a) {
    var e = ep();
    if (!e.bann) return;
    var preis = Math.round(e.bann.basis * Math.pow(e.bann.staffel, Z.bannNr));
    if (!zahleOderKerbe(preis, 'Bannbrief für ' + a.name)) {
      Z.meldung = 'Der Bannbrief für ' + a.name + ' kostet ' + B.welt.geld(preis) + '.' + kerbTitel(preis);
      B.sende('zeichne', { grund: 'fuhre-bann' });
      return;
    }
    Z.bannNr += 1;
    Z.unterhaltExtra += preis * 0.004;
    Z.bann[a.schluessel] = B.welt.zeit.jahr;
    B.welt.schreibe('Der Rat siegelt den Bannbrief für ' + a.name + '. '
      + 'Das gilt für immer und kostete ' + B.welt.geld(preis) + '.', 'fuhre');
    B.ton.spiele('fuhre:siegel', { ort: 'marktplatz' });
    B.sende('zeichne', { grund: 'fuhre-bann' });
  }

  function liste(a, s) {
    var e = ep();
    if (!e.listung) return;
    var n = 0;
    for (var k in Z.listung) for (var q in Z.listung[k]) if (Z.listung[k][q]) n++;
    var preis = Math.round(e.listung.basis * Math.pow(e.listung.staffel, n));
    if (!zahleOderKerbe(preis, 'Listung ' + s.name + ' beim ' + a.name)) {
      Z.meldung = 'Der Regalmeter beim ' + a.name + ' kostet ' + B.welt.geld(preis) + '.' + kerbTitel(preis);
      B.sende('zeichne', { grund: 'fuhre-listung' });
      return;
    }
    Z.unterhaltExtra += preis * 0.004;
    if (!Z.listung[a.schluessel]) Z.listung[a.schluessel] = {};
    Z.listung[a.schluessel][s.k] = true;
    B.welt.schreibe(s.name + ' steht jetzt im Regal beim ' + a.name + '. '
      + 'Ein Meter, ein Jahr, ' + B.welt.geld(preis) + '.', 'fuhre');
    B.sende('zeichne', { grund: 'fuhre-listung' });
  }

  /* ====================================================================
     DER NAECHSTE ZUG WIRD AM BILDSCHIRM ABGELESEN, NICHT NEBENHER GERECHNET.

     Die Zahl unten rechts heisst "Barschaft geteilt durch den Preis des
     naechsten sinnvollen Zuges". Sie ist nur so viel wert wie ihr Nenner,
     und der war hier zweimal zu grosszuegig:

       · Gemeldet wurde 'Bannbrief' und 'Regalmeter' — Gattungsnamen. Auf dem
         Brett steht kein Knopf 'Regalmeter', dort stehen fuenf, je einer
         beim Faehrhaus, beim Hirsch, am Markt, beim Bahnhofswirt und in der
         Neustadt. Wer die Zahl nachpruefen will, findet den genannten Zug
         nicht.
       · Gemeldet wurde auch, was gar nicht zu haben war: der Preis kam aus
         der Staffel, nicht vom Knopf, und ob der Knopf ueberhaupt gezeichnet
         und bedienbar war, hat niemand gefragt.

     Jetzt wird gemeldet, was dasteht: der billigste Knopf DIESES Stuecks,
     der ein Preisschild traegt (data-preis) und nicht aus ist, mit seiner
     eigenen Beschriftung und der Adresse dazu. Gelesen wird aus dem eigenen
     Fach, unmittelbar nachdem es gezeichnet wurde — dieselbe Quelle, aus
     der auch der Kritiker zaehlt. Findet sich keiner, meldet dieses Stueck
     nichts und ueberlaesst den Nenner denen, die einen haben.
     ==================================================================== */
  function billigsterKnopf() {
    var fach = B.ebene('hand', 'fuhre');
    if (!fach) return null;
    var best = null;
    fach.querySelectorAll('button[data-zug][data-preis]').forEach(function (k) {
      if (k.disabled) return;
      /* Die Wochenkarte traegt Preisschilder, aber keinen Nenner: der
         naechste sinnvolle Zug ist nie „heute fahren", sondern die
         Knappheit. Wer das nicht ausnimmt, ersetzt die beste Zeile des
         Spiels durch die Fuhre dieser Woche. */
      if (k.closest && k.closest('.fu-woche')) return;
      var p = Number(k.getAttribute('data-preis'));
      if (!p || p >= 0) return;                 /* nur was Geld kostet */
      var r = k.getBoundingClientRect();
      if (!r.width || !r.height) return;        /* nicht gezeichnet */
      if (!best || -p < best.preis) {
        best = { preis: -p, zug: k.getAttribute('data-zug'), knopf: k };
      }
    });
    return best;
  }

  /* Die Beschriftung eines Knopfes ist kurz, und zwei davon heissen bloss
     '+' und '−' — an der Anschlagtafel, wo ein Sud mehr den Braumeister das
     Umstellen kostet. 'nächster Zug: + — 4 Pf' waere keine Auskunft. Also
     wird der Name aus dem gebaut, was am Brett steht: die Aufschrift, wenn
     sie traegt, sonst das Wort fuer diese Art Zug, und dahinter immer das
     Ding, um das es geht — die Adresse oder das Bier. */
  var ZUGWORT = {
    'fuhre:tafel-auf': 'Einen Sud mehr',
    'fuhre:tafel-ab': 'Einen Sud weniger'
  };

  function dingName(k) {
    var a = B.welt.adresse(k);
    if (a) return a.name;
    var s = null;
    (sorten() || []).forEach(function (x) { if (x.k === k) s = x; });
    var ns = notSorte();
    if (!s && ns && ns.k === k) s = ns;
    return s ? s.name : null;
  }

  function zugName(b) {
    var teil = String(b.zug).split(':');
    var t = (b.knopf.textContent || '').replace(/\s+/g, ' ').trim();
    /* Das Preisschild steht im Knopf selbst und wuerde sich sonst doppeln. */
    t = t.replace(/\s*[−-]\s*[\d.,]+\s*\S*$/, '').trim();
    if (t.length < 4) t = ZUGWORT[teil[0] + ':' + teil[1]] || teil.slice(1).join(' ');
    var ding = teil.length > 2 ? dingName(teil[2]) : null;
    if (ding && t.indexOf(ding) < 0) t += ' · ' + ding;
    return t || b.zug;
  }

  /* Der naechste sinnvolle Zug — die Zahl, an der die Messlatte haengt.
     Nie der Sud (der faellt von selbst), immer die Knappheit. */
  function meldeZug() {
    /* Steht das Auftragsbuch leer, ist der naechste sinnvolle Zug KEIN Kauf.
       Er kostet null, und genau das wird gemeldet: die Kopfleiste des Kerns
       zeigt daraufhin gar keinen Preis mehr an, statt einem toten Haus einen
       Hopfenlagerbau vorzuschlagen. Was wirklich zu tun ist, steht gross auf
       dem Brett DIE HÄUSER. */
    if (B.welt.zeit.ende) {
      B.welt.meldeZug('kein Zug mehr — das Haus ist zu', 0, 'beiwerk');
      return;
    }

    /* SOLANGE DER ANTRAG LIEGT, IST ER DER ZUG.

       Gemessen (1920x1000, saat=1350, in der Woche, in der der Antrag
       aufschlaegt): die Kopfzeile nannte in allen vier Epochen einen Kauf,
       den die Kasse nicht traegt — 1353 W7 „Abloesung Klosterschenke
       Obernberg — 42 Pf, Kasse reicht 0,0x" —, waehrend zwei Knoepfe
       daneben ueber das Haus selbst entscheiden und +56 Pf danebenliegen.
       Die groesste Entscheidung des Bretts kam in der einen Zahl des
       Bretts nicht vor.

       DER KERN KENNT DIE ART DAFUER NOCH NICHT. `welt.ZUGRANG` reicht bis
       'umkaempft' (Rang 3), und unter gleichem Rang gewinnt der BILLIGERE.
       Der Antrag ist die teuerste Zeile auf dem Brett und verliert damit
       gegen jede Abloesung — gemessen: er gewinnt die Kopfzeile heute in
       0 von 4 Epochen. Mit einem Rang ueber 'umkaempft' gewinnt er in 4 von
       4 (nachgemessen, indem ZUGRANG.ausgang im Browser gesetzt wurde).
       Die Kernbitte steht im Bericht; die Art wird hier schon geschickt,
       damit sie am Tag der Kernaenderung ohne Builder-Runde greift. */
    if (Z.antrag) {
      var ga = ausgangDef();
      var rang = (B.welt.ZUGRANG && B.welt.ZUGRANG.ausgang) ? 'ausgang' : 'umkaempft';
      B.welt.meldeZug((ga && ga.antrag ? ga.antrag.name : 'Der Antrag')
        + ' — der Käufer zahlt, noch ' + Z.frist + (Z.frist === 1 ? ' Woche' : ' Wochen'),
        Z.antrag.summe, rang, 'fuhre:ausgang:ja');
    }

    if (!haeuser().length) {
      var pd1 = probeDef();
      B.welt.meldeZug(pd1 ? pd1.name + ' — ohne Rechnung' : 'Ein Fass verschenken', 0, 'adresse');
      return;
    }

    /* Ab hier zaehlt nur noch, was am Brett steht. Die Art kommt aus dem
       Zugschluessel, weil der Kern sie heute noch nicht liest, sie aber
       lesen soll, sobald der Nenner auf „der billigste Zug, der die Lage
       des Hauses aendert" umgestellt ist. Ein Bannbrief ist eine Bindung,
       ein Regalmeter eine Adresse, ein Kauf ist Lage.  KERN-Eintrag steht
       im Bericht. */
    var b = billigsterKnopf();
    if (!b) return;
    var art = 'lage';
    if (b.zug.indexOf('fuhre:bann:') === 0) art = 'bindung';
    else if (b.zug.indexOf('fuhre:listen:') === 0) art = 'adresse';
    else if (b.zug.indexOf('fuhre:kauf:') === 0) art = 'lage';
    /* Das vierte Argument fehlte hier und war der Grund, warum die
       Kopfzeile eine Zahl halten konnte, zu der kein bedienbarer Knopf mehr
       stand: welt.zugDeckung nimmt nur den beim Wort, der seinen
       Zugschluessel mitschickt (ZUSTAENDIGKEIT 24). */
    B.welt.meldeZug(zugName(b), b.preis, art, b.zug);
  }

  /* ----------------------------------------------------------------------
     DER ZIELSATZ — WELLE 13, R11 (Auflage A2)

     Gemessen: die Woerter Ziel, gewinnen, ueberleben kommen auf dem ersten
     Schirm NULL Mal vor, bei 613 sichtbaren Textzeilen; das gute Ende
     erfaehrt nur, wer ein zugeklapptes Brett aufschlaegt, das drei Wochen im
     Jahr existiert. Der Satz liegt in `uebergabeFehlt()` seit Welle 6 fertig
     im Klartext — er hat nur nie den unteren Rand erreicht.

     Er tritt NEBEN die Zeile „naechster Zug: …" und nicht an ihre Stelle:
     der Rahmen zeichnet ihn eine Zeile hoeher (kern/kopf.js, zeichneZiel).
     Gemeldet wird in JEDER Woche, wie meldeZug — vor jedem Durchgang wird
     vergessen. Ist der Rahmen aelter als dieses Stueck, faellt der Aufruf
     lautlos aus; die Zeile bleibt dann leer statt zu luegen.
     ---------------------------------------------------------------------- */
  function zielNaehe() {
    var m = uebergabeMass();
    var jahre = B.welt.zeit.jahr - Z.startJahr;
    var a = B.grenze(jahre / Math.max(1, m.jahre), 0, 1);
    var b = B.grenze(haeuser().length / Math.max(1, m.haeuser), 0, 1);
    var c = m.ausstoss ? B.grenze(Z.verladenVorjahr / m.ausstoss, 0, 1) : 1;
    return (a + b + c) / 3;
  }

  function meldeZiel() {
    if (!B.welt.meldeZiel) return;          /* Rahmen ohne R3 — dann keine Zeile */
    if (B.welt.zeit.ende) return;           /* nach dem Ende luegt jedes Ziel */
    var u = uebergabeDef();
    if (Z.uebergabe) {
      var rest = Math.max(1, Z.uebergabe.frist === undefined ? UEBERGABE_WOCHEN : Z.uebergabe.frist);
      B.welt.meldeZiel(u.wort + ' liegt auf dem Tisch — noch ' + rest
        + (rest === 1 ? ' Woche' : ' Wochen') + '. Das ist das gute Ende.', 1);
      return;
    }
    var fehlt = uebergabeFehlt();
    if (!fehlt) {
      B.welt.meldeZiel('das Haus weitergeben, solange es steht — zu Michaeli liegt das Angebot.', 0.95);
      return;
    }
    B.welt.meldeZiel('das Haus weitergeben, solange es steht. ' + fehlt, zielNaehe());
  }

  /* ======================================================================
     DAS BILD
     ====================================================================== */

  function brett(klasse, kopf, unter) {
    var b = B.el('div', 'fu-brett ' + klasse);
    var k = B.el('div', 'fu-kopf');
    k.appendChild(B.el('b', null, kopf));
    if (unter) k.appendChild(B.el('span', null, unter));
    b.appendChild(k);
    return b;
  }

  function fassZeichen(f, klein) {
    var s = sorteFass(f);
    var i = B.el('i', 'fu-fass s' + s.stufe + (reif(f) ? '' : ' fu-lagert') + (klein ? ' klein' : ''));
    i.appendChild(B.el('b', null, s.zeichen));
    i.appendChild(B.el('em', null, 'W' + f.woche));
    var rest = (f.reife || 0) - alter(f);
    i.title = s.name + ' · gebraut ' + f.jahr + ', Woche ' + f.woche
      + (rest > 0 ? ' · reif in ' + rest + (rest === 1 ? ' Woche' : ' Wochen')
                  : ' · reif, hält noch ' + Math.max(0, f.haltbar - alter(f)) + ' Wochen');
    return i;
  }

  /* --- DIE HAEUSER ---------------------------------------------------- */
  function zeichneHaeuser(fach) {
    var e = ep();
    var liegt = freieFaesser().length;
    var wollen = 0;
    haeuser().forEach(function (a) { wollen += Math.max(durst(a) > 0 ? 1 : 0, Math.round(durst(a))); });

    var b = brett('fu-haeuser', 'DIE HÄUSER',
      'wollen ' + B.welt.menge(wollen, true) + ' · im Keller liegen ' + B.welt.menge(liegt));

    /* DAS ENDE DIESES HAUSES IST NIE DIE LEERE KASSE. Solange eine Adresse
       Bier des Hauses fuehrt, geht es weiter — notfalls mit Kofent und auf
       Kerbe. Fuehrt keine mehr eines, laeuft die Frist der Epoche, und sie
       steht sichtbar hier: eine Zahl, die jede Woche kleiner wird, und
       daneben der Zug, der sie anhaelt. Er kostet kein Geld. */
    if (!haeuser().length) {
      var fd = fristDef(), pd0 = probeDef();
      var aus = B.el('div', 'fu-ausgelaufen' + (B.welt.zeit.ende ? ' tot' : ''));
      aus.appendChild(B.el('b', null, B.welt.zeit.ende
        ? 'DAS BRAUHAUS ZUM ANKER IST ZU — ' + B.welt.zeit.jahr
        : 'KEIN HAUS DER STADT FÜHRT MEHR BIER DES ANKER'));
      if (B.welt.zeit.ende) {
        aus.appendChild(B.el('span', null, fd.ende));
        aus.appendChild(B.knopf({
          text: 'Das Schlussblatt aufschlagen', zug: 'fuhre:schluss-auf',
          klasse: 'fu-klein',
          titel: 'Chronik des Hauses, die Generationen, und der Weg von vorn.',
          tu: function () { Z.schlussOffen = true; B.sende('zeichne', { grund: 'fuhre-schluss-auf' }); }
        }));
      } else {
        var uhr = B.el('div', 'fu-frist');
        uhr.appendChild(B.el('b', null, 'NOCH ' + (Z.frist === null ? fd.wochen : Z.frist)
          + ((Z.frist === 1) ? ' WOCHE' : ' WOCHEN') + ', DANN NIMMT ' + fd.wer.toUpperCase()
          + ' DEM HAUS DIE GRUNDLAGE'));
        var balken = B.el('span', 'fu-fristbalken');
        var i2 = B.el('i');
        i2.style.width = B.grenze(Math.round((Z.frist === null ? fd.wochen : Z.frist)
          / Math.max(1, fd.wochen) * 100), 0, 100) + '%';
        balken.appendChild(i2);
        uhr.appendChild(balken);
        aus.appendChild(uhr);
        var wer = B.el('span', 'fu-fristsatz', fd.satz);
        wer.title = fd.satz;
        aus.appendChild(wer);
        aus.appendChild(B.el('span', 'fu-weg-zurueck', pd0
          ? 'DER NÄCHSTE ZUG KOSTET KEIN GELD: ' + pd0.name.toUpperCase()
            + ' — an jeder aufgegebenen Adresse hier unten. Ein reifes Fass, ein Halt. '
            + 'Solange eines hinausgeht, steht die Frist still.'
          : 'Die Pfanne brennt weiter, und niemand nimmt das Fass ab.'));
      }
      b.appendChild(aus);
    }

    /* Wer zurückgeholt wurde, steht klein daneben — sonst glaubt niemand,
       dass es geht. */
    if (Z.zurueckGeholt.length) {
      var letzte = Z.zurueckGeholt[Z.zurueckGeholt.length - 1];
      if (B.welt.zeit.jahr - letzte.jahr <= 1) {
        b.appendChild(B.el('div', 'fu-umkehrmeldung',
          letzte.name + ' ist zurück (' + letzte.jahr + ')'
          + (letzte.wie === 'neuer' ? ' — der Wirt hat von selbst angefragt.'
                                    : ' — zurückgeholt ohne einen Pfennig.')));
      }
    }

    if (Z.zettel) {
      var z = B.el('div', 'fu-zettel');
      z.appendChild(B.el('div', 'fu-zettel-text', '„' + Z.zettel.text + '"'));
      b.appendChild(z);
    }

    zeichneZiel(b);

    var liste = B.el('div', 'fu-liste');
    var neediest = null;
    haeuser().forEach(function (a) { if (!neediest || durst(a) > durst(neediest)) neediest = a; });

    alleHaeuser().forEach(function (a) {
      liste.appendChild(hausKarte(a, a === neediest));
    });
    b.appendChild(liste);
    fach.appendChild(b);
    passeListe(liste);
  }

  /* ====================================================================
     JEDE ADRESSE MUSS AUF DAS BRETT PASSEN.

     Gemessen bei 1920x1000: die Liste ist 469 Pixel hoch (Epoche 4: 454),
     zehn bis elf Adressen brauchen 559 bzw. 615. Der Rest lief unten aus
     dem Brett heraus. Sichtbar war er nicht — die Liste rollt —, mit der
     Maus war er es auch nicht: die letzten Zeilen lagen rechnerisch unter
     der Werkbank der STADT (die beginnt bei 874). Genau daher kamen zehn
     der zwoelf unerreichbaren Zuege der Eichung: fuhre:laden/abladen:markt
     und fuhre:bann:obernberg in 1350, laden/abladen:obernberg in 1600,
     laden/abladen:bahnhofswirt in 1884, listen:markt, listen:bahnhofswirt
     und listen:neustadt in 1970. Die Listung ist die epocheneigene Achse
     von 1970; drei ihrer fuenf Knoepfe waren nicht anzufassen, waehrend
     dasselbe Brett 'Bestellung offen: 230 hl' meldete.

     Kein Rollen mehr, sondern engerer Satz: die Liste bekommt ihr eigenes
     Bezugspixel. Jedes calc(var(--s) * n) darin — Schriftgrad, Zeilenhoehe,
     Innenabstand, Luecke — schrumpft im selben Verhaeltnis, das Bild bleibt
     dasselbe, nur kleiner. Der Faktor kommt aus der Messung und nicht aus
     einer Tabelle, damit er auch bei anderer Fensterhoehe und bei mehr
     Adressen stimmt. Untergrenze 0,62: darunter waere die Zeile nicht mehr
     zu lesen, und dann ist Rollen das kleinere Uebel.

     ---------------------------------------------------------------------
     4. AUGUST 2026 — DAS BEZUGSPIXEL WIRD GELESEN, NICHT NACHGERECHNET.
     Hier stand bis heute die Formel aus stil/grund.css ABGESCHRIEBEN:

         var BEZUG = 'min(calc(100vw / 2752), calc(100vh / 1536))';

     Solange sie abgeschrieben war, war unter .fu-liste JEDE Aenderung am
     Bezugspixel wirkungslos — das Brett rechnete sich sein eigenes aus.
     DIE LESBARKEIT hat das an der vierten Latte gemessen: bei Faktor 2,42
     auf --s blieben genau deshalb 80 Textknoten unter 10 px stehen, und
     771 der 1.899 zu kleinen Knoten des ganzen Spiels lagen unter diesem
     einen Brett.

     --s0 aus grund.css ist das reine Buehnenpixel, streng proportional und
     ohne Boden — also genau das, was hier von Hand nachgebaut wurde. Es
     GELESEN statt nachgerechnet heisst: jede kuenftige Aenderung an der
     Skalierung wirkt auch hier. Ein Selbstbezug (--s: calc(f * var(--s)))
     waere nach CSS-Regel ungueltig; darum --s0 und nicht --s.
     ==================================================================== */
  var BEZUG = 'var(--s0)';

  function setzeBezug(el, f) {
    if (f >= 0.999) el.style.removeProperty('--s');
    else el.style.setProperty('--s', 'calc(' + f.toFixed(3) + ' * ' + BEZUG + ')');
  }

  /* DIE UNTERGRENZE — WARUM SIE JETZT TIEFER LIEGEN DARF.

     Sie stand auf 0,62 und der Grund dafuer stand daneben: „darunter waere
     die Zeile nicht mehr zu lesen". Das war richtig, solange jede Schrift
     ein Vielfaches des Bezugspixels war — dann schrumpfte mit dem Abstand
     auch der Buchstabe, und bei 1366x768 landete die Adressliste auf 4,3 px,
     der kleinsten Schrift im ganzen Spiel.

     Seit dem Schriftboden `max(12px, calc(var(--s) * N))` in stil/fuhre.css
     und stil/fuhre-zusatz.css ist das nicht mehr so: DIE SCHRIFT KANN NICHT
     MEHR UNTER 12 PX FALLEN, egal wie klein das Bezugspixel dieser Liste
     wird. Was der Faktor jetzt noch schrumpft, ist ausschliesslich Weissraum
     — Innenabstand der Karte, Luecke zwischen den Karten, Mindesthoehe der
     Zeilen, Groesse der Balken (die haben in fuhre-zusatz.css ihre eigene
     Untergrenze bekommen, damit sie nicht verschwinden). Eine Untergrenze,
     die Lesbarkeit schuetzen sollte, schuetzt nun nur noch Luft.

     Deshalb 0,34 statt 0,62. Gemessen bei 1920x1000, Epoche 1970 (elf
     Adressen — der schlimmste Fall im Spiel):

       Untergrenze   Faktor, bei dem   Liste     von 11 Adressen
                     es zur Ruhe kam   noetig    sichtbar
          0,62            0,620        623 px         7,0
          0,34            0,474        520 px         9,8

     Der Regelkreis laeuft also gar nicht bis 0,34 hinunter — er kommt bei
     0,474 zur Ruhe. Die tiefere Grenze verbietet ihm nur nicht mehr, dorthin
     zu gehen.

     Und die Knopfzeile bleibt dabei bei ihren 24 px: der Knopfboden aus
     grund.css ist ein absolutes Mass und schrumpft nicht mit. Das ist der
     Grund, warum die Karte bei rund 46 px stehenbleibt und nicht weiter
     faellt — tiefer als 13 px Textzeile plus 24 px Knopfzeile plus die
     Balkenreihe geht es nicht, und genau da soll es auch aufhoeren.

     Drei Blicke statt zwei: mit dem Boden trifft der erste Schaetzwert
     schlechter, weil ein Teil der Hoehe (Schrift, Knopf) gar nicht mehr
     mitschrumpft — die Rechnung (frei/voll) unterschaetzt den noetigen
     Faktor. Nachziehen kostet nichts und laesst nichts stehen. */
  var LISTE_GRENZE = 0.34;

  function passeListe(liste) {
    if (!liste) return;
    if (typeof requestAnimationFrame !== 'function') return;
    requestAnimationFrame(function () {
      B.wage('fuhre.liste-passt', function () {
        if (!liste.parentNode) return;
        setzeBezug(liste, 1);
        var frei = liste.clientHeight;
        var voll = liste.scrollHeight;
        if (!frei || !voll || voll <= frei) return;
        var f = B.grenze((frei - 2) / voll, LISTE_GRENZE, 1);
        setzeBezug(liste, f);
        for (var v = 0; v < 3; v++) {
          if (liste.scrollHeight <= liste.clientHeight) break;
          var neu = B.grenze(f * (liste.clientHeight - 2) / liste.scrollHeight,
                             LISTE_GRENZE, 1);
          if (neu >= f - 0.004) break;      /* es bewegt sich nichts mehr */
          f = neu;
          setzeBezug(liste, f);
        }
      });
    });
  }

  /* DAS ZIEL, auf dem Brett DIE HÄUSER: drei Karten nebeneinander, die
     einander ausschliessen, verabredet zu Michaeli und dann ein Jahr lang
     bindend. Daneben steht die Zahl, um die es geht — was gerade im Holz
     steht und am Michaelitag hereinkommt. */
  function zeichneZiel(b) {
    var zd = zielDef();
    if (!zd) return;
    var st = zielStufe();
    var offen = zielOffen();
    var steht = Math.round(ausstandSumme());
    var vor = Math.round(vorschussSumme());

    var w = B.el('div', 'fu-ziel' + (offen ? '' : ' fu-ziel-fest'));
    var kopf = B.el('div', 'fu-ziel-kopf');
    kopf.appendChild(B.el('b', null, zd.name.toUpperCase()));
    kopf.appendChild(B.el('span', 'fu-ziel-stand',
      'im Holz bis Michaeli: ' + B.welt.geld(steht)
      + (vor ? '  ·  abzutrinkendes Angeld: ' + B.welt.geld(vor) : '')));
    w.appendChild(kopf);
    /* Der Erklaersatz steht ZWEIMAL da: als eigene Zeile und im title des
       Blocks. Unter der Entwurfsleinwand blendet stil/fuhre-zusatz.css die
       Zeile aus — sie braucht dort drei Zeilen zu 12 px, also den Platz von
       zwei Adresskarten —, und dann ist der title der Ort, an dem der Satz
       noch zu haben ist. Oberhalb der Leinwand aendert sich nichts. */
    w.title = zd.name.toUpperCase() + ' — ' + zd.satz;
    w.appendChild(B.el('div', 'fu-ziel-satz', zd.satz));

    var reihe = B.el('div', 'fu-ziel-reihe');
    zielStufen().forEach(function (s) {
      var hier = st && s.k === st.k;
      var karte = B.el('div', 'fu-ziel-karte' + (hier ? ' gewaehlt' : ''));
      karte.setAttribute('data-ziel', s.k);
      karte.appendChild(B.el('b', 'fu-ziel-name', s.name));
      karte.appendChild(B.el('div', 'fu-ziel-was', s.was));
      var zahlen = B.el('div', 'fu-ziel-zahlen');
      zahlen.appendChild(B.el('span', null, 'bar ' + Math.round(s.bar * 100) + ' %'));
      zahlen.appendChild(B.el('span', null, 'Bestellung ' + Math.round(s.durst * 100) + ' %'));
      zahlen.appendChild(B.el('span', s.ausfall ? 'schlecht' : 'gut',
        'Ausfall ' + Math.round(s.ausfall * 100) + ' %'));
      karte.appendChild(zahlen);
      karte.appendChild(B.knopf({
        text: hier ? 'So ist es verabredet' : (offen ? 'So verabreden' : 'Nicht mehr zu ändern'),
        zug: 'fuhre:ziel:' + s.k,
        aus: hier || !offen,
        klasse: 'fu-klein',
        titel: s.sagt + (offen
          ? '  Verabredet wird bis zur siebten Woche des Braujahres; danach gilt es bis Michaeli.'
          : '  Das Ziel ist für ' + B.uhr.braujahr() + ' verabredet. Zu Michaeli wird neu geredet.'),
        tu: function () { setzeZiel(s.k); }
      }));
      reihe.appendChild(karte);
    });
    w.appendChild(reihe);
    w.appendChild(B.el('div', 'fu-ziel-fuss', offen
      ? 'Noch ' + Math.max(0, ZIEL_FRIST - B.welt.zeit.woche + 1)
        + (ZIEL_FRIST - B.welt.zeit.woche + 1 === 1 ? ' Woche' : ' Wochen')
        + ', dann gilt das Wort bis Michaeli.'
      : 'Verabredet für ' + B.uhr.braujahr() + '. Am Michaelitag wird gerechnet und neu geredet.'));
    b.appendChild(w);
  }

  function hausKarte(a, wichtig) {
    var e = ep();
    var k = B.el('div', 'fu-haus');
    k.setAttribute('data-adr', a.schluessel);
    var weg = Z.verloren[a.schluessel];
    if (weg) k.classList.add('weg');
    if (wichtig && !weg) k.classList.add('durstig');

    /* Zeile 1: wer, wie weit, an wen gebunden */
    var z1 = B.el('div', 'fu-z1');
    z1.appendChild(B.el('span', 'fu-kuerzel', kurz(a)));
    z1.appendChild(B.el('span', 'fu-name', a.name));
    z1.appendChild(B.el('span', 'fu-km', B.zahl(a.km, a.km < 1 ? 1 : 0) + ' km'));
    var b2 = a.bindung;
    z1.appendChild(B.el('span', 'fu-bindung', weg ? '—'
      : (b2 ? (b2.wem === 'haus' ? 'unser Haus' : b2.wem) : 'frei')));
    k.appendChild(z1);

    /* Zeile 2: was das Haus will — und der eine Handgriff daneben */
    var z2 = B.el('div', 'fu-z2');
    if (weg) {
      z2.appendChild(B.el('span', 'fu-verloren',
        'AUFGEGEBEN ' + weg.jahr + (weg.fremd ? ' — der Gegner hatte sie schon'
                                              : ' — niemand hat sie genommen')));

      /* DER WEG ZURUECK. Er steht an jeder aufgegebenen Adresse, er kostet
         kein Geld, und er ist deshalb auch bei leerer Kasse offen. Was er
         kostet, steht am Knopf: ein Fass und ein Halt. */
      var pd = probeDef();
      if (pd) {
        var stand = probeStand(a), ziel = probeZiel(a);
        var liegt = !!probeGeladen(a);
        var hemmProbe = kannProbe(a);
        var schritt2 = e.wagen.schritt;
        k.classList.add('fu-umkehr');
        var pk = B.knopf({
          text: (liegt ? 'Probe wieder abladen' : pd.kurz + ' · ' + B.welt.menge(schritt2))
            + ' · ' + stand + '/' + ziel,
          zug: 'fuhre:probe:' + a.schluessel,
          klasse: 'fu-klein fu-probe fu-tat' + (liegt ? ' fu-gewaehlt' : ''),
          aus: !liegt && !!hemmProbe,
          titel: hemmProbe && !liegt ? hemmProbe : (pd.satz
            + ' Zutrauen ' + stand + ' von ' + ziel
            + (fremdGebunden(a) ? ' — der Wirt hängt an ' + fremdGebunden(a)
                 + ', das kostet zwei Versuche mehr.' : '.')
            + ' Ein Bier, das er führt, zählt doppelt; ein Notsud zählt einfach.'),
          tu: function () { schalteProbe(a); }
        });
        z2.appendChild(pk);
        var pip = B.el('span', 'fu-zutrauen');
        pip.title = 'Zutrauen des Wirts: ' + stand + ' von ' + ziel + '.';
        for (var pz = 0; pz < ziel; pz++) pip.appendChild(B.el('i', pz < stand ? 'an' : ''));
        z2.appendChild(pip);
      }
    } else {
      var schritt = e.wagen.schritt;
      var will = Math.max(durst(a) > 0 ? 1 : 0, Math.round(durst(a)));
      var hat = geladenFuer(a.schluessel);
      var betten = B.el('span', 'fu-betten');
      var n = Math.min(7, Math.ceil(will / schritt));
      for (var i = 0; i < n; i++) {
        betten.appendChild(B.el('i', 'fu-bett' + (i * schritt < hat ? ' voll' : '')));
      }
      if (!n) betten.appendChild(B.el('i', 'fu-bett satt'));
      z2.appendChild(betten);
      z2.appendChild(B.el('span', 'fu-will', 'will ' + B.welt.menge(will)
        + (hat ? ' · ' + B.welt.menge(hat) + ' geladen' : '')));

      /* grund = was diese Adresse GRUNDSAETZLICH sperrt (Bannmeile, Regal).
         hemm  = was diese WOCHE dem Laden im Weg steht — und das kann null
         sein, obwohl grund steht: der Notsud faehrt ohne Regalmeter. Dann
         stehen beide Knoepfe nebeneinander, der Ausweg und die Loesung. */
      var grund = sperre(a);
      var hemm = kannLaden(a);
      if (grund && e.bann && a.km > e.bannmeile && !Z.bann[a.schluessel]) {
        var preis = Math.round(e.bann.basis * Math.pow(e.bann.staffel, Z.bannNr));
        var bk = kerbZusatz(preis);
        z2.appendChild(B.knopf({
          text: 'Bannbrief' + bk, zug: 'fuhre:bann:' + a.schluessel,
          klasse: 'fu-klein fu-fest fu-tat' + (bk ? ' fu-aufkerbe' : ''), preis: -preis,
          aus: !kannBezahlen(preis),
          titel: e.bann.satz + ' ' + a.name + ' liegt ' + a.km + ' km außerhalb.'
            + kerbTitel(preis),
          tu: function () { loeseBann(a); }
        }));
      } else if (grund && e.listung && !gelistet(a)) {
        var s0 = sorten()[1] || sorten()[0];
        var n2 = 0;
        for (var kk in Z.listung) for (var qq in Z.listung[kk]) if (Z.listung[kk][qq]) n2++;
        var lp = Math.round(e.listung.basis * Math.pow(e.listung.staffel, n2));
        var lk2 = kerbZusatz(lp);
        z2.appendChild(B.knopf({
          text: 'Regalmeter' + lk2, zug: 'fuhre:listen:' + a.schluessel,
          klasse: 'fu-klein fu-fest fu-tat' + (lk2 ? ' fu-aufkerbe' : ''),
          preis: -lp,
          aus: !kannBezahlen(lp),
          titel: e.listung.satz + ' Gelistet würde: ' + s0.name + '.' + kerbTitel(lp),
          tu: function () { liste(a, s0); }
        }));
      }
      if (!grund || (!hemm && !(e.bann && a.km > e.bannmeile && !Z.bann[a.schluessel]))) {
        var kn = B.knopf({
          text: '+ ' + B.welt.menge(e.wagen.schritt), zug: 'fuhre:laden:' + a.schluessel,
          klasse: 'fu-klein fu-laden fu-tat', aus: !!hemm,
          titel: hemm || (B.welt.menge(e.wagen.schritt) + ' für ' + a.name + ' auf den Wagen. '
            + a.name + ' zahlt ' + B.welt.geld(preisJeFass(sorten()[1] || sorten()[0], a)) + ' je Fass.'),
          tu: function () { lade(a); }
        });
        if (!hemm && !Z.fuhren && durst(a) >= 1) kn.classList.add('fu-weiser');
        z2.appendChild(kn);
        z2.appendChild(B.knopf({
          text: '−', zug: 'fuhre:abladen:' + a.schluessel,
          klasse: 'fu-klein fu-ab', aus: !geladenFuer(a.schluessel),
          titel: 'Wieder herunter vom Wagen.',
          tu: function () { entlade(a); }
        }));
      }
    }
    k.appendChild(z2);

    /* Zeile 3: die Reihe der letzten drei Jahre. Daran sieht man zwei Jahre
       vorher, dass eine Adresse verlorengeht — und zwar ohne den Gegner. */
    var z3 = B.el('div', 'fu-z3');
    var soll = jahresbedarf(a);
    var reihe = B.el('span', 'fu-reihe');
    /* DIE ZAHLEN GEHOEREN AN DIE BALKEN, nicht nur daneben. Unter der
       Entwurfsleinwand faellt die Zahlenkette rechts weg (sie stand dort in
       4,3 px und kostet auf 12 px gehoben zwei Adresskarten Liste); ab hier
       traegt der Balken sie selbst, und damit ist nichts verloren. */
    reihe.title = 'Absatz der drei letzten Braujahre: '
      + a.reihe.map(function (r) { return B.welt.menge(r); }).join(' · ')
      + ' gegen den Bedarf von ' + B.welt.menge(soll)
      + '. Bleibt er drei Jahre unter einem Drittel, ist die Adresse weg.';
    a.reihe.forEach(function (r) {
      var saeule = B.el('i', 'fu-saeule' + (r < soll * 0.30 ? ' mager' : ''));
      saeule.style.height = B.grenze(Math.round(r / Math.max(1, soll) * 100), 5, 100) + '%';
      reihe.appendChild(saeule);
    });
    z3.appendChild(reihe);
    z3.appendChild(B.el('span', 'fu-zahlen',
      a.reihe.map(function (r) { return B.welt.menge(r, true); }).join('·')
      + ' von ' + B.welt.menge(soll)));

    if (!weg) {
      var m = Z.mahnung[a.schluessel] || 0;
      var mk = B.el('span', 'fu-mahnung' + (m >= 2 ? ' rot' : ''));
      mk.title = m
        ? m + ' magere Jahre in Folge. Beim dritten nimmt das Haus nichts mehr.'
        : 'Keine Mahnung.';
      for (var q = 0; q < 3; q++) mk.appendChild(B.el('i', q < m ? 'an' : ''));
      z3.appendChild(mk);
    }
    k.appendChild(z3);
    return k;
  }

  /* --- DIE ANSCHLAGTAFEL ---------------------------------------------- */
  function zeichneTafel(fach) {
    var e = ep();
    var b = brett('fu-tafel', e.tafel.name.toUpperCase(), e.tafel.unter);
    /* Die Tafel haengt an der Sudhauswand — der Ort steht als Zeugnis dran,
       gesetzt wird sie ueber die Platzordnung in stil/fuhre.css, weil ein
       Brett dieser Groesse kein Punkt ist. */
    b.setAttribute('data-ort', 'sudhaus');
    b.classList.add('fu-schiefer');

    if (e.budget) {
      var reicht = planSummeBudget() ? Math.floor(Z.budget / planSummeBudget()) : 0;
      var bz = B.el('div', 'fu-budget' + (Z.budget <= 0 ? ' leer' : ''));
      bz.appendChild(B.el('b', null, e.budget.name + ': ' + Z.budget + ' übrig'));
      bz.appendChild(B.el('span', null, planSummeBudget()
        ? 'Dieser Plan frisst ' + planSummeBudget() + ' je Woche — reicht ' + reicht
          + (reicht === 1 ? ' Woche' : ' Wochen')
        : e.budget.satz));
      b.appendChild(bz);
    } else {
      var sz = B.el('div', 'fu-budget');
      sz.appendChild(B.el('b', null, 'Sudhaus: ' + Z.sudeJeWoche
        + (Z.sudeJeWoche === 1 ? ' Sud je Woche' : ' Sude je Woche')));
      sz.appendChild(B.el('span', null, 'Mehr Pfannen gibt es nur gebaut, nicht bestellt.'));
      b.appendChild(sz);
    }

    /* Was in der Kammer liegt — damit der Braumeister nicht wortlos stehen
       bleibt, wenn der Rohstoff ausgeht. */
    var rname = B.welt.epoche().rohstoff || 'Rohstoff';
    var teuerste = 0;
    sorten().forEach(function (so) { if ((Z.plan[so.k] || 0) && so.rohstoff > teuerste) teuerste = so.rohstoff; });
    var reichtFuer = teuerste ? Math.floor(B.welt.haus.rohstoff / teuerste) : null;
    var rz = B.el('div', 'fu-rohstoff' + (reichtFuer !== null && reichtFuer < 3 ? ' knapp' : ''));
    rz.textContent = rname + ' in der Kammer: ' + B.zahl(B.welt.haus.rohstoff)
      + (reichtFuer !== null ? ' — reicht für ' + reichtFuer + (reichtFuer === 1 ? ' Sud' : ' Sude') : '');
    b.appendChild(rz);

    /* DIE SCHERE STEHT AN DER TAFEL, NICHT IM QUELLTEXT. Was Korn, Lohn und
       Fuhre seit dem ersten Jahr dieser Zeit teurer (oder wohlfeiler)
       geworden sind — daneben, was der Satz je Fass macht. Der Spieler soll
       sehen, dass die beiden Zahlen auseinanderlaufen, bevor er es merkt. */
    var sch = Math.round((laufTeuerung() - 1) * 100);
    if (sch !== 0) {
      var scz = B.el('div', 'fu-schere' + (sch > 0 ? ' auf' : ' ab'));
      scz.textContent = 'Korn, Lohn und Fuhre seit ' + (Z.epocheJahr || B.welt.zeit.jahr) + ': '
        + (sch > 0 ? '+' : '−') + Math.abs(sch) + ' im Hundert. '
        + (sch > 0 ? 'Den Satz je ' + B.welt.mengeEinheit() + ' setzt nicht das Haus.'
                   : 'Der Satz je ' + B.welt.mengeEinheit() + ' fällt langsamer.');
      b.appendChild(scz);
    }

    if (Z.tafelGewischt) {
      b.appendChild(B.el('div', 'fu-gewischt',
        'GEWISCHT ZU GEORGI — schreib den Plan für ' + B.uhr.braujahr() + ' an.'));
    }

    var frei = B.welt.zeit.woche <= (e.tafel.freiBis || 3);
    var aendern = frei ? 0 : e.tafel.preis;

    var tab = B.el('div', 'fu-sorten');
    echteSorten().forEach(function (s) {
      var r = B.el('div', 'fu-sorte s' + s.stufe);
      r.title = s.satz;
      var kopf = B.el('div', 'fu-sorte-kopf');
      kopf.appendChild(B.el('i', 'fu-zeichen', s.zeichen));
      kopf.appendChild(B.el('b', null, s.name));
      kopf.appendChild(B.el('span', 'fu-erloes',
        B.welt.geld(preisJeEinheit(s)) + ' je ' + B.welt.mengeEinheit()));
      r.appendChild(kopf);

      var kosten = B.el('div', 'fu-sorte-kosten');
      if (e.budget) kosten.appendChild(B.el('span', null, budgetKosten(s) + ' ' + e.budget.name));
      kosten.appendChild(B.el('span', null, '→ ' + B.welt.menge(s.fass)));
      if (s.reife) kosten.appendChild(B.el('span', 'fu-lagerzeit', s.reife + ' Wo. Lager'));
      kosten.appendChild(B.el('span', null, 'hält ' + s.haltbar + ' Wo.'));
      if (s.eis) kosten.appendChild(B.el('span', 'fu-eiszeichen', s.eis + ' Eis'));
      if (s.sommer) kosten.appendChild(B.el('span', 'fu-sommerfest', 'sommerfest'));
      r.appendChild(kosten);

      var stell = B.el('div', 'fu-stell');
      stell.appendChild(B.knopf({
        text: '−', zug: 'fuhre:tafel-ab:' + s.k, klasse: 'fu-klein',
        aus: !(Z.plan[s.k] > 0),
        titel: 'Einen Sud weniger je Woche.',
        tu: function () { stelleTafel(s, -1, aendern); }
      }));
      stell.appendChild(B.el('span', 'fu-planzahl', String(Z.plan[s.k] || 0)));
      stell.appendChild(B.knopf({
        text: '+', zug: 'fuhre:tafel-auf:' + s.k, klasse: 'fu-klein',
        preis: aendern ? -aendern : 0,
        titel: frei
          ? 'Zu Michaeli steht die Tafel frei. ' + s.satz
          : 'Der Braumeister muss umstellen. Das kostet ' + B.welt.geld(aendern) + '. ' + s.satz,
        tu: function () { stelleTafel(s, +1, aendern); }
      }));
      r.appendChild(stell);
      tab.appendChild(r);
    });

    /* DER NOTSUD — mit Kreide unter den Strich geschrieben. Er kostet keinen
       Pfennig, keinen Rohstoff und keinen Tag der Jahresverleihung: nur die
       Pfanne. Deshalb steht er hier in einer eigenen, mageren Zeile und
       nicht zwischen den drei Bieren des Hauses. */
    var ns = notSorte(), nz = null;
    if (ns) {
      nz = B.el('div', 'fu-notsud' + (Z.notsud ? ' laeuft' : ''));
      var nk = B.el('div', 'fu-notsud-kopf');
      nk.appendChild(B.el('i', 'fu-zeichen', ns.zeichen));
      nk.appendChild(B.el('b', null, ns.name));
      nk.appendChild(B.el('span', 'fu-erloes',
        B.welt.geld(preisJeEinheit(ns)) + ' je ' + B.welt.mengeEinheit()));
      nz.appendChild(nk);
      nz.appendChild(B.el('div', 'fu-notsud-zeile',
        '0 ' + B.welt.waehrung().kurz + ' · 0 ' + (B.welt.epoche().rohstoff || 'Rohstoff')
        + (e.budget ? ' · 0 ' + e.budget.name : '') + ' → ' + B.welt.menge(ns.fass)
        + ' · hält ' + ns.haltbar + ' Wo. · nur die Pfanne'));
      var nstell = B.el('div', 'fu-stell');
      nstell.appendChild(B.knopf({
        text: '−', zug: 'fuhre:tafel-ab:' + ns.k, klasse: 'fu-klein',
        aus: !(Z.plan[ns.k] > 0), titel: 'Einen Notsud weniger je Woche.',
        tu: function () { stelleTafel(ns, -1, 0); }
      }));
      nstell.appendChild(B.el('span', 'fu-planzahl', String(Z.plan[ns.k] || 0)));
      nstell.appendChild(B.knopf({
        text: '+', zug: 'fuhre:tafel-auf:' + ns.k, klasse: 'fu-klein',
        titel: ns.satz + ' Umstellen kostet hier nichts — der Braumeister braucht dafür '
             + 'weder Kreide noch Erlaubnis.',
        tu: function () { stelleTafel(ns, +1, 0); }
      }));
      nz.appendChild(nstell);
    }
    b.appendChild(tab);
    /* Der Notsud haengt UNTER der Sortenliste, nicht darin: die Liste darf
       bei vier Sorten und schmalem Brett rollen, der Weg aus der leeren
       Kasse darf das nie. Er steht immer im Bild. */
    if (nz) b.appendChild(nz);

    if (Z.sudMeldung) b.appendChild(B.el('div', 'fu-sudmeldung', Z.sudMeldung));

    /* DAS KERBHOLZ. Was das Haus schuldig ist, steht sichtbar im Holz —
       und daneben, womit es zu Georgi bezahlt wird. Nie mit Zins. */
    var kh = kerbholz();
    if (kh) {
      var kb = B.el('div', 'fu-kerbholz' + (Z.kerben ? ' offen' : ''));
      var kzeile = B.el('div', 'fu-kerbzeile');
      kzeile.appendChild(B.el('b', null, kh.name.toUpperCase()));
      var holz = B.el('span', 'fu-kerben');
      holz.title = kh.satz;
      for (var ki = 0; ki < kh.kerben; ki++) {
        holz.appendChild(B.el('i', ki < Z.kerben ? 'an' : ''));
      }
      kzeile.appendChild(holz);
      kzeile.appendChild(B.el('span', 'fu-kerbzahl',
        Z.kerben + ' von ' + kh.kerben + ' · 1 Kerbe = ' + B.welt.geld(kh.jeKerbe)));
      kb.appendChild(kzeile);
      var ksatz = B.el('div', 'fu-kerbsatz', Z.kerben ? kh.pfand.sagt : kh.satz);
      ksatz.title = kh.satz + ' ' + kh.pfand.sagt
        + ' Eine Kerbe steht für ' + B.welt.geld(kh.jeKerbe) + '; das Holz fasst '
        + kh.kerben + '.';
      kb.appendChild(ksatz);
      if (Z.kerben) {
        kb.appendChild(B.knopf({
          text: 'Eine Kerbe löschen', zug: 'fuhre:kerbe-loeschen', klasse: 'fu-klein',
          preis: -kh.jeKerbe, aus: !B.welt.kann(kh.jeKerbe),
          titel: 'Bar bezahlen, ehe Georgi kommt. Was zu Georgi offen steht, '
               + 'nimmt sich der Gläubiger anders: ' + kh.pfand.sagt,
          tu: loeseKerbe
        }));
      }
      b.appendChild(kb);
    }

    /* Wovon diese Epoche zu wenig hat. Nie Geld. */
    var kn = B.el('div', 'fu-knappheit');
    kn.appendChild(B.el('b', null, 'KNAPP IN DIESER ZEIT: ' + e.knappheit));
    kn.appendChild(B.el('span', null, e.knappSatz));
    b.appendChild(kn);

    /* Die Knappheit loesen: Preisschilder nebeneinander, die einander
       ausschliessen, weil die Kasse nur fuer eines reicht. */
    var kauf = B.el('div', 'fu-kaeufe');
    (e.kaeufe || []).forEach(function (def) {
      var preis = staffelPreis(def.k, def.basis, def.staffel);
      var aufKerbe = kerbZusatz(preis);
      var aus = !kannBezahlen(preis);
      var titel = def.titel + kerbTitel(preis);
      if (def.k === 'eis') {
        if (!frostzeit()) { aus = true; aufKerbe = '';
          titel = 'Der Fluss trägt nicht mehr. Eis gibt es von Woche '
          + e.eis.frostVon + ' bis ' + e.eis.frostBis + ' und sonst nie.'; }
        else if (Z.eis >= Z.eisKeller) { aus = true; aufKerbe = ''; titel = 'Der Eiskeller ist voll.'; }
      }
      kauf.appendChild(B.knopf({
        text: def.text + aufKerbe, zug: 'fuhre:kauf:' + def.k, preis: -preis,
        klasse: 'fu-klein' + (aufKerbe ? ' fu-aufkerbe' : ''), aus: aus, titel: titel,
        tu: function () { kaufe(def.k); }
      }));

      /* Der Rueckweg. Rohstoff geht zum Bruchteil an den Haendler zurueck —
         der eine Weg, aus einem vollen Speicher Bargeld zu machen, und er
         kostet genau das, was die Pfanne naechste Woche braucht. */
      if (def.rueck) {
        var erloes = Math.max(1, Math.round(def.basis * def.rueck));
        kauf.appendChild(B.knopf({
          text: def.rtext || 'Zurück an den Händler', zug: 'fuhre:rueckkauf:' + def.k,
          preis: erloes, klasse: 'fu-klein fu-rueck',
          aus: B.welt.haus.rohstoff < def.menge,
          titel: (def.rtitel || '') + ' Einkauf ' + B.welt.geld(def.basis)
               + ', Rückgabe ' + B.welt.geld(erloes) + '. In der Kammer liegen '
               + B.zahl(B.welt.haus.rohstoff) + '.',
          tu: function () { verkaufeRohstoff(def); }
        }));
      }
    });
    b.appendChild(kauf);
    fach.appendChild(b);
  }

  function stelleTafel(s, richtung, preis) {
    if (richtung > 0 && preis) {
      if (!zahleOderKerbe(preis, 'Der Braumeister stellt um')) {
        Z.meldung = 'Umstellen kostet ' + B.welt.geld(preis) + '.' + kerbTitel(preis);
        B.sende('zeichne', { grund: 'fuhre-tafel' });
        return;
      }
    }
    Z.plan[s.k] = Math.max(0, (Z.plan[s.k] || 0) + richtung);
    Z.tafelGewischt = false;
    B.ton.spiele('tafel:kreide', { ort: 'sudhaus', laut: 0.4 });
    B.sende('zeichne', { grund: 'fuhre-tafel' });
  }

  /* --- DER KELLER ----------------------------------------------------- */
  function zeichneKeller(fach) {
    var e = ep(), f = keller(), bf = e.keller.bettFass;
    var reifeZahl = f.filter(reif).length;
    var b = brett('fu-keller', e.keller.name.toUpperCase(),
      B.welt.menge(f.length, true) + ' von ' + B.welt.menge(B.welt.vorrat.plaetze)
      + ' · ' + B.welt.menge(reifeZahl, true) + ' reif');

    var gitter = B.el('div', 'fu-gitter');
    gitter.style.setProperty('--spalten', e.keller.spalten);
    var betten = Math.max(1, Math.round(B.welt.vorrat.plaetze / bf));
    for (var i = 0; i < betten; i++) {
      var von = i * bf;
      if (von < f.length) gitter.appendChild(fassZeichen(f[von], bf > 1));
      else {
        var leer = B.el('i', 'fu-fass leer');
        leer.title = 'Leerer Platz im ' + e.keller.name + ' — ' + e.keller.bett;
        gitter.appendChild(leer);
      }
    }
    b.appendChild(gitter);

    var fuss = B.el('div', 'fu-kellerfuss');
    /* GLAETTUNG WELLE 1: Das hiess "Fassplätze: 22 eigene", waehrend zwei
       Zeilen darueber "4 von 12 Fass" stand — zwei verschiedene Zahlen unter
       demselben Wort. Gemeint sind hier die FAESSER des Hauses (Gebinde),
       nicht die Plaetze im Keller. Also heisst es jetzt so. */
    fuss.appendChild(B.el('span', null, 'Fässer des Hauses: ' + Z.faesser + ' eigene · '
      + f.length + ' gefüllt · ' + Z.draussen + ' beim Wirt · ' + fassplaetzeFrei() + ' leer'));
    if (e.eis) {
      var eis = B.el('span', 'fu-eis' + (Z.eis <= 2 ? ' knapp' : ''));
      eis.textContent = 'Eis: ' + Z.eis + ' von ' + Z.eisKeller + ' Fuder'
        + (frostzeit() ? ' · der Fluss trägt' : ' · kein Frost mehr');
      eis.title = e.eis.satz;
      fuss.appendChild(eis);
    }
    if (e.pfand) {
      var pp = Math.round(e.pfand.grund + e.pfand.jeFass * Z.draussen);
      var pk = Z.draussen ? kerbZusatz(pp) : '';
      fuss.appendChild(B.knopf({
        text: e.pfand.name + ' · ' + Z.draussen + ' Fass' + pk,
        zug: 'fuhre:pfand', klasse: 'fu-klein' + (pk ? ' fu-aufkerbe' : ''), preis: -pp,
        aus: !Z.draussen || !kannBezahlen(pp),
        titel: e.pfand.satz + (Z.draussen ? kerbTitel(pp) : ''),
        tu: ziehePfand
      }));
    }
    if (bf > 1) fuss.appendChild(B.el('span', 'fu-einheit', 'Ein Zeichen = ein ' + e.keller.bett
      + ' zu ' + B.welt.menge(bf)));
    b.appendChild(fuss);

    var verdorben = null;
    B.protokoll.slice(-8).forEach(function (p) {
      if (p.wer === 'verfall' && p.jahr === B.welt.zeit.jahr && p.woche === B.welt.zeit.woche) verdorben = p.was;
    });
    if (verdorben) b.appendChild(B.el('div', 'fu-verfall', 'Ohne Hand: ' + verdorben));

    fach.appendChild(b);
  }

  /* --- DER WAGEN ------------------------------------------------------ */
  function zeichneWagen(fach) {
    var e = ep(), fr = frachtstufe();
    var voll = geladen(), kap = wagenPlaetze();
    var b = brett('fu-wagen', (fr ? fr.name : e.wagen.name).toUpperCase(),
      B.welt.menge(voll, true) + ' von ' + B.welt.menge(kap) + ' · '
      + Z.ladung.length + ' von ' + e.wagen.halte + ' Halten');

    if (e.fracht) {
      var reihe = B.el('div', 'fu-fracht');
      e.fracht.forEach(function (st) {
        var lohn = Math.round(st.pauschale + st.jeFass * voll + st.jeKm * 4);
        var jeFass = voll ? Math.round(lohn / voll) : lohn;
        var kn = B.knopf({
          text: st.name + ' · bis ' + B.welt.menge(st.fass),
          zug: 'fuhre:fracht:' + st.k, preis: -lohn,
          klasse: 'fu-klein' + (Z.fracht === st.k ? ' fu-gewaehlt' : ''),
          titel: st.satz + ' Bei der jetzigen Ladung: ' + B.welt.geld(jeFass) + ' je Fass.',
          tu: function () {
            Z.fracht = st.k;
            while (geladen() > wagenPlaetze() && Z.ladung.length) {
              var l = Z.ladung[Z.ladung.length - 1];
              l.faesser.pop();
              if (!l.faesser.length) Z.ladung.pop();
            }
            B.sende('zeichne', { grund: 'fuhre-fracht' });
          }
        });
        reihe.appendChild(kn);
      });
      b.appendChild(reihe);
    }

    var gitter = B.el('div', 'fu-wagenbetten');
    var schritt = e.wagen.schritt;
    var plaetze = Math.min(26, Math.ceil(kap / schritt));
    var gesetzt = 0;
    Z.ladung.forEach(function (l) {
      var a = B.welt.adresse(l.adr);
      var gruppen = Math.ceil(l.faesser.length / schritt);
      for (var g = 0; g < gruppen && gesetzt < plaetze; g++) {
        var f = l.faesser[g * schritt];
        var s = sorteFass(f);
        var bett = B.el('i', 'fu-wbett voll s' + s.stufe + (l.probe ? ' probe' : ''));
        bett.appendChild(B.el('b', null, kurz(a)));
        bett.appendChild(B.el('em', null, l.probe ? '?' : s.zeichen));
        bett.title = B.welt.menge(Math.min(schritt, l.faesser.length - g * schritt)) + ' '
          + s.name + ' für ' + a.name + ' (' + a.km + ' km)'
          + (l.probe ? ' — ' + (probeDef() ? probeDef().name : 'auf Probe') + ', ohne Rechnung' : '');
        gitter.appendChild(bett);
        gesetzt++;
      }
    });
    for (var i = gesetzt; i < plaetze; i++) {
      var leer = B.el('i', 'fu-wbett');
      leer.title = 'Freier Platz auf dem Wagen.';
      gitter.appendChild(leer);
    }
    b.appendChild(gitter);

    /* Der Frachtbrief: was diese eine Fuhre einbringt, Halt für Halt.
       Preisschilder nebeneinander, die einander ausschließen — der Platz,
       den ein Fass belegt, hat kein zweites. */
    var brief = B.el('div', 'fu-frachtbrief');
    if (!Z.ladung.length) {
      brief.appendChild(B.el('div', 'fu-leerzeile', e.wagen.satz));
      brief.appendChild(B.el('div', 'fu-leerzeile',
        'Der Wagen steht. Jedes Fass bekommt ein Haus — dann fährt er.'));
    } else {
      Z.ladung.forEach(function (l) {
        var a = B.welt.adresse(l.adr);
        var erloes = 0, sorteName = {};
        l.faesser.forEach(function (f) {
          if (!l.probe) erloes += preisJeFass(sorteFass(f), a);
          sorteName[sorteFass(f).name] = (sorteName[sorteFass(f).name] || 0) + 1;
        });
        var zeile = B.el('div', 'fu-briefzeile' + (l.probe ? ' probe' : ''));
        zeile.appendChild(B.el('span', 'k', kurz(a)));
        zeile.appendChild(B.el('span', 'n', a.name));
        zeile.appendChild(B.el('span', 'm', Object.keys(sorteName).map(function (s) {
          return B.welt.menge(sorteName[s]) + ' ' + s; }).join(' + ')));
        zeile.appendChild(B.el('span', 'w', B.zahl(a.km, a.km < 1 ? 1 : 0) + ' km'));
        zeile.appendChild(B.el('span', 'g', l.probe ? 'ohne Rechnung'
          : '+' + B.welt.geld(Math.round(erloes))));
        brief.appendChild(zeile);
      });
      var summe = B.el('div', 'fu-briefzeile summe');
      summe.appendChild(B.el('span', 'n', 'Fuhrlohn '
        + (frachtstufe() ? frachtstufe().name : e.wagen.name)));
      summe.appendChild(B.el('span', 'g', '−' + B.welt.geld(fuhrlohn())));
      brief.appendChild(summe);
    }
    b.appendChild(brief);

    var hilfe = B.el('div', 'fu-hilfe');
    hilfe.appendChild(B.knopf({
      text: 'Nach Durst füllen', zug: 'fuhre:fuellen', klasse: 'fu-klein',
      aus: voll >= kap,
      titel: 'Eine Faustregel, kein Rat: der Fuhrmann lädt für die Dürstenden. '
           + 'Der weite Weg und der zahlende Wirt stehen da nicht drin.',
      tu: fuelleNachDurst
    }));
    hilfe.appendChild(B.knopf({
      text: 'Wie vorige Woche', zug: 'fuhre:wie-vorige', klasse: 'fu-klein',
      aus: !Z.vorige, titel: 'Dieselbe Verteilung wie bei der letzten Fuhre.',
      tu: wieVorigeWoche
    }));
    hilfe.appendChild(B.knopf({
      /* GLAETTUNG WELLE 1: Der Knopf hiess in allen vier Epochen "Wagen
         leeren" — auch 1970, wo das Fahrzeug daneben LASTZUG heisst und
         1884, wo gar kein Wagen im Hof steht, sondern eine Bahnrampe.
         Zwei Namen fuer dieselbe Sache auf demselben Brett. */
      text: e.wagen.leeren || 'Wagen leeren', zug: 'fuhre:leeren', klasse: 'fu-klein',
      aus: !voll, titel: 'Alles wieder in den Keller.', tu: leereWagen
    }));
    b.appendChild(hilfe);

    var lohn = fuhrlohn(), erloes = fuhrerloes();
    var aufProbe = probenAufDemWagen();
    var ab = B.knopf({
      text: !voll ? 'FUHRE ABSCHICKEN'
        : (aufProbe === voll
            ? 'FUHRE ABSCHICKEN · ' + B.welt.menge(voll) + ' · ohne Rechnung'
            : 'FUHRE ABSCHICKEN · ' + B.welt.menge(voll) + ' · bringt ' + B.welt.geld(erloes)
              + (aufProbe ? ' · ' + B.welt.menge(aufProbe) + ' auf Probe' : '')),
      zug: 'fuhre:abschicken', klasse: 'fu-abschicken', preis: lohn ? -lohn : 0,
      aus: !voll,
      titel: voll
        ? 'Der Wagen fährt, liefert und kommt zurück. Der Fuhrmann wird danach bezahlt. '
          + 'Damit ist die Woche vorbei.'
        : 'Erst beladen. Jedes Fass bekommt ein Haus.',
      tu: schicke
    });
    b.appendChild(ab);

    if (Z.meldung) b.appendChild(B.el('div', 'fu-meldung', Z.meldung));
    fach.appendChild(b);
  }

  /* ======================================================================
     DIE WOCHENKARTE — was jede Woche im Bild liegt, ohne einen Reiter.

     GROESSE IST HIER EINE REGEL, KEIN GESCHMACK. stadt.js behandelt jedes
     Kind eines fremden Fachs, das groesser ist als GRENZE (3,5 % der
     Buehne), als BRETT und gibt ihm einen Reiter — beim Laden zugeklappt.
     Was darunter bleibt und keine Ausnahme beansprucht (kein .amort, kein
     data-frei), ist eine KARTE IM BILD und bleibt liegen. Die Karte misst
     31,5 x 10,2 Prozent = 3,21 % (stil/fuhre-zusatz.css) und traegt keinen
     Kasten: Schrift im Lichthof, Knoepfe als Chips. Wer hier die Hoehe
     aendert, misst zuerst nach, ob sie noch unter 3,5 % liegt —
     werkbank/schuss/woche-w13/freiflaeche.mjs sagt es in einer Zeile.
     ====================================================================== */
  function zeichneWoche(fach) {
    /* Liegt ein grosses Blatt dieses Stuecks oben, hat die Karte nichts zu
       sagen: das Blatt traegt dann die Entscheidung. */
    if (sommerLiegtOben() || schlussLiegtOben()) return;

    /* SOLANGE DER ANSCHLAG DES RAHMENS LIEGT, TRITT DIE KARTE ZURUECK.

       `kern/start.js` legt seinen Anschlag (Welle 13, R4) auf denselben
       Streifen unten links — gemessen x 2,4–49,4 / y 74,4–95,3 Prozent. Zwei
       Schriften im selben Lichthof uebereinander sind beide unlesbar, und
       sein Knopf „Anfangen" laege genau auf den Chips. Er sagt dasselbe
       zuerst („DAS ZIEL — das Haus so weit bringen, dass es übergeben werden
       kann") und geht von selbst, sobald die Zeit laeuft — beim ersten
       `woche`- oder `jahr`-Ereignis oder auf Klick.
       GELESEN, NICHT ANGEFASST: dieses Stueck sieht nur nach, ob sein Fach
       da ist. Es aendert an fremdem DOM nichts. */
    if (document.getElementById('fach-kopf-kern-start')) return;

    var k = B.el('div', 'fu-woche');
    var lage = wochenLage();
    var reihe = B.el('div', 'fu-wochenwahl');

    /* VIER CHIPS, NICHT MEHR. Die Karte ist 31,5 x 10,2 Prozent gross und
       traegt zwei Zeilen Knoepfe; was darueber hinausgeht, stuende ueber dem
       eigenen Kasten. Der Platz wird deshalb von oben verteilt: das gute
       Ende zuerst, dann der Sprung, dann so viele Fuhrplaene, wie noch
       hineingehen. */
    /* VIER CHIPS AUF DER ENTWURFSLEINWAND, DREI AUF EINEM NOTEBOOKSCHIRM.
       Unterhalb von 820 Bezugspunkten Hoehe gilt der Knopfboden des Rahmens
       (24 px statt calc(var(--s)*40)); vier Chips in zwei Zeilen sind dann
       hoeher als der Kasten. Gemessen bei 1366x768, Epoche 1970: der oberste
       Chip stand 24 px ueber der Kastenkante. Lieber eine Wahl weniger als
       ein Knopf, der ueber seinem eigenen Rand haengt. */
    var frei = (B.buehne && B.buehne.masse && B.buehne.masse().hoehe < 820) ? 3 : 4;
    var alle = planListe();
    var weite = sprungWeite();

    /* DAS GUTE ENDE, wenn es liegt — zuerst und in eigener Farbe.
       Auflage A3: „Solange das Angebot liegt, wird es nicht als einer von elf
       gleich aussehenden Reitern gezeigt." */
    if (Z.uebergabe && !B.welt.zeit.ende) {
      var ur = Math.max(1, Z.uebergabe.frist === undefined ? UEBERGABE_WOCHEN : Z.uebergabe.frist);
      reihe.appendChild(B.knopf({
        text: uebergabeDef().wort.toUpperCase() + ' · noch ' + ur
            + (ur === 1 ? ' Woche' : ' Wochen'),
        zug: 'fuhre:uebergabe-auf', klasse: 'fu-chip fu-gut',
        titel: 'Das einzige Ende, nach dem am nächsten Morgen wieder Feuer unter der Pfanne '
             + 'brennt. Ein Klick legt das Angebot auf den Tisch.',
        tu: function () {
          Z.uebergabeZu = false;
          Z.sommerOffen = false;
          B.sende('zeichne', { grund: 'fuhre-uebergabe-auf' });
        }
      }));
      frei--;
    }

    if (weite >= 2) {
      reihe.appendChild(B.knopf({
        text: 'Weiter wie zuletzt · bis zu ' + weite + ' Wochen',
        zug: 'fuhre:sprung', klasse: 'fu-chip fu-sprung',
        titel: 'Der Fuhrmann fährt dieselbe Runde weiter, ohne dass jemand hinsieht. '
             + 'Angehalten wird, sobald wieder etwas zu entscheiden ist — spätestens zu '
             + 'Michaeli. Was dabei geschah, steht danach hier und in der Chronik.',
        tu: function () { springeWochen(weite); }
      }));
      frei--;
    }

    var plaene = alle.slice(0, Math.max(0, frei));
    plaene.forEach(function (p) {
      reihe.appendChild(B.knopf({
        text: 'Fahren: ' + p.wort + ' · ' + B.welt.menge(p.fass),
        zug: 'fuhre:plan:' + p.k, preis: p.netto,
        klasse: 'fu-chip' + (lage && lage.art === p.k ? ' fu-rat' : ''),
        titel: p.satz + ' — ' + B.welt.menge(p.fass) + ' an ' + p.halte
             + (p.halte === 1 ? ' Adresse' : ' Adressen') + ', Erlös '
             + B.welt.geld(p.erloes) + ', Fuhrlohn ' + B.welt.geld(p.lohn)
             + (p.probe ? ', davon ' + B.welt.menge(p.probe) + ' ohne Rechnung' : '')
             + '. Der Wagen fährt, liefert und kommt zurück — damit ist die Woche vorbei.',
        tu: function () { fahrePlan(p.k); }
      }));
    });

    var kopf = B.el('div', 'fu-wochenkopf');
    kopf.appendChild(B.el('b', null, 'DIE WOCHE ' + B.welt.zeit.woche + '/' + B.uhr.WOCHEN_IM_JAHR));
    kopf.appendChild(B.el('span', 'fu-wochensatz' + (lage ? ' dringend' : ''),
      lage ? lage.satz
        : (!plaene.length
            ? (freieFaesser().length
                ? 'Kein Haus nimmt diese Woche ein Fass. Was zu tun ist, steht auf DIE HÄUSER.'
                : 'Kein reifes Fass im Keller — der Sud fällt von selbst.')
            : (Z.sprungBericht ? Z.sprungBericht + '.'
               : 'Nichts steht an. Der Wagen fährt, wie er zuletzt gefahren ist.'))));

    k.appendChild(kopf);
    k.appendChild(reihe);
    fach.appendChild(k);
  }

  /* --- ZEICHEN AUF DEM BILD ------------------------------------------- */
  function zeichneMarken(fach) {
    alleHaeuser().forEach(function (a) {
      var m = D.marken[a.schluessel];
      if (!m) return;
      if (!B.orte.da(a.ort)) return;
      var marke = B.el('div', 'fu-marke');
      if (Z.verloren[a.schluessel]) marke.classList.add('weg');
      marke.appendChild(B.el('b', null, kurz(a)));
      var betten = B.el('span', 'fu-mbetten');
      var n = Math.min(6, Math.ceil(Math.round(durst(a)) / ep().wagen.schritt));
      for (var i = 0; i < n; i++) betten.appendChild(B.el('i', null));
      marke.appendChild(betten);
      marke.title = a.name + ' · will ' + B.welt.menge(Math.round(durst(a)));
      B.orte.setze(marke, a.ort, { anker: 'mitte', dy: m.dy || 0 });
      fach.appendChild(marke);
    });
  }

  /* --- DER ANTRAG UND DIE UEBERGABE ------------------------------------
     Zwei Blaetter, ein Bauplan: eine Ueberschrift, ein Satz, zwei Knoepfe
     nebeneinander, die einander ausschliessen, und darunter, was aus dem
     Haus wird. Beide liegen LINKS neben dem Schlussblatt und ueber der
     Reiterzeile der STADT, damit sie WEITER nie zudecken (ZUSTAENDIGKEIT
     23) — der Antrag ist eine Entscheidung, kein Riegel. Wer nicht
     entscheidet, klickt weiter, und die Frist laeuft.
     -------------------------------------------------------------------- */
  /* EIN BLATT ZUR ZEIT, UND ZWAR DAS RICHTIGE.

     Gemessen (E1, sorgfaeltig gespielt, 1920x1000): das Uebergabeblatt
     entsteht am Michaelitag — und am Michaelitag legt dieses Stueck auch die
     Georgi-Tafel auf den Tisch. Beide sind im selben Zug frisch, beide liegen
     in derselben Ebene, und die Platzordnung der STADT entscheidet den
     Gleichstand nach der Reihenfolge im DOM. Die Tafel gewann, das
     Uebergabeblatt lag mit `stadt-zugeklappt` darunter, und seine beiden
     Knoepfe trafen sich selbst nicht mehr — genau der Fehler, den
     BEFUND-ENDE §1 fuer das Schlussblatt aufgeschrieben hat, eine Ebene
     tiefer und von diesem Stueck selbst gebaut.

     Also wird nicht gestapelt: solange die Georgi-Tafel liegt, wartet das
     Ausgangblatt. Sie ist die Entscheidung dieses Tages; das Ausgangblatt
     kommt im naechsten Bildlauf, sobald die Tafel weg ist, und ist dann das
     juengste Brett auf dem Tisch. */
  /* WAS AUF DEM TISCH LIEGT, WENN ENTSCHIEDEN WIRD.

     Beide Ausgangblaetter nehmen seit dieser Runde ein Viertel der Buehne —
     sie muessen, sonst klappt die Platzordnung sie zu (der lange Block in
     stil/fuhre-zusatz.css rechnet es vor). Ein Viertel Buehne mit drei
     Saetzen darauf waere Platzgier. Also steht darauf, WORUEBER entschieden
     wird: wer das Haus gefuehrt hat, welche Haeuser sein Bier fuehren, was
     im letzten Braujahr hinausging. Genau die Zahlen, die auf dem
     Schlussblatt danach stehen — nur eben VOR der Entscheidung. */
  function bestandsBlock(wort) {
    var k = B.el('div', 'fu-ausgang-bestand');

    var links = B.el('div');
    links.appendChild(B.el('b', null, 'DIE, DIE ES GEFÜHRT HABEN'));
    var linie = Z.geschlecht.slice(-4);
    if (!linie.length) linie = [{ name: B.welt.zeit.amtszeit.name, seit: B.welt.zeit.amtszeit.seit }];
    if (Z.geschlecht.length > 4) {
      links.appendChild(B.el('div', 'fu-bestandzeile fort',
        '… und ' + (Z.geschlecht.length - 4) + ' davor'));
    }
    linie.forEach(function (p) {
      var r = B.el('div', 'fu-bestandzeile');
      r.appendChild(B.el('span', 'w', p.name));
      r.appendChild(B.el('span', 'v', 'seit ' + p.seit));
      links.appendChild(r);
    });
    var g = B.el('div', 'fu-bestandzeile');
    g.appendChild(B.el('span', 'w', 'Gegründet'));
    g.appendChild(B.el('span', 'v', String(B.welt.haus.gegruendet)));
    links.appendChild(g);
    var f = B.el('div', 'fu-bestandzeile');
    f.appendChild(B.el('span', 'w', 'Fuhren hinausgeschickt'));
    f.appendChild(B.el('span', 'v', B.zahl(Z.fuhren)));
    links.appendChild(f);
    k.appendChild(links);

    var rechts = B.el('div');
    rechts.appendChild(B.el('b', null, wort));
    var h = haeuser();
    if (!h.length) {
      rechts.appendChild(B.el('div', 'fu-bestandzeile fort', 'Kein Haus der Stadt mehr.'));
    }
    h.slice(0, 5).forEach(function (a) {
      var r = B.el('div', 'fu-bestandzeile');
      r.appendChild(B.el('span', 'w', a.name));
      r.appendChild(B.el('span', 'v', B.welt.menge(Math.round(durst(a)))));
      rechts.appendChild(r);
    });
    if (h.length > 5) {
      rechts.appendChild(B.el('div', 'fu-bestandzeile fort', 'und ' + (h.length - 5) + ' weitere'));
    }
    var v = B.el('div', 'fu-bestandzeile');
    v.appendChild(B.el('span', 'w', 'Im letzten Braujahr hinaus'));
    v.appendChild(B.el('span', 'v', B.welt.menge(Z.verladenVorjahr)));
    rechts.appendChild(v);
    var kl = B.el('div', 'fu-bestandzeile');
    kl.appendChild(B.el('span', 'w', B.welt.epoche().lager || 'Im Keller'));
    kl.appendChild(B.el('span', 'v', B.welt.menge(keller().length)));
    rechts.appendChild(kl);
    var ka = B.el('div', 'fu-bestandzeile');
    ka.appendChild(B.el('span', 'w', 'In der Lade'));
    ka.appendChild(B.el('span', 'v', B.welt.geld(B.welt.haus.kasse)));
    rechts.appendChild(ka);
    k.appendChild(rechts);

    return k;
  }

  function zeichneAntrag(fach) {
    if (!Z.antrag || B.welt.zeit.ende || sommerLiegtOben()) return;
    var g = ausgangDef();
    if (!g || !g.antrag) return;
    var a = g.antrag;
    var summe = Z.antrag.summe;

    var bl = B.el('div', {
      klasse: 'blatt fu-ausgangblatt fu-antrag',
      daten: { frei: '1', reiter: a.name }
    });
    bl.appendChild(B.el('h2', null, a.name));
    bl.appendChild(B.el('div', 'fu-ausgang-lage',
      'Noch ' + Z.frist + (Z.frist === 1 ? ' Woche' : ' Wochen') + ', dann entscheidet '
      + a.wer + ' allein.'));
    bl.appendChild(B.el('div', 'fu-satz', a.satz));
    bl.appendChild(bestandsBlock('WAS HERGEGEBEN WIRD'));

    var w = B.el('div', 'fu-ausgang-wahl');
    w.appendChild(B.knopf({
      text: a.ja, zug: 'fuhre:ausgang:ja', preis: summe, klasse: 'gross',
      titel: a.jaTitel, tu: nimmAntrag
    }));
    w.appendChild(B.knopf({
      text: a.nein, zug: 'fuhre:ausgang:nein', klasse: 'gross flach',
      titel: a.neinTitel, tu: schlageAntragAus
    }));
    bl.appendChild(w);

    bl.appendChild(B.el('div', 'fu-ausgang-fuss',
      'Angenommen ist die Partie an diesem Tag zu Ende, und ' + B.welt.geld(summe)
      + ' liegen in der Lade. Ausgeschlagen kommt das Gebot nicht wieder: '
      + (g.fall.anteil ? 'wenn die Frist abläuft, bleiben davon '
          + B.welt.geld(Math.round(summe * g.fall.anteil)) + '.'
        : 'wenn die Frist abläuft, bleibt davon nichts.')));
    fach.appendChild(bl);
  }

  function zeichneUebergabe(fach) {
    if (!Z.uebergabe || Z.antrag || B.welt.zeit.ende || sommerLiegtOben()) return;
    if (Z.uebergabeZu) return;              /* weggelegt, nicht abgelehnt — R14 */
    var u = uebergabeDef();

    var rest0 = Math.max(1, Z.uebergabe.frist === undefined ? UEBERGABE_WOCHEN : Z.uebergabe.frist);
    var bl = B.el('div', {
      /* WELLE 13, R12 — DER REITER TRAEGT DIE FRIST.
         Klappt die Platzordnung das Blatt doch einmal weg, steht wenigstens
         auf dem Reiter, was auf dem Spiel steht und wie lange noch. stadt.js
         nimmt `data-reiter` woertlich und schneidet es nicht. */
      klasse: 'blatt fu-ausgangblatt fu-uebergabe',
      daten: { frei: '1', reiter: u.wort.toUpperCase() + ' · noch ' + rest0
                 + (rest0 === 1 ? ' Woche' : ' Wochen') }
    });
    var rest = Z.uebergabe.frist === undefined ? UEBERGABE_WOCHEN : Z.uebergabe.frist;
    bl.appendChild(B.el('h2', null, u.wort + ' · ' + Z.uebergabe.jahr));
    bl.appendChild(B.el('div', 'fu-ausgang-lage',
      Z.uebergabe.alt + ' führt das Haus seit ' + B.welt.zeit.amtszeit.seit + '. '
      + 'Es steht: ' + (Z.uebergabe.haeuser === 1
          ? 'ein Haus der Stadt führt Bier des Anker'
          : Z.uebergabe.haeuser + ' Häuser der Stadt führen Bier des Anker') + ', '
      + B.welt.menge(Z.uebergabe.verladen) + ' sind im letzten Braujahr hinausgegangen, '
      + 'in der Lade liegen ' + B.welt.geld(B.welt.haus.kasse) + '. '
      + 'Verhandelt wird um Michaeli: noch ' + Math.max(1, rest)
      + (Math.max(1, rest) === 1 ? ' Woche' : ' Wochen') + ', dann liegt das Angebot '
      + 'erst zum nächsten Michaeli wieder da.'));
    /* DIE ELLE DIESER ZEIT, am Blatt und nicht nur im Quelltext. Ohne sie
       liest der Spieler „es steht" als Behauptung; mit ihr sieht er, woran
       es in DIESEM Jahrhundert gemessen wird — und warum die Zahl in 1970
       eine andere ist als in 1350. */
    if (Z.uebergabe.mass && Z.uebergabe.mass.satz) {
      bl.appendChild(B.el('div', 'fu-ausgang-mass', Z.uebergabe.mass.satz));
    }
    bl.appendChild(B.el('div', 'fu-satz', u.satz));
    bl.appendChild(bestandsBlock('WAS ÜBERGEBEN WIRD'));

    var w = B.el('div', 'fu-ausgang-wahl');
    w.appendChild(B.knopf({
      text: 'Das Haus übergeben und aufhören', zug: 'fuhre:uebergabe:ja', klasse: 'gross',
      titel: 'Die Partie endet hier — und das Haus brennt weiter. '
           + 'Das ist das einzige Ende, nach dem am nächsten Morgen wieder angestellt wird. '
           + 'Unwiderruflich.',
      tu: nimmUebergabe
    }));
    w.appendChild(B.knopf({
      text: 'Weiterbrauen — noch ein Braujahr', zug: 'fuhre:uebergabe:nein', klasse: 'gross flach',
      titel: 'Das Angebot kommt zum nächsten Michaeli wieder, solange das Haus steht.',
      tu: schlageUebergabeAus
    }));
    /* Weglegen ist keine Antwort. Der Knopf steht hier, damit der Weg, den
       R14 einem Reiterklick gibt, auch auf dem Blatt selbst zu sehen ist —
       und damit niemand ablehnt, bloss um den Hof wiederzusehen. */
    w.appendChild(B.knopf({
      text: 'Beiseitelegen — das Angebot bleibt liegen', zug: 'fuhre:uebergabe-zu',
      klasse: 'fu-klein',
      titel: 'Das Blatt geht weg, das Angebot nicht. Es steht weiter auf der Wochenkarte, '
           + 'mit der Frist, und ein Klick holt es zurück.',
      tu: function () { Z.uebergabeZu = true; B.sende('zeichne', { grund: 'fuhre-uebergabe-zu' }); }
    }));
    bl.appendChild(w);
    bl.appendChild(B.el('div', 'fu-ausgang-fuss',
      'Ein Haus, das steht, kann man weitergeben. Ein Haus, das keinen Abnehmer mehr hat, '
      + 'kann man nur noch hergeben.'));
    fach.appendChild(bl);
  }

  /* --- DAS GEORGI-BLATT ----------------------------------------------- */

  /* Der eine Weg hinaus. Steht hier oben, weil ihn vier Dinge brauchen: der
     Knopf im Fuss der Tafel, der WEITER-Knopf des Kerns, die Escape-Taste
     und der Wochenwechsel. */
  function schliesseSommer(grund) {
    if (!Z.sommerOffen) return false;
    Z.sommerOffen = false;
    Z.berichtOffen = false;
    B.sende('zeichne', { grund: grund || 'fuhre-sommer-zu' });
    return true;
  }

  /* Liegt die Georgi-Tafel gerade oben? Das Schlussblatt geht vor: wenn das
     Haus zu ist, ist Georgi keine Frage mehr. */
  function sommerLiegtOben() { return !!(Z.sommerOffen && Z.sommer && !schlussLiegtOben()); }
  function schlussLiegtOben() { return !!(Z.schlussOffen && Z.schluss); }

  /* ====================================================================
     ZUSTAENDIGKEIT 23 — DER ZETTEL IST EINE ENTSCHEIDUNG, KEIN RIEGEL.

     Bis hierher lag unter der Georgi-Tafel ein Deckel ueber der ganzen
     Buehne (.fu-sperre, Ebene 'blatt' z=60) und deckte damit auch den
     WEITER-Knopf des Kerns (Ebene 'kopf' z=50). Gemessen wurde, was das
     kostet: ein Spieler, der nur WEITER klickt, kam in allen vier Epochen
     im zweiten Braujahr nicht weiter — 1351/1, 1601/1, 1885/1, 1971/1,
     der Deckel auf 100 Prozent des Fensters, heraus nur ueber zwei Knoepfe,
     die man kennen muss.

     Der Deckel ist ersatzlos weg, und zwar aus drei Gruenden:
       · Er hat gedeckt, was er nicht decken durfte (WEITER).
       · Er hat die Unwahrheit gesagt: neben ihm blieben Bauhof, Reiterleiste
         und Michaeli-Griff bedienbar. Eine Sperre ueber alle Stuecke ist
         Sache des Kerns und keines Stuecks (ZUSTAENDIGKEIT 2).
       · Und er hat seine eigene Tafel ueberlebt: klappt die Platzordnung der
         STADT die Tafel weg, blieb der Deckel liegen — ein schwarzes Fenster
         ohne Knopf darin. Genau das war die Sackgasse in Epoche IV.

     Der Halt zu Georgi bleibt (ZUSTAENDIGKEIT 2): solange die Tafel im Bild
     liegt, schaltet WEITER die Woche NICHT weiter, sondern legt die Tafel
     beiseite. Ein Klick, kein Vorwissen. Liegt sie nicht im Bild, haelt sie
     auch niemanden auf.
     ==================================================================== */

  /* Ist die Tafel fuer die Maus wirklich da? Gemessen an dem Knopf, auf den
     es ankommt: ihrem eigenen Ausgang. Trifft elementFromPoint in seiner
     Mitte den Knopf selbst, liegt die Tafel im Bild und darf aufhalten.
     Trifft er ihn nicht — weil die Platzordnung der STADT sie in einen
     Reiter geklappt hat oder ein fremdes Brett darueberliegt —, dann hat
     dieses Stueck kein Recht, die Woche anzuhalten. Wer nicht sichtbar
     fragt, bekommt keine Antwort. */
  function tafelImBild() {
    var k = document.querySelector('[data-zug="fuhre:sommer-zu"]');
    if (!k) return false;
    var r = k.getBoundingClientRect();
    if (!r.width || !r.height) return false;
    var x = r.left + r.width / 2, y = r.top + r.height / 2;
    if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) return false;
    var t = document.elementFromPoint(x, y);
    return !!(t && (t === k || k.contains(t)));
  }

  /* ====================================================================
     DER JAHRESWECHSEL KOSTET EINEN KLICK, NICHT ANDERTHALB.

     Bis hierher nahm dieser Horcher dem Kern den Klick ab (stopPropagation)
     und legte nur die Tafel beiseite. Gemessen war das ein halber Zug zu
     viel: in Woche 1 jedes Braujahrs war WEITER sichtbar, aktiv und traf
     sich selbst — und die Woche blieb trotzdem stehen. Erst der zweite
     Druck loeste sie. Die eigene Eichung (werkbank/schuss/eichung/messe.mjs)
     zaehlt genau das als "kein Zug veraendert die Woche" und brach in
     Epoche 1 bei 1352/1 ab, nach 60 statt 400 Wochen.

     Jetzt tut ein Druck beides: die Tafel geht beiseite UND die Woche
     laeuft. Der Klick geht weiter an den Kern — kein preventDefault, kein
     stopPropagation. Wer im ersten Halbjahr noch etwas tun will, hat den
     eigenen Ausgang am Fuss der Tafel ('Beiseite legen'); der kostet keine
     Woche. Der Halt zu Georgi bleibt also erhalten fuer den, der ihn will,
     und steht dem nicht mehr im Weg, der weiterwill.
     ==================================================================== */
  function weiterHorcher(ereignis) {
    if (!sommerLiegtOben()) return;
    var ziel = ereignis.target && ereignis.target.closest
      ? ereignis.target.closest('[data-zug="weiter"]') : null;
    if (!ziel) return;
    if (!tafelImBild()) return;          /* dann haelt hier nichts mehr auf */
    B.ton.spiele('tafel:kreide');
    raeumeSommerAb();
  }

  /* ======================================================================
     WELLE 13, R14 — WER EIN GROSSES BLATT AUFLEGT, NIMMT ES BEIM KLICK AUF
     EINEN FREMDEN REITER SELBST WIEDER WEG.  (Entscheidung ③ der Aufsicht,
     Auflage A6.)

     Gemessen wurde, was das heute kostet: acht Reiterklicks unter einem
     liegenden Blatt, achtmal identisch 30 greifbare Zuege — erst der neunte
     brachte 53. „Ein Knopf, der sich anfassen laesst und nichts tut, ist die
     teuerste Sorte Luege in einem Spiel, das nach Klicks bewertet wird."

     Gewaehlt hat die Aufsicht das SCHLIESSEN und nicht das Abschalten der
     Reiter, weil die Reiterleiste DER STADT gehoert und diese Welle DIE
     STADT nicht oeffnet. Also fasst dieses Stueck kein fremdes DOM an: es
     horcht in der Fangphase auf den Klick und nimmt SEIN EIGENES Blatt weg.

     ZWEI FEINHEITEN, die hier Absicht sind:
     · Das UEBERGABEBLATT wird weggelegt, das ANGEBOT nicht. Wer einen Reiter
       anfasst, hat nicht abgelehnt — `Z.uebergabeZu` versteckt nur das
       Blatt, und die Wochenkarte traegt es weiter samt Frist und Knopf, der
       es zurueckholt.
     · DAS SCHLUSSBLATT bleibt liegen. Es ist nach dem Urteil des Kritikers
       das beste Blatt des Spiels, und hinter ihm ist die Partie zu Ende;
       ein Reiter darf es nicht wegwischen. Es hat seinen eigenen Weg (die
       Escape-Taste, siehe tastenSperre).
     ====================================================================== */
  function reiterHorcher(ereignis) {
    var t = ereignis.target && ereignis.target.closest
      ? ereignis.target.closest('[data-zug]') : null;
    if (!t) return;
    var zug = t.getAttribute('data-zug') || '';
    if (zug.indexOf('stadt:reiter:') !== 0) return;
    var etwas = false;
    if (Z.sommerOffen) { Z.sommerOffen = false; Z.berichtOffen = false; etwas = true; }
    if (Z.uebergabe && !Z.uebergabeZu) { Z.uebergabeZu = true; etwas = true; }
    if (!etwas) return;
    /* Wer den Zustand eines Bretts aendert, sendet `zeichne` — die erste der
       beiden Regeln aus dem Kasten „KEIN WUERFEL, ABER TROTZDEM ZUFALL".
       Kein setTimeout: was zu dieser Runde gehoert, gehoert IN die Runde. */
    B.sende('zeichne', { grund: 'fuhre-reiter-blatt-zu' });
  }

  /* „ANFANGEN" MUSS DIE WOCHENKARTE HOLEN.

     Die Karte tritt zurueck, solange der Anschlag des Rahmens liegt (siehe
     zeichneWoche). Der Knopf „Anfangen" raeumt den Anschlag weg, sendet dabei
     aber kein `zeichne` — er muss auch nicht, denn es ist SEIN Blatt und
     nicht meins. Also sieht dieses Stueck selbst nach, und zwar in der
     BLASENPHASE: dann ist der Horcher des Kerns am Knopf schon gelaufen und
     das Fach wirklich fort. Ohne diese vier Zeilen erschiene die Karte erst
     beim naechsten Zeichnen — gemessen: nach „Anfangen" stand kein einziger
     `fuhre:plan:*` im Bild, bis WEITER gedrueckt wurde. */
  function anfangHorcher(ereignis) {
    var t = ereignis.target && ereignis.target.closest
      ? ereignis.target.closest('[data-zug="kern:anfangen"]') : null;
    if (!t) return;
    if (document.getElementById('fach-kopf-kern-start')) return;
    B.sende('zeichne', { grund: 'fuhre-anschlag-weg' });
  }

  /* Die Tafel verschwindet, der Klick laeuft weiter. Neu gezeichnet wird
     hier NICHT: der Kern schaltet gleich die Woche und zeichnet dabei
     ohnehin alles neu. Nur wenn die Woche wider Erwarten stehen bleibt —
     WEITER war doch aus, ein anderer Horcher hat abgebrochen —, holt der
     Bildlauf danach das Zeichnen nach. Sonst bliebe die Tafel liegen,
     obwohl dieses Stueck sie schon abgeraeumt hat. */
  function raeumeSommerAb() {
    if (!Z.sommerOffen) return;
    Z.sommerOffen = false;
    Z.berichtOffen = false;
    var stand = B.welt.zeit.jahr * 100 + B.welt.zeit.woche;
    if (typeof requestAnimationFrame !== 'function') {
      B.sende('zeichne', { grund: 'fuhre-sommer-weiter' });
      return;
    }
    requestAnimationFrame(function () {
      B.wage('fuhre.sommer-nach', function () {
        if (B.welt.zeit.jahr * 100 + B.welt.zeit.woche === stand) {
          B.sende('zeichne', { grund: 'fuhre-sommer-weiter' });
        }
      });
    });
  }

  /* Die Tastatur des Kerns (Leertaste, Eingabe) tut dasselbe wie WEITER, weil
     kern/kopf.js sie auf denselben Knopf legt. Also tut sie hier auch
     dasselbe: sie legt die Tafel beiseite, statt die Woche zu schalten.
     Dieser Horcher laeuft in der Fangphase auf document und damit VOR dem
     Horcher des Kerns, der am selben Knoten in der Blasenphase haengt.
     Angemeldet wird genau einmal, im Aufbau.

     WELLE 11 — stopImmediatePropagation() IST HIER ZU VIEL, UND DER RAHMEN
     HAT ES GEMESSEN.  Es nimmt nicht nur dem Kern die Taste ab, sondern
     JEDEM Horcher, der nach diesem an DEMSELBEN Knoten haengt — auch der
     Blattaufsicht aus kern/haushalt.js, wenn sie eines Tages nach diesem
     Stueck geladen wuerde. Heute rettet sie nur die Ladereihenfolge
     (haushalt.js steht vor jedem Stueck in index.html); das ist eine
     Zusicherung, die kein Stueck geben darf.
     stopPropagation() leistet, worauf es hier ankommt: der Weg zum Kern
     ist zu (die Blasenphase an document findet gar nicht mehr statt), aber
     wer neben diesem Horcher in derselben Phase am selben Knoten steht,
     sieht die Taste weiter. Benannt in
     werkbank/schuss/rahmen-w10/ARBEITSSTAND.md, Auflage 1 fuer Welle 11,
     mit Stelle: stuecke/fuhre.js:3517. */
  function tastenSperre(ereignis) {
    /* Das Schlussblatt zuerst: es liegt ueber allem, auch ueber Georgi. */
    if (schlussLiegtOben()) {
      if (ereignis.key === 'Escape') {
        ereignis.preventDefault();
        ereignis.stopPropagation();
        Z.schlussOffen = false;
        B.sende('zeichne', { grund: 'fuhre-schluss-escape' });
        return;
      }
      if (ereignis.key === ' ' || ereignis.key === 'Enter') {
        ereignis.stopPropagation();
        var eigen0 = ereignis.target && ereignis.target.closest
          && ereignis.target.closest('.fu-schlussblatt');
        if (!eigen0) ereignis.preventDefault();
      }
      return;
    }

    if (!sommerLiegtOben()) return;

    if (ereignis.key === 'Escape') {
      ereignis.preventDefault();
      ereignis.stopPropagation();
      B.ton.spiele('tafel:kreide');
      schliesseSommer('fuhre-sommer-escape');
      return;
    }

    if (ereignis.key === ' ' || ereignis.key === 'Enter') {
      /* Steht der Finger auf einem Knopf DIESER Tafel, behaelt die Taste
         ihre eigene, eingebaute Wirkung. Sonst tut sie genau das, was WEITER
         tut — und das ist seit der Auflage zum Jahreswechsel: Tafel beiseite
         UND Woche weiter. Also nur abraeumen und die Taste durchlassen. */
      var ziel = ereignis.target;
      var eigen = ziel && ziel.closest && ziel.closest('.fu-sommerblatt');
      if (eigen) return;
      if (!tafelImBild()) return;
      B.ton.spiele('tafel:kreide');
      raeumeSommerAb();
    }
  }

  /* DIE TAFEL WIRD AUF DEN TISCH GELEGT, NICHT MITGEZEICHNET.

     Ein Bildlauf spaeter als der Hof — und das ist kein Kunstgriff, sondern
     die Reihenfolge des Tages: erst steht der Hof, dann kommt der Braumeister
     mit dem Blatt. Es hat auch eine gemessene Wirkung: die Platzordnung der
     STADT laesst das Brett oben liegen, das ZULETZT aufgeschlagen hat. Wird
     zu Georgi alles im selben Zug neu gezeichnet, sind alle Bretter gleich
     jung, der Gleichstand faellt nach Ebenenreihenfolge — und 'blatt' kommt
     nach 'hand', also verlor die Georgi-Tafel gegen den Sudplan. Gemessen:
     in 3 von 4 Epochen lag sie beim ERSTEN Georgi als Reiter, also genau
     dann, wenn der Spieler sie zum ersten Mal sehen soll.

     Die Marke verhindert, dass ein veralteter Bildlauf ein zweites Blatt
     nachlegt. Ohne requestAnimationFrame wird sofort gelegt. */
  var sommerMarke = 0;
  function legeSommer(fach) {
    var meine = ++sommerMarke;
    if (!sommerLiegtOben()) return;
    if (typeof requestAnimationFrame !== 'function') { zeichneSommer(fach); return; }
    requestAnimationFrame(function () {
      if (meine !== sommerMarke || !sommerLiegtOben()) return;
      if (fach.querySelector('.fu-sommerblatt')) return;
      B.wage('fuhre.georgi', function () { zeichneSommer(fach); });
    });
  }

  /* ======================================================================
     DIE GEORGI-TAFEL — EIN ANSCHLAG, KEIN AUSHANG.   (Welle 11)

     WAS GEMESSEN WAR, und es ist die groesste Einzelzahl dieser Welle:
     `werkbank/schuss/fuhre-w11/messungen/vorher-sonde-w30.txt`, dreissig
     WEITER ohne Escape, Vorzustand 7896ee6, 2752x1536 —

       .fu-sommerblatt   1596x847 = 1.351.246 px^2   (1350, 1600)
                         1596x718 = 1.145.541        (1884)
                         1596x943 = 1.504.427        (1970)
       DIE FUHRE gesamt  1,15 bis 1,52 Mio Bildpunkte = 27 bis 36 % der Flaeche
       alle neun Stuecke 41 bis 51 % (Huellen) bzw. 44,8 bis 53,3 %
                         (photographisch, bild-w9/deckung.mjs)

     Dieses eine Blatt war der Grund. Und es war kein Unrat: es traegt die
     Rechenschaft ueber den Sommer UND die einzige Jahresentscheidung des
     Hauses. Der blinde Kritiker hat das ausdruecklich anerkannt („Das ist
     ein Modal, kein Unrat, und ich rechne es dem Spiel nicht als Schmutz
     an") und trotzdem 45 bis 53 Prozent gezaehlt. Beides ist wahr.

     DIE TRENNUNG, DIE DARAUS FOLGT — und sie ist nicht „weniger anzeigen":

       DER ANSCHLAG liegt.  Er traegt den Tag, den Sommer in einer Zeile,
       die vier Sudknoepfe mit ihren Preisschildern nebeneinander, den
       Stand der Tafel und die beiden Griffe. Das ist die ENTSCHEIDUNG,
       und sie liegt weiter formatfuellend genug, um eine zu sein: sie
       haelt die Woche an, sie liegt oben, sie geht mit Escape, WEITER und
       ihrem eigenen Knopf wieder weg.

       DER BERICHT klappt auf.  Monat fuer Monat, Zahltag, Abgabe,
       Kerbholz, Notsude, verlorene Adressen, der Weg zum guten Ende —
       jede Zeile, die vorher dalag, steht weiter da, hinter EINEM Knopf,
       der sie aufschlaegt und wieder zuklappt. Nichts ist fort und
       nichts ist gekuerzt.

       AN DREI STELLEN IST DER WORTLAUT TROTZDEM ANDERS, und weil hier
       „nichts steht nur noch im Titelfeld" stand, was nicht stimmte,
       steht es jetzt genau:

         · Die Ueberschrift „Was steht 1351/52 an der Tafel?" und die
           Zeile „An der Tafel steht: 2x Duennbier — der Braumeister hat
           angeschrieben, was voriges Jahr dort stand." sind EINE Zeile
           geworden: „… Angeschrieben: 2x Duennbier — wie voriges Jahr."
           Der Satz ueber den Braumeister steht im `title` derselben
           Zeile. Zwei Zeilen fuer eine Sache kosten auf 265 px Hoehe ein
           Zehntel der Tafel.
         · Der Schliessknopf heisst „Tafel schliessen — Michaeli" statt
           „… Michaeli, das Jahr beginnt"; der Rest steht in seinem
           `title`.
         · Der Hinweis unter den Griffen ist auf eine Zeile gebracht;
           sein voller Wortlaut steht im `title` desselben Knopfes.

       Jede dieser Auskuenfte ist ohne Klick lesbar — verkuerzt im Bild,
       vollstaendig im `title` desselben Elements. Aber es ist eine
       Umformulierung, keine reine Verschiebung, und wer die alte Zeile
       sucht, findet sie so nicht wieder. Nachgezaehlt in
       `werkbank/schuss/fuhre-w11/ARBEITSSTAND.md`, §2.

     WAS DABEI NICHT ANGEFASST WURDE, weil daran die zweite Messlatte
     haengt: die Klasse `.fu-sommerblatt`, die Zugschluessel
     `fuhre:jahresplan:*` und `fuhre:sommer-zu`, die Reihenfolge der
     Sorten und die Wirkung jedes Knopfes. Die messende Hand
     (`rueckkopplung-r3/linie.mjs`, Woche 1 jedes Braujahres) sucht genau
     diese drei Dinge; wer eines davon umbenennt, aendert die Partie.

     UND WARUM DER ANSCHLAG SEINE MASSE AUS DEM STILBLATT NIMMT: er ist
     dort auf `max(26%, 700px)` Breite und `max(17%, 265px)` Hoehe
     gedeckelt — auf der Entwurfsleinwand hoechstens 716x265 = 189.740 px^2,
     also 4,49 % der Flaeche und unter der Schwelle von 200.000 px^2, die
     `BRAUHAUS.haushalt.tafeln()` zieht. Der Deckel ist eine CSS-Zusage und
     keine Rechnung im Kopf: was auch immer eine Epoche in die Zeilen
     schreibt, groesser wird der Kasten nicht. Damit die Entscheidung davon
     nichts abbekommt, klebt der Fuss (`position: sticky`), auf dem sie
     steht — was ueberlaeuft, ist der Kopf, nie ein Knopf.

     GEMESSEN, nach 30 x WEITER ohne Escape, 2752x1536
     (`werkbank/schuss/fuhre-w11/messungen/nachher-sonde-w30.txt`, auf dem
     ausgelieferten Stand noch einmal in `abn-sonde-w30.txt`):

       716x254 = 181.909 px^2   (1350, 1600)
       716x239 = 171.288 px^2   (1884, 1970)

     Der Deckel von 265 px wird also gar nicht ausgeschoepft; die Tafel
     endet bei 254 bzw. 239 px, weil der Inhalt vorher aufhoert. Hier stand
     bis zum Neuanlauf 189.612/182.803 px^2 — das waren die Masse eines
     Zwischenstands der Bauprobe (`messungen/probe2.txt`, 716x265 und
     716x255) und nicht die des gemessenen Standes.
     ====================================================================== */

  /* DER BERICHT. Jede Zeile stand vorher auf dem Blatt; hier steht sie
     unveraendert, nur eben hinter einem Knopf. */
  function sommerBericht(s, e) {
    var k = B.el('div', 'fu-sommer-bericht');

    k.appendChild(B.el('div', 'fu-satz', e.sommerSatz));
    k.appendChild(B.el('div', 'fu-satz stark',
      'Der Aprilbestand: ' + B.welt.menge(s.april) + '. Davon sommerfest: '
      + B.welt.menge(s.sommerfest) + '. Gekippt in der ersten Hitze: ' + B.welt.menge(s.gekippt) + '.'));

    var tab = B.el('div', 'fu-sommer-tab');
    s.teile.forEach(function (t) {
      var z = B.el('div', 'fu-sommer-zeile');
      z.appendChild(B.el('span', 'm', t.monat));
      var bar = B.el('span', 'balken');
      var i = B.el('i');
      i.style.width = B.grenze(Math.round(t.rest / Math.max(1, s.sommerfest) * 100), 0, 100) + '%';
      bar.appendChild(i);
      z.appendChild(bar);
      z.appendChild(B.el('span', 'w', 'ausgeliefert ' + B.welt.menge(t.verkauft)
        + ' · Schwund ' + B.welt.menge(t.schwund) + ' · im Keller ' + B.welt.menge(t.rest)));
      tab.appendChild(z);
    });
    k.appendChild(tab);

    k.appendChild(B.el('div', 'fu-satz stark',
      'Sommerabsatz: ' + B.welt.menge(s.verkauft) + ' für ' + B.welt.geld(s.geld)
      + '. Übrig und wertlos: ' + B.welt.menge(s.rest) + '.'));
    if (s.abgabe) {
      k.appendChild(B.el('div', 'fu-abgabe',
        s.abgabeName + ' auf einen Umsatz von ' + B.welt.geld(s.umsatz) + ': −'
        + B.welt.geld(s.abgabe) + '   ·   ' + s.abgabeSatz
        + '  Genommen wurde sie Woche für Woche, bei jeder Einnahme — nicht heute.'));
    }

    /* DER UMGANG VOR MICHAELI. Er steht hier, weil dies der Tag ist, an dem
       er stattfindet, und weil der Spieler morgen vor der Michaelitafel
       steht und wissen muss, woher das Geld kommt. */
    if (s.zahltag && (s.zahltag.gesamt || s.zahltag.posten.length)) {
      var t = s.zahltag;
      var zt = B.el('div', 'fu-zahltag');
      zt.appendChild(B.el('b', null, t.name.toUpperCase() + ' — ' + t.stufe));
      zt.appendChild(B.el('div', 'fu-satz', t.satz));
      var tl = B.el('div', 'fu-zahltag-liste');
      t.posten.forEach(function (p) {
        var z2 = B.el('div', 'fu-zahltag-zeile');
        z2.appendChild(B.el('span', 'n', p.name));
        z2.appendChild(B.el('span', 'g', B.welt.geld(p.zahlt) + ' gezahlt'));
        z2.appendChild(B.el('span', p.aus ? 'a schlecht' : 'a',
          p.aus ? B.welt.geld(p.aus) + ' nicht einzutreiben' : 'nichts offen'));
        tl.appendChild(z2);
      });
      t.angeldPosten.forEach(function (p) {
        var z3 = B.el('div', 'fu-zahltag-zeile angeld');
        z3.appendChild(B.el('span', 'n', p.name));
        z3.appendChild(B.el('span', 'g', B.welt.geld(p.betrag) + ' Angeld'));
        z3.appendChild(B.el('span', 'a', 'wird abgetrunken'));
        tl.appendChild(z3);
      });
      zt.appendChild(tl);
      zt.appendChild(B.el('div', 'fu-satz stark',
        'In die Lade: ' + B.welt.geld(t.gesamt)
        + (t.ausgefallen ? '. Nicht einzutreiben: ' + B.welt.geld(t.ausgefallen) : '')
        + '. Damit geht das Haus morgen an die Michaelitafel.'));
      if (t.angeld) zt.appendChild(B.el('div', 'fu-satz', t.angeldSatz));
      k.appendChild(zt);
    }

    /* Die Auflage der Aufsicht, nachrechenbar auf dem Blatt: was diese Woche
       einbrachte, und was sie forderte. */
    k.appendChild(B.el('div', 'fu-satz stark',
      'Die Woche vor Michaeli: ' + B.welt.geld(s.georgiEin) + ' herein, '
      + B.welt.geld(s.georgiAus) + ' hinaus.'));

    /* Die Abrechnung des Kerbholzes — in Geld, soweit welches da war, und
       im uebrigen in der knappen Sache dieser Zeit. */
    if (s.kerb && s.kerb.hatte) {
      var kz = B.el('div', 'fu-kerbabrechnung');
      kz.appendChild(B.el('b', null, s.kerb.name.toUpperCase() + ': '
        + s.kerb.hatte + (s.kerb.hatte === 1 ? ' Kerbe' : ' Kerben')));
      kz.appendChild(B.el('div', null, s.kerb.geloescht
        ? s.kerb.geloescht + (s.kerb.geloescht === 1 ? ' Kerbe' : ' Kerben') + ' in Geld gelöscht.'
        : 'Keine einzige in Geld gelöscht — es war keines da.'));
      if (s.kerb.offen) {
        kz.appendChild(B.el('div', null, s.kerb.offen
          + (s.kerb.offen === 1 ? ' Kerbe blieb offen' : ' Kerben blieben offen')
          + '. ' + s.kerb.sagt + ' Genommen: ' + s.kerb.wovon + '.'));
      } else {
        kz.appendChild(B.el('div', null, 'Das Holz ist glatt. Nichts genommen.'));
      }
      k.appendChild(kz);
    }

    if (s.notsude) {
      k.appendChild(B.el('div', 'fu-satz',
        'Aus der Not gebraut: ' + s.notsude + ' Sud '
        + (notSorte() ? notSorte().name : 'Notbier') + ' in diesem Braujahr. '
        + 'Ohne Barauslage — und ohne dass jemand dafür Geld gesehen hätte, das nicht da war.'));
    }

    if (s.verloren && s.verloren.length) {
      var vl = B.el('div', 'fu-verlust');
      vl.appendChild(B.el('b', null, s.verloren.length === 1
        ? 'Eine Adresse ist weg:' : s.verloren.length + ' Adressen sind weg:'));
      s.verloren.forEach(function (v) {
        vl.appendChild(B.el('div', null, v.name + ' — ' + (v.fremd
          ? 'der Gegner stand schon da, als es anfing'
          : 'niemand hat sie genommen; wir haben drei Jahre lang nichts geliefert')
          + '   ·   Reihe ' + v.reihe.map(function (r) { return B.welt.menge(r, true); }).join(' · ')));
      });
      k.appendChild(vl);
    }

    /* WIE WEIT DAS HAUS VOM GUTEN ENDE WEG IST.

       Ein Ende, das nur dann sichtbar wird, wenn es eintritt, ist fuer den
       Spieler kein Ende, sondern eine Ueberraschung. Also steht einmal im
       Jahr — am Michaelitag, wo diese Tafel ohnehin liegt — hier, was noch
       fehlt: die Jahre, die Haeuser, die Lade, der Ausstoss. Wer es liest,
       weiss, dass es das gute Ende gibt, bevor er es erreicht. Liegt das
       Angebot bereits, steht das ebenfalls hier und nicht nur auf einem
       Blatt, das die Platzordnung in einen Reiter klappen kann. */
    if (!B.welt.zeit.ende) {
      var fehltU = Z.uebergabe ? null : uebergabeFehlt();
      k.appendChild(B.el('div', 'fu-sommer-uebergabe', Z.uebergabe
        ? uebergabeDef().wort + ' liegt auf dem Tisch: das Haus steht gut genug, um es '
          + 'weiterzugeben. Das Blatt trägt die beiden Knöpfe; sein Reiter heißt „'
          + uebergabeDef().wort + '".'
        : 'Weitergeben statt hergeben: ' + (fehltU || 'das Haus steht.')
          + ' ' + uebergabeMass().satz));
    }

    return k;
  }

  /* DER SOMMER IN EINER ZEILE — was auf dem Anschlag steht, wenn der
     Bericht zugeklappt ist. Es ist keine Kuerzung des Berichts, sondern
     seine Summe: was hinausging, was es einbrachte, was verdarb, was in
     die Lade kam. Wer eine der vier Zahlen nachrechnen will, klappt auf. */
  function sommerZeile(s) {
    var t = [];
    t.push('ausgeliefert ' + B.welt.menge(s.verkauft) + ' für ' + B.welt.geld(s.geld));
    if (s.gekippt) t.push('gekippt ' + B.welt.menge(s.gekippt));
    if (s.rest) t.push('übrig ' + B.welt.menge(s.rest));
    if (s.zahltag && s.zahltag.gesamt) t.push('in die Lade ' + B.welt.geld(s.zahltag.gesamt));
    if (s.abgabe) t.push(s.abgabeName + ' −' + B.welt.geld(s.abgabe));
    return 'Der Sommer ' + s.jahr + ': ' + t.join(' · ') + '.';
  }

  function zeichneSommer(fach) {
    if (!sommerLiegtOben()) return;
    var s = Z.sommer, e = ep();
    var weit = !!Z.berichtOffen;

    /* Kein Deckel mehr ueber der Buehne — siehe den Block bei
       schliesseSommer(). Die Tafel ist ein Blatt auf dem Tisch, kein Riegel
       vor der Tuer, und seit Welle 11 ist sie ausserdem so schmal, dass
       WEITER (84–93 / 94–98 Prozent) nicht einmal in ihre Naehe kommt. */
    /* JEDES GEORGI IST EIN EIGENES BLATT, und es sagt das auch.

       Die Platzordnung der STADT erkennt ein Brett an seiner Klassenliste
       und merkt sich, wann es zuletzt aufgeschlagen hat; wer zuletzt
       aufschlug, liegt oben. Ein Brett, das verschwindet und ein Jahr
       spaeter wiederkommt, behielt dabei seinen alten Zeitstempel — es war
       damit das aelteste auf dem Tisch und wurde von jedem juengeren Brett
       zugeklappt. Gemessen: die Georgi-Tafel lag in 9 von 12 Jahreswechseln
       als Reiter, obwohl DIE STADT den Jahreswechsel ausdruecklich
       aufschlagen laesst ("Ein formatfuellendes Blatt zum Jahreswechsel
       ist eine Entscheidung").

       Die Jahreszahl in der Klasse ist keine List, sondern die Wahrheit:
       die Tafel von 1352 ist nicht die Tafel von 1351. Damit ist sie jedes
       Jahr neu auf dem Tisch und liegt oben, solange die Entscheidung
       ansteht. data-reiter beschriftet ihren Reiter, falls die Platzordnung
       sie danach doch zuklappt — dann ist der Weg zurueck beschriftet und
       nicht zu erraten.

       WELLE 11, ZWEITER TEIL DERSELBEN REGEL: die Tafel deckt jetzt 4,5 %
       der Flaeche statt 27 bis 36 %. Die Regel der STADT, die ein Blatt zum
       Jahreswechsel aufschlaegt, greift ab 25 % (`stadt.js:1408`) — diese
       hier ist also zu klein dafuer. Sie liegt trotzdem auf, und zwar aus
       dem Grund darueber: ein Brett, das WAEHREND des Spiels neu auftaucht,
       gilt der Platzordnung als eben geholt und schlaegt auf. Nachgemessen
       in `messungen/nachher-sonde-w30.txt`: `Sommerblatt true`, alle vier
       Planknoepfe „trifft" in allen vier Epochen. */
    var bl = B.el('div', {
      klasse: 'blatt fu-sommerblatt fu-georgi-' + s.jahr + (weit ? ' fu-weit' : ''),
      daten: { frei: '1', reiter: 'Georgi ' + s.jahr + ' · Jahresplan' }
    });
    bl.setAttribute('role', 'dialog');
    bl.setAttribute('aria-modal', 'true');
    bl.setAttribute('aria-label', 'Georgi ' + s.jahr);

    /* DER KOPF klebt oben. Das Blatt liegt zwischen den beiden Zinstagen und
       heisst deshalb nach beiden: zu Georgi wird die Tafel gewischt, zu
       Michaeli wird gerechnet und neu angeschrieben. */
    var kopf = B.el('div', 'fu-sommer-kopf');
    kopf.appendChild(B.el('h2', null,
      'Von Georgi ' + s.jahr + ' bis Michaeli — der Sommer und der Zahltag'));
    kopf.appendChild(B.el('div', 'fu-sommer-kurz', sommerZeile(s)));
    bl.appendChild(kopf);

    /* WELLE 13, R12 — DAS GUTE ENDE STEHT DA, WO DER SPIELER OHNEHIN
       HINSIEHT.

       Das Uebergabeblatt wird zu Michaeli gesetzt (`pruefeUebergabe` am Ende
       von `jahr:`), gezeichnet wird es aber erst, wenn dieses Blatt weg ist
       — also ab Woche 2. Genau das hat der Kritiker gesehen: „Woche 2, 3 und
       4 jedes Jahres, 15 von 284 Wochen, null Mal bemerkt." Die Georgi-Tafel
       ist das eine Blatt, das in jedem Braujahr von selbst aufliegt. Also
       nennt sie das Angebot beim Namen, in eigener Farbe, mit der Frist. */
    if (Z.uebergabe && !Z.antrag && !B.welt.zeit.ende) {
      var uu = uebergabeDef();
      var ur = Math.max(1, Z.uebergabe.frist === undefined ? UEBERGABE_WOCHEN : Z.uebergabe.frist);
      var band = B.el('div', 'fu-sommer-uebergabe');
      band.appendChild(B.el('b', null, uu.wort.toUpperCase() + ' · ' + Z.uebergabe.jahr));
      band.appendChild(B.el('span', null,
        'Das Haus steht gut genug, um es weiterzugeben — '
        + (Z.uebergabe.haeuser === 1 ? 'ein Haus der Stadt führt sein Bier'
           : Z.uebergabe.haeuser + ' Häuser der Stadt führen sein Bier') + ', '
        + B.welt.menge(Z.uebergabe.verladen) + ' sind hinausgegangen. '
        + 'Das Angebot liegt noch ' + ur + (ur === 1 ? ' Woche' : ' Wochen') + '. '
        + 'Es ist das einzige Ende, nach dem am nächsten Morgen wieder angestellt wird.'));
      band.appendChild(B.knopf({
        text: uu.wort + ' ansehen', zug: 'fuhre:sommer-uebergabe',
        klasse: 'gross fu-gut',
        titel: 'Legt dieses Blatt beiseite und schlägt das Angebot auf.',
        tu: function () {
          Z.uebergabeZu = false;
          schliesseSommer('fuhre-sommer-uebergabe');
        }
      }));
      bl.appendChild(band);
    }

    if (weit) bl.appendChild(sommerBericht(s, e));

    /* DER FUSS klebt unten und traegt die Entscheidung.

       Er scrollt nicht mit — sonst haengt er bei einem aufgeschlagenen
       Bericht (viele verlorene Adressen, viele Sorten) unter der Kante und
       ist bei 1920x937 nicht mehr zu treffen. So steht er bei jeder
       Aufloesung an derselben Stelle. Seit Welle 11 steht dort nicht mehr
       nur der Ausgang, sondern die ganze Jahresentscheidung: sie ist das
       eine, was diese Tafel unbedingt zeigen muss. */
    var fuss = B.el('div', 'fu-sommer-fuss');

    /* DIE FRAGE UND DER STAND IN EINER ZEILE. Sie standen vorher in zwei —
       eine Ueberschrift „Was steht 1351/52 an der Tafel?" und darunter „An
       der Tafel steht: …". Zwei Zeilen fuer eine Sache kosten auf einem
       Anschlag von 261 px Hoehe ein Zehntel der Tafel; gesagt wird
       dasselbe. */
    var frage = B.el('h3');
    frage.appendChild(B.el('b', null, 'Was steht ' + B.uhr.braujahr() + ' an der Tafel?'));
    frage.appendChild(B.el('span', null, planSummeSude()
      ? 'Angeschrieben: ' + sorten().filter(function (x) { return Z.plan[x.k]; })
          .map(function (x) { return Z.plan[x.k] + '× ' + x.name; }).join(' · ')
        + ' — wie voriges Jahr.'
      : 'Nichts. Dann steht die Pfanne kalt.'));
    frage.title = planSummeSude()
      ? 'Der Braumeister hat angeschrieben, was voriges Jahr dort stand. '
        + 'Jeder Knopf setzt einen Sud dazu.'
      : 'Steht nichts an der Tafel, wird das ganze Braujahr nicht gebraut.';
    fuss.appendChild(frage);

    var wahl = B.el('div', 'fu-sommer-wahl');
    sorten().forEach(function (so) {
      wahl.appendChild(B.knopf({
        text: so.name + ' · ' + (e.budget ? budgetKosten(so) + ' ' + e.budget.name + ' → ' : '')
              + B.welt.menge(so.fass) + (so.sommer ? ' · sommerfest' : ''),
        zug: 'fuhre:jahresplan:' + so.k,
        preis: -so.kosten,
        titel: so.satz,
        tu: function () { Z.plan[so.k] = (Z.plan[so.k] || 0) + 1; Z.tafelGewischt = false;
          B.sende('zeichne', { grund: 'fuhre-jahresplan' }); }
      }));
    });
    fuss.appendChild(wahl);

    var griffe = B.el('div', 'fu-sommer-griffe');
    griffe.appendChild(B.knopf({
      /* Der eine Knopf, hinter dem der ganze Bericht liegt. Er sagt, was
         er aufschlaegt — ein Knopf, der „mehr" heisst, ist keiner. */
      text: weit ? 'Sommerbericht zuklappen' : 'Der ganze Sommerbericht',
      zug: 'fuhre:sommer-bericht',
      klasse: 'fu-klein',
      titel: weit
        ? 'Zurück auf den Anschlag. Die Entscheidung bleibt stehen.'
        : 'Der Sommer Monat für Monat, der Umgang vor Michaeli, die Abgabe, '
          + 'das Kerbholz, die Notsude, verlorene Adressen und der Weg zum guten Ende.',
      tu: function () { Z.berichtOffen = !Z.berichtOffen;
        B.sende('zeichne', { grund: 'fuhre-sommer-bericht' }); }
    }));
    griffe.appendChild(B.knopf({
      /* ZUSTAENDIGKEIT 23, zweiter Teil: ein sichtbarer Knopf mit dem Wort
         darauf, das ihn schliesst. Das Wort steht vorn, damit es auch dann
         zu lesen ist, wenn die Zeile schmal wird. */
      text: 'Tafel schließen — Michaeli',
      zug: 'fuhre:sommer-zu', klasse: 'fu-klein',
      titel: 'Michaeli, das Jahr beginnt. Zurück auf den Hof. Solange die Tafel '
        + 'auf dem Tisch liegt, ruht die Woche; WEITER und die Taste Escape legen '
        + 'sie ebenfalls beiseite.',
      tu: function () { schliesseSommer('fuhre-sommer-zu'); }
    }));
    fuss.appendChild(griffe);

    /* Derselbe Satz wie bisher, auf eine Zeile gebracht: er muss stehen —
       er ist die einzige Stelle, an der steht, dass diese Tafel die Woche
       anhaelt — und er darf den Anschlag nicht zweizeilig machen. Der
       ganze Wortlaut steht im Titel des Schliessknopfes. */
    fuss.appendChild(B.el('div', 'fu-sommer-hinweis',
      'Die Woche ruht, solange die Tafel liegt · WEITER und Escape legen sie beiseite'));
    bl.appendChild(fuss);

    fach.appendChild(bl);
  }

  /* ======================================================================
     WARUM DIESE TAFEL SICH NICHT MIT `BRAUHAUS.blatt.melde()` ANMELDET —
     gebaut, gemessen und wieder ausgebaut, und deshalb steht es hier.

     Der Rahmen bietet den Stuecken an, ihr Blatt anzumelden; die Aufsicht
     laeuft dann in dem Augenblick, in dem es aufschlaegt, und haelt
     „hoechstens ein ganzseitiges Blatt". Diese Tafel hat es getan, und es
     hat sie das Leben gekostet. Gemessen bei 1366x768, 30 Wochen ohne
     Escape (`messungen/klein1.txt` gegen `messungen/vorher-klein1.txt`):

       vorher   Sommerblatt 792x492 offen · erb-buch zu
       mit melde()  Sommerblatt FORT · erb-buch 308.428 px^2 offen

     Die Kette dahinter, Glied fuer Glied:
       1. Der Anschlag ist klein. Damit klappt die Platzordnung der STADT
          das Erbe-Buch nicht mehr zu — vorher ueberdeckte die grosse Tafel
          es um mehr als DECKGRENZE, und das aeltere Brett fiel.
       2. Unterhalb der Entwurfsleinwand skaliert die Blattgrenze mit der
          Flaeche: bei 1366x768 sind 200.000 px^2 nur noch 49.632 px^2. Der
          Anschlag (700x265 = 185.500) ist dort ein „ganzseitiges Blatt".
       3. `raeumeAuf(false)` behaelt das ZULETZT ins DOM gehaengte Blatt.
          Das Fach DES ERBEN steht hinter dem der FUHRE — also blieb das
          Buch liegen und die Jahresentscheidung ging zu.

     Dazu kaeme ein zweiter Preis, den der Rahmen selbst aufgeschrieben
     hat: `melde()` laeuft bei JEDEM Zeichnen und erzwingt dabei ein Layout
     ueber die ganze Buehne. Genau diese Arbeit je Bildaufbau hat der
     Rahmen in Welle 10 wieder ausgebaut, weil sie 1350 zwischen zwei
     Laeufen derselben Saat auseinandergehen liess (ρ −0,336 gegen +0,270).

     Die Tafel braucht die Aufsicht auch nicht: sie hat einen sichtbaren
     Schliessknopf mit dem Wort darauf (`fuhre:sommer-zu`), Escape,
     WEITER, den Reiter der STADT und den Wochenwechsel — fuenf Wege
     hinaus. Angemeldet gehoert ein Blatt, das KEINEN hat; das ist die
     Auflage an DAS ERBE, nicht an dieses Stueck.
     ====================================================================== */

  /* ======================================================================
     DIE VERSIEGELUNG — das Ende haelt nicht nur die Uhr an.

     GEMESSEN, WAS OHNE SIE GESCHIEHT (1920x1000, saat=1350, alle vier
     Epochen zu Ende gespielt, Antrag angenommen): auf 'ende' stehen 95 bis
     105 Zuege im DOM, davon 68 bis 80 sichtbar und aktiv. Drei einzelne
     Mausklicks NACH dem Schlussblatt „Die Marke wird verkauft · 1973":

       stadt:bau:waage        −9.570 DM   Buch +1, Chronik +1
       stadt:bau:maelzerei   −14.790 DM   Buch +1, Chronik +1
       gegner:abloesen:muehlwirt −49.900 DM  Buch +1, Chronik +1

     — waehrend daneben das Schlussblatt „In der Lade liegen damit
     167.319 DM" ausweist. Ein Hof, den das Spiel selbst fuer geschlossen
     erklaert, baut eine Waage und loest eine Muehlschenke ab.

     DREI SCHLOESSER, WEIL EINES NICHT REICHT:

       1. Die Knopffabrik des Kerns wird umwickelt. Jeder Knopf, der NACH
          dem Ende entsteht, kommt gesperrt aus ihr heraus — `disabled` ist
          dann wahr und nicht bloss behauptet. Gemessen faengt das 60 bis 73
          von 93 bis 107 Zuegen. Nicht gefangen wird zweierlei: DER GEGNER
          baut 10 bis 13 rohe <button> ohne die Fabrik, und die Ortsmarken
          der STADT (6 bis 7) entstehen vor dem Ende und werden danach nicht
          neu gezeichnet. Fuer beide braucht es Schloss 2 und 3.
       2. Ein Klickhorcher in der Fangphase auf `document` — dieselbe
          Technik, mit der dieses Stueck seit ZUSTAENDIGKEIT 23 den
          WEITER-Klick und die Leertaste liest. Er nimmt jeden Klick weg,
          der nach dem Ende auf einen nicht freigegebenen Zug geht, BEVOR
          der Horcher des fremden Knopfes ihn sieht. Das faengt auch die
          rohen Knoepfe.
       3. `html[data-hof-zu]` als Haken fuer stil/fuhre-zusatz.css. Erst
          damit SIEHT man das Schloss: das Brett wird grau, und
          `pointer-events:none` sorgt dafuer, dass elementFromPoint den
          Knopf nicht mehr trifft.

     WAS OFFEN BLEIBT, UND WARUM. Nach dem Ende darf gelesen werden, nicht
     gehandelt. Offen bleiben deshalb genau die Zuege, die nichts buchen:
     die Reiterleiste der STADT (sonst kaeme man an das eigene Schlussblatt
     nicht zurueck, wenn Escape es beiseitegelegt hat), Chronik und Buch des
     Kerns, der Tonschalter, WEITER (der Kern sperrt ihn selbst) und der
     Wiederanfang. Nachgemessen wird das nicht durch Hinsehen, sondern durch
     Klicken: jeder nach dem Ende noch aktive Knopf wird angeklickt, und
     Kasse, Buch und Chronik duerfen sich um keinen Strich bewegen.

     DAS GEHOERT IN DEN KERN, NICHT HIERHER. Ein Stueck, das die Fabrik des
     Kerns umwickelt und mit seinem Stil fremde Knoepfe grau faerbt, tut
     etwas, das ZUSTAENDIGKEIT 2 ausdruecklich dem Kern zugewiesen hat. Es
     steht hier, weil das Ende dieses Stueck ist und die Auflage heute
     faellig ist. Die Kernbitte steht im Bericht: vier Zeilen in
     kern/buehne.js, dann kann das hier ersatzlos weg.
     ====================================================================== */
  /* Was nach dem Ende noch bedient werden darf. Genau, nicht ungefaehr. */
  /* fuhre:urteil-auf und fuhre:schluss-auf schlagen nur ein Blatt auf und
     buchen nichts. Sie MUESSEN offen bleiben: Escape legt das Urteil
     beiseite, und ohne einen Weg zurueck waere das Ende genau die Sackgasse,
     wegen der ZUSTAENDIGKEIT 23 den Georgi-Deckel abgeschafft hat. */
  var NACH_ENDE_GENAU = ['weiter', 'fuhre:wiederanfang',
    'fuhre:urteil-auf', 'fuhre:schluss-auf',
    'stadt:alles-zuklappen', 'stadt:ortsmarken', 'klang:ton'];
  var NACH_ENDE_ANFANG = ['kern:', 'stadt:reiter:'];

  function darfNachEnde(zug) {
    if (!zug) return false;
    if (NACH_ENDE_GENAU.indexOf(zug) >= 0) return true;
    for (var i = 0; i < NACH_ENDE_ANFANG.length; i++) {
      if (zug.indexOf(NACH_ENDE_ANFANG[i]) === 0) return true;
    }
    return false;
  }

  /* Schloss 1. Einmal im Aufbau umwickelt; die Pruefung steht IM Aufruf,
     damit vor dem Ende nichts anders laeuft als bisher. */
  function versiegleKnopffabrik() {
    if (!B.knopf || B.knopf.hofZu) return;
    var echt = B.knopf;
    var huelle = function (opt) {
      var k = echt.call(B, opt);
      try {
        if (B.welt.zeit.ende && !(opt && opt.nachEnde)
          && !darfNachEnde(k.getAttribute('data-zug'))) {
          k.disabled = true;
          k.setAttribute('aria-disabled', 'true');
          k.setAttribute('data-hof-zu', '1');
        }
      } catch (e) { /* ein Knopf ohne Welt ist immer noch ein Knopf */ }
      return k;
    };
    huelle.hofZu = true;
    B.knopf = huelle;
  }

  /* Schloss 2. Fangphase auf document: laeuft vor jedem Horcher, der am
     Knopf selbst haengt — auch vor denen der rohen Knoepfe des GEGNERS. */
  function endeHorcher(ereignis) {
    if (!B.welt.zeit.ende) return;
    var ziel = ereignis.target && ereignis.target.closest
      ? ereignis.target.closest('[data-zug]') : null;
    if (!ziel) return;
    if (darfNachEnde(ziel.getAttribute('data-zug'))) return;
    ereignis.preventDefault();
    ereignis.stopImmediatePropagation();
  }

  /* Schloss 3. Der Haken fuers Stilblatt. Auf <html>, weil dort schon
     data-epoche des Kerns sitzt und weil die Kopfzeile des Kerns ausserhalb
     von #buehne haengen koennte. */
  function markiereHof() {
    var el = document.documentElement;
    if (!el) return;
    if (B.welt.zeit.ende) el.setAttribute('data-hof-zu', '1');
    else el.removeAttribute('data-hof-zu');
  }

  /* ======================================================================
     DAS SCHLUSSBLATT

     Die Uhr steht. Was hier steht, ist keine Bilanz — es ist eine Chronik:
     wie lange das Haus gebraut hat, wer es gefuehrt hat, wie viele Fuhren
     hinausgegangen sind und wie das Auftragsbuch leer geworden ist. Und der
     Satz, um den es dem Stueck die ganze Zeit ging, steht mit den Zahlen des
     letzten Tages daneben: das Geld war nicht das Problem.

     Das grosse Nachspiel gehoert spaeter DEM ERBE (ZUSTAENDIGKEIT 12). Hier
     steht das Anhalten und ein schlichtes Blatt mit einem Weg von vorn.
     ====================================================================== */
  /* DAS URTEIL ZU EINEM GRUND.

     Die Uhr kennt Endgruende aus drei Stuecken (kern/uhr.js: beende). Wer
     das Ende ausgeloest hat, weiss am besten, was es bedeutet — deshalb
     liegt der eigene Ausgang in Z.ausgang, mit Kopf, Urteil und Folge. Fuer
     jeden fremden Grund steht der Satz in fuhre-daten.js unter
     `ausgaenge.fremd`. Und wenn ein Stueck einen Grund erfindet, den hier
     niemand kennt, wird das gesagt statt verschwiegen: ein leeres Urteil
     waere schlimmer als ein unvollstaendiges. */
  function urteilZu(grund) {
    if (Z.ausgang && Z.ausgang.grund === grund) return Z.ausgang;
    var f = (D.ausgaenge && D.ausgaenge.fremd) || {};
    var t = f[grund];
    if (t) {
      return {
        art: t.art, grund: grund, summe: 0, gut: !!t.gut,
        kopf: ausgangSatz(t.kopf, 0),
        urteil: B.welt.zeit.ende && letzteEndzeile() ? letzteEndzeile() : ausgangSatz(t.kopf, 0),
        folge: ausgangSatz(t.folge, 0)
      };
    }
    return {
      art: 'unbekannt', grund: grund, summe: 0, gut: false,
      kopf: 'Das Brauhaus zum Anker hört auf · ' + B.welt.zeit.jahr,
      urteil: letzteEndzeile() || 'Die Uhr steht still.',
      folge: 'Der Grund heißt „' + grund + '" und ist auf diesem Blatt nicht beschrieben.'
    };
  }

  /* Was das anhaltende Stueck selbst in die Chronik geschrieben hat. Das ist
     das Urteil in seinen eigenen Worten — es wird zitiert, nicht ersetzt. */
  function letzteEndzeile() {
    var c = B.welt.chronik;
    for (var i = c.length - 1; i >= 0; i--) {
      if (c[i].art === 'ende' && c[i].text) return c[i].text;
    }
    return '';
  }

  function sammleSchluss(d) {
    var geliefert = 0, verschenkt = 0;
    B.protokoll.forEach(function (p) {
      if (p.wer === 'spieler' && p.adresse && p.menge) geliefert += p.menge;
    });
    verschenkt = Z.probeGesamt;

    var verloren = [];
    alleHaeuser().forEach(function (a) {
      var w = Z.verloren[a.schluessel];
      if (w) verloren.push({ name: a.name, jahr: w.jahr, fremd: w.fremd });
    });
    verloren.sort(function (x, y) { return x.jahr - y.jahr; });

    /* Die Generationenzeile schliessen: der letzte Name endet heute. */
    var linie = Z.geschlecht.map(function (g) { return { name: g.name, seit: g.seit,
      eigenschaft: g.eigenschaft, bis: 0 }; });
    for (var i = 0; i < linie.length; i++) {
      linie[i].bis = (i + 1 < linie.length) ? linie[i + 1].seit : B.welt.zeit.jahr;
    }

    var grund = (d && d.grund)
      || (B.welt.zeit.jahr >= B.welt.LETZTES_JAHR ? 'gegenwart' : 'unbekannt');
    if (grund === 'unbekannt' && B.welt.zeit.endgrund) grund = B.welt.zeit.endgrund;

    return {
      grund: grund,
      ausgang: urteilZu(grund),
      jahr: B.welt.zeit.jahr,
      woche: B.welt.zeit.woche,
      satz: fristDef().ende,
      wer: fristDef().wer,
      gegruendet: B.welt.haus.gegruendet,
      seit: Z.startJahr,
      jahre: Math.max(1, B.welt.zeit.jahr - Z.startJahr + 1),
      fuhren: Z.fuhren,
      geliefert: geliefert,
      verschenkt: verschenkt,
      zurueck: Z.zurueckGeholt.slice(),
      verloren: verloren,
      kasse: B.welt.haus.kasse,
      keller: keller().length,
      plaetze: B.welt.vorrat.plaetze,
      rohstoff: B.welt.haus.rohstoff,
      linie: linie
    };
  }

  /* Der Wiederanfang: dieselbe Epoche, andere Wuerfel. Ein neues Haus in
     derselben Stadt — mehr verspricht dieses Blatt nicht. */
  function neuesSpiel() {
    var teile = [];
    var roh = B.arg.roh || {};
    for (var k in roh) {
      if (!Object.prototype.hasOwnProperty.call(roh, k)) continue;
      if (k === 'saat' || k === 'jahr' || k === 'woche') continue;
      teile.push(encodeURIComponent(k) + '=' + encodeURIComponent(roh[k]));
    }
    teile.push('saat=' + (1350 + Math.floor(Math.random() * 9000)));
    window.location.search = '?' + teile.join('&');
  }

  function zeichneSchluss(fach) {
    /* DER GRIFF ZUM URTEIL.

       Gemessen und dabei gefunden: Escape legte das Schlussblatt beiseite,
       und damit war es weg — kein Blatt, also auch kein Reiter in der
       Platzordnung der STADT, also kein Weg zurueck. Das war schon vor der
       Versiegelung so und faellt erst mit ihr auf, weil daneben nun nichts
       anderes mehr zu tun ist. Ein Ende, das man einmal wegdrueckt und nie
       wiederfindet, ist kein Ende, sondern ein Verlust.

       Der Griff haengt darum nicht im Brett DIE HAEUSER (das die
       Platzordnung zuklappt), sondern frei auf der Blattebene. */
    if (B.welt.zeit.ende && Z.schluss && !Z.schlussOffen) {
      /* Die Mitte wird am UMSCHLAG gerechnet, nicht am Knopf. grund.css legt
         `.knopf:active` die eigene Eigenschaft `translate` auf — genau die,
         mit der man sonst zentriert. Beides am selben Knopf heisst: er
         springt beim Niederdruecken um seine halbe Breite weg, die Maus geht
         daneben, und der Klick landet als „DIV.ebene" im Nichts. Gemessen
         mit mousedown/mouseup/click getrennt; genau so war es. */
      var griff = B.el('div', 'fu-urteilgriff');
      griff.appendChild(B.knopf({
        text: 'Das Urteil über diese Partie', zug: 'fuhre:urteil-auf', klasse: 'gross',
        titel: 'Wie das Haus geendet ist, wer es geführt hat, wie das Auftragsbuch '
             + 'leer wurde — und der Weg von vorn.',
        tu: function () { Z.schlussOffen = true; B.sende('zeichne', { grund: 'fuhre-urteil-auf' }); }
      }));
      fach.appendChild(griff);
    }
    if (!schlussLiegtOben()) return;
    var s = Z.schluss;

    /* Auch hier kein Deckel mehr. Aus demselben Grund wie bei Georgi: er
       ueberlebt sein eigenes Blatt, wenn die Platzordnung der STADT es
       wegklappt — und dann liegt ein schwarzes Fenster ueber dem Hof, in dem
       kein einziger Knopf steht, auch nicht der Wiederanfang. Die Uhr steht
       an dieser Stelle ohnehin (kern/uhr.js: z.ende sperrt WEITER); ein
       zweites Schloss vor einer verschlossenen Tuer ist keines. */
    /* DAS URTEIL, und wie es sich von einem Beiblatt unterscheidet.

       Auf 'ende' malt jedes Stueck sein eigenes Schlussblatt (ZUSTAENDIGKEIT
       12). Das ist richtig fuer die Rechenschaft eines Stuecks ueber SEINE
       Sache — das Sudbuch ueber die Pfanne — und falsch fuer das Urteil ueber
       die PARTIE, denn davon kann es nur eines geben. BEFUND-ENDE.md §1 hat
       genau das gemessen: der Spieler sah die Buchhaltung eines Stuecks statt
       des Urteils.

       Also traegt dieses Blatt es aus, fuer jeden Endgrund, auch fuer die,
       die andere Stuecke ausloesen (urteilZu). data-urteil ist die Marke, an
       der ein Beiblatt erkennt, dass das Urteil schon geschrieben ist und es
       zuruecktreten kann; DER SUD tut das seit Runde 3 von selbst, und in der
       Klassenliste steht `schluss` als zweites Erkennungszeichen fuer den,
       der data-urteil nicht kennt. */
    var a = s.ausgang || urteilZu(s.grund);
    var gut = !!(a.gut || a.art === 'gegenwart' || a.art === 'uebergeben');

    var bl = B.el('div', {
      klasse: 'blatt fu-schlussblatt fu-ende-' + (a.art || 'unbekannt') + (gut ? ' fu-ende-gut' : ''),
      daten: { frei: '1', urteil: '1', reiter: 'Das Ende des Hauses' }
    });
    bl.setAttribute('role', 'dialog');
    bl.setAttribute('aria-modal', 'true');
    bl.setAttribute('aria-label', 'Das Ende des Hauses ' + s.jahr);

    bl.appendChild(B.el('h2', null, a.kopf));
    bl.appendChild(B.el('div', 'fu-satz', a.urteil));
    bl.appendChild(B.el('div', 'fu-ende-folge', a.folge));
    if (a.summe > 0) {
      bl.appendChild(B.el('div', 'fu-ende-summe',
        'Ausgezahlt: ' + B.welt.geld(a.summe) + '. In der Lade liegen damit '
        + B.welt.geld(s.kasse) + '.'));
    }

    /* DER SATZ, UM DEN ES GING. Er steht hier mit den Zahlen des letzten
       Tages, damit ihn niemand fuer eine Behauptung halten muss. */
    if (!gut) {
      var stand = B.welt.menge(s.keller) + ' von ' + B.welt.menge(s.plaetze) + ' lagen im Keller, '
        + B.zahl(s.rohstoff) + ' ' + (B.welt.epoche().rohstoff || 'Rohstoff') + ' in der Kammer.';
      bl.appendChild(B.el('div', 'fu-schluss-these', s.kasse > 0
        ? 'Nicht die leere Kasse hat das Haus zugemacht. Am letzten Tag lagen '
          + B.welt.geld(s.kasse) + ' in der Lade, ' + stand
          + ' Was fehlte, war die Adresse, die das Fass abnimmt.'
        : 'Die Lade war leer — ' + B.welt.geld(s.kasse) + ' — und das war nie der Grund. '
          + 'Mit leerer Lade hat dieses Haus jahrelang weitergebraut: auf Kerbe, auf den '
          + 'zweiten Guss, auf zurückverkaufte Vorräte. ' + stand
          + ' Gestorben ist es an der Adresse, die fehlte, nicht am Geld.'));
    }

    var z = B.el('div', 'fu-schluss-zahlen');
    function zeile(was, wert) {
      var r = B.el('div', 'fu-schlusszeile');
      r.appendChild(B.el('span', 'w', was));
      r.appendChild(B.el('span', 'v', wert));
      z.appendChild(r);
    }
    zeile('Gegründet', String(s.gegruendet));
    zeile('Gespielt', s.seit + ' bis ' + s.jahr + ' · ' + s.jahre
      + (s.jahre === 1 ? ' Braujahr' : ' Braujahre'));
    zeile('Fuhren hinausgeschickt', B.zahl(s.fuhren));
    zeile('Ausgeliefert', B.welt.menge(s.geliefert));
    zeile('Ohne Rechnung hergegeben', B.welt.menge(s.verschenkt));
    zeile('Adressen zurückgeholt', B.zahl(s.zurueck.length));
    bl.appendChild(z);

    /* DIE GENERATIONENZEILE. Das Haus bleibt, der Mensch nicht. */
    if (s.linie.length) {
      var g = B.el('div', 'fu-geschlecht');
      g.appendChild(B.el('b', null, 'DIE, DIE ES GEFÜHRT HABEN'));
      s.linie.forEach(function (p) {
        var r = B.el('div', 'fu-gen');
        r.appendChild(B.el('span', 'j', p.seit + '–' + p.bis));
        r.appendChild(B.el('span', 'n', p.name));
        r.appendChild(B.el('span', 'e', p.eigenschaft || ''));
        g.appendChild(r);
      });
      bl.appendChild(g);
    }

    if (s.verloren.length) {
      var vl = B.el('div', 'fu-verlust');
      vl.appendChild(B.el('b', null, 'WIE DAS AUFTRAGSBUCH LEER WURDE'));
      s.verloren.forEach(function (v) {
        vl.appendChild(B.el('div', null, v.jahr + '   ' + v.name + ' — '
          + (v.fremd ? 'der Gegner stand schon da' : 'niemand hat sie genommen')));
      });
      bl.appendChild(vl);
    }

    if (s.zurueck.length) {
      var zg = B.el('div', 'fu-verlust fu-zurueckliste');
      zg.appendChild(B.el('b', null, 'UND WER ZURÜCKKAM'));
      s.zurueck.forEach(function (v) {
        zg.appendChild(B.el('div', null, v.jahr + '   ' + v.name + ' — '
          + (v.wie === 'neuer' ? 'hat von selbst wieder angefragt'
                               : 'zurückgeholt, ohne einen Pfennig')));
      });
      bl.appendChild(zg);
    }

    var fuss = B.el('div', 'fu-sommer-fuss');
    fuss.appendChild(B.knopf({
      text: 'Von vorn anfangen — dieselbe Stadt, andere Würfel',
      zug: 'fuhre:wiederanfang', klasse: 'gross',
      titel: 'Ein neues Haus in derselben Stadt. Die Chronik dieses Hauses bleibt, '
           + 'bis das Fenster geschlossen wird.',
      tu: neuesSpiel
    }));
    fuss.appendChild(B.el('div', 'fu-sommer-hinweis',
      'Escape legt das Blatt beiseite — der Hof bleibt zu sehen, aber die Woche läuft nicht mehr.'));
    /* DAS SIEGEL, in Worten. Ohne diesen Satz sieht der Spieler nur ein
       graues Brett und haelt es fuer einen Fehler. Mit ihm liest er, dass
       das Grau die Aussage ist. */
    fuss.appendChild(B.el('div', 'fu-schluss-siegel',
      'DER HOF IST GESCHLOSSEN. Von hier an bucht kein Knopf mehr — kein Bau, keine '
      + 'Ablösung, kein Versatz. Was offen bleibt, ist zum Lesen: die Reiter der Bretter, '
      + 'die Chronik und das Buch.'));
    bl.appendChild(fuss);

    fach.appendChild(bl);
  }

  /* ======================================================================
     ANMELDUNG
     ====================================================================== */
  BRAUHAUS.stueck('fuhre', {

    aufbau: function () {
      B.ton.melde('sud:pfanne', { art: 'geraeusch', sagt: 'Offene Pfanne, Holzfeuer, Rührscheit.' });
      B.ton.melde('fuhre:fass-rollen', { art: 'geraeusch', sagt: 'Ein Fass rollt über Kopfsteinpflaster.' });
      B.ton.melde('fuhre:abfahrt:ochse', { art: 'geraeusch', sagt: 'Ochsengespann, Holzräder, Peitsche.' });
      B.ton.melde('fuhre:abfahrt:pferd', { art: 'geraeusch', sagt: 'Zwei Pferde, Eisenreifen, Torbogen.' });
      B.ton.melde('fuhre:abfahrt:waggon', { art: 'geraeusch', sagt: 'Rangieren, Puffer, Dampf an der Rampe.' });
      B.ton.melde('fuhre:abfahrt:lastzug', { art: 'geraeusch', sagt: 'Diesel, Luftbremse, Kästen auf Rollen.' });
      B.ton.melde('tafel:kreide', { art: 'geraeusch', sagt: 'Kreide auf Schiefer.' });
      B.ton.melde('sommer:keller-leer', { art: 'schleife', sagt: 'Tropfen im leeren Gewölbe, Fliegen.' });
      B.ton.melde('fuhre:siegel', { art: 'geraeusch', sagt: 'Siegelwachs, Papier, Ratsstube.' });
      B.ton.melde('fuhre:kerbe', { art: 'geraeusch', sagt: 'Ein Messer schneidet eine Kerbe in Holz.' });
      B.ton.melde('fuhre:kauf', { art: 'geraeusch', sagt: 'Münzen auf einen Ladentisch.' });

      B.ton.melde('fuhre:probe', { art: 'geraeusch', sagt: 'Ein Zapfhahn wird eingeschlagen, Bier läuft in einen Krug.' });

      /* Fangphase: laeuft vor dem Tastenhorcher des Kerns. Siehe tastenSperre. */
      document.addEventListener('keydown', tastenSperre, true);
      /* Fangphase: laeuft vor dem Klickhorcher am WEITER-Knopf selbst.
         Siehe weiterHorcher — ZUSTAENDIGKEIT 23. */
      document.addEventListener('click', weiterHorcher, true);
      /* Fangphase, damit dieses Stueck sein Blatt weggenommen hat, bevor die
         Platzordnung der STADT ihren eigenen Klick verarbeitet. R14. */
      document.addEventListener('click', reiterHorcher, true);
      /* Blasenphase: NACH dem Horcher des Kerns am Knopf selbst. */
      document.addEventListener('click', anfangHorcher, false);
      /* DIE VERSIEGELUNG, Schloss 1 und 2. Der Horcher steht VOR
         weiterHorcher in der Wirkung: er laeuft spaeter, greift aber nur
         nach dem Ende, und 'weiter' ist dann ohnehin freigegeben. */
      versiegleKnopffabrik();
      document.addEventListener('click', endeHorcher, true);

      richteEpocheEin(true);

      /* Der Anfang der Chronik, die auf dem Schlussblatt steht. */
      Z.startJahr = B.welt.zeit.jahr;
      if (B.welt.zeit.amtszeit) {
        Z.geschlecht.push({ name: B.welt.zeit.amtszeit.name, seit: B.welt.zeit.amtszeit.seit,
          eigenschaft: B.welt.zeit.amtszeit.eigenschaftName });
      }

      /* Die Reihe der letzten drei Jahre auf das Mengenmass dieser Epoche
         bringen — sonst stuende 1884 eine Reihe in Fass neben einem Bedarf
         in Hektoliter, und der Kritiker koennte nichts vergleichen. */
      var mf = ep().mengenfaktor;
      B.welt.adressen.forEach(function (a) {
        if (mf !== 1) a.reihe = a.reihe.map(function (r) { return Math.round(r * mf); });
        /* Durst zum Anfang: die Woche 1 ist keine leere Buehne. */
        Z.durst[a.schluessel] = wochenbedarf(a) * (1 + B.wuerfel.zahl() * 4);
        Z.leer[a.schluessel] = B.wuerfel.ganz(0, 4);
        /* Wer schon lange mager ist, hat schon Kerben — sonst kann in fünf
           Jahren keine Adresse verlorengehen. */
        var soll = jahresbedarf(a) * 0.30, m = 0;
        for (var i = a.reihe.length - 1; i >= 0; i--) { if (a.reihe[i] < soll) m++; else break; }
        Z.mahnung[a.schluessel] = Math.min(1, m);
      });
      /* Genau EINE Adresse steht schon auf der Kippe: die mit der schwächsten
         Reihe. So sieht der Kritiker den Verlust zwei Jahre vorher kommen,
         statt in einem Jahr sechs Häuser auf einmal zu verlieren. */
      var kandidaten = B.welt.adressen.filter(function (a) { return Z.mahnung[a.schluessel] > 0; });
      if (kandidaten.length) {
        var schwaechste = kandidaten[0];
        kandidaten.forEach(function (a) {
          if (a.reihe[2] / Math.max(1, jahresbedarf(a))
            < schwaechste.reihe[2] / Math.max(1, jahresbedarf(schwaechste))) schwaechste = a;
        });
        Z.mahnung[schwaechste.schluessel] = 2;
      }
      durstWaechst();
      schreibeZettel();
    },

    woche: function () {
      /* Die Georgi-Tafel gehoert dem Jahreswechsel und keiner zweiten Woche.
         Ist die Woche trotzdem weitergelaufen — weil die Tafel gar nicht im
         Bild lag und deshalb niemanden aufhalten durfte —, wird sie hier
         beiseitegelegt. So kann kein Blatt liegenbleiben, das der Spieler
         nie gesehen hat. */
      Z.sommerOffen = false;
      Z.berichtOffen = false;
      if (Z.epoche !== B.welt.zeit.epoche) richteEpocheEin(false);
      Z.meldung = null;

      /* MICHAELI IST EIN MOMENT IM JAHR, KEIN DAUERZUSTAND (ZUSTAENDIGKEIT 5).

         Das Uebergabeblatt lag bisher, bis es beantwortet wurde — gemessen
         120 von 270 Wochen in E1. Ein Blatt, das ein Viertel der Buehne nimmt
         und vier Jahre liegenbleibt, ist kein Angebot mehr, sondern Moebel;
         es hat auf der sorgfaeltig gespielten Linie die eigene Anschlagtafel
         des Stuecks dauerhaft in den Reiter gedrueckt. Also laeuft es aus.
         Weggenommen wird es OHNE `uebergabeNein` — wer nicht antwortet, hat
         nicht abgelehnt, und zum naechsten Michaeli liegt es wieder da. */
      if (Z.uebergabe) {
        Z.uebergabe.frist = (Z.uebergabe.frist === undefined
          ? UEBERGABE_WOCHEN : Z.uebergabe.frist) - 1;
        if (Z.uebergabe.frist <= 0) Z.uebergabe = null;
      }
      umlaufZurueck();
      eisErnte();
      braue();
      eisZehrt();
      durstWaechst();
      schreibeZettel();

      /* DIE LÖHNE HÄNGEN AN DER PFANNE, DIE ERHALTUNG NICHT.

         Bis zum 2. August 2026 stand hier eine einzige Wochenzahl: 110 Mark
         in 1884, ob sechzehn Sude liefen oder keiner. Das ist der Posten,
         an dem das Haus in 1884 gestorben ist — 3.190 Mark im Jahr gegen
         4.100 Mark Einnahmen, und er ruehrte sich nicht, als der Betrieb
         schrumpfte (spiel/BEFUND-WIRTSCHAFT.md §3). Historisch ist er zwei
         verschiedene Dinge: der Braumeister, das Dach, das Geschirr und der
         Zins auf das Geraet laufen weiter, wenn die Pfanne kalt bleibt —
         die Braugesellen, die Knechte und das Futter des Zugtiers werden
         fuer den SUDTAG gedungen. Wer nicht braut, dingt nicht.

         Damit hat ein schrumpfendes Haus einen Weg zurueck, und ein
         wachsendes wird teurer, ohne dass an einer Zahl gedreht wurde. */
      var e = ep();
      var fest = laufPreis((e.unterhalt || 1) + Z.unterhaltExtra);
      var lohn = laufPreis((e.lohnSud || 0) * Z.sudeWoche);
      Z.lohnWoche = lohn;
      if (fest > 0) {
        B.welt.zahle(fest, e.unterhaltName || 'Erhaltung, Geschirr, Wache', 'spieler');
      }
      if (lohn > 0) {
        B.welt.zahle(lohn, (e.lohnName || 'Löhne und Futter') + ' · '
          + Z.sudeWoche + (Z.sudeWoche === 1 ? ' Sudtag' : ' Sudtage'), 'spieler');
      }

      /* Zuletzt: nimmt ueberhaupt noch jemand ab? Die Frist laeuft hier und
         nirgends sonst — sie ist eine Woche, keine Zeichnung. */
      pruefeAuftragsbuch();
    },

    jahr: function () {
      var e = ep();
      /* Was der Glaeubiger sich zu Georgi genommen hat, fehlt jetzt — nicht
         in der Kasse, sondern an Brautagen bzw. Suden der Reihe. */
      Z.budget = e.budget ? Math.max(4, e.budget.start - (Z.kerbAbzug || 0)) : 0;
      Z.kerbAbzug = 0;
      Z.kaufNr.budget = 0;
      Z.ladung = [];
      Z.vorige = null;
      Z.jahrUmsatz = 0;
      Z.abgabeJahr = 0;
      Z.verladenVorjahr = Z.verladen;
      Z.verladen = 0;

      /* DIE WAGENSTELLUNG WIRD ZU MICHAELI NEU VEREINBART.
         Der Quelltext von `passendeFracht` sagt das seit Runde 3 selbst —
         „einmal im Jahr, zu Michaeli" —, gestellt wurde sie aber nur ein
         einziges Mal, beim Einrichten der Epoche. Deshalb fuhr das Haus von
         1884 bis 1889 den Halben Wagen weiter, auch als es nur noch zwei
         Adressen mit vier Hektoliter bediente: gemessen 3.667 Mark Fuhrlohn
         gegen 3.521 Mark Einnahmen im ganzen Jahr. Wer weniger absetzt,
         bestellt kleiner — das ist keine Milde, das ist eine Bestellung.
         Waehrend des Jahres bleibt die Stufe die Wahl des Spielers. */
      if (e.fracht) {
        var neueStufe = passendeFracht();
        if (neueStufe !== Z.fracht) {
          var alt = frachtstufe();
          Z.fracht = neueStufe;
          var neu = frachtstufe();
          if (alt && neu) {
            B.welt.schreibe('Die Wagenstellung für ' + B.uhr.braujahr() + ' ist vereinbart: '
              + neu.name + ' statt ' + alt.name + ' — ' + neu.satz, 'fuhre');
          }
        }
      }

      /* MICHAELI: DIE TAFEL WIRD NEU ANGESCHRIEBEN. Ein Brauhaus faengt das
         Braujahr nicht mit einer leeren Wand an — der Braumeister schreibt
         an, was voriges Jahr dort stand, und der Spieler aendert es. */
      if (Z.planVorjahr) {
        var etwas = false;
        for (var vk in Z.planVorjahr) {
          if (Z.planVorjahr[vk] && sorteVon(vk)) { Z.plan[vk] = Z.planVorjahr[vk]; etwas = true; }
        }
        if (etwas) {
          Z.tafelGewischt = false;
          B.welt.schreibe('Michaeli. Die Tafel am Sudhaus wird neu angeschrieben: '
            + sorten().filter(function (x) { return Z.plan[x.k]; })
                .map(function (x) { return Z.plan[x.k] + '× ' + x.name; }).join(' · ')
            + ' — wie im vorigen Jahr, bis jemand es ändert.', 'fuhre');
        }
      }
      Z.notGesamt = 0;
      Z.notsud = 0;
      Z.notGemeldet = false;
      Z.sommerOffen = !!Z.sommer;
      /* Jedes Georgi faengt mit dem Anschlag an, nicht mit dem Bericht. */
      Z.berichtOffen = false;
      /* Listungen laufen zu Georgi aus, wenn nichts geliefert wurde. */
      /* Ein Regalmeter fällt, wenn zwei Jahre lang nichts darin stand.
         Ein leeres Jahr verzeiht der Händler noch. */
      if (e.listung) {
        var gel = jahresLieferung();
        for (var k in Z.listung) {
          if (gel[k]) { Z.listungLeer[k] = 0; continue; }
          Z.listungLeer[k] = (Z.listungLeer[k] || 0) + 1;
          if (Z.listungLeer[k] >= 2) {
            delete Z.listung[k];
            delete Z.listungLeer[k];
            var ad = B.welt.adresse(k);
            B.welt.protokolliere({ wer: 'verfall', preis: 0, adresse: k,
              was: (ad ? ad.name : k) + ': Listung gefallen, das Regal ist neu belegt' });
          }
        }
      }
      durstWaechst();
      schreibeZettel();
      /* Die Georgi-Woche ist auch eine Woche: sonst stuende die Frist am
         Jahreswechsel still, ohne dass jemand etwas dafuer getan haette. */
      pruefeAuftragsbuch();
      /* Und der Michaelitag ist der Tag, an dem ein Haus uebergeben wird.
         Nach der Abrechnung, damit die Kasse die des neuen Jahres ist. */
      pruefeUebergabe();
    },

    epoche: function () {
      richteEpocheEin(false);
      normalisiereKeller();
    },

    /* Das Haus bleibt, der Mensch nicht — hier wird die Zeile mitgeschrieben,
       die spaeter auf dem Schlussblatt steht. */
    erbfall: function (d) {
      if (!d || !d.amtszeit) return;
      Z.geschlecht.push({ name: d.amtszeit.name, seit: d.amtszeit.seit,
        eigenschaft: d.amtszeit.eigenschaftName });
    },

    zeichne: function () {
      var fach = B.ebene('hand', 'fuhre');
      B.leere(fach);
      zeichneMarken(fach);
      zeichneHaeuser(fach);
      zeichneTafel(fach);
      zeichneKeller(fach);
      zeichneWagen(fach);
      zeichneWoche(fach);

      markiereHof();

      var blatt = B.ebene('blatt', 'fuhre');
      B.leere(blatt);
      zeichneSchluss(blatt);
      zeichneAntrag(blatt);
      zeichneUebergabe(blatt);
      legeSommer(blatt);

      meldeZug();
      meldeZiel();
    }
  });

  /* DAS ENDE. Der Kern hat die Uhr angehalten (ZUSTAENDIGKEIT 12) — dieses
     Stueck malt daraufhin sein eigenes Schlussblatt und weiss nicht, was die
     anderen drei tun. Zweimal gerufen wird nichts ueberschrieben. */
  B.auf('ende', function (d) {
    if (Z.schluss) return;
    B.wage('fuhre.schluss', function () {
      Z.schluss = sammleSchluss(d);
      /* AUFGESCHLAGEN WIRD IMMER — das ist die Aenderung aus BEFUND-ENDE §1.

         Vorher stand hier `Z.schlussOffen = Z.schluss.grund === 'keine-abnehmer'`:
         das Blatt schlug nur bei DEM Ende auf, das dieses Stueck selbst
         ausgeloest hatte. Bei jedem fremden Grund — kalte Pfanne, leerer Hof,
         Gegenwart — blieb es zu, und der Spieler las die Rechenschaft eines
         Stuecks ueber sich selbst. Ein Urteil, das nur ueber die eigenen
         Faelle spricht, ist kein Urteil. urteilZu() hat fuer jeden Grund
         einen Satz, also wird es fuer jeden Grund aufgeschlagen. */
      Z.schlussOffen = true;
      Z.sommerOffen = false;
      Z.berichtOffen = false;
      Z.antrag = null;
      Z.uebergabe = null;
      Z.ladung = [];
      /* Sofort, nicht erst beim naechsten Bildlauf: zwischen 'ende' und dem
         Zeichnen liegt ein Bildaufbau, in dem sonst noch alles klickbar
         waere. Siehe DIE VERSIEGELUNG. */
      markiereHof();
    });
  });

  /* Der Wagen bleibt nicht ueber die Woche stehen: was nicht abgeschickt
     wurde, bleibt im Keller. Laeuft VOR dem Verfall, damit keine Ladung auf
     ein verdorbenes Fass zeigt. */
  B.auf('vorwoche', function () { Z.ladung = []; });

  /* Georgi. Vor der Abrechnung des Kerns, damit der Sommerabsatz noch in
     die Reihe DIESES Braujahres faellt. */
  B.auf('jahresende', function () {
    B.wage('fuhre.sommer', function () {
      /* ZUERST DER UMGANG, DANN DIE FORDERUNGEN. Das ist keine Buchhaltung,
         das ist die Reihenfolge des Tages: erst geht der Knecht mit dem Holz
         die Runde, dann kommen Glaeubiger und Rat. Wer es andersherum
         aufschreibt, bekommt genau den Michaelitag, den STAND.md §2 gemessen
         hat: −7 Pfennig und fuenf graue Karten. */
      Z.georgiEin = 0;
      Z.georgiAus = 0;
      zahltag();
      sommerLaeuft();
      mahnenUndVerlieren();
      /* Erst vergisst der Wirt, dann fragt vielleicht ein neuer an. In dieser
         Reihenfolge, damit ein zurueckgeholtes Haus nicht im selben Atemzug
         sein Zutrauen verliert. */
      probeVerblasst();
      neuerWirtFragt();
      if (Z.sommer) Z.sommer.verloren = verlorenJetzt.slice();
      wischeTafel();
    });
  });

  /* Fuer den Kritiker: BRAUHAUS.fuhre.stand() in der Konsole. */
  B.fuhre = {
    stand: function () {
      return {
        fuhren: Z.fuhren, budget: Z.budget, faesser: Z.faesser, draussen: Z.draussen,
        eis: Z.eis, keller: keller().length, reif: freieFaesser().length,
        kerben: Z.kerben, kerbFrei: kerbFrei(), notsud: Z.notsud, notGesamt: Z.notGesamt,
        notsorte: notSorte() ? notSorte().name : null,
        frist: Z.frist, fristWochen: fristDef().wochen,
        probe: Object.keys(Z.probe).map(function (k) { return k + ':' + Z.probe[k].zutrauen; }),
        probeGesamt: Z.probeGesamt,
        zurueckGeholt: Z.zurueckGeholt.map(function (v) { return v.name + ' ' + v.jahr + ' (' + v.wie + ')'; }),
        ende: B.welt.zeit.ende ? (B.welt.zeit.endgrund || 'ende') : null,
        /* DER AUSGANG — was der Kritiker zaehlen koennen muss, ohne
           Quelltext zu lesen: steht ein Antrag im Bild, was ist er wert,
           wurde er schon entschieden, und liegt die Uebergabe an. */
        antrag: Z.antrag ? Z.antrag.summe : null,
        antragErledigt: Z.antragErledigt,
        antragWert: antragSumme(),
        uebergabe: Z.uebergabe ? Z.uebergabe.jahr : null,
        ausgang: Z.ausgang ? Z.ausgang.grund : null,
        durst: Object.keys(Z.durst).map(function (k) { return k + ':' + Math.round(Z.durst[k]); }),
        mahnung: Z.mahnung, verloren: Object.keys(Z.verloren)
      };
    }
  };

})(BRAUHAUS);
